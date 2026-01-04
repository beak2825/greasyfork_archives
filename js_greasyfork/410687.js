// ==UserScript==
// @name         Google Shut Up!
// @namespace    http://tampermonkey.net/
// @version      0.2.7.6
// @description  Remove annoying cookies popup on google and youtube login popup on youtube! Thanks to him https://github.com/uBlockOrigin/uAssets/issues/7842#issuecomment-694298400
// @author       You
// @include      /^https\:\/\/[a-z]*\.(google|youtube)\.[a-z]*/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/410687/Google%20Shut%20Up%21.user.js
// @updateURL https://update.greasyfork.org/scripts/410687/Google%20Shut%20Up%21.meta.js
// ==/UserScript==

(function() {
    //console.log("Google Shut Up: Start");

    //Set your consent!
    //I'm not sure about this, it seems random to me
    var consent = {
        "Old" : "YES+EN.en+V13+BX",
        "Deny All" : "YES+cb.20210328-17-p0.it+F+654",
        "Allow Search Only" : "YES+cb.20210328-17-p0.it+F+709",
        "Allow Youtube History Only" : "YES+cb.20210328-17-p0.it+F+383",
        "Allow Ads Only" : "YES+cb.20210328-17-p0.it+F+503",
        "Allow Search + Youtube History" : "YES+cb.20210328-17-p0.it+F+193",
        "Allow Youtube History + Ads" : "YES+cb.20210328-17-p0.it+F+773",
        "Allow Search + Ads" : "YES+cb.20210328-17-p0.it+F+418",
        "Allow All" : "YES+cb.20210328-17-p0.it+F+175"
    };
    
    //I can only deny or allow all because more options are saved server side
    var socs = {
        "Deny All" : "CAE",
        "Allow All" : "CAI"
    }

    var setSocs = socs["Deny All"];
    var setConsent = consent["Deny All"];
    
    //https://stackoverflow.com/a/45956628----
    //youtube wtf events
    //new layout > 2017
    window.addEventListener("yt-navigate-finish", function(event) {
        window.dispatchEvent(new Event('locationchange'))
    });

    //old layout < 2017
    window.addEventListener("spfdone", function(e) {
        window.dispatchEvent(new Event('locationchange'))
    });

    window.addEventListener("load",function(){
        dismissLogin();
    },{once:true});

    function cookieIsSet(){
        return /*document.cookie.match(/CONSENT\=YES\+/) !== null &&*/ document.cookie.match(/SOCS\=CA(E|I)/) !== null;
    }

    function siteIsRefreshable(){
        return document.URL.match(/^https\:\/\/((accounts|pay|news|drive|translate|docs|business|developers)\.(google|youtube)\.[\.a-z]*|www\.google\.[\.a-z]*\/recaptcha|www\.google\.[\.a-z]*\/maps\/embed)/i) === null;
    }

    function isYoutube(){
        return document.URL.match(/^https\:\/\/www\.youtube\.com/i) !== null;
    }
    function isEmbedded(){
        return document.URL.match(/(\/embed\/|\/subscribe_embed)/i) !== null;
    }
    
    window.addEventListener('locationchange', function(){
        if(!cookieIsSet() && !isEmbedded()){
            cookieInjection();
        }
        dismissLogin();
    });

    //if cookie is unset then inject it
    if(!cookieIsSet() && !isEmbedded()){
        cookieInjection();
    }
    dismissLogin();

    function cookieInjection(){
        //cookie injection
        //document.cookie = "CONSENT="+setConsent+"; expires=Fri, 01 Jan 2038 00:00:00 GMT; domain="+document.URL.match(/^https\:\/\/[a-z]*\.((google|youtube)\.[\.a-z]*)/)[1]+"; path =/; Secure";
        document.cookie = "SOCS="+setSocs+"; expires=Fri, 01 Jan 2038 00:00:00 GMT; domain="+document.URL.match(/^https\:\/\/[a-z]*\.((google|youtube)\.[\.a-z]*)/)[1]+"; path =/; SameSite=Lax; Secure";

        //reload on accounts.google.com pages causes infinite loop
        if(siteIsRefreshable()){
            //refresh page to avoid cookie's popup
            //console.log("Google Shut Up: cookie refresh");
            if(document.URL.match(/^https\:\/\/consent\.(?:google|youtube)\.[\.a-z]*\/m\?continue\=([^&]*)/) !== null){
                location.href=decodeURIComponent(document.URL.match(/^https\:\/\/consent\.(?:google|youtube)\.[\.a-z]*\/m\?continue\=([^&]*)/)[1])
            }else{
                location.reload();
            }
        }
    }

    //Link: https://github.com/uBlockOrigin/uAssets/issues/7842#issuecomment-694298400
    //Source: https://gist.githubusercontent.com/pixeltris/b79707fa8a704e0058c7f1af83d5935a/raw/Yt.js
    //Thanks to this guy!
    function dismissLogin(){
        try {
            window.ytInitialPlayerResponse.auxiliaryUi.messageRenderers.upsellDialogRenderer.isVisible = false;
            //console.log("Google Shut Up: dismissed login popup");
        } catch (e){
        }
        
        //this is new
        try {
            window.ytInitialData.overlay.upsellDialogRenderer.isVisible = false;
            //console.log("Google Shut Up: dismissed login popup");
        } catch (e){
        }
    }

})();