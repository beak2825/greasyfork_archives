// ==UserScript==
// @name         公需课学习
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  屏蔽公需课学习中间需确认
// @author       penrcz
// @match        http://ggfw.gdhrss.gov.cn/zxpx/auc/play/player*
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/381685/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/381685/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    function newshowLastTimu(){
        _p('heihei');
    }
    var oldFunction = unsafeWindow.showLastTimu;
    unsafeWindow.showLastTimu = function () {
        newshowLastTimu();
    };

    $(function(){

        //定时判断是否已完成
        setInterval(isOverWatch,3000);
    });

    function isOverWatch(){
        var _html = $('.learnpercent').html();
        _p(_html);
        if(_html.indexOf("已完成") != -1){
            var _a = $('#content a .content-unstart').first().parent();
            var _url = _a.attr('href');
            var _title = _a.attr('title');
            _p(_title);
            _p(_url);
            window.location.href=_url;
        }
    }

    //获取url参数
    function GetUrlParam(paraName) {
        var url = document.location.toString();
        var arrObj = url.split("?");

        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;

            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");

                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                }
            }
            return "";
        }
        else {
            return "";
        }
    }

    function _p(obj){
        console.log(obj);
    }
})();