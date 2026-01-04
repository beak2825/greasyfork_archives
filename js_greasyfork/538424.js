// ==UserScript==
// @name         Torn Market Bonus Badges
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add bonus % and name badges on items.
// @author       aquagloop
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538424/Torn%20Market%20Bonus%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/538424/Torn%20Market%20Bonus%20Badges.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ALLOWED_CATEGORIES = ["Melee", "Primary", "Secondary", "Defensive"];
    const isAllowedWeaponCategory = () => {
    const hash = window.location.hash || '';
    return ALLOWED_CATEGORIES.some(cat =>
        hash.includes(`categoryName=${cat}`) || hash.includes(`itemType=${cat}`)
    );
};

    const extractPercent = desc => {
      const m = /\b(\d+)%/.exec(desc);
      return m ? +m[1] : null;
    };

    function injectBonusBadges(liEl, numericBonuses, bonusTitles) {
      if (liEl.querySelector('.bonus-badge-wrapper')) return;
      if (getComputedStyle(liEl).position === 'static') {
        liEl.style.position = 'relative';
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'bonus-badge-wrapper';
      Object.assign(wrapper.style, {
        position: 'absolute',
        top: '4px',
        right: '4px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '2px',
        zIndex: '10',
        pointerEvents: 'none'
      });

      if (numericBonuses.length) {
        const pctBadge = document.createElement('div');
        pctBadge.className = 'bonus-badge-percent';
        pctBadge.textContent = `${numericBonuses.reduce((a, b) => a + b, 0)}%`;
        Object.assign(pctBadge.style, {
          backgroundColor: 'rgba(255,215,0,0.9)',
          color: '#000',
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '2px 4px',
          borderRadius: '3px',
          textAlign: 'right'
        });
        wrapper.appendChild(pctBadge);
      }

      bonusTitles.forEach(title => {
        const titleBadge = document.createElement('div');
        titleBadge.className = 'bonus-badge-title';
        titleBadge.textContent = title;
        Object.assign(titleBadge.style, {
          backgroundColor: 'rgba(0,128,255,0.85)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'normal',
          padding: '1px 3px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          textAlign: 'right'
        });
        wrapper.appendChild(titleBadge);
      });

      liEl.appendChild(wrapper);
    }

    function badgeAllRows() {
      const ul = document.querySelector('ul[class^="itemList___"]');
      if (!ul) return false;

      const rows = Array.from(ul.querySelectorAll('li'));
      if (!rows.length) return false;

      rows.forEach(li => {
        const icons = Array.from(li.querySelectorAll('i[data-bonus-attachment-description]'));
        if (!icons.length) return;

        const numericBonuses = [];
        const bonusTitles = [];
        icons.forEach(ico => {
          const desc = ico.dataset.bonusAttachmentDescription || "";
          const pct = extractPercent(desc);
          if (pct !== null) numericBonuses.push(pct);

          const title = ico.dataset.bonusAttachmentTitle || "";
          if (title) bonusTitles.push(title);
        });

        injectBonusBadges(li, numericBonuses, bonusTitles);
      });

      return true;
    }

    function waitForFinalLayoutAndBadge() {
      let attempts = 0;
      const poll = setInterval(() => {
        if (++attempts > 20 || !isAllowedWeaponCategory()) {
          clearInterval(poll);
          return;
        }
        const ul = document.querySelector('ul[class^="itemList___"]');
        if (ul) {
          clearInterval(poll);
          setTimeout(() => {
            badgeAllRows();
            observeListChanges(ul);
          }, 2500);
        }
      }, 300);
    }

    function observeListChanges(ul) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            badgeAllRows();
          }
        });
      });
      observer.observe(ul, { childList: true, subtree: true });
    }

    function onCategoryLoad() {
      waitForFinalLayoutAndBadge();
    }

    window.addEventListener('load', () => isAllowedWeaponCategory() && onCategoryLoad());
    window.addEventListener('hashchange', () => isAllowedWeaponCategory() && onCategoryLoad());

})();
