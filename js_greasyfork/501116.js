// ==UserScript==
// @name        CSN Odoo Enhanced Functionality
// @namespace   http://tampermonkey.net/
// @version     4.2
// @description Combines phone number hyperlinks, email copying, and name copying functionalities for CSN Odoo
// @match       https://csnodoo.shopcsntv.com/*
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @require     https://kit.fontawesome.com/YOUR_KIT_ID.js
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/501116/CSN%20Odoo%20Enhanced%20Functionality.user.js
// @updateURL https://update.greasyfork.org/scripts/501116/CSN%20Odoo%20Enhanced%20Functionality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isCurrentlyActive = false;
    let domObserver;

    function isResPartnerPage() {
        return window.location.href.includes('/web') &&
               window.location.href.includes('model=res.partner') &&
               window.location.href.includes('view_type=form');
    }

    function activateScript() {
        if (isCurrentlyActive) return;
        isCurrentlyActive = true;
        console.log("Activating script");

        // Add Font Awesome styles and custom CSS
        GM_addStyle(`
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css');
            .copy-icon, .email-copy-icon {
                cursor: pointer;
                position: relative;
                display: inline-block;
            }
@media (min-width: 1534px) {
    .o_form_view > .o_form_sheet_bg {
        overflow: auto;
        scrollbar-width: none;
    }
}
            a.o_field_email {
                margin: 0px !important;
            }
            button.btn.btn-sm.btn-link.mb4.fa.fa-envelope-o {
                visibility: hidden;
                width: 0;
            }
            .o_field_image.o_field_widget.oe_avatar {
                visibility: hidden;
                height: 0px;
                width: 0px;
            }
            .oe_kanban_details i.fa-copy, .oe_kanban_details i.fa-phone-slash {
                visibility: hidden;
                width: 0;
            }
            div.o_facet_values i.fas.fa-phone-slash {
                visibility: hidden;
                font-size: 0px;
            }
            div.o_facet_values i.fas.fa-copy {
                visibility: hidden;
                font-size: 0px;
            }
            h1 span.copy-icon i.fas.fa-copy {
                font-size: 18px;
                padding-bottom: 4px;
                padding-left: 5px;
            }
            h1 span.copy-icon {
                padding-left: 10px;
            }
            i.fas.fa-copy {
                font-size: 13px;
                vertical-align: middle;
            }
            div.o_row span.copy-icon {
                padding-right: 8px;
            }
            span.tooltiptext {
                font-size: 12px;
            }
            span.email-copy-icon {
                padding-right: 5px;
                padding-right: 5px;
            }
            .copy-icon .tooltiptext, .email-copy-icon .tooltiptext {
                visibility: hidden;
                width: 140px;
                background-color: #555;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px;
                position: absolute;
                z-index: 1;
                bottom: 125%;
                left: 50%;
                margin-left: -70px;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .copy-icon .tooltiptext::after, .email-copy-icon .tooltiptext::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #555 transparent transparent transparent;
            }
            .copy-icon:hover .tooltiptext, .email-copy-icon:hover .tooltiptext {
                visibility: visible;
                opacity: 1;
            }
        `);

        // Initial run
        addCopyIconToNameSpans();
        updateButtonClass();
        observeDOMChanges();
    }

    function deactivateScript() {
        if (!isCurrentlyActive) return;
        isCurrentlyActive = false;
        console.log("Deactivating script");

        if (domObserver) {
            domObserver.disconnect();
        }
        // Additional cleanup if necessary
    }

    function formatPhoneNumber(phoneNumberString) {
        return phoneNumberString;
    }

    function isValidPhoneNumber(str) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
        return phoneRegex.test(str);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function createAnonymousPhoneLink(phoneNumber) {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const phoneLink = document.createElement('a');
        phoneLink.href = 'tel:*67' + formattedNumber;
        phoneLink.style.textDecoration = 'none';
        phoneLink.innerHTML = '<i class="btn-link fas fa-phone-slash"></i>';
        phoneLink.title = 'Call with *67';
        phoneLink.setAttribute('aria-label', 'Anonymous Call');
        phoneLink.style.marginLeft = '10px';
        return phoneLink;
    }

    function createCopyIcon(text, isEmail = false) {
        const copyIcon = document.createElement('span');
        copyIcon.className = isEmail ? 'email-copy-icon' : 'copy-icon';
        copyIcon.innerHTML = '<i class="btn-link fas fa-copy"></i>';
        copyIcon.setAttribute('aria-label', `Copy ${isEmail ? 'email' : 'text'}`);
        const tooltipSpan = document.createElement('span');
        tooltipSpan.className = 'tooltiptext';
        tooltipSpan.textContent = 'Copy to clipboard';
        copyIcon.appendChild(tooltipSpan);
        copyIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(text, tooltipSpan);
        });
        return copyIcon;
    }

    function copyToClipboard(text, tooltipElement) {
        let formattedText = text;

        // Replace multiple spaces with a single space
        formattedText = formattedText.replace(/\s+/g, ' ');

        if (isValidPhoneNumber(text)) {
            formattedText = formatPhoneNumber(text);
        }

        navigator.clipboard.writeText(formattedText).then(() => {
            console.log('Text copied to clipboard:', formattedText);
            tooltipElement.textContent = 'Copied!';
            setTimeout(() => {
                tooltipElement.textContent = 'Copy to clipboard';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            tooltipElement.textContent = 'Failed to copy';
            setTimeout(() => {
                tooltipElement.textContent = 'Copy to clipboard';
            }, 2000);
        });
    }

    function convertToClickableLink(element) {
        const spanContent = element.textContent.trim();
        if (isValidPhoneNumber(spanContent)) {
            const container = document.createElement('span');
            const copyIcon = createCopyIcon(spanContent);
            const phoneText = document.createTextNode(spanContent);
            const anonymousPhoneLink = createAnonymousPhoneLink(spanContent);
            container.appendChild(copyIcon);
            container.appendChild(phoneText);
            container.appendChild(anonymousPhoneLink);
            element.parentNode.replaceChild(container, element);
        }
    }

    function addEmailCopyIcon(emailLink) {
        const emailAddress = emailLink.textContent.trim();
        if (isValidEmail(emailAddress) &&
            (!emailLink.previousElementSibling || !emailLink.previousElementSibling.classList.contains('email-copy-icon'))) {
            const copyIcon = createCopyIcon(emailAddress, true);
            emailLink.parentNode.insertBefore(copyIcon, emailLink);
        }
    }

    function addCopyIconToNameSpans() {
        const nameSpans = document.querySelectorAll('span[class="o_field_char o_field_widget o_required_modifier"]');
        nameSpans.forEach(span => {
            const nameText = span.textContent.trim();
            if (nameText && !span.nextElementSibling?.classList.contains('copy-icon')) {
                const copyIcon = createCopyIcon(nameText);
                span.parentNode.insertBefore(copyIcon, span.nextSibling);
            }
        });
    }

    function updateButtonClass() {
        const buttons = document.querySelectorAll('button[name="cloudcti_open_outgoing_notification"]');
        buttons.forEach(button => {
            if (button.classList.contains('mb4')) {
                button.classList.remove('mb4');
            }
        });
    }

    function observeDOMChanges() {
        domObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const spans = node.querySelectorAll('span');
                            spans.forEach(convertToClickableLink);
                            const emailLinks = node.querySelectorAll('a.o_field_email');
                            emailLinks.forEach(addEmailCopyIcon);
                            const nameSpans = node.querySelectorAll('span[class="o_field_char o_field_widget o_required_modifier"]');
                            nameSpans.forEach(span => {
                                const nameText = span.textContent.trim();
                                if (nameText && !span.nextElementSibling?.classList.contains('copy-icon')) {
                                    const copyIcon = createCopyIcon(nameText);
                                    span.parentNode.insertBefore(copyIcon, span.nextSibling);
                                }
                            });
                            updateButtonClass();
                        }
                    });
                }
            });
        });
        domObserver.observe(document.body, { childList: true, subtree: true });
    }

    function checkAndToggleScript() {
        if (isResPartnerPage()) {
            activateScript();
        } else {
            deactivateScript();
        }
    }

    // Initial check
    checkAndToggleScript();

    // Set up a MutationObserver to watch for URL changes
    const urlObserver = new MutationObserver(() => {
        checkAndToggleScript();
    });

    urlObserver.observe(document.body, { childList: true, subtree: true });

    // Additionally, listen for 'popstate' events
    window.addEventListener('popstate', checkAndToggleScript);
})();