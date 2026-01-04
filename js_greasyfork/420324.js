// ==UserScript==
// @name         Furigana Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Deshabilita Furigana en la mayoría de páginas web
// @author       Natsume/Quazail
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/420324/Furigana%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/420324/Furigana%20Remover.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function () {
    javascript:void(function(){var rubies = document.getElementsByTagName("rt"); for(var i=0; i<rubies.length; i++) rubies[i].innerHTML = '';}())
    })
})();