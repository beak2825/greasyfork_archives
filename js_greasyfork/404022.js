// ==UserScript==
// @name        Sidebar toggle, Ru/En lang buttons for wikipedia.org
// @namespace   Violentmonkey Scripts
// @match       https://*.wikipedia.org/*
// @grant       none
// @version     1.1
// @author      -
// @description 24.05.2020, 12:45:17
// @downloadURL https://update.greasyfork.org/scripts/404022/Sidebar%20toggle%2C%20RuEn%20lang%20buttons%20for%20wikipediaorg.user.js
// @updateURL https://update.greasyfork.org/scripts/404022/Sidebar%20toggle%2C%20RuEn%20lang%20buttons%20for%20wikipediaorg.meta.js
// ==/UserScript==

const content = document.querySelector('#content')
const sidebar = document.querySelector('#mw-panel')
let open = true

const buttons = document.createElement('div')
const sidebarBtn = document.createElement('button')
const engBtn = document.createElement('button')
const rusBtn = document.createElement('button')

Object.assign(buttons.style, {position: 'absolute', top: '10px', left: '10px'})
sidebarBtn.innerText = 'sidebar'
engBtn.innerText = 'Eng'
rusBtn.innerText = 'Rus'

buttons.append(sidebarBtn, engBtn, rusBtn)

document.body.append(buttons)

function toggleSidebar() {
  if (open) {
    content.style.marginLeft = '0'
    sidebar.style.display = 'none'
  } else {
    content.style.marginLeft = null
    sidebar.style.display = null
  }
  open = !open
}

// document.body.addEventListener('keydown', e => {})

sidebarBtn.onclick = toggleSidebar

rusBtn.onclick = () => rus.click()

toggleSidebar()


const eng = document.querySelector('.interlanguage-link-target[hreflang="en"]')
const rus = document.querySelector('.interlanguage-link-target[hreflang="ru"]')

if (eng) engBtn.onclick = () => eng.click()
else engBtn.remove()
if (rus) rusBtn.onclick = () => rus.click()
else rusBtn.remove()







