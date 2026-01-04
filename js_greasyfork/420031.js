// ==UserScript==
// @name         Verified YouTuber Badge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enjoy!
// @author       AlphaTyper
// @match        https://www.nitrotype.com/garage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420031/Verified%20YouTuber%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/420031/Verified%20YouTuber%20Badge.meta.js
// ==/UserScript==



var _bucket_checker_ = null;

function look_for_bucket(){
    var a = document.getElementsByClassName('bucket bucket--f');
    if(a.length != 0 && a.length != undefined){
        add_the_badge(a);
        clearInterval(_bucket_checker_);
    }
}

function add_the_badge(a){
    var node = document.createElement("div");
    node.className = "bucket-media";
    node.innerHTML = '<img alt="Scoreboard Top 3" class="profile-badge" src="https://cdn.discordapp.com/attachments/740590203042791455/798280755897172059/161039533358529036.png">';
    a[0].insertBefore(node, a[0].childNodes[0]);
}

_bucket_checker_ = setInterval(look_for_bucket, 200);