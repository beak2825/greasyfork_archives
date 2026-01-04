// ==UserScript==
// @name        Embed Dailymotion
// @match       *://www.dailymotion.com*/*
// @grant       none
// @version     1.0
// @author      elor1
// @description Redirects Dailymotion to embedded videos
// @icon        https://www.google.com/s2/favicons?domain=www.dailymotion.com
// @namespace https://greasyfork.org/users/1012230
// @downloadURL https://update.greasyfork.org/scripts/458256/Embed%20Dailymotion.user.js
// @updateURL https://update.greasyfork.org/scripts/458256/Embed%20Dailymotion.meta.js
// ==/UserScript==

function test(url){
    return !!url.match(/^(|http(s?):\/\/)(|www.)dailymotion.com\/video(\/.*|$)/gim);
}

function getNewPage(url){
    const myArray = url.split("com");
    return myArray[0] + "com/embed" + myArray[1];
}

if(test(window.location.href)){window.location.assign(getNewPage(window.location.href));}