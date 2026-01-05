// ==UserScript==
// @name Adobe Typekit Fonts for Shuu
// @description:en Javascript Fontloader
// @include http://e-shuushuu.net/*
// @grant none
// @version v0.1221
// @namespace http://e-shuushuu.net
// @description Javascript Fontloader
// @downloadURL https://update.greasyfork.org/scripts/24371/Adobe%20Typekit%20Fonts%20for%20Shuu.user.js
// @updateURL https://update.greasyfork.org/scripts/24371/Adobe%20Typekit%20Fonts%20for%20Shuu.meta.js
// ==/UserScript==
  (function(d) {
    var config = {
      kitId: 'rhg7oqp',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);