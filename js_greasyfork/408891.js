// ==UserScript==
// @name         百度知道 - 移除复制时多余的字符、显示踩的数量
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  1.移除复制时多余的字符。2.显示踩的数量。3.删掉混在答案堆里面的广告。4.展开更多回答。
// @author       潘志城_Neo
// @match        *://zhidao.baidu.com/question/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408891/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%20-%20%E7%A7%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E6%97%B6%E5%A4%9A%E4%BD%99%E7%9A%84%E5%AD%97%E7%AC%A6%E3%80%81%E6%98%BE%E7%A4%BA%E8%B8%A9%E7%9A%84%E6%95%B0%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/408891/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%20-%20%E7%A7%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E6%97%B6%E5%A4%9A%E4%BD%99%E7%9A%84%E5%AD%97%E7%AC%A6%E3%80%81%E6%98%BE%E7%A4%BA%E8%B8%A9%E7%9A%84%E6%95%B0%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //在踩的按钮旁边，添加踩这个回答的人的数量
    const Add_bad_num = function(){
        let interval_1= setInterval(function(){
            if($(".evaluate-bad").length>0){
                $(".evaluate-bad").each(function(i,o){
                    let bad_num = $(o).attr("data-evaluate")
                    $(o).children("b").text(bad_num)
                })
                clearInterval(interval_1)
            }
        },100)
        }

    //点击更多回答(自己懒得点，一页就那么几个回答，直接显示出来就很好。
    const Unfold_all_answer = function(){
        let interval_2= setInterval(function(){
            if($("#show-answer-hide").length >0){
                $("#show-answer-hide").click()
                clearInterval(interval_2)
            }
        },100)
        }

    //移除暗桩
    const Remove_hidden_piles = function(){
        const baidu_list = ['2113','5261','4102','1653',"bai","du","zhi","dao"]
        $("span").each(function(i,o){
            baidu_list.forEach((item,index)=>{
                if ($(o).text() == item){
                    console.log("移除:"+$(o).text())
                    $(o).remove()
                }
            })
        })

    }
    //主函数
    const Neo_main = function(){

        //在踩的按钮旁边，添加踩这个回答的人的数量
        Add_bad_num()

        //展开更多回答
        Unfold_all_answer()



        //dom加载完之后再运行移除暗桩的函数
        $(document).ready(function(){

            //删掉广告(夹杂在答案堆里面的广告)
            if($("#knowledge-answer").length >0){
                $("#knowledge-answer").remove()
            }

            Remove_hidden_piles()
        })
    }

    Neo_main()

})();