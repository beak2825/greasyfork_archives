// ==UserScript==
// @name           Allow password pasting
// @namespace      none
// @description    Re-enables password pasting on Ebay and pobably other sites.

// @include        *
// @exclude        https?://.*?.facebook.com/.*
// @exclude        https?://.*?.google.com/.*
// @exclude        https?://.*?.?github.com/.*
// @exclude        https?://imgur.com/.*

// @run            document-end

// @author         lukie80
// @copyright      Creative Commons Attribution-ShareAlike 3.0 Unported (CC-BY-SA 3.0)
// @license        http://creativecommons.org/licenses/by-sa/3.0/
// @version        1.0
// @lastupdated    2016.09.20
// 
// @downloadURL https://update.greasyfork.org/scripts/23369/Allow%20password%20pasting.user.js
// @updateURL https://update.greasyfork.org/scripts/23369/Allow%20password%20pasting.meta.js
// ==/UserScript==
//-------------------------------------------------------------------------------------------------------------------

// Code taken from "Chris' blog":
// http://chrisbailey.blogs.ilrt.org/2013/01/03/re-enabling-password-pasting-on-annoying-web-forms-v2/
// The only solution that works so far. 

var inputs = document.getElementsByTagName('input');
for (var i=0; i < inputs.length; i++) {
  if (inputs[i].getAttribute('type').toLowerCase() === 'password') {
    inputs[i].onpaste = function(e) {
      // only Chrome and Safari support clipboardData access on event object
      // see http://codebits.glennjones.net/editing/getclipboarddata.htm
      if (e.clipboardData != undefined && e.clipboardData.getData != undefined)
      {
        this.value = e.clipboardData.getData('text/plain');
      }
      return false;
    }
    
  }
}


//-------------------------------------------------------------------------------------------------------------------