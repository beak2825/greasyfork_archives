// ==UserScript==
// @name         GitHub Card Input
// @description  Automate GitHub Card Input
// @version      0.2
// @license      MIT
// @author       LD
// @match        https://www.zuora.com/apps/PublicHostedPageLite.do**
// @match        https://www.recaptcha.net/recaptcha/enterprise/anchor*
// @grant        none
// @namespace https://greasyfork.org/users/1218336
// @downloadURL https://update.greasyfork.org/scripts/488094/GitHub%20Card%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/488094/GitHub%20Card%20Input.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function elementReady(selector) {
        console.log(selector);
        return new Promise((resolve, reject) => {
            let el = document.querySelector(selector);
            if (el) {
                resolve(el);
            }
            new MutationObserver((mutationRecords, observer) => {
                    // Query for elements matching the specified selector
                    Array.from(document.querySelectorAll(selector)).forEach((element) => {
                        resolve(element);
                        //Once we have resolved we don't need the observer anymore.
                        observer.disconnect();
                    });
                })
                .observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomLength(length) {
        let min = Math.pow(10, length - 1);
        let max = Math.pow(10, length) - 1;
        return getRandomInt(min, max);
    }

    function generateLastDigit(cardNumber) {
        var total = 0;

        // Apply Luhn algorithm rules on the card number
        for (var i = 0; i < 15; i++) {
            var digit = parseInt(cardNumber.charAt(i));

            if (i % 2 == 0) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            total += digit;
        }

        // Generate the last digit such that the whole number passes Luhn check
        var lastDigit = (10 - (total % 10)) % 10;

        return lastDigit;
    }

    function generateCard(bin = null, month = null, year = null, cvv = null) {
        // 如果月份为null，则生成一个1到12之间的随机月份
        if (month === null) {
            month = getRandomInt(1, 12).toString();
            month = month.padStart(2, '0'); // 补全两位
        }
        // 如果年份为null，则生成一个当前年份到未来10年内的随机年份
        if (year === null) {
            const currentYear = new Date().getFullYear();
            year = getRandomInt(currentYear, currentYear + 10).toString();
        }
        // 如果cvv为null，则生成一个100到999之间的随机cvv码
        if (cvv === null) {
            cvv = getRandomLength(3);
        }
        if (bin) {
            bin += getRandomLength(15 - bin.length);
        } else {
            bin = getRandomLength(15);
        }
        bin += generateLastDigit(bin);
        // 将给定的 bin、month、year 和 cvv 拼接成指定的格式
        const card = `${bin}|${month}|${year}|${cvv}`;
        return card;
    }

    function setForm(cardInfo) {
        let cardArr = cardInfo.split('|');
        let cardNumber = cardArr[0];
        let cardMonth = cardArr[1];
        let cardYear = cardArr[2];
        let cardSecurityCode = cardArr[3];
        elementReady("#input-creditCardNumber").then(() => {
            document.querySelector("#input-creditCardNumber").click();
            document.querySelector("#input-creditCardNumber").value = cardNumber;
            document.querySelector("#input-creditCardExpirationMonth").click();
            document.querySelector("#input-creditCardExpirationMonth").querySelector(
                `option[value='${cardMonth}']`).selected = true;
            document.querySelector("#input-creditCardExpirationYear").click();
            document.querySelector("#input-creditCardExpirationYear").querySelector(
                `option[value='${cardYear}']`).selected = true;
            document.querySelector("#input-cardSecurityCode").click();
            document.querySelector("#input-cardSecurityCode").value = cardSecurityCode;
            // 等待验证码加载完成
            setTimeout(function () {
                document.querySelector("#submitButton").click();
            }, 8000);
            var iframes = document.getElementsByTagName('iframe'); // 获取页面上所有的 iframe
            console.log(iframes)
            for (var i = 0; i < iframes.length; i++) {
                var iframe = iframes[i];
                // 判断 iframe 的 title，找到你想要的那个
                if (iframe.getAttribute('title') === 'reCAPTCHA') {
                    iframe.onload = function () {
                        // alert('子iframe已加载完毕!');
                        document.querySelector("#submitButton").click();
                    }
                    break;
                }
            }
        });
    }
    // TODO 更改
    let cardInfo = generateCard("xxxxxxxx", "xx", "xxxx");
    console.log(cardInfo);
    setForm(cardInfo)

})();