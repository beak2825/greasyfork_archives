// ==UserScript==
// @name         百度经验纯净版
// @namespace    https://saltzmanalaric.github.io
// @version      1.0.0
// @description  百度经验纯净版!
// @author       Saltzman
// @license      MIT
// @date         2020-05-21
// @modified     2020-05-21
// @match        *://jingyan.baidu.com/*/*
// @run-at       document-end
// @noframes
// @icon         https://saltzmanalaric.github.io/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/403845/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/403845/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var children = [
        document.getElementsByClassName("clearfix feeds-video-box")[0],
        document.getElementsByClassName("f-light feeds-video-one-view")[0],
        document.getElementsByClassName("wgt-income-money")[0],
         document.getElementById("fresh-share-exp-e"),
        document.getElementById("w-share"),
        document.getElementById("w-favor"),
        document.getElementById("wgt-like")
    ];
    for (var child of children) {
        if (child) {
            child.parentNode.removeChild(child);
        }
    }

})();