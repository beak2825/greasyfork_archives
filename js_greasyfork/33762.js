// ==UserScript==
// @name        Satori Reader WaniKani Lookup
// @namespace   stefanbeyer
// @description Lookup Kanji and Vocab you have learned in WaniKani on Satori Reader.
// @include     https://satorireader.com/articles/*
// @include     https://www.satorireader.com/articles/*
// @author      Stefan Beyer
// @version     3
// @copyright   2017 Stefan Beyer, WaniKani and Satori Reader logos and trademarks copyright of their respective owners
// @license     MIT; http://opensource.org/licenses/MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @require     http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/33762/Satori%20Reader%20WaniKani%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/33762/Satori%20Reader%20WaniKani%20Lookup.meta.js
// ==/UserScript==
$(document).ready(function () {
  var api_key_key = 'SR_WK_API_KEY';
  var api_key = GM_getValue(api_key_key);
  var levels = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60';
  var kanji_url = 'https://www.wanikani.com/api/user/' + api_key + '/kanji/' + levels;
  var vocab_url = 'https://www.wanikani.com/api/user/' + api_key + '/vocabulary/' + levels;
  var icon_url = 'https://cdn.wanikani.com/assets/favicon-cc5fd9e4485a2b407d0bc283f8f913cf6a3dd00172895dc845f0f4bd90ffdc41.ico';
  var kanji_link = 'https://www.wanikani.com/kanji/';
  var vocab_link = 'https://www.wanikani.com/vocabulary/';
  var other_kanji_link = 'http://tangorin.com/kanji/';
  var kanji = [0x4e00 ,0x9faf];
  var kanji_rare = [0x3400, 0x4dbf];
  var kanji_list;
  var vocab_list;
  function lookupWords() {
    // Create WK links
    $('.tooltip .word.kanji-knowledge-na .wpt').each(function (index) {
      var word = $(this);
      var replace = {
      };
      kanji_list.forEach(function (element) {
        var kanji = element.character;
        var learned = element.user_specific !== null;
        if (word.text().includes(kanji)) {
          var css = learned ? 'color:black' : 'color:#aaa';
          replace[kanji] = '<a style="' + css + '" target="_blank" href="' + kanji_link + kanji + '"\'>' + kanji + '</a>';
        }
      });
      var text = word.text();
      var html = '';
      for (var i = 0, len = text.length; i < len; i++) {
        var char = text[i];
        var charCode = text.charCodeAt(i);
        if (char in replace) {
          html += replace[char];
        } else {
          if ((charCode >= kanji[0] && charCode <= kanji[1]) || (charCode >= kanji_rare[0] && charCode <= kanji_rare[1])) {
            html += '<a style="color:#ff8383" target="_blank" href="' + other_kanji_link + char + '"\'>' + char + '</a>';
          } else {
            html += char;
          }
        }
      }
      word.html(html);
    });
    // check if in WK vocab
    $('.note-body:not(.wk) .tooltip-button:not(.wk-button)').each(function (index) {
      var note = $(this).parent();
      note.addClass('wk');
      var character = '';
      note.find('.expression .wpt').each(function (index) {
        character += $(this).text();
      });
      var available = false;
      var level;
      var learned;
      vocab_list.forEach(function (element) {
        var wchar = element.character;
        if (wchar == character) {
          available = true;
          learned = element.user_specific !== null;
          level = element.level;
        }
      });
      if (available) {
        var text;
        if (learned) {
          text = 'Added on Level ' + level;
        } else {
          text = 'Level ' + level;
        }
        var button = note.add('<span class="tooltip-button tooltip-button-active wk-button" style="background-color: #ff00aa; border-color: #b6007a"><span class="tooltip-icon" style="background-image: url(' + icon_url + '); height: 16px; width: 16px; margin: 2px 0 0 0;" ></span><span class="text">' + text + '</span></span>');
        button.last().click(function () {
          window.open(vocab_link + character, '_blank');
        });
        button.appendTo(note);
      }
    });
  }
  if (api_key !== null && api_key !== '') {
    GM_xmlhttpRequest({
      method: 'GET',
      url: kanji_url,
      onload: function (response) {
        kanji_list = JSON.parse(response.responseText).requested_information;
        lookupWords();
      }
    });
    GM_xmlhttpRequest({
      method: 'GET',
      url: vocab_url,
      onload: function (response) {
        vocab_list = JSON.parse(response.responseText).requested_information;
        lookupWords();
      }
    });
    $('.word').each(function (index) {
      var word = $(this);
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (word.hasClass('word-selected')) {
            lookupWords();
          }
        });
      });
      var config = { attributes: true, childList: false, characterData: false };
      observer.observe(this, config);
    });
  }
  GM_registerMenuCommand('Satori Reader WaniKani Lookup -> Set API Key', function () {
    var key = GM_getValue(api_key_key);
    var val = prompt('Edit the API key', key);
    if (val !== null) {
      GM_setValue(api_key_key, String(val));
    }
  });
});