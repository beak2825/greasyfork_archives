// ==UserScript==
// @name         changeYQXSLayout
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  change the layout!
// @author       Letsgo0
// @exclude      https://www.yqxs.cc/html/*/*/index.html
// @match        https://www.yqxs.cc/html/*/*/*.html
// @icon         https://www.google.com/s2/favicons?domain=yqxs.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441378/changeYQXSLayout.user.js
// @updateURL https://update.greasyfork.org/scripts/441378/changeYQXSLayout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // eles to be deleted
    const elesSelector = ['#downdiv', '#content > div', '.content > .link', '#wrapper > .ywtop',
                          '#wrapper > .header', '#wrapper > .nav', '#wrapper > .clear', '#wrapper > .footer'];
    let deleteCountMax = 100;
    setTimeout( myDo,100);

    let ele = document.querySelector('.book.reader');
    ele.style.cssText += "width:100%;";

    ele = document.querySelector('body');
    ele.style.cssText += "overflow-x: hidden;";

    const KeyboardEventInit = { key: "ArrowRight", charCode: 0, keyCode: 39};
    const event = new KeyboardEvent("keydown", KeyboardEventInit);
    const tipEle = document.createElement("div");
    tipEle.style.cssText = "position:fixed;display:flex;z-index:100;right:0;bottom:0;color: gray;font-size: 200px;font-weight: 700;";
    document.body.appendChild(tipEle);

    window.addEventListener('scroll', function(e) {
        const remain = 50;
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

    function myDo() {
        elesSelector.forEach( deleteEles);
        if (deleteCountMax-- <= 0) {
            // 防止找不到元素节点时，无限循环下去
            alert(`删除次数耗尽！\n${elesSelector}`);
        }
        else if (elesSelector.length > 0){
            setTimeout( myDo, 100);
        }
    }
    function deleteEles(eleName, index){
        const eles = document.querySelectorAll(eleName);
        if (eles.length > 0){
            elesSelector.splice(index, 1);
            eles.forEach( ele => {
                ele.style.cssText = "display:none;";
            });
        }
    }
})();