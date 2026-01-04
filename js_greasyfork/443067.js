// ==UserScript==
// @name         Flowgame.io Custom Background!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the map background image
// @author       Samira
// @match        *://*.flowgame.io/*
// @match        *://*.flowy.gg/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowgame.io
// @downloadURL https://update.greasyfork.org/scripts/443067/Flowgameio%20Custom%20Background%21.user.js
// @updateURL https://update.greasyfork.org/scripts/443067/Flowgameio%20Custom%20Background%21.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    let url = localStorage.getItem('url');
    let backgroundImage = document.createElement('img');
    if (url) {
        backgroundImage.src = url;
    }

    let settings = [
        {
            name: 'url',
            title: 'Background Image URL',
            type: 'text',
            toolTip: 'Copy & paste the URL of an image that shall be used as map background',
            value: localStorage.getItem('url'),
            onChange: function(value) {
                url = value;
                localStorage.setItem('url', url);
                backgroundImage.src = url;
            }
        }
    ]

    let flow = window.flowExtensions.register('https://greasyfork.org/de/scripts/443067-flowgame-io-custom-background', settings);
    let originalDrawBackground = flow.drawBackground;
    flow.drawBackground = function(context, view) {
        if (url) {
            flow.drawImageBackground(context, view, backgroundImage, 0.5);
        } else {
            originalDrawBackground.call(flow, context, view);
        }
    };
});
