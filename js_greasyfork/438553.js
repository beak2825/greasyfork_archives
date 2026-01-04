// ==UserScript==
// @name        Descifrar enlaces de DivxTotaL y GranTorrent
// @description Evita ir y volver a la misma página y lo de forzar desactivar el bloqueador de publicidad; me lo pidió un usuario.
// @author      Swyter
// @match       https://*.divxtotal.tld/*
// @match       https://*.divxtotal.nl/*
// @match       https://*.divxtotal.com/*
// @match       https://*.divxtotal.pm/*
// @match       https://*.divxtotal.re/*
// @match       https://*.divxtotal.ac/*
// @match       https://*.divxtotal.dev/*
// @match       https://*.divxtotal.re/*
// @match       https://*.divxtotal.ms/*
// @match       https://*.divxtotal.pl/*
// @match       https://*.divxtotal.win/*
// @match       https://*.divxtotal.mov/*
//
// @match       https://*.grantorrent.tld/*
// @match       https://*.grantorrent.ch/*
// @match       https://*.grantorrent.net/*
// @match       https://*.grantorrent.re/*
// @match       https://*.grantorrent.si/*
// @match       https://*.grantorrent.fi/*
// @match       https://*.grantorrent.wtf/*
// @match       https://*.grantorrent.bz/*
// @match       https://*.grantorrent.zip/*
// @match       https://*.grantorrent.wf/*
//
// @include     http://*.divxtotal.*/*
// @include     http://*.grantorrent.*/*
//
// @license     CC-BY-SA 4.0
// @namespace   https://greasyfork.org/users/4813
// @version     2023.12.08
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/438553/Descifrar%20enlaces%20de%20DivxTotaL%20y%20GranTorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/438553/Descifrar%20enlaces%20de%20DivxTotaL%20y%20GranTorrent.meta.js
// ==/UserScript==


/* https://codereview.stackexchange.com/a/132140 */
function rot13(str)
{
  var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
  var index     = x => input.indexOf(x);
  var translate = x => index(x) > -1 ? output[index(x)] : x;
  return str.split('').map(translate).join('');
}

const rules =
[
    { query: "a[href*='divxto.site'], a[href*='ddtorrent.live'], a[href*='super-enlace.com'], a[href*='short-info.link']", param: '?i=', fun: function(cypher){ return rot13(atob(atob(atob(atob(atob(cypher)))))); }},
    { query: "a[href*='divxtotal.nl/download_tt.php']",                                                                    param: '?u=', fun: function(cypher){ return                           atob(cypher)     ; }},
]

for (var rule of rules)
  for (var elem of document.querySelectorAll(rule.query))
  {    
    try
    {
      var cypher = elem.href.split(rule.param)[1]

      console.log('[procesando enlace cifrado]', elem, elem.href, cypher);

      /* swy: decode and assign the five-time base64-encoded-and-then-rot13 thing */
      elem.href = rule.fun(cypher)
      
      console.log('[i]', elem, elem.href);
    }
    catch(e) {}
  }