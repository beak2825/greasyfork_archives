// ==UserScript==
// @name        Publish button in repo on GitHub
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*/*
// @grant       none
// @version     1.4
// @author      -
// @description 5/28/2020, 5:17:05 PM
// @downloadURL https://update.greasyfork.org/scripts/404486/Publish%20button%20in%20repo%20on%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/404486/Publish%20button%20in%20repo%20on%20GitHub.meta.js
// ==/UserScript==

const username = $("a.url.fn").innerText

// DOM-lib
Element.prototype.makeElement = function (tag, options={}) {
  return makeElement(tag, options, this)
}

Element.prototype.find = Element.prototype.querySelector

function makeElement(tag, options={}, parent) {
  const el = document.createElement(tag)
  Object.assign(el, options)
  if (parent) parent.append(el)
  return el
}

function $(selector, text) {
  if (text) return [...$$(selector)].find(el => el.innerText == text)
  return document.querySelector(selector)
}

function $$(selector) {
  return [...document.body.querySelectorAll(selector)].filter(el => el.tagName != "SCRIPT")
}

// Script
if (username == location.href.match(/github.com\/([^\/]*)/)[1]) {
  if (!location.href.endsWith('/settings') && !localStorage.publish) {
    $('.pagehead-actions').makeElement('li').makeElement('button', {className: 'btn btn-sm', innerText: 'Publish'}).onclick = () => {
      console.log('start publish')
      localStorage.publish = 1
      location.href += '/settings/pages'
    }
  } else if (location.href.endsWith('/settings/pages') && localStorage.publish == 1) {
    localStorage.publish = 2
    setTimeout(() => $('[value=master]').click(), 300)
    setTimeout(() => [...document.forms].find(form => form.action.endsWith("/pages/source")).submit(), 1000)
  } else if (location.href.endsWith('/settings/pages') && localStorage.publish == 2) {  
    localStorage.publish = 3
    location.href = location.href.replace('/settings/pages', '')
  } else if (!location.href.endsWith('/settings/pages') && localStorage.publish == 3) {
    delete localStorage.publish
    repo_homepage.value = 'https://' + username + '.github.io/' + location.href.replace('https://github.com/' + username + '/', '') + '/'
    repo_metadata_form.submit()
  } 
}