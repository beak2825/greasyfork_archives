// ==UserScript==
// @name         Komica ID search
// @namespace    https://greasyfork.org/users/57176
// @match        https://gaia.komica.org/00/**
// @match        https://gaia.komica.org/00b/**
// @match        https://gaia.komica1.org/00b/**
// @match        https://gaia.komica2.cc/00b/**
// @match        https://gita.komica1.org/00b/**
// @icon         https://komica1.org/favicon.ico
// @grant        none
// @version      1.0.8
// @author       peng-devs
// @description  Click ID to open search result page.
// @allFrames    true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453985/Komica%20ID%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/453985/Komica%20ID%20search.meta.js
// ==/UserScript==
'use strict'

const NAME = 'Komica ID Search'

function createHiddenFormInput(name, value) {
  let input = document.createElement('input')
  input.type = 'hidden'
  input.name = name
  input.value = value
  return input
}

function createHiddenForm(id) {
  const form = document.createElement('form')
  form.method = 'post'
  form.action = 'pixmicat.php'
  form.target = '_blank'
  form.style = 'display:hidden'

  form.appendChild(createHiddenFormInput('mode', 'search'))
  form.appendChild(createHiddenFormInput('field', 'now'))
  form.appendChild(createHiddenFormInput('method', 'AND'))
  form.appendChild(createHiddenFormInput('keyword', id))

  return form
}

function searchId(event) {
  const id = event.currentTarget.dataset.id
  if (!id) return

  const form = createHiddenForm(id)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

function observingThreadChanges(thread) {
  const observer = new MutationObserver(mutationList => {
    mutationList.forEach(mutation => {
      if (mutation.target.nodeName.toLowerCase() != 'span'
        || !mutation.target.className.includes('id'))
        return

      mutation.target.removeEventListener('click', searchId)  // just in case
      mutation.target.addEventListener('click', searchId)
    })
  })
  observer.observe(thread, { subtree: true, childList: true })

  return observer
}


try {
  console.log(`[${NAME}] Initializing...`)

  const thread = document.getElementById('threads')
  thread.querySelectorAll('span.id')
    .forEach(ele => ele.addEventListener('click', searchId))

  // The 'span.id' are post-rendered elements. They may not exist when our codes
  // are executing. So we use observer to catch them when they are created.
  observingThreadChanges(thread)

  console.log(`[${NAME}] Loaded`)
} catch(err) {
  console.error(`[${NAME}] `, err)
}
