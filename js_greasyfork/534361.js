// ==UserScript==
// @name         完全解除任意网站复制粘贴限制 & 原生复制粘贴使用体验
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  优先接管编辑器粘贴管线（UEditor/CKEditor/TinyMCE/Quill），将内容转为纯文本或去样式后放行；否则在捕获阶段统一处理 paste 并原生注入，保留撤销；解锁选中/右键/拖拽；支持同源 iframe 与动态渲染。
// @author       AMT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/534361/%E5%AE%8C%E5%85%A8%E8%A7%A3%E9%99%A4%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%20%20%E5%8E%9F%E7%94%9F%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/534361/%E5%AE%8C%E5%85%A8%E8%A7%A3%E9%99%A4%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%20%20%E5%8E%9F%E7%94%9F%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** 配置 ***/
  const PURE_TEXT = true; // true: 彻底纯文本；false: 仅去 style/class/id/on* 等内联样式与类名，保留基本标签
  const ENABLE_GLOBAL_PASTE_CAPTURE = true; // 在捕获阶段统一接管 paste（对大多数站点更稳）

  /************** 0. 解锁常规禁止：选中 / 右键 / 拖拽 / 长按 **************/
  const blocked = ['selectstart','mousedown','mouseup','mousemove','contextmenu','dragstart'];
  blocked.forEach(ev => addEvent(document, ev, e => e.stopImmediatePropagation(), { capture: true }));
  onReady(() => { if (document.body) document.body.onselectstart = null; });
  const css = document.createElement('style');
  css.textContent = `*{user-select:text!important;-webkit-user-select:text!important;}`;
  document.documentElement.appendChild(css);

  /************** 1. 优先：编辑器感知式粘贴钩子 **************/
  // —— UEditor
  function hookUEditor(win) {
    try {
      const UE = win.UE;
      if (!UE || !UE.getEditor) return false;
      const textareas = Array.from(win.document.getElementsByTagName('textarea'))
        .filter(t => t.id && /answer|ueditor|editor/i.test(t.id));
      textareas.forEach(t => {
        const ed = UE.getEditor(t.id);
        if (!ed) return;
        ed.ready(() => {
          // 尝试卸掉站点自带 beforepaste（若有命名的全局函数）
          try { ed.removeListener('beforepaste', win.editorPaste); } catch {}
          // UEditor 的纯文本选项（若支持）
          try { ed.setOpt && ed.setOpt('pasteplain', true); } catch {}

          ed.addListener('beforepaste', function (_type, html) {
            try {
              if (PURE_TEXT && html && typeof html.text === 'string') {
                html.html = escapeHtml(html.text);     // 彻底纯文本
              } else if (html && typeof html.html === 'string') {
                html.html = sanitizeHTML(html.html);   // 去样式/类名
              }
            } catch {}
            return true; // 放行
          });
        });
      });
      return textareas.length > 0;
    } catch { return false; }
  }

  // —— CKEditor 4
  function hookCKEditor4(win) {
    try {
      const CK = win.CKEDITOR;
      if (!CK || !CK.instances) return false;
      let hooked = 0;
      Object.values(CK.instances).forEach(inst => {
        if (inst.__amt_paste_hooked) return;
        inst.on('paste', evt => {
          const data = evt.data;
          try {
            const text = (data && (data.clipboardData?.getData('text/plain') || data.dataValue)) || '';
            if (PURE_TEXT) {
              data.type = 'text';
              data.dataValue = escapeHtml(text);
            } else {
              data.dataValue = sanitizeHTML(data.dataValue || text);
            }
          } catch {}
        }, null, null, 0);
        inst.__amt_paste_hooked = true;
        hooked++;
      });
      return hooked > 0;
    } catch { return false; }
  }

  // —— TinyMCE
  function hookTinyMCE(win) {
    try {
      const TM = win.tinymce;
      if (!TM || !TM.editors) return false;
      let hooked = 0;
      TM.editors.forEach(ed => {
        if (!ed || ed.destroyed || ed.__amt_paste_hooked) return;
        ed.on('Paste', e => {
          try {
            const dt = e.clipboardData;
            let text = '';
            if (dt) text = dt.getData('text/plain') || dt.getData('text') || '';
            if (PURE_TEXT) {
              e.preventDefault();
              ed.insertContent(escapeHtml(text));
            } else if (text) {
              e.preventDefault();
              ed.insertContent(sanitizeHTML(text));
            }
          } catch {}
        });
        try { ed.on('keydown', ev => ev.stopImmediatePropagation(), true); } catch {}
        ed.__amt_paste_hooked = true;
        hooked++;
      });
      return hooked > 0;
    } catch { return false; }
  }

  // —— Quill
  function hookQuill(win) {
    try {
      const Quill = win.Quill;
      if (!Quill || !Quill.prototype) return false;
      // 尝试从全局变量或节点上找到 quill 实例
      const nodes = win.document.querySelectorAll('.ql-editor');
      let hooked = 0;
      nodes.forEach(n => {
        const q = n.__quill || n.parentElement?.__quill || null;
        if (!q || q.__amt_paste_hooked) return;
        const Delta = Quill.import && Quill.import('delta');
        if (Delta) {
          q.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
            if (PURE_TEXT) {
              const text = node.innerText || node.textContent || '';
              return new Delta().insert(text);
            } else {
              // 去样式：保留文本与基础换行
              const text = (node.innerText || node.textContent || '').replace(/\r/g,'');
              return new Delta().insert(text);
            }
          });
          q.__amt_paste_hooked = true;
          hooked++;
        }
      });
      return hooked > 0;
    } catch { return false; }
  }

  // —— 尝试在主文档与同源 iframe 内多轮挂钩
  function tryHookEditors(win) {
    let any = false;
    any = hookUEditor(win) || any;
    any = hookCKEditor4(win) || any;
    any = hookTinyMCE(win) || any;
    any = hookQuill(win) || any;
    return any;
  }

  // 初次与轮询/观察（应对异步加载）
  onReady(() => {
    // 主文档
    bootHook(window, document);
    // 同源 iframe
    observeIframes(doc => bootHook(doc.defaultView || window, doc));
  });

  function bootHook(win, doc) {
    let tries = 0;
    const tick = () => {
      tryHookEditors(win);
      if (++tries < 60) setTimeout(tick, 300); // 最多尝试 ~18s
    };
    tick();

    // DOM 变化也再试（题目区/编辑器异步渲染）
    const mo = new MutationObserver(() => tryHookEditors(win));
    mo.observe(doc.documentElement, { childList: true, subtree: true });
  }

  /************** 2. 通用：捕获阶段统一处理 paste 并原生注入 **************/
  if (ENABLE_GLOBAL_PASTE_CAPTURE) {
    const onPasteCapture = (e) => {
      const t = findEditableTarget(e);
      if (!t) return; // 非编辑目标，不处理
      // 从剪贴板取纯文本
      const dt = e.clipboardData;
      let text = '';
      if (dt) text = dt.getData('text/plain') || dt.getData('text') || '';
      // 无文本则放行（比如图片/文件粘贴）
      if (!text) return;

      e.stopImmediatePropagation();
      e.preventDefault();

      const final = PURE_TEXT ? text : stripHTMLToCleanTextOrBasic(text);
      insertTextAtCursor(t, final);
    };

    addEvent(document, 'paste', onPasteCapture, { capture: true, passive: false });
    observeIframes(doc => addEvent(doc, 'paste', onPasteCapture, { capture: true, passive: false }));
  }

  /************** 3. 注入实现：保留撤销栈 **************/
  function insertTextAtCursor(el, text) {
    if (!el) return;
    const doc = el.ownerDocument || document;

    // 优先用原生命令（很多富文本/框架能把它纳入撤销栈）
    try {
      el.focus();
      if (doc.execCommand && doc.execCommand('insertText', false, text)) {
        dispatchInput(el, text);
        return;
      }
    } catch { /* fallthrough */ }

    // input/textarea
    if (!el.isContentEditable) {
      try {
        const s = el.selectionStart ?? 0, e = el.selectionEnd ?? s;
        el.setRangeText(text, s, e, 'end'); // 保留撤销
      } catch {
        const val = String(el.value ?? '');
        const s = el.selectionStart|0, e = el.selectionEnd|0;
        setNativeValue(el, val.slice(0, s) + text + val.slice(e));
        try { el.setSelectionRange(s + text.length, s + text.length); } catch {}
      }
      dispatchInput(el, text);
      return;
    }

    // contenteditable：Range 手动插入
    const sel = doc.getSelection && doc.getSelection();
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const tn = doc.createTextNode(text);
      range.insertNode(tn);
      range.setStartAfter(tn);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      dispatchInput(el, text);
    }
  }

  function dispatchInput(el, data) {
    // beforeinput
    try { el.dispatchEvent(new InputEvent('beforeinput', { data, inputType:'insertFromPaste', bubbles:true, cancelable:true })); } catch {}
    // input
    try { el.dispatchEvent(new InputEvent('input', { data, inputType:'insertFromPaste', bubbles:true })); } catch {
      el.dispatchEvent(new Event('input', { bubbles:true }));
    }
    // change（站点依赖）
    try { el.dispatchEvent(new Event('change', { bubbles:true })); } catch {}
  }

  /************** 4. 目标判定 / 事件 / iframe / 工具 **************/
  function isEditable(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = (el.tagName || '').toLowerCase();
    if (tag === 'textarea') return true;
    if (tag === 'input') {
      // 避免密码框
      return /^(?:text|search|email|url|tel|password|number)$/i.test(el.type || '');
    }
    return false;
  }
  function findEditableTarget(e) {
    // 支持穿过 shadow DOM，沿 composedPath 找最近的可编辑
    const path = (e.composedPath && e.composedPath()) || [];
    for (const n of path) {
      if (n && isEditable(n)) return n;
    }
    // 兜底：activeElement
    const ae = (e.target && (e.target.ownerDocument || document).activeElement) || document.activeElement;
    return isEditable(ae) ? ae : null;
  }

  function addEvent(target, type, handler, opts) {
    try { target.addEventListener(type, handler, opts || false); } catch {}
  }

  function observeIframes(cb) {
    const seen = new WeakSet();
    const hook = frame => {
      if (!frame || seen.has(frame)) return;
      seen.add(frame);
      try {
        const doc = frame.contentDocument;
        if (doc) cb(doc);
      } catch { /* 跨域 iframe 无法访问 */ }
    };
    const scan = root => root.querySelectorAll('iframe');
    onReady(() => scan(document).forEach(hook));
    const mo = new MutationObserver(muts => muts.forEach(m => m.addedNodes?.forEach(n => {
      if (n && n.tagName === 'IFRAME') hook(n);
    })));
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function setNativeValue(el, value) {
    const proto = el.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const des = Object.getOwnPropertyDescriptor(proto, 'value');
    des && des.set && des.set.call(el, value);
  }

  /************** 5. 纯文本/去样式处理 **************/
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function sanitizeHTML(html) {
    // 仅去掉 style/class/id/on* 这类容易被站点拒绝的内联属性；保留标签结构
    try {
      const div = document.createElement('div');
      div.innerHTML = html;
      const walk = node => {
        if (node.nodeType === 1) { // ELEMENT_NODE
          // 删除危险/冗余属性
          const rm = [];
          for (const a of node.attributes) {
            const name = a.name.toLowerCase();
            if (name === 'style' || name === 'class' || name === 'id' || name.startsWith('on') || name.startsWith('data-')) {
              rm.push(a.name);
            }
          }
          rm.forEach(n => node.removeAttribute(n));
        }
        node.childNodes && node.childNodes.forEach(walk);
      };
      div.childNodes.forEach(walk);
      return div.innerHTML;
    } catch {
      // 退一步：去 style/class 的简单正则
      return String(html).replace(/\s*(?:style|class|id|on\w+|data-[\w-]+)="[^"]*"/gi, '');
    }
  }

  function stripHTMLToCleanTextOrBasic(mixed) {
    // 输入可能是 HTML 或纯文本；先简单判定
    if (!/[<>&]/.test(mixed)) return mixed; // 看起来像纯文本
    // 尝试 DOM 解析再提取纯文本
    try {
      const div = document.createElement('div');
      div.innerHTML = mixed;
      // 将 <br>/<p> 转为换行
      Array.from(div.querySelectorAll('br')).forEach(br => { br.replaceWith('\n'); });
      Array.from(div.querySelectorAll('p,div,li')).forEach(el => {
        if (el.lastChild && el.lastChild.nodeType !== 3) el.appendChild(document.createTextNode('\n'));
        else el.appendChild(document.createTextNode('\n'));
      });
      return (div.textContent || '').replace(/\u00A0/g, ' ');
    } catch {
      // 失败则硬去标签
      return String(mixed).replace(/<[^>]+>/g, '');
    }
  }

  // console.log('[PasteHook] loaded');
})();
