// --------------------------------------------------------------------
//
// ==UserScript==
// @name            Weibo Password Remembering
// @description     Removes autocomplete="off" attributes
// @match           *://weibo.com/login*
// @version         1.0
// @namespace https://greasyfork.org/users/178613
// @downloadURL https://update.greasyfork.org/scripts/40384/Weibo%20Password%20Remembering.user.js
// @updateURL https://update.greasyfork.org/scripts/40384/Weibo%20Password%20Remembering.meta.js
// ==/UserScript==

var allow_auto_complete = function(element) {
    var usernames = document.getElementById('loginname');
    usernames.autocomplete = 'on';
    var password = document.getElementsByName('password');
    password = password[0];
    password.autocomplete = 'on';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function do_the_job() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two second later');
  allow_auto_complete();
}

do_the_job();