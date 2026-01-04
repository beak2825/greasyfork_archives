// ==UserScript==
// @name         InoReader highlight transparent images
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Hightlights transparent images in InoReader with a white border
// @author       Kenya-West
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js
// @match        https://*.inoreader.com/feed*
// @match        https://*.inoreader.com/article*
// @match        https://*.inoreader.com/folder*
// @match        https://*.inoreader.com/starred*
// @match        https://*.inoreader.com/library*
// @match        https://*.inoreader.com/channel*
// @match        https://*.inoreader.com/teams*
// @match        https://*.inoreader.com/dashboard*
// @match        https://*.inoreader.com/pocket*
// @icon         https://inoreader.com/favicon.ico?v=8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491258/InoReader%20highlight%20transparent%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/491258/InoReader%20highlight%20transparent%20images.meta.js
// ==/UserScript==
// @ts-check

(function () {
    "use strict";

    // @ts-ignore
    const colorThief = new ColorThief();

    const appConfig = {
        restoreImagesInArticleView: true,
        outlineColor: "white",
        outlineWidth: 1,
        delay: 5000,
        thresholdOfDarkness: 8,
    };

    // @ts-ignore
    const appState = {};

    // Select the node that will be observed for mutations
    const targetNode = document.body;

    // Options for the observer (which mutations to observe)
    const mutationObserverGlobalConfig = {
        attributes: false,
        childList: true,
        subtree: true,
    };

    const querySelectorPathArticleRoot =
        ".article_full_contents .article_content";

    /**
     * Callback function to execute when mutations are observed
     * @param {MutationRecord[]} mutationsList - List of mutations observed
     * @param {MutationObserver} observer - The MutationObserver instance
     */
    // @ts-ignore
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        runHightlightImagesInArticleView(node);
                    }
                });
            }
        }
    };

    /**
     *
     * @param {Node} node
     * @returns {void}
     */
    function runHightlightImagesInArticleView(node) {
        setTimeout(() => {
            start();
        }, appConfig.delay ?? 2000);

        function start() {
            if (!appConfig.restoreImagesInArticleView) {
                return;
            }
            /**
             * @type {HTMLDivElement}
             */
            // @ts-ignore
            const nodeElement = node;

            /**
             * @type {HTMLDivElement | null}
             */
            const articleRoot = nodeElement?.querySelector(
                querySelectorPathArticleRoot
            );
            if (articleRoot) {
                const images = getImages(articleRoot);

                images.forEach((targetImage) => {
                    if (
                        targetImage.complete &&
                        _getImageHeight(targetImage) > 0 &&
                        _getImageWidth(targetImage) > 0
                    ) {
                        /**
                         * @type {[number, number, number]}
                         */
                        let colors;
                        try {
                            colors = colorThief.getColor(targetImage);
                        } catch (error) {
                            colors = [255, 255, 255];
                        }

                        const threshold = appConfig.thresholdOfDarkness ?? 10;
                        if (colors.every((color) => color > threshold)) {
                            return;
                        }

                        const canvas = createCanvas(targetImage);
                        const img = new Image();
                        img.src = targetImage.src;
                        // add event listener to draw on image load
                        /**
                         * @type {HTMLCanvasElement | undefined}
                         */
                        let newCanvas;
                        img.onload = function () {
                            /**
                             * @type {HTMLCanvasElement}
                             */
                            // newCanvas = draw(canvas, img);
                            // replaceImageSrc(targetImage, newCanvas);
                            invertColor(targetImage);
                        };
                    }
                });
                return;
            }
        }

        /**
         *
         * @param {HTMLDivElement} articleRoot
         * @returns {NodeListOf<HTMLImageElement>} images
         */
        function getImages(articleRoot) {
            return articleRoot.querySelectorAll("img[src]");
        }

        /**
         *
         * @param {HTMLImageElement} targetImage
         * @returns {HTMLCanvasElement}
         */
        function createCanvas(targetImage) {
            const canvas = document.createElement("canvas");

            let width = _getImageWidth(targetImage);
            let height = _getImageHeight(targetImage);

            if (width > 0) {
                canvas.width = targetImage.width;
            }
            if (height > 0) {
                canvas.height = targetImage.height;
            }

            return canvas;
        }

        /**
         * 
         * @param {HTMLImageElement} img 
         */
        function invertColor(img) {
            img.style.filter = "invert(1)";
        }

        /**
         *
         * @param {HTMLCanvasElement} canvas
         * @param {HTMLImageElement} img
         *
         * @returns {HTMLCanvasElement}
         */
        function draw(canvas, img) {
            // first - set height as canvas may not get height in previous step

            const height = _getImageHeight(img);
            if (height) {
                canvas.height = height + appConfig.outlineWidth * 2;
            }

            const ctx = canvas.getContext("2d");

            let dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
                s = appConfig.outlineWidth || 2, // thickness scale
                i = 0, // iterator
                x = 5, // final position
                y = 5;

            // draw images at offsets from the array scaled by s
            for (; i < dArr.length; i += 2)
                // @ts-ignore
                ctx.drawImage(img, x + dArr[i] * s, y + dArr[i + 1] * s);

            // fill with color
            // @ts-ignore
            ctx.globalCompositeOperation = "source-in";
            // @ts-ignore
            ctx.fillStyle = appConfig.outlineColor || "white";
            // @ts-ignore
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // draw original image in normal mode
            // @ts-ignore
            ctx.globalCompositeOperation = "source-over";
            // @ts-ignore
            ctx.drawImage(img, x, y);

            return canvas;
        }

        /**
         *
         * @param {HTMLImageElement} targetImg
         * @param {HTMLCanvasElement} canvas
         */
        // @ts-ignore
        function replaceImageSrc(targetImg, canvas) {
            // replace image with canvas
            targetImg.parentNode?.replaceChild(canvas, targetImg);
        }
    }

    /**
     *
     * @param {HTMLImageElement} img
     * @returns {number} width
     */
    function _getImageWidth(img) {
        return img.width || img.clientWidth || img.naturalWidth;
    }

    /**
     *
     * @param {HTMLImageElement | undefined} img
     * @returns {number} height
     */
    function _getImageHeight(img) {
        return img?.height || img?.clientHeight || img?.naturalHeight || 0;
    }

    // Create an observer instance linked to the callback function
    const tmObserverImageRestore = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    tmObserverImageRestore.observe(targetNode, mutationObserverGlobalConfig);
})();
