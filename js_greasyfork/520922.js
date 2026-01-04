// ==UserScript==
// @name            B站小窗口视频功能显示
// @description     增强B站功能，B站小窗口视频的操作栏显示
// @version         0.1.2
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
// @downloadURL https://update.greasyfork.org/scripts/520922/B%E7%AB%99%E5%B0%8F%E7%AA%97%E5%8F%A3%E8%A7%86%E9%A2%91%E5%8A%9F%E8%83%BD%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520922/B%E7%AB%99%E5%B0%8F%E7%AA%97%E5%8F%A3%E8%A7%86%E9%A2%91%E5%8A%9F%E8%83%BD%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(() => {
  GM_addStyle(`
    #commenBoxBody{
      position: fixed;
      z-index: 100;
      bottom: 5px;
      left: 0;
      width:300px;
      height: 32px;
      background: transparent;
      padding: 0;
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

  const state = {
    is: false,
    video: null,
  };

  const videoOperation = [
    {
      // 遮罩层
      className: '.bpx-player-control-mask',
      style: ['opacity', 'display'],
    },
    {
      // 操作栏
      className: '.bpx-player-control-entity',
      style: ['display', 'opacity'],
    },
    {
      // 底部操作栏
      className: '.bpx-player-control-bottom',
      style: ['opacity', 'display'],
    },
    {
      // 上一剧集
      className: '.bpx-player-ctrl-prev',
      style: ['display'],
    },
    {
      // 播放/暂停
      className: '.bpx-player-ctrl-play',
      style: ['display'],
    },
    {
      className: '.bpx-player-ctrl-btn',
      style: ['display'],
    },
    {
      // 播放时间
      className: '.bpx-player-ctrl-time',
      style: ['display'],
    },
    {
      // 分辨率
      className: '.bpx-player-ctrl-quality',
      style: ['display'],
    },
    {
      // 播放速率
      className: '.bpx-player-ctrl-playbackrate',
      style: ['display'],
    },
    {
      // 音量
      className: '.bpx-player-ctrl-volume',
      style: ['display'],
    },
    {
      // 设置
      className: '.bpx-player-ctrl-setting',
      style: ['display'],
    },
    {
      // 画中画
      className: '.bpx-player-ctrl-pip',
      style: ['display'],
    },
    {
      // 宽屏
      className: '.bpx-player-ctrl-wide',
      style: ['display'],
    },
    {
      // 网页
      className: '.bpx-player-ctrl-web',
      style: ['display'],
    },
    {
      // 全屏
      className: '.bpx-player-ctrl-full',
      style: ['display'],
    },
  ];

  function showVideoOperation(classNames) {
    if (typeof classNames === 'string') {
      if (classNames === 'all') {
        classNames = videoOperation.map((item) => item.className);
      } else {
        classNames = [classNames];
      }
    }
    videoOperation.forEach((item) => {
      if (classNames.includes(item.className)) {
        let dom = document.querySelector(item.className);
        for (const style of item.style) {
          if (style === 'display') {
            dom.style[style] = 'block';
          }
          if (style === 'opacity') {
            dom.style[style] = 1;
          }
        }
        if ('callback' in item) {
          item.callback(dom);
        }
      }
    });
  }

  function hideVideoOperation(classNames) {
    if (typeof classNames === 'string') {
      if (classNames === 'all') {
        classNames = videoOperation.map((item) => item.className);
      } else {
        classNames = [classNames];
      }
    }
    videoOperation.forEach((item) => {
      if (classNames.includes(item.className)) {
        let dom = document.querySelector(item.className);
        for (const style of item.style) {
          if (style === 'display') {
            dom.style[style] = 'none';
          }
          if (style === 'opacity') {
            dom.style[style] = 0;
          }
        }
        if ('callback' in item) {
          item.callback(dom);
        }
      }
    });
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

  const onMouseover = async (e) => {
    let els = await waitTask(
      () => {
        const bpxplayercontrolmask = document.querySelector('.bpx-player-control-mask');

        const bpxplayercontrolentity = document.querySelector('.bpx-player-control-entity');
        const bpxplayercontrolbottom = document.querySelector('.bpx-player-control-bottom');
        if (bpxplayercontrolmask && bpxplayercontrolentity && bpxplayercontrolbottom) {
          return [bpxplayercontrolmask, bpxplayercontrolentity, bpxplayercontrolbottom];
        }
      },
      {
        isSetup: true,
      },
    );

    els[0].style.opacity = 1;
    els[0].style.display = 'block';
    els[1].style.opacity = 1;
    els[1].style.display = 'block';
    els[2].style.opacity = 1;
    els[2].style.display = 'flex';
    console.log('onMouseover 显示');
    console.log(els);
  };

  const onMouseout = async (e) => {
    let els = await waitTask(
      () => {
        const bpxplayercontrolmask = document.querySelector('.bpx-player-control-mask');

        const bpxplayercontrolentity = document.querySelector('.bpx-player-control-entity');
        const bpxplayercontrolbottom = document.querySelector('.bpx-player-control-bottom');
        if (bpxplayercontrolmask && bpxplayercontrolentity && bpxplayercontrolbottom) {
          return [bpxplayercontrolmask, bpxplayercontrolentity, bpxplayercontrolbottom];
        }
      },
      {
        isSetup: true,
      },
    );

    els[0].style.opacity = 0;
    els[0].style.display = 'none';
    els[1].style.opacity = 0;
    els[1].style.display = 'none';
    els[2].style.opacity = 0;
    els[2].style.display = 'none';
    console.log('onMouseout 隐藏');
    console.log(els);
  };

  // 添加评论框按钮
  const addCommentBoxButton = () => {
    let box = document.querySelector('#zaizai_commentBox');
    let boxBody = document.querySelector('#commenBoxBody');
    if (box !== null || boxBody !== null) {
      console.log('已经添加了评论框按钮');
      return;
    }
    let button = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate');
    let commentBox = document.querySelector('.bpx-player-video-inputbar');
    if (!button || !commentBox) return;

    button = button.cloneNode(true);
    button.children[0].textContent = '框';
    button.id = 'zaizai_commentBox';
    commentBox = commentBox.cloneNode(true);
    commentBox.querySelector('.bpx-player-video-btn-dm').remove();
    commentBox.querySelector('.bpx-player-video-preview-emoji-wrap').remove();
    commentBox.querySelector('.bpx-player-dm-hint').remove();

    // 隐藏按钮
    const hiheEl = document.createElement('div');
    hiheEl.classList.add('bpx-player-video-btn-dm');
    hiheEl.style.color = '#000';
    hiheEl.style.lineHeight = '25px';
    hiheEl.textContent = '隐藏';
    commentBox.prepend(hiheEl);

    // 容器
    const commenBoxBody = document.createElement('div');
    commenBoxBody.id = 'commenBoxBody';
    commenBoxBody.classList.add('bpx-player-sending-bar');
    commenBoxBody.style.display = 'none';
    commenBoxBody.style.padding = '0';
    commenBoxBody.appendChild(commentBox);

    const sendBut = commentBox.querySelector('.bpx-player-dm-btn-send');
    const inputEl = commentBox.querySelector('.bpx-player-dm-input');

    button.addEventListener('click', () => {
      let display = commenBoxBody.style.display;
      commenBoxBody.removeAttribute('tsbrowser_force_hidden');
      if (display === 'none') {
        commenBoxBody.style.display = 'block';
        commenBoxBody.style.zIndex = 9999;
        commenBoxBody.style.left = (document.body.getBoundingClientRect().width - 300) / 2 + 'px';
      } else {
        commenBoxBody.style.display = 'none';
      }
    });
    hiheEl.addEventListener('click', () => {
      commenBoxBody.style.display = 'none';
    });
    sendBut.addEventListener('click', () => {
      const value = inputEl.value;
      const playerInput = document.querySelector('#bilibili-player .bpx-player-dm-input');
      playerInput.focus();
      document.execCommand('insertText', false, value);
      document.querySelector('#bilibili-player .bpx-player-dm-btn-send').click();
      inputEl.value = '';
      sendBut.classList.add('bui-disabled');
      sendBut.children[0].textContent = '0';
      let timeout = null;
      let count = 1;
      timeout = setInterval(() => {
        count++;
        if (count >= 6) {
          sendBut.classList.remove('bui-disabled');
          sendBut.children[0].textContent = '发送';
          clearTimeout(timeout);
        } else {
          sendBut.children[0].textContent = count;
        }
      }, 1000);
    });
    document.body.appendChild(commenBoxBody);
    document.querySelector('.bpx-player-control-bottom-right').prepend(button);
  };

  const mouseenter = () => {
    const { innerWidth, innerHeight } = window;
    if (innerWidth <= 600 || innerHeight <= 320) {
      addCommentBoxButton();
      onMouseover();
    }
  };

  const mouseleave = (e) => {
    // 确保鼠标真的离开了浏览器
    if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') {
      const { innerWidth, innerHeight } = window;
      if (innerWidth <= 600 || innerHeight <= 320) {
        onMouseout();
      }
    }
  };

  window.onload = async () => {
    console.log('B站小窗口视频功能显示');

    let video = await waitTask(() => {
      const video = document.querySelector('video');
      if (video) {
        return video;
      }
    });
    state.video = video;

    document.addEventListener('mouseenter', mouseenter);
    document.addEventListener('mouseleave', mouseleave);

    // setTimeout(() => {
    //   let video1 = document.querySelector('video');
    //   video1.addEventListener('play', () => {
    //     video1.pause();
    //   });
    // }, 2000);

    window.addEventListener('resize', () => {
      const { innerWidth, innerHeight } = window;

      //这个是最大的窗口，到达这个大小就恢复正常
      if (innerWidth >= 600 || innerHeight >= 320) {
        videoOperation.forEach((item) => {
          let dom = document.querySelector(item.className);
          dom.style.cssText = '';
        });
      }

      // 隐藏 小窗口视频操作按钮
      if (innerWidth <= 600) {
        hideVideoOperation([
          '.bpx-player-ctrl-full',
          '.bpx-player-ctrl-web',
          '.bpx-player-ctrl-wide',
          '.bpx-player-ctrl-pip',
        ]);

        // 隐藏 播放/暂停 按钮 因为单机可以播放/暂停
        if (innerWidth <= 500) {
          hideVideoOperation('.bpx-player-ctrl-play');
        }
        if (innerWidth >= 500 && innerWidth <= 600) {
          showVideoOperation('.bpx-player-ctrl-prev');
        }
        // 先隐藏 音量按钮 因为可以用系统音量控制
        if (innerWidth <= 383) {
          hideVideoOperation('.bpx-player-ctrl-volume');
        }
        if (innerWidth >= 383 && innerWidth <= 600) {
          showVideoOperation('.bpx-player-ctrl-volume');
        }
        // 在隐藏 设置按钮 因为其他的优先级更高
        if (innerWidth <= 354) {
          hideVideoOperation('.bpx-player-ctrl-setting');
        }
        if (innerWidth >= 354 && innerWidth <= 600) {
          showVideoOperation('.bpx-player-ctrl-setting');
        }
        // 最后隐藏 播放速度 按钮 因为其他的优先级更高
        if (innerWidth <= 308) {
          hideVideoOperation('.bpx-player-ctrl-playbackrate');
        }
        if (innerWidth >= 308 && innerWidth >= 600) {
          showVideoOperation('.bpx-player-ctrl-playbackrate');
        }
      }
    });
  };
})();
