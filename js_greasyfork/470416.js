// ==UserScript==
// @name         lvguan
// @version      1.4
// @description  旅馆自动输入
// @author       examplecode
// @match        https://119.84.149.51:17300/portal
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @license       xxx
// @namespace    https://greasyfork.org/users/889747
// @downloadURL https://update.greasyfork.org/scripts/470416/lvguan.user.js
// @updateURL https://update.greasyfork.org/scripts/470416/lvguan.meta.js
// ==/UserScript==
function keyboardInput(dom, value) {
  let evt = document.createEvent('HTMLEvents')
  evt.initEvent('input', true, true)
  dom.value = value
  dom.dispatchEvent(evt)
}
function set() {
    if ($(".loginBlock input[type=text]").length > 0) {

keyboardInput($(".loginBlock input[type=text]")[0], '5002350154220001')
  keyboardInput($("input[type=password]")[0], 'aisino@111')

        } else {
             setTimeout(function() {
                 set()
                   }, 1000)
        }
}
(function() {
    set()
})();