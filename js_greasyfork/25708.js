// ==UserScript==
// @namespace    undefined
// @version      1.2.10

// @name         外卖菜单转换
// @description  获取美团／饿了么／百度外卖菜单页并指定格式输出

// @run-at       document-end
// @include      *://waimai.meituan.com/restaurant/*
// @include      *://i.waimai.meituan.com/*
// @include      *://waimai.baidu.com/*
// @include      *://client.waimai.baidu.com/mobile/waimai*
// @include      *://h5.ele.me/shop/*
// @include      *://www.ele.me/shop/*


// @author       freeshine<shine_c@outlook.com>

// @homepageURL  https://github.com/nnecec/some-demo/blob/master/Function/waimaiTransform.js
// @supportURL   https://github.com/nnecec/some-demo/issues

// @grant    GM_setClipboard

// @copyright  2018
// @downloadURL https://update.greasyfork.org/scripts/25708/%E5%A4%96%E5%8D%96%E8%8F%9C%E5%8D%95%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/25708/%E5%A4%96%E5%8D%96%E8%8F%9C%E5%8D%95%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==
(function () {
  'use strict';
  /**
   * 美团外卖PC版
   */
  function getMeituanMenu(btn, textarea) {
    let info = '';
    const category = document.querySelectorAll('.food-nav .category');
    for (let i = 0, categoryLength = category.length; i < categoryLength; i++) {
      const foodTypeName = category[i].querySelector('.title > span').textContent.trim();
      info += '#' + foodTypeName + '\n';

      const item = category[i].querySelectorAll('.pic-food');
      for (let j = 0, itemLength = item.length; j < itemLength; j++) {
        let foodName = item[j].querySelector('.np .name').getAttribute('title').trim();
        let foodPrice = item[j].querySelector('.labels .price .only').textContent.split('/')[0].substring(1).trim();
        const numberFlag = foodPrice.search(/[^[0-9].?[0-9]]/)
        if(numberFlag> 0){
          foodName = foodName+ foodPrice.slice(numberFlag,foodPrice.length)
          foodPrice = foodPrice.slice(0,numberFlag)
        }
        info += assembleItem(foodName, foodPrice);
      }
    }
    setInfo(textarea, info);
  }

  /**
   * 美团外卖手机版
   */
  function getMeituanMobileMenu(btn, textarea) {
    let info = '';
    const category = document.querySelectorAll('.foodlistwrap .foodlist');
    for (let i = 0, categoryLength = category.length; i < categoryLength; i++) {
      if (category[i].querySelector('.foodlist-label')) {
        const foodTypeName = category[i].querySelector('.foodlist-label').textContent.trim();
        info += '#' + foodTypeName + '\n';
      }


      const item = category[i].querySelectorAll('.fooditem');
      for (let j = 0, itemLength = item.length; j < itemLength; j++) {
        let foodName = item[j].querySelector('.foodname').textContent.trim();
        let foodPrice = item[j].querySelector('.food-price').textContent.trim().slice(1);
        const numberFlag = foodPrice.search(/[^[0-9].?[0-9]]/)
        if(numberFlag> 0){
            foodName = foodName+ foodPrice.slice(numberFlag,foodPrice.length)
            foodPrice = foodPrice.slice(0,numberFlag)
        }
        info += assembleItem(foodName, foodPrice);
      }
    }
    info = info.replace('APP下单优惠菜品', '折扣');
    setInfo(textarea, info)
  }

  /**
   * 百度外卖PC版
   */
  function getBaiduMenu(btn, textarea) {
    let info = '';
    const category = document.querySelectorAll('.list-wrap');
    for (let i = 0, categoryLength = category.length; i < categoryLength; i++) {
      let foodTypeName = '';
      if (category[i].querySelector('.list-status .title')) {
        foodTypeName = category[i].querySelector('.list-status .title').textContent.trim();
      } else if (document.querySelector('.filter-item.cur')) {
        foodTypeName = document.querySelector('.filter-item.cur .item-name').textContent.trim();
      }
      info += '#' + foodTypeName + '\n';

      const item = category[i].querySelectorAll('.list-item');
      for (let j = 0, itemLength = item.length; j < itemLength; j++) {
        const foodName = item[j].querySelector('h3').getAttribute('data-title').trim();
        let foodPrice = '';
        if (item[j].querySelector('.m-price del')) {
          foodPrice = item[j].querySelector('.m-price del strong').textContent.substring(1).trim()
        } else if (item[j].querySelector('.m-price strong')) {
          foodPrice = item[j].querySelector('.m-price strong').textContent.substring(1).trim()
        } else if (item[j].querySelector('.m-break strong')) {
          foodPrice = item[j].querySelector('.m-break strong').textContent.substring(1).trim()
        }
        info += assembleItem(foodName, foodPrice);
      }
    }
    setInfo(textarea, info);
  }

  /**
   * 百度外卖手机版
   */
  function getBaiduMobileMenu(btn, textarea) {
    let info = '';
    const category = document.querySelectorAll('#shopmenu-category .list-item a');
    const categoryGroup = document.querySelectorAll('#shopmenu-list .listgroup')

    for (let i = 0, categoryLength = category.length; i < categoryLength; i++) {
      const foodTypeName = category[i].textContent.trim();
      info += '#' + foodTypeName + '\n';

      const item = categoryGroup[i].querySelectorAll('.list-item');

      for (let j = 0, itemLength = item.length; j < itemLength; j++) {
        const foodName = item[j].querySelector('.title').textContent.trim();
        const foodPrice = item[j].querySelector('s') ? item[j].querySelector('s').textContent.substring(1).trim() : item[j].querySelector('.price').textContent.substring(1).trim();
        info += assembleItem(foodName, foodPrice);
      }
    }
    setInfo(textarea, info)
  }

  /**
   * 饿了么PC版
   */
  function getElemeMenu(btn, textarea) {
    let info = '';
    const category = document.querySelectorAll('.shopmenu-main .shopmenu-list');
    for (let i = 0, categoryLength = category.length; i < categoryLength; i++) {
      const foodTypeName = category[i].querySelector('.shopmenu-title').textContent.split(' ')[0].trim();
      info += '#' + foodTypeName + '\n';

      const item = category[i].querySelectorAll('.shopmenu-food');
      for (let j = 0, itemLength = item.length; j < itemLength; j++) {
        const foodName = item[j].querySelector('.shopmenu-food-name').textContent.trim();
        const foodPrice = item[j].querySelector('.shopmenu-food-price').textContent.trim();
        info += assembleItem(foodName, foodPrice);
      }
    }
    setInfo(textarea, info)
  }

  /**
   * 饿了么手机版
   */
  function getElemeMobileMenu(btn, textarea) {
    let info = '';
    const category = document.querySelectorAll('.menu-list dl');
    for (let i = 0, categoryLength = category.length; i < categoryLength; i++) {
      const foodTypeName = category[i].querySelector('dt strong').textContent.trim();
      info += '#' + foodTypeName + '\n';

      const item = category[i].querySelectorAll('dd');
      for (let j = 0, itemLength = item.length; j < itemLength; j++) {
        const foodName = item[j].querySelector('.foodtitle span').textContent.trim();
        const foodPrice = item[j].querySelector('.foodprice .foodprice-origin') ? item[j].querySelector('.foodprice .foodprice-origin').textContent.trim() : item[j].querySelector('.foodprice span').textContent.trim();
        info += assembleItem(foodName, foodPrice);
      }
    }



    setInfo(textarea, info)
  }

  /**
   * 创建页面组件
   */
  function createComponent() {
    const body = document.body;
    const wmWrap = document.createElement('div');
    wmWrap.style.cssText = 'position:fixed;z-index:9999;right:0;bottom:0px;background:#fff;width:180px;height:340px;font-size:14px;';

    const btn = document.createElement('button');
    btn.style.cssText = 'background:#fff;width:100%;height:40px;';
    wmWrap.appendChild(btn);

    const textarea = document.createElement('textarea');
    textarea.style.cssText = 'width:100%;height:300px;box-sizing: border-box;';
    wmWrap.appendChild(textarea);

    body.appendChild(wmWrap);

    return {
      btn,
      textarea
    };
  }

  /**
   * 按格式 组装name price
   */
  function assembleItem(name, price) {
    return name + ',' + formatPrice(price) + '\n';
  }

  function setInfo(area, info) {
    area.value = info;
    GM_setClipboard(info);
  }

  function formatPrice(price) {
    return price.replace(/起/g, '');

  }

  /**
   *
   *
   */
  function judgeHostAndSetComponent(host, btn, textarea) {
    switch (host) {
      case 'i.waimai.meituan.com':
        btn.innerHTML = '美团外卖菜单手机版';
        btn.addEventListener('click', getMeituanMobileMenu.bind(this, btn, textarea), false);
        break;
      case 'waimai.meituan.com':
        btn.innerHTML = '美团外卖菜单PC版';
        btn.addEventListener('click', getMeituanMenu.bind(this, btn, textarea), false);
        break;
      case 'client.waimai.baidu.com':
        btn.innerHTML = '百度外卖菜单手机版';
        btn.addEventListener('click', getBaiduMobileMenu.bind(this, btn, textarea), false);
        break;
      case 'waimai.baidu.com':
        btn.innerHTML = '百度外卖菜单PC版';
        btn.addEventListener('click', getBaiduMenu.bind(this, btn, textarea), false);
        break;
      case 'h5.ele.me':
        btn.innerHTML = '饿了么菜单手机版';
        btn.addEventListener('click', getElemeMobileMenu.bind(this, btn, textarea), false);
        break;
      case 'www.ele.me':
        btn.innerHTML = '饿了么菜单PC版';
        btn.addEventListener('click', getElemeMenu.bind(this, btn, textarea), false);
        break;
      default:
        textarea.value = '你在一个无法识别的网站';
    }
  }

  function init() {
    const {
      btn,
      textarea
    } = createComponent();

    judgeHostAndSetComponent(location.host, btn, textarea);

  }

  init();
})()