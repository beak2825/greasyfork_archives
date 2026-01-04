// ==UserScript==
// @name         ExhTagHighlight
// @version      1.0
// @description  Highlight tags in gallery view according to 'My Tags' config in gallery for Exhentai and Ehentai
// @author       Caca ductile
// @match      https://exhentai.org/g/*
// @match      https://exhentai.org/mytags
// @match      https://e-hentai.org/g/*
// @match      https://e-hentai.org/mytags
// @license MIT
// @namespace https://greasyfork.org/users/979369
// @downloadURL https://update.greasyfork.org/scripts/495701/ExhTagHighlight.user.js
// @updateURL https://update.greasyfork.org/scripts/495701/ExhTagHighlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORE_NAME = 'exhtaghighlight-settings';

    const exportMyTagsConfig = () => {
        const tagConfigs = document.querySelector("#usertags_outer");
        const config = {};
        for (const tagConfig of tagConfigs.children) {
            const tagLink = tagConfig.querySelector("a");
            if (!tagLink) continue;
            const tagName = tagLink.href;
            const tagValue = tagLink.firstChild.style.cssText;
            console.log(tagName, tagValue);
            config[tagName] = tagValue;
        }
        localStorage.setItem(STORE_NAME, JSON.stringify(config));
    };

    const appendExportButton = () => {
        document.querySelector("#tagsave").parentElement.insertAdjacentHTML('afterend', '<div><input type="button" id="tagExport" style="margin: 2px 2px 2px 4px;" value="Export"></div>');
        document.querySelector("#tagExport").addEventListener("click", exportMyTagsConfig);
    };

    const highlightTags = () => {
        const stringConfig = localStorage.getItem(STORE_NAME);
        if (!stringConfig) {
            console.warn("ExhTagHighlight : Go to 'My Tags' page and hit the export button to save tag config to cache in order for the script to work properly");
            return;
        }
        const config = JSON.parse(stringConfig);
        for (const [tag, tagValue] of Object.entries(config)) {
            const element = document.querySelector('#taglist a[href="' + tag + '"]');
            if (element) {
                element.parentElement.style = tagValue;
            }
        }
    };

    if (window.location.pathname === "/mytags" ) {
        appendExportButton();
    } else {
        highlightTags();
    }

})();