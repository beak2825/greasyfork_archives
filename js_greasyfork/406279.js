// ==UserScript==
// @name         realworldhaskell-width
// @version      0.0
// @description  Resizes the Real World Haskell website to fit the browser window, no matter the window width.
// @match        http://book.realworldhaskell.org/read/*
// @namespace    https://greasyfork.org/en/users/217495-eric-toombs
// @downloadURL https://update.greasyfork.org/scripts/406279/realworldhaskell-width.user.js
// @updateURL https://update.greasyfork.org/scripts/406279/realworldhaskell-width.meta.js
// ==/UserScript==

rules = document.styleSheets[0].rules;
rules[1].style.removeProperty("width");
rules[55].style.removeProperty("width");