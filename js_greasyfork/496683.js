// ==UserScript==
// @name         BDSMLR - force endless scrolling
// @namespace    bdsmlr_endless_scrolling
// @version      1.0.0
// @license      BSD
// @description  Convert Next >> navigation into Endless scrolling
// @match        https://bdsmlr.com/
// @match        https://bdsmlr.com/dashboard*
// @match        https://*.bdsmlr.com/
// @match        https://*.bdsmlr.com/post/*
// @match        https://bdsmlr.com/search/*
// @match        https://*.bdsmlr.com/search/*
// @match        https://bdsmlr.com/blog/*
// @match        https://bdsmlr.com/originalblogposts/*
// @match        https://bdsmlr.com/likes*
// @grant        GM_xmlhttpRequest
// @connect      bdsmlr.com
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/496683/BDSMLR%20-%20force%20endless%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/496683/BDSMLR%20-%20force%20endless%20scrolling.meta.js
// ==/UserScript==

let processing = false

$(window).scroll(function () {
  if ($(window).scrollTop() >= ($(document).height() - (5 * $(window).height())) - 700) {
    if (processing) {
      return false;
    }

    processing = true;

    const rightLiA = document.querySelector('.rightli a')

    if (rightLiA) {
      const url = rightLiA.href

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
          "referer": "bdsmlr.com"
        },
        onload: function(response) {
          if ((response.readyState >= 2) && (response.status == 200)) {
            let newImgs = response.responseText.split('<div class="feed clearfix ">').shift().split('feed clearfix del')
            newImgs.shift()
            newImgs = '<div class="feed clearfix del' + newImgs.join('feed clearfix del')

            const lastElement = [...document.querySelectorAll('.feed.clearfix')].pop()
            lastElement.insertAdjacentHTML('beforebegin', newImgs)

            let hasNextPage = response.responseText.includes('" rel="next">')
            if (hasNextPage) {
              rightLiA.href = response.responseText.split('" rel="next">').shift().split('href="').pop().replace(/&amp;/gi, '&')
            } else {
              rightLiA.remove()
            }

            setTimeout(function () { processing = false }, 1000)
          } else {
            processing = false
          }
        },
        ontimeout: function(response) {
          processing = false
        },
        onerror: function(response) {
          processing = false
        }
      })
    }
  }
})