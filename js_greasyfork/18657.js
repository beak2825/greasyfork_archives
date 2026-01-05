// ==UserScript==
// @name        利用可能なBBCodeのボタンを追加する。 - Minecraft非公式日本ユーザーフォーラム
// @namespace   qpwakaba
// @description ボタンには存在していないが利用することができるBBCodeの挿入ボタンを追加します。
// @include     http://forum.minecraftuser.jp/posting.php*
// @include     https://forum.minecraftuser.jp/posting.php*
// @include     http://forum.minecraftuser.jp/ucp.php?i=profile&mode=signature
// @include     https://forum.minecraftuser.jp/ucp.php?i=profile&mode=signature
// @include     http://forum.minecraftuser.jp/ucp.php?i=175
// @include     https://forum.minecraftuser.jp/ucp.php?i=175
// @include     http://forum.minecraftuser.jp/ucp.php?i=pm*
// @include     https://forum.minecraftuser.jp/ucp.php?i=pm*
// @version     1.2
// @grant       none
// @Lisence     CC-BY-NC
// @downloadURL https://update.greasyfork.org/scripts/18657/%E5%88%A9%E7%94%A8%E5%8F%AF%E8%83%BD%E3%81%AABBCode%E3%81%AE%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B%E3%80%82%20-%20Minecraft%E9%9D%9E%E5%85%AC%E5%BC%8F%E6%97%A5%E6%9C%AC%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A9%E3%83%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/18657/%E5%88%A9%E7%94%A8%E5%8F%AF%E8%83%BD%E3%81%AABBCode%E3%81%AE%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B%E3%80%82%20-%20Minecraft%E9%9D%9E%E5%85%AC%E5%BC%8F%E6%97%A5%E6%9C%AC%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A9%E3%83%A0.meta.js
// ==/UserScript==
var _window = this.unsafeWindow || window;
(function(window, document) {
  var styleElement = document.createElement("style");
  styleElement.id = "additionalStyle";
  styleElement.innerHTML = ".additionalButtons {display: none !important;}";
  
  var isShown;
  window.showAdditionalButtons = function() {
    styleElement.parentNode.removeChild(styleElement);
    isShown = true;
  };
  window.hideAdditionalButtons = function() {
    document.getElementsByTagName("head")[0].appendChild(styleElement);
    isShown = false;
  };
  window.toggleShowAdditionalButtons = function() {
    if(isShown) {
      hideAdditionalButtons();
    } else {
      showAdditionalButtons();
    }
  };
  hideAdditionalButtons();
  
  var parentId = "format-buttons";
  var parent = document.getElementById(parentId);
  
  var showButton = document.createElement("input");
  showButton.setAttribute("class", "button2");
  showButton.setAttribute("value", "追加ボタンの表示/非表示");
  showButton.setAttribute("onclick", "toggleShowAdditionalButtons()");
  showButton.setAttribute("title", "ユーザースクリプトによって追加されたボタンの表示/非表示を切り替えます。");
  showButton.setAttribute("type", "button");
  parent.appendChild(showButton);
  var addBox = function(id, isFirst) {
    var child = document.createElement("div");
    child.id = id;
    if(isFirst) {
      child.style.marginTop = "3px"
    }
    parent.appendChild(child);
  };
  var addButton = function(parentId, value, open, close, help) {
    var parent = document.getElementById(parentId);
    var button = document.createElement("input");
    button.setAttribute("class", "button2 additionalButtons");
    button.setAttribute("value", value);
    button.setAttribute("onclick", "bbfontstyle('" + open + "', '" + close + "')");
    if(help) {
     button.setAttribute("title", help);
    }
    button.setAttribute("type", "button");
    button.style.marginRight = "4px";
    parent.appendChild(button);
  };
  var addCustomButton = function(parentId, value, onclick, help, style) {
    var parent = document.getElementById(parentId);
    var button = document.createElement("input");
    button.setAttribute("class", "button2 additionalButtons");
    button.setAttribute("value", value);
    button.setAttribute("onclick", onclick);
    if(help) {
     button.setAttribute("title", help);
    }
    button.setAttribute("type", "button");
    button.setAttribute("style", style);
    button.style.marginRight = "4px";
    parent.appendChild(button);
  };
  var id = "additionalButtons";
  addBox(id, true);
    addButton(id, "em", "[em]", "[/em]", "範囲を強調します。");
    addButton(id, "del", "[del]", "[/del]", "範囲に抹消線を引きます。");
    addButton(id, "head", "[head]", "[/head]", "挟んだ文章を見出しのように表示します。");
    addButton(id, "hr", "[hr]", "[/hr]", "水平線を挿入します。");
    addButton(id, "center", "[center]", "[/center]", "範囲をページ中央にセンタリングします。");
    addButton(id, "bg=", "[bg=]", "[/bg]", "範囲を指定した背景色で表示します");
    addButton(id, "bg2=", "[bg2=]", "[/bg2]", "範囲を指定した背景色で表示しますが、横幅は100%固定です。");
    addButton(id, "bg3=", "[bg3=]", "[/bg3]", "bg2内で使用するにはこちらを使用してください。");
    addButton(id, "padding", "[padding]", "[/padding]", "5ピクセルの余白を挿入します。");
    addButton(id, "img2", "[img2 width=]", "[/img2]", "幅を指定して画像を挿入します。単位はピクセルです。");
    addButton(id, "img3", "[img3 width=]", "[/img3]", "幅を指定して画像を挿入します。単位はパーセントです。");
    addButton(id, "table", "[table]", "[/table]", "表を挿入します。これだけでは意味を持たないので\ntr/th/tdと組み合わせてください。");
    addButton(id, "tr", "[tr]", "[/tr]", "行を挿入します。");
    addButton(id, "th", "[th]", "[/th]", "見出しとなるセルを挿入します。");
    addButton(id, "td", "[td]", "[/td]", "通常のセルを挿入します。");
    addButton(id, "field=", "[field=]", "[/field]", "= に続けて見出しを、タグ内に文章を書くことでフィールド表示にできます。");
    addButton(id, "note", "[note]", "[/note]", "ノート風表示になります。背景白で等幅フォントになります。");
    addButton(id, "comment", "[comment]", "[/comment]", "内容をコメントアウトできます。");
    addButton(id, "ruby=", "[ruby=]", "[/ruby]", "ルビ(ふりがな)を入力します。");
    addCustomButton(id, "BBCodeの使い方", "window.open('http://forum.minecraftuser.jp/viewtopic.php?f=4&t=4')", "BBCodeの使い方を開きます。", "font-weight: bold;");
  id = "creativeCommons";
  addBox(id, false);
    addButton(id, "CC-BY (表示)", "[ccby]", "[/ccby]", "クリエイティブ・コモンズ CC-BY 準拠表示を挿入します。");
    addButton(id, "CC-BY-SA (表示-継承)", "[ccsa]", "[/ccsa]", "クリエイティブ・コモンズ CC-BY-SA 準拠表示を挿入します。");
    addButton(id, "CC-BY-ND (表示-改変禁止)", "[ccnd]", "[/ccnd]", "クリエイティブ・コモンズ CC-BY-ND 準拠表示を挿入します。");
    addButton(id, "CC-BY-NC (表示-非営利)", "[ccnc]", "[/ccnc]", "クリエイティブ・コモンズ CC-BY-NC 準拠表示を挿入します。");
    addButton(id, "CC-BY-NC-SA (表示-非営利-継承)", "[ccca]", "[/ccca]", "クリエイティブ・コモンズ CC-BY-NC-SA 準拠表示を挿入します。");
    addButton(id, "CC-BY-NC-ND (表示-非営利-改変禁止)", "[cccd]", "[/cccd]", "クリエイティブ・コモンズ CC-BY-NC-ND 準拠表示を挿入します。");

})(_window, document);