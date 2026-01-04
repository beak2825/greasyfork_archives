"use strict";
// ==UserScript==
// @name         Better PCGamer
// @namespace    https://github.com/scambier/userscripts
// @version      0.1
// @license      ISC
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @description  Enhance the reading experience of PCGamer articles
// @author       Simon Cambier
// @match        https://www.pcgamer.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/382959/Better%20PCGamer.user.js
// @updateURL https://update.greasyfork.org/scripts/382959/Better%20PCGamer.meta.js
// ==/UserScript==
(function () {
    GM_config.init({
        id: "PCG_Config",
        title: "Better PCGamer Config",
        fields: {
            disableRecommendedVideos: {
                label: 'Disable "recommended videos"',
                type: "checkbox",
                default: true,
            },
            disableDisqusComments: {
                label: "Disable Disqus comments",
                type: "checkbox",
                default: true,
            },
            disableBell: {
                label: 'Disable the "You\'ve blocked notifications" bell',
                type: "checkbox",
                default: true,
            },
            disableSidebar: {
                label: "Disable sidebar, and widen the article width if possible",
                type: "checkbox",
                default: true,
            },
        },
        css: ``,
        events: {
            save: () => {
                location.reload();
            },
        },
    });
    $(document).on("click", "#PCGConfigBtn", function () {
        GM_config.open();
    });
    function main() {
        // Add config button
        if (!$("#PCGConfigBtn")[0]) {
            const btn = document.createElement("a");
            btn.setAttribute("style", `
        position: fixed;
        bottom: 5px;
        left: 5px;
        cursor: pointer
      `);
            btn.id = "PCGConfigBtn";
            btn.appendChild(document.createTextNode("⚙️"));
            document.querySelector("body").appendChild(btn);
        }
        // Recommended videos
        if (GM_config.get("disableRecommendedVideos")) {
            $('div:contains("RECOMMENDED VIDEOS FOR YOU...")')
                .closest(".future__jwplayer--carousel")
                .remove();
            // $('.leaderboardAdPresent').remove()
        }
        // Comments
        if (GM_config.get("disableDisqusComments")) {
            $(".jump-to-comments").remove();
            $("#article-comments").remove();
            $("ul.socialite-widget-ul li.comment").remove();
        }
        // "Disabled notification" bell
        if (GM_config.get("disableBell")) {
            $("#onesignal-bell-container").remove();
        }
        // Ads
        if (GM_config.get("disableSidebar")) {
            $("#sidebar").remove();
            // $('.slot-single-height-0-500').remove()
            $("#content-after-image").attr("style", "width: 100%; max-width: 100%;");
            $(".news-article").attr("style", "width: 100%; max-width: 100%;");
        }
    }
    const observer = new MutationObserver((mutations) => {
        main();
    });
    observer.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false,
    });
    main();
})();
