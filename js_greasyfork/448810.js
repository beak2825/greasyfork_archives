// ==UserScript==
// @name         Wos Download Bot
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  wos核心论文集下载机器人
// @author       AngelLiang
// @match        https://www.webofscience.com/wos/woscc/summary/*/relevance/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webofscience.com
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @require      https://code.jquery.com/ui/1.13.0/jquery-ui.min.js
// @grant        GM_download
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448810/Wos%20Download%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/448810/Wos%20Download%20Bot.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const DOWNLOAD_URL = "https://www.webofscience.com/api/wosnx/indic/export/saveToFile";

    var total = "";
    // 论文集的唯一码
    var uuid = ""
    // wos的唯一码（？）
    var wosSid = ""
    // 等待秒数
    var waitSecond = 30
    var fileFormat = ''

    function getTotal() {
        total = $(".brand-blue").text()
        total = total.replace(",", "")
        total = parseInt(total)
        return total
    }

    // 获取期刊的uuid
    function getParentQid() {
        let currUrl = String(window.location.href);
        return currUrl.split('/')[6]
    }

    function get_bm_telemetry() {
        // return bmak['sensor_data']
        // update: 20230709修改接口
        return bmak.get_telemetry()
    }

    function get_fileOpt() {
        if (fileFormat == 'excel') {
            return "xls"
        } else if (fileFormat == 'ris') {
            return "othersoftware"
        } else if (fileFormat == 'bibtex'){
            return "othersoftware"
        } else {
            return "othersoftware"
        }
    }

    function get_action() {
        if (fileFormat == 'excel') {
            return "saveToExcel"
        } else if (fileFormat == 'ris') {
            return "saveToRIS"
        } else if (fileFormat == 'bibtex'){
            return "saveToBibtex"
        } else {
            return "saveToFieldTagged"
        } 
    }

    function get_filters() {
        if (fileFormat == 'excel') {
            return "fullRecord"
        } else if (fileFormat == 'ris') {
            return "fullRecord"
        } else if (fileFormat == 'bibtex'){
            return "fullRecordPlus"
        } else {
            return "fullRecordPlus"
        } 
    }

    function getDownloadFileExt() {
        if (fileFormat == 'excel') {
            return ".xls"
        } else if (fileFormat == 'ris') {
            return ".ris"
        } else if (fileFormat == 'bibtex'){
            return ".bib"
        } else {
            return ".txt"
        } 
    }

    function genRequestData(start, stop) {
        let requestJson = {
            "parentQid": getParentQid(),
            "sortBy": "relevance",
            "displayTimesCited": "true",
            "displayCitedRefs": "true",
            "product": "UA",
            "colName": "WOS",
            "displayUsageInfo": "true",
            "fileOpt": get_fileOpt(),
            "action": get_action(),
            "markFrom": start,
            "markTo": stop,
            "view": "summary",
            "isRefQuery": "false",
            "locale": "en_US",
            "filters": get_filters(),
            // update: 20231211 不再需要这个字段
            // "bm-telemetry": get_bm_telemetry()
        }
        let requestData = JSON.stringify(requestJson)
        return requestData
    }

    function downloadFile(fileName, content) {
        let downLink = document.createElement('a')
        downLink.download = fileName
        //字符内容转换为blod地址
        let blob = new Blob([content])
        downLink.href = URL.createObjectURL(blob)
        // 链接插入到页面
        document.body.appendChild(downLink)
        downLink.click()
        // 移除下载链接
        document.body.removeChild(downLink)
    }

    function sleep(delay) {
        for(var t = Date.now(); Date.now() - t <= delay;);
    }

    // 生成随机数
    function randomNum(minNum, maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            default:
                return 0;
        }
    }

    function enableDownloadButton(){
        $("#downloadButton").html('一键下载')
        $("#downloadButton").attr("disabled", false);
    }

    function disableDownloadButton(){
        $("#downloadButton").html('正在下载...')
        $("#downloadButton").attr("disabled", true);
    }

    function requestFileByIndex(start, stop, total, callback) {
        start = "" + start;
        if (parseInt(stop) > total) {
            stop = total;
        }
        stop = "" + stop;

        console.log("正在下载" + start + "到" + stop + "份数据，总共" + total + "份")
        disableDownloadButton()
        try {
            var data = genRequestData(start, stop)    
        } catch (error) {
            console.error(error)
            enableDownloadButton()
            alert('请求出错，请联系开发者')
            return
        }

        let reqAjax = $.ajax({
            url:DOWNLOAD_URL,
            type: 'POST',
            headers: {
                "x-1p-wos-sid": wosSid,
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json",
                "accept-language": "zh-CN,zh;q=0.9"
            },
            "crossDomain": true,
            data: data,
            success: function(result){
                //console.log(result);
                let filename = "" + start + '-' + stop + getDownloadFileExt()
                downloadFile(filename, result)
            },
            error: function(err){
                console.log(err);
                console.log(err.responseJSON);
                enableDownloadButton()
                alert('下载出错：'+JSON.stringify(err.responseJSON))
            }
        })

        $.when(reqAjax).done(function(){
            var nextStart = parseInt(start) + 500
            var nextStop = parseInt(stop) + 500
            if (nextStart > total) {
                enableDownloadButton()
                console.log("===下载完成===");
                alert('下载完成')
                return
            }
            let min_val = waitSecond - 5
            let max_val = waitSecond + 5
            var sleepNum = randomNum(min_val, max_val)
            console.log("等待" + sleepNum + "秒后再下载")
            sleep(sleepNum*1000)
            callback(nextStart, nextStop, total, callback)
        })
    }

    function getSessionID() {
        // const sidRegex = /SID=([a-zA-Z0-9]+)/i;

        // // session ID is embedded in the static page inside an inline <script>
        // // if you have the right HttpOnly cookie set. if we can't find it, we
        // // initialize our session as the web app does
        // for (let scriptTag of document.querySelectorAll('script')) {
        //     let sid = scriptTag.textContent.match(sidRegex);
        //     if (sid) {
        //         return sid[1];
        //     }
        // }
        // return null

        return sessionData.BasicProperties.SID
    }

    // 创建弹窗的函数
    function createPopup() {
        // 创建弹窗的容器
        var popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.background = '#fff';
        popupContainer.style.padding = '20px';
        popupContainer.style.border = '1px solid #ccc';
        popupContainer.style.zIndex = '9999';
    
        // 添加设置选项到弹窗
        // bug: 下载的excel还有点问题
        popupContainer.innerHTML = `
        <h3>一键下载</h3>
        <label for="fileFormat">文件格式：</label>
        <select id="fileFormat">
            <option value="ris">RIS</option>
            <option value="bibtex">BibTeX</option>
            <option value="txt">txt</option>
        </select><br>
        <label for="startDownloadFrom">起始下载份数：</label>
        <input type="text" id="startDownloadFrom" value="1"><br>
        <label for="downloadSpeed">下载速率（单位秒）：</label>
        <input type="text" id="downloadSpeed" value="30"><br>
        <button id="confirmButton">开始下载</button>
        <button id="cancelButton">取消</button>
        `;
    
        // 确定下载按钮的点击事件处理
        var confirmButton = popupContainer.querySelector('#confirmButton');
        confirmButton.addEventListener('click', function() {
            waitSecond = parseInt(document.querySelector('#downloadSpeed').value);
            fileFormat = document.querySelector('#fileFormat').value;
            var start = parseInt(document.querySelector('#startDownloadFrom').value);

            // 进行下载操作
            console.log("开始下载")
            wosSid = getSessionID()
            uuid = getParentQid()
            var total = getTotal()

            console.log('下载速率：', waitSecond)
            console.log('文件格式:', fileFormat)
            console.log('起始下载份数：', start)
            console.log('wosSid:', wosSid)
            console.log('uuid:', uuid)
            console.log('总数：', total)

            var stop = start + 500 - 1

            // 校验
            if (waitSecond < 20){
                alert('下载速率不能太快')
                return
            }
            if (start > total) {
                alert('超过下载总数')
                return
            }

            requestFileByIndex(start, stop, total, requestFileByIndex)
            // 移除弹窗
            document.body.removeChild(popupContainer);
        });
    
        // 取消按钮的点击事件处理
        var cancelButton = popupContainer.querySelector('#cancelButton');
            cancelButton.addEventListener('click', function() {
            console.log("取消下载")
            // 移除弹窗
            document.body.removeChild(popupContainer);
        });
    
        // 将弹窗添加到页面
        document.body.appendChild(popupContainer);
    }

    function downloadCallback() {
        createPopup();
    }

    function initButton() {
        $('body').append('<button id="downloadButton">一键下载</button>')
        $('#downloadButton').css('width', '120px')
        $('#downloadButton').css('position', 'absolute')
        $('#downloadButton').css('top', '120px')
        $('#downloadButton').css('right', '50px')
        $('#downloadButton').css('background-color', '#5e33bf')
        $('#downloadButton').css('color', 'white')
        $('#downloadButton').css('font-size', 'large')
        $('#downloadButton').css('z-index', 100)
        $('#downloadButton').css('border-radius', '5px')
        $('#downloadButton').css('text-align', 'center')

        $('#downloadButton').click(downloadCallback)

        // 将按钮添加到页面
        // document.body.appendChild(downloadButton);
    };

    // 检查URL并初始化按钮
    function checkAndInitButton() {
        if (window.location.href.includes('https://www.webofscience.com/')) {
            initButton();
        }
    }

    $(document).ready(function () {
        console.log("WDB-v1.4.1")
        checkAndInitButton();
    })

})();
