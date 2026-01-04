// ==UserScript==
// @name Extra Covid-19 charts for worldometers.info
// @namespace    http://rehfeld.us/
// @author       rehfeldchris@gmail.com
// @version      0.3
// @description  This will add new charts to the webpages at worldometers.info/coronavirus/* which plot Total Cases, Deaths, and rate of change on a daily basis, with weeks of historical data. worldometers.info has existing charts which shows you some of this data, but usually only for the current day. With this extension, you can see how many Cases New York had on Mar 22. It works for both Countries, and USA states. Homepage: http://rehfeld.us/browser-extensions/covid-19-charts-for-worldometers
// @match https://www.worldometers.info/coronavirus/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/399641/Extra%20Covid-19%20charts%20for%20worldometersinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/399641/Extra%20Covid-19%20charts%20for%20worldometersinfo.meta.js
// ==/UserScript==

/* jshint esnext:true */
(function(){

    const qs  = (cssSelector, context) => (context || document).querySelector(cssSelector);
    const qsa = (cssSelector, context) => Array.from((context || document).querySelectorAll(cssSelector));

    function getDataPointsForLocation(snapShots, worldOrUsa, countryOrState, yAxisProperty1, yAxisProperty2) {
        const dataPoints = [];
        const countryOrStateKey = worldOrUsa === 'us' ? 'State' : 'Country';
        for (const [dateStr, snapShot] of Object.entries(snapShots[worldOrUsa])) {
            for (const row of snapShot.dataRows) {
                if (row[countryOrStateKey] === countryOrState) {
                    dataPoints.push({
                        x: snapShot.md, // month-day
                        y1: row[yAxisProperty1], // i.e. TotalCases or TotalDeaths
                        y2: row[yAxisProperty2], // i.e. TotalCases or TotalDeaths
                    });
                }
            }
        }

        return dataPoints;
    }

    const Enum = {
        World: "world",
        USA: "us",
        SnapShotProperties: {
            State: "State",
            TotalCases: "TotalCases",
            NewCases: "NewCases",
            TotalDeaths: "TotalDeaths",
            NewDeaths: "NewDeaths",
            TotalRecovered: "TotalRecovered",
            TotalActive: "TotalActive",
        }
    };

    async function runChartSetup() {
        const url = '//rehfeld.us/browser-extensions/covid-19-charts-for-worldometers/stats.php';
        const data = await fetch(url).then((response) => response.json());
        // return;

        // The id for the table changes depending on the date and/or usa vs world page. So, we try a few possibilities.
        const usaTable = qs('#usa_table_countries_today');
        const worldTable = qs('#world_table_countries_today') || qs('#main_table_countries_today');
        const table = usaTable || worldTable;

        // Remove this class to make the page wider.
        // table.closest('.container').classList.remove('container');

        const names = addNewTableColumnAndCollectNames(table);
        const regionType = usaTable ? Enum.USA : Enum.World;
        const otherRegionType = !usaTable ? Enum.USA : Enum.World;

        for (const name of names) {
            // Try to find data in the proper region, but there's an edge case where we also benefit by looking in the other data set if we don't find it in the primary.
            let dataPoints = getDataPointsForLocation(data, regionType, name.countryOrState, Enum.SnapShotProperties.TotalCases, Enum.SnapShotProperties.TotalDeaths);
            if (name.countryOrState === "USA" && !dataPoints.length) {
                dataPoints = getDataPointsForLocation(data, Enum.World, name.countryOrState, Enum.SnapShotProperties.TotalCases, Enum.SnapShotProperties.TotalDeaths);
            }

            const chartTitle = `Total Cases & Deaths for ${name.countryOrState}`;
            // Let stack unwind to give browser engine time to render and create dom nodes.
            setTimeout(() => initCharts(chartTitle, name.containerId, dataPoints));
        }
    }


    runChartSetup();


    const tpl = `
    <style>
        .custom-tabbable-panel-cases {
            width: 700px;
            height: 500px;
        }
    
        /* Tabs panel */
        .tabbable-panel-cases {
            border: 1px solid #ccc;
            padding: 10px;
        }
    
        /* Default mode */
        .tabbable-line-cases>.nav-tabs {
            border: none;
            margin: 0px;
        }
    
        .tabbable-line-cases>.nav-tabs>li {
            margin-right: 2px;
    
        }
    
        .tabbable-line-cases>.nav-tabs>li>a {
            border: 0;
            margin-right: 0;
            color: #737373;
            font-size: 13px;
            text-decoration: none !important;
        }
    
        .tabbable-line-cases>.nav-tabs>li>a>i {
            color: #a6a6a6;
        }
    
        .tabbable-line-cases>.nav-tabs>li.open,
        .tabbable-line-cases>.nav-tabs>li:hover {
            border-bottom: 3px solid #fbcdcf;
    
        }
    
        .tabbable-line-cases>.nav-tabs>li.open>a,
        .tabbable-line-cases>.nav-tabs>li:hover>a {
            border: 0;
            background: none !important;
            color: #333333;
        }
    
        .tabbable-line-cases>.nav-tabs>li.open>a>i,
        .tabbable-line-cases>.nav-tabs>li:hover>a>i {
            color: #77DDFF;
        }
    
        .tabbable-line-cases>.nav-tabs>li.open .dropdown-menu,
        .tabbable-line-cases>.nav-tabs>li:hover .dropdown-menu {
            margin-top: 0px;
        }
    
        .tabbable-line-cases>.nav-tabs>li.active {
            border-bottom: 3px solid #33CCFF;
    
    
            position: relative;
    
        }
    
        .tabbable-line-cases>.nav-tabs>li.active>a {
            border: 0;
            color: #333333;
        }
    
        .tabbable-line-cases>.nav-tabs>li.active>a>i {
            color: #404040;
        }
    
        .tabbable-line-cases>.tab-content {
            margin-top: -3px;
            background-color: #fff;
            border: 0;
            border-top: 1px solid #eee;
            padding: 15px 0;
        }
    
        .portlet .tabbable-line-cases>.tab-content {
            padding-bottom: 0;
        }
    </style>
    <div class="tabbable-panel-cases custom-tabbable-panel-cases">
    <div class="tabbable-line-cases" >
        <ul class="nav nav-tabs ">
            <li class="active">
                <a href="#chart-linear" data-toggle="tab" aria-expanded="true" style="">Linear </a>
            </li>
            <li class="">
                <a href="#chart-log" data-toggle="tab" style="" aria-expanded="false">Logarithmic </a>
            </li>
            <li class="">
                <a href="#chart-growth-linear" data-toggle="tab" style="" aria-expanded="false">Growth Rate </a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="chart-linear" style="">
                linear chart
            </div>
            <div class="tab-pane " id="chart-log" style="overflow: hidden;">
                log chart
            </div>
            <div class="tab-pane " id="chart-growth-linear" style="overflow: hidden;">
                growth rate chart
            </div>
        </div>
    </div>
</div>
    `;

    function createLinearLogTabbedPanels() {
        createLinearLogTabbedPanels.cnt = createLinearLogTabbedPanels.cnt || 0;
        createLinearLogTabbedPanels.cnt++;
        const linearTabId = 'chart-linear-' + createLinearLogTabbedPanels.cnt;
        const logTabId = 'chart-logarithmic-' + createLinearLogTabbedPanels.cnt;
        const linearGrowthTabId = 'chart-growth-linear-' + createLinearLogTabbedPanels.cnt;

        const panel = htmlToFragment(tpl);

        // Update the nav links w/ new unique ids.
        qsa('.nav-tabs a', panel).forEach(a => {
            if (a.href.includes('chart-log')) {
                a.href = '#' + logTabId;
            } else if (a.href.includes('chart-growth-linear')) {
                a.href = '#' + linearGrowthTabId;
            } else if (a.href.includes('chart-linear')) {
                a.href = '#' + linearTabId;
            }
        });

        // Update the nav links w/ new unique ids.
        qsa('.tab-pane', panel).forEach(div => {
            if (div.id.includes('log')) {
                div.id = logTabId;
            } else if (div.id.includes('chart-growth-linear')) {
                div.id = linearGrowthTabId;
            } else if (div.id.includes('chart-linear')) {
                div.id = linearTabId;
            }
        });

        return {
            panel,
            linearTabId,
            logTabId,
            linearGrowthTabId
        };

    }

    function addNewTableColumnAndCollectNames(table) {
        const names = [];
        let id = 0;
        qs('thead', table).appendChild(htmlToElements(`<th></th>`));
        qsa('tbody tr', table).forEach(tr => {
            id++;
            // The name is always in the first column.
            let countryOrState = tr.querySelector('td:first-of-type').textContent.trim();
            const containerId = "chart-container-" + id;
            // They show a summary of the usa called "usa total" on the state page. We rename it to "USA", which is how its named on the country page.
            // This lets us match it to our data.
            if (/usa total/i.test(countryOrState)) {
                countryOrState = 'USA';
            }
            // const containerId = "chart-container-" + canonicalizeName(countryOrState);
            // Now add a new column, with chart.
            tr.appendChild(htmlToElements(`<td><div id="${containerId}"></div></td>`));

            names.push({countryOrState, containerId});
        });

        return names;
    }

// changes New York to new_york
    function canonicalizeName(name) {
        return name.trim().toLowerCase().replace(/[^a-zA-Z]/, '_');
    }

    function isScrolledNearlyIntoView(elem) {
        const docViewTop = $(window).scrollTop();
        const docViewBottom = docViewTop + $(window).height();

        const elemTop = $(elem).offset().top;
        const elemBottom = elemTop + $(elem).height();

        return Math.abs(elemBottom - docViewBottom) < 500 || Math.abs(elemTop - docViewTop) < 500;
    }

    const chartContainers = new Set();
    function checkVisibleElements() {
        for (let o of chartContainers) {
            if (isScrolledNearlyIntoView(o.container)) {
                chartContainers.delete(o);
                o.initFunc();
                break;
            }
        }
    }

    let ticking = false;
    function onScrollEvent() {
        checkVisibleElements();
    }

    window.addEventListener('scroll', function(e) {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                onScrollEvent();
                ticking = false;
            });

            ticking = true;
        }
    });
    setTimeout(checkVisibleElements, 1000);
    setTimeout(checkVisibleElements, 3000);
    setTimeout(checkVisibleElements, 5000);
    setTimeout(checkVisibleElements, 10000);


    function initCharts(chartTitle, containerId, dataPoints) {
        const tabPanel = createLinearLogTabbedPanels();
        const container = qs(`#${containerId}`);
        if (!container) {
            console.log({containerId});
            return;
        }

        container.appendChild(tabPanel.panel);

        chartContainers.add({container, initFunc: () => {
                initChart(chartTitle, tabPanel.linearTabId, dataPoints, false);
            }});

        // To save cpu, we wont init the log & growth chart until they click the tab.
        container.querySelector(`a[href='#${tabPanel.logTabId}']`).addEventListener('click', evt => {
            initChart(chartTitle, tabPanel.logTabId, dataPoints, true);
        });
        container.querySelector(`a[href='#${tabPanel.linearGrowthTabId}']`).addEventListener('click', evt => {
            // initChart(chartTitle, tabPanel.linearGrowthTabId, dataPoints, false, true, 1);
            initChart(chartTitle, tabPanel.linearGrowthTabId, dataPoints, false, true, 3);
        });

    }

    function initChart(chartTitle, containerId, dataPoints, useLogAxis, chartGrowthRate = false, growthRateLookbackDays) {
        const scaleType = useLogAxis ? 'logarithmic' : 'linear';
        const container = qs("#" + containerId);
        if (!container) {
            return;
        }
        if (!container.chartInitialized) {
            container.chartInitialized = true;
        }
        Highcharts.chart(containerId, {
            chart: {
                type: 'line'
            },
            title: {
                text: (chartGrowthRate ? `${growthRateLookbackDays}-day Avg Daily Growth Rate of ` : '') + chartTitle
            },

            subtitle: {
                text: `(${scaleType} scale)`
            },

            xAxis: {
                categories: dataPoints.map(p => p.x)
                // categories: ["Feb 15","Feb 16","Feb 17","Feb 18","Feb 19","Feb 20","Feb 21","Feb 22","Feb 23","Feb 24","Feb 25","Feb 26","Feb 27","Feb 28","Feb 29","Mar 01","Mar 02","Mar 03","Mar 04","Mar 05","Mar 06","Mar 07","Mar 08","Mar 09","Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 21","Mar 22","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 28","Mar 29"]
            },
            yAxis: [
                {
                    title: {
                        text: chartGrowthRate ? 'Case Growth %' : 'Num Cases'
                    },
                    type: scaleType

                },
                {
                    title: {
                        text: chartGrowthRate ? 'Death Growth %' : 'Num Deaths'
                    },
                    opposite: true,
                    type: scaleType

                }

            ],
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: chartGrowthRate ?  `${growthRateLookbackDays}-day Avg Daily Case Growth Rate % ` : 'Cases',
                    color: '#0031ff',
                    lineWidth: 5,
                    yAxis: 0,
                    data:chartGrowthRate ? calcGrowthRate(dataPoints.map(p => p.y1), growthRateLookbackDays) : dataPoints.map(p => p.y1)
                    // data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,6,9,11,12,15,19,22,26,30,38,41,48,57,69,87,110,150,206,255,301,414,555,780,1027,1295,1695,2220,2583]
                },
                {
                    name: chartGrowthRate ?  `${growthRateLookbackDays}-day Avg Daily Death Growth Rate % ` : 'Deaths',
                    color: '#ff0800',
                    lineWidth: 5,
                    yAxis: 1,
                    data: chartGrowthRate ? calcGrowthRate(dataPoints.map(p => p.y2), growthRateLookbackDays) : dataPoints.map(p => p.y2)
                    // data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,6,9,11,12,15,19,22,26,30,38,41,48,57,69,87,110,150,206,255,301,414,555,780,1027,1295,1695,2220,2583]
                }
            ],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 400
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });
    }

    function calcGrowthRate(dataPoints, numPeriods) {
        // const newDataPoints = [];
        const newDataPoints = Array(numPeriods).fill(0, 0, numPeriods);
        for (let i = numPeriods, m = dataPoints.length; i < m; i++) {
            const start = dataPoints[i - numPeriods];
            const end = dataPoints[i];
            newDataPoints.push(round(100 * returnRate(start, end, numPeriods)));
        }
        return newDataPoints;
    }

    function returnRate(presentVal, futureVal, numPeriods) {
        return Math.pow(futureVal / presentVal, 1.0 / numPeriods) - 1.0;
    }

    function round(num, digits = 2) {
        return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
    }


    /**
     * Recursively creates dom elements from your html string.
     *
     * @param {string} htmlStr
     * @return {DocumentFragment}
     */
    function htmlToFragment(htmlStr) {
        const template = document.createElement('template');
        template.innerHTML = htmlStr;
        return template.content;
    }

    /**
     * Recursively creates dom elements from your html string. Only the first top-level element will be returned.
     *
     * @example htmlToElements('  <label>foo <input value=123></label>').querySelector('input').value === '123'
     * @param {string} htmlStr
     * @return {Element}
     */
    function htmlToElements(htmlStr) {
        return htmlToFragment(htmlStr).firstElementChild;
    }


})();