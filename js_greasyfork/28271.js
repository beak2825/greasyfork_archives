// ==UserScript==
// @name         acfun_replace_href
// @namespace    http://www.acfun.cn
// @version      0.2
// @description  将网址里的v替换成a，使用旧版播放器，临时解决3分钟卡住（变6分钟？）
// @author       星雨漂流
// @match        http://www.acfun.cn/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28271/acfun_replace_href.user.js
// @updateURL https://update.greasyfork.org/scripts/28271/acfun_replace_href.meta.js
// ==/UserScript==

(function() {
    var videoSrc = location.href.split("/");
    if(videoSrc[3] =="v" && videoSrc[4].indexOf("ac")!=-1){
      var toSrc = "http://www.acfun.cn/a/" + videoSrc[4];
      location.href = toSrc;
    }
})(window);