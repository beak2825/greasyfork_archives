// ==UserScript==
// @name         SpecMapFilterIconPopUp
// @namespace    munzee
// @description  create tooltip for special icons filter images
// @version      0.3
// @author       CzPeet
// @match        https://www.munzee.com/specials*
//grant          none
//update         https://greasyfork.org/hu/scripts/375381-specmapfiltericonpopup
// @downloadURL https://update.greasyfork.org/scripts/375381/SpecMapFilterIconPopUp.user.js
// @updateURL https://update.greasyfork.org/scripts/375381/SpecMapFilterIconPopUp.meta.js
// ==/UserScript==

$(document).ajaxSuccess(createPopups);

function createPopups()
{
    var icons = document.querySelectorAll('.filterimg');

    icons.forEach(function(img)
    {
        var att = document.createAttribute("title");
        att.value = img.currentSrc.substring(img.currentSrc.lastIndexOf("/")+1,img.currentSrc.lastIndexOf("."));
        img.setAttributeNode(att);
    });
}