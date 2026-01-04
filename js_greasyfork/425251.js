// ==UserScript==
// @name         BensMailTo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix for Benjamin. Change mail link to 'mailto:' format.
// @author       Fabian Zietkiewicz
//               Fabianziet@gmail.com
// @match        *://*.mathematik.tu-dortmund.de/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425251/BensMailTo.user.js
// @updateURL https://update.greasyfork.org/scripts/425251/BensMailTo.meta.js
// ==/UserScript==

//console.log('[INIT] Script.JS');

convertToMailto();

function convertToMailto(){
    let mail_elements = document.getElementsByClassName("email_link")
    let mail_count = mail_elements.length;

    if(mail_count){
        editMailLink(mail_elements, mail_count);
    }
}

function editMailLink(mail_list, count){
    //console.log('   [INFO] Executing EDIT');

    // for each mail element
    for (let i = 0; i < count; i++) {
        let old_link = String(mail_list[i].attributes.href.value);
        let new_link = 'mailto:';
        const template = 'http://www.mathematik.tu-dortmund.de/email.php?u=';

        if (old_link.length > 7 && containsTemplate(old_link, template)){
            let old_mail = old_link.split(template)[1];
            new_link += old_mail.replace('&d=', '@');
            mail_list[i].attributes.href.value = new_link;
        }
    }
}

function containsTemplate(link, template){
    return link.indexOf(template) >= 0 ? true : false;
}