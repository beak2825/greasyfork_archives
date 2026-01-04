// ==UserScript==
// @name         Lottery Number Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  記錄已經出現過的號碼
// @author       You
// @match        *://*/*  
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT  // 這裡加上授權許可
// @downloadURL https://update.greasyfork.org/scripts/516609/Lottery%20Number%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/516609/Lottery%20Number%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 讀取已經記錄過的號碼
    let pastNumbers = GM_getValue("pastNumbers", []);

    // 模擬一個隨機產生的號碼（1到9999之間）
    function generateRandomNumber() {
        return Math.floor(Math.random() * 9999) + 1;
    }

    // 這裡可以自定義一個方法來生成號碼
    function addNewNumber() {
        let newNumber = generateRandomNumber();
        // 如果該號碼已經出現過，就重新生成
        while (pastNumbers.includes(newNumber)) {
            newNumber = generateRandomNumber();
        }

        // 將新生成的號碼添加到記錄中
        pastNumbers.push(newNumber);

        // 保存到 Tampermonkey 的本地儲存
        GM_setValue("pastNumbers", pastNumbers);

        console.log("已生成的號碼: " + newNumber);
    }

    // 顯示出已經出現過的號碼
    function showPastNumbers() {
        console.log("已經出現過的號碼: " + pastNumbers.join(", "));
    }

    // 每1000毫秒（1秒）生成一次新號碼，並顯示已經出現過的號碼
    setInterval(() => {
        addNewNumber();
        showPastNumbers();
    }, 1000);

})();

