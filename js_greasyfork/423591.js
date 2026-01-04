// ==UserScript==
// @name         章鱼实验小助手
// @namespace    http://wlfj.fun/
// @version      0.1.1
// @description  开启章鱼平台的复制功能
// @author       Yves Wong
// @match        http://10.101.162.149/*
// @grant        GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/423591/%E7%AB%A0%E9%B1%BC%E5%AE%9E%E9%AA%8C%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/423591/%E7%AB%A0%E9%B1%BC%E5%AE%9E%E9%AA%8C%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.getElementsByClassName('CopyToClipboard');
    for(var i = 0; i < elements.length; i ++){
        elements[i].setAttribute('onclick', 'dp.sh.Toolbar.Command(\'CopyToClipboard\',this);return false;');
        elements[i].setAttribute('title', '诶?居然可以复制');
    }
})();