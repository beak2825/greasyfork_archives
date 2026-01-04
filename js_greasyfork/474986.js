// ==UserScript==
// @name         Torn Loadout Switcher
// @namespace    https://github.com/SOLiNARY
// @version      0.6.1
// @description  Adds customisable quick loadout change buttons on Items page.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474986/Torn%20Loadout%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/474986/Torn%20Loadout%20Switcher.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Change to 'false' to see only numbers, 'true' to see titles
    const showTitles = true;

    const includeLogo = false;
    const rfcvArg = "rfcv=";
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const getEquippedItemsUrl = "/page.php?sid=itemsLoadouts&step=getEquippedItems";
    let rfcv = localStorage.getItem("silmaril-loadout-switcher-rfcv") ?? null;
    let rfcvUpdatedThisSession = false;
    let mutationFound = false;
    let panelAdded = false;
    let loadoutTitles = {};

    const { fetch: originalFetch } = isTampermonkeyEnabled ? unsafeWindow : window;

    const customFetch = async (...args) => {
        let [resource, config] = args;
        let response = await originalFetch(resource, config);

        if (rfcvUpdatedThisSession && Object.keys(loadoutTitles).length > 0) {
            return response;
        }

        let fetchUrl = response.url;
        if (!rfcvUpdatedThisSession){
            let rfcvIdx = fetchUrl.indexOf(rfcvArg);
            if (rfcvIdx >= 0){
                rfcv = fetchUrl.substr(rfcvIdx + rfcvArg.length);
                localStorage.setItem("silmaril-loadout-switcher-rfcv", rfcv);
                document.querySelectorAll("div.silmaril-torn-loadout-switcher-container button").forEach((button) => button.classList.remove("disabled"));
                rfcvUpdatedThisSession = true;
            }
        }
        if (Object.keys(loadoutTitles).length == 0){
            if (fetchUrl.indexOf(getEquippedItemsUrl) >= 0){
                const json = () => response.clone().json()
                .then((data) => {
                    if (data.currentLoadouts != null){
                        for (let key in data.currentLoadouts) {
                            if (data.currentLoadouts.hasOwnProperty(key)) {
                                loadoutTitles[key] = data.currentLoadouts[key].title;
                            }
                        }
                    }
                    return data
                })

                response.json = json;
                response.text = async () =>JSON.stringify(await json());
            }
        }

        return response;
    };

    if (isTampermonkeyEnabled){
        unsafeWindow.fetch = customFetch;
    } else {
        window.fetch = customFetch;
    }

    const styles = `
div#loadoutsRoot p[class^=title___] {
    overflow-y: hidden;
    overflow-x: auto;
    }

div.silmaril-torn-loadout-switcher-container {
    display: inline-flex;
    align-items: center;
    margin-left: 5px;
}

div.silmaril-torn-loadout-switcher-container a img {
    display: flex;
    height: 50px;
    flex-direction: row;
    align-content: stretch;
    justify-content: space-around;
    align-items: flex-start;
}

.wave-animation {
  position: relative;
  overflow: hidden;
}

.wave {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 33px;
  background-color: transparent;
  opacity: 0;
  transform: translateX(-100%);
  animation: waveAnimation 3s cubic-bezier(0, 0, 0, 1);
}

@media (max-width: 768px) {
    div[class^=main___] > div[class^=content___] {
        margin-top: 10px;
    }
}

@keyframes waveAnimation {
  0% {
    opacity: 1;
    transform: translateX(-100%);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
`;

    if (isTampermonkeyEnabled){
        GM_addStyle(styles);
    } else {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styles;
        while (document.head == null){
            await sleep(50);
        }
        document.head.appendChild(style);
    }

    const setLoadoutUrl = "/page.php?sid=itemsLoadouts&step=changeLoadout&setID={loadoutId}&rfcv={rfcv}";
    let selectedLoadouts = localStorage.getItem("silmaril-loadout-switcher-selected-loadouts") ?? "1,2,3";
    let selectedLoadoutsArray = selectedLoadouts.split(',');

    const observerTarget = document.querySelector("html");
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationItem) {
            if (mutationFound || panelAdded){
                observer.disconnect();
                return;
            }
            let mutation = mutationItem.target;
            if (mutation.classList.contains("title___nIMRx")) {
                mutationFound = true;
                observer.disconnect();
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'silmaril-torn-loadout-switcher-container';

                const waveDiv = document.createElement('div');
                waveDiv.className = 'wave';

                buttonContainer.appendChild(waveDiv);
                addLoadoutAndSettingButtons(buttonContainer);
                addLogo(buttonContainer);

                if (!panelAdded){
                    mutation.appendChild(buttonContainer);
                    panelAdded = true;
                }
            }
        });
    });
    observer.observe(observerTarget, observerConfig);

    function addLogo(root){
        if (!includeLogo){ return; }

        const logoLink = document.createElement('a');
        logoLink.href = '/factions.php?step=profile&ID=6731';
        logoLink.target = '_blank';

        const logoImg = document.createElement('img');
        logoImg.src = 'data:image/octet-stream;base64,UklGRpAFAABXRUJQVlA4WAoAAAAYAAAAfwAAfwAAQUxQSKcAAAABDzD/ERHCbW3tbSIRS4/gUTwaabEMa7ijxCVRj/jpl8ldRP8nwP0nx5AZVNBUcoOt0n/gUxSauzmCS9EzCFK400tCxBEcFGm8toWBRa6N0lQwgyzNSithbdHVNmnG3DbrERDjfO3c2/PPcXd8p5mgNOpqm6i1VlmsINNm2tYo10ZRA+1o4aHQnBaMehFBgl4NjiAVWt/Ma1tlDHkNKmg+KCHTxlF/RQBWUDggrAQAADAcAJ0BKoAAgAAAAAAlAGusoL8Y/ADVCuD/gr+rX9E5wzUrsB+pv8axQL4P+Ff8r4AD9CP55+O3AO/Tb+8/47hAP0A/iHCAfwf+O+jr/u/9F8C36q/2b/K/AT/Jf5R8/+3LeJf6B9AHjP/Sa6n+kU4BhD3961gj+Yfp160fzJ50PnT/He4J/G/5v/kvzY7pvoAfqqmnzJ4zUG87Va0zYvL6xWb+7JdFy9GX+yIyVf2p1gR6w+kkZGwvG/OF94fetMEdGx53ednF7J1scS7sPxiI6FjzydvQ4SbMdJNDC25UR6pUmPfvYcGGAAD+/97c8Ag//yLWLqou+QyhvH5zTSyXLSY2RoaUp2Wjt8xqZm4N5FaR+PoyTh8YUJM7QpH93+r4XaBryGMi0aFNVS8/7GOU+dSycbi/sz5Tz/hZhLoDMNx/CX7Gl1xcBT/L7AYCgsYxT9XAoH2pL3/9LpgQdOa6W/+JgLgV0/RBVejhSRsTkCyXl2UJH1kf9oU8GNvWkuD+mL+eZJVBocEr/9xsahGwJHFih+U67i9H5P/36l/Abt2sESXCK5WPOQn2zCQ+eAsAi6pLg5h+Sp+Vi6Kv0zH6AVXsPzb4N163PmwCeixL8S+oaebL0JSSbaOc3dOEcFV/7/yQN7cJmkJctgKW7TpzG1fBZjf3Vi3pVBgjt3DoFZ9H88FJsbZk4UQiSAdtgTBGGV0Qbako3/EaCDDhv6o3UXIy9VuFJpks3LnVLff/0tEUn/3H2mYOHRxXSCQhYbMo/6XcT8kbHRS/6WcF7Kq+JZpLoSWYlNcCRTgaomPehL6YDVV+P1MOwoKgPwzco3hVXqPoYRPjuqk9X6OWxjGQ/V4klAsdjwBL0nwpioJIYFxr5+e7qKBrLoO04+2st6nrmTVd/VSqEd/zP00iULw2nyDaeBgxC3T3J0fRf+s8oMIlseJhnGdpJRCUiaAEfGmACQG4zR+fsIkLKph96SQGxccfrou8foWYYSsrv1T5yJnbNXFgiNlMluCNU6JKxG7/ZZQJ/6vT/jD9Q5lNeaeXt//Ex/0JZFyx393d7XxhcoRvVUFWv/Mcj/ev2VLCojBVMPAn6f8SVZjwO54toOLjZfFY/oZc6jJnIH6bolYAD3Gt/wm55ZRHg2AlRSuMGsfBp1oTL0XxAMT/3Uxv56jhPLlFjPHZPRsN07Mp8ahvKqGaRjqc1NPylgQ0anN36Tkazqhznoj8OoNi1e/6Giff5NGL4f+Mbre0tl/9pdTw+4koHvkch/gnreoLlBf5Nb1OCy4J6L+hRhD0XZA/Z0za7xczd72XRx0cNO8l6mGOZuH98/4Lo3RIM2FLUV//u4oIuiJKtPt9/MNLMhcygG1EfRV6RICfU6QY4SxI/z3WEe439xw5wcpR2Vvzyy9srHuubX2rB0LJbtd0TvVlEiAdF1BC1he3fyzfhkY33hY4IJJ/c7na5AxArRy9TcD7D8hQc4UhVSsX4hlsH73UQSrPwn6v5YJHsQ30huCmqGJ/jbGu8jb18VcEFGB7wu/XqQ3juNRxhXEGqI3FH5GBeWSCinT3+epuVSD1dsxb9TvZq/IoGv6niKAAAAAARVhJRg4AAABNTQAqAAAACAAAAAAAAA==';
        logoImg.alt = 'Next Level logo';

        logoLink.appendChild(logoImg);
        root.appendChild(logoLink);
    }

    function addLoadoutAndSettingButtons(root){
        addLoadoutButtons(root);

        const settings = document.createElement('button');
        settings.type = 'button';
        settings.title = 'Settings';
        settings.className = 'torn-btn';
        settings.textContent = '⚙';
        settings.addEventListener('click', () => {
            let userInput = prompt("Please, enter which loadouts from 1 to 9 you want to see, comma-separated (default: 1,2,3):", selectedLoadouts);
            let wave = root.querySelector("div.wave");
            if (userInput !== null && userInput.length > 0) {
                localStorage.setItem("silmaril-loadout-switcher-selected-loadouts", userInput);
                selectedLoadouts = userInput;
                selectedLoadoutsArray = selectedLoadouts.split(',');
                root.querySelectorAll("button, a").forEach((item) => item.remove());
                addLoadoutAndSettingButtons(root);
                addLogo(root);
                wave.style.backgroundColor = "green";
            } else {
                wave.style.animationDuration = "3s";
                wave.style.backgroundColor = "yellow";
                console.error("[TornLoadoutSwitcher] User cancelled input of selected loadouts.");
            }
            wave.style.animation = 'none';
            wave.offsetHeight;
            wave.style.animation = null;
        });

        root.appendChild(settings);
    }

    async function addLoadoutButtons(root){
        selectedLoadoutsArray.forEach((loadout) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.title = showTitles ? loadout : loadoutTitles[loadout] ?? '';
            button.className = rfcv === null ? 'torn-btn disabled' : 'torn-btn';
            button.textContent = showTitles ? loadoutTitles[loadout] : loadout;
            button.setAttribute('data-loadout-number', loadout);
            button.addEventListener('click', () => {handleLoadoutClick(root)});

            root.appendChild(button);
        })
    }

    async function handleLoadoutClick(root){
        let loadout = event.target.getAttribute('data-loadout-number');
        if (event.target.classList.contains('disabled')){
            return;
        }
        let url = setLoadoutUrl.replace("{loadoutId}", loadout).replace("{rfcv}", rfcv);
        await sendSetLoadoutRequest(url, root);
    }

    async function sendSetLoadoutRequest(url, root){
        let wave = root.querySelector("div.wave");
        await fetch(url, {
            method: 'GET',
        })
            .then(response => {
            if (response.ok) {
                wave.style.backgroundColor = "green";
            } else {
                console.error("[TornLoadoutSwitcher] Set Loadout request failed:", response);
                wave.style.backgroundColor = "red";
                wave.style.animationDuration = "5s";
            }
        })
            .catch(error => {
            console.error("[TornLoadoutSwitcher] Error setting loadout:", error);
            wave.style.backgroundColor = "red";
            wave.style.animationDuration = "5s";
        });
        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = null;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();