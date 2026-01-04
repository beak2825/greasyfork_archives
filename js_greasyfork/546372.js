// ==UserScript==
// @name         XF Просроченные жалобы в заголовках
// @namespace    http://tampermonkey.net/
// @version      2025-08-19-2
// @author       Prokhor Adzinets
// @description  Показывает количество просрочки
// @author       You
// @match        https://forum.blackrussia.online/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546372/XF%20%D0%9F%D1%80%D0%BE%D1%81%D1%80%D0%BE%D1%87%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%B2%20%D0%B7%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BA%D0%B0%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/546372/XF%20%D0%9F%D1%80%D0%BE%D1%81%D1%80%D0%BE%D1%87%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%B2%20%D0%B7%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BA%D0%B0%D1%85.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Настройки
  const HOURS_THRESHOLD = 48; // для "Просрочено"
  const HOURS_THRESHOLD_24 = 24; // для "Старше 24 часов"
  const MS_THRESHOLD = HOURS_THRESHOLD * 60 * 60 * 1000;

  const PINNED_HEADER_TEXT = 'Закрепленные темы';
  const REGULAR_HEADER_TEXT = 'Обычные темы';

  const PREFIX_PENDING_REVIEW = 'На рассмотрении'; // для закрепленных
  const PREFIX_WAITING = 'Ожидание'; // для обычных
  const PREFIX_TO_GA = 'Главному администратору'; // для передачи ГА

  // Хелперы

  function normalizeText(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function findHeaders() {
    const headers = Array.from(document.querySelectorAll('h3.block-minorHeader.uix_threadListSeparator'));
    const pinnedHeader = headers.find(h => normalizeText(h.textContent).includes(PINNED_HEADER_TEXT));
    const regularHeader = headers.find(h => normalizeText(h.textContent).includes(REGULAR_HEADER_TEXT));
    return { pinnedHeader, regularHeader };
  }

  function headerToThreadListContainer(headerEl) {
    let block = headerEl.closest('.block');
    if (!block) block = headerEl.parentElement;
    if (!block) return null;

    let container =
      block.querySelector('.structItemContainer') ||
      (block.nextElementSibling && block.nextElementSibling.querySelector && block.nextElementSibling.querySelector('.structItemContainer'));

    if (!container) {
      let sib = headerEl.nextElementSibling;
      while (sib) {
        const c = sib.querySelector && sib.querySelector('.structItemContainer');
        if (c) { container = c; break; }
        sib = sib.nextElementSibling;
      }
    }

    return container;
  }

  function getThreadsFromContainer(containerEl) {
    if (!containerEl) return [];
    const items = Array.from(containerEl.querySelectorAll('.structItem'));
    return items;
  }

  function isDeletedThread(itemEl) {
    if (itemEl.classList.contains('is-deleted')) return true;
    if (itemEl.querySelector('.structItem-status--deleted')) return true;
    const badge = itemEl.querySelector('.label.label--deleted, .badge--deleted, .is-deleted');
    if (badge) return true;
    return false;
  }

  function getThreadPrefix(itemEl) {
    const candidates = [
      '.structItem-title .label',
      '.structItem-title .labelLink--prefix',
      '.structItem-title .prefix',
      '.contentRow-title .label',
      '.contentRow-title .prefix',
      '.structItem-title .label--accent',
      '.structItem-title .label--primary',
      '.structItem-title .label--orange',
      '.structItem-title .label--red',
      '.structItem-title .label--green',
      '.structItem-title span[style*="background"]',
      '.structItem-title .threadPrefix'
    ];
    for (const sel of candidates) {
      const el = itemEl.querySelector(sel);
      if (el) return normalizeText(el.textContent);
    }
    const titleEl = itemEl.querySelector('.structItem-title a, .structItem-title');
    if (titleEl) {
      const txt = normalizeText(titleEl.textContent);
      const m = txt.match(/\[([^\]]+)\]/);
      if (m) return normalizeText(m[1]);
    }
    return '';
  }

  function parseDateFromTimeElement(timeEl) {
    if (!timeEl) return null;
    const dtAttr = timeEl.getAttribute('datetime');
    if (dtAttr) {
      const d = new Date(dtAttr);
      if (!isNaN(d)) return d;
    }
    const dataTime = timeEl.getAttribute('data-time') || timeEl.dataset.time;
    if (dataTime) {
      const num = Number(dataTime) * 1000; // обычно секунды
      const d = new Date(num);
      if (!isNaN(d)) return d;
    }
    const titleAttr = timeEl.getAttribute('title') || timeEl.getAttribute('aria-label');
    if (titleAttr) {
      const d = new Date(titleAttr);
      if (!isNaN(d)) return d;
    }
    return null;
  }

  function getThreadCreatedAt(itemEl) {
    const timeCandidates = [
      '.structItem-meta time',
      'time.u-dt',
      'time'
    ];
    for (const sel of timeCandidates) {
      const timeEl = itemEl.querySelector(sel);
      const d = parseDateFromTimeElement(timeEl);
      if (d) return d;
    }
    const rawTs = itemEl.getAttribute('data-date') || itemEl.getAttribute('data-created') || itemEl.dataset?.date || itemEl.dataset?.created;
    if (rawTs) {
      const numMs = /^\d{10}$/.test(rawTs) ? Number(rawTs) * 1000 : Number(rawTs);
      const d = new Date(numMs);
      if (!isNaN(d)) return d;
    }
    return null;
  }

  function isOverdue(createdAt) {
    if (!createdAt) return false;
    const now = Date.now();
    return (now - createdAt.getTime()) >= MS_THRESHOLD;
  }

  function isOlderThan(createdAt, hours) {
    if (!createdAt) return false;
    return (Date.now() - createdAt.getTime()) >= hours * 60 * 60 * 1000;
  }

  function countOverdue(threads, opts) {
    const { requiredPrefix, skipDeleted } = opts;
    let count = 0;
    for (const item of threads) {
      if (skipDeleted && isDeletedThread(item)) continue;
      const prefix = getThreadPrefix(item);
      if (requiredPrefix && normalizeText(prefix) !== normalizeText(requiredPrefix)) continue;
      const createdAt = getThreadCreatedAt(item);
      if (!createdAt) continue;
      if (isOverdue(createdAt)) count++;
    }
    return count;
  }

  function countOlderThan(threads, opts, hours) {
    const { requiredPrefix, skipDeleted } = opts;
    let count = 0;
    for (const item of threads) {
      if (skipDeleted && isDeletedThread(item)) continue;
      const prefix = getThreadPrefix(item);
      if (requiredPrefix && normalizeText(prefix) !== normalizeText(requiredPrefix)) continue;
      const createdAt = getThreadCreatedAt(item);
      if (!createdAt) continue;
      if (isOlderThan(createdAt, hours)) count++;
    }
    return count;
  }

  function countWithPrefix(threads, requiredPrefix, opts = { skipDeleted: false }) {
    let count = 0;
    for (const item of threads) {
      if (opts.skipDeleted && isDeletedThread(item)) continue;
      const prefix = getThreadPrefix(item);
      if (normalizeText(prefix) === normalizeText(requiredPrefix)) count++;
    }
    return count;
  }

  function updateHeaderCount(headerEl, counts, labels = { overdue: 'Просрочено', pendingTotal: 'Количество тем на рассмотрении' }) {
    if (!headerEl) return;

    if (!document.getElementById('br-overdue-badge-styles')) {
      const style = document.createElement('style');
      style.id = 'br-overdue-badge-styles';
      style.textContent = `
  h3.block-minorHeader.uix_threadListSeparator {
    position: relative;
  }
  .br-overdue-badge, .br-pending-badge, .br-ga-badge, .br-older24-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 12px;
    white-space: nowrap;
    color: #ffffff;
  }
  .br-overdue-badge {
    background: rgba(220, 53, 69, 0.7);
    border: 1px solid rgba(220, 53, 69, 0.9);
  }
  .br-pending-badge {
    background: rgba(13, 110, 253, 0.7);
    border: 1px solid rgba(13, 110, 253, 0.9);
  }
  .br-ga-badge {
    background: rgba(40, 167, 69, 0.7);
    border: 1px solid rgba(40, 167, 69, 0.9);
  }
  .br-older24-badge {
    background: rgba(255, 193, 7, 0.75); /* желтый (warning) */
    border: 1px solid rgba(255, 193, 7, 0.95);
    color: #161616;
  }
  .br-badges-sep {
    width: 8px;
    height: 1px;
  }
  .br-overdue-badge-wrap {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 65%;
    padding-right: 40px;
  }
`;
      document.head.appendChild(style);
    }

    let wrap = headerEl.querySelector('.br-overdue-badge-wrap');
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'br-overdue-badge-wrap';
      headerEl.appendChild(wrap);
    }

    // Бейдж просроченных (48 ч)
    let overdueBadge = wrap.querySelector('.br-overdue-badge');
    if (!overdueBadge) {
      overdueBadge = document.createElement('span');
      overdueBadge.className = 'br-overdue-badge';
      wrap.appendChild(overdueBadge);
    }
    overdueBadge.textContent = `${labels.overdue}: ${counts.overdue ?? 0}`;

    // Бейдж общего количества "На рассмотрении" (только для закрепленных)
    if (typeof counts.pendingTotal === 'number') {
      let sep = wrap.querySelector('.br-badges-sep');
      if (!sep) {
        sep = document.createElement('span');
        sep.className = 'br-badges-sep';
        wrap.appendChild(sep);
      }

      let pendingBadge = wrap.querySelector('.br-pending-badge');
      if (!pendingBadge) {
        pendingBadge = document.createElement('span');
        pendingBadge.className = 'br-pending-badge';
        wrap.appendChild(pendingBadge);
      }
      pendingBadge.textContent = `${labels.pendingTotal}: ${counts.pendingTotal}`;
    } else {
      const sep = wrap.querySelector('.br-badges-sep');
      if (sep) sep.remove();
      const pendingBadge = wrap.querySelector('.br-pending-badge');
      if (pendingBadge) pendingBadge.remove();
    }

    // Бейдж "Передано ГА" (только для закрепленных)
    if (typeof counts.pinnedToGA === 'number') {
      let sep2 = wrap.querySelector('.br-badges-sep.ga');
      if (!sep2) {
        sep2 = document.createElement('span');
        sep2.className = 'br-badges-sep ga';
        wrap.appendChild(sep2);
      }

      let gaBadge = wrap.querySelector('.br-ga-badge');
      if (!gaBadge) {
        gaBadge = document.createElement('span');
        gaBadge.className = 'br-ga-badge';
        wrap.appendChild(gaBadge);
      }
      const label = labels.toGA || 'Передано ГА';
      gaBadge.textContent = `${label}: ${counts.pinnedToGA}`;
    } else {
      const sep2 = wrap.querySelector('.br-badges-sep.ga');
      if (sep2) sep2.remove();
      const gaBadge = wrap.querySelector('.br-ga-badge');
      if (gaBadge) gaBadge.remove();
    }

    // Бейдж "Старше 24 часов" (по текущему набору тем этого заголовка)
    if (typeof counts.older24 === 'number') {
      let sep3 = wrap.querySelector('.br-badges-sep.older24');
      if (!sep3) {
        sep3 = document.createElement('span');
        sep3.className = 'br-badges-sep older24';
        wrap.appendChild(sep3);
      }

      let olderBadge = wrap.querySelector('.br-older24-badge');
      if (!olderBadge) {
        olderBadge = document.createElement('span');
        olderBadge.className = 'br-older24-badge';
        wrap.appendChild(olderBadge);
      }
      const label = labels.older24 || 'Старше 24 часов';
      olderBadge.textContent = `${label}: ${counts.older24}`;
    } else {
      const sep3 = wrap.querySelector('.br-badges-sep.older24');
      if (sep3) sep3.remove();
      const olderBadge = wrap.querySelector('.br-older24-badge');
      if (olderBadge) olderBadge.remove();
    }
  }

  function run() {
    const { pinnedHeader, regularHeader } = findHeaders();

    const pinnedContainer = pinnedHeader ? headerToThreadListContainer(pinnedHeader) : null;
    const regularContainer = regularHeader ? headerToThreadListContainer(regularHeader) : null;

    const pinnedThreads = getThreadsFromContainer(pinnedContainer);
    const regularThreads = getThreadsFromContainer(regularContainer);

    const pinnedOverdue = countOverdue(pinnedThreads, {
      requiredPrefix: PREFIX_PENDING_REVIEW,
      skipDeleted: false
    });

    const regularOverdue = countOverdue(regularThreads, {
      requiredPrefix: PREFIX_WAITING,
      skipDeleted: true
    });

    const pinnedPendingTotal = countWithPrefix(pinnedThreads, PREFIX_PENDING_REVIEW, { skipDeleted: false });
    const pinnedToGATotal = countWithPrefix(pinnedThreads, PREFIX_TO_GA, { skipDeleted: false });

    const pinnedOlder24 = countOlderThan(pinnedThreads, {
      requiredPrefix: PREFIX_PENDING_REVIEW,
      skipDeleted: false
    }, HOURS_THRESHOLD_24);

    const regularOlder24 = countOlderThan(regularThreads, {
      requiredPrefix: PREFIX_WAITING,
      skipDeleted: true
    }, HOURS_THRESHOLD_24);

    if (pinnedHeader) {
      updateHeaderCount(pinnedHeader,
        { overdue: pinnedOverdue, pendingTotal: pinnedPendingTotal, pinnedToGA: pinnedToGATotal, older24: pinnedOlder24 },
        { overdue: 'Просрочено', older24: 'Старше 24 часов' , pendingTotal: 'Количество тем на рассмотрении', toGA: 'Передано ГА' }
      );
    }
    if (regularHeader) {
      updateHeaderCount(regularHeader,
        { overdue: regularOverdue, older24: regularOlder24 },
        { overdue: 'Просрочено', older24: 'Старше 24 часов' }
      );
    }
  }

  // Поддержка динамической подгрузки
  function installObservers() {
    const obs = new MutationObserver(() => {
      clearTimeout(installObservers._t);
      installObservers._t = setTimeout(run, 250);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installObservers);
  } else {
    installObservers();
  }

})();