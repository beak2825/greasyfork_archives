// ==UserScript==
// @name         color-test-hack
// @namespace    https://www.webhek.com/post/color-test/
// @version      1.0.20231128
// @description  try press H button when you play the game
// @author       Yang
// @match      https://www.webhek.com/post/color-test/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480936/color-test-hack.user.js
// @updateURL https://update.greasyfork.org/scripts/480936/color-test-hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    alert("try press H button when you play the game");
    document.onkeydown = function (e) {
        var keyNum = window.event ? e.keyCode : e.which;
        if (keyNum == 72) {
            console.log('您按下了H');
            console.log("click")
            let box = document.getElementById("box");
            let tmp1Color = "";
            let tmp2Color = "";
            let tmp1Arr = [];
            let tmp2Arr = [];
            let tmp = "";
            if (box && box.childNodes.length > 1) {
                let length = box.childNodes.length;

                for (let index = 0; index < length; index++) {
                    const element = box.childNodes[index];
                    if (element.style) {
                        tmp = element.style.backgroundColor;
                        if (tmp1Color === "") {
                            tmp1Color = tmp;
                        }

                        if (tmp === tmp1Color) {
                            tmp1Arr.push(index);
                        } else {
                            tmp2Color = tmp;
                        }
                        if (tmp === tmp2Color) {
                            tmp2Arr.push(index);
                        }
                    }
                }
                if (tmp1Arr.length < tmp2Arr.length) {
                    tmp = tmp1Arr[0];
                } else {
                    tmp = tmp2Arr[0];
                }
                let len = Math.sqrt(length);
                let x = (tmp + 1) % len;
                let y = Math.ceil((tmp + 1) / len);

                console.log('test ' + tmp);
                console.log('other is ' + x + "," + y);
                const testDom = box.childNodes[tmp];
                testDom.style.border = "solid 5px #000000";
            }
        }
    }
})();