// ==UserScript==
// @name         Gazelle Music Tracker Required Fields
// @name:zh      GMTRF：Gazelle框架音乐PT上传必填项提示
// @name:zh-CN   GMTRF：Gazelle框架音乐PT上传必填项提示
// @name:zh-TW   GMTRF：Gazelle框架音樂PT上傳必填項提示
// @namespace    https://greasyfork.org/en/users/224380-pepper-jack
// @version      4
// @description  Make fields on upload page required so that the submit button does not work until filled in
// @description:zh      在上传页面上设置必填项，在填写完成必填项目之前无法点击上传按钮.
// @description:zh-CN   在上传页面上设置必填项，在填写完成必填项目之前无法点击上传按钮.
// @description:zh-TW   在上傳頁面上設置必填項，在填寫完成必填項目之前無法點擊上傳按鈕.
// @author       SIGTERM86 | ported to OPS by KAPPLEJACLS
// @include      http*://redacted.ch/upload.php*
// @include      http*://orpheus.network/upload.php*
// @include      http*://dicmusic.club/upload.php*
// @downloadURL https://update.greasyfork.org/scripts/380991/Gazelle%20Music%20Tracker%20Required%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/380991/Gazelle%20Music%20Tracker%20Required%20Fields.meta.js
// ==/UserScript==

var requiredIds = ["file", "artist", "title", "year", "releasetype", "format", "bitrate", "media", "tags"];

(function() {
    'use strict';
    for (var i=0; i<requiredIds.length; i++) {
        document.getElementById(requiredIds[i]).required = true;
    }
})();