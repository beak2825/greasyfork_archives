// ==UserScript==
// @name         图吧广告哥再见
// @namespace    http://tampermonkey.net/
// @version      0.1.0.01
// @description  我听吧友的，不听广告哥的 ;)
// @author       23Xor
// @license      MIT
// @match        https://tieba.baidu.com/p/*
// @icon         https://favicon.yandex.net/favicon/v2/baidu.com?size=32
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443519/%E5%9B%BE%E5%90%A7%E5%B9%BF%E5%91%8A%E5%93%A5%E5%86%8D%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/443519/%E5%9B%BE%E5%90%A7%E5%B9%BF%E5%91%8A%E5%93%A5%E5%86%8D%E8%A7%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var regexplist = [
        /去他主[页頁][康看]下..，对你有帮助/,
        /发顶抢贴吧业务[.\n]*让客户主动找你[.\n]*教学出软件/,
        /兄[嘚弟]不知道怎[么麼]..，可以看他帖子[.\n]*[给給]您..最低[价價]最有性[价價]比的配置/
    ];
    var tbfloors = document.querySelectorAll(".l_post");
    for(var i = 1, len = tbfloors.length; i < len; i++) {
      var floorhere = tbfloors[i];
      var content2read = ""
      if (tbfloors[i].children[1].children[0].children[1].nodeName === "CC") {
        content2read = tbfloors[i].children[1].children[0].children[1].children[1];
        console.log(content2read.innerText);
        for(var j = 0, length = regexplist.length; j < length; j++) {
          if (content2read.innerText.search(regexplist[j]) !== -1) {
            floorhere.innerHTML = '<h1 align="center">AD</h1>';
          }
        }
      }
    }
})();