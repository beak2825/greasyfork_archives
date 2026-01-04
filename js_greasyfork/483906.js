// ==UserScript==
// @name        Twitter Replies Premium Remover
// @namespace   jvbf Userscripts
// @match       *://*twitter.com/*
// @match       *://*x.com/*
// @grant       none
// @version     1.1
// @author      joaovitorbf
// @description Remove Twitter Premium users from the replies of a tweet.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483906/Twitter%20Replies%20Premium%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/483906/Twitter%20Replies%20Premium%20Remover.meta.js
// ==/UserScript==

polling = setInterval(() => {
  articles = Array.from(document.querySelectorAll("article")).filter((article) => {
      return article.querySelector('svg').ariaLabel == "Verified account"
  })
  if (articles.length > 0) {
    document.querySelector('a[href="/compose/post"]').insertAdjacentHTML("afterend", "<input type='checkbox' id='removepremium' name='rmvprm'><center><label for='rmvprm'>Remove premium users</label></center>")
    checkbox = document.querySelector('#removepremium')
    clearInterval(polling)
  }
}, 300)



setInterval(()=> {
  if (checkbox.checked) {
    Array.from(document.querySelectorAll("article")).filter((article) => {
      if (article.getAttribute('class').length > 70) {
          return article.querySelector('svg').ariaLabel == "Verified account"
      }
    }).forEach((el) => {
        el.parentElement.parentElement.parentElement.style.display = 'none'
    })
  }
}, 50)