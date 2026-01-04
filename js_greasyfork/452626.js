// ==UserScript==
// @name         Execute Helper
// @namespace    lugburz.execute_helper
// @version      0.1
// @description  Execute Helper Torn
// @author       Dzii [1040999] Coded by Lugburz
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @run-at       document-body
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452626/Execute%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452626/Execute%20Helper.meta.js
// ==/UserScript==

// Life percentage for execute (e.g., 0.15)
const PERC = 0.15;



const constantMock = unsafeWindow.fetch;
unsafeWindow.fetch = function() {
    return new Promise(async resolve => {
        const response = await constantMock.apply(this, arguments);
        if (response.url.indexOf('loader.php?sid=attackData&mode=json') > -1) {
            const text = await response.clone().text();
            try {
                const json = JSON.parse(text);
                setTimeout(() => {
                    if ($('#execute_life').size() < 1) {
                        $('#react-root').find('span[class^=userName]').eq(1).append('<span id="execute_life"></span>');
                    }
                    $('#execute_life').text(` 🪓 ${Math.floor(+json.DB.defenderUser.maxlife * PERC).toLocaleString('en-US')}`);
                }, 1000);
            } catch (e) {
                console.log(e);
            }
        }
        resolve(response);
    });
}
