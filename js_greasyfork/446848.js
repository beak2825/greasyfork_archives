// ==UserScript==
// @name         连云港继续教育在线刷课
// @namespace    www.31ho.com/
// @version      1.0.1
// @description  连云港继续教育平台自动切换下一课
// @author       lixingchao
// @match        http://jxjy.rsj.lyg.gov.cn/*
// @icon        http://jxjy.rsj.lyg.gov.cn/learnCenterServlet.do/*
// @grant        none
// @license      K
// @downloadURL https://update.greasyfork.org/scripts/446848/%E8%BF%9E%E4%BA%91%E6%B8%AF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/446848/%E8%BF%9E%E4%BA%91%E6%B8%AF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
 
    // 检查视频元素是否存在
  if (document.getElementsByTagName('video')) {
      var video = document.getElementsByTagName('video');
      video.play();
  }