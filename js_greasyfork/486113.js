// ==UserScript==
// @name        Download VSCO IMG
// @namespace   Violentmonkey Scripts
// @match       https://vsco.co/*/*
// @grant       none
// @version     1.0
// @license     GPLv2
// @author      Flop7534
// @description 31/01/2024, 06:05:50
// @downloadURL https://update.greasyfork.org/scripts/486113/Download%20VSCO%20IMG.user.js
// @updateURL https://update.greasyfork.org/scripts/486113/Download%20VSCO%20IMG.meta.js
// ==/UserScript==

// Find the images on the page, the first *should* be the image we want
images = document.getElementsByTagName("img");
imgurl = "https:" + images[0].srcset.split(',')[0].split('?')[0];

// Create a p tag to hold our download text
paragraph = document.createElement("p")

// Create our link to the image
link = document.createElement("a");
link.href = imgurl
link.text = "Download"

// Place the link inside the p tag
paragraph.append(link)

// Append our p tag to the username's css class - this will probably need to be updated some times
document.getElementsByClassName("css-1sb7dxx")[0].append(paragraph)