// ==UserScript==
// @name        Depaginator for Wykop.pl
// @namespace   Violentmonkey Scripts
// @match       https://*.wykop.pl/*
// @grant       none
// @require     https://unpkg.com/xhook@latest/dist/xhook.min.js
// @version     1.4
// @author      LuK1337
// @description Removes pagination from posts
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458629/Depaginator%20for%20Wykoppl.user.js
// @updateURL https://update.greasyfork.org/scripts/458629/Depaginator%20for%20Wykoppl.meta.js
// ==/UserScript==

(function() {
  'use strict';

  xhook.after((request, response) => {
    if (response.status !== 200) {
      // Don't care about anything non-200.
      return
    }

    let url = null

    try {
      url = new URL(request.url)
    } catch {
      // Bad URL ;(
      return
    }

    if (url.host !== "wykop.pl") {
      return
    }

    let searchParams = new URLSearchParams(url.searchParams)

    if (searchParams.get('page') !== '1') {
      return
    }

    const regexes = [
      /\/api\/v3\/entries\/\d+\/comments/,
      /\/api\/v3\/links\/\d+\/comments/,
    ]

    if (regexes.some(x => x.test(url.pathname))) {
      let json = JSON.parse(response.text)

      // Append data from remaining pages
      for (let page = 2; page <= Math.ceil(json['pagination']['total'] / json['pagination']['per_page']); ++page) {
        // Update page
        searchParams.set('page', page.toString())

        // Open XHR request
        let req = new XMLHttpRequest();
        req.open('GET', `${url.pathname}?${searchParams.toString()}`, false)

        // Copy original headers
        for (let key of Object.keys(request.headers)) {
          req.setRequestHeader(key, request.headers[key])
        }

        req.send(null)

        if (req.status !== 200) {
          // Request failed, sad!
          break
        }

        let data = JSON.parse(req.responseText)['data']
        if (data.length === 0) {
          // No more data ^.^
          break
        }

        json['data'] = json['data'].concat(data)
      }


      // Hide pagination
      json['pagination']['total'] = 0

      // Override response text
      response.text = JSON.stringify(json)
    }
  });
})();