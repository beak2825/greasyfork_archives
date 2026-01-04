// ==UserScript==
// @name         DatDrop Script
// @namespace    http://tampermonkey.net/
// @version      Alpha 1
// @description  A script that instantly joins a DatDrop battle.
// @author       Anonymous
// @match        datdrop.com/battle/*
// @include      https://*.twitch.tv/*
// @include      https://discord.com/channels/*
// @include      https://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430975/DatDrop%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/430975/DatDrop%20Script.meta.js
// ==/UserScript==


// Instanly Press Join Button

function elementReady(selector) {
    return new Promise((resolve, reject) => {
        let el = document.querySelector(selector);
        if (el) {resolve(el);}
        new MutationObserver((mutationRecords, observer) => {
            Array.from(document.querySelectorAll(selector)).forEach((element) => {
                resolve(element);
                observer.disconnect();
            });
        })
            .observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

//test: elementReady("._1Bnoiqx5RWwAo_UZSctA9h").then((e) => console.log(e));

async function autoJoin() {
    const BUTTON = await elementReady("._1cMwWpiLo7AUn6_T2moG91");
    const SPONSORED = elementReady("._1Bnoiqx5RWwAo_UZSctA9h");

    // enters the battle after creating join button
    BUTTON.click();
    console.log(SPONSORED);
}

autoJoin();

async function checkSponsored() {
    const SPONSORED = await elementReady("._1Bnoiqx5RWwAo_UZSctA9h");
    let isFree = SPONSORED.title.includes("-100%");

    if(isFree) {
        autoJoin();
    }
}

checkSponsored();

// Detects https://datdrop.com/battle/* link and open it.

const openLinks = () => {
  let array = [];
  let links = document.getElementsByTagName("a");
  for(let i=0, max=links.length; i<max; i++) {
    array.push(links[i].href);

    if (document.URL.includes("twitch.tv")) {
      const match = array.find(value => /datdrop.com\/battle/gi.test(value));
        console.log(match);

          if(match !== undefined){
            window.open(match, "_blank");
            clearInterval(retry);
            break
      };
    };
  };
};

let retry = setInterval(openLinks, 1);