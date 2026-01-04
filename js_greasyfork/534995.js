// ==UserScript==
// @name         Greasy Fork Bookmark (AFU IT)
// @namespace    https://greasyfork.org/users/1453658
// @version      0.2
// @description  Bookmark scripts, Add a bookmark page with active and history, Add a bookmark icon on right bottom
// @author       AFU IT (Thanks to ぐらんぴ)
// @match        https://greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534995/Greasy%20Fork%20Bookmark%20%28AFU%20IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534995/Greasy%20Fork%20Bookmark%20%28AFU%20IT%29.meta.js
// ==/UserScript==

const $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el);
let favScripts = GM_getValue("favScripts", []);
let removedScripts = GM_getValue("removedScripts", []);
// console.log(favScripts);

// Create inline notification function (appears next to star)
function createInlineNotification(element, message, isSuccess = true) {
  // Remove any existing notification first
  const existingNotification = element.parentNode.querySelector('.inline-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('span');
  notification.className = 'inline-notification';
  notification.style.cssText = `
    margin-left: 10px;
    color: ${isSuccess ? '#4CAF50' : '#f44336'};
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    opacity: 1;
    transition: opacity 0.5s;
    display: inline-block;
    vertical-align: middle;
    font-weight: normal;
  `;
  notification.textContent = message;

  // Insert after the element
  element.parentNode.insertBefore(notification, element.nextSibling);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Create notification function with Apple-style design
function createNotification(message, isSuccess = true) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(50, 50, 50, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: opacity 0.5s, transform 0.3s;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transform: translateY(0);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  const icon = document.createElement('span');
  icon.style.cssText = `
    margin-right: 10px;
    font-size: 16px;
  `;
  icon.textContent = isSuccess ? '✓' : '✕';

  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;

  notification.appendChild(icon);
  notification.appendChild(messageSpan);
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Function to fetch script metadata
function fetchScriptMetadata(url) {
  return new Promise((resolve, reject) => {
    // Extract script ID from URL
    const scriptId = url.match(/\/scripts\/(\d+)/)?.[1];
    if (!scriptId) {
      resolve({});
      return;
    }

    // Use the JSON API endpoint to get script data
    const jsonUrl = `https://greasyfork.org/en/scripts/${scriptId}.json`;

    GM_xmlhttpRequest({
      method: "GET",
      url: jsonUrl,
      headers: {
        "Accept": "application/json"
      },
      onload: function(response) {
        try {
          if (response.status === 200) {
            const data = JSON.parse(response.responseText);

            // Extract relevant metadata
            const metadata = {
              author: data.user?.name || "",
              authorUrl: data.user?.url || "",
              dailyInstalls: data.daily_installs || 0,
              totalInstalls: data.total_installs || 0,
              ratings: {
                good: data.good_ratings || 0,
                ok: data.ok_ratings || 0,
                bad: data.bad_ratings || 0
              },
              created: data.created_at || "",
              updated: data.code_updated_at || "",
              ratingScore: data.good_ratings ?
                Math.round((data.good_ratings / (data.good_ratings + data.ok_ratings + data.bad_ratings)) * 100) : 0
            };

            resolve(metadata);
          } else {
            // Fallback to HTML parsing if JSON API fails
            GM_xmlhttpRequest({
              method: "GET",
              url: url,
              onload: function(htmlResponse) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlResponse.responseText, "text/html");

                const metadataBlock = doc.querySelector(".script-meta-block");
                if (!metadataBlock) {
                  resolve({});
                  return;
                }

                const authorElement = metadataBlock.querySelector(".script-list-author a");
                const dailyInstallsElement = metadataBlock.querySelector(".script-list-daily-installs span");
                const totalInstallsElement = metadataBlock.querySelector(".script-list-total-installs span");
                const ratingsElement = metadataBlock.querySelector(".script-list-ratings");
                const createdDateElement = metadataBlock.querySelector(".script-list-created-date relative-time");
                const updatedDateElement = metadataBlock.querySelector(".script-list-updated-date relative-time");

                const goodRating = ratingsElement ? ratingsElement.querySelector(".good-rating-count") : null;
                const okRating = ratingsElement ? ratingsElement.querySelector(".ok-rating-count") : null;
                const badRating = ratingsElement ? ratingsElement.querySelector(".bad-rating-count") : null;

                const metadata = {
                  author: authorElement ? authorElement.textContent : "",
                  authorUrl: authorElement ? authorElement.href : "",
                  dailyInstalls: dailyInstallsElement ? dailyInstallsElement.textContent : "0",
                  totalInstalls: totalInstallsElement ? totalInstallsElement.textContent : "0",
                  ratings: {
                    good: goodRating ? goodRating.textContent : "0",
                    ok: okRating ? okRating.textContent : "0",
                    bad: badRating ? badRating.textContent : "0"
                  },
                  created: createdDateElement ? createdDateElement.getAttribute("datetime") : "",
                  updated: updatedDateElement ? updatedDateElement.getAttribute("datetime") : "",
                  ratingScore: ratingsElement ? ratingsElement.getAttribute("data-rating-score") : "0"
                };

                resolve(metadata);
              },
              onerror: function(error) {
                resolve({});
              }
            });
          }
        } catch (e) {
          resolve({});
        }
      },
      onerror: function(error) {
        // Fallback to empty metadata
        resolve({});
      }
    });
  });
}

// Function to extract author information from HTML
function extractAuthorInfo(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");

          const authorElement = doc.querySelector(".script-list-author a, .script-show-author a");
          if (authorElement) {
            resolve({
              author: authorElement.textContent.trim(),
              authorUrl: authorElement.href
            });
          } else {
            resolve({});
          }
        } catch (e) {
          resolve({});
        }
      },
      onerror: function(error) {
        resolve({});
      }
    });
  });
}

function scriptPage() {
  if (location.href.match('/scripts/') && $s(".script-meta-block")) {
    let title = $s("#script-info > header > h2").innerText;
    let parent = $s('#script-links'),
        li = $c('li');

    // Use star icon
    li.innerHTML = `<a style="cursor: pointer; display: inline-flex; align-items: center; vertical-align: middle;">☆</a>`;

    // Direct bookmark without modal
    li.addEventListener('click', e => {
      const defaultTag = "Bookmarked";

      // Check if script is already bookmarked
      if (favScripts.findIndex(({ scriptTitle }) => scriptTitle === title) === -1) {
        // Get metadata for the script
        Promise.all([
          fetchScriptMetadata(location.href),
          extractAuthorInfo(location.href)
        ]).then(([metadata, authorInfo]) => {
          // Combine metadata with author info
          const combinedMetadata = {
            ...metadata,
            author: authorInfo.author || metadata.author || document.querySelector(".script-show-author a")?.textContent.trim() || "",
            authorUrl: authorInfo.authorUrl || metadata.authorUrl || document.querySelector(".script-show-author a")?.href || ""
          };

          // Add to bookmarks with default tag and metadata
          favScripts.push({
            url: location.href,
            tag: defaultTag,
            scriptTitle: title,
            description: $s(".script-description").textContent,
            lastModified: new Date().toISOString(),
            ...combinedMetadata
          });

          // Save to GM storage
          GM_setValue("favScripts", favScripts);

          // Change star icon
          li.innerHTML = '<a style="cursor: pointer; color: #E09015; display: inline-flex; align-items: center; vertical-align: middle;">★</a>';

          // Show inline notification
          createInlineNotification(li.querySelector('a'), `Added to bookmarks`);
        }).catch(err => {
          console.error("Error fetching metadata:", err);

          // Try to get author directly from the page
          const authorElement = document.querySelector(".script-show-author a");
          const author = authorElement ? authorElement.textContent.trim() : "";
          const authorUrl = authorElement ? authorElement.href : "";

          // Add with basic info if metadata fetch fails
          favScripts.push({
            url: location.href,
            tag: defaultTag,
            scriptTitle: title,
            description: $s(".script-description").textContent,
            lastModified: new Date().toISOString(),
            author: author,
            authorUrl: authorUrl
          });

          GM_setValue("favScripts", favScripts);
          li.innerHTML = '<a style="cursor: pointer; color: #E09015; display: inline-flex; align-items: center; vertical-align: middle;">★</a>';
          createInlineNotification(li.querySelector('a'), `Added to bookmarks`);
        });
      } else {
        // Move to removed scripts history
        let scriptToRemove = favScripts.find(item => item.scriptTitle === title);
        if (scriptToRemove) {
          // Add to history but keep only one entry per script
          const existingIndex = removedScripts.findIndex(item => item.scriptTitle === title);
          if (existingIndex !== -1) {
            removedScripts.splice(existingIndex, 1);
          }

          removedScripts.push({
            ...scriptToRemove,
            removedAt: new Date().toISOString()
          });
          GM_setValue("removedScripts", removedScripts);
        }

        // Remove from bookmarks
        let indexToRemove = favScripts.findIndex(item => item.scriptTitle === title);
        if (indexToRemove > -1) favScripts.splice(indexToRemove, 1);

        // Change star icon
        li.innerHTML = '<a style="cursor: pointer; display: inline-flex; align-items: center; vertical-align: middle;">☆</a>';

        // Show inline notification
        createInlineNotification(li.querySelector('a'), `Removed from bookmarks`, false);

        // Save to GM storage
        GM_setValue("favScripts", favScripts);
      }
    });

    parent.appendChild(li);

    // If this script already bookmarked, show filled star
    if (favScripts.findIndex(({ scriptTitle }) => scriptTitle === title) !== -1) {
      li.innerHTML = '<a style="cursor: pointer; color: #E09015; display: inline-flex; align-items: center; vertical-align: middle;">★</a>';
    }
  }
}

function listPage() {
  if (location.href.match('/scripts') && !location.href.match('/scripts/')) {
    // Add star buttons to script listing
    $sa("#browse-script-list > li").forEach(item => {
      const titleElement = item.querySelector(".script-link");
      if (titleElement) {
        const title = titleElement.textContent;
        const url = titleElement.href;

        // Create star container
        const starContainer = document.createElement('span');
        starContainer.style.cssText = "margin-left: 10px; cursor: pointer; display: inline-flex; align-items: center; vertical-align: middle;";

        // Check if script is already bookmarked
        const isBookmarked = favScripts.findIndex(({ scriptTitle }) => scriptTitle === title) !== -1;
        starContainer.innerHTML = isBookmarked ? '★' : '☆';
        starContainer.style.color = isBookmarked ? '#E09015' : 'white';

        // Add click event
        starContainer.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          const defaultTag = "Bookmarked";

          if (starContainer.innerHTML === '☆') {
            // Fetch metadata and add to bookmarks
            Promise.all([
              fetchScriptMetadata(url),
              extractAuthorInfo(url)
            ]).then(([metadata, authorInfo]) => {
              // Combine metadata with author info
              const combinedMetadata = {
                ...metadata,
                author: authorInfo.author || metadata.author || "",
                authorUrl: authorInfo.authorUrl || metadata.authorUrl || ""
              };

              favScripts.push({
                url: url,
                tag: defaultTag,
                scriptTitle: title,
                description: item.querySelector(".script-description") ? item.querySelector(".script-description").textContent : "",
                lastModified: new Date().toISOString(),
                ...combinedMetadata
              });

              GM_setValue("favScripts", favScripts);
              starContainer.innerHTML = '★';
              starContainer.style.color = '#E09015';
              createInlineNotification(starContainer, `Added to bookmarks`);
            }).catch(err => {
              console.error("Error fetching metadata:", err);

              // Try to get author from the list item
              const authorElement = item.querySelector(".script-list-author a");
              const author = authorElement ? authorElement.textContent.trim() : "";
              const authorUrl = authorElement ? authorElement.href : "";

              // Add with basic info if metadata fetch fails
              favScripts.push({
                url: url,
                tag: defaultTag,
                scriptTitle: title,
                description: item.querySelector(".script-description") ? item.querySelector(".script-description").textContent : "",
                lastModified: new Date().toISOString(),
                author: author,
                authorUrl: authorUrl
              });

              GM_setValue("favScripts", favScripts);
              starContainer.innerHTML = '★';
              starContainer.style.color = '#E09015';
              createInlineNotification(starContainer, `Added to bookmarks`);
            });
          } else {
            // Remove from bookmarks
            let indexToRemove = favScripts.findIndex(item => item.scriptTitle === title);
            if (indexToRemove > -1) {
              // Add to history
              const scriptToRemove = favScripts[indexToRemove];
              const existingIndex = removedScripts.findIndex(item => item.scriptTitle === title);
              if (existingIndex !== -1) {
                removedScripts.splice(existingIndex, 1);
              }

              removedScripts.push({
                ...scriptToRemove,
                removedAt: new Date().toISOString()
              });
              GM_setValue("removedScripts", removedScripts);

              // Remove from bookmarks
              favScripts.splice(indexToRemove, 1);
            }

            starContainer.innerHTML = '☆';
            starContainer.style.color = 'white';
            createInlineNotification(starContainer, `Removed from bookmarks`, false);
          }

          GM_setValue("favScripts", favScripts);
        });

        // Insert after title
        titleElement.parentNode.insertBefore(starContainer, titleElement.nextSibling);
      }
    });
  }
}

function favPage() {
  if (location.href == "https://greasyfork.org/bookmarks") {
    document.title = 'My Bookmarks';
    $s("body > div > section").remove();

    $s("body > div").innerHTML = `
      <div class="sidebarred">
        <div class="sidebarred-main-content">
          <div class="open-sidebar sidebar-collapsed">☰</div>
          <div class="search-box">
            <input type="text" id="bookmark-search" placeholder="Search bookmarks..."
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; margin-bottom: 15px; background-color: #333; color: white;">
          </div>
          <div style="display: flex; margin-bottom: 15px;">
            <button id="show-active" class="tab-button active" style="flex: 1; padding: 8px; border: none; background: #444; color: white; cursor: pointer; border-radius: 4px 0 0 4px;">Active</button>
            <button id="show-history" class="tab-button" style="flex: 1; padding: 8px; border: none; background: #333; color: white; cursor: pointer; border-radius: 0 4px 4px 0;">History</button>
          </div>
          <ol id="browse-script-list" class="script-list">
          </ol>
          <div id="history-container" style="display: none;">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
              <button id="clear-history" style="padding: 6px 12px; background-color: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear History</button>
            </div>
            <ol id="history-script-list" class="script-list">
            </ol>
          </div>
        </div>
      </div>`;

    function addScripts(filter, tagFilter, listElement = "#browse-script-list") {
      // reset list items
      if($sa(`${listElement} > li`)) $sa(`${listElement} > li`).forEach(elm => elm.remove());

      // Determine which list to populate
      let scriptsList = listElement === "#browse-script-list" ? favScripts : removedScripts;

      // Sort by lastModified date (newest first) for active bookmarks
      if (listElement === "#browse-script-list") {
        scriptsList = [...scriptsList].sort((a, b) => {
          const dateA = a.lastModified ? new Date(a.lastModified) : new Date(0);
          const dateB = b.lastModified ? new Date(b.lastModified) : new Date(0);
          return dateB - dateA;
        });
      }

      // For history tab, sort by removedAt date (newest first) and deduplicate
      if (listElement === "#history-script-list") {
        // Sort by date (newest first)
        scriptsList = [...scriptsList].sort((a, b) =>
          new Date(b.removedAt) - new Date(a.removedAt)
        );

        // Deduplicate by scriptTitle (keep only the most recent)
        const uniqueTitles = new Set();
        scriptsList = scriptsList.filter(script => {
          if (uniqueTitles.has(script.scriptTitle)) {
            return false;
          }
          uniqueTitles.add(script.scriptTitle);
          return true;
        });
      }

      // Filter and add scripts to the list
      scriptsList.forEach(fav => {
        if ((!filter || filter === "All" || fav.url.startsWith(filter))) {
          let elm = $s(listElement),
              li = $c("li");

          // Format numbers with commas
          const formatNumber = (num) => {
            return typeof num === 'string' ? num : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          };

          // Create the metadata HTML
          const metadataHtml = `
            <div class="script-meta-block">
              <dl class="inline-script-stats">
                <dt class="script-list-author"><span>Author</span></dt>
                <dd class="script-list-author"><span>${fav.author ? `<a href="${fav.authorUrl || '#'}">${fav.author}</a>` : 'Unknown'}</span></dd>
                <dt class="script-list-daily-installs"><span>Daily installs</span></dt>
                <dd class="script-list-daily-installs"><span>${formatNumber(fav.dailyInstalls || 0)}</span></dd>
                <dt class="script-list-total-installs"><span>Total installs</span></dt>
                <dd class="script-list-total-installs"><span>${formatNumber(fav.totalInstalls || 0)}</span></dd>
                <dt class="script-list-ratings"><span>Ratings</span></dt>
                <dd class="script-list-ratings" data-rating-score="${fav.ratingScore || 0}"><span>
                  <span class="good-rating-count" title="Number of people who rated it Good or added it to favorites.">${fav.ratings ? fav.ratings.good : 0}</span>
                  <span class="ok-rating-count" title="Number of people who rated it OK.">${fav.ratings ? fav.ratings.ok : 0}</span>
                  <span class="bad-rating-count" title="Number of people who rated it Bad.">${fav.ratings ? fav.ratings.bad : 0}</span>
                </span></dd>
                <dt class="script-list-created-date"><span>Created</span></dt>
                <dd class="script-list-created-date"><span>${fav.created ? `<relative-time datetime="${fav.created}" prefix="" title="${new Date(fav.created).toLocaleString()}">${new Date(fav.created).toISOString().split('T')[0]}</relative-time>` : 'Unknown'}</span></dd>
                <dt class="script-list-updated-date"><span>Updated</span></dt>
                <dd class="script-list-updated-date"><span>${fav.updated ? `<relative-time datetime="${fav.updated}" prefix="" title="${new Date(fav.updated).toLocaleString()}">${new Date(fav.updated).toISOString().split('T')[0]}</relative-time>` : 'Unknown'}</span></dd>
              </dl>
            </div>
          `;

          // Use star icon for bookmarks page
          li.innerHTML = `
            <span style="display: flex; align-items: center;">
              <a class="script-link" href="${fav.url}">${fav.scriptTitle}</a>
              <button class="star" style="margin-left: auto; font-size: 24px; background: none; border: none; cursor: pointer; color: #E09015; display: inline-flex; align-items: center; vertical-align: middle;">★</button>
            </span>
            <span class="script-description description">${fav.description}</span>
            ${metadataHtml}
            <span class="data-tag" data-tag="${fav.tag}" style="display: none;">${fav.tag}</span>
            ${listElement === "#history-script-list" ? `<span class="removed-at" style="font-size: 12px; color: #999;">Removed: ${new Date(fav.removedAt).toLocaleString()}</span>` : ''}`;
          elm.appendChild(li);

          // star click function
          if (listElement === "#browse-script-list") {
            li.querySelector('.star').onclick = e => {
              let starHref = e.target.closest('span').querySelector('a').href;
              let starTag = e.target.closest('li').querySelector('.data-tag').getAttribute('data-tag');
              let starTitle = e.target.closest('span').querySelector('a').textContent;
              let starDescription = e.target.closest('li').querySelector('.description').textContent;

              // Get the full script data
              const scriptData = favScripts.find(script => script.scriptTitle === starTitle);

              // Move to removed scripts history
              const existingIndex = removedScripts.findIndex(item => item.scriptTitle === starTitle);
              if (existingIndex !== -1) {
                removedScripts.splice(existingIndex, 1);
              }

              removedScripts.push({
                ...scriptData,
                removedAt: new Date().toISOString()
              });
              GM_setValue("removedScripts", removedScripts);

              // Remove from active bookmarks
              let indexToRemove = favScripts.findIndex(i => i.url === starHref && i.tag === starTag);
              if (indexToRemove > -1) favScripts.splice(indexToRemove, 1);
              GM_setValue("favScripts", favScripts);

              // Remove from display
              e.target.closest('li').remove();

              createInlineNotification(e.target, `Removed from bookmarks`, false);
            };
          } else if (listElement === "#history-script-list") {
            // For history items, change star to restore icon
            li.querySelector('.star').innerHTML = '↺';
            li.querySelector('.star').style.color = '#E09015';
            li.querySelector('.star').onclick = e => {
              let starHref = e.target.closest('span').querySelector('a').href;
              let starTag = e.target.closest('li').querySelector('.data-tag').getAttribute('data-tag');
              let starTitle = e.target.closest('span').querySelector('a').textContent;

              // Get the full script data
              const scriptData = removedScripts.find(script => script.scriptTitle === starTitle);

              // Add back to active bookmarks with updated lastModified
              favScripts.push({
                ...scriptData,
                lastModified: new Date().toISOString()
              });
              GM_setValue("favScripts", favScripts);

              // Remove from history
              let indexToRemove = removedScripts.findIndex(i => i.url === starHref && i.tag === starTag);
              if (indexToRemove > -1) removedScripts.splice(indexToRemove, 1);
              GM_setValue("removedScripts", removedScripts);

              // Remove from display
              e.target.closest('li').remove();

              // Refresh active tab to show the restored bookmark immediately
              addScripts(null, null, "#browse-script-list");

              // Switch to active tab
              $s('#show-active').click();

              createInlineNotification(e.target, `Restored to bookmarks`);
            };
          }
        }
      });
    }

    // Initial load of active bookmarks
    addScripts();

    // Clear history button functionality
    $s('#clear-history').addEventListener('click', () => {
      // Show confirmation dialog
      if (confirm("Are you sure you want to clear all history?")) {
        removedScripts = [];
        GM_setValue("removedScripts", removedScripts);
        $s('#history-script-list').innerHTML = '';
        createNotification("History cleared successfully");
      }
    });

    // Tab switching
    $s('#show-active').addEventListener('click', () => {
      $s('#show-active').classList.add('active');
      $s('#show-active').style.background = '#444';
      $s('#show-active').style.color = 'white';
      $s('#show-history').classList.remove('active');
      $s('#show-history').style.background = '#333';
      $s('#show-history').style.color = 'white';
      $s('#browse-script-list').style.display = '';
      $s('#history-container').style.display = 'none';
    });

    $s('#show-history').addEventListener('click', () => {
      $s('#show-history').classList.add('active');
      $s('#show-history').style.background = '#444';
      $s('#show-history').style.color = 'white';
      $s('#show-active').classList.remove('active');
      $s('#show-active').style.background = '#333';
      $s('#show-active').style.color = 'white';
      $s('#browse-script-list').style.display = 'none';
      $s('#history-container').style.display = '';
      addScripts(null, null, "#history-script-list");
    });

    // Add search functionality
    $s('#bookmark-search').addEventListener('input', e => {
      const searchTerm = e.target.value.toLowerCase();
      const activeList = $s('#show-active').classList.contains('active');
      const listSelector = activeList ? '#browse-script-list > li' : '#history-script-list > li';

      $sa(listSelector).forEach(item => {
        const title = item.querySelector('.script-link').textContent.toLowerCase();
        const desc = item.querySelector('.script-description').textContent.toLowerCase();
        if (title.includes(searchTerm) || desc.includes(searchTerm)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });

    let sidebarred = $s(".sidebarred"),
        div = $c("div");
    div.innerHTML = `
      <div class="sidebar collapsed">
        <div class="close-sidebar">
          <div class="sidebar-title">Filter Options</div>
          <div>☰</div>
        </div>
        <div id="script-list-option-groups" class="list-option-groups">
          <form class="sidebar-search">
            <input type="hidden" name="sort" value="created">
            <div id="script-list-sort" class="list-option-group">Sites:
              <ul>
                <li class="list-option"><a>All</a></li>
                <li class="list-option"><a>Greasyfork</a></li>
                <li class="list-option"><a>Sleazyfork</a></li>
              </ul>
            </div>
          </form>
        </div>
      </div>`;
    div.style.cursor = "pointer";
    sidebarred.appendChild(div);

    // Sorting by: function
    $sa('.list-option').forEach(i => {
      i.onclick = e => {
        const activeList = $s('#show-active').classList.contains('active');
        const listSelector = activeList ? "#browse-script-list" : "#history-script-list";

        switch (i.textContent) {
          case "All":
            addScripts(null, null, listSelector);
            break;
          case "Greasyfork":
            addScripts('https://greasy', null, listSelector);
            break;
          case "Sleazyfork":
            addScripts('https://sleazy', null, listSelector);
            break;
        }
      };
    });
  }
}

function allPage() {
  let li = document.createElement('li');
  li.innerHTML = `<a href="https://greasyfork.org/bookmarks" style="color: white;">My Bookmarks</a>`;
  $s("#site-nav > nav").appendChild(li.cloneNode(true));
  if ($s("#mobile-nav > nav")) $s("#mobile-nav > nav").appendChild(li.cloneNode(true)); // mobile

  // Add floating bookmark icon in bottom right
  const bookmarkButton = document.createElement('div');
  bookmarkButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #333;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 999;
    transition: transform 0.2s;
  `;

  bookmarkButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  `;

  bookmarkButton.addEventListener('mouseover', () => {
    bookmarkButton.style.transform = 'scale(1.1)';
  });

  bookmarkButton.addEventListener('mouseout', () => {
    bookmarkButton.style.transform = 'scale(1)';
  });

  bookmarkButton.addEventListener('click', () => {
    window.location.href = 'https://greasyfork.org/bookmarks';
  });

  document.body.appendChild(bookmarkButton);
}

// Run functions
scriptPage();
listPage();
favPage();
allPage();
