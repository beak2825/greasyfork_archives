// ==UserScript==
// @name         changeBackgroundColor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change background color and basic layout
// @author       Letsgo0
// @match        https://www.qu-la.com/booktxt/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qu-la.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441482/changeBackgroundColor.user.js
// @updateURL https://update.greasyfork.org/scripts/441482/changeBackgroundColor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.body.style.cssText += "overflow-x: hidden;";

    let ele = document.querySelector("#chapter");
    ele.style.cssText += "background: black;";

    ele = document.querySelector(".chapter-box");
    ele.style.cssText += "background: unset;";

    ele = document.querySelector("#txt");
    ele.style.cssText += "color: #646464;";

    const elesName = ['.chapter-wrap','.chapter-box','#txt'];
    elesName.forEach( name => {
        ele = document.querySelector(name);
        ele.style.cssText += "width: 100%;";
    })

    // listen scroll to bottom
    const KeyboardEventInit = { key: "ArrowRight", charCode: 0, keyCode: 39};
    const event = new KeyboardEvent("keydown", KeyboardEventInit);
    const tipEle = document.createElement("div");
    tipEle.style.cssText = "position:fixed;display:flex;z-index:100;right:0;bottom:0;color: gray;font-size: 200px;font-weight: 700;";
    document.body.appendChild(tipEle);

    window.addEventListener('scroll', function(e) {
        const remain = 0;
        const scrollTopMax = document.documentElement.scrollTopMax;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if ((scrollTopMax && scrollTop + remain >= scrollTopMax) || scrollTop + clientHeight + remain >= scrollHeight){
            wait(0, jumpNextPage);
        }
    })
    function wait(waitTime, callback){
        let count = waitTime;
        tipEle.innerHTML = count;
        if (count <= 0){
            callback();
        }else {
            setTimeout( function(){
                wait(--count,callback);
            }, 1000);
        }
    }
    function jumpNextPage(){
        document.dispatchEvent(event);
    }
})();