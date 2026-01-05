// ==UserScript==
// @name        Copy-Clip
// @name:es     Copy-Clip
// @namespace   copy-clip
// @author      Alejandro Alvarez
// @description     A ridiculously simple way to copy links to the clipboard
// @description:es  Una forma ridiculamente simple de copiar links al portapapeles
// @homepage    https://gitlab.com/eliluminado/copy_clip
// @icon        icons/clipboard_icon_x32px.png
// @icon64      icons/clipboard_icon_x64px.png
// @supportURL  https://gitlab.com/eliluminado/copy_clip/issues
// @license     MIT
// @include     *
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     1.0
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/25406/Copy-Clip.user.js
// @updateURL https://update.greasyfork.org/scripts/25406/Copy-Clip.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true) // eslint-disable-line no-undef

// Thanks to Rob W for http://stackoverflow.com/a/25275151
function executeCopy (text) {
  let input = document.createElement('textarea')
  document.body.appendChild(input)
  input.value = text
  input.select()
  document.execCommand('copy')
  input.remove()
}

this.jQuery('a').on('click', function (event) {
  if (event.altKey) {
    console.info('Link copied to clipboard')
    executeCopy(this.href)
    this.prevenDefault()
  }
})
