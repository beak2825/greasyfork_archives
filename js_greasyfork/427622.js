// ==UserScript==
// @name         Neopets: skip NF-only auctions
// @author       Tombaugh Regio
// @version      1.2
// @description  Ignores Neofriend-only auctions by default
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/auctions.phtml*
// @include      *://www.neopets.com/genie.phtml
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427622/Neopets%3A%20skip%20NF-only%20auctions.user.js
// @updateURL https://update.greasyfork.org/scripts/427622/Neopets%3A%20skip%20NF-only%20auctions.meta.js
// ==/UserScript==

if (/genie/.test(window.location.href)) document.querySelector('input[name="exclude_nf_only"]').checked = true
else {
  const NFonly = [...document.querySelectorAll('.content center tr > td:nth-of-type(4)')].slice(1).filter(a => /\[NF\]/.test(a.textContent))
  const NFelement = document.querySelector('.content > center > p:first-of-type')
  const buttonParagraph =  document.createElement('p')
  const button = document.createElement('button')
  
  NFonly.forEach(entry => entry.parentNode.style.display = 'none')
  button.textContent = 'Include [NF]-only auctions'
  
  button.onclick = (e) => {
    e.preventDefault()
    const isFiltered = /Include/.test(button.textContent)
    
    NFonly.forEach(entry => entry.parentNode.style.display = isFiltered ? 'table-row' : 'none')
    button.textContent = isFiltered ? 'Exclude [NF]-only auctions' : 'Include [NF]-only auctions'
  }
  
  buttonParagraph.appendChild(button)
  NFelement.replaceWith(buttonParagraph)  
}