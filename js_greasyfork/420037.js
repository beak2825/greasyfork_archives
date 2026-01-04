// ==UserScript==
// @name         ilikefrenchfries badge/New York
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enjoy!
// @author       AlphaTyper
// @match        https://www.nitrotype.com/garage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420037/ilikefrenchfries%20badgeNew%20York.user.js
// @updateURL https://update.greasyfork.org/scripts/420037/ilikefrenchfries%20badgeNew%20York.meta.js
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
    node.innerHTML = '<img alt="Scoreboard Top 3" class="profile-badge" src="https://cdn.discordapp.com/attachments/787075936448937984/798319822391214130/MANTABOO.png">';
    a[0].insertBefore(node, a[0].childNodes[0]);
}

_bucket_checker_ = setInterval(look_for_bucket, 200);