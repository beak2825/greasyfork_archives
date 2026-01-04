// ==UserScript==
// @name         更好的知识库历史记录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Better ku history
// @author       RYZENX
// @match        https://*/knowledge/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499364/%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%9F%A5%E8%AF%86%E5%BA%93%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499364/%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%9F%A5%E8%AF%86%E5%BA%93%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function $(s) {
        return document.querySelector(s);
    }

    var curPath = location.pathname;
    var intr = null;

    var utils = {};
    utils.checkSentenceExists = function() {
        var flag = $('.applyAdminList');
        console.log(flag);
        return !!flag;
    }

    var func = {};
    func.watchPath = function() {
        if (intr) {
            clearInterval(intr);
        }
        intr = setInterval(function() {
            var newPath = location.pathname;
            if (newPath !== curPath) {
                console.log('path changed');
                curPath = newPath;
                func.replaceInaccessPageTitle();
            }
        }, 500);
    }
    func.replaceInaccessPageTitle = function() {
        if (utils.checkSentenceExists()) {
            document.title = '【无权限】' + document.title;
        }
    }

    setTimeout(function() {
        Object.keys(func).forEach(function(f) {
            func[f]();
        });
    }, 500);
})();