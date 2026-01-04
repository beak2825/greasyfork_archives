// ==UserScript==
// @name         Enhanced 5ch reply link
// @namespace    https://greasyfork.org/users/57176
// @match        https://*.5ch.net/*/read.cgi/**
// @icon         https://egg.5ch.net/favicon.ico
// @grant        none
// @version      1.0.2
// @author       peng-devs
// @description  Click reply link will jump to the reply position instead of jumping to the new page
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459238/Enhanced%205ch%20reply%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/459238/Enhanced%205ch%20reply%20link.meta.js
// ==/UserScript==

(function() {
  'strict'

  const NAME = 'enchance-5ch-reply-link'

  function main() {
    console.log(`[${NAME}] initializing...`)

    let location = window.location.toString()
    const index = location.lastIndexOf('#')
    if (index > 0) {
      location = location.substring(0, index)
    }

    const replacer = improve_reply_link(location)
    document.querySelectorAll('.post .reply_link').forEach(replacer)

    const thread = document.querySelector('div.thread')
    if (thread) {
      new MutationObserver(list => {
        document.querySelectorAll('.post .back-links a').forEach(replacer)
      }).observe(thread, { subtree: true, childList: true })
    }

    console.log(`[${NAME}] loaded`)
  }

  function improve_reply_link(base_url) {
    return async (a) => {
      const id = a.innerText?.trim().replace('>>', '')
      if (!id) return

      a.href = `${base_url}#${id}`
      a.removeAttribute('rel')
      a.removeAttribute('target')
    }
  }

  main()

}())
