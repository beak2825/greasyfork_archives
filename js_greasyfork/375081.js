// ==UserScript==
// @name Latest Documentation Link
// @namespace https://franklinyu.github.io
// @version 0.1.0
// @description Link to latest documentation
// @include https://ruby-doc.org/core-*
// @include https://ruby-doc.org/stdlib-*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/375081/Latest%20Documentation%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/375081/Latest%20Documentation%20Link.meta.js
// ==/UserScript==

const versionHeader = document.querySelector('#versionheader p')
if (versionHeader) {
  const link = document.createElement('a')
  link.href = location.pathname.replace(/^\/(core|stdlib)-[.\d]+/, '/$1')
  link.innerText = 'here'
  versionHeader.innerHTML += ` Latest documentation is available ${link.outerHTML}.`
}
