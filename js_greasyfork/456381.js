// ==UserScript==
// @name        自动调整网页宽度        
// @namespace         http://tampermonkey.dianzishu.online
// @version           0.0.1
// @description       自动根据浏览器宽度调整网页文字，相当于文字重排。
// @copyright		kongfu
// @match              *://*
// @grant			none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456381/%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/456381/%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==
//获取当前网页地址

(function() {
    'use strict';

    (function(){function t(f){var a=d.createNodeIterator(d,1,f,false);while(a.nextNode()){}}var d=document;t(function(e){var x=e.offsetLeft;var l=e.offsetParent;while(l!=null){x+=l.offsetLeft;l=l.offsetParent}var w=d.documentElement.clientWidth-x;var s=e.style;if(s.marginLeft)w-=s.marginLeft;if(s.marginRight)w-=s.marginRight;if(s.paddingLeft)w-=s.paddingLeft;if(s.paddingRight)w-=s.paddingRight;if(s.borderSize)w-=s.borderSize;w-=d.defaultView.innerWidth-d.documentElement.offsetWidth;if(e.tagName=='IMG'){var h=e.clientHeight*w/e.clientWidth;s.maxHeight=h}s.maxWidth=w+'px'})})();
})();