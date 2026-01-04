// ==UserScript==
// @name         _简道云小助手_dev
// @namespace    https://greasyfork.org/en/scripts/441627
// @version      3.0.0.1
// @description  全新简道云技术支持录问题题小助手, 支持基于React的简道云, 提供一些小功能
// @author       LeoYuan
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @match        https://www.jiandaoyun.com/dashboard
// @include      /^https?://www\.jiandaoyun\.com/dashboard/.*
// @icon         https://assets.jiandaoyun.com/v2270/resources/images/jdy_icon.png
// @note         脚本地址：https://greasyfork.org/en/scripts/441627
// @downloadURL https://update.greasyfork.org/scripts/441627/_%E7%AE%80%E9%81%93%E4%BA%91%E5%B0%8F%E5%8A%A9%E6%89%8B_dev.user.js
// @updateURL https://update.greasyfork.org/scripts/441627/_%E7%AE%80%E9%81%93%E4%BA%91%E5%B0%8F%E5%8A%A9%E6%89%8B_dev.meta.js
// ==/UserScript==

/* changelog:
- 修复文档参考字段的延迟加载问题;
- 调整缩写名, 缩小字号以全都显示;
*/

(function () {
  'use strict';
  console.debug('\n--------========≡≡≡≡≡≡≡≡ 简道云小助手启动 ≡≡≡≡≡≡≡≡========--------\n');

  class WaitForNode {
    #parent;
    #observerList = [];

    constructor(args) {
      if (typeof args === 'string') this.#parent = document.querySelector(args) || document.body;
      else if (args instanceof Element) this.#parent = args;
      else this.#parent = document.body;
    }

    #executeCallback(elements, callback) {
      elements.forEach(el => callback(el));
    }

    on(selector, callback, recursive = false, immediate = true, once = false) {
      if (immediate) { this.#executeCallback([...this.#parent.querySelectorAll(selector)], callback); }
      const observer = new MutationObserver(mutations => {
        const matches = [];
        for (const { addedNodes } of mutations) {
          for (const n of addedNodes) {
            if (!n.tagName) { continue; }
            else if (n.matches(selector)) { matches.push(n); }
            else if (recursive && n.firstElementChild) { matches.push(...n.querySelectorAll(selector)); }
          }
        }
        this.#executeCallback(matches, callback);
        if (matches && once) this.disconnect();
      });
      observer.observe(this.#parent, {
        subtree: true,
        childList: true,
      });
      this.#observerList.push(observer);
    }

    stopAll() { while (this.#observerList.length) this.#observerList.pop().disconnect(); }
  }


  class InjectHTMLContent {
    constructor(element, location, HTML, CSS, listeners) {
      element.insertAdjacentHTML(location, this.#generateHTML(HTML, CSS));
      if (typeof listeners !== 'object') return;
      if (!Array.isArray(listeners)) listeners = [listeners];
      listeners.forEach(li => this.#addEventListener(element, li.selector, li.event, li.callback));
    }
    #generateHTML(HTML, CSS) { return (CSS ? `<style type='text/css'>${Array.isArray(CSS) ? CSS.join('\n') : CSS}}</style>` : '') + HTML; }
    #addEventListener(element, selector, event, callback) { element.parentNode.querySelector(selector).addEventListener(event, callback); }
  }

  class AppFormActivator {
    #executerList = [];
    #executingList = [];
    #lastHashStr;
    #timerID;

    constructor() { }

    add(name, appid, formid, callback) {
      //TODO: 检查参数是否合法或已存在
      this.#executerList.push({
        name: name,
        appid: appid,
        formid: formid,
        callback: callback
      });
    }

    #listNotEmpty() { return this.#executerList.length > 0; }
    #isJDYsDashboardUrl(url) { return typeof url === 'string' && url.match(/^https:\/\/www.jiandaoyun.com\/dashboard#\/app\/[0-9a-f]{24,}\/form\/[0-9a-f]{24,}/); }
    #filterExecuter(url) { return this.#executerList.filter(e => url.includes(`/app/${e.appid}`) && url.includes(`/form/${e.formid}`)); }
    #isExecuting = (name) => { return !!this.#executingList.find(ex => !!ex[name]); };
    #stopExecuting = () => { while (this.#executingList.length) Object.values(this.#executingList.pop())[0].stop(); };
    #executeCallback(eL) {
      eL.forEach(e => {
        if (this.#isExecuting(e.name)) return;
        try {
          this.#executingList.push({ [e.name]: e.callback() });
        } catch (excp) { console.error(excp); }
      });
    }

    #intervalRunner = () => {
      if (this.#lastHashStr !== location.hash) {
        this.#lastHashStr = location.hash;
        this.#stopExecuting();
        this.once();
      }
    };

    start() {
      if (this.#timerID) return console.warn('Activator already started!');
      this.#timerID = setInterval(this.#intervalRunner, 111);
      return console.debug('Activator started!');
    }

    stop() {
      if (!this.#timerID) return console.warn('Activator not running!');
      window.clearInterval(this.#timerID);
      return console.debug('Activator stoped!');
    }

    once(url) {
      if (!url || typeof url !== 'string') url = window.location.href;
      if (this.#listNotEmpty() && this.#isJDYsDashboardUrl(url)) {
        this.#executeCallback(this.#filterExecuter(url));
      }
    }
  }

  class FormExecutor {
    #formSelector = 'div.fx-form-view div.fx-form.form-modal';
    #form;

    constructor() {
      this.#form = new WaitForNode(this.#formSelector);
    }

    stop() { return this.#form.stopAll(); }

    #isValidFieldID(fieldID) { return typeof fieldID === 'string' && fieldID.match(/^\s*_widget_\d{13,18}\s*$/); }
    #generateSelectorByFieldID(fieldID) { return `[data-widgetname='${fieldID}']`; }
    #formEl(selector) {
      const form = document.querySelector(this.#formSelector);
      return selector ? form.querySelector(selector) : form;
    }

    #findReact(element, nonrecursive = false) {
      if (!element) return null;
      const key = Object.keys(element).find(key => key.startsWith('__reactInternalInstance$'));
      const internalInstance = element[key];
      if (internalInstance == null) return null;
      const root = internalInstance.memoizedProps;
      if (nonrecursive) return root;
      let iterate = root;
      while (!iterate.value && iterate.children) {
        iterate = iterate.children.length ? iterate.children[0].props : iterate.children.props;
      }
      return iterate.value || null;
    }

    #formField2React(fieldID) {
      if (!this.#isValidFieldID(fieldID)) return;
      const form = this.#findReact(this.#formEl());
      const fields = form.fieldMap;
      const result = Object.keys(fields).filter(key => key.match(`${fieldID}$`)).map(key => fields[key]);
      return result.length > 0 ? result.length > 1 ? result : result[0] : null;
    }

    #setFieldValue(obj, val) {
      if (!obj || !val) return;
      obj.setValue(val || '');
      obj.fireLink();
    }

    #clickButton(element) {
      if (!element) return;
      if (element.tagName !== 'BUTTON') return this.#clickButton(element.parentNode);
      element.classList.add('is-active');
      element.click();
      setTimeout(function () { element.classList.remove('is-active'); }, 250);
    }

    set enablePasteQQorPhoneNumber(args) {
      const conf = {
        ...{ fieldID: '', immediate: true, buttonText: '粘贴QQ/手机号' },
        ...(typeof args === 'object' ? args : { fieldID: args.trim() })
      };
      const pasteNumber = (force = true) => {
        navigator.clipboard.readText().then(text => {
          if (!text.match(/^[\d\s]+$/) && !force) return;
          this.#setFieldValue(this.#formField2React(args.fieldID), text);
        });
      };

      const pasteQQButtonHTML = `<button class='x-button style-primary size-normal x-qq-button'><i class='x-icon iconfont-fx-pc icon-qq'></i><span>${conf.buttonText}</span></button>`;
      const css = '.x-qq-button { margin: 20px 100px; }';
      const listeners = {
        selector: 'button.x-qq-button',
        event: 'click',
        callback: pasteNumber
      };

      this.#form.on(this.#generateSelectorByFieldID(conf.fieldID), (el) => {
        pasteNumber(false);
        new InjectHTMLContent(el, 'beforeEnd', pasteQQButtonHTML, css, listeners);
      });
    }

    set enableSubFormQuickAction(args) {
      const defaultCSS = [
        '.x-button-row { display: flex; padding: 10px; }',
        '.x-quick-button { font-size: 14px; border-color: grey; padding: 5px; }',
        '.x-quick-button .x-icon { font-size: 14px; }',
      ];
      const defaultStyles = {
        1: { styleName: '普通', class: 'style-normal', icon: 'icon-workbench', },
      };
      const conf = {
        ...{
          subFormID: '',
          fields: {},
          notNullFields: [],
          actions: [],
          enableShortCuts: true,
          css: defaultCSS,
          styles: defaultStyles,
        }, ...args
      };
      conf.fullActs = conf.actions.map((act, index) => {
        return { ...conf.styles[act.style], ...{ shortname: act.name, shortcut: index, enabled: true }, ...act };
      }).filter(a => a.enabled);
      const generateQuickButtonHTML = act => `<button class="x-button x-quick-button ${act.class}" title="${act.name}"><i class="x-icon iconfont-fx-pc ${act.icon}"></i><span>${act.shortname}</span></button>`;
      const quickButtonRowHTML = `<div class="x-button-row">${conf.fullActs.map(generateQuickButtonHTML).join('\n')}</div>`;

      const subFormOuter = () => this.#formEl(this.#generateSelectorByFieldID(conf.subFormID));
      const subFormInner = () => subFormOuter().querySelector('div.fx-subform');
      const subFormEl = (selector) => subFormOuter().querySelector(selector);
      const getLastRowDOM = () => {
        return subFormInner().querySelector('.fx-subform-row:last-child');
      };
      const subFormField2React = (field, lastRow) => {
        if (this.#isValidFieldID(conf.fields[field])) field = conf.fields[field];
        if (!this.#isValidFieldID(field)) return;
        const fieldElement = lastRow.querySelector(this.#generateSelectorByFieldID(field));
        return this.#findReact(fieldElement);
      };
      const addNewRecordIfNeed = (fields = conf.notNullFields) => {
        const lastRow = getLastRowDOM();
        if (!lastRow) return this.#clickButton(subFormEl('button.btn-add'));
        const isNotEmpty = fields.map(f => subFormField2React(f, lastRow)).reduce((a, c) => a + c.linkValue.length, 0);
        if (isNotEmpty > 0) return this.#clickButton(subFormEl('button.btn-add'));
      };
      const fullFillValue = (field, value, lastRow, count = 5) => {
        if (count === 0) return;
        const fieldReact = subFormField2React(field, lastRow);
        if (!fieldReact) setTimeout(() => fullFillValue(field, value, lastRow, --count), 3000 - 500 * count);
        return this.#setFieldValue(fieldReact, value);
      };
      const appendRecord = (name) => {
        addNewRecordIfNeed();
        const act = conf.fullActs.find(act => act.name === name);
        if (!act) return;
        const lastRow = getLastRowDOM();
        Object.entries(act.values).forEach(field => fullFillValue(field[0], field[1], lastRow));
      };
      const listeners = conf.fullActs.map(act => {
        return {
          selector: `button.x-button[title="${act.name}"]`,
          event: 'click',
          callback: (el) => {
            const buttonEl = el.target.querySelector('button.x-quick-button') || el.target.closest('button.x-quick-button');
            appendRecord(buttonEl.attributes['title'].value);
          }
        };
      });

      this.#form.on(this.#generateSelectorByFieldID(conf.subFormID), (el) => {
        new InjectHTMLContent(el.querySelector('.field-component'), 'beforeBegin', quickButtonRowHTML, conf.css, listeners);
      });
      return;
    }

    set enableHighlightSameValueRow(args) {
      const mouseOverHightHandler = (zEvent) => {
        [...this.#formEl().querySelectorAll('td')].forEach(el => el.style.background = '');
        navigator.clipboard.readText().then(text => {
          if (!text.match(/^[\d\s]+$/)) return;
          const qq = text.trim();
          const tds = [...document.querySelectorAll(`td[title="${qq}"]`)];
          const rowIds = tds.map(td => td.parentNode.attributes['data-row-id'].value);
          rowIds.forEach(id => {
            [...document.querySelectorAll(`tr[data-row-id="${id}"] td`)].forEach(el => el.style.background = args);
          });
        });
      };
      mouseOverHightHandler();

    }

  }

  class ShortcutBase { }
  new ShortcutBase();


  let mainActivator = new AppFormActivator();
  mainActivator.add('汇才技术支持__新一线问题录入', '60938fa200e1dd000896e8cb', '620f4b73dbe54000078f6ad1', () => {
    const exec = new FormExecutor();
    exec.enablePasteQQorPhoneNumber = { fieldID: '_widget_1620283733927' };
    exec.enableSubFormQuickAction = {
      subFormID: '_widget_1620283734006',
      fields: {
        '标签': '_widget_1620283734024',
        '问题描述': '_widget_1620283734122',
        '解决方案': '_widget_1620283734187',
        '解决状态': '_widget_1620283734281',
        'uuid': '_widget_1620283734456',
        'BI难度分类': '_widget_1644896662618',
        'FR功能模块': '_widget_1644551602964',
        'BI功能模块': '_widget_1644894060377',
        '文档参考情况': '_widget_1622429627329',
        '文档类型': '_widget_1644894060710',
        '是否需补充-数字': '_widget_1645171117822',
        '问题功能模块': '_widget_1645176937190'
      },
      notNullFields: ['问题描述', '解决方案'],
      actions: [{
        name: '需求未参考', style: 1,
        values: { 标签: 'fr需求方案类问题', 解决状态: '已解决', 文档参考情况: '未参考且无需文档', },
      }, {
        name: '异常未参考', style: 1,
        values: { 标签: 'fr异常报错类问题', 解决状态: '已解决', 文档参考情况: '未参考且无需文档', },
      }, {
        name: '需求参考', style: 1,
        values: { 标签: 'fr需求方案类问题', 解决状态: '已解决', 文档参考情况: '文档协助解决', },
      }, {
        name: '异常参考', style: 1,
        values: { 标签: 'fr异常报错类问题', 解决状态: '已解决', 文档参考情况: '文档协助解决', },
      }, {
        name: '授权', style: 1,
        values: { 标签: '授权申请', 问题描述: '申请临时授权', 解决方案: '销售同意已发', },
      }, {
        name: '过期', style: 1,
        values: { 标签: '过期无效客户问题', 解决状态: '未解决', },
      }, {
        name: '需求待补充', style: 1,
        values: { 标签: 'fr需求方案类问题', 解决状态: '已解决', 文档参考情况: '需补充/优化文档', },
      }, {
        name: '异常待补充', style: 1,
        values: { 标签: 'fr异常报错类问题', 解决状态: '已解决', 文档参考情况: '需补充/优化文档', },
      },]
    };
    return exec;
  });

  mainActivator.start();

})();