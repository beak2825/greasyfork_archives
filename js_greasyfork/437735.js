// ==UserScript==
// @name         DataMonitor
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  用于数据监测
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437735/DataMonitor.user.js
// @updateURL https://update.greasyfork.org/scripts/437735/DataMonitor.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.addEventListener('load', function() {
        var array = new Array()
        let str
        var text
        setInterval(function() {
            if(document.querySelector('.tar') != null && document.querySelector('.num') != null) {
                let tar = document.querySelector('.tar')
                let num = document.querySelector('.num')
                console.log(tar);
                console.log(tar.innerHTML);
                console.log(num);
                if(text != (tar.innerHTML + "+" + num.innerHTML)) {
                    text = tar.innerHTML + "+" + num.innerHTML
                    array.push(text)
                    str = JSON.stringify(array)
                    localStorage.setItem('wuhu', str)
                }
            }
        }, 1000)

})
})();