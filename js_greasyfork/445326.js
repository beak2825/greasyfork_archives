// ==UserScript==
// @name         Turkanime Yorumlari Ac
// @namespace    https://deadlybro-baglantilar.blogspot.com
// @description  TürkAnime sitesinde otomatik olarak Disqus yorumlarını açar.
// @copyright    2022, DeadLyBro (https://openuserjs.org/users/DeadLyBro)
// @author       DeadLyBro
// @version      4.4
// @match        https://www.turkanime.tv/*
// @icon         https://i.hizliresim.com/cbr4snl.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445326/Turkanime%20Yorumlari%20Ac.user.js
// @updateURL https://update.greasyfork.org/scripts/445326/Turkanime%20Yorumlari%20Ac.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author DeadLyBro
// ==/OpenUserJS==

setTimeout(function () {
  document.querySelector("#orta-icerik-alt > a[onclick=\"IndexSayfa('ajax/disqusyorum','orta-icerik-alt'); return false;\"]").click();
}, 1000); // 1 saniye sonra kod çalışacaktır. ( Code run after one second. )