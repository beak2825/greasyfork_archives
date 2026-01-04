// ==UserScript==
// @name         LZTStackAlertsScrollable
// @namespace    MeloniuM/LZT
// @version      0.1
// @description  Меньше засоряем уведомления
// @author       MeloniuM
// @license      MIT
// @match        *://zelenka.guru/*
// @match        *://lolz.guru/*
// @match        *://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @downloadURL https://update.greasyfork.org/scripts/479541/LZTStackAlertsScrollable.user.js
// @updateURL https://update.greasyfork.org/scripts/479541/LZTStackAlertsScrollable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!$('#StackAlerts').length) $('<ul id="StackAlerts">').appendTo('body');
    $('#StackAlerts').attr('style', 'max-height: 350px; overflow-y: scroll;').addClass('Scrollbar scrollbar-macosx scrollbar-dynamic scroll-content scroll-scrolly_visible');
})();