// ==UserScript==
// @name         天眼查获取公司列表
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  tyc
// @author       xiaooooooo
// @match        https://www.tianyancha.com/search*
// @require      http://cdn.bootcss.com/jquery/1.11.2/jquery.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468643/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E8%8E%B7%E5%8F%96%E5%85%AC%E5%8F%B8%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/468643/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E8%8E%B7%E5%8F%96%E5%85%AC%E5%8F%B8%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 发送的网址
    var monkey_url = 'http://127.0.0.1:8883/ajaxHook';
    var url_list = [];
    // 获取数据列表
    function getdataList(){

        // 获取列表每个公司
        var company_list = $('.index_list-wrap___axcs').find('.index_search-box__7YVh6');
        // 输出查看
        console.log(company_list.length);
        // dataList为存储数据的列表
        var dataList = [];
        // 做for循环获取公司链接及名称
        for(var i=0;i<company_list.length;i++){
            var company_link = $(company_list[i]).find('.index_alink__zcia5').attr('href');
            var company_name = $(company_list[i]).find('.index_alink__zcia5 span').text();
            dataList.push({
                'company_link': company_link,
                'company_name':company_name,
            })
            console.log(company_link);
        }
        console.log(dataList);
        return dataList;
        //return [link_list[0]];
    }

    // 调用获取数据函数
    url_list = getdataList();
    // 发送数据到monkey_url
    GM_xmlhttpRequest({
        method: "POST",
        url: monkey_url,
        data : JSON.stringify({'name':"爬虫",'address':url_list}),
        onload: function(response) {
            //这里写处理函数
            console.log(response);
            console.log(url_list);
            //window.close();
        }
    });



    // Your code here...
})();