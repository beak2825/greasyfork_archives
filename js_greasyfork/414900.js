// ==UserScript==
// @name         Bypass FileCrypt
// @namespace    Jovanzers.Bypass.FileCrypt
// @version      1.1.5
// @description  Bypass FileCrypt and get the original link! Original script by StephenP
// @author       Jovanzers
// @match        http://filecrypt.co/Link/*
// @match        http://www.filecrypt.co/Link/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/414900/Bypass%20FileCrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/414900/Bypass%20FileCrypt.meta.js
// ==/UserScript==
(function () {
    GM.xmlHttpRequest({
    method: "GET",
    url: document.location.href,
    onload: function(response) {
      window.stop();
		  var a=response.responseText.lastIndexOf("https://filecrypt.co/index.php?Action");
      if(a==-1){
      	a=response.responseText.lastIndexOf("https://www.filecrypt.co/index.php?Action");
      }
      //var iframeId=response.responseText.substring(a);
      var b=response.responseText.indexOf('</iframe>',a);
      if(b==-1){
        var b=response.responseText.indexOf('</script>',a);
      }
      var iframeId=response.responseText.substring(a,b-2);
      console.log(iframeId);
      top.location.href=iframeId;
    }
    });
})();