// ==UserScript==
// @name         Discourse Done Green
// @version      2025-01-16
// @description  Press Alt+L to make topic green
// @author       Dimava
// @match        https://discuss.eroscripts.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eroscripts.com
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/46078
// @downloadURL https://update.greasyfork.org/scripts/523976/Discourse%20Done%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/523976/Discourse%20Done%20Green.meta.js
// ==/UserScript==

const jsonStorage = new Proxy(localStorage, {
  set: (_, k, v) => (localStorage.setItem(k, JSON.stringify(v)), true),
  get: (_, k) => JSON.parse(localStorage.getItem(k) ?? 'null'),
  deleteProperty: (_, k) => localStorage.getItem(k) ? (localStorage.removeItem(k), true) : false,
})
const kds = {}
addEventListener('keydown', (e) => {
  const code = `${e.ctrlKey ? 'Ctrl' : ''}${e.shiftKey ? 'Shift' : ''}${e.altKey ? 'Alt' : ''}${e.code}`
  if (kds[code]) {
    e.preventDefault()
    kds[code]()
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////

kds.AltKeyL = () => {
  addToDoneStyle()
  applyDoneStyle()
}
addEventListener('visibilitychange', () => applyDoneStyle())
applyDoneStyle()

////////////////////////////////////////////////////////////////////////////////////////////////////

function applyDoneStyle() {
  const list = jsonStorage.doneList ?? []
  const style = document.querySelector('style#applyDoneStyle')
    ?? document.createElement('style')
  style.id = 'applyDoneStyle'
  style.innerHTML = `
        ${list.map(e => `a[href$="/${e}"]::before`).join(',\n')} {
            content: "✅";
        }
        ${list.map(e => `a[href$="/${e}"]`).join(',\n')} {
            background: #59fc595c;
        }
        
        ${list.map(e => `article[data-topic-id="${e}"]#post_1`).join(',\n')} {
            background: #59fc595c;
        }
    `
  console.log(style)
  document.head.append(style)
}

function addToDoneStyle() {
  num = location.pathname.match(/^\/t\/[\w-]+\/(?<num>\d+)(\/|$)/).groups.num
  list = jsonStorage.doneList ?? []
  if (!list.includes(num))
    list.push(num)
  jsonStorage.doneList = list
}
