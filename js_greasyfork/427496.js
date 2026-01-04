// ==UserScript==
// @name         东软课程信息门户平台一键跳转
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  东软课程信息门户平台一键跳转，支持webvpn
// @author       gcb384076498
// @match        *://course.neusoft.edu.cn/course/stuselcourse/index.do*
// @match        *://course.webvpn.neusoft.edu.cn/course/stuselcourse/index.do*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427496/%E4%B8%9C%E8%BD%AF%E8%AF%BE%E7%A8%8B%E4%BF%A1%E6%81%AF%E9%97%A8%E6%88%B7%E5%B9%B3%E5%8F%B0%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427496/%E4%B8%9C%E8%BD%AF%E8%AF%BE%E7%A8%8B%E4%BF%A1%E6%81%AF%E9%97%A8%E6%88%B7%E5%B9%B3%E5%8F%B0%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isWebvpn = location.href.indexOf("webvpn");
    var size = document.getElementsByClassName('btn-success').length;
    for(var i = 0 ;i<size;i++){
        if(isWebvpn){
            document.getElementsByClassName("btn-info")[i * 2 + 1].href = 'http://hw.webvpn.neusoft.edu.cn/hw/exercise/exerciselist.do?cno=' + document.getElementsByClassName("btn-info")[i * 2].href.replaceAll(/http:\/\/course\.webvpn\.neusoft\.edu\.cn\/course\/cotl\/index\.do\?courseid=([0-9A-Z]{10})&teachingclassno=[0-9]{6}\-[0-9]{3}/g,'$1');
            document.getElementsByClassName("btn-success")[i].href = 'http://hw.webvpn.neusoft.edu.cn/hw/lrn/lrn.do?cno=' + document.getElementsByClassName("btn-info")[i * 2].href.replaceAll(/http:\/\/course\.webvpn\.neusoft\.edu\.cn\/course\/cotl\/index\.do\?courseid=([0-9A-Z]{10}&teachingclassno=[0-9]{6}\-[0-9]{3})/g,'$1');

        }else{
            document.getElementsByClassName("btn-info")[i * 2 + 1].href = 'http://hw.neusoft.edu.cn/hw/exercise/exerciselist.do?cno=' + document.getElementsByClassName("btn-info")[i * 2].href.replaceAll(/http:\/\/course\.neusoft\.edu\.cn\/course\/cotl\/index\.do\?courseid=([0-9A-Z]{10})&teachingclassno=[0-9]{6}\-[0-9]{3}/g,'$1');
            document.getElementsByClassName("btn-success")[i].href = 'http://hw.neusoft.edu.cn/hw/lrn/lrn.do?cno=' + document.getElementsByClassName("btn-info")[i * 2].href.replaceAll(/http:\/\/course\.neusoft\.edu\.cn\/course\/cotl\/index\.do\?courseid=([0-9A-Z]{10}&teachingclassno=[0-9]{6}\-[0-9]{3})/g,'$1');
        }
    }
    // Your code here...
})();