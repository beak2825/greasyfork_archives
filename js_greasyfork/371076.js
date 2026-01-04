// ==UserScript==
// @name         Chain Watch
// @namespace    LordBusiness.CW
// @version      1.9
// @description  Makes the chain watch a whole lot bigger.
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371076/Chain%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/371076/Chain%20Watch.meta.js
// ==/UserScript==

GM_addStyle(`
.lbschainoverlay {
    opacity: 0.8;
    position: fixed;
    height: 100px;
    width: 200px;
    top: 10px;
    right: 10px;
    left: calc(100% - 210px);
    border-radius: 10px;
    background-color: white;
    z-index: 6666;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: #2f2f2f;
    transition: all 1s;
    pointer-events: none;
}
.lbsvbig {
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 7rem;
}
.lbschainlabel {
    display: none;
}
.lbsvbig .lbschainlabel {
    display: initial !important;
}
`);

document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", `<div class="lbschainoverlay"><span class="lbschainlabel">Chain:&nbsp;</span><span class="lbschaintime"></span></div>`);
const chainOverlay = document.querySelector(".lbschainoverlay");

var popupTimer;
const displayOverlay = () => {
    chainOverlay.classList.add("lbsvbig");
}

const barChainTime = "#barChain [class^=bar-stats] [class^=bar-timeleft]";
const Chainregex = /(\d{2}):\d{2}/igm;
const observerChainTime = new MutationObserver((mutations) => {
    let CTime = document.querySelector(barChainTime).innerText;
    chainOverlay.querySelector(".lbschaintime").innerHTML = CTime;
    let ChainTimeregAr = Chainregex.exec(CTime);
    if(ChainTimeregAr !== null && parseInt(ChainTimeregAr[1]) <= 2) {
        chainOverlay.classList.add("t-red");
    } else {
        chainOverlay.classList.remove("t-red");
    }
})

const observeObserverCT = () => {
    observerChainTime.observe(document.querySelector(barChainTime).childNodes[0], { characterData: true })
}

const observerSidebar = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (document.querySelector(barChainTime) !== null) {
            console.log("This is also working!!");
            observeObserverCT();
            observerSidebar.disconnect();
        }
    }
})

const notInactive = () => {
    clearTimeout(popupTimer);
    chainOverlay.classList.remove("lbsvbig");
    popupTimer = setTimeout(displayOverlay, 20000);
}

const pageVisibility = () => {
    var hidden = "hidden", hid;

    if (hidden in document) {
        document.addEventListener("visibilitychange", onchange);
    } else if ((hidden = "mozHidden") in document) {
        document.addEventListener("mozvisibilitychange", onchange);
    } else if ((hidden = "webkitHidden") in document) {
        document.addEventListener("webkitvisibilitychange", onchange);
    } else if ((hidden = "msHidden") in document) {
        document.addEventListener("msvisibilitychange", onchange);
    } else if ('onfocusin' in document) {
        document.onfocusin = document.onfocusout = onchange;
    } else {
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
    }

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = {
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
            };

        evt = evt || window.event;
        if (evt.type in evtMap) {
            hid = evtMap[evt.type];
        } else {
            hid = this[hidden] ? "hidden" : "visible";
        }

        if(hid != "visible") {
            clearTimeout(popupTimer)
        }
    }
};
document.addEventListener('click', notInactive);
document.addEventListener('keypress', notInactive);
document.addEventListener('mousemove', notInactive);

if (document.querySelector(barChainTime) === null) {
    observerSidebar.observe(document.getElementById('sidebarroot'), { subtree: true, childList: true })
} else {
    observeObserverCT();
}
pageVisibility();