// ==UserScript==
// @name         Mya Discord Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Discord Theme which created for a HK VTuber: Mya
// @author       PoH98
// @match        https://discord.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447608/Mya%20Discord%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/447608/Mya%20Discord%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    let isStarted = false;
    setInterval(function(){
        if(document.getElementsByClassName("bg-1QIAus").length > 0){
            if(!isStarted){
                console.log("Discord Theme Started");
                isStarted = true;
                addGlobalStyle(".banner-1YaD3N,.userPopout-2j1gM4{background-size:cover;background-position:center}.app-2CXKsg{background-image:url(https://pbs.twimg.com/media/FIRISv1XEAcewH-?format=jpg&name=large)!important;background-size:cover;background-color:transparent!important}.bannerPremium-2hSAwz .premiumIconWrapper-1A-UH5,.profileBadges-2pItdR{display:none}.bodyInnerWrapper-2bQs1k,.chat-2ZfjoI,.container-1NXEtd,.footer-3naVBw,.layer-86YKbF,.members-3WRCEx>div{background-color:transparent}.members-3WRCEx,.messageListItem-ZZ7v6g:hover,.sidebar-1tnWFu{background-color:rgba(0,0,0,.2)}.userPopout-2j1gM4{background-color:transparent;background-image:linear-gradient(180deg,rgba(0,0,0,.8),rgba(0,0,0,.6)),url(https://pbs.twimg.com/media/FIMYjjlUYAIvezH?format=jpg&name=small)}.banner-1YaD3N,.theme-dark .container-2cd8Mz{background-color:transparent!important}.banner-1YaD3N{background-image:url(https://pbs.twimg.com/media/FP6Tn6EaMAE_hAK?format=jpg&name=small);height:80px}.bg-1QIAus{background-color:rgba(0,0,0,.75)}.container-2o3qEW{background:0 0}.message-group.compact .message .markup{font-size:75%;text-indent:-80px;padding-left:50px}.theme-dark .friends-table .messages .message-group.compact .user-name,.theme-dark .messages-wrapper .messages .message-group.compact .user-name{font-size:100%}.channels-wrap{width:160px}.channel-members-wrap{min-width:200px}.channel-members{max-width:200px;padding:2px 0}.channel-members .member{padding:5px}.channel-members h2{padding:0 5px}.channel-members .member .member-activity{visibility:hidden;font-size:0px}.channel-members .member .member-inner{width:150px}.account .account-details{visibility:hidden}.channel-members .member .member-activity strong{visibility:visible;font-size:10px}.account .btn-group{position:relative;left:-75px}.guild-channels .channel{font-size:65%}.guild-channels header{font-size:65%;margin-top:5px}.guild-channels .channel-text.unread:not(.selected):not(.channel-muted)::before{top:5px;left:-6px}.guild-channels .channel-text a,.guild-channels .channel-voice{padding:5px 0 5px 10px}.message-group{margin-left:5px;margin-right:-17px}.message-group.compact .message{padding:0;margin:0}.message-group .mentioned .message-text{margin-left:15px;position:relative;left:-10px}.theme-dark .message-group.compact .mentioned .timestamp{width:70px}.message-group .comment .markup{margin-top:0}.message-group.compact .accessory{padding-left:0}.embed .embed-description,.embed .embed-error,.guild-channels .channel-voice-states li{font-size:10px}.guild-channels .channel-voice-states{margin-top:0;padding-left:0}.message-group.compact .emotewrapper img{max-height:16px!important;margin:-5px .1em!important}.channel-textarea{margin:10px 0 30px}.message-group.compact .timestamp{width:75px;text-align:right;padding-right:5px;overflow:hidden;font-size:10px}");
            }
        }
        else{
            isStarted = false;
        }
        let a = document.getElementsByClassName("notice-2HEN-u");
        if(a.length > 0){
            for (let e of a) {
                e.remove();
            }

        }
    }, 3000);
    // Your code here...
})();