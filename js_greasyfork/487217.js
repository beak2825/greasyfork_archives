// ==UserScript==
// @name         czbooks.net
// @namespace    pl816098
// @version      1.1.5.3
// @description  自用
// @author       pl816098
// @match        https://czbooks.net/n/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=czbooks.net
// @grant        GM_addStyle
// @license      MIT
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL https://update.greasyfork.org/scripts/487217/czbooksnet.user.js
// @updateURL https://update.greasyfork.org/scripts/487217/czbooksnet.meta.js
// ==/UserScript==

{
  var _GM_addStyle;
  {
    if (typeof GM_addStyle !== "undefined") {
      _GM_addStyle = GM_addStyle;
    } else if (
      typeof GM !== "undefined" &&
      typeof GM.addStyle !== "undefined"
    ) {
      _GM_addStyle = GM.addStyle;
    } else {
      _GM_addStyle = (cssStr = null) => {
        let styleEle = document.createElement("style");
        styleEle.classList.add("_GM_addStyle");
        styleEle.innerHTML = cssStr;
        document.head.appendChild(styleEle);
        return styleEle;
      };
    }
  }
}
_GM_addStyle(`
.chapter-detail,
.content {
  line-height: normal;
}
#sticky-parent {
  width: auto;
}
#sticky-parent > .chapter-detail {
  width: auto;
}
.content {
  font-size: 17px;
}

`);
/**
 * ${1:a JSDoc}
 * @author pl816098
 *
 * @type {{}\}
 */
let ele = [
  "body > div.header",
  "body > div.footer",
  "body > div.main > div:nth-child(3)",
  "#go-to-top",
  "#sticky-parent > div.chapter-detail > div.notice",
];
ele.forEach((ele) => {
  if (document.querySelector(ele)) {
    document.querySelector(ele).remove();
  }
});
