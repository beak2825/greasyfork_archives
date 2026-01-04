// ==UserScript==
// @name         LinkedIn Connect
// @namespace    http://tampermonkey.net/
// @version      2025-02-27
// @description  Add "Auto Connect" button that automatically sends connection requests
// @author       Miguelx97
// @match        https://www.linkedin.com/mynetwork/grow/*
// @icon         data:image/jpeg;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528202/LinkedIn%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/528202/LinkedIn%20Connect.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** Configuration constants and selectors */
  const CONFIG = {
    DEV_MODE: false,
    DELAY_SHORT: 200,
    DELAY_LONG: 2000,
    LIMIT_SCROLL: 8,
    LIMIT_CONNECTIONS: 16,
    MUTUAL_CONNECTION_THRESHOLD: 20,
    COLORS: {
      success: "#09ff00",
      danger: "#f2d8d8",
    },
    SELECTORS: {
      btnShowMore: '[data-view-name="cohort-section-see-all"]',
      scrollChild:
        '[data-sdui-screen="com.linkedin.sdui.flagshipnav.mynetwork.CohortSeeAll"]',
      listUsers:
        "div._1a8ay891.cnuthtbc.cnuthtj4._1a8ay893._1a8ay895._1a8ay89a.cnuthtew._1k2lxmew0._1k2lxmezs._1k2lxme13k._1k2lxme17c._139m7k23",
      userItem: "div.cnuthtaw",
      userContainer: '[role="listitem"]',
      mutualConnectionMsg:
        "p._12p2gmq9._12p2gmq2._12p2gmqi._29kmc32._29kmc33._29kmc38._29kmc3d._1lu65cq3._1lu65cq1._1xoe5hd3._1s9oaxgo._1ptbkx6c8._1s9oaxg5._1s9oaxgc._139m7k1fr._1s9oaxgn",
      btnConnect:
        "button.yyosfl1.h8e4ml0._1xoe5hd0._139m7k1gx._1s9oaxg7._1s9oaxgi.yyosfl4.yyosfl3.cnuthtc0.cnutht0.cnutht1i0._1k2lxmew._1ptbkx61go",
      topBar: "main ul.cnuthtb4.cnuthte8.cnuthth4.cnuththk",
    },
  };

  /** Utility function for delaying execution */
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  /**
   * Waits for an element to appear in the DOM.
   * @param {string} selector - The CSS selector to wait for.
   * @param {HTMLElement} [container=document] - The container element.
   * @param {number} [timeout=10000] - Timeout in milliseconds.
   * @returns {Promise<HTMLElement>}
   */
  async function waitForElement(
    selector,
    container = document,
    timeout = 10000
  ) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      (function check() {
        const el = container.querySelector(selector);
        if (el) {
          return resolve(el);
        }
        if (Date.now() - start > timeout) {
          return reject(
            new Error(`Element ${selector} not found within timeout`)
          );
        }
        requestAnimationFrame(check);
      })();
    });
  }

  /** Opens the "See all" connections modal */
  async function openConnectionsModal() {
    const btnShowMore = await waitForElement(CONFIG.SELECTORS.btnShowMore);
    btnShowMore.click();
  }

  /** Scrolls the modal to load more user items and inserts a counter UI */
  async function scrollToLoadUsers() {
    const scrollChildEl = await waitForElement(CONFIG.SELECTORS.scrollChild);
    // Insert connection counter UI
    scrollChildEl.insertAdjacentHTML(
      "afterbegin",
      `<p style="text-align: center; font-size: 14px; margin: 4px;">
         Connection Requests: <span id="connectionRequests">0</span><span id="finishMsg"></span>
       </p>`
    );
    const scrollContainer = scrollChildEl.parentElement;
    const limitScroll = CONFIG.DEV_MODE ? 2 : CONFIG.LIMIT_SCROLL;
    for (let i = 0; i < limitScroll; i++) {
      if (i > 0) await delay(CONFIG.DELAY_LONG);
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
    // Scroll back to the top
    scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    return scrollChildEl;
  }

  /** Processes the list of users, marking those that meet the criteria and triggering connection */
  async function processConnections(scrollChildEl) {
    const listUsersElement = scrollChildEl.querySelector(
      CONFIG.SELECTORS.listUsers
    );
    if (!listUsersElement) {
      throw new Error("List users element not found");
    }
    const users = listUsersElement.querySelectorAll(CONFIG.SELECTORS.userItem);
    let connectionsCount = 0;
    for (const userEl of users) {
      const container = userEl.querySelector(CONFIG.SELECTORS.userContainer);
      if (!container) continue;

      const msgEl = container.querySelector(
        CONFIG.SELECTORS.mutualConnectionMsg
      );
      if (!msgEl) continue;

      const regex = /and\s+(\d+)\s+other mutual connection(?:s)?/;
      const match = msgEl.textContent.match(regex);
      const numMutualConnections = match ? parseInt(match[1], 10) : 0;

      // Determine the styling based on the number of mutual connections
      const { success, danger } = CONFIG.COLORS;
      let color = danger;
      let border = 2;
      const wannaConnect =
        numMutualConnections > CONFIG.MUTUAL_CONNECTION_THRESHOLD;
      if (wannaConnect) {
        color = success;
        border = Math.min(
          (numMutualConnections / CONFIG.MUTUAL_CONNECTION_THRESHOLD) * 2,
          6
        );
      }
      container.style.border = `solid ${border}px ${color}`;
      await delay(CONFIG.DELAY_SHORT);

      // If the criteria are met, click the Connect button
      if (wannaConnect) {
        const btnConnect = container.querySelector(CONFIG.SELECTORS.btnConnect);
        if (!btnConnect) continue;
        if (connectionsCount < CONFIG.LIMIT_CONNECTIONS && !CONFIG.DEV_MODE) {
          btnConnect.click();
          connectionsCount++;
          scrollChildEl.querySelector("#connectionRequests").textContent =
            connectionsCount;
        }
      }
    }
    scrollChildEl.querySelector("#finishMsg").textContent = " · Finished!";
  }

  /** Main auto-connect function that coordinates the process */
  async function startAutoConnect() {
    try {
      await openConnectionsModal();
      const scrollChildEl = await scrollToLoadUsers();
      await processConnections(scrollChildEl);
    } catch (error) {
      console.error("Error in auto connect:", error);
    }
  }

  /** Inserts the "Auto Connect" button into the page's top bar */
  async function addAutoConnectButton() {
    const topBar = await waitForElement(CONFIG.SELECTORS.topBar);
    if (!topBar) return;
    await delay(CONFIG.DELAY_SHORT);
    topBar.insertAdjacentHTML(
      "beforeend",
      `<li style="margin-left:auto;">
        <a id="auto-connect" class="minvu03 cnutht0 _139m7k7f h8e4ml0 _1xoe5hd0 _139m7k19r _139m7k1a1 _139m7k19w _1mamebb1 cnuthtb4 cnutht1i0 _1s9oaxgi _1pylls4i _1pylls4m _1ptbkx61fc minvu04 _1k2lxme13k _1k2lxme17c _1k2lxmevk _1k2lxmezc cnuthtig cnutht180">
          <span class="_12p2gmq9 _1s9oaxg7 _12p2gmqk _29kmc3a _29kmc3b _29kmc3g _29kmc3l _1s9oaxg6 _139m7k1gx _1s9oaxgn" style="color:#0a66c2;">Auto Connect</span>
          </span>
        </a>
    </li>`
    );
    const btnAutoConnect = await waitForElement("#auto-connect");
    btnAutoConnect.addEventListener("click", startAutoConnect);
  }

  addAutoConnectButton();
})();
