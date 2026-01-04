// ==UserScript==
// @name         返回顶部和底部-美化版
// @version      1.1.5
// @description  一个很漂亮的可返回顶部或底部的可拖拽的按钮，支持关闭当前网站和永久关闭当前网站
// @author       沐雨
// @license      MIT
// @match        *://*/*
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @namespace    https://www.yuxi.com/
// @downloadURL https://update.greasyfork.org/scripts/457039/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8-%E7%BE%8E%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/457039/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8-%E7%BE%8E%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

; (function () {
  'use strict'

  // 检查是否在iframe中运行
  if (window.self !== window.top) {
    // 在iframe中运行，不执行脚本
    return;
  }

  // 检查当前网站是否在忽略列表中
  const currentHost = window.location.hostname;
  const ignoredSites = JSON.parse(localStorage.getItem('btnScript_ignoredSites') || '[]');

  // 如果当前网站在忽略列表中，则不执行脚本
  if (ignoredSites.includes(currentHost)) {
    return;
  }

  var TBLink = function () {
    var $ = $ || window.$
    var $doc = $(document)
    var $win = $(window)
    // const iconFont = GM_getResourceText('css')
    var CreateHtml = function () {
      var html = `
      <div id="goTopBottom" style="display:flex;justify-content: center;align-items: center;width:50px;height:100px;">
                      <span class="t-btn gotop" title="返回顶部" style="opacity: 0;">
                        <svg t="1681901274619" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3044" id="mx_n_1681901274619" width="22" height="22"><path d="M199.36 572.768a31.904 31.904 0 0 0 22.624-9.376l294.144-294.144 285.728 285.728a31.968 31.968 0 1 0 45.248-45.248l-308.352-308.352a32 32 0 0 0-45.28 0l-316.768 316.768a31.968 31.968 0 0 0 22.656 54.624z" p-id="3045" fill="#ffffff"></path><path d="M538.784 457.376a32 32 0 0 0-45.28 0l-316.768 316.768a31.968 31.968 0 1 0 45.248 45.248l294.144-294.144 285.728 285.728a31.968 31.968 0 1 0 45.248-45.248l-308.32-308.352z" p-id="3046" fill="#ffffff"></path></svg>
                      </span>

                      <span class="t-btn bottom" title="返回底部" style="opacity: 0;">
                         <svg t="1681901383895" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4902" id="mx_n_1681901383896" width="22" height="22"><path d="M493.504 558.144a31.904 31.904 0 0 0 45.28 0l308.352-308.352a31.968 31.968 0 1 0-45.248-45.248l-285.728 285.728-294.176-294.144a31.968 31.968 0 1 0-45.248 45.248l316.768 316.768z" p-id="4903" fill="#ffffff"></path><path d="M801.888 460.576l-285.728 285.728-294.144-294.144a31.968 31.968 0 1 0-45.248 45.248l316.768 316.768a31.904 31.904 0 0 0 45.28 0l308.352-308.352a32 32 0 1 0-45.28-45.248z" p-id="4904" fill="#ffffff"></path></svg>
                      </span>
                </div>
`
      $('html body').append(html)

      // 添加右键菜单
      $('#goTopBottom').on('contextmenu', showContextMenu);
    }

    // 创建右键菜单
    var createContextMenu = function() {
      var menu = $('<div id="gtb-context-menu"></div>');
      menu.css({
        position: 'fixed',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
        padding: '5px 0',
        zIndex: 10000000,
        display: 'none',
        width: '140px',
        boxSizing: 'border-box',
        maxWidth: '140px',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        transition: 'opacity 0.2s ease'
      });

      // 创建一个菜单项
      function createMenuItem(text, icon, onClick) {
        var item = $('<div></div>');
        item.css({
          padding: '8px 12px',
          cursor: 'pointer',
          borderRadius: '4px',
          margin: '2px 5px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        });

        // 创建图标元素
        var iconElem = $('<div></div>');
        iconElem.css({
          flexShrink: 0,
          width: '14px',
          height: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px'
        });
        iconElem.text(icon);

        // 创建文本元素
        var textElem = $('<div></div>');
        textElem.css({
          flexGrow: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        });
        textElem.text(text);

        // 组装
        item.append(iconElem).append(textElem);

        // 添加悬停效果
        item.hover(
          function() { $(this).css('backgroundColor', '#f2f2f2'); },
          function() { $(this).css('backgroundColor', 'transparent'); }
        );

        // 添加点击事件
        item.on('click', onClick);

        return item;
      }

      // 创建菜单项
      var closeOption = createMenuItem('关闭按钮', '✕', hideScrollButtons);
      var ignoreOption = createMenuItem('忽略此网站', '⛔', ignoreCurrentSite);

      menu.append(closeOption);
      menu.append(ignoreOption);
      $('body').append(menu);

      return menu;
    }

    // 显示右键菜单
    var showContextMenu = function(e) {
      e.preventDefault();

      var menu = $('#gtb-context-menu');
      if (menu.length === 0) {
        menu = createContextMenu();
      }

      // 使用更可靠的方式获取视口宽度和高度
      var viewportWidth = Math.min(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      var viewportHeight = Math.min(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );

      // 设置固定宽度，防止内容撑开
      menu.css({
        width: '140px',
        visibility: 'hidden',
        display: 'block',
        left: 0,  // 临时位置，只用于获取高度
        top: 0
      });

      var menuHeight = menu.outerHeight(true);

      // 计算最佳位置
      var posX, posY;

      // 水平位置计算 - 优先放在点击位置，如果靠近右边界则显示在左侧
      if (e.clientX + 160 > viewportWidth) { // 增加余量，确保不触发滚动条
        posX = Math.max(e.clientX - 150, 10); // 放在左侧，确保至少有10px边距
      } else {
        posX = e.clientX;
      }

      // 垂直位置计算 - 保持在可视区域内
      if (e.clientY + menuHeight + 20 > viewportHeight) {
        posY = viewportHeight - menuHeight - 20; // 确保底部有20px边距
      } else {
        posY = e.clientY;
      }

      // 设置菜单最终位置并显示
      menu.css({
        left: posX + 'px',
        top: posY + 'px',
        visibility: 'visible'
      });

      // 点击其他区域关闭菜单
      setTimeout(function() {
        $(document).one('click', function() {
          menu.hide();
        });
      }, 100);
    }

    // 隐藏滚动按钮
    var hideScrollButtons = function() {
      $('#goTopBottom').hide();
    }

    // 忽略当前网站
    var ignoreCurrentSite = function() {
      var currentHost = window.location.hostname;
      var ignoredSites = JSON.parse(localStorage.getItem('btnScript_ignoredSites') || '[]');

      // 添加当前网站到忽略列表
      if (!ignoredSites.includes(currentHost)) {
        ignoredSites.push(currentHost);
        localStorage.setItem('btnScript_ignoredSites', JSON.stringify(ignoredSites));
      }

      // 隐藏按钮
      hideScrollButtons();
    }

    // 用于存储最后拖拽结束的时间戳
    var lastDragEndTime = 0;
    // 拖拽后多长时间内不触发点击（毫秒）
    var clickPreventionDelay = 500;

    // 检查是否应该阻止点击
    var shouldPreventClick = function() {
      return Date.now() - lastDragEndTime < clickPreventionDelay;
    }

    var CreateStyle = function () {
      var style =
        '#goTopBottom {position: fixed;bottom: 75px;right: 15px;z-index: 999999;display: flex;flex-direction: column;row-gap: 5px; opacity: 0.7; transition: opacity 0.3s;}' +
        '#goTopBottom:hover {opacity: 1;}' +
        '#goTopBottom .top {opacity: 0;}' +
        '#goTopBottom .t-btn {display: flex;justify-content: center;align-items: center;width: 40px;height: 40px;cursor: pointer;color: #fff;border-radius: 4px;background-image: linear-gradient(to top right,#6966ff,#37e2d3);background-size: 100% 100%;background-color: transparent;}' +
        '#goTopBottom .bottom {opacity: 0;}'
      // GM_addStyle(iconFont)
      GM_addStyle(style)
    }
    var GoTB = function () {
      var upperLimit = 100
      var scrollSpeed = 500
      var fadeSpeed = 300
      var $top = $('#goTopBottom .gotop')
      var $bottom = $('#goTopBottom .bottom')
      if (getScrollTop() > upperLimit) {
        $top.stop().fadeTo(0, 1, function () {
          $top.show()
        })
      }
      if (getScrollTop() + $(window).height() < $doc.height() - upperLimit) {
        $bottom.stop().fadeTo(0, 1, function () {
          $bottom.show()
        })
      }
      $doc.scroll(function () {
        if (getScrollTop() > upperLimit) {
          $top.stop().fadeTo(fadeSpeed, 1, function () {
            $top.css('visibility', 'visible')
          })
        } else {
          $top.stop().fadeTo(fadeSpeed, 0, function () {
            $top.css('visibility', 'hidden')
          })
        }
        if (getScrollTop() + $(window).height() < $doc.height() - upperLimit) {
          $bottom.stop().fadeTo(fadeSpeed, 1, function () {
            $bottom.css('visibility', 'visible')
          })
        } else {
          $bottom.stop().fadeTo(fadeSpeed, 0, function () {
            $bottom.css('visibility', 'hidden')
          })
        }
      })

      // 移除旧的点击处理器，确保不会重复绑定
      $('#goTopBottom span').off('click');

      // 添加新的点击处理器
      $('#goTopBottom span').on('click', function (e) {
        // 如果刚拖拽完成，阻止点击
        if (shouldPreventClick()) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        var $this = $(this)
        var clsName = $this.attr('class')

        // 改进的滚动处理，处理懒加载内容
        if (clsName.includes('gotop')) {
          // 滚动到顶部
          $('html, body').animate({
            scrollTop: 0
          }, scrollSpeed)
        } else {
          // 滚动到底部，处理懒加载内容
          const maxScrollHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );

          $('html, body').animate({
            scrollTop: maxScrollHeight
          }, scrollSpeed)
        }

        return false
      })
    }
    var getScrollTop = function () {
      var scrollTop = $doc.scrollTop() || $('html,body').scrollTop()
      return scrollTop
    }
    /**
     * 拖拽
     */
    function dragging() {
      let isDragging = false;
      let dragThreshold = 5; // 拖拽阈值，移动超过这个距离才算拖拽

      var position = GM_getValue('gtb_pos') || {}
      var $gtbBox = $('#goTopBottom');

      $('#goTopBottom')
        .off('.gtb')
        .on({
          'mousedown.gtb': function (el) {
            if (el.button !== 0) return; // 只在左键点击时处理

            // 阻止默认行为，防止选中文字
            el.preventDefault();

            var move = true
            var startX = el.pageX
            var startY = el.pageY
            var startLeft = $gtbBox.offset().left
            var startTop = $gtbBox.offset().top
            var movedDistance = 0

            $doc.on({
              'mousemove.gtb': function (docEl) {
                if (move) {
                  // 阻止默认行为，防止选中文字
                  docEl.preventDefault();

                  var deltaX = docEl.pageX - startX
                  var deltaY = docEl.pageY - startY
                  movedDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

                  // 如果移动距离超过阈值，则认为是拖拽
                  if (movedDistance > dragThreshold) {
                    isDragging = true;
                    $gtbBox.offset({
                      left: startLeft + deltaX,
                      top: startTop + deltaY
                    })
                  }
                }
              },
              'mouseup.gtb': function (upEl) {
                move = false
                $doc.off('.gtb')

                // 如果是拖拽操作，记录结束时间并阻止默认行为
                if (isDragging) {
                  lastDragEndTime = Date.now();
                  isDragging = false;

                  // 阻止默认行为，防止点击操作
                  upEl.preventDefault();
                  upEl.stopPropagation();
                }
              }
            })
          }
        });
    }
    this.init = function () {
      CreateStyle()
      CreateHtml()
      dragging()
      GoTB()
    }
  }
  var tbl = new TBLink()
  tbl.init()
})()
