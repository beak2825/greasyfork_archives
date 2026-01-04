// ==UserScript==
// @name          	Khan Hackademy
// @description     Khan Hackademy is a script that gets a full score on every Khan Academy exercise you complete.
// @author			TheTridentGuy (thetridentguy.com)
// @namespace       https://thetridentguy.com
// @license         GPL v3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       Copyright (C) 2025 Aiden Bohlander
// @include         https://khanacademy.org/*
// @include         https://*.khanacademy.org/*
// @version         1.0
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/535071/Khan%20Hackademy.user.js
// @updateURL https://update.greasyfork.org/scripts/535071/Khan%20Hackademy.meta.js
// ==/UserScript==
/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
(() => {
    const fetch_lag = 500;
    const exec_lag = 500;
    const og_stringify = JSON.stringify;
    const $ = (...args) => {return document.querySelector(...args)}
    JSON.stringify = (obj) => {
        if(!obj){return og_stringify(obj)}
        if(obj.operationName == "attemptProblem"){
            console.log("Sneaking into the teachers office...");
            console.log("Grabbed your work: ", obj);
            console.log("Giving you an A...");
            obj.variables.input.completed = true;
            console.log("Mission accomplished, exfiltrating.");
            if(obj.variables.input.attemptNumber == 1){
                setTimeout(() => {
                console.log("Getting you to the next question...");
                $("[data-testid='exercise-skip-button']").click();
                setTimeout(() => {
                    $("[data-testid='exercise-next-question']").click();
                }, exec_lag);
            }, fetch_lag);
            }
        }
        return og_stringify(obj)
    };
    setInterval(() => {
        try{
            let header = $("[data-testid='header-logo']");
            header.innerHTML = "<span style='font-size: x-large;'>Khan Hackademy</span>";
            let donation_link = $("[data-testid='header-donate-link']");
            let new_donation_link = donation_link.cloneNode(true);
            let donation_icon = new_donation_link.firstElementChild.outerHTML;
            new_donation_link.innerHTML = "Star the repo" + donation_icon;
            new_donation_link.href = "https://github.com/TheTridentGuy/KhanHackademy/";
            donation_link.parentElement.replaceChild(new_donation_link, donation_link);
            clearInterval(edit_interval);
        }catch{
        }
    }, 500);
})();
