// ==UserScript==
// @name         AO3 Chapter Tracker and Notifier
// @version      1.6.2
// @description  Track AO3 works and notify when new chapters are added
// @author       aster_vesta
// @namespace    https://greasyfork.org/users/1479995
// @icon         http://pic.pdowncc.com/uploadimg/ico/2023/1229/1703828393150107.png
// @match        https://archiveofourown.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      archiveofourown.org
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538619/AO3%20Chapter%20Tracker%20and%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/538619/AO3%20Chapter%20Tracker%20and%20Notifier.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'trackedWorks';
  const NOTIF_CONTAINER_ID = 'ao3-notifier-toast-container';
  const MODAL_ID = 'ao3-tracker-modal';

  const getTrackedWorks = () => JSON.parse(GM_getValue(STORAGE_KEY, '[]'));
  const saveTrackedWorks = (works) => GM_setValue(STORAGE_KEY, JSON.stringify(works));
  const isTracked = (url) => getTrackedWorks().some(w => w.url === url);

  const getWorkData = () => {
    const titleEl = document.querySelector('h2.title.heading');
    const title = titleEl ? titleEl.textContent.trim() : document.title;
    const url = location.href.split('?')[0];

    const updatedEl = document.querySelector('dd.status') || document.querySelector('dd.date.updated');
    const updated = updatedEl ? updatedEl.textContent.trim() : new Date().toISOString().split('T')[0];

    const chapterInfo = document.querySelector('dd.chapters');
    let currentChapter = 1;
    if (chapterInfo) {
      const match = chapterInfo.textContent.trim().match(/^(\d+)(?:\/(\d+|\\?))?/);
      if (match) {
        currentChapter = parseInt(match[1], 10);
      }
    }

    return {
      title,
      url,
      updated,
      chapter: currentChapter,
      savedAt: new Date().toISOString(),
    };
  };

  const updateButtonState = (btns, tracked) => {
    for (const btn of btns) {
      btn.textContent = tracked? 'Stop Tracking':'Track Work';
    }
  };

  const toggleTracking = (btns) => {
    const work = getWorkData();
    let tracked = getTrackedWorks();
    const index = tracked.findIndex(w => w.url === work.url);

    if (index === -1) {
      tracked.push(work);
      saveTrackedWorks(tracked);
      showToast(`Tracking "${work.title}" from chapter ${work.chapter}`);
    } else {
      tracked.splice(index, 1);
      saveTrackedWorks(tracked);
      showToast(`Stopped tracking "${work.title}"`);
    }

    updateButtonState(btns, index === -1);
  };

  const createAO3StyledButton = (text, clickHandler) => {
    const li = document.createElement('li');
    const btn = document.createElement('a');
    btn.href = 'javascript:void(0);';
    btn.className = 'button';
    btn.textContent = text;
    btn.addEventListener('click', clickHandler);
    li.appendChild(btn);
    return { li, btn };
  };

  const insertTrackerButtons = () => {
    const url = location.href.split('?')[0];
    const tracked = isTracked(url);

    // Replace Subscribe or insert
    const existingBtn = document.querySelector('#new_subscription, form[action$="/subscriptions"] input[type="submit"]');
    let mainBtn;
    if (existingBtn && existingBtn.parentElement) {
      mainBtn = document.createElement('button');
      mainBtn.type = 'button';
      mainBtn.className = 'button';
      mainBtn.textContent = tracked? 'Stop Tracking':'Track Work';
      mainBtn.addEventListener('click', () => toggleTracking([mainBtn]));
      existingBtn.parentElement.replaceChild(mainBtn, existingBtn);
    } else {
      // fallback insert
      const commentsBtn = Array.from(document.querySelectorAll('li')).find(li =>
        li.textContent.trim().includes('Comments')
      );
      if (commentsBtn && commentsBtn.parentElement) {
        const { li, btn } = createAO3StyledButton(
          tracked? 'Stop Tracking':'Track Work',
          () => toggleTracking([btn])
        );
        mainBtn = btn;
        commentsBtn.parentElement.insertBefore(li, commentsBtn);
      }
    }

    // Add Show Tracked Works to right of About
    const aboutBtn = Array.from(document.querySelectorAll('li')).find(li =>
      li.textContent.trim().includes('About')
    );
    if (aboutBtn && aboutBtn.parentElement) {
      const { li } = createAO3StyledButton('Tracked Works', showModal);
      aboutBtn.parentNode.insertBefore(li, aboutBtn.nextSibling);
    }
  };

  const showToast = (message, link = null) => {
    let container = document.getElementById(NOTIF_CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = NOTIF_CONTAINER_ID;
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    toast.style.maxWidth = '300px';
    toast.style.fontSize = '14px';
    toast.style.cursor = link ? 'pointer' : 'default';
    toast.textContent = message;

    if (link) {
      toast.addEventListener('click', () => window.open(link, '_blank'));
      toast.style.textDecoration = 'underline';
    }

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 8000);
  };

  const showModal = () => {
    const existing = document.getElementById(MODAL_ID);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = 10000;
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    const content = document.createElement('div');
    content.style.background = '#fff';
    content.style.padding = '20px';
    content.style.borderRadius = '8px';
    content.style.maxHeight = '80%';
    content.style.overflowY = 'auto';
    content.style.width = '600px';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.float = 'right';
    closeBtn.style.marginBottom = '10px';
    closeBtn.addEventListener('click', () => modal.remove());

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="border-bottom:1px solid #ccc; text-align:left;">Title</th>
        <th style="border-bottom:1px solid #ccc;">Chapter</th>
        <th style="border-bottom:1px solid #ccc;">Tracked</th>
        <th style="border-bottom:1px solid #ccc;">Link</th>
      </tr>
    `;

    const tbody = document.createElement('tbody');
    const tracked = getTrackedWorks();
    for (const w of tracked) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding:4px 0;">${w.title}</td>
        <td style="text-align:center;">${w.chapter}</td>
        <td style="text-align:center;">${new Date(w.savedAt).toLocaleDateString()}</td>
        <td style="text-align:center;"><a href="${w.url}" target="_blank">Open</a></td>
      `;
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    content.appendChild(closeBtn);
    content.appendChild(table);
    modal.appendChild(content);
    document.body.appendChild(modal);
  };

  const checkForUpdates = async () => {
    const tracked = getTrackedWorks();
    if (!tracked.length) return;

    for (const work of tracked) {
      try {
        await new Promise(r => setTimeout(r, 1000)); // polite delay

        GM_xmlhttpRequest({
          method: 'GET',
          url: work.url,
          onload: (response) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            const updatedEl = doc.querySelector('dd.status') || doc.querySelector('dd.date.updated');
            const updated = updatedEl ? updatedEl.textContent.trim() : null;

            const chapterInfo = doc.querySelector('dd.chapters');
            let currentChapter = 1;
            if (chapterInfo) {
              const match = chapterInfo.textContent.trim().match(/^(\d+)(?:\/(\d+|\\?))?/);
              if (match) {
                currentChapter = parseInt(match[1], 10);
              }
            }

            if (currentChapter > work.chapter) {
              showToast(
                `"${work.title}" has a new chapter!\nYou were on chapter ${work.chapter} (saved ${new Date(work.savedAt).toLocaleDateString()})`,
                work.url
              );

              work.chapter = currentChapter;
              work.updated = updated;
              work.savedAt = new Date().toISOString();

              const updatedWorks = tracked.map(w => w.url === work.url ? work : w);
              saveTrackedWorks(updatedWorks);
            }
          },
          onerror: (err) => {
            console.error(`Failed to check ${work.title}:`, err);
          }
        });

      } catch (e) {
        console.error('Error during update check:', e);
      }
    }
  };

  const lastCheckedKey = 'lastCheckedDate';
  const today = new Date().toISOString().split('T')[0];
  const lastChecked = GM_getValue(lastCheckedKey, '');
  if (lastChecked !== today) {
    GM_setValue(lastCheckedKey, today);
    checkForUpdates();
  }

  if (/\/works\/\d+/.test(location.pathname)) {
    insertTrackerButtons();
  }

})();