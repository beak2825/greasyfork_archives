// ==UserScript==
// @name         Read Golang Doc Better
// @name:zh      更美的 Golang 文档
// @namespace    https://littleboyharry.me
// @version      1.0.1
// @description  go to read with better override style!
// @author       LittleboyHarry

// @match        https://golang.org/*
// @match        https://blog.golang.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424910/Read%20Golang%20Doc%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/424910/Read%20Golang%20Doc%20Better.meta.js
// ==/UserScript==

GM_addStyle(`

html {
  font-size: 1em;
}

body {
  background: #FDF6E3;
}

main {
  align-text: center;
}

main#page.Site-content>.container {
  display: inline-block;
  max-width: 800px;
  width: 90%;
}

.container p{
  line-height: 1.5;
}

`);