// ==UserScript==
// @name        Convert to old reddit links
// @namespace   Violentmonkey Scripts
// @match       https://gwasi.com/
// @grant       none
// @version     1.1
// @author      -
// @description 15/3/2021, 12:47:07 pm
// @downloadURL https://update.greasyfork.org/scripts/423238/Convert%20to%20old%20reddit%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/423238/Convert%20to%20old%20reddit%20links.meta.js
// ==/UserScript==


console.log('Starting the script')



function changeLink(links){
  links.forEach(node => {
  const linkText = node.getAttribute('href')
  const oldLinkText = linkText.replace('//www.', '//old.')
  node.setAttribute('href', oldLinkText)
  node.setAttribute('target', '_blank')
})
}

function changeLinks() {
const cid = setInterval(() => {
  const links = document.querySelectorAll('a')
  if (links.length) {
    changeLink(links)
    clearInterval(cid)
  }
}, 500)
}

// Debounce
let id = null;

const debounce = (fn, delay) => (...args) => {
  if (id) {
    clearInterval(id)
  }
  id = setTimeout(() => fn.apply(args), delay)
}

const inputs = document.querySelectorAll('input')

const debounced = debounce(changeLinks, 500)

inputs.forEach(input => {
  input.addEventListener('change', debounced)
  input.addEventListener('keypress', debounced)
})
changeLinks()
console.log('Done with running the script')