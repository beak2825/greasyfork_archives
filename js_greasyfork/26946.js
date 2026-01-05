// ==UserScript==
// @name         navigator.plugins spoofing
// @namespace    aaaa007cn 
// @author      aaaa007cn 
// @include     http://play.baidu.com/*
// @include     http://fm.baidu.com/*
// @include     *://www.baidu.com/
// @include     http://5sing.kugou.com/*
// @include     http://www.beiwo.ac/*
// @include     http://www.dongting.com/*
// @include     http://fm.dongting.com/*
// @include     http://www.duole.com/*
// @include     *://music.douban.com/*
// @include     http://papa.me/*
// @include    http://www.1ting.com/*
// @include    http://www.9ku.com/*
// @include    http://www.666ccc.com/*
// @include    http://www.yue365.com/*
// @include     http://music.163.com/*
// @exclude     http://music.163.com/demo/fm
// @include    http://dict.cn/*
// @include    http://www.webtoons.com/*
// @include    http://v.rongkuai.com/play.html?course_id=*
// @include    http://www.pornhub.com/*
// @include    http://*.phncdn.com/*
// @description    去除网站的flash插件检测，实现html5播放。
// @homepage    https://www.firefox.net.cn/read-49979-1#read_341320
// @version     2.6
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/26946/navigatorplugins%20spoofing.user.js
// @updateURL https://update.greasyfork.org/scripts/26946/navigatorplugins%20spoofing.meta.js
// ==/UserScript==
Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return { length: 0 };
  }
});