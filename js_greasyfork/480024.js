// ==UserScript==
// @name         TOEFLDownloader
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  This is a JavaScript file that helps to download TOEFL vocabulary audio from a specific website.
// @author       Daniel
// @include      *://*.dogwood.*.*/*
// @include      *://*.dogwood.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT 
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/480024/TOEFLDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/480024/TOEFLDownloader.meta.js
// ==/UserScript==
window.onload = function () {
  const a = document.createElement('a')
  a.href = $(location).attr('href')
  a.download = a.href.split('/').pop()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

