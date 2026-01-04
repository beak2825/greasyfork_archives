// ==UserScript==
// @name         Suspicious Website TLD Blocker
// @namespace    blockSuspiciousTLDs
// @version      1.5
// @description  Block websites that use domain extensions often associated with spam, scams, and malware.
// @author       Kai Krause <kaikrause95@gmail.com>
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374164/Suspicious%20Website%20TLD%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/374164/Suspicious%20Website%20TLD%20Blocker.meta.js
// ==/UserScript==

// TODO(?): Region-specific TLD blocking. For example, blocking of Russian or Chinese TLDs.
// TODO(?): Whitelist of government-owned .us domains, and blocking of all other .us domains.

var websiteTerms = location.hostname.split(".");
var currentURL = websiteTerms[websiteTerms.length-2] + "." + websiteTerms[websiteTerms.length-1]
var thisTLD = websiteTerms[websiteTerms.length-1]

// whitelist
var exclusions = ["abc.xyz"];
if (exclusions.indexOf(currentURL) > -1) return;

// https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#ICANN-era_generic_top-level_domains
var genericTLDs = ["academy", "accountant", "accountants", "active", "actor", "ads", "adult", "agency", "airforce", "analytics", "apartments", "app", "army", "art", "associates", "attorney", "auction", "audible", "audio", "author", "auto", "autos", "aws", "baby", "band", "bar", "barefoot", "bargains", "baseball", "basketball", "beauty", "beer", "best", "bestbuy", "bet", "bible", "bid", "bike", "bingo", "biz", "black", "blackfriday", "blockbuster", "blog", "blue", "boo", "book", "boots", "bot", "boutique", "box", "broadway", "broker", "build", "builders", "business", "buy", "buzz", "cab", "cafe", "call", "cam", "camera", "camp", "cancerresearch", "capital", "car", "cards", "care", "career", "careers", "cars", "case", "cash", "casino", "catering", "catholic", "center", "cern", "ceo", "cfd", "channel", "chat", "cheap", "christmas", "church", "cipriani", "circle", "city", "claims", "cleaning", "click", "clinic", "clothing", "cloud", "club", "coach", "codes", "coffee", "college", "community", "company", "compare", "computer", "condos", "construction", "consulting", "contact", "contractors", "cooking", "cool", "country", "coupon", "coupons", "courses", "credit", "creditcard", "cruise", "cricket", "cruises", "dad", "dance", "data", "date", "dating", "day", "deal", "deals", "degree", "delivery", "democrat", "dental", "dentist", "design", "dev", "diamonds", "diet", "digital", "direct", "directory", "discount", "diy", "docs", "doctor", "dog", "domains", "dot", "download", "drive", "duck", "earth", "eat", "education", "email", "energy", "engineer", "engineering", "enterprises", "equipment", "estate", "events", "exchange", "expert", "exposed", "express", "fail", "faith", "family", "fan", "fans", "farm", "fashion", "fast", "feedback", "film", "final", "finance", "financial", "fire", "fish", "fishing", "fit", "fitness", "flights", "florist", "flowers", "foo", "food", "foodnetwork", "football", "forsale", "forum", "foundation", "free", "frontdoor", "fun", "fund", "furniture", "fyi", "gallery", "game", "games", "garden", "gay", "gdn", "gift", "gifts", "gives", "glass", "global", "gold", "golf", "gop", "graphics", "gripe", "grocery", "group", "guide", "guitars", "guru", "hair", "hangout", "health", "healthcare", "help", "here", "hiphop", "hiv", "hockey", "holdings", "holiday", "homegoods", "homes", "homesense", "horse", "hospital", "host", "hosting", "hot", "hotels", "house", "how", "ice", "icu ", "industries", "ing", "ink", "institute", "insurance", "insure", "international", "investments", "jewelry", "jobs", "joy", "kim", "kitchen", "land", "lat", "latino", "law", "lawyer", "lease", "legal", "life", "lifeinsurance", "lighting", "like", "limited", "limo", "link", "live", "living", "loan", "loans", "locker", "lol", "lotto", "love", "luxury", "makeup", "management", "map", "market", "marketing", "markets", "mba", "med", "media", "meet", "meme", "memorial", "men", "menu", "mint", "mobi", "mobile", "mobily", "moe", "mom", "money", "monster", "mortgage", "motorcycles", "mov", "movie", "music", "name", "navy", "network", "new", "news", "ninja", "now", "observer", "off", "one", "onl", "online", "ooo", "open", "origins", "page", "partners", "parts", "party", "pay", "pet", "phone", "photo", "photography", "photos", "pics", "pictures", "pid", "pin", "pink", "pizza", "place", "plumbing", "plus", "poker", "porn", "press", "prime", "pro", "productions", "prof", "promo", "properties", "property", "protection", "pub", "qpon", "racing", "radio", "read", "realestate", "realty", "recipes", "red", "rehab", "ren", "rent", "rentals", "repair", "report", "republican", "rest", "restaurant", "review", "reviews", "rich", "rip", "rocks", "rodeo", "room", "rugby", "run", "safe", "sale", "save", "scholarships", "school", "science", "search", "secure", "security", "select", "services", "sex", "sexy", "shoes", "shop", "shopping", "show", "showtime", "silk", "singles", "site", "ski", "skin", "sky", "sling", "smile", "soccer", "social", "software", "solar", "solutions", "song", "space", "spot", "spreadbetting", "storage", "store", "stream", "studio", "study", "style", "sucks", "supplies", "supply", "support", "surf", "surgery", "systems", "talk", "tattoo", "tax", "taxi", "team", "tech", "technology", "tennis", "theater", "theatre", "tickets", "tips", "tires", "today", "tools", "top", "tours", "town", "toys", "trade", "trading", "training", "travelersinsurance", "trust", "tube", "tunes", "uconnect", "university", "vacations", "ventures", "vet", "video", "villas", "vip", "vision", "vodka", "voting", "voyage", "wang", "watch", "watches", "weather", "webcam", "website", "wed", "wedding", "whoswho", "wiki", "win", "wine", "winners", "work", "works", "world", "wow", "wtf", "xxx", "xyz", "yachts", "yoga", "you", "zero", "zone", "shouji", "tushu", "wanggou", "weibo", "xihuan", "arte", "clinique", "luxe", "maison", "moi", "rsvp", "sarl", "epost", "haus", "immobilien", "jetzt", "kaufen", "kinder", "reisen", "schule", "versicherung", "desi", "shiksha", "casa", "immo", "moda", "bom", "passagens", "gratis", "futbol", "hoteles", "juegos", "soy", "tienda", "uno", "viajes", "vuelos"];

// https://www.freenom.com/en/freeandpaiddomains.html
// https://www.spamhaus.org/statistics/tlds/
// https://www.symantec.com/connect/blogs/zip-urls-or-why-you-should-block-domains-tld-doesnt-have-any
var badTLDs = ["pw", "gq", "cf", "ga", "ml", "tk", "xin", "zip", "ws"];

if (badTLDs.indexOf(thisTLD) > -1 || genericTLDs.indexOf(thisTLD) > -1) {
	var isPageIgnored = GM_getValue(location.hostname);
	if (!isPageIgnored || isPageIgnored != "ignored") {
		blockPage();
	}
}

function blockPage() {
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
}

function fillPage() {
	// reset document head
	var head = document.getElementsByTagName('head');
	if (head && head[0]) {
		head[0].innerHTML = "<title>" + document.title + "</title>";
	}

	// rewrite the document with itself if it already existed, to remove event listeners
	var old_element = document.body;
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);

	// reset styling on the body element
	document.body.className = "";
	document.body.style = "";

	// rewrite the document body contents with our warning message
	document.body.innerHTML = "<center><h2>Suspicious Site Blocked by <a href='#' id='authorlink' style='color:#000000;'><u>Supicious TLD Blocker</u></a></h2><br /></center>";
	document.body.innerHTML += "<center>This website uses a non-standard domain extension and may be malicious. Go back or close this page.<br /><br /></center>";
	document.body.innerHTML += "<center>If you think this is an error, confirm the website address before ignoring this warning.<br /><br /></center>";
	document.body.innerHTML += "<center><button id='ignorePage'>Ignore Warning</button></center>";
	document.body.style.fontSize = "18px";
	document.body.style.color = "#000000";
	document.body.style.backgroundColor = "#f9d831";
	document.getElementById("ignorePage").style.padding = "6px";
	document.getElementById("ignorePage").addEventListener("click", ignorePage);
	document.getElementById("authorlink").addEventListener("click", openAuthorPage);
}

function openAuthorPage() {
	window.open("https://greasyfork.org/en/scripts/374164-suspicious-website-tld-blocker", "_blank");
}

// ignore pages by domain name, handled via GM storage
function ignorePage() {
	if (GM_setValue) {
		GM_setValue(location.hostname, "ignored");
		location.reload();
	}
}
