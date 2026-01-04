// ==UserScript==
// @name         csres.com
// @version      0.1.20230203.7
// @author       tcatche
// @description  check update
// @match			   *://www.csres.com/*
// @match			   *://csres.com/*
// @require      https://unpkg.com/vue@3.2.47/dist/vue.global.js
// @namespace https://greasyfork.org/users/290273
// @downloadURL https://update.greasyfork.org/scripts/458013/csrescom.user.js
// @updateURL https://update.greasyfork.org/scripts/458013/csrescom.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __vite_style__ = document.createElement("style");
__vite_style__.innerHTML = "\n.actions[data-v-15629706] {\r\n  float: right;\r\n  margin-bottom: 4px;\r\n  position: relative;\r\n  padding-bottom: 16px;\n}\n.page[data-v-15629706] {\r\n  font-size: 14px;\n}\n[data-v-15629706] .el-input {\r\n  margin: 0 5px;\r\n  width: 60px;\n}\n[data-v-15629706] .el-input-number {\r\n  margin: 0 5px;\r\n  width: 120px;\n}\n[data-v-15629706] .el-progress__text {\r\n  display: none;\n}\n.el-progress[data-v-15629706] {\r\n  width: 100%;\r\n  display: inline-block;\r\n  position: absolute;\r\n  bottom: 8px;\n}\r\n\n.uploader-wrapper[data-v-44fc689e] {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: flex-end;\r\n  margin-top: 20px;\n}\n[data-v-44fc689e] .el-upload {\r\n  width: 600px;\r\n  margin-top: 30px;\n}\r\n\n.table-wrapper {\r\n  margin-bottom: 30px;\n}\ntable {\r\n  font-size: 12px;\n}\n.warning-row {\r\n  background-color: var(--el-color-warning-light-7) !important;\n}\r\n\n.wrapper[data-v-7ba5bd90] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  display: none;\n  z-index: 10000;\n}\n.wrapper-inner[data-v-7ba5bd90] {\n  height: 100%;\n  overflow-y: auto;\n  padding: 30px;\n  width: 100%;\n}\n.wrapper-inner > div[data-v-7ba5bd90] {\n  /* padding: 0 30px; */\n}\n.show[data-v-7ba5bd90] {\n  display: flex;\n}\n.open-button[data-v-7ba5bd90] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  background: red;\n  color: #fff;\n  width: 40px;\n  /* height: 30px; */\n  padding: 10px;\n  z-index: 9999;\n}\n.close-button[data-v-7ba5bd90] {\n  position: fixed;\n  top: 0;\n  right: 0;\n  width: 40px;\n  color: var(--el-color-primary);\n  /* height: 30px; */\n  padding: 10px;\n}\n";
document.head.appendChild(__vite_style__);
(function() {
  "use strict";
  function getStatus(id) {
    let encodeId = id.replace(/\//g, "%2F").replace(/ /g, "+");
    const url = `http://www.csres.com/s.jsp?keyword=${encodeId}&submit12=%B1%EA%D7%BC%CB%D1%CB%F7&xx=on&wss=on&zf=on&fz=on&pageSize=25&pageNum=1&SortIndex=1&WayIndex=0&nowUrl=`;
    return fetch(url, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "max-age=0",
        "upgrade-insecure-requests": "1"
      },
      "referrer": url,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    }).then((res) => res.arrayBuffer()).then((res) => new TextDecoder("gbk").decode(res)).then((text) => {
      const div2 = document.createElement("div");
      div2.style.display = "none";
      const bodyStart = text.indexOf("<body");
      const bodyEnd = text.indexOf("</body>") + 7;
      const bodyText = text.substring(bodyStart, bodyEnd + 7);
      div2.insertAdjacentHTML("beforeend", bodyText);
      document.body.insertAdjacentHTML("beforeend", bodyText);
      const resultEle = div2.querySelector(".heng tr:nth-child(2) td:last-child");
      let result;
      if (resultEle) {
        result = resultEle.textContent.trim();
      }
      div2.remove();
      return {
        status: 1,
        result
      };
    }).catch((err) => {
      console.log(err);
      return {
        status: 0,
        result: id
      };
    });
  }
  var Actions_vue_vue_type_style_index_0_scoped_true_lang = "";
  var _export_sfc$1 = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$e = { class: "actions" };
  const _hoisted_2$b = { class: "page" };
  const _hoisted_3$5 = /* @__PURE__ */ Vue.createTextVNode(" \u4ECE\u7B2C");
  const _hoisted_4$2 = /* @__PURE__ */ Vue.createTextVNode("\u6761\u5F00\u59CB\uFF0C\u68C0\u67E5");
  const _hoisted_5$2 = /* @__PURE__ */ Vue.createTextVNode("\u6761\u6570\u636E ");
  const _hoisted_6 = /* @__PURE__ */ Vue.createTextVNode(" \u68C0\u67E5\u66F4\u65B0 ");
  const _hoisted_7 = { key: 0 };
  const _hoisted_8 = /* @__PURE__ */ Vue.createTextVNode(" \u4E0B\u8F7D\u66F4\u65B0\u540E\u7684\u6587\u6863 ");
  const _sfc_main$t = {
    props: {
      data: Object,
      onSuccessChecked: Function,
      onExportFile: Function
    },
    setup(__props) {
      const props = __props;
      const percentage = Vue.ref(0);
      const percentageText = Vue.ref("");
      const isFetching = Vue.ref(false);
      const start = Vue.ref(1);
      const size2 = Vue.ref(200);
      const checkItemStatus = (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            getStatus(id).then((res) => resolve(res)).catch(() => resolve({
              status: 0,
              result: id
            }));
          }, 500);
        });
      };
      const checkUpdate = async () => {
        if (isFetching.value) {
          return;
        }
        isFetching.value = true;
        const results = {};
        const fails = [];
        const checkItems = props.data.filter((_2, index) => index + 1 >= start.value && index + 1 < start.value + size2.value);
        console.log(checkItems.map((item) => item["\u6807\u51C6\u4EE3\u53F7"]).join(","));
        let current = 0;
        percentageText.value = "";
        for (const item of checkItems) {
          current += 1;
          console.log("%c \u{1F680}  [current] -> ", "font-size:13px; background:#42b883; color:#fff;", current);
          if (item["\u5907\u6CE8"] || (item["\u6807\u51C6\u4EE3\u53F7"] || "").trim().length < 3) {
            continue;
          }
          const { status, result } = await checkItemStatus(item["\u6807\u51C6\u4EE3\u53F7"]);
          if (status) {
            if (result !== item["\u5907\u6CE8"] && result !== "\u73B0\u884C") {
              results[item.index] = result;
            }
          } else {
            fails.push(result);
          }
          percentage.value = Math.ceil(current * 100 / checkItems.length);
          percentageText.value = `${current}/${checkItems.length}`;
        }
        if (props.onSuccessChecked) {
          props.onSuccessChecked(results, fails);
        }
        isFetching.value = false;
      };
      return (_ctx, _cache) => {
        const _component_el_progress = Vue.resolveComponent("el-progress");
        const _component_el_input = Vue.resolveComponent("el-input");
        const _component_el_button = Vue.resolveComponent("el-button");
        return Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1$e, [
          isFetching.value ? (Vue.openBlock(), Vue.createBlock(_component_el_progress, {
            key: 0,
            "text-inside": false,
            "stroke-width": 4,
            percentage: percentage.value
          }, null, 8, ["percentage"])) : Vue.createCommentVNode("v-if", true),
          Vue.createElementVNode("span", _hoisted_2$b, [
            _hoisted_3$5,
            Vue.createVNode(_component_el_input, {
              modelValue: start.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => start.value = $event),
              minlength: 1,
              maxlength: 4,
              onInput: _cache[1] || (_cache[1] = () => start.value = parseInt(start.value.replace(/[^0-9]/g, "")))
            }, null, 8, ["modelValue"]),
            _hoisted_4$2,
            Vue.createVNode(_component_el_input, {
              modelValue: size2.value,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => size2.value = $event),
              minlength: 1,
              maxlength: 4,
              onInput: _cache[3] || (_cache[3] = () => size2.value = parseInt(size2.value.replace(/[^0-9]/g, "")))
            }, null, 8, ["modelValue"]),
            _hoisted_5$2
          ]),
          Vue.createVNode(_component_el_button, {
            type: "primary",
            primary: "",
            onClick: checkUpdate
          }, {
            default: Vue.withCtx(() => [
              _hoisted_6,
              percentageText.value ? (Vue.openBlock(), Vue.createElementBlock("span", _hoisted_7, ", \u8FDB\u5EA6" + Vue.toDisplayString(percentageText.value), 1)) : Vue.createCommentVNode("v-if", true)
            ]),
            _: 1
          }),
          Vue.createVNode(_component_el_button, {
            type: "primary",
            primary: "",
            onClick: props.onExportFile
          }, {
            default: Vue.withCtx(() => [
              _hoisted_8
            ]),
            _: 1
          }, 8, ["onClick"])
        ]);
      };
    }
  };
  var Actions = /* @__PURE__ */ _export_sfc$1(_sfc_main$t, [["__scopeId", "data-v-15629706"]]);
  var Upload_vue_vue_type_style_index_0_scoped_true_lang = "";
  const _sfc_main$s = {
    props: {
      onSuccess: Function
    },
    data() {
      return {
        loading: false,
        excelData: {
          header: null,
          results: null
        },
        fileList: [],
        uploader: null
      };
    },
    methods: {
      handleChangeFile(file) {
        console.log("%c \u{1F680}  [file] -> ", "font-size:13px; background:#42b883; color:#fff;", file);
        this.readerData(file.raw);
      },
      handleExceed(files) {
        console.log(this.$refs);
        this.$refs.uploader.clearFiles();
        const file = files[0];
        this.$refs.uploader.handleStart(file);
      },
      generateData({ header, results }) {
        this.excelData.header = header;
        this.excelData.results = results;
        this.onSuccess && this.onSuccess(this.excelData);
      },
      readerData(rawFile) {
        this.loading = true;
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const header = [];
            const results = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            this.generateData({ header, results });
            this.loading = false;
            resolve();
          };
          reader.readAsArrayBuffer(rawFile);
        });
      },
      getHeaderRow(sheet) {
        const headers = [];
        const range = XLSX.utils.decode_range(sheet["!ref"]);
        let C2;
        const R2 = range.s.r;
        for (C2 = range.s.c; C2 <= range.e.c; ++C2) {
          const cell = sheet[XLSX.utils.encode_cell({ c: C2, r: R2 })];
          let hdr = "UNKNOWN " + C2;
          if (cell && cell.t)
            hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
        return headers;
      },
      isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name);
      }
    }
  };
  const _withScopeId = (n) => (Vue.pushScopeId("data-v-44fc689e"), n = n(), Vue.popScopeId(), n);
  const _hoisted_1$d = { class: "uploader-wrapper" };
  const _hoisted_2$a = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("div", { class: "el-upload__text" }, [
    /* @__PURE__ */ Vue.createTextVNode(" \u62D6\u52A8\u89C4\u8303\u6587\u4EF6\u5230\u8FD9\u91CC\u6216 "),
    /* @__PURE__ */ Vue.createElementVNode("em", null, "\u70B9\u51FB\u9009\u62E9\u6587\u4EF6")
  ], -1));
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_upload = Vue.resolveComponent("el-upload");
    return Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1$d, [
      Vue.createVNode(_component_el_upload, {
        drag: "",
        ref: "uploader",
        class: "upload-demo",
        accept: ".xls, .xlsx",
        limit: 1,
        "file-list": $data.fileList,
        "onUpdate:file-list": _cache[0] || (_cache[0] = ($event) => $data.fileList = $event),
        "on-change": $options.handleChangeFile,
        "on-exceed": $options.handleExceed,
        "auto-upload": false
      }, {
        default: Vue.withCtx(() => [
          _hoisted_2$a
        ]),
        _: 1
      }, 8, ["file-list", "on-change", "on-exceed"])
    ]);
  }
  var Uploader = /* @__PURE__ */ _export_sfc$1(_sfc_main$s, [["render", _sfc_render$3], ["__scopeId", "data-v-44fc689e"]]);
  var Table_vue_vue_type_style_index_0_lang = "";
  const _hoisted_1$c = { class: "table-wrapper" };
  const _sfc_main$r = {
    props: {
      tableData: Object
    },
    setup(__props) {
      const props = __props;
      const tableRowClassName = ({
        row,
        rowIndex
      }) => {
        return row.changed ? "warning-row" : "";
      };
      const columns = [
        "\u5E8F\u53F7",
        "\u6807\u51C6\u4EE3\u53F7",
        "\u6807\u51C6\u540D\u79F0",
        "\u53D7\u63A7\u7F16\u53F7",
        "\u53D1\u5E03\u65E5\u671F",
        "\u5B9E\u65BD\u65E5\u671F",
        "\u5907\u6CE8"
      ];
      const width = [60, 160, 0, 160, 120, 120, 60];
      return (_ctx, _cache) => {
        const _component_el_table_column = Vue.resolveComponent("el-table-column");
        const _component_el_table = Vue.resolveComponent("el-table");
        return Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1$c, [
          Vue.createVNode(_component_el_table, {
            data: props.tableData.data,
            style: { "width": "100%" },
            border: "",
            "row-class-name": tableRowClassName
          }, {
            default: Vue.withCtx(() => [
              (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, null, Vue.renderList(columns, (column, idx) => {
                return Vue.createVNode(_component_el_table_column, {
                  key: column,
                  prop: column,
                  label: column,
                  width: width[idx]
                }, null, 8, ["prop", "label", "width"]);
              }), 64))
            ]),
            _: 1
          }, 8, ["data"])
        ]);
      };
    }
  };
  var App_vue_vue_type_style_index_0_scoped_true_lang = "";
  const _hoisted_1$b = { class: "app-inner" };
  const _hoisted_2$9 = { class: "wrapper-inner" };
  const _sfc_main$q = {
    setup(__props) {
      const tableData = Vue.reactive({
        columns: [],
        data: []
      });
      const success = Vue.ref("");
      const error = Vue.ref("");
      const visible = Vue.ref(false);
      const handleUploadSuccess = (data) => {
        tableData.columns = data.header;
        data.results.forEach((item, index) => item.index = index);
        tableData.data = data.results;
        console.log("%c \u{1F680}  [tableData] -> ", "font-size:13px; background:#42b883; color:#fff;", tableData);
      };
      const handleSuccessChecked = (changedData, fails) => {
        console.log("%c \u{1F680}  [changedData] -> ", "font-size:13px; background:#42b883; color:#fff;", changedData);
        let changedCount = 0;
        Object.keys(changedData).forEach((idx) => {
          console.log("%c \u{1F680}  [idx] -> ", "font-size:13px; background:#42b883; color:#fff;", idx);
          tableData.data[idx]["\u5907\u6CE8"] = changedData[idx];
          tableData.data[idx].changed = 1;
          changedCount++;
        });
        success.value = `\u68C0\u67E5\u66F4\u65B0\u5B8C\u6210\uFF0C\u5171\u6709${changedCount}\u6761\u6570\u636E\u6539\u53D8\uFF0C\u66F4\u65B0\u7684\u6570\u636E\u662F\u9EC4\u8272\u80CC\u666F`;
        if (fails && fails.length > 0) {
          const filesText = fails.map((text) => `\u3010${text}\u3011`).join("\u3001");
          error.value = `\u4EE5\u4E0B${fails.length}\u6761\u6570\u636E\u68C0\u67E5\u66F4\u65B0\u5931\u8D25: ${filesText}`;
        }
      };
      const handleExportFile = () => {
        const data = tableData.data.map((item) => __spreadValues({}, item));
        data.forEach((item) => {
          delete item.changed;
          delete item.index;
        });
        const ws = XLSX.utils.json_to_sheet(data);
        ws["!cols"] = [
          { wch: 6 },
          { wch: 20 },
          { wch: 35 },
          { wch: 20 },
          { wch: 12 },
          { wch: 12 },
          { wch: 8 }
        ];
        ws["!rows"] = [{ hpx: 25 }];
        data.forEach(() => {
          ws["!rows"].push({ hpx: 25 });
        });
        for (const key in ws) {
          if (key.startsWith("!")) {
            continue;
          }
          console.log("%c \u{1F680}  [key] -> ", "font-size:13px; background:#42b883; color:#fff;", key);
          ws[key].s = {
            border: {
              bottom: {
                style: "thin",
                color: "000000"
              },
              left: {
                style: "thin",
                color: "000000"
              },
              right: {
                style: "thin",
                color: "000000"
              },
              top: {
                style: "thin",
                color: "000000"
              }
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: 1,
              indent: 0
            }
          };
          if (key.replace(/[A-Z]/ig, "") === "1") {
            console.log("%c \u{1F680}  [keykeykeykeykey] -> ", "font-size:13px; background:#42b883; color:#fff;", key);
            ws[key].s = __spreadProps(__spreadValues({}, ws[key].s), {
              fill: {
                fgColor: { rgb: "EBF1DE" }
              }
            });
          }
        }
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "\u89C4\u8303.xlsx");
      };
      return (_ctx, _cache) => {
        const _component_el_alert = Vue.resolveComponent("el-alert");
        return Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1$b, [
          Vue.createElementVNode("div", {
            class: "open-button",
            onClick: _cache[0] || (_cache[0] = ($event) => visible.value = true)
          }, "\u67E5\u8BE2"),
          Vue.createElementVNode("div", {
            class: Vue.normalizeClass(["wrapper", { show: visible.value }])
          }, [
            Vue.createElementVNode("div", _hoisted_2$9, [
              Vue.createVNode(Uploader, { onSuccess: handleUploadSuccess }),
              Vue.createVNode(Actions, {
                data: Vue.unref(tableData).data,
                onSuccessChecked: handleSuccessChecked,
                onExportFile: handleExportFile
              }, null, 8, ["data"]),
              success.value ? (Vue.openBlock(), Vue.createBlock(_component_el_alert, {
                key: 0,
                title: success.value,
                type: "success"
              }, null, 8, ["title"])) : Vue.createCommentVNode("v-if", true),
              error.value ? (Vue.openBlock(), Vue.createBlock(_component_el_alert, {
                key: 1,
                title: error.value,
                type: "error"
              }, null, 8, ["title"])) : Vue.createCommentVNode("v-if", true),
              Vue.createVNode(_sfc_main$r, { tableData: Vue.unref(tableData) }, null, 8, ["tableData"])
            ]),
            Vue.createElementVNode("div", {
              class: "close-button",
              onClick: _cache[1] || (_cache[1] = ($event) => visible.value = false)
            }, "\u5173\u95ED")
          ], 2)
        ]);
      };
    }
  };
  var App = /* @__PURE__ */ _export_sfc$1(_sfc_main$q, [["__scopeId", "data-v-7ba5bd90"]]);
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  var root$1 = root;
  var Symbol$1 = root$1.Symbol;
  var Symbol$2 = Symbol$1;
  var objectProto$e = Object.prototype;
  var hasOwnProperty$c = objectProto$e.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$e.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$c.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var objectProto$d = Object.prototype;
  var nativeObjectToString = objectProto$d.toString;
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString$1(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var symbolTag$1 = "[object Symbol]";
  function isSymbol$1(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
  }
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  var isArray$1 = Array.isArray;
  var isArray$2 = isArray$1;
  var INFINITY$1 = 1 / 0;
  var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray$2(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol$1(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
  }
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  function isObject$1(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol$1(value)) {
      return NAN;
    }
    if (isObject$1(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$1(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  function identity$1(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction$2(value) {
    if (!isObject$1(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var coreJsData = root$1["__core-js_shared__"];
  var coreJsData$1 = coreJsData;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var funcProto$2 = Function.prototype;
  var funcToString$2 = funcProto$2.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto$1 = Function.prototype, objectProto$c = Object.prototype;
  var funcToString$1 = funcProto$1.toString;
  var hasOwnProperty$b = objectProto$c.hasOwnProperty;
  var reIsNative = RegExp("^" + funcToString$1.call(hasOwnProperty$b).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  function baseIsNative(value) {
    if (!isObject$1(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var WeakMap$1 = getNative(root$1, "WeakMap");
  var WeakMap$2 = WeakMap$1;
  var objectCreate = Object.create;
  var baseCreate = function() {
    function object() {
    }
    return function(proto) {
      if (!isObject$1(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();
  var baseCreate$1 = baseCreate;
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  function constant(value) {
    return function() {
      return value;
    };
  }
  var defineProperty = function() {
    try {
      var func = getNative(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  }();
  var defineProperty$1 = defineProperty;
  var baseSetToString = !defineProperty$1 ? identity$1 : function(func, string) {
    return defineProperty$1(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string),
      "writable": true
    });
  };
  var baseSetToString$1 = baseSetToString;
  var setToString = shortOut(baseSetToString$1);
  var setToString$1 = setToString;
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty$1) {
      defineProperty$1(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var objectProto$b = Object.prototype;
  var hasOwnProperty$a = objectProto$b.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$a.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }
  var nativeMax$1 = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax$1(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax$1(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  function baseRest(func, start) {
    return setToString$1(overRest(func, start, identity$1), func + "");
  }
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction$2(value);
  }
  function isIterateeCall(value, index, object) {
    if (!isObject$1(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
      return eq(object[index], value);
    }
    return false;
  }
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  var objectProto$a = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$a;
    return value === proto;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  var argsTag$2 = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$2;
  }
  var objectProto$9 = Object.prototype;
  var hasOwnProperty$9 = objectProto$9.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
  var isArguments = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$9.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };
  var isArguments$1 = isArguments;
  function stubFalse() {
    return false;
  }
  var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
  var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;
  var isBuffer$1 = isBuffer;
  var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", objectTag$3 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", weakMapTag$1 = "[object WeakMap]";
  var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag] = typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  var freeProcess = moduleExports$1 && freeGlobal$1.process;
  var nodeUtil = function() {
    try {
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeUtil$1 = nodeUtil;
  var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  var isTypedArray$1 = isTypedArray;
  var objectProto$8 = Object.prototype;
  var hasOwnProperty$8 = objectProto$8.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray$2(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$8.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var nativeKeys = overArg(Object.keys, Object);
  var nativeKeys$1 = nativeKeys;
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$7 = objectProto$7.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys$1(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$7.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  var objectProto$6 = Object.prototype;
  var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject$1(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty$6.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray$2(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol$1(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  var nativeCreate = getNative(Object, "create");
  var nativeCreate$1 = nativeCreate;
  function hashClear() {
    this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? void 0 : result;
    }
    return hasOwnProperty$5.call(data, key) ? data[key] : void 0;
  }
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$4.call(data, key);
  }
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED$1 : value;
    return this;
  }
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  var Map$1 = getNative(root$1, "Map");
  var Map$2 = Map$1;
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$2 || ListCache)(),
      "string": new Hash()
    };
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function getMapData(map2, key) {
    var data = map2.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size2 = data.size;
    data.set(key, value);
    this.size += data.size == size2 ? 0 : 1;
    return this;
  }
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result.cache;
    return result;
  }
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  var stringToPath$1 = stringToPath;
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function castPath(value, object) {
    if (isArray$2(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath$1(toString(value));
  }
  var INFINITY = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol$1(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function get$2(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  var spreadableSymbol = Symbol$2 ? Symbol$2.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray$2(value) || isArguments$1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }
  function flatRest(func) {
    return setToString$1(overRest(func, void 0, flatten), func + "");
  }
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  var getPrototype$1 = getPrototype;
  var objectTag$2 = "[object Object]";
  var funcProto = Function.prototype, objectProto$3 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject$1(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag$2) {
      return false;
    }
    var proto = getPrototype$1(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$3.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function stubArray() {
    return [];
  }
  var objectProto$2 = Object.prototype;
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  var getSymbols$1 = getSymbols;
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray$2(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols$1);
  }
  var DataView = getNative(root$1, "DataView");
  var DataView$1 = DataView;
  var Promise$1 = getNative(root$1, "Promise");
  var Promise$2 = Promise$1;
  var Set$1 = getNative(root$1, "Set");
  var Set$2 = Set$1;
  var mapTag$1 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$1 = "[object Set]", weakMapTag = "[object WeakMap]";
  var dataViewTag$1 = "[object DataView]";
  var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$2);
  var getTag = baseGetTag;
  if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$1 || Map$2 && getTag(new Map$2()) != mapTag$1 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$1 || WeakMap$2 && getTag(new WeakMap$2()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$1;
          case mapCtorString:
            return mapTag$1;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$1;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  var getTag$1 = getTag;
  var Uint8Array2 = root$1.Uint8Array;
  var Uint8Array$1 = Uint8Array2;
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate$1(getPrototype$1(object)) : {};
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack2) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack2.get(array);
    var othStacked = stack2.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
    stack2.set(array, other);
    stack2.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack2) : customizer(arrValue, othValue, index, array, other, stack2);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack2))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack2))) {
        result = false;
        break;
      }
    }
    stack2["delete"](array);
    stack2["delete"](other);
    return result;
  }
  function mapToArray(map2) {
    var index = -1, result = Array(map2.size);
    map2.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
  var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
  var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack2) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack2.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$2;
        stack2.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack2);
        stack2["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  var COMPARE_PARTIAL_FLAG$3 = 1;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$2 = objectProto$1.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack2) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$2.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack2.get(object);
    var othStacked = stack2.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack2.set(object, other);
    stack2.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack2) : customizer(objValue, othValue, key, object, other, stack2);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack2) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack2["delete"](object);
    stack2["delete"](other);
    return result;
  }
  var COMPARE_PARTIAL_FLAG$2 = 1;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
  var objectProto = Object.prototype;
  var hasOwnProperty$1 = objectProto.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack2) {
    var objIsArr = isArray$2(object), othIsArr = isArray$2(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer$1(object)) {
      if (!isBuffer$1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack2 || (stack2 = new Stack());
      return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack2) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack2);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
      var objIsWrapped = objIsObj && hasOwnProperty$1.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$1.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack2 || (stack2 = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack2);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack2 || (stack2 = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack2);
  }
  function baseIsEqual(value, other, bitmask, customizer, stack2) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack2);
  }
  var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack2 = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack2);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack2) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  function isStrictComparable(value) {
    return value === value && !isObject$1(value);
  }
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray$2(object) || isArguments$1(object));
  }
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get$2(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity$1;
    }
    if (typeof value == "object") {
      return isArray$2(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  var baseFor = createBaseFor();
  var baseFor$1 = baseFor;
  function baseForOwn(object, iteratee) {
    return object && baseFor$1(object, iteratee, keys);
  }
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  var baseEach = createBaseEach(baseForOwn);
  var baseEach$1 = baseEach;
  var now = function() {
    return root$1.Date.now();
  };
  var now$1 = now;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject$1(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now$1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now$1());
    }
    function debounced() {
      var time = now$1(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  function assignMergeValue(object, key, value) {
    if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  function safeGet(object, key) {
    if (key === "constructor" && typeof object[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object[key];
  }
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack2) {
    var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack2.get(srcValue);
    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack2) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray$2(srcValue), isBuff = !isArr && isBuffer$1(srcValue), isTyped = !isArr && !isBuff && isTypedArray$1(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray$2(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject$1(srcValue) || isArguments$1(srcValue)) {
        newValue = objValue;
        if (isArguments$1(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject$1(objValue) || isFunction$2(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack2.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack2);
      stack2["delete"](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }
  function baseMerge(object, source, srcIndex, customizer, stack2) {
    if (object === source) {
      return;
    }
    baseFor$1(source, function(srcValue, key) {
      stack2 || (stack2 = new Stack());
      if (isObject$1(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack2);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack2) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }
  function baseMap(collection, iteratee) {
    var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
    baseEach$1(collection, function(value, key, collection2) {
      result[++index] = iteratee(value, key, collection2);
    });
    return result;
  }
  function map$1(collection, iteratee) {
    var func = isArray$2(collection) ? arrayMap : baseMap;
    return func(collection, baseIteratee(iteratee));
  }
  function flatMap(collection, iteratee) {
    return baseFlatten(map$1(collection, iteratee), 1);
  }
  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
    while (++index < length) {
      var pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
  }
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  function isNil(value) {
    return value == null;
  }
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });
  var merge$1 = merge;
  function baseSet(object, path, value, customizer) {
    if (!isObject$1(object)) {
      return object;
    }
    path = castPath(path, object);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object;
    while (nested != null && ++index < length) {
      var key = toKey(path[index]), newValue = value;
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return object;
      }
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : void 0;
        if (newValue === void 0) {
          newValue = isObject$1(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }
      }
      assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }
  function basePickBy(object, paths, predicate) {
    var index = -1, length = paths.length, result = {};
    while (++index < length) {
      var path = paths[index], value = baseGet(object, path);
      if (predicate(value, path)) {
        baseSet(result, castPath(path, object), value);
      }
    }
    return result;
  }
  function basePick(object, paths) {
    return basePickBy(object, paths, function(value, path) {
      return hasIn(object, path);
    });
  }
  var pick = flatRest(function(object, paths) {
    return object == null ? {} : basePick(object, paths);
  });
  var pick$1 = pick;
  function set$2(object, path, value) {
    return object == null ? object : baseSet(object, path, value);
  }
  const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
    const handleEvent = (event) => {
      const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
      if (checkForDefaultPrevented === false || !shouldPrevent) {
        return oursHandler == null ? void 0 : oursHandler(event);
      }
    };
    return handleEvent;
  };
  function makeMap(str, expectsLowerCase) {
    const map2 = /* @__PURE__ */ Object.create(null);
    const list = str.split(",");
    for (let i = 0; i < list.length; i++) {
      map2[list[i]] = true;
    }
    return expectsLowerCase ? (val) => !!map2[val.toLowerCase()] : (val) => !!map2[val];
  }
  const EMPTY_OBJ = Object.freeze({});
  Object.freeze([]);
  const NOOP = () => {
  };
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isFunction$1 = (val) => typeof val === "function";
  const isString$1 = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return isObject(val) && isFunction$1(val.then) && isFunction$1(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const cacheStringFunction = (fn2) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn2(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_2, c2) => c2 ? c2.toUpperCase() : "");
  });
  const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
  const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value
    });
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function warn$1(msg, ...args) {
    console.warn(`[Vue warn] ${msg}`, ...args);
  }
  let activeEffectScope;
  function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect);
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn2) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn2);
    } else {
      warn$1(`onScopeDispose() is called when there is no active effect scope to be associated with.`);
    }
  }
  const createDep = (effects) => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };
  const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
  const newTracked = (dep) => (dep.n & trackOpBit) > 0;
  const initDepMarkers = ({ deps }) => {
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].w |= trackOpBit;
      }
    }
  };
  const finalizeDepMarkers = (effect) => {
    const { deps } = effect;
    if (deps.length) {
      let ptr = 0;
      for (let i = 0; i < deps.length; i++) {
        const dep = deps[i];
        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect);
        } else {
          deps[ptr++] = dep;
        }
        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }
      deps.length = ptr;
    }
  };
  const targetMap = /* @__PURE__ */ new WeakMap();
  let effectTrackDepth = 0;
  let trackOpBit = 1;
  const maxMarkerBits = 30;
  let activeEffect;
  const ITERATE_KEY = Symbol("iterate");
  const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
  class ReactiveEffect {
    constructor(fn2, scheduler = null, scope) {
      this.fn = fn2;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this.parent = void 0;
      recordEffectScope(this, scope);
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      let parent = activeEffect;
      let lastShouldTrack = shouldTrack;
      while (parent) {
        if (parent === this) {
          return;
        }
        parent = parent.parent;
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        shouldTrack = true;
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        activeEffect = this.parent;
        shouldTrack = lastShouldTrack;
        this.parent = void 0;
      }
    }
    stop() {
      if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  }
  function cleanupEffect(effect) {
    const { deps } = effect;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect);
      }
      deps.length = 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function track(target, type, key) {
    if (shouldTrack && activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = createDep());
      }
      const eventInfo = { effect: activeEffect, target, type, key };
      trackEffects(dep, eventInfo);
    }
  }
  function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack2 = false;
    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit;
        shouldTrack2 = !wasTracked(dep);
      }
    } else {
      shouldTrack2 = !dep.has(activeEffect);
    }
    if (shouldTrack2) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      if (activeEffect.onTrack) {
        activeEffect.onTrack(Object.assign({
          effect: activeEffect
        }, debuggerEventExtraInfo));
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let deps = [];
    if (type === "clear") {
      deps = [...depsMap.values()];
    } else if (key === "length" && isArray(target)) {
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newValue) {
          deps.push(dep);
        }
      });
    } else {
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            deps.push(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    const eventInfo = { target, type, key, newValue, oldValue, oldTarget };
    if (deps.length === 1) {
      if (deps[0]) {
        {
          triggerEffects(deps[0], eventInfo);
        }
      }
    } else {
      const effects = [];
      for (const dep of deps) {
        if (dep) {
          effects.push(...dep);
        }
      }
      {
        triggerEffects(createDep(effects), eventInfo);
      }
    }
  }
  function triggerEffects(dep, debuggerEventExtraInfo) {
    for (const effect of isArray(dep) ? dep : [...dep]) {
      if (effect !== activeEffect || effect.allowRecurse) {
        if (effect.onTrigger) {
          effect.onTrigger(extend({ effect }, debuggerEventExtraInfo));
        }
        if (effect.scheduler) {
          effect.scheduler();
        } else {
          effect.run();
        }
      }
    }
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
  const get = /* @__PURE__ */ createGetter();
  const readonlyGet = /* @__PURE__ */ createGetter(true);
  const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
  const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l2 = this.length; i < l2; i++) {
          track(arr, "get", i + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        const res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function createGetter(isReadonly2 = false, shallow = false) {
    return function get2(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return shallow;
      } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    };
  }
  const set = /* @__PURE__ */ createSetter();
  function createSetter(shallow = false) {
    return function set2(target, key, value, receiver) {
      let oldValue = target[key];
      if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
        return false;
      }
      if (!shallow && !isReadonly(value)) {
        if (!isShallow$1(value)) {
          value = toRaw(value);
          oldValue = toRaw(oldValue);
        }
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
  };
  const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    },
    deleteProperty(target, key) {
      {
        console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    }
  };
  const shallowReadonlyHandlers = /* @__PURE__ */ extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
  });
  const toShallow = (value) => value;
  const getProto = (v2) => Reflect.getPrototypeOf(v2);
  function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
    target = target["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly2 && track(rawTarget, "get", key);
    }
    !isReadonly2 && track(rawTarget, "get", rawKey);
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has$1(key, isReadonly2 = false) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly2 && track(rawTarget, "has", key);
    }
    !isReadonly2 && track(rawTarget, "has", rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly2 = false) {
    target = target["__v_raw"];
    !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value, oldValue);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2 ? get2.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = isMap(target) ? new Map(target) : new Set(target);
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0, oldTarget);
    }
    return result;
  }
  function createForEach(isReadonly2, isShallow2) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
      }
      return type === "delete" ? false : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get$1(this, key);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get$1(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
      shallowInstrumentations2[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  function checkIdentityKeys(target, has2, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has2.call(target, rawKey)) {
      const type = toRawType(target);
      console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
    }
  }
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      {
        console.warn(`value cannot be made reactive: ${String(target)}`);
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow$1(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    def(value, "__v_skip", true);
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  function trackRefValue(ref2) {
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      {
        trackEffects(ref2.dep || (ref2.dep = createDep()), {
          target: ref2,
          type: "get",
          key: "value"
        });
      }
    }
  }
  function triggerRefValue(ref2, newVal) {
    ref2 = toRaw(ref2);
    if (ref2.dep) {
      {
        triggerEffects(ref2.dep, {
          target: ref2,
          type: "set",
          key: "value",
          newValue: newVal
        });
      }
    }
  }
  function isRef(r) {
    return !!(r && r.__v_isRef === true);
  }
  function ref(value) {
    return createRef(value, false);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow;
      this.dep = void 0;
      this.__v_isRef = true;
      this._rawValue = __v_isShallow ? value : toRaw(value);
      this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
      trackRefValue(this);
      return this._value;
    }
    set value(newVal) {
      newVal = this.__v_isShallow ? newVal : toRaw(newVal);
      if (hasChanged(newVal, this._rawValue)) {
        this._rawValue = newVal;
        this._value = this.__v_isShallow ? newVal : toReactive(newVal);
        triggerRefValue(this, newVal);
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly2;
    }
    get value() {
      const self2 = toRaw(this);
      trackRefValue(self2);
      if (self2._dirty || !self2._cacheable) {
        self2._dirty = false;
        self2._value = self2.effect.run();
      }
      return self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction$1(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = () => {
        console.warn("Write operation failed: computed value is readonly");
      };
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    if (debugOptions && !isSSR) {
      cRef.effect.onTrack = debugOptions.onTrack;
      cRef.effect.onTrigger = debugOptions.onTrigger;
    }
    return cRef;
  }
  Promise.resolve();
  const stack = [];
  function pushWarningContext(vnode) {
    stack.push(vnode);
  }
  function popWarningContext() {
    stack.pop();
  }
  function warn(msg, ...args) {
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(appWarnHandler, instance, 11, [
        msg + args.join(""),
        instance && instance.proxy,
        trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
        trace
      ]);
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys2 = Object.keys(props);
    keys2.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys2.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString$1(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction$1(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  const ErrorTypeStrings = {
    ["sp"]: "serverPrefetch hook",
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
  };
  function callWithErrorHandling(fn2, instance, type, args) {
    let res;
    try {
      res = args ? fn2(...args) : fn2();
    } catch (err) {
      handleError(err, instance, type);
    }
    return res;
  }
  function callWithAsyncErrorHandling(fn2, instance, type, args) {
    if (isFunction$1(fn2)) {
      const res = callWithErrorHandling(fn2, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    const values = [];
    for (let i = 0; i < fn2.length; i++) {
      values.push(callWithAsyncErrorHandling(fn2[i], instance, type, args));
    }
    return values;
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = ErrorTypeStrings[type];
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev);
  }
  function logError(err, type, contextVNode, throwInDev = true) {
    {
      const info = ErrorTypeStrings[type];
      if (contextVNode) {
        pushWarningContext(contextVNode);
      }
      warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
      if (contextVNode) {
        popWarningContext();
      }
      if (throwInDev) {
        throw err;
      } else {
        console.error(err);
      }
    }
  }
  let isFlushing = false;
  let isFlushPending = false;
  const queue = [];
  let flushIndex = 0;
  const pendingPreFlushCbs = [];
  let activePreFlushCbs = null;
  let preFlushIndex = 0;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = Promise.resolve();
  let currentFlushPromise = null;
  let currentPreFlushParentJob = null;
  const RECURSION_LIMIT = 100;
  function nextTick(fn2) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn2 ? p2.then(this ? fn2.bind(this) : fn2) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJobId = getId(queue[middle]);
      middleJobId < id ? start = middle + 1 : end = middle;
    }
    return start;
  }
  function queueJob(job) {
    if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
      if (job.id == null) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(job.id), 0, job);
      }
      queueFlush();
    }
  }
  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queueCb(cb, activeQueue, pendingQueue, index) {
    if (!isArray(cb)) {
      if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
        pendingQueue.push(cb);
      }
    } else {
      pendingQueue.push(...cb);
    }
    queueFlush();
  }
  function queuePreFlushCb(cb) {
    queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
  }
  function queuePostFlushCb(cb) {
    queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
  }
  function flushPreFlushCbs(seen, parentJob = null) {
    if (pendingPreFlushCbs.length) {
      currentPreFlushParentJob = parentJob;
      activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
      pendingPreFlushCbs.length = 0;
      {
        seen = seen || /* @__PURE__ */ new Map();
      }
      for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
        if (checkRecursiveUpdates(seen, activePreFlushCbs[preFlushIndex])) {
          continue;
        }
        activePreFlushCbs[preFlushIndex]();
      }
      activePreFlushCbs = null;
      preFlushIndex = 0;
      currentPreFlushParentJob = null;
      flushPreFlushCbs(seen, parentJob);
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)];
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      {
        seen = seen || /* @__PURE__ */ new Map();
      }
      activePostFlushCbs.sort((a2, b2) => getId(a2) - getId(b2));
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
          continue;
        }
        activePostFlushCbs[postFlushIndex]();
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? Infinity : job.id;
  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    flushPreFlushCbs(seen);
    queue.sort((a2, b2) => getId(a2) - getId(b2));
    const check = (job) => checkRecursiveUpdates(seen, job);
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && job.active !== false) {
          if (check(job)) {
            continue;
          }
          callWithErrorHandling(job, null, 14);
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs(seen);
      isFlushing = false;
      currentFlushPromise = null;
      if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  function checkRecursiveUpdates(seen, fn2) {
    if (!seen.has(fn2)) {
      seen.set(fn2, 1);
    } else {
      const count = seen.get(fn2);
      if (count > RECURSION_LIMIT) {
        const instance = fn2.ownerInstance;
        const componentName = instance && getComponentName(instance.type);
        warn(`Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`);
        return true;
      } else {
        seen.set(fn2, count + 1);
      }
    }
  }
  const hmrDirtyComponents = /* @__PURE__ */ new Set();
  {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  const map = /* @__PURE__ */ new Map();
  function createRecord(id, initialDef) {
    if (map.has(id)) {
      return false;
    }
    map.set(id, {
      initialDef: normalizeClassComponent(initialDef),
      instances: /* @__PURE__ */ new Set()
    });
    return true;
  }
  function normalizeClassComponent(component) {
    return isClassComponent(component) ? component.__vccOpts : component;
  }
  function rerender(id, newRender) {
    const record = map.get(id);
    if (!record) {
      return;
    }
    record.initialDef.render = newRender;
    [...record.instances].forEach((instance) => {
      if (newRender) {
        instance.render = newRender;
        normalizeClassComponent(instance.type).render = newRender;
      }
      instance.renderCache = [];
      instance.update();
    });
  }
  function reload(id, newComp) {
    const record = map.get(id);
    if (!record)
      return;
    newComp = normalizeClassComponent(newComp);
    updateComponentDef(record.initialDef, newComp);
    const instances = [...record.instances];
    for (const instance of instances) {
      const oldComp = normalizeClassComponent(instance.type);
      if (!hmrDirtyComponents.has(oldComp)) {
        if (oldComp !== record.initialDef) {
          updateComponentDef(oldComp, newComp);
        }
        hmrDirtyComponents.add(oldComp);
      }
      instance.appContext.optionsCache.delete(instance.type);
      if (instance.ceReload) {
        hmrDirtyComponents.add(oldComp);
        instance.ceReload(newComp.styles);
        hmrDirtyComponents.delete(oldComp);
      } else if (instance.parent) {
        queueJob(instance.parent.update);
        if (instance.parent.type.__asyncLoader && instance.parent.ceReload) {
          instance.parent.ceReload(newComp.styles);
        }
      } else if (instance.appContext.reload) {
        instance.appContext.reload();
      } else if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.warn("[HMR] Root or manually mounted instance modified. Full reload required.");
      }
    }
    queuePostFlushCb(() => {
      for (const instance of instances) {
        hmrDirtyComponents.delete(normalizeClassComponent(instance.type));
      }
    });
  }
  function updateComponentDef(oldComp, newComp) {
    extend(oldComp, newComp);
    for (const key in oldComp) {
      if (key !== "__file" && !(key in newComp)) {
        delete oldComp[key];
      }
    }
  }
  function tryWrap(fn2) {
    return (id, arg) => {
      try {
        return fn2(id, arg);
      } catch (e) {
        console.error(e);
        console.warn(`[HMR] Something went wrong during Vue component hot-reload. Full reload required.`);
      }
    };
  }
  let currentRenderingInstance = null;
  function queueEffectWithSuspense(fn2, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn2)) {
        suspense.effects.push(...fn2);
      } else {
        suspense.effects.push(fn2);
      }
    } else {
      queuePostFlushCb(fn2);
    }
  }
  const INITIAL_WATCHER_VALUE = {};
  function watch(source, cb, options) {
    if (!isFunction$1(cb)) {
      warn(`\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`);
    }
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
    if (!cb) {
      if (immediate !== void 0) {
        warn(`watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`);
      }
      if (deep !== void 0) {
        warn(`watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`);
      }
    }
    const warnInvalidSource = (s2) => {
      warn(`Invalid watch source: `, s2, `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`);
    };
    const instance = currentInstance;
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow$1(source);
    } else if (isReactive(source)) {
      getter = () => source;
      deep = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some(isReactive);
      getter = () => source.map((s2) => {
        if (isRef(s2)) {
          return s2.value;
        } else if (isReactive(s2)) {
          return traverse(s2);
        } else if (isFunction$1(s2)) {
          return callWithErrorHandling(s2, instance, 2);
        } else {
          warnInvalidSource(s2);
        }
      });
    } else if (isFunction$1(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(source, instance, 2);
      } else {
        getter = () => {
          if (instance && instance.isUnmounted) {
            return;
          }
          if (cleanup) {
            cleanup();
          }
          return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
        };
      }
    } else {
      getter = NOOP;
      warnInvalidSource(source);
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn2) => {
      cleanup = effect.onStop = () => {
        callWithErrorHandling(fn2, instance, 4);
      };
    };
    if (isInSSRComponentSetup) {
      onCleanup = NOOP;
      if (!cb) {
        getter();
      } else if (immediate) {
        callWithAsyncErrorHandling(cb, instance, 3, [
          getter(),
          isMultiSource ? [] : void 0,
          onCleanup
        ]);
      }
      return NOOP;
    }
    let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
    const job = () => {
      if (!effect.active) {
        return;
      }
      if (cb) {
        const newValue = effect.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i) => hasChanged(v2, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
          if (cleanup) {
            cleanup();
          }
          callWithAsyncErrorHandling(cb, instance, 3, [
            newValue,
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
            onCleanup
          ]);
          oldValue = newValue;
        }
      } else {
        effect.run();
      }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === "sync") {
      scheduler = job;
    } else if (flush === "post") {
      scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
      scheduler = () => {
        if (!instance || instance.isMounted) {
          queuePreFlushCb(job);
        } else {
          job();
        }
      };
    }
    const effect = new ReactiveEffect(getter, scheduler);
    {
      effect.onTrack = onTrack;
      effect.onTrigger = onTrigger;
    }
    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = effect.run();
      }
    } else if (flush === "post") {
      queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
    } else {
      effect.run();
    }
    return () => {
      effect.stop();
      if (instance && instance.scope) {
        remove(instance.scope.effects, effect);
      }
    };
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction$1(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const cur = currentInstance;
    setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    if (cur) {
      setCurrentInstance(cur);
    } else {
      unsetCurrentInstance();
    }
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  function traverse(value, seen) {
    if (!isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v2) => {
        traverse(v2, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], seen);
      }
    }
    return value;
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        if (target.isUnmounted) {
          return;
        }
        pauseTracking();
        setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        unsetCurrentInstance();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    } else {
      const apiName = toHandlerKey(ErrorTypeStrings[type].replace(/ hook$/, ""));
      warn(`${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => injectHook(lifecycle, hook, target);
  const onMounted = createHook("m");
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach((m2) => mergeOptions$1(resolved, m2, optionMergeStrategies, true));
      }
      mergeOptions$1(resolved, base, optionMergeStrategies);
    }
    cache.set(base, resolved);
    return resolved;
  }
  function mergeOptions$1(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions$1(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach((m2) => mergeOptions$1(to, m2, strats, true));
    }
    for (const key in from) {
      if (asMixin && key === "expose") {
        warn(`"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`);
      } else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeObjectOptions,
    emits: mergeObjectOptions,
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    watch: mergeWatchOptions,
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(isFunction$1(to) ? to.call(this, this) : to, isFunction$1(from) ? from.call(this, this) : from);
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
  }
  function mergeWatchOptions(to, from) {
    if (!to)
      return from;
    if (!from)
      return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  const getPublicInstance = (i) => {
    if (!i)
      return null;
    if (isStatefulComponent(i))
      return getExposeProxy(i) || i.proxy;
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => () => queueJob(i.update),
    $nextTick: (i) => nextTick.bind(i.proxy),
    $watch: (i) => instanceWatch.bind(i)
  });
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      if (key === "__isVue") {
        return true;
      }
      if (setupState !== EMPTY_OBJ && setupState.__isScriptSetup && hasOwn(setupState, key)) {
        return setupState[key];
      }
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance, "get", key);
        }
        return publicGetter(instance);
      } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
        {
          return globalProperties[key];
        }
      } else
        ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        warn(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        warn(`Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`, instance);
        return false;
      } else {
        if (key in instance.appContext.config.globalProperties) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            value
          });
        } else {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        this.set(target, key, descriptor.get(), null);
      } else if (descriptor.value != null) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      warn(`Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`);
      return Reflect.ownKeys(target);
    };
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  const setCurrentInstance = (instance) => {
    currentInstance = instance;
    instance.scope.on();
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    currentInstance = null;
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function getExposeProxy(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        }
      }));
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component) {
    return isFunction$1(Component) ? Component.displayName || Component.name : Component.name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction$1(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  };
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function initCustomFormatter() {
    if (typeof window === "undefined") {
      return;
    }
    const vueStyle = { style: "color:#3ba776" };
    const numberStyle = { style: "color:#0b1bc9" };
    const stringStyle = { style: "color:#b62e24" };
    const keywordStyle = { style: "color:#9d288c" };
    const formatter = {
      header(obj) {
        if (!isObject(obj)) {
          return null;
        }
        if (obj.__isVue) {
          return ["div", vueStyle, `VueInstance`];
        } else if (isRef(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, genRefFlag(obj)],
            "<",
            formatValue(obj.value),
            `>`
          ];
        } else if (isReactive(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
            "<",
            formatValue(obj),
            `>${isReadonly(obj) ? ` (readonly)` : ``}`
          ];
        } else if (isReadonly(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
            "<",
            formatValue(obj),
            ">"
          ];
        }
        return null;
      },
      hasBody(obj) {
        return obj && obj.__isVue;
      },
      body(obj) {
        if (obj && obj.__isVue) {
          return [
            "div",
            {},
            ...formatInstance(obj.$)
          ];
        }
      }
    };
    function formatInstance(instance) {
      const blocks = [];
      if (instance.type.props && instance.props) {
        blocks.push(createInstanceBlock("props", toRaw(instance.props)));
      }
      if (instance.setupState !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("setup", instance.setupState));
      }
      if (instance.data !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("data", toRaw(instance.data)));
      }
      const computed2 = extractKeys(instance, "computed");
      if (computed2) {
        blocks.push(createInstanceBlock("computed", computed2));
      }
      const injected = extractKeys(instance, "inject");
      if (injected) {
        blocks.push(createInstanceBlock("injected", injected));
      }
      blocks.push([
        "div",
        {},
        [
          "span",
          {
            style: keywordStyle.style + ";opacity:0.66"
          },
          "$ (internal): "
        ],
        ["object", { object: instance }]
      ]);
      return blocks;
    }
    function createInstanceBlock(type, target) {
      target = extend({}, target);
      if (!Object.keys(target).length) {
        return ["span", {}];
      }
      return [
        "div",
        { style: "line-height:1.25em;margin-bottom:0.6em" },
        [
          "div",
          {
            style: "color:#476582"
          },
          type
        ],
        [
          "div",
          {
            style: "padding-left:1.25em"
          },
          ...Object.keys(target).map((key) => {
            return [
              "div",
              {},
              ["span", keywordStyle, key + ": "],
              formatValue(target[key], false)
            ];
          })
        ]
      ];
    }
    function formatValue(v2, asRaw = true) {
      if (typeof v2 === "number") {
        return ["span", numberStyle, v2];
      } else if (typeof v2 === "string") {
        return ["span", stringStyle, JSON.stringify(v2)];
      } else if (typeof v2 === "boolean") {
        return ["span", keywordStyle, v2];
      } else if (isObject(v2)) {
        return ["object", { object: asRaw ? toRaw(v2) : v2 }];
      } else {
        return ["span", stringStyle, String(v2)];
      }
    }
    function extractKeys(instance, type) {
      const Comp = instance.type;
      if (isFunction$1(Comp)) {
        return;
      }
      const extracted = {};
      for (const key in instance.ctx) {
        if (isKeyOfType(Comp, key, type)) {
          extracted[key] = instance.ctx[key];
        }
      }
      return extracted;
    }
    function isKeyOfType(Comp, key, type) {
      const opts = Comp[type];
      if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) {
        return true;
      }
      if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
        return true;
      }
      if (Comp.mixins && Comp.mixins.some((m2) => isKeyOfType(m2, key, type))) {
        return true;
      }
    }
    function genRefFlag(v2) {
      if (isShallow(v2)) {
        return `ShallowRef`;
      }
      if (v2.effect) {
        return `ComputedRef`;
      }
      return `Ref`;
    }
    if (window.devtoolsFormatters) {
      window.devtoolsFormatters.push(formatter);
    } else {
      window.devtoolsFormatters = [formatter];
    }
  }
  function initDev() {
    {
      initCustomFormatter();
    }
  }
  {
    initDev();
  }
  Vue;
  var _a;
  const isClient = typeof window !== "undefined";
  const isDef = (val) => typeof val !== "undefined";
  const isBoolean = (val) => typeof val === "boolean";
  const isFunction = (val) => typeof val === "function";
  const isNumber = (val) => typeof val === "number";
  const isString = (val) => typeof val === "string";
  const noop = () => {
  };
  isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : unref(r);
  }
  function identity(arg) {
    return arg;
  }
  function tryOnScopeDispose(fn2) {
    if (getCurrentScope()) {
      onScopeDispose(fn2);
      return true;
    }
    return false;
  }
  function tryOnMounted(fn2, sync = true) {
    if (getCurrentInstance())
      onMounted(fn2);
    else if (sync)
      fn2();
    else
      nextTick(fn2);
  }
  Vue;
  function unrefElement(elRef) {
    var _a2;
    const plain = resolveUnref(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  isClient ? window.document : void 0;
  isClient ? window.navigator : void 0;
  isClient ? window.location : void 0;
  function useEventListener(...args) {
    let target;
    let events;
    let listeners;
    let options;
    if (isString(args[0]) || Array.isArray(args[0])) {
      [events, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events))
      events = [events];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn2) => fn2());
      cleanups.length = 0;
    };
    const register = (el, event, listener) => {
      el.addEventListener(event, listener, options);
      return () => el.removeEventListener(event, listener, options);
    };
    const stopWatch = watch(() => unrefElement(target), (el) => {
      cleanup();
      if (!el)
        return;
      cleanups.push(...events.flatMap((event) => {
        return listeners.map((listener) => register(el, event, listener));
      }));
    }, { immediate: true, flush: "post" });
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  function onClickOutside(target, handler, options = {}) {
    const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
    if (!window2)
      return;
    let shouldListen = true;
    let fallback;
    const shouldIgnore = (event) => {
      return ignore.some((target2) => {
        if (typeof target2 === "string") {
          return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
        } else {
          const el = unrefElement(target2);
          return el && (event.target === el || event.composedPath().includes(el));
        }
      });
    };
    const listener = (event) => {
      window2.clearTimeout(fallback);
      const el = unrefElement(target);
      if (!el || el === event.target || event.composedPath().includes(el))
        return;
      if (event.detail === 0)
        shouldListen = !shouldIgnore(event);
      if (!shouldListen) {
        shouldListen = true;
        return;
      }
      handler(event);
    };
    const cleanup = [
      useEventListener(window2, "click", listener, { passive: true, capture }),
      useEventListener(window2, "pointerdown", (e) => {
        const el = unrefElement(target);
        if (el)
          shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
      }, { passive: true }),
      useEventListener(window2, "pointerup", (e) => {
        if (e.button === 0) {
          const path = e.composedPath();
          e.composedPath = () => path;
          fallback = window2.setTimeout(() => listener(e), 50);
        }
      }, { passive: true }),
      detectIframe && useEventListener(window2, "blur", (event) => {
        var _a2;
        const el = unrefElement(target);
        if (((_a2 = window2.document.activeElement) == null ? void 0 : _a2.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
          handler(event);
      })
    ].filter(Boolean);
    const stop = () => cleanup.forEach((fn2) => fn2());
    return stop;
  }
  function useSupported(callback, sync = false) {
    const isSupported = ref();
    const update = () => isSupported.value = Boolean(callback());
    update();
    tryOnMounted(update, sync);
    return isSupported;
  }
  function cloneFnJSON(source) {
    return JSON.parse(JSON.stringify(source));
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  _global[globalKey];
  var __getOwnPropSymbols$f = Object.getOwnPropertySymbols;
  var __hasOwnProp$f = Object.prototype.hasOwnProperty;
  var __propIsEnum$f = Object.prototype.propertyIsEnumerable;
  var __objRest$2 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$f.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$f)
      for (var prop of __getOwnPropSymbols$f(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$f.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useResizeObserver(target, callback, options = {}) {
    const _a2 = options, { window: window2 = defaultWindow } = _a2, observerOptions = __objRest$2(_a2, ["window"]);
    let observer;
    const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = watch(() => unrefElement(target), (el) => {
      cleanup();
      if (isSupported.value && window2 && el) {
        observer = new ResizeObserver(callback);
        observer.observe(el, observerOptions);
      }
    }, { immediate: true, flush: "post" });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }
  var SwipeDirection;
  (function(SwipeDirection2) {
    SwipeDirection2["UP"] = "UP";
    SwipeDirection2["RIGHT"] = "RIGHT";
    SwipeDirection2["DOWN"] = "DOWN";
    SwipeDirection2["LEFT"] = "LEFT";
    SwipeDirection2["NONE"] = "NONE";
  })(SwipeDirection || (SwipeDirection = {}));
  var __defProp2 = Object.defineProperty;
  var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues2 = (a2, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp2.call(b2, prop))
        __defNormalProp2(a2, prop, b2[prop]);
    if (__getOwnPropSymbols2)
      for (var prop of __getOwnPropSymbols2(b2)) {
        if (__propIsEnum2.call(b2, prop))
          __defNormalProp2(a2, prop, b2[prop]);
      }
    return a2;
  };
  const _TransitionPresets = {
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
  };
  __spreadValues2({
    linear: identity
  }, _TransitionPresets);
  function useVModel(props, key, emit, options = {}) {
    var _a2, _b, _c;
    const {
      clone = false,
      passive = false,
      eventName,
      deep = false,
      defaultValue
    } = options;
    const vm = getCurrentInstance();
    const _emit = emit || (vm == null ? void 0 : vm.emit) || ((_a2 = vm == null ? void 0 : vm.$emit) == null ? void 0 : _a2.bind(vm)) || ((_c = (_b = vm == null ? void 0 : vm.proxy) == null ? void 0 : _b.$emit) == null ? void 0 : _c.bind(vm == null ? void 0 : vm.proxy));
    let event = eventName;
    if (!key) {
      {
        key = "modelValue";
      }
    }
    event = eventName || event || `update:${key.toString()}`;
    const cloneFn = (val) => !clone ? val : isFunction(clone) ? clone(val) : cloneFnJSON(val);
    const getValue2 = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
    if (passive) {
      const initialValue = getValue2();
      const proxy = ref(initialValue);
      watch(() => props[key], (v2) => proxy.value = cloneFn(v2));
      watch(proxy, (v2) => {
        if (v2 !== props[key] || deep)
          _emit(event, v2);
      }, { deep });
      return proxy;
    } else {
      return computed({
        get() {
          return getValue2();
        },
        set(value) {
          _emit(event, value);
        }
      });
    }
  }
  Vue.isVNode;
  const isUndefined = (val) => val === void 0;
  const isElement = (e) => {
    if (typeof Element === "undefined")
      return false;
    return e instanceof Element;
  };
  const isStringNumber = (val) => {
    if (!isString$1(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
  };
  const keysOf = (arr) => Object.keys(arr);
  const entriesOf = (arr) => Object.entries(arr);
  const getProp = (obj, path, defaultValue) => {
    return {
      get value() {
        return get$2(obj, path, defaultValue);
      },
      set value(val) {
        set$2(obj, path, val);
      }
    };
  };
  class ElementPlusError extends Error {
    constructor(m2) {
      super(m2);
      this.name = "ElementPlusError";
    }
  }
  function throwError(scope, m2) {
    throw new ElementPlusError(`[${scope}] ${m2}`);
  }
  function debugWarn(scope, message) {
    {
      const error = isString$1(scope) ? new ElementPlusError(`[${scope}] ${message}`) : scope;
      console.warn(error);
    }
  }
  const SCOPE$2 = "utils/dom/style";
  const classNameToArray = (cls = "") => cls.split(" ").filter((item) => !!item.trim());
  const hasClass = (el, cls) => {
    if (!el || !cls)
      return false;
    if (cls.includes(" "))
      throw new Error("className should not contain space.");
    return el.classList.contains(cls);
  };
  const addClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.add(...classNameToArray(cls));
  };
  const removeClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.remove(...classNameToArray(cls));
  };
  const getStyle = (element, styleName) => {
    var _a2;
    if (!isClient || !element || !styleName)
      return "";
    let key = camelize(styleName);
    if (key === "float")
      key = "cssFloat";
    try {
      const style2 = element.style[key];
      if (style2)
        return style2;
      const computed2 = (_a2 = document.defaultView) == null ? void 0 : _a2.getComputedStyle(element, "");
      return computed2 ? computed2[key] : "";
    } catch (e) {
      return element.style[key];
    }
  };
  function addUnit(value, defaultUnit = "px") {
    if (!value)
      return "";
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString$1(value)) {
      return value;
    }
    debugWarn(SCOPE$2, "binding value must be a string or number");
  }
  /*! Element Plus Icons Vue v2.0.10 */
  var export_helper_default = (sfc, props) => {
    let target = sfc.__vccOpts || sfc;
    for (let [key, val] of props)
      target[key] = val;
    return target;
  };
  var arrow_down_vue_vue_type_script_lang_default = {
    name: "ArrowDown"
  };
  var _hoisted_16 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_26 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
  }, null, -1), _hoisted_36 = [
    _hoisted_26
  ];
  function _sfc_render6(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_16, _hoisted_36);
  }
  var arrow_down_default = /* @__PURE__ */ export_helper_default(arrow_down_vue_vue_type_script_lang_default, [["render", _sfc_render6], ["__file", "arrow-down.vue"]]);
  var arrow_right_vue_vue_type_script_lang_default = {
    name: "ArrowRight"
  };
  var _hoisted_110 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_210 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
  }, null, -1), _hoisted_310 = [
    _hoisted_210
  ];
  function _sfc_render10(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_110, _hoisted_310);
  }
  var arrow_right_default = /* @__PURE__ */ export_helper_default(arrow_right_vue_vue_type_script_lang_default, [["render", _sfc_render10], ["__file", "arrow-right.vue"]]);
  var arrow_up_vue_vue_type_script_lang_default = {
    name: "ArrowUp"
  };
  var _hoisted_112 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_212 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0z"
  }, null, -1), _hoisted_312 = [
    _hoisted_212
  ];
  function _sfc_render12(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_112, _hoisted_312);
  }
  var arrow_up_default = /* @__PURE__ */ export_helper_default(arrow_up_vue_vue_type_script_lang_default, [["render", _sfc_render12], ["__file", "arrow-up.vue"]]);
  var check_vue_vue_type_script_lang_default = {
    name: "Check"
  };
  var _hoisted_143 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_243 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
  }, null, -1), _hoisted_342 = [
    _hoisted_243
  ];
  function _sfc_render43(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_143, _hoisted_342);
  }
  var check_default = /* @__PURE__ */ export_helper_default(check_vue_vue_type_script_lang_default, [["render", _sfc_render43], ["__file", "check.vue"]]);
  var circle_check_vue_vue_type_script_lang_default = {
    name: "CircleCheck"
  };
  var _hoisted_149 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_249 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
  }, null, -1), _hoisted_348 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"
  }, null, -1), _hoisted_415 = [
    _hoisted_249,
    _hoisted_348
  ];
  function _sfc_render49(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_149, _hoisted_415);
  }
  var circle_check_default = /* @__PURE__ */ export_helper_default(circle_check_vue_vue_type_script_lang_default, [["render", _sfc_render49], ["__file", "circle-check.vue"]]);
  var circle_close_filled_vue_vue_type_script_lang_default = {
    name: "CircleCloseFilled"
  };
  var _hoisted_150 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_250 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z"
  }, null, -1), _hoisted_349 = [
    _hoisted_250
  ];
  function _sfc_render50(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_150, _hoisted_349);
  }
  var circle_close_filled_default = /* @__PURE__ */ export_helper_default(circle_close_filled_vue_vue_type_script_lang_default, [["render", _sfc_render50], ["__file", "circle-close-filled.vue"]]);
  var circle_close_vue_vue_type_script_lang_default = {
    name: "CircleClose"
  };
  var _hoisted_151 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_251 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248L466.752 512z"
  }, null, -1), _hoisted_350 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
  }, null, -1), _hoisted_416 = [
    _hoisted_251,
    _hoisted_350
  ];
  function _sfc_render51(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_151, _hoisted_416);
  }
  var circle_close_default = /* @__PURE__ */ export_helper_default(circle_close_vue_vue_type_script_lang_default, [["render", _sfc_render51], ["__file", "circle-close.vue"]]);
  var close_vue_vue_type_script_lang_default = {
    name: "Close"
  };
  var _hoisted_156 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_256 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
  }, null, -1), _hoisted_355 = [
    _hoisted_256
  ];
  function _sfc_render56(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_156, _hoisted_355);
  }
  var close_default = /* @__PURE__ */ export_helper_default(close_vue_vue_type_script_lang_default, [["render", _sfc_render56], ["__file", "close.vue"]]);
  var delete_vue_vue_type_script_lang_default = {
    name: "Delete"
  };
  var _hoisted_180 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_280 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"
  }, null, -1), _hoisted_379 = [
    _hoisted_280
  ];
  function _sfc_render80(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_180, _hoisted_379);
  }
  var delete_default = /* @__PURE__ */ export_helper_default(delete_vue_vue_type_script_lang_default, [["render", _sfc_render80], ["__file", "delete.vue"]]);
  var document_vue_vue_type_script_lang_default = {
    name: "Document"
  };
  var _hoisted_190 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_290 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M832 384H576V128H192v768h640V384zm-26.496-64L640 154.496V320h165.504zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32zm160 448h384v64H320v-64zm0-192h160v64H320v-64zm0 384h384v64H320v-64z"
  }, null, -1), _hoisted_389 = [
    _hoisted_290
  ];
  function _sfc_render90(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_190, _hoisted_389);
  }
  var document_default = /* @__PURE__ */ export_helper_default(document_vue_vue_type_script_lang_default, [["render", _sfc_render90], ["__file", "document.vue"]]);
  var hide_vue_vue_type_script_lang_default = {
    name: "Hide"
  };
  var _hoisted_1133 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2133 = /* @__PURE__ */ Vue.createElementVNode("path", {
    d: "M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2L371.2 588.8ZM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z",
    fill: "currentColor"
  }, null, -1), _hoisted_3132 = /* @__PURE__ */ Vue.createElementVNode("path", {
    d: "M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z",
    fill: "currentColor"
  }, null, -1), _hoisted_438 = [
    _hoisted_2133,
    _hoisted_3132
  ];
  function _sfc_render133(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_1133, _hoisted_438);
  }
  var hide_default = /* @__PURE__ */ export_helper_default(hide_vue_vue_type_script_lang_default, [["render", _sfc_render133], ["__file", "hide.vue"]]);
  var info_filled_vue_vue_type_script_lang_default = {
    name: "InfoFilled"
  };
  var _hoisted_1143 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2143 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64zm67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344zM590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
  }, null, -1), _hoisted_3142 = [
    _hoisted_2143
  ];
  function _sfc_render143(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_1143, _hoisted_3142);
  }
  var info_filled_default = /* @__PURE__ */ export_helper_default(info_filled_vue_vue_type_script_lang_default, [["render", _sfc_render143], ["__file", "info-filled.vue"]]);
  var loading_vue_vue_type_script_lang_default = {
    name: "Loading"
  };
  var _hoisted_1150 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2150 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
  }, null, -1), _hoisted_3149 = [
    _hoisted_2150
  ];
  function _sfc_render150(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_1150, _hoisted_3149);
  }
  var loading_default = /* @__PURE__ */ export_helper_default(loading_vue_vue_type_script_lang_default, [["render", _sfc_render150], ["__file", "loading.vue"]]);
  var success_filled_vue_vue_type_script_lang_default = {
    name: "SuccessFilled"
  };
  var _hoisted_1249 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2249 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"
  }, null, -1), _hoisted_3248 = [
    _hoisted_2249
  ];
  function _sfc_render249(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_1249, _hoisted_3248);
  }
  var success_filled_default = /* @__PURE__ */ export_helper_default(success_filled_vue_vue_type_script_lang_default, [["render", _sfc_render249], ["__file", "success-filled.vue"]]);
  var view_vue_vue_type_script_lang_default = {
    name: "View"
  };
  var _hoisted_1283 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2283 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
  }, null, -1), _hoisted_3282 = [
    _hoisted_2283
  ];
  function _sfc_render283(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_1283, _hoisted_3282);
  }
  var view_default = /* @__PURE__ */ export_helper_default(view_vue_vue_type_script_lang_default, [["render", _sfc_render283], ["__file", "view.vue"]]);
  var warning_filled_vue_vue_type_script_lang_default = {
    name: "WarningFilled"
  };
  var _hoisted_1287 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2287 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256zm0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z"
  }, null, -1), _hoisted_3286 = [
    _hoisted_2287
  ];
  function _sfc_render287(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_1287, _hoisted_3286);
  }
  var warning_filled_default = /* @__PURE__ */ export_helper_default(warning_filled_vue_vue_type_script_lang_default, [["render", _sfc_render287], ["__file", "warning-filled.vue"]]);
  var zoom_in_vue_vue_type_script_lang_default = {
    name: "ZoomIn"
  };
  var _hoisted_1292 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2292 = /* @__PURE__ */ Vue.createElementVNode("path", {
    fill: "currentColor",
    d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zm-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96z"
  }, null, -1), _hoisted_3291 = [
    _hoisted_2292
  ];
  function _sfc_render292(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_1292, _hoisted_3291);
  }
  var zoom_in_default = /* @__PURE__ */ export_helper_default(zoom_in_vue_vue_type_script_lang_default, [["render", _sfc_render292], ["__file", "zoom-in.vue"]]);
  const epPropKey = "__epPropKey";
  const definePropType = (val) => val;
  const isEpProp = (val) => isObject(val) && !!val[epPropKey];
  const buildProp = (prop, key) => {
    if (!isObject(prop) || isEpProp(prop))
      return prop;
    const { values, required, default: defaultValue, type, validator } = prop;
    const _validator = values || validator ? (val) => {
      let valid = false;
      let allowedValues = [];
      if (values) {
        allowedValues = Array.from(values);
        if (hasOwn(prop, "default")) {
          allowedValues.push(defaultValue);
        }
        valid || (valid = allowedValues.includes(val));
      }
      if (validator)
        valid || (valid = validator(val));
      if (!valid && allowedValues.length > 0) {
        const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
        Vue.warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
      }
      return valid;
    } : void 0;
    const epProp = {
      type,
      required: !!required,
      validator: _validator,
      [epPropKey]: true
    };
    if (hasOwn(prop, "default"))
      epProp.default = defaultValue;
    return epProp;
  };
  const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [
    key,
    buildProp(option, key)
  ]));
  const iconPropType = definePropType([
    String,
    Object,
    Function
  ]);
  const TypeComponents = {
    Close: close_default,
    SuccessFilled: success_filled_default,
    InfoFilled: info_filled_default,
    WarningFilled: warning_filled_default,
    CircleCloseFilled: circle_close_filled_default
  };
  const TypeComponentsMap = {
    success: success_filled_default,
    warning: warning_filled_default,
    error: circle_close_filled_default,
    info: info_filled_default
  };
  const ValidateComponentsMap = {
    validating: loading_default,
    success: circle_check_default,
    error: circle_close_default
  };
  const withInstall = (main, extra) => {
    main.install = (app2) => {
      for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
        app2.component(comp.name, comp);
      }
    };
    if (extra) {
      for (const [key, comp] of Object.entries(extra)) {
        main[key] = comp;
      }
    }
    return main;
  };
  const withNoopInstall = (component) => {
    component.install = NOOP;
    return component;
  };
  const EVENT_CODE = {
    tab: "Tab",
    enter: "Enter",
    space: "Space",
    left: "ArrowLeft",
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    esc: "Escape",
    delete: "Delete",
    backspace: "Backspace",
    numpadEnter: "NumpadEnter",
    pageUp: "PageUp",
    pageDown: "PageDown",
    home: "Home",
    end: "End"
  };
  const UPDATE_MODEL_EVENT = "update:modelValue";
  const componentSizes = ["", "default", "small", "large"];
  const isKorean = (text) => /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi.test(text);
  const mutable = (val) => val;
  const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
  const LISTENER_PREFIX = /^on[A-Z]/;
  const useAttrs = (params = {}) => {
    const { excludeListeners = false, excludeKeys } = params;
    const allExcludeKeys = Vue.computed(() => {
      return ((excludeKeys == null ? void 0 : excludeKeys.value) || []).concat(DEFAULT_EXCLUDE_KEYS);
    });
    const instance = Vue.getCurrentInstance();
    if (!instance) {
      debugWarn("use-attrs", "getCurrentInstance() returned null. useAttrs() must be called at the top of a setup function");
      return Vue.computed(() => ({}));
    }
    return Vue.computed(() => {
      var _a2;
      return fromPairs(Object.entries((_a2 = instance.proxy) == null ? void 0 : _a2.$attrs).filter(([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))));
    });
  };
  const buttonGroupContextKey = Symbol("buttonGroupContextKey");
  const checkboxGroupContextKey = Symbol("checkboxGroupContextKey");
  const configProviderContextKey = Symbol();
  const formContextKey = Symbol("formContextKey");
  const formItemContextKey = Symbol("formItemContextKey");
  const scrollbarContextKey = Symbol("scrollbarContextKey");
  const uploadContextKey = Symbol("uploadContextKey");
  const POPPER_INJECTION_KEY = Symbol("popper");
  const POPPER_CONTENT_INJECTION_KEY = Symbol("popperContent");
  const TOOLTIP_INJECTION_KEY = Symbol("elTooltip");
  const useProp = (name) => {
    const vm = Vue.getCurrentInstance();
    return Vue.computed(() => {
      var _a2, _b;
      return (_b = ((_a2 = vm.proxy) == null ? void 0 : _a2.$props)[name]) != null ? _b : void 0;
    });
  };
  const globalConfig = Vue.ref();
  function useGlobalConfig(key, defaultValue = void 0) {
    const config = Vue.getCurrentInstance() ? Vue.inject(configProviderContextKey, globalConfig) : globalConfig;
    if (key) {
      return Vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = config.value) == null ? void 0 : _a2[key]) != null ? _b : defaultValue;
      });
    } else {
      return config;
    }
  }
  const useSizeProp = buildProp({
    type: String,
    values: componentSizes,
    required: false
  });
  const useSize = (fallback, ignore = {}) => {
    const emptyRef = Vue.ref(void 0);
    const size2 = ignore.prop ? emptyRef : useProp("size");
    const globalConfig2 = ignore.global ? emptyRef : useGlobalConfig("size");
    const form = ignore.form ? { size: void 0 } : Vue.inject(formContextKey, void 0);
    const formItem = ignore.formItem ? { size: void 0 } : Vue.inject(formItemContextKey, void 0);
    return Vue.computed(() => size2.value || Vue.unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || globalConfig2.value || "");
  };
  const useDisabled = (fallback) => {
    const disabled = useProp("disabled");
    const form = Vue.inject(formContextKey, void 0);
    return Vue.computed(() => disabled.value || Vue.unref(fallback) || (form == null ? void 0 : form.disabled) || false);
  };
  const useDeprecated = ({ from, replacement, scope, version, ref: ref2, type = "API" }, condition) => {
    Vue.watch(() => Vue.unref(condition), (val) => {
      if (val) {
        debugWarn(scope, `[${type}] ${from} is about to be deprecated in version ${version}, please use ${replacement} instead.
For more detail, please visit: ${ref2}
`);
      }
    }, {
      immediate: true
    });
  };
  const defaultNamespace = "el";
  const statePrefix = "is-";
  const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
      cls += `-${blockSuffix}`;
    }
    if (element) {
      cls += `__${element}`;
    }
    if (modifier) {
      cls += `--${modifier}`;
    }
    return cls;
  };
  const useNamespace = (block) => {
    const namespace = useGlobalConfig("namespace", defaultNamespace);
    const b2 = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
    const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
    const m2 = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
    const be2 = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
    const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
    const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
    const is = (name, ...args) => {
      const state = args.length >= 1 ? args[0] : true;
      return name && state ? `${statePrefix}${name}` : "";
    };
    const cssVar = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarBlock = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${block}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarName = (name) => `--${namespace.value}-${name}`;
    const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
    return {
      namespace,
      b: b2,
      e,
      m: m2,
      be: be2,
      em,
      bm,
      bem,
      is,
      cssVar,
      cssVarName,
      cssVarBlock,
      cssVarBlockName
    };
  };
  const defaultIdInjection = {
    prefix: Math.floor(Math.random() * 1e4),
    current: 0
  };
  const ID_INJECTION_KEY = Symbol("elIdInjection");
  const useIdInjection = () => {
    return Vue.getCurrentInstance() ? Vue.inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
  };
  const useId = (deterministicId) => {
    const idInjection = useIdInjection();
    if (!isClient && idInjection === defaultIdInjection) {
      debugWarn("IdInjection", `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);
    }
    const namespace = useGlobalConfig("namespace", defaultNamespace);
    const idRef = Vue.computed(() => Vue.unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
    return idRef;
  };
  const useFormItem = () => {
    const form = Vue.inject(formContextKey, void 0);
    const formItem = Vue.inject(formItemContextKey, void 0);
    return {
      form,
      formItem
    };
  };
  const useFormItemInputId = (props, {
    formItemContext,
    disableIdGeneration,
    disableIdManagement
  }) => {
    if (!disableIdGeneration) {
      disableIdGeneration = Vue.ref(false);
    }
    if (!disableIdManagement) {
      disableIdManagement = Vue.ref(false);
    }
    const inputId = Vue.ref();
    let idUnwatch = void 0;
    const isLabeledByFormItem = Vue.computed(() => {
      var _a2;
      return !!(!props.label && formItemContext && formItemContext.inputIds && ((_a2 = formItemContext.inputIds) == null ? void 0 : _a2.length) <= 1);
    });
    Vue.onMounted(() => {
      idUnwatch = Vue.watch([Vue.toRef(props, "id"), disableIdGeneration], ([id, disableIdGeneration2]) => {
        const newId = id != null ? id : !disableIdGeneration2 ? useId().value : void 0;
        if (newId !== inputId.value) {
          if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value);
            if (!(disableIdManagement == null ? void 0 : disableIdManagement.value) && !disableIdGeneration2 && newId) {
              formItemContext.addInputId(newId);
            }
          }
          inputId.value = newId;
        }
      }, { immediate: true });
    });
    Vue.onUnmounted(() => {
      idUnwatch && idUnwatch();
      if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
        inputId.value && formItemContext.removeInputId(inputId.value);
      }
    });
    return {
      isLabeledByFormItem,
      inputId
    };
  };
  var English = {
    name: "en",
    el: {
      colorpicker: {
        confirm: "OK",
        clear: "Clear",
        defaultLabel: "color picker",
        description: "current color is {color}. press enter to select a new color."
      },
      datepicker: {
        now: "Now",
        today: "Today",
        cancel: "Cancel",
        clear: "Clear",
        confirm: "OK",
        dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
        monthTablePrompt: "Use the arrow keys and enter to select the month",
        yearTablePrompt: "Use the arrow keys and enter to select the year",
        selectedDate: "Selected date",
        selectDate: "Select date",
        selectTime: "Select time",
        startDate: "Start Date",
        startTime: "Start Time",
        endDate: "End Date",
        endTime: "End Time",
        prevYear: "Previous Year",
        nextYear: "Next Year",
        prevMonth: "Previous Month",
        nextMonth: "Next Month",
        year: "",
        month1: "January",
        month2: "February",
        month3: "March",
        month4: "April",
        month5: "May",
        month6: "June",
        month7: "July",
        month8: "August",
        month9: "September",
        month10: "October",
        month11: "November",
        month12: "December",
        week: "week",
        weeks: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat"
        },
        weeksFull: {
          sun: "Sunday",
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday"
        },
        months: {
          jan: "Jan",
          feb: "Feb",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Jun",
          jul: "Jul",
          aug: "Aug",
          sep: "Sep",
          oct: "Oct",
          nov: "Nov",
          dec: "Dec"
        }
      },
      inputNumber: {
        decrease: "decrease number",
        increase: "increase number"
      },
      select: {
        loading: "Loading",
        noMatch: "No matching data",
        noData: "No data",
        placeholder: "Select"
      },
      dropdown: {
        toggleDropdown: "Toggle Dropdown"
      },
      cascader: {
        noMatch: "No matching data",
        loading: "Loading",
        placeholder: "Select",
        noData: "No data"
      },
      pagination: {
        goto: "Go to",
        pagesize: "/page",
        total: "Total {total}",
        pageClassifier: "",
        deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
      },
      dialog: {
        close: "Close this dialog"
      },
      drawer: {
        close: "Close this dialog"
      },
      messagebox: {
        title: "Message",
        confirm: "OK",
        cancel: "Cancel",
        error: "Illegal input",
        close: "Close this dialog"
      },
      upload: {
        deleteTip: "press delete to remove",
        delete: "Delete",
        preview: "Preview",
        continue: "Continue"
      },
      slider: {
        defaultLabel: "slider between {min} and {max}",
        defaultRangeStartLabel: "pick start value",
        defaultRangeEndLabel: "pick end value"
      },
      table: {
        emptyText: "No Data",
        confirmFilter: "Confirm",
        resetFilter: "Reset",
        clearFilter: "All",
        sumText: "Sum"
      },
      tree: {
        emptyText: "No Data"
      },
      transfer: {
        noMatch: "No matching data",
        noData: "No data",
        titles: ["List 1", "List 2"],
        filterPlaceholder: "Enter keyword",
        noCheckedFormat: "{total} items",
        hasCheckedFormat: "{checked}/{total} checked"
      },
      image: {
        error: "FAILED"
      },
      pageHeader: {
        title: "Back"
      },
      popconfirm: {
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }
    }
  };
  const buildTranslator = (locale) => (path, option) => translate(path, option, Vue.unref(locale));
  const translate = (path, option, locale) => get$2(locale, path, path).replace(/\{(\w+)\}/g, (_2, key) => {
    var _a2;
    return `${(_a2 = option == null ? void 0 : option[key]) != null ? _a2 : `{${key}}`}`;
  });
  const buildLocaleContext = (locale) => {
    const lang = Vue.computed(() => Vue.unref(locale).name);
    const localeRef = Vue.isRef(locale) ? locale : Vue.ref(locale);
    return {
      lang,
      locale: localeRef,
      t: buildTranslator(locale)
    };
  };
  const useLocale = () => {
    const locale = useGlobalConfig("locale");
    return buildLocaleContext(Vue.computed(() => locale.value || English));
  };
  const _prop = buildProp({
    type: definePropType(Boolean),
    default: null
  });
  const _event = buildProp({
    type: definePropType(Function)
  });
  const createModelToggleComposable = (name) => {
    const updateEventKey = `update:${name}`;
    const updateEventKeyRaw = `onUpdate:${name}`;
    const useModelToggleEmits2 = [updateEventKey];
    const useModelToggleProps2 = {
      [name]: _prop,
      [updateEventKeyRaw]: _event
    };
    const useModelToggle2 = ({
      indicator,
      toggleReason,
      shouldHideWhenRouteChanges,
      shouldProceed,
      onShow,
      onHide
    }) => {
      const instance = Vue.getCurrentInstance();
      const { emit } = instance;
      const props = instance.props;
      const hasUpdateHandler = Vue.computed(() => isFunction$1(props[updateEventKeyRaw]));
      const isModelBindingAbsent = Vue.computed(() => props[name] === null);
      const doShow = (event) => {
        if (indicator.value === true) {
          return;
        }
        indicator.value = true;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onShow)) {
          onShow(event);
        }
      };
      const doHide = (event) => {
        if (indicator.value === false) {
          return;
        }
        indicator.value = false;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onHide)) {
          onHide(event);
        }
      };
      const show = (event) => {
        if (props.disabled === true || isFunction$1(shouldProceed) && !shouldProceed())
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, true);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doShow(event);
        }
      };
      const hide = (event) => {
        if (props.disabled === true || !isClient)
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, false);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doHide(event);
        }
      };
      const onChange = (val) => {
        if (!isBoolean(val))
          return;
        if (props.disabled && val) {
          if (hasUpdateHandler.value) {
            emit(updateEventKey, false);
          }
        } else if (indicator.value !== val) {
          if (val) {
            doShow();
          } else {
            doHide();
          }
        }
      };
      const toggle = () => {
        if (indicator.value) {
          hide();
        } else {
          show();
        }
      };
      Vue.watch(() => props[name], onChange);
      if (shouldHideWhenRouteChanges && instance.appContext.config.globalProperties.$route !== void 0) {
        Vue.watch(() => __spreadValues({}, instance.proxy.$route), () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide();
          }
        });
      }
      Vue.onMounted(() => {
        onChange(props[name]);
      });
      return {
        hide,
        show,
        toggle,
        hasUpdateHandler
      };
    };
    return {
      useModelToggle: useModelToggle2,
      useModelToggleProps: useModelToggleProps2,
      useModelToggleEmits: useModelToggleEmits2
    };
  };
  var E$1 = "top", R = "bottom", W = "right", P$1 = "left", me = "auto", G = [E$1, R, W, P$1], U$1 = "start", J = "end", Xe = "clippingParents", je = "viewport", K = "popper", Ye = "reference", De = G.reduce(function(t, e) {
    return t.concat([e + "-" + U$1, e + "-" + J]);
  }, []), Ee = [].concat(G, [me]).reduce(function(t, e) {
    return t.concat([e, e + "-" + U$1, e + "-" + J]);
  }, []), Ge = "beforeRead", Je = "read", Ke = "afterRead", Qe = "beforeMain", Ze = "main", et = "afterMain", tt = "beforeWrite", nt = "write", rt = "afterWrite", ot = [Ge, Je, Ke, Qe, Ze, et, tt, nt, rt];
  function C(t) {
    return t ? (t.nodeName || "").toLowerCase() : null;
  }
  function H(t) {
    if (t == null)
      return window;
    if (t.toString() !== "[object Window]") {
      var e = t.ownerDocument;
      return e && e.defaultView || window;
    }
    return t;
  }
  function Q(t) {
    var e = H(t).Element;
    return t instanceof e || t instanceof Element;
  }
  function B(t) {
    var e = H(t).HTMLElement;
    return t instanceof e || t instanceof HTMLElement;
  }
  function Pe(t) {
    if (typeof ShadowRoot == "undefined")
      return false;
    var e = H(t).ShadowRoot;
    return t instanceof e || t instanceof ShadowRoot;
  }
  function Mt(t) {
    var e = t.state;
    Object.keys(e.elements).forEach(function(n) {
      var r = e.styles[n] || {}, o2 = e.attributes[n] || {}, i = e.elements[n];
      !B(i) || !C(i) || (Object.assign(i.style, r), Object.keys(o2).forEach(function(a2) {
        var s2 = o2[a2];
        s2 === false ? i.removeAttribute(a2) : i.setAttribute(a2, s2 === true ? "" : s2);
      }));
    });
  }
  function Rt(t) {
    var e = t.state, n = { popper: { position: e.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
    return Object.assign(e.elements.popper.style, n.popper), e.styles = n, e.elements.arrow && Object.assign(e.elements.arrow.style, n.arrow), function() {
      Object.keys(e.elements).forEach(function(r) {
        var o2 = e.elements[r], i = e.attributes[r] || {}, a2 = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : n[r]), s2 = a2.reduce(function(f2, c2) {
          return f2[c2] = "", f2;
        }, {});
        !B(o2) || !C(o2) || (Object.assign(o2.style, s2), Object.keys(i).forEach(function(f2) {
          o2.removeAttribute(f2);
        }));
      });
    };
  }
  var Ae = { name: "applyStyles", enabled: true, phase: "write", fn: Mt, effect: Rt, requires: ["computeStyles"] };
  function q(t) {
    return t.split("-")[0];
  }
  var X$1 = Math.max, ve = Math.min, Z = Math.round;
  function ee(t, e) {
    e === void 0 && (e = false);
    var n = t.getBoundingClientRect(), r = 1, o2 = 1;
    if (B(t) && e) {
      var i = t.offsetHeight, a2 = t.offsetWidth;
      a2 > 0 && (r = Z(n.width) / a2 || 1), i > 0 && (o2 = Z(n.height) / i || 1);
    }
    return { width: n.width / r, height: n.height / o2, top: n.top / o2, right: n.right / r, bottom: n.bottom / o2, left: n.left / r, x: n.left / r, y: n.top / o2 };
  }
  function ke(t) {
    var e = ee(t), n = t.offsetWidth, r = t.offsetHeight;
    return Math.abs(e.width - n) <= 1 && (n = e.width), Math.abs(e.height - r) <= 1 && (r = e.height), { x: t.offsetLeft, y: t.offsetTop, width: n, height: r };
  }
  function it(t, e) {
    var n = e.getRootNode && e.getRootNode();
    if (t.contains(e))
      return true;
    if (n && Pe(n)) {
      var r = e;
      do {
        if (r && t.isSameNode(r))
          return true;
        r = r.parentNode || r.host;
      } while (r);
    }
    return false;
  }
  function N$1(t) {
    return H(t).getComputedStyle(t);
  }
  function Wt(t) {
    return ["table", "td", "th"].indexOf(C(t)) >= 0;
  }
  function I$1(t) {
    return ((Q(t) ? t.ownerDocument : t.document) || window.document).documentElement;
  }
  function ge(t) {
    return C(t) === "html" ? t : t.assignedSlot || t.parentNode || (Pe(t) ? t.host : null) || I$1(t);
  }
  function at(t) {
    return !B(t) || N$1(t).position === "fixed" ? null : t.offsetParent;
  }
  function Bt(t) {
    var e = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, n = navigator.userAgent.indexOf("Trident") !== -1;
    if (n && B(t)) {
      var r = N$1(t);
      if (r.position === "fixed")
        return null;
    }
    var o2 = ge(t);
    for (Pe(o2) && (o2 = o2.host); B(o2) && ["html", "body"].indexOf(C(o2)) < 0; ) {
      var i = N$1(o2);
      if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !== -1 || e && i.willChange === "filter" || e && i.filter && i.filter !== "none")
        return o2;
      o2 = o2.parentNode;
    }
    return null;
  }
  function se(t) {
    for (var e = H(t), n = at(t); n && Wt(n) && N$1(n).position === "static"; )
      n = at(n);
    return n && (C(n) === "html" || C(n) === "body" && N$1(n).position === "static") ? e : n || Bt(t) || e;
  }
  function Le(t) {
    return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
  }
  function fe(t, e, n) {
    return X$1(t, ve(e, n));
  }
  function St(t, e, n) {
    var r = fe(t, e, n);
    return r > n ? n : r;
  }
  function st() {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  function ft(t) {
    return Object.assign({}, st(), t);
  }
  function ct(t, e) {
    return e.reduce(function(n, r) {
      return n[r] = t, n;
    }, {});
  }
  var Tt = function(t, e) {
    return t = typeof t == "function" ? t(Object.assign({}, e.rects, { placement: e.placement })) : t, ft(typeof t != "number" ? t : ct(t, G));
  };
  function Ht(t) {
    var e, n = t.state, r = t.name, o2 = t.options, i = n.elements.arrow, a2 = n.modifiersData.popperOffsets, s2 = q(n.placement), f2 = Le(s2), c2 = [P$1, W].indexOf(s2) >= 0, u2 = c2 ? "height" : "width";
    if (!(!i || !a2)) {
      var m2 = Tt(o2.padding, n), v2 = ke(i), l2 = f2 === "y" ? E$1 : P$1, h2 = f2 === "y" ? R : W, p2 = n.rects.reference[u2] + n.rects.reference[f2] - a2[f2] - n.rects.popper[u2], g = a2[f2] - n.rects.reference[f2], x2 = se(i), y = x2 ? f2 === "y" ? x2.clientHeight || 0 : x2.clientWidth || 0 : 0, $ = p2 / 2 - g / 2, d2 = m2[l2], b2 = y - v2[u2] - m2[h2], w2 = y / 2 - v2[u2] / 2 + $, O2 = fe(d2, w2, b2), j = f2;
      n.modifiersData[r] = (e = {}, e[j] = O2, e.centerOffset = O2 - w2, e);
    }
  }
  function Ct(t) {
    var e = t.state, n = t.options, r = n.element, o2 = r === void 0 ? "[data-popper-arrow]" : r;
    o2 != null && (typeof o2 == "string" && (o2 = e.elements.popper.querySelector(o2), !o2) || !it(e.elements.popper, o2) || (e.elements.arrow = o2));
  }
  var pt = { name: "arrow", enabled: true, phase: "main", fn: Ht, effect: Ct, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] };
  function te(t) {
    return t.split("-")[1];
  }
  var qt = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  function Vt(t) {
    var e = t.x, n = t.y, r = window, o2 = r.devicePixelRatio || 1;
    return { x: Z(e * o2) / o2 || 0, y: Z(n * o2) / o2 || 0 };
  }
  function ut(t) {
    var e, n = t.popper, r = t.popperRect, o2 = t.placement, i = t.variation, a2 = t.offsets, s2 = t.position, f2 = t.gpuAcceleration, c2 = t.adaptive, u2 = t.roundOffsets, m2 = t.isFixed, v2 = a2.x, l2 = v2 === void 0 ? 0 : v2, h2 = a2.y, p2 = h2 === void 0 ? 0 : h2, g = typeof u2 == "function" ? u2({ x: l2, y: p2 }) : { x: l2, y: p2 };
    l2 = g.x, p2 = g.y;
    var x2 = a2.hasOwnProperty("x"), y = a2.hasOwnProperty("y"), $ = P$1, d2 = E$1, b2 = window;
    if (c2) {
      var w2 = se(n), O2 = "clientHeight", j = "clientWidth";
      if (w2 === H(n) && (w2 = I$1(n), N$1(w2).position !== "static" && s2 === "absolute" && (O2 = "scrollHeight", j = "scrollWidth")), w2 = w2, o2 === E$1 || (o2 === P$1 || o2 === W) && i === J) {
        d2 = R;
        var A2 = m2 && w2 === b2 && b2.visualViewport ? b2.visualViewport.height : w2[O2];
        p2 -= A2 - r.height, p2 *= f2 ? 1 : -1;
      }
      if (o2 === P$1 || (o2 === E$1 || o2 === R) && i === J) {
        $ = W;
        var k = m2 && w2 === b2 && b2.visualViewport ? b2.visualViewport.width : w2[j];
        l2 -= k - r.width, l2 *= f2 ? 1 : -1;
      }
    }
    var D2 = Object.assign({ position: s2 }, c2 && qt), S2 = u2 === true ? Vt({ x: l2, y: p2 }) : { x: l2, y: p2 };
    if (l2 = S2.x, p2 = S2.y, f2) {
      var L;
      return Object.assign({}, D2, (L = {}, L[d2] = y ? "0" : "", L[$] = x2 ? "0" : "", L.transform = (b2.devicePixelRatio || 1) <= 1 ? "translate(" + l2 + "px, " + p2 + "px)" : "translate3d(" + l2 + "px, " + p2 + "px, 0)", L));
    }
    return Object.assign({}, D2, (e = {}, e[d2] = y ? p2 + "px" : "", e[$] = x2 ? l2 + "px" : "", e.transform = "", e));
  }
  function Nt(t) {
    var e = t.state, n = t.options, r = n.gpuAcceleration, o2 = r === void 0 ? true : r, i = n.adaptive, a2 = i === void 0 ? true : i, s2 = n.roundOffsets, f2 = s2 === void 0 ? true : s2, c2 = { placement: q(e.placement), variation: te(e.placement), popper: e.elements.popper, popperRect: e.rects.popper, gpuAcceleration: o2, isFixed: e.options.strategy === "fixed" };
    e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, ut(Object.assign({}, c2, { offsets: e.modifiersData.popperOffsets, position: e.options.strategy, adaptive: a2, roundOffsets: f2 })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, ut(Object.assign({}, c2, { offsets: e.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: f2 })))), e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-placement": e.placement });
  }
  var Me = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: Nt, data: {} }, ye = { passive: true };
  function It(t) {
    var e = t.state, n = t.instance, r = t.options, o2 = r.scroll, i = o2 === void 0 ? true : o2, a2 = r.resize, s2 = a2 === void 0 ? true : a2, f2 = H(e.elements.popper), c2 = [].concat(e.scrollParents.reference, e.scrollParents.popper);
    return i && c2.forEach(function(u2) {
      u2.addEventListener("scroll", n.update, ye);
    }), s2 && f2.addEventListener("resize", n.update, ye), function() {
      i && c2.forEach(function(u2) {
        u2.removeEventListener("scroll", n.update, ye);
      }), s2 && f2.removeEventListener("resize", n.update, ye);
    };
  }
  var Re = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
  }, effect: It, data: {} }, _t = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function be(t) {
    return t.replace(/left|right|bottom|top/g, function(e) {
      return _t[e];
    });
  }
  var zt = { start: "end", end: "start" };
  function lt(t) {
    return t.replace(/start|end/g, function(e) {
      return zt[e];
    });
  }
  function We(t) {
    var e = H(t), n = e.pageXOffset, r = e.pageYOffset;
    return { scrollLeft: n, scrollTop: r };
  }
  function Be(t) {
    return ee(I$1(t)).left + We(t).scrollLeft;
  }
  function Ft(t) {
    var e = H(t), n = I$1(t), r = e.visualViewport, o2 = n.clientWidth, i = n.clientHeight, a2 = 0, s2 = 0;
    return r && (o2 = r.width, i = r.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (a2 = r.offsetLeft, s2 = r.offsetTop)), { width: o2, height: i, x: a2 + Be(t), y: s2 };
  }
  function Ut(t) {
    var e, n = I$1(t), r = We(t), o2 = (e = t.ownerDocument) == null ? void 0 : e.body, i = X$1(n.scrollWidth, n.clientWidth, o2 ? o2.scrollWidth : 0, o2 ? o2.clientWidth : 0), a2 = X$1(n.scrollHeight, n.clientHeight, o2 ? o2.scrollHeight : 0, o2 ? o2.clientHeight : 0), s2 = -r.scrollLeft + Be(t), f2 = -r.scrollTop;
    return N$1(o2 || n).direction === "rtl" && (s2 += X$1(n.clientWidth, o2 ? o2.clientWidth : 0) - i), { width: i, height: a2, x: s2, y: f2 };
  }
  function Se(t) {
    var e = N$1(t), n = e.overflow, r = e.overflowX, o2 = e.overflowY;
    return /auto|scroll|overlay|hidden/.test(n + o2 + r);
  }
  function dt(t) {
    return ["html", "body", "#document"].indexOf(C(t)) >= 0 ? t.ownerDocument.body : B(t) && Se(t) ? t : dt(ge(t));
  }
  function ce(t, e) {
    var n;
    e === void 0 && (e = []);
    var r = dt(t), o2 = r === ((n = t.ownerDocument) == null ? void 0 : n.body), i = H(r), a2 = o2 ? [i].concat(i.visualViewport || [], Se(r) ? r : []) : r, s2 = e.concat(a2);
    return o2 ? s2 : s2.concat(ce(ge(a2)));
  }
  function Te(t) {
    return Object.assign({}, t, { left: t.x, top: t.y, right: t.x + t.width, bottom: t.y + t.height });
  }
  function Xt(t) {
    var e = ee(t);
    return e.top = e.top + t.clientTop, e.left = e.left + t.clientLeft, e.bottom = e.top + t.clientHeight, e.right = e.left + t.clientWidth, e.width = t.clientWidth, e.height = t.clientHeight, e.x = e.left, e.y = e.top, e;
  }
  function ht(t, e) {
    return e === je ? Te(Ft(t)) : Q(e) ? Xt(e) : Te(Ut(I$1(t)));
  }
  function Yt(t) {
    var e = ce(ge(t)), n = ["absolute", "fixed"].indexOf(N$1(t).position) >= 0, r = n && B(t) ? se(t) : t;
    return Q(r) ? e.filter(function(o2) {
      return Q(o2) && it(o2, r) && C(o2) !== "body";
    }) : [];
  }
  function Gt(t, e, n) {
    var r = e === "clippingParents" ? Yt(t) : [].concat(e), o2 = [].concat(r, [n]), i = o2[0], a2 = o2.reduce(function(s2, f2) {
      var c2 = ht(t, f2);
      return s2.top = X$1(c2.top, s2.top), s2.right = ve(c2.right, s2.right), s2.bottom = ve(c2.bottom, s2.bottom), s2.left = X$1(c2.left, s2.left), s2;
    }, ht(t, i));
    return a2.width = a2.right - a2.left, a2.height = a2.bottom - a2.top, a2.x = a2.left, a2.y = a2.top, a2;
  }
  function mt(t) {
    var e = t.reference, n = t.element, r = t.placement, o2 = r ? q(r) : null, i = r ? te(r) : null, a2 = e.x + e.width / 2 - n.width / 2, s2 = e.y + e.height / 2 - n.height / 2, f2;
    switch (o2) {
      case E$1:
        f2 = { x: a2, y: e.y - n.height };
        break;
      case R:
        f2 = { x: a2, y: e.y + e.height };
        break;
      case W:
        f2 = { x: e.x + e.width, y: s2 };
        break;
      case P$1:
        f2 = { x: e.x - n.width, y: s2 };
        break;
      default:
        f2 = { x: e.x, y: e.y };
    }
    var c2 = o2 ? Le(o2) : null;
    if (c2 != null) {
      var u2 = c2 === "y" ? "height" : "width";
      switch (i) {
        case U$1:
          f2[c2] = f2[c2] - (e[u2] / 2 - n[u2] / 2);
          break;
        case J:
          f2[c2] = f2[c2] + (e[u2] / 2 - n[u2] / 2);
          break;
      }
    }
    return f2;
  }
  function ne(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o2 = r === void 0 ? t.placement : r, i = n.boundary, a2 = i === void 0 ? Xe : i, s2 = n.rootBoundary, f2 = s2 === void 0 ? je : s2, c2 = n.elementContext, u2 = c2 === void 0 ? K : c2, m2 = n.altBoundary, v2 = m2 === void 0 ? false : m2, l2 = n.padding, h2 = l2 === void 0 ? 0 : l2, p2 = ft(typeof h2 != "number" ? h2 : ct(h2, G)), g = u2 === K ? Ye : K, x2 = t.rects.popper, y = t.elements[v2 ? g : u2], $ = Gt(Q(y) ? y : y.contextElement || I$1(t.elements.popper), a2, f2), d2 = ee(t.elements.reference), b2 = mt({ reference: d2, element: x2, strategy: "absolute", placement: o2 }), w2 = Te(Object.assign({}, x2, b2)), O2 = u2 === K ? w2 : d2, j = { top: $.top - O2.top + p2.top, bottom: O2.bottom - $.bottom + p2.bottom, left: $.left - O2.left + p2.left, right: O2.right - $.right + p2.right }, A2 = t.modifiersData.offset;
    if (u2 === K && A2) {
      var k = A2[o2];
      Object.keys(j).forEach(function(D2) {
        var S2 = [W, R].indexOf(D2) >= 0 ? 1 : -1, L = [E$1, R].indexOf(D2) >= 0 ? "y" : "x";
        j[D2] += k[L] * S2;
      });
    }
    return j;
  }
  function Jt(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o2 = n.boundary, i = n.rootBoundary, a2 = n.padding, s2 = n.flipVariations, f2 = n.allowedAutoPlacements, c2 = f2 === void 0 ? Ee : f2, u2 = te(r), m2 = u2 ? s2 ? De : De.filter(function(h2) {
      return te(h2) === u2;
    }) : G, v2 = m2.filter(function(h2) {
      return c2.indexOf(h2) >= 0;
    });
    v2.length === 0 && (v2 = m2);
    var l2 = v2.reduce(function(h2, p2) {
      return h2[p2] = ne(t, { placement: p2, boundary: o2, rootBoundary: i, padding: a2 })[q(p2)], h2;
    }, {});
    return Object.keys(l2).sort(function(h2, p2) {
      return l2[h2] - l2[p2];
    });
  }
  function Kt(t) {
    if (q(t) === me)
      return [];
    var e = be(t);
    return [lt(t), e, lt(e)];
  }
  function Qt(t) {
    var e = t.state, n = t.options, r = t.name;
    if (!e.modifiersData[r]._skip) {
      for (var o2 = n.mainAxis, i = o2 === void 0 ? true : o2, a2 = n.altAxis, s2 = a2 === void 0 ? true : a2, f2 = n.fallbackPlacements, c2 = n.padding, u2 = n.boundary, m2 = n.rootBoundary, v2 = n.altBoundary, l2 = n.flipVariations, h2 = l2 === void 0 ? true : l2, p2 = n.allowedAutoPlacements, g = e.options.placement, x2 = q(g), y = x2 === g, $ = f2 || (y || !h2 ? [be(g)] : Kt(g)), d2 = [g].concat($).reduce(function(z, V) {
        return z.concat(q(V) === me ? Jt(e, { placement: V, boundary: u2, rootBoundary: m2, padding: c2, flipVariations: h2, allowedAutoPlacements: p2 }) : V);
      }, []), b2 = e.rects.reference, w2 = e.rects.popper, O2 = /* @__PURE__ */ new Map(), j = true, A2 = d2[0], k = 0; k < d2.length; k++) {
        var D2 = d2[k], S2 = q(D2), L = te(D2) === U$1, re = [E$1, R].indexOf(S2) >= 0, oe = re ? "width" : "height", M2 = ne(e, { placement: D2, boundary: u2, rootBoundary: m2, altBoundary: v2, padding: c2 }), T2 = re ? L ? W : P$1 : L ? R : E$1;
        b2[oe] > w2[oe] && (T2 = be(T2));
        var pe = be(T2), _2 = [];
        if (i && _2.push(M2[S2] <= 0), s2 && _2.push(M2[T2] <= 0, M2[pe] <= 0), _2.every(function(z) {
          return z;
        })) {
          A2 = D2, j = false;
          break;
        }
        O2.set(D2, _2);
      }
      if (j)
        for (var ue = h2 ? 3 : 1, xe = function(z) {
          var V = d2.find(function(de) {
            var ae = O2.get(de);
            if (ae)
              return ae.slice(0, z).every(function(Y2) {
                return Y2;
              });
          });
          if (V)
            return A2 = V, "break";
        }, ie = ue; ie > 0; ie--) {
          var le = xe(ie);
          if (le === "break")
            break;
        }
      e.placement !== A2 && (e.modifiersData[r]._skip = true, e.placement = A2, e.reset = true);
    }
  }
  var vt = { name: "flip", enabled: true, phase: "main", fn: Qt, requiresIfExists: ["offset"], data: { _skip: false } };
  function gt(t, e, n) {
    return n === void 0 && (n = { x: 0, y: 0 }), { top: t.top - e.height - n.y, right: t.right - e.width + n.x, bottom: t.bottom - e.height + n.y, left: t.left - e.width - n.x };
  }
  function yt(t) {
    return [E$1, W, R, P$1].some(function(e) {
      return t[e] >= 0;
    });
  }
  function Zt(t) {
    var e = t.state, n = t.name, r = e.rects.reference, o2 = e.rects.popper, i = e.modifiersData.preventOverflow, a2 = ne(e, { elementContext: "reference" }), s2 = ne(e, { altBoundary: true }), f2 = gt(a2, r), c2 = gt(s2, o2, i), u2 = yt(f2), m2 = yt(c2);
    e.modifiersData[n] = { referenceClippingOffsets: f2, popperEscapeOffsets: c2, isReferenceHidden: u2, hasPopperEscaped: m2 }, e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-reference-hidden": u2, "data-popper-escaped": m2 });
  }
  var bt = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: Zt };
  function en(t, e, n) {
    var r = q(t), o2 = [P$1, E$1].indexOf(r) >= 0 ? -1 : 1, i = typeof n == "function" ? n(Object.assign({}, e, { placement: t })) : n, a2 = i[0], s2 = i[1];
    return a2 = a2 || 0, s2 = (s2 || 0) * o2, [P$1, W].indexOf(r) >= 0 ? { x: s2, y: a2 } : { x: a2, y: s2 };
  }
  function tn(t) {
    var e = t.state, n = t.options, r = t.name, o2 = n.offset, i = o2 === void 0 ? [0, 0] : o2, a2 = Ee.reduce(function(u2, m2) {
      return u2[m2] = en(m2, e.rects, i), u2;
    }, {}), s2 = a2[e.placement], f2 = s2.x, c2 = s2.y;
    e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += f2, e.modifiersData.popperOffsets.y += c2), e.modifiersData[r] = a2;
  }
  var wt = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: tn };
  function nn(t) {
    var e = t.state, n = t.name;
    e.modifiersData[n] = mt({ reference: e.rects.reference, element: e.rects.popper, strategy: "absolute", placement: e.placement });
  }
  var He = { name: "popperOffsets", enabled: true, phase: "read", fn: nn, data: {} };
  function rn(t) {
    return t === "x" ? "y" : "x";
  }
  function on(t) {
    var e = t.state, n = t.options, r = t.name, o2 = n.mainAxis, i = o2 === void 0 ? true : o2, a2 = n.altAxis, s2 = a2 === void 0 ? false : a2, f2 = n.boundary, c2 = n.rootBoundary, u2 = n.altBoundary, m2 = n.padding, v2 = n.tether, l2 = v2 === void 0 ? true : v2, h2 = n.tetherOffset, p2 = h2 === void 0 ? 0 : h2, g = ne(e, { boundary: f2, rootBoundary: c2, padding: m2, altBoundary: u2 }), x2 = q(e.placement), y = te(e.placement), $ = !y, d2 = Le(x2), b2 = rn(d2), w2 = e.modifiersData.popperOffsets, O2 = e.rects.reference, j = e.rects.popper, A2 = typeof p2 == "function" ? p2(Object.assign({}, e.rects, { placement: e.placement })) : p2, k = typeof A2 == "number" ? { mainAxis: A2, altAxis: A2 } : Object.assign({ mainAxis: 0, altAxis: 0 }, A2), D2 = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, S2 = { x: 0, y: 0 };
    if (w2) {
      if (i) {
        var L, re = d2 === "y" ? E$1 : P$1, oe = d2 === "y" ? R : W, M2 = d2 === "y" ? "height" : "width", T2 = w2[d2], pe = T2 + g[re], _2 = T2 - g[oe], ue = l2 ? -j[M2] / 2 : 0, xe = y === U$1 ? O2[M2] : j[M2], ie = y === U$1 ? -j[M2] : -O2[M2], le = e.elements.arrow, z = l2 && le ? ke(le) : { width: 0, height: 0 }, V = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : st(), de = V[re], ae = V[oe], Y2 = fe(0, O2[M2], z[M2]), jt = $ ? O2[M2] / 2 - ue - Y2 - de - k.mainAxis : xe - Y2 - de - k.mainAxis, Dt = $ ? -O2[M2] / 2 + ue + Y2 + ae + k.mainAxis : ie + Y2 + ae + k.mainAxis, Oe = e.elements.arrow && se(e.elements.arrow), Et = Oe ? d2 === "y" ? Oe.clientTop || 0 : Oe.clientLeft || 0 : 0, Ce = (L = D2 == null ? void 0 : D2[d2]) != null ? L : 0, Pt = T2 + jt - Ce - Et, At = T2 + Dt - Ce, qe = fe(l2 ? ve(pe, Pt) : pe, T2, l2 ? X$1(_2, At) : _2);
        w2[d2] = qe, S2[d2] = qe - T2;
      }
      if (s2) {
        var Ve, kt = d2 === "x" ? E$1 : P$1, Lt = d2 === "x" ? R : W, F2 = w2[b2], he = b2 === "y" ? "height" : "width", Ne = F2 + g[kt], Ie = F2 - g[Lt], $e = [E$1, P$1].indexOf(x2) !== -1, _e = (Ve = D2 == null ? void 0 : D2[b2]) != null ? Ve : 0, ze = $e ? Ne : F2 - O2[he] - j[he] - _e + k.altAxis, Fe = $e ? F2 + O2[he] + j[he] - _e - k.altAxis : Ie, Ue = l2 && $e ? St(ze, F2, Fe) : fe(l2 ? ze : Ne, F2, l2 ? Fe : Ie);
        w2[b2] = Ue, S2[b2] = Ue - F2;
      }
      e.modifiersData[r] = S2;
    }
  }
  var xt = { name: "preventOverflow", enabled: true, phase: "main", fn: on, requiresIfExists: ["offset"] };
  function an(t) {
    return { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
  }
  function sn(t) {
    return t === H(t) || !B(t) ? We(t) : an(t);
  }
  function fn(t) {
    var e = t.getBoundingClientRect(), n = Z(e.width) / t.offsetWidth || 1, r = Z(e.height) / t.offsetHeight || 1;
    return n !== 1 || r !== 1;
  }
  function cn(t, e, n) {
    n === void 0 && (n = false);
    var r = B(e), o2 = B(e) && fn(e), i = I$1(e), a2 = ee(t, o2), s2 = { scrollLeft: 0, scrollTop: 0 }, f2 = { x: 0, y: 0 };
    return (r || !r && !n) && ((C(e) !== "body" || Se(i)) && (s2 = sn(e)), B(e) ? (f2 = ee(e, true), f2.x += e.clientLeft, f2.y += e.clientTop) : i && (f2.x = Be(i))), { x: a2.left + s2.scrollLeft - f2.x, y: a2.top + s2.scrollTop - f2.y, width: a2.width, height: a2.height };
  }
  function pn(t) {
    var e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), r = [];
    t.forEach(function(i) {
      e.set(i.name, i);
    });
    function o2(i) {
      n.add(i.name);
      var a2 = [].concat(i.requires || [], i.requiresIfExists || []);
      a2.forEach(function(s2) {
        if (!n.has(s2)) {
          var f2 = e.get(s2);
          f2 && o2(f2);
        }
      }), r.push(i);
    }
    return t.forEach(function(i) {
      n.has(i.name) || o2(i);
    }), r;
  }
  function un(t) {
    var e = pn(t);
    return ot.reduce(function(n, r) {
      return n.concat(e.filter(function(o2) {
        return o2.phase === r;
      }));
    }, []);
  }
  function ln(t) {
    var e;
    return function() {
      return e || (e = new Promise(function(n) {
        Promise.resolve().then(function() {
          e = void 0, n(t());
        });
      })), e;
    };
  }
  function dn(t) {
    var e = t.reduce(function(n, r) {
      var o2 = n[r.name];
      return n[r.name] = o2 ? Object.assign({}, o2, r, { options: Object.assign({}, o2.options, r.options), data: Object.assign({}, o2.data, r.data) }) : r, n;
    }, {});
    return Object.keys(e).map(function(n) {
      return e[n];
    });
  }
  var Ot = { placement: "bottom", modifiers: [], strategy: "absolute" };
  function $t() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return !e.some(function(r) {
      return !(r && typeof r.getBoundingClientRect == "function");
    });
  }
  function we(t) {
    t === void 0 && (t = {});
    var e = t, n = e.defaultModifiers, r = n === void 0 ? [] : n, o2 = e.defaultOptions, i = o2 === void 0 ? Ot : o2;
    return function(a2, s2, f2) {
      f2 === void 0 && (f2 = i);
      var c2 = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, Ot, i), modifiersData: {}, elements: { reference: a2, popper: s2 }, attributes: {}, styles: {} }, u2 = [], m2 = false, v2 = { state: c2, setOptions: function(p2) {
        var g = typeof p2 == "function" ? p2(c2.options) : p2;
        h2(), c2.options = Object.assign({}, i, c2.options, g), c2.scrollParents = { reference: Q(a2) ? ce(a2) : a2.contextElement ? ce(a2.contextElement) : [], popper: ce(s2) };
        var x2 = un(dn([].concat(r, c2.options.modifiers)));
        return c2.orderedModifiers = x2.filter(function(y) {
          return y.enabled;
        }), l2(), v2.update();
      }, forceUpdate: function() {
        if (!m2) {
          var p2 = c2.elements, g = p2.reference, x2 = p2.popper;
          if ($t(g, x2)) {
            c2.rects = { reference: cn(g, se(x2), c2.options.strategy === "fixed"), popper: ke(x2) }, c2.reset = false, c2.placement = c2.options.placement, c2.orderedModifiers.forEach(function(j) {
              return c2.modifiersData[j.name] = Object.assign({}, j.data);
            });
            for (var y = 0; y < c2.orderedModifiers.length; y++) {
              if (c2.reset === true) {
                c2.reset = false, y = -1;
                continue;
              }
              var $ = c2.orderedModifiers[y], d2 = $.fn, b2 = $.options, w2 = b2 === void 0 ? {} : b2, O2 = $.name;
              typeof d2 == "function" && (c2 = d2({ state: c2, options: w2, name: O2, instance: v2 }) || c2);
            }
          }
        }
      }, update: ln(function() {
        return new Promise(function(p2) {
          v2.forceUpdate(), p2(c2);
        });
      }), destroy: function() {
        h2(), m2 = true;
      } };
      if (!$t(a2, s2))
        return v2;
      v2.setOptions(f2).then(function(p2) {
        !m2 && f2.onFirstUpdate && f2.onFirstUpdate(p2);
      });
      function l2() {
        c2.orderedModifiers.forEach(function(p2) {
          var g = p2.name, x2 = p2.options, y = x2 === void 0 ? {} : x2, $ = p2.effect;
          if (typeof $ == "function") {
            var d2 = $({ state: c2, name: g, instance: v2, options: y }), b2 = function() {
            };
            u2.push(d2 || b2);
          }
        });
      }
      function h2() {
        u2.forEach(function(p2) {
          return p2();
        }), u2 = [];
      }
      return v2;
    };
  }
  we();
  var mn = [Re, He, Me, Ae];
  we({ defaultModifiers: mn });
  var gn = [Re, He, Me, Ae, wt, vt, xt, pt, bt], yn = we({ defaultModifiers: gn });
  function useTimeout() {
    let timeoutHandle;
    const registerTimeout = (fn2, delay) => {
      cancelTimeout();
      timeoutHandle = window.setTimeout(fn2, delay);
    };
    const cancelTimeout = () => window.clearTimeout(timeoutHandle);
    tryOnScopeDispose(() => cancelTimeout());
    return {
      registerTimeout,
      cancelTimeout
    };
  }
  let registeredEscapeHandlers = [];
  const cachedHandler = (e) => {
    const event = e;
    if (event.key === EVENT_CODE.esc) {
      registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event));
    }
  };
  const useEscapeKeydown = (handler) => {
    Vue.onMounted(() => {
      if (registeredEscapeHandlers.length === 0) {
        document.addEventListener("keydown", cachedHandler);
      }
      if (isClient)
        registeredEscapeHandlers.push(handler);
    });
    Vue.onBeforeUnmount(() => {
      registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
      if (registeredEscapeHandlers.length === 0) {
        if (isClient)
          document.removeEventListener("keydown", cachedHandler);
      }
    });
  };
  let cachedContainer;
  const usePopperContainerId = () => {
    const namespace = useGlobalConfig("namespace", defaultNamespace);
    const idInjection = useIdInjection();
    const id = Vue.computed(() => {
      return `${namespace.value}-popper-container-${idInjection.prefix}`;
    });
    const selector = Vue.computed(() => `#${id.value}`);
    return {
      id,
      selector
    };
  };
  const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
  };
  const usePopperContainer = () => {
    Vue.onBeforeMount(() => {
      if (!isClient)
        return;
      const { id, selector } = usePopperContainerId();
      if (!cachedContainer && !document.body.querySelector(selector.value)) {
        cachedContainer = createContainer(id.value);
      }
    });
  };
  const useDelayedToggleProps = buildProps({
    showAfter: {
      type: Number,
      default: 0
    },
    hideAfter: {
      type: Number,
      default: 200
    }
  });
  const useDelayedToggle = ({
    showAfter,
    hideAfter,
    open,
    close
  }) => {
    const { registerTimeout } = useTimeout();
    const onOpen = (event) => {
      registerTimeout(() => {
        open(event);
      }, Vue.unref(showAfter));
    };
    const onClose = (event) => {
      registerTimeout(() => {
        close(event);
      }, Vue.unref(hideAfter));
    };
    return {
      onOpen,
      onClose
    };
  };
  const FORWARD_REF_INJECTION_KEY = Symbol("elForwardRef");
  const useForwardRef = (forwardRef) => {
    const setForwardRef = (el) => {
      forwardRef.value = el;
    };
    Vue.provide(FORWARD_REF_INJECTION_KEY, {
      setForwardRef
    });
  };
  const useForwardRefDirective = (setForwardRef) => {
    return {
      mounted(el) {
        setForwardRef(el);
      },
      updated(el) {
        setForwardRef(el);
      },
      unmounted() {
        setForwardRef(null);
      }
    };
  };
  const zIndex = Vue.ref(0);
  const useZIndex = () => {
    const initialZIndex = useGlobalConfig("zIndex", 2e3);
    const currentZIndex = Vue.computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
      zIndex.value++;
      return currentZIndex.value;
    };
    return {
      initialZIndex,
      currentZIndex,
      nextZIndex
    };
  };
  function useCursor(input) {
    const selectionRef = Vue.ref();
    function recordCursor() {
      if (input.value == void 0)
        return;
      const { selectionStart, selectionEnd, value } = input.value;
      if (selectionStart == null || selectionEnd == null)
        return;
      const beforeTxt = value.slice(0, Math.max(0, selectionStart));
      const afterTxt = value.slice(Math.max(0, selectionEnd));
      selectionRef.value = {
        selectionStart,
        selectionEnd,
        value,
        beforeTxt,
        afterTxt
      };
    }
    function setCursor() {
      if (input.value == void 0 || selectionRef.value == void 0)
        return;
      const { value } = input.value;
      const { beforeTxt, afterTxt, selectionStart } = selectionRef.value;
      if (beforeTxt == void 0 || afterTxt == void 0 || selectionStart == void 0)
        return;
      let startPos = value.length;
      if (value.endsWith(afterTxt)) {
        startPos = value.length - afterTxt.length;
      } else if (value.startsWith(beforeTxt)) {
        startPos = beforeTxt.length;
      } else {
        const beforeLastChar = beforeTxt[selectionStart - 1];
        const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
        if (newIndex !== -1) {
          startPos = newIndex + 1;
        }
      }
      input.value.setSelectionRange(startPos, startPos);
    }
    return [recordCursor, setCursor];
  }
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const iconProps = buildProps({
    size: {
      type: definePropType([Number, String])
    },
    color: {
      type: String
    }
  });
  const __default__$k = Vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$p = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$k), {
    props: iconProps,
    setup(__props) {
      const props = __props;
      const ns2 = useNamespace("icon");
      const style2 = Vue.computed(() => {
        const { size: size2, color } = props;
        if (!size2 && !color)
          return {};
        return {
          fontSize: isUndefined(size2) ? void 0 : addUnit(size2),
          "--color": color
        };
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("i", Vue.mergeProps({
          class: Vue.unref(ns2).b(),
          style: Vue.unref(style2)
        }, _ctx.$attrs), [
          Vue.renderSlot(_ctx.$slots, "default")
        ], 16);
      };
    }
  }));
  var Icon = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/icon/src/icon.vue"]]);
  const ElIcon = withInstall(Icon);
  const alertEffects = ["light", "dark"];
  const alertProps = buildProps({
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      values: keysOf(TypeComponentsMap),
      default: "info"
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ""
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      values: alertEffects,
      default: "light"
    }
  });
  const alertEmits = {
    close: (evt) => evt instanceof MouseEvent
  };
  const __default__$j = Vue.defineComponent({
    name: "ElAlert"
  });
  const _sfc_main$o = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$j), {
    props: alertProps,
    emits: alertEmits,
    setup(__props, { emit }) {
      const props = __props;
      const { Close } = TypeComponents;
      const slots = Vue.useSlots();
      const ns2 = useNamespace("alert");
      const visible = Vue.ref(true);
      const iconComponent = Vue.computed(() => TypeComponentsMap[props.type]);
      const iconClass = Vue.computed(() => [
        ns2.e("icon"),
        { [ns2.is("big")]: !!props.description || !!slots.default }
      ]);
      const isBoldTitle = Vue.computed(() => {
        return { [ns2.is("bold")]: props.description || slots.default };
      });
      const close = (evt) => {
        visible.value = false;
        emit("close", evt);
      };
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createBlock(Vue.Transition, {
          name: Vue.unref(ns2).b("fade"),
          persisted: ""
        }, {
          default: Vue.withCtx(() => [
            Vue.withDirectives(Vue.createElementVNode("div", {
              class: Vue.normalizeClass([Vue.unref(ns2).b(), Vue.unref(ns2).m(_ctx.type), Vue.unref(ns2).is("center", _ctx.center), Vue.unref(ns2).is(_ctx.effect)]),
              role: "alert"
            }, [
              _ctx.showIcon && Vue.unref(iconComponent) ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                key: 0,
                class: Vue.normalizeClass(Vue.unref(iconClass))
              }, {
                default: Vue.withCtx(() => [
                  (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(Vue.unref(iconComponent))))
                ]),
                _: 1
              }, 8, ["class"])) : Vue.createCommentVNode("v-if", true),
              Vue.createElementVNode("div", {
                class: Vue.normalizeClass(Vue.unref(ns2).e("content"))
              }, [
                _ctx.title || _ctx.$slots.title ? (Vue.openBlock(), Vue.createElementBlock("span", {
                  key: 0,
                  class: Vue.normalizeClass([Vue.unref(ns2).e("title"), Vue.unref(isBoldTitle)])
                }, [
                  Vue.renderSlot(_ctx.$slots, "title", {}, () => [
                    Vue.createTextVNode(Vue.toDisplayString(_ctx.title), 1)
                  ])
                ], 2)) : Vue.createCommentVNode("v-if", true),
                _ctx.$slots.default || _ctx.description ? (Vue.openBlock(), Vue.createElementBlock("p", {
                  key: 1,
                  class: Vue.normalizeClass(Vue.unref(ns2).e("description"))
                }, [
                  Vue.renderSlot(_ctx.$slots, "default", {}, () => [
                    Vue.createTextVNode(Vue.toDisplayString(_ctx.description), 1)
                  ])
                ], 2)) : Vue.createCommentVNode("v-if", true),
                _ctx.closable ? (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 2 }, [
                  _ctx.closeText ? (Vue.openBlock(), Vue.createElementBlock("div", {
                    key: 0,
                    class: Vue.normalizeClass([Vue.unref(ns2).e("close-btn"), Vue.unref(ns2).is("customed")]),
                    onClick: close
                  }, Vue.toDisplayString(_ctx.closeText), 3)) : (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                    key: 1,
                    class: Vue.normalizeClass(Vue.unref(ns2).e("close-btn")),
                    onClick: close
                  }, {
                    default: Vue.withCtx(() => [
                      Vue.createVNode(Vue.unref(Close))
                    ]),
                    _: 1
                  }, 8, ["class"]))
                ], 64)) : Vue.createCommentVNode("v-if", true)
              ], 2)
            ], 2), [
              [Vue.vShow, visible.value]
            ])
          ]),
          _: 3
        }, 8, ["name"]);
      };
    }
  }));
  var Alert = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/alert/src/alert.vue"]]);
  const ElAlert = withInstall(Alert);
  let hiddenTextarea = void 0;
  const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`;
  const CONTEXT_STYLE = [
    "letter-spacing",
    "line-height",
    "padding-top",
    "padding-bottom",
    "font-family",
    "font-weight",
    "font-size",
    "text-rendering",
    "text-transform",
    "width",
    "text-indent",
    "padding-left",
    "padding-right",
    "border-width",
    "box-sizing"
  ];
  function calculateNodeStyling(targetElement) {
    const style2 = window.getComputedStyle(targetElement);
    const boxSizing = style2.getPropertyValue("box-sizing");
    const paddingSize = Number.parseFloat(style2.getPropertyValue("padding-bottom")) + Number.parseFloat(style2.getPropertyValue("padding-top"));
    const borderSize = Number.parseFloat(style2.getPropertyValue("border-bottom-width")) + Number.parseFloat(style2.getPropertyValue("border-top-width"));
    const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style2.getPropertyValue(name)}`).join(";");
    return { contextStyle, paddingSize, borderSize, boxSizing };
  }
  function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
    var _a2;
    if (!hiddenTextarea) {
      hiddenTextarea = document.createElement("textarea");
      document.body.appendChild(hiddenTextarea);
    }
    const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement);
    hiddenTextarea.setAttribute("style", `${contextStyle};${HIDDEN_STYLE}`);
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
    let height = hiddenTextarea.scrollHeight;
    const result = {};
    if (boxSizing === "border-box") {
      height = height + borderSize;
    } else if (boxSizing === "content-box") {
      height = height - paddingSize;
    }
    hiddenTextarea.value = "";
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (isNumber(minRows)) {
      let minHeight = singleRowHeight * minRows;
      if (boxSizing === "border-box") {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
      result.minHeight = `${minHeight}px`;
    }
    if (isNumber(maxRows)) {
      let maxHeight = singleRowHeight * maxRows;
      if (boxSizing === "border-box") {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      height = Math.min(maxHeight, height);
    }
    result.height = `${height}px`;
    (_a2 = hiddenTextarea.parentNode) == null ? void 0 : _a2.removeChild(hiddenTextarea);
    hiddenTextarea = void 0;
    return result;
  }
  const inputProps = buildProps({
    id: {
      type: String,
      default: void 0
    },
    size: useSizeProp,
    disabled: Boolean,
    modelValue: {
      type: definePropType([
        String,
        Number,
        Object
      ]),
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    resize: {
      type: String,
      values: ["none", "both", "horizontal", "vertical"]
    },
    autosize: {
      type: definePropType([Boolean, Object]),
      default: false
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String
    },
    form: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    suffixIcon: {
      type: iconPropType
    },
    prefixIcon: {
      type: iconPropType
    },
    containerRole: {
      type: String,
      default: void 0
    },
    label: {
      type: String,
      default: void 0
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    inputStyle: {
      type: definePropType([Object, Array, String]),
      default: () => mutable({})
    }
  });
  const inputEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isString$1(value),
    input: (value) => isString$1(value),
    change: (value) => isString$1(value),
    focus: (evt) => evt instanceof FocusEvent,
    blur: (evt) => evt instanceof FocusEvent,
    clear: () => true,
    mouseleave: (evt) => evt instanceof MouseEvent,
    mouseenter: (evt) => evt instanceof MouseEvent,
    keydown: (evt) => evt instanceof Event,
    compositionstart: (evt) => evt instanceof CompositionEvent,
    compositionupdate: (evt) => evt instanceof CompositionEvent,
    compositionend: (evt) => evt instanceof CompositionEvent
  };
  const _hoisted_1$a = ["role"];
  const _hoisted_2$8 = ["id", "type", "disabled", "formatter", "parser", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form"];
  const _hoisted_3$4 = ["id", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form"];
  const __default__$i = Vue.defineComponent({
    name: "ElInput",
    inheritAttrs: false
  });
  const _sfc_main$n = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$i), {
    props: inputProps,
    emits: inputEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const rawAttrs = Vue.useAttrs();
      const slots = Vue.useSlots();
      const containerAttrs = Vue.computed(() => {
        const comboBoxAttrs = {};
        if (props.containerRole === "combobox") {
          comboBoxAttrs["aria-haspopup"] = rawAttrs["aria-haspopup"];
          comboBoxAttrs["aria-owns"] = rawAttrs["aria-owns"];
          comboBoxAttrs["aria-expanded"] = rawAttrs["aria-expanded"];
        }
        return comboBoxAttrs;
      });
      const containerKls = Vue.computed(() => [
        props.type === "textarea" ? nsTextarea.b() : nsInput.b(),
        nsInput.m(inputSize.value),
        nsInput.is("disabled", inputDisabled.value),
        nsInput.is("exceed", inputExceed.value),
        {
          [nsInput.b("group")]: slots.prepend || slots.append,
          [nsInput.bm("group", "append")]: slots.append,
          [nsInput.bm("group", "prepend")]: slots.prepend,
          [nsInput.m("prefix")]: slots.prefix || props.prefixIcon,
          [nsInput.m("suffix")]: slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
          [nsInput.bm("suffix", "password-clear")]: showClear.value && showPwdVisible.value
        },
        rawAttrs.class
      ]);
      const wrapperKls = Vue.computed(() => [
        nsInput.e("wrapper"),
        nsInput.is("focus", focused.value)
      ]);
      const attrs = useAttrs({
        excludeKeys: Vue.computed(() => {
          return Object.keys(containerAttrs.value);
        })
      });
      const { form, formItem } = useFormItem();
      const { inputId } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const inputSize = useSize();
      const inputDisabled = useDisabled();
      const nsInput = useNamespace("input");
      const nsTextarea = useNamespace("textarea");
      const input = Vue.shallowRef();
      const textarea = Vue.shallowRef();
      const focused = Vue.ref(false);
      const hovering = Vue.ref(false);
      const isComposing = Vue.ref(false);
      const passwordVisible = Vue.ref(false);
      const countStyle = Vue.ref();
      const textareaCalcStyle = Vue.shallowRef(props.inputStyle);
      const _ref = Vue.computed(() => input.value || textarea.value);
      const needStatusIcon = Vue.computed(() => {
        var _a2;
        return (_a2 = form == null ? void 0 : form.statusIcon) != null ? _a2 : false;
      });
      const validateState = Vue.computed(() => (formItem == null ? void 0 : formItem.validateState) || "");
      const validateIcon = Vue.computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
      const passwordIcon = Vue.computed(() => passwordVisible.value ? view_default : hide_default);
      const containerStyle = Vue.computed(() => [
        rawAttrs.style,
        props.inputStyle
      ]);
      const textareaStyle = Vue.computed(() => [
        props.inputStyle,
        textareaCalcStyle.value,
        { resize: props.resize }
      ]);
      const nativeInputValue = Vue.computed(() => isNil(props.modelValue) ? "" : String(props.modelValue));
      const showClear = Vue.computed(() => props.clearable && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (focused.value || hovering.value));
      const showPwdVisible = Vue.computed(() => props.showPassword && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (!!nativeInputValue.value || focused.value));
      const isWordLimitVisible = Vue.computed(() => props.showWordLimit && !!attrs.value.maxlength && (props.type === "text" || props.type === "textarea") && !inputDisabled.value && !props.readonly && !props.showPassword);
      const textLength = Vue.computed(() => Array.from(nativeInputValue.value).length);
      const inputExceed = Vue.computed(() => !!isWordLimitVisible.value && textLength.value > Number(attrs.value.maxlength));
      const suffixVisible = Vue.computed(() => !!slots.suffix || !!props.suffixIcon || showClear.value || props.showPassword || isWordLimitVisible.value || !!validateState.value && needStatusIcon.value);
      const [recordCursor, setCursor] = useCursor(input);
      useResizeObserver(textarea, (entries) => {
        if (!isWordLimitVisible.value || props.resize !== "both")
          return;
        const entry = entries[0];
        const { width } = entry.contentRect;
        countStyle.value = {
          right: `calc(100% - ${width + 15 + 6}px)`
        };
      });
      const resizeTextarea = () => {
        const { type, autosize } = props;
        if (!isClient || type !== "textarea")
          return;
        if (autosize) {
          const minRows = isObject(autosize) ? autosize.minRows : void 0;
          const maxRows = isObject(autosize) ? autosize.maxRows : void 0;
          textareaCalcStyle.value = __spreadValues({}, calcTextareaHeight(textarea.value, minRows, maxRows));
        } else {
          textareaCalcStyle.value = {
            minHeight: calcTextareaHeight(textarea.value).minHeight
          };
        }
      };
      const setNativeInputValue = () => {
        const input2 = _ref.value;
        if (!input2 || input2.value === nativeInputValue.value)
          return;
        input2.value = nativeInputValue.value;
      };
      const handleInput = async (event) => {
        recordCursor();
        let { value } = event.target;
        if (props.formatter) {
          value = props.parser ? props.parser(value) : value;
          value = props.formatter(value);
        }
        if (isComposing.value)
          return;
        if (value === nativeInputValue.value) {
          setNativeInputValue();
          return;
        }
        emit(UPDATE_MODEL_EVENT, value);
        emit("input", value);
        await Vue.nextTick();
        setNativeInputValue();
        setCursor();
      };
      const handleChange = (event) => {
        emit("change", event.target.value);
      };
      const handleCompositionStart = (event) => {
        emit("compositionstart", event);
        isComposing.value = true;
      };
      const handleCompositionUpdate = (event) => {
        var _a2;
        emit("compositionupdate", event);
        const text = (_a2 = event.target) == null ? void 0 : _a2.value;
        const lastCharacter = text[text.length - 1] || "";
        isComposing.value = !isKorean(lastCharacter);
      };
      const handleCompositionEnd = (event) => {
        emit("compositionend", event);
        if (isComposing.value) {
          isComposing.value = false;
          handleInput(event);
        }
      };
      const handlePasswordVisible = () => {
        passwordVisible.value = !passwordVisible.value;
        focus();
      };
      const focus = async () => {
        var _a2;
        await Vue.nextTick();
        (_a2 = _ref.value) == null ? void 0 : _a2.focus();
      };
      const blur = () => {
        var _a2;
        return (_a2 = _ref.value) == null ? void 0 : _a2.blur();
      };
      const handleFocus = (event) => {
        focused.value = true;
        emit("focus", event);
      };
      const handleBlur = (event) => {
        var _a2;
        focused.value = false;
        emit("blur", event);
        if (props.validateEvent) {
          (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "blur").catch((err) => debugWarn(err));
        }
      };
      const handleMouseLeave = (evt) => {
        hovering.value = false;
        emit("mouseleave", evt);
      };
      const handleMouseEnter = (evt) => {
        hovering.value = true;
        emit("mouseenter", evt);
      };
      const handleKeydown = (evt) => {
        emit("keydown", evt);
      };
      const select = () => {
        var _a2;
        (_a2 = _ref.value) == null ? void 0 : _a2.select();
      };
      const clear2 = () => {
        emit(UPDATE_MODEL_EVENT, "");
        emit("change", "");
        emit("clear");
        emit("input", "");
      };
      Vue.watch(() => props.modelValue, () => {
        var _a2;
        Vue.nextTick(() => resizeTextarea());
        if (props.validateEvent) {
          (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => debugWarn(err));
        }
      });
      Vue.watch(nativeInputValue, () => setNativeInputValue());
      Vue.watch(() => props.type, async () => {
        await Vue.nextTick();
        setNativeInputValue();
        resizeTextarea();
      });
      Vue.onMounted(() => {
        if (!props.formatter && props.parser) {
          debugWarn("ElInput", "If you set the parser, you also need to set the formatter.");
        }
        setNativeInputValue();
        Vue.nextTick(resizeTextarea);
      });
      expose({
        input,
        textarea,
        ref: _ref,
        textareaStyle,
        autosize: Vue.toRef(props, "autosize"),
        focus,
        blur,
        select,
        clear: clear2,
        resizeTextarea
      });
      return (_ctx, _cache) => {
        return Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("div", Vue.mergeProps(Vue.unref(containerAttrs), {
          class: Vue.unref(containerKls),
          style: Vue.unref(containerStyle),
          role: _ctx.containerRole,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }), [
          Vue.createCommentVNode(" input "),
          _ctx.type !== "textarea" ? (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 0 }, [
            Vue.createCommentVNode(" prepend slot "),
            _ctx.$slots.prepend ? (Vue.openBlock(), Vue.createElementBlock("div", {
              key: 0,
              class: Vue.normalizeClass(Vue.unref(nsInput).be("group", "prepend"))
            }, [
              Vue.renderSlot(_ctx.$slots, "prepend")
            ], 2)) : Vue.createCommentVNode("v-if", true),
            Vue.createElementVNode("div", {
              class: Vue.normalizeClass(Vue.unref(wrapperKls))
            }, [
              Vue.createCommentVNode(" prefix slot "),
              _ctx.$slots.prefix || _ctx.prefixIcon ? (Vue.openBlock(), Vue.createElementBlock("span", {
                key: 0,
                class: Vue.normalizeClass(Vue.unref(nsInput).e("prefix"))
              }, [
                Vue.createElementVNode("span", {
                  class: Vue.normalizeClass(Vue.unref(nsInput).e("prefix-inner")),
                  onClick: focus
                }, [
                  Vue.renderSlot(_ctx.$slots, "prefix"),
                  _ctx.prefixIcon ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                    key: 0,
                    class: Vue.normalizeClass(Vue.unref(nsInput).e("icon"))
                  }, {
                    default: Vue.withCtx(() => [
                      (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(_ctx.prefixIcon)))
                    ]),
                    _: 1
                  }, 8, ["class"])) : Vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : Vue.createCommentVNode("v-if", true),
              Vue.createElementVNode("input", Vue.mergeProps({
                id: Vue.unref(inputId),
                ref_key: "input",
                ref: input,
                class: Vue.unref(nsInput).e("inner")
              }, Vue.unref(attrs), {
                type: _ctx.showPassword ? passwordVisible.value ? "text" : "password" : _ctx.type,
                disabled: Vue.unref(inputDisabled),
                formatter: _ctx.formatter,
                parser: _ctx.parser,
                readonly: _ctx.readonly,
                autocomplete: _ctx.autocomplete,
                tabindex: _ctx.tabindex,
                "aria-label": _ctx.label,
                placeholder: _ctx.placeholder,
                style: _ctx.inputStyle,
                form: props.form,
                onCompositionstart: handleCompositionStart,
                onCompositionupdate: handleCompositionUpdate,
                onCompositionend: handleCompositionEnd,
                onInput: handleInput,
                onFocus: handleFocus,
                onBlur: handleBlur,
                onChange: handleChange,
                onKeydown: handleKeydown
              }), null, 16, _hoisted_2$8),
              Vue.createCommentVNode(" suffix slot "),
              Vue.unref(suffixVisible) ? (Vue.openBlock(), Vue.createElementBlock("span", {
                key: 1,
                class: Vue.normalizeClass(Vue.unref(nsInput).e("suffix"))
              }, [
                Vue.createElementVNode("span", {
                  class: Vue.normalizeClass(Vue.unref(nsInput).e("suffix-inner")),
                  onClick: focus
                }, [
                  !Vue.unref(showClear) || !Vue.unref(showPwdVisible) || !Vue.unref(isWordLimitVisible) ? (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 0 }, [
                    Vue.renderSlot(_ctx.$slots, "suffix"),
                    _ctx.suffixIcon ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                      key: 0,
                      class: Vue.normalizeClass(Vue.unref(nsInput).e("icon"))
                    }, {
                      default: Vue.withCtx(() => [
                        (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(_ctx.suffixIcon)))
                      ]),
                      _: 1
                    }, 8, ["class"])) : Vue.createCommentVNode("v-if", true)
                  ], 64)) : Vue.createCommentVNode("v-if", true),
                  Vue.unref(showClear) ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                    key: 1,
                    class: Vue.normalizeClass([Vue.unref(nsInput).e("icon"), Vue.unref(nsInput).e("clear")]),
                    onMousedown: Vue.withModifiers(Vue.unref(NOOP), ["prevent"]),
                    onClick: clear2
                  }, {
                    default: Vue.withCtx(() => [
                      Vue.createVNode(Vue.unref(circle_close_default))
                    ]),
                    _: 1
                  }, 8, ["class", "onMousedown"])) : Vue.createCommentVNode("v-if", true),
                  Vue.unref(showPwdVisible) ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                    key: 2,
                    class: Vue.normalizeClass([Vue.unref(nsInput).e("icon"), Vue.unref(nsInput).e("password")]),
                    onClick: handlePasswordVisible
                  }, {
                    default: Vue.withCtx(() => [
                      (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(Vue.unref(passwordIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : Vue.createCommentVNode("v-if", true),
                  Vue.unref(isWordLimitVisible) ? (Vue.openBlock(), Vue.createElementBlock("span", {
                    key: 3,
                    class: Vue.normalizeClass(Vue.unref(nsInput).e("count"))
                  }, [
                    Vue.createElementVNode("span", {
                      class: Vue.normalizeClass(Vue.unref(nsInput).e("count-inner"))
                    }, Vue.toDisplayString(Vue.unref(textLength)) + " / " + Vue.toDisplayString(Vue.unref(attrs).maxlength), 3)
                  ], 2)) : Vue.createCommentVNode("v-if", true),
                  Vue.unref(validateState) && Vue.unref(validateIcon) && Vue.unref(needStatusIcon) ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                    key: 4,
                    class: Vue.normalizeClass([
                      Vue.unref(nsInput).e("icon"),
                      Vue.unref(nsInput).e("validateIcon"),
                      Vue.unref(nsInput).is("loading", Vue.unref(validateState) === "validating")
                    ])
                  }, {
                    default: Vue.withCtx(() => [
                      (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(Vue.unref(validateIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : Vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : Vue.createCommentVNode("v-if", true)
            ], 2),
            Vue.createCommentVNode(" append slot "),
            _ctx.$slots.append ? (Vue.openBlock(), Vue.createElementBlock("div", {
              key: 1,
              class: Vue.normalizeClass(Vue.unref(nsInput).be("group", "append"))
            }, [
              Vue.renderSlot(_ctx.$slots, "append")
            ], 2)) : Vue.createCommentVNode("v-if", true)
          ], 64)) : (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 1 }, [
            Vue.createCommentVNode(" textarea "),
            Vue.createElementVNode("textarea", Vue.mergeProps({
              id: Vue.unref(inputId),
              ref_key: "textarea",
              ref: textarea,
              class: Vue.unref(nsTextarea).e("inner")
            }, Vue.unref(attrs), {
              tabindex: _ctx.tabindex,
              disabled: Vue.unref(inputDisabled),
              readonly: _ctx.readonly,
              autocomplete: _ctx.autocomplete,
              style: Vue.unref(textareaStyle),
              "aria-label": _ctx.label,
              placeholder: _ctx.placeholder,
              form: props.form,
              onCompositionstart: handleCompositionStart,
              onCompositionupdate: handleCompositionUpdate,
              onCompositionend: handleCompositionEnd,
              onInput: handleInput,
              onFocus: handleFocus,
              onBlur: handleBlur,
              onChange: handleChange,
              onKeydown: handleKeydown
            }), null, 16, _hoisted_3$4),
            Vue.unref(isWordLimitVisible) ? (Vue.openBlock(), Vue.createElementBlock("span", {
              key: 0,
              style: Vue.normalizeStyle(countStyle.value),
              class: Vue.normalizeClass(Vue.unref(nsInput).e("count"))
            }, Vue.toDisplayString(Vue.unref(textLength)) + " / " + Vue.toDisplayString(Vue.unref(attrs).maxlength), 7)) : Vue.createCommentVNode("v-if", true)
          ], 64))
        ], 16, _hoisted_1$a)), [
          [Vue.vShow, _ctx.type !== "hidden"]
        ]);
      };
    }
  }));
  var Input = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/input/src/input.vue"]]);
  const ElInput = withInstall(Input);
  const GAP = 4;
  const BAR_MAP = {
    vertical: {
      offset: "offsetHeight",
      scroll: "scrollTop",
      scrollSize: "scrollHeight",
      size: "height",
      key: "vertical",
      axis: "Y",
      client: "clientY",
      direction: "top"
    },
    horizontal: {
      offset: "offsetWidth",
      scroll: "scrollLeft",
      scrollSize: "scrollWidth",
      size: "width",
      key: "horizontal",
      axis: "X",
      client: "clientX",
      direction: "left"
    }
  };
  const renderThumbStyle = ({
    move,
    size: size2,
    bar
  }) => ({
    [bar.size]: size2,
    transform: `translate${bar.axis}(${move}%)`
  });
  const thumbProps = buildProps({
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: {
      type: Number,
      required: true
    },
    always: Boolean
  });
  const COMPONENT_NAME$2 = "Thumb";
  const _sfc_main$m = /* @__PURE__ */ Vue.defineComponent({
    __name: "thumb",
    props: thumbProps,
    setup(__props) {
      const props = __props;
      const scrollbar = Vue.inject(scrollbarContextKey);
      const ns2 = useNamespace("scrollbar");
      if (!scrollbar)
        throwError(COMPONENT_NAME$2, "can not inject scrollbar context");
      const instance = Vue.ref();
      const thumb = Vue.ref();
      const thumbState = Vue.ref({});
      const visible = Vue.ref(false);
      let cursorDown = false;
      let cursorLeave = false;
      let originalOnSelectStart = isClient ? document.onselectstart : null;
      const bar = Vue.computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
      const thumbStyle = Vue.computed(() => renderThumbStyle({
        size: props.size,
        move: props.move,
        bar: bar.value
      }));
      const offsetRatio = Vue.computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
      const clickThumbHandler = (e) => {
        var _a2;
        e.stopPropagation();
        if (e.ctrlKey || [1, 2].includes(e.button))
          return;
        (_a2 = window.getSelection()) == null ? void 0 : _a2.removeAllRanges();
        startDrag(e);
        const el = e.currentTarget;
        if (!el)
          return;
        thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
      };
      const clickTrackHandler = (e) => {
        if (!thumb.value || !instance.value || !scrollbar.wrapElement)
          return;
        const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
        const thumbHalf = thumb.value[bar.value.offset] / 2;
        const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const startDrag = (e) => {
        e.stopImmediatePropagation();
        cursorDown = true;
        document.addEventListener("mousemove", mouseMoveDocumentHandler);
        document.addEventListener("mouseup", mouseUpDocumentHandler);
        originalOnSelectStart = document.onselectstart;
        document.onselectstart = () => false;
      };
      const mouseMoveDocumentHandler = (e) => {
        if (!instance.value || !thumb.value)
          return;
        if (cursorDown === false)
          return;
        const prevPage = thumbState.value[bar.value.axis];
        if (!prevPage)
          return;
        const offset = (instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
        const thumbClickPosition = thumb.value[bar.value.offset] - prevPage;
        const thumbPositionPercentage = (offset - thumbClickPosition) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const mouseUpDocumentHandler = () => {
        cursorDown = false;
        thumbState.value[bar.value.axis] = 0;
        document.removeEventListener("mousemove", mouseMoveDocumentHandler);
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
        restoreOnselectstart();
        if (cursorLeave)
          visible.value = false;
      };
      const mouseMoveScrollbarHandler = () => {
        cursorLeave = false;
        visible.value = !!props.size;
      };
      const mouseLeaveScrollbarHandler = () => {
        cursorLeave = true;
        visible.value = cursorDown;
      };
      Vue.onBeforeUnmount(() => {
        restoreOnselectstart();
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
      });
      const restoreOnselectstart = () => {
        if (document.onselectstart !== originalOnSelectStart)
          document.onselectstart = originalOnSelectStart;
      };
      useEventListener(Vue.toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
      useEventListener(Vue.toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createBlock(Vue.Transition, {
          name: Vue.unref(ns2).b("fade"),
          persisted: ""
        }, {
          default: Vue.withCtx(() => [
            Vue.withDirectives(Vue.createElementVNode("div", {
              ref_key: "instance",
              ref: instance,
              class: Vue.normalizeClass([Vue.unref(ns2).e("bar"), Vue.unref(ns2).is(Vue.unref(bar).key)]),
              onMousedown: clickTrackHandler
            }, [
              Vue.createElementVNode("div", {
                ref_key: "thumb",
                ref: thumb,
                class: Vue.normalizeClass(Vue.unref(ns2).e("thumb")),
                style: Vue.normalizeStyle(Vue.unref(thumbStyle)),
                onMousedown: clickThumbHandler
              }, null, 38)
            ], 34), [
              [Vue.vShow, _ctx.always || visible.value]
            ])
          ]),
          _: 1
        }, 8, ["name"]);
      };
    }
  });
  var Thumb = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/thumb.vue"]]);
  const barProps = buildProps({
    always: {
      type: Boolean,
      default: true
    },
    width: String,
    height: String,
    ratioX: {
      type: Number,
      default: 1
    },
    ratioY: {
      type: Number,
      default: 1
    }
  });
  const _sfc_main$l = /* @__PURE__ */ Vue.defineComponent({
    __name: "bar",
    props: barProps,
    setup(__props, { expose }) {
      const props = __props;
      const moveX = Vue.ref(0);
      const moveY = Vue.ref(0);
      const handleScroll = (wrap) => {
        if (wrap) {
          const offsetHeight = wrap.offsetHeight - GAP;
          const offsetWidth = wrap.offsetWidth - GAP;
          moveY.value = wrap.scrollTop * 100 / offsetHeight * props.ratioY;
          moveX.value = wrap.scrollLeft * 100 / offsetWidth * props.ratioX;
        }
      };
      expose({
        handleScroll
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, null, [
          Vue.createVNode(Thumb, {
            move: moveX.value,
            ratio: _ctx.ratioX,
            size: _ctx.width,
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"]),
          Vue.createVNode(Thumb, {
            move: moveY.value,
            ratio: _ctx.ratioY,
            size: _ctx.height,
            vertical: "",
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"])
        ], 64);
      };
    }
  });
  var Bar = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/bar.vue"]]);
  const scrollbarProps = buildProps({
    height: {
      type: [String, Number],
      default: ""
    },
    maxHeight: {
      type: [String, Number],
      default: ""
    },
    native: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: definePropType([String, Object, Array]),
      default: ""
    },
    wrapClass: {
      type: [String, Array],
      default: ""
    },
    viewClass: {
      type: [String, Array],
      default: ""
    },
    viewStyle: {
      type: [String, Array, Object],
      default: ""
    },
    noresize: Boolean,
    tag: {
      type: String,
      default: "div"
    },
    always: Boolean,
    minSize: {
      type: Number,
      default: 20
    }
  });
  const scrollbarEmits = {
    scroll: ({
      scrollTop,
      scrollLeft
    }) => [scrollTop, scrollLeft].every(isNumber)
  };
  const COMPONENT_NAME$1 = "ElScrollbar";
  const __default__$h = Vue.defineComponent({
    name: COMPONENT_NAME$1
  });
  const _sfc_main$k = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$h), {
    props: scrollbarProps,
    emits: scrollbarEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns2 = useNamespace("scrollbar");
      let stopResizeObserver = void 0;
      let stopResizeListener = void 0;
      const scrollbarRef = Vue.ref();
      const wrapRef = Vue.ref();
      const resizeRef = Vue.ref();
      const sizeWidth = Vue.ref("0");
      const sizeHeight = Vue.ref("0");
      const barRef = Vue.ref();
      const ratioY = Vue.ref(1);
      const ratioX = Vue.ref(1);
      const style2 = Vue.computed(() => {
        const style22 = {};
        if (props.height)
          style22.height = addUnit(props.height);
        if (props.maxHeight)
          style22.maxHeight = addUnit(props.maxHeight);
        return [props.wrapStyle, style22];
      });
      const wrapKls = Vue.computed(() => {
        return [
          props.wrapClass,
          ns2.e("wrap"),
          { [ns2.em("wrap", "hidden-default")]: !props.native }
        ];
      });
      const resizeKls = Vue.computed(() => {
        return [ns2.e("view"), props.viewClass];
      });
      const handleScroll = () => {
        var _a2;
        if (wrapRef.value) {
          (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
          emit("scroll", {
            scrollTop: wrapRef.value.scrollTop,
            scrollLeft: wrapRef.value.scrollLeft
          });
        }
      };
      function scrollTo(arg1, arg2) {
        if (isObject(arg1)) {
          wrapRef.value.scrollTo(arg1);
        } else if (isNumber(arg1) && isNumber(arg2)) {
          wrapRef.value.scrollTo(arg1, arg2);
        }
      }
      const setScrollTop = (value) => {
        if (!isNumber(value)) {
          debugWarn(COMPONENT_NAME$1, "value must be a number");
          return;
        }
        wrapRef.value.scrollTop = value;
      };
      const setScrollLeft = (value) => {
        if (!isNumber(value)) {
          debugWarn(COMPONENT_NAME$1, "value must be a number");
          return;
        }
        wrapRef.value.scrollLeft = value;
      };
      const update = () => {
        if (!wrapRef.value)
          return;
        const offsetHeight = wrapRef.value.offsetHeight - GAP;
        const offsetWidth = wrapRef.value.offsetWidth - GAP;
        const originalHeight = offsetHeight ** 2 / wrapRef.value.scrollHeight;
        const originalWidth = offsetWidth ** 2 / wrapRef.value.scrollWidth;
        const height = Math.max(originalHeight, props.minSize);
        const width = Math.max(originalWidth, props.minSize);
        ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
        ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
        sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
        sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
      };
      Vue.watch(() => props.noresize, (noresize) => {
        if (noresize) {
          stopResizeObserver == null ? void 0 : stopResizeObserver();
          stopResizeListener == null ? void 0 : stopResizeListener();
        } else {
          ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update));
          stopResizeListener = useEventListener("resize", update);
        }
      }, { immediate: true });
      Vue.watch(() => [props.maxHeight, props.height], () => {
        if (!props.native)
          Vue.nextTick(() => {
            var _a2;
            update();
            if (wrapRef.value) {
              (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
            }
          });
      });
      Vue.provide(scrollbarContextKey, Vue.reactive({
        scrollbarElement: scrollbarRef,
        wrapElement: wrapRef
      }));
      Vue.onMounted(() => {
        if (!props.native)
          Vue.nextTick(() => {
            update();
          });
      });
      Vue.onUpdated(() => update());
      expose({
        wrapRef,
        update,
        scrollTo,
        setScrollTop,
        setScrollLeft,
        handleScroll
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          ref_key: "scrollbarRef",
          ref: scrollbarRef,
          class: Vue.normalizeClass(Vue.unref(ns2).b())
        }, [
          Vue.createElementVNode("div", {
            ref_key: "wrapRef",
            ref: wrapRef,
            class: Vue.normalizeClass(Vue.unref(wrapKls)),
            style: Vue.normalizeStyle(Vue.unref(style2)),
            onScroll: handleScroll
          }, [
            (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(_ctx.tag), {
              ref_key: "resizeRef",
              ref: resizeRef,
              class: Vue.normalizeClass(Vue.unref(resizeKls)),
              style: Vue.normalizeStyle(_ctx.viewStyle)
            }, {
              default: Vue.withCtx(() => [
                Vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["class", "style"]))
          ], 38),
          !_ctx.native ? (Vue.openBlock(), Vue.createBlock(Bar, {
            key: 0,
            ref_key: "barRef",
            ref: barRef,
            height: sizeHeight.value,
            width: sizeWidth.value,
            always: _ctx.always,
            "ratio-x": ratioX.value,
            "ratio-y": ratioY.value
          }, null, 8, ["height", "width", "always", "ratio-x", "ratio-y"])) : Vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  }));
  var Scrollbar = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/scrollbar/src/scrollbar.vue"]]);
  const ElScrollbar = withInstall(Scrollbar);
  const roleTypes = [
    "dialog",
    "grid",
    "group",
    "listbox",
    "menu",
    "navigation",
    "tooltip",
    "tree"
  ];
  const popperProps = buildProps({
    role: {
      type: String,
      values: roleTypes,
      default: "tooltip"
    }
  });
  const __default__$g = Vue.defineComponent({
    name: "ElPopperRoot",
    inheritAttrs: false
  });
  const _sfc_main$j = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$g), {
    props: popperProps,
    setup(__props, { expose }) {
      const props = __props;
      const triggerRef = Vue.ref();
      const popperInstanceRef = Vue.ref();
      const contentRef = Vue.ref();
      const referenceRef = Vue.ref();
      const role = Vue.computed(() => props.role);
      const popperProvides = {
        triggerRef,
        popperInstanceRef,
        contentRef,
        referenceRef,
        role
      };
      expose(popperProvides);
      Vue.provide(POPPER_INJECTION_KEY, popperProvides);
      return (_ctx, _cache) => {
        return Vue.renderSlot(_ctx.$slots, "default");
      };
    }
  }));
  var Popper = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/popper.vue"]]);
  const popperArrowProps = buildProps({
    arrowOffset: {
      type: Number,
      default: 5
    }
  });
  const __default__$f = Vue.defineComponent({
    name: "ElPopperArrow",
    inheritAttrs: false
  });
  const _sfc_main$i = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$f), {
    props: popperArrowProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns2 = useNamespace("popper");
      const { arrowOffset, arrowRef } = Vue.inject(POPPER_CONTENT_INJECTION_KEY, void 0);
      Vue.watch(() => props.arrowOffset, (val) => {
        arrowOffset.value = val;
      });
      Vue.onBeforeUnmount(() => {
        arrowRef.value = void 0;
      });
      expose({
        arrowRef
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("span", {
          ref_key: "arrowRef",
          ref: arrowRef,
          class: Vue.normalizeClass(Vue.unref(ns2).e("arrow")),
          "data-popper-arrow": ""
        }, null, 2);
      };
    }
  }));
  var ElPopperArrow = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/arrow.vue"]]);
  const NAME = "ElOnlyChild";
  const OnlyChild = Vue.defineComponent({
    name: NAME,
    setup(_2, {
      slots,
      attrs
    }) {
      var _a2;
      const forwardRefInjection = Vue.inject(FORWARD_REF_INJECTION_KEY);
      const forwardRefDirective = useForwardRefDirective((_a2 = forwardRefInjection == null ? void 0 : forwardRefInjection.setForwardRef) != null ? _a2 : NOOP);
      return () => {
        var _a22;
        const defaultSlot = (_a22 = slots.default) == null ? void 0 : _a22.call(slots, attrs);
        if (!defaultSlot)
          return null;
        if (defaultSlot.length > 1) {
          debugWarn(NAME, "requires exact only one valid child.");
          return null;
        }
        const firstLegitNode = findFirstLegitChild(defaultSlot);
        if (!firstLegitNode) {
          debugWarn(NAME, "no valid child node found");
          return null;
        }
        return Vue.withDirectives(Vue.cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
      };
    }
  });
  function findFirstLegitChild(node) {
    if (!node)
      return null;
    const children = node;
    for (const child of children) {
      if (isObject(child)) {
        switch (child.type) {
          case Vue.Comment:
            continue;
          case Vue.Text:
          case "svg":
            return wrapTextContent(child);
          case Vue.Fragment:
            return findFirstLegitChild(child.children);
          default:
            return child;
        }
      }
      return wrapTextContent(child);
    }
    return null;
  }
  function wrapTextContent(s2) {
    const ns2 = useNamespace("only-child");
    return Vue.createVNode("span", {
      "class": ns2.e("content")
    }, [s2]);
  }
  const popperTriggerProps = buildProps({
    virtualRef: {
      type: definePropType(Object)
    },
    virtualTriggering: Boolean,
    onMouseenter: {
      type: definePropType(Function)
    },
    onMouseleave: {
      type: definePropType(Function)
    },
    onClick: {
      type: definePropType(Function)
    },
    onKeydown: {
      type: definePropType(Function)
    },
    onFocus: {
      type: definePropType(Function)
    },
    onBlur: {
      type: definePropType(Function)
    },
    onContextmenu: {
      type: definePropType(Function)
    },
    id: String,
    open: Boolean
  });
  const __default__$e = Vue.defineComponent({
    name: "ElPopperTrigger",
    inheritAttrs: false
  });
  const _sfc_main$h = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$e), {
    props: popperTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const { role, triggerRef } = Vue.inject(POPPER_INJECTION_KEY, void 0);
      useForwardRef(triggerRef);
      const ariaControls = Vue.computed(() => {
        return ariaHaspopup.value ? props.id : void 0;
      });
      const ariaDescribedby = Vue.computed(() => {
        if (role && role.value === "tooltip") {
          return props.open && props.id ? props.id : void 0;
        }
        return void 0;
      });
      const ariaHaspopup = Vue.computed(() => {
        if (role && role.value !== "tooltip") {
          return role.value;
        }
        return void 0;
      });
      const ariaExpanded = Vue.computed(() => {
        return ariaHaspopup.value ? `${props.open}` : void 0;
      });
      let virtualTriggerAriaStopWatch = void 0;
      Vue.onMounted(() => {
        Vue.watch(() => props.virtualRef, (virtualEl) => {
          if (virtualEl) {
            triggerRef.value = unrefElement(virtualEl);
          }
        }, {
          immediate: true
        });
        Vue.watch(triggerRef, (el, prevEl) => {
          virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
          virtualTriggerAriaStopWatch = void 0;
          if (isElement(el)) {
            [
              "onMouseenter",
              "onMouseleave",
              "onClick",
              "onKeydown",
              "onFocus",
              "onBlur",
              "onContextmenu"
            ].forEach((eventName) => {
              var _a2;
              const handler = props[eventName];
              if (handler) {
                el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                (_a2 = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a2.call(prevEl, eventName.slice(2).toLowerCase(), handler);
              }
            });
            virtualTriggerAriaStopWatch = Vue.watch([ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded], (watches) => {
              [
                "aria-controls",
                "aria-describedby",
                "aria-haspopup",
                "aria-expanded"
              ].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (isElement(prevEl)) {
            [
              "aria-controls",
              "aria-describedby",
              "aria-haspopup",
              "aria-expanded"
            ].forEach((key) => prevEl.removeAttribute(key));
          }
        }, {
          immediate: true
        });
      });
      Vue.onBeforeUnmount(() => {
        virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
        virtualTriggerAriaStopWatch = void 0;
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return !_ctx.virtualTriggering ? (Vue.openBlock(), Vue.createBlock(Vue.unref(OnlyChild), Vue.mergeProps({ key: 0 }, _ctx.$attrs, {
          "aria-controls": Vue.unref(ariaControls),
          "aria-describedby": Vue.unref(ariaDescribedby),
          "aria-expanded": Vue.unref(ariaExpanded),
          "aria-haspopup": Vue.unref(ariaHaspopup)
        }), {
          default: Vue.withCtx(() => [
            Vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 16, ["aria-controls", "aria-describedby", "aria-expanded", "aria-haspopup"])) : Vue.createCommentVNode("v-if", true);
      };
    }
  }));
  var ElPopperTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/trigger.vue"]]);
  const FOCUS_AFTER_TRAPPED = "focus-trap.focus-after-trapped";
  const FOCUS_AFTER_RELEASED = "focus-trap.focus-after-released";
  const FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
  const FOCUS_AFTER_TRAPPED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const FOCUSOUT_PREVENTED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
  const ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
  const FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");
  const focusReason = Vue.ref();
  const lastUserFocusTimestamp = Vue.ref(0);
  const lastAutomatedFocusTimestamp = Vue.ref(0);
  let focusReasonUserCount = 0;
  const obtainAllFocusableElements = (element) => {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput)
          return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode())
      nodes.push(walker.currentNode);
    return nodes;
  };
  const getVisibleElement = (elements, container) => {
    for (const element of elements) {
      if (!isHidden(element, container))
        return element;
    }
  };
  const isHidden = (element, container) => {
    if (getComputedStyle(element).visibility === "hidden")
      return true;
    while (element) {
      if (container && element === container)
        return false;
      if (getComputedStyle(element).display === "none")
        return true;
      element = element.parentElement;
    }
    return false;
  };
  const getEdges = (container) => {
    const focusable = obtainAllFocusableElements(container);
    const first = getVisibleElement(focusable, container);
    const last = getVisibleElement(focusable.reverse(), container);
    return [first, last];
  };
  const isSelectable = (element) => {
    return element instanceof HTMLInputElement && "select" in element;
  };
  const tryFocus = (element, shouldSelect) => {
    if (element && element.focus) {
      const prevFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      lastAutomatedFocusTimestamp.value = window.performance.now();
      if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
        element.select();
      }
    }
  };
  function removeFromStack(list, item) {
    const copy = [...list];
    const idx = list.indexOf(item);
    if (idx !== -1) {
      copy.splice(idx, 1);
    }
    return copy;
  }
  const createFocusableStack = () => {
    let stack2 = [];
    const push = (layer) => {
      const currentLayer = stack2[0];
      if (currentLayer && layer !== currentLayer) {
        currentLayer.pause();
      }
      stack2 = removeFromStack(stack2, layer);
      stack2.unshift(layer);
    };
    const remove2 = (layer) => {
      var _a2, _b;
      stack2 = removeFromStack(stack2, layer);
      (_b = (_a2 = stack2[0]) == null ? void 0 : _a2.resume) == null ? void 0 : _b.call(_a2);
    };
    return {
      push,
      remove: remove2
    };
  };
  const focusFirstDescendant = (elements, shouldSelect = false) => {
    const prevFocusedElement = document.activeElement;
    for (const element of elements) {
      tryFocus(element, shouldSelect);
      if (document.activeElement !== prevFocusedElement)
        return;
    }
  };
  const focusableStack = createFocusableStack();
  const isFocusCausedByUserEvent = () => {
    return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
  };
  const notifyFocusReasonPointer = () => {
    focusReason.value = "pointer";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const notifyFocusReasonKeydown = () => {
    focusReason.value = "keyboard";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const useFocusReason = () => {
    Vue.onMounted(() => {
      if (focusReasonUserCount === 0) {
        document.addEventListener("mousedown", notifyFocusReasonPointer);
        document.addEventListener("touchstart", notifyFocusReasonPointer);
        document.addEventListener("keydown", notifyFocusReasonKeydown);
      }
      focusReasonUserCount++;
    });
    Vue.onBeforeUnmount(() => {
      focusReasonUserCount--;
      if (focusReasonUserCount <= 0) {
        document.removeEventListener("mousedown", notifyFocusReasonPointer);
        document.removeEventListener("touchstart", notifyFocusReasonPointer);
        document.removeEventListener("keydown", notifyFocusReasonKeydown);
      }
    });
    return {
      focusReason,
      lastUserFocusTimestamp,
      lastAutomatedFocusTimestamp
    };
  };
  const createFocusOutPreventedEvent = (detail) => {
    return new CustomEvent(FOCUSOUT_PREVENTED, __spreadProps(__spreadValues({}, FOCUSOUT_PREVENTED_OPTS), {
      detail
    }));
  };
  const _sfc_main$g = Vue.defineComponent({
    name: "ElFocusTrap",
    inheritAttrs: false,
    props: {
      loop: Boolean,
      trapped: Boolean,
      focusTrapEl: Object,
      focusStartEl: {
        type: [Object, String],
        default: "first"
      }
    },
    emits: [
      ON_TRAP_FOCUS_EVT,
      ON_RELEASE_FOCUS_EVT,
      "focusin",
      "focusout",
      "focusout-prevented",
      "release-requested"
    ],
    setup(props, { emit }) {
      const forwardRef = Vue.ref();
      let lastFocusBeforeTrapped;
      let lastFocusAfterTrapped;
      const { focusReason: focusReason2 } = useFocusReason();
      useEscapeKeydown((event) => {
        if (props.trapped && !focusLayer.paused) {
          emit("release-requested", event);
        }
      });
      const focusLayer = {
        paused: false,
        pause() {
          this.paused = true;
        },
        resume() {
          this.paused = false;
        }
      };
      const onKeydown = (e) => {
        if (!props.loop && !props.trapped)
          return;
        if (focusLayer.paused)
          return;
        const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
        const { loop } = props;
        const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
        const currentFocusingEl = document.activeElement;
        if (isTabbing && currentFocusingEl) {
          const container = currentTarget;
          const [first, last] = getEdges(container);
          const isTabbable = first && last;
          if (!isTabbable) {
            if (currentFocusingEl === container) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
              }
            }
          } else {
            if (!shiftKey && currentFocusingEl === last) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(first, true);
              }
            } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(last, true);
              }
            }
          }
        }
      };
      Vue.provide(FOCUS_TRAP_INJECTION_KEY, {
        focusTrapRef: forwardRef,
        onKeydown
      });
      Vue.watch(() => props.focusTrapEl, (focusTrapEl) => {
        if (focusTrapEl) {
          forwardRef.value = focusTrapEl;
        }
      }, { immediate: true });
      Vue.watch([forwardRef], ([forwardRef2], [oldForwardRef]) => {
        if (forwardRef2) {
          forwardRef2.addEventListener("keydown", onKeydown);
          forwardRef2.addEventListener("focusin", onFocusIn);
          forwardRef2.addEventListener("focusout", onFocusOut);
        }
        if (oldForwardRef) {
          oldForwardRef.removeEventListener("keydown", onKeydown);
          oldForwardRef.removeEventListener("focusin", onFocusIn);
          oldForwardRef.removeEventListener("focusout", onFocusOut);
        }
      });
      const trapOnFocus = (e) => {
        emit(ON_TRAP_FOCUS_EVT, e);
      };
      const releaseOnFocus = (e) => emit(ON_RELEASE_FOCUS_EVT, e);
      const onFocusIn = (e) => {
        const trapContainer = Vue.unref(forwardRef);
        if (!trapContainer)
          return;
        const target = e.target;
        const relatedTarget = e.relatedTarget;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!props.trapped) {
          const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget);
          if (!isPrevFocusedInTrap) {
            lastFocusBeforeTrapped = relatedTarget;
          }
        }
        if (isFocusedInTrap)
          emit("focusin", e);
        if (focusLayer.paused)
          return;
        if (props.trapped) {
          if (isFocusedInTrap) {
            lastFocusAfterTrapped = target;
          } else {
            tryFocus(lastFocusAfterTrapped, true);
          }
        }
      };
      const onFocusOut = (e) => {
        const trapContainer = Vue.unref(forwardRef);
        if (focusLayer.paused || !trapContainer)
          return;
        if (props.trapped) {
          const relatedTarget = e.relatedTarget;
          if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
            setTimeout(() => {
              if (!focusLayer.paused && props.trapped) {
                const focusoutPreventedEvent = createFocusOutPreventedEvent({
                  focusReason: focusReason2.value
                });
                emit("focusout-prevented", focusoutPreventedEvent);
                if (!focusoutPreventedEvent.defaultPrevented) {
                  tryFocus(lastFocusAfterTrapped, true);
                }
              }
            }, 0);
          }
        } else {
          const target = e.target;
          const isFocusedInTrap = target && trapContainer.contains(target);
          if (!isFocusedInTrap)
            emit("focusout", e);
        }
      };
      async function startTrap() {
        await Vue.nextTick();
        const trapContainer = Vue.unref(forwardRef);
        if (trapContainer) {
          focusableStack.push(focusLayer);
          const prevFocusedElement = trapContainer.contains(document.activeElement) ? lastFocusBeforeTrapped : document.activeElement;
          lastFocusBeforeTrapped = prevFocusedElement;
          const isPrevFocusContained = trapContainer.contains(prevFocusedElement);
          if (!isPrevFocusContained) {
            const focusEvent = new Event(FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS);
            trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
            trapContainer.dispatchEvent(focusEvent);
            if (!focusEvent.defaultPrevented) {
              Vue.nextTick(() => {
                let focusStartEl = props.focusStartEl;
                if (!isString$1(focusStartEl)) {
                  tryFocus(focusStartEl);
                  if (document.activeElement !== focusStartEl) {
                    focusStartEl = "first";
                  }
                }
                if (focusStartEl === "first") {
                  focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
                }
                if (document.activeElement === prevFocusedElement || focusStartEl === "container") {
                  tryFocus(trapContainer);
                }
              });
            }
          }
        }
      }
      function stopTrap() {
        const trapContainer = Vue.unref(forwardRef);
        if (trapContainer) {
          trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
          const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, __spreadProps(__spreadValues({}, FOCUS_AFTER_TRAPPED_OPTS), {
            detail: {
              focusReason: focusReason2.value
            }
          }));
          trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          trapContainer.dispatchEvent(releasedEvent);
          if (!releasedEvent.defaultPrevented && (focusReason2.value == "keyboard" || !isFocusCausedByUserEvent())) {
            tryFocus(lastFocusBeforeTrapped != null ? lastFocusBeforeTrapped : document.body);
          }
          trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, trapOnFocus);
          focusableStack.remove(focusLayer);
        }
      }
      Vue.onMounted(() => {
        if (props.trapped) {
          startTrap();
        }
        Vue.watch(() => props.trapped, (trapped) => {
          if (trapped) {
            startTrap();
          } else {
            stopTrap();
          }
        });
      });
      Vue.onBeforeUnmount(() => {
        if (props.trapped) {
          stopTrap();
        }
      });
      return {
        onKeydown
      };
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
  }
  var ElFocusTrap = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$2], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/focus-trap/src/focus-trap.vue"]]);
  const POSITIONING_STRATEGIES = ["fixed", "absolute"];
  const popperCoreConfigProps = buildProps({
    boundariesPadding: {
      type: Number,
      default: 0
    },
    fallbackPlacements: {
      type: definePropType(Array),
      default: void 0
    },
    gpuAcceleration: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Number,
      default: 12
    },
    placement: {
      type: String,
      values: Ee,
      default: "bottom"
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    strategy: {
      type: String,
      values: POSITIONING_STRATEGIES,
      default: "absolute"
    }
  });
  const popperContentProps = buildProps(__spreadProps(__spreadValues({}, popperCoreConfigProps), {
    id: String,
    style: {
      type: definePropType([String, Array, Object])
    },
    className: {
      type: definePropType([String, Array, Object])
    },
    effect: {
      type: String,
      default: "dark"
    },
    visible: Boolean,
    enterable: {
      type: Boolean,
      default: true
    },
    pure: Boolean,
    focusOnShow: {
      type: Boolean,
      default: false
    },
    trapping: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: definePropType([String, Array, Object])
    },
    popperStyle: {
      type: definePropType([String, Array, Object])
    },
    referenceEl: {
      type: definePropType(Object)
    },
    triggerTargetEl: {
      type: definePropType(Object)
    },
    stopPopperMouseEvent: {
      type: Boolean,
      default: true
    },
    ariaLabel: {
      type: String,
      default: void 0
    },
    virtualTriggering: Boolean,
    zIndex: Number
  }));
  const popperContentEmits = {
    mouseenter: (evt) => evt instanceof MouseEvent,
    mouseleave: (evt) => evt instanceof MouseEvent,
    focus: () => true,
    blur: () => true,
    close: () => true
  };
  const buildPopperOptions = (props, arrowProps) => {
    const { placement, strategy, popperOptions } = props;
    const options = __spreadProps(__spreadValues({
      placement,
      strategy
    }, popperOptions), {
      modifiers: genModifiers(props)
    });
    attachArrow(options, arrowProps);
    deriveExtraModifiers(options, popperOptions == null ? void 0 : popperOptions.modifiers);
    return options;
  };
  const unwrapMeasurableEl = ($el) => {
    if (!isClient)
      return;
    return unrefElement($el);
  };
  function genModifiers(options) {
    const { offset, gpuAcceleration, fallbackPlacements } = options;
    return [
      {
        name: "offset",
        options: {
          offset: [0, offset != null ? offset : 12]
        }
      },
      {
        name: "preventOverflow",
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      },
      {
        name: "flip",
        options: {
          padding: 5,
          fallbackPlacements
        }
      },
      {
        name: "computeStyles",
        options: {
          gpuAcceleration
        }
      }
    ];
  }
  function attachArrow(options, { arrowEl, arrowOffset }) {
    options.modifiers.push({
      name: "arrow",
      options: {
        element: arrowEl,
        padding: arrowOffset != null ? arrowOffset : 5
      }
    });
  }
  function deriveExtraModifiers(options, modifiers) {
    if (modifiers) {
      options.modifiers = [...options.modifiers, ...modifiers != null ? modifiers : []];
    }
  }
  const __default__$d = Vue.defineComponent({
    name: "ElPopperContent"
  });
  const _sfc_main$f = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$d), {
    props: popperContentProps,
    emits: popperContentEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const { popperInstanceRef, contentRef, triggerRef, role } = Vue.inject(POPPER_INJECTION_KEY, void 0);
      const formItemContext = Vue.inject(formItemContextKey, void 0);
      const { nextZIndex } = useZIndex();
      const ns2 = useNamespace("popper");
      const popperContentRef = Vue.ref();
      const focusStartRef = Vue.ref("first");
      const arrowRef = Vue.ref();
      const arrowOffset = Vue.ref();
      Vue.provide(POPPER_CONTENT_INJECTION_KEY, {
        arrowRef,
        arrowOffset
      });
      if (formItemContext && (formItemContext.addInputId || formItemContext.removeInputId)) {
        Vue.provide(formItemContextKey, __spreadProps(__spreadValues({}, formItemContext), {
          addInputId: NOOP,
          removeInputId: NOOP
        }));
      }
      const contentZIndex = Vue.ref(props.zIndex || nextZIndex());
      const trapped = Vue.ref(false);
      let triggerTargetAriaStopWatch = void 0;
      const computedReference = Vue.computed(() => unwrapMeasurableEl(props.referenceEl) || Vue.unref(triggerRef));
      const contentStyle = Vue.computed(() => [{ zIndex: Vue.unref(contentZIndex) }, props.popperStyle]);
      const contentClass = Vue.computed(() => [
        ns2.b(),
        ns2.is("pure", props.pure),
        ns2.is(props.effect),
        props.popperClass
      ]);
      const ariaModal = Vue.computed(() => {
        return role && role.value === "dialog" ? "false" : void 0;
      });
      const createPopperInstance = ({
        referenceEl,
        popperContentEl,
        arrowEl
      }) => {
        const options = buildPopperOptions(props, {
          arrowEl,
          arrowOffset: Vue.unref(arrowOffset)
        });
        return yn(referenceEl, popperContentEl, options);
      };
      const updatePopper = (shouldUpdateZIndex = true) => {
        var _a2;
        (_a2 = Vue.unref(popperInstanceRef)) == null ? void 0 : _a2.update();
        shouldUpdateZIndex && (contentZIndex.value = props.zIndex || nextZIndex());
      };
      const togglePopperAlive = () => {
        var _a2, _b;
        const monitorable = { name: "eventListeners", enabled: props.visible };
        (_b = (_a2 = Vue.unref(popperInstanceRef)) == null ? void 0 : _a2.setOptions) == null ? void 0 : _b.call(_a2, (options) => __spreadProps(__spreadValues({}, options), {
          modifiers: [...options.modifiers || [], monitorable]
        }));
        updatePopper(false);
        if (props.visible && props.focusOnShow) {
          trapped.value = true;
        } else if (props.visible === false) {
          trapped.value = false;
        }
      };
      const onFocusAfterTrapped = () => {
        emit("focus");
      };
      const onFocusAfterReleased = (event) => {
        var _a2;
        if (((_a2 = event.detail) == null ? void 0 : _a2.focusReason) !== "pointer") {
          focusStartRef.value = "first";
          emit("blur");
        }
      };
      const onFocusInTrap = (event) => {
        if (props.visible && !trapped.value) {
          if (event.target) {
            focusStartRef.value = event.target;
          }
          trapped.value = true;
        }
      };
      const onFocusoutPrevented = (event) => {
        if (!props.trapping) {
          if (event.detail.focusReason === "pointer") {
            event.preventDefault();
          }
          trapped.value = false;
        }
      };
      const onReleaseRequested = () => {
        trapped.value = false;
        emit("close");
      };
      Vue.onMounted(() => {
        let updateHandle;
        Vue.watch(computedReference, (referenceEl) => {
          var _a2;
          updateHandle == null ? void 0 : updateHandle();
          const popperInstance = Vue.unref(popperInstanceRef);
          (_a2 = popperInstance == null ? void 0 : popperInstance.destroy) == null ? void 0 : _a2.call(popperInstance);
          if (referenceEl) {
            const popperContentEl = Vue.unref(popperContentRef);
            contentRef.value = popperContentEl;
            popperInstanceRef.value = createPopperInstance({
              referenceEl,
              popperContentEl,
              arrowEl: Vue.unref(arrowRef)
            });
            updateHandle = Vue.watch(() => referenceEl.getBoundingClientRect(), () => updatePopper(), {
              immediate: true
            });
          } else {
            popperInstanceRef.value = void 0;
          }
        }, {
          immediate: true
        });
        Vue.watch(() => props.triggerTargetEl, (triggerTargetEl, prevTriggerTargetEl) => {
          triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
          triggerTargetAriaStopWatch = void 0;
          const el = Vue.unref(triggerTargetEl || popperContentRef.value);
          const prevEl = Vue.unref(prevTriggerTargetEl || popperContentRef.value);
          if (isElement(el)) {
            triggerTargetAriaStopWatch = Vue.watch([role, () => props.ariaLabel, ariaModal, () => props.id], (watches) => {
              ["role", "aria-label", "aria-modal", "id"].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (prevEl !== el && isElement(prevEl)) {
            ["role", "aria-label", "aria-modal", "id"].forEach((key) => {
              prevEl.removeAttribute(key);
            });
          }
        }, { immediate: true });
        Vue.watch(() => props.visible, togglePopperAlive, { immediate: true });
        Vue.watch(() => buildPopperOptions(props, {
          arrowEl: Vue.unref(arrowRef),
          arrowOffset: Vue.unref(arrowOffset)
        }), (option) => {
          var _a2;
          return (_a2 = popperInstanceRef.value) == null ? void 0 : _a2.setOptions(option);
        });
      });
      Vue.onBeforeUnmount(() => {
        triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
        triggerTargetAriaStopWatch = void 0;
      });
      expose({
        popperContentRef,
        popperInstanceRef,
        updatePopper,
        contentStyle
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          ref_key: "popperContentRef",
          ref: popperContentRef,
          style: Vue.normalizeStyle(Vue.unref(contentStyle)),
          class: Vue.normalizeClass(Vue.unref(contentClass)),
          tabindex: "-1",
          onMouseenter: _cache[0] || (_cache[0] = (e) => _ctx.$emit("mouseenter", e)),
          onMouseleave: _cache[1] || (_cache[1] = (e) => _ctx.$emit("mouseleave", e))
        }, [
          Vue.createVNode(Vue.unref(ElFocusTrap), {
            trapped: trapped.value,
            "trap-on-focus-in": true,
            "focus-trap-el": popperContentRef.value,
            "focus-start-el": focusStartRef.value,
            onFocusAfterTrapped,
            onFocusAfterReleased,
            onFocusin: onFocusInTrap,
            onFocusoutPrevented,
            onReleaseRequested
          }, {
            default: Vue.withCtx(() => [
              Vue.renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["trapped", "focus-trap-el", "focus-start-el"])
        ], 38);
      };
    }
  }));
  var ElPopperContent = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/popper/src/content.vue"]]);
  const ElPopper = withInstall(Popper);
  const ns = useNamespace("tooltip");
  const useTooltipContentProps = buildProps(__spreadProps(__spreadValues(__spreadValues({}, useDelayedToggleProps), popperContentProps), {
    appendTo: {
      type: definePropType([String, Object])
    },
    content: {
      type: String,
      default: ""
    },
    rawContent: {
      type: Boolean,
      default: false
    },
    persistent: Boolean,
    ariaLabel: String,
    visible: {
      type: definePropType(Boolean),
      default: null
    },
    transition: {
      type: String,
      default: `${ns.namespace.value}-fade-in-linear`
    },
    teleported: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean
    }
  }));
  const useTooltipTriggerProps = buildProps(__spreadProps(__spreadValues({}, popperTriggerProps), {
    disabled: Boolean,
    trigger: {
      type: definePropType([String, Array]),
      default: "hover"
    },
    triggerKeys: {
      type: definePropType(Array),
      default: () => [EVENT_CODE.enter, EVENT_CODE.space]
    }
  }));
  const {
    useModelToggleProps: useTooltipModelToggleProps,
    useModelToggleEmits: useTooltipModelToggleEmits,
    useModelToggle: useTooltipModelToggle
  } = createModelToggleComposable("visible");
  const useTooltipProps = buildProps(__spreadProps(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, popperProps), useTooltipModelToggleProps), useTooltipContentProps), useTooltipTriggerProps), popperArrowProps), {
    showArrow: {
      type: Boolean,
      default: true
    }
  }));
  const tooltipEmits = [
    ...useTooltipModelToggleEmits,
    "before-show",
    "before-hide",
    "show",
    "hide",
    "open",
    "close"
  ];
  const isTriggerType = (trigger2, type) => {
    if (isArray(trigger2)) {
      return trigger2.includes(type);
    }
    return trigger2 === type;
  };
  const whenTrigger = (trigger2, type, handler) => {
    return (e) => {
      isTriggerType(Vue.unref(trigger2), type) && handler(e);
    };
  };
  const __default__$c = Vue.defineComponent({
    name: "ElTooltipTrigger"
  });
  const _sfc_main$e = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$c), {
    props: useTooltipTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns2 = useNamespace("tooltip");
      const { controlled, id, open, onOpen, onClose, onToggle } = Vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const triggerRef = Vue.ref(null);
      const stopWhenControlledOrDisabled = () => {
        if (Vue.unref(controlled) || props.disabled) {
          return true;
        }
      };
      const trigger2 = Vue.toRef(props, "trigger");
      const onMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger2, "hover", onOpen));
      const onMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger2, "hover", onClose));
      const onClick = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger2, "click", (e) => {
        if (e.button === 0) {
          onToggle(e);
        }
      }));
      const onFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger2, "focus", onOpen));
      const onBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger2, "focus", onClose));
      const onContextMenu = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger2, "contextmenu", (e) => {
        e.preventDefault();
        onToggle(e);
      }));
      const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e) => {
        const { code } = e;
        if (props.triggerKeys.includes(code)) {
          e.preventDefault();
          onToggle(e);
        }
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createBlock(Vue.unref(ElPopperTrigger), {
          id: Vue.unref(id),
          "virtual-ref": _ctx.virtualRef,
          open: Vue.unref(open),
          "virtual-triggering": _ctx.virtualTriggering,
          class: Vue.normalizeClass(Vue.unref(ns2).e("trigger")),
          onBlur: Vue.unref(onBlur),
          onClick: Vue.unref(onClick),
          onContextmenu: Vue.unref(onContextMenu),
          onFocus: Vue.unref(onFocus),
          onMouseenter: Vue.unref(onMouseenter),
          onMouseleave: Vue.unref(onMouseleave),
          onKeydown: Vue.unref(onKeydown)
        }, {
          default: Vue.withCtx(() => [
            Vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "virtual-ref", "open", "virtual-triggering", "class", "onBlur", "onClick", "onContextmenu", "onFocus", "onMouseenter", "onMouseleave", "onKeydown"]);
      };
    }
  }));
  var ElTooltipTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tooltip/src/trigger.vue"]]);
  const __default__$b = Vue.defineComponent({
    name: "ElTooltipContent",
    inheritAttrs: false
  });
  const _sfc_main$d = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$b), {
    props: useTooltipContentProps,
    setup(__props, { expose }) {
      const props = __props;
      const { selector } = usePopperContainerId();
      const contentRef = Vue.ref(null);
      const destroyed = Vue.ref(false);
      const {
        controlled,
        id,
        open,
        trigger: trigger2,
        onClose,
        onOpen,
        onShow,
        onHide,
        onBeforeShow,
        onBeforeHide
      } = Vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const persistentRef = Vue.computed(() => {
        return props.persistent;
      });
      Vue.onBeforeUnmount(() => {
        destroyed.value = true;
      });
      const shouldRender = Vue.computed(() => {
        return Vue.unref(persistentRef) ? true : Vue.unref(open);
      });
      const shouldShow = Vue.computed(() => {
        return props.disabled ? false : Vue.unref(open);
      });
      const appendTo = Vue.computed(() => {
        return props.appendTo || selector.value;
      });
      const contentStyle = Vue.computed(() => {
        var _a2;
        return (_a2 = props.style) != null ? _a2 : {};
      });
      const ariaHidden = Vue.computed(() => !Vue.unref(open));
      const onTransitionLeave = () => {
        onHide();
      };
      const stopWhenControlled = () => {
        if (Vue.unref(controlled))
          return true;
      };
      const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
        if (props.enterable && Vue.unref(trigger2) === "hover") {
          onOpen();
        }
      });
      const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
        if (Vue.unref(trigger2) === "hover") {
          onClose();
        }
      });
      const onBeforeEnter = () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        onBeforeShow == null ? void 0 : onBeforeShow();
      };
      const onBeforeLeave = () => {
        onBeforeHide == null ? void 0 : onBeforeHide();
      };
      const onAfterShow = () => {
        onShow();
        stopHandle = onClickOutside(Vue.computed(() => {
          var _a2;
          return (_a2 = contentRef.value) == null ? void 0 : _a2.popperContentRef;
        }), () => {
          if (Vue.unref(controlled))
            return;
          const $trigger = Vue.unref(trigger2);
          if ($trigger !== "hover") {
            onClose();
          }
        });
      };
      const onBlur = () => {
        if (!props.virtualTriggering) {
          onClose();
        }
      };
      let stopHandle;
      Vue.watch(() => Vue.unref(open), (val) => {
        if (!val) {
          stopHandle == null ? void 0 : stopHandle();
        }
      }, {
        flush: "post"
      });
      Vue.watch(() => props.content, () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      });
      expose({
        contentRef
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createBlock(Vue.Teleport, {
          disabled: !_ctx.teleported,
          to: Vue.unref(appendTo)
        }, [
          Vue.createVNode(Vue.Transition, {
            name: _ctx.transition,
            onAfterLeave: onTransitionLeave,
            onBeforeEnter,
            onAfterEnter: onAfterShow,
            onBeforeLeave
          }, {
            default: Vue.withCtx(() => [
              Vue.unref(shouldRender) ? Vue.withDirectives((Vue.openBlock(), Vue.createBlock(Vue.unref(ElPopperContent), Vue.mergeProps({
                key: 0,
                id: Vue.unref(id),
                ref_key: "contentRef",
                ref: contentRef
              }, _ctx.$attrs, {
                "aria-label": _ctx.ariaLabel,
                "aria-hidden": Vue.unref(ariaHidden),
                "boundaries-padding": _ctx.boundariesPadding,
                "fallback-placements": _ctx.fallbackPlacements,
                "gpu-acceleration": _ctx.gpuAcceleration,
                offset: _ctx.offset,
                placement: _ctx.placement,
                "popper-options": _ctx.popperOptions,
                strategy: _ctx.strategy,
                effect: _ctx.effect,
                enterable: _ctx.enterable,
                pure: _ctx.pure,
                "popper-class": _ctx.popperClass,
                "popper-style": [_ctx.popperStyle, Vue.unref(contentStyle)],
                "reference-el": _ctx.referenceEl,
                "trigger-target-el": _ctx.triggerTargetEl,
                visible: Vue.unref(shouldShow),
                "z-index": _ctx.zIndex,
                onMouseenter: Vue.unref(onContentEnter),
                onMouseleave: Vue.unref(onContentLeave),
                onBlur,
                onClose: Vue.unref(onClose)
              }), {
                default: Vue.withCtx(() => [
                  !destroyed.value ? Vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : Vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 16, ["id", "aria-label", "aria-hidden", "boundaries-padding", "fallback-placements", "gpu-acceleration", "offset", "placement", "popper-options", "strategy", "effect", "enterable", "pure", "popper-class", "popper-style", "reference-el", "trigger-target-el", "visible", "z-index", "onMouseenter", "onMouseleave", "onClose"])), [
                [Vue.vShow, Vue.unref(shouldShow)]
              ]) : Vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["name"])
        ], 8, ["disabled", "to"]);
      };
    }
  }));
  var ElTooltipContent = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tooltip/src/content.vue"]]);
  const _hoisted_1$9 = ["innerHTML"];
  const _hoisted_2$7 = { key: 1 };
  const __default__$a = Vue.defineComponent({
    name: "ElTooltip"
  });
  const _sfc_main$c = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$a), {
    props: useTooltipProps,
    emits: tooltipEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      usePopperContainer();
      const id = useId();
      const popperRef = Vue.ref();
      const contentRef = Vue.ref();
      const updatePopper = () => {
        var _a2;
        const popperComponent = Vue.unref(popperRef);
        if (popperComponent) {
          (_a2 = popperComponent.popperInstanceRef) == null ? void 0 : _a2.update();
        }
      };
      const open = Vue.ref(false);
      const toggleReason = Vue.ref();
      const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
        indicator: open,
        toggleReason
      });
      const { onOpen, onClose } = useDelayedToggle({
        showAfter: Vue.toRef(props, "showAfter"),
        hideAfter: Vue.toRef(props, "hideAfter"),
        open: show,
        close: hide
      });
      const controlled = Vue.computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);
      Vue.provide(TOOLTIP_INJECTION_KEY, {
        controlled,
        id,
        open: Vue.readonly(open),
        trigger: Vue.toRef(props, "trigger"),
        onOpen: (event) => {
          onOpen(event);
        },
        onClose: (event) => {
          onClose(event);
        },
        onToggle: (event) => {
          if (Vue.unref(open)) {
            onClose(event);
          } else {
            onOpen(event);
          }
        },
        onShow: () => {
          emit("show", toggleReason.value);
        },
        onHide: () => {
          emit("hide", toggleReason.value);
        },
        onBeforeShow: () => {
          emit("before-show", toggleReason.value);
        },
        onBeforeHide: () => {
          emit("before-hide", toggleReason.value);
        },
        updatePopper
      });
      Vue.watch(() => props.disabled, (disabled) => {
        if (disabled && open.value) {
          open.value = false;
        }
      });
      const isFocusInsideContent = () => {
        var _a2, _b;
        const popperContent = (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.contentRef) == null ? void 0 : _b.popperContentRef;
        return popperContent && popperContent.contains(document.activeElement);
      };
      Vue.onDeactivated(() => open.value && hide());
      expose({
        popperRef,
        contentRef,
        isFocusInsideContent,
        updatePopper,
        onOpen,
        onClose,
        hide
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createBlock(Vue.unref(ElPopper), {
          ref_key: "popperRef",
          ref: popperRef,
          role: _ctx.role
        }, {
          default: Vue.withCtx(() => [
            Vue.createVNode(ElTooltipTrigger, {
              disabled: _ctx.disabled,
              trigger: _ctx.trigger,
              "trigger-keys": _ctx.triggerKeys,
              "virtual-ref": _ctx.virtualRef,
              "virtual-triggering": _ctx.virtualTriggering
            }, {
              default: Vue.withCtx(() => [
                _ctx.$slots.default ? Vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : Vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["disabled", "trigger", "trigger-keys", "virtual-ref", "virtual-triggering"]),
            Vue.createVNode(ElTooltipContent, {
              ref_key: "contentRef",
              ref: contentRef,
              "aria-label": _ctx.ariaLabel,
              "boundaries-padding": _ctx.boundariesPadding,
              content: _ctx.content,
              disabled: _ctx.disabled,
              effect: _ctx.effect,
              enterable: _ctx.enterable,
              "fallback-placements": _ctx.fallbackPlacements,
              "hide-after": _ctx.hideAfter,
              "gpu-acceleration": _ctx.gpuAcceleration,
              offset: _ctx.offset,
              persistent: _ctx.persistent,
              "popper-class": _ctx.popperClass,
              "popper-style": _ctx.popperStyle,
              placement: _ctx.placement,
              "popper-options": _ctx.popperOptions,
              pure: _ctx.pure,
              "raw-content": _ctx.rawContent,
              "reference-el": _ctx.referenceEl,
              "trigger-target-el": _ctx.triggerTargetEl,
              "show-after": _ctx.showAfter,
              strategy: _ctx.strategy,
              teleported: _ctx.teleported,
              transition: _ctx.transition,
              "virtual-triggering": _ctx.virtualTriggering,
              "z-index": _ctx.zIndex,
              "append-to": _ctx.appendTo
            }, {
              default: Vue.withCtx(() => [
                Vue.renderSlot(_ctx.$slots, "content", {}, () => [
                  _ctx.rawContent ? (Vue.openBlock(), Vue.createElementBlock("span", {
                    key: 0,
                    innerHTML: _ctx.content
                  }, null, 8, _hoisted_1$9)) : (Vue.openBlock(), Vue.createElementBlock("span", _hoisted_2$7, Vue.toDisplayString(_ctx.content), 1))
                ]),
                _ctx.showArrow ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElPopperArrow), {
                  key: 0,
                  "arrow-offset": _ctx.arrowOffset
                }, null, 8, ["arrow-offset"])) : Vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["aria-label", "boundaries-padding", "content", "disabled", "effect", "enterable", "fallback-placements", "hide-after", "gpu-acceleration", "offset", "persistent", "popper-class", "popper-style", "placement", "popper-options", "pure", "raw-content", "reference-el", "trigger-target-el", "show-after", "strategy", "teleported", "transition", "virtual-triggering", "z-index", "append-to"])
          ]),
          _: 3
        }, 8, ["role"]);
      };
    }
  }));
  var Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/tooltip/src/tooltip.vue"]]);
  const ElTooltip = withInstall(Tooltip);
  const useButton = (props, emit) => {
    useDeprecated({
      from: "type.text",
      replacement: "link",
      version: "3.0.0",
      scope: "props",
      ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
    }, Vue.computed(() => props.type === "text"));
    const buttonGroupContext = Vue.inject(buttonGroupContextKey, void 0);
    const globalConfig2 = useGlobalConfig("button");
    const { form } = useFormItem();
    const _size = useSize(Vue.computed(() => buttonGroupContext == null ? void 0 : buttonGroupContext.size));
    const _disabled = useDisabled();
    const _ref = Vue.ref();
    const slots = Vue.useSlots();
    const _type = Vue.computed(() => props.type || (buttonGroupContext == null ? void 0 : buttonGroupContext.type) || "");
    const autoInsertSpace = Vue.computed(() => {
      var _a2, _b, _c;
      return (_c = (_b = props.autoInsertSpace) != null ? _b : (_a2 = globalConfig2.value) == null ? void 0 : _a2.autoInsertSpace) != null ? _c : false;
    });
    const shouldAddSpace = Vue.computed(() => {
      var _a2;
      const defaultSlot = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
      if (autoInsertSpace.value && (defaultSlot == null ? void 0 : defaultSlot.length) === 1) {
        const slot = defaultSlot[0];
        if ((slot == null ? void 0 : slot.type) === Vue.Text) {
          const text = slot.children;
          return /^\p{Unified_Ideograph}{2}$/u.test(text.trim());
        }
      }
      return false;
    });
    const handleClick = (evt) => {
      if (props.nativeType === "reset") {
        form == null ? void 0 : form.resetFields();
      }
      emit("click", evt);
    };
    return {
      _disabled,
      _size,
      _type,
      _ref,
      shouldAddSpace,
      handleClick
    };
  };
  const buttonTypes = [
    "default",
    "primary",
    "success",
    "warning",
    "info",
    "danger",
    "text",
    ""
  ];
  const buttonNativeTypes = ["button", "submit", "reset"];
  const buttonProps = buildProps({
    size: useSizeProp,
    disabled: Boolean,
    type: {
      type: String,
      values: buttonTypes,
      default: ""
    },
    icon: {
      type: iconPropType
    },
    nativeType: {
      type: String,
      values: buttonNativeTypes,
      default: "button"
    },
    loading: Boolean,
    loadingIcon: {
      type: iconPropType,
      default: () => loading_default
    },
    plain: Boolean,
    text: Boolean,
    link: Boolean,
    bg: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    color: String,
    dark: Boolean,
    autoInsertSpace: {
      type: Boolean,
      default: void 0
    }
  });
  const buttonEmits = {
    click: (evt) => evt instanceof MouseEvent
  };
  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function clamp01(val) {
    return Math.min(1, Math.max(0, val));
  }
  function isOnePointZero(n) {
    return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
  }
  function isPercentage(n) {
    return typeof n === "string" && n.indexOf("%") !== -1;
  }
  function boundAlpha(a2) {
    a2 = parseFloat(a2);
    if (isNaN(a2) || a2 < 0 || a2 > 1) {
      a2 = 1;
    }
    return a2;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return "".concat(Number(n) * 100, "%");
    }
    return n;
  }
  function pad2(c2) {
    return c2.length === 1 ? "0" + c2 : String(c2);
  }
  function rgbToRgb(r, g, b2) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b2, 255) * 255
    };
  }
  function rgbToHsl(r, g, b2) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b2 = bound01(b2, 255);
    var max = Math.max(r, g, b2);
    var min = Math.min(r, g, b2);
    var h2 = 0;
    var s2 = 0;
    var l2 = (max + min) / 2;
    if (max === min) {
      s2 = 0;
      h2 = 0;
    } else {
      var d2 = max - min;
      s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
      switch (max) {
        case r:
          h2 = (g - b2) / d2 + (g < b2 ? 6 : 0);
          break;
        case g:
          h2 = (b2 - r) / d2 + 2;
          break;
        case b2:
          h2 = (r - g) / d2 + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s: s2, l: l2 };
  }
  function hue2rgb(p2, q2, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p2 + (q2 - p2) * (6 * t);
    }
    if (t < 1 / 2) {
      return q2;
    }
    if (t < 2 / 3) {
      return p2 + (q2 - p2) * (2 / 3 - t) * 6;
    }
    return p2;
  }
  function hslToRgb(h2, s2, l2) {
    var r;
    var g;
    var b2;
    h2 = bound01(h2, 360);
    s2 = bound01(s2, 100);
    l2 = bound01(l2, 100);
    if (s2 === 0) {
      g = l2;
      b2 = l2;
      r = l2;
    } else {
      var q2 = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
      var p2 = 2 * l2 - q2;
      r = hue2rgb(p2, q2, h2 + 1 / 3);
      g = hue2rgb(p2, q2, h2);
      b2 = hue2rgb(p2, q2, h2 - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b2 * 255 };
  }
  function rgbToHsv(r, g, b2) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b2 = bound01(b2, 255);
    var max = Math.max(r, g, b2);
    var min = Math.min(r, g, b2);
    var h2 = 0;
    var v2 = max;
    var d2 = max - min;
    var s2 = max === 0 ? 0 : d2 / max;
    if (max === min) {
      h2 = 0;
    } else {
      switch (max) {
        case r:
          h2 = (g - b2) / d2 + (g < b2 ? 6 : 0);
          break;
        case g:
          h2 = (b2 - r) / d2 + 2;
          break;
        case b2:
          h2 = (r - g) / d2 + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s: s2, v: v2 };
  }
  function hsvToRgb(h2, s2, v2) {
    h2 = bound01(h2, 360) * 6;
    s2 = bound01(s2, 100);
    v2 = bound01(v2, 100);
    var i = Math.floor(h2);
    var f2 = h2 - i;
    var p2 = v2 * (1 - s2);
    var q2 = v2 * (1 - f2 * s2);
    var t = v2 * (1 - (1 - f2) * s2);
    var mod = i % 6;
    var r = [v2, q2, p2, p2, t, v2][mod];
    var g = [t, v2, v2, q2, p2, p2][mod];
    var b2 = [p2, p2, t, v2, v2, q2][mod];
    return { r: r * 255, g: g * 255, b: b2 * 255 };
  }
  function rgbToHex(r, g, b2, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b2).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function rgbaToHex(r, g, b2, a2, allow4Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b2).toString(16)),
      pad2(convertDecimalToHex(a2))
    ];
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join("");
  }
  function convertDecimalToHex(d2) {
    return Math.round(parseFloat(d2) * 255).toString(16);
  }
  function convertHexToDecimal(h2) {
    return parseIntFromHex(h2) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  function numberInputToObject(color) {
    return {
      r: color >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    };
  }
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a2 = 1;
    var s2 = null;
    var v2 = null;
    var l2 = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s2 = convertToPercentage(color.s);
        v2 = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s2, v2);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s2 = convertToPercentage(color.s);
        l2 = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s2, l2);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a2 = color.a;
      }
    }
    a2 = boundAlpha(a2);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a: a2
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }
  var TinyColor = function() {
    function TinyColor2(color, opts) {
      if (color === void 0) {
        color = "";
      }
      if (opts === void 0) {
        opts = {};
      }
      var _a2;
      if (color instanceof TinyColor2) {
        return color;
      }
      if (typeof color === "number") {
        color = numberInputToObject(color);
      }
      this.originalInput = color;
      var rgb = inputToRGB(color);
      this.originalInput = color;
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a2 = opts.format) !== null && _a2 !== void 0 ? _a2 : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = rgb.ok;
    }
    TinyColor2.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };
    TinyColor2.prototype.isLight = function() {
      return !this.isDark();
    };
    TinyColor2.prototype.getBrightness = function() {
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    };
    TinyColor2.prototype.getLuminance = function() {
      var rgb = this.toRgb();
      var R2;
      var G2;
      var B2;
      var RsRGB = rgb.r / 255;
      var GsRGB = rgb.g / 255;
      var BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R2 = RsRGB / 12.92;
      } else {
        R2 = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G2 = GsRGB / 12.92;
      } else {
        G2 = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B2 = BsRGB / 12.92;
      } else {
        B2 = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
    };
    TinyColor2.prototype.getAlpha = function() {
      return this.a;
    };
    TinyColor2.prototype.setAlpha = function(alpha) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    };
    TinyColor2.prototype.isMonochrome = function() {
      var s2 = this.toHsl().s;
      return s2 === 0;
    };
    TinyColor2.prototype.toHsv = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor2.prototype.toHsvString = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      var h2 = Math.round(hsv.h * 360);
      var s2 = Math.round(hsv.s * 100);
      var v2 = Math.round(hsv.v * 100);
      return this.a === 1 ? "hsv(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%)") : "hsva(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHsl = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor2.prototype.toHslString = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      var h2 = Math.round(hsl.h * 360);
      var s2 = Math.round(hsl.s * 100);
      var l2 = Math.round(hsl.l * 100);
      return this.a === 1 ? "hsl(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%)") : "hsla(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHex = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor2.prototype.toHexString = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return "#" + this.toHex(allow3Char);
    };
    TinyColor2.prototype.toHex8 = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor2.prototype.toHex8String = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return "#" + this.toHex8(allow4Char);
    };
    TinyColor2.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toRgbString = function() {
      var r = Math.round(this.r);
      var g = Math.round(this.g);
      var b2 = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b2, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b2, ", ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toPercentageRgb = function() {
      var fmt = function(x2) {
        return "".concat(Math.round(bound01(x2, 255) * 100), "%");
      };
      return {
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toPercentageRgbString = function() {
      var rnd = function(x2) {
        return Math.round(bound01(x2, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toName = function() {
      if (this.a === 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return false;
      }
      var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
      for (var _i = 0, _a2 = Object.entries(names); _i < _a2.length; _i++) {
        var _b = _a2[_i], key = _b[0], value = _b[1];
        if (hex === value) {
          return key;
        }
      }
      return false;
    };
    TinyColor2.prototype.toString = function(format) {
      var formatSet = Boolean(format);
      format = format !== null && format !== void 0 ? format : this.format;
      var formattedString = false;
      var hasAlpha = this.a < 1 && this.a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
      if (needsAlphaFormat) {
        if (format === "name" && this.a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format === "rgb") {
        formattedString = this.toRgbString();
      }
      if (format === "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (format === "hex" || format === "hex6") {
        formattedString = this.toHexString();
      }
      if (format === "hex3") {
        formattedString = this.toHexString(true);
      }
      if (format === "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (format === "hex8") {
        formattedString = this.toHex8String();
      }
      if (format === "name") {
        formattedString = this.toName();
      }
      if (format === "hsl") {
        formattedString = this.toHslString();
      }
      if (format === "hsv") {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };
    TinyColor2.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor2.prototype.clone = function() {
      return new TinyColor2(this.toString());
    };
    TinyColor2.prototype.lighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.brighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor2(rgb);
    };
    TinyColor2.prototype.darken = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.tint = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("white", amount);
    };
    TinyColor2.prototype.shade = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("black", amount);
    };
    TinyColor2.prototype.desaturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.saturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.greyscale = function() {
      return this.desaturate(100);
    };
    TinyColor2.prototype.spin = function(amount) {
      var hsl = this.toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.mix = function(color, amount) {
      if (amount === void 0) {
        amount = 50;
      }
      var rgb1 = this.toRgb();
      var rgb2 = new TinyColor2(color).toRgb();
      var p2 = amount / 100;
      var rgba = {
        r: (rgb2.r - rgb1.r) * p2 + rgb1.r,
        g: (rgb2.g - rgb1.g) * p2 + rgb1.g,
        b: (rgb2.b - rgb1.b) * p2 + rgb1.b,
        a: (rgb2.a - rgb1.a) * p2 + rgb1.a
      };
      return new TinyColor2(rgba);
    };
    TinyColor2.prototype.analogous = function(results, slices) {
      if (results === void 0) {
        results = 6;
      }
      if (slices === void 0) {
        slices = 30;
      }
      var hsl = this.toHsl();
      var part = 360 / slices;
      var ret = [this];
      for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor2(hsl));
      }
      return ret;
    };
    TinyColor2.prototype.complement = function() {
      var hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.monochromatic = function(results) {
      if (results === void 0) {
        results = 6;
      }
      var hsv = this.toHsv();
      var h2 = hsv.h;
      var s2 = hsv.s;
      var v2 = hsv.v;
      var res = [];
      var modification = 1 / results;
      while (results--) {
        res.push(new TinyColor2({ h: h2, s: s2, v: v2 }));
        v2 = (v2 + modification) % 1;
      }
      return res;
    };
    TinyColor2.prototype.splitcomplement = function() {
      var hsl = this.toHsl();
      var h2 = hsl.h;
      return [
        this,
        new TinyColor2({ h: (h2 + 72) % 360, s: hsl.s, l: hsl.l }),
        new TinyColor2({ h: (h2 + 216) % 360, s: hsl.s, l: hsl.l })
      ];
    };
    TinyColor2.prototype.onBackground = function(background) {
      var fg = this.toRgb();
      var bg = new TinyColor2(background).toRgb();
      return new TinyColor2({
        r: bg.r + (fg.r - bg.r) * fg.a,
        g: bg.g + (fg.g - bg.g) * fg.a,
        b: bg.b + (fg.b - bg.b) * fg.a
      });
    };
    TinyColor2.prototype.triad = function() {
      return this.polyad(3);
    };
    TinyColor2.prototype.tetrad = function() {
      return this.polyad(4);
    };
    TinyColor2.prototype.polyad = function(n) {
      var hsl = this.toHsl();
      var h2 = hsl.h;
      var result = [this];
      var increment = 360 / n;
      for (var i = 1; i < n; i++) {
        result.push(new TinyColor2({ h: (h2 + i * increment) % 360, s: hsl.s, l: hsl.l }));
      }
      return result;
    };
    TinyColor2.prototype.equals = function(color) {
      return this.toRgbString() === new TinyColor2(color).toRgbString();
    };
    return TinyColor2;
  }();
  function darken(color, amount = 20) {
    return color.mix("#141414", amount).toString();
  }
  function useButtonCustomStyle(props) {
    const _disabled = useDisabled();
    const ns2 = useNamespace("button");
    return Vue.computed(() => {
      let styles = {};
      const buttonColor = props.color;
      if (buttonColor) {
        const color = new TinyColor(buttonColor);
        const activeBgColor = props.dark ? color.tint(20).toString() : darken(color, 20);
        if (props.plain) {
          styles = ns2.cssVarBlock({
            "bg-color": props.dark ? darken(color, 90) : color.tint(90).toString(),
            "text-color": buttonColor,
            "border-color": props.dark ? darken(color, 50) : color.tint(50).toString(),
            "hover-text-color": `var(${ns2.cssVarName("color-white")})`,
            "hover-bg-color": buttonColor,
            "hover-border-color": buttonColor,
            "active-bg-color": activeBgColor,
            "active-text-color": `var(${ns2.cssVarName("color-white")})`,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            styles[ns2.cssVarBlockName("disabled-bg-color")] = props.dark ? darken(color, 90) : color.tint(90).toString();
            styles[ns2.cssVarBlockName("disabled-text-color")] = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns2.cssVarBlockName("disabled-border-color")] = props.dark ? darken(color, 80) : color.tint(80).toString();
          }
        } else {
          const hoverBgColor = props.dark ? darken(color, 30) : color.tint(30).toString();
          const textColor = color.isDark() ? `var(${ns2.cssVarName("color-white")})` : `var(${ns2.cssVarName("color-black")})`;
          styles = ns2.cssVarBlock({
            "bg-color": buttonColor,
            "text-color": textColor,
            "border-color": buttonColor,
            "hover-bg-color": hoverBgColor,
            "hover-text-color": textColor,
            "hover-border-color": hoverBgColor,
            "active-bg-color": activeBgColor,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            const disabledButtonColor = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns2.cssVarBlockName("disabled-bg-color")] = disabledButtonColor;
            styles[ns2.cssVarBlockName("disabled-text-color")] = props.dark ? "rgba(255, 255, 255, 0.5)" : `var(${ns2.cssVarName("color-white")})`;
            styles[ns2.cssVarBlockName("disabled-border-color")] = disabledButtonColor;
          }
        }
      }
      return styles;
    });
  }
  const _hoisted_1$8 = ["aria-disabled", "disabled", "autofocus", "type"];
  const __default__$9 = Vue.defineComponent({
    name: "ElButton"
  });
  const _sfc_main$b = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$9), {
    props: buttonProps,
    emits: buttonEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const buttonStyle = useButtonCustomStyle(props);
      const ns2 = useNamespace("button");
      const { _ref, _size, _type, _disabled, shouldAddSpace, handleClick } = useButton(props, emit);
      expose({
        ref: _ref,
        size: _size,
        type: _type,
        disabled: _disabled,
        shouldAddSpace
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("button", {
          ref_key: "_ref",
          ref: _ref,
          class: Vue.normalizeClass([
            Vue.unref(ns2).b(),
            Vue.unref(ns2).m(Vue.unref(_type)),
            Vue.unref(ns2).m(Vue.unref(_size)),
            Vue.unref(ns2).is("disabled", Vue.unref(_disabled)),
            Vue.unref(ns2).is("loading", _ctx.loading),
            Vue.unref(ns2).is("plain", _ctx.plain),
            Vue.unref(ns2).is("round", _ctx.round),
            Vue.unref(ns2).is("circle", _ctx.circle),
            Vue.unref(ns2).is("text", _ctx.text),
            Vue.unref(ns2).is("link", _ctx.link),
            Vue.unref(ns2).is("has-bg", _ctx.bg)
          ]),
          "aria-disabled": Vue.unref(_disabled) || _ctx.loading,
          disabled: Vue.unref(_disabled) || _ctx.loading,
          autofocus: _ctx.autofocus,
          type: _ctx.nativeType,
          style: Vue.normalizeStyle(Vue.unref(buttonStyle)),
          onClick: _cache[0] || (_cache[0] = (...args) => Vue.unref(handleClick) && Vue.unref(handleClick)(...args))
        }, [
          _ctx.loading ? (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 0 }, [
            _ctx.$slots.loading ? Vue.renderSlot(_ctx.$slots, "loading", { key: 0 }) : (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
              key: 1,
              class: Vue.normalizeClass(Vue.unref(ns2).is("loading"))
            }, {
              default: Vue.withCtx(() => [
                (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(_ctx.loadingIcon)))
              ]),
              _: 1
            }, 8, ["class"]))
          ], 64)) : _ctx.icon || _ctx.$slots.icon ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), { key: 1 }, {
            default: Vue.withCtx(() => [
              _ctx.icon ? (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(_ctx.icon), { key: 0 })) : Vue.renderSlot(_ctx.$slots, "icon", { key: 1 })
            ]),
            _: 3
          })) : Vue.createCommentVNode("v-if", true),
          _ctx.$slots.default ? (Vue.openBlock(), Vue.createElementBlock("span", {
            key: 2,
            class: Vue.normalizeClass({ [Vue.unref(ns2).em("text", "expand")]: Vue.unref(shouldAddSpace) })
          }, [
            Vue.renderSlot(_ctx.$slots, "default")
          ], 2)) : Vue.createCommentVNode("v-if", true)
        ], 14, _hoisted_1$8);
      };
    }
  }));
  var Button = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/button/src/button.vue"]]);
  const buttonGroupProps = {
    size: buttonProps.size,
    type: buttonProps.type
  };
  const __default__$8 = Vue.defineComponent({
    name: "ElButtonGroup"
  });
  const _sfc_main$a = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$8), {
    props: buttonGroupProps,
    setup(__props) {
      const props = __props;
      Vue.provide(buttonGroupContextKey, Vue.reactive({
        size: Vue.toRef(props, "size"),
        type: Vue.toRef(props, "type")
      }));
      const ns2 = useNamespace("button");
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: Vue.normalizeClass(`${Vue.unref(ns2).b("group")}`)
        }, [
          Vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  }));
  var ButtonGroup = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/button/src/button-group.vue"]]);
  const ElButton = withInstall(Button, {
    ButtonGroup
  });
  withNoopInstall(ButtonGroup);
  const nodeList = /* @__PURE__ */ new Map();
  let startClick;
  if (isClient) {
    document.addEventListener("mousedown", (e) => startClick = e);
    document.addEventListener("mouseup", (e) => {
      for (const handlers of nodeList.values()) {
        for (const { documentHandler } of handlers) {
          documentHandler(e, startClick);
        }
      }
    });
  }
  function createDocumentHandler(el, binding) {
    let excludes = [];
    if (Array.isArray(binding.arg)) {
      excludes = binding.arg;
    } else if (isElement(binding.arg)) {
      excludes.push(binding.arg);
    }
    return function(mouseup, mousedown) {
      const popperRef = binding.instance.popperRef;
      const mouseUpTarget = mouseup.target;
      const mouseDownTarget = mousedown == null ? void 0 : mousedown.target;
      const isBound = !binding || !binding.instance;
      const isTargetExists = !mouseUpTarget || !mouseDownTarget;
      const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
      const isSelf = el === mouseUpTarget;
      const isTargetExcluded = excludes.length && excludes.some((item) => item == null ? void 0 : item.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
      const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
      if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
        return;
      }
      binding.value(mouseup, mousedown);
    };
  }
  const ClickOutside = {
    beforeMount(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      nodeList.get(el).push({
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      });
    },
    updated(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      const handlers = nodeList.get(el);
      const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue);
      const newHandler = {
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      };
      if (oldHandlerIndex >= 0) {
        handlers.splice(oldHandlerIndex, 1, newHandler);
      } else {
        handlers.push(newHandler);
      }
    },
    unmounted(el) {
      nodeList.delete(el);
    }
  };
  var v = false, o, f, s, u, d, N, l, p, m, w, D, x, E, M, F;
  function a() {
    if (!v) {
      v = true;
      var e = navigator.userAgent, n = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(e), i = /(Mac OS X)|(Windows)|(Linux)/.exec(e);
      if (x = /\b(iPhone|iP[ao]d)/.exec(e), E = /\b(iP[ao]d)/.exec(e), w = /Android/i.exec(e), M = /FBAN\/\w+;/i.exec(e), F = /Mobile/i.exec(e), D = !!/Win64/.exec(e), n) {
        o = n[1] ? parseFloat(n[1]) : n[5] ? parseFloat(n[5]) : NaN, o && document && document.documentMode && (o = document.documentMode);
        var r = /(?:Trident\/(\d+.\d+))/.exec(e);
        N = r ? parseFloat(r[1]) + 4 : o, f = n[2] ? parseFloat(n[2]) : NaN, s = n[3] ? parseFloat(n[3]) : NaN, u = n[4] ? parseFloat(n[4]) : NaN, u ? (n = /(?:Chrome\/(\d+\.\d+))/.exec(e), d = n && n[1] ? parseFloat(n[1]) : NaN) : d = NaN;
      } else
        o = f = s = d = u = NaN;
      if (i) {
        if (i[1]) {
          var t = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e);
          l = t ? parseFloat(t[1].replace("_", ".")) : true;
        } else
          l = false;
        p = !!i[2], m = !!i[3];
      } else
        l = p = m = false;
    }
  }
  var _ = { ie: function() {
    return a() || o;
  }, ieCompatibilityMode: function() {
    return a() || N > o;
  }, ie64: function() {
    return _.ie() && D;
  }, firefox: function() {
    return a() || f;
  }, opera: function() {
    return a() || s;
  }, webkit: function() {
    return a() || u;
  }, safari: function() {
    return _.webkit();
  }, chrome: function() {
    return a() || d;
  }, windows: function() {
    return a() || p;
  }, osx: function() {
    return a() || l;
  }, linux: function() {
    return a() || m;
  }, iphone: function() {
    return a() || x;
  }, mobile: function() {
    return a() || x || E || w || F;
  }, nativeApp: function() {
    return a() || M;
  }, android: function() {
    return a() || w;
  }, ipad: function() {
    return a() || E;
  } }, A = _;
  var c = !!(typeof window < "u" && window.document && window.document.createElement), U = { canUseDOM: c, canUseWorkers: typeof Worker < "u", canUseEventListeners: c && !!(window.addEventListener || window.attachEvent), canUseViewport: c && !!window.screen, isInWorker: !c }, h = U;
  var X;
  h.canUseDOM && (X = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== true);
  function S(e, n) {
    if (!h.canUseDOM || n && !("addEventListener" in document))
      return false;
    var i = "on" + e, r = i in document;
    if (!r) {
      var t = document.createElement("div");
      t.setAttribute(i, "return;"), r = typeof t[i] == "function";
    }
    return !r && X && e === "wheel" && (r = document.implementation.hasFeature("Events.wheel", "3.0")), r;
  }
  var b = S;
  var O = 10, I = 40, P = 800;
  function T(e) {
    var n = 0, i = 0, r = 0, t = 0;
    return "detail" in e && (i = e.detail), "wheelDelta" in e && (i = -e.wheelDelta / 120), "wheelDeltaY" in e && (i = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (n = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (n = i, i = 0), r = n * O, t = i * O, "deltaY" in e && (t = e.deltaY), "deltaX" in e && (r = e.deltaX), (r || t) && e.deltaMode && (e.deltaMode == 1 ? (r *= I, t *= I) : (r *= P, t *= P)), r && !n && (n = r < 1 ? -1 : 1), t && !i && (i = t < 1 ? -1 : 1), { spinX: n, spinY: i, pixelX: r, pixelY: t };
  }
  T.getEventType = function() {
    return A.firefox() ? "DOMMouseScroll" : b("wheel") ? "wheel" : "mousewheel";
  };
  var Y = T;
  /**
  * Checks if an event is supported in the current execution environment.
  *
  * NOTE: This will not work correctly for non-generic events such as `change`,
  * `reset`, `load`, `error`, and `select`.
  *
  * Borrows from Modernizr.
  *
  * @param {string} eventNameSuffix Event name, e.g. "click".
  * @param {?boolean} capture Check if the capture phase is supported.
  * @return {boolean} True if the event is supported.
  * @internal
  * @license Modernizr 3.0.0pre (Custom Build) | MIT
  */
  const mousewheel = function(element, callback) {
    if (element && element.addEventListener) {
      const fn2 = function(event) {
        const normalized = Y(event);
        callback && Reflect.apply(callback, this, [event, normalized]);
      };
      element.addEventListener("wheel", fn2, { passive: true });
    }
  };
  const Mousewheel = {
    beforeMount(el, binding) {
      mousewheel(el, binding.value);
    }
  };
  const checkboxProps = {
    modelValue: {
      type: [Number, String, Boolean],
      default: void 0
    },
    label: {
      type: [String, Boolean, Number, Object]
    },
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: {
      type: String,
      default: void 0
    },
    trueLabel: {
      type: [String, Number],
      default: void 0
    },
    falseLabel: {
      type: [String, Number],
      default: void 0
    },
    id: {
      type: String,
      default: void 0
    },
    controls: {
      type: String,
      default: void 0
    },
    border: Boolean,
    size: useSizeProp,
    tabindex: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    }
  };
  const checkboxEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isString$1(val) || isNumber(val) || isBoolean(val),
    change: (val) => isString$1(val) || isNumber(val) || isBoolean(val)
  };
  const useCheckboxDisabled = ({
    model,
    isChecked
  }) => {
    const checkboxGroup = Vue.inject(checkboxGroupContextKey, void 0);
    const isLimitDisabled = Vue.computed(() => {
      var _a2, _b;
      const max = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value;
      const min = (_b = checkboxGroup == null ? void 0 : checkboxGroup.min) == null ? void 0 : _b.value;
      return !isUndefined(max) && model.value.length >= max && !isChecked.value || !isUndefined(min) && model.value.length <= min && isChecked.value;
    });
    const isDisabled = useDisabled(Vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.disabled.value) || isLimitDisabled.value));
    return {
      isDisabled,
      isLimitDisabled
    };
  };
  const useCheckboxEvent = (props, {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
    isLabeledByFormItem
  }) => {
    const checkboxGroup = Vue.inject(checkboxGroupContextKey, void 0);
    const { formItem } = useFormItem();
    const { emit } = Vue.getCurrentInstance();
    function getLabeledValue(value) {
      var _a2, _b;
      return value === props.trueLabel || value === true ? (_a2 = props.trueLabel) != null ? _a2 : true : (_b = props.falseLabel) != null ? _b : false;
    }
    function emitChangeEvent(checked, e) {
      emit("change", getLabeledValue(checked), e);
    }
    function handleChange(e) {
      if (isLimitExceeded.value)
        return;
      const target = e.target;
      emit("change", getLabeledValue(target.checked), e);
    }
    async function onClickRoot(e) {
      if (isLimitExceeded.value)
        return;
      if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
        const eventTargets = e.composedPath();
        const hasLabel = eventTargets.some((item) => item.tagName === "LABEL");
        if (!hasLabel) {
          model.value = getLabeledValue([false, props.falseLabel].includes(model.value));
          await Vue.nextTick();
          emitChangeEvent(model.value, e);
        }
      }
    }
    const validateEvent = Vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.validateEvent) || props.validateEvent);
    Vue.watch(() => props.modelValue, () => {
      if (validateEvent.value) {
        formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn(err));
      }
    });
    return {
      handleChange,
      onClickRoot
    };
  };
  const useCheckboxModel = (props) => {
    const selfModel = Vue.ref(false);
    const { emit } = Vue.getCurrentInstance();
    const checkboxGroup = Vue.inject(checkboxGroupContextKey, void 0);
    const isGroup = Vue.computed(() => isUndefined(checkboxGroup) === false);
    const isLimitExceeded = Vue.ref(false);
    const model = Vue.computed({
      get() {
        var _a2, _b;
        return isGroup.value ? (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.modelValue) == null ? void 0 : _a2.value : (_b = props.modelValue) != null ? _b : selfModel.value;
      },
      set(val) {
        var _a2, _b;
        if (isGroup.value && isArray(val)) {
          isLimitExceeded.value = ((_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value) !== void 0 && val.length > (checkboxGroup == null ? void 0 : checkboxGroup.max.value);
          isLimitExceeded.value === false && ((_b = checkboxGroup == null ? void 0 : checkboxGroup.changeEvent) == null ? void 0 : _b.call(checkboxGroup, val));
        } else {
          emit(UPDATE_MODEL_EVENT, val);
          selfModel.value = val;
        }
      }
    });
    return {
      model,
      isGroup,
      isLimitExceeded
    };
  };
  const useCheckboxStatus = (props, slots, { model }) => {
    const checkboxGroup = Vue.inject(checkboxGroupContextKey, void 0);
    const isFocused = Vue.ref(false);
    const isChecked = Vue.computed(() => {
      const value = model.value;
      if (isBoolean(value)) {
        return value;
      } else if (isArray(value)) {
        if (isObject(props.label)) {
          return value.map(Vue.toRaw).some((o2) => isEqual(o2, props.label));
        } else {
          return value.map(Vue.toRaw).includes(props.label);
        }
      } else if (value !== null && value !== void 0) {
        return value === props.trueLabel;
      } else {
        return !!value;
      }
    });
    const checkboxButtonSize = useSize(Vue.computed(() => {
      var _a2;
      return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
    }), {
      prop: true
    });
    const checkboxSize = useSize(Vue.computed(() => {
      var _a2;
      return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
    }));
    const hasOwnLabel = Vue.computed(() => {
      return !!(slots.default || props.label);
    });
    return {
      checkboxButtonSize,
      isChecked,
      isFocused,
      checkboxSize,
      hasOwnLabel
    };
  };
  const setStoreValue = (props, { model }) => {
    function addToStore() {
      if (isArray(model.value) && !model.value.includes(props.label)) {
        model.value.push(props.label);
      } else {
        model.value = props.trueLabel || true;
      }
    }
    props.checked && addToStore();
  };
  const useCheckbox = (props, slots) => {
    const { formItem: elFormItem } = useFormItem();
    const { model, isGroup, isLimitExceeded } = useCheckboxModel(props);
    const {
      isFocused,
      isChecked,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel
    } = useCheckboxStatus(props, slots, { model });
    const { isDisabled } = useCheckboxDisabled({ model, isChecked });
    const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
      formItemContext: elFormItem,
      disableIdGeneration: hasOwnLabel,
      disableIdManagement: isGroup
    });
    const { handleChange, onClickRoot } = useCheckboxEvent(props, {
      model,
      isLimitExceeded,
      hasOwnLabel,
      isDisabled,
      isLabeledByFormItem
    });
    setStoreValue(props, { model });
    return {
      inputId,
      isLabeledByFormItem,
      isChecked,
      isDisabled,
      isFocused,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel,
      model,
      handleChange,
      onClickRoot
    };
  };
  const _hoisted_1$7 = ["tabindex", "role", "aria-checked"];
  const _hoisted_2$6 = ["id", "aria-hidden", "name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_3$3 = ["id", "aria-hidden", "disabled", "value", "name", "tabindex"];
  const __default__$7 = Vue.defineComponent({
    name: "ElCheckbox"
  });
  const _sfc_main$9 = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$7), {
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = Vue.useSlots();
      const {
        inputId,
        isLabeledByFormItem,
        isChecked,
        isDisabled,
        isFocused,
        checkboxSize,
        hasOwnLabel,
        model,
        handleChange,
        onClickRoot
      } = useCheckbox(props, slots);
      const ns2 = useNamespace("checkbox");
      const compKls = Vue.computed(() => {
        return [
          ns2.b(),
          ns2.m(checkboxSize.value),
          ns2.is("disabled", isDisabled.value),
          ns2.is("bordered", props.border),
          ns2.is("checked", isChecked.value)
        ];
      });
      const spanKls = Vue.computed(() => {
        return [
          ns2.e("input"),
          ns2.is("disabled", isDisabled.value),
          ns2.is("checked", isChecked.value),
          ns2.is("indeterminate", props.indeterminate),
          ns2.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(!Vue.unref(hasOwnLabel) && Vue.unref(isLabeledByFormItem) ? "span" : "label"), {
          class: Vue.normalizeClass(Vue.unref(compKls)),
          "aria-controls": _ctx.indeterminate ? _ctx.controls : null,
          onClick: Vue.unref(onClickRoot)
        }, {
          default: Vue.withCtx(() => [
            Vue.createElementVNode("span", {
              class: Vue.normalizeClass(Vue.unref(spanKls)),
              tabindex: _ctx.indeterminate ? 0 : void 0,
              role: _ctx.indeterminate ? "checkbox" : void 0,
              "aria-checked": _ctx.indeterminate ? "mixed" : void 0
            }, [
              _ctx.trueLabel || _ctx.falseLabel ? Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("input", {
                key: 0,
                id: Vue.unref(inputId),
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => Vue.isRef(model) ? model.value = $event : null),
                class: Vue.normalizeClass(Vue.unref(ns2).e("original")),
                type: "checkbox",
                "aria-hidden": _ctx.indeterminate ? "true" : "false",
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                disabled: Vue.unref(isDisabled),
                "true-value": _ctx.trueLabel,
                "false-value": _ctx.falseLabel,
                onChange: _cache[1] || (_cache[1] = (...args) => Vue.unref(handleChange) && Vue.unref(handleChange)(...args)),
                onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
                onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false)
              }, null, 42, _hoisted_2$6)), [
                [Vue.vModelCheckbox, Vue.unref(model)]
              ]) : Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("input", {
                key: 1,
                id: Vue.unref(inputId),
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => Vue.isRef(model) ? model.value = $event : null),
                class: Vue.normalizeClass(Vue.unref(ns2).e("original")),
                type: "checkbox",
                "aria-hidden": _ctx.indeterminate ? "true" : "false",
                disabled: Vue.unref(isDisabled),
                value: _ctx.label,
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                onChange: _cache[5] || (_cache[5] = (...args) => Vue.unref(handleChange) && Vue.unref(handleChange)(...args)),
                onFocus: _cache[6] || (_cache[6] = ($event) => isFocused.value = true),
                onBlur: _cache[7] || (_cache[7] = ($event) => isFocused.value = false)
              }, null, 42, _hoisted_3$3)), [
                [Vue.vModelCheckbox, Vue.unref(model)]
              ]),
              Vue.createElementVNode("span", {
                class: Vue.normalizeClass(Vue.unref(ns2).e("inner"))
              }, null, 2)
            ], 10, _hoisted_1$7),
            Vue.unref(hasOwnLabel) ? (Vue.openBlock(), Vue.createElementBlock("span", {
              key: 0,
              class: Vue.normalizeClass(Vue.unref(ns2).e("label"))
            }, [
              Vue.renderSlot(_ctx.$slots, "default"),
              !_ctx.$slots.default ? (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 0 }, [
                Vue.createTextVNode(Vue.toDisplayString(_ctx.label), 1)
              ], 64)) : Vue.createCommentVNode("v-if", true)
            ], 2)) : Vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 8, ["class", "aria-controls", "onClick"]);
      };
    }
  }));
  var Checkbox = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox.vue"]]);
  const _hoisted_1$6 = ["name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_2$5 = ["name", "tabindex", "disabled", "value"];
  const __default__$6 = Vue.defineComponent({
    name: "ElCheckboxButton"
  });
  const _sfc_main$8 = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$6), {
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = Vue.useSlots();
      const {
        isFocused,
        isChecked,
        isDisabled,
        checkboxButtonSize,
        model,
        handleChange
      } = useCheckbox(props, slots);
      const checkboxGroup = Vue.inject(checkboxGroupContextKey, void 0);
      const ns2 = useNamespace("checkbox");
      const activeStyle = Vue.computed(() => {
        var _a2, _b, _c, _d;
        const fillValue = (_b = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.fill) == null ? void 0 : _a2.value) != null ? _b : "";
        return {
          backgroundColor: fillValue,
          borderColor: fillValue,
          color: (_d = (_c = checkboxGroup == null ? void 0 : checkboxGroup.textColor) == null ? void 0 : _c.value) != null ? _d : "",
          boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : void 0
        };
      });
      const lableKls = Vue.computed(() => {
        return [
          ns2.b("button"),
          ns2.bm("button", checkboxButtonSize.value),
          ns2.is("disabled", isDisabled.value),
          ns2.is("checked", isChecked.value),
          ns2.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("label", {
          class: Vue.normalizeClass(Vue.unref(lableKls))
        }, [
          _ctx.trueLabel || _ctx.falseLabel ? Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("input", {
            key: 0,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => Vue.isRef(model) ? model.value = $event : null),
            class: Vue.normalizeClass(Vue.unref(ns2).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: Vue.unref(isDisabled),
            "true-value": _ctx.trueLabel,
            "false-value": _ctx.falseLabel,
            onChange: _cache[1] || (_cache[1] = (...args) => Vue.unref(handleChange) && Vue.unref(handleChange)(...args)),
            onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
            onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false)
          }, null, 42, _hoisted_1$6)), [
            [Vue.vModelCheckbox, Vue.unref(model)]
          ]) : Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("input", {
            key: 1,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => Vue.isRef(model) ? model.value = $event : null),
            class: Vue.normalizeClass(Vue.unref(ns2).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: Vue.unref(isDisabled),
            value: _ctx.label,
            onChange: _cache[5] || (_cache[5] = (...args) => Vue.unref(handleChange) && Vue.unref(handleChange)(...args)),
            onFocus: _cache[6] || (_cache[6] = ($event) => isFocused.value = true),
            onBlur: _cache[7] || (_cache[7] = ($event) => isFocused.value = false)
          }, null, 42, _hoisted_2$5)), [
            [Vue.vModelCheckbox, Vue.unref(model)]
          ]),
          _ctx.$slots.default || _ctx.label ? (Vue.openBlock(), Vue.createElementBlock("span", {
            key: 2,
            class: Vue.normalizeClass(Vue.unref(ns2).be("button", "inner")),
            style: Vue.normalizeStyle(Vue.unref(isChecked) ? Vue.unref(activeStyle) : void 0)
          }, [
            Vue.renderSlot(_ctx.$slots, "default", {}, () => [
              Vue.createTextVNode(Vue.toDisplayString(_ctx.label), 1)
            ])
          ], 6)) : Vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  }));
  var CheckboxButton = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-button.vue"]]);
  const checkboxGroupProps = buildProps({
    modelValue: {
      type: definePropType(Array),
      default: () => []
    },
    disabled: Boolean,
    min: Number,
    max: Number,
    size: useSizeProp,
    label: String,
    fill: String,
    textColor: String,
    tag: {
      type: String,
      default: "div"
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  });
  const checkboxGroupEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isArray(val),
    change: (val) => isArray(val)
  };
  const __default__$5 = Vue.defineComponent({
    name: "ElCheckboxGroup"
  });
  const _sfc_main$7 = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$5), {
    props: checkboxGroupProps,
    emits: checkboxGroupEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns2 = useNamespace("checkbox");
      const { formItem } = useFormItem();
      const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const changeEvent = async (value) => {
        emit(UPDATE_MODEL_EVENT, value);
        await Vue.nextTick();
        emit("change", value);
      };
      const modelValue = Vue.computed({
        get() {
          return props.modelValue;
        },
        set(val) {
          changeEvent(val);
        }
      });
      Vue.provide(checkboxGroupContextKey, __spreadProps(__spreadValues({}, pick$1(Vue.toRefs(props), [
        "size",
        "min",
        "max",
        "disabled",
        "validateEvent",
        "fill",
        "textColor"
      ])), {
        modelValue,
        changeEvent
      }));
      Vue.watch(() => props.modelValue, () => {
        if (props.validateEvent) {
          formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn(err));
        }
      });
      return (_ctx, _cache) => {
        var _a2;
        return Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(_ctx.tag), {
          id: Vue.unref(groupId),
          class: Vue.normalizeClass(Vue.unref(ns2).b("group")),
          role: "group",
          "aria-label": !Vue.unref(isLabeledByFormItem) ? _ctx.label || "checkbox-group" : void 0,
          "aria-labelledby": Vue.unref(isLabeledByFormItem) ? (_a2 = Vue.unref(formItem)) == null ? void 0 : _a2.labelId : void 0
        }, {
          default: Vue.withCtx(() => [
            Vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "class", "aria-label", "aria-labelledby"]);
      };
    }
  }));
  var CheckboxGroup = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-group.vue"]]);
  const ElCheckbox = withInstall(Checkbox, {
    CheckboxButton,
    CheckboxGroup
  });
  withNoopInstall(CheckboxButton);
  withNoopInstall(CheckboxGroup);
  const progressProps = buildProps({
    type: {
      type: String,
      default: "line",
      values: ["line", "circle", "dashboard"]
    },
    percentage: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0 && val <= 100
    },
    status: {
      type: String,
      default: "",
      values: ["", "success", "exception", "warning"]
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 3
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    strokeLinecap: {
      type: definePropType(String),
      default: "round"
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: definePropType([
        String,
        Array,
        Function
      ]),
      default: ""
    },
    format: {
      type: definePropType(Function),
      default: (percentage) => `${percentage}%`
    }
  });
  const _hoisted_1$5 = ["aria-valuenow"];
  const _hoisted_2$4 = { viewBox: "0 0 100 100" };
  const _hoisted_3$2 = ["d", "stroke", "stroke-width"];
  const _hoisted_4$1 = ["d", "stroke", "opacity", "stroke-linecap", "stroke-width"];
  const _hoisted_5$1 = { key: 0 };
  const __default__$4 = Vue.defineComponent({
    name: "ElProgress"
  });
  const _sfc_main$6 = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$4), {
    props: progressProps,
    setup(__props) {
      const props = __props;
      const STATUS_COLOR_MAP = {
        success: "#13ce66",
        exception: "#ff4949",
        warning: "#e6a23c",
        default: "#20a0ff"
      };
      const ns2 = useNamespace("progress");
      const barStyle = Vue.computed(() => ({
        width: `${props.percentage}%`,
        animationDuration: `${props.duration}s`,
        backgroundColor: getCurrentColor(props.percentage)
      }));
      const relativeStrokeWidth = Vue.computed(() => (props.strokeWidth / props.width * 100).toFixed(1));
      const radius = Vue.computed(() => {
        if (["circle", "dashboard"].includes(props.type)) {
          return Number.parseInt(`${50 - Number.parseFloat(relativeStrokeWidth.value) / 2}`, 10);
        }
        return 0;
      });
      const trackPath = Vue.computed(() => {
        const r = radius.value;
        const isDashboard = props.type === "dashboard";
        return `
          M 50 50
          m 0 ${isDashboard ? "" : "-"}${r}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? "-" : ""}${r * 2}
          a ${r} ${r} 0 1 1 0 ${isDashboard ? "" : "-"}${r * 2}
          `;
      });
      const perimeter = Vue.computed(() => 2 * Math.PI * radius.value);
      const rate = Vue.computed(() => props.type === "dashboard" ? 0.75 : 1);
      const strokeDashoffset = Vue.computed(() => {
        const offset = -1 * perimeter.value * (1 - rate.value) / 2;
        return `${offset}px`;
      });
      const trailPathStyle = Vue.computed(() => ({
        strokeDasharray: `${perimeter.value * rate.value}px, ${perimeter.value}px`,
        strokeDashoffset: strokeDashoffset.value
      }));
      const circlePathStyle = Vue.computed(() => ({
        strokeDasharray: `${perimeter.value * rate.value * (props.percentage / 100)}px, ${perimeter.value}px`,
        strokeDashoffset: strokeDashoffset.value,
        transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease, opacity ease 0.6s"
      }));
      const stroke = Vue.computed(() => {
        let ret;
        if (props.color) {
          ret = getCurrentColor(props.percentage);
        } else {
          ret = STATUS_COLOR_MAP[props.status] || STATUS_COLOR_MAP.default;
        }
        return ret;
      });
      const statusIcon = Vue.computed(() => {
        if (props.status === "warning") {
          return warning_filled_default;
        }
        if (props.type === "line") {
          return props.status === "success" ? circle_check_default : circle_close_default;
        } else {
          return props.status === "success" ? check_default : close_default;
        }
      });
      const progressTextSize = Vue.computed(() => {
        return props.type === "line" ? 12 + props.strokeWidth * 0.4 : props.width * 0.111111 + 2;
      });
      const content = Vue.computed(() => props.format(props.percentage));
      function getColors(color) {
        const span = 100 / color.length;
        const seriesColors = color.map((seriesColor, index) => {
          if (isString$1(seriesColor)) {
            return {
              color: seriesColor,
              percentage: (index + 1) * span
            };
          }
          return seriesColor;
        });
        return seriesColors.sort((a2, b2) => a2.percentage - b2.percentage);
      }
      const getCurrentColor = (percentage) => {
        var _a2;
        const { color } = props;
        if (isFunction$1(color)) {
          return color(percentage);
        } else if (isString$1(color)) {
          return color;
        } else {
          const colors = getColors(color);
          for (const color2 of colors) {
            if (color2.percentage > percentage)
              return color2.color;
          }
          return (_a2 = colors[colors.length - 1]) == null ? void 0 : _a2.color;
        }
      };
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: Vue.normalizeClass([
            Vue.unref(ns2).b(),
            Vue.unref(ns2).m(_ctx.type),
            Vue.unref(ns2).is(_ctx.status),
            {
              [Vue.unref(ns2).m("without-text")]: !_ctx.showText,
              [Vue.unref(ns2).m("text-inside")]: _ctx.textInside
            }
          ]),
          role: "progressbar",
          "aria-valuenow": _ctx.percentage,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }, [
          _ctx.type === "line" ? (Vue.openBlock(), Vue.createElementBlock("div", {
            key: 0,
            class: Vue.normalizeClass(Vue.unref(ns2).b("bar"))
          }, [
            Vue.createElementVNode("div", {
              class: Vue.normalizeClass(Vue.unref(ns2).be("bar", "outer")),
              style: Vue.normalizeStyle({ height: `${_ctx.strokeWidth}px` })
            }, [
              Vue.createElementVNode("div", {
                class: Vue.normalizeClass([
                  Vue.unref(ns2).be("bar", "inner"),
                  { [Vue.unref(ns2).bem("bar", "inner", "indeterminate")]: _ctx.indeterminate }
                ]),
                style: Vue.normalizeStyle(Vue.unref(barStyle))
              }, [
                (_ctx.showText || _ctx.$slots.default) && _ctx.textInside ? (Vue.openBlock(), Vue.createElementBlock("div", {
                  key: 0,
                  class: Vue.normalizeClass(Vue.unref(ns2).be("bar", "innerText"))
                }, [
                  Vue.renderSlot(_ctx.$slots, "default", { percentage: _ctx.percentage }, () => [
                    Vue.createElementVNode("span", null, Vue.toDisplayString(Vue.unref(content)), 1)
                  ])
                ], 2)) : Vue.createCommentVNode("v-if", true)
              ], 6)
            ], 6)
          ], 2)) : (Vue.openBlock(), Vue.createElementBlock("div", {
            key: 1,
            class: Vue.normalizeClass(Vue.unref(ns2).b("circle")),
            style: Vue.normalizeStyle({ height: `${_ctx.width}px`, width: `${_ctx.width}px` })
          }, [
            (Vue.openBlock(), Vue.createElementBlock("svg", _hoisted_2$4, [
              Vue.createElementVNode("path", {
                class: Vue.normalizeClass(Vue.unref(ns2).be("circle", "track")),
                d: Vue.unref(trackPath),
                stroke: `var(${Vue.unref(ns2).cssVarName("fill-color-light")}, #e5e9f2)`,
                "stroke-width": Vue.unref(relativeStrokeWidth),
                fill: "none",
                style: Vue.normalizeStyle(Vue.unref(trailPathStyle))
              }, null, 14, _hoisted_3$2),
              Vue.createElementVNode("path", {
                class: Vue.normalizeClass(Vue.unref(ns2).be("circle", "path")),
                d: Vue.unref(trackPath),
                stroke: Vue.unref(stroke),
                fill: "none",
                opacity: _ctx.percentage ? 1 : 0,
                "stroke-linecap": _ctx.strokeLinecap,
                "stroke-width": Vue.unref(relativeStrokeWidth),
                style: Vue.normalizeStyle(Vue.unref(circlePathStyle))
              }, null, 14, _hoisted_4$1)
            ]))
          ], 6)),
          (_ctx.showText || _ctx.$slots.default) && !_ctx.textInside ? (Vue.openBlock(), Vue.createElementBlock("div", {
            key: 2,
            class: Vue.normalizeClass(Vue.unref(ns2).e("text")),
            style: Vue.normalizeStyle({ fontSize: `${Vue.unref(progressTextSize)}px` })
          }, [
            Vue.renderSlot(_ctx.$slots, "default", { percentage: _ctx.percentage }, () => [
              !_ctx.status ? (Vue.openBlock(), Vue.createElementBlock("span", _hoisted_5$1, Vue.toDisplayString(Vue.unref(content)), 1)) : (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), { key: 1 }, {
                default: Vue.withCtx(() => [
                  (Vue.openBlock(), Vue.createBlock(Vue.resolveDynamicComponent(Vue.unref(statusIcon))))
                ]),
                _: 1
              }))
            ])
          ], 6)) : Vue.createCommentVNode("v-if", true)
        ], 10, _hoisted_1$5);
      };
    }
  }));
  var Progress = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/progress/src/progress.vue"]]);
  const ElProgress = withInstall(Progress);
  /*!
   * escape-html
   * Copyright(c) 2012-2013 TJ Holowaychuk
   * Copyright(c) 2015 Andreas Lubbe
   * Copyright(c) 2015 Tiancheng "Timothy" Gu
   * MIT Licensed
   */
  var matchHtmlRegExp = /["'&<>]/;
  var escapeHtml_1 = escapeHtml;
  function escapeHtml(string) {
    var str = "" + string;
    var match = matchHtmlRegExp.exec(str);
    if (!match) {
      return str;
    }
    var escape;
    var html = "";
    var index = 0;
    var lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34:
          escape = "&quot;";
          break;
        case 38:
          escape = "&amp;";
          break;
        case 39:
          escape = "&#39;";
          break;
        case 60:
          escape = "&lt;";
          break;
        case 62:
          escape = "&gt;";
          break;
        default:
          continue;
      }
      if (lastIndex !== index) {
        html += str.substring(lastIndex, index);
      }
      lastIndex = index + 1;
      html += escape;
    }
    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
  }
  const getCell = function(event) {
    var _a2;
    return (_a2 = event.target) == null ? void 0 : _a2.closest("td");
  };
  const orderBy = function(array, sortKey, reverse, sortMethod, sortBy) {
    if (!sortKey && !sortMethod && (!sortBy || Array.isArray(sortBy) && !sortBy.length)) {
      return array;
    }
    if (typeof reverse === "string") {
      reverse = reverse === "descending" ? -1 : 1;
    } else {
      reverse = reverse && reverse < 0 ? -1 : 1;
    }
    const getKey = sortMethod ? null : function(value, index) {
      if (sortBy) {
        if (!Array.isArray(sortBy)) {
          sortBy = [sortBy];
        }
        return sortBy.map((by) => {
          if (typeof by === "string") {
            return get$2(value, by);
          } else {
            return by(value, index, array);
          }
        });
      }
      if (sortKey !== "$key") {
        if (isObject(value) && "$value" in value)
          value = value.$value;
      }
      return [isObject(value) ? get$2(value, sortKey) : value];
    };
    const compare = function(a2, b2) {
      if (sortMethod) {
        return sortMethod(a2.value, b2.value);
      }
      for (let i = 0, len = a2.key.length; i < len; i++) {
        if (a2.key[i] < b2.key[i]) {
          return -1;
        }
        if (a2.key[i] > b2.key[i]) {
          return 1;
        }
      }
      return 0;
    };
    return array.map((value, index) => {
      return {
        value,
        index,
        key: getKey ? getKey(value, index) : null
      };
    }).sort((a2, b2) => {
      let order = compare(a2, b2);
      if (!order) {
        order = a2.index - b2.index;
      }
      return order * +reverse;
    }).map((item) => item.value);
  };
  const getColumnById = function(table, columnId) {
    let column = null;
    table.columns.forEach((item) => {
      if (item.id === columnId) {
        column = item;
      }
    });
    return column;
  };
  const getColumnByKey = function(table, columnKey) {
    let column = null;
    for (let i = 0; i < table.columns.length; i++) {
      const item = table.columns[i];
      if (item.columnKey === columnKey) {
        column = item;
        break;
      }
    }
    if (!column)
      throwError("ElTable", `No column matching with column-key: ${columnKey}`);
    return column;
  };
  const getColumnByCell = function(table, cell, namespace) {
    const matches = (cell.className || "").match(new RegExp(`${namespace}-table_[^\\s]+`, "gm"));
    if (matches) {
      return getColumnById(table, matches[0]);
    }
    return null;
  };
  const getRowIdentity = (row, rowKey) => {
    if (!row)
      throw new Error("Row is required when get row identity");
    if (typeof rowKey === "string") {
      if (!rowKey.includes(".")) {
        return `${row[rowKey]}`;
      }
      const key = rowKey.split(".");
      let current = row;
      for (const element of key) {
        current = current[element];
      }
      return `${current}`;
    } else if (typeof rowKey === "function") {
      return rowKey.call(null, row);
    }
  };
  const getKeysMap = function(array, rowKey) {
    const arrayMap2 = {};
    (array || []).forEach((row, index) => {
      arrayMap2[getRowIdentity(row, rowKey)] = { row, index };
    });
    return arrayMap2;
  };
  function mergeOptions(defaults, config) {
    const options = {};
    let key;
    for (key in defaults) {
      options[key] = defaults[key];
    }
    for (key in config) {
      if (hasOwn(config, key)) {
        const value = config[key];
        if (typeof value !== "undefined") {
          options[key] = value;
        }
      }
    }
    return options;
  }
  function parseWidth(width) {
    if (width === "")
      return width;
    if (width !== void 0) {
      width = Number.parseInt(width, 10);
      if (Number.isNaN(width)) {
        width = "";
      }
    }
    return width;
  }
  function parseMinWidth(minWidth) {
    if (minWidth === "")
      return minWidth;
    if (minWidth !== void 0) {
      minWidth = parseWidth(minWidth);
      if (Number.isNaN(minWidth)) {
        minWidth = 80;
      }
    }
    return minWidth;
  }
  function parseHeight(height) {
    if (typeof height === "number") {
      return height;
    }
    if (typeof height === "string") {
      if (/^\d+(?:px)?$/.test(height)) {
        return Number.parseInt(height, 10);
      } else {
        return height;
      }
    }
    return null;
  }
  function compose(...funcs) {
    if (funcs.length === 0) {
      return (arg) => arg;
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce((a2, b2) => (...args) => a2(b2(...args)));
  }
  function toggleRowStatus(statusArr, row, newVal) {
    let changed = false;
    const index = statusArr.indexOf(row);
    const included = index !== -1;
    const toggleStatus = (type) => {
      if (type === "add") {
        statusArr.push(row);
      } else {
        statusArr.splice(index, 1);
      }
      changed = true;
      if (isArray(row.children)) {
        row.children.forEach((item) => {
          toggleRowStatus(statusArr, item, newVal != null ? newVal : !included);
        });
      }
    };
    if (isBoolean(newVal)) {
      if (newVal && !included) {
        toggleStatus("add");
      } else if (!newVal && included) {
        toggleStatus("remove");
      }
    } else {
      included ? toggleStatus("remove") : toggleStatus("add");
    }
    return changed;
  }
  function walkTreeNode(root2, cb, childrenKey = "children", lazyKey = "hasChildren") {
    const isNil2 = (array) => !(Array.isArray(array) && array.length);
    function _walker(parent, children, level) {
      cb(parent, children, level);
      children.forEach((item) => {
        if (item[lazyKey]) {
          cb(item, null, level + 1);
          return;
        }
        const children2 = item[childrenKey];
        if (!isNil2(children2)) {
          _walker(item, children2, level + 1);
        }
      });
    }
    root2.forEach((item) => {
      if (item[lazyKey]) {
        cb(item, null, 0);
        return;
      }
      const children = item[childrenKey];
      if (!isNil2(children)) {
        _walker(item, children, 0);
      }
    });
  }
  let removePopper;
  function createTablePopper(parentNode, trigger2, popperContent, tooltipOptions) {
    tooltipOptions = merge$1({
      enterable: true,
      showArrow: true
    }, tooltipOptions);
    const { nextZIndex } = useZIndex();
    const ns2 = parentNode == null ? void 0 : parentNode.dataset.prefix;
    const scrollContainer = parentNode == null ? void 0 : parentNode.querySelector(`.${ns2}-scrollbar__wrap`);
    function renderContent() {
      const isLight = tooltipOptions.effect === "light";
      const content2 = document.createElement("div");
      content2.className = [
        `${ns2}-popper`,
        isLight ? "is-light" : "is-dark",
        tooltipOptions.popperClass || ""
      ].join(" ");
      popperContent = escapeHtml_1(popperContent);
      content2.innerHTML = popperContent;
      content2.style.zIndex = String(nextZIndex());
      parentNode == null ? void 0 : parentNode.appendChild(content2);
      return content2;
    }
    function renderArrow() {
      const arrow = document.createElement("div");
      arrow.className = `${ns2}-popper__arrow`;
      return arrow;
    }
    function showPopper() {
      popperInstance && popperInstance.update();
    }
    removePopper == null ? void 0 : removePopper();
    removePopper = () => {
      try {
        popperInstance && popperInstance.destroy();
        content && (parentNode == null ? void 0 : parentNode.removeChild(content));
        trigger2.removeEventListener("mouseenter", onOpen);
        trigger2.removeEventListener("mouseleave", onClose);
        scrollContainer == null ? void 0 : scrollContainer.removeEventListener("scroll", removePopper);
        removePopper = void 0;
      } catch (e) {
      }
    };
    let popperInstance = null;
    let onOpen = showPopper;
    let onClose = removePopper;
    if (tooltipOptions.enterable) {
      ({ onOpen, onClose } = useDelayedToggle({
        showAfter: tooltipOptions.showAfter,
        hideAfter: tooltipOptions.hideAfter,
        open: showPopper,
        close: removePopper
      }));
    }
    const content = renderContent();
    content.onmouseenter = onOpen;
    content.onmouseleave = onClose;
    const modifiers = [];
    if (tooltipOptions.offset) {
      modifiers.push({
        name: "offset",
        options: {
          offset: [0, tooltipOptions.offset]
        }
      });
    }
    if (tooltipOptions.showArrow) {
      const arrow = content.appendChild(renderArrow());
      modifiers.push({
        name: "arrow",
        options: {
          element: arrow,
          padding: 10
        }
      });
    }
    const popperOptions = tooltipOptions.popperOptions || {};
    popperInstance = yn(trigger2, content, __spreadProps(__spreadValues({
      placement: tooltipOptions.placement || "top",
      strategy: "fixed"
    }, popperOptions), {
      modifiers: popperOptions.modifiers ? modifiers.concat(popperOptions.modifiers) : modifiers
    }));
    trigger2.addEventListener("mouseenter", onOpen);
    trigger2.addEventListener("mouseleave", onClose);
    scrollContainer == null ? void 0 : scrollContainer.addEventListener("scroll", removePopper);
    return popperInstance;
  }
  function getCurrentColumns(column) {
    if (column.children) {
      return flatMap(column.children, getCurrentColumns);
    } else {
      return [column];
    }
  }
  function getColSpan(colSpan, column) {
    return colSpan + column.colSpan;
  }
  const isFixedColumn = (index, fixed, store, realColumns) => {
    let start = 0;
    let after = index;
    const columns = store.states.columns.value;
    if (realColumns) {
      const curColumns = getCurrentColumns(realColumns[index]);
      const preColumns = columns.slice(0, columns.indexOf(curColumns[0]));
      start = preColumns.reduce(getColSpan, 0);
      after = start + curColumns.reduce(getColSpan, 0) - 1;
    } else {
      start = index;
    }
    let fixedLayout;
    switch (fixed) {
      case "left":
        if (after < store.states.fixedLeafColumnsLength.value) {
          fixedLayout = "left";
        }
        break;
      case "right":
        if (start >= columns.length - store.states.rightFixedLeafColumnsLength.value) {
          fixedLayout = "right";
        }
        break;
      default:
        if (after < store.states.fixedLeafColumnsLength.value) {
          fixedLayout = "left";
        } else if (start >= columns.length - store.states.rightFixedLeafColumnsLength.value) {
          fixedLayout = "right";
        }
    }
    return fixedLayout ? {
      direction: fixedLayout,
      start,
      after
    } : {};
  };
  const getFixedColumnsClass = (namespace, index, fixed, store, realColumns, offset = 0) => {
    const classes = [];
    const { direction, start, after } = isFixedColumn(index, fixed, store, realColumns);
    if (direction) {
      const isLeft = direction === "left";
      classes.push(`${namespace}-fixed-column--${direction}`);
      if (isLeft && after + offset === store.states.fixedLeafColumnsLength.value - 1) {
        classes.push("is-last-column");
      } else if (!isLeft && start - offset === store.states.columns.value.length - store.states.rightFixedLeafColumnsLength.value) {
        classes.push("is-first-column");
      }
    }
    return classes;
  };
  function getOffset(offset, column) {
    return offset + (column.realWidth === null || Number.isNaN(column.realWidth) ? Number(column.width) : column.realWidth);
  }
  const getFixedColumnOffset = (index, fixed, store, realColumns) => {
    const {
      direction,
      start = 0,
      after = 0
    } = isFixedColumn(index, fixed, store, realColumns);
    if (!direction) {
      return;
    }
    const styles = {};
    const isLeft = direction === "left";
    const columns = store.states.columns.value;
    if (isLeft) {
      styles.left = columns.slice(0, start).reduce(getOffset, 0);
    } else {
      styles.right = columns.slice(after + 1).reverse().reduce(getOffset, 0);
    }
    return styles;
  };
  const ensurePosition = (style2, key) => {
    if (!style2)
      return;
    if (!Number.isNaN(style2[key])) {
      style2[key] = `${style2[key]}px`;
    }
  };
  function useExpand(watcherData) {
    const instance = Vue.getCurrentInstance();
    const defaultExpandAll = Vue.ref(false);
    const expandRows = Vue.ref([]);
    const updateExpandRows = () => {
      const data = watcherData.data.value || [];
      const rowKey = watcherData.rowKey.value;
      if (defaultExpandAll.value) {
        expandRows.value = data.slice();
      } else if (rowKey) {
        const expandRowsMap = getKeysMap(expandRows.value, rowKey);
        expandRows.value = data.reduce((prev, row) => {
          const rowId = getRowIdentity(row, rowKey);
          const rowInfo = expandRowsMap[rowId];
          if (rowInfo) {
            prev.push(row);
          }
          return prev;
        }, []);
      } else {
        expandRows.value = [];
      }
    };
    const toggleRowExpansion = (row, expanded) => {
      const changed = toggleRowStatus(expandRows.value, row, expanded);
      if (changed) {
        instance.emit("expand-change", row, expandRows.value.slice());
      }
    };
    const setExpandRowKeys = (rowKeys) => {
      instance.store.assertRowKey();
      const data = watcherData.data.value || [];
      const rowKey = watcherData.rowKey.value;
      const keysMap = getKeysMap(data, rowKey);
      expandRows.value = rowKeys.reduce((prev, cur) => {
        const info = keysMap[cur];
        if (info) {
          prev.push(info.row);
        }
        return prev;
      }, []);
    };
    const isRowExpanded = (row) => {
      const rowKey = watcherData.rowKey.value;
      if (rowKey) {
        const expandMap = getKeysMap(expandRows.value, rowKey);
        return !!expandMap[getRowIdentity(row, rowKey)];
      }
      return expandRows.value.includes(row);
    };
    return {
      updateExpandRows,
      toggleRowExpansion,
      setExpandRowKeys,
      isRowExpanded,
      states: {
        expandRows,
        defaultExpandAll
      }
    };
  }
  function useCurrent(watcherData) {
    const instance = Vue.getCurrentInstance();
    const _currentRowKey = Vue.ref(null);
    const currentRow = Vue.ref(null);
    const setCurrentRowKey = (key) => {
      instance.store.assertRowKey();
      _currentRowKey.value = key;
      setCurrentRowByKey(key);
    };
    const restoreCurrentRowKey = () => {
      _currentRowKey.value = null;
    };
    const setCurrentRowByKey = (key) => {
      const { data, rowKey } = watcherData;
      let _currentRow = null;
      if (rowKey.value) {
        _currentRow = (Vue.unref(data) || []).find((item) => getRowIdentity(item, rowKey.value) === key);
      }
      currentRow.value = _currentRow;
      instance.emit("current-change", currentRow.value, null);
    };
    const updateCurrentRow = (_currentRow) => {
      const oldCurrentRow = currentRow.value;
      if (_currentRow && _currentRow !== oldCurrentRow) {
        currentRow.value = _currentRow;
        instance.emit("current-change", currentRow.value, oldCurrentRow);
        return;
      }
      if (!_currentRow && oldCurrentRow) {
        currentRow.value = null;
        instance.emit("current-change", null, oldCurrentRow);
      }
    };
    const updateCurrentRowData = () => {
      const rowKey = watcherData.rowKey.value;
      const data = watcherData.data.value || [];
      const oldCurrentRow = currentRow.value;
      if (!data.includes(oldCurrentRow) && oldCurrentRow) {
        if (rowKey) {
          const currentRowKey = getRowIdentity(oldCurrentRow, rowKey);
          setCurrentRowByKey(currentRowKey);
        } else {
          currentRow.value = null;
        }
        if (currentRow.value === null) {
          instance.emit("current-change", null, oldCurrentRow);
        }
      } else if (_currentRowKey.value) {
        setCurrentRowByKey(_currentRowKey.value);
        restoreCurrentRowKey();
      }
    };
    return {
      setCurrentRowKey,
      restoreCurrentRowKey,
      setCurrentRowByKey,
      updateCurrentRow,
      updateCurrentRowData,
      states: {
        _currentRowKey,
        currentRow
      }
    };
  }
  function useTree(watcherData) {
    const expandRowKeys = Vue.ref([]);
    const treeData = Vue.ref({});
    const indent = Vue.ref(16);
    const lazy = Vue.ref(false);
    const lazyTreeNodeMap = Vue.ref({});
    const lazyColumnIdentifier = Vue.ref("hasChildren");
    const childrenColumnName = Vue.ref("children");
    const instance = Vue.getCurrentInstance();
    const normalizedData = Vue.computed(() => {
      if (!watcherData.rowKey.value)
        return {};
      const data = watcherData.data.value || [];
      return normalize(data);
    });
    const normalizedLazyNode = Vue.computed(() => {
      const rowKey = watcherData.rowKey.value;
      const keys2 = Object.keys(lazyTreeNodeMap.value);
      const res = {};
      if (!keys2.length)
        return res;
      keys2.forEach((key) => {
        if (lazyTreeNodeMap.value[key].length) {
          const item = { children: [] };
          lazyTreeNodeMap.value[key].forEach((row) => {
            const currentRowKey = getRowIdentity(row, rowKey);
            item.children.push(currentRowKey);
            if (row[lazyColumnIdentifier.value] && !res[currentRowKey]) {
              res[currentRowKey] = { children: [] };
            }
          });
          res[key] = item;
        }
      });
      return res;
    });
    const normalize = (data) => {
      const rowKey = watcherData.rowKey.value;
      const res = {};
      walkTreeNode(data, (parent, children, level) => {
        const parentId = getRowIdentity(parent, rowKey);
        if (Array.isArray(children)) {
          res[parentId] = {
            children: children.map((row) => getRowIdentity(row, rowKey)),
            level
          };
        } else if (lazy.value) {
          res[parentId] = {
            children: [],
            lazy: true,
            level
          };
        }
      }, childrenColumnName.value, lazyColumnIdentifier.value);
      return res;
    };
    const updateTreeData = (ifChangeExpandRowKeys = false, ifExpandAll = ((_a2) => (_a2 = instance.store) == null ? void 0 : _a2.states.defaultExpandAll.value)()) => {
      var _a2;
      const nested = normalizedData.value;
      const normalizedLazyNode_ = normalizedLazyNode.value;
      const keys2 = Object.keys(nested);
      const newTreeData = {};
      if (keys2.length) {
        const oldTreeData = Vue.unref(treeData);
        const rootLazyRowKeys = [];
        const getExpanded = (oldValue, key) => {
          if (ifChangeExpandRowKeys) {
            if (expandRowKeys.value) {
              return ifExpandAll || expandRowKeys.value.includes(key);
            } else {
              return !!(ifExpandAll || (oldValue == null ? void 0 : oldValue.expanded));
            }
          } else {
            const included = ifExpandAll || expandRowKeys.value && expandRowKeys.value.includes(key);
            return !!((oldValue == null ? void 0 : oldValue.expanded) || included);
          }
        };
        keys2.forEach((key) => {
          const oldValue = oldTreeData[key];
          const newValue = __spreadValues({}, nested[key]);
          newValue.expanded = getExpanded(oldValue, key);
          if (newValue.lazy) {
            const { loaded = false, loading = false } = oldValue || {};
            newValue.loaded = !!loaded;
            newValue.loading = !!loading;
            rootLazyRowKeys.push(key);
          }
          newTreeData[key] = newValue;
        });
        const lazyKeys = Object.keys(normalizedLazyNode_);
        if (lazy.value && lazyKeys.length && rootLazyRowKeys.length) {
          lazyKeys.forEach((key) => {
            const oldValue = oldTreeData[key];
            const lazyNodeChildren = normalizedLazyNode_[key].children;
            if (rootLazyRowKeys.includes(key)) {
              if (newTreeData[key].children.length !== 0) {
                throw new Error("[ElTable]children must be an empty array.");
              }
              newTreeData[key].children = lazyNodeChildren;
            } else {
              const { loaded = false, loading = false } = oldValue || {};
              newTreeData[key] = {
                lazy: true,
                loaded: !!loaded,
                loading: !!loading,
                expanded: getExpanded(oldValue, key),
                children: lazyNodeChildren,
                level: ""
              };
            }
          });
        }
      }
      treeData.value = newTreeData;
      (_a2 = instance.store) == null ? void 0 : _a2.updateTableScrollY();
    };
    Vue.watch(() => expandRowKeys.value, () => {
      updateTreeData(true);
    });
    Vue.watch(() => normalizedData.value, () => {
      updateTreeData();
    });
    Vue.watch(() => normalizedLazyNode.value, () => {
      updateTreeData();
    });
    const updateTreeExpandKeys = (value) => {
      expandRowKeys.value = value;
      updateTreeData();
    };
    const toggleTreeExpansion = (row, expanded) => {
      instance.store.assertRowKey();
      const rowKey = watcherData.rowKey.value;
      const id = getRowIdentity(row, rowKey);
      const data = id && treeData.value[id];
      if (id && data && "expanded" in data) {
        const oldExpanded = data.expanded;
        expanded = typeof expanded === "undefined" ? !data.expanded : expanded;
        treeData.value[id].expanded = expanded;
        if (oldExpanded !== expanded) {
          instance.emit("expand-change", row, expanded);
        }
        instance.store.updateTableScrollY();
      }
    };
    const loadOrToggle = (row) => {
      instance.store.assertRowKey();
      const rowKey = watcherData.rowKey.value;
      const id = getRowIdentity(row, rowKey);
      const data = treeData.value[id];
      if (lazy.value && data && "loaded" in data && !data.loaded) {
        loadData(row, id, data);
      } else {
        toggleTreeExpansion(row, void 0);
      }
    };
    const loadData = (row, key, treeNode) => {
      const { load } = instance.props;
      if (load && !treeData.value[key].loaded) {
        treeData.value[key].loading = true;
        load(row, treeNode, (data) => {
          if (!Array.isArray(data)) {
            throw new TypeError("[ElTable] data must be an array");
          }
          treeData.value[key].loading = false;
          treeData.value[key].loaded = true;
          treeData.value[key].expanded = true;
          if (data.length) {
            lazyTreeNodeMap.value[key] = data;
          }
          instance.emit("expand-change", row, true);
        });
      }
    };
    return {
      loadData,
      loadOrToggle,
      toggleTreeExpansion,
      updateTreeExpandKeys,
      updateTreeData,
      normalize,
      states: {
        expandRowKeys,
        treeData,
        indent,
        lazy,
        lazyTreeNodeMap,
        lazyColumnIdentifier,
        childrenColumnName
      }
    };
  }
  const sortData = (data, states) => {
    const sortingColumn = states.sortingColumn;
    if (!sortingColumn || typeof sortingColumn.sortable === "string") {
      return data;
    }
    return orderBy(data, states.sortProp, states.sortOrder, sortingColumn.sortMethod, sortingColumn.sortBy);
  };
  const doFlattenColumns = (columns) => {
    const result = [];
    columns.forEach((column) => {
      if (column.children) {
        result.push.apply(result, doFlattenColumns(column.children));
      } else {
        result.push(column);
      }
    });
    return result;
  };
  function useWatcher$1() {
    var _a2;
    const instance = Vue.getCurrentInstance();
    const { size: tableSize } = Vue.toRefs((_a2 = instance.proxy) == null ? void 0 : _a2.$props);
    const rowKey = Vue.ref(null);
    const data = Vue.ref([]);
    const _data = Vue.ref([]);
    const isComplex = Vue.ref(false);
    const _columns = Vue.ref([]);
    const originColumns = Vue.ref([]);
    const columns = Vue.ref([]);
    const fixedColumns = Vue.ref([]);
    const rightFixedColumns = Vue.ref([]);
    const leafColumns = Vue.ref([]);
    const fixedLeafColumns = Vue.ref([]);
    const rightFixedLeafColumns = Vue.ref([]);
    const leafColumnsLength = Vue.ref(0);
    const fixedLeafColumnsLength = Vue.ref(0);
    const rightFixedLeafColumnsLength = Vue.ref(0);
    const isAllSelected = Vue.ref(false);
    const selection = Vue.ref([]);
    const reserveSelection = Vue.ref(false);
    const selectOnIndeterminate = Vue.ref(false);
    const selectable = Vue.ref(null);
    const filters = Vue.ref({});
    const filteredData = Vue.ref(null);
    const sortingColumn = Vue.ref(null);
    const sortProp = Vue.ref(null);
    const sortOrder = Vue.ref(null);
    const hoverRow = Vue.ref(null);
    Vue.watch(data, () => instance.state && scheduleLayout(false), {
      deep: true
    });
    const assertRowKey = () => {
      if (!rowKey.value)
        throw new Error("[ElTable] prop row-key is required");
    };
    const updateChildFixed = (column) => {
      var _a22;
      (_a22 = column.children) == null ? void 0 : _a22.forEach((childColumn) => {
        childColumn.fixed = column.fixed;
        updateChildFixed(childColumn);
      });
    };
    const updateColumns = () => {
      _columns.value.forEach((column) => {
        updateChildFixed(column);
      });
      fixedColumns.value = _columns.value.filter((column) => column.fixed === true || column.fixed === "left");
      rightFixedColumns.value = _columns.value.filter((column) => column.fixed === "right");
      if (fixedColumns.value.length > 0 && _columns.value[0] && _columns.value[0].type === "selection" && !_columns.value[0].fixed) {
        _columns.value[0].fixed = true;
        fixedColumns.value.unshift(_columns.value[0]);
      }
      const notFixedColumns = _columns.value.filter((column) => !column.fixed);
      originColumns.value = [].concat(fixedColumns.value).concat(notFixedColumns).concat(rightFixedColumns.value);
      const leafColumns2 = doFlattenColumns(notFixedColumns);
      const fixedLeafColumns2 = doFlattenColumns(fixedColumns.value);
      const rightFixedLeafColumns2 = doFlattenColumns(rightFixedColumns.value);
      leafColumnsLength.value = leafColumns2.length;
      fixedLeafColumnsLength.value = fixedLeafColumns2.length;
      rightFixedLeafColumnsLength.value = rightFixedLeafColumns2.length;
      columns.value = [].concat(fixedLeafColumns2).concat(leafColumns2).concat(rightFixedLeafColumns2);
      isComplex.value = fixedColumns.value.length > 0 || rightFixedColumns.value.length > 0;
    };
    const scheduleLayout = (needUpdateColumns, immediate = false) => {
      if (needUpdateColumns) {
        updateColumns();
      }
      if (immediate) {
        instance.state.doLayout();
      } else {
        instance.state.debouncedUpdateLayout();
      }
    };
    const isSelected = (row) => {
      return selection.value.includes(row);
    };
    const clearSelection = () => {
      isAllSelected.value = false;
      const oldSelection = selection.value;
      if (oldSelection.length) {
        selection.value = [];
        instance.emit("selection-change", []);
      }
    };
    const cleanSelection = () => {
      let deleted;
      if (rowKey.value) {
        deleted = [];
        const selectedMap = getKeysMap(selection.value, rowKey.value);
        const dataMap = getKeysMap(data.value, rowKey.value);
        for (const key in selectedMap) {
          if (hasOwn(selectedMap, key) && !dataMap[key]) {
            deleted.push(selectedMap[key].row);
          }
        }
      } else {
        deleted = selection.value.filter((item) => !data.value.includes(item));
      }
      if (deleted.length) {
        const newSelection = selection.value.filter((item) => !deleted.includes(item));
        selection.value = newSelection;
        instance.emit("selection-change", newSelection.slice());
      }
    };
    const getSelectionRows = () => {
      return (selection.value || []).slice();
    };
    const toggleRowSelection = (row, selected = void 0, emitChange = true) => {
      const changed = toggleRowStatus(selection.value, row, selected);
      if (changed) {
        const newSelection = (selection.value || []).slice();
        if (emitChange) {
          instance.emit("select", newSelection, row);
        }
        instance.emit("selection-change", newSelection);
      }
    };
    const _toggleAllSelection = () => {
      var _a22, _b;
      const value = selectOnIndeterminate.value ? !isAllSelected.value : !(isAllSelected.value || selection.value.length);
      isAllSelected.value = value;
      let selectionChanged = false;
      let childrenCount = 0;
      const rowKey2 = (_b = (_a22 = instance == null ? void 0 : instance.store) == null ? void 0 : _a22.states) == null ? void 0 : _b.rowKey.value;
      data.value.forEach((row, index) => {
        const rowIndex = index + childrenCount;
        if (selectable.value) {
          if (selectable.value.call(null, row, rowIndex) && toggleRowStatus(selection.value, row, value)) {
            selectionChanged = true;
          }
        } else {
          if (toggleRowStatus(selection.value, row, value)) {
            selectionChanged = true;
          }
        }
        childrenCount += getChildrenCount(getRowIdentity(row, rowKey2));
      });
      if (selectionChanged) {
        instance.emit("selection-change", selection.value ? selection.value.slice() : []);
      }
      instance.emit("select-all", selection.value);
    };
    const updateSelectionByRowKey = () => {
      const selectedMap = getKeysMap(selection.value, rowKey.value);
      data.value.forEach((row) => {
        const rowId = getRowIdentity(row, rowKey.value);
        const rowInfo = selectedMap[rowId];
        if (rowInfo) {
          selection.value[rowInfo.index] = row;
        }
      });
    };
    const updateAllSelected = () => {
      var _a22, _b, _c;
      if (((_a22 = data.value) == null ? void 0 : _a22.length) === 0) {
        isAllSelected.value = false;
        return;
      }
      let selectedMap;
      if (rowKey.value) {
        selectedMap = getKeysMap(selection.value, rowKey.value);
      }
      const isSelected2 = function(row) {
        if (selectedMap) {
          return !!selectedMap[getRowIdentity(row, rowKey.value)];
        } else {
          return selection.value.includes(row);
        }
      };
      let isAllSelected_ = true;
      let selectedCount = 0;
      let childrenCount = 0;
      for (let i = 0, j = (data.value || []).length; i < j; i++) {
        const keyProp = (_c = (_b = instance == null ? void 0 : instance.store) == null ? void 0 : _b.states) == null ? void 0 : _c.rowKey.value;
        const rowIndex = i + childrenCount;
        const item = data.value[i];
        const isRowSelectable = selectable.value && selectable.value.call(null, item, rowIndex);
        if (!isSelected2(item)) {
          if (!selectable.value || isRowSelectable) {
            isAllSelected_ = false;
            break;
          }
        } else {
          selectedCount++;
        }
        childrenCount += getChildrenCount(getRowIdentity(item, keyProp));
      }
      if (selectedCount === 0)
        isAllSelected_ = false;
      isAllSelected.value = isAllSelected_;
    };
    const getChildrenCount = (rowKey2) => {
      var _a22;
      if (!instance || !instance.store)
        return 0;
      const { treeData } = instance.store.states;
      let count = 0;
      const children = (_a22 = treeData.value[rowKey2]) == null ? void 0 : _a22.children;
      if (children) {
        count += children.length;
        children.forEach((childKey) => {
          count += getChildrenCount(childKey);
        });
      }
      return count;
    };
    const updateFilters = (columns2, values) => {
      if (!Array.isArray(columns2)) {
        columns2 = [columns2];
      }
      const filters_ = {};
      columns2.forEach((col) => {
        filters.value[col.id] = values;
        filters_[col.columnKey || col.id] = values;
      });
      return filters_;
    };
    const updateSort = (column, prop, order) => {
      if (sortingColumn.value && sortingColumn.value !== column) {
        sortingColumn.value.order = null;
      }
      sortingColumn.value = column;
      sortProp.value = prop;
      sortOrder.value = order;
    };
    const execFilter = () => {
      let sourceData = Vue.unref(_data);
      Object.keys(filters.value).forEach((columnId) => {
        const values = filters.value[columnId];
        if (!values || values.length === 0)
          return;
        const column = getColumnById({
          columns: columns.value
        }, columnId);
        if (column && column.filterMethod) {
          sourceData = sourceData.filter((row) => {
            return values.some((value) => column.filterMethod.call(null, value, row, column));
          });
        }
      });
      filteredData.value = sourceData;
    };
    const execSort = () => {
      data.value = sortData(filteredData.value, {
        sortingColumn: sortingColumn.value,
        sortProp: sortProp.value,
        sortOrder: sortOrder.value
      });
    };
    const execQuery = (ignore = void 0) => {
      if (!(ignore && ignore.filter)) {
        execFilter();
      }
      execSort();
    };
    const clearFilter = (columnKeys) => {
      const { tableHeaderRef } = instance.refs;
      if (!tableHeaderRef)
        return;
      const panels = Object.assign({}, tableHeaderRef.filterPanels);
      const keys2 = Object.keys(panels);
      if (!keys2.length)
        return;
      if (typeof columnKeys === "string") {
        columnKeys = [columnKeys];
      }
      if (Array.isArray(columnKeys)) {
        const columns_ = columnKeys.map((key) => getColumnByKey({
          columns: columns.value
        }, key));
        keys2.forEach((key) => {
          const column = columns_.find((col) => col.id === key);
          if (column) {
            column.filteredValue = [];
          }
        });
        instance.store.commit("filterChange", {
          column: columns_,
          values: [],
          silent: true,
          multi: true
        });
      } else {
        keys2.forEach((key) => {
          const column = columns.value.find((col) => col.id === key);
          if (column) {
            column.filteredValue = [];
          }
        });
        filters.value = {};
        instance.store.commit("filterChange", {
          column: {},
          values: [],
          silent: true
        });
      }
    };
    const clearSort = () => {
      if (!sortingColumn.value)
        return;
      updateSort(null, null, null);
      instance.store.commit("changeSortCondition", {
        silent: true
      });
    };
    const {
      setExpandRowKeys,
      toggleRowExpansion,
      updateExpandRows,
      states: expandStates,
      isRowExpanded
    } = useExpand({
      data,
      rowKey
    });
    const {
      updateTreeExpandKeys,
      toggleTreeExpansion,
      updateTreeData,
      loadOrToggle,
      states: treeStates
    } = useTree({
      data,
      rowKey
    });
    const {
      updateCurrentRowData,
      updateCurrentRow,
      setCurrentRowKey,
      states: currentData
    } = useCurrent({
      data,
      rowKey
    });
    const setExpandRowKeysAdapter = (val) => {
      setExpandRowKeys(val);
      updateTreeExpandKeys(val);
    };
    const toggleRowExpansionAdapter = (row, expanded) => {
      const hasExpandColumn = columns.value.some(({ type }) => type === "expand");
      if (hasExpandColumn) {
        toggleRowExpansion(row, expanded);
      } else {
        toggleTreeExpansion(row, expanded);
      }
    };
    return {
      assertRowKey,
      updateColumns,
      scheduleLayout,
      isSelected,
      clearSelection,
      cleanSelection,
      getSelectionRows,
      toggleRowSelection,
      _toggleAllSelection,
      toggleAllSelection: null,
      updateSelectionByRowKey,
      updateAllSelected,
      updateFilters,
      updateCurrentRow,
      updateSort,
      execFilter,
      execSort,
      execQuery,
      clearFilter,
      clearSort,
      toggleRowExpansion,
      setExpandRowKeysAdapter,
      setCurrentRowKey,
      toggleRowExpansionAdapter,
      isRowExpanded,
      updateExpandRows,
      updateCurrentRowData,
      loadOrToggle,
      updateTreeData,
      states: __spreadValues(__spreadValues(__spreadValues({
        tableSize,
        rowKey,
        data,
        _data,
        isComplex,
        _columns,
        originColumns,
        columns,
        fixedColumns,
        rightFixedColumns,
        leafColumns,
        fixedLeafColumns,
        rightFixedLeafColumns,
        leafColumnsLength,
        fixedLeafColumnsLength,
        rightFixedLeafColumnsLength,
        isAllSelected,
        selection,
        reserveSelection,
        selectOnIndeterminate,
        selectable,
        filters,
        filteredData,
        sortingColumn,
        sortProp,
        sortOrder,
        hoverRow
      }, expandStates), treeStates), currentData)
    };
  }
  function replaceColumn(array, column) {
    return array.map((item) => {
      var _a2;
      if (item.id === column.id) {
        return column;
      } else if ((_a2 = item.children) == null ? void 0 : _a2.length) {
        item.children = replaceColumn(item.children, column);
      }
      return item;
    });
  }
  function sortColumn(array) {
    array.forEach((item) => {
      var _a2, _b;
      item.no = (_a2 = item.getColumnIndex) == null ? void 0 : _a2.call(item);
      if ((_b = item.children) == null ? void 0 : _b.length) {
        sortColumn(item.children);
      }
    });
    array.sort((cur, pre) => cur.no - pre.no);
  }
  function useStore() {
    const instance = Vue.getCurrentInstance();
    const watcher = useWatcher$1();
    const ns2 = useNamespace("table");
    const mutations = {
      setData(states, data) {
        const dataInstanceChanged = Vue.unref(states._data) !== data;
        states.data.value = data;
        states._data.value = data;
        instance.store.execQuery();
        instance.store.updateCurrentRowData();
        instance.store.updateExpandRows();
        instance.store.updateTreeData(instance.store.states.defaultExpandAll.value);
        if (Vue.unref(states.reserveSelection)) {
          instance.store.assertRowKey();
          instance.store.updateSelectionByRowKey();
        } else {
          if (dataInstanceChanged) {
            instance.store.clearSelection();
          } else {
            instance.store.cleanSelection();
          }
        }
        instance.store.updateAllSelected();
        if (instance.$ready) {
          instance.store.scheduleLayout();
        }
      },
      insertColumn(states, column, parent) {
        const array = Vue.unref(states._columns);
        let newColumns = [];
        if (!parent) {
          array.push(column);
          newColumns = array;
        } else {
          if (parent && !parent.children) {
            parent.children = [];
          }
          parent.children.push(column);
          newColumns = replaceColumn(array, parent);
        }
        sortColumn(newColumns);
        states._columns.value = newColumns;
        if (column.type === "selection") {
          states.selectable.value = column.selectable;
          states.reserveSelection.value = column.reserveSelection;
        }
        if (instance.$ready) {
          instance.store.updateColumns();
          instance.store.scheduleLayout();
        }
      },
      removeColumn(states, column, parent) {
        const array = Vue.unref(states._columns) || [];
        if (parent) {
          parent.children.splice(parent.children.findIndex((item) => item.id === column.id), 1);
          Vue.nextTick(() => {
            var _a2;
            if (((_a2 = parent.children) == null ? void 0 : _a2.length) === 0) {
              delete parent.children;
            }
          });
          states._columns.value = replaceColumn(array, parent);
        } else {
          const index = array.indexOf(column);
          if (index > -1) {
            array.splice(index, 1);
            states._columns.value = array;
          }
        }
        if (instance.$ready) {
          instance.store.updateColumns();
          instance.store.scheduleLayout();
        }
      },
      sort(states, options) {
        const { prop, order, init } = options;
        if (prop) {
          const column = Vue.unref(states.columns).find((column2) => column2.property === prop);
          if (column) {
            column.order = order;
            instance.store.updateSort(column, prop, order);
            instance.store.commit("changeSortCondition", { init });
          }
        }
      },
      changeSortCondition(states, options) {
        const { sortingColumn, sortProp, sortOrder } = states;
        const columnValue = Vue.unref(sortingColumn), propValue = Vue.unref(sortProp), orderValue = Vue.unref(sortOrder);
        if (orderValue === null) {
          states.sortingColumn.value = null;
          states.sortProp.value = null;
        }
        const ignore = { filter: true };
        instance.store.execQuery(ignore);
        if (!options || !(options.silent || options.init)) {
          instance.emit("sort-change", {
            column: columnValue,
            prop: propValue,
            order: orderValue
          });
        }
        instance.store.updateTableScrollY();
      },
      filterChange(_states, options) {
        const { column, values, silent } = options;
        const newFilters = instance.store.updateFilters(column, values);
        instance.store.execQuery();
        if (!silent) {
          instance.emit("filter-change", newFilters);
        }
        instance.store.updateTableScrollY();
      },
      toggleAllSelection() {
        instance.store.toggleAllSelection();
      },
      rowSelectedChanged(_states, row) {
        instance.store.toggleRowSelection(row);
        instance.store.updateAllSelected();
      },
      setHoverRow(states, row) {
        states.hoverRow.value = row;
      },
      setCurrentRow(_states, row) {
        instance.store.updateCurrentRow(row);
      }
    };
    const commit = function(name, ...args) {
      const mutations2 = instance.store.mutations;
      if (mutations2[name]) {
        mutations2[name].apply(instance, [instance.store.states].concat(args));
      } else {
        throw new Error(`Action not found: ${name}`);
      }
    };
    const updateTableScrollY = function() {
      Vue.nextTick(() => instance.layout.updateScrollY.apply(instance.layout));
    };
    return __spreadProps(__spreadValues({
      ns: ns2
    }, watcher), {
      mutations,
      commit,
      updateTableScrollY
    });
  }
  const InitialStateMap = {
    rowKey: "rowKey",
    defaultExpandAll: "defaultExpandAll",
    selectOnIndeterminate: "selectOnIndeterminate",
    indent: "indent",
    lazy: "lazy",
    data: "data",
    ["treeProps.hasChildren"]: {
      key: "lazyColumnIdentifier",
      default: "hasChildren"
    },
    ["treeProps.children"]: {
      key: "childrenColumnName",
      default: "children"
    }
  };
  function createStore(table, props) {
    if (!table) {
      throw new Error("Table is required.");
    }
    const store = useStore();
    store.toggleAllSelection = debounce(store._toggleAllSelection, 10);
    Object.keys(InitialStateMap).forEach((key) => {
      handleValue(getArrKeysValue(props, key), key, store);
    });
    proxyTableProps(store, props);
    return store;
  }
  function proxyTableProps(store, props) {
    Object.keys(InitialStateMap).forEach((key) => {
      Vue.watch(() => getArrKeysValue(props, key), (value) => {
        handleValue(value, key, store);
      });
    });
  }
  function handleValue(value, propsKey, store) {
    let newVal = value;
    let storeKey = InitialStateMap[propsKey];
    if (typeof InitialStateMap[propsKey] === "object") {
      storeKey = storeKey.key;
      newVal = newVal || InitialStateMap[propsKey].default;
    }
    store.states[storeKey].value = newVal;
  }
  function getArrKeysValue(props, keys2) {
    if (keys2.includes(".")) {
      const keyList = keys2.split(".");
      let value = props;
      keyList.forEach((key) => {
        value = value[key];
      });
      return value;
    } else {
      return props[keys2];
    }
  }
  class TableLayout {
    constructor(options) {
      this.observers = [];
      this.table = null;
      this.store = null;
      this.columns = [];
      this.fit = true;
      this.showHeader = true;
      this.height = Vue.ref(null);
      this.scrollX = Vue.ref(false);
      this.scrollY = Vue.ref(false);
      this.bodyWidth = Vue.ref(null);
      this.fixedWidth = Vue.ref(null);
      this.rightFixedWidth = Vue.ref(null);
      this.gutterWidth = 0;
      for (const name in options) {
        if (hasOwn(options, name)) {
          if (Vue.isRef(this[name])) {
            this[name].value = options[name];
          } else {
            this[name] = options[name];
          }
        }
      }
      if (!this.table) {
        throw new Error("Table is required for Table Layout");
      }
      if (!this.store) {
        throw new Error("Store is required for Table Layout");
      }
    }
    updateScrollY() {
      const height = this.height.value;
      if (height === null)
        return false;
      const scrollBarRef = this.table.refs.scrollBarRef;
      if (this.table.vnode.el && scrollBarRef) {
        let scrollY = true;
        const prevScrollY = this.scrollY.value;
        scrollY = scrollBarRef.wrapRef.scrollHeight > scrollBarRef.wrapRef.clientHeight;
        this.scrollY.value = scrollY;
        return prevScrollY !== scrollY;
      }
      return false;
    }
    setHeight(value, prop = "height") {
      if (!isClient)
        return;
      const el = this.table.vnode.el;
      value = parseHeight(value);
      this.height.value = Number(value);
      if (!el && (value || value === 0))
        return Vue.nextTick(() => this.setHeight(value, prop));
      if (typeof value === "number") {
        el.style[prop] = `${value}px`;
        this.updateElsHeight();
      } else if (typeof value === "string") {
        el.style[prop] = value;
        this.updateElsHeight();
      }
    }
    setMaxHeight(value) {
      this.setHeight(value, "max-height");
    }
    getFlattenColumns() {
      const flattenColumns = [];
      const columns = this.table.store.states.columns.value;
      columns.forEach((column) => {
        if (column.isColumnGroup) {
          flattenColumns.push.apply(flattenColumns, column.columns);
        } else {
          flattenColumns.push(column);
        }
      });
      return flattenColumns;
    }
    updateElsHeight() {
      this.updateScrollY();
      this.notifyObservers("scrollable");
    }
    headerDisplayNone(elm) {
      if (!elm)
        return true;
      let headerChild = elm;
      while (headerChild.tagName !== "DIV") {
        if (getComputedStyle(headerChild).display === "none") {
          return true;
        }
        headerChild = headerChild.parentElement;
      }
      return false;
    }
    updateColumnsWidth() {
      if (!isClient)
        return;
      const fit = this.fit;
      const bodyWidth = this.table.vnode.el.clientWidth;
      let bodyMinWidth = 0;
      const flattenColumns = this.getFlattenColumns();
      const flexColumns = flattenColumns.filter((column) => typeof column.width !== "number");
      flattenColumns.forEach((column) => {
        if (typeof column.width === "number" && column.realWidth)
          column.realWidth = null;
      });
      if (flexColumns.length > 0 && fit) {
        flattenColumns.forEach((column) => {
          bodyMinWidth += Number(column.width || column.minWidth || 80);
        });
        if (bodyMinWidth <= bodyWidth) {
          this.scrollX.value = false;
          const totalFlexWidth = bodyWidth - bodyMinWidth;
          if (flexColumns.length === 1) {
            flexColumns[0].realWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth;
          } else {
            const allColumnsWidth = flexColumns.reduce((prev, column) => prev + Number(column.minWidth || 80), 0);
            const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
            let noneFirstWidth = 0;
            flexColumns.forEach((column, index) => {
              if (index === 0)
                return;
              const flexWidth = Math.floor(Number(column.minWidth || 80) * flexWidthPerPixel);
              noneFirstWidth += flexWidth;
              column.realWidth = Number(column.minWidth || 80) + flexWidth;
            });
            flexColumns[0].realWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
          }
        } else {
          this.scrollX.value = true;
          flexColumns.forEach((column) => {
            column.realWidth = Number(column.minWidth);
          });
        }
        this.bodyWidth.value = Math.max(bodyMinWidth, bodyWidth);
        this.table.state.resizeState.value.width = this.bodyWidth.value;
      } else {
        flattenColumns.forEach((column) => {
          if (!column.width && !column.minWidth) {
            column.realWidth = 80;
          } else {
            column.realWidth = Number(column.width || column.minWidth);
          }
          bodyMinWidth += column.realWidth;
        });
        this.scrollX.value = bodyMinWidth > bodyWidth;
        this.bodyWidth.value = bodyMinWidth;
      }
      const fixedColumns = this.store.states.fixedColumns.value;
      if (fixedColumns.length > 0) {
        let fixedWidth = 0;
        fixedColumns.forEach((column) => {
          fixedWidth += Number(column.realWidth || column.width);
        });
        this.fixedWidth.value = fixedWidth;
      }
      const rightFixedColumns = this.store.states.rightFixedColumns.value;
      if (rightFixedColumns.length > 0) {
        let rightFixedWidth = 0;
        rightFixedColumns.forEach((column) => {
          rightFixedWidth += Number(column.realWidth || column.width);
        });
        this.rightFixedWidth.value = rightFixedWidth;
      }
      this.notifyObservers("columns");
    }
    addObserver(observer) {
      this.observers.push(observer);
    }
    removeObserver(observer) {
      const index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    }
    notifyObservers(event) {
      const observers = this.observers;
      observers.forEach((observer) => {
        var _a2, _b;
        switch (event) {
          case "columns":
            (_a2 = observer.state) == null ? void 0 : _a2.onColumnsChange(this);
            break;
          case "scrollable":
            (_b = observer.state) == null ? void 0 : _b.onScrollableChange(this);
            break;
          default:
            throw new Error(`Table Layout don't have event ${event}.`);
        }
      });
    }
  }
  const { CheckboxGroup: ElCheckboxGroup } = ElCheckbox;
  const _sfc_main$5 = Vue.defineComponent({
    name: "ElTableFilterPanel",
    components: {
      ElCheckbox,
      ElCheckboxGroup,
      ElScrollbar,
      ElTooltip,
      ElIcon,
      ArrowDown: arrow_down_default,
      ArrowUp: arrow_up_default
    },
    directives: { ClickOutside },
    props: {
      placement: {
        type: String,
        default: "bottom-start"
      },
      store: {
        type: Object
      },
      column: {
        type: Object
      },
      upDataColumn: {
        type: Function
      }
    },
    setup(props) {
      const instance = Vue.getCurrentInstance();
      const { t } = useLocale();
      const ns2 = useNamespace("table-filter");
      const parent = instance == null ? void 0 : instance.parent;
      if (!parent.filterPanels.value[props.column.id]) {
        parent.filterPanels.value[props.column.id] = instance;
      }
      const tooltipVisible = Vue.ref(false);
      const tooltip = Vue.ref(null);
      const filters = Vue.computed(() => {
        return props.column && props.column.filters;
      });
      const filterValue = Vue.computed({
        get: () => {
          var _a2;
          return (((_a2 = props.column) == null ? void 0 : _a2.filteredValue) || [])[0];
        },
        set: (value) => {
          if (filteredValue.value) {
            if (typeof value !== "undefined" && value !== null) {
              filteredValue.value.splice(0, 1, value);
            } else {
              filteredValue.value.splice(0, 1);
            }
          }
        }
      });
      const filteredValue = Vue.computed({
        get() {
          if (props.column) {
            return props.column.filteredValue || [];
          }
          return [];
        },
        set(value) {
          if (props.column) {
            props.upDataColumn("filteredValue", value);
          }
        }
      });
      const multiple = Vue.computed(() => {
        if (props.column) {
          return props.column.filterMultiple;
        }
        return true;
      });
      const isActive = (filter) => {
        return filter.value === filterValue.value;
      };
      const hidden = () => {
        tooltipVisible.value = false;
      };
      const showFilterPanel = (e) => {
        e.stopPropagation();
        tooltipVisible.value = !tooltipVisible.value;
      };
      const hideFilterPanel = () => {
        tooltipVisible.value = false;
      };
      const handleConfirm = () => {
        confirmFilter(filteredValue.value);
        hidden();
      };
      const handleReset = () => {
        filteredValue.value = [];
        confirmFilter(filteredValue.value);
        hidden();
      };
      const handleSelect = (_filterValue) => {
        filterValue.value = _filterValue;
        if (typeof _filterValue !== "undefined" && _filterValue !== null) {
          confirmFilter(filteredValue.value);
        } else {
          confirmFilter([]);
        }
        hidden();
      };
      const confirmFilter = (filteredValue2) => {
        props.store.commit("filterChange", {
          column: props.column,
          values: filteredValue2
        });
        props.store.updateAllSelected();
      };
      Vue.watch(tooltipVisible, (value) => {
        if (props.column) {
          props.upDataColumn("filterOpened", value);
        }
      }, {
        immediate: true
      });
      const popperPaneRef = Vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = tooltip.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef;
      });
      return {
        tooltipVisible,
        multiple,
        filteredValue,
        filterValue,
        filters,
        handleConfirm,
        handleReset,
        handleSelect,
        isActive,
        t,
        ns: ns2,
        showFilterPanel,
        hideFilterPanel,
        popperPaneRef,
        tooltip
      };
    }
  });
  const _hoisted_1$4 = { key: 0 };
  const _hoisted_2$3 = ["disabled"];
  const _hoisted_3$1 = ["label", "onClick"];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_checkbox = Vue.resolveComponent("el-checkbox");
    const _component_el_checkbox_group = Vue.resolveComponent("el-checkbox-group");
    const _component_el_scrollbar = Vue.resolveComponent("el-scrollbar");
    const _component_arrow_up = Vue.resolveComponent("arrow-up");
    const _component_arrow_down = Vue.resolveComponent("arrow-down");
    const _component_el_icon = Vue.resolveComponent("el-icon");
    const _component_el_tooltip = Vue.resolveComponent("el-tooltip");
    const _directive_click_outside = Vue.resolveDirective("click-outside");
    return Vue.openBlock(), Vue.createBlock(_component_el_tooltip, {
      ref: "tooltip",
      visible: _ctx.tooltipVisible,
      offset: 0,
      placement: _ctx.placement,
      "show-arrow": false,
      "stop-popper-mouse-event": false,
      teleported: "",
      effect: "light",
      pure: "",
      "popper-class": _ctx.ns.b(),
      persistent: ""
    }, {
      content: Vue.withCtx(() => [
        _ctx.multiple ? (Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1$4, [
          Vue.createElementVNode("div", {
            class: Vue.normalizeClass(_ctx.ns.e("content"))
          }, [
            Vue.createVNode(_component_el_scrollbar, {
              "wrap-class": _ctx.ns.e("wrap")
            }, {
              default: Vue.withCtx(() => [
                Vue.createVNode(_component_el_checkbox_group, {
                  modelValue: _ctx.filteredValue,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.filteredValue = $event),
                  class: Vue.normalizeClass(_ctx.ns.e("checkbox-group"))
                }, {
                  default: Vue.withCtx(() => [
                    (Vue.openBlock(true), Vue.createElementBlock(Vue.Fragment, null, Vue.renderList(_ctx.filters, (filter) => {
                      return Vue.openBlock(), Vue.createBlock(_component_el_checkbox, {
                        key: filter.value,
                        label: filter.value
                      }, {
                        default: Vue.withCtx(() => [
                          Vue.createTextVNode(Vue.toDisplayString(filter.text), 1)
                        ]),
                        _: 2
                      }, 1032, ["label"]);
                    }), 128))
                  ]),
                  _: 1
                }, 8, ["modelValue", "class"])
              ]),
              _: 1
            }, 8, ["wrap-class"])
          ], 2),
          Vue.createElementVNode("div", {
            class: Vue.normalizeClass(_ctx.ns.e("bottom"))
          }, [
            Vue.createElementVNode("button", {
              class: Vue.normalizeClass({ [_ctx.ns.is("disabled")]: _ctx.filteredValue.length === 0 }),
              disabled: _ctx.filteredValue.length === 0,
              type: "button",
              onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleConfirm && _ctx.handleConfirm(...args))
            }, Vue.toDisplayString(_ctx.t("el.table.confirmFilter")), 11, _hoisted_2$3),
            Vue.createElementVNode("button", {
              type: "button",
              onClick: _cache[2] || (_cache[2] = (...args) => _ctx.handleReset && _ctx.handleReset(...args))
            }, Vue.toDisplayString(_ctx.t("el.table.resetFilter")), 1)
          ], 2)
        ])) : (Vue.openBlock(), Vue.createElementBlock("ul", {
          key: 1,
          class: Vue.normalizeClass(_ctx.ns.e("list"))
        }, [
          Vue.createElementVNode("li", {
            class: Vue.normalizeClass([
              _ctx.ns.e("list-item"),
              {
                [_ctx.ns.is("active")]: _ctx.filterValue === void 0 || _ctx.filterValue === null
              }
            ]),
            onClick: _cache[3] || (_cache[3] = ($event) => _ctx.handleSelect(null))
          }, Vue.toDisplayString(_ctx.t("el.table.clearFilter")), 3),
          (Vue.openBlock(true), Vue.createElementBlock(Vue.Fragment, null, Vue.renderList(_ctx.filters, (filter) => {
            return Vue.openBlock(), Vue.createElementBlock("li", {
              key: filter.value,
              class: Vue.normalizeClass([_ctx.ns.e("list-item"), _ctx.ns.is("active", _ctx.isActive(filter))]),
              label: filter.value,
              onClick: ($event) => _ctx.handleSelect(filter.value)
            }, Vue.toDisplayString(filter.text), 11, _hoisted_3$1);
          }), 128))
        ], 2))
      ]),
      default: Vue.withCtx(() => [
        Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("span", {
          class: Vue.normalizeClass([
            `${_ctx.ns.namespace.value}-table__column-filter-trigger`,
            `${_ctx.ns.namespace.value}-none-outline`
          ]),
          onClick: _cache[4] || (_cache[4] = (...args) => _ctx.showFilterPanel && _ctx.showFilterPanel(...args))
        }, [
          Vue.createVNode(_component_el_icon, null, {
            default: Vue.withCtx(() => [
              _ctx.column.filterOpened ? (Vue.openBlock(), Vue.createBlock(_component_arrow_up, { key: 0 })) : (Vue.openBlock(), Vue.createBlock(_component_arrow_down, { key: 1 }))
            ]),
            _: 1
          })
        ], 2)), [
          [_directive_click_outside, _ctx.hideFilterPanel, _ctx.popperPaneRef]
        ])
      ]),
      _: 1
    }, 8, ["visible", "placement", "popper-class"]);
  }
  var FilterPanel = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$1], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/table/src/filter-panel.vue"]]);
  function useLayoutObserver(root2) {
    const instance = Vue.getCurrentInstance();
    Vue.onBeforeMount(() => {
      tableLayout.value.addObserver(instance);
    });
    Vue.onMounted(() => {
      onColumnsChange(tableLayout.value);
      onScrollableChange(tableLayout.value);
    });
    Vue.onUpdated(() => {
      onColumnsChange(tableLayout.value);
      onScrollableChange(tableLayout.value);
    });
    Vue.onUnmounted(() => {
      tableLayout.value.removeObserver(instance);
    });
    const tableLayout = Vue.computed(() => {
      const layout = root2.layout;
      if (!layout) {
        throw new Error("Can not find table layout.");
      }
      return layout;
    });
    const onColumnsChange = (layout) => {
      var _a2;
      const cols = ((_a2 = root2.vnode.el) == null ? void 0 : _a2.querySelectorAll("colgroup > col")) || [];
      if (!cols.length)
        return;
      const flattenColumns = layout.getFlattenColumns();
      const columnsMap = {};
      flattenColumns.forEach((column) => {
        columnsMap[column.id] = column;
      });
      for (let i = 0, j = cols.length; i < j; i++) {
        const col = cols[i];
        const name = col.getAttribute("name");
        const column = columnsMap[name];
        if (column) {
          col.setAttribute("width", column.realWidth || column.width);
        }
      }
    };
    const onScrollableChange = (layout) => {
      var _a2, _b;
      const cols = ((_a2 = root2.vnode.el) == null ? void 0 : _a2.querySelectorAll("colgroup > col[name=gutter]")) || [];
      for (let i = 0, j = cols.length; i < j; i++) {
        const col = cols[i];
        col.setAttribute("width", layout.scrollY.value ? layout.gutterWidth : "0");
      }
      const ths = ((_b = root2.vnode.el) == null ? void 0 : _b.querySelectorAll("th.gutter")) || [];
      for (let i = 0, j = ths.length; i < j; i++) {
        const th = ths[i];
        th.style.width = layout.scrollY.value ? `${layout.gutterWidth}px` : "0";
        th.style.display = layout.scrollY.value ? "" : "none";
      }
    };
    return {
      tableLayout: tableLayout.value,
      onColumnsChange,
      onScrollableChange
    };
  }
  const TABLE_INJECTION_KEY = Symbol("ElTable");
  function useEvent(props, emit) {
    const instance = Vue.getCurrentInstance();
    const parent = Vue.inject(TABLE_INJECTION_KEY);
    const handleFilterClick = (event) => {
      event.stopPropagation();
      return;
    };
    const handleHeaderClick = (event, column) => {
      if (!column.filters && column.sortable) {
        handleSortClick(event, column, false);
      } else if (column.filterable && !column.sortable) {
        handleFilterClick(event);
      }
      parent == null ? void 0 : parent.emit("header-click", column, event);
    };
    const handleHeaderContextMenu = (event, column) => {
      parent == null ? void 0 : parent.emit("header-contextmenu", column, event);
    };
    const draggingColumn = Vue.ref(null);
    const dragging = Vue.ref(false);
    const dragState = Vue.ref({});
    const handleMouseDown = (event, column) => {
      if (!isClient)
        return;
      if (column.children && column.children.length > 0)
        return;
      if (draggingColumn.value && props.border) {
        dragging.value = true;
        const table = parent;
        emit("set-drag-visible", true);
        const tableEl = table == null ? void 0 : table.vnode.el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = instance.vnode.el.querySelector(`th.${column.id}`);
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = columnRect.left - tableLeft + 30;
        addClass(columnEl, "noclick");
        dragState.value = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft
        };
        const resizeProxy = table == null ? void 0 : table.refs.resizeProxy;
        resizeProxy.style.left = `${dragState.value.startLeft}px`;
        document.onselectstart = function() {
          return false;
        };
        document.ondragstart = function() {
          return false;
        };
        const handleMouseMove2 = (event2) => {
          const deltaLeft = event2.clientX - dragState.value.startMouseLeft;
          const proxyLeft = dragState.value.startLeft + deltaLeft;
          resizeProxy.style.left = `${Math.max(minLeft, proxyLeft)}px`;
        };
        const handleMouseUp = () => {
          if (dragging.value) {
            const { startColumnLeft, startLeft } = dragState.value;
            const finalLeft = Number.parseInt(resizeProxy.style.left, 10);
            const columnWidth = finalLeft - startColumnLeft;
            column.width = column.realWidth = columnWidth;
            table == null ? void 0 : table.emit("header-dragend", column.width, startLeft - startColumnLeft, column, event);
            requestAnimationFrame(() => {
              props.store.scheduleLayout(false, true);
            });
            document.body.style.cursor = "";
            dragging.value = false;
            draggingColumn.value = null;
            dragState.value = {};
            emit("set-drag-visible", false);
          }
          document.removeEventListener("mousemove", handleMouseMove2);
          document.removeEventListener("mouseup", handleMouseUp);
          document.onselectstart = null;
          document.ondragstart = null;
          setTimeout(() => {
            removeClass(columnEl, "noclick");
          }, 0);
        };
        document.addEventListener("mousemove", handleMouseMove2);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };
    const handleMouseMove = (event, column) => {
      var _a2;
      if (column.children && column.children.length > 0)
        return;
      const target = (_a2 = event.target) == null ? void 0 : _a2.closest("th");
      if (!column || !column.resizable)
        return;
      if (!dragging.value && props.border) {
        const rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = "col-resize";
          if (hasClass(target, "is-sortable")) {
            target.style.cursor = "col-resize";
          }
          draggingColumn.value = column;
        } else if (!dragging.value) {
          bodyStyle.cursor = "";
          if (hasClass(target, "is-sortable")) {
            target.style.cursor = "pointer";
          }
          draggingColumn.value = null;
        }
      }
    };
    const handleMouseOut = () => {
      if (!isClient)
        return;
      document.body.style.cursor = "";
    };
    const toggleOrder = ({ order, sortOrders }) => {
      if (order === "")
        return sortOrders[0];
      const index = sortOrders.indexOf(order || null);
      return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
    };
    const handleSortClick = (event, column, givenOrder) => {
      var _a2;
      event.stopPropagation();
      const order = column.order === givenOrder ? null : givenOrder || toggleOrder(column);
      const target = (_a2 = event.target) == null ? void 0 : _a2.closest("th");
      if (target) {
        if (hasClass(target, "noclick")) {
          removeClass(target, "noclick");
          return;
        }
      }
      if (!column.sortable)
        return;
      const states = props.store.states;
      let sortProp = states.sortProp.value;
      let sortOrder;
      const sortingColumn = states.sortingColumn.value;
      if (sortingColumn !== column || sortingColumn === column && sortingColumn.order === null) {
        if (sortingColumn) {
          sortingColumn.order = null;
        }
        states.sortingColumn.value = column;
        sortProp = column.property;
      }
      if (!order) {
        sortOrder = column.order = null;
      } else {
        sortOrder = column.order = order;
      }
      states.sortProp.value = sortProp;
      states.sortOrder.value = sortOrder;
      parent == null ? void 0 : parent.store.commit("changeSortCondition");
    };
    return {
      handleHeaderClick,
      handleHeaderContextMenu,
      handleMouseDown,
      handleMouseMove,
      handleMouseOut,
      handleSortClick,
      handleFilterClick
    };
  }
  function useStyle$2(props) {
    const parent = Vue.inject(TABLE_INJECTION_KEY);
    const ns2 = useNamespace("table");
    const getHeaderRowStyle = (rowIndex) => {
      const headerRowStyle = parent == null ? void 0 : parent.props.headerRowStyle;
      if (typeof headerRowStyle === "function") {
        return headerRowStyle.call(null, { rowIndex });
      }
      return headerRowStyle;
    };
    const getHeaderRowClass = (rowIndex) => {
      const classes = [];
      const headerRowClassName = parent == null ? void 0 : parent.props.headerRowClassName;
      if (typeof headerRowClassName === "string") {
        classes.push(headerRowClassName);
      } else if (typeof headerRowClassName === "function") {
        classes.push(headerRowClassName.call(null, { rowIndex }));
      }
      return classes.join(" ");
    };
    const getHeaderCellStyle = (rowIndex, columnIndex, row, column) => {
      var _a2;
      let headerCellStyles = (_a2 = parent == null ? void 0 : parent.props.headerCellStyle) != null ? _a2 : {};
      if (typeof headerCellStyles === "function") {
        headerCellStyles = headerCellStyles.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      }
      const fixedStyle = getFixedColumnOffset(columnIndex, column.fixed, props.store, row);
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return Object.assign({}, headerCellStyles, fixedStyle);
    };
    const getHeaderCellClass = (rowIndex, columnIndex, row, column) => {
      const fixedClasses = getFixedColumnsClass(ns2.b(), columnIndex, column.fixed, props.store, row);
      const classes = [
        column.id,
        column.order,
        column.headerAlign,
        column.className,
        column.labelClassName,
        ...fixedClasses
      ];
      if (!column.children) {
        classes.push("is-leaf");
      }
      if (column.sortable) {
        classes.push("is-sortable");
      }
      const headerCellClassName = parent == null ? void 0 : parent.props.headerCellClassName;
      if (typeof headerCellClassName === "string") {
        classes.push(headerCellClassName);
      } else if (typeof headerCellClassName === "function") {
        classes.push(headerCellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }
      classes.push(ns2.e("cell"));
      return classes.filter((className) => Boolean(className)).join(" ");
    };
    return {
      getHeaderRowStyle,
      getHeaderRowClass,
      getHeaderCellStyle,
      getHeaderCellClass
    };
  }
  const getAllColumns = (columns) => {
    const result = [];
    columns.forEach((column) => {
      if (column.children) {
        result.push(column);
        result.push.apply(result, getAllColumns(column.children));
      } else {
        result.push(column);
      }
    });
    return result;
  };
  const convertToRows = (originColumns) => {
    let maxLevel = 1;
    const traverse2 = (column, parent) => {
      if (parent) {
        column.level = parent.level + 1;
        if (maxLevel < column.level) {
          maxLevel = column.level;
        }
      }
      if (column.children) {
        let colSpan = 0;
        column.children.forEach((subColumn) => {
          traverse2(subColumn, column);
          colSpan += subColumn.colSpan;
        });
        column.colSpan = colSpan;
      } else {
        column.colSpan = 1;
      }
    };
    originColumns.forEach((column) => {
      column.level = 1;
      traverse2(column, void 0);
    });
    const rows = [];
    for (let i = 0; i < maxLevel; i++) {
      rows.push([]);
    }
    const allColumns = getAllColumns(originColumns);
    allColumns.forEach((column) => {
      if (!column.children) {
        column.rowSpan = maxLevel - column.level + 1;
      } else {
        column.rowSpan = 1;
        column.children.forEach((col) => col.isSubColumn = true);
      }
      rows[column.level - 1].push(column);
    });
    return rows;
  };
  function useUtils$1(props) {
    const parent = Vue.inject(TABLE_INJECTION_KEY);
    const columnRows = Vue.computed(() => {
      return convertToRows(props.store.states.originColumns.value);
    });
    const isGroup = Vue.computed(() => {
      const result = columnRows.value.length > 1;
      if (result && parent) {
        parent.state.isGroup.value = true;
      }
      return result;
    });
    const toggleAllSelection = (event) => {
      event.stopPropagation();
      parent == null ? void 0 : parent.store.commit("toggleAllSelection");
    };
    return {
      isGroup,
      toggleAllSelection,
      columnRows
    };
  }
  var TableHeader = Vue.defineComponent({
    name: "ElTableHeader",
    components: {
      ElCheckbox
    },
    props: {
      fixed: {
        type: String,
        default: ""
      },
      store: {
        required: true,
        type: Object
      },
      border: Boolean,
      defaultSort: {
        type: Object,
        default: () => {
          return {
            prop: "",
            order: ""
          };
        }
      }
    },
    setup(props, { emit }) {
      const instance = Vue.getCurrentInstance();
      const parent = Vue.inject(TABLE_INJECTION_KEY);
      const ns2 = useNamespace("table");
      const filterPanels = Vue.ref({});
      const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent);
      Vue.onMounted(async () => {
        await Vue.nextTick();
        await Vue.nextTick();
        const { prop, order } = props.defaultSort;
        parent == null ? void 0 : parent.store.commit("sort", { prop, order, init: true });
      });
      const {
        handleHeaderClick,
        handleHeaderContextMenu,
        handleMouseDown,
        handleMouseMove,
        handleMouseOut,
        handleSortClick,
        handleFilterClick
      } = useEvent(props, emit);
      const {
        getHeaderRowStyle,
        getHeaderRowClass,
        getHeaderCellStyle,
        getHeaderCellClass
      } = useStyle$2(props);
      const { isGroup, toggleAllSelection, columnRows } = useUtils$1(props);
      instance.state = {
        onColumnsChange,
        onScrollableChange
      };
      instance.filterPanels = filterPanels;
      return {
        ns: ns2,
        filterPanels,
        onColumnsChange,
        onScrollableChange,
        columnRows,
        getHeaderRowClass,
        getHeaderRowStyle,
        getHeaderCellClass,
        getHeaderCellStyle,
        handleHeaderClick,
        handleHeaderContextMenu,
        handleMouseDown,
        handleMouseMove,
        handleMouseOut,
        handleSortClick,
        handleFilterClick,
        isGroup,
        toggleAllSelection
      };
    },
    render() {
      const {
        ns: ns2,
        isGroup,
        columnRows,
        getHeaderCellStyle,
        getHeaderCellClass,
        getHeaderRowClass,
        getHeaderRowStyle,
        handleHeaderClick,
        handleHeaderContextMenu,
        handleMouseDown,
        handleMouseMove,
        handleSortClick,
        handleMouseOut,
        store,
        $parent
      } = this;
      let rowSpan = 1;
      return Vue.h("thead", {
        class: { [ns2.is("group")]: isGroup }
      }, columnRows.map((subColumns, rowIndex) => Vue.h("tr", {
        class: getHeaderRowClass(rowIndex),
        key: rowIndex,
        style: getHeaderRowStyle(rowIndex)
      }, subColumns.map((column, cellIndex) => {
        if (column.rowSpan > rowSpan) {
          rowSpan = column.rowSpan;
        }
        return Vue.h("th", {
          class: getHeaderCellClass(rowIndex, cellIndex, subColumns, column),
          colspan: column.colSpan,
          key: `${column.id}-thead`,
          rowspan: column.rowSpan,
          style: getHeaderCellStyle(rowIndex, cellIndex, subColumns, column),
          onClick: ($event) => handleHeaderClick($event, column),
          onContextmenu: ($event) => handleHeaderContextMenu($event, column),
          onMousedown: ($event) => handleMouseDown($event, column),
          onMousemove: ($event) => handleMouseMove($event, column),
          onMouseout: handleMouseOut
        }, [
          Vue.h("div", {
            class: [
              "cell",
              column.filteredValue && column.filteredValue.length > 0 ? "highlight" : ""
            ]
          }, [
            column.renderHeader ? column.renderHeader({
              column,
              $index: cellIndex,
              store,
              _self: $parent
            }) : column.label,
            column.sortable && Vue.h("span", {
              onClick: ($event) => handleSortClick($event, column),
              class: "caret-wrapper"
            }, [
              Vue.h("i", {
                onClick: ($event) => handleSortClick($event, column, "ascending"),
                class: "sort-caret ascending"
              }),
              Vue.h("i", {
                onClick: ($event) => handleSortClick($event, column, "descending"),
                class: "sort-caret descending"
              })
            ]),
            column.filterable && Vue.h(FilterPanel, {
              store,
              placement: column.filterPlacement || "bottom-start",
              column,
              upDataColumn: (key, value) => {
                column[key] = value;
              }
            })
          ])
        ]);
      }))));
    }
  });
  function useEvents(props) {
    const parent = Vue.inject(TABLE_INJECTION_KEY);
    const tooltipContent = Vue.ref("");
    const tooltipTrigger = Vue.ref(Vue.h("div"));
    const handleEvent = (event, row, name) => {
      var _a2;
      const table = parent;
      const cell = getCell(event);
      let column;
      const namespace = (_a2 = table == null ? void 0 : table.vnode.el) == null ? void 0 : _a2.dataset.prefix;
      if (cell) {
        column = getColumnByCell({
          columns: props.store.states.columns.value
        }, cell, namespace);
        if (column) {
          table == null ? void 0 : table.emit(`cell-${name}`, row, column, cell, event);
        }
      }
      table == null ? void 0 : table.emit(`row-${name}`, row, column, event);
    };
    const handleDoubleClick = (event, row) => {
      handleEvent(event, row, "dblclick");
    };
    const handleClick = (event, row) => {
      props.store.commit("setCurrentRow", row);
      handleEvent(event, row, "click");
    };
    const handleContextMenu = (event, row) => {
      handleEvent(event, row, "contextmenu");
    };
    const handleMouseEnter = debounce((index) => {
      props.store.commit("setHoverRow", index);
    }, 30);
    const handleMouseLeave = debounce(() => {
      props.store.commit("setHoverRow", null);
    }, 30);
    const handleCellMouseEnter = (event, row, tooltipOptions) => {
      var _a2;
      const table = parent;
      const cell = getCell(event);
      const namespace = (_a2 = table == null ? void 0 : table.vnode.el) == null ? void 0 : _a2.dataset.prefix;
      if (cell) {
        const column = getColumnByCell({
          columns: props.store.states.columns.value
        }, cell, namespace);
        const hoverState = table.hoverState = { cell, column, row };
        table == null ? void 0 : table.emit("cell-mouse-enter", hoverState.row, hoverState.column, hoverState.cell, event);
      }
      if (!tooltipOptions) {
        return;
      }
      const cellChild = event.target.querySelector(".cell");
      if (!(hasClass(cellChild, `${namespace}-tooltip`) && cellChild.childNodes.length)) {
        return;
      }
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = Math.round(range.getBoundingClientRect().width);
      const padding = (Number.parseInt(getStyle(cellChild, "paddingLeft"), 10) || 0) + (Number.parseInt(getStyle(cellChild, "paddingRight"), 10) || 0);
      if (rangeWidth + padding > cellChild.offsetWidth || cellChild.scrollWidth > cellChild.offsetWidth) {
        createTablePopper(parent == null ? void 0 : parent.refs.tableWrapper, cell, cell.innerText || cell.textContent, tooltipOptions);
      }
    };
    const handleCellMouseLeave = (event) => {
      const cell = getCell(event);
      if (!cell)
        return;
      const oldHoverState = parent == null ? void 0 : parent.hoverState;
      parent == null ? void 0 : parent.emit("cell-mouse-leave", oldHoverState == null ? void 0 : oldHoverState.row, oldHoverState == null ? void 0 : oldHoverState.column, oldHoverState == null ? void 0 : oldHoverState.cell, event);
    };
    return {
      handleDoubleClick,
      handleClick,
      handleContextMenu,
      handleMouseEnter,
      handleMouseLeave,
      handleCellMouseEnter,
      handleCellMouseLeave,
      tooltipContent,
      tooltipTrigger
    };
  }
  function useStyles(props) {
    const parent = Vue.inject(TABLE_INJECTION_KEY);
    const ns2 = useNamespace("table");
    const getRowStyle = (row, rowIndex) => {
      const rowStyle = parent == null ? void 0 : parent.props.rowStyle;
      if (typeof rowStyle === "function") {
        return rowStyle.call(null, {
          row,
          rowIndex
        });
      }
      return rowStyle || null;
    };
    const getRowClass = (row, rowIndex) => {
      const classes = [ns2.e("row")];
      if ((parent == null ? void 0 : parent.props.highlightCurrentRow) && row === props.store.states.currentRow.value) {
        classes.push("current-row");
      }
      if (props.stripe && rowIndex % 2 === 1) {
        classes.push(ns2.em("row", "striped"));
      }
      const rowClassName = parent == null ? void 0 : parent.props.rowClassName;
      if (typeof rowClassName === "string") {
        classes.push(rowClassName);
      } else if (typeof rowClassName === "function") {
        classes.push(rowClassName.call(null, {
          row,
          rowIndex
        }));
      }
      return classes;
    };
    const getCellStyle = (rowIndex, columnIndex, row, column) => {
      const cellStyle = parent == null ? void 0 : parent.props.cellStyle;
      let cellStyles = cellStyle != null ? cellStyle : {};
      if (typeof cellStyle === "function") {
        cellStyles = cellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      }
      const fixedStyle = getFixedColumnOffset(columnIndex, props == null ? void 0 : props.fixed, props.store);
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return Object.assign({}, cellStyles, fixedStyle);
    };
    const getCellClass = (rowIndex, columnIndex, row, column, offset) => {
      const fixedClasses = getFixedColumnsClass(ns2.b(), columnIndex, props == null ? void 0 : props.fixed, props.store, void 0, offset);
      const classes = [column.id, column.align, column.className, ...fixedClasses];
      const cellClassName = parent == null ? void 0 : parent.props.cellClassName;
      if (typeof cellClassName === "string") {
        classes.push(cellClassName);
      } else if (typeof cellClassName === "function") {
        classes.push(cellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }
      classes.push(ns2.e("cell"));
      return classes.filter((className) => Boolean(className)).join(" ");
    };
    const getSpan = (row, column, rowIndex, columnIndex) => {
      let rowspan = 1;
      let colspan = 1;
      const fn2 = parent == null ? void 0 : parent.props.spanMethod;
      if (typeof fn2 === "function") {
        const result = fn2({
          row,
          column,
          rowIndex,
          columnIndex
        });
        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (typeof result === "object") {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
      }
      return { rowspan, colspan };
    };
    const getColspanRealWidth = (columns, colspan, index) => {
      if (colspan < 1) {
        return columns[index].realWidth;
      }
      const widthArr = columns.map(({ realWidth, width }) => realWidth || width).slice(index, index + colspan);
      return Number(widthArr.reduce((acc, width) => Number(acc) + Number(width), -1));
    };
    return {
      getRowStyle,
      getRowClass,
      getCellStyle,
      getCellClass,
      getSpan,
      getColspanRealWidth
    };
  }
  function useRender$1(props) {
    const parent = Vue.inject(TABLE_INJECTION_KEY);
    const ns2 = useNamespace("table");
    const {
      handleDoubleClick,
      handleClick,
      handleContextMenu,
      handleMouseEnter,
      handleMouseLeave,
      handleCellMouseEnter,
      handleCellMouseLeave,
      tooltipContent,
      tooltipTrigger
    } = useEvents(props);
    const {
      getRowStyle,
      getRowClass,
      getCellStyle,
      getCellClass,
      getSpan,
      getColspanRealWidth
    } = useStyles(props);
    const firstDefaultColumnIndex = Vue.computed(() => {
      return props.store.states.columns.value.findIndex(({ type }) => type === "default");
    });
    const getKeyOfRow = (row, index) => {
      const rowKey = parent.props.rowKey;
      if (rowKey) {
        return getRowIdentity(row, rowKey);
      }
      return index;
    };
    const rowRender = (row, $index, treeRowData, expanded = false) => {
      const { tooltipEffect, tooltipOptions, store } = props;
      const { indent, columns } = store.states;
      const rowClasses = getRowClass(row, $index);
      let display = true;
      if (treeRowData) {
        rowClasses.push(ns2.em("row", `level-${treeRowData.level}`));
        display = treeRowData.display;
      }
      const displayStyle = display ? null : {
        display: "none"
      };
      return Vue.h("tr", {
        style: [displayStyle, getRowStyle(row, $index)],
        class: rowClasses,
        key: getKeyOfRow(row, $index),
        onDblclick: ($event) => handleDoubleClick($event, row),
        onClick: ($event) => handleClick($event, row),
        onContextmenu: ($event) => handleContextMenu($event, row),
        onMouseenter: () => handleMouseEnter($index),
        onMouseleave: handleMouseLeave
      }, columns.value.map((column, cellIndex) => {
        const { rowspan, colspan } = getSpan(row, column, $index, cellIndex);
        if (!rowspan || !colspan) {
          return null;
        }
        const columnData = __spreadValues({}, column);
        columnData.realWidth = getColspanRealWidth(columns.value, colspan, cellIndex);
        const data = {
          store: props.store,
          _self: props.context || parent,
          column: columnData,
          row,
          $index,
          cellIndex,
          expanded
        };
        if (cellIndex === firstDefaultColumnIndex.value && treeRowData) {
          data.treeNode = {
            indent: treeRowData.level * indent.value,
            level: treeRowData.level
          };
          if (typeof treeRowData.expanded === "boolean") {
            data.treeNode.expanded = treeRowData.expanded;
            if ("loading" in treeRowData) {
              data.treeNode.loading = treeRowData.loading;
            }
            if ("noLazyChildren" in treeRowData) {
              data.treeNode.noLazyChildren = treeRowData.noLazyChildren;
            }
          }
        }
        const baseKey = `${$index},${cellIndex}`;
        const patchKey = columnData.columnKey || columnData.rawColumnKey || "";
        const tdChildren = cellChildren(cellIndex, column, data);
        const mergedTooltipOptions = column.showOverflowTooltip && merge$1({
          effect: tooltipEffect
        }, tooltipOptions, column.showOverflowTooltip);
        return Vue.h("td", {
          style: getCellStyle($index, cellIndex, row, column),
          class: getCellClass($index, cellIndex, row, column, colspan - 1),
          key: `${patchKey}${baseKey}`,
          rowspan,
          colspan,
          onMouseenter: ($event) => handleCellMouseEnter($event, row, mergedTooltipOptions),
          onMouseleave: handleCellMouseLeave
        }, [tdChildren]);
      }));
    };
    const cellChildren = (cellIndex, column, data) => {
      return column.renderCell(data);
    };
    const wrappedRowRender = (row, $index) => {
      const store = props.store;
      const { isRowExpanded, assertRowKey } = store;
      const { treeData, lazyTreeNodeMap, childrenColumnName, rowKey } = store.states;
      const columns = store.states.columns.value;
      const hasExpandColumn = columns.some(({ type }) => type === "expand");
      if (hasExpandColumn) {
        const expanded = isRowExpanded(row);
        const tr = rowRender(row, $index, void 0, expanded);
        const renderExpanded = parent.renderExpanded;
        if (expanded) {
          if (!renderExpanded) {
            console.error("[Element Error]renderExpanded is required.");
            return tr;
          }
          return [
            [
              tr,
              Vue.h("tr", {
                key: `expanded-row__${tr.key}`
              }, [
                Vue.h("td", {
                  colspan: columns.length,
                  class: `${ns2.e("cell")} ${ns2.e("expanded-cell")}`
                }, [renderExpanded({ row, $index, store, expanded })])
              ])
            ]
          ];
        } else {
          return [[tr]];
        }
      } else if (Object.keys(treeData.value).length) {
        assertRowKey();
        const key = getRowIdentity(row, rowKey.value);
        let cur = treeData.value[key];
        let treeRowData = null;
        if (cur) {
          treeRowData = {
            expanded: cur.expanded,
            level: cur.level,
            display: true
          };
          if (typeof cur.lazy === "boolean") {
            if (typeof cur.loaded === "boolean" && cur.loaded) {
              treeRowData.noLazyChildren = !(cur.children && cur.children.length);
            }
            treeRowData.loading = cur.loading;
          }
        }
        const tmp = [rowRender(row, $index, treeRowData)];
        if (cur) {
          let i = 0;
          const traverse2 = (children, parent2) => {
            if (!(children && children.length && parent2))
              return;
            children.forEach((node) => {
              const innerTreeRowData = {
                display: parent2.display && parent2.expanded,
                level: parent2.level + 1,
                expanded: false,
                noLazyChildren: false,
                loading: false
              };
              const childKey = getRowIdentity(node, rowKey.value);
              if (childKey === void 0 || childKey === null) {
                throw new Error("For nested data item, row-key is required.");
              }
              cur = __spreadValues({}, treeData.value[childKey]);
              if (cur) {
                innerTreeRowData.expanded = cur.expanded;
                cur.level = cur.level || innerTreeRowData.level;
                cur.display = !!(cur.expanded && innerTreeRowData.display);
                if (typeof cur.lazy === "boolean") {
                  if (typeof cur.loaded === "boolean" && cur.loaded) {
                    innerTreeRowData.noLazyChildren = !(cur.children && cur.children.length);
                  }
                  innerTreeRowData.loading = cur.loading;
                }
              }
              i++;
              tmp.push(rowRender(node, $index + i, innerTreeRowData));
              if (cur) {
                const nodes2 = lazyTreeNodeMap.value[childKey] || node[childrenColumnName.value];
                traverse2(nodes2, cur);
              }
            });
          };
          cur.display = true;
          const nodes = lazyTreeNodeMap.value[key] || row[childrenColumnName.value];
          traverse2(nodes, cur);
        }
        return tmp;
      } else {
        return rowRender(row, $index, void 0);
      }
    };
    return {
      wrappedRowRender,
      tooltipContent,
      tooltipTrigger
    };
  }
  const defaultProps$2 = {
    store: {
      required: true,
      type: Object
    },
    stripe: Boolean,
    tooltipEffect: String,
    tooltipOptions: {
      type: Object
    },
    context: {
      default: () => ({}),
      type: Object
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    fixed: {
      type: String,
      default: ""
    },
    highlight: Boolean
  };
  var TableBody = Vue.defineComponent({
    name: "ElTableBody",
    props: defaultProps$2,
    setup(props) {
      const instance = Vue.getCurrentInstance();
      const parent = Vue.inject(TABLE_INJECTION_KEY);
      const ns2 = useNamespace("table");
      const { wrappedRowRender, tooltipContent, tooltipTrigger } = useRender$1(props);
      const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent);
      Vue.watch(props.store.states.hoverRow, (newVal, oldVal) => {
        if (!props.store.states.isComplex.value || !isClient)
          return;
        let raf = window.requestAnimationFrame;
        if (!raf) {
          raf = (fn2) => window.setTimeout(fn2, 16);
        }
        raf(() => {
          const el = instance == null ? void 0 : instance.vnode.el;
          const rows = Array.from((el == null ? void 0 : el.children) || []).filter((e) => e == null ? void 0 : e.classList.contains(`${ns2.e("row")}`));
          const oldRow = rows[oldVal];
          const newRow = rows[newVal];
          if (oldRow) {
            removeClass(oldRow, "hover-row");
          }
          if (newRow) {
            addClass(newRow, "hover-row");
          }
        });
      });
      Vue.onUnmounted(() => {
        var _a2;
        (_a2 = removePopper) == null ? void 0 : _a2();
      });
      return {
        ns: ns2,
        onColumnsChange,
        onScrollableChange,
        wrappedRowRender,
        tooltipContent,
        tooltipTrigger
      };
    },
    render() {
      const { wrappedRowRender, store } = this;
      const data = store.states.data.value || [];
      return Vue.h("tbody", {}, [
        data.reduce((acc, row) => {
          return acc.concat(wrappedRowRender(row, acc.length));
        }, [])
      ]);
    }
  });
  function hColgroup(props) {
    const isAuto = props.tableLayout === "auto";
    let columns = props.columns || [];
    if (isAuto) {
      if (columns.every((column) => column.width === void 0)) {
        columns = [];
      }
    }
    const getPropsData = (column) => {
      const propsData = {
        key: `${props.tableLayout}_${column.id}`,
        style: {},
        name: void 0
      };
      if (isAuto) {
        propsData.style = {
          width: `${column.width}px`
        };
      } else {
        propsData.name = column.id;
      }
      return propsData;
    };
    return Vue.h("colgroup", {}, columns.map((column) => Vue.h("col", getPropsData(column))));
  }
  hColgroup.props = ["columns", "tableLayout"];
  function useMapState() {
    const table = Vue.inject(TABLE_INJECTION_KEY);
    const store = table == null ? void 0 : table.store;
    const leftFixedLeafCount = Vue.computed(() => {
      return store.states.fixedLeafColumnsLength.value;
    });
    const rightFixedLeafCount = Vue.computed(() => {
      return store.states.rightFixedColumns.value.length;
    });
    const columnsCount = Vue.computed(() => {
      return store.states.columns.value.length;
    });
    const leftFixedCount = Vue.computed(() => {
      return store.states.fixedColumns.value.length;
    });
    const rightFixedCount = Vue.computed(() => {
      return store.states.rightFixedColumns.value.length;
    });
    return {
      leftFixedLeafCount,
      rightFixedLeafCount,
      columnsCount,
      leftFixedCount,
      rightFixedCount,
      columns: store.states.columns
    };
  }
  function useStyle$1(props) {
    const { columns } = useMapState();
    const ns2 = useNamespace("table");
    const getCellClasses = (columns2, cellIndex) => {
      const column = columns2[cellIndex];
      const classes = [
        ns2.e("cell"),
        column.id,
        column.align,
        column.labelClassName,
        ...getFixedColumnsClass(ns2.b(), cellIndex, column.fixed, props.store)
      ];
      if (column.className) {
        classes.push(column.className);
      }
      if (!column.children) {
        classes.push(ns2.is("leaf"));
      }
      return classes;
    };
    const getCellStyles = (column, cellIndex) => {
      const fixedStyle = getFixedColumnOffset(cellIndex, column.fixed, props.store);
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return fixedStyle;
    };
    return {
      getCellClasses,
      getCellStyles,
      columns
    };
  }
  var TableFooter = Vue.defineComponent({
    name: "ElTableFooter",
    props: {
      fixed: {
        type: String,
        default: ""
      },
      store: {
        required: true,
        type: Object
      },
      summaryMethod: Function,
      sumText: String,
      border: Boolean,
      defaultSort: {
        type: Object,
        default: () => {
          return {
            prop: "",
            order: ""
          };
        }
      }
    },
    setup(props) {
      const { getCellClasses, getCellStyles, columns } = useStyle$1(props);
      const ns2 = useNamespace("table");
      return {
        ns: ns2,
        getCellClasses,
        getCellStyles,
        columns
      };
    },
    render() {
      const {
        columns,
        getCellStyles,
        getCellClasses,
        summaryMethod,
        sumText,
        ns: ns2
      } = this;
      const data = this.store.states.data.value;
      let sums = [];
      if (summaryMethod) {
        sums = summaryMethod({
          columns,
          data
        });
      } else {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = sumText;
            return;
          }
          const values = data.map((item) => Number(item[column.property]));
          const precisions = [];
          let notNumber = true;
          values.forEach((value) => {
            if (!Number.isNaN(+value)) {
              notNumber = false;
              const decimal = `${value}`.split(".")[1];
              precisions.push(decimal ? decimal.length : 0);
            }
          });
          const precision = Math.max.apply(null, precisions);
          if (!notNumber) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!Number.isNaN(+value)) {
                return Number.parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = "";
          }
        });
      }
      return Vue.h("table", {
        class: ns2.e("footer"),
        cellspacing: "0",
        cellpadding: "0",
        border: "0"
      }, [
        hColgroup({
          columns
        }),
        Vue.h("tbody", [
          Vue.h("tr", {}, [
            ...columns.map((column, cellIndex) => Vue.h("td", {
              key: cellIndex,
              colspan: column.colSpan,
              rowspan: column.rowSpan,
              class: getCellClasses(columns, cellIndex),
              style: getCellStyles(column, cellIndex)
            }, [
              Vue.h("div", {
                class: ["cell", column.labelClassName]
              }, [sums[cellIndex]])
            ]))
          ])
        ])
      ]);
    }
  });
  function useUtils(store) {
    const setCurrentRow = (row) => {
      store.commit("setCurrentRow", row);
    };
    const getSelectionRows = () => {
      return store.getSelectionRows();
    };
    const toggleRowSelection = (row, selected) => {
      store.toggleRowSelection(row, selected, false);
      store.updateAllSelected();
    };
    const clearSelection = () => {
      store.clearSelection();
    };
    const clearFilter = (columnKeys) => {
      store.clearFilter(columnKeys);
    };
    const toggleAllSelection = () => {
      store.commit("toggleAllSelection");
    };
    const toggleRowExpansion = (row, expanded) => {
      store.toggleRowExpansionAdapter(row, expanded);
    };
    const clearSort = () => {
      store.clearSort();
    };
    const sort = (prop, order) => {
      store.commit("sort", { prop, order });
    };
    return {
      setCurrentRow,
      getSelectionRows,
      toggleRowSelection,
      clearSelection,
      clearFilter,
      toggleAllSelection,
      toggleRowExpansion,
      clearSort,
      sort
    };
  }
  function useStyle(props, layout, store, table) {
    const isHidden2 = Vue.ref(false);
    const renderExpanded = Vue.ref(null);
    const resizeProxyVisible = Vue.ref(false);
    const setDragVisible = (visible) => {
      resizeProxyVisible.value = visible;
    };
    const resizeState = Vue.ref({
      width: null,
      height: null,
      headerHeight: null
    });
    const isGroup = Vue.ref(false);
    const scrollbarViewStyle = {
      display: "inline-block",
      verticalAlign: "middle"
    };
    const tableWidth = Vue.ref();
    const tableScrollHeight = Vue.ref(0);
    const bodyScrollHeight = Vue.ref(0);
    const headerScrollHeight = Vue.ref(0);
    const footerScrollHeight = Vue.ref(0);
    Vue.watchEffect(() => {
      layout.setHeight(props.height);
    });
    Vue.watchEffect(() => {
      layout.setMaxHeight(props.maxHeight);
    });
    Vue.watch(() => [props.currentRowKey, store.states.rowKey], ([currentRowKey, rowKey]) => {
      if (!Vue.unref(rowKey) || !Vue.unref(currentRowKey))
        return;
      store.setCurrentRowKey(`${currentRowKey}`);
    }, {
      immediate: true
    });
    Vue.watch(() => props.data, (data) => {
      table.store.commit("setData", data);
    }, {
      immediate: true,
      deep: true
    });
    Vue.watchEffect(() => {
      if (props.expandRowKeys) {
        store.setExpandRowKeysAdapter(props.expandRowKeys);
      }
    });
    const handleMouseLeave = () => {
      table.store.commit("setHoverRow", null);
      if (table.hoverState)
        table.hoverState = null;
    };
    const handleHeaderFooterMousewheel = (event, data) => {
      const { pixelX, pixelY } = data;
      if (Math.abs(pixelX) >= Math.abs(pixelY)) {
        table.refs.bodyWrapper.scrollLeft += data.pixelX / 5;
      }
    };
    const shouldUpdateHeight = Vue.computed(() => {
      return props.height || props.maxHeight || store.states.fixedColumns.value.length > 0 || store.states.rightFixedColumns.value.length > 0;
    });
    const tableBodyStyles = Vue.computed(() => {
      return {
        width: layout.bodyWidth.value ? `${layout.bodyWidth.value}px` : ""
      };
    });
    const doLayout = () => {
      if (shouldUpdateHeight.value) {
        layout.updateElsHeight();
      }
      layout.updateColumnsWidth();
      requestAnimationFrame(syncPosition);
    };
    Vue.onMounted(async () => {
      await Vue.nextTick();
      store.updateColumns();
      bindEvents();
      requestAnimationFrame(doLayout);
      const el = table.vnode.el;
      const tableHeader = table.refs.headerWrapper;
      if (props.flexible && el && el.parentElement) {
        el.parentElement.style.minWidth = "0";
      }
      resizeState.value = {
        width: tableWidth.value = el.offsetWidth,
        height: el.offsetHeight,
        headerHeight: props.showHeader && tableHeader ? tableHeader.offsetHeight : null
      };
      store.states.columns.value.forEach((column) => {
        if (column.filteredValue && column.filteredValue.length) {
          table.store.commit("filterChange", {
            column,
            values: column.filteredValue,
            silent: true
          });
        }
      });
      table.$ready = true;
    });
    const setScrollClassByEl = (el, className) => {
      if (!el)
        return;
      const classList = Array.from(el.classList).filter((item) => !item.startsWith("is-scrolling-"));
      classList.push(layout.scrollX.value ? className : "is-scrolling-none");
      el.className = classList.join(" ");
    };
    const setScrollClass = (className) => {
      const { tableWrapper } = table.refs;
      setScrollClassByEl(tableWrapper, className);
    };
    const hasScrollClass = (className) => {
      const { tableWrapper } = table.refs;
      return !!(tableWrapper && tableWrapper.classList.contains(className));
    };
    const syncPosition = function() {
      if (!table.refs.scrollBarRef)
        return;
      if (!layout.scrollX.value) {
        const scrollingNoneClass = "is-scrolling-none";
        if (!hasScrollClass(scrollingNoneClass)) {
          setScrollClass(scrollingNoneClass);
        }
        return;
      }
      const scrollContainer = table.refs.scrollBarRef.wrapRef;
      if (!scrollContainer)
        return;
      const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer;
      const { headerWrapper, footerWrapper } = table.refs;
      if (headerWrapper)
        headerWrapper.scrollLeft = scrollLeft;
      if (footerWrapper)
        footerWrapper.scrollLeft = scrollLeft;
      const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
      if (scrollLeft >= maxScrollLeftPosition) {
        setScrollClass("is-scrolling-right");
      } else if (scrollLeft === 0) {
        setScrollClass("is-scrolling-left");
      } else {
        setScrollClass("is-scrolling-middle");
      }
    };
    const bindEvents = () => {
      if (!table.refs.scrollBarRef)
        return;
      if (table.refs.scrollBarRef.wrapRef) {
        useEventListener(table.refs.scrollBarRef.wrapRef, "scroll", syncPosition, {
          passive: true
        });
      }
      if (props.fit) {
        useResizeObserver(table.vnode.el, resizeListener);
      } else {
        useEventListener(window, "resize", resizeListener);
      }
      useResizeObserver(table.refs.bodyWrapper, () => {
        var _a2, _b;
        resizeListener();
        (_b = (_a2 = table.refs) == null ? void 0 : _a2.scrollBarRef) == null ? void 0 : _b.update();
      });
    };
    const resizeListener = () => {
      var _a2, _b, _c;
      const el = table.vnode.el;
      if (!table.$ready || !el)
        return;
      let shouldUpdateLayout = false;
      const {
        width: oldWidth,
        height: oldHeight,
        headerHeight: oldHeaderHeight
      } = resizeState.value;
      const width = tableWidth.value = el.offsetWidth;
      if (oldWidth !== width) {
        shouldUpdateLayout = true;
      }
      const height = el.offsetHeight;
      if ((props.height || shouldUpdateHeight.value) && oldHeight !== height) {
        shouldUpdateLayout = true;
      }
      const tableHeader = props.tableLayout === "fixed" ? table.refs.headerWrapper : (_a2 = table.refs.tableHeaderRef) == null ? void 0 : _a2.$el;
      if (props.showHeader && (tableHeader == null ? void 0 : tableHeader.offsetHeight) !== oldHeaderHeight) {
        shouldUpdateLayout = true;
      }
      tableScrollHeight.value = ((_b = table.refs.tableWrapper) == null ? void 0 : _b.scrollHeight) || 0;
      headerScrollHeight.value = (tableHeader == null ? void 0 : tableHeader.scrollHeight) || 0;
      footerScrollHeight.value = ((_c = table.refs.footerWrapper) == null ? void 0 : _c.offsetHeight) || 0;
      bodyScrollHeight.value = tableScrollHeight.value - headerScrollHeight.value - footerScrollHeight.value;
      if (shouldUpdateLayout) {
        resizeState.value = {
          width,
          height,
          headerHeight: props.showHeader && (tableHeader == null ? void 0 : tableHeader.offsetHeight) || 0
        };
        doLayout();
      }
    };
    const tableSize = useSize();
    const bodyWidth = Vue.computed(() => {
      const { bodyWidth: bodyWidth_, scrollY, gutterWidth } = layout;
      return bodyWidth_.value ? `${bodyWidth_.value - (scrollY.value ? gutterWidth : 0)}px` : "";
    });
    const tableLayout = Vue.computed(() => {
      if (props.maxHeight)
        return "fixed";
      return props.tableLayout;
    });
    const emptyBlockStyle = Vue.computed(() => {
      if (props.data && props.data.length)
        return null;
      let height = "100%";
      if (props.height && bodyScrollHeight.value) {
        height = `${bodyScrollHeight.value}px`;
      }
      const width = tableWidth.value;
      return {
        width: width ? `${width}px` : "",
        height
      };
    });
    const tableInnerStyle = Vue.computed(() => {
      if (props.height) {
        return {
          height: !Number.isNaN(Number(props.height)) ? `${props.height}px` : props.height
        };
      }
      if (props.maxHeight) {
        return {
          maxHeight: !Number.isNaN(Number(props.maxHeight)) ? `${props.maxHeight}px` : props.maxHeight
        };
      }
      return {};
    });
    const scrollbarStyle = Vue.computed(() => {
      if (props.height) {
        return {
          height: "100%"
        };
      }
      if (props.maxHeight) {
        if (!Number.isNaN(Number(props.maxHeight))) {
          const maxHeight = props.maxHeight;
          const reachMaxHeight = tableScrollHeight.value >= Number(maxHeight);
          if (reachMaxHeight) {
            return {
              maxHeight: `${tableScrollHeight.value - headerScrollHeight.value - footerScrollHeight.value}px`
            };
          }
        } else {
          return {
            maxHeight: `calc(${props.maxHeight} - ${headerScrollHeight.value + footerScrollHeight.value}px)`
          };
        }
      }
      return {};
    });
    const handleFixedMousewheel = (event, data) => {
      const bodyWrapper = table.refs.bodyWrapper;
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapper.scrollTop;
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }
        if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
          event.preventDefault();
        }
        bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
      } else {
        bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
      }
    };
    return {
      isHidden: isHidden2,
      renderExpanded,
      setDragVisible,
      isGroup,
      handleMouseLeave,
      handleHeaderFooterMousewheel,
      tableSize,
      emptyBlockStyle,
      handleFixedMousewheel,
      resizeProxyVisible,
      bodyWidth,
      resizeState,
      doLayout,
      tableBodyStyles,
      tableLayout,
      scrollbarViewStyle,
      tableInnerStyle,
      scrollbarStyle
    };
  }
  var defaultProps$1 = {
    data: {
      type: Array,
      default: () => []
    },
    size: String,
    width: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    fit: {
      type: Boolean,
      default: true
    },
    stripe: Boolean,
    border: Boolean,
    rowKey: [String, Function],
    showHeader: {
      type: Boolean,
      default: true
    },
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    emptyText: String,
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    tooltipEffect: String,
    tooltipOptions: Object,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          hasChildren: "hasChildren",
          children: "children"
        };
      }
    },
    lazy: Boolean,
    load: Function,
    style: {
      type: Object,
      default: () => ({})
    },
    className: {
      type: String,
      default: ""
    },
    tableLayout: {
      type: String,
      default: "fixed"
    },
    scrollbarAlwaysOn: {
      type: Boolean,
      default: false
    },
    flexible: Boolean
  };
  const useScrollbar = () => {
    const scrollBarRef = Vue.ref();
    const scrollTo = (options, yCoord) => {
      const scrollbar = scrollBarRef.value;
      if (scrollbar) {
        scrollbar.scrollTo(options, yCoord);
      }
    };
    const setScrollPosition = (position, offset) => {
      const scrollbar = scrollBarRef.value;
      if (scrollbar && isNumber(offset) && ["Top", "Left"].includes(position)) {
        scrollbar[`setScroll${position}`](offset);
      }
    };
    const setScrollTop = (top) => setScrollPosition("Top", top);
    const setScrollLeft = (left) => setScrollPosition("Left", left);
    return {
      scrollBarRef,
      scrollTo,
      setScrollTop,
      setScrollLeft
    };
  };
  let tableIdSeed = 1;
  const _sfc_main$4 = Vue.defineComponent({
    name: "ElTable",
    directives: {
      Mousewheel
    },
    components: {
      TableHeader,
      TableBody,
      TableFooter,
      ElScrollbar,
      hColgroup
    },
    props: defaultProps$1,
    emits: [
      "select",
      "select-all",
      "selection-change",
      "cell-mouse-enter",
      "cell-mouse-leave",
      "cell-contextmenu",
      "cell-click",
      "cell-dblclick",
      "row-click",
      "row-contextmenu",
      "row-dblclick",
      "header-click",
      "header-contextmenu",
      "sort-change",
      "filter-change",
      "current-change",
      "header-dragend",
      "expand-change"
    ],
    setup(props) {
      const { t } = useLocale();
      const ns2 = useNamespace("table");
      const table = Vue.getCurrentInstance();
      Vue.provide(TABLE_INJECTION_KEY, table);
      const store = createStore(table, props);
      table.store = store;
      const layout = new TableLayout({
        store: table.store,
        table,
        fit: props.fit,
        showHeader: props.showHeader
      });
      table.layout = layout;
      const isEmpty = Vue.computed(() => (store.states.data.value || []).length === 0);
      const {
        setCurrentRow,
        getSelectionRows,
        toggleRowSelection,
        clearSelection,
        clearFilter,
        toggleAllSelection,
        toggleRowExpansion,
        clearSort,
        sort
      } = useUtils(store);
      const {
        isHidden: isHidden2,
        renderExpanded,
        setDragVisible,
        isGroup,
        handleMouseLeave,
        handleHeaderFooterMousewheel,
        tableSize,
        emptyBlockStyle,
        handleFixedMousewheel,
        resizeProxyVisible,
        bodyWidth,
        resizeState,
        doLayout,
        tableBodyStyles,
        tableLayout,
        scrollbarViewStyle,
        tableInnerStyle,
        scrollbarStyle
      } = useStyle(props, layout, store, table);
      const { scrollBarRef, scrollTo, setScrollLeft, setScrollTop } = useScrollbar();
      const debouncedUpdateLayout = debounce(doLayout, 50);
      const tableId = `${ns2.namespace.value}-table_${tableIdSeed++}`;
      table.tableId = tableId;
      table.state = {
        isGroup,
        resizeState,
        doLayout,
        debouncedUpdateLayout
      };
      const computedSumText = Vue.computed(() => props.sumText || t("el.table.sumText"));
      const computedEmptyText = Vue.computed(() => {
        return props.emptyText || t("el.table.emptyText");
      });
      return {
        ns: ns2,
        layout,
        store,
        handleHeaderFooterMousewheel,
        handleMouseLeave,
        tableId,
        tableSize,
        isHidden: isHidden2,
        isEmpty,
        renderExpanded,
        resizeProxyVisible,
        resizeState,
        isGroup,
        bodyWidth,
        tableBodyStyles,
        emptyBlockStyle,
        debouncedUpdateLayout,
        handleFixedMousewheel,
        setCurrentRow,
        getSelectionRows,
        toggleRowSelection,
        clearSelection,
        clearFilter,
        toggleAllSelection,
        toggleRowExpansion,
        clearSort,
        doLayout,
        sort,
        t,
        setDragVisible,
        context: table,
        computedSumText,
        computedEmptyText,
        tableLayout,
        scrollbarViewStyle,
        tableInnerStyle,
        scrollbarStyle,
        scrollBarRef,
        scrollTo,
        setScrollLeft,
        setScrollTop
      };
    }
  });
  const _hoisted_1$3 = ["data-prefix"];
  const _hoisted_2$2 = {
    ref: "hiddenColumns",
    class: "hidden-columns"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_hColgroup = Vue.resolveComponent("hColgroup");
    const _component_table_header = Vue.resolveComponent("table-header");
    const _component_table_body = Vue.resolveComponent("table-body");
    const _component_el_scrollbar = Vue.resolveComponent("el-scrollbar");
    const _component_table_footer = Vue.resolveComponent("table-footer");
    const _directive_mousewheel = Vue.resolveDirective("mousewheel");
    return Vue.openBlock(), Vue.createElementBlock("div", {
      ref: "tableWrapper",
      class: Vue.normalizeClass([
        {
          [_ctx.ns.m("fit")]: _ctx.fit,
          [_ctx.ns.m("striped")]: _ctx.stripe,
          [_ctx.ns.m("border")]: _ctx.border || _ctx.isGroup,
          [_ctx.ns.m("hidden")]: _ctx.isHidden,
          [_ctx.ns.m("group")]: _ctx.isGroup,
          [_ctx.ns.m("fluid-height")]: _ctx.maxHeight,
          [_ctx.ns.m("scrollable-x")]: _ctx.layout.scrollX.value,
          [_ctx.ns.m("scrollable-y")]: _ctx.layout.scrollY.value,
          [_ctx.ns.m("enable-row-hover")]: !_ctx.store.states.isComplex.value,
          [_ctx.ns.m("enable-row-transition")]: (_ctx.store.states.data.value || []).length !== 0 && (_ctx.store.states.data.value || []).length < 100,
          "has-footer": _ctx.showSummary
        },
        _ctx.ns.m(_ctx.tableSize),
        _ctx.className,
        _ctx.ns.b(),
        _ctx.ns.m(`layout-${_ctx.tableLayout}`)
      ]),
      style: Vue.normalizeStyle(_ctx.style),
      "data-prefix": _ctx.ns.namespace.value,
      onMouseleave: _cache[0] || (_cache[0] = ($event) => _ctx.handleMouseLeave())
    }, [
      Vue.createElementVNode("div", {
        class: Vue.normalizeClass(_ctx.ns.e("inner-wrapper")),
        style: Vue.normalizeStyle(_ctx.tableInnerStyle)
      }, [
        Vue.createElementVNode("div", _hoisted_2$2, [
          Vue.renderSlot(_ctx.$slots, "default")
        ], 512),
        _ctx.showHeader && _ctx.tableLayout === "fixed" ? Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("div", {
          key: 0,
          ref: "headerWrapper",
          class: Vue.normalizeClass(_ctx.ns.e("header-wrapper"))
        }, [
          Vue.createElementVNode("table", {
            ref: "tableHeader",
            class: Vue.normalizeClass(_ctx.ns.e("header")),
            style: Vue.normalizeStyle(_ctx.tableBodyStyles),
            border: "0",
            cellpadding: "0",
            cellspacing: "0"
          }, [
            Vue.createVNode(_component_hColgroup, {
              columns: _ctx.store.states.columns.value,
              "table-layout": _ctx.tableLayout
            }, null, 8, ["columns", "table-layout"]),
            Vue.createVNode(_component_table_header, {
              ref: "tableHeaderRef",
              border: _ctx.border,
              "default-sort": _ctx.defaultSort,
              store: _ctx.store,
              onSetDragVisible: _ctx.setDragVisible
            }, null, 8, ["border", "default-sort", "store", "onSetDragVisible"])
          ], 6)
        ], 2)), [
          [_directive_mousewheel, _ctx.handleHeaderFooterMousewheel]
        ]) : Vue.createCommentVNode("v-if", true),
        Vue.createElementVNode("div", {
          ref: "bodyWrapper",
          class: Vue.normalizeClass(_ctx.ns.e("body-wrapper"))
        }, [
          Vue.createVNode(_component_el_scrollbar, {
            ref: "scrollBarRef",
            "view-style": _ctx.scrollbarViewStyle,
            "wrap-style": _ctx.scrollbarStyle,
            always: _ctx.scrollbarAlwaysOn
          }, {
            default: Vue.withCtx(() => [
              Vue.createElementVNode("table", {
                ref: "tableBody",
                class: Vue.normalizeClass(_ctx.ns.e("body")),
                cellspacing: "0",
                cellpadding: "0",
                border: "0",
                style: Vue.normalizeStyle({
                  width: _ctx.bodyWidth,
                  tableLayout: _ctx.tableLayout
                })
              }, [
                Vue.createVNode(_component_hColgroup, {
                  columns: _ctx.store.states.columns.value,
                  "table-layout": _ctx.tableLayout
                }, null, 8, ["columns", "table-layout"]),
                _ctx.showHeader && _ctx.tableLayout === "auto" ? (Vue.openBlock(), Vue.createBlock(_component_table_header, {
                  key: 0,
                  ref: "tableHeaderRef",
                  border: _ctx.border,
                  "default-sort": _ctx.defaultSort,
                  store: _ctx.store,
                  onSetDragVisible: _ctx.setDragVisible
                }, null, 8, ["border", "default-sort", "store", "onSetDragVisible"])) : Vue.createCommentVNode("v-if", true),
                Vue.createVNode(_component_table_body, {
                  context: _ctx.context,
                  highlight: _ctx.highlightCurrentRow,
                  "row-class-name": _ctx.rowClassName,
                  "tooltip-effect": _ctx.tooltipEffect,
                  "tooltip-options": _ctx.tooltipOptions,
                  "row-style": _ctx.rowStyle,
                  store: _ctx.store,
                  stripe: _ctx.stripe
                }, null, 8, ["context", "highlight", "row-class-name", "tooltip-effect", "tooltip-options", "row-style", "store", "stripe"])
              ], 6),
              _ctx.isEmpty ? (Vue.openBlock(), Vue.createElementBlock("div", {
                key: 0,
                ref: "emptyBlock",
                style: Vue.normalizeStyle(_ctx.emptyBlockStyle),
                class: Vue.normalizeClass(_ctx.ns.e("empty-block"))
              }, [
                Vue.createElementVNode("span", {
                  class: Vue.normalizeClass(_ctx.ns.e("empty-text"))
                }, [
                  Vue.renderSlot(_ctx.$slots, "empty", {}, () => [
                    Vue.createTextVNode(Vue.toDisplayString(_ctx.computedEmptyText), 1)
                  ])
                ], 2)
              ], 6)) : Vue.createCommentVNode("v-if", true),
              _ctx.$slots.append ? (Vue.openBlock(), Vue.createElementBlock("div", {
                key: 1,
                ref: "appendWrapper",
                class: Vue.normalizeClass(_ctx.ns.e("append-wrapper"))
              }, [
                Vue.renderSlot(_ctx.$slots, "append")
              ], 2)) : Vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["view-style", "wrap-style", "always"])
        ], 2),
        _ctx.showSummary ? Vue.withDirectives((Vue.openBlock(), Vue.createElementBlock("div", {
          key: 1,
          ref: "footerWrapper",
          class: Vue.normalizeClass(_ctx.ns.e("footer-wrapper"))
        }, [
          Vue.createVNode(_component_table_footer, {
            border: _ctx.border,
            "default-sort": _ctx.defaultSort,
            store: _ctx.store,
            style: Vue.normalizeStyle(_ctx.tableBodyStyles),
            "sum-text": _ctx.computedSumText,
            "summary-method": _ctx.summaryMethod
          }, null, 8, ["border", "default-sort", "store", "style", "sum-text", "summary-method"])
        ], 2)), [
          [Vue.vShow, !_ctx.isEmpty],
          [_directive_mousewheel, _ctx.handleHeaderFooterMousewheel]
        ]) : Vue.createCommentVNode("v-if", true),
        _ctx.border || _ctx.isGroup ? (Vue.openBlock(), Vue.createElementBlock("div", {
          key: 2,
          class: Vue.normalizeClass(_ctx.ns.e("border-left-patch"))
        }, null, 2)) : Vue.createCommentVNode("v-if", true)
      ], 6),
      Vue.withDirectives(Vue.createElementVNode("div", {
        ref: "resizeProxy",
        class: Vue.normalizeClass(_ctx.ns.e("column-resize-proxy"))
      }, null, 2), [
        [Vue.vShow, _ctx.resizeProxyVisible]
      ])
    ], 46, _hoisted_1$3);
  }
  var Table = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render], ["__file", "/home/runner/work/element-plus/element-plus/packages/components/table/src/table.vue"]]);
  const defaultClassNames = {
    selection: "table-column--selection",
    expand: "table__expand-column"
  };
  const cellStarts = {
    default: {
      order: ""
    },
    selection: {
      width: 48,
      minWidth: 48,
      realWidth: 48,
      order: ""
    },
    expand: {
      width: 48,
      minWidth: 48,
      realWidth: 48,
      order: ""
    },
    index: {
      width: 48,
      minWidth: 48,
      realWidth: 48,
      order: ""
    }
  };
  const getDefaultClassName = (type) => {
    return defaultClassNames[type] || "";
  };
  const cellForced = {
    selection: {
      renderHeader({ store }) {
        function isDisabled() {
          return store.states.data.value && store.states.data.value.length === 0;
        }
        return Vue.h(ElCheckbox, {
          disabled: isDisabled(),
          size: store.states.tableSize.value,
          indeterminate: store.states.selection.value.length > 0 && !store.states.isAllSelected.value,
          "onUpdate:modelValue": store.toggleAllSelection,
          modelValue: store.states.isAllSelected.value
        });
      },
      renderCell({
        row,
        column,
        store,
        $index
      }) {
        return Vue.h(ElCheckbox, {
          disabled: column.selectable ? !column.selectable.call(null, row, $index) : false,
          size: store.states.tableSize.value,
          onChange: () => {
            store.commit("rowSelectedChanged", row);
          },
          onClick: (event) => event.stopPropagation(),
          modelValue: store.isSelected(row)
        });
      },
      sortable: false,
      resizable: false
    },
    index: {
      renderHeader({ column }) {
        return column.label || "#";
      },
      renderCell({
        column,
        $index
      }) {
        let i = $index + 1;
        const index = column.index;
        if (typeof index === "number") {
          i = $index + index;
        } else if (typeof index === "function") {
          i = index($index);
        }
        return Vue.h("div", {}, [i]);
      },
      sortable: false
    },
    expand: {
      renderHeader({ column }) {
        return column.label || "";
      },
      renderCell({
        row,
        store,
        expanded
      }) {
        const { ns: ns2 } = store;
        const classes = [ns2.e("expand-icon")];
        if (expanded) {
          classes.push(ns2.em("expand-icon", "expanded"));
        }
        const callback = function(e) {
          e.stopPropagation();
          store.toggleRowExpansion(row);
        };
        return Vue.h("div", {
          class: classes,
          onClick: callback
        }, {
          default: () => {
            return [
              Vue.h(ElIcon, null, {
                default: () => {
                  return [Vue.h(arrow_right_default)];
                }
              })
            ];
          }
        });
      },
      sortable: false,
      resizable: false
    }
  };
  function defaultRenderCell({
    row,
    column,
    $index
  }) {
    var _a2;
    const property2 = column.property;
    const value = property2 && getProp(row, property2).value;
    if (column && column.formatter) {
      return column.formatter(row, column, value, $index);
    }
    return ((_a2 = value == null ? void 0 : value.toString) == null ? void 0 : _a2.call(value)) || "";
  }
  function treeCellPrefix({
    row,
    treeNode,
    store
  }, createPlacehoder = false) {
    const { ns: ns2 } = store;
    if (!treeNode) {
      if (createPlacehoder) {
        return [
          Vue.h("span", {
            class: ns2.e("placeholder")
          })
        ];
      }
      return null;
    }
    const ele = [];
    const callback = function(e) {
      e.stopPropagation();
      if (treeNode.loading) {
        return;
      }
      store.loadOrToggle(row);
    };
    if (treeNode.indent) {
      ele.push(Vue.h("span", {
        class: ns2.e("indent"),
        style: { "padding-left": `${treeNode.indent}px` }
      }));
    }
    if (typeof treeNode.expanded === "boolean" && !treeNode.noLazyChildren) {
      const expandClasses = [
        ns2.e("expand-icon"),
        treeNode.expanded ? ns2.em("expand-icon", "expanded") : ""
      ];
      let icon = arrow_right_default;
      if (treeNode.loading) {
        icon = loading_default;
      }
      ele.push(Vue.h("div", {
        class: expandClasses,
        onClick: callback
      }, {
        default: () => {
          return [
            Vue.h(ElIcon, { class: { [ns2.is("loading")]: treeNode.loading } }, {
              default: () => [Vue.h(icon)]
            })
          ];
        }
      }));
    } else {
      ele.push(Vue.h("span", {
        class: ns2.e("placeholder")
      }));
    }
    return ele;
  }
  function getAllAliases(props, aliases) {
    return props.reduce((prev, cur) => {
      prev[cur] = cur;
      return prev;
    }, aliases);
  }
  function useWatcher(owner, props_) {
    const instance = Vue.getCurrentInstance();
    const registerComplexWatchers = () => {
      const props = ["fixed"];
      const aliases = {
        realWidth: "width",
        realMinWidth: "minWidth"
      };
      const allAliases = getAllAliases(props, aliases);
      Object.keys(allAliases).forEach((key) => {
        const columnKey = aliases[key];
        if (hasOwn(props_, columnKey)) {
          Vue.watch(() => props_[columnKey], (newVal) => {
            let value = newVal;
            if (columnKey === "width" && key === "realWidth") {
              value = parseWidth(newVal);
            }
            if (columnKey === "minWidth" && key === "realMinWidth") {
              value = parseMinWidth(newVal);
            }
            instance.columnConfig.value[columnKey] = value;
            instance.columnConfig.value[key] = value;
            const updateColumns = columnKey === "fixed";
            owner.value.store.scheduleLayout(updateColumns);
          });
        }
      });
    };
    const registerNormalWatchers = () => {
      const props = [
        "label",
        "filters",
        "filterMultiple",
        "sortable",
        "index",
        "formatter",
        "className",
        "labelClassName",
        "showOverflowTooltip"
      ];
      const aliases = {
        property: "prop",
        align: "realAlign",
        headerAlign: "realHeaderAlign"
      };
      const allAliases = getAllAliases(props, aliases);
      Object.keys(allAliases).forEach((key) => {
        const columnKey = aliases[key];
        if (hasOwn(props_, columnKey)) {
          Vue.watch(() => props_[columnKey], (newVal) => {
            instance.columnConfig.value[key] = newVal;
          });
        }
      });
    };
    return {
      registerComplexWatchers,
      registerNormalWatchers
    };
  }
  function useRender(props, slots, owner) {
    const instance = Vue.getCurrentInstance();
    const columnId = Vue.ref("");
    const isSubColumn = Vue.ref(false);
    const realAlign = Vue.ref();
    const realHeaderAlign = Vue.ref();
    const ns2 = useNamespace("table");
    Vue.watchEffect(() => {
      realAlign.value = props.align ? `is-${props.align}` : null;
      realAlign.value;
    });
    Vue.watchEffect(() => {
      realHeaderAlign.value = props.headerAlign ? `is-${props.headerAlign}` : realAlign.value;
      realHeaderAlign.value;
    });
    const columnOrTableParent = Vue.computed(() => {
      let parent = instance.vnode.vParent || instance.parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.vnode.vParent || parent.parent;
      }
      return parent;
    });
    const hasTreeColumn = Vue.computed(() => {
      const { store } = instance.parent;
      if (!store)
        return false;
      const { treeData } = store.states;
      const treeDataValue = treeData.value;
      return treeDataValue && Object.keys(treeDataValue).length > 0;
    });
    const realWidth = Vue.ref(parseWidth(props.width));
    const realMinWidth = Vue.ref(parseMinWidth(props.minWidth));
    const setColumnWidth = (column) => {
      if (realWidth.value)
        column.width = realWidth.value;
      if (realMinWidth.value) {
        column.minWidth = realMinWidth.value;
      }
      if (!realWidth.value && realMinWidth.value) {
        column.width = void 0;
      }
      if (!column.minWidth) {
        column.minWidth = 80;
      }
      column.realWidth = Number(column.width === void 0 ? column.minWidth : column.width);
      return column;
    };
    const setColumnForcedProps = (column) => {
      const type = column.type;
      const source = cellForced[type] || {};
      Object.keys(source).forEach((prop) => {
        const value = source[prop];
        if (prop !== "className" && value !== void 0) {
          column[prop] = value;
        }
      });
      const className = getDefaultClassName(type);
      if (className) {
        const forceClass = `${Vue.unref(ns2.namespace)}-${className}`;
        column.className = column.className ? `${column.className} ${forceClass}` : forceClass;
      }
      return column;
    };
    const checkSubColumn = (children) => {
      if (Array.isArray(children)) {
        children.forEach((child) => check(child));
      } else {
        check(children);
      }
      function check(item) {
        var _a2;
        if (((_a2 = item == null ? void 0 : item.type) == null ? void 0 : _a2.name) === "ElTableColumn") {
          item.vParent = instance;
        }
      }
    };
    const setColumnRenders = (column) => {
      if (props.renderHeader) {
        debugWarn("TableColumn", "Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.");
      } else if (column.type !== "selection") {
        column.renderHeader = (scope) => {
          instance.columnConfig.value["label"];
          const renderHeader = slots.header;
          return renderHeader ? renderHeader(scope) : column.label;
        };
      }
      let originRenderCell = column.renderCell;
      if (column.type === "expand") {
        column.renderCell = (data) => Vue.h("div", {
          class: "cell"
        }, [originRenderCell(data)]);
        owner.value.renderExpanded = (data) => {
          return slots.default ? slots.default(data) : slots.default;
        };
      } else {
        originRenderCell = originRenderCell || defaultRenderCell;
        column.renderCell = (data) => {
          let children = null;
          if (slots.default) {
            const vnodes = slots.default(data);
            children = vnodes.some((v2) => v2.type !== Vue.Comment) ? vnodes : originRenderCell(data);
          } else {
            children = originRenderCell(data);
          }
          const shouldCreatePlaceholder = hasTreeColumn.value && data.cellIndex === 0 && data.column.type !== "selection";
          const prefix = treeCellPrefix(data, shouldCreatePlaceholder);
          const props2 = {
            class: "cell",
            style: {}
          };
          if (column.showOverflowTooltip) {
            props2.class = `${props2.class} ${Vue.unref(ns2.namespace)}-tooltip`;
            props2.style = {
              width: `${(data.column.realWidth || Number(data.column.width)) - 1}px`
            };
          }
          checkSubColumn(children);
          return Vue.h("div", props2, [prefix, children]);
        };
      }
      return column;
    };
    const getPropsData = (...propsKey) => {
      return propsKey.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach((key) => {
            prev[key] = props[key];
          });
        }
        return prev;
      }, {});
    };
    const getColumnElIndex = (children, child) => {
      return Array.prototype.indexOf.call(children, child);
    };
    return {
      columnId,
      realAlign,
      isSubColumn,
      realHeaderAlign,
      columnOrTableParent,
      setColumnWidth,
      setColumnForcedProps,
      setColumnRenders,
      getPropsData,
      getColumnElIndex
    };
  }
  var defaultProps = {
    type: {
      type: String,
      default: "default"
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {
      type: [String, Number],
      default: ""
    },
    minWidth: {
      type: [String, Number],
      default: ""
    },
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    showOverflowTooltip: [Boolean, Object],
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default: () => {
        return ["ascending", "descending", null];
      },
      validator: (val) => {
        return val.every((order) => ["ascending", "descending", null].includes(order));
      }
    }
  };
  let columnIdSeed = 1;
  var ElTableColumn$1 = Vue.defineComponent({
    name: "ElTableColumn",
    components: {
      ElCheckbox
    },
    props: defaultProps,
    setup(props, { slots }) {
      const instance = Vue.getCurrentInstance();
      const columnConfig = Vue.ref({});
      const owner = Vue.computed(() => {
        let parent2 = instance.parent;
        while (parent2 && !parent2.tableId) {
          parent2 = parent2.parent;
        }
        return parent2;
      });
      const { registerNormalWatchers, registerComplexWatchers } = useWatcher(owner, props);
      const {
        columnId,
        isSubColumn,
        realHeaderAlign,
        columnOrTableParent,
        setColumnWidth,
        setColumnForcedProps,
        setColumnRenders,
        getPropsData,
        getColumnElIndex,
        realAlign
      } = useRender(props, slots, owner);
      const parent = columnOrTableParent.value;
      columnId.value = `${parent.tableId || parent.columnId}_column_${columnIdSeed++}`;
      Vue.onBeforeMount(() => {
        isSubColumn.value = owner.value !== parent;
        const type = props.type || "default";
        const sortable = props.sortable === "" ? true : props.sortable;
        const defaults = __spreadProps(__spreadValues({}, cellStarts[type]), {
          id: columnId.value,
          type,
          property: props.prop || props.property,
          align: realAlign,
          headerAlign: realHeaderAlign,
          showOverflowTooltip: props.showOverflowTooltip,
          filterable: props.filters || props.filterMethod,
          filteredValue: [],
          filterPlacement: "",
          isColumnGroup: false,
          isSubColumn: false,
          filterOpened: false,
          sortable,
          index: props.index,
          rawColumnKey: instance.vnode.key
        });
        const basicProps = [
          "columnKey",
          "label",
          "className",
          "labelClassName",
          "type",
          "renderHeader",
          "formatter",
          "fixed",
          "resizable"
        ];
        const sortProps = ["sortMethod", "sortBy", "sortOrders"];
        const selectProps = ["selectable", "reserveSelection"];
        const filterProps = [
          "filterMethod",
          "filters",
          "filterMultiple",
          "filterOpened",
          "filteredValue",
          "filterPlacement"
        ];
        let column = getPropsData(basicProps, sortProps, selectProps, filterProps);
        column = mergeOptions(defaults, column);
        const chains = compose(setColumnRenders, setColumnWidth, setColumnForcedProps);
        column = chains(column);
        columnConfig.value = column;
        registerNormalWatchers();
        registerComplexWatchers();
      });
      Vue.onMounted(() => {
        var _a2;
        const parent2 = columnOrTableParent.value;
        const children = isSubColumn.value ? parent2.vnode.el.children : (_a2 = parent2.refs.hiddenColumns) == null ? void 0 : _a2.children;
        const getColumnIndex = () => getColumnElIndex(children || [], instance.vnode.el);
        columnConfig.value.getColumnIndex = getColumnIndex;
        const columnIndex = getColumnIndex();
        columnIndex > -1 && owner.value.store.commit("insertColumn", columnConfig.value, isSubColumn.value ? parent2.columnConfig.value : null);
      });
      Vue.onBeforeUnmount(() => {
        owner.value.store.commit("removeColumn", columnConfig.value, isSubColumn.value ? parent.columnConfig.value : null);
      });
      instance.columnId = columnId.value;
      instance.columnConfig = columnConfig;
      return;
    },
    render() {
      var _a2, _b, _c;
      try {
        const renderDefault = (_b = (_a2 = this.$slots).default) == null ? void 0 : _b.call(_a2, {
          row: {},
          column: {},
          $index: -1
        });
        const children = [];
        if (Array.isArray(renderDefault)) {
          for (const childNode of renderDefault) {
            if (((_c = childNode.type) == null ? void 0 : _c.name) === "ElTableColumn" || childNode.shapeFlag & 2) {
              children.push(childNode);
            } else if (childNode.type === Vue.Fragment && Array.isArray(childNode.children)) {
              childNode.children.forEach((vnode2) => {
                if ((vnode2 == null ? void 0 : vnode2.patchFlag) !== 1024 && !isString$1(vnode2 == null ? void 0 : vnode2.children)) {
                  children.push(vnode2);
                }
              });
            }
          }
        }
        const vnode = Vue.h("div", children);
        return vnode;
      } catch (e) {
        return Vue.h("div", []);
      }
    }
  });
  const ElTable = withInstall(Table, {
    TableColumn: ElTableColumn$1
  });
  const ElTableColumn = withNoopInstall(ElTableColumn$1);
  const SCOPE$1 = "ElUpload";
  class UploadAjaxError extends Error {
    constructor(message, status, method, url) {
      super(message);
      this.name = "UploadAjaxError";
      this.status = status;
      this.method = method;
      this.url = url;
    }
  }
  function getError(action, option, xhr) {
    let msg;
    if (xhr.response) {
      msg = `${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
      msg = `${xhr.responseText}`;
    } else {
      msg = `fail to ${option.method} ${action} ${xhr.status}`;
    }
    return new UploadAjaxError(msg, xhr.status, option.method, action);
  }
  function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
      return text;
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }
  const ajaxUpload = (option) => {
    if (typeof XMLHttpRequest === "undefined")
      throwError(SCOPE$1, "XMLHttpRequest is undefined");
    const xhr = new XMLHttpRequest();
    const action = option.action;
    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        const progressEvt = evt;
        progressEvt.percent = evt.total > 0 ? evt.loaded / evt.total * 100 : 0;
        option.onProgress(progressEvt);
      });
    }
    const formData = new FormData();
    if (option.data) {
      for (const [key, value] of Object.entries(option.data)) {
        if (Array.isArray(value))
          formData.append(key, ...value);
        else
          formData.append(key, value);
      }
    }
    formData.append(option.filename, option.file, option.file.name);
    xhr.addEventListener("error", () => {
      option.onError(getError(action, option, xhr));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        return option.onError(getError(action, option, xhr));
      }
      option.onSuccess(getBody(xhr));
    });
    xhr.open(option.method, action, true);
    if (option.withCredentials && "withCredentials" in xhr) {
      xhr.withCredentials = true;
    }
    const headers = option.headers || {};
    if (headers instanceof Headers) {
      headers.forEach((value, key) => xhr.setRequestHeader(key, value));
    } else {
      for (const [key, value] of Object.entries(headers)) {
        if (isNil(value))
          continue;
        xhr.setRequestHeader(key, String(value));
      }
    }
    xhr.send(formData);
    return xhr;
  };
  const uploadListTypes = ["text", "picture", "picture-card"];
  let fileId = 1;
  const genFileId = () => Date.now() + fileId++;
  const uploadBaseProps = buildProps({
    action: {
      type: String,
      default: "#"
    },
    headers: {
      type: definePropType(Object)
    },
    method: {
      type: String,
      default: "post"
    },
    data: {
      type: Object,
      default: () => mutable({})
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: "file"
    },
    drag: {
      type: Boolean,
      default: false
    },
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "select"
    },
    fileList: {
      type: definePropType(Array),
      default: () => mutable([])
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      values: uploadListTypes,
      default: "text"
    },
    httpRequest: {
      type: definePropType(Function),
      default: ajaxUpload
    },
    disabled: Boolean,
    limit: Number
  });
  const uploadProps = buildProps(__spreadProps(__spreadValues({}, uploadBaseProps), {
    beforeUpload: {
      type: definePropType(Function),
      default: NOOP
    },
    beforeRemove: {
      type: definePropType(Function)
    },
    onRemove: {
      type: definePropType(Function),
      default: NOOP
    },
    onChange: {
      type: definePropType(Function),
      default: NOOP
    },
    onPreview: {
      type: definePropType(Function),
      default: NOOP
    },
    onSuccess: {
      type: definePropType(Function),
      default: NOOP
    },
    onProgress: {
      type: definePropType(Function),
      default: NOOP
    },
    onError: {
      type: definePropType(Function),
      default: NOOP
    },
    onExceed: {
      type: definePropType(Function),
      default: NOOP
    }
  }));
  const uploadListProps = buildProps({
    files: {
      type: definePropType(Array),
      default: () => mutable([])
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: {
      type: definePropType(Function),
      default: NOOP
    },
    listType: {
      type: String,
      values: uploadListTypes,
      default: "text"
    }
  });
  const uploadListEmits = {
    remove: (file) => !!file
  };
  const _hoisted_1$2 = ["onKeydown"];
  const _hoisted_2$1 = ["src"];
  const _hoisted_3 = ["onClick"];
  const _hoisted_4 = ["onClick"];
  const _hoisted_5 = ["onClick"];
  const __default__$3 = Vue.defineComponent({
    name: "ElUploadList"
  });
  const _sfc_main$3 = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$3), {
    props: uploadListProps,
    emits: uploadListEmits,
    setup(__props, { emit }) {
      const { t } = useLocale();
      const nsUpload = useNamespace("upload");
      const nsIcon = useNamespace("icon");
      const nsList = useNamespace("list");
      const disabled = useDisabled();
      const focusing = Vue.ref(false);
      const handleRemove = (file) => {
        emit("remove", file);
      };
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createBlock(Vue.TransitionGroup, {
          tag: "ul",
          class: Vue.normalizeClass([
            Vue.unref(nsUpload).b("list"),
            Vue.unref(nsUpload).bm("list", _ctx.listType),
            Vue.unref(nsUpload).is("disabled", Vue.unref(disabled))
          ]),
          name: Vue.unref(nsList).b()
        }, {
          default: Vue.withCtx(() => [
            (Vue.openBlock(true), Vue.createElementBlock(Vue.Fragment, null, Vue.renderList(_ctx.files, (file) => {
              return Vue.openBlock(), Vue.createElementBlock("li", {
                key: file.uid || file.name,
                class: Vue.normalizeClass([
                  Vue.unref(nsUpload).be("list", "item"),
                  Vue.unref(nsUpload).is(file.status),
                  { focusing: focusing.value }
                ]),
                tabindex: "0",
                onKeydown: Vue.withKeys(($event) => !Vue.unref(disabled) && handleRemove(file), ["delete"]),
                onFocus: _cache[0] || (_cache[0] = ($event) => focusing.value = true),
                onBlur: _cache[1] || (_cache[1] = ($event) => focusing.value = false),
                onClick: _cache[2] || (_cache[2] = ($event) => focusing.value = false)
              }, [
                Vue.renderSlot(_ctx.$slots, "default", { file }, () => [
                  _ctx.listType === "picture" || file.status !== "uploading" && _ctx.listType === "picture-card" ? (Vue.openBlock(), Vue.createElementBlock("img", {
                    key: 0,
                    class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-thumbnail")),
                    src: file.url,
                    alt: ""
                  }, null, 10, _hoisted_2$1)) : Vue.createCommentVNode("v-if", true),
                  file.status === "uploading" || _ctx.listType !== "picture-card" ? (Vue.openBlock(), Vue.createElementBlock("div", {
                    key: 1,
                    class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-info"))
                  }, [
                    Vue.createElementVNode("a", {
                      class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-name")),
                      onClick: Vue.withModifiers(($event) => _ctx.handlePreview(file), ["prevent"])
                    }, [
                      Vue.createVNode(Vue.unref(ElIcon), {
                        class: Vue.normalizeClass(Vue.unref(nsIcon).m("document"))
                      }, {
                        default: Vue.withCtx(() => [
                          Vue.createVNode(Vue.unref(document_default))
                        ]),
                        _: 1
                      }, 8, ["class"]),
                      Vue.createElementVNode("span", {
                        class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-file-name"))
                      }, Vue.toDisplayString(file.name), 3)
                    ], 10, _hoisted_3),
                    file.status === "uploading" ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElProgress), {
                      key: 0,
                      type: _ctx.listType === "picture-card" ? "circle" : "line",
                      "stroke-width": _ctx.listType === "picture-card" ? 6 : 2,
                      percentage: Number(file.percentage),
                      style: Vue.normalizeStyle(_ctx.listType === "picture-card" ? "" : "margin-top: 0.5rem")
                    }, null, 8, ["type", "stroke-width", "percentage", "style"])) : Vue.createCommentVNode("v-if", true)
                  ], 2)) : Vue.createCommentVNode("v-if", true),
                  Vue.createElementVNode("label", {
                    class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-status-label"))
                  }, [
                    _ctx.listType === "text" ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                      key: 0,
                      class: Vue.normalizeClass([Vue.unref(nsIcon).m("upload-success"), Vue.unref(nsIcon).m("circle-check")])
                    }, {
                      default: Vue.withCtx(() => [
                        Vue.createVNode(Vue.unref(circle_check_default))
                      ]),
                      _: 1
                    }, 8, ["class"])) : ["picture-card", "picture"].includes(_ctx.listType) ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                      key: 1,
                      class: Vue.normalizeClass([Vue.unref(nsIcon).m("upload-success"), Vue.unref(nsIcon).m("check")])
                    }, {
                      default: Vue.withCtx(() => [
                        Vue.createVNode(Vue.unref(check_default))
                      ]),
                      _: 1
                    }, 8, ["class"])) : Vue.createCommentVNode("v-if", true)
                  ], 2),
                  !Vue.unref(disabled) ? (Vue.openBlock(), Vue.createBlock(Vue.unref(ElIcon), {
                    key: 2,
                    class: Vue.normalizeClass(Vue.unref(nsIcon).m("close")),
                    onClick: ($event) => handleRemove(file)
                  }, {
                    default: Vue.withCtx(() => [
                      Vue.createVNode(Vue.unref(close_default))
                    ]),
                    _: 2
                  }, 1032, ["class", "onClick"])) : Vue.createCommentVNode("v-if", true),
                  Vue.createCommentVNode(" Due to close btn only appears when li gets focused disappears after li gets blurred, thus keyboard navigation can never reach close btn"),
                  Vue.createCommentVNode(" This is a bug which needs to be fixed "),
                  Vue.createCommentVNode(" TODO: Fix the incorrect navigation interaction "),
                  !Vue.unref(disabled) ? (Vue.openBlock(), Vue.createElementBlock("i", {
                    key: 3,
                    class: Vue.normalizeClass(Vue.unref(nsIcon).m("close-tip"))
                  }, Vue.toDisplayString(Vue.unref(t)("el.upload.deleteTip")), 3)) : Vue.createCommentVNode("v-if", true),
                  _ctx.listType === "picture-card" ? (Vue.openBlock(), Vue.createElementBlock("span", {
                    key: 4,
                    class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-actions"))
                  }, [
                    Vue.createElementVNode("span", {
                      class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-preview")),
                      onClick: ($event) => _ctx.handlePreview(file)
                    }, [
                      Vue.createVNode(Vue.unref(ElIcon), {
                        class: Vue.normalizeClass(Vue.unref(nsIcon).m("zoom-in"))
                      }, {
                        default: Vue.withCtx(() => [
                          Vue.createVNode(Vue.unref(zoom_in_default))
                        ]),
                        _: 1
                      }, 8, ["class"])
                    ], 10, _hoisted_4),
                    !Vue.unref(disabled) ? (Vue.openBlock(), Vue.createElementBlock("span", {
                      key: 0,
                      class: Vue.normalizeClass(Vue.unref(nsUpload).be("list", "item-delete")),
                      onClick: ($event) => handleRemove(file)
                    }, [
                      Vue.createVNode(Vue.unref(ElIcon), {
                        class: Vue.normalizeClass(Vue.unref(nsIcon).m("delete"))
                      }, {
                        default: Vue.withCtx(() => [
                          Vue.createVNode(Vue.unref(delete_default))
                        ]),
                        _: 1
                      }, 8, ["class"])
                    ], 10, _hoisted_5)) : Vue.createCommentVNode("v-if", true)
                  ], 2)) : Vue.createCommentVNode("v-if", true)
                ])
              ], 42, _hoisted_1$2);
            }), 128)),
            Vue.renderSlot(_ctx.$slots, "append")
          ]),
          _: 3
        }, 8, ["class", "name"]);
      };
    }
  }));
  var UploadList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/upload/src/upload-list.vue"]]);
  const uploadDraggerProps = buildProps({
    disabled: {
      type: Boolean,
      default: false
    }
  });
  const uploadDraggerEmits = {
    file: (file) => isArray(file)
  };
  const _hoisted_1$1 = ["onDrop", "onDragover"];
  const COMPONENT_NAME = "ElUploadDrag";
  const __default__$2 = Vue.defineComponent({
    name: COMPONENT_NAME
  });
  const _sfc_main$2 = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$2), {
    props: uploadDraggerProps,
    emits: uploadDraggerEmits,
    setup(__props, { emit }) {
      const uploaderContext = Vue.inject(uploadContextKey);
      if (!uploaderContext) {
        throwError(COMPONENT_NAME, "usage: <el-upload><el-upload-dragger /></el-upload>");
      }
      const ns2 = useNamespace("upload");
      const dragover = Vue.ref(false);
      const disabled = useDisabled();
      const onDrop = (e) => {
        if (disabled.value)
          return;
        dragover.value = false;
        const files = Array.from(e.dataTransfer.files);
        const accept = uploaderContext.accept.value;
        if (!accept) {
          emit("file", files);
          return;
        }
        const filesFiltered = files.filter((file) => {
          const { type, name } = file;
          const extension = name.includes(".") ? `.${name.split(".").pop()}` : "";
          const baseType = type.replace(/\/.*$/, "");
          return accept.split(",").map((type2) => type2.trim()).filter((type2) => type2).some((acceptedType) => {
            if (acceptedType.startsWith(".")) {
              return extension === acceptedType;
            }
            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, "");
            }
            if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }
            return false;
          });
        });
        emit("file", filesFiltered);
      };
      const onDragover = () => {
        if (!disabled.value)
          dragover.value = true;
      };
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: Vue.normalizeClass([Vue.unref(ns2).b("dragger"), Vue.unref(ns2).is("dragover", dragover.value)]),
          onDrop: Vue.withModifiers(onDrop, ["prevent"]),
          onDragover: Vue.withModifiers(onDragover, ["prevent"]),
          onDragleave: _cache[0] || (_cache[0] = Vue.withModifiers(($event) => dragover.value = false, ["prevent"]))
        }, [
          Vue.renderSlot(_ctx.$slots, "default")
        ], 42, _hoisted_1$1);
      };
    }
  }));
  var UploadDragger = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/upload/src/upload-dragger.vue"]]);
  const uploadContentProps = buildProps(__spreadProps(__spreadValues({}, uploadBaseProps), {
    beforeUpload: {
      type: definePropType(Function),
      default: NOOP
    },
    onRemove: {
      type: definePropType(Function),
      default: NOOP
    },
    onStart: {
      type: definePropType(Function),
      default: NOOP
    },
    onSuccess: {
      type: definePropType(Function),
      default: NOOP
    },
    onProgress: {
      type: definePropType(Function),
      default: NOOP
    },
    onError: {
      type: definePropType(Function),
      default: NOOP
    },
    onExceed: {
      type: definePropType(Function),
      default: NOOP
    }
  }));
  const _hoisted_1 = ["onKeydown"];
  const _hoisted_2 = ["name", "multiple", "accept"];
  const __default__$1 = Vue.defineComponent({
    name: "ElUploadContent",
    inheritAttrs: false
  });
  const _sfc_main$1 = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__$1), {
    props: uploadContentProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns2 = useNamespace("upload");
      const disabled = useDisabled();
      const requests = Vue.shallowRef({});
      const inputRef = Vue.shallowRef();
      const uploadFiles = (files) => {
        if (files.length === 0)
          return;
        const { autoUpload, limit, fileList, multiple, onStart, onExceed } = props;
        if (limit && fileList.length + files.length > limit) {
          onExceed(files, fileList);
          return;
        }
        if (!multiple) {
          files = files.slice(0, 1);
        }
        for (const file of files) {
          const rawFile = file;
          rawFile.uid = genFileId();
          onStart(rawFile);
          if (autoUpload)
            upload(rawFile);
        }
      };
      const upload = async (rawFile) => {
        inputRef.value.value = "";
        if (!props.beforeUpload) {
          return doUpload(rawFile);
        }
        let hookResult;
        try {
          hookResult = await props.beforeUpload(rawFile);
        } catch (e) {
          hookResult = false;
        }
        if (hookResult === false) {
          props.onRemove(rawFile);
          return;
        }
        let file = rawFile;
        if (hookResult instanceof Blob) {
          if (hookResult instanceof File) {
            file = hookResult;
          } else {
            file = new File([hookResult], rawFile.name, {
              type: rawFile.type
            });
          }
        }
        doUpload(Object.assign(file, {
          uid: rawFile.uid
        }));
      };
      const doUpload = (rawFile) => {
        const {
          headers,
          data,
          method,
          withCredentials,
          name: filename,
          action,
          onProgress,
          onSuccess,
          onError,
          httpRequest
        } = props;
        const { uid } = rawFile;
        const options = {
          headers: headers || {},
          withCredentials,
          file: rawFile,
          data,
          method,
          filename,
          action,
          onProgress: (evt) => {
            onProgress(evt, rawFile);
          },
          onSuccess: (res) => {
            onSuccess(res, rawFile);
            delete requests.value[uid];
          },
          onError: (err) => {
            onError(err, rawFile);
            delete requests.value[uid];
          }
        };
        const request = httpRequest(options);
        requests.value[uid] = request;
        if (request instanceof Promise) {
          request.then(options.onSuccess, options.onError);
        }
      };
      const handleChange = (e) => {
        const files = e.target.files;
        if (!files)
          return;
        uploadFiles(Array.from(files));
      };
      const handleClick = () => {
        if (!disabled.value) {
          inputRef.value.value = "";
          inputRef.value.click();
        }
      };
      const handleKeydown = () => {
        handleClick();
      };
      const abort = (file) => {
        const _reqs = entriesOf(requests.value).filter(file ? ([uid]) => String(file.uid) === uid : () => true);
        _reqs.forEach(([uid, req]) => {
          if (req instanceof XMLHttpRequest)
            req.abort();
          delete requests.value[uid];
        });
      };
      expose({
        abort,
        upload
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: Vue.normalizeClass([Vue.unref(ns2).b(), Vue.unref(ns2).m(_ctx.listType), Vue.unref(ns2).is("drag", _ctx.drag)]),
          tabindex: "0",
          onClick: handleClick,
          onKeydown: Vue.withKeys(Vue.withModifiers(handleKeydown, ["self"]), ["enter", "space"])
        }, [
          _ctx.drag ? (Vue.openBlock(), Vue.createBlock(UploadDragger, {
            key: 0,
            disabled: Vue.unref(disabled),
            onFile: uploadFiles
          }, {
            default: Vue.withCtx(() => [
              Vue.renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["disabled"])) : Vue.renderSlot(_ctx.$slots, "default", { key: 1 }),
          Vue.createElementVNode("input", {
            ref_key: "inputRef",
            ref: inputRef,
            class: Vue.normalizeClass(Vue.unref(ns2).e("input")),
            name: _ctx.name,
            multiple: _ctx.multiple,
            accept: _ctx.accept,
            type: "file",
            onChange: handleChange,
            onClick: _cache[0] || (_cache[0] = Vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_2)
        ], 42, _hoisted_1);
      };
    }
  }));
  var UploadContent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/upload/src/upload-content.vue"]]);
  const SCOPE = "ElUpload";
  const revokeObjectURL = (file) => {
    var _a2;
    if ((_a2 = file.url) == null ? void 0 : _a2.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
    }
  };
  const useHandlers = (props, uploadRef) => {
    const uploadFiles = useVModel(props, "fileList", void 0, { passive: true });
    const getFile = (rawFile) => uploadFiles.value.find((file) => file.uid === rawFile.uid);
    function abort(file) {
      var _a2;
      (_a2 = uploadRef.value) == null ? void 0 : _a2.abort(file);
    }
    function clearFiles(states = ["ready", "uploading", "success", "fail"]) {
      uploadFiles.value = uploadFiles.value.filter((row) => !states.includes(row.status));
    }
    const handleError2 = (err, rawFile) => {
      const file = getFile(rawFile);
      if (!file)
        return;
      console.error(err);
      file.status = "fail";
      uploadFiles.value.splice(uploadFiles.value.indexOf(file), 1);
      props.onError(err, file, uploadFiles.value);
      props.onChange(file, uploadFiles.value);
    };
    const handleProgress = (evt, rawFile) => {
      const file = getFile(rawFile);
      if (!file)
        return;
      props.onProgress(evt, file, uploadFiles.value);
      file.status = "uploading";
      file.percentage = Math.round(evt.percent);
    };
    const handleSuccess = (response, rawFile) => {
      const file = getFile(rawFile);
      if (!file)
        return;
      file.status = "success";
      file.response = response;
      props.onSuccess(response, file, uploadFiles.value);
      props.onChange(file, uploadFiles.value);
    };
    const handleStart = (file) => {
      if (isNil(file.uid))
        file.uid = genFileId();
      const uploadFile = {
        name: file.name,
        percentage: 0,
        status: "ready",
        size: file.size,
        raw: file,
        uid: file.uid
      };
      if (props.listType === "picture-card" || props.listType === "picture") {
        try {
          uploadFile.url = URL.createObjectURL(file);
        } catch (err) {
          debugWarn(SCOPE, err.message);
          props.onError(err, uploadFile, uploadFiles.value);
        }
      }
      uploadFiles.value = [...uploadFiles.value, uploadFile];
      props.onChange(uploadFile, uploadFiles.value);
    };
    const handleRemove = async (file) => {
      const uploadFile = file instanceof File ? getFile(file) : file;
      if (!uploadFile)
        throwError(SCOPE, "file to be removed not found");
      const doRemove = (file2) => {
        abort(file2);
        const fileList = uploadFiles.value;
        fileList.splice(fileList.indexOf(file2), 1);
        props.onRemove(file2, fileList);
        revokeObjectURL(file2);
      };
      if (props.beforeRemove) {
        const before = await props.beforeRemove(uploadFile, uploadFiles.value);
        if (before !== false)
          doRemove(uploadFile);
      } else {
        doRemove(uploadFile);
      }
    };
    function submit() {
      uploadFiles.value.filter(({ status }) => status === "ready").forEach(({ raw }) => {
        var _a2;
        return raw && ((_a2 = uploadRef.value) == null ? void 0 : _a2.upload(raw));
      });
    }
    Vue.watch(() => props.listType, (val) => {
      if (val !== "picture-card" && val !== "picture") {
        return;
      }
      uploadFiles.value = uploadFiles.value.map((file) => {
        const { raw, url } = file;
        if (!url && raw) {
          try {
            file.url = URL.createObjectURL(raw);
          } catch (err) {
            props.onError(err, file, uploadFiles.value);
          }
        }
        return file;
      });
    });
    Vue.watch(uploadFiles, (files) => {
      for (const file of files) {
        file.uid || (file.uid = genFileId());
        file.status || (file.status = "success");
      }
    }, { immediate: true, deep: true });
    return {
      uploadFiles,
      abort,
      clearFiles,
      handleError: handleError2,
      handleProgress,
      handleStart,
      handleSuccess,
      handleRemove,
      submit
    };
  };
  const __default__ = Vue.defineComponent({
    name: "ElUpload"
  });
  const _sfc_main = /* @__PURE__ */ Vue.defineComponent(__spreadProps(__spreadValues({}, __default__), {
    props: uploadProps,
    setup(__props, { expose }) {
      const props = __props;
      const slots = Vue.useSlots();
      const disabled = useDisabled();
      const uploadRef = Vue.shallowRef();
      const {
        abort,
        submit,
        clearFiles,
        uploadFiles,
        handleStart,
        handleError: handleError2,
        handleRemove,
        handleSuccess,
        handleProgress
      } = useHandlers(props, uploadRef);
      const isPictureCard = Vue.computed(() => props.listType === "picture-card");
      const uploadContentProps2 = Vue.computed(() => __spreadProps(__spreadValues({}, props), {
        fileList: uploadFiles.value,
        onStart: handleStart,
        onProgress: handleProgress,
        onSuccess: handleSuccess,
        onError: handleError2,
        onRemove: handleRemove
      }));
      Vue.onBeforeUnmount(() => {
        uploadFiles.value.forEach(({ url }) => {
          if (url == null ? void 0 : url.startsWith("blob:"))
            URL.revokeObjectURL(url);
        });
      });
      Vue.provide(uploadContextKey, {
        accept: Vue.toRef(props, "accept")
      });
      expose({
        abort,
        submit,
        clearFiles,
        handleStart,
        handleRemove
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", null, [
          Vue.unref(isPictureCard) && _ctx.showFileList ? (Vue.openBlock(), Vue.createBlock(UploadList, {
            key: 0,
            disabled: Vue.unref(disabled),
            "list-type": _ctx.listType,
            files: Vue.unref(uploadFiles),
            "handle-preview": _ctx.onPreview,
            onRemove: Vue.unref(handleRemove)
          }, Vue.createSlots({
            append: Vue.withCtx(() => [
              Vue.createVNode(UploadContent, Vue.mergeProps({
                ref_key: "uploadRef",
                ref: uploadRef
              }, Vue.unref(uploadContentProps2)), {
                default: Vue.withCtx(() => [
                  Vue.unref(slots).trigger ? Vue.renderSlot(_ctx.$slots, "trigger", { key: 0 }) : Vue.createCommentVNode("v-if", true),
                  !Vue.unref(slots).trigger && Vue.unref(slots).default ? Vue.renderSlot(_ctx.$slots, "default", { key: 1 }) : Vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 16)
            ]),
            _: 2
          }, [
            _ctx.$slots.file ? {
              name: "default",
              fn: Vue.withCtx(({ file }) => [
                Vue.renderSlot(_ctx.$slots, "file", { file })
              ])
            } : void 0
          ]), 1032, ["disabled", "list-type", "files", "handle-preview", "onRemove"])) : Vue.createCommentVNode("v-if", true),
          !Vue.unref(isPictureCard) || Vue.unref(isPictureCard) && !_ctx.showFileList ? (Vue.openBlock(), Vue.createBlock(UploadContent, Vue.mergeProps({
            key: 1,
            ref_key: "uploadRef",
            ref: uploadRef
          }, Vue.unref(uploadContentProps2)), {
            default: Vue.withCtx(() => [
              Vue.unref(slots).trigger ? Vue.renderSlot(_ctx.$slots, "trigger", { key: 0 }) : Vue.createCommentVNode("v-if", true),
              !Vue.unref(slots).trigger && Vue.unref(slots).default ? Vue.renderSlot(_ctx.$slots, "default", { key: 1 }) : Vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 16)) : Vue.createCommentVNode("v-if", true),
          _ctx.$slots.trigger ? Vue.renderSlot(_ctx.$slots, "default", { key: 2 }) : Vue.createCommentVNode("v-if", true),
          Vue.renderSlot(_ctx.$slots, "tip"),
          !Vue.unref(isPictureCard) && _ctx.showFileList ? (Vue.openBlock(), Vue.createBlock(UploadList, {
            key: 3,
            disabled: Vue.unref(disabled),
            "list-type": _ctx.listType,
            files: Vue.unref(uploadFiles),
            "handle-preview": _ctx.onPreview,
            onRemove: Vue.unref(handleRemove)
          }, Vue.createSlots({ _: 2 }, [
            _ctx.$slots.file ? {
              name: "default",
              fn: Vue.withCtx(({ file }) => [
                Vue.renderSlot(_ctx.$slots, "file", { file })
              ])
            } : void 0
          ]), 1032, ["disabled", "list-type", "files", "handle-preview", "onRemove"])) : Vue.createCommentVNode("v-if", true)
        ]);
      };
    }
  }));
  var Upload = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/home/runner/work/element-plus/element-plus/packages/components/upload/src/upload.vue"]]);
  const ElUpload = withInstall(Upload);
  const app = Vue.createApp(App);
  [ElTable, ElTableColumn, ElButton, ElProgress, ElUpload, ElAlert, ElInput].forEach((element) => app.use(element));
  const style = document.createElement("link");
  style.href = "//unpkg.com/element-plus/dist/index.css";
  style.rel = "stylesheet";
  document.head.appendChild(style);
  const script = document.createElement("script");
  script.src = "https://cdn.sheetjs.com/xlsx-0.19.1/package/dist/xlsx.full.min.js";
  script.charset = "utf-8";
  document.head.appendChild(script);
  const div = document.createElement("div");
  div.id = "csres-app-root";
  document.body.appendChild(div);
  app.mount("#csres-app-root");
})();
