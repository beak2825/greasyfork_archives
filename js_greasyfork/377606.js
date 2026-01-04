// ==UserScript==
// @name        [RED] Highlight releases present in multiple collage subscriptions
// @namespace   https://redacted.ch
// @author      wavelight
// @description Highlights releases that are present in multiple collage updates. Expand to list containing collages
// @match       https://redacted.ch/userhistory.php?action=subscribed_collages
// @run-at      document-idle
// @version     1.0.3
// @downloadURL https://update.greasyfork.org/scripts/377606/%5BRED%5D%20Highlight%20releases%20present%20in%20multiple%20collage%20subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/377606/%5BRED%5D%20Highlight%20releases%20present%20in%20multiple%20collage%20subscriptions.meta.js
// ==/UserScript==

const doc = document

const selectors = {
  collages() { return doc.querySelectorAll('.subscribed_collages_table') },
  collageName(collageEl) { return collageEl.querySelector('.colhead_dark strong') },
  groups(collageEl) { return collageEl.nextElementSibling.querySelectorAll('.group') },
  release(groupEl) { return groupEl.querySelector('.group_info > strong > .tooltip') }
}

const parsers = {
  collageName(collageNameEl) { return collageNameEl.innerText },
  releaseId(releaseEl) { return new URL(releaseEl).searchParams.get('id') }
}

const renderers = {
  releaseButton(count) {
    const buttonEl = doc.createElement('button')
    buttonEl.innerText = `In ${count} collage updates`
    
    buttonEl.addEventListener('click', (evt) => {
      const { target } = evt
      target.disabled = true
      target.nextElementSibling.style.display = 'block'
    })

    buttonEl.style.cssText = `
      display: inline-block;
      margin-top: 0.25em;
    `

    return buttonEl
  },
  collageList(collageNames) {
    const ulEl = doc.createElement('ul')
    ulEl.style.cssText = `
      display: none;
      margin-left: 0.5em;
    `
  
    collageNames.forEach(name => {
      const liEl = doc.createElement('li')
      liEl.innerText = name
      ulEl.appendChild(liEl)
    })

    return ulEl
  },
  releaseCounter(count, collageNames) {
    const divEl = doc.createElement('div')
    divEl.style.marginBottom = '0.25em'

    divEl.appendChild(this.releaseButton(count))
    divEl.appendChild(this.collageList(collageNames))
  
    return divEl
  }
}

const init = () => {
  const releases = []
  const releaseData = new Map()

  selectors.collages().forEach((collageEl) => {
    const collageName = parsers.collageName(selectors.collageName(collageEl))
    selectors.groups(collageEl).forEach((groupEl) => {
      const releaseEl = selectors.release(groupEl)
      const id = parsers.releaseId(releaseEl)

      const currentData = releaseData.get(id)

      const count = currentData ? currentData.count + 1 : 1

      const collageNames = currentData ? [...currentData.collageNames] : []
      collageNames.push(collageName)

      releases.push({ id, releaseEl })
      releaseData.set(id, { count, collageNames })
    })  
  })

  releases.forEach(({ id, releaseEl }) => {
    const { count, collageNames } = releaseData.get(id)
    if (count > 1) {
      const template = doc.createElement('template')
      template.content.appendChild(renderers.releaseCounter(count, collageNames))
      releaseEl.parentNode.insertAdjacentElement('afterend', template.content.firstChild)  
    }
  })
}

init()