// ==UserScript==
// @name         TornAPI Quick Fill
// @namespace    TornTos
// @version      2.3
// @description  Prefill API key and check 'pretty' radio buttons.
//               Makes available fields clickable and fires try it button when clicked.
//               Ctrl-Click to add multiple selections, try-it button will need to be click manually with this method.
// @author       tos
// @match       *.torn.com/api.html*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25027/TornAPI%20Quick%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/25027/TornAPI%20Quick%20Fill.meta.js
// ==/UserScript==

const keyup = new Event('keyup')
let APIkey = localStorage.getItem('x_apikey') || ''

GM_addStyle(`
span.click_select {
  cursor: pointer;
}
#save_api_key {
  margin: 0em 0.5em;
}
`)

const sections = {
  u: `https://api.torn.com/user/?selections=lookup&key=`,
  p: `https://api.torn.com/property/?selections=lookup&key=`,
  f: `https://api.torn.com/faction/?selections=lookup&key=`,
  c: `https://api.torn.com/company/?selections=lookup&key=`,
  i: `https://api.torn.com/market/?selections=lookup&key=`,
  t: `https://api.torn.com/torn/?selections=lookup&key=`
}

const fill_selections = async () => {
  for (const s in sections) {
    const res = await fetch(sections[s]+APIkey).then(r => r.json())
    document.querySelector(`p.${s}_fields`).innerHTML = `<small><strong>Available fields: </strong><span class="click_select">${res.selections.join('</span>, <span class="click_select">')}</span></small>`
  }
  document.querySelectorAll('span.click_select').forEach((span) => {
    span.addEventListener('click', (e) => {
      const panel = e.target.closest('div.panel-group')
      const selections_input = panel.querySelector('input[id*=selections]')
      if (e.ctrlKey) {
        if (selections_input.value === '') selections_input.value = e.target.innerText
        else selections_input.value += ','+e.target.innerText
      }
      else {
        selections_input.value = e.target.innerText
        panel.querySelector('BUTTON').click()
      }
      selections_input.dispatchEvent(keyup)
    })
  })
}


document.getElementById('documentation').style.display = 'none'
document.getElementById('demo').style.display = 'block'
$('#api_key').unbind('focusout')
$('.updateURL').unbind('keyup')
const api_key_input = document.getElementById('api_key')
api_key_input.value = APIkey
api_key_input.insertAdjacentHTML('afterend', `<button id="save_api_key">Save</button>`)
const save_button = document.querySelector('#save_api_key')
save_button.addEventListener('click', (e) => {
  APIkey = api_key_input.value
  localStorage.setItem('x_apikey', APIkey)
})
document.querySelectorAll('input[type=radio][value=pretty]').forEach((radio) => {radio.checked = true})
document.querySelectorAll('input[id*=id],input[id*=selections]').forEach((input) => {
  input.addEventListener('keyup', (e)=> {
    const panel = e.target.closest('div.panel-group')
    const url_shown = document.querySelector(`#${e.target.getAttribute('data-field')}url`)
    const url_split = url_shown.innerText.split('/')
    url_split[4] = `${panel.querySelector('input[id*=id]').value}?selections=${panel.querySelector('input[id*=selections]').value}&key=`
    url_shown.innerText = url_split.join('/')
  })
})

document.querySelectorAll('BUTTON.btn').forEach(try_it_button => try_it_button.addEventListener('click', (e) => {
  e.target.parentElement.querySelector('div[class$=_result]').innerHTML = '' //fix for site adding a new panel every request
}))

fill_selections()
