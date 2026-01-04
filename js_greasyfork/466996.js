// ==UserScript==
// @name         ssd发种体积统计
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  ssd发种体积统计（内部使用）
// @author       albao
// @match        https://springsunday.net/userdetails.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466996/ssd%E5%8F%91%E7%A7%8D%E4%BD%93%E7%A7%AF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/466996/ssd%E5%8F%91%E7%A7%8D%E4%BD%93%E7%A7%AF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
function v(s){
    let n = parseFloat(s.slice(0,-2));
    let d = s.slice(-2);
    if(d=='MB'){n/=1000;}
    else if(d=='TB'){n*=1000;}
    return n;
}

(function() {
    'use strict';
    let button = document.getElementById('ka');
    var observer = new MutationObserver(function (mutations,observe){
        console.log('observe!!');
        let max_cnt = document.getElementById('ka').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].children.length-1;
        //let _cnt = parseInt(document.getElementById('ka').getElementsByTagName('b')[1].textContent);
        let _cnt = /本月发布.{0,2}?(\d+).{0,2}?个/.exec(document.getElementById('ka').textContent.substring(0,50))[1];
        let cnt = 0;
        if (_cnt > max_cnt) {
            // alert('发种大于100，只统计100个');
            cnt = max_cnt;
        }else {
            cnt = _cnt
        }
        let t = document.getElementById('ka').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].children;
        let n_all = 0;
        for (let i=1; i<=cnt; i++) {
            let _title = t[i].getElementsByTagName('td')[1].getElementsByTagName('a')[0].title;
            if (_title.indexOf('-CMCT')>0||_title.indexOf('-Oldboys')>0) {
                n_all += v(t[i].children[2].textContent);
            }else {
                console.log(t[i].textContent);
            }
        }
        // alert(n_all.toFixed(2)+' GB');
        let br = document.createElement('br');
        let span = document.createElement('span');
        span.style.fontSize = '13px';
        if (_cnt <= max_cnt) {
            span.innerHTML = '本月共发布 <b>' + n_all.toFixed(2) + '</b> GB官方种子';
        }else {
            span.innerHTML = '本月共发布 <b>' + n_all.toFixed(2) + '</b> GB官方种子（最近' + max_cnt +'个）';
        }
        span.id = 'ssd-upload-test';
        if (document.getElementById('ssd-upload-test') == null) {
            document.getElementById('ka').prepend(br);
            document.getElementById('ka').prepend(span);
        }
    });
    observer.observe(button,{ childList: true});
    //var x = document.getElementById('ka').parentElement;
    //x.prepend(button);
})();