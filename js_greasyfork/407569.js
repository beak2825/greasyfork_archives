// ==UserScript==
// @name         СКК подстветка
// @version      0.0.5
// @description  скк
// @author       Yandex
// @include      https://taximeter-admin.taxi.yandex-team.ru/blacklist
// @grant        none
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/407569/%D0%A1%D0%9A%D0%9A%20%D0%BF%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B5%D1%82%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/407569/%D0%A1%D0%9A%D0%9A%20%D0%BF%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B5%D1%82%D0%BA%D0%B0.meta.js
// ==/UserScript==
const style = document.createElement('style')
style.innerHTML = `
.history-table.opened{
  transform: translateY(0%)!important;
}

.close-table::before, .close-table::after{
  left: 15px;
  content: '';
  position: absolute;
  width: 2px;
  height: 33px;
  background-color: black;
}

.close-table:hover{
  opacity: 1!important;
}

.close-table::before{
  transform: rotate(45deg);
}

.close-table::after{
  transform: rotate(-45deg);
}
`
document.querySelector('head').append(style)

const btnHistory = document.createElement('button')

btnHistory.className = `btn btn-default`
btnHistory.textContent = `История ЧС`
btnHistory.setAttribute('title', 'Посмотреть историю ЧС')
btnHistory.style.marginRight = '5px'

document.querySelector('a[href="/blacklist/item/add"]').before(btnHistory)

const tableHistory = document.createElement('div'),
  main = document.querySelector('.container-flex')

tableHistory.classList.add('history-table')
tableHistory.style = `background-color: #fff; position: absolute; bottom: 0; right: 0; width: 99%; transform: translateY(100%); transition: all .5s; box-shadow: 0 6px 12px black; padding: 10px; height: 40%; z-index: 99999; margin: 0 10px; border-radius: 5px 5px 0 0; overflow-y: scroll;`

main.append(tableHistory)

const closeTable = document.createElement('div')
closeTable.classList.add('close-table')
tableHistory.append(closeTable)
closeTable.style = `position: absolute; top: 32px; right: 32px; width: 32px; height: 32px; cursor: pointer; opacity: 0.5;`

const labelHistory = document.createElement('h1')
tableHistory.append(labelHistory)
labelHistory.innerHTML = `История`

const mainTable = document.createElement('div')
tableHistory.append(mainTable)
mainTable.style = `width: 100%; height: 100%; margin-top: 20px;`

const closeTableHistory = () => {
  tableHistory.classList.toggle('opened')
  // tableHistory.classList.contains('opened') ? tableHistory.style.transform = `translateX(0%)` : tableHistory.style.transform = `translateX(100%)`
}

async function postData(id) {

  let res = await fetch(`https://taximeter-admin.taxi.yandex-team.ru/blacklist/history?id=${id}`, {
    method: 'GET',
    headers: {
      //'Content-Type': 'application/json; charset=utf-8',
      //'X-Requested-With': 'XMLHttpRequest',
      'x-taximeter-antiforgery': token
    }
  })
  return res.ok ? res.text() : 'ошибка'
}

btnHistory.addEventListener('click', closeTableHistory)
closeTable.addEventListener('click', closeTableHistory)
document.querySelector('.datagrid-content').addEventListener('click', event => {
  let id = event.target.closest('tr').innerHTML.match(/<b>((.+?\s)?(.+))<\/b><br>/)[3]
  postData(id).then(data => {
    let html = data.match(/<table class="table table-hover">[\s,\S]+<\/table>/)[0]
    const pattern1153 = /<td>(\s+https:\/\/st\.yandex-team\.ru\/PHOTOCONTROL-1153\s+(\(.+\))?\s+)<\/td>/g
    const pattern737 = /<td>(\s+https:\/\/st\.yandex-team\.ru\/(PHOTOCONTROL-1117|PHOTOCONTROL-737)\s+(\(.+\))?\s+)<\/td>/g
    let renderHtml = html.replace(pattern1153, `<td style="color: white; background-color: orange;};">$1</td>`).replace(pattern737, `<td style="color: white; background-color: #00ff08;};">$1</td>`)
    labelHistory.innerHTML = `История ${id}`
    mainTable.innerHTML = renderHtml
  })
})