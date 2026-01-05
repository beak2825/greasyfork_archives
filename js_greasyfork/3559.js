// ==UserScript==
// @name        Feedly - Kill UpperCaseTitle
// @description Disable to change title uppercase in Feedly
// @include     http://cloud.feedly.com/*
// @include     https://cloud.feedly.com/*
// @include     http://feedly.com/*
// @include     https://feedly.com/*
// @version     20160823
// @namespace   http://pastebin.com/Dw90sixV
// @copyright   2014+, http://pastebin.com/Dw90sixV
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3559/Feedly%20-%20Kill%20UpperCaseTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/3559/Feedly%20-%20Kill%20UpperCaseTitle.meta.js
// ==/UserScript==

(function() {
  function evalInPage(fun) {
    location.href = "javascript:void (" + fun + ")()";
  }
  evalInPage(function () {
    devhd.utils.StringUtils.cleanTitle = function(g){
      if (g === null) {
        return g;
      }
      g = devhd.str.stripTags(g);
      var f = g.replace(/#[0-9]* -/i, "");
      f = devhd.utils.StringUtils.trim(f);
      return (f.length < g.length / 3 || f.length < 5 ? devhd.str.stripTags(g) : f);
    };
  });
})();