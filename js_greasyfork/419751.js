// ==UserScript==
// @name         刷证详情页-修改证件号、姓名
// @namespace    id-card-detail
// @version      0.2
// @description  id-card-detail
// @author       linqc
// @match        https://test-qmyxcg.myscrm.com.cn/page/risk_ctrl/case_record/all_brush/capture_detail/*
// @match        https://beta-qmyxcg.myscrm.com.cn/page/risk_ctrl/case_record/all_brush/capture_detail/*
// @match        https://qmyxcg.myscrm.com.cn/page/risk_ctrl/case_record/all_brush/capture_detail/*
// @match        https://myscrm-ykht.aoyuancrm.com/page/risk_ctrl_aoyuan/case_record/all_brush/capture_detail/*
// @match        https://myscrm-ykht.aoyuancrm.com/page/risk_ctrl/case_record/all_brush/capture_detail/*
// @match        https://myscrm-ykht.jinmaodigital.com/page/risk_ctrl/case_record/all_brush/capture_detail/*
// @match        https://myscrm-ykht.gemdale.com/page/risk_ctrl/case_record/all_brush/capture_detail/*
// @grant        none
// @connect      https://*.myscrm.com.cn
// @connect      https://myscrm-ykht.aoyuancrm.com
// @connect      https://myscrm-ykht.jinmaodigital.com
// @connect      https://myscrm-ykht.gemdale.com
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/419751/%E5%88%B7%E8%AF%81%E8%AF%A6%E6%83%85%E9%A1%B5-%E4%BF%AE%E6%94%B9%E8%AF%81%E4%BB%B6%E5%8F%B7%E3%80%81%E5%A7%93%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/419751/%E5%88%B7%E8%AF%81%E8%AF%A6%E6%83%85%E9%A1%B5-%E4%BF%AE%E6%94%B9%E8%AF%81%E4%BB%B6%E5%8F%B7%E3%80%81%E5%A7%93%E5%90%8D.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Your code here...

     var $ = window.jQuery;

     function init() {
        initNameForm()
        initIdNumberForm()
        addCss()
        console.log( getQdfkIdentificatonCardId())
     }

     function initNameForm(){
         let nameSelector = $('.info-wrap p:first-child')
         let html = '<form ><div><input name="name" id="name-input" class="linqc-input"><buttom id="name-submit-btn" class="linqc-buttom">修改姓名</buttom></div></form>'
         nameSelector.append(html)
         $('#name-submit-btn').click(() => {
             let name = $('#name-input').val()
             console.log(name)
             modifyName(name)
         })
     }

    function addCss(){
        $('.linqc-input').css('margin-right', '10px')
        $('.linqc-input').css('height', '30px')
        $('.linqc-input').css('padding', '1px 2px;')
        $('.linqc-input').css('line-height', '18px')
        $('.linqc-buttom').css('background-color', '#f65c2d')
        $('.linqc-buttom').css('color', 'white')
        $('.linqc-buttom').css('width', '70px')
        $('.linqc-buttom').css('padding', '6px 12px')
        $('.linqc-buttom').css('line-height', '18px')
        $('.linqc-buttom').css('border-radius', '2px')
        $('.linqc-buttom').css('display', 'inline-block')
        $('.linqc-buttom').css('text-align', 'center')
    }

    function modifyName(name){

        $.ajax({
            url:"/api/index.php?r=tools/qdfk/identification-card/modify-field",
            type:"post",
            data:{
                field:'name',
                value:name,
                qdfkIdentificationCardId:getQdfkIdentificatonCardId()
            },
            success:function(data){
                alert('修改成功')
                location.reload()
            },
            error:function(data){

            }
        });
    }

    function initIdNumberForm(){
        let nameSelector = $('.info-wrap p:nth-child(3)')
         let html = '<form ><div><input name="name" id="id-number-input" class="linqc-input"><buttom id="id-number-submit-btn" class="linqc-buttom">修改证件号</buttom></div></form>'
         nameSelector.append(html)
         $('#id-number-submit-btn').click(() => {
             let idNumber = $('#id-number-input').val()
             console.log(idNumber)
             modifyIdNumber(idNumber)
         })

    }

    function modifyIdNumber(idNumber){
        $.ajax({
            url:"/api/index.php?r=tools/qdfk/identification-card/modify-field",
            type:"post",
            data:{
                field:'id_number',
                value:idNumber,
                qdfkIdentificationCardId:getQdfkIdentificatonCardId()
            },
            success:function(data){
               alert('修改成功')
               location.reload()
            },
            error:function(data){

            }
        });
    }

    function getQdfkIdentificatonCardId()
　　{
　　　　var url = document.location.toString();

　　　　var arrUrl = url.split("?");

　　　　var para = arrUrl[1];

        var arrParam = para.split("/");

　　　　return arrParam[arrParam.length - 1];
　　}

    init()


})();