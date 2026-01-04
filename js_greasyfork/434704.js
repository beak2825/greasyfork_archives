// ==UserScript==
// @name         BunPro Extra Stats
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds extra stats to the BunPro Stats page
// @author       You
// @match        https://www.bunpro.jp/*
// @icon         https://www.google.com/s2/favicons?domain=bunpro.jp
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/434704/BunPro%20Extra%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/434704/BunPro%20Extra%20Stats.meta.js
// ==/UserScript==


console.log('BunPro Extra Stats Tamper Monkey Script Starting!')

const statsPageUrl = 'https://www.bunpro.jp/user/profile/stats'

function createAreaChartElement(name, title) {
    let outerContainer = $('h3:contains(Accuracy Over Time)').parent().parent().parent().clone();
    let container = outerContainer.children()[0].children[0].children;
    container[0].textContent = title;
    container[1].children[0].id = name;
    return outerContainer;
}

function getJLPTData() {
    const raw = Chartkick.charts["chart-3"].data;
    return {
        N5: raw[0][1],
        N4: raw[1][1],
        N3: raw[2][1],
        N2: raw[3][1],
        N1: raw[4][1],
    };
}

function addTotalGrammarChart() {
    console.log('Getting total grammar data');

    fetch('https://www.bunpro.jp/user/grammar_heatmap')
        .then(response => response.json())
        .then(data => {

        let timestamps = {};

        let total = 0;
        for (const key in data) {
            timestamps[new Date(key * 1000).toLocaleDateString()] = data[key] + total;
            total += data[key];
        }

        console.log('Adding Total Grammar Chart');

        const totalCountChartElement = createAreaChartElement('total-count-chart', 'Total Grammar Over Time');
        totalCountChartElement.insertBefore( $('h3:contains(Accuracy Over Time)').parent().parent().parent())
        new Chartkick.AreaChart("total-count-chart", timestamps)

    })
        .catch(console.error);
}

function addTotalReviewsChart() {
    console.log('Getting total review data');

    fetch('https://www.bunpro.jp/user/review_heatmap')
        .then(response => response.json())
        .then(data => {

        let timestamps = {};

        let total = 0;
        for (const key in data) {
            timestamps[new Date(key * 1000).toLocaleDateString()] = data[key] + total;
            total += data[key];
        }

        console.log('Adding Total Review Chart');

        const totalCountChartElement = createAreaChartElement('total-review-chart', 'Total Reviews Over Time');
        totalCountChartElement.insertBefore( $('h3:contains(Accuracy Over Time)').parent().parent().parent())
        new Chartkick.AreaChart("total-review-chart", timestamps)

    })
        .catch(console.error);
}



function waitForElementAndChart(element, chart, callback) {
    var checkExist = setInterval(function() {
        if ($(element).length && !!Chartkick.charts[chart].data) {
            callback();
            clearInterval(checkExist);
        } else {
            console.log('waiting');
        }
    }, 100); // check every 100ms
}

function onStatsPageLoad() {
     waitForElementAndChart('h3:contains(Accuracy Over Time)', 'chart-1', () => {
         addTotalReviewsChart();
         waitForElementAndChart('h3:contains(Total Reviews Over Time)', 'chart-1', () => {
             addTotalGrammarChart();
         });
    });
}

function handleNavigation(url) {
    if (url === statsPageUrl) {
        onStatsPageLoad();
    }
}


var origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
        handleNavigation(this.responseURL)
    });
    origOpen.apply(this, arguments);
};

handleNavigation(statsPageUrl)


