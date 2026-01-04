// ==UserScript==
// @name         המשרתת של צוות תמיכה
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  תוסף עזר לאחראי צוות תמיכה
// @author       Muffin24
// @match        *://www.fxp.co.il/forumdisplay.php?f=18
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/418564/%D7%94%D7%9E%D7%A9%D7%A8%D7%AA%D7%AA%20%D7%A9%D7%9C%20%D7%A6%D7%95%D7%95%D7%AA%20%D7%AA%D7%9E%D7%99%D7%9B%D7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/418564/%D7%94%D7%9E%D7%A9%D7%A8%D7%AA%D7%AA%20%D7%A9%D7%9C%20%D7%A6%D7%95%D7%95%D7%AA%20%D7%AA%D7%9E%D7%99%D7%9B%D7%94.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_registerMenuCommand('צור סטטיסטיקה', 'tfx()', 'H');
    const target = document.querySelector('head') || document.body || document.documentElement;
    target.appendChild(Object.assign(document.createElement('script'), {
        type: "text/javascript", textContent: tfx.toString()
    }));

    async function tfx() {
        const fetchResponse = async (user, forum, days = 7) => {
                const res = await fetch(`https://www.fxp.co.il/search.php?search_type=1&contenttype=vBForum_Post&searchuser=${user}&childforums=0&exactname=1&replyless=0&searchdate=${days}&beforeafter=after&starteronly=0&showposts=1&${forum ? 'forumchoice[]='+forum : ''}&do=process`);
                const text = await res.text()
                const match = text.match(/מציג תוצאות \d+ עד \d+ מתוך סך הכל של (\d+)/)
                return match ? +match[1] : 0;
            },
            getActiveThreads = async (forum, page = 1, active = 0, days = 7) => {
                const res = await fetch(`https://www.fxp.co.il/forumdisplay.php?f=${forum}&page=${page}&pp=200&daysprune=${days}`);
                const text = await res.text()
                const doc = new DOMParser().parseFromString(text, "text/html")
                const len = doc.querySelectorAll('#threads .threadbit').length
                active += len;
                if (len === 200) return getActiveThreads(forum, page + 1, active)
                return active;
            },
            username = document.querySelector('.log_in6 a').text,
            forums = { 18: [], 1510: [], 1511: [], 1514: [], 4723: [] },
            usernames = [...document.querySelectorAll('.blueuser')].map(element => element.textContent),
            messagesArray = await Promise.all(Object.keys(forums).flatMap(forumid => usernames.map(username => fetchResponse(username, forumid)))),
            activesArray = await Promise.all(Object.keys(forums).flatMap(forumid => getActiveThreads(forumid)));
        let index = 0;
        Object.keys(forums).forEach(id => usernames.forEach(username => forums[id].push({
            username, messages: messagesArray[index++]
        })))
        window.open('http://fxptest.000webhostapp.com/masov.html?o=' + JSON.stringify(forums) + '&u=' + username + '&a=' + JSON.stringify(activesArray))
    }
})();