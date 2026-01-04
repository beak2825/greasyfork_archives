// ==UserScript==
// @name         Wod 团仓耗材清理助手
// @icon           http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace    http://tampermonkey.net/
// @description  帮助快速勾选要清仓耗材及提供已勾选物品的数量统计
// @author       Christophero
// @version      2022.10.02.1
// @match        http*://*.world-of-dungeons.org/wod/spiel/hero/items.php?*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520624/Wod%20%E5%9B%A2%E4%BB%93%E8%80%97%E6%9D%90%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520624/Wod%20%E5%9B%A2%E4%BB%93%E8%80%97%E6%9D%90%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  /**
   * 插入Css样式
   * @param {*} select
   * @param {*} styles
   */
  function insertCss(select, styles) {
    if (document.styleSheets.length === 0) {
      //如果没有style标签,则创建一个style标签
      var style = document.createElement("style");
      document.head.appendChild(style);
    }
    var styleSheet = document.styleSheets[document.styleSheets.length - 1]; //如果有style 标签.则插入到最后一个style标签中
    var str = select + " {"; //插入的内容必须是字符串,所以得把obj转化为字符串
    for (var prop in styles) {
      str +=
        prop.replace(/([A-Z])/g, function (item) {
          //使用正则把大写字母替换成 '-小写字母'
          return "-" + item.toLowerCase();
        }) +
        ":" +
        styles[prop] +
        ";";
    }
    str += "}";
    styleSheet.insertRule(str, styleSheet.cssRules.length); //插入样式到最后一个style标签中的最后面
  }

  let defaultMap = {
    normal: { 一大块精炼硫磺: 100, 一小把寒炼沙土: 200, 盛精炼硫磺的坩埚: 150 },
    medicaments: {
      斑叶防风: 100,
      胡姜瘿: 100,
      蓝越橘: 100,
      龙血树胶: 100,
      智者秃顶: 100,
      曼陀罗: 100,
      巨魔肌腱: 100,
      北境柳: 100,
      铅树心木: 100,
      蟹蛛丝囊: 100,
      铁杉鳞果: 100,
      萤火虫软壳: 100,
      魔鬼爪: 100,
      黑枭眼珠: 100,
      紫龙舌兰: 100,
      血榆实: 100,
      阿伊恩萿: 100,
      莲花芯: 100,
      银刺嫩叶: 100,
      雪蓟: 100,
      白鬼帽: 100,
      毛冬青: 100,
    },
  };
  let cleanMap;

  const CLEAN_WARE_HOUSE_KEY = "cleanWareHouseSettings";

  main();

  /**
   * 插件主入口
   */
  function main() {
    const isWarehouse = $(
      'h1:contains("团队仓库"),h1:contains("所有英雄共用的贮藏室")'
    ).length;
    if (!isWarehouse) return;
    initJQUIStyle();
    cleanMap = loadSettings();
    addOptBtn();
    addRowOptBtn();
  }

  /**
   * 初始化JqueryUI的样式表
   */
  function initJQUIStyle() {
    let $toolbarCss = $("<link>");
    $("head").prepend($toolbarCss);
    $toolbarCss.attr({
      rel: "stylesheet",
      type: "text/css",
      href: "https://code.jquery.com/ui/1.13.2/themes/humanity/jquery-ui.css",
    });
    document.querySelector("style").textContent +=
      ".ui-dialog { height: 600px !important; } " +
      ".ui-dialog .ui-dialog-content { height: 90% !important; } " +
      "@media (min-width:1px) { .ui-dialog { width: 95% !important; } } " +
      "@media (min-width: 768px) { .ui-dialog { max-width:900px !important; width:95% !important; } }";
  }

  /**
   * 加载设置
   */
  function loadSettings() {
    let settings = {};
    const textSettings = localStorage.getItem(CLEAN_WARE_HOUSE_KEY);
    if (!textSettings) {
      settings = JSON.parse(JSON.stringify(defaultMap));
    } else {
      settings = JSON.parse(textSettings);
    }
    return settings;
  }

  /**
   * 保存设置
   * @param {Object} settings 设置对象
   */
  function saveSettings(settings) {
    localStorage.setItem(CLEAN_WARE_HOUSE_KEY, JSON.stringify(settings));
  }

  /**
   * 添加操作按钮
   */
  function addOptBtn() {
    const $checkBtn = $(
      '<input type="button" name="batchSelect" value="批量耗材勾选" class="button clickable">'
    );

    const $overviewBtn = $(
      '<input type="button" name="overview" value="勾选概览" class="button clickable">'
    );

    const $settingsBtn = $(
      '<input type="button" name="settings" value="管理预设" class="button clickable">'
    );

    const $exportBtn = $(
      '<input type="button" name="export" value="导出" class="button clickable">'
    );

    const $fileBtn = $(
      '<input type="file" id="cleanFile" name="cleanFile" runat="server"  style="position:relative; z-index:10; filter:alpha(opacity=0);-moz-opacity:0; opacity:0; width: 65px; left:-65px;">'
    );

    const $importBtn = $(
      '<input type="button" name="button" value="导入" class="button clickable" style="width:65px;">'
    );

    const $baseInput = $('input[value="应用改动"]:first');
    $baseInput.after(
      $checkBtn,
      $overviewBtn,
      $settingsBtn,
      $exportBtn,
      $importBtn,
      $fileBtn
    );

    $checkBtn.click(checkItems);
    $overviewBtn.click(showSelectOverview);
    $settingsBtn.click(showSettings);
    $exportBtn.click(exportSettings);
    $fileBtn.change(importSettings);
  }

  /**
   * 添加行操作按钮
   */
  function addRowOptBtn() {
    const sellIndex = getSellIndex();
    const $trs = $('table.content_table>tbody>tr[class^="row"]');
    if (!$trs.length || $trs.length < 2) {
      return;
    }
    $trs.each(function () {
      const $sellTd = $(this).find(`td:eq(${sellIndex})`);
      const $addBtn = $(
        '<input type="button" name="add" value="加入" style="float: left;" class="button clickable">'
      );
      const $removeBtn = $(
        '<input type="button" name="remove" value="移除" style="float: left;" class="button clickable">'
      );
      $sellTd.prepend($removeBtn).prepend($addBtn);
      $addBtn.click(function () {
        const result = $(this)
          .parents("tr:first")
          .find("td:eq(1)")
          .text()
          .match(/(.+)\((\d+)\/(\d+)\)/);
        if (result) {
          let name = result[1].trim();
          let retainCount = 100;
          if (cleanMap.normal.hasOwnProperty(name)) {
            retainCount = parseInt(
              window.prompt(
                `更新耗材[${name}]的保留数量,0表示不保留`,
                cleanMap.normal[name]
              )
            );
          } else {
            retainCount = parseInt(
              window.prompt(`输入耗材[${name}]的保留数量,0表示不保留`, 50)
            );
          }
          if (isNaN(retainCount)) {
            alert("输入不是一个数字，取消操作");
          } else {
            cleanMap.normal[name] = retainCount;
            saveSettings(cleanMap);
            alert(`已更新耗材[${name}]的保留数量为 ${retainCount}`);
          }
        } else {
          alert("该物品不是耗材");
        }
      });
      $removeBtn.click(function () {
        const result = $(this)
          .parents("tr:first")
          .find("td:eq(1)")
          .text()
          .match(/(.+)\((\d+)\/(\d+)\)/);
        if (result) {
          let name = result[1].trim();
          if (cleanMap.normal.hasOwnProperty(name)) {
            if (confirm(`是否将该物品移出清理清单`)) {
              delete cleanMap.normal[name];
              saveSettings(cleanMap);
              alert(`已移除[${name}]`);
            }
          } else {
            alert("该物品不在清理清单列表中");
          }
        } else {
          alert("该物品不是耗材");
        }
      });
    });
  }

  /**
   * 显示当前已选择对象概览
   */
  function showSelectOverview() {
    let $overviewDiv = $("div#overview");
    if (!$overviewDiv.length) {
      $("body:first").append(
        $('<div style="visibility: hidden;"><div id="overview"></div></div>')
      );
      $overviewDiv = $("div#overview");
    } else {
      $overviewDiv.empty();
    }
    const $trs = $('table.content_table>tbody>tr[class^="row"]');
    if (!$trs.length) {
      alert("没有物品展示");
      return;
    }
    let normalMap = {};
    let medicamentMap = {};
    itemStatistics($trs, normalMap, medicamentMap, true);
    let normalNames = Object.keys(normalMap);
    if (normalNames) {
      $overviewDiv.append(
        `<div><h3 style="text-shadow: 1px 2px 6px black;"> 一般物品 </h3></div>`
      );
      normalNames.forEach((key) => {
        const total = normalMap[key];
        const $row = $(
          `<div><span>${key} </span><span class="rep_bonus bonus_positive">${total}</span></div>`
        );
        $overviewDiv.append($row);
      });
    }
    let medicamentNames = Object.keys(medicamentMap);
    if (medicamentNames) {
      $overviewDiv.append(
        `<div><h3 style="text-shadow: 1px 2px 6px black;"> 魔力药剂 </h3></div>`
      );
      Object.keys(medicamentMap).forEach((key) => {
        const total = medicamentMap[key];
        const $row = $(
          `<div><span>${key} </span><span class="rep_bonus bonus_positive">${total}</span></div>`
        );
        $overviewDiv.append($row);
      });
    }

    $("#overview").dialog({
      autoOpen: true, // 是否自动弹出窗口
      modal: true, // 设置为模态对话框
      resizable: true,
      width: 540, //弹出框宽度
      height: 620, //弹出框高度
      title: "勾选概览", //弹出框标题
      position: { my: "center", at: "center", of: window }, //窗口显示的位置
      buttons: {
        关闭: function () {
          $(this).dialog("close");
        },
      },
    });
  }

  /**
   * 显示设置概览
   */
  function showSettings() {
    let $overviewDiv = $("div#overview");
    if (!$overviewDiv.length) {
      $("body:first").append(
        $('<div style="visibility: hidden;"><div id="overview"></div></div>')
      );
      $overviewDiv = $("div#overview");
    } else {
      $overviewDiv.empty();
    }
    const $trs = $('table.content_table>tbody>tr[class^="row"]');
    if (!$trs.length) {
      alert("没有物品展示");
      return;
    }
    let normalMap = cleanMap.normal;
    let medicamentMap = cleanMap.medicaments;
    let normalNames = Object.keys(normalMap);
    if (normalNames) {
      $overviewDiv.append(
        `<div><h2 style="text-shadow: 1px 2px 6px black;"> 一般物品 </h2></div>`
      );
      normalNames.forEach((key) => {
        let retainCount = normalMap[key];
        const $modifyBtn = $(
          '<input type="button" name="modify" value="变更" class="button clickable">'
        );
        const $delBtn = $(
          '<input type="button" name="del" value="移除" class="button clickable">'
        );
        const $name = $(`<span>${key} </span>`);
        const $count = $(
          `<span class="rep_bonus bonus_positive">${retainCount}</span>`
        );
        const $row = $(`<div style="display: flex;"></div>`);
        const $optDiv = $('<div style="text-align: right; flex: 1;"></div>');
        $optDiv.append($modifyBtn, $delBtn);
        $row.append($name, $count, $optDiv);
        $overviewDiv.append($row);
        $modifyBtn.click(function () {
          retainCount = parseInt(
            window.prompt(`更新耗材[${key}]的保留数量,0表示不保留`, retainCount)
          );
          if (isNaN(retainCount)) {
            alert("输入不是一个数字，取消操作");
            return;
          }
          normalMap[key] = retainCount;
          $count.text(retainCount);
          saveSettings(cleanMap);
          alert(`已更新耗材[${key}]的保留数量为 ${retainCount}`);
        });

        $delBtn.click(function () {
          if (confirm(`是否将该物品移出清理清单`)) {
            $row.remove();
            delete normalMap[key];
            saveSettings(cleanMap);
          }
        });
      });
    }
    let medicamentNames = Object.keys(medicamentMap);
    if (medicamentNames) {
      $overviewDiv.append(
        `<div><h2 style="text-shadow: 1px 2px 6px black;"> 魔力药剂 </h2></div>`
      );
      Object.keys(medicamentMap).forEach((key) => {
        let retainCount = medicamentMap[key];
        const $modifyBtn = $(
          '<input type="button" name="modify" value="数量变更" class="button clickable">'
        );
        const $name = $(`<span>${key} </span>`);
        const $count = $(
          `<span class="rep_bonus bonus_positive">${retainCount}</span>`
        );
        const $row = $(`<div style="display: flex;"></div>`);
        const $optDiv = $('<div style="text-align: right; flex: 1;"></div>');
        $optDiv.append($modifyBtn);
        $row.append($name, $count, $optDiv);
        $overviewDiv.append($row);
        $modifyBtn.click(function () {
          retainCount = parseInt(
            window.prompt(`更新耗材[${key}]的保留数量,0表示不保留`, retainCount)
          );
          if (isNaN(retainCount)) {
            alert("输入不是一个数字，取消操作");
            return;
          }
          medicamentMap[key] = retainCount;
          $count.text(retainCount);
          saveSettings(cleanMap);
          alert(`已更新耗材[${key}]的保留数量为 ${retainCount}`);
        });
      });
    }

    $("#overview").dialog({
      autoOpen: true, // 是否自动弹出窗口
      modal: true, // 设置为模态对话框
      resizable: true,
      width: 540, //弹出框宽度
      height: 620, //弹出框高度
      title: "预设概览", //弹出框标题
      position: { my: "center", at: "center", of: window }, //窗口显示的位置
      buttons: {
        关闭: function () {
          $(this).dialog("close");
        },
      },
    });
  }

  /**
   * 导出设置JSON文件
   */
  function exportSettings() {
    exportFileJSON(cleanMap);
  }

  /**
   * 从JSON文件导入设置
   */
  function importSettings(event) {
    importFileJSON(event)
      .then((res) => {
        console.log("读取到的数据", res);
        // 回显数据
        cleanMap = res;
        saveSettings(cleanMap);
        showSettings();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * 获得出售列在哪一列
   * @returns 出售列索引，从0开始
   */
  function getSellIndex() {
    const $headThs = $("table.content_table thead>tr:last th");
    const $sellTh = $(
      'table.content_table thead>tr:last input[value="出售"]'
    ).parent();
    return $headThs.index($sellTh);
  }

  /**
   * 物品数量统计
   * @param {*} $trs 物品行的jquery数组对象
   * @param {*} normalMap 容纳一般物品统计数量的对象
   * @param {*} medicamentMap 容纳药剂统计数量的对象
   * @param {*} onlyChecked 为true时仅统计已勾选的行
   */
  function itemStatistics($trs, normalMap, medicamentMap, onlyChecked) {
    const sellIndex = getSellIndex();
    $trs.each(function () {
      const result = $(this)
        .find("td:eq(1)")
        .text()
        .match(/(.+)\((\d+)\/(\d+)\)/);
      if (result) {
        const checked = $(this)
          .find(`td:eq(${sellIndex}) input:checkbox`)
          .prop("checked");
        if (onlyChecked && !checked) return;
        let name = result[1].trim();
        const unit = parseInt(result[2]);
        if (name.endsWith("酊剂") || name.endsWith("煎剂")) {
          const poResult = name.match(/(.+)的(.+)[酊煎]剂/);
          const herbName = poResult[2];
          let total = medicamentMap[herbName] || 0;
          medicamentMap[herbName] = total + unit;
        } else {
          let total = normalMap[name] || 0;
          normalMap[name] = total + unit;
        }
      }
    });
  }

  function checkItems() {
    const sellIndex = getSellIndex();
    let normalConsumables = cleanMap.normal;
    let medicaments = cleanMap.medicaments;
    const $trs = $('table.content_table>tbody>tr[class^="row"]');
    if (!$trs.length) {
      alert("没有物品需要清理");
      return;
    }
    let selectedMap = {};
    let normalMap = {};
    let medicamentMap = {};
    itemStatistics($trs, normalMap, medicamentMap, false);

    $trs.each(function () {
      const result = $(this)
        .find("td:eq(1)")
        .text()
        .match(/(.+)\((\d+)\/(\d+)\)/);
      if (result) {
        let name = result[1].trim();
        const unit = parseInt(result[2]);
        let total = 0;
        let selected = 0;
        let min = 0;
        if (name.endsWith("酊剂") || name.endsWith("煎剂")) {
          const poResult = name.match(/(.+)的(.+)[酊煎]剂/);
          name = poResult[2];
          total = medicamentMap[name] || 0;
          selected = selectedMap[name] || 0;
          min = medicaments[name];
        } else {
          total = normalMap[name] || 0;
          selected = selectedMap[name] || 0;
          min = normalConsumables[name];
        }
        if (total - (selected + unit) > min) {
          // 当前可以选择
          $(this)
            .find(`td:eq(${sellIndex}) input:checkbox`)
            .prop("checked", true);
          selectedMap[name] = selected + unit;
        } else {
          return;
        }
      }
    });
    alert("勾选完毕");
  }

  // 导出数据 --------------------------------------- Start
  /**
   * 导出JSON文件的方法，导出并直接进行下载
   *
   * @param {Object|JSONString} 传入导出json文件的数据, 格式为json对象或者json字符串
   * @param {String}  导出json文件的文件名称
   */
  const exportFileJSON = (data = {}, filename = "cleanWarehouse.json") => {
    if (typeof data === "object") {
      data = JSON.stringify(data, null, 4);
    }
    // 导出数据
    const blob = new Blob([data], { type: "text/json" });
    const e = new MouseEvent("click");
    const a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    a.dispatchEvent(e);
  };

  const importFileJSON = (ev) => {
    return new Promise((resolve, reject) => {
      const fileDom = ev.target,
        file = fileDom.files[0];

      // 格式判断
      if (file.type !== "application/json") {
        reject("仅允许上传json文件");
      }
      // 检验是否支持FileRender
      if (typeof FileReader === "undefined") {
        reject("当前浏览器不支持FileReader");
      }

      // 执行后清空input的值，防止下次选择同一个文件不会触发onchange事件
      ev.target.value = "";

      // 执行读取json数据操作
      const reader = new FileReader();
      reader.readAsText(file); // 读取的结果还有其他读取方式，我认为text最为方便

      reader.onerror = (err) => {
        reject("json文件解析失败", err);
      };

      reader.onload = () => {
        const resultData = reader.result;
        if (resultData) {
          try {
            const importData = JSON.parse(resultData);
            resolve(importData);
          } catch (error) {
            reject("读取数据解析失败", error);
          }
        } else {
          reject("读取数据解析失败", error);
        }
      };
    });
  };
})();
