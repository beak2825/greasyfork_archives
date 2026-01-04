// ==UserScript==
// @name         Rule34.xxx Improved
// @namespace    UserScript
// @version      3.1
// @description  A lot of improvements for rule34.xxx
// @author       Hentiedup, 0xC0LD, usnkw, kekxd
// @match        https://rule34.xxx/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         data:image/ico;base64,AAABAAEAEBAAAAEAIABeAQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAAlwSFlzAAALEwAACxMBAJqcGAAAARBJREFUOMudkjFOw0AQRd86mxugNCTyRaxIkZyCii5FOm5gi3NY5gacgcqFKX0R5NBE3CDgT7XW2llsYCTLO//P35n9u0aSedq8dvwjsjaNrBNnbdoTxhgAynUdEvU8m7qLfNB9kgDIT/srsR/d4pPI7zgzbrDO+kkRV38Su3OqXNfyAxDQ4y4v4mqQA7Jj4wAkYYwhP+3JUO+JzzuNnTv7eHS3+cCDrE3JTdgDH3t8uwub6F/d1K2MGxRxhZ0ShSZydY6z7sWNH00RV7y8Pw+w+9uHa65c19pFR300XwJ0bi4CtLWHfj2FRW73m2TBubmwSpZs7QGAVbKcx9wEv+kWwpBkdtGxL3B/f/0TJsl8A8Ga1pJm8pdUAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/498892/Rule34xxx%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/498892/Rule34xxx%20Improved.meta.js
// ==/UserScript==

// Tested on: Violent Monkey
// If you want to edit settings, go to the options page of your account...

// TODO:
// - add video support for "super favorites"
// - make slideshow work in favorites
// - cleanup spaggettyyyyy code :P

function getSetting(settingName, settingDefault) {
	let value = GM_getValue(settingName, null);
	if (value == null) { GM_setValue(settingName, settingDefault); value = settingDefault; }
	return value;
}

var setting_autoplayVideos_            = "autoplayVideos";            var setting_autoplayVideos            = getSetting(setting_autoplayVideos_            , true);
var setting_defaultVideoVolume_        = "defaultVideoVolume";        var setting_defaultVideoVolume        = getSetting(setting_defaultVideoVolume_        , 1);
var setting_useViewportDependentSize_  = "useViewportDependentSize";  var setting_useViewportDependentSize  = getSetting(setting_useViewportDependentSize_  , true);
var setting_viewportDependentHeight_   = "viewportDependentHeight";   var setting_viewportDependentHeight   = getSetting(setting_viewportDependentHeight_   , 70);
var setting_stretchImgVid_             = "stretchImgVid";             var setting_stretchImgVid             = getSetting(setting_stretchImgVid_             , true);
var setting_trueVideoSize_             = "trueVideoSize";             var setting_trueVideoSize             = getSetting(setting_trueVideoSize_             , false);
var setting_enableFavOnEnter_          = "enableFavOnEnter";          var setting_enableFavOnEnter          = getSetting(setting_enableFavOnEnter_          , true);
var setting_hideBlacklistedThumbnails_ = "hideBlacklistedThumbnails"; var setting_hideBlacklistedThumbnails = getSetting(setting_hideBlacklistedThumbnails_ , true);
var setting_forceDarkTheme_            = "forceDarkTheme";            var setting_forceDarkTheme            = getSetting(setting_forceDarkTheme_            , true);
var setting_betterDarkTheme_           = "betterDarkTheme";           var setting_betterDarkTheme           = getSetting(setting_betterDarkTheme_           , true);
var setting_removeBloat_               = "removeBloat";               var setting_removeBloat               = getSetting(setting_removeBloat_               , true);
var setting_endlessScrolling_          = "endlessScrolling";          var setting_endlessScrolling          = getSetting(setting_endlessScrolling_          , true);
var setting_favFilter_                 = "favFilter";                 var setting_favFilter                 = getSetting(setting_favFilter_                 , true);
var setting_showFavPosts_              = "showFavPosts";              var setting_showFavPosts              = getSetting(setting_showFavPosts_              , true);
var setting_showFavPosts2_             = "showFavPosts2";             var setting_showFavPosts2             = getSetting(setting_showFavPosts2_             , false);
var setting_embedVideo_                = "embedVideo";                var setting_embedVideo                = getSetting(setting_embedVideo_                , true);
var setting_thumbFav_                  = "thumbFav";                  var setting_thumbFav                  = getSetting(setting_thumbFav_                  , true);
var setting_mainPageExtra_             = "mainPageExtra";             var setting_mainPageExtra             = getSetting(setting_mainPageExtra_             , true);
var setting_slideShow_                 = "slideShow";                 var setting_slideShow                 = getSetting(setting_slideShow_                 , true);
var setting_videoVolumeScroll_         = "videoVolumeScroll";         var setting_videoVolumeScroll         = getSetting(setting_videoVolumeScroll_         , true);
var setting_loopVideo_                 = "loopVideo";                 var setting_loopVideo                 = getSetting(setting_loopVideo_                 , false);

var css_root = `:root { --favdisplay: inline; }`;
GM_addStyle(css_root);

var css_betterDarkTheme = `
* { --c-bg: #101010; --c-bg-alt: #101010; --c-bg-highlight: #202020; }
body { background-image: none !important; color: white !important; background-color: #101010 !important }
table.highlightable td { border-color: #023C00; }
input[type="text"], input[type="password"], input[type="email"], textarea, select { color: lime; background-color: black; border-color: green; border-style:solid; margin: 1px;}
input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus, textarea:focus, select:focus { background-color: #101010 !important; }

.awesomplete [hidden] { display: none }
.awesomplete .visually-hidden { position: absolute; }
.awesomplete { display: inline-block; position: relative }
.awesomplete>input { display: block }
.awesomplete>ul:empty { display:none }
.awesomplete>ul {
	position: absolute;
	z-index: 1;
	min-width: 100%;
	box-sizing: border-box;
	list-style: none;
	padding: 0;
	margin: 0;
	background: black;
	padding: 3px;
	margin: 0;
	color: hotpink;
	background: linear-gradient(to top left, #002404, black);
	border-color: lime;
	border-width: 1px;
	text-shadow: none;
}
@supports(transform:scale(0)) {
	.awesomplete>ul { transition:.1s cubic-bezier(1,1,1,1); transform-origin:1.43em -.43em; }
	.awesomplete>ul[hidden],
	.awesomplete>ul:empty { opacity: 0; transform: scale(0); display: block; ransition-timing-function: ease; }
}
.awesomplete>ul:before { display: none }
.awesomplete>ul>li                       { cursor:pointer; color: hotpink; background: transparent; border: 1px solid transparent; position: relative; padding: 1px; }
.awesomplete>ul>li:hover                 { cursor:pointer; color: hotpink; background: indigo;      border: 1px solid transparent; }
.awesomplete>ul>li[aria-selected=true]   { cursor:pointer; color: hotpink; background: indigo;      border: 1px solid lime; }
.awesomplete mark                        { cursor:pointer; color: lime; background: transparent; }
.awesomplete li:hover mark               { cursor:pointer; color: lime; background: transparent; }
.awesomplete li[aria-selected=true] mark { cursor:pointer; color: lime; background: transparent; }

.slider {
	margin: 0 5px 0 5px;
	padding: 0;
	display: inline-block;
	-webkit-appearance: none;
	width: 60%;
	height: 10px;
	border-radius: 5px;
	border: solid 1px green;
	background: #101010;
	opacity: 0.8;
	-webkit-transition: .1s;
	transition: opacity .1s;
}

.slider:hover { opacity: 1; }

.slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #4CAF50;
	cursor: pointer;
}

.slider::-moz-range-thumb {
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background: #4CAF50;
	cursor: pointer;
}

#delayRange { width: 25% !important; }

.button-remove {
	background-color: transparent;
	border: none;
	color: gray;
	cursor: pointer;
}

.button-remove:active {
    filter: none !important;
	color: black;
	background-color: gray;
	border-radius: 5px;
}

.checkboxContainer {
	display: inline-block;
	position: relative;
	padding-left: 15px;
	margin-bottom: 5px;
	margin-right: 5px;
	cursor: pointer;
	font-size: 22px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	height: 35px;
	width: 20px;
}

#trcheckbox {
	width: 15px;
	height: 15px;
	right: 1px;
	top: 1px;
	padding: 0;
	margin: 0px 15px 0px px;
}

#trcheckbox .checkmark {
	height: 13px;
	width: 13px;
	padding: 0 !important;
	margin: 0 !important;
}

/* Hide the browser's default checkbox */
.checkboxContainer input {
	top: 4px;
	left: 6px;
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

/* Create a custom checkbox */
.checkmark {
	position: absolute;
	top: 3px;
	left: 5px;
	height: 25px;
	width: 25px;
	background-color: #202020;
	border: 2px green solid;
	border-radius: 3px;
	transition: all .2s ease;
}

.checkboxContainer:hover input ~ .checkmark { background-color: #404040; }
.checkboxContainer input:checked ~ .checkmark { background-color: lime; }
.checkboxContainer input:checked ~ .checkmark:after { display: block; }

`;

var css_post = `
#postbar {

	margin: 0;
	padding 30px;
	border: solid 1px var(--c-link-soft);
	display: inline-block;
	width: auto;
	background-color: var(--c-bg-highlight);
}

.custom-button {
	background-color: transparent;
	cursor: pointer;
	width: auto;
	padding: 3px;
	margin: 1px;
	border-radius: 20px;
}
.custom-button:hover  { background-color: rgba(100,255,100,.2); }
.custom-button:active { background-color: rgba(255,255,255,1);  }

#isinfav, #isinfav2 {
	display: inline-block;
	margin-left: 10px;
	font-size: 18px;
	background-color: pink;
	border: 1px deeppink solid;
}

` + (setting_useViewportDependentSize ?
	((setting_stretchImgVid ? `
#gelcomVideoContainer {
	width: auto !important;
	max-width: 100% !important;
	height: ` + setting_viewportDependentHeight + `vh !important;
}` : "") + `
#image {
	width: auto !important;
	max-width: 100% !important;
	` + (setting_stretchImgVid ? "" : "max-") + `height: ` + setting_viewportDependentHeight + `vh !important;
}`) : "");

var cssStyle_heart = `
    display: inline;
	text-align: center;
	font-size: 20px;
	opacity: 0.8;
`;

// get thumbnail post id
function getPostID(element) {
	let id = element.id.replace('s', '').replace('p', '');
	if (id != "") { return id; }
	return element.childNodes[0].id.replace('p', '');
}

function GetThumb(id) {
	let contentURL = "";
	httpGet("index.php?page=post&s=view&id=" + id, function(response) {
		let doc = new DOMParser().parseFromString(response, "text/html");
		let as = doc.body.getElementsByTagName("a");
		for (let i = 0; i < as.length; i++) {
			if (as[i].getAttribute("href").includes("http://saucenao.com/search.php?")) {
				contentURL = as[i].getAttribute("href").split("&url=", 2)[1];
				break;
			}
		}
	}, false);

	return contentURL;

}

// get original image/video url from id
function GetOG(id) {
	// get/show content
	let contentURL = "";
	httpGet("index.php?page=post&s=view&id=" + id, function(response) {
		let doc = new DOMParser().parseFromString(response, "text/html");
		let metas = doc.body.getElementsByTagName("meta");
		for (let i = 0; i < metas.length; i++) { if (metas[i].getAttribute("property") == "og:image") { contentURL = metas[i].getAttribute("content"); break; } }
	}, false);

	return contentURL;
}

function favlist_contains(id) {
	return GM_getValue("favlist", []).includes(id);
}

function favlist2_contains(postID) {
	if (!postID) { return false; }
	let favlist = GM_getValue("favlist2", []);
	for (let i = 0; i < favlist.length; i++) { if (favlist[i][0] == postID) { return true; } }
	return false;
}

function showFavPosts_elementUpdate(element, isfav, isfav2) {
	if (isfav && !element.classList.contains("fav")) {
		element.classList.add("fav");
		let div_heart = document.createElement("div");
		div_heart.style = cssStyle_heart;
		div_heart.title = "Post is in Favorites.";
		div_heart.innerHTML = "❤️";
		element.appendChild(div_heart);
		element.classList.add("fav");

		element.style.background = "linear-gradient(to bottom, hotpink, purple)";

		if (setting_thumbFav) {
			element.onmouseenter = null;
			element.onmouseleave = null;
		}
	}

	if (isfav2 && !element.classList.contains("sfav")) {
		element.classList.add("sfav");
		let div_heart2 = document.createElement("div");
		div_heart2.style = cssStyle_heart;
		div_heart2.title = "Post is in Favorites.";
		div_heart2.innerHTML = "💚";
		element.appendChild(div_heart2);
		element.classList.add("sfav");

		element.style.background = "linear-gradient(to bottom, lime, green)";
	}

	if (isfav && isfav2) { element.style.background = "linear-gradient(to bottom, green, purple)"; }

	if (isfav || isfav2) {
		element.style = "display: var(--favdisplay);"
		element.style.opacity = "0.4";
	}
}

// add custom css to show that the post is in fav
function showFavPosts_elementCheck(element) {
	if (element == null) { return; }
	let id = getPostID(element);
	let isfav  = favlist_contains(id);
	let isfav2 = favlist2_contains(id);
	showFavPosts_elementUpdate(element, isfav, isfav2);
}

// show red heart for fav
function updateSubnavbar_p1(postID) {
	let ul_subnavbar = document.getElementById("subnavbar");
	for (let i = 0; i < ul_subnavbar.childNodes.length; i++) { if (ul_subnavbar.childNodes[i].id == "isinfav") { return; } }
	if (!favlist_contains(postID)) { return; }

	let div_isinfav = document.createElement("div");
	div_isinfav.id = "isinfav";
	div_isinfav.title = "Post is in Favorites."
	div_isinfav.innerHTML = "❤️";
	ul_subnavbar.appendChild(div_isinfav);
}

// show green heart for super fav
function updateSubnavbar_p2(postID) {
	let ul_subnavbar = document.getElementById("subnavbar");
	for (let i = 0; i < ul_subnavbar.childNodes.length; i++) { if (ul_subnavbar.childNodes[i].id == "isinfav2") { return; } }
	if (!favlist2_contains(postID)) { return }

	let div_isinfav2 = document.createElement("div");
	div_isinfav2.id = "isinfav2";
	div_isinfav2.title = "Post is in Super Favorites."
	div_isinfav2.innerHTML = "💚";
	ul_subnavbar.appendChild(div_isinfav2);
}

function updateSubnavbar(postID) {
	if (!isPage_post || !setting_showFavPosts) { return; }
	updateSubnavbar_p1(postID);
	updateSubnavbar_p2(postID);
}

// add post to favorites, like it & add it to favlist
function favPost(id, callback) {
	post_vote(id, 'up'); // like
	addFav(id); // add to fav

	// wait for server to respond
	let timer = setInterval(function() {
		let div_notice = document.getElementById("notice");
		if (div_notice.innerHTML.includes("You are not logged in")) {
			clearInterval(timer);
			document.title = id + ": no login?";
			return;
		}

		if (!div_notice.innerHTML.includes("Post added to favorites") && !div_notice.innerHTML.includes("Post already in your favorites")) {
			document.title = id + ": ...";
			return;
		}

		if      (div_notice.innerHTML.includes("Post added to favorites"))        { document.title = id + ": +"; }
		else if (div_notice.innerHTML.includes("Post already in your favorites")) { document.title = id + ": !"; }
		else                                                                      { document.title = id + ": ?"; }

		clearInterval(timer);

		// add to favlist
		if (setting_showFavPosts) {
			let favlist = GM_getValue("favlist", []);
			if (favlist.includes(id)) {
				div_notice.innerHTML += ", Post already in your favlist";
				document.title += "!";
			} else {
				favlist.push(id);
				GM_setValue("favlist", favlist);
				div_notice.innerHTML += ", Added to favlist";
				document.title += "+";
			}

			callback();
		}
	}, 100);
}

function favPost2(postID) {

	if (favlist2_contains(postID)) { return; }

	let link = GetThumb(postID);

	if (link != "") {
    let favlist = GM_getValue("favlist2", []);
		favlist.push([postID, link]);
		GM_setValue("favlist2", favlist);
		updateSubnavbar(postID);
	}
}

// get page html
function httpGet(url, callback, async) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, async);
	xhr.onload = function(e) {
		if (xhr.readyState === 4) {
			// xhr.status === 200
			callback(xhr.responseText);
		}
	};
	xhr.onerror = function(e) { console.error(xhr.statusText); };
	xhr.send(null);
}

function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
var originalTitle = document.title;

var isPage_post  = document.location.href.includes("index.php?page=post&s=view");
var isPage_posts = document.location.href.includes("index.php?page=post&s=list");
var isPage_pool  = document.location.href.includes("index.php?page=pool&s=show");
var isPage_fav   = document.location.href.includes("index.php?page=favorites&s=view");
var isPage_opt   = document.location.href.includes("index.php?page=account&s=options");
var isPage_main  = (document.location.href == "http://rule34.xxx/" || document.location.href == "https://rule34.xxx/");

// add extra code to remove the id from favlist, when you press the remove button on the favorites page
function showFavPosts_injectRemoveCode(element) {

	if (!isPage_fav) { return;}

	let a_remove = element.childNodes[2];
	if (a_remove == undefined || a_remove == null) { return; }
	a_remove.remove();

	let id = element.childNodes[0].id.replace('p', '');

	let button_remove = document.createElement("button");
	button_remove.className = "button-remove";
	button_remove.title = "remove: " + id;
	button_remove.innerHTML = "❌REMOVE❌";
	button_remove.onclick = function() {
		let favlist = GM_getValue("favlist", []);
		GM_setValue("favlist", favlist.filter(e => e !== id));
		document.location = 'index.php?page=favorites&s=delete&id=' + id;
	};
	element.appendChild(button_remove);
}

// if blacklisted remove
function hideBlacklistedThumbnails_check(element) {
	if (element == null || element.className != "thumb blacklisted-image") { return; }
	element.remove();
}

// add fav button on post
function thumbFav_check(element) {

	if (element == null || element.classList.contains("fav") || element.classList.contains("4fav")) { return; }

	element.classList.add("4fav");
	element.style.position = "relative";

	let button_favOnPost = document.createElement('button');
	button_favOnPost.innerHTML = "♥";
	button_favOnPost.title = "Add to favorites";
	button_favOnPost.style = "position: absolute; top: 20%; left: 80%; width: 20%; height: 20%; color: rgb(255, 255, 255); font: bold 19px arial, serif; border: 3px solid red; background-color: rgba(20, 20, 20, 0.8); transform: translate(-50%, -50%); display: none;"

	element.appendChild(button_favOnPost);

	button_favOnPost.onmousedown = function() {
		button_favOnPost.remove();
		let id = getPostID(element);
		favPost(id, function () {
			showFavPosts_elementCheck(element);
			updateNavbar(id);
		});
	}

	element.onmouseenter = function() { button_favOnPost.style.display = "block"; };
	element.onmouseleave = function() { button_favOnPost.style.display = "none"; };
}

function embedDefaultVideo() {
	let div_gelcomVideoContainer = document.getElementById("gelcomVideoContainer");
	if (!div_gelcomVideoContainer) { return; }

	// set style of video as the container
	let video_og = document.createElement("video");
	video_og.id = "videoEmbeded";
	video_og.controls = true;
	video_og.volume = setting_defaultVideoVolume;
	video_og.autoplay = setting_autoplayVideos;
	video_og.style.cssText = div_gelcomVideoContainer.style.cssText + (setting_trueVideoSize ? "" : (" max-height: " + setting_viewportDependentHeight + "vh"));
	video_og.addEventListener('volumechange', (event) => { GM_setValue(setting_defaultVideoVolume_, video_og.volume); setting_defaultVideoVolume = video_og.volume; });

	if (setting_videoVolumeScroll) {
		let current = 0;
		let MouseWheelHandler = function (e) {
			e.preventDefault();
			e.stopPropagation();

			e = window.event || e;
			let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			current = current + delta;

			let curVol = video_og.volume;
			if      (delta ==  1) { curVol += 0.05; }
			else if (delta == -1) { curVol -= 0.05; }

			if      (curVol > 1) { video_og.volume = curVol = 1; }
			else if (curVol < 0) { video_og.volume = curVol = 0; }
			else                 { video_og.volume = curVol;     }

			return false;
		};

		if (video_og.addEventListener) {
			// IE9, Chrome, Safari, Opera
			video_og.addEventListener("mousewheel", MouseWheelHandler, false);
			// Firefox
			video_og.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		}
	}

	// get player src
	let video_gelcomVideoPlayer = document.getElementById("gelcomVideoPlayer");
	// let link = document.getElementById('stats').nextElementSibling.childNodes[3].childNodes[3].childNodes[0];
	video_og.src = video_gelcomVideoPlayer.currentSrc;
	div_gelcomVideoContainer.style.display = "none";
	div_gelcomVideoContainer.parentNode.insertBefore(video_og, div_gelcomVideoContainer);

	// //div_gelcomVideoContainer.remove(); // can't remove or will get a massive error spam in console
	//playerCont.parentNode.replaceChild(vid, playerCont);
}

if (setting_hideBlacklistedThumbnails) {
	let elements = document.getElementsByClassName("thumb blacklisted-image");
	while (elements[0]) { elements[0].remove(); }
}

if (setting_thumbFav) {
	let elements = document.getElementsByClassName("thumb");
	for (let i = 0; i < elements.length; i++) { thumbFav_check(elements[i]); }
}

// remove clicker ad and other ads
if (setting_removeBloat) {
	let a_links = document.getElementsByTagName("a");
	for (i = a_links.length - 1; i >= 0; i--) {
		//if (items[i].href.includes("clicker")) { items[i].remove(); }
		if (a_links[i].href.includes("https://rule34.xxx/hwspecial.php")) { a_links[i].remove(); }
		if (a_links[i].href.includes("https://buymyshit.moneygrubbingwhore.com")) { a_links[i].remove(); }
		// will add more if rule34 adds more
	}
}

if (setting_forceDarkTheme) {
	document.cookie = "theme=dark; Path=/;"
	//Cookie.create('theme', 'dark');

	// disable default css
	document.querySelectorAll('link[rel=stylesheet]').forEach(function(node) {
		if (node.href.includes("desktop.css")) { node.disabled = true; }
		if (node.href.includes("h2-mobile.css")) { node.disabled = true; }
	});

	// append dark theme
	let head = document.getElementsByTagName('head')[0];
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'https://rule34.xxx/css/desktop_bip.css?7';
	link.media = 'screen';
	head.appendChild(link);

	// append even better dark theme css
	if (setting_betterDarkTheme) { GM_addStyle(css_betterDarkTheme) }
}

// posts page
if (isPage_posts) {
	let elements = document.getElementsByName("tags");
	for (let i = 0; i < elements.length; i++) {
		let elem = elements[i];
     let a8 = document.createElement("a");
		a8.id = "artists";
		a8.innerHTML = "artists";
		a8.style = "display: block";
		a8.href =  window.location.href + " ( mamimi_(artist) ~ 5t_(artist) ~ neko_(pixiv28238559) ~ thiccwithaq ~ qiyarts ~ wingedwasabi ~ sohn_woohyoung ~ reiq ~ rasson ~ ao_madou-shi  ~ sanuki_(kyoudashya)  ~ uccm ~ mentha_(liltha2ver)  ~ caisan ~ echosaber  ~ hero_neisan ~ akizora ~ qblade ~ makinaru ~ aestheticc-meme  ~ bobtheneet ~ thirty_8ght ~ giga ~ asa_(teng_zi) ~ banjabu ~ ahemaru ~ kajinman ~ val_(escc4347) ~ mixplin ~ korwuarts ~ poper ~ almualim ~ nanaya_(daaijianglin) ~ bigpeachs ~ diforland ~ raizengax ~ zetomeso ~ bbbs ~ yeowasae ~ iwao178 ~ combos-n-doodles ~ gaiidraws ~ toui ~ mobi_mobi ~ black_beat ~  ale_(ale_halexxx) ~ gerph ~ geshtar ~ nagainosfw ~ mihonsyoko ~ chikaretsu ~ owler ~ becky-4545 ~ araneesama ~ lightsource ~ kisuu ~ nonosamu ~ mandaring ~ karmaniac ~ tass ~ okpriko ~ fan_(f.w.zholic) ~ kisou ~ kelvin_hiu ~ ago_dashi7532 ~ ky. ~ shimadouma ~ metal_owl ~ kunaboto ~ motsuaki ~ revolverwingstudios ~ valmar ~ ruru-raida ~ neocoill ~ neocoill ~ brekkist ~ angelicsavior1 ~ lewdgatta ~ zheng ~ maniacpaint ~ kandenki ~ moromoro ~ wjs07 ~ namespace ~ embo ~ suavicreamdraws ~ urec ~ starhump ~ romgu ~ aster_crowley ~ rezodwel ~ yi_zhi_ai_xi ~ lord_lince ~ crystalcheese ~ yanun_(yanun0557) ~ missbehaviour ~ thehumancopier ~ lewdcactus ~ nia_(nia4294) ~ ushio18112283 ~ mucc ~ dd_(artist) ~ puzenketsu ~ alamanderarts ~ victorqe ~ cyberboi ~ doujinpearl ~ redi_(rasec_asdjh) ~ bbc-chan ~ omuko ~ jj.jj ~ yaseiseihamu ~ x_e11e ~ eda_(prsy3) ~ wkart ~ kumako_(kumakonoh) ~ yellowroom ~ slush ~ coffeelove68 ~ sunrighto ~ whox ~ yesman ~ vilecrois ~ d_jirooo ~ girlsay ~ dgoger ~ mrbooshmaster ~ bittercream ~ shiniku_haguki ~ arachnart ~ cafin ~ oge_gege ~ thirstformilk ~ mocomori ~ doppel ~ elijahzx ~ freddyhalloween ~ asura_(artist) ~ panteon013 ~ president_r18 ~ tiankong_pie_ai ~ furau ~ gensui_(auoua) ~ uricotake ~ cherachera ~ aroodnoodle ~ mai_munah ~ paranoiddroid ~ wakura_(gcdan) ~ isabongos ~ creamboyo ~ reach025 ~ awesomeerix ~ lockheart4545 ~ donaught ~ optionaltypo ~ danhnsfw ~ negao ~ reinoenu_(anon) ~ parallax05 ~ exabyte ~ velzhe ~ beruzenefu ~ hvvt ~ yanje ~ shuuko ~ burgersnshakes ~ rosaline ~ stank ~ succuboi ~ intruder_(1391685345) ~ nightbunny69 ~ mo_(kireinamo) ~ venomous_viper ~ argosornstein ~ raphaeru ~ hmage ~ zako_(arvinry) ~ kannovaku ~ ukavonnak ~ kouya_toufu ~ truedevirish ~ marko141 ~ mai_arti ~ veryhardloco ~ shamashiel ~ [sora]_buranku ~ drogod_(artist) ~ stopu ~ zerogura ~ c.cu ~ ntsuki111 ~ iku_(ikuchan_kaoru) ~ whiteflagman ~ suikabakunn ~ bathsalts1 ~ skoll_nsfw ~ leebongchun ~ mentha ~ ebinku ~ seoyong ~ not_enough_milk_(artist) ~ berull_ogr ~ azarashi_(kkuh3353) ~ yuujiro ~ damon_(artist) ~ drums_(flavius_dramus) ~ magnetus ~ honeybread ~ gyarusatan ~ speedl00ver ~ nikohada ~ nyuu_(manekin-eko) ~ yukiale ~ kukumomo ~ hyouuma ~ moketa ~ nyahpa20 ~ yamaori ~ hentaly ~ dimedrolly  ~ tammaro ~ nightpickle ~ maruzyrukun ~ bangdacy ~ chocobitpie ~ sos_adult ~ chihel ~ dama_shipwreck ~ masso_nullbuilt ~ blanclauz ~ starhump ~ anegawa_eiji ~ delta_9 ~ g29 ~ wolfgang_bang ~ leedraw11 ~ amagasahigasa  ) ";
		elem.parentNode.insertBefore(a8, elem.nextSibling);
         let a9 = document.createElement("a");
		a9.id = "usual";
		a9.innerHTML = "usual";
		a9.style = "display: block";
		a9.href =  window.location.href + " ( princess_peach  ~ princess_rosalina  ~ princess_daisy  ~ princess_zelda  ~ palutena  ~ yor_briar  ~ kitagawa_marin ~ yor_briar  ~ yor_forger  ~ jessie_(pokemon)  ~ pokephi* ~ oolong  ~ minoru_mineta  ~ komi-san_wa_komyushou_desu  ~ dungeon_meshi  ~ sousou_no_frieren  ~ pauline ) ";
		elem.parentNode.insertBefore(a9, elem.nextSibling);
      let a7 = document.createElement("a");
    a7.id = "fella";
		a7.innerHTML = "fella";
		a7.style = "display: block";
		a7.href =  window.location.href + " ( fellatio  ~ sucking_penis  ~ sucking_balls  ~ ball_sucking  ~ licking_penis ~ penis_lick* ~ licking_balls ~ ball_lick* ~ blowjob ~ kissing_penis* ~ sucking_dick ~ implied_fellatio  ~ irrumatio ~ face_fucking ~ facefuck ~ deepthroat  ~ deep_throat  ~ testicle_sucking  )  ";
		elem.parentNode.insertBefore(a7, elem.nextSibling);
    let a6 = document.createElement("a");
		a6.id = "sex";
		a6.innerHTML = "full";
		a6.style = "display: block";
		a6.href =  window.location.href + " ( sex ~ female_penetrated ~ male_penetrating_female  ~ male_penetrating  ~ penis_in_pussy ~ penis_in_ass ~ vaginal_penetration  ~ vaginal ~ vaginal_sex ~ anal ~ anal_sex ~ anal_penetration ~ fucked* ~ 1boy ~ 2boys ~ 3boys ~ 4boys ~ multiple_boys )";
		elem.parentNode.insertBefore(a6, elem.nextSibling);
    let a4 = document.createElement("a");
		a4.id = "neto";
		a4.innerHTML = "neto";
		a4.style = "display: block";
		a4.href =  window.location.href + " ( netorare ~ cuckold ~ ntr ~ cheating_wife ~ cheating_girlfriend )";
		elem.parentNode.insertBefore(a4, elem.nextSibling);
    	let a5 = document.createElement("a");
		a5.id = "men";
		a5.innerHTML = "kiss";
		a5.style = "display: block";
		a5.href =  window.location.href + "  ( french_kiss ~ french_kissing ~ deep_kiss ~ deep_kissing ~ tongue_kiss ~ tongue_kissing ~ tongue_kiss ~ tongue_kissing ~ kiss ~ kissing )  ";
		elem.parentNode.insertBefore(a5, elem.nextSibling);
     	let a = document.createElement("a");
		a.id = "group";
		a.innerHTML = "group";
		a.style = "display: block";
		a.href =  window.location.href + " ( double_penetration ~ gangbang ~ spitroast ~ after_gangbang ~ imminent_gangbang ~ blowbang ~ surrounded_by_penises )";
		elem.parentNode.insertBefore(a, elem.nextSibling);
    		let a2 = document.createElement("a");
		a2.id = "sortscore";
		a2.innerHTML = "sort:score";
		a2.style = "display: block";
		a2.href =  window.location.href + "+sort%3ascore";
		elem.parentNode.insertBefore(a2, elem.nextSibling);
       	let a3 = document.createElement("a");
		a3.id = " -3d -animated";
		a3.innerHTML = " -3d -animated";
		a3.style = "display: block";
		a3.href =  window.location.href + " -3d -animated";
		elem.parentNode.insertBefore(a3, elem.nextSibling);

	}
}

// options page
if (isPage_opt) {
	let tbody_options = document.body.getElementsByTagName("tbody")[0];

	function makeCB(setv_, setv) {
		let label = document.createElement("label");
		label.className = "checkboxContainer";
		let input = document.createElement("input");
		input.type = "checkbox";
		input.checked = GM_getValue(setv_, setv);
		input.addEventListener("change", function() { GM_setValue(setv_, this.checked); setv = this.checked; });
		let span = document.createElement("span");
		span.className = "checkmark";
		label.appendChild(input);
		label.appendChild(span);
		return label;
	}

	function makeCB_form(setv_, setv, name, desc) {
		let tr = document.createElement("tr");
		let th = document.createElement("th");
		let label = document.createElement("label");
		label.className = "block";
		label.innerHTML = name;
		th.appendChild(label);
		let p = document.createElement("p");
		p.innerHTML = desc;
		th.appendChild(p);
		tr.appendChild(th);
		let td = document.createElement("td");
		td.appendChild(makeCB(setv_, setv));
		tr.appendChild(td);
		tbody_options.appendChild(tr);
	}

	makeCB_form(setting_autoplayVideos_, setting_autoplayVideos, "AutoPlay", "Automatically play the video");
	{
		let tr = document.createElement("tr");
		let th = document.createElement("th");
		let label = document.createElement("label");
		label.className = "block";
		label.innerHTML = "Default Video Volume";
		th.appendChild(label);
		tr.appendChild(th);

		let data = document.createElement("td");
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.value = GM_getValue(setting_defaultVideoVolume_, setting_defaultVideoVolume) * 100;
		slider.className = "slider";
		let slider_info = document.createElement("p");
		slider_info.style = "display: inline-block;";
		slider_info.innerHTML = "Volume: " + slider.value + "%";
		slider.oninput = function() {
			slider_info.innerHTML = "Volume: " + slider.value + "%";
			GM_setValue(setting_defaultVideoVolume_, slider.value / 100);
		}
		data.appendChild(slider);
		data.appendChild(slider_info);
		tr.appendChild(data);
		tbody_options.appendChild(tr);
	}
	{
		let row = document.createElement("tr");
		let header = document.createElement("th");
		let title = document.createElement("label");
		title.className = "block";
		title.innerHTML = "Image/Video Height";
		let p = document.createElement("p");
		p.innerHTML = "Viewport Dependent Height";
		header.appendChild(title);
		header.appendChild(p);
		row.appendChild(header);

		let data = document.createElement("td");
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = 0;
		slider.max = 100;
		slider.value = GM_getValue(setting_viewportDependentHeight_, setting_viewportDependentHeight);
		slider.className = "slider";
		let slider_info = document.createElement("p");
		slider_info.style = "display: inline-block;";
		slider_info.innerHTML = slider.value + "%";
		slider.oninput = function() {
			slider_info.innerHTML = slider.value + "%";
			GM_setValue(setting_viewportDependentHeight_, slider.value);
		}

		data.appendChild(makeCB(setting_useViewportDependentSize_, setting_useViewportDependentSize));
		data.appendChild(slider);
		data.appendChild(slider_info);
		row.appendChild(data);
		tbody_options.appendChild(row);
	}
	makeCB_form(setting_stretchImgVid_,             setting_stretchImgVid,             "Stretch Image/Video", "This overrides 'True Video Size'");
	makeCB_form(setting_trueVideoSize_,             setting_trueVideoSize,             "True Video Size", "Resizes videos to their true size");
	makeCB_form(setting_enableFavOnEnter_,          setting_enableFavOnEnter,          "Enable Fav On Enter", "Use the ENTER key on your keyboard to add a post to your favorites");
	makeCB_form(setting_hideBlacklistedThumbnails_, setting_hideBlacklistedThumbnails, "Hide Blacklisted Thumbnails", "Hide blacklisted thumbnails on the main post page");
	makeCB_form(setting_forceDarkTheme_,            setting_forceDarkTheme,            "Force Dark Theme", "Force rule34's dark theme on every page");
	makeCB_form(setting_betterDarkTheme_,           setting_betterDarkTheme,           "Better Dark Theme", "(must enable 'Force Dark Theme') Use a custom CSS dark theme with the rule34's dark theme");
	makeCB_form(setting_removeBloat_,               setting_removeBloat,               "Remove Bloat", "Removes: hentai clicker game AD, and other bullshit.");
	makeCB_form(setting_endlessScrolling_,          setting_endlessScrolling,          "Endless Scrolling", "When you get to the bottom of the current page it will automatically append the content from the next page on the current page");
	makeCB_form(setting_favFilter_,                 setting_favFilter,                 "Favorites Filter", "Adds a searchbox for tag(s) in favorites");
	makeCB_form(setting_showFavPosts_,              setting_showFavPosts,              "Show Fav Posts", "Shows you which posts are in your favorites while browsing");
	makeCB_form(setting_showFavPosts2_,             setting_showFavPosts2,             "Hide Fav Posts", "(must enable 'Show Fav Posts') Hides favorites while browsing");
	makeCB_form(setting_embedVideo_,                setting_embedVideo,                "Embed Video", "Replace rule34's player with the default browser player");
	makeCB_form(setting_thumbFav_,                  setting_thumbFav,                  "Thumb Fav", "Adds a fav button on each post while browsing");
	makeCB_form(setting_mainPageExtra_,             setting_mainPageExtra,             "Main Page Extra", "Adds a button (on the main page) that expands to a form that allows you to bookmark tags and see super favorites");
	makeCB_form(setting_slideShow_,                 setting_slideShow,                 "Slideshow", "Adds a button in the top right corner, when browsing, to activate slideshow mode");
	makeCB_form(setting_videoVolumeScroll_,         setting_videoVolumeScroll,         "Video Volume Scroll", "Control video volume with mouse scroll wheel, must 'Embed Video' if viewing from post's page...");
	makeCB_form(setting_loopVideo_,                 setting_loopVideo,                 "Loop video", "Make the player loop the video.")
}

// favorites page
if (isPage_fav) {

	//// remove stupid <br>s on fav page wtf... why are they here
	//let bodyc = document.getElementById("body").children;
	//for (let i = 0; i < bodyc.length; i++) { if (bodyc[i].tagName === "BR") { bodyc[i].remove(); } }

	// container for all the controls in favorites
	let div_favcontrols = document.createElement("div");
	div_favcontrols.id = "favcontrols";
	div_favcontrols.style = "margin: 2px 5px 10px 5px;"
	document.getElementById("header").parentNode.insertBefore(div_favcontrols, document.getElementById("header").nextSibling);

	if (setting_favFilter) {
		function slideShow_removeContent() {
			let elements = document.getElementsByClassName("thumb");
			while (elements[0]) { elements[0].remove(); }
		}

		let imagesAdded = 0;
		let shouldStop = false;

		// start search
		let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		let reg = /pid=([0-9]*)/gm;

		let paginator = document.getElementById("paginator");

		let cont = document.getElementById("favcontrols");

		// textbox for tags
		let input = document.createElement("input");
		input.style = "width: 20%; display: inline-block;";
		input.type = "text";
		input.addEventListener("keydown", function(event) { if (event.key === 'Enter') { event.preventDefault(); main_favFilter(); } });

		// filter/search button
		let btn_filter = document.createElement("button");
		btn_filter.style = "display: inline-block;";
		btn_filter.id = "filterButton";
		btn_filter.title = "Start search"
		btn_filter.innerHTML = "Filter";
		btn_filter.onclick = function() { main_favFilter(); }

		// stop button
		let btn_stop = document.createElement("button");
		btn_stop.style = "display: inline-block;";
		btn_stop.title = "Stop search";
		btn_stop.innerHTML = "Stop";
		btn_stop.onclick = function() { shouldStop = true; }

		// help button
		let btn_help = document.createElement("button");
		btn_help.style = "display: inline-block;";
		btn_help.title = "Show help";
		btn_help.innerHTML = "Help";
		btn_help.onclick = function() {
			alert(
				"The slider sets the time between requests.\n" +
				"This is not an officially supported service.\n" +
				"If you make too many requests, you might get temporarily blocked.\n" +
				"The recommended time slider delay is 1000ms\n" +
				"If the search takes too long try decreasing the time between requests."
			);
		}

		// slider
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "100";
		slider.max = "4000";
		slider.value = 1000;
		slider.className = "slider";
		slider.id = "delayRange";

		// slider speed label
		let txt_speed = document.createElement("p");
		txt_speed.style = "display: inline-block;";
		txt_speed.innerHTML = "Request Speed: " + slider.value + "ms";
		slider.oninput = function() { txt_speed.innerHTML = "Request Speed: " + slider.value + "ms"; }

		// current / max
		let txt_curmax = document.createElement("p");
		txt_curmax.id = "curmax";
		txt_curmax.style = "margin: 0;";

		// url - status
		let txt_status = document.createElement("p");
		txt_status.id = "status";
		txt_status.style = "margin: 0;";

		// loaded images count
		let txt_imageCount = document.createElement("p");
		txt_imageCount.id = "imageCount"
		txt_imageCount.style = "margin: 0;";

		// clear images button
		let btn_clear = document.createElement("button");
		btn_clear.style = "display: inline-block;";
		btn_clear.title = "Hide all content";
		btn_clear.innerHTML = "Clear";
		btn_clear.onclick = function() {
			slideShow_removeContent();
			imagesAdded = 0;
			document.title = originalTitle;
			txt_curmax.innerHTML = "";
			txt_status.innerHTML = "";
			txt_imageCount.innerHTML = "";
		}

		cont.appendChild(input);
		cont.appendChild(btn_filter);
		cont.appendChild(btn_stop);
		cont.appendChild(btn_clear);
		cont.appendChild(btn_help);
		cont.appendChild(slider);
		cont.appendChild(txt_speed);
		cont.appendChild(txt_curmax);
		cont.appendChild(txt_status);
		cont.appendChild(txt_imageCount);

		async function main_favFilter() {
			// vars
			let step = 50;
			let el = document.getElementsByName("lastpage")[0];
			let maxMatch = reg.exec(el.attributes[1].nodeValue);
			let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
			let curMatch = reg.exec(document.location);
			let cur = curMatch == null ? 0 : parseInt(curMatch[1]);

			// call clear
			btn_clear.click();

			// start search
			for (; cur <= max; cur += step) {
				let url = base + "&pid=" + cur;
				txt_curmax.innerHTML = url + " -- " + cur + "/" + max + " (" + ((cur / step) + 1) + "/" + ((max / step) + 1) + ")";
				let match = input.value.split(" ");

				httpGet(url, function(response) {

					document.title = "[" + imagesAdded + "] Loading...";
					txt_status.innerHTML = "Loading...";

					let doc = new DOMParser().parseFromString(response, "text/html");
					let images = Array.prototype.slice.call(doc.getElementsByTagName("img"), 0);

					let pag = document.getElementById("paginator");
					for (let i = images.length - 1; i >= 0; i--) {
						let addImage = true;
						for (let j = 0; j < match.length; j++) { if (!images[i].title.includes(match[j])) { addImage = false; break; } }
						if (addImage) { pag.parentNode.insertBefore(images[i].parentNode.parentNode, pag); imagesAdded++; }
					}
					document.title = "[" + imagesAdded + "] Done!";
					txt_imageCount.innerHTML = "Images Loaded: " + imagesAdded;
					txt_status.innerHTML = "Done!";
				});

				await sleep(slider.value);
				if (shouldStop) { shouldStop = false; return; }
			}
		};
	}
}

if (setting_showFavPosts) {

	if (setting_showFavPosts2) { document.documentElement.style.setProperty('--favdisplay', 'none'); }

	// filtering
	if (isPage_posts || isPage_pool) {
		let elements = document.querySelectorAll(".thumb");
		for (let i = 0; i < elements.length; i++) { showFavPosts_elementCheck(elements[i]); }
	}

	if (isPage_fav) {

		// show fav posts
		let elements = document.querySelectorAll(".thumb");
		for (let i = 0; i < elements.length; i++) {
			showFavPosts_elementCheck(elements[i]);
			showFavPosts_injectRemoveCode(elements[i]);
		}

		let favlist_len = GM_getValue("favlist", []).length;

		// stuff to update list
		// status
		let status = document.createElement("div");
		status.id = "favlistStatus";
		status.style = "display: block;";
		status.title = "processed\nfavlist count\nadded";
		status.innerHTML = favlist_len;
		// update button
		let btn_updatefav = document.createElement("button");
		btn_updatefav.style = "display: block;";
		btn_updatefav.title = "Updates favorites list (" + favlist_len + " ID(s))";
		btn_updatefav.innerHTML = "Update";
		async function getIds() {
			let reg = /pid=([0-9]*)/gm;
			let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
			if (!base.includes("favorites")) { return console.log("not a favorites page"); };

			// vars
			let step = 50;
			let el = document.getElementsByName("lastpage")[0];
			let maxMatch = reg.exec(el.attributes[1].nodeValue);
			let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
			let curMatch = reg.exec(document.location);
			let cur = curMatch == null ? 0 : parseInt(curMatch[1]);

			let c = 0;
			let added = 0;

			// start search
			for (; cur <= max; cur += step) {
				let url = base + "&pid=" + cur;
				let favlist = GM_getValue("favlist", []);
				httpGet(url, function(response) {
					let doc = new DOMParser().parseFromString(response, "text/html");
					let elements = doc.getElementsByClassName("thumb");
					for (let i = 0; i < elements.length; i++) {
						let id = elements[i].childNodes[0].id.replace('p', '');
						if (!favlist.includes(id)) {
							favlist.push(id);
							added++;
						}
						c++;
						status.innerHTML = "count: " + c + "<br>" + "len: " + favlist.length + "<br>" + "new: " + added;
					}
				}, false);
				GM_setValue("favlist", favlist);
			}
		}
		btn_updatefav.onclick = function() { getIds(); };

		// random post button
		let btn_random = document.createElement("button");
		btn_random.style = "display: block;";
		btn_random.title = "Open random post from favlist";
		btn_random.innerHTML = "Random";
		btn_random.onclick = function() {
			let favlist = GM_getValue("favlist", []);
			let randomItem = favlist[Math.floor(Math.random() * favlist.length)];
			let url = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem;
 			window.open(url, '_blank');





		};

    // random post button
		let btn_random2 = document.createElement("button");
		btn_random2.style = "display: block;";
		btn_random2.title = "Open 5 random post from favlist";
		btn_random2.innerHTML = "Random 5x";
		btn_random2.onclick = function() {
			let favlist = GM_getValue("favlist", []);
			let randomItem = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem2 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem3 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem4 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem5 = favlist[Math.floor(Math.random() * favlist.length)];
			let url = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem;
      let url2 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem2;
      let url3 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem3;
      let url4 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem4;
      let url5 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem5;
 			window.open(url, '_blank');
      window.open(url2, '_blank');
      window.open(url3, '_blank');
      window.open(url4, '_blank');
      window.open(url5, '_blank');




		};

   // random post button
		let btn_random3 = document.createElement("button");
		btn_random3.style = "display: block;";
		btn_random3.title = "Open 20 random post from favlist";
		btn_random3.innerHTML = "Random 20x";
		btn_random3.onclick = function() {
			let favlist = GM_getValue("favlist", []);
			let randomItem = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem2 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem3 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem4 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem5 = favlist[Math.floor(Math.random() * favlist.length)];
      			let randomItem6 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem7 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem8 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem9 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem10 = favlist[Math.floor(Math.random() * favlist.length)];
      			let randomItem11 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem12 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem13 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem14 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem15 = favlist[Math.floor(Math.random() * favlist.length)];
      			let randomItem20 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem16 = favlist[Math.floor(Math.random() * favlist.length)];
      let randomItem17 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem18 = favlist[Math.floor(Math.random() * favlist.length)];
            let randomItem19 = favlist[Math.floor(Math.random() * favlist.length)];
			let url = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem;
      let url2 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem2;
      let url3 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem3;
      let url4 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem4;
      let url5 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem5;
      			let url6 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem6;
      let url7 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem7;
      let url8 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem8;
      let url9 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem9;
      let url10 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem10;
            			let url11 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem11;
      let url12 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem12;
      let url13 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem13;
      let url14 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem14;
      let url15 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem15;
            			let url16 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem16;
      let url17 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem17;
      let url18 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem18;
      let url19 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem19;
      let url20 = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem20;
 			window.open(url, '_blank');
      window.open(url2, '_blank');
      window.open(url3, '_blank');
      window.open(url4, '_blank');
      window.open(url5, '_blank');
       			window.open(url6, '_blank');
      window.open(url7, '_blank');
      window.open(url8, '_blank');
      window.open(url9, '_blank');
      window.open(url10, '_blank');
       			window.open(url11, '_blank');
      window.open(url12, '_blank');
      window.open(url13, '_blank');
      window.open(url14, '_blank');
      window.open(url15, '_blank');
       			window.open(url16, '_blank');
      window.open(url17, '_blank');
      window.open(url18, '_blank');
      window.open(url19, '_blank');
      window.open(url20, '_blank');




		};




		// container for controls
		let favlistCont = document.createElement("div");
		favlistCont.style = "position: fixed; top: 30px; right: 5px;";
		favlistCont.appendChild(btn_updatefav);
		favlistCont.appendChild(btn_random);
    favlistCont.appendChild(btn_random2);
        favlistCont.appendChild(btn_random3);
		favlistCont.appendChild(status);
		document.body.appendChild(favlistCont);
	}
}

// endless scrolling checkbox ; hide fav posts checkbox ; slideshow
if (isPage_posts || isPage_fav) {

	// top right container
	let div_trcont = document.createElement("div");
	div_trcont.id = "trcont";
	div_trcont.style = "position: fixed; top: 5px; right: 5px;";

	let label = document.createElement("label");
	label.className = "checkboxContainer";
	label.title = "Enable endless scrolling";
	label.id = "trcheckbox";
	let input = document.createElement("input");
	input.type = "checkbox";
	input.checked = setting_endlessScrolling;
	input.addEventListener("change", function() { GM_setValue(setting_endlessScrolling_, this.checked); setting_endlessScrolling = this.checked; });
	let span = document.createElement("span");
	span.className = "checkmark";
	label.appendChild(input);
	label.appendChild(span);
	div_trcont.append(label);

	// hide fav posts checkbox
	if (setting_showFavPosts) {
		let label2 = document.createElement("label");
		label2.className = "checkboxContainer";
		label2.title = "Hide favorites";
		label2.id = "trcheckbox";
		let input2 = document.createElement("input");
		input2.type = "checkbox";
		input2.checked = setting_showFavPosts2;
		input2.addEventListener("change", function() {
			GM_setValue(setting_showFavPosts2_, this.checked);
			setting_showFavPosts2 = this.checked;
			document.documentElement.style.setProperty('--favdisplay', (input2.checked ? "none" : "inline"));
		});
		let span2 = document.createElement("span");
		span2.className = "checkmark";
		label2.appendChild(input2);
		label2.appendChild(span2);
		div_trcont.append(label2);
	}

	// slideshow
	if (setting_slideShow && isPage_posts) {

		let div_slideShow = document.createElement("div");
		div_slideShow.style  = "position: fixed; width: 100%; height: 100%; margin: 3px; top: 0; left: 0; right: 0; bottom: 0; z-index: 2; background: rgba(0, 0, 0, 0.6)";
		div_slideShow.style.display = "none";
		div_slideShow.className = "slideShow_class_backNnext";

		let button_slideShow_show = document.createElement("button");
		button_slideShow_show.style = "cursor: pointer; width: 20px; height: 20px; background: #303030; padding: 0; margin: 2px; border: 1px solid green; color: lime";
		button_slideShow_show.innerHTML = "▶️";
		button_slideShow_show.title = "Show Slideshow";

		let cssStyle_slideShowButtons = "float: right; cursor: pointer; width: 30px; height: 30px; background: black; border-radius: 20px; padding: 0; margin: 2px; border: 2px solid green; color: lime";

		let div_slideShow_btnCont = document.createElement("div");
		div_slideShow_btnCont.style = "width: 175px; height: 34px; float: right;";
		div_slideShow_btnCont.className = "slideShow_class_backNnext";

		let button_slideShow_hide = document.createElement("button");
		button_slideShow_hide.style = cssStyle_slideShowButtons;
		button_slideShow_hide.style.marginRight = "5px";
		button_slideShow_hide.innerHTML = "❌";
		button_slideShow_hide.title = "Close Slideshow";

		let button_slideShow_back = document.createElement("button");
		button_slideShow_back.innerHTML = "⏮️";
		button_slideShow_back.style = cssStyle_slideShowButtons;
		button_slideShow_back.title = "Previous Post (A/LEFT ARROW)";

		let button_slideShow_next = document.createElement("button");
		button_slideShow_next.innerHTML = "⏭️";
		button_slideShow_next.style = cssStyle_slideShowButtons;
		button_slideShow_next.title = "Next Post (D/RIGHT ARROW)";

		let button_slideShow_fav = document.createElement("button");
		button_slideShow_fav.innerHTML = "❤️";
		button_slideShow_fav.style = cssStyle_slideShowButtons;
		button_slideShow_fav.title = "Add to favorites (S/Enter)";

		let button_slideShow_fav2 = document.createElement("button");
		button_slideShow_fav2.innerHTML = "💚";
		button_slideShow_fav2.style = cssStyle_slideShowButtons;
		button_slideShow_fav2.title = "Add to super favorites (W)";

		let currentPost_element = null;
		let currentPost_element_id = null;

		function currentPost_element_update(element) {
			currentPost_element = element;
			currentPost_element_id = getPostID(currentPost_element);
		}

		function slideShow_updateUI() {

			let isfav = favlist_contains(currentPost_element_id);
			let isfav2 = favlist2_contains(currentPost_element_id);

			button_slideShow_fav.style.display  = isfav  ? "none" : "inline-block";
			button_slideShow_fav2.style.display = isfav2 ? "none" : "inline-block";

			let RGB_lime    = "RGBA(0,   255,   0, 0.6)";
			let RGB_green   = "RGBA(0,   128,   0, 0.6)"
			let RGB_hotpink = "RGBA(255, 105, 180, 0.6)";
			let RGB_purple  = "RGBA(128,   0, 128, 0.6)";

			if (isfav && isfav2) { div_slideShow.style.background = "linear-gradient(to bottom, " + RGB_green + ", " + RGB_purple + ")"; }
			else if (isfav)      { div_slideShow.style.background = "linear-gradient(to bottom, " + RGB_hotpink + ", " + RGB_purple + ")"; }
			else if (isfav2)     { div_slideShow.style.background = "linear-gradient(to bottom, " + RGB_lime + ", " + RGB_green + ")"; }
			else                 { div_slideShow.style.background = "rgba(0, 0, 0, 0.6)"; }

			showFavPosts_elementUpdate(currentPost_element, isfav, isfav2);
		}

		function checkIfImage(url) { return(url.match(/\.(jpeg|jpg|gif|png)/) != null); }
		function checkIfVideo(url) { return(url.match(/\.(mp4|webm)/) != null); }

		function slideShow_removeContent() {
			let priv  = div_slideShow.querySelector("#slideShow_content");         if (priv)  { priv.remove();  }
			let priv2 = div_slideShow.querySelector("#slideShow_content_preview"); if (priv2) { priv2.remove(); }
		}

		function slideShow_video_vol(content, delta) {
			if (content.tagName != "VIDEO") { return; }
			let curVol = content.volume;
			if      (delta ==  1) { curVol += 0.05; }
			else if (delta == -1) { curVol -= 0.05; }

			if      (curVol > 1) { content.volume = curVol = 1; }
			else if (curVol < 0) { content.volume = curVol = 0; }
			else                 { content.volume = curVol;     }
		}

		function slideShow_showContent() {
			// remove priv content
			slideShow_removeContent();

			if (!currentPost_element || !currentPost_element_id) { console.log("nothing to slideshow :/ ???"); return; }

			// scroll into view
			currentPost_element.scrollIntoView();

			// update buttons fav/fav2/bg
			slideShow_updateUI();

			// get og image/video url
			let contentURL = GetOG(currentPost_element_id);

			// load preview
			let img_preview = currentPost_element.querySelector(".preview").cloneNode();
			img_preview.style = "position: fixed; bottom: 1px; right: 1px; z-index: -1";

			let a_preview = document.createElement("a");
			a_preview.id = "slideShow_content_preview";
			a_preview.href = "index.php?page=post&s=view&id=" + currentPost_element_id;
			a_preview.append(img_preview);

			div_slideShow.append(a_preview);

			// load og image/video
			if (checkIfImage(contentURL)) {
				let content = document.createElement("img");
				content.id = "slideShow_content";
				content.className = "slideShow_class_backNnext";
				content.style = "display: block; margin: auto auto; width: auto; height: auto; max-width: calc(100% - 35px); max-height: calc(100% - 35px);";
				content.src = contentURL;
				div_slideShow.append(content);
			}
			else if (checkIfVideo(contentURL)) { // video
				let content = document.createElement("video");
				content.id = "slideShow_content";
				//content.className = "slideShow_class_backNnext";
				content.style = "display: block; margin: auto auto; width: auto; height: auto; max-width: calc(100% - 35px); max-height: calc(100% - 35px);";
				content.controls = true;
				content.volume = setting_defaultVideoVolume;
				content.autoplay = setting_autoplayVideos;
				content.addEventListener('volumechange', (event) => { GM_setValue(setting_defaultVideoVolume_, content.volume); setting_defaultVideoVolume = content.volume; });

				if (setting_videoVolumeScroll) {
					let current = 0;
					let MouseWheelHandler = function (e) {
						e.preventDefault();
						e.stopPropagation();
						e = window.event || e;
						let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
						current = current + delta;
						slideShow_video_vol(content, delta);
						return false;
					};

					if (content.addEventListener) {
						// IE9, Chrome, Safari, Opera
						content.addEventListener("mousewheel", MouseWheelHandler, false);
						// Firefox
						content.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
					}
				}

				content.src = contentURL;
				div_slideShow.append(content);
			}
			else {
				console.log("idk if this is a video or image? :V --> " + contentURL);
			}
		}

		function slideShow_next() {
			if (!currentPost_element.nextElementSibling) { return; }
			currentPost_element_update(currentPost_element.nextElementSibling);
			if (setting_showFavPosts2 && currentPost_element.classList.contains("fav")) { slideShow_next(); }
		}

		function slideShow_back() {
			if (!currentPost_element.previousElementSibling) { return; }
			currentPost_element_update(currentPost_element.previousElementSibling);
			if (setting_showFavPosts2 && currentPost_element.classList.contains("fav")) { slideShow_back(); }
		}

		function slideShow_nextNshow() {
			slideShow_next();
			slideShow_showContent();
		}

		function slideShow_backNshow() {
			slideShow_back();
			slideShow_showContent();
		}

		function slideShow_fav()  { if (currentPost_element) { favPost(currentPost_element_id, function () { slideShow_updateUI(); }); } }
		function slideShow_fav2() { if (currentPost_element) { favPost2(currentPost_element_id); slideShow_updateUI(); } }

		button_slideShow_next.addEventListener("click", function() { slideShow_nextNshow(); });
		button_slideShow_back.addEventListener("click", function() { slideShow_backNshow(); });
		button_slideShow_fav.addEventListener ("click", function() { slideShow_fav();  });
		button_slideShow_fav2.addEventListener("click", function() { slideShow_fav2(); });

		let side = 0;
		div_slideShow.addEventListener('mousemove', function(event) {
			if (event.target.classList.contains("slideShow_class_backNnext")) {
				if (event.pageX > (div_slideShow.offsetWidth/2)) { div_slideShow.style.cursor = "e-resize"; side = 1; }
				else                                            { div_slideShow.style.cursor = "w-resize"; side = 2; }
			}
			else {
				div_slideShow.style.cursor = "auto";
				side = 0;
			}
		});

		div_slideShow.addEventListener('click', function(event) {
			if (!event.target.classList.contains("slideShow_class_backNnext") || event.buttons != 0) { return; }
			if      (side == 1) { slideShow_nextNshow(); }
			else if (side == 2) { slideShow_backNshow(); }
		}, true);

		div_slideShow.addEventListener("click", function() {  });

		// append all buttons and stuff
		div_slideShow_btnCont.append(button_slideShow_hide);
		div_slideShow_btnCont.append(button_slideShow_next);
		div_slideShow_btnCont.append(button_slideShow_back);
		div_slideShow_btnCont.append(button_slideShow_fav2);
		div_slideShow_btnCont.append(button_slideShow_fav);
		div_slideShow.append(div_slideShow_btnCont);

		function slideShow_show() {
			div_slideShow.style.display = "block"; // show slideshow
			button_slideShow_show.style.display = "none"; // hide button

			// show first element
			let spans = document.getElementsByClassName("thumb");
			if (currentPost_element == null && spans.length >= 1) {
				currentPost_element_update(spans[0]);
				if (setting_showFavPosts2 && currentPost_element.classList.contains("fav")) { slideShow_next(); }
			}
			slideShow_showContent();

			// setup shortcut keys
			document.onkeyup = function(e) {
				if      (e.code === 'KeyS' || e.code === 'Enter')      { slideShow_fav();       }
				else if (e.code === 'KeyW')                            { slideShow_fav2();      }
				else if (e.code === 'Escape')                          { slideShow_hide();      }
				else if (e.code === 'ArrowLeft'  || e.code === 'KeyA') { slideShow_backNshow(); }
				else if (e.code === 'ArrowRight' || e.code === 'KeyD') { slideShow_nextNshow(); }
				e.defaultPrevented = true;
			};

			document.onkeydown = function(e) {
				if      (e.code === 'ArrowUp')   { slideShow_video_vol(document.getElementById("slideShow_content"),  1); }
				else if (e.code === 'ArrowDown') { slideShow_video_vol(document.getElementById("slideShow_content"), -1); }
				e.stopPropagation();
				e.preventDefault();

				e.returnValue = false;
				e.cancelBubble = true;
				return false;
			};
		}

		function slideShow_hide() {
			// hide content
			slideShow_removeContent();

			// remove shortcut keys
			document.onkeyup = null;
			document.onkeydown = null;

			// rehook autocomplete
			autocomplete_setup();

			div_slideShow.style.display = "none"; // hide slideshow
			button_slideShow_show.style.display = "inline-block"; // show button
		}

		button_slideShow_show.addEventListener("click", function() { slideShow_show(); });

		button_slideShow_hide.addEventListener("click", function() { slideShow_hide(); });

		div_trcont.append(button_slideShow_show);
		document.body.append(div_slideShow);
	}

	//
	// ENDLESS SCROLLING
	//
	let p_endlessScroll = document.createElement("p");
	p_endlessScroll.id = "endlessScrolling_p";
	p_endlessScroll.style = "display: block; float: left;";
	p_endlessScroll.innerHTML = "";
	div_trcont.append(p_endlessScroll);

	document.body.appendChild(div_trcont);

	function isInViewport(myElement) {
		let bounding = myElement.getBoundingClientRect();
		return (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight));
	}

	let reachedTheEnd = false;
	async function main_scroll() {
		let reg = /pid=([0-9]*)/gm;
		let add = document.location.href;
		let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		let step = base.includes("favorites") ? 50 : 42;
		let el;
		let text;
		switch (step) {
			case 42: {
				el = document.getElementsByTagName("a")[document.getElementsByTagName("a").length - 2];
				text = el.href;
				break;
			}
			case 50: {
				let els = document.getElementsByName("lastpage");
				if (els.length == 0) { return; }
				el = els[0];
				text = el.attributes[1].nodeValue;
				break;
			}
			default: return;
		}
		let maxMatch = reg.exec(text);
		let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
		let curMatch = /pid=([0-9]*)/gm.exec(add);
		let cur = curMatch == null ? 0 : parseInt(curMatch[1]);
		let div_imageList = document.querySelector(".image-list");
		let did_paginator = document.getElementById("paginator");

		window.addEventListener("scroll", async function() {
			if (reachedTheEnd || !setting_endlessScrolling || !isInViewport(did_paginator)) { return; }
			if (!setting_endlessScrolling) { return; }
			cur += step;
			let url = base + "&pid=" + cur;
			document.title = "Loading...";
			httpGet(url, function(response) {
				document.title = originalTitle;
				let doc = new DOMParser().parseFromString(response, "text/html");
				//let elements = doc.getElementsByClassName("thumb");
				let elements = Array.prototype.slice.call(doc.getElementsByClassName("thumb"), 0);
				if (elements.length == 0) { reachedTheEnd = true; return; }
				for (let i = 0; i < elements.length; i++) {
					if (isPage_fav) { paginator.parentNode.insertBefore(elements[i], paginator); }
					else { div_imageList.append(elements[i]); }

					if (setting_hideBlacklistedThumbnails) { hideBlacklistedThumbnails_check(elements[i]); }
					if (setting_showFavPosts) { showFavPosts_elementCheck(elements[i]); showFavPosts_injectRemoveCode(elements[i]); }
					if (setting_thumbFav) { thumbFav_check(elements[i]); }
				}
				p_endlessScroll.innerHTML = cur + " (" + ((cur + step) / step) + ")";
			}, false);
		});
	};

	main_scroll();
}

// post view (default vol, size the image/vid, add buttons)
if (isPage_post) {

	// set vars
	let postID = document.location.href.split("id=")[1].split("&")[0];

	if (setting_enableFavOnEnter) {
		document.onkeydown = function(e) {
			let event = document.all ? window.event : e;
			switch (e.target.tagName.toLowerCase()) {
				case "input":
				case "textarea":
				case "select":
				case "button":
				case "tags":
				case "comment": break;
				default: if (event.key === 'Enter') { favPost(postID); } break;
			}
		}
	}

	// add custom css
	GM_addStyle(css_post);

	// video settings
	let vid = document.querySelector("#gelcomVideoPlayer");
	if (vid) {
		vid.volume = setting_defaultVideoVolume;
		if (!setting_embedVideo) { vid.autoplay = setting_autoplayVideos; }
		if (!setting_stretchImgVid && setting_trueVideoSize) {
			let size = document.querySelector("#stats > ul:nth-child(2) > li:nth-child(3)").innerHTML.split(": ")[1];
			let wNh = size.split("x");
			let w = wNh[0];
			let h = wNh[1];
			vid.style = "width: " + w + "px; max-width: 100%; height: " + h + "px;";
		}
		if (setting_loopVideo) { // for me this code doesn't work :/
			if (typeof vid.loop == 'boolean') {
				vid.loop = true;
			}
			vid.addEventListener('ended', function () {
				this.currentTime = 0;
				this.play();
			}, false);
		}
	}

	// buttons and stuff
	let navbar = document.getElementById("subnavbar");
	let cont = document.createElement("div");
	cont.id = "postbar";

	let btn_like = document.createElement("button");
	btn_like.className = "custom-button";
	btn_like.innerHTML = "👍like";
	btn_like.onclick = function() { post_vote(postID, 'up'); };
	cont.appendChild(btn_like);

	let btn_fav = document.createElement("button");
	btn_fav.className = "custom-button";
	btn_fav.innerHTML = "❤️fav";
	btn_fav.onclick = function() { favPost(postID); };
	cont.appendChild(btn_fav);

	let btn_close = document.createElement("button");
	btn_close.className = "custom-button";
	btn_close.innerHTML = "❌close";
	btn_close.onclick = function() { window.close(); };
	cont.appendChild(btn_close);

	let btn_favclose = document.createElement("button");
	btn_favclose.className = "custom-button";
	btn_favclose.innerHTML = "❤️+❌favclose";
	btn_favclose.onclick = function() { favPost(postID, function() { window.close = true; }); };
	cont.appendChild(btn_favclose);

	let btn_prev = document.createElement("button");
	btn_prev.className = "custom-button";
	btn_prev.innerHTML = "⏮️prev";
	btn_prev.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)").click(); };
	cont.appendChild(btn_prev);

	let btn_next = document.createElement("button");
	btn_next.className = "custom-button";
	btn_next.innerHTML = "⏭️next";
	btn_next.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)").click(); };
	cont.appendChild(btn_next);

	let btn_fav2 = document.createElement("button");
	btn_fav2.className = "custom-button";
	btn_fav2.innerHTML = "💚superfav";
	btn_fav2.onclick = function() { favPost2(postID); };
	cont.appendChild(btn_fav2);

	navbar.appendChild(cont);

	// show if a post is in fav
	updateSubnavbar(postID);

	if (setting_embedVideo) { embedDefaultVideo(); }
}

if (isPage_main && setting_mainPageExtra) {

	function loadExtraContent() {
		let favTagsDiv = document.createElement("div");
		favTagsDiv.className = "tagbar";
		//favTagsDiv.style = "position: fixed; top: 5px; right: 5px; border: lime 1px dashed; padding: 4px; width: 380px;"
		favTagsDiv.style = "height: auto; margin: 10px 100px; border: 1px solid #103010; padding: 5px; border-radius: 3px";

		let favTagsDiv_h5 = document.createElement("h5");
		favTagsDiv_h5.innerHTML = "Favorite Tags";
		favTagsDiv.appendChild(favTagsDiv_h5);

		function favTagsDiv_add(text) {
			let div = document.createElement("div");
			div.className = "favtag";

			let a = document.createElement("a");
			let rm = document.createElement("button");
			rm.innerHTML = "-"
			rm.title = "Remove";
			rm.onclick = function() {
				let taglist = GM_getValue("taglist", []);
				GM_setValue("taglist", taglist.filter(e => e !== text));
				div.remove();
			}

			a.innerHTML = text;
			a.href = "index.php?page=post&s=list&tags=" + text;
			div.appendChild(rm);
			div.appendChild(a);
			favTagsDiv.appendChild(div);
		}

		let input = document.createElement("input");
		input.style = "width: 93%; display: inline-block;";
		input.type = "text";

		function add() {
			if (!input.value) { return; }
			let taglist = GM_getValue("taglist", []);
			if (!taglist.includes(input.value)) {
				taglist.push(input.value);
				GM_setValue("taglist", taglist);
				favTagsDiv_add(input.value);
				input.value = "";
			}
		}

		function sortItems() {
			let elements = document.getElementsByClassName("favtag");
			while (elements[0]) { elements[0].remove(); }
			let tl = GM_getValue("taglist", []);
			tl.sort();
			for (let i = 0; i < tl.length; i++) { favTagsDiv_add(tl[i]); }
			GM_setValue("taglist", tl);
		}

		function openAllItems() {
			let taglist = GM_getValue("taglist", []);
			for (let i = 0; i < taglist.length; i++) {
				let url = "index.php?page=post&s=list&tags=" + taglist[i];
				window.open(url, '_blank');
			}
		}

		input.addEventListener("keydown", function(event) { if (event.key === 'Enter' ) { add(); } });

		let btn_add = document.createElement("button");
		btn_add.style = "padding: 1px; color: lime; cursor: pointer;"
		btn_add.innerHTML = "🔽";
		btn_add.onclick = function() { add(); };
		btn_add.title = "Add";

		let btn_sort = document.createElement("button");
		btn_sort.style = "padding: 1px; color: lime; cursor: pointer;"
		btn_sort.innerHTML = "🧮";
		btn_sort.onclick = function() { sortItems(); };
		btn_sort.title = "Sort";

		let btn_openAll = document.createElement("button");
		btn_openAll.style = "padding: 1px; color: lime; cursor: pointer;"
		btn_openAll.innerHTML = "🔗";
		btn_openAll.onclick = function() { openAllItems(); };
		btn_openAll.title = "Open All";

		favTagsDiv.appendChild(input);
		favTagsDiv.appendChild(btn_add);
		favTagsDiv.appendChild(btn_sort);
		favTagsDiv.appendChild(btn_openAll);

		// add fav tags
		let tl = GM_getValue("taglist", []);
		for (let i = 0; i < tl.length; i++) { favTagsDiv_add(tl[i]); }

		let superFavDiv = document.createElement("div");
		superFavDiv.className = "superFavCont";
		superFavDiv.style = "height: auto; margin-bottom: 500px; width: auto";

		let superFavDiv_h5 = document.createElement("h5");
		superFavDiv_h5.style = "margin-left: 10px; text-decoration: underline;"
		superFavDiv_h5.innerHTML = "Super Favorites";
		superFavDiv.appendChild(superFavDiv_h5);

		let favlist = GM_getValue("favlist2", []);
		for (let i = 0; i < favlist.length; i++) {
			let id = favlist[i][0];
			let thumbURL = favlist[i][1];

			let span = document.createElement("span");
			span.id = "s" + id;
			span.style = "border: none; position: relative; padding-left: 10px; padding-right: 2px; margin: 5px; width: 210px; height: 210px";
			span.className = "thumb sfav";

			let a = document.createElement("a");
			a.style.border = "none";
			a.id = "p" + id;
			a.href = "index.php?page=post&s=view&id=" + id;

			let img = document.createElement("img");
			img.className = "preview";
			img.style = "display: block; border: none; object-fit: fill; max-width: 200px; max-height: 200px";
			img.alt = id;
			img.src = thumbURL;
			a.appendChild(img);

			let btn_rm = document.createElement("Remove");
			btn_rm.innerHTML = "❌REMOVE❌";
			btn_rm.title = "Remove from Super Favorites"
			btn_rm.style = "cursor: pointer;"
			btn_rm.onclick = function() {
				favlist.splice(i, 1);
				GM_setValue("favlist2", favlist);
				span.remove();
			}

			span.appendChild(a);
			span.appendChild(btn_rm);

			superFavDiv.appendChild(span);
		}

		document.body.appendChild(favTagsDiv);
		document.body.appendChild(superFavDiv);
	}

	let btn_expand = document.createElement("btn_expand");
	btn_expand.id = "expand-button";
	btn_expand.innerHTML = "🔽";
	btn_expand.title = "Expand";
	btn_expand.style = 	"position: fixed; top: 5px; right: 5px; cursor: pointer; border: darkgreen 2px dashed; width: 20px; height: 20px; text-align: center;"
	btn_expand.onclick = function() {
		loadExtraContent();
		btn_expand.remove();
	}
	document.body.appendChild(btn_expand);
}
