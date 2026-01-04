// ==UserScript==
// @name        Tencent Translator Enhancer
// @name:ja     Tencent Translator Enhancer
// @name:zh-CN  Tencent Translator Enhancer
// @description It brings back-and-forth translation to Tencent Translator (腾讯翻译君).
// @description:ja 騰訊翻訳君(腾讯翻译君)に往復翻訳などの機能を追加します。
// @description:zh-CN 在腾讯翻译君中添加往返翻译等功能。
// @namespace   knoa.jp
// @include     https://fanyi.qq.com/
// @version     1.3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/394150/Tencent%20Translator%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/394150/Tencent%20Translator%20Enhancer.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'TencentTranslatorEnhancer';
  const SCRIPTNAME = 'Tencent Translator Enhancer';
  const DEBUG = false;/*
[update]
Focus on the textarea when the tab got focused. And minor fix.

[bug]

[todo]
ウィンドウフォーカスでテキストエリアにフォーカスだよね
#...を使って外部からテキストの受け渡しができるAPIとか？
しかし現行の自分のChromeアプリに渡せる手段がないような？

[possible]

[research]
効かなくなったら data-selector が付いてるか確認

[memo]
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const LANGUAGES = [/^en/, /^zh/, /^ja/];/* [0] がデフォルト */
  const LABELS = {
    '自动识别':         ['Auto-Detect',          '自动识别',         '自動認識',           ],
    '自动检测':         ['Auto-Detect',          '自动检测',         '自動認識',           ],
    '检测到中文':       ['Chinese detected',     '检测到中文',       '中国語 検出',        ],
    '检测到英语':       ['English detected',     '检测到英语',       '英語 検出',          ],
    '检测到日语':       ['Japanese detected',    '检测到日语',       '日本語 検出',        ],
    '检测到韩语':       ['Korean detected',      '检测到韩语',       '韓国語 検出',        ],
    '检测到法语':       ['French detected',      '检测到法语',       'フランス語 検出',    ],
    '检测到西班牙语':   ['Spanish detected',     '检测到西班牙语',   'スペイン語 検出',    ],
    '检测到意大利语':   ['Italian detected',     '检测到意大利语',   'イタリア語 検出',    ],
    '检测到德语':       ['German detected',      '检测到德语',       'ドイツ語 検出',      ],
    '检测到土耳其语':   ['Turkish detected',     '检测到土耳其语',   'トルコ語 検出',      ],
    '检测到俄语':       ['Russian detected',     '检测到俄语',       'ロシア語 検出',      ],
    '检测到葡萄牙语':   ['Portuguese detected',  '检测到葡萄牙语',   'ポルトガル語 検出',  ],
    '检测到越南语':     ['Vietnamese detected',  '检测到越南语',     'ベトナム語 検出',    ],
    '检测到印尼语':     ['Indonesian detected',  '检测到印尼语',     'インドネシア語 検出',],
    '检测到泰语':       ['Thai detected',        '检测到泰语',       'タイ語 検出',        ],
    '检测到马来西亚语': ['Malaysian detected',   '检测到马来西亚语', 'マレーシア語 検出',  ],
    '检测到阿拉伯语':   ['Arabic detected',      '检测到阿拉伯语',   'アラビア語 検出',    ],
    '检测到印地语':     ['Hindi detected',       '检测到印地语',     'ヒンディー語 検出',  ],
    '中文':       ['Chinese',     '中文',       '中国語',        ],
    '英语':       ['English',     '英语',       '英語',          ],
    '日语':       ['Japanese',    '日语',       '日本語',        ],
    '韩语':       ['Korean',      '韩语',       '韓国語',        ],
    '法语':       ['French',      '法语',       'フランス語',    ],
    '西班牙语':   ['Spanish',     '西班牙语',   'スペイン語',    ],
    '意大利语':   ['Italian',     '意大利语',   'イタリア語',    ],
    '德语':       ['German',      '德语',       'ドイツ語',      ],
    '土耳其语':   ['Turkish',     '土耳其语',   'トルコ語',      ],
    '俄语':       ['Russian',     '俄语',       'ロシア語',      ],
    '葡萄牙语':   ['Portuguese',  '葡萄牙语',   'ポルトガル語',  ],
    '越南语':     ['Vietnamese',  '越南语',     'ベトナム語',    ],
    '印尼语':     ['Indonesian',  '印尼语',     'インドネシア語',],
    '泰语':       ['Thai',        '泰语',       'タイ語',        ],
    '马来西亚语': ['Malaysian',   '马来西亚语', 'マレーシア語',  ],
    '阿拉伯语':   ['Arabic',      '阿拉伯语',   'アラビア語',    ],
    '印地语':     ['Hindi',       '印地语',     'ヒンディー語',  ],
    '翻译':       ['Translate',   '翻译',       '翻訳',          ],
    '人工翻译':   ['by Human',    '人工翻译',   '翻訳家に依頼',  ],
  };
  const CORRECTIONS = [
    (s) => s.replace(/h?tt?p(s?)[:：]\/\/([^\s。]+)([。. ]*)/ig, 'http$1://$2'),/* for URL */
    (s) => s.replace(/([0-9]+)：([0-9]+)/g, '$1:$2'),/* for 12:30 format */
    (s) => s.replace(/，([0-9]{3})/g, ',$1'),/* for 1,000,000 format */
    (s) => s.replace(/？/g, '?'),/* for URL */
    (s) => s.replace(/：/g, ':'),/* : */
    (s) => s.replace(/\.。/g, '。'),/* may be a bug */
  ];
  const SEPARATORS = ['\n:\n', '\n：\n', '：'];/*翻訳元, 翻訳先, 翻訳先span.textContent */
  const RETRY = 10;
  let site = {
    targets: {
      textpanelSource: () => $('.textpanel-source'),
      sourceTextarea: () => $('[node-type="source-textarea"]'),
      textpanelTargetTextblock: () => $('[node-type="textpanel-target-textblock"]'),
      sourceLanguageButton: () => $('[node-type="source_language_button"]'),
      exchangeLanguageButton: () => $('[node-type="exchange_language_button"]'),
      targetLanguageButton: () => $('[node-type="target_language_button"]'),
      sourceLanguageList: () => $('[node-type="source_language_list"]'),
      targetLanguageList: () => $('[node-type="target_language_list"]'),
      translateButton: () => $('[node-type="translate_button"]'),
      humanTranslation: () => $('[node-type="human-translation"]'),
    },
    get: {
      labels: () => {
        let index = LANGUAGES.findIndex(regexp => regexp.test(window.navigator.language)) || 0;
        let labels = LABELS;
        Object.keys(labels).forEach(key => labels[key] = labels[key][index]);
        return labels;
      },
      textSrcs: (textpanelTargetTextblock) => textpanelTargetTextblock.querySelectorAll('.text-src'),
      textDsts: (textpanelTargetTextblock) => textpanelTargetTextblock.querySelectorAll('.text-dst'),
      textMatrix: (textpanelTargetTextblock) => {
        return {
          srcs: Array.from(site.get.textSrcs(textpanelTargetTextblock)).map(e => e.textContent),
          dsts: Array.from(site.get.textDsts(textpanelTargetTextblock)).map(e => e.textContent),
        };
      },
    },
    set: {
      languageLabel: (node, labels) => {
        let span = node.querySelector('span'), label = span.textContent.replace(/\s/g, '');
        let replaced = createElement(core.html.languageLabel(labels[label] || span.textContent))
        span.parentNode.insertBefore(replaced, span);
      },
      languageButtonLabel: (button, labels) => {
        let label = button.textContent.replace(/\s/g, '');
        let buttonTextSpan = button.querySelector('.language-button-text');
        if(buttonTextSpan) buttonTextSpan.textContent = labels[label] || buttonTextSpan.textContent;
        else button.firstChild.data = labels[label] || button.firstChild.data;
      },
      translateButtonLabel: (button, labels) => {
        let label = button.textContent.replace(/\s/g, '');
        button.textContent = labels[label] || button.textContent;
      },
      humanTranslationLabel: (button, labels) => {
        let label = button.textContent.replace(/\s/g, '');
        button.lastChild.data = labels[label] || button.lastChild.data;
      },
    },
  };
  let html, elements = {}, timers = {}, sizes = {};
  let core = {
    initialize: function(){
      html = document.documentElement;
      html.classList.add(SCRIPTID);
      core.ready();
      core.addStyle();
    },
    ready: function(){
      core.getTargets(site.targets, RETRY).then(() => {
        log("I'm ready.");
        core.restoreMode();
        core.listenUserActions();
        core.replaceLabels();
        core.expandClickableArea();
        core.reloadOnWakeUp();
      });
    },
    restoreMode: function(){
      /* ページ読み込んだ時点で往復翻訳を有効に */
      let sourceTextarea = elements.sourceTextarea, translateButton = elements.translateButton;
      if(sourceTextarea.value.includes(SEPARATORS[0]) === true){
        translateButton.click();
        setTimeout(core.translateBackSwitch, 1000);
      }
    },
    listenUserActions: function(){
      window.addEventListener('keypress', function(e){
        switch(true){
          case(e.key === 'Enter' && e.shiftKey === true):
            core.translateSwitch();
            return e.preventDefault();
          case(e.key === 'Enter' && e.ctrlKey === true):
            core.translateBackSwitch();
            return e.preventDefault();
        }
      });
      window.addEventListener('focus', function(e){
        elements.sourceTextarea.focus();
      });
    },
    translateSwitch: function(){
      /* 翻訳言語の向きを入れ替える */
      let exchangeLanguageButton = elements.exchangeLanguageButton, sourceTextarea = elements.sourceTextarea;
      exchangeLanguageButton.click();
      sourceTextarea.focus();
    },
    translateBackSwitch: function(){
      /* 往復翻訳の有効無効を切り替える */
      let exchangeLanguageButton = elements.exchangeLanguageButton;
      if(exchangeLanguageButton.dataset.translateBack === 'true'){
        exchangeLanguageButton.dataset.translateBack = 'false';
      }else{
        exchangeLanguageButton.dataset.translateBack = 'true';
        core.translateBack();
      }
    },
    translateBack: function(){
      /* 往復翻訳する */
      let exchangeLanguageButton = elements.exchangeLanguageButton;
      let sourceTextarea = elements.sourceTextarea, textpanelTargetTextblock = elements.textpanelTargetTextblock;
      let sourceText = sourceTextarea.value, targetText = textpanelTargetTextblock.innerText, result = '';
      /* まだ往復翻訳してなければ */
      let selectionStart = sourceTextarea.selectionStart, selectionEnd = sourceTextarea.selectionEnd;/*カーソル位置を記憶*/
      if(sourceTextarea.value.includes(SEPARATORS[0]) === false){
        result = sourceText + SEPARATORS[0] + targetText;
      /* すでに往復翻訳済みなら */
      }else{
        sourceText = sourceText.slice(0, sourceText.indexOf(SEPARATORS[0]));
        targetText = targetText.slice(0, targetText.indexOf(SEPARATORS[1]));
        result = sourceText + SEPARATORS[0] + targetText;
      }
      /* 左辺の表示を完成させる */
      CORRECTIONS.forEach(c => result = c(result));
      sourceTextarea.value = result;
      sourceTextarea.dispatchEvent(new Event('input'));
      sourceTextarea.setSelectionRange(selectionStart, selectionEnd);
      /* 右辺の表示を追従させる */
      core.translateSwitch();
      if(textpanelTargetTextblock.dataset.status !== undefined) return;
      let compositing = false;
      let observer = observe(textpanelTargetTextblock, function(records){
        log(textpanelTargetTextblock.dataset.status, compositing, sourceTextarea.value.replace(/\n/g, ' '), textpanelTargetTextblock.innerText.replace(/\n/g, ' '));
        /* セパレータが消されたら往復翻訳モードを終了する */
        if(sourceTextarea.value.includes(SEPARATORS[0]) === false){
          exchangeLanguageButton.dataset.translateBack = 'false';
          delete(textpanelTargetTextblock.dataset.status);
          observer.disconnect();
          return;
        }
        switch(textpanelTargetTextblock.dataset.status){
          /* 往復を終えた最終翻訳が取得できたタイミング */
          case(undefined):
          case('back'):
            textpanelTargetTextblock.textMatrix = site.get.textMatrix(textpanelTargetTextblock);
            core.translateSwitch();
            textpanelTargetTextblock.dataset.status = 'go';
            break;
          /* 往路スタンバイに戻ったタイミング */
          case('go'):
            setTimeout(function(){
              let textDsts = site.get.textDsts(textpanelTargetTextblock);
              for(let i = Array.from(textDsts).findIndex(t => t.textContent === SEPARATORS[2]) + 1; textDsts[i]; i++){
                textDsts[i].textContent = textpanelTargetTextblock.textMatrix.dsts[i];
              }
              textpanelTargetTextblock.dataset.status = 'done';
            }, 1000);/*再度更新される場合があるので*/
            break;
          /* テキスト変更を検知して自動翻訳されたタイミング */
          case('done'):
            /* 原文も訳文も変化していなければ何も処理しない */
            if(sourceTextarea.value === sourceText && textpanelTargetTextblock.innerText === targetText) return;
            if(compositing === true) return;/*sourceTextとtargetTextは更新させない！*/
            sourceText = sourceTextarea.value, targetText = textpanelTargetTextblock.innerText;
            core.translateBack();
            textpanelTargetTextblock.dataset.status = 'back';
            break;
        }
      });
      sourceTextarea.addEventListener('compositionstart', function(e){
        compositing = true;
      });
      sourceTextarea.addEventListener('compositionend', function(e){
        compositing = false;
      });
    },
    replaceLabels: function(){
      let labels = site.get.labels();
      /* 翻訳言語リスト */
      let sourceLanguageList = elements.sourceLanguageList, targetLanguageList = elements.targetLanguageList;
      [sourceLanguageList, targetLanguageList].forEach(list => {
        Array.from(list.children).forEach(li => site.set.languageLabel(li, labels));
      });
      observe(targetLanguageList, function(records){
        Array.from(targetLanguageList.children).forEach(li => site.set.languageLabel(li, labels));
      });
      /* 翻訳言語 */
      let sourceLanguageButton = elements.sourceLanguageButton, targetLanguageButton = elements.targetLanguageButton;
      [sourceLanguageButton, targetLanguageButton].forEach(button => {
        site.set.languageButtonLabel(button, labels);
        observe(button, function(records){
          site.set.languageButtonLabel(button, labels);
        });
      });
      /* 翻訳ボタン */
      site.set.translateButtonLabel(elements.translateButton, labels);
      site.set.humanTranslationLabel(elements.humanTranslation, labels);
    },
    expandClickableArea: function(){
      let textpanelSource = elements.textpanelSource, sourceTextarea = elements.sourceTextarea;
      textpanelSource.addEventListener('click', function(e){
        sourceTextarea.focus();
      }, true);
    },
    reloadOnWakeUp: function(){
      let lastTime = Date.now();
      setInterval(function(){
        let now = Date.now();
        if(now - lastTime < 3*MINUTE) lastTime = now;
        else setTimeout(() => location.reload(), 1*MINUTE);/*ネットワークの復帰を待つ*/
      }, 1*MINUTE);
    },
    getTargets: function(targets, retry = 0){
      const get = function(resolve, reject, retry){
        for(let i = 0, keys = Object.keys(targets), key; key = keys[i]; i++){
          let selected = targets[key]();
          if(selected){
            if(selected.length) selected.forEach((s) => s.dataset.selector = key);
            else selected.dataset.selector = key;
            elements[key] = selected;
          }else{
            if(--retry < 0) return reject(log(`Not found: ${key}, I give up.`));
            log(`Not found: ${key}, retrying... (left ${retry})`);
            return setTimeout(get, 1000, resolve, reject, retry);
          }
        }
        resolve();
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject, retry);
      });
    },
    addStyle: function(name = 'style'){
      if(core.html[name] === undefined) return;
      let style = createElement(core.html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      languageLabel: (label) => `<span class="replaced">${label}</span>`,
      style: () => `
        <style type="text/css">
          /* 翻訳方向スイッチボタン */
          [data-selector="exchangeLanguageButton"]{
            border: 1px solid transparent;
            border-radius: 100%;
            width: 36px;
            height: 36px;
          }
          [data-selector="exchangeLanguageButton"][data-translate-back="true"]{
            border: 1px solid rgb(160, 76, 247);
          }
          /* クリッカブル領域を広げる */
          [data-selector="textpanelSource"]{
            cursor: text;
          }
          dummy/*core.expandClickableAreaでやる*/ [data-selector="sourceTextarea"]{
            height: 100% !important;
          }
          /* 往復翻訳処理中 */
          [data-selector="textpanelTargetTextblock"]{
            transition: opacity 125ms;
          }
          [data-selector="textpanelTargetTextblock"][data-status="back"],
          [data-selector="textpanelTargetTextblock"][data-status="go"]{
            animation: ${SCRIPTID}-blink 500ms ease infinite;
          }
          @keyframes ${SCRIPTID}-blink{
              0%{opacity: .250}
            100%{opacity: .125}
          }
          /* 翻訳言語リスト */
          [data-selector="sourceLanguageList"] > li > span.replaced,
          [data-selector="targetLanguageList"] > li > span.replaced{
            display: block;
            padding: 0 !important;
            margin: 0 1px !important;
          }
          [data-selector="sourceLanguageList"] > li > span.replaced + span,
          [data-selector="targetLanguageList"] > li > span.replaced + span{
            display: none;
          }
          /* 翻訳ボタン */
          [data-selector="humanTranslation"]{
            text-align: center;
          }
          [data-selector="humanTranslation"] .human-translation{
            display: inline-block;
            margin-left: auto;
            float: none;
          }
        </style>
      `,
    },
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  class Storage{
    static key(key){
      return (SCRIPTID) ? (SCRIPTID + '-' + key) : key;
    }
    static save(key, value, expire = null){
      key = Storage.key(key);
      localStorage[key] = JSON.stringify({
        value: value,
        saved: Date.now(),
        expire: expire,
      });
    }
    static read(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.value === undefined) return data;
      if(data.expire === undefined) return data;
      if(data.expire === null) return data.value;
      if(data.expire < Date.now()) return localStorage.removeItem(key);
      return data.value;
    }
    static delete(key){
      key = Storage.key(key);
      delete localStorage.removeItem(key);
    }
    static saved(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.saved) return data.saved;
      else return undefined;
    }
  }
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s){return document.querySelectorAll(s)};
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const wait = function(ms){return new Promise((resolve) => setTimeout(resolve, ms))};
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false, subtree: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const normalize = function(string){
    return string.replace(/[！-～]/g, function(s){
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).replace(normalize.RE, function(s){
      return normalize.KANA[s];
    }).replace(/　/g, ' ').replace(/～/g, '〜');
  };
  normalize.KANA = {
    ｶﾞ:'ガ', ｷﾞ:'ギ', ｸﾞ:'グ', ｹﾞ:'ゲ', ｺﾞ: 'ゴ',
    ｻﾞ:'ザ', ｼﾞ:'ジ', ｽﾞ:'ズ', ｾﾞ:'ゼ', ｿﾞ: 'ゾ',
    ﾀﾞ:'ダ', ﾁﾞ:'ヂ', ﾂﾞ:'ヅ', ﾃﾞ:'デ', ﾄﾞ: 'ド',
    ﾊﾞ:'バ', ﾋﾞ:'ビ', ﾌﾞ:'ブ', ﾍﾞ:'ベ', ﾎﾞ: 'ボ',
    ﾊﾟ:'パ', ﾋﾟ:'ピ', ﾌﾟ:'プ', ﾍﾟ:'ペ', ﾎﾟ: 'ポ',
    ﾜﾞ:'ヷ', ｦﾞ:'ヺ', ｳﾞ:'ヴ',
    ｱ:'ア', ｲ:'イ', ｳ:'ウ', ｴ:'エ', ｵ:'オ',
    ｶ:'カ', ｷ:'キ', ｸ:'ク', ｹ:'ケ', ｺ:'コ',
    ｻ:'サ', ｼ:'シ', ｽ:'ス', ｾ:'セ', ｿ:'ソ',
    ﾀ:'タ', ﾁ:'チ', ﾂ:'ツ', ﾃ:'テ', ﾄ:'ト',
    ﾅ:'ナ', ﾆ:'ニ', ﾇ:'ヌ', ﾈ:'ネ', ﾉ:'ノ',
    ﾊ:'ハ', ﾋ:'ヒ', ﾌ:'フ', ﾍ:'ヘ', ﾎ:'ホ',
    ﾏ:'マ', ﾐ:'ミ', ﾑ:'ム', ﾒ:'メ', ﾓ:'モ',
    ﾔ:'ヤ', ﾕ:'ユ', ﾖ:'ヨ',
    ﾗ:'ラ', ﾘ:'リ', ﾙ:'ル', ﾚ:'レ', ﾛ:'ロ',
    ﾜ:'ワ', ｦ:'ヲ', ﾝ:'ン',
    ｧ:'ァ', ｨ:'ィ', ｩ:'ゥ', ｪ:'ェ', ｫ:'ォ',
    ｯ:'ッ', ｬ:'ャ', ｭ:'ュ', ｮ:'ョ',
    "｡":'。', "､":'、', "ｰ":'ー', "｢":'「', "｣":'」', "･":'・',
  };
  normalize.RE = new RegExp('(' + Object.keys(normalize.KANA).join('|') + ')', 'g');
  const log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      (SCRIPTID || '') + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...arguments
    );
  };
  log.formats = [{
      name: 'Firefox Scratchpad',
      detector: /MARKER@Scratchpad/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Console',
      detector: /MARKER@debugger/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 3',
      detector: /\/gm_scripts\//,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 4+',
      detector: /MARKER@user-script:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 500,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Tampermonkey',
      detector: /MARKER@moz-extension:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 6,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?id=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 6,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Chrome Extension',
      detector: /at MARKER \(chrome-extension:/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Edge Console',
      detector: /at MARKER \(eval/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(eval)/gm),
    }, {
      name: 'Edge Tampermonkey',
      detector: /at MARKER \(Function/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 4,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(Function)/gm),
    }, {
      name: 'Safari',
      detector: /^MARKER$/m,
      getLine: (e) => 0,/*e.lineが用意されているが最終呼び出し位置のみ*/
      getCallers: (e) => e.stack.split('\n'),
    }, {
      name: 'Default',
      detector: /./,
      getLine: (e) => 0,
      getCallers: (e) => [],
    }];
  log.format = log.formats.find(function MARKER(f){
    if(!f.detector.test(new Error().stack)) return false;
    //console.log('////', f.name, 'wants', 0/*line*/, '\n' + new Error().stack);
    return true;
  });
  const time = function(label){
    if(!DEBUG) return;
    const BAR = '|', TOTAL = 100;
    switch(true){
      case(label === undefined):/* time() to output total */
        let total = 0;
        Object.keys(time.records).forEach((label) => total += time.records[label].total);
        Object.keys(time.records).forEach((label) => {
          console.log(
            BAR.repeat((time.records[label].total / total) * TOTAL),
            label + ':',
            (time.records[label].total).toFixed(3) + 'ms',
            '(' + time.records[label].count + ')',
          );
        });
        time.records = {};
        break;
      case(!time.records[label]):/* time('label') to create and start the record */
        time.records[label] = {count: 0, from: performance.now(), total: 0};
        break;
      case(time.records[label].from === null):/* time('label') to re-start the lap */
        time.records[label].from = performance.now();
        break;
      case(0 < time.records[label].from):/* time('label') to add lap time to the record */
        time.records[label].total += performance.now() - time.records[label].from;
        time.records[label].from = null;
        time.records[label].count += 1;
        break;
    }
  };
  time.records = {};
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();