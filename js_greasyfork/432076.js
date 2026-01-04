// ==UserScript==
// @name        Autologin - iitkgp.ac.in
// @namespace   Violentmonkey Scripts
// @match       https://erp.iitkgp.ac.in/SSOAdministration/login.htm
// @grant       GM_getValue
// @version     3.0
// @author      Siddhartha Sarkar
// @description 7/9/2021, 7:51:12 pm
// @require     https://unpkg.com/iitkgp-erp-auto-login-script@1.0.3/erpautologin.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/432076/Autologin%20-%20iitkgpacin.user.js
// @updateURL https://update.greasyfork.org/scripts/432076/Autologin%20-%20iitkgpacin.meta.js
// ==/UserScript==


/** 
 * @NOTE
 * PASTE THE BELOW OBJECT AFTER FILLING, TO VALUES ALL SECTION
{
  "credentials": {
    "username": "--YOUR-IITKGP-USERNAME-HERE--",
    "password": "--YOUR-IITKGP-PASSWORD-HERE--",
    "securityQuestions": {
      "--YOUR-QUESTION-1--": "--YOUR-ANSWER-TO-QUESTION-1--",
      "--YOUR-QUESTION-2--": "--YOUR-ANSWER-TO-QUESTION-2--",
      "--YOUR-QUESTION-3--": "--YOUR-ANSWER-TO-QUESTION-3--",
    }
  }
}
*/


async function login(){
let userData = await GM_getValue("credentials",{})
  let x = new ERP(userData.username);
  x.load(userData);
  let url = await x.login();
  location.href = url;
}


if(window.confirm("Do you want to login?")){
  login(GM_getValue("credentials"))
}



