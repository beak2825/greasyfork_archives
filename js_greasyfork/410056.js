// ==UserScript==
// @name         跑路云自动签到脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       清风无敌
// @match        https://paoluz.net/*
// @match        https://paoluz.link/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410056/%E8%B7%91%E8%B7%AF%E4%BA%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/410056/%E8%B7%91%E8%B7%AF%E4%BA%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o){
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
        return fmt;
    }
    String.prototype.toThousands = function(){
        return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function showTodaySign(){
        const today_count = sign_obj[today]
        if (today_count != null){
            // $($(".breadcrumb")[1]).prepend('<li class="breadcrumb-item active" aria-current="page">签到: '+ today_count.toThousands() +'</li>')
            $('#checkin-div a').html('<i class="far fa-calendar-check"></i> 明日再来(今日签到： '+ today_count.toThousands() + ")")
            let _record = [];
            $.each(sign_obj,function(name,value) {
                _record.push(name+":   "+value.toThousands())
            })
            _record.reverse()
            $('#checkin-div').attr("title",_record.slice(0,7).join("\n"))
        }
    }
    const $ = window.$

    const sign_date=(window.localStorage.getItem('sign_date'))
    const today = new Date().format('yyyy-MM-dd')
    let sign_obj = JSON.parse(window.localStorage.getItem("signCount"))
    sign_obj = sign_obj == null?{}:sign_obj
    console.info(sign_date,today,(sign_date == null) , (today != sign_date))
    if (sign_date == null || today != sign_date){
        console.debug("准备签到！")
        $.post({
            url:"/user/checkin",
            success:function(r){
                const result = JSON.parse(r);
                window.localStorage.setItem("sign_result", JSON.stringify(result))
                if(result.ret == 1 || result.ret == 0){
                    $("#checkin-div a").addClass("disabled")
                    $("#checkin-div a").html('<i class="far fa-calendar-check"></i> 明日再来')
                    window.localStorage.setItem('sign_date',new Date().format('yyyy-MM-dd'))
                    sign_obj[today] = result.msg.replace(/([^\d]+(?=(\d)))(\d{1,}\ \w{2})(.*)/g, "$3")
                    window.localStorage.setItem("signCount", JSON.stringify(sign_obj))
                    showTodaySign()
                }
            },
            error:function(r){
                console.error(r)
            }
        })
    }
    showTodaySign()
    $("body").append("<style type='text/css'>#popup-ann-modal{display:none!important} .modal-backdrop{display:none!important}</style>")
    // Your code here...
})();