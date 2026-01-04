// ==UserScript==
// @name         Hammerhead Shark Custom Badge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enjoy!
// @author       G1_1777gold
// @match        https://www.nitrotype.com/garage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433094/Hammerhead%20Shark%20Custom%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/433094/Hammerhead%20Shark%20Custom%20Badge.meta.js
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
    node.innerHTML = '<img alt="Scoreboard Top 3" class="profile-badge" src="https://media.discordapp.net/attachments/806335118317846559/892366893170704414/Screen_Shot_2021-09-28_at_7.07.20_AM.png">';
    a[0].insertBefore(node, a[0].childNodes[0]);
}

_bucket_checker_ = setInterval(look_for_bucket, 200);