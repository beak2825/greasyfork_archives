// ==UserScript==
// @name         Google always in com
// @version      2018.12.24.1207
// @description  Redirects Google from local TLD to ".com" top level domain (ncr, no country redirect, gws_rd)
// @namespace    https://greasyfork.org/en/users/30-opsomh
// @include      *.google.*/*
// @include      *.blogspot.*/*
// @exclude      *.google.com/*
// @exclude      *.blogspot.com/*
// @grant        none
// @inject-into  auto
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/34366/Google%20always%20in%20com.user.js
// @updateURL https://update.greasyfork.org/scripts/34366/Google%20always%20in%20com.meta.js
// ==/UserScript==

var url = new URL(location.href);

//http://techxt.com/list-of-all-google-domains/1373/
//https://www.google.com/supported_domains
//https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/wiki/List_of_Google_domains.html
var re = /(\.google|\.blogspot)\.[a-z]{2,3}(?:\.[a-z]{2})?$/;
if(re.test(url.hostname))
{
    window.stop();
    console.log('Google always in com:', url.hostname);
    url.searchParams.set('gws_rd', 'cr');
    url.hostname = url.hostname.replace(re, '$1.com');
    location.assign(url.href);
}
