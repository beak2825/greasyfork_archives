// ==UserScript==
// @name         Costco Gold to Pure Calculator
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a Pure profit calculator to Costco gold
// @author       wavydavy
// @match        *://www.costco.com/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542240/Costco%20Gold%20to%20Pure%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/542240/Costco%20Gold%20to%20Pure%20Calculator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Change Pure fee here if you have a different rate (in decimal)
   */
  const PURE_FEE = 0.007;
  let pureURL = '';

  /**
   * Add new gold SKUs here, following this format:
   * [12345678, 'http://www.current.pure.com/***']k
   */
  const GOLD_SKUS = [
    [
      1844409,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pampnewmont-lady-of-liberty-new-in-assay0087",
    ],
    [
      1768080,
      "https://www.collectpure.com/marketplace/product/1-oz-rand-refinery-gold-bar-9999-fine-sealed-in-assay-card000108",
    ],
     [
      1943085,
      "https://www.collectpure.com/marketplace/product/1-oz-rand-refinery-gold-bar-9999-fine-sealed-in-assay-card000108",
    ],
    [
      1801206,
      "https://www.collectpure.com/marketplace/product/100-gram-pamp-gold-bar-9999-fine-sealed-in-assay000118",
    ],
    [
      1796444,
      "https://www.collectpure.com/marketplace/product/100-gram-rand-refinery-gold-bar-9999-fine-sealed-with-carded-assay000667",
    ],
    [
      1957979,
      "https://www.collectpure.com/marketplace/product/100-gram-rand-refinery-gold-bar-9999-fine-sealed-with-carded-assay000667",
    ],

    [
      1886707,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-argor-heraeus-kinebar-9999-fine-sealed-in-carded-assay000551",
    ],
    [
      1844407,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pamp-suisse-good-luck-koi-fish0080",
    ],
    [
      1801206,
      "https://www.collectpure.com/marketplace/product/100-gram-pamp-gold-bar-9999-fine-sealed-in-assay000118",
    ],
    [
      1748080,
      "https://www.collectpure.com/marketplace/product/1-oz-pamp-fortuna-gold-bar-9999-fine-in-assay000023",
    ],
    [
      1913480,
      "https://www.collectpure.com/marketplace/product/2025-american-gold-eagle-1-oz-50-coin0111",
    ],
    [
      1887700,
      "https://www.collectpure.com/marketplace/product/2025-canadian-gold-maple-leaf-1-oz-50-coin-9999-fine0094",
    ],
    [
      1913483,
      "https://www.collectpure.com/marketplace/product/2025-american-gold-buffalo-1-oz-50-9999-fine-24k-gold-coin0110",
    ],
    [
      1913480,
      "https://www.collectpure.com/marketplace/product/2025-american-gold-eagle-1-oz-50-coin0111",
    ],
    [
      1929992,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pamp-bald-eagle0113",
    ],
    [
      1814006,
      "https://www.collectpure.com/marketplace/product/canadian-gold-maple-leaf-1-oz-2024000208",
    ],
    [
      1782174,
      "https://www.collectpure.com/marketplace/product/50-gram-pamp-fortuna-gold-bar-9999-fine-sealed-in-assay000119",
    ],
    [
      1811661,
      "https://www.collectpure.com/marketplace/product/25-x-1g-gold-bar-pamp-multigram-gold-bar-carded-sealed000166",
    ],
    [
      1930004,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pamp-liberty-bell0114",
    ],
    [
      1887702,
      "https://www.collectpure.com/marketplace/product/5-oz-gold-pamp-veriscan-bar-9999-fine-sealed-with-plastic-assay-card000201",
    ],
    [
      1844408,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pamp-suisse-lunar-legends-white-snake0079",
    ],
    [
      1887701,
      "https://www.collectpure.com/marketplace/product/10-oz-gold-pamp-veriscan-bar-9999-fine-sealed-with-plastic-assay-card000202",
    ],
    [
      1844406,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pamp-suisse-diwali-lakshmi0056",
    ],
    [
      1943074,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pampnewmont-lady-of-liberty-new-in-assay0087",
    ],
    [
      1943308,
      "https://www.collectpure.com/marketplace/product/1-oz-pamp-fortuna-gold-bar-9999-fine-in-assay000023",
    ],
    [
      1943072,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pamp-suisse-diwali-lakshmi0056",
    ],
    [
      8888808,
      "https://www.collectpure.com/marketplace/product/1-oz-gold-bar-pamp-suisse-good-luck-yellow-dragon-new-in-assay0124",
    ],
    [
      1968751,
      "https://www.collectpure.com/marketplace/product/1-oz-britannia-gold-bar-9999-fine-sealed-in-assay-card000110"
    ],
    [
      1976563,
      "https://www.collectpure.com/marketplace/product/20-gram-pamp-rosa-gold-bar-9999-fine-sealed-in-carded-assay000346"
    ],
    [
      1942925,
      "https://www.collectpure.com/marketplace/product/12-oz-gold-bar-pamp-suisse-lady-fortuna-veriscan-carded-assay0134"
    ],
    [
      1982277,
      "https://www.collectpure.com/marketplace/product/100-gram-royal-mint-britannia-gold-bar-9999-fine-sealed-in-assay000143"
    ],
  ];

  const GOLD_OPTIONS = new Map(GOLD_SKUS);

  const sku = Number(document.querySelector("span[data-sku]")?.innerText);
  const value = document.querySelector(".value");

  if (!sku) {
    console.log(`SKU not found`);
    return;
  }

  const currentURL = window.location.href.toString();

  const selector = "div.text-xl.font-medium";

  // Open the target page in a new tab
  console.log("Script running on Costco page...");

  function waitForPrice() {
    return new Promise((resolve) => {
      if (value.innerText !== "--") {
        return resolve(Number(value?.innerText?.replace(/[^0-9.-]+/g, "")));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(".value")?.innerText !== "--") {
          observer.disconnect();
          resolve(Number(value.innerText?.replace(/[^0-9.-]+/g, "")));
        }
      });
      observer.observe(value, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
  }

  waitForPrice().then((valueNum) => {
    pureURL = GOLD_OPTIONS.get(sku);

    if (pureURL === null || pureURL === undefined) {
      console.log("SKU not found, ignoring page...");
      return;
    }

    let newTab = GM_openInTab(pureURL, { active: false });

    GM_xmlhttpRequest({
      method: "GET",
      url: pureURL,
      onload: function (response) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response.responseText, "text/html");

        let scrapedData = doc.querySelectorAll(selector)[0]?.innerText;
        console.log("Scraped Data from CollectPure:", scrapedData);

        addPriceToPage(scrapedData, valueNum);
        newTab.close();
      },
    });
  });

  function addPriceToPage(price, valueNum) {
    const div = document.createElement("div");
    div.style.cssText = `
            bottom: 10px;
            right: 10px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
        `;

    if (price === "None") {
      price = "0";
    }

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = '1';
    qtyInput.step = 1;
    qtyInput.value = 1;
    qtyInput.style.cssText = `
        padding: 5px;
        margin: 5px;
        width: 100px;
        background-color: rgba(0, 0, 0, 0.8);

    `;

    const quantity = document.createElement("span");
    quantity.textContent = "Quantity: ";
    quantity.style.cssText = `
                display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        `;
    quantity.appendChild(qtyInput);

    const costcoPriceInput = document.createElement("input");
    costcoPriceInput.type = "number";
    costcoPriceInput.min = 0.01;
    costcoPriceInput.step = 0.01;
    costcoPriceInput.value = valueNum;
    costcoPriceInput.style.cssText = `
        padding: 5px;
        margin: 5px;
        width: 100px;
        background-color: rgba(0, 0, 0, 0.8);

    `;

    const costcoPrice = document.createElement("span");
    costcoPrice.textContent = "Costco Price: $";
    costcoPrice.style.cssText = `
                display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        `;
    costcoPrice.appendChild(costcoPriceInput);

    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.min = 0.01;
    priceInput.step = 0.01;
    priceInput.value = Number(price.replace(/[^0-9.-]+/g, ""));
    priceInput.style.cssText = `
                padding: 5px;
                margin: 5px;
                width: 100px;
                background-color: rgba(0, 0, 0, 0.8);
            `;

    const purePrice = document.createElement("span");
    purePrice.textContent = `Pure Price: $`;
    purePrice.style.cssText = `
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        `;
    purePrice.appendChild(priceInput);

    const cashbackInput = document.createElement("input");
    cashbackInput.type = "text";
    cashbackInput.min = 0;
    cashbackInput.step = 0.1;
    cashbackInput.value = 4;
    cashbackInput.style.cssText = `
                padding: 5px;
                margin: 5px;
                width: 100px;
                background-color: rgba(0, 0, 0, 0.8);
            `;
    const cashbackPercentage = document.createElement("span");
    cashbackPercentage.textContent = `Cashback (in %): `;
    cashbackPercentage.style.cssText = `
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-bottom: 8px;
    `;

    cashbackPercentage.appendChild(cashbackInput);

    priceInput.addEventListener("input", () => {
      updateSellPrice(
        div,
        priceInput.value,
        costcoPriceInput.value || valueNum,
        cashbackInput.value,
        qtyInput.value,
      );
    });

    costcoPriceInput.addEventListener("input", () => {
      updateSellPrice(
        div,
        priceInput.value,
        costcoPriceInput.value || valueNum,
        cashbackInput.value,
        qtyInput.value,
      );
    });

    cashbackInput.addEventListener("blur", () => {
      try {
        // Evaluate the arithmetic expression
        if (/^[\d+\-*/().\s]+$/.test(cashbackInput.value)) {
          // eslint-disable-next-line no-eval
          const result = eval(cashbackInput.value);
          cashbackInput.value = result;
        } else {
          cashbackInput.value = 0;
        }
      } catch {
        cashbackInput.value = 0;
      }


      updateSellPrice(
        div,
        priceInput.value,
        costcoPriceInput.value || valueNum,
        cashbackInput.value,
        qtyInput.value,
      );
    });

    qtyInput.addEventListener('change', () => {
      console.log('Qty update', qtyInput.value)
      updateSellPrice(
        div,
        priceInput.value,
        costcoPriceInput.value || valueNum,
        cashbackInput.value,
        qtyInput.value,
      )
    })

    div.appendChild(costcoPrice);
    div.appendChild(purePrice);
    div.appendChild(quantity);
    div.appendChild(cashbackPercentage);
    updateSellPrice(
      div,
      priceInput.value,
      costcoPriceInput.value || valueNum,
      cashbackInput.value,
      qtyInput.value,
    );

    document.querySelector(".math-table")?.appendChild(div);
  }

  function updateSellPrice(div, price, valueNum, cbPercentage, quantity) {
    let qty = Number(quantity);
    let priceNum = Number(price).toFixed(2) * qty;
    let costcoPrice = Number(valueNum).toFixed(2) * qty;
    let fees = (priceNum * PURE_FEE).toFixed(2);
    let cashback = (Number(cbPercentage / 100) * costcoPrice).toFixed(2);

    let sellPrice = (priceNum - fees).toFixed(2);
    let sellPercentage = (((sellPrice - (valueNum * qty)) / priceNum) * 100).toFixed(2);
    let profit = Number(
      sellPrice - (valueNum * qty) + (cbPercentage / 100) * costcoPrice
    ).toFixed(2);

    let feesEle = div.querySelector(".fees");
    if (!feesEle) {
      feesEle = document.createElement("span");
      feesEle.className = "fees";
      feesEle.style.fontWeight = "bold";
      div.appendChild(feesEle);
    }
    feesEle.textContent = `Pure Fees: -$${fees} (${(PURE_FEE * 100).toFixed(
      1
    )}%)`;

    let sellPriceEle = div.querySelector(".sell-price");
    if (!sellPriceEle) {
      sellPriceEle = document.createElement("span");
      sellPriceEle.className = "sell-price";
      sellPriceEle.style.fontWeight = "bold";
      div.appendChild(sellPriceEle);
    }
    sellPriceEle.textContent = `Selling Price: $${sellPrice} (${sellPercentage}%)`;

    let cashbackEle = div.querySelector(".cashback");
    if (!cashbackEle) {
      cashbackEle = document.createElement("span");
      cashbackEle.className = "cashback";
      cashbackEle.style.cssText = `
                font-weight: bold;
                margin-bottom: 8px;
            `;
      div.appendChild(cashbackEle);
    }
    cashbackEle.textContent = `Cashback earned: $${cashback}`;

    let profitEle = div.querySelector(".profit");
    if (!profitEle) {
      profitEle = document.createElement("span");
      profitEle.className = "profit";
      profitEle.style.fontWeight = "bold";
      profitEle.style.fontSize = "24px";
      profitEle.style.cssText = `
            font-weight: bold;
            font-size: 24px;
            background-color: white;
            border-radius: 5px;
            `;
      div.appendChild(profitEle);
      let newTabBtn = document.createElement("button");
      newTabBtn.innerHTML = "Show Pure";
      newTabBtn.style.cssText = `
            font-weight: bold;
            font-size: 24px;
            background-color: black;
            border-radius: 5px;
            `;
      newTabBtn.addEventListener("click", function() {
        window.open(pureURL);
      });
      div.appendChild(newTabBtn);
    }
    profitEle.textContent = `Profit: $${profit}`;

    profitEle.style.color = profit > 0 ? "green" : "red";
  }
})();
