// ==UserScript==
// @name         Inoreader Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Refine Inoreader article layout to be wider, increase the height of list view items, and hide the subscription button. Also fix the failed images.
// @author       henryxrl
// @include      http*://*.inoreader.com/*
// @icon         http://www.inoreader.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511917/Inoreader%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/511917/Inoreader%20Enhancement.meta.js
// ==/UserScript==

(function () {
    var css_13 =`
        #smarttoc-toast {  display: none !important;  }
        #sb_rp_upgrade {  display: none !important;  }
        .reader_pane_view_style_0 .ar { margin: 0 10px 0 10px !important; }
        .article_title_wrapper {  margin: 5px 2px 5px 2px !important;  }
        body.article_alignment_1 .reader_pane_view_style_1 .ar {  width: 90% !important; max-width: 100% !important;  }
        .article_full_contents {  width: 80% !important; max-width: 100% !important;  }
        .article_content, .article_footer {  max-width: 100% !important;  }
        .article_title {  width: 100% !important;  }
        .article-container {  max-width: 100% !important;  }
        `;

    var css_14 =`
        #smarttoc-toast {  display: none !important;  }
        #sb_rp_upgrade {  display: none !important;  }
        .reader_pane_view_style_0 .ar { margin: 0 10px 0 10px !important; }
        .parent_div_inner {  margin: 8px 0 8px 0 !important; font-size: 1.05rem !important;  }
        .article_header {  margin: 5px 2px 5px 2px !important;  }
        body.article_alignment_1 .reader_pane_view_style_1 .ar {  width: 90% !important; max-width: 100% !important;  }
        .ar {  border-bottom: 1px solid transparent !important; border-top: 1px solid transparent !important;  }
        .ar.article_expanded {  border: none !important;  }
        .ar.article_current.border {  border: 1px solid #d4d4d4 !important  }
        .article_full_contents {  width: 80% !important; max-width: 100% !important;  }
        .article_content, .article_footer {  max-width: 100% !important;  }
        .article_title {  width: 100% !important;  }
        .article-container {  max-width: 100% !important;  }
        `;

    // Function to get the version from the <link> tag and apply styles accordingly
    const applyStylesBasedOnVersion = () => {
        // Select the <link> tag that contains the version information
        const linkTag = document.querySelector('link[href*="base.css"]');

        if (linkTag) {
            // Use a regular expression to extract the version after "v="
            const hrefValue = linkTag.getAttribute('href');
            const versionMatch = hrefValue.match(/v=([\d.]+)/);

            if (versionMatch && versionMatch[1]) {
                const version = versionMatch[1];
                console.log("Website version: " + version);

                // Check if the version starts with 14, and apply the corresponding CSS
                if (version.startsWith("14")) {
                    GM_addStyle(css_14); // Apply styles for version 14
                } else {
                    GM_addStyle(css_13); // Apply styles for version 13 or any other version
                }
            } else {
                console.log("Version not found in the link tag.");
            }
        } else {
            console.log("No link tag found with the specified href pattern.");
        }
    };

    // Wait until the page is fully loaded, then apply the styles
    window.addEventListener('load', applyStylesBasedOnVersion);
})();


// fix failed images
const fixImage = () => {
    document.querySelectorAll('img[referrerpolicy="no-referrer"]').forEach(img => {
        img.setAttribute('referrerpolicy', 'referrer');
    });
};
setInterval(fixImage, 2000)