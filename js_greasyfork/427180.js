// ==UserScript==
// @name         TweetDeck User-Column Replies Filter
// @name:ja      TweetDeck Userカラム リプライフィルター
// @namespace    https://greasyfork.org/users/175598
// @version      1.0
// @description  Hides (not retweet or thread) replies in user-column.
// @description:ja Userカラム内の(リツイートやスレッドではない)リプライを隠します
// @author       N.Y.Boyu
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427180/TweetDeck%20User-Column%20Replies%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/427180/TweetDeck%20User-Column%20Replies%20Filter.meta.js
// ==/UserScript==
(function(){
    var MutationObserver=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
    var init,columnCheck,chirpCheck;

    var yourUserName="";
    //NOTE: If put your user name, hides your tweet/retweet in home-column.

    init=function(){
        var style,app,observer,init2;
        style=document.createElement("style");
        style.textContent='article[drf-removed]{ position:absolute; z-index:-1; }';
        document.head.appendChild(style);
        app=document.getElementsByClassName("application")[0];
        init2=function(){
            if(app.className==="application js-app is-condensed"){
                observer.disconnect();
                var cols=app.getElementsByClassName("app-columns")[0];
                new MutationObserver(columnCheck).observe(cols,{childList:true});
                columnCheck([{addedNodes:cols.children}]);
            }
        };
        (observer=new MutationObserver(init2)).observe(app,{attributes:true,attributeFilter:["class"]});
        init2();
    };

    columnCheck=function(recs){
        for(var i=0;i<recs.length;i++){for(var j=0;j<recs[i].addedNodes.length;j++){
            var target=recs[i].addedNodes[j];
            if(target.dataset.column&&!target.drfColumnMarked){
                target.drfColumnMarked=true;
                var chirps=target.getElementsByClassName("chirp-container")[0];
                chirps.type=target.getElementsByClassName("column-type-icon")[0].className.split("icon-")[1];
                new MutationObserver(chirpCheck).observe(chirps,{childList:true});
                chirpCheck([{addedNodes:chirps.children}]);
            }
        }}
    };

    chirpCheck=function(recs){
        var i,j,target,type,isReply,isRetweet,author;
        for(i=0;i<recs.length;i++){for(j=0;j<recs[i].addedNodes.length;j++){
            target=recs[i].addedNodes[j];
            if(!type)type=target.parentNode.type;
            if(!target.dataset.tweetId)break;
            isReply=!!target.querySelector(".tweet-body>.nbfc>.other-replies");
            isRetweet=!!target.querySelector(".tweet-context>.item-img>.icon-retweet-filled");
            if(yourUserName){
                author=isRetweet?target.querySelector('.tweet-context>.nbfc>[rel="user"]').href.slice(20)
                                :target.querySelector(".tweet>header>.account-link").href.slice(20);
            }
            if((type==="user"&&isReply&&!isRetweet)||
               (type==="home"&&yourUserName&&yourUserName===author)){
                console.log("DRF: Hit");
                target.removeChild(target.children[0]);
                target.setAttribute("drf-removed","");
                //DO NOT delete DIRECTLY to avoid bugs.
            }
        }}
    };

    init();
    console.log("DRF: TweetDeck User-Column Replies Filter is enabled.");
})();