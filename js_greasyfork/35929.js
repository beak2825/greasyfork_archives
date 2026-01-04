// ==UserScript==
// @name         WaniKani Progress Chart
// @version      0.1.1
// @description  See your progress charted over time on the WaniKani dashboard page! Progress is broken down by SRS stage, and you can hover for detail.
// @require      https://cdn.rawgit.com/curious-attempt-bunny/wanikani-user-script-helper/4374eae6a4a284c3c3da9d50caa83b8e1a1a6e5d/loader.js
// @require      https://cdn.jsdelivr.net/npm/d3@3.5.17/d3.js
// @require      https://cdn.jsdelivr.net/gh/novus/nvd3@v1.8.6/build/nv.d3.js
// @author       hitechbunny
// @include      https://www.wanikani.com/
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/review
// @namespace https://greasyfork.org/users/149329
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35929/WaniKani%20Progress%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/35929/WaniKani%20Progress%20Chart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    var head = document.getElementsByTagName('head')[0];
    if (head) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.href = 'https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css';
        link.rel = 'stylesheet';
        head.appendChild(link);
    }

    $('.dashboard .container .row:first').prepend('<div id="progres-timeline-chart"><svg style="height:300px; width:100%;"></svg></div>');

    window.WKHelper.init(GM_info, function() {
        function update() {
            d3.csv('https://wanikanitools-golang.curiousattemptbunny.com/srs/status/history.csv?api_key='+window.WKHelper.api_key_v2, function(raw) {
                var keys = ["Apprentice1", "Apprentice2", "Apprentice3", "Apprentice4", "Guru1", "Guru2", "Master", "Enlightened", "Burned"].reverse();
                var data = [];
                var nameToSeries = {};
                var rowNumber = 1;

                if (raw.length > 0) {
                    var padRow = JSON.parse(JSON.stringify(raw[raw.length-1]));
                    padRow.EpochSeconds = ""+(parseInt(padRow.EpochSeconds)+(60*60*3));
                    raw.push(padRow);
                }

                raw.forEach(function(row) {
                    keys.forEach(function(name) {
                        if (name == 'UTCDateTime' || name == 'EpochSeconds' || name == 'UserLevel' || name == 'Total' || name == 'LeechTotal') {
                            return;
                        }
                        if (name.indexOf("Leech") != -1) {
                            return;
                        }

                        if (!nameToSeries[name]) {
                            nameToSeries[name] = {key: name.replace("1", " I").replace("2", " II").replace("3", " III").replace("4", " IV"), values: []};
                            data.push(nameToSeries[name]);
                        }

                        nameToSeries[name].values.push([parseInt(row.EpochSeconds)*1000, parseInt(row[name])]);
                        //                    nameToSeries[name].values.push([rowNumber, parseInt(row[name])]);
                    });
                    rowNumber += 1;
                });

                nv.addGraph(function() {
                    var chart = nv.models.stackedAreaChart()
                    .margin({right: 100})
                    .x(function(d) { return d[0]; })   //We can modify the data accessor functions...
                    .y(function(d) { return d[1]; })   //...in case your data is formatted differently.
                    .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                    .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                    .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                    .clipEdge(true)
                    .interpolate("step")
                    .interactive(true)
                    .showLegend(false)
                    .pointActive(function(d) { return false; })
                    .controlOptions(["Stacked","Expanded"])
                    .controlLabels({"stacked":"Stacked","expanded":"Proportions"})
                    .color(['#dd0093','#dd0093','#dd0093','#dd0093','#882d9e','#882d9e','#294ddb', '#0093dd', '#434343'].reverse())
                    ;

                    //Format x-axis labels with custom function.
                    chart.xAxis
                        .tickFormat(function(d) {
                        return d3.time.format('%x')(new Date(d));
                    });

                    chart.yAxis
                        .tickFormat(d3.format(',.0f'));

                    d3.select('#progres-timeline-chart svg')
                        .datum(data)
                        .call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            });
        }

        update();
    });

})();