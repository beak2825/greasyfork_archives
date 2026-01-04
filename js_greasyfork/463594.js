// ==UserScript==
// @name        belet film
// @locale      js
// @description free belet film
// @match         *://film.belet.me/*
// @grant       none
// @version     1.0
// @author      -
// @icon         https://www.google.com/s2/favicons?sz=64&domain=film.belet.me
// @run-at      document-start
// @license MIT
// @namespace https://greasyfork.org/users/1056796
// @downloadURL https://update.greasyfork.org/scripts/463594/belet%20film.user.js
// @updateURL https://update.greasyfork.org/scripts/463594/belet%20film.meta.js
// ==/UserScript==

class myXMLHttpRequest extends XMLHttpRequest {
  constructor() {
    super()
    this.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.responseURL === 'https://film.beletapis.com/api/v1/checkIp') {
          const response = JSON.parse(this.responseText)
          if('allowed' in response) {
            response.allowed = true
          }
          Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) })
        }
      }
    }
  }
}

XMLHttpRequest = myXMLHttpRequest