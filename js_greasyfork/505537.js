// ==UserScript==
// @name 屏蔽腾讯新闻广告
// @version 1.2
// @author ChatGPT
// @description 屏蔽腾讯新闻广告。
// @match https://new.qq.com/*
// @match https://view.inews.qq.com/*
// @match https://xw.qq.com/*
// @run-at document-start
// @grant none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/505537/%E5%B1%8F%E8%94%BD%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/505537/%E5%B1%8F%E8%94%BD%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// 需要转换的带有"##"前缀的 CSS 选择器列表
const adBlockList = `##div.ad-cell-common
##[style*="0vw"][style*="0vh"][style*="0px"]
##.VideoArticleBottomAdContainer,.ssp.nospl[data-boss-once='true'],DIV[data-boss-expo*='ad&s_or'],DIV[id^='App_WAP_share_page_']
##[class*="bottom-bar"]
##div[class^="bottom-bar_buttonWrap__"]
##div[class^="slider-top-bar_sliderWrapper__"]
###opeApp
##[class^='ad_ssp']
##A[dt-eid^='em_item_ad']
##.elevator[class^="jsx-"]`;

// 解析处理输入列表，生成适当的 CSS 规则
const selectors = adBlockList
 .split('\n') // 用换行符将文本分成数组中的项
 .map(item => item.trim()) // 清除每个项的空白字符
 .filter(item => item.startsWith('##')) // 确保只使用以'##'开头的项
 .map(item => item.substring(2)) // 去除'##'前缀
 .join(',\n'); // 将所有选择器组合成一个字符串，并用逗号隔开

// 创建一个包含解析后选择器的<style>标签，将元素的 display 属性设为 none
const styleBlock = document.createElement('style');
styleBlock.innerHTML = `${selectors} { display: none !important; }`;

// 最后将<style>标签添加到文档的<head>中
document.head.appendChild(styleBlock);