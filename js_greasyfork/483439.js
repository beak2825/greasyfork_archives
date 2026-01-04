// ==UserScript==
// @name         WendaPlus: Allow Copy
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  一键开启复制
// @author       xgugugu
// @match        https://wenda.codingtang.com/*
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483439/WendaPlus%3A%20Allow%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/483439/WendaPlus%3A%20Allow%20Copy.meta.js
// ==/UserScript==

$('.kids_social').append('<li><a id="fuzhi" title="开启复制"><i class="fa fa-tags"></i></a></li>');
$('#fuzhi').click(function() {
    function t(e)
    {
        e.stopPropagation();
        if (e.stopImmediatePropagation)
        {
            e.stopImmediatePropagation();
        }
    }
    document.querySelectorAll('*').forEach(function(e) {
        if (window.getComputedStyle(e, null).getPropertyValue('user-select') === 'none')
        {
            e.style.setProperty('user-select', 'text', 'important');
        }
    });
    ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'mousemove', 'keydown', 'keypress', 'keyup']
        .forEach(function(e) {
            document.documentElement.addEventListener(e, t, {capture : !0});
        });
    alert('开启完成！');
});