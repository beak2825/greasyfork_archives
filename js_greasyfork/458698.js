// ==UserScript==
// @name         Animebytes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add format icon
// @author       Jariok
// @match        https://animebytes.tv/*
// @icon         https://pbs.twimg.com/profile_images/1079461625982267398/AEGkeD97_400x400.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458698/Animebytes.user.js
// @updateURL https://update.greasyfork.org/scripts/458698/Animebytes.meta.js
// ==/UserScript==

(function() {
    'use strict';


    /******************************************************************************************/

    // 20x20 image
    const seeding = "https://mei.animebytes.tv/9As60YXkGot.gif";


    const tags = [
        {"aa":"aa", "bb":"bb"},
    ]


    /******************************************************************************************/


    const seedingCheck = (div, tag_name) => {
        let span = document.createElement("span")
        div.innerHTML = div.innerHTML+= "    <img style='vertical-align: middle; padding-right: 0.25em;' src='"+ seeding +"'>";
    }




    /* movie page */
    document.querySelectorAll(".group_torrent").forEach((d) => {

        let info_div = d.querySelector("td").querySelectorAll("a")[d.querySelector("td").querySelectorAll("a").length-1]

        for (let i=0; i<tags.length; i++) {

            // Snatched
            if (info_div.getAttribute('class') == ' snatched-torrent') {
                seedingCheck(info_div, tags[i].name)
            }
        }
    })













})();