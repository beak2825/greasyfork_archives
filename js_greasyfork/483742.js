// ==UserScript==
// @name         Quick Trade Button for YFT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quick Trade Button for YFT (Your Favorite Traders)
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/*php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/483742/Quick%20Trade%20Button%20for%20YFT.user.js
// @updateURL https://update.greasyfork.org/scripts/483742/Quick%20Trade%20Button%20for%20YFT.meta.js
// ==/UserScript==

// Quick Trade Button for YFT (Your Favorite Traders) - Advance Eddition: Quick Trade button in user menu list while in chat with your traderlist.
// Go to their profile and add your favorite traders before using.

(function () {
    'use strict';

    const controls = {};
    controls.YFTlist = [];
    controls.YFTId = {};

    //#region Ultilities

    const waitFor = (target, selector) => {
        return new Promise(resolve => {
            if (target.querySelector(selector)) {
                return resolve(target.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (target.querySelector(selector)) {
                    resolve(target.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(target, {
                childList: true,
                subtree: true
            });
        });
    };

    function NotificationYFT(message) {
        const notification = document.createElement("p");
        notification.innerHTML = message;
        notification.style = "text-align: center; font-weight: bold; color: white; z-index: 9999; padding: 5px;";
        document.querySelector("#profileroot > div > div > div > div:nth-child(1) > div.profile-right-wrapper.right > div.profile-buttons.profile-action > div > div.cont.bottom-round > div > div > div.empty-block").appendChild(notification);
        setTimeout(function () {
            notification.remove();
        }, 1000);
    }

    // Function to save state using GM_setValue
    function GM_SaveData(controls) {
        GM_setValue('State', JSON.stringify(controls));
    }

    // Function to load state using GM_getValue
    function GM_LoadData() {
        const storedControls = JSON.parse(GM_getValue('State', '{}'));
        controls.YFTId = storedControls.YFTId || {};
        controls.YFTlist = storedControls.YFTlist || [];
    }

    //#endregion

    //#region createTradeButton

    GM_LoadData(controls);
    //console.log(controls);

    function createTradeButton(name) {
        const tradeButton = document.createElement("button");
        tradeButton.type = "button";
        tradeButton.classList.add("chat-box-options__button___O1B8v");
        tradeButton.id = "TradeButton" + controls.YFTId[name];
        tradeButton.addEventListener("click", function () {
            window.open("https://www.torn.com/trade.php#step=start&userID=" + controls.YFTId[name]);
        });

        const tradeButtonDiv = document.createElement("div");
        tradeButtonDiv.classList.add("chat-box-options__items___Vwu4d");
        tradeButton.appendChild(tradeButtonDiv);

        const tradeButtonSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tradeButtonSvg.setAttribute("width", "20");
        tradeButtonSvg.setAttribute("height", "20");
        tradeButtonSvg.setAttribute("fill", "none");
        tradeButtonSvg.setAttribute("viewBox", "0 0 24 24");
        tradeButtonSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        tradeButtonSvg.classList.add("chat-box-options__icon___puJ7U");
        tradeButtonSvg.innerHTML = '<path d="M 11.22 8.12 v 2.16 l -5.04 -5.04 l 5.04 -5.04 v 2.16 s 10.35 0 10.98 12.06 A 10.2861 10.2861 90 0 0 11.22 8.12 Z m -8.82 1.26 c 0.72 12.06 10.98 12.06 10.98 12.06 V 23.6 l 5.04 -5.04 l -5.04 -5.04 v 2.16 A 10.2861 10.2861 90 0 1 2.4 9.38 Z"></path>';
        tradeButtonDiv.appendChild(tradeButtonSvg);

        const tradeButtonP = document.createElement("p");
        tradeButtonP.classList.add("typography___Dc5WV", "body4", "color-#333333", "chat-box-options__label___QSXin");
        tradeButtonP.innerHTML = "Trade!";
        tradeButtonDiv.appendChild(tradeButtonP);

        return tradeButton;
    }

    function addTradeButtonToChat(chatElement) {
        const chatName = chatElement.parentNode.querySelector("div.chat-box-header___P15jw > button > p").innerText;
        if (controls.YFTlist.includes(chatName) && !chatElement.querySelector("#TradeButton" + controls.YFTId[chatName])) {
            const tradeButton = createTradeButton(chatName);
            const chatinfo = chatElement.querySelector("div:nth-child(1) > button:nth-child(1)");
            chatinfo.after(tradeButton);
        }
    }

    // Function to be called when a new element is added
    function handleNewElements(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches(".chat-box-options___XoTAR")) {
                        addTradeButtonToChat(node);
                    }
                });
            }
        });
    }

    // Observe changes in the DOM
    const observer = new MutationObserver(handleNewElements);
    const chatListContainer = document.querySelector(".chat-app__chat-list-chat-box-wrapper___S7MmX");
    observer.observe(chatListContainer, { childList: true, subtree: true });

    //#endregion

    //#region addTradeListInProfile
    if (window.location.href.startsWith("https://www.torn.com/profiles.php")) {
        const profileID = window.location.href.split("XID=")[1];
        const profileName = document.querySelector("#skip-to-content").innerText.split(" ")[0].split("'")[0];
        //console.log(profileName);

        const favoriteTrader = document.createElement("a");
        favoriteTrader.id = "button12-profile-" + profileID;
        favoriteTrader.classList.add("profile-button", "profile-button-YFT", "active");
        favoriteTrader.setAttribute("aria-label", "YFT");
        favoriteTrader.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt profileButtonIcon" filter="" fill="yellow" stroke="#d4d4d4" stroke-width="0" width="46" height="46" viewBox="694.6 178 46 46"><path d="M 708.5246 202.2194 L 699.8984 194.9941 L 711.2526 194.1093 L 715 183 L 719.7313 194.1093 L 731.0117 194.9941 L 722.3854 202.2194 L 725.1871 213.2786 L 715.455 207.2329 L 705.7966 213.5735 L 708.5246 202.2194 m 6.4754 -6.2194 H 718 V 195 H 714 V 206 L 715 206 L 715 200 L 718 200 V 199 H 715 M 708 195 L 709 200 L 710 202 L 710 200 L 709 195 M 713 195 L 712 195 L 711 200 L 711 202 L 712 200 M 710 201 L 711 201 L 711 200 L 710 200 M 711 201 L 710 201 L 710 206 L 711 206 M 719 196 L 724 196 L 724 195 L 719 195 M 721 196 L 721 206 L 722 206 l 0 -10 Z"></path></svg>';

        favoriteTrader.addEventListener("click", function () {
            if (controls.YFTlist.includes(profileName)) {
                controls.YFTlist.splice(controls.YFTlist.indexOf(profileName), 1);
                delete controls.YFTId[profileName];
                favoriteTrader.classList.remove("active");
                console.log(controls.YFTlist, controls.YFTId);
                GM_SaveData(controls);
                NotificationYFT("Removed " + profileName + " from your YFT list.");
            } else {
                controls.YFTlist.push(profileName);
                controls.YFTId[profileName] = profileID;
                favoriteTrader.classList.add("active");
                console.log(controls.YFTlist, controls.YFTId);
                GM_SaveData(controls);
                NotificationYFT("Added " + profileName + " to your YFT list.");
            }
        });

        waitFor(document.body, "#profile-container-description").then((profileDescription) => {
            var buttonlist = profileDescription.parentNode.querySelector("div.buttons-wrap > div > a:last-child");
            buttonlist.after(favoriteTrader);
        });
    }
    //#endregion
})();