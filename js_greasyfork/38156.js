// ==UserScript==
// @name         Kissmanga to MangaDex Migration Tool
// @description  A tool to help migrating follows to MangaDex from Kissmanga by adding "Find on MangaDex" buttons to your bookmarks list.
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @author       Hajile-Haji
// @match        http://kissmanga.com/BookmarkList
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38156/Kissmanga%20to%20MangaDex%20Migration%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/38156/Kissmanga%20to%20MangaDex%20Migration%20Tool.meta.js
// ==/UserScript==

(() => {
  'use strict';

  let d = document,
      style = d.createElement('style'),
      emailDiv = d.getElementById('divEmailNotify'),
      listHead = d.querySelector('.listing > tbody > tr.head'),
      listItems = d.querySelectorAll('.listing > tbody > tr:not(.head)'),
      closed = true,
      searchModal = d.createElement('div'),
      searchBack = d.createElement('a'),
      searchIframe = d.createElement('iframe'),
      searchUrl = 'https://mangadex.com/?page=search&title='

  listHead.appendChild(d.createElement('th'))
  
  listItems.forEach(item => {
    let seriesTitle = item.querySelectorAll('td')[0].innerText.trim(),
        button = d.createElement('button'),
        buttonText = 'Find on MangaDex',
        td = d.createElement('td')
    
    button.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      
      let btn = e.target
      
      btn.innerText = 'Searching...'
      btn.disabled = true
      
      openSearch(btn.dataset.title)
        .then(() => {
            btn.innerText = buttonText
            btn.disabled = null
        })
        .catch((e) => console.log(e))
    })
    
    button.type = 'button'
    button.classList.add('clean-button')
    button.innerText = buttonText
    button.dataset.title = seriesTitle
    td.appendChild(button)
    item.appendChild(td)
  })

  searchIframe.classList.add('migration-iframe')
  searchIframe.frameBorder = 0
  searchModal.classList.add('migration-modal', 'migration-modal--hide')
  searchModal.appendChild(searchIframe)

  searchModal.addEventListener('click', e => closeSearch())
  
  searchBack.innerText = '← Go back to bookmarks'
  searchBack.href = '#'
  
  searchBack.addEventListener('click', e => {
    e.preventDefault()
    closeSearch()
  })

  searchModal.appendChild(searchBack)

  d.body.appendChild(searchModal)
  
  function openSearch(title) {
    closed = false;
    searchIframe.src = searchUrl + encodeURIComponent(title)

    return new Promise((resolve, reject) => {
      searchIframe.addEventListener('load', e => {
        if (!closed) {
          resolve()
          searchModal.classList.remove('migration-modal--hide')
          setTimeout(() => searchModal.classList.add('migration-modal--show'), 10)
        }
      })

      searchIframe.addEventListener('error', e => {
        reject(e)
      })
    })
  }
  
  function closeSearch() {
    closed = true;
    searchModal.classList.remove('migration-modal--show')
    setTimeout(() => {
      searchModal.classList.add('migration-modal--hide')
      searchIframe.src = ''
    }, 300)
  }

  
  style.id = 'migrationToolStyle'
  style.innerText =
`
.clean-button {
  background: none repeat scroll 0 0 transparent;
  border: 0 none;
	color: #a8ff96;
  cursor: pointer;
  font-family: inherit;
  padding: 4px;
  white-space: nowrap;
}
.clean-button:hover {
  color: #FFF;
}
.migration-modal {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  color: #FFF;
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  justify-content: center;
  left: 0;
  opacity: 0;
  position: fixed;
  top: 0;
  transition: opacity 0.25s ease;
  width: 100vw;
  z-index: 999999999;
}
.migration-modal--hide {
  display: none;
}
.migration-modal--show {
  opacity: 1;
  transition: opacity 0.25s ease;
}
.migration-iframe {
	width: 800px;
	height: 80%;
}
.migration-modal a {
  display: inline-block;
  color: #FFF;
  margin-top: 10px;
}
.migration-modal a:hover {
  text-decoration: underline;
}
`
  d.head.appendChild(style)
})()