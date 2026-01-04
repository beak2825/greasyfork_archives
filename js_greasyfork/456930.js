// ==UserScript==
// @name         圣诞节快乐~
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for Ranran~
// @author       Jia.ys
// @match        https://origamisimulator.org/
// @icon         https://pic.imgdb.cn/item/63a29cc5b1fccdcd3653912c.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456930/%E5%9C%A3%E8%AF%9E%E8%8A%82%E5%BF%AB%E4%B9%90~.user.js
// @updateURL https://update.greasyfork.org/scripts/456930/%E5%9C%A3%E8%AF%9E%E8%8A%82%E5%BF%AB%E4%B9%90~.meta.js
// ==/UserScript==

var typing_data_strs = [
    atob('VGhlIGJlc3QgcHJlc2VudCBvbmUgY2FuIGhvcGUgZm9yIHRoaXMgeWVhciBpcyB0byBzcGVuZCB0aW1lIHRvZ2V0aGVyLg=='),
    atob('SSBjYW4ndCB3YWl0IHRvIGNlbGVicmF0ZSB0aGUgaG9saWRheXMgd2l0aCB5b3Uu'),
    atob('TWF5IHRoZSBzcGlyaXQgb2YgQ2hyaXN0bWFzIGJlIHdpdGggeW91IHRocm91Z2hvdXQgdGhlIE5ldyBZZWFyLg=='),
    atob('TWF5IHRoZSBzd2VldCBtYWdpYyBvZiBDaHJpc3RtYXMgY29uc3BpcmUgdG8gZ2xhZGRlbiB5b3VyIGhlYXJ0IGFuZCBmaWxsIGV2ZXJ5IGRlc2lyZS4='),
    atob('TWF5IHRoaXMgQ2hyaXN0bWFzIGVuZCB0aGUgcHJlc2VudCB5ZWFyIG9uIGEgY2hlZXJmdWwgbm90ZSBhbmQgbWFrZSB3YXkgZm9yIGEgZnJlc2ggYW5kIGJyaWdodCBOZXcgWWVhci4='),
    atob('TWF5IHRoZSBDaHJpc3RtYXMgc2Vhc29uIGZpbGwgeW91ciBob21lIHdpdGggam95LCB5b3VyIGhlYXJ0IHdpdGggbG92ZSBhbmQgeW91ciBsaWZlIHdpdGggbGF1Z2h0ZXIu'),
    atob('SG9wZSB5b3UgaGF2ZSBhIHJlbWVtYmVyLWZvcmV2ZXItYW5kLWV2ZXIga2luZCBvZiBob2xpZGF5Lg=='),
    atob('V2hhdGV2ZXIgaXMgYmVhdXRpZnVsLCB3aGF0ZXZlciBpcyBtZWFuaW5nZnVsLCB3aGF0ZXZlciBicmluZ3MgaGFwcGluZXNzLA=='),
    atob('bWF5IGl0IGJlIHlvdXJzIHRoaXMgaG9saWRheSBzZWFzb24gYW5kIHRocm91Z2hvdXQgdGhlIGNvbWluZyB5ZWFyLg==')
],typing_data_index = 0,i=0;

function typing () {
      try {
        let divTyping = document.getElementById('feedbackNotification');
        let str = typing_data_strs[typing_data_index];
        if (i < str.length) {
          divTyping.innerHTML = atob('SmlhLnlzID4g') + str.slice(0, i++) + '_';
          setTimeout(typing, 100);
        }
        else {
          divTyping.innerHTML = atob('SmlhLnlzID4g') + str;
          typing_data_index += 1;
          i = 0;
          if (typing_data_index >= typing_data_strs.length)
            typing_data_index = 0;
          setTimeout(typing, 400);
        }
      }
      catch(err) {console}
}

function changeText(){
    let ialogo = document.getElementById('inactiveLogo');
    let alogo = document.getElementById('activeLogo');
    ialogo.src = "https://pic.imgdb.cn/item/63a29cc5b1fccdcd3653912c.gif";
    ialogo.style = "border-radius:50%";
    alogo.src = "https://pic.imgdb.cn/item/63a2a12cb1fccdcd365b4066.png";
    document.children[0].children[0].innerHTML = document.children[0].children[0].innerHTML.replace('Origami Simulator', decodeURIComponent(escape(atob('57uZ5YaJ6IuS55qE5Zyj6K+e6IqC56S854mpfg=='))));
}

function runit() {
    typing();
    changeText();
}

(function() {
    setTimeout(
        runit()
        ,0);
})();
