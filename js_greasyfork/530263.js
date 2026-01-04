// ==UserScript==
// @name         BIT-本科生教务-成绩导出
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  导出成绩为 CSV 文件，并将网页重写为详细分析表格
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       CJJ, Y.D.X.
// @match        https://jwms.bit.edu.cn/jsxsd/kscj/cjcx_list
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/530263/BIT-%E6%9C%AC%E7%A7%91%E7%94%9F%E6%95%99%E5%8A%A1-%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/530263/BIT-%E6%9C%AC%E7%A7%91%E7%94%9F%E6%95%99%E5%8A%A1-%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  'use strict'
  /* global GM_registerMenuCommand */

  GM_registerMenuCommand('成绩导出', async function () {
    const thead = '序号,开课学期,课程编号,课程名称,成绩,成绩标识,学分,总学时,考试性质,考核方式,课程属性,课程性质,课程归属,课程种类,是否第一次考试,平均分,最高分,该课程所有教学班成绩录入完毕,班级人数,班级百分比,班级排名,专业人数,专业百分比,专业排名,学习人数,学习百分比,学习排名'

    // 获取数据为 CSV
    const rows = Array.from(document.querySelectorAll('#dataList>tbody>tr'))
    rows.shift()
    const tbody = await Promise.all(
      rows.map(
        async (row) => {
          const row_data = Array.from(row.querySelectorAll('td')).map(e => e.innerText)
          row_data.pop()
          console.log('正在处理课程：', row_data[3])

          const url = row.querySelector('a[href][onclick]')?.onclick?.toString()?.match(/(?<=JsMod\(').*?(?=')/)[0]
          if (url) {
            const text = await fetch(url).then(res => res.text())

            // 基本信息

            row_data.push(text.match(/(?<=平均分[^\w]*?)[\w]+/)?.join())
            row_data.push(text.match(/(?<=最高分[^\w]*?)[\w]+/)?.join())
            row_data.push(text.match(/(?<=该课程所有教学班成绩录入完毕[^是否]*?)[是否]+/)?.join())

            // 班级统计数据

            row_data.push(text.match(/(?<=班级人数[^\w]*?)[\w]+(?=[^\w]*?人)/)?.join())
            // 班级百分比
            row_data.push(text.match(/(?<=本人成绩在班级中占[^\w]*?)[\w]+%/)?.join())
            // 班级排名
            row_data.push(Math.round(parseFloat(row_data[row_data.length - 1]) * parseFloat(row_data[row_data.length - 2]) / 100))

            // 专业统计数据

            row_data.push(text.match(/(?<=专业人数[^\w]*?)[\w]+(?=[^\w]*?人)/)?.join())
            // 专业百分比
            row_data.push(text.match(/(?<=本人成绩在专业中占[^\w]*?)[\w]+%/)?.join())
            // 专业排名
            row_data.push(Math.round(parseFloat(row_data[row_data.length - 1]) * parseFloat(row_data[row_data.length - 2]) / 100))

            // 学习统计数据

            row_data.push(text.match(/(?<=学习人数[^\w]*?)[\w]+(?=[^\w]*?人)/)?.join())
            // 学习百分比
            row_data.push(text.match(/(?<=本人成绩在所有学生中占[^\w]*?)[\w]+%/)?.join())
            // 学习排名
            row_data.push(Math.round(parseFloat(row_data[row_data.length - 1]) * parseFloat(row_data[row_data.length - 2]) / 100))
          } else {
            row_data.push('', '', '', '', '', '', '', '', '', '', '', '')
          }

          return row_data.join()
        })
    )
    const content = `${thead}\n${tbody.join('\n')}`

    // 下载 CSV 文件
    const downloadLink = document.createElement('a')
    downloadLink.download = `成绩导出-${format(new Date())}.csv`
    downloadLink.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' }))
    downloadLink.click()

    // 将网页重写为详细分析表格
    document.write(csv2table(content))
  })

  /**
   * Format a date as a filename-compatible string
   * @param {Date} date
   * @returns {string}
   */
  function format (date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}_${minutes}_${seconds}`
  }

  /**
   * @param {string} csv
   * @returns {string[]} Rows of an HTML <table>
   */
  function csv2table (csv) {
    // 将 CSV 字符串分割成行
    const rows = csv.trim().split('\n')
    const table = ['<table border="1">']
    rows.forEach(row => {
      // 将行分割成单元格
      const cells = row.split(',')
      table.push('<tr>')

      // 遍历每个单元格
      cells.forEach(cell => {
        // 添加单元格到行
        table.push(`<td>${cell}</td>`)
      })

      // 结束一行
      table.push('</tr>')
    })

    // 结束表格
    table.push('</table>')
    return table.join('')
  }
})()
