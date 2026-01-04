// ==UserScript==
// @name         InoReader replace comss.ru domain with comss.one
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Replaces comss.ru links to comss.one for those who try to access comss.ru website from outside of Russian Federation
// @author       Kenya-West
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
// @downloadURL https://update.greasyfork.org/scripts/491488/InoReader%20replace%20comssru%20domain%20with%20comssone.user.js
// @updateURL https://update.greasyfork.org/scripts/491488/InoReader%20replace%20comssru%20domain%20with%20comssone.meta.js
// ==/UserScript==
// @ts-check

(function () {
    "use strict";

    const appConfig = {
        corsProxy: "https://corsproxy.io/?",
    };

    const appState = {
        readerPaneExists: false,
    };

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
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replaceLinksInArticleList(node);
                        replaceLinksInArticleView(node);
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
    function replaceLinksInArticleList(node) {
        const readerPane = document.body.querySelector("#reader_pane");
        if (readerPane) {
            if (!appState.readerPaneExists) {
                appState.readerPaneExists = true;

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
                                    if (appState.readerPaneExists) {
                                        setTimeout(() => {
                                            start(node);
                                        }, 500);
                                    }
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
                const tmObserverArticleList = new MutationObserver(callback);

                // Start observing the target node for configured mutations
                tmObserverArticleList.observe(
                    readerPane,
                    mutationObserverLocalConfig
                );
            }
        } else {
            appState.readerPaneExists = false;
        }

        /**
         *
         * @param {Node} node
         */
        function start(node) {
            readerPane
                ?.querySelectorAll("[href*='comss.ru']")
                .forEach((link) => {
                    if (!link) {
                        return;
                    }
                    const href = link.getAttribute("href");
                    const newHref = href?.replace("comss.ru", "comss.one");
                    if (!newHref) {
                        return;
                    }
                    link.setAttribute("href", newHref);
                });
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
    function replaceLinksInArticleView(node) {
        /**
         * @type {HTMLDivElement | null}
         */
        const article = document.body.querySelector(".article_full_contents");
        if (article) {
            setTimeout(() => {
                start(article);
            }, 500);
        }

        /**
         *
         * @param {HTMLDivElement} article
         */
        function start(article) {
            article
                ?.querySelectorAll("a[href*='comss.ru']")
                .forEach((link) => {
                    if (!link) {
                        return;
                    }
                    const href = link.getAttribute("href");
                    const newHref = href?.replace("comss.ru", "comss.one");
                    if (!newHref) {
                        return;
                    }
                    link.setAttribute("href", newHref);
                });
        }
    }

    // Create an observer instance linked to the callback function
    const tmObserverImageRestore = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    tmObserverImageRestore.observe(targetNode, mutationObserverGlobalConfig);
})();
