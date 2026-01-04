// ==UserScript==
// @name         教师研修网学习外挂
// @namespace    https://greasyfork.org/zh-CN/users/41249-tantiancai
// @version      1.4
// @description  自动挂机学习。
// @author       Tantiancai
// @match        http://i.yanxiu.com/uft/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371529/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82.user.js
// @updateURL https://update.greasyfork.org/scripts/371529/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function getUnsafeWindow() {
        if(this)
        {
            console.log(this);
            if (typeof(this.unsafeWindow) !== "undefined") {//Greasemonkey, Scriptish, Tampermonkey, etc.
                return this.unsafeWindow;
            } else if (typeof(unsafeWindow) !== "undefined" && this === window && unsafeWindow === window) {//Google Chrome natively
                var node = document.createElement("div");
                node.setAttribute("onclick", "return window;");
                return node.onclick();
            }else
            {
            }
        } else {//Opera, IE7Pro, etc.
            return window;
        }
    }
    var myUnsafeWindow = getUnsafeWindow();
    var doc = myUnsafeWindow.document;
    var processTimer = null;
    var cntRetry = 0;
	myUnsafeWindow.clearInterval(processTimer);
    processTimer = myUnsafeWindow.setInterval(TimeProcess, 5000);

    function TimeProcess()
    {
        if($('.clock-tip').css('display') != 'none')
        {
	        console.log('%c Click Tip', 'color:blue');
	        $('.clock-tip').click();
        }

        var left = $(".slider-btn").css('left');
        if(left.indexOf("%") >= 0)
        {
            left = left.replace("%","");
            left = left / 1;
            if(left > 99.0)
            {
                window.location.href = GetNext();
            }
        }
        else
        {
            left = parseInt(left.replace("px",""));
            if(left >= 713)
            {
                window.location.href = GetNext();
            }
        }
    }

    function GetNext()
    {
        var url = "";
        var arr = $(".class_all").children("li").first().children("a");
        if(arr.length > 1 && window.location.href.indexOf("&seg=") < 0){
            url = $(arr).eq(1).prop("href");
        }
        else
        {
            for(var i = 0; i < arr.length; i++)
            {
                if(window.location == $(arr).eq(i).prop("href"))
                {
                    i++;
                    break;
                }
            }
            if(i < arr.length)
            {
                url = $(arr).eq(i).prop("href");
            }
            else
            {
                var courseid = parseInt(GetUrlParameter("courseid")) + 1;
                var trainingid = GetUrlParameter("trainingid");
                url = "http://i.yanxiu.com/uft/course/courseview.vm?trainingid=" + trainingid + "&courseid=" + courseid;
            }
        }
        return url;
    }

    function GetUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

})();
