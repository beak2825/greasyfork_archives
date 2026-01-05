// ==UserScript==
// @name        google gmail
// @namespace   manobastardo
// @include     https://mail.google.com/mail/u/0/#inbox
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description google gmail remove empty notification
// @downloadURL https://update.greasyfork.org/scripts/18402/google%20gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/18402/google%20gmail.meta.js
// ==/UserScript==

var wait = setInterval(function() {
    var loaded = $(".cf.TB");
    if (loaded.length) {
        clearInterval(wait);
        var empty = $('a[href="https://www.google.com/inbox/?utm_campaign=en&utm_source=inboxzero&utm_medium=promo"]')
        if (empty.length) {
          empty.parent().remove();
        }
    } else {
      console.log("wait");
    }
}, 111);