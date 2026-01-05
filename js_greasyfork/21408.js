// ==UserScript==
// @name         ChangeElements
// @namespace    http://tampermonkey.net/
// @version      4
// @description  by kallum the bae
// @author       You
// @match        https://www.roblox.com/*
// @match        http://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21408/ChangeElements.user.js
// @updateURL https://update.greasyfork.org/scripts/21408/ChangeElements.meta.js
// ==/UserScript==
var pic = "https://t5.rbxcdn.com/26f20390e9eeb64986d121d7a4c0f565";
var username = "Phil";
var yourname = "wardoo42";
var amount = "72,531";
var userid = "33904052";

function FindByAttributeValue(value)    {
    var All = document.getElementsByTagName('*');
    for (var i = 0; i < All.length; i++)       {
        if (All[i].innerHTML == value) { return All[i]; }
    }
}


function kallum() {
    try {
        var els = FindByAttributeValue("Hello, " + yourname + "!");
        els.innerHTML = "Hello, " + username + "!";

        var profilepic = document.getElementsByClassName("avatar-card-image")[0];
        profilepic.setAttribute("src",pic);

        var profile2 = document.getElementsByClassName("avatar")[0];
        profile2.setAttribute("href","https://www.roblox.com/users/" + userid + "/profile");
    }
    catch(err){

    }

    try {
        var munny = document.getElementById("nav-robux-amount");
        munny.innerHTML = amount;
    }
    catch(err){

    }

    try {
        var profile = document.getElementById("nav-profile");
        profile.setAttribute("href","https://www.roblox.com/users/" + userid + "/profile");
    }
    catch(err){

    }

    try {
        var messages = document.getElementById("nav-message");
        messages.innerHTML= "<span class='icon-nav-message'></span><span>Messages</span><span class='notification-blue ' title='1K+'>1K+</span>"; // Amount of messages you want displayed
    }
    catch(err){

    }

    try {
        var friends = document.getElementById("nav-friends");
        friends.innerHTML= "<span class='icon-nav-message'></span><span>Friends</span><span class='notification-blue ' title='1K+'>1K+</span>"; // Amount of friend requests you want displayed
    }
    catch(err){

    }

    try {
        var profilename = document.getElementsByClassName("text-overflow")[0];
        profilename.setAttribute("href","https://www.roblox.com/users/" + userid + "/profile");
    }

    catch(err){

    }

    try {
        var inv = document.getElementById("nav-inventory");
        inv.setAttribute("href","https://www.roblox.com/users/" + userid + "/inventory");
    }
    catch(err){

    }

    try {
        var robux = document.getElementsByClassName("text-overflow")[0];
        robux.innerHTML = username;
    }
    catch(err){

    }

    try {
        var messagebutton = document.getElementsByClassName("btn-messages")[0];
        messagebutton.parentNode.removeChild(messagebutton);
    }
    catch(err){

    }
    try {
        var joingamebutton = document.getElementsByClassName("btn-join-game")[0];
        joingamebutton.parentNode.removeChild(joingamebutton);
    }
    catch(err){

    }

    try {
        var addfriendbutton = document.getElementsByClassName("btn-friends")[0];
        addfriendbutton.parentNode.removeChild(addfriendbutton);
    }
    catch(err){

    }

    setTimeout(doc_keyUp, 0);
}
kallum();