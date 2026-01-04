// ==UserScript==
// @name         去掉网站上4个烦人的灯笼和淘宝天猫的广告窗体
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  请根据需求修改匹配网站
// @author       You
// @match        https://www.kxdao.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421578/%E5%8E%BB%E6%8E%89%E7%BD%91%E7%AB%99%E4%B8%8A4%E4%B8%AA%E7%83%A6%E4%BA%BA%E7%9A%84%E7%81%AF%E7%AC%BC%E5%92%8C%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E7%9A%84%E5%B9%BF%E5%91%8A%E7%AA%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/421578/%E5%8E%BB%E6%8E%89%E7%BD%91%E7%AB%99%E4%B8%8A4%E4%B8%AA%E7%83%A6%E4%BA%BA%E7%9A%84%E7%81%AF%E7%AC%BC%E5%92%8C%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E7%9A%84%E5%B9%BF%E5%91%8A%E7%AA%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function removeclassforname(classname){
        var paras = document.getElementsByClassName(classname);
        console.log(paras)
        for(var i=0;i<paras.length;i++){
            //删除元素 元素.parentNode.removeChild(元素);
            if (paras[i] != null){
                paras[i].parentNode.removeChild( paras[i]);
            }
        }
    }
    removeclassforname("deng-box");
    removeclassforname("deng-box1");
    removeclassforname("deng-box2");
    removeclassforname("deng-box3");
    removeclassforname("deng-box4");
    removeclassforname("tmall_tab");

})();