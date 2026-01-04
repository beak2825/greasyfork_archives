// ==UserScript==
// @name        Moe Dict Sort & Result Size Redirect
// @description 在使用教育部《重編國語辭典修訂本》搜尋字詞時，讓一頁顯示100條結果，且以字數(升冪)排序
// @icon https://dict.revised.moe.edu.tw/favicon.ico
// @author       Kamikiri
// @namespace    kamikiriptt@gmail.com
// @match       http://dict.revised.moe.edu.tw/search.jsp?md=1&word=*
// @match       https://dict.revised.moe.edu.tw/search.jsp?md=1&word=*
// @license      GPL
// @version      1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545946/Moe%20Dict%20Sort%20%20Result%20Size%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/545946/Moe%20Dict%20Sort%20%20Result%20Size%20Redirect.meta.js
// ==/UserScript==

var url = new URL(location.href);

// 檢查網址參數是否已經包含 order=2 和 size=100
if (!url.searchParams.has('order') || url.searchParams.get('order') !== '2' || !url.searchParams.has('size') || url.searchParams.get('size') !== '100') {
    // 若不包含，則執行重定向
    url.searchParams.set('order', '2');
    url.searchParams.set('size', '100');
    location.href = url.toString();
}