// ==UserScript==
// @name         Theme - Cherry Blossom
// @namespace    Custom Theme
// @version      1.1
// @description  Custom Cherry Blossom Theme for ShellShock.io
// @author       slimy0686
// @license      MIT
// @match        https://shellshock.io/*
// @match        https://dev.shellshock.io/*
// @grant        none
// @icon         https://raw.githubusercontent.com/darkstalkerl/Shell-Shocker-Themes/main/cherry_blossom_icon.webp
// @downloadURL https://update.greasyfork.org/scripts/534077/Theme%20-%20Cherry%20Blossom.user.js
// @updateURL https://update.greasyfork.org/scripts/534077/Theme%20-%20Cherry%20Blossom.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // URL of the custom background image
  const backgroundImageURL = 'https://raw.githubusercontent.com/darkstalkerl/Shell-Shocker-Themes/main/cherry_blossom_wallpaper2.webp';

  const addScript = () => {
    console.log("Applying Cherry Blossom theme...");
    document.title = "Cherry Blossom Theme";

    // Inject the custom styles
    document.head.innerHTML += `<style>
      /* General Background */
      #ss_background {
        background: url('${backgroundImageURL}') no-repeat center center fixed !important;
        background-size: cover !important;
      }

      /* Custom Colors and Variables */
      * {
        --ss-lightoverlay: url('${backgroundImageURL}');
        --ss-popupbackground: url('${backgroundImageURL}');
        --ss-red: #d15354;
        --ss-pink: #EC008C;
        --ss-blue1: #f8a3b1;
        --ss-blue2: #f68da2;
        --ss-green1: #13BA65;
        --ss-orange1: #F79520;
      }

      /* In-game Crosshair */
      .crosshair {
        position: absolute;
        transform-origin: 50% top;
        top: 50%;
        border: solid 0.05em black;
        height: 0.8em;
        margin-bottom: 0.12em;
        opacity: 100;
      }

      .crosshair.normal {
        background: #f06cbb !important;
        border-color: #c95199 !important;
        height: 7px;
        width: 7px;
        opacity: 0.8;
      }

      .crosshair.powerful {
        left: calc(50% - 0.25em);
        background: #ff0000;
        width: 0.5em;
      }

      #reticleDot {
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        background: #ffffff;
        border: solid 0.01em #ffffff;
        width: 0.1em;
        height: 0.1em;
        opacity: 0.7;
      }

      /* Chat and Pause Menu Adjustments */
      .is-paused .pause-ui-element {
        background-color: #00000000 !important;
        border: var(--ss-common-border-width) solid var(--ss-blue5);
        bottom: 0;
        width: var(--ss-chat-wrapper-width);
        height: var(--ss--chat-height);
        left: 0;
      }

      /* Grenade Throw Indicator */
      #grenadeThrowContainer {
        position: absolute;
        display: flex;
        visibility: hidden;
        align-items: flex-end;
        top: 50%;
        left: 50%;
        transform: translate(-6em, -3em);
        width: 1em;
        height: 6em;
        background: #9da7bd !important;
        border-radius: 0.3em;
        padding: 0.25em;
      }

      #grenadeThrow {
        width: 100%;
        height: 50%;
        border-radius: 0.05em;
        background: linear-gradient(0deg, rgba(255, 249, 253, 1), rgba(255, 232, 245, 1), rgba(255, 208, 233, 1), rgba(253, 188, 223, 1), rgba(253, 188, 212, 1), rgba(255, 140, 201, 1), rgba(255, 112, 188, 1), rgba(252, 87, 175, 1)) !important;
      }
    </style>`;
  };

  // Apply styles when DOM is ready
  document.body ? addScript() : document.addEventListener("DOMContentLoaded", addScript);
})();