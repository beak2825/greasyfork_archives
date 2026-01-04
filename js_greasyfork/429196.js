// ==UserScript==
// @name         Kitsun - Hibernated Items in Deck Progress
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a progress bar for hibernated items and rescales accordingly
// @author       ccookf
// @include      https://kitsun.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/429196/Kitsun%20-%20Hibernated%20Items%20in%20Deck%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/429196/Kitsun%20-%20Hibernated%20Items%20in%20Deck%20Progress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('urlchange', (info) => {
        var regex = /^https:\/\/kitsun.io\/deck\/\w*$/g;
        if (!info.url.match(regex)) return;

    //This is a really lazy workaround for dealing with how the page loads
    setTimeout(function(){
        //General deck information and progress values
        var total, hibernated;
        var ranks = [0, 0, 0, 0, 0]; //master, expert, intermediate, novice, beginner

        var actionWrapper = document.getElementsByClassName("action_wrapper")[0]; //I think this is unique

        //Navigate to the child div with the hover_tooltip class
        var actionDataElements = actionWrapper.firstChild.children[1].children;
        total = Number(actionDataElements[0].innerText.split(' ')[1]);
        hibernated = Number(actionDataElements[1].innerText.split(' ')[1]);

        //Fiddle with progress bars
        var progress = document.getElementsByClassName("progress")[0];
        for (let i = 0; i < ranks.length; i++) {
            //get the item count in the rank
            ranks[i] = Number(progress.children[i].firstChild.innerText.split(' ')[0]);

            //let's just replace all of the tooltip while we're at it
            progress.children[i].firstChild.innerHTML = `${ranks[i]} / ${total} - <b>${(100*ranks[i]/total).toFixed(2)}%</b><div class="arrow_down"></div>`;
            //and rescale the width of the div for each rank
            progress.children[i].cssText += `width:${(100*ranks[1]/total).toFixed(2)}%;`;
        }

        //Making the new hibernated bar
        var hibernatedBar = document.createElement("DIV");
        //Originally this was left:50%, but I don't understand css enough to get why so I made a hacky close enough fix
        var tooltipCSS = "background:var(--dark-card);border-radius:5px;color:white;display:none;left:-25%;padding:10px;position:absolute;text-align:center;top:-50px;transform:none;width:200px;"
        hibernatedBar.classList.add("prog");
        hibernatedBar.style.cssText += `background:var(--dark-card);width:${100*hibernated/total}%;border-radius:10px;float:left;height:10px;position:relative;`;
        hibernatedBar.innerHTML = `<div id="hibernatedTooltip" class="hovertooltip" style="${tooltipCSS}">${hibernated} / ${total} - <b>${(100*hibernated/total).toFixed(2)}%</b><div class="arrow_down"></div>`;
        hibernatedBar.onmouseover = ()=>{
            var tip = document.getElementById("hibernatedTooltip");
            tip.style.display = "block";
        }
        hibernatedBar.onmouseout = ()=>{
            var tip = document.getElementById("hibernatedTooltip");
            tip.style.display = "none";
        }

        //Insert our new hibernated bar before master and we're done! I hope...
        //progress.insertBefore(hibernatedBar, progress.firstChild);
        progress.appendChild(hibernatedBar);
    }, 250);
    });
})();