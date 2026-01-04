// ==UserScript==
// @name            提取中文并使用google翻译
// @description     translate
// @include         https://www.pushbullet.com
// @version         0.2
// @author          yechenyin
// @namespace	    https://greasyfork.org/users/3586-yechenyin
// @match           https://translate.google.com/*
// @require	        https://code.jquery.com/jquery-1.11.2.min.js
// @grant           GM_setClipboard
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/475558/%E6%8F%90%E5%8F%96%E4%B8%AD%E6%96%87%E5%B9%B6%E4%BD%BF%E7%94%A8google%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/475558/%E6%8F%90%E5%8F%96%E4%B8%AD%E6%96%87%E5%B9%B6%E4%BD%BF%E7%94%A8google%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==


jQuery.fn.inserted = function(action) {
  var selector = this.selector;
  if ($(selector).length > 0) {
    console.log($(selector).length + ' ' + selector + " is loaded at begin");
    action.call($(selector));
  }
  var reaction = function(records) {
    records.map(function(record) {
      if (record.target !== document.body && $(record.target).find(selector).length) {
        observer.disconnect();
        action.call($(record.target).find(selector));
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

var chinese = []
function translate() {
    let text = $('#textarea').val()
    console.log(text.length)
    if (!text)
        return
    chinese = text.match(/['">]([^'"><\n]*[\u4e00-\u9fa5]+[^'"<\n]*)[<'"]/g)
    chinese = Array.from(new Set(chinese))
    chinese = chinese.map(item => item.replace(/['"><]/g, ''))
    console.log(chinese);
    text = text.replace(/['"]([^'"><\n]*[\u4e00-\u9fa5]+[^'"<\n]*)['"]/g, "this.$lang('$1')")
    text = text.replace(/[>]([^><\n]*[\u4e00-\u9fa5]+[^<\n]*)[<]/g, ">{{ $lang('$1') }}<")
    console.log(text)
    GM_setClipboard(text)
    $('textarea').first().text(chinese.join('\n'))
    $('div[jscontroller="gWGePc"]').text(chinese.join('\n'))
    console.log(chinese.join('\n'));
}
$('nav').inserted(function () {
    $('nav').last().before($('<textarea>', {id: 'textarea', height: '96px'}).change(translate))
})
$('span[jsaction^="mouseup"]').inserted(function () {
    console.log(('span[jsaction^="mouseup"]'))
    var target = $('span[jsaction^="mouseup"]')[0]
    var observer = new MutationObserver(function(mutations) {
        console.log($('span[jsaction^="click:E6Tfl,GFf3ac"]').text());
        let output = ''
        let chinese = document.querySelectorAll('textarea')[0].textContent.split('\n')
        let list = Array.from($('span[jsaction^="click:E6Tfl,GFf3ac"]'))
        console.log(list);
        //let translated = list.map(item => $(this).text()).fliter(item => item)
        let translated = $('span[jsaction^="click:E6Tfl,GFf3ac"]').text().split('\n')
        console.log(translated);
        for (let i in translated) {
            output += '"' + chinese[i] + '":"' + translated[i]  + '",\n'
        }
        console.log('\n' + output)
        //GM_setClipboard('\n' + output)
    });
    observer.observe(target, {
        attributes:    true,
        childList:     true,
        characterData: true
    });
})
$('span[jsname="jqKxS"]').inserted(function () {
    console.log(('span[jsname="jqKxS"]'))
})
