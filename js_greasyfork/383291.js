// ==UserScript==
// @name         Okex 抢币跳过滑块验证版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.okex.com/activity/*
// @match        *://www.okex.me/activity/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383291/Okex%20%E6%8A%A2%E5%B8%81%E8%B7%B3%E8%BF%87%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/383291/Okex%20%E6%8A%A2%E5%B8%81%E8%B7%B3%E8%BF%87%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var C_STATUS = {
        "networkError": "网络不稳定，请刷新重试",
        "unlocked": "解锁完毕",
        "unSupport": "来自以下国家的用户将无法参与代币销售:",
        "minCount": "最少可抢购",
        "buySuccess": "预约排队中",
        "buySuccessText": "预约排队中，中签结果将于活动结束后半小时内公布。",
        "projectFinished": "预约已结束",
        "buyNow": "立即预约",
        "closeTry": "关闭重试",
        "itemPrev": "预热中",
        "itemGoing": "销售中",
        "itemComp": "已完成",
        "collecting": "统计中",
        "startClockDown": "开始倒计时：",
        "endClockDown": "距离预约结束还有：",
        "listStatusSuccess": "成功",
        "listStatusFail": "失败",
        "collecting1": "预约已结束",
        "collecting2": "中签结果统计中...",
        "recordNull": "您没有预约记录",
        "unLoginNow": "您还未登录",
        "loginToLook": "登录查看"
    }
    var STATUS_INDEX = {
        0: C_STATUS.buyNow,
        1: C_STATUS.endClockDown,
        2: C_STATUS.projectFinished,
        3: C_STATUS.projectFinished,
    }
    var $ = window.jQuery;
    var activityId = getUrlParam("id");
    var activity = {};
    var status = {}
    var cancel = false;
    var ajax = window.ajax;

    function getUrlParam(e) {
        var n = new RegExp("(^|&)" + e + "=([^&]*)(&|$)")
        , i = window.location.search.substr(1).match(n);
        return null !== i ? unescape(i[2]) : null
    }

    function showDialog(activity) {
        $("#okDialog").removeClass("view-hide");
    }
    function getTime(callback) {
        var startTime = $('#publicOfferStart').html();
        return startTime
    }
    function hookAjax() {
        var _get = ajax.get;
        ajax.get = function (config) {
            console.log('hook ajax');
            var _success = config.success;
            config.success = function(res) {
                _success(...arguments)
            }
            return _get(config);
        }
    }

    var styles = {
        wrapBox: "width: 240px; height:130px;position: fixed; top: 200px; right: 100px; background: #fff; padding: 10px; line-height: 24px;border:1px solid #ddd;z-index:1000;",
        downTime: "color: red;font-size: 24px;font-weight: bold;vertical-align: middle;",
        numInput: "width:120px;border: 1px solid #dddd;margin-right: 10px;"
    };

    var Okex = {
        autoClickCount: 0,
        tipClickNumber: function () { // 点击计数
            Okex.autoClickCount++;
            console.log("click" + Okex.autoClickCount)
        },
        style(type) {
            return styles[type] ? styles[type] : "";
        },
        infoTipBox: function (activity) {
            var boxHtml = `<div style="${Okex.style("wrapBox")}">`;
            var maxByCount = parseInt(activity.publicOfferDetail.buyLimitMax.replace(',', ''));
            boxHtml += `<p>名称: ${activity.currencyShortName}</p>`;
            boxHtml += `<p>状态: ${STATUS_INDEX[activity.status]}</p>`;
            boxHtml += `<p>开始时间: ${activity.startTime}</p>`;
            boxHtml += `<p>购买个数：<input type="text" id="maxCount" style="${Okex.style("numInput")}" value="${maxByCount}"/>`
            boxHtml += `<p>challenge：<input type="text" id="jyKey" style="${Okex.style("numInput")}"/><button id="BuyBtn">购买</button></p>`
            return boxHtml;
        },
        getActivityStatus: function (callback) {
            var url = "https://www.okex.com/v2/support/active/ieo/project/detail/"+ activityId +"?time=" + new Date().getTime()


            var e = localStorage.getItem("token");
            $.get({
                headers: {
                    Authorization: e
                },
                url: url,
                success: function(e) {
                    if (e.code == 0) {
                        activity = e.data;
                        activity.startTime = getTime();
                        callback(activity)

                        Okex.buildEvent()
                    } else {
                        console.log("Get project detail info error");
                    }
                },
                fail: function(e) {
                  console.error(e)
                }
            })
        },
        buy: function (key, currencyId){
            /*
            非活动开始时候，请求提示：msg: "访问禁止"
            */
            var params = {
                challenge: key, // 极验key
                projectId: activityId,// LEO id
                purchaseAmount: $("#maxCount").val(), // 购买数量
                currencyId: currencyId // 购买LEO所使用币种ID,缺少报错："currency is needed!"
            }
            var url_buy = "https://www.okex.com/v2/support/active/ieo/project/purchase";

            if (key == "") {
                alert("请输入key");
                return false;
            }

            $.ajax({
                url: url_buy,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(params),
                processData: false,
                success: function(res) {
                    if (res.code === -1) {
                        alert(res.msg)
                    }
                    console.log(res)
                }
            })
        },
        getProjectCurrent(callback) {
            var e = localStorage.getItem("token");
            ajax.get({
                headers: {
                    Authorization: e
                },
                url: "/v2/support/active/ieo/project/currencyListStatic/" + activityId,
                success: function(e) {
                    callback(e);
                },
                fail: function(e) {
                    alert(e.toString());
                }
            })
        },
        buildEvent: function() {
            $("#BuyBtn").on("click", function(){
                Okex.getProjectCurrent(function(res) {
                    console.log(res)
                    var currencyId
                    for (var index = 0; index < res.length; index++) {
                        if (res[index].currencyName === "OKB") {
                            currencyId = res[index].currencyId;
                            break;
                        }
                    }
                    Okex.buy($('#jyKey').val(), currencyId)
                });
            });
            document.addEventListener('contextmenu', function(event) {
                event.preventDefault()
            });
            document.addEventListener('mouseup', function(event) {
                if (event.button == 2) {
                    if (cancel) {
                        cancel = false
                    } else {
                        cancel = true
                    }
                }
            });
        },
        init: function () {
            hookAjax();
            Okex.getActivityStatus(function(activity){
                var html = Okex.infoTipBox(activity);
                $(document.body).append($(html));
                showDialog();
            });
        },
        handles: {
            dispathBuyBtn: function () {
                var bgBuy = document.querySelector('.buy-coin');
                var event = new Event('click')
                if (!cancel) {
                    bgBuy.dispatchEvent(event)
                    Okex.tipClickNumber();
                    setTimeout(function() {
                        var ipt = document.querySelector('#countInput')
                        ipt.value = 1000000
                        var btn = document.querySelector('#submitBtn')
                        btn.click()
                    }, 100)
                }
                setTimeout(function() {
                    Okex.dispathBuyBtn()
                }, (Math.random()+0.65) * 1000 )
            }
        }
    }

    Okex.init();
})();