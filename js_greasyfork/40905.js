// ==UserScript==
// @name         WHEN UPDATE?!
// @version      0.2
// @description  Show them plebs the way!
// @author       Gisbert
// @match        https://chods-cheats.com/forums/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/181293
// @downloadURL https://update.greasyfork.org/scripts/40905/WHEN%20UPDATE%21.user.js
// @updateURL https://update.greasyfork.org/scripts/40905/WHEN%20UPDATE%21.meta.js
// ==/UserScript==

var key = "";
var msg = 'The+EFT+hack+is+outdated%21+It+will+%28most+likely%29+be+updated+on+monday.+You+will+get+some+days+added+to+your+subscription+once+the+hack+is+back+up+and+running%21';
var lastmsg;

(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            //console.log('XHR finished loading', method, url);
            if( url.includes('app=bimchatbox&module=chatbox&controller=chatbox&do=getMessages')){
                var url_thing = new URL(url);
                key = url_thing.searchParams.get("csrfKey");
                display();
            }
        });
        this.addEventListener('error', function() {
            //console.log('XHR errored out', method, url);
        });
        origOpen.apply(this, arguments);
    };
})();

function contains(target, pattern) {
    var value = 0;
    pattern.forEach(function(word) {
        value = value + target.includes(word);
    });
    if (value >= 3) {
        return true;
    } else {
        return false;
    }
}

function send_msg(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://chods-cheats.com/?app=bimchatbox&module=chatbox&controller=chatbox&do=chat', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");

    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // okay
        }
    };
    xhr.send("csrfKey=" + key +"&txt=" + msg);
}

function display(){
    var node = document.querySelectorAll('.ipsDataItem.chat_row')[99].querySelector('.ipsList_inline').textContent;
    var blacklist = ['EFT', 'hack', 'updated', 'cheat', 'usable', 'working', 'work', 'dont', 'when']; // expand it more?

    if (lastmsg != node && node != msg){
        if(contains(node, blacklist)){
            console.log("I'VE SENT A MESSAGE! YOU SHOULD SEE IT IN THE CHATBOX!");
            send_msg();
        }
    }
    lastmsg = node;
}