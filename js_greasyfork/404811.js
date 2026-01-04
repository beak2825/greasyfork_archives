// ==UserScript==
// @name           Syon Hello World
// @description    Syon's First Script!
// @namespace      syon.github
// @include        /^https?://www\.example\.com/.*$/
// @require        https://cdn.jsdelivr.net/npm/vue@2.6.11
// @require        https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js
// @version        0.0.9
// @downloadURL https://update.greasyfork.org/scripts/404811/Syon%20Hello%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/404811/Syon%20Hello%20World.meta.js
// ==/UserScript==

console.log('//////////////////////////////////////////')
console.log('//////////////////////////////////////////')
console.log({ Vue })
console.log({ axios })
axios.get('https://hatena.now.sh/api/bookmark/getEntryLite?url=https://example.com').then(r => console.log(r.data))
console.log('//////////////////////////////////////////')
console.log('//////////////////////////////////////////')
