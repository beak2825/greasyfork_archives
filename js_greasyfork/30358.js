// ==UserScript==
// @name         iTunes Cover Caption Image Links
// @namespace    https://greasyfork.org/en/scripts/30358-itunes-cover-caption-image-links
// @version      1.1
// @description  Links the 'X Songs, Y Minutes' caption text below the album cover to an image URL.
// @author       newstarshipsmell
// @include      /https://itunes\.apple\.com/(|\w{2}/)album/.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30358/iTunes%20Cover%20Caption%20Image%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/30358/iTunes%20Cover%20Caption%20Image%20Links.meta.js
// ==/UserScript==

var imageSize = 10000;
var imageURL = document.querySelector('div.l-column > picture > img').src.replace(/268(x0w\.jpg)/, imageSize + '$1');
var imageCaption = document.querySelector('div.product-artwork-caption > p');
imageCaption.innerHTML = '<a href="' + imageURL + '" target="blank_">' + imageCaption.innerHTML + '</a>';