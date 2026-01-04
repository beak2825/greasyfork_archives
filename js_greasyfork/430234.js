// ==UserScript==
// @name        zhaiiker_helper
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  https://www.zhaiiker.com/community/ 關聯豆瓣按鈕
// @author       backrock12
// @match        *://www.zhaiiker.com/topic/*
// @icon         https://www.google.com/s2/favicons?domain=zhaiiker.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430234/zhaiiker_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/430234/zhaiiker_helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function start() {
    let index = 0;
    const title = document.querySelector("div.list-title");
    if (title) index = title.innerText.indexOf("影片汇总");

    if (index > 0) {
      const p_list = document.querySelectorAll(".post > article > p");
      for (const p of p_list) {
        if (p && p.textContent) {
          const text = p.textContent.replace(/\[?content_hide\]?/, "");
          if (text.length > 2 && text != "新浪微博主页") {
            console.log(text);
            var a = document.createElement("a");

            const aurl =
              "<img src='https://www.douban.com/favicon.ico' style='width:24px;' alt='豆瓣' />";
            a.innerHTML = aurl;
            a.href =
              "https://www.douban.com/search?cat=1002&q=" +
              text +
              "#autoselect";
            a.target = "_blank";
            var div = document.createElement("div");
            var div1 = document.createElement("div");
            var div2 = document.createElement("div");
            var hr = document.createElement("hr");

            div1.innerHTML = p.innerHTML;
            div1.style = "display:inline-block";
            div2.append(a);
            div2.style = "display:inline-block";

            div.append(div1);
            div.append(div2);
            div.append(hr);

            //p.append(div)
            p.parentNode.replaceChild(div, p);
            //p.innerHTML =div.outerHTML
          }
        }
      }
    }
  }

  setTimeout(start, 800);
})();
