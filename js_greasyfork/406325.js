// ==UserScript==
// @name         cytube_emote_float_window
// @namespace    https://cytube.xyz/
// @version      0.16
// @description  エモートを小窓で表示
// @author       utubo
// @match        *://cytube.xyz/*
// @match        *://cytube.mm428.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406325/cytube_emote_float_window.user.js
// @updateURL https://update.greasyfork.org/scripts/406325/cytube_emote_float_window.meta.js
// ==/UserScript==
// cytubeならjQueryもjQuryUIも読み込まれてるはずだから@requireしないでいいか…

// ↓みたいな感じでEMOTE_FLOAT_WINDOW_TABSを定義するとタブ分けするよ
// EMOTE_FLOAT_WINDOW_TABS = { "タブの名前" : ["エモート名", "エモート名"], "タブの名前" : ["エモート名", "エモート名"] };

// ↓みたいに設定するとALLタブが逆順になるよ
// EMOTE_FLOAT_WINDOW_REVERSE = true;

(window.unsafeWindow || window).eval(` // ← チャンネルのJSにセットするときはこの行(と最後の行)を削除
(function() {
// 2重起動されたら古いのはクリアする(位置とサイズは覚えておく)
var emoteFloatWindow = $('#GM_efw_window');
var offset = null;
var width = 500;
var height = 160;
if (emoteFloatWindow[0]) {
  var o = emoteFloatWindow.offset();
  if (o.left || o.top) { // 座標が(0,0)の場合は一度も表示されてない状態なので位置情報は無視する
    offset = o;
    width = emoteFloatWindow.width();
    height = emoteFloatWindow.height();
  }
  emoteFloatWindow.remove();
  $('#GM_efw_button').remove();
  $('#GM_efw_style').remove();
}

// スタイルシート
$('head').append('<style id="GM_efw_style">' +
  'body { position: relative; }' +
  '#GM_efw_window {' +
    'position: absolute;' +
    'z-index: 2;' +
    'top: 10px;' +
    'left: 10px;' +
    'width: ' + width + 'px;' +
    'height: ' + height + 'px;' +
    'overflow: hidden;' +
    'border: 1px solid;' +
    'padding: 10px;' +
    'display: none;' +
  '}' +
  '#GM_efw_content {' +
    'width:100%;height:100%;overflow:auto;' +
  '}' +
  '.GM_efw_tabcontainer {' +
    'display: flex; flex-direction: column;width: 100%;height: 100%' +
  '}' +
  '.GM_efw_tabbar {' +
    'border-bottom: 1px solid;' +
  '}' +
  '.GM_efw_tab {' +
    'padding: 2px 4px; border-right: 1px solid; cursor: pointer; display: inline-block;' +
  '}' +
  '.GM_efw_tabpage {' +
    'display:none; padding-top: 6px; flex-grow: 1; overflow: auto;' +
  '}' +
  '.GM_efw_emote {' +
    'max-width:50px;max-height:50px;vertical-align:bottom;' +
  '}' +
'</style>');

// ボタン初回クリック時の位置設定
var setupSartPosition = () => {
  var btn = $('#GM_efw_button');
  offset = btn.offset();
  offset.left += 30 + window.scrollX;
  offset.top += -10 + window.scrollY;
  emoteFloatWindow.offset(offset);
  width = Math.min(width, $('#leftcontrols').width());
  emoteFloatWindow.width(width);
};

// フロートウィンドウの外枠を作成
emoteFloatWindow = $('<div id="GM_efw_window"><div id="GM_efw_content"></div>').appendTo($('body'));
if (offset) {
  emoteFloatWindow.offset(offset);
}
emoteFloatWindow
  .resizable()
  .draggable({
    scroll: false,
    distance: 3, // ペンタブだとちょっと遊びが欲しい…
    stop: function(e, ui) {
      // windowリサイズで位置がおかしくならないようにする
      var p = ui.helper.parent();
      var x = ui.position.left / p.width() * 100;
      var y = ui.position.top / p.height() * 100;
      ui.helper.css('left', x + '%');
      ui.helper.css('top', y + '%');
    }
  })
;

// クリックorダブルクリックしたときの処理
var chatline = $('#chatline');
var singleClickEventTimer = null;
emoteFloatWindow.click(ev => { // xx.on("click",xx だとドラッグ後にclickイベントが動いちゃうみたい
  if (ev.target.className === 'GM_efw_emote') {
    var title = ev.target.getAttribute('title');
    singleClickEventTimer = setTimeout(() => {
      var value = chatline[0].value;
      chatline[0].value = value + (value ? ' ' : '') + title;
    }, 100);
    return;
  }
  if (ev.target.className === 'GM_efw_tab') {
    switchTab(ev.target.textContent);
    return;
  }
});
emoteFloatWindow.on('dblclick', '.GM_efw_emote', ev => {
  clearTimeout(singleClickEventTimer);
  var evt = $.Event('keydown');
  evt.keyCode = 13;
  chatline.trigger(evt);
});

// タブ関係
var tabs = null;
var tabbar = null;
var tabpages = null;
var initTab = target => {
  tabs = window.EMOTE_FLOAT_WINDOW_TABS;
  tabbar = $('<div class="GM_efw_tabbar"></div>');
  tabbar.appendTo(target);
  tabpages = [];
};
var makeTab = tabName => $('<span class="GM_efw_tab">' + tabName + '</span>');
var makeTabpage = tabName => $('<div title="' + tabName + '" class="GM_efw_tabpage"></div>');
var switchTab = tabName => {
  for (var tab of tabpages) {
    tab.toggle(tab.attr('title') == tabName);
  }
};

// リスト更新
var content = $('#GM_efw_content');
var appendEmote = (emote, target) => {
  $('<img class="GM_efw_emote" title="' + emote.name + '" src="' + emote.image + '">').appendTo(target);
};
var refreshList = () => {
  emoteFloatWindow.css('backgroundColor', getComputedStyle(document.body, null).getPropertyValue('background-color'));
  content.empty();
  var fragment = $(document.createDocumentFragment());
  var emotes = window.EMOTE_FLOAT_WINDOW_REVERSE ? CHANNEL.emotes.reverse() : CHANNEL.emotes;
  for (var emote of emotes) {
    appendEmote(emote, fragment);
  }
  if (!window.EMOTE_FLOAT_WINDOW_TABS) {
    // タブなし
    fragment.appendTo(content);
    return;
  }
  // タブあり
  tabcontainer = $('<div class="GM_efw_tabcontainer"></div>');
  initTab(tabcontainer);
  // 全部入りのタブ
  makeTab('ALL').appendTo(tabbar);
  const all = makeTabpage('ALL').show().appendTo(tabcontainer);
  fragment.appendTo(all);
  tabpages.push(all);
  // カテゴライズされたタブ
  const addedEmotes = [];
  for (var tabName in tabs) {
    makeTab(tabName).appendTo(tabbar);
    const tabpage = makeTabpage(tabName);
    for (const name of tabs[tabName]) {
      const emote = CHANNEL.emoteMap[name];
      if (!emote) {
        console.log("EMOTE NOT FOUND. " + name);
        continue;
      }
      appendEmote(emote, tabpage);
      addedEmotes.push(name);
    }
    tabpage.appendTo(tabcontainer);
    tabpages.push(tabpage);
  }
  // その他タブ
  const others = Object.keys(CHANNEL.emoteMap).filter(v=> !addedEmotes.includes(v));
  if (others) {
    makeTab('...').appendTo(tabbar);
    const tabpage = makeTabpage('...');
    for (const name of others) {
      appendEmote(CHANNEL.emoteMap[name], tabpage);
    }
    tabpage.appendTo(tabcontainer);
    tabpages.push(tabpage);
  }
  // できあがり
  tabcontainer.appendTo(content);
};

// 表示切替ボタン
$('<button id="GM_efw_button" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-new-window"></span></button>')
  .on('click', ev => {
    if (emoteFloatWindow.css('display') == 'none') {
      refreshList();
      if (!offset) { setupSartPosition(); }
    }
    emoteFloatWindow.toggle();
  })
  .insertAfter($('#emotelistbtn'))
;
})();
`); // ← チャンネルのJSにセットするときはこの行も削除