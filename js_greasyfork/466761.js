// ==UserScript==
// @name         jcbstar
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  starbucks at JCB is especially delicious
// @author       YC白白
// @match        https://www.taodining.com.tw/star23/redeemed/*/*
// @match        https://zxjzqbojhkxfxcbdkh5xdw.on.drv.tw/yaohtml/jcbstar/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taodining.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466761/jcbstar.user.js
// @updateURL https://update.greasyfork.org/scripts/466761/jcbstar.meta.js
// ==/UserScript==

let page_timer = setInterval(function() {
    let page_block = document.querySelector('.page-block')
    if (page_block) {
        var btn = document.querySelector('a.btn-send');
        btn.setAttribute('id', 'confirmExchange');

        // extract last 4 digits of card number
        var lastFourDigitsText = document.querySelector('.exchange-description-title span').innerText;
        // var lastFourDigits = lastFourDigitsText.split('：')[1];
        var lastFourDigits = lastFourDigitsText.split('：')[1].split(' ')[0];
        console.log(lastFourDigitsText);

        // extract voucher number
        var voucherNumberText = document.querySelector('.exchange-description-content span').innerText;
        var voucherNumber = voucherNumberText;
        console.log(voucherNumber);

        document.getElementById('confirmExchange').addEventListener('click', function(event) {
            event.preventDefault();
            var exchangeDescription = document.querySelector('.exchange-description');
            var exchangeBtn = document.querySelector('.exchange-btn');

            // // extract last 4 digits of card number
            // var lastFourDigitsText = document.querySelector('.exchange-description-title span').innerText;
            // var lastFourDigits = lastFourDigitsText.split('：')[1];

            // // extract voucher number
            // var voucherNumberText = document.querySelector('.exchange-description-content span').innerText;
            // var voucherNumber = voucherNumberText;

            // get current time
            var now = new Date();
            var yyyy = now.getFullYear();
            var mm = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
            var dd = String(now.getDate()).padStart(2, '0');
            var hh = String(now.getHours()).padStart(2, '0');
            var min = String(now.getMinutes()).padStart(2, '0');
            var sec = String(now.getSeconds()).padStart(2, '0');
            var formattedTime = yyyy + '年' + mm + '月' + dd + '日 ' + hh + ':' + min + ':' + sec;

            // replace the content of .exchange-description
            exchangeDescription.innerHTML = `
                <h5 style="color: #e13426;text-align: center;font-size: 18px;">此序號已完成兌換 <span style="color: black">( 卡號末4碼：${lastFourDigits} )</span></h5>
                <div class="exchange-description-content">
                    優惠序號${voucherNumber}已於${formattedTime}兌換完畢，謝謝您的使用。
                </div>
            `;

            // remove .exchange-btn
            exchangeBtn.remove();
        });
        console.log(`卡號末4碼：${lastFourDigits}`);
        console.log(`優惠序號：${voucherNumber}`);
        console.log(`done!`);
        alert(`卡號末4碼：${lastFourDigits}\n優惠序號：${voucherNumber}\ndone!`);
        clearInterval(page_timer)
    } else {
        console.log('沒找到 page_block');
    }
}, 1000)