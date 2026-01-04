// ==UserScript==
// @name         SteamGifts: UI Simplify
// @version      1.0.3
// @description  Remove unnecessary UI on SteamGifts.
// @author       Hayao-Gai
// @namespace	 https://github.com/HayaoGai
// @icon         https://i.imgur.com/2s73pG4.jpg
// @match        https://www.steamgifts.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/382532/SteamGifts%3A%20UI%20Simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/382532/SteamGifts%3A%20UI%20Simplify.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // icons made by https://www.flaticon.com/authors/those-icons
    // icons made by https://www.flaticon.com/authors/pixel-perfect
    // icons made by https://www.flaticon.com/authors/freepik
    // icons made by https://www.flaticon.com/authors/those-icons
    const svgMenu = `<svg style="margin-top: 8px;" viewBox="0 0 469.333 469.333" fill="black"><path d="M426.667,0h-384C19.146,0,0,19.135,0,42.667v384c0,23.531,19.146,42.667,42.667,42.667h384    c23.521,0,42.667-19.135,42.667-42.667v-384C469.333,19.135,450.188,0,426.667,0z M138.667,42.667    c5.891,0,10.667,4.775,10.667,10.667c0,5.891-4.776,10.667-10.667,10.667S128,59.224,128,53.333    C128,47.441,132.776,42.667,138.667,42.667z M96,42.667c5.891,0,10.667,4.775,10.667,10.667C106.667,59.224,101.891,64,96,64    s-10.667-4.776-10.667-10.667C85.333,47.441,90.109,42.667,96,42.667z M53.333,42.667C59.224,42.667,64,47.441,64,53.333    C64,59.224,59.224,64,53.333,64s-10.667-4.776-10.667-10.667C42.667,47.441,47.443,42.667,53.333,42.667z M426.667,426.667h-384    v-320h384V426.667z"/></svg>`;
    const svgFeature = `<svg width="25" height="25" viewBox="0 0 512 512" fill="#f7434c"><path d="M32,271.692v192c0,17.664,14.368,32,32,32h160v-224H32z"/><path d="M480,143.692H378.752c7.264-4.96,13.504-9.888,17.856-14.304c25.824-25.952,25.824-68.192,0-94.144    c-25.088-25.28-68.8-25.216-93.856,0c-13.888,13.92-50.688,70.592-45.6,108.448h-2.304c5.056-37.856-31.744-94.528-45.6-108.448    c-25.088-25.216-68.8-25.216-93.856,0C89.6,61.196,89.6,103.436,115.36,129.388c4.384,4.416,10.624,9.344,17.888,14.304H32    c-17.632,0-32,14.368-32,32v48c0,8.832,7.168,16,16,16h208v-64h64v64h208c8.832,0,16-7.168,16-16v-48    C512,158.06,497.664,143.692,480,143.692z M222.112,142.636c0,0-1.344,1.056-5.92,1.056c-22.112,0-64.32-22.976-78.112-36.864    c-13.408-13.504-13.408-35.52,0-49.024c6.496-6.528,15.104-10.112,24.256-10.112c9.12,0,17.728,3.584,24.224,10.112    C208.128,79.5,229.568,134.924,222.112,142.636z M295.776,143.692c-4.544,0-5.888-1.024-5.888-1.056    c-7.456-7.712,13.984-63.136,35.552-84.832c12.896-13.024,35.456-13.088,48.48,0c13.44,13.504,13.44,35.52,0,49.024    C360.128,120.716,317.92,143.692,295.776,143.692z"/><path d="M288,271.692v224h160c17.664,0,32-14.336,32-32v-192H288z"/></svg>`;
    const svgCopies = `<svg width="25" height="25" viewBox="0 0 512 512" fill="#8cc153"><g><path d="m121 60v60h270v-60h-120v-15c0-8.276 6.724-15 15-15s15 6.724 15 15h30c0-24.814-20.186-45-45-45-11.567 0-22.02 4.508-30 11.704-7.98-7.196-18.433-11.704-30-11.704-24.814 0-45 20.186-45 45h30c0-8.276 6.724-15 15-15s15 6.724 15 15v15z"/><path d="m121 150h120v121h-120z"/><path d="m271 150h120v121h-120z"/><path d="m127.211 422 90 90h77.578l90-90z"/><path d="m337.211 512h174.789v-90h-84.789z"/><path d="m84.789 422h-84.789v90h174.789z"/><path d="m241 301h30v91h-30z"/><path d="m61 301h150v91h-150z"/><path d="m301 301h150v91h-150z"/></g></svg>`;
    const svgEntered = `<svg width="25" height="25" viewBox="0 0 512 512" fill="#ffd039"><g><path d="m96 150h145v-40h30v40h145c8.284 0 15-6.716 15-15v-40c0-8.284-6.716-15-15-15h-71.035c3.848-7.507 6.035-16 6.035-25 0-30.327-24.673-55-55-55-15.75 0-29.964 6.665-40 17.31-10.036-10.645-24.25-17.31-40-17.31-30.327 0-55 24.673-55 55 0 9 2.187 17.493 6.035 25h-71.035c-8.284 0-15 6.716-15 15v40c0 8.284 6.716 15 15 15zm200-120c13.785 0 25 11.215 25 25s-11.215 25-25 25h-25v-25c0-13.785 11.215-25 25-25zm-105 25c0-13.785 11.215-25 25-25s25 11.215 25 25v25h-25c-13.785 0-25-11.215-25-25z"/><path d="m501.607 309.513c-13.55-15.243-36.85-16.727-52.224-3.327l-59.784 52.109c.026.763.058 1.525.058 2.294 0 37.21-30.272 67.483-67.483 67.483h-80.399c-8.284 0-15-6.716-15-15s6.716-15 15-15h40.226 40.186c20.695 0 37.472-16.777 37.472-37.472 0-20.704-16.791-37.484-37.495-37.472l-78.289.049c-21.398-24.333-50.967-39.073-83.286-41.507-32.384-2.437-63.885 7.748-88.708 28.684l-7.024 5.924 73.75 172.084h190.463c18.527 0 36.323-6.817 50.107-19.195l119.482-107.283c15.226-13.67 16.544-37.076 2.948-52.371z"/><path d="m271 293.161 51.144-.032c24.809 0 46.521 13.426 58.255 33.389l30.601-26.673v-119.845h-140z"/><path d="m151.173 251.316c3.869 0 7.794.148 11.666.439 28.591 2.154 55.455 12.059 78.161 28.493v-100.248h-140v79.827c16.036-5.583 32.993-8.511 50.173-8.511z"/><path d="m10.091 343.209c-3.656 1.567-6.541 4.522-8.019 8.216-1.478 3.693-1.427 7.823.14 11.479l60 140c2.438 5.688 7.975 9.095 13.794 9.095 1.971 0 3.975-.391 5.902-1.217l28.443-12.189-71.816-167.573z"/></g></svg>`;
    const svgForum = `<svg width="25" height="25" viewBox="0 0 512.029 512.029" fill="#854f89"><path d="M224.018,0.015c-123.52,0-224,81.824-224,182.4c0,50.944,25.6,98.72,70.784,133.088    c-14.944,23.328-34.272,46.944-58.656,52.96c-7.712,1.92-12.864,9.216-12.064,17.12c0.8,7.936,7.296,14.048,15.264,14.4    c0.352,0,1.728,0.064,4.032,0.064c16.544,0,80.416-2.656,152.896-40.256c16.608,3.36,33.984,5.024,51.744,5.024    c123.488,0,224-81.824,224-182.4S347.506,0.015,224.018,0.015z"/><path d="M499.858,479.279c-20.384-5.024-35.808-19.936-46.592-34.72c37.536-29.408,58.752-69.856,58.752-112.96    c0-36.096-15.168-69.28-40.352-95.808c-28.448,92.448-128.512,161.024-247.648,161.024c-15.904,0-31.616-1.216-46.88-3.616    c-9.088,4.384-17.984,8.256-26.72,11.712c32.288,49.6,96.16,83.488,169.6,83.488c15.008,0,29.568-1.376,43.392-4.064    c45.92,23.392,87.808,27.712,112.448,27.68c13.504,0,21.824-1.28,22.752-1.44c7.488-1.216,13.088-7.552,13.408-15.136    C512.306,487.855,507.25,481.071,499.858,479.279z"/></svg>`;
    const svgAd = `<svg width="25" height="25" viewBox="0 0 469.333 469.333" fill="#1c2c64"><path d="M234.667,266.667V224c0-5.885-4.781-10.667-10.667-10.667h-10.667v64H224     C229.885,277.333,234.667,272.552,234.667,266.667z"/><path d="M149.333,224c0-5.885-4.781-10.667-10.667-10.667S128,218.115,128,224v32h21.333V224z"/><path d="M74.667,341.333H288c5.896,0,10.667-4.771,10.667-10.667V160c0-5.896-4.771-10.667-10.667-10.667H74.667     C68.771,149.333,64,154.104,64,160v170.667C64,336.563,68.771,341.333,74.667,341.333z M192,202.667     c0-5.896,4.771-10.667,10.667-10.667H224c17.646,0,32,14.354,32,32v42.667c0,17.646-14.354,32-32,32h-21.333     c-5.896,0-10.667-4.771-10.667-10.667V202.667z M106.667,224c0-17.646,14.354-32,32-32s32,14.354,32,32v64     c0,5.896-4.771,10.667-10.667,10.667c-5.896,0-10.667-4.771-10.667-10.667v-10.667H128V288c0,5.896-4.771,10.667-10.667,10.667     c-5.896,0-10.667-4.771-10.667-10.667V224z"/><path d="M74.667,405.333h320c5.896,0,10.667-4.771,10.667-10.667c0-5.896-4.771-10.667-10.667-10.667h-320     C68.771,384,64,388.771,64,394.667C64,400.563,68.771,405.333,74.667,405.333z"/><path d="M330.667,213.333h64c5.896,0,10.667-4.771,10.667-10.667S400.563,192,394.667,192h-64     c-5.896,0-10.667,4.771-10.667,10.667S324.771,213.333,330.667,213.333z"/><path d="M330.667,277.333h64c5.896,0,10.667-4.771,10.667-10.667S400.563,256,394.667,256h-64     c-5.896,0-10.667,4.771-10.667,10.667S324.771,277.333,330.667,277.333z"/><path d="M330.667,341.333h64c5.896,0,10.667-4.771,10.667-10.667c0-5.896-4.771-10.667-10.667-10.667h-64     c-5.896,0-10.667,4.771-10.667,10.667C320,336.563,324.771,341.333,330.667,341.333z"/><path d="M426.667,0h-384C19.146,0,0,19.135,0,42.667v384c0,23.531,19.146,42.667,42.667,42.667h384     c23.521,0,42.667-19.135,42.667-42.667v-384C469.333,19.135,450.188,0,426.667,0z M138.667,42.667     c5.891,0,10.667,4.775,10.667,10.667c0,5.891-4.776,10.667-10.667,10.667S128,59.224,128,53.333     C128,47.441,132.776,42.667,138.667,42.667z M96,42.667c5.891,0,10.667,4.775,10.667,10.667C106.667,59.224,101.891,64,96,64     s-10.667-4.776-10.667-10.667C85.333,47.441,90.109,42.667,96,42.667z M53.333,42.667C59.224,42.667,64,47.441,64,53.333     C64,59.224,59.224,64,53.333,64s-10.667-4.776-10.667-10.667C42.667,47.441,47.443,42.667,53.333,42.667z M426.667,426.667h-384     v-320h384V426.667z"/></svg>`;

    const style = document.createElement("style");
    document.head.appendChild(style);
    style.type = "text/css";
    style.innerHTML =
        `.animation {
             max-height: 300px;
             overflow: hidden;
             transition: max-height 0.3s;
         }
         .hide {
             max-height: 0px;
         }
         .icon {
             width: 13px;
             height: 29px;
         }
         .drop {
             position: relative;
         }
         .menu {
             width: 275px;
             height: 250px;
             left: -37px !important;
             top: 35px;
         }
         .option {
             height: 25px;
         }
         .name {
             margin-left: 15px;
         }
         .select {
             position: absolute;
             right: 10px;
         }
         .toggle {
             color: hsla(90, 39%, 47%, 1);
         }`;

    window.addEventListener("load", init);

    function init() {
        getFeature();
        getCopies();
        getEntered();
        getForum();
        getAd();
        createButton();
    }

    function getFeature(retry = 0) {
        // check
        const feature = document.querySelector(".featured__container:not(.animation)");
        if (!feature && retry < 5) {
            setTimeout(() => {
                getFeature(retry++);
            }, 500);
            return;
        }
        // animation
        feature.className = "featured__container feature animation";
        // initialization
        if (GM_getValue("feature", false) && !(window.location.href.includes("giveaway") && !window.location.href.includes("giveaways"))) {
            feature.classList.add("hide");
        }
    }

    function getCopies(retry = 0) {
        // check
        const copies = document.querySelector(".pinned-giveaways__outer-wrap:not(.animation)");
        if (!copies && retry < 5) {
            setTimeout(() => {
                getCopies(retry++);
            }, 500);
            return;
        }
        // animation
        copies.className = "copies animation";
        // initialization
        if (GM_getValue("copies", false) && !(window.location.href.includes("giveaway") && !window.location.href.includes("giveaways"))) {
            copies.classList.add("hide");
        }
    }

    function getEntered(retry = 0) {
        // check
        const entered = [...document.querySelectorAll(".giveaway__row-outer-wrap:not(.animation)")].filter(giveaway => giveaway.children[0].className.includes("is-faded"));
        if (!entered.length && retry < 5) {
            setTimeout(() => {
                getEntered(retry++);
            }, 500);
            return;
        }
        // animation
        entered.forEach(enter => {
            enter.className = "entered animation";
            // initialization
            if (GM_getValue("entered", false) && !(window.location.href.includes("giveaway") && !window.location.href.includes("giveaways"))) {
                enter.classList.add("hide");
            }
        });
    }

    function getForum(retry = 0) {
        // check
        const forum = document.querySelector(".widget-container--margin-top:not(.animation)");
        if (!forum && retry < 5) {
            setTimeout(() => {
                getForum(retry++);
            }, 500);
            return;
        }
        // animation
        forum.className = "forum animation";
        // initialization
        if (GM_getValue("forum", false) && !(window.location.href.includes("giveaway") && !window.location.href.includes("giveaways"))) {
            forum.classList.add("hide");
        }
    }

    function getAd(retry = 0) {
        // check
        const ad1 = document.querySelector(".sidebar__mpu");
        const ad2 = document.querySelectorAll("body script[async]");
        if ((!ad1 || !ad2.length) && retry < 5) {
            setTimeout(() => {
                getAd(retry++);
            }, 500);
            return;
        }
        // class
        ad1.classList.add("ad");
        ad2.forEach(ad => {
            ad.parentElement.classList.add("ad");
        });
        // initialization
        if (GM_getValue("ad", false) && !(window.location.href.includes("giveaway") && !window.location.href.includes("giveaways"))) {
            ad1.remove();
            ad2.forEach(ad => {
                ad.parentElement.remove();
            });
        }
    }

    function createButton(retry = 0) {
        const parent = document.querySelector(".nav__right-container");
        // check
        if (!parent && retry < 5) {
            setTimeout(() => {
                createButton(retry++);
            }, 500);
            return;
        }
        // button
        const button = parent.firstElementChild.cloneNode(false);
        parent.insertBefore(button, parent.firstElementChild);
        // icon
        const icon = document.createElement("div");
        icon.className = "nav__button fa icon";
        icon.innerHTML = svgMenu;
        button.appendChild(icon);
        // next function
        createMenu(button);
    }

    function createMenu(button) {
        // drop
        const drop = document.createElement("div");
        drop.classList.add("drop");
        button.appendChild(drop);
        // menu
        const menu = document.createElement("div");
        menu.className = "nav__absolute-dropdown menu animation hide";
        drop.appendChild(menu);
        // onButton
        let onButton = false;
        button.addEventListener("mouseenter", () => { onButton = true; });
        button.addEventListener("mouseleave", () => { onButton = false; });
        // onMenu
        let onMenu = false;
        menu.addEventListener("mouseenter", () => { onMenu = true; });
        menu.addEventListener("mouseleave", () => { onMenu = false; });
        // event
        button.addEventListener("click", () => {
            if (onMenu) return;
            menu.classList.toggle("hide");
        });
        document.body.addEventListener("click", () => {
            if (onMenu || onButton || menu.className.includes("hide")) return;
            menu.classList.toggle("hide");
        });
        // next function
        createOption(menu);
    }

    function createOption(menu) {
        singleOption(menu, svgFeature, "Feature Giveaway", "feature");
        singleOption(menu, svgCopies, "50+ Copies Giveaway", "copies");
        singleOption(menu, svgEntered, "Entered Giveaway", "entered");
        singleOption(menu, svgForum, "Forum", "forum");
        singleOption(menu, svgAd, "Advertisement<br/><span style='font-size:50%;color:red'>Need to refresh page.<span>", "ad");
    }

    function singleOption(menu, svg, strName, gmKey) {
        // option
        const option = document.createElement("div");
        option.className = "nav__row option";
        option.innerHTML = svg;
        menu.appendChild(option);
        // name
        const name = document.createElement("div");
        name.className = "nav__row__summary__name name";
        name.innerHTML = strName;
        option.appendChild(name);
        // select
        const select = document.createElement("div");
        const status = GM_getValue(gmKey, false) ? "form__checkbox cb__yes is-selected" : "form__checkbox cb__yes is-disabled";
        select.className = `${status} select`;
        option.appendChild(select);
        // default
        const toggle1 = document.createElement("i");
        toggle1.className = "form__checkbox__default fa fa-circle-o";
        select.appendChild(toggle1);
        // hover
        const toggle2 = document.createElement("i");
        toggle2.className = "form__checkbox__hover fa fa-circle";
        select.appendChild(toggle2);
        // selected
        const toggle3 = document.createElement("i");
        toggle3.className = "form__checkbox__selected fa fa-check-circle toggle";
        toggle3.style.color = "hsla(90, 39%, 47%, 1)";
        select.appendChild(toggle3);
        // event
        option.addEventListener("click", () => { saveChange(select, gmKey); });
    }

    function saveChange(select, key) {
        // gm
        select.classList.toggle("is-selected");
        select.classList.toggle("is-disabled");
        GM_setValue(key, !GM_getValue(key, false));
        // toggle
        document.querySelectorAll(`.${key}`).forEach(target => {
            if (key === "ad") {
                target.remove();
            } else {
                target.classList.toggle("hide");
            }
        });
    }

})();
