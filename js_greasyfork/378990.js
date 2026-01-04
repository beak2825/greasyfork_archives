// ==UserScript==
// @name         MouseHunt - Marketplace UI Tweaks
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.6.2
// @description  Adds useful features and tweaks to the Marketplace rework
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/378990/MouseHunt%20-%20Marketplace%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/378990/MouseHunt%20-%20Marketplace%20UI%20Tweaks.meta.js
// ==/UserScript==

(function () {
  /**
   * [ Notes ]
   * innerText has poor retrieval perf, use textContent
   *   http://perfectionkills.com/the-poor-misunderstood-innerText/
   * Is there a better way to center scrollRow vertically within table?
   *   https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
   */

  MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

  // Initialize 'Browse' tab item caching
  if (localStorage.getItem("marketplace-browse-cache-tsitu") === null) {
    const cacheObj = {
      "Cheese": 0,
      "Baskets & Kits": 0,
      "Charms": 0,
      "Crafting": 0,
      "Special": 0,
      "Collectibles": 0,
      "Weapons": 0,
      "Skins": 0
    };
    localStorage.setItem(
      "marketplace-browse-cache-tsitu",
      JSON.stringify(cacheObj)
    );
  }

  // Only observe changes to the #overlayPopup element
  const observerTarget = document.querySelector("#overlayPopup");

  const observer = new MutationObserver(function () {
    // Check if the Marketplace interface is open
    if (observerTarget.querySelector(".marketplaceView")) {
      // Disconnect and reconnect later to prevent mutation loop
      observer.disconnect();

      // Feature: Move close button to top right and clean up visuals
      const oldClose = observerTarget.querySelector(
        ".button[type=submit][value=Close]"
      );
      if (oldClose) {
        const newClose = oldClose.cloneNode();
        oldClose.remove();
        const suffix = observerTarget.querySelector(".suffix");
        if (suffix) suffix.remove();

        newClose.style.position = "absolute";
        newClose.style.right = "0px";
        newClose.style.top = "5px";
        observerTarget.querySelector(".marketplaceView").prepend(newClose);

        const searchContainer = observerTarget.querySelector(
          ".marketplaceView-header-searchContainer"
        );
        if (searchContainer) {
          searchContainer.style.right = "65px";
          searchContainer.style.width = "220px";
        }

        const searchBar = observerTarget.querySelector(
          ".marketplaceView-header-search"
        );
        if (searchBar) {
          searchBar.style.width = "184px";
        }

        // Remove 'X' in top right
        const topX = observerTarget.querySelector("#jsDialogClose");
        if (topX) topX.remove();
      }

      const browseTab = observerTarget.querySelector(
        "[data-tab=browse].active"
      );
      const backButton = observerTarget.querySelector(
        "a.marketplaceView-breadcrumb"
      );

      if (browseTab && !backButton) {
        /* Browse tab logic (active Browse tab + inactive 'Back' button) */

        // Align trend icon divs to the right
        const trendIcons = observerTarget.querySelectorAll(
          ".marketplaceView-trendIcon"
        );
        trendIcons.forEach(el => {
          const td = el.parentElement;
          if (td) {
            td.style.textAlign = "right";
          }
        });

        const sidebar = observerTarget.querySelector(
          ".marketplaceView-browse-sidebar"
        );
        const itemType = sidebar.querySelector(
          ".marketplaceView-browse-sidebar-link.active"
        );

        // Feature: Make item images 40x40 px
        observerTarget
          .querySelectorAll(".marketplaceView-itemImage")
          .forEach(el => {
            el.style.width = "40px";
            el.style.height = "40px";
            el.style.backgroundSize = "100%";
            el.style.minHeight = "40px";
          });

        let totalValueSum = 0;
        let totalValueSell = 0;
        /**
         * Abbreviates large number values up to 1 decimal point
         * k = 1,000 and m = 1,000,000
         * @param {number} num Integer to abbreviate
         * @return {string}
         */
        function abbrev(num) {
          if (num <= 999) {
            return "" + num;
          } else if (num >= 1000 && num <= 999999) {
            let pre = Math.floor(num / 1000);
            let post = Math.round((num % 1000) / 100);
            if (post === 10) {
              post = 0;
              pre += 1;
            }
            return `${pre}.${post}k`;
          } else if (num >= 1000000) {
            let pre = Math.floor(num / 1000000);
            let post = Math.round((num % 1000000) / 100000);
            if (post === 10) {
              post = 0;
              pre += 1;
            }
            return `${pre}.${post}m`;
          }
        }

        const rows = observerTarget.querySelectorAll("tr[data-item-id]");
        if (rows.length > 0) {
          const avgPriceHeader = observerTarget.querySelector(
            "th.marketplaceView-table-averagePrice"
          );

          const valueHeader = document.createElement("th");
          valueHeader.innerText = "Value";
          valueHeader.className =
            "marketplaceView-table-estvalue marketplaceView-table-numeric sortable";

          // Custom "Value" column sort
          valueHeader.onclick = function () {
            if (!valueHeader.classList.contains("active")) {
              valueHeader.classList.add("active");
              observerTarget
                .querySelectorAll(".marketplaceView-table .sortable")
                .forEach(el => {
                  if (
                    !el.classList.contains("marketplaceView-table-estvalue") &&
                    el.classList.contains("active")
                  ) {
                    el.classList.toggle("active");
                  }
                });
            } else {
              valueHeader.classList.toggle("reverse");
            }

            const unsortedArr = [];
            observerTarget
              .querySelectorAll(".marketplaceView-table tr[data-item-id]")
              .forEach(el => {
                unsortedArr.push(el);
                el.remove();
              });

            const sortedArr = unsortedArr.sort((a, b) => {
              let aT = a.title || 0;
              let bT = b.title || 0;

              if (typeof aT === "string") {
                aT = parseInt(aT.split(" Gold")[0].replace(/,/g, ""));
              }

              if (typeof bT === "string") {
                bT = parseInt(bT.split(" Gold")[0].replace(/,/g, ""));
              }

              if (valueHeader.classList.contains("reverse")) {
                return aT - bT; // Low > High
              } else {
                return bT - aT; // High > Low
              }
            });

            const targetTable = observerTarget.querySelector(
              ".marketplaceView-table tbody"
            );
            sortedArr.forEach(el => {
              targetTable.appendChild(el);
            });

            const emptyEl = observerTarget.querySelector(
              ".marketplaceView-table tr.empty"
            );
            if (emptyEl) {
              emptyEl.remove();
              targetTable.appendChild(emptyEl);
            }

            return false;
          };

          if (
            avgPriceHeader &&
            !observerTarget.querySelector(".marketplaceView-table-estvalue")
          ) {
            // Add 'Value' column header
            avgPriceHeader.insertAdjacentElement("afterend", valueHeader);

            rows.forEach(row => {
              // Add click handlers to the <a>'s that open up an item page
              row.querySelectorAll("a").forEach(el => {
                const aText = el.onclick;
                if (aText) {
                  if (aText.toString().indexOf("showItem") >= 0) {
                    el.addEventListener("click", function () {
                      // Parse current item name and type for caching
                      const name = row.querySelector(
                        ".marketplaceView-table-name"
                      );

                      if (name && itemType) {
                        // Retrieve and overwrite localStorage
                        const lsText = localStorage.getItem(
                          "marketplace-browse-cache-tsitu"
                        );
                        if (lsText) {
                          const lsObj = JSON.parse(lsText);
                          lsObj[itemType.textContent] = name.textContent;
                          localStorage.setItem(
                            "marketplace-browse-cache-tsitu",
                            JSON.stringify(lsObj)
                          );
                        }
                      }
                    });
                  }
                }
              });

              // Parse owned quantity
              let ownedNum = 0;
              const ownedText = row.querySelector(
                ".marketplaceView-table-quantity"
              ).textContent;
              if (ownedText !== "-") {
                ownedNum = parseInt(ownedText.split(",").join(""));
              }

              // Parse average prices
              let priceNum = 0;
              const priceText = row.querySelector(".marketplaceView-goldValue");
              if (priceText.children.length > 0) {
                priceNum = parseInt(
                  priceText.children[0].title.split(" ")[0].split(",").join("")
                );
              }

              const multValue = ownedNum * priceNum;
              if (multValue > 0) {
                totalValueSum += multValue;
                const sellValue = Math.floor((priceNum * 100) / 110) * ownedNum;
                totalValueSell += sellValue;
                row.title = `${multValue.toLocaleString()} Gold (Buy)\n${sellValue.toLocaleString()} Gold (Sell)`;
              }

              let outputText = abbrev(multValue);
              if (priceNum === 0) {
                // Avg. Price currently unavailable, but value isn't necessarily 0
                outputText = "N/A";
              }

              const valueColumn = document.createElement("td");
              valueColumn.innerText = outputText;
              valueColumn.className =
                "marketplaceView-table-numeric value-column-tsitu";

              // Feature: Insert 'Own' x 'Avg. Price' = 'Value' column data
              row
                .querySelector(".marketplaceView-table-averagePrice")
                .insertAdjacentElement("afterend", valueColumn);
            });
          }
        }

        // Add info to the sidebar
        if (
          sidebar &&
          !observerTarget.querySelector(".marketplace-sidebar-tsitu")
        ) {
          // Container div
          const div = document.createElement("div");
          div.className = "marketplace-sidebar-tsitu";
          div.style.margin = "20px";

          // Highlighted text
          const span1 = document.createElement("span");
          span1.style.backgroundColor = "#D6EBA1";
          span1.innerText = "highlighted green";

          // Other text
          const span2 = document.createElement("span");
          span2.innerText = "Last viewed item is ";

          div.appendChild(span2);
          div.appendChild(span1);

          // Feature: Add <span> with sum of values on current tab
          const filterDiv = observerTarget.querySelector(
            ".marketplaceView-browse-filterContainer"
          );
          if (
            filterDiv &&
            !observerTarget.querySelector(".marketplace-total-value-tsitu")
          ) {
            const span = document.createElement("span");
            span.className = "marketplace-total-value-tsitu";
            span.innerText = `Total estimated value on this tab: ${totalValueSum.toLocaleString()} (Buy)\n${totalValueSell.toLocaleString()} (Sell)`;

            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));
            div.appendChild(span);
          }

          // Inject into DOM
          sidebar.appendChild(div);
        }

        // Feature: Check cache for most recently clicked item and scroll to it
        const lsText = localStorage.getItem("marketplace-browse-cache-tsitu");
        if (lsText) {
          const lsObj = JSON.parse(lsText);
          const itemType = sidebar.querySelector(
            ".marketplaceView-browse-sidebar-link.active"
          );
          if (itemType) {
            const name = lsObj[itemType.textContent];
            if (name && name !== 0) {
              /**
               * Return row element that matches existing cached item name
               * @param {string} name Cached item name
               * @return {HTMLElement|false} <tr> that should be highlighted and scrolled to
               */
              function findElement(name) {
                for (let el of observerTarget.querySelectorAll(
                  "tr[data-item-id]"
                )) {
                  const aTags = el.querySelectorAll("a");
                  if (aTags.length === 5) {
                    if (name === aTags[2].textContent) {
                      return el;
                    }
                  }
                }

                return false;
              }

              // Calculate index for nth-child
              const targetEl = findElement(name);
              let nthChildValue = 0;
              for (let i = 0; i < rows.length; i++) {
                const el = rows[i];
                if (el === targetEl) {
                  nthChildValue = i + 2;
                  break;
                }
              }

              // tr:nth-child value (min = 2)
              const recentRow = observerTarget.querySelector(
                `.marketplaceView-table tr:nth-child(${nthChildValue})`
              );
              if (recentRow) {
                recentRow.style.backgroundColor = "#D6EBA1";

                // Try scrolling up to 4 rows down
                let scrollRow = recentRow;
                for (let i = 4; i > 0; i--) {
                  const row = observerTarget.querySelector(
                    `.marketplaceView-table tr:nth-child(${nthChildValue + i})`
                  );
                  if (row) {
                    scrollRow = row;
                    break;
                  }
                }

                scrollRow.scrollIntoView({
                  // Seems to wait for XHR & render - slow initially but gets moderately faster
                  behavior: "auto",
                  block: "nearest",
                  inline: "nearest"
                });
              }
            }
          }
        }
      } else if (backButton) {
        /* Listing logic (active 'Back' button) */

        // Feature: Inject tariff info into Sell & Buy Orders rows
        const sellOrders = observerTarget.querySelector(
          ".marketplaceView-item-quickListings.sell"
        );

        const buyOrders = observerTarget.querySelector(
          ".marketplaceView-item-quickListings.buy"
        );

        if (sellOrders && buyOrders) {
          const goldValues = observerTarget.querySelectorAll(
            "td .marketplaceView-goldValue:not(.marketplaceView-suggestedPrice):not(.tsitu-link-bo-minus):not(.tsitu-link-bo-plus)"
          );

          if (goldValues.length > 0) {
            goldValues.forEach(el => {
              const rawVal = el.textContent;
              if (typeof rawVal === "string") {
                const value = parseInt(rawVal.split(",").join(""));
                const tax = Math.ceil(value / 11);
                const preTax = value - tax;
                const titleString = `${preTax.toLocaleString()} (Raw)\n${tax.toLocaleString()} (Tax)`;

                const ppEl = el.parentElement.parentElement;
                if (ppEl.nodeName === "TR") ppEl.title = titleString;
                const qtyEl = ppEl.querySelector(
                  ".marketplaceView-table-listing-quantity"
                );

                // Add a reversible onclick with same info as title
                if (qtyEl && !qtyEl.onclick) {
                  const qtyVal = qtyEl.textContent;

                  function initHandler() {
                    qtyEl.innerText = qtyVal + "\n" + titleString;
                    qtyEl.onclick = revertHandler;
                  }

                  function revertHandler() {
                    qtyEl.innerText = qtyVal;
                    qtyEl.onclick = initHandler;
                  }

                  qtyEl.onclick = initHandler;
                }
              }
            });
          }
        }

        // Feature: More Quick Links
        const orderButton = observerTarget.querySelector(
          ".mousehuntActionButton.marketplaceView-item-submitButton"
        );
        if (orderButton) {
          // Price suggestion parent divs
          const qtySuggest = observerTarget.querySelector(
            ".marketplaceView-item-input.quantity .marketplaceView-item-input-suggested"
          );

          const txType = observerTarget.querySelector(
            ".marketplaceView-item-actionType .marketplaceView-listingType"
          ).classList[1];

          // Check existence of qtySuggest b/c directly clicking 'Sell' results in separate mutations
          if (txType === "sell" && qtySuggest) {
            // Existing 'Sell All' link to clone
            const sellAll = qtySuggest.children[0];

            // Check custom class name to prevent multiple appends
            if (sellAll && !observerTarget.querySelector(".tsitu-link-sabo")) {
              const saQty = parseInt(
                sellAll.textContent.split(": ")[1].split(",").join("")
              );
              if (saQty > 1) {
                const sellAllButOne = sellAll.cloneNode();
                sellAllButOne.className = "tsitu-link-sabo";
                sellAllButOne.setAttribute(
                  "onclick",
                  `hg.views.MarketplaceView.setOrderQuantity(${
                    saQty - 1
                  }); return false;`
                );
                sellAllButOne.innerText = `[ Sell All But One: ${(
                  saQty - 1
                ).toLocaleString()} ]`;
                qtySuggest.appendChild(document.createElement("br"));
                qtySuggest.appendChild(document.createElement("br"));
                qtySuggest.appendChild(sellAllButOne);
              }
            }

            const firstRow = sellOrders.querySelector(
              "td .marketplaceView-goldValue"
            );
            if (firstRow) {
              const rawVal = firstRow.textContent;
              if (typeof rawVal === "string") {
                const value = parseInt(rawVal.split(",").join(""));
                let offerValue = Math.round(value * 0.9999);
                if (offerValue >= value) offerValue = value - 1; // Minimum increment
                if (offerValue <= 10) offerValue = undefined; // Must be at least 10 Gold

                const bestSell = observerTarget.querySelector(
                  ".sell > .marketplaceView-bestPrice"
                );
                if (bestSell.textContent.length > 6) {
                  bestSell.innerText = bestSell.textContent.replace(
                    "Best",
                    "Quick Sell"
                  );
                }

                // Generate <a> manually, not guaranteed an existing link
                if (offerValue) {
                  const boMinusLink = document.createElement("a");
                  boMinusLink.href = "#";
                  boMinusLink.setAttribute(
                    "onclick",
                    `hg.views.MarketplaceView.setOrderPrice(${offerValue}); return false;`
                  );
                  boMinusLink.className =
                    "marketplaceView-goldValue tsitu-link-bo-minus";
                  boMinusLink.innerText = `[ Undercut - 0.01%: ${offerValue.toLocaleString()} ]`;
                  if (!observerTarget.querySelector(".tsitu-link-bo-minus")) {
                    if (bestSell) {
                      bestSell.insertAdjacentElement("afterend", boMinusLink);
                    }
                  }
                }
              }
            }
          } else if (txType === "buy") {
            const firstRow = buyOrders.querySelector(
              "td .marketplaceView-goldValue"
            );
            if (firstRow) {
              const rawVal = firstRow.textContent;
              if (typeof rawVal === "string") {
                const value = parseInt(rawVal.split(",").join(""));
                let offerValue = Math.round(value * 1.0001);
                if (offerValue <= value) offerValue = value + 1; // Minimum increment
                if (offerValue >= 4294967293) offerValue = undefined; // Maximum tx amount

                const bestBuy = observerTarget.querySelector(
                  ".buy > .marketplaceView-bestPrice"
                );
                if (bestBuy.textContent.length > 6) {
                  bestBuy.innerText = bestBuy.textContent.replace(
                    "Best",
                    "Quick Buy"
                  );
                }

                // Generate <a> manually, not guaranteed an existing link
                if (offerValue) {
                  const boPlusLink = document.createElement("a");
                  boPlusLink.href = "#";
                  boPlusLink.setAttribute(
                    "onclick",
                    `hg.views.MarketplaceView.setOrderPrice(${offerValue}); return false;`
                  );
                  boPlusLink.className =
                    "marketplaceView-goldValue tsitu-link-bo-plus";
                  boPlusLink.innerText = `[ Overbid + 0.01%: ${offerValue.toLocaleString()} ]`;
                  if (!observerTarget.querySelector(".tsitu-link-bo-plus")) {
                    if (bestBuy) {
                      bestBuy.insertAdjacentElement("afterend", boPlusLink);
                    }
                  }
                }
              }
            }
          }
        }

        // 'Back' scrolls too far but clicking 'Browse' tab works fine
        // Additional scrolling logic in showItemInBrowser() is to blame
        // Solution: Override 'Back' button behavior only on the 'Browse' tab
        if (browseTab) {
          backButton.setAttribute(
            "onclick",
            "hg.views.MarketplaceView.showBrowser(); return false;"
          );
        }
      }

      // Re-observe after mutation-inducing logic
      observer.observe(observerTarget, {
        childList: true,
        subtree: true
      });
    }
  });

  // Initial observe
  observer.observe(observerTarget, {
    childList: true,
    subtree: true
  });

  /**
   * 2020.09.28
   * loadMoreMyHistory and loadMoreMyHistoryByItem need a "self." in front of their showMyHistory calls
   * Simplest remedy for now seems to be force adding to global scope :/
   */
  const loadHistory = hg.views.MarketplaceView.loadMoreMyHistory.toString();
  if (loadHistory && loadHistory.indexOf("{showMyHistory") >= 0) {
    unsafeWindow.showMyHistory = function () {
      hg.views.MarketplaceView.showMyHistory();
    };
  }

  const loadItemHistory = hg.views.MarketplaceView.loadMoreMyHistoryByItem.toString();
  if (loadItemHistory && loadItemHistory.indexOf("{showMyHistoryByItem") >= 0) {
    unsafeWindow.showMyHistoryByItem = function (itemId) {
      hg.views.MarketplaceView.showMyHistoryByItem(itemId);
    };
  }
})();
