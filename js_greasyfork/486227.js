// ==UserScript==
// @name         DST-Blocker-Blocker
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Block Adblocker Blocker on der Standard
// @author       You
// @match        https://www.derstandard.at/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=derstandard.at
// @grant        GM_webRequest
// @downloadURL https://update.greasyfork.org/scripts/486227/DST-Blocker-Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/486227/DST-Blocker-Blocker.meta.js
// ==/UserScript==


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

(function() {
    'use strict';

//     let copyStory = document.getElementsByClassName("article-body")[0];
//     let copyForum = document.getElementsByClassName("story-community-inner")[0];

//     function insertAfter(newNode, existingNode) {
//     existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
//     }
    var cookieList  = document.cookie.split (/;\s*/);

    const blockedSelector = 'https://www.derstandard.at/qpkdl/zonck/*';

    GM_webRequest([
        { selector: blockedSelector, action: 'cancel' },
    ], (info, message, details) => {
       console.log('GET request to blocked URL blocked:', info, message, details);
    });




    window.setInterval( () => {
        localStorage.setItem('zonck', 0);
        for (var J = cookieList.length - 1;   J >= 0;  --J) {
            var cookieName = cookieList[J].replace (/\s*(\w+)=.+$/, "$1");
            if(cookieName === "zonck"){
                console.log("Zonck found")
                 eraseCookie (cookieName);
            }
        }

     


        document.getElementsByClassName("dialog-backdropblur").forEach(e => {
             e.remove();
            let header = document.getElementsByClassName("article-header")[0];
            let commSt = document.getElementsByClassName("story-community")[0];
            commSt.appendChild(copyForum);
            insertAfter(copyStory,header);
        });
    }, 500);

})();