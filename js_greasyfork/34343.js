// ==UserScript==
// @name         Google Apps
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  Add some Google Apps to your Browser
// @author       Nilsksk
// @match        https://www.google.de/
// @match        https://www.google.de/*
// @match        https://www.google.com/
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34343/Google%20Apps.user.js
// @updateURL https://update.greasyfork.org/scripts/34343/Google%20Apps.meta.js
// ==/UserScript==

// Create Div for all Quick App links and images
var container = document.createElement("div");

// Create Image tags
var image_youtube = document.createElement('img');
image_youtube = new Image(25, 25);
image_youtube.setAttribute('src', 'https://lh3.googleusercontent.com/Ned_Tu_ge6GgJZ_lIO_5mieIEmjDpq9kfgD05wapmvzcInvT4qQMxhxq_hEazf8ZsqA=w300');

var image_translate = document.createElement('img');
image_translate = new Image(25, 20);
image_translate.setAttribute('src', 'https://lh3.googleusercontent.com/ZrNeuKthBirZN7rrXPN1JmUbaG8ICy3kZSHt-WgSnREsJzo2txzCzjIoChlevMIQEA=w300');

var image_gmail = document.createElement('img');
image_gmail = new Image(25, 20);
image_gmail.setAttribute('src', 'https://image.flaticon.com/icons/svg/281/281769.svg');

var image_drive = document.createElement('img');
image_drive = new Image(25, 20);
image_drive.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png');


// Create Link tags
var link_youtube = document.createElement("a");
link_youtube.setAttribute('href', 'https://www.youtube.com/?gl=DE');

var link_translate = document.createElement("a");
link_translate.setAttribute('href', 'https://translate.google.de/?hl=de&tab=iT');

var link_gmail = document.createElement("a");
link_gmail.setAttribute('href', 'https://www.google.com/gmail/');

var link_drive = document.createElement("a");
link_drive.setAttribute('href', 'https://www.google.com/drive/');


// Add to the Link tags the Image tags
link_youtube.appendChild(image_youtube);
link_translate.appendChild(image_translate);
link_gmail.appendChild(image_gmail);
link_drive.appendChild(image_drive);

// Add the combined Image and Link Tag to the container
container.appendChild(link_youtube);
container.appendChild(link_translate);
container.appendChild(link_gmail);
container.appendChild(link_drive);

// Get Element to add Quick Apps to browser window
var div = document.getElementsByClassName("o3j99 qarstb")[0];

// Append style to container and add it to the the Browser window
container.style="text-align: center";
div.appendChild(container);