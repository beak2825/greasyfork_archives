// ==UserScript==
// @name        Twitter/X Accent Picker
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.0
// @license     GPLv3
// @author      -
// @description 5/31/2024, 7:37:56 PM
// @downloadURL https://update.greasyfork.org/scripts/496672/TwitterX%20Accent%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/496672/TwitterX%20Accent%20Picker.meta.js
// ==/UserScript==

var RGBvalues = (function() {

    var _hex2dec = function(v) {
        return parseInt(v, 16)
    };

    var _splitHEX = function(hex) {
        var c;
        if (hex.length === 4) {
            c = (hex.replace('#','')).split('');
            return {
                r: _hex2dec((c[0] + c[0])),
                g: _hex2dec((c[1] + c[1])),
                b: _hex2dec((c[2] + c[2]))
            };
        } else {
             return {
                r: _hex2dec(hex.slice(1,3)),
                g: _hex2dec(hex.slice(3,5)),
                b: _hex2dec(hex.slice(5))
            };
        }
    };

    var _splitRGB = function(rgb) {
        var c = (rgb.slice(rgb.indexOf('(')+1, rgb.indexOf(')'))).split(',');
        var flag = false, obj;
        c = c.map(function(n,i) {
            return (i !== 3) ? parseInt(n, 10) : flag = true, parseFloat(n);
        });
        obj = {
            r: c[0],
            g: c[1],
            b: c[2]
        };
        if (flag) obj.a = c[3];
        return obj;
    };

    var color = function(col) {
        var slc = col.slice(0,1);
        if (slc === '#') {
            return _splitHEX(col);
        } else if (slc.toLowerCase() === 'r') {
            return _splitRGB(col);
        } else {
            console.log('!Ooops! RGBvalues.color('+col+') : HEX, RGB, or RGBa strings only');
        }
    };

    return {
        color: color
    };
}());

let newCol = localStorage.getItem("userscript-color") || "rgb(29, 155, 240)";

let isOnColorSettings = false;

const updatePage = (runInputUpdate = true) => {
    let prevFound = isOnColorSettings;
    let found = false;
    var allElems = document.querySelectorAll("*");

    for (const el of allElems) {
        const style = window.getComputedStyle(el);
        let parsedBg = RGBvalues.color(style.backgroundColor);
        if (!parsedBg.a) {
            if ((parsedBg.r === 29 && parsedBg.g === 155 && parsedBg.b === 240) || el.ariaFlowto) {
              el.ariaFlowto = true;
              const parsedNewCol = RGBvalues.color(newCol);
              const final = `rgba(${parsedNewCol.r}, ${parsedNewCol.g}, ${parsedNewCol.b}, ${parsedBg.a || 1})`;
              el.animate([ { backgroundColor: final } ], { duration: 0, fill: "forwards" });
          }
        }
        parsedBg = RGBvalues.color(style.color);
        if ((parsedBg.r === 29 && parsedBg.g === 155 && parsedBg.b === 240) ||  el.ariaRelevant) {
            el.ariaRelevant = true;
            const parsedNewCol = RGBvalues.color(newCol);
            let final = `rgba(${parsedNewCol.r}, ${parsedNewCol.g}, ${parsedNewCol.b}, ${parsedBg.a || 1})`;
            el.animate([ { color: final } ], { duration: 0, fill: "forwards" });
        }
        if (el.ariaLabel === "Color options") {
            found = true;
        }
    }
    if (!runInputUpdate) return;
    isOnColorSettings = found;
    if (isOnColorSettings === false) return;
    if (document.getElementById("already-applied-custom")) return;
    const colorContainer = document.querySelector("*[aria-label=\"Color options\"]");
    colorContainer.style.justifyContent = "left";
    colorContainer.style.padding = "8px 16px";
    colorContainer.innerHTML = "";
    colorContainer.id = "already-applied-custom";
    const input = document.createElement("input");
    input.value = newCol;
    input.type = "color";
    input.oninput = (e) => {
        newCol = input.value;
        localStorage.setItem("userscript-color", input.value);
        updatePage(false);
    }
    colorContainer.append(input);
}

const observer = new MutationObserver(() => {
    updatePage();
});

observer.observe(document.body, {
    subtree: true,
    childList: true
});

updatePage();
