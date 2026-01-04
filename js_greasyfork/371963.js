// ==UserScript==
// @name            HVG open comments
// @name:hu         HVG komment nyitó
// @namespace       http://tampermonkey.net/
// @version         1.1.0
// @description     On HVG.hu the comments overflow on some browsers. This script will unfuck the site's comment section by automatically opening it.
// @description:hu  HVG.hu-n taláható komment szekciót nyitja ki automatikusan, hogy okosabb libsi legyél.
// @author          Me
// @match           *://*.hvg.hu/*
// @grant           none
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/371963/HVG%20open%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/371963/HVG%20open%20comments.meta.js
// ==/UserScript==


(function(){

  var disqus = document.querySelector('.site-disqus');

  if(disqus) {
    disqus.classList.add('open');
  }

}());

