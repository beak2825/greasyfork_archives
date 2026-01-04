// ==UserScript==
// @name                 Danmaku replace
// @name:zh-CN           弹幕替换器
// @namespace            https://github.com/TZFC/Danmaku-replace
// @version              5.1
// @description          Replace chosen substrings in outgoing Bilibili live-chat messages before they are sent.
// @description:zh-CN    在发送前替换哔哩哔哩直播弹幕中的指定字符串。
// @author               TZFC
// @match                https://live.bilibili.com/*
// @icon                 https://www.bilibili.com/favicon.ico
// @run-at               document-start
// @grant                none
// @license              GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/542478/Danmaku%20replace.user.js
// @updateURL https://update.greasyfork.org/scripts/542478/Danmaku%20replace.meta.js
// ==/UserScript==


(() => {
  /* ────────────────────────────── SETTINGS ────────────────────────────── */
  const originals = ['包子', '男娘','蓝凉','之交','抖音','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', '川普', '扣扣','胖次','我的名字','比基尼','丑','喷水','出','扶她','大大','插一下','念经','舔','榜','看我','动态','1','2','3','4','5','6','7','8','9','0','面基','榜一'];
  const targets   = ['包了', '侽娘','侽娘','Z交' ,'枓音','ａ','ｂ','ｃ','ｄ','ｅ','ｆ','ｇ','ｈ','ｉ','ｊ','ｋ','ｌ','ｍ','ｎ','ｏ','ｐ','ｑ','ｒ','ｓ','ｔ','ｕ','ｖ','ｗ','ｘ','ｙ','ｚ','Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ','Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ', '川晋', '扣.扣','胖㳄','我の名字','此基尼','吜','喷氺','岀','扶他','大太','插1下','念泾','㖭','搒','着我','动.态', '１','２','３','４','５','６','７','８','９','０','面箕','榜𝟷'];

  if (originals.length !== targets.length) {
    console.error('[Keyword Replacer] Array length mismatch!');
    return;
  }

  /* ───────────────────────── PRECOMPUTE LOOKUPS ───────────────────────── */
  const send_path = '/msg/send';

  let default_deco_left  = localStorage.getItem('deco_left')  || '';
  let default_deco_right = localStorage.getItem('deco_right') || '';

  function escape_regex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Single compiled alternation regex
  const replace_regex = new RegExp(`(${originals.map(escape_regex).join('|')})`, 'g');

  // O(1) mapping for replacements
  const replace_map = new Map();
  for (let i = 0; i < originals.length; i++) {
    replace_map.set(originals[i], targets[i]);
  }

  /* ───────────────────────────── TRANSFORM ────────────────────────────── */
  function transform_msg(input) {
    let content = input;

    // fast prefix routing by first two characters
    const p0 = input.charCodeAt(0);
    const p1 = input.charCodeAt(1);

    // "#s "
    if (p0 === 0x23 && p1 === 0x73 && input.charCodeAt(2) === 0x20) {
      const body = input.slice(3);
      // collapse spaces to ♫, then insert ♪ between consecutive non-alnum runs
      content = body.replace(/\s+/g, '♫').replace(/([^a-zA-Z0-9])(?=[^a-zA-Z0-9])/g, '$1♪');
    }
    // "#c "
    else if (p0 === 0x23 && p1 === 0x63 && input.charCodeAt(2) === 0x20) {
      content = '⚞' + input.slice(3) + '⚟';
    }
    // "#f "
    else if (p0 === 0x23 && p1 === 0x66 && input.charCodeAt(2) === 0x20) {
      content = '꧁' + input.slice(3) + '꧂';
    }
    // "!d " commands
    else if (p0 === 0x21 && p1 === 0x64 && input.charCodeAt(2) === 0x20) {
      const cmd = input.slice(3).trim();
      if (cmd === 'c') {
        default_deco_left = '⚞'; default_deco_right = '⚟';
      } else if (cmd === 'f') {
        default_deco_left = '꧁'; default_deco_right = '꧂';
      } else if (cmd === 'x') {
        default_deco_left = '';   default_deco_right = '';
      }
      localStorage.setItem('deco_left',  default_deco_left);
      localStorage.setItem('deco_right', default_deco_right);
      return ''; // command messages are not sent
    }

    // quick rejection: if no possible match substring exists, skip replace call
    if (replace_regex.test(content)) {
      // reset lastIndex because .test with /g/ advances it
      replace_regex.lastIndex = 0;
      content = content.replace(replace_regex, (m) => replace_map.get(m));
    }

    return default_deco_left + content + default_deco_right;
  }

  /* ──────────────────────────── HELPERS ──────────────────────────── */
  function same_endpoint(url_like) {
    const url = typeof url_like === 'string' ? url_like : '';
    try {
      return new URL(url, location.origin).pathname.endsWith(send_path);
    } catch {
      return false;
    }
  }

  function patched_body(body) {
    // only handle FormData; do not attempt to support other types
    // this follows "do not handle malformed nor null input"
    if (!(body instanceof FormData)) return body;
    if (typeof body.has === 'function' && body.has('emoticonOptions')) return body;

    const msg = body.get('msg');
    if (msg) body.set('msg', transform_msg(msg));
    return body;
  }

  /* ───────────────────────────── fetch HOOK ───────────────────────────── */
  const native_fetch = window.fetch;
  window.fetch = function patched_fetch(input, init) {
    // Normalize to url string
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (!same_endpoint(url)) {
      return native_fetch.call(this, input, init);
    }

    // If init with FormData body
    if (init && init.body) {
      const new_body = patched_body(init.body);
      if (new_body !== init.body) {
        init = { ...init, body: new_body };
      }
      return native_fetch.call(this, input, init);
    }

    // If Request instance with body
    if (input instanceof Request) {
      const req = input;
      // Create a derived Request with patched body (POST chat send path)
      const derived = new Request(req, { body: patched_body(req.body) });
      return native_fetch.call(this, derived);
    }

    return native_fetch.call(this, input, init);
  };

  /* ─────────────────────── XMLHttpRequest HOOK ─────────────────────── */
  const XHR_OPEN = XMLHttpRequest.prototype.open;
  const XHR_SEND = XMLHttpRequest.prototype.send;
  const FLAG_PATCH = Symbol('patch_me');

  XMLHttpRequest.prototype.open = function open(method, url, ...rest) {
    this[FLAG_PATCH] = same_endpoint(url);
    return XHR_OPEN.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function send(body) {
    if (this[FLAG_PATCH]) {
      body = patched_body(body);
    }
    return XHR_SEND.call(this, body);
  };
})();
