// ==UserScript==
// @name         豆瓣图书跳转 ZLibrary
// @description  在豆瓣图书页面增加直接跳转 ZLibrary 搜索结果页的选项
// @author       Melo Guo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @include      https://book.douban.com/subject/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @copyright    2021 Melo Guo
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436046/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E8%B7%B3%E8%BD%AC%20ZLibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/436046/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E8%B7%B3%E8%BD%AC%20ZLibrary.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Config
  const CONTAINER_SELECTOR = '#buyinfo-printed > ul.bs.current-version-list'
  const BOOK_NAME_SELECTOR = '#wrapper > h1 > span[property="v:itemreviewed"]'
  const VENDOR_NAME_SELECTOR = 'div.vendor-name > a'
  const PRICE_SELECTOR = 'div.cell.impression_track_mod_buyinfo > div.cell.price-wrapper > a'
  const PRICE_TEXT_CLASS_NAME = 'buylink-price'
  const BUTTON_SELECTOR = 'div.cell.impression_track_mod_buyinfo > div.cell .buy-book-btn'
  const BUTTON_CLASS_NAME = 'buy-book-btn'
  const BUTTON_COLOR = '#1890ff'
  const BUTTON_BACKGROUND_COLOR = '#fff'

  $(document).ready(start);

  function start() {
    const bookName = getBookName()
    const $container = getContainerComponent()
    const $listItem = getListItemComponent($container)
    const $vendorName = getVendorNameComponent(bookName)
    const $price = getPriceComponent(bookName)
    const $button = getButtonComponent(bookName)

    $listItem.find(VENDOR_NAME_SELECTOR).replaceWith($vendorName)
    $listItem.find(PRICE_SELECTOR).replaceWith($price)
    $listItem.find(BUTTON_SELECTOR).replaceWith($button)
    $container.append($listItem)
  }

  function getContainerComponent() {
    return $(CONTAINER_SELECTOR)
  }

  function getListItemComponent(containerComponent) {
    return containerComponent.find('li').last().clone()
  }

  function getBookName() {
    return $(BOOK_NAME_SELECTOR).text()
  }

  function getLinkComponent(bookName) {
    const linkAttributes = {
      target: '_blank',
      href: 'https://1lib.us/s/' + bookName + '?'
    }
    return $('<a />').attr(linkAttributes)
  }

  function getVendorNameComponent(bookName) {
    const $vendorName = $('<span />').text('ZLibrary')
    return getLinkComponent(bookName).append($vendorName)
  }

  function getPriceComponent(bookName) {
    const $price = $('<span />')
      .attr('class', PRICE_TEXT_CLASS_NAME)
      .text('免费')
    return getLinkComponent(bookName).append($price)
  }

  function getButtonComponent(bookName) {
    const $button = $('<span />')
      .text('搜索电子书')

    const hoverIn = function () {
      $(this).css({
        background: BUTTON_COLOR,
        color: BUTTON_BACKGROUND_COLOR,
      })
    }

    const hoverOut = function () {
      $(this).css({
        background: BUTTON_BACKGROUND_COLOR,
        color: BUTTON_COLOR
      })
    }

    return getLinkComponent(bookName)
      .attr('class', BUTTON_CLASS_NAME)
      .css('color', BUTTON_COLOR)
      .hover(hoverIn, hoverOut)
      .append($button)
  }
})();