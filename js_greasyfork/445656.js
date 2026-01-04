// ==UserScript==
// @name                OneIsNotAmused
// @namespace           http://greasemonkey.chizzum.com
// @description         For anyone unamused by recent changes to the one.network site...
// @include             https://one.network/*
// @version             2
// @downloadURL https://update.greasyfork.org/scripts/445656/OneIsNotAmused.user.js
// @updateURL https://update.greasyfork.org/scripts/445656/OneIsNotAmused.meta.js
// ==/UserScript==

/* JSHint Directives */
/* jshint bitwise: false */
/* jshint evil: true */
/* jshint esversion: 6 */



function oinaDoOne()
{
   var l = localStorage.length;
   if(l == 0) return;

   while(l)
   {
      --l;
      var k = localStorage.key(l);
      if(k.indexOf(":") != -1)
      {
         console.debug('OINA: remove key '+k+" "+localStorage.getItem(k));
         localStorage.removeItem(k);
      }
   }
   
   window.setTimeout(oinaDoTwo, 100);
}
function oinaDoTwo()
{
   let retry = false;
   if(document.getElementsByClassName('ons-buy-modules').length > 0)
   {
      console.debug("OINA: begone, foul popup!");
      document.getElementsByClassName('ons-buy-modules')[0].remove();
   }
   else
   {
      retry = true;
   }
   if(document.getElementsByClassName('ons-ful').length > 0)
   {
      console.debug("OINA: begone, other foul popup!");
      document.getElementsByClassName('ons-ful')[0].remove();
   }
   else
   {
      retry = true;
   }

   if(retry === true)
   {
      window.setTimeout(oinaDoTwo, 100);
   }
   else
   {
      console.debug("OINA: my work here is done...");
   }
}

oinaDoOne();