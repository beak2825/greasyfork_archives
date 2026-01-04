// ==UserScript==
// @name         Peak Valley 刷刷刷
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Bosong Li
// @include     *://peixun.amac.org.cn/index.php?a=studyDetail*        
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394304/Peak%20Valley%20%E5%88%B7%E5%88%B7%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/394304/Peak%20Valley%20%E5%88%B7%E5%88%B7%E5%88%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.onfocus = function(){console.log('当前')};
    window.onblur = function(){console.log('离开')};
    var click_study_drag=0;
    window.custom_seek = function(){
      window.tiper("Peak Valley 刷刷刷!");
};
    // Your code here...
})();