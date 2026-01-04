// ==UserScript==
// @name         浙江应急值班签到
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  浙江应急值班签到的自动完成脚本，由吴大师编写
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author       吴大师(wxj)
// @match        https://yjjy.yjt.zj.gov.cn/emg/defalut/success*
// @downloadURL https://update.greasyfork.org/scripts/441306/%E6%B5%99%E6%B1%9F%E5%BA%94%E6%80%A5%E5%80%BC%E7%8F%AD%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441306/%E6%B5%99%E6%B1%9F%E5%BA%94%E6%80%A5%E5%80%BC%E7%8F%AD%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if ($('#todaydate').length > 0) {
        setInterval(function(){
            const now = new Date();
            // 转换为时间戳（毫秒）
            const timestampInMilliseconds = now.getTime();
            $.ajax({
                url: "https://yjjy.yjt.zj.gov.cn/emg/portal/warninfo/index/list?_="+timestampInMilliseconds,
                dataType: "json",
                success: function (odata) {
                    //console.log(odata);
                    odata.ldata.forEach(function (item) {
                        //console.log("ID:", item.id, "Title:", item.title,"reading:",item.reading);
                        if (item.reading==0){
                            $.ajax({
                                //url: "https://yjjy.yjt.zj.gov.cn/emg/warninfo/emgWarninfo?redirect=/emg/warninfo/view&id="+item.id,
                                url: "https://yjjy.yjt.zj.gov.cn/emg/warninfo/emgWarninfo/alterReadStatus?id="+item.id + "&_=" + timestampInMilliseconds,
                                method: "GET",
                                dataType: "json",
                                success: function (ndata) {
                                    console.log("更改阅读状态成功：", item.title);
                                    //console.log(ndata);
                                },
                                error: function (xhr, status, error) {
                                    console.error("请求失败:", status, error);
                                }
                            });
                        }
                    });
                }
            });
        },59000)
        setInterval(function(){
            //console.log("在线");
            if ($('.layui-layer-btn0').length > 0 && $('.layui-layer-btn0')[0].innerHTML == "确定"){
                $('.layui-layer-btn0')[0].click();
            }
            //console.log($('.badge.badge-orange.badge-margin-horizontal').length);
        },1000)
    }
})();