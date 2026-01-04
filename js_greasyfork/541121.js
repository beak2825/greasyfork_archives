// ==UserScript==
// @name         NESBBS 自动签到
// @namespace    https://www.nesbbs.com/
// @version      1.2
// @description  自动签到，只有按钮存在时才执行签到
// @author       Riki
// @license      CC-BY-4.0
// @match        https://www.nesbbs.com/bbs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541121/NESBBS%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541121/NESBBS%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找签到入口按钮
    const signLink = [...document.querySelectorAll('a')].find(a =>
        a.getAttribute('onclick')?.includes("showWindow('dsu_paulsign'") && a.textContent.includes('签到领奖')
    );

    if (!signLink) {
        console.log('签到入口不存在，推测已签到，脚本退出');
        return; // 已签到，不执行
    }

    console.log('签到入口存在，开始签到流程');

    // 点击签到入口
    signLink.click();

    // 轮询弹窗，执行自动签到
    const popupTimer = setInterval(() => {
        const moodList = document.querySelectorAll('#fwin_content_dsu_paulsign ul.qdsmilea li');
        const noFillRadio = document.querySelector('input[name="qdmode"][value="3"]');
        const submitBtn = [...document.querySelectorAll('#fwin_content_dsu_paulsign button, #fwin_content_dsu_paulsign input[type=button]')]
                            .find(btn => btn.textContent.includes('签到') || btn.value === '签到');

        if (moodList.length > 0 && noFillRadio && submitBtn) {
            console.log('弹窗加载，自动选择表情+不填写+提交');

            moodList[0].click();
            noFillRadio.checked = true;
            noFillRadio.dispatchEvent(new Event('click', { bubbles: true }));
            submitBtn.click();

            clearInterval(popupTimer);
            console.log('签到完成，等待页面更新按钮消失');
        }
    }, 500);

})();
