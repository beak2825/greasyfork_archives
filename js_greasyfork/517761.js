// ==UserScript==
// @name            SNUT实验室安全教育学习网挂机
// @namespace       https://github.com/Pumblus
// @version         0.2
// @description     SNUT实验室安全教育学习网挂机，4分钟刷新一次
// @author          Pumblus
// @originalAuthor  Suzuran
// @license         MIT
// @match           http://218.195.96.53:82/*
// @match           https://sysaqjy.snut.edu.cn/*
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/517761/SNUT%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E7%BD%91%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/517761/SNUT%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E7%BD%91%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

function checkForTextAndRefresh() {
    const checkText = () => {
        const hasLearningText = document.body.innerText.includes("考前练习");
        const hasManualText = document.body.innerText.includes("电气类");

        if (hasLearningText && hasManualText) {
            console.log("目标文本找到，页面将在4分钟后刷新...");
            setTimeout(() => {
                location.reload();
            }, 4 * 60 * 1000);
        } else {
            console.log("未找到目标文本，继续监控...");
        }
    };

    setInterval(checkText, 1000);
}

checkForTextAndRefresh();
