// ==UserScript==
// @name         成都市中小学教师继续教育网-免继续学习弹窗和输验证码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  成都市中小学教师继续教育网-免15分钟弹窗和输验证码，给老婆挂机学习用
// @author       ray
// @include      *.cdjxjy.com/*
// @match        https://www.cdjxjy.com/
// @run-at 	     document-end
// @icon         https://www.cdjxjy.com/SiteWeb/images/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459628/%E6%88%90%E9%83%BD%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-%E5%85%8D%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%BC%B9%E7%AA%97%E5%92%8C%E8%BE%93%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/459628/%E6%88%90%E9%83%BD%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-%E5%85%8D%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%BC%B9%E7%AA%97%E5%92%8C%E8%BE%93%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==



(function () {
    if(typeof(showyzm) === 'undefined'){
    }else{
        showyzm = function() {}
        showAlert(300,"已取消了验证码弹窗")
    }
    if(typeof(dingshi) === 'undefined'){
    }else{
        dingshi = 9999
        showAlert(300,"已延长继续学习提示间隔到9999秒")
    }

    function showAlert(pWidth,content)
    {
        $("#msg").remove();
        var html ='<div id="msg" style="position:fixed;top:5%;width:100%;height:30px;line-height:30px;margin-top:-15px;"><p style="background:#000;opacity:0.8;width:'+ pWidth +'px;color:#fff;text-align:center;padding:10px 10px;margin:0 auto;font-size:12px;border-radius:4px;">'+ content +'</p></div>'
                $("body").append(html);
                var t=setTimeout(next,2000);
                function next()
                {
                    $("#msg").remove();

                }
    }
})();