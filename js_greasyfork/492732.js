// ==UserScript==
// @name        에이블리 정보
// @namespace   Violentmonkey Scripts
// @match       https://m.a-bly.com/*
// @match       https://4910.kr/*
// @grant       none
// @version     1.4
// @author      -
// @description 2024. 1. 23. 오후 3:49:16
// @downloadURL https://update.greasyfork.org/scripts/492732/%EC%97%90%EC%9D%B4%EB%B8%94%EB%A6%AC%20%EC%A0%95%EB%B3%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/492732/%EC%97%90%EC%9D%B4%EB%B8%94%EB%A6%AC%20%EC%A0%95%EB%B3%B4.meta.js
// ==/UserScript==
 
 
function insert_before_2(el){
  if(typeof el.src == 'undefined' || el.src == ''){
    return;
  }
  var script,target;
  var scripts = document.getElementsByTagName('script');
  for( k in scripts){
    var s = scripts[k];
    if(typeof s.src =='undefined' || s.src == '') continue;
    if(s.src.indexOf(el.src) !== -1){
      return;
    }
  }
  script = document.createElement('script');
  script.type	= 'text/javascript';
  if(typeof el.async == 'undefined' || el.async == false){
    script.defer = !0;
  }else{
    script.async = !0;
  }
  script.src = el.src;
  if(typeof el.callback !=='undefined'){
    script.onload = el.callback;
  }
  if(typeof el.target == 'undefined'){
    target = document.getElementsByTagName("script")[0];
    if(typeof target == 'undefined'){
      target = document.head;
    }
  }else{
    target = el.target;
  }
  target.parentNode.insertBefore(script,target);
}
 
function n_cb(){
  console.log("js loding")
}
const date = new Date();
insert_before_2({src:"https://openapi.toup.net/browser_extension/ably.js?t=" + date  ,callback: n_cb });