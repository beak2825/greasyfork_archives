// ==UserScript==
// @name         +5 foreign autofill
// @namespace    none
// @version      0.1
// @description  double click foreign input field to autofill to max capacity + 5.
// @author       Cream
// @match        *.torn.com/index.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/421248/%2B5%20foreign%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/421248/%2B5%20foreign%20autofill.meta.js
// ==/UserScript==

const api_key = 'YOUR API KEY HERE'

const cap_increase = 5 //extra travel capacity

const event = new Event('input', {bubbles: true, simulated: true})

document.addEventListener('dblclick', (e) => {
  const location = window.location.pathname + window.location.hash
  console.log(location, e)
  if (e.target && e.target.tagName && e.target.tagName === 'INPUT') {
    const input = e.target
    if (location === '/index.php') {
        if (input.id.includes('item')) plushie_max(input) //foreign input field
    }
  }
})

//foreign plushie buy
function plushie_max (input) {
  const i = document.querySelector('div.user-info div.msg').innerText.match(/(\d+).\/.(\d+)/)
  set_input(input, (parseInt(i[2]) - parseInt(i[1]) + cap_increase))
}

function set_input(input, newval) {
  input.value = newval
  input.dispatchEvent(event)
  input.select()
}

//query api
async function torn_api(args) {
  const a = args.split('.')
  if (a.length!==3) throw(`Bad argument in torn_api(args, key): ${args}`)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: "POST",
      url: `https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}&key=${api_key}`,
      headers: {
        "Content-Type": "application/json"
      },
      onload: (response) => {
          try {
            const resjson = JSON.parse(response.responseText)
            resolve(resjson)
          } catch(err) {
            reject(err)
          }
      },
      onerror: (err) => {
        reject(err)
      }
    })
  })
}