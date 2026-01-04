// ==UserScript==
// @name         时间戳和hourId可读化
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  time formatter
// @author       Yao Wu
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450752/%E6%97%B6%E9%97%B4%E6%88%B3%E5%92%8ChourId%E5%8F%AF%E8%AF%BB%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450752/%E6%97%B6%E9%97%B4%E6%88%B3%E5%92%8ChourId%E5%8F%AF%E8%AF%BB%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var _time_div = document.createElement('div')
    _time_div.id = "_time_div"
    _time_div.style.display = 'none'
    _time_div.style.position = 'fixed'
    _time_div.style.background = 'aquamarine';
    _time_div.style.border = 'solid';
    _time_div.style.padding = '10px'
    _time_div.style['z-index'] = 10000
    document.body.appendChild(_time_div)

    window.addEventListener('scroll', function(){_time_div.style.display = 'none'})
    window.addEventListener('resize', function(){_time_div.style.display = 'none'})
    window.addEventListener('keydown', function(){_time_div.style.display = 'none'})
    window.addEventListener('mousedown', function(){_time_div.style.display = 'none'})

    window.addEventListener('mouseup', function(event){
        try {
            var x = event.clientX, y = event.clientY;
            var mousePos = {top: y, left: x};
            // window.term是webshell，优先匹配webShell
            var selection = window.term ? window.term.getSelection() : window.getSelection();
            var rect = selection.getRangeAt && selection.getRangeAt(0)?  selection.getRangeAt(0).getBoundingClientRect() : mousePos;
            if (mousePos.top - rect.top > 100) rect = mousePos;
            if (!selection) return;
            var str = selection.toString().trim().replace(/(^[^\w]+)|([^\w]+$)/g, '');
            var time = 0;
            if (str.match(/^1\d{12}$/g)){
                time = parseInt(str)
            }else if (str.match(/^1\d{9}$/g)){
                time = parseInt(str) * 1000;
            }else if (str.match(/^4\d{5}$/g)){
                time = parseInt(str) * 3600 * 1000
            }else return;

            _time_div.innerHTML = moment(new Date(time)).format()//"UTC:" + new Date(time).toISOString()
            _time_div.style.top = (rect.top - 50 > 0? rect.top - 50 : 0) + 'px'
            _time_div.style.left = rect.left+'px'
            _time_div.style.display = 'block'
       } catch(e){console.error(e)}
    })
})();