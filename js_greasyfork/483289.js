// ==UserScript==
// @name         Youtube Video Downloader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license MIT
// @description  download youtube video on the fly
// @author       Original by BjDanny, Remixed by Draconic Studios
// @run-at          document-start
// @match        *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/483289/Youtube%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/483289/Youtube%20Video%20Downloader.meta.js
// ==/UserScript==
'use strict';

function myWindow()
{
    let y = window.location.href.replace("youtube", "youtube5s");
    let myWin = window.open(y,"Download Youtube Video","directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800, height=900");
    myWin.onload = setInterval(clearPage,1000);
}

function clearPage()
{
    try{
        document.querySelectorAll(".col-xs-12")[8].remove();
        document.querySelector("footer").remove();
        document.querySelector("ul").remove();
        document.querySelector(".navbar-header").remove();
        document.querySelector("#logo-icon").remove();
    }
    catch(e)
    {
        return;
    }
}


function createButton()
{
    try{
    let css = document.createElement('style');
    //Thanks GreenSheep3 for the css style
    css.innerHTML = `
    .myButton {
    font-size: 14px;
    font-weight: 300;
    color: #eee;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #555;
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0);
    height: 36px;
    width: 135px;
    padding: 0;
    margin: 8px
    }
    `;
    document.head.appendChild(css);
    let btn = document.createElement("BUTTON");
    btn.className = "myButton";
    btn.id = "mybutton";
    btn.innerHTML = "DOWNLOAD";
    btn.addEventListener("click", myWindow);
    document.querySelector("#owner").appendChild(btn);
    }
    catch(e)
    {
    }
}

document.addEventListener('DOMContentLoaded', ()=>{setInterval(100); setTimeout(createButton, 1000);});