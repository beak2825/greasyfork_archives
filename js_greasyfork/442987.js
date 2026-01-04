// ==UserScript==
// @name         GGS网校刷课
// @namespace    https://greasyfork.org/users/899412
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/cookiejs@2.1.1/dist/cookie.min.js
// @version      2.1.0
// @description  仅支持广工商网校刷课网站，傻瓜式操作，安装即用
// @author       ByoneJie
// @match        *://study.gzgsmooc.org.cn/*
// @icon         https://upyun.byone.top/uploads%2F2022%2F04%2F11%2FquAWKEjl_shcool.gif
// @connect      orc.byone.top
// @connect      127.0.0.1
// @connect      gzad.byone.top
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @license      MIT
// @note        郑重声明：本脚本只做学习交流使用，未经作者允许，禁止转载，不得使用与非法用途，一经发现，追责到底
// @downloadURL https://update.greasyfork.org/scripts/442987/GGS%E7%BD%91%E6%A0%A1%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/442987/GGS%E7%BD%91%E6%A0%A1%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

// 引入css
var $ = $ || window.$;
$('head').append($(`<link rel="stylesheet" href="https://upyun.byone.top/uploads%2F2022%2F04%2F16%2F37VLSTYK_ggswk_2.0.0.css">`))
$('body').append($(`<script src="https://upyun.byone.top/uploads%2F2022%2F04%2F14%2F18nar1Dg_utils.js"></script>`))
// ggs刷课脚本
const version = '2.1.0'
var timerWhiteList = 0;
var codeStatus = '';

var tools = [
  {
    id: 1,
    name: '解除进度条拖动',
    type: 'checkbox',
    value: false
  },
  {
    id: 2,
    name: '倍数重置',
    type: 'checkbox',
    value: false
  },
  {
    id: 3,
    name: '自动下一集',
    type: 'checkbox',
    value: false
  },
  {
    id: 10,
    name: '重置脚本',
    type: 'button',
    value: 'reset'
  },
  {
    id: 11,
    name: '自动检测更新',
    type: 'checkbox',
    value: true
  },
  {
    id: 12,
    name: '运行日志',
    type: 'checkbox',
    value: false
  }
]

var stuInfo = {};
var userInfo = {};
var token = '';
var logContent =  ``;
var logCount = 0;
var rate = [
  {
    key: 0.5,
    value: '0.5倍'
  },
  {
    key: 1,
    value: '1倍'
  },
  {
    key: 1.25,
    value: '1.25倍'
  },{
    key: 2,
    value: '2倍'
  },{
    key: 4,
    value: '4倍'
  },{
    key: 6,
    value: '6倍(推荐)'
  },{
    key: 10,
    value: '10倍(推荐)'
  },{
    key: 16,
    value: '16倍'
  }
];
// 初始化值GM值
if (!GM_getValue('init', false)) {
  addLog('✨init...');
  GM_setValue('init', true);
  GM_setValue('data', JSON.stringify(tools));
  GM_setValue('rate', 1);
} else {
  if(JSON.parse(GM_getValue('data')).length !== tools.length) {
    addLog('🦖有新功能更新啦');
    GM_setValue('data', JSON.stringify(tools));
  }
  tools = JSON.parse(GM_getValue('data'));
  addLog('✨init complete...');
}
if(tools[getToolsIdx(11)].value){
  getVersion();
}
createLog();
createDom();
checkLogin();
$('.app-download').css({right: '150px',top: '50px'})
  

function checkLogin(){
  addLog('💫正在检查是否登录...请先登录');
  let checkLoginId = setInterval(function () {
    token = cookie.get('token');
    if (token) {
      addLog('✨获取用户信息成功...已登录');
      setTimeout(function(){
        userInfo = JSON.parse(decodeURIComponent(cookie.get('userInfo')));
        stuInfo = JSON.parse(decodeURIComponent(cookie.get('stuInfo')));
        createDom();
        addLog(`🎉欢迎${userInfo.nickname}同学使用本插件`);
      },500)
      clearInterval(checkLoginId);
    }
  }, 1000)
}

// 获取验证码
function getCode(uri) {
  addLog('💫正在获取验证码...');
  let data = { uri: uri };
  let ret = '';
  ret = GM_xmlhttpRequest({
    method: "POST",
    url: "http://orc.byone.top/ocr/uri/text",
    headers: { 
      "Content-Type": "application/json;charset=UTF-8"
    }, 
    data: JSON.stringify(data),
    contentType: 'text/html',
    onload: function(res) {
      $('.form-checkCode').val(res.responseText);
      $('.form-checkCode').get(0).dispatchEvent(new Event('input'));
      addLog('✨验证码获取成功');
      getCodeStatus('ok');
    },
    onerror: function(err) {
      addLog('getcode:'+err);
      getCodeStatus('error');
    }
  })
  return ret;
}

function getCodeStatus(status) {
  codeStatus = status;
}

function getToolsIdx(id){
  return tools.findIndex(e => e.id === id);
}

function createDom() {
  if($('#panel').length > 0){
    $('#panel').remove();
  }
  let selOption =  ``;
  rate.map(item => {
    selOption += `<option value="${item.key}" ${GM_getValue('rate') === item.key ? 'selected' : ''}>${item.value}</option>`
  })
  // 创建控制面板
  const panel = `<div id="panel">
<div class="panel-off">
  <img src="https://upyun.byone.top/uploads%2F2022%2F04%2F05%2F3ovPhhjT_20220318221625.jpg" alt="启动图标">
</div>
<div class="panel-body">
  <div class="userinfo">
    <div class="avatar">
      <img
        src="${userInfo.avatar || 'https://upyun.byone.top/uploads%2F2022%2F04%2F11%2FquAWKEjl_shcool.gif'}"
        alt="">
    </div>
    <div class="info">
      <div class="nickname">${userInfo.nickname || '未登录'}</div>
      <div class="code">${stuInfo.studentCode || '请先登录后使用'}</div>
    </div>
    <div class="loginout">
    ${token ?
      `<div class="btn" id="logout">退出登录</div>` :
      `<div class="btn" id="get_code">获取验证码</div>`
    }
    </div>
  </div>
  <div class="content">
    ${!token ? `<div class="mask"></div>` : ``}
    <ul class="mdui-list">
    ${tools.map(item => {
      return `<li class="mdui-list-item mdui-ripple">
        ${item.id === 2 ?
          `<div class="mdui-list-item-content">
            <span>${item.name}</span>
            <select class="byone-select" id="rate" byone-select>
            ${selOption}
            </select>
          </div>`
          :
          `<div class="mdui-list-item-content">${item.name}</div>`
        }
        ${item.type === 'checkbox' ?
          `<label class="mdui-switch">
          <input type="checkbox" data-id="${item.id}" ${item.value ? 'checked' : ''} />
          <i class="mdui-switch-icon"></i>
        </label>` : `<div class="btn" id="${item.value}">${item.name}</div>`
        }
      </li>`}).join('')
    }
    </ul>
  </div>
</div>
</div>`
  $('body').append($(panel));
  initByoneSelect();
  
  // 获取下拉框的值
  $('#rate').on('change',function(){
    const path = location.pathname;
    let val = $(this).val() * 1;
    const flag = $(this).parent().next().children('input[type="checkbox"]').is(":checked");
    if(!flag){
      if(val >= 2){
        $(this).parent().next().get(0).click();
      }
    }
    
    if(path === '/play-vod'){
      if(val < 2){
        let vals =  val === 1 ? '1.0' : val;
        $('.rate-list').children('li[data-rate="'+vals+'"]').get(0).click();
      }else{
        if(!flag){
          setTimeout(function(){
            $('.rate-list').children('li[data-rate="'+val+'"]').get(0).click();
          },2000)
        }else{
          // 判断是否有这个元素 没有在进行添加并点击
          let rateDom =  $('.rate-list').children('li[data-rate="'+val+'"]')
          if(rateDom.length = 0){
            $('.rate-list').append(`<li data-rate="${val}">${val}x</li>`);
          }
          rateDom.get(0).click();
        }
      }
    }
    GM_setValue('rate',val)
    addLog(`✨默认倍数调整${$(this).children('option:selected').text()}成功`);
  })

  // 切换面板
  $('.panel-off').click(function () {
    $('.panel-body').toggleClass('open');
  })

  // 清空数据
  $('#reset').on('click', function () {
    GM_listValues().map(GM_deleteValue);
    addLog('reset success...');
    location.reload();
  })

  // 获取验证码
  $('#get_code').on('click',function(){
    let url = $('.login-code-img').attr('src');
    const username = $('.form-username').val();
    const password = $('.form-password').val();
    if(username && password){
      getCode(url);
      setTimeout(function(){
        if(codeStatus === 'ok'){
          $('#onSubmit').click();
        }
      },500)
    }else{
      getCode(url);
    }
  })

  // 退出登录
  $('#logout').on('click',function() {
    $('.el-dropdown-menu__item').click();
  })

  // 给开关绑定事件
  $('.mdui-switch input[type="checkbox"]').on('click', function () {
    let flag = false;
    let id = $(this).data('id');
    if ($(this).is(":checked")) {
      flag = true;
    } else {
      flag = false;
    }
    // addLog(`${id},${flag}`);
    updData(id,flag);
    if (id == 1) {
      removeProgress(flag);
    } else if (id == 2) {
      resetSpeed(flag);
      if(!flag){
        if(GM_getValue('rate') >= 2){
          $('.byone-select-menu-item[data-value="1"]').get(0).click();
        }
      }
    } else if (id == 3) {
      autoNextVedio(flag);
    }else if(id == 12){
      toggleLog();
    }
  })
}

// 创建日志面板
function createLog() {
  let dom = `<div class="script-log" style="display: ${!tools[getToolsIdx(12)].value ? 'none' : 'block'}">
    <div class="log-head">运行日志</div>
    <textarea name="log" id="log-text" readonly></textarea>
  </div>`
  $('body').append($(dom));
  setTimeout(function(){
    dragBox('.log-head', '.script-log');
  },100)
}

// 添加日志
function addLog(text) {
  if(tools[getToolsIdx(12)].value){
    if(typeof text === 'string'){
      logContent += text + '\n';
      $('#log-text').val(logContent);
      setTimeout(function(){
        let h = document.getElementById('log-text').scrollHeight;
        document.getElementById('log-text').scrollTop = h;
      },1000)
      logCount++;
      if(logCount >= 100){
        logContent = ``;
        logCount = 0;
      }
    }else{
      console.log(text);
    }
  }else{
    console.log(text);
  }
}

// 更新保存的值
function updData(id, value) {
  let idx = tools.findIndex(e => e.id === id);
  tools[idx].value = value;
  // 更新成功保存进油猴
  GM_setValue('data', JSON.stringify(tools));
  addLog(`[${tools[idx].name}]-${value?`✅已开启`:`❎已关闭`}`);
}

// 切换日志开启和关闭
function toggleLog(){
  $('.script-log').toggle();
  console.clear();
  logCount = 0;
  logContent = ``;
}

// 监听pushState和replaceState
const addHistoryEvent = function (type) {
  let originalMethod = history[type];
  return function () {
    let recallMethod = originalMethod.apply(this, arguments);
    let e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return recallMethod;
  };
};

history.pushState = addHistoryEvent('pushState');
history.replaceState = addHistoryEvent('replaceState');

// 监听地址栏变化
const path = location.pathname;
if (path === '/play-vod') {
  let rate = GM_getValue('rate');
  isDialog();
  if (tools[0].value) {
    removeProgress(tools[0].value);
  }
  if (tools[1].value) {
    resetSpeed(tools[1].value);
  }else{
    playerReady(function(){
      if(rate !== 1){
        $('li[data-rate="'+rate+'"]').get(0).click();
      }
    })
  }
  if (tools[2].value) {
    autoNextVedio(tools[2].value);
  }
}
const handler = function (e) {
  let path = e.target.location.pathname;
  if(path === '/login'){
    addLog('🐳退出登录成功');
    stuInfo = {};
    userInfo = {};
    token = '';
    createDom();
    checkLogin();
  }
  if (path === '/play-vod') {
    let rate = GM_getValue('rate');
    isDialog();
    playerReady(function(el){
      addLog('视频正在播放...')
      let currRate = $('.current-rate').text()
      if(currRate !== (rate+'x')){
        console.log(currRate !== (rate+'x'));
       setTimeout(function(){
          resetSpeed();
       },3000)
      }else{
        addLog('🦖相等')
      } 
    })
    
    if (tools[0].value) {
      removeProgress(tools[0].value);
    }
    if (tools[1].value) {
      resetSpeed(tools[1].value);
    }else{
      playerReady(function(){
        if(rate !== 1){
          $('li[data-rate="'+rate+'"]').get(0).click();
        }
      })
    }
    if (tools[2].value) {
      autoNextVedio(tools[2].value);
    }
  }else{
    if(timerWhiteList > 0){
      clearInterval(timerWhiteList);
    }
  }
}
$(unsafeWindow).on('pushState', handler);
$(unsafeWindow).on('replaceState', handler);

// 解除禁用拖动条
function removeProgress(flag) {
  if (flag && location.pathname === '/play-vod') {
    playerReady(function (el) {
      $('.cover-bar').hide();
      autoPlay();
      addLog('✨进度条拖动限制解除...');
    })
  } else {
    $('.cover-bar').show();
    addLog('✨进度条拖动已限制...');
  }
}
// 重置倍数
function resetSpeed(flag) {
  const mult = [2, 4, 6, 8, 10, 16];
  let rate = GM_getValue('rate'); 
  if (flag && location.pathname === '/play-vod') {
    playerReady(function () {
      autoPlay();
      let html = ``;
      mult.map(v => {
        html += `<li data-rate="${v}">${v}x</li>`
      })
      setTimeout(function () {
        $('.rate-list').append(html);
        addLog('✨重置视频倍数成功...');
        if(rate >= 2 || ((flag && rate < 2) && rate !== 1)){
          $('li[data-rate="'+rate+'"]').get(0).click();
        }
      }, 1000)
    })
  } else {
    mult.map(el => {
      $('li[data-rate="' + el + '"]').remove();
    });
  }
}

// 自动下下一集
function autoNextVedio(flag) {
  if (flag) {
    autoReloadVedio();
    playerReady(function (el) {
      let unsee = [];
      let list = $('.chapter-jump-wrap');
      for (let i = 0; i < list.length; i++) {
        let pro_text = list.eq(i).find('.progress_txt').text().trim();
        let lessName = list.eq(i).find('.course-chapter-item-text').text().replace(/[\s|必修]/gm, "");
        if (pro_text !== '100' && !list.eq(i).children('.course-chapter-item').hasClass('actived')) {
          unsee.push({
            idx: i,
            courseName: lessName
          });
        }
      }
      addLog(unsee);
      el.on('play',function(){
        addLog('视频开始播放...')
      })
      el.on('pause',function(){
        addLog('视频已暂停...')
      })
      el.on('playing',function(){
        addLog('视频正在播放...')
      })
      // 卡住应急处理
      const defaultProgress = list.children('.course-chapter-item.actived').find('.progress_txt').text().trim()
      let currObj = { progress: 0, count: 1 };
      currObj.progress = parseInt(defaultProgress);
      let id = setInterval(function () {

        let pro_text = list.children('.course-chapter-item.actived').find('.progress_txt').text().trim();
        // 进度条90以上进行统计
        if(parseInt(pro_text) > 70){
          if(currObj.progress === parseInt(pro_text)){
            currObj.count++;
          }else{
            currObj.progress = parseInt(pro_text);
            currObj.count = 1;
          }
        }
        // 如果在90%一直卡住则自动下一集
        if(currObj.progress > 70 && currObj.count > 5){
          addLog('🤔疑似进度条卡死...稍后将为你播放下一集')
          clearInterval(id);
          $('.chapter-jump-wrap').eq(unsee[0].idx).children('.course-chapter-item').get(0).click();
          return false;
        }
        if (pro_text === "100" || parseInt(pro_text) >= 97) {
          if (unsee.length !== 0) {
            addLog('✨['+unsee[0].courseName+']播放完成');
            clearInterval(id);
            $('.chapter-jump-wrap').eq(unsee[0].idx).children('.course-chapter-item').get(0).click();
          } else {
            addLog('✨播放列表全部完成');
            clearInterval(id);
          }
        } else {
          addLog('🕐当前进度:'+ pro_text+'%')
          let isErr = $('.cover-view').children().is('.text');
          if(isErr){
            addLog('🤕网络波动，请稍后重试...')
            clearInterval(id);
          }
        }
      }, 3500)
      addLog('🕐定时器ID:'+id);
      timerWhiteList = id;
    })
  } else {
    clearInterval(timerWhiteList);
  }
}



// 视频自动播放(打开声音不能进行自动播放)
function autoPlay() {
  // 设置静音
  $('.prism-player').children('video')[0].player.setVolume(0)
  $('.prism-player').children('video')[0].play();
}

// 视频组件加载完成执行
function playerReady(handler) {
  addLog('💫正在加载视频组件...');
  let timer = setInterval(function () {
    let video = $('.prism-player').children('video');
    try {
      let state = video[0].readyState;
      if (state === 4) {
        clearInterval(timer);
        addLog('✨视频组件加载完成');
        handler($('.mtz-vlc-fanoa'))
      }
    } catch (err) {
      console.log('💫正在加载视频组件...', err);
    }
  }, 1000)
}

// 检测是否有弹出提醒
function isDialog(){
  setInterval(function(){
    if($(document).find('.el-message-box__wrapper').length){
      let hidden = $('.el-message-box__wrapper[role="dialog"]').is(':hidden');
      if(!hidden){
        $('.el-message-box__wrapper[role="dialog"]').find('button[type="button"]').get(0).click();
      }
    }
  },1000)
}

// 检测因为网络波动所造成的暂停
function autoReloadVedio(){
  setInterval(function(){
    // console.log($('.video-wraper').children('.cover-view').find('.text').is('.text'));
    let isPause = $('.video-wraper').children('.cover-view').find('.text').is('.text');
    if(isPause){
      // clearInterval(timerWhiteList);
      $('.course-chapter-item.actived').get(0).click();
      resetSpeed();
    }
  },1000)
}

// 检查版本是否有更新
function getVersion(){
  addLog('💫正在获取是否有新版本...')
  GM_xmlhttpRequest({
    method: "GET",
    url: "http://gzad.byone.top/api/getMkVersion?url=https://greasyfork.org/zh-CN/scripts/442987",
    headers: { 
      "Content-Type": "application/json;charset=UTF-8"
    }, 
    onload: function(res) {
      let ver = JSON.parse(res.responseText).data;
      addLog('✨版本获取成功：'+ver);
      if(getVersionInt(version) < getVersionInt(ver)){
        addLog('🎉有新版本发布啦!');
        GM_notification({
          title: 'GGS网校刷课',
          text: '🎉有新版本发布啦~赶紧来更新吧！',
          image: 'https://upyun.byone.top/uploads%2F2022%2F04%2F11%2FquAWKEjl_shcool.gif',
          timeout: 10000,
          onclick: ()=>{
            GM_openInTab('https://greasyfork.org/zh-CN/scripts/442987',{ active: true, insert: true, setParent: true });
          }
        })
      }
    },
    onerror: function(err) {
      console.log('getVersion:',err);
    }
  })
}

// 解析版本号整型
function getVersionInt(str) {
  return parseInt([...str].filter(item => {
    return item !== '.'
  }).join(""));
}


// 移动元素
function dragBox(moveRegion, bodyRegion) {
  const move = document.querySelector(moveRegion);
  const body = document.querySelector(bodyRegion);
  // 获取css
  function getCss(ele, prop) {
    return parseInt(window.getComputedStyle(ele)[prop]);
  }

  let x, y = 0;
  let dragable = false;
  let warpLeft = getCss(body, "left");
  let warpTop = getCss(body, "top");

  move.addEventListener('mousedown', function (e) {
    dragable = true;
    x = e.clientX;
    y = e.clientY;
  }, false);

  document.addEventListener('mousemove', function (e) {
    if (dragable) {
      let nx = e.clientX,
        ny = e.clientY,
        disX = nx - x,
        disY = ny - y

      body.style.left = warpLeft + disX + 'px';
      body.style.top = warpTop + disY + 'px';
    }
  })

  move.addEventListener('mouseup', function (e) {
    dragable = false;
    warpLeft = getCss(body, 'left');
    warpTop = getCss(body, 'top');
  })
}

function initByoneSelect() {
  // 获取每个select
  $('select[byone-select]').each(function (i) {
    // 遍历获取select的的数据
    let selItems = [];
    $(this).children('option').each(function () {
      selItems.push($(this).val());
    })
    $(this).hide();
    // 创建下拉框dom
    // 获取选中的值
    let selValue = $(this).children('option:selected').text();
    let selIndex = $(this).get(0).selectedIndex;
    let selList = ``;
    selItems.forEach((item, index) => {
      selList += `<div class="byone-select-menu-item byone-ripple" data-value="${item}" ${index === selIndex ? 'selected' : ''}>${$(this).children('option[value="' + item + '"]').text()}</div>`
    })
    const dom = `<div class="byone-select">
      <div class="byone-select-selected">${selValue}</div>
      <div class="byone-select-menu">
        ${selList}
      </div>
    </div>`
    $(this).after(dom);
    // 添加点击事件
    $(this).next().on('click', function () {
      $(this).addClass('byone-select-open');
      const menu = $(this).children('.byone-select-menu');
      const menuHeight = menu.get(0).scrollHeight + 'px';
      const menuWidth = menu.get(0).scrollWidth + 16 + 'px';
      menu.css({
        transformOrigin: 'center 80px 0px',
        height: menuHeight,
        width: menuWidth,
        overflow: 'auto'
      })
    })
  })
  // 监听元素点击元素
  $('.byone-select-menu-item').on('click', function (event) {
    $(this).parent().css({
        transformOrigin: 'center 80px 0px',
        height: '',
        width: '',
        overflow: ''
    })
    $(this).parent().parent().removeClass('byone-select-open');

    $(this).siblings().removeAttr('selected');
    $(this).attr('selected',true);
    $(this).parent().prev().text($(this).text());
    $(this).parent().parent().prev().val($(this).data('value'));
    $(this).parent().parent().prev().change();
    // 阻止冒泡防止点击到开启事件
    event.stopPropagation();
  })


  // 设置全局监听关闭select
  $(document).on('click', function (e) {
    if ($(e.target).closest('.byone-select').length === 0) {
      $('.byone-select.byone-select-open').children('.byone-select-menu').css({
        transformOrigin: 'center 80px 0px',
        height: '',
        width: '',
        overflow: ''
      })
      $('.byone-select.byone-select-open').removeClass('byone-select-open');
    }
  })
}
})();