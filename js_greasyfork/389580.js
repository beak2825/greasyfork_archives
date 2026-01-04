// ==UserScript==
// @icon        http://gw.alicdn.com/tfs/TB1MUjqiCzqK1RjSZFpXXakSXXa-100-100.png
// @name        下载hga030每日赛事
// @namespace   http://www.phiex.top
// @author      phiex
// @description 下载hga030每日赛事到本地excel
// @include     http*://205.201.1.199/app/member/account/index.php
// @include     http*://205.201.1.201/app/member/account/index.php
// @include     http*://hga030.com/app/member/account/index.php
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version     1.0.1
// @grant       GM_download
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       unsafeWindow
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/389580/%E4%B8%8B%E8%BD%BDhga030%E6%AF%8F%E6%97%A5%E8%B5%9B%E4%BA%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/389580/%E4%B8%8B%E8%BD%BDhga030%E6%AF%8F%E6%97%A5%E8%B5%9B%E4%BA%8B.meta.js
// ==/UserScript==


;
(function () {
    // 获取赛事
    function catchMatch() {
        // 以下提取赛事
        let $stateDiv = $("iframe#body").contents().find("#div_state");
        // let gtype = $("#sel_gtype", $stateDiv).text()
        // let sel_type = $("#sel_type", $stateDiv).text()
        // let date_start = $("#date_start", $stateDiv).text()
        // console.log(gtype, sel_type, " ", date_start)

        // 获取联赛
        let groupQ = $("#results_tableLine", $stateDiv).find("tr.acc_results_league")
        let hostQ = $("#results_tableLine", $stateDiv).find("tr.acc_result_tr_top")
        let gustQ = $("#results_tableLine", $stateDiv).find("tr.acc_result_tr_other")
        let matchQuan = groupQ.length
        let matchs = []

        for (let i = 0; i < matchQuan; i++) {
            let match = {}
            match.group = $(groupQ[i]).text().trim() // 联赛

            let info1 = $(hostQ[i]).text().trim().split("\n")
            match.date = info1[0].trim().substr(0, 5); // 日期
            match.time = info1[0].trim().substr(5); // 时间
            match.host = info1[1].trim(); // 主队
            match.hscore = info1[2].trim(); // 主队得分

            let info2 = $(gustQ[i]).text().trim().split("\n");
            match.guest = info2[0].trim();
            match.gscore = info2[1].trim();
            matchs.push(match)
        }
        console.log("获取赛事: " + matchs.length)
        return matchs
    }

    // 合成表格
    function composeTab(matchs) {

        // 以下合成表格
        let matchTab =
            // `<table id="tableToExcel" hidden=true>
            `<tr>
                    <td class="tabHead">日期</td>
                    <td class="tabHead">时间</td>
                    <td class="tabHead">联赛</td>
                    <td class="tabHead">主队</td>
                    <td class="tabHead">客队</td>
                    <td class="tabHead">投注内容</td>
                    <td class="tabHead">赔率</td>
                    <td class="tabHead">下注</td>
                    <td class="tabHead">比分</td>
                    <td class="tabHead">备注</td>
                    <td class="tabHead">输赢</td>
                </tr>`

        for (let i = 0; i < matchs.length; i++) {
            tdFlag = i % 2 != 0 ? `<td class="evenline">` : `<td>`;
            console.log(tdFlag)

            matchTab += `<tr>`
            matchTab += tdFlag + matchs[i].date + `</td>` // 日期
            matchTab += tdFlag + matchs[i].time + `</td>` // 时间
            matchTab += tdFlag + matchs[i].group + `</td>` // 联赛
            matchTab += tdFlag + matchs[i].host + `</td>` // 主队
            matchTab += tdFlag + matchs[i].guest + `</td>` // 客队
            matchTab += tdFlag + `</td>` // 投注内容
            matchTab += tdFlag + `</td>` // 赔率
            matchTab += tdFlag + `</td>` // 下注 
            matchTab += tdFlag + matchs[i].hscore + ` -- ` + matchs[i].gscore + `</td>` // 比分
            matchTab += tdFlag + `</td>` // 备注
            matchTab += tdFlag + `</td>` // 输赢
            matchTab += `</tr>`
        }
        // matchTab += `</table>`

        return matchTab
    }

    // 下载excel动作
    function downloadAction(matchTab) {
        console.log('开始下载excel文件')

        // $(body).append(matchTab)

        let uri = 'data:application/vnd.ms-excel;base64,';
        let template =
            `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
                xmlns:x='urn:schemas-microsoft-com:office:excel' 
                xmlns='http://www.w3.org/TR/REC-html40'>
                <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
                <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8>
                <head>
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>{worksheet}</x:Name>
                                        <x:WorksheetOptions><x:DisplayGridlines/>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    <style type="text/css">
                        table tr {
                            font-size: 12px;
                            height: 30px;
                            text-align: center;
                            color: #000;
                        }
                        td {
                            width: auto;
                            border-top: 1px solid #b2b4b2;
                            border-bottom: 1px solid #b2b4b2;
                            border-left-width: 0em;
                            border-right-width: 0em;
                        }
                        .tabHead {
                            background-color: #2e69f5;
                            color: red
                        }
                        .evenline{
                            background-color: #b2b4b2;
                        }
                    </style>
                </head>
                <body >
                    <table class="excelTable">
                        {table}
                    </table>
                </body>
            </html>`;
        // if (!tableToExcel.nodeType) tableid = document.getElementById(tableToExcel);
        // let ctx = {
        //     worksheet: sheetName || 'Worksheet',
        //     table: tableToExcel.innerHTML
        // };
        let ctx = {
            worksheet: '001',
            table: matchTab,
            header: false
        };
        let expAction = document.createElement('a');
        expAction.href = uri + base64(format(template, ctx));

        let $stateDiv = $("iframe#body").contents().find("#div_state");
        let gtype = $("#sel_gtype", $stateDiv).text()
        let sel_type = $("#sel_type", $stateDiv).text()
        let date_start = $("#date_start", $stateDiv).text()
        console.log(gtype, sel_type, " ", date_start)

        let file = gtype + "_" + sel_type + "_" + date_start + ".xls"; //文件名称

        expAction.download = file;
        expAction.click();
        return false

    }
    //base64转码
    function base64(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    };

    //替换table数据和worksheet名字
    function format(s, c) {
        return s.replace(/{(\w+)}/g,
            function (m, p) {
                return c[p];
            });
    }

    // 下载excel文件
    function downExcel() {
        console.log("开始下载excel");

        let matchs = catchMatch()
        let matchTab = composeTab(matchs)
        downloadAction(matchTab)
    }

    // 插入下载A标签
    function fixdownAFlag() {
        console.log("down A flag is inserted...");
        let $insertPosit = $("iframe#body").contents().find("#results_tableLine").find("td.acc_results_teamw").eq(0);
        $insertPosit.append(`<a id="downAFlag" href=#>下载</a>`)
        $insertPosit.find("#downAFlag").click(downExcel)
    }

    $(function () {
        console.log("开始嵌入...");
        console.log((new Date()).toLocaleString());
        // iframe加载完成入, 插入标签
        var iframe = document.getElementById("body");
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", fixdownAFlag);
        } else {
            iframe.onload = fixdownAFlag;
        }

    });
})();