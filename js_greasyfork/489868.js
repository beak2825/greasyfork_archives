// ==UserScript==
// @name           HV Utils URL CN
// @namespace      HVUT
// @homepageURL    https://forums.e-hentai.org/index.php?showtopic=211883
// @supportURL     https://forums.e-hentai.org/index.php?showtopic=211883
// @version        1.3.0
// @date           2023-12-31
// @author         sssss2
// @description    zh-cn
// @match          *://*.hentaiverse.org/?s=Battle
// @match          *://*.hentaiverse.org/isekai/?s=Battle
// @connect        hentaiverse.org
// @connect        e-hentai.org
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/489868/HV%20Utils%20URL%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/489868/HV%20Utils%20URL%20CN.meta.js
// ==/UserScript==

var settings = {

  randomEncounter: true, // 随机遭遇通知
  reBeep: { volume: 0.2, frequency: 500, time: 0.5, delay: 1 }, // 当随机遭遇准备就绪时发出蜂鸣声；将音量设置为 0 以禁用
  reBattleCSS: 'top: 10px; left: 600px; position: absolute; cursor: pointer; font-size: 10pt; font-weight: bold;', // 修改顶部和左侧以定位计时器
  ajaxRound: true, // 支持 Monsterbation

};

/* eslint-disable arrow-spacing, block-spacing, comma-spacing, key-spacing, keyword-spacing, object-curly-spacing, space-before-blocks, space-before-function-paren, space-infix-ops, semi-spacing */
function $id(id, d) {return (d || document).getElementById(id);}
function $doc(h) {const d = document.implementation.createHTMLDocument(''); d.documentElement.innerHTML = h; return d;}
function $element(t, p, a, f) {let e; if (t) {e = document.createElement(t);} else if (t === '') {e = document.createTextNode(a); a = null;} else {return document.createDocumentFragment();} if (a !== null && a !== undefined) {function ao(e, a) {Object.entries(a).forEach(([an, av]) => {if (typeof av === 'object') {let a; if (an in e) {a = e[an];} else {e[an] = {}; a = e[an];} Object.entries(av).forEach(([an, av]) => {a[an] = av;});} else {if (an === 'style') {e.style.cssText = av;} else if (an in e) {e[an] = av;} else {e.setAttribute(an, av);}}});} function as(e, a) {const an = {'#': 'id', '.': 'className', '!': 'style', '/': 'innerHTML'}[a[0]]; if (an) {e[an] = a.slice(1);} else if (a !== '') {e.textContent = a;}} if (typeof a === 'string' || typeof a === 'number') {e.textContent = a;} else if (Array.isArray(a)) {a.forEach((a) => {if (typeof a === 'string' || typeof a === 'number') {as(e, a);} else if (typeof a === 'object') {ao(e, a);}});} else if (typeof a === 'object') {ao(e, a);}} if (f) {if (typeof f === 'function') {e.addEventListener('click', f);} else if (typeof f === 'object') {Object.entries(f).forEach(([ft, fl]) => {e.addEventListener(ft, fl);});}} if (p) {if (p.nodeType === 1 || p.nodeType === 11) {p.appendChild(e);} else if (Array.isArray(p)) {if (['beforebegin', 'afterbegin', 'beforeend', 'afterend'].includes(p[1])) {p[0].insertAdjacentElement(p[1], e);} else if (!isNaN(p[1])) {p[0].insertBefore(e, p[0].childNodes[p[1]]);} else {p[0].insertBefore(e, p[1]);}}} return e;}
function time_format(t, o) {t = Math.floor(t / 1000); const h = Math.floor(t / 3600).toString().padStart(2, '0'); const m = Math.floor(t % 3600 / 60).toString().padStart(2, '0'); const s = (t % 60).toString().padStart(2, '0'); return !o ? `${h}:${m}:${s}` : o === 1 ? `${h}:${m}` : o === 2 ? `${m}:${s}` : '';}
function play_beep(s = { volume: 0.2, frequency: 500, time: 0.5, delay: 1 }) {if (!s.volume) {return;} const c = new window.AudioContext(); const o = c.createOscillator(); const g = c.createGain(); o.type = 'sine'; o.frequency.value = s.frequency; g.gain.value = s.volume; o.connect(g); g.connect(c.destination); o.start(s.delay); o.stop(s.delay + s.time);}
function popup(t, s) {function r(e) {e.preventDefault(); e.stopImmediatePropagation(); if (e.which === 1 || e.which === 13 || e.which === 27 || e.which === 32) {w.remove(); document.removeEventListener('keydown', r);}} const w = $element('div', document.body, ['!position:fixed;top:0;left:0;width:1236px;height:702px;padding:3px 100% 100% 3px;background-color:#0006;z-index:1001;cursor:pointer;display:flex;justify-content:center;align-items:center;'], r); const d = $element('div', w, ['/' + t, '!min-width:400px;min-height:100px;max-width:100%;max-height:100%;padding:10px;background-color:#fff;border:1px solid;display:flex;flex-direction:column;justify-content:center;font-size:10pt;color:#333;' + (s || '')]); document.addEventListener('keydown', r); return d;}

function getValue(k, d, p = _ns + '_') {const v = localStorage.getItem(p + k); return v === null ? d : JSON.parse(v);}
function setValue(k, v, p = _ns + '_', r) {localStorage.setItem(p + k, JSON.stringify(v, r));}
/* eslint-enable */

var _ns = 'hvut';
var _isekai = location.pathname.includes('/isekai/');
if (_isekai) {
  _ns = 'hvuti';
  _isekai = /(\d+ Season \d+)/.exec($id('world_text')?.textContent) ? RegExp.$1 : '1';
}

// AJAX
var $ajax = {

  interval: 300, // 不要减少此数字，否则可能触发服务器的限制器，导致您被禁止
  max: 4,
  tid: null,
  conn: 0,
  index: 0,
  queue: [],

  fetch: function (url, data, method, context = {}, headers = {}) {
    return new Promise((resolve, reject) => {
      $ajax.add(method, url, data, resolve, reject, context, headers);
    });
  },
  repeat: function (count, func, ...args) {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(func(...args));
    }
    return list;
  },
  add: function (method, url, data, onload, onerror, context = {}, headers = {}) {
    if (!data) {
      method = 'GET';
    } else if (!method) {
      method = 'POST';
    }
    if (method === 'POST') {
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      if (data && typeof data === 'object') {
        data = Object.entries(data).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
      }
    } else if (method === 'JSON') {
      method = 'POST';
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      if (data && typeof data === 'object') {
        data = JSON.stringify(data);
      }
    }
    context.onload = onload;
    context.onerror = onerror;
    $ajax.queue.push({ method, url, data, headers, context, onload: $ajax.onload, onerror: $ajax.onerror });
    $ajax.next();
  },
  next: function () {
    if (!$ajax.queue[$ajax.index] || $ajax.error) {
      return;
    }
    if ($ajax.tid) {
      if (!$ajax.conn) {
        clearTimeout($ajax.tid);
        $ajax.timer();
        $ajax.send();
      }
    } else {
      if ($ajax.conn < $ajax.max) {
        $ajax.timer();
        $ajax.send();
      }
    }
  },
  timer: function () {
    $ajax.tid = setTimeout(() => {
      $ajax.tid = null;
      $ajax.next();
    }, $ajax.interval);
  },
  send: function () {
    GM_xmlhttpRequest($ajax.queue[$ajax.index]);
    $ajax.index++;
    $ajax.conn++;
  },
  onload: function (r) {
    $ajax.conn--;
    const text = r.responseText;
    if (r.status !== 200) {
      $ajax.error = `${r.status} ${r.statusText}: ${r.finalUrl}`;
      r.context.onerror?.();
    } else if (text === 'state lock limiter in effect') {
      if ($ajax.error !== text) {
        popup(`<p style="color: #f00; font-weight: bold;">${text}</p><p>Your connection speed is so fast that <br>you have reached the maximum connection limit.</p><p>Try again later.</p>`);
      }
      $ajax.error = text;
      r.context.onerror?.();
    } else {
      r.context.onload?.(text);
      $ajax.next();
    }
  },
  onerror: function (r) {
    $ajax.conn--;
    $ajax.error = `${r.status} ${r.statusText}: ${r.finalUrl}`;
    r.context.onerror?.();
    $ajax.next();
  },

};

// RANDOM ENCOUNTER
var $re = {

  init: function () {
    if ($re.inited) {
      return;
    }
    $re.inited = true;
    $re.type = (!location.hostname.includes('hentaiverse.org') || _isekai) ? 0 : $id('navbar') ? 1 : $id('battle_top') ? 2 : false;
    $re.get();
  },
  get: function () {
    $re.json = getValue('re', { date: 0, key: '', count: 0, clear: true }, 'hvut_');
    const gm_json = JSON.parse(GM_getValue('re', null)) || { date: -1 };
    if ($re.json.date === gm_json.date) {
      if ($re.json.clear !== gm_json.clear) {
        $re.json.clear = true;
        $re.set();
      }
    } else {
      if ($re.json.date < gm_json.date) {
        $re.json = gm_json;
      }
      $re.set();
    }
  },
  set: function () {
    setValue('re', $re.json, 'hvut_');
    GM_setValue('re', JSON.stringify($re.json));
  },
  reset: function () {
    $re.json.date = Date.now();
    $re.json.count = 0;
    $re.json.clear = true;
    $re.set();
    $re.start();
  },
  check: function () {
    $re.init();
    if (/\?s=Battle&ss=ba&encounter=([A-Za-z0-9=]+)(?:&date=(\d+))?/.test(location.search)) {
      const key = RegExp.$1;
      const date = parseInt(RegExp.$2);
      const now = Date.now();
      if ($re.json.key === key) {
        if (!$re.json.clear) {
          $re.json.clear = true;
          $re.set();
        }
      } else if (date) {
        if ($re.json.date < date) {
          $re.json.date = date;
          $re.json.key = key;
          $re.json.count++;
          $re.json.clear = true;
          $re.set();
        }
      } else if ($re.json.date + 1800000 < now) {
        $re.json.date = now;
        $re.json.key = key;
        $re.json.count++;
        $re.json.clear = true;
        $re.set();
      }
    }
  },
  clock: function (button) {
    $re.init();
    $re.button = button;
    $re.button.addEventListener('click', (e) => { $re.run(e.ctrlKey || e.shiftKey); });
    const date = new Date($re.json.date);
    const now = new Date();
    if (date.getUTCDate() !== now.getUTCDate() || date.getUTCMonth() !== now.getUTCMonth() || date.getUTCFullYear() !== now.getUTCFullYear()) {
      $re.reset();
      $re.load();
    }
    $re.check();
    $re.start();
  },
  refresh: function () {
    const remain = $re.json.date + 1800000 - Date.now();
    if (remain > 0) {
      $re.button.textContent = time_format(remain, 2) + ` [${$re.json.count}]`;
      $re.beep = true;
    } else {
      $re.button.textContent = (!$re.json.clear ? 'Expired' : 'Ready') + ` [${$re.json.count}]`;
      if ($re.beep) {
        $re.beep = false;
        play_beep(settings.reBeep);
      }
      $re.stop();
    }
  },
  run: async function (engage) {
    if ($re.type === 2) {
      $re.load();
    } else if ($re.type === 1) {
      if (!$re.json.clear || engage) {
        $re.engage();
      } else {
        $re.load(true);
      }
    } else if ($re.type === 0) {
      $re.stop();
      $re.button.textContent = 'Checking...';
      const html = await $ajax.fetch('https://hentaiverse.org/');
      if (html.includes('<div id="navbar">')) {
        if (!$re.json.clear || engage) {
          $re.engage();
        } else {
          $re.load(true);
        }
      } else {
        $re.load();
      }
    }
  },
  load: async function (engage) {
    $re.stop();
    $re.get();
    $re.button.textContent = 'Loading...';
    const html = await $ajax.fetch('https://e-hentai.org/news.php');
    const doc = $doc(html);
    const eventpane = $id('eventpane', doc);
    if (eventpane && /\?s=Battle&amp;ss=ba&amp;encounter=([A-Za-z0-9=]+)/.test(eventpane.innerHTML)) {
      $re.json.date = Date.now();
      $re.json.key = RegExp.$1;
      $re.json.count++;
      $re.json.clear = false;
      $re.set();
      if (engage) {
        $re.engage();
        return;
      }
    } else if (eventpane && /It is the dawn of a new day/.test(eventpane.innerHTML)) {
      popup(eventpane.innerHTML);
      $re.reset();
    } else {
      popup('Failed to get a new Random Encounter key');
    }
    $re.start();
  },
  engage: function () {
    if (!$re.json.key) {
      return;
    }
    const href = `?s=Battle&ss=ba&encounter=${$re.json.key}&date=${$re.json.date}`;
    if ($re.type === 2) {
      return;
    } else if ($re.type === 1) {
      location.href = href;
    } else if ($re.type === 0) {
      window.open((settings.reGalleryAlt ? 'http://alt.hentaiverse.org/' : 'https://hentaiverse.org/') + href, '_blank');
      $re.json.clear = true;
      $re.start();
    }
  },
  start: function () {
    $re.stop();
    if (!$re.json.clear) {
      $re.button.style.color = '#e00';
    } else {
      $re.button.style.color = '';
    }
    $re.tid = setInterval($re.refresh, 1000);
    $re.refresh();
  },
  stop: function () {
    if ($re.tid) {
      clearInterval($re.tid);
      $re.tid = 0;
    }
  },

};

// BATTLE
if ($id('battle_top')) {
  if (settings.randomEncounter) {
    if ($id('textlog').tBodies[0].lastElementChild.textContent === 'Initializing random encounter ...') {
      $re.check();
    }
    const button = $element('div', $id('csp'), ['RE', '!' + (settings.reBattleCSS || 'position: absolute; top: 0px; left: 0px; cursor: pointer;')]);
    $re.clock(button);
    if (settings.ajaxRound) {
      (new MutationObserver(() => { if (!button.parentNode.parentNode && $id('csp')) { $id('csp').appendChild(button); }$re.start(); })).observe(document.body, { childList: true });
    }
  }
} else if ($id('navbar')) {
  const url = getValue('url', '.');
  location.href = url.endsWith('/?s=Battle') ? '.' : url;
}
