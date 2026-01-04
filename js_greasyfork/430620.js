// ==UserScript==
// @name         AWS-SSO-Console-User-Title-Fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  With AWS SSO the AWS Console Title is ridiculously long, this aims to shorten and list the account name
// @author       John Polansky
// @icon         https://www.google.com/s2/favicons?domain=userscript.zone
// @include      https://console.aws.amazon.*
// @include      https://*.console.aws.amazon.*
// @run-at       document-end
// @inject-into content
// @license      MIT
// @noframes
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/430620/AWS-SSO-Console-User-Title-Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/430620/AWS-SSO-Console-User-Title-Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // console.log("======================================================")
    // The ClassName might change with updates, find the title in inspect and replace it here
    // let str = document.getElementsByClassName("ThRjn7o-KwO0459UzmvoU")[0].title
    let str = document.getElementsByClassName("_1Vtx1Z7gxtNZJP2MVzVCLO")[2].title
    // console.log(`Element: ${str})
    // AWSReservedSSO_AWSAdministratorAccess_ca3eaf088602997d/john.polansky@itential.com @ itential-cloudops
    let re = /\w+_(\w+)_(\w+)\/(.*)\s+@\s+(.+)/
    let results = re.exec(str)
    let role = results[1]
    let username = results[3].replace(/@.*$/, "")
    let account = results[4]
    // console.log(`Username: ${username}  Account: ${account}  Role: ${role}`)
    // console.log("======================================================")
    document.getElementsByClassName("_1Vtx1Z7gxtNZJP2MVzVCLO")[2].innerHTML = `${account} / ${role} / ${username}`
})();
