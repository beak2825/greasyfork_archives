// ==UserScript==
// @name         手机自动抢购助手
// @namespace    https://greasyfork.org/scripts/477552
// @version      0.1.3
// @description  在抢购页面自动提交订单
// @author       Oliver
// @match        https://www.vmall.com/product/*.html
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDAgNzkuMTcxYzI3ZiwgMjAyMi8wOC8xNi0xODowMjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMC0yMFQwODo1Nzo1NiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTAtMjBUMDk6MDA6NTgrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTAtMjBUMDk6MDA6NTgrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVmOThjOGU5LWM3MzItYzI0NC04NGMxLTYxMTRjMTgzMzE5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Zjk4YzhlOS1jNzMyLWMyNDQtODRjMS02MTE0YzE4MzMxOTYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1Zjk4YzhlOS1jNzMyLWMyNDQtODRjMS02MTE0YzE4MzMxOTYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjVmOThjOGU5LWM3MzItYzI0NC04NGMxLTYxMTRjMTgzMzE5NiIgc3RFdnQ6d2hlbj0iMjAyMy0xMC0yMFQwODo1Nzo1NiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pibo2osAAAQVSURBVHic7ZvNixxFGId/VdU93TPd87HrGCe7qweNko2gqODNi+iKH6d4EWQlB4/6H3jILQj+BeLFixhvioKJ0RCCGiHgasRlQTFmze7OzmRxdz77o+r1sLugh0Hf1ukK2M+536pfP1NdVQNVgojA4Z1338d7Zz9CEFRQrQav3VjfWCaiRa01hBCstrJCRBBCoOx760KIDxaPH3vz+APHxvV6iOWXTrLacrid+76HMAxw/df1c5VKeSlJEjiOC6UkuDKzcih6d69/IkmT0/G11VcX5o8+dd+996xx25Lcgk5nB6lOzxtjlogInudBSpHby/+ZUslFGATY7u4sXLz09ZWV71YVtw22gJVrqyc3N7efDsMAUub3q0+CiNCcncHNjXbj3IVLb3Dr2QJ6e/3XoziBlOzSqWGMgVISvu+d4tay32IcRY86OX7v/xTXdRDHSYtbxxZAgCdkPrM9B6UUkjTR3Los4zjOUDN1DpZGw627fT5kSxQCbAewTSHAdgDbFAJsB7BNIcB2ANsUAmwHsE0hwHYA2xQCbAewTSHAdgDbFAJsB7BNIcB2ANsUAmwHsE0hwHYA2xQCbAewTSHAdgDbFAJsB7BNIcB2ANsUAmwHsE0hwHYA2/zvBbAPSw+GI/R6fRjNPpE2VVKtkWr2MUG+gNaRJgQIZd9ndzZNtNbwvBK7ji3g1MsvYhxFt9VZYQAgQ3Bc9mFxvgCvVIIhA6X4nU0TYwhuHgKiOEYUxf+JgDhJACK4rntw5yB7W8YQjMlBwL9FSonhcIQkTdGo1yClwO+7PQBAGFRyP4WeqwApJfZ6fdRrVTy4eD8W5o5CKol2u4PVtZ+wubWNWq2aq4RcBYxGY1TDAEtPPvGXGXt+roX5uRY+++Iytju3EIZBbhJyncrHUYRHHjoxcbl6/LGHIYTIdY+RmwCtNcKgguYdsxOfqddruLM5iyjO70pCFgGZpn+ig+tuf3fZJKe7h4ewBQghMn2djqPQ6w/Q7e5MfGZ3r4dO9xZKJTdDD4AQYBeyBcRJsqYy7gI9z8O33/84cYh/c3UFRJRpjyEEYAzG3Dr2m0gptozJNkNXyj56/QHOf34ZP/9yA3GcINUav21s4cLFL9He7iAMsq0ABzU3uXXsZXBmpvF2u919jlsH7N/vq1VDDAZDfHXlKhqNGqSU+xshItSq2fcAWhs0GpWz3Dr2CCj73oflsvdplr+ewL4E3/dQrYYYjSMMBkNUyj7CMPsuME01PM+93qjXznBr2SMgjhMopZ4VQnwM4HljzP7aTQTuZv5wLjHGwDCXfiElQAQiguM4P9x1pPmMo1TKayWDACEEjDFwHecFIcQrjlLLhszdrlQtKYWc9gbucJFMte4CWPe90ieO47yllGOyzE1/AC4leEiH55V0AAAAAElFTkSuQmCC
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477552/%E6%89%8B%E6%9C%BA%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477552/%E6%89%8B%E6%9C%BA%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function sleep(delay) {
        let start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    }
    var checkCount = 1;
    var submitInterval;
    var buyInterval;
    var checkStartInterval;
    function checkBuyBtn() {
        console.log("刷新" + checkCount + "次");
        checkCount++;
        let btn = $('#pro-operation .product-button02');
        if (btn.hasClass("disabled")) {
            console.log("未开始");
        } else {
            sleep(10);
            btn.click();
            clearInterval(buyInterval);
            submitInterval = setInterval(submitOrder, 10);
        }
    }
    function submitOrder() {
        let sub = document.getElementById("checkoutSubmit");
        if (sub) {
            document.getElementById("checkoutSubmit").click();
            clearInterval(submitInterval);
            document.getElementById("checkoutSubmit").click();
        }
        sub = undefined;
    }
    function checkStart() {
        let spans = $('#pro-operation-countdown li span');
        if(spans && spans.length > 2 && spans.eq(0).text() == '00' && spans.eq(1).text() == '00' && parseInt(spans.eq(2).text()) < 1) {
            console.log('开启抢购');
            clearInterval(checkStart);
            buyInterval = setInterval(checkBuyBtn, 1);
        }
    }
    $(function(){
        if($('#pro-operation').length < 1) {
            console.log('该商品不是抢购商品');
            return;
        }
        console.log('开启插件');
        console.log('开抢前一分钟自动开启识别');
        checkStartInterval = setInterval(checkStart, 10000);
    });
})();