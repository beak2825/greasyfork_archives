// ==UserScript==
// @name         旧后台-新页面-修改刷证证件号姓名
// @namespace    id-card-detail
// @version      0.0.2
// @description  idcard&name-modify
// @author       daiy
// @match        https://qmyxcg.myscrm.com.cn/sub-qdfk-admin/page/capture_detail*
// @match        https://myscrm-ykht.jinmaodigital.com/sub-qdfk-admin/page/capture_detail*
// @grant        none
// @connect      https://*.myscrm.com.cn
// @connect      https://myscrm-ykht.jinmaodigital.com
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476173/%E6%97%A7%E5%90%8E%E5%8F%B0-%E6%96%B0%E9%A1%B5%E9%9D%A2-%E4%BF%AE%E6%94%B9%E5%88%B7%E8%AF%81%E8%AF%81%E4%BB%B6%E5%8F%B7%E5%A7%93%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/476173/%E6%97%A7%E5%90%8E%E5%8F%B0-%E6%96%B0%E9%A1%B5%E9%9D%A2-%E4%BF%AE%E6%94%B9%E5%88%B7%E8%AF%81%E8%AF%81%E4%BB%B6%E5%8F%B7%E5%A7%93%E5%90%8D.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var $ = window.jQuery;

    function init() {
        initForm()
        addCss()
    }

    function initForm() {
        let nameSelector = $('.ant-descriptions-view')
        let html = '<form style="margin-bottom:10px;margin-top:10px;"><input name="name" id="name-input" class="input" style="margin-left:0px;"><buttom id="name-submit-btn" class="buttom" style="margin-right:410px;">修改姓名</buttom><input name="name" id="id-number-input" class="input"><buttom id="id-number-submit-btn" class="buttom">修改证件号</buttom></form>'
        nameSelector.append(html)
        $('#name-submit-btn').click(() => {
            let name = $('#name-input').val()
                if (name != '') {
                    modifyName(name)
                } else {
                    alert('请输入姓名！')
                }
        })
        $('#id-number-submit-btn').click(() => {
            let idNumber = $('#id-number-input').val()
                if (idNumber != '') {
                    modifyIdNumber(idNumber)
                } else {
                    alert('请输入证件号！')
                }
        })
    }

    function addCss() {
        $('.input').css('margin-right', '10px')
        $('.input').css('height', '30px')
        $('.input').css('padding', '1px 2px;')
        $('.input').css('line-height', '18px')
        $('.input').css('width', '150px')

        $('.buttom').css('background-color', '#f65c2d')
        $('.buttom').css('color', 'white')
        $('.buttom').css('width', '90px')
        $('.buttom').css('padding', '6px 12px')
        $('.buttom').css('line-height', '18px')
        $('.buttom').css('border-radius', '2px')
        $('.buttom').css('display', 'inline-block')
        $('.buttom').css('text-align', 'center')
        $('.buttom').css('cursor', 'pointer')
    }

    function modifyName(name) {

        $.ajax({
            url: "/api/index.php?r=tools/qdfk/identification-card/modify-field",
            type: "post",
            data: {
                field: 'name',
                value: name,
                qdfkIdentificationCardId: getQdfkIdentificatonCardId()
            },
            success: function (data) {
                alert('修改成功')
                location.reload()
            },
            error: function (data) {}
        });
    }

    function modifyIdNumber(idNumber) {
        $.ajax({
            url: "/api/index.php?r=tools/qdfk/identification-card/modify-field",
            type: "post",
            data: {
                field: 'id_number',
                value: idNumber,
                qdfkIdentificationCardId: getQdfkIdentificatonCardId()
            },
            success: function (data) {
                alert('修改成功')
                location.reload()
            },
            error: function (data) {}
        });
    }

    function getQdfkIdentificatonCardId()
    {
        var url = document.location.toString();
        var arrUrl = url.split("?");

        var para = arrUrl[1];
        var arrParam = para.split("=");

        return arrParam[arrParam.length - 1];

    }

    setTimeout(init,4000)
    setTimeout(function(){if($('#name-input').length != '1'){alert('修刷证件信息插件加载超时！')}},5000)

})();