// ==UserScript==
// @name         КНОПКА БАБЛО
// @namespace    http://tampermonkey.net/
// @version      2024-02-02
// @description  пошлет вас нахуй
// @author       You
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486335/%D0%9A%D0%9D%D0%9E%D0%9F%D0%9A%D0%90%20%D0%91%D0%90%D0%91%D0%9B%D0%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/486335/%D0%9A%D0%9D%D0%9E%D0%9F%D0%9A%D0%90%20%D0%91%D0%90%D0%91%D0%9B%D0%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.secondaryContent.blockLinksList').append(`
        <a href="#" id="knopka-bablo">
            <span class="forumSearchThreads--Link--Icon" style="color: white !important">БАБЛО</span>
        </a>
    `)

    $('#knopka-bablo').on('click', function(e) {
        e.preventDefault()
         XenForo.alert(`<div style="padding: 1rem; display: flex; justify-content: start; gap: .75rem">
             <h1 style="font-size: 2rem; color: red;">ПОШЕЛ НАХУЙ</h1>
        </div>`, '<b>БАБЛО</b>')

    })
})();