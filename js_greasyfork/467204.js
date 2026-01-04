// ==UserScript==
// @name        手机百度搜索净化
// @version     3.7
// @author      大萌主
// @description  在手机百度搜索结果页面隐藏广告和推荐内容和禁止搜索结果自动播放和禁止复制粘贴板口令，提升搜索体验。
// @match       https://m.baidu.com/*
// @match       https://www.baidu.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/467204/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467204/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

// 需要转换的带有"##"前缀的 CSS 选择器列表
const adBlockList = `##[srcid='ai_agent_qa_recommend']
##.ec_wise_ad *
##.cos-rich-video-player-video
##[srcid='jy_bdb_in_store_service_2nd']
##.ec-result-inner
##.ad-wrapper
##[srcid='car_kg2_san']
##[srcid='fw_on_newsite_three_san']
##[srcid='sp_board_danpin']
##[srcid='sp_price_list']
##[srcid='sp_xuangou']
##[srcid='sp_brand_rank']
##[srcid='ai_agent_recommend']
##[srcid^='xcx_']
##[srcid='guanfanghao']
##[srcid='note_lead']
##DIV#page-relative.se-page-relative
##[data-video-player='true']
##[srcid^='app_mobile_simple']
##[srcid='sp_purc_atom']
##[srcid='zk_sc_header']
##[srcid='med_wz']
##[srcid='fw_on_newsite_three']
##[srcid='wenda_inquiry']
##[srcid='b2b_straight_wise_vertical']
##[srcid='b2b_straight_wise_vertical_na']
##DIV.c-container.ec-container
##[data-tpl='adv_wenku_fc']
##[srcid='med_wz_aitest']
##[srcid='med_disease_drug']
##[srcid='fw_on_single_site']
##[srcid='sp_purc_san']
##[srcid='b2b_goods_wholesale']
##[tpl='recommend_list_san']
##[srcid='yl_recommend_list']`;

// 解析处理输入列表，生成适当的 CSS 规则
const selectors = adBlockList
  .split('\n')                                  // 用换行符将文本分成数组中的项
  .map(item => item.trim())                     // 清除每个项的空白字符
  .filter(item => item.startsWith('##'))        // 确保只使用以'##'开头的项
  .map(item => item.substring(2))               // 去除'##'前缀
  .join(',\n');                                 // 将所有选择器组合成一个字符串，并用逗号隔开

// 创建一个包含解析后选择器的<style>标签，将元素的 display 属性设为 none
const styleBlock = document.createElement('style');
styleBlock.innerHTML = `${selectors} { display: none !important; }`;

// 最后将<style>标签添加到文档的<head>中
document.head.appendChild(styleBlock);

document.addEventListener('copy', function(e) {
  var copiedText = window.getSelection().toString();
  if (copiedText.startsWith('1.fu:/') || 
      copiedText.startsWith('#baiduhaokan') || 
      copiedText.includes(':/¥^')) {
    e.preventDefault(); // 阻止写入粘贴板
    console.log('禁止复制指定内容');
  }
});