// ==UserScript==
// @name         3DM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://bbs.3dmgame.com/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421877/3DM.user.js
// @updateURL https://update.greasyfork.org/scripts/421877/3DM.meta.js
// ==/UserScript==

(function () {
  "use strict";

  cleanTop();
  atarget();
  ad();
  setTimeout(autopage, 500);

  function ad() {
    function subad(path) {
      let r = document.querySelector(path);
      if (r) {
        r.style.display = "none";
      }
    }

    subad("#mn_N124d");
    subad("#mn_N9e02");
    subad("#mn_N7990");
    subad("#mn_Nadbb");
    subad("#mn_Na9bb");

    subad("#mn_Na9bb");

  }

  // 清理置顶帖子
  function cleanTop() {
    var showhide = document.querySelectorAll("a.showhide.y");
    if (showhide.length > 0) {
      showhide.forEach((e) => e.click());
    }
  }

  function atarget() {
    var showhide = document.querySelectorAll(".atarget_-1");
    if (showhide.length > 0) {
      showhide.forEach((e) => e.click());
    }
  }

  var run_mk = false;
  function autopage() {
    window.addEventListener(
      "scroll",
      function () {
        const htmlHeight =
          document.body.scrollHeight || document.documentElement.scrollHeight;
        //clientHeight是网页在浏览器中的可视高度，
        const clientHeight =
          document.body.clientHeight || document.documentElement.clientHeight;
        //scrollTop是浏览器滚动条的top位置，
        const scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
        if (
          parseInt(scrollTop) + parseInt(clientHeight) >=
          parseInt(htmlHeight)
        ) {
          run_mk = true;
          checkele("#autopbn");
          run_mk = false;
        }
      },
      false
    );
  }

  /**
   * @description : 根据ID检查元素是否可见，再点击
   * @param        {*} cssid
   * @return       {*}
   */
  function checkele(cssid) {
    function checkVisible(elm) {
      var rect = elm.getBoundingClientRect();
      var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      );
      return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    const s = document.querySelector(cssid);
    if (s) {
      let r = checkVisible(s);
      if (r) {
        s.click();
        // serch();
      }
    }
  }
})();
