// ==UserScript==
// @name         ZyBooks Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically click through participation activities on Zybooks
// @author       ZyBooks Auto Clicker
// @match        https://*.zybooks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455546/ZyBooks%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/455546/ZyBooks%20Auto%20Clicker.meta.js
// ==/UserScript==

let adone = false;
let tdone = false;
var e;
var s;
var c;
var a;
var f;
var t;
function zy(){
    // Slideshow play
    e = Array.from(document.getElementsByClassName("zb-button"));
    // start button
    s = Array.from(document.getElementsByClassName("title"));
    // 2x speed button
    c = Array.from(document.getElementsByClassName("speed-control"));

    // Show answer on text answer
    var temp = a;
    a = Array.from(document.getElementsByClassName("show-answer-button"));

    if (!a.every((val, index) => val === temp[index])){
        adone = false;
        tdone = false;
    }
    //forfeitted answers
    f = Array.from(document.getElementsByClassName("forfeit-answer"));
    // text answer box
    t = Array.from(document.getElementsByClassName("ember-text-area"));

    // Start Slideshow
    e.forEach((i)=>{
        if (i.ariaLabel == "Play"){
            i.click();
        }
    });
    //Continue slideshow
    s.forEach((i)=>{
        if (i.innerHTML == "Start"){
            i.click();
        }
    });
    // Click 2x speed
    c.forEach((i)=>{
        if (i.children[0].children[0].value=="false"){
            i.children[0].children[0].click();
        }
    });

    // Double click show answer
    if (!adone && a.length > 0){
        a.forEach((i)=>{
            i.click();
            i.click();
        });
        adone = true;
    }

    // Enter answer and click
    if (adone && !tdone){
        if (f.length == t.length){
            let count = 0;
            t.forEach((i)=>{
                i.value = f[count].innerHTML.trim();
                count++;
            });
            s.forEach((i)=>{
        if (i.innerHTML == "Check"){
            i.click();
        }
    });
        tdone = true;
        }
    }
}

setInterval(zy,1000);