// ==UserScript==
// @name         Antimatter Dimensions Graphs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A nice graph of various numbers in Antimatter Dimensions.
// @author       Shamus03
// @match        https://ivark.github.io/AntimatterDimensions/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ivark.github.io
// @grant        none
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458762/Antimatter%20Dimensions%20Graphs.user.js
// @updateURL https://update.greasyfork.org/scripts/458762/Antimatter%20Dimensions%20Graphs.meta.js
// ==/UserScript==

(function() {
  'use strict'

  openGraphWindow()

  async function openGraphWindow() {
    const graphWindow = window.open(window.location.href, '_blank', 'width=1000,height=800')
    graphWindow.document.write(getGraphPageHtml())
    while (!graphWindow.closed) {
      graphWindow.postMessage({
        type: 'updated-game-state',
        now: Date.now(),
        currencies: {
          infinityPoints: {
            current: player.infinityPoints.log10(),
            gained: gainedInfinityPoints().log10(),
            ratePerMinute: gainedInfinityPoints().div(Time.thisInfinity.totalMinutes).log10(),
          },
          eternityPoints: {
            current: player.eternityPoints.log10(),
            gained: gainedEternityPoints().log10(),
            ratePerMinute: gainedEternityPoints().div(Time.thisEternity.totalMinutes).log10(),
          },
        },
      }, window.location.origin)

      await new Promise(resolve => setTimeout(resolve, 250))
    }
    console.log('window closed')
  }

  function getGraphPageHtml() {
    return `<!DOCTYPE html>
<html>

<head>
    <title>Antimatter Dimensions Chart</title>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <style>
        #container {
            height: 95vh;
        }
    </style>
</head>

<body>
    <div id="app">
        <div id="container"></div>
    </div>
</body>

<script lang="text/javascript">

    const chart = Highcharts.stockChart('container', {
        title: {
            text: name,
        },
        yAxis: [
            {
                title: {
                    text: 'Infinity Points',
                },
            },
            {
                title: {
                    text: 'Eternity Points',
                },
                opposite: false,
            },
        ],
        legend: {
            enabled: true,
        },
        credits: false,
        series: [],
    })

    function initSeries(name, key, yAxis, color) {
        const seriesCurrent = chart.addSeries({ name, yAxis, color })
        const seriesGained = chart.addSeries({ name: name + ' Gained', yAxis, color })
        const seriesRate = chart.addSeries({ name: name + ' Per Minute', yAxis, color })

        window.addEventListener('message', ev => {
            if (ev.data.type !== 'updated-game-state') return
            const { now, currencies: { [key]: { current, gained, ratePerMinute } } } = ev.data

            seriesCurrent.addPoint([now, current])
            seriesGained.addPoint([now, current + gained])
            seriesRate.addPoint([now, ratePerMinute])
        })
    }

    initSeries('Infinity Points', 'infinityPoints', 0, '#b67f33')
    initSeries('Eternity Points', 'eternityPoints', 1, '#b341e0')

</script>

<script lang="text/javascript">


</script>

</html>`
  }
})()