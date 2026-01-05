// ==UserScript==
// @name         Politiken.dk Fixer
// @version      0.4.2
// @description  Removes cookies and overlay from politiken.dk (based on politiken.dk!Argh)
// @author       UB
// @include      http://politiken.dk/*
// @match        http://politiken.dk/*
// @grant        none
// @namespace https://greasyfork.org/users/45451
// @downloadURL https://update.greasyfork.org/scripts/19950/Politikendk%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/19950/Politikendk%20Fixer.meta.js
// ==/UserScript==

setTimeout(function(){ 

  var el1 = document.getElementsByClassName("modal--adblockblocker")[0];
  if(el1 !== undefined) el1.parentNode.parentNode.remove();

  var elemCookie = document.getElementById("cookie-warning");
  elemCookie.remove();
  // Removing the elements sometimes romoves the scroll bar as well
  // This will make sure it is there
  var html = document.getElementsByTagName('html')[0];
  html.style['overflow-y'] = "scroll";

}, 2000);


function eraseCookie (cookieName) {
    //--- ONE-TIME INITS:
    //--- Set possible domains. Omits some rare edge cases.?.
    var domain      = document.domain;
    var domain2     = document.domain.replace (/^www\./, "");
    var domain3     = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, "$2");

    //--- Get possible paths for the current page:
    var pathNodes   = location.pathname.split ("/").map ( function (pathWord) {
        return '/' + pathWord;
    } );
    var cookPaths   = [""].concat (pathNodes.map ( function (pathNode) {
        if (this.pathStr) {
            this.pathStr += pathNode;
        }
        else {
            this.pathStr = "; path=";
            return (this.pathStr + pathNode);
        }
        return (this.pathStr);
    } ) );

    ( eraseCookie = function (cookieName) {
        //--- For each path, attempt to delete the cookie.
        cookPaths.forEach ( function (pathStr) {
            //--- To delete a cookie, set its expiration date to a past value.
            var diagStr     = cookieName + "=" + pathStr + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = diagStr;

            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain  + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain2 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain3 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        } );
    } ) (cookieName);
}

//--- Loop through cookies and delete them.
var cookieList  = document.cookie.split (/;\s*/);

for (var J = cookieList.length - 1;   J >= 0;  --J) {
    var cookieName = cookieList[J].replace (/\s*(\w+)=.+$/, "$1");
    eraseCookie (cookieName);
}