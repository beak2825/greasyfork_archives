// ==UserScript==
// @name        poe.trade-DirectWhisper
// @namespace   DirectWhisper
// @include     http://poe.trade/search/*
// @version     0.8.2
// @grant       none
// @description On poe.trade you can now click the WHISPER button to bring up the preformated text in a popup.
// @downloadURL https://update.greasyfork.org/scripts/4978/poetrade-DirectWhisper.user.js
// @updateURL https://update.greasyfork.org/scripts/4978/poetrade-DirectWhisper.meta.js
// ==/UserScript==
javascript:
var cusid_ele = document.getElementsByClassName('item');
var target = document.querySelector('#content');
var observer = new MutationObserver(function () {
  set_all();
});
var config = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true
};
set_all();
function set_all() {
  observer.disconnect();
  for (var i = 0; i < cusid_ele.length; ++i) {
    var item = cusid_ele[i];
    var AlreadyAdded = item.getElementsByClassName('dwhook');
    if (AlreadyAdded.length == 0) {
      var aTags = item.getElementsByTagName('a');
      var html = ' · <span class="dwhook" style="color:#999">WHISPER</span>';
      // Internet Explorer, Opera, Chrome, Firefox 8+ and Safari
      if (aTags[1].insertAdjacentHTML) {
        aTags[1].insertAdjacentHTML('afterend', html);
      } else {
        var range = document.createRange();
        var frag = range.createContextualFragment(html);
        aTags[1].parentNode.insertBefore(frag, aTags[1]);
        //workaround for stupid browsers, not tested, will fuck stuff up big time
      }
      var WhisperSpan = item.getElementsByClassName('dwhook');
      WhisperSpan[0].onclick = function (j) {
        return function () {
          disp(j);
        };
      }(i);
      WhisperSpan[0].onmouseover = function () {
        this.style.color = '#00ffaa';
        //color of hovered WHISPER
      }
      WhisperSpan[0].onmouseout = function () {
        this.style.color = '#999';
      }
    }
  }
  observer.observe(target, config);
}
function copyToClipboard(item, text) {
  var ok = window.prompt('                                                   Copy message to clipboard: Ctrl+C, Enter                                                   ', text);
  if (ok != null) {
    item.getElementsByClassName('dwhook') [0].style.backgroundColor = '#550055';
    //color of clicked WHISPER
  }
}
function disp(i) {
  var item = cusid_ele[i];
  var item_buyout = item.getAttribute('data-buyout');
  var iname_links = item.getElementsByTagName('a');
  var item_name = iname_links[0].innerHTML;
  if (item_name == 'Buy') {
    var iname_li = item.getElementsByTagName('li');
    var item_name = iname_li[0].innerHTML.replace("<br>"," ");
  }
  var item_name = item_name.replace(' <span class="label success corrupted">corrupted</span>', '');
  var item_name = item_name.trim()
  var char_name_temp = item.innerHTML.match('IGN: (.{2,50})(\n|    · )');
  var char_name = char_name_temp[1];
  var quality_temp = item.getElementsByClassName('gem-quality');
  var league_temp = document.getElementsByClassName('chosen-single');
  var league_temp2 = league_temp[0].getElementsByTagName('span');
  var league = league_temp2[0].innerHTML;
  //
  //MESSAGE
  //customize te following text parts to your liking:
  if (item_buyout != '') {
    var item_buyout_text = ' listed for ' + item_buyout;
    //change for your buyout description 
  } else {
    var item_buyout_text = '';
  }
  var gem_quality_text = ''
  if (quality_temp.length != 0) {
    if (quality_temp[0].innerHTML.match(/\d+/) [0] > 0) {
      var gem_quality_text_temp = quality_temp[0].innerHTML.replace('%', '') .match(/\d+/) [0];
      var gem_quality_text = gem_quality_text_temp + 'Q ';
      //change for your quality description 
    }
  }
  copyToClipboard(item, '@' + char_name + ' Hi, I would like to buy your ' + gem_quality_text + item_name + item_buyout_text + ' in ' + league + '.');
  //available: char_name, item_name, item_buyout_text, gem_quality_text, league
}