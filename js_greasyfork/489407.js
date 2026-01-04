// ==UserScript==
// @name         Temu Product Valuation
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Estimate the selling price of Temu products based on profit margin
// @author       ismile
// @match        https://order.1688.com/order/*
// @grant        none
// @icon         data:image/png;base64,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
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489407/Temu%20Product%20Valuation.user.js
// @updateURL https://update.greasyfork.org/scripts/489407/Temu%20Product%20Valuation.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let quantityElement, goodsPriceTotalElement, freightElement, quantitySpecificationsInput

  // Calculate Temu valuation results
  function calculateTemuEstimation(goodsValue, staffPackagingFees, extraFreight) {
    let temuEstimation, lowMaxP, baseLowMinP, lowDiff, highPropDiff, highProp;
    (lowMaxP = 10), (baseLowMinP = 2.5), (lowDiff = 2.5); // 0~10 => 2.5~5
    (highPropDiff = 0.12), (highProp = 0.38); // 38% - 50%
    if (goodsValue > 0 && goodsValue <= lowMaxP) {
      temuEstimation = goodsValue + (goodsValue / lowMaxP) * lowDiff + baseLowMinP + staffPackagingFees + extraFreight;
    } else {
      temuEstimation = goodsValue + goodsValue * (Math.random() * highPropDiff + highProp) + staffPackagingFees + extraFreight;
    }
    // Round to two decimal places and replace the last decimal place that is not the number 9 with 9
    temuEstimation = Math.round(temuEstimation * 100) / 100;
    let temuEstimationString = temuEstimation.toFixed(2);
    if (temuEstimationString.charAt(temuEstimationString.length - 1) !== "9") {
      temuEstimationString = temuEstimationString.slice(0, -1) + "9";
    }
    return parseFloat(temuEstimationString).toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2,}); // Add thousands separator
  }

  // Get the total quantity and update the product value
  function updateGoodsValue() {
    if (quantityElement && goodsPriceTotalElement && freightElement) {
      const quantity = parseInt(quantityElement.textContent.match(/\d+/g)[1]);
      const goodsPriceTotal = parseFloat(goodsPriceTotalElement.textContent.replace(/,/g, "").split("￥")[1]);
      const freight = parseFloat(freightElement.textContent.replace(/,/g, "").split("￥")[1]);
      const orderTotal = goodsPriceTotal + freight;
      const qSI = document.getElementById("quantitySpecificationsInput");
      const quantitySpecificationsValue = qSI != null ? parseInt(qSI.value) : 1;
      const goodsValue = (orderTotal / quantity) * quantitySpecificationsValue;

      // Calculate Temu valuation results
      const staffPackagingFees = 0.3 + 0.2;
      const extraFreight = (freight / quantity) * quantitySpecificationsValue;
      const temuEstimation = calculateTemuEstimation(goodsValue, staffPackagingFees, extraFreight);

      // Update the product value results on the page
      const goodsValueElement = document.querySelector(".item-goods-value .goods-value");
      const goodsLableZh = document.querySelector(".item-goods-value .goods-label .zh");
      const goodsLableEn = document.querySelector(".item-goods-value .goods-label .en");
      const goodsValueString = goodsValue.toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2,}); // Add thousands separator

      if (goodsValueElement && goodsLableZh && goodsLableEn) {
        goodsValueElement.textContent = `￥${goodsValueString}`;
        goodsLableZh.textContent = quantitySpecificationsValue;
        goodsLableEn.textContent = `${quantitySpecificationsValue === 1 ? " pc" : " pcs"}`;
      }

      // Update Temu valuation results
      const temuEstimationElement = document.querySelector(".item-temu-estimation .temu-estimation");
      if (temuEstimationElement) {
        temuEstimationElement.textContent = `￥${temuEstimation}`;
      }
    }
  }

  function updateGoodsLables(value) {
    const goodsLableS = document.querySelector(".qs .s");
    goodsLableS.textContent = value;
  }

  function waitForNode(selector, callback, type) {
    const interval = setInterval(() => {
      const node = type === 1 ? document.querySelector(selector) : document.getElementById(selector);
      if (node) {
        clearInterval(interval);
        callback(node);
      }
    }, 10);
  };

  waitForNode(
    ".total-summary-container",
    (parentNode) => {
      const quantitySpecificationsInputDiv = document.createElement("div");
      quantitySpecificationsInputDiv.className = "quantity-unit-finecontrol";
      quantitySpecificationsInputDiv.style.overflow = "hidden"; // Make sure the content does not overflow
      quantitySpecificationsInputDiv.style.maxHeight = "0"; // Initial height
      quantitySpecificationsInputDiv.style.transition = "max-height 1.8s ease, opacity 1.8s ease"; // Animation effects
      quantitySpecificationsInputDiv.style.opacity = "0"; // Initial transparency
      quantitySpecificationsInputDiv.innerHTML = `
        <div class="quantity-unit-finecontrol" style="display: flex; justify-content: flex-end; gap: 8px;">
            <span class="qs" style="vertical-align: text-bottom; font-size: 12px; line-height: 20px;">数量规格 <em class="s" style="font-size: 12px; font-weight: bold; color: #FF6000">1</em><em style="font-size: 12px; font-weight: bold;"> 件装</span>
            <div style="line-height: normal;">
                <button class="minus" id="decreaseQuantity" style="background-color: lightpink; border-style: none; border-radius: 3px">-</button>
                <input id="quantitySpecificationsInput" type="text" class="input lang-input" data-error="    " value="1" autocomplete="off" style="width: 50px; text-align: center; background-color: bisque; border-style: none; border-radius: 3px">
                <button class="plus" id="increaseQuantity" style="background-color: lightpink; border-style: none; border-radius: 3px">+</button>
            </div>
        </div>
      `;
      parentNode.insertBefore(quantitySpecificationsInputDiv, parentNode[2]);
      // Activate animation
      setTimeout(() => {
        quantitySpecificationsInputDiv.style.maxHeight = "100px"; // Set target height
        quantitySpecificationsInputDiv.style.opacity = "1";
      }, 10);
    },
    1
  );

  waitForNode(
    "quantitySpecificationsInput",
    (parentNode) => {
      quantitySpecificationsInput = parentNode;
      quantitySpecificationsInput.addEventListener("blur", () => {
        const value = parseInt(quantitySpecificationsInput.value);
        if (
          isNaN(value) ||
          value <= 0 ||
          quantitySpecificationsInput.value.trim() === ""
        ) {
          quantitySpecificationsInput.value = 1;
        }
        updateGoodsValue();
        updateGoodsLables(parseInt(quantitySpecificationsInput.value));
      });
    },
    0
  );

  waitForNode(
    "decreaseQuantity",
    (decreaseButton) => {
      decreaseButton.addEventListener("click", () => {
        if (parseInt(quantitySpecificationsInput.value) > 1) {
          quantitySpecificationsInput.value =
            parseInt(quantitySpecificationsInput.value) - 1;
          updateGoodsValue();
          updateGoodsLables(parseInt(quantitySpecificationsInput.value));
        }
      });
    },
    0
  );

  waitForNode(
    "increaseQuantity",
    (increaseButton) => {
      increaseButton.addEventListener("click", () => {
        quantitySpecificationsInput.value =
          parseInt(quantitySpecificationsInput.value) + 1;
        updateGoodsValue();
        updateGoodsLables(parseInt(quantitySpecificationsInput.value));
      });
    },
    0
  );

  waitForNode(
    ".total-summary-container .quantity-unit-finecontrol",
    (parentNode) => {
      const newItem = document.createElement("div");
      newItem.className = "item-goods-value";
      newItem.innerHTML = `
      <div class="order-inner item-goods-value" style="line-height: 24px; text-align: right; display: flex; justify-content: flex-end; align-items: center;">
        <span class="goods-label">商品货值 <em class="zh" style="font-size: 12px; font-weight: bold; color: #FF6000">1</em><em class="en" style="font-size: 12px; font-weight: bold;">pc</em> 含运费</span>
        <span class="control"><em style="display: flex; font-size: 14px; font-weight: bold;" class="goods-value">￥N/A</em></span>
      </div>
    `;
      parentNode.appendChild(newItem);
    },
    1
  );

  waitForNode(
    ".total-summary-container .quantity-unit-finecontrol",
    (parentNode) => {
      const newItem = document.createElement("div");
      newItem.className = "item-temu-estimation";
      newItem.innerHTML = `
        <div class="order-inner item-temu-estimation" style="line-height: 24px; text-align: right; display: flex; justify-content: flex-end; align-items: center;">
          <span class="label" style="font-size: 12px; line-height: 1.5; font-weight: 700;">Temu估价结果</span>
          <span class="control"><em class="temu-estimation" style="display: flex; color: #FF6000;font-weight: bold; font-size: 18px;">￥N/A</em></span>
        </div>
      `;
      parentNode.appendChild(newItem);
    },
    1
  );

  function goodsQGF() {
    quantityElement = document.querySelector(".summary-items > div:nth-child(1) .list-item-title");
    goodsPriceTotalElement = document.querySelector(".summary-items > div:nth-child(1) .list-item-extra");
    freightElement = document.querySelector(".summary-items > div:nth-child(2) .list-item-extra");
    updateGoodsValue();
  }

  function waitForElement(selector, callback, interval = 10, timeout = 5000) {
    const startTime = Date.now();

    const checkExist = () => {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkExist, interval);
      } else {
        console.error(`wait for element timeout: ${selector}`);
      }
    };

    checkExist();
  }

  waitForElement(".total-summary-container > div.summary-items > div:nth-child(1) > div > div.list-item-extra > div > div", (targetNode) => {
    setTimeout(goodsQGF, 10);
    const observer = new MutationObserver(() => {
      goodsQGF();
    });

    observer.observe(targetNode, {childList: true, subtree: true, characterData: true});
  });
})();