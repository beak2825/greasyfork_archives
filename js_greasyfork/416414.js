// ==UserScript==
// @name         kong spam remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Psykoman
// @include      *www.kongregate.com/*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/416414/kong%20spam%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/416414/kong%20spam%20remover.meta.js
// ==/UserScript==

var strings = ['http://datingfree.us']

function spam_remove(){
    if($(".chat_message_window").length > 1){
        var observerTarget = jQuery(".chat_message_window")[1];
        var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
        var observer = new MutationObserver(function(mutations) {
            for(var i = 0; i < mutations[0].addedNodes[0].childNodes[0].childNodes[5].innerText.split(" ").length; i++){
                if(jQuery.inArray(mutations[0].addedNodes[0].childNodes[0].childNodes[5].innerText.split(" ")[i], strings) > -1){
                    mutations[0].addedNodes[0].remove()
                }
            }
        })
        observer.observe(observerTarget, observerConfig);
    }
}
waitForKeyElements(".chat_message_window", spam_remove);