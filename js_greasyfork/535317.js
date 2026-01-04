// ==UserScript==
// @name         WebEngage – Enhanced Sidebar
// @namespace    https://dashboard.ksa.webengage.com/*
// @version      2.5
// @license      MIT
// @author       Khaled Saif
// @description  Because 'hover-to-see-anything' is not a lifestyle.
// @match        https://dashboard.webengage.com/*
// @match        https://dashboard.ksa.webengage.com/*
// @match        https://dashboard.in.webengage.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535317/WebEngage%20%E2%80%93%20Enhanced%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/535317/WebEngage%20%E2%80%93%20Enhanced%20Sidebar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =============== Constants ===============
  const STYLE_ID = 'pinned-sidebar-style';
  const MENU_SELECTOR = '.menu__list';
  const SHORTCUTS = [
    { txt: 'Email Campaigns', href: '/emails/campaign-list/all', icon: 'fl-mail' },
    { txt: 'Events', href: '/events', icon: 'fl-event' },
    { txt: 'Journeys', href: '/journeys/campaign-list/all', icon: 'fl-journey' },
  ];

  // =============== Inject CSS for Sidebar Behavior ===============
  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;

    const css = `
      /* Pin button */
      .pin-toggle {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        background: url('https://cdn-icons-png.flaticon.com/512/174/174849.png   ') no-repeat center / contain;
        cursor: pointer;
        opacity: 0.6;
        transition: all 0.2s ease;
      }

      .pin-toggle:hover,
      .pin-toggle.pinned {
        opacity: 1;
      }

      .pin-toggle.pinned {
        transform: rotate(45deg);
      }

      /* Force Fast-Access elements visible */
      li.fa-keep.fast-access-title,
      li.fa-keep.fast-access-separator,
      li.fa-keep .fast-access-search,
      li.fa-keep .fast-access-link > span,
      li.fa-keep .fast-access-link i {
        opacity: 1 !important;
        visibility: visible !important;
      }

      /* Fast-Access styling */
      li.fa-keep.fast-access-title {
        margin: 6px 0 4px;
        font-size: 12px;
        text-transform: uppercase;
        padding-left: 12px;
        opacity: .75;
      }

      li.fa-keep.fast-access-separator {
        border-bottom: 1px solid rgba(255,255,255,.1);
        margin: 6px 10px;
      }

      input.fast-access-search {
        width: 90%;
        margin: 6px 5%;
        padding: 6px;
        background: rgba(255,255,255,.1);
        color: #fff;
        border: 0;
        border-radius: 4px;
      }

      .fast-access-link {
        transition: background .15s;
        border-radius: 4px;
      }

      .fast-access-link:hover {
        background: rgba(255,255,255,.08);
      }

      .menu__element.filtered-out {
        display: none !important;
      }
    `;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // =============== Inject Fast Access Menu + Search ===============
  function injectFastAccess(list) {
    if (list.querySelector('.fa-keep')) return;

    const base = (location.pathname.match(/^\/accounts\/[^/]+/)||[''])[0];
    let html = '<li class="menu__title margin-top-m"><p>Fast Access</p></li>';
    html += '<li class="fa-keep"><input type="text" placeholder="Search…" class="fast-access-search"></li>';

    SHORTCUTS.forEach(({txt, href, icon}) => {
      html += `
        <li class="menu__element fa-keep">
          <a class="menu__link fast-access-link" href="${base+href}">
            <i class="${icon}"></i><span>${txt}</span>
          </a>
        </li>`;
    });

    html += '<li class="fa-keep fast-access-separator"></li>';
    list.insertAdjacentHTML('afterbegin', html);

    const searchInput = list.querySelector('.fast-access-search');

    // Debounce to improve performance
    const debounce = (fn, delay) => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
      };
    };

    // Search filter + auto-expand
    searchInput.addEventListener('input', debounce(() => {
      const q = searchInput.value.toLowerCase();

      list.querySelectorAll('.menu__element:not(.fa-keep)').forEach(li => {
        const match = li.textContent.toLowerCase().includes(q);
        li.classList.toggle('filtered-out', !match);
      });

      list.querySelectorAll('.menu__group').forEach(group => {
        const hasVisibleItem = Array.from(group.querySelectorAll('li.menu__element'))
          .some(li => !li.classList.contains('filtered-out'));

        group.classList.toggle('menu__group--is-active', hasVisibleItem);
      });
    }, 200));
  }

  // =============== Inject Pin Toggle Icon ===============
function injectPinToggleButton() {
  const menu = document.querySelector('.menu');
  if (!menu || menu.querySelector('.pin-toggle')) return;

  const pinBtn = document.createElement('div');
  pinBtn.className = 'pin-toggle';
  pinBtn.title = 'Toggle Sidebar Visibility';

  // Restore state from localStorage
  const isPinned = localStorage.getItem('sidebarPinned') === 'true';
  if (isPinned) {
    pinBtn.classList.add('pinned');
    document.body.classList.add('has-minimized-menu-access');
  }

  // Click handler
  pinBtn.addEventListener('click', () => {
    const wasPinned = document.body.classList.contains('has-minimized-menu-access');

    document.body.classList.toggle('has-minimized-menu-access', !wasPinned);
    pinBtn.classList.toggle('pinned', !wasPinned);
    localStorage.setItem('sidebarPinned', !wasPinned ? 'true' : 'false');
  });

  menu.appendChild(pinBtn);
}

// =============== Body observer – only remove classes if NOT pinned ===============
const bodyObserver = new MutationObserver(muts => {
  muts.forEach(m => {
    if (m.type === 'attributes' && m.attributeName === 'class') {
      const isPinned = localStorage.getItem('sidebarPinned') === 'true';
      if (!isPinned) {
        let cls = document.body.className;
        if (cls.includes('has-minimized-menu')) {
          document.body.className = cls
            .replace(/has-minimized-menu/g, '')
            .replace(/has-minimized-menu-access/g, '')
            .trim();
        }
      }
    }
  });
});

bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  // =============== Init Function ===============
  function init() {
    injectCSS();
    const list = document.querySelector(MENU_SELECTOR);
    if (!list) return;

    injectFastAccess(list);
    injectPinToggleButton();
  }

  // =============== Poll for Sidebar Load ===============
  const poll = setInterval(() => {
    if (document.querySelector(MENU_SELECTOR)) {
      clearInterval(poll);
      init();
    }
  }, 250);

  // =============== SPA Navigation Hook ===============
  const _push = history.pushState;
  history.pushState = function () {
    _push.apply(this, arguments);
    setTimeout(() => {
      const list = document.querySelector(MENU_SELECTOR);
      if (list) injectFastAccess(list);
      injectPinToggleButton();
    }, 100);
  };

  window.addEventListener('popstate', () => setTimeout(() => {
    const list = document.querySelector(MENU_SELECTOR);
    if (list) injectFastAccess(list);
    injectPinToggleButton();
  }, 100));

    // Start observing body class changes
bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

})();
