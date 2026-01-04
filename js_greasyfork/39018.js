// ==UserScript== 
// @name       MathJax for Tapatalk Dozensonline
// @namespace  https://greasyfork.org/en/users/18614-kodegadulo
// @version    1.0
// @description  Enables use of MathJax (including LaTeX support) on Tapatalk Dozensonline Forum.
// @include    https://www.tapatalk.com/groups/dozensonline/*
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/39018/MathJax%20for%20Tapatalk%20Dozensonline.user.js
// @updateURL https://update.greasyfork.org/scripts/39018/MathJax%20for%20Tapatalk%20Dozensonline.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML');
    (document.head || document.querySelector('head')).appendChild(script);
})();