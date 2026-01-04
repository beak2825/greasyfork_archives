// ==UserScript==
// @name           Google-Consent-Cookie figuccio
// @version        0.2
// @description    accetta consent cookie ottobre 2023
// @author         figuccio
// @namespace      https://greasyfork.org/users/237458
// @match          *://www.google.de/*
// @match          https://*.google.com/*
// @match          https://*.google.it/*
// @match          https://*.google.fr/*
// @match          https://*.google.es/*
// @icon           https://www.google.com/favicon.ico
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/478088/Google-Consent-Cookie%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/478088/Google-Consent-Cookie%20figuccio.meta.js
// ==/UserScript==
//accetta consent traduttore
setTimeout(function(){document.querySelector("#yDmH0d > c-wiz > div > div > div > div.NIoIEf > div.G4njw > div.AIC7ge > div.CxJub > div.VtwTSb > form:nth-child(1) > div > div > button > div.VfPpkd-RLmnJb").click();},1000);
//cookie consent accetta cookie
if (!document.cookie.match("(^|;)\\s*CONSENT=YES\\+")) {
    document.cookie="CONSENT=YES+domain=.google.com;max-age=31536000";
    document.cookie="CONSENT=YES+domain=.google.it;max-age=31536000";
    document.cookie="CONSENT=YES+domain=.google.fr;max-age=31536000";//francia
    document.cookie="CONSENT=YES+domain=.google.es;max-age=31536000";//spagna
    document.cookie="CONSENT=YES+domain=.google.de;max-age=31536000";//tedesco
  location.reload();
}
