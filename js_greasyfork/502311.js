// ==UserScript==
// @name         Add Solution To GMOJ
// @namespace    https://greasyfork.org/zh-CN/users/1342573-lnw143
// @version      1.2
// @description  添加一份 solution 到 GMOJ
// @author       lnw143
// @match        https://gmoj.net/senior/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gmoj.net
// @grant        none
// @connect      lnw143.github.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502311/Add%20Solution%20To%20GMOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/502311/Add%20Solution%20To%20GMOJ.meta.js
// ==/UserScript==

function waitElement(selector, callback) {
    if ($(selector).length) {
        callback();
    } else {
        setTimeout(() => {
            waitElement(selector, callback);
        }, 100);
    }
}

waitElement(
    '#sidebar',
    function() {
        'use strict';
        console.log("running");
        let urls = location.href.split('/');
        const pid = urls[urls.length-1];
        if(pid.length != 4){
            console.error('pid is not 4 digits');
            return;
        }
        console.log('pid is ' + pid);
        $('#sidebar .well:contains("题解")').append(`<div id="solution">
		<div class="link_solution" data-toggle="tooltip" title="" data-original-title="By lnw143">
		<a href="https://lnw143.github.io/blog/gmoj/p` + pid + `/">solution</a>
		</div> </div>`);
        $('#solution').css({
            'margin-bottom': '4px',
            'display': 'flex',
        })
        $('.link_solution').tooltip();
        console.log('finished');
    }
);