// ==UserScript==
// @name JVC Back
// @description Regler les conneries des stagiaires
// @author Singles
// @match http://www.jeuxvideo.com/*
// @match http://www.forumjv.com/*
// @run-at document-end
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.4
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/27093
// @downloadURL https://update.greasyfork.org/scripts/31144/JVC%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/31144/JVC%20Back.meta.js
// ==/UserScript==

$('.bloc-message-forum').css({"font-size":"0.8rem"});
$('.bloc-pre-pagi-forum .group-one, .bloc-pre-pagi-forum .group-two').css({"float":"left"});
$('.container').css({"max-width":"61.25rem"});