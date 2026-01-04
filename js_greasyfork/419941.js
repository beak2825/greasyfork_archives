// ==UserScript==
// @name         מפתח הברגים של ניב
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  פותח אתגרים שבועיים בלחיצת כפתור
// @author       Muffin24
// @match        https://www.fxp.co.il/forumdisplay.php?f=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419941/%D7%9E%D7%A4%D7%AA%D7%97%20%D7%94%D7%91%D7%A8%D7%92%D7%99%D7%9D%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/419941/%D7%9E%D7%A4%D7%AA%D7%97%20%D7%94%D7%91%D7%A8%D7%92%D7%99%D7%9D%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==
if (!/^(?!ארכיון).*הפרסות|אתגרים.*$/.test(window.forumname)) {
    return;
}
const forumsConfig = {
    "אתגר שבועי 1": [],
};
const selector = typeof ISMOBILEFXP !== 'undefined' ? 'breadcrumb' : 'above_threadlist';
const link = document.createElement("a");
link.innerText = "פתיחת אתגרים שבועיים";
link.className = "newcontent_textcontrol";
link.style.width = "160px";
link.addEventListener('click', function () {

    const threads = document.querySelectorAll('#threads .title');

    for (const thread of threads) {
        const title = thread.textContent.trim();

        for (const key of Object.keys(forumsConfig)) {

            const regex = new RegExp(key);
            if (!regex.test(title)) continue;

            const message = forumsConfig[key].map(id => `[taguser]${id}[/taguser]`).join('\n') + "\nבבקשה להגיש אתגרים שבועיים";
            const threadId = thread.href.split('=').at(1);

            newReply(threadId, message);
        }
    }

    alert('ניב פתח את האתגרים השבועיים בהצלחה');
});
// link.addEventListener('click', function () {
//     const id = document.querySelector("#breadcrumb > ul > li:nth-child(3) a").href.split('=').at(1);
//     fetch('https://fxptest.000webhostapp.com/temp/?id=' + id)
//         .then(response => response.json())
//         .then(data => {
//         const threads = document.querySelectorAll('#threads .title');
//         for (const thread of threads) {
//             for (const [key, value] of Object.entries(data.forums)) {
//                 if (!new RegExp(value).test(thread.text)) return;
//                 const message = Object.values(data.forums[key].members || {}).map(i => '[taguser]' + i + '[/taguser]').join('\n') + '\nבבקשה להגיש אתגרים שבועיים';
//                 newReplay(thread.href.split('=').at(1), message);
//             }
//         }
//     })
//         .then(_ => {
//         alert('ניב פתח את האתגרים השבועיים בהצלחה');
//     })
// })

function newReply(THREAD_ID_FXP, message) {
    console.log(message);
    const body = new FormData();
    body.append("do", "postreply");
    body.append("message", message);
    body.append("message_backup", message);
    body.append("wysiwyg", 1);
    body.append("loggedinuser", window.USER_ID_FXP);
    body.append("securitytoken", window.SECURITYTOKEN);
    body.append("parseurl", 1);
    body.append("signature", 1);
    body.append("ajax", 1);
    body.append("p", "who cares");
    fetch("https://www.fxp.co.il/newreply.php?t=" + THREAD_ID_FXP, { method: 'POST', body }).catch(error => console.log('error', error));
}
document.getElementById(selector).after(link);