// ==UserScript==
// @name         阿里法拍列表页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  info collect
// @author       You
// @match        https://sf.taobao.com/notice_list.htm?*
// @match        https://sf.taobao.com/noticeList.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @require      http://cdn.bootcss.com/jquery/1.11.2/jquery.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476673/%E9%98%BF%E9%87%8C%E6%B3%95%E6%8B%8D%E5%88%97%E8%A1%A8%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/476673/%E9%98%BF%E9%87%8C%E6%B3%95%E6%8B%8D%E5%88%97%E8%A1%A8%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var start = new Date().getTime();
    var monkey_url = 'http://127.0.0.1:8883/itemList';

    elmGetter.selector($);
    elmGetter.each('ul.list-con li', company_name => {

        console.info('page is fully loaded');
        var dataList = [];
        var root_url = window.location.href
        var title = company_name.find('h2 a').attr('title');
        var url = 'https:' + company_name.find('a').attr('href');
        var date = company_name.find('p span.date').text();

        var iframe = document.createElement('iframe');
        iframe.id = 'Autopage_iframe';
        iframe.src = url;
        console.info(iframe.src)

        document.documentElement.appendChild(document.createElement('style')).textContent = 'iframe#Autopage_iframe {position: absolute !important; top: -9999px !important; left: -9999px !important; width: 100% !important; height: 100% !important; border: none !important; z-index: -999 !important;}';

        document.documentElement.appendChild(iframe);

        if (title) {
            dataList.push({
                '文章标题': title,
                '文章日期': date,
                '文章链接': url,
                '目录保存': root_url
            })


            console.info(dataList);
            var end = new Date().getTime();
            var spend_time = (end - start) / 1000;
            GM_xmlhttpRequest({
                method: "POST",
                url: monkey_url,
                data: JSON.stringify(dataList),
                onload: function (response) {
                    console.log(response);
                    console.log(dataList);
                    const t3 = Date.now();
                    console.log(t3 - start);
                }
            });
        }
    });


})();

