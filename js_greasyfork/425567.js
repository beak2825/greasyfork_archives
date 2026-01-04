// ==UserScript==
// @name         职培云-播放中跳过刷脸
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  播放中跳过刷脸
// @author       soso
// @match        https://px.class.com.cn/player/study/index*
// @icon         https://www.google.com/s2/favicons?domain=class.com.cn
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425567/%E8%81%8C%E5%9F%B9%E4%BA%91-%E6%92%AD%E6%94%BE%E4%B8%AD%E8%B7%B3%E8%BF%87%E5%88%B7%E8%84%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/425567/%E8%81%8C%E5%9F%B9%E4%BA%91-%E6%92%AD%E6%94%BE%E4%B8%AD%E8%B7%B3%E8%BF%87%E5%88%B7%E8%84%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ind = 0
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var timer= setInterval(()=>{
        if(ind ==2) return clearInterval(timer)
        if ('') {
            return true;
        }
        $(this).attr('disabled',true);
        $(".learnProcessTip button").click();
        var studyStatus = $('#hiddenStudyStatus').val()
        var type = $('#hiddenType').val()
        if (studyStatus == 2 && type == 1) {
            console.log('我已学完')
            return true;
        }
        if(!$('#hiddenCourseId')){
            window.open("https://baidu.com","_blank")
        }
        var courseId = $('#hiddenCourseId').val()
        var totalSecond = $('#hiddenTotalSecond').val()

        var sign = '';
        var time = Math.round(new Date().getTime()/1000);// 不能用服务端带过来的时间戳
        var iframe = document.querySelector('#container').contentWindow
        // 2. 选择iframe内的元素
        var ele = iframe.document.querySelector('video').play()


        //////替换
        var classGuid = window.mtsControll._initInfo.classGuid;
        var parentCourseId = courseId;
        var studentId = window.mtsControll._initInfo.studentId;
        var mType = 0;
        var bId = 0;
        //////替换

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/player/index/get-sign",
            data : {
                'classGuid': classGuid,
                'courseId': courseId,
                'parentCourseId': parentCourseId,
                'studentId': studentId,
                'totalSecond': totalSecond,
                'mType': mType,
                'bId': bId,

                'type': type,
                'time': time
            },
            success: function(data) {
                if (data.success) {
                    sign = data.data
                    studyTime = data.s
                    tStr = data.tStr

                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: "https://api.ataclass.cn/callback-course",
                        data : {
                            'classGuid': classGuid,
                            'courseId': courseId,
                            'parentCourseId': parentCourseId,
                            'sign': sign,
                            'studentId': studentId,
                            'timestamp': time,
                            'totalSecond': totalSecond,
                            'type': type
                        },
                        success: function(data) {
                            if (data.success) {
                                var durationStr = $("#durationStr").text();
                                if (data.data.diffSecond) {

                                } else {
                                    ind++;
                                    window.open("https://baidu.com","_blank")
                                    window.open("https://baidu.com","_blank")
                                    $("#learnedStr").text(durationStr);
                                    $('.add-live').removeClass("btn-success").addClass('btn-dark').attr("disabled",true);
                                    var jhx_id = $("#list_chapter .active").attr('data-jhx-res');
                                    $("[data-jhx-sta='"+jhx_id+"']  span").removeClass("circle").addClass('status-done')
                                }
                            } else {
                                console.log(data.errormsg)
                                $('#d_sub_txt_my').text('视频出错，请联系管理员。')
                                $('#vue_dialog_sub_my').show()
                            }
                        }
                    });
                }
            }
        });
    },8000)

    window.onbeforeunload = function(b) {
        window.open("https://baidu.com","_blank")
        window.open("https://baidu.com","_blank")
        window.open("https://baidu.com","_blank")
        b = b || window.event;
        b.returnValue = "ASDFASDFDSAKD";
        return "SAFKLSJAKL"
    }
    window.facePicEvt = function(cid,sguid){
        console.log("go to photo:"+cid+' '+sguid);

    }
    // Your code here...
})();