// ==UserScript==
// @name         中少阅读搜索修复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决不能搜索往年期刊的问题
// @author       cw2012
// @match        http*://zs.greengarden.org.cn/reading/onemagazine/*
// @match        http*://202.96.31.36:8888/reading/onemagazine/*
// @match        http*://mx.greengarden.org.cn/reading/onemagazine/*
// @icon         http*://www.61read.com/favicon.ico
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/438844/%E4%B8%AD%E5%B0%91%E9%98%85%E8%AF%BB%E6%90%9C%E7%B4%A2%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/438844/%E4%B8%AD%E5%B0%91%E9%98%85%E8%AF%BB%E6%90%9C%E7%B4%A2%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#OneReadbtnSearch").unbind("click");
    $("#OneReadbtnSearch").click(
        function () {
            var s = $("#txtSearch").val();
            s = s.replace('<', '').replace('\/', '').replace('>', '');
            var yearMax = $("#CategoryMaxYear").val();
            var yearMin = $("#CategoryMinYear").val();
            var reg = /^\d{4}$/;
            if ((reg.test(s)) && s >= yearMin && s <= yearMax) {
                var str = $('ul.pull-left>li')[1].firstElementChild.href;
                $(".onereadlistlink").parent().removeClass('active');
                $("#1_" + s + "").parent().addClass('active');
                var arr = str.split('/');
                var pra = arr[arr.length - 1];
                var praArr = pra.split('_');
                praArr[0] = s;
                arr[arr.length - 1] = praArr.join('_');
                str = arr.join('/');
                $(".onereadlistlink").attr("href", str);//刷新Url
                $.ajax({
                    url: str,
                    data: 'id=' + arr[arr.length - 1],
                    dataType: 'HTML',
                    success: function (msg) {
                        $('#listPanel').html(msg);
                    },
                    error: function () {
                        alert("处理失败!");
                    }
                });
            } else {
                alert(s + "不是正确的年格式，请输入介于" + yearMin + "和" + yearMax + "之间的年份");
                $("#txtSearch").val("");
            }
            return false;
        });
})();