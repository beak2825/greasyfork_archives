// ==UserScript==
// @name        虎牙免登录观看
// @description 优化未登录时的观看体验，若需要登录请勿使用！！
// @author      (σ｀д′)σ
// @version     1.8.1
// @namespace   https://greasyfork.org/zh-CN/scripts/477947
// @license     GPL-3.0-or-later
// @match       https://www.huya.com/*
// @exclude     https://www.huya.com/
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addStyle
// @supportURL  https://greasyfork.org/zh-CN/scripts/477947
// @homepageURL https://greasyfork.org/zh-CN/scripts/477947
// @downloadURL https://update.greasyfork.org/scripts/477947/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E5%BD%95%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477947/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E5%BD%95%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

/*
 * 在vm中，未使用@grant或者@grant none，则sandbox不生效，此时window与unsafeWindow均指向页面window
 * 若指定了@grant，则sandbox生效，此时window是页面window的代理，可访问自带属性但无法获取三方属性，unsafeWindow指向页面window
 * 在vm中，@inject-into默认值为 auto，优先尝试注入到 page，再尝试 content
 * 若@inject-into content，则依旧可访问页面DOM，但unsafeWindow指向content script的全局对象，故找不到页面window上的三方属性，如 HUYA_*
 */

/*
 * 在tampermonkey中，若未设置@sandbox，则sandbox默认值为 raw，表示脚本优先注入到页面环境中
 * 当设置@sandbox DOM时，则只能访问页面DOM
 * 或许需要设置@grant unsafeWindow以访问unsafeWindow。若设置@grant none，则sandbox不生效
 */

// 目前脚本在vm和tm中均测试通过，且unsafeWindow都指向页面window，而window都是包装过的Proxy，无法获取页面window的三方属性如window.jQuery、window.HUYA_*等
// 此时要么使用unsafeWindow.jQuery，要么直接访问全局属性（如脚本中直接使用 $ ）
window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 禁止篡改console
  // Object.freeze(console);
  if (GM_getValue('autoBestRESDelay') !== undefined) GM_deleteValue('autoBestRESDelay'); // 在vm上与GM_setValue(key)作用相同
  const getById = (id) => document.getElementById(id);
  if (!getById('liveRoomObj')) return;

  // 更改菜单选项
  function changeMenuItem(id, onCaption, offCaption, onClick) {
    const inplace = id === GM_registerMenuCommand(offCaption, null, { id });
    if (inplace) {
      // 插件如VM2.15.9起支持根据id注册选项
      GM_registerMenuCommand(onCaption, onClick, { id });
    } else {
      // 不支持需先卸载原选项，再注册新选项
      GM_unregisterMenuCommand(offCaption);
      GM_registerMenuCommand(onCaption, onClick);
    }
  }
  // 注册可变菜单项
  function registerToggle(id, onCaption, offCaption, onClick) {
    changeMenuItem(id, onCaption, offCaption, () => {
      onClick();
      registerToggle(id, offCaption, onCaption, onClick);
    });
  }
  // 注册常规菜单项
  /* function addMenuItem(item) {
    if (item.id !== GM_registerMenuCommand(item.title, () => item.click(), { id: item.id })) {
      GM_unregisterMenuCommand(item.title);
      GM_registerMenuCommand(item.title, () => item.click());
    }
  } */
  /* function addModal(title, body, persist) {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `<div><p>${title}</p>${body}<div style='text-align:right'><button>确定</button> <button>取消</button></div></div>`;
    const btns = dialog.querySelectorAll('button');
    dialog.children[0].onclick = (e) => e.stopPropagation();
    dialog.onclick = btns[1].onclick = () => {
      dialog.oncancel?.();
      dialog.close();
    };
    btns[0].onclick = () => {
      dialog.onconfirm?.();
      dialog.close();
    };
    Object.defineProperty(dialog, 'title', {
      get() {
        return this.children[0].children[0].textContent;
      },
      set(text) {
        this.children[0].children[0].innerText = text;
      }
    });
    if (!persist) {
      dialog.onclose = () => dialog.remove();
    }
    document.body.append(dialog);
    return dialog;
  } */

  /* const Modal = addModal('', '<input type=number min=0 step=.5 />', true);
  Modal.onclose = () => {
    Modal.querySelector('input').value = '';
  }; */

  // 待注册
  const toggles = [
    {
      id: 1,
      title: '自动最高画质',
      gmKey: 'autoBestRES',
      gmValue: GM_getValue('autoBestRES')
    },
    {
      id: 2,
      title: '单击/空格控制播放/暂停',
      gmKey: 'clickToPlay',
      gmValue: GM_getValue('clickToPlay', true)
    },
    {
      id: 3,
      title: '中键/回车切换全屏(火狐限制左键触发全屏',
      gmKey: 'midClickToFullscreen',
      gmValue: GM_getValue('midClickToFullscreen', true)
    },
    {
      id: 4,
      title: '自动剧场模式',
      gmKey: 'autoFullPage',
      gmValue: GM_getValue('autoFullPage')
    },
    {
      id: 5,
      title: '屏蔽视频下方礼物栏',
      gmKey: 'hideGiftBar',
      gmValue: GM_getValue('hideGiftBar'),
      click() {
        if (this.gmValue) {
          this.css = GM_addStyle(
            '#player-ctrl-wrap:not(.showup){opacity:0}#player-gift-wrap{visibility:hidden;}#player-wrap{min-height:100%}#player-ctrl-wrap{bottom:0!important}'
          );
          getById('player-ctrl-wrap').classList.add('showup');
          return;
        }
        getById('player-ctrl-wrap').classList.remove('showup');
        this.css?.remove();
      }
    }
  ];
  toggles.forEach((e) => {
    registerToggle(
      e.id,
      (e.gmValue ? '✔️' : '✖️') + e.title,
      (!e.gmValue ? '✔️' : '✖️') + e.title,
      () => {
        e.gmValue = !e.gmValue;
        e.click?.(e.gmValue);
        GM_setValue(e.gmKey, e.gmValue);
      }
    );
  });
  /*   const menu = [
    // {
    //   id: 6,
    //   title: '自动切换画质延迟',
    //   gmKey: 'autoBestRESDelay',
    //   gmValue: GM_getValue('autoBestRESDelay', 0),
    //   click() {
    //     Modal.title = '调整自动切换画质的延迟，单位：秒(s)，留空无延迟\n当前延迟：' + this.gmValue;
    //     Modal.showModal();
    //     Modal.onconfirm = () => {
    //       const delay = +Modal.querySelector('input').value;
    //       this.gmValue = isNaN(delay) ? 0 : delay;
    //       GM_setValue(this.gmKey, this.gmValue);
    //     };
    //   }
    // }
  ];
  menu.forEach((e) => {
    addMenuItem(e);
  }); */
  if (toggles[3].gmValue) {
    document.body.classList.add('mode-page-theater');
  }
  // 隐藏进入页面后的登录弹窗。 ← 貌似不需要了，虎牙不会立马显示登录框了
  new MutationObserver((mutations, ob) => {
    // const mask = getById('HUYA-UDBSdkLgn');
    // if (!mask) return;
    const video = getById('hy-video');
    if (!video) return;

    if (toggles[4].gmValue) {
      toggles[4].click();
    }
    const $vtList = $('#player-ctrl-wrap .player-videotype-list'),
      unlockRES = () => {
        const $highRes = $vtList.children(':has(.bitrate-right-btn.common-enjoy-btn)');
        $highRes.length
          ? $highRes.each((i, e) => {
              $(e).data('data').status = 0;
              // autoBestRES
              i === 0 && toggles[0].gmValue && e.click(); // setTimeout(() => e.click(), menu[0].gmValue * 1000);
            })
          : toggles[0].gmValue && $vtList.children().length > 1 && $vtList.children()[0].click();
      };

    // 插入登录框后则只监听该元素的变更。
    /* new MutationObserver((records, mob) => {
      if (mask?.style.display !== 'none') {
        mask.style.display = 'none';
        mob.disconnect();
      }
    }).observe(mask, {
      attributes: true
    }); */

    // 无限制播放，避免严格模式下对getter属性赋值导致异常中断
    // try {
    if (toggles[3].gmValue) {
      const pfBtn = getById('player-fullpage-btn');
      const tid = setInterval(() => {
        pfBtn.classList.contains('player-narrowpage') ? clearInterval(tid) : pfBtn.click();
      }, 500);
      // getById('player-fullpage-btn').className="player-narrowpage"
      // getById('player-fullpage-btn').title="退出剧场"
    }
    // getById('hy-video').srcObject.active = false;
    // } catch (e) {
    //   // alert('尝试无限制播放失败，可能需要刷新页面或切换线路。异常：\n' + e)
    // }
    ob.disconnect();

    // unlock res
    new MutationObserver(unlockRES).observe($vtList[0], {
      attributes: false,
      childList: true,
      subtree: false
    });
    unlockRES();

    // 添加部分播放器事件
    setTimeout(() => {
      const vid = mutations[0].target; // 此处观察的节点即getById('hy-video')
      let flag = null,
        tid = null;

      getById('player-mouse-event-wrap').onmousemove = function () {
        if (flag) return;
        flag = true;
        clearTimeout(tid);
        this.style.cursor = '';
        if (toggles[4].gmValue) {
          getById('player-ctrl-wrap').classList.add('showup');
        }
        tid = setTimeout(() => {
          this.style.cursor = 'none';
          if (toggles[4].gmValue) {
            getById('player-ctrl-wrap').classList.remove('showup');
          }
        }, 5000);
        setTimeout(() => {
          flag = null;
        }, 1000);
      };

      // 单击/空格控制播放/暂停
      if (toggles[1].gmValue) {
        let isOneClick, tmp, tid;
        // 判断是否触发虎牙播放器单击模拟的双击
        vid.addEventListener('click', () => {
          isOneClick = !tmp;
          if (isOneClick) {
            tmp = setTimeout(() => {
              tmp = null;
            }, 301);
          }
        });
        vid.onclick = () => {
          clearTimeout(tid);
          const arr = ['smartMenu_videoMenu', 'player-danmu-report'];
          if (arr.every((e) => !(getById(e)?.style.display === 'block'))) {
            tid = setTimeout(() => {
              isOneClick && getById('player-btn').click();
            }, 300);
          }
        };
        document.addEventListener('keyup', (e) => {
          if (e.code === 'Space' && !'INPUT TEXTAREA'.includes(e.target.nodeName)) {
            e.preventDefault();
            getById('player-btn').click();
          }
        });
      }
      // 中键/回车切换全屏
      if (toggles[2].gmValue) {
        vid.onmousedown = (e) => e.preventDefault();
        vid.onauxclick = (e) => {
          e.button === 1 && getById('player-fullscreen-btn').click();
        };
        document.addEventListener('keyup', (e) => {
          e.key === 'Enter' &&
            !'INPUT TEXTAREA'.includes(e.target.nodeName) &&
            getById('player-fullscreen-btn').click();
        });
      }
    });
  }).observe(getById('player-video'), {
    attributes: false,
    childList: true,
    subtree: false
  });

  // 观察节点自动点击播放模式
  // function autoPlay() {
  //   GM_addStyle("div#UDBSdkLgn{z-index: -1;}");
  //   const targetNode =
  //     getById("player-ctrl-wrap").querySelector(".player-play-big");

  //   new MutationObserver((mutationsList, ob) => {
  //     // console.log(mutationsList)
  //     if (
  //       mutationsList[0].type !== "attributes" ||
  //       targetNode.style.display === "none"
  //     )
  //       return;
  //     const mask = getById("UDBSdkLgn");
  //     if (mask.style.display === "block") {
  //       targetNode.click();
  //       mask.style.display = "none";
  //       // console.log('自动续播成功')
  //     }
  //   }).observe(targetNode, {
  //     attributes: true,
  //     childList: false,
  //     subtree: false,
  //   });
  // }
});
