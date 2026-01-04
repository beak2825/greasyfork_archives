// ==UserScript==
// @name         爱词吧增强-记单词的网站
// @namespace    http://www.kbug.cn
// @version      0.1
// @description  因为爱词吧https://word.iciba.com/,感觉有点bug,于是自己修了下,祝群稳过四级
// @author       皮豪
// @match        https://word.iciba.com/?action=exam
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iciba.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/445976/%E7%88%B1%E8%AF%8D%E5%90%A7%E5%A2%9E%E5%BC%BA-%E8%AE%B0%E5%8D%95%E8%AF%8D%E7%9A%84%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/445976/%E7%88%B1%E8%AF%8D%E5%90%A7%E5%A2%9E%E5%BC%BA-%E8%AE%B0%E5%8D%95%E8%AF%8D%E7%9A%84%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==



(function() {
    'use strict';
    // 两个 类型
    var englishBack = '\n        \t英文回想\n        ';
    var listenWrite = '\n        \t听写电台\n        ';

    // Your code here...
    console.log($,'jquery');
    // 拿到标题的类型
    var title = $(".word_h2").text();

    if(title == listenWrite){
        console.log(listenWrite);
        // 当前 单词的索引
        var index = parseInt($("#cb_1 span").text().replace(/\/.*/g,""));
        // 拿到单词的ID
        var word_id = `cb_${index}`

        console.log("id",word_id);
        // 添加其未选中时的边框
        $(`#${word_id} .dictation-sound-input`).css("border","1px solid gray");
        // 单词输入框默认聚焦
        $(`#${word_id} .dictation-sound-input`).focus()
        //拿到原生的绑定函数
        var realSend = $(`#${word_id} .dictation-sound-btn`).prop('onclick');
        console.log(realSend)
        // 去除提交的事件
        $(`#${word_id} .dictation-sound-btn`).removeAttr('onclick');
        $(`#${word_id} .dictation-sound-input`).removeAttr('onkeydown');

        // 只读一遍
        var canRead = true
        $(".dictation-sound-input").keydown((event)=>{

            if(event.keyCode == 13){
                // 输入框 回车了
                checkWord()
            }
            if(canRead){
                $(`#${word_id} .dictation-sound-icon`).click()
                canRead = false
            }
        })


        $(".dictation-sound-btn").click(()=>{
            checkWord()
        })

        let i = false;
        // 检验单词正确性
        function checkWord(){
            var orgin = $(`#${word_id} .dictation-answer .dictation-answer-word`).text().replace(/(\n|\t)/g,"")
            var inputVar = $(`#${word_id} .dictation-sound-input`).val()
            // 第二次点击时需要进行判断
            if(i){
                realSend()

                // 添加其未选中时的边框
                $(`#${word_id} .dictation-sound-input`).css("border","1px solid gray");
                // 单词输入框默认聚焦
                $(`#${word_id} .dictation-sound-input`).focus()
                //拿到原生的绑定函数
                realSend = $(`#${word_id} .dictation-sound-btn`).prop('onclick');
                //console.log(realSend)
                // 去除提交的事件
                $(`#${word_id} .dictation-sound-btn`).removeAttr('onclick');
                $(`#${word_id} .dictation-sound-input`).removeAttr('onkeydown');
                i = false;
                return;
            }

            console.log(orgin,'orgin',inputVar)

            if(orgin == inputVar){
                //自带的单词校验方法
                console.log(realSend)
                index++;
                word_id = `cb_${index}`;
                realSend()

                //可以绑定到元素上,需要做一个判定重置
                i=true;

            }else{
                if($(`#${word_id} .dictation-answer`).css("display") == "none"){
                    $(`#${word_id} .dictation-answer`).css("display","block");
                    $(`#${word_id} .dictation-answer`).append(`
                         <div  style="color:red;font-size:10px;">请输入正确的的单词</div>
                     `)
                }
                $(`#${word_id} .dictation-sound-icon`).click()
            }

        }
    }else if(title == englishBack){
        // 当前 单词的索引
        var index = parseInt($("#span_c1").text().replace(/\/.*/g,""));
        // 拿到单词的ID
        var word_id = `cb_${index}`


        // 添加其未选中时的边框
        $(`#${word_id} .dictation-sound-input`).css("border","1px solid gray");
        // 单词输入框默认聚焦
        $(`#${word_id} .dictation-sound-input`).focus()
        //拿到原生的绑定函数
        var realSend = $(`#${word_id} .dictation-sound-btn`).prop('onclick');
        console.log(realSend)
        // 去除提交的事件
        $(`#${word_id} .dictation-sound-btn`).removeAttr('onclick');
        $(`#${word_id} .dictation-sound-input`).removeAttr('onkeydown');

        // 只读一遍
        var canRead = true
        $(".dictation-sound-input").keydown((event)=>{

            if(event.keyCode == 13){
                // 输入框 回车了
                checkWord()
            }
            if(canRead){
                $(`#${word_id} .dictation-sound-icon`).click()
                canRead = false
            }
        })


        $(".dictation-sound-btn").click(()=>{
            checkWord()
        })

        let i = false;
        // 检验单词正确性
        function checkWord(){
            var orgin = $(`#${word_id} .right_answer`).text().replace(/(\n|\t)/g,"")
            var inputVar = $(`#${word_id} .dictation-sound-input`).val()
            // 第二次点击时需要进行判断
            if(i){
                realSend()

                // 添加其未选中时的边框
                $(`#${word_id} .dictation-sound-input`).css("border","1px solid gray");
                // 单词输入框默认聚焦
                $(`#${word_id} .dictation-sound-input`).focus()
                //拿到原生的绑定函数
                realSend = $(`#${word_id} .dictation-sound-btn`).prop('onclick');
                //console.log(realSend)
                // 去除提交的事件
                $(`#${word_id} .dictation-sound-btn`).removeAttr('onclick');
                $(`#${word_id} .dictation-sound-input`).removeAttr('onkeydown');
                i = false;
                return;
            }

            console.log(orgin,'orgin',inputVar)

            if(orgin == inputVar){
                //自带的单词校验方法
                console.log(realSend)
                index++;
                word_id = `cb_${index}`;
                realSend()

                //可以绑定到元素上,需要做一个判定重置
                i=true;

            }else{
                if($(`#${word_id} .right_answer`).css("display") == "none"){
                    $(`#${word_id} .right_answer`).css("display","block");
                    $(`#${word_id} .change-pic-mid`).append(`
                         <div  style="padding-left: 230px;color:red;font-size:10px;">请输入正确的的单词</div>
                     `)
                }
                $(`#${word_id} .dictation-sound-icon`).click()
            }

        }
    }

})();



