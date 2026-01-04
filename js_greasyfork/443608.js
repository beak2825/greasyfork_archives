// ==UserScript==
// @name         Tiktok Utils
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  fast tiktok
// @author       nibnil
// @match        https://www.tiktok.com/@*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443608/Tiktok%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/443608/Tiktok%20Utils.meta.js
// ==/UserScript==

var zNode = document.createElement('div');
zNode.innerHTML = "<button id='myButton' type='button'>go</button>"
zNode.setAttribute('id', 'myContainer');
document.body.appendChild(zNode);
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

var last_index = 0
document.addEventListener('keydown', function(e){
    if (e.keyCode == 192) {
        let keyword = 'leggings'
        let isExists = false
        let intentionComment = null;
        let comments = document.getElementsByClassName("tiktok-q9aj5z-PCommentText ejs0ekz6")
        let commentContainer = document.getElementsByClassName("tiktok-46wese-DivCommentListContainer e1y4uan10")[0]
        for(let i =last_index; i< comments.length; i++){
            let text = comments[i].querySelector("span").textContent;
            console.log(text);
            if (text.indexOf(keyword) != -1){
                intentionComment = text;
                isExists = true;
                comments[i].scrollIntoView()
                toast(text)
            }
        }
        if (!isExists) {
            commentContainer.scrollTop += 1000
        }
        last_index = comments.length

    }
})

function ButtonClickAction (zEvent) {
    let keyword = 'leggings'
    let isExists = false
    let intentionComment = null;
    let comments = document.getElementsByClassName("tiktok-q9aj5z-PCommentText ejs0ekz6")
    let commentContainer = document.getElementsByClassName("tiktok-46wese-DivCommentListContainer e1y4uan10")[0]
    for(let i =last_index; i< comments.length; i++){
        let text = comments[i].querySelector("span").textContent;
        console.log(text);
        if (text.indexOf(keyword) != -1){
            intentionComment = text;
            isExists = true;
            comments[i].scrollIntoView()
            toast(text)
        }
    }
    if (!isExists) {
        commentContainer.scrollTop += 1000
    }
    last_index = comments.length
}

function toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

(function() {
    'use strict';
    let comment_icons = document.getElementsByClassName("tiktok-i3zdyr-SpanIconWrapper ee8s79f1")
    if (comment_icons) {
        console.log('true')
        let comment_icon = comment_icons[1]
        console.log(comment_icon)
        comment_icon.click()
        //let comments = document.getElementsByClassName("tiktok-q9aj5z-PCommentText ejs0ekz6")
        //for(let i =0; i< comments.length; i++){
        //    console.log(comments[i].querySelector("span").textContent);
        //}
    } else {
        console.log('false')
    }
})();



GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              10px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );