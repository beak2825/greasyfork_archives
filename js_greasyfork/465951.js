// ==UserScript== 
// @name        Remove WWW
// @namespace   i2p.schimon.no-www
// @description Redirect to URL without www.
// @author      Schimon Jehudah, Adv.
// @homepageURL https://greasyfork.org/scripts/465951-no-www
// @supportURL  https://greasyfork.org/scripts/465951-no-www/feedback
// @copyright   2023 - 2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @run-at      document-start
// @include     *://www.*
// @connect     self
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @icon        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMuODQgMy44NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDo3MDA7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6MTkycHg7bGluZS1oZWlnaHQ6MDtmb250LWZhbWlseTpNb25vc3BhY2U7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonTW9ub3NwYWNlIEJvbGQnO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1wb3NpdGlvbjpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsO2ZvbnQtZmVhdHVyZS1zZXR0aW5nczpub3JtYWw7dGV4dC1pbmRlbnQ6MDt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtZGVjb3JhdGlvbjpub25lO3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uLXN0eWxlOnNvbGlkO3RleHQtZGVjb3JhdGlvbi1jb2xvcjojMDAwO2xldHRlci1zcGFjaW5nOjMwcHg7d29yZC1zcGFjaW5nOjA7dGV4dC10cmFuc2Zvcm06bm9uZTt3cml0aW5nLW1vZGU6bHItdGI7ZGlyZWN0aW9uOmx0cjt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO2RvbWluYW50LWJhc2VsaW5lOmF1dG87YmFzZWxpbmUtc2hpZnQ6YmFzZWxpbmU7dGV4dC1hbmNob3I6c3RhcnQ7d2hpdGUtc3BhY2U6bm9ybWFsO3NoYXBlLXBhZGRpbmc6MDtzaGFwZS1tYXJnaW46MDtpbmxpbmUtc2l6ZTowO29wYWNpdHk6MTt2ZWN0b3ItZWZmZWN0Om5vbmU7ZmlsbDojMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMDA7c3RvcC1vcGFjaXR5OjEiIHg9IjIwOC40NCIgeT0iNDQ0Ljk4MSIgdHJhbnNmb3JtPSJtYXRyaXgoLjAwNTkgMCAwIC4wMDUzNiAtLjUxIC0uMDkpIj48dHNwYW4geD0iMjA4LjQ0IiB5PSI0NDQuOTgxIiBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDo3MDA7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6MTkycHg7Zm9udC1mYW1pbHk6TW9ub3NwYWNlOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J01vbm9zcGFjZSBCb2xkJyI+V1dXPC90c3Bhbj48L3RleHQ+PHBhdGggZD0iTTEuOTIgMGExLjkyIDEuOTIgMCAxIDAgMS45MiAxLjkyQTEuOTIgMS45MiAwIDAgMCAxLjkyIDBabTAgMy40NTZBMS41MzYgMS41MzYgMCAwIDEgLjM4NCAxLjkyIDEuNTIgMS41MiAwIDAgMSAuNzA4Ljk4bDIuMTUzIDIuMTUyYTEuNTIgMS41MiAwIDAgMS0uOTQxLjMyNFptMS4yMTItLjU5NUwuOTc5LjcwOEExLjUyIDEuNTIgMCAwIDEgMS45Mi4zODQgMS41MzYgMS41MzYgMCAwIDEgMy40NTYgMS45MmExLjUyIDEuNTIgMCAwIDEtLjMyNC45NFoiIHN0eWxlPSJmaWxsOnJlZDtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6LjE5MTk5NztzdHJva2UtZGFzaGFycmF5Om5vbmUiLz48L3N2Zz4=
// @version     24.04
// @downloadURL https://update.greasyfork.org/scripts/465951/Remove%20WWW.user.js
// @updateURL https://update.greasyfork.org/scripts/465951/Remove%20WWW.meta.js
// ==/UserScript==

// SVG icon from https://www.svgrepo.com/svg/357363/ban

// @makyen
// /greasemonkey/greasemonkey/issues/3160#issuecomment-1456758080
const gmXmlhttpRequest = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : GM.xmlHttpRequest;

// if (!location.host.startsWith('www.')) return; // exit (else, continue)

var newURL = location.href.replace('://www.','://');

gmXmlhttpRequest({
  method: 'GET',
  url: newURL,
  onprogress: console.log('Checking for no-www...'),
  onload: function(response) {
    if (response.finalUrl == newURL && response.status == 200) {
      location.href = newURL;
      console.info(`Successfully removed www (Response status: ${response.status}).`);
    } else {
      console.log(`Please contact webmaster to remove www. https://no-www.org/ (Response status: ${response.status}).`);
    }
  },
  onerror: function(response) {
    console.log('Error requesting for no-www. Please contact webmaster to remove www.')
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
