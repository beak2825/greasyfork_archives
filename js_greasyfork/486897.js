// ==UserScript==
// @name         Royal Road - Follow List Button When No More Chapters
// @namespace    http://tampermonkey.net/
// @version      2024-02-08
// @description  Adds a 'Follow List' button to the bottom-nav when you're on the last available chapter
// @author       You
// @match        https://www.royalroad.com/fiction/*/*/chapter/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/486897/Royal%20Road%20-%20Follow%20List%20Button%20When%20No%20More%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/486897/Royal%20Road%20-%20Follow%20List%20Button%20When%20No%20More%20Chapters.meta.js
// ==/UserScript==

(function() {

    var followUrl = "https://www.royalroad.com/my/follows";

    var nextChapterButton = $('button[disabled="disabled"].btn-primary')[1];
    if(nextChapterButton != null){

        var button = document.createElement('BUTTON');
        button.innerHTML = "Follow<br class='visible-xs'>List";
        button.id = "btnFollowListCustom";
        button.classList.add("btn");
        button.classList.add("btn-primary");
        button.classList.add("col-xs-2");
        nextChapterButton.parentElement.append(button);

        $('#btnFollowListCustom').click(function() {
            window.location.href = followUrl;
        });

        nextChapterButton.outerHTML = nextChapterButton.outerHTML.replace("col-xs-4","col-xs-2");
    }

})();