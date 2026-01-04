// ==UserScript==
// @name         Claude - Clear chat history
// @description  Adds a clear history button
// @version      0.4
// @license MIT
// @match        https://claude.ai/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @run-at       document-end
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1286140
// @downloadURL https://update.greasyfork.org/scripts/499085/Claude%20-%20Clear%20chat%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/499085/Claude%20-%20Clear%20chat%20history.meta.js
// ==/UserScript==

(() => {
  let org = "";

  function getCookie() {
    return new Promise((resolve, reject) => {
      const cookies = document.cookie.split(';');
      const lastActiveOrg = cookies.find(cookie => cookie.trim().startsWith('lastActiveOrg='));

      if (lastActiveOrg) {
        org = lastActiveOrg.split('=')[1].trim();
        console.log('Organization ID found:', org);
        resolve(org);
      } else {
        console.warn('lastActiveOrg cookie not found');
        reject("Cookie not found");
      }
    });
  }

  unsafeWindow.clearHistory = () => {
    if (!org) {
      getCookie().then(() => {
        if (!org) {
          console.error("Could not retrieve current organization id");
          alert("Error: Could not retrieve current organization id");
        } else {
          clearChats();
        }
      }).catch((error) => {
        console.error("Error retrieving cookie:", error);
        alert("Error retrieving cookie: " + error);
      });
    } else {
      clearChats();
    }
  };

  function clearChats() {
    console.log('Clearing chats for organization:', org);
    fetch(`https://claude.ai/api/organizations/${org}/chat_conversations`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Chats retrieved:', data);
        return Promise.all(
          data.map((chat) =>
            fetch(
              `https://claude.ai/api/organizations/${org}/chat_conversations/${chat.uuid}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            ).then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to delete chat ${chat.uuid}. Status: ${response.status}`);
              }
              console.log(`Chat ${chat.uuid} deleted successfully`);
            })
          )
        );
      })
      .then(() => {
        console.log('All chats deleted successfully');
        alert('All chats deleted successfully');
        unsafeWindow.location.reload();
      })
      .catch((error) => {
        console.error('Error in clearChats:', error);
        alert('Error clearing chats: ' + error.message);
      });
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      const viewAllLinks = Array.from(document.getElementsByTagName('a'))
        .filter(a => a.textContent.trim() === 'View all');
      console.log('View all links found:', viewAllLinks.length);
      if (viewAllLinks.length > 0) {
        const viewAllLink = viewAllLinks[0];
        const button = document.createElement("a");
        button.textContent = "Clear History";
        button.href = "#";
        button.classList.add("text-text-300", "hover:text-text-200", "inline-flex", "items-center", "gap-1", "text-sm", "transition", "hover:underline");
        button.style.marginRight = "16px"; // Add margin to the right of the button
        button.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm('Clear all chats from history?')) {
            unsafeWindow.clearHistory();
          }
        });
        viewAllLink.parentNode.insertBefore(button, viewAllLink);
        console.log('Clear History button added');
      } else {
        console.warn('Could not find appropriate location to add Clear History button');
      }
    }, 2000); // 2000 milliseconds = 2 seconds
  });

  // Initial cookie retrieval
  getCookie().catch((error) => {
    console.error("Error retrieving initial cookie:", error);
  });
})();