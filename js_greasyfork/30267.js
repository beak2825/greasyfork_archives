// ==UserScript==
// @name         tumblr group ALL
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  send pinterest gifs to telegram channel
// @author       javad
// @include      https://*.tumblr.com/*
// @include      http://*.tumblr.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/30267/tumblr%20group%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/30267/tumblr%20group%20ALL.meta.js
// ==/UserScript==

// Fill this Variable
var token = "369540511:AAFdkG6ssn9kym7EoyOsAz2aoWAlDQm0qf0";
var channel = "-185956574";
//____________________

GM_registerMenuCommand('tumblr group ALL', function () {
    var title = window.location.href;
    var gifs = document.querySelectorAll('div[class="photoset"]>div>a>img');
    if (gifs[0] == null){
        console.log("div");

        gifs = document.querySelectorAll('div[class="photoset"]>div>img');
        console.log("1");
    }
    if (gifs[0] == null){
        console.log("wrapper");

        try{gifs = document.querySelector('div[class="post-wrapper clearfix"]').querySelectorAll('img[src$="0.gif"],img[src$="0.jpg"]');}catch(err){};
        console.log(gifs);
    }
    if (gifs[0] == null){
        console.log("iframe");
        try{
            document.querySelectorAll('iframe').forEach(function(item){gifs = item.contentDocument.querySelectorAll("img[src$='0.gif'],img[src$='0.jpg']");});
        }catch(err){};
    }
    if (gifs[0] == null){
        console.log("else");

        try{gifs = document.querySelectorAll('#content > ol > li.photo > p.noborder > a > img');}catch(err){};
        console.log(gifs);
    }
    if (gifs[0] == null){
        console.log("else else");

        try{gifs = document.querySelectorAll('div.post-panel > div.media > div > img');}catch(err){};
        console.log(gifs);
    }
    if (gifs[0] == null){
        console.log("else else else");

        try{gifs = document.querySelectorAll('div.post-panel > div.media > div > a > img');}catch(err){};
        console.log(gifs);
    }

    if (gifs[0] == null){
        console.log("meta");

        try{gifs = document.querySelectorAll("img[src$='0.jpg']");}catch(err){};
        console.log(gifs);
    }

    console.log(gifs);
    gifs.forEach(function(item){
        console.log("1");
        var gif = item.src;

        console.log("2");

        if(gif.toString().endsWith(".gif")){var method = "video";}else{var method = "photo";}
        console.log("3");

        GM_xmlhttpRequest({
            method : "POST",
            url : "https://api.telegram.org/bot"+token+"/send"+method,
            data : "chat_id="+ channel +"&"+method+"=" + gif+"&caption="+title,
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            onload : function (response) {
                if (response.readyState==4 && response.status==200) {
                    GM_notification({
                        text:       'photo is Sent to your group',
                        title:      'Success',
                        timeout:    6000,
                        highlight:  true
                    });
                }
            }
        });
    });
}, 's');