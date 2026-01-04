// ==UserScript==
// @name         GeoGuessr Hide Party Link and Email Addresses
// @description  Blurs out party invite links and email addresses to prevent stream hacking or doxxing
// @version      1.2.0
// @author       victheturtle
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.svgrepo.com/show/110964/password.svg
// @grant        none
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452777/GeoGuessr%20Hide%20Party%20Link%20and%20Email%20Addresses.user.js
// @updateURL https://update.greasyfork.org/scripts/452777/GeoGuessr%20Hide%20Party%20Link%20and%20Email%20Addresses.meta.js
// ==/UserScript==

let style = document.createElement('style');
style.innerHTML = `
    .edit-profile__section div[class^="form-field_formField__"] div p, input[name="email"][data-qa="email-field"], input[name="repeatEmail"] {
        filter: blur(5px);
    }
    span[class^="copy-link_root__"] input {
        filter: blur(5px);
    }
    [class*='invite-modal_section__'] :nth-child(3) :nth-child(3) {
        filter: blur(10px);
    }
    [class*='invite-modal_qr__'] {
        filter: blur(8px);
    }
`;
document.body.append(style);
