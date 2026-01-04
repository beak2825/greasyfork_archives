// ==UserScript==
// @name 115_https
// @description enable_https_download_for_115_com
// @match *://115.com/*
// @grant none
// @version 0.0.1.20180831025534
// @namespace https://greasyfork.org/users/16337
// @downloadURL https://update.greasyfork.org/scripts/371728/115_https.user.js
// @updateURL https://update.greasyfork.org/scripts/371728/115_https.meta.js
// ==/UserScript==

(function(){
  var ajaxDetour = function(param) {
    var successDetour = function(param) {
      if (param.file_url != undefined)
        param.file_url = param.file_url.replace(/^http:\/\//i, 'https://');
      
      return successTrampoline(param);
    }
    
    var successTrampoline = param["success"];
    param["success"] = successDetour;
    return ajaxTrampoline(param);
  }
  
  var ajaxTrampoline = top.UA$.ajax;
  top.UA$.ajax = ajaxDetour;
})();
