// ==UserScript==
// @name         稿定设计｜创客贴模板去水印
// @namespace    https://www.qyccc.com/
// @version      0.13
// @description  用于稿定设计｜创客贴去除模板水印
// @author       清语尘
// @match        *://*.chuangkit.com/*
// @match        *://*.gaoding.com/*
// @require      https://lib.baomitu.com/jquery/1.11.1/jquery.min.js
// @require      https://scriptcat.org/lib/637/1.4.7/ajaxHooker.js#sha256=xi2KoJLxtSQlpI84FlKZ9KubxQ15+MxSa6aoM2y134I=
// @require      https://cdnjs.loli.net/ajax/libs/limonte-sweetalert2/11.4.4/sweetalert2.all.min.js
// @icon         https://photogallery.oss-cn-hangzhou.aliyuncs.com/photo/1111552255990557/53220d76cb7fa499a4bcd8b9717e9c7addf89.去水印.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539985/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%EF%BD%9C%E5%88%9B%E5%AE%A2%E8%B4%B4%E6%A8%A1%E6%9D%BF%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/539985/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%EF%BD%9C%E5%88%9B%E5%AE%A2%E8%B4%B4%E6%A8%A1%E6%9D%BF%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(() => {
        const currentDomain = window.location.hostname;
        // 创客贴
        if (currentDomain === 'chuangkit.com' || currentDomain.endsWith('.chuangkit.com')) {
            if (document.readyState === 'complete') {
                cktFunc();
            }
            else {
                window.addEventListener('load', cktFunc);
                document.addEventListener('DOMContentLoaded', cktFunc);
            }
            return;
        }

        // 稿定
        if (currentDomain === 'gaoding.com' || currentDomain.endsWith('.gaoding.com')) {
            gdFunc();
            setTimeout(() => {
                qycNotify("center","success","温馨提示","去除水印成功，请手动截图保存！")
            },3000);
            return;
        }

        function cktFunc() {
            var qycbtn = '<div id="qycbtn" style="position:fixed;top:12px;right:39%;background:#0773fc;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer">去水印</div>';
            $('.design-header-box').append(qycbtn);
            $('#qycbtn').on('click',function(){
                if($('.water-mark').length == 0){
                    qycNotify("center","info","温馨提示","水印已经去除成功啦，请勿重复点击！")
                }else{
                    $('div').filter(function () {
                        var selfHas = $(this).text().includes("移除水印，畅享高清模板");
                        var childHas = $(this).find('div').filter(function () {
                            return $(this).text().includes("移除水印，畅享高清模板");
                        }).length > 0;
                        return selfHas && !childHas;
                    }).remove();
                    $('.canvas .water-mark').removeAttr("class").removeAttr("style").attr('aastyle');
                    qycNotify("center","success","温馨提示","去除水印成功，请手动截图保存！")
                }
            })
        }
        function gdFunc() {
            ajaxHooker.hook(request => {
                if (request.url === 'https://www.gaoding.com/api/ccm/editors/risk_materials') {
                    request.abort = true;
                    request.response = res => {
                        JSON.parse(res.responseText);
                    };
                }
            });
        }
        // 通知
        function qycNotify(position,icon,title,text){
            Swal.fire({
                position: position,
                icon: icon,
                title: title,
                text: text,
                imageUrl: "https://www.pupp.top/gzh.jpg",
                imageWidth: 200,
                imageAlt: "微信公众号【干货老周】"
            });
        }
    })
})();