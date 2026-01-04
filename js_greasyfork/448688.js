// ==UserScript==
// @name         Image manipulator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open various embedded images
// @author       anonymous
// @match        https://tinder.com/*
// @match        https://badoo.com/*
// @grant        GM_openInTab
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/448688/Image%20manipulator.user.js
// @updateURL https://update.greasyfork.org/scripts/448688/Image%20manipulator.meta.js
// ==/UserScript==

const sleep = ms => new Promise(fcn => setTimeout(fcn, ms));

var Badoo = {
    fullSizeUrl: function(url) {
        var sizeIndex = url.indexOf("&size");
        if (sizeIndex > 0) {
            url = url.substr(0, sizeIndex) + "&size=4096x4096&wm_size=20x20&wm_offs=32x32&h=1AN&gs=o&t=0.0.0.00";
        }
        return url;
    },

    urlFromBgStyle: function(style) {
        return style.substring(5, style.length - 2);
    },

    urlFromElement: function(element) {
        var style = element.style["background-image"];
        if (style) {
            return Badoo.fullSizeUrl(Badoo.urlFromBgStyle(style));
        }

        return Badoo.fullSizeUrl(element.attributes.src.value);
    },

    mainImage: async function() {
        var imageElement = document.getElementsByClassName("js-mm-photo-holder")[0].children[0];
        return Badoo.urlFromElement(imageElement);
    },

    allImages: async function() {
        var images = [];
        var count = parseInt(document.getElementsByClassName("js-gallery-total")[0].textContent);

        for (var imageIndex = 1; imageIndex <= count; ++imageIndex) {
            images.push(await Badoo.mainImage());
            if (imageIndex < count) {
                document.getElementsByClassName("js-gallery-next")[0].click();
                await sleep(400);
            }
        }
        return images;
    }
};

var Tinder = {
    fullSizeUrl: function(url) {
        return url
            .replaceAll("640x800", "original")
            .replaceAll("original_75_", "original_")
            .replaceAll("jpg", "jpeg")
            .replaceAll("webp", "jpeg");
    },

    urlFromBgStyle: function(style) {
        return style.substring(5, style.length - 2);
    },

    urlFromElement: function(element) {
        return Tinder.fullSizeUrl(Tinder.urlFromBgStyle(element.style["background-image"]));
    },

    mainImage: async function() {
        var imageElement = Array.from(document.getElementsByClassName("profileCard__slider__img"))
            .find(el => el.parentElement.parentElement.attributes["aria-hidden"].value == "false");

        return Tinder.urlFromElement(imageElement);
    },

    allImages: async function() {
        var images = [];
        for (var button of document.getElementsByClassName("bullet")) {
            button.click();
            await sleep(100);
            images.push(await Tinder.mainImage());
        }
        return images;
    }
};

function handlerForUrl(url) {
    if (url.includes("tinder")) {
        return Tinder;
    }
    else if (url.includes("badoo")) {
        return Badoo;
    }
}

function openLink(link, mode) {
    console.log(link);

    if (mode == "window") {
        window.location.href = link;
    }
    else if (mode == "bgTab") {
        GM_openInTab(link, {active: false, insert: false});
    }
    else if (mode == "fgTab") {
        GM_openInTab(link, {active: true, insert: false});
    }
}

function openMultipleLinks(links, mode) {
    console.log(links);
    openLink(links[0], mode);

    for (var link of links.slice(1)) {
        openLink(link, "bgTab");
    }
}

class ImageManipulator {
    constructor(siteHandler) {
        this.handler = siteHandler;
    }

    async OpenMain(mode) {
        openLink(await this.handler.mainImage(), mode);
    }

    async OpenAll(mode) {
        openMultipleLinks(await this.handler.allImages(), mode);
    }
}

(function() {
    "use strict";

    // Your code here...
    var siteHandler = handlerForUrl(document.location.href);
    unsafeWindow.ImageManipulator = new ImageManipulator(siteHandler);
    console.log(unsafeWindow.ImageManipulator);
})();