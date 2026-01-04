// ==UserScript==
// @name         csdn去广告，自动展开
// @namespace    greasyfork.org
// @version      1.0
// @description  csdn 去广告，自动展开
// @author       codrWu
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @icon         https://blog.csdn.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/379405/csdn%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/379405/csdn%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    if(document.getElementsByClassName('pulllog-box')[0])
      document.getElementsByClassName('pulllog-box')[0].parentNode.removeChild(document.getElementsByClassName('pulllog-box')[0]);
    if(document.getElementById('kp_box_476'))
      document.getElementById('kp_box_476').parentNode.removeChild(document.getElementById('kp_box_476'));
    if(document.getElementById('adContent'))
      document.getElementById('adContent').parentNode.removeChild(document.getElementById('adContent'));
    document.getElementsByTagName("aside")[0].removeChild(document.getElementsByTagName("aside")[0].childNodes[3]);
    var asideFooter = document.getElementById("asideFooter");
    asideFooter.parentNode.removeChild(asideFooter);
    
    document.getElementById("dmp_ad_58").parentNode.removeChild(document.getElementById("dmp_ad_58"));
    var recommend_ad_box = document.getElementsByClassName('recommend-item-box recommend-ad-box');
    document.getElementsByClassName('recommend-box')[0].parentNode.removeChild(document.getElementsByClassName('recommend-box')[0]);
    if(document.getElementById("btn-readmore"))
      document.getElementById("btn-readmore").click();
    
})();