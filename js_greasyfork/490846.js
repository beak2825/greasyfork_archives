// ==UserScript==
// @name         InoReader restore lost images and videos
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Loads new images and videos from VK and Telegram in InoReader articles
// @author       Kenya-West
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
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
// @downloadURL https://update.greasyfork.org/scripts/490846/InoReader%20restore%20lost%20images%20and%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/490846/InoReader%20restore%20lost%20images%20and%20videos.meta.js
// ==/UserScript==
// @ts-check

(async function () {
    "use strict";

    const arriveEventConfigArticle = {
        fireOnAttributesModification: false,
        existing: true
    };

    // @ts-ignore
    const arrive = await import("https://cdnjs.cloudflare.com/ajax/libs/arrive/2.5.2/arrive.min.js");

    // @ts-ignore
    document.querySelector("#reader_pane")?.arrive(".ar", arriveEventConfigArticle, (article) => restoreImagesInArticleList(article));
    // @ts-ignore
    document.arrive("#article_dialog", arriveEventConfigArticle, (article) => restoreImagesInArticleView(article));

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
        corsProxies: [
            {
                prefixUrl: "https://corsproxy.io/?",
                corsType: "direct",
            },
            {
                prefixUrl: "https://proxy.cors.sh/",
                corsType: "corsSh",
                token: undefined,
                hidden: true,
            },
            {
                prefixUrl: "https://cors-anywhere.herokuapp.com/",
                corsType: "corsAnywhere",
                hidden: true,
            },
            {
                prefixUrl: "https://cors-1.kenyawest.workers.dev/?upstream_url=",
                corsType: "corsFlare",
            },
        ],
    };

    const appState = {
        restoreImagesInListView: false,
        restoreImagesInArticleView: false,
    };

    const querySelectorPathArticleRoot = ".article_full_contents .article_content";

    function registerCommands() {
        let enableImageRestoreInListViewCommand;
        let disableImageRestoreInListViewCommand;
        let enableImageRestoreInArticleViewCommand;
        let disableImageRestoreInArticleViewCommand;

        const restoreImageListView = localStorage.getItem("restoreImageListView") ?? "false";
        const restoreImageArticleView = localStorage.getItem("restoreImageArticleView") ?? "true";

        if (restoreImageListView === "false") {
            appState.restoreImagesInListView = false;
            // @ts-ignore
            enableImageRestoreInListViewCommand = GM_registerMenuCommand("Enable image restore in article list", () => {
                localStorage.setItem("restoreImageListView", "true");
                appState.restoreImagesInListView = true;
                if (enableImageRestoreInListViewCommand) {
                    unregisterAllCommands();
                    registerCommands();
                }
            });
        } else {
            appState.restoreImagesInListView = true;
            // @ts-ignore
            disableImageRestoreInListViewCommand = GM_registerMenuCommand("Disable image restore in article list", () => {
                localStorage.setItem("restoreImageListView", "false");
                appState.restoreImagesInListView = false;
                if (disableImageRestoreInListViewCommand) {
                    unregisterAllCommands();
                    registerCommands();
                }
            });
        }

        if (restoreImageArticleView === "false") {
            appState.restoreImagesInArticleView = false;
            // @ts-ignore
            enableImageRestoreInArticleViewCommand = GM_registerMenuCommand("Enable image restore in article view", () => {
                localStorage.setItem("restoreImageArticleView", "true");
                appState.restoreImagesInArticleView = true;
                if (enableImageRestoreInArticleViewCommand) {
                    unregisterAllCommands();
                    registerCommands();
                }
            });
        } else {
            appState.restoreImagesInArticleView = true;
            // @ts-ignore
            disableImageRestoreInArticleViewCommand = GM_registerMenuCommand("Disable image restore in article view", () => {
                localStorage.setItem("restoreImageArticleView", "false");
                appState.restoreImagesInArticleView = false;
                if (disableImageRestoreInArticleViewCommand) {
                    unregisterAllCommands();
                    registerCommands();
                }
            });
        }

        function unregisterCommand(command) {
            // @ts-ignore
            GM_unregisterMenuCommand(command);
        }

        function unregisterAllCommands() {
            // @ts-ignore
            GM_unregisterMenuCommand(enableImageRestoreInListViewCommand);
            // @ts-ignore
            GM_unregisterMenuCommand(disableImageRestoreInListViewCommand);
            // @ts-ignore
            GM_unregisterMenuCommand(enableImageRestoreInArticleViewCommand);
            // @ts-ignore
            GM_unregisterMenuCommand(disableImageRestoreInArticleViewCommand);
        }
    }

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
    function restoreImagesInArticleList(node) {
        start(node);

        /**
         *
         * @param {Node} node
         */
        function start(node) {
            /**
             * @type {Node & HTMLDivElement}
             */
            // @ts-ignore
            const element = node;
            if (element.hasChildNodes() && element.id.includes("article_") && element.classList.contains("ar")) {
                const imageElement = getImageElement(element);
                if (imageElement) {
                    const telegramPostUrl = getTelegramPostUrl(element);
                    const imageUrl = getImageLink(imageElement);
                    if (imageUrl) {
                        testImageLink(imageUrl).then(async () => {
                            const tgPost = await commonFetchTgPostEmbed(telegramPostUrl);
                            await replaceImageSrc(imageElement, tgPost);
                            await placeMediaCount(element, tgPost);
                        });
                    }
                }
            }
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
            const divImageElement = nodeElement.querySelector("a[href*='t.me'] > div[style*='background-image']");
            return divImageElement ?? null;
        }

        /**
         *
         * @param {Node & HTMLDivElement} node
         * @returns {string}
         */
        function getTelegramPostUrl(node) {
            if (!node) {
                return "";
            }
            return getFromNode(node) ?? "";

            /**
             *
             * @param {Node & HTMLDivElement} node
             * @returns {string}
             */
            function getFromNode(node) {
                /**
                 * @type {HTMLDivElement}
                 */
                // @ts-ignore
                const nodeElement = node;
                /**
                 * @type {HTMLAnchorElement | null}
                 */
                const ahrefElement = nodeElement.querySelector("a[href*='t.me']");
                const telegramPostUrl = ahrefElement?.href ?? "";
                // try to get rid of urlsearchparams. If it fails, get rid of the question mark and everything after it
                try {
                    return new URL(telegramPostUrl).origin + new URL(telegramPostUrl).pathname;
                } catch (error) {
                    return telegramPostUrl?.split("?")[0];
                }
            }
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
         * @returns {Promise<void>}
         */
        function testImageLink(imageUrl) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = imageUrl;
                img.onload = function () {
                    reject();
                };
                img.onerror = function () {
                    resolve();
                };
            });
        }

        /**
         *
         * @param {HTMLDivElement} div
         * @param {Document} tgPost
         * @returns {Promise<void>}
         */
        async function replaceImageSrc(div, tgPost) {
            const doc = tgPost;
            const imgLink = commonGetImgUrlsFromTgPost(doc) ?? [];
            if (imgLink?.length > 0) {
                try {
                    div.style.backgroundImage = `url(${imgLink})`;
                } catch (error) {
                    console.error(`Error parsing the HTML from the telegram post. Error: ${error}`);
                }
            } else {
                console.error("No image link found in the telegram post");
            }
        }

        /**
         * 
         * @param {HTMLDivElement} node
         * @param {Document} tgPost
         */
        async function placeMediaCount(node, tgPost) {
            const mediaCount = commonGetImgUrlsFromTgPost(tgPost);
            if (mediaCount.length > 1) {
                placeElement(mediaCount.length);
            }

            /**
             * @param {string | number} total
             */
            function placeElement(total) {
                // Create the new element
                const mediaCountElement = document.createElement("span");
                mediaCountElement.className = "article_tile_comments";
                mediaCountElement.title = "";
                mediaCountElement.style.backgroundColor = "rgba(0,0,0,0.5)";
                mediaCountElement.style.padding = "0.1rem";
                mediaCountElement.style.borderRadius = "5px";
                mediaCountElement.style.marginLeft = "0.5rem";
                mediaCountElement.textContent = `1/${total}`;

                // Find the target wrapper
                let wrapper = node.querySelector(".article_tile_comments_wrapper.flex");

                // If the wrapper doesn't exist, create it
                if (!wrapper) {
                    wrapper = document.createElement("div");
                    wrapper.className = "article_tile_comments_wrapper flex";

                    // Find the parent element and append the new wrapper to it
                    const parent = node.querySelector(".article_tile_content_wraper");
                    if (parent) {
                        parent.appendChild(wrapper);
                    } else {
                        console.error("Parent element not found");
                        return;
                    }
                }

                // Append the new element to the wrapper
                wrapper.appendChild(mediaCountElement);
            }
        }
    }

    //
    //
    // SECOND PART - RESTORE IMAGES IN ARTICLE VIEW
    //
    //
    //

    /**
     *
     * @param {Node} node
     * @returns {void}
     */
    function restoreImagesInArticleView(node) {
        if (!appState.restoreImagesInArticleView) {
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
        const articleRoot = nodeElement?.querySelector(querySelectorPathArticleRoot);
        if (articleRoot) {
            getImageLink(articleRoot);
            getVideoLink(articleRoot);
            return;
        }

        /**
         *
         * @param {HTMLDivElement} articleRoot
         */
        function getImageLink(articleRoot) {
            /**
             * @type {NodeListOf<HTMLAnchorElement> | null}
             */
            const ahrefElementArr = articleRoot.querySelectorAll("a[href*='t.me']:has(img[data-original-src*='cdn-telegram.org'])");
            const telegramPostUrl = commonGetTelegramPostUrl(node);

            ahrefElementArr.forEach((ahrefElement, index) => {
                /**
                 * @type {HTMLImageElement | null}
                 */
                const img = ahrefElement.querySelector("img[data-original-src*='cdn-telegram.org']");
                if (img && telegramPostUrl) {
                    img.onerror = function () {
                        replaceImageSrc(img, telegramPostUrl, index);
                    };
                }
            });
        }

        /**
         *
         * @param {HTMLDivElement} articleRoot
         */
        function getVideoLink(articleRoot) {
            /**
             * @type {NodeListOf<HTMLVideoElement> | null}
             */
            const videos = articleRoot.querySelectorAll("video[poster*='cdn-telegram.org']");
            videos?.forEach((video) => {
                /**
                 * @type {HTMLSourceElement | null}
                 */
                const videoSource = video.querySelector("source");
                const telegramPostUrl = commonGetTelegramPostUrl(node);
                if (videoSource && telegramPostUrl) {
                    if (checkIfArticleRootExistsAndHasSamePostOpened(telegramPostUrl)) {
                        videoSource.onerror = function () {
                            if (checkIfArticleRootExistsAndHasSamePostOpened(telegramPostUrl)) {
                                replaceVideoSrc(videoSource, telegramPostUrl).then(() => {
                                    if (checkIfArticleRootExistsAndHasSamePostOpened(telegramPostUrl)) {
                                        video.load();
                                    }
                                });
                            }
                        };
                    }
                }
            });

            /**
             * 
             * @param {string} telegramPostUrl 
             * @returns 
             */
            function checkIfArticleRootExistsAndHasSamePostOpened(telegramPostUrl) {
                if (document.querySelector(querySelectorPathArticleRoot) && commonGetTelegramPostUrl() === telegramPostUrl) {
                    return true;
                }
                return false;
            }
        }

        /**
         *
         * @param {HTMLImageElement} img
         * @param {string} telegramPostUrl
         */
        async function replaceImageSrc(img, telegramPostUrl, index = 0) {
            const doc = await commonFetchTgPostEmbed(telegramPostUrl);
            const imgLink = commonGetImgUrlsFromTgPost(doc);
            if (!imgLink) {
                return;
            }
            try {
                img.src = imgLink[index] ?? "";
                img.setAttribute("data-original-src", imgLink[index] ?? "");
            } catch (error) {
                console.error(`Error parsing the HTML from the telegram post. Error: ${error}`);
            }
        }

        /**
         *
         * @param {HTMLSourceElement} source
         * @param {string} telegramPostUrl
         * @returns {Promise<void>}
         */
        async function replaceVideoSrc(source, telegramPostUrl) {
            const doc = await commonFetchTgPostEmbed(telegramPostUrl);
            const videoLink = commonGetVideoUrlFromTgPost(doc);
            try {
                source.src = videoLink ?? "";
                return Promise.resolve();
            } catch (error) {
                console.error(`Error parsing the HTML from the telegram post. Error: ${error}`);
                return Promise.reject(error);
            }
        }
    }

    /**
     *
     * @param {string} telegramPostUrl
     * @returns {Promise<Document>}
     */
    async function commonFetchTgPostEmbed(telegramPostUrl) {
        // add ?embed=1 to the end of the telegramPostUrl by constructing URL object
        const telegramPostUrlObject = new URL(telegramPostUrl);
        telegramPostUrlObject.searchParams.append("embed", "1");

        const requestUrl = appConfig.corsProxies[3].prefixUrl ? appConfig.corsProxies[3].prefixUrl + telegramPostUrlObject.toString() : telegramPostUrlObject;
        const response = await fetch(requestUrl);
        try {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            return Promise.resolve(doc);
        } catch (error) {
            console.error(`Error parsing the HTML from the telegram post. Error: ${error}`);
            return Promise.reject(error);
        }
    }

    /**
     *
     * @param {Document} doc
     * @returns {string[]} imageUrl
     */
    function commonGetImgUrlsFromTgPost(doc) {
        const imagesQuerySelectors = [
            ".tgme_widget_message_grouped_layer > a",
            "a[href^='https://t.me/'].tgme_widget_message_photo_wrap",
            ".tgme_widget_message_video_player[href^='https://t.me/'] > i[style*='background-image'].tgme_widget_message_video_thumb",
            ".tgme_widget_message_link_preview > i[style*='background-image'].link_preview_image",
        ];

        const imgUrls = [];

        for (let i = 0; i < imagesQuerySelectors.length; i++) {
            const images = doc.querySelectorAll(imagesQuerySelectors[i]);
            images.forEach((image) => {
                /**
                 * @type {HTMLAnchorElement}
                 */
                // @ts-ignore
                const element = image;
                const imageUrl = mediaElementParsingChooser(element);
                if (imageUrl) {
                    if (!imgUrls.includes(imageUrl)) {
                        imgUrls.push(imageUrl);
                    }
                }
            });
        }

        /**
         * @param {HTMLAnchorElement} element
         *
         * @returns {string | undefined} imageUrl
         */
        function mediaElementParsingChooser(element) {
            let link;

            if (element.classList?.contains("tgme_widget_message_photo_wrap") && element.href?.includes("https://t.me/")) {
                const url = getUrlFromPhoto(element);
                if (url) {
                    link = url;
                }
            } else if (element.classList?.contains("tgme_widget_message_video_thumb") && element.style.backgroundImage?.includes("cdn-telegram.org")) {
                const url = getUrlFromVideo(element);
                if (url) {
                    link = url;
                }
            } else if (element.classList?.contains("link_preview_image") && element.style.backgroundImage?.includes("cdn-telegram.org")) {
                const url = getUrlFromLinkPreview(element);
                if (url) {
                    link = url;
                }
            }

            return link;
        }

        /**
         *
         * @param {HTMLAnchorElement} element
         * @returns {string | undefined}
         */
        function getUrlFromPhoto(element) {
            const backgroundImageUrl = element?.style.backgroundImage;
            return commonGetUrlFromBackgroundImage(backgroundImageUrl);
        }

        /**
         *
         * @param {HTMLAnchorElement} element
         * @returns {string | undefined}
         */
        function getUrlFromVideo(element) {
            const backgroundImageUrl = element?.style.backgroundImage;
            return commonGetUrlFromBackgroundImage(backgroundImageUrl || "");
        }

        /**
         *
         * @param {HTMLElement} element
         * @returns
         */
        function getUrlFromLinkPreview(element) {
            const backgroundImageUrl = element?.style.backgroundImage;
            return commonGetUrlFromBackgroundImage(backgroundImageUrl);
        }

        return imgUrls;
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

    /**
     *
     * @param {Document} doc
     * @returns {string | undefined} imageUrl
     */
    function commonGetVideoUrlFromTgPost(doc) {
        /**
         * @type {HTMLVideoElement | null}
         */
        const video = doc.querySelector("video[src*='cdn-telegram.org']");
        const videoUrl = video?.src;
        return videoUrl;
    }

    /**
     *
     * @param {Node | undefined} node
     * @returns {string}
     */
    function commonGetTelegramPostUrl(node = undefined) {
        return getFromArticleView() ?? getFromNode(node) ?? "";

        /**
         *
         * @returns {string | undefined}
         */
        function getFromArticleView() {
            /**
             * @type {HTMLAnchorElement | null}
             */
            const element = document.querySelector(".article_title > a[href^='https://t.me/']");
            return element?.href;
        }

        /**
         *
         * @param {Node | undefined} node
         * @returns {string}
         */
        function getFromNode(node) {
            /**
             * @type {HTMLDivElement}
             */
            // @ts-ignore
            const nodeElement = node;
            /**
             * @type {HTMLAnchorElement | null}
             */
            const ahrefElement = nodeElement.querySelector("a[href*='t.me']");
            const telegramPostUrl = ahrefElement?.href ?? "";
            // try to get rid of urlsearchparams. If it fails, get rid of the question mark and everything after it
            try {
                return new URL(telegramPostUrl).origin + new URL(telegramPostUrl).pathname;
            } catch (error) {
                return telegramPostUrl?.split("?")[0];
            }
        }
    }

    registerCommands();
})();
