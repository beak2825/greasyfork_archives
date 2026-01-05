// ==UserScript==
// @name           TGR Rewind playlist link
// @namespace      http://armeagle.nl
// @description    Adds playlist links to the rewind entries
// @include        http://complete.gamingradio.net/modules/mod_rewind/player.php?recidx=*
// @include        http://*eve-radio.com/modules/mod_rewind/player.php?recidx=*
// @version 0.0.1.20140705065008
// @downloadURL https://update.greasyfork.org/scripts/3025/TGR%20Rewind%20playlist%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/3025/TGR%20Rewind%20playlist%20link.meta.js
// ==/UserScript==

try {
var player = document.getElementsByTagName('object')[0];
var urlparam = player.getElementsByTagName('param')[0];
if ( urlparam.getAttribute('name') != 'fileName' ) {
  alert("GMscript error: didn't find the right parameter.");
} else {
  var url = urlparam.getAttribute('value');
  var ahref = document.createElement('a');
  ahref.setAttribute('href', url);
  ahref.setAttribute('style', 'color: white; margin-left: 10px;');
  ahref.textContent = url;
  
  var body = document.getElementsByTagName('body')[0];
  body.insertBefore(ahref, body.childNodes[0]);
  
  body.insertBefore(document.createElement('br'), body.childNodes[0]);
}
  
} catch (e) {
  alert("GMscript exception: "+ e);
}