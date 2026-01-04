// ==UserScript==
// @name         Centrada Statistieken
// @namespace    http://tampermonkey.net/
// @version      2025-03-22
// @description  Krijg inzicht in de data rondom je reacties op Centrada.
// @author       Mubbletm
// @match        https://woningzoeken.centrada.nl/portaal/mijn-reacties/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=centrada.nl
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529002/Centrada%20Statistieken.user.js
// @updateURL https://update.greasyfork.org/scripts/529002/Centrada%20Statistieken.meta.js
// ==/UserScript==

// Common filters to use as array filter.
const filters = {
    lotingen: o => o.verdeelmethode === 'Loting',
    inschrijfduur: o => o.verdeelmethode === 'Inschrijfduur',
    top(percentage) {
        return o => (o.eindpositie / o.aantalreacties) < percentage;
    }
}

// Downloads given text as file.
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Insert script's buttons.
function insertButton() {
    const historieHeader = document.querySelector('div.js-reacties-historie > div.box > h2');
    historieHeader.insertAdjacentHTML('afterend', '<div id="statistics-script" style="display: flex; flex-direction: row; gap: 10px;"><button id="CSVDownload" class="c-button  c-button--red c-button--large  c-button--pointer">Download CSV</button><button id="statistics" style="margin: 0" class="c-button  c-button--red c-button--large  c-button--pointer">Statistieken weergeven</button></div>');
    const CSVbtn = document.querySelector('#CSVDownload');
    CSVbtn.addEventListener('click', async () => {
        const stop = startDownload('CSVDownload');
        const reacties = await fetchReacties();
        stop();
        download('CentradaHistorischeReacties.csv', convertReactiesToCSV(reacties));
    });
    const statsBtn = document.querySelector('#statistics');
    statsBtn.addEventListener('click', () => {
        statsBtn.disabled = true;
        showStatistics()
    });
}

let _statistiek;

async function showStatistics() {
    const stop = startDownload('statistics');
    const reacties = (await fetchReacties()).filter(o => o.eindpositie !== 0);
    const lotingen = reacties.filter(filters.lotingen);
    const inschrijfduur = reacties.filter(filters.inschrijfduur);
    let data = inschrijfduur.map(o => [+(new Date(o.publstop)), o.eindpositie / o.aantalreacties]);

    // https://math.stackexchange.com/questions/204020/what-is-the-equation-used-to-calculate-a-linear-trendline
    const sumXtimesY = data.reduce(((acc, cur) => acc + (cur[0] * cur[1])), 0);
    const sumX = data.reduce(((acc, cur) => acc + cur[0]), 0);
    const sumY = data.reduce(((acc, cur) => acc + cur[1]), 0);
    const sumXsquared = data.reduce(((acc, cur) => acc + (cur[0] ** 2)), 0);
    const slope = ((data.length * sumXtimesY) - (sumX * sumY)) / ((data.length * sumXsquared) - (sumX ** 2));
    const offset = (sumY - (slope * sumX)) / data.length;
    const trendX = (-offset) / slope;
    const firstX = data.reduce(((acc, cur) => Math.min(acc, cur[0])), Number.MAX_VALUE);
    const trendY = (slope * firstX) + offset;

    const eersteDatum = new Date(oudsteReactie(reacties).datumreactie);
    const maanden = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

    const statistics = [
        [`Voorspelde wachttijd om een inschrijfduur woning te krijgen sinds ${maanden[eersteDatum.getMonth()]} ${eersteDatum.getFullYear()} (datum van je eerste reactie)`, formatPeriode(Math.floor((trendX - (+eersteDatum)) / 1000 / 60 / 60 / 24))],
        ['Voorspelde betaalde registratiekosten bij het krijgen van je eerste inschrijfwoning', `€${15 * Math.ceil((trendX - (+eersteDatum)) / 1000 / 60 / 60 / 24 / 365)},00`],
        ['Aantal reacties op woningen', reacties.length],
        ['Aantal woningen op inschrijfduur', inschrijfduur.length],
        ['Aantal woningen op loting', lotingen.length],
        ['Inschrijfduur/Loting ratio', woningTypeRatio(reacties, 'Inschrijfduur', 'Loting').join(' / ')],
        ['Laagst behaalde positie', laagstePositie(reacties)],
        ['Aantal keer in de top 5%', reacties.filter(filters.top(.05)).length],
        ['Aantal keer in de top 10%', reacties.filter(filters.top(.1)).length],
        ['Aantal keer in de top 25%', reacties.filter(filters.top(.25)).length],
        ['Aantal keer in de top 50%', reacties.filter(filters.top(.5)).length],
        ['Gemiddeld aantal reacties per woning totaal/inschrijfduur/loting', [
            gemiddeldAantalReacties(reacties),
            gemiddeldAantalReacties(inschrijfduur),
            gemiddeldAantalReacties(lotingen)
        ].join(' / ')],
        ['Gemiddelde positie totaal/inschrijfduur/loting', [
            gemiddeldePositie(reacties),
            gemiddeldePositie(inschrijfduur),
            gemiddeldePositie(lotingen)
        ].join(' / ')],
        ['Gemiddelde positie ten opzichte van aantal reacties totaal/inschrijfduur/loting', [
            gemiddeldeRelatievePositie(reacties),
            gemiddeldeRelatievePositie(inschrijfduur),
            gemiddeldeRelatievePositie(lotingen)
        ].join(' / ')],
        ['Periode op de wachtlijst sinds 1e reactie', tijdTussenNuEnOudsteReactie(reacties) ],
    ];
    document.querySelector('#statistics-script').insertAdjacentHTML('afterend', `
    <div id="chart" style="width: 100%; margin-top: 20px; height: 200px;"></div>
    <table class="u-full-width">
  <tbody>
    <tr>
      <th>Statistiek</th>
      <th>Waarde</th>
    </tr>
  </tbody>
  ${statistics.map(o => `<tr>${o.map(d => `<td style="color: #4a4a4a;">${d}</td>`).join('\n')}</tr>`).join('\n')}
</table><a id="StatDownload" href="javascript:void(0)" class="c-thumblist__link">Download Statistieken als CSV</a>`);
    let script = document.createElement('script');
    script.onload = function () {
        let options = {
            chart: {
                type: 'line',
                height: 500,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
            },
            stroke: {
                width: 2
            },
            series: [{
                name: 'Top % van reacties bij inschrijfduur',
                data
            },
                     {
                         name: 'Trend',
                         data: [
                             [firstX, trendY],
                             [trendX, 0]
                         ]
                     }],
            xaxis: {
                type: 'datetime',
                max: trendX
            },
            yaxis: {
                min: 0,
                max: 1,
                tickAmount: 4,
                decimalsInFloat: 2
            },
            annotations: {
                xaxis: [
                    {
                        x: trendX,
                        strokeDashArray: 0,
                        borderColor: "#775DD0",
                        label: {
                            borderColor: "#775DD0",
                            style: {
                                color: "#fff",
                                background: "#775DD0"
                            },
                            text: (new Date(trendX)).toDateString()
                        }
                    }
                ]
            }
        }

        let chart = new ApexCharts(document.querySelector("#chart"), options);

        chart.render();
    };
    script.src = "https://cdn.jsdelivr.net/npm/apexcharts";

    document.head.appendChild(script);
    stop();
    _statistiek = statistics;
    document.querySelector('#StatDownload').addEventListener('click', async () => {
        download('CentradaHistorischeReactiesStatistiek.csv', ['Statistiek', 'Waarde'].join(';') + '\n' + statistics.map(arr => arr.join(';')).join('\n'));
    });
}

// Give visual feedback to show the user that the request is still ongoing.
function startDownload(id) {
    const el = document.querySelector(`#${id}`);
    const defaultText = el.innerText;
    const defaultState = el.disabled;
    let isDownloading = true;
    (async () => {
        el.disabled = true;
        el.innerText = 'Downloading';
        let dotsCount = 0;
        while (isDownloading) {
            await new Promise(res => setTimeout(res, 300));
            dotsCount++;
            if (dotsCount > 3) dotsCount = 0;
            el.innerText = `Downloading${new Array(dotsCount).fill('.').join('')}`;
        }
        el.innerText = defaultText;
        el.disabled = defaultState;
    })();
    return function stop() {
        isDownloading = false;
    }
}

// Fetch past reactions, authorization is done with cookies that are already present in the browser.
function fetchPage(count = 100, page = 1) {
    return fetch('/WebServices/Reacties.asmx/GetHistorischeReacties', {method: 'POST', body: JSON.stringify({aantalreacties: count, pagenumber: page}), headers: {'content-type': 'application/json'}});
}

function fetchOnGoing() {
    return fetch('/Webservices/Reacties.asmx/GetReactiesInBehandeling', {method: 'POST', headers: {'content-type': 'application/json'}});
}

let _reacties;

// In case there's more than 100 reactions, gather all from pagination.
async function fetchReacties() {
    if (_reacties) return _reacties;
    const count = 100;
    let page = 0;
    let reacties = ((await (await fetchOnGoing()).json()).d.reacties) || [];
    const offset = reacties.length;
    while (page * count === reacties.length - offset) {
        reacties = [...reacties, ...((await (await fetchPage(count, ++page)).json()).d.reacties)];
    }
    _reacties = reacties;
    return reacties;
}

function convertReactiesToCSV(reacties) {
    return ['wijk', 'adres', 'verdeelmethode', 'aantal reacties', 'positie', 'datum'].join(';') + '\n' +
        reacties.map(o => [o.wijk, o.adres, o.verdeelmethode, o.aantalreacties, o.eindpositie, o.publstop].join(';')).join('\n');
}

if (document.readyState !== 'loading') {
    insertButton();
} else {
    document.addEventListener('DOMContentLoaded', insertButton);
}

// =============================================================================================
//
//                                          Statistieken
//
// =============================================================================================

function gemiddeldAantalReacties(reacties) {
    return Math.round(reacties.reduce(((acc, cur) => acc + cur.aantalreacties), 0) / reacties.length);
}

function gemiddeldePositie(reacties) {
    return Math.round(reacties.reduce(((acc, cur) => acc + cur.eindpositie), 0) / reacties.length);
}

function gemiddeldeRelatievePositie(reacties) {
    const percentages = reacties.map(o => o.eindpositie / o.aantalreacties);
    const average = percentages.reduce((acc, cur) => acc + cur) / reacties.length;
    return Math.round(average * 100) + '%';
}

function oudsteReactie(reacties) {
    return reacties.reduce(((acc, cur) => {
        const smallest = Math.min(new Date(acc.publstop), new Date(cur.publstop))
        if (+(new Date(acc.publstop)) === smallest) return acc;
        return cur;
    }));
}

function formatPeriode(dagen) {
    const jaren = Math.floor(dagen / 365);
    dagen %= 365;
    return `${jaren > 0 ? `${jaren} jaar ${dagen > 0 ? 'en ': ''}`: ''}${dagen > 0 || jaren === 0 ? `${dagen} ${dagen === 1 ? 'dag':'dagen'}`:''}`
}

function tijdTussenNuEnOudsteReactie(reacties) {
    let dagen = Math.floor((new Date() - new Date(oudsteReactie(reacties).datumreactie)) / 1000 / 60 / 60 / 24);
    return formatPeriode(dagen);
}

function woningTypeRatio(reacties, ...woningTypes) {
    return woningTypes.map(type => `${Math.round(reacties.filter(reactie => reactie.verdeelmethode === type).length / reacties.length * 100)}%`);
}

function laagstePositie(reacties) {
    return reacties.reduce(((acc, cur) => Math.min(cur.eindpositie, acc)), 1000);
}