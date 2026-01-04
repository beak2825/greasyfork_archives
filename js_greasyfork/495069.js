// ==UserScript==
// @name         Grundo's Cafe - Coconut Shy
// @namespace    https://www.grundos.cafe/
// @version      0.2
// @description  Records Coconut Shy stats
// @author       yon
// @match        *://*.grundos.cafe/halloween/coconutshy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @require      https://unpkg.com/gridjs/dist/gridjs.umd.js
// @downloadURL https://update.greasyfork.org/scripts/495069/Grundo%27s%20Cafe%20-%20Coconut%20Shy.user.js
// @updateURL https://update.greasyfork.org/scripts/495069/Grundo%27s%20Cafe%20-%20Coconut%20Shy.meta.js
// ==/UserScript==

var version = 0.2;

(async function() {
    'use strict';

    try {
        await interceptAndLogReward();
    } catch (error) {
        showError();

        throw error;
    }
})();

async function interceptAndLogReward() {
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        try {
            if (method === 'POST' && url.endsWith('/coconutshy/process/')) {
                this.addEventListener('load', async function() {
                    // Example: {"error": false, "text": "The Coconut Hardly Moved", "middle_text": "You won 50 points\n\nYour NP: 14,950", "win_type": 2, "avatar": false}
                    let responseObject = JSON.parse(this.responseText)
                    let error = responseObject['error'];
                    let text = responseObject['text'];
                    let middle_text = responseObject['middle_text'];
                    let win_type = responseObject['win_type'];
                    let avatar = responseObject['avatar'];
                    await logReward(error, text, middle_text, win_type, avatar);
                });
            }
        } catch (error) {
            console.log(error);
        }
        originalOpen.apply(this, arguments);
    };
}

async function logReward(error, text, middle_text, win_type, avatar) {
    let newReward = {'date': getDateString(), 'error': error, 'text': text, 'win_type': win_type, 'avatar': avatar};
    console.log(newReward);
    await sendReward(newReward);
}

function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

async function sendReward(newReward) {
    let username = $('div[id="userinfo"] a[href^="/userlookup/?user="]')[0].href.split('/?user=')[1];

    let formId = '1FAIpQLSdbVoHi7uXIMRiW-i-5hGdlj2kHxlns_sCiLMvqUuokpOK8bQ';
    const query = {
        "1350867233": version,
        "1534307698": newReward['date'],
        "1053758418": newReward['error'],
        "153236007": newReward['text'],
        "1844585292": newReward['win_type'],
        "1344427827": newReward['avatar'],
        "1550065838": username
    };
    let formLink = `https://docs.google.com/forms/d/e/${formId}/formResponse?usp=pp_url`;
    for (const [key, value] of Object.entries(query)) {
        formLink += `&entry.${key}=${value}`;
    }

    let opts = {
        mode: 'no-cors',
        referrer: 'no-referrer',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    let response = fetch(formLink, opts)
    .then(response => {
        console.log("Game data submitted");
    })
    .catch(error => {
        console.log("Error:", error);
        console.log(response)
    });
}
