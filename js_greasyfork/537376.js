// ==UserScript==
// @name          Cursor Dashboard Enhancer
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   Fixed chart selector to handle dynamic chart container IDs, making it work on date range changes.
// @author        Gemini 2.5 Pro, NoahBPeterson
// @match         https://www.cursor.com/dashboard
// @match         https://cursor.com/dashboard
// @grant         none
// @run-at        document-idle
// @icon          https://www.cursor.com/favicon-48x48.png
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/537376/Cursor%20Dashboard%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/537376/Cursor%20Dashboard%20Enhancer.meta.js
// ==/UserScript==

(function() { // Main Tampermonkey IIFE START
    'use_strict';

    let injectionDone = false;
    // This is the key fix: Use a generic attribute selector.
    const CHART_HOST_SELECTOR = 'div[data-highcharts-chart]';

    const DATE_RANGE_BUTTON_CONTAINER_SELECTOR = '.min-w-\\[180px\\] .flex.items-center.gap-2';
    const DATE_RANGE_BUTTON_SELECTOR = 'button';
    const METRIC_CARDS_PARENT_SELECTOR = '.mb-4.grid.grid-cols-2';
    const METRIC_CARD_SELECTOR = 'div.flex.cursor-pointer';
    const DELAY_AFTER_MOUSEOVER_FOR_POLL_MS = 50;

    let mainChartContentObserver = null;
    let initialElementsObserver = null;
    let eventTriggerDebounceTimer = null;

    let handlePotentialChartChangeGlobal;
    let setupDynamicListenersGlobal;
    let fetchInvoiceDataAndApply;
    let injectAndInitializeGlobal;
    let triggerFakeMouseInteraction;


    const codeToInject = function() {

        // Use the same generic selector inside the injected code.
        const chartContainerSelector_Injected = 'div[data-highcharts-chart]';
        const pathSelector = 'path.highcharts-graph';
        const POLLING_INTERVAL_MS = 75;
        let persistentPollTimer = null;
        const HC = window._Highcharts || window.Highcharts;

        function getUTCDateKey_v1733(timestamp) {
            const date = new Date(timestamp);
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function parseMonthDayCategory_v1733(categoryString, referenceYear) {
            if (typeof categoryString !== 'string') return null;
            const dateMatch = categoryString.match(/([a-zA-Z]+)\s+(\d+)/i);
            if (dateMatch) {
                const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                const monthIndex = monthNames.indexOf(dateMatch[1].toLowerCase());
                if (monthIndex !== -1) {
                    const day = parseInt(dateMatch[2], 10);
                    if (!isNaN(day) && day >= 1 && day <= 31) {
                        return { year: referenceYear, month: monthIndex, day: day };
                    }
                }
            }
            return null;
        }

        function buildDateToXValueMap_v1733(chart, referenceYearForCategories) {
            const dateToXMap = new Map();
            let earliestDateFound = null;
            let latestDateFound = null;

            if (!chart) { console.warn("MapBuilder_v1733: Chart object is null."); return { map: dateToXMap, firstDate: null, lastDate: null }; }
            if (!chart.series || chart.series.length === 0) { console.warn("MapBuilder_v1733: Chart has no series."); return { map: dateToXMap, firstDate: null, lastDate: null }; }
            if (!chart.xAxis || !chart.xAxis[0]) { console.warn("MapBuilder_v1733: Chart has no xAxis[0]."); return { map: dateToXMap, firstDate: null, lastDate: null }; }

            const existingSeries = chart.series.find(s => s.visible && s.data && s.data.length > 0 && s.xAxis);
            if (!existingSeries) { console.warn("MapBuilder_v1733: No suitable existing series found."); return { map: dateToXMap, firstDate: null, lastDate: null }; }

            const xAxis = existingSeries.xAxis;

            existingSeries.data.forEach((point) => {
                if (!point || typeof point.x === 'undefined') return;

                let dateKeyToStore;
                let displayCategory = typeof point.category === 'string' ? point.category : (xAxis.categories && xAxis.categories[point.x]);
                let pointDateForMinMax = null;

                if (xAxis.options.type === 'datetime') {
                    pointDateForMinMax = new Date(point.x);
                    dateKeyToStore = getUTCDateKey_v1733(point.x);
                } else if (typeof displayCategory === 'string') {
                    const parsedCatDate = parseMonthDayCategory_v1733(displayCategory, referenceYearForCategories);
                    if (parsedCatDate) {
                        pointDateForMinMax = new Date(Date.UTC(parsedCatDate.year, parsedCatDate.month, parsedCatDate.day));
                        dateKeyToStore = getUTCDateKey_v1733(pointDateForMinMax.getTime());
                    } else if (displayCategory.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        dateKeyToStore = displayCategory;
                        const parts = displayCategory.split('-');
                        if (parts.length === 3) pointDateForMinMax = new Date(Date.UTC(parseInt(parts[0],10), parseInt(parts[1],10)-1, parseInt(parts[2],10)));
                    }
                } else if (Array.isArray(xAxis.categories) && xAxis.categories[point.x]) {
                    displayCategory = xAxis.categories[point.x];
                    const parsedCatDate = parseMonthDayCategory_v1733(displayCategory, referenceYearForCategories);
                    if (parsedCatDate) {
                        pointDateForMinMax = new Date(Date.UTC(parsedCatDate.year, parsedCatDate.month, parsedCatDate.day));
                        dateKeyToStore = getUTCDateKey_v1733(pointDateForMinMax.getTime());
                    } else if (typeof displayCategory === 'string' && displayCategory.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        dateKeyToStore = displayCategory;
                        const parts = displayCategory.split('-');
                         if (parts.length === 3) pointDateForMinMax = new Date(Date.UTC(parseInt(parts[0],10), parseInt(parts[1],10)-1, parseInt(parts[2],10)));
                    }
                }

                if (pointDateForMinMax && !isNaN(pointDateForMinMax.getTime())) {
                    if (!earliestDateFound || pointDateForMinMax.getTime() < earliestDateFound.getTime()) {
                        earliestDateFound = new Date(pointDateForMinMax.getTime());
                    }
                    if (!latestDateFound || pointDateForMinMax.getTime() > latestDateFound.getTime()) {
                        latestDateFound = new Date(pointDateForMinMax.getTime());
                    }
                }

                if (dateKeyToStore && !dateToXMap.has(dateKeyToStore)) {
                    dateToXMap.set(dateKeyToStore, point.x);
                }
            });
            return { map: dateToXMap, firstDate: earliestDateFound, lastDate: latestDateFound };
        }
        window.buildDateToXValueMap_v1733 = buildDateToXValueMap_v1733;

        function parsePathD(d){const p=[];if(!d)return p;const c=d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/ig);if(!c)return p;let x=0,y=0;c.forEach(s=>{const t=s[0],a=s.substring(1).trim();if(t.toUpperCase()!=="Z"&&!a&&s.length>1)return;const e=a?a.split(/[\s,]+/).map(parseFloat):[];if(e.some(isNaN))return;if(t==="M"||t==="m")for(let n=0;n<e.length;n+=2){if(n+1>=e.length)break;let o=e[n],r=e[n+1];t==="m"&&(o+=x,r+=y),p.push({x:o,y:r}),x=o,y=r}else if(t==="L"||t==="l")for(let n=0;n<e.length;n+=2){if(n+1>=e.length)break;let o=e[n],r=e[n+1];t==="l"&&(o+=x,r+=y),p.push({x:o,y:r}),x=o,y=r}else if(t==="H"||t==="h")for(let n=0;n<e.length;n++){let o=e[n];t==="h"&&(o+=x),p.push({x:o,y:y}),x=o}else if(t==="V"||t==="v")for(let n=0;n<e.length;n++){let o=e[n];t==="v"&&(o+=y),p.push({x:x,y:o}),y=o}});return p};
        function getControlPoints(p0,p1,p2,p3){const x1=p1.x+(p2.x-p0.x)/6,y1=p1.y+(p2.y-p0.y)/6,x2=p2.x-(p3.x-p1.x)/6,y2=p2.y-(p3.y-p1.y)/6;return[{x:x1,y:y1},{x:x2,y:y2}]};
        function pointsToSplinePath(p){if(p.length<2)return"";let d=`M ${p[0].x.toFixed(3)} ${p[0].y.toFixed(3)}`;if(p.length===2)return d+=` L ${p[1].x.toFixed(3)} ${p[1].y.toFixed(3)}`;for(let i=0;i<p.length-1;i++){const p0=p[i===0?0:i-1],p1=p[i],p2=p[i+1],p3=p[i+2<p.length?i+2:p.length-1],cps=getControlPoints(p0,p1,p2,p3);d+=` C ${cps[0].x.toFixed(3)} ${cps[0].y.toFixed(3)}, ${cps[1].x.toFixed(3)} ${cps[1].y.toFixed(3)}, ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`}return d};

        function smoothAllChartPaths() {
            const el = document.querySelector(chartContainerSelector_Injected);
            if (!el || !HC) return;
            el.querySelectorAll(pathSelector).forEach((pEl) => {
                const d = pEl.getAttribute('d');
                if (!d || d.toUpperCase().includes('C') || pEl.dataset.smoothedByV1733 === 'true') return;
                const pts = parsePathD(d);
                if (pts.length < 2) return;
                const nD = pointsToSplinePath(pts);
                if (nD && nD !== d) { pEl.setAttribute('d', nD); pEl.dataset.smoothedByV1733 = 'true';}
            });
        }
        if (persistentPollTimer) clearInterval(persistentPollTimer);
        persistentPollTimer = setInterval(smoothAllChartPaths, POLLING_INTERVAL_MS);
        window.forceChartCheckBySmoother_v1733 = smoothAllChartPaths;

        function ensureSecondaryYAxis_v1733(chart, axisId, axisTitle) {
            let yAxisObj = chart.yAxis.find(axis => axis.options.id === axisId);
            if (!yAxisObj) {
                yAxisObj = chart.addAxis({ id: axisId, title: { text: axisTitle }, opposite: true, gridLineWidth: 0, min: 0 }, false, true);
                yAxisObj = chart.yAxis.find(axis => axis.options.id === axisId);
            }
            if (!yAxisObj || typeof yAxisObj.index === 'undefined') {
                console.error(`Injected Script (v1.7.33): Y-axis '${axisId}' problem. Index: ${yAxisObj ? yAxisObj.index : 'N/A'}.`);
                return -1;
            }
            return yAxisObj.index;
        }
        window.ensureSecondaryYAxis_v1733 = ensureSecondaryYAxis_v1733;

        window.logInjectedChartAxes_v1733=function(chart,stage){if(chart&&chart.xAxis){chart.xAxis.forEach((axis,i)=>{console.log(`  xAxis[${i}]: id='${axis.options.id}', type='${axis.options.type}', index=${axis.index}, categories=${axis.categories?axis.categories.length:"none"}, min=${axis.min}, max=${axis.max}, dataMin=${axis.dataMin}, dataMax=${axis.dataMax}`)})}else{console.log("  No xAxes found.")}if(chart&&chart.yAxis){chart.yAxis.forEach((axis,i)=>{console.log(`  yAxis[${i}]: id='${axis.options.id}', title='${axis.options.title?.text}', index=${axis.index}, opposite=${axis.options.opposite}, min=${axis.min}, max=${axis.max}`)})}else{console.log("  No yAxes found.")}};

        function processAndAddDailyUsageSeries_v1733(responseData, seriesConfig, dateToXValueMapParam) {
            if(!HC||!HC.charts)return!1;const chart=HC.charts.find(c=>c&&c.renderTo===document.querySelector(chartContainerSelector_Injected));if(!chart||!chart.xAxis||!chart.xAxis[0])return!1;

            let dailyCountsPerDateKey = {};
            if (responseData && Array.isArray(responseData.usageEvents)) {
                responseData.usageEvents.forEach(event => {
                    let tsStr = event.timestamp;
                    if (typeof tsStr !== 'string' || tsStr.length === 0) return;
                    let tsNum = parseInt(tsStr, 10);
                    if (!isNaN(tsNum) && tsNum > 0) {
                        const dateKey = getUTCDateKey_v1733(tsNum);
                        dailyCountsPerDateKey[dateKey] = (dailyCountsPerDateKey[dateKey] || 0) + 1;
                    }
                });
            }

            let transformedDataPoints = [];
            dateToXValueMapParam.forEach((originalX, dateKey_fromMap) => {
                const count = dailyCountsPerDateKey[dateKey_fromMap] || 0;
                transformedDataPoints.push([originalX, count]);
            });

            if (transformedDataPoints.length === 0 && dateToXValueMapParam.size > 0) {
                 console.warn(`DailyUsage_v1733: No data points generated for ${seriesConfig.name}, map had ${dateToXValueMapParam.size} entries.`);
            } else if (transformedDataPoints.length === 0 && dateToXValueMapParam.size === 0) {
                console.warn(`DailyUsage_v1733: No data points and map is empty for ${seriesConfig.name}.`);
                return false;
            }

            transformedDataPoints.sort((a,b)=>a[0]-b[0]);
            const seriesOptions={name:seriesConfig.name,data:transformedDataPoints,type:seriesConfig.type||"line",color:seriesConfig.color,yAxis:0,tooltip:{pointFormatter:function(){const pointXDate = (this.series.xAxis.options.type === 'datetime') ? this.x : (this.series.xAxis.categories ? this.series.xAxis.categories[this.x] : this.x); return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${this.y}</b> events (${typeof pointXDate === 'number' && this.series.xAxis.options.type === 'datetime' ? HC.dateFormat('%b %e', pointXDate) : pointXDate})<br/>`}},marker:seriesConfig.marker||{enabled:transformedDataPoints.length<30,radius:3}};
            let existingSeries=chart.series.find(s=>s.name===seriesConfig.name&&s.yAxis.index===0);existingSeries?existingSeries.update(seriesOptions,!1):chart.addSeries(seriesOptions,!1);return!0;
        };
        window.processAndAddDailyUsageSeries_v1733 = processAndAddDailyUsageSeries_v1733;

        function processAndAddDailyCostSeries_v1733(responseData, seriesConfig, dateToXValueMapParam, yAxisIndexForDollars) {
            if (!HC || !HC.charts) { return false; }
            const chart = HC.charts.find(c => c && c.renderTo === document.querySelector(chartContainerSelector_Injected));
            if (!chart) { return false; }
            if (typeof yAxisIndexForDollars !== 'number' || yAxisIndexForDollars < 0) { console.error(`DailyCost_v1733: Invalid Y-idx (${yAxisIndexForDollars}).`); return false; }

            let dailyPriceCentsPerDateKey = {};
            if (responseData && Array.isArray(responseData.usageEvents)) {
                responseData.usageEvents.forEach(event => {
                    let tsStr=event.timestamp,priceCents=event.priceCents;
                    if("string"!=typeof tsStr||0===tsStr.length||"number"!=typeof priceCents)return;
                    let tsNum=parseInt(tsStr,10);
                    if(!isNaN(tsNum)&&tsNum>0){
                        const dateKey = getUTCDateKey_v1733(tsNum);
                        dailyPriceCentsPerDateKey[dateKey]=(dailyPriceCentsPerDateKey[dateKey]||0)+priceCents;
                    }
                });
            }

            let transformedDataPoints = [];
            dateToXValueMapParam.forEach((originalX, dateKey_fromMap) => {
                const costInCents = dailyPriceCentsPerDateKey[dateKey_fromMap] || 0;
                transformedDataPoints.push([originalX, parseFloat((costInCents / 100).toFixed(2))]);
            });

            if (transformedDataPoints.length === 0 && dateToXValueMapParam.size > 0) {
                 console.warn(`DailyCost_v1733: No data points generated for ${seriesConfig.name}, map had ${dateToXValueMapParam.size} entries.`);
            } else if (transformedDataPoints.length === 0 && dateToXValueMapParam.size === 0) {
                console.warn(`DailyCost_v1733: No data points and map is empty for ${seriesConfig.name}.`);
                return false;
            }

            transformedDataPoints.sort((a,b)=>a[0]-b[0]);
            const seriesOptions={name:seriesConfig.name,data:transformedDataPoints,type:seriesConfig.type||"line",color:seriesConfig.color,yAxis:yAxisIndexForDollars,tooltip:{pointFormatter:function(){const pointXDate = (this.series.xAxis.options.type === 'datetime') ? this.x : (this.series.xAxis.categories ? this.series.xAxis.categories[this.x] : this.x); return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>$${this.y.toFixed(2)}</b> (${typeof pointXDate === 'number' && this.series.xAxis.options.type === 'datetime' ? HC.dateFormat('%b %e', pointXDate) : pointXDate})<br/>`}},marker:seriesConfig.marker||{enabled:transformedDataPoints.length<30,radius:2}};
            console.log(`Injected Script (v1.7.33): LOGGING DATA for series '${seriesConfig.name}' (points: ${seriesOptions.data.length}, yAxisIndex: ${seriesOptions.yAxis}): First 5:`,JSON.parse(JSON.stringify(seriesOptions.data.slice(0,5))));
            let existingSeries=chart.series.find(s=>s.name===seriesConfig.name&&s.yAxis.index===yAxisIndexForDollars);existingSeries?existingSeries.update(seriesOptions,!1):chart.addSeries(seriesOptions,!1);return true;
        };
        window.processAndAddDailyCostSeries_v1733 = processAndAddDailyCostSeries_v1733;

        function processAndAddPricingSeries_v1733(responseData, dateToXValueMapParam) {
            const HC_local=window._Highcharts||window.Highcharts;if(!HC_local||!responseData||!responseData.pricingDescription||"string"!=typeof responseData.pricingDescription.description)return!1;const pricingString=responseData.pricingDescription.description,chart=HC_local.charts.find(c=>c&&c.renderTo===document.querySelector(chartContainerSelector_Injected));if(!chart||!chart.xAxis||!chart.xAxis[0])return!1;const includedRequestsMatch=pricingString.match(/(\d+)\s+requests\s+per\s+day\s+included/i);let pricingSeriesChanged=!1;if(includedRequestsMatch&&includedRequestsMatch[1]){const includedRequests=parseInt(includedRequestsMatch[1],10),xAxis=chart.xAxis[0],extremes=xAxis.getExtremes();let xMin=xAxis.min,xMax=xAxis.max;if("number"!=typeof xMin||"number"!=typeof xMax||xMin===xMax)if(dateToXValueMapParam&&dateToXValueMapParam.size>0){const mappedXValues=Array.from(dateToXValueMapParam.values()).filter(x=>"number"==typeof x);mappedXValues.length>0?(xMin=Math.min(...mappedXValues),xMax=Math.max(...mappedXValues)):(xMin=extremes.dataMin,xMax=extremes.dataMax)}else xMin=extremes.dataMin,xMax=extremes.dataMax;if("number"!=typeof xMin||"number"!=typeof xMax||xMin===xMax)xMin=0,xMax=dateToXValueMapParam.size>0?dateToXValueMapParam.size-1:chart.xAxis[0].categories?chart.xAxis[0].categories.length-1:10;if("number"==typeof xMin&&"number"==typeof xMax&&xMax>=xMin){const quotaData=[[xMin,includedRequests],[xMax,includedRequests]],seriesName="Daily Included Requests Quota",seriesOptions={name:seriesName,data:quotaData,type:"line",color:"forestgreen",dashStyle:"shortdash",marker:{enabled:!1},zIndex:1,yAxis:0};console.log(`Injected Script (v1.7.33): LOGGING DATA for series '${seriesName}' (points: ${seriesOptions.data.length}, yAxisIndex: ${seriesOptions.yAxis}):`,JSON.parse(JSON.stringify(seriesOptions.data.slice(0,5))));let existingQuotaSeries=chart.series.find(s=>s.name===seriesName&&s.yAxis.index===0);existingQuotaSeries?existingQuotaSeries.update(seriesOptions,!1):chart.addSeries(seriesOptions,!1),pricingSeriesChanged=!0}}return pricingSeriesChanged
        };
        window.processAndAddPricingSeries_v1733 = processAndAddPricingSeries_v1733;

        if(window.smoothCursorChartPollerReadyCallbacks_v1733) {
            window.smoothCursorChartPollerReadyCallbacks_v1733.forEach(cb => cb());
            delete window.smoothCursorChartPollerReadyCallbacks_v1733;
        }
        window.isSmoothCursorChartPollerReady_v1733 = true;
        console.log('Injected Script (v1.7.33): Initialized. HC object available:', !!HC);
    };

    async function fetchAndProcessMonthData(month, year, contextChart, isPrimaryCall) {
        const requestPayload = { month, year, includeUsageEvents: true };
        try {
            const response = await fetch('/api/dashboard/get-monthly-invoice', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': '*/*', },
                body: JSON.stringify(requestPayload)
            });
            if (!response.ok) { console.error(`TM Script (v1.7.33): HTTP error ${response.status} for ${year}-${month+1}`); return null; }
            const data = await response.json();
            data.requestContext = { month, year, isPrimaryCall };
            return data;
        } catch (error) { console.error(`TM Script (v1.7.33): Network error for ${year}-${month+1}:`, error); return null; }
    }

    fetchInvoiceDataAndApply = async function() {
        console.log("Tampermonkey Script (v1.7.33): fetchInvoiceDataAndApply triggered.");
        const HC_instance = window._Highcharts || window.Highcharts;
        if (!HC_instance) {
            console.warn("TM Script (v1.7.33): Highcharts instance not found at start of fetchInvoiceDataAndApply.");
            return;
        }

        const initialChartContainer = document.querySelector(CHART_HOST_SELECTOR);
        if (!initialChartContainer || !initialChartContainer.isConnected) {
            console.warn("TM Script (v1.7.33): Initial chart container not found or disconnected. Aborting.");
            return;
        }
        let chartForMapBuilding = null;
        if (HC_instance.charts) {
            chartForMapBuilding = HC_instance.charts.find(c => c && c.renderTo === initialChartContainer);
        }
        if (!chartForMapBuilding) {
            console.warn("TM Script (v1.7.33): Initial chart instance for map building not found. Aborting.");
            if (HC_instance.charts) HC_instance.charts.forEach((ch,i) => console.log(`  Debug: Available chart ${i} renders to ${ch ? ch.renderTo?.id : 'N/A'}`));
            return;
        }
        console.log(`TM Script (v1.7.33): Initial chart acquired (title: "${chartForMapBuilding.options.title?.text || 'N/A'}", categories: ${chartForMapBuilding.xAxis[0].categories ? chartForMapBuilding.xAxis[0].categories.length : 'N/A'}).`);

        let apiYear = new Date().getFullYear();
        let apiMonth = new Date().getMonth();

        if (typeof window.buildDateToXValueMap_v1733 === 'function') {
            const mapInfoResult = window.buildDateToXValueMap_v1733(chartForMapBuilding, apiYear);
            if (mapInfoResult && mapInfoResult.lastDate) {
                apiYear = mapInfoResult.lastDate.getUTCFullYear();
                apiMonth = mapInfoResult.lastDate.getUTCMonth();
                console.log(`TM Script (v1.7.33): API call will primarily target month/year from chart's last date: ${apiYear}-${String(apiMonth + 1).padStart(2,'0')}`);
            } else {
                console.warn(`TM Script (v1.7.33): Defaulting API call. mapInfoResult.lastDate was ${mapInfoResult ? (mapInfoResult.lastDate ? mapInfoResult.lastDate.toISOString().substring(0,10) : 'null') : 'undefined'}`);
            }
        } else {
            console.warn("TM Script (v1.7.33): buildDateToXValueMap_v1733 not found. Defaulting API call params.");
        }

        const apiResponses = [];
        console.log(`TM Script (v1.7.33): Fetching primary data for ${apiYear}-${String(apiMonth + 1).padStart(2,'0')}`);
        const primaryData = await fetchAndProcessMonthData(apiMonth, apiYear, chartForMapBuilding, true);
        if (primaryData) {
            apiResponses.push(primaryData);
        } else {
            console.warn(`TM Script (v1.7.33): Primary data fetch failed for ${apiYear}-${String(apiMonth+1).padStart(2,'0')}. Aborting.`);
            return;
        }

        if (typeof window.buildDateToXValueMap_v1733 === 'function') {
            const mapInfoResultAgain = window.buildDateToXValueMap_v1733(chartForMapBuilding, apiYear);
            if (mapInfoResultAgain && mapInfoResultAgain.firstDate) {
                const firstDayOfPrimaryDataMonth = new Date(Date.UTC(apiYear, apiMonth, 1));
                if (mapInfoResultAgain.firstDate.getTime() < firstDayOfPrimaryDataMonth.getTime()) {
                    let prevMonth = apiMonth - 1;
                    let prevYear = apiYear;
                    if (prevMonth < 0) { prevMonth = 11; prevYear--; }
                    console.log(`TM Script (v1.7.33): Chart's earliest date (${mapInfoResultAgain.firstDate.toISOString().substring(0,10)}) is before primary data month's first day (${firstDayOfPrimaryDataMonth.toISOString().substring(0,10)}). Fetching data for ${prevYear}-${String(prevMonth+1).padStart(2,'0')}`);
                    const secondaryData = await fetchAndProcessMonthData(prevMonth, prevYear, chartForMapBuilding, false);
                    if (secondaryData) apiResponses.push(secondaryData);
                } else {
                     console.log(`TM Script (v1.7.33): Chart's earliest date (${mapInfoResultAgain.firstDate.toISOString().substring(0,10)}) is NOT before primary data month's first day (${firstDayOfPrimaryDataMonth.toISOString().substring(0,10)}). No secondary fetch needed.`);
                }
            } else {
                console.warn(`TM Script (v1.7.33): Could not determine chart's first date to check for previous month's data need.`);
            }
        }

        if (apiResponses.length === 0) { console.warn("TM Script (v1.7.33): No data fetched from any source. Aborting."); return; }

        const combinedUsageEvents = [];
        apiResponses.forEach(resp => { if (resp && resp.usageEvents) combinedUsageEvents.push(...resp.usageEvents); });
        console.log(`TM Script (v1.7.33): Combined ${combinedUsageEvents.length} usage events from ${apiResponses.length} API responses.`);

        const finalResponseData = {
            usageEvents: combinedUsageEvents,
            items: primaryData.items || [],
            pricingDescription: primaryData.pricingDescription || {},
        };

        const finalChartContainer = document.querySelector(CHART_HOST_SELECTOR);
        if (!finalChartContainer || !finalChartContainer.isConnected) {
            console.warn(`TM Script (v1.7.33): Final chart container not found or disconnected before series processing. Aborting.`);
            return;
        }
        let chartForSeriesProcessing = null;
        if (HC_instance.charts) {
            chartForSeriesProcessing = HC_instance.charts.find(c => c && c.renderTo === finalChartContainer);
        }
        if (!chartForSeriesProcessing) {
            console.warn(`TM Script (v1.7.33): Chart instance for series processing not found. Aborting.`);
            if (HC_instance.charts) HC_instance.charts.forEach((ch,i) => console.log(`  Debug: Available chart ${i} renders to ${ch ? ch.renderTo?.id : 'N/A'}, isConnected: ${ch && ch.renderTo ? ch.renderTo.isConnected : 'N/A'}`));
            return;
        }
        console.log(`TM Script (v1.7.33): Chart for series processing acquired (title: "${chartForSeriesProcessing.options.title?.text || 'N/A'}", categories: ${chartForSeriesProcessing.xAxis[0].categories ? chartForSeriesProcessing.xAxis[0].categories.length : 'N/A'}).`);

        const finalMapBuildResult = typeof window.buildDateToXValueMap_v1733 === 'function' ? window.buildDateToXValueMap_v1733(chartForSeriesProcessing, apiYear) : null;
        const dateToXValueMapForSeries = finalMapBuildResult ? finalMapBuildResult.map : new Map();

        if (!finalMapBuildResult || dateToXValueMapForSeries.size === 0) {
            console.warn("TM Script (v1.7.33): Final dateToXValueMap for series is empty or couldn't be built. Aborting series addition.");
            return;
        }
        console.log(`TM Script (v1.7.33): Final dateToXValueMap (size ${dateToXValueMapForSeries.size}) obtained. First: ${finalMapBuildResult.firstDate ? finalMapBuildResult.firstDate.toISOString().substring(0,10) : 'N/A'}, Last: ${finalMapBuildResult.lastDate ? finalMapBuildResult.lastDate.toISOString().substring(0,10) : 'N/A'}`);

        if (typeof window.logInjectedChartAxes_v1733 === 'function') { window.logInjectedChartAxes_v1733(chartForSeriesProcessing, "Before Any Script Operations This Cycle"); }

        let yAxisIndexForDollars = -1;
        if (typeof window.ensureSecondaryYAxis_v1733 === 'function') {
            yAxisIndexForDollars = window.ensureSecondaryYAxis_v1733(chartForSeriesProcessing, 'dollarsYAxis_v1733', 'Cost (Dollars)');
            if (yAxisIndexForDollars !== -1) {
                const refreshedChart = HC_instance.charts.find(c => c && c.renderTo === finalChartContainer);
                if (refreshedChart) {
                    chartForSeriesProcessing = refreshedChart;
                } else {
                    console.error("TM Script (v1.7.33): Chart lost after Y-axis ensure. Critical error. Aborting.");
                    return;
                }
            } else {
                 console.error("TM Script (v1.7.33): Failed to ensure secondary Y-axis. Aborting.");
                 return;
            }
        } else { console.error("TM Script (v1.7.33): ensureSecondaryYAxis_v1733 not found. Aborting."); return; }

        if (typeof window.logInjectedChartAxes_v1733 === 'function') { window.logInjectedChartAxes_v1733(chartForSeriesProcessing, "After ensureSecondaryYAxis in wrapper"); }

        let anySeriesDataChanged = false;
        if (typeof window.processAndAddDailyUsageSeries_v1733 === 'function') {
            if(window.processAndAddDailyUsageSeries_v1733(finalResponseData, { name: 'Daily Event Count', type: 'line', color: '#3498db', }, dateToXValueMapForSeries)) { anySeriesDataChanged = true; }
        }
        if (typeof window.processAndAddDailyCostSeries_v1733 === 'function') {
            if(window.processAndAddDailyCostSeries_v1733(finalResponseData, { name: 'Daily Usage Cost ($)', type: 'line', color: '#e67e22' }, dateToXValueMapForSeries, yAxisIndexForDollars )) { anySeriesDataChanged = true; }
        }
        if (typeof window.processAndAddPricingSeries_v1733 === 'function') {
            if(window.processAndAddPricingSeries_v1733(finalResponseData, dateToXValueMapForSeries)) { anySeriesDataChanged = true; }
        }

        if (anySeriesDataChanged) {
            console.log("Tampermonkey Script (v1.7.33): Requesting final chart redraw.");
            if (typeof window.logInjectedChartAxes_v1733 === 'function') { window.logInjectedChartAxes_v1733(chartForSeriesProcessing, "After All Series Processing, Before Final Redraw"); }
            chartForSeriesProcessing.redraw();
            if (typeof window.logInjectedChartAxes_v1733 === 'function') { setTimeout(() => { const finalChart = HC_instance.charts.find(c => c && c.renderTo === finalChartContainer); if(finalChart) window.logInjectedChartAxes_v1733(finalChart, "After Final Redraw"); }, 100); }
            setTimeout(() => window.forceChartCheckBySmoother_v1733 && window.forceChartCheckBySmoother_v1733(), 200);
        } else { console.log("Tampermonkey Script (v1.7.33): No series data changes required a final redraw."); }
    };

    triggerFakeMouseInteraction=function(elementSelector){const targetElement=document.querySelector(elementSelector);if(targetElement){const e=new MouseEvent("mouseenter",{bubbles:!0,cancelable:!0,view:window}),t=new MouseEvent("mouseover",{bubbles:!0,cancelable:!0,view:window}),n=targetElement.querySelector('div[id^="highcharts-"]');(n||targetElement).dispatchEvent(e),(n||targetElement).dispatchEvent(t)}};
    handlePotentialChartChangeGlobal=function(){triggerFakeMouseInteraction(CHART_HOST_SELECTOR);clearTimeout(eventTriggerDebounceTimer);eventTriggerDebounceTimer=setTimeout(()=>{if("function"==typeof window.forceChartCheckBySmoother_v1733){const e=document.querySelector(CHART_HOST_SELECTOR);e&&e.querySelectorAll("path.highcharts-graph").forEach(el=>{el.dataset.smoothedByV1733="false"}),window.forceChartCheckBySmoother_v1733()}},DELAY_AFTER_MOUSEOVER_FOR_POLL_MS)};
    setupDynamicListenersGlobal=function(){if(mainChartContentObserver)mainChartContentObserver.disconnect();const e=document.querySelector(CHART_HOST_SELECTOR);if(e){mainChartContentObserver=new MutationObserver(()=>{window.handlePotentialChartChangeGlobal()});mainChartContentObserver.observe(e,{childList:!0,subtree:!0})}const t=[document.querySelector(METRIC_CARDS_PARENT_SELECTOR),document.querySelector(DATE_RANGE_BUTTON_CONTAINER_SELECTOR)].filter(el=>el);t.forEach(el=>{const listenerKey=`_hasSmoothClickListener_v1733_${el.id||el.className.replace(/\s+/g,"_").substring(0,30)}`;if(!el[listenerKey]){el.addEventListener("click",event=>{console.log(`TM Script (v1.7.33): Click detected on interactive element (class: ${el.className}), scheduling full update.`);let currentTarget=event.target;const relevantSelector=el.matches(METRIC_CARDS_PARENT_SELECTOR)?METRIC_CARD_SELECTOR:DATE_RANGE_BUTTON_SELECTOR;while(currentTarget&&currentTarget!==el){if(currentTarget.matches&&currentTarget.matches(relevantSelector)){window.handlePotentialChartChangeGlobal();setTimeout(()=>window.fetchInvoiceDataAndApply(),500);break}currentTarget=currentTarget.parentElement}});el[listenerKey]=!0}})}
    injectAndInitializeGlobal=function(){
        if(injectionDone)return;
        if(document.body){
            const scriptId="tampermonkeyChartLogic_v1_7_33";
            const existingScript=document.getElementById(scriptId);if(existingScript)existingScript.remove();
            const scriptEl=document.createElement("script");scriptEl.id=scriptId;scriptEl.type="text/javascript";
            scriptEl.textContent=`(${codeToInject.toString()})();`;document.body.appendChild(scriptEl);injectionDone=!0;
            window.smoothCursorChartPollerReadyCallbacks_v1733=window.smoothCursorChartPollerReadyCallbacks_v1733||[];
            const initCallback=()=>{console.log("TM Script (v1.7.33): Injected code ready, running initial setup.");window.handlePotentialChartChangeGlobal();window.setupDynamicListenersGlobal();window.fetchInvoiceDataAndApply()};
            window.smoothCursorChartPollerReadyCallbacks_v1733.push(initCallback);
            if(window.isSmoothCursorChartPollerReady_v1733&&"function"==typeof window.forceChartCheckBySmoother_v1733){
                console.log("TM Script (v1.7.33): Injected code was already ready, executing pending callbacks.");
                window.smoothCursorChartPollerReadyCallbacks_v1733.forEach(cb=>cb());
                delete window.smoothCursorChartPollerReadyCallbacks_v1733;
            }
            setTimeout(()=>{const tempScript=document.getElementById(scriptId);if(tempScript&&tempScript.parentNode)tempScript.parentNode.removeChild(tempScript)},2000)
        }else setTimeout(window.injectAndInitializeGlobal,200)
    };
    window.handlePotentialChartChangeGlobal = handlePotentialChartChangeGlobal;
    window.setupDynamicListenersGlobal = setupDynamicListenersGlobal;
    window.fetchInvoiceDataAndApply = fetchInvoiceDataAndApply;
    window.injectAndInitializeGlobal = injectAndInitializeGlobal;

    initialElementsObserver=new MutationObserver((mutations,observer)=>{const chartHost=document.querySelector(CHART_HOST_SELECTOR),dateButtons=document.querySelector(DATE_RANGE_BUTTON_CONTAINER_SELECTOR),metricCards=document.querySelector(METRIC_CARDS_PARENT_SELECTOR);if(chartHost&&(dateButtons||metricCards)){observer.disconnect();initialElementsObserver=null;window.injectAndInitializeGlobal()}});
    const chartHostInitial=document.querySelector(CHART_HOST_SELECTOR),dateButtonsInitial=document.querySelector(DATE_RANGE_BUTTON_CONTAINER_SELECTOR),metricCardsInitial=document.querySelector(METRIC_CARDS_PARENT_SELECTOR);
    if(chartHostInitial&&(dateButtonsInitial||metricCardsInitial)){console.log("TM Script (v1.7.33): Initial elements already present, injecting script immediately.");if(initialElementsObserver){initialElementsObserver.disconnect();initialElementsObserver=null}window.injectAndInitializeGlobal()}else if(initialElementsObserver){initialElementsObserver.observe(document.documentElement,{childList:!0,subtree:true});}

})();