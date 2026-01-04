// ==UserScript==
// @name         pilipili rate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  霹雳霹雳倍速脚本
// @author       Dmanriver
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/426569/pilipili%20rate.user.js
// @updateURL https://update.greasyfork.org/scripts/426569/pilipili%20rate.meta.js
// ==/UserScript==




(function() {

var rate = 1;

setInterval(main,1000);

function main() {
    document.onkeyup = function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        switch (keyCode) {
                case 101:{
                Rate(3);
                console.log("reset");
                break;
            }
            case 103:{
                Rate(2); //减少速度
                console.log("down");
                break;
            }
            case 105:{
                Rate(1); //增加速度
                console.log("up");
                break;
            }
            default:
                break;
        }
    }
};

function Rate(type){
    if(type == 2 && rate == 0)return;
    switch (type){
        case 1:{
            rate += 0.25;
            break;
        }
        case 2:{
            rate -= 0.25;
            break;
        }
        case 3:{
            rate = 1;
            break;
        }
    }
    document.querySelector('video').playbackRate = rate;
    return;
}
})();







