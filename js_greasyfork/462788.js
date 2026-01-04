// ==UserScript==
// @name         Raidfinder Copier
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Copy code from the newest entry in most left coloumn
// @author       incstbst
// @match        *://*.eriri.net/*
// @match        *://gbf-raidfinder.teemo.name/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462788/Raidfinder%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/462788/Raidfinder%20Copier.meta.js
// ==/UserScript==

const URL = location.href;
let listClass;
let raidIDClass;
let listRescueCode;

if(URL.includes("eriri")){
    listClass = ".flex.flex-col.items-stretch";
    raidIDClass = ".tweet-battle-id";
}
else if(URL.includes("teemo")){
    listClass = ".ant-list-items";
    raidIDClass = ".ant-col.ant-col-6";
}

const config = {childList: true};

const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            GM.setClipboard(listRescueCode.querySelector(raidIDClass).textContent.trim());
        }
    }
};

const observer = new MutationObserver(callback);

function addObserverIfDesiredNodeAvailable() {
    listRescueCode = document.querySelector(listClass);
    if(!listRescueCode) {
        window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
        return;
    }
    observer.observe(listRescueCode, config);
}
addObserverIfDesiredNodeAvailable();