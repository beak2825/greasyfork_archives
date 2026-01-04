// ==UserScript==
// @name         Invite Recent Users (Auto-load all followers in batches)
// @version      1.5.1
// @description  Automatically load and invite all followers of any user in batches of 40
// @match        https://scratch.mit.edu/studios/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1491229
// @downloadURL https://update.greasyfork.org/scripts/541514/Invite%20Recent%20Users%20%28Auto-load%20all%20followers%20in%20batches%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541514/Invite%20Recent%20Users%20%28Auto-load%20all%20followers%20in%20batches%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const studioId = location.pathname.split('/')[2];
  if (!studioId) return;

  const STORAGE_KEY = `invite_recent_users_invited_${studioId}`;

  function getInvitedUsers() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveInvitedUser(username) {
    const invited = getInvitedUsers();
    if (!invited.includes(username)) {
      invited.push(username);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invited));
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function waitForElement(selector, timeout = 7000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const observer = new MutationObserver(() => {
        const elNow = document.querySelector(selector);
        if (elNow) {
          observer.disconnect();
          resolve(elNow);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      if (timeout) setTimeout(() => {
        observer.disconnect();
        reject(new Error('Timeout waiting for element ' + selector));
      }, timeout);
    });
  }

  waitForElement('#sa-studio-followers-button').then(refButton => {
    const btn = document.createElement('button');
    btn.id = 'scratch-invite-recent-btn';
    btn.className = 'button';
    btn.textContent = 'Invite Recent';
    btn.style.marginLeft = '10px';
    btn.onclick = () => {
      if (document.querySelector('#scratch-invite-modal')) {
        document.querySelector('#scratch-invite-modal').remove();
      } else {
        showPanel();
      }
    };
    refButton.parentNode.insertBefore(btn, refButton.nextSibling);
  }).catch(console.warn);

  async function checkUserExists(username) {
    try {
      const res = await fetch(`https://api.scratch.mit.edu/users/${encodeURIComponent(username)}`);
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.username;
    } catch {
      return false;
    }
  }

  async function fetchUsers(username, offset) {
    const url = `https://api.scratch.mit.edu/users/${encodeURIComponent(username)}/followers?limit=40&offset=${offset}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    return data.map(u => u.username);
  }

  async function inviteUser(username) {
    try {
      const csrfToken = getCookie('scratchcsrftoken');
      if (!csrfToken) throw new Error('No CSRF token found');

      const res = await fetch(
        `https://scratch.mit.edu/site-api/users/curators-in/${studioId}/invite_curator/?usernames=${encodeURIComponent(username)}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: null
        }
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.detail || 'Unknown error');
      }

      return true;
    } catch (e) {
      console.error('Invite error:', e);
      return false;
    }
  }

  async function showPanel() {
    const modal = document.createElement('div');
    modal.id = 'scratch-invite-modal';
    modal.style = `
      position: fixed; top: 20px; right: 20px; width: 420px; height: 540px;
      background: white; border: 2px solid #333; padding: 15px;
      z-index: 10000; overflow-y: auto; font-family: Arial,sans-serif;
      display: flex; flex-direction: column; border-radius: 5px;
      box-shadow: 0 0 15px rgba(0,0,0,0.3);
    `;

    modal.innerHTML = `
      <button title="Close" style="position:absolute;top:5px;right:5px; font-size: 18px; background:none; border:none; cursor:pointer;">×</button>
      <h3>Invite Recent Users (Auto-batch)</h3>
      <label for="username-input" style="margin-top:10px;">Username to fetch followers:</label>
      <input id="username-input" type="text" value="griffpatch" style="width:100%; padding:6px; margin-bottom:10px;"/>
      <button id="load-user-btn" style="margin-bottom:10px;">Load Followers</button>
      <ul id="user-list" style="flex-grow:1; overflow-y:auto; border:1px solid #ccc; padding-left:20px; background:#fafafa; border-radius:3px; min-height: 200px;"></ul>
      <button id="invite-all-btn" style="margin-top:10px;">Invite All</button>
      <div id="status" style="margin-top:10px; font-size:0.9rem; color:#333; min-height: 24px;"></div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('button[title="Close"]').onclick = () => modal.remove();

    const userInput = modal.querySelector('#username-input');
    const loadUserBtn = modal.querySelector('#load-user-btn');
    const userListEl = modal.querySelector('#user-list');
    const inviteAllBtn = modal.querySelector('#invite-all-btn');
    const statusEl = modal.querySelector('#status');

    let offset = 0;
    let currentUsers = [];
    let currentUsername = userInput.value.trim();
    let invitedUsers = getInvitedUsers();
    let stopLoading = false;
    const liMap = new Map(); // username => <li>

    function updateStatus(msg) {
      statusEl.textContent = msg;
    }

    async function loadAllUsers(reset = false) {
      if (reset) {
        offset = 0;
        currentUsers = [];
        invitedUsers = getInvitedUsers();
        userListEl.innerHTML = '';
        stopLoading = false;
      }

      loadUserBtn.disabled = true;
      updateStatus('Loading all followers in batches...');

      while (!stopLoading) {
        try {
          const batch = await fetchUsers(currentUsername, offset);
          if (batch.length === 0) break;

          const filtered = batch.filter(u => !invitedUsers.includes(u));
          currentUsers.push(...filtered);

          for (const user of filtered) {
            const li = document.createElement('li');
            li.textContent = user;
            li.style.color = '#666';
            userListEl.appendChild(li);
            liMap.set(user, li);
          }

          offset += 40;
          updateStatus(`Loaded ${currentUsers.length} users...`);
          await new Promise(r => setTimeout(r, 500));
        } catch (e) {
          updateStatus('Failed to fetch more users.');
          break;
        }
      }

      updateStatus(`Finished loading ${currentUsers.length} new followers`);
      loadUserBtn.disabled = false;
    }

    async function inviteAll() {
      if (currentUsers.length === 0) {
        updateStatus('No users to invite.');
        return;
      }
      updateStatus(`Loaded ${currentUsers.length} users...`);
      inviteAllBtn.disabled = true;
      loadUserBtn.disabled = true;

      for (let i = 0; i < currentUsers.length; i++) {
        const user = currentUsers[i];
        const li = liMap.get(user);
        updateStatus(`Inviting ${user} (${i + 1} / ${currentUsers.length})`);

        const success = await inviteUser(user);
        if (success) {
          li.textContent = `✅ ${user}`;
          li.style.color = 'green';
          saveInvitedUser(user);
          updateStatus(`✅ Invited ${user} (${i + 1} / ${currentUsers.length})`);
        } else {
          li.textContent = `❌ ${user}`;
          li.style.color = 'red';
          updateStatus(`❌ Failed to invite ${user} (${i + 1} / ${currentUsers.length})`);
        }

        await new Promise(r => setTimeout(r, 500));
      }

      updateStatus('All invitations complete!');
      currentUsers = [];
      inviteAllBtn.disabled = false;
      loadUserBtn.disabled = false;
    }

    loadUserBtn.onclick = async () => {
      const inputUser = userInput.value.trim();
      if (!inputUser) {
        updateStatus('Please enter a username.');
        return;
      }
      updateStatus('Checking user...');
      loadUserBtn.disabled = true;
      const exists = await checkUserExists(inputUser);
      if (!exists) {
        updateStatus('User not found.');
        loadUserBtn.disabled = false;
        return;
      }
      currentUsername = inputUser;
      await loadAllUsers(true);
    };

    inviteAllBtn.onclick = inviteAll;

    await loadAllUsers(true);
  }

})();
