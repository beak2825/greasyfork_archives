// ==UserScript==
// @name         104自動勾選
// @namespace
// @version      0.4
// @description  修改頁面，將圖標添加活動類，勾選核取方塊和單選按鈕，然後在5秒後自動點擊按鈕並在點擊後5秒後關閉頁面
// @author       Scott
// @match        https://www.104.com.tw/*
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/491783/104%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/491783/104%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyPage() {
        // 添加 "active" 類到具有 "icon-arrow-down" 類的 <i> 元素
        var iconElement = document.querySelector('i.icon-arrow-down');
        if (iconElement) {
            iconElement.classList.add('active');
        }

        // 將指定的 checkbox 設置為勾選狀態
        var checkboxElement = document.getElementById('check_exam');
        if (checkboxElement) {
            checkboxElement.checked = true;
        }

        // 取消其他單選按鈕的選擇
        var radioButtons = document.querySelectorAll('input[type=radio][name=resumeList]');
        if (radioButtons) {
            radioButtons.forEach(function(radioButton) {
                radioButton.checked = false;
            });
        }

        // 將指定的單選按鈕設置為選中狀態
        var radioButtonElement = document.getElementById('resumeList0');
        if (radioButtonElement) {
            radioButtonElement.checked = true;
        }

        // 將指定的 div 的 display 屬性設置為 'block'
        var divElement = document.getElementById('test-text-area');
        if (divElement) {
            divElement.style.display = 'block';
        }

        // 插入職位名稱到 textarea 元素
        var jobNameElement = document.querySelector('a.job-name');
        var jobName = jobNameElement ? jobNameElement.textContent.trim() : '職位名稱'; // 如果找不到元素，則使用預設值
        var newContent = `您好，我是 林宗陞，對於貴公司開立的「${jobName}」一職深感嚮往，故想爭取此機會。

我曾在「日商特思爾大宇宙」、「數字科技股份有限」和「阿卡迪亞資訊」擔任「客服專員」相關職務，並在這職務中主要負責客戶聯繫及客戶應對、維護客戶名單，以及提供各類相關客服服務，基於這樣的背景經驗下，相信自己可以勝任這份職務。

在客服代表的職位上，成功解決超過1000次客戶問題，並顯著提升客戶滿意度達30%。
這段豐富的經歷培養了我的耐心和應變能力，提升對客戶的服務品質。
透過敏感度高的應對，我能夠快速而有效地解決各種問題，同時建立了穩固的客戶關係。


同時，我擁有會計人工記帳的乙級學科和丙級學術科完整證照，代表我在簿記（book keeping）、表格編製和計算方面擁有相關專業知識。學科證書是我會計專業背景的有力證明；並提供了我堅實的會計基礎。

此外，我持有具體的中級會計學能力，能夠處理較複雜的會計任務，包括檢查和調整、帳目、準備財務報表以及分析財務數據。這些技能使我有信心能夠在會計部門中高效地工作，為公司提供精確和有價值的財務信息。


希望有機會與貴公司進一步討論該職務；並且多加認識及了解貴公司，我的聯絡方式：電話（0909-030-295）、電子郵件（n7418521@gmail.com），時間皆可以配合。


感謝您撥冗閱讀我的求職申請，誠懇期盼能有機會參與面試，謝謝。`;
        var textareaElement = document.getElementById("job_com_content");
        if (textareaElement) {
            textareaElement.textContent = newContent;
        }

        // 找到按鈕元素
        var buttonElement = document.getElementById('btSend');
        if (buttonElement) {
            // 5秒後自動點擊按鈕
            setTimeout(function() {
                buttonElement.click();
            }, 5000);
        }

        // 5秒後關閉頁面
        setTimeout(function() {
            window.close();
        }, 10000); // 這裡是 5 秒後再加 5 秒，以確保在按鈕點擊後再等待 5 秒再關閉頁面
    }

    modifyPage();
})();
