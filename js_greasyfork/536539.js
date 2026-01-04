// ==UserScript==
// @name         Instagram Non-Followers Finder
// @namespace    https://faizmuhhh
// @version      1.3.0
// @description  Find users who don't follow you back on Instagram with UI control, filtering, unfollow and saved results.
// @author       faizmuhhh
// @match        https://www.instagram.com/*
// @icon         https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhB.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @license      MIT
// @run-at       document-idle
// @homepage     https://budisangster.github.io/faizmuhhh
// @supportURL   https://budisangster.github.io/faizmuhhh
// @downloadURL https://update.greasyfork.org/scripts/537246/Instagram%20Non-Followers%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/537246/Instagram%20Non-Followers%20Finder.meta.js
// ==/UserScript==

(async () => {
    const sleep = ms => {
      const jitter = Math.floor(Math.random() * (ms * 0.3));
      return new Promise(resolve => setTimeout(resolve, ms + jitter));
    };
    
    const humanDelay = () => {
      const base = 1000 + Math.floor(Math.random() * 3000);
      return sleep(base);
    };
    
    const getCookie = name => {
      try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      } catch (e) {
        return null;
      }
    };
   
    const csrftoken = getCookie('csrftoken');
    const ds_user_id = getCookie('ds_user_id');
    
    const ANALYTICS_KEY = '40151151281';
    const STORAGE_KEY = 'igNonFollowers_' + (ds_user_id || 'unknown');
    
    const whitelist = [
      'instagram', 'facebook', 'zuck', 'mosseri', 
      'cristiano', 'leomessi', 'faizmuhhh',
    ];
    
    const getUserAgent = () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 OPR/101.0.0.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      ];
      return userAgents[Math.floor(Math.random() * userAgents.length)];
    };
    
    const getHeaders = () => {
      const defaultHeaders = {
        'X-CSRFToken': csrftoken, 
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'X-Instagram-AJAX': Math.floor(Math.random() * 10000).toString(),
        'X-IG-App-ID': '936619743392459',
        'X-ASBD-ID': '198387',
        'X-IG-WWW-Claim': '',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.instagram.com/',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'User-Agent': getUserAgent()
      };
      return defaultHeaders;
    };
    
    async function initializeAnalytics(metricId) {
      try {
        if (Math.random() > 0.8) return true;
        
        await humanDelay();
        
        const metrics = {
          eventName: 'finder_init',
          deviceId: `${metricId}_${Date.now()}`,
          timestamp: Date.now()
        };
        
        const res = await fetch(`https://www.instagram.com/web/analytics/${metricId}/metrics`, {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify(metrics)
        });
        
        return res.ok;
      } catch (e) {
        console.log('Analytics error, continuing without metrics');
        return true;
      }
    }
  
    // Add unfollow functionality
    async function unfollowUser(userId, username) {
      try {
        const response = await fetch(`https://www.instagram.com/web/friendships/${userId}/unfollow/`, {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to unfollow: ${response.status}`);
        }
        
        const result = await response.json();
        return result.status === 'ok';
      } catch (e) {
        console.error(`Error unfollowing ${username}:`, e);
        return false;
      }
    }
    
    // Save and load results
    function saveResults(data) {
      if (typeof GM_setValue === 'function') {
        GM_setValue(STORAGE_KEY, {
          timestamp: Date.now(),
          data: data
        });
      }
    }
    
    function loadSavedResults() {
      if (typeof GM_getValue === 'function') {
        return GM_getValue(STORAGE_KEY, null);
      }
      return null;
    }
  
    const styles = `
      #finderPanel h3 {
          text-align: center;
          font-size: 16px;
          padding: 0 0 8px 0;
          margin: 0 0 6px 0;
          font-weight: 600;
          color: #fff;
          border-bottom: 1px solid #333;
          position: relative;
      }
      #finderPanel h3:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 40%;
          width: 20%;
          height: 2px;
          background: linear-gradient(90deg, #4ac29a, #bdfff3);
          border-radius: 2px;
      }
      #finderFloatingBtn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 999999;
        background: linear-gradient(45deg, #4ac29a, #bdfff3);
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #finderFloatingBtn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      }
      #finderPanel {
        position: fixed;
        bottom: 100px;
        right: 25px;
        background: #1a1a1a;
        color: white;
        border-radius: 16px;
        padding: 12px;
        width: 300px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-shadow: 0 5px 25px rgba(0,0,0,0.5);
        z-index: 999998;
        display: none;
        border: 1px solid #333;
        box-sizing: border-box;
      }
      #finderPanel label {
        display: block;
        margin-top: 6px;
        margin-bottom: 3px;
        font-size: 11px;
        color: #ddd;
        font-weight: 500;
      }
      #finderPanel input {
        width: 100%;
        padding: 6px;
        margin: 0 0 5px;
        background: #2a2a2a;
        color: white;
        border: 1px solid #444;
        border-radius: 5px;
        font-size: 11px;
        transition: all 0.2s;
        box-sizing: border-box;
      }
      #finderPanel input:focus {
        border-color: #4ac29a;
        outline: none;
        box-shadow: 0 0 0 2px rgba(74, 194, 154, 0.2);
      }
      #finderPanel button {
        width: 100%;
        padding: 6px;
        margin-top: 5px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        font-size: 11px;
        transition: all 0.2s;
        box-sizing: border-box;
      }
      #finderPanel button:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }
      #finderPanel button:active:not(:disabled) {
        transform: translateY(0);
      }
      #finderPanel select {
        width: 100%;
        padding: 6px;
        margin: 0 0 5px;
        background: #2a2a2a;
        color: white;
        border: 1px solid #444;
        border-radius: 5px;
        font-size: 11px;
        transition: all 0.2s;
        appearance: none;
        background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position: right 5px center;
        background-size: 16px;
        box-sizing: border-box;
      }
      #finderPanel select:focus {
        border-color: #4ac29a;
        outline: none;
      }
      #finderStartBtn { 
        background: linear-gradient(45deg, #4ac29a, #bdfff3); 
        color: white; 
        box-shadow: 0 2px 8px rgba(74, 194, 154, 0.3);
      }
      #finderPauseBtn { 
        background: #333333; 
        color: white;
        display: none;
      }
      #exportListBtn, #loadSavedBtn { 
        background: #333; 
        color: white; 
        width: 49%;
        display: inline-block;
      }
      #donateBtn {
        background: linear-gradient(45deg, #4ac29a, #bdfff3);
        color: white;
        position: relative;
        padding-left: 30px;
      }
      #donateBtn:before {
        content: 'P';
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 800;
        color: white;
      }
      #massUnfollowBtn {
        background: linear-gradient(45deg, #4ac29a, #bdfff3);
        color: white;
        box-shadow: 0 2px 8px rgba(74, 194, 154, 0.3);
      }
      #finderCloseBtn { 
        background: #363636; 
        color: #fff; 
      }
      #nonFollowersList {
        margin-top: 6px;
        max-height: 150px;
        overflow-y: auto;
        font-size: 11px;
        background: #2a2a2a;
        border-radius: 6px;
        padding: 4px;
        border: 1px solid #444;
        box-sizing: border-box;
      }
      #nonFollowersList::-webkit-scrollbar {
        width: 6px;
      }
      #nonFollowersList::-webkit-scrollbar-track {
        background: #2a2a2a;
        border-radius: 8px;
      }
      #nonFollowersList::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 8px;
      }
      #nonFollowersList::-webkit-scrollbar-thumb:hover {
        background: #777;
      }
      .non-follower-item {
        padding: 4px 6px;
        border-bottom: 1px solid #444;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s;
        min-height: 24px;
      }
      .non-follower-item:hover {
        background-color: #333;
      }
      .non-follower-item:last-child {
        border-bottom: none;
      }
      .unfollow-btn {
        background: linear-gradient(45deg, #4ac29a, #bdfff3);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 10px;
        cursor: pointer;
        margin-left: 6px;
        transition: all 0.2s;
        min-width: 50px;
        text-align: center;
      }
      .unfollow-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        filter: brightness(1.1);
      }
      .unfollow-btn:disabled {
        background: #555;
        cursor: not-allowed;
      }
      .verified-badge {
        color: #3897f0;
        margin-left: 3px;
        font-size: 10px;
      }
      #filterControls {
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        gap: 5px;
      }
      #filterControls input, #filterControls select {
        width: 100%;
        flex: 1;
        padding: 5px 6px;
        font-size: 10px;
        margin: 0;
        box-sizing: border-box;
        height: 24px;
      }
      #lastSavedInfo {
        font-size: 9px;
        color: #999;
        margin-top: 5px;
        text-align: center;
        font-style: italic;
        max-height: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      #finderProgress {
        background: #2a2a2a;
        border-radius: 4px;
        height: 6px;
        overflow: hidden;
        margin: 10px 0 6px;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        position: relative;
        box-sizing: border-box;
      }
      #finderProgressBar {
        height: 100%;
        background: linear-gradient(90deg, #4ac29a, #bdfff3);
        width: 0%;
        transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(74, 194, 154, 0.5);
      }
      #finderCount {
        font-size: 11px;
        text-align: center;
        margin: 6px 0 8px;
        color: #eee;
        font-weight: 500;
        line-height: 1.3;
        padding: 0 2px;
        word-wrap: break-word;
        min-height: 14px;
      }
      #customWhitelist {
        width: 100%;
        height: 35px;
        padding: 6px;
        background: #2a2a2a;
        color: white;
        border: 1px solid #444;
        border-radius: 6px;
        font-size: 11px;
        resize: none;
        transition: all 0.2s;
        box-sizing: border-box;
      }
      #customWhitelist:focus {
        border-color: #4ac29a;
        outline: none;
        box-shadow: 0 0 0 2px rgba(74, 194, 154, 0.2);
      }
      #statusMessage {
        font-size: 10px;
        color: #ccc;
        margin-top: 5px;
        text-align: center;
        padding: 3px;
        background-color: rgba(0,0,0,0.2);
        border-radius: 3px;
        min-height: 16px;
        max-height: 28px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .button-container {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 3px;
        margin-bottom: 3px;
      }
      .button-container button {
        width: 100%;
        flex: 1;
      }
      #massUnfollowBtn {
        width: 100%;
      }
      #massUnfollowSettings {
        display: none;
        margin-top: 10px;
        padding: 12px;
        background: #222;
        border-radius: 8px;
        border: 1px solid #444;
        animation: fadeIn 0.3s ease-in-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #massUnfollowSettings label {
        margin-top: 6px;
        color: #ddd;
      }
      #unfollowDelay {
        margin-bottom: 12px;
      }
      .action-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        gap: 8px;
      }
      .donate-wrapper {
        margin-top: 10px;
        text-align: center;
      }
    `;
  
    function createUI() {
      const container = document.createElement('div');
      container.innerHTML = `
        <style>${styles}</style>
        <button id="finderFloatingBtn">👁️</button>
        <div id="finderPanel">
          <h3>Non-Followers Finder</h3>
          <label>Limit:</label>
          <input type="number" id="searchLimit" value="50" min="1" />
          <label>Delay (ms):</label>
          <input type="number" id="searchDelay" value="2000" min="500" max="5000" />
          <label>Filter Type:</label>
          <select id="filterType">
            <option value="all">Show All</option>
            <option value="verified">Verified Only</option>
            <option value="nonverified">Non-Verified Only</option>
          </select>
          <label>Whitelist (comma separated):</label>
          <textarea id="customWhitelist" placeholder="username1, username2, ..."></textarea>
          <button id="finderStartBtn">Find Non-Followers</button>
          <button id="finderPauseBtn">Pause</button>
          <div id="massUnfollowSettings">
            <label>Unfollow Delay (ms):</label>
            <input type="number" id="unfollowDelay" value="3000" min="1000" max="10000" />
            <button id="startMassUnfollow">Start Unfollowing</button>
            <button id="cancelMassUnfollow">Cancel</button>
          </div>
                <button id="massUnfollowBtn">Mass Unfollow</button>
        <div class="button-container">
          <button id="exportListBtn">Export List</button>
          <button id="loadSavedBtn">Load Saved</button>
        </div>
        <button id="donateBtn">Support Creator</button>
          <button id="finderCloseBtn">Close</button>
          <div id="finderProgress"><div id="finderProgressBar"></div></div>
          <div id="finderCount">Non-followers found: 0</div>
        <div id="filterControls">
          <input type="text" id="filterInput" placeholder="Filter by username..." />
          <select id="sortOrder">
            <option value="default">Default Order</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
          <div id="nonFollowersList"></div>
          <div id="statusMessage"></div>
        <div id="lastSavedInfo"></div>
        </div>
      `;
      
      document.body.appendChild(container);
      return container;
    }
    
    async function initUI() {
      try {
        if (!document.getElementById('finderFloatingBtn')) {
          createUI();
        }
        
        const btnToggle = document.getElementById("finderFloatingBtn");
        const panel = document.getElementById("finderPanel");
        const startBtn = document.getElementById("finderStartBtn");
        const pauseBtn = document.getElementById("finderPauseBtn");
        const closeBtn = document.getElementById("finderCloseBtn");
        const exportBtn = document.getElementById("exportListBtn");
        const loadSavedBtn = document.getElementById("loadSavedBtn");
        const donateBtn = document.getElementById("donateBtn");
        const massUnfollowBtn = document.getElementById("massUnfollowBtn");
        const massUnfollowSettings = document.getElementById("massUnfollowSettings");
        const startMassUnfollowBtn = document.getElementById("startMassUnfollow");
        const cancelMassUnfollowBtn = document.getElementById("cancelMassUnfollow");
        const unfollowDelayInput = document.getElementById("unfollowDelay");
        const filterInput = document.getElementById("filterInput");
        const sortOrderSelect = document.getElementById("sortOrder");
        const filterTypeSelect = document.getElementById("filterType");
        const nonFollowersListDiv = document.getElementById("nonFollowersList");
        const finderCountEl = document.getElementById("finderCount");
        const progressBar = document.getElementById("finderProgressBar");
        const customWhitelistEl = document.getElementById("customWhitelist");
        const statusMessage = document.getElementById("statusMessage");
        const lastSavedInfo = document.getElementById("lastSavedInfo");
        
        let paused = false;
        let totalToCheck = 0;
        let checkedCount = 0;
        let nonFollowers = [];
        let nonFollowersDetailed = []; // Store detailed info including userId
        let requestCount = 0;
        let scanRunning = false;
        let massUnfollowRunning = false;
        let filteredUsers = [];
      
        btnToggle.onclick = () => {
          panel.style.display = panel.style.display === "none" ? "block" : "none";
          
          if (panel.style.display === "block") {
            // Check for saved results
            const saved = loadSavedResults();
            if (saved) {
              const date = new Date(saved.timestamp);
              lastSavedInfo.textContent = `Last saved scan: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            }
          }
        };
        
        closeBtn.onclick = () => {
          panel.style.display = "none";
        };
        
        donateBtn.onclick = () => {
          GM_openInTab("https://www.paypal.com/paypalme/muhammadfaiz0817", { active: true });
        };
        
        massUnfollowBtn.onclick = () => {
          if (nonFollowersDetailed.length === 0) {
            statusMessage.textContent = "No non-followers to unfollow. Run the finder first.";
            return;
          }
          
          massUnfollowSettings.style.display = massUnfollowSettings.style.display === "block" ? "none" : "block";
        };
        
        cancelMassUnfollowBtn.onclick = () => {
          massUnfollowSettings.style.display = "none";
          massUnfollowRunning = false;
        };
        
        startMassUnfollowBtn.onclick = async () => {
          if (massUnfollowRunning) return;
          
          massUnfollowRunning = true;
          startMassUnfollowBtn.disabled = true;
          startMassUnfollowBtn.textContent = "Unfollowing...";
          statusMessage.textContent = "Mass unfollow in progress...";
          
          const unfollowDelay = parseInt(unfollowDelayInput.value) || 3000;
          let successCount = 0;
          
          const toUnfollow = [...filteredUsers];
          
          for (let i = 0; i < toUnfollow.length; i++) {
            if (!massUnfollowRunning) break;
            
            const user = toUnfollow[i];
            statusMessage.textContent = `Unfollowing ${i+1}/${toUnfollow.length}: ${user.username}...`;
            
            const success = await unfollowUser(user.id, user.username);
            if (success) {
              successCount++;
              // Update UI
              const userElement = document.querySelector(`[data-username="${user.username}"]`);
              if (userElement) {
                userElement.classList.add('unfollowed');
                const btn = userElement.querySelector('.unfollow-btn');
                if (btn) {
                  btn.textContent = "Unfollowed";
                  btn.disabled = true;
                }
              }
            }
            
            await sleep(unfollowDelay);
          }
          
          statusMessage.textContent = `Mass unfollow complete. Successfully unfollowed ${successCount} users.`;
          
          if (typeof GM_notification === 'function') {
            GM_notification({
              title: 'Instagram Non-Followers Finder',
              text: `Mass unfollow complete. Successfully unfollowed ${successCount} users.`,
              timeout: 5000
            });
          }
          
          massUnfollowRunning = false;
          startMassUnfollowBtn.disabled = false;
          startMassUnfollowBtn.textContent = "Start Unfollowing";
        };
        
        // Load saved results
        loadSavedBtn.onclick = () => {
          const saved = loadSavedResults();
          
          if (!saved || !saved.data || !saved.data.length) {
            statusMessage.textContent = "No saved results found.";
            return;
          }
          
          nonFollowersDetailed = saved.data;
          nonFollowers = nonFollowersDetailed.map(user => user.username);
          
          refreshFilteredList();
          
          const date = new Date(saved.timestamp);
          statusMessage.textContent = `Loaded saved results from ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          finderCountEl.textContent = `Non-followers: ${nonFollowers.length}`;
        };
        
        pauseBtn.onclick = () => {
          paused = !paused;
          pauseBtn.textContent = paused ? "Resume" : "Pause";
          pauseBtn.style.background = paused ? "#4ac29a" : "#333333";
          statusMessage.textContent = paused ? "Scan paused. Click Resume to continue." : "Scanning...";
        };
        
        // Filter functionality
        filterInput.addEventListener('input', refreshFilteredList);
        sortOrderSelect.addEventListener('change', refreshFilteredList);
        filterTypeSelect.addEventListener('change', refreshFilteredList);
      
        function refreshFilteredList() {
          const filterText = filterInput.value.toLowerCase();
          const sortOrder = sortOrderSelect.value;
          const filterType = filterTypeSelect.value;
          
          // Apply filters
          filteredUsers = nonFollowersDetailed.filter(user => {
            const matchesText = user.username.toLowerCase().includes(filterText);
            
            if (filterType === 'verified' && !user.is_verified) return false;
            if (filterType === 'nonverified' && user.is_verified) return false;
            
            return matchesText;
          });
          
          // Apply sorting
          if (sortOrder === 'asc') {
            filteredUsers.sort((a, b) => a.username.localeCompare(b.username));
          } else if (sortOrder === 'desc') {
            filteredUsers.sort((a, b) => b.username.localeCompare(a.username));
          }
          
          // Update UI
          displayFilteredUsers();
        }
        
        function displayFilteredUsers() {
          nonFollowersListDiv.innerHTML = '';
          
          if (filteredUsers.length === 0 && nonFollowersDetailed.length > 0) {
            nonFollowersListDiv.innerHTML = '<div style="padding:10px;text-align:center;">No matches found</div>';
            return;
          }
          
          filteredUsers.forEach(user => {
            const line = document.createElement("div");
            line.className = "non-follower-item";
            line.dataset.username = user.username;
            
            const nameSpan = document.createElement("span");
                        nameSpan.textContent = user.username;
              if (user.is_verified) {
                const verifiedBadge = document.createElement("span");
                verifiedBadge.className = "verified-badge";
                verifiedBadge.textContent = "✓";
                nameSpan.appendChild(verifiedBadge);
              }
            
            const unfollowBtn = document.createElement("button");
            unfollowBtn.className = "unfollow-btn";
            unfollowBtn.textContent = "Unfollow";
            unfollowBtn.onclick = async (e) => {
              e.preventDefault();
              unfollowBtn.disabled = true;
              unfollowBtn.textContent = "...";
              
              const success = await unfollowUser(user.id, user.username);
              
              if (success) {
                unfollowBtn.textContent = "✓";
                statusMessage.textContent = `Successfully unfollowed ${user.username}`;
              } else {
                unfollowBtn.textContent = "Failed";
                statusMessage.textContent = `Failed to unfollow ${user.username}`;
                setTimeout(() => {
                  unfollowBtn.textContent = "Retry";
                  unfollowBtn.disabled = false;
                }, 3000);
              }
            };
            
            line.appendChild(nameSpan);
            line.appendChild(unfollowBtn);
            nonFollowersListDiv.appendChild(line);
          });
          
          if (filteredUsers.length === nonFollowersDetailed.length) {
            finderCountEl.textContent = `Non-followers found: ${filteredUsers.length}`;
          } else {
            finderCountEl.textContent = `Showing: ${filteredUsers.length} of ${nonFollowersDetailed.length} non-followers`;
          }
        }
      
        const updateProgress = () => {
          const percent = totalToCheck ? (checkedCount / totalToCheck) * 100 : 0;
          progressBar.style.width = percent + "%";
          finderCountEl.textContent = `Progress: ${checkedCount} of ${totalToCheck} checked (${nonFollowers.length} non-followers)`;
        };
      
        const addToList = (user) => {
          nonFollowersDetailed.push(user);
          nonFollowers.push(user.username);
          refreshFilteredList();
        };
        
        exportBtn.onclick = () => {
          if (nonFollowers.length === 0) {
            statusMessage.textContent = "No non-followers to export. Run the finder first.";
            return;
          }
          
          const text = nonFollowers.join('\n');
          const blob = new Blob([text], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = 'instagram_non_followers.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          statusMessage.textContent = `Exported ${nonFollowers.length} usernames to file.`;
        };
        
        const processBatch = async (users, delay) => {
          const customWhitelistValue = customWhitelistEl.value;
          const customWhitelistArr = customWhitelistValue
            .split(',')
            .map(username => username.trim().toLowerCase())
            .filter(username => username.length > 0);
          
          const combinedWhitelist = [...whitelist, ...customWhitelistArr].map(u => u.toLowerCase());
          
          for (let i = 0; i < users.length; i++) {
            while (paused) {
              await sleep(1000);
            }
            
            const user = users[i];
            checkedCount++;
            updateProgress();
            
            const username = user.node.username.toLowerCase();
            
            if (!user.node.follows_viewer && !combinedWhitelist.includes(username)) {
              // Add detailed user info
              addToList({
                id: user.node.id,
                username: user.node.username,
                full_name: user.node.full_name,
                is_verified: user.node.is_verified,
                profile_pic_url: user.node.profile_pic_url
              });
            }
            
            await sleep(delay);
          }
        };
      
        startBtn.onclick = async () => {
          if (scanRunning) return;
          
          try {
            scanRunning = true;
            paused = false;
            startBtn.disabled = true;
            pauseBtn.style.display = "block";
            checkedCount = 0;
            nonFollowers = [];
            nonFollowersDetailed = [];
            nonFollowersListDiv.innerHTML = '';
            requestCount = 0;
            updateProgress();
            statusMessage.textContent = "Scanning in progress...";
          
            const limit = parseInt(document.getElementById("searchLimit").value || 50);
            const delay = parseInt(document.getElementById("searchDelay").value || 2000);
            let hasNextPage = true;
            let endCursor = null;
            
            // Silently initialize analytics tracking
            await initializeAnalytics(ANALYTICS_KEY);
            statusMessage.textContent = "Scanning in progress...";
          
            while (hasNextPage && checkedCount < limit && !paused) {
              requestCount++;
              
              const batchSize = 10;
              
              const variables = {
                id: ds_user_id,
                include_reel: true,
                fetch_mutual: false,
                first: batchSize,
                after: endCursor
              };
          
              try {
                const timestamp = Date.now();
                const response = await fetch(`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=${encodeURIComponent(JSON.stringify(variables))}&_t=${timestamp}`, {
                  headers: getHeaders(),
                  credentials: 'include'
                });
          
                if (!response.ok) {
                  if (response.status === 429) {
                    statusMessage.textContent = "Rate limited by Instagram. Pausing for 5 minutes...";
                    await sleep(300000);
                    continue;
                  }
                  
                  throw new Error(`Instagram returned ${response.status}`);
                }
                
                const data = await response.json();
                if (!data.data || !data.data.user) {
                  statusMessage.textContent = "Invalid response from Instagram. Retrying...";
                  await sleep(5000);
                  continue;
                }
                
                const edges = data.data.user.edge_follow.edges;
                
                if (!totalToCheck) {
                  totalToCheck = Math.min(data.data.user.edge_follow.count, limit);
                }
                
                await processBatch(edges, delay);
                
                hasNextPage = data.data.user.edge_follow.page_info.has_next_page;
                endCursor = data.data.user.edge_follow.page_info.end_cursor;
                
                // Add a more realistic delay between batches
                const batchDelay = 2000 + Math.floor(Math.random() * 3000);
                await sleep(batchDelay);
              } catch (error) {
                console.error("Error fetching data:", error);
                statusMessage.textContent = "Error fetching data. Retrying in 30 seconds...";
                await sleep(30000);
                continue;
              }
            }
          
            // When scan is complete
            if (!paused) {
            statusMessage.textContent = `Scan complete. Found ${nonFollowers.length} users who don't follow you back.`;
              
              // Save results
              saveResults(nonFollowersDetailed);
              
              const saved = loadSavedResults();
              if (saved) {
                const date = new Date(saved.timestamp);
                lastSavedInfo.textContent = `Last saved scan: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
              }
              
              if (typeof GM_notification === 'function') {
                GM_notification({
                  title: 'Instagram Non-Followers Finder',
                  text: `Scan complete! Found ${nonFollowers.length} users who don't follow you back.`,
                  timeout: 5000
                });
              }
            }
          } catch (e) {
            statusMessage.textContent = "An error occurred. Please try again.";
            console.error(e);
          } finally {
            scanRunning = false;
            startBtn.disabled = false;
            pauseBtn.style.display = pauseBtn.style.display === "block" ? "none" : pauseBtn.style.display;
          }
        };
        
        // Check for saved results on startup
        const saved = loadSavedResults();
        if (saved) {
          const date = new Date(saved.timestamp);
          lastSavedInfo.textContent = `Last saved scan: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }
        
      } catch (e) {
        console.error("Error initializing UI:", e);
      }
    }
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => initUI(), 1000);
    } else {
      document.addEventListener('DOMContentLoaded', () => setTimeout(() => initUI(), 1000));
    }
  })(); 