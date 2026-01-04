// ==UserScript==
// @name         lolz.live – дизлайки справа (Cloudflare Worker)
// @namespace    https://lolz.live
// @version      3.0
// @description  1 устр-во = 1 дизлайк, правее лайка, серый/красный, 0 не выводится
// @author       You
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547638/lolzlive%20%E2%80%93%20%D0%B4%D0%B8%D0%B7%D0%BB%D0%B0%D0%B9%D0%BA%D0%B8%20%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%B0%20%28Cloudflare%20Worker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547638/lolzlive%20%E2%80%93%20%D0%B4%D0%B8%D0%B7%D0%BB%D0%B0%D0%B9%D0%BA%D0%B8%20%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%B0%20%28Cloudflare%20Worker%29.meta.js
// ==/UserScript==

(() => {
  const WORKER_URL = "https://sparkling-smoke-7e1d.adolffinger1337.workers.dev";

  let userId = localStorage.getItem('lolz-device-id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('lolz-device-id', userId);
  }

  const style = document.createElement('style');
  style.textContent = `
    .dislikeLink {
      display: flex;
      align-items: center;
      margin-left: 8px;
      cursor: pointer;
      text-decoration: none !important;
    }
    .dislikeIcon {
      width: 24px;
      height: 24px;
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3C2.4 3 2 3.4 2 4V13C2 13.6 2.4 14 3 14C3.6 14 4 13.6 4 13V4C4 3.4 3.6 3 3 3Z' fill='%238C8C8C'/%3E%3Cpath d='M16.2759 2H8.0396C6.37272 2 5 3.4 5 5.1V13.5C5 14.6 5.39221 15.6 6.07857 16.5L10.0006 21C10.5889 21.6 11.4714 22 12.4519 22C13.5305 22 14.4129 21.5 15.0013 20.7C15.5896 19.8 15.7857 18.8 15.4915 17.8L14.9032 15.9H19.0214C20.0019 15.9 20.8843 15.5 21.3746 14.7C21.9629 13.9 22.159 12.9 21.8649 12L19.8058 4.9C19.3155 3.1 17.9428 2 16.2759 2ZM7.64739 15.1C7.25518 14.6 7.05908 14.1 7.05908 13.5V5.1C7.05908 4.5 7.54934 4 8.13765 4H16.374C17.1584 4 17.8447 4.5 18.0408 5.3L20.0019 12.4C20.0999 12.7 20.0019 13.1 19.8058 13.4C19.6097 13.7 19.3155 13.8 19.0214 13.8H13.5305C13.2363 13.8 12.9422 14 12.7461 14.2C12.55 14.4 12.55 14.8 12.648 15.1L13.7266 18.4C13.8246 18.8 13.8246 19.2 13.5305 19.5C13.1383 20.1 12.1578 20.2 11.6675 19.6L7.64739 15.1Z' fill='%238C8C8C'/%3E%3C/svg%3E");
      background-size: 24px 24px;
      background-repeat: no-repeat;
      transition: filter .2s;
    }
    .dislikeLink.active .dislikeIcon {
      filter: brightness(0) saturate(100%) invert(34%) sepia(100%) saturate(748%) hue-rotate(318deg) brightness(99%) contrast(101%); /* #e74c3c */
    }
    .dislikeLabel {
      margin-left: 4px;
      font-size: 14px;
      color: #8C8C8C;
    }
    .dislikeLink.active .dislikeLabel {
      color: #e74c3c;
    }
  `;
  document.head.appendChild(style);

  function observeLikes() {
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a.LikeLink.like:not(.dislike-processed)')
        .forEach(likeBtn => {
          likeBtn.classList.add('dislike-processed');
          const postId = likeBtn.href.match(/\d+/)[0];
          insertDislikeButton(likeBtn, postId);
        });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  async function insertDislikeButton(likeBtn, postId) {
    const container = likeBtn.parentElement;

    const dislikeLink = document.createElement('a');
    dislikeLink.href = '#';
    dislikeLink.className = 'LikeLink item control dislikeLink';

    const icon = document.createElement('span');
    icon.className = 'dislikeIcon';

    const label = document.createElement('span');
    label.className = 'dislikeLabel';

    dislikeLink.append(icon, label);
    container.appendChild(dislikeLink);

    async function refresh() {
      const res = await fetch(`${WORKER_URL}?postId=${postId}&userId=${userId}`);
      const { count, myVote } = await res.json();

      dislikeLink.classList.toggle('active', Boolean(myVote));
      label.textContent = count > 0 ? count : '';
    }

    refresh();
    dislikeLink.addEventListener('click', async e => {
      e.preventDefault();
      await fetch(`${WORKER_URL}?postId=${postId}&userId=${userId}`, { method: 'POST' });
      await refresh();
    });
  }

  observeLikes();
})();