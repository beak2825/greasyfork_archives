// ==UserScript==
// @name        TweetDeck-PakuTwi
// @namespace   tadamonohoshi
// @description Copy the tweet in TweetDeck.
// @version     0.2
// @grant       none
// @include     https://tweetdeck.twitter.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/38805/TweetDeck-PakuTwi.user.js
// @updateURL https://update.greasyfork.org/scripts/38805/TweetDeck-PakuTwi.meta.js
// ==/UserScript==
(function() {
  // 設定
  var DEBUG_MODE = false;      // デバッグモード
  var PAKU_WITH_FAV = true;    // ふぁぼってパクる
  
  var FLG = true; // 初期化用フラグ
  
  function pakuTwi(e) {
    var parent;    // ツイート本体
    var replyElem; // リプライ判定用要素
    var text;      // ツイート文字列
    var evt;       // イベントオブジェクト
    
    // Ctrl・Shiftキー判定
    if (e.ctrlKey) {
      debug('Ctrl Mode On');
    }
    if (e.shiftKey) {
      debug('Shift Mode On');
    }
    
    // ツイート本体を取得
    parent = $(e.target).parents('.js-tweet');
    
    // ツイートの文字列を取得
    text = $(parent).find('.tweet-text').html();
    
    // 絵文字、URLを変換後、HTMLタグを除去
    text = text.replace(/<img class="emoji" draggable="false" alt="([^"]*)" src="([^"]*)">/g, '$1')
    .replace(/<a href="([^"]*)" target="_blank" class="url-ext"[^>]*>[^<]*<\/a>/g, '$1')
    .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    
    // "&"・"<"・ ">"の置換
    text = text.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
    
    // Shiftキー押しながらで本文中の@username書き換え (試験的)
    if (e.shiftKey) {
      // 元ツイート主の@usernameを取得
      var tweetBy = $(parent).find('.username').html().match(/@[a-zA-Z0-9_]{1,15}/g);
      if (tweetBy) {
        // うまく取得できたら本文中の@usernameを元ツイート主のもので書き換え
        text = text.replace(/@[a-zA-Z0-9_]{1,15}/g, tweetBy);
      }
    }
    
    // リプライ処理
    replyElem = $(parent).find('.other-replies');
    if (!e.shiftKey && replyElem.length > 0) {
      var replyTo = replyElem.html().match(/@[a-zA-Z0-9_]{1,15}/g);
      var unInText = text.match(/@[a-zA-Z0-9_]{1,15}/g);
      
      debug('Reply To: ' + replyTo.join(' '));
      if (!unInText) {
        // 本文中に@usernameを含まない場合: @usernameを先頭に付加
        text = replyTo.join(' ') + ' ' + text;
      } else {
        // 本文中に@usernameを含む場合: リプライ相手の@usernameが本文中になければリストに追加
        var unList = [];
        replyTo.forEach(function(un) {
          var idx = unInText.indexOf(un);
          if (idx < 0) {
            unList.push(un);
          }
        });
        // リストが空でなければリスト内の@usernameを先頭に付加
        if (unList.length > 0) {
		      text = unList.join(' ') + ' ' + text;
        }
      }
    }
    
    // 入力エリアに文字列を挿入
    debug(text);
    $('textarea').val(text);
    
    // 入力エリアのchangeイベントを強制発火 (文字数カウントさせる)
    evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, false);
    $('textarea').get(0).dispatchEvent(evt);
    
    // ふぁぼる
    if (e.ctrlKey && PAKU_WITH_FAV) {
      $(parent).find('.js-icon-favorite').click();
    }
    
    // ツイートボタン押下
    if (e.ctrlKey) {
      $('.js-send-button').click();
    }
  }
  
  function debug(s) {
    if (DEBUG_MODE) {
      console.log(s);
    }
  }
  
  function appendButton(node) {
    var target; // ボタン挿入先
    var src;    // ボタンHTMLソース
    var item;   // ボタン
    
    // ボタン挿入先を取得
    target = $(node).find('.js-tweet-actions .tweet-action-item:nth-child(3)');
    
    // ボタンを定義
    src = '<li class="tweet-action-item pull-left margin-r--13 margin-l--1"><a class="tweet-action position-rel" href="#">パクる</a></li>';
    
    // ボタンを生成
    item = $(src).insertAfter(target);
    
    // ボタンにclickイベントのリスナーを設定
    $(item).find('a').get(0).addEventListener('click', pakuTwi);
  }
  
  while (FLG) {
    if ($('.application').length > 0) {
      // applicationクラスのDOMが生成されたらDOMの監視を開始
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            // 追加されたDOMがjs-stream-itemクラスであればボタン追加処理を実行
            if (node.nodeType == node.ELEMENT_NODE && node.classList.contains('js-stream-item')) {
              appendButton(node);
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      FLG = false;
    }
  }
})();