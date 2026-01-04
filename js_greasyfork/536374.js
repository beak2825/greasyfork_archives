// ==UserScript==
// @name         Neopets Shop Stock: Price Reference
// @namespace    https://github.com/fixicelo/userscripts
// @version      1.0.1
// @description  Check and compare your Neopets shop stock prices with Jellyneo's, apply JN prices in bulk or per item.
// @author       fixicelo
// @match        *://www.neopets.com/market.phtml*
// @connect      items.jellyneo.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536374/Neopets%20Shop%20Stock%3A%20Price%20Reference.user.js
// @updateURL https://update.greasyfork.org/scripts/536374/Neopets%20Shop%20Stock%3A%20Price%20Reference.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ----------------------
  // DOM Utility Functions
  // ----------------------

  /**
   * Returns the shop stock table element.
   * `:not([onsubmit])` is used to exclude the Shop Till page.
   */
  function getStockTable() {
    return document.querySelector(
      'form[action="process_market.phtml"]:not([onsubmit]) table'
    );
  }

  /**
   * Returns all stock row elements (excluding header and rows with only 1 td).
   * Rows with only 1 td are "Enter your PIN:" and "Update [] Remove All"
   */
  function getStockRows() {
    return Array.from(
      document.querySelectorAll(
        'form[action="process_market.phtml"] table tbody tr:not(:first-child)'
      )
    ).filter((row) => row.children.length > 1);
  }

  // ----------------------
  // Data Extraction
  // ----------------------

  /**
   * Extracts item IDs and quantities from the shop stock table for JN query.
   * @returns {Object} - { type, items, quantities }
   */
  function extractStocksInfo() {
    const stocks = getStockRows();
    const items = [];
    const quantities = [];
    stocks.forEach((row) => {
      const itemId = getItemIdFromRow(row);
      if (!itemId) return;
      const quantity = getQuantityFromRow(row);
      items.push(itemId);
      quantities.push(quantity);
    });
    return { type: "item_id", items, quantities };
  }

  function getItemIdFromRow(row) {
    const select = row.querySelector("select");
    if (select) {
      return select.name.match(/back_to_inv\[(\d+)\]/)?.[1];
    } else {
      const input = row.querySelector("input[name^='back_to_inv']");
      if (input) {
        return input.name.match(/back_to_inv\[(\d+)\]/)?.[1];
      }
    }
    return null;
  }

  function getQuantityFromRow(row) {
    return row.querySelector("td:nth-child(3) b")?.innerText || "1";
  }

  /**
   * Extracts Jellyneo price results HTML into an array of item info.
   * @param {string} html
   * @returns {Array}
   */
  function extractPriceResults(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const items = doc.querySelectorAll("div.row.table-row");
    return Array.from(items).map(parseJNItemRow);
  }

  function parseJNItemRow(item) {
    const [cImg, cInfo, cPrice] = item.querySelectorAll("div.columns");
    let jnHref = cImg.querySelector("a")?.getAttribute("href") || "";
    if (jnHref && jnHref.startsWith("/")) {
      jnHref = "https://items.jellyneo.net" + jnHref;
    }
    return {
      img: cImg.querySelector("img")?.src || "",
      name: cInfo.querySelector("a")?.innerText || "",
      price:
        parseInt(
          cPrice
            .querySelector("a")
            ?.innerText.replace("NP", "")
            .replace(/,/g, "")
            .trim(),
          10
        ) || 0,
      jnLink: jnHref,
    };
  }

  // ----------------------
  // Networking
  // ----------------------

  /**
   * Fetches Jellyneo price results for the given stock info.
   * @param {Object} stocksInfo
   * @param {Function} callback
   */
  function fetchPriceResults(stocksInfo, callback) {
    const params = new URLSearchParams();
    params.append("price_check_type", "shop_stock");
    params.append("sort", "4");
    params.append("sort_dir", "asc");
    params.append("show_rarities", "1");
    params.append("show_images", "1");
    params.append("item_list", JSON.stringify(stocksInfo));

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://items.jellyneo.net/tools/price-results/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      data: params.toString(),
      onload: function (response) {
        callback(response.responseText);
      },
    });
  }

  // ----------------------
  // UI
  // ----------------------

  const COLORS = {
    ABOVE: { group: "price", value: "#d32f2f", text: "Above JN Price" }, // red
    BELOW: { group: "price", value: "#388e3c", text: "Below JN Price" }, // green
    EQUAL: { group: "price", value: "#0077bb", text: "Matches JN Price" }, // blue
    DEFAULT: { group: "price", value: "#333", text: "No JN Price" }, // default
    LOADING: { group: "load", value: "#0077bb", text: "Loading JN prices..." }, // blue
    SUCCESS: { group: "load", value: "#388e3c", text: "JN prices updated!" }, // green
    ERROR: { group: "load", value: "#d32f2f", text: "Cannot load JN prices!" }, // red
  };

  /**
   * Returns color info for a price comparison.
   */
  function getPriceColor(yourPrice, jnPrice) {
    if (jnPrice === 0) return COLORS.DEFAULT;
    if (yourPrice > jnPrice) return COLORS.ABOVE;
    if (yourPrice < jnPrice) return COLORS.BELOW;
    if (yourPrice === jnPrice) return COLORS.EQUAL;
    return COLORS.DEFAULT;
  }

  /**
   * Adds the "Check JN Prices" button and status display above the stock table.
   */
  function addCheckPriceButton() {
    const table = getStockTable();
    if (!table || document.getElementById("jn-price-btn")) return;
    const btn = document.createElement("button");
    btn.textContent = "Check JN Prices";
    btn.type = "button";
    btn.style.margin = "10px 0";
    btn.id = "jn-price-btn";
    btn.setAttribute("aria-label", "Check Jellyneo Prices");
    btn.onclick = onCheckPriceClick;

    const status = document.createElement("span");
    status.id = "jn-price-status";
    status.style.marginLeft = "10px";
    status.style.fontWeight = "bold";

    // Add a simple loading spinner (hidden by default)
    const spinner = document.createElement("span");
    spinner.id = "jn-price-spinner";
    spinner.style.display = "none";
    spinner.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#0077bb" stroke-width="5" stroke-linecap="round" stroke-dasharray="31.415, 31.415" transform="rotate(72.0001 25 25)"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>';
    spinner.style.verticalAlign = "middle";
    spinner.style.marginLeft = "8px";
    table.parentNode.insertBefore(btn, table);
    table.parentNode.insertBefore(status, table);
    table.parentNode.insertBefore(spinner, table);
  }

  /**
   * Shows bulk price adjustment options above the stock table.
   * @param {Array} jnResults - Jellyneo price results for current stock.
   */
  function showPriceSettingOptions(jnResults) {
    if (document.getElementById("jn-apply-options")) return;
    const table = getStockTable();
    if (!table) return;

    const applyDiv = document.createElement("div");
    applyDiv.id = "jn-apply-options";
    applyDiv.style.margin = "10px 0";
    applyDiv.innerHTML = `
      <label>
        Set all to
        <input type="number" id="jn-custom-offset" value="0" style="width:60px; margin:0 4px;" min="-99999" title="You can enter a negative number to set prices lower JN Price.">
        NP <span style="font-weight:bold;">above</span> JN Price
        <span style="color:#888; font-size:12px;" title="Enter a negative number to set prices lower JN Price.">(0 -> follow JN price; negative -> lower)</span>
      </label>
      <button id="jn-apply-btn" type="button" style="margin-left:15px;font-weight:bold;">Apply Prices</button>
      <p id="jn-apply-reminder" style="margin-left:15px;color:#d32f2f;font-weight:bold;display:none;">Applied, remember to click "Update" below to save!</p>
    `;
    table.parentNode.insertBefore(applyDiv, table);

    document.getElementById("jn-apply-btn").onclick = () =>
      onApplyPricesClick(jnResults);
    document
      .getElementById("jn-custom-offset")
      .addEventListener("focus", () => {
        document.querySelector(
          'input[name="jn-apply-mode"][value="custom"]'
        ).checked = true;
      });
  }

  /**
   * Maps JN prices to the stock table, colors, and adds per-row apply button.
   * If the returned array length matches the stock rows, and the names match, map by order.
   * Otherwise, fallback to name-based matching.
   * @param {Array} jnResults
   */
  function mapJNPrices(jnResults) {
    const rows = Array.from(getStockRows());

    const itemNames = rows.map(
      (row) => row.querySelector("td:nth-child(1) b")?.innerText.trim() || ""
    );
    // If lengths match and all names match, map by order
    if (
      jnResults.length === rows.length &&
      jnResults.every((r, i) => r.name === itemNames[i])
    ) {
      rows.forEach((row, i) => {
        let priceCell = null;
        let input = null;
        row.querySelectorAll("td").forEach((td) => {
          const inp = td.querySelector('input[type="text"]');
          if (inp && inp.name && inp.name.startsWith("cost_")) {
            priceCell = td;
            input = inp;
          }
        });
        if (!priceCell || !input) return;
        // Remove previous JN price UI
        priceCell
          .querySelectorAll(".jn-ref-price, .jn-apply-row-btn")
          .forEach((el) => el.remove());
        addJNPriceUI(priceCell, input, jnResults[i], jnResults);
      });
      return;
    }
    // fallback: matching name and img url
    rows.forEach((row, idx) => {
      const nameCell = row.querySelector("td:nth-child(1) b");
      if (!nameCell) return;
      let priceCell = null;
      let input = null;
      row.querySelectorAll("td").forEach((td) => {
        const inp = td.querySelector('input[type="text"]');
        if (inp && inp.name && inp.name.startsWith("cost_")) {
          priceCell = td;
          input = inp;
        }
      });
      if (!priceCell || !input) return;
      const itemName = nameCell.innerText.trim();
      const imgUrl = row.querySelector("td:nth-child(2) img")?.src || "";
      const jnItem = jnResults.find(
        (r) => r.name === itemName && r.img === imgUrl
      );
      priceCell
        .querySelectorAll(".jn-ref-price, .jn-apply-row-btn")
        .forEach((el) => el.remove());
      if (jnItem) {
        addJNPriceUI(priceCell, input, jnItem, jnResults);
      }
    });
  }

  function addJNPriceUI(priceCell, input, jnItem, jnResults) {
    const div = document.createElement("div");
    div.className = "jn-ref-price";
    div.style.cssText = `
      font-size:13px;margin-top:4px;font-weight:bold;padding:3px 0;
      background:#fffbe6;border:1px solid #f0ad4e;border-radius:4px;
    `;
    const updateColor = () => {
      const yourPrice = parseInt(input.value.replace(/,/g, ""), 10) || 0;
      const { value, text } = getPriceColor(yourPrice, jnItem.price);
      div.style.color = value;
      div.title = text;
    };

    // JN price as a clickable link
    const priceLink = document.createElement("a");
    priceLink.href = jnItem.jnLink;
    priceLink.target = "_blank";
    priceLink.textContent = `JN Price: ${jnItem.price.toLocaleString()} NP`;
    priceLink.style.cssText =
      "color:inherit;text-decoration:underline;outline:none;";
    priceLink.style.setProperty("color", "inherit", "important");
    priceLink.style.setProperty("text-decoration", "underline", "important");
    priceLink.style.setProperty("outline", "none", "important");
    priceLink.onmousedown = (e) => e.preventDefault(); // Prevent visited effect
    priceLink.onfocus = (e) => e.target.blur();
    priceLink.rel = "noopener noreferrer";
    priceLink.setAttribute(
      "aria-label",
      `View Jellyneo page for ${jnItem.name}`
    );
    div.appendChild(priceLink);
    updateColor();
    input.addEventListener("input", updateColor);

    // Per-row apply button
    const btn = document.createElement("button");
    btn.textContent = "Apply";
    btn.type = "button";
    btn.className = "jn-apply-row-btn";
    btn.style.cssText =
      "margin-left:8px;font-size:11px;padding:2px 8px;background:inherit;color:inherit;border:1px solid currentColor;border-radius:3px;cursor:pointer;";
    btn.title = "Set this item to JN price";
    btn.setAttribute("aria-label", `Apply Jellyneo price for ${jnItem.name}`);
    btn.onclick = function () {
      input.value = jnItem.price;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      mapJNPrices(jnResults);
      showApplyReminder();
    };
    div.appendChild(btn);
    priceCell.appendChild(div);
    input.setAttribute("data-jn-price", jnItem.price);
  }

  /**
   * Shows a reminder to click "Update" after applying prices.
   */
  function showApplyReminder() {
    const reminder = document.getElementById("jn-apply-reminder");
    if (reminder) {
      reminder.style.display = "";
      setTimeout(() => {
        reminder.style.display = "none";
      }, 6000);
    }
  }

  // ----------------------
  // Event Handlers
  // ----------------------

  /**
   * Handles the "Check JN Prices" button click.
   */
  function onCheckPriceClick() {
    const btn = document.getElementById("jn-price-btn");
    const status = document.getElementById("jn-price-status");
    const spinner = document.getElementById("jn-price-spinner");
    if (btn) btn.disabled = true;
    if (status) {
      status.textContent = COLORS.LOADING.text;
      status.style.color = COLORS.LOADING.value;
    }
    if (spinner) spinner.style.display = "inline-block";
    const stocksInfo = extractStocksInfo();
    fetchPriceResults(stocksInfo, (html) => {
      handleJNPriceResponse(html, btn, status, spinner);
    });
  }

  function handleJNPriceResponse(html, btn, status, spinner) {
    try {
      const results = extractPriceResults(html);
      mapJNPrices(results);
      if (btn) btn.disabled = false;
      if (status) {
        status.textContent = COLORS.SUCCESS.text;
        status.style.color = COLORS.SUCCESS.value;
        setTimeout(() => {
          status.textContent = "";
        }, 2000);
      }
      showPriceSettingOptions(results);
    } catch (e) {
      if (btn) btn.disabled = false;
      if (status) {
        status.textContent = COLORS.ERROR.text;
        status.style.color = COLORS.ERROR.value;
      }
    } finally {
      if (spinner) spinner.style.display = "none";
    }
  }

  /**
   * Handles bulk price application with offset.
   * @param {Array} jnResults
   */
  function onApplyPricesClick(jnResults) {
    const offset =
      parseInt(document.getElementById("jn-custom-offset").value, 10) || 0;
    getStockRows().forEach((row) => {
      let input = null;
      row.querySelectorAll("td").forEach((td) => {
        const inp = td.querySelector('input[type="text"]');
        if (inp && inp.name && inp.name.startsWith("cost_")) input = inp;
      });
      if (!input) return;
      const jnPrice = parseInt(input.getAttribute("data-jn-price"), 10);
      if (!jnPrice) return;
      input.value = Math.max(1, jnPrice + offset);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    mapJNPrices(jnResults);
    showApplyReminder();
  }

  // ----------------------
  // Script Entry
  // ----------------------

  // Run on page load
  addCheckPriceButton();
})();
