// ==UserScript==
// @name          WaniKani Review Button Auto Enable and Hover Details
// @description   Show when next review will become available on hover and automatically enable review button
// @author        Nekosuki
// @namespace     https://www.wanikani.com/users/Nekosuki
// @version       1.1.3
// @include       /^https://(www|preview).wanikani.com/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/398051/WaniKani%20Review%20Button%20Auto%20Enable%20and%20Hover%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/398051/WaniKani%20Review%20Button%20Auto%20Enable%20and%20Hover%20Details.meta.js
// ==/UserScript==

(function(wkof, $) {
    "use strict";

    if (!wkof) {
        const response = confirm("WaniKani Review Button Auto Enable and Hover Details script requires WaniKani Open Framework.\n Click 'OK' to be forwarded to installation instructions.");
        if (response) {
            window.location.href = "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
        }
        return;
    }

    const menuReviewButtonSelector = ".navigation .navigation-shortcut--reviews";
    const dashboardReviewButtonSelector = "a.lessons-and-reviews__reviews-button";
    const todayForecastSectionSelector = "section[data-react-class^='ReviewForecast'] table > tbody";
    const dashboardClassPrefix = "lessons-and-reviews__reviews-button--";
    const dashboardClassReviewCounts = [0, 1, 50, 100, 250, 500, 1000];

    const popoverStyles = `
        .review-button-aehd.popover { border-radius: 5px; border: 5px solid rgba(75,75,75,0.8); box-shadow: none; width: fit-content; }
        .review-button-aehd.popover > .arrow { border-bottom-color: rgba(75,75,75,0.8); border-width: 9px; top: -14px; border-top-width: 0; margin-left: -9px; }
        .review-button-aehd.popover > .arrow:after { border-color: transparent; }
        .review-button-aehd.popover > .popover-content { text-shadow: 0 1px 0 #fff; text-align: center; }
    `;
    const popoverTemplate = `
        <div class="popover review-button-aehd">
            <div class="arrow"></div>
            <div class="popover-content"></div>
        </div>
    `;
    const popoverConfig = {
        html: true,
        animation: false,
        placement: "bottom",
        trigger: "hover",
        template: popoverTemplate,
        content: () => popoverText,
    };

    let nextReviewCount;
    let nextReviewDate;
    let popoverText;
    let updateInterval;

    offsetPopovers();
    fetchData();

    function offsetPopovers() {
        const buttons = $([dashboardReviewButtonSelector, menuReviewButtonSelector]);
        buttons.each(function(index) {
            const popoverParent = $(this).parent().get(0);
            const dashboardReviewMutationObserver = new MutationObserver(mutations => {
                const popover = mutations[0].addedNodes[0];
                if (popover !== undefined) {
                    const popoverOffset = 7 + index * 13;
                    popover.style.top = `${popover.offsetTop - popoverOffset}px`;
                }
            });
            dashboardReviewMutationObserver.observe(popoverParent, { childList: true });
        });
    }

    function fetchData() {
        wkof.include("Apiv2");
        wkof.ready("Apiv2").then(() => {
            wkof.Apiv2.get_endpoint("summary").then(processData);
        });
    }

    function processData(summary) {
        const { next_reviews_at, reviews } = summary;
        nextReviewCount = reviews.find(review => review.available_at === next_reviews_at).subject_ids.length;
        nextReviewDate = new Date(next_reviews_at);
        setupPopovers();
        if (nextReviewAvailable()) {
            updatePopover();
        } else {
            updateInterval = setInterval(updatePeriodically, 1000);
        }
    }

    function setupPopovers() {
        const elements = $([menuReviewButtonSelector, dashboardReviewButtonSelector]);
        if (elements.length > 0) {
            $("head").append(`<style>${popoverStyles}</style>`);
            elements.popover(popoverConfig);
        }
    }

    function nextReviewAvailable() {
        return nextReviewDate < new Date();
    }

    function updatePeriodically() {
        updatePopover();
        if (nextReviewAvailable()) {
            updateButtons();
            updateForecast();
            clearInterval(updateInterval);
        }
    }

    function updatePopover() {
        if (nextReviewAvailable()) {
            popoverText = `<strong>${nextReviewCount}</strong> available now`;
        } else {
            popoverText = `+<strong>${nextReviewCount}</strong> ${relativeTimeToNextReview()}`;
        }
    }

    function updateButtons() {
        const dashboardButton = $(dashboardReviewButtonSelector);
        if (dashboardButton.length > 0 && dashboardButton.hasClass(`${dashboardClassPrefix}0`)) {
            dashboardButton.removeClass(`${dashboardClassPrefix}0`);
            const dashboardClassReviewCount = dashboardClassReviewCounts.reverse().find(c => c <= nextReviewCount);
            dashboardButton.addClass(`${dashboardClassPrefix}${dashboardClassReviewCount}`);
            dashboardButton.find("span").text(nextReviewCount);
        }
        const menuButton = $(menuReviewButtonSelector);
        if (menuButton.length > 0 && +menuButton.attr("data-count") === 0) {
            menuButton.attr("data-count", nextReviewCount);
            menuButton.find("span").text(nextReviewCount);
        }
    }

    function updateForecast() {
        let todayForecastSection = $(todayForecastSectionSelector).first();
        let hourRows = todayForecastSection.find(".review-forecast__hour");
        if (hourRows.length === 0) {
            todayForecastSection.remove();
            todayForecastSection = $(todayForecastSectionSelector).first();
            hourRows = todayForecastSection.find(".review-forecast__hour");
            todayForecastSection.find(".review-forecast__day-header time").text("Today");
        }
        const additionalReviewsToday = todayForecastSection.find("td").first().contents().last();
        if (hourRows.length === 1) {
            const todayForecastSectionHeader = todayForecastSection.find("tr").first();
            if (!todayForecastSection.hasClass("is-collapsed")) {
                todayForecastSectionHeader.click();
            }
            todayForecastSectionHeader.removeClass("cursor-pointer").addClass("cursor-default");
            todayForecastSection.on("click", false);
            additionalReviewsToday.replaceWith("0");
            todayForecastSection.find("td").eq(1).text(nextReviewCount);
            todayForecastSection.find("i").addClass("text-gray-400");
        } else {
            hourRows.first().remove();
            additionalReviewsToday.replaceWith(+additionalReviewsToday.text() - nextReviewCount);
        }
    }

    function relativeTimeToNextReview() {
        const seconds = Math.round((nextReviewDate - new Date()) / 1000);
        if (seconds < 45) {
          return "in a few seconds";
        }
        const stages = [
          { unit: "minute", factor: 60, threshold: 0.25 },
          { unit: "hour", factor: 60, threshold: 0.25 },
          { unit: "day", factor: 24, threshold: 0.1 },
          { unit: "month", factor: 30, threshold: 0.15 },
          { unit: "year", factor: 12, threshold: 0.1 },
        ];
        let measure = seconds;
        let unit;
        for (const stage of stages) {
          stage.measure = measure / stage.factor;
          stage.measure += stage.measure < 1 ? stage.threshold : 0.5;
          stage.measure = Math.floor(stage.measure);
          if (stage.measure === 0) {
            break;
          }
          measure = stage.measure;
          unit = stage.unit;
        }
        let time = "in ";
        if (measure === 1) {
          time += `a${unit.startsWith("h") ? "n" : ""} ${unit}`;
        } else {
          time += `${measure} ${unit}s`;
        }
        return time;
    }
})(window.wkof, window.jQuery);
