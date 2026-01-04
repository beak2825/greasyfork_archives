// ==UserScript==
// @name         Wos Download Bot
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  wos核心论文集下载机器人
// @author       AngelLiang
// @match        https://www.webofscience.com/wos/woscc/summary/*/relevance/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webofscience.com
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @grant        GM_download
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459181/Wos%20Download%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/459181/Wos%20Download%20Bot.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const DOWNLOAD_URL = "https://www.webofscience.com/api/wosnx/indic/export/saveToFile";
    const DEFAULT_WAIT_SECOND = "30"

    var total = "";
    var perPage = 500

    var uuid = ""
    var wosSid = ""
    var waitSecond = null

    function getTotal() {
        total = $(".brand-blue").text()
        total = total.replace(",", "")
        total = parseInt(total)
        return total
    }

    // 根据index获取页码数量
    function getNextPage(index) {
        let start = 1 + index * perPage
        let stop = perPage + index * perPage
        return [""+start, ""+stop]
    }

    // 获取期刊的uuid
    function getParentQid() {
        let currUrl = String(window.location.href);
        return currUrl.split('/')[6]
    }

    // 生成请求页面数
    function genRequestPageNumber() {
        total = getTotal()
        let number = total / perPage
        return Math.ceil(number)
    }

    function get_bm_telemetry() {
        return bmak['sensor_data']
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
            "fileOpt": "othersoftware",
            "action": "saveToFieldTagged",
            "markFrom": start,
            "markTo": stop,
            "view": "summary",
            "isRefQuery": "false",
            "locale": "en_US",
            "filters": "fullRecordPlus",
            "bm-telemetry": get_bm_telemetry()
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

        let reqAjax = $.ajax({
            url:DOWNLOAD_URL,
            type: 'POST',
            headers: {
                "x-1p-wos-sid": wosSid,
                "content-type": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9"
            },
            "crossDomain": true,
            data: genRequestData(start, stop),
            success: function(result){
                //console.log(result);
                let filename = "" + start + '-' + stop + '.xls'
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
            var sleepNum = randomNum(waitSecond - 5, waitSecond + 5)
            console.log("等待" + sleepNum + "秒后再下载")
            sleep(sleepNum*1000)
            callback(nextStart, nextStop, total, callback)
        })
    }

    function requestFile(i, number, total, callback) {
        if (waitSecond == null) {
            waitSecond = prompt("请输入下载间隔时间（±5s），单位秒", DEFAULT_WAIT_SECOND);
        }
        if (waitSecond ==  null) {
            alert("取消下载");
            return
        }
        waitSecond = parseInt(waitSecond)
        if(waitSecond < 20 ) {
            alert("下载间隔时间不能小于20s");
            return
        }

        var nextPageParam = getNextPage(i - 1)
        var start0 = nextPageParam[0]
        var stop = nextPageParam[1]

        //console.log(nextPageParam)
        var start = prompt("请输入下载开始份数，默认从1开始", 1);
        if (start == null) {
            alert("取消下载");
            return
        }
        else if(start < start0 || start > total ) {
            alert("超出范围，取消下载");
            return
        }
        stop = parseInt(start) + 500 - 1

        //console.log(start +","+stop)

        requestFileByIndex(start, stop, total, requestFileByIndex)
    }

    function getSessionID(doc) {
        const sidRegex = /sid=([a-zA-Z0-9]+)/i;

        // session ID is embedded in the static page inside an inline <script>
        // if you have the right HttpOnly cookie set. if we can't find it, we
        // initialize our session as the web app does
        for (let scriptTag of doc.querySelectorAll('script')) {
            let sid = scriptTag.textContent.match(sidRegex);
            if (sid) {
                return sid[1];
            }
        }
        return null
    }

    function downloadCallback() {
        console.log("===下载文件===")
        wosSid = getSessionID(document)
        // console.log(wosSid)
        uuid = getParentQid()
        // console.log(uuid)
        let total = getTotal()
        // console.log(total)
        let number = genRequestPageNumber(total)
        requestFile(1, number, total, requestFile)
    }

    function addButton() {
        console.log("addButton")
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
    };

    $(document).ready(function () {
        if (window.location.href.startsWith('https://www.webofscience.com')) {
            addButton()
        }
    })

})();
