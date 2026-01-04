// ==UserScript==
// @name         Player FullScreen Auto
// @name:zh-CN 网页自动加载全屏宽屏播放器 - By 全栈CEO
// @namespace   https://roceys.cn
// @version      20190929
// @description Auto Player full screen for web.
// @description:zh-CN  虎牙+哔哩哔哩+Youtube直播&视频平台自动全屏宽屏播放器
// @require    https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require    https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @inject-into content
// @run-at        document-idle
// @author       Roceys
// @license       Apache License
// @match        *://*.bilibili.com/*
// @match        *://www.huya.com/*
// @match        *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/390484/Player%20FullScreen%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/390484/Player%20FullScreen%20Auto.meta.js
// ==/UserScript==

'use strict'

var selector = {
  'live.bilibili.com': {
    'on': "i[class='live-icon-web-fullscreen']"
  },
   'www.bilibili.com':{
      'on':"div[class~='bilibili-player-video-btn-widescreen']"
   },
  'www.huya.com': {
    'on': "span[class='player-fullpage-btn']"
  },
  'www.youtube.com': {
    'on': "button[class~='ytp-size-button']"
  }
}

var domain = document.location.hostname;

function openFullScreen() {
  var _click = document.querySelector(selector[domain].on);
  if (_click !== null) {
    _click.click();
  }
}

waitForKeyElements(selector[domain].on, openFullScreen, false);
