// ==UserScript==
// @name         Company Helper
// @namespace    namespace
// @version      0.5.1
// @description  description
// @author       tos
// @match        *.torn.com/companies.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370250/Company%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370250/Company%20Helper.meta.js
// ==/UserScript==

const apiKey = 'YOUR_API_KEY'

const torn_api = async (args) => {
  const a = args.split('.')
  if (a.length!==3) throw(`Bad argument in torn_api(args, key): ${args}`)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: "POST",
      url: `https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}&key=${apiKey}`,
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

GM_addStyle(`
  .last_action_icon {
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    background-image: url(/images/v2/sidebar_icons_desktop_2017.png);
    background-repeat: no-repeat;
    background-position-y: -783px;
    width: 34px;
    height: 30px;
  }
  .last-action {
    cursor: pointer;
    width: 103px;
    padding-left: 10px;
    margin-top: -1px;
    position: relative;
    float: left;
    height: 33px;
    line-height: 33px;
    border-left: 1px solid #fff;
    border-right: 1px solid #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .la_pointer {
    cursor: pointer;
  }

  .employees_alert {
    background-color: #f8e0da;
    border-radius: 0px 5px 5px 0px;
    color: red;
    font-weight: bold;
    width: 60%;
  }
  .trains_alert {
    background-color: #d7e1cc;
    border-radius: 0px 5px 5px 0px;
    color: green;
    font-weight: bold;
    width: 60%;
  }
  .eff_alert {
    background: #f8e0da !important;
  }

  .employee_idle {
    color: #e39500;
  }
  .employee_away {
    color: red;
  }
`)

function company_details() {
  const detailsUL = document.querySelector('.company-stats-list.company-info')
  const total_employees = parseInt(detailsUL.querySelector('.total-employees').innerText)
  const limit_employees = parseInt(detailsUL.querySelector('.limit-employees').innerText)
  if (total_employees < limit_employees) detailsUL.children[0].children[3].classList.add('employees_alert')
  const trains = detailsUL.querySelector('.trains')
  const max_trains = parseInt(trains.nextSibling.nodeValue.replace('/', ''))
  let rating = 0
  for (const star of detailsUL.querySelector('.company-rating').children) star.classList.contains('active') ? rating += 1 : null
  if (parseInt(trains.innerText) + rating >= max_trains) trains.parentNode.classList.add('trains_alert')
  torn_api(`company..employees`).then((res) => {
    const employee = res.company_employees
    let maxEff = true
    for (const i in employee) if (employee[i].effectiveness < 5) maxEff = false
    if (!maxEff) document.querySelector('.company-tabs').children[1].classList.add('eff_alert')
  })
}

const toggle_last_action = (n) => {
  while (n && !n.querySelector('.stats')) {n = n.parentNode}
  const statsDIV = n.querySelector('.stats')
  const lastActionDIV = n.querySelector('.last-action')
  const employeeID = lastActionDIV.getAttribute('data-employeeID')
  statsDIV.classList.toggle('hide')
  lastActionDIV.classList.toggle('hide')
  if (lastActionDIV.classList.contains('hide')) lastActionDIV.innerHTML = '<img src="/images/v2/main/ajax-loader.gif">'
  else torn_api(`user.${employeeID}.profile`).then((res) => {
    lastActionDIV.innerHTML = res.last_action.relative
    if (res.last_action.relative.includes('day')) {
      lastActionDIV.classList.add('employee_idle')
      if (parseInt(res.last_action.relative.split(' ')[0]) > 2) lastActionDIV.classList.replace('employee_idle', 'employee_away')
    }
  })
}

const toggleLastActionALL = (statsTitle, employeeUL) => {
  if (statsTitle.innerText === 'Stats (M/I/E)') {
    statsTitle.childNodes[0].nodeValue = 'Last Action'
    for (const i of employeeUL.querySelectorAll('.stats')) i.classList.add('hide')
    for (const j of employeeUL.querySelectorAll('.last-action')) j.classList.remove('hide')
    for (const unloaded of employeeUL.querySelectorAll('.last-action img')) {
      const lastActionDIV = unloaded.parentNode
      const employeeID = lastActionDIV.getAttribute('data-employeeID')
      torn_api(`user.${employeeID}.profile`).then((res) => {
        lastActionDIV.innerHTML = res.last_action.relative
        if (res.last_action.relative.includes('day')) {
          lastActionDIV.classList.add('employee_idle')
          if (parseInt(res.last_action.relative.split(' ')[0]) > 2) lastActionDIV.classList.replace('employee_idle', 'employee_away')
        }
      })
    }
  }
  else {
    statsTitle.childNodes[0].nodeValue = 'Stats (M/I/E)'
    for (const i of employeeUL.querySelectorAll('.last-action')) i.classList.add('hide'), i.innerHTML = '<img src="/images/v2/main/ajax-loader.gif">'
    for (const j of employeeUL.querySelectorAll('.stats')) j.classList.remove('hide')
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if ( node.tagName && node.tagName === 'FORM') {
        switch (node.action) {
          case 'https://www.torn.com/companies.php?step=employees&update=true':
            const statsTitle = node.querySelector('.employee-list-title .stats')
            const employeeUL = node.querySelector('.employee-list')
            statsTitle.insertAdjacentHTML('beforeend', `<i class="last_action_icon right"></i>`)
            statsTitle.querySelector('.last_action_icon').addEventListener('click', () => { toggleLastActionALL(statsTitle, employeeUL) })
            for (const employeeLI of employeeUL.children) {
              const statsDIV = employeeLI.querySelector('.stats')
              const employeeID = employeeLI.getAttribute('data-user')
              statsDIV.classList.add('la_pointer')
              statsDIV.insertAdjacentHTML('afterend', `<div class="last-action hide" data-employeeID="${employeeID}"><img src="/images/v2/main/ajax-loader.gif"></div>`)
              const lastActionDIV = statsDIV.parentNode.querySelector('.last-action')
              statsDIV.addEventListener('click', (e) => {toggle_last_action(e.target)})
              lastActionDIV.addEventListener('click', (e) => {toggle_last_action(e.target)})
            }
            break
          default:
            console.log(node.action)
            break
        }
      }
    }
  }
});

const wrapper = document.querySelector('.company-wrap')
observer.observe(wrapper, { subtree: true, childList: true })
company_details()
