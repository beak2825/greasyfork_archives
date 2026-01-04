// ==UserScript==
// @name         Youtube - Restore Classic
// @version      1.0.10
// @description  If youtube is in the new 2017 YouTube Material Redesign, automatically restore classic view
// @author       Cpt_mathix
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/tv*
// @exclude      https://www.youtube.com/embed/*
// @exclude      https://www.youtube.com/live_chat*
// @license      GPL-2.0-or-later
// @namespace    https://greasyfork.org/users/16080
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/34818/Youtube%20-%20Restore%20Classic.user.js
// @updateURL https://update.greasyfork.org/scripts/34818/Youtube%20-%20Restore%20Classic.meta.js
// ==/UserScript==

(function() {
    console.log("run init");

    init();

    document.addEventListener("spfdone", function(e) {
        console.log("run spfdone");
        document.getElementById("content").classList.add("content-alignment");
		document.getElementById("body").classList.remove("sitewide-ticker-visible");
        document.getElementById("old-browser-alert").remove();
	});

    function init() {
        restoreClassicYoutube();
        document.addEventListener('DOMContentLoaded', function(){
            hideNewYoutubeBanner();
        }, false);
    }

    function restoreClassicYoutube() {
        // Cookies are enabled?
        if (!navigator.cookieEnabled) {
            console.log("Error: Youtube - Restore Classic doesn't work if cookies are disabled");
            return;
        }

        if (!document.cookie) {
            createCookieAndReload();
            return;
        }

        var cookie = getCookie("PREF")
        if (cookie) {
            console.log("current PREF cookie: " + cookie);

            if (cookie.search(/f6=(8|9)(&|;|$)/) === -1) {
                replaceCookieAndReload(cookie);
            } else {
                deleteCache("reloadCount");
            }
        } else {
            createCookieAndReload();
        }
    }

    function getCookie(name) {
        var cookie = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (cookie && cookie[1]) {
            return cookie[1];
        }
        return null;
    }

    function createCookieAndReload() {
        document.cookie = "PREF=f6=8;path=/;domain=.youtube.com";
        reload();
    }

    function replaceCookieAndReload(cookie) {
        if (cookie.search(/f6=[^;&]*/) > 0) {
            document.cookie = "PREF=" + cookie.replace(/f6=[^;&]*/, 'f6=8') + ";path=/;domain=.youtube.com";
        } else {
            document.cookie = "PREF=" + cookie + "&f6=8;path=/;domain=.youtube.com";
        }
        reload();
    }

    function reload() {
        var reloadCount = getCache("reloadCount");
        if (reloadCount && parseInt(reloadCount) <= 3) {
            setCache("reloadCount", parseInt(reloadCount) + 1);
            location.reload();
        } else if (reloadCount && parseInt(reloadCount) > 3) {
            console.log("Youtube - Restore Classic\nSomething went wrong... Please post the following information on greasyfork and disable this script\n\nDebug information:\nCookies enabled: " + navigator.cookieEnabled + "\nCurrent cookies: " + getCookie("PREF"));
            deleteCache("reloadCount");
        } else {
            setCache("reloadCount", 1);
            location.reload();
        }
    }

    function getCache(key) {
		return JSON.parse(localStorage.getItem("YTRestore#" + key));
	}

	function deleteCache(key) {
		localStorage.removeItem("YTRestore#" + key);
	}

	function setCache(key, value) {
		localStorage.setItem("YTRestore#" + key, JSON.stringify(value));
	}

    function hideNewYoutubeBanner() {
        document.getElementById("content").classList.add("content-alignment");
        document.getElementById("body").classList.remove("sitewide-ticker-visible");
        document.getElementById("old-browser-alert").remove();

		var css = `
#ticker {
    display: none!important;
}
`;

		var style = document.createElement("style");
		style.type = "text/css";
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		document.documentElement.appendChild(style);
	}
})();