// ==UserScript==
// @name         掘金收藏夹辅助 - 搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  掘金收藏夹重度用户专用，增加了收藏夹高度，优化输入框样式并支持模糊搜索
// @author       Jason up
// @match        https://juejin.im/*
// @match        https://juejin.cn/*
// @grant        none
// @license      MIT
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455104/%E6%8E%98%E9%87%91%E6%94%B6%E8%97%8F%E5%A4%B9%E8%BE%85%E5%8A%A9%20-%20%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/455104/%E6%8E%98%E9%87%91%E6%94%B6%E8%97%8F%E5%A4%B9%E8%BE%85%E5%8A%A9%20-%20%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(() => {
  'use strict'
  const onCollectionListSeachChange = function (e) {
    const search = $(this).val().trim()
    if (search == '')
      $('.collection-list-modal .list-item').show()
    $(`.collection-list-modal .list-item .name:contains(${search})`).parent().parent().parent().show()
    console.log(`.collection-list-modal .list-item .name:not(:contains(${search}))`)
    $(`.collection-list-modal .list-item .name:not(:contains(${search}))`).parent().parent().parent().hide()
  }
  const onCollectionListOpen = function () {
    $('.collection-list-modal').css('top', '-200px')
    $('.collection-list-modal .list').css('height', '600px')
    const collectionListSeach = $('<label>搜索：</label><input id="collectionListSeach" style="flex: 1;border: 1px solid #ccc;border-radius: 3px;padding: 4px 8px;" />')
    $(collectionListSeach).on('input', onCollectionListSeachChange)
    $('.collection-list-modal .sub-title').attr('style', 'display: flex;align-items: center;gap: 8px;margin: 16px 24px')
    $('.collection-list-modal .sub-title').html(collectionListSeach)
    // 展开全部收藏夹列表
    $('.collection-list-modal .list').animate({ scrollTop: 9999 }, 3000)
    $('.collection-list-modal .list').animate({ scrollTop: 0 })
  }
  window.onload = function () {
    const collectBtn = $('.panel-btn')
    collectBtn.unbind('click', onCollectionListOpen)
    collectBtn.bind('click', onCollectionListOpen)
  }
})()