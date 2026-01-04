// ==UserScript==
// @name        Niconico Batch Commenter
// @namespace   knoa.jp
// @description ニコニコ動画のコメントをまとめて投稿します。
// @include     https://www.nicovideo.jp/watch/*
// @version     1.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/380484/Niconico%20Batch%20Commenter.user.js
// @updateURL https://update.greasyfork.org/scripts/380484/Niconico%20Batch%20Commenter.meta.js
// ==/UserScript==

(function(){
  const SCRIPTNAME = 'NiconicoBatchCommenter';
  const DEBUG = false;/*
[update] 1.1.3
正常動作を確認しました。

[to do]

[possible to do]
ニコニコの仕様変更を検知したらお知らせと共にこのページを案内するなど
75文字制限「*75文字を超えるコメントがあります」(投稿できない)
時間制限「*動画時間を超える時刻指定があります」(投稿は可能)
ログイン確認
  */
  if(window === top && console.time) console.time(SCRIPTNAME);
  const NMSG = 'https://nmsg.nicovideo.jp/api.json/thread?version=20090904&thread={thread}';
  const FLAPI = 'https://flapi.nicovideo.jp/api/getpostkey?thread={thread}&block_no={block_no}&device=1&version=1&version_sub=6';
  const POST = 'https://nmsg.nicovideo.jp/api.json/';
  const INTERVAL = 6000;
  const MAXLENGTH = 75;/*未使用*/
  let site = {
    targets: {
      CommentPanelContainer: () => $('.CommentPanelContainer'),
    },
    get: {
      apiData: () => JSON.parse(document.querySelector('#js-initial-watch-data').dataset.apiData),
      thread: (apiData) => apiData.thread.ids.default,
      user_id: (apiData) => apiData.viewer.id,
      premium: (apiData) => apiData.viewer.isPremium ? "1" : "0",
    },
    getChat: (vpos, command, content, parameters) => [
      {ping: {content: "rs:1"}},
      {ping: {content: "ps:8"}},
      {chat: {
        thread: parameters.thread,
        user_id: parameters.user_id,
        premium: parameters.premium,
        mail: command + " 184",
        vpos: vpos,
        content: content,
        ticket: parameters.ticket,
        postkey: parameters.postkey,
      }},
      {ping: {content: "pf:8"}},
      {ping: {content: "rf:1"}},
    ],
    toVpos: (time) => {
      let t = time.split(':'), h = 60*60*100, m = 60*100, s = 100;
      switch(t.length){
        case(3): return t[0]*h + t[1]*m + t[2]*s;
        case(2): return t[0]*m + t[1]*s;
        case(1): return t[0]*s;
      }
    },
  };
  let comment = `
    #0:00 うｐ乙
    #1:23 ｗｗｗｗｗ
    #1:23.45 コンマ秒単位ずらすｗｗｗｗｗ
    #60:00.0 時刻表記は 1:00:00 でも 60:00 でも 3600 でもおｋ
    #1:25:25(shita small) 時刻にカッコを続けるとコマンド指定もできます。

    <chat vpos="360000" mail="shita small">XML形式の貼り付けもできます。時刻(vpos)とコマンド(mail)以外の属性は無視します。184コマンドは自動で付与されます。</chat>
  `.trim().replace(/^ +/mg, '');
  let retry = 10, elements = {}, storages = {}, timers = {};
  let core = {
    initialize: function(){
      core.ready();
      core.addStyle();
    },
    ready: function(){
      for(let i = 0, keys = Object.keys(site.targets); keys[i]; i++){
        let element = site.targets[keys[i]]();
        if(element){
          element.dataset.selector = keys[i];
          elements[keys[i]] = element;
        }else{
          if(--retry < 0) return log(`Not found: ${keys[i]}, I give up.`);
          log(`Not found: ${keys[i]}, retrying... (left ${retry})`);
          return setTimeout(core.ready, 1000);
        }
      }
      log("I'm ready.");
      core.addButton();
    },
    addButton: function(){
      let button = createElement(core.html.button()), html = document.documentElement;
      button.addEventListener('click', function(e){
        if(html.classList.contains(SCRIPTNAME)) return;/*二重に開かない*/
        html.classList.add(SCRIPTNAME);
        let form = createElement(core.html.form(comment)), textarea = form.querySelector('textarea'), postButton = form.querySelector('button');
        postButton.addEventListener('click', core.post.bind(null, textarea, postButton));
        /* フォーム背景をクリックすると消える */
        form.addEventListener('click', function(e){
          if(e.target !== form) return;/*フォーム内の部品をクリックした場合は何もしない*/
          if(textarea.disabled) return;/*コメント送信処理中は何もしない*/
          comment = textarea.value;/* 保存 */
          form.parentNode.removeChild(form);
          html.classList.remove(SCRIPTNAME);
        });
        document.body.appendChild(form);
      });
      elements.CommentPanelContainer.appendChild(button);
    },
    post: function(textarea, button, e){
      e.preventDefault();
      let i = 0, comments = textarea.value.trim().split(/\n/).map(c => c.trimLeft()).filter(c => c.match(/^#[0-9]|^<chat /)), errors = [];
      if(!confirm(`${comments.length}件のコメントを${INTERVAL/1000}秒ごとに計${secondsToTime(comments.length * INTERVAL/1000)}かけて投稿します。`)) return;
      textarea.disabled = button.disabled = true;
      let timer = setInterval(function(){
        if(comments[i] === undefined){
          let message = `${comments.length}コメントの送信を完了しました。リロードで反映されます。`;
          if(errors.length) message += `以下のコメントは投稿に失敗しました:\n\n${errors.join(`\n`)}`;
          clearInterval(timer);
          alert(message);
          textarea.disabled = button.disabled = false;
          return;
        }
        let comment = comments[i++], line, time, command, content, fail = function(comment){errors.push(comment) && core.flagLine(textarea, comment, false)};
        switch(true){
          case(comment.startsWith('#')):
            let m = comment.match(/^#([0-9:.]+)(?:\(([a-z0-9_#@:\s]+)\))?\s(.+)$/);
            if(m === null) return fail(comment);
            line = m[0], time = m[1], command = m[2] || '', content = m[3];
            break;
          case(comment.startsWith('<chat ')):
            let lm = comment.match(/<chat[^>]+>([^<>]+)<\/chat>/), vm = comment.match(/ vpos="([0-9]+)"/), mm = comment.match(/ mail="([^"]+)"/);
            if(lm === null || vm === null) return fail(comment);
            line = lm[0], time = String(parseFloat(vm[1])/100), command = mm ? mm[1] : '', content = lm[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
            break;
          default:
            return fail(comment);
            break;
        }
         let apiData = site.get.apiData(), parameters = {
          thread:  site.get.thread(apiData),
          user_id: site.get.user_id(apiData),
          premium: site.get.premium(apiData),
        };
        fetch(NMSG.replace('{thread}', parameters.thread))
        .then(response => response.json())
        .then(json => {parameters.block_no = Math.floor(((json[0].thread.last_res || 0) + 1) / 100); parameters.ticket = json[0].thread.ticket;})
        .then(() => fetch(FLAPI.replace('{thread}', parameters.thread).replace('{block_no}', parameters.block_no), {credentials: 'include'}))
        .then(response => response.text())
        .then(text => {parameters.postkey = text.replace(/^postkey=/, '')})
        .then(() => fetch(POST, {method: 'POST', body: JSON.stringify(site.getChat(site.toVpos(time), command, content, parameters))}))
        .then(response => response.json())
        .then(json => json[2].chat_result.status === 0)
        .then(success => {
          core.flagLine(textarea, line, success);
          if(!success) errors.push(line);
        });
      }, INTERVAL);
    },
    flagLine: function(textarea, string, success){
      textarea.value = textarea.value.replace(new RegExp('^(.*?)' + escapeRegExp(string) + '$', 'm'), (success ? 'OK ' : 'NG ') + '$1' + string);
    },
    addStyle: function(name = 'style'){
      let style = createElement(core.html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      button: () => `
        <button id="${SCRIPTNAME}-button" title="${SCRIPTNAME} コメントをまとめて投稿する">+</button>
      `,
      form: (comment) => `
        <form id="${SCRIPTNAME}-form">
          <textarea placeholder="#1:23 ｗｗｗｗｗ">${comment}</textarea>
          <button>まとめてコメントする</button>
        </form>
      `,
      style: () => `
        <style type="text/css">
          html.${SCRIPTNAME}{
            overflow: hidden;/*背後のコンテンツをスクロールさせない*/
          }
          #${SCRIPTNAME}-button{
            font-size: 2em;
            line-height: 1em;
            text-align: center;
            color: rgba(0,0,0,.5);
            background: white;
            border: none;
            border-radius: 1em;
            filter: drop-shadow(0 0 .1em rgba(0,0,0,.5));
            opacity: .25;
            width: 1em;
            height: 1em;
            padding: 0;
            margin: .25em;
            position: absolute;
            right: 0;
            bottom: 0;
            cursor: pointer;
            transition: opacity 250ms;
          }
          #${SCRIPTNAME}-button:hover{
            opacity: .75;
          }
          #${SCRIPTNAME}-form{
            background: rgba(0,0,0,.75);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
          }
          #${SCRIPTNAME}-form textarea{
            font-family: monospace;
            border: none;
            width: 80vw;
            height: calc(80vh - 3em);
            padding: .5em;
            margin: 10vh 10vw 0;
          }
          #${SCRIPTNAME}-form button{
            color: white;
            background: rgb(0, 124, 255);
            border: none;
            width: 80vw;
            height: 3em;
            margin: 0 10vw;
            cursor: pointer;
          }
          #${SCRIPTNAME}-form button:hover{
            background: rgb(0, 96, 210);
          }
          #${SCRIPTNAME}-form button[disabled]{
            filter: brightness(.5);
            pointer-events: none;
          }
        </style>
      `,
    },
  };
  class Storage{
    static key(key){
      return (SCRIPTNAME) ? (SCRIPTNAME + '-' + key) : key;
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
  const $ = function(s){return document.querySelector(s)};
  const $$ = function(s){return document.querySelectorAll(s)};
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const wait = function(ms){return new Promise((resolve) => setTimeout(resolve, ms))};
  const createElement = function(html){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const escapeRegExp = function(string){
    return string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&'); // $&はマッチした部分文字列全体を意味します
  };
  const secondsToTime = function(seconds){
    let floor = Math.floor, zero = (s) => s.toString().padStart(2, '0');
    let h = floor(seconds/3600), m = floor(seconds/60)%60, s = floor(seconds%60);
    if(h) return h + '時間' + zero(m) + '分' + zero(s) + '秒';
    if(m) return m + '分' + zero(s) + '秒';
    if(s) return s + '秒';
  };
  const log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      SCRIPTNAME + ':',
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
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \((userscript\.html|chrome-extension:)/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+)\)$/)[1] - 6,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \((userscript\.html|chrome-extension:))/gm),
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
    //console.log('//// ' + f.name + '\n' + new Error().stack);
    return true;
  });
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTNAME);
})();