// ==UserScript==
// @name            [雪星实验室] Google Calendar 谷歌日历自动上色
// @name:zh         [雪星实验室] Google Calendar 谷歌日历自动上色
// @name:en         [SNOLAB] Google Calendar Colorize
// @namespace       https://userscript.snomiao.com/
// @version         0.1.4
// @description    【功能测试中, bug反馈：snomiao@gmail.com】Google日历自动上色、根据匹配到的关键词显示特定颜色，例如： 休|睡、洗漱|收拾|整理|日记|日志、研究|学习|探索|背词|了解、上学|上班|上课、健身|锻练|热身、路上|通勤、料理|做饭、仪式|典礼|祭祀、紧急|重要|考试|测验、群聊|交流|玩|游戏|知乎、电影|看书|阅书|影评，(20210709)加入英文支持
// @description:zh 【功能测试中, bug反馈：snomiao@gmail.com】Google日历自动上色、根据匹配到的关键词显示特定颜色，例如： 休|睡、洗漱|收拾|整理|日记|日志、研究|学习|探索|背词|了解、上学|上班|上课、健身|锻练|热身、路上|通勤、料理|做饭、仪式|典礼|祭祀、紧急|重要|考试|测验、群聊|交流|玩|游戏|知乎、电影|看书|阅书|影评，(20210709)加入英文支持
// @description:en 【Functional testing, bug feedback: snomiao@gmail.com】Google Calendar automatically color, according to the keywords matched to show specific colors, such as: rest|sleep, wash|pack|organize|diary|journal, research|study|explore|recite words|understand, school|work|class, fitness|workout|warm-up, on the road|commute, cooking|cooking ritual|ceremony|sacrifice, urgent|important|exam|quiz, group chat|communicate|play|game|know, movie|watch|read|review, (20210709) Add English support
// @author          snomiao@gmail.com
// @match           *://calendar.google.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439213/%5B%E9%9B%AA%E6%98%9F%E5%AE%9E%E9%AA%8C%E5%AE%A4%5D%20Google%20Calendar%20%E8%B0%B7%E6%AD%8C%E6%97%A5%E5%8E%86%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/439213/%5B%E9%9B%AA%E6%98%9F%E5%AE%9E%E9%AA%8C%E5%AE%A4%5D%20Google%20Calendar%20%E8%B0%B7%E6%AD%8C%E6%97%A5%E5%8E%86%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%89%B2.meta.js
// ==/UserScript==
//
// updates:
// (20220421) set the text color on dark background to white.
//
// [颜色名 — HTML颜色代码](https://htmlcolorcodes.com/zh/yanse-ming/)
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
// [LCH colors in CSS: what, why, and how? – Lea Verou](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
// [javascript - RGB to XYZ and LAB colours conversion - Stack Overflow](https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion)
// [rgb-lab/color.js at master · antimatter15/rgb-lab](https://github.com/antimatter15/rgb-lab/blob/master/color.js)
// [Color math and programming code examples](https://www.easyrgb.com/en/math.php)

globalThis.googleCalendarColorize?.unload?.();

const D65_2deg = [95.047, 100.0, 108.883];
const rad = (deg) => (deg / 180) * Math.PI;
const 向向内积 = (a, b) => a.map((_, i) => a[i] * b[i]).reduce((a, b) => a + b);
const 向向乘 = (a, b) => a.map((_, i) => a[i] * b[i]);
const 向数除 = (a, b) => a.map((_, i) => a[i] / b);
const lch2lab = (l, c, h_deg) => [
  l,
  Math.cos(rad(h_deg)) * c,
  Math.sin(rad(h_deg)) * c,
];
const lab2xyz = (l, a, b) => {
  let vy = (l + 16) / 116;
  let vx = a / 500 + vy;
  let vz = vy - b / 200;
  let xyz = [vx, vy, vz].map((v) =>
    v ** 3 > 0.008856 ? v ** 3 : (v - 16 / 116) / 7.787
  );
  return 向向乘(xyz, D65_2deg);
};
const xyz2srgb = (x, y, z) => {
  let vxyz = 向数除([x, y, z], 100);
  let vr = 向向内积(vxyz, [3.2406, -1.5372, -0.4986]);
  let vg = 向向内积(vxyz, [-0.9689, 1.8758, 0.0415]);
  let vb = 向向内积(vxyz, [0.0557, -0.204, 1.057]);
  return [vr, vg, vb]
    .map((v) => (v > 0.0031308 ? 1.055 * v ** (1 / 2.4) - 0.055 : 12.92 * v))
    .map((v) => v * 255);
};
const srgb2str = (r, g, b) =>
  `rgb(${[r, g, b].map((e) => Math.min(Math.max(0, e | 0), 255)).join(",")})`;
// const lch2str = (l, c, h) =>
//     srgb2str(...xyz2srgb(...lab2xyz(...lch2lab(l, c, h))));
const ss_lch2rgba_str = (l, c, h) =>
  srgb2str(...xyz2srgb(...lab2xyz(...lch2lab(l, c, h ** 1.2 * 300 + 30))));
// document.body.style.background = lch2str(100, 80, 30)
const 深色事件 = {
  // 一般红到青，如果写了就用写的颜色
  "urgent|important|exam|quiz|quarrel|accident|紧急|重要|考试|测验|吵架|事故":
    "red",
  "ritual|ceremony|sacrifice|仪式|典礼|祭祀": "",
  "groupchat|communication|know|blog|little red book|video|jitter|bilibili|B station|群聊|交流|知乎|微博|小红书|视频|抖音|bilibili|B站":
    "",
  "play|games|玩|游戏": "",
  "bill|payment|economic|账单|还款|经济": "",
  "Study|Memorize|Understand|Read|Movies|Watch|Read|Reviews|学习|背词|了解|阅读|电影|看书|阅书|影评|《":
    "",
  "Think|Research|R&D|Develop|Research|Explore|思考|科研|研发|开发|研究|探索":
    "",
};
const 浅色事件 = {
  // 从浅红到天蓝
  "shop|buy|购物|购买": "",
  "rest|sleep|休|睡": "",
  "shower|wash|clean|organizing|clean up|洗澡|洗漱|收拾|整理|大扫除": "",
  "workout|body building|warm up|cook|cook|eat|exercise|健身|锻练|热身|料理|做饭|吃|运动":
    "",
  "diary|schedule|journal|jour|日记|日程|日志": "",
  "maintenance|maintain|Operation|ops|Configuration|conf|维护|运维|配置": "",
  "On the road|commute|school|work|class|course|路上|通勤|上学|上班|上课|课程":
    "",
};
const 任务事件 = {
  // 从浅红到天蓝
  TODO: "",
  PENDING: "",
  DOING: "",
  DONE: "",
};
const lch表值色带转换 = (预设颜色表, s, e) =>
  Object.fromEntries(
    Object.entries(预设颜色表).map(([k, v], i, a) => [
      k,
      v || ss_lch2rgba_str(s, e, i / a.length),
    ])
  );
Object.assign(深色事件, lch表值色带转换(深色事件, 70, 80));
Object.assign(浅色事件, lch表值色带转换(浅色事件, 100, 20));
Object.assign(任务事件, lch表值色带转换(任务事件, 20, 20));

const 更新颜色 = () => {
  const 事件元素列 = [...document.querySelectorAll("div[data-eventid]")];
  const 颜色分析 = 事件元素列.map((e) => ({
    元素: e,
    文本: e.textContent.replace(/Organizer/g, ""),
    颜色: window.getComputedStyle(e).getPropertyValue("background-color"),
  }));
  // [[深色事件, 'black'], [浅色事件, 'white']].
  颜色分析.forEach(({ 元素, 文本 }) =>
    Object.keys(浅色事件)
      .filter((正则) => 文本.match(new RegExp(正则, "i")))
      .sort(
        (正则1, 正则2) =>
          文本.match(new RegExp(正则1, "i")).index -
          文本.match(new RegExp(正则2, "i")).index
      )
      .forEach((正则) => {
        元素.googleCalendarColorizeFlags = { 正则 };
        元素.style.backgroundColor = 浅色事件[正则];
        [...元素.querySelectorAll("span,div")].map(
          (e) => (e.style.color = "black")
        );
      })
  );
  颜色分析.forEach(({ 元素, 文本 }) =>
    Object.keys(深色事件)
      .filter((正则) => 文本.match(new RegExp(正则, "i")))
      .sort(
        (正则1, 正则2) =>
          文本.match(new RegExp(正则1, "i")).index -
          文本.match(new RegExp(正则2, "i")).index
      )
      .forEach((正则) => {
        // console.log(元素);
        元素.googleCalendarColorizeFlags = { 正则 };
        元素.style.backgroundColor = 深色事件[正则];
        [...元素.querySelectorAll("span,div")].map(
          (e) => (e.style.color = "white")
        );
      })
  );
};

更新颜色();

const 节流 =
  (间隔, 函数 = async () => null, 提示函数 = async () => null, 上次执行 = 0) =>
  async (...参数) =>
    +new Date() - 上次执行 > 间隔
      ? ((上次执行 = +new Date()), await 函数(...参数))
      : await 提示函数(...参数);
const 防抖 =
  (
    间隔,
    函数 = async () => null,
    提示函数 = async () => null,
    timerId = null
  ) =>
  (...参数) =>
    new Promise(
      (resolve) => (
        timerId && (clearTimeout(timerId), resolve(提示函数(...参数))),
        (timerId = setTimeout(() => resolve(函数(...参数)), 间隔))
      )
    );
const 节流防抖 = (间隔, 函数 = async () => null, 提示函数 = async () => null) =>
  节流(间隔, 函数, 防抖(间隔, 函数, 提示函数));
const 刷新函数 = 节流防抖(10e3 /* 10s */, () => !document.hidden && 更新颜色());
const 主动刷新函数 = 节流防抖(200, () => !document.hidden && 更新颜色());

// オブザーバインスタンスを作成
const 目标 = document.documentElement || document.body;
const 监视配置 = { attributes: false, childList: true, characterData: false };
const 页面变动监视器 = new MutationObserver((mutations) => {
  if (!mutations.some((record) => record.addedNodes.length)) return;
  页面变动监视器.disconnect();
  刷新函数();
  目标 && 页面变动监视器.observe(目标, 监视配置);
});
页面变动监视器.observe(目标, 监视配置);
const onvisibilitychange = () => setTimeout(刷新函数, 100);
const onmouseup = () => setTimeout(主动刷新函数, 100);
document.addEventListener("visibilitychange", onvisibilitychange, false);
document.addEventListener("mouseup", onmouseup, false);
document.addEventListener("keyup", () => setTimeout(主动刷新函数, 100), false);
window.addEventListener("load", 刷新函数, false);

刷新函数();
const unload = () => {
  页面变动监视器.disconnect();
  document.removeEventListener("visibilitychange", onvisibilitychange, false);
  document.removeEventListener("mouseup", onmouseup, false);
  document.removeEventListener(
    "keyup",
    () => setTimeout(主动刷新函数, 100),
    false
  );
  window.removeEventListener("load", 刷新函数, false);
};
globalThis.googleCalendarColorize = { unload };
