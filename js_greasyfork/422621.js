// ==UserScript==
// @name        updown
// @namespace   Violentmonkey Scripts
// @author       hxyou
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match       http*://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/3/3下午5:02:37
// @downloadURL https://update.greasyfork.org/scripts/422621/updown.user.js
// @updateURL https://update.greasyfork.org/scripts/422621/updown.meta.js
// ==/UserScript==

function gestures(direction) {
    $.ajax({
        type: 'post',
        async: false,
        url: 'http://localhost:3011/api/douYin',
        data: {
            obj:  direction ,
        },
        dataType: "json",
        success: function (ret) {
            console.log(ret);

        }
    })
}

document.addEventListener('keydown', function (e) {
    if (e.shiftKey && e.key == 'Home') {
        console.log('up');
        gestures('up')
    }
    if (e.shiftKey && e.key == 'End') {
        console.log('down');

        gestures('down')

    }
})