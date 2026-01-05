// ==UserScript==
// @name         NoticeDonateur
// @namespace    https://worldaide.fr/
// @include      https://worldaide.fr/
// @include      https://worldaide.fr/chatbox
// @version      1
// @description  Une Notice pour es donateur de WorldAide !
// @author       Sharke
// @match        https://worldaide.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15213/NoticeDonateur.user.js
// @updateURL https://update.greasyfork.org/scripts/15213/NoticeDonateur.meta.js
// ==/UserScript==
// SCRIPT CODE PAR Sharke //
$(document).ready(function(){
    $.getScript('https://rawgit.com/SharkeW&A/DonateurNotice/master/script.js');
});
