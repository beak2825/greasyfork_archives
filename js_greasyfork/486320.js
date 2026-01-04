// ==UserScript==
// @name        Faction Members clipboard
// @namespace   mafia.membersheet
// @author      Mafia[610357]
// @description get list members of current view faction page to paste in google sheet
// @license     MIT
// @include     https://www.torn.com/factions.php*
// @supportURL  https://greasyfork.org/en/scripts/470949/feedback
// @version     1.0.0
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/486320/Faction%20Members%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/486320/Faction%20Members%20clipboard.meta.js
// ==/UserScript==

var cbmembers = []

// REQUEST & RESPONSE INTERCEPTOR
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await originalFetch(resource, config);
    const json = () => response.clone().json()
                      .then((data) => {
                        data = { ...data };

                        return data
                      })

    response.json = json;
    response.text = async () =>JSON.stringify(await json());

    if(response.url.indexOf('page.php?sid=factionsProfile') != -1) {
        response.json().then( r => factionInfo(r))
    }
    return response;
};

factionInfo = function(r) {
    cbmembers = r.members.map( m => ([`${m.userID}\t${m.playername}\t${m.level}`]))

}



hotkeys('alt+g', function (event, handler){
    switch (handler.key) {
      // Click Checkout @ Cart Page
      case 'alt+g':
            GM_setClipboard(cbmembers.join('\n'), 'text')
            alert('Member list copied to clipboard. Paste to spreadsheet')
        break;
    }
  });