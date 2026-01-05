// ==UserScript==
// @name        Hide the Yeti
// @namespace   localhost
// @author      Hunter
// @description Hides instructions for Yeti hits
// @include     *
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/28143/Hide%20the%20Yeti.user.js
// @updateURL https://update.greasyfork.org/scripts/28143/Hide%20the%20Yeti.meta.js
// ==/UserScript==

document.getElementsByClassName('panel-heading')[0].style.display='none';
document.getElementsByClassName('panel-body')[0].style.display='none';