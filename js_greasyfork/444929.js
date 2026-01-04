// ==UserScript==
// @name         Kahoot! QOL
// @namespace    https://flawcra.cc/
// @version      1.0.3-GitHub
// @description  Improves the Quality of Life on Kahoot!
// @author       FlawCra
// @license      Apache License 2.0
// @match        https://kahoot.it/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://kahoot.it&size=256
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444929/Kahoot%21%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/444929/Kahoot%21%20QOL.meta.js
// ==/UserScript==
const rainbow_anim_text = `
        .rainbow_bg {
          height: 100% !important;
          width: 100% !important;
          left:0 !important;
          right: 0 !important;
          top: 0 !important;
          bottom: 0 !important;
          position: absolute !important;
          background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3) !important;
          background-size: 1800% 1800% !important;

          animation: rainbow_bg 18s ease infinite !important;
        }`;
const rainbow_keyframes_text = `
        @keyframes rainbow_bg {
            0%{background-position:0% 82%}
            50%{background-position:100% 19%}
            100%{background-position:0% 82%}
        } !important;`;
const cube_anim_text = `
        .cube_animation {
          animation: 8s ease-in-out 0s infinite alternate none running cube_animation !important;
        }`;
const cube_keyframes_text = `
        @keyframes cube_animation {
            0% {
              translate: -5vw 2vh 0px;
            }
            50% {
              translate: 0px 0px 0px;
            }
            100% {
              translate: -5vw -2vh 0px;
            }
        }`;
const circle_anim_text = `
        .circle_animation {
          animation: 6s ease-in-out 0s infinite alternate none running circle_animation !important;
        }`;
const circle_keyframes_text = `
        @keyframes circle_animation {
            0% {
              translate: 0px 0px 0px;
            }
            50% {
              translate: -5vw -2vh 0px;
            }
            100% {
              translate: 0px 0px 0px;
            }
        }`;

(function() {
    'use strict';
    setTimeout(function() {
        var wrppr = document.createElement("div");
        wrppr.setAttribute("id","rainbow-bg");
        var rainbow_anim = document.createElement("style");
        rainbow_anim.innerHTML = rainbow_anim_text;

        var rainbow_keyframes = document.createElement("style");
        rainbow_keyframes.innerHTML = rainbow_keyframes_text;

        var cube_anim = document.createElement("style");
        cube_anim.innerHTML = cube_anim_text;

        var cube_keyframes = document.createElement("style");
        cube_keyframes.innerHTML = cube_keyframes_text;

        var circle_anim = document.createElement("style");
        circle_anim.innerHTML = circle_anim_text;

        var circle_keyframes = document.createElement("style");
        circle_keyframes.innerHTML = circle_keyframes_text;


        document.head.appendChild(rainbow_anim);
        document.head.appendChild(rainbow_keyframes);
        document.head.appendChild(cube_anim);
        document.head.appendChild(cube_keyframes);
        document.head.appendChild(circle_anim);
        document.head.appendChild(circle_keyframes);
        document.querySelector(`#root > div:nth-of-type(1) > div:nth-of-type(1)`).classList.add("rainbow_bg")
        document.querySelector(`#root > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)`).classList.add("rainbow_bg");
        document.querySelector(`#root > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)`).classList.add("cube_animation");
        document.querySelector(`#root > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)`).classList.add("circle_animation");
    }, 0);

    setInterval(() => {
      if(document.getElementById("nickname")) document.getElementById("nickname").focus();
      if(document.querySelector(`[data-functional-selector='game-pin-input']`)) document.querySelector(`[data-functional-selector='game-pin-input']`).focus();
    }, 250);

    document.addEventListener("keydown", (ev) => {
      var el = document.querySelector(`[data-functional-selector='answer-${ev.keyCode-49}']`);
      if(el) el.click();
      if(ev.keyCode===13) document.querySelector(`[data-functional-selector='multi-select-submit-button']`).click();
    });
})();
