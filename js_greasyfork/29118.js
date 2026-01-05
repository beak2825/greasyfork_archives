// ==UserScript==
// @name        Mturk Group ID Adder
// @author      DCI
// @description Adds group ID to Amazon hosted iframes to allow HIT specific script activation.
// @namespace   www.redpandanetwork.org
// @match       https://*.mturk.com/mturk/preview*
// @match       https://*.mturk.com/mturk/accept*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/29118/Mturk%20Group%20ID%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/29118/Mturk%20Group%20ID%20Adder.meta.js
// ==/UserScript==

iframe = document.getElementsByTagName('iframe')[0];

var groupId = window.location.toString().split("groupId=")[1].split("&")[0];

if ((iframe.src.indexOf("s3.amazonaws.com") != -1) || (iframe.src.indexOf("mturkcontent.com") != -1)) {
  iframe.src = iframe.src + "&groupId=" + groupId;
}