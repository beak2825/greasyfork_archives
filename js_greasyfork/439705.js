// ==UserScript==
// @name         Shirley Theme Overhaul
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A theme for the shirley portal.
// @author       You
// @match        https://shirley.instructure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @license      MIT
// @grant        none
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/439705/Shirley%20Theme%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/439705/Shirley%20Theme%20Overhaul.meta.js
// ==/UserScript==

function getFirstClass(className) {
  return document.getElementsByClassName(className)[0];
}

(function() {
  'use strict';

  var cssAppend = document.createElement('link');

  cssAppend.setAttribute("rel", "stylesheet");
  cssAppend.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
  cssAppend.setAttribute("integrity", "sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==");
  cssAppend.setAttribute("crossorigin", "anonymous");
  cssAppend.setAttribute("referrerpolicy", "no-referrer");

  document.head.appendChild(cssAppend);



  onLoad();


  function onLoad() {

    var overhaulPanel = document.createElement('div');



    overhaulPanel.innerHTML = `

    <div id="overhaulPanelWrapper">
      <div id="overhaulPanelCover">
        <span id="overhaulPanelBackgroundCoverGradient"></span>
        <h1>Thank you for installing S-Overhaul.</h1>
        <h3>Designed by Nico Cook</h3>
        <br />

        <button class="overhaulButton" onmousedown='document.getElementById("overhaulPanelWrapper").style.transform = "translateX(-100vw)"'>Go Back</button>
        <br />



        <select id="overhaulThemePicker" class="dropdownMenu overhaulThemePicker" name="theme">
          <option value="default">Default Theme</option>
          <option value="1020-day">1020 Day</option>
          <option value="1020-night">1020 Night</option>
          <option value="open-era">Open Era</option>
          <option value="asa-square">Asa Square</option>
          <option value="shades-of-dim">Shades of Dim</option>
          <option value="default-overhaul">Default Overhaul</option>
        </select>
        <p class="tooltipOverhaul">Overhaul Theme Picker</p>

        <div id="githubLinkInOverhaulPanel">
          <a class="aButton" id="checkGithubOnPanel" href="https://github.com/nebula-developer">Check out my GitHub <i class="fa fa-arrow-down paddingLeftFromCheckGithub"></i></a>
        </div>

        <div id="footerInOverhaulPanel" style="cursor: pointer !important;" onmouseup="location.href = 'https://github.com/nebula-developer'">
          <img style="width: 30px; margin-right: 10px; height: 30px" src="https://avatars.githubusercontent.com/u/96085977">
          <p id="footerInPanelText">Made by Nico Cook</p>
        </div>

      </div>
    </div>


    <style>
      :root {
        --main-button-color: rgb(40, 40, 40);
      }

      .paddingLeftFromCheckGithub {
        padding-left: 2px;
      }

      #checkGithubOnPanel {
        margin-top: 10px;

        text-align: center;
        transform: translateY(18px);

        color: lightgrey;
        text-decoration: none;
      }

      #githubLinkInOverhaulPanel {
        display: flex;
        text-align: center;
        justify-content: center;

        margin-top: 30px;
      }

      #footerInOverhaulPanel {
        width: 100%;
        justify-content: center;
        display: flex;

        margin-top: 30px;
      }

      #footerInPanelText {
        transform: translateY(-10px);

        pointer-events: none;
      }

      .overhaulThemePicker {
        margin-top: 30px;
        background-color: rgba(235, 235, 255, 1);
        border: none;
        outline: none;

        border-radius: 100px;
        text-align: center;

        transition: background-color 0.3s;
      }

      .overhaulThemePicker:hover {
        background-color: rgba(215, 215, 215, 1);
      }

      .#tooltipOverhaul {
        margin-top: -5px;
      }

      .overhaulThemePicker:focus {
        border: none;
        outline: none;

        background-color: rgba(215, 215, 235, 1);
      }

      .overhaulButton {
        outline: none;
        border: none;

        min-width: 150px;
        min-height: 40px;

        color: white;
        font-size: 20px;

        border-radius: 100px;

        background-color: darkcyan;
        transition: background-color 0.3s;
      }

      .overhaulButton:hover {
        background-color: rgb(140, 140, 140);
      }

      .overhaulSmallCircleButton {
        text-align: center;
        display: block;

        outline: none;
        border: none;

        background-color: transparent;

        width: 50px;
        height: 50px;

        border-radius: 40px;
      }

      .overhaulButtonWrapper {
        width: 100%;
        height: 40px;

        display: flex;
        justify-content: center;
        align-items: center;

        text-align: center;

        transition: background-color 0.5s;

        cursor: pointer;
      }

      .overhaulButtonWrapper:hover {
        background-color: rgba(0,0,0,.2);
      }


      #overhaulPanelWrapper {
        transform: translateY(-24px);

        color: white;
        display: none;

        overflow: hidden;
        width: 100vw;
        height: 100vh;

        max-height: 100vh;
        max-width: 100vw;

        z-index: 1000 !important;
        top: 0;

        text-align: center;
        display: flex;

        padding-top: 40px;
        justify-content: center;
        align-items: center;

        transition: transform 0.5s ease;
        transform: translateX(-100vw);

        position: fixed;
        background: radial-gradient(rgb(57,5,88), rgb(7,75,88));

        font-weight: 500 !important;
        animation: animatePanelBG 5s;
        animation-iteration-count: infinite;
      }

      #overhaulPanelCover {

      }

      .overhaulBarsSidebar {
        font-size: 25px;
      }

      #overhaulPanelBackgroundCoverGradient {
        transform: translateY(-24px);

        color: white;

        width: 100vw;
        height: 100vh;

        max-height: 100vh;
        max-width: 100vw;

        z-index: 1000 !important;

        top: 25px;
        left: 0;

        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        overflow-y: hidden !important;
        background: radial-gradient(transparent, rgb(170 62 205 / 81%));

        pointer-events: none;
      }

      @keyframes animatePanelBG {
        0% {
          background: rgb(7,75,88);
        }
        50% {
          background: rgb(57,5,88);
        }
        100% {
          background: rgb(7,75,88);
        }
      }
    </style>

    `
    document.body.insertBefore(overhaulPanel, document.body.firstChild);


    var sidebarButtonWrapper = document.createElement('div');
    sidebarButtonWrapper.innerHTML = `
    <button class="overhaulSmallCircleButton"><i style="color: white" class="fa fa-bars overhaulBarsSidebar" aria-hidden="true"></i></button>
    `;
    sidebarButtonWrapper.setAttribute("title", "Open the Overhaul Menu");
    sidebarButtonWrapper.classList.add("overhaulButtonWrapper");
    sidebarButtonWrapper.setAttribute("onmousedown", "document.getElementById(\"overhaulPanelWrapper\").style.transform = \"translateX(0)\"");

    document.getElementsByClassName("ic-app-header__main-navigation")[0].appendChild(sidebarButtonWrapper);


    var menuButtonWrapper = document.createElement('a');
    menuButtonWrapper.setAttribute("style", "cursor:pointer");
    menuButtonWrapper.innerText = "Overhaul Menu";
    menuButtonWrapper.setAttribute("mousedown", "document.getElementById(\"overhaulPanelWrapper\").style.transform = \"translateX(0)\"");

    try {
      document.getElementById("footer-links").insertBefore(menuButtonWrapper, document.getElementById("footer-links").firstChild);
    }
    catch (error) {

    }




    var panelWrapper = document.getElementById("overhaulPanelWrapper");
    var bgColorPicker = document.getElementById("overhaulThemePicker");


    var globalRootDefining = document.createElement('style');
    globalRootDefining.id = "globalOverhaulRootTheme";

    document.onload = loadTheme();

    document.getElementById("overhaulThemePicker").value = localStorage.getItem("overhaulTheme")

    function day_1020() {
      globalRootDefining.innerHTML = `
      :root {
        --ic-link-color: #8b93b2;
        --ic-brand-primary: #b081ac;
        --ic-brand-global-nav-bgd: #7092aa;
        --eHiXd-linkColor: #737149;
      }

      .ic-Dashboard-header__layout {
        border-radius: 10px;
      }

      .ic-DashboardCard {
        box-shadow: 0 2px 5px rgb(0 26 255 / 30%);
      }

      .hidden-phone {
        margin-left: 10px;
        color: #bed599;
      }

      #dashboard {
        border-radius: 10px;
        background-color: #e3e3ff;
        overflow: hidden;

        padding: 20px;
        margin-top: -3px;
      }

      .ic-app-footer__links a {
        color: #6ea9d3;
      }

      .Button--icon-action-rev {
        color: #45d3ff;
        filter: drop-shadow(0 0 5px black);
      }

      #right-side-wrapper {
        border-radius: 20px;
        background-color: #ffe8cc;
        margin: 20px;
      }

      .ic-app-header__logomark-container {
        display: none;
      }

      .button-sidebar-wide {
        background: #dfc7a0;
        border-radius: 7px;

        color: white;
        border: none;

        transition: 0.2s;

        z-index: 5 !important;
      }

      .ic-DashboardCard {
        border-radius: 10px;
        padding: 20px;

        transition: transform 0.5s ease, padding 0.5s ease;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_hero {
        border-radius: 40px;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_image {
        border-radius: 40px;
      }

      .ic-DashboardCard:hover {
        padding: 30px;
        overflow: hidden;
      }

      .ic-DashboardCard__header_content {
        height: 100px;
      }

      .ic-DashboardCard__header_hero {
        border-radius: 30px;
        overflow: hidden;

        background: transparent;
        filter: none;

        background: radial-gradient(transparent, #7c8ecd) !important;
        opacity: 0.4;

        transition: border-radius 0.5s ease;
      }

      .ic-DashboardCard__header-title {
        color: grey !important;
      }

      .ic-DashboardCard__header_image {
        border-radius: 30px;
        overflow: hidden;
        filter: none;

        transition: border-radius 0.5s ease;
      }

      .button-sidebar-wide:hover {
        background-color: #ffc797;
      }
      `

      document.body.appendChild(globalRootDefining);
    }

    function night_1020() {
      globalRootDefining.innerHTML = `
      :root {
        --ic-link-color: #4a3f6b;
        --ic-brand-primary: #6b8ec4;
        --ic-brand-global-nav-bgd: #404040;
        --eHiXd-linkColor: #ffffff;
      }

      .ic-Dashboard-header__layout {
        border-radius: 10px;
      }

      .ic-DashboardCard {
        background-color: #f1e6ff;
        box-shadow: 0 2px 5px rgb(0 26 255 / 30%);
      }

      .ic-DashboardCard__header_content {
        background-color: transparent;
      }

      .hidden-phone {
        margin-left: 10px;
        color: #7a557a;
      }

      #courseMenuToggle {
        color: rgba(0, 0, 0, 0.4);
        margin-bottom: 5px;
      }

      .ellipsible {
        color: rgba(0, 0, 0, 0.4);
      }

      #dashboard {
        border-radius: 10px;
        background-color: #6a6a7c;
        overflow: hidden;

        padding: 20px;
        margin-top: -3px;
      }

      .ic-app-footer__links a {
        color: #6ea9d3;
      }

      .Button--icon-action-rev {
        color: #ffffff;
        filter: drop-shadow(0 0 5px black);
      }

      #right-side-wrapper {
        border-radius: 20px;
        background-color: #b4c8cd;
        margin: 20px;
      }

      .ic-app-header__logomark-container {
        display: none;
      }

      #menu {
        background-color: #46475e;
      }

      .button-sidebar-wide {
        background: #687476;
        border-radius: 7px;

        color: white;
        border: none;

        transition: 0.2s;

        z-index: 5 !important;
      }

      img {
        color: grey;
      }

      .ic-DashboardCard {
        border-radius: 10px;
        padding: 20px;

        transition: transform 0.5s ease, padding 0.5s ease;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_hero {
        border-radius: 40px;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_image {
        border-radius: 40px;
      }

      .ic-DashboardCard:hover {
        padding: 30px;
        overflow: hidden;
      }

      .ic-DashboardCard__header_content {
        height: 100px;
      }

      .ic-DashboardCard__header_hero {
        border-radius: 30px;
        overflow: hidden;

        background: transparent;
        filter: none;

        background: radial-gradient(transparent, #7c8ecd) !important;
        opacity: 0.4;

        transition: border-radius 0.5s ease;
      }

      .ic-DashboardCard__header_image {
        border-radius: 30px;
        overflow: hidden;
        filter: none;

        transition: border-radius 0.5s ease;
      }

      .button-sidebar-wide:hover {
        background-color: #7f7e9d;
      }
      `

      document.body.appendChild(globalRootDefining);
    }

    function open_era() {
      globalRootDefining.innerHTML = `
      :root {
        --ic-link-color: #000000;
        --ic-brand-primary: #d1d1d1;
        --ic-brand-global-nav-bgd: #5e6f81;
        --eHiXd-linkColor: #ffffff;
      }

      .ic-Dashboard-header__layout {
        border-radius: 10px;
      }

      .ic-DashboardCard {
        box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
      }

      .hidden-phone {
        margin-left: 10px;
        color: #bed599;
      }

      #dashboard {
        border-radius: 35px;
        background-color: #9f9f9f1c;
        overflow: hidden;

        padding: 50px;
        margin-top: -3px;
      }

      .ic-app-footer__links a {
        color: #6ea9d3;
      }

      .Button--icon-action-rev {
        color: #45d3ff;
      }

      #right-side-wrapper {
        border-radius: 61px;
        background-color: #b3b4cb0d;
        margin: 17px;
      }

      .ic-app-header__logomark-container {
        display: none;
      }

      .button-sidebar-wide {
        background: #8e93b1;
        border-radius: 7px;

        color: white;
        border: none;

        transition: 0.2s;

        z-index: 5 !important;
      }

      .ic-DashboardCard {
        border-radius: 10px;
        padding: 10px;

        transition: transform 0.5s ease, padding 0.5s ease;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_hero {
        border-radius: 5px;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_image {
        border-radius: 5px;
      }

      .ic-DashboardCard:hover {
        padding: 20px;
        overflow: hidden;
      }

      .ic-DashboardCard__header_hero {
        border-radius: 0px;
        overflow: hidden;

        background: transparent;
        filter: none;

        background: radial-gradient(transparent, #7c8ecd) !important;
        opacity: 0.4;

        transition: border-radius 0.5s ease;
      }

      .ic-DashboardCard__header_image {
        border-radius: 0px;
        overflow: hidden;
        filter: none;

        transition: border-radius 0.5s ease;
      }

      .button-sidebar-wide:hover {
        background-color: #aaa9d1;
      }

      li {
        color: grey !important;
      }

      span {
        color: grey !important;
      }

      h2 {
        color: grey !important;
      }

      small {
        color: grey !important;
      }
      `

      document.body.appendChild(globalRootDefining);
    }

    function asa_square() {
      globalRootDefining.innerHTML = `
      :root {
        --ic-link-color: #000000;
        --ic-brand-primary: #d1d1d1;
        --ic-brand-global-nav-bgd: #b2b2b2;
        --eHiXd-linkColor: #ffffff;
      }

      .ic-Dashboard-header__layout {

      }

      .ic-DashboardCard {
        box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
      }

      .hidden-phone {
        margin-left: 10px;
        color: #bed599;
      }

      #dashboard {
        background-color: #72a3974d;
        overflow: hidden;

        padding: 50px;
        margin-top: -3px;
      }

      .ic-app-footer__links a {
        color: #6ea9d3;
      }

      .Button--icon-action-rev {
        color: #45d3ff;
      }

      #right-side-wrapper {
        background-color: #b3b4cb2e;
        margin: 17px;
      }

      .ic-app-header__logomark-container {
        display: none;
      }

      .button-sidebar-wide {
        background: #8e93b1;

        color: white;
        border: none;

        transition: 0.2s;

        z-index: 5 !important;
      }

      .ic-DashboardCard {
        padding: 10px;

        transition: transform 0.5s ease, padding 0.5s ease;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_hero {
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_image {
      }

      .ic-DashboardCard__header_hero {
        overflow: hidden;

        background: transparent;
        filter: none;

        background: radial-gradient(transparent, #7c8ecd) !important;
        opacity: 0.4;

        transition: border-radius 0.5s ease;
      }

      .ic-DashboardCard__header_image {
        overflow: hidden;
        filter: none;
      }

      .button-sidebar-wide:hover {
        background-color: #aaa9d1;
      }

      li {
        color: black !important;
      }

      span {
        color: black !important;
      }

      h2 {
        color: black !important;
      }

      small {
        color: darkgrey !important;
      }

      body * {
        box-shadow: none !important;
        text-shadow: none !important;
        border: none !important;
        outline: none !important;
      }
      `

      document.body.appendChild(globalRootDefining);
    }

    function shades_of_dim() {
      globalRootDefining.innerHTML = `
      :root {
        --ic-link-color: #474747;
        --ic-brand-primary: #444444;
        --ic-brand-global-nav-bgd: #6a6a6a;
        --eHiXd-linkColor: #3d3d3d;
      }

      .ic-Dashboard-header__layout {
        border-radius: 10px;
      }

      .ic-DashboardCard {
        box-shadow: 0 2px 5px rgb(0 26 255 / 30%);
      }

      .ic-DashboardCard__header-subtitle {
        text-decoration: none !important;
      }

      .ic-DashboardCard__header-subtitle::after {
        display: none !important;
      }

      .ic-DashboardCard__header-title span {
        color: #525252 !important;
      }

      .hidden-phone {
        margin-left: 10px;
        color: white;
      }

      .ic-notification__content {
        background: #cdcdcd !important;
      }

      #DashboardOptionsMenu_Container span button {
        color: white;
      }

      #dashboard {
        border-radius: 10px;
        background-color: #9d9d9d;
        overflow: hidden;

        padding: 20px;
        margin-top: -3px;
      }

      .ic-app-footer__links a {
        color: #6ea9d3;
      }

      .Button--icon-action-rev {
        color: #d1d1d1;
        filter: drop-shadow(0 0 5px lightgrey);
      }

      #right-side-wrapper {
        border-radius: 5px;
        background-color: #cfcfcf;
        margin: 20px;
      }

      .ic-app-header__logomark-container {
        display: none;
      }

      .button-sidebar-wide {
        background: #8f8f8f;
        border-radius: 7px;

        color: white;
        border: none;

        transition: 0.2s;

        z-index: 5 !important;
      }

      #footer-links a {
        color: grey !important;
      }

      .button-sidebar-wide:hover {
        background-color: #b9b9b9;
      }

      .ic-DashboardCard {
        border-radius: 5px;
        padding: 20px;
        background: #dbdbdb;
        box-shadow: 0 2px 5px rgb(66 66 66 / 30%);

        transition: transform 0.5s ease, padding 0.5s ease;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_hero {
        border-radius: 5px;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_image {
        border-radius: 5px;
      }

      .ic-DashboardCard__header_content {
        height: 100px;
        background: transparent;
      }

      .ic-Dashboard-header__layout {
        background: rgb(187 187 187 / 95%);
        border-bottom: none !important;
      }

      .ic-DashboardCard__header_hero {
        border-radius: 5px;
        overflow: hidden;

        background: transparent;
        filter: none;

        background: radial-gradient(transparent, #7c8ecd) !important;
        opacity: 0.4;

        transition: border-radius 0.5s ease;
      }

      .ic-DashboardCard__header-title {
        color: grey !important;
      }

      .Button--primary {
        background: #303030 !important;
      }

      .ic-DashboardCard__header_image {
        border-radius: 5px;
        overflow: hidden;
        filter: none;

        transition: border-radius 0.5s ease;
      }
      `

      document.body.appendChild(globalRootDefining);
    }

    function default_overhaul() {
      globalRootDefining.innerHTML = `
      .ic-Dashboard-header__layout {
        border-radius: 10px;
      }

      .ic-DashboardCard__header-subtitle {
        text-decoration: none !important;
      }

      .ic-DashboardCard__header-subtitle::after {
        display: none !important;
      }

      .hidden-phone {
        margin-left: 10px;
      }

      #dashboard {
        overflow: hidden;

        padding: 5px;
        margin-top: -3px;
      }

      #right-side-wrapper {
        margin: 20px;
      }

      .ic-app-header__logomark-container {
        display: none;
      }

      .button-sidebar-wide {
        border-radius: 7px;

        border: none;

        transition: 0.2s;

        z-index: 5 !important;
      }

      .ic-DashboardCard {
        border-radius: 5px;
        padding: 7px;

        transition: transform 0.5s ease, padding 0.5s ease;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_hero {
        border-radius: 5px;
      }

      .ic-DashboardCard:hover .ic-DashboardCard__header_image {
        border-radius: 5px;
      }

      .ic-DashboardCard__header_content {
        height: 100px;
      }

      .ic-DashboardCard__header_hero {
        border-radius: 5px;
        overflow: hidden;

        filter: none;

        transition: border-radius 0.5s ease;
      }

      .ic-DashboardCard__header_image {
        border-radius: 5px;
        overflow: hidden;
        filter: none;

        transition: border-radius 0.5s ease;
      }
      `

      document.body.appendChild(globalRootDefining);
    }

    function loadTheme() {
      switch (localStorage.getItem("overhaulTheme")) {
        case "1020-day":
          day_1020();
          break;

        case "1020-night":
          night_1020();
          break;

        case "open-era":
          open_era();
          break;

        case "asa-square":
          asa_square();
          break;

        case "shades-of-dim":
          shades_of_dim();
          break;

        case "default-overhaul":
          default_overhaul();
          break;

        default:
          var rem = document.getElementById("globalOverhaulRootTheme");
          if (!rem) { break; }
          rem.parentNode.removeChild(rem);
          break;

      }
    }

    document.getElementById('overhaulThemePicker').onchange = (() => {localStorage.setItem('overhaulTheme', document.getElementById('overhaulThemePicker').value); document.getElementById("overhaulPanelWrapper").style.transform = "translateX(-100vw)"; loadTheme()});

    var removeDefaultFooter = document.createElement("style");
    removeDefaultFooter.innerHTML =`
    .footer-logo {
      display: none !important;
      opacity: 0 !important;
    }`
    document.body.insertBefore(removeDefaultFooter, document.body.firstChild);

    var logoNebulaDev = document.createElement("div");
      logoNebulaDev.setAttribute("style", "cursor: pointer; display: flex; height: 50px; align-items: center;")
      logoNebulaDev.onmousedown = (() => {location.href = "https://github.com/nebula-developer";})

    logoNebulaDev.innerHTML = `
      <img style="width: 30px; margin-right: 10px; height: 30px" src="https://avatars.githubusercontent.com/u/96085977">
      <p>Made by Nico Cook</p>
    `

    try {
      document.getElementById("footer").insertBefore(logoNebulaDev, document.getElementById("footer").firstChild);
    }
    catch (error) {

    }
  }

})();