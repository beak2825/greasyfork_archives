// ==UserScript==
// @name         Ultimata market script
// @namespace    http://tampermonkey.net/
// @version      2025-05-25
// @description  Show bazaar listing on item market using 39th site stats.
// @author       olesien
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/537220/Ultimata%20market%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/537220/Ultimata%20market%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle ( `
   .ultimata-item-listing-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  justify-content: center;
  background: rgba(0,0,0,0.3);
  border-radius: 6px;
  margin-bottom: 10px;
}

.ultimata-item-card {
  background: #2d2d2d;
  border-radius: 8px;
  width: 100px;
  padding: 6px;
  padding-bottom: 10px;
  text-align: center;
  color: #eee;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ultimata-item-img {
  width: 60px;
  height: 60px;
  margin-bottom: 4px;
  object-fit: contain;
}

.ultimata-item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ultimata-item-info a {
  color: #80c8ff;
  text-decoration: none;
  font-weight: bold;
}
.ultimata-item-info a:hover {
  text-decoration: underline;
}

.ultimata-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background-color: rgba(0,0,0,0.3);
  border-radius: 6px;
  font-family: sans-serif;
}

.ultimata-pagination button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  transition: background 0.2s ease;
}

.ultimata-pagination button:hover {
  background: #333;
  border-radius: 4px;
}

.ultimata-page-info {
  color: white;
  font-size: 14px;
  margin: 0 8px;
}
   `);
    let apiKey = String(localStorage.getItem("ultimata-key"));
    const include_one_dollar = "false";
    if (apiKey.length < 10) {
        let key = prompt("Please enter key (public is ok)", "");
        console.log(key);
        if (key.length > 10) {
            console.log("setting....");
            localStorage.setItem("ultimata-key", key);
            apiKey = key;
        } else {
            alert("That is not a key");
        }
    }

    let rowCount = 4; // Default

    function getHashParam(param) {
        const hash = window.location.hash;
        const queryStart = hash.indexOf('?') !== -1 ? hash.indexOf('?') + 1 : hash.indexOf('/') + 1;
        const params = new URLSearchParams(hash.slice(queryStart));
        return params.get(param);
    }

    function renderError(container, message, allowReset) {
        container.innerHTML = `<div style="color:red; padding: 10px;">${message}</div>`;
        if (allowReset) {
            const btn = document.createElement("button");
            btn.innerText = "Reset Key";
            btn.onclick = () => {
                localStorage.removeItem("ultimata-key");
                location.reload();
            };
            container.appendChild(btn);
        }
    }


    function updateUrlParam(key, value) {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url.toString());
    }

    function renderBazaar(item, itemId) {
        return `
    <div class="ultimata-item-card">
      <img src="/images/items/${itemId}/medium.png" alt="${item.item_name}" class="ultimata-item-img" />
      <div class="ultimata-item-info">
        <a href="https://www.torn.com/bazaar.php?userId=${item.player_id}#/" target="_blank">${item.player_name}</a>
        <p>Amount: ${item.amount}</p>
        <p>$${item.price.toLocaleString()}</p>
      </div>
    </div>
  `;
    }

    function renderPagination(currentPage, maxPages) {
        return `
      <div class="ultimata-pagination">
      <button data-page="1" title="First">
        <svg viewBox="0 0 20 20" width="16"><path fill="white" d="M11 15L6 10l5-5v10zM14 5h2v10h-2z"/></svg>
      </button>
      <button data-page="${Math.max(1, currentPage - 1)}" title="Previous">
        <svg viewBox="0 0 20 20" width="16"><path fill="white" d="M12 15l-5-5 5-5v10z"/></svg>
      </button>
      <span class="ultimata-page-info">Page ${currentPage} / ${maxPages}</span>
      <button data-page="${Math.min(maxPages, currentPage + 1)}" title="Next">
        <svg viewBox="0 0 20 20" width="16"><path fill="white" d="M8 5l5 5-5 5V5z"/></svg>
      </button>
      <button data-page="${maxPages}" title="Last">
        <svg viewBox="0 0 20 20" width="16"><path fill="white" d="M9 15l5-5-5-5v10zM6 5h2v10H6z"/></svg>
      </button>
    </div>
  `;
    }

    function renderContainer(container, items, itemId, currentPage, maxPages, key) {
        const html = `
    <div class="ultimata-item-listing-container">
      ${items.map(item => renderBazaar(item, itemId)).join("")}
    </div>
    ${renderPagination(Number(currentPage), maxPages)}
  `;

        container.innerHTML = html;

        // Attach pagination events
        document.querySelectorAll(".ultimata-pagination button").forEach(btn => {
            btn.addEventListener("click", () => {
                const newPage = btn.getAttribute("data-page");
                //updateUrlParam("page", newPage);
                //location.reload();
                getBazaars(itemId, key, newPage, container);
            });
        });
    }

    function getBazaars(itemId, apiKey, page, container) {
        if (!itemId) {
            container.innerHTML = "";
            return;
        }
        // Params: itemid, key, page, rowCOunt, include_one_dollar, max_last_updated
        const url = `https://ultimata.net/api/v1/market/getitem?itemid=${itemId}&key=${apiKey}&page=${page}&rowCount=${rowCount}`;

        GM.xmlHttpRequest({
            method: 'GET',
            url,
            onload: function (response) {
                console.log(response);
                try {
                    const res = JSON.parse(response.responseText);
                    if (res?.error === false) {
                        renderContainer(container, res.data.items, itemId, page, res.data.maxPages, apiKey);
                    } else {
                        renderError(container, res?.message ?? "Unknown error", true);
                    }
                } catch (e) {
                    renderError(container, response?.responseText ?? "Unknown error occured", false);
                    console.error(e);
                }
            },
            onerror: function () {
                renderError(container, "Request failed", false);
            }
        });
    }


    const observer = new MutationObserver((_, observer) => {
        const panel = document.querySelector(".item-market > div");
        if (panel) {
            observer.disconnect();

            const container = document.createElement("div");
            container.className = "bazaar-listings-ultimata";
            panel.insertBefore(container, panel.children[1]);

            let panelWidth = panel.offsetWidth;
            rowCount = (Math.floor(panelWidth / 150));
            const page = 1;
            const itemId = getHashParam("itemID");
            const apiKey = localStorage.getItem("ultimata-key");
            if (!apiKey || apiKey.length < 10) {
                const key = prompt("Please enter key (public is ok)", "");
                if (key.length > 10) {
                    localStorage.setItem("ultimata-key", key);
                    location.reload();
                    return;
                } else {
                    alert("That is not a key");
                    return;
                }
            }
            // Render
            getBazaars(itemId, apiKey, page, container);

            // Listen for changes
            window.addEventListener('hashchange', () => {
                console.log('Hash changed:', window.location.hash);
                const itemId = getHashParam("itemID");
                getBazaars(itemId, apiKey, page, container);
            });
        }
    });

    observer.observe(document, { subtree: true, childList: true });
})();