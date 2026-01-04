// ==UserScript==
// @name         OC2RoleNumbers
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Add numbers to OC2 roles
// @author       Resh
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525931/OC2RoleNumbers.user.js
// @updateURL https://update.greasyfork.org/scripts/525931/OC2RoleNumbers.meta.js
// ==/UserScript==

// Fetch interception
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {

  let [resource, config] = args;

  let response = await originalFetch(resource, config);

  if (resource.includes("organizedCrimesData") && resource.includes("crimeList")) {
    console.log("OC2RoleNumbers script intercepted resource: " + resource)

    const text = () =>
      response
        .clone()
        .text()
        .then((data) => (transformResponseText(data)));

    response.text = text;
  }

  return response;
};

function transformResponseText(input_data) {
    try {
        let input_json = JSON.parse(input_data);

        if (input_json.success) {
            $.each(input_json.data, addRoleNames);
        }

        return JSON.stringify(input_json);
    } catch(e) {
        console.log("error transforming intercepted response, returning original");
        console.log(e);
        return input_data;
    }
}


function addRoleNames(i, crime_info) {
    // adding player keys to role names
    $.each(crime_info.playerSlots, function(j, player_hash){
        player_hash.name = `${player_hash.key[1]} - ${player_hash.name}`;
    });
}
