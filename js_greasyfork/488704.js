// ==UserScript==
// @name         Wikipedia Spoiler Hider
// @namespace    https://en.wikipedia.org/
// @version      2.0
// @author       xdpirate
// @license      GPLv3
// @description  Attempts to hide spoilers on Wikipedia
// @match        http://en.wikipedia.org/wiki/*
// @match        https://en.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488704/Wikipedia%20Spoiler%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/488704/Wikipedia%20Spoiler%20Hider.meta.js
// ==/UserScript==

let wshGlobalCounter = 0;
let wshToggleText = "Toggle potential spoilers";
let wshKeywords = ["plot", "plots", "story", "stories", "storyline", "storylines", "synopsis", "synopses",
               "plot summary", "plot summaries", "plot synopsis", "plot synopses", "characters",
               "main characters", "gameplay and story", "gameplay and stories", "gameplay and storyline",
               "gameplay and storylines", "gameplay and story line", "gameplay and story lines",
               "plot and setting", "plots and setting", "plot and settings", "plots and settings",
               "series synopsis", "series synopses", "story and characters", "stories and characters",
               "setting and characters", "settings and characters", "plot and characters",
               "plots and characters", "playable characters", "enemy characters", "setting", "settings",
               "plot overview", "characters and organizations", "scenario", "scenarios",
               "cast and characters", "summary and plot", "character/game list", "non-playable characters",
               "bosses", "other characters", "main player characters", "secondary player characters",
               "antagonist", "antagonists", "significance of the title", "protagonist", "protagonists",
               "ending", "endings", "episodes", "premise", "the cases", "recurring characters",
               "story and setting", "themes and analysis", "trivia", "summary of the film", "story development",
               "main cast and characters", "film content", "secondary characters", "minor characters",
               "major characters", "guest characters", "postgame features", "episode list"];

let i, dOuter, dInner;
let h2s = document.querySelectorAll("div.mw-content-ltr > h2");
if (h2s.length > 0) {
    for (i = 0; i < h2s.length; i++) {
        dOuter = document.createElement("div");
        dOuter.id = "content_outer_" + i;
        dOuter.className = "content_outer";
        dInner = document.createElement("div");
        dInner.id = "content_inner_" + i;
        dInner.className = "content_inner";
        h2s[i].parentNode.insertBefore(dOuter, h2s[i]);
        dOuter.appendChild(h2s[i]);
        dOuter.appendChild(dInner);

        while (dOuter.nextSibling && dOuter.nextSibling.nodeName.toLowerCase() != "h2") {
            dInner.appendChild(dOuter.nextSibling);
        }
    }
}

let h3s = document.querySelectorAll(".content_inner > h3");
if (h3s.length > 0) {
    let j;
    for (i = 0; i < h3s.length; i++) {
        j = h3s[i].parentNode.id.substr(h3s[i].parentNode.id.lastIndexOf("_")+1);
        dOuter = document.createElement("div");
        dOuter.id = "content_sub_outer_" + j + "_" + i;
        dOuter.className = "content_sub_outer";
        dInner = document.createElement("div");
        dInner.id = "content_sub_inner_" + j + "_" + i;
        dInner.className = "content_sub_inner";
        h3s[i].parentNode.insertBefore(dOuter, h3s[i]);
        dOuter.appendChild(h3s[i]);
        dOuter.appendChild(dInner);

        while (dOuter.nextSibling && dOuter.nextSibling.nodeName.toLowerCase() != "h3") {
            dInner.appendChild(dOuter.nextSibling);
        }
    }
}

parseHeaders("h2 > span", 0);
parseHeaders("h3 > span", 1);

function parseHeaders(queryString, isSmall) {
    let headers = document.querySelectorAll(queryString);
    if (headers.length > 0) {
        let i;
        for (i = 0; i < headers.length; i++) {
            let id = headers[i].innerHTML.trim();
            if (id !== null) {
                if (wshKeywords.indexOf(id.toLowerCase()) != -1) {
                    spoilerize(headers[i].parentNode.parentNode, isSmall);
                }
            }
        }
    }
}

function spoilerize(element, isSmall) {
    let outer = element;
    let inner;

    if (isSmall == 0) {
        inner = element.querySelector("div.content_inner");
    } else {
        inner = element.querySelector("div.content_sub_inner");
    }

    if (inner !== null) {
        inner.setAttribute("style","display: none;");
        inner.setAttribute("id","wphPlot" + wshGlobalCounter++);

        let link;
        link = document.createElement("span");
        link.classList.add("wshLink");
        link.id = "togglePlotLink" + wshGlobalCounter++;
        link.innerHTML = "<b>Toggle potential spoilers</b>";

        GM_addStyle(`
            .wshLink {
                display: inline-block;
                margin-bottom: 10px;
                padding: 5px;
                border: 1px solid;
                border-radius: 5px;
                cursor: pointer;
                user-select: none;
            }
        `);

        link.addEventListener("click", function(){
            setToggle(inner.getAttribute("id"));
        }, true);

        outer.insertBefore(link, inner);
    }
}

function setToggle(divId) {
    let elem=document.getElementById(divId);

    if(elem.style.display=='none') {
        elem.style.display='block';
    } else {
        elem.style.display='none';
    }
}
