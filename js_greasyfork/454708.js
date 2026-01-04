// ==UserScript==
// @name        Fsharp library docs - easy skim TOC
// @namespace   Violentmonkey Scripts
// @match       https://fsharp.github.io/fsharp-core-docs/reference/*
// @match       https://fsprojects.github.io/FSharpPlus/*
// @match       http://fsprojects.github.io/FSharpPlus/reference/*
// @match       https://fsprojects.github.io/FSharpx.Collections/reference/*
// @match       https://fsprojects.github.io/FSharp.Control.AsyncSeq/reference/*
// @grant       GM_addStyle
// @version     1.2
// @author      -
// @description 13/04/2022, 2:14:00 pm
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454708/Fsharp%20library%20docs%20-%20easy%20skim%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/454708/Fsharp%20library%20docs%20-%20easy%20skim%20TOC.meta.js
// ==/UserScript==

GM_addStyle(`.hide {display:none;}`)

const button = document.createElement('button')
button.setAttribute('style', `display: block;margin-bottom: 0.8rem; margin-top: 0.8rem;`)
button.textContent = 'Show Summaries'

button.onclick = () => {
  Array.from(document.querySelectorAll('.toc-summary')).forEach(elem => {
    elem.classList.toggle('hide')
  })
}

const apiAnchorLinks = Array.from(document.querySelectorAll('.fsdocs-member-usage code a[href^="#"]'))

const topNavAnchorLinksContainer = document.createElement('div')
topNavAnchorLinksContainer.setAttribute('class', 'anchor-nav-container')
topNavAnchorLinksContainer.setAttribute('style', 'display:inline-flex;flex-direction:column;')

document.querySelector('.fsdocs-xmldoc').insertAdjacentElement('afterend', topNavAnchorLinksContainer)
document.querySelector('#content>div').insertBefore(button, document.querySelector('.anchor-nav-container'))

apiAnchorLinks.forEach(elem => {

  const clonedElem = elem.cloneNode(true)
  clonedElem.querySelector('code span>span')?.remove()

  const divContainer = document.createElement('div')
  divContainer.setAttribute('style', `display: flex;flex-direction: column;`)


  const summary = elem.closest('.fsdocs-member-usage').nextElementSibling.querySelector('p.fsdocs-summary').textContent

  const span = document.createElement('span')
  span.setAttribute('style', `font-size: 1rem;margin-bottom: 0.8rem;`)
  span.setAttribute('class', `hide toc-summary`)
  span.textContent = summary

  divContainer.appendChild(clonedElem)
  divContainer.appendChild(span)

  topNavAnchorLinksContainer.appendChild(divContainer)
})


document.querySelector("#navbarsExampleDefault>a").href = "https://fsharp.github.io/fsharp-core-docs/"




