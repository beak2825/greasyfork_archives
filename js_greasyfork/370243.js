// ==UserScript==
// @name         教学质量自动考评
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  教学质量自动考评脚本
// @author       Jozhn
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        *://zhjw.neu.edu.cn/*
// @supportURL   https://dearjohn.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370243/%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/370243/%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        //添加按钮
        var btn1_html = '<a href="javascript:void(0);" id="btn1" class="S_txt2" title="优秀"><input type="button" style="width:80;height:20;background-color: #EBFEE2;color: #508239;border: 1px solid #B4E2A4;" value="优秀""></a>';
        var btn2_html = '<a href="javascript:void(0);" id="btn2" class="S_txt2" title="随机"><input type="button" style="width:80;height:20;background-color: #EBFEE2;color: #508239;border: 1px solid #B4E2A4;" value="随机""></a>';
        var btn3_html = '<a href="javascript:void(0);" id="btn3" class="S_txt2" title="极差"><input type="button" style="width:80;height:20;background-color: #EBFEE2;color: #508239;border: 1px solid #B4E2A4;" value="极差""></a>';

        $("legend:first").append(btn1_html,btn2_html,btn3_html);

        $("#btn1").click(function(){
            $(":radio").each(function(){
                if($(this).val()=="95"){
                    $(this).click();
                }
            });
            $(":radio").each(function(){
                if($(this).val()=="85"){
                    $(this).click();
                    return false;
                }
            });
        });

        $("#btn2").click(function(){
            $(":radio").each(function(){
                var arr = ["95","85","75","65","50"]
                if($(this).val()==arr[Math.floor((Math.random()*arr.length))] ){
                    $(this).click();
                }
            });
        });

        $("#btn3").click(function(){
            $(":radio").each(function(){
                if($(this).val()=="50"){
                    $(this).click();
                }
            });
            $(":radio").each(function(){
                if($(this).val()=="65"){
                    $(this).click();
                    return false;
                }
            });
        });
    });

})();
