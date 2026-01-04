// ==UserScript==
// @name         体验新版界面
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  使用洛谷时，打开旧版界面会自动跳转到支持的新版界面
// @author       andyli
// @match        *://*.luogu.org/recordnew/show/*
// @match        *://*.luogu.org/problemnew/show/*
// @match        *://*.luogu.org/problemnew/lists*
// @match        *://*.luogu.org/recordnew/lists*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386725/%E4%BD%93%E9%AA%8C%E6%96%B0%E7%89%88%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/386725/%E4%BD%93%E9%AA%8C%E6%96%B0%E7%89%88%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var reg1 = new RegExp("^https://www.luogu.org/recordnew/show/.*$"),
      reg2 = new RegExp("^https://www.luogu.org/problemnew/show/.*$"),
      reg3 = new RegExp("^https://www.luogu.org/problemnew/lists.*$"),
      reg4 = new RegExp("^https://www.luogu.org/recordnew/lists.*$");
  var str = window.location.href;
  if (reg3.test(str)) {
    var name;
    if (str == "https://www.luogu.org/problemnew/lists") {
      window.location.href = "https://www.luogu.org/fe/problem/list";
    } else {
      name = window.location.href.match(/name=.*/)[0].substr(5);
      window.location.href =
          "https://www.luogu.org/fe/problem/list?keyword=" + name;
    }
  }
  if (reg1.test(str)) {
    var record = window.location.href.match(/show\/[0-9]+/)[0].substr(5);
    console.log(record);
    window.location.href = "https://www.luogu.org/fe/record/" + record;
  }
  if (reg2.test(str)) {
    var problem = window.location.href.match(/show.*/)[0].substr(5);
    console.log(problem);
    window.location.href = "https://www.luogu.org/fe/problem/" + problem;
  }
  if (reg4.test(str)) {
    var list = window.location.href.match(/pid=.*/);
    if (list === null) {
    } else {
      window.location.href = "https://www.luogu.org/fe/record/list?" + list[0];
    }
  }
  if (reg4.test(str)) {
    var uid = window.location.href.match(/uid=.*/);
    if (uid === null) {
    } else {
      window.location.href =
          "https://www.luogu.org/fe/record/list?user=" + uid[0].substr(4);
    }
  }
})();