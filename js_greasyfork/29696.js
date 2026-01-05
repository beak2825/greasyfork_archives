// ==UserScript== 
 // @name NRC(Q)-paywall-remover 
 // @namespace https://abb.ink/ 
 // @version 0.4.0 
 // @description Removes the paywall from nrcq.nl and nrc.nl 
 // @author Jasper Abbink 
 // @match http://www.nrc.nl/* 
 // @match https://www.nrc.nl/* 
 // @grant none 
// @downloadURL https://update.greasyfork.org/scripts/29696/NRC%28Q%29-paywall-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/29696/NRC%28Q%29-paywall-remover.meta.js
 // ==/UserScript==   
  
 var eraseCookie = function(cookieName) { 
 //--- ONE-TIME INITS: 
 //--- Set possible domains. Omits some rare edge cases.?. 
 var domain = document.domain; 
 var domain2 = document.domain.replace (/^www\./, ""); 
 var domain3 = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, "$2"); 
  
 //--- Get possible paths for the current page: 
 var pathNodes = location.pathname.split ("/").map ( function (pathWord) { 
 return '/' + pathWord; 
 } ); 
 var cookPaths = [""].concat (pathNodes.map ( function (pathNode) { 
 if (this.pathStr) { 
 this.pathStr += pathNode; 
 } 
 else { 
 this.pathStr = "; path="; 
 return (this.pathStr + pathNode); 
 } 
 return (this.pathStr); 
 } ) ); 
  
 ( function (cookieName) { 
 //--- For each path, attempt to delete the cookie. 
 cookPaths.forEach ( function (pathStr) { 
 //--- To delete a cookie, set its expiration date to a past value. 
 var diagStr = cookieName + "=" + pathStr + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;"; 
 document.cookie = diagStr; 
  
 document.cookie = cookieName + "=" + pathStr + "; domain=" + domain + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;"; 
 document.cookie = cookieName + "=" + pathStr + "; domain=" + domain2 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;"; 
 document.cookie = cookieName + "=" + pathStr + "; domain=" + domain3 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;"; 
 } ); 
 } ) (cookieName); 
 }; 
  
 var boxy = document.getElementsByClassName('boxy'); 
 if (boxy.length > 0) { 
 document.getElementById('scherm').removeChild(boxy[0]); 
 } 
  
 var paywallPopup = document.getElementsByClassName('paywall-popup'); 
 if (paywallPopup.length > 0) { 
 eraseCookie('counter'); 
 document.getElementsByTagName('main')[0].removeChild(paywallPopup[0]); 
 }  