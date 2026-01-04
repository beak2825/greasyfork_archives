
// ==UserScript==
// @name           强制当前标签打开链接
// @namespace    FLScript
// @version         0.0.2

//启用名单↓（当前为所有网站，可将*.*改为指定网站，例如 https://www.163.com/* ）
// @include         *.*

//例外名单↓
// @exclude        https://www.sohu.com/*

// @description   如果过网页链接为新标签打开，则强制当前页面打开链接
// @author          FL
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/402302/%E5%BC%BA%E5%88%B6%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/402302/%E5%BC%BA%E5%88%B6%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = document.getElementsByTagName('a');
    for (let i=0; i < links.length; i++) {
      if (links[i].target = '_blank') {
        links[i].target = '_self';
      }
    }
})();