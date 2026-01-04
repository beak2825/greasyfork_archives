// ==UserScript==
// @name         Juejin Gangjin Block
// @namespace    https://github.com/stanye/UserScripts/
// @version      0.1.4
// @description  屏蔽钢筋
// @author       stanye
// @include      /^https?:\/\/(\w+\.)?juejin\.im\//
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383029/Juejin%20Gangjin%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/383029/Juejin%20Gangjin%20Block.meta.js
// ==/UserScript==

$.noConflict();
(($) => {
    'use strict';

    let blockList = localStorage.getItem('juejin-blocklist');
    blockList = JSON.parse(blockList) || [];

    const blockTask = () => {
      blockList.forEach((id) => {
        // block当前人的item
        $(`.username[href="/user/${id}"]`).parents('.item').remove();
      });
    }

    const setUrlToLocalStorage = (url) => {
      const id = url && url.split('/')[2];
      let blockList = localStorage.getItem('juejin-blocklist');
      blockList = JSON.parse(blockList) || [];
      if (!blockList.includes(id)) {
        blockList.push(id);
      }
      localStorage.setItem('juejin-blocklist', JSON.stringify(blockList));
    }

    const block = function() {
      let item = $(this).parents('.item');
      if (item.length === 0) item = $(this).parents('.pin-header-row');
      const username = item.find('.username');
      const url = username.attr('href');
      setUrlToLocalStorage(url);
      item.remove();
    }

    const bigblock = function() {
      const url = location.pathname;
      setUrlToLocalStorage(url);
      window.location.href = 'https://juejin.im';
    }

    const addBlockButtonInList = () => {
      const menuNode = $('.pin-header-more.header-menu')[0];
      let scope;
      if (menuNode) {
        scope = menuNode.attributes.item(0).nodeName;
      }

      $('.header-menu .dropdown-menu').each(function() {
        if ($(this).has('.block-btn').length === 0) {
          // 获取当前btn的scope
          $(this).append(`<li ${scope} class="block-btn">Block</li>`);
        }
      })
    }

    const addBlockButtonInProfile = () => {
      const menuNode = $('.user-info-block .action-box')[0];
      let scope;
      if (menuNode) {
        scope = menuNode.attributes.item(0).nodeName;
      }

      const actionBox = $('.user-info-block .action-box');
      if (actionBox.has('.big-block-btn').length === 0) {
        actionBox.append(`<button ${scope} class="follow-btn btn big-block-btn" style="color: red;">Block</button>`);
      }
    }

    const addBlockButtonInCommentList = () => {
      const menuNode = $('.comment .action-box')[0];
      let scope;
      if (menuNode) {
        scope = menuNode.attributes.item(0).nodeName;
      }

      const actionBox = $('.comment .action-box');
      actionBox.each(function() {
        if ($(this).has('.block-action').length === 0) {
          // 获取当前btn的scope
          $(this).prepend(`<div ${scope} class="block-action action" style="color: red">Block</div>`);
        }
      })
    }

    const startClear = () => {
      addBlockButtonInList();
      addBlockButtonInProfile();
      addBlockButtonInCommentList();
      blockTask();
    }

    $('#juejin').on('click', '.block-btn', block);

    $('#juejin').on('click', '.block-action', block);

    $('#juejin').on('click', '.big-block-btn', bigblock);

    $(window).on('scroll', () => {
      startClear();
    });

    setTimeout(startClear, 1000);
})(jQuery);

