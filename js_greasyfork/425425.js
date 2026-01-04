// ==UserScript==
// @name         Outlook Event Notify
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Outlook Event Notification
// @author       You
// @match        https://partner.outlook.cn/mail/*
// @match        https://partner.outlook.cn/calendar/*
// @icon         https://partner.outlook.cn/owa/favicon.ico
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/425425/Outlook%20Event%20Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/425425/Outlook%20Event%20Notify.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {

    if (mutation.addedNodes.length) {
      //alert("added nodes");
      console.log("added nodes", mutation.addedNodes);
      notify();
    }

  });
});

var config = {
  childList: true,
  subtree: true,
  characterData: true
};


(async function() {
    'use strict';
    waitForPageLoadedFinish();
   // const _found = false;
    //await GM.getValue("event_found", _found);
    //var target =document.getElementsByClassName("_3ZKg7s0nAnus154pCTvyce")[0];
    //console.log("find target",target);
    //observer.observe(target, config);
    // Your code here...
})();

function waitForPageLoadedFinish(){
    var target =document.getElementsByClassName("_3ZKg7s0nAnus154pCTvyce")[0];
    if(target != undefined){
        console.log("find2 target",target);
        observer.observe(target, config);
        notify();
        return;
    }else{
        setTimeout(waitForPageLoadedFinish, 1000);
    }
}

async function setEventFound(check){
  var useGS=check;
  GM.setValue("event_found", check);
}

function notify(){
    var nodes = document.getElementsByClassName("_3ZKg7s0nAnus154pCTvyce")[0].getElementsByClassName('ms-FocusZone');
    for ( let node of nodes) {
        if ( node.hasAttribute("tabindex") ){
            console.log("find3 target",node);
            Notification.requestPermission(function (perm) {
                if (perm == "granted") {
                    var notification = new Notification("会议提醒", {
                        dir: "auto",
                        requireInteraction: true,
                        lang: "zh",
                        body:"主题："+node.innerText.replace("\n","")
                    });
                }
            })
        }
    }
}
