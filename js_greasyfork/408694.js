// ==UserScript==
// @name         L'odeur du consentement
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Selectionne automatiquement "disagree" pour les cookies de la nouvelle extortion de jeuxvideo.com
// @author       IceFairy
// @supportURL
// @match        https://www.jeuxvideo.com/*
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408694/L%27odeur%20du%20consentement.user.js
// @updateURL https://update.greasyfork.org/scripts/408694/L%27odeur%20du%20consentement.meta.js
// ==/UserScript==

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(main);

function main(){
     CreateConsentButton();
     checkLearnMore();
}
function CreateConsentButton()
{
    var button = document.createElement("button");
    button.innerHTML = "Reset consent";
    button.className = "xXx button";
        button.addEventListener ("click", function() {
  EuConsent();
});
    document.getElementsByClassName("jv-nav-dropdown-container-bottom")[0].childNodes[2].after(button);

}

function EuConsent(){
    eraseCookie("euconsent-v2");
    eraseCookie("didomi_token");
    localStorage.removeItem("euconsent-v2");
    localStorage.removeItem("didomi_token");
    window.location.reload()
}

function checkLearnMore() {
  const el = document.getElementsByClassName("didomi-components-button didomi-button didomi-learn-more-button didomi-button-standard standard-button");
  if (el.length) {
    document.getElementById("didomi-notice-learn-more-button").click();
    setTimeout(setDisagree, 100);
  } else {
    setTimeout(checkLearnMore, 300);
  }
}

function setDisagree()
{
        document.getElementsByClassName("didomi-components-button didomi-button didomi-button-standard standard-button")[0].click();
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