// ==UserScript==
// @name         「Ele-Cat」百度两下
// @namespace    https://ele-cat.gitee.io/
// @version      0.0.1
// @description  基础-百度两下
// @author       Ele-Cat
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492629/%E3%80%8CEle-Cat%E3%80%8D%E7%99%BE%E5%BA%A6%E4%B8%A4%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492629/%E3%80%8CEle-Cat%E3%80%8D%E7%99%BE%E5%BA%A6%E4%B8%A4%E4%B8%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let btn = document.getElementsByClassName("bg s_btn")[0];
    btn.value = "百度两下";
})();