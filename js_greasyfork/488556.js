// ==UserScript==
// @id           pimp-my-autodarts@https://github.com/sebudde/pimp-my-autodarts
// @name         Pimp My Autodarts (caller & other stuff) - deprecated
// @namespace    https://github.com/sebudde/pimp-my-autodarts
// @version      0.5
// @description  Userscript for Autodarts - deprecated, use Autodarts Tools Extension instead
// @author       sebudde
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/488556/Pimp%20My%20Autodarts%20%28caller%20%20other%20stuff%29%20-%20deprecated.user.js
// @updateURL https://update.greasyfork.org/scripts/488556/Pimp%20My%20Autodarts%20%28caller%20%20other%20stuff%29%20-%20deprecated.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let rootContainer;
    let headerEl;
    let mainContainerEl;
    let hideHeaderGM = false;
    let hideHeaderBtn;

    // match
    let matchMenuRow;
    let matchMenuContainer;
    let playerContainerEl;
    let playerContainerInfoElArr;
    let playerContainerStatsElArr;
    let playerCount;
    let matchHistoryBtnClicked = false;

    let activePlayerCardPointsEl;
    let editPlayerThrowActive;
    let inactivePlayerCardPointsElArr = [];
    let winnerPlayerCard;

    let turnContainerEl;

    let matchVariant;
    let isValidMatchVariant = false;

    // config
    let callerData = {};
    let winnerSoundData = {};
    let gameSound1;
    let inactiveSmall;
    let showTotalDartsAtLegFinish;
    let showTotalDartsAtLegFinishLarge;
    let soundAfterBotThrow;
    let modalTakeout;
    //

    let gsa = false;

    let firstLoad = true;

    const configPathName = '/config';
    const configPageContainer = document.createElement('div');

    const ringHeadingEl = document.createElement('h1');
    ringHeadingEl.classList.add('ring');

    const isiOS = [
            'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

    const isSmallDisplay = window.innerHeight < 900;

    const getRootContainer = () => document.querySelector('#root > div');
    const getMainContainerEl = () => document.querySelectorAll('#root > div > div')[1];
    const getHeaderEl = () => document.querySelectorAll('#root > div > div')[0];

    const observeDOM = (function() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        return function(obj, config, callback) {
            if (!obj || obj.nodeType !== 1) return;
            const mutationObserver = new MutationObserver(callback);
            const mutConfig = {
                ...{
                    attributes: true,
                    childList: true,
                    subtree: true
                }, ...config
            };
            mutationObserver.observe(obj, mutConfig);
            return mutationObserver;
        };
    })();

    const showConfigPage = (show) => {
        setTimeout(() => {
            matchHistoryBtnClicked = false;
        }, 1000);
        if (mainContainerEl) mainContainerEl.classList.toggle('adp_hide', show);
        if (configPageContainer) configPageContainer.classList.toggle('adp_hide', !show);
    };

    const showHeader = (show) => {
        if (hideHeaderBtn) hideHeaderBtn.innerText = `Menu ${show ? 'ON' : 'OFF'}`;
        if (matchMenuContainer) matchMenuContainer.style.display = show ? 'flex' : 'none';
        headerEl.classList.toggle('adp_hide', !show);
    };

    const setActiveAttr = (el, isActive) => {
        if (isActive) {
            el.setAttribute('data-active', '');
            el.classList.add('active');
        } else {
            el.removeAttribute('data-active');
            el.classList.remove('active');
        }
    };

    const setAdpData = async (name, value) => {

        const data = name.split('-');

        if (data[0].startsWith('caller')) {
            const gmCallerData = await GM.getValue('callerData') || {};
            const gmCallerValue = gmCallerData[data[0]] || {};
            const newCallerValue = {[data[1]]: value};
            callerData = {
                ...gmCallerData,
                [data[0]]: {...gmCallerValue, ...newCallerValue}
            };
            await GM.setValue('callerData:', callerData);

        } else if (data[0].startsWith('winnerSound')) {
            const gmWinnerSoundData = await GM.getValue('winnerSoundData') || {};
            const gmWinnerSoundValue = gmWinnerSoundData[data[0]] || {};
            const newWinnerSoundValue = {[data[1]]: value};
            winnerSoundData = {
                ...gmWinnerSoundData,
                [data[0]]: {...gmWinnerSoundValue, ...newWinnerSoundValue}
            };
            await GM.setValue('winnerSoundData', winnerSoundData);
        } else {
            const key = data[0];
            eval(key + ' = value');
            await GM.setValue([key], value);
        }

    };

    const callerObj = {
        caller1: {
            folder: '0',
            name: 'Caller OFF'
        },
        caller2: {
            folder: '1_male_eng',
            name: 'Male eng',
            server: 'https://autodarts.x10.mx',
            fileExt: '.mp3'
        },
        caller3: {
            folder: 'google_eng',
            name: 'Google eng'
        },
        caller4: {
            folder: 'google_de',
            name: 'Google de'
        }
    };

    //////////////// CSS classes start ////////////////////
    const adp_style = document.createElement('style');
    adp_style.type = 'text/css';
    adp_style.innerHTML = `
        body {
          /* mobile viewport bug fix */
          min-height: -webkit-fill-available!important;
        }
        html {
          height: -webkit-fill-available;
        }
        #root {
            height: 100vh;
        }
        .adp_points-small { font-size: 3em!important; }
        .adp_config-header {
              font-weight: 700;
              align-self: flex-start;
        }
        h2.adp_config-header { font-size: 1.5em; }
        h3.adp_config-header { font-size: 1.2em; }
        button.adp_config-btn {
            border-radius: var(--chakra-radii-md);
            background: var(--chakra-colors-whiteAlpha-200);
            font-weight: var(--chakra-fontWeights-semibold);
            height: var(--chakra-sizes-8);
            min-width: var(--chakra-sizes-16);
            padding: 0 var(--chakra-space-4);
            font-size: var(--chakra-fontSizes-md);
        }
        button.adp_config-btn:active:not(:disabled), button.adp_config-btn.active:not(:disabled) {
            background: var(--chakra-colors-whiteAlpha-400);
        }
        button.adp_config-btn:disabled {
            cursor: default;
            opacity: 0.5;
            // background: var(--chakra-colors-whiteAlpha-50);
            // color:
        }
        .adp_config-btn--label {
            width: 350px;
        }
        .adp_configPageContainer {
            flex: 1 1 0%;
            height: 100%;
            overflow: scroll;
            scrollbar-width: none;
        }
        .adp_configContainer {
            display: flex;
            flex-direction: column;
            gap: var(--chakra-space-4);
            padding: 1rem;
            width: 100%;
            max-width: 1366px;
            padding-bottom: 30px;
        }
        .adp_hide {
            display: none !important;
        }
        .adp_config-row {
            flex-direction: row;
            display: flex;
        }
        .adp_cricket-rownumber {
            font-size: var(--chakra-fontSizes-xl);
            position: absolute;
            left: calc(var(--chakra-space-2)* -1);
            text-align: center;
            width: var(--chakra-sizes-10);
            border-radius: 3px;
            color: var(--chakra-colors-white);
            border: white;
            opacity: 1;
            background: var(--chakra-colors-gray-500);
        }

        .game-shot-animation .ad-ext-player-score {
            line-height: 30px!important;
        }

        .game-shot-animation .game-shot-message {
            line-height: 84px!important;
        }

        /* .game-shot-animation {
            position: relative;
            z-index: 1;
        }

        .game-shot-animation > div {
            margin: 0;
            padding-top: calc(var(--chakra-space-4) - 2px);
            padding-bottom: calc(var(--chakra-space-4) - 2px);
        }


        .game-shot-animation > div:first-child {
            background: linear-gradient(0deg, #000, #272727);
        }

        .game-shot-animation:before,
        .game-shot-animation:after {
              content: "";
              position: absolute;
              left: -2px;
              top: -2px;
              background: linear-gradient(
                    45deg,
                    #fb0094,
                    #0000ff,
                    #00ff00,
                    #ffff00,
                    #ff0000,
                    #fb0094,
                    #0000ff,
                    #00ff00,
                    #ffff00,
                    #ff0000
              );
              background-size: 400%;
              width: calc(100% + 4px);
              height: calc(100% + 4px);
              z-index: -1;
              animation: steam 20s linear infinite;
              border-radius: 5px;
        }

        @keyframes steam {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 400% 0;
          }
          100% {
            background-position: 0 0;
          }
        }

        .game-shot-animation:after {
            filter: blur(50px);
        }
        */
        .adp_boardview-container.adp_showring .adp_boardview-image svg {
            clip-path: circle(44%);
        }
        .adp_boardview-container.adp_showring:not([data-ringsize="1"]) .adp_boardview-image image {
            clip-path: circle(34.5%) !important;
        }
        .adp_boardview-container.adp_showring[data-ringsize="2"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="3"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="4"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="5"] .adp_boardview-image svg {
            background: rgb(0 0 0);
            background: radial-gradient(circle, rgba(153, 153, 153, 1) 31%, rgba(0, 0, 0, 1) 58%);
        }
        .adp_boardview-container.adp_showring[data-ringsize="6"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="7"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="8"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="9"] .adp_boardview-image svg {
            background: var(--chakra-colors-blue-500);
        }
        .adp_boardview-container.adp_showring[data-ringsize="3"] .adp_boardview-image svg,
         .adp_boardview-container.adp_showring[data-ringsize="7"] .adp_boardview-image svg {
            clip-path: circle(45%);
        }
        .adp_boardview-container.adp_showring[data-ringsize="3"] .adp_boardview-image image,
        .adp_boardview-container.adp_showring[data-ringsize="7"] .adp_boardview-image image {
            clip-path: circle(35.5%) !important;
        }
        .adp_boardview-container.adp_showring[data-ringsize="4"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="8"] .adp_boardview-image svg {
            clip-path: circle(46.5%);
        }
        .adp_boardview-container.adp_showring[data-ringsize="4"] .adp_boardview-image image,
        .adp_boardview-container.adp_showring[data-ringsize="8"] .adp_boardview-image image {
            clip-path: circle(36.5%) !important;
        }
        .adp_boardview-container.adp_showring[data-ringsize="5"] .adp_boardview-image svg,
        .adp_boardview-container.adp_showring[data-ringsize="9"] .adp_boardview-image svg {
            clip-path: circle(48%);
        }
        .adp_boardview-container.adp_showring[data-ringsize="5"] .adp_boardview-image image,
        .adp_boardview-container.adp_showring[data-ringsize="9"] .adp_boardview-image image {
            clip-path: circle(37.5%) !important;
        }

        .adp_boardview-container .adp_boardview-numbers {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: none;
        }
        .adp_boardview-container.adp_showring .adp_boardview-numbers {
            display: block;
        }
        .ring {
            /* --character-width: 1ch; */
            --inner-angle: calc((360 / var(--char-count)) * 1deg);
            --character-width: 1;
            font-size: calc(var(--font-size, 1) * 1rem);
            position: absolute;
            top: 50%;
            left: 50%;
            font-weight: 900;
        }

        .char {
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 50%;
            /* line-height: 1; */
            transform:
            translate(-50%, -50%)
            rotate(calc(var(--inner-angle) * var(--char-index) - 2deg))
            translateY(var(--radius));
        }

        .chakra-modal {
            display: flex;
            width: 100vw;
            height: var(--chakra-vh);
            position: fixed;
            left: 0px;
            top: 0px;
            background: var(--chakra-colors-blackAlpha-600);
            z-index: var(--chakra-zIndices-modal);
            -webkit-box-pack: center;
            justify-content: center;
            align-items: flex-start;
            overflow: auto;
            overscroll-behavior-y: none;
            pointer-events: none;
        }
        .chakra-modal__content {
            display: flex;
            flex-direction: column;
            position: relative;
            width: auto;
            border-radius: var(--chakra-radii-md);
            color: inherit;
            margin-top: 35vh;
            z-index: var(--chakra-zIndices-modal);
            --modal-bg: var(--chakra-colors-white);
            --modal-shadow: var(--chakra-shadows-lg);
            box-shadow: var(--modal-shadow);
            max-width: var(--chakra-sizes-md);
            background: var(--chakra-colors-yellow-500);
}

        .chakra-modal__header {
            width: 290px;
            padding-inline-start: var(--chakra-space-6);
            padding-inline-end: var(--chakra-space-6);
            padding-top: var(--chakra-space-4);
            padding-bottom: var(--chakra-space-4);
            font-size: var(--chakra-fontSizes-lg);
            font-weight: var(--chakra-fontWeights-bold);
        }

        .chakra-modal__header:after {
              overflow: hidden;
              display: inline-block;
              vertical-align: bottom;
              -webkit-animation: ellipsis steps(4,end) 900ms infinite;
              animation: ellipsis steps(4,end) 900ms infinite;
              content: "\\2026";
              width: 0px;
            }

            @keyframes ellipsis {
              to {
                width: 1.25em;
              }
            }

            @-webkit-keyframes ellipsis {
              to {
                width: 1.25em;
              }
            }

    `;
    document.getElementsByTagName('head')[0].appendChild(adp_style);

    const onDOMready = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        gsa = urlParams.get('gsa') === '1';

        mainContainerEl = getMainContainerEl();
        mainContainerEl.classList.add('adp_maincontainer');

        rootContainer = getRootContainer();

        if (isiOS) {
            document.getElementById('root').style.height = 'calc(100vh + 1px)';
        }

        if (firstLoad) {
            firstLoad = false;
            hideHeaderGM = await GM.getValue('hideHeader');

            headerEl = getHeaderEl();
            headerEl.classList.add('adp_header');

            hideHeaderBtn = document.createElement('button');
            hideHeaderBtn.id = 'hideHeader';
            hideHeaderBtn.innerText = 'Header';
            hideHeaderBtn.classList.add('adp_config-btn');
            hideHeaderBtn.style.position = 'fixed';
            hideHeaderBtn.style.bottom = '20px';
            hideHeaderBtn.style.right = '20px';

            showHeader(!hideHeaderGM);

            setActiveAttr(hideHeaderBtn, !hideHeaderGM);

            hideHeaderBtn.addEventListener('click', async (event) => {
                const isActive = event.target.classList.contains('active');
                setActiveAttr(hideHeaderBtn, !isActive);
                showHeader(!isActive);
                await GM.setValue('hideHeader', isActive);
            }, false);

            document.getElementById('root').appendChild(hideHeaderBtn);

            //////////////// winner sound data  ////////////////////

            winnerSoundData = await GM.getValue('winnerSoundData') || {};

            //////////////// caller data  ////////////////////

            const gmCallerData = await GM.getValue('callerData') || {};

            callerData = {
                ...gmCallerData, ...callerObj
            };

            await GM.setValue('callerData', callerData);

            const callerObjLength = Object.keys(callerObj).length;

            //////////////// add config page  ////////////////////

            inactiveSmall = (await GM.getValue('inactiveSmall')) ?? true;
            showTotalDartsAtLegFinish = (await GM.getValue('showTotalDartsAtLegFinish')) ?? true;
            showTotalDartsAtLegFinishLarge = (await GM.getValue('showTotalDartsAtLegFinishLarge')) ?? false;
            soundAfterBotThrow = (await GM.getValue('soundAfterBotThrow')) ?? true;
            modalTakeout = (await GM.getValue('modalTakeout')) ?? true;

            configPageContainer.classList.add('adp_configPageContainer');
            const configContainer = document.createElement('div');
            configContainer.classList.add('adp_configContainer');
            configPageContainer.appendChild(configContainer);
            configPageContainer.classList.add('adp_hide');

            const configHeader = document.createElement('h2');
            configHeader.classList.add('adp_config-header');
            configHeader.innerText = 'Config';
            configContainer.appendChild(configHeader);

            const configContentHeader = document.createElement('h3');
            configContentHeader.classList.add('adp_config-header');
            configContentHeader.innerText = 'Match';
            configContainer.appendChild(configContentHeader);

            const configContentRow1 = document.createElement('div');
            configContentRow1.classList.add('adp_config-row');
            configContentRow1.style.gap = '2rem';

            configContentRow1.innerHTML = `
            <div class="adp_config-btn--label">Show points of inactive player</div>
            <button id="inactiveSmall" class="css-1xbmrf2 adp_config-btn${inactiveSmall ? ' active' : ''}">${inactiveSmall ? 'ON' : 'OFF'}</button>
            `;

            configContentRow1.querySelector('button#inactiveSmall').addEventListener('click', async (event) => {
                const isInactiveSmall = event.target.classList.contains('active');
                event.target.classList.toggle('active');
                inactiveSmall = !isInactiveSmall;
                await GM.setValue('inactiveSmall', !isInactiveSmall);
                event.target.innerText = !isInactiveSmall ? 'ON' : 'OFF';
            }, false);

            const configContentRow2 = document.createElement('div');
            configContentRow2.classList.add('adp_config-row');
            configContentRow2.style.gap = '2rem';

            configContentRow2.innerHTML = `
            <div class="adp_config-btn--label">Show total darts thrown at end of leg</div>
            <button id="showTotalDartsAtLegFinish" class="css-1xbmrf2 adp_config-btn${showTotalDartsAtLegFinish ? ' active' : ''}">${showTotalDartsAtLegFinish ? 'ON' : 'OFF'}</button>
            <button id="showTotalDartsAtLegFinishLarge" ${showTotalDartsAtLegFinish ? '' : 'disabled'} class="css-1xbmrf2 adp_config-btn${showTotalDartsAtLegFinishLarge
                ? ' active'
                : ''}">${showTotalDartsAtLegFinishLarge ? 'LARGE' : 'SMALL'}</button>
            `;

            configContentRow2.querySelector('button#showTotalDartsAtLegFinish').addEventListener('click', async (event) => {
                const isShowTotalDartsAtLegFinish = event.target.classList.contains('active');
                event.target.classList.toggle('active');
                showTotalDartsAtLegFinish = !isShowTotalDartsAtLegFinish;
                await GM.setValue('showTotalDartsAtLegFinish', !isShowTotalDartsAtLegFinish);
                event.target.innerText = !isShowTotalDartsAtLegFinish ? 'ON' : 'OFF';
                configContentRow2.querySelector('button#showTotalDartsAtLegFinishLarge').toggleAttribute('disabled', isShowTotalDartsAtLegFinish);
            }, false);

            configContentRow2.querySelector('button#showTotalDartsAtLegFinishLarge').addEventListener('click', async (event) => {
                const isShowTotalDartsAtLegFinishLarge = event.target.classList.contains('active');
                event.target.classList.toggle('active');
                showTotalDartsAtLegFinishLarge = !isShowTotalDartsAtLegFinishLarge;
                await GM.setValue('showTotalDartsAtLegFinishLarge', !isShowTotalDartsAtLegFinishLarge);
                event.target.innerText = !isShowTotalDartsAtLegFinishLarge ? 'LARGE' : 'SMALL';
            }, false);

            const configContentRow3 = document.createElement('div');
            configContentRow3.classList.add('adp_config-row');
            configContentRow3.style.gap = '2rem';

            configContentRow3.innerHTML = `
            <div class="adp_config-btn--label">Play sound after a Bot threw</div>
            <button id="soundAfterBotThrow" class="css-1xbmrf2 adp_config-btn${soundAfterBotThrow ? ' active' : ''}">${soundAfterBotThrow ? 'ON' : 'OFF'}</button>
            `;

            configContentRow3.querySelector('button#soundAfterBotThrow').addEventListener('click', async (event) => {
                const isSoundAfterBotThrow = event.target.classList.contains('active');
                event.target.classList.toggle('active');
                soundAfterBotThrow = !isSoundAfterBotThrow;
                await GM.setValue('soundAfterBotThrow', !isSoundAfterBotThrow);
                event.target.innerText = !isSoundAfterBotThrow ? 'ON' : 'OFF';
            }, false);

            const configContentRow4 = document.createElement('div');
            configContentRow4.classList.add('adp_config-row');
            configContentRow4.style.gap = '2rem';

            configContentRow4.innerHTML = `
            <div class="adp_config-btn--label">Show modal while takeout</div>
            <button id="modalTakeout" class="css-1xbmrf2 adp_config-btn${modalTakeout ? ' active' : ''}">${modalTakeout ? 'ON' : 'OFF'}</button>
            `;

            configContentRow4.querySelector('button#modalTakeout').addEventListener('click', async (event) => {
                const isModalTakeout = event.target.classList.contains('active');
                event.target.classList.toggle('active');
                modalTakeout = !isModalTakeout;
                await GM.setValue('modalTakeout', !isModalTakeout);
                event.target.innerText = !isModalTakeout ? 'ON' : 'OFF';
            }, false);

            configContainer.appendChild(configContentRow1);
            configContainer.appendChild(configContentRow2);
            configContainer.appendChild(configContentRow3);
            configContainer.appendChild(configContentRow4);

            const callerHeader = document.createElement('h3');
            callerHeader.classList.add('adp_config-header');
            callerHeader.innerText = 'Caller';
            configContainer.appendChild(callerHeader);

            for (let callerCount = callerObjLength + 1; callerCount <= callerObjLength + 5; callerCount++) {
                const callerContainer = document.createElement('div');
                callerContainer.classList.add('adp_config-row');
                callerContainer.style.gap = '30px';
                const callerServer = callerData[`caller${callerCount}`]?.server || '';
                const callerName = callerData[`caller${callerCount}`]?.name || '';
                const callerFolder = callerData[`caller${callerCount}`]?.folder || '';
                const callerFileExt = callerData[`caller${callerCount}`]?.fileExt || '';

                callerContainer.innerHTML = `
                        <div class="css-1igwmid" style="width: 70px; margin-right: 2em">
                            <b>Caller ${callerCount - callerObjLength}</b>
                        </div>
                        <div class="css-1igwmid">
                            <div class="css-u4ybgy" style="width: 240px"><div class="css-1igwmid"><input placeholder="Server" class="adp_caller--server css-1ndqqtl" name="caller${callerCount}-server" value="${callerServer}"></div></div>
                        </div>
                        <div class="css-1igwmid">
                            <div class="css-u4ybgy"><div class="css-1igwmid"><input placeholder="Name" class="adp_caller--name css-1ndqqtl" name="caller${callerCount}-name" value="${callerName}"></div></div>
                        </div>
                        <div class="css-1igwmid">
                            <div class="css-u4ybgy" style="width: 180px"><div class="css-1igwmid"><input placeholder="Folder"  class="adp_caller--folder css-1ndqqtl" name="caller${callerCount}-folder" value="${callerFolder}"></div></div>
                        </div>
                        <div class="css-1igwmid">
                            <div class="css-u4ybgy" style="width: 100px"><div class="css-1igwmid"><input placeholder="File ext"  class="adp_caller--folder css-1ndqqtl" name="caller${callerCount}-fileExt" value="${callerFileExt}"></div></div>
                        </div>`;
                configContainer.appendChild(callerContainer);
            }

            const winnerSoundHeader = document.createElement('h3');
            winnerSoundHeader.classList.add('adp_config-header');
            winnerSoundHeader.innerText = 'Winner sound';
            configContainer.appendChild(winnerSoundHeader);

            const winnerSoundMax = 3;

            for (let winnerSoundCount = 1; winnerSoundCount <= winnerSoundMax; winnerSoundCount++) {
                const winnerSoundContainer = document.createElement('div');
                winnerSoundContainer.classList.add('adp_config-row');
                winnerSoundContainer.style.gap = '30px';
                const winnerSoundPlayername = winnerSoundData[`winnerSound${winnerSoundCount}`]?.playername || '';
                const winnerSoundSoundUrl = winnerSoundData[`winnerSound${winnerSoundCount}`]?.soundurl || '';

                const isLast = winnerSoundCount === winnerSoundMax;

                winnerSoundContainer.innerHTML = `
                        <div class="css-1igwmid" style="width: 70px; margin-right: 2em">
                            <b>${isLast ? 'Fallback' : 'Player ' + winnerSoundCount}</b>
                        </div>
                        <div class="css-1igwmid">
                            <div class="css-u4ybgy" style="width: 240px"><div class="css-1igwmid"><input ${isLast
                    ? 'disabled'
                    : ''} placeholder="Player name" class="adp_winnerSound--playername css-1ndqqtl" name="winnerSound${winnerSoundCount}-playername" value="${isLast
                    ? 'Fallback'
                    : winnerSoundPlayername}"></div></div>
                        </div>
                        <div class="css-1igwmid">
                            <div class="css-u4ybgy" style="width: 500px"><div class="css-1igwmid"><input placeholder="Sound URL"  class="adp_winnerSound--soundurl css-1ndqqtl" name="winnerSound${winnerSoundCount}-soundurl" value="${winnerSoundSoundUrl}"></div></div>
                        </div>`;
                configContainer.appendChild(winnerSoundContainer);
            }

            gameSound1 = await GM.getValue('gameSound1');

            const gameSoundHeader = document.createElement('h3');
            gameSoundHeader.classList.add('adp_config-header');
            gameSoundHeader.innerText = 'Game sounds';
            configContainer.appendChild(gameSoundHeader);

            const soundContentRow1 = document.createElement('div');
            soundContentRow1.classList.add('adp_config-row');
            soundContentRow1.style.gap = '2rem';

            soundContentRow1.innerHTML = `
            <div class="css-1igwmid" style="width: 70px; margin-right: 2em">
                <div class="adp_gameSound--label">Busted</div>
            </div>
            <div class="css-1igwmid" style="width: 772px;">
                <input placeholder="busted sound"  class="adp_gameSound css-1ndqqtl" name="gameSound1" value="${gameSound1 || ''}">
            </div>
            `;

            configContainer.appendChild(soundContentRow1);

            const input = configContainer.querySelectorAll('input');
            [...input].forEach((el) => (el.addEventListener('blur', (e) => {
                setAdpData(e.target.name, e.target.value);
            })));

            if (rootContainer) rootContainer.appendChild(configPageContainer);

            //////////////// add menu  ////////////////////
            document.getElementById('ad-ext-user-menu-extra').style.display = 'block';
            const menuContainer = document.getElementById('ad-ext-user-menu-extra').parentElement.parentElement;
            const menuBtn = document.getElementById('ad-ext-user-menu-extra').nextElementSibling;
            menuBtn.classList.add('adp_menu-btn');
            menuBtn.style.display = 'flex';
            menuBtn.innerText = 'Pimp my AD';

            const matchHistoryBtn = [...headerEl.querySelectorAll('a')].filter(el => el.href.includes('history/matches'))[0];
            [...headerEl.querySelectorAll('button, a')].forEach((el) => (el.addEventListener('click', async (event) => {
                if (matchHistoryBtnClicked) return;

                if (event.target.classList.contains('adp_menu-btn')) {
                    showConfigPage(true);
                    matchHistoryBtnClicked = true;
                    // switch to page "Match History" because we need its CSS
                    matchHistoryBtn.click();
                    window.history.pushState(null, '', configPathName);
                } else {
                    showConfigPage(false);
                }

            }, false)));
        }

        console.log('DOM ready');
    };

    const handleMatch = () => {
        setTimeout(async () => {
            console.log('match ready!');

            matchVariant = document.getElementById('ad-ext-game-variant').innerText.split(' ')[0];

            const isX01 = matchVariant === 'X01';
            const isCricket = matchVariant === 'Cricket';
            isValidMatchVariant = isX01 || isCricket;
            // isValidMatchVariant = isX01;

            if (!isValidMatchVariant) return;

            handleTakeoutMessage();

            matchMenuContainer = document.getElementById('ad-ext-game-settings-extra');
            if (matchMenuContainer) matchMenuContainer.style.display = hideHeaderGM ? 'none' : 'flex';

            playerContainerEl = document.getElementById('ad-ext-player-display');

            playerCount = playerContainerEl.children.length;

            playerContainerInfoElArr = [...playerContainerEl.children].map((el) => el.children[0]);
            playerContainerStatsElArr = [...playerContainerEl.children].map((el) => el.children[1]);

            turnContainerEl = document.getElementById('ad-ext-turn');

            // add match menu
            matchMenuRow = document.createElement('div');
            matchMenuRow.style.marginTop = 'calc(var(--chakra-space-2) * -1 - 4px)';
            matchMenuRow.style.display = 'flex';
            matchMenuRow.style.flexWrap = 'wrap';
            matchMenuRow.style.gap = '0.5rem';
            matchMenuRow.style.padding = '0px';
            matchMenuRow.classList.add('adp_match-menu-row');

            matchMenuContainer.replaceChildren(matchMenuRow);

            // PR font-size larger
            playerContainerStatsElArr.forEach((el) => (el.querySelectorAll('p')[1].style.fontSize = 'var(--chakra-fontSizes-xl)'));

            let cricketClosedPoints = [];

            const cricketContainer = document.getElementById('ad-ext-turn').nextElementSibling;

            const setCricketClosedPoints = () => {
                const cricketPointTable = cricketContainer.children[0].children[1];
                if (!cricketPointTable?.children) return;
                cricketClosedPoints = [];

                [...cricketPointTable.children].forEach((el, i) => {
                    if (i % playerCount === 0) {
                        const rowCount = (i / playerCount) + 1;
                        const rowPoints = (rowCount === 7 ? 25 : 21 - rowCount).toString(); // Bulls fix
                        if (el.children.length === 3) {
                            cricketClosedPoints.push(rowPoints);
                        }
                    }
                });
            };

            if (matchVariant === 'Cricket') {
                // cricketContainer.style.minHeight = '0';
                // playerContainerEl.style.height = '100%';
                // playerContainerEl.childNodes.forEach((el) => {
                //     el.style.height = '100%';
                // });
                // [...document.querySelectorAll('.ad-ext-player-score')].forEach((el) => {
                //     el.parentElement.style.height = '100%';
                //     el.parentElement.style.padding = '6px 0';
                //     el.style.lineHeight = '0';
                //     el.style.margin = 'auto';
                //     el.nextElementSibling.querySelector('div > span').style.fontSize = '1.5rem';
                // });
                //
                // if (isSmallDisplay) {
                //     cricketContainer.children[0].style.minHeight = '195px';
                //     [...document.querySelectorAll('.ad-ext-player-score')].forEach((el) => {
                //         el.style.fontSize = '70pt';
                //     });
                // }

                setCricketClosedPoints();

                const buttons = [...document.querySelectorAll('button')];
                buttons.forEach((button) => {
                    if (button.innerText === 'Undo') {
                        button.addEventListener('click', async (event) => {
                            setCricketClosedPoints();
                        }, false);
                    }
                });
            }

            // sounds
            let callerActive = (await GM.getValue('callerActive')) || '0';
            let triplesound = (await GM.getValue('triplesound')) || '0';
            let boosound = (await GM.getValue('boosound')) || false;
            let nextLegAfterSec = (await GM.getValue('nextLegAfterSec')) || 'OFF';

            const onSelectChange = (event) => {
                (async () => {
                    eval(event.target.id + ' = event.target.value');
                    await GM.setValue(event.target.id, event.target.value);
                })();
            };

            const tripleSoundArr = [
                {
                    value: '0',
                    name: 'Triple OFF'
                }, {
                    value: '1',
                    name: 'Beep'
                }, {
                    value: '2',
                    name: 'Löwen'
                }];

            const nextLegSecArr = [
                {
                    value: 'OFF'
                }, {
                    value: '0'
                }, {
                    value: '5'
                }, {
                    value: '10'
                }, {
                    value: '20'
                }];

            const callerSelect = document.createElement('select');
            callerSelect.id = 'callerActive';
            callerSelect.classList.add('css-1xbroe7');
            callerSelect.style.padding = '0 5px';
            callerSelect.onchange = onSelectChange;

            matchMenuRow.appendChild(callerSelect);

            for (const [caller, data] of Object.entries(callerData)) {
                if (!data.folder) continue;
                const optionEl = document.createElement('option');
                optionEl.value = caller;
                optionEl.text = data.name || data.folder;
                optionEl.style.backgroundColor = '#353d47';
                if (callerActive === caller) optionEl.setAttribute('selected', 'selected');
                callerSelect.appendChild(optionEl);
            }

            const tripleSoundSelect = document.createElement('select');
            tripleSoundSelect.id = 'triplesound';
            tripleSoundSelect.classList.add('css-1xbroe7');
            tripleSoundSelect.style.padding = '0 5px';
            tripleSoundSelect.onchange = onSelectChange;

            matchMenuRow.appendChild(tripleSoundSelect);

            tripleSoundArr.forEach((triple) => {
                const optionEl = document.createElement('option');
                optionEl.value = triple.value;
                optionEl.text = triple.name;
                optionEl.style.backgroundColor = '#353d47';
                if (triplesound === triple.value) optionEl.setAttribute('selected', 'selected');
                tripleSoundSelect.appendChild(optionEl);
            });

            const booBtn = document.createElement('button');
            booBtn.id = 'boosound';
            booBtn.innerText = 'BOO';
            booBtn.classList.add('adp_config-btn');
            setActiveAttr(booBtn, boosound);
            matchMenuRow.appendChild(booBtn);

            booBtn.addEventListener('click', async (event) => {
                const isActive = event.target.hasAttribute('data-active');
                setActiveAttr(booBtn, !isActive);
                boosound = !isActive;
                await GM.setValue('boosound', !isActive);
            }, false);

            const nextLegSecSelect = document.createElement('select');
            nextLegSecSelect.id = 'nextLegAfterSec';
            nextLegSecSelect.classList.add('css-1xbroe7');
            nextLegSecSelect.style.padding = '0 5px';
            nextLegSecSelect.onchange = onSelectChange;

            matchMenuRow.appendChild(nextLegSecSelect);

            nextLegSecArr.forEach((sec) => {
                const optionEl = document.createElement('option');
                optionEl.value = sec.value;
                optionEl.text = `Next Leg ${sec.value}${sec.value === 'OFF' ? '' : ' sec'}`;
                optionEl.style.backgroundColor = '#353d47';
                if (nextLegAfterSec === sec.value) optionEl.setAttribute('selected', 'selected');
                nextLegSecSelect.appendChild(optionEl);
            });

            // ######### start iOS fix #########
            // https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari

            if (isiOS) {
                const startBtnContainer = document.createElement('div');
                startBtnContainer.style.position = 'absolute';
                startBtnContainer.style.height = '100%';
                startBtnContainer.style.width = '100%';
                startBtnContainer.style.top = '0';
                startBtnContainer.style.left = '0';
                startBtnContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                startBtnContainer.style.display = 'flex';
                startBtnContainer.style.justifyContent = 'center';
                startBtnContainer.style.alignItems = 'center';

                document.querySelector('#root').appendChild(startBtnContainer);

                const startBtn = document.createElement('button');
                startBtn.id = 'startBtn';
                startBtn.innerText = 'START';
                startBtn.classList.add('css-1xbmrf2');
                startBtn.style.background = '#ffffff';
                startBtn.style.color = '#646464';
                startBtn.style.fontSize = '36px';
                startBtn.style.padding = '36px 24px';
                startBtnContainer.appendChild(startBtn);

                startBtn.addEventListener('click', async (event) => {
                    soundEffect1.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
                    startBtnContainer.remove();
                }, false);

                // ######### end iOS fix #########
            }

            // iOS fix
            // https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari
            const soundEffect1 = new Audio();
            soundEffect1.autoplay = true;
            const soundEffect2 = new Audio();
            soundEffect2.autoplay = true;
            const soundEffect3 = new Audio();
            soundEffect3.autoplay = true;

            function playSound1(fileName) {
                if (!fileName) return;
                // console.log('fileName1', fileName);
                soundEffect1.src = fileName;
            }

            function playSound2(fileName) {
                if (!fileName) return;
                // console.log('fileName2', fileName);
                soundEffect2.src = fileName;
            }

            function playSound3(fileName) {
                if (!fileName) return;
                // console.log('fileName3', fileName);
                soundEffect3.src = fileName;
            }

            const caller = async () => {
                const soundServerUrl = 'https://autodarts-plus.x10.mx';

                const callerFolder = callerData[callerActive]?.folder || '';
                const callerServerUrl = callerData[callerActive]?.server || '';
                const fileExt = callerData[callerActive]?.fileExt || '.mp3';

                // const turnPointsEl = turnContainerEl.children[0];
                const turnPoints = document.querySelector('.ad-ext-turn-points').innerText.trim();
                // TODO: Timo - class only for thrown darts
                const throwPointsArr = [...turnContainerEl.querySelectorAll('.ad-ext-turn-throw')].map((el) => el.innerText);

                const curThrowPointsName = throwPointsArr.slice(-1)[0];

                const playerEl = document.querySelector('.ad-ext-player-active .ad-ext-player-name');
                const playerName = playerEl && playerEl.innerText;

                const playPointsSound = () => {
                    if (callerFolder.startsWith('google')) {
                        playSound1('https://autodarts.de.cool/mp3_helper.php?language=' + callerFolder.substring(7, 9) + '&text=' + turnPoints);
                    } else {
                        if (callerFolder.length && callerServerUrl.length) playSound1(callerServerUrl + '/' + callerFolder + '/' + turnPoints + '.mp3');
                    }
                };

                let curThrowPointsNumber = -1;
                let curThrowPointsBed = '';
                let curThrowPointsMultiplier = 1;

                if (curThrowPointsName) {
                    if (curThrowPointsName.startsWith('M')) {
                        curThrowPointsNumber = 0;
                        curThrowPointsBed = 'Outside';
                    } else if (curThrowPointsName === 'Bull') {
                        curThrowPointsNumber = 25;
                        curThrowPointsBed = 'D';
                    } else if (curThrowPointsName === '25') {
                        curThrowPointsNumber = 25;
                        curThrowPointsBed = 'S';
                    } else {
                        curThrowPointsNumber = curThrowPointsName.slice(1);
                        curThrowPointsBed = curThrowPointsName.charAt(0);
                    }

                    if (curThrowPointsBed === 'D') curThrowPointsMultiplier = 2;
                    if (curThrowPointsBed === 'T') curThrowPointsMultiplier = 3;
                }

                const isBot = curThrowPointsName?.length && playerName && playerName.startsWith('BOT LEVEL');
                if (soundAfterBotThrow && isBot) {
                    if (curThrowPointsBed === 'Outside') {
                        playSound3(soundServerUrl + '/' + 'sound_wood-block.mp3');
                    } else {
                        playSound3(soundServerUrl + '/' + 'sound_chopping-wood.mp3');
                    }
                }

                setTimeout(async () => {
                    if (turnPoints === 'BUST') {
                        if (gameSound1.length) {
                            playSound2(gameSound1);
                        } else if (callerFolder.length && callerServerUrl.length) playSound2(callerServerUrl + '/' + callerFolder + '/' + '0' + fileExt);
                    } else {
                        if (curThrowPointsName === 'BULL') {
                            if (triplesound === '1') {
                                playSound2(soundServerUrl + '/' + 'beep_1.mp3');
                            }
                            if (triplesound === '2') {
                                playSound2(soundServerUrl + '/' + 'beep_2_bullseye.mp3');
                            }
                        } else if (curThrowPointsBed === 'Outside') {
                            if (boosound === true) {
                                const randomMissCount = Math.floor(Math.random() * 3) + 1;
                                playSound2(soundServerUrl + '/' + 'miss_' + randomMissCount + '.mp3');
                            }
                        } else {
                            if (matchVariant === 'X01' || (matchVariant === 'Cricket' && curThrowPointsNumber >= 15)) {
                                if (curThrowPointsMultiplier === 3) {
                                    if (triplesound === '1') {
                                        playSound2(soundServerUrl + '/' + 'beep_1.mp3');
                                    }
                                    if (triplesound === '2' && curThrowPointsNumber >= 17) {
                                        playSound2(soundServerUrl + '/' + 'beep_2_' + curThrowPointsNumber + '.wav');
                                    }
                                }
                            }
                        }
                        //////////////// Cricket ////////////////////
                        if (matchVariant === 'Cricket') {
                            if (curThrowPointsNumber >= 0) {
                                if (curThrowPointsNumber >= 15 && !cricketClosedPoints.includes(curThrowPointsNumber)) {
                                    setCricketClosedPoints();
                                    playSound2(soundServerUrl + '/' + 'bonus-points.mp3');
                                } else {
                                    playSound2(soundServerUrl + '/' + 'sound_double_windart.wav');
                                }
                            }
                        }
                        //////////////// play Sound ////////////////////
                        if (matchVariant === 'X01' || (matchVariant === 'Cricket' && turnPoints > 0)) {
                            if (throwPointsArr.length === 3 && callerFolder.length && !editPlayerThrowActive) {
                                playPointsSound();
                            }
                        }
                        //////////////// ATC ////////////////////

                        ////////////////  ////////////////////

                        if (winnerPlayerCard) {

                            cricketClosedPoints = [];
                            const waitForSumCalling = throwPointsArr.length === 3 ? 2500 : 0;

                            const winnerPlayerName = winnerPlayerCard.querySelector('.ad-ext-player-name').innerText;

                            setTimeout(() => {
                                const buttons = [...document.querySelectorAll('button.css-1x1xjw8, button.css-1vfwxw0')];
                                buttons.forEach((button) => {
                                    // --- Leg finished ---
                                    if (button.innerText === 'Next Leg') {
                                        if (callerFolder.length && callerServerUrl.length) playSound3(callerServerUrl + '/' + callerFolder + '/' + 'gameshot.mp3');
                                    }
                                    // --- Match finished ---
                                    if (button.innerText === 'Finish') {
                                        console.log('finish');
                                        if (callerFolder.length && callerServerUrl.length) playSound3(callerServerUrl + '/' + callerFolder + '/' + 'gameshot and the match.mp3');
                                        setTimeout(() => {
                                            const winnerSoundDataValues = Object.values(winnerSoundData);
                                            const winnerSoundurl = winnerSoundDataValues.find(
                                                winnersound => winnersound?.playername?.toLowerCase() === winnerPlayerName?.toLowerCase())?.soundurl;
                                            const winnerFallbackSoundurl = winnerSoundData[`winnerSound${winnerSoundDataValues.length}`]?.soundurl;
                                            console.log('winnerSoundurl', winnerSoundurl);
                                            console.log('winnerFallbackSoundurl', winnerFallbackSoundurl);
                                            playSound2(winnerSoundurl || winnerFallbackSoundurl);

                                        }, 1000);
                                    }
                                });
                            }, waitForSumCalling);
                        }
                    }
                }, isBot ? 500 : 0);
            };

            const onCounterChange = async () => {
                editPlayerThrowActive = document.querySelector('.ad-ext-turn-throw.css-6pn4tf');
                activePlayerCardPointsEl = document.querySelector('.ad-ext-player-active .ad-ext-player-score');
                inactivePlayerCardPointsElArr = [...document.querySelectorAll('.ad-ext-player-inactive .ad-ext-player-score')];
                winnerPlayerCard = document.querySelector('.ad-ext-player-winner');

                if (!editPlayerThrowActive) { // caller not in throw-edit-mode
                    setTimeout( () => { // delay to update score in DOM after edit
                        caller();
                    }, 500);
                }

                inactiveSmall = (await GM.getValue('inactiveSmall')) ?? true;

                if (inactiveSmall && inactivePlayerCardPointsElArr.length && activePlayerCardPointsEl) {
                    activePlayerCardPointsEl.classList.remove('adp_points-small');
                    [...inactivePlayerCardPointsElArr].forEach((el) => el.classList.add('adp_points-small'));
                }

                if (showTotalDartsAtLegFinish || nextLegAfterSec !== 'OFF') {

                    if (winnerPlayerCard) {
                        // --- Leg finished ---
                        console.log('Leg finished');

                        if (showTotalDartsAtLegFinish && matchVariant === 'X01') {

                            const winnerStats = winnerPlayerCard.nextElementSibling;
                            const winnerDartsText = winnerStats.innerText;

                            const winnerDarts = winnerDartsText.slice(winnerDartsText.indexOf('#') + 1, winnerDartsText.indexOf('|') - 1).trim();

                            const winnerDartsEl = document.createElement('div');
                            winnerDartsEl.style.fontSize = '0.5em';
                            // if (!showTotalDartsAtLegFinishLarge) winnerDartsEl.style.fontSize = '0.5em';
                            winnerDartsEl.innerHTML = winnerDarts + ' Darts';

                            winnerPlayerCard.querySelector('.ad-ext-player-score').replaceChildren(winnerDartsEl);
                        }

                        if (nextLegAfterSec !== 'OFF') {
                            const buttons = [...document.querySelectorAll('button.css-1vfwxw0')];
                            buttons.forEach((button) => {
                                if (button.innerText === 'Next Leg') {
                                    if (!parseInt(nextLegAfterSec)) return;
                                    setTimeout(() => {
                                        button.click();
                                    }, parseInt(nextLegAfterSec) * 1000);
                                }
                            });
                        }
                    }
                }

                // if (winnerPlayerCard && gsa) {
                //     const gameShotMessageEl = document.createElement('div');
                //     gameShotMessageEl.classList.add('game-shot-message');
                //     gameShotMessageEl.textContent = 'Game Shot!';
                //     gameShotMessageEl.style.fontSize = '0.5em';
                //     gameShotMessageEl.style.lineHeight = '1.2';
                //
                //     winnerPlayerCard.querySelector('.ad-ext-player-score').style.maxHeight = '122px';
                //     winnerPlayerCard.querySelector('.ad-ext-player-score').style.textAlign = 'center';
                //     winnerPlayerCard.querySelector('.ad-ext-player-score').appendChild(gameShotMessageEl);
                //
                //     winnerPlayerCard.querySelector('.ad-ext-player-score > div:first-child').style.fontSize = '0.3em';
                //     winnerPlayerCard.querySelector('.ad-ext-player-score > div:first-child').style.lineHeight = '1.2';
                //
                //     winnerPlayerCard.classList.add('game-shot-animation');
                //     document.querySelector('.adp_maincontainer').style.overflow = 'unset';
                //
                // }
            };

            onCounterChange();

            observeDOM(turnContainerEl, {}, async function(m) {
                onCounterChange();
            });

            const canTrig = CSS.supports('(top: calc(sin(1) * 1px))');

            const setRingSize = (boardViewNumbersEl, ringSpace, ringSize) => {
                let addVal = 0;
                switch (ringSize) {
                    case 3:
                        addVal = 0.05;
                        break;
                    case 4:
                        addVal = 0.08;
                        break;
                    case 5:
                        addVal = 0.12;
                        break;
                    case 7:
                        addVal = 0.05;
                        break;
                    case 8:
                        addVal = 0.08;
                        break;
                    case 9:
                        addVal = 0.12;
                        break;
                }

                const minSize = Math.min(boardViewNumbersEl.offsetWidth, boardViewNumbersEl.offsetHeight);
                const newSize = minSize * 3 / 1000 - (minSize / 3500) + addVal;
                ringHeadingEl.style.setProperty('--font-size', newSize);
                ``;
                document.documentElement.style.setProperty('--buffer',
                    canTrig ? `calc((${ringSpace} / sin(${360 / ringHeadingEl.children.length}deg)) * ${newSize}rem)` : `calc((${ringSpace} / ${Math.sin(
                        360 / ringHeadingEl.children.length / (180 / Math.PI))}) * ${newSize}rem)`);
            };

            const addRing = () => {
                setTimeout(async () => {
                    const showRingGM = await GM.getValue('showRing');
                    let ringsize = showRingGM;
                    switch (true) {
                        case showRingGM === true:
                            ringsize = 2;
                            break;
                        case showRingGM === false:
                            ringsize = 0;
                            break;
                        case showRingGM === undefined:
                            ringsize = 0;
                    }

                    const boardViewContainer = document.getElementById('ad-ext-turn').nextElementSibling;
                    boardViewContainer.classList.add('adp_boardview-container');
                    const boardViewNumbers = document.createElement('div');
                    boardViewNumbers.classList.add('adp_boardview-numbers');
                    boardViewContainer.children[0].appendChild(boardViewNumbers);
                    boardViewContainer.classList.toggle('adp_showring', ringsize > 0);
                    boardViewContainer.dataset.ringsize = ringsize;

                    const buttonStack = boardViewContainer.children[0].children[1].children[0];
                    const imageHolder = boardViewContainer.children[0].children[1].children[1];

                    imageHolder.classList.add('adp_boardview-image');

                    const ringBtn = document.createElement('button');
                    ringBtn.classList.add('css-qwakwq');
                    ringBtn.innerText = `Ring ${ringsize > 0 ? 'ON ' + ringsize : 'OFF'}`;
                    setActiveAttr(ringBtn, ringsize > 0);

                    const ringOptions = {
                        spacing: 1.4,
                        text: '20  1  18  4  13  6  10  15  2  17  3  19  7  16  8  11  14  9  12  5  '
                    };

                    const text = ringOptions.text;
                    const chars = text.split('');
                    ringHeadingEl.innerHTML = '';
                    ringHeadingEl.style.setProperty('--char-count', chars.length);

                    for (let c = 0; c < chars.length; c++) {
                        ringHeadingEl.innerHTML += `<span aria-hidden="true" class="char" style="--char-index: ${c};">${chars[c]}</span>`;
                    }
                    ringHeadingEl.style.setProperty('--character-width', ringOptions.spacing);
                    ringHeadingEl.style.setProperty('--radius', canTrig ? 'calc((var(--character-width) / sin(var(--inner-angle))) * -1ch' : `calc(
              (${ringOptions.spacing} / ${Math.sin(360 / ringHeadingEl.children.length / (180 / Math.PI))})
              * -1ch
            )`);

                    setRingSize(boardViewNumbers, ringOptions.spacing, ringsize);

                    boardViewNumbers.appendChild(ringHeadingEl);

                    ringBtn.addEventListener('click', async (event) => {
                        ringsize++;
                        ringsize = ringsize > 9 ? 0 : ringsize;
                        const isActive = ringsize > 0;
                        setActiveAttr(ringBtn, isActive);
                        await GM.setValue('showRing', ringsize);
                        ringBtn.innerText = `Ring ${ringsize > 0 ? 'ON ' + ringsize : 'OFF'}`;
                        boardViewContainer.classList.toggle('adp_showring', isActive);
                        boardViewContainer.dataset.ringsize = ringsize;

                        setRingSize(boardViewNumbers, ringOptions.spacing, ringsize);

                    }, false);

                    buttonStack.appendChild(ringBtn);

                }, 100);

            };

            if (document.getElementById('ad-ext-turn').nextElementSibling.children[0].children[1].childElementCount === 2) {
                addRing();
            }

            observeDOM(document.getElementById('ad-ext-turn').nextElementSibling, {attributes: false}, function(mutationrecords) {
                mutationrecords.some((record) => {
                    if (record.addedNodes.length > 0 && record.addedNodes[0] && record.addedNodes[0].childElementCount === 2 && record.addedNodes[0].children[1].childElementCount === 2) {
                        addRing();
                    }
                });
            });

        }, 0);

    };

    const handleTakeoutMessage = () => {
        if (!modalTakeout) return;
        const chakraPortal = document.querySelector('.chakra-portal');
        const takeoutModal = document.createElement('div');
        takeoutModal.classList.add('adp_hide');

        if (chakraPortal && !document.querySelector('.chakra-modal')) {
            takeoutModal.classList.add('chakra-modal');
            chakraPortal.appendChild(takeoutModal);
        }

        const showTakeoutMessage = (showMessage) => {
            takeoutModal.classList.toggle('adp_hide', !showMessage);

            takeoutModal.innerHTML = `
                    <section class="chakra-modal__content" >
                        <header class="chakra-modal__header">Takeout! Removing Darts</header>
                    </section>
                `;
        };

        const boardMenu = document.getElementById('ad-ext-game-settings-extra').previousElementSibling.children[0].lastChild.lastChild;

        const boardStatusContainer = boardMenu.querySelector('a');

        const config = {
            characterData: true,
            attributes: false,
            childList: false
        };

        observeDOM(boardStatusContainer, config, function(m) {
            m.forEach((record) => {
                // 🖐
                if (record.target.textContent !== '✊') {
                    showTakeoutMessage(false);
                } else {
                    showTakeoutMessage(true);
                }
            });
        });
    };

    const readyClasses = {
        // play: 'css-14trzk1', // lobbies: 'css-1q0rlnk',
        // table: 'css-p3eaf1', // matches & boards
        x01: 'css-ul22ge',
        cricket: 'css-1k7iu8k',
        matchHistory: 'css-5bhccf'
    };

    const readyClassesValues = Object.values(readyClasses);

    observeDOM(document.getElementById('root'), {}, function(mutationrecords) {
        mutationrecords.some((record) => {
            if (record.addedNodes.length && record.addedNodes[0].classList?.length) {
                // record.addedNodes.forEach((node) => {console.log('node', node);});
                const elemetClassList = [...record.addedNodes[0].classList];
                // console.log('elemetClassList',elemetClassList);
                return elemetClassList.some((className) => {
                    if (className.startsWith('css-')) {
                        // console.log('className', className);
                        if (!readyClassesValues.includes(className)) return false;
                        const key = Object.keys(readyClasses).find((key) => readyClasses[key] === className);
                        if (key) {
                            // console.log('key',key);
                            setTimeout(() => {
                                onDOMready();
                                handleMatch();
                                return true;
                            }, 0);
                        }
                    }
                });
            }
        });
    });
})();
