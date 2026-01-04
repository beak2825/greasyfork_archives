// ==UserScript==
// @name         Youtube Ad Auto Skipper
// @name:ja      Youtube広告自動スキップ
// @namespace    https://greasyfork.org/users/175598
// @version      3.01
// @description  Automatically click Ad Skip button on Youtube
// @description:ja  自動でYoutubeの広告のスキップボタンを押します
// @author       N.Y.Boyu
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/live_chat?*
// @exclude      https://www.youtube.com/live_chat_replay?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/408016/Youtube%20Ad%20Auto%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/408016/Youtube%20Ad%20Auto%20Skipper.meta.js
// ==/UserScript==
(function(){
    var MutationObserver=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
    if(!MutationObserver){
        return console.error("YAS: Sorry, but this browser is NOT compatible with Youtube Ad Auto Skipper.");
    }
    try{if((window.self!==window.top)&&(document.URL.substring(23,30)!=="/embed/")){
        return console.log("YAS: This frame will not contain video...");
    }}catch(e){}
    console.log("YAS: Youtube Ad Auto Skipper is enabled.");

    var container;
    var check=function(){
        var button=container.getElementsByClassName("ytp-ad-skip-button")[0]||
                   container.getElementsByClassName("ytp-ad-skip-button-modern")[0]||
                   container.getElementsByClassName("ytp-skip-ad-button")[0];
        if(button){
            button.click();
            console.log("YAS: Skipped at "+new Date());
        }
    };
    var initObserver;
    var init=function(){
        if(container=document.getElementById("movie_player")){
            console.log("YAS: Video container detected.");
            initObserver.disconnect();
            new MutationObserver(check).observe(container,{childList:true,subtree:true});
            check();
        }
    };
    (initObserver=new MutationObserver(init)).observe(document.body,{childList:true,subtree:true});
    init();
})();