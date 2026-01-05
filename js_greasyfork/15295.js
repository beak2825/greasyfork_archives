// ==UserScript==
// @name         NoticePremium
// @namespace    http://www.worldaide.fr/
// @include      http://www.worldaide.fr/
// @include      http://www.worldaide.fr/chatbox
// @version      1
// @description  Un notice exclusive aux premiums, géré par la GTP !
// @author       Sharke et WorldAide_WeeD SOUSOU93 TOS27709
// @match        http://www.worldaide.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15295/NoticePremium.user.js
// @updateURL https://update.greasyfork.org/scripts/15295/NoticePremium.meta.js
// ==/UserScript==
// SCRIPT CODE PAR Sharke //
$(document).ready(function(){
    $.getScript('https://rawgit.com/LoucasseRG/premiumNotice/master/script.js');
});
