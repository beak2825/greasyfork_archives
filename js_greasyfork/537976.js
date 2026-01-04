// ==UserScript==
// @name         Discord New Message Alert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alerts when new messages arrive in Discord chat
// @author       r!PsAw
// @match        https://discord.com/channels/*
// @match        https://diep.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      balls
// @downloadURL https://update.greasyfork.org/scripts/537976/Discord%20New%20Message%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/537976/Discord%20New%20Message%20Alert.meta.js
// ==/UserScript==

const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

//detect if we're on discord or diep.io
function where_are_we_rn(){
    switch(win.location.origin){
        case "https://discord.com":
            return "discord";
        case "https://diep.io":
            return "diepio";
        default:
            return "unknown";
    }
}

const origin = where_are_we_rn();

//logic for discord
let scrollerInner;
let old = new Set();
function find_scrollerInner(){
    if(document.querySelector('[class^="scrollerInner__"]')){
        scrollerInner = document.querySelector('[class^="scrollerInner__"]')
        return;
    }
    setTimeout(find_scrollerInner, 200);
}
find_scrollerInner();

function check_classes(element, goal){
    for(let _class of element.classList){
        if(_class.includes(goal)) return true;
    }
    return false;
}

function check_id(element, goal) {
    return element.id && element.id.includes(goal);
}

function is_message(element){
    return (element.innerText.length > 0 && element.nodeName === 'SPAN');
}

function read_messages(){
    if(!scrollerInner || origin != 'discord') return;
    for(let msg of scrollerInner.children){
        if(check_id(msg, 'chat-messages-')){
            let children = msg.children;
            for(let child of children){
            if(check_classes(child, 'message__')){
                let children1 = child.children;
                for(let child1 of children1){
                    if(check_classes(child1, 'contents_')){
                        let children2 = child1.children;
                        for(let child2 of children2){
                            if(check_id(child2, 'message-content-')){
                                let children3 = child2.children;
                                for(let child3 of children3){
                                    if(is_message(child3)){
                                        //console.log(child3.innerText);
                                        if(!old.has(child3.innerText)){
                                            old.add(child3.innerText);
                                            GM_setValue("Last Message", child3.innerText);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            }
        }
    }
}
setInterval(read_messages, 1000);

//logic for diep.io

let last_message = '';
function display_new_message(){
    if(!GM_getValue("Last Message") || origin != 'diepio') return;

    const stored_message = GM_getValue("Last Message");
    if(win.input && win.input.doesHaveTank() && stored_message !== last_message){
        console.log(stored_message, last_message, stored_message !== last_message);
        last_message = stored_message;
        win.input.inGameNotification(`[Discord -> Diep.io] ${stored_message}`);
    }
}

setInterval(display_new_message, 1000);
