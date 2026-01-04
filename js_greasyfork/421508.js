// ==UserScript==
// @name         ☄️樱花动漫全屏☄️
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复樱花动漫播放某些视频无法全屏的问题
// @author       Byaidu
// @match        http://www.imomoe.ai/player/*
// @license      GNU General Public License v3.0 or later
// @connect      saas.jialingmm.net
// @connect      api.xiaomingming.org
// @connect      www.cuan.la
// @connect      v.jialingmm.net
// @connect      *
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421508/%E2%98%84%EF%B8%8F%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%85%A8%E5%B1%8F%E2%98%84%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/421508/%E2%98%84%EF%B8%8F%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%85%A8%E5%B1%8F%E2%98%84%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_xmlhttpRequest({
        method: "GET",
        url: $('#play2').attr('src'),
        onload: (res) => {
            $('#play2').attr('allowfullscreen','true')
            $('#play2').attr('src',res.finalUrl)
        }
    })
})();