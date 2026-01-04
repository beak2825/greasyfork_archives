// ==UserScript==
// @name         google_translate_fillter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description 谷歌翻译过滤代码块
// @author       twosee
// @include      /^.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36192/google_translate_fillter.user.js
// @updateURL https://update.greasyfork.org/scripts/36192/google_translate_fillter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var c=top.document.querySelectorAll('pre'); //#readme
    for(var i=0;i<c.length;i++){
        c[i].setAttribute('class','notranslate');
    }
})();