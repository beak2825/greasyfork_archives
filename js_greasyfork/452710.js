// ==UserScript==
// @name         AutoMudae
// @description  Automates the use of Mudae bot in Discord
// @version      0.8.5
// @author       Nxve
// @license      GNU GPLv3
// @namespace    https://github.com/Nxve/AutoMudae
// @supportURL   https://github.com/Nxve/AutoMudae/issues
// @match        https://discord.com/channels/*
// @exclude      https://discord.com/channels/@me
// @run-at       document-start
// @icon         https://icons.duckduckgo.com/ip2/discord.com.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/452710/AutoMudae.user.js
// @updateURL https://update.greasyfork.org/scripts/452710/AutoMudae.meta.js
// ==/UserScript==

(function () {
    const window = unsafeWindow;
    const localStorage = window.localStorage;

    //// Logger
    const _logger = {
        _preffix: '%c[AUTO MUDAE]',
        _symbols: { error: '[!]', info: '[i]', log: '[*]', plus: '[+]', debug: '[!]', warn: '[!]' },
        _color: { error: 'red', info: 'cyan', log: 'white', plus: 'lime', debug: 'cyan', warn: 'gold' },
        _history: [],
        _lastMessageHash: null,
        _hash: s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0),
        _print: function (type, ...etc) {
            const hash = [...arguments].toString();
            // if (hash === this._lastMessageHash) return;

            console.log(`${this._preffix}%c${this._symbols[type]}`, 'background: black; color: magenta;', `background: black; color: ${this._color[type]}`, ...etc);

            if (type !== 'debug') this._history.push([type, [...etc]]);
            this._lastMessageHash = hash;
        },
        _reprompt: function () {
            this._history.forEach(log => this[log[0]](...log[1]));
        }
    };

    const logger = {};

    ['error', 'info', 'log', 'plus', 'debug', 'warn'].forEach(method => {
        logger[method] = function () { this._print(method, ...arguments) };
    });

    /// I use prototype here to prevent exposing private properties in DevTools.
    Object.setPrototypeOf(logger, _logger);

    window.logger = logger;

    //// ENUM
    const E = {};

    E.DISCORD_INFO = {
        CHANNEL_ID: 'channel_id',
        GUILD_ID: 'guild_id',
        SESSION_ID: 'session_id'
    };
    
    E.AUTOMUDAE_STATE = {
        INJECT: 'inject',
        SETUP: 'setup',
        ERROR: 'error',
        IDLE: 'idle',
        RUN: 'run',
    };
    
    E.MUDAE_INFO = {
        ROLLS_MAX: 'rolls_max',
        ROLLS_LEFT: 'rolls_left',
        POWER: 'power',
        CAN_RT: 'can_rt',
        CAN_MARRY: 'can_marry',
        CONSUMPTION: 'kakera_consumption'
    };

    E.TOAST = {
        INFO: 'info',
        WARN: 'warn',
        CRITICAL: 'critical',
        KAKERA: 'kakera',
        CHARCLAIM: 'charclaim',
        SOULMATE: 'soulmate'
    };
    
    E.EMOJI = {
        '💓': '%F0%9F%92%93',
        '💕': '%F0%9F%92%95',
        '💖': '%F0%9F%92%96',
        '💗': '%F0%9F%92%97',
        '💘': '%F0%9F%92%98',
        '❤️': '%E2%9D%A4%EF%B8%8F',
        '❣️': '%E2%9D%A3%EF%B8%8F',
        '💞': '%F0%9F%92%9E',
        '♥️': '%E2%99%A5%EF%B8%8F'
    };

    E.EMOJI_KAKERA = {
        kakeraP: 'kakeraP%3A609264156347990016',
        kakera: 'kakera%3A469791929106956298',
        kakeraT: 'kakeraT%3A609264180851376132',
        kakeraG: 'kakeraG%3A609264166381027329',
        kakeraY: 'kakeraY%3A605112931168026629',
        kakeraO: 'kakeraO%3A605112954391887888',
        kakeraR: 'kakeraR%3A605112980295647242',
        kakeraW: 'kakeraW%3A608192076286263297',
        kakeraL: 'kakeraL%3A815961697918779422',
    };
    
    E.KAKERA = {
        PURPLE: 'kakeraP',
        BLUE: 'kakera',
        CYAN: 'kakeraT',
        GREEN: 'kakeraG',
        YELLOW: 'kakeraY',
        ORANGE: 'kakeraO',
        RED: 'kakeraR',
        RAINBOW: 'kakeraW',
        LIGHT: 'kakeraL',
    };

    E.GMVALUE = {
        PREFERENCES: 'preferences',
        VERSION: 'version',
        TOKENLIST: 'tokenlist'
    };

    E.PREFERENCES = {
        KAKERA: 'kakera',
        MENTIONS: 'mentions',
        ROLL: 'roll',
        SOUND: 'sound',
        EXTRA: 'extra'
    };

    E.INFO_FIELD = {
        KAKERA: 'kakera',
        COLLECTED_CHARACTERS: 'collected-characters',
        ROLLS_LEFT: 'rolls-left',
        ROLLS_MAX: 'rolls-max',
        POWER: 'power',
        POWER_CONSUMPTION: 'consumption',
        CAN_MARRY: 'marry',
        CAN_RT: 'rt'
    };

    E.SLASH_COMMANDS = {
        "wx": { version: "832172261968314389", id: "832172261968314388" },
        "wa": { version: "832172151729422418", id: "832172151729422417" },
        "wg": { version: "832172216665374751", id: "832172216665374750" },
        "hx": { version: "832172373536669707", id: "832172373536669706" },
        "ha": { version: "832172457028747337", id: "832172457028747336" },
        "hg": { version: "832172416192872459", id: "832172416192872458" },
    };

    //// SOUND
    const audioCtx = new AudioContext();

    function beep(gain, hz, ms, times = 1){
        for (let i = 0; i < times; i++) {
            const v = audioCtx.createOscillator();
            const u = audioCtx.createGain();
            v.connect(u);
            v.frequency.value = hz;
            v.type = "square";
            u.connect(audioCtx.destination);
            u.gain.value = gain * 0.01;
            const durationInSeconds = ms * .001;
            v.start(audioCtx.currentTime + i * (durationInSeconds*1.5));
            v.stop(audioCtx.currentTime + durationInSeconds + i * (durationInSeconds*1.5));
        }
    };

    const SOUND = {
        foundCharacter: () => {beep(5, 400, 100, 1)},
        marry: () => {beep(10, 600, 100, 1)},
        critical: () => {beep(15, 70, 80, 6)},
        lastResetNoRolls: () => {beep(10, 60, 250, 2)},
        newSoulmate: () => {beep(10, 600, 100, 2)}
    };

    //// CSS
    const CSS = {};

    CSS.decorators = `
    li[id^=chat-message]:is(.plus, .critical){
        position: relative;
    }

    li[id^=chat-message]:is(.plus, .critical)::after{
        position: absolute;
        bottom: 0;
        width: 22px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    li[id^=chat-message].plus{
        background-color: hsl(138deg 100% 50% / 10%);
    }

    li[id^=chat-message].plus::after {
        content: '+';
        background-color: hsl(109deg 45% 18%);
        color: lime;
    }

    li[id^=chat-message].critical{
        background-color: hsl(0deg 100% 50% / 10%);
    }

    li[id^=chat-message].critical::after {
        content: '!';
        background-color: hsl(0deg 45% 18%);
        color: red;
    }
    `;

    CSS.general = `
    ::-webkit-scrollbar {
        width: 2px;
    }
    
    ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.8);
    }

    .automudae-hide, .automudae-hide *, .automudae-hide::before, .automudae-hide::after {
        display: none !important;
    }
    `;

    CSS.stateText = `
    #automudae-state {
        display: flex;
        gap: 10px;
        margin-right: 10px;
        color: var(--text-normal);
    }
    `;

    CSS.runButton = `
    #automudae-run-button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 1px 5px;
        margin-right: 20px;
        background-color: var(--button-outline-brand-background-active);
        cursor: pointer;
        transition: 200ms;
    }
    
    #automudae-run-button:hover {
        background-color: var(--button-outline-brand-background-hover);
        transform: scale(1.1);
    }
    
    #automudae-run-button::before {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='15' fill='%23DCDDDE' viewBox='0 0 16 12'%3E%3Cpath d='m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z'/%3E%3C/svg%3E");
    }
    
    #automudae-run-button.running::before {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23DCDDDE' viewBox='0 0 16 12'%3E%3Cpath d='M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z'/%3E%3C/svg%3E");
    }
    
    #automudae-run-button::after {
        content: "Run";
    }
    
    #automudae-run-button.running::after {
        content: "Pause";
    }
    `;

    CSS.injectionsAndError = `
    #automudae-injections-wrapper,
    #automudae-error {
        position: absolute;
        inset: auto 0;
        top: 8px;
        width: fit-content;
        margin-inline: auto;
        padding: 5px;
        z-index: 9999;
    }

    #automudae-injections-wrapper {
        display: flex;
        gap: 10px;
        padding: 0;
    }

    #automudae-injections-wrapper > div {
        padding: 5px;
        background-color: var(--button-outline-brand-background-active);
        color: var(--text-normal);
        font-weight: 500;
        cursor: pointer;
        transition: 200ms;
    }

    #automudae-injections-wrapper > div:hover {
        background-color: var(--button-outline-brand-background-hover);
        transform: scale(1.1);
    }

    #automudae-error {
        background-color: var(--button-danger-background);
        color: white;
        animation: popIn 150ms forwards;
        transform: scale(0);
    }

    @keyframes popIn {
        to {
            top: 40px;
            transform: scale(1);
        }
    }
    `;

    CSS.sidePanels = `
    [id^=automudae-panel] {
        background-color: var(--background-primary);
        font-weight: 500;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: 500ms;
        overflow: hidden;
        height: fit-content;
    }

    [id^=automudae-panel] > * {
        background-color: var(--interactive-muted);
    }

    [id^=automudae-panel] :is(h1, h2) {
        background-color: var(--background-tertiary);
        color: var(--text-normal);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    [id^=automudae-panel] h1 {
        font-size: large;
        height: 1.5rem;
        background-color: var(--button-outline-brand-background-active);
        cursor: pointer;
    }

    [id^=automudae-panel] h1:hover {
        background-color: var(--button-outline-brand-background-hover) !important;
    }

    [id^=automudae-panel] h2 {
        font-size: medium;
        height: 1rem;
    }

    [id^=automudae-panel] textarea {
        font-weight: 900;
        max-height: 100px;
    }

    [id^=automudae-panel] span {
        font-size: small;
        color: var(--text-normal);
    }

    [id^=automudae-panel] ul {
        width: 100%;
        font-size: small;
        color: var(--text-normal);
        max-height: 10rem;
        overflow-x: clip;
        overflow-y: auto;
    }

    [id^=automudae-panel] li:nth-child(odd) {
        background-color: var(--background-primary);
    }

    .automudae-section {
        margin-bottom: 5px;
    }

    .automudae-section-body {
        display: flex;
        padding: 4px;
        flex-wrap: wrap;
    }

    .automudae-section-body > div {
        display: flex;
        padding-inline: 3px;
        border-radius: 5px;
        align-items: center;
    }

    .automudae-section-body > div:hover {
        background-color: var(--button-secondary-background-hover);
    }

    #automudae-panel-info .automudae-section-body {
        flex-direction: column;
        gap: 8px;
    }

    #automudae-section-kakera > div {
        justify-content: space-between;
    }

    #automudae-section-kakera > div > div {
        flex-direction: column;
        padding: 0;
    }

    #automudae-section-status .automudae-section-body {
        padding: 0;
    }

    .automudae-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .automudae-row > div {
        display: flex;
        align-items: center;
    }
    
    .automudae-row-expandable {
        padding: 3px;
        display: block !important;
    }

    .automudae-row-expandable > div:not(:first-child) {
        margin-top: 2px;
        background-color: var(--background-primary);
        max-height: 0px;
        overflow: hidden;
        transition: max-height 300ms linear;
    }
    
    .automudae-row-expandable:hover > div:not(:first-child) {
        max-height: 300px;
    }
    
    .automudae-row-expandable > div:not(:first-child) > .automudae-row:hover {
        background-color: var(--background-accent);
    }

    [id^=automudae-panel] > div {
        max-height: 600px;
        transition: max-height 400ms cubic-bezier(0, 1, 1, 1);
    }

    [id^=automudae-panel].collapsed {
        gap: 0px;
    }
    
    [id^=automudae-panel].collapsed > div {
        max-height: 0px;
    }

    [data-requirerestart] {
        position: relative;
    }
    
    [data-requirerestart]::before {
        content: '*';
        color: yellow;
        position: absolute;
        left: 0px;
    }
    
    [data-requirerestart]:hover::before {
        content: '* Require restart to apply changes!';
        position: absolute;
        bottom: 20px;
        background-color: var(--background-tertiary);
        font-size: x-small;
        padding: 2px 10px;
        color: yellow;
        border-radius: 5px;
        pointer-events: none;
    }
    `;

    CSS.toasts = `
    #automudae-toasts-wrapper {
        position: absolute;
        right: 15px;
        width: 37%;
        height: 97%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        gap: 8px;
        z-index: 9;
    }
    
    .automudae-toast {
        background-color: white;
        padding: 5px;
        font-weight: 500;
        animation: slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
    }
    
    .automudae-toast.info {
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' fill='%235865f2' viewBox='0 0 16 16'%3E%3Cpath d='M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/%3E%3C/svg%3E");
        background-color: var(--button-outline-brand-border);
    }
    
    .automudae-toast.kakera {
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' fill='%23dee0fc' viewBox='0 0 16 16'%3E%3Cpath d='M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6l3-4zm11.386 3.785-1.806-2.41-.776 2.413 2.582-.003zm-3.633.004.961-2.989H4.186l.963 2.995 5.704-.006zM5.47 5.495 8 13.366l2.532-7.876-5.062.005zm-1.371-.999-.78-2.422-1.818 2.425 2.598-.003zM1.499 5.5l5.113 6.817-2.192-6.82L1.5 5.5zm7.889 6.817 5.123-6.83-2.928.002-2.195 6.828z'/%3E%3C/svg%3E");
        background-color: var(--brand-experiment-200);
    }
    
    .automudae-toast.charclaim {
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' fill='%2346c46e' viewBox='0 0 16 16'%3E%3Cpath d='M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z'/%3E%3C/svg%3E");
        background-color: var(--text-positive);
    }
    
    .automudae-toast.soulmate {
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' fill='violet' viewBox='0 0 16 16'%3E%3Cpath d='M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z'/%3E%3C/svg%3E");
        background-color: violet;
    }
    
    .automudae-toast.warn{
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' fill='%23faa81a' class='bi bi-exclamation-diamond-fill' viewBox='0 0 16 16'%3E%3Cpath d='M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/%3E%3C/svg%3E");
        background-color: var(--text-warning);
    }
    
    .automudae-toast.critical{
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='20' fill='%23ed4245' class='bi bi-exclamation-diamond-fill' viewBox='0 0 16 16'%3E%3Cpath d='M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/%3E%3C/svg%3E");
        background-color: var(--status-danger);
    }

    .automudae-toast.link {
        cursor: alias;
    }
    
    .automudae-toast.missing {
        animation: wobble-hor-bottom 0.8s both;
    }

    .automudae-toast:hover::before {
        --width: 18px;
        --height: 100;
        content: var(--svg);
        position: absolute;
        left: calc(calc(-1 * var(--width)) - 5px);
        top: calc(.5% * calc(100 - var(--height)));
        height: calc(1% * var(--height));
        width: var(--width);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: flipHorz 1s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
        pointer-events: none;
    }
    
    .automudae-toast:nth-last-child(12) {
        opacity: 0.6;
    }
    .automudae-toast:nth-last-child(13) {
        opacity: 0.5;
    }
    .automudae-toast:nth-last-child(14) {
        opacity: 0.4;
    }
    .automudae-toast:nth-last-child(15) {
        opacity: 0.3;
    }
    .automudae-toast:nth-last-child(16) {
        opacity: 0.2;
    }
    .automudae-toast:nth-last-child(17) {
        opacity: 0.1;
    }
    .automudae-toast:nth-last-child(n+18) {
        opacity: 0;
    }

    @keyframes flipHorz {
        0% {
            transform: rotateY(0);
        }
        100% {
            transform: rotateY(-360deg);
        }
    }

    @keyframes slide-in-blurred-left {
        0% {
            transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
            transform-origin: 100% 50%;
            filter: blur(40px);
        }
        100% {
          transform: translateX(0) scaleY(1) scaleX(1);
          transform-origin: 50% 50%;
          filter: blur(0);
        }
    }

    @keyframes wobble-hor-bottom {
        0%,
        100% {
            transform: translateX(0%);
            transform-origin: 50% 50%;
        }
        15% {
            transform: translateX(-30px) rotate(-6deg);
        }
        30% {
            transform: translateX(15px) rotate(6deg);
        }
        45% {
            transform: translateX(-15px) rotate(-3.6deg);
        }
        60% {
            transform: translateX(9px) rotate(2.4deg);
        }
        75% {
            transform: translateX(-6px) rotate(-1.2deg);
        }
      }
    `;

    CSS.tokenList = `
    #automudae-tokenlist-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #automudae-tokenlist {
        background-color: var(--background-tertiary);
        width: 400px;
        height: 80vh;
        display: flex;
        flex-direction: column;
        font-weight: 400;
        color: white;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
    }

    #automudae-tokenlist-accept {
        width: 100%;
        text-align: center;
        padding-block: 5px;
        background-color: var(--status-positive-background);
        transition: 200ms;
        cursor: pointer;
    }

    #automudae-tokenlist h3 {
        font-size: x-large;
        position: relative;
    }

    #automudae-tokenlist h3::after {
        content: '';
        position: absolute;
        left: 0px;
        bottom: -4px;
        height: 2px;
        width: 100%;
        background-color: var(--background-modifier-accent);
    }

    #automudae-tokenlist ul {
        width: 400px;
        height: 60vh;
        background-color: var(--background-floating);
        display: flex;
        flex-direction: column;
        gap: 5px;
        overflow-y: overlay;
    }

    #automudae-tokenlist-accept:hover {
        background-color: var(--status-positive);
    }

    #automudae-tokenlist-controls {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 1rem;
        padding-right: 10px;
    }

    #automudae-tokenlist-controls > div {
        padding: 3px;
        font-size: small;
        cursor: pointer;
        transition: 200ms;
    }

    #automudae-tokenlist-controls > div:hover {
        background-color: white;
        color: black;
    }

    #automudae-tokenlist input {
        width: 99%;
        border: none;
        background: none;
        color: var(--text-normal);
    }

    #automudae-tokenlist li:nth-child(odd) {
        background-color: var(--background-accent);
    }

    #automudae-tokenlist li:nth-child(even) {
        background-color: var(--background-modifier-selected);
    }

    #automudae-tokenlist li {
        position: relative;
    }
    
    #automudae-tokenlist li:hover:not(:focus-within) input {
        opacity: .1;
    }
    
    #automudae-tokenlist li:hover:not(:focus-within)::before {
        content: attr(data-username);
        position: absolute;
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 5px;
    }
    `;

    GM_addStyle(Object.values(CSS).join(' '));

    //// Utils
    const pickRandom = (arr) => arr[arr.length * Math.random() | 0];
    const getLast = (arr) => arr[arr.length - 1];

    //// DOM Elements
    const DOM = {
        el_ChannelList: null,
        el_MemberList: null,
        el_Chat: null,
        el_ChatWrapper: null,
        el_InjectionsWrapper: null,
        el_RunButton: null,
        el_StateSpan: null,
        el_ToastsWrapper: null,
        el_ErrorPopup: null
    };

    //// CONSTS
    const INTERVAL_SEND_MESSAGE = 1500;
    const INTERVAL_ROLL = 2000;
    const INTERVAL_THINK = 200;
    const MUDAE_USER_ID = '432610292342587392';

    //// Discord Data & Utils
    const Discord = {
        info: new Map(), /// Map<E.DISCORD_INFO, >()
        lastMessageTime: 0,
        cdSendMessage: 0,
        nonce: Math.floor(Math.random() * 1000000),

        Message: {
            getDate: (el_Message) => {
                const messageDate = new Date(this.el_Message.querySelector("time[id^='message-timestamp']")?.dateTime);

                if (messageDate.toString() === "Invalid Date") {
                    logger.error("Couldn't retrieve timestamp for this Discord message:", el_Message);
                    return;
                }

                return messageDate;
            },

            getAuthorId: (el_Message) => {
                let el_TargetMessage = el_Message;
                let el_Avatar;

                while (!el_Avatar) {
                    el_Avatar = el_TargetMessage.querySelector(`img[class^='avatar']`);
                    if (el_Avatar) break;

                    el_TargetMessage = el_TargetMessage.previousElementSibling;

                    while (el_TargetMessage && el_TargetMessage.tagName !== "LI") {
                        el_TargetMessage = el_TargetMessage.previousElementSibling;
                    }

                    if (!el_Avatar && !el_TargetMessage) return logger.error("Couldn't get avatar for this Discord message:", el_Message);
                }

                const match = /avatars\/(\d+)\//.exec(el_Avatar.src);

                if (match) return match[1];
            },

            getId: (el_Message) => getLast(el_Message.id.split("-")),

            isFromMudae: function (el_Message) {
                return this.getAuthorId(el_Message) === MUDAE_USER_ID
            },

            isFromMe: function (el_Message) {
                return AutoMudae.users.find(user => user.id === this.getAuthorId(el_Message), this);
            }
        }

    };

    /// AutoMudae
    class MudaeUser {
        id
        username
        avatar
        token
        nick
        info
        sendTUTimer

        constructor(token, id, username, avatar) {
            this.token = token;
            this.info = new Map();

            return new Promise(async (resolve) => {
                if (id){
                    this.id = id;
                    this.username = username;
                    this.avatar = avatar;
    
                    await this.fetchNick();
                    return resolve(this);
                }

                fetch("https://discord.com/api/v9/users/@me", { "headers": { "authorization": token } })
                .then(response => response.json())
                .then(async (data) => {
                    this.id = data.id;
                    this.username = data.username;
                    this.avatar = data.avatar;

                    await this.fetchNick();
                })
                .catch(err => logger.error(`Couldn't retrieve info for some user.`, err))
                .finally(() => resolve(this));
            });
        }

        async fetchNick(){
            return new Promise(resolve => {
                const guildId = window.location.pathname.split("/")[2];

                fetch(`https://discord.com/api/v9/users/${this.id}/profile?guild_id=${guildId}`, {
                    "headers": {
                        "authorization": this.token
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const { guild_member: { nick } } = data;
                    this.nick = nick;
                })
                .catch(err => logger.error(`Couldn't retrieve the nick for user [${this.username}]`, err))
                .finally(() => resolve());
            });
        }

        hasNeededInfo() {
            return [E.MUDAE_INFO.ROLLS_MAX, E.MUDAE_INFO.ROLLS_LEFT, E.MUDAE_INFO.POWER, E.MUDAE_INFO.CAN_RT, E.MUDAE_INFO.CAN_MARRY, E.MUDAE_INFO.CONSUMPTION].every(info => this.info.has(info), this);
        }

        send(content) {
            const now = performance.now();

            if (now - Discord.cdSendMessage < INTERVAL_SEND_MESSAGE) return;

            fetch(`https://discord.com/api/v9/channels/${Discord.info.get(E.DISCORD_INFO.CHANNEL_ID)}/messages`, {
                "method": "POST",
                "headers": {
                    "authorization": this.token,
                    "content-type": "application/json"
                },
                "body": `{"content":"${content || '?'}","nonce":"${++Discord.nonce}","tts":false}`
            });

            Discord.cdSendMessage = now;
        }

        react(el_Message, E_EMOJI = E.EMOJI["💓"]) {
            fetch(`https://discord.com/api/v9/channels/${Discord.info.get(E.DISCORD_INFO.CHANNEL_ID)}/messages/${Discord.Message.getId(el_Message)}/reactions/${E_EMOJI}/%40me`, {
                "method": "PUT",
                "headers": {
                    "authorization": this.token,
                }
            });
        }

        setTUTimer(ms) {
            if (this.sendTUTimer) clearTimeout(this.sendTUTimer);

            this.sendTUTimer = setTimeout((user) => { user.send("$tu") }, ms, this);
        }

        roll() {
            const rollPreferences = AutoMudae.preferences.get(E.PREFERENCES.ROLL);

            const command = E.SLASH_COMMANDS[rollPreferences.type];

            fetch("https://discord.com/api/v9/interactions", {
                "method": "POST",
                "headers": {
                    "authorization": this.token,
                    "content-type": "multipart/form-data; boundary=----BDR",
                },
                "body": `------BDR\r\nContent-Disposition: form-data; name="payload_json"\r\n\r\n{"type":2,"application_id":"${MUDAE_USER_ID}","guild_id":"${Discord.info.get(E.DISCORD_INFO.GUILD_ID)}","channel_id":"${Discord.info.get(E.DISCORD_INFO.CHANNEL_ID)}","session_id":"${Discord.info.get(E.DISCORD_INFO.SESSION_ID)}","data":{"version":"${command.version}","id":"${command.id}","name":"${rollPreferences.type}","type":1},"nonce":"${++Discord.nonce}"}\r\n------BDR--\r\n`
            });
        }
    }

    const AutoMudae = {
        users: [], /// MudaeUser[]
        preferences: null, /// Map<string, any>
        state: E.AUTOMUDAE_STATE.INJECT,
        chatObserver: new MutationObserver(ms => ms.forEach(m => { if (m.addedNodes.length) { handleNewChatAppend(m.addedNodes) } })),
        cdGatherInfo: 0,
        cdRoll: 0,
        lastResetHash: '',

        timers: {
            _t: new Map(),
            set(identifier, callback, ms, isInterval = false) {
                if (this._t.has(identifier)) clearTimeout(identifier);
                const timer = isInterval ? setInterval(callback, ms) : setTimeout(callback, ms);
                this._t.set(identifier, timer);
            },
            clear() { [...this._t.values()].forEach(t => { clearTimeout(t); clearInterval(t) }); this._t.clear(); }
        },

        toasts: {
            add(E_TOAST, formattableText, el_SubjectMessage = null) {
                if (!DOM.el_ToastsWrapper) return;

                const text = formattableText.replace(/\[(.+?)\]/g, "<strong>$1</strong>");

                const el_Toast = document.createElement("div");
                el_Toast.classList.add("automudae-toast", E_TOAST);
                el_Toast.innerHTML = `<span>${text}</span>`;

                if (el_SubjectMessage){
                    el_Toast.classList.add("link");

                    el_Toast.onclick = function(){
                        if (this.classList.contains("missing")){
                            this.classList.remove("missing");
                            void this.offsetWidth;
                            this.classList.add("missing");  
                            return;
                        }

                        if (!el_SubjectMessage) return this.classList.add("missing");

                        const loadedMessages = [...el_SubjectMessage.parentElement.children];
                        const messageIndex = loadedMessages.indexOf(el_SubjectMessage);
                        const distanceFromBottom = loadedMessages.length - messageIndex;
                        const quantityMargin = 19;

                        if (messageIndex >= quantityMargin && distanceFromBottom <= quantityMargin){
                            el_SubjectMessage.scrollIntoView();
                            return;
                        }

                        this.classList.add("missing");
                    };
                }

                DOM.el_ToastsWrapper.appendChild(el_Toast);
            },
            clear() {
                if (DOM.el_ToastsWrapper) DOM.el_ToastsWrapper.innerHTML = "";
            }
        },

        /// Info
        hasNeededInfo() {
            return this.users.every(user => user.hasNeededInfo());
        },

        isLastReset() {
            const now = new Date(), h = now.getHours(), m = now.getMinutes();
            return (h % 3 == 2 && m >= 36) || (h % 3 == 0 && m < 36)
        },

        /// Utils
        mudaeTimeToMs(timeString) {
            if (!timeString.includes("h")) return Number(timeString) * 60 * 1000;

            const match = /(\d+h)?\s?(\d+)?/.exec(timeString);

            if (!match) return;

            const h = match[1];
            const m = match[2];
            let totalMs = 0;

            if (h) totalMs += Number(h.replace(/\D/g, '')) * 60 * 60 * 1000;
            if (m) totalMs += Number(m) * 60 * 1000;

            return totalMs;
        },

        getMarriageableUser(preferableNicknames) {
            if (!preferableNicknames || preferableNicknames.length === 0){
                return this.users.find(user => user.info.get(E.MUDAE_INFO.CAN_MARRY));
            }

            let marriageableUser;

            for (let i = 0; i < this.users.length; i++) {
                const user = this.users[i];
                
                if (user.info.get(E.MUDAE_INFO.CAN_MARRY)){
                    marriageableUser = user;

                    if (preferableNicknames.includes(user.nick)) break;                    
                }
            }

            return marriageableUser;
        },

        clearError(){
            if (DOM.el_ErrorPopup) DOM.el_ErrorPopup = DOM.el_ErrorPopup.remove();
        },

        error(msg) {
            this.clearError();
            if (!msg) return;

            const el_ErrorPopup = document.createElement("div");
            el_ErrorPopup.id = "automudae-error";
            el_ErrorPopup.innerHTML = `<span>${msg}</span>`;
            document.body.appendChild(el_ErrorPopup);

            DOM.el_ErrorPopup = el_ErrorPopup;
        },

        /// Workflow
        renderTokenList(){
            const isTokenValid = token => token && token.length >= 70 && token.length < 80 && /\w+\.\w+\.[-\w]+$/.test(token);

            function handleTokenInput(){
                if (!isTokenValid(this.value)) this.parentElement.remove();                
            }

            const el_TokenListWrapper = document.createElement("div");
            el_TokenListWrapper.id = "automudae-tokenlist-wrapper";
            el_TokenListWrapper.innerHTML = `<div id="automudae-tokenlist"><h3>Token List</h3><div><ul></ul><div id="automudae-tokenlist-controls"><div id="automudae-tokenlist-add">Add</div><div id="automudae-tokenlist-clear">Clear</div></div></div><div id="automudae-tokenlist-accept">Accept</div></div>`;
            
            document.body.appendChild(el_TokenListWrapper);

            const el_TokenList = document.querySelector("#automudae-tokenlist ul");

            const addInputField = (defaultValue) => {
                if (el_TokenList.childElementCount < 20){
                    const el_TokenInput = document.createElement("input");

                    el_TokenInput.onblur = handleTokenInput;

                    if (defaultValue) el_TokenInput.value = defaultValue;

                    el_TokenList.appendChild(document.createElement("li").appendChild(el_TokenInput).parentElement);
                }
            };

            document.getElementById("automudae-tokenlist-clear").onclick = () => el_TokenList.innerHTML = "";

            document.getElementById("automudae-tokenlist-add").onclick = () => addInputField();

            document.getElementById("automudae-tokenlist-accept").onclick = () => {
                const tokenSet = new Set();

                document.querySelectorAll("#automudae-tokenlist input").forEach(el_Input => {
                    const token = el_Input.value;
                    if (isTokenValid(token)) tokenSet.add(token);
                });

                if (tokenSet.size === 0){
                    AutoMudae.error("Please provide a valid token.");
                    return;
                }

                const tokenList = [...tokenSet];

                GM_setValue(E.GMVALUE.TOKENLIST, tokenList.join(";"));

                el_TokenListWrapper.remove();
                AutoMudae.inject(tokenList);
            };

            GM_getValue(E.GMVALUE.TOKENLIST)?.split(";").forEach(token => addInputField(token));
        },

        toggleInjectionButtons(){
            if (DOM.el_InjectionsWrapper){
                DOM.el_InjectionsWrapper.classList.toggle("automudae-hide");
                return;
            }

            const el_LoggedUsersButton = document.createElement("div");
            el_LoggedUsersButton.id = "automudae-use-logged-button";
            el_LoggedUsersButton.innerHTML = "<span>Use Logged Users</span>";

            const el_TokenListButton = document.createElement("div");
            el_TokenListButton.id = "automudae-use-tokenlist-button";
            el_TokenListButton.innerHTML = "<span>Use Token List</span>";

            el_LoggedUsersButton.onclick = (_e) => AutoMudae.inject(false);
            el_TokenListButton.onclick = (_e) => AutoMudae.renderTokenList();

            const el_InjectionsWrapper = document.createElement("div");
            el_InjectionsWrapper.id = "automudae-injections-wrapper";

            el_InjectionsWrapper.appendChild(el_LoggedUsersButton);
            el_InjectionsWrapper.appendChild(el_TokenListButton);

            DOM.el_InjectionsWrapper = el_InjectionsWrapper;

            document.body.appendChild(el_InjectionsWrapper);
        },

        preRender() {
            const el_DiscordToolBar = document.querySelector("[class^='toolbar']");
            el_DiscordToolBar.innerHTML = "";

            /// Run Button
            const el_RunButton = document.createElement("div");
            el_RunButton.id = "automudae-run-button";
            el_RunButton.classList.add("automudae-hide");

            el_DiscordToolBar.appendChild(el_RunButton);

            DOM.el_RunButton = el_RunButton;

            /// State Text
            const el_StateWrapper = document.createElement("div");
            el_StateWrapper.id = "automudae-state";
            el_StateWrapper.innerHTML = "<b>AutoMudae:</b>";

            const el_StateSpan = document.createElement("span");
            el_StateSpan.appendChild(document.createTextNode("Idle"));

            el_StateWrapper.appendChild(el_StateSpan);
            el_DiscordToolBar.appendChild(el_StateWrapper);

            DOM.el_StateSpan = el_StateSpan;

            /// Injection Buttons
            this.toggleInjectionButtons();
        },

        inject(tokenList) {
            this.toggleInjectionButtons();

            logger.info("Injecting...");

            this.setState(E.AUTOMUDAE_STATE.SETUP);

            AutoMudae.setup(tokenList)
            .then(() => {
                this.clearError();
    
                const requirements = "Required:\n- All your accounts should have custom avatars\n- Arrange your $TU to expose all needed information: $ta claim rolls daily keys kakerareact kakerapower kakerainfo kakerastock rt dk rollsreset\n- Set your claim feedback to default: $rc none\n- Set your rolls left message to default: $rollsleft 0\nCan only roll with slash commands.\nDon't search for messages in Discord.\n- Don't scroll up the channel.";
                const recommendations = "Recommended:\n- Use slash rolls.\n- Don't use non-slash rolls while the channel is in peak usage by other members.\n- Set your user order priorizing roll and kakera claiming.";
    
                const exposeLogger = this.preferences.get(E.PREFERENCES.EXTRA).logger;
    
                if (exposeLogger) {
                    const doNothing = () => { };
    
                    for (const method in logger) {
                        if (!Object.hasOwn(logger, method)) continue;
    
                        window.console[method] = doNothing;
                    }
    
                    console.clear();
                    window.logger = logger;
                    logger.debug("Turned off native console. Use logger instead. I recommend disabling network log, since Discord usualy prompt a lot of these.");
                    logger.debug(requirements);
                    logger.debug(recommendations);
                    logger._reprompt();
                }
    
                this.render();
                this.tryEnable();
    
                if (!exposeLogger) {
                    logger.info(requirements);
                    logger.info(recommendations);
                }
            })
            .catch(err => {
                logger.error(err);
                this.error(err);
                this.setState(E.AUTOMUDAE_STATE.INJECT);
                this.toggleInjectionButtons();
            });
        },

        async setup(tokenList){
            return new Promise(async (resolve, reject) =>  {
                const windowPathname = window.location?.pathname;
    
                if (!windowPathname) {
                    reject("Couldn't retrieve current window URL.");
                }
    
                const [_, pathDiscriminator, guildId, channelId] = windowPathname.split("/");
    
                if (pathDiscriminator !== "channels") {
                    reject("You must be viewing the desired channel.");
                }
    
                if (!guildId || !channelId) {
                    reject("Couldn't retrieve active guild or channel.");
                }
    
                DOM.el_ChannelList = document.querySelector("#channels > ul");
                DOM.el_MemberList = document.querySelector("div[class^='members'] > div");
                DOM.el_Chat = document.querySelector("ol[class^='scrollerInner']");
                DOM.el_ChatWrapper = document.querySelector("main[class^='chatContent']");
    
                if (!DOM.el_Chat || !DOM.el_MemberList || !DOM.el_ChannelList || !DOM.el_ChatWrapper) {
                    reject("Make sure you're viewing the desired channel and the page is fully loaded.");
                }
    
                if (!localStorage || !localStorage.MultiAccountStore || !localStorage.tokens) {
                    reject("Couldn't retrieve information from Discord.");
                }
    
                const users = [];
    
                if (tokenList){    
                    for (let i = 0; i < tokenList.length; i++) {
                        users.push(await new MudaeUser(tokenList[i]));
                    }
                } else {
                    const storeUsers = JSON.parse(localStorage.MultiAccountStore)?._state.users;
                    const tokens = JSON.parse(localStorage.tokens);
        
                    if (!storeUsers || !tokens) {
                        return "Couldn't retrieve information about your accounts.";
                    }
    
                    for (let i = 0; i < storeUsers.length; i++) {
                        const { id, username, avatar } = storeUsers[i];
        
                        const token = tokens[id];
        
                        if (!token) {
                            return `Couldn't retrieve information about user [${username}]`;
                        }
        
                        users.push(await new MudaeUser(token, id, username, avatar));
                    }
                }
    
                this.users = users;
                Discord.info.set(E.DISCORD_INFO.CHANNEL_ID, channelId);
                Discord.info.set(E.DISCORD_INFO.GUILD_ID, guildId);
    
                const defaultPreferences = `[
                    ["${E.PREFERENCES.KAKERA}", {"kakeraP": false, "kakera": false, "kakeraT": false, "kakeraG": false, "kakeraY": false, "kakeraO": false, "kakeraR": false, "kakeraW": false, "kakeraL": false}],
                    ["${E.PREFERENCES.MENTIONS}", ""],
                    ["${E.PREFERENCES.ROLL}", {"enabled":true,"type":"wx"}],
                    ["${E.PREFERENCES.SOUND}", {"foundcharacter":true,"marry":true,"cantmarry":true, "lastresetnorolls":true,"soulmate":true,"wishsteal":true}],
                    ["${E.PREFERENCES.EXTRA}", {"logger":true}]
                ]`;
    
                const savedVersion = GM_getValue(E.GMVALUE.VERSION, null);
    
                const isPreferencesOutdated = !savedVersion || savedVersion !== GM_info.script.version;
    
                const stringifiedPreferences = isPreferencesOutdated ? defaultPreferences : GM_getValue(E.GMVALUE.PREFERENCES, defaultPreferences);
    
                this.preferences = new Map(JSON.parse(stringifiedPreferences));
    
                GM_setValue(E.GMVALUE.VERSION, GM_info.script.version);

                resolve();
            });
        },

        render() {
            logger.info("Rendering...");
            const el_InfoPanel = document.createElement("div");
            el_InfoPanel.id = "automudae-panel-info";
            el_InfoPanel.innerHTML = `
            <h1>Auto-Mudae Info</h1>
            <div>
                <div class="automudae-section">
                    <h2>Collected</h2>
                    <div class="automudae-section-body">
                        <div class="automudae-row">
                            <span>Kakera:</span>
                            <div><img class="emoji" src="https://cdn.discordapp.com/emojis/469835869059153940.webp?quality=lossless"><span id="automudae-field-${E.INFO_FIELD.KAKERA}">0</span></div>
                        </div>
                        <div class="automudae-row">
                            <span>Characters:</span>
                        </div>
                        <ul id="automudae-field-${E.INFO_FIELD.COLLECTED_CHARACTERS}"></ul>
                    </div>
                </div>
                <div class="automudae-section" id="automudae-section-status">
                    <h2>Status</h2>
                    <div class="automudae-section-body">
                        <div class="automudae-row-expandable">
                            <div class="automudae-row">
                                <span>Rolls:</span>
                                <div><span>(</span><span id="automudae-field-${E.INFO_FIELD.ROLLS_LEFT}">?</span><span>/</span><span id="automudae-field-${E.INFO_FIELD.ROLLS_MAX}">?</span><span>)</span></div>
                            </div>
                            <div>
                                ${this.users.map(user => `<div class="automudae-row"><span>${user.username}:</span><div><span>(</span><span id="automudae-field-${E.INFO_FIELD.ROLLS_LEFT}-${user.id}">?</span><span>/</span><span id="automudae-field-${E.INFO_FIELD.ROLLS_MAX}-${user.id}">?</span><span>)</span></div></div>`).join("")}
                            </div>
                        </div>
                        <div class="automudae-row-expandable">
                            <div class="automudae-row">
                                <span>Power:</span>
                                <div><span id="automudae-field-${E.INFO_FIELD.POWER}">?</span><span>%</span></div>
                            </div>
                            <div>
                                ${this.users.map(user => `<div class="automudae-row"><span>${user.username}:</span><div><div><span id="automudae-field-${E.INFO_FIELD.POWER}-${user.id}">?</span><span>%</span></div></div></div>`).join("")}
                            </div>
                        </div>
                        <div class="automudae-row-expandable">
                            <div class="automudae-row">
                                <span>Kakera Power Consumption:</span>
                                <div><span id="automudae-field-${E.INFO_FIELD.POWER_CONSUMPTION}">?</span><span>%</span></div>
                            </div>
                            <div>
                                ${this.users.map(user => `<div class="automudae-row"><span>${user.username}:</span><div><div><span id="automudae-field-${E.INFO_FIELD.POWER_CONSUMPTION}-${user.id}">?</span><span>%</span></div></div></div>`).join("")}
                            </div>
                        </div>
                        <div class="automudae-row-expandable">
                            <div class="automudae-row">
                                <span>Can Marry?</span>
                                <span id="automudae-field-${E.INFO_FIELD.CAN_MARRY}">?</span>
                            </div>
                            <div>
                                ${this.users.map(user => `<div class="automudae-row"><span>${user.username}:</span><div><span id="automudae-field-${E.INFO_FIELD.CAN_MARRY}-${user.id}">?</span></div></div>`).join("")}
                            </div>
                        </div>
                        <div class="automudae-row-expandable">
                            <div class="automudae-row">
                                <span>Can RT?</span>
                                <span id="automudae-field-${E.INFO_FIELD.CAN_RT}">?</span>
                            </div>
                            <div>
                                ${this.users.map(user => `<div class="automudae-row"><span>${user.username}:</span><div><span id="automudae-field-${E.INFO_FIELD.CAN_RT}-${user.id}">?</span></div></div>`).join("")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            const el_ConfigPanel = document.createElement("div");
            el_ConfigPanel.id = "automudae-panel-config";
            el_ConfigPanel.innerHTML = `
            <h1>Auto-Mudae Config</h1>
            <div>
                <div class="automudae-section" id="automudae-section-kakera">
                    <h2>Kakera to Collect</h2>
                    <div class="automudae-section-body">
                        <div><input type="checkbox" id="opt-kakera-kakeraP"><label for="opt-kakera-kakeraP"><img class="emoji" src="https://cdn.discordapp.com/emojis/609264156347990016.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakera"><label for="opt-kakera-kakera"><img class="emoji" src="https://cdn.discordapp.com/emojis/469835869059153940.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakeraT"><label for="opt-kakera-kakeraT"><img class="emoji" src="https://cdn.discordapp.com/emojis/609264180851376132.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakeraG"><label for="opt-kakera-kakeraG"><img class="emoji" src="https://cdn.discordapp.com/emojis/609264166381027329.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakeraY"><label for="opt-kakera-kakeraY"><img class="emoji" src="https://cdn.discordapp.com/emojis/605112931168026629.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakeraO"><label for="opt-kakera-kakeraO"><img class="emoji" src="https://cdn.discordapp.com/emojis/605112954391887888.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakeraR"><label for="opt-kakera-kakeraR"><img class="emoji" src="https://cdn.discordapp.com/emojis/605112980295647242.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakeraW"><label for="opt-kakera-kakeraW"><img class="emoji" src="https://cdn.discordapp.com/emojis/608192076286263297.webp?quality=lossless"></label></div>
                        <div><input type="checkbox" id="opt-kakera-kakeraL"><label for="opt-kakera-kakeraL"><img class="emoji" src="https://cdn.discordapp.com/emojis/815961697918779422.webp?quality=lossless"></label></div>
                    </div>
                </div>
                <div class="automudae-section">
                    <h2>Interesting Mentions</h2>
                    <div class="automudae-section-body">
                        <textarea spellcheck="false" id="opt-mentions"></textarea>
                    </div>
                </div>
                <div class="automudae-section">
                    <h2>Roll</h2>
                    <div class="automudae-section-body">
                        <div>
                            <input type="checkbox" id="opt-roll-enabled"><label for="opt-roll-enabled"><span>Enabled</span></label>
                        </div>
                        <div>
                            <select id="opt-roll-type">
                                <option value="wx">wx</option>
                                <option value="wa">wa</option>
                                <option value="wg">wg</option>
                                <option value="hx">hx</option>
                                <option value="ha">ha</option>
                                <option value="hg">hg</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="automudae-section">
                    <h2>Sound</h2>
                    <div class="automudae-section-body">
                        <div>
                            <input type="checkbox" id="opt-sound-foundcharacter"><label for="opt-sound-foundcharacter"><span>Found character</span></label>
                        </div>
                        <div>
                            <input type="checkbox" id="opt-sound-marry"><label for="opt-sound-marry"><span>Marry</span></label>
                        </div>
                        <div>
                            <input type="checkbox" id="opt-sound-cantmarry"><label for="opt-sound-cantmarry"><span>Can't marry</span></label>
                        </div>
                        <div>
                            <input type="checkbox" id="opt-sound-lastresetnorolls"><label for="opt-sound-lastresetnorolls"><span>Can't roll in the last reset</span></label>
                        </div>
                        <div>
                            <input type="checkbox" id="opt-sound-soulmate"><label for="opt-sound-soulmate"><span>New soulmates</span></label>
                        </div>
                        <div>
                            <input type="checkbox" id="opt-sound-wishsteal"><label for="opt-sound-wishsteal"><span>Wish steals</span></label>
                        </div>
                    </div>
                </div>
                <div class="automudae-section">
                    <h2>Extra</h2>
                    <div class="automudae-section-body">
                        <div data-requirerestart>
                            <input type="checkbox" id="opt-extra-logger"><label for="opt-extra-logger"><span>Replace Console with Logger</span></label>
                        </div>
                    </div>
                </div>
            </div>
            `;

            const el_ToastsWrapper = document.createElement("div");
            el_ToastsWrapper.id = "automudae-toasts-wrapper";

            DOM.el_ChannelList.prepend(el_InfoPanel);
            DOM.el_MemberList.prepend(el_ConfigPanel);
            DOM.el_ChatWrapper.prepend(el_ToastsWrapper);

            DOM.el_ToastsWrapper = el_ToastsWrapper;

            document.querySelector("[class^='channelTextArea']").style.width = "60%";

            /// Make side panels collapsable
            function collapse() { this.parentElement.classList.toggle("collapsed") };

            document.querySelectorAll("[id^='automudae-panel'] > h1").forEach(el_Header => el_Header.onclick = collapse);

            /// Config Update & Functionality
            function handleCheckboxPreference() {
                const [_, category, key] = this.id.split("-");
                const categoryPreferences = AutoMudae.preferences.get(category);

                categoryPreferences[key] = this.checked;

                AutoMudae.preferences.set(category, categoryPreferences);
                AutoMudae.savePreferences();
            };

            document.querySelectorAll("input[type='checkbox'][id^='opt-']").forEach(el_OptCheckbox => {
                const [_, category, key] = el_OptCheckbox.id.split("-");

                el_OptCheckbox.checked = AutoMudae.preferences.get(category)[key];
                el_OptCheckbox.onchange = handleCheckboxPreference;
            });

            const el_OptMentions = document.getElementById("opt-mentions");

            el_OptMentions.value = this.preferences.get(E.PREFERENCES.MENTIONS);

            el_OptMentions.onblur = function () {
                AutoMudae.preferences.set(E.PREFERENCES.MENTIONS, this.value);
                AutoMudae.savePreferences();
            };

            const el_OptRollType = document.getElementById("opt-roll-type");

            el_OptRollType.value = this.preferences.get(E.PREFERENCES.ROLL).type;

            el_OptRollType.onchange = function () {
                const rollPreferences = AutoMudae.preferences.get(E.PREFERENCES.ROLL);

                rollPreferences.type = this.value;

                AutoMudae.preferences.set(E.PREFERENCES.ROLL, rollPreferences);
                AutoMudae.savePreferences();
            };
        },

        tryEnable() {
            if (this.state !== E.AUTOMUDAE_STATE.SETUP) return;
            if (!Object.values(E.DISCORD_INFO).every(info => Discord.info.has(info))) return;

            this.setState(E.AUTOMUDAE_STATE.IDLE);
            DOM.el_RunButton.onclick = (_e) => AutoMudae.toggle();
            DOM.el_RunButton.classList.remove("automudae-hide");
            logger.plus("Ready to go!");
        },

        toggle() {
            if (this.state !== E.AUTOMUDAE_STATE.IDLE && this.state !== E.AUTOMUDAE_STATE.RUN) return;

            if (this.state === E.AUTOMUDAE_STATE.IDLE) {
                this.clearError();

                let msToStartResetHandler = 1;
                const now = new Date();

                if (now.getMinutes() !== 37) {
                    const nextReset = new Date(now);
                    nextReset.setHours(now.getMinutes() > 37 ? now.getHours() + 1 : now.getHours(), 37);
                    msToStartResetHandler = nextReset - now;
                }

                this.timers.set("think", this.think, INTERVAL_THINK, true);
                this.timers.set("initHourlyResetHandler", () => { AutoMudae.handleHourlyReset(); AutoMudae.timers.set("HandleHourlyReset", AutoMudae.handleHourlyReset, 1 * 60 * 60 * 1000, true) }, msToStartResetHandler);
                this.chatObserver.observe(DOM.el_Chat, { childList: true });
                this.setState(E.AUTOMUDAE_STATE.RUN);
                logger.log("Running..");
                return;
            }

            this.chatObserver.disconnect();
            this.timers.clear();
            this.users.forEach(user => {
                if (user.sendTUTimer) clearTimeout(user.sendTUTimer);
                user.info.clear();
            });
            this.setState(E.AUTOMUDAE_STATE.IDLE);
            logger.log("Turned off.");
        },

        setState(E_STATE) {
            this.state = E_STATE;

            const stateTexts = {};
            stateTexts[E.AUTOMUDAE_STATE.INJECT] = "Idle";
            stateTexts[E.AUTOMUDAE_STATE.SETUP] = "Setting up...";
            stateTexts[E.AUTOMUDAE_STATE.ERROR] = "Error!";
            stateTexts[E.AUTOMUDAE_STATE.IDLE] = "Idle";
            stateTexts[E.AUTOMUDAE_STATE.RUN] = "Running...";

            DOM.el_StateSpan.innerText = stateTexts[E_STATE];

            if ((E_STATE === E.AUTOMUDAE_STATE.RUN || E_STATE === E.AUTOMUDAE_STATE.IDLE) && DOM.el_RunButton){
                const isRun = E_STATE === E.AUTOMUDAE_STATE.RUN;
                DOM.el_RunButton.classList[isRun ? "add" : "remove"]("running");
            }
        },

        think() {
            const now = performance.now();
            const dateNow = new Date(), h = dateNow.getHours(), m = dateNow.getMinutes();

            if (!AutoMudae.hasNeededInfo()) {
                if (now - AutoMudae.cdGatherInfo < 1000) return;

                for (let i = 0; i < AutoMudae.users.length; i++) {
                    const user = AutoMudae.users[i];

                    if (!user.hasNeededInfo()) {
                        logger.log(`Gathering needed info for user [${user.username}]..`);

                        user.send("$tu");

                        break;
                    }

                }

                AutoMudae.cdGatherInfo = now;
                return;
            }

            const userWithRolls = AutoMudae.users.find(user => user.info.get(E.MUDAE_INFO.ROLLS_LEFT) > 0);

            if (AutoMudae.preferences.get(E.PREFERENCES.ROLL).enabled) {
                if (userWithRolls && now - Discord.lastMessageTime > INTERVAL_ROLL && now - AutoMudae.cdRoll > (INTERVAL_ROLL * .5)) {
                    userWithRolls.roll();
                    AutoMudae.cdRoll = now;
                }
            }

            if (!userWithRolls && m > 38 && AutoMudae.isLastReset() && AutoMudae.getMarriageableUser()) {
                const currentResetHash = `${dateNow.toDateString()} ${h}`;

                if (AutoMudae.lastResetHash !== currentResetHash) {
                    AutoMudae.lastResetHash = currentResetHash;

                    //# Add option to auto-use $us or $rolls

                    const warnMessage = "You have no more rolls, can still marry and it's the last reset. You could use $us or $rolls, then $tu.";

                    logger.warn(warnMessage);
                    AutoMudae.toasts.add(E.TOAST.WARN, warnMessage);
                    if (AutoMudae.preferences.get(E.PREFERENCES.SOUND).lastresetnorolls) SOUND.lastResetNoRolls();
                }
                
            }

        },

        savePreferences() {
            GM_setValue(E.GMVALUE.PREFERENCES, JSON.stringify(this.preferences));
        },

        updateInfoPanel(E_INFO_FIELD, content, user) {
            const el_OverallField = document.getElementById(`automudae-field-${E_INFO_FIELD}`);

            if (E_INFO_FIELD === E.INFO_FIELD.KAKERA) {
                const newKakera = Number(el_OverallField.innerText) + Number(content);

                el_OverallField.innerText = newKakera;
                return;
            }

            if (E_INFO_FIELD === E.INFO_FIELD.COLLECTED_CHARACTERS) {
                const el_CharacterItem = document.createElement("li");
                el_CharacterItem.appendChild(document.createTextNode((user ? `[${user.username}] ` : '') + content));
                el_OverallField.appendChild(el_CharacterItem);

                return;
            }

            const el_UserField = document.getElementById(`automudae-field-${E_INFO_FIELD}-${user.id}`);

            el_UserField.innerText = content;

            if (E_INFO_FIELD === E.INFO_FIELD.ROLLS_LEFT || E_INFO_FIELD === E.INFO_FIELD.ROLLS_MAX) {
                const numeralFields = [...document.querySelectorAll(`[id^='automudae-field-${E_INFO_FIELD}-']`)].map(el_UserField => el_UserField.innerText).filter(text => /\d+/.test(text));

                if (numeralFields.length > 0) el_OverallField.innerText = numeralFields.reduce((total, current) => Number(total) + Number(current));

                return;
            }

            if (E_INFO_FIELD === E.INFO_FIELD.POWER) {
                const highestPower = getLast([...document.querySelectorAll(`[id^='automudae-field-${E_INFO_FIELD}-']`)].map(el_UserField => el_UserField.innerText).filter(text => /\d+/.test(text)).sort((a, b) => Number(a) - Number(b)));

                if (highestPower) el_OverallField.innerText = `↓ ${highestPower}`;

                return;
            }

            if (E_INFO_FIELD === E.INFO_FIELD.POWER_CONSUMPTION) {
                const lowestConsumption = [...document.querySelectorAll(`[id^='automudae-field-${E_INFO_FIELD}-']`)].map(el_UserField => el_UserField.innerText).filter(text => /\d+/.test(text)).sort((a, b) => Number(a) - Number(b))[0];

                if (lowestConsumption) el_OverallField.innerText = `↑ ${lowestConsumption}`;

                return;
            }

            if (E_INFO_FIELD === E.INFO_FIELD.CAN_MARRY || E_INFO_FIELD === E.INFO_FIELD.CAN_RT) {
                const hasAny = [...document.querySelectorAll(`[id^='automudae-field-${E_INFO_FIELD}-']`)].some(el_UserField => el_UserField.innerText === "Yes");

                el_OverallField.innerText = hasAny ? "Yes" : "No";

                return;
            }
        },

        handleHourlyReset() {
            if (!AutoMudae.hasNeededInfo()) return;

            logger.log("Hourly reset. Gathering updated status..");

            AutoMudae.users.forEach(user => user.info.delete(E.MUDAE_INFO.ROLLS_LEFT));
        }
    };

    //# Remove this exposure
    window.Discord = Discord;
    window.AutoMudae = AutoMudae;

    function observeToReact(el_Message, userToReact) {
        let runs = 0;

        const observer = setInterval(() => {
            if (!el_Message || runs++ >= 30) return clearInterval(observer);

            const el_ReactionImg = el_Message.querySelector(`div[class^='reactionInner']${userToReact ? "" : "[aria-label^='kakera']"}[aria-label*='1 rea'] img`);

            if (!el_ReactionImg) return;

            clearInterval(observer);

            if (userToReact) {
                const emoji = E.EMOJI[el_ReactionImg.alt];

                if (!emoji) {
                    const errMessage = `Couldn't find emoji code for [${el_ReactionImg.alt}]. Address this to AutoMudae's creator, please.`;
                    logger.error(errMessage);
                    AutoMudae.toasts.add(E.TOAST.CRITICAL, errMessage, el_Message);
                    return;
                }

                userToReact.react(el_Message, emoji);
                return;
            }

            const kakeraCode = el_ReactionImg.alt;

            if (!AutoMudae.preferences.get(E.PREFERENCES.KAKERA)[kakeraCode]) return;

            const userWithEnoughPower = kakeraCode === E.KAKERA.PURPLE
                ? AutoMudae.users[0]
                : AutoMudae.users.find(user => user.info.get(E.MUDAE_INFO.POWER) >= user.info.get(E.MUDAE_INFO.CONSUMPTION));

            if (userWithEnoughPower) userWithEnoughPower.react(el_Message, E.EMOJI_KAKERA[kakeraCode]);
        }, 100);
    };

    function handleNewChatAppend(el_Children) {
        document.querySelector("div[class^='scrollerSpacer']")?.scrollIntoView();

        el_Children.forEach(el_Child => {
            if (el_Child.tagName !== "LI") return;
            Discord.lastMessageTime = performance.now();

            const el_Message = el_Child;

            if (!Discord.Message.isFromMudae(el_Message)) return;

            const el_PreviousElement = el_Message.previousElementSibling
                ? (el_Message.previousElementSibling.id === "---new-messages-bar" ? el_Message.previousElementSibling.previousElementSibling : el_Message.previousElementSibling)
                : null;

            /// Handle player commands
            if (el_PreviousElement) {
                const el_PreviousMessage = el_PreviousElement;

                const user = Discord.Message.isFromMe(el_PreviousMessage);

                if (user) {
                    const command = el_PreviousMessage.querySelector("div[id^='message-content']")?.innerText;
                    const mudaeResponse = el_Message.querySelector("div[id^='message-content']")?.innerText;

                    if (command && mudaeResponse && mudaeResponse.startsWith(`${user.username}, `)) {
                        if (command === "$tu") {
                            const matchRolls = /tem (\d+) rolls/.exec(mudaeResponse);
                            if (matchRolls) {
                                const rolls = Number(matchRolls[1]);

                                const hasRollsMax = user.info.has(E.MUDAE_INFO.ROLLS_MAX);

                                if (!hasRollsMax || user.info.get(E.MUDAE_INFO.ROLLS_MAX) < rolls) {
                                    user.info.set(E.MUDAE_INFO.ROLLS_MAX, rolls);

                                    AutoMudae.updateInfoPanel(E.INFO_FIELD.ROLLS_MAX, rolls, user);
                                }

                                user.info.set(E.MUDAE_INFO.ROLLS_LEFT, rolls);
                                AutoMudae.updateInfoPanel(E.INFO_FIELD.ROLLS_LEFT, rolls, user);
                            }

                            const matchPower = /Power: (\d+)%/.exec(mudaeResponse);
                            if (matchPower) {
                                const power = Number(matchPower[1]);

                                user.info.set(E.MUDAE_INFO.POWER, power);
                                AutoMudae.updateInfoPanel(E.INFO_FIELD.POWER, power, user);
                            }

                            if (/\$rt/.test(mudaeResponse)) {
                                const cooldownRTMatch = /: (.+) min. \(\$rtu\)/.exec(mudaeResponse);

                                user.info.set(E.MUDAE_INFO.CAN_RT, !cooldownRTMatch);

                                if (cooldownRTMatch) {
                                    logger.log(`Scheduled a RT check for user [${user.username}]. [${cooldownRTMatch[1]}]`);

                                    user.setTUTimer(AutoMudae.mudaeTimeToMs(cooldownRTMatch[1]) + 500);
                                }

                                const canRT = user.info.get(E.MUDAE_INFO.CAN_RT);
                                AutoMudae.updateInfoPanel(E.INFO_FIELD.CAN_RT, canRT ? "Yes" : "No", user);
                            } else {
                                user.info.set(E.MUDAE_INFO.CAN_RT, false);
                                AutoMudae.updateInfoPanel(E.INFO_FIELD.CAN_RT, "No", user);
                            }

                            if (/casar/.test(mudaeResponse)) {
                                const cantMarry = /se casar novamente (.+) min/.exec(mudaeResponse);

                                user.info.set(E.MUDAE_INFO.CAN_MARRY, !cantMarry);

                                AutoMudae.updateInfoPanel(E.INFO_FIELD.CAN_MARRY, cantMarry ? "No" : "Yes", user);
                            }

                            const matchKakeraConsumption = /kakera consume (\d+)%/.exec(mudaeResponse);
                            if (matchKakeraConsumption) {
                                const consumption = Number(matchKakeraConsumption[1]);

                                user.info.set(E.MUDAE_INFO.CONSUMPTION, consumption);

                                AutoMudae.updateInfoPanel(E.INFO_FIELD.POWER_CONSUMPTION, consumption, user);
                            }

                            if (!user.hasNeededInfo()) {
                                AutoMudae.toggle();

                                const errMsg = `Couldn't retrieve needed info for user [${user.username}]. Make sure your $tu configuration exposes every information.`;
                                logger.error(errMsg);
                                AutoMudae.error(errMsg);
                                return;
                            }

                            logger.info(`Got all needed info for user [${user.username}].`);
                            return;
                        };
                    }
                }
            }

            if (!AutoMudae.hasNeededInfo()) return;

            const el_MessageContent = el_Message.querySelector("div[id^='message-content']");

            if (el_MessageContent) {
                const messageContent = el_MessageContent.innerText;

                /// Handle character claims & steals
                const characterClaimMatch = /(.+) e (.+) agora são casados!/.exec(messageContent.trim());

                if (characterClaimMatch || messageContent.includes("(Silver IV Bônus)")) {
                    let usernameThatClaimed, characterName;

                    if (characterClaimMatch) {
                        [_, usernameThatClaimed, characterName] = characterClaimMatch;
                    }

                    let user;

                    if (usernameThatClaimed) {
                        user = AutoMudae.users.find(user => user.username === usernameThatClaimed);
                    }

                    /// Claim
                    if (user) {
                        user.info.set(E.MUDAE_INFO.CAN_MARRY, false);

                        AutoMudae.updateInfoPanel(E.INFO_FIELD.CAN_MARRY, "No", user);
                        AutoMudae.updateInfoPanel(E.INFO_FIELD.COLLECTED_CHARACTERS, characterName, user);

                        if (AutoMudae.preferences.get(E.PREFERENCES.SOUND).marry) SOUND.marry();

                        const logMessage = `User [${usernameThatClaimed}] claimed character [${characterName}]!`;
                        logger.plus(logMessage);
                        AutoMudae.toasts.add(E.TOAST.CHARCLAIM, logMessage, el_Message);

                        el_Message.classList.add("plus");

                        document.querySelectorAll("[class^='embedAuthorName']").forEach(el_AuthorName => {
                            if (el_AuthorName.innerText === characterName) {
                                const el_ParentMessage = el_AuthorName.closest("li");
                                el_ParentMessage.classList.add("plus");
                            }
                        });
                    } else {
                        const el_Mentions = el_Message.querySelectorAll("span.mention");

                        let isIncludingMe = false;

                        for (let i = 0; i < el_Mentions.length; i++) {
                            const mentionedNick = el_Mentions[i].innerText.substr(1);

                            if (AutoMudae.users.some(user => user.nick === mentionedNick)) {
                                isIncludingMe = true;
                                break;
                            }
                        }

                        /// Steal
                        if (isIncludingMe) {
                            if (AutoMudae.preferences.get(E.PREFERENCES.SOUND).wishsteal) SOUND.critical();

                            el_Message.classList.add("critical");

                            if (characterName) {
                                document.querySelectorAll("[class^='embedAuthorName']").forEach(el_AuthorName => {
                                    if (el_AuthorName.innerText === characterName) {
                                        const el_ParentMessage = el_AuthorName.closest("li");
                                        el_ParentMessage.classList.add("critical");
                                    }
                                });
                            }

                            const stealWarn = characterClaimMatch
                                ? `User [${usernameThatClaimed}] claimed character [${characterName}] wished by you.`
                                : "A character wished by you was claimed by another user.";

                            logger.warn(stealWarn);
                            AutoMudae.toasts.add(E.TOAST.CRITICAL, stealWarn, el_Message);
                        }
                    }

                    return;
                }

                /// Handle "no more rolls" messages
                const noMoreRollsMatch = /(.+), os rolls são limitado/.exec(messageContent);

                if (noMoreRollsMatch) {
                    const user = AutoMudae.users.find(user => user.username === noMoreRollsMatch[1]);

                    return user && setTimeout(() => user.send("$tu"), 250);
                }

                const el_KakeraClaimStrong = el_Message.querySelector("div[id^='message-content'] span[class^='emojiContainer'] + strong");

                /// Handle kakera claiming
                if (el_KakeraClaimStrong) {
                    const kakeraClaimMatch = /^(.+)\s\+(\d+)$/.exec(el_KakeraClaimStrong.innerText);

                    if (kakeraClaimMatch) {
                        const [_, messageUsername, kakeraQuantity] = kakeraClaimMatch;

                        const user = AutoMudae.users.find(user => user.username === messageUsername);

                        if (user) {
                            const kakeraType = el_KakeraClaimStrong.previousElementSibling?.firstElementChild?.alt.replace(/:/g, '');

                            const powerCost = kakeraType === E.KAKERA.PURPLE ? 0 : user.info.get(E.MUDAE_INFO.CONSUMPTION);

                            if (powerCost > 0) {
                                const newPower = user.info.get(E.MUDAE_INFO.POWER) - powerCost;

                                user.info.set(E.MUDAE_INFO.POWER, newPower);
                                AutoMudae.updateInfoPanel(E.INFO_FIELD.POWER, newPower, user);
                            }

                            el_Message.classList.add("plus");
                            AutoMudae.updateInfoPanel(E.INFO_FIELD.KAKERA, kakeraQuantity);
                            logger.plus(`+${kakeraQuantity} kakera! [Remaining Power for user [${user.username}]: ${user.info.get(E.MUDAE_INFO.POWER)}%]`);
                            AutoMudae.toasts.add(E.TOAST.KAKERA, `+[${kakeraQuantity}] Kakera`, el_Message);
                        }

                        return;
                    }
                }
            }

            const el_ImageWrapper = el_Message.querySelector("div[class^='embedDescription'] + div[class^='imageContent'] div[class^='imageWrapper']");

            /// Handle character messages
            if (el_ImageWrapper) {
                const el_Footer = el_Message.querySelector("span[class^='embedFooterText']");

                const isCharacterLookupMessage = (el_Footer && (/^\d+ \/ \d+$/.test(el_Footer.innerText) || /^Pertence a .+ ~~ \d+ \/ \d+$/.test(el_Footer.innerText)));

                if (isCharacterLookupMessage) return;

                const characterName = el_Message.querySelector("span[class^='embedAuthorName']").innerText;
                const el_ReplyAvatar = el_Message.querySelector("img[class^='executedCommandAvatar']");
                let replyUserId;

                if (el_ReplyAvatar) {
                    replyUserId = /avatars\/(\d+)\//.exec(el_ReplyAvatar.src);

                    if (!replyUserId) return logger.error("Couldn't get reply user ID for", el_Message);

                    const user = AutoMudae.users.find(user => user.id === replyUserId[1]);

                    if (user) {
                        const rollsLeft = user.info.get(E.MUDAE_INFO.ROLLS_LEFT) - 1;
                        user.info.set(E.MUDAE_INFO.ROLLS_LEFT, rollsLeft);
                        AutoMudae.updateInfoPanel(E.INFO_FIELD.ROLLS_LEFT, rollsLeft, user);

                        if (el_Message.querySelector("div[class^='embedDescription']").innerText.includes("Sua nova ALMA")) {
                            if (AutoMudae.preferences.get(E.PREFERENCES.SOUND).soulmate) SOUND.newSoulmate();

                            const logMessage = `New soulmate: [${characterName}]!`;
                            logger.plus(logMessage);
                            AutoMudae.toasts.add(E.TOAST.SOULMATE, logMessage, el_Message);
                        }
                    }
                }

                if (!el_Footer || el_Footer.innerText.includes("2 ROLLS RESTANTES") && !el_Footer.innerText.includes("Pertence")) {
                    let el_InterestingCharacter, isWished;

                    const mentionedNicknames = [...el_Message.querySelectorAll("span.mention")].map(el_Mention => el_Mention.innerText.substr(1));

                    for (let i = 0; i < mentionedNicknames.length; i++) {
                        const mentionedNick = mentionedNicknames[i];

                        if (AutoMudae.users.some(user => user.nick === mentionedNick) || AutoMudae.preferences.get(E.PREFERENCES.MENTIONS).split(",").map(nick => nick.trim()).includes(mentionedNick)) {
                            el_InterestingCharacter = el_Message;
                            isWished = true;
                            break;
                        }
                    }

                    const marriageableUser = AutoMudae.getMarriageableUser(mentionedNicknames);

                    if (marriageableUser && !el_InterestingCharacter && AutoMudae.isLastReset()) {
                        //# Search in a database
                        if (characterName === "hmm") {
                            el_InterestingCharacter = el_Message;
                        };
                    }

                    if (el_InterestingCharacter) {
                        const logMessage = `Found character [${characterName}]`;
                        logger.info(logMessage);
                        AutoMudae.toasts.add(E.TOAST.INFO, logMessage, el_Message);

                        if (AutoMudae.preferences.get(E.PREFERENCES.SOUND).foundcharacter) SOUND.foundCharacter();

                        if (marriageableUser) {
                            //# Make it verify if marriageableUser can still marry after all delay calculations (In case of multiple marriageable characters at the same time)
                            if (!isWished) {
                                setTimeout(() => marriageableUser.react(el_Message, pickRandom(Object.values(E.EMOJI))), 8500);
                                return;
                            }

                            const isProtected = !!el_Message.querySelector("img[alt=':wishprotect:']");

                            if (!isProtected || isProtected && marriageableUser.id === replyUserId){
                                observeToReact(el_Message, marriageableUser);
                                return;
                            }

                            setTimeout(() => observeToReact(el_Message, marriageableUser), 2905);
                            return;
                        }

                        if (AutoMudae.preferences.get(E.PREFERENCES.SOUND).cantmarry) SOUND.critical();

                        const warnMessage = `Can't marry right now. You may lose character [${characterName}]`;
                        logger.warn(warnMessage);
                        AutoMudae.toasts.add(E.TOAST.WARN, warnMessage, el_Message);
                    }

                    return;
                }

                /// Owned characters
                if (el_Footer.innerText.includes("Pertence")) {
                    /// Observe kakera reactions append
                    observeToReact(el_Message);
                }

                return;
            }
        });
    }

    //// SessionId Hook
    window.console.info = function () {
        for (const arg of arguments) {
            const match = /\[READY\] (?:.+) as (.+)/.exec(arg) || /resuming session (.+),/.exec(arg);

            if (match) {
                window.console.info = console.info;
                Discord.info.set(E.DISCORD_INFO.SESSION_ID, match[1]);
                AutoMudae.tryEnable();
            }
        }
        console.info(...arguments);
    };

    //// Main
    window.addEventListener("load", main, false);

    function main() {
        const findToolbarTimer = setInterval(() => {
            if (document.querySelector("[class^='toolbar']")){
                clearInterval(findToolbarTimer);
                AutoMudae.preRender();
            }
        }, 200);
    };
})();

