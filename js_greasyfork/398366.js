// ==UserScript==
// @name         好的武漢肺炎
// @namespace    ug
// @version      1.1.0
// @description  替換YT自動插入的橫幅、浮動視窗和推薦列表標題
// @author       ug
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398366/%E5%A5%BD%E7%9A%84%E6%AD%A6%E6%BC%A2%E8%82%BA%E7%82%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/398366/%E5%A5%BD%E7%9A%84%E6%AD%A6%E6%BC%A2%E8%82%BA%E7%82%8E.meta.js
// ==/UserScript==

function replacer(doc) {
    var docText = doc.textContent;
    doc.textContent = doc.textContent.replace("2019新型冠狀病毒", "武漢肺炎");
    doc.textContent = doc.textContent.replace("2019冠狀病毒", "武漢肺炎");
    doc.textContent = doc.textContent.replace("新型冠狀病毒", "武漢肺炎");
    doc.textContent = doc.textContent.replace("新冠病毒", "武漢肺炎");
    doc.textContent = doc.textContent.replace("新冠肺炎", "武漢肺炎");
    if(docText !== doc.textContent){
        console.log("好的，中國武漢肺炎。");
    }
}

function replaceOne(query) {
    var doc = document.querySelector(query);
    if(doc){
        replacer(doc);
    }
}
function replaceAll(query) {
    var elementList = document.querySelectorAll(query);
    elementList.forEach(function(elementItem){
        replacer(elementItem);
    });
}

(function() {
    'use strict';
    window.addEventListener("yt-page-data-updated", function(event) {
        replaceOne("div.content-title.style-scope.ytd-clarification-renderer");
    });
    window.addEventListener("yt-service-request-completed", function(event) {
        replaceAll("span.style-scope.ytd-rich-shelf-renderer, yt-formatted-string.style-scope.ytd-rich-shelf-renderer");
        replaceOne("h2.ytd-mealbar-promo-renderer-message-title.style-scope.ytd-mealbar-promo-renderer");
        replaceOne("div.ytd-mealbar-promo-renderer-message-text.style-scope.ytd-mealbar-promo-renderer");
        replaceOne("yt-formatted-string.style-scope.ytd-compact-promoted-item-renderer#subtitle");
        replaceOne("yt-formatted-string.style-scope.ytd-compact-promoted-item-renderer#title");
    });
})();