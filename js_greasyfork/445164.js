// zhuyin_wordle_in_keyboard.js

// ==UserScript==
// @name         注音版 Wordle 鍵盤擴充腳本(zhuyin wordle keyboard input support)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  讓注音版 Wordle（https://words.hk/static/bopomofo-wordle/）能用鍵盤輸入的方式遊玩的腳本。
// @author       tako
// @license      MIT
// @match        https://words.hk/static/bopomofo-wordle/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=words.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445164/%E6%B3%A8%E9%9F%B3%E7%89%88%20Wordle%20%E9%8D%B5%E7%9B%A4%E6%93%B4%E5%85%85%E8%85%B3%E6%9C%AC%28zhuyin%20wordle%20keyboard%20input%20support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445164/%E6%B3%A8%E9%9F%B3%E7%89%88%20Wordle%20%E9%8D%B5%E7%9B%A4%E6%93%B4%E5%85%85%E8%85%B3%E6%9C%AC%28zhuyin%20wordle%20keyboard%20input%20support%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 網頁按鈕模擬
    // 獲得所有的按鈕
    // document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-keyboard").shadowRoot.querySelector("#keyboard > div:nth-child(2) > button:nth-child(2)")
    var btns = document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-keyboard").shadowRoot.querySelectorAll('button');
    // 將 NodeList 轉換成 Array
    var btnsArr = Array.from(btns);

    // 在 console 列出 button
    // for (var btn of btnsArr) {
    //     console.log(btn);
    //   }


    //   按鍵偵測
    var keycodes = [
        49,50,53,56,57,48,173,
        81,87,69,82,84,89,85,73,79,80,13,
        65,83,68,70,71,72,74,75,76,59,
        8,90,88,67,86,66,78,77,188,190,191
    ];
    // key ㄅ ~ ㄥ        查表: https://blogs.longwin.com.tw/lifetype/key_codes.html
    // ㄦ和ㄝ似乎有點問題

    // 偵測按鍵是否按下
    (window.opera ? document.body : document).addEventListener('keydown', function(e) {
        // alert(e.keyCode ); //uncomment to find more keyCodes
        // 獲得 keyCode
        // console.log(e.keyCode);

        if (keycodes.indexOf(e.keyCode) != -1) {
            // console.log(`key ${e.keyCode} down`)
            if (keycodes.indexOf(e.keyCode) == 17) {
                document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-keyboard").shadowRoot.querySelector("#keyboard > div:nth-child(2) > button:nth-child(12)").onmousedown();
            }
            else if (keycodes.indexOf(e.keyCode) == 28) {
                document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-keyboard").shadowRoot.querySelector("#keyboard > div:nth-child(4) > button:nth-child(1)").onmousedown();
            }
            else {
                btnsArr[Number(keycodes.indexOf(e.keyCode))].click();
            }

                // console.log(Number(keycodes.indexOf(e.keyCode)));
        }


        return false;
    }, !window.opera);

})();
