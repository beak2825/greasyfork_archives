// ==UserScript==
// @name         阻止bilibili鼠标hover弹出弹幕点赞举报框
// @description  隐藏bilibili播放器中鼠标移到弹幕上自动显示的弹幕点赞举报框。
// @namespace    http://tampermonkey.net/
// @version      2024-10-14.1
// @author       heroboy
// @match        https://www.bilibili.com/*
// @icon         http://bilibili.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512560/%E9%98%BB%E6%AD%A2bilibili%E9%BC%A0%E6%A0%87hover%E5%BC%B9%E5%87%BA%E5%BC%B9%E5%B9%95%E7%82%B9%E8%B5%9E%E4%B8%BE%E6%8A%A5%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/512560/%E9%98%BB%E6%AD%A2bilibili%E9%BC%A0%E6%A0%87hover%E5%BC%B9%E5%87%BA%E5%BC%B9%E5%B9%95%E7%82%B9%E8%B5%9E%E4%B8%BE%E6%8A%A5%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldfunc = HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.addEventListener = addEventListener;
    function addEventListener(n)
    {
        if (n === 'mousemove')
        {
            if (isForbidden(arguments,this))
            {
                console.log('阻止了弹幕tip监听mousemove')
                return;
            }
        }
        oldfunc.apply(this,arguments);
    }
    function isForbidden(args,node)
    {
        try
        {
            if (args[0] === 'mousemove' && args[1] && node.className.indexOf('video-area') !== -1)
            {
                let code = args[1].toString();
                if (code.indexOf('dmhover') !== -1)
                    return true;
            }
            return false;
        }
        catch(e)
        {
            return false;
        }
    }
})();