// ==UserScript==
// @name          哔哩哔哩新版首页排版调整和去广告(bilibili)
// @namespace     http://tampermonkey.net/
// @version       1.3.10
// @author        Ling2Ling4
// @description   对新版B站首页的每行显示的视频数量进行调整, 同时删除所有广告, 并可设置屏蔽内容 (大尺寸屏幕每行将显示更多的视频)
// @license MIT
// @icon data:image/png;base64,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
// @match         *://www.bilibili.com/*
// @exclude       *://www.bilibili.com/all*
// @exclude       *://www.bilibili.com/video*
// @exclude       *://www.bilibili.com/anime*
// @exclude       *://www.bilibili.com/pgc*
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
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/479057/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E6%8E%92%E7%89%88%E8%B0%83%E6%95%B4%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%28bilibili%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479057/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E6%8E%92%E7%89%88%E8%B0%83%E6%95%B4%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%28bilibili%29.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  // >>>>> 请在浏览器右上角的油猴插件的设置面板中设置该插件的部分功能 <<<<<

  // 类名表 (或选择器)
  const classMap = {
    标题: "h3 a",
    作者: "bili-video-card__info--owner", // 含日期. 仅作者: bili-video-card__info--author
    分类: "floor-title",
    carousel: "recommended-swipe", // 轮播图
    vDom: ["container", "no-banner-container", "is-version8"], // 视频区域 的容器元素
    video: "feed-card", // 换一换的视频 (一般是前十个)
    nav: "bili-header__bar", // 导航栏的元素
    banner: "bili-header__banner", // 横幅背景的元素
    btn: "roll-btn", // 右侧换一换按钮
    btn2: "flexible-roll-btn", // 新版右下角换一换按钮
  };
  let vDom, nav, banner, carousel;

  // 默认值
  const base_isClearAd = true; // 是否删除'广告'(屏蔽视频). 默认 true
  const base_isTrueEnd = false; // 是否将广告移至预加载视频的后面. 默认 false
  const base_isAutoLayout = true; // 是否根据缩放自动布局 (是否根据像素宽度布局). 默认 true
  const base_isLoadOne = false; // 是否视频全加载. 默认 false
  const base_isCarousel = true; // 是否显示轮播图. 默认 true
  const base_videoNumRule =
    "0,1300,2; 1300,1800,3; 1800,3000,4; 3000,3700,5; 3700,6300,6"; // 视频排列规则, 其他尺寸按照初始方式排列
  const base_videoNumRule2 =
    "0,1300,4; 1300,1800,5; 1800,3000,6; 3000,3700,7; 3700,6300,8"; // 无轮播图
  const base_delClassArr = "广告, 推广"; // 屏蔽的类名列表, 子元素包含某类名也可屏蔽

  let isClearAd,
    isTrueEnd,
    isAutoLayout,
    isLoadOne,
    isCarousel,
    videoNumRule,
    delClassArr;

  // console.log(isClearAd, isTrueEnd, isLoadOne, videoNumRule, delClassArr);

  // 屏蔽的类名表
  const delClassMap = {
    广告: "bili-video-card__info--ad",
    推广: "bili-video-card__info--creative-ad",
    特殊: "floor-single-card",
    直播: "living", // 分类=直播
    番剧: "分类=番剧",
    综艺: "分类=综艺",
    课堂: "分类=课堂",
    漫画: "分类=漫画",
    国创: "分类=国创",
    电影: "分类=电影",
    纪录片: "分类=纪录片",
    电视剧: "分类=电视剧",
  };
  // 设置的文本
  const settingText = {
    isClearAd: `是否删除广告, 若不删除则会将所有广告移至视频列表的最后
默认: ${base_isClearAd ? "是 (确定)" : "否 (取消)"}
当前: `,
    isTrueEnd: `是否将广告移至预加载视频的后面, 关闭后广告将放置在预加载视频的前面 一般视频的后面. 开启的效率更高
默认: ${base_isTrueEnd ? "是 (确定)" : "否 (取消)"}
当前: `,
    isAutoLayout: `是否根据缩放自动调整视频布局
默认: ${base_isAutoLayout ? "是 (确定)" : "否 (取消)"}
当前: `,
    isLoadOne: `是否在进入网站时加载视口区域的全部视频, 开启时视频将会全部加载, 但会闪一下
默认: ${base_isLoadOne ? "是 (确定)" : "否 (取消)"}
当前: `,
    isCarousel: `是否显示轮播图 (注: 修改此项后需要调整排列规则以适应新的布局,每行显示视频数+-2即可)
默认: ${base_isCarousel ? "是 (确定)" : "否 (取消)"}
当前: `,
    delClassArr: `屏蔽设置, 可根据需要自行修改, 可自定义, 每项用 ; 分隔
----默认:
${base_delClassArr}
----可选: ('特殊'包含了直播 番剧 课堂...)
广告、推广、特殊、直播、番剧、综艺、课堂、漫画、国创、电影、纪录片、电视剧
----自定义:
1. 标题=xxx, 可屏蔽标题含xxx的视频, xxx部分支持&&运算符, 如: 标题=A&&B, 表示屏蔽标题同时含有A B内容的视频
2. 作者=xxx, 可屏蔽作者名和发布日期中含xxx的视频`,
    videoNumRule: `视频排列规则, 每条规则用 ; 分隔. 其他尺寸按照初始方式排列
示例: 1450,2400,4 表示浏览器宽度在1450~2400像素时每行显示4个视频(前两行)
默认:
${base_videoNumRule} (有轮播图)
${base_videoNumRule2} (无轮播图)`,
  };
  const errKeyArr = ["", "_2"];
  const errKeyInfo = {
    disNum: "setting_err_disNum",
    errNum: "setting_err_num",
    errTime: "setting_err_time",
    isTip: "setting_err_isTip",
  };
  const disErrTipNum = 3; // 每小段报错弹窗提醒次数 (短时间内的提醒次数)
  const errTipNum = 5 * disErrTipNum; // 报错弹窗的总提醒次数
  const errTipInterval = 2; // 每段报错弹窗提醒时间间隔(小时)
  const errNumReset = 5; // 报错次数重置的天数
  const queryNum = 0; // 处理的视频数量, 对前 queryNum 个视频中的广告进行处理(删除或置后), 0表示对全部视频进行处理. 默认 0
  const marginTop1 = 40; // 第三行视频的上边距
  const marginTop2 = 24; // 第四行及以上视频的上边距
  const zoom = window.devicePixelRatio; // 获取浏览器缩放 (包括显示器缩放的影响)

  let cssDom;
  let cssText;
  let oldCssText;
  let isChange = false; // 每行视频数是否需要变化
  let showVideoNum = 3; // 当前每行显示的视频数 (以第一行为准), 网站默认值为3
  let videoNum = 0; // 视频总数
  let newVideoNum = 0; // 新获取的视频总数
  let firstAdIndex = 0; // 第一个广告的索引
  let pageZoom = 1; // 页面缩放

  initValue();
  getDoms();
  if (!vDom) {
    return;
  }
  let w = getW(); // 浏览器视口宽度
  videoNum = getVideoNum(vDom); // 计算当前视频总数
  let adArr = getAd(queryNum, delClassArr, newVideoNum, 1);
  delAd(adArr, vDom); // 将所有广告放置在最后 或 删除
  setTimeout(() => {
    delAdFn();
    loadTopVideo();
  }, 1000);
  zoomPage(); // 缩放页面
  setStyle(); // 调整视频排列
  resetErrInfo(); // 重置err相关的数据

  let rollBtn, btnSvg, rollBtn2;
  // 刷新视频
  function handleClick() {
    if (!rollBtn) {
      adArr = getAd(
        showVideoNum * 3 + (carousel ? 2 : 0),
        delClassArr,
        newVideoNum,
        1
      );
      delAd(adArr, vDom);
      rollBtn = document.querySelector("button." + classMap.btn); // 换一换按钮
      btnSvg = rollBtn && rollBtn.querySelector("svg"); // 换一换按钮的旋转图标
      // 点击按钮后对新视频中的广告进行处理
      if (btnSvg) {
        btnSvg.addEventListener("transitionend", () => {
          // console.log("视频刷新成功");
          adArr = getAd(
            showVideoNum * 3 + (carousel ? 2 : 0) + 3,
            delClassArr,
            newVideoNum,
            1
          );
          !isTrueEnd &&
            adArr.forEach((item) => {
              item.forEach((adItem) => {
                adItem.style.display = "block";
              });
            });
          delAd(adArr, vDom);
        });
      } else {
        rollBtn &&
          rollBtn.addEventListener("click", () => {
            setTimeout(() => {
              adArr = getAd(
                showVideoNum * 3 + (carousel ? 2 : 0) + 3,
                delClassArr,
                newVideoNum,
                1
              );
              delAd(adArr, vDom);
            }, 500);
          });
      }
    }
    if (!rollBtn2) {
      adArr = getAd(queryNum, delClassArr, newVideoNum, 1);
      delAd(adArr, vDom);
      rollBtn2 = document.querySelector("." + classMap.btn2); // 新版右下角的换一换按钮
      // 点击按钮后对新视频中的广告进行处理
      rollBtn2 &&
        rollBtn2.addEventListener("click", () => {
          setTimeout(() => {
            videoNum = getVideoNum(vDom); // 计算当前视频总数
            firstAdIndex = 0;
            adArr = getAd(
              queryNum,
              delClassArr,
              0,
              1,
              isTrueEnd ? true : false
            );
            delAd(adArr, vDom, true); // 强制删除广告
            loadTopVideo();
          }, 800);
        });
    }
    if (rollBtn && rollBtn2) {
      window.removeEventListener("click", handleClick);
    }
  }
  window.addEventListener("click", handleClick);

  // 窗口调整后重新计算视频的行数量
  let timer;
  window.addEventListener("resize", () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      // console.log("窗口改变");
      const newW = getW();
      if (newW > w) {
        delAdFn(); // 若新增广告则删除
      }
      w = newW;
      zoomPage();
      setStyle();
    }, 400);
  });

  // 加载的新视频去除广告
  let timer2, timer3;
  window.addEventListener("wheel", () => {
    timer2 && clearTimeout(timer2);
    timer3 && clearTimeout(timer3);
    timer2 = setTimeout(() => {
      delAdFn(timer3);
    }, 600);
    timer3 = setTimeout(() => {
      delAdFn();
    }, 1500);
  });

  GM_registerMenuCommand("基础设置", () => {
    basicSetting(settingText);
  });
  GM_registerMenuCommand("屏蔽设置", () => {
    delSetting(settingText);
  });
  GM_registerMenuCommand("排列规则", () => {
    layoutSetting(settingText);
  });
  GM_registerMenuCommand("重置设置", () => {
    resetSettings();
  });

  // 获取视口宽度
  function getW() {
    let width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    // console.log("显示器缩放:", zoom);
    console.log("浏览器实际宽度:", width * window.devicePixelRatio);
    console.log("浏览器像素宽度:", width * zoom);
    !isAutoLayout && (width *= window.devicePixelRatio);
    return width;
  }

  function initValue() {
    isClearAd = getValue("setting_isClearAd", base_isClearAd);
    isTrueEnd = getValue("setting_isTrueEnd", base_isTrueEnd);
    isAutoLayout = getValue("setting_isAutoLayout", base_isAutoLayout);
    isLoadOne = getValue("setting_isLoadOne", base_isLoadOne);
    isCarousel = getValue("setting_isCarousel", base_isCarousel);
    delClassArr = getValue("setting_delClassArr", base_delClassArr);
  }

  function getDoms() {
    if (typeof classMap.vDom === "string") {
      vDom = document.querySelector("." + classMap.vDom);
    } else {
      classMap.vDom.forEach((item) => {
        !vDom && (vDom = document.querySelector("." + item));
      });
    }
    if (!vDom) {
      vDom = document.querySelector("." + classMap.video).parentElement;
    }
    carousel = vDom.querySelector("." + classMap.carousel);
    nav = document.querySelector("." + classMap.nav);
    banner = document.querySelector("." + classMap.banner);

    videoNumRule = getValue(
      "setting_videoNumRule",
      //carousel && isCarousel ? base_videoNumRule2 : base_videoNumRule
      base_videoNumRule2
    );
    if (!isCarousel) {
      carousel.style.display = "none";
      carousel = false;
    }
  }

  // 缩放页面 至消除横向滚动条
  function zoomPage() {
    if (document.getBoxObjectFor) {
      return; // 火狐不支持zoom, 而用scale会有bug
    }
    const rootDom = document.documentElement;
    let rate = rootDom.scrollWidth / getMainW();
    !document.body.style.overflow &&
      (document.body.style.overflow = "hidden auto");
    if (rate > 1) {
      // 存在横向滚动条
      pageZoom *= 1 / rate;
      rootDom.style.zoom = pageZoom;
    } else {
      pageZoom = 1;
      rootDom.style.zoom = 1;
      rate = rootDom.scrollWidth / getMainW();
      if (rate > 1) {
        pageZoom *= 1 / rate;
        rootDom.style.zoom = pageZoom;
      }
    }
    // 主区域的宽度, 部分时候总宽(导航栏)会大于主区域的宽度
    function getMainW() {
      let navW = nav ? nav.scrollWidth : 0;
      let bannerW = banner ? banner.scrollWidth : 0;
      return navW > bannerW ? navW : rootDom.clientWidth;
    }
  }

  /**
   * 获取所有的 推广 和 广告 的元素的列表
   * @param {*} queryNum 需要检索的视频数量
   * @param {Array} delClassArr 需要删除的类名列表
   * @param {*} vNum 视频总数
   * @param {*} startIndex 检索的视频的起始索引位
   * @param {Boolean} isAll 是否检索预加载视频以及后面的视频
   * @returns {Array} 含各类广告列表的列表 [[...],[...],...]
   */
  function getAd(queryNum, delClassArr, vNum, startIndex = 1, isAll = false) {
    const arr = [];
    delClassArr.forEach(() => {
      arr.push([]);
    });
    const vList = [].slice.call(vDom.children);
    let len = vNum || vList.length;
    len = len > vList.length ? vList.length : len;
    queryNum = queryNum || len; // 0则全检索
    queryNum += startIndex;
    if (queryNum > len) {
      queryNum = len;
    }
    // console.log("queryNum, vNum, startIndex, len\n",queryNum,vNum,startIndex,len);
    for (let i = startIndex; i < queryNum; i++) {
      const vItem = vList[i];
      // console.log(i, item);
      if (!isAll && !vItem.querySelector("a")) {
        break; // 如果是预加载的视频
      }
      for (let j = 0; j < delClassArr.length; j++) {
        if (isChecked(vItem, delClassArr[j])) {
          arr[j].push(vItem);
          break;
        }
      }
    }
    // console.log("广告列表:", arr);
    return arr;
  }

  // 删除广告 或 放置在最后
  function delAd(adArr, dom = vDom, isDel = false) {
    for (let i = adArr.length - 1; i >= 0; i--) {
      delInArr(adArr[i]);
    }
    function delInArr(arr) {
      arr.forEach((item) => {
        if (isClearAd || isDel) {
          item.remove();
          newVideoNum--;
          videoNum--;
        } else {
          if (isTrueEnd) {
            dom.appendChild(item); // 放在最后 (预加载视频后)
          } else {
            dom.insertBefore(item, dom.children[newVideoNum]); // 放在预加载视频前
          }
        }
      });
    }
  }

  // 设置浏览器宽度在某个范围时[左闭右开], 每行显示的视频数
  function setVideoNum(vRule) {
    const min = +vRule[0] / (isAutoLayout ? zoom : 1);
    const max = +vRule[1] / (isAutoLayout ? zoom : 1);
    const num = +vRule[2];
    // console.log(min, max, num, ">", w);
    if ((min !== 0 && !min) || !max || !num) {
      errHandle({
        errTxt: `插件设置的视频排列规则设置中 '${vRule.join("")}' 格式书写错误`,
        key: errKeyArr[1], // 2
      });
      return;
    }
    if (w >= min && w < max) {
      cssText = carousel
        ? `.container {grid-template-columns: repeat(${num + 2},1fr) !important}
.container>div:nth-child(n){margin-top:${marginTop2}px !important}
.container>div:nth-child(-n+${
            num * 3 + 2 + 1
          }){margin-top:${marginTop1}px !important;display:block !important}
.container>div:nth-child(-n+${(num + 1) * 2 - 1}){margin-top:0px !important}`
        : `.container {grid-template-columns: repeat(${num},1fr) !important}
.container>div:nth-child(n){margin-top:${marginTop2}px !important}
      `;
      isChange = true;
      showVideoNum = num;
      // console.log("每行 " + num + " 个视频");
    }
    if (!isChange) {
      cssText = ""; // 默认排列方式
      showVideoNum = carousel ? 5 : 3;
    }
  }

  // 调整每行显示个数
  function setStyle() {
    isChange = false; // 每行视频数是否需要变化
    videoNumRule.forEach((item) => {
      setVideoNum(item);
    });
    if (isChange) {
      let isCssDom = !!cssDom; // 是否已添加style
      if (!isCssDom) {
        cssDom = document.createElement("style");
        cssDom.setAttribute("type", "text/css");
      }
      oldCssText !== cssText && (cssDom.innerHTML = cssText);
      oldCssText = cssText;
      !isCssDom && vDom.parentElement.insertBefore(cssDom, vDom);
    } else {
      // 尺寸缩小时触发
      if (!isChange && cssDom) {
        oldCssText = "";
        cssDom.innerHTML = "";
      }
    }
  }

  // 获取视频总数
  function getVideoNum(dom) {
    const arr = [].slice.call(dom.children);
    const len = arr.length;
    let i;
    let isGetAdIndex = false;
    for (i = 1; i < len; i++) {
      const item = arr[i];
      // 获取第一个广告的索引
      if (!isTrueEnd && !isGetAdIndex) {
        const vItem = dom.children[i];
        for (let j = 0; j < delClassArr.length; j++) {
          if (isChecked(vItem, delClassArr[j])) {
            isGetAdIndex = true;
            firstAdIndex = i;
            break;
          }
        }
      }
      // 如果是预加载视频
      if (!item.querySelector("a")) {
        newVideoNum = i;
        return i;
      }
    }
    newVideoNum = i;
    return i;
  }

  // 判断是否是查找的目标
  function isChecked(vEle, delStr) {
    let flag = false;
    const map = classMap;
    delStr = delClassMap[delStr] || delStr;
    // 自定义的屏蔽内容
    function custom(txt, type, selector) {
      const dom = vEle.querySelector(selector);
      if (!dom) {
        return;
      }
      const domTxt = dom.innerText;
      const txtArr = txt.replace(type, "").split("&&");
      if (!txtArr[0]) {
        return;
      }
      let f = false;
      txtArr.forEach((item) => {
        f = f || domTxt.includes(item, "");
      });
      flag = flag || f;
    }
    if (delStr.includes("标题=")) {
      custom(delStr, "标题=", map.标题);
    } else if (delStr.includes("作者=")) {
      custom(delStr, "作者=", "." + map.作者);
    } else if (delStr.includes("分类=")) {
      custom(delStr, "分类=", "." + map.分类);
    } else {
      flag = flag || vEle.classList.contains(delStr);
      try {
        flag = flag || vEle.querySelector("." + delStr);
      } catch (e) {
        errHandle({
          errTxt: `插件设置的屏蔽设置中 '${delStr}' 格式书写错误应以 '标题=' 或 '作者=' 开头`,
          e,
        });
      }
    }
    return flag;
  }

  // 根据视频总数是否变化删除广告
  function delAdFn(timer = null) {
    getVideoNum(vDom);
    if (newVideoNum > videoNum) {
      console.log("加载新视频");
      adArr = getAd(
        queryNum,
        delClassArr,
        newVideoNum,
        isTrueEnd ? videoNum : firstAdIndex
      );
      delAd(adArr, vDom);
      videoNum = newVideoNum;
      timer && clearTimeout(timer);
    }
  }

  // 加载顶部位置的接下来的一组视频
  function loadTopVideo() {
    isLoadOne && document.documentElement.scrollTo(0, 400);
    isLoadOne &&
      setTimeout(() => {
        document.documentElement.scrollTo(0, 0);
        setTimeout(() => {
          delAdFn();
        }, 800);
      }, 20);
  }

  // 获取存储的值, 并解析成对应数据类型
  function getValue(key, defa = "") {
    let value = GM_getValue(key);
    if (key === "setting_videoNumRule") {
      if (value !== undefined && value !== null) {
        value = getVideoNumRule(value);
      } else {
        defa = getVideoNumRule(defa);
      }
    } else if (key === "setting_delClassArr") {
      if (value !== undefined && value !== null) {
        value = getDelClassArr(value);
      } else {
        defa = getDelClassArr(defa);
      }
    }
    return value === undefined || value === null ? defa : value;
  }

  // 解析数据字符串为对应数据类型
  function getDelClassArr(value) {
    value = value.replaceAll("\n", "").replaceAll(" ", "");
    return value.split(/;|；|,|，/);
  }
  function getVideoNumRule(value) {
    value = value.split(/;|；/);
    return value.map((item) => item.split(/,|，/));
  }

  // 基础设置
  function basicSetting(txt) {
    const val = {
      v1: GM_getValue("setting_isLoadOne"),
      v2: GM_getValue("setting_isAutoLayout"),
      v3: GM_getValue("setting_isCarousel"),
      v4: GM_getValue("setting_isClearAd"),
    };
    GM_setValue(
      "setting_isLoadOne",
      confirm(
        txt.isLoadOne +
          ((val.v1 === undefined ? base_isLoadOne : val.v1)
            ? "是 (确定)"
            : "否 (取消)")
      )
    );
    GM_setValue(
      "setting_isAutoLayout",
      confirm(
        txt.isAutoLayout +
          ((val.v2 === undefined ? base_isAutoLayout : val.v2)
            ? "是 (确定)"
            : "否 (取消)")
      )
    );
    GM_setValue(
      "setting_isCarousel",
      confirm(
        txt.isCarousel +
          ((val.v3 === undefined ? base_isCarousel : val.v3)
            ? "是 (确定)"
            : "否 (取消)")
      )
    );
    const isClearAd = confirm(
      txt.isClearAd +
        ((val.v4 === undefined ? base_isClearAd : val.v4)
          ? "是 (确定)"
          : "否 (取消)")
    );
    GM_setValue("setting_isClearAd", isClearAd);
    if (!isClearAd) {
      const value = GM_getValue("setting_isTrueEnd");
      GM_setValue(
        "setting_isTrueEnd",
        confirm(
          txt.isTrueEnd +
            ((value === undefined ? base_isTrueEnd : value)
              ? "是 (确定)"
              : "否 (取消)")
        )
      );
    } else {
      GM_setValue("setting_isTrueEnd", base_isTrueEnd);
    }
    history.go(0); // 刷新页面
  }

  // 屏蔽设置
  function delSetting(txt) {
    const value = GM_getValue("setting_delClassArr");
    const newValue = prompt(
      txt.delClassArr,
      value === undefined || value === null ? base_delClassArr : value
    );
    GM_setValue("setting_delClassArr", newValue || value);
    delClassArr = getDelClassArr(newValue || value);
    let adArr = getAd(queryNum, delClassArr, newVideoNum, 1);
    delAd(adArr, vDom);
  }

  // 视频排列规则的设置
  function layoutSetting(txt) {
    const value = GM_getValue("setting_videoNumRule");
    const newValue = prompt(
      txt.videoNumRule,
      value === undefined || value === null ? base_videoNumRule : value
    );
    GM_setValue("setting_videoNumRule", newValue || value);
    videoNumRule = getVideoNumRule(newValue || value);
    zoomPage(); // 缩放页面
    setStyle(); // 调整视频排列
  }

  // 重置设置
  function resetSettings() {
    GM_setValue("setting_isClearAd", base_isClearAd);
    GM_setValue("setting_isTrueEnd", base_isTrueEnd);
    GM_setValue("setting_isAutoLayout", base_isAutoLayout);
    GM_setValue("setting_isLoadOne", base_isLoadOne);
    GM_setValue("setting_videoNumRule", base_videoNumRule);
    GM_setValue("setting_delClassArr", base_delClassArr);
    GM_setValue(errKeyInfo.errNum, 0);
    errKeyArr.forEach((key) => {
      GM_setValue(errKeyInfo.disNum + key, 0); // 重置
    });
    history.go(0); // 刷新页面
  }

  // 错误处理
  function errHandle({ e = null, errTxt = "", logTxt = "", key = "" } = {}) {
    let errNum = GM_getValue(errKeyInfo.errNum) || 0;
    if (errNum >= errTipNum) {
      return;
    }
    let disErrNum = GM_getValue(errKeyInfo.disNum + key) || 0;
    const curTime = Date.now();
    const errTime = GM_getValue(errKeyInfo.errTime + key) || curTime;
    let disS = (curTime - errTime) / 1000;
    disS = disS === 0 ? 5 : disS;
    if (disS < 5) {
      return;
    }
    let flag = GM_getValue(errKeyInfo.isTip + key); // 是否能弹窗提示
    flag = flag === undefined ? true : flag;
    e && console.log(e);
    console.log(logTxt || errTxt);
    if (disS >= errTipInterval * 60 * 60) {
      // 每errTipInterval小时允许提醒disErrTipNum次
      flag = true;
      GM_setValue(errKeyInfo.isTip + key, true);
      GM_setValue(errKeyInfo.disNum + key, 0);
    }
    if (
      flag &&
      disErrNum <= disErrTipNum &&
      disS < (errTipInterval / 10) * 60 * 60
    ) {
      // 在errTipInterval/10小时内允许disErrTipNum次提示
      errNum++;
      disErrNum++;
      GM_setValue(errKeyInfo.errNum, errNum);
      GM_setValue(errKeyInfo.disNum + key, disErrNum);
      GM_setValue(errKeyInfo.errTime + key, curTime);
      alert(errTxt);
      disErrNum === disErrTipNum && GM_setValue(errKeyInfo.isTip + key, false);
    }
  }

  // 重置err相关的数据
  function resetErrInfo() {
    const curTime = Date.now();
    const errTime = errKeyArr.reduce((a, b) => {
      const t = +GM_getValue(errKeyInfo.errTime + b);
      return t < a ? t : a;
    }, curTime);
    if ((curTime - errTime) / 1000 >= errNumReset * 24 * 60 * 60) {
      GM_setValue(errKeyInfo.errNum, 0); // 重置
      errKeyArr.forEach((key) => {
        GM_setValue(errKeyInfo.disNum + key, 0); // 重置
      });
      // console.log("重置err相关的数据");
    }
  }
})();
