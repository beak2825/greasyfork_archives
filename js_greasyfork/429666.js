// ==UserScript==
// @name           BETSLIX - burning series enhancer
// @name:en        BETSLIX - burning series enhancer

// @icon           https://bs.to/favicon.ico
// @author         xtrars
// @description:de Wechselt automatisch zum VOE- oder Streamtape-Tab auf burning series und öffnet VOE oder Streamtape. Das Tool startet das nächste Video und falls nötig die nächste Staffel, wenn eine Episode beendet wurde.
// @description:en Automatically switches to the VOE or Streamtape tab on burning series and opens VOE or Streamtape. The tool starts the next video and if necessary the next season when an episode is finished.
// @version        16.5
// @run-at         document-start
// @license        GPL-3.0-or-later
// @namespace      https://greasyfork.org/users/140785

// @compatible     chrome Chrome
// @compatible     firefox Firefox
// @compatible     opera Opera
// @compatible     edge Edge
// @compatible     safari Safari

// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_removeValueChangeListener
// @grant          GM_download
// @grant          GM_info
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @grant          window.close
// @grant          window.focus

// @match          https://bs.to/*
// @match          https://burningseries.co/*
// @match          https://burningseries.sx/*
// @match          https://burningseries.vc/*
// @match          https://burningseries.ac/*
// @match          https://burningseries.cx/*
// @match          https://burningseries.nz/*
// @match          https://burningseries.se/*

// @match          https://dood.yt/*
// @match          https://d0000d.com/*

// @match          https://streamtape.com/*
// @match          https://streamadblocker.xyz/*
// @match          https://*.tapecontent.net/*

// @match          https://*.vidoza.net/*
// @match          https://*.videzz.net/*

// @match          https://*.voe-network.net/*
// @match          https://voe.sx/*
// @match          https://*.richardsignfish.com/*

// @require        https://unpkg.com/video.js@latest/dist/video.min.js
// @require        https://unpkg.com/hls.js@latest/dist/hls.min.js

// @description Wechselt automatisch zum VOE- oder Streamtape-Tab auf burning series und öffnet VOE oder Streamtape. Das Tool startet das nächste Video und falls nötig die nächste Staffel, wenn eine Episode beendet wurde.
// @downloadURL https://update.greasyfork.org/scripts/429666/BETSLIX%20-%20burning%20series%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/429666/BETSLIX%20-%20burning%20series%20enhancer.meta.js
// ==/UserScript==


/**
 * The CBaseHandler class provides basic helper functions for handling DOM elements and URLs.
 * @class
 */
class CBaseHandler {

    /**
     * Returns the hoster as a string
     * @param {number} iIndex - 0: VOE, 1: Streamtape, 2: Doodstream, 3: Vidoza
     * @param {boolean} bAllLowerCase - If true, returns the hoster name in all lowercase
     * @returns {string} - The hoster name
     */
    getHoster(iIndex, bAllLowerCase = false) {
        const aHoster = ['VOE', 'Streamtape', 'Doodstream', 'Vidoza'];
        return bAllLowerCase ? aHoster[iIndex].toLowerCase() : aHoster[iIndex];
    }

    /**
     * Waits for an element to be available in the DOM and resolves with the element
     * @param {string} sSelector - The CSS selector of the element to wait for
     * @param {boolean} bWaitUnlimited - If true, waits indefinitely for the element. If false, waits for a maximum of 3 seconds
     * @returns {Promise<HTMLElement>} - A promise that resolves with the element when it becomes available in the DOM
     */
    waitForElement(sSelector, bWaitUnlimited = true) {
        return new Promise(async resolve => {
            if (document.querySelector(sSelector)) {
                return resolve(document.querySelector(sSelector));
            }

            const oObserver = new MutationObserver(() => {
                if (document.querySelector(sSelector)) {
                    resolve(document.querySelector(sSelector));
                    oObserver.disconnect();
                }
            });

            if (document.body) {
                oObserver.observe(document.body, {
                    childList: true, subtree: true,
                });
            }

            if (!bWaitUnlimited) {
                setTimeout(() => {
                    resolve(document.querySelector(sSelector));
                    oObserver.disconnect();
                }, 3000);
            }
        });
    }

    /**
     * Checks if the current URL contains all the selectors in the given array
     * @param {Array<RegExp>} aSelector - An array of URL selectors to check
     * @returns {boolean} - True if the URL contains all the selectors, false otherwise
     */
    hasUrl(aSelector) {
        let bIsAvailable = true;
        for (let rSelector of aSelector) {
            bIsAvailable = document.location.href.search(rSelector) !== -1;
            if (!bIsAvailable) {
                return false;
            }
        }
        return true;
    }

    /**
     * Reloads the current page after the specified delay
     * @param {number} iDelay - The delay in milliseconds before reloading the page
     */
    reload(iDelay = 300) {
        setTimeout(() => {
            window.location.reload();
        }, iDelay);
    }

    /**
     * Returns the first element matching the given CSS selector and attribute that matches the specified regular expression
     * @param {string} sSelector - The CSS selector to search for
     * @param {string} sAttribute - The attribute to match the regular expression against
     * @param {RegExp} rRegex - The regular expression to match against the attribute value
     * @returns {HTMLElement|boolean} - The first matching element, or false if no matching element is found
     */
    querySelectorAllRegex(sSelector = '*', sAttribute = 'name', rRegex = /.*/) {
        for (const oElement of document.querySelectorAll(sSelector)) {
            if (rRegex.test(oElement[sAttribute])) {
                return oElement;
            }
        }
        return false;
    }

    restartAnimation(oEl) {
        oEl.style.animation = 'none';
        oEl.offsetHeight; /* trigger reflow */
        oEl.style.animation = null;
    }
}

/**
 The CBurningSeriesHandler class extends the CBaseHandler class and provides methods for handling and enhancing
 the Burning Series website. This class is responsible for building the settings window that is displayed when
 the settings button is clicked.
 @class
 @extends CBaseHandler
 */
class CBurningSeriesHandler extends CBaseHandler {

    /**
     Initializes the values for the user script's settings.
     */
    initGMVariables() {
        const oVariables = [
            {name: 'bActivateEnhancer', defaultValue: false},
            {name: 'bAutoplayNextSeason', defaultValue: true},
            {name: 'bAutoplayRandomEpisode', defaultValue: false},
            {name: 'bSelectHoster', defaultValue: this.getHoster(0, true)},
            {name: 'bSkipStart', defaultValue: false},
            {name: 'bSkipEnd', defaultValue: false},
            {name: 'iSkipEndTime', defaultValue: 0},
            {name: 'iSkipStartTime', defaultValue: 0},
            {name: 'bFirstStart', defaultValue: true},
            {name: 'sLastActiveTab', defaultValue: ''},
            {name: 'bIsSettingsWindowOpen', defaultValue: false},
            {name: 'oSettingsWindowPosition', defaultValue: {}}
        ];

        for (const o of oVariables) {
            GM_setValue(o.name, GM_getValue(o.name) ?? o.defaultValue);
        }
    }

    /**
     Determines whether another hoster is available for the current episode.
     @returns {boolean} Whether another hoster is available.
     */
    hasAnotherHoster() {
        return this.hasUrl([new RegExp(`https:\\/\\/(bs.to|burningseries.[a-z]{2,3})\\/.*[0-9]{1,3}\\/[0-9]{1,3}-.*\\/[a-z]+\\/(?!${this.getHoster(0)}|${this.getHoster(1)}|${this.getHoster(2)}|${this.getHoster(3)}).*`, 'g')]);
    }

    /**
     Determines whether the current page is a series page.
     @returns {boolean} Whether the page is a series page.
     */
    isSeries() {
        return this.hasUrl([/^https:\/\/(bs.to|burningseries.[a-z]{2,3})\/serie\//g]);
    }

    /**
     Determines whether the current page is an episode page.
     @returns {boolean} Whether the page is an episode page.
     */
    isEpisode() {
        return this.hasUrl([/^https:\/\/(bs.to|burningseries.[a-z]{2,3})/g, /[0-9]{1,3}\/[0-9]{1,3}-/g]);
    }

    /**
     Clicks the play button on the current episode page.
     @async
     @returns {Promise<void>} A promise that resolves when the button has been clicked.
     */
    async clickPlay() {
        return new Promise(async resolve => {
            let oPlayerElem = await this.waitForElement('section.serie .hoster-player')
                .catch(() => null);
            let iNumberOfClicks = 0;
            let iClickInterval = setInterval(async () => {
                if (oPlayerElem) {
                    if (
                        document.querySelector('section.serie .hoster-player > a') ||
                        document.querySelector('section.serie .hoster-player > iframe') ||
                        iNumberOfClicks > 120 ||
                        this.querySelectorAllRegex('iframe', 'title', /recaptcha challenge/)
                    ) {
                        clearInterval(iClickInterval);
                        resolve();
                    }
                    iNumberOfClicks++;
                    let oClickEvent = new Event('click');
                    oClickEvent.which = 1;
                    oClickEvent.pageX = 6;
                    oClickEvent.pageY = 1;
                    oPlayerElem.dispatchEvent(oClickEvent);
                }
            }, 500);
        });
    }

    /**
     Plays the next episode if the current video has ended.
     @param {boolean} [bSetEvent=true] - Whether to set the event listener to play the next episode.
     */
    playNextEpisodeIfVideoEnded(bSetEvent = true) {
        if (!bSetEvent) {
            GM_removeValueChangeListener('isLocalVideoEnded');
            return;
        }
        GM_addValueChangeListener('isLocalVideoEnded', () => {
            if (GM_getValue('isLocalVideoEnded')) {
                GM_setValue('isLocalVideoEnded', false);
                window.focus();
                if (GM_getValue('bAutoplayRandomEpisode')) {
                    let oRandomEpisode = document.querySelector('#sp_right > a');
                    document.location.replace(oRandomEpisode.href);
                } else {
                    let oNextEpisode = document
                        .querySelector('.serie .frame ul li[class^="e"].active ~ li:not(.disabled) a');
                    if (oNextEpisode) {
                        document.location.replace(oNextEpisode.href);
                    } else if (GM_getValue('bAutoplayNextSeason')) {
                        let oNextSeason = document
                            .querySelector('.serie .frame ul li[class^="s"].active ~ li:not(.disabled) a');
                        if (oNextSeason) {
                            GM_setValue('clickFirstSeason', true);
                            document.location.replace(oNextSeason.href);
                        }
                    }
                }
            }
        });
    }

    /**
     Appends custom styles to the current page.
     */
    appendOwnStyle() {
        const oStyle = document.createElement('style');
        oStyle.id = 'xtrars-style';

        // language=HTML
        oStyle.innerHTML = `<style>
              :root {
              --inner-pl: 14px;
              --inner-bc-before: #2FB536;
              --inner-bc-after: #12A6F6;
              --color: white;
              --xtrars-bs-img: url(data:image/png;base64,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);
            }
            
            @font-face { 
              font-family: "IEC symbols Unicode";
              src: url(data:font/woff2;base64,d09GMgABAAAAAARMAA4AAAAACNAAAAPvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0ZGVE0cGh4GVgCCYhEICoUUhDABNgIkAygLFgAEIAWDdAeBFz93ZWJmBhtcB8iOxDgmcsRI5UX+Q571flJmrKx1G3faMbWgT8JJaVcQD/8/5u77M4malrZknsbpZlk8EgqZQ00kC4UUGTycdp7gnef436GyhAI+52tgAcacBezsL21O4FUACIDLl3TCAeCK6cpHpq4t/UPsNdoAU8AgECghkPXdAiSdSAMQIyteJF4GkC1+Y68jLRkCg5wckpDHQwH3yhQ405kVIUn7l4ajMpD0wQGAVQXWIWgMLwRdFrveXFNEQhagM+nflD+zIv7/hw/qd8n/b3fkt7SFffUxpB6SNKEghq9Atbz/CPno/38MwTmBsR04DtB86hTNhYBZ+28LJJHhPJ1phnoifW2qrq6qPiMAErypu68TSalRwxVwY1zXhenCDTTcVD/sfXz9NjXeCtt+iesS0LDPQo2GGw96Ht2ixvAVB3BqtbjxercaogaB69L8ar59/bEWdAmSpkGtrpBM6xo1YRoNR9T9UH2z6YZQLlFTLQhAZYOw6rXVwpMbN28+ffg4/NGzqFv3CQm/ex4IN5qaj2i+pXnT+7Astdmc5tuoBcj0FU6FnXtDQu2ZE+QQGlqleBzoBONgfETnMSGs/xpnFBdPX7+73eHZU4eOGIf2p886HHavL56eUWz81zrPCeZZHwbW31g+JmJHF4vGRtnlN7yrPmSZ2weHYPF1Z5AiNq6D5SrM090UcXEL+F1No3F//8aNnly/vv5R/K5d8Y/+EdkwPYr/59sbFhYa+jihfv36k3Gjf/+OxuVWN8WNUQQcHwpcURuWQX4WK47vUCQK1oUyp7lhyWrRAV+5eWsQNa9IN5cHtTaTf5qu88GMYnmR4cRZkEZ59WeUBA1+/ToYVMKSjb6gQV/avi1exmvXGnuBDKbN2DF0dUvMwfPAeD37rzItGeCWaPtk2v7/kl6OE8h2l4VA9qGdcDWAlOrni8/FDgAyFToGWYzJKG2hR18+hcEIwGGvVh8DoLDSmbRPC+9gESI5Aj1cTUJdpBPI4MpikMXSB8ih4RPk0fUHvmDqH3xjfuiCH8jIkfgLjlRv3GTRiQB4UlLgvaqUK0m+HCaTdy5PpuTv9SlSBUmVrlSOREVU8uUpMccXSZeKNzU0Zrpvy9FrrxDoOWKnVgam6jDGJhb96MaLmjCpuq5YZo90vEkvGmo/MVyqJGmjYJbQnUr0afYlsj7e1CzeM7M1hW9rYRNH763mRarMK5gDetvMeYnknSpUCk6RbEiVsw/qJBIOQEi0kiURiUlCUpJJS/My50u73LQD/MOVQXxwpK+rv4+RJ8Hfb46/ShVG6TH+CMNAsI9SGfCk1nPpwiUqhbaH0iUskld4Bil8lKDQhCPFAAA=);
            }
            
            .run-circleToWindow-animation {
                animation: 500ms linear 0s 1 normal none running xtrarsSlideIn, 
                           500ms linear 0s 1 normal none running xtrarsCircleToWindow;
                animation-fill-mode: forwards;
            }            
            
            .run-windowToCircle-animation {
                animation: 500ms linear 0s 1 normal none running xtrarsSlideIn, 
                           500ms linear 0s 1 normal none running xtrarsWindowToCircle;
                animation-fill-mode: forwards;
            }
            
            @keyframes xtrarsSlideIn {
                0%   {transform: translate(0, 0);}
                40%  {transform: translate(0, 0);}
                99.99% {transform: translate(0, 0);}
                100% {transform: translate(0, 0);}
            }    
           
            
            @keyframes xtrarsCircleToWindow {
                0%   {clip-path: circle(35px at center); opacity: .2;}
                60%  {clip-path: circle(35px at center); opacity: 1;}
                99.99% {clip-path: circle(270px at center);}
                100% {}
            }
             
             @keyframes xtrarsWindowToCircle {
                0%   {clip-path: circle(290px at center);}
                40%  {clip-path: circle(35px at center); opacity: 1;}
                99.99% {clip-path: circle(35px at center); opacity: .2;}
                100% {clip-path: circle(35px at center); display: none;}
            }         
            
            .xtrars-power-symbol {
                font-family: 'IEC symbols Unicode',sans-serif;
                font-style: normal;
            }
            
            #xtrars-settings-window {
                overflow: hidden;
            }
            
            .xtrars-donate {
                background-color:#12a6f6;
                border-radius:21px;
                border:1px solid #11a4e3;
                display:inline-block;
                cursor:pointer;
                font-weight:bold;
                padding:3px 12px;
                text-decoration:none;
                color: white;
            }
            
            .xtrars-donate:hover, button.tab:hover, a.tab:hover {
                text-decoration:none;
                background-color:#11a4e3;
            }
            
            button.tab, a.tab {
                background-color: transparent;
                color: white;
                float: left;
                border: none;
                outline: none;
                cursor: pointer;
                padding: 7px 10px 8px;
                user-select: none;
            }
            
            @keyframes shake {
                10%, 90% {transform: translate3d(-.5px, 0, 0);}
                20%, 80% {transform: translate3d(1px, 0, 0);}
                30%, 50%, 70% {transform: translate3d(-2px, 0, 0);}
                40%, 60% {transform: translate3d(2px, 0, 0);}
            }
            
            #Streaming .onoffswitch {
                min-width: 357px;
            }
            
            #BS .onoffswitch {
                min-width: 272px;
            }
            
            .onoffswitch {
                z-index: 161;
                position: relative; 
                width: 100%;
            }

            .onoffswitch-inner {
                display: inline-block; 
                width: 200%; 
                margin-left: -100%;
                transition: margin 0.3s ease-in 0s;
                position: relative;
                bottom: 0;
                transform: translateY(-40%);
                top: 50%;
            }
            
            .onoffswitch-inner span {
                padding-left: 10px;
            }           
             
             .onoffswitch-inner > span {
                display: inline-block;
                width: calc(50% - 3px);
            }

            .xtrars-toggle:has(> .onoffswitch-checkbox:checked) + .label-wrapper > .onoffswitch-inner {
                margin-left: 0;
            }
            
            .workaroundChecked {
                margin-left: 0;
            }
            
            .label-wrapper {
                font-size: 11px;
                font-family: Trebuchet, Arial, sans-serif;
                position: relative;
                white-space: nowrap;
                overflow: hidden;
                display: inline-block;
                width: calc(100% - 34px);
                height: 16px;
            }
            
            input.skip-start, input.skip-end {
                position: absolute; 
                right: 0; 
                top: 0; 
                height: 16px; 
                min-width: 0; 
                width: 50px; 
                display: none;
            }
            
            .onoffswitch-checkbox.disabled {
                pointer-events: none;
                -webkit-user-select: none; /* Safari */
                user-select: none;
            }
            
            #xtrars-btn {
               position: relative;
               left: calc(100% - 70px);
               background: #12a6f6;
               border-radius: 50%;
               width: 70px;
               height: 70px;
               line-height: 81px;
               text-align: center;
               cursor: pointer;
               transition: transform 0.2s ease, box-shadow 0.1s ease;
           }
            #xtrars-btn:hover {
                transform: scale(100.7%);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
                transition: transform .3s ease, box-shadow .2s ease;
            }
            
            #xtrars-menu {
               right: 4px;
            }
            
            .xtrars-donation-container {
                display: flex;
                align-items: center;
            }

            .xtrars-donation-text {
                flex: 1; 
                margin-right: 10px; 
            }
            
            #xtrars-pp-qr {
               width: 90px;
               height: 90px;
               display: inline-block;
               background: no-repeat center url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNzkyIiBoZWlnaHQ9Ijc5MiIgdmlld0JveD0iMCAwIDc5MiA3OTIiPjxyZWN0IHdpZHRoPSI3OTIiIGhlaWdodD0iNzkyIiBmaWxsPSIjZmZmZmZmIiB4PSIwIiB5PSIwIi8+PGcgZmlsbD0iIzEyYTZmNiI+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0MCw0OCkgc2NhbGUoNC4xMikgcm90YXRlKC0yKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NCw0OCkgc2NhbGUoNC4xMikgcm90YXRlKDUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzYwLDQ4KSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsNDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgxMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzIsNDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDQsNDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgxKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCw0OCkgc2NhbGUoNC4xMikgcm90YXRlKDEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQwLDcyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY0LDcyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg4LDcyKSBzY2FsZSg0LjEyKSByb3RhdGUoMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMTIsNzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMzNiw3Mikgc2NhbGUoNC4xMikgcm90YXRlKC0xMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsNzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgxKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4MCw3Mikgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI4LDcyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQwLDk2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY0LDk2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzM2LDk2KSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzIsOTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgwLDk2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg4LDEyMCkgc2NhbGUoNC4xMikgcm90YXRlKDEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzEyLDEyMCkgc2NhbGUoNC4xMikgcm90YXRlKC0zKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzMiwxMjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1NiwxMjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDQsMTIwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI4LDEyMCkgc2NhbGUoNC4xMikgcm90YXRlKC0xKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NCwxNDQpIHNjYWxlKDQuMTIpIHJvdGF0ZSg0KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4OCwxNDQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzYsMTQ0KSBzY2FsZSg0LjEyKSByb3RhdGUoNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsMTQ0KSBzY2FsZSg0LjEyKSByb3RhdGUoOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NTYsMTQ0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgwLDE0NCkgc2NhbGUoNC4xMikgcm90YXRlKC03KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwNCwxNDQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MjgsMTQ0KSBzY2FsZSg0LjEyKSByb3RhdGUoOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDAsMTY4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzEyLDE2OCkgc2NhbGUoNC4xMikgcm90YXRlKC02KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4MCwxNjgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCwxNjgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDAsMTkyKSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODgsMTkyKSBzY2FsZSg0LjEyKSByb3RhdGUoOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzYsMTkyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM4NCwxOTIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzIsMTkyKSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0ODAsMTkyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCwxOTIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgyKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0MCwyMTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjQsMjE2KSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODgsMjE2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzEyLDIxNikgc2NhbGUoNC4xMikgcm90YXRlKC0yKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMzNiwyMTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgyKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM2MCwyMTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MDgsMjE2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDMyLDIxNikgc2NhbGUoNC4xMikgcm90YXRlKC04KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4MCwyMTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgyKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk2LDI0MCkgc2NhbGUoNC4xMikgcm90YXRlKC03KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMCwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NCwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSg2KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5MiwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSg1KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0MCwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSg1KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxMiwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSg2KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM2MCwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzg0LDI0MCkgc2NhbGUoNC4xMikgcm90YXRlKC02KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwOCwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSgxMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzIsMjQwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgwLDI0MCkgc2NhbGUoNC4xMikgcm90YXRlKC01KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwNCwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSgxMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTIsMjQwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTc2LDI0MCkgc2NhbGUoNC4xMikgcm90YXRlKDYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLDI0MCkgc2NhbGUoNC4xMikgcm90YXRlKC0zKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY3MiwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSg0KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY5NiwyNDApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MjAsMjQwKSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MiwyNjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5NiwyNjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAsMjY0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ0LDI2NCkgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE2LDI2NCkgc2NhbGUoNC4xMikgcm90YXRlKC0xKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0MCwyNjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMTIsMjY0KSBzY2FsZSg0LjEyKSByb3RhdGUoMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsMjY0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDA4LDI2NCkgc2NhbGUoNC4xMikgcm90YXRlKC01KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4MCwyNjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDQsMjY0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI4LDI2NCkgc2NhbGUoNC4xMikgcm90YXRlKDApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTUyLDI2NCkgc2NhbGUoNC4xMikgcm90YXRlKC02KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3NiwyNjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgyKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwMCwyNjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MjQsMjY0KSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NDgsMjY0KSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NzIsMjY0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzIwLDI2NCkgc2NhbGUoNC4xMikgcm90YXRlKC00KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4LDI4OCkgc2NhbGUoNC4xMikgcm90YXRlKDUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIwLDI4OCkgc2NhbGUoNC4xMikgcm90YXRlKC03KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5MiwyODgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjQsMjg4KSBzY2FsZSg0LjEyKSByb3RhdGUoNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMTIsMjg4KSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzYsMjg4KSBzY2FsZSg0LjEyKSByb3RhdGUoOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsMjg4KSBzY2FsZSg0LjEyKSByb3RhdGUoMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsMjg4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDA4LDI4OCkgc2NhbGUoNC4xMikgcm90YXRlKDEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzMiwyODgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1NiwyODgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3NiwyODgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NzIsMjg4KSBzY2FsZSg0LjEyKSByb3RhdGUoMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgsMzEyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzIsMzEyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTYsMzEyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIwLDMxMikgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE2LDMxMikgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzM2LDMxMikgc2NhbGUoNC4xMikgcm90YXRlKC0xMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsMzEyKSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MDgsMzEyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI4LDMxMikgc2NhbGUoNC4xMikgcm90YXRlKDUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTc2LDMxMikgc2NhbGUoNC4xMikgcm90YXRlKC01KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYyNCwzMTIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NDgsMzEyKSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OTYsMzEyKSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0OCwzMzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MiwzMzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5NiwzMzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg1KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMCwzMzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg3KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NCwzMzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgxMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTIsMzM2KSBzY2FsZSg0LjEyKSByb3RhdGUoNikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTYsMzM2KSBzY2FsZSg0LjEyKSByb3RhdGUoOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjQsMzM2KSBzY2FsZSg0LjEyKSByb3RhdGUoMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsMzM2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDA4LDMzNikgc2NhbGUoNC4xMikgcm90YXRlKDUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDU2LDMzNikgc2NhbGUoNC4xMikgcm90YXRlKC03KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwNCwzMzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg2KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCwzMzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTIsMzM2KSBzY2FsZSg0LjEyKSByb3RhdGUoOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NzIsMzM2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjk2LDMzNikgc2NhbGUoNC4xMikgcm90YXRlKDEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzIwLDMzNikgc2NhbGUoNC4xMikgcm90YXRlKDMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgsMzYwKSBzY2FsZSg0LjEyKSByb3RhdGUoMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ0LDM2MCkgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQwLDM2MCkgc2NhbGUoNC4xMikgcm90YXRlKC03KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4OCwzNjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsMzYwKSBzY2FsZSg0LjEyKSByb3RhdGUoOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MDgsMzYwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDU2LDM2MCkgc2NhbGUoNC4xMikgcm90YXRlKC05KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4MCwzNjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgxKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwNCwzNjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCwzNjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTIsMzYwKSBzY2FsZSg0LjEyKSByb3RhdGUoOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NzYsMzYwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjI0LDM2MCkgc2NhbGUoNC4xMikgcm90YXRlKDcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjQ4LDM2MCkgc2NhbGUoNC4xMikgcm90YXRlKDApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjk2LDM2MCkgc2NhbGUoNC4xMikgcm90YXRlKC03KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcyMCwzNjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAsMzg0KSBzY2FsZSg0LjEyKSByb3RhdGUoNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQsMzg0KSBzY2FsZSg0LjEyKSByb3RhdGUoOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjgsMzg0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkyLDM4NCkgc2NhbGUoNC4xMikgcm90YXRlKDEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxNiwzODQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsMzg0KSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzIsMzg0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDU2LDM4NCkgc2NhbGUoNC4xMikgcm90YXRlKDkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgwLDM4NCkgc2NhbGUoNC4xMikgcm90YXRlKC01KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCwzODQpIHNjYWxlKDQuMTIpIHJvdGF0ZSg2KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY5NiwzODQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAsNDA4KSBzY2FsZSg0LjEyKSByb3RhdGUoOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjgsNDA4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY0LDQwOCkgc2NhbGUoNC4xMikgcm90YXRlKC05KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4OCw0MDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsNDA4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzg0LDQwOCkgc2NhbGUoNC4xMikgcm90YXRlKDEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzMiw0MDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSg5KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1Niw0MDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0ODAsNDA4KSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NDgsNDA4KSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OTYsNDA4KSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0OCw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcyLDQzMikgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIwLDQzMikgc2NhbGUoNC4xMikgcm90YXRlKC0zKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NCw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSg1KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2OCw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSg5KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5Miw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSg0KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxNiw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDAsNDMyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY0LDQzMikgc2NhbGUoNC4xMikgcm90YXRlKC05KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxMiw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzYsNDMyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzYwLDQzMikgc2NhbGUoNC4xMikgcm90YXRlKDMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzg0LDQzMikgc2NhbGUoNC4xMikgcm90YXRlKDEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwOCw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSg4KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0OCw0MzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NzIsNDMyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzIwLDQzMikgc2NhbGUoNC4xMikgcm90YXRlKC04KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4LDQ1Nikgc2NhbGUoNC4xMikgcm90YXRlKC05KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcyLDQ1Nikgc2NhbGUoNC4xMikgcm90YXRlKC04KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NCw0NTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDAsNDU2KSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODgsNDU2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzg0LDQ1Nikgc2NhbGUoNC4xMikgcm90YXRlKC0xKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzMiw0NTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NTYsNDU2KSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0ODAsNDU2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTA0LDQ1Nikgc2NhbGUoNC4xMikgcm90YXRlKDEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCw0NTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg3KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3Niw0NTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLDQ1Nikgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjI0LDQ1Nikgc2NhbGUoNC4xMikgcm90YXRlKDcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjQ4LDQ1Nikgc2NhbGUoNC4xMikgcm90YXRlKC01KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY3Miw0NTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg1KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY5Niw0NTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcyMCw0NTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg2KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4LDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKDYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkyLDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKDcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY0LDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg4LDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzEyLDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKC0xKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMzNiw0ODApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsNDgwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzg0LDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKDMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDA4LDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKDgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDMyLDQ4MCkgc2NhbGUoNC4xMikgcm90YXRlKC0yKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCw0ODApIHNjYWxlKDQuMTIpIHJvdGF0ZSg3KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3Niw0ODApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAsNDgwKSBzY2FsZSg0LjEyKSByb3RhdGUoNikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NDgsNDgwKSBzY2FsZSg0LjEyKSByb3RhdGUoMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgsNTA0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTYsNTA0KSBzY2FsZSg0LjEyKSByb3RhdGUoNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQsNTA0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTY4LDUwNCkgc2NhbGUoNC4xMikgcm90YXRlKC01KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0MCw1MDQpIHNjYWxlKDQuMTIpIHJvdGF0ZSg2KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NCw1MDQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgxMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMTIsNTA0KSBzY2FsZSg0LjEyKSByb3RhdGUoNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsNTA0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTA0LDUwNCkgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTc2LDUwNCkgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLDUwNCkgc2NhbGUoNC4xMikgcm90YXRlKDEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0OCw1MDQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OTYsNTA0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgsNTI4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTYsNTI4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIwLDUyOCkgc2NhbGUoNC4xMikgcm90YXRlKDcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ0LDUyOCkgc2NhbGUoNC4xMikgcm90YXRlKDUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTY4LDUyOCkgc2NhbGUoNC4xMikgcm90YXRlKC0yKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5Miw1MjgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4OCw1MjgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAsNTI4KSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MjgsNTI4KSBzY2FsZSg0LjEyKSByb3RhdGUoMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTUyLDUyOCkgc2NhbGUoNC4xMikgcm90YXRlKDgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTc2LDUyOCkgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLDUyOCkgc2NhbGUoNC4xMikgcm90YXRlKC04KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYyNCw1MjgpIHNjYWxlKDQuMTIpIHJvdGF0ZSg0KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY3Miw1MjgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OTYsNTI4KSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MjAsNTI4KSBzY2FsZSg0LjEyKSByb3RhdGUoMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDAsNTUyKSBzY2FsZSg0LjEyKSByb3RhdGUoMTApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY0LDU1Mikgc2NhbGUoNC4xMikgcm90YXRlKDgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg4LDU1Mikgc2NhbGUoNC4xMikgcm90YXRlKDcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzEyLDU1Mikgc2NhbGUoNC4xMikgcm90YXRlKC0zKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM4NCw1NTIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1Niw1NTIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MjgsNTUyKSBzY2FsZSg0LjEyKSByb3RhdGUoOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MjQsNTUyKSBzY2FsZSg0LjEyKSByb3RhdGUoNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NDgsNTUyKSBzY2FsZSg0LjEyKSByb3RhdGUoNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OTYsNTUyKSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MjAsNTUyKSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjQsNTc2KSBzY2FsZSg0LjEyKSByb3RhdGUoMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzYsNTc2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzYwLDU3Nikgc2NhbGUoNC4xMikgcm90YXRlKDMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDMyLDU3Nikgc2NhbGUoNC4xMikgcm90YXRlKDYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDU2LDU3Nikgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgwLDU3Nikgc2NhbGUoNC4xMikgcm90YXRlKDEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTA0LDU3Nikgc2NhbGUoNC4xMikgcm90YXRlKDkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI4LDU3Nikgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTc2LDU3Nikgc2NhbGUoNC4xMikgcm90YXRlKC0zKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYyNCw1NzYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjQsNjAwKSBzY2FsZSg0LjEyKSByb3RhdGUoMykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODgsNjAwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzEyLDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKDgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzg0LDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKDgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDMyLDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDU2LDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKDEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTA0LDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKDYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI4LDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKDEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjI0LDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKDkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjQ4LDYwMCkgc2NhbGUoNC4xMikgcm90YXRlKC03KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0MCw2MjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSg3KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxMiw2MjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSg0KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM2MCw2MjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsNjI0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDA4LDYyNCkgc2NhbGUoNC4xMikgcm90YXRlKC0zKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzMiw2MjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSg3KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCw2MjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTIsNjI0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTEwKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3Niw2MjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAsNjI0KSBzY2FsZSg0LjEyKSByb3RhdGUoLTkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjI0LDYyNCkgc2NhbGUoNC4xMikgcm90YXRlKDApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjQ4LDYyNCkgc2NhbGUoNC4xMikgcm90YXRlKDcpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjcyLDYyNCkgc2NhbGUoNC4xMikgcm90YXRlKC0xKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY5Niw2MjQpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDAsNjQ4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjY0LDY0OCkgc2NhbGUoNC4xMikgcm90YXRlKDkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg4LDY0OCkgc2NhbGUoNC4xMikgcm90YXRlKC01KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM4NCw2NDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSg5KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1Niw2NDgpIHNjYWxlKDQuMTIpIHJvdGF0ZSgxMCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0ODAsNjQ4KSBzY2FsZSg0LjEyKSByb3RhdGUoLTQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLDY0OCkgc2NhbGUoNC4xMikgcm90YXRlKDYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjQ4LDY0OCkgc2NhbGUoNC4xMikgcm90YXRlKDMpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQwLDY3Mikgc2NhbGUoNC4xMikgcm90YXRlKC05KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NCw2NzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4OCw2NzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgzKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxMiw2NzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNykiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzYsNjcyKSBzY2FsZSg0LjEyKSByb3RhdGUoOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQsNjcyKSBzY2FsZSg0LjEyKSByb3RhdGUoMikiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MDgsNjcyKSBzY2FsZSg0LjEyKSByb3RhdGUoLTYpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDMyLDY3Mikgc2NhbGUoNC4xMikgcm90YXRlKDApIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTc2LDY3Mikgc2NhbGUoNC4xMikgcm90YXRlKC04KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYyNCw2NzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSg3KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0OCw2NzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSg2KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY5Niw2NzIpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzYsNjk2KSBzY2FsZSg0LjEyKSByb3RhdGUoLTkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzYwLDY5Nikgc2NhbGUoNC4xMikgcm90YXRlKC02KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwOCw2OTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg0KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzMiw2OTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgyKSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwNCw2OTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg5KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUyOCw2OTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSg0KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYyNCw2OTYpIHNjYWxlKDQuMTIpIHJvdGF0ZSgtNCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OTYsNjk2KSBzY2FsZSg0LjEyKSByb3RhdGUoMSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjQsNzIwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTEpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg4LDcyMCkgc2NhbGUoNC4xMikgcm90YXRlKDUpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzM2LDcyMCkgc2NhbGUoNC4xMikgcm90YXRlKDQpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzYwLDcyMCkgc2NhbGUoNC4xMikgcm90YXRlKDgpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzg0LDcyMCkgc2NhbGUoNC4xMikgcm90YXRlKDkpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDA4LDcyMCkgc2NhbGUoNC4xMikgcm90YXRlKC05KSI+PHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1Niw3MjApIHNjYWxlKDQuMTIpIHJvdGF0ZSgtOSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDQsNzIwKSBzY2FsZSg0LjEyKSByb3RhdGUoOCkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTIsNzIwKSBzY2FsZSg0LjEyKSByb3RhdGUoNSkiPjxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MjQsNzIwKSBzY2FsZSg0LjEyKSByb3RhdGUoLTIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjcyLDcyMCkgc2NhbGUoNC4xMikgcm90YXRlKDIpIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgsNDgpIj48ZyB0cmFuc2Zvcm09InNjYWxlKDEyKSI+PHBhdGggZD0iTTAuMiwwLjFMMC4xLDAuNmwwLjEsMC41TDAuMiwxLjZMMC4xLDIuMWwwLjEsMC41TDAsMy4xbDAsMC41TDAsNGwwLjEsMC41bDAsMC41bDAuMSwwLjVMMC4xLDZsMCwwLjVsMCwwLjUgbDAuMiwwLjVMMC4xLDhsMC4xLDAuNUwwLDguOWwwLjIsMC41TDAsOS45bDAuMiwwLjVsLTAuMSwwLjVsMCwwLjVMMCwxMS45bDAuMiwwLjVsLTAuMSwwLjVsMC4xLDAuNWwwLDAuNEwwLjYsMTRsMC41LDBsMC41LTAuMSBsMC41LDAuMWwwLjUsMC4xTDMuMSwxNGwwLjUtMC4xbDAuNS0wLjFsMC41LDBMNSwxMy45bDAuNS0wLjFsMC41LDBsMC41LDBMNywxMy45TDcuNSwxNEw4LDE0bDAuNS0wLjJMOSwxMy45TDkuNCwxNGwwLjUtMC4yIGwwLjUsMC4ybDAuNS0wLjFsMC41LDBsMC41LTAuMWwwLjUsMGwwLjUsMGwwLjUsMGwwLjUsMC4xbC0wLjEtMC41bDAuMi0wLjVsLTAuMS0wLjVsLTAuMS0wLjVsMC4yLTAuNWwtMC4yLTAuNWwwLjEtMC41TDE0LDkuOSBsLTAuMi0wLjVMMTMuOSw5TDE0LDguNUwxNCw4bC0wLjItMC41bDAtMC41bDAuMS0wLjVMMTMuOCw2bDAtMC41TDE0LDVsMC0wLjVsLTAuMS0wLjVsMC4xLTAuNWwtMC4yLTAuNWwwLjEtMC41bDAtMC41bDAtMC41IGwtMC4xLTAuNUwxNCwwLjZsLTAuMi0wLjRsLTAuNCwwbC0wLjUsMEwxMi40LDBsLTAuNSwwLjJsLTAuNSwwbC0wLjUtMC4xbC0wLjUsMEwxMCwwbC0wLjUsMEw5LDBMOC41LDAuMkw4LDAuMkw3LjUsMC4xTDcsMC4xIEw2LjUsMC4yTDYsMEw1LjUsMC4yTDUuMSwwLjJMNC42LDAuMUw0LjEsMC4xTDMuNiwwTDMuMSwwLjFMMi42LDBMMi4xLDAuMWwtMC41LDBsLTAuNSwwTDAuNiwwLjJMMC4yLDAuMXogTTExLjksMTEuOWwtMC41LTAuMSBMMTAuOSwxMmwtMC41LTAuMUwxMCwxMS45bC0wLjUsMC4xTDksMTEuOGwtMC41LDBsLTAuNSwwbC0wLjUsMC4xbC0wLjUsMEw2LjUsMTJMNiwxMS45bC0wLjUsMGwtMC41LDBMNC42LDEybC0wLjUtMC4yTDMuNiwxMiBsLTAuNS0wLjFMMi42LDEybC0wLjQtMC4xTDIsMTEuNGwwLjEtMC41bDAtMC41bDAuMS0wLjVMMiw5LjVMMi4xLDlMMiw4LjVMMiw4bDAuMi0wLjVsMC0wLjVMMiw2LjVMMi4xLDZsMC4xLTAuNUwyLjIsNUwyLjEsNC41IEwyLDQuMWwwLTAuNWwwLjItMC41TDIsMi42TDIsMmwwLjUsMGwwLjUsMC4xbDAuNSwwLjFsMC41LDBMNC41LDJMNSwyLjFsMC41LDAuMUw2LDJsMC41LDAuMkw3LDIuMWwwLjUsMEw4LDJsMC41LDBMOSwybDAuNSwwIGwwLjUsMC4xTDEwLjQsMmwwLjUsMC4yTDExLjQsMkwxMiwybC0wLjEsMC42TDEyLDMuMWwtMC4xLDAuNUwxMS44LDRMMTIsNC41TDExLjksNWwtMC4xLDAuNWwwLDAuNUwxMiw2LjVMMTIsN2wtMC4xLDAuNUwxMiw4IGwwLDAuNWwtMC4yLDAuNWwwLDAuNWwwLjEsMC41bC0wLjEsMC41bDAuMiwwLjVsLTAuMSwwLjVMMTEuOSwxMS45eiIvPjwvZz48L2c+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3Niw0OCkiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMTIpIj48cGF0aCBkPSJNMC4yLDAuMUwwLjEsMC42bDAuMSwwLjVMMC4yLDEuNkwwLjEsMi4xbDAuMSwwLjVMMCwzLjFsMCwwLjVMMCw0bDAuMSwwLjVsMCwwLjVsMC4xLDAuNUwwLjEsNmwwLDAuNWwwLDAuNSBsMC4yLDAuNUwwLjEsOGwwLjEsMC41TDAsOC45bDAuMiwwLjVMMCw5LjlsMC4yLDAuNWwtMC4xLDAuNWwwLDAuNUwwLDExLjlsMC4yLDAuNWwtMC4xLDAuNWwwLjEsMC41bDAsMC40TDAuNiwxNGwwLjUsMGwwLjUtMC4xIGwwLjUsMC4xbDAuNSwwLjFMMy4xLDE0bDAuNS0wLjFsMC41LTAuMWwwLjUsMEw1LDEzLjlsMC41LTAuMWwwLjUsMGwwLjUsMEw3LDEzLjlMNy41LDE0TDgsMTRsMC41LTAuMkw5LDEzLjlMOS40LDE0bDAuNS0wLjIgbDAuNSwwLjJsMC41LTAuMWwwLjUsMGwwLjUtMC4xbDAuNSwwbDAuNSwwbDAuNSwwbDAuNSwwLjFsLTAuMS0wLjVsMC4yLTAuNWwtMC4xLTAuNWwtMC4xLTAuNWwwLjItMC41bC0wLjItMC41bDAuMS0wLjVMMTQsOS45IGwtMC4yLTAuNUwxMy45LDlMMTQsOC41TDE0LDhsLTAuMi0wLjVsMC0wLjVsMC4xLTAuNUwxMy44LDZsMC0wLjVMMTQsNWwwLTAuNWwtMC4xLTAuNWwwLjEtMC41bC0wLjItMC41bDAuMS0wLjVsMC0wLjVsMC0wLjUgbC0wLjEtMC41TDE0LDAuNmwtMC4yLTAuNGwtMC40LDBsLTAuNSwwTDEyLjQsMGwtMC41LDAuMmwtMC41LDBsLTAuNS0wLjFsLTAuNSwwTDEwLDBsLTAuNSwwTDksMEw4LjUsMC4yTDgsMC4yTDcuNSwwLjFMNywwLjEgTDYuNSwwLjJMNiwwTDUuNSwwLjJMNS4xLDAuMkw0LjYsMC4xTDQuMSwwLjFMMy42LDBMMy4xLDAuMUwyLjYsMEwyLjEsMC4xbC0wLjUsMGwtMC41LDBMMC42LDAuMkwwLjIsMC4xeiBNMTEuOSwxMS45bC0wLjUtMC4xIEwxMC45LDEybC0wLjUtMC4xTDEwLDExLjlsLTAuNSwwLjFMOSwxMS44bC0wLjUsMGwtMC41LDBsLTAuNSwwLjFsLTAuNSwwTDYuNSwxMkw2LDExLjlsLTAuNSwwbC0wLjUsMEw0LjYsMTJsLTAuNS0wLjJMMy42LDEyIGwtMC41LTAuMUwyLjYsMTJsLTAuNC0wLjFMMiwxMS40bDAuMS0wLjVsMC0wLjVsMC4xLTAuNUwyLDkuNUwyLjEsOUwyLDguNUwyLDhsMC4yLTAuNWwwLTAuNUwyLDYuNUwyLjEsNmwwLjEtMC41TDIuMiw1TDIuMSw0LjUgTDIsNC4xbDAtMC41bDAuMi0wLjVMMiwyLjZMMiwybDAuNSwwbDAuNSwwLjFsMC41LDAuMWwwLjUsMEw0LjUsMkw1LDIuMWwwLjUsMC4xTDYsMmwwLjUsMC4yTDcsMi4xbDAuNSwwTDgsMmwwLjUsMEw5LDJsMC41LDAgbDAuNSwwLjFMMTAuNCwybDAuNSwwLjJMMTEuNCwyTDEyLDJsLTAuMSwwLjZMMTIsMy4xbC0wLjEsMC41TDExLjgsNEwxMiw0LjVMMTEuOSw1bC0wLjEsMC41bDAsMC41TDEyLDYuNUwxMiw3bC0wLjEsMC41TDEyLDggbDAsMC41bC0wLjIsMC41bDAsMC41bDAuMSwwLjVsLTAuMSwwLjVsMC4yLDAuNWwtMC4xLDAuNUwxMS45LDExLjl6Ii8+PC9nPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgsNTc2KSI+PGcgdHJhbnNmb3JtPSJzY2FsZSgxMikiPjxwYXRoIGQ9Ik0wLjIsMC4xTDAuMSwwLjZsMC4xLDAuNUwwLjIsMS42TDAuMSwyLjFsMC4xLDAuNUwwLDMuMWwwLDAuNUwwLDRsMC4xLDAuNWwwLDAuNWwwLjEsMC41TDAuMSw2bDAsMC41bDAsMC41IGwwLjIsMC41TDAuMSw4bDAuMSwwLjVMMCw4LjlsMC4yLDAuNUwwLDkuOWwwLjIsMC41bC0wLjEsMC41bDAsMC41TDAsMTEuOWwwLjIsMC41bC0wLjEsMC41bDAuMSwwLjVsMCwwLjRMMC42LDE0bDAuNSwwbDAuNS0wLjEgbDAuNSwwLjFsMC41LDAuMUwzLjEsMTRsMC41LTAuMWwwLjUtMC4xbDAuNSwwTDUsMTMuOWwwLjUtMC4xbDAuNSwwbDAuNSwwTDcsMTMuOUw3LjUsMTRMOCwxNGwwLjUtMC4yTDksMTMuOUw5LjQsMTRsMC41LTAuMiBsMC41LDAuMmwwLjUtMC4xbDAuNSwwbDAuNS0wLjFsMC41LDBsMC41LDBsMC41LDBsMC41LDAuMWwtMC4xLTAuNWwwLjItMC41bC0wLjEtMC41bC0wLjEtMC41bDAuMi0wLjVsLTAuMi0wLjVsMC4xLTAuNUwxNCw5LjkgbC0wLjItMC41TDEzLjksOUwxNCw4LjVMMTQsOGwtMC4yLTAuNWwwLTAuNWwwLjEtMC41TDEzLjgsNmwwLTAuNUwxNCw1bDAtMC41bC0wLjEtMC41bDAuMS0wLjVsLTAuMi0wLjVsMC4xLTAuNWwwLTAuNWwwLTAuNSBsLTAuMS0wLjVMMTQsMC42bC0wLjItMC40bC0wLjQsMGwtMC41LDBMMTIuNCwwbC0wLjUsMC4ybC0wLjUsMGwtMC41LTAuMWwtMC41LDBMMTAsMGwtMC41LDBMOSwwTDguNSwwLjJMOCwwLjJMNy41LDAuMUw3LDAuMSBMNi41LDAuMkw2LDBMNS41LDAuMkw1LjEsMC4yTDQuNiwwLjFMNC4xLDAuMUwzLjYsMEwzLjEsMC4xTDIuNiwwTDIuMSwwLjFsLTAuNSwwbC0wLjUsMEwwLjYsMC4yTDAuMiwwLjF6IE0xMS45LDExLjlsLTAuNS0wLjEgTDEwLjksMTJsLTAuNS0wLjFMMTAsMTEuOWwtMC41LDAuMUw5LDExLjhsLTAuNSwwbC0wLjUsMGwtMC41LDAuMWwtMC41LDBMNi41LDEyTDYsMTEuOWwtMC41LDBsLTAuNSwwTDQuNiwxMmwtMC41LTAuMkwzLjYsMTIgbC0wLjUtMC4xTDIuNiwxMmwtMC40LTAuMUwyLDExLjRsMC4xLTAuNWwwLTAuNWwwLjEtMC41TDIsOS41TDIuMSw5TDIsOC41TDIsOGwwLjItMC41bDAtMC41TDIsNi41TDIuMSw2bDAuMS0wLjVMMi4yLDVMMi4xLDQuNSBMMiw0LjFsMC0wLjVsMC4yLTAuNUwyLDIuNkwyLDJsMC41LDBsMC41LDAuMWwwLjUsMC4xbDAuNSwwTDQuNSwyTDUsMi4xbDAuNSwwLjFMNiwybDAuNSwwLjJMNywyLjFsMC41LDBMOCwybDAuNSwwTDksMmwwLjUsMCBsMC41LDAuMUwxMC40LDJsMC41LDAuMkwxMS40LDJMMTIsMmwtMC4xLDAuNkwxMiwzLjFsLTAuMSwwLjVMMTEuOCw0TDEyLDQuNUwxMS45LDVsLTAuMSwwLjVsMCwwLjVMMTIsNi41TDEyLDdsLTAuMSwwLjVMMTIsOCBsMCwwLjVsLTAuMiwwLjVsMCwwLjVsMC4xLDAuNWwtMC4xLDAuNWwwLjIsMC41bC0wLjEsMC41TDExLjksMTEuOXoiLz48L2c+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Niw5NikiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMTIpIj48cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PC9nPjwvZz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjI0LDk2KSI+PGcgdHJhbnNmb3JtPSJzY2FsZSgxMikiPjxyZWN0IHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48L2c+PC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Niw2MjQpIj48ZyB0cmFuc2Zvcm09InNjYWxlKDEyKSI+PHJlY3Qgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjwvZz48L2c+CjwvZz48aW1hZ2UgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFQUUFBQUQwQ0FZQUFBQ3NMd3YrQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQVNGUkpSRUZVZU5yc2ZRZWNYWFdWLy9mMU5yMW5acEpNTXVtVk5FaElJRUZBUWNDNnU0SzdLT3lLQ2haMC93ajJnckoyRkJVNzZ5SnJXUlZFSWFCSUtDRUprSVJBS3VsMWtra3l2YjFlL3VmODdwMHdTV2JldTNQdmUvZTlOKzkzL0J3bkpQUHV1L2QzZjkvZjZlZFlFb2tFSkVtU05EYklLcGRBa2lRSmFFbVNKRWxBUzVJa0taTmtsMHVRVnJLb3pBZWxtM2c1OFNVcUx5UjJqWkhuakJQSGlJUEVQY1FkeE51STF4R3ZKVDZtL2s3aUhKYVU2UTBvbldKcEJmTVZLbmhYcUFCMnFJZW1mWXhyUTd5Sm91Y3dnL3hsNGhlSTF4UHZrRnRFQWpwZmFEengvY1J2SnJhcGJKSExja2FTTS9jTkFUZi8zQ1NYUndJNjE0Z2w4TWVJdnlsQnJGbVNKMVNnKzRrZlZ3SCtQUEh1SVdxNkpBbG9VNG5WNTByaUh4QmZMNWZETUlXSTF4RC9sdmhGNHFPcVZKZWJVd0xhRkRCZlEveEQ0b2x5T2RKT3A0aC9SdndvOFM0VjdKSWtvRE5HRE9hL1FvYjhNazBEeEE4Uy80UjRMM0ZZTG9rRWRMcHBFaFJuVHFWY0N0T0liZTI3aVI4ZzdsVHRiRWtTMEliSlMvd0g0cXVsZE00S0hTRCtDSlE0ZDBBdXg4ajJvS1RVeEI3c080bXZrbXVXTldwV1RaMDdpR3ZrY2tnSmJZUXVKMTZOc1pQcGxlLzBMUEduaVYrQjRnMlhKQUd0bVRpRmt4TWhGc3VseUNrNlNYd3I4V01TMUZMbEhnMWRSenhkTGtQT1VSM3h6NGx2Z0pMZ0kwa0NXaFBkUWx3c2x5RW5xUnFLOS9zL2lKMXlPU1NnVTFFVjhTeTVERGxORE9RZkU5OEl4WGxaMENUTEo1TVRWMDBaZG9RZGIrdkhxenRQSUJGUEFKWjhUdmRXL0MwV2VnYWJsZGh1aGNOaGg5dHRSM21wQnczVnhTajJaRVg3NVVYOURwU1k5ZThrb0NXTlJFdU5xTnZzYjF5ejZRanUvODFHUFBySWEwQWtUbHZQbXJkQVB2UFRSdml4a3pBa0lMdDlMZ0hteVJNcnNHUjJQWmJPcW9QVFlZWEg0MFJOZFJIbVRxMkJ3MnJLSVZaRy9EMG9WVjJyVWFCNTROTExuWnllaGhLeUdqVkZZbkU4cy9rby92VS9IMEhIMFU1NEtvdkd6S0lrMVAvanZST1BLeHlMeG9Bd2M0UU1PWkxlNVY3TW1GYURkMTQySGJPYXlsRlc1c1dDV2VOUVYrSE45TzF4QXNxL0VHK1JnSlkwbEVxSU54TlAxZlBoVXgwRGVNc0gvaGRidDdiQ1N4S3NrTlpaMUVmR0VvVHRLQ25CQlBCNEZFWGp5dkMyeTJmZ3pSZE5RR05qT1M1Zmt0RzZsaWVJM3d1bG00b0V0Q1JCM0gyRWl3UHFSL3ZCS0czbXg1N2JpM2U5OTcvaHJhOUFvYTh4UDMwc0drZkVIeWJWSllLRzZiWDQ5M2ZPeC96cE5iaVdKTGpMbGhFejVQK3BLbmhDQWxvUzB4ZUk3eUwyamZhRDdUMEIzUHlsMVZqOTVPdHdlMlNJOUZ4d2g4TlJ4UHVDS0tvdHhvM3Z2QUJYcjVpRTYxWk9TL2RYZFJGZkM2VytPaUVCTFlrTE1mNEpPcnFRSEQ3UmpRdHYrRzkwZHdaaHQ4bkk0SWgraGtnYzBmNGdhaWFVNFNQL3VnVHZmc3Nzeko2VTFrSzJEYW9QSkZnb2F5cDMyOGhVRFowdGhhSzBVVHZiQjJDenl1Vk5SZzcyaHBkNzBkYnV4NWUrL1RSdStlTGplUHo1ZmVuOGlvdUozMTlJYXlwMzNNaGtJUE1vZ1ZoL09MOUR6aWFTMjJXSHkrZkJpeHNPNFpZdlBJYUhIdHVXenN0L2xYaWFCSFJoVTVFZTIzbVEvS0dZN0lZMTJvMUlPOUZiN01iSjFuNTg5TXRQNE1kL2VDV2RtdGIxRXRDRlRmT0l5L1Y4TUJ5SllkM1dFNlJQeXB5ZDBlczFCT29pSjNyN3d2ak0xNS9Dei82VXRsRHloNkF6L0NnQlBUYUlNOFFxOUh5d0x4REIzelljZ05WcGs2dW9COVNFYXEvUGhkNkJDRDcvelgvZzBXZjJwT095OWFvOWJaV0FMa3lhclZmbERvVWkyTDc3Skd6U3UyMEExQWw0Q05UdFhVRjg0ci8ram1jMkhVN0haVCtJQWpDRTVLNGJubXFoMDhNZElaVzd0YldIYkVMcEVUTXFxajFGTGh3NTFJbHYvZXBsSERoaE9PbHJHZkY4Q2VqQ0pMZmVEOFpwSTRiNmdoTFFhU0luU2VwbjErekJrOGJEV2Z4Q0xodnJlMTRDK256aTFLNWkvYnVHOWsxTXVyalRSVnltR2FIbHZQZkJsL0RNUnNPcTkzSUo2TUswbjNWNXVMbkNhc1AyVnNBdVBkenBKSmZYaVVPN1RtTGRLOGVNWG1vVnhuai9NUW5vOCtsQ0tKMUtSazJCVUJTclh6Z0FpME42dU5OSnJDdmJ2RzQ4OE9ldFdHUE1RY1o1cGRNa29BdFBRcGZxK1dBNEhNT3J1MDdJL08xTTJFRnVPNDYrZmhJSEQzZWtRKzIyU0VBWER0WHJYWmRvTklaako3cGdzMG1IV0Nha05KeDJQTEgrRUE2ZDdEVnlxUlZTUWhjVzZVNzU1S0wrZ2U2QTZMa2xLUU5TMnVQRVUrc09rQmJVYXVReUs2V0VMaXpTM1NPSFExV0ppUFJ3WjRxNEthSC9WQys2T3YxR0xqTWVZM2pnblFUMDJjUU45WFU1eEdMeEJEYnZQVTI3VGpyRU1xcDJKeXpvRzRnWU9oZUlGMGxBRndieGk2N1c4OEZnS0lySDErNkQxUzZYTktQa3NtUGR0dU5vYWV1WGRyUUVkRXJpS2l0ZExUTWkwUmcyYno4aGM3Z3pia2pic090Z0c0NmY3ak1pNkpkTFFCY0dOVURuOUlWb0xJNGp4enBseW1lbU42elZpcDdlSVB5QnNCRkExMHBBRndicGI2cFBOblIzbHg4V0Nlak1ibGhhM2dFQ2N5aHNLT0dyVkFKNjdCTWpVZmZZbTNpY3BIUW9CZ25uREw4a2l3V2hVRlJVdFJrZ253VDAyS2Z4UmxReFVkNW5rY3RwQmlYaVNpTUVBOFRKOWlVUzBHT2JGaERYNlBrZ3EzK1BQTHRYZXJoTkl1NFdhck1iMG9XYWlCK0cwanR1VEpFc0MzcUQ1dXNGTkZkWnZmamEwUnhvMjV2Z1J1dkk3Y1ljbGpkK1dzUWREL243MVBmTjNVeWNUanNjeGc5UG5vekNrelZ1aHpLMVVnSjZqRkVqbEZwb0hmWnpISWNPWjlmRGJZM0hZSThNd0I0THdoS1BFanh5QTlRQ3NCYkxrSjlXd2JEYWtMRFlFTFBaeGM4RW1Tc0prVEpyVVg5YXoxemhyTFdtLy9SNW5YQTUwN0oxUDBEY0FxWFZiMXdDZW15UklROTNaK2NBN2Rmc1pJbFpZMUY0L08yd3hVTXFHSVpLd216TDQvTVBGa3NDNTRFMVFRQ1BXeDJJTWR1ZDlOT2xIQUFxMkFkL1B4Nk5vYjZtR09XbGFadGl5U09QMWtPWk5Db0JQWWJJYldEWEloeUt3dTNPRHFEZHdRNVlFK0VoR3o4WFZld2hCNkJsbUg4alZkb2FDOEVXRGRGaUtrQ1AyNXlJT0R3a3hkMEM3SEVDUGMvWW5qMmxHbzAxYVROLythWHhzUGdyaWR2eWZSTkxMNDVDVlhydFo5NTZMYWY3RlRVeUd5ZHlkQUMyV0Joam80QklVYmNWOWR0S3BrTUVybUFQdlA1VDhBVGE0UXozQTRFQTVqZFhvS0xZbmM0djVnekJiMkVNaExNa29CVmFTRHhPendkanNUaisvTncrMkxOU2xHRWh1M2tzejJGVHdVM2IxRXFTMnozUUJnZDZzYTh2aGozZDBYU3JFVHhQK20wUzBHT0Q1aExYNmZrZ3o0Sis0WldqN09NeG5WaDF0Y1VpaGZHR1dIS1RPbFJaVzR6L09SVEV6YzkwNG5ldjk2RW5sRFpmRnB1ZjcwT2V4NmNsb0JXYVFPelI4OEY0UElGOUI5dVVicDltNy9FRWg2bGloZk9XT0IydnVBUVZGU1hZMXhuRTdjKzE0WjZYTzlIU0YwMFhGbFlSdjBzQ092OUo5Nm5NSHU2T3R2NnNkQ214eHFNRjlaSVNaTjVZeXNzSTFFVW9zbk1scFFYM2IrM0dIV3Zic0xjekxab0twLzdlU0Z3bUFaM2ZwTnZEWXJkWkVBeEdzakE2MWtLQWpoVFdXNHJIWUtrb2g2VzRXSUNiVzdmVmVHejQ2NEVCM0xXdURmdTdJOFlYVmNrWVhDRUJuYi9FbnMwcXZSOCsyZVZIUEpHZFplVDRjOEhNclNWTnlPSjJ3MG9TMnNKOXo5VmtidjcvV3A4TmZ6L3N4NWMyZEtBOVlOZ0U0UUQzU2duby9DVjJpRFhvM0dOWXZmNkFxTkUxWGYyMEtDcTNwVkJhbUpGMHRsWlZ3bHBXeXFHRnM5ZUMxcURHeTVLNkh6OGhGVHhzYkhJSnE5MFhTMERuTjZBYmRlMHhRdlF6THgxR2RsSzRXZVVPRjR5RVRrUkpHeUZBZ3lSMElqNjhaN3ZNYmNWUHR2WGdoZU1CTVdQTUFISFYzVVFKNlB5a1NkQ2I5cG1JWS9mK05tUWxxWU16cStJRjVPSG01NjJwSWdsZGRwNkVIaVNieFNLazgvZTJkQmtOWjdHVGRKa0VkSDZTN3U0VnJIS2ZQdFdUUllkWW9kalBjZUVJczFaWEszUERra2pmSW9jVjYwaENyejBlUkRTdWUzM1l5NzFFQWpvL1NYZVhFcDZNNlBlSHMzTFR0Z0lLV1NVaUVWanJhbUdwclNIVk83VW4yMjIzNG9FZFBlaVA2cGJTWEhVM1R3STYvNGlUU1NyMWZyZ3ZFQ0VwWUw2NmZjWWhWaWh2S1JhSGRWd3RyQVJvUkZPYkdTNmJCUytkQ09DZ3NmVFFPdVJoTThGQ0IzUXpsQ3d4UFNZZG50NTBCTWpLMkJ0U3VSTVJwUmZQbUZlM1k3Q1VrTHBkUHc0V3AxTlQ3eUYrSTd3eXp4ejFJeFF6cEhZdmxvRE9MK0l1SlUwNjVTUldyOTJmbFpSUHNXbGpoYUZ5SjBLa2JqZU1nM1ZDSXhKaDdlYU55MmJGR2dKMElLb2IwRFg1YUVjWE9xRFp3MTJ1RDg3QXpyMm5zaU9nVVNBZWJwYkdCRXpyK0VaWXE2dDR2S2ZtajNLSG9tMXRJZmoxZHdjbGRVQlU0VWxBNXhHVncwRE02U1IzK3N5R3VzMXFhQ0dvMndSZ2RvYlpKamVOMnAvUEx6VkE2dlorc3FNTnJCU1gxQlpMUU9jUE9mVER5b0wrL2xCMlhscThRRkkrT1Y5N3dualltaVp5YTlWUmY5eHV0UkNndzJLUW9FN2l0aWdUSmFEejU5bXI5WDQ0UWVkK0pBdENVdkZ3RjBCUkJrbG5DNm5aMWhsVGtVZ1JleDZKdUhpanBUL0s1NEplNGp6L1Jnbm8vTEdmZForK2ExNXBNZHJzWGI5dUlISzR4N2lFanNWZ0pjbHNuemFGcEhOSTUwcEJGR3ZFOUs4VlYrRlZTa0RuQjgyQmJnODNoSWM3a1NWUUtWMUt4akNnSXhGWWFxdGhtenNMQ1p0ZC81Z01ub01WU1JoWktlNWk0cFdBemg4SnJUdHhZT3V1Vm1STFNJNTVHOXBxaFcxS3N5S2R3OFl5OGRLd1NoWUo2UHlnU2lQUDMzSzhLMHRnam8xdE1CT0FMZlhqWUw5b3NhSUJKUktRSkFHdDFUN1NUYjA5MmVpMmFWRnJvQlBBV0V6OEpMdlpVbHdFKzRKNXNOYlVDTlZia2dTMFZqSTBJemdTTlY5eXNJZmJNbGFyclBpUXNsaGdJelhiY2VGaVVaQmgvSnFBeTJvb2w0Lzk0eUVKNk55blJ0V0cxa1V2N3p4cEpCUmlVRUtQVVVDelY3dWhIdlkzclZTZUxoNVBCNTVSNGJiQ3FqK2RqOEhjSlFHZCt6UWRTbUdHTG5weS9RSEVzNVNwcFdTSkpjWWNtQzJWRlhCY2Rpa3MzTUFnbXA0OGRjNG5xZkxZWUdDR1lJQzRRd0k2OTJrS2xBSHZ1bWp6OXBaMENCQXBvVlZKYlBINTRGaDJJV3pUcDZUVmJoWVMyaGlnV1VKM1NrRG5QbkdYVDkyRCtvNGU2ODVLREpxYjZvOHA2Y3pQNG5MQnZuZ0I3QmN2UlNLVTNtWVIzRmRzY29rRGR2MHFkei94RVFubzNDZVBrUTkzZC91eklDTXRZeXYrekdCMk9nV1lIVmVzSWpCbnh2ZlVWR0kzVWhISDFUZDVOUXkrRU1mSjh1c3QwcjhQRXdoelNaN0prYVBCSEc2bHlzcVMvMkIyazJSZXRBRE9ONzhKaVhENncxTnNQMDhvc3NQajBDMnorQTBmeXJlbExVUkFjMEdHYm9mWS9oTTlXV2s3OUlhRXpuK2JHVVZGY0N5OUVJNlZ5ek1tbVRsL2UwcTVFdzZySVhWN3J3UjA3dE5VS0U0eFhmVElNM3NSaWNTejB0aEFrZEI1cW5Lcjl5MjgyWmV2aEczK0hDUUNtUXZ4Y2lYY3dsbzNuSGJkTDRxZFlhOUlRT2Mrc1hUV0hZUGV1TFdGSkhRMlhOeGNaWlduYVorOFhtUXZjMTh3NXpWWHdWSlRCUVF5bTYvQkxYd1gxVGhGWW9sTzR2anpheExRK2FGeTYyN2RlL2hvaDVnNGFUcWNFekZZaGYyY1IybWZER1JTWlN4bHBiRE5uUTNIcWt0RTRVV21VenA1bFR3a21hZVh1NHlFckhpQ1FyY0VkTzZUeThpSHU3djh3akZtN3ZoWUFrVWltaitGQ2d4a1hpT2ZENVp4dFhCY3VoeTI1c21LdlJ6TGZDODBsczRMcTkzd09YUy9JNDZmYmM3SHpWMklnRFlVc2dxSHpWZTMyY050ajVMOWpIanVBMWxORkdGYjJYN0JQTmdXTDFDZUlXaGVNVXVZem95TDYxMGtwWFY3dU5sKzNpZ0JuZnZFQlJuVDlYNjRveStVbGJaRGcxMUtrSXRWVmlxSWhXcGRYQXhMZVRuc3MyZkF0bkErTEI2UDBuclhaTTJDZTRpdGFQRENxMTlDOTBvSm5SODB6UWlnLy9qMGJwTFFzYXlBeXBvcmJZY0dhNVJqYWl6ZTY0RzF0QVNXcWlyWVprNkRqY0JzY2JsRWJEbFRJYW5rNmpZd3FjU09xZVVPSTVjNVRkd2lBWjM3MUFRRE1lZ05yeDVEaEVleFpHVTRYWmF5eEJpOGcxS1ltRnNDV1l0SXBTNHBVaVpCMXRmRFBtMHlySTJONHY0NGZUTVJ6RjdGb1o4UWZlM2tFaFE3ZGF2YmZHSnZ5OWNOWG1pQTVta0lQcjBmUG5TNGd3UlRJZ3Z5T1E2cm1zZWRHT3FNTXlLeEUzampnQkJTVi8xdlZRS0xHY3hXcTVDMjNIUUFiQmVUTk9acUtPdTRPdGdtTnRMUGNlSjNFcEd3SW8yenJFSHd0N05YKzhxSlhqR0ZVaWV4Wi9zbENlajhJRU5kU2pvN0I4U1FkNnZWWEEvM1lOc2hkbzV4YWFFWWZzNWdzOWwwWHRJcUpsSUlvbXRZSEtTZU91eGlWS3Y0czlzTmk5dEY2clFYVmdLenBiSWNsdXBxRVQrMmVyeGkzbFFpRXMwSkVBK2xFRW5ueGJWdVRLOXdHcmxNSC9FNkNlajhJRU1kSE1PaExLUmVjZzQzejdGaW16VWNFU05WYmJXMXNKRGFDNmREMzdDOHdjT0FQMHZYc0xqY291b0pMb2R3WkZtS0NNUWxaQmU3bllxcUhTTlZtNytmT0RFd2tMTXZkeUNhd0EzVGkxSG1NbFJ6ZEJKNW1NTmRpSURtY0pYdVB0eGQvU0VSRGpGZmpiVEFFZ3NMTmQ4MmZ5N3NDK2ZEMnRRRWk4OXJVRG9PVmJjVFNqVURxOXFETm5NMGdrUmZPRzllYm9STW9lWlNKeTVwOU1CcDA2MUI4WW05T1o4M2VTRUJtdE05WituOU1JK09EYkNFemtMVXlCTDB3NzVvUHB4WFhxYUVnaUlFdHY1K1NEcWp4S0E3SE1lZFM0cFJYMlJvUy9PaXJwZUF6ZzlxSXA2aDk4TnJDZENoY05UMEF2SkVOQWJIK0hvNFZ5d1ZKWWZaQ0FYbE9nVkpPazh2ZCtEcVNUNjRiWVpPM0hiaTUvTjVMUXFwd1FGN3VNdjFmbmp2Z2RPSVJPUG1EM2dQQnVCY3ZFRHhOTXUydHNPTFZaTE9INTVmaHFZU1E3SG5pQXJtVmduby9DQkREckgydG43RVRXNzF5VmF1elpLQXRiUkllS0FoZTg2ZnAycjNoT0s0bE96bWEwazZPNDFKWjFhM0g4ajNOU2trUUJ1S1pRUUNVZk1qTk55cW1qM052RThMWVI3MEtDa2NUNkRZYWNGSEx5Z3phanN6N1VFZXg1OExEZEFNWnQxZFBxTmtvNFZqV2NpampzZGhLL0xDWW5kSVBBOURQYVJxLzhlY1VxeHNORHhQanQzNWY4SVkwSUVLQmREMVVLWk42cUlYdGgySFB4UXozWHptYkMxN1JTbXNMb2VjOFRSVTFhYjMwQmFJNFMwVHZiaGxicW1SSW94Qk9rNzg2N0d3Tm9VQzZDWWpnSDc2eFVQd0J5TW0xMEFMMVFDMmNUV3crTndTMEVQdDVtQWNjNnRjdUhOeFJUcFViYzR1K0EyVWhnWVMwSGxDUERhMlR1K0hYOTkvQ3BHdytSS2FNN05zMWVWa1IwdEFENEs1UDVKQXJjK0d6MTVZZ1NWMTduUmM5akR4ZldObGpRb0YwRVZHbnZYMHFSN0NsdmxwWW55QVdPMDJaS1VqWVE2Q21ZZTNseml0K0RTQithcEpYcVFwcGY0WFVPTFBFdEI1dGg5MFUyQWdZdnJvRzA3QnRMcHNzUEN1TFhEcFBDaVpTMTBXZkhGWkJkNHp2UmhPNDJqbVJWMUwvTk94dEZhRmtDbkdoOVpFSXhmSVJnNDNnOWptODhEaUtPejQ4MkJhNTNpeWxiKzRyQkxYVGZiQlpiT2s2OUszUVptT0lRR2RSOFMyczI2SDJNYlhUNkl2RUZVa3BhbjJNd0c2ckFRV2x6TXJjN1J5Z2ZpcHU0SnhMS3AxNGFzWFYrS2ljVzdZMC9jZTdpWGVPZGJXckJBQXpmSG51WG8vL015bW8rajNoMkUybnJsYzBWNWJDU3Q3dU9PRkY0VG1Yb3lSZUFMdm5WbU1UeThweDBSamFaM24wZ3ZFWHhtTDYxWUlnT1ljN2lhOUg5NjVweFhCWUFTbUo1VkVvd1RvS3RFbEpCR0pGUXlRV1NwemJ2WUVBdkJkQk9Tcm0zeGtPNmZWMWNNcG5yZENhUVFvQVoySFZFeHMwL3ZoMXBNOWlCQ2diRFp6L1lmOGJjSis1dTRpaUJVRWtBUFJPTHgyS3o0OHJ3d2ZtbGVLK2lKYk9sWHNRYnB6TEtyYWhRUm9RODg0MEJjU2JZZHNOaE0zTisxdXE1Tzdpb3o5Y0JVL2E0aldsM3RvdjNkR0NUNHd0MFEwS3ZEWU0vTHNEeEwvajl6cytVM2pqSHc0RXMyQ2t6a1JoNDFzWnd2SG9NZWdRNHlmS0o1UUJyTFgrZXk0Zm5veDN0RmNoTVppZTZhQXpNU0ZGLy9KaW9BRWRQNFN6N0hTN1JEYmZiUVR2WUVJckpZc2VMaExpMkVkUXhsaVo1cUswbzhTcHdXWGpmZmlyWk9Mc0xMQkRRZHBJbzdNZWgyNThkL05VQ1ppU0hVMGo0bUxNdWJyL2ZDYVRVZlFUU3EzMVdRWGQwS2tmRmJBNHZOa1pUQmV1b25qeG5PcVhGaFk0OEtsQk9ERmRSN3dsQm9iSFpRbUxlMi9JdzluUFV0QW4wK2N3NjE3VXNiVzEwL0NINGhrSllmYlhsY0ZhNUZYdENES0ZvblVVL0V6K1FKWVZPbkwzdWdxcngwVGlteG9MbmVJVU5PTWNxZG9xOHVndHNEMExGYU85MzJIZUxYNlp3bm9QQ2ZPNGRZZHdHeHRaUTkzbEtTSXVSNXVDOW5Rb2o4MmUrSk1CblJDNVhJQzUyVVR2RmpWNkVXdHh5clU0cUhhUDB0V045bTdUcHNWWmFSQ1Y3anRzT1ZXSWpGMzhQd2VsSGh6QUFWQ1l4M1F4anF1OXdURnBBeWJ3MFJBWmRIRHpYZ04wZk11RytmR1BjdXJNS3ZTbWEvdjNRK2xndXFyaFFUbXNRNW9Sa1NGa1F1RW8zSHoweTY1S01QdEpsQ2IzOVFnRUUxZ0VkbTVYMWxXbWE5Z2pxbTI4cWRVTmJ2Z2FDd0Rta2ZITHRENzRWUGRBZlJ6RHJjbEMyMkh4TlFLbDZtQVp0K2JqV1QwdFpOOW1GZnR5c2YzemYyTi8wWjhFNVQ1VkFWSlk3bDhrb3N5ZEh1NEgxOTNBTzA5QWJJTHpmWndFNkNyU21FMTJjUE5EZmVheTV6NUNtWUc4RStJYnloa01JOTFDYzA1M0xvblpXemZmUkw5QStFc3RCMkt3c1k1M01VK1U0c3lvbkh1QkdMSGhPSzgyaEtzWW5PM3ppOFNQd3hKWXhyUTdPSFdQVHEyNVVRM1FxR0k2UjV1WVVONzNNTExiZWFjWlc0NVh1MnhDVkRuQ1hGeHhWUEVINEV5b0YzU0dBZTBvZXpydmg0L0Njc1lYRTV6QVcyelc1VjZESk1kWXB5R1dVV0FkdWQrL2ppSG83WVQvNHI0eHlpRXloVUo2RE1TV3I5TkdVN0FmQWQzQW5hUEUxYUgzV1F3a3lyanRLSEdhOHYxZDdxYitCL0VuNE9TemltcFFBRE5xdmFGZWovY1E3WnpmekFHQzh6UDRiYVdlRW5sZHBscVA4Zm9JS2wwMlZEdnkwbEFzd1RlQmFXNDR1dkk0OW5ORXRENmlWTStkWWVzbm5yNU1FNTFEc0JtdHZvWmo4SEtqZlY5UGtWc21uZU9vSnpVN2JxaW5Ob08zQ2Q3UC9FNktCNXNDZVFDQmpSWFdla09XYjIyK3lSNitvUG1GMlZ3WS8yYVNwTFNQakUxdzB5VnU4SnR4YmpzUzJpZVlIRUVpdWQ2RGZGZm9IUVlrVlRnZ0diN3VVenZoNDhkNzBRd0MyV1RGcExRWXBhVjI0MUVJR2phOTBaSjVTNG5sWHVjMTlUdHdDZldDUlhFL0hPdnFsYXpSRzZYMEpTQUhrcUdSRTFQZDBDMEhYSTVIYWJldE5WbWhkS0cyMlFQTjBHcndtT0YxNUZSajM1SUJlOHg0cU9xRk42bThoRUpSUW5vWkZSaVNHSkY0bUxhbzVrQ21rRnNjOU1CSWp6Y0pxWjhFbk9vaW1QUWFhUnVWY3B5UTRGVHhDZWg5UEZpNTlaMjliOGxTVUJySXM1ZDFOMmxaQ0FZUVg4Z0MzT3M0dXpoOXNEcWNacnFFT092S2lmN3VjRllRZ21EOWpIMVo0OEsyRUZWbXFXeFgwSk5BbG92c1VOc2lkNFB2N1NyRlNmYUI0VDZheXJGNHJCeTJ5R2YxMXhBMDNlVnVld1lWMlRJdkhpWitCWUpwK3pUV0N6TzRKSkozU0dyRjE5clFYdTNIemFydVV1anRCMnFoTFdzUlB6WnhITUVaU1NodVdXdUFlTHdray9DU1FJNkU4UWVidDJqWTF1T2R5UEFrektzV1NpYkxQYkI2alczTVNBbmxaUzVyR2cwRm9QZUI4WHBKVWtDT3JmTWlMNytFQ0xSbU5rNVlyQmFFdWJQejRLU1ZGTHF0SWt4clFhSVEwNVJDU2NKNkV3UUp5SjA2UDN3bkJsMUtQSzZFRFV4c1VOcE8yU0gxV0VUM25YVHZwZVlzQ3lLTWd4ZXBsVkNTUUk2VThRcGcxdjBmdmo5YjV1SHVUTnFFT2tMQ2tuTllNczRreUZySVZYYjZuYkMxSkJWUENHa2MyT3hJVUN6TnpzZ29UUUcxTk1jSlk1L3ZrSjhwWjRQMTFmNmNOOW4zNHg3SDlxRVIvNitFOEZPZitaQkZvN0FXanNlam9vU0FXN1RBRTJQVldMY2ZtWjFPeWloSkFHZEtRb1lrZEJNaTJhT3c3MmZ1Z0wvOFk1NUNBUWltUWMwSWV1dnArSjR1TjJPSWpNOTNQUllaV1E3TnhnTFdlMlZFbG9DT3RQRTZZWGMwVUozeGxodHVSZTFGemFaZHNOYk52Y2kxTkdHSWxNYkF5WlF3a2tseHRvTzdaZUFsamEwR1dyM2pueTUyYjV3SE1lNkE3Q2JYMzVOTnJRVlZXNUROalRuWkVja2xDU2dNMG1jZ3ZoYXZ0enNTWDhNN1lHWXFZQm1SWUE3bWxaNjdFYm5TeDFIRmdaMFNpb3NRSFBvYW0yKzNHd2JBOW9mTjdWbE1DT3d5R0VoKzltUWRHWk5hRURDU0FMYWpQMzZQUEZmOCtGbVR4T2cyMGhDbTlrZ2hUUEVTbHcyQXJRaCsva0FaT0dGQkxTSmF2Y1AxWis1TGFFSnpHMytLT3dtU21nUnNuSllNZDZZaDV0VFBxVkRUQUxhVkNuOXpkeVgwRkdFQ0dGbStzUUdZOURqU3d4N3VLV0Vsb0EyamRqNytoQnllS3FDUHhJWGdMYVpQVGlaVk81aWt0RDFQc05GR1RLcFJBTGFWR0xIemJlZ2RNcklTWFdiYldpN2lXK0NWUmNlOGNPZFBxV0hXd0k2SDJrejhZZVFnN0ZwQVdqaEVEUFhmaTRsNmR4Y2FzaCtQZzNaekU4Q09rdkVDZExjVWZKcTR2L09wUnZyQ0hESXlsd1BONnZibFNTZERVNmE1SHo1YmdraENlaHNFYXVHTGNRZkpINHZsUFRRckt1TDdObTIyOHkybnlFR3VsOHgzbVBrTWh1aE5BR1VKQUdkVmVMcWg5OFJyeVIrbkRnTXBUZy9ubzJibVZ2bHdxSWFsL0J5SjlRVEpsUE14RDI0RjlhNjhZVmxGVVliSWJLRWxpR3JIQ09MMlQyZ2M1Q2FvSlJhTGlkZVJWd0ZwYSszSFNZVnIrenBpdURMRzlyeDhza2dYQ1N0aGRNcUExS1orMjYvcmRtSGoxMVFaclNwQVErS3V4UjVsRjRyQVczd3VzU09JV3gwZnlhRy9JeXB6RkkxRTBVQjllcG1YYTVLOFNvTjk4Ly9YazdzTlBMRnJRTlI0ZkZPTjZENVdrVXVLeVlVTzlLVkw4N1RMVDZpbWkzcGVLOXhsUWZmNlZnYUVXdFhNZUJNb1JFbjFHY2Y1RVEyQWMwMzZsTFpUVHhWQmNVbHhJdUpLdzJxdEFGVk5lYWV6NE5qVTFnNnJJY3lkU0UwaExOeU1CSnZJRjVhSUlLQTQ4L2NMcm5VZ0I4aW9iNVhqbU4zcVA0TkhoZjdzbXFmZDZqL0ZrSitWWE81aG5DOXVpZFdxSGhvU0hKV0I5V0RjcDI2bDNhY3M2L2paZ0dhYjNxQkN0N2w2Z09ZV1dmTklIOUJYUVRtd2ZwY1A4eExldUNYZHcveC81TktYOXJvNkpEMytpS1U1djJEN3pXY28wQ2VwNXB0eTFVOFZLUkJFK0xuWDZzZWRPMlpCRFM3U0xtaC9ZK0paK2ZRd2c2bWZENUQvQlNVTWFRZEdWYmpXRU41Ry9HZkpRNHplbkR6ZS8yNytwTWJFK2FLbDUzTnN2OGd2dHVvMlpXRXRxZ0M0OFZrbXFoZVFMUHFjRFB4bDJGd01Kd0p4S2Y4ajlTTjBKUEI3K0UxT1pqQkZ5cnBEZUxEK1ZIaSsxVEpsUzJKYlZPMTA2OFJ2OFdFNzJNZ2Y0cjROeU1kWm5vQXZWQlZMNi9LczAzd2MrSnZxeXA1SnNoTC9GUGlHeVhlVENPdXhmNENsRENrMlFQd2VGTElPNGp2SmE0eCtidi9qL2p6dyszbDBRSjZzWG95TnVUcEJtQm4yaDJxS3A0SkIxcTlxaEpOa0ZnemxSNVgxZDFOSm4wZmU2MXZWVFdFYkJFLzY5VTRwd2Y5YUJKTEpoTGZuOGRnWnBwRy9FZmlUeEEzWnVENjdJSG5jRTZ2eEppcGRDM3huNGovQ1lyblBkTjBHZkVucy96TWkxWHR4S01IME96Qit6VHhoV1BnNWZPemZJUDRaOFFYSS8wZStTZUl2eXN4WmpwTlVBL3JyeExQek9EMzFLdnFibE9XbjVmRFgrOG52bDZQeXYzUHhIOFlnNXZnbUxvb3o2YjV1dXdZWTQvM1d5WE9za0pzOXR3QUpVY2huY1NERUQ5RC9Oa2NldGI5cW1heVZZdUV0cWluM1hmRzZJc2ZyNm90NlhacXNOZjF3MUE4N0xKZTJIeGFCaVhFays1YWhVdFZreXFYYUlwcXo3dTFBSnFOLzVzeHRwMDhsNm5nYzJkQStyOGRpaGRVMWcyYlR4OVRiZXQwa1UwMU9VdHo4Rms1bVl1ek0xTk9OYmVxcDkxWUozWndYSWYwMTBSMFFmR3Ezd2xaeUpBTitoN3huRFJkaTVOSFp1V3cvMkNHRmduTkhyUUZCZkRpeTFUVmUzcUdydjhyVmRQaFdQanJrTDJzemFMSlVISW0wdUg0WlBOc2ZvNCtaN2tLYUp0ZGcvM3NLNUNYUHhkS09PczJaS1kybWlVMHQwRmFvUjRjckNKTmd1SXQ1Uk8yenFUbjdGUk5nR2tGOGw0NUpmYzlVTEtyakZDZGVrRGtLckV0UGNXZVF0Mit0TUJPOUp1Z3ROWHB4QnZ4dmFncVVYbnVOQmNNc0ZkeHVBSG5KZXBuRWlPc0pSY1ZjSHg2c0tKbWtHYXFkdnlNRWV4NHZsNVkvZWtjd2xvYWdzWFZ6NGJWNStJZTVadzJ1YkNBQU0zRVRTSnIxZmZqVk5jZ3JMNFBYaFBPOStla28vNFJWTzJZZXZqbThuQkhQbXhXSlF0YjhjMXpWdGcxdWtYUzdsTjRmdE1SaEVJeFdBejRHNTEyRyt3Mkt6d2VPOHFLM2FpdDhtSGl1RkkwMXBXWXVXQkJGZEQ3aGpDRHUxNlZ0bE0wQVBxZ3VuRU9xQnVMd2N5Sk9qWHFwb2tuQVdYL2tJMjNCMjhNRUJEbHprTitQNkFlUW9QZk8xMjl0L0hxNzAxVER4Qjkwb2FlN3ZtV0FGN3ZESWxoZDNxN25vaUNlVzYvUk94eldGRG1zcUhXWjhQRVlnZEtYYVkyMHVrZThsNzJxejliMVFOMnNncGtYczltdmVabmtCYnFpWU1ET0RrUUhkRkw0NlIxV0Zidnh1eEszWDNlT1BWMVRUSkFPOVZmS3RkejlmVmJXdkR4ZS82R0xUdG9iU0l4R09wMzQ3REJaclBBN2JLanBNaUY2Z292R21wS01MV3BBaGRNcjhHVnl5ZWJEZTVCT3FxZS9LTjVDd3pPdytwbkpvN3krMDZybSsrQUNtNEdOdGNRYng3eU80M3FacHloSGpUTjZzYWNtZzRKODlDdVh0eTNwUnVIK3lLaUM0cnV0MG9mZEZnc29uMnhoLzZQUWN4ZFZPcUw3SmhTNnNBRk5TNnNHdStGMSt5Um5NckJleHBwVEJ6NXk0RUJmSDU5TzFyNm9pTzJUZWFEYlRrQitwRzMxZXY5R2o3NDIrd3BSTGd1TU1mcFRhOStmaCsyYkRnSVoxVVJyRzVqKzRqUEhLRjMwc0Z3dW1NQXJhZjdzSTBPaWlmcDVDdXI5bUhwL0VaY3ZiSVo3My9IZkpRV3VjeDgrWHJDZVU0RDZtNk55a3VIYkw1RHF0UHR4NnJrdlV1Vkt1UFQvYkFEa1FUK3RLOGYrN29qQW9EaWpEWVFaUi9zZFJhSXh1bmFjUnlsRGY5U2ExQWNFazBsRGl5cEd4QXRrNjZkYktvYng0czBaNEU5ZDh5UDNuQWNSVTdyaUY1b1J1UGVMa045SFBqU1NlZWc2UGJvOWZTRmNLeTFoeXhDSjBsVzQrclRHOExkb2tRREhXOVViUGI3SS9qYmMvdnczS2JEZUhuckNkeHg4MUlzbUZXSEFpSGVmRnlMenFtc3E2QVUyR2NzWjRBbGpKOUE3U0dwZVViU0dCQ2dsbk5lTUo5MExKRVo1Q2Y5VWZ4eGJ4L1dud2hnYTFzSXQ4NHZSWVhibHBjdjZYaC9CRkVTY280a1V3MVlFWmxaWWFqeWxrK0RQZFlrYU5jZHdqbmRTVkswYlFCbWpJTncwSGQ0ZkU1RTZaVC83ViszNDFQZmZocXY3anFKQWlNK21LOUZoaE9BanRIRzdDZEphczN3YStWdHo4MFNXUXZnUVFUM3Y5YU5iMi91RWpPMDg0MGlCT1R1VUZ5WUo2bkVhM081b2NFSEhMbllsZXpWNkFaMGUxZUFBTjBIaTRuMmo4TnVnOU5weDVvWEQrT2J2OWlBM29FUUpLVmJRa2VFNm1nMWNjcUhUOTFEdjlyWmk5L3Y2VWUrTmFrOTNoOFRUckZVSTRkNE5ORmtZNU5NVGlhVDBFd3o5UU42QU1kTzlRclB0Sm5FampNYmJZQW5YemlBWHorNlhTSXczUks2TDZZQzJyenZUS2pTbWxYV1grL3N3ZVpUK1hWUUgrb0pJeGpoeWFMSkY0M1hkRXFaSVVCejFPUDFaQ3IzREwxWGJ1dnlvKzkwUHdITWZKdUhRMXk5dlVFOC91dys5UFpMS1oxTzRyQkxnRlZ1azcrWFFWM2tzR0pQVnhqUHR2aFRxcSs1UklkN0l3aEVOVWhvNHFsbGhtem9rOGtBM1lSekNxZEhRNjJuK3NCQlNxMmFXVEJFRzJVZ2pJQ2ZPQkFSekg4WGllcEwyTExTaVg2b3BRc2J0eCtYS0V3VHNkcllIZGIrUGxnMTl0TkdadTgxajh6bFAvUEdEdEYxWWpvQnlRcmZheVNoMlRtWE40RHVvYjBkaTZmMEhiSVdVdTh6SkFCWlFoKzBKN0dmZGZWNzd5Tmd0cHp1NDZ3QlRiOGZDRVp3OFlMeGFKNVFMa0FjSmhDSEkxRjBkUWR4NUVRUFdnbVljRG5nR1VYb3kwWlMrbFRuQUxhK2ZocFhMSnNzMFpnbTZkd2JZb2VZdGkzQm0rY3RUVjZVT3EwQ3pEd2dMMENxWjNzd0pxVFdhWDhjSlU2TFNLalFpbStYMVlwOTNXRWNKVnQrUW9rOVB3Qk56OHJQNzB5eWJ2d3Y0NHZ0ZEdEcHRtVjRDVGtaSm1SUHYvM3N4M0dXMEJyczV4Qko1SGRmUFF0Zi9zaWxxS3N1RXZGcmZ2SDhrNlV6QS93Z0FmcStCemZpcVEySDRIWnFPOEg0cTN2NzFZTkZVcHJzNTZqdzFtcVpxOGYyN3NjWGxPTjlzMHBFaERFZVYzWWN2OXR3UENIaTJWdE9CZkhqclQzWVIycTBqdzUvTGFCbUh3bVAzdTBPNVkrM3U1TU9zSlNPUEdFL0cxSzNPVldaMjE4aG1ZVFdkVngwZGdkVVFLY0dYNXdBdTNMeEJNeVpObkovZ2VtVEtyRnc1amg4NkV1cjhkVDZnNXJ1Z1QyR2lYQVVQWDFCaWNRMDBZbCtXaytOZ0dZYmw2VnpYUklWY2xxWkF6TXFuTGo5dVRZYzZva2tqZEdlQVRScmdLVDJzK3FlTDFvTlMyY3RjNVNheXd6UDZtYjdNbUZOdDRUdUlFQWZJMERidE1TZ296Rk1tcEI2dUFEbmJuL3RFNnVFNUI2TkVwS0l4eVVTMHlpaGUwSlJUU0VyeHViRUZDb3hxNWVMYXQzNDBQd3lBZExSMk9iNThsWVA5MFpGRnB4RmcwTXNEUjd1bG1TQXZrQTNvSHNDNkd6dEVRa2ZTVTl4QXB1ejNJZXFVbTIrdHhtVHF6Q3h2bFJUSEZMOGp0MENqMGYydkU4WDhTQzkva2hxYnkyZnVUd1V6NlV4WkxtZ3lpV21ZbW81cXhuSW5LWG1zbHJ5WXMyT3NQMHMxaXhsRU5vb29KTks2SEVZWGJIQjJTK2U3TmFFaGxPSmJlUUpqYVVvS3RJT3V0SmliVjJDMkZaemV4eW9MUFZJSkthQmVEMjdOTnF0ZkpoT0xyTnJqbFd6NzdSWTJOQUpUZmRSNnJJSm16c2ZpSFBUdGFqY05nSUw1NjRidEtGakk5blF1alBFQmdJUnRKenMxZVFRaXhPZ0p6ZVVvZGlyL1VHRVRheGhveVRvdUM4dWNtRmNUYkZtTTJITlM0Znh3cVlqMkhtZ0RVZU85eUJFTmpqYjRueTZscGU0TWFteEhQTm4xdUN5cFpPRTNYOHViZHArUW5qNGg3cy92cCt5WWhkbVQ2MFJGV05EaVdQMnIrOXZSeVFXRTk4MzNHZWJHc3ZRUEw0TVJqc2tjWHJzbGwydDRqNHR3eUNPVFJvZkhZU3ptcXZPT2p4YkIyS2FIV0p4QXViVVVvZG1RSE5ra2xWdWw0YUx4K2gzcXowMmxHa3NyenhJdHZrTExRRnNPUjNDL3U0dzJiUXhjU2lJU2krcmxhNWxGZGxaQzJwY1dObm9QYytPSFNBd2JtOFAwN3NaUGdRYm8yczErbXgwRGVldy8zNjRKeXhDZHFtODErT0xiWERhREwzYk0yTjlod1AwREwwN3A2czNLRExFTk9Wd002REhseE9ndFNrRGdXQVV4MC8zYTdxeEdLbnpGU1NkcDA1TWJwOXpuUHJlWDcyTUZ6WWZGWWNSYjJqK0xQOU1EQW5hTWVqMkgrM0NNeThmd2c4ZjJveng0NHB4MXdlWDQ0YTN6a1lrRXNQWGZyb085LzE2NDRpRktLSlNMQlRCdTk4eUN3OSs0MjFuL3Y3VjEwL2g5bnYraGxkMnRNTHRIdmxnQzlPOTNYYmpFbnoyUXlzSWFQcVVwd1BIdXZDZVR6eU1mVWM3WVUvaXNBejFoL0MycTJiaSs1OTVNMm9xZldjY1lsMUJiU0VyVnAyYnkxMmEwMFBiZ2xHUkgrNjJwM2FpY2w1MEkyMys2aFRENnA4NE5JQmZidS9CbnU2SUFHTXNyc1MraDZyMUZqcDZUdnVCMXp2RCtOc1JQKzdkMGszQWR1T09SV1dZWCswU0pzYm4xclZqemRFQW1RU1dFWitWSFhSM0w2L0VUYlBPTDk5dEM4VHBubFBEb2RsWXltZTNhaitQQ09oWmVnSGRTUnYveUhGdEVwcVAyeWFTMEVVK2JTbzNnNDdCcHVYRzR2VDJxc2crbnpsNWVFRHZPOUtKTC96Z09UengzSDVFNlQ0RzdmTEJQY2lTOHR6OUtNSnA5UExDOUliMkh1N0VoNys0R21zM0hzVjNQbjBGVmorL1h4dzR5VFo4MEI4VzJrczNhUmxscXZUakZGbU90UWRDMGFRMlpDSVJ4M2Qvc1FGdnYzdzZMbDR3K29FZlhUMEI4YnhiZHJiQzVYSWduTVN0eEtGQ2psSjBkUHZmQVBSQVZJU0t0QWdSWGt1V2RGb2tOS3VqbTA4R05Vc25Eb2MxMGVhdkt4cmU0Y2FWV1YvZjJJbmRuUkVCNHZnNUczbTRlK0oxNS8wU0puNit4WStkN1NGOFprazVGdFc1c2ZaNGtQVFlCTjFua2owZmpPSDRNSWt1SFlHWTBEeTByRU96c1pCVld5b0pyVDlrUlJLYU42MU5vNFRtWkJLbnc2WmhreVR3d01PdmFiOHArdjJHMmlJMDFwV2VwMUwrNXJIdCtOejNuME5yVy84Wng5MW9hZzBHZjVkOUFMOTVmRHZLUzEwNFNGTFBwbUZURnRQaFZUWkVsWjNXVklsNTAycHdsS1MveFdWUDhwMVd4Q0pock4xOEJBdG4xWjJudHFkU3MvLzY3Rjc4L3MvYjRVN2hyMkFRT0VsVHVPNnlxWmd4dWZyTTN4OG5DZDBkMUZpVVFiOHlxY1N1NlYxeDlkU2Y5dzhJUjFmS1Y2cmFtdE5wODd2UFdXdVd2dmU4M0luZjdlNFZNZTVCRUkxbUUxdFVQazNvL2VIV2JyeXAwMHVBaklubUM2azBra3IzK2I5elRLUDlyQURhY0pYVkdRazkzTjNPaElFWWRHdHJUOHFpREFhV2hXemNtZ3B2YWtGT2IrdjNxM2ZocVhVSE5OMURqQ1J1WldVUmxsMXd0aVRqNWdoZnVYOHRQdkNGMVRqVk1aRFNDNjhWTE45L2NDT0M0VmhLcVdXaFRWaGRlWGFoUG52dGw4eHJnRVZMaXF2VGpxYzNIQkpteldobzk2RU8zUEdOcCtIVTRLdUkrQ080L3ByWitQRDFpODQ2NUU3MEswVVpOZzBlN3ZvaVcwb1FDSDhJU2Z4ZjdTUzFtRlJlTFRGb2xxQXpLcDJZZGs2SklkdjJ0engxRXI4Z0ZkdXZJV2M2RlhIbmtLTzlVZnpQemw1TllHWjd2dHA3L2dITElTdE9lOVZ5UDFQTERYdTRSd1EwR3dLNnA4NXpOeEdRdlpmSzFtSTFkMkpqMlloZWF3WThBN0NmMUZTV3pMZDlaYldRSGxxSUpXZFRmUW11dkhqeVdXRCs4bytleDkwL2ZGNmNWRGFUd3g2c3JwZVE3VHVwNGZ3ZTdZdG1qMFBEcEVweGo4bkk1YlRoK1UxSFJXbnFhSHdhbjczM0dhRTVwWG9ubklLNzZJSUczUGJleFNqeU9zK1NqS3hXeGpVKzUxVFNXSVpUdWhLcUpPVmM3bE9rd245all4ZnVmN1ZiZFBIUVFrRUM2NklhRjJaV3ZuRnZIWFJmdHo1OUdrOGU4Z3ZnbUIzTVloT0FrMmNxUGNOTGFQWU5XRkpvTlJaVm96RW9vUU1qcWR5em9YTjhTREFjeGVFVDNab2NZbkVDZEYyMUR5R1NiRzJkZnNXajZBOFIwQlBvNlErTGJpZnNOWDUwelI3c0kzdlZybEdhc2lUazMxMUlJSms5dGZxTUZQM0JyemZpNnovYklOUko2eWpBck5qV2Izakg5SllCOHdGVjZuT1RSQzQ3Nzk4dW1GbUxKWFBHNGM5UGRBSkp6QSsrN3hEWjN4dHBYV1kyVjZiVWdpTFJHSDc3K0E0ODl2UWUwUUFpdWFZUkk5UEJnMXYrWlFFdW1uZDJUNnZUL3BnQXROWU1NZDdnN0VBTDJCVkhGSHQ1UlpFLy9kMmgzZ2hlSkR2M3FTTUIrdStZaUQ5cjBycm9Pc1VFL09VTkh0Rk1jQkRnN0xSNmp1eGV0c0ZIODJvUzU2amF1Z0ZORnhybnM0dGVhT2ZTa2I0SUJzS3BOWVlHbndOZS9kb2lQOHBaRlVqbkFucWFYa0IzczRmN3BEWVBOM3QwWDkxMUNoZjk4d000TzFORVBXWUpPV3lUOHFhMWorSmh3N1F4T1ZYMGZlK1lkd1pJVDZ6ZGo2Ly9mTDFTSzYwQnpDSVRLYUhZUGc0SGR4dTFpTDlqVlo2dnoxdkhPa29Kei9kUlV1SkNVK1A1RXJxaHBsZ0EraTlQN0JTQVNIcHBzcDJmV3JjZjc3aGlXc29ZKzQ2OWJmajBkOWZBblVMVlp2OEVPNFhZWS8vQmYxbDQzcitmVkQzY05nMm5HUVByNFgxOStPM3Uzbk1Bb3pnWm1mbGdZTFhXTVlvd2paOE81ZXNtK1hCSmcrZU1aTHh2U3hlZVBPd1gxN0pvZE5iRm9Ydy9xL2k4enZ4M2ZDMEdwbFhIZ2MyZnJTVjF1OUoxUHFBNTdUTkVleWJab2NVN244Tm1GdjBOSXdhR3F0dkRBWHFXWGtCMzlZWnc1RVN2NXJaRERBcVB4NUR0Y0E1bzRrSXR2ZXFTS1ZpeFVPbVBkK0JvRjltNEw2T1RUQUdQaHVhQmJBcTRDTVJsSlI0Unc1NURVcDRCeDNZOE8vdGUzWDBTN2FSUmRHbFFZYzhEdEk5VTdtRWt0RkM3NTlTamFYSzFLUGxNNXZCeTB2TTk4OUpoY1hnbUF6VGYzeWUrL3BUUWdGSkpjdlpxcjd5d0NiZS8vNkpoLzUwOTNKMGg3VTBON0dwcjNuUVJaNFZXdVcxNDE5UWlOS2plN2JYSEEzamtRRDlDaEVTM0JvY2FBNCtUVWRqZTVTeTJLV1N6Y244eXp1STYwQk1tT3o0aWJIcFdrVWR6NzN3UTFKS0VyamhIUXZmVFRUT25BaW9mS0ZNckhFYTBCRmEzajZhUzBMb1UraDZXMEtRcVcyM21aL0d3bEdGMS9iTEY0L0g1VzFlYzVkMTk5cmw5OEpSN05ZR1p2ZERYckp5S2ovL2JFaXllTzN3NzFkK3Yzb0Z2L1BKRjdEbllydjFrWlVEVGdWSmZPM3lpQzN1dUY4eXV3OEVEYlVJS2owUTJxeFh0SjNxd2MzOGJKamVXRGZ2OWZQajg3UCsyWU8ybUkvQzRreCtZYkxmWDE1Ymd3KzlaaEdsTnc3dE91RmxmVnlBS2V4YXlMVm5WWnQvSnY4MG93WFZxNTA5V3RYKy91MDkweUN4TllYOG5WTkRVRStqZVBhMFk3NTlkakxwaEhGanM4UHY1MWg0OHVLdFhaTVJwQlRVZjFIVmUyM2xKTVp3aDFoZlIxZzlnc3NhSXdBalVnU0VocStHY1lycGowRjFrMzdXUWhIYlliYWFEbVIxaDg2Zlg0dTZQcjBSRmllSm8yMzJ3QXc4OXVnMFdEVm9BUzdJRzJ0Zy92L3NhL1BxYmJ4OFJ6RXpYWHpNSHEzOTJQV2FRYXErMWtKZUhERlNXanl4UnErakFXVVNnWnZNaVpUMEpnZlJ2YXc5Z3dEOTh5OWROMjQvaksvYy9ueExNREh5VzN2OTIzUng2cHBGbnNJbWtrcEM1ZmNURS9jVWhra0xlTWFVSXQ4d3JQWE40UFhGNFFMVDYxZEt2bTY5eFFZMFR2NzU2SE81YVVqNHNtSVVubUE2R08ramZ2MzlaTmR3MmpYbmw5RHVzVGxkN2JjTTZ4RVFNT3RVMWlLZVVPNDBZOHAzSkFNMmVrM0c2WlgvbkFPSzkvbEhibDhaZXVnTG1DMmJXNGF1M1gzWW1WTVYvLy9LMjQ5ajZ5ckdrR1ZoQ1NwSEtXVnZwd3dOZnV4YnZmck8ySWpOV3c3LzNtYmRvc3UvNVhud2tuVGwxTkJsZE5MOEJ6Vk9xRVE0bjc4WmhKNVBnSCtzUG9DOFFIdGFQOGJGN25rSWludHFlak5CdVgzVlJFLzd6NXFWSk4yMDcyYytzc3BxSlozYWlNYWF1SnJ0WkFOR25BSkZEVjg4ZEM0aW1BYzRVKzR5OTZYT3JuUGpsbFhXWVVhSE50RnZWNk1FbkZwV1JkRTN0MDQ4bUV1S0FHQzVycllXN280WlRPeEs1dGNQa0VvZFJDZDAzRXFCMXAzeXl1bnFZVkVFU3o2YThjRloxV0txeXZjdFRNMzc2NVd2dzFwWE5aLzc5VkhzL25saTdMNm42cW14WWtsSjA3NSsvYlFYZXRMUnBWUGV3NnFLSm1ORmNwYzErOWpyUjFKQjhzZ2VIcnhiTXJCVjEzTW1JNCtmNzk3WGhTRXZQZVpWbjMzcGdnOGdHUzNXb3NnZWNWZlpQa04xY1d6bHlFL3NlV21QT2VMS2JkRWh6T0o2QnlCTHpYMmNXNHp1WFZwL1ZDWE5iZXdnN2lEMzI1RjFPZUYxWWduL2owaXJVZUxWcmpPdzB2WVlPa1FxWFRVajNWTktmcFhQbE1MM0NPWTdkRjBtdDFmQm55OXlHVE5UelpxeFpoemdqT1VOTWw3N01rb0VMR3BCQit6bW14cVk1WHNxU2NmNzBHdHgrNDRWNCtBZi9oTVZ6em02c3ovbms2ellkaFMxRjI2TFFRQmlYWGpJRjExMDIra0VXdkduZWNrbHp5bkpPTmdrNHZYVlNRM0lKelJNL0xwaFJKMEpyS1dQdWRIQnlzNGZRRVBBL3UvR0lTSEp4cGVqcXdvY3ZPOTV1ZnVkOFhMVWllWHNtTG1ibzBCaXkwbVV1UVNsd1lCQnpUblNSdzRLTDZ0ejR3dEpLZlBPU3F2UGl1OXZhd3FMRFNhcENEblp1dlg5MkNXYVdqejZsa3AxblBHTXFuS0x4V1ZTMW40ZFR1VGtQbkczOVpIam1WOHpPT1FOdGlUbkQ2TWg1R3R3UVFNL1FDK2llL3BESVNSNU5ZMzFXbFdNakhJT0pvUjROOVltTHlUYXVyU3dSNlp4TDU5WGovZStjSjJxa2g2T2paTXVmUHRvRlQzVlIwczFFYnczWHJwcUs4VHJuWXRWVitKQ3E5UnBMYUU3VW1OUllsdko2S3hhTng3UXBWZGk1OXpRZFJpT3JpWFlDN2VybjkrTGpOeTRXNE9TMlQ1LzQydCtWakRSTDhzT0YrY3Bsay9ILy9uMXA2dU9mQU4wWmlHdE94T0dWWUxzM2tlUVFIQngvSTdRanJtUWpLY1ZTZEVLeEhTc2FQTGhoUnJHUTBNTUJnQ3VtMko2dlNsS2N3ZC9CR3NvN3lmYldVOEhFcVFBMWRQMTRpdmNhSFpUUTU5d0x0MWpxMGRDd2dhL2VYT28wa3RuV2NhNkgrMXhBVDlNTDZONitvRkM1TFJyYjluSXhRbDJWRDlVRUNNc3dEOHJPR2pHY3pta1hZS2dvYzR1ODV5Vno2M0hwa29rb1N1TG9ZbFdjeXhGVEhTN3NCUzhpd0UrYlZLSC9pQXluN2o2WlVBSGRXSnU2bEhQQnpEck1KanQ2QncvNFN3Wm9lcmJOMjF2SnRQQ0xFTnRYZjdJT3J4L3FFREh6cEljb0hhRFRKbGJpcmc5ZXJDa2YvRFJKbXRGSWFKWnE0NHNkWXByaytmYWk4a3I0Y09CY2JHN0x5L2JuOUFvbmx0UzVzTEFtZWEwNzM4Y0pPbUJTZ1pSdDIxbDB6UnF2UHZPUEQ0NmdCcThZYXhhMUJPaHpuWFBja2JRM2xEcHV6d2Ryc3lpNzFJM29ybVFTbW1tT2Zna2RSa3RMdDZiODZGQWdJcnpJdDk2d0NMTm84NTQ3OEl6L3lNMEFlUW9HcDRiV2tZMW5HOFZKeXhNekRoM3YxZ0RvR0pxblZxT3F6S3RyTmZtKzl4L3VTdWwyNEJkV1Vlb1dTU3FweUVzSDFVSUM5VitmM2lQVTdwRWtJLzh0MTVPLytGb0xkaDFzeHdOL2ZEWGxHdkh6Rm5tYytPaS9Mc0hTK1EyYW52R2ttaVhtMC9CZUdjenN4UHJucWNWQzRnNTNONkxiaUIwaTIydTBjNnBPMGIyMEVhZHlibk5zZUJxcDJucDdJSEJhUHZjNFMrWTNZTHh6L0h0NEQzZEV0WjlUZTdpbmNpTUlZdzZ4Z3lNQm1zWEhSTjFYN3ZZalNHcGZNaFZYbkdyMDB0bisrZUpITGhVVlBabWdFRWwvVmtGVFZ4TFFCcU5EUTB1MTEwaTI2TnBYanFTd2t4SWllWWJMUkxYU1pVdWI4TnZWTzdIdDlaT3dKZEZFSEc0N2Z2L0VEaEdlRzh4c1MzWWZWb3NWMTZ5YWd0dmV1MGp6dlRDQTJMNHRjcVNTVmhBRkN0OVlYb2thWDJZY28zMGk4U09XMHRFMDZCQ3o2WlI4N0FUY2RqcVU5RURndzViVjhwcGhQZHhSVGRORmxNNHVEaVBSQTA3SDZ4N0pLVFlOT2dlRHNoMHNIR0lhSnBoRklsRk1uVll6YkFwazJweG50THM0K3ltbDVLUVY3L09ITktuTnd4RTdvVGdUTGJtNkRWSzNIWmcwWGp1ZzUwMnZFYm5haVJSdVZ0YUdubHAvQ01kT3BtNVZ6S21kMCttYVg3enRVczMzNFE4blJIbWpYY09PWTd0NTJUZ1h2TTdNT1VXNUExSkl3NWh4dmdQdVRxcW5tVDkvNWg5SEJsSjZxTG1NaHMyRjRVSld4M3RqS2Z1WDg2MXhLNlZLdCtIRytoZ0owQnlBMVpXSDJlY1BLeXF1QmgySGU0MXhnVUtKTjNNem5Ia2h0Y1NISGFUV0h5R1YrWVNPM3Qxc3A5OURkbXVxOEpCbzZVUDI4K1FHN1dPMlhhUTFMSjVURHgvWnh0RWtvT1lUM2tYNmEycXZka0ljS3ArKzVXS1I1NjZWV3YxUklhMjBCQzc0THJueGdDMkQwUzIrRHkzWDUxZi9XbHVRVk9mUjl3YmQzUmtXUS9GS1hjblhkREJrTlp6S2ZYeEFMWnRNdWkrVUxpVUdxdjRpdzZuYlF3RTlIVHBUUHJrL2xlYVFGYTBFZTVUTFM5MFplL0VNNW1JdS8wdnhQdG1CMU44VHdOL1hIUlJPdXRIUU4zNnhIaSs4Y2xTREp6TXVIR0tUSjVTUDZ2cFhMSnVFYVJNckVFbFJaNTFxT3lRU1NyWFBEZGZNRVR3YTRrSi9ubktoSlFiTklaeEp0RUdkR1p3enl4Vkp6S244Vlh5L2gzcWpJdDk3dEtvMmo2emx0TTNVZG5wQ1NPZHpNODg0SVVhVW1xWUtaZEwvbW8zWno5M0RPY1NHQW5xR0VVQWZJa0JidElTc3lBYWFNSzdrckhyYmRCTTN1V3ZrTUZRc2RkTUJlNGtiZjN4OEJ4NzZ5elp0enIrK2tLamMrdll2WHhSRDhWSktycmh5UDhQVlFTY2pMdjBVM25lRFU5bjQ0M05KaGYvY3JaZU1YcC96eDlIR09keGEvQW54aENweE1pZWhxenhXbEx1dHdydWNpcmlMNkwyYnU3SHBwTFptRUR3RTc0c2JPdkQ0d1FGUndKRkl1WTBWUUo5Ynk4MCtCMDJOSUtDOVRWTVNRQjhlOWtCVGY4N1NDK2grOWlvZjYwcXA1b3IzUUNkNFEyMXhSdE5EK2JBUXRkQWFwSzZUWGp4My9Qd2FxYytuMmdmd3JpdG5uS21qSGtxZFBVR3NlZkVRL3JKbUQzNy81RTdoY0xGcDJMMzh6Snd3a2lxdituenR3WXFMNWpYZ2I2dzlCTUthdm10WWRaOE9rLy82NUdXb3J5blNBZWlvYUhMblRyRTd4V1JJMnRpanljalNRNXorV1Y5a1Z4SStVaXduVzM4OEErc0xCTktiWnBmZ3NrWXZhb2VaNHNGZFFUbVY5QzhIK2tWMzBHSU4zVVQ1ZVRsME5seVhrcGJCNlNJcFRURWxCbTFBNWU0ZVNlVWV2S3VKME4zcE00U0JqbjY0eTMwcHRPMDRmRlUrVkpabHRsYzJIeFpjT1ZSY1hTeW0vam1TZ0VGNFJBbHd4MDcwRUtoZndGTWJEdUtDR2JXb3F5b1MxVkhzWER2ZE9ZQ0R4N3BGaUtpVmZzL3AxZllpUkdpRGJMSHg0L1E1QUsrNnRCbi8rOWgya2NycEdTV2dSWTB6ZmYrdDF5ODZxM1BMYUtpTlZGQ3VRL2FtMEVSWU9uTStzaXZEVlhZY0hlSHhPZXpCVHBsQUE2WGdnaHNRSHUyTllIWHRnQ2lDNE41ZkhqYTFvZ20wRXZqMmQwZXcrVlJRRkZLVWFHd056QjV1VGlZWjdnQWJiTldVYW51d2FzNmpZdzNJdFI0b3JZZEdCTFF1NmN4UzRDaG5pR2xJM3VkRWp1Yng1YUs5YnFacHlvUUtYRTZBZUpUVWFTZDlYeUxGNXZkNkhjSjV0RzdqRWF3anFjajl1N2hSUDZlYXhya0lnalFMVGlQVlVsTTk5QmoyK1Z4MEwyVzZubUhHNUVxUlRMTmxSK3VvUDhzYi91SUZEYmp6QXhmcittNU9XMVJpdnRvcW10aCtkcGlRNzMzUk9JOUlST0hXdTZtNmZBeHFEcHkxeFcxOW82Uk84MkhBQndPbm1RWnBQN0trNVhoeThTaTg4NXdoeHBscXRjTUNXcW1yVHVZaDUvdmk3NnMycHRHY3hnaGVJdXVRN3hrMStZTVJIR3hKM2pybnpJUFFTalNTL1Z4ZWxubEFjOEhCUDNIbEZBRXhxbkYwRGt0ZEQwbGZEOTJmeTJNWERSTTROT1NoQThGVDdCcDF2RnFVMTlHaE1GcUgyQnNPTHdzdVhqZ2VWUlhlcE43dTRaNkZuWUxmdmV0SzNUMjgyNE5SeFg3VzR1Y0V0OWExRzIwVXI0bm1WRG14ck40akRoR3RHNVlQR2daUU9VbGcvak5yN0F4cVRqbmx2TzNSeHF2NWVhdEV1dXI1TXBBOTNLa2tOQXRCbnBMaDBJL242RWdPc2FHQTFrWDk3QkJyMFpqRHpSN3UyaExOczZ5TXF0MXZYajRaYjMvckxJUTdCa2FkWG1kVmJlVGhiSDNXTkJJSmJXTmJHTkROamZwVFM2OWJPUVVUNmt0VGVydUhFcy9XL3R4dEswVDFsdTdqbngxaS9waW16YzdnNG9vb2x3bGw4QXpFRzZZWFl5WkphVmFUUjN1RVdOVVdTT2UrMW9TcUJtdFR1WlcydmNOTjF1d0lLUEZ2UzRxRG5vc3liUG96U2pqT2VpZ2pnT1lZTk51WEZvMlRKdG43ckhVK2xWR3FKc24ycVp1WFl1cU1Hdmg3QWtaeVp0OVFSY21tTGlJMTJxVWhEMXFvOHFTbVQyM1NEMmdlZ2NNMlBUc2N0UndpTE1tNTR3cDNJREZDRE9ZMmpURm85dml5RFcxV2lTVlB0ZmpBM0ZMaGpRN0VFb1k3ZlE2Q1dTbjQwTERHYkVPVGRDNDc1d1RqY0pXV1lRUmlzb2l4bUgxUHhnRE5Fbm8vZTdnMXhxRFp3MjJ6bVZjcHp6bkwvM1hubGFnaHpjRGY3ZGVkWnNkZ0N0Q2hNTEdoRkQrLys2MGlaSlc2YkJMd0VQQ0xmY1pDZEJ3ajUxQk55djVVeEpWbFhueUhWTzNSTk9JZjNpRVdGYm5UZGcxcGxtNjdWWGlnemV4bjhzL1RpbkRiL0RJUkw5YmF6SDRrY0hLcDVjcEdEejY5cEZ3MDZkY2k1YXZvTURuMy9EbzJPQzRveFpyeHU1eFVZa2hDYzhybmlJUFNEYjE1amtGM0hlbUVKMFVsRVdkV2VTcUtNSzY2Q0dZU3E4MXZmOU0wZUp3MjBaOTYyNVlXMkVyZG11MWhVWVB0VnpxRDNQZ3ZDM0g3K3k1RWRibFhkUDlNNVN6azc1NDh2c0xRL2YvcWthMTQ5dVhESlAxU0g1aEJzbnUvZGZlYlJ1d05OaHBxOVN2RDZiamVONUZpYy9MdmVPem05cEZqMi9lRDgwcUZWUDNtcGs3UkpxbUVKS1pXV2NFU21SMS9YQ0J5eCtJeXZHdXFEenZhZUNnZGtvYkVPR1RHa3BubmE1MUwzSFlvVldVYXJ5VWZRTE1xblVaaTlnem9ZeGtCTkRlUHJ5Q3AxVWxxTjBaS1FZd3AwN3IrL1pibG92VFJiR0xIMWpXcnBvcU4vcnNuZHVLbnY5dUMxa1B0WkpBNWhET1BOUVl4eTBwZGNNNU5UNGpXR1JHNFNPSzk2NjJ6Y2ZPNzVvdTRNS3Z4ZklpVms5bHd1UFgweUcrTkxyWnd5UVRjZGN2RnV1OTc0N2JqK01IL2JoTHg4VlFTTjBpcTNrMTBqKys1YW5aYTFxeWVRTXJ4WjNieUpQTmVzN2VZR3dsVWVNeHZERG5ZMVlSVjhOL3U3c01mOXZZS0c1YTkxdXpndEExcHZKOVF0eUVET2F3bXdieTl1VWpVVE04Z2U1dy9jNktQRThVVFFqTVphUVlXWC9QbU9TVzR0dmw4d2NSbUIzdmV1VUp0Mk5FK0NhWGM0U01YbElta0VnTWF6VjRvcVovRE8xTlYyeXdNSGJuY0xIbjNITzdBeWJiK0VXT3p3cGIwT0VYbWs5NVN4WFFSZHp2aHJMWWRlMDlqL1paajJIV2dUUlEzOUEyRVJBRUQ1MUZ6blRhMzcrVVN6MFZ6eG9sVVZZNUxENlZkKzl2UjJqWnlEcmlkVkhLdWYyN1c2ZUhtNk1FdG4zOGMvN2Q2cDJobWtFeU5ZMjJnc2E0WXp6NTRvKzZZOTNraUlCd1hNZHBrdzlaRTNUckgvTXNkb3NnZ215UFlXWnZnK1ZzOE52YVZVMEZSL3NqZFNvTVJwZGtDRjQwMGtGa3dteVRqd2xxWHFKZG1NMkZvSXdXdUt0dlZFVWJ2Q0huWWZCMk9ZWFBPK25CRkdheStINkExT3hXSURic1c0ajRJOER6WVhlczQzQkdrODJlSjc4OElvUE9adU12S1FDQ01FRWszSVpXaGVMZFpIZmQ1SFNLeHhHN0x6bUJ4emhXLysvNFhSQTJ6UFVWaUI5dllxMy8ySHJ6MTBxa29kR0lQTXg5Q0FkS3dXRDBlZEZ6emUyVVBPVGRlS0haYTgva1IyWForTC9ITHFWUnVXNDQvQ0ZkQ1RFam5CVGtsczdUSWxYTVB1bnJ0ZnZ6OC8xNFZBL0RjS1NxcEFxVCszL21oNVhqVDBzbjV1RGxEeENlSUo2WE5aMkpSaHNjWmtJQzVUdHpVNE5Xa1RqdjE1NzRjZjVEMXlSd0JZNFc0YXUxSEQyMFN1ZkdweWlLNUo5dWkrUTM0NUUxTFV3SS9SMmxBZmE4UlNOSktoMVJ0T2lXZzE2c25acTdTT3VKUGp2VzM5YVBmYk1TYWRmdmhjaWNQQTdHWnhOYkFmWjk5czdENTg1UzRGT3BQeEQrV09OVjhBRzVKOVV2V0lZQUo1L0REUEVuOEdQRzlZL1Z0L2MrZnQrS1hENzhtWEtHcFlwbEJzdi8vNjVPWEo1M3drUWZFKyswSjRoOGtzd2tsblNHdXNOcW9GZENQNURDZ2Z3Smx3aDdmMzFlSVh4aHJiMnJUamhPNC83ZXZvTHNuS0NaakpBVnpLSXFyTHArT2YzdjdYREZvSUkvQi9LaXFick1hK1o4WU11TlkwckRyOVNjdGUzOFEwQnlEK1l5cUJ1WFVYb2ZpcGgrMHM5aHQvOUd4OVBLNWFjTDl2M2tGVzE0OXBtRWVWVnhNbmVRYTU1b0tiejQvTmp0MjdocTBJTlQzZkkvRTdZakVIVGcrQjZVd1F4T2d1WnpuQWVMZlFlbUJsZ3ZFTC9wMktMbXJRMmtIOGJ1aHMwSXMxK2lYRDcrS2gvNnlGUTROWFZ3aWdUQytmZGNWbUR1MUpwOGZ1VVAxaHd6VkNQbkEvbS9pUDR5Vjk1cEc0b0h1ZDZnMk5MUUNlaERVREtDOU9mQVFjZlVoWGhubUJmTy8vWjM0U3ZWaDQvbjZwbzZkN01VTEc0OGlIb3FKYkxYQlFTSERNZmN6ditrOWk4VFlIcnM5YjhNeXZDbnZKbjV4bUgvand1K2JpTzlVd1M2QnJXaWszeUYrWHVzSHp0MFpySHAvakxnL2l3OFJWVS9xbnlleDZ4bkVhNGdYUTNHVzVXWG9nN1BRdU9hNWxOUm5iaGZFaFJ6bk1zL0Y0aERXZFZmT3dOMGZYNVh4amk4WnBLQnFOLzhneWU4RTFBMThPZkgySE5JV3MwRUIxVzcrL21nK1pCbWhMTzl5ZGVGMUQ0QTNjSUx6OTdMelMyc1l6YUhhWTh4RmtKVEtqT0VEMHdhRGxYYWpkUlZBaVZEY1BZclAxQkovai9nZHhKNENlMDljS1BBbDRwK085b09XSkhXMkRJNzdpSzhuenJRSEpxcXErcXhtUDZuekdpdlVEVENYMkNXeE95eTFFLzh2bEQ3c2IwTG0wMzM1dlhLVzMwY052TmRib0RpRUdwSDdHWTFHaVRYU2JlcDY2UXJsV1RRVXp2T0NmcEdZUnpSeWR3Sm5HbDkyUUZYRjJDYStOUTJxdmx1OTEvZXA5K3N4V2NQSWRlbk1jZDlyMVFQNjI4VHZVZzl1ZDVyWEthaStXemFIMkFIV2FmQjZuUGI3VGVKVlVNWTJlVXpXTURMOVhvTHEzbjlJOVNIb05qVzBBSHFRT0NtY1o1QmVSTXo5Ylh6cXhuQ1A0dlR4cTJvMXYyRE9ldUVNTlU1cWVUM05pOFNIem8zRXk0bTVmVWVsZXE5ZUhkSTdxdDUzUUgxV1g1NGVFbnRWYld0b0xqQVAxbjY3K2w1NW5TcUd2TmZSSE56K0llK1dDd2pZNmJXQmVIV2FuNEgzM1h1SWVhWVB0NTR1SGZKZTdUb1BuWWo2ZVg1dXl5ajNjVmhkcDlIc3JmaVE5V0xlcGE0WDQrQTVvd3MwR2tBUHBYSVZMTXZVelpCcW5DRVBnZHFvdm1RR2NZdkptN2wreVAxZXFHN2traUViMTZhK3pMajZnbm1oKzlUN2ZrVzk3OWVJNXhGZnJEN3owQTF2VmFWSXJxcjZYYXFrZkRERjd6V29wc3N5OWVBdTE3QTU5NnNiY2hERVppWW96Vkx2bGQvSlF2VitpNGRva2xiMXZjWlVuOHlBS2dtUHEvZjdrcm9YVjZqWG1KMUM4dmNNMmNjdnFKL2xRK1lTZFU5Y3JCNHlJeDBNZkI4NzFjKy9wSEphU1MrZzg1MUsxRk9lN2UzeDZrdXdxaStkd3lkYjFjVStyUEY2Ykl2K2czaGxqajR2QS9tbUFuaXZFMVZRVFZkdDdrSGZENFA0aUhvNDgzdnRIcXNMVUtpQVRqZlpWQi9BZDlQb1kwZ1g3U0YrWndiTUdrazVTRmE1QkdraFZxVitCQ1Yrbmt2RWt1anpFc3dTMEpMMEVlZWRIODJoKy9rMWxPUUVTUVZDTXFTVFhtcURVaDEyZHc3Y0M2Y05QaUJmU1dHUnRLRWxTWklxdHlSSmtpU2dKVW1TSkFFdFNaSWtDV2hKa2dxTy9yOEFBd0NvN3ZkT0ZYTHZOZ0FBQUFCSlJVNUVya0pnZ2c9PSIgd2lkdGg9IjIxNiIgaGVpZ2h0PSIyMTYiIHg9IjI4OCIgeT0iMjg4Ii8+PC9zdmc+Cg==');
               background-size: contain;
            }
            
            #xtrars-btn-icon {
               width: 70px;
               height: 70px;
               display: inline-block;
               background: no-repeat center var(--xtrars-bs-img);
               background-size: contain;
               clip-path: circle(34px at center);
            }
            
            .onoffswitch-checkbox {
                float: left;
                margin-top: 3px;
                cursor: pointer;
            }
            
            .onoffswitch.disabled { 
                color: grey;            
            }
            
            .disabled:after {
                background-color: darkgrey !important;
            }
            
            .disabled:before {
                background-color: darkgrey !important;
            }
            
            .hidden {
                visibility: hidden !important;
            }
            
            .xtrars-tabcontent::-webkit-scrollbar {
                width: 10px;
            }
            
            .xtrars-tabcontent::-webkit-scrollbar-track {
                background: #fdfdfd; 
            }
             
            .xtrars-tabcontent::-webkit-scrollbar-thumb {
                background: #12a6f6; 
            }
            
            .xtrars-tabcontent::-webkit-scrollbar-thumb:hover {
                background: #0296d6; 
            }
            
            .xtrars-tabcontent {
                display: none;
                padding: 9px;
                width: 100%;
                height: calc(100% - 60px);
                overflow: auto;
            }
            
            .xtrars-active {
                text-shadow: -1px 0 #12a6f6 !important; 
                color: #12a6f6 !important; 
                background-color: rgb(253, 253, 253) !important;
            }
            
            #xtrars-settings-toolbar {
                height: 30px; 
                width: 100%; 
                color: white; 
                line-height: 30px;
                background: #12a6f6 var(--xtrars-bs-img) no-repeat center left 5px;
                background-size: auto 25px;
            }
            
            .xtrars-toolbar-text {
                display: inline-block; 
                margin-left: 10px;
                padding-left: 25px; 
                user-select: none; 
                width: calc(100% - 65px);
                text-overflow: ellipsis; 
                overflow: hidden; 
                white-space: nowrap;
                transition: width .7s;
            }
            
            .xtrars-toolbar-text:has(~ .xtrars-search input:not(:placeholder-shown) + div svg), 
            .xtrars-toolbar-text:has(~ .xtrars-search input:focus + div svg) {
                width: calc(100% - 125px);
                transition: width 0.5s;
            }
            
            .xtrars-select {
                display: inline; 
                font-size: 11px; 
                padding: 0 8px; 
                border-radius: 0;
                outline: none;
            }
            
            /*Thanks to halvves https://codepen.io/halvves/pen/ExjxaKj*/
            .xtrars-toggle {
                cursor: pointer;
                display: inline-block;
                isolation: isolate;
                position: relative;
                height: 14px;
                width: 30px;
                border-radius: 7px;
                overflow: hidden;
                box-shadow:
                    -4px -2px 4px 0 #ffffff,
                    4px 2px 6px 0 #d1d9e6,
                    2px 2px 2px 0 #d1d9e6 inset,
                    -2px -2px 2px 0 #ffffff inset;
            }
            
            .xtrars-toggle-state {
                display: none;
            }
            
            .xtrars-indicator {
                height: 100%;
                width: 200%;
                background: #12a6f6;
                border-radius: 7px;
                transform: translate3d(-75%, 0, 0);
                transition: transform .4s cubic-bezier(0.85, 0.05, 0.18, 1.35);
                box-shadow:
                    -4px -2px 4px 0 #ffffff,
                    4px 2px 6px 0 #d1d9e6;
            }
            
            
            @media (max-width: 270px) {
                #xtrars-settings-tabs .xtrars-settings-tabs, #xtrars-settings-tabs .xtrars-update-button {
                    padding-left: 3px !important;
                    padding-right: 3px !important;
                }
            }      
                  
            @media (max-width: 208px) {             
                #xtrars-settings-tabs .onoffswitch {
                    margin-right: 3px !important;
                }
            }
            
            #xtrars-settings-tabs {
                height: 30px; 
                width: 100%;
                background-color: #12a6f6; 
                color: white; 
                line-height: 33px; 
                overflow: clip
            }
            
            #xtrars-settings-tabs .onoffswitch {
                float: right;
                margin-right: 10px;
                width: 30px !important;
                min-width: 30px !important;
                display: inline-block;
            }
            
            #xtrars-settings-tabs .xtrars-indicator {
                box-shadow: none;
                background: #ecf0f3;
            }
            
            #xtrars-settings-tabs .xtrars-toggle {
                display: inline-block;
                isolation: isolate;
                position: relative;
                height: 14px;
                width: 30px;
                border-radius: 7px;
                overflow: hidden;
                box-shadow: none;
                outline: #ecf0f3 1px solid;
            }
            
            #xtrars-settings-tabs .xtrars-toggle-state:checked ~ .xtrars-indicator span {
                transform: translateX(2px) translateY(-28%);
                color: white;
            }          
              
            #xtrars-settings-tabs .xtrars-toggle-state ~ .xtrars-indicator span {
                transition: transform .4s cubic-bezier(0.85, 0.05, 0.18, 1.35);
                transform: translateX(47px) /*60 (indicator) - 11 (own width) - 2 (same space to borders as active state)*/ translateY(-28%);
                font-size: 10px;
                width: 11px;
                position: absolute;
                color: white;
                text-align: center;
            }
            
            #xtrars-settings-tabs .xtrars-toggle-state:checked ~ .xtrars-indicator {
                background-color: #0D4F8B;
            }
            
            #xtrars-settings-tabs .xtrars-toggle-state ~ .xtrars-indicator {
                background-color: #d06e6e;
            }
                                   
            .disabled .xtrars-indicator {
                background: #ecf0f3;
            }
            
            .xtrars-toggle-state:checked ~ .xtrars-indicator {
                transform: translate3d(25%, 0, 0);
            }
            
            /*Thanks to Aaron Iker https://codepen.io/aaroniker/pen/XyXzYp*/
            .xtrars-search {
                display: inline-table;
                float: right;
                margin-right: 10px;
                margin-top: 2px;
            }
            .xtrars-search input {
                box-shadow: none;
                border-radius: 0;
                -moz-border-radius: 0;
                -webkit-border-radius: 0;
                background: none;
                border: none;
                outline: none;
                width: 14px;
                min-width: 0;
                padding: 0;
                z-index: 1;
                position: relative;
                line-height: 10px;
                margin: 8px 0;
                font-size: 11px;
                -webkit-appearance: none;
                transition: all .6s ease;
                cursor: pointer;
                color: #fff;
            }
            .xtrars-search input + div {
                position: relative;
                height: 14px;
                width: 100%;
                margin: -21px 0 0 0;
            }
            .xtrars-search input + div svg {
                display: block;
                position: absolute;
                height: 14px;
                width: 79px;
                right: 0;
                top: 0;
                fill: none;
                stroke: #fff;
                stroke-width: 1px;
                stroke-dashoffset: 271.908;
                stroke-dasharray: 59 212.908;
                transition: all .6s ease;
            }
            .xtrars-search input:not(:-ms-input-placeholder) {
                width: 80px;
                padding: 0 4px;
                cursor: text;
            }
            .xtrars-search input:not(:placeholder-shown), .xtrars-search input:focus {
                width: 80px;
                padding: 0 4px;
                cursor: text;
            }
            .xtrars-search input:not(:placeholder-shown) + div svg {
                stroke-dasharray: 150 212.908;
                stroke-dashoffset: 300;
            }
            .xtrars-search input:not(:-ms-input-placeholder) + div svg {
                stroke-dasharray: 150 212.908;
                stroke-dashoffset: 300;
            }
            .xtrars-search input:not(:placeholder-shown) + div svg, .xtrars-search input:focus + div svg {
                stroke-dasharray: 150 212.908;
                stroke-dashoffset: 300;
            }
            
            @media (max-width: 320px) {
                .xtrars-update-button span {
                    display: none;
                }
                
                .xtrars-update-button .icon {
                    margin-right: 0 !important;
                }
            }

            .xtrars-update-button {
                display: inline-flex;
                align-items: center;
                background-color: #007bff; /* Same blue color as in the image */
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                height: 30px;
                font-size: 13px;
                text-decoration: none;
                transition: background-color 0.3s ease;
            }
            
            .xtrars-update-button .icon {
                width: 20px;
                height: 20px;
                margin-right: 10px;
            }
            
            #xtrars-settings-close-btn {
                user-select: none; 
                float: right; 
                margin-top: 6px; 
                background-color: transparent; 
                border: none; 
                margin-right: 10px; 
                cursor: pointer; 
                font-weight: bolder; color: white;
            }
            `.replace('<style>', '');
        document.head.appendChild(oStyle);
    }

    /**
     Creates a button element and appends it to the document.
     It waits for the element with class "infos" to be loaded and then appends the button to it as the first child.
     @async
     @returns {Promise<void>} A promise that resolves when the button is successfully added to the document.
     */
    async buildButton() {
        const oButton = document.createElement("div");
        oButton.id = 'xtrars-btn';
        oButton.innerHTML = '<i id="xtrars-btn-icon"></i>';
        await this.waitForElement('.infos').catch(() => null);
        document.getElementsByClassName('infos')[0]
            .insertBefore(oButton, document.getElementsByClassName('infos')[0].firstChild);

        if (GM_getValue('bFirstStart')) {
            GM_setValue('bFirstStart', false);
            oButton.style.animation = 'shake 1s ease 1s 1 normal;'
        }
    }

    /**
     This method builds the settings window that is displayed when the settings button is clicked. It creates and
     appends various DOM elements to the settings window such as tabs, checkboxes, and labels.
     */
    buildSettingsWindow() {
        const oSettingsWindow = document.createElement("div");
        oSettingsWindow.innerHTML = `
            <div id="xtrars-settings-toolbar">
                <div class="xtrars-toolbar-text">BETSLIX - Settings</div>
                <button id="xtrars-settings-close-btn">✕</button>
                
                <div class="xtrars-search">
                    <input class="xtrars-search-input" type="text" placeholder=" ">
                <div>
                        <svg>
                            <use xlink:href="#path">
                        </svg>
                    </div>
                </div>
                    
                <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 28" id="path">
                        <path d="M32.9418651,-20.6880772 C37.9418651,-20.6880772 40.9418651,-16.6880772 40.9418651,-12.6880772 C40.9418651,-8.68807717 37.9418651,-4.68807717 32.9418651,-4.68807717 C27.9418651,-4.68807717 24.9418651,-8.68807717 24.9418651,-12.6880772 C24.9418651,-16.6880772 27.9418651,-20.6880772 32.9418651,-20.6880772 L32.9418651,-29.870624 C32.9418651,-30.3676803 33.3448089,-30.770624 33.8418651,-30.770624 C34.08056,-30.770624 34.3094785,-30.6758029 34.4782612,-30.5070201 L141.371843,76.386562" transform="translate(83.156854, 22.171573) rotate(-225.000000) translate(-83.156854, -22.171573)"></path>
                    </symbol>
                </svg>            
            </div>
            <div id="xtrars-settings-tabs">                
                <button 
                    class="tab xtrars-settings-tabs ${GM_getValue('sLastActiveTab') === 'BS' || GM_getValue('sLastActiveTab') === '' ? 'xtrars-active' : ''}" 
                    data-tab="BS">BS
                </button>
                <button 
                    class="tab xtrars-settings-tabs ${GM_getValue('sLastActiveTab') === 'Streaming' ? 'xtrars-active' : ''}" 
                    data-tab="Streaming">Streaming
                </button>
                <button 
                    class="tab xtrars-settings-tabs ${GM_getValue('sLastActiveTab') === 'Info' ? 'xtrars-active' : ''}" 
                    data-tab="Info">Info
                </button>
                
                <div class="onoffswitch">
                    <label class="onoffswitch-label" data-search="">
                        <div class="xtrars-toggle">
                            <input class="onoffswitch-checkbox xtrars-onoffswitch xtrars-toggle-state" 
                            type="checkbox" name="xtrars-onoffswitch" value="check" />
                            <div class="xtrars-indicator">
                                <span class="xtrars-power-symbol">&#x23FB;</span>
                            </div>
                        </div>
                    </label>
                </div>
  
                <a href="https://update.greasyfork.org/scripts/429666/BETSLIX%20-%20burning%20series%20enhancer.user.js" rel="nofollow" class="tab xtrars-update-button">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC40lEQVR4nO2Zy2oUQRSGSxPjdZOgwYjGN/ASkRAQ3LgwLsQRQdciivGyUBQvKAgJbhIwER9BRUVEEi/vIC4mKi4UI06MTLwhgia6+OTgCXSKms70TJVQ0h8MDNVT5++/e6rq1CljcnJycrIAzAc2A+eBO8Az4BMwDfwCvgCjwF3gDNApfUxogF3AJFAGdqb8rh3oBSbIzjugD1gV0sj7hOC443orcFWfeL1MAUNAcwgjs7Cu7QU+4p9JoBDcCNAIXEu5kW/ADeCAjpcVQBOwQL9L22HgIfAzJc4Q0BDECLAIeFRB+BWwH1iSIf5SoMf6Cye5DywMYWTE0fYDOCVvqg6dxTqLucbavXpiVzJi8xpYV5fIbL0umVQcOgMhjRRl1vJlIqG5Enjh0CuEfCMzjAHdHs2sdaxJH4CW0EaEki8jArBJ15Yk/SY2IwJw2dKQ6brNZCWDiTfA9swCc+svcwz+CyZGgOP2QzMxwt9sQDLnJOtNjAAPLCMnTIwAxywj102MAFssI09MjABrLCMTWTpv06z0M7Av6J1Wt4UuJ4wUs3R+mej41dveoEaA3Zq2SDq0NUtHO9dZbWIEeGoZ6TIxAty0jPSYGAFOWkaGTYwAGywjv0NspIIDzAPeWmaOmhgBLlpGSpJaB9DZodNqVdQi0OaoPfUFMOIqOFSkVpF+K45sPzs8G5E3XTWmRpEW3fgnkcWy3aORbt1lhjOiQgVHvOdSuvFlxioHjQYxogIDjpjjPld8YGM1g75ekUYtX9pImfNslpqvI7YUuc9VKGoPezWSEJTCsgsZN0ekMJ2xSnIwZXyMSBHbuxEVbwAGU968zGqP1VSnHgY16Q21atsh4DbwPSXO4EzxOogRawKQQxnflIE9llY4IyrQDFxxlDZrYUpjLXfojP2TupZOmb2O3KwaZDG8JPvyOdaZkn68VzQrJZpytHZaj6eLuuef1ic+qW239GCnQ/oEv7GcnJz/iz/Wmk6MdR/K1gAAAABJRU5ErkJggg==" alt="Update Icon" class="icon">
                    <span>Update</span>
                </a>
            </div>
            <!-- Tab content -->
            <div id="BS" class="xtrars-tabcontent" style="display: block; overflow: auto;">
                <div class="onoffswitch">
                    <label class="onoffswitch-label"
                        data-search="nächste,folgende,episode,wird,zufällig,abgespielt">
                        <div class="xtrars-toggle">
                            <input class="onoffswitch-checkbox xtrars-onoffswitch xtrars-toggle-state" 
                            type="checkbox" name="xtrars-onoffswitch" value="check" />
                            <div class="xtrars-indicator"></div>
                        </div>
                    </label>
                    <div class="label-wrapper">
                        <span class="onoffswitch-inner auto-random-episode">
                            <span>Nächste <strong>folgende</strong> Episode wird abgespielt</span>
                            <span>Nächste Episode wird <strong>zufällig</strong> abgespielt</span>
                        </span>
                    </div>
                </div>
                <div class="onoffswitch">
                    <label class="onoffswitch-label"
                        data-search="nächste,staffel,wird,automatisch,manuell,abgespielt">
                        <div class="xtrars-toggle">
                            <input class="onoffswitch-checkbox xtrars-onoffswitch xtrars-toggle-state" 
                            type="checkbox" name="xtrars-onoffswitch" value="check" />
                            <div class="xtrars-indicator"></div>
                        </div>
                    </label>
                    <div class="label-wrapper">
                        <span class="onoffswitch-inner auto-next-season">
                            <span>Nächste Staffel wird <strong>automatisch</strong> abgespielt</span>
                            <span>Nächste Staffel wird <strong>manuell</strong> abgespielt</span>
                        </span>
                    </div>
                </div>
                <div class="onoffswitch">
                    <label for="xtrars-onoffswitch" class="onoffswitch-label"
                        data-search="wechselt,zum,${this.getHoster(0, true)},${this.getHoster(1, true)},${this.getHoster(2, true)},${this.getHoster(3, true)},tab" 
                        style="font-size: 11px; float: left; height: 21px; padding-top: 4px;">
                        Wechselt zum
                        <select name="" class="xtrars-select xtrars-onoffswitch" style="width: 100px; max-width: 40%">
                            <option value="${this.getHoster(3, true)}">
                                ${this.getHoster(3, false)}
                            </option>
                            <option value="${this.getHoster(0, true)}">
                                ${this.getHoster(0, false)}
                            </option>
                            <option value="${this.getHoster(1, true)}">
                                ${this.getHoster(1, false)}
                            </option>
                            <option value="${this.getHoster(2, true)}">
                                ${this.getHoster(2, false)}
                            </option>
                        </select>
                        -Tab
                    </label>
                </div>
            </div>
            
            <div id="Streaming" class="xtrars-tabcontent">
                <div class="onoffswitch">
                    <label class="onoffswitch-label"
                        data-search="video,überspringt,ueberspringt,uberspringt,x,sekunden,anfang,spielt,von,überspringen,ueberspringen,uberspringen">
                        <div class="xtrars-toggle">
                            <input class="onoffswitch-checkbox xtrars-onoffswitch xtrars-toggle-state" type="checkbox" 
                                name="xtrars-onoffswitch" value="check" />
                            <div class="xtrars-indicator"></div>
                        </div>
                    </label>
                    <div class="label-wrapper">
                        <span class="onoffswitch-inner skip-start">
                            <span>Anfang des Videos wird <strong>x Sekunden übersprungen</strong></span>
                            <span>Video spielt <strong>von Anfang an</strong></span>
                        </span>
                         <input class="skip-start" type="text"
                        size="3" maxlength="3" 
                        value="${isNaN(GM_getValue('iSkipStartTime')) ? '' : GM_getValue('iSkipStartTime')}">
                    </div>
                </div>
                <div class="onoffswitch">
                    <label class="onoffswitch-label"
                        data-search="video,wird,x,sekunden,vor,ende,beendet,spielt,bis,zum,überspringen,ueberspringen,uberspringen,überspringt,ueberspringt,uberspringt">
                        <div class="xtrars-toggle">
                            <input class="onoffswitch-checkbox xtrars-onoffswitch xtrars-toggle-state" type="checkbox" 
                                name="xtrars-onoffswitch" value="check" />
                            <div class="xtrars-indicator"></div>
                        </div>
                    </label>
                    <div class="label-wrapper">
                        <span class="onoffswitch-inner skip-end">
                            <span>Video wird <strong>x Sekunden vor Ende</strong> beendet</span>
                
                        <span>Video spielt <strong>bis zum Ende</strong></span></span>
                         <input class="skip-end" type="text"
                        size="3" maxlength="3" 
                        value="${isNaN(GM_getValue('iSkipEndTime')) ? '' : GM_getValue('iSkipEndTime')}">
                    </div>
                </div>
            </div>
            
            <div id="Info" class="xtrars-tabcontent" style="font-size: 11px;">
                <div  class="xtrars-donation-container">
                    <div class="xtrars-donation-text">
                        <span style="font-weight: bold;">BETSLIX - burning series enhancer by xtrars</span> <br> 
                        Du magst meine Arbeit und das Projekt erleichtert dir dein Streaming-Leben? 
                        Dann gib mir doch ein leckeren Tee aus, denn so kann das Projekt immer weiter optimiert werden
                        und am Leben bleiben:
                        <a class="xtrars-donate" href="https://paypal.me/betslix" 
                            target="_blank">Spenden</a>
                        Danke dir :)
                    </div>
                    <i id="xtrars-pp-qr"></i>
                </div>
            </div>
        `;
        oSettingsWindow.style.cssText = 'display: none;';
        oSettingsWindow.id = 'xtrars-settings-window';
        oSettingsWindow.classList.add('run-circleToWindow-animation');
        document.getElementById('root')?.appendChild(oSettingsWindow);
    }

    /**
     Handles the start of the drag operation on the settings window.
     @param {MouseEvent|TouchEvent} o - The event object for the drag start.
     */
    dragStart(o) {
        document.settingsWindowActive = true;
        let oSettingsWindow = document.getElementById('xtrars-settings-window');
        let iSettingsWindowLeft = parseInt(window.getComputedStyle(oSettingsWindow).left);
        let iSettingsWindowTop = parseInt(window.getComputedStyle(oSettingsWindow).top);

        if (o.type === "touchstart" && o.touches?.length) {
            document.settingsWindowInitialX = o.touches[0].clientX - iSettingsWindowLeft;
            document.settingsWindowInitialY = o.touches[0].clientY - iSettingsWindowTop;
        } else {
            document.settingsWindowInitialX = o.clientX - iSettingsWindowLeft;
            document.settingsWindowInitialY = o.clientY - iSettingsWindowTop;
        }
    }

    /**
     Handles the end of the drag operation on the settings window.
     */
    dragEnd() {
        document.settingsWindowActive = false;
        let oSettingsWindow = document.getElementById('xtrars-settings-window');
        let iPixels = 2;
        let iPositionInterval = setInterval(() => {
            if (parseInt(window.getComputedStyle(oSettingsWindow).left) <= 0) {
                oSettingsWindow.style.left = parseInt(oSettingsWindow.style.left) + iPixels + 'px';
            } else if (parseInt(window.getComputedStyle(oSettingsWindow).top) <= 0) {
                oSettingsWindow.style.top = parseInt(oSettingsWindow.style.top) + iPixels + 'px';
            } else if (parseInt(window.getComputedStyle(oSettingsWindow).right) <= 0) {
                oSettingsWindow.style.left = parseInt(oSettingsWindow.style.left) - iPixels + 'px';
            } else if (parseInt(window.getComputedStyle(oSettingsWindow).bottom) <= 0) {
                oSettingsWindow.style.top = parseInt(oSettingsWindow.style.top) - iPixels + 'px';
            } else {
                clearInterval(iPositionInterval);
                if (oSettingsWindow.style.top !== '' && oSettingsWindow.style.left !== '') {
                    GM_setValue('oSettingsWindowPosition', {
                        x: oSettingsWindow.style.left,
                        y: oSettingsWindow.style.top,
                    });
                }
            }
        }, 1);
    }

    /**
     Handles the dragging of the settings window.
     @param {Event} o - The event object for the drag.
     */
    drag(o) {
        if (!document.settingsWindowActive) return;

        o.preventDefault();

        let oSettingsWindow = document.getElementById('xtrars-settings-window');
        let iCurrentX;
        let iCurrentY;
        if (o.type === "touchmove") {
            iCurrentX = (o.touches[0].clientX - document.settingsWindowInitialX);
            iCurrentY = (o.touches[0].clientY - document.settingsWindowInitialY);
        } else {
            iCurrentX = (o.clientX - document.settingsWindowInitialX);
            iCurrentY = (o.clientY - document.settingsWindowInitialY);
        }

        oSettingsWindow.style.top = iCurrentY + 'px';
        oSettingsWindow.style.left = iCurrentX + 'px';
    }

    /**
     Shows the settings window.
     */
    showSettingsWindow(bWithSlideIn = false) {
        const oSettingsWindow = document.getElementById('xtrars-settings-window');


        if (bWithSlideIn) {
            this.#slideInAndOpenOrSlideOutAndCloseWindow();
            oSettingsWindow.classList.remove('run-windowToCircle-animation');
            oSettingsWindow.classList.add('run-circleToWindow-animation');
        }

        // Vorher schonmal setzen, damit korrekte Breite und Höhe berechnet werden kann
        oSettingsWindow.style.cssText = `height: ${this.#nSettingsWindowHeight}px; width: ${this.#nSettingsWindowWidth}px; max-width: calc(100% - 5px); 
            max-height: calc(100% - 5px); display: block; position: fixed;`;
        oSettingsWindow.style.cssText = `height: ${this.#nSettingsWindowHeight}px; width: ${this.#nSettingsWindowWidth}px; max-width: calc(100% - 5px); 
            max-height: calc(100% - 5px); display: block; position: fixed; 
            top: ${GM_getValue('oSettingsWindowPosition').y ?? "calc(50% - " + (parseInt(window.getComputedStyle(oSettingsWindow).height) / 2) + "px)"};
            left: ${GM_getValue('oSettingsWindowPosition').x ?? "calc(50% - " + (parseInt(window.getComputedStyle(oSettingsWindow).width) / 2) + "px)"};
            background-color: #fdfdfd; box-shadow: rgba(0, 0, 0, .4) 1px 1px 10px 5px; z-index: 161;`

        if (!GM_getValue('bIsSettingsWindowOpen')) {
            this.restartAnimation(oSettingsWindow);
        }

        document.addEventListener("touchmove", this.drag, {passive: false});
        document.addEventListener("mousemove", this.drag, {passive: false});

        GM_setValue('bIsSettingsWindowOpen', true);
        GM_setValue('oSettingsWindowPosition', {
            x: window.getComputedStyle(oSettingsWindow).left,
            y: window.getComputedStyle(oSettingsWindow).top,
        });
    }

    /**
     Shows the content of the specified tab.
     @param {string} sTab - The ID of the tab to show.
     */
    showTabContent(sTab) {
        let oTabContent = document.querySelectorAll('.xtrars-tabcontent');
        oTabContent.forEach(oItem => {
            oItem.style.display = 'none';
        });

        document.getElementById(sTab).style.display = 'block';
        GM_setValue('sLastActiveTab', sTab);
    }

    /**
     Initializes the events and buttons that appear in the extension.
     */
    initEvents() {
        const oButton = document.getElementById('xtrars-btn');
        const oToolbar = document.getElementById('xtrars-settings-toolbar');
        const oSettingsWindow = document.getElementById('xtrars-settings-window');
        const oTabs = document.querySelectorAll('.xtrars-settings-tabs');

        const oActivateEnhancer = document.querySelector('#xtrars-settings-tabs .xtrars-onoffswitch');

        const oBsCheckboxes = document.querySelectorAll('#BS .xtrars-onoffswitch');
        const oStreamingCheckboxes = document.querySelectorAll('#Streaming .xtrars-onoffswitch');

        const oAutoplayRandomEpisode = oBsCheckboxes[0]; //auto-random-episode
        const oAutoplayNextSeason = oBsCheckboxes[1]; //auto-next-season
        const oSelectHoster = oBsCheckboxes[2]; // select-hoster

        const oSkipStart = oStreamingCheckboxes[0]; //skip-start
        const oSkipEnd = oStreamingCheckboxes[1]; //skip-end

        const oSkipStartInput = document.querySelector('input.skip-start');
        const oSkipEndInput = document.querySelector('input.skip-end');

        const oSearchInput = document.querySelector('.xtrars-search-input');

        oTabs.forEach(oItem => {
            oItem.addEventListener('click', e => {
                oTabs.forEach(oTab => {
                    oTab.classList.remove('xtrars-active');
                });
                e.target.classList.add('xtrars-active');
                this.showTabContent(e.target.dataset.tab);
            });
        });
        //
        // oUpdate.addEventListener('click', () => {
        //     window.open('https://update.greasyfork.org/scripts/429666/BETSLIX%20-%20burning%20series%20enhancer.user.js')
        // })

        // Öffne Settings
        !oButton || oButton.addEventListener('click', () => {

            if (this.#bButtonDisabled === true) return;

            this.#bButtonDisabled = true;
            setTimeout(() => {
                this.#bButtonDisabled = false;
            }, 500);

            if (GM_getValue('bIsSettingsWindowOpen') === true) {
                this.#closeSettingsWindow(oSettingsWindow);
            } else {
                this.showSettingsWindow(true);
                if (GM_getValue('bFirstStart')) {
                    GM_setValue('bFirstStart', false);
                    document.getElementsByClassName('xtrars-switch')[0].style.animation = 'shake 1s ease 1s 1 normal;'
                }
                document.addEventListener("touchmove", this.drag, {passive: false});
                document.addEventListener("mousemove", this.drag, {passive: false});
            }
        });

        !oToolbar || oToolbar.addEventListener("touchstart", this.dragStart, {passive: false});
        !oToolbar || oToolbar.addEventListener("mousedown", this.dragStart, {passive: false});
        document.addEventListener("touchend", this.dragEnd, {passive: false});
        document.addEventListener("mouseup", this.dragEnd, {passive: false});
        document.addEventListener("contextmenu", this.dragEnd, {passive: false});

        // Schließe Settings
        if (document.getElementById('xtrars-settings-close-btn')) {
            document.getElementById('xtrars-settings-close-btn').addEventListener('click', () => {
                this.#closeSettingsWindow(oSettingsWindow);
            });
        }


        let oManagedButtons = {
            'activateEnhancer': oActivateEnhancer,
            'autoplayRandomEpisode': oAutoplayRandomEpisode,
            'autoplayNextSeason': oAutoplayNextSeason,
            'selectHoster': oSelectHoster,
            'skipStart': oSkipStart,
            'skipEnd': oSkipEnd,
        };

        this.manageButtonState(oManagedButtons);

        !oActivateEnhancer || oActivateEnhancer.addEventListener('change', () => {
            GM_setValue('bActivateEnhancer', oActivateEnhancer ? oActivateEnhancer.checked : false);
            this.manageButtonState(oManagedButtons);
            this.reload();
        });

        !oAutoplayRandomEpisode || oAutoplayRandomEpisode.addEventListener('change', () => {
            GM_setValue('bAutoplayRandomEpisode', oAutoplayRandomEpisode ? !oAutoplayRandomEpisode.checked : false);
            this.manageButtonState(oManagedButtons);
        });

        !oAutoplayNextSeason || oAutoplayNextSeason.addEventListener('change', () => {
            GM_setValue('bAutoplayNextSeason', oAutoplayNextSeason ? oAutoplayNextSeason.checked : false);
        });

        !oSelectHoster || oSelectHoster.addEventListener('change', () => {
            GM_setValue('bSelectHoster', oSelectHoster.value);
        });

        !oSkipStart || oSkipStart.addEventListener('change', () => {
            GM_setValue('bSkipStart', oSkipStart ? oSkipStart.checked : false);
            let oSkipStartInput = document.querySelector('input.skip-start');
            (oSkipStart ? oSkipStart.checked : false) ?
                oSkipStartInput.style.display = "block" :
                oSkipStartInput.style.display = "none";
        });

        !oSkipEnd || oSkipEnd.addEventListener('change', () => {
            GM_setValue('bSkipEnd', oSkipEnd ? oSkipEnd.checked : false);
            let oSkipEndInput = document.querySelector('input.skip-end');
            (oSkipEnd ? oSkipEnd.checked : false) ?
                oSkipEndInput.style.display = "block" :
                oSkipEndInput.style.display = "none";
        });

        !oSkipEndInput || oSkipEndInput.addEventListener('keyup', (e) => {
            e.target.value = isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value);
            GM_setValue('iSkipEndTime', parseInt(e.target.value));
        });

        !oSkipStartInput || oSkipStartInput.addEventListener('keyup', (e) => {
            e.target.value = isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value);
            GM_setValue('iSkipStartTime', parseInt(e.target.value));
        });


        let iPixels = 2;
        window.addEventListener('resize', () => {
            let iPositionInterval = setInterval(() => {
                if (parseInt(window.getComputedStyle(oSettingsWindow).left) <= 0) {
                    oSettingsWindow.style.left = parseInt(oSettingsWindow.style.left) + iPixels + 'px';
                } else if (parseInt(window.getComputedStyle(oSettingsWindow).top) <= 0) {
                    oSettingsWindow.style.top = parseInt(oSettingsWindow.style.top) + iPixels + 'px';
                } else if (parseInt(window.getComputedStyle(oSettingsWindow).right) <= 0) {
                    oSettingsWindow.style.left = parseInt(oSettingsWindow.style.left) - iPixels + 'px';
                } else if (parseInt(window.getComputedStyle(oSettingsWindow).bottom) <= 0) {
                    oSettingsWindow.style.top = parseInt(oSettingsWindow.style.top) - iPixels + 'px';
                } else {
                    clearInterval(iPositionInterval);
                }
            }, 1);
        });

        !oSearchInput || oSearchInput.addEventListener('keyup', this.search);
        !oSearchInput || oSearchInput.addEventListener('mousemove', (e) => e.stopPropagation());
        !oSearchInput || oSearchInput.addEventListener('mousedown', (e) => e.stopPropagation());
        !oSkipStartInput || oSkipStartInput.addEventListener('mousemove', (e) => e.stopPropagation());
        !oSkipEndInput || oSkipEndInput.addEventListener('mousemove', (e) => e.stopPropagation());

        // Label-Workaround
        document.querySelectorAll('input[type="checkbox"][class~="onoffswitch-checkbox"]')
            .forEach(oElement => {
                labelWorkaround(oElement);
                oElement.addEventListener('change', o => {
                    labelWorkaround(o.target)
                });
            });

        function labelWorkaround(oElement) {
            let oInputTextElement = oElement.closest('.onoffswitch').querySelector('.label-wrapper > .onoffswitch-inner');

            if (!oInputTextElement) return;

            if (oElement.checked) {
                oInputTextElement.classList.add('workaroundChecked');
            } else {
                oInputTextElement.classList.remove('workaroundChecked');
            }
        }
    }

    /**
     This function searches for a keyword in a list of elements and highlights the matching elements with a red dashed outline.
     It also highlights the corresponding tab of the matched element with a red color.
     The search is case-insensitive and supports searching for multiple words separated by spaces.
     @param {Event} o - The event object passed to the function, which contains the search keyword in its target value.
     @returns {void}
     */
    search(o) {
        let bHasSearchWord;
        let iIndex = -1;
        let iTabIndex = 0;
        let oTabs = document.querySelectorAll('.xtrars-settings-tabs');

        for (const oTab of oTabs) {
            oTab.style.removeProperty('color');
        }

        for (const oElement of document.querySelectorAll('.onoffswitch-label')) {
            oElement.style.removeProperty('outline');
            bHasSearchWord = true;
            for (const sSearchWord of o.target.value.toLowerCase().split(' ').filter((s) => s !== '')) {
                let aSearchKeywords = oElement.dataset.search.toLowerCase().split(',')
                iIndex = 0;
                for (const sSearchKeyword of aSearchKeywords) {
                    iIndex++;
                    if (bHasSearchWord && sSearchKeyword.includes(sSearchWord)) {
                        break;
                    }
                    if (iIndex >= aSearchKeywords.length) {
                        oElement.style.removeProperty('outline');
                        bHasSearchWord = false;
                    }
                }
            }
            if (bHasSearchWord && iIndex !== -1) {
                oElement.style.setProperty('outline', '1px dashed red', 'important');
                let sTab = oElement.parentElement.parentElement.getAttribute('id');
                for (const oTab of oTabs) {
                    if (sTab === oTab.dataset.tab) {
                        oTab.style.color = 'red';
                        if (iTabIndex === 0) {
                            oTab.click();
                        }
                        iTabIndex++;
                    }
                }
            }
        }
    }

    /**
     Manages the state of the buttons in the setting window.
     @param {Object} oManagedButtons - The object containing the list of all the managed buttons.
     */
    manageButtonState(oManagedButtons) {
        let oActivateEnhancer = oManagedButtons.activateEnhancer;
        let oAutoplayRandomEpisode = oManagedButtons.autoplayRandomEpisode;
        let oAutoplayNextSeason = oManagedButtons.autoplayNextSeason;
        let oSelectHoster = oManagedButtons.selectHoster;
        let oSkipStart = oManagedButtons.skipStart;
        let oSkipEnd = oManagedButtons.skipEnd;

        !oActivateEnhancer || (oActivateEnhancer.checked = GM_getValue('bActivateEnhancer'));
        !oAutoplayRandomEpisode || (oAutoplayRandomEpisode.checked = !GM_getValue('bAutoplayRandomEpisode'));
        !oAutoplayNextSeason || (oAutoplayNextSeason.checked = GM_getValue('bAutoplayNextSeason'));
        !oSelectHoster || (oSelectHoster.value = GM_getValue('bSelectHoster'));
        !oSkipStart || (oSkipStart.checked = GM_getValue('bSkipStart'));
        !oSkipEnd || (oSkipEnd.checked = GM_getValue('bSkipEnd'));

        let oSkipStartInput = document.querySelector('input.skip-start');
        !oSkipStart || (oSkipStart.checked ? oSkipStartInput.style.display = "block" : oSkipStartInput.style.display = "none");
        let oSkipEndInput = document.querySelector('input.skip-end');
        !oSkipEnd || (oSkipEnd.checked ? oSkipEndInput.style.display = "block" : oSkipEndInput.style.display = "none");

        if (oActivateEnhancer ? !oActivateEnhancer.checked : false) {
            this.disableButton(oAutoplayNextSeason);
            this.disableButton(oAutoplayRandomEpisode);
            this.disableButton(oSelectHoster);
            this.disableButton(oSkipStart);
            this.disableButton(oSkipEnd);
            oSkipStartInput.style.display = "none";
            oSkipEndInput.style.display = "none";
        } else {
            this.enableButton(oSelectHoster);
            this.enableButton(oAutoplayRandomEpisode);
            this.enableButton(oSelectHoster);
            this.enableButton(oSkipStart);
            this.enableButton(oSkipEnd);
            !oSkipStart || (oSkipStart.checked ? oSkipStartInput.style.display = "block" : oSkipStartInput.style.display = "none");
            !oSkipEnd || (oSkipEnd.checked ? oSkipEndInput.style.display = "block" : oSkipEndInput.style.display = "none");

            if (oAutoplayRandomEpisode ? !oAutoplayRandomEpisode.checked : false) {
                this.disableButton(oAutoplayNextSeason);
            } else {
                this.enableButton(oAutoplayNextSeason);
            }
        }
    }

    /**
     Disables a given settings slider.
     @param {Element} oElement - The element to be disabled.
     */
    disableButton(oElement) {
        if (!oElement) return;

        if (oElement && oElement.parentElement.childNodes[3] &&
            oElement.parentElement.childNodes[3].childNodes[1] &&
            oElement.parentElement.childNodes[3].childNodes[1].classList.contains('auto-next-episode')) {
            this.playNextEpisodeIfVideoEnded(false);
        }

        oElement.classList.add('disabled');
        oElement.parentElement.classList.add('disabled');
        oElement.disabled = true;
    }

    /**
     Enables a given settings slider.
     @param {Element} oElement - The element to be enabled.
     */
    enableButton(oElement) {
        if (!oElement) return;

        oElement.classList.remove('disabled');
        oElement.parentElement.classList.remove('disabled');
        oElement.disabled = false
    }

    /**
     Skips the unavailable hosters.
     @async
     @param {Array} aHosterOrder - The list of hosters to try in the given order.
     @returns {Promise} A Promise that resolves when all unavailable hosters have been skipped.
     */
    async skipUnavailable(aHosterOrder) {
        let oHoster = await this.waitForElement(`.hoster-tabs .hoster.${aHosterOrder[0]}`, false);
        if (oHoster !== null) {
            document.location.replace(document.location.href + '/' + aHosterOrder[0]);
        } else {
            oHoster = await this.waitForElement(`.hoster-tabs .hoster.${aHosterOrder[1]}`, false);
            if (oHoster !== null) {
                document.location.replace(document.location.href + '/' + aHosterOrder[1]);
            } else {
                document.location.replace(document.location.href + '/' + aHosterOrder[2]);
            }
        }
    }

    /**
     Handles the video element for the given streaming hoster.
     @async
     @param {string} sActiveTab - The active tab.
     @param {Array} aToBeChecked - An array of regular expressions to check against.
     @returns {Promise<void>} A Promise that resolves after the video element is handled.
     */
    async handleBsVideo(sActiveTab, aToBeChecked) {
        for (const regexHoster of aToBeChecked) {
            if (regexHoster.test(sActiveTab)) {
                let oIframe = await this.waitForElement('section.serie .hoster-player > iframe');
                let sSrc = oIframe.src;
                window.open(sSrc, '_blank').focus();
                oIframe.remove();
                let oHosterPlayer = await this.waitForElement('.hoster-player');
                oHosterPlayer.innerHTML = `
                    <h2 class="">Dein Stream ist jetzt bereit</h2>
                    <div class="play" style="display: none;"></div>
                    <div class="loading" style="display: none;">
                        <div class="wrapper">
                            <div class="line"></div>
                        </div>
                        <div class="wrapper">
                            <div class="line"></div>
                        </div>
                        <div class="wrapper">
                            <div class="line"></div>
                        </div>
                        <div class="wrapper">
                            <div class="line"></div>
                        </div>
                        <div class="wrapper">
                            <div class="line"></div>
                        </div>
                    </div>
                    <a href="${sSrc}" target="_blank" rel="noreferrer">${sSrc}</a>
                `;
                break;
            }
        }
    }

    #slideInAndOpenOrSlideOutAndCloseWindow() {
        const rStartX = /(?<=@keyframes\s*xtrarsSlideIn\s*{\s*?0%\s*{transform: translate\()-?(0|\d+(\.|\d)*?px)/;
        const rStartY = /(?<=@keyframes\s*xtrarsSlideIn\s*{\s*0%\s*{transform: translate\(-?\d+(\.|\d)*(px)?,\s?)-?(0|\d+(\.|\d)*?px)/;
        const rHalfWayX = /(?<=@keyframes\s*xtrarsSlideIn\s*{(\s|.)*?40%\s*{transform: translate\()-?(0|\d+(\.|\d)*?px)/;
        const rHalfWayY = /(?<=@keyframes\s*xtrarsSlideIn\s*{(\s|.)*?40%\s*{transform: translate\(-?\d+(\.|\d)*px,\s?)-?(0|\d+(\.|\d)*?px)/;
        const rBeforeEndX = /(?<=@keyframes\s*xtrarsSlideIn\s*{(\s|.)*?99.99%\s*{transform: translate\()-?(0|\d+(\.|\d)*?px)/;
        const rBeforeEndY = /(?<=@keyframes\s*xtrarsSlideIn\s*{(\s|.)*?99.99%\s*{transform: translate\(-?\d+(\.|\d)*(px)?,\s?)-?(0|\d+(\.|\d)*?px)/;
        const rEndX = /(?<=@keyframes\s*xtrarsSlideIn\s*{(\s|.)*?100%\s*{transform: translate\()-?(0|\d+(\.|\d)*?px)/;
        const rEndY = /(?<=@keyframes\s*xtrarsSlideIn\s*{(\s|.)*?100%\s*{transform: translate\(-?\d+(\.|\d)*(px)?,\s?)-?(0|\d+(\.|\d)*?px)/;

        const oXtrarsBtn = document.getElementById('xtrars-btn');

        const oXtrarsBtnCoords = oXtrarsBtn?.getBoundingClientRect();
        const nXtrarsBtnWidth = oXtrarsBtn.getBoundingClientRect().width;
        const oXtrarsStyle = document.getElementById('xtrars-style');

        const nSettingsRealWidth = document.body.clientWidth > this.#nSettingsWindowWidth ? this.#nSettingsWindowWidth : document.body.clientWidth;


        // Damit Button nicht über Fenster ist
        oXtrarsBtn.style.cssText = 'z-index: 162;';
        setTimeout(() => {
            oXtrarsBtn.style.cssText = '';
        }, 600);

        // Ergänzt bestehenden CSS-Code mit den nötigen Koordinaten, um eine Animation mit CSS-Only zu erreichen
        if (oXtrarsBtnCoords && !GM_getValue('bIsSettingsWindowOpen')) {
            oXtrarsStyle.innerHTML = oXtrarsStyle.innerHTML
                .replace(rStartX,
                    (oXtrarsBtnCoords.x - parseInt(GM_getValue('oSettingsWindowPosition').x) -
                        nSettingsRealWidth / 2 + nXtrarsBtnWidth / 2)
                        .toString() + 'px')
                .replace(rStartY,
                    (oXtrarsBtnCoords.y - parseInt(GM_getValue('oSettingsWindowPosition').y) -
                        this.#nSettingsWindowHeight / 2 + nXtrarsBtnWidth / 2)
                        .toString() + 'px')
                .replace(rHalfWayX,
                    ((oXtrarsBtnCoords.x - parseInt(GM_getValue('oSettingsWindowPosition').x) -
                        (nSettingsRealWidth + nXtrarsBtnWidth) / 2) / 2)
                        .toString() + 'px')
                .replace(rHalfWayY,
                    ((oXtrarsBtnCoords.y - parseInt(GM_getValue('oSettingsWindowPosition').y) -
                        (this.#nSettingsWindowHeight + nXtrarsBtnWidth) / 2) / 2)
                        .toString() + 'px')
                .replace(rBeforeEndX, '0')
                .replace(rBeforeEndY, '0')
                .replace(rEndX, '0')
                .replace(rEndY, '0');
        } else {
            oXtrarsStyle.innerHTML = oXtrarsStyle.innerHTML
                .replace(rStartX, '0')
                .replace(rStartY, '0')
                .replace(rHalfWayX,
                    ((oXtrarsBtnCoords.x - parseInt(GM_getValue('oSettingsWindowPosition').x) -
                        (nSettingsRealWidth + nXtrarsBtnWidth) / 2) / 2)
                        .toString() + 'px')
                .replace(rHalfWayY,
                    ((oXtrarsBtnCoords.y - parseInt(GM_getValue('oSettingsWindowPosition').y) -
                        (this.#nSettingsWindowHeight + nXtrarsBtnWidth) / 2) / 2)
                        .toString() + 'px')
                .replace(rBeforeEndX, (oXtrarsBtnCoords.x - parseInt(GM_getValue('oSettingsWindowPosition').x) -
                    nSettingsRealWidth / 2 + nXtrarsBtnWidth / 2)
                    .toString() + 'px')
                .replace(rBeforeEndY, (oXtrarsBtnCoords.y - parseInt(GM_getValue('oSettingsWindowPosition').y) -
                    this.#nSettingsWindowHeight / 2 + nXtrarsBtnWidth / 2)
                    .toString() + 'px')
                .replace(rEndX,
                    (oXtrarsBtnCoords.x - parseInt(GM_getValue('oSettingsWindowPosition').x) -
                        nSettingsRealWidth / 2 + nXtrarsBtnWidth / 2)
                        .toString() + 'px')
                .replace(rEndY,
                    (oXtrarsBtnCoords.y - parseInt(GM_getValue('oSettingsWindowPosition').y) -
                        this.#nSettingsWindowHeight / 2 + nXtrarsBtnWidth / 2)
                        .toString() + 'px');
        }
    }

    #closeSettingsWindow(oSettingsWindow) {
        document.removeEventListener("touchmove", this.drag);
        document.removeEventListener("mousemove", this.drag);

        this.#slideInAndOpenOrSlideOutAndCloseWindow();
        oSettingsWindow.classList.remove('run-circleToWindow-animation');
        oSettingsWindow.classList.add('run-windowToCircle-animation');
        this.restartAnimation(oSettingsWindow);


        GM_setValue('bIsSettingsWindowOpen', false);
        GM_setValue('sLastActiveTab', '');
    }

    #nSettingsWindowWidth = 500;
    #nSettingsWindowHeight = 170;
    #bButtonDisabled = false;
}

/**
 The CStreamingHandler class that extends the CBaseHandler class and provides additional functionality for streaming
 video content.
 @class
 @extends CBaseHandler
 */
class CStreamingHandler extends CBaseHandler {
    oTimer;

    /**
     Checks if the given regex matches the current URL and if the element with the given selector exists on the page.
     @async
     @param {RegExp} rRegex - A regular expression to match the URL.
     @param {string} sSelector - A CSS selector for the element.
     @returns {Promise<Boolean>} A Promise that resolves to a Boolean indicating if the element exists.
     */
    async isStreamingHoster(rRegex, sSelector) {
        return this.hasUrl([rRegex]) && await this.waitForElement(sSelector).catch(() => null);
    }

    /**
     Iterates through a list of streaming hosters and finds the current hoster.
     @async
     @param {Array} aHoster - An array of hosters.
     @returns {Promise<void>} A Promise that resolves after the current hoster is found and the stream behavior is set.
     */
    async findOutStreamingHoster(aHoster) {
        for (let oHoster of aHoster) {
            if (await this.isStreamingHoster(oHoster.regex, oHoster.selector)) {
                let oVideo = await this.waitForElement(oHoster.selector)
                    .catch(() => null);
                await this.setStreamBehavior(oHoster, oVideo);
            }
        }
    }

    /**
     Appends custom style to the document head.
     */
    appendOwnStyle() {
        let oStyle = document.createElement('style');
        oStyle.innerHTML = `<style>
            @media screen and (max-width: 800px) {
              #xtrars-warning-window {
                width: calc(100% - 10px)  !important;
              }
            }
            
            .xtrars-copied {
                  padding: 8px 12px;
                  background-color: #4CAF50;
                  color: white;
                  border-radius: 3px;
                  font-size: 14px;
                  display: none;
                  animation-name: xtrars-fadeIn;
                  animation-duration: 1s;
            }
            @keyframes xtrars-fadeIn {
                  from {opacity: 0;}
                  to {opacity: 1;}
            }
            
            #xtrars-warning-window {
                position: absolute; 
                top: 20%; 
                left: 50%;
                transform: translateX(-50%); 
                width: 50%; 
                background-color: white;
            }`.replace('<style>', '');
        document.head.appendChild(oStyle)
    }

    /**
     Detects the current browser type and returns its name.
     @returns {string} A string representing the name of the browser.
     */
    detectBrowser() {
        // BIG thanks to Rob W https://stackoverflow.com/a/9851769/8887112
        let bIsChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        let isEdge = bIsChrome && (navigator.userAgent.indexOf("Edg") !== -1);
        let bIsFirefox = typeof InstallTrigger !== 'undefined';
        let bIsOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        let bIsSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));

        if (isEdge) return 'edge';
        if (bIsChrome) return 'chrome';
        if (bIsFirefox) return 'firefox';
        if (bIsOpera) return 'opera';
        if (bIsSafari) return 'safari';
        return 'none';
    }

    /**
     Registers keydown and keyup event listeners for the document object that will apply keyboard shortcuts to local video object
     */
    applyShortcuts(o = undefined) {
        try {
            if (o) {
                o.addEventListener('keydown', (o) => {
                    if (!this.#aKeyCodesToHandle.includes(o.keyCode)) return true;
                    o.stopImmediatePropagation();
                    o.preventDefault();
                    this.initShortcutTimer(o);
                });
                o.addEventListener('keyup', (o) => {
                    if (!this.#aKeyCodesToHandle.includes(o.keyCode)) return true;
                    o.stopImmediatePropagation();
                    o.preventDefault();
                    this.removeShortcutTimers();
                });
                o.addEventListener('click', (o) => {
                    o.stopImmediatePropagation();
                }, true);
                return;
            }

            document.addEventListener('keydown', (o) => {
                if (!this.#aKeyCodesToHandle.includes(o.keyCode)) return true;
                o.stopImmediatePropagation();
                o.preventDefault();
                this.initShortcutTimer(o);
            });

            document.addEventListener('keyup', (o) => {
                if (!this.#aKeyCodesToHandle.includes(o.keyCode)) return true;
                o.stopImmediatePropagation();
                o.preventDefault();
                this.removeShortcutTimers();
            });
        } catch (e) {

        }

    }

    /**
     Initializes a timer for a given keyboard event and calls the 'shortcuts' function every 150ms while the key is being held down.
     @param {Object} o - Keyboard event object that triggered the function
     */
    initShortcutTimer(o) {
        if (this.oTimer) return;
        this.fireShortcut(o);
        this.#bSingleKeyPressed = true;

        // aktiviere nur bei Pfeiltasten das Interval
        if (!(o.keyCode > 36 && o.keyCode < 41)) return;

        // speichere Zustand & pausiere Video
        if (o.keyCode === 37 || o.keyCode === 39) {
            this.#bIsPlaying = !document.localVideo.paused;
            this.#bIsTimeKeyPressed = true;
            document.localVideo.pause();
        }

        this.oTimer = () => {
            this.fireShortcut(o);
            this.#iTimeJumpIndex++;
            if (this.#fTimeout > 20) {
                if (this.#fTimeout === this.#fInitTimeout) {
                    this.#fTimeout = 250;
                }
                if (!(this.#iTimeJumpIndex % 3)) {
                    this.#fTimeout *= 0.9;
                }
            }
            this.#iTimeoutId = setTimeout(this.oTimer, Math.floor(this.#fTimeout));
        }
        this.#iTimeoutId = setTimeout(this.oTimer, Math.floor(this.#fTimeout));
    }

    /**
     Removes any existing keyboard shortcut timers or pauses the video playback if the arrow keys were pressed.
     */
    removeShortcutTimers() {
        clearTimeout(this.#iTimeoutId);
        delete this.oTimer;
        if (this.#bIsPlaying && this.#bIsTimeKeyPressed) {
            document.localVideo.play();
        }
        this.#iTimeJumpIndex = 0;
        this.#iTimeJump = 10;
        this.#fTimeout = this.#fInitTimeout;
        this.#bIsTimeKeyPressed = false;
        this.#bSingleKeyPressed = false;
    }

    /**
     Handles various keyboard shortcuts for the local video object depending on the key pressed.
     @param {Object} o - Keyboard event object.
     */
    fireShortcut(o) {
        if (!o || o.shiftKey || o.ctrlKey || o.altKey || o.metaKey || !document.localVideo) return;

        // noinspection FallThroughInSwitchStatementJS
        switch (o.keyCode) {
            case 37: // Left
                document.localVideo.currentTime -= this.#iTimeJump;
                break;
            case 38: // Up
                if (document.localVideo.volume < 0.9) {
                    document.localVideo.volume += 0.1;
                } else {
                    document.localVideo.volume = 1;
                }
                break;
            case 39: // Right
                document.localVideo.currentTime += this.#iTimeJump;
                break;
            case 40: // Down
                if (document.localVideo.volume > 0.1) {
                    document.localVideo.volume -= 0.1;
                } else {
                    document.localVideo.volume = 0;
                }
                break;
            case 70: // F
                if (this.#bSingleKeyPressed) break;
                if (!document.fullscreenElement) {
                    document.localVideo.requestFullscreen().catch(() => {
                        document.localVideo.style.width = "100%";
                        document.localVideo.style.height = "100%";
                        document.body.style.margin = "0px";
                        document.body.style['background-color'] = "black";
                    });
                } else {
                    document.exitFullscreen().catch(() => null);
                }
                break;
            case 32: // Space
                if (o.target.tagName === 'VIDEO') break;
            case 75: // K
                if (this.#bSingleKeyPressed) break;
                this.#bIsPlaying = document.localVideo.paused;
                if (this.#bIsPlaying) {
                    document.localVideo.play();
                } else {
                    document.localVideo.pause();
                }
                break;
            case 77: // M
                if (this.#bSingleKeyPressed) break;
                document.localVideo.muted = !document.localVideo.muted;
                break;
            case 48: // Zahlen 0-9
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 96:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
                if (this.#bSingleKeyPressed) break;
                let fDuration = document.localVideo.duration;
                let iSection = (o.keyCode + (o.keyCode < 96 ? 2 : 4)) % 10;

                document.localVideo.currentTime = fDuration / 10 * iSection;
                break;
        }
    }

    /**
     Waits for the local video object to become available and sets up event listeners to enable keyboard shortcuts.
     */
    async handleLocalVideo() {
        let oVideo = await this.waitForElement('html head ~ body video').catch(() => null);

        // Fängt Event ab und verhindert, dass untergeordnete Elemente auf das Event reagieren können (somit werden Popups verhindert)
        window.addEventListener('click', (o) => {
            o.stopImmediatePropagation();
        }, true);
        document.addEventListener('click', (o) => {
            o.stopImmediatePropagation();
        }, true);
        oVideo.addEventListener('click', (o) => {
            o.stopImmediatePropagation();
        }, true);

        let oWarningWindow = document.getElementById('xtrars-warning-window');

        document.localVideo = oVideo;

        // Ende überspringen
        let iIndex = 0;
        oVideo.addEventListener('timeupdate', () => {
            if (oWarningWindow && iIndex > 2) {
                oWarningWindow.style.display = "none";
            }
            iIndex++;

            if (oVideo.currentTime + (GM_getValue('bSkipEnd') ? (GM_getValue('iSkipEndTime') ?? 1) : 1) >= oVideo.duration) {
                GM_setValue('isLocalVideoEnded', true);
                window.close();
            }
        });

        oVideo.addEventListener('play', () => {
            this.#bIsPlaying = true;
            let oWarningWindow = document.getElementById('xtrars-warning-window');
            if (oWarningWindow) {
                oWarningWindow.style.display = "none";
            }
        });

        oVideo.addEventListener('loadeddata', () => {
            this.applyShortcuts();
            oVideo.currentTime = 0;

            if (GM_getValue('bSkipStart') && GM_getValue('iSkipStartTime')) {
                oVideo.currentTime = GM_getValue('iSkipStartTime');
            }

            if (!GM_getValue('bSkipEnd') || GM_getValue('iSkipEndTime') >= oVideo.duration) {
                oVideo.addEventListener('waiting', () => {
                    if (oVideo.currentTime + (GM_getValue('bSkipEnd') ? (GM_getValue('iSkipEndTime') ?? 1) : 1) >= oVideo.duration) {
                        setTimeout(() => {
                            GM_setValue('isLocalVideoEnded', true);
                            window.close();
                        }, 2e3);
                    }
                });
            }
        });

        // Erlaube Fullscreen durch Doppelklick
        window.addEventListener('dblclick', () => {
            if (window.innerHeight === screen.height) {
                document.exitFullscreen().catch(() => null);
            } else {
                oVideo.requestFullscreen().catch(() => null);
            }
        }, true);

        oVideo.style.left = 0;
        oVideo.style.top = 0;
        oVideo.style.position = "fixed";
        oVideo.style.width = "100vw";
        oVideo.style.height = "100vh";
        oVideo.style['z-index'] = 2147483647;
        oVideo.style.backgroundColor = "black";
        document.body.style.margin = "0px";
        document.body.style.backgroundColor = "black";
        document.body.style.overflow = "hidden";
        oVideo.requestFullscreen().catch(() => null);

        oVideo.play().catch(() => {
            // Autoplay wurde blockiert
            this.showAutoplayWarning();
        });
    }

    /**
     Sets the behavior of the video stream based on the hoster and video source
     @async
     @param {object} oHoster - The hoster object containing information on the hoster and its regular expression for
      matching the m3u8 video url
     @param {object} oVideo - The video object whose behavior is being set
     @returns {void}
     */
    async setStreamBehavior(oHoster, oVideo) {
        if (oHoster.hoster === this.getHoster(0, true)) {

            await new Promise(resolve => {
                setTimeout(() => resolve(), 5000);
                window.addEventListener('load', async () => resolve(), false);
            });

            let oClickEvent = new Event('click');
            oClickEvent.which = 1;
            oClickEvent.pageX = 6;
            oClickEvent.pageY = 1;
            (await this.waitForElement(oHoster.selector)).dispatchEvent(oClickEvent);

            let oVideoElement = await this.waitForElement(oHoster.selector).catch(() => null);

            // Seite bereinigen
            document.body.prepend(oVideoElement);
            document.querySelectorAll('iframe').forEach(oIframe => {
                oIframe.remove();
            });
            Array.from(document.body.children).forEach(oElement => {
                if (oElement.tagName !== 'VIDEO') {
                    oElement.style.display = 'none';
                }
            });

            oVideoElement.controls = true;
            oVideoElement.preload = true;
            oVideoElement.autoplay = true;
        } else if (oHoster.hoster === this.getHoster(1, true)) {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', () => resolve(), false);
            });
            oVideo.src = 'https:/' + oVideo.innerText;
            window.location.replace(oVideo.src);

        } else if (oHoster.hoster === this.getHoster(2, true)) {
            if (/https:\/\/.*\.[a-z]{2,3}\/d\//.test(document.location.href)) {
                window.location.replace(oVideo.src);
            }

            // im embedded mode
            await new Promise(resolve => {
                setTimeout(() => resolve(), 5000);
                window.addEventListener('load', async () => resolve(), false);
            });
            let oVideoElement = await this.waitForElement('.video-js > video').catch(() => null);


            // Seite bereinigen
            document.body.innerHTML = '';
            document.body.append(oVideoElement);
            window.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                event.preventDefault();
            }, true);

            oVideoElement.controls = true;
            oVideoElement.preload = true;
            oVideoElement.autoplay = true;
        } else if (oHoster.hoster === this.getHoster(3, true)) {
            await new Promise(resolve => {
                window.addEventListener('load', async () => {
                    await this.waitForElement(oHoster.selector + '[src]').catch(() => null);
                    resolve();
                }, false);
            });

            window.location.replace(oVideo.src);
        }
    }

    /**
     Shows a warning message for autoplay and appends custom style to the document head.
     */
    async showAutoplayWarning() {
        this.appendOwnStyle();

        let oContent = {
            chrome: `
                <div style="width: 100%; text-align: center;">
                    <span style="font-weight: bold; font-size: larger;">Autoplay wurde vom Browser blockiert!</span> <br><br>
                    Zum Aktivieren kopiere den Link in die Adressleiste und aktiviere "Ton"
                    (Es muss Zulassen drin stehen. Automatisch reicht nicht.)
                    <br><br>
                    <input id="xtrars-autoplay-input" type="text" style="width: calc(100% - 20px); margin: 5px;"
                    value="chrome://settings/content/siteDetails?site=${window.location.protocol}//${window.location.hostname}">
                </div>
                <div id="xtrars-copied-message"></div>`,
            firefox: `
                <div style="width: 100%; text-align: center; padding: 5px;">
                    <span style="font-weight: bold; font-size: larger;">Autoplay wurde vom Browser blockiert!</span> <br><br>
                    Zum Aktivieren halte dich an die Bildanleitung:
                    <br><br>
                    <img src="data:image/webp;base64,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" 
                    alt="Klicke oben im Firefox auf das Blockieren-Symbol und aktiviere Autoplay">
                    <br><br>
                </div>`,
            safari: ``,
            aliases: {
                chrome: 'chrome', edge: 'chrome', firefox: 'firefox', none: 'chrome', opera: 'chrome', safari: 'chrome', // TODO Safari anpassen
            }
        };

        const oWarningWindow = document.createElement("div");
        oWarningWindow.id = 'xtrars-warning-window';
        oWarningWindow.innerHTML = oContent[oContent.aliases[this.detectBrowser()]];
        oWarningWindow.style.cssText = `
            position: absolute; 
            top: 40%; background-color: white;  
            left:50%;
            top: 50%;
            transform: translate(-50%,-50%);
            font-family: Arial, Helvetica, sans-serif;
            padding: 10px;
            z-index: 2147483647;
        `;
        document.body.appendChild(oWarningWindow);

        let autoplayInput = document.getElementById('xtrars-autoplay-input');

        autoplayInput.addEventListener('focus', () => {
            navigator.clipboard
                .writeText(autoplayInput.value)
                .then(() => {
                    let oMessage = document.getElementById("xtrars-copied-message");
                    oMessage.innerHTML = "URL kopiert";
                    oMessage.classList.add("xtrars-copied");
                    oMessage.style.display = "block";
                    setTimeout(() => {
                        oMessage.style.display = "none";
                    }, 2500);
                })
                .catch(() => null);
        });
    }


    /**@type {boolean}*/
    #bIsPlaying = false;
    /**@type {boolean}*/
    #bIsTimeKeyPressed = false;
    /**@type {boolean}*/
    #bSingleKeyPressed = false;
    /**@type {number}*/
    #iTimeJump = 10;
    /**@type {number}*/
    #iTimeJumpIndex = 0;
    /**@type {number}*/
    #iTimeoutId;
    /**@type {number}*/
    #fInitTimeout = 750;
    /**@type {number}*/
    #fTimeout = this.#fInitTimeout;
    /**@type {number[]}*/
    #aKeyCodesToHandle = [
        32, // Space
        37, 38, 39, 40, // Arrow keys (37: Left, 38: Up, 39: Right, 40: Down)
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // Number keys 0-9
        70, 75, 77, // 70, 75, 77: Character keys 'F', 'K', 'M'
        96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // Number pad keys 0-9
    ];

}

/**
 An async IIFE that enhances the user experience on Burning Series website
 @async
 @function
 @returns {Promise<void>}
 */
(async function () {
    'use strict';

    /**
     Instance of the CBurningSeriesHandler class used to interact with the Burning Series website.
     @type {CBurningSeriesHandler}
     */
    let cBsHandler = new CBurningSeriesHandler();

    /**
     Instance of the CStreamingHandler class used to handle video streaming.
     @type {CStreamingHandler}
     */
    let cStreamingHandler = new CStreamingHandler();

    if (!cBsHandler.hasUrl([/https:\/\/(bs.to|burningseries.[a-z]{2,3})/])) {
        cStreamingHandler.applyShortcuts();
    }

    await new Promise((resolve) => {
        let iInterval = setInterval(() => {
            if (document.body) {
                clearInterval(iInterval);
                resolve();
            }
        }, 70);
    });

    if (GM_getValue('clickFirstSeason')) {
        GM_setValue('clickFirstSeason', false);
        let sSelector = '.serie > .episodes > tbody > tr:first-child > td:first-child > a:first-child';
        await cBsHandler.waitForElement(sSelector);
        document.location.replace(document.querySelector(sSelector));
    }
    cBsHandler.initGMVariables();

    if (cBsHandler.isSeries()) {
        cBsHandler.appendOwnStyle();
        await cBsHandler.buildButton();
        cBsHandler.buildSettingsWindow();
        cBsHandler.initEvents();

        if (GM_getValue('bIsSettingsWindowOpen')) {
            if (GM_getValue('sLastActiveTab') !== '') {
                cBsHandler.showTabContent(GM_getValue('sLastActiveTab'));
            }
            cBsHandler.showSettingsWindow();
        }

        if (cBsHandler.isEpisode()) {
            if (GM_getValue('bActivateEnhancer') &&
                !cBsHandler.hasAnotherHoster() &&
                !cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(0))]) &&
                !cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(1))]) &&
                !cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(2))]) &&
                !cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(3))])) {
                if (GM_getValue('bSelectHoster') === cBsHandler.getHoster(0, true)) {
                    await cBsHandler.skipUnavailable([
                        cBsHandler.getHoster(0),
                        cBsHandler.getHoster(3),
                        cBsHandler.getHoster(1),
                        cBsHandler.getHoster(2)
                    ]);
                } else if (GM_getValue('bSelectHoster') === cBsHandler.getHoster(1, true)) {
                    await cBsHandler.skipUnavailable([
                        cBsHandler.getHoster(1),
                        cBsHandler.getHoster(3),
                        cBsHandler.getHoster(0),
                        cBsHandler.getHoster(2)
                    ]);
                } else if (GM_getValue('bSelectHoster') === cBsHandler.getHoster(2, true)) {
                    await cBsHandler.skipUnavailable([
                        cBsHandler.getHoster(2),
                        cBsHandler.getHoster(3),
                        cBsHandler.getHoster(0),
                        cBsHandler.getHoster(1),
                    ]);
                } else if (GM_getValue('bSelectHoster') === cBsHandler.getHoster(3, true)) {
                    await cBsHandler.skipUnavailable([
                        cBsHandler.getHoster(3),
                        cBsHandler.getHoster(0),
                        cBsHandler.getHoster(2),
                        cBsHandler.getHoster(1),
                    ]);
                }
            }

            if (GM_getValue('bActivateEnhancer') && !cBsHandler.hasAnotherHoster() &&
                (cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(0))]) ||
                    cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(1))]) ||
                    cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(2))]) ||
                    cBsHandler.hasUrl([new RegExp('/' + cBsHandler.getHoster(3))]))) {
                GM_setValue('isLocalVideoEnded', false);
                cBsHandler.playNextEpisodeIfVideoEnded();
                let oName = await cBsHandler.waitForElement('.episode > h2');
                GM_setValue('sEpisodeName', oName.outerText);
                let eActiveTab = await cBsHandler.waitForElement('section.serie .hoster-tabs .active a');
                await cBsHandler.clickPlay();
                await cBsHandler.handleBsVideo(eActiveTab.innerText,
                    [
                        new RegExp(cBsHandler.getHoster(0)),
                        new RegExp(cBsHandler.getHoster(1)),
                        new RegExp(cBsHandler.getHoster(2)),
                        new RegExp(cBsHandler.getHoster(3))
                    ]);
            }
        }
    }

    if (GM_getValue('bActivateEnhancer')) {
        const aHoster = [
            {
                regex: /^(https:\/\/(v-*o-*e|[-unblock\d]){1,15}\.[a-z]{2,3}\/.*)|(https:\/\/richardsignfish\.com\/.*)/g,
                selector: 'video.jw-video',
                hoster: cBsHandler.getHoster(0, true),
                m3u8Regex: /(?<=sources = {([ \n]|.)*?hls': ')https:\/\/.*(?=',)/g,

            },
            {
                regex: /^https:\/\/(dood)|(ds2play)|(d[0o]+d)\.[a-z]{2,3}\//g,
                selector: '#os_player > iframe, #video_player_html5_api',
                hoster: cBsHandler.getHoster(2, true),
            },
            {
                regex: /^(https:\/\/streamtape\.[a-z]{2,3}\/)|(https:\/\/watchadsontape\.com)/g,
                selector: '#robotlink',
                hoster: cBsHandler.getHoster(1, true),
            },
            {
                regex: /^(https:\/\/(vidoza|videzz)\.[a-z]{2,3}\/embed)/g,
                selector: '#player_html5_api',
                hoster: cBsHandler.getHoster(3, true),
            }
        ];
        await cStreamingHandler.findOutStreamingHoster(aHoster);
        await cStreamingHandler.handleLocalVideo();
    }
})();
