// ==UserScript==
// @name   自動修改PTT網址 / Auto replace ptt url prefix
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  修改原生網址
// @author       You
// @match        *://www.ptt.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428955/%E8%87%AA%E5%8B%95%E4%BF%AE%E6%94%B9PTT%E7%B6%B2%E5%9D%80%20%20Auto%20replace%20ptt%20url%20prefix.user.js
// @updateURL https://update.greasyfork.org/scripts/428955/%E8%87%AA%E5%8B%95%E4%BF%AE%E6%94%B9PTT%E7%B6%B2%E5%9D%80%20%20Auto%20replace%20ptt%20url%20prefix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = location.href;
    var ask = /ask*/g;
    if(!url.match(ask)){
          var newurl = url.replace("ptt","pttweb");
          window.location.href = newurl;
    }else {
        document.querySelector('.btn-big').click();
    }

})();