// ==UserScript==
// @name         TC Other Company
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match       *.torn.com/joblist.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383736/TC%20Other%20Company.user.js
// @updateURL https://update.greasyfork.org/scripts/383736/TC%20Other%20Company.meta.js
// ==/UserScript==

const api_key = 'APIKEY'

GM_addStyle(`
.x_lastActiveAll {
  line-height: 30px;
}
.x_lastActiveAll div {
  background-image: radial-gradient(#FFF 10%, #FFF0 90%);
  border-radius: 50%;
  cursor: pointer;
}
.x_lastActive {
  line-height: 30px;
}
.x_lastActive a {
  cursor: pointer;
  verticle-align: middle;
}
`)

const torn_api = async (args) => {
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

const company_info = async () => {
  const employeeUL = document.querySelector('ul.employees-list')
  document.querySelector('ul.title li.status').insertAdjacentHTML('afterend', `<li class="x_lastActiveAll"><div><a class="last-spins-icon"></a><div/></li>`)
  for ( const employeeLI of employeeUL.children) {
    const user_id = employeeLI.querySelector('li.employee a').href.split('XID=')[1]
    employeeLI.querySelector('li.clear').insertAdjacentHTML('beforebegin', `<li class="x_lastActive"><a class="last-spins-icon" data-xuserid="${user_id}"></a></li>`)
    employeeLI.querySelector('li.x_lastActive a').addEventListener('click', (e) => {
      torn_api(`user.${user_id}.profile`).then((res) => {employeeLI.querySelector('li.status').innerText = res.last_action.relative})
    })
  }
  const all_button = document.querySelector('li.x_lastActiveAll div')
  all_button.addEventListener('click', (e) => {
    for ( const employeeLI of employeeUL.children) {
      const user_id = employeeLI.querySelector('li.employee a').href.split('XID=')[1]
      torn_api(`user.${user_id}.profile`).then((res) => {employeeLI.querySelector('li.status').innerText = res.last_action.relative})
    }
  })
}

setTimeout(company_info, 1000)