// ==UserScript==
// @name        FIX: HDU教务系统培养计划
// @namespace   Violentmonkey Scripts
// @match       http://jxgl.hdu.edu.cn/*
// @grant       none
// @version     1.24
// @author      Rainbow Yang
// @description 在HDU教务系统培养计划中对“通过情况”进行补全，方便查看
// @downloadURL https://update.greasyfork.org/scripts/424102/FIX%3A%20HDU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%9F%B9%E5%85%BB%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/424102/FIX%3A%20HDU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%9F%B9%E5%85%BB%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

const createStorage = (symbol) => ({
  set: (code, value = 1) => sessionStorage.setItem(symbol + '-' + code, value),
  get: (code) => sessionStorage.getItem(symbol + '-' + code),
})

const scores = createStorage('scores')
const replacements = createStorage('replace')
const readingSources = createStorage('reading')

const getURL = (page, gnmkdm) => () => window.location.href
  .replace('pyjh.aspx', page)
  .replace('N121607', gnmkdm)

const getScoreURL = getURL('xscjcx_dq.aspx', 'N121605')
const getReplacementURL = getURL('xs_kctdcx.aspx', 'N121622')
const getReadingURL = getURL('xsxkqk.aspx', 'N121621')

const openAndUntilWindowLoad = (url) =>
  new Promise(resolve => {
    let theWindow = window.open(url)
    theWindow.onload = () => resolve(theWindow)
  })

const readTable = (table, ...cells) => [...table.rows].slice(1)
  .map(row => cells.map(cell => row.cells[cell].innerHTML))

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const readScore = async () => {
  const scoreWindow = await openAndUntilWindowLoad(getScoreURL())

  scoreWindow.document.querySelector('#ddlxq').selectedIndex = 0
  scoreWindow.document.querySelector('#ddlxn').selectedIndex = 0
  scoreWindow.document.querySelector('#btnCx').click()

  do {
    await delay(200)
  } while (scoreWindow.document
    .querySelector('#tbXsxx > tbody > tr:nth-child(1) > td')
    ?.innerText !== '在 校 学 习 成 绩')
    
  await delay(200)

  let scoreTable = scoreWindow.document.querySelector('#DataGrid1 > tbody')
  readTable(scoreTable, 2, 11).forEach(([code, score]) =>
    scores.set(code, score))

  scoreWindow.close()
}

const readReplacement = async () => {
  const replacementWindow = await openAndUntilWindowLoad(getReplacementURL())

  const singleTable = replacementWindow.document.querySelector('#dbgrid')
  const composeTable = replacementWindow.document.querySelector('#Datagrid1')
  readTable(singleTable, 1, 3).forEach(([code, replacementCode]) =>
    replacements.set(code, replacementCode))
  readTable(composeTable, 1, 3).forEach(([code, replacementCode]) =>
    replacements.set(code, replacementCode))

  replacementWindow.close()
}

const readReading = async () => {
  const readingWindow = await openAndUntilWindowLoad(getReadingURL())

  const readingTable = readingWindow.document.querySelector('#DBGrid')
  readTable(readingTable, 0).forEach(([code]) =>
    readingSources.set(code.split('-')[3]))

  readingWindow.close()
}

const addReadButton = () => {
  const readScoreButton = document.createElement('input')
  Object.assign(readScoreButton, {
    id: 'ReadButton',
    type: 'button',
    className: 'button',
    value: '读取成绩',
  })
  readScoreButton.onclick = () => {
    if (confirm('点击按钮之后\n将会自动弹出三个页面\n' +
      '分别用于读取课程的『成绩』『替代情况』和『修读情况』\n')) {
      Promise.all([readScore(), readReplacement(), readReading()]).then(() =>
        sessionStorage.setItem('hasRead', 'true'),
      )
    }
  }

  document.querySelector('#Button1').parentNode.appendChild(readScoreButton)
}

// 只需选择修一门的课程（目前仅限计科）
const optionsArray = [
  ['A0505290', 'A0510010', 'A050148s'],   // 计算机科学导论
  [                                       // 大学英语拓展课
    'A1101160', 'A1102900', 'A1103780', 'A1101030', 'A1101016',
    'A1102330', 'A1103190', 'A1102080', 'A1103750', 'A1102800'],
  ['A1101121', 'A1101122', 'A1101123'],   // 大学英语精读1A/B/C
  ['A1101181', 'A1101182', 'A1101183'],   // 大学英语听说1A/B/C
  ['A1101141', 'A1101142', 'A1101143'],   // 大学英语精读2A/B/C
  ['A1101191', 'A1101192', 'A1101193'],   // 大学英语听说2A/B/C
  ['A0714202', 'A0714222'],               // 高等数学A2/C2
  ['A0715011', 'A0715051'],               // 大学物理1/物理学原理及工程应用1
  ['A0715012', 'A0715052'],               // 大学物理2/物理学原理及工程应用2
  ['A0500820', 'A0502380'],               // 面向对象程序设计（Java/C++）
  ['A0303090', 'A0507970'],               // 项目管理/项目管理与案例分析
  ['B0505120', 'B0500660'],               // Android/IOS移动开发
]

const getResult = (code) => {
  let isReading = readingSources.get(code)
  if (isReading) {
    return '修读中'
  }

  let score = scores.get(code)
  if (score) {
    return score
  }

  let hasReplacement = replacements.get(code)
  if (hasReplacement) {
    return hasReplacement.split(',')
      .map(replacement => `${scores.get(replacement)}(${replacement})`)
  }

  let option = optionsArray
    .filter(options => options.includes(code))[0]
    ?.find(option =>
      readingSources.get(option) ||
      scores.get(option) ||
      replacements.get(option))
  if (option) {
    return `已选(${option})`
  }
}

const writeScores = () => {
  let hasRead = sessionStorage.getItem('hasRead')
  const planTable = document.querySelector('#DBGrid');
  [...planTable.rows].slice(1, -1).forEach(row => {
    let code = row.cells[0].innerHTML
    row.cells[16].innerHTML = getResult(code) || (hasRead ? '未知' : '请点击 读取成绩')
  })
}

function main () {
  if (document.getElementById('HyperLink1')?.innerText === '查看培养计划说明') {
    if (!document.getElementById('ReadButton')) {
      addReadButton()
    } else {
      writeScores()
    }
  }
  setTimeout(main, 200)
}

main()
