// ==UserScript==
// @name         WUz-Wuz Jumper download
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Auto click dowload button
// @author       John dow
// @match        https://www.wuswus.co/*
// @match        https://wuswus.co/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387048/WUz-Wuz%20Jumper%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/387048/WUz-Wuz%20Jumper%20download.meta.js
// ==/UserScript==

var srcText = "Create download link";

function isInDownloadPage(inText)
{
    var elDoc = document.getElementsByClassName('btext')[0].innerText;
    if (elDoc.includes(inText))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function pressDownloadButton(inText)
{
    var myBtn = document.getElementById('downloadbtn');
    if (myBtn.innerText.includes(inText))
    {
     myBtn.click();
    }
    else
    {
        window.alert("May be the web code is changed!");
    }
}

if (isInDownloadPage(srcText))
{
    pressDownloadButton(srcText);
}