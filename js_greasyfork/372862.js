// ==UserScript==
// @name        libReplaceText
// @namespace   https://github.com/lzghzr/TampermonkeyJS
// @version     0.0.8
// @author      lzghzr
// @description 替换网页内文本, 达到本地化的目的
// @match       *://*/*
// @license     MIT
// @grant       none
// @run-at      document-start
// ==/UserScript==
class ReplaceText {
  constructor(i18n, mode = 'equal') {
    const i18nMap = new Map(i18n);
    const i18nArr = i18n.map(value => value[0]);
    if (mode === 'regexp') {
      this.textReplace = (text) => {
        if (i18nMap.has(text))
          text = i18nMap.get(text);
        else {
          const key = i18nArr.find(key => (key instanceof RegExp && text.match(key) !== null));
          if (key !== undefined)
            text = text.replace(key, i18nMap.get(key));
        }
        return text;
      };
    }
    else if (mode === 'match') {
      this.textReplace = (text) => {
        const key = i18nArr.find(key => (text.match(key) !== null));
        if (key !== undefined)
          text = text.replace(key, i18nMap.get(key));
        return text;
      };
    }
    else {
      this.textReplace = (text) => {
        if (i18nMap.has(text))
          text = i18nMap.get(text);
        return text;
      };
    }
    this.replaceAlert();
    this.replaceObserver();
  }
  W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
  done = new Set();
  alert = this.W.alert.bind(this.W);
  confirm = this.W.confirm.bind(this.W);
  prompt = this.W.prompt.bind(this.W);
  textReplace;
  replaceAlert() {
    this.W.alert = (message) => this.alert(this.textReplace(message));
    this.W.confirm = (message) => this.confirm(this.textReplace(message));
    this.W.prompt = (message, _default) => this.prompt(this.textReplace(message), _default);
  }
  replaceNode(node, self = false) {
    const list = this.getReplaceList(node, self);
    for (let index in list) {
      list[index].forEach(node => {
        if (this.done.has(node[index]))
          return;
        const newText = this.textReplace(node[index]);
        if (node[index] !== newText) {
          this.done.add(newText);
          node[index] = newText;
        }
      });
    }
  }
  replaceObserver() {
    const observerOptions = { attributes: true, characterData: true, childList: true, subtree: true };
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' || mutation.type === 'characterData')
          this.replaceNode(mutation.target, true);
        else if (mutation.type === 'childList')
          mutation.addedNodes.forEach(addedNode => this.replaceNode(addedNode));
      });
    });
    document.addEventListener('readystatechange', () => {
      observer.observe(document.body, observerOptions);
      this.replaceNode(document.body);
    }, { capture: true, once: true });
    Element.prototype.attachShadow = new Proxy(Element.prototype.attachShadow, {
      apply: function (target, _this, args) {
        const shadowRoot = Reflect.apply(target, _this, args);
        if (shadowRoot !== null)
          observer.observe(shadowRoot, observerOptions);
        return shadowRoot;
      }
    });
  }
  getReplaceList(node, self = false) {
    const list = {
      data: new Set(),
      placeholder: new Set(),
      title: new Set(),
      value: new Set(),
    };
    const nodeList = self ? [node] : this.flattenNode(node);
    nodeList.forEach(node => {
      if (node.parentElement instanceof HTMLScriptElement || node.parentElement instanceof HTMLStyleElement)
        return;
      if (node instanceof HTMLElement && node.title !== '')
        list.title.add(node);
      if (node instanceof HTMLInputElement && ['button', 'reset', 'submit'].includes(node.type) && node.value !== '')
        list.value.add(node);
      else if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement && node.placeholder !== '')
        list.placeholder.add(node);
      else if (node instanceof Text)
        list.data.add(node);
    });
    return list;
  }
  flattenNode(node) {
    const nodeList = [];
    const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ALL);
    do {
      nodeList.push(treeWalker.currentNode);
    } while (treeWalker.nextNode());
    return nodeList;
  }
}