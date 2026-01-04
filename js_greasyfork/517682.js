// ==UserScript==
// @name        BiliBili User Custom Name
// @namespace   _s7util__
// @description 自定义bilibili用户名（仅本地生效）
// @match       https://space.bilibili.com/*
// @match       https://www.bilibili.com/*
// @match       https://search.bilibili.com/*
// @grant       none
// @version     1.0.0
// @author      shc0743
// @license     GPL-3.0
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/517682/BiliBili%20User%20Custom%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/517682/BiliBili%20User%20Custom%20Name.meta.js
// ==/UserScript==

(async function () {

  // loader-mapping
  const mapping = {
    'https://space.bilibili.com/': fnPersonSpace,
    'https://www.bilibili.com/video/': fnVideoPage,
    'https://www.bilibili.com/blackboard/': fnNop,
    'https://www.bilibili.com/v/': fnNop,
    'https://www.bilibili.com/anime/': fnNop,
    'https://www.bilibili.com/match/': fnNop,
    'https://www.bilibili.com/': fnMainSite,
    'https://search.bilibili.com/': fnSearchSite,
  };
  // loader
  const url = location.href;
  let ret = 0;
  for (const i in mapping) {
    if (url.startsWith(i)) {
      ret = mapping[i].call(this, url);
      break;
    }
  }
  return ret;
  // loader end

  // utility start
  function getCustomName(name, def = ''){
    if (def === '') def = name
    return GM_getValue(name, def)
  }
  function setCustomName(name, value = null){
    if (!value) return GM_deleteValue(name)
    return GM_setValue(name, value)
  }
  // utility end


  function fnNop () {}
  function fnPersonSpace (){
    const m = createMutation();
    m.config(['.fans-name', '.idc-uname']);


    const el = document.getElementById('h-name');
    if (!el || !el.innerText) return setTimeout(fnPersonSpace, 1000)
    el.dataset.originalName = el.innerText
    el.addEventListener('dblclick', () => {
      const dlg = document.createElement('dialog')
      const inp = document.createElement('input')
      inp.value = el.innerText
      inp.setAttribute('style', 'padding: 10px; font-size: large; width: 400px; height: 1em;')
      inp.onblur = () => dlg.close();
      inp.onkeydown = (ev) => {
        if (ev.key === 'Escape') inp.value = ''
        if (ev.key === 'Enter') inp.blur()
      }
      dlg.onclose = () => {
        setCustomName(el.dataset.originalName, inp.value)
        el.innerText = inp.value || el.dataset.originalName
        dlg.remove()
      }
      dlg.append(inp)
      document.body.append(dlg)
      dlg.showModal()
    })
    el.innerText = getCustomName(el.dataset.originalName)
  }
  function fnVideoPage (){
    const m = createMutation()
    m.config(['.up-name']);

// TODO
  }
  function fnMainSite (){
    const m = createMutation()
    m.config(['.up-info-container .up-name', '.bili-video-card__info--author']);

// TODO
  }
  function fnSearchSite() {
    const m = createMutation()
    m.config(['.bili-video-card__info--author']);
    // TODO
  }

  function createMutation(el = document.documentElement) {
    // TODO: 处理shadow DOM树
    const config = {
      selectors: [],
    };
    let queued = false;
    function queueFn() {
      queued = false;
      o.disconnect();

      // main
      const allSelectors =config.selectors.join(',');
      const roots = [document] // 处理shadowDOM需递归，考虑将主体部分提到单独函数
      for (const root of roots) {
        const els = root.querySelectorAll(allSelectors);
        for (const el of els) {
          if (el && el.__bucn_count__ && el.__bucn_count__ > 10) continue;
          el.__bucn_count__ = (el.__bucn_count__ || 0) + 1;

          const n = getCustomName(el.innerText);
          if (n) el.innerText = n;
        }
      }

      o.observe(el, { attributes: true, childList: true, subtree: true });
    }
	  const o = new MutationObserver(function (mutationsList, observer) {
      //for (const i of mutationsList) {
        //const el = i.target;
        //if (el && el.__bucn_count__ && el.__bucn_count__ > 10) continue;
        //el.__bucn_count__ = (el.__bucn_count__ || 0) + 1;
      //}
      if (queued) return;
      queueMicrotask(queueFn)
      queued = true;
    });
    o.config = function (args) {
      for(const  i of args) {
        /*if (i.startsWith('#')) config.ids.push(i.substring(1));
        else if (i.startsWith('.')) config.ids.push(i.substring(1));*/
        config.selectors.push(i)
      }
    }
    o.observe(el, { attributes: true, childList: true, subtree: true });
	  return o;
  }

}())

