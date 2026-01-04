// ==UserScript==
// @name         War Exports
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/war.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/388490/War%20Exports.user.js
// @updateURL https://update.greasyfork.org/scripts/388490/War%20Exports.meta.js
// ==/UserScript==

GM_addStyle(`
.x_export {
  position: fixed;
  right: 5px;
  top: 100px;
}
`)

const parseRow = (li) => {
  const username = li.querySelector('a.user.name').getAttribute('data-placeholder')
  const lvl = li.querySelector('div.lvl').innerText.replace(',', '')
  const points = li.querySelector('div.points').innerText.replace(',', '')
  const joins = li.querySelector('div.joins').innerText.replace(',', '')
  const clears = li.querySelector('div.knock-off').innerText.replace(',', '')
  return `${username},${lvl},${points},${joins},${clears}`
}

//WAR REPORT
if (window.location.search.includes('step=warreport')) {
  const war_title = document.querySelector('DIV.title-black').innerText
  const war_info = document.querySelector('DIV.faction-war-info').innerText
  let csvContent = 'data:text/csv;charset=utf-8,'
  csvContent += war_title.replace('#', '')+ '\n' + war_info+ '\n\n'
  csvContent += document.querySelector('DIV.faction-names SPAN.enemy').innerText + '\n'
  csvContent += 'Members,Level,Points,Joins,Clears\n'
  csvContent += Array.from(document.querySelectorAll('DIV.enemy-faction UL.members-list>LI'), li => parseRow(li)).join('\n')
  csvContent += '\n\n' + document.querySelector('DIV.faction-names SPAN.your').innerText + '\n'
  csvContent += 'Members,Level,Points,Joins,Clears\n'
  csvContent += Array.from(document.querySelectorAll('DIV.your-faction UL.members-list>LI'), li => parseRow(li)).join('\n')
  const encodedUri = encodeURI(csvContent)
  document.body.insertAdjacentHTML('afterbegin', `<a class="x_export" href="${encodedUri}" download="${war_title.replace(/[ |#]{1,}/g, '_')}.csv">Save as CSV</a>`)
}