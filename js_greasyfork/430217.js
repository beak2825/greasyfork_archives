// ==UserScript==
// @name         提升工程2.0研修2
// @namespace    https://www.v587.com/
// @version      1.00
// @description  广东省中小学教师信息技术应用能力提升工程2.0项目
// @author       penrcz
// @match        http://ycourse.ttcn.cn/study/*
// @match        https://jstsgc.gdedu.gov.cn/info2/pinfo/teacherSpace/home.action
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430217/%E6%8F%90%E5%8D%87%E5%B7%A5%E7%A8%8B20%E7%A0%94%E4%BF%AE2.user.js
// @updateURL https://update.greasyfork.org/scripts/430217/%E6%8F%90%E5%8D%87%E5%B7%A5%E7%A8%8B20%E7%A0%94%E4%BF%AE2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    var domain = window.location.host;

    switch(domain){
        case 'jstsgc.gdedu.gov.cn':
            //1分钟后自动刷新
            setTimeout("window.location.reload()","60000");
            break;
        case 'ycourse.ttcn.cn':
            window.setInterval(nextA, 6000);//6秒
            break;
        default:
    }


    function nextA(){

        var _video = $("video");

        if(_video.length == 0){
            _p("无视频");

            //判断是否在列表
            var _subList = $(".subListGroup");
            if(_subList.length > 0){
                //检查是否有未完成
                var _sectionRight = $(".subListGroup .sectionRight");
                $.each(_sectionRight,function(i,n){
                    if($(n).text() == "去学习>"){
                        $(n).parent().click();
                        return false;
                    }

                });

            }else{
                var _btn = $(".studycontentBottom > div > .ant-btn span");
                $.each(_btn,function(i,n){
                    if($(n).text() == "下一活动"){
                        var _button = $(n).parent();
                        if(_button.is(":visible")){
                            _button.click();
                        }else{
                            $(".backbtn").click();
                        }

                    }
                });

            }

            
        }

        var _duration = _video.prop("duration"); //长度
        _video.prop("currentTime",_duration - 2);

        //检测弹窗是否存在
        if($(".ant-modal-mask").is(":visible")){
            var _dialog = $('div[role="dialog"]');
            if(_dialog.length == 1){

                //查找下一活动按钮
                var _span = $(".ant-modal-body span");
                $.each(_span,function(i,n){
                    if($(n).text() == "下一活动"){
                        var _button = $(n).parent();
                        if(_button.is(":visible")){
                            _button.click();
                        }else{
                            $(".backbtn").click();
                        }
                    }
                });
            }
        }

    }

})();

/**
 * 打印
 */
function _p(obj){
    console.log(obj);
}

