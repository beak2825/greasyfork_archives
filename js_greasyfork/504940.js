// ==UserScript==
// @name         新举报集合
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  把所有的新举报全部塞一起
// @author       367ddd
// @license MIT
// @match        https://sstm.moe/modcp/reports/?filter=report_status_1*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504940/%E6%96%B0%E4%B8%BE%E6%8A%A5%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/504940/%E6%96%B0%E4%B8%BE%E6%8A%A5%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let allpages=parseInt($('li.ipsPagination_last>a').attr('data-page'));
    let mother=$('ol[data-role="tableRows"]');
    let inpage=1;
    let outpage=1;
    let setint=null;
    $(mother).find('li.ipsDataItem').each(function(){
        this.remove();
    });
    function autosubmit(page){
        // 创建一个新的XMLHttpRequest对象
        var xhr = new XMLHttpRequest();
        var doc = null;
        // 配置HTTP请求
        xhr.open('GET', 'https://sstm.moe/modcp/reports/?filter=report_status_1&page='+page, true);
        // 设置请求完成的处理函数
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // 请求成功，处理响应
                var response = this.response;
                // 解析HTML为DOM
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                // 现在你可以使用doc作为Document对象来操作DOM
                //console.log(doc.title); // 打印网页的标题
                if(doc==null){console.error();}
                //var areaname=$(doc).find('[data-role="breadcrumbList"]>li')[2].innerText.trim()
                $(doc).find('ol[data-role="tableRows"]>li.ipsDataItem').each(function(){
                    mother.append(this);
                });
                inpage++;
            } else {
                // 请求失败，处理错误
                console.error(this.statusText);
            }
        };
        // 发送XHR请求
        xhr.send();
    }
    setint= setInterval(function(){if(inpage>allpages){clearInterval(setint);alert('所有新举报加载完毕');}if(inpage==outpage&&inpage<=allpages){autosubmit(inpage);outpage++;}},200);

    // Your code here...
})();