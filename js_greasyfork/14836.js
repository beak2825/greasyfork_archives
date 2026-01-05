// ==UserScript==
// @name        Voat - Add IRC
// @namespace   voat-chat
// @description Embeds IRC into Voat
// @include     https://voat.co/*
// @include     http://voat.co/*
// @locale en
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14836/Voat%20-%20Add%20IRC.user.js
// @updateURL https://update.greasyfork.org/scripts/14836/Voat%20-%20Add%20IRC.meta.js
// ==/UserScript==
    var x = document.getElementsByClassName("spacer spacersection");
    x[0].innerHTML = '<iframe id="cbox" src="https://kiwiirc.com/client/irc.veuwer.com:+6697/#voat" height="500px" width="100%"></iframe>';
