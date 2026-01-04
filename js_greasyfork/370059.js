// ==UserScript==
// @name         Bunpro: Streak Chart Additions
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Adds a bar for unlearned items and changes the labels on the bars to be more informative
// @author       Kumirei
// @include      *bunpro.jp/user/profile/stats
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370059/Bunpro%3A%20Streak%20Chart%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/370059/Bunpro%3A%20Streak%20Chart%20Additions.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function() {
    // Change this to false if you want to hide the unlearned bar
    var displayUnlearned = true;

    //adds the bars
    function editChart() {
        var config = myChart.chart.config;
        var dataset = config.data.datasets[0];
        var unlearned = total - learned;
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgb(227, 191, 127)');
        gradient.addColorStop(1, 'rgb(219, 32, 35)');
        if (displayUnlearned) {
            dataset.data.unshift(unlearned);                                                  //add the bars
            config.data.labels.unshift(" ");                                                  //label the bars
            dataset.backgroundColor = ["#1b2437", ...Array(13).fill(gradient)];               //make unlearned bar a different color
            $('.bunpro-hanko-stats').prepend('<div class="col-xs-1 streak hanko hanko--grey"></div>');
            //change styling of stamps to make room for the two new ones
            $('head').append('<style id="ChartScriptStyle">'+
            '.bunpro-hanko-stats .hanko {width: 7.14% !important; padding: 0;}'+
            '@media (min-width: 768px) {'+
            '.bunpro-hanko-stats {padding-left: 33px !important; padding-right: 13px !important;}'+
            '}'+
            '@media (min-width: 1200px) {'+
            '.bunpro-hanko-stats {padding-left: 38px !important; padding-right: 8px !important;}'+
            '}'+
            '</style>');
        }
        config.options.tooltips.displayColors = false;                                    //removes color box from tooltip label
        config.options.tooltips.callbacks = {title: function(item, data) {                //add interval info to tooltip
            var labels = ["Now", "4h", "8h", "24h", "2d", "4d", "8d", "2w", "1m", "2m", "4m", "6m", "Never"];
            if (displayUnlearned) labels.unshift('Unlearned');
            return labels[item[0].index];}};
            dataset.label = "Count";                                                          //changes "Streak" to "Count" in tooltip
            myChart.update();                                                      //update chart
        }


        //get number of learned items and total number of items
        var url = $('#logo')[0].href; //profile page url
        var learned = 0;
        var total = 0;
        $.get(url, function(data) {
            $(data).find('.progress-count').each(function(i, e) {
                var LearnedTotal = e.innerText.split('/');
                if (!isNaN(LearnedTotal[0])) {
                    learned += Number(LearnedTotal[0]);
                    total += Number(LearnedTotal[1].split(" ")[0]);
                }
            });
        }).then(editChart);
    })();
