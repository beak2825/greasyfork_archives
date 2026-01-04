// ==UserScript==
// @name         银行快速插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  银行对接金数据
// @match        https://ebank.jxnxs.com/pweb/TransferPre.do
// @author       Essane
// @require      https://cdn.staticfile.org/jquery/1.9.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/453698/%E9%93%B6%E8%A1%8C%E5%BF%AB%E9%80%9F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453698/%E9%93%B6%E8%A1%8C%E5%BF%AB%E9%80%9F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';


    var setBankCode = (row) => {
        var value = row.Value.split("/");
        if (value[2] != null && value[2] != '' && value[2] != '1') {
            alert(row.Name + "行号状态异常");
            document.forms[0].SuperBankCode.value = '';
            return;
        }

        if (document.forms[0].UnionDeptId != null) {
            document.forms[0].UnionDeptId.value = value[0];
        }
        if (document.forms[0].PayeeClearBankId != null) {
            document.forms[0].PayeeClearBankId.value = value[1];
        }
        if (document.forms[0].PayeeBankName != null) {
            document.forms[0].PayeeBankName.value = row.Name;
        }
        if (document.forms[0].PayeeAddr != null) {
            document.forms[0].PayeeAddr.value = row.Name;
        }
        if (document.forms[0].SuperBankName != null) {
            document.forms[0].SuperBankName.value = row.Name;
        }
        if (document.forms[0].SuperBankCode1 != null) {
            document.forms[0].SuperBankCode1.value = value[0];
        }
    };

    setTimeout(function () {
        let mybox = {
            "color": "#fff",
            "position": "fixed",
            "top": "10px",
            "left": "40%",
            "width": "300px",
            "height": "50px",
            "z-index": "999999",
            "padding-top": "10px",
            "text-align": "center",
            "background": "#1a59b7",
            "border-radius": "5px",
        };
        $(".centerBox").append(`
<div class="mybox">
<div>
<span>序号：</span>
<input id="code" style="width:80px;font-size:18px;" maxlength='4'/>
<input type="button" id="btnSearch" value="搜索"/>
</div>
</div>
`);
        $(".mybox").css(mybox);
        $("#code").keydown(function (event) {
            if (event.keyCode == 13) {
                $("#btnSearch").click();
            }
        });
        $("#btnSearch").css("font-size", "18px")
        $("#btnSearch").click(() => {
            let code = $("#code").val()
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://jinshuju.net/forms/GdFAJM/entries?serial_number=" + code + "&cmd=get-records&limit=100&offset=0",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36",
                    "x-requested-with": "XMLHttpRequest",
                },
                onload: (res) => {
                    if (res.responseText == "尚未登录") {
                        alert("请先打开金数据并登录。")
                        window.open("https://jinshuju.net/forms/GdFAJM/entries");
                        return;
                    }
                    let result = JSON.parse(res.responseText).records
                    if (result.length < 1) {
                        alert("未查询到结果，是否登录失效或者序号错误！");
                        return;
                    }
                    let record = result[0];
                    $("#PayeeAcName").val(record.field_1)//收款人
                    $("#PayeeAcNo").val(record.field_6)//收款账号
                    let bankName = "";
                    console.log(record);
                    let data = {}
                    switch (record.field_5) {
                        case "sFly":
                            bankName = "中国农业银行"
                            data = { Value: "103100000026/103100000026/1", SimplePingyin: "zgnyyx", Name: "中国农业银行", AllPingyin: "zhongguonongyeyinxing" }
                            break;
                        case "2A6P":
                            bankName = "中国建设银行"
                            data = { Value: "105100000017/105100000017/1", SimplePingyin: "zgjsyx", Name: "中国建设银行", AllPingyin: "zhongguojiansheyinxing" }
                            break;
                        case "G3Ok":
                            bankName = "中国邮政银行"
                            data = { Value: "403100000004/403100000004/1", SimplePingyin: "zgyzcxyx", Name: "中国邮政储蓄银行", AllPingyin: "zhongguoyouzhengchuxuyinxing" }
                            break;
                        case "c21g":
                            bankName = "中国工商银行"
                            data = { Value: "102100099996/102100099996/1", SimplePingyin: "zggsyx", Name: "中国工商银行", AllPingyin: "zhongguogongshangyinxing" }
                            break;
                        default:
                            break;
                    };
                    $("#Amount").focus();
                    $("#Amount").val(record.field_9);
                    $("#Amount").keypress();
                    $("#Amount").blur();

                    $("#SuperBankCode").val(bankName);
                    setBankCode(data);

                    $("#AutoSavePayeeFlag").attr("checked", false)

                    $("#RemarkAlias1").val("Other");
                    $("#RemarkAlias1").change();

                    $("#Remark").val(record.field_13);//备注

                    setTimeout(() => {
                        $(".searchBtn[name='Submit']").click();
                        setTimeout(() => {
                            parent.document.getElementById('message_box').style.display = 'none';
                            parent.document.getElementById('mask').style.display = 'none';
                            parent.document.getElementById('iframepage').contentWindow.doIt(null);
                        }, 1500);
                    }, 1000);
                }
            });
        });
    }, 500);

})();