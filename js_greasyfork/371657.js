// ==UserScript==
// @name         Steamkey Register
// @namespace    TypeNANA
// @version      0.7
// @description  批量激活steam的许可Key
// @author       TypeNANA
// @match        https://store.steampowered.com/account/registerkey
// @match        https://store.steampowered.com/account/registerkey/
// @downloadURL https://update.greasyfork.org/scripts/371657/Steamkey%20Register.user.js
// @updateURL https://update.greasyfork.org/scripts/371657/Steamkey%20Register.meta.js
// ==/UserScript==

(function () {
    var popup;
    var requestList = []
    var count = 0;
    var timeWaitStart = 0;
    var tableFlag = true;
    var failTxt = {
        9: '已拥有游戏',
        13: '地区限制',
        14: '代码不存在',
        15: '已被使用',
        24: '缺少主游戏',
        53: '次数上限',
    };

    function redeem() {
        var list = [];
        var reg = /[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}/g;
        var txt = document.getElementById("codeInputArea").value;
        var result = ""
        while ((result = reg.exec(txt)) != null) {
            list.push({
                code: result[0],
                id: "-",
                name: "-",
                stat: null,
                message: "-"
            });
        }
        requestList = requestList.concat(list);
        refreshList();
        webRequest(0);
    }

    function refreshList() {
        var view = document.getElementById("codesBody");
        var html = ""
        var num = requestList.length;

        for (var i = requestList.length - 1; i >= 0; i--) {
            var stat = "-"
            if (requestList[i].stat != null) {
                if (requestList[i].stat) {
                    stat = "成功";
                } else {
                    stat = "失败";
                }
            }
            html += '<tr class="' + (requestList[i].stat == false ? 'redeemError' : '') + '"><td class="tdNo">' + num + '</td><td class="tdCode">' +
                requestList[i].code + '</td><td class="tdName"><span class="gameNo">' + "<a style='color:blue!important;' target='_Blank' href='https://steamdb.info/sub/" + requestList[i].id + "'>" +
                requestList[i].id + '</a></span>' +
                requestList[i].name + '</td><td class="tdStat">' +
                stat + '</td><td class="tdMsg">' +
                requestList[i].message + '</td></tr>';
            num--;
        }
        if (requestList.length == 0) {
            html = '<tr><tr class=""><td class="tdNo">-</td><td class="tdCode">-</td><td class="tdName"><span class="gameNo">-</span>-</td><td class="tdStat">-</td><td class="tdMsg">-</td></tr>';
        }
        view.innerHTML = html;
    }

    function webRequest(index) {
        try {
            document.getElementsByClassName("newmodal_background")[0].style.display = "none";
            var modalList = document.getElementsByClassName("newmodal")
            for (var i = modalList.length - 1; i >= 0; i--) {
                modalList[i].outerHTML = "";
            }
        } catch (e) { }

        if (index >= requestList.length) {
            return;
        };
        if (requestList[index] == undefined) {
            webRequest(index + 1);
            return;
        }
        if (requestList[index].used) {
            webRequest(index + 1);
            return;
        };

        requestList[index].message = "激活中…";
        refreshList();

        jQuery.post('https://store.steampowered.com/account/ajaxregisterkey/', {
            product_key: requestList[index].code,
            sessionid: g_sessionID
        }).done(function (res) {
            requestList[index].used = true;
            if (res.success == 1) {
                if (res.purchase_receipt_info != null && res.purchase_receipt_info.line_items.length >= 1) {
                    if (res.purchase_receipt_info.line_items.length == 1) {
                        requestList[index].id = res.purchase_receipt_info.line_items[0].packageid;
                        requestList[index].name = res.purchase_receipt_info.line_items[0].line_item_description;
                    } else {
                        requestList[index].id = res.purchase_receipt_info.line_items[0].packageid;
                        requestList[index].name = res.purchase_receipt_info.line_items[0].line_item_description + "等 共" + (res.purchase_receipt_info.line_items.length - 1) + "个商品";
                    }
                    requestList[index].stat = true;
                    requestList[index].message = "激活成功";
                } else {
                    requestList[index].id = "-";
                    requestList[index].name = "未知";
                    requestList[index].stat = true;
                    requestList[index].message = "激活成功";
                }
            } else {
                if (res.purchase_result_details / 1 == 53) {
                    requestList[index].used = false;
                    timeWaitStart = (new Date()).getTime();
                    setTimeout("document.getElementById('undisplayBtn2').onclick(" + (index) + ")", 1000);
                    popup = ShowBlockingWaitDialog('等待中', '激活间隔等待中，还需等待65分，请勿刷新页面');
                    return;
                } else if (res.purchase_receipt_info != null && res.purchase_receipt_info.line_items.length >= 1) {
                    if (res.purchase_receipt_info.line_items.length == 1) {
                        requestList[index].id = res.purchase_receipt_info.line_items[0].packageid;
                        requestList[index].name = res.purchase_receipt_info.line_items[0].line_item_description;
                    } else {
                        requestList[index].id = res.purchase_receipt_info.line_items[0].packageid;
                        requestList[index].name = res.purchase_receipt_info.line_items[0].line_item_description + "等 共" + (res.purchase_receipt_info.line_items.length - 1) + "个商品";
                    }
                    requestList[index].stat = false;
                    requestList[index].message = (failTxt[res.purchase_result_details]) ? failTxt[res.purchase_result_details] : "未知错误";
                } else {
                    requestList[index].id = "-";
                    requestList[index].name = "未知";
                    requestList[index].stat = false;
                    requestList[index].message = (failTxt[res.purchase_result_details]) ? failTxt[res.purchase_result_details] : "未知错误";
                }
            }
            count++;
            refreshList();
            if (nextOrWait(index)) {
                webRequest(index + 1);
            }
        });
    }

    function nextOrWait(index) {
        if (count >= 9 && ((index + 1) < requestList.length)) {
            count = 0;
            timeWaitStart = (new Date()).getTime();
            setTimeout("document.getElementById('undisplayBtn').onclick(" + (index + 1) + ")", 1000);
            popup = ShowBlockingWaitDialog('等待中', '激活间隔等待中，还需等待20秒，请勿刷新页面');
            return false;
        } else {
            return true;
        }
    }

    function waitComplete(index) {
        var timeNow = (new Date()).getTime();
        var waitTime = 20 - Math.round((timeNow - timeWaitStart) / 1000);
        if (waitTime <= 0) {
            webRequest(index);
        } else {
            try {
                popup.Dismiss();
            } catch (e) { }
            popup = ShowBlockingWaitDialog('等待中', '激活间隔等待中，还需等待' + waitTime + '秒，请勿刷新页面');
            setTimeout("document.getElementById('undisplayBtn').onclick(" + index + ")", 1000);
        }
    }
    /**保险起见，这边等待了65分钟，需要刚好等60分钟的朋友可以把下面的60*65改成60*60 */
    function hourWaitComplete(index) {
        var timeNow = (new Date()).getTime();
        var hourWaitTime = 60 * 65 - Math.round((timeNow - timeWaitStart) / 1000);
        if (hourWaitTime <= 0) {
            webRequest(index);
        } else {
            try {
                popup.Dismiss();
            } catch (e) { }
            popup = ShowBlockingWaitDialog('等待中', '激活间隔等待中，还需等待' + timeString(hourWaitTime) + '，请勿刷新页面');
            setTimeout("document.getElementById('undisplayBtn2').onclick(" + index + ")", 1000);
        }
    }

    function timeString(time) {
        var min = Math.floor(time / 60);
        var sec = time - Math.floor(time / 60) * 60;
        if (min <= 0) {
            return time + "秒";
        } else {
            return min + "分" + sec + "秒";
        }

    }

    function setAdditionalBtn() {
        var html = '<a id="errorOnly" class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="margin-top:15px;float:right;"><span id="showOrHideTxt">只显示未激活的产品代码</span></a><a id="copyError" class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="margin-top:15px;float:right;margin-right:10px;"><span>复制未激活的产品代码</span></a><p id="codeInput" style="width:0px;height:0px;opacity:0"></p>'
        document.getElementById("registerkey_examples_text").innerHTML += html;
        document.getElementById("errorOnly").onclick = function () {
            errorOnly();
        };
        document.getElementById("copyError").onclick = function () {
            copyError();
        };
    }

    function errorOnly() {
        var trList = document.getElementById('codesBody').childElements();
        if (tableFlag) {
            for (var i in trList) {
                if (trList[i].className != "redeemError") {
                    if (trList[i].style) {
                        trList[i].style.display = "none";
                    }
                }
            }
        } else {
            for (var j in trList) {
                if (trList[j].style) {
                    trList[j].style.display = "";
                }
            }
        }
        document.getElementById('showOrHideTxt').innerHTML = tableFlag ? "显示所有产品代码" : "只显示未激活的产品代码"
        tableFlag = !tableFlag;
    }

    function copyError() {
        if (requestList == null || requestList.length == 0) return;

        var str = "";
        for (var i in requestList) {
            if (requestList[i] == null) continue;
            if (requestList[i].stat != false) continue;
            str += requestList[i].code + " ";
            if (requestList[i].id != "-" && requestList[i].id != null) {
                str += requestList[i].id + " ";
            }
            if (requestList[i].name != "-" && requestList[i].name != "未知" && requestList[i].name != null) {
                str += requestList[i].name + " ";
            }
            str += requestList[i].message;
            str += "<br/>"
        }
        var input = document.getElementById("codeInput");
        if (!input) {
            return;
        }
        input.innerHTML = str;
        var range = document.createRange();
        range.selectNode(input);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
    }

    function SetPage() {
        var txt = "<style>#purchase_confirm_ssa{display:none} tr{font-size:12px} th{min-width:0!important;text-align:center!important;padding-left:0!important;padding-right:0!important;} td{padding-left:0!important;padding-right:0!important;} .tdNo,.tdStat,.tdMsg,.tdCode{text-align:center!important;} .redeemError{background-color:#790000!important;} textarea{font: 400 13.3333px Arial;max-width:100%!important;width:100%!important;font-size: 14px!important;} #register_btn{float:right;margin-top:10px}span.gameNo {border-radius: 4px;background: white;font-size: 12px;padding-left: 5px;padding-right: 5px;margin-right: 5px;color:blue;} table{ table-layout: fixed;}.tdName{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}</style>";
        txt += '<table class="account_table"><tr><th style="width:5%;"></th><th style="width:25%">产品代码</th><th style="width:42%;">游戏</th><th style="width:8%">结果</th><th style="width:15%">信息</th></tr><tbody id="codesBody"></tbody></table>';
        document.getElementById("registerkey_examples_text").innerHTML = txt;
        document.getElementById("register_btn").style.display = "none";
        document.getElementById("product_key").style.display = "none";
        document.getElementById("registerkey_form").getElementsByClassName("button_row")[0].innerHTML = '<textarea id="codeInputArea" type="text" class="registerkey_input_box_text" value=""></textarea><br><a class="btnv6_blue_hoverfade btn_medium"  id="redeemAllGames" style="float:right;margin-top:10px"><span>激活</span></a><div id="undisplayBtn" style="display:none;width:0;height:0;"/><div id="undisplayBtn2" style="display:none;width:0;height:0;"/>';
        setAdditionalBtn();
        refreshList();

        document.getElementById("redeemAllGames").onclick = function () {
            redeem();
        };
        document.getElementById("undisplayBtn").onclick = function (index) {
            waitComplete(index);
        };
        document.getElementById("undisplayBtn2").onclick = function (index) {
            hourWaitComplete(index);
        };

    }
    SetPage();
})();