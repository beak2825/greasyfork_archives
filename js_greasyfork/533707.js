// ==UserScript==
// @name         飘天文学
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  去除飘天文学广告
// @license      MIT
// @author       xiao la ji
// @match        https://www.piaotia.com/html/*
// @include      https://www.piaotia.com/html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=piaotia.com
// @downloadURL https://update.greasyfork.org/scripts/533707/%E9%A3%98%E5%A4%A9%E6%96%87%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/533707/%E9%A3%98%E5%A4%A9%E6%96%87%E5%AD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.getElementById('content').style.fontSize = '20px';
    var tables = document.getElementsByTagName('table');
    for(var i = 0; i < tables.length; i++) {
        var elementTable = tables[i];
        elementTable.style.display = 'none'
    }
    document.onkeydown = function(e) {
        if(e.key == 'd') {
            console.log(document.getElementsByClassName('bottomlink'))
            let ATagArr = document.getElementsByClassName('bottomlink')[0].getElementsByTagName('a')
            let a = document.createElement('a')
            a.setAttribute('href', ATagArr[5].href);
            document.body.appendChild(a);
            a.click();
        }
        if(e.key == 'a') {
            console.log(document.getElementsByClassName('bottomlink'))
            let ATagArr = document.getElementsByClassName('bottomlink')[0].getElementsByTagName('a')
            let a = document.createElement('a')
            a.setAttribute('href', ATagArr[0].href);
            document.body.appendChild(a);
            a.click();
        }
        if(e.key == 'D') {
            console.log(document.getElementsByClassName('bottomlink'))
            let ATagArr = document.getElementsByClassName('bottomlink')[0].getElementsByTagName('a')
            let a = document.createElement('a')
            a.setAttribute('href', ATagArr[5].href);
            document.body.appendChild(a);
            a.click();
        }
        if(e.key == 'A') {
            console.log(document.getElementsByClassName('bottomlink'))
            let ATagArr = document.getElementsByClassName('bottomlink')[0].getElementsByTagName('a')
            let a = document.createElement('a')
            a.setAttribute('href', ATagArr[0].href);
            document.body.appendChild(a);
            a.click();
        }
    }
    setTimeout(() => {
        let img = document.getElementById('exo-im-container-wrapper')
        img.remove()
    }, 3000)
})();