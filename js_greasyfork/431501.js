// ==UserScript==
// @name         Custom TierMaker List
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use to define tier lists for categories that wouldn't otherwise merit a template.
// @author       Lendri Mujina
// @match        https://tiermaker.com/create/custom-through-developer-tools-125665
// @match        https://tiermaker.com/create-xy/custom-through-developer-tools-125665
// @icon         https://www.google.com/s2/favicons?domain=tiermaker.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431501/Custom%20TierMaker%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/431501/Custom%20TierMaker%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';
function id(el,id) {return el.getElementById(id);}
function tg(el,tag) {return el.getElementsByTagName(tag);}

window.addEventListener('load', function() {
//------------------
//Define image lists in this area. Use the default list as an example of how to format them.
//------------------

var defaultList1 =["Default List 1", //Use this first item to give the list a display name. If you don't want one, use "".
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item00png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item01png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item02png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item03png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item04png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item05png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item06png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item07png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item08png.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item09png.png"
];

var defaultList2 =["Default List 2",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item0Apng.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item0Bpng.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item0Cpng.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item0Dpng.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item0Epng.png",
    "https://tiermaker.com/images/chart/chart/custom-through-developer-tools-125665/item0Fpng.png"
];


//------------------
//Select which list to use here.
//------------------

var imgURL = defaultList1;

//------------------

var containerTag = "";
var titleType = "";

var currentURL = window.location.href;
if (currentURL == "https://tiermaker.com/create-xy/custom-through-developer-tools-125665"){
containerTag = "inner-draggables-container";
titleType = " Alignment Chart";
}
else {
containerTag = "create-image-carousel";
titleType = " Tier List Maker"
}
var imgTagList = "";
for (let i = 1; i < imgURL.length; i++) {
	imgTagList += '<div class="character" id="' + (i) + '\" style=\'background-image: url(\"' + imgURL[i] + '\");\'></div>';
}
var entriesBox = id(document,containerTag);
    console.log(entriesBox);
var openingTage = '<div></div>'
entriesBox.innerHTML = '<div></div>' + imgTagList + '</div>';
tg(document,"h1")[0].innerHTML = imgURL[0] + titleType;
}, false);
})();