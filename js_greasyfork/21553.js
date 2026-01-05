// ==UserScript==
// @name         大喵版笑笑鸟辅助插件22
// @version      0.1
// @description  笑笑鸟辅助插件22
// @author       嗷大喵
// @match        http://jokebird.com/
// @grant        none
// @namespace https://greasyfork.org/users/56023
// @downloadURL https://update.greasyfork.org/scripts/21553/%E5%A4%A7%E5%96%B5%E7%89%88%E7%AC%91%E7%AC%91%E9%B8%9F%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B622.user.js
// @updateURL https://update.greasyfork.org/scripts/21553/%E5%A4%A7%E5%96%B5%E7%89%88%E7%AC%91%E7%AC%91%E9%B8%9F%E8%BE%85%E5%8A%A9%E6%8F%92%E4%BB%B622.meta.js
// ==/UserScript==



window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms

function keydown(event) {
    if (event.keyCode == 81 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 82){
        split();
        setTimeout(function(){
            split();
            setTimeout(function(){
                split();
                setTimeout(function(){
                    split();
                    setTimeout(function(){
                        split();
                    },50);
                },60);
            },70);
        },80);
    }
    if (event.keyCode == 69) {
        split();
        setTimeout(function(){
            split();
            seeTimeout(function(){
                split();
            },40);
        },100);
    }
}

function keyup(event) {
    if (event.keyCode == 81) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
}