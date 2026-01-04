// ==UserScript==
// @name         InoReader dynamic height of tiles in the card view
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Makes cards' heights to be dynamic depending on image height
// @author       Kenya-West
// @match        https://*.inoreader.com/*
// @icon         https://inoreader.com/favicon.ico?v=8
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492686/InoReader%20dynamic%20height%20of%20tiles%20in%20the%20card%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/492686/InoReader%20dynamic%20height%20of%20tiles%20in%20the%20card%20view.meta.js
// ==/UserScript==
// @ts-check


(async function () {
    const arriveEventConfigArticle = {
        fireOnAttributesModification: false,
        existing: true
    };
    
    const style = `
        .tm_dynamic_height {
            height: auto !important;
        }
        .tm_remove_position_setting {
            position: unset !important;
        }
        `;

    // @ts-ignore
    GM_addStyle(style);

    // @ts-ignore
    const arrive = await import("https://cdnjs.cloudflare.com/ajax/libs/arrive/2.5.2/arrive.min.js");

    // @ts-ignore
    document.querySelector("#reader_pane")?.arrive(".ar", arriveEventConfigArticle, (article) => start(article));

    const querySelectorPathArticleRoot =
        ".article_full_contents .article_content";
    const querySelectorArticleContentWrapper = ".article_tile_content_wraper";
    const querySelectorArticleFooter = ".article_tile_footer";


    function start(element) {

        if (notHaveDynamicHeight(element)) {
            // @ts-ignore
            const cardWidth = element.clientWidth ?? element.offsetWidth ?? element.scrollWidth;
            // @ts-ignore
            const cardHeight = element.clientHeight ?? element.offsetHeight ?? element.scrollHeight;

            // 1. Set card height dynamic
            setDynamicHeight(element);

            // 2. Set content wrapper height dynamic
            const articleContentWrapperElement = element.querySelector(
                querySelectorArticleContentWrapper
            );
            if (articleContentWrapperElement) {
                setDynamicHeight(articleContentWrapperElement);
            }

            // 3. Remove position setting from article footer
            const articleFooter = element.querySelector(
                querySelectorArticleFooter
            );
            if (articleFooter) {
                removePositionSetting(articleFooter);
            }

            // 4. Find image height
            /**
             * @type {HTMLDivElement | null}
             */
            const divImageElement = element.querySelector(
                "a[href] > .article_tile_picture[style*='background-image']"
            );
            if (!divImageElement) {
                return;
            }
            const imageUrl = getImageLink(divImageElement);
            if (!imageUrl) {
                return;
            }
            const dimensions = getImageDimensions(imageUrl);

            // 5. Set image height (and - automatically - the card height)
            dimensions.then(([width, height]) => {
                if (height > 0) {
                    const calculatedHeight = Math.round(
                        (cardWidth / width) * height
                    );
                    const pictureOldHeight =
                        (divImageElement.clientHeight ??
                            divImageElement.offsetHeight ??
                            divImageElement.scrollHeight) ||
                        cardHeight;
                    /**
                     * @type {HTMLDivElement}
                     */
                    const div = divImageElement;
                    if (calculatedHeight > pictureOldHeight) {
                        div.style.height = `${calculatedHeight}px`;
                    }

                    // 5.1. Set card class to `.tm_dynamic_height` to not process it again next time
                    element.classList?.add("tm_dynamic_height");
                }
            });
        }
    }

    /**
     * Checks if article already has dynamic height set.
     */
    function notHaveDynamicHeight(element) {
        return element?.hasChildNodes() &&
            element?.id?.includes("article_") &&
            element?.classList.contains("ar") &&
            !element?.classList.contains("tm_dynamic_height");
    }

    /**
     * 
     * @param {Element} element 
     * @returns {void}
     */
    function setDynamicHeight(element) {
        element.classList?.add("tm_dynamic_height");
    }

    /**
     * 
     * @param {Element} element 
     * @returns {void}
     */
    function removeDynamicHeight(element) {
        const div = element.querySelector("img");
        if (!div) {
            return;
        }
        div.classList?.remove("tm_dynamic_height");
    }

    /**
     * 
     * @param {Element} element
     * @returns {void}
     */
    function removePositionSetting(element) {
        element.classList?.add("tm_remove_position_setting");
    }

    /**
     * 
     * @param {Element} element
     * @returns {void}
     */
    function restorePositionSetting(element) {
        element.classList?.remove("tm_remove_position_setting");
    }


    /**
     *
     * @param {HTMLDivElement} div
     * @returns {string | null}
     */
    function getImageLink(div) {
        const backgroundImageUrl = div?.style.backgroundImage;
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
            return null;
        }

        if (!imageUrl?.startsWith("http")) {
            console.error(
                `The image could not be parsed. Image URL: ${imageUrl}`
            );
            return null;
        }
        return imageUrl;
    }

    /**
     * 
     * @param {string} url 
     * @returns {Promise<[number, number]>}
     */
    async function getImageDimensions(url) {
        const img = new Image();
        img.src = url;
        try {
            await img.decode();
        } catch (error) {
            return Promise.reject(error);
        }
        return Promise.resolve([img.width, img.height]);
    };
})();

