// ==UserScript==
// @name           Show or Hide Your Password on Mouse Events
// @description    Show password on double click, hides it when mouse leaves the password field (based on userscripts.org/scripts/show/34184 )
// @include        *
// @version 0.0.1.20140525024114
// @namespace https://greasyfork.org/users/2178
// @downloadURL https://update.greasyfork.org/scripts/1653/Show%20or%20Hide%20Your%20Password%20on%20Mouse%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/1653/Show%20or%20Hide%20Your%20Password%20on%20Mouse%20Events.meta.js
// ==/UserScript==
var is=document.evaluate('//input[@type="password"]',document,null,6,null),l=is.snapshotLength;
  for(i=0;i<l;i++) {
   with(is.snapshotItem(i))
      {
        addEventListener('dblclick',function(){this.type='text'}, false);
        addEventListener('mouseout',function(){this.type='password'}, false);
      }
  }