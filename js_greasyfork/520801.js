// ==UserScript==
// @name         公众号数据统计
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  计算微信公众号所有推文的数据
// @author       Jonesn
// @match        https://mp.weixin.qq.com/cgi-bin/appmsgpublish*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520801/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/520801/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var stopPage=15;//翻页截止页码自行修改
    var pageNow = parseInt(document.getElementsByClassName("weui-desktop-pagination__num weui-desktop-pagination__num_current")[0].innerText)//获取当前页面标号
    var nextPageButton = document.getElementsByClassName("weui-desktop-btn weui-desktop-btn_default weui-desktop-btn_mini")//获取下一页的按钮
    if( pageNow === 1){
        nextPageButton = nextPageButton[0];
    }else{
        nextPageButton = nextPageButton[1];
    }
    if( pageNow === 1 ){//如果是第一页的话
        GM_setValue("pageinfo",[publish_page]);
        nextPageButton.click();//下一页
    }else if(pageNow<=stopPage){//直到达到目标页面
        var pagein = GM_getValue("pageinfo");
        pagein.push(publish_page);
        GM_setValue("pageinfo",pagein);
        nextPageButton.click();
    }else if(pageNow>stopPage){//达到了目标页面
        pagein = GM_getValue("pageinfo");
        var dataout = [['标题','链接','阅读','在看','点赞','评论(含未精选)','转发','发布时间']];
        pagein.forEach(function(pagedata) { //遍历每个页面的文章数据
            pagedata.publish_list.forEach(function(info) { //遍历每个页面的文章数据
                info.appmsg_info.forEach(function(article) { //遍历每个页面的文章数据
                    var row=[];
                    row.push(article.title);
                    row.push(article.content_url);
                    row.push(article.read_num);
                    row.push(article.like_num);
                    row.push(article.old_like_num);
                    row.push(article.comment_num);
                    row.push(article.share_num);
                    row.push(getLocalTime(article.line_info.send_time + '000'));
                    dataout.push(row);
                });
            });
        });
        console.log(dataout); //输出最终数据
        const csvString = convertToCSV(dataout);
        downloadCSV(csvString, '公众号数据统计.csv');
        //console.log(pagein);
    }
})();
// 数组转换为CSV格式字符串
function convertToCSV(data) {
    return data.map(row =>
                    row
                    .map(String) // 保证每一项都是字符串
                    .map(v => v.replace(/"/g, '""')) // 对包含双引号的内容进行转义
                    .map(v => `"${v}"`) // 对每一项添加双引号
                    .join(',') // 使用逗号分隔每一项
                   ).join('\r\n'); // 使用换行符分隔每一行
}
// 创建下载链接
function downloadCSV(csvContent, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function getLocalTime(n) { //时间戳转时间
    return new Date(parseInt(n)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}