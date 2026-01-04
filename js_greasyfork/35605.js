// ==UserScript==
// @name        Link Untracker
// @namespace   IzzySoft
// @description Remove tracking elements from links
// @license     CC BY-NC-SA
// @include     *
// @exclude     *phpmyadmin*
// @version     13
// @run-at      document-idle
// @grant       unsafeWindow
// @homepage    https://codeberg.org/izzy/userscripts
// @downloadURL https://update.greasyfork.org/scripts/35605/Link%20Untracker.user.js
// @updateURL https://update.greasyfork.org/scripts/35605/Link%20Untracker.meta.js
// ==/UserScript==

/* badp: we strip parameters starting with that. Some are taken from NetURL, see
   https://github.com/Smile4ever/firefoxaddons/tree/master/Neat%20URL-webext
   fb_: Facebook; ga_/_gl: Google; hmb_: HumbleBundle(?); utm_: Urchin Tracker; wt_: Webtrekk; WT.: Webtrends
*/
var badp = ['fb_','ga_','_ga','_gl','hmb_','utm_',
            'ei@google.','gws_rd@google.','sei@google.','ved@google.',
            'pd_rd_r@amazon.','pd_rd_w@amazon.','pd_rd_wg@amazon.','psc@amazon.','_encoding@amazon.',
            'wt_','WT.','yclid','referrer','clickfrom','pf_rd'
           ];
var anch = ''; /* variable to hold the "anchor part" of the URL, if any – i.e. "#anchor" */
var replace_semicolon = true; /* some sites use ";" to separate URL params;
                                 URLSearchParams can't deal with that and messes up.
                                 If those sites don't work with "&", either set this
                                 to "false" or add that site on the exclude list
                               */

function getRealLinkFromGoogleUrl(a) { /* adapted from https://github.com/Rob--W/dont-track-me-google at 2018-01-03 */
    if ((a.hostname === location.hostname || a.hostname === 'www.google.com') &&
        /^\/(local_)?url$/.test(a.pathname)) {
        // Google Maps / Dito (/local_url?q=<url>)
        // Mobile (/url?q=<url>)
        var url = /[?&](?:q|url)=((?:https?|ftp)[%:][^&]+)/.exec(a.search);
        if (url) {
            return decodeURIComponent(url[1]);
        }
        // Help pages, e.g. safe browsing (/url?...&q=%2Fsupport%2Fanswer...)
        url = /[?&](?:q|url)=((?:%2[Ff]|\/)[^&]+)/.exec(a.search);
        if (url) {
            return a.origin + decodeURIComponent(url[1]);
        }
    }
    return a.href;
}

class UrlParams { /* adapted from https://stackoverflow.com/a/45516670 as the built-in URLSearchParams messes up parameters without values */
  constructor(search) { /* extracts the query string by stripping the leading "?" and initializes properties */
    this.qs = (search || location.search).substr(1);
    this.params = {};
    this.parseQuerstring();
  }
  parseQuerstring() { /* walks the query string and extracts the parameters as key-value-pairs */
    this.qs.split('&').reduce((a, b) => {
      let [key, val] = b.split('=');
      a[key] = val;
      return a;
    }, this.params);
  }
  filterQuerystring(badparms) { /* eliminates all "bad parameters" (tracking parameters) from our key-value-pairs */
    var keysToDelete = [];
    for (var key of Object.keys(this.params)) {
      for (let p of badparms) {
        if (key.startsWith(p)) console.log('removing '+key+' from '+this.qs);
        if (key.startsWith(p)) { keysToDelete.push(key); break; }
      }
    }
    for(var key of keysToDelete) {
      delete this.params[key];
    }
  }
  getString() { /* concatenates all parameters and returns them as a single query string without the leading "?" */
    var str = '';
    for (var key of Object.keys(this.params)) {
      str = str + '&' + key;
      if (this.params[key] != undefined) str = str + '=' + this.params[key]; /* only add the "=value" part if the parameter has a value! */
    }
    return str.substring(1);
  }
}

// MetaGer.de uses different methods of obfuscation with tracking URLs. This is catching most of them (hopefully):
function metager1(elem) {
  if ( elem.hostname == 'api.smartredirect.de' ) {
    var purl = new UrlParams(elem.search);
    elem.href = decodeURIComponent(purl.params['url']);
  } else if ( elem.href.startsWith ('https://metager.de/partner/r')) {
    var purl = new UrlParams(elem.search);
    elem.href = decodeURIComponent(purl.params['link']);
  } else if ( elem.href.startsWith ('https://metager.de/r/metager')) {
    if (elem.text.trim().startsWith('http:') || elem.text.trim().startsWith('https:')) {
      elem.href = decodeURI(elem.text.trim());
    } else {
      elem.href = 'https://'+decodeURI(elem.text.trim());
    }
  }
}

function parseLinks(k) {
  for(var i = k; i < document.links.length; i++) { // for some reason stops at 100 loops
    if (i - k > 98) return i;
    var elem = document.links[i];
    if (window.location.hostname == 'metager.de' && elem.className.includes('result-link')) { metager1(elem); continue; }
    if (elem.search == '') continue;
    if (replace_semicolon) var purl = new UrlParams(elem.search.replace(new RegExp(';','g'),'&'));
    else var purl = new UrlParams(elem.search);
    purl.filterQuerystring(badp);
    if (elem.href.indexOf('#') > 0) anch = '#' + elem.href.split('#')[1];
    else anch = '';
    elem.href = elem.href.split('?')[0] + '?' + purl.getString() + anch;
    elem.href = getRealLinkFromGoogleUrl(elem);
  }
  return i;
}

console.log(document.links.length+' links to parse');
k = 0; while ( k < document.links.length) {
  console.log('parsing from '+k);
  k = parseLinks(k+1);
  console.log('returned '+k)
}
console.log('DONE');
