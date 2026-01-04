// ==UserScript==
// @name          91小键人网站工具
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       1.1.3
// @author        Ling2Ling4
// @description   91小键人网站工具, 含文本排版功能 (双击文本框)
// @license MIT
// @icon data:image/png;base64,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
// @match        *://dazi.91xjr.com/*
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @noframes
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/506707/91%E5%B0%8F%E9%94%AE%E4%BA%BA%E7%BD%91%E7%AB%99%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/506707/91%E5%B0%8F%E9%94%AE%E4%BA%BA%E7%BD%91%E7%AB%99%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(() => {
  "use strict";
  function verify_num1(newVal, oldVal, base) {
    return 0 === (newVal = +newVal) || newVal > 0 ? newVal : oldVal;
  }
  function getNumVerifyFn(min, max, rangeLimit = [1, 1]) {
    return (newVal, oldVal, base) => {
      if (!(newVal = +newVal) && 0 !== newVal) return oldVal;
      if (!1 !== min && !1 !== max) {
        if (rangeLimit[0] && newVal >= min) {
          if (rangeLimit[1] && newVal <= max) return newVal;
          if (!rangeLimit[1] && newVal < max) return newVal;
        }
        if (!rangeLimit[0] && newVal > min) {
          if (rangeLimit[1] && newVal <= max) return newVal;
          if (!rangeLimit[1] && newVal < max) return newVal;
        }
      } else {
        if (!1 === min) {
          if (rangeLimit[1] && newVal <= max) return newVal;
          if (!rangeLimit[1] && newVal < max) return newVal;
        }
        if (!1 === max) {
          if (rangeLimit[0] && newVal >= min) return newVal;
          if (!rangeLimit[0] && newVal > min) return newVal;
        }
      }
      return oldVal;
    };
  }
  const keyBase = "ll_daziXjrTool_",
    info = {
      keyBase,
      settingsArea: null,
      oldArticleText: "",
      url: {
        articlePosted: "dazi.91xjr.com/profile/article/posted",
        articleEdit: "dazi.91xjr.com/profile/article/edit",
        typing: "dazi.91xjr.com/typing",
      },
      selector: {
        typing_main: { value: "#dom-typingInner" },
        article_posted_textarea: { value: "#field-content" },
        article_edit_textarea: { value: "#field-content" },
      },
      settings: {
        spaceMethod: {
          value: "1",
          base: "1",
          key: keyBase + "spaceMethod",
          type: "文章发布页",
          title: "排版方式",
          desc: "双击文本框后自动排版时所采用的分隔内容的模式\n小段分隔: 按照分隔符进行分隔\n字数分隔: 按照行字数进行分隔",
          valType: "boolean",
          compType: "radio",
          valueText: { 1: "小段分隔", 2: "字数分隔" },
          groupTitle2: "自动排版",
        },
        lineNum: {
          value: 0,
          base: 0,
          key: keyBase + "lineNum",
          type: "文章发布页",
          title: "每行段数",
          desc: '"小段分隔"模式下自动排版时的每行段数 (逗号或句号等分隔符分成的小段), 0表示每行按最大段数分割',
          valType: "number",
          compType: "textarea",
          verify: getNumVerifyFn(0, !1),
        },
        maxNum: {
          value: 55,
          base: 55,
          key: keyBase + "maxNum",
          type: "文章发布页",
          title: "每行字数",
          desc: "每行的最大字数, 达到最大字数时换行",
          valType: "number",
          compType: "textarea",
          verify: getNumVerifyFn(0, !1),
        },
        delimiter: {
          value: "，。：；？,.:;?",
          base: "，。：；？,.:;?",
          key: keyBase + "delimiter",
          type: "文章发布页",
          groupTitle3: "分隔符",
          desc: '"小段分隔"模式下自动排版的分隔符, 遇到分隔符时将根据设定情况换行',
          compType: "textarea",
          verify: function verify_notNull(newVal, oldVal) {
            return newVal || oldVal;
          },
        },
        isDelimiterLine: {
          value: !1,
          base: !1,
          key: keyBase + "isDelimiterLine",
          desc: "是否允许段落末尾的分隔符单独成行",
          type: "文章发布页",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "是", false: "否" },
        },
        delimiter2: {
          value: "",
          base: "",
          key: keyBase + "delimiter2",
          groupTitle3: "强制换行分隔符",
          type: "文章发布页",
          desc: "强制换行的分隔符, 无论在哪种排版方式下都能强制换行, /n表示换行符, 每项用;;分隔 (可用于固定字数的排版)",
          compType: "textarea",
        },
        delDelimiter2: {
          value: !0,
          base: !0,
          key: keyBase + "delDelimiter2",
          desc: "自动排版后是否删除强制换行的分隔符",
          type: "文章发布页",
          valType: "boolean",
          compType: "radio",
          valueText: {
            true: "删除强制换行分隔符",
            false: "保留强制换行分隔符",
          },
        },
        delContent: {
          value: "##\n###\n**",
          base: "##\n###\n**",
          key: keyBase + "delContent",
          type: "文章发布页",
          title: "删除的内容",
          desc: "自动排版时要删除的内容, 每项换行书写, /n表示换行符",
          compType: "textarea",
          compH: "90px",
        },
        pdBottom: {
          value: 120,
          base: 120,
          key: keyBase + "pdBottom",
          type: "打字练习页",
          desc: "文章区域的下边距, 单位px (这是额外增加的下边距, 原先页面下方视觉上的边距并不是单独设置的下边距, 仅是留白区域)",
          valType: "number",
          compType: "textarea",
          verify: verify_num1,
        },
        pdLeft: {
          value: 0,
          base: 0,
          key: keyBase + "pdLeft",
          type: "打字练习页",
          desc: "文章区域的左边距, 单位px (这是额外增加的左边距)",
          valType: "number",
          compType: "textarea",
          verify: verify_num1,
        },
      },
    };
  const baseCfg = {
      state: "",
      isEditing: !1,
      hasSelectedPage: !1,
      param: {
        id: "ll_edit_wrap",
        box: document.body,
        classBase: "ll_edit_",
        w: "500px",
        h: "",
        contentH: "450px",
        bg: "rgba(0, 0, 0, 0.15)",
        color: "#333",
        fontSize: "15px",
        fontFamily:
          "PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif",
        zIndex: 11e3,
        resetTt: "重置当前页的所有设置为默认值",
        isShowMenu: !1,
        isScrollStyle: !0,
        isResetBtn: !0,
        isOnlyResetCurPage: !0,
        showPage: void 0,
        isIntervalRun: !1,
        interval: 1e3,
        page: [],
        callback: {
          resetBefore: null,
          reset: null,
          confirmBefore: null,
          finished: null,
          interval: null,
          cancelBefore: null,
          cancelled: null,
        },
      },
    },
    cfg = {
      version: "v1.2.2",
      isEditing: baseCfg.isEditing,
      hasSelectedPage: baseCfg.hasSelectedPage,
      timer: null,
      interval: 1e3,
      param: {},
      tempParam: {},
      allData: {},
      oldData: {},
      lastData: {},
      baseData: {},
      controls: {},
      doms: { page: [] },
      editText: {},
    };
  const css = function getCss() {
    const param = cfg.param,
      cBase = (param.page, param.classBase),
      baseStart = `#${param.id} .${cBase}`,
      fSize = param.fontSize ? param.fontSize : "14px",
      css = `#${
        param.id
      } {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: ${
        param.zIndex || 11e3
      };\n  background: ${
        param.bg || "rgba(0, 0, 0, 0.12)"
      };\n  display: none;\n}\n${baseStart}box {\n  text-align: initial;\n  letter-spacing: 1px;\n  position: relative;\n  width: ${
        param.w || "450px"
      };\n  ${
        param.h ? "max-height:" + param.h : ""
      };\n  margin: auto;\n  color: ${
        param.color || "#333"
      };\n  background: #fff;\n  font-size: ${fSize};\n  line-height: normal;\n  font-family: ${
        param.fontFamily ||
        "PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif"
      };\n  border: 3px solid #dfedfe;\n  border-radius: 10px;\n  box-sizing: border-box;\n  padding: 14px 8px 10px 15px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n${baseStart}menu {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 1
      }px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0 8px;\n}\n${baseStart}menu-item {\n  margin-bottom: 8px;\n  border: 1px solid #dfedfe;\n  color: #9ecaff;\n  background: #eef6ff;\n  border-radius: 6px;\n  padding: 6px 10px;\n  cursor: pointer;\n}\n${baseStart}menu-item:hover {\n  color: #65aaff;\n  background: #dfedfe;\n  border: 1px solid #dfedfe;\n}\n${baseStart}menu-item.active {\n  color: #65aaff;\n  background: #dfedfe;\n  border: 1px solid #dfedfe;\n}\n${baseStart}page-box {\n  max-height: ${
        param.contentH || ""
      };\n  padding-right: 7px;\n  margin-bottom: 8px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n${baseStart}page {\n  display: none;\n}\n${baseStart}page.curPage {\n  display: block;\n}\n${baseStart}comp {\n  margin-bottom: 8px;\n}\n${baseStart}comp:last-child {\n  margin-bottom: 2px;\n}\n${baseStart}tt {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 6
      }px;\n  margin-top: 4px;\n}\n${baseStart}tt2 {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 4
      }px;\n  margin-top: 3px;\n  margin-bottom: 7px;\n}\n${baseStart}tt3 {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 2
      }px;\n  margin-top: 2px;\n  margin-bottom: 6px;\n}\n${baseStart}desc {\n  line-height: 1.5;\n}\n${baseStart}comp-tt {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 1
      }px;\n  line-height: 1.5;\n}\n${baseStart}comp-desc {\n  line-height: 1.5;\n}\n${baseStart}rd-arr {\n  line-height: 22px;\n}\n${baseStart}rd-arr label {\n  margin-right: 6px;\n  cursor: pointer;\n}\n${baseStart}rd-arr input {\n  vertical-align: -2px;\n  cursor: pointer;\n}\n${baseStart}rd-arr span {\n  color: #666;\n  margin-left: 2px;\n}\n#${
        param.id
      } textarea {\n  width: 100%;\n  max-width: 100%;\n  max-height: 300px;\n  border-radius: 6px;\n  line-height: normal;\n  padding: 5px 7px;\n  outline-color: #cee4ff;\n  border: 1px solid #aaa;\n  box-sizing: border-box;\n  font-size: ${
        parseInt(fSize) - 2
      }px;\n  font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;\n  /* 保留空格 */\n  white-space: pre-wrap;\n  /* 允许词内换行 */\n  word-break: break-all;\n  letter-spacing: 1px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n#${
        param.id
      } textarea::placeholder {\n  color: #bbb;\n}\n${baseStart}ta-desc {\n  margin-bottom: 3px;\n}\n${baseStart}btn-box {\n  display: flex;\n  justify-content: flex-end;\n}\n${baseStart}btn-box button {\n  font-size: 16px;\n  line-height: normal;\n  color: #65aaff;\n  background: #dfedfe;\n  outline: none;\n  border: none;\n  border-radius: 6px;\n  padding: 8px 16px;\n  box-sizing: border-box;\n  cursor: pointer;\n}\n${baseStart}btn-box .${cBase}reset-btn {\n  position: absolute;\n  left: 15px;\n  bottom: 10px;\n  color: #888;\n  background: #f4f4f4;\n  margin-right: 15px;\n}\n${baseStart}btn-box .${cBase}reset-btn:hover {\n  color: #666;\n  background: #eee;\n}\n${baseStart}btn-box .${cBase}cancel-btn {\n  color: #888;\n  background: #f4f4f4;\n  margin-right: 15px;\n}\n${baseStart}btn-box .${cBase}cancel-btn:hover {\n  color: #666;\n  background: #eee;\n}\n${baseStart}btn-box .${cBase}confirm-btn {\n  margin-right: 7px;\n}\n${baseStart}btn-box .${cBase}confirm-btn:hover {\n  background: #cee4ff;\n}\n`;
    return param.isScrollStyle
      ? css +
          "\n.ll-scroll-style-1::-webkit-scrollbar,\n.ll-scroll-style-1 ::-webkit-scrollbar {\n  width: 8px;\n}\n.ll-scroll-style-1-size-2::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-2::-webkit-scrollbar {\n  width: 10px;\n}\n.ll-scroll-style-1-size-3::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-3::-webkit-scrollbar {\n  width: 12px;\n}\n.ll-scroll-style-1::-webkit-scrollbar-thumb,\n.ll-scroll-style-1 ::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);\n  opacity: 0.2;\n  background: #daedff;\n}\n.ll-scroll-style-1::-webkit-scrollbar-track,\n.ll-scroll-style-1 ::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08);\n  border-radius: 0;\n  background: #fff;\n  border-radius: 5px;\n}"
      : css;
  };
  const editArea_html = function getHTML() {
      function getCompHTML({ info, active = "", id }) {
        let type = info.type;
        if (
          ((type = {
            menuTitle: "mtt",
            title: "tt",
            title2: "tt2",
            title3: "tt3",
            desc: "ds",
            radio: "rd",
            checkbox: "cb",
            textarea: "ta",
            mtt: "mtt",
            tt: "tt",
            tt2: "tt2",
            tt3: "tt3",
            ds: "ds",
            rd: "rd",
            cb: "cb",
            ta: "ta",
          }[type]),
          (id = 0 === id ? "0" : id || ""),
          0 === info.value && (info.value = "0"),
          !type)
        )
          return console.log("不存在的组件类型"), !1;
        let title = "",
          desc = "",
          ctrlTt = "";
        switch (
          (["tt", "tt2", "tt3", "ds", "mtt"].includes(type) ||
            ((title = info.title
              ? `<div class="${cBase}comp-tt ${cBase}${type}-tt" title="${
                  info.tt || ""
                }">${info.title}</div>`
              : ""),
            (desc = info.desc
              ? `<div class="${cBase}comp-desc ${cBase}${type}-desc">${info.desc}</div>`
              : "")),
          type)
        ) {
          case "mtt":
            return (
              (info.value = info.value || ""),
              info.value
                ? `<div class="${cBase}menu-item ${active || ""}" title="${
                    info.tt || ""
                  }">${info.value}</div>`
                : ""
            );
          case "tt":
          case "tt2":
          case "tt3":
            return (
              (info.value = info.value || ""),
              info.value
                ? `<div class="${cBase}${type} ${cBase}comp" title="${
                    info.tt || ""
                  }">${info.value}</div>`
                : ""
            );
          case "ds":
            return (
              (info.value = info.value || ""),
              info.value
                ? `<div class="${cBase}desc ${cBase}comp" title="${
                    info.descTt || ""
                  }">${info.value}</div>`
                : ""
            );
          case "rd":
            const name = info.name || info.id + new Date().getTime();
            (ctrlTt = info.ctrlTt || ""),
              ctrlTt && (ctrlTt = `title="${ctrlTt}"`);
            let radio = `<div class="${cBase}rd ${cBase}rd-arr" ${ctrlTt}>`;
            if (void 0 === info.value && info.radioList[0]) {
              const obj = info.radioList[0];
              info.value = void 0 === obj.value ? obj.text : obj.value;
            }
            return (
              info.radioList.forEach((item, i) => {
                void 0 === item.value && (info.radioList[i].value = item.text),
                  void 0 === item.text && (info.radioList[i].text = item.value);
                const value = item.value;
                let tt = item.tt || "";
                tt && (tt = `title="${tt}"`);
                let selected = "";
                info.value + "" == item.value + "" && (selected = "checked"),
                  (radio += `<label ${tt}><input ${selected} type="radio" name="${name}" data-val="${value}" data-cpid="${id}"><span>${item.text}</span></label>`);
              }),
              (radio += "</div>"),
              `<div class="${cBase}comp ${cBase}ctrl ${cBase}rd-box" data-type="${type}" data-cpid="${id}">${title}${desc}${radio}</div>`
            );
          case "cb":
            const name2 = info.name || new Date().getTime();
            if (
              ((ctrlTt = info.ctrlTt || ""),
              ctrlTt && (ctrlTt = `title="${ctrlTt}"`),
              void 0 === info.value && info.radioList[0])
            ) {
              const obj = info.radioList[0];
              info.value = void 0 === obj.value ? obj.text : obj.value;
            }
            let checkbox = `<div class="${cBase}cb ${cBase}rd-arr" ${ctrlTt}>`;
            return (
              info.radioList.forEach((item, i) => {
                void 0 === item.value && (info.radioList[i].value = item.text),
                  void 0 === item.text && (info.radioList[i].text = item.value);
                const value = item.value;
                let tt = item.tt || "";
                tt && (tt = `title="${tt}"`);
                let selected = "";
                info.value.includes(value) && (selected = "checked"),
                  (checkbox += `<label ${tt}><input ${selected} type="checkbox" name="${name2}" data-val="${value}" data-cpid="${id}"><span>${item.text}</span></label>`);
              }),
              (checkbox += "</div>"),
              `<div class="${cBase}comp ${cBase}ctrl ${cBase}cb-box" data-type="${type}" data-cpid="${id}">${title}${desc}${checkbox}</div>`
            );
          case "ta":
            const taH = `height:${info.height || "30px"};`,
              style = `style="${
                info.width ? "width:" + info.width + ";" : ""
              }${taH}${
                info.fontSize ? "font-size:" + info.fontSize + ";" : ""
              }${
                info.fontFamily ? "font-family:" + info.fontFamily + ";" : ""
              }"`,
              textarea = `<textarea class="${cBase}ta" ${style} data-cpid="${id}" placeholder="${
                info.ph || ""
              }" title="${info.ctrlTt || "拖动右下角可调节宽高"}"></textarea>`;
            return `<div class="${cBase}comp ${cBase}ctrl ${cBase}ta-box" data-type="${type}"  data-cpid="${id}">${title}${desc}${textarea}</div>`;
        }
      }
      const param = cfg.param,
        page = param.page,
        cBase = param.classBase,
        isMenu = 1 !== page.length;
      let menu = `<div class="${cBase}menu">`,
        pageHTML = `<div class="${cBase}page-box ll-scroll-style-1 ll-scroll-style-1-size-2">`;
      page.forEach((curPage, index) => {
        let pgid = curPage.id || index;
        (pgid += ""), (cfg.allData[pgid] = {}), (cfg.baseData[pgid] = {});
        let pageFlag = "";
        if (
          (cfg.hasSelectedPage ||
            ((void 0 === param.showPage || pgid === param.showPage + "") &&
              ((pageFlag = "curPage"), (cfg.hasSelectedPage = !0))),
          (pageHTML += `<div class="${cBase}page ${pageFlag}" data-pgid="${pgid}">`),
          curPage.components)
        ) {
          let compIndex = 0;
          if (isMenu || param.isShowMenu) {
            let curMenu = curPage.components.find(
              (item) => "menuTitle" === item.type
            );
            curMenu || (curMenu = { type: "menuTitle", value: pgid }),
              (menu += getCompHTML({
                info: curMenu,
                active: pageFlag ? "active" : "",
              }));
          }
          curPage.components.forEach((item) => {
            const cpid = item.id || compIndex;
            "menuTitle" !== item.type &&
              (pageHTML += getCompHTML({ info: item, id: cpid })),
              ["title", "title2", "title3", "desc", "menuTitle"].includes(
                item.type
              ) ||
                ((item.base = void 0 === item.base ? item.value : item.base),
                (cfg.allData[pgid][cpid] = item.value),
                (cfg.baseData[pgid][cpid] = item.base),
                compIndex++);
          });
        }
        pageHTML += "</div>";
      }),
        (pageHTML += "</div>"),
        isMenu || param.isShowMenu ? (menu += "</div>") : (menu = "");
      const resetBtn = param.isResetBtn
          ? `<button class="${cBase}reset-btn" title="${
              param.resetTt || "重置所有设置为默认值"
            }">重置</button>`
          : "",
        btnBox = `<div class="${cBase}btn-box">\n${resetBtn}\n<button class="${cBase}cancel-btn">取 消</button>\n<button class="${cBase}confirm-btn">确 认</button>\n</div>`;
      return `<div class="${cBase}box ll-scroll-style-1 ll-scroll-style-1-size-3" data-version="${cfg.version}">\n${menu}\n${pageHTML}\n${btnBox}\n</div>`;
    },
    baseParam = baseCfg.param,
    controls = cfg.controls,
    doms = cfg.doms;
  function createEditEle({
    id = baseParam.id,
    box = baseParam.box,
    classBase = baseParam.classBase,
    w = baseParam.w,
    h = baseParam.h,
    contentH = baseParam.contentH,
    bg = baseParam.bg,
    color = baseParam.color,
    fontSize = baseParam.fontSize,
    fontFamily = baseParam.fontFamily,
    zIndex = baseParam.zIndex,
    resetTt = baseParam.resetTt,
    isShowMenu = baseParam.isShowMenu,
    isScrollStyle = baseParam.isScrollStyle,
    isResetBtn = baseParam.isResetBtn,
    isOnlyResetCurPage = baseParam.isOnlyResetCurPage,
    showPage = baseParam.showPage,
    isIntervalRun = baseParam.isIntervalRun,
    interval = baseParam.interval,
    page = [],
    callback = baseParam.callback,
  } = {}) {
    (cfg.state = baseCfg.state),
      (cfg.isEditing = baseCfg.isEditing),
      (cfg.hasSelectedPage = baseCfg.hasSelectedPage),
      (cfg.param = { ...baseParam });
    const param = cfg.param;
    (box = box || document.body),
      (param.id = id),
      (param.box = box),
      (param.classBase = classBase),
      (param.w = w),
      (param.h = h),
      (param.contentH = contentH),
      (param.bg = bg),
      (param.color = color),
      (param.fontSize = fontSize),
      (param.fontFamily = fontFamily),
      (param.zIndex = zIndex),
      (param.resetTt = resetTt),
      (param.isShowMenu = isShowMenu),
      (param.isScrollStyle = isScrollStyle),
      (param.isResetBtn = isResetBtn),
      (param.isOnlyResetCurPage = isOnlyResetCurPage),
      (param.showPage = showPage),
      (param.isIntervalRun = isIntervalRun),
      (param.interval = interval),
      (param.page = page),
      (param.callback = callback),
      (cfg.interval = interval),
      (cfg.callback = callback);
    const html = editArea_html();
    return (
      box.querySelector(`#${param.classBase}${param.id}-css`) ||
        (function addCss(cssText, box = document.body, id = "") {
          const style = document.createElement("style");
          return (
            id && (style.id = id),
            box.appendChild(style),
            (style.innerHTML = cssText),
            style
          );
        })(css(), box, param.classBase + param.id + "-css"),
      (doms.wrap = (function createEle({
        className = "",
        id = "",
        title = "",
        css,
        box = document.body,
        type = "div",
      } = {}) {
        const ele = document.createElement(type);
        return (
          id && (ele.id = id),
          className && (ele.className = className),
          title && (ele.title = title),
          css && (ele.style.cssText = css),
          box.appendChild(ele),
          ele
        );
      })({ className: id, id })),
      (doms.wrap.innerHTML = html),
      (function getDoms() {
        const param = cfg.param,
          cBase = param.classBase;
        (doms.box = doms.wrap.querySelector(`.${cBase}box`)),
          (doms.cancel = doms.box.querySelector(`.${cBase}cancel-btn`)),
          (doms.confirm = doms.box.querySelector(`.${cBase}confirm-btn`));
        const isMenu = 1 !== param.page.length;
        (isMenu || param.isShowMenu) &&
          ((doms.menu = doms.box.querySelector(`.${cBase}menu`)),
          (doms.menus = [].slice.call(
            doms.menu.querySelectorAll(`.${cBase}menu-item`)
          )));
        const pages = [].slice.call(doms.box.querySelectorAll(`.${cBase}page`));
        (doms.page = []),
          param.isResetBtn &&
            (doms.reset = doms.box.querySelector(`.${cBase}reset-btn`));
        pages.forEach((curPage, index) => {
          cfg.hasSelectedPage ||
            (curPage.classList.add("curPage"),
            (isMenu || param.isShowMenu) &&
              doms.menus[0].classList.add("active"),
            (cfg.hasSelectedPage = !0));
          const page = {},
            pgid = curPage.dataset.pgid;
          (page.pgid = curPage.pgid = pgid),
            (page.controls = [].slice.call(
              curPage.querySelectorAll(`.${cBase}ctrl`)
            )),
            (page.ele = curPage),
            doms.page.push(page),
            (isMenu || param.isShowMenu) &&
              (doms.menus[index].settingsPage = curPage);
          const ctrls = {};
          (controls[pgid] = ctrls),
            page.controls.forEach((item, i) => {
              const cpid = item.dataset.cpid,
                cType = item.dataset.type;
              let dom;
              (item.cpid = cpid),
                "rd" === cType || "cb" === cType
                  ? ((dom = [].slice.call(item.querySelectorAll("input"))),
                    (dom.compType = cType))
                  : "ta" === cType &&
                    ((dom = item.querySelector("textarea")),
                    (dom.compType = cType),
                    (dom.value = cfg.allData[pgid][cpid])),
                (ctrls[cpid] = dom);
            });
        });
      })(),
      cfg.timer && clearInterval(cfg.timer),
      (function bindEvents() {
        const param = cfg.param;
        function menuHandle(e) {
          const dom = e.target,
            cBase = param.classBase;
          if (dom.classList.contains(`${cBase}menu-item`)) {
            const old = doms.menu.querySelector(".active");
            old.classList.remove("active"),
              old.settingsPage.classList.remove("curPage"),
              dom.classList.add("active"),
              dom.settingsPage.classList.add("curPage");
          }
        }
        function cancelEdit(e) {
          const cBase = param.classBase;
          if (
            (e.stopPropagation(),
            e.target.className !== `${cBase}wrap` &&
              e.target.className !== `${cBase}cancel-btn`)
          )
            return;
          const callback = cfg.callback;
          !1 !== runCallback(callback.cancelBefore) &&
            (showEditArea(!1),
            setCompValue(cfg.oldData),
            param.isIntervalRun &&
              (setCompValue(cfg.oldData), (cfg.allData = cfg.oldData)),
            runCallback(callback.cancelled));
        }
        function confirmEdit() {
          const callback = cfg.callback,
            data = getAllData();
          (cfg.allData = data),
            !1 !== runCallback(callback.confirmBefore, data) &&
              (showEditArea(!1),
              (cfg.state = "finished"),
              runCallback(callback.finished, data),
              (cfg.state = ""));
        }
        function resetEdit() {
          const callback = cfg.callback,
            data = getAllData();
          !1 !== runCallback(callback.resetBefore, data) &&
            (!(function resetEditData(isOnlyPage = !1) {
              const param = cfg.param;
              if (param.isResetBtn)
                if (isOnlyPage) {
                  const data = getAllData(),
                    curMenu = doms.menu.querySelector(".active");
                  (data[curMenu.innerText] = cfg.baseData[curMenu.innerText]),
                    setCompValue(data);
                } else setCompValue(cfg.baseData);
            })(param.isOnlyResetCurPage),
            runCallback(callback.reset, data));
        }
        doms.menu && doms.menu.addEventListener("click", menuHandle),
          doms.wrap.addEventListener("click", cancelEdit),
          doms.cancel.addEventListener("click", cancelEdit),
          doms.confirm.addEventListener("click", confirmEdit),
          doms.reset && doms.reset.addEventListener("click", resetEdit);
      })(),
      (cfg.state = "created"),
      cfg
    );
  }
  function getAllData() {
    function getCompItem(pgid, cpid) {
      if (!controls[pgid]) return;
      const ctrl = controls[pgid][cpid];
      if (ctrl) {
        if (!Array.isArray(ctrl)) return ctrl.value;
        if ("rd" === ctrl.compType) {
          const result = ctrl.find((item) => item.checked).dataset.val;
          return "false" !== result && ("true" === result || result);
        }
        if ("cb" === ctrl.compType) {
          return ctrl
            .filter((item) => item.checked)
            .map((item) => {
              const value = item.dataset.val;
              return "false" !== value && ("true" === value || value);
            });
        }
      }
    }
    const data = {};
    if (0 === arguments.length) {
      for (const key in controls) {
        const page = controls[key];
        data[key] = {};
        for (const key2 in page) data[key][key2] = getCompItem(key, key2);
      }
      return data;
    }
    if (1 === arguments.length) {
      const ctrls = arguments[0];
      for (const pgid in ctrls) {
        data[pgid] = {};
        controls[pgid].forEach((cpid) => {
          data[pgid][cpid] = getCompItem(pgid, cpid);
        });
      }
      return cfg.allData;
    }
    return getCompItem(arguments[0], arguments[1]);
  }
  function setCompValue() {
    function setCompItem(pgid, cpid, value) {
      if (!controls[pgid]) return;
      const ctrl = controls[pgid][cpid];
      if (ctrl)
        if (Array.isArray(ctrl)) {
          if ("rd" === ctrl.compType) {
            const selected = ctrl.find((item) => item.checked);
            selected && (selected.checked = !1);
            const select = ctrl.find((item) => item.dataset.val === value + "");
            select && (select.checked = !0);
          } else if ("cb" === ctrl.compType) {
            if (
              (ctrl
                .filter((item) => item.checked)
                .forEach((item) => {
                  item.checked = !1;
                }),
              Array.isArray(value))
            )
              value.forEach((val) => {
                const select = ctrl.find(
                  (item) => item.dataset.val === val + ""
                );
                select && (select.checked = !0);
              });
            else {
              const select = ctrl.find(
                (item) => item.dataset.val === value + ""
              );
              select && (select.checked = !0);
            }
          }
        } else ctrl.value = value;
    }
    if (1 === arguments.length) {
      const data = arguments[0];
      for (const key in data) {
        const pageData = data[key];
        for (const key2 in pageData) {
          setCompItem(key, key2, pageData[key2]);
        }
      }
    } else {
      setCompItem(arguments[0], arguments[1], arguments[2]);
    }
  }
  function showEditArea(isShow = !0, callback = null) {
    if (
      (cfg.param.isIntervalRun &&
        (cfg.timer && clearInterval(cfg.timer),
        (cfg.timer = setInterval(() => {
          const data = getAllData(),
            oldType = cfg.state;
          (cfg.state = "interval"),
            runCallback(cfg.callback.interval, data),
            (cfg.state = oldType),
            (cfg.lastData = data);
        }, cfg.interval))),
      (cfg.state = "created"),
      isShow)
    ) {
      if (((cfg.oldData = getAllData()), "function" == typeof callback)) {
        if (!1 === callback(cfg.oldData, cfg.oldData, cfg.baseData)) return;
      }
      cfg.state = "show";
    }
    (cfg.isEditing = isShow),
      (doms.wrap.style.display = isShow ? "block" : "none"),
      isShow &&
        !doms.box.style.top &&
        (doms.box.style.top =
          window.innerHeight / 2 - doms.box.clientHeight / 2 + "px"),
      callback && (cfg.callback = callback);
  }
  function runCallback(callback, data) {
    let result;
    if (callback) {
      data || (data = getAllData());
      const func = callback;
      Array.isArray(func)
        ? func.curFn
          ? ((result = func[curFn](data, cfg.oldData, cfg.baseData)),
            (func.curFn = null))
          : func.forEach((fn) => {
              result = fn(data, cfg.oldData, cfg.baseData);
            })
        : "function" == typeof callback &&
          (result = func(data, cfg.oldData, cfg.baseData));
    }
    return result;
  }
  function getData(settings) {
    for (const valName in settings) {
      const setting = settings[valName];
      (setting.value = GM_getValue(setting.key, setting.base)),
        ("boolean" !== setting.valType && "number" !== setting.valType) ||
          (setting.value = JSON.parse(setting.value));
    }
    return settings;
  }
  function toPageObj({ settings, param = {}, otherPageName = "无分类" } = {}) {
    param = { ...param };
    const pageArr = [],
      menuList = [];
    let isOtherType = !1;
    for (let key in settings) {
      const item = settings[key];
      item.type
        ? menuList.includes(item.type) || menuList.push(item.type)
        : isOtherType || (isOtherType = !0);
    }
    return (
      isOtherType && menuList.push(otherPageName),
      menuList.forEach((menuTt) => {
        const components = [],
          page = { id: menuTt, components },
          arr = [];
        for (let key in settings) {
          const item = settings[key];
          menuTt === otherPageName
            ? item.type || arr.push(item)
            : item.type === menuTt && arr.push(item);
        }
        arr.forEach((item) => {
          let desc = item.desc || item.txt || "";
          desc && (desc = desc.replaceAll("\n", "<br>").trim());
          let comp,
            base = item.base;
          if (
            (Array.isArray(base) && (base = base.join(", ")), item.groupTitle1)
          ) {
            const comp = {
              id: item.key + "-gTt1",
              type: "title",
              value: item.groupTitle1,
            };
            components.push(comp);
          }
          if (item.groupTitle2) {
            const comp = {
              id: item.key + "-gTt2",
              type: "title2",
              value: item.groupTitle2,
            };
            components.push(comp);
          }
          if (item.groupTitle3) {
            const comp = {
              id: item.key + "-gTt3",
              type: "title3",
              value: item.groupTitle3,
            };
            components.push(comp);
          }
          if (item.groupDesc) {
            const comp = {
              id: item.key + "-gDesc",
              type: "desc",
              value: item.groupDesc,
            };
            components.push(comp);
          }
          if (
            (["menuTitle", "title", "desc", "title2", "title3"].includes(
              item.compType
            )
              ? ((comp = { ...item }),
                (comp.type = comp.compType),
                (comp.desc = desc))
              : (comp = {
                  id: item.key,
                  type: item.compType,
                  tt: item.tt || "",
                  title: item.title || "",
                  desc,
                  descTt: item.descTt || "",
                  name: item.key,
                  value: item.value,
                  base: item.base,
                }),
            "textarea" === comp.type)
          )
            (comp.ph = base),
              (comp.width = item.compW),
              (comp.height = item.compH),
              (comp.ctrlTt = "默认: " + base);
          else if ("radio" === comp.type || "checkbox" === comp.type) {
            let str = "默认: ";
            if ("checkbox" === comp.type) {
              let arr = item.base;
              Array.isArray(arr) || (arr = arr.split(/,|，/)),
                arr.forEach((val, i) => {
                  0 !== i && (str += ", "), (val = val.trim());
                  let valTxt = item.valueText[val];
                  void 0 === valTxt && (valTxt = val), (str += valTxt);
                });
            } else {
              let val = item.valueText[item.base];
              void 0 === val && (val = item.base), (str += val);
            }
            comp.ctrlTt = str;
          }
          if (item.valueText) {
            comp.radioList = [];
            for (let key in item.valueText) {
              const rd = { text: item.valueText[key], value: key };
              comp.radioList.push(rd);
            }
          }
          components.push(comp);
        }),
          pageArr.push(page);
      }),
      (param.page = pageArr),
      param
    );
  }
  function setValue_setValue({
    value,
    base,
    key,
    verification = null,
    getValue = null,
    setValue = null,
    getVal = null,
    setVal = null,
  } = {}) {
    getValue && (getVal = getValue), setValue && (setVal = setValue);
    let newVal = value,
      oldVal = getVal ? getVal(key) : localStorage.getItem(key);
    return (
      void 0 !== base &&
        null == oldVal &&
        ((oldVal = base),
        "string" != typeof base && (base = JSON.stringify(base)),
        setVal ? setVal(key, base) : localStorage.setItem(key, base)),
      null !== newVal &&
        ("function" != typeof verification ||
          ((newVal = verification(newVal, oldVal, base)), null !== newVal)) &&
        newVal !== oldVal &&
        ("string" != typeof newVal && (newVal = JSON.stringify(newVal)),
        setVal ? setVal(key, newVal) : localStorage.setItem(key, newVal),
        !0)
    );
  }
  function finishedSettings({
    allData,
    settings,
    keyBase = "",
    verifyFn = {},
    isForcedUpdate = !1,
    isRefreshPage = !1,
    callback = null,
    getValue,
    setValue,
  } = {}) {
    if (!isForcedUpdate) {
      if (
        !(function isValueChange(type = "auto") {
          const param = cfg.param,
            curData = getAllData(),
            curDataStr = JSON.stringify(curData);
          let oldDataStr;
          return (
            "auto" === type &&
              ("interval" === cfg.state &&
                param.isIntervalRun &&
                (type = "interval_current"),
              "finished" === cfg.state && (type = "auto")),
            (oldDataStr =
              "interval_current" === type
                ? JSON.stringify(cfg.lastData)
                : "base_current" === type
                ? JSON.stringify(cfg.baseData)
                : JSON.stringify(cfg.oldData)),
            "{}" !== oldDataStr && curDataStr !== oldDataStr
          );
        })()
      )
        return;
    }
    !(function saveDatas({
      allData,
      settings,
      keyBase = "",
      verifyFn = {},
      getValue,
      setValue,
    }) {
      for (const pageName in allData) {
        const page = allData[pageName];
        for (const key in page) {
          const value = page[key],
            item = settings[key.replace(keyBase, "")];
          if (!item) return void console.log("设置的数据对应的对象获取失败");
          let verify;
          for (const name in verifyFn)
            if (settings[name].key === key) {
              verify = settings[name].verify || verifyFn[name];
              break;
            }
          setValue_setValue({
            value,
            base: item.base,
            key,
            verification: verify,
            getValue,
            setValue,
          });
        }
      }
    })({ allData, settings, keyBase, verifyFn, getValue, setValue }),
      callback && "function" == typeof callback && callback(allData),
      isRefreshPage && history.go(0);
  }
  function showSettings() {
    const settings = info.settings;
    info.settingsArea = (function createEdit({
      settings,
      param = {},
      oldEditCfg,
      updateDataFn,
      isNewEdit = !0,
      isSyncOtherPage = !0,
      otherPageName = "无分类",
    } = {}) {
      let oldSettings, curSettings;
      updateDataFn &&
        isSyncOtherPage &&
        ((oldSettings = JSON.stringify(settings)),
        (settings = updateDataFn() || settings),
        (curSettings = JSON.stringify(settings)));
      const editInfo = { settings, param, otherPageName };
      if (oldEditCfg) {
        if (isNewEdit)
          return (
            oldEditCfg.doms.wrap.remove(), createEditEle(toPageObj(editInfo))
          );
        isSyncOtherPage &&
          updateDataFn &&
          oldSettings !== curSettings &&
          (oldEditCfg.doms.wrap.remove(),
          (oldEditCfg = createEditEle(toPageObj(editInfo)))),
          isSyncOtherPage &&
            !updateDataFn &&
            (oldEditCfg.doms.wrap.remove(),
            (oldEditCfg = createEditEle(toPageObj(editInfo))));
      } else oldEditCfg = createEditEle(toPageObj(editInfo));
      return oldEditCfg;
    })({
      settings,
      oldEditCfg: info.settingsArea,
      updateDataFn: () => getData(settings),
    });
    showEditArea(!0, {
      resetBefore: () => confirm("是否重置当前页的所有设置为默认值?"),
      confirmBefore: () => {},
      finished: (data, oldData) => {
        console.log(data),
          finishedSettings({
            allData: data,
            settings,
            keyBase: info.keyBase,
            verifyFn: settings,
            getValue: GM_getValue,
            setValue: GM_setValue,
          }),
          getData(settings);
      },
    });
  }
  function emitEvent(ele, eventType) {
    try {
      if (ele.dispatchEvent) {
        var evt = new Event(eventType, { bubbles: !1, cancelable: !1 });
        ele.dispatchEvent(evt);
      } else ele.fireEvent && ele.fireEvent("on" + eventType);
    } catch (e) {}
  }
  !(function main() {
    getData(info.settings),
      GM_registerMenuCommand("设置", () => {
        showSettings();
      });
    const url = window.location.href;
    (url.includes(info.url.articlePosted) ||
      url.includes(info.url.articleEdit)) &&
      (function articlePosted() {
        const settings = info.settings,
          textarea = document.querySelector(
            info.selector.article_posted_textarea.value
          );
        textarea &&
          textarea.addEventListener("dblclick", () => {
            if (textarea.isFormat)
              (textarea.value = info.oldArticleText),
                (textarea.isFormat = !1),
                emitEvent(textarea, "change"),
                emitEvent(textarea, "input");
            else {
              const method = settings.spaceMethod.value;
              let value = textarea.value;
              console.log("当前内容:\n", value), (info.oldArticleText = value);
              const lineNum = settings.lineNum.value,
                maxNum = settings.maxNum.value,
                delimiter = settings.delimiter.value;
              let curLineNum = 0,
                curLineLen = 0;
              function replaceCharAt(str, index, replacement) {
                return index < 0 || index >= str.length
                  ? str
                  : str.substring(0, index) +
                      replacement +
                      str.substring(index + 1);
              }
              let delContent = settings.delContent.value.split("\n");
              (delContent = delContent.slice().reverse()),
                delContent.forEach((d) => {
                  (d = d.replaceAll("/n", "\n")),
                    (value = value.replaceAll(d, ""));
                }),
                settings.delimiter2.value
                  .replaceAll("；", ";")
                  .split(";;")
                  .forEach((d) => {
                    d &&
                      ((d = d.replaceAll("/n", "\n")),
                      (value = settings.delDelimiter2.value
                        ? value.replaceAll(d, "\n")
                        : value.replaceAll(d, d + "\n")));
                  });
              for (let i = 0; i < value.length; i++) {
                const item = value[i];
                if ("\n" !== item) {
                  if ((curLineLen++, 1 === method)) {
                    if (delimiter.includes(item)) {
                      curLineNum++;
                      let str = value.slice(i + 1, value.length),
                        lastLen = str.length;
                      const charArr = str.split(""),
                        firstChar = charArr.find((char) =>
                          delimiter.includes(char)
                        );
                      let index = -1,
                        isWrap = !0;
                      if (
                        (charArr.some((char) =>
                          "\n" === char
                            ? ((isWrap = !1), !0)
                            : (index++, char === firstChar || void 0)
                        ),
                        -1 !== index && (lastLen = index + 1),
                        curLineNum === lineNum || curLineLen + lastLen > maxNum)
                      ) {
                        const next = value[i + 1];
                        isWrap &&
                          next &&
                          "\n" !== next &&
                          ((value = replaceCharAt(value, i, item + "\n")), i++),
                          (curLineNum = 0),
                          (curLineLen = 0);
                      }
                    }
                  } else if (2 === method && maxNum === curLineLen) {
                    const next = value[i + 1];
                    if (next && "\n" !== next) {
                      const next2 = value[i + 2],
                        isDelimiterLine = settings.isDelimiterLine.value;
                      (value = isDelimiterLine
                        ? replaceCharAt(value, i, item + "\n")
                        : delimiter.includes(next)
                        ? replaceCharAt(
                            value,
                            i,
                            "\n" !== next2 && next2 ? item + "\n" : "\n" + item
                          )
                        : replaceCharAt(value, i, item + "\n")),
                        i++;
                    }
                    curLineLen = 0;
                  }
                } else (curLineNum = 0), (curLineLen = 0);
              }
              (textarea.value = value),
                (textarea.isFormat = !0),
                emitEvent(textarea, "change"),
                emitEvent(textarea, "input");
            }
          });
      })(),
      url.includes(info.url.typing) &&
        (function typing() {
          const settings = info.settings;
          setTimeout(() => {
            const mainDom = document.querySelector(
                info.selector.typing_main.value
              ),
              pdb = settings.pdBottom.value,
              pdl = settings.pdLeft.value;
            !(function setPadding() {
              function setStyle() {
                (mainDom.style.height =
                  parseInt(mainDom.style.height) - pdb + "px"),
                  (mainDom.style.paddingLeft = pdl + "px");
              }
              setStyle();
              let timer = null;
              window.addEventListener("resize", () => {
                timer && clearTimeout(timer),
                  (timer = setTimeout(() => {
                    setStyle();
                  }, 300));
              });
            })();
          }, 500);
        })();
  })();
})();