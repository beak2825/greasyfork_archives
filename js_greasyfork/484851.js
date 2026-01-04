// ==UserScript==
// @name Nova Bloxflip Custom Theme
// @namespace tampermonkey
// @version 1.3
// @description Customize your Bloxflip experience with Nova.
// @match https://bloxflip.com/*
// @grant GM_addStyle
// @author Notserp
// @icon https://th.bing.com/th/id/OIG.MXvUQzDls.cKp7F69BxH?pid=ImgGn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484851/Nova%20Bloxflip%20Custom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/484851/Nova%20Bloxflip%20Custom%20Theme.meta.js
// ==/UserScript==

GM_addStyle(`
    @import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');

    :root {
        --color-dark-100: #191919 !important;
        --color-dark-90: #1A1A1A !important;
        --color-dark-80: #191919 !important;
        --color-dark-70: #151515 !important;
        --color-dark-60: #121212 !important;
        --color-dark-50: #282828 !important;
        --color-dark-40: #252525 !important;
        --color-dark-30: #393939 !important;
        --color-accent-blue: #363636 !important;
        --color-accent-aqua: #282828 !important;
    }

    * {
        font-family: 'Poppins', sans-serif !important;
    }

    body, html {
        font-size: 10px !important;
        line-height: 1.2 !important;
        color: var(--color-white-primary);
        background: #1A1A1A;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        overscroll-behavior-y: contain;
    }

    .header_header__pwrbs {
        position: -webkit-sticky;
        position: sticky;
        z-index: 102;
        background: #1a1a1a;
        display: flex;
        align-items: center;
        top: 0;
        height: 80px;
        padding: 5px 48px 5px 24px;
    }

    .sidebar_sidebar__7U3PX {
        background-color: #282828 !important;
    }

    .layout_layoutSidebar__AGyEt * {
        border-color: #282828 !important;
    }

    .gameBlock {
        background: #212121 !important;
        border-radius: 12px;
    }

    .footer_footer__3kcQj {
        background-color: #202020 !important;
        color: #202020 !important;
        border-color: #202020 !important;
        fill: #202020 !important;
    }

    .Cases_createCaseButtonText__tvNAo {
        visibility: hidden !important;
    }

    .Rewards_rakeback__PFxqr {
        background-image: none !important;
    }

    .Profile_profileMain__llT4J {
       padding: 40px 20px 40px 40px;
       background: #212121;
       border-radius: 12px;
    }

    .Affiliates_affiliatesStats__AqKvC {
    padding: 40px 20px 40px 40px;
    background: #212121;
    border-radius: 12px;
    }

    .ElementsApp, .ElementsApp .InputElement {
    background-color: #282828;
    line-height: 2em;
    color: #ffffff;
    font-size: 20px;
    font-family: 'Poppins', sans-serif;
    height: 40px;
    }

    .Cases_createCaseButton__Zv1mq {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 200px;
    background: #1e1e1e;
    border-radius: 16px;
    border: none;
    padding: 16px;
    box-shadow: none;
    cursor: pointer;
    transition: background .2s ease;
    order: 1;
    }

    .statistics_notiTab__AEYn8 .statistics_container__aucvX {
    background-color: #212121;
    border-radius: 4px;
    padding: 2em;
    margin-top: 3em;
    position: relative;
    }

    .mines_minesGameItem__S2ytQ {
    display: block;
    box-shadow: none;
    position: relative;
    will-change: background, filter;
    transform: translateZ(0px);
    background: #1c1c1c;
    border-radius: 8px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    padding: 0px;
    transition: filter 0.2s ease 0s, background;
    }

    .mines_minesGame__6Bltb {
    display: flex;
    padding: 64px 32px;
    background: var(--color-dark-50) url(https://th.bing.com/th/id/R.8424362…?rik=WqFlR%2bgsrbr%2b4A&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fVvqe2Dp.jpg&ehk=Tk98ktXtVZuLhphZ%2fUUzK9G2OMtC9%2b4IugVAReMfihg%3d&risl=&pid=ImgRaw&r=0) center center/cover no-repeat;
    border-radius: 12px;
    height: 100%;
    position: relative;
    }

    .towers_towersGame__4VfYK {
    display: flex;
    padding: 90px 32px;
    background: var(--color-dark-50) url(https://th.bing.com/th/id/R.8424362…?rik=WqFlR%2bgsrbr%2b4A&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fVvqe2Dp.jpg&ehk=Tk98ktXtVZuLhphZ%2fUUzK9G2OMtC9%2b4IugVAReMfihg%3d&risl=&pid=ImgRaw&r=0) center center/cover no-repeat;
    border-radius: 12px;
    }

    .jackpot_jackpotGame__Weio1 {
    display: flex;
    padding: 125px 32px;
    background: var(--color-dark-50) url(https://th.bing.com/th/id/R.8424362…?rik=WqFlR%2bgsrbr%2b4A&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fVvqe2Dp.jpg&ehk=Tk98ktXtVZuLhphZ%2fUUzK9G2OMtC9%2b4IugVAReMfihg%3d&risl=&pid=ImgRaw&r=0) center center/cover no-repeat;
    border-radius: 12px;
    }

    .roulette_rouletteGame__60JcH {
    background: var(--color-dark-50) url(https://th.bing.com/th/id/R.8424362…?rik=WqFlR%2bgsrbr%2b4A&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fVvqe2Dp.jpg&ehk=Tk98ktXtVZuLhphZ%2fUUzK9G2OMtC9%2b4IugVAReMfihg%3d&risl=&pid=ImgRaw&r=0) center center/cover no-repeat;
    padding: 40px 0 80px;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    }

    .roulette_roulettePlayersColumn__iBsQD {
    background: #212121;
    border-radius: 12px;
    padding: 24px;
    height: 35em;
    overflow-y: auto;
    position: relative;
    }

    .crash_crashGame__8up4O {
    background: var(--color-dark-50) url(https://th.bing.com/th/id/R.8424362…?rik=WqFlR%2bgsrbr%2b4A&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fVvqe2Dp.jpg&ehk=Tk98ktXtVZuLhphZ%2fUUzK9G2OMtC9%2b4IugVAReMfihg%3d&risl=&pid=ImgRaw&r=0) center bottom/cover no-repeat;
    padding: 200px 0 0;
    height: 100%;
    min-height: 200px;
    border-radius: 12px;
    position: relative;
    display: flex;
    flex-direction: column;
    aspect-ratio: 736/615;
    overflow: hidden;
    }

    .gamePlayersScrollable .gamePlayersTableHead {
    position: -webkit-sticky;
    position: sticky;
    background: #212121;
    border-radius: 12px 12px 0 0;
    z-index: 2;
    margin-top: -1px;
    top: 0;
    }
`);