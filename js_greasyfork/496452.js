// ==UserScript==
// @name    安徽省住房和城乡建设行业教育培训管理平台/安徽住建/安徽二建/教育培训/二建/住建  取消20分钟视频暂停以及新增自动点击播放按钮
// @namespace 安徽省住房和城乡建设行业教育培训管理平台/安徽住建/安徽二建  取消20分钟视频暂停以及新增自动点击播放按钮
// @version  1.1
// @grant    none
// @license  MIT
// @author   muzhihuoying
// @description  安徽省住房和城乡建设行业教育培训管理平台/安徽住建/安徽二建  取消20分钟视频暂停以及新增自动点击播放按钮。 ，------------------- 客户忙或需全自动帮忙 请+：muzhihuoying----------------------
// @match        http://117.68.7.59:8001/*
// @downloadURL https://update.greasyfork.org/scripts/496452/%E5%AE%89%E5%BE%BD%E7%9C%81%E4%BD%8F%E6%88%BF%E5%92%8C%E5%9F%8E%E4%B9%A1%E5%BB%BA%E8%AE%BE%E8%A1%8C%E4%B8%9A%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%AE%89%E5%BE%BD%E4%BD%8F%E5%BB%BA%E5%AE%89%E5%BE%BD%E4%BA%8C%E5%BB%BA%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E4%BA%8C%E5%BB%BA%E4%BD%8F%E5%BB%BA%20%20%E5%8F%96%E6%B6%8820%E5%88%86%E9%92%9F%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E4%BB%A5%E5%8F%8A%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/496452/%E5%AE%89%E5%BE%BD%E7%9C%81%E4%BD%8F%E6%88%BF%E5%92%8C%E5%9F%8E%E4%B9%A1%E5%BB%BA%E8%AE%BE%E8%A1%8C%E4%B8%9A%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%AE%89%E5%BE%BD%E4%BD%8F%E5%BB%BA%E5%AE%89%E5%BE%BD%E4%BA%8C%E5%BB%BA%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E4%BA%8C%E5%BB%BA%E4%BD%8F%E5%BB%BA%20%20%E5%8F%96%E6%B6%8820%E5%88%86%E9%92%9F%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E4%BB%A5%E5%8F%8A%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
  
  
  var mydiv2=document.getElementsByClassName('dplayer-play-icon');

  setInterval(function(){
	if(mydiv2.length>0){
    
    
if(document.getElementsByClassName('dplayer-play-icon')[0].firstChild.firstChild.attributes[0].nodeValue=='M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z'){
	document.getElementsByClassName('dplayer-play-icon')[0].click();
}
    

  }  }, 10000)

})();