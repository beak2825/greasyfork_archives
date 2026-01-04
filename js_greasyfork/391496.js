// ==UserScript==
// @name         AnnaniZhu's script
// @namespace    https://github.com/AnaniZhu/tampermonkey-scripts
// @version      0.3.0
// @description  优化部分网页的交互体验
// @author       AnnaniZhu
// @license      MIT
// @create       2019-10-23
// @home-url     https://github.com/AnaniZhu/tampermonkey-scripts
// @run-at       document-idle
// @include      *://nodejs.cn/api/*
// @include      *://juejin.im/post/*
// @include      *dalipan.com/detail/*
// @include      *webpack.wuhaolin.cn/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391496/AnnaniZhu%27s%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/391496/AnnaniZhu%27s%20script.meta.js
// ==/UserScript==

(function () {
  'use strict'
  /* eslint-disable-next-line */
  const { href: URL, host: HOST } = window.location

  const DOMAIN_SCRIPT_MAP = {
    'nodejs.cn': createNodeSideMenu,
    'juejin.im': fixedJueJinCategory,
    'dalipan.com': unLockDaLiPan,
    'webpack.wuhaolin.cn': hideWebpackModal
  }

  // 注入通用样式
  addCommonStyle()

  Object.keys(DOMAIN_SCRIPT_MAP).forEach(key => {
    if (new RegExp(key).test(HOST)) {
      DOMAIN_SCRIPT_MAP[key]()
    }
  })

  // node
  function createNodeSideMenu () {
    const sideMenu = document.createElement('div')
    const toggle = document.createElement('div')
    sideMenu.id = 'side_menu__nodejs'
    toggle.id = 'side_menu_toggle'
    const $toc = $('#toc')
    $toc.addClass('scroll-view')
    sideMenu.appendChild(toggle)
    sideMenu.appendChild($('#toc')[0])

    function toggleSideMenu () {
      $(sideMenu).toggleClass('open')
    }

    // 点击按钮或按 ESC 切换侧边栏显隐
    $(toggle).click(toggleSideMenu)
    $(document).keydown((e) => {
      if (e.key === 'Escape') {
        toggleSideMenu()
      }
    })

    GM_addStyle(`
      #side_menu__nodejs {
        position: fixed;
        top: 0;
        right: 0;
        width: 20%;
        min-width: 250px;
        transform: translateX(100%);
        transition: transform .15s;
      }

      #side_menu__nodejs.open {
        transform: translateX(0%);
      }

      #side_menu_toggle {
        position: absolute;
        left: -40px;
        top: 100px;
        padding: 20px;
        border-radius: 50%;
        color: #fff;
        background-color: rgba(113, 199, 173, 0.7);
        cursor: pointer;
        transform: translateX(-100%);
        transition: all 0.2s;
        animation: halo 2s 0s ease-out infinite;
      }

      @keyframes halo {
        0% {
          box-shadow: 0 0 2px 10px rgba(113, 199, 173, 0.7);
        }

        10% {
          box-shadow: 0 0 2px 10px rgb(113, 199, 173);
        }

        100% {
          box-shadow: 0 0 2px 40px rgba(113, 199, 173, 0.1);
        }
      }

      #toc {
        box-sizing: border-box;
        height: 100vh;
        padding: 16px 0 24px 0;
        overflow-y: auto;
        color: #fff;
        background-color: #333;
      }

      #toc h2,
      #toc url {
        margin: 0;
      }

      #toc h2 {
        font-size: 16px;
        text-align: center;
        margin-bottom: 8px;
      }

      #toc a {
        color: #ccc;
      }

      #toc a:hover {
        color: #fff;
      }
    `)

    document.body.appendChild(sideMenu)
  }

  // 掘金
  function fixedJueJinCategory () {
    // dom 延迟加载
    setTimeout(() => {
      $('body').attr('id', 'zwh')
      $('.sticky-block-box').addClass('scroll-view')
    }, 300)
    GM_addStyle(`

    #zwh .article-suspended-panel {
      top: auto;
      bottom: calc(2rem + 120px);
      right: calc((100vw - 960px) / 2 + 240px - 8px);
      transform: translateX(100%);
    }

    #zwh .suspension-panel {
      right: calc((100vw - 960px) / 2 + 240px - 46px);
    }

    #zwh .sidebar {
      right: -56px;
    }

    .scroll-view.sticky-block-box {
       position: fixed;
       left: 8px;
       top: 80px;
       bottom: 20px;
       width: 300px !important;
       max-width: calc((100% - 960px) / 2 - 8px);
       margin: auto;
       z-index: 1000;
    }
    `)
  }

  // 大力盘
  function unLockDaLiPan () {
    GM_addStyle(`
      #enfidialog .mobile-qrcode {
        display: none;
      }
      #enfidialog .mobile-ads {
        display: block !important;
      }
    `)
  }

  // 深入浅出 webpack
  function hideWebpackModal () {
    GM_addStyle(`
      .gitbook-plugin-modal {
        left: 9999px !important;
      }
    `)
  }

  function addCommonStyle () {
    GM_addStyle(`
    .scroll-view {
       overflow-y: auto;
    }
    .scroll-view::-webkit-scrollbar {
      width: 6px;
    }
    .scroll-view::-webkit-scrollbar-track {
      box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
    }
    .scroll-view::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    .scroll-view::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(255,0,0,0.4);
    }
    `)
  }
})()
