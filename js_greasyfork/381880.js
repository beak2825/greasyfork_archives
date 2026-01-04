// ==UserScript==
// @name         hpc_job
// @version      0.0.6
// @include      http://219.217.238.193/job
// @include      http://h/job
// @include      http://hh/job
// @description  self mode
// @run-at       document-start
// @namespace    https://greasyfork.org/users/164996
// @downloadURL https://update.greasyfork.org/scripts/381880/hpc_job.user.js
// @updateURL https://update.greasyfork.org/scripts/381880/hpc_job.meta.js
// ==/UserScript==
const head = `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>job</title>
<style>
  body {
    user-select: none;
    margin: 0;
  }
  #table {
    display: grid;
    grid-template-columns: repeat(9, auto);
    grid-column-gap: 1em;
  }
  #node{
    margin: 0;
  }
  .other {
    color: #bbb;
  }
  #disconnect{
    display: none;
    color: #bbb;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
  }
</style>`
const body = `<div id="app">
<div id='disconnect'>disconnect</div>
<pre id="node"></pre>
<div id="table"></div>
</div>`
document.head.innerHTML = head
document.body.innerHTML = body
const timeout = 5000
const usr = 'bilabila'
const app = document.querySelector('#app')
const node = document.querySelector('#node')
const table = document.querySelector('#table')
const disconnect = document.querySelector('#disconnect')
const parse = s => {
  const t = document.implementation.createHTMLDocument()
  t.body.innerHTML = s
  return t
}
const fetchWithTimeout = (url, options) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    )
  ])
}
const main = async () => {
  let a
  try {
    a = await fetchWithTimeout(window.location.href + 's')
    a = await a.text()
  } catch (error) {
    disconnect.style.display = 'block'
    return
  }
  disconnect.style.display = 'none'
  a = parse(a)
  let b = [...a.querySelectorAll('tr')].map(i =>
    [...i.children].map(j => j.textContent.trim())
  )
  let c = b.reduceRight(
    (a, c) =>
      c[1] === usr
        ? c.map(i => '<div>' + i + '</div>').join('') + a
        : a + c.map(i => '<div class=other>' + i + '</div>').join(''),
    ''
  )
  let d = a.querySelector('table').nextSibling.textContent.trim()
  d = d.slice(d.indexOf('\n') + 1, d.lastIndexOf('\n'))
  requestAnimationFrame(() => {
    node.innerHTML = d
    table.innerHTML = c
  })
}

main()
let timer = setInterval(main, timeout)
let changeTimer

document.addEventListener(
  'visibilitychange',
  () => {
    clearTimeout(changeTimer)
    if (document.hidden) {
      changeTimer = setTimeout(() => clearInterval(timer), timeout)
    } else {
      main()
      clearInterval(timer)
      timer = setInterval(main, timeout)
    }
  },
)
