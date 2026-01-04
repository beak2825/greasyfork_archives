// ==UserScript==
// @name         Player FullScreen Auto
// @name:zh-CN 网页自动加载全屏宽屏播放器 - By 全栈CEO
// @namespace   https://roceys.cn
// @version      3.0.0
// @description Auto Player full screen for web.
// @description:zh-CN  哔哩哔哩自动全屏播放器
// @require    https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @run-at        document-idle
// @author       Roceys
// @license       Apache License
// @match        *://*.bilibili.com/*

// @downloadURL https://update.greasyfork.org/scripts/479832/Player%20FullScreen%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/479832/Player%20FullScreen%20Auto.meta.js
// ==/UserScript==

'use strict'

var selector = {
  'live.bilibili.com': {
    'on': "i[class='live-icon-web-fullscreen']"
  },
   'www.bilibili.com':{
      'on':"div[class~='squirtle-video-pagefullscreen'], div[class~='bpx-player-ctrl-web']"
   }
}
var domain = document.location.hostname;


function openFullScreen(jNode) {
 jNode.get(0).click()
}

(function() {
    'use strict';
    const SN = '[B站 自动播放 & 网页宽屏]' // script name
    console.log(SN, '油猴脚本开始', domain)
    waitForKeyElements(selector[domain].on, openFullScreen, false);
})();