// ==UserScript==
// @name        纯净版boylove.cc
// @namespace   Violentmonkey Scripts
// @match       https://boylove.cc/*
// @grant       none
// @version     1.1.1
// @author      -
// @description 2024/4/27 10:41:27
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488772/%E7%BA%AF%E5%87%80%E7%89%88boylovecc.user.js
// @updateURL https://update.greasyfork.org/scripts/488772/%E7%BA%AF%E5%87%80%E7%89%88boylovecc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanAd () {
      /** 通用页面 **/
      /** 去除右下角广告 **/
      const rightBottomAds = document.querySelectorAll('.div_sticky2');
      /** 去除阅读页底部广告 **/
      const bottomAds = document.querySelectorAll('.pop_words');
      /** 阅读页中部广告 **/
      const centerAds = [];
      const tabTitle = document.querySelector('.row.mo-tab_title');
      if(tabTitle) {
        let temp = tabTitle.previousElementSibling;
        while(temp) {
          centerAds.push(temp);
          temp = temp.previousElementSibling;
        }
      }
      /** 漫画介绍页右侧广告 **/
      setTimeout(()=>{
        const imgs = document.querySelectorAll('img');
        imgs.forEach((img)=>{
          const src = img.getAttribute('src');
          if(src.startsWith('//boylove.cc')) {
            img.parentNode.remove();
          }
        })
      }, 5000);
      /** 漫画介绍页居中 */
      const stuContent = document.querySelector('.stui-content');
      stuContent && (stuContent.style = 'margin: 0 auto;');
      /** 漫画阅读页居中 */
      const readPageContent = document.querySelector('.reader-book-read.page-content');
      readPageContent && (readPageContent.style = 'padding-top: 53px; width: 100vw;');
      /** 阅读页右侧无用的部分 **/
      setTimeout(()=>{
        const useLessDom = document.querySelector('.container-fluid.stui-foot');
        useLessDom.remove();
      }, 2000);
      /** 头部广告 **/
      const topAds = [document.querySelector('.row.stui-pannel')]; // 第一个
      [...rightBottomAds,...bottomAds, ...centerAds, ...topAds].forEach((item)=>{
        item && item.remove();
      })

      /** 首页 **/
      if(location.pathname === '/') {
        /** 首页中部广告 **/
        const homeCenterAds = [];
        const mainContentWrap = document.querySelector('.row > .stui-pannel > .stui-pannel__bd');
        if(mainContentWrap && mainContentWrap.children) {
          [...mainContentWrap.children].forEach((item)=>{
            const id = item.getAttribute('id');
            const domClass = item.getAttribute('class');
            if((!id || !id.startsWith('temp_block')) && domClass!=='cm_block index_bottom') {
              homeCenterAds.push(item);
            }
          });
        }
        /** 首页公告 **/
        const homeNotice = document.querySelectorAll('#temp_block_03');
        [...homeCenterAds, ...homeNotice].forEach((item)=>{
          item && item.remove();
        })
      }

      /** 去除头部的小商店、影片、游戏 **/
      const header = document.querySelector('.stui-header__menu');
      const shop = header.children[3];
      const movie = header.children[4];
      const game = header.children[5];
      header.removeChild(shop);
      header.removeChild(movie);
      header.removeChild(game);

      /** 小说页 **/
      if(location.pathname.includes('novel')) {
        window.onload = () => {
          /** 广告 **/
          const ads = [];
          const listHead = document.querySelectorAll('.stui-vodlist__head');
          if(listHead) {
            listHead.forEach((head) => {
              const prev = head.previousElementSibling;
              if(prev) {
                const domClass = prev.getAttribute('class');
                if(domClass!=='stui-vodlist clearfix') {
                  ads.push(prev);
                }
              }
            })
          }
          ads.forEach((item)=>{
            item && item.remove();
          })

          /** 公告 **/
          const notice = [];
          if(listHead) {
            listHead.forEach((head)=>{
              if(head.innerText.includes('香香公告')) {
                notice.push(head);
                notice.push(head.nextElementSibling);
              }
            })
          }
          notice.forEach((item)=>{
            item && item.remove();
          })
        }
      }
    }

    cleanAd();
})();