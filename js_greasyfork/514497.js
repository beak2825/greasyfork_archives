// ==UserScript==
// @name            Repubblica.it - Cookie Cleaner
// @name:it         Repubblica.it - Pulizia dei cookie
// @namespace       https://tampermonkey.net
// @version         1.0.0
// @description     Maintain a cookie and tracking-free experience on Repubblica.it
// @description:it  Naviga su Repubblica.it limitando il salvataggio dei cookie traccianti
// @author          Ovinomaster
// @match           https://www.repubblica.it/*
// @match           https://*.repubblica.it/*
// @grant           unsafeWindow
// @require         https://greasyfork.org/scripts/35383-gm-addstyle-polyfill/code/GMaddStyle%20Polyfill.js?version=231590
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/514497/Repubblicait%20-%20Cookie%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/514497/Repubblicait%20-%20Cookie%20Cleaner.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */

//--- Loop through cookies and delete them.
var cookieList  = document.cookie.split (/;\s*/);

for (var J = cookieList.length - 1;   J >= 0;  --J) {
    var cookieName = cookieList[J].replace (/\s*(\w+)=.+$/, "$1");

    eraseCookie (cookieName);
}

function eraseCookie (cookieName) {
    //--- ONE-TIME INITS:
    //--- Set possible domains. Omits some rare edge cases.?.
    var domain      = document.domain;
    var domain2     = document.domain.replace (/^www\./, "");
    var domain3     = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, "$2");;

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