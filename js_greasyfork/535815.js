// ==UserScript==
// @name         Wide ai chat
// @description  adds support for iframe
// @match        http*://chatgpt.com/c/*
// @match        http*://chatgpt.com/*
// @match        http*://new.oaifree.com/*
// @match        https://shared.oaifree.com/*
// @match        http*://www.aicnn.cn/oaifree/*
// @match        http*://chat.aicnn.xyz/*
// @match        http*://plus.aivvm.com/*
// @match        http*://kimi.moonshot.cn/chat/*
// @match        http*://kimi.moonshot.cn/*
// @match        http*://tongyi.aliyun.com/qianwen*
// @match        https://www.tiangong.cn/*
// @match        http*://chatglm.cn/*
// @match        https://claude.ai/*
// @match        https://chat.deepseek.com/*
// @include      https://*claude*/*
// @match        https://chat.kelaode.ai/*
// @match        https://gemini.google.com/*
// @match        https://grok.com/*
// @match        https://yuanbao.tencent.com/*
// @icon     data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNSIgcnk9IjUiIGZpbGw9IiM2YmIiLz4KICA8cGF0aCBkPSJtMTcgMTMuNyA0LTQtNC00bS0xMCA4LTQtNCA0LTRtMTMuOTk5IDMuODI1SDMuMjE1Ii8+CiAgPHBhdGggZD0iTTE5IDE2aC0yLjVhLjk5LjkgMCAwIDAtLjc3NS4zNzVsLTIuOSAzLjY1Yy0uNC41LTEuMTYyLjUtMS41NjMgMGwtMi45MjUtMy42NUEuOTkuOSAwIDAgMCA3LjUgMTZINWMtMS42NjMgMC0zLTEuMzM4LTMtM1Y2YzAtMS42NjIgMS4zNS0zIDMtM2gxNGEzIDMgMCAwIDEgMyAzdjdjMCAxLjY2Mi0xLjM1IDMtMyAzWiIgZmlsbC1vcGFjaXR5PSIuMTYiIHN0cm9rZT0iI0VFRSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIvPgo8L3N2Zz4K
// @author       Yearly
// @grant        GM_addStyle
// @version 0.0.1.20250521092707
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535815/Wide%20ai%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/535815/Wide%20ai%20chat.meta.js
// ==/UserScript==

(function() {

  var limit_anser_height = false;

  if ( /kimi.moonshot.cn/.test(location.href) ) {
    console.log("kimi");
    GM_addStyle(`
    div[data-testid]  div[data-index]  div.MuiBox-root {
      max-width: 100% !important;
    }
    #app div.chat-editor {
      max-width: calc(100% - 50px);
    }

    div[class^=mainContent] div.MuiBox-root > div[class^=chatBottom_]
     {
      max-width: calc(100% - 50px);
    }
    div.chat-detail-main div.chat-content-container > div.chat-content-list {
      max-width: calc(100% - 50px);
    }
    div.history-modal-container div.history-modal-list {
      max-width: 90%;
    }

    #scroll-list div[class^=chatItemBox_].MuiBox-root {
      max-width: 100%;
    }
    #root > div > div[class*=mainContent] > div[class*=layoutContent] > div.MuiBox-root > div.MuiBox-root[class*=homepage] > div.MuiContainer-root.MuiContainer-maxWidthMd {
      max-width: calc(100% - 100px);
    }
    div.MuiBox-root[class^=homepage] div[class^=mainContent] div[class^=chatInput_ ] div[class^=inputInner_] div[class^=editor] {
      max-height: 600px;
    }
    `);

    if (limit_anser_height) {
      GM_addStyle(`
        div[class^=mainContent] div[class^=chatInput_ ] div[class^=inputInner_] div[class^=editor] {      max-height: 400px;    }
      `);
    }
  } else if ( /chat.deepseek.com/.test(location.href) ) {
    console.log("deepseek");
    GM_addStyle(`
    div:has( > #latest-context-divider) {
      width: 95% !important;
    }
    div:has( > div > #chat-input) {
      width: 95% !important;
      max-width: 90vw;
    }
    :root {
      --message-list-max-width: calc(100% - 20px);
    }
    #root > div > div.d4850e57 > div.d7ae46fd > div.ad902ce3 {
      max-width: calc(100% - 20px);
    }
    #root > div > div.c3ecdb44 > div.f2eea526 > div > div > div.a2f8e4bb {
      max-width: calc(100% - 20px);
    }

    #root > div > div.c3ecdb44 > div.f2eea526 > div > div > div.a2f8e4bb > div.aaff8b8f.eb830e32 > div > div > div.fad49dec {
      max-height: 50vh;
    }
    `);

    if (limit_anser_height) {
      GM_addStyle(`
      #root > div > div > div:nth-child(2) > div > div > div > div > div > div {
        max-height: 600px;
        overflow-y: auto;
      }`);
    }
  } else if ( /tongyi.aliyun.com/.test(location.href) ) {
    console.log("tongyi");
    GM_addStyle(`
    div[class^=mainContent] div[class^=questionItem--] {
      width:90% !important;
      max-width: 90vw;
    }
    div[class^=mainContent] div[class^=answerItem--] {
      width:90% !important;
      max-width: 90vw;
    }
    div[class^=mainContent] div[class^=inputOutWrap--] {
      width:90% !important;
      max-width: 90vw;
    }
    `);
  } else if ( /www.tiangong.cn/.test(location.href) ) {
    console.log("tiangong");
    GM_addStyle(`
    #app > div > div > main > div.overflow-y-scroll.w-full > div.search-content.relative.flex.w-full.flex-row.justify-center {
      max-width:  calc(100% - 100px);
      --search-max-width: calc(100% - 100px);
    }
    #app > div > div > main > div.overflow-y-scroll.w-full > div.search-content.relative.flex.w-full.flex-row.justify-center > label.w-full.cursor-default.select-auto {
      max-width: calc(100% - 100px);
      --search-max-width: calc(100% - 100px);
    }
    label.w-full {
      max-width: calc(100% - 100px);
      --search-max-width: calc(100% - 100px);
    }
    :root {
      --search-max-width: calc(100% - 100px);
    }`);
  } else if (/chatglm.cn/.test(location.href)) {
    console.log("chatglm");
    GM_addStyle(`
    div.conversation-inner.dialogue >  div.conversation-list.detail > div.item.conversation-item {
      max-width: 95vw !important;
    }
    .markdown-body.md-body {
      max-width: 95vw !important;
    }
    `);
  } else if (/gemini.google.com/.test(location.href)) {
    console.log("gemini");
    GM_addStyle(`
    #chat-history > infinite-scroller > div {
      max-width: calc(100% - 20px);
    }
    #app-root > main > side-navigation-v2 > bard-sidenav-container > bard-sidenav-content > div > div > div.content-container > chat-window > div.chat-container.ng-star-inserted > div.bottom-container.response-optimization.ng-star-inserted {
      max-width: calc(100% - 20px);
    }
    #app-root > main > side-navigation-v2 > bard-sidenav-container > bard-sidenav-content > div > div > div.content-container > chat-window > div.chat-container.ng-star-inserted > div.bottom-container.response-optimization.ng-star-inserted > div.input-area-container.ng-star-inserted {
      max-width: calc(100% - 20px);
    }`);

  } else if (/grok.com/.test(location.href)) {
    console.log("grok.com");
    GM_addStyle(`
    main div.relative.w-full.flex.flex-col.items-center > div.w-full.max-w-3xl.flex.flex-col {
       max-width: calc(100% - 20px);
    }
    main div.flex.flex-col.items-center > div.flex.flex-col-reverse.items-center > form.bottom-0.w-full.items-center.justify-center > div.justify-center.w-full {
       max-width: calc(100% - 20px);
    }
    .max-w-3xl  {
      width:95% !important;
      max-width:96% !important;
    }
    div.absolute.mx-auto.z-50 {
      max-width: calc(100% - 50px);
    }
    div.absolute.mx-auto.z-50 .duration-100.relative.w-full {
      max-width: calc(100% - 50px);
    }
   `);

  } else if (/yuanbao.tencent.com/.test(location.href)) {
    console.log("yuanbao");
    GM_addStyle(`
    :root {
       --hunyuan-chat-list-max-width: calc(100% - 40px);
    }`);
  } else {
    console.log("chatgpt/claude");

    const chatWiderStyle = `
    .xl\:max-w-\[48rem\] {
      width:95% !important;
      max-width:96% !important;
    }
    div.mx-auto.md:max-w-3xl {
      max-width: calc(100% - 10px);
    }
    div.mx-auto.flex {
      max-width: calc(100% - 10px);
    }
    div.ProseMirror.break-words.ProseMirror-focused {
      max-width:100%;
    }
    body > div.flex.min-h-screen.w-full div.flex.flex-col div.flex.gap-2 div.mt-1.max-h-96.w-full.overflow-y-auto.break-words > div.ProseMirror.break-words{
      max-width:90%;
    }

    body > div.flex.min-h-screen.w-full > div > main > div.top-5.z-10.mx-auto.w-full.max-w-2xl.md{
      max-width:100%;
    }

    body > div.flex.min-h-screen.w-full > div > main > div.mx-auto.w-full.max-w-2xl.px-1.md {
      max-width:100%;
    }
    body > div.flex.min-h-screen.w-full > div > main.max-w-7xl {
      max-width: 90rem;
    }
    main > div.composer-parent  article > div.text-base > div.mx-auto {
      max-width: 95%;
    }
    main article > div.text-base > div.mx-auto {
      max-width: 95%;
    } `;

    if (limit_anser_height) {
      GM_addStyle(`
    pre > div.rounded-md > div.overflow-y-auto {
      max-height: 50vh;
      overflow: auto;
      scrollbar-width: thin;
      scrollbar-color: #aaaa #1111;
    }
    .code-block__code {
      max-height: 50vh;
      overflow: auto;
      scrollbar-width: thin;
      scrollbar-color: #aaaa #1111;
    }
    pre > div.rounded-md > div.overflow-y-auto ::-webkit-scrollbar-track {
      background: #1111;
    }
    pre > div.rounded-md > div.overflow-y-auto ::-webkit-scrollbar-thumb {
      background: #aaaa;
    }
    pre > div.rounded-md > div.overflow-y-auto ::-webkit-scrollbar-thumb:hover {
      background: #0008;
    }
    `);
    }

    GM_addStyle(chatWiderStyle);

    enhanceAddStyle();

    function enhanceAddStyle(setStyle) {
      const chat = document.querySelector("main > div.composer-parent  article > div.text-base > div.mx-auto");
      if (chat) {
        if( window.getComputedStyle(chat).maxWidth != '95%') {
          GM_addStyle(chatWiderStyle);
        }
      } else {
        setTimeout(enhanceAddStyle, 1100);
      }
    }

    function link_addhref() {
      document.querySelectorAll('div[data-message-id] a[rel="noreferrer"]').forEach(function(item) {
        if(!item.href){
          item.href = item.innerText;
          item.target = "_blank"
        }
      });
      setTimeout(link_addhref, 1800);
    }
    link_addhref();

  }

})();

+
  66

