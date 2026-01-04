// ==UserScript==
// @name         LeetCode AC music feedback
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  LeetCode AC play music 《Good luck》
// @author       WangXiaowu
// @match        https://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?domain=leetcode.com
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435756/LeetCode%20AC%20music%20feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/435756/LeetCode%20AC%20music%20feedback.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("ac music script load");
    let netease_src = "https://m704.music.126.net/20211120101235/597d909fe47e4e1336d43ea96eda127e/jdyyaac/obj/w5rDlsOJwrLDjj7CmsOj/8837130090/e64d/e6e0/76ad/4b9e06388e5bf007db0a99c0170a662c.m4a?authSecret=0000017d3b07043f05c80aaba3b00328";
    let netease_srcn = "http://m10.music.126.net/20211121195512/f1eb41e25d4846273e12f52b84045c92/ymusic/4bdf/6272/32b8/550de1cb120525fd99d8022b4907e8c6.mp3";
    let qq_sr = "https://dl.stream.qqmusic.qq.com/C400000491MM0CyBv8.m4a?guid=3154030324&vkey=3159164EDCFFAD356C35F3258E781F1FEEB4AB9F2E9A942787D6AA4BC686CE5E239F09722BB8992203AD3DE25D44A80791EB877E0866C1F8&uin=&fromtag=66";
    let dropBox = "https://dl.dropboxusercontent.com/s/rd4jgy9he0oklyz/%E5%A5%BD%E6%97%A5%E5%AD%90.m4a?dl=0"
    var player = document.createElement('audio');
    player.src = dropBox;
    var observer = new MutationObserver(function (mutations, me) {
        // `mutations` is an array of mutations that occurred
        // `me` is the MutationObserver instance
        var button =  $("a[data-question-title-slug]").length;
        var cn_success = $("div[data-cypress='SubmissionSuccess']").length;
        console.debug("cn_length:", cn_success);
        console.debug("en_length: ",button)
        if (button || cn_success ) {

            if(!player.paused && player.currentTime > 3){
                player.pause();
            }else{
                player.play();
           }
            //me.disconnect(); // stop observing
            return;
        }
    });

    // start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });


    // Your code here...
})();