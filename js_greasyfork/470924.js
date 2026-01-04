// ==UserScript==
// @name         Torn Fake Walls Warning
// @namespace    https://github.com/SOLiNARY
// @version      0.5
// @description  Shows warning label over a fake wall territory war.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470924/Torn%20Fake%20Walls%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/470924/Torn%20Fake%20Walls%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let GM_addStyle = function (s) {
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = s;
    document.head.appendChild(style);
};
    let factionIds;

    GM_addStyle(`
li.warListItem___eE_Ve {
  position: relative;
}

li.warListItem___eE_Ve div.status-wrap.fake-wall::after {
  content: "Fake Wall" !important;
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  z-index: 777 !important;
  background-image: repeating-linear-gradient(
    -45deg,
    #000,
    #000 10px,
    #ffb101 10px,
    #ffb101 20px
  ) !important;
  color: #FFFFFF !important;
  padding: 9px 6px !important;
  text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black !important;
  border-radius: 0px 5px 0px 0px;
}

li.warListItem___eE_Ve div.status-wrap.fake-wall::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: -2px;
    width: 3px;
    height: 100%;
    background-image: repeating-linear-gradient( 0deg, #000, #000 5px, #ffb101 5px, #ffb101 10px );
    background-size: contain;
}

li.warListItem___eE_Ve div.status-wrap.real-wall::after {
  content: "Join" !important;
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  z-index: 777 !important;
  background-color: #85b200 !important;
  color: #FFFFFF !important;
  padding: 9px 18px !important;
  text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black !important;
  border-radius: 0px 5px 0px 0px;
}

li.warListItem___eE_Ve div.status-wrap.real-wall::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: -2px;
    width: 3px;
    height: 100%;
    background-image: repeating-linear-gradient( 0deg, #00000000, #00000000 5px, #85b200 5px, #85b200 10px );
    background-size: contain;
}
    `);

    const targetElementSelector = '.f-war-list.war-new';
    const observerOptions = { childList: true, subtree: true };

    const observerCallback = async function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const targetElement = document.querySelector(targetElementSelector);
                if (targetElement) {
                    let territoryWars = mutation.target.querySelectorAll(".f-war-list.war-new div[class^='status-wrap territoryBox']");
                    if (territoryWars.length > 0) {
                        territoryWars.forEach(war => {
                            getFactionIds();
                            let opponentFactionId = war.querySelectorAll("div > div.name.title___gm45f > span.text.titleText___TTIBz > span:nth-child(1) > a")[0].href.substring(50);

                            if (factionIds.includes(opponentFactionId)){
                                war.classList.add("fake-wall");
                            } else {
                                war.classList.add("real-wall");
                            }
                        });
                        observer.disconnect();
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.documentElement, observerOptions);

    function getFactionIds(){
        if (factionIds != null){
            return;
        }
        factionIds = document.querySelectorAll("#react-root > div > div > div.announcement > p > div:nth-child(1)")[0].innerText.split(',');
        console.log(factionIds);
    }
})();