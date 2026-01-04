// ==UserScript==
// @namespace   raina
// @name        Bandcamp Volume Slider
// @author      raina
// @description A subtle volume slider for Bandcamp sites
// @version     0.2
// @include     /^https?:\/\//
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/401883/Bandcamp%20Volume%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/401883/Bandcamp%20Volume%20Slider.meta.js
// ==/UserScript==
window.self === window.top && window.siteroot && "https://bandcamp.com" == window.siteroot && (function() {
    const progbar_empty = document.querySelector('.progbar_empty');
    const progbar_fill = document.querySelector('.progbar_fill');
    const thumb = document.querySelector('.progbar .thumb');
    const style = document.createElement("style");
    style.textContent = `
        #volume_cell {
            vertical-align: middle;
        }
        #volume_ctrl {
            -moz-appearance: none;
            -webkit-appearance: none;
            background-color: ${getComputedStyle(progbar_empty).getPropertyValue("background-color")};
            background-image: linear-gradient(${getComputedStyle(progbar_fill).getPropertyValue("background-color")}, ${getComputedStyle(progbar_fill).getPropertyValue("background-color")});
            background-repeat: repeat-y;
            border: ${getComputedStyle(progbar_empty).getPropertyValue("border-top-color")} 1px solid;
            height: 8px;
            width: 45px;
        }
        #volume_ctrl::-webkit-slider-thumb,
        #volume_ctrl::-moz-range-thumb {
            -moz-appearance: none;
            -webkit-appearance: none;
            background: ${getComputedStyle(thumb).getPropertyValue("background-color")};
            box-shadow: ${getComputedStyle(thumb).getPropertyValue("border-top-color")} 0 0 0 1px inset;
            border: none;
            border-radius: 1px;
            height: 12px;
            width: 20px;
        }
    `;
    document.head.appendChild(style);
    const player_title = document.querySelector('.track_cell');
    const volume_cell = document.createElement("td");
    volume_cell.id = "volume_cell";
    volume_cell.setAttribute("colspan", 2);
    const volume_ctrl = document.createElement("input");
    volume_ctrl.id = "volume_ctrl";
    volume_ctrl.type = "range";
    volume_ctrl.min = 0;
    volume_ctrl.max = 100;
    volume_ctrl.step = 10;
    volume_ctrl.value = 70;
    volume_ctrl.addEventListener("input", ev => {
    volume_ctrl.style.backgroundSize = parseInt(volume_ctrl.value, 10) + "%";
        volume_ctrl.style.backgroundSize = parseInt(ev.target.value, 10) + "%";
        [].forEach.call(document.querySelectorAll("audio"), track => {
            track.volume = parseInt(ev.target.value, 10) / 100;
        });
    });
    volume_cell.appendChild(volume_ctrl);
    player_title.removeAttribute("colspan");
    player_title.parentElement.appendChild(volume_cell);
    document.addEventListener("load", ev => console.log("moo"));
}());
