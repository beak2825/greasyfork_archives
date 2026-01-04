// ==UserScript==
// @name         derstandard.at adfree Rework September 2024
// @namespace    derstandard
// @version      20241002
// @description  Zeigt normale Bilder bei Artikel an und keine Benachrichtung mehr, dass Werbung geblockt wird.
// @author       You
// @match        https://*.derstandard.at/*
// @license MIT
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=derstandard.at
// @downloadURL https://update.greasyfork.org/scripts/493345/derstandardat%20adfree%20Rework%20September%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/493345/derstandardat%20adfree%20Rework%20September%202024.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a major design
    change introduced in GM 1.0. It restores the sandbox.

    If in Tampermonkey, use "// @unwrap" to enable sandbox instead.
*/

console.log('Tampermonkey derstandard.at starting');

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
(new MutationObserver(check2)).observe(document, {childList: true, subtree: true});
(new MutationObserver(check3)).observe(document, {childList: true, subtree: true});
(new MutationObserver(check4)).observe(document, {childList: true, subtree: true});
(new MutationObserver(check5)).observe(document, {childList: true, subtree: true});
(new MutationObserver(check6)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector("[data-ad-active='false']")) {
        //console.log("QuerySelecter executed and found: [data-ad-active='false']");
        //observer.disconnect();
        // actions to perform after #mySelector is found
        document.querySelectorAll("[data-ad-active='false']").forEach(function(elem) {
            //console.log('Removing element from "false" match: ', elem);
            elem.remove();
        })
    }
}


function check2(changes, observer) {
    if(document.querySelector("[data-ad-active='true']")) {
        //console.log("QuerySelecter executed and found: [data-ad-active='true']");
        //observer.disconnect();
        // actions to perform after #mySelector is found
        document.querySelectorAll("[data-ad-active='true']").forEach(function(elem) {
            //console.log('Removing element from "true" match ', elem);
            elem.remove();
        })
    }
}

function check3(changes, observer) {
    if(document.querySelector("[class='dstpiano-container visible-message']")) {
        //console.log("QuerySelecter executed and found: [class='dstpiano-container visible-message']");
        //observer.disconnect();
        // actions to perform after #mySelector is found
        document.querySelectorAll("[class='dstpiano-container visible-message']").forEach(function(elem) {
            //console.log('Removing element from "true" match ', elem);
            elem.remove();
        })
    }
}

function check4(changes, observer) {
    if(document.querySelector("[allow='autoplay; fullscreen; picture-in-picture; web-share']")) {
        console.log("QuerySelecter executed and found: [allow='autoplay; fullscreen; picture-in-picture; web-share']");
        //observer.disconnect();
        // actions to perform after #mySelector is found
        document.querySelectorAll("[allow='autoplay; fullscreen; picture-in-picture; web-share']").forEach(function(elem) {
            
            
            elem.removeAttribute("allow");
            console.log('tweaking attribute allow (no autoplay)');
            elem.setAttribute("allow", "fullscreen; picture-in-picture; web-share");
            
            var src = elem.getAttribute("src");
            src = src + "&api=postMessage";
            //elem.removeAttribute("src");
            //elem.setAttribute("api", "postMessage");
            elem.setAttribute("autoplay", "0");
            elem.setAttribute("src", src);
            console.log('setting src to ' + src);
            elem.contentWindow.postMessage('{"command":"pause","parameters":[]}', '*');
            
            //elem.postMessage('pause', '*');
            
        })
    }
}

function check5(changes, observer) {
    if(document.querySelector("[id='piano-supporter-inline-container']")) {
        //console.log("QuerySelecter executed and found: [id='piano-supporter-inline-container']");
        //observer.disconnect();
        // actions to perform after #mySelector is found
        document.querySelectorAll("[id='piano-supporter-inline-container']").forEach(function(elem) {
            //console.log('Removing element from "true" match ', elem);
            elem.remove();
        })
    }
}

function check6(changes, observer) {
    if(document.querySelector("[id='taboola-below-article-thumbnails-4x1']")) {
        //console.log("QuerySelecter executed and found: [id='taboola-below-article-thumbnails-4x1']");
        //observer.disconnect();
        // actions to perform after #mySelector is found
        document.querySelectorAll("[id='taboola-below-article-thumbnails-4x1']").forEach(function(elem) {
            //console.log('Removing element from "true" match ', elem);
            elem.remove();
        })
    }
}


/*
taboola-below-article-thumbnails-4x1
id="piano-supporter-inline-container"

<iframe data-ratio="16:9" src="https://geo.dailymotion.com/player/xbznj.html?video=x950pjo&amp;subtitles-default=de" frameborder="0" allowfullscreen="" allow="autoplay; fullscreen; picture-in-picture; web-share"></iframe>
*/




