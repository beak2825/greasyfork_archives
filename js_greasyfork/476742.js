// ==UserScript==
// @name         TWINS Timeout Dialog Blocker
// @name:en      TWINS Timeout Dialog Blocker
// @namespace    kichi2004.jp
// @version      1.0
// @description  TWINS でタイムアウトしたときのポップアップを非表示にします。
// @description:en Hide the popup windows for timeout on TWINS.
// @author       Takayuki Ueno
// @match        https://twins.tsukuba.ac.jp/campusweb/campusportal.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476742/TWINS%20Timeout%20Dialog%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/476742/TWINS%20Timeout%20Dialog%20Blocker.meta.js
// ==/UserScript==

console.log('Timeout Blocker Loaded!')
const windowOpen = window.open
const timeoutUrlList = [
    '/campusweb/theme/default/TimeoutAlert.html',
    '/campusweb/theme/default/Timeout.html'
]
window.open = (url, target, windowFeatures) => {
    if (timeoutUrlList.includes(url)) return
    windowOpen(url, target, windowFeatures)
}
