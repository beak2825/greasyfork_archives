// ==UserScript==
// @name         大淘客开放平台文档表格转peewee格式
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.1
// @description  懒得手写
// @author       windeng
// @match        https://www.dataoke.com/kfpt/api-d.htm*
// @icon         https://www.dataoke.com/favicon.ico
// @require      https://greasyfork.org/scripts/433877-%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0-%E5%8B%BF%E5%AE%89%E8%A3%85/code/%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0%EF%BC%8C%E5%8B%BF%E5%AE%89%E8%A3%85.js?version=978987
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438729/%E5%A4%A7%E6%B7%98%E5%AE%A2%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%96%87%E6%A1%A3%E8%A1%A8%E6%A0%BC%E8%BD%ACpeewee%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/438729/%E5%A4%A7%E6%B7%98%E5%AE%A2%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E6%96%87%E6%A1%A3%E8%A1%A8%E6%A0%BC%E8%BD%ACpeewee%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

function toPeeweeType(type, sample, desc) {
  const helpText = `${desc}. eg.${sample}`.replace(/"/g, '\\"')
  if (type === 'Number') return `IntegerField(null=True, help_text="${helpText}")`
  else if (type === 'String') return `CharField(max_length=128, null=True, help_text="${helpText}")`
  else if (type === 'Boolean') return `BooleanField(null=True, help_text="${helpText}")`
  else if (type === 'Date') return `DateTimeField(null=True, help_text="${helpText}")`
  else return `TextField(null=True, help_text="${helpText}")`
}

function toPeeweeRow(field, type, sample, desc) {
  return `${field} = ${toPeeweeType(type, sample, desc)}`
}

function getHeaders(table) {
  let ths = table.querySelectorAll('div.layui-table-header tr > th')
  let resp = []
  for (let th of ths) {
    resp.push(th.innerText.trim())
  }
  return resp
}

function getRows(table) {
  let resp = []
  let trs = table.querySelectorAll('div.layui-table-body tr')
  for (let tr of trs) {
    let tds = tr.querySelectorAll('td')
    let row = []
    for (let td of tds) {
      let s = td.innerText.trim()
      s = s.replace(/复制\s*$/g, '')
      row.push(s)
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
  let descIndex = headers.indexOf('说明')

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
  let tables = document.querySelectorAll('div.layui-table-box')
  for (let table of tables) {
    handleTable(table)
  }
}

async function addButton() {
  await WaitUntil(() => {
    return !!document.querySelector('div.info')
  })
  let elem = document.createElement('a')
  elem.setAttribute('id', 'to-peewee')
  elem.innerText = '表格转peewee格式（在console里）'
  elem.onclick = main
  let p = document.querySelector('div.info')
  p.parentNode.insertBefore(elem, p.nextSibling)
}

(function () {
  'use strict';

  // Your code here...
  addButton()
})();