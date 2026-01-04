// ==UserScript==
// @name        LSS-Alliance-Distance
// @version     1.0.10
// @description Shows the missing earned credits to the next federation
// @author      Jan (jxn_30)
// @grant       none
// @namespace   https://jxn.lss-manager.de/
// @match       https://www.missionchief.co.uk/alliances
// @match       https://police.missionchief.co.uk/alliances
// @match       *https://www.missionchief.com/alliances
// @match       https://police.missionchief.com/alliances

// @downloadURL https://update.greasyfork.org/scripts/454591/LSS-Alliance-Distance.user.js
// @updateURL https://update.greasyfork.org/scripts/454591/LSS-Alliance-Distance.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    if (!window.sessionStorage.hasOwnProperty('aCredits') || JSON.parse(window.sessionStorage.aCredits).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) await fetch('/api/credits').then(res => res.json()).then(data => window.sessionStorage.setItem('aCredits', JSON.stringify({lastUpdate: new Date().getTime(), value: data})));

    let prevValue;
    const alliance_values = {};
    const alliance_names = {};
    const alliance_order = [];
    const alliance_next = {};
    const history = JSON.parse(localStorage.alliance_list_history || '{}');
    const page = document.querySelector('.pagination .active').textContent;
    const autoreload = false;

    document.querySelectorAll('tbody tr td:nth-of-type(3)').forEach(cell => {
        const credits = parseInt(cell.textContent.trim().match(/^\d{1,3}(?:[.,]\d{3})*/)[0].replace(/\D/g, ''));
        const nameNode = cell.parentNode.querySelector('td:nth-of-type(2) a');
        const allianceId = nameNode.href.match(/\d+$/)[0];
        alliance_values[allianceId] = credits;
        alliance_names[allianceId] = nameNode.textContent;
        alliance_order.push(allianceId);
        const distSpan = document.createElement('span');
        distSpan.innerText = (credits - (prevValue || credits)).toLocaleString();
        distSpan.style.color = 'red';
        distSpan.style.marginLeft = '1em';
        distSpan.setAttribute('title', `To your own union: ${(credits - JSON.parse(window.sessionStorage.aCredits).value.credits_alliance_total).toLocaleString()}`);
        cell.appendChild(distSpan);
        prevValue = credits;
    });

    alliance_order.forEach((a, i) => i < alliance_order.length - 1 && (alliance_next[a] = alliance_order[i + 1]))

    if (!history.hasOwnProperty(page)) history[page] = {};

    if ((Object.keys(history[page]).sort().reverse()[0] || 0) < new Date().getTime() - 10 * 60 * 1000) history[page][new Date().getTime()] = alliance_values;

    localStorage.alliance_list_history = JSON.stringify(history);

    let e = document.createElement("script");
    e.src = "https://www.amcharts.com/lib/3/amcharts.js", document.head.appendChild(e);
    document.body.insertAdjacentHTML('beforeend', '<div id="gesamtcredits-chart" style="width: 100%; height: 100vh; background-color: #282828;"></div><div id="distance-chart" style="width: 100%; height: 100vh; background-color: #282828;"></div>');
    let i = window.setInterval(() => {
        if (window.AmCharts) {
            let e = document.createElement("script");
            e.src = "https://www.amcharts.com/lib/3/serial.js", document.head.appendChild(e),
                window.clearInterval(i);
        }
    }, 1e3), a = window.setInterval(() => {
        if (window.AmCharts) {
            let e = document.createElement("script");
            e.src = "https://www.amcharts.com/lib/3/themes/dark.js", document.head.appendChild(e),
                window.clearInterval(a);
        }
    }, 1e3), q = window.setInterval(() => {
        if (window.AmCharts) {
            let e = document.createElement("script");
            let f = document.createElement('link');
            f.rel = 'stylesheet';
            f.href = 'https://www.amcharts.com/lib/3/plugins/export/export.css';
            e.src = "https://www.amcharts.com/lib/3/plugins/export/export.min.js", document.head.appendChild(e).appendChild(f),
                window.clearInterval(q);
        }
    }, 1e3);
    const getColorFromString = (string = '', shift = 0) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = (hash + 2 * shift) / 3;
        hash = (hash & 0x00ffffff).toString(16).toUpperCase();
        return '00000'.substring(0, 6 - hash.length) + hash;
    };
    let b = window.setInterval(() => {
        if (window.AmCharts && window.AmCharts.AmSerialChart) {
            window.clearInterval(b);
            const shown = JSON.parse(localStorage.alliance_list_history_shown || '[]');
            const saved_graphs = Object.entries(history[page]).flatMap(([_, values]) => Object.keys(values).map(id => ({
                id: id,
                title: alliance_names[id] || id,
                valueField: id,
                hidden: !shown.includes(id),
            })));
            const graphs = [];
            saved_graphs.forEach(g => {
                !graphs.filter(c => c.id === g.id).length && graphs.push({...g, lineColor: `#${getColorFromString(g.title)}`});
            });
            const u = {
                type: "serial",
                categoryField: "date",
                theme: "dark",
                creditsPosition: "top-right",
                categoryAxis: {
                    minPeriod: "ss",
                    parseDates: !0
                },
                chartCursor: {
                    enabled: !0,
                    categoryBalloonDateFormat: "DD.MM JJ:NN:SS"
                },
                trendLines: [],
                valueAxes: [ {
                    "id": "ValueAxis-1",
                    "usePrefixes": true,
                } ],
                graphs,
                legend: {
                    enabled: !0,
                    useGraphSettings: !0,
                },
                titles: [ {
                    id: "title",
                    size: 15,
                    text: "Verlauf"
                } ],
                export: {
                    enabled: true
                },
                dataProvider: Object.entries(history[page]).map(([time, data]) => {
                    const date = new Date();
                    date.setTime(time);
                    return {
                        date,
                        ...data
                    };
                })
            };
            const e = JSON.parse(JSON.stringify(u));
            const chart = AmCharts.makeChart("gesamtcredits-chart", u);
            chart.legend.addListener('showItem', ({ dataItem: { id } }) => {
                shown.push(id);
                localStorage.alliance_list_history_shown = JSON.stringify(shown);
            });
            chart.legend.addListener('hideItem', ({ dataItem: { id } }) => {
                shown.splice(shown.findIndex(s => s === id), 1);
                localStorage.alliance_list_history_shown = JSON.stringify(shown);
            });

            const shownDiff = JSON.parse(localStorage.alliance_list_history_shownDiff || '[]');
            const diffChart = AmCharts.makeChart("distance-chart", {
                ...e,
                graphs: graphs.filter(g => alliance_next.hasOwnProperty(g.id)).map(g => ({
                    lineColor: `#${getColorFromString(g.title)}`,
                    id: g.id.toString() + alliance_next[g.id].toString(),
                    valueField: g.id.toString() + alliance_next[g.id].toString(),
                    title: g.title + ' → ' + alliance_names[alliance_next[g.id]],
                    hidden: !shownDiff.includes(g.id),
                })),
                dataProvider: Object.entries(history[page]).map(([time, data]) => {
                    const date = new Date();
                    date.setTime(time);
                    return {
                        date,
                        ...Object.fromEntries(Object.entries(data).map(([id, val]) => {
                            if (!alliance_next.hasOwnProperty(id)) return;
                            return [id.toString() + alliance_next[id].toString(), val - data[alliance_next[id]]];
                        }).filter(d => d)),
                    };
                })
            });
            diffChart.legend.addListener('showItem', ({ dataItem: { id } }) => {
                shownDiff.push(id);
                localStorage.alliance_list_history_shownDiff = JSON.stringify(shownDiff);
            });
            diffChart.legend.addListener('hideItem', ({ dataItem: { id } }) => {
                shownDiff.splice(shown.findIndex(s => s === id), 1);
                localStorage.alliance_list_history_shownDiff = JSON.stringify(shownDiff);
            });
            autoreload && window.setTimeout(() => window.location.reload(), 10 * 60 * 1000);
        }
    }, 1e3);
})();
