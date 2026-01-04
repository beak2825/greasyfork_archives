// ==UserScript==
// @name         V2EX自动签到
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  一个简单的V2EX自动签到脚本
// @author       ruanima
// @match        https://v2ex.com/
// @match        https://www.v2ex.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454058/V2EX%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/454058/V2EX%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
'use strict';

function makeRequest(url, callBack) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if(httpRequest.readyState === 4){
            callBack(httpRequest.responseText)
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}


function mission_daily() {
    let banner = document.querySelector('#Rightbar a[href="/mission/daily"]')
    if (!banner) {
        console.log('already done, skip check')
        return
    }

    makeRequest('/mission/daily', function(context) {
        var el = document.createElement('html');
        el.innerHTML = context
        let button = el.querySelector('#Main > div.box > div:nth-child(2) > input[value^="领取"]')
        if (button) {
            let url = button.attributes['onclick'].textContent.match(new RegExp("'([^']*)'"))[1]
            makeRequest(url, function(context) {
                banner.parentNode.innerHTML = '每日登录奖励已领取'
                console.log('do mission_daily')
                console.log(context.match(/每日登录奖励已领取/)[0])
            })
        } else {
            console.log('already done, skip click')
        }
    })
}

setTimeout(mission_daily, 2000)
})();