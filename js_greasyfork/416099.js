// ==UserScript==
// @name        SCP Redirect 
// @namespace   http://www.scp-es.com/
// @match       https://www.xmader.com/
// @grant       none
// @version     1.0
// @author      -
// @description Script que redirecciona desde scp-es.com a lafundacionscp.com
// @downloadURL https://update.greasyfork.org/scripts/416099/SCP%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/416099/SCP%20Redirect.meta.js
// ==/UserScript==
if(
window.location.hostname=="scp-es.com"
)
{
  window.location = "http://lafundacionscp.wikidot.com" + window.location.pathname;
}
