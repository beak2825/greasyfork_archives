// ==UserScript==
// @name         url2ss
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解析独秀ssid
// @author       You
// @include        http://*.fazz.ntszzy.org:8070/*
// @include        https://*.duxiu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ntszzy.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448830/url2ss.user.js
// @updateURL https://update.greasyfork.org/scripts/448830/url2ss.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hoverEle;
    document.addEventListener('mousemove', e=>{
        hoverEle = document.elementFromPoint(e.clientX, e.clientY)
    }
    , {
        passive: true
    })

    var clipboard = {
        data: '',
        intercept: false,
        hook: function(evt) {
            if (clipboard.intercept) {
                evt.preventDefault();
                evt.clipboardData.setData('text/plain', clipboard.data);
                alert(clipboard.data + ' copy success');
                clipboard.intercept = false;
                clipboard.data = '';
            }
        }
    };

    window.addEventListener('copy', clipboard.hook);

    function copy(textContent) {
        clipboard.data = textContent;

        if (window.clipboardData) {
            window.clipboardData.setData('Text', clipboard.data);
        } else {
            clipboard.intercept = true;
            document.execCommand('copy');
        }
    }

    document.addEventListener('keypress', function(e) {
        console.log(e);
        if (e.keyCode === 99) {
            const url = document.location.href + hoverEle.closest("a").getAttribute('href')
            console.log(url);
            const ss = new URL(url).searchParams.get('qwkey').substr(0, 8);
            console.log(ss);
            copy(ss)
        }
    })
    // Your code here...
}
)();
