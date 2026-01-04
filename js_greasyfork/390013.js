// ==UserScript==
// @name         ForJoyTV +
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Disable ForJoyTV demo time restriction and watch without interruption
// @author       Hồng Minh Tâm
// @match        http*://play.forjoytv.com/*
// @icon         https://forjoytv.com/favicon.ico
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390013/ForJoyTV%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/390013/ForJoyTV%20%2B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var BM_MODE = window.BM_MODE || false;
  if (typeof GM_deleteValue == 'undefined') {
    BM_MODE = true;
    var GM_addStyle = function (css) {
      var style = document.createElement('style');
      style.textContent = css;
      document.getElementsByTagName('head')[0].appendChild(style);
    }
    var GM_deleteValue = function (name) {
      localStorage.removeItem(name);
    }
    var GM_getValue = function (name, defaultValue) {
      var value = localStorage.getItem(name);
      if (!value)
        return defaultValue;
      var type = value[0];
      value = value.substring(1);
      switch (type) {
        case 'b':
          return value == 'true';
        case 'n':
          return Number(value);
        default:
          return value;
      }
    }
    var GM_log = function (message) {
      console.log(message);
    }
    var GM_openInTab = function (url) {
      return window.open(url, "_blank");
    }
    var GM_registerMenuCommand = function (name, funk) {
      //todo
    }
    var GM_setValue = function (name, value) {
      value = (typeof value)[0] + value;
      localStorage.setItem(name, value);
    }
  }

  var uid = 'C2D9261F3D5753E74E97EB28FE2D8B26';
  var cid = '91B98A2141042FE4606EB761DE109BB7';
  var uinfo_id = 'Hồng Minh Tâm';
  var uinfo_confirmed = true;
  var uinfo_trial = false;
  var dataChanged = false;

  GM_addStyle([
    '.tv_channels { overflow: initial; }',
    '.tv_channels_items_wrapper, .ts_wrapper { height: 596px !important; }',
    '.tv_channels_search, .tv_epg_search { width: 100%; height: 54px; line-height: 54px; padding-left: 10px; padding-right: 10px; background-color: transparent; color: #ccc; font-size: 20px; border: 0; border-bottom: 1px solid #6a6a6a; }',
  ].join('\n'));

  function equalsArray(array1, array2) {
    if (!array2) {
      return false;
    }

    if (array1.length != array2.length) {
      return false;
    }

    for (var i = 0, l = array1.length; i < l; i++) {
      if (array1[i] instanceof Array && array2[i] instanceof Array) {
        if (!array1[i].equals(array2[i])) {
          return false;
        }
      } else if (array1[i] != array2[i]) {
        return false;
      }
    }
    return true;
  }

  function equalsObject(object1, object2) {
    if (object1 instanceof Array && object2 instanceof Array) {
      return equalsArray(object1, object2);
    } else if (!object1 || !object2) {
      return object1 === object2;
    }
    var propName;
    for (propName in object1) {
      if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
        return false;
      } else if (typeof object1[propName] != typeof object2[propName]) {
        return false;
      }
    }
    for(propName in object2) {
      if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
        return false;
      } else if (typeof object1[propName] != typeof object2[propName]) {
        return false;
      }
      if (!object1.hasOwnProperty(propName)) {
        continue;
      }

      if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
        if (!equalsArray(object1[propName], object2[propName])) {
          return false;
        }
      } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
        if (!equalsObject(object1[propName], object2[propName])) {
          return false;
        }
      } else if (object1[propName] != object2[propName]) {
        return false;
      }
    }
    return true;
  }

  function fillObject() {
    var o = arguments[0];
    for (var i = 1; i < arguments.length - 1; i++) {
      if (!o.hasOwnProperty(arguments[i])) {
        o[arguments[i]] = {};
      }
      if (i < arguments.length - 2) {
        o = o[arguments[i]];
      } else {
        if (!equalsObject(o[arguments[i]], arguments[i + 1])) {
          o[arguments[i]] = arguments[i + 1];
          dataChanged = true;
        }
      }
    }
  }

  var ConverterJP = (function () {
    function ConverterJP() {
      this.text = this.from = this.result = null;
      this.conversionTable = [
        {romaji: 'kkya', hiragana: 'っきゃ', katakana: 'ッキャ'},
        {romaji: 'kkyu', hiragana: 'っきゅ', katakana: 'ッキュ'},
        {romaji: 'kkyo', hiragana: 'っきょ', katakana: 'ッキョ'},
        {romaji: 'ssha', hiragana: 'っしゃ', katakana: 'ッシャ'},
        {romaji: 'sshu', hiragana: 'っしゅ', katakana: 'ッシュ'},
        {romaji: 'ssho', hiragana: 'っしょ', katakana: 'ッショ'},
        {romaji: 'ccha', hiragana: 'っちゃ', katakana: 'ッチャ'},
        {romaji: 'cchu', hiragana: 'っちゅ', katakana: 'ッチュ'},
        {romaji: 'ccho', hiragana: 'っちょ', katakana: 'ッチョ'},
        {romaji: 'hhya', hiragana: 'っひゃ', katakana: 'ッヒャ'},
        {romaji: 'hhyu', hiragana: 'っひゅ', katakana: 'ッヒュ'},
        {romaji: 'hhyo', hiragana: 'っひょ', katakana: 'ッヒョ'},
        {romaji: 'mmya', hiragana: 'っみゃ', katakana: 'ッミャ'},
        {romaji: 'mmyu', hiragana: 'っみゅ', katakana: 'ッミュ'},
        {romaji: 'mmyo', hiragana: 'っみょ', katakana: 'ッミョ'},
        {romaji: 'rrya', hiragana: 'っりゃ', katakana: 'ッリャ'},
        {romaji: 'rryu', hiragana: 'っりゅ', katakana: 'ッリュ'},
        {romaji: 'rryo', hiragana: 'っりょ', katakana: 'ッリョ'},
        {romaji: 'ggya', hiragana: 'っぎゃ', katakana: 'ッギャ'},
        {romaji: 'ggyu', hiragana: 'っぎゅ', katakana: 'ッギュ'},
        {romaji: 'ggyo', hiragana: 'っぎょ', katakana: 'ッギョ'},
        {romaji: 'jja', hiragana: 'っじゃ', katakana: 'ッジャ'},
        {romaji: 'jju', hiragana: 'っじゅ', katakana: 'ッジュ'},
        {romaji: 'jjo', hiragana: 'っじょ', katakana: 'ッジョ'},
        {romaji: 'bbya', hiragana: 'っびゃ', katakana: 'ッビャ'},
        {romaji: 'bbyu', hiragana: 'っびゅ', katakana: 'ッビュ'},
        {romaji: 'bbyo', hiragana: 'っびょ', katakana: 'ッビョ'},
        {romaji: 'ppya', hiragana: 'っぴゃ', katakana: 'ッピャ'},
        {romaji: 'ppyu', hiragana: 'っぴゅ', katakana: 'ッピュ'},
        {romaji: 'ppyo', hiragana: 'っぴょ', katakana: 'ッピョ'},
        {romaji: 'yye', hiragana: 'っいぇ', katakana: 'ッイェ'},
        {romaji: 'wwi', hiragana: 'っわぃ', katakana: 'ッウィ'},
        {romaji: 'wwe', hiragana: 'っわぇ', katakana: 'ッウェ'},
        {romaji: 'wwo', hiragana: 'っわぉ', katakana: 'ッウォ'},
        {romaji: 'vva', hiragana: 'っゔぁ', katakana: 'ッヴァ'},
        {romaji: 'vvi', hiragana: 'っゔぃ', katakana: 'ッヴィ'},
        {romaji: 'vve', hiragana: 'っゔぇ', katakana: 'ッヴェ'},
        {romaji: 'vvo', hiragana: 'っゔぉ', katakana: 'ッヴォ'},
        {romaji: 'ssi', hiragana: 'っすぃ', katakana: 'ッスィ'},
        {romaji: 'zzi', hiragana: 'っずぃ', katakana: 'ッズィ'},
        {romaji: 'sshe', hiragana: 'っしぇ', katakana: 'ッシェ'},
        {romaji: 'jje', hiragana: 'っじぇ', katakana: 'ッジェ'},
        {romaji: 'tti', hiragana: 'っとぃ', katakana: 'ッティ'},
        {romaji: 'ttu', hiragana: 'っとぅ', katakana: 'ットゥ'},
        {romaji: 'ddi', hiragana: 'っでぅ', katakana: 'ッディ'},
        {romaji: 'ddu', hiragana: 'っどぅ', katakana: 'ッドゥ'},
        {romaji: 'ttsa', hiragana: 'っつぁ', katakana: 'ッツァ'},
        {romaji: 'ttsi', hiragana: 'っつぃ', katakana: 'ッツィ'},
        {romaji: 'ttse', hiragana: 'っつぇ', katakana: 'ッツェ'},
        {romaji: 'ttso', hiragana: 'っつぉ', katakana: 'ッツォ'},
        {romaji: 'ffa', hiragana: 'っふぁ', katakana: 'ッファ'},
        {romaji: 'ffi', hiragana: 'っふぃ', katakana: 'ッフィ'},
        {romaji: 'ffe', hiragana: 'っふぇ', katakana: 'ッフェ'},
        {romaji: 'ffo', hiragana: 'っふぉ', katakana: 'ッフォ'},
        {romaji: 'ffyu', hiragana: 'っふゅ', katakana: 'ッフュ'},
        {romaji: 'hhye', hiragana: 'っひぇ', katakana: 'ッヒェ'},
        {romaji: 'kya', hiragana: 'きゃ', katakana: 'キャ'},
        {romaji: 'kyu', hiragana: 'きゅ', katakana: 'キュ'},
        {romaji: 'kyo', hiragana: 'きょ', katakana: 'キョ'},
        {romaji: 'sha', hiragana: 'しゃ', katakana: 'シャ'},
        {romaji: 'shu', hiragana: 'しゅ', katakana: 'シュ'},
        {romaji: 'sho', hiragana: 'しょ', katakana: 'ショ'},
        {romaji: 'cha', hiragana: 'ちゃ', katakana: 'チャ'},
        {romaji: 'chu', hiragana: 'ちゅ', katakana: 'チュ'},
        {romaji: 'cho', hiragana: 'ちょ', katakana: 'チョ'},
        {romaji: 'nya', hiragana: 'にゃ', katakana: 'ニャ'},
        {romaji: 'nyu', hiragana: 'にゅ', katakana: 'ニュ'},
        {romaji: 'nyo', hiragana: 'にょ', katakana: 'ニョ'},
        {romaji: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ'},
        {romaji: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ'},
        {romaji: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ'},
        {romaji: 'mya', hiragana: 'みゃ', katakana: 'ミャ'},
        {romaji: 'myu', hiragana: 'みゅ', katakana: 'ミュ'},
        {romaji: 'myo', hiragana: 'みょ', katakana: 'ミョ'},
        {romaji: 'rya', hiragana: 'りゃ', katakana: 'リャ'},
        {romaji: 'ryu', hiragana: 'りゅ', katakana: 'リュ'},
        {romaji: 'ryo', hiragana: 'りょ', katakana: 'リョ'},
        {romaji: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ'},
        {romaji: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ'},
        {romaji: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ'},
        {romaji: 'ja', hiragana: 'じゃ', katakana: 'ジャ'},
        {romaji: 'ju', hiragana: 'じゅ', katakana: 'ジュ'},
        {romaji: 'jo', hiragana: 'じょ', katakana: 'ジョ'},
        {romaji: 'bya', hiragana: 'びゃ', katakana: 'ビャ'},
        {romaji: 'byu', hiragana: 'びゅ', katakana: 'ビュ'},
        {romaji: 'byo', hiragana: 'びょ', katakana: 'ビョ'},
        {romaji: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ'},
        {romaji: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ'},
        {romaji: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ'},
        {romaji: 'ye', hiragana: 'いぇ', katakana: 'イェ'},
        {romaji: 'wi', hiragana: 'わぃ', katakana: 'ウィ'},
        {romaji: 'we', hiragana: 'わぇ', katakana: 'ウェ'},
        {romaji: 'wo', hiragana: 'わぉ', katakana: 'ウォ'},
        {romaji: 'va', hiragana: 'ゔぁ', katakana: 'ヴァ'},
        {romaji: 'vi', hiragana: 'ゔぃ', katakana: 'ヴィ'},
        {romaji: 've', hiragana: 'ゔぇ', katakana: 'ヴェ'},
        {romaji: 'vo', hiragana: 'ゔぉ', katakana: 'ヴォ'},
        {romaji: 'si', hiragana: 'すぃ', katakana: 'スィ'},
        {romaji: 'zi', hiragana: 'ずぃ', katakana: 'ズィ'},
        {romaji: 'she', hiragana: 'しぇ', katakana: 'シェ'},
        {romaji: 'je', hiragana: 'じぇ', katakana: 'ジェ'},
        {romaji: 'ti', hiragana: 'とぃ', katakana: 'ティ'},
        {romaji: 'tu', hiragana: 'とぅ', katakana: 'トゥ'},
        {romaji: 'di', hiragana: 'でぅ', katakana: 'ディ'},
        {romaji: 'du', hiragana: 'どぅ', katakana: 'ドゥ'},
        {romaji: 'tsa', hiragana: 'つぁ', katakana: 'ツァ'},
        {romaji: 'tsi', hiragana: 'つぃ', katakana: 'ツィ'},
        {romaji: 'tse', hiragana: 'つぇ', katakana: 'ツェ'},
        {romaji: 'tso', hiragana: 'つぉ', katakana: 'ツォ'},
        {romaji: 'fa', hiragana: 'ふぁ', katakana: 'ファ'},
        {romaji: 'fi', hiragana: 'ふぃ', katakana: 'フィ'},
        {romaji: 'fe', hiragana: 'ふぇ', katakana: 'フェ'},
        {romaji: 'fo', hiragana: 'ふぉ', katakana: 'フォ'},
        {romaji: 'fyu', hiragana: 'ふゅ', katakana: 'フュ'},
        {romaji: 'hye', hiragana: 'ひぇ', katakana: 'ヒェ'},
        {romaji: 'kka', hiragana: 'っか', katakana: 'ッカ'},
        {romaji: 'kki', hiragana: 'っき', katakana: 'ッキ'},
        {romaji: 'kku', hiragana: 'っく', katakana: 'ック'},
        {romaji: 'kke', hiragana: 'っけ', katakana: 'ッケ'},
        {romaji: 'kko', hiragana: 'っこ', katakana: 'ッコ'},
        {romaji: 'ssa', hiragana: 'っさ', katakana: 'ッサ'},
        {romaji: 'sshi', hiragana: 'っし', katakana: 'ッシ'},
        {romaji: 'ssu', hiragana: 'っす', katakana: 'ッス'},
        {romaji: 'sse', hiragana: 'っせ', katakana: 'ッセ'},
        {romaji: 'sso', hiragana: 'っそ', katakana: 'ッソ'},
        {romaji: 'tta', hiragana: 'った', katakana: 'ッタ'},
        {romaji: 'cchi', hiragana: 'っち', katakana: 'ッチ'},
        {romaji: 'ttsu', hiragana: 'っつ', katakana: 'ッツ'},
        {romaji: 'tte', hiragana: 'って', katakana: 'ッテ'},
        {romaji: 'tto', hiragana: 'っと', katakana: 'ット'},
        {romaji: 'hha', hiragana: 'っは', katakana: 'ッハ'},
        {romaji: 'hhi', hiragana: 'っひ', katakana: 'ッヒ'},
        {romaji: 'ffu', hiragana: 'っふ', katakana: 'ッフ'},
        {romaji: 'hhe', hiragana: 'っへ', katakana: 'ッヘ'},
        {romaji: 'hho', hiragana: 'っほ', katakana: 'ッホ'},
        {romaji: 'mma', hiragana: 'っま', katakana: 'ッマ'},
        {romaji: 'mmi', hiragana: 'っみ', katakana: 'ッミ'},
        {romaji: 'mmu', hiragana: 'っむ', katakana: 'ッム'},
        {romaji: 'mme', hiragana: 'っめ', katakana: 'ッメ'},
        {romaji: 'mmo', hiragana: 'っも', katakana: 'ッモ'},
        {romaji: 'yya', hiragana: 'っや', katakana: 'ッヤ'},
        {romaji: 'yyu', hiragana: 'っゆ', katakana: 'ッユ'},
        {romaji: 'yyo', hiragana: 'っよ', katakana: 'ッヨ'},
        {romaji: 'rra', hiragana: 'っら', katakana: 'ッラ'},
        {romaji: 'rri', hiragana: 'っり', katakana: 'ッリ'},
        {romaji: 'rru', hiragana: 'っる', katakana: 'ッル'},
        {romaji: 'rre', hiragana: 'っれ', katakana: 'ッレ'},
        {romaji: 'rro', hiragana: 'っろ', katakana: 'ッロ'},
        {romaji: 'wwa', hiragana: 'っわ', katakana: 'ッワ'},
        {romaji: 'wwi', hiragana: 'っゐ', katakana: 'ッヰ'},
        {romaji: 'wwe', hiragana: 'っゑ', katakana: 'ッヱ'},
        {romaji: 'wwo', hiragana: 'っを', katakana: 'ッヲ'},
        {romaji: 'gga', hiragana: 'っが', katakana: 'ッガ'},
        {romaji: 'ggi', hiragana: 'っぎ', katakana: 'ッギ'},
        {romaji: 'ggu', hiragana: 'っぐ', katakana: 'ッグ'},
        {romaji: 'gge', hiragana: 'っげ', katakana: 'ッゲ'},
        {romaji: 'ggo', hiragana: 'っご', katakana: 'ッゴ'},
        {romaji: 'zza', hiragana: 'っざ', katakana: 'ッザ'},
        {romaji: 'jji', hiragana: 'っじ', katakana: 'ッジ'},
        {romaji: 'zzu', hiragana: 'っず', katakana: 'ッズ'},
        {romaji: 'zze', hiragana: 'っぜ', katakana: 'ッゼ'},
        {romaji: 'zzo', hiragana: 'っぞ', katakana: 'ッゾ'},
        {romaji: 'dda', hiragana: 'っだ', katakana: 'ッダ'},
        {romaji: 'jji', hiragana: 'っぢ', katakana: 'ッヂ'},
        {romaji: 'ddzu', hiragana: 'っづ', katakana: 'ッヅ'},
        {romaji: 'dde', hiragana: 'っで', katakana: 'ッデ'},
        {romaji: 'ddo', hiragana: 'っど', katakana: 'ッド'},
        {romaji: 'bba', hiragana: 'っば', katakana: 'ッバ'},
        {romaji: 'bbi', hiragana: 'っび', katakana: 'ッビ'},
        {romaji: 'bbu', hiragana: 'っぶ', katakana: 'ッブ'},
        {romaji: 'bbe', hiragana: 'っべ', katakana: 'ッベ'},
        {romaji: 'bbo', hiragana: 'っぼ', katakana: 'ッボ'},
        {romaji: 'ppa', hiragana: 'っぱ', katakana: 'ッパ'},
        {romaji: 'ppi', hiragana: 'っぴ', katakana: 'ッパ'},
        {romaji: 'ppu', hiragana: 'っぷ', katakana: 'ップ'},
        {romaji: 'ppe', hiragana: 'っぺ', katakana: 'ッペ'},
        {romaji: 'ppo', hiragana: 'っぽ', katakana: 'ッポ'},
        {romaji: 'vvu', hiragana: 'っゔ', katakana: 'ッヴ'},
        {romaji: 'a', hiragana: 'あ', katakana: 'ア'},
        {romaji: 'i', hiragana: 'い', katakana: 'イ'},
        {romaji: 'u', hiragana: 'う', katakana: 'ウ'},
        {romaji: 'e', hiragana: 'え', katakana: 'エ'},
        {romaji: 'o', hiragana: 'お', katakana: 'オ'},
        {romaji: 'ka', hiragana: 'か', katakana: 'カ'},
        {romaji: 'ki', hiragana: 'き', katakana: 'キ'},
        {romaji: 'ku', hiragana: 'く', katakana: 'ク'},
        {romaji: 'ke', hiragana: 'け', katakana: 'ケ'},
        {romaji: 'ko', hiragana: 'こ', katakana: 'コ'},
        {romaji: 'sa', hiragana: 'さ', katakana: 'サ'},
        {romaji: 'shi', hiragana: 'し', katakana: 'シ'},
        {romaji: 'su', hiragana: 'す', katakana: 'ス'},
        {romaji: 'se', hiragana: 'せ', katakana: 'セ'},
        {romaji: 'so', hiragana: 'そ', katakana: 'ソ'},
        {romaji: 'ta', hiragana: 'た', katakana: 'タ'},
        {romaji: 'chi', hiragana: 'ち', katakana: 'チ'},
        {romaji: 'tsu', hiragana: 'つ', katakana: 'ツ'},
        {romaji: 'te', hiragana: 'て', katakana: 'テ'},
        {romaji: 'to', hiragana: 'と', katakana: 'ト'},
        {romaji: 'na', hiragana: 'な', katakana: 'ナ'},
        {romaji: 'ni', hiragana: 'に', katakana: 'ニ'},
        {romaji: 'nu', hiragana: 'ぬ', katakana: 'ヌ'},
        {romaji: 'ne', hiragana: 'ね', katakana: 'ネ'},
        {romaji: 'no', hiragana: 'の', katakana: 'ノ'},
        {romaji: 'ha', hiragana: 'は', katakana: 'ハ'},
        {romaji: 'hi', hiragana: 'ひ', katakana: 'ヒ'},
        {romaji: 'fu', hiragana: 'ふ', katakana: 'フ'},
        {romaji: 'he', hiragana: 'へ', katakana: 'ヘ'},
        {romaji: 'ho', hiragana: 'ほ', katakana: 'ホ'},
        {romaji: 'ma', hiragana: 'ま', katakana: 'マ'},
        {romaji: 'mi', hiragana: 'み', katakana: 'ミ'},
        {romaji: 'mu', hiragana: 'む', katakana: 'ム'},
        {romaji: 'me', hiragana: 'め', katakana: 'メ'},
        {romaji: 'mo', hiragana: 'も', katakana: 'モ'},
        {romaji: 'ya', hiragana: 'や', katakana: 'ヤ'},
        {romaji: 'yu', hiragana: 'ゆ', katakana: 'ユ'},
        {romaji: 'yo', hiragana: 'よ', katakana: 'ヨ'},
        {romaji: 'ra', hiragana: 'ら', katakana: 'ラ'},
        {romaji: 'ri', hiragana: 'り', katakana: 'リ'},
        {romaji: 'ru', hiragana: 'る', katakana: 'ル'},
        {romaji: 're', hiragana: 'れ', katakana: 'レ'},
        {romaji: 'ro', hiragana: 'ろ', katakana: 'ロ'},
        {romaji: 'wa', hiragana: 'わ', katakana: 'ワ'},
        {romaji: 'wi', hiragana: 'ゐ', katakana: 'ヰ'},
        {romaji: 'we', hiragana: 'ゑ', katakana: 'ヱ'},
        {romaji: 'wo', hiragana: 'を', katakana: 'ヲ'},
        {romaji: 'n', hiragana: 'ん', katakana: 'ン'},
        {romaji: 'ga', hiragana: 'が', katakana: 'ガ'},
        {romaji: 'gi', hiragana: 'ぎ', katakana: 'ギ'},
        {romaji: 'gu', hiragana: 'ぐ', katakana: 'グ'},
        {romaji: 'ge', hiragana: 'げ', katakana: 'ゲ'},
        {romaji: 'go', hiragana: 'ご', katakana: 'ゴ'},
        {romaji: 'za', hiragana: 'ざ', katakana: 'ザ'},
        {romaji: 'ji', hiragana: 'じ', katakana: 'ジ'},
        {romaji: 'zu', hiragana: 'ず', katakana: 'ズ'},
        {romaji: 'ze', hiragana: 'ぜ', katakana: 'ゼ'},
        {romaji: 'zo', hiragana: 'ぞ', katakana: 'ゾ'},
        {romaji: 'da', hiragana: 'だ', katakana: 'ダ'},
        {romaji: 'ji', hiragana: 'ぢ', katakana: 'ヂ'},
        {romaji: 'dzu', hiragana: 'づ', katakana: 'ヅ'},
        {romaji: 'de', hiragana: 'で', katakana: 'デ'},
        {romaji: 'do', hiragana: 'ど', katakana: 'ド'},
        {romaji: 'ba', hiragana: 'ば', katakana: 'バ'},
        {romaji: 'bi', hiragana: 'び', katakana: 'ビ'},
        {romaji: 'bu', hiragana: 'ぶ', katakana: 'ブ'},
        {romaji: 'be', hiragana: 'べ', katakana: 'ベ'},
        {romaji: 'bo', hiragana: 'ぼ', katakana: 'ボ'},
        {romaji: 'pa', hiragana: 'ぱ', katakana: 'パ'},
        {romaji: 'pi', hiragana: 'ぴ', katakana: 'パ'},
        {romaji: 'pu', hiragana: 'ぷ', katakana: 'プ'},
        {romaji: 'pe', hiragana: 'ぺ', katakana: 'ペ'},
        {romaji: 'po', hiragana: 'ぽ', katakana: 'ポ'},
        {romaji: 'vu', hiragana: 'ゔ', katakana: 'ヴ'},
        {romaji: ',', hiragana: '、', katakana: '、'},
        {romaji: '.', hiragana: '。', katakana: '。'}
      ];
    }

    ConverterJP.prototype.convert = function (text, from) {
      this.text = text.toLowerCase();
      this.from = from;
      this.result = {
        romajiText: '',
        hiraganaText: '',
        katakanaText: ''
      };
      this._preprocess();
      while (this.text !== '') {
        var token = this._getToken();
        this.result.romajiText += token.romaji;
        this.result.hiraganaText += token.hiragana;
        this.result.katakanaText += token.katakana;
        this.text = this.text.substr(token.strLength);
      }
      this._postprocess();
    };

    ConverterJP.prototype.getResult = function () {
      return this.result;
    };

    ConverterJP.prototype._preprocess = function () {
      this.text = this.text
        .replace(/ā/gi, 'aa')
        .replace(/ū/gi, 'uu')
        .replace(/ē/gi, 'ee')
        .replace(/ō/gi, 'ou');
    };

    ConverterJP.prototype._getToken = function () {
      var newToken = {};
      if (this._shouldIgnoreChar(this.text[0])) {
        newToken.romaji = newToken.hiragana = newToken.katakana = '';
        newToken.strLength = 1;
        return newToken;
      }
      for (var i = 0; i < this.conversionTable.length; i++) {
        var token = this.conversionTable[i];
        if (this.text.startsWith(token[this.from])) {
          newToken = token;
          newToken.strLength = token[this.from].length;
          return newToken;
        }
      }
      newToken.romaji = newToken.hiragana = newToken.katakana = this.text[0];
      newToken.strLength = 1;
      return newToken;
    };

    ConverterJP.prototype._shouldIgnoreChar = function (char) {
      return char === ' ' || char === '\'';
    };

    ConverterJP.prototype._postprocess = function () {
      this.result.romajiText = this.result.romajiText
        .replace(/([aiueo])ー/gi, '$1$1')
        .replace(/aa/gi, 'ā')
        .replace(/uu/gi, 'ū')
        .replace(/ee/gi, 'ē')
        .replace(/ou/gi, 'ō')
        .replace(/oo/gi, 'ō');
    };

    return ConverterJP;
  }());

  // Disable trial timer
  setInterval(function () {
    if (typeof gTrialStopTimer !== 'undefined') {
      clearTimeout(gTrialStopTimer);
      gTrialStopTimer = null;
    }

    if (typeof gTrialStopTimer2 !== 'undefined' && gTrialStopTimer2.h) {
      clearTimeout(gTrialStopTimer2.h);
      gTrialStopTimer2.h = null;
    }

    if (typeof gts !== 'undefined' && gts.h) {
      clearTimeout(gts.h);
      gts.h = null;
    }

    if (typeof gSingling !== 'undefined' && gSingling !== true) {
      gSingling = true;
    }

    if (BM_MODE ? typeof window.frames[0].PlayerCtx !== 'undefined' : typeof PlayerCtx !== 'undefined') {
      if (BM_MODE ? window.frames[0].PlayerCtx.translation : PlayerCtx.translation) {
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'translation', 'record_program', 'Ghi');
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'translation', 'live_program', 'Phát');
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'translation', 'guide_program', 'Lịch');
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'translation', 'day_names', ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']);
      }
      if (BM_MODE ? window.frames[0].PlayerCtx.apiInfo : PlayerCtx.apiInfo) {
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'apiInfo', 'cid', cid);
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'apiInfo', 'uid', uid);
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'uinfo_id', uinfo_id);
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'uinfo_confirmed', uinfo_confirmed);
        fillObject(BM_MODE ? window.frames[0].PlayerCtx : PlayerCtx, 'uinfo_trial', uinfo_trial);
        if (dataChanged) {
          if (BM_MODE && window.frames[0].PlayerCtx.channelsControlLoad) {
            window.frames[0].PlayerCtx.channelsControlLoad = false;
          } else if (PlayerCtx.channelsControlLoad) {
            PlayerCtx.channelsControlLoad = false;
          }

          if (BM_MODE) {
            window.frames[0].updateUserInfo();
            window.frames[0].loadChannelsControl();
          } else {
            updateUserInfo();
            loadChannelsControl();
          }
        }
      }
      if (dataChanged) {
        dataChanged = false;
      }
    }
  }, 10000);

  // Disable redirect on page refresh
  location.replace("#");

  function handleEvent(func, data) {
    return function (event) {
      func.bind(this)(event, data);
    };
  }

  function onTvSearchKeyDown(event) {
    event.stopPropagation();
  }

  function convertSingleByte(str) {
    var rex = /[\uff01-\uff5e]/g;
    return str.replace(rex, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 65248);
    });
  }

  function onTvChannelsSearchInput(event, tvChannelsControl) {
    var value = event.target.value.toLowerCase();
    var convertJP = new ConverterJP();
    convertJP.convert(value, 'romaji');
    var tvChannelsItems = tvChannelsControl.querySelectorAll('.tv_channels_items_wrapper > .tv_channels_items > .tv_channel_item');
    Array.from(tvChannelsItems).forEach(function (tvChannelsItem) {
      var tvChannelTitle = tvChannelsItem.querySelector('.tv_channel_title').innerHTML.toLowerCase();
      var tvChannelNo = tvChannelsItem.querySelector('.tv_channel_no').innerHTML.toLowerCase();
      if (tvChannelNo.indexOf(value) > -1 || tvChannelTitle.indexOf(value) > -1 || convertSingleByte(tvChannelTitle).indexOf(value) > -1 || tvChannelTitle.indexOf(convertJP.result.hiraganaText) > -1 || tvChannelTitle.indexOf(convertJP.result.katakanaText) > -1) {
        tvChannelsItem.style.display = '';
      } else {
        tvChannelsItem.style.display = 'none';
      }
    });
  }

  function onTvEpgSearchInput(event, tvEpgControl) {
    var value = event.target.value.toLowerCase();
    var convertJP = new ConverterJP();
    convertJP.convert(value, 'romaji');
    var tvEpgItems = tvEpgControl.querySelectorAll('.ts_wrapper > .ts_items > .tv_epg_item');
    Array.from(tvEpgItems).forEach(function (tvEpgItem) {
      var epgTitle = tvEpgItem.querySelector('.epg_title').innerHTML.toLowerCase();
      var epgTime = tvEpgItem.querySelector('.epg_time').innerHTML.toLowerCase();
      if (epgTime.indexOf(value) > -1 || epgTitle.indexOf(value) > -1 || convertSingleByte(epgTitle).indexOf(value) > -1 || epgTitle.indexOf(convertJP.result.hiraganaText) > -1 || epgTitle.indexOf(convertJP.result.katakanaText) > -1) {
        tvEpgItem.style.display = '';
      } else {
        tvEpgItem.style.display = 'none';
      }
    });
  }

  function loadTvChannelsSearch() {
    var tvChannelsControl = document.querySelector('#tv_channels_control');
    if (tvChannelsControl) {
      var tvChannelsSearch = tvChannelsControl.querySelector('.tv_channels_search_wapper > .tv_channels_search');
      if (!tvChannelsSearch) {
        tvChannelsSearch = document.createElement('input');
        tvChannelsSearch.className = 'tv_channels_search';
        tvChannelsSearch.setAttribute('type', 'search');
        tvChannelsSearch.setAttribute('placeholder', 'Search channels');
        tvChannelsSearch.onkeydown = handleEvent(onTvSearchKeyDown);
        tvChannelsSearch.oninput = handleEvent(onTvChannelsSearchInput, tvChannelsControl);

        var tvChannelsSearchWrapper = document.createElement('div');
        tvChannelsSearchWrapper.className = 'tv_channels_search_wapper';
        tvChannelsSearchWrapper.appendChild(tvChannelsSearch);

        tvChannelsControl.insertBefore(tvChannelsSearchWrapper, tvChannelsControl.firstChild);
      }
    }
  }

  function loadTvEpgSearch() {
    var tvEpgControl = document.querySelector('.tv_epg');
    if (tvEpgControl) {
      var tvEpgSearch = tvEpgControl.querySelector('.tv_epg_search_wapper > .tv_epg_search');
      if (!tvEpgSearch) {
        tvEpgSearch = document.createElement('input');
        tvEpgSearch.className = 'tv_epg_search';
        tvEpgSearch.setAttribute('type', 'search');
        tvEpgSearch.setAttribute('placeholder', 'Search epg');
        tvEpgSearch.onkeydown = handleEvent(onTvSearchKeyDown);
        tvEpgSearch.oninput = handleEvent(onTvEpgSearchInput, tvEpgControl);

        var tvEpgSearchWrapper = document.createElement('div');
        tvEpgSearchWrapper.className = 'tv_epg_search_wapper';
        tvEpgSearchWrapper.appendChild(tvEpgSearch);

        tvEpgControl.insertBefore(tvEpgSearchWrapper, tvEpgControl.firstChild);
      }
    }
  }

  function translation() {
    /* Array.from(document.querySelectorAll('.tv_channels_items .tv_channel_item')).forEach(function (item) {
      if (!item.dataset.translated) {
        var tvChannelTitle = item.getElementsByClassName('tv_channel_title')[0];
        var convertJP = new ConverterJP();
        convertJP.convert(tvChannelTitle.textContent, 'katakana');
        tvChannelTitle.textContent = convertJP.result.romajiText;
        item.dataset.translated = true;
      }
    }); */

    Array.from(document.querySelectorAll('.ts_items .tv_epg_item')).forEach(function (item) {
      if (!item.dataset.translated) {
        var epgTitle = item.getElementsByClassName('epg_title')[0];
        var convertJP = new ConverterJP();
        convertJP.convert(epgTitle.textContent, 'katakana');
        epgTitle.textContent = convertJP.result.romajiText;
        item.dataset.translated = true;
      }
    });
  }

  function init() {
    loadTvChannelsSearch();
    loadTvEpgSearch();
    translation();
  }

  var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      eventListenerSupported = window.addEventListener;

    return function (obj, callback) {
      if (MutationObserver) {
        var obs = new MutationObserver(function (mutations, observer) {
          if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
            callback();
          }
        });
        obs.observe(obj, {
          childList: true,
          subtree: true
        });
      } else if (eventListenerSupported) {
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();

  observeDOM(document, function () {
    init();
  });
})();