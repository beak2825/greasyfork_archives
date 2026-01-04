// ==UserScript==
// @name            自动复制pushbullet最后一条文字信息
// @description     auto copy last message when pushbullet push a new message
// @include         https://www.pushbullet.com
// @version         0.2
// @author          yechenyin
// @namespace	    https://greasyfork.org/users/3586-yechenyin
// @match           https://www.pushbullet.com*
// @require	        https://code.jquery.com/jquery-1.11.2.min.js
// @grant           GM_setClipboard
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/36924/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6pushbullet%E6%9C%80%E5%90%8E%E4%B8%80%E6%9D%A1%E6%96%87%E5%AD%97%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/36924/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6pushbullet%E6%9C%80%E5%90%8E%E4%B8%80%E6%9D%A1%E6%96%87%E5%AD%97%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==


jQuery.fn.inserted = function(action) {
  var selector = this.selector;
  var reaction = function(records) {
    records.map(function(record) {
      if (record.target !== document.body && $(record.target).find(selector).length) {
        action.call($(record.target).find(selector).last());
      }
    });
  };

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if (MutationObserver) {
    var observer = new MutationObserver(reaction);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    //setInterval(reaction, 100);
  }
};

console.log($('.text-part').last().text());
$('.text-part').inserted(function () {
    GM_setClipboard($('.text-part').last().text().replace(/\s+$/, ''));
});



