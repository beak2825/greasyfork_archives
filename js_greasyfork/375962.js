// ==UserScript==
// @name         Zhihu Original Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  知乎原创过滤器
// @author       xi2008wang
// @match        https://www.zhihu.com/follow
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375962/Zhihu%20Original%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/375962/Zhihu%20Original%20Filter.meta.js
// ==/UserScript==

var $ = $ || window.$;
var original_set = ['回答了', '发表了', '添加了', '专栏更新了'];
var zhihu_filter_sw = false;

function waitForKeyElements(
  selectorTxt,
  /* Required: The jQuery selector string that
                      specifies the desired element(s).
                  */
  actionFunction,
  /* Required: The code to run when elements are
                         found. It is passed a jNode to the matched
                         element.
                     */
  bWaitOnce,
  /* Optional: If false, will continue to scan for
                    new elements even after the first match is
                    found.
                */
  iframeSelector
  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") {
    targetNodes = $(selectorTxt);
  } else {
    targetNodes = $(iframeSelector).contents().find(selectorTxt);
  }

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
        are new.
    */
    targetNodes.each(function() {
      var jThis = $(this);
      var alreadyFound = jThis.data('alreadyFound') || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) {
          btargetsFound = false;
        } else {
          jThis.data('alreadyFound', true);
        }
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey]
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function() {
          waitForKeyElements(selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          );
        },
        300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}

function zhihu_filter_all(feeds) {
  feeds.each(function() {
    var feed = $(this);
    zhihu_filter(feed);
  });
}

function zhihu_filter(feed) {
  var feed_data = feed.find('.FeedSource-firstline').text();
  var found = false;
  $.each(original_set, function(idx, original) {
    // 遍历找出原创feed
    if (feed_data.indexOf(original) >= 0) {
      found = true;
      return;
    }
  });

  // 隐藏不关心feed
  if (zhihu_filter_sw && !found) {
    feed.parent().hide();
  } else {
    feed.parent().show();
  }

  // 广告feed也隐藏
  $('.TopstoryItem--advertCard').hide();
}

function append_switch() {
  var b = $('<button id="zhihu_filter_sw" style="position: fixed;top: 60px;right: 20px;">全部</button>');
  b.prependTo('body');

  $('#zhihu_filter_sw').click(function() {
    if ($(this).text() == "全部") {
      // 单击时全部过滤
      $(this).text("原创");
      zhihu_filter_sw = true;
      zhihu_filter_all($('.Feed'));
    } else {
      $(this).text("全部");
      zhihu_filter_sw = false;
      zhihu_filter_all($('.Feed'));
    }
  });
}

(function() {
  'use strict';

  // 附加过滤切换按钮
  append_switch();

  // 开始实时过滤
  waitForKeyElements(
    ".Feed", zhihu_filter
  );

})();
