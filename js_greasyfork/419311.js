// ==UserScript==
// @name         Improved AWS Console SAML Sign-In
// @namespace    http://mikebranski.com/
// @version      1.0.1
// @description  A cleaner AWS Console SAML sign-in page! Useful for individuals who manage dozens of accounts.
// @author       Mike Branski (@mikebranski)
// @match        https://signin.aws.amazon.com/saml
// @grant        none
// @homepage     https://github.com/mikebranski/userscripts
// @downloadURL https://update.greasyfork.org/scripts/419311/Improved%20AWS%20Console%20SAML%20Sign-In.user.js
// @updateURL https://update.greasyfork.org/scripts/419311/Improved%20AWS%20Console%20SAML%20Sign-In.meta.js
// ==/UserScript==

// This wasn't written to be pretty or fast - I just wanted my eyes to stop 
// bleeding when I scrolled through over 50 accounts every time I signed in. :)

(function() {
    'use strict';

    const log = (...message) => {
        console.log('[IAWSC]', ...message);
    };

    let style_el = document.createElement('style');
    style_el.type = 'text/css';

    const new_styles = `
.form-title {
    font-size: 22px;
    text-transform: capitalize;
}

fieldset > .saml-account {
    display: flex;
    margin-left: 20px;
    margin-bottom: 0;
    padding-left: 0;
}

.saml-account + .saml-account {
    margin-top: 10px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
}

.saml-account hr {
    display: none;
}

fieldset > .saml-account > div:first-child {
    flex: 2;
}

.saml-account .account-number {
    color: #ababab;
    font-size: 0.75em;
}

.saml-account img {
    display: none;
}

.saml-account .saml-account {
    flex: 1;
    margin-bottom: 0;
    margin-left: 0;
}

.saml-role {
    margin: 10px 0 0;
}

.saml-role:first-child {
    margin-top: 0;
}
`;

    if (style_el.styleSheet) {
        style_el.styleSheet.cssText = new_styles;
    } else {
        style_el.appendChild(document.createTextNode(new_styles));
    }

    document.getElementsByTagName('head')[0].appendChild(style_el);

    const form_el = document.querySelector('form#saml_form');
    const accounts_container_el = form_el.querySelector('fieldset');
    const saml_accounts_els = accounts_container_el.querySelectorAll(':scope > .saml-account');
    const account_name_pattern = /(Account: )(.+)\((\d+)\)/;

    const form_title_el = form_el.querySelector(':scope > p');
    form_title_el.removeAttribute('style');
    form_title_el.classList.add('form-title');
    form_title_el.textContent = form_title_el.textContent.replace(':', '');

    for (const saml_account_el of saml_accounts_els) {
        const account_name_el = saml_account_el.querySelector('.saml-account-name');

        const account_pieces = account_name_el.textContent.match(account_name_pattern);

        account_name_el.textContent = account_pieces[2];

        let account_number_el = document.createElement('span');
        account_number_el.classList.add('account-number');
        account_number_el.textContent = `#${account_pieces[3]}`;
        account_name_el.appendChild(account_number_el);
    }
})();
