// Copyright (c) 2016, summivox. (MIT Licensed)
// ==UserScript==
// @name          github-tabstop
// @namespace     http://github.com/smilekzs
// @version       0.2.0
// @description   add tabstop option for hard tabs (works for github/gist)
// @grant         GM_xmlhttpRequest
// @match         *://github.com/*
// @match         *://gist.github.com/*
// @downloadURL https://update.greasyfork.org/scripts/13634/github-tabstop.user.js
// @updateURL https://update.greasyfork.org/scripts/13634/github-tabstop.meta.js
// ==/UserScript==
// vim: set nowrap ft= : 

// http://stackoverflow.com/questions/4190442/run-greasemonkey-script-only-once-per-page-load
if (window.top != window.self) return;  //don't run on frames or iframes


;var PACKED_HTML={"tab.html":"<span class=\"ghts-tab\">&nbsp;&nbsp;&nbsp;&nbsp;</span>\r\n","ui-gist.html":"<li style=\"padding: 0 0.5em;\">\r\n    <label>Tab stop: <input class=\"ghts-input\" style=\"width: 1.2em;\" value=\"4\"></label>\r\n</li>\r\n","ui-github.html":"<label>Tab stop: <input class=\"ghts-input\" style=\"width: 1.2em;\" value=\"4\"></label>\r\n"};


var bind, make, modify, repeat, transform;

repeat = function(c, n) {
  var i, s, _i;
  s = '';
  for (i = _i = 0; _i < n; i = _i += 1) {
    s += c;
  }
  return s;
};

transform = (function() {
  var TAB;
  TAB = PACKED_HTML['tab.html'].trim();
  return function(el) {
    var line, _i, _len, _ref, _results;
    _ref = $(el).addClass('ghts-file').find('.js-file-line');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      _results.push(line.innerHTML = line.innerHTML.replace(/\t/g, TAB));
    }
    return _results;
  };
})();

modify = function(el, ts) {
  var et, tab, _i, _len, _ref;
  if (isNaN(ts)) {
    return false;
  }
  et = repeat('&nbsp;', ts);
  _ref = el.getElementsByClassName('ghts-tab');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    tab = _ref[_i];
    tab.innerHTML = et;
  }
  return true;
};

bind = function(file, input) {
  return input != null ? input.addEventListener('change', function() {
    return modify(file, Number(input.value));
  }) : void 0;
};

make = {
  'github.com': function() {
    var file, input, _i, _len, _ref;
    _ref = $('.file:not(.ghts-file)');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      transform(file);
      $(file).find('.file-actions').prepend(PACKED_HTML['ui-github.html']);
      input = $(file).find('.ghts-input')[0];
      bind(file, input);
    }
  }
};

make['gist.github.com'] = make['github.com'];

$(function() {
  var f;
  if (f = make[document.location.host]) {
    f();
    return setInterval(f, 500);
  }
});
