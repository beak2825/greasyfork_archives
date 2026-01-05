// ==UserScript==
// @name translator
// @namespace https://lufei.so
// @supportURL https://github.com/intellilab/translator.user.js
// @description 划词翻译
// @version 1.6.8
// @run-at document-start
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @require https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@1,npm/@violentmonkey/ui@0.4
// @include *
// @downloadURL https://update.greasyfork.org/scripts/21050/translator.user.js
// @updateURL https://update.greasyfork.org/scripts/21050/translator.meta.js
// ==/UserScript==

(function () {
'use strict';

function dumpQuery(query) {
  return Object.entries(query).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}
function request({
  method = 'GET',
  url,
  params,
  responseType,
  data,
  headers
}) {
  return new Promise((resolve, reject) => {
    if (params) {
      const sep = url.includes('?') ? '&' : '?';
      url += sep + dumpQuery(params);
    }

    GM_xmlhttpRequest({
      method,
      url,
      responseType,
      data,
      headers,

      onload(res) {
        if (res.status >= 300) return reject();
        resolve(res.response);
      },

      onerror: reject
    });
  });
}

const provider = {
  name: 'youdao',
  handle: async text => {
    const payload = {
      type: 'data',
      doctype: 'json',
      version: '1.1',
      relatedUrl: 'http://fanyi.youdao.com/',
      keyfrom: 'fanyiweb',
      key: null,
      translate: 'on',
      q: text,
      ts: Date.now()
    };
    const result = await request({
      url: 'https://fanyi.youdao.com/openapi.do',
      params: payload,
      responseType: 'json'
    });
    if (result.errorCode) throw result;
    const {
      basic,
      query,
      translation
    } = result;

    if (basic) {
      const noPhonetic = '&hearts;';
      const {
        explains,
        'us-phonetic': us,
        'uk-phonetic': uk
      } = basic;
      return {
        query,
        phonetic: [{
          html: `UK: [${uk || noPhonetic}]`,
          url: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(query)}&type=1`
        }, {
          html: `US: [${us || noPhonetic}]`,
          url: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(query)}&type=2`
        }],
        explains,
        detailUrl: `http://dict.youdao.com/search?q=${encodeURIComponent(query)}`
      };
    }

    if (translation != null && translation[0]) {
      return {
        translations: translation
      };
    }
  }
};

const LANG_EN = 'en';
const LANG_ZH_HANS = 'zh-Hans';

async function translate(text, to) {
  const [data] = await request({
    method: 'POST',
    url: 'https://cn.bing.com/ttranslatev3',
    responseType: 'json',
    data: dumpQuery({
      fromLang: 'auto-detect',
      to,
      text
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const {
    detectedLanguage,
    translations
  } = data;
  return {
    language: {
      from: detectedLanguage.language,
      to
    },
    translations: translations.map(item => item.text)
  };
}

const provider$1 = {
  name: 'bing',
  handle: async source => {
    let data = await translate(source, LANG_ZH_HANS);
    if (data.language.from === LANG_ZH_HANS) data = await translate(source, LANG_EN);
    return data;
  }
};

const LANG_EN$1 = 'en';
const LANG_ZH_CN = 'zh-CN';

async function translate$1(text, to) {
  var _data$;

  const data = await request({
    url: 'https://translate.google.cn/translate_a/single',
    params: {
      q: text,
      client: 'gtx',
      sl: 'auto',
      tl: to,
      dt: 'at'
    },
    responseType: 'json'
  });
  const language = {
    from: data[8][0][0],
    to
  };
  const translations = (_data$ = data[5]) == null ? void 0 : _data$.map(item => {
    var _item$, _item$$;

    return (_item$ = item[2]) == null ? void 0 : (_item$$ = _item$[0]) == null ? void 0 : _item$$[0];
  }).filter(Boolean);
  return {
    language,
    translations
  };
}

const provider$2 = {
  name: 'google',
  handle: async source => {
    let data = await translate$1(source, LANG_ZH_CN);
    if (data.language.from === LANG_ZH_CN) data = await translate$1(source, LANG_EN$1);
    return data;
  }
};

var styles = {"link":"style-module_link__YVV7m","section":"style-module_section__1Eiq1","block-top":"style-module_block__1NZsy","block-bottom":"style-module_block__1NZsy","label":"style-module_label__JD9KX","content":"style-module_content__1MvKK","phonetic":"style-module_phonetic__2SIsx","item":"style-module_item__2QPXK"};
var stylesheet=":host .style-module_link__YVV7m{position:relative;color:#7cbef0;cursor:pointer}:host .style-module_link__YVV7m:hover{text-decoration:underline}:host .style-module_section__1Eiq1{display:flex;align-items:flex-start;font-size:12px;line-height:1.2}:host .style-module_section__1Eiq1:not(:first-child){border-top:1px solid #eee}:host .style-module_block__1NZsy{display:block}:host .style-module_label__JD9KX{display:block;margin:8px 8px 8px 0;padding:2px 0;color:#fff;background:#bbb;border-radius:4px;font-size:12px;line-height:1.4;text-transform:uppercase;writing-mode:vertical-rl}:host .style-module_content__1MvKK{flex:1;min-width:0;padding:8px 0}:host .style-module_content__1MvKK>*{display:block}:host .style-module_content__1MvKK>:not(:first-child){margin-top:8px}:host .style-module_phonetic__2SIsx{display:inline-block;margin-left:8px}:host .style-module_item__2QPXK{display:block}:host .style-module_item__2QPXK~.style-module_item__2QPXK{margin-top:8px}";

const React = VM;
let audio;

function play(url) {
  if (!audio) audio = /*#__PURE__*/React.createElement("audio", {
    autoPlay: true
  });
  audio.src = url;
}

function getPlayer(url) {
  return () => {
    play(url);
  };
}

function handleOpenUrl(e) {
  const {
    href
  } = e.target.dataset;
  const a = /*#__PURE__*/React.createElement("a", {
    href: href,
    target: "_blank",
    rel: "noopener noreferrer"
  });
  a.click();
}

function render(results, {
  event,
  panel
}) {
  panel.clear();

  for (const [name, result] of Object.entries(results)) {
    const {
      query,
      phonetic,
      detailUrl,
      explains,
      translations
    } = result;
    panel.append( /*#__PURE__*/React.createElement(panel.id, {
      className: styles.section
    }, /*#__PURE__*/React.createElement(panel.id, {
      className: styles.label
    }, name), /*#__PURE__*/React.createElement(panel.id, {
      className: styles.content
    }, !!(query || phonetic != null && phonetic.length) && /*#__PURE__*/React.createElement(panel.id, {
      className: styles.block
    }, query && /*#__PURE__*/React.createElement(panel.id, null, query), phonetic == null ? void 0 : phonetic.map(({
      html,
      url
    }) => /*#__PURE__*/React.createElement(panel.id, {
      className: `${styles.phonetic} ${styles.link}`,
      dangerouslySetInnerHTML: {
        __html: html
      },
      onClick: getPlayer(url)
    }))), explains && /*#__PURE__*/React.createElement(panel.id, {
      className: styles.block
    }, explains.map(item => /*#__PURE__*/React.createElement(panel.id, {
      className: styles.item,
      dangerouslySetInnerHTML: {
        __html: item
      }
    }))), detailUrl && /*#__PURE__*/React.createElement(panel.id, {
      className: styles.block
    }, /*#__PURE__*/React.createElement(panel.id, {
      className: styles.link,
      "data-href": detailUrl,
      onClick: handleOpenUrl
    }, "\u66F4\u591A...")), translations && /*#__PURE__*/React.createElement(panel.id, {
      className: styles.block
    }, translations.map(item => /*#__PURE__*/React.createElement(panel.id, {
      className: styles.item,
      dangerouslySetInnerHTML: {
        __html: item
      }
    }))))));
  }

  const {
    wrapper
  } = panel;
  const {
    innerWidth,
    innerHeight
  } = window;
  const {
    clientX,
    clientY
  } = event;

  if (clientY > innerHeight * 0.5) {
    wrapper.style.top = 'auto';
    wrapper.style.bottom = `${innerHeight - clientY + 10}px`;
  } else {
    wrapper.style.top = `${clientY + 10}px`;
    wrapper.style.bottom = 'auto';
  }

  if (clientX > innerWidth * 0.5) {
    wrapper.style.left = 'auto';
    wrapper.style.right = `${innerWidth - clientX}px`;
  } else {
    wrapper.style.left = `${clientX}px`;
    wrapper.style.right = 'auto';
  }

  panel.show();
}

const providers = [provider, provider$1, provider$2];
let session;

function translate$2(context) {
  const sel = window.getSelection();
  const text = sel.toString().trim();
  if (/^\s*$/.test(text)) return;
  const {
    activeElement
  } = document;
  if (['input', 'textarea'].indexOf(activeElement.tagName.toLowerCase()) < 0 && !activeElement.contains(sel.getRangeAt(0).startContainer)) return;
  context.source = text;
  const results = {};
  session = results;
  providers.forEach(async provider => {
    const result = await provider.handle(text);
    if (!result || session !== results) return;
    results[provider.name] = result;
    render(results, context);
  });
}

function debounce(func, delay) {
  let timer;

  function exec(...args) {
    timer = null;
    func(...args);
  }

  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(exec, delay, ...args);
  };
}

function initialize() {
  const panel = VM.getPanel({
    css: stylesheet,
    shadow: false
  });
  const panelStyle = panel.body.style;
  panelStyle.maxHeight = '50vh';
  panelStyle.padding = '0 8px';
  panelStyle.overflow = 'auto';
  panelStyle.overscrollBehavior = 'contain';
  const debouncedTranslate = debounce(event => translate$2({
    event,
    panel
  }));
  let isSelecting;
  document.addEventListener('mousedown', e => {
    isSelecting = false;
    if (panel.body.contains(e.target)) return;
    panel.hide();
    session = null;
  }, true);
  document.addEventListener('mousemove', () => {
    isSelecting = true;
  }, true);
  document.addEventListener('mouseup', e => {
    if (panel.body.contains(e.target) || !isSelecting) return;
    debouncedTranslate(e);
  }, true);
  document.addEventListener('dblclick', e => {
    if (panel.body.contains(e.target)) return;
    debouncedTranslate(e);
  }, true);
}

initialize();

}());
