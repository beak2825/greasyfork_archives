// ==UserScript==
// @name         secluded kukuku
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://kukuku.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386572/secluded%20kukuku.user.js
// @updateURL https://update.greasyfork.org/scripts/386572/secluded%20kukuku.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id;
    // 屏蔽词
    var wordList = ["本帅", "本现充", "本修士", "五等分", "比企谷", "银子", "九头龙"]
    // 过滤所有主题内容含屏蔽词的串（包括其回复）
    var threads = document.getElementsByClassName("thread");
    for (let i = 0; i < threads.length; i++) {
        var t = threads[i];
        for (const j in wordList) {
            if(t.children[1].innerText.indexOf(wordList[j]) != -1){
                id = t.id;
                document.getElementById(id).className = "hidden";
                i-=1;
                break;
            }
        }

    }
    //过滤所有内容含屏蔽词的回复
    var replies = document.getElementsByClassName("post reply");
    for (let i = 0; i < replies.length; i++) {
        var r = replies[i];
        for (const j in wordList) {
            if(r.innerText.indexOf(wordList[j]) != -1){
                id = r.id;
                document.getElementById(id).className = "hidden";
                i-=1;
                break;
            }
        }
    }
    // Your code here...
})();