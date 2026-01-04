// ==UserScript==
// @name         Wanikani: SRS Distribution Charts
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds charts with SRS distribution of Radical, Kanji, and Vocabulary items.
// @author       Kumirei
// @include      *wanikani.com*
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370163/Wanikani%3A%20SRS%20Distribution%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/370163/Wanikani%3A%20SRS%20Distribution%20Charts.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function() {
    // SETTINGS
    const aggregateApprenticeAndGuru = true;
    const displayOnDashboard = false;

    //----------------------------------------------------------------------------------------------------------------------------------------------

    //only run script if it's on the user's own profile page (or the dashboard)
    var location = false;
    var href = window.location.href;
    if (href == ($('a[href^="/users/"]')[0] || {href: "nah"}).href) location = "profile";
    else if (href.match(/^(https:\/\/)?(www\.)?wanikani.com\/(dashboard)?$/) && displayOnDashboard) location = "dashboard";
    if (location !== false) {
        //check that the Wanikani Framework is installed
        var script_name = 'Wanikani: SRS Distribution Charts';
        if (!window.wkof) {
            if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            return;
        }
        //if it's installed then do the stuffs
        wkof.include('ItemData');
        wkof.ready('ItemData').then(fetch_items);
    }

    //retrieves the data
    function fetch_items() {
        var target = $('.knowledge-distribution');
        if (location == "dashboard" && displayOnDashboard) target = $($('.dashboard > .container > .row > .span12 > .row')[0]);
        target.after('<div id="TypeChartDistribution" class="container"></div>');
        wkof.ItemData.get_items('subjects,assignments').then(function(items){
            //creates a chart for each type
            var by_type = wkof.ItemData.get_index(items,'item_type');
            ["radical", "kanji", "vocabulary"].forEach(function(type) {
                var srs_counts = get_levels(by_type[type]);
                create_chart(srs_counts, type);
            });
        });
    }

    //returns the SRS counts of the dataset
    function get_levels(data) {
        var srs_counts = [data.length];
        var by_srs = wkof.ItemData.get_index(data, 'srs_stage');
        for (var i = 1; i < 10; i++) {
            var count = (by_srs[i] || []).length;
            srs_counts[i] = count;
            srs_counts[0] -= count;
        }
        //combines the Apprentice and Guru levels into two entries
        if (aggregateApprenticeAndGuru) {
            var new_count = [];
            var aggregate_count = 0;
            for (i = 0; i < 10; i++) {
                aggregate_count += srs_counts[i];
                if (i != 1 && i != 2 && i != 3 && i != 5) { //combines cell 1,2,3,4 into one, and 5, 6 into one
                    new_count.push(aggregate_count);
                    aggregate_count = 0;
                }
            }
            srs_counts = new_count;
        }
        return srs_counts;
    }

    //creates a new chart and adds it to the page
    function create_chart(data, type) {
        //add styling
        $('head').append('<style id="chartStyle">.myChart {width: 33.3% !important; height: 400px !important; display: inline-block !important;}</style>');
        //create a new chart
        $('#TypeChartDistribution').append('<canvas id="' + type + 'Chart" class="myChart" width="400" height="400"></canvas>');
        //change labels if we aggregate apprentice and guru counts
        var xlabels = ["U", "A1", "A2", "A3", "A4", "G1", "G2", "M", "E", "B"];
        var tooltip_labels = ["Unlearned", "Apprentice 1", "Apprentice 2", "Apprentice 3", "Apprentice 4", "Guru 1", "Guru 2", "Master", "Enlightened", "Burned"];
        var backgrounds = ["white", "#dd0093", "#dd0093", "#dd0093", "#dd0093", "#882d9e", "#882d9e", "#294ddb", "#0093dd", "#434343"];
        if (aggregateApprenticeAndGuru) {
            xlabels = ["U", "A", "G", "M", "E", "B"];
            tooltip_labels = ["Unlearned", "Apprentice", "Guru", "Master", "Enlightened", "Burned"];
            backgrounds = ["white", "#dd0093", "#882d9e", "#294ddb", "#0093dd", "#434343"];
        }
        // change bar colours if using Breeze Dark
        if ($('body').css('background-color') == "rgb(49, 54, 59)") {
            if (backgrounds.length == 6) {
                backgrounds = ["white", "#1d99f3", "#1cdc9a", "#c9ce3b", "#f67400", "#DA4453"];
            } else {
                backgrounds = ["white", "#1d99f3", "#1d99f3", "#1d99f3", "#1d99f3", "#1cdc9a", "#1cdc9a", "#c9ce3b", "#f67400", "#DA4453"];
            }
        }
        //create the chart
        var ctx = document.getElementById(type + "Chart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            responsive: true,
            data: {
                labels: xlabels,
                datasets: [{
                    backgroundColor: backgrounds,
                    label: "Count",
                    data: data
                }],
            },
            options: {
                title: {
                    display: true,
                    fontSize: 60,
                    fontColor: "rgb(130,130,130)",
                    text: type.charAt(0).toUpperCase() + type.slice(1) + " Distribution"
                },
                tooltips: {
                    titleFontSize: 40,
                    bodyFontSize: 40,
                    displayColors: false,
                    callbacks: {
                        title: function(item, data) {
                            return tooltip_labels[item[0].index];
                        }
                    }
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fontSize: 40
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fontSize: 40
                        }
                    }]
                }
            }
        });
    }
})();
