// ==UserScript==
// @name         remind_me_vagrant_update
// @namespace    https://github.com/techstay/myscripts
// @version      0.1
// @description  remind me if vagrant support virtualbox
// @author       techstay
// @match        *
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @connect vagrantup.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/395749/remind_me_vagrant_update.user.js
// @updateURL https://update.greasyfork.org/scripts/395749/remind_me_vagrant_update.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CHECKED_DATE = 'checkedDate';

    function checkDateEquals(a, b) {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }

    function checkVagrantVersion() {
        GM_setValue(CHECKED_DATE, new Date());
        GM_xmlhttpRequest({
            "method": "GET",
            "url": "https://www.vagrantup.com/",
            "headers": {
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
            },
            "onload": function (result) {
                var list = jQuery.parseHTML(result.response);
                jQuery.each(list, function (i, el) {
                    if (el.nodeName == 'HEADER') {
                        var header = jQuery.parseXML(el.innerHTML);
                        var version = header.getElementsByTagName('a')[1].textContent.replace('Download ', '');
                        if (version != '2.2.6') {
                            alert('Vagrant update!');
                        }
                        return false;
                    }
                });
            }
        });
    }

    var today = new Date();
    var lastCheckedDay = new Date(GM_getValue(CHECKED_DATE, new Date('2006-1-1')));
    if (!checkDateEquals(lastCheckedDay, today)) {
        checkVagrantVersion();
    }

})();