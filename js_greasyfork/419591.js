// ==UserScript==
// @name Twitch Channel Points Chest Auto Opener
// @name:ja Twitchポイントチェスト自動開封
// @version 1.22
// @author N.Y.Boyu
// @description Automatically click channel points bonus button
// @description:ja 自動でチャンネルポイントのボーナスボタンをクリックします
// @match https://www.twitch.tv/*
// @match https://dashboard.twitch.tv/*
// @license MIT
// @grant none
// @namespace https://greasyfork.org/users/175598
// @downloadURL https://update.greasyfork.org/scripts/419591/Twitch%20Channel%20Points%20Chest%20Auto%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/419591/Twitch%20Channel%20Points%20Chest%20Auto%20Opener.meta.js
// ==/UserScript==
(function(){
    var MutationObserver=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
    if(MutationObserver&&history.pushState)console.log("CAO: Chest Auto Opener is enabled.");
    else return console.error("CAO: Sorry, but this browser is NOT compatible with Twitch Channel Points Chest Auto Opener.");

    var INITIAL_STANDBY=5000; //default: 5,000ms
    var INITIAL_RECALL=60000; //default: 60,000ms
    var CHEST_WAIT=840000; //default: 840,000ms
    //NOTE: Chest appears each 15 minutes. (help.twitch.tv/s/article/channel-points-guide)

    //avoid multi-thread
    var timer=-1;
    var observer=false;
    var clearCaller=function(){ clearTimeout(timer);if(observer){observer.disconnect();observer=false;} };
    var setTimer=function(func,wait,solo){
        if(solo)clearCaller();
        else clearTimeout(timer);
        timer=setTimeout(func,wait);
    };
    var setObserver=function(func,elem,solo){
        if(solo)clearCaller();
        else if(observer){observer.disconnect();observer=false;}
        (observer=new MutationObserver(func)).observe(elem,{childList:true,subtree:true});
    };

    var container;
    var waiting=false;
    var check=function(){
        if(waiting)return;
        var bonus=container.getElementsByClassName("claimable-bonus__icon")[0];
        if(bonus){
            bonus.click();
            console.log("CAO: Chest opened at "+new Date());
            waiting=true;
            setTimer(function(){waiting=false;check();},CHEST_WAIT,false);
        }
    };

    var wrapper;
    var initCheck2=function(){
        if(container=wrapper.getElementsByClassName("community-points-summary")[0]){
            container=container.lastElementChild;
            //.chat-input__buttons-container>:first-child .community-points-summary>:last-child
            console.log("CAO: Channel points exist");
            setObserver(check,container,true);
            check();
        }
    };
    var initCheck=function(){
        if(wrapper=document.getElementsByClassName("chat-input__buttons-container")[0]){
            wrapper=wrapper.firstElementChild;
            console.log("CAO: Chat input exist");
            setObserver(initCheck2,wrapper,true);
            initCheck2();
        }else{
            if(INITIAL_RECALL>0)setTimer(initCheck,INITIAL_RECALL,true);
        }
    };

    //detect loaction change
    var init=function(){
        console.log("CAO: location change detected ("+document.URL+") at "+new Date());
        waiting=false;
        clearCaller();
        var path=document.URL.split('/'),n=path.length,existable=true;
        if(path[2]==="dashboard.twitch.tv") existable=(n>5&&path[5]==="stream-manager");
        else if(n>3&&path[3]==="directory") existable=false;
        else if(n<4||(n===4&&path[3]==="")) existable=false;
        else if(n<5||(n===5&&path[4]==="")) existable=(path[3].substring(0,7)!=="search?");
        else if(n<6||(n===6&&path[5]==="")) existable=(path[3]!=="videos")&&(path[3]!=="collections");
        else if(n<7||(n===7&&path[6]==="")) existable=(path[4]!=="video")&&(path[4]!=="clip");
        if(!existable)return console.log("CAO: This page will not exist channel points...");
        setTimer(initCheck,INITIAL_STANDBY,true);
    };
    (function(f){history.pushState=function(){var res=f.apply(this,arguments);init();return res;};})(history.pushState);
    (function(f){history.replaceState=function(){var res=f.apply(this,arguments);init();return res;};})(history.replaceState);
    window.addEventListener("popstate",init);
    init();
})();