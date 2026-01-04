// ==UserScript==
// @name         Always add docs.rs link
// @namespace    https://alexanderschroeder.net/
// @version      0.2
// @description  This script modifies crate overview pages on crates.io such that if the documentation link isn't to docs.rs, it inserts one that is next to it
// @author       Alexander Krivács Schrøder
// @include      https://crates.io/crates/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crates.io
// @grant        none
// @license      MIT OR Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/450970/Always%20add%20docsrs%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/450970/Always%20add%20docsrs%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectDocsrsLink() {
        // Grab the existing documentation link
        const documentation_link_container = getDocumentationLinkContainer();
        if (!documentation_link_container) {
            return;
        }
        const docs_link = documentation_link_container.children[1];

        // If it's already a docs.rs link, we don't need to do anything else
        if (!docs_link.href.startsWith('https://docs.rs/')) {
            // Grab the crate name from the URL
            const crate_name = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            // Create our own documentation link container, adding the class from the existing one for
            // proper styling
            const docsrs_documentation_link_container = document.createElement('div');
            docsrs_documentation_link_container.classList.add(documentation_link_container.classList[0]);

            // Insert the docs.rs icon
            docsrs_documentation_link_container.appendChild(DOCSRS_LINK_SVG_ELEMENT);

            // Create the docs.rs link
            const docsrs_link = document.createElement('a');
            docsrs_link.href = `https://docs.rs/${crate_name}/latest`;
            docsrs_link.innerHTML = `docs.rs/${crate_name}/latest`;
            docsrs_documentation_link_container.appendChild(docsrs_link);

            // Insert our custom docs.rs link into the document. We're done!
            documentation_link_container.insertAdjacentElement('afterend', docsrs_documentation_link_container);
        }
    }

    function waitForPageToBeReady() {
        if (document.querySelectorAll('h3').length) {
            console.debug(document.querySelectorAll('h3').length);
            setDocsrsLinkSvgElement();
            injectDocsrsLink();
        } else {
            window.setTimeout(waitForPageToBeReady, 250);
        }
    }

    // Because this is a SPA, there's no actual elements in the document when we start running.
    // Since what we do depends on the document being present, we'll wait in a loop until things
    // have settled down.
    waitForPageToBeReady();

    function getDocumentationLinkContainer() {
        const h3s = Array.from(document.querySelectorAll('h3'));
        const documentation_h3 = h3s.filter((v) => v.innerHTML === 'Documentation')[0];
        return documentation_h3 ? documentation_h3.nextElementSibling : null;
    }

    // Holds a ready-made docs.rs icon SVG element
    let DOCSRS_LINK_SVG_ELEMENT = null;

    function setDocsrsLinkSvgElement() {
        // Create SVG element based on SVG from crates.io
        const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="currentColor"><path d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"></path></svg>`
        const template = document.createElement('template');
        template.innerHTML = markup;
        const element = template.content.firstChild;

        // Copy the class from the existing icon onto ours for proper styling
        const documentation_link_container = getDocumentationLinkContainer();
        if (!documentation_link_container) {
            return;
        }
        const docs_icon = documentation_link_container.children[0];
        element.classList.add(docs_icon.classList[0]);

        DOCSRS_LINK_SVG_ELEMENT = element;
    }
})();
