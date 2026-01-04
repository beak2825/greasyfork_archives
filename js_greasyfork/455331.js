// ==UserScript==
// @name         NGA自动签到
// @version      1.0
// @license      WTFPL
// @description  在每天第一次打开网页版NGA时自动签到。
// @author       monat151
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/325815
// @downloadURL https://update.greasyfork.org/scripts/455331/NGA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455331/NGA%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

/*
    This script is modified from 'https://greasyfork.org/zh-CN/scripts/453626-nga签到装置/code' (origin-author: HeliumOctahelide).
*/

(function() {
    'use strict';

    function checkin() {
        let postData;
        let logging;
        let domain = document.domain;
        fetch(`https://${domain}/nuke.php?__lib=check_in&__act=check_in&__output=8`, {
            method: 'POST',
            headers: new Headers({
                "X-User-Agent": "Nga_Official"
            })
        })
            .then(res => res.arrayBuffer())
            .catch(error => { postData = { 'error': [error] } })
            .then(buffer => new TextDecoder("gbk").decode(buffer))
            .then((res) => {
            postData = JSON.parse(res);
            if (!postData) {
                logging = "奇怪的错误..."
            } else {
                if ('data' in postData) {
                    logging = postData.data[0]
                    var currDate = new Date();
                    let currDateString = currDate.toLocaleDateString();
                    GM_setValue('nga_monat_last_checkin', currDateString);
                }
                else if ('error' in postData) {
                    logging = postData.error[0]
                }
            }
            console.log('[NGA自动签到]', logging);
        });
    }

    setTimeout(()=>{
        let lastCheckInDate = GM_getValue('nga_monat_last_checkin');
        var currDate = new Date();
        let currDateString = currDate.toLocaleDateString();

        if(lastCheckInDate == currDateString){
            console.log('[NGA自动签到]', '今日已经签到过...')
        }
        else{
            checkin();
        }
    },200);
})();