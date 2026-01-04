// ==UserScript==
// @name         show youtube's video date behind subscription button
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  show youtube's video date behind subscription button.
// @author       You
// @match        *://*.youtube.com/*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457478/show%20youtube%27s%20video%20date%20behind%20subscription%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/457478/show%20youtube%27s%20video%20date%20behind%20subscription%20button.meta.js
// ==/UserScript==
(function() {
    'use strict';

let container = "#container";
let topRow = "#top-row";
let bottomRow = "#bottom-row";
let description = "#description";
let descriptionInner = "#description-inner";
let infoIcontainer= "#info-container";

const separator = /<span[^>]*>/;

const intervalID = setInterval(checkContainer, 300);
function checkContainer(){
    if(document.querySelector(bottomRow)!=null){
        console.log("container loaded");
        clearInterval(intervalID);
        console.log("interval cleared.");
        let viewNum = getViewNum();
        let timeout = setTimeout(function() {
            showDate(viewNum);
        },1000);
    }
}

function getViewNum(){
    return document.querySelector(".style-scope.ytd-watch-metadata#info").innerHTML.split(separator)[1].split(/<\/span>/)[0];
}

function showDate(viewNum){
                let divDate = document.createElement("div");
                let getInnerHTML = document.querySelector(".style-scope.ytd-watch-metadata#info").innerHTML

                console.log("To show date:" + getInnerHTML.split(separator));

                let vdate = getInnerHTML.split(separator)[3].split(/<\/span>/)[0];
                divDate.innerHTML = "<pre><span style=\"font-size:180%;font-weight:bold;\">  " + vdate + "</span>" + "<br /><br />" + "<span style=\"font-size:130%;font-weight:bold;\">           " + viewNum + "</span></pre>";

                console.log("To show date:" + viewNum + "\n" + vdate);

                let Node2insert = document.querySelector(".item.style-scope.ytd-watch-metadata#owner");
                Node2insert.insertBefore(divDate, null);
}

})();