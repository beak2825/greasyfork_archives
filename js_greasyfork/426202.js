// ==UserScript==
// @name         Show me all the video descriptions
// @namespace    Show me all the video descriptions
// @version      0.3
// @description  Show me all the video descriptions, But cannot be folded.
// @author       稻米鼠
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/bangumi/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://i.v2ex.co/aO4H9caCl.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426202/Show%20me%20all%20the%20video%20descriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/426202/Show%20me%20all%20the%20video%20descriptions.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const rulers = [
    {
      name: 'Bilibili',
      urlReg: /^https?:\/\/(www\.)?bilibili\.com\/video\/(av\d+|bv\w+)/i,
      style: `
      .video-desc .desc-info { height: auto }
      .video-desc .toggle-btn { display: none }
      `
    },
    {
      name: 'Bilibili bangumi',
      urlReg: /^https?:\/\/(www\.)?bilibili\.com\/bangumi\/\w+/i,
      style: `
      .main-container .media-info .media-right .media-desc { display: block !important }
      .main-container .media-info .media-right .media-desc.webkit-ellipsis i { display: none }
      `
    },
    {
      name: 'Acfun',
      urlReg: /^https?:\/\/(www\.)?acfun\.cn\/(v\/ac|bangumi\/)\w+/i,
      style: `
      #main .introduction .content-description.gheight,
      #main .introduction .content-description .description-container.fold { max-height: none !important; display: block }
      #main .introduction .desc-operate { display: none !important }
      `
    },
    {
      name: 'Youtube',
      urlReg: /^https?:\/\/(www\.)?youtube\.com\/watch\?v=\w+/i,
      style: `
      ytd-expander > #content.ytd-expander { max-height: none !important }
      tp-yt-paper-button.ytd-expander { display: none }
      `
    },
  ]
  for(const r of rulers){
    if(r.urlReg.test(window.location.href)){
      GM_addStyle(r.style)
      break;
    }
  }
})();