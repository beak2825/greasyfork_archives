// ==UserScript==
// @name       导出国际化词条(新方舟)
// @namespace    http://your-namespace.com
// @version     1.2.3
// @author      menglingfeng
// @description   Excel
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @require      https://greasyfork.org/scripts/430412-chinese-conversion-api/code/Chinese%20Conversion%20API.js?version=957744
// @grant        none
// @include      *

// @downloadURL https://update.greasyfork.org/scripts/476889/%E5%AF%BC%E5%87%BA%E5%9B%BD%E9%99%85%E5%8C%96%E8%AF%8D%E6%9D%A1%28%E6%96%B0%E6%96%B9%E8%88%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476889/%E5%AF%BC%E5%87%BA%E5%9B%BD%E9%99%85%E5%8C%96%E8%AF%8D%E6%9D%A1%28%E6%96%B0%E6%96%B9%E8%88%9F%29.meta.js
// ==/UserScript==

(function () {
  function doExport() {
    const { sc2tc } = window.ChineseConversionAPI;

    // 示例 JSON 数据
    let vals = [];
    console.error("window.i18", window.i18);
    if (window.i18) {
      vals = window.i18;
      window.localStorage.setItem("i18Set", JSON.stringify(vals));
      delete window.i18;
    } else {
      let data = window.localStorage.getItem("i18Set");
      if (!data) {
        alert("还没有输入词条");
        return;
      }
      vals = JSON.parse(data);
    }
    if (!Array.isArray(vals)) {
      alert("只接受数组");
      return;
    }
    console.warn("获得的词条", vals);
    const [groupkey, obj] = vals;

    const jsonData = Object.entries(obj).map(([keys, val]) => {
      return {
        "*编码": groupkey + "_" + keys,
        "*类型": "front",
        "*分组": groupkey,
        "*内容(zh_CN)": val,
        "*内容(zh_HK)": sc2tc(val), // 将内容(zh_HK)转为繁体中文
        "*内容(en_US)": keys.replace(/_([a-z])/g, function (match, letter) {
          return letter.toUpperCase();
        }), // 使用 val 的值作为 *内容(en_US)
      };
    });

    function exportToExcel(data, fileName) {
      const mappedData = data.map((obj) => {
        return {
          "*编码": obj["*编码"],
          "*类型": obj["*类型"],
          "*分组": obj["*分组"],
          "*内容(zh_CN)": obj["*内容(zh_CN)"],
          "*内容(zh_HK)": obj["*内容(zh_HK)"],
          "*内容(en_US)": obj["*内容(en_US)"],
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "多语言");

      const excelBuffer = XLSX.write(workbook, { type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    exportToExcel(jsonData, `${groupkey}.xlsx`);
  }

  function addButton() {
    const button = document.createElement("button");
    button.textContent = "导出词条";
    button.style.position = "fixed";
    button.style.top = "5px";
    button.style.right = "50%";
    button.style.zIndex = "9999"; // 设置按钮的层级，确保在最前面显示
    button.style.appearance = "none";
    button.style.backgroundColor = "#007fff";
    button.style.color = "#fff";
    button.style.borderRadius = "2px";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.transition = "background-color .3s,color .3s";
    button.style.padding = "0.5rem 1.3rem";

    button.draggable = true;
    button.addEventListener("click", function () {
      doExport();
    });

    document.body.appendChild(button);

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.position = "fixed";
    closeButton.style.top = "5px";
    closeButton.style.right = "50%";
    closeButton.style.zIndex = "9999";
    closeButton.style.appearance = "none";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#001";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "50%";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "0.5rem";
    closeButton.style.marginLeft = "5px";

    closeButton.addEventListener("click", function () {
      document.body.removeChild(button);
      document.body.removeChild(closeButton);
    });

    document.body.appendChild(closeButton);
  }

  function saveButtonPosition() {
    const button = document.querySelector("button[data-export-to-excel]");
    if (button) {
      const { top, right } = button.getBoundingClientRect();
      localStorage.setItem(
        "exportButtonPosition",
        JSON.stringify({ top, right })
      );
    }
  }

  function restoreButtonPosition() {
    const savedPosition = localStorage.getItem("exportButtonPosition");
    if (savedPosition) {
      const { top, right } = JSON.parse(savedPosition);
      const button = document.querySelector("button[data-export-to-excel]");
      button.style.top = `${top}px`;
      button.style.right = `${right}px`;
    }
  }

  addButton();
  restoreButtonPosition();

  // 保存按钮位置到 localStorage
  window.addEventListener("beforeunload", saveButtonPosition);
})();
