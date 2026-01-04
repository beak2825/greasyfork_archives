// ==UserScript==
// @name         不能便宜叔叔之大会员每个月5B币券
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://cdn.bootcss.com/qs/6.5.1/qs.min.js
// @downloadURL https://update.greasyfork.org/scripts/422069/%E4%B8%8D%E8%83%BD%E4%BE%BF%E5%AE%9C%E5%8F%94%E5%8F%94%E4%B9%8B%E5%A4%A7%E4%BC%9A%E5%91%98%E6%AF%8F%E4%B8%AA%E6%9C%885B%E5%B8%81%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/422069/%E4%B8%8D%E8%83%BD%E4%BE%BF%E5%AE%9C%E5%8F%94%E5%8F%94%E4%B9%8B%E5%A4%A7%E4%BC%9A%E5%91%98%E6%AF%8F%E4%B8%AA%E6%9C%885B%E5%B8%81%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const postType = 1 //1：b币，2：10元优惠券
    const url = 'https://api.bilibili.com/x/vip/privilege/receive'
    const csrf = getJct()
    axios.defaults.withCredentials = true
    axios.post(url,Qs.stringify({ type: postType, csrf: csrf })).then(res=> {
        if (res.data.code === 0) {
            console.log('B币券领取成功')
        } else {
            console.log(res.data.message)
        }
    })
    function getJct() {
        let bili_jct = ''
        document.cookie.split('; ').forEach(v => {
            if (v.includes('bili_jct')) {
                bili_jct = v.split('=')[1]
            }
        })
        return bili_jct
    }
    // Your code here...
})();
