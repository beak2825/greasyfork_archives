// ==UserScript==
// @name        scrapbox.io google translate EN
// @description this script make pages of scrapbox.io to be translated with google translate
// @include     https://scrapbox.io/*
// @version 0.0.1.20230718230408
// @namespace https://greasyfork.org/users/1130197
// @downloadURL https://update.greasyfork.org/scripts/471154/scrapboxio%20google%20translate%20EN.user.js
// @updateURL https://update.greasyfork.org/scripts/471154/scrapboxio%20google%20translate%20EN.meta.js
// ==/UserScript==   

scrapbox.PopupMenu.addButton({
   title: '日本語⇒英語',
   onClick: text => window.open(`https://translate.google.com/#ja/en/${text}`)
 })
 scrapbox.PopupMenu.addButton({
   title: '英語⇒日本語',
   onClick: text => window.open(`https://translate.google.com/#en/ja/${text}`)
 })