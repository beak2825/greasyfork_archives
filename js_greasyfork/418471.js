// ==UserScript==
// @name         Youtube Thumbnail Button
// @namespace    https://greasyfork.org/users/715485
// @version      1.1
// @description  Coloca um botão para ver thumbnail de um video do youtube
// @author       Luiz-lp
// @icon         https://www.freepnglogos.com/uploads/youtube-play-red-logo-png-transparent-background-6.png
// @match        *://*.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/418471/Youtube%20Thumbnail%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/418471/Youtube%20Thumbnail%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const textStyle = `
.thumbnail-button {
display: table;
margin-top:4px;
cursor: pointer;
color: rgb(255, 255, 255);
border-top-left-radius: 3px;
border-top-right-radius: 3px;
border-bottom-right-radius: 3px;
border-bottom-left-radius: 3px;
background-color: #1b7adc;

}
.thumbnail-text {
display:block;
cursor: pointer;
color: rgb(255, 255, 255);
background-color: #1b7adc;
padding: 0.49em;
}`;
    const BUTTON_ID = 'yt-thumbnail-luiz-lp-08012021';
    let currentUrl = document.location.href;
    let isPlaylist = currentUrl.includes("playlist");

    css();

    init(10);

    locationChange();

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(delButton, 500 * i);
            setTimeout(findPanel, 500 * i);
        }
    }

    function delButton() {
        if (!isPlaylist) return;
        document.querySelectorAll("#analytics-button.thumbnail-panel").forEach(panel => {
            panel.classList.remove("thumbnail-panel");
            panel.querySelector(".thumbnail-button").remove();
        });
    }

    function findPanel() {
        if (isPlaylist) return;
        document.querySelectorAll("#analytics-button:not(.thumbnail-panel)").forEach(panel => {
            panel.classList.add("thumbnail-panel");
            addButton(panel);
        });
    }

    function addButton(panel) {

        const div = document.createElement('div');
        const select = document.createElement('select');
        const option = document.createElement('option');

        div.classList.add("thumbnail-button");

        div.id = BUTTON_ID;

        select.id = 'thumbnail_selector';

        select.classList.add("thumbnail-text");

        option.textContent = "THUMBNAIL";
        option.selected = true;
        select.appendChild(option);

        select.addEventListener('change', function () {
            download_thumbnail(this);
        }, false);

        div.appendChild(select);

        panel.insertBefore(div, panel.firstElementChild);

        load_list(select);

    }

    async function download_thumbnail(selector) {

        if (selector.selectedIndex == 0) {
            return;
        }

        var m = currentUrl.match(/(?:watch\?.*v=|\/v\/)([\w\-=]+)/);
        var current_id = m[1];
        var url = "http://img.youtube.com/vi/"+ current_id +"/"+ selector.options[selector.selectedIndex].value +".jpg";
        window.open(url);

        selector.options[0].selected = true;
    }

    function load_list(select) {

        var option = document.createElement('option');
        option.textContent = "HD (1280x720)";
        option.value = "maxresdefault";
        select.appendChild(option);

        option = document.createElement('option');
        option.textContent = "SD (640x480)";
        option.value = "sddefault";
        select.appendChild(option);

        option = document.createElement('option');
        option.textContent = "HQ (480x360)";
        option.value = "hqdefault";
        select.appendChild(option);

        option = document.createElement('option');
        option.textContent = "MQ (320x180)";
        option.value = "mqdefault";
        select.appendChild(option);
    }

    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }

    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    isPlaylist = currentUrl.includes("playlist");
                    init(10);
                }
            });
        });
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();