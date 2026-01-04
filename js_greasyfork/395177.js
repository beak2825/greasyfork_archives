// ==UserScript==
// @name         DoubanReadingStatus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为豆瓣阅读动态添加对应的短评
// @author       RustingSword
// @match        https://book.douban.com/updates*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/395177/DoubanReadingStatus.user.js
// @updateURL https://update.greasyfork.org/scripts/395177/DoubanReadingStatus.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const actionEndpointMappings = {
    "想读": "/wish",
    "在读": "/do",
    "读过": "/collect"
};

const readingHomepage = "https://book.douban.com/people/";

function addNoteForBook(recentList, book) {
    var url = book.querySelector(".mod_book_name>a").href;
    if (recentList.has(url)) {
        var note = recentList.get(url);
        if (note.length > 0) {
            var div = document.createElement('div');
            div.innerHTML = '<p class="comment">' + note + '</p>';
            book.appendChild(div);
        }
    }
}

function addNoteForUser(url, books) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(xhr) {
            if(xhr.status == 200){
                const parser = new DOMParser();
                const detail = parser.parseFromString(xhr.responseText, "text/html");
                const bookNotes = detail.querySelectorAll('.subject-item>.info');
                const recentList = new Map();
                for (let book of bookNotes) {
                    const bookId = book.querySelector("a").href;
                    const note = book.querySelector(".short-note>.comment").textContent.trim();
                    recentList.set(bookId, note);
                }

                for (let book of books) {
                    addNoteForBook(recentList, book);
                }
            }
        }
    });
}

function run () {
    const statuses = document.getElementsByClassName("mbtr");
    for (let status of statuses) {
        var feedTitle = status.querySelector(".feed_title");
        // Some action (e.g. writing notes) does not have "feed_title"
        if (feedTitle === null) {
            continue;
        }
        feedTitle = feedTitle.textContent.trim();
        const actionType = feedTitle.substring(feedTitle.length - 2);
        const uid = status.querySelector("a").href.split("/").slice(-2)[0];
        // For performance reason, only search for latest 15 marked books (the first page).
        const searchUrl = readingHomepage + uid + actionEndpointMappings[actionType];
        const books = status.querySelectorAll("li");
        addNoteForUser(searchUrl, books);
    }
}

(function() {
    'use strict';
    run();
})();