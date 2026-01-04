/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         GBUjiraRemoveValues
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove Values from Status Dropdown. Testing Update
// @author       shasjha
// @match        https://gbujira.us.oracle.com/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oracle.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant    GM_addStyle
// @grant    GM.getValue
// @grant        window.onurlchange
// @require      http://code.jquery.com/jquery-latest.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451352/GBUjiraRemoveValues.user.js
// @updateURL https://update.greasyfork.org/scripts/451352/GBUjiraRemoveValues.meta.js
// ==/UserScript==
"use strict"

waitForKeyElements ("#type-val", gmMain);//mutationObservber for Type in Jira tasks

// var fireOnHashChangesToo= true;
// var pageURLCheckTimer= setInterval (
//     function () {
//         if (this.lastPathStr!== location.pathname
//             || this.lastQueryStr !== location.search
//             || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
//         ) {
//             this.lastPathStr= location.pathname;
//             this.lastQueryStr= location.search;
//             this.lastHashStr = location.hash;
//             gmMain ();
//         }
//     }
//     , 111
// );

 $(document).ready(function() {
     remove();

});

function remove(){
    var condition = true; //add a condition to check  only for bugs
    if(condition) {
        // let btn = document.getElementById("opsbar-transitions_more");
        // btn.addEventListener("click", function(){});

        let allOptions= $('#opsbar-transitions_more_drop aui-item-link');
        allOptions = Array.from(allOptions);
        console.log(allOptions);

        const conditionalStatus = ['11','17','25','80','84','91','92','93','96'];

        for(let option of allOptions){
            if(!conditionalStatus.some(val => option.innerText.includes(val))) {
                option.remove();
            }
        }
    }
}

function gmMain () {
    console.log ('A "New" page has loaded.');
    $(document).ready(function() {
    let type = $('#type-val').text();
    console.log(type);
    if(type.includes('Bug')){
        console.log("remove");
        remove();
    }
    return true;
});
}