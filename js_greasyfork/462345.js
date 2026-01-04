// ==UserScript==
// @name           Set User-agent
// @namespace      http://www.w3.org/1999/xhtml
// @description Schimba imaginea cu nr de telefon in publi24 cu nr de telefon
// @include        http://www.publi24.ro/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @version 0.0.1.20170309170437
// @downloadURL https://update.greasyfork.org/scripts/462345/Set%20User-agent.user.js
// @updateURL https://update.greasyfork.org/scripts/462345/Set%20User-agent.meta.js
// ==/UserScript==
console.log("running");
GM_xmlhttpRequest({
  method: 'GET',
  url: window.location.href,
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/111.0.1661.50 Version/16.0 Mobile/15E148 Safari/604.1',
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