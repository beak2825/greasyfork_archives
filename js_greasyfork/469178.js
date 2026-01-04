// ==UserScript==
// @name         ProxyPhpRemover
// @version      0.1
// @description  Удаляет из ссылок proxy.php
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace https://greasyfork.org/users/997663
// @downloadURL https://update.greasyfork.org/scripts/469178/ProxyPhpRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/469178/ProxyPhpRemover.meta.js
// ==/UserScript==

function replaceLinks() {
  Array.from(document.querySelectorAll('a'))
    .filter(a => a.href.includes('https://zelenka.guru/proxy.php?link='))
    .forEach(a => a.href = new URL(a.href).searchParams.get('link'));
}

setInterval(replaceLinks, 0);
