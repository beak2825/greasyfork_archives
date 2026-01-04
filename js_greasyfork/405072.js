// ==UserScript==
// @name         斗鱼精简
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       cliter
// @match        https://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405072/%E6%96%97%E9%B1%BC%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/405072/%E6%96%97%E9%B1%BC%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 弹幕框
    var css = '.layout-Player-barrage { top: 109px; z-index: 999; }';
    // 弹幕框上方的榜框
    // css += '.layout-Player-announce { display: none; }';
    css += '.layout-Player-rankAll { display: none; }';
    css += '.layout-Player-rank { display: none; }';

    // 上方
    // css += '.layout-Container { padding-top: 0; }';
    // css += '.layout-Header { display: none; }';

    // 下方
    css += '.PlayerToolbar { display: none;}';
    css += '.layout-Player-toolbar { height: 0; }';
    css += '.Bottom { display: none; }';
    css += '.layout-Player-guessgame { display: none; }';

    // 侧边栏
    css += '.layout-Aside { display: none; }';
    css += '#js-room-activity .StaticAct { display: none !important; }';

    // 关注页面https://www.douyu.com/directory/myFollow
    css += '.layout-Module-head { display: none; }';

    // 弹幕框图标
    css += '.Barrage-listItem .UserLevel { display: none; }';
    css += '.Barrage-listItem .RoomLevel { display: none; }';
    css += '.Barrage-listItem .Barrage-icon { display: none; }';
    css += '.Barrage-listItem .Medal { display: none; }';
    css += '.Barrage-listItem .FansMedal { display: none !important; }';
    css += '.Barrage-listItem .Motor { display: none; }';
    css += '.Barrage-listItem .RoleAvatar-wrapper { display: none; }';

    css += '.layout-Main { margin: auto; }';

    loadStyle(css)
   function loadStyle(css) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.appendChild(document.createTextNode(css));
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(style);

   }
})();