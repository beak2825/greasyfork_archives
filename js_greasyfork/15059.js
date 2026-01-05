// ==UserScript==
// @name        wikiwiki Skip Cushion
// @namespace   mikan-megane.wikiwiki.com
// @description wikiwikiのクッションページを飛ばします
// @include     *://re.wikiwiki.jp/?*
// @version     1.2
// @grant       none
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/15059/wikiwiki%20Skip%20Cushion.user.js
// @updateURL https://update.greasyfork.org/scripts/15059/wikiwiki%20Skip%20Cushion.meta.js
// ==/UserScript==

location.replace(document.URL.replace(/https?:\/\/re\.wikiwiki\.jp\/\?/, ""));