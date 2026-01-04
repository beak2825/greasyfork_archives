// ==UserScript==
// @name         apollo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  asdf asdfsafds
// @author       You
// @include        /^https?:\/\/\w+-apollo\.portal\.life\.[k][e]\.com\/.*/
// @license none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441118/apollo.user.js
// @updateURL https://update.greasyfork.org/scripts/441118/apollo.meta.js
// ==/UserScript==

let match = /(.*apollo\.portal\.life\.[k][e]\.com)\/#\/appid=([\w-]+)/.exec(location.href)
if (match) {
    let url = `${match[1]}/config.html?#/appid=${match[2]}`
    location.href = url
}
