// ==UserScript==
// @name         元素属性复制
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  右键复制网页元素内容（类名、文本、HTML、Markdown），支持下载为 Markdown，使用 Vue + Element Plus + Turndown 实现。Markdown下载功能目前只做了掘金、CSDN的兼容（有瑕疵），其余网站没特意试过。
// @author       石小石Orz
// @match        *://*/*
// @license      MIT
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @resource     ELEMENT_JS https://cdn.jsdelivr.net/npm/element-plus
// @resource     elementPlusCss https://cdn.jsdelivr.net/npm/element-plus/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535102/%E5%85%83%E7%B4%A0%E5%B1%9E%E6%80%A7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535102/%E5%85%83%E7%B4%A0%E5%B1%9E%E6%80%A7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加 Element Plus 样式
  GM_addStyle(GM_getResourceText('elementPlusCss'));
  GM_addStyle(`
    .tm-hover-highlight {
      outline: 2px solid rgba(0, 123, 255, 0.7);
      background-color: rgba(0, 123, 255, 0.1) !important;
      border-radius: 4px;
      transition: all 0.2s ease;
      z-index: 9999;
    }
  `);

  // 加载 Vue 和 Element Plus
  window.Vue = unsafeWindow.Vue = Vue;
  const { createApp, ref, reactive } = Vue;
  const elementPlusJS = GM_getResourceText('ELEMENT_JS');
  eval(elementPlusJS);

  // 插入挂载点
  const container = document.createElement('div');
  container.id = 'copy-helper-app';
  document.body.appendChild(container);

  // Markdown 转换函数
  function htmlToMarkdown(el) {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    // 处理 <pre><code> 为代码块，过滤说明文字
    turndownService.addRule('code-block', {
      filter: 'pre',
      replacement: function (content) {
        const code = (content.match(/`{1,3}([\s\S]*?)`{1,3}/)?.[1] || content).trim();
        return '\n```\n' + code + '\n```\n';
      }
    });

    // 处理 <table>
    turndownService.addRule('table', {
      filter: 'table',
      replacement: function (_, node) {
        let markdown = '';
        const rows = Array.from(node.querySelectorAll('tr'));
        const extractText = (td) => td.textContent.trim().replace(/\|/g, '\\|');
        rows.forEach((row, i) => {
          const cells = Array.from(row.children).map(extractText);
          markdown += '| ' + cells.join(' | ') + ' |\n';
          if (i === 0) markdown += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
        });
        return '\n' + markdown + '\n';
      }
    });

    return turndownService.turndown(el.innerHTML);
  }

  // Vue 应用
  const App = {
    setup() {
      const visible = ref(false);
      const buttons = reactive([]);
      const pos = reactive({ top: 0, left: 0 });

      const setButtonsFor = (el) => {
        buttons.length = 0;
        const className = el.className?.toString().trim();
        const text = el.innerText?.trim();
        const html = el.innerHTML?.trim();
        const fullHtml = el.outerHTML?.trim();

        if (className) buttons.push({ label: '复制类名', content: className });
        if (text) buttons.push({ label: '复制文本', content: text });
        if (html) buttons.push({ label: '复制网页', content: html, type: 'html' });
        if (fullHtml) buttons.push({ label: '复制HTML文本', content: fullHtml, type: 'text' });

        if (html) {
          const md = htmlToMarkdown(el);
          buttons.push({ label: '复制为Markdown', content: md, type: 'text' });
          buttons.push({ label: '下载为Markdown', content: md, type: 'markdown' });
        }
      };

      const copy = ({ content, type }) => {
        if (type === 'markdown') {
          const title = document.title.replace(/[\\/:*?"<>|]/g, '_');
          GM_download({
            url: 'data:text/markdown;charset=utf-8,' + encodeURIComponent(content),
            name: title + '.md',
            saveAs: true
          });
          ElementPlus.ElMessage.success('Markdown 已下载');
        } else {
          GM_setClipboard(content, type || 'text');
          ElementPlus.ElMessage.success('复制成功！');
        }

        visible.value = false;
        deactivate();
      };

      const updatePosition = (x, y) => {
        pos.top = y;
        pos.left = x;
      };

      return { visible, buttons, pos, copy, setButtonsFor, updatePosition };
    },
    template: `
      <div v-if="visible"
           :style="{
             position: 'absolute',
             top: pos.top + 'px',
             left: pos.left + 'px',
             zIndex: 99999,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'flex-start',
             gap: '5px',
             backgroundColor: '#f2f2f2',
             borderRadius: '5px',
             border: '1px solid #ccc',
             padding: '8px'
           }">
        <el-button
          v-for="btn in buttons"
          size="small"
          :type="btn.type === 'markdown' ? 'primary' : 'info'"
          style="min-width: 140px; margin: 0"
          @click="copy(btn)"
        >
          {{ btn.label }}
        </el-button>
      </div>
    `
  };

  const app = createApp(App);
  app.use(ElementPlus);
  const vm = app.mount('#copy-helper-app');

  let currentElement = null;
  let activated = false;

  const isValidElement = (el) => {
    if (!el || el.nodeType !== 1) return false;
    const rect = el.getBoundingClientRect();
    return !['html', 'body', 'script', 'style'].includes(el.tagName.toLowerCase()) && rect.width >= 30 && rect.height >= 15;
  };

  const findValidTarget = (el) => {
    while (el && el !== document.body) {
      if (isValidElement(el)) return el;
      el = el.parentElement;
    }
    return null;
  };

  const handleMouseMove = (e) => {
    if (!activated) return;
    let el = e.target;
    if (document.querySelector('#copy-helper-app')?.contains(el)) return;

    el = findValidTarget(el);
    if (!el) return;

    if (el !== currentElement) {
      currentElement?.classList.remove('tm-hover-highlight');
      vm.visible = false;
      currentElement = el;
      currentElement.classList.add('tm-hover-highlight');
    }
  };

  const handleContextMenu = (e) => {
    if (!activated) return;
    let el = e.target;
    if (document.querySelector('#copy-helper-app')?.contains(el)) return;

    el = findValidTarget(el);
    if (!el) {
      vm.visible = false;
      return;
    }

    if (el === currentElement) {
      e.preventDefault();
      vm.setButtonsFor(el);
      vm.updatePosition(e.pageX, e.pageY);
      vm.visible = true;
    } else {
      vm.visible = false;
    }
  };

  function activate() {
    if (activated) return;
    activated = true;
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    ElementPlus.ElMessage.info('元素复制脚本已启动，右键高亮区域试试！');
  }

  function deactivate() {
    if (!activated) return;
    activated = false;
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('contextmenu', handleContextMenu, true);
    currentElement?.classList.remove('tm-hover-highlight');
    currentElement = null;
    vm.visible = false;
  }

  GM_registerMenuCommand('启动元素复制脚本', activate);
})();
