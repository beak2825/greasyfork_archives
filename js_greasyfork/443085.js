// ==UserScript==
// @name         WK Dashboard Community Notifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bring the community notifications to wanikani.com
// @author       You
// @match        *://www.wanikani.com/
// @match        *://preview.wanikani.com/
// @match        *://www.wanikani.com/dashboard
// @match        *://preview.wanikani.com/dashboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443085/WK%20Dashboard%20Community%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/443085/WK%20Dashboard%20Community%20Notifications.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const lastChecked = JSON.parse(window.localStorage.getItem("dashboard-notifications.lastRead") ?? "0");

  const notifications = JSON.parse(
    (await GM.xmlHttpRequest({url: "https://community.wanikani.com/notifications.json"})).response
  ).notifications;

  console.log(notifications);

  const pending = notifications.filter((notification) =>
    Date.parse(notification.created_at) > lastChecked
      && notification.read === false);
  const pendingCount = pending.length;

  if (pendingCount === 0) {
    return;
  }

  const avatar = document.querySelector(".sitemap__section-header--account");

  avatar.addEventListener("click", () => {
    window.localStorage.setItem(
      "dashboard-notifications.lastRead",
      JSON.stringify(Date.now())
    );

    notificationBadge.remove();
  });

  const styleElem = document.createElement("style");
  document.head.append(styleElem);
  styleElem.innerHTML = `
  .community-notification-badge {
    position: absolute;
    background: #6cf;
    display: block;
    width: 1rem;
    top: -10px;
    right: -5px;
    height: 1rem;
    color: white;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
    line-height: 1rem;
  }
  `;

  const notificationBadge = document.createElement("span");
  notificationBadge.classList.add("community-notification-badge");
  notificationBadge.innerHTML = pendingCount;
  avatar.after(notificationBadge);
})();