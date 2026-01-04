// ==UserScript==
// @name         console.save
// @namespace    http://bgrins.github.io/
// @version      0.2.0
// @description  A simple way to save objects as .json files or to save blobs as files from the console.
// @author       Devtools Snippets
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371810/consolesave.user.js
// @updateURL https://update.greasyfork.org/scripts/371810/consolesave.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.console.save = function (data, filename) {

    if (!data) {
      console.error('Console.save: No data')
      return;
    }

    if (!filename) {
      console.error('Console.save: No filename')
      return
    }

    var blob
    if (Object.prototype.toString.call(data) === '[object Blob]') {
      blob = data
    } else {
      if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4)
      }
      blob = new Blob([data], { type: 'text/json' })
    }

    var e = document.createEvent('MouseEvents')
    var a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
  }
})();