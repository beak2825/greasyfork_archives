// ==UserScript==
// @name        抖店开放平台脚本
// @namespace   Violentmonkey Scripts
// @match       https://op.jinritemai.com/docs/*
// @match       https://op.jinritemai.com/platform-notice/*
// @grant       none
// @version     1.0.4
// @author      -
// @description 2021/6/3下午11:25:37
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/427713/%E6%8A%96%E5%BA%97%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427713/%E6%8A%96%E5%BA%97%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const wrapperSetting = (wrapper) => {
    wrapper.css('width', '100%').css('padding', '0 64px');
  }

  const contentSetting = (content) => {
    content.css('max-width', 'calc(100% - 240px)');
  }

  const targetSetting = (target, target_prev) => {
    if (!["h2", "h3", "h4", "p"].includes(target_prev[0].tagName.toLowerCase())) {
      return;
    }

    target_prev.off('click').on('click', () => {
      if (target.css('display') == 'none') {
        target.css('display', '');
        popNotification(`显示${target_prev.text().replace('（已隐藏）', '')}`);
        target_prev.text(target_prev.text().replace('（已隐藏）', ''));
      } else {
        target.css('display', 'none');
        popNotification(`隐藏${target_prev.text()}`);
        target_prev.text(target_prev.text() + '（已隐藏）');
      }
    })
  }

  const popNotification = (msg, duration=1000) => {
    $('#yixi__noti_container').length == 0 && $('body').append('<div id="yixi__noti_container"></div>')
    let $msgBox = $(`<div class="yixi__noti_msg">${msg}</div>`)
    $('#yixi__noti_container').append($msgBox)
    $msgBox.slideDown(100)
    setTimeout(() => { $msgBox.fadeOut(500) }, duration)
    setTimeout(() => { $msgBox.remove() }, duration + 500)
  }

  const defaultStyle = `
  #yixi__noti_container {position:fixed;top:100px;left:10px;z-index:99;}
  .yixi__noti_msg {display:none;padding:10px 20px;font-size:14px;font-weight:bold;color:#fff;margin-bottom:10px;background:rgba(0,0,0,0.6);border-radius:10px;cursor:pointer;}
  `;

  const insertStyle = () => {
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(defaultStyle));
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  const init = () => {
    insertStyle();

    setInterval(() => {
      // 设置wrapper，移除宽度限制
      const wrapper = $($('main.ant-layout-content div[class^=wrapper]')[1]);
      wrapperSetting(wrapper);

      // 设置content，移除宽度限制
      const content = wrapper.find('div[class^=content]');
      contentSetting(content);

      // 取所有的 markdown，把他的子元素组成列表
      const markdown_content_list = [];
      content.find('div[class^=markdown]').each((index, element) => {
        $(element).children().each((idx, ele) => {
          markdown_content_list.push(ele);
        });
      });
      if (markdown_content_list.length < 2) return;
      for (let index = 1; index < markdown_content_list.length; index++) {
        const element = markdown_content_list[index];
        if (element.tagName.toLowerCase() == 'pre' || $(element).hasClass('ant-table-wrapper') || element.tagName.toLowerCase() == 'table') {
          // 示例 || 表格
          targetSetting($(element), $(markdown_content_list[index - 1]));
        }
      }
    }, 1000);
  }

  init();
})();