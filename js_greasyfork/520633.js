// ==UserScript==
// @name            WoD 物品标记
// @icon            http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace       WOD_Tools
// @description     阿沐的物品标记，被标记的物品很大概率会被处理给钱袋
// @author          Christophero
// @include         http*://*.world-of-dungeons.org/wod/spiel/hero/items.php?*
// @license         MIT License
// @require         https://code.jquery.com/jquery-3.3.1.min.js
// @require         https://cdn.jsdelivr.net/npm/slim-select@2.4.5/dist/slimselect.umd.min.js
// @resource slimselect_css    https://cdn.jsdelivr.net/npm/slim-select@2.4.5/dist/slimselect.min.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @connect         www.christophero.xyz
// @modifier        Christophero
// @version         2023.04.16.2
// @downloadURL https://update.greasyfork.org/scripts/520633/WoD%20%E7%89%A9%E5%93%81%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520633/WoD%20%E7%89%A9%E5%93%81%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  const MARK_ITEM_OPTION_KEY = "MARK_ITEM_OPTION_KEY";

  initComponent();

  function saveOption(option) {
    return localStorage.setItem(MARK_ITEM_OPTION_KEY, JSON.stringify(option));
  }

  function loadOption() {
    let localMarkItemOption = {};
    const localMarkItemOptionText = localStorage.getItem(MARK_ITEM_OPTION_KEY);
    if (!localMarkItemOptionText) {
      localMarkItemOption = {
        blue: {
          color: "#3498DB",
          label: "蓝色",
          items: [],
        },
        green: {
          color: "#28B463",
          label: "绿色",
          items: [],
        },
        red: {
          color: "#E74C3C",
          label: "红色",
          items: [],
        },
        orange: {
          color: "#D35400",
          label: "橙色",
          items: [],
        },
      };
    } else {
      localMarkItemOption = JSON.parse(localMarkItemOptionText);
    }
    return localMarkItemOption;
  }

  /**
   * 导出文件的方法，导出并直接进行下载
   *
   * @param {String} 传入导出文件的数据, 格式为字符串
   * @param {String}  导出文件的文件名称
   */
  const exportFile = (
    text = "",
    filename = "分析内容.txt",
    exportCsv = false
  ) => {
    let blob;
    // 导出数据
    if (exportCsv) {
      blob = new Blob(["\ufeff" + text], {
        type: "text/csv;charset=utf-8;",
      });
    } else {
      blob = new Blob([text]);
    }
    const e = new MouseEvent("click");
    const a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dispatchEvent(e);
  };

  function exportOption() {
    exportFile(JSON.stringify(loadOption()), "物品标记.json");
  }

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

  function importOption(event) {
    importFileJSON(event)
      .then((option) => {
        console.log("读取到的数据", option);
        saveOption(option);
        alert("导入物品标记数据成功，刷新页面");
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //
  function initComponent() {
    GM_addStyle(GM_getResourceText("slimselect_css"));
    GM_addStyle(
      ".ss-main.mark-select {display: inline-flex !important; width: 120px;}"
    );

    const itemSelectMap = {};
    let localMarkItemOption = loadOption();
    let markItemMap = {};
    const markData = [{ html: "<b>无标记</b>", text: "无标记", value: "" }];
    for (let key of Object.keys(localMarkItemOption)) {
      let colorOption = localMarkItemOption[key];
      markData.push({
        html: `<b style="color: ${colorOption.color}">${colorOption.label}</b>`,
        text: colorOption.label,
        value: key,
      });
      colorOption.items.forEach((itemName) => {
        markItemMap[itemName] = key;
      });
    }
    $(".layout_clear .content_table a[href*='item_instance_id']").each(
      function (i, e) {
        const params = $(e).attr("href").split("?")[1];
        const instanceId = new URLSearchParams(params).get("item_instance_id");
        // 道具名称
        const itemName = e.text.replace(/!$/, "");
        const $td = $("<td></td>");
        const $checkbox = $(`<input type="checkbox" class="check-to-mark">`)
          .data("instanceid", instanceId)
          .data("itemname", itemName);
        const $select = $(`<select class="mark-select"></select>`);

        $td.append($select, $checkbox);
        $(e).parents("tr:first").append($td);
        const copyMarkData = JSON.parse(JSON.stringify(markData));
        for (let opt of copyMarkData) {
          if (opt.value === markItemMap[itemName]) {
            opt.selected = true;
          }
        }
        const slimSelect = new SlimSelect({
          select: $select[0],
          value: markItemMap[itemName],
          data: copyMarkData,
          settings: {
            showSearch: false,
          },
          events: {
            beforeChange: ([{ value: newVal }], [{ value: oldVal }]) => {
              console.log(oldVal);
              console.log(newVal);
              // 有值切换到无值，则删除存储数据
              if (oldVal) {
                const originColor = markItemMap[itemName];
                const items = localMarkItemOption[originColor].items;
                items.splice(
                  items.findIndex((item) => item === itemName),
                  1
                );
                delete markItemMap[itemName];
                saveOption(localMarkItemOption);
              }
              if (newVal) {
                if (!localMarkItemOption[newVal].items.includes(itemName)) {
                  localMarkItemOption[newVal].items.push(itemName);
                }
                markItemMap[itemName] = newVal;
              }
              saveOption(localMarkItemOption);
              // return false; // this will stop the change from happening
            },
          },
        });
        itemSelectMap[instanceId] = slimSelect;
      }
    );

    // 添加导入导出与标记物品勾选
    const $itemMarkSelect = $('<select class="mark-select"></select>');
    const $exportBtn = $(
      '<input type="button" name="export" value="导出" class="button clickable">'
    ).click(exportOption);
    const $fileBtn = $(
      '<input type="file" id="cleanFile" name="cleanFile" runat="server"  style="position:relative; z-index:10; filter:alpha(opacity=0);-moz-opacity:0; opacity:0; width: 65px; left:-65px;">'
    ).change(importOption);
    const $importBtn = $(
      '<input type="button" name="button" value="导入" class="button clickable" style="width:65px;">'
    );
    const $pageRow = $(".layout_clear .content_table .paginator_row.top");
    const $label = $("<span>&nbsp;&nbsp;&nbsp;物品标记：</span>");
    $pageRow.append($label, $itemMarkSelect, $exportBtn, $importBtn, $fileBtn);

    const itemMarkSelect = new SlimSelect({
      select: $itemMarkSelect[0],
      data: markData,
      settings: {
        showSearch: false,
      },
      events: {
        afterChange: ([{ value: newVal }]) => {
          let needCheckedItems = localMarkItemOption[newVal];
          if (!needCheckedItems) return;
          needCheckedItems = needCheckedItems.items;
          $(".layout_clear .content_table a[href*='item_instance_id']").each(
            (i, e) => {
              const itemName = e.text.replace(/!$/, "");
              $(e)
                .parents("tr:first")
                .find('input[name^="doEquipItem["]')
                .prop("checked", needCheckedItems.includes(itemName));
            }
          );
        },
      },
    });

    // 添加标记列
    const $markTableHeader = $("<th></th>");
    const $markAllChk = $("<input type='checkbox' class='mark-all'>");
    const $batchSelect = $('<select class="mark-select"></select>');
    $(".layout_clear .content_table thead tr.header").append(
      $markTableHeader.append($batchSelect, $markAllChk)
    );
    $markAllChk.change(function () {
      if ($(this).is(":checked")) {
        $("input.check-to-mark").prop("checked", true);
      } else {
        $("input.check-to-mark").prop("checked", false);
      }
    });
    const batchSelect = new SlimSelect({
      select: $batchSelect[0],
      data: markData,
      settings: {
        showSearch: false,
      },
      events: {
        beforeChange: ([{ value: newVal }], [{ value: oldVal }]) => {
          $("input.check-to-mark:checked").each((i, e) => {
            const instanceId = $(e).data("instanceid");
            const itemName = $(e).data("itemname");
            select = itemSelectMap[instanceId];
            const preVal = select.getSelected()[0];
            select.setSelected(newVal);
            // 有值切换到无值，则删除存储数据
            if (preVal) {
              const originColor = markItemMap[itemName];
              const items = localMarkItemOption[originColor].items;
              items.splice(
                items.findIndex((item) => item === itemName),
                1
              );
              delete markItemMap[itemName];
            }
            if (newVal) {
              if (!localMarkItemOption[newVal].items.includes(itemName)) {
                localMarkItemOption[newVal].items.push(itemName);
              }
              markItemMap[itemName] = newVal;
            }
          });
          // 有值切换到无值，则删除存储数据
          saveOption(localMarkItemOption);
          // return false; // this will stop the change from happening
        },
        // afterChange: ([{ value: newVal }]) => {
        //   $("input.check-to-mark:checked").each((i, e) => {
        //     const instanceId = $(e).data("instanceid");
        //     select = itemSelectMap[instanceId];
        //     select.setSelected(newVal);
        //   });
        // },
      },
    });
  }
})();
