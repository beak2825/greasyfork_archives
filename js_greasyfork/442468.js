// ==UserScript==
// @name     	【个人】跳转 of Multi-Account Containers（Firefox）
// @namespace   eezTool
// @description 在第 x 个 container 打开 [x.lezi.fun/网址] 后面的那个网址。需要提前设置 [x.lezi.fun] always 在第 x 个 container 里面打开。修改 Twitch 网页标题
// @version  	0.11
// @match    	*://*.lezi.fun/*
// @match    	*://*.twitch.tv/*
// @grant    	none
// @run-at   	document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442468/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E8%B7%B3%E8%BD%AC%20of%20Multi-Account%20Containers%EF%BC%88Firefox%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/442468/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E8%B7%B3%E8%BD%AC%20of%20Multi-Account%20Containers%EF%BC%88Firefox%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  
  // lezi.fun 重定向
  var startPosition = document.URL.search('lezi.fun');
  if (startPosition >= 0){
    var redirectUrl = document.URL.substr(startPosition+9,1000);
    redirectUrl = redirectUrl.search('http')>=0 ? redirectUrl : 'https://'+redirectUrl;
    window.document.location = redirectUrl;
  }
  
  // 修改 Twitch 网页标题
  setTimeout(rename(), 30000);

  function rename(){
    if (document.URL.search('twitch')>=0){
      editTitle('rename王总');
      editTitle('rename老陈');
      editTitle('rename发发');
      editTitle('rename小德');
      editTitle('rename小发');
      editTitle('rename小发2');
    }  
  }

  function editTitle(rename){
    if (decodeURI(document.URL).search(rename)>=0){
      document.title = rename.replace(/rename/g,"");
    }
  }
  
})();