// ==UserScript==
// @name         战术脚本（漫猫/爱恋/MioBT 种子列表增强+生存模式BT下载链接）
// @icon         https://www.kisssub.org/images/favicon/kisssub.ico
// @namespace    https://www.kisssub.org
// @version      1.1
// @description  漫猫/爱恋/MioBT 种子列表增强+生存模式BT下载链接
// @author       LuoDiKaiHua
// @match        http://*.kisssub.org/*
// @match        http://*.comicat.org/*
// @match        http://*.miobt.com/*
// @match        https://*.kisssub.org/*
// @match        https://*.comicat.org/*
// @match        https://*.miobt.com/*
// @include      http://*.kisssub.org/*
// @include      http://*.comicat.org/*
// @include      http://*.miobt.com/*
// @include      https://*.kisssub.org/*
// @include      https://*.comicat.org/*
// @include      https://*.miobt.com/*
// @grant        none
// @license MIT
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/447029/%E6%88%98%E6%9C%AF%E8%84%9A%E6%9C%AC%EF%BC%88%E6%BC%AB%E7%8C%AB%E7%88%B1%E6%81%8BMioBT%20%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA%2B%E7%94%9F%E5%AD%98%E6%A8%A1%E5%BC%8FBT%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447029/%E6%88%98%E6%9C%AF%E8%84%9A%E6%9C%AC%EF%BC%88%E6%BC%AB%E7%8C%AB%E7%88%B1%E6%81%8BMioBT%20%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA%2B%E7%94%9F%E5%AD%98%E6%A8%A1%E5%BC%8FBT%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%EF%BC%89.meta.js
// ==/UserScript==

var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
(function () {
    'use strict';
    var doc = win.document;
    var uuid = 'A8065B77-F041-424A-BA3B-0BADEF2360C4';
    var script = doc.getElementById(uuid);
    if (script) {
        console.log('script already exists.');
        return;
    }
    setTimeout(function () {
        script = doc.createElement('script');
        script.setAttribute('src', '//www.acgscript.com/script/miobt/1x4.js?1x3');
        script.setAttribute('id', uuid);
        script.setAttribute('type', 'text/javascript');
        doc.body.appendChild(script);
    }, 1000);
})();
