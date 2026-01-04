// ==UserScript==
// @name         消除知乎推荐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407815/%E6%B6%88%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/407815/%E6%B6%88%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let style = `
.Topstory-mainColumnCard .Card:not(.Topstory-tabCard) {
 opacity: 0
}
`

    let dom = document.createElement('style')
    dom.innerHTML = style
    document.body.appendChild(dom)

    let toggleDom =  document.querySelector('#Popover1-toggle')

    function interval(time = 10000) {
        setTimeout(() => {
            doSome(true)
        }, time)
    }

    function doSome(flag) {
        console.log(new Date(), 'remove placeholder')
        toggleDom.setAttribute('placeholder', '');
        if (flag) {
            interval()
        }
    }

    doSome()

    interval()
})();