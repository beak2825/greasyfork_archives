// ==UserScript==
// @name         川信评教
// @namespace    https://jw.scitc.com.cn/*
// @version      1.0
// @description  一学期一度的评教时间又到了，希望这个脚本可以让你们的评教更简单
// @author       me
// @match        https://jw.scitc.com.cn/xspjgl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scitc.com.cn
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456595/%E5%B7%9D%E4%BF%A1%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/456595/%E5%B7%9D%E4%BF%A1%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let input_inner = document.getElementsByClassName('form-control input-sm input-pjf'); // 分数

    // 插入一个按钮
    let last_pager = document.getElementById('pager');
    let myBtn = document.createElement('button');

    myBtn.innerText = '点击评分';
    myBtn.classList.add('btn','btn-primary', 'btn-block');
    myBtn.addEventListener('click', do_score);

    last_pager.parentNode.appendChild(myBtn);

    // 评分
    function do_score(){
        myBtn.innerText = '正在评分...'
        // 给输入框赋值
        for(let i = 0;i<input_inner.length;i++){
            input_inner[i].value = 100;
        }
        // 给文本域赋值
        document.getElementsByName('py')[0].value = '老师讲课很有趣';
        myBtn.innerText = '点击评分';

        do_submit();
    }

    // 提交
    function do_submit() {
    let progress_loading = $('#progress_loading');
    //是否正在处理中的标记，防止多次提交
    let inProgress = false;
        //组织参数对象
        let dataMap = buildRequestMap.call(this) || {};
        dataMap["tjzt"] = "1";
        jQuery.ajax({
            url		: _path+"/xspjgl/xspj_tjXspj.html",
            type	: "post",
            dataType: "json",
            data:dataMap,
            async: false,
            beforeSend: function(){
                inProgress = true;
                // Handle the beforeSend event
                //让进度条 从20% 缓慢/迅速 增长到50%
                progress_loading.attr("aria-valuenow",50).css("width","50%");
                $("#btn_xspj_bc").addClass("disabled").prop({disabled: true});
                $("#btn_xspj_tj").addClass("disabled").prop({disabled: true});
            },
            success: function(responseText){
                inProgress = false;
                progress_loading.attr("aria-valuenow",80).css("width","80%");

                if($.type(responseText) == "string"){
                    if(responseText.indexOf("整体提交成功") > -1){
                        progress_loading.attr("aria-valuenow",100).css("width","100%");
                        $.success(responseText,function() {
                            var pjzt_flag = refTab();
                            checkRequestOfZjjspx(pjzt_flag);
                        });
                    }else if(responseText.indexOf("成功") > -1){
                        progress_loading.attr("aria-valuenow",100).css("width","100%");
                        $.success(responseText,function() {
                            var pjzt_flag = refTab();
                            checkRequestOfZjjspx(pjzt_flag);
                        });
                    }else if(responseText.indexOf("失败") > -1){
                        $.error(responseText,function() {

                        });
                    } else{
                        $.alert(responseText,function() {
                            refTab();
                        });
                    }
                    window.setTimeout(function(){
                        progress_loading.attr("aria-valuenow",0).css("width","0%");
                    },600);
                }
            },
            error:function(){
                inProgress = false;
                progress_loading.attr("aria-valuenow",0).css("width","0%");
            }
        });
    }
})();



