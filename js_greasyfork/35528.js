// ==UserScript==
// @name        nicorepo-filter
// @namespace   hommax39.com
// @description ニコニコ動画のマイページのニコレポをフィルタするユーザースクリプトです。
// @noframes
// @match       http://www.nicovideo.jp/my
// @match       http://www.nicovideo.jp/my/top
// @match       http://www.nicovideo.jp/my/top/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     1.0.8
// @downloadURL https://update.greasyfork.org/scripts/35528/nicorepo-filter.user.js
// @updateURL https://update.greasyfork.org/scripts/35528/nicorepo-filter.meta.js
// ==/UserScript==

// Configuration page
GM_config.init(
{
  'id': 'nicorepo-filter',
  'fields':
  {
    // 動画
    'log-user-video-upload':
    {
      'label': '投稿',
      'section': ['動画'],
      'type': 'checkbox',
      'default': true
    },
    'log-user-video-round-number-of-view-counter':
    {
      'label': 'キリ番',
      'type': 'checkbox',
      'default': true
    },
    'log-user-video-review':
    {
      'label': '動画レビュー',
      'type': 'checkbox',
      'default': true
    },
    // マイリスト
    'log-user-mylist-add':
    {
      'label': '動画',
      'section': ['マイリスト'],
      'type': 'checkbox',
      'default': true
    },
    'log-user-mylist-add-blomaga':
    {
      'label': 'ブロマガ',
      'type': 'checkbox',
      'default': true
    },
    'log-user-mylist-add-manga-episode':
    {
      'label': 'マンガ',
      'type': 'checkbox',
      'default': true
    },
    // 生放送
    'log-user-live-broadcast':
    {
      'label': '開始',
      'section': ['生放送'],
      'type': 'checkbox',
      'default': true
    },
    'log-user-live-reserve':
    {
      'label': '予約',
      'type': 'checkbox',
      'default': true
    },
    'log-user-live-video-introduced':
    {
      'label': '紹介',
      'type': 'checkbox',
      'default': true
    },
    // イラスト
    'log-user-seiga-image-upload':
    {
      'label': '投稿',
      'section': ['イラスト'],
      'type': 'checkbox',
      'default': true
    },
    'log-user-seiga-image-clip':
    {
      'label': 'クリップ',
      'type': 'checkbox',
      'default': true
    },
    // ブロマガ
    'log-user-register-chblog':
    {
      'label': '投稿',
      'section': ['ブロマガ'],
      'type': 'checkbox',
      'default': true
    },
    // ニコニ広告
    'log-user-uad-advertise':
    {
      'label': '宣伝',
      'section': ['ニコニ広告'],
      'type': 'checkbox',
      'default': true
    },
    // スタンプ
    'log-user-action-stamp':
    {
      'label': '取得',
      'section': ['スタンプ'],
      'type': 'checkbox',
      'default': true
    },
    // コミュニティ
    'log-community-video-upload':
    {
      'label': '動画',
      'section': ['コミュニティ'],
      'type': 'checkbox',
      'default': true
    },
    'log-community-live-broadcast':
    {
      'label': '生放送開始',
      'type': 'checkbox',
      'default': true
    },
    'log-community-live-reserve':
    {
      'label': '生放送予約',
      'type': 'checkbox',
      'default': true
    },
    'log-community-register-chblog':
    {
      'label': 'ブロマガ投稿',
      'type': 'checkbox',
      'default': true
    },
    'log-community-action-level':
    {
      'label': 'コミュニティレベル',
      'type': 'checkbox',
      'default': true
    },
    // その他
    'log-reslist':
    {
      'label': 'ニコレポコメント',
      'section': ['全般'],
      'type': 'checkbox',
      'default': true
    }
  }
});
GM_registerMenuCommand("ニコレポフィルタの設定", function() { GM_config.open(); });

// User Script funcitons
exportFunction(function() {
  // Objectのままだとうまく値が渡せなかったため、JSONに変換
  return JSON.stringify(GM_config);
}, unsafeWindow, {defineAs: 'gm_config'});

// Content Page scripts

// 以下のfunctionを対象ページに埋め込んで、即時実行させる。
var execute_function = function($){
  var GM_config = JSON.parse(gm_config());
  var deny_elem_selectors = [];
  for (var prop in GM_config.fields) {
    if (!GM_config.fields.hasOwnProperty(prop)) {
      continue;
    }
    if (!GM_config.fields[prop].value) {
      deny_elem_selectors.push('div.' + prop);
    }
  }

  // 最後に読み込んだニコレポの一覧で、フィルターにヒットする記事を非表示にする。
  function hide_denied_elements(timelineNode) {
    $.each(deny_elem_selectors, function (i, selector) {
      $(timelineNode).find(selector).each(function (j, elem) {
        $(elem).hide();
      });
    });
  }
  // 先頭に表示されている記事の上にある水平線を消す
  function remove_head_line_from_first_elem(timelineNode) {
    var first_elem = $(timelineNode).children(':visible');
    if (first_elem.length > 0) {
      first_elem.first().addClass('first');
    }
  }

  // 初回のページ表示時に1回だけ実行。
  hide_denied_elements($('#nicorepo > div.articleBody > div.nicorepo > div.nicorepo-page > div.timeline')[0]);
  remove_head_line_from_first_elem($('#nicorepo > div.articleBody > div.nicorepo > div.nicorepo-page > div.timeline')[0]);

  var mo = new MutationObserver(function(mrArray) {
    for (var i = 0; i < mrArray.length; i++) {
      var mr = mrArray[i];
      if (mr.type != 'childList') {
        continue;
      }
      if (mr.addedNodes.length < 1) {
        // elements removed
        continue;
      }

      var addedNode = mr.addedNodes[0];
      var timelineNode;
      if (addedNode.tagName === 'DIV' && $.inArray('nicorepo-page', addedNode.classList) >= 0) {
          // clicked
        timelineNode = $(addedNode).children('div.timeline')[0];
      } else if (addedNode.tagName === 'DIV' && $.inArray('log', addedNode.classList) >= 0) {
        // loaded by Autopager
        timelineNode = $('#nicorepo > div.articleBody > div.nicorepo > div.nicorepo-page > div.timeline')[0];
      } else {
        continue;
      }

      hide_denied_elements(timelineNode);
      remove_head_line_from_first_elem(timelineNode);
      break;
    }
  });
  mo.observe($('#nicorepo > div.articleBody > div.nicorepo')[0], {childList: true});
  mo.observe($('#nicorepo > div.articleBody > div.nicorepo > div.nicorepo-page > div.timeline')[0], {childList: true});
};
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = '(' + execute_function + ')(jQuery);';
document.body.appendChild(script);
// スクリプト実行後、不要なスクリプトは削除しておく
document.body.removeChild(script);
