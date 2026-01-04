// ==UserScript==
// @name        izismile mobile
// @namespace   https://greasyfork.org/noneangel
// @include     /https://(www\.)?izismile.com/.*-\d+\.html*/
// @exclude            *video.html
// @description remove header in post scroll mode in izisimile
// @version     0.3
// @downloadURL https://update.greasyfork.org/scripts/397056/izismile%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/397056/izismile%20mobile.meta.js
// ==/UserScript==
//don't run the script more than once by page
if (window.top != window.self) return;

if (typeof GM_addStyle == 'undefined') {
    this.GM_addStyle = (aCss) => {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}
function setPagnination() {
  setTimeout(() => {
    const container = document.querySelector(".owl-stage-outer");
    if (!container) {
      setPagnination();
      return;
    }
    const pagination = document.querySelector(".pagination");
    container.insertBefore(pagination, null);
  }, 500);
}
setPagnination();

GM_addStyle(`
#container {
    padding: 0;
}
main {
    padding-bottom: 0px;
}
section > article::before {
    content: none !important;
}
br {
    display: none !important;
}
main + a,
.sordering,
.qc-cmp-persistent-link,
.post-category-title,
.go-home,
.last-imgbox,
[class^=sharethis],
.icon-next-more,
.icon-prev-more,
footer,
header {
    display: none !important;
}
.pagination {
    position: absolute !important;
    bottom: 0 !important;
    margin: 0 auto;
    left: 0;
    right: 0;
}
.pagination::before {
    content: none !important;
}
main {
    margin: 0 !important;
}
* {
    margin: 0;
    padding: 0;
}
.imgbox {
    display: grid;
    height: 100%;
}
#photo {
    max-width: 100%;
    max-height: 100vh;
    width: auto;
    height: auto;
    margin: auto;
}
.owl-height {
    height: 100vh !important;
}
.pagination-prev, .pagination-next {
    text-indent: -9999px;
    position: fixed !important;
    width: 30% !important;
    z-index: 100;
    margin: 0 !important;
    height: 100vh !important;
    background-color: rgba(0, 0, 0, 0) !important;
}
#pagination-nums {
    z-index: 300 !important;
    opacity: 0.2;
    transition-property: opacity;
    transition-duration: 500ms;
    transition-timing-function: ease-in;
}
.owl-item.active .tools {
    z-index: 400 !important;
}

#pagination-nums:focus, #pagination-nums:hover {
    opacity: 1;
}
`);

window.dispatchEvent(new Event('resize'));