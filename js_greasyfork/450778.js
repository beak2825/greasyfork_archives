// ==UserScript==
// @name        RoyStream Helper
// @version     5
// @match       *://*.roystream.com/*
// @description The RoyStream Helper
// @icon        https://www.google.com/s2/favicons?sz=64&domain=roystream.com
// @supportURL  https://github.com/jerryc05/MyUserscripts
// @author      jerryc05
// @namespace   https://github.com/jerryc05
// @downloadURL https://update.greasyfork.org/scripts/450778/RoyStream%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450778/RoyStream%20Helper.meta.js
// ==/UserScript==


new MutationObserver((_, o) => {
  const l = document.querySelectorAll('[class^="list-unstyled ps-3 list-children collapse"]')
  for (const x of l)
    $(x).collapse("show")
  if (l) o.disconnect()
}).observe(document.getElementById('app-sidebar'), { childList: true, subtree: true })

const s = document.createElement('style')
s.textContent=`
#app-content>div>div>div:first-child{width:100%}
.row>[class*="d-flex"]:first-child{overflow:hidden}
#app-content>div>div>div.col-md-4{display:none}
`
document.head.append(s);
