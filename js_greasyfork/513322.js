// ==UserScript==
// @name         CAU移动校园平台活动预约签到功能修复
// @namespace    http://tampermonkey.net/
// @version      2024-11-19
// @description  用于修复农大企业号移动校园应用平台，后台管理无法导出签退时间的bug，未来可能增加更多功能
// @author       Fanyi, Guo Peking University
// @match        https://wep.cau.edu.cn/signed/backend/default/user-list?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cau.edu.cn
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/513322/CAU%E7%A7%BB%E5%8A%A8%E6%A0%A1%E5%9B%AD%E5%B9%B3%E5%8F%B0%E6%B4%BB%E5%8A%A8%E9%A2%84%E7%BA%A6%E7%AD%BE%E5%88%B0%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/513322/CAU%E7%A7%BB%E5%8A%A8%E6%A0%A1%E5%9B%AD%E5%B9%B3%E5%8F%B0%E6%B4%BB%E5%8A%A8%E9%A2%84%E7%BA%A6%E7%AD%BE%E5%88%B0%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function l(...msg){
        console.log('[Fanyi\'s ToolBox]', ...msg)
    }
    function e(...msg){
        console.error('[Fanyi\'s ToolBox]', ...msg)
    }
    function createNode(htmlStr) {
        var div = document.createElement("div");
        div.innerHTML = htmlStr;
        return div.childNodes[0];
    }
    // 延迟函数，用于控制请求间隔
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    //script.src = 'https://cdn.jsdelivr.net/npm/@e965/xlsx@0.20.3/dist/xlsx.full.min.js'
    script.src = 'https://static.drlchys.xyz/cau/wep.sign/xlsx.full.min.js'
    script.onload = function(){
        l("XLSX模块加载完成！")
    }
    document.documentElement.appendChild(script)

    const params = new URLSearchParams(unsafeWindow.location.search)
    const appointId = params.get('id')
    let allData = []
    async function prepare(id=appointId) {
        const signUrl = `https://wep.cau.edu.cn/site/signpoject/signend?id=${id}`
        //return $.get(url)
        //const url = "https://wep.cau.edu.cn/signed/wap/default/index"
        //return $.post(url, {id: appointId, url: signUrl})
        try {
            const url = "https://wep.cau.edu.cn/uc/wap/login"
            await $.get(url)
        }catch(e){
        }
        try {
            const url2 = "https://wep.cau.edu.cn/a_cau/api/sso/index"
            await $.get(url2)
        }catch(e){
        }
        return true
    }
    async function fetchPage(page, id=appointId) {
        //移动端签到管理页面的API
        const apiUrl = "https://wep.cau.edu.cn/signed/wap/default/record"
        return $.post(apiUrl, { id: id, page: page,page_size:20,keywords:'',status:0 },'json')
            .then(function(response) {
            if(typeof response === 'string')response = $.parseJSON(response)
            if (response.e === 0) {
                return response.d;
            } else {
                e(`获取第${page}页数据时出错:`, response.m);
                return null;
            }
        })
            .catch(function(error) {
            e(`请求第${page}页数据失败:`, error);
            return null;
        });
    }

    // 获取所有分页的数据，每次请求间隔200ms
    async function fetchAllPages() {
        await prepare();
        // 首先请求第一页的数据
        const firstPageData = await fetchPage(1);
        if (!firstPageData) return;

        const totalPages = Math.ceil(firstPageData.total / firstPageData.page_size);
        allData = allData.concat(firstPageData.list);  // 添加第一页数据

        // 依次请求剩余页的数据
        for (let page = 2; page <= totalPages; page++) {
            await delay(200);  // 等待200ms
            const pageData = await fetchPage(page);
            if (pageData) {
                allData = allData.concat(pageData.list);  // 合并数据
            }
        }

        return allData;  // 返回完整的数据
    }



    setTimeout(function(){
        const XLSX = unsafeWindow.XLSX
        const exportContainer = document.querySelector('.table-toolbar-left')
        const exportBtn = createNode(`<a href="javascript:;" class="btn btn-success" style="margin-left:5px;"><i class="fa fa-download"></i> 导出签到列表</a>`)
        exportContainer.appendChild(exportBtn)

        // 使用 XLSX 库将数据转换为 Excel
        function exportToExcel(data) {
            // 提取需要的字段
            const exportData = data.map(item => ({
                "姓名": item.realname,         // 姓名
                "学工号": item.xgh,                   // 学工号
                "签到时间": item.created || '',     // 签到时间
                "签退时间": item.out_time || ''    // 签退时间
            }));

            // 创建工作表
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // 创建工作簿
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, '签到数据');
            const date = new Date()
            // 生成 XLSX 文件并触发下载
            XLSX.writeFile(workbook, `${appointId}签到数据${date.getUTCFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}.xlsx`);
        }

        exportBtn.addEventListener('click',function(){
            l(`点击了导出按钮e`)
            $(exportBtn).attr('disabled',true)
            fetchAllPages().then(function(finalData) {
                l('所有分页数据已获取：', finalData);
                exportToExcel(finalData);
                $(exportBtn).removeAttr('disabled')
            }).catch(function(error) {
                e('获取分页数据时出错:', error);
                bootbox.alert({message:'获取分页数据时出错:'+ error})
                $(exportBtn).removeAttr('disabled')
            });
        })
    },500)
})();