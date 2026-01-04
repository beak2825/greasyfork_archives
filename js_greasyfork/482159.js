// ==UserScript==
// @name Mark CloudFlare links
// @description Take action against CloudFlare. Mark CloudFlare links.
// @namespace deCloudflare_us_color-cf
// @author Matthew L. Tanner, CrimeFlare
// @match https://*/*
// @match http://*/*
// @version 1.0.0.2
// @grant none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482159/Mark%20CloudFlare%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/482159/Mark%20CloudFlare%20links.meta.js
// ==/UserScript==
// this script will not run on those sites
// e.g. ['www.youtube.com','www.google.com']
let DONT_RUN_FQDNS = ['web.archive.org'];
//-----
// [Documentation] https://0xacab.org/dCF/deCloudflare/-/blob/master/tool/userscripts/README.md
// [About API] http://about-karmaapi.go.crimeflare.eu.org
const api_url = 'https://karma.crimeflare.eu.org/api/is/cloudflare/';
let fqdn_self = location.hostname;
function scanme() {
   let fqdns = {};
   document.querySelectorAll('a[href]:not([xcf])').forEach(l => {
      try {
         let u = new URL(l.href);
         if (u.hostname != fqdn_self && (u.protocol == 'https:' || u.protocol == 'http:')) {
            l.setAttribute('xcf', 'q');
            let fqdn = u.hostname;
            if (!/^(|(.*)\.)archive\.org$/.test(fqdn)) {
               if (fqdns[fqdn] == undefined) {
                  fqdns[fqdn] = [];
               }
               fqdns[fqdn].push(l);
            }
         }
      } catch (x) {}
   });
   let ff_str = Object.keys(fqdns).slice(0, 200).join(',');
   if (ff_str == '') {
      return;
   }
   try {
      fetch(api_url, {
         method: 'POST',
         mode: 'cors',
         body: 'ff=' + ff_str,
         referrer: '',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
         }
      }).then(x => x.json()).then(x => {
         for (let xx in x) {
            if (fqdns[xx]) {
               if (x[xx]) {
                  fqdns[xx].forEach(qs => {
                     qs.setAttribute('xcf', 'y');
                  });
               } else {
                  fqdns[xx].forEach(qs => {
                     qs.setAttribute('xcf', 'n');
                  });
               }
            }
         }
      }).catch(x => {});
   } catch (x) {}
}
if (!DONT_RUN_FQDNS.includes(fqdn_self) && !/\.crimeflare\.eu\.org$/.test(fqdn_self)) {
   try {
      const style = document.createElement('style');
      document.head.appendChild(style);
      const styleSheet = style.sheet;
      styleSheet.insertRule("a[xcf='y']{opacity:0.6;text-decoration-line:line-through !important;text-decoration-color:red !important;text-decoration-style:double !important;}", 0);
   } catch (x) {}
   scanme();
   (new MutationObserver(scanme)).observe(document, {
      attributes: true,
      attributeFilter: ['href'],
      childList: true,
      subtree: true
   });
}