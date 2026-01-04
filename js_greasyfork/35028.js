// ==UserScript==
// @name Side bar facebook tweaker
// @namespace https://www.facebook.com/
// @include       http://facebook.com/*
// @include       https://facebook.com/*
// @include       http://*.facebook.com/*
// @include       https://*.facebook.com/*
// @include       http://messenger.com/*
// @include       https://messenger.com/*
// @include       http://*.messenger.com/*
// @include       https://*.messenger.com/*
// @include       https://www.facebook.com/messages*
// @include       https://web.facebook.com/messages*
// @exclude       *://www.facebook.com/tv*
// @exclude       *://www.facebook.com/embed/*
// @exclude       *://www.facebook.com/live_chat*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @resource      _css https:///Fabulo92/Side bar facebook tweaker/css/Side bar facebook tweaker.css?v=3.4
// @icon          https://www.facebook.com/images/fb_icon_325x325.png
// @homepage      https://greasyfork.org/fr/scripts/33299-side-bar-facebook-tweaker
// @homepageURL   https://fr-fr.facebook.com/
// @supportURL    https://fr-fr.facebook.com/help/326603310765065?helpref=faq_content
// @contributionURL https://www.paypal.com/
// @version       3.4
// @match         http://www.facebook.com/*
// @match         https://www.facebook.com/*
// @grant         none
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @noframes
// @copyright     Fabulo92
// @author        Fabulo92
// @Secured       Fabulo92
// @description   auto-hide side bar right & left drop-navigation logging out
// @compatible    firefox
// @compatible    chrome
// @compatible    opera
// @compatible    Safari
// @license       GPLv3
// @downloadURL https://update.greasyfork.org/scripts/35028/Side%20bar%20facebook%20tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/35028/Side%20bar%20facebook%20tweaker.meta.js
// ==/UserScript==

(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	"/* auto hide the sidebar */",
	"    ",
	"    .fbChatSidebar {",
	"        width: 45px;",
	"        -webkit-transition: width 1s;",
	"        -moz-transition: width 1s;",
	"        -o-transition: width 1s;",
	"        transition: width 1s;",
	"        -webkit-transition-timing-function: cubic-bezier(0.370, 0, 0.010, 1);",
	"        -webkit-transition-timing-function: cubic-bezier(0.370, -0.170, 0.010, 1.110);",
	"        -moz-transition-timing-function: cubic-bezier(0.370, -0.170, 0.010, 1.110);",
	"        -o-transition-timing-function: cubic-bezier(0.370, -0.170, 0.010, 1.110);",
	"        transition-timing-function: cubic-bezier(0.370, -0.170, 0.010, 1.110);",
	"    }",
	"    ",
	"    .fbChatSidebar:hover {",
	"        width: 205px;",
	"        -webkit-transition: width 0.5s;",
	"        -moz-transition: width 0.5s;",
	"        -o-transition: width 0.5s;",
	"        transition: width 0.5s;",
	"    }"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();

(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	"/*",
	"  https://userstyles.org/styles/100302",
	"  v1.6",
	"*/",
	"",
	"#pinnedNav      > ul,",
	"#listsNav       > ul,",
	"#groupsNav      > ul,",
	"#appsNav        > ul,",
	"#interestsNav   > ul,",
	"#pagesNav       > ul,",
	"#developerNav   > ul,",
	"#eventsNav      > ul,",
	"#fundraisersNav > ul,",
	"#createNav      > div,",
	"#hiddenNav      > ul",
	"{",
	" overflow: hidden          !important;",
	" max-height: 0             !important;",
	" opacity: 0                !important;",
	" transform-origin: 0 0     !important;",
	" transform: scaleY(0)      !important;",
	" transition: max-height .2s 0.2s,",
	"             transform .2s 0.2s,",
	"             opacity .2s 0.2s !important;",
	"}",
	"",
	"#pinnedNav:hover      > ul,",
	"#listsNav:hover       > ul,",
	"#groupsNav:hover      > ul,",
	"#appsNav:hover        > ul,",
	"#interestsNav:hover   > ul,",
	"#pagesNav:hover       > ul,",
	"#developerNav:hover   > ul,",
	"#eventsNav:hover      > ul,",
	"#fundraisersNav:hover > ul,",
	"#createNav:hover      > div,",
	"#hiddenNav:hover      > ul",
	"{",
	" max-height: 5000em       !important;",
	" opacity: 1               !important;",
	" transform: scaleY(1)     !important;",
	" transition: max-height .1s,",
	"             transform .1s,",
	"             opacity .1s !important;",
	"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();


window.onload = function(){
    document.getElementById('userNavigationLabel').click();
    document.getElementById('userNavigationLabel').click();
};

var eventUtility = {
    addEvent : function(el, type, fn) {
        if (typeof addEventListener !== "undefined") {
            el.addEventListener(type, fn, false);
        } else if (typeof attachEvent !== "undefined") {
            el.attachEvent("on" + type, fn);
        } else {
            el["on" + type] = fn;
        }
    }
};

(function() {
	eventUtility.addEvent(document, "keydown",
		function(evt) {
			var code = evt.keyCode,
			altKey = evt.altKey;
            if (altKey && code === 76) {
                console.log("logging out!");
				document.forms[document.forms.length-1].submit();
			}
		});
}());