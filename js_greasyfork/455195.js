// ==UserScript==
// @name        删除广告
// @namespace   删除特定页面一些广告和没用的东西
// @description 删除特定页面一些广告和没用的东西
// @match       https://baijiahao.baidu.com/*
// @match       https://mbd.baidu.com/*
// @match       http://mbd.baidu.com/*
// @match       https://www.baidu.com/*
// @grant       none
// @version     1.0
// @author      Pastors
// @description 2022/11/18 下午4:51:05
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455195/%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/455195/%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
//百度系
if(location.host.indexOf("mbd.baidu.com") == 0){
  if('https:' == document.location.protocol){
    deleteChild("commentModule")
  }else{
    deleteChild("commentContainer")
  }
  return;
} else if (location.host.indexOf("baijiahao.baidu.com") == 0){
  deleteChild("commentModule")
  return;
} else {
  console.log('不是应用网站')
  return;
}

function deleteChild(str) { 
  var div = document.getElementById(str); 
  if(div != null){
    div.remove(); 
  }
}