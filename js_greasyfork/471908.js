// ==UserScript==
// @name         使用“通过电脑下载USB传输”功能下载 Kindle 电子书
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  亚马逊 > 我的账户 > 管理我的内容和设备 > 内容 > 筛选“电子书”-“购买的商品” 下载当前页所有书籍
// @author       chenw
// @license      MIT
// @match        https://www.amazon.cn/hz/mycd/digital-console/contentlist/booksPurchases/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.cn
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/471908/%E4%BD%BF%E7%94%A8%E2%80%9C%E9%80%9A%E8%BF%87%E7%94%B5%E8%84%91%E4%B8%8B%E8%BD%BDUSB%E4%BC%A0%E8%BE%93%E2%80%9D%E5%8A%9F%E8%83%BD%E4%B8%8B%E8%BD%BD%20Kindle%20%E7%94%B5%E5%AD%90%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/471908/%E4%BD%BF%E7%94%A8%E2%80%9C%E9%80%9A%E8%BF%87%E7%94%B5%E8%84%91%E4%B8%8B%E8%BD%BDUSB%E4%BC%A0%E8%BE%93%E2%80%9D%E5%8A%9F%E8%83%BD%E4%B8%8B%E8%BD%BD%20Kindle%20%E7%94%B5%E5%AD%90%E4%B9%A6.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';
    function downloadBook(index) {
      if ( index > 24 ) {
        // 每页有 25 本书
        return
      }

      console.log('chenw downloadBook',index)

      var book = $('.ListItem-module_row__3orql')[index]
      var $otherAction = $(book).find('.Dropdown-module_container__S6U18')
      $otherAction.click() // 单击“更多操作”

      setTimeout(function() {
        var usb = $otherAction.find('div[id^=DOWNLOAD_AND_TRANSFER_ACTION]')[0]
        $(usb).click() // 单击“通过电脑下载USB传输”

        setTimeout(function() {
          var kindle = $otherAction.find('.ActionList-module_action_list_item__LoNyc')[2] // !!!重要!!!: 更改编号来更换设备: 0-KP1; 1-KO; 2-KP3
          var kindleRadio = $(kindle).find('div')[0]
          $(kindleRadio).find('input').click() // 选中设备

          setTimeout(function() {
              var download = $otherAction.find('div[id^=DOWNLOAD_AND_TRANSFER_ACTION]')[2]
              $(download).click() // 单击下载

              setTimeout(function() {
                $('#notification-close').click() // 关闭下载成功的提示
                downloadBook(index+1)
              }, 3000) // !!!重要!!!: 下载超级大部头书籍（例如漫画）前最好设置更长的延时
          }, 1000)
        }, 1000)
      }, 1000)
    }

    (function() {
      setTimeout(function() {
        downloadBook(0)
      }, 3000)
    })();

})();