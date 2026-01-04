// ==UserScript==
// @name         遵义职业技术学院-自动答题
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动答题
// @author       xiajie
// @match        https://cp.hongxzx.cn/Platform/testCenter/exercisesPage.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hongxzx.cn
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/479275/%E9%81%B5%E4%B9%89%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/479275/%E9%81%B5%E4%B9%89%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(window.location.pathname == '/Platform/testCenter/exercisesPage.html'){

        setTimeout(function(){
            addhtml()
        },1500)

        function addhtml(){
            var text = '开始考试';
            var css = "'background:red;cursor: pointer;padding: 5px 10px;color:#fff;display:inline-block;margin-left:20px;line-height: 30px;font-size:20px'";
            var html = "<a id='learnText' style="+css+" onclick='showLearn()'>"+text+"</a>";
            $('.answer-name').append(html);
        }
        window.showLearn = function(){
            layer.confirm('是否开始考试',{
                title:"提示",
                btn:['确定','取消']
            },
            function(index){
                $('#learnText').text('考试中');
                answerQuestion();
                layer.close(index);
            });
        }

        function answerQuestion(){
            var check = setInterval(function(){
                var answer = $('#rightKey').text();
                var type = $('.type-name').text();
                var yiDa = parseInt($('#yiDa').text());
                var allTi = parseInt($('#allTi').text());
                if (type == "单选题" || type == "多选题" || type == "判断题") {
                    //随机错误，避免100分
                    var random = Math.floor(Math.random() * 100);
                    if(random>10){
                        if(answer.indexOf('A') != -1){
                            $('#options-list .options').eq(0).click();
                        }
                        if(answer.indexOf('B') != -1){
                            $('#options-list .options').eq(1).click();
                        }
                        if(answer.indexOf('C') != -1){
                            $('#options-list .options').eq(2).click();
                        }
                        if(answer.indexOf('D') != -1){
                            $('#options-list .options').eq(3).click();
                        }
                        if(answer.indexOf('E') != -1){
                            $('#options-list .options').eq(4).click();
                        }
                    }else{
                        $('#options-list .options').eq(0).click();
                        if (type == "多选题"){
                            $('#options-list .options').eq(1).click();
                            $('#options-list .options').eq(2).click();
                            $('#options-list .options').eq(3).click();
                            $('#options-list .options').eq(4).click();
                        }
                    }
                    $('#submit-answer').click();
                    var err = $('#options-list .error').length + $('#options-list .wrongCheck').length;
                    if(err>0){
                        $('#xiaYiTi').click();
                    }
				} else{
                    clearInterval(check);
                    $('#learnText').text('考试结束');
				}
                if(yiDa == allTi){
                    clearInterval(check);
                    $('#learnText').text('考试结束');
                }
            },1000)
        }
    }
})();