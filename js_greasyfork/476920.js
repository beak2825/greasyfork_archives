// ==UserScript==
// @name         百度搜索去广告、排版美化
// @description  去除百度搜索结果中的广告，美化排版和UI；支持自动翻页。
// @icon         http://baidu.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/users/
// @version      1.0.1
// @author       JavaScript大王
// @run-at       document-start
// @include      *://www.baidu.com/s?*
// @include      *://ipv6.baidu.com/s?*
// @include      *://www.baidu.com/baidu?*
// @include      *://ipv6.baidu.com/baidu?*
// @include      *://www.baidu.com/
// @include      *://ipv6.baidu.com/
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GNU
// @copyright    JavaScript大王原创脚本。转用请附：www.peanut.icu
// @downloadURL https://update.greasyfork.org/scripts/476920/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E6%8E%92%E7%89%88%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476920/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E6%8E%92%E7%89%88%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  // @require      file:///E:/PnutCode/PnutCodeProject/JavaScript/ChromePlugin/TPM-BaiduBeautify/BaiduBeautify.js
  /* global $ */
  'use strict';
  let logoInterval = null;
  let currentUrl = null;

  /*
  * 1. 美化首页
  * */
  if (location.href === 'https://www.baidu.com/') {
    // dom加载完毕后再次去除多余的DOM
    $(document).ready(function () {
      removeHomePageDom();
      addAnimateCssCDN();
      modifyHomePageDomStyle();
      modifyHomePageAfterInput();
    });
  }
  /*
  *   2. 美化搜索结果页
  * */
  else {
    // dom加载完毕后再次去除多余的DOM
    $(document).ready(function () {
      initSearchPage();
    });
  }

  window.onload = function(){
    // 添加观察者，监控样式变化
    let observer = new MutationObserver(function() {
      initSearchPage();
    });
    observer.observe(document.querySelector('#wrapper'), {
      attributes: true
    });
  }

  /*
  * function区域
  * */

  /*
  * @description 初始化搜索页所有方法与样式
  * */
  function initSearchPage(type) {
    switch (type) {
      case 'nextPage':
        addAnimateCssCDN();
        modifyInputStyle();
        modify_class_s_btn_wr();
        hideSouTuBtn();
        modify_class_quickdelete();
        modify_class_s_ipt_wr();
        modify_class_tag_scroll_3EMBO();
        modify_id_content_right();
        modifySearchResultPageLayout();
        removeSearchResultPageBottom();
        modifySearchResultPageTop();
        removeSearchResultPageAd();
        break;
      default:
        addAnimateCssCDN();
        modifyInputStyle();
        modify_class_s_btn_wr();
        hideSouTuBtn();
        modify_class_quickdelete();
        modify_class_s_ipt_wr();
        modify_class_tag_scroll_3EMBO();
        modify_id_content_right();
        modifySearchResultPageLayout();
        removeSearchResultPageBottom();
        modifySearchResultPageTop();
        removeSearchResultPageAd();
        autoScrollPage();
        backToTop();
        break;
    }
  }

  /*
  * @description 去除首页多余的DOM
  * */
  function removeHomePageDom() {
    // 登录状态下
    // 去掉搜索页左上角
    $('#s-top-left').remove();
    // 去掉底部版权信息
    $('#bottom_layer').remove();

    // 未登录状态下
    // 去掉右侧辅助模式和登录扫码
    $('#s_side_wrapper').remove();

    $('#s_lm_wrap').remove();

    $('#wrapper').css({
      'overflow': 'hidden',
    });
  }

  /*
  * @description 修改首页dom样式
  * */
  function modifyHomePageDomStyle() {
    // logo #s_lg_img 第一次打开界面时候的动画效果
    let logo = $('#s_lg_img');
    logo.addClass('animate__animated animate__backInDown');
    // 2000ms后移除动画效果
    let t = setTimeout(() => {
      logo.removeClass('animate__animated animate__backInDown');
      clearTimeout(t);
      logoInterval = setInterval(() => {
        // 保存当前的动画效果
        let animate = logo.attr('class').split(' ');
        // 移除当前的动画效果
        logo.removeClass(animate[2]);
        logo.addClass(`animate__animated animate__${getRandomAnimate()} animate__infinite`);
      }, 1000)
    }, 2000);
    // 减少内存占用 1分钟后清除定时器  重新设置动画效果
    let t2 = setTimeout(() => {
      clearInterval(logoInterval);
      logo.removeClass('animate__animated animate__infinite');
      logo.addClass(`animate__animated animate__${getRandomAnimate()}`);
      clearTimeout(t2);
    }, 60000);

    // 修改搜索框
    modifyInputStyle();

    // 修改placeholder
    modify_class_s_btn_wr();
    hideSouTuBtn();

    modifyBackground();
  }

  /*
  * @description 添加animatecss得CDN
  * */
  function addAnimateCssCDN() {
    $('head').append(` <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>`);
  }

  /*
  * @description 获取随机得动画类名
  * */
  function getRandomAnimate() {
    // 随机动画效果列表 animate__shakeX
    let animate = ['bounce', 'flash', 'pulse', 'rubberBand', 'shakeX', 'shakeY', 'headShake', 'swing', 'tada', 'wobble', 'jello', 'heartBeat'];
    return animate[Math.floor(Math.random() * animate.length)];
  }

  /*
  * @description 修改输入框样式（可复用）
  * */
  function modifyInputStyle() {
    $('#kw').css({
      'border-radius': '20px',
      'border': '1px solid #ccc',
      'padding': '0 10px',
      'height': '40px',
      'line-height': '40px',
      'font-size': '16px',
      'outline': 'none',
      'box-shadow': `2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
                    6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
                    12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
                    22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
                    41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
                    100px 100px 80px rgba(0, 0, 0, 0.07)`,
      'background': '#fff',
      'color': 'rgba(33,191,241,0.89)',
      'width': '117%'
    }).attr('placeholder', '百度一下，全是广告!').addClass('animate__animated animate__backInDown');
  }

  /*
  * @description 修改背景(可复用)
  * */
  function modifyBackground() {
    // https://api.r10086.com/樱道随机图片api接口.php?自适应图片系列=海贼王
    // 需要先将顶部横幅透明
    $('#s_top_wrap').css('background', 'transparent');
    // 修改背景
    /*$('body').css({
      'background': `url('https://api.r10086.com/樱道随机图片api接口.php?图片系列=海贼王横屏系列1') no-repeat center center fixed`,
      'background-size': 'cover',
      'background-attachment': 'fixed',
      // 背景模糊
      'backdrop-filter': 'blur(2px)',
    });*/
  }

  /*
  * @description 在首页输入框输入文本后，对界面的变化做修改
  * */
  function modifyHomePageAfterInput() {
    // 监听输入框输入事件
    $('#kw').on('input', function () {
      // 修改输入框样式
      modifyInputStyle();
      // 修改背景
      modifyBackground();
      // 去掉搜索框外部div的样式
      $('#s_kw_wrap').css({
        'border': 'none'
      })
      modify_class_quickdelete();
    });
  }

  /*
  * @description 修改搜索框尾部的x
  * */
  function modify_class_quickdelete() {
    // .quickdelete  尾部的X
    // 等待quickdelete加载完毕后再次修改
    let t = setInterval(() => {
      $('.quickdelete').css({
        'right': '-80px',
        'top': '20px',
      });
      clearInterval(t);
    }, 100);
  }

  /*
  * @description 修改搜索框尾部的搜图按钮
  * */
  function hideSouTuBtn() {
    let t3 = setTimeout(() => {
      $('.soutu-btn').remove();
      clearTimeout(t3);
    }, 100);
  }

  /*
  * @description 修改搜索框尾部的按钮
  * */
  function modify_class_s_btn_wr() {
    // 隐藏搜索框按钮s_btn_wr
    let t = setInterval(() => {
      $('.s_btn_wr').remove();
      clearInterval(t);
    }, 100);
  }

  /*
  * @description 修改搜索结果页的搜索框外层的span s_ipt_wr
  * */
  function modify_class_s_ipt_wr() {
    $('.s_ipt_wr').css({
      'border': 'none',
      'background': 'transparent',
    });
  }

  /*
  * @description 修改搜索结果页的顶部的推荐关键词 .tag-scroll_3EMBO
  * */
  function modify_class_tag_scroll_3EMBO() {
    $('.tag-scroll_3EMBO').css({
      'display': 'none',
    });
  }

  /*
  * @description 修改搜索结果页右侧的相关内容推荐、百度热搜 #content_right
  * */
  function modify_id_content_right() {
    $('#content_right').css({
      'display': 'none',
    });
  }

  /*
  * @description 修改搜索结果页的主布局
  * */
  function modifySearchResultPageLayout() {
    // 先修改最外层的div #wrapper_wrapper
    $('#wrapper_wrapper').css({
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'flex-direction': 'column',
      'width': '100vw',
      'background': '#ececec',
    });

    // 修改主容器 #container
    $('#container').css({
      'width': '60%',
      'max-width': '100%',
      'margin': '0',
      'padding': '0',
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'flex-direction': 'column',
      'background': 'transparent',
      'border-radius': '20px',
      'margin-top': '20px',
    });

    // 修改子项 .new-pmd.c-container
    $('#content_left').css({
      'width': '100%',
      'max-width': '100%',
      'margin': '0',
      'padding': '0'
    });
    $('.new-pmd.c-container').css({
      'width': '100%',
      'max-width': '100%',
      'margin': '1% 0',
      'padding': '2.4% 2%',
      'overflow': 'hidden',
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'flex-start',
      'flex-direction': 'column',
      // 'background': '#fff',
      // 'border-radius': '20px',
      'border-radius': '30px',
      'background': '#ececec',
      'box-shadow': 'inset 18px 18px 22px #c1c1c1,inset -18px -18px 22px #ffffff'
    });

    $('.single-card-wrapper_2nlg9').css({
      'box-shadow': 'none',
    });

    // 部分特殊的搜索结果
    $('.c-container.result').css({
      'width': '100%',
      'max-width': '100%',
      'margin': '1% 0',
      'padding': '2.4% 2%',
      'overflow': 'hidden',
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'flex-start',
      'flex-direction': 'column',
      // 'background': '#fff',
      // 'border-radius': '20px',
      'border-radius': '30px',
      'background': '#ececec',
      'box-shadow': 'inset 18px 18px 22px #c1c1c1,inset -18px -18px 22px #ffffff'
    });

    // .c-container .result下面的c-result-content
    $('.c-result-content').css({
      'width': '100%',
    });

    /*普通搜索结果内部*/
    $('.new-pmd.c-container .c-container').css({
      'width': '100%',
    });
    /* 百度百科封面 */
    $('.cos-col').css({
      'width': '10%',
    });
    // 移除大家都在搜
    let dajiadouzaisou = $('.list_1V4Yg');
    // 移除
    dajiadouzaisou.parent().parent().remove();

    // 内部右侧文本
    $('.new-pmd .c-span9').css({
      'width': '86%',
    });

    // 没有封面时的百度百科文本吧
    $('.abstract-list_24z7v').css({
      'width': '200%',
    });
    $('.c-border').css({
      'box-shadow': 'none',
    });
  }

  /*
  * @description 去掉搜索结果页底部
  * */
  function removeSearchResultPageBottom() {
    $('#foot').parent().remove();
    $('#rs_new').parent().remove();
  }

  /*
  * @description 修改搜索结果页顶部
  * */
  function modifySearchResultPageTop() {
    $('#result_logo').remove();
    $('#form').css({
      'margin-left': '45%',
      'transform': 'translateX(-45%)',
    });
    $('.s_tab_inner_81iSw').css({
      'margin-left': '45%',
      'transform': 'translateX(-45%)',
    });
    $('#head').css({
      'background': 'transparent',
      'background-color': 'rgba(255, 255, 255, 0.3)',
      'backdrop-filter': 'blur(7px)',
      '-webkit-backdrop-filter': 'blur(7px)',
      'border': '1px solid rgba(255, 255, 255, 0.18)',
      'box-shadow': 'rgba(142, 142, 142, 0.19) 0px 6px 15px 0px',
      '-webkit-box-shadow': 'rgba(142, 142, 142, 0.19) 0px 6px 15px 0px',
      'border-radius': '25px',
      '-webkit-border-radius': '25px',
      'color': 'rgba(255, 255, 255, 0.898)',
    });
    $('#searchTag').css({
      'background': '#ececec',
    });
    $('#s_tab').css({
      'background': '#ececec',
      'padding-top': '3.5%',
    });
  }

  /*
  * @description 去除搜索结果页的广告
  * */
  function removeSearchResultPageAd() {
    $('#content_left>div').has('span:contains("广告")').remove();
    setTimeout(function () { $('.c-container').has('.f13>span:contains("广告")').remove(); }, 2100);
  }

  /*
  * @description 滚动到底部自动翻页
  * */
  function autoScrollPage() {
    // 滚动到底部自动翻页
    $(window).scroll(function () {
      // 滚动到底部
      if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
        // 请求下一页
        requestNextPage('nextPage');
      }
    });
  }

  /*
  * @description 请求下一页
  * */
  function requestNextPage() {
    let nextPage = null;
    // 获取.page-inner_2jZi2下strong标签紧邻的后一个a标签
    nextPage = $('.page-inner_2jZi2').find('strong').next('a')[0].href;
    // 开始请求
    $.ajax({
      url: nextPage,
    }).done(function (res) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(res, "text/html");
      let results = doc.querySelectorAll('.result');
      for (let i = 0; i < results.length; i++) {
        document.querySelector('#content_left').appendChild(results[i])
        initSearchPage('nextPage');
      }
    })
  }

  /*
  * @description 回到顶部
  * */
  function backToTop() {
    // 右下角添加回到顶部按钮
    $('body').append(`<div id="backToTop" style="position: fixed;right: 20px;bottom: 20px;width: 50px;height: 50px;border-radius: 50%;background: #fff;box-shadow: 0 0 10px #ccc;cursor: pointer;display: flex;justify-content: center;align-items: center;"><svg t="1695893378977" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5009" width="200" height="200"><path d="M671.2 496.5l-0.1-0.1-130.4-103c-15.3-13.4-36.2-13.4-52.1 0L352 496l-0.8 0.6c-5.1 4.6-8 11.2-8 18.1 0 6.6 2.7 13.1 7.5 17.7 4.7 4.5 10.8 6.9 17.2 6.6 5.4-0.2 10.7-2.3 16.1-6.5l106.3-76.9v276.8c0 13.4 10.9 24.3 24.3 24.3s24.3-10.9 24.3-24.3V456l99.5 76.4c5.4 4.4 10.8 6.6 16.7 6.6 13.4 0 24.3-10.9 24.3-24.3 0.1-7.1-2.9-13.6-8.2-18.2z" fill="#4E30DC" p-id="5010"></path><path d="M638.5 304.2H391.9c-13.4 0-24.3 10.9-24.3 24.3s10.9 24.3 24.3 24.3h246.6c13.4 0 24.3-10.9 24.3-24.3s-10.9-24.3-24.3-24.3z" fill="#FF4E7D" p-id="5011"></path><path d="M921.5 438.9c-8.2-45.4-23.9-88.8-46.7-129-22.2-39.3-50.5-74.6-84.1-104.8-34.1-30.7-72.6-55.3-114.5-73.3-42.7-18.3-87.8-29.2-134.3-32.4-42.2-2.9-84.2 0.6-125.1 10.3-37.7 9-73.9 23.3-107.8 42.5-33 18.7-63.3 41.9-90.2 69-27 27.2-50 57.9-68.6 91.2-18.8 33.8-32.7 70.1-41.4 107.7-9.5 41.1-12.6 83.5-9.3 125.9 3.1 39.3 11.7 77.8 25.7 114.5 13.6 35.9 32.2 69.7 55.3 100.6 22.7 30.4 49.4 57.6 79.5 80.8 30.3 23.4 63.6 42.5 99 56.7 36.5 14.7 75 24 114.3 27.8 13.2 1.3 26.6 1.9 39.9 1.9 10.5 0 21.1-0.4 31.5-1.2 46.4-3.5 91.5-14.7 134.2-33.4 41.9-18.3 80.3-43.3 114.2-74.4 33.5-30.7 61.6-66.3 83.5-105.9 22.6-40.9 38-84.8 45.7-130.8 8.2-47.8 7.9-96.1-0.8-143.7zM853.3 652c-24.6 60.2-65 113-116.8 152.8-52.7 40.4-115.3 65.7-181 73.2-17 1.9-34.5 2.7-51.8 2.3-75.6-2-150.4-28.1-210.7-73.6-62.5-47.2-109.1-113.7-131.2-187.4-24.3-80.6-20-167.7 11.9-245.2 27.8-67.5 76.9-126.9 138.2-167.2 71.8-47.3 158.2-68 243.4-58.3 77.1 8.8 150.9 42.8 207.9 95.8 56.8 52.6 96 123.3 110.6 198.9 13.4 69.5 6.1 143.6-20.5 208.7z" fill="#4E30DC" p-id="5012"></path></svg></div>`);
    // 点击回到顶部
    $('#backToTop').on('click', function () {
      $('html,body').animate({ scrollTop: 0 }, 500);
    });
  }
})();
