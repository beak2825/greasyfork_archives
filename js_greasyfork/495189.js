// ==UserScript==
// @name          bilibili自动发送直播弹幕
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       1.2.12
// @author        Ling2Ling4
// @description   bilibili自动发送直播弹幕, 刷屏和互动专用, 右上角插件菜单中启动
// @license       AGPL-3.0-or-later
// @icon data:image/png;base64,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
// @match         *://live.bilibili.com/*
// @run-at        document-end
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_notification
// @noframes
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/495189/bilibili%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495189/bilibili%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(() => {
  "use strict";
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
  const keyBase = "ll_auto_send_dm_",
    parseVerify = (newVal, oldVal) => {
      if (!newVal) return oldVal;
      if ((newVal = newVal.trim()).includes("-")) {
        const parts = newVal.split("-");
        if (2 !== parts.length) return oldVal;
        const min = parseInt(parts[0], 10),
          max = parseInt(parts[1], 10);
        return isNaN(min) || isNaN(max) || min > max ? oldVal : newVal;
      }
      return getNumVerifyFn(1, !1)(newVal, oldVal);
    },
    info = {
      keyBase,
      settingsArea: null,
      timerId: null,
      replyTimer: null,
      errorTimer: null,
      isStarted: !1,
      isStartedReply: !1,
      data: {
        curIndex: -1,
        startTime: 0,
        replyStartTime: 0,
        testDm: "test",
        testText: "-",
        errorTt: "脚本启动失败",
        errorTxt:
          "部分直播间无法使用该脚本, 如王者或者联盟的比赛直播. 若不是此类直播间, 请在 B站:零泠丶 或 https://greasyfork.org/zh-CN/users/1196880-ling2ling4 进行反馈",
      },
      curClassList: null,
      classList: {
        v_20240823: {
          textarea: "#control-panel-ctnr-box textarea",
          btn: "#control-panel-ctnr-box button.bl-button",
          dm: ".danmaku-item .danmaku-item-right",
          myDm: '.danmaku-item[data-uname="零泠丶"] .danmaku-item-right',
          dmDataset: { dm: "danmaku", name: "uname" },
          emoticon: "emoticon",
        },
        v_20240823Before: {
          textarea: "#control-panel-ctnr-box .chat-input-ctnr textarea",
          btn: "#control-panel-ctnr-box .bottom-actions button",
          dm: ".danmaku-item .danmaku-item-right",
          myDm: '.danmaku-item[data-uname="零泠丶"] .danmaku-item-right',
          dmDataset: { dm: "danmaku", name: "uname" },
        },
      },
      dmDataset: { dm: "danmaku", name: "uname" },
      doms: {},
      settings: {
        dmText: {
          value: "零泠丶",
          base: "零泠丶",
          key: keyBase + "dmText",
          title: "弹幕内容",
          desc: "自动发送的直播弹幕的内容, 也可书写多条弹幕, 多条弹幕的书写格式如下\n【格式】\n1.随机发送: 弹幕1;;弹幕2... , 每条弹幕用 ;; 分隔(两个分号), 每次将随机发送其中的一条弹幕\n2.顺序发送: 弹幕1==弹幕2... , 每条弹幕用 == 分隔, 依次循环发送每条弹幕\n注. 可在每条弹幕的后面通过 --N 的格式添加权重, 权重越高则越容易发送该条弹幕或重复次数越多(默认权重为1), 权重之和可以超过100.\n【示例】\n666;;赞--9;;好耶--90  表示发送666的概率为1%, 赞的概率9%, 好耶的概率90%\n666==赞--10  表示发送1次666后发送10次赞",
          type: "弹幕设置",
          valType: "string",
          compType: "textarea",
          compH: "80px",
          verify: function verify_notNull(newVal, oldVal) {
            return newVal || oldVal;
          },
        },
        intervalTime: {
          value: "5-30",
          base: "5-30",
          key: keyBase + "intervalTime",
          desc: "弹幕发送的间隔时间(秒), 也可输入一个时间段表示随机的间隔时间, 如: 5-30, 表示每5-30秒发送一条弹幕",
          type: "基础设置",
          valType: "string",
          compType: "textarea",
          compH: "30px",
          verify: parseVerify,
        },
        pauseTime: {
          value: "30-90",
          base: "30-90",
          key: keyBase + "pauseTime",
          desc: "'顺序发送'模式下每轮的中间间隔时间(秒), 也可输入一个时间段表示随机的间隔时间, 如: 5-30, 表示每5-30秒后再次开始依次顺序发送弹幕",
          type: "基础设置",
          valType: "string",
          compType: "textarea",
          compH: "30px",
          verify: parseVerify,
        },
        runTime: {
          value: 0,
          base: 0,
          key: keyBase + "runTime",
          desc: "自动弹幕功能的单次运行时长(分钟), 0表示运行后不自动停止",
          type: "基础设置",
          valType: "number",
          compType: "textarea",
          compH: "30px",
          verify: getNumVerifyFn(0, !1),
        },
        replyRunTime: {
          value: 0,
          base: 0,
          key: keyBase + "replyRunTime",
          desc: "自动回复功能的单次运行时长(分钟), 0表示运行后不自动停止",
          type: "基础设置",
          valType: "number",
          compType: "textarea",
          compH: "30px",
          verify: getNumVerifyFn(0, !1),
        },
        replyRule: {
          value: "",
          base: "",
          key: keyBase + "replyRule",
          title: "回复规则",
          desc: "自动回复规则, 多条规则时每条规则用;;分隔或换行书写\n【格式1】 A==>B, 表示检测到存在弹幕内容A后发送弹幕B\n【格式2】 A=>B, 表示检测到存在含A的弹幕内容后发送弹幕B\n【注】\n可在回复的内容B中用$name表示弹幕A的用户的用户名称, $dm表示弹幕A的用户发送的弹幕内容. 若在弹幕发送的最小间隔时间内触发了自动回复, 则该回复不会生效\n【示例】\n1==>2, 表示当某用户发送了1后, 将自动回复2\nO.o=>回复$name:O.O, 表示当用户LL(假设)发送了含O.o的弹幕后, 将自动回复'回复LL:O.O'",
          type: "自动回复",
          valType: "string",
          compType: "textarea",
          compH: "150px",
        },
        replyInterval: {
          value: "3",
          base: "3",
          key: keyBase + "replyInterval",
          desc: "自动回复的检测的间隔时间(每n秒检测弹幕一次,满足自动回复的规则则按照规则发送弹幕)",
          type: "自动回复",
          valType: "number",
          compType: "textarea",
          compH: "30px",
          verify: getNumVerifyFn(1, !1),
        },
        notReplyList: {
          value: "",
          base: "",
          key: keyBase + "notReplyList",
          desc: "不对以下用户启用自动回复 (使用,分隔或换行书写)",
          type: "自动回复",
          valType: "string",
          compType: "textarea",
          compH: "100px",
        },
        isDblclickStop: {
          value: !1,
          base: !1,
          key: keyBase + "isDblclickStop",
          desc: "双击页面任意位置后是否停止发送弹幕",
          type: "其他设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "双击后停止", false: "无效果" },
        },
        isCloseTips: {
          value: !1,
          base: !1,
          key: keyBase + "isCloseTips",
          desc: "是否关闭启动和结束时的弹窗",
          type: "其他设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "关闭弹窗", false: "弹窗提示" },
        },
      },
    };
  const intervalLoopFunc = function ({
    fn,
    breakFn,
    num = 10,
    interval = 100,
    isStartRun = !0,
    successFn,
    finishedFn,
  } = {}) {
    if (fn)
      if (isStartRun && breakFn && breakFn())
        fn(), successFn && successFn(), finishedFn && finishedFn();
      else {
        let i = isStartRun ? 1 : 0;
        const timer = setInterval(() => {
          if (breakFn && breakFn())
            return (
              fn(),
              successFn && successFn(),
              finishedFn && finishedFn(),
              void clearInterval(timer)
            );
          i++, i >= num && (finishedFn && finishedFn(), clearInterval(timer));
        }, interval);
      }
  };
  function getListAndWeight(infoItems, weightArr = null) {
    const newWeightArr = [],
      newList = [];
    let flag = !1;
    for (let i = 0; i < infoItems.length; i++) {
      const item = infoItems[i];
      let num = weightArr && weightArr.length > 0 ? weightArr[i] : 1;
      if (
        item &&
        (item.includes("--") || item.includes("=>") || item.includes("=tmp>"))
      ) {
        let arr;
        (arr = item.split("=tmp>")),
          1 === arr.length &&
            ((arr = item.split("=>")),
            1 === arr.length && (arr = item.split("--")));
        let curNum = +arr[1];
        if ((!curNum && 0 !== curNum) || "" === arr[1]) {
          newWeightArr.push(num), newList.push(item);
          continue;
        }
        (flag = !0), newWeightArr.push(curNum), newList.push(arr[0]);
      } else newWeightArr.push(num), newList.push(item);
    }
    return flag
      ? { tagList: newList, weightArr: newWeightArr }
      : { tagList: newList, weightArr: new Array(newList.length).fill(1) };
  }
  function getRandomWeight(weightArr) {
    const num = (function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    })(
      1,
      weightArr.reduce((a, b) => parseInt(a) + parseInt(b), 0)
    );
    let curSum = 0;
    for (let i = 0; i < weightArr.length; i++) {
      if (((curSum += parseInt(weightArr[i])), num <= curSum)) return i;
    }
    return 0;
  }
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
  function getData(settings, getVal = null, setVal = null) {
    for (const valName in settings) {
      const setting = settings[valName];
      setting.value = getValue({
        base: setting.base,
        key: setting.key,
        valType: setting.valType,
        getVal,
        setVal,
      });
    }
    return settings;
  }
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
  function finishedSettings({
    allData,
    settings,
    keyBase = "",
    verifyFn = null,
    isForcedUpdate = !1,
    isRefreshPage = !0,
    callback = null,
    getData = null,
    getValue,
    setValue,
  } = {}) {
    let isChange = !1;
    (isForcedUpdate ||
      ((isChange = (function isValueChange(type = "auto") {
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
      })()),
      isChange)) &&
      (!(function saveDatas({
        allData,
        settings,
        keyBase = "",
        verifyFn = null,
        getValue,
        setValue,
      }) {
        try {
          (getValue = getValue || GM_getValue),
            (setValue = setValue || GM_setValue);
        } catch (e) {}
        for (const pageName in allData) {
          const page = allData[pageName];
          for (const key in page) {
            const value = page[key],
              item = settings[key.replace(keyBase, "")];
            if (!item) return void console.log("设置的数据对应的对象获取失败");
            let verify;
            if (verifyFn) {
              for (const name in verifyFn)
                if (settings[name].key === key) {
                  verify = verifyFn[name].verify || verifyFn[name];
                  break;
                }
            } else
              for (const name in settings)
                if (settings[name].key === key) {
                  verify = settings[name].verify;
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
      isRefreshPage && isChange && history.go(0),
      !isRefreshPage &&
        isChange &&
        getData &&
        getData(settings, getValue, setValue));
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
      param: {
        resetTt: "重置当前页的所有设置为默认值",
        isOnlyResetCurPage: !0,
      },
      oldEditCfg: info.settingsArea,
      updateDataFn: () => getData(settings, GM_getValue, GM_setValue),
    });
    showEditArea(!0, {
      resetBefore: () => confirm("是否重置当前页的所有设置为默认值?"),
      confirmBefore: () => {},
      finished: (data) => {
        console.log(data),
          finishedSettings({
            allData: data,
            settings,
            keyBase: info.keyBase,
            getData,
            getValue: GM_getValue,
            setValue: GM_setValue,
          });
      },
    });
  }
  const settings = info.settings;
  function main_getDoms() {
    if ((info.doms.textarea && info.doms.btn)) return;
    const fn = (selectors) => {
      (selectors = selectors || info.curClassList),
        (info.doms.textarea = document.querySelector(selectors.textarea)),
        (info.doms.btn = document.querySelector(selectors.btn));
    };
    for (const key in info.classList) {
      const vClass = info.classList[key];
      if ((fn(vClass), info.doms.textarea && info.doms.btn)) {
        (info.curClassList = vClass), (info.dmDataset = vClass.dmDataset);
        break;
      }
    }
    return info.doms.textarea && info.doms.btn
      ? void 0
      : (info.timerId && clearInterval(info.timerId),
        info.replyTimer && clearInterval(info.replyTimer),
        info.errorTimer && clearTimeout(info.errorTimer),
        (info.errorTimer = setTimeout(() => {
          fn(),
            (info.doms.textarea && info.doms.btn) ||
              (info.doms.textarea || console.log("文本框的dom获取失败"),
              info.doms.btn || console.log("发送按钮的dom获取失败"),
              info.timerId && clearInterval(info.timerId),
              settings.isCloseTips.value ||
                GM_notification({
                  title: info.data.errorTt,
                  text: info.data.errorTxt,
                  timeout: 1e4,
                }));
        }, 4e3)),
        -1);
  }
  function getSendText(str) {
    const newStr = str
      .replaceAll("；", ";")
      .replaceAll(";;\n", ";;")
      .replaceAll("==\n", "==");
    let arr = [];
    const result = { value: str, type: "random", length: 1 };
    if (newStr.includes(";;"))
      (arr = newStr.split(";;")),
        (result.value = (function getRandomWeightItem(infoItems) {
          const result = getListAndWeight(infoItems);
          return result.tagList[getRandomWeight(result.weightArr)];
        })(arr)),
        (result.length = arr.length);
    else if (newStr.includes("==")) {
      arr = newStr.split("==");
      const obj = (function getOrderItem(infoItems, index = 0) {
        const result = getListAndWeight(infoItems),
          oldArr = result.tagList,
          sizeArr = result.weightArr,
          len = sizeArr.reduce((a, b) => parseInt(a) + parseInt(b), 0),
          curP = index + 1;
        let curRange = 0;
        for (let i = 0; i < oldArr.length; i++)
          if (((curRange += parseInt(sizeArr[i])), curP <= curRange))
            return { value: oldArr[i], length: len };
        return { value: oldArr[0], length: len };
      })(arr, info.data.curIndex + 1);
      (info.data.curIndex = (info.data.curIndex + 1) % obj.length),
        (result.value = obj.value),
        (result.type = "order"),
        (result.length = arr.length);
    }
    return result;
  }
  function sendOneDm(text) {
    if (!text) return -1;
    (info.doms.textarea.value = text),
      (function emitEvent(ele, eventType) {
        try {
          if (ele.dispatchEvent) {
            var evt = new Event(eventType, { bubbles: !1, cancelable: !1 });
            ele.dispatchEvent(evt);
          } else ele.fireEvent && ele.fireEvent("on" + eventType);
        } catch (e) {}
      })(info.doms.textarea, "input"),
      info.doms.btn.click();
  }
  function test() {
    [].slice
      .call(document.querySelectorAll(info.curClassList.myDm))
      .forEach((dm) => {
        dm.innerText.trim() !== info.data.testDm ||
          dm.isReply ||
          (sendOneDm(info.data.testText), (dm.isReply = !0));
      });
  }
  function getTime(secondsStr) {
    if ((secondsStr = (secondsStr += "").trim()).includes("-")) {
      const parts = secondsStr.split("-"),
        min = parseInt(parts[0], 10),
        max = parseInt(parts[1], 10);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return parseInt(secondsStr, 10);
  }
  function stop(istip = !0) {
    (info.doms.textarea && info.doms.btn) || main_getDoms(),
      info.doms.textarea &&
        info.doms.btn &&
        (info.isStarted &&
          istip &&
          !settings.isCloseTips.value &&
          GM_notification({ text: "已停止发送弹幕", timeout: 3500 }),
        (info.isStarted = !1),
        info.timerId && clearInterval(info.timerId),
        info.replyTimer && clearInterval(info.replyTimer),
        (info.data.curIndex = -1));
  }
  function autoReply() {
    if (
      ((info.doms.textarea && info.doms.btn) || main_getDoms(),
      !info.doms.textarea || !info.doms.btn)
    )
      return;
    if (!settings.replyRule.value) return;
    let replyRule, endReplyRule;
    main_getDoms();
    const verifyDm = (dm) => {
      if (
        ((() => {
          endReplyRule = [];
          const ruleArr = settings.replyRule.value
            .replaceAll("；", ";")
            .replaceAll(";;", "\n")
            .split("\n");
          (replyRule = ruleArr.map((rule) => {
            let arr;
            return (
              rule.includes("==>")
                ? ((arr = rule.split("==>")), (arr.flag = "==>"))
                : rule.includes("=>") &&
                  ((arr = rule.split("=>")), (arr.flag = "=>")),
              arr
            );
          })),
            replyRule.forEach((item) => {
              Array.isArray(item) &&
                2 === item.length &&
                endReplyRule.push(item);
            });
        })(),
        !replyRule || 0 === replyRule.length)
      )
        return -1;
      return endReplyRule.find((item) =>
        "==>" === item.flag
          ? dm === item[0]
          : "=>" === item.flag
          ? dm.includes(item[0])
          : void 0
      );
    };
    settings.isCloseTips.value ||
      GM_notification({ text: "开启自动回复功能", timeout: 3500 }),
      (info.isStartedReply = !0),
      (info.data.replyStartTime = new Date().getTime()),
      info.replyTimer && clearInterval(info.replyTimer),
      (info.replyTimer = setInterval(() => {
        test();
        const dmList = document.querySelectorAll(info.curClassList.dm),
          len = dmList.length;
        if (0 !== dmList.length) {
          for (let i = 0; i < len; i++) {
            const dm = dmList[i];
            if (dm.classList.contains(info.emoticon)) continue;
            if (dm.isReply) continue;
            const text = dm.innerText.trim();
            let rule = verifyDm(text);
            if (-1 === rule) break;
            if (rule) {
              let name,
                dmText,
                rpText = rule[1];
              if (dm.parentElement.dataset) {
                name = dm.parentElement.dataset[info.dmDataset.name];
                dmText = dm.parentElement.dataset[info.dmDataset.dm];
                if (name) {
                  const notReplyListString = settings.notReplyList.value || "";
                  const notReplyList = notReplyListString.split(/[,，\n]/);
                  if (notReplyList.includes(name)) {
                    dm.isReply = !0;
                    continue;
                  }
                  rpText = rpText.replaceAll("$name", name);
                }
                if (dmText) {
                  rpText = rpText.replaceAll("$dm", dmText);
                }
                dm.isReply = !0;
              }
              -1 !== sendOneDm(rpText) &&
                console.log(
                  `回复弹幕: ${name}: ${dmText}\n回复内容: ${rpText}`
                );
              break;
            }
          }
          if (0 !== settings.replyRunTime.value) {
            if (
              (new Date().getTime() - info.data.replyStartTime) / 1e3 / 60 >
              settings.replyRunTime.value
            )
              return (
                clearInterval(info.replyTimer),
                settings.isCloseTips.value ||
                  GM_notification({
                    text: `已停止自动回复, 共运行${settings.replyRunTime.value}分钟`,
                    timeout: 4500,
                  }),
                console.log(
                  `已停止自动回复, 共运行${settings.replyRunTime.value}分钟`
                ),
                -1
              );
          }
        } else console.log("未获取到弹幕");
      }, 1e3 * settings.replyInterval.value));
  }
  function setMenu() {
    GM_registerMenuCommand("开始/停止 自动弹幕", () => {
      info.isStarted
        ? stop()
        : (function start() {
            if (
              ((info.doms.textarea && info.doms.btn) || main_getDoms(),
              !info.doms.textarea || !info.doms.btn)
            )
              return;
            stop(!1);
            const sendDm = () => {
              main_getDoms(), test();
              const result = getSendText(settings.dmText.value),
                sendText = result.value;
              if (
                (sendOneDm(sendText),
                console.log("发送弹幕:", sendText),
                0 !== settings.runTime.value &&
                  (new Date().getTime() - info.data.startTime) / 1e3 / 60 >
                    settings.runTime.value)
              )
                return (
                  clearInterval(info.timerId),
                  settings.isCloseTips.value ||
                    GM_notification({
                      text: `已停止自动弹幕, 共运行${settings.runTime.value}分钟`,
                      timeout: 4500,
                    }),
                  console.log(
                    `已停止自动弹幕, 共运行${settings.runTime.value}分钟`
                  ),
                  -1
                );
              if (
                "order" === result.type &&
                info.data.curIndex + 1 === result.length
              ) {
                info.timerId && clearInterval(info.timerId);
                const t = 1e3 * getTime(settings.intervalTime.value);
                let pauseTime = 1e3 * getTime(settings.pauseTime.value);
                setTimeout(() => {
                  info.timerId = setInterval(sendDm, t);
                }, pauseTime);
              }
            };
            if (
              (settings.isCloseTips.value ||
                GM_notification({ text: "开始发送弹幕", timeout: 3500 }),
              (info.isStarted = !0),
              (info.data.startTime = new Date().getTime()),
              -1 !== sendDm())
            ) {
              const t = 1e3 * getTime(settings.intervalTime.value);
              info.timerId = setInterval(sendDm, t);
            }
          })();
    }),
      GM_registerMenuCommand("开启/关闭 自动回复", () => {
        info.isStartedReply
          ? (function replyStop() {
              (info.doms.textarea && info.doms.btn) || main_getDoms(),
                info.doms.textarea &&
                  info.doms.btn &&
                  (settings.isCloseTips.value ||
                    GM_notification({
                      text: "已关闭自动回复功能",
                      timeout: 3500,
                    }),
                  (info.isStartedReply = !1),
                  info.replyTimer && clearInterval(info.replyTimer));
            })()
          : autoReply();
      }),
      GM_registerMenuCommand("设置", () => {
        showSettings();
      });
  }
  function main() {
    for (const key in info.classList) {
      (info.curClassList = info.classList[key]),
        (info.dmDataset = info.curClassList.dmDataset);
      break;
    }
    getData(settings, GM_getValue, GM_setValue),
      main_getDoms(),
      setMenu(),
      (function main_bindEvents() {
        window.addEventListener(
          "dblclick",
          () => {
            settings.isDblclickStop.value && stop();
          },
          !0
        );
      })();
  }
  // "/" !== window.location.pathname &&
  //   setTimeout(() => {
  //     main();
  //   }, 1500);
  if ("/" !== window.location.pathname) {
    intervalLoopFunc({
      fn: main,
      breakFn: () => {
        const fn = (selectors) => {
          (selectors = selectors || info.curClassList),
            (info.doms.textarea = document.querySelector(selectors.textarea)),
            (info.doms.btn = document.querySelector(selectors.btn));
        };
        for (const key in info.classList) {
          const vClass = info.classList[key];
          fn(vClass);
          if ((info.doms.textarea && info.doms.btn)) {
            info.curClassList = vClass;
            info.dmDataset = vClass.dmDataset;
            break;
          }
        }
        if (info.doms.textarea && info.doms.btn) return true;
        return false;
      },
      num: 10,
      interval: 1000
    });
  }
})();