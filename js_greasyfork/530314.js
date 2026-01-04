// ==UserScript==
// @name         献给安康
// @namespace    https://github.com/yourname
// @version      2.1
// @description  即时跳转所有百度贴吧跳转链接至主域名（大力飞砖版）
// @author       YXY
// @match        *://jump.bdimg.com/*
// @match        *://jump2.bdimg.com/*
// @match        *://jump3.bdimg.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530314/%E7%8C%AE%E7%BB%99%E5%AE%89%E5%BA%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/530314/%E7%8C%AE%E7%BB%99%E5%AE%89%E5%BA%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const domainMapper = {
        getFullPath: () => window.location.href.split('.bdimg.com')[1]  || '/',
        buildTargetUrl: function() {
            return 'https://tieba.baidu.com'  + this.getFullPath()
        },
        // 执行即时跳转
        execute: function() {
            if (window.self  === window.top)  {
                window.stop();
                location.replace(this.buildTargetUrl());
            }
        }
    }
    domainMapper.execute();
})();