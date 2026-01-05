// ==UserScript==
// @name        mail.ru: clean links
// @namespace   lainscripts_mailru_clean_links
// @description Dereferences mail.ru links in emails when clicked. Skips advertisement block displayed when some links are clicked. 
// @author      lainverse
// @license     CC BY-SA
// @version     5.1
// @include     https://e.mail.ru/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4489/mailru%3A%20clean%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/4489/mailru%3A%20clean%20links.meta.js
// ==/UserScript==

var clb = /^https?:\/\/r\.mail\.ru\/cl[a-z][0-9]+\/(.*)/i,
    cgi = /&(amp;)?url=([^&]*)/i,
    letter = document.getElementById('b-letter');

function locate_confirmer(i) {
    if (!i) return;
    var confirmForm = document.querySelector('#MailRuConfirm');
    if (!confirmForm)
        setTimeout(locate_confirmer, 100, i-1);
}


letter.addEventListener('click',function(e){
    if (e.target.tagName.toUpperCase() !== 'A')
        return;
    var link = e.target;
    for (var x in link)
        if (x.indexOf('__originUrl') > -1) {
            // stop propagation of this click event
            e.preventDefault();
            // start searching for a confirmer
            locate_confirmer(11);

            var res = null;

            do {
                res = cgi.exec(link[x]);
                if (res) link[x] = decodeURIComponent(res[2]);
                res = clb.exec(link[x]);
                if (res) link[x] = 'http://' + res[1];
            } while (res);

            link.href = link[x];
            console.log("Dereferenced link:", link[x]);
            window.open(link[x], '_blank').focus();
            delete link[x];

            break;
        }
});