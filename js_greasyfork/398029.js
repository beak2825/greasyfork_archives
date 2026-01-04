// ==UserScript==
// @name         BusinessInsider Bound AutoPager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://markets.businessinsider.com/bonds/finder?p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398029/BusinessInsider%20Bound%20AutoPager.user.js
// @updateURL https://update.greasyfork.org/scripts/398029/BusinessInsider%20Bound%20AutoPager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleEl = document.createElement('STYLE');
    styleEl.innerHTML = `
#__loading {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 3px solid #000;
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}`;

    document.head.append(styleEl);
    function startLoadNextPage(pagination_right) {
        const div = document.createElement('DIV');
        div.id = '__loading';
        console.log(pagination_right.href);
        fetch(pagination_right.href).then(rpn => {
            rpn.text().then(text => {
                const dom = document.createElement('DIV');
                dom.innerHTML = text.replace(/^.*<body\b[^>]*>(.*?)<\/body>.*$/i,'$1');
                const container = dom.querySelector('#bond-searchresults-container');
                if (/No results found/.test(container.innerHTML)) {
                    const __loading = document.getElementById('__loading');
                    if (__loading) {
                        __loading.parentNode.removeChild(__loading);
                    }
                } else {
                    for (const table of container.children) {
                        if (/table-responsive/.test(table.className)) {
                            const pager = document.getElementById('SearchResultsPager');
                            const tbody = pager.parentNode.children[0].children[0].children[1];
                            if (pager) {
                                while (table.children[0].children[0].children[1].children[1]) {
                                    tbody.appendChild(table.children[0].children[0].children[1].children[1]);
                                }
                                pager.parentNode.replaceChild(table.children[table.children.length - 1], pager);
                            }
                            break;
                        }
                    }
                }
            });
        });
        pagination_right.parentNode.replaceChild(div, pagination_right);
    }
    function fetchNextPage() {
        const pagination_right = document.querySelector('.pagination_right');
        if (pagination_right && /\/bonds\/finder\?p=/.test(pagination_right.href)) {
            startLoadNextPage(pagination_right);
        }
        requestAnimationFrame(fetchNextPage);
    }
    fetchNextPage();
})();