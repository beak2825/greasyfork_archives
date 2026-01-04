// ==UserScript==
// @name         BrightSpace Autologin
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/en/users/195184-franxx
// @version      0.7.1
// @description  BrightSpace pages Autologin. Save your life from junk design with junk design.
// @author       franxx
// @license      GPL-3.0-only
// @match        https://*.brightspace.com/*
// @run-at       document-start
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/438797/BrightSpace%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/438797/BrightSpace%20Autologin.meta.js
// ==/UserScript==

function connectionLoginCheck(){
    var url="https://dal.brightspace.com/d2l/home";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",url, false );
    xmlHttp.send();
    return xmlHttp.responseText.length>500;
}

function queryURLParam(str){
    let query=window.location.search.substring(1);
    let params=query.split("&");
    for(let i=0;i<params.length;i++){
        let kv=params[i].split("=");
        if(kv[0]==str){
            return kv[1];
        }
    }
    return "";
}

function refreshBSPage(){
    let target=queryURLParam("target");
    if(target===""){
        target="/d2l/home";
    }
    let url=window.location.origin+decodeURIComponent(target);
    window.location.href=url;
}

(function() {
    if(window.location.pathname!=="/d2l/login"){//only processes the login page
        if(connectionLoginCheck()){
            if(!GM_getValue("isLogin",false)){
                GM_setValue("isLogin",true);
            }
        }
        return;
    }

    if(queryURLParam("failed")!=="1"){ //pin the url
        window.location.href=window.location+"&failed=1";
    }

    //assert pathname==="/d2l/login" with parameter "&failed=1"

    if(!connectionLoginCheck()){
        if(GM_getValue("isLogin",false)){
            GM_setValue("isLogin",false);
        }
    }else{
        refreshBSPage();
    }

    GM_addValueChangeListener("isLogin",function(name, old_value, new_value, remote){
        if(remote){
            if(new_value===true){
                refreshBSPage();
            }
        }
    });
})();
