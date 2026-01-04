// ==UserScript==
// @name:zh-TW          RR: CJK 語系介面調整
// @name                RR: CJK Language Family Interface Enhance
// @namespace           -
// @version             1.1.0
// @description:zh-TW   解決 CJK 語系導致 RR 部分頁面排版走位的問題。
// @description         Solve the problem that the CJK language family causes the layout of some pages of RR to misalign.
// @author              LianSheng
// @include             http://rivalregions.com/*
// @include             https://rivalregions.com/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/432639/RR%3A%20CJK%20Language%20Family%20Interface%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/432639/RR%3A%20CJK%20Language%20Family%20Interface%20Enhance.meta.js
// ==/UserScript==

(() => {
    // Mutation Observer Callback Check functions
    class MOCC {
        /**
         * 頁面：storage
         * 
         * @param {MutationRecord} record
         */
        static pageStorage(record) {
            if (record.addedNodes.length > 0) {
                let content = [...record.addedNodes].filter(
                    each => each.id == "content"
                );

                if (content.length > 0) {
                    let marginDiv = content[0].querySelector(".margin");

                    if (marginDiv) {
                        marginDiv.style.height = "100%";
                    }
                }
            }
        }

        /**
         * 頁面：article
         * 
         * @param {MutationRecord} record
         */
        static pageArticle(record) {
            if (record.addedNodes.length > 0) {
                let content = [...record.addedNodes].filter(
                    each => each.querySelector && each.querySelector("#another_langs_area")
                );

                if (content.length > 0) {
                    let articles = [...content[0].querySelectorAll("div[action*='news/show/']")];

                    articles.forEach(
                        each => each.style.height = "fit-content"
                    );
                }
            }
        }

        /**
         * 滑頁：state, region
         * 
         * @param {MutationRecord} record
         */
        static slide(record) {
            if (record.addedNodes.length > 0) {
                let content = [...record.addedNodes].filter(
                    each => each.querySelector && each.querySelector(".jspContainer")
                );

                if (content.length > 0) {
                    let slideProfileData = [...content[0].querySelectorAll(".jspContainer .slide_profile_data, .jspContainer .short_details")];

                    slideProfileData.forEach(each => {
                        each.style.minHeight = "50px";

                        // 解決顯示不完全的問題
                        $('#region_scroll').jScrollPane();
                    });
                }
            }
        }
    }

    // 常規頁面
    let contentId = setInterval(() => {
        let content = document.querySelector("#content");
        if (content) {
            let mo = new MutationObserver(records => records.map(record => {
                if (record.addedNodes.length > 0) {
                    MOCC.pageStorage(record);
                    MOCC.pageArticle(record);
                }
            }));
            let options = {
                'childList': true
            };
            mo.observe(content, options);
            clearInterval(contentId);
        }
    }, 100);

    // 滑頁
    let slideId = setInterval(() => {
        let slide = document.querySelector("#header_slide_inner");
        if (slide) {
            let mo = new MutationObserver(records => records.map(record => {
                if (record.addedNodes.length > 0) {
                    MOCC.slide(record);
                }
            }));
            let options = {
                'childList': true,
            };
            mo.observe(slide, options);
            clearInterval(slideId);
        }
    }, 100);
})();