// ==UserScript==
// @name        HitboxTV Twitch Emotes Blatant Copy
// @description Brings Twitch.tv emotes to Hitbox.tv chat
// @include     http://www.hitbox.tv/*
// @include     http://hitbox.tv/*
// @version     0.3
// @namespace https://twitter.com/BitOBytes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4011/HitboxTV%20Twitch%20Emotes%20Blatant%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/4011/HitboxTV%20Twitch%20Emotes%20Blatant%20Copy.meta.js
// ==/UserScript==
window.onload = function ()
{
var style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('type', 'text/css');
style.setAttribute('href', 'http://tehpolecat.com/ffz_ripoff/Stylesheet.css');

var script =document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', 'http://tehpolecat.com/ffz_ripoff/sheetemotes.txt');

var body = document.getElementsByTagName('body')[0];
if (body) {
    body.appendChild(script);
    body.appendChild(style);
}
}
