// ==UserScript==
// @name         Bandcamp Volume Bar 2.0
// @version      3.0
// @description  Adds a volume bar to Bandcamp, styled with the album page's accent color, auto-inverts icons on dark backgrounds.
// @author       @nj4442
// @match        *://*.bandcamp.com/*
// @exclude      *://bandcamp.com/
// @license     MIT 
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js
// @namespace    https://greasyfork.org/en/users/1490367-nj4442
// @downloadURL https://update.greasyfork.org/scripts/545056/Bandcamp%20Volume%20Bar%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/545056/Bandcamp%20Volume%20Bar%2020.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ------------------ COLOR HELPERS ------------------ */

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1);
    }

    function isDarkColor(hex) {
        if (hex.length === 4) {
            hex = "#" + [...hex.slice(1)].map(c => c + c).join("");
        }
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    }

    function getElementBgColor(el) {
        if (!el) return '#ffffff';
        const bg = getComputedStyle(el).backgroundColor;
        if (bg.startsWith('rgb')) {
            const rgb = bg.match(/\d+/g);
            return rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
        }
        return bg;
    }

    /* ------------------ ACCENT COLOR ------------------ */

    function getAccentColor() {
        const accentElem = document.querySelector('.primaryText, .compound-button');
        if (accentElem) {
            const color = getComputedStyle(accentElem).color || '';
            if (color.startsWith('rgb')) {
                const rgb = color.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    return rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
                }
            }
            return color;
        }
        return '#f2a6ea'; // fallback
    }

    /* ------------------ INITIAL SETUP ------------------ */

    const accentColor = getAccentColor();
    let percentage = 75;
    let muted = false;

    const speakerUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/250px-Speaker_Icon.svg.png";
    const muteUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mute_Icon.svg/250px-Mute_Icon.svg.png";

    const pgBdBgColor = getElementBgColor(document.querySelector('#pgBd'));
    const darkBg = isDarkColor(pgBdBgColor);

    /* ------------------ DOM INSERTION ------------------ */

    $("audio").attr("id", "audioSource");
    const $control = $("<div class='volumeControl'></div>").insertAfter(".inline_player");
    $control.append("<div class='speaker'></div>");
    $control.append("<div class='volume'><span class='volumeInner'></span></div>");

    /* ------------------ STYLING ------------------ */

    let css = `
        .volumeControl {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .speaker {
            width: 30px;
            height: 30px;
            background: url('${speakerUrl}') center/contain no-repeat;
            cursor: pointer;
            ${darkBg ? 'filter: invert(1);' : ''}
        }
        .volume {
            position: relative;
            flex: 1;
            height: 10px;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
        }
        .volumeInner {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: ${percentage}%;
            background-color: ${accentColor};
            border-radius: 5px;
        }
    `;
    GM_addStyle(css);

    /* ------------------ VOLUME LOGIC ------------------ */

    $("#audioSource")[0].volume = percentage / 100;

    function changeVolume(e) {
        const offset = $(".volume").offset().left;
        const width = $(".volume").width();
        let pos = (e.pageX - offset) / width;
        pos = Math.max(0, Math.min(1, pos));
        percentage = Math.floor(pos * 100);
        $(".volumeInner").css("width", `${percentage}%`);
        $("#audioSource")[0].volume = pos;
        if (muted) toggleMute(); // unmute if volume changed
    }

    function toggleMute() {
        muted = !muted;
        if (muted) {
            $(".speaker").css("background-image", `url('${muteUrl}')`);
            $("#audioSource")[0].volume = 0;
            $(".volumeInner").css("width", "0%");
        } else {
            $(".speaker").css("background-image", `url('${speakerUrl}')`);
            $("#audioSource")[0].volume = percentage / 100;
            $(".volumeInner").css("width", `${percentage}%`);
        }
    }

    /* ------------------ EVENT HANDLERS ------------------ */

    $(".volume").mousedown(e => {
        changeVolume(e);
        $("body").on("mousemove.volume", changeVolume);
        $("body").css("user-select", "none");
    });

    $(document).mouseup(() => {
        $("body").off("mousemove.volume");
        $("body").css("user-select", "auto");
    });

    $(".speaker").click(toggleMute);
})();
