// ==UserScript==
// @name         淘宝开放平台文档表格转peewee格式
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.3
// @description  懒得手写
// @author       windeng
// @match        https://open.taobao.com/api.htm*
// @icon         https://www.google.com/s2/favicons?domain=taobao.com
// @require      https://greasyfork.org/scripts/433586-simpletools/code/SimpleTools.js?version=977251
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433585/%E6%B7%98%E5%AE%9D%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%96%87%E6%A1%A3%E8%A1%A8%E6%A0%BC%E8%BD%ACpeewee%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/433585/%E6%B7%98%E5%AE%9D%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%96%87%E6%A1%A3%E8%A1%A8%E6%A0%BC%E8%BD%ACpeewee%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

function toPeeweeType(type, sample, desc) {
  const helpText = `${desc}. eg.${sample}`.replace(/"/g, '\\"')
  if (type === 'Number') return `IntegerField(null=True, help_text="${helpText}")`
  else if (type === 'String') return `CharField(max_length=128, null=True, help_text="${helpText}")`
  else if (type === 'Boolean') return `BooleanField(null=True, help_text="${helpText}")`
  else if (type === 'Date') return `DateTimeField(null=True, help_text="${helpText}")`
}

function toPeeweeRow(field, type, sample, desc) {
  return `${field} = ${toPeeweeType(type, sample, desc)}`
}

function getHeaders(table) {
  let ths = table.querySelectorAll('div.header > div.header-tr > div.header-th')
  let resp = []
  for (let th of ths) {
    resp.push(th.innerText.trim())
  }
  return resp
}

function getRows(table) {
  let resp = []
  let trs = table.querySelectorAll('div.body > div.body-tr.leaf')
  for (let tr of trs) {
    let tds = tr.querySelectorAll('div.body-td')
    let row = []
    for (let td of tds) {
      row.push(td.innerText.trim())
    }
    resp.push(row)
  }
  return resp
}

function handleTable(table) {
  let headers = getHeaders(table)
  console.log(headers)
  let rows = getRows(table)
  console.log(rows)

  let fieldIndex = headers.indexOf('名称')
  let typeIndex = headers.indexOf('类型')
  let sampleIndex = headers.indexOf('示例值')
  let descIndex = headers.indexOf('描述')

  let msgs = []
  for (let row of rows) {
    let field = row[fieldIndex]
    let type = row[typeIndex]
    let sample = row[sampleIndex]
    let desc = row[descIndex]
    let s = toPeeweeRow(field, type, sample, desc)
    msgs.push(s)
  }
  console.log(msgs.join('\n'))
}

function main() {
  let tables = document.querySelectorAll('div.open-table')
  for (let table of tables) {
    handleTable(table)
  }
}

async function addButton() {
  await WaitUntil(() => {
    return !!document.querySelector('div.page-title')
  })
  let elem = document.createElement('a')
  elem.setAttribute('id', 'to-peewee')
  elem.innerText = '表格转peewee格式（在console里）'
  elem.onclick = main
  let p = document.querySelector('div.page-title')
  p.parentNode.insertBefore(elem, p.nextSibling)
}

(function () {
  'use strict';

  // Your code here...
  addButton()
})();