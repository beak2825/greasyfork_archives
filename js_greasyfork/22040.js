// ==UserScript==
// @name        AbemaTV Quick NG Comment
// @namespace   https://greasyfork.org/ja/scripts/22040
// @description AbemaTVのコメントを一時的にNG。連投コメントをブロック
// @include     https://abema.tv/now-on-air/*
// @version     3
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22040/AbemaTV%20Quick%20NG%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/22040/AbemaTV%20Quick%20NG%20Comment.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function id(a) {
    return document.getElementById(a);
  }

  function log(s, t) {
    if (ls.debug) {
      if (t) console[t]('QuickNG', s);
      else console.log('QuickNG', s);
    }
  }

  //デスクトップ通知
  function notify(a, t) {
    var title = 'AbemaTV Quick NG Comment',
      message = a,
      notifi;
    log(['notify', a, t]);
    if (t === 'ng') message += '\nをNGワード登録しました。';
    else if (t === 'duplicate') message += '\nはNGワード登録済みです。';
    else if (t === 'consecutive') message = '連投コメントを' + ((a) ? 'ブロック' : '表示') + 'します。';
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        notifi = new Notification(title, { body: message });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          if (permission === 'granted') {
            notifi = new Notification(title, { body: message });
          }
        });
      }
      if (notifi) setTimeout(notifi.close.bind(notifi), 3000);
    } else alert('AbemaTV Quick NG Comment\n\n' + message);
  }

  //コメントをクリックしたとき
  function clickComment(a) {
    a.addEventListener('click', function(e) {
      //Ctrl+クリックでNGワード追加
      if (e.ctrlKey && !e.shiftKey) {
        var el = e.target;
        if (a === defaultListComment) {
          if (/^styles__message/.test(el.className)) addNgComment(el.textContent);
        } else {
          if (/comment|movingComment/.test(el.className) && !el.classList.contains('quickng')) addNgComment(el.textContent, el);
        }
      }
      //Shift+クリックで連投コメントブロックのON・OFF
      else if (!e.ctrlKey && e.shiftKey) {
        ls.blockconsecutivecomment = (ls.blockconsecutivecomment) ? false : true;
        localStorage.setItem('QuickNG', JSON.stringify(ls));
        notify(ls.blockconsecutivecomment, 'consecutive');
      }
    });
  }

  //NGワードを登録
  function addNgComment(s, e) {
    if (ss.ngcomment.some(function(val) {
        return (val === s);
      })) {
      notify(s, 'duplicate');
    } else {
      if (e) e.classList.add('quickng');
      ss.ngcomment.unshift(s);
      sessionStorage.setItem('QuickNG', JSON.stringify(ss));
      notify(s, 'ng');
    }
  }

  //新しいコメントを読み込んだときにコメントの内容を調べる
  function checkComment(r) {
    var word = '',
      checkPreWord = function(val, ind, arr) {
        if (val.word === word) {
          val.count++;
          if (ind > 0) {
            arr.splice(ind, 1);
            arr.unshift(val);
          }
          if (val.count === 5) {
            arr.splice(ind, 1);
            ss.concecutivecomment.unshift(word);
            sessionStorage.setItem('QuickNG', JSON.stringify(ss));
          }
          log(['連投', val.count, word], 'info');
          return true;
        }
        return false;
      },
      checkConcecutive = function(val) {
        return (val === word);
      },
      addNgClass = function(elm) {
        if (!elm.classList.contains('quickng')) elm.classList.add('quickng');
      };
    //変更があった要素の回数分ループ
    for (var i1 = 0, l1 = r.length, lNg = ss.ngcomment.length, type; i1 < l1; i1++) {
      if (!r[i1].addedNodes.length) continue;
      switch (r[i1].addedNodes[0].parentNode) {
        case id('floatComments'):
          type = 'list';
          break;
        case id('scrollComments'):
        case id('moveContainer'):
          type = 'scroll';
          break;
        default:
          return;
      }
      //新しいコメントの回数分ループ
      for (var i2 = 0, l2 = r[i1].addedNodes.length, node; i2 < l2; i2++) {
        node = r[i1].addedNodes[i2];
        word = node.textContent;
        log(['check', r.length, r[i1].addedNodes.length, word, type]);
        //連投コメントなら表示しない
        if (ls.blockconsecutivecomment) {
          if (ss.concecutivecomment.some(checkConcecutive)) {
            addNgClass(node);
            log(['連投NGコメント', word], 'info');
            continue;
          }
          if (preWord[type].some(checkPreWord)) {
            addNgClass(node);
            continue;
          }
        }
        if (preWord[type].length >= 50) preWord[type].pop();
        preWord[type].unshift({ word: word, count: 1 });
        //登録したNGワードの回数分ループ
        for (var i3 = 0; i3 < lNg; i3++) {
          //新しいコメントがNGワードを含んでいるなら表示しない
          if (word.indexOf(ss.ngcomment[i3]) !== -1) {
            addNgClass(node);
            log(['NGワード', word], 'info');
            break;
          }
        }
      }
    }
  }

  //最初の処理
  function start() {
    log('start');
    preWord.list = [];
    preWord.scroll = [];
    if (!ls.blockconsecutivecomment) ls.blockconsecutivecomment = true;
    if (!ss.ngcomment) ss.ngcomment = [];
    if (!ss.concecutivecomment) ss.concecutivecomment = [];
    GM_addStyle(style);
    //フッターが表示されるまで待つ
    interval = setInterval(function() {
      var footer = document.querySelector('p[class^="styles__program-highlight"] > span > span');
      if (footer) {
        clearInterval(interval);
        observerP.observe(footer, moConfig2);
      }
    }, 200);
  }

  //フッターが表示されたら実行
  function pre(r) {
    log('pre');
    //左下に番組名が表示されたとき
    if (r[0].addedNodes[0].length && r[0].addedNodes[0].textContent) {
      observerP.disconnect();
      init();
    }
  }

  //視聴者数などのデータが読み込まれたら実行
  function init() {
    log('init');
    defaultListComment = document.querySelector('div[class^="styles__comment-list-wrapper"] > div');
    //拡張機能が動作してるとき
    if (id('moveContainer')) scrollComment = id('moveContainer');
    //スクリプトが動作しているとき
    else if (id('floatComments')) {
      listComment = id('floatComments');
      scrollComment = id('scrollComments');
      observerL.observe(listComment, moConfig);
      clickComment(listComment);
    }
    clickComment(defaultListComment);
    log(['init', listComment, scrollComment]);
    if (scrollComment) {
      clickComment(scrollComment);
      observerS.observe(scrollComment, moConfig);
    }
  }

  var observerP = new MutationObserver(pre),
    observerL = new MutationObserver(checkComment),
    observerS = new MutationObserver(checkComment),
    moConfig = { childList: true },
    moConfig2 = { childList: true, subtree: true },
    ls = JSON.parse(localStorage.getItem('QuickNG')) || {},
    ss = JSON.parse(sessionStorage.getItem('QuickNG')) || {},
    style = '.quickng {display: none !important;}' +
    '#moveContainer {z-index: 11 !important; pointer-events: auto !important;}' +
    '#moveContainer > .movingComment {z-index: 13 !important;}' +
    '#scrollComments > .scroll:hover, #moveContainer > .movingComment:hover {transition-duration: 9999s !important; left: 0 !important; background-color: rgba(200, 0, 0, 0.4); }' +
    '#floatComments > .comment:hover { background-color: rgba(200, 0, 0, 0.4); }' +
    'div[class^="styles__comment-list-wrapper"] p[class^="styles__message"]:hover {background-color: rgba(200, 0, 0, 0.2); }',
    preWord = {},
    defaultListComment, listComment, scrollComment, interval;
  start();
})();
