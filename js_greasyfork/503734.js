// ==UserScript==
// @name         InoReader get Habr stats
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Shows comments and rating counter for Habr articles
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
// @downloadURL https://update.greasyfork.org/scripts/503734/InoReader%20get%20Habr%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/503734/InoReader%20get%20Habr%20stats.meta.js
// ==/UserScript==
// @ts-check

(function () {
    "use strict";

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
        readerPaneArticleListMutationObserverLinked: false,
        readerPaneArticleViewMutationObserverLinked: false,
        restoreImagesInListView: false,
        restoreImagesInArticleView: false,
    };

    // Select the node that will be observed for mutations
    const targetNode = document.body;

    // Options for the observer (which mutations to observe)
    const mutationObserverGlobalConfig = {
        attributes: false,
        childList: true,
        subtree: true,
    };

    const querySelectorPathArticleRoot = ".article_full_contents";

    const LOCAL_STORAGE_LISTVIEW_PARAMNAME="getHabrStatsListView";
    const LOCAL_STORAGE_ARTICLEVIEW_PARAMNAME="getHabrStatsArticleView";

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
                        if (appState.restoreImagesInListView) {
                            getHabrStatsInArticleList(node);
                        }
                        getHabrStatsInArticleView(node);
                    }
                });
            }
        }
    };

    function registerCommands() {
        let enableImageRestoreInListViewCommand;
        let disableImageRestoreInListViewCommand;
        let enableImageRestoreInArticleViewCommand;
        let disableImageRestoreInArticleViewCommand;

        const restoreImageListView = localStorage.getItem(LOCAL_STORAGE_LISTVIEW_PARAMNAME) ?? "false";
        const restoreImageArticleView = localStorage.getItem(LOCAL_STORAGE_ARTICLEVIEW_PARAMNAME) ?? "true";

        if (restoreImageListView === "false") {
            appState.restoreImagesInListView = false;
            // @ts-ignore
            enableImageRestoreInListViewCommand = GM_registerMenuCommand("Enable getting Habr stats in article list", () => {
                localStorage.setItem(LOCAL_STORAGE_LISTVIEW_PARAMNAME, "true");
                appState.restoreImagesInListView = true;
                if (enableImageRestoreInListViewCommand) {
                    unregisterAllCommands();
                    registerCommands();
                }
            });
        } else {
            appState.restoreImagesInListView = true;
            // @ts-ignore
            disableImageRestoreInListViewCommand = GM_registerMenuCommand("Disable getting Habr stats in article list", () => {
                localStorage.setItem(LOCAL_STORAGE_LISTVIEW_PARAMNAME, "false");
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
            enableImageRestoreInArticleViewCommand = GM_registerMenuCommand("Enable getting Habr stats in article view", () => {
                localStorage.setItem(LOCAL_STORAGE_ARTICLEVIEW_PARAMNAME, "true");
                appState.restoreImagesInArticleView = true;
                if (enableImageRestoreInArticleViewCommand) {
                    unregisterAllCommands();
                    registerCommands();
                }
            });
        } else {
            appState.restoreImagesInArticleView = true;
            // @ts-ignore
            disableImageRestoreInArticleViewCommand = GM_registerMenuCommand("Disable getting Habr stats in article view", () => {
                localStorage.setItem(LOCAL_STORAGE_ARTICLEVIEW_PARAMNAME, "false");
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
    function getHabrStatsInArticleList(node) {
        /**
         * @type {MutationObserver | undefined}
         */
        let tmObserverHabrStatsReaderPane;
        const readerPane = document.body.querySelector("#reader_pane");
        if (readerPane) {
            if (!appState.readerPaneArticleListMutationObserverLinked) {
                appState.readerPaneArticleListMutationObserverLinked = true;

                /**
                 * Callback function to execute when mutations are observed
                 * @param {MutationRecord[]} mutationsList - List of mutations observed
                 * @param {MutationObserver} observer - The MutationObserver instance
                 */
                const callback = function (mutationsList, observer) {
                    for (let mutation of mutationsList) {
                        if (mutation.type === "childList") {
                            mutation.addedNodes.forEach(function (node) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    setTimeout(() => {
                                        start(node);
                                    }, 500);
                                }
                            });
                        }
                    }
                };

                // Options for the observer (which mutations to observe)
                const mutationObserverLocalConfig = {
                    attributes: false,
                    childList: true,
                    subtree: false,
                };

                // Create an observer instance linked to the callback function
                tmObserverHabrStatsReaderPane = new MutationObserver(callback);

                // Start observing the target node for configured mutations
                tmObserverHabrStatsReaderPane.observe(readerPane, mutationObserverLocalConfig);
            }
        } else {
            appState.readerPaneArticleListMutationObserverLinked = false;
            tmObserverHabrStatsReaderPane?.disconnect();
        }

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
                const habrLink = getHabrLink(element);
                if (habrLink) {
                    const habrArticle = commonFetchHabrArticle(habrLink);
                    habrArticle.then(async (habrArticle) => {
                        const habrStats = commonGetHabrStats(habrArticle);
                        placeHabrStatsElement(element, habrStats);
                    });
                }
            }
        }

        /**
         *
         * @param {Node & HTMLDivElement} node
         * @returns {string | null}
         */
        function getHabrLink(node) {
            const nodeElement = node;
            /**
             * @type {HTMLAnchorElement | null}
             */
            const habrLinkElement = nodeElement.querySelector(".article_tile_content_wraper > a[href*='habr.com']");
            return habrLinkElement?.href ?? null;
        }

        /**
         *
         * @param {HTMLDivElement} div
         * @param {{
         *  rating: number | string,
         *  comments: number | string,
         * }} habrStats
         * @returns {void}
         */
        function placeHabrStatsElement(div, habrStats) {
            const html = `<div class="">
    <span class="">
        <center>${typeof(habrStats.rating) === 'number' ? habrStats.rating > 0 ? "+" : "-" : ""}${habrStats.rating} | comments: ${habrStats.comments}</center>
    </span></div>`;

            div.insertAdjacentHTML("beforeend", html);
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
    function getHabrStatsInArticleView(node) {
        if (!appState.restoreImagesInArticleView && appState.readerPaneArticleViewMutationObserverLinked) {
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
        let articleRoot = nodeElement?.querySelector(querySelectorPathArticleRoot);
        if (articleRoot === null && nodeElement?.classList.contains("article_full_contents")) {
            articleRoot = nodeElement;
        }
        if (articleRoot) {
            appState.readerPaneArticleViewMutationObserverLinked = true;
            const habrLink = getHabrLink();
            if (habrLink) {
                const habrArticle = commonFetchHabrArticle(habrLink);
                habrArticle.then(async (habrArticle) => {
                    const habrStats = commonGetHabrStats(habrArticle);
                    placeHabrStatsElement(habrStats);
                    appState.readerPaneArticleViewMutationObserverLinked = false;
                });
            } else {
                appState.readerPaneArticleViewMutationObserverLinked = false;
            }
            return;
        } else {
            appState.readerPaneArticleViewMutationObserverLinked = false;
        }

        /**
         *
         * @returns {string | null}
         */
        function getHabrLink() {
            /**
             * @type {HTMLDivElement}
             */
            // @ts-ignore
            const nodeElement = articleRoot;
            /**
             * @type {HTMLAnchorElement | null}
             */
            const habrLinkElement = nodeElement.querySelector(".article_title.article_title_expanded_view > a.article_title_link[href*='habr.com']");
            return habrLinkElement?.href ?? null;
        }

        /**
         *
         * @param {{
         *  rating: number | string,
         *  comments: number | string,
         * }} habrStats
         * @returns {void}
         */
        function placeHabrStatsElement(habrStats) {
            /**
             * @type {HTMLDivElement}
             */
            // @ts-ignore
            const nodeElement = articleRoot?.querySelector(".article_footer_placeholder_middle");

            const html = `
<div class="article_sub_title graylink_darker">
    <center>
        ${typeof habrStats.rating === "number" ? (habrStats.rating > 0 ? "+" : "-") : ""}${habrStats.rating} | comments: ${habrStats.comments}
    </center>
</div>
`;

            nodeElement.insertAdjacentHTML("beforebegin", html);
        }
    }

    /**
     *
     * @param {string} habrLink
     * @returns {Promise<Document>}
     */
    async function commonFetchHabrArticle(habrLink) {
        // add ?embed=1 to the end of the telegramPostUrl by constructing URL object
        const habrArticleUrlObject = new URL(habrLink);

        const requestUrl = appConfig.corsProxies[3].prefixUrl ? appConfig.corsProxies[3].prefixUrl + habrArticleUrlObject.toString() : habrArticleUrlObject;
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
     * @returns {{
     *    rating: number | string,
     *    comments: number | string,
     * }} imageUrl
     */
    function commonGetHabrStats(doc) {
        /**
         * @type {HTMLSpanElement | null}
         */
        const ratingElement = doc.querySelector(".tm-article-presenter__body .tm-votes-lever__score-counter[data-test-id='votes-score-counter']");
        const rating = Number(ratingElement?.innerText) ?? "N/A";
        /**
         * @type {HTMLSpanElement | null}
         */
        const commentsElement = doc.querySelector(".article-comments-counter-link .value");
        const comments = Number(commentsElement?.innerText) ?? "N/A";

        const habrStats = {
            rating,
            comments,
        };

        return habrStats;
    }

    // Create an observer instance linked to the callback function
    const tmObserverHabrStats = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    tmObserverHabrStats.observe(targetNode, mutationObserverGlobalConfig);

    registerCommands();
})();