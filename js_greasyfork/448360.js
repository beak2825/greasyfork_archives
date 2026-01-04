// ==UserScript==
// @name         Top 300 Racer Badge (ERROR!) Don’t use anymore.
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Get The Top 300 Racer Badge In Your garage!
// @author       Hayks Test Group
// @match        https://www.nitrotype.com/garage
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448360/Top%20300%20Racer%20Badge%20%28ERROR%21%29%20Don%E2%80%99t%20use%20anymore.user.js
// @updateURL https://update.greasyfork.org/scripts/448360/Top%20300%20Racer%20Badge%20%28ERROR%21%29%20Don%E2%80%99t%20use%20anymore.meta.js
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
    node.innerHTML = '<img alt="Scoreboard Top 3" class="profile-badge" src="https://www.nitrotype.com/dist/site/images/badges/profile-racer-top300.png">';
    a[0].insertBefore(node, a[0].childNodes[0]);
}

_bucket_checker_ = setInterval(look_for_bucket, 200);