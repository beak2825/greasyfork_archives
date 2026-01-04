// ==UserScript==
// @name         Map Rank Times
// @namespace    https://mapranktimes.vercel.app/
// @version      0.5
// @description  Add rank time to qualified maps
// @author       sometimes
// @match        https://osu.ppy.sh/*
// @icon         https://mapranktimes.vercel.app/favicon-32x32.png
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/454830/Map%20Rank%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/454830/Map%20Rank%20Times.meta.js
// ==/UserScript==

let beatmapSets = null;
let beatmaps = null;

const listToDict = (data) => data == null ? null : Object.assign({}, ...data.map((x) => ({[x.id]: x})));
const mapsetsListToMapsDict = (data) => {
    const beatmaps = {}
    data.forEach(beatmapSet => beatmapSet.beatmaps.forEach(beatmap => {beatmaps[beatmap.id] = beatmap}));
    return beatmaps;
}

const localBeatmapSets = listToDict(JSON.parse(localStorage.getItem("beatmapSets")));
if (localBeatmapSets != null) {
    beatmaps = mapsetsListToMapsDict(JSON.parse(localStorage.getItem("beatmapSets")));
}

let finishedSetUp = false;

const correctUrl = () => window.location.href.includes('beatmapsets') && window.location.href.includes('s=qualified');

const getBeatmapSets = async () => {
    const response = await fetch("https://mapranktimes.vercel.app/api/beatmapsets");
    const data = await response.json();

    if (data.length > 0) {
        localStorage.setItem("beatmapSets", JSON.stringify(data));
        beatmaps = mapsetsListToMapsDict(data);
        return listToDict(data);
    }
    return null;
};


function updateBeatsetPanels(beatmapSetNodes) {
    for (const beatmapSetNode of beatmapSetNodes) {
        const beatmapSetId = beatmapSetNode.nextSibling.href.split('/').pop();
        if (beatmapSetId in beatmapSets) {
            const timeNode = beatmapSetNode.querySelector(".js-tooltip-time");
            if (timeNode.style.color == "#FFDD55") {
                continue;
            }
            const beatmapSet = beatmapSets[beatmapSetId];
            beatmapSetNode.style.opacity = 1;
            timeNode.style.color = "#FFDD55";
            timeNode.style.fontWeight = 700;
            const rankEarly = beatmapSet.rank_early ? "*" : "";
            timeNode.innerHTML = new Date(beatmapSet.rank_date).toLocaleString("default", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            }) + rankEarly;
            const parentNode = timeNode.parentNode.parentNode;
            if (parentNode.children.length == 5) {
                for (let i = 0; i < 2; i++) {
                    parentNode.removeChild(parentNode.children[0]);
                }
            }
            parentNode.children[0].children[1].innerHTML = `${beatmapSet.beatmaps.filter((beatmap) => beatmap.spin > 0).length} / ${beatmapSet.beatmaps.length}`;
            parentNode.children[0].children[0].children[0].classList.remove("fa-heart");
            parentNode.children[0].children[0].children[0].classList.add("fa-spinner");
            parentNode.children[0].children[0].children[0].style.fontWeight = 900;
        }
    }
}

function onBeatmapSetsChange(mutations) {
    if (!correctUrl() || beatmapSets == null) return;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                const beatmapSetNodes = node.querySelectorAll(".beatmapset-panel__info-row--stats");
                updateBeatsetPanels(beatmapSetNodes);
            });
        }
    }
}

function onBeatmapSetInfoChange(mutations) {
    if (!correctUrl() || beatmapSets == null) return;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                const beatmapLinkNodes = node.querySelectorAll(".beatmaps-popup-item");
                if (beatmapLinkNodes.length > 0) {
                    if (beatmapLinkNodes[0].querySelector(".beatmap-list-item").children[0].children.length == 1) {
                        for (const beatmapLinkNode of beatmapLinkNodes) {
                            const beatmapId = beatmapLinkNode.href.split('/').pop();
                            const beatmapInfo = beatmapLinkNode.querySelector(".beatmap-list-item");
                            if (beatmapId in beatmaps) {
                                const text = document.createElement("span");
                                text.innerText = beatmaps[beatmapId].spin;
                                text.style.fontSize = "12px";
                                beatmapInfo.children[0].appendChild(text);
                                beatmapInfo.children[0].style.columnGap = "3px";
                                beatmapInfo.children[0].style.width = "2em";
                                beatmapInfo.children[0].style.justifyContent = "left";
                            }
                        }
                    }
                }
            });
        }
    }
}

function updatePage() {
    if (!correctUrl() || beatmapSets == null) return;
    const beatmapSetNodes = document.querySelectorAll(".beatmapset-panel__info-row--stats");
    updateBeatsetPanels(beatmapSetNodes);
}

function onPageLoad() {
    updatePage();

    const beatmapSetsDiv = document.querySelector(".beatmapsets__items");
    const beatmapSetsObserver = new MutationObserver(onBeatmapSetsChange);
    beatmapSetsObserver.observe(beatmapSetsDiv, {childList: true});

    const beatmapSetInfoObserver = new MutationObserver(onBeatmapSetInfoChange);
    beatmapSetInfoObserver.observe(document.body, {childList: true});
}

async function setUp() {
    if (localBeatmapSets != null) {
        // load local first, then update with data from server
        beatmapSets = localBeatmapSets;
        waitForKeyElements (".beatmapsets", onPageLoad);
        let updatedBeatmapSets = null;
        while(updatedBeatmapSets == null) {
            updatedBeatmapSets = await getBeatmapSets();
            if (updatedBeatmapSets == null) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        beatmapSets = updatedBeatmapSets;
        updatePage();
    } else {
        while(beatmapSets == null) {
            beatmapSets = await getBeatmapSets();
            if (beatmapSets == null) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        waitForKeyElements (".beatmapsets", onPageLoad);
    }
}

function onUrlChange() {
    if (!correctUrl()) return;
    if (finishedSetUp) {
        updatePage();
    } else {
        setUp();
        finishedSetUp = true;
    }
}

(function() {
    'use strict';

    if (window.onurlchange === null) {
        // feature is supported
        window.addEventListener('urlchange', onUrlChange);
    }

    // Your code here...
    if (correctUrl()) {
        setUp();
    }
})();

// copied from https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}