// ==UserScript==
// @name         云图增强工具
// @namespace    https://rachpt.cn/
// @version      0.1.5
// @description  yuntu enhance tools
// @author       rachpt
// @license      MIT
// @match        https://yuntu.sankuai.com/v3/dashboard/dashboard-*/view*
// @exclude      https://yuntu.sankuai.com/dashboard/dashboard*/edit
// @require      https://greasyfork.org/scripts/445645-mws/code/mws.js?version=1055022
// @icon         https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:f23089be/yuntu.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445647/%E4%BA%91%E5%9B%BE%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/445647/%E4%BA%91%E5%9B%BE%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 自动关闭提示消息
  const isWidget = /.*\/widget\/widget-.*/.test(location.pathname);
  const isDashboard = /^\/v3\/dashboard\/dashboard-.*/.test(location.pathname);
  setTimeout(() => {
    if (!isWidget && isDashboard) {
      // 关闭公告, 5 秒超时
      (async () => (await mws.wait('#yuntu-top-announcement .mtdicon-close-thick', 10, 500))?.click())();
      // 关闭菜单, 12 秒超时
      (async () => (await mws.wait('.mtd-drawer .mtd-drawer-close', 40, 300))?.click())();
    }
    // 表格添加复制按钮, 16 秒超时
    (async () => (await mws.wait('#widget, .report-chart-container.table', 40, 400)) && addExtraCopyBtn())();
    // 注册 查询事件, 20 秒超时
    (async () => {
      const query = await mws.wait('.report-filters .btn-query', 40, 500);
      if (query) query.addEventListener('click', () => setTimeout(addExtraCopyBtn, 1500));
    })();
  }, 100);

  // 注册事件: 滚动添加新表格复制按钮
  window.addEventListener('scroll', addExtraCopyBtn);

  /**
   * 创建带有自动关闭的消息提示框, 可点击关闭
   * @param content string 消息体
   */
  function createAlertModal(content) {
    const msgWight = 350; // 提示窗口的宽度
    const msgHeight = 80; // 提示窗口的高度
    const titleHeight = 25; // 提示窗口标题高度
    const borderColor = '#336699'; // 提示窗口的边框颜色
    const titleColor = '#99CCFF'; // 提示窗口的标题颜色

    const sWidth = document.body.offsetWidth;
    const sHeight = document.body.offsetHeight;
    // 背景
    const bgEl = document.createElement('div');
    bgEl.setAttribute('id', 'myAlertBgDiv');
    bgEl.style.position = 'absolute';
    bgEl.style.top = '0';
    bgEl.style.background = '#E8E8E8';
    bgEl.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75)';
    bgEl.style.opacity = '0.6';
    bgEl.style.left = '0';
    bgEl.style.width = sWidth + 'px';
    bgEl.style.height = sHeight + 'px';
    bgEl.style.zIndex = '10000';
    document.body.appendChild(bgEl);
    // 提示窗口
    const msgEl = document.createElement('div');
    msgEl.setAttribute('id', 'myAlertMsgDiv');
    msgEl.setAttribute('align', 'center');
    msgEl.style.background = 'white';
    msgEl.style.border = '1px solid ' + borderColor;
    msgEl.style.position = 'absolute';
    msgEl.style.left = '50%';
    msgEl.style.font = '12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif';
    // 窗口距离左侧和顶端的距离
    msgEl.style.marginLeft = '-225px';
    //窗口被卷去的高+（屏幕可用工作区高/2）-150
    msgEl.style.top = document.body.scrollTop + window.screen.availHeight / 2 - 150 + 'px';
    msgEl.style.width = msgWight + 'px';
    msgEl.style.height = msgHeight + 'px';
    msgEl.style.textAlign = 'center';
    msgEl.style.lineHeight = '25px';
    msgEl.style.zIndex = '10001';
    document.body.appendChild(msgEl);
    // 提示信息标题
    const titleEl = document.createElement('h4');
    titleEl.setAttribute('id', 'myAlertMsgTitle');
    titleEl.setAttribute('align', 'left');
    titleEl.style.margin = '0';
    titleEl.style.padding = '3px';
    titleEl.style.background = borderColor;
    titleEl.style.filter =
      'progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);';
    titleEl.style.opacity = '0.75';
    titleEl.style.border = '1px solid ' + borderColor;
    titleEl.style.height = titleHeight + 'px';
    titleEl.style.font = '12px Verdana, Geneva, Arial, Helvetica, sans-serif';
    titleEl.style.color = titleColor;
    titleEl.innerHTML = '提示信息';
    document.getElementById('myAlertMsgDiv')?.appendChild(titleEl);
    // 提示信息
    const bodyEl = document.createElement('p');
    bodyEl.setAttribute('id', 'myAlertMsgBody');
    bodyEl.style.margin = '16px 0';
    bodyEl.innerHTML = content + ', 三秒后自动关闭';
    document.getElementById('myAlertMsgDiv')?.appendChild(bodyEl);
    // 设置关闭
    setTimeout(closeWin, 3000);
    document.getElementById('myAlertMsgDiv')?.addEventListener('click', closeWin);

    function closeWin() {
      const bg = document.getElementById('myAlertBgDiv');
      if (bg) document.body.removeChild(bg);
      const title = document.getElementById('myAlertMsgTitle');
      if (title) document.getElementById('myAlertMsgDiv')?.removeChild(title);
      const msg = document.getElementById('myAlertMsgDiv');
      if (msg) document.body.removeChild(msg);
      const body = document.getElementById('myAlertMsgBody');
      if (body) document.body.removeChild(body);
    }
  }

  /**
   * 创建复制按钮, 并绑定复制事件
   * @param text string 按钮文字
   * @param isBody boolean 是否为云图表格内容
   * @returns
   */
  function createBtnElement(text = '复制', isBody = true) {
    const btn = document.createElement('span');
    btn.textContent = text;
    btn.style.overflow = 'hidden';
    btn.style.borderRadius = '9px';
    btn.style.display = 'inline-block';
    btn.style.border = `2px solid #${isBody ? '2a8efe' : 'ffc300'}`;
    btn.style.fontSize = 'smaller';
    btn.style.cursor = 'pointer';
    btn.style.padding = '0 4px';
    btn.addEventListener('click', async function (event) {
      const content = event.target?.parentNode?.parentNode?.parentNode?.parentNode?.querySelector(
        `table.mtd-table-${isBody ? 'body' : 'header'}`
      )?.outerHTML;
      const richContent = new ClipboardItem({
        'text/html': new Blob([content || '发生异常...'], {
          type: 'text/html',
        }),
      });
      await navigator.clipboard.write([richContent]);
      if (content) createAlertModal('复制成功');
      else createAlertModal('发生异常');
    });
    const wrapper = document.createElement('span');
    wrapper.classList.add('mtd-tooltip-rel');
    wrapper.classList.add('my-copy-btn');
    wrapper.appendChild(btn);
    return wrapper;
  }

  /**
   * 遍历表格添加按钮方法
   */
  function addExtraCopyBtn() {
    document.querySelectorAll('#widget, .report-chart-container.table').forEach(el => {
      if (!el.querySelector('span.my-copy-btn')) {
        const wrapperBody = createBtnElement('复制内容', true);
        const wrapperHeader = createBtnElement('复制表头', false);
        const headerEl = el.querySelector('.report-chart-header');
        const menu = el.querySelector('.report-chart-header .chart-menu');
        headerEl?.insertBefore(wrapperHeader, menu);
        headerEl?.insertBefore(wrapperBody, menu);
      }
    });
  }
})();
