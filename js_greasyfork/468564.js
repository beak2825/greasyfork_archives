// ==UserScript==
// @name           southplus已购买帖标记
// @author         高亮southplus已购买帖子
// @description    Make RJ code great again!
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_setValue
// @grant          GM_getValue
// @inject-into    auto
// @match          *://*/*
// @run-at         document-end
// @version        0.1.0
// @license        MIT
// @require http://libs.baidu.com/jquery/2.0.0/jquery.js
 
// @namespace SettingDust
// @downloadURL https://update.greasyfork.org/scripts/468564/southplus%E5%B7%B2%E8%B4%AD%E4%B9%B0%E5%B8%96%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468564/southplus%E5%B7%B2%E8%B4%AD%E4%B9%B0%E5%B8%96%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

// 遍历所有的 tr 元素
$('#ajaxtable > tbody:nth-child(2) > tr').each(function () {
    // 获取 td:nth-child(5) > a 的 URL
    let item= $(this);
    var url = $(this).find('td:nth-child(5) > a').attr('href');
    if (url) {
        // 从 URL 中提取 tid
        var tid = extractTidFromUrl(url);
        check_buy(tid, item)

    }
});
// 遍历所有的 tr 元素
$('#thread_img > div > ul > li').each(function () {
    // 获取 td:nth-child(5) > a 的 URL
    let item = $(this);
    var url = $(this).find('div > span.section-title > a').attr('href');
    if (url) {
        // 从 URL 中提取 tid
        var tid = extractTidFromUrl(url);
        check_buy(tid, item)
    }
});


// 从 URL 中提取 tid 的函数
function extractTidFromUrl(url) {
    return url.split('tid-')[url.split('tid-').length-1].split('.')[0].split('-')[0]
}

function check_buy(tid, item){
    var currentURL = window.location.href;
    var domain = window.location.hostname;

    // 发送 AJAX 请求
    GM_xmlhttpRequest({
        url: `https://${domain}/read.php?tid-${tid}.html`,
        headers: {
            'Cookie': document.cookie
        },
        onload: function (response) {
            if (response.status === 200) {
                // 创建一个虚拟的 div 元素，用于解析 HTML 响应
                var div = document.createElement('div');
                div.innerHTML = response.responseText;

                // 查找 buy button 元素
                var buyButton = div.querySelector('h6 > input.btn.btn-danger');

                // 查找 buy block 元素
                var buyBlock = div.querySelector('blockquote.blockquote.jumbotron');

                // 判断是否存在 buy button 和 buy block
                if (!buyButton && buyBlock) {
                    $(item).css('background-color', '#E3EDCD');
                } else if (buyBlock) {
                    console.log('Buy block found. OK');
                }
            } else {
                console.log("Request failed with status:", response.status);
            }
        },
        onerror: function (error) {
            console.log("Request failed:", error);
        }
    });
}
