// ==UserScript==
// @name         Ignore "Video Paused, continue watching?" using XPath
// @version      24.10.27
// @description  This script will click on "YES" button
// @author       8TM (https://github.com/8tm/youtube_video_paused_continue_watching)
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        http://youtube.com/*
// @match        http://www.youtube.com/*
// @compatible   firefox Works with Firefox and Tampermonkey
// @grant        none
// @namespace https://greasyfork.org/users/1386567
// @downloadURL https://update.greasyfork.org/scripts/514233/Ignore%20%22Video%20Paused%2C%20continue%20watching%22%20using%20XPath.user.js
// @updateURL https://update.greasyfork.org/scripts/514233/Ignore%20%22Video%20Paused%2C%20continue%20watching%22%20using%20XPath.meta.js
// ==/UserScript==

(function() {
    setInterval(() => {
        // Find "YES" button using XPath
        let xpath = "//div[@id='main']//div[contains(@class, 'buttons')]//yt-button-renderer[@id='confirm-button']//button";
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        let confirmButton = result.singleNodeValue;

        if (confirmButton && confirmButton.offsetParent !== null && !confirmButton.disabled) {
            confirmButton.click();

            // Debug:
            // let currentDateTime = new Date();
            // let formattedDateTime = currentDateTime.toLocaleString();
            // console.log(`[${formattedDateTime}] Pushed 'YES' button.`);
            // alert(`[${formattedDateTime}] Pushed 'YES' button.`);

        }
    },500);
})();
