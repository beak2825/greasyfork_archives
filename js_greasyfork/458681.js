// ==UserScript==
// @name        auto login - taskcards.de
// @namespace   Violentmonkey Scripts
// @match       https://www.taskcards.de/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      jside
// @description saves passwords to local storage skips future login form by modifying accesses request
// @downloadURL https://update.greasyfork.org/scripts/458681/auto%20login%20-%20taskcardsde.user.js
// @updateURL https://update.greasyfork.org/scripts/458681/auto%20login%20-%20taskcardsde.meta.js
// ==/UserScript==

//Passwords are saved in plain text (using GM_setValue) but should not be accessible outside of the script's environment ;-)


function getBoardUuid(){
  let url = location.href;
  let start = url.search("board/") + 6; // len of "board/"
  if (start == 5) { //if not found
    return "";
  }
  return url.slice(start, start + 36); // 36 is uuid length with '-'
};


const { fetch: originalFetch } = window; // get original fetch function

unsafeWindow.fetch = async (...args) => { // replace window.fetch function
  let [resource, config ] = args;

  if (resource.endsWith("/accesses")) {
    let uuid = getBoardUuid();
    let pass = JSON.parse(config.body).password; // get supplied pass
    let savedPass = GM_getValue(uuid, '');

    if (pass == "" && savedPass != "") { // if no password given check if we have one
      config.body = JSON.stringify({
      password: savedPass
      })
    }
    else {
      if (pass != savedPass){
        var dialog = confirm("Do you want to save the (new) password");
        if (dialog) {
          GM_setValue(uuid, pass);
        }
        else {
          console.log('Data Not Saved');
        }
      }
    }
  }
  // request interceptor here
  const response = await originalFetch(resource, config);
  // response interceptor here
  return response;
};