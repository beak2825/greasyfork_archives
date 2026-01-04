// ==UserScript==
// @name MAKE JVC GREAT AGAIN
// @description Redimensionner le site comme avant
// @author Diamonds
// @match http://www.jeuxvideo.com/*
// @match http://www.forumjv.com/*
// @run-at document-end
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.3
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/27093
// @downloadURL https://update.greasyfork.org/scripts/31146/MAKE%20JVC%20GREAT%20AGAIN.user.js
// @updateURL https://update.greasyfork.org/scripts/31146/MAKE%20JVC%20GREAT%20AGAIN.meta.js
// ==/UserScript==

$('.bloc-message-forum').css({"font-size":"0.84rem"});
$('.bloc-pre-pagi-forum .group-one, .bloc-pre-pagi-forum .group-two').css({"float":"left"});
$('.container').css({"max-width":"63.5rem"});
$('.col-right').css({"max-width":"15.5rem"});