// ==UserScript==
// @name         Hover Zoom Revamped
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Basic userscript implementation of the Imagus Hoverzoom extension
// @author       TetteDev
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/497995/Hover%20Zoom%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/497995/Hover%20Zoom%20Revamped.meta.js
// ==/UserScript==

const HoverImageId = `hover_image_${makeid(6)}`;
const HoverAttribute = "data-hoverable";
const NodeIsImage = (node) => { return node.tagName === "IMG" || node.nodeName === "IMG"; };

let mouseX = 0;
let mouseClientX = 0;
let mouseY = 0;
let mouseClientY = 0;
let renderAtMousePosition = false;
if (renderAtMousePosition) {
    const fnUpdateMousePosition = (e) => {
        mouseX = e.pageX;
        mouseClientX = e.clientX;
        mouseY = e.pageY;
        mouseClientY = e.clientY;
    };
    document.addEventListener('mousemove', fnUpdateMousePosition, false);
};

function containsImageDimensions(url) {
    const dimensionRegex = /(\d{2,4})x(\d{2,4})/;
    const match = url.match(dimensionRegex);

    if (match) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);

        if (width > 0 && height > 0 && width <= 10000 && height <= 10000) {
            return {
                width: width,
                height: height
            };
        }
    }
    return null;
}
function isLazyLoaded(imgElement) {
    if (!imgElement || imgElement.tagName.toLowerCase() !== 'img') {
        return false;
    }

    if (imgElement.hasAttribute('loading') && imgElement.getAttribute('loading') === 'lazy') {
        return true;
    }

    const lazyAttributes = ['data-src', 'data-lazy-src', 'data-srcset'];
    if (lazyAttributes.some((attr) => imgElement.hasAttribute(attr))) {
        return true;
    }

    const possibleIndicatorsClassnameLazy = ["lazy", "lazyloaded"];
    if (possibleIndicatorsClassnameLazy.some((lazy) => imgElement.className.includes(lazy))) {
        return true;
    }

    // check if src might contain 'lazy' or 'lazyloaded'

    return false;
}
function makeid(length, allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
    let result = '';
    const characters = allowedCharacters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

(function() {
    'use strict';

    const fnTryQuerySelector = (node, selector, all = false) => {
        if (!node) return [];
        if (!selector) return [];
        try {
            return all ? node.querySelectorAll(selector) : node.querySelector(selector);
        } catch (err) { return []; }
    };
    const fnTryHasAttribute = (node, attributeName) => {
        if(typeof node === 'object' && node !== null && 'getAttribute' in node && node.hasAttribute(attributeName)) return true;
        else return false;
    };

    window.addEventListener('load', function () {
        document.querySelectorAll("img").forEach((node) => {
            const isImageOrContainsImage = NodeIsImage(node) || (fnTryQuerySelector(node, "img", true).length > 0);
            if (isImageOrContainsImage) {
                if (fnTryHasAttribute(node, HoverAttribute)) return;

                node.setAttribute(HoverAttribute, "true");
                node.addEventListener("mouseenter", OnElementMouseEnter); node.addEventListener("mouseleave", OnElementMouseLeave);
            }
        });
        new MutationObserver((mutationRecords, observer) => {
            mutationRecords.forEach((mutation) => {
                const addedNodes = mutation.addedNodes;
                if (addedNodes.length == 0) return;

                addedNodes.forEach((node) => {
                    if (node.id === HoverImageId) return;
                    if (fnTryHasAttribute(node, HoverAttribute)) return;

                    const isImageOrContainsImage = NodeIsImage(node) || (fnTryQuerySelector(node, "img", true).length > 0);
                    // TODO: if NodeIsImage(node) returned false but isImageOrContainsImage is still true
                    // determine if its worth making it hoverable by checking the child "img" tags in that
                    // element and confirming they meet some kind of requirements, such as
                    // bigger than some size, child images count is only 1 etc etc

                    if (isImageOrContainsImage) {
                        node.setAttribute(HoverAttribute, "true");
                        node.addEventListener("mouseenter", OnElementMouseEnter); node.addEventListener("mouseleave", OnElementMouseLeave);
                    }
                });
            });
        }).observe(document, { attributes: false, childList: true, characterData: false, subtree: true });
    });

    function OnElementMouseEnter(event) {
        OnElementMouseLeave(null);

        const targetImage = NodeIsImage(event.currentTarget) ? event.currentTarget : event.currentTarget.querySelector("img");
        let targetImageSource = "";
        if (isLazyLoaded(targetImage)) {
            let dataSetUrls = targetImage.hasAttribute("data-srcset") ? targetImage.getAttribute("data-srcset").split(',').map((url) => url.trim().split(' ')[0]) : [];
            if (dataSetUrls) {
                targetImageSource = dataSetUrls.pop();
            }
            else {
                targetImageSource = targetImage.getAttribute("data-src");
            }
        }
        else {
            targetImageSource = targetImage.src;
        }

        if (!targetImageSource) {
            targetImageSource = targetImage.getAttribute("data-src") || targetImage.src || null;

            if (!targetImageSource) {
                event.currentTarget.removeEventListener("mouseenter", OnElementMouseEnter);
                event.currentTarget.removeEventListener("mouseleave", OnElementMouseLeave);
                return;
            }
        }
        let isBase64 = targetImageSource.includes("base64");

        let width = "auto";
        let height = "auto";

        let urlDerivedImageDimensions = isBase64 ? null : containsImageDimensions(targetImageSource);
        if (urlDerivedImageDimensions) {
            width = `${urlDerivedImageDimensions.width}px`;
            height = `${urlDerivedImageDimensions.height}px`;
        } else {
            let hasWidthAttribute = targetImage.hasAttribute("width");
            if (hasWidthAttribute) width = `${targetImage.getAttribute("width")}px`;

            let hasHeightAttribute = targetImage.hasAttribute("height");
            if (hasHeightAttribute) height = `${targetImage.getAttribute("height")}px`;
        }

        // Default: render it at the center of the page
        let renderPositionX = "50%";
        let renderPositionY = "50%";
        if (renderAtMousePosition) {
            // Render at mouse
            renderPositionX = `${(mouseX)}px`;
            renderPositionY = `${(mouseY)}px`;

            // Render at mouse with some offset
            /*
            const imageWidth = parseInt(width);
            const imageHeight = parseInt(height);
            renderPositionX = (mouseClientX + (imageWidth / 2));
            if (renderPositionX + imageWidth > window.innerWidth) {
                renderPositionX = window.innerWidth - imageWidth;
            }
            renderPositionY = (mouseClientY + (imageHeight / 2));
            if (renderPositionY + imageHeight > window.innerHeight) {
                renderPositionY = window.innerHeight - imageHeight;
            }
            renderPositionX = `${renderPositionY}px`;
            renderPositionY = `${renderPositionY}px`;
            */


            // Render at mouse but use percentages relative to the page view
            /*
            const xOffsetPercentage = 20;
            const yOffsetPercentage = 25;
            const xPositionPercentage = ((mouseX/window.innerWidth)*100) + xOffsetPercentage;
            const yPositionPercentage = ((mouseY/window.innerHeight)*100) + yOffsetPercentage;

            renderPositionX = `${xPositionPercentage}%`;
            renderPositionY = `${yPositionPercentage}%`;
            */
        }

        const hover = document.createElement("img");
        hover.src = targetImageSource;
        hover.id = HoverImageId;
        hover.style.cssText = `
        margin: 0 auto;
        position: ${(renderAtMousePosition ? 'absolute' : 'fixed')};
        left: ${renderPositionX} !important;
        top: ${renderPositionY} !important;
        transform: translate(-50%, -50%);
        width: ${width} !important;
        height: ${height} !important;
        z-index: 9999;
        border: 1px dashed red;`;

        document.body.appendChild(hover);
    }

    function OnElementMouseLeave(event) {
        let hover = document.querySelector(`#${HoverImageId}`);
        if (hover) hover.remove();
    }
})();