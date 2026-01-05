// ==UserScript==
// @name VK-ScrollUpRemove
// @description Уполовинивает кнопку скролла вверх, освобождая место для безопасного клика слева от постов.
// @author Last8Exile
// @license MIT
// @version 1.0
// @noframes
// @include *://vk.com/*
// @namespace https://greasyfork.org/users/61164
// @downloadURL https://update.greasyfork.org/scripts/22779/VK-ScrollUpRemove.user.js
// @updateURL https://update.greasyfork.org/scripts/22779/VK-ScrollUpRemove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self)
        return;

    var leftPanel = document.querySelector("#stl_side","div.stl_active");
    leftPanel.parentNode.removeChild(leftPanel);
})();