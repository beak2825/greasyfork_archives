// ==UserScript==
// @name        @SPASM/github.com
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      -
// @description 1/27/2023, 6:13:34 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458961/%40SPASMgithubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/458961/%40SPASMgithubcom.meta.js
// ==/UserScript==
GM_addStyle(`
body .container-xl {
      max-width: calc(100% - 100px);
}

body .BorderGrid {
    display: flex;
    flex-direction: column;
    height: 100%;
}

body .BorderGrid-cell {
  border-left: none;
  border-right: none;
  border-bottom: none;
  display: flex;
  flex-direction: column;
}

.__SIDEBAR {
  margin-top: 0px;
}

.__SIDEBAR a {
  display: block;
}

.__SIDEBAR__1 {
  margin-left: 0px;
}

.__SIDEBAR__2 {
  margin-left: 30px;
}

.__SIDEBAR__3 {
  margin-left: 60px;
}

.__SIDEBAR__CONTEINER {
  position: sticky;
  top: 0px;
}
`)

const anchorsTags = ['h1', 'h2', 'h3'].map((h) => `.markdown-body ${h} .anchor`).join(', ')
const sidebar = document.querySelector('.Layout-sidebar .BorderGrid')
const anchors = Array.from(document.querySelectorAll(anchorsTags))

const container = document.createElement('div')
container.classList.add('__SIDEBAR')

const row = document.createElement('div')
row.classList.add('BorderGrid-row', '__SIDEBAR__CONTEINER')

const cell = document.createElement('div')
cell.classList.add('BorderGrid-cell')

const anchorsNodes = anchors.map((a) => {
  const text = a.parentNode.textContent;

  const h = a.parentNode.tagName.replace('H', '')

  const node = document.createElement('a')
  node.textContent =  text
  node.href = a.href
  node.classList.add('__SIDEBAR__' + h)

  return node
})

sidebar.append(row)
row.append(cell)
cell.append(container)
container.append(...anchorsNodes)