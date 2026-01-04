// ==UserScript==
// @name         Return Youtube Dislike On Mobile
// @namespace    https://gitlab.com/Dwyriel
// @version      1.3.5
// @description  Return dislikes on youtube mobile page. Uses returnyoutubedislike.com API
// @author       Dwyriel
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        none
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @downloadURL https://update.greasyfork.org/scripts/473533/Return%20Youtube%20Dislike%20On%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/473533/Return%20Youtube%20Dislike%20On%20Mobile.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = "[Return Youtube Dislike On Mobile]";
    const scriptPolicyName = "RYDoM_Policy";
    const API_URL = "https://returnyoutubedislikeapi.com/votes?videoId=";
    const buttonSegmentClass = "ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper";
    const dislikeButtonID = "dislikeButtonID_198wa16df78ms1d";

    let dislikeCache = {};
    let oldURL = "";
    let videoID;
    let fetching = false;

    const config = { attributes: true, childList: true, subtree: true };
    let mutationObserver = new MutationObserver(() => { });

    const getVideoID = () => {
        return (new Proxy(new URLSearchParams(window.location.search), { get: (UrlSearchParams, key) => UrlSearchParams.get(key) })).v;
    }

    const formatedDislikeNumber = () => {
        let dislikes = dislikeCache[videoID];
        let formattedNum = "";
        if (dislikes / 10E8 >= 1)
            formattedNum = `${Math.round(dislikes / 10E8)}B`;
        else if (dislikes / 10E5 >= 1)
            formattedNum = `${Math.round(dislikes / 10E5)}M`;
        else if (dislikes / 1000 >= 1) {
            if (dislikes < 10E3)
                formattedNum += `${Math.floor(dislikes / 1000)}.${Math.floor((dislikes % 1000) / 100)}K`;
            else
                formattedNum = `${Math.round(dislikes / 1000)}K`;
        }
        else
            formattedNum = `${dislikes}`;
        return formattedNum;
    }

    const setInnerHTML = (element, html) => {
        try {
            if (trustedTypes) {
                const trustedTypesPolice = trustedTypes.createPolicy(scriptPolicyName, { createHTML: (string) => string });
                element.innerHTML = trustedTypesPolice.createHTML(html);
            } else {
                element.innerHTML = html;
            }
        } catch (err) {
            console.error(err);
        }
    }

    const modifyDislikeButton = () => { //check explanation at the end of the file
        let buttons = document.getElementsByClassName(buttonSegmentClass)[0].children;
        if (buttons.length == 0)
            return;
        document.getElementById(dislikeButtonID)?.remove();
        let dislikeButton = buttons[1].getElementsByTagName("button")[0];
        dislikeButton.children[0].style = "margin: 0 6px 0 -6px";
        let dislikes = buttons[0].getElementsByClassName("yt-spec-button-shape-next__button-text-content")[0].cloneNode(true);
        dislikes.id = dislikeButtonID;
        dislikeButton.appendChild(dislikes);
        dislikeButton.appendChild(dislikeButton.children[1]);
        let dislikeString = formatedDislikeNumber();
        setInnerHTML(dislikes, dislikeString);
        dislikeButton.style = `width: ${62 + (8 * dislikeString.length)}px !important; padding-left: 14px`;
    }

    let hookObserver = async () => {
        let buttons = document.getElementsByClassName(buttonSegmentClass);
        if (buttons.length > 0 && buttons[0].children != undefined) {
            mutationObserver.disconnect();
            modifyDislikeButton();
            mutationObserver.observe(buttons[0], config);
        }
        else
            await new Promise(() => setTimeout(hookObserver, 100));
    }

    const callback = () => {
        let currURL = window.location.href;
        if (window.location.pathname != "/watch") {
            oldURL = currURL;
            return;
        }
        if (fetching || (oldURL == currURL))
            return;
        fetching = true;
        oldURL = currURL;

        videoID = getVideoID();
        if (typeof videoID != 'string') {
            fetching = false;
            return;
        }

        if (dislikeCache[videoID] != undefined) {
            fetching = false;
            hookObserver();
            return;
        }

        let request = new Request(API_URL + videoID);
        fetch(request).then(response => response.json(), (reason) => { fetching = false; console.error("Couldn't fetch dislikes", reason) }).then(response => {
            console.log(`${scriptName} response from api: \n${JSON.stringify(response)}`);
            dislikeCache[videoID] = response.dislikes;
            fetching = false;
            hookObserver();
        }, (reason) => { fetching = false; console.error("Couldn't fetch dislikes", reason) });
    };

    mutationObserver = new MutationObserver(() => {
        hookObserver();
    });

    const old_pushState = history.pushState;
    history.pushState = function pushState() {
        let origFuncReturn = old_pushState.apply(this, arguments);
        window.dispatchEvent(new Event('historyChanged'));
        return origFuncReturn;
    };

    window.addEventListener('popstate', () => window.dispatchEvent(new Event('historyChanged')));
    window.addEventListener('load', () => callback());
    window.addEventListener('historyChanged', () => {
        mutationObserver.disconnect();
        callback();
    });
})();

/* modifyDislikeButton function explanation

    let buttons = document.getElementsByClassName(buttonSegmentClass)[0].children; //get both like and dislike buttons if they exist
    if (buttons.length == 0)
        return;

    document.getElementById(dislikeButtonID)?.remove(); //remove if it was already created before

    let dislikeButton = buttons[1].getElementsByTagName("button")[0]; //the dislike "button" element
    
    dislikeButton.children[0].style = "margin: 0 6px 0 -6px"; //fix margin to accomodate changes

    let dislikes = buttons[0].getElementsByClassName("yt-spec-button-shape-next__button-text-content")[0].cloneNode(true); //clone the text tag of the like button to be added to the dislike

    dislikes.id = dislikeButtonID; //set custom ID

    dislikeButton.appendChild(dislikes); //append cloned node to dislike button

    dislikeButton.appendChild(dislikeButton.children[1]); //move nodes around to be in the same order as the like button

    let dislikeString = formatedDislikeNumber(); //formats and adds the formated string to the cloned node's inner HTML
    dislikes.innerHTML = dislikeString; 

    dislikeButton.style = `width: ${56 + (8 * dislikeString.length)}px`; //adjust button width based on formated string
*/