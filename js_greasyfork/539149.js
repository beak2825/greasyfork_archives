// ==UserScript==
// @name        Fake Ban Page Roblox
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://www.roblox.com/*
// @grant       none
// @version     1.0
// @author      didward
// @description 11/06/2025, 21:05:47
// @downloadURL https://update.greasyfork.org/scripts/539149/Fake%20Ban%20Page%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/539149/Fake%20Ban%20Page%20Roblox.meta.js
// ==/UserScript==
// Instead of clearing the entire body, replace only the content section
const contentSection = document.getElementById('content');
if (contentSection) {
  contentSection.innerHTML = `<div id="fake-ban-message" class="ban-message-outer">
  <div class="ban-message-inner">
    <h1 class="ban-title">Account Terminated</h1>
    <p class="ban-desc">
      Our content monitors have determined that your behavior at Roblox has been in violation of our
      <a href="#" class="ban-link">Terms of Use</a>.
    </p>
    <div class="ban-box">
      <span class="ban-box-label">Reviewed: 11/06/25, 21:42 PM GMT</span>
    </div>
    <p class="ban-desc">
      Please abide by the <a href="#" class="ban-link">Roblox Community Standards</a> so that Roblox can be fun for users of all ages.
    </p>
    <p class="ban-terminated">
      <a href="#" class="ban-link">Your account has been terminated.</a>
    </p>
    <div class="ban-actions">
      <button class="ban-btn ban-btn-light">Appeal</button>
      <button class="ban-btn ban-btn-dark">Logout</button>
    </div>
  </div>
</div>

`;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `.ban-message-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.ban-message-inner {
  background: #232428;
  border-radius: 12px;
  border: 4px solid #fff;
  padding: 36px 36px 28px 36px;
  max-width: 600px;
  width: 100%;
  color: #fff;
  box-shadow: 0 4px 32px rgba(0,0,0,0.4);
}

.ban-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: #fff;
}

.ban-desc {
  font-size: 1rem;
  margin-bottom: 18px;
  color: #e3e3e3;
}

.ban-link {
  color: #00b3ff;
  text-decoration: underline;
}

.ban-box {
  background: #2c2d31;
  border-radius: 6px;
  border: 2px solid #bcbcbc;
  padding: 18px;
  margin-bottom: 18px;
  color: #bcbcbc;
  font-size: 1rem;
}

.ban-box-label {
  opacity: 0.8;
}

.ban-terminated {
  font-weight: 600;
  color: #fff;
  margin-bottom: 18px;
}

.ban-actions {
  display: flex;
  gap: 12px;
}

.ban-btn {
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.ban-btn-light {
  background: #fff;
  color: #232428;
  border: 1px solid #fff;
}

.ban-btn-light:hover {
  background: #e3e3e3;
}

.ban-btn-dark {
  background: #232428;
  color: #fff;
  border: 1px solid #fff;
}

.ban-btn-dark:hover {
  background: #393b3d;
}

`;
  document.head.appendChild(style);

  // Add logout functionality
  document.querySelector('.logout-button').addEventListener('click', () => {
    window.location.href = 'https://www.roblox.com/logout';
  });
}
