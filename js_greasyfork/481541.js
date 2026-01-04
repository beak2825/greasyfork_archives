// ==UserScript==
// @name         A财星统计
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  金额统计
// @author       You
// @match        http://38.181.34.123:9000/record
// @icon         http://34.123/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481541/A%E8%B4%A2%E6%98%9F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/481541/A%E8%B4%A2%E6%98%9F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const scrollToTop = () => {
        if (window.scrollY != 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const centeredStyle = `.centered-element {
  position: fixed;
  top: 30%;
  left: 80%;
  transform: translate(-50%, -50%);
}`;

    GM_addStyle(centeredStyle);

    const button = document.createElement('button');
    button.textContent = '转换为金额';
    button.classList.add('centered-element');
    document.body.appendChild(button);

    // 为按钮添加点击事件处理程序
    button.addEventListener('click', function () {
        summaryTotalWinScore();
        convertMoney();
    });

    var moreBtn = setInterval(function () {
        if ($("#getmore").text() != "没有更多数据了") {
            $("#getmore").click();
        } else {
            clearInterval(moreBtn);
        }
    }, 2000);

    const scoreRate = 50; // 积分系数
    const feeRate = 30; // 房费系数

    function matchScore(strScore) {
        const regex = /积分:(\d+)/;
        const match = strScore.match(regex);
        if (match) {
            return parseInt(match[1]);
        }
        return 0;
    }

    function summaryTotalWinScore() {
        const totalWinner = parseInt($("#totalWinner").val()); // 总房费个数
        var targetElements = $("[id^='countMajiang'][id$='-item']").filter(function () {
            return this.style.cssText === "opacity: 1;";
        });

        targetElements.forEach(element => {
            let winner = $(element).find("[id^='countMajiang'][id$='-all']");
            let winnerVal = $(winner).val();
            if (winnerVal) {
                let winnerScore = matchScore(winnerVal);
                $(winner).val(winnerScore + "("+(winnerScore * scoreRate)+")");
            }
        });

        if (totalWinner) {
            $("#totalWinner").val(totalWinner+"("+(totalWinner * feeRate)+")");
        }
    }

    function convertMoney() {
        var tableEles = document.getElementsByClassName("tt-list-type1");
        // 遍历每个匹配的元素
        for (var i = 0; i < tableEles.length; i++) {
            var element = tableEles[i];
            // 改文本
            $(element).find("tr:eq(3)").find("td:eq(0)").text('总金额');
            $(element).find("tr:eq(3)").find("td:eq(1)").text('大赢家');
            $(element).find("tr:eq(3)").find("td:eq(2)").text('总合计');

            // 取原值
            let strScore = $(element).find("tr:eq(2)").find("td:eq(0)").find("a").text(); // 胜率值
            let strFee = $(element).find("tr:eq(2)").find("td:eq(1)").text(); // 过滤大赢家值
            let amount = parseInt(strScore) * scoreRate; // 总积分
            let feeAmount = parseInt(strFee) * feeRate; // 房费

            // 改值
            $(element).find("tr:eq(4)").find("td:eq(0)").text(amount);
            $(element).find("tr:eq(4)").find("td:eq(1)").text(feeAmount);
            $(element).find("tr:eq(4)").find("td:eq(2)").text((amount - feeAmount));
        }

        scrollToTop();
    }
})();