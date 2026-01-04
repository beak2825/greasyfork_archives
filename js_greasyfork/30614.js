// ==UserScript== 
// @name        Youku-HTML5-player-enabler
// @namespace   https://greasyfork.org/zh-CN/users/101499
// @version     1.0.1
// @description 开启优酷原生HTML5播放器
// @author      nftbty
// @match       *://*.youku.com/* 
// @run-at      document-start
// @Grant       none
// @downloadURL https://update.greasyfork.org/scripts/30614/Youku-HTML5-player-enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/30614/Youku-HTML5-player-enabler.meta.js
// ==/UserScript==    

(function() { 
  'use strict';
  if (sessionStorage.P_l_h5===undefined)
    window.sessionStorage.setItem("P_l_h5", true); 
})(); 