// ==UserScript==
// @name         remove redirect link from kuroci.com
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  remove redirect link and Ads that make this script not work from kuroci.net
// @author       maunklana
// @match        https://*.kuroci.com/*
// @match        http://*.kuroci.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374374/remove%20redirect%20link%20from%20kurocicom.user.js
// @updateURL https://update.greasyfork.org/scripts/374374/remove%20redirect%20link%20from%20kurocicom.meta.js
// ==/UserScript==
window.onload = function () {
  var brandAdDomain = 'localhost';
  var go='';

  function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	};

  (function() {
    delete_cookie("nvm");
    delete_cookie("theme");
    console.log("here 1");
    if(window.location.pathname!=='/'){
      var xTimeOut=0, xMaxTimeOut=50;
      var reHrefDlbtn=setInterval(function () {
        var elements = document.querySelectorAll("a[href*='merdekaid.online']");

        for (var ie = 0; ie < elements.length; ie++) {
          if(elements[ie].href){
            //console.log(elements[ie]);
            var newHreftoGo=getParameterByName("url", elements[ie].href);
            if(newHreftoGo){
              elements[ie].href = newHreftoGo;
            }else{
              elements[ie].href = elements[ie].href;
            }
          }
        }

        var elemiklans = document.querySelectorAll("[class^=iklan],[class^=bp-]");

        for (var ieiklans = 0; ieiklans < elemiklans.length; ieiklans++) {
          elemiklans[ieiklans].remove();
        }

        xTimeOut++;
        if(xTimeOut>xMaxTimeOut){
          clearInterval(localStorage.getItem("reHrefDlbtn"));
          console.log("We got timeout");
          //Do something, its timeout;
        }
      }, 100);
      localStorage.setItem("reHrefDlbtn", reHrefDlbtn);
      }
  })();
}