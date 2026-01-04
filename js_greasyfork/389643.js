// ==UserScript==
// @name         Auto dark mode
// @namespace    https://mmis1000.me/
// @version      0.4
// @description  Invert the whold website
// @author       MMis1000
// @include     http://*
// @include     https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389643/Auto%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/389643/Auto%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inIframe = window.top !== window.self

    function invert(color, strength = 0.9) {
        var gamma = 1
        var [r, g, b, a] = /rgba?\((.+?),(.+?),(.+?)(?:,(.+?))?\)/.exec(color).slice(1).map(Number)
        var invertedRUncompressed = (255 ** gamma - r ** gamma) * strength + (r ** gamma) * (1 - strength)
        var invertedGUncompressed = (255 ** gamma - g ** gamma) * strength + (g ** gamma) * (1 - strength)
        var invertedBUncompressed = (255 ** gamma - b ** gamma) * strength + (b ** gamma) * (1 - strength)

        var invertedR = ~~(invertedRUncompressed ** (1 / gamma))
        var invertedG = ~~(invertedGUncompressed ** (1 / gamma))
        var invertedB = ~~(invertedBUncompressed ** (1 / gamma))

        var newColor = `rgba(${invertedR},${invertedG},${invertedB},${a || 1})`
        console.log(newColor)
        return newColor
    }

    var root = document.querySelector(':root')
    var body = document.querySelector('body')
    var rootStyle = window.getComputedStyle(root)
    var bodyStyle = window.getComputedStyle(body)
    var style = ''

    var background = null

    if (rootStyle.backgroundColor === 'rgba(0, 0, 0, 0)' && bodyStyle.backgroundColor === 'rgba(0, 0, 0, 0)') {
        background = invert('rgba(255,255,255,1)')
    } else if (rootStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        background = invert(rootStyle.backgroundColor)
    } else {
        background = invert(bodyStyle.backgroundColor)
    }

    if (inIframe) {
        // we don't need background and yet another invert in iframe
        style = `
svg, img, video, canvas {
  filter: hue-rotate(180deg) invert(100%);
}
`
    } else {
        style = `
:root {
  background-color: ${background} !important;
  filter: invert(90%) hue-rotate(180deg);
}

svg, img, video, canvas {
  filter: hue-rotate(180deg) invert(100%);
}
`
    }

    var styleEl = document.createElement('style');
    styleEl.textContent = style
    document.head.appendChild(styleEl)
})();