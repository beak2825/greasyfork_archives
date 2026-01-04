// ==UserScript==
// YOU MUST BE USING HTTPS:// because you should be, anyway.
// @name         FetLife right-click save image
// @namespace    Invertex
// @version      0.12
// @description  Allows right-click save-as of Fetlife images.
// @match        https://fetlife.com/users/*/pictures/*
// @copyright    Invertex
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/370874/FetLife%20right-click%20save%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/370874/FetLife%20right-click%20save%20image.meta.js
// ==/UserScript==

var transClass = "fl-transparent-facade";
var disableInteractionClass = "fl-disable-interaction";

$(document).ready(function()
{
    var imgLinks = document.getElementsByClassName(transClass);

    if(imgLinks.length > 0)
    {
        var imgLink = imgLinks[0];
        var childImg = imgLink.getElementsByTagName('img')[0];

        if(imgLink.classList.contains(transClass))
        {
           imgLink.classList.remove(transClass);
           if(childImg.classList.contains(disableInteractionClass))
           {
               childImg.classList.remove(disableInteractionClass);
           }
           else
           {
               imgLink.href = childImg.src;
           }
        }
        else
        {
            imgLink.href = childImg.src;
        }
    }
});