// ==UserScript==
// @name        Reddit Activity Monitor
// @namespace   https://justanotherenemy.com
// @description Get notified when specific Reddit activities occur
// @match       https://*.reddit.com/*
// @grant       GM_notification
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/528483/Reddit%20Activity%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/528483/Reddit%20Activity%20Monitor.meta.js
// ==/UserScript==

// Initial configuration
let CONFIG = GM_getValue('redditMonitorConfig', {
  monitorSubreddits: ['insertsubredditname'],
  monitorUsers: ['INSERT-USER-NAME'],
  monitorThreads: [],
  refreshInterval: 60000, // 1 minute in ms
  maxNotifications: 5,
  enabled: true
});

// Store for previously seen content
let seenContent = GM_getValue('seenContent', {
  posts: {},
  comments: {}
});

// Add styles for the UI - IMPROVED COLORS FOR BETTER VISIBILITY
GM_addStyle(`
  #reddit-monitor-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    background-color: #1a1a1a;
    border: 1px solid #444;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.4);
    z-index: 9999;
    font-family: Arial, sans-serif;
    max-height: 500px;
    overflow: hidden;
    color: #e0e0e0;
  }

  #reddit-monitor-panel.collapsed {
    width: 200px;
    height: 40px;
    overflow: hidden;
  }

  #reddit-monitor-header {
    background-color: #ff4500;
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    font-weight: bold;
  }

  #reddit-monitor-content {
    padding: 15px;
    max-height: 450px;
    overflow-y: auto;
    background-color: #2a2a2a;
  }

  .tab-buttons {
    display: flex;
    margin-bottom: 15px;
    border-bottom: 1px solid #444;
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 8px 15px;
    cursor: pointer;
    background: #444;
    color: #e0e0e0;
    border: none;
    outline: none;
    margin-right: 2px;
    margin-bottom: 2px;
    border-radius: 4px 4px 0 0;
  }

  .tab-button:hover {
    background: #555;
  }

  .tab-button.active {
    background: #ff4500;
    color: white;
    font-weight: bold;
  }

  .tab-content {
    display: none;
    margin-top: 10px;
  }

  .tab-content.active {
    display: block;
  }

  .input-group {
    margin-bottom: 15px;
  }

  .input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #e0e0e0;
  }

  .input-group input, .input-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #555;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 5px;
    background-color: #333;
    color: #e0e0e0;
  }

  .input-group input:focus, .input-group select:focus {
    border-color: #ff4500;
    outline: none;
  }

  .monitor-list {
    margin-top: 15px;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #444;
    padding: 5px;
    background-color: #333;
    border-radius: 4px;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid #444;
    align-items: center;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .list-item button {
    background: none;
    border: none;
    color: #ff7555;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    padding: 0 5px;
  }

  .list-item button:hover {
    color: #ff4500;
  }

  .save-settings, .add-item-btn {
    background-color: #ff4500;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5px;
    display: inline-block;
    width: auto;
    font-weight: bold;
  }

  .save-settings:hover, .add-item-btn:hover {
    background-color: #ff6a33;
  }

  .status-toggle {
    margin-top: 15px;
    display: flex;
    align-items: center;
    color: #e0e0e0;
  }

  .status-toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
    margin-left: 10px;
  }

  .status-toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #555;
    transition: .4s;
    border-radius: 24px;
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .toggle-slider {
    background-color: #5cb85c;
  }

  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }

  .notification-log {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #444;
    padding: 10px;
    margin-top: 10px;
    background-color: #333;
    border-radius: 4px;
  }

  .notification-item {
    padding: 8px 0;
    border-bottom: 1px solid #444;
    font-size: 13px;
  }

  .notification-item:last-child {
    border-bottom: none;
  }

  .notification-item a {
    color: #4da3ff;
    text-decoration: none;
  }

  .notification-item a:hover {
    text-decoration: underline;
    color: #7ab9ff;
  }

  .notification-item .time {
    color: #aaa;
    font-size: 11px;
    margin-top: 3px;
  }
`);

// Create log storage if it doesn't exist
let notificationLog = GM_getValue('notificationLog', []);

// Create the UI panel
function createUI() {
  // Remove any existing panel first (for updates/reloads)
  const existingPanel = document.getElementById('reddit-monitor-panel');
  if (existingPanel) {
    existingPanel.remove();
  }

  const panel = document.createElement('div');
  panel.id = 'reddit-monitor-panel';

  // Create header
  const header = document.createElement('div');
  header.id = 'reddit-monitor-header';
  header.innerHTML = `<span>Reddit Activity Monitor</span><span id="panel-toggle">−</span>`;

  // Create content area as a div (not innerHTML)
  const content = document.createElement('div');
  content.id = 'reddit-monitor-content';

  // Create tabs container
  const tabButtons = document.createElement('div');
  tabButtons.className = 'tab-buttons';

  // Create individual tab buttons
  const tabs = ['settings', 'subreddits', 'users', 'threads', 'log'];
  tabs.forEach(tab => {
    const button = document.createElement('button');
    button.className = 'tab-button';
    if (tab === 'settings') button.classList.add('active');
    button.setAttribute('data-tab', tab);
    button.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
    button.addEventListener('click', (e) => {
      // Update active button
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      // Update active tab
      document.querySelectorAll('.tab-content').forEach(tabContent => tabContent.classList.remove('active'));
      document.getElementById(`${tab}-tab`).classList.add('active');
    });
    tabButtons.appendChild(button);
  });

  // Add tab buttons to content
  content.appendChild(tabButtons);

  // Create Settings Tab
  const settingsTab = document.createElement('div');
  settingsTab.className = 'tab-content active';
  settingsTab.id = 'settings-tab';

  settingsTab.innerHTML = `
    <div class="input-group">
      <label for="refresh-interval">Refresh Interval (seconds)</label>
      <input type="number" id="refresh-interval" min="30" value="${CONFIG.refreshInterval/1000}">
    </div>
    <div class="input-group">
      <label for="max-notifications">Max Notifications Per Check</label>
      <input type="number" id="max-notifications" min="1" max="20" value="${CONFIG.maxNotifications}">
    </div>
    <div class="status-toggle">
      <span>Monitor Status:</span>
      <label class="status-toggle-switch">
        <input type="checkbox" id="monitor-enabled" ${CONFIG.enabled ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    </div>
    <button class="save-settings" id="save-settings-btn">Save Settings</button>
  `;

  // Create Subreddits Tab
  const subredditsTab = document.createElement('div');
  subredditsTab.className = 'tab-content';
  subredditsTab.id = 'subreddits-tab';

  subredditsTab.innerHTML = `
    <div class="input-group">
      <label for="new-subreddit">Add Subreddit (without r/)</label>
      <input type="text" id="new-subreddit" placeholder="Enter subreddit name">
      <button class="add-item-btn" id="add-subreddit-btn">Add</button>
    </div>
    <div class="monitor-list" id="subreddit-list">
      ${generateListHTML(CONFIG.monitorSubreddits, 'subreddit')}
    </div>
  `;

  // Create Users Tab
  const usersTab = document.createElement('div');
  usersTab.className = 'tab-content';
  usersTab.id = 'users-tab';

  usersTab.innerHTML = `
    <div class="input-group">
      <label for="new-user">Add User (without u/)</label>
      <input type="text" id="new-user" placeholder="Enter username">
      <button class="add-item-btn" id="add-user-btn">Add</button>
    </div>
    <div class="monitor-list" id="user-list">
      ${generateListHTML(CONFIG.monitorUsers, 'user')}
    </div>
  `;

  // Create Threads Tab
  const threadsTab = document.createElement('div');
  threadsTab.className = 'tab-content';
  threadsTab.id = 'threads-tab';

  threadsTab.innerHTML = `
    <div class="input-group">
      <label for="new-thread">Add Thread ID or URL</label>
      <input type="text" id="new-thread" placeholder="Enter thread ID or Reddit URL">
      <button class="add-item-btn" id="add-thread-btn">Add</button>
    </div>
    <div class="monitor-list" id="thread-list">
      ${generateListHTML(CONFIG.monitorThreads, 'thread')}
    </div>
  `;

  // Create Log Tab
  const logTab = document.createElement('div');
  logTab.className = 'tab-content';
  logTab.id = 'log-tab';

  logTab.innerHTML = `
    <h3>Recent Notifications</h3>
    <div class="notification-log" id="notification-log">
      ${generateLogHTML()}
    </div>
    <button class="save-settings" id="clear-log-btn">Clear Log</button>
  `;

  // Add tabs to content
  content.appendChild(settingsTab);
  content.appendChild(subredditsTab);
  content.appendChild(usersTab);
  content.appendChild(threadsTab);
  content.appendChild(logTab);

  // Add elements to panel
  panel.appendChild(header);
  panel.appendChild(content);

  // Add panel to page
  document.body.appendChild(panel);

  // Header click event listener
  header.addEventListener('click', function(e) {
    // Only toggle if clicking on the header itself or the toggle button
    if (e.target === header || e.target.id === 'panel-toggle') {
      togglePanel();
    }
  });

  // Settings save button
  document.getElementById('save-settings-btn').addEventListener('click', saveSettings);

  // Add item buttons
  document.getElementById('add-subreddit-btn').addEventListener('click', () => addItem('subreddit'));
  document.getElementById('add-user-btn').addEventListener('click', () => addItem('user'));
  document.getElementById('add-thread-btn').addEventListener('click', () => addItem('thread'));

  // Add event listeners to remove buttons
  addRemoveButtonListeners();

  // Clear log button
  document.getElementById('clear-log-btn').addEventListener('click', clearLog);

  // Monitor toggle
  document.getElementById('monitor-enabled').addEventListener('change', toggleMonitor);
}

// Add event listeners to all remove buttons
function addRemoveButtonListeners() {
  document.querySelectorAll('.remove-item-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const type = e.target.getAttribute('data-type');
      const value = e.target.getAttribute('data-value');
      removeItem(type, value);
    });
  });
}

// Helper function to generate list HTML
function generateListHTML(items, type) {
  if (!items || items.length === 0) {
    return '<p>No items added yet.</p>';
  }

  let html = '';
  items.forEach(item => {
    html += `
      <div class="list-item">
        <span>${item}</span>
        <button class="remove-item-btn" data-type="${type}" data-value="${item}">×</button>
      </div>
    `;
  });

  return html;
}

// Helper function to generate log HTML
function generateLogHTML() {
  if (!notificationLog || notificationLog.length === 0) {
    return '<p>No notifications yet.</p>';
  }

  let html = '';
  notificationLog.slice(0, 50).forEach(item => {
    html += `
      <div class="notification-item">
        <div><a href="${item.url}" target="_blank">${item.title}</a></div>
        <div>${item.text}</div>
        <div class="time">${new Date(item.time).toLocaleString()}</div>
      </div>
    `;
  });

  return html;
}

// Toggle panel expanded/collapsed
function togglePanel() {
  const panel = document.getElementById('reddit-monitor-panel');
  const toggle = document.getElementById('panel-toggle');

  if (panel.classList.contains('collapsed')) {
    panel.classList.remove('collapsed');
    toggle.textContent = '−';
  } else {
    panel.classList.add('collapsed');
    toggle.textContent = '+';
  }
}

// Save settings
function saveSettings() {
  const refreshIntervalInput = document.getElementById('refresh-interval');
  const maxNotificationsInput = document.getElementById('max-notifications');

  // Validate inputs
  if (!refreshIntervalInput.value || isNaN(refreshIntervalInput.value) ||
      !maxNotificationsInput.value || isNaN(maxNotificationsInput.value)) {
    alert('Please enter valid numbers for the settings.');
    return;
  }

  const refreshInterval = Math.max(30, parseInt(refreshIntervalInput.value)) * 1000;
  const maxNotifications = Math.min(20, Math.max(1, parseInt(maxNotificationsInput.value)));

  CONFIG.refreshInterval = refreshInterval;
  CONFIG.maxNotifications = maxNotifications;

  saveConfig();

  // Restart the monitor with new settings
  if (CONFIG.enabled) {
    stopMonitoring();
    startMonitoring();
  }

  alert('Settings saved!');
}

// Add item to a list
function addItem(type) {
  const input = document.getElementById(`new-${type}`);
  let value = input.value.trim();

  if (!value) {
    alert(`Please enter a ${type} to add.`);
    return;
  }

  // Process thread URLs to extract ID
  if (type === 'thread' && value.includes('reddit.com')) {
    const match = value.match(/reddit\.com\/r\/[^/]+\/comments\/([^/]+)/);
    if (match && match[1]) {
      value = match[1];
    }
  }

  // Determine which config array to update
  let targetArray;
  switch(type) {
    case 'subreddit':
      // Remove r/ prefix if present
      value = value.replace(/^r\//, '').toLowerCase();
      targetArray = CONFIG.monitorSubreddits;
      break;
    case 'user':
      // Remove u/ prefix if present
      value = value.replace(/^u\//, '');
      targetArray = CONFIG.monitorUsers;
      break;
    case 'thread':
      // Add t3_ prefix if not present
      value = value.startsWith('t3_') ? value : `t3_${value}`;
      targetArray = CONFIG.monitorThreads;
      break;
  }

  // Check if item already exists
  if (targetArray.includes(value)) {
    alert(`This ${type} is already being monitored.`);
    return;
  }

  // Add item
  targetArray.push(value);

  // Update UI
  document.getElementById(`${type}-list`).innerHTML = generateListHTML(targetArray, type);

  // Re-add event listeners for remove buttons
  addRemoveButtonListeners();

  // Clear input
  input.value = '';

  // Save config
  saveConfig();
}

// Remove item from a list
function removeItem(type, value) {
  let targetArray;
  switch(type) {
    case 'subreddit':
      targetArray = CONFIG.monitorSubreddits;
      break;
    case 'user':
      targetArray = CONFIG.monitorUsers;
      break;
    case 'thread':
      targetArray = CONFIG.monitorThreads;
      break;
  }

  // Find and remove item
  const index = targetArray.indexOf(value);
  if (index !== -1) {
    targetArray.splice(index, 1);
  }

  // Update UI
  document.getElementById(`${type}-list`).innerHTML = generateListHTML(targetArray, type);

  // Re-add event listeners for remove buttons
  addRemoveButtonListeners();

  // Save config
  saveConfig();
}

// Clear notification log
function clearLog() {
  notificationLog = [];
  GM_setValue('notificationLog', notificationLog);
  document.getElementById('notification-log').innerHTML = '<p>No notifications yet.</p>';
}

// Toggle monitoring on/off
function toggleMonitor() {
  CONFIG.enabled = document.getElementById('monitor-enabled').checked;
  saveConfig();

  if (CONFIG.enabled) {
    startMonitoring();
  } else {
    stopMonitoring();
  }
}

// Save config to GM storage
function saveConfig() {
  GM_setValue('redditMonitorConfig', CONFIG);
}

// Monitor timer reference
let monitorTimer = null;

// Start the monitoring process
function startMonitoring() {
  if (monitorTimer) {
    clearTimeout(monitorTimer);
  }
  checkForNewContent();
}

// Stop the monitoring process
function stopMonitoring() {
  if (monitorTimer) {
    clearTimeout(monitorTimer);
    monitorTimer = null;
  }
}

// Main function to periodically check for new content
function checkForNewContent() {
  if (!CONFIG.enabled) return;

  // Check subreddits for new posts
  CONFIG.monitorSubreddits.forEach(sub => {
    fetchSubredditPosts(sub);
  });

  // Check user activity
  CONFIG.monitorUsers.forEach(user => {
    fetchUserActivity(user);
  });

  // Check specific threads for new comments
  CONFIG.monitorThreads.forEach(threadId => {
    fetchThreadComments(threadId);
  });

  // Schedule next check
  monitorTimer = setTimeout(checkForNewContent, CONFIG.refreshInterval);
}

// Example function to fetch subreddit posts using Reddit JSON API
function fetchSubredditPosts(subreddit) {
  GM_xmlhttpRequest({
    method: "GET",
    url: `https://www.reddit.com/r/${subreddit}/new.json?limit=10`,
    onload: function(response) {
      try {
        const data = JSON.parse(response.responseText);
        const posts = data.data.children;

        let newPosts = [];
        for(const post of posts) {
          const postId = post.data.id;
          if(!seenContent.posts[postId]) {
            seenContent.posts[postId] = true;
            newPosts.push(post.data);
          }
        }

        // Show notifications for new posts (limited by maxNotifications)
        newPosts.slice(0, CONFIG.maxNotifications).forEach(post => {
          const title = `New post in r/${subreddit}`;
          const text = `${post.title.substring(0, 50)}${post.title.length > 50 ? '...' : ''}`;
          const url = `https://www.reddit.com${post.permalink}`;

          showNotification(title, text, url);

          // Add to log
          addToLog(title, text, url);
        });

        // Save updated seen content
        GM_setValue('seenContent', seenContent);

        // Update log in UI if log tab is open
        updateLogUI();
      } catch(e) {
        console.error("Error processing subreddit posts:", e);
      }
    }
  });
}

// Function to fetch user activity
function fetchUserActivity(username) {
  GM_xmlhttpRequest({
    method: "GET",
    url: `https://www.reddit.com/user/${username}/overview.json?limit=10`,
    onload: function(response) {
      try {
        const data = JSON.parse(response.responseText);
        const activities = data.data.children;

        let newActivities = [];
        for(const activity of activities) {
          const activityId = activity.data.id;
          const activityType = activity.data.hasOwnProperty('link_title') ? 'comment' : 'post';

          const storageKey = activityType + 's';
          if(!seenContent[storageKey]) {
            seenContent[storageKey] = {};
          }

          if(!seenContent[storageKey][activityId]) {
            seenContent[storageKey][activityId] = true;
            newActivities.push({data: activity.data, type: activityType});
          }
        }

        // Show notifications for new activities
        newActivities.slice(0, CONFIG.maxNotifications).forEach(activity => {
          const isComment = activity.type === 'comment';
          const title = `New ${isComment ? 'comment' : 'post'} by u/${username}`;
          const text = isComment ?
            `On post: ${activity.data.link_title.substring(0, 40)}...` :
            `${activity.data.title.substring(0, 50)}${activity.data.title.length > 50 ? '...' : ''}`;
          const url = `https://www.reddit.com${activity.data.permalink}`;

          showNotification(title, text, url);

          // Add to log
          addToLog(title, text, url);
        });

        // Save updated seen content
        GM_setValue('seenContent', seenContent);

        // Update log in UI if log tab is open
        updateLogUI();
      } catch(e) {
        console.error("Error processing user activity:", e);
      }
    }
  });
}

// Function to fetch thread comments
function fetchThreadComments(threadId) {
  // Extract the actual ID if it starts with t3_
  const id = threadId.startsWith('t3_') ? threadId.substring(3) : threadId;

  GM_xmlhttpRequest({
    method: "GET",
    url: `https://www.reddit.com/comments/${id}.json`,
    onload: function(response) {
      try {
        const data = JSON.parse(response.responseText);
        // The second element of the array contains the comments
        const comments = data[1].data.children;

        const newComments = [];
        processComments(comments, newComments, threadId, data[0].data.children[0].data.title);

        // Save updated seen content
        GM_setValue('seenContent', seenContent);

        // Update log in UI if log tab is open
        updateLogUI();
      } catch(e) {
        console.error("Error processing thread comments:", e);
      }
    }
  });
}

// Recursive function to process comments including replies
function processComments(comments, newComments, threadId, threadTitle) {
  for(const comment of comments) {
    // Skip non-comment items like "more" links
    if(comment.kind !== 't1') continue;

    const commentId = comment.data.id;

    if(!seenContent.comments) {
      seenContent.comments = {};
    }

    if(!seenContent.comments[commentId]) {
      seenContent.comments[commentId] = true;
      newComments.push(comment.data);

      // Limit notifications
      if(newComments.length <= CONFIG.maxNotifications) {
        const title = `New comment in thread`;
        const text = `u/${comment.data.author} on "${threadTitle.substring(0, 30)}...": ${comment.data.body.substring(0, 40)}${comment.data.body.length > 40 ? '...' : ''}`;
        const url = `https://www.reddit.com/comments/${threadId.replace('t3_', '')}/comment/${commentId}/`;

        showNotification(title, text, url);

        // Add to log
        addToLog(title, text, url);
      }
    }

    // Process replies if any
    if(comment.data.replies && comment.data.replies.data && comment.data.replies.data.children) {
      processComments(comment.data.replies.data.children, newComments, threadId, threadTitle);
    }
  }
}

// Function to show a notification
function showNotification(title, text, url) {
  GM_notification({
    title: title,
    text: text,
    timeout: 10000,
    onclick: function() {
      window.open(url, '_blank');
    }
  });
}

// Add to notification log
function addToLog(title, text, url) {
  notificationLog.unshift({
    title: title,
    text: text,
    url: url,
    time: Date.now()
  });

  // Limit log size
  if (notificationLog.length > 100) {
    notificationLog = notificationLog.slice(0, 100);
  }

  GM_setValue('notificationLog', notificationLog);
}

// Update log UI if visible
function updateLogUI() {
  const logElement = document.getElementById('notification-log');
  if (logElement) {
    logElement.innerHTML = generateLogHTML();
  }
}

// Initialize - wait for page to fully load
window.addEventListener('load', function() {
  // Short delay to ensure Reddit's UI is fully loaded
  setTimeout(function() {
    // Create UI
    createUI();

    // Start monitoring if enabled
    if (CONFIG.enabled) {
      startMonitoring();
    }
  }, 1000);
});