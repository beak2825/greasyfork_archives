// ==UserScript==
// @name         AntiFlüchtlingsthread
// @namespace    daniel_watson
// @version      0.2
// @description  versteckt die neusten Beiträge der Flüchtlingsdebatte auf xrel.to 
// @author       daniel_watson
// @match        https://www.xrel.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23277/AntiFl%C3%BCchtlingsthread.user.js
// @updateURL https://update.greasyfork.org/scripts/23277/AntiFl%C3%BCchtlingsthread.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var comments = document.getElementsByClassName("last_comment");
    var toRemove = [];
    for (var i = 0; i < comments.length; i++) {
        var as = comments[i].getElementsByTagName("a");
        for (var j = 0; j < as.length; j++) {
            if(as[j].title==="Flüchtlingsdebatte?!"){
                toRemove.push(comments[i]);
                break;
            }
        } 
    }
    while(toRemove.length>0){
        var t = toRemove.pop();
        t.parentNode.removeChild(t);
    }
})();