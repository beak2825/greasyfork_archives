// ==UserScript==
// @name         מחוקים? לא בבית ספרנו
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  תיאור תיאורי מאוד מבטיח
// @author       RemixN1V - Niv
// @match        https://www.fxp.co.il/showthread.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469070/%D7%9E%D7%97%D7%95%D7%A7%D7%99%D7%9D%20%D7%9C%D7%90%20%D7%91%D7%91%D7%99%D7%AA%20%D7%A1%D7%A4%D7%A8%D7%A0%D7%95.user.js
// @updateURL https://update.greasyfork.org/scripts/469070/%D7%9E%D7%97%D7%95%D7%A7%D7%99%D7%9D%20%D7%9C%D7%90%20%D7%91%D7%91%D7%99%D7%AA%20%D7%A1%D7%A4%D7%A8%D7%A0%D7%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fixThread(id, title) {
        $.ajax({
            url: 'postings.php',
            type: "POST",
            data: {
                title: title,
                destforumid: 9860,
                redirecttitle: title,
                securitytoken: SECURITYTOKEN,
                t: id,
                s: null,
                do: 'domovethread'
            },
            success: function (succ) {
                console.log(`${id}: move to ${succ.match(/forumname = "(.*)"/)[1]}: success!`);
            }
        });

        $.ajax({
            url: 'postings.php',
            type: "POST",
            data: {
                title: title,
                threadstatus: 1,
                securitytoken: SECURITYTOKEN,
                t: id,
                open: 'yes',
                visible: 'yes',
                do: 'updatethread'
            },
            success: function (succ) {
                console.log(`${id}: recover: success!`);
                //location.reload()
            }
        });
    }

    let e = document.createElement('script');
    e.innerText = fixThread;
    document.head.appendChild(e);

    const link = document.createElement("a");
    link.innerText = "כפתור לתורנות מחוקים!";
    link.className = "newcontent_textcontrol";
    link.style.width = "160px";
    link.href = 'javascript:void(0);';
    link.addEventListener('click', function () {
        $('.cms_table_td').each(function () {
            let id = $(this).find('a').attr('href').split('=')[1];
            let title = $(this).text();
            fixThread(id, title);
        })
    });

    document.getElementById('above_postlist').after(link);
})();