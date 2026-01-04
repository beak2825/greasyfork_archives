// ==UserScript==
// @name         Genchin Center Hide Completed Achievement Sections
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  A simple script to hide categories on the website Genshin-Center.
// @author       https://github.com/Deses
// @license      MIT
// @match        https://genshin-center.com/achievements*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=genshin-center.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/493782/Genchin%20Center%20Hide%20Completed%20Achievement%20Sections.user.js
// @updateURL https://update.greasyfork.org/scripts/493782/Genchin%20Center%20Hide%20Completed%20Achievement%20Sections.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hidden = true;
    let previousUrl = '';

    function waitForElement(selector, callback) {
        const intervalId = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(intervalId);
                callback();
            }
        }, 500);
    }

    const observer = new MutationObserver(function(mutations) {
        let urlWithoutParams = location.href.split('?')[0];
        if (urlWithoutParams !== previousUrl) {
            previousUrl = urlWithoutParams;
            if (urlWithoutParams === 'https://genshin-center.com/achievements') {
                waitForElement(".AchievementsTitle_mobileTitle__KoBlQ", () => {
                    $(".AchievementsTitle_subTitleData__m2dfr").first().after("<div class='AchievementsTitle_subTitleData__m2dfr'><p>-----</p></div>\
<div class='AchievementsTitle_subTitleData__m2dfr' id='toggleVisibility'><br><div style='cursor: pointer;'><p id='toggleVisibilityField'>Show completed categories</p></div></div>");

                    $("#toggleVisibility" ).on( "click", function() {
                        if (hidden) {
                            $("#toggleVisibilityField").text("Hide completed categories");
                            $(".completed").show();
                        } else {
                            $("#toggleVisibilityField").text("Show completed categories");
                            $(".completed").hide();
                        }
                        hidden = !hidden;
                    });

                    $('p:contains("100%")').each(function( index ) {
                        let category = $(this).parent().parent();
                        category.addClass('completed');
                        category.hide();
                    });
                });
            }
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);

})();