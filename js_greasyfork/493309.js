// ==UserScript==
// @name         联大学堂-批量自动答题
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  批量自动答题
// @author       xiajie
// @match        *://*.jxjypt.cn/classroom/start*
// @match        *://*.jxjypt.cn/classroom/exercise*
// @match        *://*.jxjypt.cn/paper/start*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jxjypt.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/493309/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82-%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/493309/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82-%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //视频学习
    if(window.location.pathname == '/classroom/start'){
        var allLen = $('.course-list-txt dd.z-gery-icon').length;
        var arr = [];
        var j=0;
        var courseLen = 0;
        setTimeout(function(){
            for(let i=0;i<allLen;i++){
                if($('.course-list-txt dd.z-gery-icon').eq(i).find('i').hasClass('fa-youtube-play')){
                    arr[j] = i;
                    j++;
                }
            }
            console.log(arr)
            courseLen = arr.length;
            if(courseLen > 0){
                addhtml();
            }
        },2000)
        function addhtml(){
            var css = "'position:fixed;z-index:99999;top:0;right:0;width:120px;height:40px;text-align:center;line-height:40px;background:red;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
            var html = "<div id='learnText' style="+css+">开始学习</div>"
            $('body').append(html);
        }

        $("body").on("click", "#learnText", function(){
            $('#learnText').text('学习中');
            startQuestion();
        })

        function startQuestion(){
            for(let i=0;i<courseLen;i++){
                setTimeout(function(){
                    var obj = $('.course-list-txt dd.z-gery-icon').eq(arr[i]);
                    obj.click();
                    setTimeout(function(){
                        clickOption();
                    },1000)
                    if(i == courseLen - 1){
                        setTimeout(function(){
                            $('#learnText').text('学习结束');
                        },1000*5)
                    }
                },i*1000*5)
            }
        }

        function clickOption(obj){
            let len = $('#question-area .m-question-option').length;
            for(let i=0;i<len;i++){
                setTimeout(function(){
                    let obj = $('#question-area .m-question-option').eq(i);
                    if(obj.is(":hidden") == false){
                        obj.click();
                        submitSelf();
                    }
                },i*500*1)
            }
        }
    }
    //课程作业
    if(window.location.pathname == '/classroom/exercise'){

        var allLen = $('.czct').length;
        var arr = [];
        var j=0;
        for(let i=0;i<allLen;i++){
            var ztNum = $('.zt-num').eq(i).find('em').text().trim().split('/');
            if(parseInt(ztNum[0]) == 0 || $('.czct').eq(i).find('a').eq(0).text() == '开始答题'){
                arr[j] = i;
                j++;
            }
        }
        console.log(arr)
        var paperLen = arr.length;
        if(paperLen > 0){
            addhtml();
            GM_setValue('isLearn',0);
        }

        function addhtml(){
            var css = "'position:fixed;z-index:99999;top:0;right:0;width:120px;height:40px;text-align:center;line-height:40px;background:red;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
            var html = "<div id='learnText' style="+css+">开始答题</div>"
            $('body').append(html);
        }

        $("body").on("click", "#learnText", function(){
            $('#learnText').text('答题中');
            GM_setValue('isLearn',1);
            startPaper();
        })

        function startPaper(){
            for(let i=0;i<paperLen;i++){
                setTimeout(function(){
                    var obj = $('.czct').eq(arr[i]).find('a').eq(0)[0];
                    obj.click();
                    if(i == paperLen - 1){
                        setTimeout(function(){
                            $('#learnText').text('答题结束');
                            GM_setValue('isLearn',0);
                        },1000*10)
                    }
                },i*1000*12)
            }
        }
    }

    if(window.location.pathname == '/paper/start'){

        let isLearn = GM_getValue('isLearn');
        if(isLearn == 1){
            var quesLen = $('#questionModule>ul>li').length;

            for(let i=0;i<quesLen;i++){
                let obj = $('#questionModule>ul>li').eq(i);
                let pqid = obj.find("input[name^='pqid']").val();
                console.log(pqid);
                getAnswer(obj,pqid)
                //break;
            }

            setTimeout(function(){
                //弹出图形验证码对话框
                $("#kaptcha_img").click();
                layer.open({
                    type: 1,
                    title: '提交验证',
                    closeBtn: 0,
                    btn: ['确定', '取消'],
                    area: ['280px', '200px'],
                    content: $('#layer_captcha'),
                    yes: function (index, layero) {
                        let kap = $("#kap_input").val();
                        if (kap == "") {
                            openAlert("提示", "请输入验证码！");
                            return false;
                        }
                        $("#captcha").val(kap);
                        fun_submit();
                    }
                    , cancel: function (index, layero) {

                    }
                });
                setTimeout(function(){
                    let code1 = $('#captcha').val();
                    if(code1 == 3){
                        $('#kaptcha_img').click();
                        setTimeout(function(){
                            let code1 = $('#captcha').val();
                            let code2 = $("#kap_input").val();
                            if(code1 || code2){
                                code1 && $("#kap_input").val(code1);
                                $('.layui-layer-btn0').click();
                            }
                        },3000)
                    }else{
                        let code2 = $("#kap_input").val();
                        if(code1 || code2){
                            code1 && $("#kap_input").val(code1);
                            $('.layui-layer-btn0').click();
                        }
                    }
                },1000)
            },5000)

        }

        function getAnswer(obj,pqid){
            $.ajax({
                url: "question/resolve/txt",
                data: {
                    'uid': $("#captchaId").val(),
                    'pqid': pqid
                },
                success: function (res) {
                    if (res.type == "success") {
                        const optionLen = obj.find('dl.sub-answer').length;
                        if (optionLen > 0) {
                            //单选 多选 判断
                            let answer = res.data.rightAnswer;
                            console.log(answer)
                            if(answer == "正确" || answer == "对"){
                                answer = ["正确"];
                                return;
                            }else if(answer == "错误" || answer == "错"){
                                answer = ["错误"];
                            }else{
                                answer = answer.split('')
                            }
                            //选中选项
                            for(var i = 0; i < answer.length; i++){
                                obj.find("dd[data-value='" + answer[i] + "']").click();
                            }
                        } else {
                            let answer = res.data.rightAnswer;
                            console.log(answer)
                            // 填空 简答
                            obj.find('.mater-respond textarea').val(answer);
                        }
                    }
                }
            });
        }
    }

})();