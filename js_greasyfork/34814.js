// ==UserScript==
// @name         Elite JVC
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description Avoir les smileys de JVC sur le Reddit
// @author       Noukkis
// @match        https://www.reddit.com/r/EliteDeLaNation/*
// @downloadURL https://update.greasyfork.org/scripts/34814/Elite%20JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/34814/Elite%20JVC.meta.js
// ==/UserScript==

var smileys = [
    {'text' : ':)', 'link' : '//image.jeuxvideo.com/smileys_img/1.gif'},
    {'text' : ':snif:', 'link' : '//image.jeuxvideo.com/smileys_img/20.gif'},
    {'text' : ':gba:', 'link' : '//image.jeuxvideo.com/smileys_img/17.gif'},
    {'text' : ':g)', 'link' : '//image.jeuxvideo.com/smileys_img/3.gif'},
    {'text' : ':-)', 'link' : '//image.jeuxvideo.com/smileys_img/46.gif'},
    {'text' : ':snif2:', 'link' : '//image.jeuxvideo.com/smileys_img/13.gif'},
    {'text' : ':bravo:', 'link' : '//image.jeuxvideo.com/smileys_img/69.gif'},
    {'text' : ':d)', 'link' : '//image.jeuxvideo.com/smileys_img/4.gif'},
    {'text' : ':hap:', 'link' : '//image.jeuxvideo.com/smileys_img/18.gif'},
    {'text' : ':ouch:', 'link' : '//image.jeuxvideo.com/smileys_img/22.gif'},
    {'text' : ':pacg:', 'link' : '//image.jeuxvideo.com/smileys_img/9.gif'},
    {'text' : ':cd:', 'link' : '//image.jeuxvideo.com/smileys_img/5.gif'},
    {'text' : ':-)))', 'link' : '//image.jeuxvideo.com/smileys_img/23.gif'},
    {'text' : ':ouch2:', 'link' : '//image.jeuxvideo.com/smileys_img/57.gif'},
    {'text' : ':pacd:', 'link' : '//image.jeuxvideo.com/smileys_img/10.gif'},
    {'text' : ':cute:', 'link' : '//image.jeuxvideo.com/smileys_img/nyu.gif'},
    {'text' : ':content:', 'link' : '//image.jeuxvideo.com/smileys_img/24.gif'},
    {'text' : ':p)', 'link' : '//image.jeuxvideo.com/smileys_img/7.gif'},
    {'text' : ':-p', 'link' : '//image.jeuxvideo.com/smileys_img/31.gif'},
    {'text' : ':noel:', 'link' : '//image.jeuxvideo.com/smileys_img/11.gif'},
    {'text' : ':oui:', 'link' : '//image.jeuxvideo.com/smileys_img/37.gif'},
    {'text' : ':(', 'link' : '//image.jeuxvideo.com/smileys_img/45.gif'},
    {'text' : ':peur:', 'link' : '//image.jeuxvideo.com/smileys_img/47.gif'},
    {'text' : ':question:', 'link' : '//image.jeuxvideo.com/smileys_img/2.gif'},
    {'text' : ':cool:', 'link' : '//image.jeuxvideo.com/smileys_img/26.gif'},
    {'text' : ':-(', 'link' : '//image.jeuxvideo.com/smileys_img/14.gif'},
    {'text' : ':coeur:', 'link' : '//image.jeuxvideo.com/smileys_img/54.gif'},
    {'text' : ':mort:', 'link' : '//image.jeuxvideo.com/smileys_img/21.gif'},
    {'text' : ':rire:', 'link' : '//image.jeuxvideo.com/smileys_img/39.gif'},
    {'text' : ':-((', 'link' : '//image.jeuxvideo.com/smileys_img/15.gif'},
    {'text' : ':fou:', 'link' : '//image.jeuxvideo.com/smileys_img/50.gif'},
    {'text' : ':sleep:', 'link' : '//image.jeuxvideo.com/smileys_img/27.gif'},
    {'text' : ':-D', 'link' : '//image.jeuxvideo.com/smileys_img/40.gif'},
    {'text' : ':nonnon:', 'link' : '//image.jeuxvideo.com/smileys_img/25.gif'},
    {'text' : ':fier:', 'link' : '//image.jeuxvideo.com/smileys_img/53.gif'},
    {'text' : ':honte:', 'link' : '//image.jeuxvideo.com/smileys_img/30.gif'},
    {'text' : ':rire2:', 'link' : '//image.jeuxvideo.com/smileys_img/41.gif'},
    {'text' : ':non2:', 'link' : '//image.jeuxvideo.com/smileys_img/33.gif'},
    {'text' : ':sarcastic:', 'link' : '//image.jeuxvideo.com/smileys_img/43.gif'},
    {'text' : ':monoeil:', 'link' : '//image.jeuxvideo.com/smileys_img/34.gif'},
    {'text' : ':o))', 'link' : '//image.jeuxvideo.com/smileys_img/12.gif'},
    {'text' : ':nah:', 'link' : '//image.jeuxvideo.com/smileys_img/19.gif'},
    {'text' : ':doute:', 'link' : '//image.jeuxvideo.com/smileys_img/28.gif'},
    {'text' : ':rouge:', 'link' : '//image.jeuxvideo.com/smileys_img/55.gif'},
    {'text' : ':ok:', 'link' : '//image.jeuxvideo.com/smileys_img/36.gif'},
    {'text' : ':non:', 'link' : '//image.jeuxvideo.com/smileys_img/35.gif'},
    {'text' : ':malade:', 'link' : '//image.jeuxvideo.com/smileys_img/8.gif'},
    {'text' : ':fete:', 'link' : '//image.jeuxvideo.com/smileys_img/66.gif'},
    {'text' : ':sournois:', 'link' : '//image.jeuxvideo.com/smileys_img/67.gif'},
    {'text' : ':hum:', 'link' : '//image.jeuxvideo.com/smileys_img/68.gif'},
    {'text' : ':ange:', 'link' : '//image.jeuxvideo.com/smileys_img/60.gif'},
    {'text' : ':diable:', 'link' : '//image.jeuxvideo.com/smileys_img/61.gif'},
    {'text' : ':gni:', 'link' : '//image.jeuxvideo.com/smileys_img/62.gif'},
    {'text' : ':play:', 'link' : '//image.jeuxvideo.com/smileys_img/play.gif'},
    {'text' : ':desole:', 'link' : '//image.jeuxvideo.com/smileys_img/65.gif'},
    {'text' : ':spoiler:', 'link' : '//image.jeuxvideo.com/smileys_img/63.gif'},
    {'text' : ':merci:', 'link' : '//image.jeuxvideo.com/smileys_img/58.gif'},
    {'text' : ':svp:', 'link' : '//image.jeuxvideo.com/smileys_img/59.gif'},
    {'text' : ':sors:', 'link' : '//image.jeuxvideo.com/smileys_img/56.gif'},
    {'text' : ':salut:', 'link' : '//image.jeuxvideo.com/smileys_img/42.gif'},
    {'text' : ':rechercher:', 'link' : '//image.jeuxvideo.com/smileys_img/38.gif'},
    {'text' : ':hello:', 'link' : '//image.jeuxvideo.com/smileys_img/29.gif'},
    {'text' : ':up:', 'link' : '//image.jeuxvideo.com/smileys_img/44.gif'},
    {'text' : ':bye:', 'link' : '//image.jeuxvideo.com/smileys_img/48.gif'},
    {'text' : ':gne:', 'link' : '//image.jeuxvideo.com/smileys_img/51.gif'},
    {'text' : ':lol:', 'link' : '//image.jeuxvideo.com/smileys_img/32.gif'},
    {'text' : ':dpdr:', 'link' : '//image.jeuxvideo.com/smileys_img/49.gif'},
    {'text' : ':dehors:', 'link' : '//image.jeuxvideo.com/smileys_img/52.gif'},
    {'text' : ':hs:', 'link' : '//image.jeuxvideo.com/smileys_img/64.gif'},
    {'text' : ':banzai:', 'link' : '//image.jeuxvideo.com/smileys_img/70.gif'},
    {'text' : ':bave:', 'link' : '//image.jeuxvideo.com/smileys_img/71.gif'},
    {'text' : ':pf:', 'link' : '//image.jeuxvideo.com/smileys_img/pf.gif'},
    {'text' : ':cimer:', 'link' : '//image.jeuxvideo.com/smileys_img/cimer.gif'},
    {'text' : ':ddb:', 'link' : '//image.jeuxvideo.com/smileys_img/ddb.gif'},
    {'text' : ':pave:', 'link' : '//image.jeuxvideo.com/smileys_img/pave.gif'},
    {'text' : ':objection:', 'link' : '//image.jeuxvideo.com/smileys_img/objection.gif'},
    {'text' : ':siffle:', 'link' : '//image.jeuxvideo.com/smileys_img/siffle.gif'}
];

(function() {
    'use strict';
    var classes = document.getElementsByClassName("usertext-body");
    for (var i = 0; i < classes.length; i++) {
        var post = classes[i];
        post.innerHTML = post.innerHTML.replace(/<a href="(http.+?noelshack\.com.+?)">.+?<\/span>.+?<\/a>/g, '<a href="$1"><img width=68 src="$1"/></a>');
        for (var j = 0; j < smileys.length; j++) {
            var smiley = smileys[j];
            post.innerHTML = post.innerHTML.replace(smiley.text, '<img src = "' + smiley.link + '" alt="' + smiley.text + '"/>');
        }
    }
})();