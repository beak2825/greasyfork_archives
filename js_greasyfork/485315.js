// ==UserScript==
// @name          哔哩哔哩新版首页排版调整和去广告(bilibili)
// @namespace     http://tampermonkey.net/
// @version       1.9.1
// @author        Ling2Ling4
// @description   对新版B站首页的每行显示的视频数量进行调整, 同时删除所有广告, 并可设置屏蔽内容 (大尺寸屏幕每行将显示更多的视频)
// @license MIT
// @icon data:image/png;base64,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
// @match         *://www.bilibili.com/*
// @exclude       *://www.bilibili.com/all*
// @exclude       *://www.bilibili.com/anime*
// @exclude       *://www.bilibili.com/pgc*
// @exclude       *://t.bilibili.com/*
// @exclude       *://www.bilibili.com/opus*
// @exclude       *://www.bilibili.com/live*
// @exclude       *://www.bilibili.com/article*
// @exclude       *://www.bilibili.com/upuser*
// @exclude       *://www.bilibili.com/match*
// @exclude       *://www.bilibili.com/platform*
// @exclude       *://www.bilibili.com/bangumi*
// @exclude       *://www.bilibili.com/cheese*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         window.onurlchange
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/485315/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E6%8E%92%E7%89%88%E8%B0%83%E6%95%B4%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%28bilibili%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485315/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E6%8E%92%E7%89%88%E8%B0%83%E6%95%B4%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%28bilibili%29.meta.js
// ==/UserScript==

(() => {
  "use strict";
  const info = {
      scriptUrl:
        "https://greasyfork.org/zh-CN/users/1196880-ling2ling4#user-script-list",
      apiUrl:
        "https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd",
      logoUrl:
        "https://i0.hdslb.com/bfs/archive/c8fd97a40bf79f03e7b76cbc87236f612caef7b2.png",
      imgDetails: "@672w_378h_1c_!web-home-common-cover",
      loadVideoNum: 10,
      marginTop1: 24,
      marginTop2: 24,
      clickMinInterval: 200,
      testNetInterval: 4,
      netSpeed: { value: 0, lastValue: 0 },
      baseNetSpeed: 65,
      refreshLoopFnInfo: {
        interval: 40,
        svgNum: 12,
        rollNum: 20,
        rollNum2: 20,
        addNumMultiple: 0.8,
        maxAddNum: 25,
      },
      isRemoveDelDom: !1,
      isScriptRefresh: !1,
      pageName: "",
      keyBase: "setting_",
      zoom: window.devicePixelRatio,
      homeClassList: {
        标题: "h3 a",
        作者: "bili-video-card__info--bottom",
        分类: "floor-title",
        author: "bili-video-card__info--author",
        carousel: "recommended-swipe",
        vDom: ["container", "no-banner-container", "is-version8"],
        video: "feed-card",
        nav: "bili-header__bar",
        banner: "bili-header__banner",
        btn: "roll-btn",
        btn2: "flexible-roll-btn",
        specialCard: "floor-single-card",
        addVideo: "add-video",
        delUpBtn: "ll-del-up-btn",
      },
      homeDelClassList: {
        广告: "bili-video-card__info--ad",
        推广: "bili-video-card__info--creative-ad",
        特殊: "floor-single-card",
        直播: "living",
        番剧: "分类=番剧",
        综艺: "分类=综艺",
        课堂: "分类=课堂",
        漫画: "分类=漫画",
        国创: "分类=国创",
        电影: "分类=电影",
        纪录片: "分类=纪录片",
        电视剧: "分类=电视剧",
      },
      iconSvg: {
        blacklist:
          '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1704699843965" style="svgStyleFlag" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="941" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512.090917 1024a512 512 0 1 1 512.090917-512 512.045459 512.045459 0 0 1-512.090917 512zM91.599041 511.249933a419.446329 419.446329 0 0 0 682.083282 327.301785L184.107254 248.931191a417.400693 417.400693 0 0 0-92.417296 262.296013zM511.295392 91.6445a417.627985 417.627985 0 0 0-261.386842 91.599041l589.393235 589.256859A419.287224 419.287224 0 0 0 511.386309 91.62177z" p-id="942"></path></svg>',
      },
      txt: { delUpBtnTT: "屏蔽该up的所有视频, 屏蔽后可在插件的屏蔽设置中修改" },
      events: { rollSvg: !1, roll: !1, roll2: !1, resize: !1, wheel: !1 },
      btnDoms: {},
      errKeyArr: ["", 2, 3],
      errKeyInfo: {
        disNum: "setting_err_disNum",
        errNum: "setting_err_num",
        errTime: "setting_err_time",
        isTip: "setting_err_isTip",
      },
      disErrTipNum: 3,
      errTipNum: 15,
      errTipInterval: 2,
      errNumReset: 5,
      videoInfo: {
        startTime: 500,
        pathInterval: 500,
        interval: 1e3,
        timeoutNum: 8,
        delDom: [
          {
            name: "几乎全部广告",
            pre: ".",
            str: "ad-report",
            type: "ad",
            isAll: !0,
          },
          { name: "横幅广告", pre: "#", str: "bannerAd" },
          { name: "活动广告", pre: "#", str: "slide_ad", type: "ad" },
          { name: "视频广告", pre: ".", str: "video-card-ad-small" },
          { name: "右下广告", pre: "#", str: "right-bottom-banner" },
          { name: "横幅通告", pre: ".", str: "reply-notice", type: "ad" },
          {
            name: "游戏推荐",
            pre: ".",
            str: "video-page-game-card-small",
            type: "other",
          },
          { name: "活动推广", pre: "#", str: "activity_vote", type: "other" },
          {
            name: "直播推广",
            pre: ".",
            str: "pop-live-small-mode",
            type: "other",
          },
        ],
      },
    },
    keyBase = info.keyBase,
    settings = {
      isCarousel: {
        value: !0,
        base: !0,
        key: keyBase + "isCarousel",
        txt: "是否显示轮播图 (修改后需要调整排列规则才能达到预期效果,轮播图占两个视频的宽度,所以每行显示视频数加减2即可)",
        type: "基础设置",
        valType: "boolean",
        compType: "radio",
        valueText: { true: "显示轮播图", false: "隐藏轮播图" },
      },
      isRefreshLast: {
        value: !1,
        base: !1,
        key: keyBase + "isRefreshLast",
        txt: '是否在刷新视频时刷新掉最后的"直播"类视频 (新视频为普通视频)',
        type: "基础设置",
        valType: "boolean",
        compType: "radio",
        valueText: {
          true: "刷新掉'直播'类视频",
          false: "保留末尾的'直播'类视频",
        },
      },
      isAutoLayout: {
        value: !0,
        base: !0,
        key: keyBase + "isAutoLayout",
        txt: "是否根据缩放自动调整视频布局",
        type: "基础设置",
        valType: "boolean",
        compType: "radio",
        valueText: {
          true: "缩放时自动调整布局",
          false: "仅窗口变化时调整布局",
        },
      },
      isLoadOne: {
        value: !0,
        base: !0,
        key: keyBase + "isLoadOne",
        txt: "是否在进入网站时加载前三行的全部视频, 开启后前三行将不会出现预加载视频",
        type: "基础设置",
        valType: "boolean",
        compType: "radio",
        valueText: {
          true: "加载视口的全部视频",
          false: "保留视口的预加载视频",
        },
      },
      isDelUpBtn: {
        value: !0,
        base: !0,
        key: keyBase + "isDelUpBtn",
        txt: "是否在鼠标移入一个视频区域时显示屏蔽该up所有视频的按钮",
        type: "基础设置",
        valType: "boolean",
        compType: "radio",
        valueText: { true: "显示屏蔽up的按钮", false: "不显示屏蔽up的按钮" },
      },
      isReorderVideo: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "isReorderVideo",
        txt: "是否按照排列规则调整布局 (每行能够显示更多视频)",
        type: "排列规则",
        compType: "radio",
        valueText: {
          true: "按照排列规则调整布局",
          false: "使用原来的视频排列",
        },
      },
      videoNumRule: {
        title: "排列规则",
        value: "0,1300,2\n1300,1800,3\n1800,3000,4\n3000,3700,5\n3700,6300,6",
        base: "0,1300,2\n1300,1800,3\n1800,3000,4\n3000,3700,5\n3700,6300,6",
        base2: "0,1300,4\n1300,1800,5\n1800,3000,6\n3000,3700,7\n3700,6300,8",
        key: keyBase + "videoNumRule",
        txt: "视频排列规则, 每条规则用 ; 分隔 或 换行书写. 未包含的尺寸将按照初始方式排列 (轮播图会影响视频的排列)\n示例: 1300,1800,3; 1800,3000,4 表示浏览器宽度在1300~1800像素时每行显示3个视频(前两行), 1800~3000像素每行4个视频",
        type: "排列规则",
        valType: "string",
        compType: "textarea",
        compH: "120px",
      },
      delClassArr: {
        value: "广告, 推广",
        base: "广告, 推广",
        key: keyBase + "delClassArr",
        txt: "屏蔽设置, 可根据需要自行修改, 可自定义, 每项用 , 分隔 或 换行书写\n例如: 广告, 推广, 直播, 作者==零泠丶\n----可选: ('特殊'包含了直播 番剧 课堂...)\n广告、推广、特殊、直播、番剧、综艺、课堂、漫画、国创、电影、纪录片、电视剧\n----自定义:\n1. 标题=xxx, 可屏蔽标题含xxx的视频, xxx部分支持&&运算符, 如: 标题=A&&B, 表示屏蔽标题同时含有A B内容的视频\n2. 作者=xxx, 可屏蔽作者名和发布日期中含xxx的视频, 若书写为\"作者==xxx\"则表示屏蔽作者xxx的视频",
        type: "屏蔽设置",
        valType: "string",
        compType: "textarea",
        compH: "100px",
      },
      isClearAd: {
        value: !0,
        base: !0,
        key: keyBase + "isClearAd",
        txt: "是否删除广告, 若不删除则会将所有广告移至视频列表的最后",
        type: "其他设置",
        valType: "boolean",
        compType: "radio",
        valueText: { true: "删除广告", false: "广告后移" },
      },
      isTrueEnd: {
        value: !1,
        base: !1,
        key: keyBase + "isTrueEnd",
        txt: "是否将广告移至预加载视频的后面, 关闭后广告将放置在预加载视频的前面 一般视频的后面 (仅在不删除广告时生效)",
        type: "其他设置",
        valType: "boolean",
        compType: "radio",
        valueText: { true: "放置页尾", false: "放置预加载视频前" },
      },
      isTestNetSpeed: {
        value: !0,
        base: !0,
        key: keyBase + "isTestNetSpeed",
        txt: "是否检测网速, 并根据网速调整'判断是否采用脚本刷新全部视频'的最大间隔时间 ",
        type: "其他设置",
        valType: "boolean",
        compType: "radio",
        valueText: { true: "测试网速", false: "不测试网速" },
      },
      addVideoNum: {
        value: 0,
        base: 0,
        valType: "number",
        key: keyBase + "addVideoNum",
        txt: "加载用于填充视口空白视频的视频数量, 0表示自动计算数量 (自动计算时可能会因为屏蔽了部分视频导致视口区域还留有空白视频)",
        type: "其他设置",
        compType: "textarea",
        compH: "30px",
      },
      homeDelAdTime: {
        value: 0,
        base: 0,
        valType: "number",
        key: keyBase + "homeDelAdTime",
        txt: "点击换一换按钮并加载完新视频后 进行广告屏蔽的间隔时间, 0表示立即屏蔽 (毫秒, 1秒=1000毫秒)",
        type: "其他设置",
        compType: "textarea",
        compH: "30px",
      },
      video_isDelAd: {
        value: !0,
        base: !0,
        key: keyBase + "video_isDelAd",
        txt: "是否删除视频页的广告",
        type: "视频页",
        valType: "boolean",
        compType: "radio",
        valueText: { true: "删除广告", false: "保留广告" },
      },
      video_delSetting: {
        title: "广告屏蔽设置",
        value: "部分广告",
        base: "部分广告",
        key: keyBase + "video_delSetting",
        txt: "可根据需要自行修改, 每项用 , 分隔 (该设置仅在删除广告时生效)\n例如: 部分广告, 活动推广\n----可选:\n全部广告: 所有直接广告和间接广告\n部分广告: 所有直接广告 (横幅广告,活动广告,视频广告,右下广告,横幅通告)\n横幅广告: 视频下方的横幅广告\n活动广告: 右侧视频列表上方的广告\n视频广告: 右侧视频列表上方的小视频广告\n右下广告: 右侧视频列表下方的广告\n横幅通告: 评论区上方的横幅通告\n游戏推荐: 视频右侧的视频的相关游戏推荐\n活动推广: 评论区上方的活动推广\n直播推广: 右侧视频列表下方的直播推广",
        type: "视频页",
        valType: "string",
        compType: "textarea",
        compH: "30px",
      },
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
  }
  const utils = {
      getW(isAutoLayout) {
        let width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        return (
          console.log("浏览器实际宽度:", width * window.devicePixelRatio),
          console.log("浏览器像素宽度:", width * info.zoom),
          !isAutoLayout && (width *= window.devicePixelRatio),
          width
        );
      },
      getValue(key, defa = null) {
        let value = GM_getValue(key);
        return null == value ? defa : value;
      },
      boolTxt: (val) => (val ? "是 (确定)" : "否 (取消)"),
      strToDom(str) {
        let tmpDom = document.createElement("div");
        tmpDom.innerHTML = str;
        const dom = tmpDom.children[0];
        return (tmpDom = null), dom;
      },
      formatDate(
        timestamp,
        { delimiter = "-", isYear = !1, isAlign = !0 } = {}
      ) {
        if (!timestamp) return -1;
        const date = new Date(timestamp),
          year = date.getFullYear();
        let month = (date.getMonth() + 1).toString(),
          day = date.getDate().toString();
        return (
          isAlign &&
            ((month = month.padStart(2, "0")), (day = day.padStart(2, "0"))),
          (isYear ? year + delimiter : "") + month + delimiter + day
        );
      },
      formatTime(time, { delimiter = ":", isAlign = !0 } = {}) {
        if (!time) return -1;
        let h = Math.floor(time / 60 / 60),
          m = Math.floor((time / 60) % 60),
          s = Math.floor(time % 60);
        return (
          isAlign &&
            ((h = h ? h.toString().padStart(2, "0") : ""),
            (m = m.toString().padStart(2, "0")),
            (s = s.toString().padStart(2, "0"))),
          (h ? h + delimiter : "") + m + delimiter + s
        );
      },
      async request(url, options = {}) {
        options.method = options.method || "GET";
        try {
          const res = await fetch(url, options);
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return await res.json();
        } catch (error) {
          throw error;
        }
      },
      errHandle({ e = null, errTxt = "", logTxt = "", key = "" } = {}) {
        key && (key = "_" + key);
        let errNum = GM_getValue(info.errKeyInfo.errNum) || 0;
        if (errNum >= info.errTipNum) return;
        let disErrNum = GM_getValue(info.errKeyInfo.disNum + key) || 0;
        const curTime = Date.now();
        let disS =
          (curTime - (GM_getValue(info.errKeyInfo.errTime + key) || curTime)) /
          1e3;
        if (((disS = 0 === disS ? 5 : disS), disS < 5)) return;
        let flag = GM_getValue(info.errKeyInfo.isTip + key);
        (flag = void 0 === flag || flag),
          e && console.log(e),
          console.log(logTxt || errTxt),
          disS >= 60 * info.errTipInterval * 60 &&
            ((flag = !0),
            GM_setValue(info.errKeyInfo.isTip + key, !0),
            GM_setValue(info.errKeyInfo.disNum + key, 0)),
          flag &&
            disErrNum <= info.disErrTipNum &&
            disS < (info.errTipInterval / 10) * 60 * 60 &&
            (errNum++,
            disErrNum++,
            GM_setValue(info.errKeyInfo.errNum, errNum),
            GM_setValue(info.errKeyInfo.disNum + key, disErrNum),
            GM_setValue(info.errKeyInfo.errTime + key, curTime),
            alert(errTxt),
            disErrNum === info.disErrTipNum &&
              GM_setValue(info.errKeyInfo.isTip + key, !1));
      },
      resetErrInfo() {
        const curTime = Date.now();
        (curTime -
          info.errKeyArr.reduce((a, b) => {
            const t = +GM_getValue(info.errKeyInfo.errTime + b);
            return t < a ? t : a;
          }, curTime)) /
          1e3 >=
          24 * info.errNumReset * 60 * 60 &&
          (GM_setValue(info.errKeyInfo.errNum, 0),
          info.errKeyArr.forEach((key) => {
            key && (key = "_" + key),
              GM_setValue(info.errKeyInfo.disNum + key, 0);
          }));
      },
    },
    videoObj = {
      info: {
        isDelAd: null,
        delSetting: null,
        base_isDelAd: null,
        base_delSetting: null,
        startTime: info.videoInfo.startTime,
        pathInterval: info.videoInfo.pathInterval,
        interval: info.videoInfo.interval,
        timeoutNum: info.videoInfo.timeoutNum,
      },
      doms: { ad: [] },
      delDom: info.videoInfo.delDom,
      initValue() {
        (this.info.isDelAd = settings.video_isDelAd.value),
          (this.info.delSetting = settings.video_delSetting.value),
          (this.info.base_isDelAd = settings.video_isDelAd.base),
          (this.info.base_delSetting = settings.video_delSetting.base);
      },
      getAdInfo() {
        if (this.info.delSetting.includes("全部广告"))
          return this.delDom.filter(
            (item) => "ad" === item.type || "other" === item.type
          );
        if ("部分广告" === this.info.delSetting)
          return this.delDom.filter(
            (item) => "ad" === item.type || "other" !== item.type
          );
        {
          let arr = this.delDom.filter((item) =>
            this.info.delSetting.includes(item.name)
          );
          if (this.info.delSetting.includes("部分广告")) {
            const arr2 = this.delDom.filter((item) => {
              if (!arr.includes(item))
                return "ad" === item.type || "other" !== item.type;
            });
            arr = arr.concat(arr2);
          }
          return 0 === arr.length
            ? (utils.errHandle({
                errTxt: `插件设置的广告屏蔽设置中 '${GM_getValue(
                  "setting_video_delSetting"
                )}' 格式书写错误`,
                key: info.errKeyArr[2],
              }),
              -1)
            : arr;
        }
      },
      getAd() {
        const ad = [],
          delAdInfo = this.getAdInfo();
        -1 !== delAdInfo
          ? (delAdInfo.forEach((item) => {
              let adList = [];
              if ("." === item.pre)
                if (item.isAll)
                  (adList = document.querySelectorAll(item.pre + item.str)),
                    (adList = [].slice.call(adList));
                else {
                  const dom = document.querySelector(item.pre + item.str);
                  dom && adList.push(dom);
                }
              else {
                const ele = document.querySelector(item.pre + item.str);
                ele && adList.push(ele);
              }
              adList.length > 0 &&
                adList.forEach((adDom) => {
                  ad.push(adDom);
                });
            }),
            (this.doms.ad = this.info.isDelAd
              ? ad.filter((item) => "none" !== item.style.display)
              : ad))
          : (this.doms.ad = []);
      },
      delAd() {
        this.doms.ad.forEach((item) => {
          "none" !== item.style.display && (item.style.display = "none");
        });
      },
      showAd() {
        this.doms.ad.forEach((item) => {
          "none" === item.style.display && (item.style.display = "");
        });
      },
      updateData() {
        (this.info.isDelAd = settings.video_isDelAd.value),
          (this.info.delSetting = settings.video_delSetting.value);
      },
      init() {
        if ((this.initValue(), !this.info.isDelAd)) return;
        let i = 0;
        const timer = setInterval(() => {
          i++,
            this.getAd(),
            i > this.info.timeoutNum && clearInterval(timer),
            this.delAd();
        }, this.info.interval);
        utils.resetErrInfo();
      },
    };
  const baseCfg = {
      isEditing: !1,
      isShowPage: !1,
      param: {
        id: "ll_edit_wrap",
        box: document.body,
        classBase: "ll_edit_",
        w: "450px",
        h: "",
        contentH: "450px",
        bg: "rgba(0, 0, 0, 0.12)",
        color: "#333",
        fontSize: "15px",
        fontFamily:
          "PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif",
        zIndex: 11e3,
        resetTt: "重置所有设置为默认值",
        isShowMenu: !1,
        isScrollStyle: !0,
        isResetBtn: !0,
        showPage: void 0,
        page: [],
      },
    },
    cfg = {
      version: "v1.0.7",
      isEditing: baseCfg.isEditing,
      isShowPage: baseCfg.isShowPage,
      param: {},
      allData: {},
      baseData: {},
      oldData: {},
      controls: {},
      doms: { page: [] },
      editText: {},
      callback: { resetBefore: null, confirmBefore: null, finished: null },
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
      };\n  display: none;\n}\n${baseStart}box {\n  position: relative;\n  width: ${
        param.w || "450px"
      };\n  ${
        param.h ? "max-height:" + param.h : ""
      };\n  margin: auto;\n  color: ${
        param.color || "#333"
      };\n  background: #fff;\n  font-size: ${fSize};\n  line-height: normal;\n  font-family: ${
        param.fontFamily ||
        "PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif"
      };\n  border: 3px solid #dfedfe;\n  border-radius: 10px;\n  box-sizing: border-box;\n  padding: 10px 8px 10px 15px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n${baseStart}menu {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 1
      }px;\n  margin-bottom: 10px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n${baseStart}menu-item {\n  border: 1px solid #dfedfe;\n  color: #9ecaff;\n  background: #eef6ff;\n  border-radius: 6px;\n  padding: 6px 10px;\n  cursor: pointer;\n}\n${baseStart}menu-item:hover {\n  color: #65aaff;\n  background: #dfedfe;\n  border: 1px solid #dfedfe;\n}\n${baseStart}menu-item.active {\n  color: #65aaff;\n  background: #dfedfe;\n  border: 1px solid #dfedfe;\n}\n${baseStart}page-box {\n  max-height: ${
        param.contentH || ""
      };\n  padding-right: 7px;\n  margin-bottom: 8px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n${baseStart}page {\n  display: none;\n}\n${baseStart}page.curPage {\n  display: block;\n}\n${baseStart}comp {\n  margin-bottom: 8px;\n}\n${baseStart}comp:last-child {\n  margin-bottom: 2px;\n}\n${baseStart}comp-tt {\n  font-weight: bold;\n  line-height: 1.5;\n}\n${baseStart}comp-desc {\n  line-height: 1.5;\n}\n${baseStart}title {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 5
      }px;\n}\n${baseStart}rd-arr {\n  line-height: 22px;\n}\n${baseStart}rd-arr label {\n  margin-right: 6px;\n  cursor: pointer;\n}\n${baseStart}rd-arr input {\n  vertical-align: -2px;\n  cursor: pointer;\n}\n${baseStart}rd-arr span {\n  color: #666;\n  margin-left: 2px;\n}\n#${
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
      let title,
        desc,
        ctrlTt,
        type = info.type;
      if (
        ((type = {
          menuTitle: "mtt",
          title: "tt",
          desc: "ds",
          radio: "rd",
          checkbox: "cb",
          textarea: "ta",
          mtt: "mtt",
          tt: "tt",
          ds: "ds",
          rd: "rd",
          cb: "cb",
          ta: "ta",
        }[type]),
        (id = 0 === id ? "0" : id || ""),
        0 === info.content
          ? (info.content = "0")
          : (info.content = info.content || ""),
        !type)
      )
        return console.log("不存在的组件类型"), !1;
      switch (
        ("tt" !== type &&
          "ds" !== type &&
          "mtt" !== type &&
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
          return info.content
            ? `<div class="${cBase}menu-item ${active || ""}" title="${
                info.tt || ""
              }">${info.content}</div>`
            : "";
        case "tt":
          return info.content
            ? `<div class="${cBase}title ${cBase}comp" title="${
                info.tt || ""
              }">${info.content}</div>`
            : "";
        case "ds":
          return info.content
            ? `<div class="${cBase}desc ${cBase}comp" title="${
                info.descTt || ""
              }">${info.content}</div>`
            : "";
        case "rd":
          const name = info.name || new Date().getTime();
          (ctrlTt = info.ctrlTt || ""),
            ctrlTt && (ctrlTt = `title="${ctrlTt}"`);
          let radio = `<div class="${cBase}rd ${cBase}rd-arr" ${ctrlTt}>`;
          if (void 0 === info.value && info.radioList[0]) {
            const obj = info.radioList[0];
            info.value = void 0 === obj.value ? obj.text : obj.value;
          }
          return (
            info.radioList.forEach((item) => {
              const value = void 0 === item.value ? item.text : item.value;
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
            info.radioList.forEach((item) => {
              const value = void 0 === item.value ? item.text : item.value;
              let tt = item.tt || "";
              tt && (tt = `title="${tt}"`);
              let selected = "";
              info.value + "" == item.value + "" && (selected = "checked"),
                (checkbox += `<label ${tt}><input ${selected} type="checkbox" name="${name2}" data-val="${value}" data-cpid="${id}"><span>${item.text}</span></label>`);
            }),
            (checkbox += "</div>"),
            `<div class="${cBase}comp ${cBase}ctrl ${cBase}cb-box" data-type="${type}" data-cpid="${id}">${title}${desc}${checkbox}</div>`
          );
        case "ta":
          const style = `style="${
              info.width ? "width:" + info.width + ";" : ""
            }${info.height ? "height:" + info.height + ";" : ""}${
              info.fontSize ? "font-size:" + info.fontSize + ";" : ""
            }${info.fontFamily ? "font-family:" + info.fontFamily + ";" : ""}"`,
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
        (cfg.isShowPage ||
          ((void 0 === param.showPage || pgid === param.showPage + "") &&
            ((pageFlag = "curPage"), (cfg.isShowPage = !0))),
        (pageHTML += `<div class="${cBase}page ${pageFlag}" data-pgid="${pgid}">`),
        curPage.components)
      ) {
        let compIndex = 0;
        if (isMenu || param.isShowMenu) {
          let curMenu = curPage.components.find(
            (item) => "menuTitle" === item.type
          );
          curMenu || (curMenu = { type: "menuTitle", content: pgid }),
            (menu += getCompHTML({
              info: curMenu,
              active: pageFlag ? "active" : "",
            }));
        }
        curPage.components.forEach((item) => {
          const cpid = item.id || compIndex;
          "menuTitle" !== item.type &&
            (pageHTML += getCompHTML({ info: item, id: cpid })),
            "menuTitle" !== item.type &&
              "title" !== item.type &&
              "desc" !== item.type &&
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
            cfg.resetTt || "重置所有设置为默认值"
          }">重置</button>`
        : "",
      btnBox = `<div class="${cBase}btn-box">\n${resetBtn}\n<button class="${cBase}cancel-btn">取 消</button>\n<button class="${cBase}confirm-btn">确 认</button>\n</div>`;
    return `<div class="${cBase}box ll-scroll-style-1 ll-scroll-style-1-size-3" data-version="${cfg.version}">\n${menu}\n${pageHTML}\n${btnBox}\n</div>`;
  };
  let param = cfg.param;
  const baseParam = baseCfg.param,
    allData = cfg.allData,
    controls = cfg.controls,
    doms = cfg.doms,
    cBase = baseParam.classBase;
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
    showPage = baseParam.showPage,
    page = [],
  } = {}) {
    (cfg.isEditing = baseCfg.isEditing),
      (cfg.isShowPage = baseCfg.isShowPage),
      (cfg.param = { ...baseParam }),
      (param = cfg.param),
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
      (param.showPage = showPage),
      (param.page = page);
    const html = editArea_html();
    return (
      (function addCss(cssText, box = document.body, id = "") {
        const style = document.createElement("style");
        return (
          id && (style.id = id),
          box.appendChild(style),
          (style.innerHTML = cssText),
          style
        );
      })(css(), box),
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
          cfg.isShowPage ||
            (curPage.classList.add("curPage"),
            (isMenu || param.isShowMenu) &&
              doms.menus[0].classList.add("active"),
            (cfg.isShowPage = !0));
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
                    (dom.value = allData[pgid][cpid])),
                (ctrls[cpid] = dom);
            });
        });
      })(),
      (function bindEvents() {
        function menuHandle(e) {
          const dom = e.target;
          if (dom.classList.contains(`${cBase}menu-item`)) {
            const old = doms.menu.querySelector(".active");
            old.classList.remove("active"),
              old.settingsPage.classList.remove("curPage"),
              dom.classList.add("active"),
              dom.settingsPage.classList.add("curPage");
          }
        }
        function cancelEdit(e) {
          (e.target.className !== `${cBase}wrap` &&
            e.target.className !== `${cBase}cancel-btn`) ||
            (showEditArea(!1), setCompValue(cfg.oldData));
        }
        function confirmEdit() {
          const callback = cfg.callback,
            data = getAllData();
          if (callback.confirmBefore) {
            let result;
            const func = callback.confirmBefore;
            if (
              (Array.isArray(func)
                ? func.curFn
                  ? ((result = func[curFn](data)), (func.curFn = null))
                  : func.forEach((fn) => {
                      result = fn(data);
                    })
                : (result = func(data)),
              !1 === result)
            )
              return;
          }
          if ((showEditArea(!1), callback.finished)) {
            const func = callback.finished;
            Array.isArray(func)
              ? func.curFn
                ? (func[curFn](data), (func.curFn = null))
                : func.forEach((fn) => {
                    fn(data);
                  })
              : func(data);
          }
        }
        function resetEdit() {
          const callback = cfg.callback,
            data = getAllData();
          if (callback.resetBefore) {
            let result;
            const func = callback.resetBefore;
            if (
              (Array.isArray(func)
                ? func.curFn
                  ? ((result = func[curFn](data)), (func.curFn = null))
                  : func.forEach((fn) => {
                      result = fn(data);
                    })
                : (result = func(data)),
              !1 === result)
            )
              return;
          }
          !(function resetEditData() {
            param.isResetBtn && setCompValue(cfg.baseData);
          })();
        }
        doms.menu && doms.menu.addEventListener("click", menuHandle),
          doms.wrap.addEventListener("click", cancelEdit),
          doms.cancel.addEventListener("click", cancelEdit),
          doms.confirm.addEventListener("click", confirmEdit),
          doms.reset && doms.reset.addEventListener("click", resetEdit);
      })(),
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
          return ctrl.find((item) => item.checked).dataset.val;
        }
        if ("cb" === ctrl.compType) {
          return ctrl
            .filter((item) => item.checked)
            .map((item) => item.dataset.val);
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
      return allData;
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
      isShow &&
      ((cfg.oldData = getAllData()), "function" == typeof callback)
    ) {
      if (!1 === callback(cfg.oldData)) return;
    }
    (cfg.isEditing = isShow),
      (doms.wrap.style.display = isShow ? "block" : "none"),
      isShow &&
        !doms.box.style.top &&
        (doms.box.style.top =
          window.innerHeight / 2 - doms.box.clientHeight / 2 + "px"),
      callback && (cfg.callback = callback);
  }
  function toPageObj(settings) {
    const pageArr = [],
      menuList = [];
    for (let key in settings) {
      const item = settings[key];
      menuList.includes(item.type) || menuList.push(item.type);
    }
    return (
      menuList.forEach((menuTt) => {
        const components = [],
          page = { id: menuTt, components },
          arr = [];
        for (let key in settings) {
          const item = settings[key];
          item.type === menuTt && arr.push(item);
        }
        arr.forEach((item) => {
          let desc = item.txt || "";
          desc && (desc = desc.replaceAll("\n", "<br>").trim());
          const comp = {
            id: item.key,
            type: item.compType,
            tt: item.tt || "",
            title: item.title || "",
            desc,
            descTt: item.descTt || "",
            name: item.key,
            value: item.value,
            base: item.base,
          };
          if ("textarea" === comp.type)
            (comp.ph = item.base),
              (comp.width = item.compW),
              (comp.height = item.compH),
              (comp.ctrlTt = "默认: " + item.base);
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
      pageArr
    );
  }
  function getEditInfo() {
    const editInfo = {
      w: "500px",
      contentH: "450px",
      resetTT: "重置所有设置项为默认值",
      page: toPageObj(settings),
    };
    return (
      "首页" === info.pageName
        ? (editInfo.showPage = "基础设置")
        : "视频" === info.pageName && (editInfo.showPage = "视频页"),
      editInfo
    );
  }
  const intervalLoopFunc = function ({
    fn,
    breakFn,
    num = 10,
    interval = 100,
    isStartRun = !0,
    finishedFn,
    successFn,
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
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const icons = {
    base: {
      color: "#666",
      width: "100%",
      height: "80%",
      marginTop: "10%",
      html: "",
    },
    lishi: {
      color: "#8a8a8a",
      width: "100%",
      height: "80%",
      marginTop: "10%",
      html: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1700314086069" style="svgStyleFlag" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4255" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512.5 98.29c-227.84 0-412.54 184.7-412.54 412.54s184.7 412.54 412.54 412.54 412.54-184.7 412.54-412.54S740.34 98.29 512.5 98.29z m249.28 661.82c-32.4 32.4-70.1 57.82-112.08 75.58-43.42 18.37-89.59 27.68-137.21 27.68-47.62 0-93.78-9.31-137.2-27.68-41.97-17.75-79.68-43.18-112.08-75.58-32.4-32.4-57.82-70.1-75.58-112.08-18.37-43.42-27.68-89.59-27.68-137.21 0-47.62 9.31-93.78 27.68-137.21 17.75-41.97 43.18-79.68 75.58-112.08s70.1-57.82 112.08-75.58c43.42-18.37 89.59-27.68 137.21-27.68 47.62 0 93.78 9.31 137.21 27.68 41.97 17.75 79.68 43.18 112.08 75.58s57.82 70.1 75.58 112.08c18.37 43.42 27.68 89.59 27.68 137.21 0 47.62-9.31 93.78-27.68 137.21-17.77 41.97-43.19 79.68-75.59 112.08z" p-id="4256"></path><path d="M738.68 674.81L542 497.48V248.27c0-16.57-13.43-30-30-30s-30 13.43-30 30v262.55c0 8.5 3.6 16.59 9.91 22.28L698.5 719.37a29.906 29.906 0 0 0 20.08 7.72c8.2 0 16.37-3.34 22.29-9.91 11.1-12.3 10.12-31.27-2.19-42.37z" p-id="4257"></path></svg>',
    },
    shoucang: {
      color: "#fe9850",
      width: "100%",
      height: "80%",
      marginTop: "10%",
      html: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1700314090785" style="svgStyleFlag" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4405" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M949.888 457.258667c26.069333-29.824 13.866667-67.52-24.789333-76.309334L681.728 325.546667l-127.786667-214.677334c-20.266667-34.069333-59.925333-34.090667-80.213333 0l-127.786667 214.677334-243.370666 55.381333c-38.442667 8.746667-50.858667 46.506667-24.789334 76.309333l164.394667 188.053334-22.613333 248.917333c-3.584 39.466667 28.458667 62.805333 64.896 47.146667l237.781333-102.037334a21.333333 21.333333 0 0 0-16.810667-39.210666L267.626667 902.186667c-6.698667 2.88-6.229333 3.221333-5.568-4.096l24.277333-267.093334-176.426667-201.813333c-4.757333-5.461333-4.906667-5.034667 2.133334-6.634667l261.205333-59.434666 137.152-230.4c3.733333-6.293333 3.136-6.293333 6.869333 0l137.173334 230.4 261.205333 59.434666c7.125333 1.621333 6.954667 1.088 2.133333 6.613334l-176.426666 201.813333 24.256 267.093333a21.333333 21.333333 0 1 0 42.496-3.84l-22.613334-248.917333 164.394667-188.053333z" p-id="4406"></path></svg>',
    },
  };
  const classList = info.homeClassList,
    delClassList = info.homeDelClassList;
  let vDom,
    nav,
    banner,
    carousel,
    base_videoNumRule,
    base_videoNumRule2,
    isClearAd,
    isTrueEnd,
    isAutoLayout,
    isLoadOne,
    isCarousel,
    videoNumRule,
    delClassArr;
  const apiUrl = info.apiUrl,
    imgDetails = info.imgDetails,
    queryNum = 0,
    marginTop1 = info.marginTop1,
    marginTop2 = info.marginTop2,
    zoom = info.zoom;
  let cssDom,
    cssText,
    oldCssText,
    w,
    isChange = !1,
    rowVideoNum = 3,
    videoNum = 0,
    newVideoNum = 0,
    firstAdIndex = 0,
    pageZoom = 1,
    loadNum = 0,
    fresh_idx = getRandom(0, 3e3),
    curDelNum = 0,
    scriptRefreshFlag = 0,
    refreshFlag = 0,
    isScriptRefresh = !1,
    hasDelUpBtn = !1,
    isCanMarkOldVideo = !0,
    isNeedMarkOldVideo = !1;
  window.location.pathname;
  function main(isLoads = !0) {
    !(function initValue() {
      (isChange = !1),
        (rowVideoNum = 3),
        (videoNum = 0),
        (newVideoNum = 0),
        (firstAdIndex = 0),
        (pageZoom = 1);
    })(),
      (isLoads && (loadNum++, loadNum > 3)) ||
        (updateData(),
        (function home_getDoms() {
          if (vDom && nav && banner && carousel)
            return void (isCarousel || showCarousel(!1));
          "string" == typeof classList.vDom
            ? (vDom = document.querySelector("." + classList.vDom))
            : classList.vDom.forEach((item) => {
                !vDom && (vDom = document.querySelector("." + item));
              });
          if (!vDom) {
            const dom = document.querySelector("." + classList.video);
            if ((dom && (vDom = dom.parentElement), !vDom)) return;
          }
          (carousel = vDom.querySelector("." + classList.carousel)),
            (nav = document.querySelector("." + classList.nav)),
            (banner = document.querySelector("." + classList.banner)),
            (videoNumRule = (function home_getValue(key, defa = "") {
              let value = GM_getValue(key);
              return null == value ? defa : value;
            })(
              "setting_videoNumRule",
              carousel && isCarousel ? base_videoNumRule2 : base_videoNumRule
            )),
            "string" == typeof videoNumRule &&
              (videoNumRule = getVideoNumRule(videoNumRule));
          isCarousel || showCarousel(!1);
        })(),
        vDom || !isLoads
          ? ((loadNum = 0),
            (w = utils.getW(isAutoLayout)),
            zoomPage(),
            setStyle(),
            addDelUpBtnCss(),
            bindDelUpBtnEvent(),
            intervalLoopFunc({
              breakFn: hasPreloadVideo,
              fn: function adFunc() {
                (videoNum = getVideoNum()),
                  delAd(getAd(queryNum, delClassArr)),
                  loadBlankVideo(() => {
                    markOldVideo(), createDelUpBtn();
                  });
              },
              successFn: () => {
                intervalLoopFunc({ breakFn: hasSpecialVideo, fn: delAdFn });
              },
              interval: 50,
              num: 15,
            }),
            utils.resetErrInfo(),
            (function home_bindEvents() {
              let adArr,
                timer,
                timer2,
                timer3,
                rollBtn = info.btnDoms.rollBtn,
                btnSvg = info.btnDoms.btnSvg,
                rollBtn2 = info.btnDoms.rollBtn2;
              function bindEventBreakFn() {
                if (
                  (rollBtn ||
                    (rollBtn = document.querySelector(
                      "button." + classList.btn
                    )),
                  btnSvg || (btnSvg = rollBtn && rollBtn.querySelector("svg")),
                  rollBtn2 ||
                    (rollBtn2 = document.querySelector("." + classList.btn2)),
                  (info.btnDoms.rollBtn = rollBtn),
                  (info.btnDoms.btnSvg = btnSvg),
                  (info.btnDoms.rollBtn2 = rollBtn2),
                  rollBtn)
                )
                  return !0;
              }
              function bindBtnEvents() {
                let curRefreshFlag;
                const breakFn = () =>
                    !vDom.children[1].getAttribute("oldvideo"),
                  fn = () => {
                    getVideoNum(),
                      (adArr = getAd(
                        3 * rowVideoNum + (carousel ? 2 : 0) + 3,
                        delClassArr,
                        getFirstAdIndex()
                      )),
                      delAd(adArr);
                  },
                  refreshAfterFn = () => {
                    refreshFlag === curRefreshFlag &&
                      (markOldVideo(), createDelUpBtn());
                  },
                  finishedFn = () => {
                    (curRefreshFlag = refreshFlag),
                      vDomInfo(vDom, "old", "刷新后"),
                      refreshVideo(refreshAfterFn);
                  },
                  getAddNum = () => {
                    if (!settings.isTestNetSpeed || 0 === info.netSpeed.value)
                      return 0;
                    let addNum = Math.ceil(
                      (info.baseNetSpeed - info.netSpeed.value) *
                        info.refreshLoopFnInfo.addNumMultiple
                    );
                    return (
                      (!addNum || addNum < 0) && (addNum = 0),
                      addNum > info.refreshLoopFnInfo.maxAddNum &&
                        (addNum = info.refreshLoopFnInfo.maxAddNum),
                      addNum
                    );
                  };
                if (((btnSvg = null), btnSvg && !info.events.rollSvg))
                  (info.events.rollSvg = !0),
                    btnSvg.addEventListener("transitionrun", () => {
                      markOldVideo(),
                        console.log(
                          "刷新前的第一个视频",
                          vDom.children[1],
                          ", oldVideo:",
                          !!vDom.children[1].getAttribute("oldvideo")
                        ),
                        vDomInfo(vDom, "scriptRefresh", "刷新前");
                    }),
                    btnSvg.addEventListener("transitionend", () => {
                      refreshFlag++,
                        console.log("刷新视频"),
                        markOldVideo(),
                        console.log(
                          "刷新前的第一个视频",
                          vDom.children[1],
                          ", oldVideo:",
                          !!vDom.children[1].getAttribute("oldvideo")
                        ),
                        vDomInfo(vDom, "scriptRefresh", "刷新前"),
                        info.isScriptRefresh
                          ? refreshVideo(refreshAfterFn)
                          : setTimeout(() => {
                              intervalLoopFunc({
                                fn,
                                breakFn,
                                interval: info.refreshLoopFnInfo.interval,
                                num:
                                  info.refreshLoopFnInfo.svgNum + getAddNum(),
                                finishedFn,
                              });
                            }, +settings.homeDelAdTime.value);
                    });
                else if (!info.events.roll) {
                  info.events.roll = !0;
                  const throttleRollClickHandle = (function throttle(
                    fn,
                    interval
                  ) {
                    let lastTime = 0;
                    return function () {
                      let nowTime = new Date().getTime();
                      const args = arguments;
                      interval - (nowTime - lastTime) <= 0 &&
                        (fn.apply(this, args), (lastTime = nowTime));
                    };
                  })(() => {
                    refreshFlag++,
                      markOldVideo(),
                      console.log("刷新视频"),
                      console.log(
                        "刷新前的第一个视频",
                        ", isOld:",
                        !!vDom.children[1].getAttribute("oldvideo"),
                        vDom.children[1]
                      ),
                      vDomInfo(vDom, "scriptRefresh", "刷新前"),
                      info.isScriptRefresh
                        ? refreshVideo(refreshAfterFn)
                        : setTimeout(() => {
                            intervalLoopFunc({
                              breakFn,
                              fn,
                              finishedFn,
                              interval: info.refreshLoopFnInfo.interval,
                              num: info.refreshLoopFnInfo.rollNum + getAddNum(),
                            });
                          }, 100 + settings.homeDelAdTime.value);
                  }, info.clickMinInterval);
                  rollBtn.addEventListener("click", throttleRollClickHandle);
                }
                if (rollBtn2 && !info.events.roll2) {
                  info.events.roll2 = !0;
                  const breakFn2 = () => {
                      const dom = vDom.children[1],
                        isA = dom.querySelector("a");
                      return !dom.getAttribute("oldvideo") && isA;
                    },
                    btnFn2 = () => {
                      (videoNum = getVideoNum()),
                        (adArr = getAd(queryNum, delClassArr, 1, !!isTrueEnd)),
                        delAd(adArr, !0),
                        loadBlankVideo(refreshAfterFn);
                    },
                    finishedFn2 = () => {
                      vDomInfo(vDom, "old", "刷新后");
                    };
                  rollBtn2.addEventListener("click", () => {
                    refreshFlag++,
                      markOldVideo(),
                      console.log(
                        "刷新前的第一个视频",
                        vDom.children[1],
                        ", oldVideo:",
                        !!vDom.children[1].getAttribute("oldvideo")
                      ),
                      vDomInfo(vDom, "scriptRefresh", "刷新前"),
                      console.log("刷新全部视频"),
                      isScriptRefresh
                        ? refreshVideo(refreshAfterFn)
                        : setTimeout(() => {
                            intervalLoopFunc({
                              breakFn: breakFn2,
                              fn: btnFn2,
                              finishedFn: finishedFn2,
                              interval: info.refreshLoopFnInfo.interval,
                              num:
                                info.refreshLoopFnInfo.rollNum2 + getAddNum(),
                            });
                          }, 200 + settings.homeDelAdTime.value);
                  });
                }
              }
              function bindBtnEventFn() {
                intervalLoopFunc({
                  breakFn: bindEventBreakFn,
                  fn: bindBtnEvents,
                  successFn: () => {
                    console.log("已获取刷新按钮");
                  },
                  interval: 300,
                });
              }
              bindBtnEventFn(),
                info.events.resize ||
                  ((info.events.resize = !0),
                  window.addEventListener("resize", () => {
                    timer && clearTimeout(timer),
                      (timer = setTimeout(() => {
                        const newW = utils.getW(isAutoLayout);
                        newW > w && delAdFn(),
                          (w = newW),
                          zoomPage(),
                          setStyle();
                      }, 400));
                  }));
              info.events.wheel ||
                ((info.events.wheel = !0),
                window.addEventListener("wheel", () => {
                  rollBtn2 || bindBtnEventFn(),
                    timer2 && clearTimeout(timer2),
                    timer3 && clearTimeout(timer3),
                    (timer2 = setTimeout(() => {
                      delAdFn(timer3);
                    }, 600)),
                    (timer3 = setTimeout(() => {
                      delAdFn();
                    }, 1500));
                }));
            })(),
            setTimeout(() => {
              settings.isTestNetSpeed && testNetworkSpeed(5),
                setInterval(() => {
                  settings.isTestNetSpeed && testNetworkSpeed(5);
                }, 6e4 * info.testNetInterval);
            }, 4e3),
            (document.testNetworkSpeed = testNetworkSpeed))
          : setTimeout(() => {
              main();
            }, 500));
  }
  function zoomPage() {
    if (document.getBoxObjectFor) return;
    const rootDom = document.documentElement;
    if (!settings.isReorderVideo.value)
      return (pageZoom = 1), void (rootDom.style.zoom = 1);
    let rate = rootDom.scrollWidth / getMainW();
    function getMainW() {
      let navW = nav ? nav.scrollWidth : 0;
      return navW > (banner ? banner.scrollWidth : 0)
        ? navW
        : rootDom.clientWidth;
    }
    !document.body.style.overflow &&
      (document.body.style.overflow = "hidden auto"),
      rate > 1
        ? ((pageZoom *= 1 / rate), (rootDom.style.zoom = pageZoom))
        : ((pageZoom = 1),
          (rootDom.style.zoom = 1),
          (rate = rootDom.scrollWidth / getMainW()),
          rate > 1 &&
            ((pageZoom *= 1 / rate), (rootDom.style.zoom = pageZoom)));
  }
  function vDomInfo(vDom, logFlag = "old", startStr = "") {
    if (!isScriptRefresh) {
      if ("scriptRefresh" === logFlag) return;
      if ("old" === logFlag && !vDom.children[1].getAttribute("oldvideo"))
        return;
      if ("new" === logFlag && vDom.children[1].getAttribute("oldvideo"))
        return;
    }
    console.log(""),
      console.log(
        "==========================================================================================================================================="
      ),
      startStr && console.log(startStr),
      console.log("vDom", vDom, vDom.children.length);
    for (let i = 1; i <= 1; i++) {
      const item = vDom.children[i],
        h3 = item.querySelector("h3") || item.querySelector(".title");
      console.log(i, h3 && h3.innerText),
        console.log(
          " class:",
          "." + [].slice.call(item.classList).join("."),
          ", isOld:",
          item.getAttribute("oldvideo"),
          ", dom:",
          item
        );
    }
    console.log(vDom.children);
    const len = vDom.children.length;
    let classStr = "";
    for (let i = 0; i < len; i++) {
      const item = vDom.children[i];
      if (item.classList) {
        let str = "." + [].slice.call(item.classList).join(".");
        (str += (i + 1) % 4 == 0 ? "\n" : "; "), (classStr += str);
      }
    }
    console.log(`classArr:\n${classStr}`);
  }
  function getAd(queryNum, delClassArr, startIndex = 1, isAll = !1, vList) {
    curDelNum = 0;
    const arr = [];
    delClassArr.forEach(() => {
      arr.push([]);
    }),
      vList || (vList = vDom.children);
    const vLen = vList.length;
    let len = newVideoNum < vLen ? newVideoNum : vLen;
    (len = isAll || len > vLen ? vLen : len),
      (queryNum = queryNum || len),
      (queryNum += startIndex) > len && (queryNum = len);
    for (let i = startIndex; i < queryNum; i++) {
      const vItem = vList[i];
      if (vItem) {
        if (!isAll && !vItem.querySelector("a")) break;
        for (let j = 0; j < delClassArr.length; j++)
          if (isChecked(vItem, delClassArr[j])) {
            (vItem.isNeedDelete = !0), arr[j].push(vItem);
            break;
          }
      }
    }
    return arr;
  }
  function delAd(adArr, isDel = !1, isDelJudge = !0) {
    function delItem(item) {
      curDelNum++;
      const h3 = item.querySelector("h3") || item.querySelector(".title");
      isClearAd || isDel
        ? (console.log("删除视频:", h3 && h3.innerText, item),
          vDom.appendChild(item),
          (item.style.display = "none"),
          isRemove &&
            setTimeout(() => {
              item.remove();
            }, 1e3),
          newVideoNum--,
          videoNum--)
        : (console.log("后移视频:", h3 && h3.innerText, item),
          isTrueEnd
            ? (newVideoNum--,
              videoNum--,
              (item.style.display = "block"),
              vDom.appendChild(item))
            : ((item.style.display = "block"),
              vDom.insertBefore(item, vDom.children[newVideoNum])));
    }
    function isDeletable() {
      if (!isNeedDelJudege) return !0;
      let len = info.loadVideoNum + 1;
      const vList = vDom.children;
      for (let i = firstAdIndex + 1; i < len; i++) {
        const item = vList[i];
        if (!item) return !0;
        if (item.getAttribute("oldvideo")) return !1;
      }
      return (isNeedDelJudege = !1), !0;
    }
    let isNeedDelJudege = isDelJudge;
    curDelNum = 0;
    const isRemove = info.isRemoveDelDom;
    for (let i = adArr.length - 1; i >= 0; i--) {
      adArr[i].forEach((item) => {
        isNeedDelJudege
          ? ((isCanMarkOldVideo = !1),
            intervalLoopFunc({
              fn: () => {
                delItem(item);
              },
              breakFn: isDeletable,
              finishedFn: () => {
                (isCanMarkOldVideo = !0), isNeedMarkOldVideo && markOldVideo();
              },
              interval: 50,
              num: 10,
            }))
          : delItem(item);
      });
    }
  }
  function markOldVideo(len) {
    if (!isCanMarkOldVideo) return void (isNeedMarkOldVideo = !0);
    (isNeedMarkOldVideo = !1),
      (len = len || getFillVideoNum() || info.loadVideoNum);
    const vList = vDom.children;
    for (let i = 1; i < len + 1; i++) {
      const item = vList[i];
      if (!item || !item.querySelector("a")) break;
      item.setAttribute("oldvideo", "true");
    }
  }
  function delAdFn(timer = null) {
    if ((getVideoNum(), newVideoNum > videoNum)) {
      return (
        delAd(
          getAd(
            queryNum,
            delClassArr,
            isTrueEnd ? videoNum : getFirstAdIndex()
          ),
          !1,
          !1
        ),
        (videoNum = newVideoNum),
        timer && clearTimeout(timer),
        createDelUpBtn(),
        !0
      );
    }
  }
  function setStyle() {
    if (!settings.isReorderVideo.value)
      return cssDom && cssDom.remove(), (cssDom = null), void (oldCssText = "");
    if (
      ((isChange = !1),
      videoNumRule.forEach((item) => {
        !(function setVideoNum(vRule) {
          const min =
              (vRule = vRule.map((i) => +i.trim()))[0] /
              (isAutoLayout ? zoom : 1),
            max = vRule[1] / (isAutoLayout ? zoom : 1),
            num = vRule[2];
          (0 === min || min) && max && num
            ? (w >= min &&
                w < max &&
                ((cssText = carousel
                  ? `.container {grid-template-columns: repeat(${
                      num + 2
                    },1fr) !important}\n.container>div:nth-child(n){margin-top:${marginTop2}px !important}\n.container>div:nth-child(-n+${
                      3 * num + 2 + 1
                    }){margin-top:${marginTop1}px !important;display:block !important}\n.container>div:first-child{display:${
                      isCarousel ? "block" : "none"
                    } !important}\n.container>div:nth-child(-n+${
                      2 * (num + 1) - 1
                    }){margin-top:0px !important}`
                  : `.container {grid-template-columns: repeat(${num},1fr) !important}\n.container>div:nth-child(n){margin-top:${marginTop2}px !important}\n.container>div:nth-child(${
                      3 * num + 1
                    }){display:block !important}\n      `),
                (isChange = !0),
                (rowVideoNum = num)),
              isChange || ((cssText = ""), (rowVideoNum = carousel ? 5 : 3)))
            : utils.errHandle({
                errTxt: `插件设置的视频排列规则设置中 '${vRule.join(
                  ""
                )}' 格式书写错误`,
                key: info.errKeyArr[1],
              });
        })(item);
      }),
      isChange)
    ) {
      let isCssDom = !!cssDom;
      isCssDom ||
        ((cssDom = document.createElement("style")),
        cssDom.setAttribute("type", "text/css")),
        oldCssText !== cssText && (cssDom.innerHTML = cssText),
        (oldCssText = cssText),
        !isCssDom && document.head.appendChild(cssDom);
    } else !isChange && cssDom && ((oldCssText = ""), (cssDom.innerHTML = ""));
  }
  function getVideoNum() {
    const vArr = vDom.children,
      len = vArr.length;
    let i;
    for (i = 1; i < len; i++) {
      if (!vArr[i].querySelector("a")) return (newVideoNum = i), i;
    }
    return (newVideoNum = i), i;
  }
  function getFirstAdIndex() {
    const vArr = vDom.children,
      len = vArr.length;
    firstAdIndex = 0;
    for (let i = 1; i < len; i++) {
      const vItem = vArr[i];
      for (let j = 0; j < delClassArr.length; j++)
        if (isChecked(vItem, delClassArr[j])) return (firstAdIndex = i), i;
      if (!vItem.querySelector("a")) return 0;
    }
    return 0;
  }
  function hasPreloadVideo() {
    const vArr = vDom.children,
      lastDom = vArr[vArr.length - 1];
    return !(!lastDom || lastDom.querySelector("a"));
  }
  function hasSpecialVideo(range = 0) {
    const vClass = info.homeClassList.specialCard;
    let len = vDom.children.length;
    range && range < len && (len = range);
    for (let i = 1; i < len; i++) {
      const item = vDom.children[i];
      if (item.classList.contains(vClass))
        return !!item.querySelector("a") && i;
    }
    return !1;
  }
  function isChecked(vEle, delStr) {
    function custom(txt, type, selector) {
      const dom = vEle.querySelector(selector);
      if (!dom) return;
      const domTxt = dom.innerText;
      txt = txt.replace(type, "");
      let f = !1;
      if ("作者==" !== type) {
        {
          const txtArr = txt.split("&&");
          if (!txtArr[0]) return;
          txtArr.forEach((item) => {
            f = f || domTxt.includes(item);
          });
        }
        flag = f;
      } else flag = domTxt === txt;
    }
    let flag = !1;
    const map = classList;
    if (
      ((delStr = delStr.trim()),
      (delStr = delClassList[delStr] || delStr).includes("标题="))
    )
      custom(delStr, "标题=", map.标题);
    else if (delStr.includes("作者=="))
      custom(delStr, "作者==", "." + map.author);
    else if (delStr.includes("作者=")) custom(delStr, "作者=", "." + map.作者);
    else if (delStr.includes("分类=")) custom(delStr, "分类=", "." + map.分类);
    else {
      flag = flag || vEle.classList.contains(delStr);
      try {
        flag = flag || vEle.querySelector("." + delStr);
      } catch (e) {
        utils.errHandle({
          errTxt: `插件设置的屏蔽设置中 '${delStr}' 格式书写错误, 自定义格式应以 '标题=' 或 '作者=' 开头`,
          e,
        });
      }
    }
    return flag;
  }
  function createVideoDom(data) {
    function formatNum(num) {
      return num > 1e8
        ? (num / 1e8).toFixed(1) + "亿"
        : num > 1e4
        ? (num / 1e4).toFixed(1) + "万"
        : "" + num;
    }
    function videoDom(item, reportStr) {
      if (item.business_info) return -1;
      const like = Math.floor(item.stat.like / 1e4),
        likeHTML =
          like > 1
            ? `<div class="bili-video-card__info--icon-text">${like}万点赞</div>`
            : "",
        upIconHTML = likeHTML
          ? ""
          : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24"\n  height="24" fill="currentColor" class="bili-video-card__info--owner__up">\x3c!--[--\x3e\n  <path\n    d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z"\n    fill="currentColor"></path>\n  <path\n    d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z"\n    fill="currentColor"></path>\n  <path\n    d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"\n    fill="currentColor"></path>\x3c!--]--\x3e\n</svg>',
        html = `<div data-v-7ae03d4e="" class="bili-video-card is-rcmd ${
          info.homeClassList.addVideo || ""
        }" data-report="tianma.${reportStr}.click"\n  style="--cover-radio: 56.25%;">\n  <div class="bili-video-card__skeleton hide">\n    <div class="bili-video-card__skeleton--cover"></div>\n    <div class="bili-video-card__skeleton--info">\n      <div class="bili-video-card__skeleton--right">\n        <p class="bili-video-card__skeleton--text"></p>\n        <p class="bili-video-card__skeleton--text short"></p>\n        <p class="bili-video-card__skeleton--light"></p>\n      </div>\n    </div>\n  </div>\n  <div class="bili-video-card__wrap __scale-wrap"><a href="${
          item.uri
        }" target="_blank" data-spmid="333.1007"\n      data-mod="tianma.${reportStr}" data-idx="click">\n      <div class="bili-video-card__image __scale-player-wrap bili-video-card__image--hover">\n        <div class="bili-video-card__image--wrap">\n          <div class="bili-watch-later" style="display: none;"><svg class="bili-watch-later__icon">\n              <use xlink:href="#widget-watch-later"></use>\n            </svg><span class="bili-watch-later__tip" style="display: none;"></span></div>\n          <picture class="v-img bili-video-card__cover">\n            <source\n              srcset="${item.pic.replace(
          "http:",
          ""
        )}${imgDetails}.avif"\n              type="image/avif">\n            <source\n              srcset="${item.pic.replace(
          "http:",
          ""
        )}${imgDetails}.webp"\n              type="image/webp"><img\n              src="${item.pic.replace(
          "http:",
          ""
        )}${imgDetails}"\n              alt="${
          item.title
        }" loading="eager" onload=""\n              onerror="typeof window.imgOnError === 'function' && window.imgOnError(this)">\n          </picture>\n          <div class="v-inline-player"></div>\n        </div>\n        <div class="bili-video-card__mask">\n          <div class="bili-video-card__stats">\n            <div class="bili-video-card__stats--left"><span class="bili-video-card__stats--item"><svg\n                  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"\n                  width="24" height="24" fill="#ffffff" class="bili-video-card__stats--icon">\n                  <path\n                    d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"\n                    fill="currentColor"></path>\n                  <path\n                    d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z"\n                    fill="currentColor"></path>\n                </svg><span class="bili-video-card__stats--text">${formatNum(
          item.stat.view
        )}</span></span><span\n                class="bili-video-card__stats--item"><svg xmlns="http://www.w3.org/2000/svg"\n                  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff"\n                  class="bili-video-card__stats--icon">\n                  <path\n                    d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"\n                    fill="currentColor"></path>\n                  <path\n                    d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z"\n                    fill="currentColor"></path>\n                  <path\n                    d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z"\n                    fill="currentColor"></path>\n                  <path\n                    d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z"\n                    fill="currentColor"></path>\n                  <path\n                    d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z"\n                    fill="currentColor"></path>\n                </svg><span class="bili-video-card__stats--text">${formatNum(
          item.stat.danmaku
        )}</span></span></div><span\n              class="bili-video-card__stats__duration">${utils.formatTime(
          item.duration
        )}</span>\n          </div>\n        </div>\n      </div>\n    </a>\n    <div class="bili-video-card__info __scale-disable">\x3c!----\x3e\n      <div class="bili-video-card__info--right">\n        <h3 class="bili-video-card__info--tit" title="${
          item.title
        }">\n          <a href="${
          item.uri
        }?spm_id_from=333.1007.tianma.${reportStr}.click" target="_blank" data-spmid="333.1007"\n            data-mod="tianma.${reportStr}" data-idx="click">${
          item.title
        }\n          </a>\n        </h3>\n        <div class="bili-video-card__info--bottom">\n          ${likeHTML}\n          <a class="bili-video-card__info--owner" href="//space.bilibili.com/${
          item.owner.mid
        }" target="_blank"\n            data-spmid="333.1007" data-mod="tianma.${reportStr}" data-idx="click">\n            ${upIconHTML}\n            <span class="bili-video-card__info--author" title="${
          item.owner.name
        }">${
          item.owner.name
        }</span>\n            <span class="bili-video-card__info--date">· ${(function formatDate(
          t
        ) {
          const date = new Date(),
            oldDate = new Date(1e3 * t),
            dis = Math.floor(date.getTime() / 1e3) - t;
          return date.getFullYear() !== oldDate.getFullYear()
            ? utils.formatDate(1e3 * t, { isYear: !0, isAlign: !1 })
            : dis < 60
            ? "刚刚"
            : dis < 3600
            ? Math.floor(dis / 60 / 60) + "分钟前"
            : dis < 86400
            ? Math.floor(dis / 60 / 60) + "小时前"
            : date.getDate() - oldDate.getDate() == 1
            ? "昨天"
            : utils.formatDate(1e3 * t, { isAlign: !1 });
        })(
          item.pubdate
        )}</span>\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>`;
      return utils.strToDom(html);
    }
    const videoList = [];
    let num = 10;
    return (
      data.forEach((item, index) => {
        num++;
        const dom = videoDom(item, `4-${index + 1}-${num}`);
        -1 !== dom && videoList.push(dom);
      }),
      videoList
    );
  }
  function getFillVideoNum() {
    return isCarousel ? 3 * rowVideoNum + 2 : 3 * rowVideoNum;
  }
  async function requestVideos(num, isDelAd = !0) {
    if (num <= 0) return null;
    const params = new URLSearchParams({
      web_location: 1430650,
      y_num: 4,
      fresh_type: 4,
      feed_version: "V8",
      fresh_idx_1h: 1,
      fetch_row: 4,
      fresh_idx,
      brush: 1,
      homepage_ver: 1,
      ps: num,
      last_y_num: 5,
      screen: window.innerWidth + "-" + window.innerHeight,
      wts: Math.floor(new Date().getTime() / 1e3),
    });
    fresh_idx += getRandom(1, 10);
    const data = await utils.request(`${apiUrl}?${params}`);
    if (data.data.item) {
      let vList = createVideoDom(data.data.item);
      if (isDelAd) {
        getVideoNum();
        delAd(getAd(num, delClassArr, 0, !1, vList), !1, !1), getVideoNum();
      }
      return (vList = vList.filter((i) => !i.isNeedDelete)), vList;
    }
    return null;
  }
  async function loadBlankVideo(callBack = null) {
    if (!isLoadOne) return void (callBack && callBack());
    let specialIndex;
    try {
      specialIndex = hasSpecialVideo();
      const newNum =
          settings.addVideoNum.value ||
          (() => {
            const dis = specialIndex ? 0 : -1;
            return isCarousel
              ? 3 * rowVideoNum + 2 - (newVideoNum - 1) + dis
              : 3 * rowVideoNum - (newVideoNum - 1) + dis;
          })(),
        vList = await requestVideos(newNum);
      if (((specialIndex = hasSpecialVideo()), vList)) {
        const insertIndex = specialIndex || newVideoNum;
        for (let i = vList.length - 1; i >= 0; i--)
          vDom.insertBefore(vList[i], vDom.children[insertIndex]);
      }
      callBack && callBack();
    } catch (e) {
      console.log(e),
        setTimeout(() => {
          document.documentElement.scrollTo(0, 400),
            setTimeout(() => {
              document.documentElement.scrollTo(0, 0),
                setTimeout(() => {
                  delAdFn(), callBack && callBack();
                }, 800);
            }, 20);
        }, 1e3);
    }
  }
  async function refreshVideo(callBack = null) {
    if (!isLoadOne) return void (callBack && callBack());
    scriptRefreshFlag++;
    const curFlag = scriptRefreshFlag;
    let vList,
      target,
      num = 0,
      isDelSpecialDom = !1,
      hasSpecialDom = !1,
      isOldVideos = !1;
    const vClass = info.homeClassList.addVideo,
      specialClass = info.homeClassList.specialCard,
      fillNum = getFillVideoNum(),
      removeArr = [];
    let specialDom;
    const vNum = getVideoNum();
    for (let i = 1; i < vNum; i++) {
      const item = vDom.children[i];
      if (!item || !item.querySelector("a")) break;
      if (i <= fillNum + 2) {
        if (item.classList.contains(specialClass)) {
          (specialDom = item),
            (hasSpecialDom = !0),
            (num += fillNum - i),
            settings.isRefreshLast.value && ((isDelSpecialDom = !0), num++);
          break;
        }
      } else {
        if (
          (!isOldVideos && item.getAttribute("oldvideo") && (isOldVideos = !0),
          !isOldVideos)
        )
          break;
        if (item.classList.contains(specialClass)) {
          (specialDom = item),
            (hasSpecialDom = !0),
            settings.isRefreshLast.value && (isDelSpecialDom = !0);
          break;
        }
      }
    }
    if (vDom.children[1].getAttribute("oldvideo")) {
      isScriptRefresh && (info.isScriptRefresh = !0),
        (isScriptRefresh = !0),
        (num = fillNum - 1),
        isDelSpecialDom && num++,
        console.log(`加载${num}个视频`);
      for (let i = fillNum; i >= 1; i--) {
        const item = vDom.children[i];
        item &&
          item.querySelector("a") &&
          !item.classList.contains(specialClass) &&
          removeArr.push(item);
      }
      target = vDom.children[1];
    } else {
      if (((isScriptRefresh = !1), (info.isScriptRefresh = !1), isOldVideos)) {
        (num = 0),
          hasSpecialDom
            ? ((target = specialDom), num--, isDelSpecialDom && num++)
            : (target = vDom.children[info.loadVideoNum + 1]);
        for (let i = fillNum + 1; i < vNum; i++) {
          const item = vDom.children[i];
          if (!item || item.isNeedDelete || !item.getAttribute("oldvideo"))
            break;
          item.classList.contains(vClass)
            ? removeArr.push(item)
            : item.classList.contains(specialClass) || removeArr.push(item);
        }
      } else
        hasSpecialDom
          ? (target = specialDom)
          : ((vNum <= fillNum + 1 || vNum <= fillNum + 1 + 2) &&
              (num += fillNum + 1 - vNum),
            (target = vDom.children[info.loadVideoNum + 1]));
      const endIndex = isOldVideos ? fillNum : fillNum + 2;
      for (let i = 1; i <= endIndex; i++) {
        const item = vDom.children[i];
        if (!item) break;
        if (item.classList.contains(specialClass)) break;
        (item.classList.contains(vClass) || item.getAttribute("oldvideo")) &&
          (num++, removeArr.push(item));
      }
    }
    try {
      if (
        ((vList = await requestVideos(num)),
        vList && curFlag === scriptRefreshFlag)
      ) {
        if ((vList.length != num && (num = vList.length), target))
          for (let i = 0; i < num; i++) vDom.insertBefore(vList[i], target);
        removeArr.forEach((i) => i.remove()),
          isDelSpecialDom && specialDom.remove();
      }
      callBack && callBack();
    } catch (e) {
      console.log("视频请求失败"), console.log(e), callBack && callBack();
    }
  }
  function testNetworkSpeed(iterations) {
    let totalSpeed = 0;
    function runTest(interval = 0) {
      return new Promise((resolve, reject) => {
        let startTime, endTime;
        setTimeout(() => {
          let urlWithTimestamp = info.logoUrl + "?t=" + new Date().getTime();
          (startTime = performance.now()),
            fetch(urlWithTimestamp)
              .then((response) => {
                if (!response.ok) throw new Error("Network request failed");
                endTime = performance.now();
                let duration = (endTime - startTime) / 1e3,
                  speed = (
                    response.headers.get("content-length") /
                    1024 /
                    duration
                  ).toFixed(2);
                (totalSpeed += parseFloat(speed)), resolve();
              })
              .catch((error) => {
                console.error("Error:", error), reject(error);
              });
        }, interval);
      });
    }
    let promises = [],
      interval = 0;
    for (let i = 0; i < iterations; i++)
      promises.push(runTest(interval)), (interval += 1e3);
    Promise.all(promises)
      .then(() => {
        const speedStr = (totalSpeed / iterations).toFixed(2),
          netSpeed = +speedStr,
          avgSpeed = 0.6 * netSpeed + 0.4 * (info.netSpeed.value || netSpeed);
        (info.netSpeed.value = avgSpeed),
          console.log(
            `当前网速: ${speedStr}KB/s, 平均网速: ${avgSpeed.toFixed(2)}KB/s`
          );
      })
      .catch((error) => {
        console.error("Error during testing:", error);
      });
  }
  function getDelClassArr(value) {
    return (value = value
      .replaceAll("；", ",")
      .replaceAll(";", ",")
      .replaceAll("，", ",")
      .replaceAll(",\n", "\n")
      .replaceAll("\n", ",\n")).split(",");
  }
  function getVideoNumRule(value) {
    return (value = (value = value
      .replaceAll("；", ";")
      .replaceAll(";\n", ";")
      .replaceAll("\n", ";\n")).split(";")).map((item) => item.split(/,|，/));
  }
  function updateData() {
    (isClearAd = settings.isClearAd.value),
      (isTrueEnd = settings.isTrueEnd.value),
      (isAutoLayout = settings.isAutoLayout.value),
      (isLoadOne = settings.isLoadOne.value),
      (isCarousel = settings.isCarousel.value),
      (videoNumRule = getVideoNumRule(settings.videoNumRule.value)),
      (delClassArr = getDelClassArr(settings.delClassArr.value)),
      (base_videoNumRule = getVideoNumRule(settings.videoNumRule.base)),
      (base_videoNumRule2 = getVideoNumRule(settings.videoNumRule.base2));
  }
  function showCarousel(isShow = !0) {
    carousel || (carousel = vDom.querySelector("." + classList.carousel)),
      carousel && (carousel.style.display = isShow ? "block" : "none"),
      isShow || (carousel = !1);
  }
  function createDelUpBtn() {
    if (!settings.isDelUpBtn.value) return;
    const vList = vDom.children,
      len = vList.length,
      upClass = info.homeClassList["作者"],
      svg = (function getIconHTML({
        name = "",
        svg,
        color,
        width,
        height,
        marginTop,
        css = "",
      } = {}) {
        let icon;
        if (
          (svg
            ? ((icon = { ...icons.base }), (icon.html = svg))
            : (icon = icons[name]),
          icon)
        )
          return (
            (css += `\nfill:${color || icon.color || icons.base.fill};\nwidth:${
              width || icon.width || icons.base.width
            };\nheight:${
              height || icon.height || icons.base.height
            };\nmargin-top:${
              marginTop || icon.marginTop || icons.base.marginTop
            };`),
            icon.html.replace("svgStyleFlag", css)
          );
      })({
        svg: info.iconSvg.blacklist,
        color: "rgb(148, 153, 160)",
        width: "12px",
        height: "12px",
        marginTop: "1px",
      }),
      createBtn = () => {
        const btn = document.createElement("span");
        return (
          (btn.className = info.homeClassList.delUpBtn),
          (btn.title = info.txt.delUpBtnTT),
          (btn.innerHTML = svg),
          btn
        );
      };
    for (let i = 1; i < len; i++) {
      const item = vList[i];
      if (item.hasDelUpBtn) continue;
      if (!item.querySelector("a")) break;
      const up = item.querySelector(`.${upClass}`);
      up && (up.appendChild(createBtn()), (item.hasDelUpBtn = !0));
    }
  }
  function addDelUpBtnCss() {
    if (!settings.isDelUpBtn.value) return;
    if (hasDelUpBtn) return;
    const style = document.createElement("style");
    document.head.appendChild(style);
    const selector = "." + [].slice.call(vDom.classList).join(".");
    style.innerHTML = `${selector} > div:hover .${info.homeClassList.delUpBtn} {\n  opacity: 1;\n}\n.${info.homeClassList.delUpBtn} {\n  opacity: 0;\n  display: flex;\n  margin-left: 8px;\n  cursor: pointer;\n  transition: opacity 0.5s;\n}`;
  }
  function bindDelUpBtnEvent() {
    if (!settings.isDelUpBtn.value) return;
    if (hasDelUpBtn) return;
    const btnClass = info.homeClassList.delUpBtn;
    vDom.addEventListener("click", (e) => {
      let target = e.target,
        flag = target.classList.contains(btnClass);
      if (
        (flag ||
          ((target = target.parentElement),
          (flag = target.classList.contains(btnClass)),
          flag ||
            ((target = target.parentElement),
            (flag = target.classList.contains(btnClass)))),
        flag)
      ) {
        if (
          !((dom) => {
            const author = dom.parentElement.querySelector(
              `.${info.homeClassList.author}`
            );
            if (!author) return !1;
            const str = `\n作者==${author.innerText}`,
              newDelText = settings.delClassArr.value + str;
            return (
              (delClassArr = getDelClassArr(newDelText)),
              GM_setValue(settings.delClassArr.key, newDelText),
              !0
            );
          })(target)
        )
          return;
        delAd(getAd(queryNum, delClassArr), !1, !1);
      }
    }),
      (hasDelUpBtn = !0);
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
    let newVal = value,
      val = getVal ? getVal(key) : localStorage.getItem(key);
    return (
      void 0 !== base &&
        null == val &&
        ((val = base),
        "string" != typeof base && (base = JSON.stringify(base)),
        setVal ? setVal(key, base) : localStorage.setItem(key, base)),
      null !== newVal &&
        ("function" != typeof verification ||
          ((newVal = verification(newVal, val)), null !== newVal)) &&
        newVal !== val &&
        ("string" != typeof newVal && (newVal = JSON.stringify(newVal)),
        setVal ? setVal(key, newVal) : localStorage.setItem(key, newVal),
        !0)
    );
  }
  function showSettings() {
    const oldSettings = JSON.stringify(settings);
    getData();
    const curSettings = JSON.stringify(settings);
    info.settingsArea
      ? oldSettings !== curSettings &&
        (info.settingsArea.doms.wrap.remove(),
        (info.settingsArea = createEditEle(getEditInfo())))
      : (info.settingsArea = createEditEle(getEditInfo())),
      updateData(),
      videoObj.updateData();
    const callback = {
      resetBefore: () => confirm("是否重置所有设置项为默认值?"),
      confirmBefore: () => {},
      finished: (data) => {
        console.log(data);
        if (
          !(function isValueChange() {
            const curData = getAllData();
            return JSON.stringify(curData) !== JSON.stringify(cfg.oldData);
          })()
        )
          return;
        const changeObj = {};
        for (const key in settings) changeObj[key] = !1;
        for (const pageName in data) {
          const page = data[pageName];
          for (const key in page) {
            const value = page[key];
            let verifyFn;
            const flag = key.replace(info.keyBase, ""),
              item = settings[flag];
            switch (key) {
              case settings.homeDelAdTime.key:
                verifyFn = (newVal) =>
                  (newVal = +newVal) >= 0
                    ? newVal
                    : settings.homeDelAdTime.base;
                break;
              case settings.addVideoNum.key:
                verifyFn = (newVal) =>
                  (newVal = +newVal) >= 0 ? newVal : settings.addVideoNum.base;
                break;
              case settings.videoNumRule.key:
                verifyFn = (newVal) => newVal.replaceAll(" ", "").toLowerCase();
                break;
              case settings.delClassArr.key:
              case settings.video_delSetting.key:
                verifyFn = (newVal) => newVal.replaceAll(" ", "");
            }
            if (!item) return void console.log("设置的数据对应的对象获取失败");
            changeObj[flag] = setValue({
              value,
              base: item.base,
              key,
              verification: verifyFn,
              getValue: GM_getValue,
              setValue: GM_setValue,
            });
          }
        }
        getData();
        const changeArr = (function getTrueArr(obj) {
          const arr = [];
          for (const key in obj) obj[key] && arr.push(key);
          return arr;
        })(changeObj);
        if ("视频" === info.pageName)
          (changeArr.includes("video_delSetting") ||
            changeArr.includes("video_isDelAd")) &&
            (videoObj.updateData(),
            videoObj.getAd(),
            settings.video_isDelAd.value
              ? videoObj.delAd()
              : videoObj.showAd());
        else if ("首页" === info.pageName) {
          (function hasCommonItems(arr1, arr2) {
            for (let i = 0; i < arr1.length; i++)
              if (arr2.includes(arr1[i])) return !0;
            return !1;
          })(changeArr, [
            "isCarousel",
            "isAutoLayout",
            "isClearAd",
            "isTrueEnd",
            "isLoadOne",
          ])
            ? main(!1)
            : (updateData(),
              changeArr.includes("isReorderVideo") && setStyle(),
              changeArr.includes("videoNumRule") &&
                (function rearrange(rule) {
                  (videoNumRule = getVideoNumRule(rule)),
                    zoomPage(),
                    setStyle();
                })(settings.videoNumRule.value),
              changeArr.includes("delClassArr") &&
                (function updateVideo(delClass) {
                  (delClassArr = getDelClassArr(delClass)),
                    delAd(getAd(queryNum, delClassArr), !1, !1);
                })(settings.delClassArr.value),
              changeArr.includes("isDelUpBtn") &&
                settings.isDelUpBtn.value &&
                (createDelUpBtn(), addDelUpBtnCss(), bindDelUpBtnEvent()));
        }
      },
    };
    showEditArea(!0, callback);
  }
  let pageName = (function getBiliPageType() {
    const url = window.location.href,
      hostname = window.location.hostname,
      pathname = window.location.pathname;
    return "www.bilibili.com" !== hostname ||
      ("/" !== pathname && "/index.html" !== pathname)
      ? url.includes("www.bilibili.com/video")
        ? "视频"
        : "search.bilibili.com" === hostname
        ? "搜索"
        : "space.bilibili.com" === hostname
        ? "主页"
        : url.includes("t.bilibili.com") ||
          url.includes("www.bilibili.com/opus")
        ? "动态"
        : url.includes("www.bilibili.com/read")
        ? "专栏"
        : url.includes("www.bilibili.com/bangumi")
        ? "番剧"
        : "live.bilibili.com" === hostname
        ? "直播"
        : "message.bilibili.com" === hostname && "/" === pathname
        ? "消息"
        : "其他"
      : "首页";
  })(window.location);
  if (
    ((info.pageName = pageName),
    ("首页" !== pageName && "视频" !== pageName) ||
      (getData(),
      GM_registerMenuCommand("设置", () => {
        showSettings();
      }),
      GM_registerMenuCommand("脚本主页", () => {
        !(function openUrl(url) {
          let tempALink = document.createElement("a");
          tempALink.setAttribute("target", "_blank"),
            tempALink.setAttribute("id", "openWin"),
            tempALink.setAttribute("href", url),
            document.body.appendChild(tempALink),
            document.getElementById("openWin").click(),
            document.body.removeChild(tempALink),
            tempALink.remove();
        })(info.scriptUrl);
      })),
    "首页" === pageName)
  )
    main();
  else if ("视频" === pageName) {
    setTimeout(() => {
      videoObj.init();
    }, videoObj.info.startTime);
    let url = window.location.href;
    const pathInterval = videoObj.info.pathInterval;
    setInterval(() => {
      url !== window.location.href &&
        ((url = window.location.href),
        setTimeout(() => {
          videoObj.init();
        }, videoObj.info.startTime));
    }, pathInterval);
  }
})();