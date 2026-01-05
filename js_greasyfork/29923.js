// ==UserScript==
// @name         jvc-nocaps
// @version      0.1
// @description  Get rid of POSTS on JVC where WORDS are UPPERCASED for some REASON.
// @author       kikakouti
// @match        http://www.jeuxvideo.com/forums/*
// @grant        none
// @namespace https://greasyfork.org/users/125911
// @downloadURL https://update.greasyfork.org/scripts/29923/jvc-nocaps.user.js
// @updateURL https://update.greasyfork.org/scripts/29923/jvc-nocaps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function regularReplacer(match, offset, string){
        return match.toLowerCase();
    }

    function removeUppercase(element) {

        if (element.childNodes && element.childNodes.length > 0) {
            for (var i in element.childNodes) {
                removeUppercase(element.childNodes[i]);
            }
        }

        if (element.nodeType == Node.TEXT_NODE && /\S/.test(element.nodeValue)) {
            var text = element.nodeValue;
            element.nodeValue = text.replace(/([A-ZÀÁÂÄÅÃÆÇÉÈÊËÍÌÎÏÑÓÒÔÖØÕOEÚÙÛÜÝY]{3,})/g, regularReplacer);
        }
    }

    var posts = document.getElementsByClassName("txt-msg");
    for (var i in posts) {
        removeUppercase(posts[i]);
    }

    var title = document.getElementById("bloc-title-forum");
    if (title) {
        removeUppercase(title);
    }

    var arianeCrumbs = document.getElementsByClassName("bloc-fil-ariane-crumb-forum");
    for (var j in arianeCrumbs) {
        removeUppercase(arianeCrumbs[j]);
    }

    var topicTitles = document.getElementsByClassName("topic-title");
    for (var k in topicTitles) {
        removeUppercase(topicTitles[k]);
    }

})();