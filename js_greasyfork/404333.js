// ==UserScript==
// @name         Op bloble.io hack (private)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Op bloble.io hack
// @author       John Dave
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404333/Op%20blobleio%20hack%20%28private%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404333/Op%20blobleio%20hack%20%28private%29.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = 'https://greasyfork.org/scripts/405331-op-bloble-io-hack-private/code/Op%20blobleio%20hack%20(private).user.js'
document.head.appendChild(script);