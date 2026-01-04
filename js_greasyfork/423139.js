// ==UserScript==
// @name         MyFigureCollection Article Blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hide articles of specific users on the front page
// @author       IxianNavigator
// @match        https://myfigurecollection.net/
// @icon         https://icons.duckduckgo.com/ip2/myfigurecollection.net.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423139/MyFigureCollection%20Article%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/423139/MyFigureCollection%20Article%20Blocker.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const blockedUsers = localStorage.blockedUsers ? JSON.parse(localStorage.blockedUsers) : [];

  Array.from(document.querySelectorAll('.stamp-anchor > a[href*="myfigurecollection.net/blog/"')).forEach((aElem) => {
    const url = aElem.getAttribute('href');
    if (!url.match(/myfigurecollection\.net\/blog\/\d+$/)) {
      return;
    }
    const blogPostListItem = aElem.closest("li.listing-item");
    if (!blogPostListItem) {
      return;
    }
    blogPostListItem.setAttribute("style", "display: none;");
    const blogId = url.match(/myfigurecollection\.net\/blog\/(\d+)$/)[1];

    fetch(url).then((response) => response.text()).then((responseText) => {
      const regex = /<a class="anchor user\-anchor user-access-rank-(\d+) user-honorific-rank-(\d+)" href="https:\/\/myfigurecollection\.net\/profile\/(\S+)">/;
      const match = responseText.match(regex);
      if (!match) {
        return;
      }
      const userName = match[3];
      if (blockedUsers.includes(userName)) {
        return;
      }
      blogPostListItem.setAttribute("style", "display: block;");

      const userLink = document.createElement('a');
      userLink.innerHTML = userName;
      userLink.href = `https://myfigurecollection.net/profile/${userName}`;
      userLink.style.fontWeight = "normal";
      const blockButton = document.createElement('span');
      blockButton.innerHTML = "×";
      blockButton.setAttribute("title", "block user");
      blockButton.setAttribute("role", "button");
      blockButton.setAttribute("style", "cursor: pointer;");
      blockButton.classList.add("block-user-button");
      blockButton.addEventListener("click", function() {
        blockedUsers.push(userName);
        localStorage.blockedUsers = JSON.stringify(blockedUsers);
        blogPostListItem.setAttribute("style", "display: none;");
        addBlockedUsersList();
      });
      const metaContainer = blogPostListItem.querySelector(".stamp-meta");
      metaContainer.appendChild(document.createTextNode(" • "));
      metaContainer.appendChild(userLink);
      metaContainer.appendChild(document.createTextNode(" • "));
      metaContainer.appendChild(blockButton);
      const articleLinkContainer = blogPostListItem.querySelector(".stamp-anchor");
      articleLinkContainer.appendChild(document.createTextNode(" • "));
      const commentCount = responseText.match(/(\d+) comment/)[1];
      const commentCountElement = document.createElement("a");
      commentCountElement.style = "display: inline";
      commentCountElement.href = `https://myfigurecollection.net/blog/${blogId}/comments/`;
      commentCountElement.innerHTML = `
      <span class="tiny-icon-before icon-comments" style="margin-right: 0"></span>
      ${commentCount}
      `;
      articleLinkContainer.appendChild(commentCountElement);

    });
  });
  function addBlockedUsersList() {
    const existingBlockedUsersList = document.querySelector(".blocked-users-list");
    if (existingBlockedUsersList) {
      existingBlockedUsersList.remove();
    }
    const blockedUsersList = document.createElement("div");
    blockedUsersList.classList.add("blocked-users-list");
    document.querySelector(".copyright").after(blockedUsersList);
    blockedUsers.forEach((userName, i) => {
      const userSpan = document.createElement("span");
      userSpan.setAttribute("role", "button");
      userSpan.setAttribute("style", "cursor: pointer;");
      userSpan.innerHTML = userName;
      userSpan.addEventListener("click", function() {
        const index = blockedUsers.indexOf(userName);
        if (index > -1) {
          blockedUsers.splice(index, 1);
        }
        localStorage.blockedUsers = JSON.stringify(blockedUsers);
        addBlockedUsersList();
      });
      blockedUsersList.appendChild(userSpan);
      if (i < blockedUsers.length - 1) {
        blockedUsersList.appendChild(document.createTextNode(" • "));
      }
    });
  }
  addBlockedUsersList();

})();