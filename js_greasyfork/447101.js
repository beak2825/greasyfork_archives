// ==UserScript==
// @name         Elethor Scrapyard (Private Alpha)
// @description  :peepo:
// @namespace    https://www.elethor.com/
// @version      1.0.8
// @author       Xortrox
// @match        https://elethor.com/*
// @match        https://www.elethor.com/*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @connect      tracker.fnet.no
// @license MIT
// @require      https://code.highcharts.com/highcharts.js
// @downloadURL https://update.greasyfork.org/scripts/447101/Elethor%20Scrapyard%20%28Private%20Alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447101/Elethor%20Scrapyard%20%28Private%20Alpha%29.meta.js
// ==/UserScript==

(async function() {
    const scriptName = 'Elethor Scrapyard';
    const sendStateIntervalMS = 60 * 60 * 1000; // Every 60 minutes we post and clear state

    class APIService {
        constructor() {}

        async get (url) {
            const result = await GM.xmlHttpRequest({ method: 'GET', url });
            //console.log('GET result:', result.responseText);
            return JSON.parse(result.responseText);
        }

        async post (url, body) {
            const result = await GM.xmlHttpRequest({ method: 'POST', url, data: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
            //console.log('POST result:', result.responseText);
            return JSON.parse(result.responseText);
        }
    }

    async function getUserSelf() {
        const result = await unsafeWindow.axios.get(`/game/user`);
        return result.data;
    }

    async function getCompanionData() {
        const result = await unsafeWindow.axios.get(`/game/companions`);
        return result.data;
    }

    async function loadUser() {
        return await getUserSelf();
    }

    async function waitForField(target, field) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (target[field] !== undefined) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    await waitForField(unsafeWindow, 'axios');
    let currentUserData = await loadUser();

    if (currentUserData.user === undefined || currentUserData.user.id === undefined) {
        console.error(`$[{scriptName}]: No user ID found.`);
        return;
    }

    async function waitForEcho() {
        console.log(`[${scriptName}]: Waiting for Echo`);
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (unsafeWindow.Echo) {
                    clearInterval(interval);
                    console.log(`[${scriptName}]: Echo loaded.`);
                    resolve();
                }
            }, 100);
        });
    }
    await waitForEcho();

    unsafeWindow.UserScript = { APIService: new APIService() };

    const sendState = async () => {
        try {
            currentUserData = await loadUser();
            unsafeWindow.UserState = Object.assign({ userId: currentUserData.user.id }, currentUserData);

            const companionData = await getCompanionData();
            unsafeWindow.UserState = Object.assign(unsafeWindow.UserState, companionData);

            unsafeWindow.console.log(`[${scriptName}]: Posting state:`, unsafeWindow.UserState);
            unsafeWindow.UserScript.APIService.post(`https://tracker.fnet.no/time-series/${currentUserData.user.id}/?key=jksgocDTZHDTHDEZRTaescgokanew45gaojk3nwngo33g3a4gonjanaerGCAREGa`, unsafeWindow.UserState);
        } catch (e) {
            unsafeWindow.console.error(`[${scriptName}]: Error posting state:`, e);
        }
    }
    unsafeWindow.sendState = sendState;

    sendState();
    setInterval(sendState, sendStateIntervalMS);

    const seriesConfig = [
        'inventory.Gold.pivot.quantity',
        'inventory.Platinum.pivot.quantity',
        'inventory.Orthoclase.pivot.quantity',
        'inventory.Anorthite.pivot.quantity',
        'inventory.Ferrisum.pivot.quantity',
        'inventory.Rhenium.pivot.quantity',
        'inventory.Jaspil.pivot.quantity',
        'inventory.Skasix.pivot.quantity',
        'recyclobot.model.exchange_level',
        'recyclobot.model.level',
    ];

    function getSeriesByName(series, name) {
        return series.filter((serie) => serie.name === name);
    }

    const flattenObject = (obj, prefix = '') => {
        if (!obj) return '';

        return Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
            else acc[pre + k] = obj[k];
            return acc;
        }, {});
    };

    function generateDataPoint(entry) {
        console.log(flattenObject(entry));
    }

    function generateTimeSeries(data) {
        if (!data?.series) {
            //alert('No time series found in data object, see F12 -> console');
            console.warn('Time series data was:', data);
        }

        const timeSeries = [];
        const knownSeriesNames = {};

        for(const entry of data.series) {
            const newInventoryMap = {};
            entry?.inventory?.map((inventoryEntry) => { newInventoryMap[inventoryEntry.name] = inventoryEntry; });

            entry.inventory = newInventoryMap;

            const flattened = flattenObject(entry);
            const timestamp = new Date(entry.date).getTime();

            for (const key of Object.keys(flattened)) {
                if (typeof(flattened[key]) === 'number') {
                    let seriesName = key;

                    if (
                        seriesConfig.indexOf(seriesName) !== -1 ||
                        seriesName.includes('companions') && seriesName.includes('abilities') && !seriesName.includes('model') && seriesName.endsWith('.level')
                    ) {
                        if (knownSeriesNames[seriesName] === undefined) {
                            knownSeriesNames[seriesName] = [];
                        }

                        knownSeriesNames[seriesName].push([timestamp, flattened[key]]);
                    }
                }
            }
        }

        for (const key of Object.keys(knownSeriesNames)) {
            timeSeries.push({name: key, data: knownSeriesNames[key]});
        }

        // console.log(timeSeries);

        // console.log('getSeriesByName example:', getSeriesByName(timeSeries, 'gold'));

        return timeSeries;
    }

    const getTimeSeriesData = async(userId, from, to) => {
        const data = await unsafeWindow.UserScript.APIService.get(`https://tracker.fnet.no/time-series/${userId}/${from}/${to}/?key=jksgocDTZHDTHDEZRTaescgokanew45gaojk3nwngo33g3a4gonjanaerGCAREGa`);

        unsafeWindow.console.log(`[${scriptName}]: data:`, data);

        return data;
    };

    function initializeChart() {
        const chartContainer = unsafeWindow.document.createElement('div');
        chartContainer.setAttribute('style', 'z-index: 100000; position: fixed; top: 0; right: 0; left: 0; right: 0; height: 100%; width: 100%;');
        chartContainer.id = 'userScriptChart1';
        chartContainer.setAttribute('hidden', 'hidden');
        unsafeWindow.document.body.appendChild(chartContainer);

        const button = unsafeWindow.document.createElement('button');
        button.setAttribute('style', 'z-index: 100001; position: fixed; top: 0; right: 0; width: 100px; height: 25px;');
        button.id = 'userScriptButtonToggleChart1';
        button.innerText = 'Toggle Chart';
        unsafeWindow.document.body.appendChild(button);

        const button2 = unsafeWindow.document.createElement('button');
        button2.setAttribute('style', 'z-index: 100001; position: fixed; top: 30px; right: 0; width: 100px; height: 25px;');
        button2.id = 'userScriptButtonToggleChart2';
        button2.innerText = 'Toggle Series';
        unsafeWindow.document.body.appendChild(button2);

        const input1 = unsafeWindow.document.createElement('input');
        input1.setAttribute('style', 'z-index: 100001; position: fixed; top: 0; right: 110px; width: 150px; height: 25px;');
        input1.id = 'userIdInput';
        input1.setAttribute("autocomplete", "off");
        input1.setAttribute("type", "number");
        input1.setAttribute("placeholder", "Look up user ID");
        unsafeWindow.document.body.appendChild(input1);

        function everySeriesVisible() {
            return Highcharts.charts[0].series.every((entry) => { return entry.visible });
        }

        button2.addEventListener('click', async () => {
            if (everySeriesVisible()) {
                Highcharts.charts[0].series.map((serie) => { serie.hide(); });
            } else {
                Highcharts.charts[0].series.map((serie) => { serie.show(); });
            }
        });

        button.addEventListener('click', async () => {
            let state = chartContainer.getAttribute('hidden') === 'hidden';
            //console.log(state);
            //console.log(chartContainer.getAttribute('hidden'));

            if (!state) {
                chartContainer.setAttribute('hidden', 'hidden');
            } else {
                chartContainer.removeAttribute('hidden');

                //console.log('Fetching time-series.');
                const fromTime = Date.now() - 7 * 60 * 60 * 24 * 1000;// - new Date().getTimezoneOffset() * 60 * 1000;
                const toTime = Date.now();// - new Date().getTimezoneOffset() * 60 * 1000;

                unsafeWindow.console.log(`[${scriptName}]: timespan: ${fromTime} - ${toTime}`);

                const userId = input1.value || currentUserData.user.id;
                const timeSeriesData = await getTimeSeriesData(userId, fromTime, toTime);
                //console.log('Got time-series:', timeSeriesData);

                const series = generateTimeSeries(timeSeriesData);
                //console.log('generated series:', series);

                //console.log('Highcharts.charts[0]:', Highcharts.charts[0]);

                if (Highcharts.charts[0]) {
                    while(Highcharts.charts[0].series.length) { Highcharts.charts[0].series[0].remove(false); }
                    while(Highcharts.charts[0].yAxis.length) { Highcharts.charts[0].yAxis[0].remove(false); }
                    Highcharts.charts[0].redraw();

                    const colors = Highcharts.getOptions().colors;

                    let axisIndex = 0;
                    for (const seriesName of Object.keys(series)) {
                        series[seriesName].visible = true;
                        series[seriesName].yAxis = axisIndex;

                        let indexColor = colors[axisIndex % colors.length];

                        Highcharts.charts[0].addAxis({ id: axisIndex, title: { enabled: false }, labels: { style: { color: indexColor } } }, false);
                        Highcharts.charts[0].addSeries(series[seriesName], false);
                        axisIndex++;
                    }
                    Highcharts.charts[0].redraw();
                }
            }

        });

        Highcharts.chart('userScriptChart1', {
            title: { text: 'Poggers' },
            chart: {
                type: 'spline',
            },

            xAxis: { type: 'datetime' },

            legend: { layout: 'horizontal' },

            series: []
        });
    }
    initializeChart();
})();