// ==UserScript==
// @name          记录视频刷新历史(bilibili)
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       1.1.8
// @author        Ling2Ling4
// @description   记录每次刷新的视频, 可以方便的回溯之前错过的视频
// @license MIT
// @icon data:image/png;base64,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
// @match         *://www.bilibili.com/
// @match         *://www.bilibili.com/?*
// @match         *://www.bilibili.com/index.html
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @noframes
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/478493/%E8%AE%B0%E5%BD%95%E8%A7%86%E9%A2%91%E5%88%B7%E6%96%B0%E5%8E%86%E5%8F%B2%28bilibili%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478493/%E8%AE%B0%E5%BD%95%E8%A7%86%E9%A2%91%E5%88%B7%E6%96%B0%E5%8E%86%E5%8F%B2%28bilibili%29.meta.js
// ==/UserScript==

(() => {
  "use strict";
  const info = {
    hoverColor: "#e3e5e7",
    hasCurVideos: !1,
    classList: {
      vBox: ["container", "no-banner-container", "is-version8"],
      video: "feed-card",
      addVideo: "add-video",
      btnBox: "feed-roll-btn",
      btn: "roll-btn",
    },
    txt: { lBtnTt: "返回上一组视频", rBtnTt: "切换下一组视频" },
    saveData: {
      histVideos: {
        key: "setting_histVideos",
        value: [],
        base: [],
        valType: "array",
      },
    },
    settings: {
      isLoadVideo: {
        value: !0,
        base: !0,
        key: "setting_isLoadVideo",
        txt: "每次打开B站首页时是否恢复上次关闭的页面的视频历史记录",
        type: "基础设置",
        valType: "boolean",
        compType: "radio",
        valueText: {
          true: "每次都加载旧的视频历史",
          false: "仅记录当前页面的视频历史",
        },
      },
      maxHistory: {
        value: 10,
        base: 10,
        key: "setting_maxHistory",
        txt: "设置历史视频的记录页数 (一般一页是10个视频)",
        type: "基础设置",
        valType: "number",
        compType: "textarea",
        compH: "30px",
      },
      histBtnSize: {
        value: 20,
        base: 20,
        key: "setting_histBtnSize",
        txt: "设置按钮尺寸 (单位: 像素)",
        type: "基础设置",
        valType: "number",
        compType: "textarea",
        compH: "30px",
      },
    },
    settingsArea: null,
  };
  function getValue({
    base,
    key,
    valType = "string",
    isReSet = !0,
    getValue = null,
    setValue = null,
    getVal = null,
    setVal = null,
  } = {}) {
    getValue && (getVal = getValue), setValue && (setVal = setValue);
    let val = getVal ? getVal(key) : localStorage.getItem(key);
    return (
      void 0 !== base &&
        null == val &&
        ((val = base),
        isReSet &&
          ("string" != typeof base && (base = JSON.stringify(base)),
          setVal ? setVal(key, base) : localStorage.setItem(key, base))),
      (valType = valType.toLowerCase()),
      "string" == typeof val
        ? "string" === valType
          ? val
          : "boolean" === valType || "number" === valType
          ? JSON.parse(val)
          : "object" === valType
          ? val
            ? JSON.parse(val)
            : {}
          : "array" === valType
          ? val
            ? JSON.parse(val)
            : []
          : val
        : val
    );
  }
  function getData() {
    const settings = info.settings;
    for (const valName in settings) {
      const setting = settings[valName];
      setting.value = getValue({
        base: setting.base,
        key: setting.key,
        valType: setting.valType,
        getVal: GM_getValue,
        setVal: GM_setValue,
      });
    }
    const saveData = info.saveData;
    for (const valName in saveData) {
      if ("histVideos" === valName && !settings.isLoadVideo.value) break;
      const setting = saveData[valName];
      setting.value = getValue({
        base: setting.base,
        key: setting.key,
        valType: setting.valType,
        getVal: GM_getValue,
        setVal: GM_setValue,
      });
    }
    return info.settings;
  }
  info.keyBase = "setting_";
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
  function setValue({
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
    let f = !1;
    try {
      (getVal !== GM_getValue && setVal !== GM_setValue) || (f = !0);
    } catch (e) {}
    let newVal = value,
      oldVal = getVal ? getVal(key) : localStorage.getItem(key);
    return (
      void 0 !== base &&
        null == oldVal &&
        ((oldVal = base),
        "string" == typeof base || f || (base = JSON.stringify(base)),
        setVal ? setVal(key, base) : localStorage.setItem(key, base)),
      null !== newVal &&
        ("function" != typeof verification ||
          ((newVal = verification(newVal, oldVal, base)), null !== newVal)) &&
        newVal !== oldVal &&
        ("string" == typeof newVal || f || (newVal = JSON.stringify(newVal)),
        setVal ? setVal(key, newVal) : localStorage.setItem(key, newVal),
        !0)
    );
  }
  const settings = info.settings,
    videoHist_info = {
      maxHistory: null,
      isLoadVideo: null,
      size: null,
      histVideos: null,
      hoverColor: info.hoverColor,
      loadNum: 0,
      index: 0,
      hasCurVideos: !1,
    },
    txt = { lBtnTt: info.txt.lBtnTt, rBtnTt: info.txt.rBtnTt },
    classList = info.classList,
    videoHist_doms = {};
  let vHistory = [];
  function updateData() {
    (videoHist_info.maxHistory = settings.maxHistory.value),
      (videoHist_info.isLoadVideo = settings.isLoadVideo.value),
      (videoHist_info.size = parseInt(settings.histBtnSize.value)),
      videoHist_info.isLoadVideo &&
        ((videoHist_info.histVideos = info.saveData.histVideos.value),
        (function loadVideos() {
          (vHistory = videoHist_info.histVideos),
            vHistory.forEach((vArr) => {
              vArr.forEach((item, i, arr) => {
                arr[i] = (function strToDom(str) {
                  let tmpDom = document.createElement("div");
                  tmpDom.innerHTML = str;
                  const dom = tmpDom.children[0];
                  return (tmpDom = null), dom;
                })(item);
              });
            }),
            (videoHist_info.index = vHistory.length),
            (videoHist_info.hasCurVideos = !1);
        })());
  }
  function getMaxIndex() {
    return vHistory.length - 1 + (videoHist_info.hasCurVideos ? 0 : 1);
  }
  function getVideos() {
    let arr;
    arr = [].slice.call(
      videoHist_doms.vBox.querySelectorAll("." + classList.video)
    );
    const addVideos = videoHist_doms.vBox.querySelectorAll(
      "." + classList.addVideo
    );
    return (
      addVideos.length > 0 && (arr = arr.concat([].slice.call(addVideos))),
      (arr = arr.filter((i) => "none" !== i.style.display)),
      (videoHist_doms.curVideos = arr),
      arr
    );
  }
  function updateHistory() {
    if (
      ((videoHist_doms.curVideos = getVideos()),
      !vHistory[vHistory.length - 1] ||
        videoHist_doms.curVideos[0] !== vHistory[vHistory.length - 1][0])
    )
      return (
        vHistory.push(videoHist_doms.curVideos),
        videoHist_info.index === vHistory.length - 1 &&
          (videoHist_info.hasCurVideos = !0),
        vHistory.length > videoHist_info.maxHistory &&
          (vHistory.splice(0, 1), videoHist_info.index--),
        videoHist_info.isLoadVideo &&
          (function saveVideos() {
            const arr = [];
            vHistory.forEach((vArr) => {
              const curArr = [];
              vArr.forEach((item) => {
                curArr.push(
                  (function domToString(dom) {
                    let tmpDom = document.createElement("div");
                    tmpDom.appendChild(dom.cloneNode(!0));
                    const str = tmpDom.innerHTML;
                    return (tmpDom = null), str;
                  })(item)
                );
              }),
                arr.push(curArr);
            }),
              setValue({
                value: JSON.stringify(arr),
                base: "",
                key: info.saveData.histVideos.key,
                getValue: GM_getValue,
                setValue: GM_setValue,
              });
          })(),
        !0
      );
  }
  function historyChange(f = "left") {
    if (
      (videoHist_info.hasCurVideos ||
        videoHist_info.index !== vHistory.length - 1 + 1 ||
        updateHistory(),
      "right" === f)
    ) {
      if ((videoHist_info.index++, videoHist_info.index > vHistory.length - 1))
        return void (videoHist_info.index = vHistory.length - 1);
    } else if ((videoHist_info.index--, videoHist_info.index < 0))
      return void (videoHist_info.index = 0);
    !(function delCurVideos() {
      getVideos().forEach((ele) => {
        ele.remove();
      });
    })();
    const twoVideo = videoHist_doms.vBox.children[1];
    vHistory[videoHist_info.index].forEach((ele) => {
      videoHist_doms.vBox.insertBefore(ele, twoVideo);
    });
  }
  function historyBtns() {
    let i = 0;
    const timer = setInterval(() => {
      i >= 5 && clearInterval(timer),
        i++,
        (videoHist_doms.btnBox = document.querySelector(
          "." + classList.btnBox
        )),
        (videoHist_doms.btn =
          videoHist_doms.btnBox &&
          videoHist_doms.btnBox.querySelector("." + classList.btn)),
        videoHist_doms.btnBox &&
          videoHist_doms.btn &&
          (!(function createBtns() {
            const dom = document.createElement("div");
            (dom.innerHTML = `<div id="vHistory-box" style="display:flex;width:100%;line-height:1.6;margin-top:10px">\n  <style>.vHistoryBtn {width:${
              videoHist_info.size
            }px;height:${
              videoHist_info.size
            }px;text-align:center;border-radius:${
              videoHist_info.size / 5
            }px;cursor:pointer;}\n    .vHistoryBtn:hover {background:${
              videoHist_info.hoverColor
            };}</style>\n  <div class="left-historyBtn vHistoryBtn" title="${
              txt.lBtnTt
            }">\n    <svg t="1698507568902" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"\n      p-id="918" xmlns:xlink="http://www.w3.org/1999/xlink" width="${
              videoHist_info.size - 6
            }" height="${
              videoHist_info.size - 6
            }">\n      <path d="M796.444444 113.777778c0 17.066667-5.688889 34.133333-17.066666 45.511111L409.6 472.177778c-5.688889 11.377778-11.377778 17.066667-11.377778 34.133333 0 5.688889 5.688889 22.755556 11.377778 28.444445l364.088889 329.955555c22.755556 22.755556 22.755556 56.888889 5.688889 79.644445-22.755556 22.755556-56.888889 22.755556-79.644445 5.688888l-364.088889-329.955555c-34.133333-28.444444-51.2-73.955556-51.2-119.46666699s22.755556-85.333333 56.888889-119.46666601l364.088889-312.888889c22.755556-22.755556 56.888889-17.066667 79.644445 5.688889 5.688889 11.377778 11.377778 28.444444 11.377777 39.822222z" fill="#999999" p-id="919"></path>\n    </svg>\n  </div>\n  <div class="right-historyBtn vHistoryBtn" title="${
              txt.rBtnTt
            }">\n    <svg t="1698507574371" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"\n      p-id="1067" xmlns:xlink="http://www.w3.org/1999/xlink" width="${
              videoHist_info.size - 6
            }" height="${
              videoHist_info.size - 6
            }">\n      <path d="M227.555556 910.222222c0-17.066667 5.688889-34.133333 17.066666-45.511111L614.4 551.822222c5.688889-11.377778 11.377778-17.066667 11.377778-34.133333 0-5.688889-5.688889-22.755556-11.377778-28.444445l-364.088889-329.955555c-22.755556-22.755556-22.755556-56.888889-5.688889-79.644445 22.755556-22.755556 56.888889-22.755556 79.644445-5.688888l364.088889 329.955555c34.133333 28.444444 51.2 73.955556 51.2 119.46666699s-22.755556 85.333333-56.888889 119.46666601l-364.088889 312.888889c-22.755556 22.755556-56.888889 17.066667-79.644445-5.688889-5.688889-11.377778-11.377778-28.444444-11.377777-39.822222z" fill="#999999" p-id="1068"></path>\n    </svg>\n  </div>\n</div>`),
              videoHist_doms.btnBox.appendChild(dom),
              (videoHist_doms.lBtn =
                videoHist_doms.btnBox.querySelector(".left-historyBtn")),
              (videoHist_doms.rBtn =
                videoHist_doms.btnBox.querySelector(".right-historyBtn"));
          })(),
          videoHist_doms.lBtn &&
            videoHist_doms.rBtn &&
            (!(function videoHist_bindEvents() {
              videoHist_doms.btn.addEventListener("click", () => {
                videoHist_info.index !== getMaxIndex() &&
                  (vHistory.splice(
                    videoHist_info.index + 1,
                    vHistory.length - 1 - videoHist_info.index
                  ),
                  (videoHist_info.index = getMaxIndex()),
                  (videoHist_info.hasCurVideos = !0)),
                  videoHist_info.index === getMaxIndex() &&
                    (videoHist_info.index++,
                    (videoHist_info.hasCurVideos = !1)),
                  updateHistory();
              }),
                videoHist_doms.lBtn.addEventListener("click", () => {
                  historyChange("left");
                }),
                videoHist_doms.rBtn.addEventListener("click", () => {
                  historyChange("right");
                }),
                window.addEventListener("beforeunload", () => {
                  videoHist_info.index === getMaxIndex() && updateHistory();
                });
            })(),
            clearInterval(timer)));
    }, 1e3);
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
  function showSettings() {
    const settings = info.settings;
    (info.settingsArea = (function createEdit({
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
      param: { isShowMenu: !0 },
      oldEditCfg: info.settingsArea,
      updateDataFn: getData,
    })),
      updateData();
    showEditArea(!0, {
      resetBefore: () => {},
      confirmBefore: () => {},
      finished: (data) => {
        console.log(data);
        if (
          (function isValueChange(type = "auto") {
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
        ) {
          for (const pageName in data) {
            const page = data[pageName];
            for (const key in page) {
              const value = page[key];
              let verifyFn;
              const flag = key.replace(info.keyBase, ""),
                item = settings[flag];
              switch (key) {
                case settings.isLoadVideo.key:
                  break;
                case settings.maxHistory.key:
                  verifyFn = (newVal) =>
                    (newVal = +newVal) < 1 || !newVal
                      ? settings.maxHistory.base
                      : newVal;
                  break;
                case settings.histBtnSize.key:
                  verifyFn = (newVal) =>
                    (newVal = parseInt(newVal)) < 10 || !newVal
                      ? settings.histBtnSize.base
                      : newVal;
              }
              if (!item)
                return void console.log("设置的数据对应的对象获取失败");
              setValue({
                value,
                base: item.base,
                key,
                verification: verifyFn,
                getValue: GM_getValue,
                setValue: GM_setValue,
              });
            }
          }
          history.go(0);
        }
      },
    });
  }
  getData(),
    GM_registerMenuCommand("设置", () => {
      showSettings();
    }),
    (function main() {
      videoHist_info.loadNum++,
        videoHist_info.loadNum > 3
          ? console.log("视频元素的容器元素获取失败")
          : (updateData(),
            (function videoHist_getDoms() {
              if (
                ("string" == typeof classList.vBox
                  ? (videoHist_doms.vBox = document.querySelector(
                      "." + classList.vBox
                    ))
                  : classList.vBox.forEach((item) => {
                      !videoHist_doms.vBox &&
                        (videoHist_doms.vBox = document.querySelector(
                          "." + item
                        ));
                    }),
                !videoHist_doms.vBox)
              ) {
                const dom = document.querySelector("." + classList.video);
                if (
                  (dom && (videoHist_doms.vBox = dom.parentElement),
                  !videoHist_doms.vBox)
                )
                  return;
              }
            })(),
            videoHist_doms.vBox
              ? historyBtns()
              : setTimeout(() => {
                  main();
                }, 500));
    })();
})();