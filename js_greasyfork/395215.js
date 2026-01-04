// ==UserScript==
// @name         numbeo-cost-of-living-comparison
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Visualize cost-of-living data diff from numbeo.com
// @author       neotan
// @match        https://www.numbeo.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     pureCss https://cdn.jsdelivr.net/npm/purecss@1.0.1/build/pure-min.min.css
// @resource     tabulatorCss https://cdn.jsdelivr.net/npm/tabulator-tables@4.5.3/dist/css/tabulator.min.css
// @require      https://cdn.jsdelivr.net/npm/echarts@4.6.0/dist/echarts.min.js
// @require      https://cdn.jsdelivr.net/npm/tabulator-tables@4.5.3/dist/js/tabulator.min.js
// @require      https://cdn.jsdelivr.net/npm/ramda@0.26.1/dist/ramda.min.js
// @downloadURL https://update.greasyfork.org/scripts/395215/numbeo-cost-of-living-comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/395215/numbeo-cost-of-living-comparison.meta.js
// ==/UserScript==

;(async function() {
  'use strict'

  //------------------- Utilities START -------------------//
  function renameKeys(cityName, rows) {
    if (!rows) return

    return R.map(
      R.pipe(
        R.toPairs,
        R.map(([key, val]) => (['idx', 'item', 'category'].includes(key) ? [key, val] : [`${cityName}-${key}`, val])),
        R.fromPairs
      )
    )(rows)
  }

  function camelize(str) {
    if (!str) return str

    return R.replace(/(?<=^|-)./g, R.toUpper)(str)
  }

  function toNumber(str) {
    if (str == null) return

    var numArr = str.trim().match(/[\d.-]/g)
    return numArr == null ? numArr : parseFloat(numArr.join(''))
  }

  function scrollTo(htmlSelector) {
    setTimeout(() => {
      var scrollTop = $(htmlSelector).position().top || 0

      $('html, body').animate({ scrollTop }, 'slow')
    }, 3000)
  }

  function citiesStrToArray(citiesStr) {
    if (!citiesStr) return

    return R.pipe(R.split(','), R.map(R.pipe(R.trim, R.toLower, camelize)))(citiesStr)
  }

  function extractCostFromDoc(doc = '') {
    var trs = $(doc).find('table.data_wide_table tr')
    if (trs.length === 0) return

    var category = 'Unknown'

    return trs
      .toArray()
      .map((tr, idx) => {
        var ths = $(tr).find('th')
        var tds = $(tr).find('td')
        var item
        var median
        var range

        if (ths.length > 0) {
          category = ths
            .eq(0)
            .text()
            .trim()
        } else if (tds.length > 0) {
          item = tds
            .eq(0)
            .text()
            .trim()
          median = toNumber(
            tds
              .eq(1)
              .text()
              .trim()
          )
          range = tds
            .eq(2)
            .text()
            .trim()
        }

        return item === null ? null : { idx, category, item, median, range }
      })
      .filter(row => row.item)
  }

  var cityCostUrl = 'https://www.numbeo.com/cost-of-living/in/'
  async function fetchCityCostByName(cityName) {
    try {
      var response = await fetch(`${cityCostUrl}${cityName}?displayCurrency=USD`)
      return response.text() // return a promise
    } catch (err) {
      console.warn(err)
    }
  }

  function createSubColumns(data, showedSubColumnKeys = []) {
    if (!data) return

    return R.pipe(
      R.mapObjIndexed((rows = [], cityName) => {
        var columns = R.pipe(
          R.prop(0),
          R.pick(showedSubColumnKeys),
          R.keys,
          R.map(key => ({ title: key, field: `${cityName}-${key}`, sorter: 'number', align: 'right' }))
        )(rows)

        return {
          title: cityName,
          columns,
        }
      }),
      R.values,
      R.flatten
    )(data)
  }

  var convertDataToRows = R.pipe(
    R.mapObjIndexed((rows, cityName) => {
      return renameKeys(cityName, rows)
    }),
    R.values,
    R.reduce((acc, curr, i) => (acc == null ? curr : acc.map((obj, i) => R.mergeRight(obj, curr[i]))), null)
  )

  var barDefaultOptions = {
    title: { text: 'Cost of Living' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    toolbox: { show: true, feature: { dataView: { title: 'View Data', readOnly: false }, restore: { title: 'Restore' } } },
    calculable: true,
    legend: {
      align: 'right',
      selector: [
        { type: 'all', title: 'All' },
        { type: 'inverse', title: 'Inverse' },
      ],
      itemGap: 20,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { name: 'USD', type: 'value' },
    yAxis: { type: 'category' },
    dataZoom: [
      { show: true, top: '97%' },
      { show: true, yAxisIndex: 0, filterMode: 'none', width: 30, height: '80%', left: '95%', start: 80, end: 100 },
    ],
  }
  function getBarChartOption(cities = [], rows = [], options = {}) {
    var sortedRows = R.pipe(
      R.map(row => {
        var sumMedian = R.pipe(
          R.pickBy((_, key) => key.endsWith('-median')),
          R.values,
          R.sum
        )(row)

        return { ...row, sumMedian }
      }),
      R.sortBy(R.prop('sumMedian'))
    )(rows)

    var items = R.pluck('item')(sortedRows)

    var series = R.map(city => {
      var name = city
      var data = R.pluck(`${city}-median`)(sortedRows)
      return { name, data, type: 'bar' }
    })(cities)

    return R.pipe(R.assocPath(['legend', 'data'], cities), R.assocPath(['yAxis', 'data'], items), R.assoc('series', series))(options)
  }

  //------------------- Utilities END -------------------//

  //------------------- Main Functions declaration START -------------------//
  var defaultCities = 'irvine,seattle,los-angeles,austin,new-york,hoboken,Amsterdam,vancouver'
  var defaultColumns
  var showedSubColumnKeys
  var domHtml
  var costData
  var barChart

  function initEnv(cityNames) {
    defaultColumns = [
      { title: 'Category', field: 'category' },
      { title: 'Item', field: 'item' },
    ]
    showedSubColumnKeys = ['median']
    domHtml = `
<form class="pure-form cities-form">
  <label>
  Cities: <input type="text" name="cities" size=100 placeholder="Input city names here." value=${cityNames.join(',')}>
  </label>

  <button type="submit" class="pure-button pure-button-primary" type="submit">Compare</button>

  <span><a href="https://greasyfork.org/en/scripts/395215-numbeo-cost-of-living-comparison">&#9784;</a></span>
</form>
<button class="pure-button pure-button-primary toggle-barchart">Toggle Bar-Chart</button>
<div id="echarts" style="width: 80%; height:700px;"/>
<button class="pure-button pure-button-primary toggle-table">Toggle Table</button>
<div id="tabulator-table" style="width: 80%;"/>
`

    GM_addStyle(GM_getResourceText('pureCss'))
    GM_addStyle(GM_getResourceText('tabulatorCss'))

    $('body').prepend($(domHtml))

    // initiate Charts
    barChart = echarts.init(document.getElementById('echarts'))
    barChart.showLoading({
      text: 'Loading...',
    })

    // initiate listener
    $('.toggle-barchart').click(() => $('#echarts').slideToggle('fast'))
    $('.toggle-table').click(() => $('#tabulator-table').slideToggle('fast'))
    $('.cities-form').submit(function(event) {
      event.preventDefault()

      var cityNames = R.pipe(() => $(this).serializeArray(), R.pathOr('', [0, 'value']), citiesStrToArray)(event)

      if (cityNames) {
        barChart.showLoading({
          text: 'Loading...',
        })
        buildExtraDoms(cityNames)
        return
      }
    })
    console.log('init DONE!')
  }

  async function buildExtraDoms(cityNames) {
    if (!cityNames || cityNames.length <= 0) return

    try {
      var promises = R.map(fetchCityCostByName)(cityNames)
      var docs = await Promise.all(promises)

      costData = R.pipe(R.zipObj(cityNames), R.map(extractCostFromDoc), R.reject(R.isNil))(docs)

      var rows = convertDataToRows(costData)

      // create Table
      new Tabulator('#tabulator-table', {
        // options ref: http://tabulator.info/examples/4.5
        height: '500px',
        movableColumns: true,
        columns: [...defaultColumns, ...createSubColumns(costData, showedSubColumnKeys)],
        data: convertDataToRows(costData),
      })

      // create Charts
      var cities = R.keys(costData)
      barChart.setOption(getBarChartOption(cities, rows, barDefaultOptions), true)
      barChart.hideLoading()

      scrollTo('.cities-form')
    } catch (err) {
      console.warn(err)
    }
  }

  //------------------- Main Functions declaration END -------------------//

  //------------------- Main Functions execution START -------------------//
  var urlParams = new URLSearchParams(window.location.search)
  var citiesStr = urlParams.get('cities')
  var cityNames = citiesStrToArray(citiesStr || defaultCities)

  initEnv(cityNames)
  buildExtraDoms(cityNames)
})()
