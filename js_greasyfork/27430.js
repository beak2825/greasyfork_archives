// ==UserScript==
// @name         500px去掉Cover
// @namespace    no
// @version      0.1
// @author       Ray Lee
// @description  去掉500px网站不能右键保存的限制
// @include      https://500px.com/photo/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/27430/500px%E5%8E%BB%E6%8E%89Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/27430/500px%E5%8E%BB%E6%8E%89Cover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".photo_container > .overlay").remove();
    $(".photos_index_layout .main_container .photo_container").css("margin-left", "27%");
    $(".main_container > .sidebar_region").css("width","30%");
})();