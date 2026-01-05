// ==UserScript==
// @name           MathJax Kaskus
// @namespace      https://code.google.com/p/mathjax-kaskus/
// @version        0.1
// @description    iseng
// @include        /^https?://www.kaskus.co.id/thread/*/
// @include        /^https?://www.kaskus.co.id/lastpost/*/
// @include        /^https?://www.kaskus.co.id/post/*/
// @include        /^https?://www.kaskus.co.id/group/discussion/*/
// @include        /^https?://www.kaskus.co.id/show_post/*/
// @include        /^https?://www.kaskus.co.id/post_reply/*/
// @include        /^https?://www.kaskus.co.id/edit_post/*/
// @copyright  2014+, ( fauzieuy )
// @author         http://www.kaskus.co.id/profile/2200164
// @downloadURL https://update.greasyfork.org/scripts/3416/MathJax%20Kaskus.user.js
// @updateURL https://update.greasyfork.org/scripts/3416/MathJax%20Kaskus.meta.js
// ==/UserScript==

var mathjax = document.createElement('script');
mathjax.type="text/javascript";
mathjax.src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";

var mathjaxConfig=document.createElement('script');
mathjaxConfig.type="text/x-mathjax-config";
mathjaxConfig.innerHTML= "MathJax.Hub.Config({   tex2jax: {inlineMath: [['$','$']]} });";

var head=document.getElementsByTagName('head')[0];
head.appendChild(mathjax);
head.appendChild(mathjaxConfig);