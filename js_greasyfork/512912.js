// ==UserScript==
// @name         Hyatt Promotion Tracker
// @namespace    http://youmu.moe/
// @version      2024-10-17
// @license      MIT
// @description  Display promotion tracker on Hyatt account overview
// @author       YoumuChan
// @match        https://www.hyatt.com/profile/en-US/account-overview
// @icon         https://www.hyatt.com/hds/favicons/1.latest/favicon.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512912/Hyatt%20Promotion%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/512912/Hyatt%20Promotion%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.PromotionTracker_header {
  text-align: center;
  margin-bottom: 16px;
}

.PromotionTracker_list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.PromotionTracker_card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  flex: 1 1 0px;
  min-width: 220px;
}

.PromotionTracker_card__code {
  text-align: center;
}

.PromotionTracker_card__expiry_remaining {
  color: var(--bellhop-color-grayscale-600);
}

.PromotionTracker_card__registration {
  position: absolute;
}

.PromotionTracker_card__completion {
  display: none;
  position: absolute;
  top: -5px;
  right: -5px;
}

.PromotionTracker_card[data-hascompleted="Y"] .PromotionTracker_card__completion {
  display: block !important;
}
    `);

    const MILESTONE_SELECTOR = 'div[data-js="milestones"]';
    const wait_for_milestones_loaded = new Promise(resolve => {
        if (document.querySelector(MILESTONE_SELECTOR)) {
            return resolve();
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(MILESTONE_SELECTOR)) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
    const wait_for_profile_loaded = fetch('https://www.hyatt.com/profile/api/member/profile').then(res => res.json());

    Promise.all([wait_for_profile_loaded, wait_for_milestones_loaded]).then(([profile, _]) => {
        const milestone_div = document.querySelector(MILESTONE_SELECTOR);
        const milestone_container = milestone_div.querySelector('.b-mb3 > div');
        const container_class = milestone_container.className;

        const promos = profile && profile.profile && profile.profile.extended && profile.profile.extended.pr01_promo_status && profile.profile.extended.pr01_promo_status.message_promo;
        if (!promos) {
            return;
        }

        const promo_elements = promos.map(promo => {
            let remaining_days = '';
            let end_date = 'N/A';
            if (promo.mc20_end_date) {
                const end_year = parseInt(promo.mc20_end_date.slice(0, 4));
                const end_month = parseInt(promo.mc20_end_date.slice(4, 6)) - 1;
                const end_day = parseInt(promo.mc20_end_date.slice(6, 8));

                const end_dateobject = new Date(end_year, end_month, end_day);
                const now = new Date(new Date().setHours(0, 0, 0, 0));
                const ONE_DAY = 24 * 60 * 60 * 1000;
                const day_until_end = Math.round((end_dateobject - now) / ONE_DAY);

                end_date = end_dateobject.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                remaining_days = day_until_end > 0 ? `(${pluralize(day_until_end, 'day', 'days')} remaining)` : '(Expired)';
            }

            const progress = [];
            if (promo.pr01_stays_accum !== '') {
                const stays = parseFloat(promo.pr01_stays_accum);
                progress.push(pluralize(stays, 'stay', 'stays'));
            }
            if (promo.pr01_nights_accum !== '') {
                const nights = parseFloat(promo.pr01_nights_accum);
                progress.push(pluralize(nights, 'night', 'nights'));
            }
            const progress_text = progress.join(' / ') || 'N/A';

            const completion_count = pluralize(parseInt(promo.pr01_fulfill_cnt), 'time', 'times');

            return `
<div class="PromotionTracker_card ${container_class} b-pa3" data-hascompleted="${promo.promo_complete}">
  <div class="PromotionTracker_card__code be-text-section-2">${promo.mc20_promo}</div>
  <div>
    <span class="be-text-label">Expired On: </span>${end_date} <span class="PromotionTracker_card__expiry_remaining be-text-caption">${remaining_days}</span>
  </div>
  <div>
    <span class="be-text-label">Progress: </span>${progress_text}
  </div>
  <div>
    <span class="be-text-label">Completed: </span>${completion_count}
  </div>
  <div class="PromotionTracker_card__completion"><i class="b-icon b-icon-check-bold b-color_text-account"></i></div>
</div>
            `;
        }).join('');

        const tracker_div = document.createElement('div');
        tracker_div.classList.add('b-mb3');
        tracker_div.innerHTML=`
<div class="${container_class}">
  <div class="b-pa3">
    <div class="PromotionTracker_container">
      <div class="PromotionTracker_header be-text-section-1">Registered Promotions</div>
      <div class="PromotionTracker_list">${promo_elements}</div>
    </div>
  </div>
</div>
        `;

        milestone_div.insertAdjacentElement('afterend', tracker_div);
    });

})();

function pluralize(count, singular, plural) {
    if (count <= 1) {
        return `${count} ${singular}`;
    }
    else {
        return `${count} ${plural}`;
    }
}