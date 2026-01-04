// ==UserScript==
// @name         coze space ui for mobile
// @description  **coze space ui for mobile**
// @namespace    https://github.com/SolidZORO
// @version      0.0.8
// @author       Jason Feng <solidzoro@live.com>
// @match        *://www.coze.com/space/**
// @run-at       document-start
// @icon         https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/obric/coze/favicon.1970.png
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488242/coze%20space%20ui%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/488242/coze%20space%20ui%20for%20mobile.meta.js
// ==/UserScript==

const SCREEN_WIDTH = `${window.innerWidth > 640 ? 640 : window.innerWidth}px`;

const myStyles = `


.semi-portal[style*="z-index: 1000"] {
  display: none;
}


/* 右下角反馈图标 */
.feelgood {
  display: none !important;
}

.sidesheet-container {
  grid-template-columns: auto !important;
}

/* 调节参数面板 */
.sidesheet-container > div:nth-of-type(1),
.sidesheet-container > div:nth-of-type(2) {
  display: none;

}

/* 调节  Voice bot */
.sidesheet-container > div:nth-of-type(3) {

}

.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(1) {
  background: transparent;
  position: absolute;
  top: 1px;
  right: 1px;
//  display: block;
  width: 100%;
  z-index: 99999999999;
}

/* 调节  Voice bot Preview */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) {
  display: none !important;
}

.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) {
  background: transparent;
}

/* 发音设置 */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(2) button {
  background: white;
  // padding: 5px 8px !important;
  border-radius: 8px !important;
  opacity: 0.1;
}


/* 主要聊天框 */
.sidesheet-container > div:nth-of-type(3) {
 width: ${SCREEN_WIDTH};
 min-width: unset;
 max-width: unset;
 margin: 0 auto;
}



/* Char 聊天窗口 */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) {
 width: 100%;
 min-width: unset;
 max-width: unset;
}

/* 每条回复-wrapper */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) {
 padding: 0;
}



/* 每条回复 */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div {
//  flex-direction: row;
 width: auto;
 min-width: unset;
 max-width: unset;
}

/* 每条回复 div1 */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div > div {
width: 100%;
min-width: unset;
max-width: unset;
}

/* 每条回复 div1 问题，衍生提问 */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div > div > div:nth-of-type(1),
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div > div > div:nth-of-type(1) > div {
width: unset;
min-width: unset;
max-width: unset;

  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* 每条回复 div1 回答 */
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div > div > div:nth-of-type(2),
.sidesheet-container > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div > div > div:nth-of-type(2) > div {
width: unset;
min-width: unset;
max-width: unset;
}

/* Char NavBar */
.semi-spin-children > div:nth-of-type(1) {
  display: none;
}


/* coze 改版 v1 */
/* coze 改版 v1 */
/* coze 改版 v1 */


/* Char 头像 */
.chat-uikit-message-box-container__message__nickname,
.chat-uikit-message-box-container__avatar-wrap {
  display: none !important;
}


.chat-uikit-message-box-container {
  width: 100% !important;
  margin: 0px !important;
}

.chat-uikit-message-box-container__message__message-box {
  min-width: 100% !important;
  width: 100% !important;
  max-width: 100% !important;
}

.chat-uikit-message-box-container__message {
  min-width: 100% !important;
  width: 100% !important;
  max-width: 100% !important;
}

.chat-uikit-suggestion-item__content {
    padding: 1px 10px;
}

`;




function main(injectType) {
  console.log('🤖 UserScript injectType:', injectType);

  //
  //
  // style tag 注入
  const styleSheet = document.createElement('style');
  styleSheet.textContent = myStyles;
  document.head.appendChild(styleSheet);

  //
  //
  // 等待 html 变化执行 inline style 注入
  const htmlObserver = new MutationObserver(function (mutations) {


    // 只监听一次
    // if (document.documentElement.getAttribute('has-inject-style')) return;


    mutations.forEach(mutation => {
      console.log(mutation);

      if (mutation.attributeName === "style") {
        // 只监听一次
        document.documentElement.setAttribute('has-inject-style', `${
                Number(document.documentElement.getAttribute('has-inject-style') || 0) + 1
                                                    }`);
              document.documentElement.style.minWidth = SCREEN_WIDTH;
              // document.documentElement.style.width = SCREEN_WIDTH;

              document.body.style.minWidth = SCREEN_WIDTH;
              // document.body.style.width = SCREEN_WIDTH;
            }
          });
        });


        htmlObserver.observe(document.documentElement, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ['style'],
        });
      }



//
//
// 等待 main 执行
if (document.readyState !== 'loading') {
  main('readyState');
} else {
  document.addEventListener('DOMContentLoaded', function (event) {
    main('DOMContentLoaded');
  });
}


