// ==UserScript==
// @name         המטפלת של ניב
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  כפתור לטיפול מהיר בדיווחי הודעות
// @author       RemixN1V - Niv
// @match        https://www.fxp.co.il/showthread.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484429/%D7%94%D7%9E%D7%98%D7%A4%D7%9C%D7%AA%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/484429/%D7%94%D7%9E%D7%98%D7%A4%D7%9C%D7%AA%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (FORUM_ID_FXP !== "994") return;

    function lockThread() {
        $.ajax({
            url: `newreply.php?do=postreply&t=${THREAD_ID_FXP}`,
            type: "POST",
            data: {
                message: 'הה',
                message_backup: 'הה',
                wysiwyg: 1,
                loggedinuser: USER_ID_FXP,
                securitytoken: SECURITYTOKEN,
                parseurl: 1,
                signature: 1,
                ajax: 1,
                p: 'who cares',
                openclose: 1,
                do: 'postreply'
            },
            success: function (succ) {
                console.log(document.title.split(' - ')[0]);
                console.log(`${THREAD_ID_FXP}: posting and lock: success!`);
                $.ajax({
                    url: 'postings.php',
                    type: "POST",
                    data: {
                        title: document.title.split(' - ')[0],
                        destforumid: 6852,
                        redirecttitle: document.title.split(' - ')[0],
                        securitytoken: SECURITYTOKEN,
                        t: THREAD_ID_FXP,
                        s: null,
                        do: 'domovethread'
                    },
                    success: function (succ) {
                        console.log(`${THREAD_ID_FXP}: move to ${succ.match(/forumname = "(.*)"/)[1]}: success!`);
                        location.reload();
                    }
                });
            }
        });
    }

    let e = document.createElement('script');
    e.innerText = lockThread;
    document.head.appendChild(e);

    const link = document.createElement("a");
    link.innerText = "טיפלתי, הלאה!";
    link.className = "newcontent_textcontrol";
    link.style.width = "100px";
    link.href = 'javascript:void(0);';
    link.addEventListener('click', function () {
        lockThread();
    });

    document.getElementById('above_postlist').after(link);
})();