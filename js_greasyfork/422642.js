// ==UserScript==
// @name         扇贝快捷键增强
// @namespace    DIYgod
// @version      1.5
// @description  扇贝快捷键增强增强
// @author       DIYgod
// @match        https://web.shanbay.com/wordsweb/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422642/%E6%89%87%E8%B4%9D%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/422642/%E6%89%87%E8%B4%9D%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', (e) => {
        // 隐藏单词
        if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
            var styleSheet = document.createElement("style");
            styleSheet.innerText = `
.index_word__3nhJU>span,
.index_phonetic__o-RcB {
    display: none;
}
.index_hint__2Z39O,
.index_hint__2Z39O .highlight {
    font-size: 0;
}
`;
            document.head.appendChild(styleSheet);
        }
        // 下一个
        const nextBtn = document.querySelector('.StudyPage_nextBtn__1ygGn') || document.querySelector('.index_tenseAnswer__2o47S') || document.querySelector('.index_continueBtn__34NqT');
        const input = document.querySelector('.index_input__1SBLh');
        if (e.key === '1' && nextBtn) {
            nextBtn.click();
            input && input.blur();
            e.stopPropagation();
        }
        // 单词
        const pronounceBtn1 = document.querySelector('.Pronounce_audio__3xdMh');
        if (e.key === '3' && pronounceBtn1) {
            pronounceBtn1.click();
            e.stopPropagation();
        }
        // 例句
        const pronounceBtn2 = document.querySelector('.index_icon__1IK2K');
        if (e.key === '4' && pronounceBtn2) {
            pronounceBtn2.click();
            e.stopPropagation();
        }
        // 单词
        const pronounceBtn3 = document.querySelector('.index_trump__3bTaM');
        if (e.key === '3' && pronounceBtn3) {
            pronounceBtn3.click();
            e.stopPropagation();
        }
        // 全屏
        if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
            const studyPage = document.querySelector('.study-page');
            studyPage.style.backgroundColor = '#fff';
            studyPage.style.overflow = 'scroll';
            studyPage.requestFullscreen();
        }
    }, true);
})();