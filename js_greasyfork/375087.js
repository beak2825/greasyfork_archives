// ==UserScript==
// @name         dup
// @version      0.0.1
// @include      https://manhua.dmzj.com/*
// @description  dmzj update predict
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/164996a
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/375087/dup.user.js
// @updateURL https://update.greasyfork.org/scripts/375087/dup.meta.js
// ==/UserScript==
// https://github.com/Tom-Alexander/regression-js
const Regression = () => {
  const DEFAULT_OPTIONS = { order: 2, precision: 2, period: null }
  function gaussianElimination(input, order) {
    const matrix = input
    const n = input.length - 1
    const coefficients = [order]
    for (let i = 0; i < n; i++) {
      let maxrow = i
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j
        }
      }
      for (let k = i; k < n + 1; k++) {
        const tmp = matrix[k][i]
        matrix[k][i] = matrix[k][maxrow]
        matrix[k][maxrow] = tmp
      }
      for (let j = i + 1; j < n; j++) {
        for (let k = n; k >= i; k--) {
          matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i]
        }
      }
    }
    for (let j = n - 1; j >= 0; j--) {
      let total = 0
      for (let k = j + 1; k < n; k++) {
        total += matrix[k][j] * coefficients[k]
      }
      coefficients[j] = (matrix[n][j] - total) / matrix[j][j]
    }
    return coefficients
  }
  function round(number, precision) {
    const factor = 10 ** precision
    return Math.round(number * factor) / factor
  }
  const methods = {
    linear(data, options) {
      const sum = [0, 0, 0, 0, 0]
      let len = 0

      for (let n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          len++
          sum[0] += data[n][0]
          sum[1] += data[n][1]
          sum[2] += data[n][0] * data[n][0]
          sum[3] += data[n][0] * data[n][1]
          sum[4] += data[n][1] * data[n][1]
        }
      }

      const run = len * sum[2] - sum[0] * sum[0]
      const rise = len * sum[3] - sum[0] * sum[1]
      const gradient = run === 0 ? 0 : round(rise / run, options.precision)
      const intercept = round(sum[1] / len - (gradient * sum[0]) / len, options.precision)

      const predict = x => [
        round(x, options.precision),
        round(gradient * x + intercept, options.precision)
      ]

      const points = data.map(point => predict(point[0]))

      return {
        points,
        predict,
        equation: [gradient, intercept],
        r2: round(determinationCoefficient(data, points), options.precision),
        string: intercept === 0 ? `y = ${gradient}x` : `y = ${gradient}x + ${intercept}`
      }
    },
    polynomial(data, options) {
      const lhs = []
      const rhs = []
      let a = 0
      let b = 0
      const len = data.length
      const k = options.order + 1
      for (let i = 0; i < k; i++) {
        for (let l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += data[l][0] ** i * data[l][1]
          }
        }
        lhs.push(a)
        a = 0
        const c = []
        for (let j = 0; j < k; j++) {
          for (let l = 0; l < len; l++) {
            if (data[l][1] !== null) {
              b += data[l][0] ** (i + j)
            }
          }
          c.push(b)
          b = 0
        }
        rhs.push(c)
      }
      rhs.push(lhs)
      const coefficients = gaussianElimination(rhs, k).map(v =>
        round(v, options.precision)
      )
      const predict = x => [
        round(x, options.precision),
        round(
          coefficients.reduce((sum, coeff, power) => sum + coeff * x ** power, 0),
          options.precision
        )
      ]
      return {
        predict
      }
    }
  }
  function createWrapper() {
    const reduce = (accumulator, name) => ({
      _round: round,
      ...accumulator,
      [name](data, supplied) {
        return methods[name](data, {
          ...DEFAULT_OPTIONS,
          ...supplied
        })
      }
    })
    return Object.keys(methods).reduce(reduce, {})
  }
  return createWrapper()
}

const gmFetch = url =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: resolve,
      onerror: reject
    })
  })
// https://github.com/tkkcc/flutter_dmzj/blob/master/lib/util/api.dart
const comic = async id => {
  const channel = 'Android'
  const version = '2.7.009'
  const api3 = 'https://v3api.dmzj.com'
  let a = await gmFetch(`${api3}/comic/${id}.json?channel=${channel}&version=${version}`)
  if (a.status !== 200) return
  a = JSON.parse(a.responseText)
  // only process first chapter
  if (a.status[0].tag_name !== '连载中') return
  // console.log(a)
  a = a.chapters[0].data.map(i => ({
    id: i.chapter_id,
    order: i.chapter_order,
    title: i.chapter_title,
    size: i.filesize,
    time: i.updatetime
  }))
  return a
}

const format = i => new Date(i * 1000).toISOString().slice(0, 10)
const human = i => {
  const a = new Date(i * 1000)
  const b = new Date()
  let c = ((a - b) / (1000 * 60 * 60 * 24)) >> 0
  // console.log(c)
  if (c === 0) return '今天更新'
  if (c === 1) return '明天更新'
  if (c < 7) return c + '天后更新'
  c = (c / 7) >> 0
  if (c < 3) return '下周更新'
  if (c < 5) return c + '周后更新'
  if (c < 6) return c + '本月更新'
}

const html = `
<style>
body {
  text-align: center;
}
div.regression_canvas {
  background: #fefefe;
  display: none;
  // margin: 3em;
  padding: 1em;
  width: 40em;
  left: -36em;
  top: 0em;
  z-index: 2;
}
span.regression_app:hover > div {
  display: inline-block;
  position: absolute;
}
span.regression_app {
  position: relative;
  color: slateblue;
  float: right;
}
</style>
<span class="regression_app">
<div class="regression_canvas">
  <canvas width="10" height="10"></canvas>
</div>
</span>`

// main
const main = async () => {
  // data
  if (typeof g_current_id === undefined) return
  const p = document.querySelector(
    'div.middleright div.odd_anim_title > div.odd_anim_title_m'
  )
  if (!p) return
  const a = await comic(g_current_id)
  if (!a || a.length < 5) return
  a.sort((a, b) => a.time - b.time)
  const b = a.slice(-5).map((i, index) => [index, i.time])
  const result = Regression().polynomial(b, { order: 2 })
  let d = result.predict(b.length)
  if (d[1] < b[b.length - 1][1]) return
  d = human(d[1])
  if (!d) return

  // dom
  p.insertAdjacentHTML('beforeend', html)
  document.querySelector('.regression_app').insertAdjacentText('afterbegin', d)
  const ctx = document
    .querySelector('.regression_canvas')
    .firstElementChild.getContext('2d')
  const config = {
    type: 'line',
    data: {
      labels: a.map(i => i.title),
      datasets: [
        {
          backgroundColor: 'slateblue',
          borderColor: 'slateblue',
          data: a.map(i => i.time),
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '更新记录'
      },
      tooltips: {
        intersect: false,
        callbacks: {
          title(item, data) {
            return item[0].xLabel + ' ' + format(item[0].yLabel) + '更新'
          },
          label() {}
        }
      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              callback: format
            }
          }
        ]
      }
    }
  }
  new Chart(ctx, config)
}
main()
