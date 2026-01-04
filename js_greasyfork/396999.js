// ==UserScript==
// @name         民生存管明细导出工具
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  民生存管明细导出工具. 导出交易明细用。
// @author       zgldh
// @match        https://tbank.cmbc.com.cn:50002/tradeBank/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396999/%E6%B0%91%E7%94%9F%E5%AD%98%E7%AE%A1%E6%98%8E%E7%BB%86%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/396999/%E6%B0%91%E7%94%9F%E5%AD%98%E7%AE%A1%E6%98%8E%E7%BB%86%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let API_URL = 'https://tbank.cmbc.com.cn:50002/tradeBank/query/transDetailQuery.html';
    let MIN_DATE = null;
    let MAX_DATE = null;

    let CSV_CONTENT = "交易时间\t业务名称\t金额\t交易后余额\t对方账号\t对方名称\t商户订单号\t项目代码\t摘要\n";

    var POST_BODY = "";

    var dumpButton = $('<input type="button" value="导出" class="but_01 m_10">');

    function createDumpButton(){
        var searchButton = $('input[value="查询"]');
        searchButton.parent().append(dumpButton);
        dumpButton.click(dump);
    }

    function preparePostBody(){
        let form = $('#hiddenFormId');
        //prdCode=&secuNo=0001&usrId=zgldh123&token=${TOKEN}&transCode=${TRANS_CODE}&fundAcc=${FUNDACC}&pageSize=20&orderId=${ORDERID}&flag=1
        POST_BODY = 'prdCode=&secuNo='+form.find('[name="secuNo"]').val();
        POST_BODY += '&usrId='+form.find('[name="usrId"]').val();
        POST_BODY += '&token='+form.find('[name="token"]').val();
        POST_BODY += '&transCode='+form.find('[name="transCode"]').val();
        POST_BODY += '&fundAcc='+form.find('[name="fundAcc"]').val();
        POST_BODY += '&pageSize=20';
        POST_BODY += '&orderId='+form.find('[name="orderId"]').val();
        POST_BODY += '&flag=1';
    }

    async function fetch(url) {
        const p = new Promise((resolve, reject) => {
            $.get(url, function (result) {
                resolve(result);
            })
        })
        return p
    }

    function buildURL(dateString, pageNumber){
        let url = API_URL + `?startDate=${dateString}&endDate=${dateString}&currentPage=${pageNumber}&` + POST_BODY;
        return url;
    }

    function getDayTotalPage($) {
        var msPageText = $.find('.ms_page').text();
        var totalPage = /共(\d+)页/.exec(msPageText);
        return parseInt(totalPage[1]);
    }

    async function loadDayPage(dateString, pageNumber){
        return new Promise(async function(resolve, reject){
            let url = buildURL(dateString, pageNumber);
            let result = await fetch(url);
            const foundTrs = $(result).find('.table-striped tbody tr');

            dumpButton.val("导出\n"+dateString+"-"+pageNumber+"页");
            if (foundTrs.length === 0) {
                console.log('Page ' + dateString + ', '+ pageNumber +' is empty.');
                resolve(true);
            }
            foundTrs.each(function(i, elem) {
                let trdata = $(this)
                .find('td')
                .map(function(j, td) {
                    return $(this).text();
                })
                .get();
                CSV_CONTENT += trdata.join("\t") + "\n";
            });

            if (pageNumber === 1) {
                let totalPage = getDayTotalPage($(result));
                if (totalPage > 1) {
                    for (var page = 2; page <= totalPage; page++) {
                        await loadDayPage(dateString, page);
                    }
                    console.log(`${totalPage - 1} more pages queued.`);
                }
            }

            setTimeout(function(){
                resolve(true);
            },1000);
        });
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

    async function dump(e){
        dumpButton.attr("disabled","disabled");
        MIN_DATE = moment($('#startDate').val());
        MAX_DATE = moment($('#endDate').val());
        let fileName = "民生存管明细"+MIN_DATE.format('YYYYMMDD')+"-"+MAX_DATE.format('YYYYMMDD')+'.csv';

        for (var date = MIN_DATE; date.isSameOrBefore(MAX_DATE); date = date.add(1, 'day')) {
            let dateString = date.format('YYYYMMDD');
            await loadDayPage(dateString, 1)

            console.log(`Date ${dateString} pushed.`);
        }

        download(fileName, CSV_CONTENT);
        dumpButton.removeAttr("disabled");
        dumpButton.val("导出");
    }

    function init(){
        preparePostBody();
        createDumpButton();
    }

    init();
})();