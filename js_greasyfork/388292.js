// ==UserScript==
// @name       MathJax for Base
// @namespace  https://greasyfork.org/en/users/18614-kodegadulo
// @version    1.0.1
// @description  Enables use of MathJax (including LaTeX support) on Base Dozenal Forum.
// @include    http://dozenal.forumotion.com/*
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/388292/MathJax%20for%20Base.user.js
// @updateURL https://update.greasyfork.org/scripts/388292/MathJax%20for%20Base.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML');
    (document.head || document.querySelector('head')).appendChild(script);
})();
