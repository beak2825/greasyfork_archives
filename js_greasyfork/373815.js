// ==UserScript==
// @name         Scam Site Blocker
// @namespace    blockWinScamSites
// @version      8.1
// @description  Block potential tech support scam popups and redirects
// @author       Kai Krause <kaikrause95@gmail.com>
// @include      *
// @match        *
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373815/Scam%20Site%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/373815/Scam%20Site%20Blocker.meta.js
// ==/UserScript==

// ---------------------
// AUTOFILL URL REPORTING
// ---------------------

if (location.hostname.toLowerCase().startsWith("safebrowsing.google.") && location.href.includes("/safebrowsing")) {
	window.addEventListener("DOMContentLoaded", function load() {
		let badUrl = new URL (location.href).searchParams.get("website");
		if (!badUrl) return;

		badUrl = decodeURIComponent(badUrl);
		document.getElementById("url").value = badUrl;
		document.getElementById("falseneg").checked = true;

		let textareas = document.getElementsByTagName("textarea");
		for (let i = 0; i < textareas.length; i++) {
			if (textareas[i].name && textareas[i].name === "dq") {
				textareas[i].value = "Possible scam website that compels visitors to call a number, and make a payment in order to unblock their computer";
				break;
			}
		}
	}, false);
}

// ---------------------
// PRE-RUN
// ---------------------

// do not run on these excluded websites
let exclusions = ["s3.amazonaws.com", "microsoft.com", "apple.com", "github.com", "greasyfork.org", "wikipedia.org", "reddit.com", "google.com", "live.com", "mozilla.org", "youtube.com", "facebook.com", "twitter.com", "mcafee.com", "mcafeesecure.com", "mcafeemobilesecurity.com", "norton.com", "avg.com", "avast.com", "avira.com", "instagram.com", "kaspersky.com", "bitdefender.com", "malwarebytes.com", "sophos.com", "comodo.com", "av-test.org", "forbes.com", "howtogeek.com", "pcworld.com", "pandasecurity.com", "eset.com", "f-secure.com", "clamwin.com", "360totalsecurity.com", "washingtonpost.com", "techspot.com", "vice.com", "theverge.com", "nytimes.com", "bloomberg.com", "discordapp.com", "skype.com", "outlook.com", "gmail.com", "theguardian.com", "bleepingcomputer.com", "malwaretips.com", "wired.co.uk", "zippyshare.com", "twitch.tv", "imasdk.googleapis.com", "imgur.com", "gfycat.com", "embedly.com", "openload.co"];

for (let i = 0; i < exclusions.length; i++) {
	if (location.hostname.toLowerCase().endsWith(exclusions[i])) return;
}

// ---------------------
// PREVENT TROUBLESOME
// JS BEFORE DETECTION
// ---------------------

const print = window.print;
unsafeWindow.print = null;

function restoreWindowJS() {
	unsafeWindow.print = print;
}

// ---------------------
// HELPER FUNCTIONS
// ---------------------

// Time since the page has started to load
let timer = Date.now();
// Helper function to understand elapsed time
function elapsedTime(timer, num) {
	let currentTime = Date.now();
	let difference = (currentTime - timer) / 1000;
	if (difference > num) {
		return true;
	}
	else {
		return false;
	}
}

// Helper function to inject JS code into the page, for page-level access to JS functions and variables
let injectCode = function(f) {
	let script = document.createElement("script");
	script.textContent = "(" + f.toString() + "());";
	document.head.appendChild(script);
};

// ---------------------
// MAIN CODE
// ---------------------

// Whether to block the page
let shouldBlockPage = false;
if (GM_getValue(location.hostname) && GM_getValue(location.hostname) === "blocked") shouldBlockPage = true;

// If the page hasn't been blocked, use flags until a decision is made
let redFlags = 0; // definite detections
let yellowFlags = 0; // suspicious detections - become red flags once a red flag is detected

let reasonsToBlock = [];

function main() {
	if (shouldBlockPage) return;

	redFlags = 0;
	reasonsToBlock = [];

	// Block based on "definitely" bad URL terms
	let badUrlTerms = ["call-now1", "call-now2", "firiedge", "ffiedge", "/processdll/", "jook.html", "chr-win-error", "Call-for-SecurityCH-Issues18", "AFUK1404", "systemerror-win-chx", "Call-Windows-Support_IEDGE", "/systemerror-ie-edge/", "XXCall-Windows-Support_IEDGE", "/uyeyeefacsfadafghfgdiedge/", "0CHfdfdfdfddfd99900MK9", "0FIfdfdfdfddfd99900MK9", "0EDfdfdfdfddfd99900MK9", "0MAfdfdfdfddfd99900MK9", "IEfdfdfdfddfd99900MK9", "CN0101010101help", "MNEddjfdsjfhjdhfhjdf7xT", "XMCdhdsbfhgdfhdgf7xe", "Win_helpline100101.hbv", "W898998_99980.nuy", "cedge00001", "EDfdfdfdfd100110dfSSY", "OMED01010101010X0NV", "XEDdhdsbfhgdfhdgf7TLx", "DF10010011010ED7V", "XMCdhdsbfhgdfhdgf7SA", "CHfdfdfdfd100110dfRS", "xxx-virsedge-er-999-zzz", "Ed10010110xyJP", "0EDhdfgdsjfkjsdhfjksdhNN1", "/TChsfsdfjdsfjdsfjVX/", "/0EDfdfdfdfddfd99900V/", "/werrx01USAHTML/", "/WHkFeaR2U/", "?pnoorg=", "?aniph="];
	for (let i = 0; i < badUrlTerms.length; i++) {
		if (location.href.toLowerCase().includes(badUrlTerms[i].toLowerCase())) {
			reasonsToBlock.push("Blocked by URL keyword: " + badUrlTerms[i])
			return shouldBlockPage = true;
		}
	}

	// Safe keywords to lower false positives
	let safeKeywords = ["review", "scam"];

	// Products and keywords that are normally used in headers
	let products = ["microsoft", "windows", "apple", "mac", "chrome", "firefox", "android", "ios", "internet explorer", "mcafee", "norton", "itunes"];
	let badKeywords = ["error", "security", "warning", "warnung", "official", "support", "hotline", "virus", "infected", "infection", "infetto", "blocked", "alert", "notification", "antivirus", "activation", "supportwarnung"];

	// Get the page's title
	let title = document.title.toLowerCase();
	let titleWords = title.split(" ");

	// Loop whether a product and badKeywords exist together
	// Only perform this check if the title length is under a certain number of words, to prevent news articles and other website false positives
	if (titleWords.length <= 5) {
		for (let i = 0; i < products.length; i++) {
			// ignore possible false positives
			let shouldContinue = true;
			for (let y = 0; y < safeKeywords.length; y++) {
				if (title.includes(safeKeywords[y])) {
					shouldContinue = false;
					break;
				}
			}
			if (!shouldContinue) continue;

			if (title.includes(products[i].toLowerCase())) {
				for (let x = 0; x < badKeywords.length; x++) {
					if (title.includes(badKeywords[x].toLowerCase())) {
						reasonsToBlock.push("Blocked by title keyword: " + badKeywords[x]);
						return shouldBlockPage = true;
					}
				}
			}
		}
	}

	// If the site address or page title is related to a product, flag it
	for (let i = 0; i < products.length; i++) {
		if (location.hostname.includes(products[i].toLowerCase())) {
			//console.log("Site address or page title is related to a product and flagged");
			reasonsToBlock.push("Red Flag Detected - " + "Site Address/Page Title has term: " + products[i]);
			redFlags++;
		}
	}

	// after a second, if the title hasn't updated, flag it
	if (elapsedTime(timer, 1)) {
		if (title === location.hostname || title === "") {
			//console.log("Empty hostname or title flagged");
			reasonsToBlock.push("Red Flag Detected - " + "Page Title is URL or is empty");
			redFlags += 0.5;
		}
	}

	// flag IP addresses that do not resolve to domain names
	if (location.hostname.match(/\d+\.\d+\.\d+\.\d+/)) {
		//console.log("Hostname flagged");
		reasonsToBlock.push("Red Flag Detected - " + "URL is an IP address");
		redFlags++;
	}

	// flag bad (free) website hosts
	let badHosts = ["000webhost", "googleapi", "cloudfront", "amazonaws", "azurewebsites", "elasticbeanstalk", ".web.core.windows.net", ".pages.dev", ".ondigitalocean.app"];
	for (let i = 0; i < badHosts.length; i++) {
		if (location.hostname.toLowerCase().includes(badHosts[i].toLowerCase())) {
			//console.log("Web host flagged");
			reasonsToBlock.push("Red Flag Detected - " + "Bad Website Host: " + badHosts[i]);
			redFlags++;
		}
	}

	// flag possibly bad URL terms
	badUrlTerms = ["call-now1", "call-now2", "mac-support", "p_num=", "phone=","call-for-microsoft-support", "/chx/", "/chmx/", "/AFUS", "/macx/", "firiedge", "ffiedge", "blue.php", "blue.html", "iphonereport/t7", "network_error", "/ysus", "/afuk", "/chr-win-error", "/processdll/", "jook.html", "USA.online", "/chrome_win/", "call-for-security-issues", "errornsel", "/macx", "Call-for-SecurityCH-Issues", "Call-Support1"];
	for (let i = 0; i < badUrlTerms.length; i++) {
		if (location.href.toLowerCase().includes(badUrlTerms[i].toLowerCase())) {
			//console.log("url term flagged");
			reasonsToBlock.push("Red Flag Detected - " + "Bad Page URL Term: " + badUrlTerms[i]);
			redFlags++;
		}
	}

	// flag bad domain TLDs
	// TODO: consider subdomain.websitename.tld (eg. for .us and .in.net particularly)
	// https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#ICANN-era_generic_top-level_domains
	let badTLDs = ["academy", "accountant", "accountants", "active", "actor", "ads", "adult", "agency", "airforce", "analytics", "apartments", "app", "army", "art", "associates", "attorney", "auction", "audible", "audio", "author", "auto", "autos", "aws", "baby", "band", "bar", "barefoot", "bargains", "baseball", "basketball", "beauty", "beer", "best", "bestbuy", "bet", "bible", "bid", "bike", "bingo", "biz", "black", "blackfriday", "blockbuster", "blog", "blue", "boo", "book", "boots", "bot", "boutique", "box", "broadway", "broker", "build", "builders", "business", "buy", "buzz", "cab", "cafe", "call", "cam", "camera", "camp", "cancerresearch", "capital", "car", "cards", "care", "career", "careers", "cars", "case", "cash", "casino", "catering", "catholic", "center", "cern", "ceo", "cfd", "channel", "chat", "cheap", "christmas", "church", "cipriani", "circle", "city", "claims", "cleaning", "click", "clinic", "clothing", "cloud", "club", "coach", "codes", "coffee", "college", "community", "company", "compare", "computer", "condos", "construction", "consulting", "contact", "contractors", "cooking", "cool", "country", "coupon", "coupons", "courses", "credit", "creditcard", "cruise", "cricket", "cruises", "dad", "dance", "data", "date", "dating", "day", "deal", "deals", "degree", "delivery", "democrat", "dental", "dentist", "design", "dev", "diamonds", "diet", "digital", "direct", "directory", "discount", "diy", "docs", "doctor", "dog", "domains", "dot", "download", "drive", "duck", "earth", "eat", "education", "email", "energy", "engineer", "engineering", "enterprises", "equipment", "estate", "events", "exchange", "expert", "exposed", "express", "fail", "faith", "family", "fan", "fans", "farm", "fashion", "fast", "feedback", "film", "final", "finance", "financial", "fire", "fish", "fishing", "fit", "fitness", "flights", "florist", "flowers", "foo", "food", "foodnetwork", "football", "forsale", "forum", "foundation", "free", "frontdoor", "fun", "fund", "furniture", "fyi", "gallery", "game", "games", "garden", "gdn", "gift", "gifts", "gives", "glass", "global", "gold", "golf", "gop", "graphics", "gripe", "grocery", "group", "guide", "guitars", "guru", "hair", "hangout", "health", "healthcare", "help", "here", "hiphop", "hiv", "hockey", "holdings", "holiday", "homegoods", "homes", "homesense", "horse", "hospital", "host", "hosting", "hot", "hotels", "house", "how", "ice", "icu", "industries", "ing", "ink", "institute", "insurance", "insure", "international", "investments", "jewelry", "jobs", "joy", "kim", "kitchen", "land", "latino", "lawyer", "lease", "legal", "life", "lifeinsurance", "lighting", "like", "limited", "limo", "link", "live", "living", "loan", "loans", "locker", "lol", "lotto", "love", "luxury", "makeup", "management", "map", "market", "marketing", "markets", "mba", "med", "media", "meet", "meme", "memorial", "men", "menu", "mint", "mobi", "mobile", "mobily", "moe", "mom", "money", "mortgage", "motorcycles", "mov", "movie", "name", "navy", "network", "new", "news", "ninja", "now", "observer", "off", "one", "onl", "online", "ooo", "open", "origins", "page", "partners", "parts", "party", "pay", "pet", "phone", "photo", "photography", "photos", "pics", "pictures", "pid", "pin", "pink", "pizza", "place", "plumbing", "plus", "poker", "porn", "press", "prime", "pro", "productions", "prof", "promo", "properties", "property", "protection", "pub", "qpon", "racing", "radio", "read", "realestate", "realty", "recipes", "red", "rehab", "ren", "rent", "rentals", "repair", "report", "republican", "rest", "restaurant", "review", "reviews", "rich", "rip", "rocks", "rodeo", "room", "rugby", "run", "safe", "sale", "save", "scholarships", "school", "science", "search", "secure", "security", "select", "services", "sex", "sexy", "shoes", "shop", "shopping", "show", "showtime", "silk", "singles", "site", "ski", "skin", "sky", "sling", "smile", "soccer", "social", "software", "solar", "solutions", "song", "space", "spot", "spreadbetting", "storage", "store", "stream", "studio", "study", "style", "sucks", "supplies", "supply", "support", "surf", "surgery", "systems", "talk", "tattoo", "tax", "taxi", "team", "tech", "technology", "tennis", "theater", "theatre", "tickets", "tips", "tires", "today", "tools", "top", "tours", "town", "toys", "trade", "trading", "training", "travelersinsurance", "trust", "tube", "tunes", "uconnect", "university", "vacations", "ventures", "vet", "video", "villas", "vip", "vision", "vodka", "voting", "voyage", "wang", "watch", "watches", "weather", "webcam", "website", "wed", "wedding", "whoswho", "wiki", "win", "wine", "winners", "work", "works", "world", "wow", "wtf", "xxx", "xyz", "yachts", "yoga", "you", "zero", "zone", "shouji", "tushu", "wanggou", "weibo", "xihuan", "arte", "clinique", "luxe", "maison", "moi", "rsvp", "sarl", "epost", "haus", "immobilien", "jetzt", "kaufen", "kinder", "reisen", "schule", "versicherung", "desi", "shiksha", "casa", "immo", "moda", "bom", "passagens", "gratis", "futbol", "hoteles", "juegos", "soy", "tienda", "uno", "viajes", "vuelos", "pw", "gq", "cf", "us", "ga", "ml", "tk", "in.net", "ru", "xin", "zip", "ws", "dk"];

	for (let i = 0; i < badTLDs.length; i++) {
		if (location.hostname.toLowerCase().endsWith(badTLDs[i].toLowerCase())) {
			//console.log("TLD Flagged");
			reasonsToBlock.push("Red Flag Detected - " + "Bad TLD blocked: " + badTLDs[i]);
			redFlags++;
		}
	}

	// flag if an autoplay audio tag is present
	if (document.head && document.head.innerHTML.toLowerCase().match("<(audio|source).+src=(.|)(\"|\').+\.(mp3|mpga|aac|ogg)(\"|\')")) {
		reasonsToBlock.push("Red Flag Detected - " + "Autoplaying Audio in Page Head");
		redFlags++;
	}
	if (document.body && document.body.innerHTML.toLowerCase().match("<(audio|source).+src=(.|)(\"|\').+\.(mp3|mpga|aac|ogg)(\"|\')")) {
		reasonsToBlock.push("Red Flag Detected - " + "Autoplaying Audio in Page Body");
		redFlags++;
	}

	// flag if an iframe audio tag is present
	if (document.head && document.head.innerHTML.toLowerCase().match("<iframe.+src=(.|)(\"|\').+\.(mp3|mpga|aac|ogg)(\"|\')")) {
		reasonsToBlock.push("Red Flag Detected - " + "Autoplaying Audio in Page Head");
		redFlags++;
	}
	if (document.body && document.body.innerHTML.toLowerCase().match("<iframe.+src=(.|)(\"|\').+\.(mp3|mpga|aac|ogg)(\"|\')")) {
		reasonsToBlock.push("Red Flag Detected - " + "Autoplaying Audio in Page Body");
		redFlags++;
	}

	// Get all inline script tags, and check whether they contain obfuscated JS techniques, and flag them
	let scriptElements = document.getElementsByTagName("script");
	let scripts = "";
	for (let i = 0; i < scriptElements.length; i++) {
		scripts += scriptElements[i].innerText;
	}

	scripts = scripts.toLowerCase();

	if (scripts.includes("document.write(\'<iframe src=")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: document.write for iframe");
		redFlags += 0.1;
	}
	if (scripts.includes("fromcharcode(") || scripts.includes("charcodeat(")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: fromCharCode() or charCodeAt()");
		redFlags += 0.35;
	}
	if (scripts.includes("eval(")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: eval()");
		redFlags += 0.35;
	}
	if (scripts.includes("smat = unescape(")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: unescape()");
		redFlags += 1.5;
	}
	if (scripts.includes("unescape(")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: unescape()");
		redFlags += 0.35;
	}
	let numberOfEncodedSigns = (scripts.match(/%/g) || []).length;
	if (numberOfEncodedSigns >= 50) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: Overly encoded JS with %");
		redFlags += 0.35;
	}
	let numberOfBackSlashes = (scripts.match(/\\/g) || []).length;
	if (numberOfBackSlashes >= 50) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: Overly encoded JS with backslash");
		redFlags += 0.35;
	}
	if (scripts.includes("\(p\,a\,c\,k\,e\,d\)")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: packed");
		redFlags += 0.5;
	}
	if (scripts.includes("atob(") || scripts.includes("btoa(")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: atob() / btoa()");
		redFlags += 0.5;
	}
	if (scripts.includes("aes.cipher") || scripts.includes("aes.ctr.decrypt")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: aes.cipher() / aes.ctr.decrypt()");
		redFlags += 0.5;
	}
	if (scripts.includes(".requestfullscreen") || scripts.includes(".mozrequestfullscreen") || scripts.includes("webkitfullscreenchange")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: requestFullscreen");
		redFlags += 0.5;
	}
	if (scripts.includes(".SendKeys(\"F11\")") || scripts.includes(".SendKeys('F11'))")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: requestFullscreen");
		redFlags += 0.5;
	}
	if (scripts.includes("requestPointerLock") || scripts.includes("mozRequestPointerLock") || scripts.includes("webkitRequestPointerLock")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: requestPointerLock");
		redFlags += 0.5;
	}
	if (scripts.includes("window.setInterval(function(){msg_ff(")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: setInterval with likely bad function name");
		redFlags += 1.0;
	}
	if (scripts.includes("document.write(phone)") || scripts.includes("document.write(getURLParameter(\"p_num\"))")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: document.write(phone)");
		redFlags += 1.5;
	}
	if (document.body && document.body.onbeforeunload) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: onbeforeunload");
		redFlags += 1.5;
	}
	if (scripts.includes("\[\"pushstate\"\, \"onbeforeunload\"\, \"\"\, \"returnvalue\"\, \"onload\"\, \"tostring\"\]")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: pushState");
		redFlags += 1.5;
	}
	if (scripts.includes("onbeforeunload=function() {alert (\"??????? ESC")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: atypical onbeforeunload");
		redFlags += 1.5;
	}
	if (scripts.includes("setInterval(function () { alert(") || scripts.includes("setInterval(function () { window.alert(")) {
		reasonsToBlock.push("Red Flag Detected - " + "Bad JS: setInterval with window.alert");
		redFlags += 1.5;
	}

	// detect empty text bodies
	if (document.body && document.body.innerText.length === 0) {
		reasonsToBlock.push("Red Flag Detected - " + "Page has no body content");
		redFlags += 0.5;
	}

	// detect repeated window.open and flag each
	scripts = scripts.replace(/\r|\n/gmi, "") // remove new lines, to properly detect regex
	let openers = scripts.split(")");
	let openerSrcs = [];
	for (let i = 0; i < openers.length; i++) {
		let openerSrc = /window\.open.+(\"|\')\,"/igm.exec(openers[i]);
		if (openerSrc && openerSrc[1]) {
			if (openerSrcs.indexOf(openerSrc[1]) === -1) openerSrcs.push(openerSrc[1]);
			else {
				reasonsToBlock.push("Red Flag Detected - " + "Page has duplicate window.open");
				//redFlags += 0.25;
			}
		}
	}

	// detect repeated iframes and flag each one (that are used to freeze up browsers and further annoy the user)
	if (document.body) {
		let bodyHtml = document.body.innerHTML.toLowerCase();
		bodyHtml = bodyHtml.replace(/\r|\n/gmi, "") // remove new lines, to properly detect regex

		let iframes = bodyHtml.split("</iframe>");
		let iframeSrcs = [];

		for (let i = 0; i < iframes.length; i++) {
			let iframeSrc = /\<iframe.+\ssrc\=\"(.+)\"/igm.exec(iframes[i]);
			if (iframeSrc && iframeSrc[1]) {
				if (iframeSrcs.indexOf(iframeSrc[1]) === -1) iframeSrcs.push(iframeSrc[1]);
				else {
					reasonsToBlock.push("Red Flag Detected - " + "Page has duplicate iframes");
					redFlags += 0.25;
				}
			}
		}
	}

	// detect whether the right-click context menu is blocked
	if (document.body && document.body.getAttribute("oncontextmenu") && document.body.getAttribute("oncontextmenu") === "return false") {
		reasonsToBlock.push("Red Flag Detected - " + "Right-click context menu has been removed");
		redFlags += 0.35;
	}

	// detect whether the body cursor has been replaced
	if (document.body && document.body.getAttribute("style")) {
		let bodyStyle = document.body.getAttribute("style").toLowerCase();
		if (bodyStyle.includes("cursor:")) {
			reasonsToBlock.push("Red Flag Detected - " + "Browser cursor has been replaced");
			redFlags += 0.35;
		}
	}

	// detect fake 'additional dialog' checkbox form
	if (document.body) {
		let inputs = document.getElementsByTagName("input");
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].parentNode && inputs[i].parentNode.innerText.toLowerCase().includes("prevent this page from creating additional dialogues")) {
				reasonsToBlock.push("Red Flag Detected - " + "Fake additional dialogue checkbox form");
				redFlags++;
			}
		}
	}

	// detect in-line remote conection tool filenames
	if (document.body) {
		let prevRedFlags = redFlags;
		let bodyHtml = document.body.innerHTML.toLowerCase();
		if (bodyHtml.indexOf("teamviewer.exe") > -1) redFlags += 0.5;
		if (bodyHtml.indexOf("ultraviewer.exe") > -1) redFlags += 0.5;
		if (bodyHtml.indexOf("anydesk.exe") > -1) redFlags += 0.5;
		if (bodyHtml.indexOf("supremo.exe") > -1) redFlags += 0.5;
		if (redFlags > prevRedFlags) reasonsToBlock.push("Red Flag Detected - " + "Directly linking to remote connection executables");
	}

	// TODO: Create multiple phrase arrays with differing weights, and possibly implement levenstein distance, and arrays of definite collocations
	// Scan the page for commonly used phrases
	let phrases = ["alert from microsoft", "windows computer is infected", "microsoft windows warning", "your computer was locked", "this computer is blocked", "your computer is blocked", "your computer has been blocked", "your computer has been infected", "your computer has alerted us", "call microsoft toll free", "windows has detected", "your system detected", "please call microsoft", "ransomware virus has infected your system", "trying to steal financial information", "information is being stolen", "removal process over the phone", "prevent your computer from being disabled", "pornographic spyware", "mac os is infected", "if you leave your mac os will remain damaged", "if you leave this site your mac os will remain damaged", "phishing/spyware were found on your mac", "banking information are at risk", "if you close this page, your computer access will be disabled", "your computer access will be disabled to prevent further damage", "call us within the next 5 minutes to prevent your computer from being disabled", "enter windows registration key to unblock", "do not close this window and restart your computer", "your computer's registration key is unblocked", "has been blocked under instructions of a competent us government authority", "under this url is an offence in law", "contact microsoft engineer", "do not ignore this important warning", "suspicious activity detected on your ip address", "due to harmful virus installed in your computer", "contact microsoft helpline to reactivate your computer", "this window is sending virus over the internet", "is hacked or used from undefined location", "your system detected some unusual activity", "it might harm your computer data and track your financial activities", "there is a system file missing due to some harmfull virus", "debug malware error, system failure", "the following data may be compromised", "do not ignore this critical alert", "your computer access will be disabled to prevent further damage to our network", "our engineers can guide you through the phone removal process", "microsoft security tollfree", "error # dt00X02", "error # dt00X2", "contact_microsoft_support", "system_protect - protect_error", "to secure your data and windows system click here", "windows operating system alert", "windows & internet browser updates are needed to patch new security flaws and / or fix bugs in the system", "rdn/yahlover.worm!", "RDN/YahVee.worm!","apple security breach!", "your device is being targeted right now", "call apple support (toll-free)", "use this phone number to connect apple technical support", "ios security crash", "error #748b-12", "stop transferring your personal data and photos!", "you close this page, your computer access will be disabled", "for avoid further damage to our network", "our computer has alerted us that it was infected", "learn more about safe browsing get information about", "windows was blocked due to questionable activity", "please stop or restart your computer", "the pre-scan found possible traces of", "your system is at risk of irreversible damage", "scanning and cleaning is advised to prevent further system damage", "microsoft warning alert", "microsoft warning  alert", "mal1cious p0rn0graphic", "your system data has been compromized", "hackers may track your financial activities and get access to your personal files on this system", "this virus is sending your confidential information", "error number #278D5", "we will be forced to disable your computer", "your computer is in critical state", "your iphone has been locked", "has been locked due to detected illegal activity", "immediately call apple support to unlock", "we couldn't activate windows", "ios security crash", "windows is asking for authentication", "call microsoft help desk", "technicians can guide you through the whole process over the phone", "contact our certified windows technicians", "your windows computer is at high risk", "windows security has detected", "the latest software, scan your system, and prevent your files from being deleted", "windows malware detected", "malware detected\/hard drive problem", "do not open internet browser for your security issue", "contact technicians at tollfree helpline", "someone is trying to steal your banking details", "drive safety delete in starting in", "google chrome critical error!", "call google chrome", "your information (for example, passwords, messages, and credit cards) have been stolen", "experienced technicians can help you activate", "technicians will access your computer 100% securely"];
	let phrasesb = ["remotely activate your AV protection for you", "download your active subscription", "lot of antivirus software’s is available in the market", "keeps your computer protected in very a simple way", "in almost all the latest microsoft operating systems", "data in your computer are always on the verge of risk", "we analyze different errors and then we resolve them", "[OS_NAME] の問題を修復する方法", "windows-hat einige verdächtige", "aktivitäten von ihrer ip-adresse erkannt", "debug browser spyware 895-system 32.exe", "please contact Microsoft certified technicians to rectify the issue", "do not use any internet based services", "einige viren und spyware haben eine sicherheitslücke", "error # dw6vb37", "su ordenador está bloqueado", "no ignore este mensaje de error", "windows defender está examinando el equipo", "security system has detected the threatening attempt to gain access", "perform temporary block of all of your accounts", "millions of viruses seeking to exploit security loopholes to access private information on your computers", "is an independent provider of technical support for computer", "is an independent software reseller and we provide softwares and support", "is a reviews, information and self-help website providing troubleshooting", "to immediately rectify issue and prevent data loss", "hard drive safety delete starting in", "your hard drive will be deleted if you close this page", "you have a koobface virus", "268D3-XC00037 virus", "collectively, our team is able to handle a very wide array of tech issues", "si ricorda che una volta rubati questi dati potrebbero essere utilizzati per secondi fini", "segua le indicazioni fornite dall'operatore", "your pc is heavily damaged", "please download the pc cleanup application to remove", "ransomware 2.0", "trojan.win32.sendip.15", "@*fg/windows.exe", "@*fg\\windows.exe", "windowsが深刻な損傷を受けています", "コンピュータからウイルスを削除するには、Advanced PC Fixer", "e.tre456_worm_Windows", "を発見しましたことで破損営業システム", "タップスネーク", "tapsnake; crondns", "dubfish.icv", "/os/apps/snake.icv", "apps/hidden/system32/x/snake.exe", "our diagnosis shows that your computer still has errors", "call us now to get 1 year subscription of advanced pc care for free", "ask for your free pc diagnosis by our award wining technical team", "ie security update...", "edge security update...", "firefox security update...", "chrome security update...", "your subscription to mcafee total protection for windows has expired", "windows security center: your mcafee subscription has expired", "you have been randomly selected to test the new iphone", "You are invited to test our new iPhone", "your ip address - has been randomly selected", "your ip address has been randomly selected", "access to your computer has been restricted", "error # 3658d5546db22ca", "windows 7 driver optimizer", "windows 8 driver optimizer", "windows 10 driver optimizer", "driversupport is a five star rated download", "your computer has been locked", "system activation error code: 0x44578", "might infected by the trojans", "because system activation key has expired & your information", "I lost all hope once I lost all of my messages. Luckily,", "When none of my password recovery processes were working,", "your video player for windows might be out of date!", "your windows system is damaged", "your version of software is damaged and obsolete", "click on the \"update\" button to install the newest software to scan and protect your files from being deleted", "the immediate removal of the viruses is required to prevent further system damage, loss of apps, photos, or other files", "please download the reimage repair application to remove", "ERROR # 268d3x8938", "ERROR # MS-SYSINFO32", "microsoft diagnostics ip address", "connects you to an independent third party service provider of technical support", "I don’t have enough knowledge about the installation process but with the help of right technician it became possible for me without any error", "We ensure Word, Excel, PPT or Outlook help you to take right conclusions timely.", "Our Support helps to work with latest version of MS office tools anytime as it arrives.", "We are here to assist you with different MS Office problems you are facing", "send otp to support team", "your antivirus software requires an update", "dear chrome user, congratulations", "dear firefox user, congratulations", "dear safari user, congratulations", "dear opera user, congratulations", "dear windows user, the website you have recently visited may have downloaded the malware and virus", "please do not try to shut down or restart your computer.it may lock your computer permanently or erase your hard disk", "your tcp connection was blocked by your windows security system", "windows defender alert : error code # 0x3e7", "Microsoft Security Tollfree", "Why we blocked your computer?", "Enter Windows registration key to unblock", "windows update can not continue as your software copy is expired\/corrupt", "error code: 0x00aem001489", "Blue Screen Error 0x000000CE", "for the purpose of verification enter your windows product key", "Error # XR01F5", "Your computer has alerted us that it has been infected with a Pornographic Spyware", "windows wurde aufgrund verdächtiger aktivitäten blockiert", "the window's registration key is illegal", "your apple device has been locked due to security reasons", "ihr system ist durch die ungewöhnliche", "This window is using pirated software", "we block this computer for your security", "Don't close this window! It's important!", "microsoft security sans frais", "alerte de virus de microsoft", "nous avons verrouillé cet ordinateur pour votre sécurité", "ne fermez pas cette fenétre et ne redémarrez pas votre ordinateur sans appeler le support", "do not close this window or restart your computer without calling support", "pornographic virus alert from microsoft", "contact the microsoft helpline to reactivate your computer", "contactez le service d'assistance téléphonique microsoft pour réactiver votre ordinateur", "we have detected a virus from a pornographic website", "it might corrupt your data and track your financial activities", "we have locked this computer for your security", "Error: 110898-1907316996"];
	let phrasesc = ["windows firewall has detected that your windows", "Please note: Windows security has detected that the system is corrupted and outdated", "Click on the \"Update\" button to install the latest software to scan and prevent your files from being deleted", "DO NOT PRESS ANY KEY UNTIL YOUR KNOW SAFE SIDE INSTRUCTIONS", "a Microsoft Super Technician is waiting to guide you to safeguard your system", "You must not avoid this warning, as this is very critical infection", "Microsoft Super Technicians are level 9 technicians which are expertise in resolving these kind of issues", "ATTENTION: Trojan Windows 7 Process", "is a hidden monitoring software that tracks your personal information", "this information can be sent to hackers or third parties to damage your computer", "Your system has detected zeus virus", "Firewall detecting 'suspicious' incoming network connections", "Automatically report details of possible security incidents to Google.", "Your apple id has been disabled!", "This Mac computer is BLOCKED", "Do not close this warning or restart your", "Your Mac's registration key is Blocked", "The Mac's registration key is illegal", "This Mac is using pirated software", "This Mac is sending virus over the internet", "is hacked or used from undefined location", "It might harm your Mac's data and track your financial activities", "Contact Our Certified Windows Technicians For Immediate Assistance", "Windows Has Detected a Malicious Virus On Your System", "Warning! A Full System Scan is Required", "Further action through this computer or any computer on the network will reveal private information", "The pre-scan found traces of (2) malware", "is required immediately to prevent further system damage, loss of Apps, Photos or other files", "Personal and banking information are at risk", "If you leave this site your Mac OS  will remain damaged and vulnerable", "is infected with Spyware and other malicious applications", "Spyware must be removed and system damage repaired", "Error: 79791-", "Error: 168219-", "If you exit this without solving issue, access to your computer will be removed to prevent further destruction to our network", "Ihr System erkennt ungewöhnliche Aktivitäten", "Bitte melden Sie diese Aktivität an", "Der Fensterregistrierungsschlüssel ist illegal", "Dieses Fenster verwendet Raubkopie", "Dieses Fenster sendet Viren über das Internet", "Dieses Fenster wird von einem unbestimmten Ort aus gehackt oder verwendet", "Wir haben diesen Computer zu Ihrer Sicherheit gesperrt", "Wenden Sie sich an den Microsoft Support, um Ihren Computer zu reaktivieren", "Warum sperren wir Ihren Computer?", "App: windows10manager (1).exe", "virus detected in your system registry", "call ms technical support", "if you exit this without solving issue, access to your computer will be removed", "access to your computer will be removed to prevent further destruction", "your pc has alerted us that it was infected with malware", "Virus Found: Tapsnake; CronDNS; Dubfishicv", "Any other action through this computer or any computer on the network will reveal private information", "System damage: 28.1%", "MAC OS is infected with spyware and other malicious applications", "Spyware must be removed and system damage repaired", "Microsoft Super Technicians are level 9", "DO NOT PRESS ANY KEY UNTIL YOU KNOW SAFE SIDE INSTRUCTIONS", "Windows- und Internetbrowser-Updates sind erforderlich, um neue Sicherheitslücken zu schließen und / oder Fehler im System zu beheben", "Wenn Ihr Computer mit dem Internet verbunden ist, müssen Sie unbedingt Ihre Sicherheit so aktuell wie möglich halten", "Aktualisiert Patch-Sicherheitslücken, durch die ein System gefährdet werden könnte", "Rufen Sie an, um das Problem zu beheben", "ist ein Unabhängiger Dienstleister für Softwareprobleme in desktops, laptops und Peripheriegeräten.Die in der Website verwendeten Markennamen, Marken, logos, Firmennamen gehören Ihren jeweiligen Eigentümern", "empfiehlt Unterstützung vom jeweiligen OEM, da ähnliche tech-Hilfe auch vom Markeninhaber bereitgestellt werden kann", "Holen Sie sich Windows-support und Windows-Hilfe von zertifizierten Windows Windows-Profis", "Wenn Sie die neueste Windows-version oder ein anderes Windows-Produkt installiert haben, benötigen Sie einen Windows support professional, um Probleme zu beheben", "Wir bieten Windows premium tech support für Benutzer mit einem der Windows-Produkte", "Wir sind immer offen für Sie und einer von uns wird immer bei Ihnen sein, um Ihnen bei allen Windows-Produkten zu helfen", "Herausgeber: Unbekannter Herausgeber", "Windows SmartScreen verhinderte, dass eine unerkannte app gestartet wurde. Ausführen dieser app könnte setzen", "あなたのiPhoneのセキュリティが侵害されました", "Facebookアカウント、Whatsappメッセージの写真、個人用アプリケーションなどの機密データにまで拡散して感染するのを防ぐ", "早急な対応が必要です", "最近の危険なサイトの閲覧中に、ブラウザがブラウザートロイの木馬ウイルスによって（39.3％）破損していることが検出されました", "こちらが、ほんの数秒でこれを解決する方法です（ステップバイステップ）", "「ウイルスの削除」をタップして App Storeから", "アプリケーションを開いて最新のアップデートを有効にし、古い（感染した）バージョンを削除します", "Your Apple iPhone is severely damaged by 10 viruses!", "DAMAGED by BROWSER TROJAN VIRUSES picked up while surfing recent corrupted sites", "Immediate action is required to prevent it from spreading and infecting sensitive data like your Facebook account, Whatsapp messages photos and private applications", "Tap REMOVE VIRUS to install", "Open the application to activate the latest update and remove any older (Infected) versions", "please stop and do not close the pc", "windows was blocked due to suspicious activity", "closing this page will disable your computer access", "error # ap7mq79", "windows malware detected\\hard drive problem\\C:\\Windows\\system32\\", "Someone Is Trying To Steal Your Banking Details, Credit Card Details & Other Logins", "(Toll Free) Immediately To Prevent Data Loss", "The page you tried to visit turns out to be infected and your computer is at risk", "It is possible that we disable your internet connection to prevent the spread of the virus on our network", "Disinfection of the computer is however possible: Call for Help", "From now on, only a Windows  technician is able to intervene and prevent data loss", "Most computers begin to suffer stability problems with continued use, although to a different degree that may depend on different factors", "Reduced stability that manifests itself in various PC errors may be caused by a wide array of issues", "the most effective way to fix crashes and errors on a pc is with the help of special software that safely performs registry cleanup", "scans your computer for the following types of issues: invalid registry issues, fragmented files, internet connection settings, windows tweaks and unused services"];
	let phrasesd = ["Windows Detected ALUREON Attack", "The Infections detected, indicate some recent downloads on the computer which in turn has created problems on the computer", "share this code SD333 to the Agent to Fix This", "Hard Drive safety delete in starting in", "Your Hard drive will be DELETED if you close this page", "The following data will be compromised if you continue", "This virus is well known for complete identity and credit card theft", "Further action through this computer or any computer on the network will reveal private information and involve serious risks", "Firewall detecting 'suspicious' incoming network connections", "Microsoft System Has Detected a Malicious Activity On Your System", "we have detected various viruses/malware & suspicious activity from your IP", "is an independent organization. we also offer assistant for other products, brands and IT services, any brand name, trademarks, and product pictures which are displayed on this website are for referential purposes only and", "has no affiliation with any of these companies unless such relationship has been specifically mentioned", "the service we offer for independent products may also be available directly from the individual brand owners on their specific websites, and may also be offered by them free of charge", "our microsoft certified technicians are expert in all windows evaluation versions", "Security system has detected the threatening attempt to gain access to your bank logins and related data", "but this dangerous connection was blocked with Firewall and further data leak was prevented", "Despite the timely blocking of the connection, there is still a serious threat of private data stealth", "There is possibility that virus already hurt your disks or destroyed and stole its data", "It is reason for checking current system security and verifying its stability", "Do not spend your time and immediately call us or contact our service center support team", "We are waiting for your rapid responce to help you", "protected page: enter your network username and password wrong password closed internet connection and ban your ISP call on", "error # 0x80092ee9", "Windows was blocked due to questionable activity", "Asks for your username and password. ATTENTION: Your password will not be sent to the website you are visiting!", "You must contact us immediately so that our expert engineers can walk you through the removal process over the phone to protect your identity", "Please call us within the next 5 minutes to prevent your computer from being disabled or from any information loss", "Windows & internet browser updates are needed to patch new security flaws and / or fix bugs in the system", "if you have yout computer connected to the internet, you desperately need to keep your security as up to date as possible", "error # er36dx9832", "suspicious movement distinguished on your IP", "because of destructive infection introduced in your PC", "because of a spyware introduced in your PC", "there is a computer framework record missing", "some harmful malware infection debug malware error", "some harmful infection debug malware blunder", "malware blunder, framework disappointment", "do not open web program for your security issue", "to maintain a strategic distance from information debasement on your working framework", "debug malware error (code 0x80093acf)", "make any changes for your security issue to avoid data loss", "this harmful malware is affecting your online information & can track financial activity", "computer is in blocked state", "press any key until safe side instructions", "a windows certified technician will guide you safeguard your system", "error # 0xc004fc03", "windows firewall has detected that your windows 10 is damaged and irrelevant", "as a result, your system files are automatically deleted", "your computer warns you that you are infected with porn spyware", "microsoft protected your pc", "The windows certified technicians will hereby take control of the operating system", "For security reasons the technicians wont have access to any information", "Contactez-nous immédiatement pour que nos techniciens puissent vous guider dans le processus de retrait", "entrez votre nom d,utilisateur et votre mot de passe pour", "windows a été bloqué en raison d'une activité suspecte", "access to this pc has been blocked for security reasons", "ads.financetrack(1).exe", "unexpected error - 0000x1200DS1 occured", "your key has been redeemed successfully, but the setup could not be started", "Error code: OOXOOO16FA", "Correlation ID: c14765ad-41fg-ds7df-cfa9f5jhdjhsg", "your code is not generated in database", "your system is virus infected", "repeated failure may lead to expire code", "Windows-Defender - Security Warning", "C0mputеr Err_x", "020x7Оkx344vx07B", "your system has been reported", "assistance, contact Microsoft", "windows locked due to unusual activity", "your computer is detected by a malicious"];

	phrases = phrases.concat(phrasesb, phrasesc, phrasesd);

	// TODO - regex / multi-include captures?
	// System damage: 28.1% - Immediate removal required

	// special characters for re-writing scam phrase text
	// German: ä, ö, ü
	// Spanish: á, é, í, ó, ú, ü, ñ, ¿, ¡

	// Get page content
	let page = "";
	if (document.head) page += document.head.innerText.toLowerCase();
	if (document.body) page += document.body.innerText.toLowerCase();

	// Detect phrases
	for (let i = 0; i < phrases.length; i++) {
		if (page.indexOf(phrases[i].toLowerCase()) > -1) {
			reasonsToBlock.push("Red Flag Detected - Scammer-like phrase: " + phrases[i]);
			redFlags++;
			if (redFlags >= 3) break;
		}
	}

	// Block the page if there are too many red flags
	if (redFlags >= 3) {
		console.log("Blocked by red flags");
		return shouldBlockPage = true;
	}
}

// Block the page, by clearing its content and replacing it
let finishedBlocking = false;
function blockPage() {
	if (shouldBlockPage && !finishedBlocking) {
		// in case page is reloaded by javascript that cannot be intuitively blocked
		// set this page to be blocked immediately on the next opening
		// instead of waiting for the page to be detected as meeting blocking conditions
		GM_setValue(location.hostname, "blocked");

		// Stop page from loading further
		window.stop();

		// Rewrite the page
		if (!document.body) {
			setTimeout(() => {
				document.body = document.createElement("body");
				fillPage();
			}, 0);
		}
		else {
			fillPage();
		}

		// Finished
		finishedBlocking = true;
	}
}

function overrideCustomJS() {
	// remove all non-native functions in the page
	// source: https://stackoverflow.com/a/11279639/1679669
	for (let i in window) {
		if((typeof window[i]).toString().toLowerCase() =="function" && window[i].toString().toLowerCase().indexOf("native") == -1){
			window[i] = null;
		}
	}
}

function overrideNativeJS() {
	window.onload = null;
	window.open = null;
	window.addEventListener = null;
	document.addEventListener = null;
	document.body.addEventListener = null;
	document.write = null;
	document.createElement = null;
	document.body.appendChild = null;
	window.onbeforeunload = null;
	window.history.pushState = null;
	window.eval = null;
	window.alert = null;
	document.querySelector = null;
	window.onbeforeprint = function() {window.print = null}
	window.print = null;
	document.onmousemove = null;
	document.onkeydown = null;
	document.onkeyup = null;
	window.onhashchange = null;
	document.oncontextmenu = null;
	document.onmousedown = null;
	document.onmouseup = null;
	document.onclick = null;

	if (window.jQuery) {
		$ = null;
		window.jQuery = null;
	}

	// Override fullscreen functions
	let elem = document.documentElement;
	if (elem.requestFullscreen) elem.requestFullscreen = null;
	// Firefox
	if (elem.mozRequestFullScreen) elem.mozRequestFullScreen = null;
	// Chrome, Safari and Opera
	if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen = null;
	/* IE/Edge */
	if (elem.msRequestFullscreen) elem.msRequestFullscreen = null;

	setInterval(() => {
		try {
			// Exit fullscreen functions
			if (document.exitFullscreen) document.exitFullscreen();
			// Firefox
			if (document.mozCancelFullScreen) document.mozCancelFullScreen();
			// Chrome, Safari and Opera
			if (document.webkitExitFullscreen) document.webkitExitFullscreen();
			// IE/Edge
			if (document.msExitFullscreen) document.msExitFullscreen();

			// Exist mouse lock
			document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
			document.exitPointerLock();
		} catch (e) {
			// console.error(e);
		}
	}, 500);
}

function fillPage() {
	overrideCustomJS();

	// reset document head
	let head = document.getElementsByTagName('head');
	if (head && head[0]) {
		head[0].innerHTML = "<title>" + document.title + "</title>";
	}

	// rewrite the document with itself if it already existed, to remove event listeners
	let old_element = document.body;
	let new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);

	// remove attributes from the body
	while(document.body.attributes.length > 0) document.body.removeAttribute(document.body.attributes[0].name);

	// rewrite the document body contents with our warning message
	let html = "";
	html = "<div style='background-color:rgba(0,0,0,.25); max-width:750px; padding: 4px; margin: 0 auto'>";
	html += "<center><h2>Suspicious Site Blocked by <a href='#' id='authorlink' style='color:#F2F2F2;'><u>Scam Site Blocker</u></a></h2><br /></center>";
	html += "<center>If you were told to visit this page over the phone, be cautious.<br /><br /></center>";
	html += "<center>This website may be operated by scammers. Go back or close this page.<br /><br /></center>";
	html += "<center>If you think otherwise, confirm the website address before ignoring this warning.<br /><br /></center>";
	html += "<center>If this warning seems accurate, please submit a report to Google to help protect others.<br /><br /></center>";
	html += "<center><button id='ignorePage'>Ignore Warning</button> <button id='reportPage'>Report to Google</button></center>";
	html += "</div>";

	html += "<br /><div id='reasonsForBlock' style='text-align:center'>" + "<div style='font-size: 12px'>" + reasonsToBlock.join("<br />") + "</div></div>"

	document.body.innerHTML = html;

	document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
	document.body.style.fontSize = "16px";
	document.body.style.color = "#F7F7F7";
	document.body.style.backgroundColor = "#931024";
	document.getElementById("ignorePage").style.padding = "6px";
	document.getElementById("reportPage").style.padding = "6px";

	document.getElementById("authorlink").addEventListener("click", openAuthorPage);
	document.getElementById("ignorePage").addEventListener("click", ignorePage);
	document.getElementById("reportPage").addEventListener("click", reportPage);

	// inject the javascript override code into the page
	injectCode(overrideNativeJS);

	// change head CSP
	if (head && head[0]) {
		head[0].innerHTML += "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src \'none\'; script-src \'unsafe-inline\'\"></meta>";
	}
}

// open greasyfork page
function openAuthorPage() {
	window.open("https://greasyfork.org/en/scripts/373815-scam-site-blocker", "_blank");
}

// ignore pages by domain name, handled via GM storage
function ignorePage() {
	if (GM_setValue) {
		GM_setValue(location.hostname, "ignored");
		location.reload();
	}
}

// report the current page
let encodedPageUrl = encodeURIComponent(window.location.href);
function reportPage() {
	let reportToUrl = "https://safebrowsing.google.com/safebrowsing/report_general/?" + "website=" + encodedPageUrl;
	window.open(reportToUrl);
}

// check if page is ignored
let isPageIgnored = GM_getValue(location.hostname);

// run code blocks
let runTime = Date.now();
let intervalMs = 4;
if (isPageIgnored !== "ignored") {
	let interval = setInterval(function() {
		intervalMs += 4;

		main();
		blockPage();

		// Restore JS functionality if page is safe
		if(!shouldBlockPage && (Date.now() - runTime) / 1000 >= 3) {
			restoreWindowJS();
		}

		// Remove interval if page has been blocked, or, the script has run for longer than 3 seconds
		if(shouldBlockPage || (Date.now() - runTime) / 1000 >= 3) {
			return clearInterval(interval);
		}
	}, intervalMs);
}
