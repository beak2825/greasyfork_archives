// ==UserScript==
// @name         SSH Badge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enjoy!
// @author       G1_1777gold
// @match        https://www.nitrotype.com/garage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433013/SSH%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/433013/SSH%20Badge.meta.js
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
    node.innerHTML = '<img alt="Scoreboard Top 3" class="profile-badge" src="https://media.discordapp.net/attachments/890657434253791335/891850921657651240/Screen_Shot_2021-09-26_at_8.56.47_PM.png">';
    a[0].insertBefore(node, a[0].childNodes[0]);
}

_bucket_checker_ = setInterval(look_for_bucket, 200);