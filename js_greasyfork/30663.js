// ==UserScript==
// @name        adshorte.shorte
// @namespace   http://adshorte/
// @include     *://adshorte.com/*
// @include     *://adshort.co/*
// @include     *://adshort.me/*
// @include     *://linksh.top/*
// @include     *://clik.pw/*
// @include     *://coshurl.co/*
// @include     *://cutwin.com/*
// @version     2.4.1.1
// @description adshorte.com,adshort.co,adshort.me,linksh.top,clik.pw,coshurl.co,cutwin.com用
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/30663/adshorteshorte.user.js
// @updateURL https://update.greasyfork.org/scripts/30663/adshorteshorte.meta.js
// ==/UserScript==

/*
2017/11/18 deprecated
please use "AdsBypasser" and "Skip Redirect"
*/

/*
(function() {
  if(location.href.indexOf("adshorte.com") != -1 || location.href.indexOf("adshort.co") != -1 || location.href.indexOf("adshort.me") != -1){
    var iframes = document.getElementsByTagName('iframe');
    for(var iframe of iframes){
      if(iframe.src.indexOf("dailymotion") != -1){
        iframe.parentNode.removeChild(iframe);
      }
    }
  }
  function evalInPage(fun) {
   location.href = "javascript:void (" + fun + ")()";
  }
  evalInPage(function () {
    checkAdblockUser = function(){
      console.info("nuke");
    }
  });
})();

if(document.getElementById("link-view") !== null){
  function openSesame() {
    if (grecaptcha.getResponse(0) !== "") {
      document.getElementById("link-view").submit();
      clearInterval(b);
    }
  }
  var b = setInterval(openSesame, 500);
}

if (document.getElementById("go-link") !== null) {
  var goForm = $("#go-link");
  var submitButton = goForm.find('button');
  $.ajax({
    dataType: 'json',
    type: 'POST',
    url: goForm.attr('action'),
    data: goForm.serialize(),
    success: function(result, status, xhr) {
      if (result.url) {
        location.href = result.url;
      } else {
        console.info(result.message);
      }
    },
    error: function(xhr, status, error) {
      console.log("An error occured: " + xhr.status + " " + xhr.statusText);
    },
    complete: function(xhr, status) {
    }
  });
}
*/