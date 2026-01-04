// ==UserScript==
// @name            Reddit Saved Items Icon
// @description     Emulate the Reddit Gold feature of highlighting new comments since your last visit.
// @author          angusmiguel
// @icon            https://reddit.com/favicon.ico
// @version         1
// @include         /https?:\/\/((www|pay|[a-z]{2})\.)?reddit\.com\/*
// @grant           GM_addStyle
// @namespace https://greasyfork.org/users/743344
// @downloadURL https://update.greasyfork.org/scripts/422603/Reddit%20Saved%20Items%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/422603/Reddit%20Saved%20Items%20Icon.meta.js
// ==/UserScript==

// Based on:
//		https://greasyfork.org/scripts/1868-reddit-highlight-newest-comments/code/Reddit%20highlight%20newest%20comments.user.js


(function() {
    window.onload = function () {
        var userName = document.querySelector(".header-user-dropdown").children[0].children[0].children[0].children[1].children[0].textContent;
        var container = document.createElement("div");
        var savedItems = `
        <a href="/user/${userName}/saved" id="aqui">
            <span class="_2zZ-KGHbWWqrwGlHWXR90y">
                <button aria-expanded="false" aria-haspopup="true" aria-label="Moderation" id="Header--Saved" class="PH-V9ggsF2mi5JTDmDqdR">
                    <div class="FOioVk_DUTmZIKKa82Mm1">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
                </button>
            </span>
        </a>`;
        container.innerHTML = savedItems;
        var headerItems = document.getElementById("change-username-tooltip-id");
        headerItems.insertBefore(container, headerItems.children[5]);
    }
})();