// ==UserScript==
// @name         百度贴吧ui美化,赛尔号吧专用
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  美化你的贴吧UI
// @author       张嘉凯
// @homepageURL  https://github.com/bilibili-niang/oilMonkeyScript
// @match        https://tieba.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @license MIT
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/less.js/4.2.0/less.min.js
// @downloadURL https://update.greasyfork.org/scripts/478379/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7ui%E7%BE%8E%E5%8C%96%2C%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%A7%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/478379/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7ui%E7%BE%8E%E5%8C%96%2C%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%A7%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==
$(document).ready(() => {
  if (PageData.forum.id == "2173925") {
    console.log("贴吧美化开始~");
    console.log("目前仅支持赛尔号吧");
    addStyle();
  }
  // removeElement();
  imgResolve();
});


/**
 * css隐藏某些元素
 */
const addStyle = function () {
  // 动态加载远程Less文件
  // 确保 Less.js 已经加载
  if (typeof less === "undefined") {
    console.error("Less.js 没有正确加载");
  } else {
    $.ajax({
      url: "https://gitee.com/icestone9/oilMonkeyScript/raw/main/tieBaSaier/index.less",
      // url: "http://localhost:3000/css/tieba.less",
      dataType: "text",
      crossDomain: true,  // 允许跨域请求
      success: function (lessCode) {
        console.log("远程less加载成功");
        // 创建style标签用于插入解析后的CSS代码
        const styleNode = document.createElement("style");
        styleNode.setAttribute("type", "text/css");

        // 使用Less.js解析Less代码并插入到style标签中
        less.render(lessCode, function (err, output) {
          if (err) {
            console.error("Less解析错误:", err);
            return;
          }
          styleNode.textContent = output.css;
          // 将style标签添加到页面头部
          document.head.appendChild(styleNode);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("加载Less文件失败:", textStatus, errorThrown);
        console.log("备用方案:");
        // 调用css字符串
        // 创建一个包含CSS样式的字符串
        const cssString = "html.light {--color: #7a7374;--activeColor: #381924;--color-bleak: #7a7374;--bac: #ffffff;--bac-bleak: rgba(0, 0, 0, 0.1) !important;}html.dark {--activeColor: #ed5a65;--color: #dad4cb;--color-bleak: rgba(218, 212, 203, 0.6);--bac: #1f2024;--bac-bleak: rgba(255, 255, 255, 0.1) !important;}.width {max-width: 75vw;min-width: 55vw;}html, body {scroll-bahavior: smooth !important;overflow-x: hidden !important;}.skin_normal .wrap1 {background-color: var(--bac) !important;}.hide {display: none !important;}.aside .region_cnt:nth-child(1) {display: none !important;}.tbui_fbar_auxiliaryCare, .gift-goin, #head, #com_userbar, .j_click_close, .label_text, a.j_click_stats, div.card_info, li.tbui_fbar_feedback, .zyq_mod_link, .app_download_box, .pre_icon_wrap_theme2 {display: none !important;}.celebrity {display: none !important;}div {border-radius: 0.7rem;}* {transition-duration: 0.5s;font-family: PingFangSC !important;}.card_banner {width: 100vw !important;top: 0;left: 50%;transform: translateX(-50%);}.head_content {max-width: 75vw;min-width: 55vw;width: 100% !important;}.card_top_wrap {max-width: 75vw;min-width: 55vw;margin: 0 auto;display: flex;flex-direction: row-reverse;justify-content: flex-end;}.card_top_wrap .card_top {width: 100%;height: fit-content !important;}.card_top_wrap .card_top .card_head {padding: 0;margin: 14px !important;position: unset !important;}.card_top_wrap .card_top_right {float: unset !important;}.card_top_theme .card_top {padding: 0 !important;}.content {background: rgba(255, 255, 255, 0.7);max-width: 75vw;min-width: 55vw;width: 100% !important;}.content * {font-size: 1.4rem !important;}.content .forum_content {border: none;display: flex;flex-direction: row;}.content .main #content_wrap {display: flex;flex-direction: row;width: 100%;flex: 1 !important;}.content .main #content_wrap div:nth-child(1) {width: 100%;}.content #content_leftList {width: 100%;}.forum_content .main {width: 100% !important;}.button {border-radius: 2.7rem !important;}.radio {border-radius: 1.4rem;}.focus_btn, .media_left, .media_left>.head_img {border-radius: 1.4rem;overflow: hidden;}.col2_left .j_threadlist_li_left span {text-align: center;font-size: 15px;justify-content: flex-start;background: none !important;}.focus .j_tbnav_tab {border-radius: 0.7rem !important;background: rgba(255, 255, 255, 0.7) !important;}.focus .j_tbnav_tab:hover {color: #c21f30;background: none !important;}.focus .j_tbnav_tab a:hover {color: #c21f30;background: none !important;}.j_tbnav_tab {transition-duration: 0.3s;}.card_head {border-radius: 1.4rem;}#j_head_focus_btn {position: relative;background: none !important;}#j_head_focus_btn:after {position: absolute;top: 0;left: 0;content: '关注/取消';color: #fff;font-size: 12px;}.threadlist_rep_num {background: var(--bac) !important;color: var(--color) !important;font-size: 0.75rem;}.threadlist_rep_num:hover {transform: scale(1.7);}.threadlist_rep_num:nth-child(1) {font-size: 1.1rem;}.threadlist_rep_num:nth-child(2) {font-size: 1rem;}.card_top_wrap, .nav_wrap {background: none !important;border: none !important;}.nav_wrap {display: flex;flex-direction: column;max-width: 75vw;min-width: 55vw;margin: 0 auto;height: fit-content !important;}.nav_list li.focus a {background: none !important;color: rgba(194, 31, 48, 0.5);transition-duration: 0.5s;}.nav_list li.focus a:hover {color: #c21f30;}.tbui_aside_float_bar {margin: 0 !important;position: fixed;bottom: 14px !important;right: 14px !important;left: unset !important;}.tbui_aside_float_bar li {border-radius: 1.4rem !important;overflow: hidden !important;}.tbui_aside_float_bar li:hover {transform: scale(1.2);}a {color: rgba(194, 31, 48, 0.5) !important;}a:hover {color: #c21f30 !important;}.search_internal_wrap {height: fit-content;display: flex;align-items: center;}.search_internal_wrap input {border: 2px solid rgba(69, 159, 251, 0.5);border-radius: 5px;background: var(--bac);color: var(--color);padding-top: 0.4rem;padding-bottom: 0.4rem;}.search_internal_wrap button.search_internal_btn {border-radius: 1.4rem;margin-left: 0.7rem;background: none !important;display: flex;align-items: center;}.search_internal_wrap button.search_internal_btn i:before {content: '搜索';color: var(--color);}.search_internal_wrap button.search_internal_btn i:before:hover {color: #c21f30;}.threadlist_bright .threadlist_abs_onlyline, .threadlist_bright .threadlist_abs {width: 100%;overflow: hidden;color: #666;}ul#thread_list img {min-height: 200px !important;min-width: 200px !important;}"
        // 创建一个新的<style>元素
        const styleElement = document.createElement("style");
        // 将CSS字符串设置为<style>元素的文本内容
        styleElement.type = "text/css";
        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = cssString;
        } else {
          styleElement.appendChild(document.createTextNode(cssString));
        }
        // 将<style>元素插入到文档头部
        document.getElementsByTagName("head")[0].appendChild(styleElement);
      }
    });
  }
};

/**
 * js移除指定元素
 */
const removeElement = function () {
  const classList = [".tbui_fbar_auxiliaryCare", ".gift-goin", "#head", "#com_userbar", "#pagelet_encourage-celebrity/pagelet/celebrity"];
  $.each(classList, function (index, className) {
    $(`${className}`).remove();
  });
};

const imgResolve = function () {
  console.log("imgResolve");
  $("img").each((index,item) => {
    let original = $(item).data("original");
    $(item).attr("src", original);
  });
};
