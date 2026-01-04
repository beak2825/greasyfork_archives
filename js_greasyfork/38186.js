// ==UserScript==
// @name              Hide read01.com google ad
// @name:zh-CN        隐藏壹读google广告
// @namespace          vince.read01
// @version             1.0
// @description          hide read01.com google ad
// @description:zh-CN    隐藏壹读显示的google广告
// @author             vince ding
// @match              *://read01.com/*
// @downloadURL https://update.greasyfork.org/scripts/38186/Hide%20read01com%20google%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/38186/Hide%20read01com%20google%20ad.meta.js
// ==/UserScript==

function closeAd(){
    var css = '.axslot.axsense,.pure-u.sidebar{ display: none!important; }\r\n .main{width:100%!important;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}

closeAd();