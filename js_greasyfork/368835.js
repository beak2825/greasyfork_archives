// ==UserScript== 
// @name       MathJax for Hi.gher.Space forum
// @namespace  https://greasyfork.org/en/users/18614-kodegadulo
// @version    1.0.1
// @description  Enables use of MathJax (including LaTeX support) on Higher Dimensions Forum.
// @include    http://hi.gher.space/forum/*
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/368835/MathJax%20for%20HigherSpace%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/368835/MathJax%20for%20HigherSpace%20forum.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML');
    (document.head || document.querySelector('head')).appendChild(script);
})();