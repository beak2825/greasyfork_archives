// ==UserScript==
// @name         PH! smiley adder
// @namespace    http://prohardver.hu/tag/ursache.html_2
// @version      1.0
// @description  A privát üzenet küldéséhez extra smileyk hozzáadása
// @author       Ursache
// @include      /^http://(prohardver|itcafe|gamepod|logout|mobilarena)\.hu/muvelet/privat/uj\.php*/
// @downloadURL https://update.greasyfork.org/scripts/10017/PH%21%20smiley%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/10017/PH%21%20smiley%20adder.meta.js
// ==/UserScript==


document.body.getElementsByClassName("buttons")[3].appendChild(document.createElement("br"));
addSmiley("http://theinfounderground.com/smf/Smileys/jewset/gibs.gif", "penz", "penz");
addSmiley("http://logout.hu/dl/upc/2012-06/99163_99163_46817_trollface_2_8_8.png", "troll", "troll");

function addSmiley(src, alt, title)
{
    var smileyBar = document.body.getElementsByClassName("buttons")[3];
    var kep = document.createElement("img");
    kep.setAttribute("src", src);
    kep.setAttribute("alt", alt);
    kep.setAttribute("title", title);
    kep.setAttribute("onClick", "rtif_CodeSmiley(this,'[IMG:" + src + "][/IMG]');");
    smileyBar.appendChild(kep);
}