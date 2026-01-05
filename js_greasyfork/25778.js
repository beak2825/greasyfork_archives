// ==UserScript==
// @name         河北工业大学教务处 chrome兼容
// @version      0.1.3
// @description  在chorme上登陆河北工业大学教务处网站
// @author       You
// @match        http://115.24.160.162/*
// @grant        none
// @namespace https://greasyfork.org/users/87620
// @downloadURL https://update.greasyfork.org/scripts/25778/%E6%B2%B3%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%20chrome%E5%85%BC%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/25778/%E6%B2%B3%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%20chrome%E5%85%BC%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var w = top.topFrame.document.getElementsByTagName("a");
    for(var i = 0;i < 7;i++)
    w[i+1].cIndex = i;
    if (typeof top.bottomFrame.mainFrame.setFlag() == 'function')
      top.bottomFrame.mainFrame.setFlag()
})();