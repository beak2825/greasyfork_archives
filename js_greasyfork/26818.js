// ==UserScript==
// @name         洛谷wiki优化
// @namespace    http://www.mr-cn.net/
// @version      0.1
// @description  自动隐藏代码，避免超长代码影响体验
// @author       mr-cn
// @match        https://www.luogu.org/wiki/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26818/%E6%B4%9B%E8%B0%B7wiki%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/26818/%E6%B4%9B%E8%B0%B7wiki%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * /$$      /$$ /$$$$$$$           /$$$$$$  /$$   /$$
     * | $$$    /$$$| $$__  $$         /$$__  $$| $$$ | $$
     * | $$$$  /$$$$| $$  \ $$        | $$  \__/| $$$$| $$
     * | $$ $$/$$ $$| $$$$$$$/ /$$$$$$| $$      | $$ $$ $$
     * | $$  $$$| $$| $$__  $$|______/| $$      | $$  $$$$
     * | $$\  $ | $$| $$  \ $$        | $$    $$| $$\  $$$
     * | $$ \/  | $$| $$  | $$        |  $$$$$$/| $$ \  $$
     * |__/     |__/|__/  |__/         \______/ |__/  \__/
     */

    $("code").parent().append("<button class=\"am-btn am-btn-success am-btn-sm\" id=\"showme\" style='margin-top: 10px'>显示/隐藏代码</button>");
    $("code").hide();

    $("button#showme").click(function () {
        $(this).siblings("code").toggle();
    });
})();