// ==UserScript==
// @license MIT
// @name         微信读书网页版标注笔记快捷键
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用快捷键在微信阅读网页版中快捷标注，快捷发布想法。
// @author       Your Name
// @match        *://weread.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497926/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E6%A0%87%E6%B3%A8%E7%AC%94%E8%AE%B0%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/497926/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E6%A0%87%E6%B3%A8%E7%AC%94%E8%AE%B0%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('weread script called');

    document.onmouseup = () => {
        const toolbarContainer = document.querySelector('.reader_toolbar_container');

        if (!toolbarContainer) return; // 未出现工具栏

        let copyBtn = document.querySelector('.toolbarItem.copy'), // 复制按钮
            underlineBgBtn = document.querySelector('.toolbarItem.underlineBg'), // 马克笔按钮
            underlineHandWriteBtn = document.querySelector('.toolbarItem.underlineHandWrite'), // 波浪线按钮
            underlineStraightBtn = document.querySelector('.toolbarItem.underlineStraight'), // 直线按钮
            removeUnderlineBtn = document.querySelector('.toolbarItem.removeUnderline'), // 删除划线按钮
            reviewBtn = document.querySelector('.toolbarItem.review'), // 写想法按钮
            queryBtn = document.querySelector('.toolbarItem.query'), // 查询按钮
            submitIdeaBtn = document.querySelector('.writeReview_submit_button.wr_btn.wr_btn_Big'), // 发表想法按钮
            removeIdeaBtn = document.querySelector('.readerReviewDetail_item .actions .actionItem'), // 删除想法按钮
            closeIdeaBtn = document.querySelector('.readerWriteReviewPanel .closeButton'); // 关闭想法窗口按钮

        document.onkeydown = (e) => {
            const isCmdBtnPressed = e.metaKey, // 是否按下了 cmd 键
                  isCtrlBtnPressed = e.ctrlKey; // 是否按下了 ctrl 键

            const keyCode = e.keyCode;

            console.log('keyCode: ', keyCode);

            if (keyCode === 49) {
                if (isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 1 复制');
                copyBtn && copyBtn.click();
            } else if (keyCode === 50) {
                if (isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 2 马克笔');
                underlineBgBtn && underlineBgBtn.click();
            } else if (keyCode === 51) {
                if (isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 3 波浪线');
                underlineHandWriteBtn && underlineHandWriteBtn.click();
            } else if (keyCode === 52) {
                if (isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 4 直线');
                underlineStraightBtn && underlineStraightBtn.click();
            } else if (keyCode === 53) {
                if (isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 5 写想法');
                reviewBtn && reviewBtn.click();
                e.preventDefault();
            } else if (keyCode === 54) {
                if (isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 6 查询');
                queryBtn && queryBtn.click();
            } else if (keyCode === 8) {
                if (isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 backspace 删除记录（包括想法的删除和下划线的删除）');
                // 删除按钮在鼠标抬起的那一刻，可能还没生成
                removeUnderlineBtn = document.querySelector('.toolbarItem.removeUnderline');
                removeUnderlineBtn && removeUnderlineBtn.click();

                removeIdeaBtn = document.querySelector('.readerReviewDetail_item .actions .actionItem');
                removeIdeaBtn && removeIdeaBtn.click();
            } else if ((isCmdBtnPressed && keyCode === 13 || isCtrlBtnPressed && keyCode === 13)) {
                console.log('按下 cmd + enter | ctrl + enter 提交想法');
                submitIdeaBtn = document.querySelector('.writeReview_submit_button.wr_btn.wr_btn_Big');
                submitIdeaBtn && submitIdeaBtn.click();
            } else if (keyCode === 27) {
                if (!isVisible_ReaderWriteReviewPanel()) return;
                console.log('按下 esc 关闭想法记录窗口');
                closeIdeaBtn = document.querySelector('.readerWriteReviewPanel .closeButton'); // 关闭想法窗口按钮
                closeIdeaBtn.click();
            }
        };

        /* help info
        按下 cmd：e.metaKey === true 或 e.keyCode === 91
        按下 ctrl：e.ctrlKey === true 或 e.keyCode === 17
        按下 backspace：e.keyCode === 8
        按下 enter：e.keyCode === 13
        按下 esc：e.keyCode === 27
        按下 1：e.keyCode === 49
        按下 2：e.keyCode === 50
        按下 3：e.keyCode === 51
        按下 4：e.keyCode === 52
        按下 5：e.keyCode === 53
        按下 6：e.keyCode === 54
        */
    };

    /**
     * 记录想法的弹窗是否可见
     * @returns Boolean
     */
    function isVisible_ReaderWriteReviewPanel() {
        const dom = document.querySelector('.readerWriteReviewPanel');
        if (!dom) return false;
        return dom.style.display === 'none' ? false : true;
    }

})();
