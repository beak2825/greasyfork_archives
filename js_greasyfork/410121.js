// ==UserScript==
// @name         המשרתת של ניב
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  מנקה אשכולות של אתגרים שבועיים בקלות ובמהירות
// @author       Muffin24
// @match        https://www.fxp.co.il/forumdisplay.php?f=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410121/%D7%94%D7%9E%D7%A9%D7%A8%D7%AA%D7%AA%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/410121/%D7%94%D7%9E%D7%A9%D7%A8%D7%AA%D7%AA%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==
if (!/^(?!ארכיון).*הפרסות|אתגרים.*$/.test(window.forumname)) {
    return;
}
const selector = typeof ISMOBILEFXP !== 'undefined' ? 'breadcrumb' : 'above_threadlist';
const regex = /https:\/\/www\.fxp\.co\.il\/showthread\.php\?t=\d+/;
const link = document.createElement("a");
link.innerText = "ניקוי אשכולות נעולים";
link.className = "newcontent_textcontrol";
link.style.width = "140px";
link.addEventListener('click', async function () {
    const mergethreadurl = prompt("קישור לאשכול הניקוי של האתגרים השבועיים");
    if (!regex.test(mergethreadurl)) {
        return;
    }
    //TODO: remove or update dom | maybe regex
    const res = await (await fetch('https://www.fxp.co.il/modcp/antispam.php')).text();
    const doc = new DOMParser().parseFromString(res, 'text/html')
    if (!doc.querySelector('table').innerText.includes('לא נבחר משתמש')) {
        location.href = 'https://www.fxp.co.il/modcp/antispam.php';
        return alert("אנא התחבר למשתמש ונסה שוב לאחר ההתחברות");
    }
    //
    const threads = document.querySelectorAll('#threads > li.lock');
    for (const thread of threads) {
        const threadid = thread.id.split('_').at(1);
        const response = await fetch(`https://www.fxp.co.il/showthread.php?t=${threadid}&pp=40`);
        const html = await response.text();
        //TODO: regex or improve selector
        const doc = new DOMParser().parseFromString(res, 'text/html')
        const posts = [...doc.querySelectorAll('.postbit')].shift().map(post => {
            if (post.querySelector('.postbody_unposted')) {
                return;
            }
            return post.id.split('_')[1]
        })
        //
        fetch("https://www.fxp.co.il/inlinemod.php", {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            method: "POST",
            body: new URLSearchParams({
                securitytoken: window.SECURITYTOKEN,
                postids: posts.join(','),
                t: threadid,
                do: "domoveposts",
                type: 1,
                mergethreadurl
            })
        })
            .then(_ => {
            alert('כל האשכולות הנעולים נוקו בהצלחה');
        })
            .catch(error => {
            alert('אופס משום מה ניב לא הצליח לבצע את הניקוי כמו שצריך ):');
            console.log('error', error);
        })
            .finally(location.reload)
    }
})
document.getElementById(selector).after(link);