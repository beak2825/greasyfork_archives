// ==UserScript==
// @name        Literotica Reader
// @namespace   tuktuk3103@gmail.com
// @description Typographical elements used to achieve an attractive, distinctive appearance that indicates finesse, elegance and sophistication
// @include     https://www.literotica.com/s/*
// @version     1
// @grant       none
// @icon        https://speedy.literotica.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/406123/Literotica%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/406123/Literotica%20Reader.meta.js
// ==/UserScript==

//Whitespace margin provides visual breathing room for the eye that makes it look more approachable
document.querySelector('.x-r15.b-story-body-x').setAttribute('style', 'max-width:80%;');
document.querySelector('.x-r15.b-story-body-x').style.marginLeft = "5%";

document.getElementById("w").setAttribute('style', 'min-width:80%;');
document.getElementById("w").style.marginLeft = "5%";

document.getElementById("root").setAttribute('style', 'min-width:80%;');
document.getElementById("root").style.marginLeft = "5%";

//Generous vertical space separates lines of text that improves readability by almost 20%
document.querySelector('p').setAttribute('style', 'line-height:1.6;');

//Removes Ads
document.getElementById("b-top").remove();