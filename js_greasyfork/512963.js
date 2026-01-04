// ==UserScript==
// @name        shipd.ai auto checklist
// @namespace   com.shipdai.autochecklist
// @description Automatically checks all checkboxes on the shipd.ai create page
// @match       https://shipd.ai/*
// @grant       none
// @version     1.1
// @license     MIT
// @locale      en
// @run-at      document-end
// @author      Ahmed Muhammed Abdelaty
// @downloadURL https://update.greasyfork.org/scripts/512963/shipdai%20auto%20checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/512963/shipdai%20auto%20checklist.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // Create a button element to trigger the 'Check All' functionality
  const button = document.createElement('button')
  button.innerText = 'Check All'
  button.style.position = 'fixed'
  button.style.top = '10px'
  button.style.right = '10px'
  button.style.zIndex = '1000'
  button.style.padding = '10px'
  button.style.backgroundColor = '#4CAF50'
  button.style.color = 'white'
  button.style.border = 'none'
  button.style.borderRadius = '5px'
  button.style.cursor = 'pointer'

  function appendButton() {
    if (!document.body.contains(button)) {
      document.body.appendChild(button)
    }
  }

  function isOnCreatePage() {
    return window.location.href.startsWith('https://shipd.ai/create/')
  }
  if (isOnCreatePage()) {
    appendButton()
  }
  function checkAllCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        checkbox.click()
      }
    })
  }

  // Add event listener to the button
  button.addEventListener('click', checkAllCheckboxes)

  // Debounce function to limit the rate of function calls
  function debounce(func, wait) {
    let timeout
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  // Monitor changes in the DOM and re-append the button if necessary
  const observer = new MutationObserver(
    debounce(() => {
      if (isOnCreatePage()) {
        appendButton()
      }
    }, 100)
  )
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})()
