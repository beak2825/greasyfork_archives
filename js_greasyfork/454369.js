// ==UserScript==
// @name         ZyBooks Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically click through participation activities on Zybooks
// @author       ...
// @match        https://*.zybooks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454369/ZyBooks%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/454369/ZyBooks%20Auto%20Clicker.meta.js
// ==/UserScript==

var done = false;
function zy(){
    var e = Array.from(document.getElementsByClassName("zb-button"));
    var s = Array.from(document.getElementsByClassName("title"));
    var c = Array.from(document.getElementsByClassName("speed-control"));
    var r = Array.from(document.getElementsByClassName("zb-radio-button"));
    var l = Array.from(document.getElementsByClassName("zb-chevron"));
    e.forEach((i)=>{
        if (i.ariaLabel == "Play"){
            i.click();
        }
    });

    s.forEach((i)=>{
        if (i.innerHTML == "Start"){
            i.click();
        }
    });

    c.forEach((i)=>{
        if (i.children[0].children[0].value=="false"){
            i.children[0].children[0].click();
        }
    });
    if (!done){
        var count = 0;
        l.forEach((i)=>{
            if (i.ariaLabel == "Question completed"){
                count++;
            }
        });
        if (count > 1){
            done = true;
            r.forEach((i)=>{
                i.children[1].click();
            });
        }
    }
}

setInterval(zy,1000);
