// ==UserScript==
// @name         Spinners
// @namespace    https://mapranktimes.vercel.app/
// @version      0.2
// @description  Add spinners
// @author       sometimes
// @match        https://osu.ppy.sh/*
// @icon         https://mapranktimes.vercel.app/favicon-32x32.png
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/459809/Spinners.user.js
// @updateURL https://update.greasyfork.org/scripts/459809/Spinners.meta.js
// ==/UserScript==

const correctUrl = () => window.location.href.includes('beatmapsets') && !window.location.href.includes('s=qualified');
let shownMessage = false;
let finishedSetUp = false;
const beatmaps = {};
const beatmapSets = {};

const getBeatmaps = async (apiKey) => {
    let url = `https://osu.ppy.sh/api/get_beatmaps?k=${apiKey}&m=0&since=${new Date(Date.now() - 7 * 24 * 3600000).toISOString()}`;
    let response = await fetch(url);
    let data = await response.json();
    if (data.length >= 500) {
        url = `https://osu.ppy.sh/api/get_beatmaps?k=${apiKey}&m=0&since=${data[data.length - 1].approved_date}`
        response = await fetch(url);
        let data2 = await response.json();
        data = data.concat(data2);
    }
    for (const beatmap of data) {
        if (!(beatmap.beatmapset_id in beatmapSets)) {
            beatmapSets[beatmap.beatmapset_id] = [];
        }
        if (!(beatmap.beatmap_id in beatmaps)) {
            beatmapSets[beatmap.beatmapset_id].push(parseInt(beatmap.count_spinner));
            beatmaps[beatmap.beatmap_id] = parseInt(beatmap.count_spinner);
        }
    }
}

const getApiKey = async () => {
    let apiKey = await GM.getValue("apiKey");
    if ((apiKey == null || apiKey == "") && !shownMessage) {
        apiKey = prompt("Spinners! Please enter api key (from https://osu.ppy.sh/p/api/):");
        shownMessage = true;
    }
    return apiKey;
}

const updateBeatsetPanels = (beatmapSetNodes) => {
    for (const beatmapSetNode of beatmapSetNodes) {
        const beatmapSetId = beatmapSetNode.nextSibling.href.split('/').pop();
        if (beatmapSetId in beatmapSets) {
            const beatmaps = beatmapSets[beatmapSetId];
            beatmapSetNode.style.opacity = 1;
            beatmapSetNode.children[0].children[1].innerHTML = `${beatmaps.filter(spinners => spinners > 0).length} / ${beatmaps.length}`;
            beatmapSetNode.children[0].children[0].children[0].classList.remove("fa-heart");
            beatmapSetNode.children[0].children[0].children[0].classList.add("fa-spinner");
            beatmapSetNode.children[0].children[0].children[0].style.fontWeight = 900;
        }
    }
}

const onBeatmapSetInfoChange = (mutations) => {
    if (!correctUrl()) return;
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
                                text.innerText = beatmaps[beatmapId];
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

const onBeatmapSetsChange = (mutations) => {
    if (!correctUrl()) return;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                const beatmapSetNodes = node.querySelectorAll(".beatmapset-panel__info-row--stats");
                updateBeatsetPanels(beatmapSetNodes);
            });
        }
    }
}

const setUp = async () => {
    if (finishedSetUp) return;
    const apiKey = await getApiKey();
    if (apiKey == null || apiKey =="") return;
    try {
        await getBeatmaps(apiKey);
        await GM.setValue("apiKey", apiKey);
    } catch {
        return;
    }

     const beatmapSetNodes = document.querySelectorAll(".beatmapset-panel__info-row--stats");
    updateBeatsetPanels(beatmapSetNodes);

    const beatmapSetsDiv = document.querySelector(".beatmapsets__items");
    const beatmapSetsObserver = new MutationObserver(onBeatmapSetsChange);
    beatmapSetsObserver.observe(beatmapSetsDiv, {childList: true});

    const beatmapSetInfoObserver = new MutationObserver(onBeatmapSetInfoChange);
    beatmapSetInfoObserver.observe(document.body, {childList: true});
    finishedSetUp = true;
}

(async function() {
    'use strict';

    if (correctUrl()) {
        waitForKeyElements(".beatmapsets", () => {
            setUp();
        });
    } else {
        if (window.onurlchange === null) {
            window.addEventListener('urlchange', () => {
                if (correctUrl()) {
                    setUp();
                }
            });
        }
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