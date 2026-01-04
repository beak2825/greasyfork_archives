// ==UserScript==
// @name            B站合集倒序播放
// @description     增强B站功能，支持视频合集倒序播放，还有一些其他小功能
// @version         0.2.2
// @author          Grant Howard, Coulomb-G
// @copyright       2024, Grant Howard
// @license         MIT
// @match           *://*.bilibili.com/video/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @exclude         *://message.bilibili.com/pages/nav/header_sync
// @exclude         *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude         *://open-live.bilibili.com/*
// @run-at          document-start
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_info
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_addStyle
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/qmsg@1.6.0/dist/index.umd.min.js
// @connect         raw.githubusercontent.com
// @connect         github.com
// @connect         cdn.jsdelivr.net
// @connect         cn.bing.com
// @connect         www.bing.com
// @connect         translate.google.cn
// @connect         translate.google.com
// @connect         localhost
// @connect         *
// @icon            https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo-small.png
// @icon64          https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo.png
// @namespace https://greasyfork.org/users/734541
// @downloadURL https://update.greasyfork.org/scripts/504323/B%E7%AB%99%E5%90%88%E9%9B%86%E5%80%92%E5%BA%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/504323/B%E7%AB%99%E5%90%88%E9%9B%86%E5%80%92%E5%BA%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(() => {
  GM_addStyle(`#zaizai-div .video-sections-head_second-line {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 12px 16px 0;
        color: var(--text3);
        color: var(--text3);
        padding-bottom: 12px;
        font-size: 14px;
        line-height: 16px;
        gap: 10px 20px;
    }

    #zaizai-div .border-bottom-line {
        height: 1px;
        background: var(--line_regular);
        margin: 0 15px;
    }

    #zaizai-div .switch-button {
        margin: 0;
        display: inline-block;
        position: relative;
        width: 30px;
        height: 20px;
        border: 1px solid #ccc;
        outline: none;
        border-radius: 10px;
        box-sizing: border-box;
        background: #ccc;
        cursor: pointer;
        transition: border-color .2s, background-color .2s;
        vertical-align: middle;
    }

    #zaizai-div .switch-button.on:after {
        left: 11px;
    }

    #zaizai-div .switch-button:after {
        content: "";
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 100%;
        width: 16px;
        height: 16px;
        background-color: #fff;
        transition: all .2s;
    }

    #zaizai-div .switch-button.on {
        border: 1px solid var(--brand_blue);
        background-color: var(--brand_blue);
    }

    #zaizai-div .txt {
        margin-right: 4px;
        vertical-align: middle;
    }

    #zaizai-div .scroll-to-the-current-playback{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: var(--brand_blue);
      color: var(--brand_blue);
      width: 100%;
      height: 24px;
      border-radius: 2px;
      border: 1px solid var(--brand_blue);
      border: 1px solid var(--brand_blue);
    }
    `);

  const console = (() => {
    const _console = window.console;
    return {
      log: _console.log.bind(
        _console,
        `%c ZAIZAI `,
        'padding: 2px 1px; border-radius: 3px; color: #fff; background: #42c02e; font-weight: bold;',
      ),
    };
  })();
  // 全局变量
  const $ = window.jQuery;
  const Qmsg = window.Qmsg;
  console.log(`🚀 ~ Qmsg:`, Qmsg);
  if (Qmsg) {
    Qmsg.config({
      position: 'top',
    });
  }
  const local = useReactiveLocalStorage({
    defaultreverseorder: false,
    // 开启倒序播放
    startreverseorder: false,
    addsectionslistheigth: false,
  });

  let timeoutId = null;
  // 当前视频元素
  let Video = null;
  // 视频分条元素
  let videoSections = null;
  // 键盘事件
  let keyupCodeFn = {};

  function useReactiveLocalStorage(obj) {
    let data = {};
    let zaizaiStore = window.localStorage.getItem('zaizai-store');
    if (zaizaiStore) {
      zaizaiStore = JSON.parse(zaizaiStore);
      for (const key in obj) {
        data[key] = zaizaiStore[key] || obj[key];
      }
    } else {
      data = obj;
    }

    let handler = {
      set(target, key, value) {
        let res = Reflect.set(target, key, value);
        try {
          window.localStorage.setItem(`zaizai-store`, JSON.stringify(data));
        } catch (error) {
          console.log('存储失败，请检查浏览器设置', error);
        }
        return res;
      },
      get(target, key) {
        let ret = Reflect.get(target, key);
        return typeof ret === 'object' ? new Proxy(ret, handler) : ret;
      },
    };
    data = new Proxy(data, handler);
    return data;
  }

  function delayTime(time = 500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }

  function waitTask(callback, options = {}) {
    options = Object.assign({ time: 500, isSetup: false, maxRun: 10 }, options);
    return new Promise(async (resolve) => {
      let res;
      if (options.isSetup) {
        res = callback();
        return resolve(res);
      }
      for (let index = 0; index < options.maxRun; index++) {
        await delayTime(options.time);
        res = callback();
        if (res) {
          return resolve(res);
        }
      }
      resolve(false);
    });
  }

  // 判断当前聚焦元素是否为表单元素
  function isFocusedFormElement() {
    const activeElement = $(document.activeElement);
    if (!activeElement.length) return false;
    const tagName = activeElement.prop('tagName').toLowerCase();
    // 常见表单元素标签名
    const formTags = ['input', 'textarea', 'select', 'button'];
    return formTags.includes(tagName);
  }

  // 查找多个元素，返回第一个找到的元素
  function selectShowEl(arr) {
    for (const element of arr) {
      const el = $(element);
      if (el.length) return el[0];
    }
  }

  // 对合集列表增高
  async function switchAddsectionslistheigthOnClick(action) {
    if (typeof action === 'boolean') {
      local.addsectionslistheigth = action;
    } else {
      if (this.classList.contains('on')) {
        local.addsectionslistheigth = false;
      } else {
        local.addsectionslistheigth = true;
      }
    }
    const ListEl = await waitTask(() => {
      return selectShowEl(['.video-sections-content-list', '.rcmd-tab .video-pod__body']);
    });
    if (local.addsectionslistheigth) {
      $(ListEl).css({
        maxHeight: '40vh',
        height: '40vh',
      });
      $('#addsectionslistheigth').addClass('on');
    } else {
      $(ListEl).removeAttr('style');
      $('#addsectionslistheigth').removeClass('on');
    }
  }

  // 判断是否开启了 循环播放
  async function getisReverseorder() {
    const playerloop_checkbox = await waitTask(
      () => {
        let checkbo = selectShowEl([
          '.bui-switch-input[aria-label="洗脑循环"]',
          '.bui-switch-input[aria-label="单集循环"]',
        ]);
        if (checkbo) {
          return checkbo;
        }
      },
      { isSetup: true },
    );

    return playerloop_checkbox;
  }

  // 如果视频洗脑循环，打开后关闭倒叙播放
  async function bindWatch() {
    const playerloop_checkbox = await getisReverseorder();
    if (playerloop_checkbox) {
      $(playerloop_checkbox).on('change', () => {
        if (playerloop_checkbox.checked) {
          local.startreverseorder = false;
          $('#startreverseorder').removeClass('on');
          $(Video).off('ended', VideoOnEnded);
        }
      });
    }
  }

  // 添加功能按钮div
  async function createControlPanel() {
    let zaizaiDiv = $('#zaizai-div');
    if (zaizaiDiv.length > 0) {
      return;
    }
    const div = $('<div>', { id: 'zaizai-div' });
    // 判断是否开启了 循环播放
    let isstartreverseorder = await getisReverseorder();
    let isplayerloop = isstartreverseorder?.checked;

    if (isplayerloop) {
      local.defaultreverseorder = false;
      local.startreverseorder = false;
    }
    // 如果默认开启倒序播放，开启倒序播放
    if (local.defaultreverseorder) {
      local.startreverseorder = true;
    } else {
      local.startreverseorder = false;
    }

    div.html(`
                <div class="video-sections-head">
        <div class="border-bottom-line"></div>
        <div class="video-sections-head_second-line">
            <div>
                <span class="txt">默认开启倒序播放</span>
                <span id="defaultreverseorder" class="switch-button ${local.defaultreverseorder ? 'on' : ''}"></span>
            </div>
            <div>
                <span class="txt">倒序播放</span>
                <span id="startreverseorder" class="switch-button ${local.defaultreverseorder ? 'on' : ''}"></span>
            </div>
            <div>
                <span class="txt">增高合集列表</span>
                <span id="addsectionslistheigth" class="switch-button ${
                  local.addsectionslistheigth ? 'on' : ''
                }"></span>
            </div>
        </div>
    </div>
            `);

    $(videoSections).append(div);

    // 默认开启倒序播放
    let defaultreverseorder = $('#defaultreverseorder');
    // 倒序播放
    let startreverseorder = $('#startreverseorder');
    // 增高合集列表
    let addsectionslistheigth = $('#addsectionslistheigth');

    function defaultSwitchClick() {
      local.defaultreverseorder = !local.defaultreverseorder;
      switchReverseoOnClick().then(() => {
        if (local.defaultreverseorder) {
          startreverseorder.addClass('on');
          $(this).addClass('on');
          Qmsg && Qmsg.success('默认开启倒序播放');
        } else {
          startreverseorder.removeClass('on');
          $(this).removeClass('on');
          Qmsg && Qmsg.warning('默认关闭倒序播放');
        }
      });
    }
    defaultreverseorder.on('click', defaultSwitchClick);

    async function switchReverseoOnClick() {
      const playerloop_checkbox = await getisReverseorder();
      if (playerloop_checkbox.checked) {
        Qmsg && Qmsg.warning('请关闭"洗脑循环"后再开启倒序播放');
        return Promise.reject('请关闭"洗脑循环"后再开启倒序播放');
      }
      local.startreverseorder = !local.startreverseorder;
      if (local.startreverseorder) {
        console.log('开启倒序播放');
        Qmsg && Qmsg.success('开启倒序播放');
        startreverseorder.addClass('on');
        $(Video).prop('zaizai-ended-fun', true);
        $(Video).on('ended', VideoOnEnded);
        timeoutId = setInterval(() => {
          if (!$(Video).prop('zaizai-ended-fun')) {
            clearInterval(timeoutId);
            switchReverseoOnClick();
          }
        }, 1000 * 10);
      } else {
        console.log('关闭倒序播放');
        Qmsg && Qmsg.warning('关闭倒序播放');
        startreverseorder.removeClass('on');
        $(Video).off('ended', VideoOnEnded);
        $(Video).prop('zaizai-ended-fun', false);
        timeoutId && clearInterval(timeoutId);
      }
    }
    startreverseorder.on('click', switchReverseoOnClick);

    const button = $('<div>', {
      text: '滚动到当前播放',
      class: 'scroll-to-the-current-playback',
    });

    async function scrollToCurrent() {
      let { currentEl } = await getCurrentcard();
      // $('.video-sections-content-list');
      const sectionsListEl = selectShowEl(['.video-pod__body']);
      // 42 = currentEl.clientHeight + margin     4 = 列表第一个有4px的margin-top   12是自定义
      let scrollToPosition = currentEl.offsetTop - (sectionsListEl.offsetHeight / 2 - currentEl.offsetHeight / 2);
      $(sectionsListEl).scrollTop(scrollToPosition);
    }
    button.on('click', scrollToCurrent);

    const newdiv = $('<div>', { css: { width: '100%' } });
    newdiv.append(button);
    div.find('.video-sections-head_second-line').append(newdiv);

    addsectionslistheigth.on('click', switchAddsectionslistheigthOnClick);
  }

  async function getCurrentcard() {
    const episodecards = await waitTask(
      () => {
        // 2024 的B站列表
        let els = $('.video-episode-card');
        if (els.length) {
          return els.toArray();
        }
        //  2025-1-27 的B站列表
        let body = $('.video-pod__body');
        if (body.length) {
          return body.find('.video-pod__item').toArray();
        }
      },
      {
        isSetup: true,
      },
    );

    let i = 0;
    for (const element of episodecards) {
      let curicon = $(element).find('.playing-gif').first();
      if (curicon.css('display') !== 'none') {
        break;
      }
      i++;
    }
    // 顺序上一个
    let previous = i - 1 === 0 ? episodecards.length - 1 : i - 1;
    // 顺序下一个
    let next = i + 1 > episodecards.length - 1 ? episodecards.length - 1 : i + 1;
    const result = {
      elements: episodecards,
      current: i,
      currentEl: episodecards[i],
      next,
      nextEl: episodecards[next],
      previous,
      previousEl: episodecards[previous],
    };
    console.log(result);

    return result;
  }

  async function VideoOnEnded() {
    const result = await getCurrentcard();
    $(result.previousEl).find('.simple-base-item').click();
  }

  function keyup_key_g() {
    $(`.bpx-player-ctrl-btn[aria-label="网页全屏"]`).click();
  }
  keyupCodeFn['g'] = keyup_key_g;

  function keyup_key_h() {
    $(`.bpx-player-ctrl-btn[aria-label="画中画"]`).click();
  }
  keyupCodeFn['h'] = keyup_key_h;

  async function main(i = 0) {
    console.log('mian start' + i);
    // 等待合集加载完成
    await waitTask(() => {
      videoSections = selectShowEl(['.base-video-sections-v1', '.video-pod.video-pod']);
      if (videoSections) {
        return true;
      }
    });

    if (!videoSections) {
      console.log('mian stop 没有合集');
      return;
    }

    // 等待video元素加载完成
    await waitTask(() => {
      let video = $('video')[0];
      if (video) {
        Video = video;
        return true;
      }
    });

    if (!Video) {
      console.log('mian stop 没有video元素');
      return;
    }

    if (local.defaultreverseorder) {
      Video.addEventListener('ended', VideoOnEnded);
    }

    await createControlPanel();
    await switchAddsectionslistheigthOnClick(local.addsectionslistheigth);
    await bindWatch();

    $(window).on('keyup', (e) => {
      if (isFocusedFormElement()) {
        return;
      }
      keyupCodeFn[e.key] && keyupCodeFn[e.key]();
    });

    console.log('mian stop 成功开启');

    console.log('main stop 检查开启');
    setTimeout(() => {
      if (!$('#zaizai-div').length && i < 10) {
        i++;
        return main(i + 1);
      } else {
        console.log('mian stop 检查完成 已有');
      }
    }, 500);
  }

  $(document).ready(async () => {
    console.log('正式-v3');
    main().catch((err) => {
      console.log(err);
    });
  });
})();
