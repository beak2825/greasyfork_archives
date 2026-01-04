// ==UserScript==
// @name         kuku漫画键盘翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  none
// @author       hsaver
// @match        http://m.kkkkdm.com/comiclist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425158/kuku%E6%BC%AB%E7%94%BB%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/425158/kuku%E6%BC%AB%E7%94%BB%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var previous = document.querySelector('.bottom .subNav a')
    var next = document.querySelector('.last a')
    document.addEventListener('keyup',function(e){
      if(e.keyCode==39){next.click()}
      if(e.keyCode==37){previous.click()}
    })
})();