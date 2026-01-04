// ==UserScript==
// @name         Hírstart Admin - Forrás zóna szerkesztő - leggyakoribb beállítások
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @version      2.31
// @description  link ikonok site-0 (page) és site-rss (rss) alatti boxokhoz + partner-link a title-re
// @match        https://admin.hirstart.hu/?open_panel=source_zone_editor&id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536321/H%C3%ADrstart%20Admin%20-%20Forr%C3%A1s%20z%C3%B3na%20szerkeszt%C5%91%20-%20leggyakoribb%20be%C3%A1ll%C3%ADt%C3%A1sok.user.js
// @updateURL https://update.greasyfork.org/scripts/536321/H%C3%ADrstart%20Admin%20-%20Forr%C3%A1s%20z%C3%B3na%20szerkeszt%C5%91%20-%20leggyakoribb%20be%C3%A1ll%C3%ADt%C3%A1sok.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---- Új CSS injektálása a partner-linkhez ----
    const style = document.createElement('style');
    style.textContent = `
        a.partner-link {
            padding: 2px 4px;
            background: rgb(0, 123, 255);
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
            font-family: system-ui;
            font-weight: normal;
            text-decoration: none;
        }
    `;
    document.head.appendChild(style);
    // ----------------------------------------------

    //------------------------------------------------------------------
    // Segédfüggvények (mint korábban)
    //------------------------------------------------------------------

    function getLiDepth(elem) {
        let depth = 0;
        while (elem) {
            if (elem.tagName && elem.tagName.toUpperCase() === 'LI') {
                depth++;
            }
            elem = elem.parentElement;
        }
        return depth;
    }

    function insertLinkIcon(div, linkHref) {
        if (div.querySelector('.custom-zone-link') || div.classList.contains('x-tree-node-disabled')) {
            return;
        }
        let liParent = div.closest('li');
        if (!liParent || getLiDepth(liParent) < 3) {
            return;
        }
        const a = document.createElement('a');
        a.classList.add('custom-zone-link');
        a.href = linkHref;
        a.target = '_blank';
        a.textContent = '🔗';
        a.style.display = 'inline-block';
        a.style.verticalAlign = 'middle';
        a.style.marginRight = '4px';
        a.style.textDecoration = 'none';
        a.style.position = 'relative';
        a.style.zIndex = '9999';
        a.style.pointerEvents = 'auto';
        a.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            window.open(a.href, '_blank');
        }, true);

        let anchor = div.querySelector('a.x-tree-node-anchor');
        if (anchor) {
            anchor.parentNode.insertBefore(a, anchor);
        } else {
            div.insertBefore(a, div.firstChild);
        }
    }

    //------------------------------------------------------------------
    // 1) SITE-0 -> page -> box
    //------------------------------------------------------------------
    function processSite0(zonePanel) {
        const site0Div = zonePanel.querySelector('div[ext\\:tree-node-id="site-0"]');
        if (!site0Div) return;
        const site0Li = site0Div.closest('li');
        if (!site0Li) return;

        // Minden "page-xxx" div
        const pageDivs = site0Li.querySelectorAll('div[ext\\:tree-node-id^="page-"]');
        pageDivs.forEach(pageDiv => {
            const pageAttr = pageDiv.getAttribute('ext:tree-node-id');
            const pageId = pageAttr.replace('page-', '');
            const pageLi = pageDiv.closest('li');
            if (!pageLi) return;

            // Minden zóna (box) ami NEM "page-...", "site-..." vagy "rss-..."
            const zoneDivs = pageLi.querySelectorAll(
                'div[ext\\:tree-node-id]:not([ext\\:tree-node-id^="page-"]):not([ext\\:tree-node-id^="site-"]):not([ext\\:tree-node-id^="rss-"])'
            );
            zoneDivs.forEach(zoneDiv => {
                const zoneId = zoneDiv.getAttribute('ext:tree-node-id');
                const linkHref = `https://sky.p24.hu/d/6r6f0wTHk/leggyakoribb-doboz-beallitasok?orgId=3&var-page=${pageId}&var-box=${zoneId}`;
                insertLinkIcon(zoneDiv, linkHref);
            });
        });
    }

    //------------------------------------------------------------------
    // 2) SITE-RSS -> rss-<pid> -> numeric box
    //------------------------------------------------------------------
    function processSiteRss(zonePanel) {
        const siteRssDiv = zonePanel.querySelector('div[ext\\:tree-node-id="site-rss"]');
        if (!siteRssDiv) return;
        const siteRssLi = siteRssDiv.closest('li');
        if (!siteRssLi) return;

        // "rss-XXX" divjei
        const rssDivs = siteRssLi.querySelectorAll('div[ext\\:tree-node-id^="rss-"]');
        rssDivs.forEach(rssDiv => {
            const rssAttr = rssDiv.getAttribute('ext:tree-node-id'); // pl. rss-29
            if (!rssAttr.startsWith('rss-')) return;
            const pid = rssAttr.replace('rss-', ''); // pl. 29

            const rssLi = rssDiv.closest('li');
            if (!rssLi) return;

            // Itt minden child, ami NEM "rss-", "site-", "page-"
            const numericChildDivs = rssLi.querySelectorAll(
                'div[ext\\:tree-node-id]:not([ext\\:tree-node-id^="rss-"]):not([ext\\:tree-node-id^="site-"]):not([ext\\:tree-node-id^="page-"])'
            );
            numericChildDivs.forEach(childDiv => {
                const rssId = childDiv.getAttribute('ext:tree-node-id');
                const linkHref = `https://sky.p24.hu/d/x5o8AwTHk/leggyakoribb-rss-feed-beallitasok?orgId=3&var-pid=${pid}&var-rssid=${rssId}`;
                insertLinkIcon(childDiv, linkHref);
            });
        });
    }

    //------------------------------------------------------------------
    // 3) A partner_id → Title link
    //    Keressük a #zoneeditor-limits-tab alatt lévő input[name="id"] mezőt,
    //    utána a <span class="ze-title-title"> szövegét linkké alakítjuk.
    //------------------------------------------------------------------
    function setPartnerLink() {
        const limitsTab = document.getElementById('zoneeditor-limits-tab');
        if (!limitsTab) return;

        // Például: <input name="id" class="x-form-hidden" value="835" />
        const partnerInput = limitsTab.querySelector('input[name="id"]');
        if (!partnerInput) return;

        const partnerId = partnerInput.value; // pl. "835"

        // A címsor pl.: <span class="ze-title-title">Agrotrend zónabeállításai</span>
        const spanTitle = document.querySelector('span.ze-title-title');
        if (!spanTitle) return;

        // Ha már egyszer átalakítottuk linkké, akkor ne csináljuk újra
        if (spanTitle.querySelector('.partner-link')) {
            return;
        }

        // Létrehozzuk a linket
        const link = document.createElement('a');
        link.classList.add('partner-link');
        link.href = `https://sky.p24.hu/d/000000014/hirstart-mysql?orgId=3&var-forras=${partnerId}`;
        link.target = '_blank';
        link.textContent = spanTitle.textContent.trim();

        // A spanTitle tartalmát kitöröljük, és a linket rakjuk be
        spanTitle.textContent = '';
        spanTitle.appendChild(link);
    }

    //------------------------------------------------------------------
    // 4) processZones (összefoglaló)
    //    Az observer meghívja minden alkalommal
    //------------------------------------------------------------------
    function processZones() {
        const zonePanel = document.getElementById('zoneEditorTabPanel');
        if (!zonePanel) {
            console.warn('zoneEditorTabPanel nem található még...');
            return;
        }

        // 1) site-0
        processSite0(zonePanel);

        // 2) site-rss
        processSiteRss(zonePanel);

        // 3) Partner ID → Title link
        setPartnerLink();
    }

    //------------------------------------------------------------------
    // DOM figyelés
    //------------------------------------------------------------------
    function initObserver() {
        const zonePanel = document.getElementById('zoneEditorTabPanel');
        if (!zonePanel) return;

        const observer = new MutationObserver(() => {
            processZones();
        });
        observer.observe(zonePanel, { childList: true, subtree: true });
    }

    function waitForZonePanel() {
        if (document.getElementById('zoneEditorTabPanel')) {
            processZones();
            initObserver();
        } else {
            setTimeout(waitForZonePanel, 2500);
        }
    }

    // Indulás
    waitForZonePanel();
})();
