// ==UserScript==
// @name          Wakaba Reply Links
// @namespace     http://dluciv.name/
// @description   Wakaba Reply Links. Click pastes >>... link to reply form, context menu allows to copy URL with #... reply reference
// @namespace     http://dluciv.name/
// @copyright     2014+, Dmitry V. Luciv
// @license       WTFPLv2; http://wtfpl.net
// @license       MIT; http://opensource.org/licenses/MIT
// @version       0.0.0.7
// @homepage      https://github.com/dluciv/UserScripts/tree/master/wakaba-links
// @icon          https://raw.githubusercontent.com/dluciv/UserScripts/master/wakaba-links/unyl-chan.png
// @grant         none
// @include       http://iichan.hk/*
// @downloadURL https://update.greasyfork.org/scripts/4518/Wakaba%20Reply%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/4518/Wakaba%20Reply%20Links.meta.js
// ==/UserScript==

"use strict";

try {
    var replies = document.querySelectorAll('td[id^="reply"]');

    var mkHandler = function (anchor) {
        return function (e) {
            e.preventDefault();
            window.insert(">>" + anchor); // do as before
        };
    };

    for(var nreply = 0; nreply < replies.length; nreply++)
    {
        var reply = replies[nreply];
        var rlhref = reply.querySelector(
            'span.reflink a[href^="javascript:insert("]'
        );
        var rid = reply.getAttribute('id').replace('reply', '');
        rlhref.setAttribute('href', "#" + rid);
        rlhref.addEventListener('click', mkHandler(rid));
    }
} catch(e) {
    console.log(e);
}
