// ==UserScript==
// @name         Прямые ссылки на www.taker.im LITE
// @namespace    FIX
// @version      0.1
// @description  Внешние ссылки без редиректа на www.taker.im LITE
// @author       raletag
// @match        http://www.taker.im/*
// @grant        none
// @compatible   Opera 15+
// @compatible   Chrome
// @downloadURL https://update.greasyfork.org/scripts/22412/%D0%9F%D1%80%D1%8F%D0%BC%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20wwwtakerim%20LITE.user.js
// @updateURL https://update.greasyfork.org/scripts/22412/%D0%9F%D1%80%D1%8F%D0%BC%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20wwwtakerim%20LITE.meta.js
// ==/UserScript==

(function() {
    'use strict';
            document.addEventListener('click',function(e){
                var t = e.target;
                if (t && t.href && (/\/phpBB2\/goto\//.test(t.href))) {
                    t.href = t.href.replace('http://www.taker.im/phpBB2/goto/','');
                }
            });
})();