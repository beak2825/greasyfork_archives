// ==UserScript== 
// @name        Enforce HTTPS
// @namespace   i2p.schimon.enforce-https
// @description Automatically change HTTP URLs to HTTPS, when possible.
// @author      Schimon Jehudah, Adv.
// @homepageURL https://greasyfork.org/en/scripts/465953-enforce-https
// @supportURL  https://greasyfork.org/en/scripts/465953-enforce-https/feedback
// @copyright   2023 - 2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @run-at      document-start
// @match       http://*/*
// @connect     self
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @icon        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjRtbSIgaGVpZ2h0PSI2NG1tIiB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRleHQgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3R5bGU9ImZvbnQtd2VpZ2h0OjQwMDtmb250LXNpemU6MTkycHg7bGluZS1oZWlnaHQ6MDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uLXN0eWxlOnNvbGlkO3RleHQtZGVjb3JhdGlvbi1jb2xvcjojMDAwO3dyaXRpbmctbW9kZTpsci10YjtkaXJlY3Rpb246bHRyO3RleHQtb3JpZW50YXRpb246bWl4ZWQ7ZG9taW5hbnQtYmFzZWxpbmU6YXV0bztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTt0ZXh0LWFuY2hvcjpzdGFydDtzaGFwZS1wYWRkaW5nOjA7c2hhcGUtbWFyZ2luOjA7aW5saW5lLXNpemU6MDtvcGFjaXR5OjE7ZmlsbDojMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwMDtzdG9wLW9wYWNpdHk6MSIgeD0iMTcuMDA1MjQ1IiB5PSIzMS42NTg0MDUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjQzNjg1NjQgNDAuODk0OTQpIHNjYWxlKC4yNjQ1OCkiPjx0c3BhbiB4PSIxNy4wMDUyNDUiIHk9IjMxLjY1ODQwNSIgc3R5bGU9ImZvbnQtc2l6ZToxOTJweCI+8J+boe+4jzwvdHNwYW4+PC90ZXh0Pjwvc3ZnPgo=
// @version     24.04
// @downloadURL https://update.greasyfork.org/scripts/465953/Enforce%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/465953/Enforce%20HTTPS.meta.js
// ==/UserScript==

// @makyen
// /greasemonkey/greasemonkey/issues/3160#issuecomment-1456758080
const gmXmlhttpRequest = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : GM.xmlHttpRequest;

if (!location.protocol.startsWith('http:')) return; // exit (else, continue)

var newURL = location.href.replace('http:','https:');

gmXmlhttpRequest({
  method: 'GET',
  url: newURL,
  onprogress: console.log('Checking for https...'),
  onload: function(response) {
    if (response.finalUrl == newURL && response.status == 200) {
      location.href = newURL;
      console.info(`Successfully redirected to https (Response status: ${response.status}).`);
    } else {
      console.log(`No https access available (Response status: ${response.status}).`);
    }
  },
  onerror: function(response) {
    console.log('Error requesting for https.')
  }
})

/*
fetch(newURL)
  .then((response) => {
     if (request.reseponseURL == newURL) {
       window.open(newURL,'_self');
     }
  })
*/
