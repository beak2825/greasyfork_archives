// ==UserScript==
// @name          深色模式
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       1.3.1
// @author        Ling2Ling4
// @description   设置页面为深色模式, 可定时开关
// @license       AGPL-3.0-or-later
// @icon data:image/png;base64,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
// @match         *://*/*
// @run-at        document-start
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_notification
// @noframes
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/503000/%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/503000/%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(() => {
  "use strict";
  function verify_time1(newVal, oldVal, base) {
    const arr = newVal.trim().split(/:|：/);
    if (2 === arr.length && 2 === arr[0].length && 2 === arr[1].length) {
      const a = +arr[0],
        b = +arr[1];
      if (a >= 0 && a <= 24 && b >= 0 && b <= 59) return newVal;
    }
    return oldVal;
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
  const keyBase = "ll_pageDarkMode_",
    info = {
      keyBase,
      settingsArea: null,
      isDarkMode: !1,
      isCanRun: !0,
      timer: null,
      interval: 5e3,
      cssDom: null,
      btnHoverTxt: "点击切换深色模式",
      otherSettings: {
        oldDarkMode: {
          value: !1,
          base: !1,
          key: keyBase + "oldDarkMode",
          valType: "boolean",
        },
      },
      settings: {
        btnPosition: {
          value: !1,
          base: !1,
          key: keyBase + "btnPosition",
          groupTitle3: "按钮设置",
          desc: "模式切换按钮的位置",
          type: "基础设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "左下", false: "右下" },
        },
        isHiddenBtn: {
          value: !1,
          base: !1,
          key: keyBase + "isHiddenBtn",
          desc: "是否隐藏按钮, 隐藏后鼠标移入时会重新显示",
          type: "基础设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "隐藏", false: "显示" },
        },
        btnSize: {
          value: "30",
          base: "30",
          key: keyBase + "btnSize",
          desc: "按钮的大小",
          type: "基础设置",
          valType: "number",
          compType: "textarea",
          verify: getNumVerifyFn(20, 60),
        },
        isAutoStartStop: {
          value: !0,
          base: !0,
          key: keyBase + "isAutoStartStop",
          groupTitle3: "定时开关",
          desc: "是否开启定时开关功能",
          type: "基础设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "开启", false: "关闭" },
        },
        startTime: {
          value: "0",
          base: "0",
          key: keyBase + "startTime",
          valType: "string",
          type: "基础设置",
          desc: "深色模式的自动开启时间, 0表示关闭, 按照24小时制书写, 格式为 xx:xx, 如: 20:00",
          compType: "textarea",
          verify: (newVal, oldVal, base) =>
            0 == +newVal ? newVal : verify_time1(newVal, oldVal),
        },
        stopTime: {
          value: "0",
          base: "0",
          key: keyBase + "stopTime",
          valType: "string",
          type: "基础设置",
          desc: "深色模式的自动关闭时间, 0表示关闭, 按照24小时制书写",
          compType: "textarea",
          verify: (newVal, oldVal, base) =>
            0 == +newVal ? newVal : verify_time1(newVal, oldVal),
        },
        startStopWay: {
          value: !0,
          base: !0,
          key: keyBase + "startStopWay",
          desc: "定时开关深色模式的方式",
          type: "基础设置",
          valType: "boolean",
          compType: "radio",
          valueText: {
            true: "仅在设定时刻进行开关",
            false: "根据设定时间段任意时刻都可开关",
          },
        },
        isShowTips: {
          value: !0,
          base: !0,
          key: keyBase + "isShowTips",
          desc: "定时开关时是否进行弹窗提示",
          type: "基础设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "弹窗提示", false: "关闭弹窗" },
        },
        onlyColor: {
          value: !1,
          base: !1,
          key: keyBase + "onlyColor",
          desc: "深色模式下是否仅调整颜色而不使页面变成深色 (此时'颜色反转'设置将失效)",
          type: "颜色设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "自定义颜色", false: "深色+自定义颜色" },
        },
        invert: {
          value: 1,
          base: 1,
          key: keyBase + "invert",
          valType: "number",
          type: "颜色设置",
          title: "颜色反转",
          desc: "颜色反转的程度, 深色效果主要与该设置相关. 默认1, 浏览器默认0, 取值范围0-1",
          compType: "textarea",
          verify: getNumVerifyFn(0, 1),
        },
        brightness: {
          value: 0.9,
          base: 0.9,
          key: keyBase + "brightness",
          valType: "number",
          type: "颜色设置",
          title: "亮度",
          desc: "亮度的大小. 默认0.9, 浏览器默认1, 取值范围0-∞",
          compType: "textarea",
          verify: getNumVerifyFn(0, !1),
        },
        contrast: {
          value: 1,
          base: 1,
          key: keyBase + "contrast",
          valType: "number",
          type: "颜色设置",
          title: "对比度",
          desc: "对比度的强弱. 默认1, 取值范围0-∞",
          compType: "textarea",
          verify: getNumVerifyFn(0, !1),
        },
        grayscale: {
          value: 0,
          base: 0,
          key: keyBase + "grayscale",
          valType: "number",
          type: "颜色设置",
          title: "灰度",
          desc: "灰度的程度. 默认0, 取值范围0-1",
          compType: "textarea",
          verify: getNumVerifyFn(0, 1),
        },
        hueRotate: {
          value: 0,
          base: 0,
          key: keyBase + "hueRotate",
          valType: "number",
          type: "颜色设置",
          title: "色调",
          desc: "色调的旋转变化. 默认0, 取值范围0-360",
          compType: "textarea",
          verify: getNumVerifyFn(0, 360),
        },
        saturate: {
          value: 1,
          base: 1,
          key: keyBase + "saturate",
          valType: "number",
          type: "颜色设置",
          title: "饱和度",
          desc: "饱和度的高低. 默认1, 取值范围0-∞",
          compType: "textarea",
          verify: getNumVerifyFn(0, !1),
        },
        sepia: {
          value: 0.2,
          base: 0.2,
          key: keyBase + "sepia",
          valType: "number",
          type: "颜色设置",
          title: "深褐色",
          desc: "深褐色的程度. 默认0.2, 浏览器默认0, 取值范围0-1",
          compType: "textarea",
          verify: getNumVerifyFn(0, 1),
        },
        autoDarkMode: {
          value: !0,
          base: !0,
          key: keyBase + "autoDarkMode",
          desc: "'刷新页面/打开新页面'后是否自动恢复页面的深色模式",
          type: "其他设置",
          valType: "boolean",
          compType: "radio",
          valueText: { true: "自动恢复", false: "手动开关" },
          groupTitle3: "自动恢复",
        },
        autoDarkModeWay: {
          value: !0,
          base: !0,
          key: keyBase + "autoDarkModeWay",
          title: "自动恢复显示模式的方式",
          desc: "左选项: 可使同一时间段内打开的每个页面都是相同显示模式\n右选项: 可使同一个页面打开后是上一次该页面的显示模式",
          type: "其他设置",
          valType: "boolean",
          compType: "radio",
          valueText: {
            true: "恢复上一次使用的显示模式",
            false: "恢复当前网页上一次的显示模式",
          },
        },
        website: {
          value:
            "*www.baidu.com*\n*www.bilibili.com*\n*message.bilibili.com*\n*space.bilibili.com*\n*weibo.com*\n*www.zhihu.com*\n*www.douyin.com*",
          base: "*www.baidu.com*\n*www.bilibili.com*\n*message.bilibili.com*\n*space.bilibili.com*\n*weibo.com*\n*www.zhihu.com*\n*www.douyin.com*",
          key: keyBase + "website",
          valType: "string",
          type: "其他设置",
          title: "应用的网站",
          desc: "以下网站可启用深色模式, 支持*通配符, 多个网站请换行书写, 仅书写*表示所有网站都可启用\n【示例】*www.bilibili.com* 可匹配B站",
          compType: "textarea",
          compH: "110px",
        },
        onlyColorWebsite: {
          value: "",
          base: "",
          key: keyBase + "onlyColorWebsite",
          valType: "string",
          type: "其他设置",
          title: "不变为深色的网站",
          desc: '以下网站即使启用深色模式后也不会变为深色, 而是采用"自定义颜色"模式, 支持*通配符, 多个网站请换行书写',
          compType: "textarea",
          compH: "110px",
        },
        noneInvertNodes: {
          value:
            '// B站\n.h .h-inner, .h-inner .avatar-container, bili-user-profile, .bili-im .avatar, .owner .to-top, #bilibili-player [role="comment"],\n// 百度\n#content_left h3.t, .cr-content [class*="opr-toplist"], .cr-content [class*="tag-common"]',
          base: '// B站\n.h .h-inner, .h-inner .avatar-container, bili-user-profile, .bili-im .avatar, .owner .to-top, #bilibili-player [role="comment"],\n// 百度\n#content_left h3.t, .cr-content [class*="opr-toplist"], .cr-content [class*="tag-common"]',
          key: keyBase + "noneInvertNodes",
          valType: "string",
          type: "其他设置",
          title: "不反转的元素",
          desc: "不进行颜色反转的元素, 每项用 , 分隔, 可书写css选择器. 以//开头表示行注释\n【可选】\nh1, h2, h3, h4, p, span, ul, li, i, svg, a, img, input, textarea, button, select, option, label, audio, video, ....",
          compType: "textarea",
          compH: "110px",
          verify: (newVal) => {
            "," ===
              (newVal = newVal.trim().replaceAll("，", ","))[
                newVal.length - 1
              ] && (newVal = newVal.slice(0, -1));
            return newVal
              .split("\n")
              .map((item, i) => {
                const t = item;
                return (
                  (item = item.trim()),
                  0 === i
                    ? "/" === item[0] && "/" === item[1]
                      ? item
                      : t
                    : "/" === item[0] && "/" === item[1]
                    ? ",\n" + item
                    : "\n" + t
                );
              })
              .join("")
              .replaceAll(", ,", ",")
              .replaceAll(",,", ",");
          },
        },
      },
    };
  function getCssHtml(isDark) {
    const settings = info.settings,
      r = parseInt(settings.btnSize.value / 5),
      btnCss = `#${info.keyBase}btn{\nbackground:#ffffff;padding:${
        r - 2
      }px;border-radius:${r}px;position:fixed;${
        settings.btnPosition.value ? "left" : "right"
      }:-${
        settings.btnSize.value / 2
      }px;bottom:20px;z-index:1000;transition:ease 0.3s all,ease 0.5s 2s opacity;cursor:pointer;box-sizing:border-box;\n${
        settings.isHiddenBtn.value ? "opacity:0" : ""
      }}\n#${info.keyBase}btn.dark{background:#ababab}\n#${
        info.keyBase
      }btn:hover {${
        settings.btnPosition.value ? "left:0" : "right:0"
      };bottom:20px;\n${
        settings.isHiddenBtn.value
          ? "transition:ease 0.3s opacity;opacity:1"
          : ""
      }\n}\n      #${info.keyBase}btn svg{display:block;fill:#addeee}\n      #${
        info.keyBase
      }btn.dark svg{fill:#ffffff}`;
    if (!isDark) return btnCss;
    const onlyColorflag =
        verifyWebsite(settings.onlyColorWebsite.value) ||
        settings.onlyColor.value,
      invertText = onlyColorflag ? "" : `invert(${settings.invert.value})`,
      selectorArr = settings.noneInvertNodes.value
        .split("\n")
        .filter((item) => "/" !== (item = item.trim())[0] && "/" !== item[1]),
      nonoFilter = onlyColorflag
        ? ""
        : 'img,video,input,iframe,canvas,object,svg image,\n[style*="background:url"],\n[style*="background: url"],\n[style*="background-image:url"],\n[style*="background-image: url"],\n[background]{filter:invert(1)}',
      otherCss = onlyColorflag
        ? ""
        : `${selectorArr.join("")}{filter:invert(1)}`;
    return `html {\nbackground-color:#fff;\nfilter:${invertText} brightness(${settings.brightness.value}) contrast(${settings.contrast.value}) grayscale(${settings.grayscale.value}) hue-rotate(${settings.hueRotate.value}deg) saturate(${settings.saturate.value}) sepia(${settings.sepia.value});\n}\n${nonoFilter}${otherCss}${btnCss}`;
  }
  function matchUrlWithWildcard(url, pattern) {
    return new RegExp("^" + pattern.replace(/\*/g, ".*") + "$").test(url);
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
    (getVal = getVal || localStorage.getItem),
      (setVal = setVal || localStorage.setItem);
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
  function setDarkMode(isDark = !0, modeTxt = "") {
    if (
      (((isDark) => {
        let dom = info.cssDom,
          isAdd = !1;
        if (!dom) {
          const id = info.keyBase + "css";
          (dom = document.head.querySelector("#" + id)),
            dom ||
              ((dom = document.createElement("style")),
              (dom.id = id),
              (info.cssDom = dom),
              (isAdd = !0));
        }
        dom.isDark !== isDark &&
          ((dom.innerHTML = getCssHtml(isDark)),
          (info.isDarkMode = isDark),
          (dom.isDark = isDark),
          isAdd && document.head.appendChild(dom));
      })(isDark),
      document.body)
    )
      document.body.appendChild(info.cssDom);
    else {
      const bodyObserver = new MutationObserver(() => {
        document.body &&
          (bodyObserver.disconnect(), document.body.appendChild(info.cssDom));
      });
      bodyObserver.observe(document, { childList: !0, subtree: !0 });
    }
    let logText, txt1;
    txt1 = isDark ? "开启" : "关闭";
    const settings = info.settings;
    modeTxt ||
      (settings.onlyColor.value &&
        (modeTxt = `'${settings.onlyColor.valueText.true}'模式`),
      verifyWebsite(settings.onlyColorWebsite.value) &&
        (modeTxt = `'${settings.onlyColor.valueText.true}'模式`)),
      (logText = `${txt1}${(modeTxt = modeTxt || "深色模式")}`),
      console.log(logText),
      setValue_setValue({
        value: isDark,
        base: info.otherSettings.oldDarkMode.base,
        key: info.otherSettings.oldDarkMode.key,
        getValue: GM_getValue,
        setValue: GM_setValue,
      }),
      setValue_setValue({
        value: isDark,
        base: info.otherSettings.oldDarkMode.base,
        key: info.otherSettings.oldDarkMode.key,
      });
  }
  function setStartStopTimer() {
    const settings = info.settings;
    if (!settings.isAutoStartStop.value) return;
    const startTime = settings.startTime.value,
      stopTime = settings.stopTime.value;
    if (0 == +startTime && 0 == +stopTime) return;
    const autoStartStop = () => {
      const f = (function isNeedDarkMode() {
        const settings = info.settings,
          startTime = settings.startTime.value,
          stopTime = settings.stopTime.value;
        if (0 == +startTime && 0 == +stopTime) return -1;
        const t = new Date(),
          curT = 60 * t.getHours() + t.getMinutes();
        let startT, stopT;
        if (0 != +startTime) {
          const tArr1 = startTime.trim().replace("：", ":").split(":");
          startT = 60 * +tArr1[0] + +tArr1[1];
        }
        if (0 != +stopTime) {
          const tArr2 = stopTime.trim().replace("：", ":").split(":");
          stopT = 60 * +tArr2[0] + +tArr2[1];
        }
        if (settings.startStopWay.value)
          return curT === startT || (curT !== stopT && -1);
        if (0 == +startTime) return !(curT >= stopT) && -1;
        if (0 == +stopTime) return curT >= startT || -1;
        const f = (function isTimeInRange(t, startTime, stopTime, rangeLimit) {
          const curH = t.getHours(),
            curMin = t.getMinutes(),
            startText = startTime.trim().replace("：", ":"),
            stopText = stopTime.trim().replace("：", ":"),
            tArr1 = startText.split(":"),
            tArr2 = stopText.split(":"),
            h1 = +tArr1[0],
            h2 = +tArr2[0],
            startT = 60 * h1 + +tArr1[1],
            stopT = 60 * h2 + +tArr2[1],
            curT = 60 * curH + curMin;
          if (startT < stopT)
            if (rangeLimit[0]) {
              if (rangeLimit[1]) {
                if (curT >= startT && curT <= stopT) return !0;
              } else if (curT >= startT && curT < stopT) return !0;
            } else if (rangeLimit[1]) {
              if (curT > startT && curT <= stopT) return !0;
            } else if (curT > startT && curT < stopT) return !0;
          if (startT > stopT)
            if (rangeLimit[0]) {
              if (rangeLimit[1]) {
                if (
                  (curT >= startT && curT < 1440) ||
                  (curT <= stopT && curT >= 0)
                )
                  return !0;
              } else if (
                (curT >= startT && curT < 1440) ||
                (curT < stopT && curT >= 0)
              )
                return !0;
            } else if (rangeLimit[1]) {
              if (
                (curT > startT && curT < 1440) ||
                (curT <= stopT && curT >= 0)
              )
                return !0;
            } else if (
              (curT > startT && curT < 1440) ||
              (curT < stopT && curT >= 0)
            )
              return !0;
          return !1;
        })(t, startTime, stopTime, [1, 0]);
        return f;
      })();
      -1 !== f &&
        (settings.isShowTips.value &&
          GM_notification({
            title: "深色模式",
            text: `定时${f ? "开启" : "关闭"}深色模式`,
            timeout: 3e3,
          }),
        setDarkMode(f));
    };
    autoStartStop(),
      info.timer && clearInterval(info.timer),
      (info.timer = setInterval(autoStartStop, info.interval));
  }
  function verifyWebsite(websiteText, url) {
    if (!websiteText) return !1;
    url = url || location.href;
    return websiteText
      .trim()
      .split("\n")
      .some((item) => matchUrlWithWildcard(url, item));
  }
  function updateShow() {
    getData(info.settings, GM_getValue, GM_setValue),
      info.cssDom
        ? (info.cssDom.innerHTML = getCssHtml(info.isDarkMode))
        : info.isDarkMode
        ? (setDarkMode(!1), setDarkMode(!0))
        : setDarkMode(!1),
      createDarkModeBtn(),
      setStartStopTimer();
  }
  function createDarkModeBtn() {
    const settings = info.settings;
    if (info.modeBtn) {
      const btn = info.modeBtn;
      return (
        (btn.style.width = settings.btnSize.value + "px"),
        (btn.style.height = settings.btnSize.value + "px"),
        void (info.isDarkMode
          ? btn.classList.add("dark")
          : btn.classList.remove("dark"))
      );
    }
    const html = `<div id="${info.keyBase}btn" style="width:${
      settings.btnSize.value
    }px;height:${settings.btnSize.value}px" title="${
      info.btnHoverTxt
    }" class="${
      info.isDarkMode ? "dark" : ""
    }">\n  <svg t="1723482089223" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6752"><path d="M505.565962 845.481164c-14.545274 0-26.317389 11.770068-26.317389 26.316366l0 61.937654c0 14.546298 11.771091 26.316366 26.317389 26.316366 14.520715 0 26.317389-11.770068 26.317389-26.316366l0-61.937654C531.883351 857.251232 520.086677 845.481164 505.565962 845.481164z" p-id="6753"></path><path d="M735.426117 803.899116c-7.248078-12.595876-23.362081-16.936741-35.929304-9.611915-12.591783 7.247054-16.909112 23.334451-9.611915 35.925211l30.969339 53.635571c4.856611 8.458649 13.697977 13.160741 22.795169 13.160741 4.471848 0 8.994861-1.1328 13.157671-3.523243 12.593829-7.270591 16.884552-23.38664 9.612938-35.953863L735.426117 803.899116z" p-id="6754"></path><path d="M931.462932 674.318876l-53.66013-30.994921c-12.567223-7.29515-28.680203-2.979868-35.927257 9.613962-7.272637 12.593829-2.981914 28.682249 9.611915 35.953863l53.661154 30.969339c4.111644 2.416026 8.634658 3.545756 13.107529 3.545756 9.097192 0 17.937534-4.726651 22.820752-13.156648C948.348508 697.653327 944.057785 681.56593 931.462932 674.318876z" p-id="6755"></path><path d="M306.006927 794.288225c-12.567223-7.353478-28.705785-2.983961-35.953863 9.611915l-30.968315 53.633524c-7.272637 12.567223-2.955308 28.682249 9.636474 35.953863 4.112668 2.390443 8.635681 3.523243 13.107529 3.523243 9.098215 0 17.939581-4.703115 22.821775-13.160741l30.993898-53.635571C322.89148 817.621653 318.59871 801.535279 306.006927 794.288225z" p-id="6756"></path><path d="M127.675356 643.323954l-53.609988 30.994921C61.472562 681.56593 57.155233 697.653327 64.42787 710.249203c4.857635 8.429996 13.696953 13.156648 22.795169 13.156648 4.471848 0 8.995885-1.12973 13.158694-3.545756l53.609988-30.969339c12.591783-7.270591 16.909112-23.360034 9.636474-35.953863C156.355559 640.344087 140.268162 636.028804 127.675356 643.323954z" p-id="6757"></path><path d="M932.954913 63.947428 90.024851 63.947428c-14.520715 0-26.315342 11.796674-26.315342 26.317389 0 14.546298 11.794627 26.316366 26.315342 26.316366L425.177074 116.581182l0.051165 107.373473c-96.322789 35.773761-162.089655 128.910998-162.089655 232.943376 0 136.955208 111.409392 248.364601 248.337995 248.364601 136.955208 0 248.363577-111.408369 248.363577-248.364601 0-49.085952-14.314007-96.578616-41.377386-137.288806-8.017604-12.07706-24.364921-15.366989-36.494169-7.349385-12.103666 8.070816-15.393595 24.388457-7.350408 36.494169 21.330818 32.04688 32.587186 69.440535 32.587186 108.144022 0 107.939361-87.789439 195.729823-195.7288 195.729823-107.913778 0-195.704241-87.790462-195.704241-195.729823 0-87.123266 58.492182-164.5548 142.247748-188.328249 10.743692-3.03308 18.401092-12.516058 19.069311-23.64349l0.61603-128.34511 455.248462 0c14.546298 0 26.316366-11.770068 26.316366-26.316366C959.271278 75.744101 947.50121 63.947428 932.954913 63.947428z" p-id="6758"></path></svg>\n</div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    const btn = document.body.querySelector(`#${info.keyBase}btn`);
    (info.modeBtn = btn),
      btn.addEventListener("click", () => {
        btn.classList.toggle("dark");
        setDarkMode(btn.classList.contains("dark"));
      });
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
        resetTt: "重置所有设置为默认值",
        isShowMenu: !1,
        isScrollStyle: !0,
        isResetBtn: !0,
        isOnlyResetCurPage: !1,
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
  function saveDatas({
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
    saveDatas({ allData, settings, keyBase, verifyFn, getValue, setValue }),
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
      param: {
        bg: "rgba(0, 0, 0, 0)",
        resetTt: "重置当前页的所有设置为默认值",
        isOnlyResetCurPage: !0,
        isIntervalRun: !0,
      },
      oldEditCfg: info.settingsArea,
      updateDataFn: () => getData(settings, GM_getValue, GM_setValue),
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
            callback: updateShow,
            getValue: GM_getValue,
            setValue: GM_setValue,
          });
        const f1 = verifyWebsite(
            oldData[settings.website.type][
              settings.website.key.repeat(info.keyBase, "")
            ]
          ),
          f2 = verifyWebsite(settings.website.value);
        if (f1 && !f2)
          return (
            setDarkMode(!1),
            info.modeBtn && info.modeBtn.remove(),
            void (info.timer && clearInterval(info.timer))
          );
        !f1 && f2 && (setStartStopTimer(), createDarkModeBtn());
      },
      interval: (data, oldData) => {
        finishedSettings({
          allData: data,
          settings,
          keyBase: info.keyBase,
          verifyFn: settings,
          callback: updateShow,
          getValue: GM_getValue,
          setValue: GM_setValue,
        });
      },
      cancelled: (data, oldData) => {
        saveDatas({
          allData: oldData,
          settings,
          keyBase: info.keyBase,
          verifyFn: settings,
          getValue: GM_getValue,
          setValue: GM_setValue,
        }),
          getData(settings, GM_getValue, GM_setValue),
          updateShow();
      },
    });
  }
  const settings = info.settings;
  function page_darkMode_bindEvents() {
    const urlChangeHandle = () => {
      const id = info.keyBase + "css",
        dom = document.body.querySelector("#" + id);
      (dom && dom.isDark) || (info.isDarkMode = !1);
    };
    let _wr = function (type) {
      let orig = history[type];
      return function () {
        let rv = orig.apply(this, arguments),
          e = new Event(type);
        return (e.arguments = arguments), window.dispatchEvent(e), rv;
      };
    };
    (history.pushState = _wr("pushState")),
      (history.replaceState = _wr("replaceState")),
      window.addEventListener("popstate", urlChangeHandle),
      window.addEventListener("replaceState", urlChangeHandle),
      window.addEventListener("pushState", urlChangeHandle);
  }
  !(function main() {
    if (
      (getData(settings, GM_getValue, GM_setValue),
      (function getOtherData() {
        const settings = info.otherSettings,
          autoWay = info.settings.autoDarkModeWay.value;
        for (const valName in settings) {
          const setting = settings[valName];
          setting.value = getValue({
            base: setting.base,
            key: setting.key,
            valType: setting.valType,
            getVal: autoWay ? GM_getValue : null,
            setVal: autoWay ? GM_setValue : null,
          });
        }
      })(),
      (function registerMenu(f) {
        let urlTxt = "*" + location.host + "*";
        verifyWebsite(settings.website.value)
          ? GM_registerMenuCommand("当前网站: 已启用✔️", () => {
              const urlList = settings.website.value.trim().split("\n"),
                i = urlList.indexOf("*");
              -1 !== i && urlList.splice(i, 1);
              let index = urlList.indexOf(urlTxt);
              -1 !== index
                ? urlList.splice(index, 1)
                : urlList
                    .filter((item) => matchUrlWithWildcard(location.href, item))
                    .map((item) => urlList.indexOf(item))
                    .forEach((item) => {
                      let i = urlList.indexOf(item);
                      urlList.splice(i, 1);
                    });
              const urlListTxt = urlList.join("\n");
              GM_setValue(settings.website.key, urlListTxt), history.go(0);
            })
          : GM_registerMenuCommand("当前网站: 已禁用❌", () => {
              const urlList = settings.website.value.trim().split("\n"),
                i = urlList.indexOf("*");
              -1 !== i && urlList.splice(i, 1), urlList.push(urlTxt);
              const urlListTxt = Array.from(new Set(urlList)).join("\n");
              GM_setValue(settings.website.key, urlListTxt), history.go(0);
            }),
          GM_registerMenuCommand("设置", () => {
            showSettings();
          });
      })(),
      verifyWebsite(settings.website.value))
    )
      if (
        (settings.autoDarkMode.value
          ? info.otherSettings.oldDarkMode.value && setDarkMode(!0)
          : (setValue_setValue({
              value: !1,
              base: !1,
              key: info.keyBase + "oldDarkMode",
            }),
            setValue_setValue({
              value: !1,
              base: !1,
              key: info.keyBase + "oldDarkMode",
              getValue: GM_getValue,
              setValue: GM_setValue,
            })),
        setDarkMode(info.isDarkMode),
        document.body)
      )
        setStartStopTimer(), createDarkModeBtn(), page_darkMode_bindEvents();
      else {
        const bodyObserver = new MutationObserver(() => {
          document.body &&
            (bodyObserver.disconnect(),
            setStartStopTimer(),
            createDarkModeBtn(),
            page_darkMode_bindEvents());
        });
        bodyObserver.observe(document, { childList: !0, subtree: !0 });
      }
  })();
})();