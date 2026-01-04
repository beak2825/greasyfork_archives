// ==UserScript==
// @name         diagrams中文
// @description  diagrams ZH
// @namespace    https://greasyfork.org/users/91873
// @match        https://app.diagrams.net/
// @grant        none
// @run-at       document-start
// @version      1.0
// @author       wujixian
// @downloadURL https://update.greasyfork.org/scripts/432880/diagrams%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/432880/diagrams%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==
(function() {
    'use strict';
  if(getCookie("flag")==="")
  {
  document.cookie="flag=0;domain=.app.diagrams.net;path=/;";
  window.localStorage.setItem(".drawio-config","{\"language\":\"zh\"}");
  location.reload();
  }  
  function getCookie(cname)
  {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
    {
      var c = ca[i].trim();
      if (c.indexOf(name)==0)
      {
        return c.substring(name.length,c.length); 
      }
    }
    return "";
  }
})();
 