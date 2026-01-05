// ==UserScript==
// @name        radiko widen timetable
// @name:ja     radiko 番組表の幅を広げる
// @namespace   https://greasyfork.org/users/19523
// @description 番組表の幅をウィンドウ幅いっぱいに広げます
// @include     http://radiko.jp/*
// @version     0.2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26574/radiko%20widen%20timetable.user.js
// @updateURL https://update.greasyfork.org/scripts/26574/radiko%20widen%20timetable.meta.js
// ==/UserScript==


(function () {
  var getStyleSheetIndex = function (src) {
    for (var i = 0, styleSheet; styleSheet = document.styleSheets[i]; i++) {
      if (styleSheet.href.indexOf(src) >= 0)
        break;
    }
    return i;
  };
  var getCssRuleIndex = function (i, map) {
    for (var j = 0, len = Object.keys(map).length; j < document.styleSheets[i].cssRules.length && len > 0; j++) {
      var selector = document.styleSheets[i].cssRules[j].selectorText;
      if (typeof selector === "undefined") {
        continue;
      }
      if (map[selector]) {
        map[selector] = j;
        --len;
      }
    }
    return map;
  };
  var NOT_SET = -1;
  var timetable = {
    'body': NOT_SET,
    '.content .content__inner': NOT_SET,
    '.program-table__outer': NOT_SET,
    '.program-table__pager .item--prev': NOT_SET,
    '.program-table__pager .item--next': NOT_SET
  };
  var observer = new MutationObserver(function (mutations) {
    if (location.hash.indexOf('#!/timetable') >= 0) {
      setTimeout(function () {
        document.styleSheets[styleSheetIndex].cssRules[timetable['body']].style.setProperty('min-width', 'initial');
        document.styleSheets[styleSheetIndex].cssRules[timetable['.content .content__inner']].style.setProperty('width', 'initial');
        document.styleSheets[styleSheetIndex].cssRules[timetable['.program-table__outer']].style.setProperty('width', 'initial');
        document.styleSheets[styleSheetIndex].cssRules[timetable['.program-table__pager .item--prev']].style.setProperty('left', 'initial');
        document.styleSheets[styleSheetIndex].cssRules[timetable['.program-table__pager .item--prev']].style.setProperty('z-index', '1');
        document.styleSheets[styleSheetIndex].cssRules[timetable['.program-table__pager .item--next']].style.setProperty('position', 'initial');
        document.styleSheets[styleSheetIndex].cssRules[timetable['.program-table__pager .item--next']].style.setProperty('float', 'right');
        observer.disconnect();
      }, 1000);
    }
  });
  var styleSheetIndex = getStyleSheetIndex('style.css');
  timetable = getCssRuleIndex(styleSheetIndex, timetable);
  var contents = document.getElementById('contents');
  observer.observe(contents, { childList: true });
})();
