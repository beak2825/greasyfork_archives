// ==UserScript==
// @name         b站首页推荐
// @namespace    kasw
// @version      6.8
// @description  网页端app首页推荐视频
// @author       kaws
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   safari

// @source       https://github.com/kawS/bilibili-recommend-app

// @include      https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png?*

// @connect      app.bilibili.com
// @connect      api.bilibili.com
// @connect      passport.bilibili.com
// @connect      www.mcbbs.net

// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @run-at       document-idle

// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444895/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/444895/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  const isNewTest = $('#i_cecream').find('.bili-feed4').length > 0 ? true : false;
  const itemHeight = isNewTest ? $('.recommended-swipe').next('.feed-card').height() : $('.bili-grid').eq(0).find('.bili-video-card').height();
  let $list = null;
  let isWait = false;
  let isLoading = true;
  let options = {
    clientWidth: $(window).width(),
    sizes: null,
    rows: 5,
    rowSizes: 5,
    timeoutKey: 1900800000,
    refresh: 1,
    oneItemHeight: itemHeight,
    listHeight: itemHeight * 4 + 20 * 3,
    accessKey: GM_getValue('biliAppHomeKey'),
    dateKey: GM_getValue('biliAppHomeKeyDate'),
    isShowDanmaku: typeof GM_getValue('biliAppDanmaku') == 'undefined' ? false : GM_getValue('biliAppDanmaku'),
    isAppType: false, // typeof GM_getValue('biliAppType') == 'undefined' ? true : GM_getValue('biliAppType'), // true:app;false:pc
    isWeek:  typeof GM_getValue('biliWeek') == 'undefined' ? false : GM_getValue('biliWeek')
  }
  function init(){
    if(location.href.startsWith('https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png?')){
      window.stop();
      return window.opener.postMessage(location.href, 'https://www.bilibili.com')
    }
    localStorage.setItem('bilibili_player_force_DolbyAtmos&8K&HDR', 1);
    Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'
    });
    if(location.pathname != '/') return;
    setSize(options.clientWidth);
    initStyle();
    intiHtml();
    initEvent();
    checkAccessKey();
    !options.isAppType && options.isWeek ? getRecommendList(6) : getRecommendList();
  }
  function setSize(width){
    let row = options.rows = $(window).height() > 1300 ? 5 : 3;
    if(isNewTest){
      if(width < 1400){
        options.rowSizes = 4
        options.sizes = 4 * row
      }else{
        options.rowSizes = 5
        options.sizes = 5 * row
      }
    }else{
      if(width <= 1100){
        options.rowSizes = 4
        options.sizes = 4 * row
      }
      if(width > 1100 && width <= 1700){
        options.rowSizes = 5
        options.sizes = 5 * row
      }
      if(width > 1700 && width < 2200){
        options.rowSizes = 6
        options.sizes = 6 * row
      }
      if(width >= 2200){
        options.rowSizes = 7
        options.sizes = 7 * row
      }
    }
  }
  function initStyle(){
    const style = `
      <style>
        @keyframes turn{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}
        .taglike{position: absolute;bottom: 25px;left: 8px;padding: 0 2px;height: 18px;line-height: 18px;font-size: 12px;}
        .toast{position: fixed;top: 30%;left: 50%;z-index: 999999;margin-left: -180px;padding: 12px 24px;font-size: 14px;background: rgba(0,0,0,.8);width: 360px;border-radius: 6px;color: #fff;text-align: center}
        .v-inline-danmaku{position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 2;pointer-events: none;user-select: none;border-radius: inherit;opacity: 0;transition: opacity .2s linear;overflow: hidden}
        .v-inline-danmaku.visible{opacity: 1}
        .v-inline-danmaku p{position: absolute;color: #fff;text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px, #000 -1px 0px 1px;white-space: nowrap;opacity: 0}
        .be-switch-container{position:relative;display:flex;margin:0 0 0 8px;height:20px;cursor:pointer;white-space:nowrap;align-items: center;}
        .be-switch-container.is-checked .be-switch{background-color:#00a1d6}
        .be-switch-container.is-checked .be-switch-cursor{left:17px}
        .be-switch{position:relative;width:30px;height:16px;border-radius:8px;background-color:#ccd0d7;vertical-align:middle;cursor:pointer;transition:background-color .2s ease}
        .be-switch-cursor{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:12px;background:#fff;transition:left .2s ease}
        .be-switch-label{line-height:20px;font-size:14px;margin-left:3px;vertical-align:middle}
        .be-switch-input{position:absolute;left:0;top:0;margin:0;opacity:0;width:100%;height:100%;z-index:2;display: none}
        #recommend{margin-bottom: 40px;}
        #recommend .bili-video-card .bili-video-card__info{position: relative}
        #recommend .bili-video-card .bili-video-card__info .ctrl{position: absolute;bottom: 0;right: 0;background: rgba(0,0,0,.8);width: 100%;height: 0;border-radius: 6px;color: #fff;z-index: 15;display: none;}
        #recommend .bili-video-card .bili-video-card__info .ctrl .tb{width: 100%;height: 100%;font-size: 12px;text-align: center;display: flex;flex-direction: column;}
        #recommend .bili-video-card .bili-video-card__info .tb .sp{width: 100%;flex: 2;display: flex;align-items: center;justify-content: center;}
        #recommend .bili-video-card .bili-video-card__info .tb .sp a{flex: 1}
        #recommend .bili-video-card .bili-video-card__info .tb .dislike{flex: 4;}
        #recommend .bili-video-card .bili-video-card__info .tb .dislike .tlt{font-size: 14px}
        #recommend .bili-video-card .bili-video-card__info .tb .dislike a{padding: 4% 0 0 0}
        #recommend .bili-video-card .bili-video-card__info .tb .dislike .ready, #recommend .bili-video-card .bili-video-card__info .tb .dislike .over{height: 100%;display: flex;flex-direction: column;justify-content: center;}
        #recommend .bili-video-card .bili-video-card__info .tb .dislike .over{font-size: 14px;display: none}
        #recommend .bili-video-card .bili-video-card__info .tb .dislike .over a{font-size: 12px}
        #recommend .bili-video-card .bvcd-left{position: absolute;top: 0;left: 0;width: 50px;z-index: 10}
        #recommend .bili-video-card .bili-video-card__info--author{display: -webkit-box!important;}
        #recommend .bili-video-card .bili-video-card__info--tit{position: relative;padding: 0 20px 0 50px}
        #recommend .bili-video-card .bili-video-card__info--tit .more{position: absolute;bottom: 0;right: 0;width: 20px;text-align: right;cursor: pointer;fill: var(--graph_icon)}
        #recommend .area-header{height: 34px;}
        #recommend .first-paint{display: grid;position: relative;width: 100%;grid-gap: 20px;grid-column: span 5;grid-template-columns: repeat(5,1fr);}
        @media (max-width: 1399.9px){
          #recommend .first-paint{grid-column: span 4;grid-template-columns: repeat(4,1fr);}
        }
        #recommend.recommended-container .first-paint>*:nth-of-type(1n + 8){margin-top: 0!important}
        #recommend.recommended-container .first-paint>*:nth-of-type(1n + 6){margin-top: 0!important}
        #recommend.recommended-container{position: relative;}
        #empty-list{padding-bottom: 20px}
        .palette-feed4{display: none}
      </style>`;
    $('head').append(style)
  }
  function intiHtml(){
    const $fullpage = $('#i_cecream');
    let html = null;
    let emptyHtml = '';
    if($fullpage.length <= 0) return;
    for(let i=0;i<options.sizes;i++){
      emptyHtml += `
        <div class="bili-video-card" style="display: block !important">
          <div class="bili-video-card__skeleton loading_animation">
            <div class="bili-video-card__skeleton--cover"></div>
            <div class="bili-video-card__skeleton--info">
              <div class="bili-video-card__skeleton--right">
                <p class="bili-video-card__skeleton--text"></p>
                <p class="bili-video-card__skeleton--text short"></p>
                <p class="bili-video-card__skeleton--light"></p>
              </div>
            </div>
          </div>
        </div>`
    }
    html = `
      <section class="${isNewTest ? 'recommended-container' : 'bili-grid'}" data-area='Tampermonkey插件-app首页推荐' id="recommend">
        <div class="eva-extension-area">
          <div class="area-header">
            <div class="left">
              <a href="javascript:;" class="title"><span>Tampermonkey插件-首页推荐</span></a>
            </div>
            <div class="right">
              <div class="be-switch-container setting-privacy-switcher${options.isAppType ? ' is-checked': ''}" id="JUseApp">
                <input type="checkbox" class="be-switch-input" value="${options.isAppType}">
                <div class="be-switch"><i class="be-switch-cursor"></i></div>
                <div class="be-switch-label"><span>是否使用app推荐接口</span></div>
              </div>
              <div class="be-switch-container setting-privacy-switcher${options.isWeek ? ' is-checked': ''}" id="JUseWeek">
                <input type="checkbox" class="be-switch-input" value="${options.isWeek}">
                <div class="be-switch"><i class="be-switch-cursor"></i></div>
                <div class="be-switch-label"><span>是否只看最近7天推荐</span></div>
              </div>
              <div class="be-switch-container setting-privacy-switcher${options.isShowDanmaku ? ' is-checked': ''}" id="JShowDanmaku">
                <input type="checkbox" class="be-switch-input" value="${options.isShowDanmaku}">
                <div class="be-switch"><i class="be-switch-cursor"></i></div>
                <div class="be-switch-label"><span>是否预览弹幕</span></div>
              </div>
              <button class="primary-btn roll-btn" id="JaccessKey"}>
                <span>${options.accessKey ? '删除授权' : '获取授权'}</span>
              </button>
            </div>
          </div>
          <div class="${isNewTest ? 'first-paint' : 'eva-extension-body'}" id="recommend-list"></div>
          <div class="${isNewTest ? 'first-paint' : 'eva-extension-body'}" id="empty-list">${emptyHtml}</div>
        </div>
      </section>`;
    if(isNewTest){
      $fullpage.find('.recommended-container_floor-aside').before(`<div id="scrollwrap">${html}</div>`)
    }else{
      $fullpage.find('.bili-header').after(`<main class="bili-layout" id="scrollwrap">${html}</main>`);
    }
    $('#scrollwrap').next().hide();
    $list = $('#recommend-list');
  }
  function initEvent(){
    $('#JaccessKey').on('click', function(){
      const $this = $(this);
      let type = $this.text().trim();
      if(isWait) return;
      isWait = true
      if(type == '删除授权'){
        $this.find('span').text('获取授权');
        delAccessKey()
      }
      if(type == '获取授权' || type == '重新获取授权'){
        $this.find('span').text('获取中...');
        getAccessKey($this)
      }
      return false
    })
    $list.on('mouseenter', '.bili-video-card__image', function(e){
      e.stopPropagation();
      const $this = $(this);
      let rect = e.currentTarget.getBoundingClientRect();
      if($this.data('go') == 'av'){
        // $this.find('.bili-watch-later').show();
        $this.find('.v-inline-player').addClass('mouse-in visible');
        getPreviewImage($this, e.clientX - rect.left);
        if(options.isShowDanmaku){
          $this.find('.v-inline-danmaku').addClass('mouse-in visible');
          getPreviewDanmaku($this)
        }
      }
    }).on('mouseleave', '.bili-video-card__image', function(e){
      e.stopPropagation();
      const $this = $(this);
      if($this.data('go') == 'av'){
        // $this.find('.bili-watch-later').hide();
        $this.find('.v-inline-player, .v-inline-danmaku').removeClass('mouse-in visible');
      }
    }).on('mousemove', '.bili-video-card__image', function(e){
      e.stopPropagation();
      const $this = $(this);
      let rect = e.currentTarget.getBoundingClientRect();
      if($this.data('go') == 'av'){
        if($this[0].pvData){
          setPosition($this, e.clientX - rect.left, $this[0].pvData)
        }
      }
    }).on('click', '#Jwatch', function(){
      const $this = $(this);
      if(isWait) return;
      isWait = true;
      watchlater($this);
      return false
    }).on('click', '.dislike .dl', function(){
      const $this = $(this);
      if(isWait) return;
      isWait = true;
      dislike($this);
      return false
    }).on('click', '#Jreturn', function(){
      const $this = $(this);
      if(isWait) return;
      isWait = true;
      dislike($this, true);
      return false
    }).on('click', '#Jbbdown', function(){
      const $this = $(this);
      let id = $this.data('id');
      if(options.isAppType){
        GM_setClipboard(`BBDown -app -token ${options.accessKey} -mt -ia -p ALL "${id}"`);
      }else{
        GM_setClipboard(`BBDown -app -mt -ia -p ALL "${id}"`);
      }
      toast('复制BBDown命令行成功')
      return false
    }).on('click', '.more', function(){
      const $this = $(this);
      const $wp = $this.closest('.bili-video-card__wrap');
      $wp.find('.ctrl').css({
        'height': $wp.height()
      }).fadeIn();
      return false
    }).on('mouseleave', '.ctrl', function(){
      const $this = $(this);
      if($this.find('.dlike').length > 0){
        return
      }
      $this.fadeOut()
    })
    $('#JShowDanmaku').on('click', function(){
      const $this = $(this);
      const $inp = $this.find('input');
      let val = JSON.parse($inp.val());
      options.isShowDanmaku = !val;
      GM_setValue('biliAppDanmaku', options.isShowDanmaku);
      $inp.val(options.isShowDanmaku);
      if(options.isShowDanmaku){
        $this.addClass('is-checked')
      }else{
        $this.removeClass('is-checked')
      }
      return false
    })
    $('#JUseApp').on('click', function(){
      const $this = $(this);
      const $inp = $this.find('input');
      let val = JSON.parse($inp.val());
      options.isAppType = !val;
      GM_setValue('biliAppType', options.isAppType);
      $inp.val(options.isAppType);
      if(options.isAppType){
        $this.addClass('is-checked')
      }else{
        $this.removeClass('is-checked')
      }
      setTimeout(() => {
        location.reload()
      }, 500)
      return false
    })
    $('#JUseWeek').on('click', function(){
      const $this = $(this);
      const $inp = $this.find('input');
      let val = JSON.parse($inp.val());
      options.isWeek = !val;
      GM_setValue('biliWeek', options.isWeek);
      $inp.val(options.isWeek);
      if(options.isWeek){
        $this.addClass('is-checked')
      }else{
        $this.removeClass('is-checked')
      }
      setTimeout(() => {
        location.reload()
      }, 500)
      return false
    })
    
    $(window).on('scroll', function(){
      if(options.refresh <= 3) return;
      if(($(this).scrollTop() + $(window).height()) > ($('#empty-list').offset().top - (options.oneItemHeight * 2))){
        if(isLoading) return;
        isLoading = true;
        options.clientWidth = $(window).width();
        setSize(options.clientWidth);
        getRecommendList()
      }
    })
  }
  function toast(msg, cb, duration = 2000){
    const $toast = $(`<div class="toast">${msg}</div>`);
    $toast.appendTo($('body'));
    setTimeout(() => {
      $toast.remove();
      typeof cb == 'function' && cb()
    }, duration)
  }
  function delAccessKey(){
    isWait = false;
    options.accessKey = null;
    options.dateKey = null;
    GM_deleteValue('biliAppHomeKey');
    GM_deleteValue('biliAppHomeKeyDate');
    toast('删除授权成功');
  }
  async function getAccessKey($el){
    let url = null;
    let res = null;
    let data = null;
    try {
      res = await fetch('https://passport.bilibili.com/login/app/third?appkey=27eb53fc9058f8c3&api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png&sign=04224646d1fea004e79606d3b038c84a', {
        method: 'GET',
        credentials: 'include'
      })
    } catch (error) {
      toast(error)
    }
    try {
      data = await res.json();
    } catch (error) {
      toast(error)
    }
    if (data.code || !data.data) {
      $el.find('span').text('获取授权');
      toast(data.msg || data.message || data.code)
    } else if (!data.data.has_login) {
      $el.find('span').text('获取授权');
      toast('你必须登录B站之后才能使用授权')
    } else if (!data.data.confirm_uri) {
      $el.find('span').text('获取授权');
      toast('无法获得授权网址')
    } else {
      url = data.data.confirm_uri
    }
    if(url == null){
      isWait = false;
      return
    }
    const win = window.open(url, '_blank', 'popup=true,width=60,height=90');
    let timeout = setTimeout(() => {
      win.close();
      $el.find('span').text('获取授权');
      toast('获取授权超时')
    }, 5000);
    window.onmessage = ev => {
      if (ev.origin != 'https://www.mcbbs.net' || !ev.data) {
        isWait = false;
        return
      }
      const key = ev.data.match(/access_key=([0-9a-z]{32})/);
      if (key) {
        GM_setValue('biliAppHomeKey', options.accessKey = key[1]);
        GM_setValue('biliAppHomeKeyDate',  options.dateKey = +new Date());
        toast('获取授权成功，1s后刷新');
        $el.find('span').text('删除授权');
        clearTimeout(timeout);
        win.close();
        setTimeout(() => {
          location.reload()
        }, 1000)
      } else {
        toast('没有获得匹配的密钥')
      }
    }
    isWait = false;
  }
  function checkAccessKey(){
    $('#JaccessKey, #JUseApp').hide();
    const nowDate = +new Date();
    if(!options.dateKey) return;
    if(options.dateKey == -1){
      $('#JaccessKey').find('span').text('重新获取授权');
      return
    }
    if(nowDate - options.dateKey > options.timeoutKey){
      $('#JaccessKey').find('span').text('重新获取授权');
      GM_setValue('biliAppHomeKeyDate',  options.dateKey = -1);
      GM_deleteValue('biliAppHomeKey');
      options.accessKey = null;
    }
  }
  function getRecommend(url, type){
    const errmsg = '获取推荐视频失败';
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
          "User-Agent": "bili-universal/71100100 CFNetwork/1399 Darwin/22.1.0 os/ios model/iPhone 12 Pro mobi_app/iphone build/71100100 osVer/16.1.2 network/2 channel/AppStore"
        },
        onload: res => {
          try {
            const rep = JSON.parse(res.response);
            if (rep.code != 0) {
              if(/鉴权失败/.test(rep.message)){
                delAccessKey();
                $('#JaccessKey').find('span').text('重新获取授权');
                return
              }
              reject(errmsg)
            }
            if(type == 'new'){
              resolve(rep.data.item)
            }else{
              resolve(rep.data)
            }
          } catch(e) {
            reject(errmsg)
          }
        },
        onerror: e => {
          reject(errmsg)
        }
      })
    })
  }
  async function getRecommendList(rowLength){
    const token = options.accessKey ? '&access_key=' + options.accessKey : '';
    const url = options.isAppType ? 'https://app.bilibili.com/x/feed/index?appkey=27eb53fc9058f8c3&build=1&mobi_app=android&idx=' : `https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3&version=1&ps=10&fresh_idx=${options.refresh}&fresh_idx_1h=${options.refresh}`
    // 4-20 5-25 6-30 7-35
    let last = [];
    for(let i=0;i<(rowLength || 3);i++){
      let data = [];
      let list = null;
      let uri = options.isAppType ? (url + i + ((Date.now() / 1000).toFixed(0)) + token) : url;
      await getRecommend(uri).then(d => {
        let nowData = options.isAppType ? d : d.item;
        if(options.isWeek){
          for(let item of nowData){
            if(((options.isAppType ? item.ctime : item.pubdate) * 1000) >= new Date() - (7 * 24 * 60 * 60 * 1000)){
              data.push(item)
            }
          }
        }else{
          data = nowData
        }
        if(data.length > 0){
          let diff = [];
          if(options.isWeek && last.length > 0){
            for(let item of data){
              if(!last.includes(item)){
                diff.push(item)
              }
            }
          }
          if(diff.length > 0){
            list = options.isAppType ? diff : new2old(diff);
          }else{
            list = options.isAppType ? data : new2old(data);
          }
          last = list;
          updateRecommend(list)
        }
        options.refresh += 1
      }).catch(err => {
        i--;
        console.log(err)
      })
    }
    !$('.bili-footer').is('hidden') && $('.bili-footer').hide();
  }
  function new2old(data){
    const _data = data.flat();
    return _data.map((item) => {
      return {
        autoplay: 1,
        cid: item.cid,
        cover: item.pic,
        ctime: item.pubdate,
        danmaku: item.stat.danmaku,
        desc: `${item.stat.danmaku}弹幕`,
        duration: item.duration,
        face: item.owner.face,
        goto: item.goto,
        idx: item.id,
        like: item.stat.like,
        mid: item.owner.mid,
        name: item.owner.name,
        param: item.id,
        play: item.stat.view,
        title: item.title,
        tname: '',
        uri: item.uri,
        rcmd_reason: {
          content: item.rcmd_reason?.reason_type == 1 ? '已关注' : item.rcmd_reason?.content || ''
        }
      }
    })
  }
  function unique(data){
    const arr = data.flat();
    let result = [];
    let cidList = {};
    for(let item of arr){
      if(!cidList[item.cid]){
        result.push(item);
        cidList[item.cid] = true
      }
    }
    return result.sort(function(){
      return Math.random() - 0.5
    })
  }
  function updateRecommend(list){
    let html = '';
    let forLength = options.rowSizes == 4 ? 8 : 10;
    for(let i=0;i<forLength;i++){
      let data = list[i];
      if(!data){
        continue
      }
      html += returnHtml(data)
    }
    $list.append(html);
    if(options.refresh > 1){
      if(!$('#empty-list').attr('style')){
        $('#empty-list').css('padding-top', '20px').find('.bili-video-card').slice(options.rowSizes).remove()
      }
    }else{
      if($(window).height() > 1440){
        getRecommendList()
      }
    }
    setTimeout(() => {
      isLoading = false
    }, 300)
  }
  function returnHtml(data){
    let html = 
      `<div class="bili-video-card" style="display: block !important">
        <div class="bili-video-card__skeleton hide">
          <div class="bili-video-card__skeleton--cover"></div>
          <div class="bili-video-card__skeleton--info">
            <div class="bili-video-card__skeleton--face"></div>
            <div class="bili-video-card__skeleton--right">
              <p class="bili-video-card__skeleton--text"></p>
              <p class="bili-video-card__skeleton--text short"></p>
              <p class="bili-video-card__skeleton--light"></p>
            </div>
          </div>
        </div>
        <div class="bili-video-card__wrap __scale-wrap">
          <a href="${options.isAppType ? 'https://www.bilibili.com/video/av' + data.param : data.uri}" target="${options.isAppType ? 'https://www.bilibili.com/video/av' + data.param : data.uri}" class="cardwp">
            <div class="bili-video-card__image __scale-player-wrap" data-go="${data.goto}" data-aid="${data.param}" data-duration="${data.goto == 'av' ? data.duration : ''}">
              <div class="bili-video-card__image--wrap">
                <div class="bili-watch-later" data-aid="${data.param}" style="display: none;">
                  <svg class="bili-watch-later__icon"><use xlink:href="#widget-watch-later"></use></svg>
                  <span class="bili-watch-later__tip" style="display: none;">稍后再看</span>
                </div>
                <picture class="v-img bili-video-card__cover">
                  <source srcset="${data.cover.replace('http:', 'https:')}@672w_378h_1c_100q.webp" type="image/webp"/>
                  <img src="${data.cover.replace('http:', 'https:')}@672w_378h_1c_100q" alt="${data.title}" loading="eager" onload=""/>
                </picture>
                <div class="v-inline-player"></div>
                <div class="v-inline-danmaku"></div>
              </div>
              <div class="bili-video-card__mask">
                ${data.badge ? `<div class="taglike" style="background: #ff8f00;color: #fff;">${data.badge}</div>` : data.rcmd_reason && data.rcmd_reason.content == '已关注' ? `<div class="taglike" style="background: #ff8f00;color: #fff;">已关注</div>` : ''}
                <div class="bili-video-card__stats">
                  <div class="bili-video-card__stats--left">
                    <span class="bili-video-card__stats--item">
                      <svg class="bili-video-card__stats--icon">
                        <use xlink:href="#widget-play-count"></use>
                      </svg>
                      <span class="bili-video-card__stats--text">${formatNumber(data.play)}</span>
                    </span>
                    <span class="bili-video-card__stats--item"${data.goto == 'av' ? '' : ' style="display: none"'}>
                      <svg class="bili-video-card__stats--icon"><use xlink:href="#widget-agree"></use></svg>
                      <span class="bili-video-card__stats--text">${formatNumber(data.like)}</span>
                    </span>
                  </div>
                  <span class="bili-video-card__stats__duration">${data.goto == 'av' ? formatNumber(data.duration, 'time') : formatNumber(data.favorite) + '收藏'}</span>
                </div>
              </div>
            </div>
          </a>
          <div class="bili-video-card__info __scale-disable">
            <div class="bvcd-left" ${data.name ? 'title="' + data.name + '"' : ''}>
              <a href="https://space.bilibili.com/${data.mid || (data.badge == '纪录片' ? '7584632' : data.badge == '电影' ? '15773384' : data.badge == '电视剧' ? '4856007' : '928123')}" target="https://space.bilibili.com/${data.mid || (data.badge == '纪录片' ? '7584632' : data.badge == '电影' ? '15773384' : data.badge == '电视剧' ? '4856007' : data.badge == '国创' ? '98627270' : '928123')}">
                <div class="v-avatar bili-video-card__avatar">
                  <picture class="v-img v-avatar__face">
                    <source srcset="${data.face.replace('http:', 'https:')}@72w_72h.webp" type="image/webp"/>
                    <img src="${data.face.replace('http:', 'https:')}@72w_72h" alt="${data.name || data.badge}" loading="lazy" onload=""/>
                  </picture>
                </div>
              </a>
            </div>
            <div class="bili-video-card__info--right">
              <h3 class="bili-video-card__info--tit" title="${data.title}">
                <a href="${options.isAppType ? 'https://www.bilibili.com/video/av' + data.param : data.uri}" target="${options.isAppType ? 'https://www.bilibili.com/video/av' + data.param : data.uri}">${data.title}</a>
                <div class="more">
                  <svg width="20" height="24" viewBox="0 0 15 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7484 5.49841C13.7484 6.46404 12.9656 7.24683 11.9999 7.24683C11.0343 7.24683 10.2515 6.46404 10.2515 5.49841C10.2515 4.53279 11.0343 3.75 11.9999 3.75C12.9656 3.75 13.7484 4.53279 13.7484 5.49841ZM13.7484 18.4985C13.7484 19.4641 12.9656 20.2469 11.9999 20.2469C11.0343 20.2469 10.2515 19.4641 10.2515 18.4985C10.2515 17.5328 11.0343 16.75 11.9999 16.75C12.9656 16.75 13.7484 17.5328 13.7484 18.4985ZM11.9999 13.7485C12.9656 13.7485 13.7484 12.9656 13.7484 12C13.7484 11.0343 12.9656 10.2515 11.9999 10.2515C11.0343 10.2515 10.2515 11.0343 10.2515 12C10.2515 12.9656 11.0343 13.7485 11.9999 13.7485Z"></path></svg>
                </div>
              </h3>
              <p class="bili-video-card__info--bottom" style="${(data.rcmd_reason && data.rcmd_reason.content == '已关注') ? 'color: #f00' : data.badge ? 'color: #ff8f00' : ''}">
                <a class="bili-video-card__info--owner" href="https://space.bilibili.com/${data.mid || (data.badge == '纪录片' ? '7584632' : data.badge == '电影' ? '15773384' : data.badge == '电视剧' ? '4856007' : data.badge == '国创' ? '98627270' : '928123')}" target="https://space.bilibili.com/${data.mid || (data.badge == '纪录片' ? '7584632' : data.badge == '电影' ? '15773384' : data.badge == '电视剧' ? '4856007' : data.badge == '国创' ? '98627270' : '928123')}" ${data.name ? 'title="' + data.name + '"' : 'style="width: 100%"'}>
                  <svg class="bili-video-card__info--owner__up">
                    <use xlink:href="#widget-up"></use>
                  </svg>
                  <span class="bili-video-card__info--author"${data.name ? '' : ' style="width: 90%"'}>${data.name || data.badge + ' - ' + data.desc}</span>
                  <span class="bili-video-card__info--date"${data.goto == 'av' ? '' : ' style="display: none"'}>${returnDateTxt(data.ctime)}</span>
                </a>
              </p>
            </div>
            <div class="ctrl">
              <div class="tb">
                <div class="sp">
                  <a href="javascript:;" data-aid="${data.param}" id="Jwatch">稍后再看</a>
                  <a href="javascript:;" data-id="${'av' + data.param}" id="Jbbdown">BBDown下载</a>
                  <a href="https://github.com/nilaoda/BBDown" target="https://github.com/nilaoda/BBDown" class="lk">BBDown说明</a>
                </div>
                <div class="dislike"${options.isAppType ? (options.accessKey ? '' : ' style="display: none"') : ' style="display: none"'}>
                  <div class="ready">
                    <div class="tlt">-- 减少相似内容推荐 --</div>
                    <a href="javascript:;" class="dl" data-rsid="4" data-goto="${data.goto}" data-id="${data.param}" data-mid="${data.mid}" data-rid="${data.tid}" data-tagid="${data.tag?.tag_id}">UP主</a>
                    <a href="javascript:;" class="dl" data-rsid="1" data-goto="${data.goto}" data-id="${data.param}" data-mid="${data.mid}" data-rid="${data.tid}" data-tagid="${data.tag?.tag_id}">不感兴趣</a>
                    <a href="javascript:;" class="dl" data-rsid="12" data-goto="${data.goto}" data-id="${data.param}" data-mid="${data.mid}" data-rid="${data.tid}" data-tagid="${data.tag?.tag_id}">此类内容过多</a>
                    <a href="javascript:;" class="dl" data-rsid="13" data-goto="${data.goto}" data-id="${data.param}" data-mid="${data.mid}" data-rid="${data.tid}" data-tagid="${data.tag?.tag_id}">推荐过</a>
                  </div>
                  <div class="over">
                    <div class="reason"></div>
                    减少相似内容推荐
                    <a href="javascript:;" data-goto="${data.goto}" data-id="${data.param}" data-mid="${data.mid}" data-rid="${data.tid}" data-tagid="${data.tag?.tag_id}" id="Jreturn">撤销</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    return html
  }
  function formatNumber(input, format = 'number'){
    if (format == 'time') {
      let second = input % 60;
      let minute = Math.floor(input / 60);
      let hour;
      if (minute > 60) {
        hour = Math.floor(minute / 60);
        minute = minute % 60;
      }
      if (second < 10) second = '0' + second;
      if (minute < 10) minute = '0' + minute;
      return hour ? `${hour}:${minute}:${second}` : `${minute}:${second}`
    } else {
      return input > 9999 ? `${(input / 10000).toFixed(1)}万` : input || 0
    }
  }
  function returnDateTxt(time){
    if (!time) return '';
    let date = new Date(time * 1000);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    // return `· ${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    return `· ${month}-${day}`
  }
  function token(){
    try {
      return document.cookie.match(/bili_jct=([0-9a-fA-F]{32})/)[1]
    } catch(e) {
      return ''
    }
  }
  async function watchlater($el){
    const aid = $el.data('aid');
    let type = $el.hasClass('del') ? 'del' : 'add';
    let res = null;
    let data = null;
    try {
      res = await fetch(`https://api.bilibili.com/x/v2/history/toview/${type}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `aid=${aid}&csrf=${token()}`
      })
    } catch (error) {
      toast(error)
    }
    try {
      data = await res.json();
    } catch (error) {
      toast(error)
    }
    isWait = false;
    if(data.code == 0){
      // if(type == 'add'){
      //   $el.addClass('del').find('span').text('移除');
      //   $el.find('svg').html('<use xlink:href="#widget-watch-save"></use>');
      //   toast('添加成功')
      // }else{
      //   $el.removeClass('del').find('span').text('稍后再看');
      //   $el.find('svg').html('<use xlink:href="#widget-watch-later"></use>');
      //   toast('移除成功')
      // }
      if(type == 'add'){
        $el.addClass('del').text('移除视频');
        toast('添加成功')
      }else{
        $el.removeClass('del').text('稍后再看');
        toast('移除成功')
      }
    }else{
      toast(data.message)
    }
  }
  async function getPreviewImage($el, e){
    const aid = $el.data('aid');
    let pvData = $el[0].pvData;
    if(!pvData){
      let res = null;
      let data = null;
      try {
        // res = await fetch(`https://api.bilibili.com/pvideo?aid=${aid}`);
        res = await fetch(`https://api.bilibili.com/x/player/videoshot?aid=${aid}&index=1`)
      } catch (error) {
        // toast(error)
      }
      try {
        data = await res.json();
        pvData = $el[0].pvData = data?.data;
      } catch (error) {
        // toast(error)
      }
    }
    setPosition($el, e, pvData)
  }
  async function getPreviewDanmaku($el){
    const aid = $el.data('aid');
    let danmakuData = $el[0].danmakuData;
    if(!danmakuData){
      let res = null;
      let data = null;
      try {
        res = await fetch(`https://api.bilibili.com/x/v2/dm/ajax?aid=${aid}`);
      } catch (error) {
        // toast(error)
      }
      try {
        data = await res.json();
        danmakuData = $el[0].danmakuData = data?.data
      } catch (error) {
        // toast(error)
      }
    }
    setDanmakuRoll($el, danmakuData);
  }
  function setPosition($el, mouseX, pvData){
    if(!pvData) return;
    const $tarDom = $el.find('.v-inline-player');
    // const $duration = $el.data('duration');
    const $pvbox = $tarDom.find('pv-box');
    const width = $tarDom.width();
    const height = $tarDom.height();
    const sizeX = width * pvData.img_x_len;
    const sizeY = height * pvData.img_y_len;
    const onePageImgs = pvData.img_x_len * pvData.img_y_len;
    const rIndexList = pvData.index.slice(1);
    const pageSize = Math.ceil(rIndexList.length / onePageImgs);
    let percent = mouseX / width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    const durIndex = Math.floor(percent * rIndexList.length)
    const page = Math.floor(durIndex / (pvData.img_x_len * pvData.img_y_len));
    const imgUrl = pvData.image[page];
    const imgIndex = durIndex - page * onePageImgs;
    const x = ((imgIndex - 1) % pvData.img_x_len) * width;
    // const y = Math.floor(imgIndex / (pvData.img_x_len)) * (width * pvData.img_y_size / pvData.img_x_size);
    const y = Math.floor(imgIndex / (pvData.img_x_len)) * height;
    const imgY = (Math.floor(imgIndex / pvData.img_x_len)) + 1;
    const imgX = imgIndex - (imgY - 1) * pvData.img_x_len;
    const bar = percent * 100;
    if($pvbox.length > 0){
      $pvbox.css({
        'background': `url(https:${imgUrl}) ${x < 0 ? 0 : -x}px ${y < 0 ? 0 : -y}px no-repeat`
      })
      $pvbox.next().css({
        'width': `${bat}%`
      })
      return
    }
    $tarDom.html(`
      <div class="pv-box" style="background: url(https:${imgUrl}) ${x < 0 ? 0 : -x}px ${y < 0 ? 0 : -y}px no-repeat;background-size: ${sizeX}px ${sizeY}px;height: 100%;pointer-events:none"></div>
      <div class="pv-bar" style="position: absolute;left: 0;top: 0;background: #fb7299;width: ${bar}%;height: 3px;z-index: 2"></div>
    `)
  }
  function setDanmakuRoll($el, danmakuData){
    if(danmakuData.length <= 0) return;
    const $tarDom = $el.find('.v-inline-danmaku');
    let $items = $tarDom.find('p');
    let outWidth = $tarDom.width();
    let lastWait = new Array(5).fill(600);
    let defaultMoveOpts = {
      pageSize: 5,
      size: Math.ceil(danmakuData.length / 5),
      defaultHeight: 18,
      topSalt: 5,
      dur: 5
    }
    if($items.length > 0) $tarDom.empty();
    for(let i = 0;i < danmakuData.length;i++){
      let options = {
        channel: i % defaultMoveOpts.pageSize,
        startPosX: outWidth,
        startPosY: i % 5 * defaultMoveOpts.defaultHeight + defaultMoveOpts.topSalt
      };
      let $html = $(`<p data-channel="${options.channel}" style="top: ${options.startPosY}px;left: ${options.startPosX}px">${danmakuData[i]}</p>`);
      let wait = (lastWait[options.channel] + (Math.floor(Math.random() * 1000 + 100))) / 1000;
      $tarDom.append($html);
      options.width = $html.width();
      options.moveX = options.width + outWidth;
      options.dur = (options.width + outWidth) / (outWidth / defaultMoveOpts.dur);
      $html.css({
        'transform': `translateX(-${options.moveX}px)`,
        'transition': `transform ${options.dur}s linear ${wait}s`,
        'opacity': 1
      })
      lastWait[options.channel] = (wait + options.dur * 0.6) * 1000
    }
  }
  function dislike($el, isReturn){
    const errmsg = '减少推荐内容请求失败';
    const token = options.accessKey ? '&access_key=' + options.accessKey : '';
    const reason = {
      '4': 'UP主',
      '1': '不感兴趣',
      '12': '此类内容过多',
      '13': '推荐过'
    }
    const $wp = $el.closest('.dislike');
    const params = {
      'goto': $el.data('goto'),
      'id': $el.data('id'),
      'mid': $el.data('mid'),
      'reason_id': $el.data('rsid'),
      'rid': $el.data('rid'),
      'tag_id': $el.data('tagid')
    }
    let url = `https://app.bilibili.com/x/feed/dislike`;
    if(isReturn){
      url += '/cancel'
    }
    url += `?appkey=27eb53fc9058f8c3&build=5000000&goto=${params.goto}&id=${params.id}&mid=${params.mid}&reason_id=${params.reason_id}&rid=${params.rid}&tag_id=${params.tag_id}` + token;
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: res => {
        try {
          const rep = JSON.parse(res.response);
          if (rep.code != 0) {
            toast(errmsg)
          }
          if(isReturn){
            $wp.find('.over').hide().find('.reason').text('');
            $wp.find('.ready').css({
              'display': 'flex'
            });
            $wp.removeClass('dlike');
            toast('撤销成功')
          }else{
            $wp.find('.ready').hide();
            $wp.find('.over').css({
              'display': 'flex'
            }).find('.reason').text($el.text());
            $wp.addClass('dlike');
            if($wp.closest('.ctrl').is(':hidden')){
              $wp.closest('.ctrl').show()
            }
            toast('减少推荐成功')
          }
        } catch(e) {
          toast(errmsg)
        }
        isWait = false;
      },
      onerror: e => {
        isWait = false;
        toast(errmsg)
      }
    })
  }
  init()
})();
