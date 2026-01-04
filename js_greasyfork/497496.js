// ==UserScript==
// @name         jcbstar
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  starbucks at JCB is especially delicious
// @author       YC白白
// @match        https://www.taodining.com.tw/star*/redeemed/*/*
// @match        https://zxjzqbojhkxfxcbdkh5xdw.on.drv.tw/yaohtml/jcbstar/
// @match        https://yaocaptain.com/jcbstar/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taodining.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497496/jcbstar.user.js
// @updateURL https://update.greasyfork.org/scripts/497496/jcbstar.meta.js
// ==/UserScript==

let page_timer = setInterval(function() {
    // 嘗試找到頁面上的 .page-block 元素
    let page_block = document.querySelector('.page-block');
    if (page_block) {
        // 將按鈕 a.btn-send 的 ID 設置為 confirmExchange
        var btn = document.querySelector('a.btn-send');
        btn.setAttribute('id', 'confirmExchange');

        // 提取卡號末4位數字
        var lastFourDigitsText = document.querySelector('.exchange-description-title span').innerText;
        var lastFourDigits = lastFourDigitsText.split('：')[1].split(' ')[0];
        console.log(lastFourDigitsText);

        // 提取優惠券號碼
        var voucherNumberText = document.querySelector('.exchange-description-content span').innerText;
        var voucherNumber = voucherNumberText;
        console.log(voucherNumber);

        // 當用戶點擊 confirmExchange 按鈕時
        document.getElementById('confirmExchange').addEventListener('click', function(event) {
            event.preventDefault();
            var exchangeDescription = document.querySelector('.exchange-description');
            var exchangeBtn = document.querySelector('.exchange-btn');

            // 獲取當前時間
            var now = new Date();
            var yyyy = now.getFullYear();
            var mm = String(now.getMonth() + 1).padStart(2, '0'); // 一月是 0!
            var dd = String(now.getDate()).padStart(2, '0');
            var hh = String(now.getHours()).padStart(2, '0');
            var min = String(now.getMinutes()).padStart(2, '0');
            var sec = String(now.getSeconds()).padStart(2, '0');
            var formattedTime = yyyy + '年' + mm + '月' + dd + '日 ' + hh + ':' + min + ':' + sec;

            // 替換 .exchange-description 的內容
            exchangeDescription.innerHTML = `
                <h5 style="color: #e13426;text-align: center;font-size: 18px;">此序號已完成兌換 <span style="color: black">( 卡號末4碼：${lastFourDigits} )</span></h5>
                <div class="exchange-description-content">
                    優惠序號${voucherNumber}已於${formattedTime}兌換完畢，謝謝您的使用。
                </div>
            `;

            // 移除 .exchange-btn 按鈕
            exchangeBtn.remove();
        });

        // 在控制台輸出卡號末4碼和優惠序號
        console.log(`卡號末4碼：${lastFourDigits}`);
        console.log(`優惠序號：${voucherNumber}`);
        console.log(`done!`);

        // 彈出包含卡號末4碼和優惠序號的提示框
        alert(`卡號末4碼：${lastFourDigits}\n優惠序號：${voucherNumber}\ndone!`);

        // 停止定時器
        clearInterval(page_timer);
    } else {
        // 如果未找到 .page-block 元素，繼續等待
        console.log('沒找到 page_block');
    }
}, 200);
