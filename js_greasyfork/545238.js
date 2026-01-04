// ==UserScript==
// @name         YouTube - Remove Annoyances
// @version      2.6.1
// @description  Removes personal annoyances on YouTube and adds Shorts autoplay
// @author       ariackonrel
// @match        https://www.youtube.com/*
// @license      No License
// @run-at       document-idle
// @grant        none
// @namespace    TBD
// @downloadURL https://update.greasyfork.org/scripts/545238/YouTube%20-%20Remove%20Annoyances.user.js
// @updateURL https://update.greasyfork.org/scripts/545238/YouTube%20-%20Remove%20Annoyances.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const hide = (el) => { if (!el) return; el.style.setProperty('display','none','important'); };
  const closest = (node, sel) => node?.closest?.(sel) || null;

  const byText = (root, selector, text) => {
    const nodes = root.querySelectorAll(selector);
    const target = text.trim().toLowerCase();
    return Array.from(nodes).filter(n =>
      (n.textContent || '').trim().toLowerCase() === target
    );
  };

  const hideGuideItem = (el) => {
    if (!el) return;
    hide(el);
  };

  // Only keep "Subscriptions" button, hide the channel list + show more
  const cleanSubscriptionsSection = () => {
    const sections = document.querySelectorAll('#sections ytd-guide-section-renderer');
    const subsSection = sections[1]; // second section under #sections
    if (!subsSection) return;

    const items = subsSection.querySelector('#items');
    if (!items) return;

    Array.from(items.children).forEach(entry => {
      const endpoint = entry.querySelector('a#endpoint');
      const title = (endpoint && endpoint.getAttribute('title') || '').trim();
      if (title === 'Subscriptions') return; // keep
      hide(entry);
    });
  };

  // Remove options from 3 dots menus under videos
  const stripMenuItems = () => {
    const MENU_LABELS = ["Download","Share","Hide","Report","Clip","Thanks","Send feedback","Ask"];
    const labelMatch = (node, want) =>
      (node?.textContent || '').trim().toLowerCase() === want.toLowerCase();

    const removeItemIfLabeled = (rootSel, itemSel) => {
      document.querySelectorAll(rootSel).forEach(root => {
        root.querySelectorAll(itemSel).forEach(item => {
          const textNode = item.querySelector(
            'yt-formatted-string, .yt-core-attributed-string, span[role="text"], .yt-list-item-view-model-wiz__title'
          );
          if (!textNode) return;
          for (const lbl of MENU_LABELS) {
            if (labelMatch(textNode, lbl)) {
              const target =
                item.closest('ytd-menu-service-item-renderer') ||
                item.closest('yt-list-item-view-model') ||
                item.closest('yt-download-list-item-view-model') ||
                item;
              hide(target);
              break;
            }
          }
        });
      });
    };

    removeItemIfLabeled('ytd-menu-popup-renderer',
                        'ytd-menu-service-item-renderer, tp-yt-paper-item');
    removeItemIfLabeled('yt-contextual-sheet-layout',
                        'yt-list-item-view-model, yt-download-list-item-view-model');
  };

  const pruneEmptyFlexButtons = () => {
    const bar = document.querySelector('#flexible-item-buttons');
    if (!bar) return;

    const isVisiblyRendered = (el) =>
      !!el && (el.offsetParent !== null ||
               (el.getClientRects && el.getClientRects().length > 0));

    Array.from(bar.children).forEach(kid => {
      const btn = kid.querySelector('button, yt-button-view-model, button-view-model, ytd-button-renderer');
      if (!btn || !isVisiblyRendered(btn)) {
        kid.remove();
        return;
      }
      const inner = kid.querySelector('button[aria-label], button-view-model, yt-button-view-model');
      if (inner && !isVisiblyRendered(inner)) kid.remove();
    });
  };

  // Remove Ask/Download/Thanks/Clip/Remix under the video
  const removeUnderVideoButtons = () => {
    const labels = ['Ask','Download','Thanks','Clip','Remix'];
    labels.forEach(lbl => {
      document.querySelectorAll(`[aria-label="${lbl}"]`).forEach(btn => {
        const slot = btn.closest(
          'yt-button-view-model, ytd-download-button-renderer, ytd-button-renderer, button-view-model'
        ) || btn;
        const top =
          (slot.closest && (slot.closest('yt-button-view-model') ||
                            slot.closest('ytd-download-button-renderer'))) ||
          slot;
        if (top && top.remove) top.remove(); else hide(top);
      });
    });

    // Remove the Join channel button
    const joinBtn = document.querySelector('#sponsor-button [aria-label="Join this channel"]');
    if (joinBtn) {
      const jc = joinBtn.closest('#sponsor-button') || joinBtn;
      if (jc.remove) jc.remove(); else hide(jc);
    }

    pruneEmptyFlexButtons();
  };

  // Cleanup sidebar
  const hideGuideEntriesByTitles = (titles) => {
    titles.forEach(title => {
      const links = document.querySelectorAll(`a#endpoint[title="${title}"]`);
      links.forEach(el => {
        hideGuideItem(closest(el, 'ytd-guide-entry-renderer'));
        hideGuideItem(closest(el, 'ytd-mini-guide-entry-renderer'));
      });
    });
  };

  const run = () => {
    const path = location.pathname || '';
    const isHome = (path === '/' || path === '');

    // Remove white divider line on left sidebar
    const sectionsRoot = document.querySelector('#sections.ytd-guide-renderer');
    if (sectionsRoot && !sectionsRoot.dataset.outlinePatched) {
      sectionsRoot.style.setProperty('--yt-spec-outline', 'transparent', 'important');
      sectionsRoot.dataset.outlinePatched = '1';
    }

    stripMenuItems();
    removeUnderVideoButtons();

    if (isHome) hide(document.querySelector('#header .ytd-rich-grid-renderer'));

    // Sidebar options to remove
    hideGuideEntriesByTitles([
      'Downloads','Movies & TV','Your movies & TV','History','Settings',
      'Report history','Liked videos','Help','Send feedback'
    ]);

    // Hide whole “More from YouTube” section
    document.querySelectorAll('a#endpoint[title="More from YouTube"]').forEach(el =>
      hideGuideItem(closest(el, 'ytd-guide-section-renderer'))
    );

    // Hide the header text “More from YouTube”
    document.querySelectorAll('#guide-section-title').forEach(titleEl => {
      const text = (titleEl.textContent || '').trim();
      if (text.includes('More from YouTube')) hideGuideItem(titleEl);
    });

    // Hide Explore
    byText(document, 'ytd-guide-section-renderer h3', 'Explore')
      .forEach(h3 => hideGuideItem(closest(h3, 'ytd-guide-section-renderer')));

    // Hide Premium/Kids/TV icons
    hideGuideEntriesByTitles(['YouTube Premium','YouTube Kids','YouTube TV']);

    // Hide footer and chrome controls in the sidebar
    hide(document.querySelector('#footer.style-scope.ytd-guide-renderer'));

    // Hide ONLY the header Create button (masthead)
    const masthead = document.querySelector('#masthead-container');
    if (masthead) {
      masthead.querySelectorAll('[aria-label="Create"]').forEach(hide);

      const createFill = masthead.querySelector(
        '#buttons > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div.yt-spec-touch-feedback-shape__fill'
      );
      if (createFill) hide(createFill);

      const createBtn = masthead.querySelector('#buttons [aria-label="Create"]');
      if (createBtn) hide(createBtn);
    }

    hide(document.querySelector('#voice-search-button'));

    // Clean Subscriptions section
    cleanSubscriptionsSection();

    // Remove main page clutter
    document.querySelectorAll('#items [alternative-label="More videos"]').forEach(hide);
    document.querySelectorAll('.yt-about-this-ad-renderer').forEach(node =>
      hide(closest(node, 'tp-yt-paper-dialog'))
    );
    document.querySelectorAll('.ytd-ad-slot-renderer').forEach(node =>
      hide(closest(node, 'ytd-rich-item-renderer'))
    );
    document.querySelectorAll('.ytd-promoted-sparkles-web-renderer').forEach(node => {
      const c = closest(node, '#sparkles-container') || closest(node, 'ytd-rich-item-renderer');
      hide(c);
    });
    document.querySelectorAll('.ytd-brand-video-shelf-renderer').forEach(node =>
      hide(closest(node, 'ytd-rich-section-renderer'))
    );
    document.querySelectorAll('.ytd-primetime-promo-renderer').forEach(node =>
      hide(closest(node, '#dismissible'))
    );
    document.querySelectorAll('.ytd-statement-banner-renderer').forEach(node =>
      hide(closest(node, '#dismissible'))
    );

    hide(document.querySelector('#mealbar-promo-renderer'));
    document.querySelectorAll('#panels ytd-engagement-panel-section-list-renderer').forEach(hide);

    // Player overlays
    document.querySelectorAll('#movie_player .ytp-paid-content-overlay').forEach(hide);
    document.querySelectorAll('#movie_player [aria-label="Channel watermark"]').forEach(hide);
    document.querySelectorAll('#movie_player [aria-label="View products"]').forEach(hide);
    hide(document.querySelector(
      '#movie_player > div.ytp-chrome-top > div.ytp-chrome-top-buttons > button.ytp-button.ytp-cards-button'
    ));

    document.querySelectorAll('.ytd-merch-shelf-renderer').forEach(hide);

    hide(document.querySelector('#offer-module'));
    document.querySelectorAll('.ytd-emergency-onebox-renderer').forEach(hide);
    document.querySelectorAll('.yt-chip-cloud-renderer').forEach(hide);

    // Shorts pages
    if (location.href.includes('.com/shorts/')) {
      hide(document.querySelector('#metapanel'));

      // Hide Shorts remix button
      document.querySelectorAll('#button-bar > reel-action-bar-view-model > button-view-model')
        .forEach(btn => {
          const label = (
            btn.getAttribute('aria-label') ||
            btn.getAttribute('title') ||
            btn.querySelector('[aria-label]')?.getAttribute('aria-label') ||
            btn.querySelector('[title]')?.getAttribute('title') ||
            ''
          ).toLowerCase();
          if (label.includes('remix')) btn.remove();
        });

      // Short autoplay popup
      const container = document.querySelector('#content');
      if (container && !document.querySelector('#shorts-autoplay-indicator')) {
        const alert = document.createElement('div');
        alert.id = 'shorts-autoplay-indicator';
        alert.innerText = 'YouTube Shorts Autoplay On';
        alert.style.position = 'absolute';
        alert.style.top = '50%';
        alert.style.left = '50%';
        alert.style.transform = 'translate(-50%, -50%)';
        alert.style.color = 'white';
        alert.style.fontSize = 'large';
        alert.style.backgroundColor = '#1c1c1c';
        alert.style.padding = '10px';
        alert.style.borderRadius = '10px';
        alert.style.opacity = '0.7';
        alert.style.transition = 'opacity ease 2s';
        container.appendChild(alert);
        setTimeout(() => { alert.style.opacity = '0'; }, 1000);
      }

      // Auto advance Shorts
      let playing = document.querySelector('.playing-mode video');
      if (playing) playing.loop = false;

      if (!window.__shortsAutoplayInterval) {
        window.__shortsAutoplayInterval = setInterval(() => {
          if (!playing) playing = document.querySelector('.playing-mode video');
          if (playing) playing.loop = false;
          if (playing && playing.ended) {
            const nextBtn = document.querySelector('#navigation-button-down .yt-spec-button-shape-next__icon');
            if (nextBtn) nextBtn.click();
            playing = null;
          }
        }, 150);
      }
    }

    // Remove CC button on Shorts
    const cc = document.querySelector('#closed-captioning-button-container');
    if (cc) cc.remove();
  };

  let scheduled = false;
  const scheduleRun = () => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      run();
    }, 50);
  };

  const obs = new MutationObserver(scheduleRun);
  obs.observe(document.documentElement, { childList: true, subtree: true });

  run();
})();