// ==UserScript==
// @name         User Details on Hover
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Show user details on hover
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468948/User%20Details%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/468948/User%20Details%20on%20Hover.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const isLemmy =
    document.head.querySelector("[name~=Description][content]").content ===
    "Lemmy";
  if (!isLemmy) return;
  // Inject styles for the user card
  function main() {
    const style = document.createElement("style");
    style.innerHTML = `
  .user-card {
    position: absolute;
    display: none;
    width: 350px;
    background-color: #242424;
    color: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1000;
    grid-gap: 10px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.4;
  }

  .user-card .header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .user-card img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 15px;
  }

  .user-card .username {
    font-size: 1.3em;
    font-weight: bold;
  }

  .user-card .instance {
    font-size: 0.8em;
    color: #888;
  }

  .user-card .body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }

  .user-card .key {
    font-weight: bold;
  }

  .user-card .value {
    color: #ddd;
    margin-top: 10px;
  }

  .user-card .bio {
    grid-column: 1 / -1;
    font-style: italic;
  }`;
    document.head.appendChild(style);

    // Create the user card
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    userCard.id = "user-card";
    document.body.appendChild(userCard);

    let timer;
    // Find all user links
    const userLinks = document.querySelectorAll('a.text-info[href*="/u/"]');
    userLinks.forEach((userLink) => {
      userLink.setAttribute("title", "");
      // When mouse enters, show the user card
      userLink.addEventListener("mouseenter", async (event) => {
        const username = userLink.href.split("/u/")[1];

        // Fetch user details
        const userInfo = await getUserInfo(username);

        // Format the date
        const date = new Date(userInfo.creationDate);
        const formattedDate = `${date.getFullYear()}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

        // Update the user card
        userCard.innerHTML = `
              <div class="header">
                  <img src="${
                    userInfo.profilePicture ||
                    `https://api.dicebear.com/6.x/identicon/svg?seed=${username}`
                  }" alt="User avatar">
                  <div>
                      <div class="username">${
                        userInfo.name || username.split("@")[0]
                      }</div>
                      <a href="https://${
                        userInfo.instance
                      }/u/${username}" class="instance">${username}${
          username.indexOf("@") === -1 ? "@" + userInfo.instance : ""
        }
                      </a>
                  </div>
              </div>
              <div class="body">
                  <div><span class="key">ID:</span> <span class="value">${
                    userInfo.id
                  }</span></div>
                  <div style="display:flex; flex-direction: column; gap: 3px"><span class="key">
                    <svg class="icon"><use xlink:href="/static/assets/symbols.svg#icon-cake"></use><div class="sr-only"><title>cake</title></div></svg>
                    Cake Day:</span> <span class="value">${formattedDate}</span></div>
                  <div><span class="key">Posts:</span> <span class="value">${
                    userInfo.post_count
                  }</span></div>
                  <div><span class="key">Comments:</span> <span class="value">${
                    userInfo.comment_count
                  }</span></div>
                  <div><span class="key">Post Score:</span> <span class="value">${
                    userInfo.post_score
                  }</span></div>
                  <div><span class="key">Comment Score:</span> <span class="value">${
                    userInfo.comment_score
                  }</span></div>
                  ${
                    userInfo.bio ? `<div class="bio">${userInfo.bio}</div>` : ""
                  }
              </div>`;

        // Show the user card at the cursor
        const rect = userLink.getBoundingClientRect();
        userCard.style.left = `${window.pageXOffset + rect.left}px`;
        userCard.style.top = `${window.pageYOffset + rect.bottom + 5}px`;
        // setTimeout(() => {
        if (userLink.querySelector(":hover")) {
          userCard.style.display = "block";
        }
        // }, 250);
        timer = setTimeout(() => {
          // check if username is not being hovered anymore after 150ms, after which point we must change display to none
          if (!userLink.querySelector(":hover")) {
            userCard.style.display = "none";
          }
        }, 150);
      });

      // When mouse leaves, hide the user card after a slight delay
      userLink.addEventListener("mouseleave", () => {
        // after a slight delay, delete the node
        timer = setTimeout(() => {
          // delete the node
          // userCard.parentElement.removeChild(userCard);
          userCard.style.display = "none";
        }, 250);
        setTimeout(() => {
          // check if both are unhovered after 260ms, and if that's the case, removeChild anyway
          if (!userCard.parentElement) return;
          if (!userCard.querySelector(":hover")) {
            // userCard.parentElement.removeChild(userCard);
            userCard.style.display = "none";
          }
        }, 250);

        // timer = setTimeout(() => {
        //   userCard.style.display = "none";
        // }, 250);
      });
    });

    userCard.addEventListener("mouseenter", () => {
      clearTimeout(timer);
    });

    userCard.addEventListener("mouseleave", () => {
      userCard.style.display = "none";
      // userCard.parentElement.removeChild(userCard);
    });

    // Fetch user info from the API
    async function getUserInfo(userName) {
      const instanceName = location.href.split("/")[2];
      const response = await fetch(
        `https://${instanceName}/api/v3/user?username=${userName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const user = await response.json();
      const {
        published: creationDate,
        avatar: profilePicture,
        bio,
        display_name: name,
        name: username,
        id,
        banner,
      } = user.person_view.person;
      const { comment_count, comment_score, post_count, post_score } =
        user.person_view.counts;

      return {
        creationDate,
        profilePicture,
        bio,
        name,
        username,
        id,
        banner,
        instance: instanceName,
        comment_count,
        comment_score,
        post_count,
        post_score,
      };
    }
  }

  // detect react changed url but didn't reload the page by checking for url change
  var oldHref = document.location.href;
  setInterval(function () {
    if (document.location.href !== oldHref) {
      oldHref = document.location.href;
      // Wait for the page to load
      setTimeout(main, 1000);
      console.log("url changed!");
    }
  }, 500);

  // run on page load
  main();
})();
