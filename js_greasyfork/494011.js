// ==UserScript==
// @name         InoReader copy cover image
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Copy cover image of the post you selected in article list view
// @author       Kenya-West
// @match        https://*.inoreader.com/feed*
// @match        https://*.inoreader.com/article*
// @match        https://*.inoreader.com/folder*
// @match        https://*.inoreader.com/starred*
// @match        https://*.inoreader.com/library*
// @match        https://*.inoreader.com/dashboard*
// @match        https://*.inoreader.com/web_pages*
// @match        https://*.inoreader.com/trending*
// @match        https://*.inoreader.com/commented*
// @match        https://*.inoreader.com/recent*
// @match        https://*.inoreader.com/search*
// @match        https://*.inoreader.com/channel*
// @match        https://*.inoreader.com/teams*
// @match        https://*.inoreader.com/dashboard*
// @match        https://*.inoreader.com/pocket*
// @match        https://*.inoreader.com/liked*
// @match        https://*.inoreader.com/tags*
// @icon         https://inoreader.com/favicon.ico?v=8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494011/InoReader%20copy%20cover%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/494011/InoReader%20copy%20cover%20image.meta.js
// ==/UserScript==
// @ts-check

(function () {
    "use strict";

    document.head.insertAdjacentHTML(
        "beforeend",
        `
<style>
    .tm_copy_image_button {
        display: inline-block;
        cursor: pointer;
        position: absolute;
        right: 0.5rem;
        top: -2rem;
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        font-family: 'Inoreader-UI-Icons-Font' !important;
        font-size: 1.5rem;
        padding: 0.1rem;
        border-radius: 50%;
        margin-left: 0.5rem;
        transition: background-color 0.3s;
    }
    .tm_copy_image_button:hover {
        background-color: rgba(0, 0, 0, 0.7);
        transition: background-color 0.3s;
    }
    .tm_copy_image_button:active {
        background-color: rgba(0, 0, 0, 0.9);
        transition: background-color 0.3s;
    }
    .tm_copy_image_button::before {
        content: "\\ea11";
    }
    .tm_copy_image_button__success::before {
        content: "\\e976";
    }
</style>`
    );

    /**
     * @typedef {Object} appConfig
     * @property {Array<{
     *     prefixUrl: string,
     *     corsType: "direct" | "corsSh" | "corsAnywhere" | "corsFlare",
     *     token?: string,
     *     hidden?: boolean
     * }>} corsProxies
     */
    const appConfig = {
    };

    /**
     * Represents the application state.
     * @typedef {Object} AppState
     * @property {boolean} readerPaneMutationObserverLinked - Indicates whether the reader pane mutation observer is linked.
     * @property {boolean} articleViewOpened - Indicates whether the article view is opened.
     * @property {Object} copyBadge - Represents the currently playing video.
     * @property {HTMLDivElement | null} copyBadge.currentVideoElement - The current video element being played.
     * @property {function} copyBadge.set - Sets the current video element and pauses the previous one.
     * @property {function} copyBadge.get - Retrieves the current video element.
     */
    const appState = {
        readerPaneMutationObserverLinked: false,
        articleViewOpened: false,
        copyBadge: {
            /**
             * Represents the currently playing video.
             * @type {HTMLDivElement | null}
             */
            currentCopyBadgeElement: null,
            /**
             *
             * @param {HTMLDivElement | null} badge
             */
            set: (badge) => {
                const previousCopyBadge = appState.copyBadge.currentCopyBadgeElement;
                if (previousCopyBadge?.isConnected) {
                    appState.copyBadge.currentCopyBadgeElement?.parentElement?.removeChild(previousCopyBadge);
                }
                appState.copyBadge.currentCopyBadgeElement = badge;
            },
            /**
             *
             * @returns {HTMLDivElement | null}
             */
            get: () => {
                return appState.copyBadge.currentCopyBadgeElement;
            },
            disconnect: () => {
                if (appState.copyBadge.currentCopyBadgeElement?.isConnected) {
                    appState.copyBadge.currentCopyBadgeElement?.parentElement?.removeChild(appState.copyBadge.currentCopyBadgeElement);
                    appState.copyBadge.currentCopyBadgeElement = null;
                }
            },
        },
    };

    // Select the node that will be observed for mutations
    const targetNode = document.body;

    // Options for the observer (which mutations to observe)
    const mutationObserverGlobalConfig = {
        attributes: false,
        childList: true,
        subtree: true,
    };

    const querySelectorPathArticleRoot = ".article_full_contents .article_content";

    /**
     * Callback function to execute when mutations are observed
     * @param {MutationRecord[]} mutationsList - List of mutations observed
     * @param {MutationObserver} observer - The MutationObserver instance
     */
    const callback = function (mutationsList, observer) {
        for (let i = 0; i < mutationsList.length; i++) {
            if (mutationsList[i].type === "childList") {
                mutationsList[i].addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        setCopyIconInArticleList(node);
                    }
                });
            }
        }
    };

    //
    //
    // FIRST PART - RESTORE IMAGES IN ARTICLE LIST
    //
    //
    //

    /**
     *
     * @param {Node} node
     * @returns {void}
     */
    function setCopyIconInArticleList(node) {
        /**
         * @type {MutationObserver | undefined}
         */
        let tmObserverImageRestoreReaderPane;
        const readerPane = document.body.querySelector("#reader_pane");
        if (readerPane) {
            if (!appState.readerPaneMutationObserverLinked) {
                appState.readerPaneMutationObserverLinked = true;

                /**
                 * Callback function to execute when mutations are observed
                 * @param {MutationRecord[]} mutationsList - List of mutations observed
                 * @param {MutationObserver} observer - The MutationObserver instance
                 */
                const callback = function (mutationsList, observer) {
                    // filter mutations by having id on target and to have only unique id attribute values
                    let filteredMutations = mutationsList
                        // @ts-ignore
                        .filter((mutation) => mutation.target?.id.includes("article_"))
                        // @ts-ignore
                        .filter((mutation, index, self) => self.findIndex((t) => t.target?.id === mutation.target?.id) === index);

                    if (filteredMutations.length === 2) {
                        // check to have only two mutations: one that has .article_current class and one should not
                        const firstMutation = filteredMutations[0];
                        const secondMutation = filteredMutations[1];
                        // sort by abscence of .article_current class
                        filteredMutations = [firstMutation, secondMutation].sort((a, b) => {
                            // @ts-ignore
                            return a.target?.classList?.contains("article_current") ? 1 : -1;
                        });

                        // @ts-ignore
                        if (firstMutation.target?.classList?.contains("article_current") && !secondMutation.target?.classList?.contains("article_current")) {
                            filteredMutations = [];
                        }
                    }

                    for (let mutation of filteredMutations) {
                        if (mutation.type === "attributes") {
                            if (mutation.attributeName === "class") {
                                /**
                                 * @type {HTMLDivElement}
                                 */
                                // @ts-ignore
                                const target = mutation.target;

                                if (
                                    target.classList.contains("article_current") &&
                                    target.querySelector(".article_tile_content_wraper .article_tile_picture")
                                ) {
                                    // тут
                                    const imageElement = getImageElement(target);
                                    if (imageElement) {
                                        const imageUrl = getImageLink(imageElement);
                                        if (imageUrl) {
                                            const button = createButtonElement(imageUrl);
                                            placeButton(target, button);
                                            appState.copyBadge.set(button);
                                        }
                                    }
                                } else if (
                                    !target.classList.contains("article_current") &&
                                    target.querySelector(".article_tile_content_wraper .article_tile_picture")
                                ) {
                                    // тут если снято выделение
                                }

                                /**
                                 *
                                 * @param {Node & HTMLDivElement} node
                                 * @returns {HTMLDivElement | null}
                                 */
                                function getImageElement(node) {
                                    const nodeElement = node;
                                    /**
                                     * @type {HTMLDivElement | null}
                                     */
                                    const divImageElement = nodeElement.querySelector("a[href] > div[style*='background-image']");
                                    return divImageElement ?? null;
                                }

                                /**
                                 *
                                 * @param {HTMLDivElement} div
                                 */
                                function getImageLink(div) {
                                    const backgroundImageUrl = div?.style.backgroundImage;
                                    return commonGetUrlFromBackgroundImage(backgroundImageUrl);
                                }

                                /**
                                 *
                                 * @param {string} imageUrl
                                 * @returns {HTMLDivElement}
                                 */
                                function createButtonElement(imageUrl) {
                                    const button = document.createElement("div");
                                    button.className = "tm_copy_image_button";
                                    button.title = "Copy image to clipboard";
                                    button.addEventListener("click", () => {
                                        copyImage(imageUrl);
                                    });
                                    return button;
                                }

                                /**
                                 *
                                 * @param {HTMLDivElement} article
                                 * @param {HTMLDivElement} buttonElement
                                 */
                                function placeButton(article, buttonElement) {
                                    if (article) {
                                        article.appendChild(buttonElement);
                                    } else {
                                        console.error("Article was not found. Copy button has not been placed");
                                    }
                                }

                                /**
                                 *
                                 * @param {string} imageLink
                                 */
                                function copyImage(imageLink) {
                                    const img = new Image();
                                    img.crossOrigin = "Anonymous"; // This enables CORS
                                    const c = document.createElement("canvas");
                                    const ctx = c.getContext("2d");

                                    /**
                                     * @param {string} path
                                     * @param {{ (imgBlob: any): void; (arg0: any): void; }} func
                                     */
                                    function setCanvasImage(path, func) {
                                        img.onload = function () {
                                            // @ts-ignore
                                            c.width = this.naturalWidth;
                                            // @ts-ignore
                                            c.height = this.naturalHeight;
                                            // @ts-ignore
                                            ctx.drawImage(this, 0, 0);
                                            c.toBlob((/** @type {any} */ blob) => {
                                                func(blob);
                                            }, "image/png");
                                        };
                                        img.src = path;
                                    }

                                    setCanvasImage(imageLink, (/** @type {any} */ imgBlob) => {
                                        navigator.clipboard
                                            .write([new ClipboardItem({ "image/png": imgBlob })])
                                            .then((e) => {
                                                setSuccessIcon();
                                            })
                                            .catch((e) => {
                                                console.error(e);
                                                alert(
                                                    `Failed to copy image to clipboard. This feature may not supported in your browser, or something happened with image. Please try to save it manually. Error: ${
                                                        e.message ?? e.body ?? e.toString() ?? e.name ?? e.constructor.name ?? e.constructor.toString()
                                                    }`
                                                );
                                            });
                                    });
                                }

                                function setSuccessIcon() {
                                    appState.copyBadge.get()?.classList.add("tm_copy_image_button__success");
                                }
                            }
                        }
                    }
                };

                // Options for the observer (which mutations to observe)
                const mutationObserverLocalConfig = {
                    attributes: true,
                    attributeFilter: ["class"],
                    childList: false,
                    subtree: true,
                };

                // Create an observer instance linked to the callback function
                tmObserverImageRestoreReaderPane = new MutationObserver(callback);

                // Start observing the target node for configured mutations
                tmObserverImageRestoreReaderPane.observe(readerPane, mutationObserverLocalConfig);
            }
        } else {
            appState.readerPaneMutationObserverLinked = false;
            tmObserverImageRestoreReaderPane?.disconnect();
        }
    }

    /**
     *
     * @param {string} backgroundImageUrl
     * @returns {string | undefined}
     */
    function commonGetUrlFromBackgroundImage(backgroundImageUrl) {
        /**
         * @type {string | undefined}
         */
        let imageUrl;
        try {
            imageUrl = backgroundImageUrl?.match(/url\("(.*)"\)/)?.[1];
        } catch (error) {
            imageUrl = backgroundImageUrl?.slice(5, -2);
        }

        if (!imageUrl || imageUrl == "undefined") {
            return;
        }

        if (!imageUrl?.startsWith("http")) {
            console.error(`The image could not be parsed. Image URL: ${imageUrl}`);
            return;
        }
        return imageUrl;
    }

    // Create an observer instance linked to the callback function
    const tmObserverImageRestore = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    tmObserverImageRestore.observe(targetNode, mutationObserverGlobalConfig);
})();
