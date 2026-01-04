// ==UserScript==
// @name         Ukryta ikonka o wiadomości w konsoli
// @author       Reskiezis
// @description  Dodatek do gry Margonem
// @version      1.1
// @match        http://*.margonem.pl/
// @match        http://*.margonem.com/
// @grant        none
// @namespace    https://greasyfork.org/users/233329
// @downloadURL https://update.greasyfork.org/scripts/375848/Ukryta%20ikonka%20o%20wiadomo%C5%9Bci%20w%20konsoli.user.js
// @updateURL https://update.greasyfork.org/scripts/375848/Ukryta%20ikonka%20o%20wiadomo%C5%9Bci%20w%20konsoli.meta.js
// ==/UserScript==

;(style =>
  document.head.appendChild(
    Object.assign(document.createElement('style'), {
      textContent: style
    })
  )
)(`
  #consoleNotif {
    display: none;
  }
`);