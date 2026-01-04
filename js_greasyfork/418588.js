// ==UserScript==
// @name         Webtoon - Disable Loginfra tracking
// @author       RandomUsername404
// @namespace    https://greasyfork.org/en/users/105361-randomusername404
// @version      0.6
// @description  Disable all Loginfra redirections from Webtoons.com
// @run-at       document-start
// @include      *://www.webtoons.com/*
// @grant        none
// @icon         https://webtoons-static.pstatic.net/image/favicon/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/418588/Webtoon%20-%20Disable%20Loginfra%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/418588/Webtoon%20-%20Disable%20Loginfra%20tracking.meta.js
// ==/UserScript==

// https://stackoverflow.com/a/62285566
function findLink(el) {
    if (el.tagName == 'A' && el.href) {
        return el.href;
    } else if (el.parentElement) {
        return findLink(el.parentElement);
    } else {
        return null;
    }
};

function callback(e) {
    const link = findLink(e.target);
    if ((link == null || link.slice(link.length - 1) == "#") || link.id == "btnLogIn") { 
        return;
    }
    e.preventDefault();
    window.location.href = link;

};

document.addEventListener('click', callback, false);