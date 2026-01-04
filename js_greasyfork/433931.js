// ==UserScript==
// @name         JSON foramt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  format the page content if it is JSON
// @author       Yunser
// @match        */*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433931/JSON%20foramt.user.js
// @updateURL https://update.greasyfork.org/scripts/433931/JSON%20foramt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const body = document.querySelector('body')
    if (body && body.children.length && body.children[0] && body.children[0].nodeName == 'PRE') {
        const pre = body.children[0]
        console.log('pre.innerHTML', pre.innerHTML)
        if (pre.innerHTML) {
            try {
                pre.innerHTML = JSON.stringify(JSON.parse(pre.innerHTML), null, 4)
            } catch (e) {
                console.error(e)
            }
        }
    }
    // Your code here...
})()
