// ==UserScript==
// @name         shumin-微信读书
// @version      2.0.0
// @namespace    http://tampermonkey.net/
// @description  自用特化版本，原版参见https://greasyfork.org/zh-CN/scripts/421994
// @contributor  Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife;SimonDW
// @author       qianjunlang
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/462483/shumin-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/462483/shumin-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.meta.js
// ==/UserScript==
'use strict';

/*
GM_addStyle('*{font-family: FangSong !important;}');
//GM_addStyle(".readerChapterContent{color: #FeFeFe;}");
var style_tag = document.createElement('style');
style_tag.innerHTML = `
    .bookInfo_title, .readerHeaderButton, .readerFooter_button, .readerTopBar, .readerTopBar_title_link, .readerTopBar_title_chapter, .actionItem.addShelfItem {
        font-family: Microsoft YaHei UI !important;
    }
`;
document.head.appendChild(style_tag);
*/

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

window.addEventListener('load', function() {

    function getCurrentMaxWidth(element) {
        let currentValue = window.getComputedStyle(element).maxWidth;
        currentValue = currentValue.substring(0, currentValue.indexOf('px'));
        currentValue = parseInt(currentValue);
        return currentValue;
    }
    function changeWidth(increse) {
        const item1 = document.querySelector(".readerContent .app_content");
        const item2 = document.querySelector('.readerTopBar');
        const currentValue = getCurrentMaxWidth(item1);

        item1.style['max-width'] = item2.style['max-width'] = parseInt( currentValue + 100*increse ) + 'px';

        const myEvent = new Event('resize');
        window.dispatchEvent(myEvent)
    }


    //$(".readerControls_item.isNormalReader").css("display", "none");    // 删除双栏
    const downloadBtn = document.querySelector(".readerControls_item.download");
    if (downloadBtn) downloadBtn.style.display = "none";    // 删除下载APP按钮
    const wetypeBtn = document.querySelector(".readerControls_item.wetype");
    if (wetypeBtn) wetypeBtn.style.display = "none";  // 删除微信输入


    const controls = document.querySelector('.readerControls');
    if (controls) {
        const buttonHTML = `<button id='lv-button1' class='readerControls_item widthIncrease' style='color:#ffffff;cursor:pointer;'>←→</button><button id='lv-button2' class='readerControls_item widthDecrease' style='color:#ffffff;cursor:pointer;'>→←</button>`;
        controls.insertAdjacentHTML('beforeend', buttonHTML);


        document.getElementById('lv-button1').addEventListener('click', () => changeWidth(+1));
        document.getElementById('lv-button2').addEventListener('click', () => changeWidth(-1));
        changeWidth(5); // 默认加宽到最大


        let rightBorder = 14, rightOffset = -10;
        controls.style.position = "fixed";
        controls.style.transition = "right 0.05s ease-in 0s";
        controls.style.borderRight = rightBorder + "px solid transparent";
        controls.style.left = "auto";
        controls.style.opacity = "0.3";
        controls.style.right = (rightOffset - rightBorder) + "px";


        controls.addEventListener('mouseenter', function() {
            this.style.opacity = "1";
            this.style.right = "0px";
        });
        controls.addEventListener('mouseleave', function() {
            this.style.opacity = "0.3";
            this.style.right = (rightOffset - rightBorder) + "px";
        });
    }

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


    const topBar = document.querySelector('.readerTopBar');
    if (topBar) {
        topBar.style.transition = "top 0.1s ease-in 0s";

        let windowTop = 0;
        window.addEventListener('scroll', function() {
            let scrollS = window.scrollY;

            topBar.style.top = (scrollS >= windowTop ? "-70px" : "0px");

            windowTop = scrollS;
        });
    }

})();
