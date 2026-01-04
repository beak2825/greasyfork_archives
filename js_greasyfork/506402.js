// ==UserScript==
// @name            Stats Page - Fetch and Post Usernames
// @namespace       http://tampermonkey.net/
// @version         1.2.3
// @description     Fetch user IDs and corresponding usernames, then POST them to a server
// @match           https://txt.altervista.org/cw/stats/
// @match           http://localhost/txt/cw/stats/
// @grant           GM_xmlhttpRequest
// @run-at          document-start
// @icon            https://www.google.com/s2/favicons?sz=64&domain=txt.altervista.org

// @downloadURL https://update.greasyfork.org/scripts/506402/Stats%20Page%20-%20Fetch%20and%20Post%20Usernames.user.js
// @updateURL https://update.greasyfork.org/scripts/506402/Stats%20Page%20-%20Fetch%20and%20Post%20Usernames.meta.js
// ==/UserScript==

(async function() {
    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: r => r.status < 300 ? resolve(JSON.parse(r.responseText)) : reject(r.statusText),
                onerror: () => reject('Network error')
            });
        });
    }

    function postForm(url, data) {
        const params = new URLSearchParams(data).toString();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                onload: r => r.status < 300 ? resolve(r.responseText) : reject(r.statusText),
                onerror: () => reject('Network error')
            });
        });
    }

    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: r => {
                    if (r.status < 300) {
                        const doc = new DOMParser().parseFromString(r.responseText, 'text/html');
                        const h1 = doc.querySelector('h1');
                        h1 ? resolve(h1.textContent.replace("'s Page", "").trim()) : reject('No <h1> tag found');
                    } else {
                        reject(r.statusText);
                    }
                },
                onerror: () => reject('Network error')
            });
        });
    }

    try {
        const { userIds } = await fetchData('https://txt.altervista.org/cw/scripts/usernames.php');
        for (let i = userIds.length - 1; i >= 0; i--) {
            const username = await fetchPage(`https://www.camwhores.tv/members/${userIds[i]}/`);
            await postForm('https://txt.altervista.org/cw/scripts/usernames.php', { id: userIds[i], username: username });
        }
    } catch (error) {
        console.error('Error:', error);
    }

})();
