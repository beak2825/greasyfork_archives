// ==UserScript==
// @name        download from redpilled.eu
// @namespace   abdrool
// @include     https://redpilled.eu/*
// @include     http://redpilled.eu/*
// @include     http://176.96.138.175/*
// @grant       GM_download
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      abdrool
// @description Circumvents the download blocker on redpilled.eu by supplying the correct user agent.
// @require     https://cdnjs.cloudflare.com/ajax/libs/filesize/6.3.0/filesize.min.js
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/428014/download%20from%20redpilledeu.user.js
// @updateURL https://update.greasyfork.org/scripts/428014/download%20from%20redpilledeu.meta.js
// ==/UserScript==


let customCss = `
#progress {
  position: fixed;
  background: rgb(38, 42, 50);
  padding: 15px;
  border: ;
  border-top-left-radius: 10px;
  right: 0%;
  bottom: 0%;
  font-size: 12px;
  line-height: 20px;
}

#progress:first-child::after {
  content: "Changing page will abort downloads!";
  color:red;
  font-weight: bold;
  padding-left: 10px;
}

#progress span {
    margin-left: 10px;
    margin-right: 10px;
}
`
GM_addStyle(customCss);

$("tbody a").click(function(e) {
  var path = new URL(e.target.href).pathname;
  if (!path.endsWith("/")) {
    e.preventDefault();
    let downloadId = Math.floor(Math.random() * 100000);
    let filename = path.split('/').pop();
    
    var progressBox = $("#progress");
    if (!progressBox.length) {
      $("body").prepend("<div id='progress'></div>");
      progressBox = $("#progress");
    }
    progressBox.append("<div class='download' id='" + downloadId +"'><span class='name'>" + filename + "</span><span class='status'></span></div>");
    
    var headers = {"User-Agent": "GMod"}
    
    GM_xmlhttpRequest({
      url: e.target.href,
      method: "HEAD",
      headers: headers,
      onload: function(response) {
        if (response.status != 200) {
          $("#" + downloadId + " .status").text(response.status + " " + response.statusText);
          return;
        }
        
        var a = GM_download({
          url: e.target.href,
          name: e.target.text,
          headers: headers,
          onerror: function(err){ console.log(err.error) },
          onprogress: function(progress){
            $("#" + downloadId + " .status").text(filesize(progress.loaded) + " / " + filesize(progress.total));
          },
          saveAs: true,
        });
      },
    });
  }
});