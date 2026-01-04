// ==UserScript==
// @name         Hide Twitch SideBar
// @version      1.8.7
// @description  hide twitch sidebar
// @author       raianwz
// @match        https://www.twitch.tv/*
// @exclude      *://player.twitch.tv/*
// @exclude      *://*.twitch.tv/p/*
// @exclude      *://*.twitch.tv/jobs/*
// @exclude      *://*.twitch.tv/subs/*
// @exclude      *://*.twitch.tv/embed/*
// @exclude      *://*.twitch.tv/store/*
// @exclude      *://*.twitch.tv/teams/*
// @exclude      *://*.twitch.tv/turbo/*
// @exclude      *://*.twitch.tv/popout/*
// @exclude      *://*.twitch.tv/moderator/*
// @exclude      *://*.twitch.tv/broadcast/*
// @exclude      *://*.twitch.tv/*/squad
// @exclude      *://*.twitch.tv/downloads*
// @icon         https://i.imgur.com/0GDybrZ.png
// @run-at       document-end
// @license      MIT
// @namespace    https://greasyfork.org/users/425245
// @downloadURL https://update.greasyfork.org/scripts/404887/Hide%20Twitch%20SideBar.user.js
// @updateURL https://update.greasyfork.org/scripts/404887/Hide%20Twitch%20SideBar.meta.js
// ==/UserScript==
let getElement = (e) => document.querySelector(e);
let arcnt = 0;

document.addEventListener('readystatechange', (e) => {
    if (e.target.readyState === "complete") CheckBar();
});

function CheckBar() {
    if (arcnt >= 10) return;
    if (!document.getElementById('btnSideBar')) {
        LoadBar();
        arcnt++;
    }
}

function LoadBar(){
    const navSidebar = getElement(`[data-a-target="side-nav-bar-collapsed"]`) ?? getElement(`.side-nav--expanded`);
    const getBtnHideSide = localStorage.getItem('hidesdbar');
    const setBtnHideSide = (value) => localStorage.setItem('hidesdbar', value);

    if (!navSidebar) return CheckBar();
    navSidebar.style.display = "block";

    let where = getElement('div.Layout-sc-1xcs6mc-0.fRzsnK');
    const arrow = `<div class="Layout-sc-1xcs6mc-0 VxLcr"><div class="Layout-sc-1xcs6mc-0 gQAGKi"><div class="Layout-sc-1xcs6mc-0 bWprIP"><div class="InjectLayout-sc-1i43xsx-0 iDMNUO"><button id="btnSideBar" class="ScCoreButton-sc-ocjdkq-0 iPkwTD ScButtonIcon-sc-9yap0r-0 dcNXJO Arrow">
<div class="ButtonIconFigure-sc-1emm8lf-0 lnTwMD"><div class="ScSvgWrapper-sc-wkgzod-0 kccyMt tw-svg"><svg width="20" height="20" viewBox="0 0 20 20"><g id="pArrow"><path fill-rule="evenodd" d="M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z"></path></g></svg>
</div></div></button></div></div></div></div>`;

    where.insertAdjacentHTML("beforeBegin",`${arrow}`);

    getElement('#btnSideBar').addEventListener("click", () => changeSide(navSidebar));
    if (!getBtnHideSide) setBtnHideSide(false);
    else if (getBtnHideSide === 'true') changeSide(navSidebar);
}

function changeSide(navSidebar) {
    let tmpNSB = getElement('#seventv-root') ? getElement('seventv-container').parentElement : navSidebar;
    let pArrow = document.getElementById('pArrow');
    let sideR = `<path d="M4 16V4H2v12h2zM13 15l-1.5-1.5L14 11H6V9h8l-2.5-2.5L13 5l5 5-5 5z">`;
    let sideL = `<path d="M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z">`;

    tmpNSB.style.display = tmpNSB.style.display === "none" ? "block" : "none";
    pArrow.innerHTML = tmpNSB.style.display === "none" ? sideR : sideL;
    localStorage.setItem('hidesdbar', tmpNSB.style.display === "none");
}
console.log('[DEBUG] %cHide Twitch SideBar is enabled','color:#19d404')