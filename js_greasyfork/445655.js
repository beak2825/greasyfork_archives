// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  something for penguin idk lmao
// @author       You
// @match        https://www.nitrotype.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445655/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/445655/New%20Userscript.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // ywes i knwow this cwode is pwoowly writtwen it was intentwional uwu

    var datastuff = JSON.parse(sessionStorage.getItem("modDataJunk")??"{}")

    var travis = document.createElement("div");
    travis.classList.add("traviiiiis");
    travis.innerHTML = `<input type="number">
    <select><option value="opacity">disappearing text</option><option value="rotation">rotation</option></select>`;
    document.body.appendChild(travis);

    travis.onclick = (sussy) => sussy.preventDefault()

    var modeee = travis.getElementsByTagName("select")[0]
    modeee.value = datastuff.selected || "opacity";
    modeee.oninput = updateCss;

    var speedthing = travis.getElementsByTagName("input")[0];
    speedthing.value =  datastuff[modeee.value] ?? (modeee.value == "opacity" ? 5 : 1);
    speedthing.oninput = updateCss;

    var link = document.createElement("style");
    link.innerHTML = `
      .traviiiiis {
        position: fixed;
        width: 250px;
        height: 100px;
        background-color: red;
        top: 0;
        overflow: hidden;
        margin-top: 5px;
        margin-left: 5px;
        padding: 5px;
      }

      .traviiiiis:not(.shOwO) {
        display: none;
      }

      .traviiiiis input {
      width: 75px;
      }
    `;
    document.head.appendChild(link);

    document.addEventListener(`keydown`, uwu => {
        if(uwu.keyCode == "27"){
            travis.classList.toggle("shOwO");
        }
    });

    var scwipt = document.createElement("style");
    function updateCss() {
        var mode = modeee.value;

        datastuff.selected = mode
        datastuff[mode] = speedthing.value

        sessionStorage.setItem("modDataJunk", JSON.stringify(datastuff))

        if (mode == "opacity"){
    scwipt.innerHTML = `
      .dash-letter:not(.is-waiting, .is-incorrect, .is-typed) {
        animation: ${speedthing.value}s linear infinite hide;
      }

      @keyframes hide {
        0% {
          filter: opacity(0);
        }

        25% {
          filter: opacity(1);
        }

        50% {
          filter: opacity(0);
        }

        100% {
          filter: opacity(0);
        }
      }
    `;
        } else {
            scwipt.innerHTML = `
            .dash-letter {
                    transition: transform 0.75s;}

                  .dash-word {
        /*transform: rotate(180deg);*/
        animation: ${speedthing.value}s linear infinite rotate
      }

      @keyframes rotate {
        from { transform: rotate(0deg) } to { transform: rotate(360deg) }
      }
            `;
        }
    }
    document.head.appendChild(scwipt);

    updateCss()
})();