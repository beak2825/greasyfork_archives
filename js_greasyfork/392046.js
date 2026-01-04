// ==UserScript==
// @name         破解微信编辑器会员限制
// @namespace    https://ziyuand.cn/
// @version      0.6
// @description  简单去除135编辑器、96编辑器、主编编辑器、易点编辑器vip限制
// @author       Sherwin
// @match        *://*.135editor.com*
// @match        *://*.135editor.com/*
// @match        *://bj.96weixin.com*
// @match        *://www.wxeditor.com*
// @match        *://www.zhubian.com*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/392046/%E7%A0%B4%E8%A7%A3%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E4%BC%9A%E5%91%98%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/392046/%E7%A0%B4%E8%A7%A3%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E4%BC%9A%E5%91%98%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
        var host = window.location.host;
        console.log(host);
        switch(host){
            case "www.135editor.com":
                hack_135();
                break;
            case "bj.96weixin.com":
                hack_96_ZB();
                break;
            case "www.zhubian.com":
                hack_96_ZB();
                break;
            case "www.wxeditor.com":
                hackED();
                break;
        }
    function hack_135(){
        $('body').click(function(e){
            //$(".modal-backdrop.show").remove();
            $(".show").attr("style","display: none;");
            $(".style-item.vip-style").removeClass("vip-style").addClass("style-item");
            $("._135editor").attr("data-tools","hack");
            $("._editor").attr("data-support","hack");
            $("._135editor").attr("data-id","hack");
            $(".style-item").attr("id","");
            $(".style-item").attr("data-id","hack");
        });

    }

    function hack_96_ZB(){
        $('div').click(function(e){
            $(".rich_media_content").attr("data-vip","1");
        });
    }

    function hackED(){
        $('div').click(function(e){
            $('.yead_editor').attr('data-use',"1");
        });
    }


})();