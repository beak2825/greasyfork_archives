// ==UserScript==
// @name         sycm_script
// @namespace    npm/vite-plugin-monkey
// @version      0.0.3
// @author       monkey
// @description  vite-plugin-monkey
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://sycm.taobao.com/mc/mq/property_insight?*
// @downloadURL https://update.greasyfork.org/scripts/474581/sycm_script.user.js
// @updateURL https://update.greasyfork.org/scripts/474581/sycm_script.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const createTwoAdjacentButtons = () => {
    const buttonBox = document.createElement("div");
    buttonBox.style.position = "fixed";
    buttonBox.style.bottom = "10px";
    buttonBox.style.right = "10px";
    buttonBox.style.zIndex = "9999";
    document.body.appendChild(buttonBox);
    buttonBox.style.display = "flex";
    buttonBox.style.flexDirection = "column";
    const button12 = document.createElement("button");
    button12.innerText = "导出品牌";
    buttonBox.appendChild(button12);
    button12.style.marginBottom = "5px";
    const button22 = document.createElement("button");
    button22.innerText = "导出商品";
    buttonBox.appendChild(button22);
    return [button12, button22];
  };
  const randomTime = () => {
    return Math.floor(Math.random() * 3e3) + 1e3;
  };
  const searchForClickModel = async (mobilePhoneModelBox, item) => {
    let antInput = mobilePhoneModelBox == null ? void 0 : mobilePhoneModelBox.querySelector(".ant-input");
    antInput == null ? void 0 : antInput.setAttribute("value", item);
    await waitForFun();
    antInput == null ? void 0 : antInput.dispatchEvent(new Event("input", { bubbles: true }));
    await waitForFun();
    let modelList = mobilePhoneModelBox == null ? void 0 : mobilePhoneModelBox.querySelectorAll(".item-box");
    console.log(modelList);
    let model = Array.from(modelList).find((item1) => {
      console.log(item1, item1 == null ? void 0 : item1.innerText, (item1 == null ? void 0 : item1.innerText) == item);
      return (item1 == null ? void 0 : item1.innerText) == item;
    });
    model == null ? void 0 : model.click();
  };
  const switchToTheGoodsPage = () => {
    const goodsPage = document.querySelector(".oui-card-header-wrapper > div.oui-card-header > div > span > span:nth-child(2)");
    goodsPage == null ? void 0 : goodsPage.click();
  };
  const deleteTheFirstButtonSelected = () => {
    const deleteButton = document.querySelector(
      ".sycm-property-filter-header > div.right-container > div:nth-child(1) > button > i"
    );
    deleteButton == null ? void 0 : deleteButton.click();
  };
  const waitForFun = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, randomTime());
    });
  };
  const setTheNumberOfItems = async () => {
    const antSelectBox = document.querySelector(".alife-dt-card-common-table-page-size-wrapper");
    const antSelect = antSelectBox == null ? void 0 : antSelectBox.querySelector(".ant-select-arrow");
    antSelect == null ? void 0 : antSelect.click();
    await waitForFun();
    const antSelectList = document.querySelectorAll(".ant-select-dropdown-menu-item");
    const antSelectItem = Array.from(antSelectList).find((item) => {
      return (item == null ? void 0 : item.innerText) == "100";
    });
    antSelectItem == null ? void 0 : antSelectItem.click();
  };
  const clickPaging = async () => {
    const antPaginationBox = document.querySelector(".alife-dt-card-common-table-pagination-wrapper");
    const antPagination = antPaginationBox == null ? void 0 : antPaginationBox.querySelector(".ant-pagination-next");
    console.log(111, antPagination);
    let is = true;
    while (is) {
      const antPaginationDisabled = antPagination == null ? void 0 : antPagination.classList.contains("ant-pagination-disabled");
      if (antPaginationDisabled) {
        is = false;
        break;
      }
      console.log(111, antPagination);
      await waitForFun();
      antPagination == null ? void 0 : antPagination.click();
    }
  };
  const exportAllTerminal = async () => {
    const exportButton = document.querySelector(
      "#xws-property-insight-analyse > div > div > button.el-button.xws-cur-button.el-button--default.el-button--small"
    );
    exportButton == null ? void 0 : exportButton.click();
    await waitForFun();
    const exportExcelButton = document.querySelector(
      ".xws-header-bg-h > div > div.el-dropdown > div > button.el-button.el-button--default.el-button--small.el-dropdown__caret-button"
    );
    console.log(exportExcelButton);
    exportExcelButton == null ? void 0 : exportExcelButton.dispatchEvent(
      new Event("mouseenter", {
        bubbles: true,
        // 事件冒泡
        cancelable: true
        // 可取消
      })
    );
    const ariaControls = exportExcelButton == null ? void 0 : exportExcelButton.getAttribute("aria-controls");
    let exportExcelButtonList = document.querySelectorAll(`#${ariaControls} li`);
    const exportCurrentPage = Array.from(exportExcelButtonList).find((item) => {
      return (item == null ? void 0 : item.innerText) == " 导出xlsx表格 ";
    });
    exportCurrentPage == null ? void 0 : exportCurrentPage.click();
    await waitForFun();
    const closeButton = document.querySelectorAll(".el-dialog__headerbtn .el-dialog__close");
    const closeLastButton = Array.from(closeButton).pop();
    closeLastButton == null ? void 0 : closeLastButton.click();
  };
  const exportGoods = async () => {
    const exportButton = document.querySelector(
      "#xws-hot-sales > div > div > button.el-button.xws-cur-button.el-button--default.el-button--small"
    );
    exportButton == null ? void 0 : exportButton.click();
    await waitForFun();
    const exportExcelButton = document.querySelector(
      ".xws-header-bg-h > div > div.el-dropdown > div > button.el-button.el-button--default.el-button--small.el-dropdown__caret-button"
    );
    console.log(exportExcelButton);
    exportExcelButton == null ? void 0 : exportExcelButton.dispatchEvent(
      new Event("mouseenter", {
        bubbles: true,
        // 事件冒泡
        cancelable: true
        // 可取消
      })
    );
    const ariaControls = exportExcelButton == null ? void 0 : exportExcelButton.getAttribute("aria-controls");
    let exportExcelButtonList = document.querySelectorAll(`#${ariaControls} li`);
    const exportCurrentPage = Array.from(exportExcelButtonList).find((item) => {
      return (item == null ? void 0 : item.innerText) == " 导出xlsx表格 ";
    });
    exportCurrentPage == null ? void 0 : exportCurrentPage.click();
    await waitForFun();
    const closeButton = document.querySelectorAll(".el-dialog__headerbtn .el-dialog__close");
    const closeLastButton = Array.from(closeButton).pop();
    closeLastButton == null ? void 0 : closeLastButton.click();
  };
  const searchAndSelectFun = async (str) => {
    let mobilePhoneModelBox = document.querySelectorAll(".sycm-property-container .sycm-property-row");
    const sycmPropertyContainer = document.querySelector(".sycm-property-container");
    sycmPropertyContainer == null ? void 0 : sycmPropertyContainer.scrollTo(0, sycmPropertyContainer.scrollHeight);
    await waitForFun();
    mobilePhoneModelBox = document.querySelectorAll(".sycm-property-container .sycm-property-row");
    const mobilePhoneModelBoxItem = Array.from(mobilePhoneModelBox).find((item) => {
      let leftContainer = item == null ? void 0 : item.querySelector(".left-container");
      return (leftContainer == null ? void 0 : leftContainer.innerText) == str;
    });
    mobilePhoneModelBoxItem == null ? void 0 : mobilePhoneModelBoxItem.scrollIntoView({ behavior: "smooth", block: "center" });
    const mobilePhoneModelButtonBox = mobilePhoneModelBoxItem == null ? void 0 : mobilePhoneModelBoxItem.querySelector(".property-row-fold-container > span");
    mobilePhoneModelButtonBox == null ? void 0 : mobilePhoneModelButtonBox.click();
    await waitForFun();
    return mobilePhoneModelBoxItem;
  };
  let [button1, button2] = createTwoAdjacentButtons();
  button1.onclick = async () => {
    await downloadBrandData();
    alert("下载完成");
  };
  button2.onclick = async () => {
    await downloadModelData();
    alert("下载完成");
  };
  const mobilePhoneBrand = ["Apple/苹果", "honor/荣耀", "Huawei/华为", "Samsung/三星", "MIUI/小米", "OPPO", "vivo"];
  const mobilePhoneModelButton = [
    "华为 Mate 60",
    "华为 Mate 60 Pro",
    "华为 Mate 60 Pro+",
    "华为 Mate 60 RS 保时捷设计",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro",
    "iPhone 15 Pro Max",
    "iPhone 15 Ultra"
  ];
  const downloadModelData = async () => {
    let mobileBox = null;
    for (let i = 0; i < mobilePhoneModelButton.length; i++) {
      const item = mobilePhoneModelButton[i];
      if (i === 0) {
        let box = await searchAndSelectFun("适用手机型号");
        mobileBox = box;
      }
      await searchForClickModel(mobileBox, item);
      if (i === 0) {
        deleteTheFirstButtonSelected();
      }
      await waitForFun();
      await exportAllTerminal();
      await waitForFun();
      switchToTheGoodsPage();
      await waitForFun();
      setTheNumberOfItems();
      await waitForFun();
      await clickPaging();
      await exportGoods();
    }
  };
  const downloadBrandData = async () => {
    let mobileBox = null;
    for (let i = 0; i < mobilePhoneBrand.length; i++) {
      const item = mobilePhoneBrand[i];
      if (i === 0) {
        let box = await searchAndSelectFun("适用品牌");
        mobileBox = box;
      }
      await searchForClickModel(mobileBox, item);
      if (i === 0) {
        deleteTheFirstButtonSelected();
      }
      await waitForFun();
      await exportAllTerminal();
      await waitForFun();
      switchToTheGoodsPage();
      await waitForFun();
      setTheNumberOfItems();
      await waitForFun();
      await clickPaging();
      await exportGoods();
    }
  };

})();
