// ==UserScript==
// @name            KDE Store: Graphs
// @namespace       https://github.com/Zren/
// @description     Misc
// @icon            https://store.kde.org/images_sys/store_logo/kde-store.ico
// @author          Zren
// @version         7
// @match           https://www.opendesktop.org/member/*/plings*
// @match           https://www.opendesktop.org/u/*/plings*
// @match           https://store.kde.org/member/*/plings*
// @match           https://store.kde.org/u/*/plings*
// @grant           none
// @require         https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js
// @downloadURL https://update.greasyfork.org/scripts/31937/KDE%20Store%3A%20Graphs.user.js
// @updateURL https://update.greasyfork.org/scripts/31937/KDE%20Store%3A%20Graphs.meta.js
// ==/UserScript==

var el = function(html) {
    var e = document.createElement('div');
    e.innerHTML = html;
    return e.removeChild(e.firstChild);
}

function daysLeftMultiplier() {
    var now = new Date()
    var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    var totalTime = endOfMonth.valueOf() - startOfMonth.valueOf()
    var timeProcessed = now.valueOf() - startOfMonth.valueOf()
    var timeLeft = endOfMonth.valueOf() - now.valueOf()
    if (timeProcessed == 0) {
        return 1
    } else {
        return 1 + (timeLeft / timeProcessed)
    }

    //var timeLeftInMonth = timeLeft / totalTime
    // return 1 + timeLeftInMonth

    if (timeLeftInMonth <= 0) {
        return 1
    } else {
        return totalTime / timeLeft
    }

}

function zeropad(x, n) {
    var s = '' + x
    for (var i = s.length; i < n; i++) {
        s = '0' + s
    }
    return s
}

function getProductDownloadsForYearMonth(year, month) {
    // OpenDesktop defines:
    //     var json_member = {"member_id":"433956","username":"Zren", ... };

    var yearMonth = '' + year + zeropad(month+1, 2)
    var url = 'https://www.opendesktop.org/member/' + json_member.member_id + '/plingsmonthajax?yearmonth=' + yearMonth
    var cacheKey = 'ProductDownloadsForMonth-' + yearMonth

    var now = new Date()
    var isCurrentMonth = now.getFullYear() == year && now.getMonth() == month

    // Check cache first
    if (localStorage[cacheKey]) {
        var cacheData = JSON.parse(localStorage[cacheKey])
        console.log('Grabbed', cacheKey, 'from localStorage cache')
        return Promise.resolve(cacheData)
    }

    return fetch(url, {
    }).then(function(res){
        return res.text()
    }).then(function(text){
        var monthData = {}
        var root = document.createElement('div')
        root.innerHTML = text
        var myProductList = root.querySelector('.my-products-list')
        var rows = myProductList.querySelectorAll('.tab-pane > .row:not(.row-total)')
        for (var row of rows) {
            var productName = row.children[1].querySelector('span').textContent
            var productDownloads = row.children[2].querySelector('span').textContent
            //console.log('graphData', productName, productDownloads, parseInt(productDownloads, 10))
            productDownloads = parseInt(productDownloads, 10)

            monthData[productName] = productDownloads
        }

        monthData = {
            year: year,
            month: month,
            yearMonth: yearMonth,
            productDownloads: monthData,
        }

        // Save to cache
        if (!isCurrentMonth) { // Don't cache current month
            localStorage[cacheKey] = JSON.stringify(monthData)
        }

        return monthData
    })
}

function getProductDownloadsOverTime() {
    var now = new Date()
    var month = new Date(now.getFullYear(), now.getMonth(), 1)

    var promises = []
    for (var i = 0; i < 12; i++) {
        promises.push(getProductDownloadsForYearMonth(month.getFullYear(), month.getMonth())) // JavaScript's Date.month starts at 0-11
        month.setMonth(month.getMonth() - 1)
    }


    return Promise.all(promises).then(function(values){
        console.log('Promise.all.values', values)
        var graphData = {}
        graphData.labels = new Array(values.length).fill('')
        graphData.products = {}
        for (var monthIndex = 0; monthIndex < values.length; monthIndex++) {
            var monthData = values[monthIndex]
            graphData.labels[monthIndex] = monthData.yearMonth

            for (var productName of Object.keys(monthData.productDownloads)) {
                var productDownloads = monthData.productDownloads[productName]

                var productData = graphData.products[productName]
                if (!graphData.products[productName]) {
                    productData = new Array(values.length).fill(0)
                    graphData.products[productName] = productData
                }

                productData[monthIndex] = productDownloads
            }
        }

        return graphData
    })
}
function randomColor() {
    // Based on the Random Pastel code from StackOverflow
    // https://stackoverflow.com/a/43195379/947742
    return "hsl(" + 360 * Math.random() + ', ' + // Hue: Any
                 (25 + 70 * Math.random()) + '%, ' + // Saturation: 25-95
                 (40 + 30 * Math.random()) + '%)'; // Lightness: 40-70
}

// https://stackoverflow.com/a/44134328/947742
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  var r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r:r, g:g, b:b }
}
function rgbToHex(c) {
  function toHex(x) {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
  return '#' + toHex(c.r) + toHex(c.g) + toHex(c.b)
}
function hslToHex(h, s, l) {
  var c = hslToRgb(h, s, l)
  function toHex(x) {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
  return '#' + toHex(c.r) + toHex(c.g) + toHex(c.b)
}
function rgbToRgba(c, a) {
  return 'rgba(' + Math.round(c.r * 255) + ', ' + Math.round(c.g * 255) + ', ' + Math.round(c.b * 255) + ', ' + a + ')'
}
function getPastelColor(i, n) {
    return hslToRgb(i / n * 360, 55, 70)
}

function convertToDatasets(graphData) {
    var datasets = []
    var productNameList = Object.keys(graphData.products)
    productNameList.sort()

    for (var i = 0; i < productNameList.length; i++) {
        var productName = productNameList[i]
        var productData = graphData.products[productName]
        var dataset = {}
        dataset.label = productName
        dataset.data = Array.from(productData).reverse()
        dataset.fill = false
        var datasetColor = getPastelColor(i, productNameList.length)
        dataset.accentColor = rgbToHex(datasetColor)
        dataset.accentFadedColor = rgbToRgba(datasetColor, 0.2)
        dataset.backgroundColor = dataset.accentColor
        dataset.borderColor = dataset.accentColor
        dataset.lineTension = 0.1
        datasets.push(dataset)
    }
    return datasets
}

function buildGraph(graphData) {
    console.log('graphData', graphData)

    window.graphData = graphData
    var datasets = window.datasets = convertToDatasets(graphData)

    //var labels = document.querySelectorAll('#my-payout-list ul.nav-tabs li a')
    //labels = Array.prototype.map.call(labels, function(e){ return e.textContent })
    //labels = labels.reverse()

    //var labels = new Array(3).fill('Month')
    var labels = graphData.labels
    labels = labels.reverse()

    console.log('datasets', JSON.stringify(datasets))
    console.log('labels', JSON.stringify(labels))

    var graphParent = document.querySelector('.my-products-heading')
    var graphContainer = el('<div id="graphs" />')
    var graphCanvas = el('<canvas id="myChart" width="100vw" height="30vh"></canvas>')
    graphContainer.appendChild(graphCanvas)

    graphParent.parentNode.insertBefore(graphContainer, graphParent)

    //var navTabs = document.querySelector('#my-payout-list ul.nav-tabs')
    //var graphTab = el('<li><a href="#graphs" data-toggle="tab">Graphs</a></li>')
    //navTabs.insertBefore(graphTab, navTabs.firstChild)

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            title: {
                display: true,
                text: 'Product Downloads Over Time',
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                itemSort: function (a, b, data) {
                    return b.yLabel - a.yLabel // descending
                }
            },
            legend: {
                position: 'left',
                onHover: function(e, legendItem) {
                    if (myChart.hoveringLegendIndex != legendItem.datasetIndex) {
                        myChart.hoveringLegendIndex = legendItem.datasetIndex
                        for (var i = 0; i < myChart.data.datasets.length; i++) {
                            var dataset = myChart.data.datasets[i]
                            if (i == legendItem.datasetIndex) {
                                dataset.borderColor = dataset.accentColor
                                dataset.pointBackgroundColor = dataset.accentColor
                            } else {
                                dataset.borderColor = dataset.accentFadedColor
                                dataset.pointBackgroundColor = dataset.accentFadedColor
                            }
                        }
                        myChart.options.tooltips.enabled = false
                        myChart.update()
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true,
            },
            scales: {
                yAxes: [{
                    //type: 'logarithmic',
                    ticks: {
                        //stepSize: 5,
                        //beginAtZero:true,
                    }
                }]
            }
        }
    });

    myChart.hoveringLegendIndex = -1
    myChart.canvas.addEventListener('mousemove', function(e) {
        if (myChart.hoveringLegendIndex >= 0) {
            if (e.layerX < myChart.legend.left || myChart.legend.right < e.layerX
                || e.layerY < myChart.legend.top || myChart.legend.bottom < e.layerY
               ) {
                myChart.hoveringLegendIndex = -1
                for (var i = 0; i < myChart.data.datasets.length; i++) {
                    var dataset = myChart.data.datasets[i]
                    dataset.borderColor = dataset.accentColor
                    dataset.pointBackgroundColor = dataset.accentColor
                }
                myChart.options.tooltips.enabled = true
                myChart.update()
            }
        }
    })
}


function main() {
    getProductDownloadsOverTime().then(function(graphData){
        buildGraph(graphData)
    })
}

main()

