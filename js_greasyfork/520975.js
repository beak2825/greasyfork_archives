// ==UserScript==
// @name         LinkedIn Comments Deleter
// @namespace    greaseyfork_linkedin_com_del
// @version      2024-12-16.0
// @description  Deletes ALL of your comments on Linkedin
// @author       Henrique Bucher (henry@vitorian.com)
// @include      https://www.linkedin.com/in/*/recent-activity/comments/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520975/LinkedIn%20Comments%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/520975/LinkedIn%20Comments%20Deleter.meta.js
// ==/UserScript==

// WARNING:
// THIS WILL IMMEDIATELY START DELETING ***ALL*** OF YOUR COMMENTS ON LINKEDIN
// THE SCRIPT WILL RUN AS SOON AS YOU VISIT THE FOLLOWING PAGE:
// https://www.linkedin.com/your_activity/recent-activity/comments
// BE ABSOLUTELY SURE YOU WANT THIS!!!

(function() {
    'use strict';

    let MIN_CLICK_MS = 3000
    let MAX_CLICK_MS = 6000
    let MIN_RELOAD_MS = 5000
    let MAX_RELOAD_MS = 10000

    function sleep(mintime,maxtime) {
      let ms = Math.floor(Math.random()*(maxtime-mintime) + mintime);
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function remove_all() {
        let button_list = document.querySelectorAll('div.comment-options-trigger > div.artdeco-dropdown > button.artdeco-dropdown__trigger');

        for (let i = 0;i < button_list.length;i++){
            let button = button_list[i];
            button.click();
            sleep(MIN_CLICK_MS, MAX_CLICK_MS);

            // Click on the "Delete" option (2nd)
            let options = document.getElementsByClassName("comment-options-dropdown__option-text");
            options[2].click();
            sleep(MIN_CLICK_MS, MAX_CLICK_MS);

            // Confirm the modal dialog
            let modal_options = document.querySelectorAll("div.artdeco-modal__actionbar > button.artdeco-button > span.artdeco-button__text");
            modal_options[1].click();
            sleep(MIN_CLICK_MS, MAX_CLICK_MS);
        }
        sleep(MIN_RELOAD_MS, MAX_RELOAD_MS);
    }

    GM_log("-------------------- Linkedin Comment Delete Started" )

    remove_all();
    sleep(MIN_RELOAD_MS, MAX_RELOAD_MS);
    location.reload();

})();


