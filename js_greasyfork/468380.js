// ==UserScript==
// @name         新浪微博热搜榜关键词屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  屏蔽微博热搜榜中tag为：剧集、综艺等明显买量条目,热搜广告,热搜关键词，可自定义标签及关键词
// @author       QIXIUQX
// @match        https://weibo.com/*
// @match        https://s.weibo.com/*
// @icon         https://www.sina.com.cn/favicon.ico
// @grant        none
// @license      GPL-3.0 License
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468380/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E6%A6%9C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/468380/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E6%A6%9C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
//

// 分类关键词列表
let adCategoryList = ["影视", "艺人", "音乐", "综艺"];
// 标签关键词列表
let adLabelList = ["综艺", "艺人","盛典"];
// 热搜title关键词列表
let adTitleList = ["肖战","王一博"];
// 热门样式类名
let classList = ["ad-rank1", "ad-rank2", "ad-rank3"];
// 热搜详情页面地址
let hotDetailPageUrl = "https://s.weibo.com/weibo?q=";

window.onload = () => {
  initialPage();
};

/**
 * 初始化页面数据
 */
function initialPage() {
  addHeadLink();
  getHotSearch();
  changeRankMorePath();
}

/**
 * 改变页面中查看完整热搜榜单的跳转地址
 */
function changeRankMorePath() {
  if (getCurrentPageUrl().indexOf(hotDetailPageUrl) !== -1) {
    $(".rank-more").attr({
      href: "https://weibo.com/hot/search",
      target: "_self",
    });
  }
}

/**
 * 分类是否存在于要被过滤的关键词列表中
 * @param {Array} adList 过滤列表
 * @param {string} category 分类
 * @returns {boolean} 需要被过滤返回true,不需要过滤返回false
 */
function isExistKeywords(adList, category) {
  let categoryList = category.split(",");
  let result = categoryList.filter((item) => {
    return adList.includes(item);
  });
  return result.length !== 0;
}
/**
 * 标题是否存在于要被过滤的关键词列表中
 * @param {Array} adTitleList 过滤列表
 * @param {string} title 分类
 * @returns {boolean} 需要被过滤返回true,不需要过滤返回false
 */
function isExistKeywordsFromTitle(adTitleList, title) {
  let exist = false;
  for (let index = 0; index < adTitleList.length; index++) {
    if (title.indexOf(adTitleList[index]) !== -1) {
      exist = true;
    }
  }
  return exist;
}

/**
 * 获取热搜列表
 */
function getHotSearch() {
  $.ajax({
    url: "https://weibo.com/ajax/side/hotSearch",
    data: {},
    type: "GET",
    cache: false,
    async: true,
    dataType: "json",
    success: function (data) {
      data = data.data.realtime;

      generateSideStr(data);
      generatePrimaryStr(data);
      // 热搜列表
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
}

/**
 * 生成热搜的主要页面数据
 * @param data {Array} 热搜数据
 */
function generatePrimaryStr(data) {
  let hotIdx = 0;
  let primaryHotSearchStr = "";
  data.forEach((hotItem) => {
    if (
      hotItem.ad_type === undefined &&
      !isExistKeywords(adCategoryList, hotItem.category || "") &&
      !isExistKeywords(adLabelList, hotItem.flag_desc || "") &&
      !isExistKeywordsFromTitle(adTitleList, hotItem.note)
    ) {
      hotIdx++;
      primaryHotSearchStr += `
        <div class="ad-hot-search-wrap">
          <div class="ad-hot-search-item">
            <div class="ad-item-content">
              <span class="ad-hot-topic-idx ${getClassName(hotIdx)}">${hotIdx}</span>
              <a href="https://s.weibo.com/weibo?q=%23${hotItem.word}%23" class="ad-hot-topic-tit" target="_blank">${hotItem.note}</a>
              <span class="ad-hot-topic-num">
                <span>搜索量</span>
                <span>${hotItem.num}</span>
              </span>
            </div>
            <div class="ad-item-type-label">
              ${generateHotSearchICONDescStr(hotItem)}
              ${generateHotSearchCategoryStr(hotItem)}
              ${generateHotSearchFlagStr(hotItem)}
            </div>
          </div>
        </div>
        `;
    } else {
      console.log("被屏蔽:", hotItem);
    }
  });
  $("#scroller").html(primaryHotSearchStr);
}

/**
 * 生成热搜的侧边栏数据
 * @param {Array} data 热搜数组
 */
function generateSideStr(data) {
  let hotIdx = 0;
  let asideHotSearch = `
  <div class="ad-hot-search-wrap">
    <div class="ad-hot-search-item" style="padding: 6px 10px;">
      <div class="ad-item-content">
        <a href="https://weibo.com/hot/search" class="ad-hot-topic-tit" target="_blank" style="margin-right:0;font-size:18px;font-weight: 700;">查看完整热搜</a>
      </div>
    </div>
  </div>`;
  data.forEach((hotItem) => {
    if (
      hotItem.ad_type === undefined &&
      !isExistKeywords(adCategoryList, hotItem.category || "") &&
      !isExistKeywords(adLabelList, hotItem.flag_desc || "") &&
      !isExistKeywordsFromTitle(adTitleList, hotItem.note)
    ) {
      if (hotIdx < 10) {
        hotIdx++;
        asideHotSearch += `
          <div class="ad-hot-search-wrap">
            <div class="ad-hot-search-item" style="padding: 6px 10px;">
              <div class="ad-item-content">
                <span class="ad-hot-topic-idx ${getClassName(hotIdx)}">${hotIdx}</span>
                <a href="https://s.weibo.com/weibo?q=%23${
                  hotItem.word
                }%23" class="ad-hot-topic-tit" target="_blank" style="margin-right:0;font-size:14px;font-weight: 400;">${hotItem.note}</a>
              </div>
            </div>
          </div>
          `;
      }
    }
  });
  //侧边栏插入热搜
  $(".wbpro-side-main").html(asideHotSearch);
  // 热搜页侧边栏
  $(".wbpro-side-main>div:first-child div[class*='wbpro-side-card']").html(asideHotSearch);
}

/**
 * 获取当前页面的url地址
 * @returns {string} 当前页面的url地址
 */
function getCurrentPageUrl() {
  return location.href;
}

/**
 * 生成ICON描述
 * @param {object} hotItem 热搜数组的item
 * @returns {string} 类型拼接字符串
 */
function generateHotSearchICONDescStr(hotItem) {
  if (!hotItem.icon_desc) return "";
  return `
  <span class="ad-hot-topic-type user-select-off" style="background:${hotItem.icon_desc_color}">${hotItem.icon_desc}</span>
  `;
}

/**
 * 生成类型描述
 * @param {object} hotItem 热搜数组的item
 * @returns {string} 类型拼接字符串
 */
function generateHotSearchCategoryStr(hotItem) {
  if (!hotItem.category) return "";
  return `
  <span class="ad-hot-topic-type user-select-off" style="background:${hotItem.icon_desc_color}">类型：${hotItem.category}</span>
  `;
}

/**
 * 生成标签
 * @param {object} hotItem 热搜数组的item
 * @returns {string} 标签拼接字符串
 */
function generateHotSearchFlagStr(hotItem) {
  if (!hotItem.flag_desc) return "";
  return `
  <span class="ad-hot-topic-type user-select-off" style="background:${hotItem.icon_desc_color}">标签：${hotItem.flag_desc}</span>
  `;
}

/**
 * 获取热搜前三的序号背景颜色class
 * @param {number} hotIdx 热搜编号（编号从1开始）
 * @returns {string} 背景颜色class
 */
function getClassName(hotIdx) {
  hotIdx--;
  return hotIdx > 3 ? "" : classList[hotIdx];
}

/*******添加样式到页面中 *******/
/**
 *添加head中的style标签
 */
function addHeadLink() {
  let head = document.querySelector("head");
  let styleEl = addElStyle();
  head.appendChild(styleEl);
}

/**
 *
 * 添加css样式方法，脚本的所有css 都将在这里定义
 * @returns {HTMLStyleElement} css样式字符串
 */
function addElStyle() {
  let style = document.createElement("style");
  style.innerHTML = `
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: 0;
}

body {
  font-size: 16px;
  font-family: "Microsoft Yahei", "PingFang SC", "Helvetica Neue", Helvetica,
    STHeiTi, sans-serif;
  width: 100vw;
  height: 100vh;
  background-color: #f1f2f5;
}

a {
  text-decoration: none;
}

ul,
ol,
li {
  list-style: none;
}

img {
  vertical-align: middle;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

.ad-hot-search-wrap .ad-hot-search-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 16px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content {
  display: flex;
  align-items: center;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-hot-topic-idx,
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-hot-topic-tit,
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-hot-topic-num {
  margin: 0 0 0 10px;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-hot-topic-idx {
  padding: 2px 8px;
  font-size: 14px;
  background-color: #afb5c5;
  color: #fff;
  border-radius: 6px;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-rank1 {
  background-color: #f55050;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-rank2 {
  background-color: #fe7a1d;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-rank3 {
  background-color: #fcce4e;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-hot-topic-tit {
  margin-right: 100px;
  color: #333;
  font-size: 18px;
  font-weight: 700;
  transition: all ease 0.2s;
}
.ad-hot-search-wrap
  .ad-hot-search-item
  .ad-item-content
  .ad-hot-topic-tit:hover {
  color: #eb7350;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-content .ad-hot-topic-num {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #939393;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-type-label {
  margin: 10px 0 0 10px;
}
.ad-hot-search-wrap .ad-hot-search-item .ad-item-type-label .ad-hot-topic-type {
  padding: 0 3px;
  font-size: 14px;
  color: #fff;
  background-color: #ff3852;
  border-radius: 4px;
}

.user-select-off {
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
}
  `;
  return style;
}
