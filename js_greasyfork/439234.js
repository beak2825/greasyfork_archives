// ==UserScript==
// @name         超星网课挂科模式
// @namespace    https://userscript.snomiao.com
// @version      0.2
// @description  自动签到，自动统计未完成作业、未完成任务等、提前解锁章节，查看章节统计。我是热爱学习的好孩子，（配合超星网课助手可自动观看课程、自动完成作业等）
// @author       snomiao@gmail.com
// @match        *://*.chaoxing.com/*
// @match        *://mobilelearn.chaoxing.com/*
// @match        *://mooc1-1.chaoxing.com/*
// @match        *://i.mooc.chaoxing.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/439234/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E6%8C%82%E7%A7%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/439234/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E6%8C%82%E7%A7%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

// 课程列表
// http://mooc1-1.chaoxing.com/visit/interaction
//
//
// 开发中
//
///////////////////////////////
// 防多开
// var genId = '' + Math.random()

///////////////////////////////
// 异步组件
var 睡 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var 异步防抖函数 = (异步函数, 间隔时间 = 1000) => {
  var 上次执行时间 = null;
  return async (...参列) => {
    if (上次执行时间 != null && 上次执行时间 + 间隔时间 >= +new Date())
      return null;
    上次执行时间 = +new Date();
    return await 异步函数(参列);
  };
};

// 对象操作
var 深合并 = (t, s) =>
  (t instanceof Object &&
    ([...Object.keys(s)].forEach((k) => (t[k] = 深合并(t[k], s[k]))), t)) ||
  (undefined === s && t) ||
  s;
var 键值对列转对象 = (键值对列) =>
  键值对列.reduce((a, b) => ((a[b[0]] = b[1]), a), {});
var 全部提取 = (str, reg) => {
  if (!reg.global) return null;
  var coll = [];
  while (((e) => e && coll.push(e))(reg.exec(str)));
  return coll;
};
var 提取为表 = (html, 正则表达式, 键值对函数) => ({
  ...键值对列转对象(全部提取(html, 正则表达式).map(键值对函数)),
});

///////////////////////////////
// FETCH
var GETHTML = async (url) => await (await fetch(url)).text();

// 存储
var 加载状态 = () => {
  try {
    var r = JSON.parse(GM_getValue("超星网课挂科模式"));
  } catch (e) {}
  console.log("加载状态", r);
  return r || {};
};
var 保存状态 = (json = {}) => {
  GM_setValue("超星网课挂科模式", JSON.stringify(json));
};
var 更新状态 = (函数) => 保存状态(函数(加载状态()));
var 合并状态 = (函数) => {
  var 状态 = 加载状态();
  保存状态(深合并(状态, 函数(状态)));
};

///////////////////////////////
// 更新状态

// 课程列表
var 取课程表地址 = () => `http://mooc1-1.chaoxing.com/visit/interaction`;
var 更新课程表 = (html) =>
  合并状态((状态) => ({
    课程表: 提取为表(
      html,
      /<a .*?courseId=(\d+).*?clazzid=(\d+).*?title="(.*?)"[\s\S]*?<p title="(.*?)">/g,
      ([_, courseId, clazzid, title, 教师]) => [
        clazzid,
        { courseId, classId: clazzid, title, 教师 },
      ]
    ),
  }));

// 作业列表
var 取作业表地址 = ({
  classId,
  courseId,
  isdisplaytable,
  mooc,
  ut,
  enc,
  cpi,
  openc,
}) =>
  `https://mooc1-1.chaoxing.com/work/getAllWork?classId=${classId}&courseId=${courseId}&isdisplaytable=${isdisplaytable}&mooc=${mooc}&ut=${ut}&enc=${enc}&cpi=${cpi}&openc=${openc}`;
var 更新作业表 = (html) =>
  合并状态((状态) => ({
    课程表: 提取为表(html, /id="cid" value="(\d+)"/g, ([_, classId]) => [
      classId,
      { t检查作业表: +new Date() },
    ]),
    作业表: 提取为表(
      html,
      /<a.*?href="(.*?courseId=(\d+).*?classId=(\d+).*?workId=(\d+)(?:.*?workAnswerId=(\d+))?.*?)".*?title="(.*?)"[\s\S]*?开始时间.*>(.*?)<[\s\S]*?截止时间.*?>(.*?)<[\s\S]*?作业状态[\s\S]*?<strong>\s*(.*?)\s*?</g,
      ([
        _,
        url,
        courseId,
        classId,
        workId,
        workAnswerId,
        title,
        开始时间,
        截止时间,
        作业状态,
      ]) => [
        workId,
        {
          url,
          courseId,
          classId,
          workId,
          workAnswerId,
          title,
          开始时间,
          截止时间,
          作业状态,
        },
      ]
    ),
  }));
// 签到列表
var 取签到表地址 = ({ courseId, classId }) =>
  `https://mobilelearn.chaoxing.com/widget/pcpick/stu/index?courseId=${courseId}&jclassId=${classId}`;
var 更新签到表 = (html) => {
  var 课程表 = 提取为表(
    html,
    /id="puid" value="(.*?)"[\s\S]*?id="courseId" value="(.*?)"[\s\S]*?id="classId" value="(.*?)"[\s\S]*?id="fid" value="(.*?)"[\s\S]*?id="activeId" value="(.*?)"[\s\S]*?id="appType" value="(.*?)"/g,
    ([_, puid, courseId, classId, fid, activeId, appType]) => [
      classId,
      {
        puid,
        courseId,
        classId,
        fid,
        activeId,
        appType,
        t更新签到表: +new Date(),
      },
    ]
  );
  var { puid, courseId, classId, fid, activeId, appType } =
    Object.values(课程表)[0];
  合并状态((状态) => ({
    课程表,
    签到表: 提取为表(
      html,
      /activeDetail\((\d+),2,null\)[\s\S]*?<dd class="green">(.*?)<[\s\S]*?<a.*?>(.*?)</g,
      ([_, activeId, type, title]) => [
        activeId,
        {
          activeId,
          type,
          title,
          puid,
          courseId,
          classId,
          fid,
          activeId,
          appType,
        },
      ]
    ),
  }));
};

// 更新签到状态
// 普通签到
var 取普通签到地址 = ({ activeId, classId, fid = "", courseId }) =>
  `https://mobilelearn.chaoxing.com/widget/sign/pcStuSignController/preSign?activeId=${activeId}&classId=${classId}&fid=${fid}&courseId=${courseId}`;
// 手势签到
var 取手势签到地址 = ({ courseId, classId, activeId }) =>
  `https://mobilelearn.chaoxing.com/widget/sign/pcStuSignController/signIn?&courseId=${courseId}&classId=${classId}&activeId=${activeId}`;
var 更新签到状态 = (html) =>
  合并状态((状态) => ({
    签到表: 提取为表(
      html,
      /id="activeId".*?"(.*?)"[\s\S]*?id="activeStatus".*?"(.*?)"[\s\S]*?id="courseId".*?"(.*?)"[\s\S]*?id="classId".*?"(.*?)"[\s\S]*?id="puid".*?"(.*?)"[\s\S]*?id="createUid".*?"(.*?)"[\s\S]*?id="fid".*?"(.*?)"[\s\S]*?<span.*?>(.*?)<\/span><em id="st">(.*?)</g,
      ([
        _,
        activeId,
        activeStatus,
        courseId,
        classId,
        puid,
        createUid,
        fid,
        statusText,
        succTimeRaw,
      ]) => [
        activeId,
        {
          activeId,
          activeStatus,
          courseId,
          classId,
          puid,
          createUid,
          fid,
          statusText,
          succTimeRaw,
          t签到成功: +new Date(),
        },
      ]
    ),
  }));
// 二维码、位置、拍照签到
// https://mobilelearn.chaoxing.com/pptSign/stuSignajax
var 更新签到状态2 = (html, href) =>
  合并状态((状态) => ({
    签到表: 提取为表(
      html + "~" + href,
      /(.*?)~.*?activeId=(\d+)/g,
      ([_, status, activeId]) => [
        activeId,
        { activeId, status, t签到成功: +new Date() },
      ]
    ),
  }));

// 更新课程状态
var 取课程首页地址 = () =>
  `https://mooc1-1.chaoxing.com/mycourse/studentcourse?courseId=${courseId}&clazzid=${clazzid}&vc=${vc}&cpi=${cpi}&enc=${enc}`;
var 更新课程首页 = (html) =>
  合并状态((状态) => ({
    课程表: 提取为表(
      html,
      /id="cid" value="(\d+)"[\s\S]*?(?:(待完成任务点))?/g,
      ([_, activeId, 待完成任务点]) => [
        activeId,
        { 待完成状态: !!待完成任务点, t完成状态: +new Date() },
      ]
    ),
  }));

var 更新当前页面状态 = () => {
  if (location.pathname == "/visit/interaction")
    更新课程表(document.body.innerHTML, location.href);
  if (location.pathname == "/mycourse/studentcourse")
    更新课程首页(document.body.innerHTML, location.href);
  //
  if (location.pathname == "/work/getAllWork")
    更新作业表(document.body.innerHTML, location.href);
  //
  if (location.pathname == "/widget/pcpick/stu/index")
    更新签到表(document.body.innerHTML, location.href);
  if (location.pathname == "/widget/sign/pcStuSignController/preSign")
    更新签到状态(document.body.innerHTML, location.href);
  if (location.pathname == "/widget/sign/pcStuSignController/signIn")
    更新签到状态(document.body.innerHTML, location.href);
  if (location.pathname == "/pptSign/stuSignajax")
    更新签到状态2(document.body.innerHTML, location.href);
};

var 自动签到 = async () => {
  var 状态 = 加载状态();
  // 4分半钟检查一次签到
  var 未知签到课程列 = [...Object.values(状态.课程表 || {})].filter(
    (课程) => (课程.t检查签到表 || 课程.t更新签到表 || 0) + 270e3 <= +new Date()
  );
  合并状态(() => ({
    课程表: 键值对列转对象(
      未知签到课程列.map(({ classId }) => [
        classId,
        { t检查签到表: +new Date() },
      ])
    ),
  }));
  var 课程;
  while ((课程 = 未知签到课程列.shift())) {
    const 地址 = 取签到表地址(课程);
    console.debug("正在检查签到列表", 课程, 地址);
    更新签到表(await GETHTML(地址));
    await 睡(3e3);
  }

  // 5 秒尝试一次签到
  var 未完成签到列 = [...Object.values(状态.签到表 || {})]
    .filter((签到) => (签到.t尝试签到 || 0) + 5e3 <= +new Date())
    .filter((签到) => !(签到.succTime || 签到.succTimeRaw || 签到.t签到成功));
  合并状态(() => ({
    签到表: 键值对列转对象(
      未完成签到列.map(({ activeId }) => [activeId, { t尝试签到: +new Date() }])
    ),
  }));
  var 签到;
  while ((签到 = 未完成签到列.shift())) {
    let 地址;
    if (签到.title.match("手势")) {
      地址 = 取手势签到地址(签到);
    } else {
      地址 = 取普通签到地址(签到);
    }
    console.debug("正在签到", 签到, 地址);
    // window.open(地址 + "#自动关闭")
    更新签到状态(await GETHTML(地址));
    await 睡(3e3);
  }
};
///////////////////////////////////////////////////////////////

var main = async () => {
  更新当前页面状态();
  var 状态 = 加载状态();

  var 未完成作业 = [...Object.values(状态.作业表)].filter(
    (e) => e.作业状态 != "已完成"
  );

  if (
    location.hostname == "mobilelearn.chaoxing.com" &&
    decodeURI(location.hash) == "#巡逻自动签到"
  ) {
    console.log("[超星网课挂科模式] 启动巡逻自动签到");
    var 间隔自动签到 = 异步防抖函数(自动签到, 270e3); // 最快四分半钟检查一次签到
    setInterval(async () => {
      document.body.innerHTML = new Date(+new Date()) + "#自动签到运行中...";
      if (null !== (await 间隔自动签到())) {
        console.log(new Date(), "4分半钟后重新运行");
      }
    }, 1e3);
  }
  if (decodeURI(location.hash) == "#自动签到") {
    var iframe = document.createElement("iframe");
    iframe.src = "https://mobilelearn.chaoxing.com/";
    document.body.appendChild(a);
  }
  if (decodeURI(location.hash) == "#自动巡逻") {
    console.log("3分钟后重新运行");
    setTimeout(main, 180e3);
  }
  if (decodeURI(location.hash) == "#自动关闭") {
    window.close();
  }
};

window.addEventListener("load", main);
