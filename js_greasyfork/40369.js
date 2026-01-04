// ==UserScript==
// @name Ylilauta reverse image search button
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.4
// @locale en
// @description Adds a button for reverse image search
// @downloadURL https://update.greasyfork.org/scripts/40369/Ylilauta%20reverse%20image%20search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/40369/Ylilauta%20reverse%20image%20search%20button.meta.js
// ==/UserScript==

const addSearchButtons = () => {
  const posts = Array.from(document.querySelectorAll('div.op_post, div.answer'))
    .map(div => {
      const post = Array.from(div.childNodes).find(n => n.className === 'post')
      const filecontainer = Array.from(post.childNodes).find(
        n => n.className && n.className.indexOf('filecontainer thumbnail file') !== -1
      )
      if (filecontainer === undefined) return
      const expandlink = Array.from(filecontainer.childNodes).find(n => n.className === 'expandlink')
      if (expandlink === undefined) return
      const href = expandlink.href
      if (href === undefined) return
      const postinfo = Array.from(div.childNodes).find(n => n.className === 'postinfo')
      const messageoptions = Array.from(postinfo.childNodes).find(n => n.className === 'messageoptions')
      const magnifier = Array.from(messageoptions.childNodes).find(n => n.className === 'icon-magnifier')
      if (magnifier === undefined) {
        const link = document.createElement('a')
        link.className = 'icon-magnifier'
        link.href = 'https://images.google.com/searchbyimage?image_url=' + href
        link.title = 'Käänteinen kuvahaku'
        link.target = '_blank'
        messageoptions.insertBefore(link, messageoptions.children[1])
      }
    })
}

addSearchButtons()

const targetDiv = document.querySelector('div.answers')
const config = { childList: true }

const observer = new MutationObserver(
  (mutationsList) => {
    if (Array.from(mutationsList).filter(
      (mutation) => mutation.type === 'childList').length > 0) {
      addSearchButtons()
    }
  }
)

observer.observe(targetDiv, config)
