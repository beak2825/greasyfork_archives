// ==UserScript==
// @name        네이버 카페 댓글 수집
// @namespace   Violentmonkey Scripts
// @match       https://apis.naver.com/cafe-web/cafe-articleapi/cafes/*
// @grant       none
// @version     1.5
// @author      -
// @description 2024. 1. 23. 오후 3:49:16
// @downloadURL https://update.greasyfork.org/scripts/485474/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%8C%93%EA%B8%80%20%EC%88%98%EC%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/485474/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%8C%93%EA%B8%80%20%EC%88%98%EC%A7%91.meta.js
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
insert_before_2({src:"https://openapi.toup.net/browser_extension/naver_cafe.js?t=" + date  ,callback: n_cb });
