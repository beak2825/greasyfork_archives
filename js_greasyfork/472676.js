/* This Userscript helps you preserving websites by automatically saving pages you visit, including their linked subpages and other linked URLs, into Internet Archive's Wayback Machine.
Run this UserScript using the following tools:
Desktop browsers:
* GreaseMonkey for Mozilla Firefox:	 https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
* TamperMonkey for Google Chrome:	 https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
* TamperMonkey for Chromium-Opera Browser:	 https://addons.opera.com/en/extensions/details/tampermonkey-beta/
Android browsers:
* https://addons.mozilla.org/en-US/android/addon/greasemonkey/versions/
* https://openuserjs.org/about/Tampermonkey-for-Android/
* https://play.google.com/store/apps/details?id=net.biniok.tampermonkey
* https://addons.mozilla.org/en-US/android/addon/tampermonkey/
Websites:
* https://www.greasespot.net/
* https://www.tampermonkey.net/
Also read: https://en.wikipedia.org/wiki/userscript .
Original userscript: https://userscripts.org/scripts/show/383915
	Mirror 1: https://userscripts-mirror.org/scripts/show/383915
	Mirror 2: https://greasyfork.org/en/scripts/368062-autosave-to-internet-archive-wayback-machine/
	Mirror 3: https://www.ArchiveTeam.org/index.php/User:ATrescue/383915.user.js
Enhanced version (this script): https://www.archiveteam.org/index.php?title=User:ATrescue/AutoWB.js
*/

// ==UserScript==
// @name	AutoSave to Internet Archive - Wayback Machine - Enhanced Edition
// @namespace      Flare0n
// @description    Automatically save the page you visited and all links on the page to the Internet Archive's Wayback Machine.
// @version	1.0.3e
/* Enhanced version. */ /* Original version 1.0.3 released on 201402220230. First version released on 201402140455. */
// @match	*
// @match	http://archiveofourown.org/*
// @match	https://archiveofourown.org/*
// @match	http://wayback.archive.org/web/*
// @match	https://wayback.archive.org/web/*
// @match	http://web.archive.org/web/*
// @match	https://web.archive.org/web/*
// @match	http://web.archive.org/save/*
// @match	https://web.archive.org/save/*
// @match	http://web.archive.org/record/*
// @match	https://web.archive.org/record/*
// @grant	GM_xmlhttpRequest
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/472676/AutoSave%20to%20Internet%20Archive%20-%20Wayback%20Machine%20-%20Enhanced%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/472676/AutoSave%20to%20Internet%20Archive%20-%20Wayback%20Machine%20-%20Enhanced%20Edition.meta.js
// ==/UserScript==

/*  CryptoCurrency donation ID's left by original developer “Flare0n”:
 ( https://userscripts-mirror.org/users/524504.html )
    BTC : 1EdSmaYxKuhFc4eT3vhKsRczwnrstXCxG6
    LTC : LWyNiRmW9aDJWxQVch27WxgL6uPdp6Bbmx
    DOGE : DFf6c3Le3RxpStdABhfqit5Aqa8xHg459S  */

(function () {

    /* ==== Options ==== */
    

    var save_visited = true;
    //  Save the page you have just visited.

    var save_all_links = true;
    var save_all_links_no_host_restriction = true; 

    //  Save all links on a page.
    //  When you set "save_all_links_no_host_restriction" as false, links to other hosts will never sent.
    

    /* ==== End of Options ==== */

    document.addEventListener("DOMContentLoaded", function () {
        // Check if matches "<h2 class="blue">This page is available on the web!</h2>".
        if (document.getElementsByTagName('body')[0].innerHTML.indexOf("<h2 class=\"blue\">This page is available on the web!</h2>") !== -1) {
            var a = location.href;
            a.match(/^https?:\/\/(wayback|web).archive.org\/web/) ? location.href = decodeURI(a).replace(/^https?:\/\/(wayback|web).archive.org\/(web\/(\d|\*)+|save)\/(https?:\/\/)?/, "https://wayback.archive.org/save/") : location.href = "https://wayback.archive.org/save/" + a;
        }
    }, false);

    // Save the page you have just visited.
    if (save_visited) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://web.archive.org/save/' + encodeURI(decodeURI(location.href)),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
    };

    // Save all links you can see on a page.
    if (save_all_links) {
        window.addEventListener("load", function () {
            var sent_array = [];
            for (var elements1 = document.getElementsByTagName("a"), i = elements1.length - 1; i >= 0; i--) {
                var URL1 = decodeURI(elements1[i].href);
                if (URL1.match(/^https?:\/\/(wayback|web).archive.org\/.*http/)) {
                    URL1.replace(/^https?:\/\/(wayback|web).archive.org\/web\/[0-9]+\/http/, "http");
                }
                if ((save_all_links_no_host_restriction || URL1.match(location.hostname)) && -1 === sent_array.indexOf(URL1)) {
                    sent_array[sent_array.length] = URL1;
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'http://web.archive.org/save/' + encodeURI(URL1),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    });
                    console.log('http://web.archive.org/save/' + encodeURI(URL1));
                // Print URI lists you have sent the request to save. (on console, for debug)

                };
            }
        }, false);
    };

})();