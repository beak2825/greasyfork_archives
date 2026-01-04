// ==UserScript==
// @name         Wix Order E-mail Link
// @namespace    http://hierosoft.com/
// @version      2025.9.2
// @description  Generate a mailto link with order# in subject.
// @author       Hierosoft (Jake Gustafson)
// @match        https://manage.wix.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518510/Wix%20Order%20E-mail%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/518510/Wix%20Order%20E-mail%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User preferences
    const subject_template = "Warranty Order {order_number}";
    const link_text = "Warranty E-mail";

    // Must match to all of manage.wix.com not just https://manage.wix.com/*order-details*,
    //   otherwise the script will never run (if you started a different url like
    //   <https://manage.wix.com/dashboard/*/ecom-platform/orders-list/?*> the
    //   page is never reloaded, since Wix is an SPA, so new URL is never detected).

    const EMAIL_SEL  = 'span[data-hook="InfoCard__UserEmail"]';
    const TITLE_SEL  = 'div[data-hook="HeaderTitle__TitleText"]';

    let currentEmailEl = null;
    let emailObs = null;
    let titleObs = null;

    function getOrderNumber() {
        const header = document.querySelector(TITLE_SEL);
        if (!header) return "";
        return header.textContent.replace(/^Order\s+/i, "").trim();
    }

    function ensureLink(emailEl) {
        if (!emailEl || !emailEl.parentElement) return;

        const parent = emailEl.parentElement;

        // Find or create our dedicated link (and <br>) using a data marker
        let link = parent.querySelector('a[data-gm-mailto="1"]');
        let br   = parent.querySelector('br[data-gm-mailto="1"]');

        // Compute the live values from the exact fields we observe
        const to = (emailEl.textContent || "").trim();
        const subject = subject_template.replace("{order_number}", getOrderNumber());

        if (!link) {
            // Build the link once
            link = document.createElement('a');
            link.dataset.gmMailto = "1";
            link.style.fontFamily =
                '"Madefor","Helvetica Neue",Helvetica,Arial,Meiryo,sans-serif';

            // Icon image (1em) + nbsp + visible text
            const img = document.createElement('img');
            img.src = "https://upload.wikimedia.org/wikipedia/commons/c/c0/Tampermonkey_logo.svg";
            img.alt = "";
            img.style.width = "1em";
            img.style.height = "1em";
            img.style.verticalAlign = "middle";

            const nbsp = document.createTextNode('\u00A0');

            link.appendChild(img);
            link.appendChild(nbsp);
            link.appendChild(document.createTextNode(link_text));

            // Add a dedicated <br> before the link (only once)
            br = document.createElement('br');
            br.dataset.gmMailto = "1";

            parent.appendChild(br);
            parent.appendChild(link);

            // Add the "disable for 2s after click" behavior
            link.addEventListener('click', (e) => {
                e.preventDefault(); // prevent double-open
                const href = link.href;

                // Disable temporarily
                link.removeAttribute('href');
                link.style.opacity = "0.5";
                link.style.pointerEvents = "none";

                // Open mailto manually
                window.location.href = href;

                setTimeout(() => {
                    link.href = href;
                    link.style.opacity = "1";
                    link.style.pointerEvents = "auto";
                }, 2000);
            });
        }

        // Always update href from the *current* DOM values
        link.href = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
    }

    function attachObservers() {
        const el = document.querySelector(EMAIL_SEL);
        if (!el || el === currentEmailEl) return;

        // Disconnect previous watchers (if any)
        if (emailObs) emailObs.disconnect();
        if (titleObs) titleObs.disconnect();

        currentEmailEl = el;

        // Prime the link immediately with the current values
        ensureLink(currentEmailEl);

        // Observe the exact email span for any text/child changes
        emailObs = new MutationObserver(() => ensureLink(currentEmailEl));
        emailObs.observe(currentEmailEl, {
            characterData: true,
            childList: true,
            subtree: true
        });

        // Also observe the exact title node (order number) for changes
        const titleEl = document.querySelector(TITLE_SEL);
        if (titleEl) {
            titleObs = new MutationObserver(() => ensureLink(currentEmailEl));
            titleObs.observe(titleEl, {
                characterData: true,
                childList: true,
                subtree: true
            });
        }
    }

    // Re-attach observers whenever the SPA swaps screens/nodes
    const rootObs = new MutationObserver(attachObservers);
    rootObs.observe(document.body, { childList: true, subtree: true });

    // Run once at start
    attachObservers();

    // Be extra safe: re-run when history state changes within the SPA
    window.addEventListener('popstate', attachObservers);
    window.addEventListener('hashchange', attachObservers);
})();
