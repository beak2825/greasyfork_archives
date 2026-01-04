// ==UserScript==
// @name        Sploop.io Hack | Background Filter Changer, (Menu On "B" Key)
// @version     0.1
// @description A Friendly Script That Customize your Game Background
// @author      DETIX aka D.Roy || discord => detixthegoat
// @match       *://*.sploop.io/*
// @license     CC-BY 4.0
// @namespace https://greasyfork.org/users/684614
// @downloadURL https://update.greasyfork.org/scripts/472472/Sploopio%20Hack%20%7C%20Background%20Filter%20Changer%2C%20%28Menu%20On%20%22B%22%20Key%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472472/Sploopio%20Hack%20%7C%20Background%20Filter%20Changer%2C%20%28Menu%20On%20%22B%22%20Key%29.meta.js
// ==/UserScript==

const __fli4p = `
  #__ro8h3-__utkp {
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 10px;
    color: white;
    z-index: 9999;
    display: none;
    border-radius: 5px;
    font-family: "Arial", sans-serif;
  }
  #__ro8h3-__utkp label {
    margin-right: 10px;
  }
  #__ro8h3-__utkp input[type="range"] {
    width: 150px;
    margin-right: 10px;
  }
  #__ro8h3-__utkp button {
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
`;
const __bliq3 = `
  <div id="__ro8h3-__utkp">
    <label for="__ekl4j__ero4"><sub><strong>By DETIX</strong></sub></label>
    <input type="range" id="__ekl4j__ero4" min="0" max="100" step="10" value="0">
    <span id="__rki3v__elo4">0</span>%
    <button id="__epo9c__ekro5">Reset Filter</button>
    <button id="__akos58">Close Menu</button>
  </div>
`;
document.head.insertAdjacentHTML("beforeend", `<style>${__fli4p}</style>`);
document.body.insertAdjacentHTML("beforeend", __bliq3);
const __akos58 = document.getElementById("__akos58");
__akos58.addEventListener("click", () => {
    const __duk1h = document.getElementById("__ro8h3-__utkp");
    __duk1h.style.display = "none";
});
const __num2h = (value, __mol6f) => {
    if (__mol6f) {
        if (value === "50") {
            __mol6f.style.filter = "";
        } else {
            __mol6f.style.filter = `invert(${value}%) hue-rotate(180deg)`;
            __mol6f.style.backgroundColor = "";
        }
    }
};
document.addEventListener("keydown", (event) => {
    if (event.key === "b" || event.key === "B") {
        const __duk1h = document.getElementById("__ro8h3-__utkp");
        __duk1h.style.display = __duk1h.style.display === "none" ? "block" : "none";
        if (__duk1h.style.display === "block") {
            const __ekl4j__ero4 = document.getElementById("__ekl4j__ero4");
            const __rki3v__elo4 = document.getElementById("__rki3v__elo4");
            __ekl4j__ero4.addEventListener("input", () => {
                const value = __ekl4j__ero4.value;
                __rki3v__elo4.textContent = value;
                __num2h(value, document.getElementById("game-canvas"));
            });
            const __epo9c__ekro5 = document.getElementById("__epo9c__ekro5");
            __epo9c__ekro5.addEventListener("click", () => {
                const __mol6f = document.getElementById("game-canvas");
                __mol6f.style.filter = "";
                __ekl4j__ero4.value = "50";
                __rki3v__elo4.textContent = "50";
            });
        }
    }
});
//whats up??
__num2h(0, document.getElementById("game-canvas"));