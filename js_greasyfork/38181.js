// ==UserScript==
// @name               Hide outlook google ad
// @name:zh-CN         隐藏outlook右侧google广告
// @namespace          vince.outlook
// @version            1.1
// @description        hide outlook google ad
// @description:zh-CN  隐藏outlook右侧显示的广告
// @author             vince ding
// @match              https://outlook.live.com/*
// @downloadURL https://update.greasyfork.org/scripts/38181/Hide%20outlook%20google%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/38181/Hide%20outlook%20google%20ad.meta.js
// ==/UserScript==

function closeAd(){
    var css = '._n_h,#app > div >div:last-child>div>div>div:last-child { display: none!important; }\r\n#primaryContainer>div:last-child{width:100%!important;}',
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