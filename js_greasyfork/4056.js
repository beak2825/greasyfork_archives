// ==UserScript==
// @name          UTM param stripper
// @author        Paul Irish
// @namespace     http://github.com/paulirish
// @version       1.1.2
// @description   Drop the UTM params from a URL when the page loads.
// @extra         Cuz you know they're all ugly n shit.
// @include       /^https?:\/\/.*[\?#&]utm_.*/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/4056/UTM%20param%20stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/4056/UTM%20param%20stripper.meta.js
// ==/UserScript==


// Install instruction!!!!
// Click `raw` in the top right on this gist!

if (/utm_/.test(location.search) && window.history.replaceState){  
  
  // thx @cowboy for the revised hash param magic.
  var oldUrl = location.href;
  var newUrl = oldUrl.replace(/\?([^#]*)/, function(_, search) {
    search = search.split('&').map(function(v) {
      return !/^utm_/.test(v) && v;
    }).filter(Boolean).join('&'); // omg filter(Boolean) so dope.
    return search ? '?' + search : '';
  });

  if ( newUrl != oldUrl ) {
    window.history.replaceState({},'', newUrl); 
  }
  
}

// also..
// drop this into your own site, in case people link to you with 
// email newsletters or your rss feed's feedburner tracking or whatever.
