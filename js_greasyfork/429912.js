// ==UserScript==
// @name           Set User-agent
// @namespace      http://www.w3.org/1999/xhtml
// @description User agent windows 10
// @include        https://mc.yandex.ru/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @version 0.0.12
// @downloadURL https://update.greasyfork.org/scripts/429912/Set%20User-agent.user.js
// @updateURL https://update.greasyfork.org/scripts/429912/Set%20User-agent.meta.js
// ==/UserScript==
console.log("running");
GM_xmlhttpRequest({
  method: 'GET',
  url: window.location.href,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.55',
    'Accept': '*/*',
  },
  onload:function(data){ 
      var val= $("input[name='PhoneNoiseNew']",data.responseText).val();
      console.log("loaded",val);
 
      if (val){
        var phone = atob(val);
        document.getElementById("message-tel-buttons").innerHTML="<h3><a href='tel:"+phone+"'>"+phone+"</a></h3><h3><a href='https://www.google.ro/search?q="+phone+"' target='_blank'>Google</a></h3><h3><a href='http://nimfomane.com/forum/index.php?app=core&module=search&do=search&fromMainBar=1&search_term="+phone+"' target='_blank'>nimfomane</a></h3>";
      }
  }
});