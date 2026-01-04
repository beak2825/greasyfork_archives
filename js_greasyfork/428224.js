// ==UserScript==
// @name         автоматично попълване на сумата за раздаване
// @description  да
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       аз
// @match        https://www.erepublik.com/*/economy/donate-money/*?cc=*
// @icon         https://www.google.com/s2/favicons?domain=erepublik.com
// @downloadURL https://update.greasyfork.org/scripts/428224/%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%BD%D0%BE%20%D0%BF%D0%BE%D0%BF%D1%8A%D0%BB%D0%B2%D0%B0%D0%BD%D0%B5%20%D0%BD%D0%B0%20%D1%81%D1%83%D0%BC%D0%B0%D1%82%D0%B0%20%D0%B7%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B0%D0%B2%D0%B0%D0%BD%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/428224/%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%BD%D0%BE%20%D0%BF%D0%BE%D0%BF%D1%8A%D0%BB%D0%B2%D0%B0%D0%BD%D0%B5%20%D0%BD%D0%B0%20%D1%81%D1%83%D0%BC%D0%B0%D1%82%D0%B0%20%D0%B7%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B0%D0%B2%D0%B0%D0%BD%D0%B5.meta.js
// ==/UserScript==

document.getElementById("donate_money_0").value = window.location.href.split("cc=")[1];