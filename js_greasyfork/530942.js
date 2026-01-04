// ==UserScript==
// @name         Wikipedia Smooth Scroll
// @description  Adds smooth scrolling for in-page links on Wikipedia and sister sites
// @version      0.2
// @author       Daniel Bronshtein
// @license      MIT
// @homepage     https://github.com/DaniBr/wikipedia-smooth-scroll
// @grant        none
// @run-at       document-idle
// @match https://*.wikipedia.org/wiki/*
// @match https://*.wiktionary.org/wiki/*
// @match https://*.wikibooks.org/wiki/*
// @match https://*.wikiquote.org/wiki/*
// @match https://*.wikivoyage.org/wiki/*
// @match https://*.wikisource.org/wiki/*
// @match https://*.wikinews.org/wiki/*
// @match https://*.wikiversity.org/wiki/*
// @match https://*.wikifunctions.org/wiki/*
// @namespace https://greasyfork.org/users/1450663
// @downloadURL https://update.greasyfork.org/scripts/530942/Wikipedia%20Smooth%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/530942/Wikipedia%20Smooth%20Scroll.meta.js
// ==/UserScript==
(function(){
  function scrollSmoothlyTo(element) {
    element.scrollIntoView({
      behavior: 'smooth'
    })
  }
  
  function getIdFromInternalLink(link) {
    try {
      return decodeURIComponent(link.getAttribute('href').substring(1))
    } catch (e) {
      return link.getAttribute('href').substring(1)
    }
  }
  
  function handleInternalLinkClick(event) {
    const link = event.currentTarget
    const id = getIdFromInternalLink(link)
    const element = document.getElementById(id)
    
    if (!element) return
    scrollSmoothlyTo(element)
    history.pushState({ scrollTo: id }, '', link.href)
    event.preventDefault()
  }
  
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener('click', handleInternalLinkClick)
  })
  
  //ToDo: add smooth scrolling on popstate (when navigating back and forward)
})()
