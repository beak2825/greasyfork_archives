// ==UserScript==
// @name         AtCoder Error Colorizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AtCoder においてジャッジシステムが返す 非AC 状態のうち WA 以外の 6 つの状態 [TLE, RE, CE, MLE, OLE, IE] の背景色を変更します。
// @author       iiko11
// @grant        GM_addStyle
// @match        https://atcoder.jp/contests/*/submissions*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478333/AtCoder%20Error%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/478333/AtCoder%20Error%20Colorizer.meta.js
// ==/UserScript==
 
 
 
//自分好みの色にする方法
// 1. 【https://www.colordic.org/】にアクセスしてお気に入りの色を選んでください
// 2. GM_addStyle('.label-XXXX { background-color: YYYY; }') の YYYY 部分を選んだ色に書き換えてください。
 
GM_addStyle('.label-TLE { background-color: orangered; }');
GM_addStyle('.label-RE { background-color: mediumslateblue; }');
GM_addStyle('.label-CE { background-color: darkturquoise; }');
GM_addStyle('.label-MLE { background-color: maroon; }');
GM_addStyle('.label-OLE { background-color: salmon; }');
GM_addStyle('.label-IE { background-color: darkslategray; }');
 
function colorizeError(){
    const tips=document.getElementsByClassName('label');
    for(let e of tips){
        if(e.innerText.match(/TLE/)){
            e.classList.remove('label-warning');
            e.classList.add('label-TLE');
        }
        else if(e.innerText.match(/RE/)){
            e.classList.remove('label-warning');
            e.classList.add('label-RE');
        }
        else if(e.innerText.match(/CE/)){
            e.classList.remove('label-warning');
            e.classList.add('label-CE');
        }
        else if(e.innerText.match(/MLE/)){
            e.classList.remove('label-warning');
            e.classList.add('label-MLE');
        }
        else if(e.innerText.match(/OLE/)){
            e.classList.remove('label-warning');
            e.classList.add('label-OLE');
        }
        else if(e.innerText.match(/IE/)){
            e.classList.remove('label-warning');
            e.classList.add('label-IE');
        }
    }
}
(function() {
    'use strict';
 
    const target = document.getElementsByTagName('tbody')[0];
    const observer = new MutationObserver(function (mutations) {
        for(let i in mutations){
            colorizeError();
        }
    });
 
    colorizeError();
 
    observer.observe(target, {
        characterData: true,
        childList: true,
        subtree: true
    });
})();