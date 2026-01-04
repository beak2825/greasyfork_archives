// ==UserScript==
// @name         code-server
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add coder-server url on job detail
// @author       You
// @match        http://paddlecloud.baidu-int.com/paddle/job/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470643/code-server.user.js
// @updateURL https://update.greasyfork.org/scripts/470643/code-server.meta.js
// ==/UserScript==

function get_a() {
    let a = document.querySelector("#resourceInfo > div.ant-table-wrapper > div > div > div > div > div.ant-table-body > table > tbody > tr.ant-table-row.ant-table-row-level-0 > td:nth-child(2)");
    return a;
}

function get_d(){
    let d = document.querySelector("#resourceInfo > div.ant-table-wrapper > div > div > div > div > div.ant-table-body > table > tbody > tr.ant-table-row.ant-table-row-level-0 > td.ant-table-cell.ant-table-cell-fix-right.ant-table-cell-fix-right-first > div")
    return d;
}


(function() {
    'use strict';
    let interval = setInterval(function(){
        let a = get_a();
        let d = get_d();
        console.log(a);
        console.log(d);
        if (a && d) {
            console.log("add code server");
            let ip = a.innerText;
            var code = document.createElement("a");
            code.href = "http://" + ip + ":8000";
            code.class = "ant-btn ant-btn-link";
            var s = document.createElement("span");
            s.innerHTML = "\n code-server\n";
            code.appendChild(s);
            console.log("ip: ", ip);
            d.appendChild(code);
            clearInterval(interval);
        }
    }, 500);
    // Your code here...
})();