// ==UserScript==
// @name         Прямые ссылки на www.taker.im
// @namespace    FIX
// @version      0.1
// @description  Внешние ссылки без редиректа на www.taker.im
// @author       raletag
// @match        http://www.taker.im/*
// @grant        none
// @compatible   Opera 15+
// @compatible   Chrome
// @downloadURL https://update.greasyfork.org/scripts/22352/%D0%9F%D1%80%D1%8F%D0%BC%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20wwwtakerim.user.js
// @updateURL https://update.greasyfork.org/scripts/22352/%D0%9F%D1%80%D1%8F%D0%BC%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20wwwtakerim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) if (links[i].href) links[i].href = links[i].href.replace('http://www.taker.im/phpBB2/goto/','');

    document.addEventListener('DOMNodeInserted',function(e){
        if (!e || !e.target || !(e.target instanceof HTMLElement)) return;
        var links = e.target.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) if (links[i].href) links[i].href = links[i].href.replace('http://www.taker.im/phpBB2/goto/','');
        });

})();