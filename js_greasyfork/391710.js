// ==UserScript==
// @name         Cepstral/Voiceforge Text Delimiter
// @description  Removes the 120-character limit from the Voiceforge and Ceptral TTS Demos
// @icon         http://www.voiceforge.com/favicon.ico
// @author       DipshitDickinson
// @match        http*://www.voiceforge.com/demo*
// @match        http*://www.cepstral.com/*/demos
// @run-at       document-idle
// @version      1
// @namespace    https://greasyfork.org/users/256625
// @downloadURL https://update.greasyfork.org/scripts/391710/CepstralVoiceforge%20Text%20Delimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/391710/CepstralVoiceforge%20Text%20Delimiter.meta.js
// ==/UserScript==

// if at Cepstral's site, act approprately. otherwise, apply to Voiceforge.
if (window.location.href.indexOf("cepstral") > -1) {
    $('textarea#demo_text').unbind()}
else {
    $('#dtu').unbind()}