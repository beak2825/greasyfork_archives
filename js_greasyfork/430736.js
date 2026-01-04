// ==UserScript==
// @name         POPCAT 自動點擊器
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  POPCAT 自動點擊
// @author       聖冰如焰
// @match        https://popcat.click/
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430736/POPCAT%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/430736/POPCAT%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%99%A8.meta.js
// ==/UserScript==

GM_addStyle(`
    #timeLeftBox {
        top: 100px;
        position: absolute;
        z-index: 10;
        font-size: 50px;
        margin: 10px;
        -webkit-text-stroke-width: 1.5px;
        height: 0;
        flex-grow: 1;
        background-position: bottom;
        background-size: contain;
        background-repeat: no-repeat;
        touch-action: manipulation;
        text-align: center;
        color: #fff;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #000;
        font-weight: 900;
        word-wrap: break-word;
    }
    
    #timeLeftTitle {
        
    }
    
    #timeLeftCount {
        font-size: 40px;
    }
`);

'use strict';
(() => {
    $('body').prepend('<div id="timeLeftBox"><div id="timeLeftTitle">剩餘時間</div><div id="timeLeftCount">30</div></div>');

    //--------------------------------------------//
    let timeLeftCount = $('#timeLeftCount');
    let limitTime = 30000;
    let limitCount = 800;
    let time = +new Date();
    let clickCount = 0;
    let event = new KeyboardEvent('keydown', {
        key: 'g',
        ctrlKey: true
    });
    let rundo = () => {
        let nowTime = +new Date();
        let leftTime = nowTime - time;
        timeLeftCount.text((Math.round((30 - leftTime / 1000) * 1000)/1000).toFixed(3) + 's');
        if (leftTime >= limitTime) {
            time = nowTime;
            clickCount = 0;
        };
        if (++clickCount < limitCount)
            document.dispatchEvent(event);
        requestAnimationFrame(rundo);
    }
    requestAnimationFrame(rundo);
})()