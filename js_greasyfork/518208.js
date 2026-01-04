// ==UserScript==
// @name     INVSORTER TEST
// @description invsorter test
// @version  1.3
// @grant    GM_addStyle
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_deleteValue
// @match    https://www.torn.com/item.php
// @namespace https://greasyfork.org/users/1362698
// @downloadURL https://update.greasyfork.org/scripts/518208/INVSORTER%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/518208/INVSORTER%20TEST.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  GM_addStyle(`
.is-container {
  height: 100%;
  margin-right: 2px;

  position: relative;

  display: flex;
  align-items: center;
}

.is-btn {
  height: 22px !important;
  padding: 0 5px !important;
  line-height: 0 !important;
}

.is-modal {
  height: 150px;
  width: 300px;
  margin-top: 8px;
/*   background-color: var(--default-bg-panel-color); */
  background-color: #333;
  border-radius: 5px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

  position: absolute;


  display: grid;
  justify-items: center;
  grid-auto-rows: min-content;
}

.is-modal-header{
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
  padding: 8px 0 12px 0;
  text-decoration: underline;
}

.is-modal-desc{
  font-size: 12px;
  text-align: center;
  margin: 0 12px 0 12px;
  line-height: 1;
}

.is-form{
  text-align: center;
  margin-top: 16px;

  position: relative;

  display: grid;
  align-items: center;
  justify-items: center;
  gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

}

.is-form-text{
  text-align: center;
  width: 160px;
  height: 28px;
  line-height: 0;
  border-radius: 5px;
  background-color: #000;
  color: #9f9f9f;
  border-color: transparent transparent #333 transparent;
  grid-column: span 2 / span 2;
}

.is-form-submit{
  border-radius: 5px !important;
  width: 48px !important;
  height: 24px !important;
  line-height: 0 !important;
  grid-column-start: 1;
  grid-row-start: 2;
}

.is-form-status{
  grid-column-start: 2;
  grid-row-start: 2;
  margin-left: -8px;
}

.is-form-delete-btn{
  cursor: pointer;
  top: 0;
  right: 0;
  transform: translateX(125%);

  position: absolute;
}

.is-form-delete-icon{
  height: 24px;
  width: 24px;
  stroke: #fff;
}
  .is-item-value{
  width: auto !important;
  padding: 0 10px 0 10px !important;
}

.is-item-value-color{
  color: var(--default-green-color);
}

.is-item-qty{
  font-weight: bold;
}

li:has(.group-arrow) .is-item-value{
  width: auto !important;
  padding: 0 30px 0 10px !important;
}
  `);

  let tabs = {};
  let itemValues = {};
  let sortState = "default";
  let posBeforeScroll = null;
  let itemValueSource;

  if (await isKeySaved()) {
    itemValueSource = "is";
    fetchApiValues();
  } else {
    itemValueSource = "tt";
  }

  let currentTab = getCurrentTabElement();
  let currentTabIndex = getCurrentTabIndex();
  recordTab();

  const itemObserver = new MutationObserver((mutationList, observer) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === "childList") {
        if (mutation.addedNodes.length) {
          recordTab();
        }
      }
    });
  });

  const container = document.createElement("span");
  container.classList.add("is-container");
  container.classList.add("right");

  const btn = document.createElement("button");
  btn.classList.add("is-btn");
  btn.classList.add("torn-btn");
  btn.classList.add("dark-mode");
  btn.textContent = "IS";

  const modal = document.createElement("div");
  modal.classList.add("is-modal");
  modal.classList.add("hide");

  const modalHeader = document.createElement("p");
  modalHeader.classList.add("is-modal-header");
  modalHeader.textContent = "INVENTORY SORTER";

  const modalDescription = document.createElement("p");
  modalDescription.classList.add("is-modal-desc");
  modalDescription.textContent = `A public API key is sufficient. The key is stored on your browser, and it's not sent anywhere.`;

  modal.appendChild(modalHeader);
  modal.appendChild(modalDescription);

  const form = document.createElement("form");
  form.classList.add("is-form");

  const formTextInput = document.createElement("input");
  formTextInput.classList.add("is-form-text");

  const formSubmit = document.createElement("input");
  formSubmit.classList.add("is-form-submit");
  formSubmit.classList.add("torn-btn");
  formSubmit.classList.add("dark-mode");

  const formKeyStatusText = document.createElement("p");
  formKeyStatusText.classList.add("is-form-status");

  const formDeleteBtn = document.createElement("button");
  formDeleteBtn.classList.add("is-form-delete-btn");

  if (await isKeySaved()) {
    formKeyStatusText.textContent = "Key: Saved";
    formDeleteBtn.classList.remove("hide");
  } else {
    formKeyStatusText.textContent = "Key: Not Saved";
    formDeleteBtn.classList.add("hide");
  }

  const deleteBtnSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="is-form-delete-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>`;

  formDeleteBtn.insertAdjacentHTML("afterbegin", deleteBtnSvg);

  formTextInput.setAttribute("type", "text");
  formTextInput.setAttribute("placeholder", "API Key");
  formSubmit.setAttribute("type", "button");
  formSubmit.setAttribute("value", "SAVE");
  formSubmit.disabled = true;

  form.appendChild(formTextInput);
  form.appendChild(formSubmit);
  form.appendChild(formKeyStatusText);
  form.appendChild(formDeleteBtn);
  modal.appendChild(form);

  const titleEl = document.querySelector(".title-black");
  container.appendChild(btn);
  container.appendChild(modal);
  titleEl.appendChild(container);

  itemObserver.observe(getCurrentTabContent(), {
    attributes: true,
    childList: true,
    subtree: true,
  });

  const categoryElements =
    document.querySelectorAll("#categoriesList")[0].children;

  titleEl.addEventListener("click", async (e) => {
    if (e.target !== titleEl) return;

    if (
      (await GM_getValue("invsorter", null)) !== null &&
      document.querySelector(".tt-item-price")
    ) {
      alert(
        "Please either delete your API key after clicking the 'IS' button or disable Torn Tools to be able to use Inventory Sorter!"
      );
      return;
    } else if (
      (await GM_getValue("invsorter", null)) === null &&
      !document.querySelector(".tt-item-price")
    ) {
      alert(
        "Please submit your API key after clicking the 'IS' button to be able to use Inventory Sorter!"
      );
      return;
    }

    if (!posBeforeScroll && !tabs[currentTabIndex].isFullyLoaded) {
      posBeforeScroll = window.scrollY;
      await loadTabItems();
    }

    if (tabs[currentTabIndex].isFullyLoaded) {
      sortTab();
    }
  });

  Array.from(categoryElements).forEach((el) => {
    if (el.classList.contains("no-items")) return;

    el.addEventListener("click", (e) => {
      posBeforeScroll = null;
      currentTab = getCurrentTabElement();
      currentTabIndex = getCurrentTabIndex();
      sortState = "default";

      itemObserver.disconnect();
      itemObserver.observe(getCurrentTabContent(), {
        attributes: true,
        childList: true,
        subtree: true,
      });

      recordTab();
    });
  });

  btn.addEventListener("click", async (e) => {
    modal.classList.toggle("hide");
  });

  formSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    const key = formTextInput.value;
    const url = `https://api.torn.com/key/?key=${key}&selections=info&comment=InvSorter`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(res.status);
      }

      const data = await res.json();

      if (data.error && data.error.error) {
        formKeyStatusText.textContent = "API Error!";
        return;
      }

      await GM_setValue("invsorter", key);

      formTextInput.value = "";
      formKeyStatusText.textContent = "Key: Saved";
      formDeleteBtn.classList.toggle("hide");
      formSubmit.disabled = true;
    } catch (err) {
      console.error(`Inventory Sorter: ${err.message}`);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  formTextInput.addEventListener("input", async (e) => {
    if (formTextInput.value === "" && !(await isKeySaved())) {
      formSubmit.disabled = true;
    }

    if (formTextInput.value !== "" && !(await isKeySaved())) {
      formSubmit.disabled = false;
    }
  });

  formDeleteBtn.addEventListener("click", async (e) => {
    await GM_deleteValue("invsorter");

    formTextInput.value = "";
    formKeyStatusText.textContent = "Key: Not Saved";
    formDeleteBtn.classList.toggle("hide");
    formSubmit.disabled = false;
  });

  function recordTab() {
    if (tabs[currentTabIndex]?.isFullyLoaded) return;

    if (tabs[currentTabIndex]) {
      tabs[currentTabIndex].defaultOrder = [...getCurrentTabContent().children];

      if (itemValueSource === "is" && Object.keys(itemValues).length) {
        appendItemValues(tabs[currentTabIndex].defaultOrder);
      }

      return;
    }

    const newTab = {
      [currentTabIndex]: {
        isFullyLoaded: false,
        defaultOrder: [...getCurrentTabContent().children],
      },
    };

    if (itemValueSource === "is" && Object.keys(itemValues).length) {
      appendItemValues(newTab[currentTabIndex].defaultOrder);
    }

    tabs = { ...tabs, ...newTab };
  }

  function getCurrentTabElement() {
    return document.querySelector(".ui-tabs-active");
  }

  function getCurrentTabContent() {
    return document.querySelector('[aria-hidden="false"]');
  }

  function getCurrentTabIndex() {
    return Array.prototype.indexOf.call(
      currentTab.parentNode.children,
      currentTab
    );
  }

  async function fetchApiValues() {
    try {
      const apiKey = await GM_getValue("invsorter", null);
      const url = `https://api.torn.com/torn/?key=${apiKey}&selections=items&comment=InvSorter`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(res);
      }

      const data = await res.json();

      if (data.error && data.error.error) {
        return;
      }

      const { items } = data;

      for (const [id, item] of Object.entries(items)) {
        itemValues[id] = { name: item.name, value: item.market_value };
      }

      appendItemValues(tabs[currentTabIndex].defaultOrder);
    } catch (err) {
      console.error(`Inventory Sorter: ${err.message}`);
    }
  }

  function appendItemValues(defaultElements) {
    Array.from(defaultElements).forEach((el) => {
      if (!el.getAttribute("data-item")) return;

      if (!el.querySelector(".is-item-value")) {
        const nameWrap = el.querySelector(".name-wrap");
        const itemValue = getItemValue(el.getAttribute("data-item"));
        const valueEl = document.createElement("span");
        const totalValueEl = document.createElement("span");
        const qtyEl = el.querySelector(".item-amount");
        const bonusesEl = el.querySelector(".bonuses-wrap");

        valueEl.classList.add("is-item-value-color");
        totalValueEl.classList.add("is-item-value-color");

        let valueContainer;

        if (bonusesEl) {
          valueContainer = document.createElement("li");
          valueContainer.classList.add("is-item-value");
          bonusesEl.appendChild(valueContainer);
        } else {
          valueContainer = document.createElement("span");
          valueContainer.classList.add("is-item-value");
          valueContainer.classList.add("right");
          nameWrap.appendChild(valueContainer);
        }

        if (qtyEl.textContent === "") {
          valueEl.textContent = `${getUsdFormat(itemValue)}`;
          valueContainer.appendChild(valueEl);
        } else {
          valueEl.textContent = `${getUsdFormat(itemValue)} `;

          const itemQty = qtyEl.textContent;
          const newQtyEl = document.createElement("span");
          newQtyEl.classList.add("is-item-qty");
          newQtyEl.textContent = `x ${itemQty} = `;

          totalValueEl.textContent = `${getUsdFormat(itemQty * itemValue)}`;

          valueContainer.appendChild(valueEl);
          valueContainer.appendChild(newQtyEl);
          valueContainer.appendChild(totalValueEl);
        }
      }
    });
  }

  function getItemValue(itemId) {
    return itemValues[itemId]?.value;
  }

  function getUsdFormat(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function sortTab() {
    const defaultOrderCopy = [...tabs[currentTabIndex].defaultOrder];

    const tabItems = [];
    for (const item of defaultOrderCopy) {
      if (item.classList.contains("ajax-item-loader")) {
        continue;
      }

      const itemId = item.getAttribute("data-item");
      let itemQty = item.getAttribute("data-qty");

      if (itemValueSource === "is") {
        if (itemQty === "") {
          itemQty = 1;
        }

        tabItems.push({ el: item, value: getItemValue(itemId) * itemQty });
      } else if (itemValueSource === "tt") {
        const value = item
          .querySelector(".tt-item-price")
          .lastChild.textContent.replace(/[^0-9.-]+/g, "");
        tabItems.push({ el: item, value });
      }
    }

    if (sortState === "default") {
      sortState = "descending";
      tabItems.sort((a, b) => b.value - a.value);
      tabItems.forEach((item) => getCurrentTabContent().appendChild(item.el));
    } else if (sortState === "descending") {
      sortState = "ascending";
      tabItems.sort((a, b) => a.value - b.value);
      tabItems.forEach((item) => getCurrentTabContent().appendChild(item.el));
    } else if (sortState === "ascending") {
      sortState = "default";
      defaultOrderCopy.forEach((item) => {
        if (!item.classList.contains("ajax-item-loader")) {
          getCurrentTabContent().appendChild(item);
        }
      });
    }
  }

  async function loadTabItems() {
    const text = document.querySelector("#load-more-items-desc").textContent;

    if (text.toLowerCase().includes("full")) {
      window.scroll(0, posBeforeScroll);
      tabs[currentTabIndex].isFullyLoaded = true;
      return;
    }

    if (text.toLowerCase().includes("load more")) {
      document.querySelector(".items-wrap").lastElementChild.scrollIntoView();
      await new Promise((resolve) => setTimeout(resolve, 500));
      return loadTabItems();
    }
  }

  async function isKeySaved() {
    return (await GM_getValue("invsorter", null)) !== null;
  }
})();