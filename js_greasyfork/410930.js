// ==UserScript==
// @name        WaniKani maximum reviews/day
// @namespace   http://alsanchez.es/
// @include     /^https?://(www\.)?wanikani\.com/
// @version     2
// @grant       none
// @description Adds an option to set a maximum number of reviews per day, like in Anki.
// @downloadURL https://update.greasyfork.org/scripts/410930/WaniKani%20maximum%20reviewsday.user.js
// @updateURL https://update.greasyfork.org/scripts/410930/WaniKani%20maximum%20reviewsday.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const today = new Date().toLocaleString('sv', { timeZoneName: 'short' }).substring(0, 10);

    const dailyReviews = (function() {

        const keyDefault = "wanikani-addon-review-limit-default-reviews";
        const keyRemainingForToday = "wanikani-addon-review-limit-remaining-reviews-for-today";

        function get() {

            const value = localStorage.getItem(keyRemainingForToday);
            const data = JSON.parse(value);

            if(data === null || !data.hasOwnProperty(today))
            {
                set(getDefault());
                return get();
            }

            return +data[today];
        }

        function set(count) {
            const data = { };
            data[today] = count;
            localStorage.setItem(keyRemainingForToday, JSON.stringify(data));
        }

        function getDefault() {

            if(keyDefault in localStorage) {
                return +localStorage.getItem(keyDefault);
            }

            return 100;
        }

        function setDefault(defaultValue) {
            localStorage.setItem(keyDefault, defaultValue);
        }

        return {
            get: get,
            set: set,
            setDefault: setDefault
        };

    })();

    if(window.location.pathname === "/dashboard")
    {
        const remainingReviews = dailyReviews.get();
        const reviewLink = $(".lessons-and-reviews__reviews-button")
        const reviewCountLabel = reviewLink.find("span");
        const actualReviewCount = reviewCountLabel.text();

        reviewCountLabel.html('<div style="display: inline;" class="remaining-reviews" title="Total reviews: ' + actualReviewCount + '">' + remainingReviews + '</span>');

        // Add icon to allow the user to set the daily number of reviews
        const icon = $('<i class="icon-calendar" title="Change maximum reviews/day" style="cursor: pointer;"></i>').css("margin-left", "5px");
        icon.click(function() {
            const answer = prompt("Maximum reviews/day");
            if(answer !== null)
            {
                dailyReviews.setDefault(answer);
                dailyReviews.set(answer);
                reviewCountLabel.find(".remaining-reviews").text(answer);
            }
            return false;
        });
        reviewCountLabel.append(icon);

        if(remainingReviews === 0)
        {
            reviewLink
                .css("cursor", "default")
                .css("background-color", "gray")
                .prop("href", "javascript: return false;");
        }
    }

    if(window.location.pathname === "/review" || window.location.pathname === "/review/")
    {
        const remainingReviews = dailyReviews.get();
        const startSessionButton = $("#start-session a");
        const reviewCountLabel = $("#start-session span");
        const alertContainer = $(".reviews-alert");

        // Hide the "Oh boy..." message
        alertContainer.hide();

        // Display the remaining reviews for the day
        window.summaryData.queue_count = remainingReviews;
        reviewCountLabel.text(remainingReviews);

        // If there are no more remaining reviews disable the button
        if(remainingReviews === 0)
        {
            startSessionButton
                .css("cursor", "default")
                .css("background-color", "gray")
                .prop("href", "javascript: return false;");
        }
    }

    if(window.location.pathname === "/review/session")
    {
        // We need to temporarily hijack the "jStorage.set" method in order to adjust the queues on first load
        const originalJStorageSet = $.jStorage.set;
        var originalReviewQueue;

        $.jStorage.set = function(key, value, options) {

            if(key === "reviewQueue")
            {
                originalReviewQueue = value;
            }
            else if(key === "activeQueue")
            {
                // We can now restore the original method since there's no need to intercept anything else
                $.jStorage.set = originalJStorageSet;

                // Split the remaining reviews for the day into the active & review queues
                const remainingReviews = dailyReviews.get();

                const reviewQueue = originalReviewQueue.slice(value.length, remainingReviews);
                $.jStorage.set("reviewQueue", reviewQueue, options);

                const activeQueue = originalReviewQueue.slice(0, Math.min(value.length, remainingReviews));
                $.jStorage.set("activeQueue", activeQueue, options);
            }
            else
            {
                // Should never reach here
                originalJStorageSet.call(this, key, value, options);
            }
        };

        // Listen to "completedCount" updates in order to detect completed reviews
        var lastCompletedValue = 0;

        $.jStorage.listenKeyChange("completedCount", function(key, action) {

            const newValue = $.jStorage.get("completedCount");

            if(lastCompletedValue !== newValue)
            {
                const delta = newValue - lastCompletedValue; // It should always be 1, but just in case...
                lastCompletedValue = newValue;

                // Update our remaining reviews for the day
                const remainingReviews = dailyReviews.get() - delta;
                dailyReviews.set(remainingReviews);
            }

        });
    }


})(window.$);