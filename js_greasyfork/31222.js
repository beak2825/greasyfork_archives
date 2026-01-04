// ==UserScript==
// @name         Torn - Hide Crimes
// @namespace    somenamespace
// @version      0.4
// @description  desc
// @author       tos
// @match        *.torn.com/crimes.php
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/31222/Torn%20-%20Hide%20Crimes.user.js
// @updateURL https://update.greasyfork.org/scripts/31222/Torn%20-%20Hide%20Crimes.meta.js
// ==/UserScript==

GM_addStyle(`
  .hide_this_crime {
    color: #858585;
    cursor: pointer;
    padding: 5px;
  }
  
  .unhide_all_crimes {
    color: #069;
    cursor: pointer;
    float: right;
    padding: 5px;
    margin: 10px;
  }
`)
let hidden_crimes = JSON.parse(localStorage.getItem('torn_hidden_crime')) || {}

const addCrimeFilters = () => {
  const unhide_all = document.createElement('SPAN')
  unhide_all.className = 'unhide_all_crimes'
  unhide_all.innerText = '[show all]'
  unhide_all.onclick = () => {
    const crime_list = document.querySelector('.specials-cont')
    for (const li of crime_list.children) {
      const crime = li.querySelector('.radio-css').id
      if (hidden_crimes[crime]) {
        li.style.display = 'list-item'
        hidden_crimes[crime] = false
        localStorage.setItem('torn_hidden_crime', JSON.stringify(hidden_crimes))
      }
    }
  }
  document.querySelector('form[name=crimes]').append(unhide_all)
  
  let crimes_ul = document.querySelector('.specials-cont')
  for (const li of crimes_ul.children) {
    const crime = li.querySelector('.radio-css').id
    if (hidden_crimes[crime]) li.style.display = 'none'
    const nerve_wrap = li.querySelector('.points')
    const li_hide = document.createElement('SPAN')
    li_hide.className = 'hide_this_crime'
    li_hide.innerText = '[hide]'
    
    li_hide.onclick = (e) => {
      e.stopImmediatePropagation()
      li.style.display = 'none'
      hidden_crimes[crime] = true
      localStorage.setItem('torn_hidden_crime', JSON.stringify(hidden_crimes))
    }
    
    nerve_wrap.append(li_hide)
  }
}
//addCrimeFilters()

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.className && node.className === 'specials-cont-wrap bottom-round cont-gray') addCrimeFilters()
    }
  }
});

observer.observe(document, { subtree: true, childList: true })