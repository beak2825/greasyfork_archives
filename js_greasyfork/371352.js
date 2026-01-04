// ==UserScript==
// @name bunpro-planner
// @namespace http://patrickayoup.com/
// @version 1.0.8
// @description  Better visualization of upcoming Bunpro Reviews
// @author Patrick Ayoup
// @include *bunpro.jp/*
// @exclude *community.bunpro.jp*
// @grant none
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/371352/bunpro-planner.user.js
// @updateURL https://update.greasyfork.org/scripts/371352/bunpro-planner.meta.js
// ==/UserScript==

const BunproPlanner = function () {
    this.interval = 1;
    this.chart = null;

    this.toAbsoluteTime = function (relativeTime) {
        let absoluteTime = null;
        relativeTime = relativeTime.toLowerCase();
        if (relativeTime === 'now') {
            absoluteTime = moment();
        } else {
            let tokens = relativeTime.split(' ');
            // When bunpro "burns" items, it uses the string
            // "almost 20 years", we want to get the last 2 tokens
            // which will cover both cases.
            let value = tokens[tokens.length - 2];
            let unit = tokens[tokens.length - 1];
            absoluteTime = moment().add(parseInt(value), unit);
        }
    
        return absoluteTime.format();
    };

    this.getReviews = function () {
        const self = this;
        let cards = jQuery('div .srs-info .row');
        const reviews = cards.map(function () {
            let kids = jQuery(this).children();
            let rv = {
                timesCorrect: parseInt(jQuery(kids[0]).text().trim().replace("Times Correct: ", "")),
                nextReview: self.toAbsoluteTime(
                    jQuery(kids[1]).text().trim().replace("Next Review: ", "").replace("about ", "")
                )
            };
            return rv;
        });

        this.reviews = reviews.get();
    };

    this.insertChartNode = function () {
        const self = this;

        // Delete the existing chart if there is one.
        const oldContainer = $('#bunpro-planner-chart-container').first().remove();

        let showUpcomingGrammarButton = jQuery('div.show-upcoming-grammar').first();
        
        let container = jQuery('<div id="bunpro-planner-chart-container"></div>');
        let intervalSelector = jQuery(`
            <form id="bunpro-planner-form" class="edit_user">
                <select id="bunpro-planner-interval">
                    <option value="8">8 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="2">2 Hours</option>
                    <option value="1">1 Hour</option>
                    <option value="0.5">30 Minutes</option>
                    <option value="0.25">15 Minutes</option>
                </select>
            </form>
        `);

        intervalSelector.change(function () {
            self.interval = Number($('#bunpro-planner-interval').children("option:selected").val());
            self.insertChartNode();
            self.buildChart();
        });

        let chart = jQuery('<canvas id="bunpro-planner-chart"></canvas>');
        container.append(intervalSelector);
        container.append(chart);
        container.insertBefore(showUpcomingGrammarButton);

        $('#bunpro-planner-interval').val(this.interval);

        this.chart = chart;
    };

    this.generateIntervals = function (startAt) {
        startAt = startAt.startOf('hour');
        let intervals = [];
        let totalIntervals = 24;
        for (i = 0; i < totalIntervals; ++i) {
            intervals.push(startAt.clone().add(i * this.interval, 'hours'));
        }

        return intervals;
    };

    this.getReviewsPerInterval = function (intervals) {
        let now = moment().startOf('hour');
        let maxTimestamp = now.clone().add(24 * this.interval, 'hours');
        let maxDiff = maxTimestamp.diff(now, 'hours');
    
        // Filter for cards scheduled outside the displayed range.
        let filteredReviews = this.reviews.filter(function (card) {
            return moment(card.nextReview).diff(now, 'hours') < maxDiff;
        });

        let groups = _.groupBy(filteredReviews, (card) => {
            const reviewTime =  moment(card.nextReview);

            for (i = 0; i < intervals.length; ++i) {
                if (intervals[i] > reviewTime) {
                    if (i > 0) {
                        return intervals[i - 1];
                    } else {
                        return intervals[0];
                    }
                }
            }

            return intervals[intervals.length - 1];
        });
    
        return intervals.map(function(interval) {
            if (groups[interval]) {
                return groups[interval].length;
            } else {
                return 0;
            }
        });
    };

    this.getAccumulatedReviewsPerInterval = function (reviewsPerInterval) {
        const accumulatedReviews = [];

        for (i = 0; i < reviewsPerInterval.length; ++i) {
            let sum = 0;

            for (j = 0; j <= i; ++j) {
                sum += reviewsPerInterval[j];
            }

            accumulatedReviews.push(sum);
        }
        
        return accumulatedReviews;
    };

    this.buildChart = function () {
        const now = moment();
        var ctx = this.chart.get(0).getContext('2d');
        
        let intervals = this.generateIntervals(now);
        const reviewsPerInterval = this.getReviewsPerInterval(intervals);
        const accumulatedReviewsPerInterval = this.getAccumulatedReviewsPerInterval(reviewsPerInterval);

        const labels = intervals.map((interval) => {
            return interval.format('MM/DD HH:mm');
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Reviews',
                        data: reviewsPerInterval,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Accumulated Reviews',
                        data: accumulatedReviewsPerInterval,
                        type: 'line'
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    };

    this.getReviews();
};

waitForKeyElements('div.show-upcoming-grammar', function() {
    const bunproPlanner = new BunproPlanner();
    bunproPlanner.insertChartNode();
    bunproPlanner.buildChart();
});
