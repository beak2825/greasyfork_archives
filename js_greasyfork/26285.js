// ==UserScript==
// @name        Discuz论坛空间自定义CSS
// @author      first-snow
// @namespace   https://i.xuefenfei.cc
// @description 自定义Discuz论坛空间CSS样式表
// @include     http://*/home.php?*mod=space*&diy=yes*
// @version     1.0
// @date        2017-01-04 21:29:59
// @modified    2017-01-04 21:30:26
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26285/Discuz%E8%AE%BA%E5%9D%9B%E7%A9%BA%E9%97%B4%E8%87%AA%E5%AE%9A%E4%B9%89CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/26285/Discuz%E8%AE%BA%E5%9D%9B%E7%A9%BA%E9%97%B4%E8%87%AA%E5%AE%9A%E4%B9%89CSS.meta.js
// ==/UserScript==
(function(C) {
    'use strict';
    if (typeof spaceDiy != 'object') {
        return;
    }
    var li = C('li'), textarea = C('textarea'),
    controlnav = $('controlnav'), controlcontent = $('controlcontent');
    textarea.value = $('diy_style').textContent;
    textarea.style.cssText = 'width:100%;height:100%;color:#000 !important;';
    spaceDiy.getSpacecssStr = function() {
        return textarea.value;
    };
    li.innerHTML = '<a href="javascript:;">自定义 CSS</a>';
    li.onclick = function() {
        controlnav.querySelector('.current').className = '';
        this.className = 'current';
        controlcontent.innerHTML = '';
        controlcontent.appendChild(textarea);
    };
    controlnav.appendChild(li);
    $('diy_style').textContent = '';
} (function(el) {
    return el ? document.createElement(el) : null;
}));
