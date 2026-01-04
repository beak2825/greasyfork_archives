// ==UserScript==
// @name         Tony Keller template
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  One-click method to create a folder using Tony Keller template
// @author       You
// @match        https://secure.tgam.arcpublishing.com/composer/story?template=08cadf21-31c4-4873-ae68-4744e73d7c6d
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @licence      GPL3
// @downloadURL https://update.greasyfork.org/scripts/468935/Tony%20Keller%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/468935/Tony%20Keller%20template.meta.js
// ==/UserScript==

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function init(){

    await delay(1000);

var today = new Date();
var dd = String(today.getDate()+1).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');

today = mm + dd;

document.querySelector('input#slug').value = 'rb-co-keller-' + today;
document.querySelector('.btn.btn-primary.mr-1.ng-binding').click();
}

init();