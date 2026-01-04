// ==UserScript==
// @name         juejin掘金小帮手
// @name:zh-CN   掘金小帮手：掘金纯净复制、掘金纯净小册阅读、添加掘金快捷键（cmd+e/esc/p]进入编辑模式/返回上一页/发布文章）、hover自动拉出头像菜单
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  掘金小帮手：掘金纯净复制、掘金纯净小册阅读、添加掘金快捷键（cmd+e/esc/p]进入编辑模式/返回上一页/发布文章）、hover自动拉出头像菜单
// @author       zzailianlian
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @match        *://juejin.cn/*
// @match        *://juejin.im/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meitun-test.com
// @license      MIT
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/457712/juejin%E6%8E%98%E9%87%91%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457712/juejin%E6%8E%98%E9%87%91%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 沉浸式小册阅读
  const openJuejinPamphlethelper = () => {
    if (/juejin\.[cnim]{2}.+\/section/.test(window.location.href)) {
      // 沉浸式处理
      function immersion(type = 'active') {
        // 处理沉浸式时要处理的dom列表
        const displayDoms = [
          {
            observer: () => document.querySelector('.book-summary'),
            action: () => {
              document.querySelector('.book-summary').style.display = 'none';
            },
            unset: () => {
              document.querySelector('.book-summary').style = '';
            },
          },
          {
            observer: () => document.querySelector('.book-content__header'),
            action: () => {
              document.querySelector('.book-content__header').style.display = 'none';
            },
            unset: () => {
              document.querySelector('.book-content__header').style = '';
            },
          },
          {
            observer: () => document.querySelector('.book-comments'),
            action: () => {
              document.querySelector('.book-comments').style.display = 'none';
            },
            unset: () => {
              document.querySelector('.book-comments').style = '';
            },
          },
          {
            observer: () => document.querySelector('.book-body'),
            action: () => {
              document.querySelector('.book-body').style.paddingTop = '0';
            },
            unset: () => {
              document.querySelector('.book-body').style = '';
            },
          },
          {
            observer: () => document.querySelector('.book-content'),
            action: () => {
              document.querySelector('.book-content').style.marginLeft = '0';
            },
            unset: () => {
              document.querySelector('.book-content').style = '';
            },
          },
          {
            observer: () => document.querySelector('.book-section-view'),
            action: () => {
              document.querySelector('.book-section-view').style.maxWidth = 'unset';
            },
            unset: () => {
              document.querySelector('.book-section-view').style = '';
            },
          },
          {
            observer: () => document.querySelector('.book-handle'),
            action: () => {
              document.querySelector('.book-handle').style.maxWidth = 'unset';
              document.querySelector('.book-handle').style.marginLeft = '0';
            },
            unset: () => {
              document.querySelector('.book-handle').style = '';
            },
          },
        ];
        displayDoms.map(dom => {
          loopDom(dom, type);
        });
      }
      const openImmersion = () => immersion('active');
      const closeImmersion = () => immersion('disabled');

      // 沉浸式控制按钮
      loopDom({
        observer: () => document.querySelector('.book-handle'),
        action: () => {
          // 干掉document的title，让阅读不被others打扰
          document.title = 'LinStaMIDIAccess';

          document.querySelector('.book-handle').style.maxWidth = 'unset';
          document.querySelector('.book-handle').style.marginLeft = '0';

          const bookHandle = document.querySelector('.book-handle');
          let isTrigger = false;
          const immersionBtn = document.createElement('div');
          immersionBtn.innerHTML = '恢复';
          immersionBtn.style = `background-color:#007fff;border-radius:50%;width:50px;height:50px;display:flex;justify-content:center;align-items:center;z-index:10;cursor:pointer;color:white;position:absolute;left:10px;font-size:14px;bottom:70px;`;
          immersionBtn.onclick = function () {
            console.log('isTrigger', isTrigger);
            if (isTrigger) {
              // 沉浸阅读界面
              openImmersion();
              immersionBtn.innerHTML = '恢复';
            } else {
              // 默认展示界面
              closeImmersion('disabled');
              immersionBtn.innerHTML = '沉浸';
            }
            isTrigger = !isTrigger;
          };
          immersionBtn.classList.add('step-btn', 'step-btn--prev');
          bookHandle.insertBefore(immersionBtn, bookHandle.firstChild);
        },
      });

      // 沉浸式展示页面
      openImmersion();
    }
  };

  //

  window.onload = () => {
    console.log('我是onload');
    // 复制去除后缀
    [...document.querySelectorAll('*')].forEach(
      item =>
        (item.oncopy = function (e) {
          e.stopPropagation();
        })
    );
    // 开启沉浸式小册阅读
    openJuejinPamphlethelper();
    // 允许鼠标移动到头像后自动弹出来菜单
    avatarHoverHandle();
    // 注册掘金快捷键
    dispatchKeyCode();
  };

  function dispatchKeyCode() {
    // 键入 cmd+e 进入文章编辑页面
    if (/juejin.cn\/post/.test(window.location.href)) {
      document.onkeydown = function (event) {
        var e = event || window.event;
        const isMetaKey = e.metaKey;
        // 69是esc
        if (isMetaKey && e.keyCode === 69) {
          document.querySelector('.edit-btn').click();
        }
      };
    }
    if (/juejin.cn\/editor\/drafts/.test(window.location.href)) {
      document.onkeydown = function (event) {
        const isFocusEditor = document.activeElement.tagName === 'TEXTAREA';
        var e = event || window.event;

        const isMetaKey = e.metaKey;
        // 键入 cmd+esc 返回上一页 27是esc
        if (isMetaKey && e.keyCode === 27) {
          history.back();
        }
        // 键入 cmd+p 开始发布 80是p
        if (isMetaKey && e.keyCode === 80) {
          e.preventDefault();
          document.querySelector('.publish-popup .xitu-btn').click();
        }
      };
    }
  }

  // 重写pushState与repalceState方法来监听url变化
  var _wr = function (type) {
    var orig = history[type];
    return function () {
      var rv = orig.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };

  window.addEventListener('replaceState', function (e) {
    console.log('监听自定义replaceState', e);
    // 开启沉浸式小册阅读
    openJuejinPamphlethelper();
    // 允许鼠标移动到头像后自动弹出来菜单
    avatarHoverHandle();
  });
  window.addEventListener('pushState', function (e) {
    console.log('监听自定义pushState', e);
    // 开启沉浸式小册阅读
    openJuejinPamphlethelper();
    // 允许鼠标移动到头像后自动弹出来菜单
    avatarHoverHandle();
  });

  history.pushState = _wr('pushState');
  history.replaceState = _wr('replaceState');

  // 头像hover事件
  function avatarHoverHandle() {
    loopDom({
      observer: () => document.querySelector('.avatar') && document.querySelector('.nav-item.menu'),
      action: () => {
        const avatarImg = document.querySelector('.avatar');
        const avatarMenuItem = document.querySelector('.nav-item.menu');
        const getIsAvatarMenuShow = () => document.querySelector('.avatar-wrapper').nextElementSibling;
        function mouseenterHandle() {
          if (!getIsAvatarMenuShow()) {
            avatarImg.click();
          }
        }
        function mouseleaveHandle() {
          if (getIsAvatarMenuShow()) {
            avatarImg.click();
          }
        }
        avatarMenuItem && avatarMenuItem.addEventListener('mouseenter', mouseenterHandle);
        avatarMenuItem && avatarMenuItem.addEventListener('mouseleave', mouseleaveHandle);
      },
    });
  }

  function loopDom({ observer, action = () => {}, unset = () => {} }, type = 'active') {
    const hadnler = () => {
      if (type === 'active') {
        action();
      } else {
        unset();
      }
    };
    if (observer()) {
      hadnler();
    }
    const interval = setInterval(() => {
      if (observer()) {
        hadnler();
        clearInterval(interval);
      }
    }, 200);
  }
})();
