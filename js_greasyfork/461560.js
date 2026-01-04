// ==UserScript==
// @name         TotalPayment
// @namespace    http://tampermonkey.net/
// @version      0.1.12
// @description  直近39件の支払いの合計金額を表示
// @author       c2tr
// @match        https://play.google.com/store/account/orderhistory*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play.google.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461560/TotalPayment.user.js
// @updateURL https://update.greasyfork.org/scripts/461560/TotalPayment.meta.js
// ==/UserScript==

var $ = window.jQuery;

function calc() {
    let total = 0;
    let count = document.querySelector("body > c-wiz > div > div > div:nth-child(4) > div").childElementCount;

    for (let i = 1; i < count; i++) {
        let icon = document.querySelector("body > c-wiz > div > div > div:nth-child(4) > div > div:nth-child(" + i + ") > div > img").getAttribute('src');
        let result
        //if (icon === "https://play-lh.googleusercontent.com/7c4jV4_Kt0O7zADgYwIoKNUCArxOfp8xPgIbIntY1ZfK6jNquYQsLwDg5wBlXYW9bA=s50-rw"){
            let value = document.querySelector("body > c-wiz > div > div > div:nth-child(4) > div > div:nth-child(" + i + ") > div:nth-child(2) > div > div:nth-child(2)").textContent.substring(1).replace(/,/g, '') - 0;
            result = i + " true : " + value + "円";
            total = total + value;
        /*} else {
            result = i + " false"
        }*/
        console.log(result);
        //document.querySelector("body > c-wiz > div > div > div:nth-child(4) > div > div:nth-child(" + i + ") > div:nth-child(2) > div > div > div:nth-child(2)").innerText = i;
      }

    document.querySelector("body > c-wiz > div > div > c-wiz > div > div > div > div").textContent = "直近39件の合計費用: ￥" + total

    console.log("合計課金額: ￥" + total);
}

(function() {
    let css = `
.float-button__wrap {
    width: 80px;
    height: 45px;
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 10;
}
.float-button__wrap a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    background-color: #0069b3 ;
    color: #fff;
}`;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.append(style);

    let button = document.createElement('button');
    button.innerText = "Calculate!";
    button.onclick = function() { calc(); };
    button.classList.add("float-button__wrap");
    document.querySelector("body").appendChild(button);
    console.log("placed button!");
})();
