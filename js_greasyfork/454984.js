// ==UserScript==
// @name         Clout.cx Username Effect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [client-side]
// @author       clout.cx/9
// @match        *clout.cx/*
// @exclude      *clout.cx/pages/*
// @exclude      *clout.cx/groups/*
// @exclude      *clout.cx/developers*
// @exclude      *clout.cx/directory/*
// @exclude      *clout.cx/messages/*
// @exclude      *clout.cx/settings/*
// @exclude      *clout.help*
// @exclude      *clout.cx/newsfeed/*
// @exclude      *clout.cx/saved/*
// @exclude      *clout.cx/memories/*
// @exclude      *clout.cx/wallet/*
// @exclude      *clout.cx/boosted/*
// @exclude      *clout.cx/static/*
// @exclude      *clout.cx/games/*
// @exclude      *clout.cx/blogs/*
// @homepageURL  https://clout.cx/9
// @icon         https://clout.cx/content/uploads/photos/2021/12/clout_29ca7f99848e1456e01f9e7d76ea930c.png
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/454984/Cloutcx%20Username%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/454984/Cloutcx%20Username%20Effect.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
var a = document.querySelector(".profile-avatar-change"); // check if the profile is our own this div appears only if you own / are an admin of a /user/page/group

if(a)
{

var copystr = document.querySelector('.profile-name-wrapper a').innerHTML;
var username = copystr.trim();
var rainbow = '<span class="rainbowName">';
var fire = '<span id="heliosname">';
var spanend = '</span>';
//
// default rainbow
// document.querySelector(".profile-name-wrapper a").innerText = '' // clears name
// document.querySelector('.profile-name-wrapper a').innerHTML = rainbow + username + spanend;
//
function insertR()
    {
        document.querySelector('.profile-name-wrapper a').innerHTML = rainbow + username + spanend;
    }
function insertF()
    {
        document.querySelector('.profile-name-wrapper a').innerHTML = fire + username + spanend;
    }

var insert = document.querySelector(".about-bio").insertAdjacentHTML('afterbegin', '<button div id="wes">Wes</button>');
var insert2 = document.querySelector(".about-bio").insertAdjacentHTML('afterbegin', '<button div id="helios">Helios</button>');

var xxx = document.getElementById("wes");
xxx.addEventListener("click", insertR, false);

var yyy = document.getElementById("helios");
yyy.addEventListener("click", insertF, false);

}

else

{
console.log("You don't own this profile, script aborting")
}

 })();

// <a href="https://clout.cx/helios"> <span id="heliosname">helios</span></a>
// <a href="https://clout.cx/wes"> <span class="rainbowName">wes</span></a>
// <a href="https://clout.cx/9"> 9</a>
// profile-name-wrapper
// <div class="profile-cover-delete ">
// beta tester: clout.cx/tz