// ==UserScript==
// @name        5ch.net Direct Links
// @name:ja     5ch.net Direct Links
// @namespace   Violentmonkey Scripts
// @include     */r/*/*/*
// @include     */test/read.cgi/*/*
// @include     */read.php/*/*
// @include     */log/*/*/*/
// @include     *.5ch.net/*/*
// @include     *.2ch.sc/test/read.cgi/*/*
// @grant       none
// @version     1.3
// @author      -
// @description Replace jump.5ch.net links with direct links
// @description:ja "jump.5ch.net"に行くリンクを探して普通のリンクに変える。
// @license     MIT
// @icon        https://5ch.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/465006/5chnet%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/465006/5chnet%20Direct%20Links.meta.js
// ==/UserScript==
document.querySelectorAll('article .post-content a:not(.reply_link), div.message a').forEach((a) => {
  let newUrl = a.href.replace(/^http.*jump.5ch.net\/\?/, '')
  newUrl = newUrl.replace(/^http.*www.pinktower.com\/\?/, '')
  //console.log(a.href, newUrl)
  a.href = newUrl
})

// 2024-08-29:  Remove the new style click handler from:  assets/js/iphone/application.production.js .
// I'm sorry I didn't update this sooner.
if (unsafeWindow.$ && unsafeWindow.$("#main") && unsafeWindow.$("#main").off) {
  console.log("removing click handler")
  unsafeWindow.$("#main").off('click', '.threadview_response_body_embedlink, .threadview_response_body_link')
}