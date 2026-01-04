// ==UserScript==
// @name         CDB Approval
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script to auto approve CDB requests
// @author       Karla Gullon
// @match        https://cdb.simprocloud.com/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simprocloud.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506545/CDB%20Approval.user.js
// @updateURL https://update.greasyfork.org/scripts/506545/CDB%20Approval.meta.js
// ==/UserScript==
const loop = 1000; // 1000 per sec
const checkApproval = () => { 
    const approveBtns = $('#buildAccessRequests a.access-request-action[data-action="1"]');
    if (approveBtns.length > 0) {
        const id = $(approveBtns[0]).data('request-id');
        const user = $(`tr#requestAccess-${id}`).find('td')[0];
        const build = $(`tr#requestAccess-${id}`).find('td')[1];
        approveBtns[0].click();
        console.log(`approved | ${user.innerHTML} | ${build.innerHTML}`);
    } // else console.log('nothing to approve');
};
const timer = setInterval(checkApproval, loop);