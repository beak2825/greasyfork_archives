// ==UserScript==
// @name         Elim Team Scraper
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match       *.torn.com/competition.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390080/Elim%20Team%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/390080/Elim%20Team%20Scraper.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.classList && node.classList.contains('team-list-wrap')) {
        let data = []
        const team_name = document.querySelector('#competition-wrap .content-title h4').innerText
        const UL = node.querySelector('ul.competition-list.bottom-round')
        Array.from(UL.children).forEach((li) => {
          let row = {}
          row.team = team_name
          row.userid = li.querySelector('a.user.name').getAttribute('data-placeholder').split('[')[1].replace(']', '')
          row.level = li.querySelector('.level').innerText
          row.attacks = li.querySelector('.rec-attacks').innerText
          data.push(row)
        })
        submit_list(data)//.then(r => console.log('res:', r.responseText))
      }
    }
  }
})
const wrapper = document.querySelector('#competition-wrap')
observer.observe(wrapper, { subtree: true, childList: true })


async function submit_list(data) {
  //console.log(data)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://www.39th.xyz/elimall.php',
      headers:{
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data),
      onabort: (err) => { reject(err) },
      onerror: (err) => { reject(err) },
      onload: (res) => { resolve(res) }
    })
  })
}



