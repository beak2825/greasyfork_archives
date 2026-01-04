// ==UserScript==
// @name         网薪导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  易班网薪导出
// @author       You
// @match        https://mp.yiban.cn/app/school-salary-data-export/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yiban.cn
// @grant        none
// @license      MIT
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/443353/%E7%BD%91%E8%96%AA%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/443353/%E7%BD%91%E8%96%AA%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
var date = new Date();
var today = date.toISOString().split("T")[0];
date.setMonth(date.getMonth()-1);
var dataList = [];
window.dataList = dataList;
var lastMonthDay = date.toISOString().split("T")[0];
(async function() {
    'use strict';
    setTimeout(()=>{
        let btn = $("body > div.app-container.admin-layout > div.app-content > div.main-content > div.yb-list-view.page--school-salary-data-export-list > section > button").clone();
        console.log(btn)
        btn.css("background-color","#ff5100");
        btn.appendTo("body > div.app-container.admin-layout > div.app-content > div.main-content > div.yb-list-view.page--school-salary-data-export-list > section");
        let text = btn.find("span");
        btn.click(async ()=>{
            console.log("点击导出");
            btn.unbind("click");
            text.text("正在导出");
            await exportList(text);
            text.text("导出完成");
        });
    },2000);

})();
async function exportList(progress)
{
    var res = await request(1);
    var list = res.data.list;
    var errorCount = 0;
    dataList = dataList.concat(list);

    var totalPageNum = Math.ceil(res.data.page.total / 200);
    for (var pageIndex = 2;pageIndex <= totalPageNum;pageIndex++)
    {
        //if (pageIndex == 100) break;
        try
        {
            var page = await request(pageIndex);
            //console.log(page);
            let PageData = page.data.list;
            dataList = dataList.concat(PageData);
            //console.log(dataList);
            progress.text(pageIndex + "/" + totalPageNum + " 失败"+errorCount+"页");
            console.log("页"+pageIndex);
        }
        catch(e)
        {
            errorCount++;
            console.error(e+"第"+ pageIndex +"页获取失败")
        }
    }
    download("output.csv",convertToCSV(dataList))
}
async function request(page)
{
    var res = await $.ajax({
        type: "post",
        url: "https://mp.yiban.cn/admin/statistics/pocketlog/index",
        data: {"page":page,"size":200,"startAndEndTime":[lastMonthDay,today]},
    });
    return res;
}
function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)

    return array.map(it => {
        return Object.values(it).toString()
    }).join('\n')
}
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}