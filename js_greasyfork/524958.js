// ==UserScript==
// @name         scratch extesion: js by rssaromeo
// @version      2
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @tag          lib
// @license      GPLv3
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAA7e0Yh4cO////Umaq8AAAAAR0Uk5TAP///7MtQIgAAAFnSURBVHicdZPBbcMwDEXNQzaop8mh9gYuIE3XEWQg2sDuoSN0CnUDHdL/ScmQ7NQIjPCZn6REUgY+44TXc+Vf4eu2KM6xAnUoLgTiBnvSbgAKcfxMDYFXH5KgAJYGgQA/oaJkCdQIc5QsaYcMwNcsMAOAuKKgJu2CEEXBtDkKQvhiQ/NcAeZaKDQER0zNE6SJySAJ4IhpoEnCqFmaJBpV2iQn4KFIm/iSJn05gl18OX36XhgzvgDjZOBnsrM0ILAQAlzaPeLUZ/C+GmChBxhCAyY2rgNsSw/0gv4HvMkcG4DTngBECmphvJH8WDsw3hXMLvjceszu903BbVFw+9B8WkcO8QUQ34DPHW0gwLG09LCxL17ncZysL5dWXpp9Auk6MJeR6sG2dmNpU9hE1WYDNBvF0YZZNUGHH+axlbYe41Q0abcFwnd1gXXsnEYJuocy2B57fm32tmYpq+7r0YZ+96kwYC7WrD9tYfAnsMjAnwAAAABJRU5ErkJggg==
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524958/scratch%20extesion%3A%20js%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524958/scratch%20extesion%3A%20js%20by%20rssaromeo.meta.js
// ==/UserScript==

;(async () => {
  await loadlib("libloader").waitforlib("scratchextesnsionmanager")
  const {
    newext,
    newmenu,
    newblock,
    bt,
    inp,
    gettarget,
    totype,
    scratch_math,
    projectid,
    canvas,
    scratchvar,
    scratchlist,
  } = loadlib("scratchextesnsionmanager")
  var vm
  loadlib("libloader")
    .waitforlib("scratch")
    .then(() => (vm = loadlib("scratch").vm))

  newext(
    "js",
    "rssaromeo",
    class {
      alert({ a }) {
        alert(a)
      }
      prompt({ a, s }) {
        return prompt(a, s)
      }
      confirm({ question }) {
        return confirm(question)
      }
    },
    [
      newblock(bt.cmd, "alert", "alert [a]"),
      newblock(bt.ret, "prompt", "prompt [a], default: [s]"),
      newblock(bt.bool, "confirm", "confirm [question]"),
    ],
    "B3B312",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAA7e0Yh4cO////Umaq8AAAAAR0Uk5TAP///7MtQIgAAAFnSURBVHicdZPBbcMwDEXNQzaop8mh9gYuIE3XEWQg2sDuoSN0CnUDHdL/ScmQ7NQIjPCZn6REUgY+44TXc+Vf4eu2KM6xAnUoLgTiBnvSbgAKcfxMDYFXH5KgAJYGgQA/oaJkCdQIc5QsaYcMwNcsMAOAuKKgJu2CEEXBtDkKQvhiQ/NcAeZaKDQER0zNE6SJySAJ4IhpoEnCqFmaJBpV2iQn4KFIm/iSJn05gl18OX36XhgzvgDjZOBnsrM0ILAQAlzaPeLUZ/C+GmChBxhCAyY2rgNsSw/0gv4HvMkcG4DTngBECmphvJH8WDsw3hXMLvjceszu903BbVFw+9B8WkcO8QUQ34DPHW0gwLG09LCxL17ncZysL5dWXpp9Auk6MJeR6sG2dmNpU9hE1WYDNBvF0YZZNUGHH+axlbYe41Q0abcFwnd1gXXsnEYJuocy2B57fm32tmYpq+7r0YZ+96kwYC7WrD9tYfAnsMjAnwAAAABJRU5ErkJggg=="
  )
})()
