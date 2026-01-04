// ==UserScript==
// @name         cart2excel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  导出淘宝/天猫购物车到excel
// @author       yxf
// @grant        none
// @license      MIT
// @include      *://cart.taobao.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://unpkg.com/file-saver@1.3.3/FileSaver.js
// @require      https://unpkg.com/blob.js@1.0.1/Blob.js
// @require      https://unpkg.com/xlsx/dist/shim.min.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/414701/cart2excel.user.js
// @updateURL https://update.greasyfork.org/scripts/414701/cart2excel.meta.js
// ==/UserScript==

(function ($) {
  'use strict'

  // Your code here...

  // const scripts = [
  //   '//unpkg.com/file-saver@1.3.3/FileSaver.js',
  //   '//unpkg.com/blob.js@1.0.1/Blob.js',
  //   '//unpkg.com/xlsx/dist/shim.min.js',
  //   '//unpkg.com/xlsx/dist/xlsx.full.min.js'
  // ]

  // const promises = scripts.map(item => loadScript(item))
  // Promise.all(promises).then(res => {
  //   createBtn()
  // })
  createBtn()
  function createBtn (src) {
    if (!document.querySelector('#downloadBtn')) {
      const btn = document.createElement('button')
      btn.id = 'downloadBtn'
      btn.onclick = handleDownload
      btn.style.cssText = `
      position:fixed;
      top:40px;
      right:0;
      z-index:999;     
      display: inline-block;
    padding: 10px 16px;
    color:white;
    cursor: pointer;
    border: none;
    text-decoration: none;
    background: #ea4c89;
    -webkit-transition: all 200ms ease;
    transition: all 200ms ease;
    border-radius: 8px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    font-family: 'Haas Grot Text R Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
      `

      btn.innerText = 'export Excel'

      document.body.appendChild(btn)
    }
  }

  function handleDownload () {
    crawl().then(list => {
      const tHeader = ['图片', '标题', '规格', '原价', '现价', '数量', '总价', '失效状态']
      const filterVal = ['img', 'title', 'info', 'priceOriginal', 'priceNow', 'amount', 'sum', 'valid']
      const data = formatJson(filterVal, list)
      export_json_to_excel({
        header: tHeader, // 表头 必填
        data, // 具体数据 必填
        filename: 'cart', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    })
  }

  function crawl () {
    return new Promise((resolve, reject) => {
      const $productList = $('.J_ItemBody')

      const list = []
      $productList.each((index, item) => {
        const obj = {}
        obj.img = $(item).find('.itempic.J_ItemImg').attr('src')
        obj.title = $(item).find('.item-basic-info').text() // 标题
        obj.info = $(item).find('.item-props').text() // 规格信息
        obj.priceOriginal = $(item).find('.price-original').text() // 原价
        obj.priceNow = $(item).find('.J_Price.price-now').text() // 现价
        obj.amount = $(item).find('input.J_ItemAmount').length ? $(item).find('input.J_ItemAmount').val() : $(item).find('.item-amount ').text() // 数量
        obj.sum = $(item).find('.J_ItemSum.number').text()
        obj.valid = $(item).find('.td-inner .label-invalid').length ? '失效' : ''
        list.push(obj)
      })
      resolve(list)
    })
  }
  function sheet_from_array_of_arrays (data, opts) {
    var ws = {}
    var range = {
      s: {
        c: 10000000,
        r: 10000000
      },
      e: {
        c: 0,
        r: 0
      }
    }
    for (var R = 0; R != data.length; ++R) {
      for (var C = 0; C != data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R
        if (range.s.c > C) range.s.c = C
        if (range.e.r < R) range.e.r = R
        if (range.e.c < C) range.e.c = C
        var cell = {
          v: data[R][C]
        }
        if (cell.v == null) continue
        var cell_ref = XLSX.utils.encode_cell({
          c: C,
          r: R
        })

        if (typeof cell.v === 'number') cell.t = 'n'
        else if (typeof cell.v === 'boolean') cell.t = 'b'
        else if (cell.v instanceof Date) {
          cell.t = 'n'
          cell.z = XLSX.SSF._table[14]
          cell.v = datenum(cell.v)
        } else cell.t = 's'

        ws[cell_ref] = cell
      }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
    return ws
  }

  function Workbook () {
    if (!(this instanceof Workbook)) return new Workbook()
    this.SheetNames = []
    this.Sheets = {}
  }
  function s2ab (s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  }

  function datenum (v, date1904) {
    if (date1904) v += 1462
    var epoch = Date.parse(v)
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
  }

  function export_json_to_excel ({
    multiHeader = [],
    header,
    data,
    filename,
    merges = [],
    autoWidth = true,
    bookType = 'xlsx'
  } = {}) {
  /* original data */
    filename = filename || 'excel-list'
    data = [...data]
    data.unshift(header)

    for (let i = multiHeader.length - 1; i > -1; i--) {
      data.unshift(multiHeader[i])
    }

    var ws_name = 'SheetJS'
    var wb = new Workbook()
    var ws = sheet_from_array_of_arrays(data)

    if (merges.length > 0) {
      if (!ws['!merges']) ws['!merges'] = []
      merges.forEach(item => {
        ws['!merges'].push(XLSX.utils.decode_range(item))
      })
    }

    if (autoWidth) {
    /* 设置worksheet每列的最大宽度 */
      const colWidth = data.map(row => row.map(val => {
      /* 先判断是否为null/undefined */
        if (val == null) {
          return {
            wch: 10
          }
        }
        /* 再判断是否为中文 */
        else if (val.toString().charCodeAt(0) > 255) {
          return {
            wch: val.toString().length * 2
          }
        } else {
          return {
            wch: val.toString().length
          }
        }
      }))
      /* 以第一行为初始值 */
      const result = colWidth[0]
      for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
          if (result[j].wch < colWidth[i][j].wch) {
            result[j].wch = colWidth[i][j].wch
          }
        }
      }
      ws['!cols'] = result
    }

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name)
    wb.Sheets[ws_name] = ws

    var wbout = XLSX.write(wb, {
      bookType: bookType,
      bookSST: false,
      type: 'binary'
    })
    saveAs(new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }), `${filename}.${bookType}`)
  }

  function formatJson (filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => {
      if (j === 'timestamp') {
        return parseTime(v[j])
      } else {
        return v[j]
      }
    }))
  }

  function loadScript (src) {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById(src)
      if (!existingScript) {
        const script = document.createElement('script')
        script.id = src
        script.src = src

        document.body.appendChild(script)
        script.onload = function () {
          this.onerror = this.onload = null
          resolve()
        }
      }
    })
  }
})(window.$)
