// ==UserScript==
// @name     メール欄があるレスだけ表示
// @version  2.35
// @grant    none
// @include  https://*.2chan.net/*/res/*
// @include  http://*.2chan.net/*/res/*
// @description ふたばのスレでメール欄が入力されているレスのリストを表示します
// @namespace https://greasyfork.org/users/114367
// @downloadURL https://update.greasyfork.org/scripts/372038/%E3%83%A1%E3%83%BC%E3%83%AB%E6%AC%84%E3%81%8C%E3%81%82%E3%82%8B%E3%83%AC%E3%82%B9%E3%81%A0%E3%81%91%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/372038/%E3%83%A1%E3%83%BC%E3%83%AB%E6%AC%84%E3%81%8C%E3%81%82%E3%82%8B%E3%83%AC%E3%82%B9%E3%81%A0%E3%81%91%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

// ----------------------------------------
// 設定
var CONFIG = {
  // ページ読み込み時の動作
  onPageLoaded: {
    // 自動起動する
    autoStart: true,
    // メールアドレスが0件でも「✉ x 0」と表示する
    show0Count: false,
    // ページ表示時にアドオンが処理を完了るまで待つ時間です(ミリ秒)調子が悪いときは増やしてみて
    waitForAddonMsec: 2500
  },
  // 表示設定
  // n件以上になったら一度すべて折りたたむ(常に折りたたみモードにしたいときは0を設定)
  countOfMailsToCompactMode: 5,
  // その他の設定
  // 除外するメールアドレスの正規表現
  ignoreRegex: /^sage$/,
  // ボタンの文字とか
  text: {
    mailButton: '✉',
    mailCount: '✉ x ${count}',
    flag: '🚩'
  }
};

// ----------------------------------------
// CSS
var css = `
  /* ✉ボタン */
  .ML-toggle-btn {
    cursor: pointer;
  }
  .ML-toggle-btn-on {
    color: #0040ee;
  }
  .ML-toggle-btn::before {
    color: #800;
    content: ' [';
  }
  .ML-toggle-btn::after {
    color: #800;
    content: '] ';
  }
  /* リストの表示位置とか */
  .ML-list-container {
    bottom: 20px;
    display: block;
    font-size: 12px;
    position: fixed;
    right: 2px;
    transition: .2s;
    overflow: hidden;
    width: 300px;
    z-index: 99;
  }
  .ML-scrollview {
    max-height: calc(100vh - 60px);
    transition: width .2s .2s;
    overflow-x: hidden;
    overflow-y: auto;
    width: 320px;
  }
  .ML-scrollview:hover {
    width: 300px;
  }
  /* 件数表示 */
  .ML-count-label {
    cursor: pointer;
    /* その他のスタイルはML-resと一緒に定義してます */
  }
  /* 全て折りたたみボタン */
  .ML-compact-all-btn {
    bottom: 10px;
    cursor: pointer;
    display: block;
    height: 18px;
    position: absolute;
    right: 14px;
    user-select: none;
    width: 18px;
  }
  .ML-compact-all-btn::after {
    border-bottom: 2px solid;
    border-right: 2px solid;
    content: " ";
    cursor: pointer;
    display: block;
    height: 6px;
    left: 5px;
    position: absolute;
    top: 3px;
    transform: rotate(45deg);
    user-select: none;
    width: 6px;
  }
  .ML-compact-all-btn:hover {
    color: #0040ee;
  }
  /* 折りたたみ固定モード */
  .ML-compactmode-on>.ML-count-label {
    background: #ade9 !important;
  }
  .ML-compactmode-on>.ML-compact-all-btn {
    color: #0040ee;
  }
  /* レス */
  @keyframes ML-fadein {
    0% { opacity: 0; transform: translate(-24px, 0); }
    100% { opacity: 1;  transform: translate(0, 0); }
  }
  .ML-res, .ML-count-label { /* 件数表示のスタイルも一緒 */
    animation: ML-fadein .4s;
    background: #ccc9;
    border-radius: 5px;
    color: #800;
    margin: 5px;
    max-width: calc(100% - 20px);
    padding: 5px;
    position: relative;
    transition: background-color .3s;
    width: 280px;
  }
  .ML-titlebar {
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
  }
  /* 旗 */
  .ML-flag {
    display: inline-block;
    float: right;
    height: 100%;
    overflow: hidden;
    opacity: 0;
    transform: rotate(45deg);
    transform-origin: left bottom;
    transition: .2s .2s;
    user-select: none;
    vertical-align: bottom;
  }
  .ML-titlebar:hover>.ML-flag,
  .ML-flag-on {
    opacity: .9;
    transform: rotate(0);
  }
  .ML-flag-on {
    float:unset;
  }
  /* メールアドレス */
  .ML-mail {
    color: #0040ee;
    cursor: pointer;
  }
  .ML-mail:hover {
    text-decoration: underline;
  }
  /* レス本文 */
  .ML-text-list {
    max-height: calc(25vh - 50px);
    overflow: auto;
  }
  .ML-text {
    animation: ML-fadein .5s;
    border-top: 1px dotted #0005;
    font-size: 90%;
    margin: 0;
    padding: 5px;
    width: auto;
    word-break: break-all;
  }
  /* レス折りたたみ */
  .ML-min {
    max-height: 16px;
    overflow: hidden;
  }
  .ML-min>.ML-text-list {
    visibility: hidden;
  }
  .ML-has-new {
    background: #bea9;
  }
  .ML-text-last {
    display: none;
    padding-left: 8px;
    pointer-events: none;
  }
  .ML-min>.ML-titlebar>.ML-text-last {
    display: inline;
  }
  /* リストOFF時 */
  .ML-list-off {
    opacity: 0;
    pointer-events: none;
  }
`;
var style = document.createElement('STYLE');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// ----------------------------------------
// Utils
var newElement = (tag, clazz, text) => {
  var e = document.createElement(tag);
  e.className = clazz;
  if (text) {
    e.textContent = text;
  }
  return e;
};

// ----------------------------------------
// Properties
var mails = [];
var resList = {};
var show0Count = CONFIG.onPageLoaded.show0Count;
var needAutoCompact = true;
var compactMode = false;
var withAkafuku = false;
var withFutakuro = false;

// ----------------------------------------
// 全体の入れ物
var resListContainer = newElement('DIV', 'ML-list-container ML-list-off');
resListContainer.addEventListener('click', e => {
  if (e.target.parentNode.classList.contains('ML-min')) {
    e.target.parentNode.classList.remove('ML-min', 'ML-has-new');
    e.target.parentNode.scrollIntoView();
    return;
  }
  if (e.target.classList.contains('ML-titlebar')) {
    e.target.parentNode.classList.add('ML-min');
    return;
  }
  if (e.target.classList.contains('ML-mail')) {
    resList[e.target.textContent].mailElement.scrollIntoView({ behavior: 'smooth'});
    return;
  }
  if (e.target.classList.contains('ML-flag')) {
    e.target.classList.toggle('ML-flag-on');
    return;
  }
});
var scrollView = newElement('DIV', 'ML-scrollview');
resListContainer.appendChild(scrollView);

// 全て折りたたみボタン
var compactAllButton = newElement('DIV', 'ML-compact-all-btn');
var compactAll = e => {
  var resElements = document.getElementsByClassName('ML-res');
  // 全部折りたたむ
  if (e) {
    var isUpdated = false;
    for (let res of resElements) {
      if (res.classList.contains('ML-min')) continue;
      res.classList.add('ML-min');
      isUpdated = true;
    }
    if (isUpdated || e === true) return;
  }
  // 全部もとに戻す
  for (let res of resElements) {
    res.classList.remove('ML-min', 'ML-has-new');
  }
};
compactAllButton.addEventListener('click', compactAll);

// 件数表示部分
var countLabel = newElement('DIV', 'ML-count-label');
var refreshCountLabel = () => { countLabel.textContent = CONFIG.text.mailCount.replace('${count}', mails.length); };
var toggleCompactMode = e => {
  compactMode = (e === true || e === false) ? e : !compactMode;
  if (compactMode) {
    resListContainer.classList.add('ML-compactmode-on');
  } else {
    resListContainer.classList.remove('ML-compactmode-on');
  }
  compactAll(compactMode);
};
countLabel.addEventListener('click', toggleCompactMode);
refreshCountLabel();

resListContainer.appendChild(countLabel);
resListContainer.appendChild(compactAllButton);
document.body.appendChild(resListContainer);

// ----------------------------------------
// Main
var refleshList = () => {
  var rtds = document.getElementsByClassName('rtd');
  var newRtds = [];
  for (var i = rtds.length - 1, newRtd; newRtd = rtds[i]; i --) {
    var target = withAkafuku ? newRtd.getElementsByTagName('BLOCKQUOTE')[0] : newRtd; // 赤福spは[続きを読む]で最後のrtdの属性を全てコピーしてしまう
    // チェック済みの判断に属性を使ってます
    // 最後のレス番号を覚えておくという方法もあるけど、続き読むときにレスが削除されてると対応できないかもなので
    if (target.getAttribute('data-ML-checked')) break;
    target.setAttribute('data-ML-checked', '1');
    newRtds.unshift(newRtd);
  }
  var hasNewMail = false;
  newRtds.forEach(rtd => {
    var mailElement =
        withAkafuku && rtd.getElementsByClassName('akahuku_shown_mail')[0] || // akafuku
        withFutakuro && rtd.querySelector('[color="#005ce6"]') || // futakuro
        rtd.querySelector('[href^="mailto:"]') || // default
        rtd.getElementsByClassName('KOSHIAN_meran')[0]; // kosian
    if (!mailElement) return;
    var mail = mailElement.href ? decodeURI(mailElement.href).replace('mailto:', '') : mailElement.textContent.replace(/^\[|\]$/g, '');
    if (mail.match(CONFIG.ignoreRegex)) return;
    var res = resList[mail];
    if (!res) {
      mails.push(mail);
      hasNewMail = true;
      res = {
        resContainer: newElement('DIV', 'ML-res'),
        textList: newElement('DIV', 'ML-text-list'),
        lastText: newElement('DIV', 'ML-text-last')
      };
      if (compactMode) {
        res.resContainer.classList.add('ML-min');
      }
      resList[mail] = res;
      var titlebar = newElement('DIV', 'ML-titlebar', ' ');
      titlebar.appendChild(newElement('SPAN', 'ML-flag', CONFIG.text.flag));
      titlebar.appendChild(newElement('SPAN', 'ML-mail', mail));
      titlebar.appendChild(res.lastText);
      res.resContainer.appendChild(titlebar);
      res.resContainer.appendChild(res.textList);
      scrollView.appendChild(res.resContainer);
      res.resContainer.scrollIntoView();
    } else if (res.resContainer.classList.contains('ML-min')) {
      res.resContainer.classList.add('ML-has-new');
    }
    res.mailElement = mailElement;
    // BLOCKQUOTEタグを変なところにコピーすると一部のアドオンの動作がおかしくなるので本文はDIVにコピーする
    var text = newElement('DIV', 'ML-text');
    rtd.getElementsByTagName('BLOCKQUOTE')[0].childNodes.forEach(n => {
      if (n.tagName) {
        // アドオンで追加されたUIは除外する
        if (n.tagName === 'INPUT' || n.tagName === 'BUTTON') return;
        if (n.classList && n.classList.contains('akahuku_generated')) return;
      }
      text.appendChild(n.cloneNode(true));
    });
    res.textList.appendChild(text);
    res.textList.scrollTo(0, res.textList.scrollHeight);
    res.lastText.textContent = text.textContent;
  });
  if (show0Count || mails[0]) {
    if (hasNewMail) {
      refreshCountLabel();
    }
    resListContainer.classList.remove('ML-list-off');
  }
  if (needAutoCompact && CONFIG.countOfMailsToCompactMode <= mails.length) {
    needAutoCompact = false;
    toggleCompactMode(true);
  }
};

// ----------------------------------------
// DOMの監視
var timer;
var observer = new MutationObserver(rec => {
  clearTimeout(timer);
  // アドオンとかがNodeを弄るかもしれないので1秒くらい待つ
  timer = setTimeout(refleshList, 1000); // refleshListでNodeを追加するから2回動いちゃうけどまぁいっか！
});

// ----------------------------------------
// List ON OFF
var listOn = () => {
  refleshList();
  mailButton.classList.add('ML-toggle-btn-on');
  observer.observe(document.body, { childList: true, subtree: true });
};

var listOff = () => {
  observer.disconnect();
  resListContainer.classList.add('ML-list-off');
  mailButton.classList.remove('ML-toggle-btn-on');
};

var toggle = e => {
  if (resListContainer.classList.contains('ML-list-off')) {
    show0Count = true;
    listOn();
  } else {
    listOff();
  }
};

// [✉]ボタン
var mailButton = newElement('SPAN', 'ML-toggle-btn', CONFIG.text.mailButton);
var addMailButton = () => {
  mailButton.addEventListener('click', toggle);
  // ふたクロ
  var futakuroBorderArea = document.getElementById('border_area');
  if (futakuroBorderArea) {
    withFutakuro = true;
    futakuroBorderArea.appendChild(mailButton);
    return;
  }
  // 赤福SP
  var akahukuReloadStatusButton = document.getElementById('akahuku_reload_status');
  if (akahukuReloadStatusButton) {
    withAkafuku = true;
    akahukuReloadStatusButton.parentNode.insertBefore(mailButton, akahukuReloadStatusButton);
    return;
  }
  // デフォルト
  document.getElementById('contres').insertBefore(mailButton, document.getElementById('contdisp').nextSibling);
};

// ----------------------------------------
// Start HERE !
setTimeout(() => {
  addMailButton();
  if (CONFIG.onPageLoaded.autoStart) {
    listOn();
  }
}, CONFIG.onPageLoaded.waitForAddonMsec); // wait for Add-on
