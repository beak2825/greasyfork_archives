// ==UserScript==
// @name         鼠标移动到页面图片显示预览图
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  解决和原网页jquery版本冲突
// @description  增加部分的网站小图大图模式
// @description  鼠标移动到页面图片显示预览图，方便网页上小图查看
// @author       sgd
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.easyicon.net/api/resizeApi.php?id=501159&size=128
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395301/%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/395301/%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 解决和原网页jquery版本冲突
    var jq = jQuery.noConflict(true);

    var big = [{
        "oldVal":"thumb",
        "repVal":"original"
    }];
    // 添加样式
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("#pic {position: fixed;display: none;z-index:99999999;}#pic1 {min-width:100px;height:auto;max-width:100%;max-height:100%; auto;border-radius: 5px;-webkit-box-shadow: 5px 5px 5px 5px hsla(0, 0%, 5%, 1.00);box-shadow: 5px 5px 5px 0px hsla(0, 0%, 5%, 0.3);}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    jq("img").hover(function() {
        console.log("hover");
        var bigUrl = jq(this).attr("src");
        jq.each(big,function(index,v){
            console.log("===="+v.oldVal);
            bigUrl = bigUrl.replace(v.oldVal, v.repVal);
            console.log("bigUrl=%s", bigUrl);
        });
        // $(this).parents(".container-item").append("<div id='pic'><img src='" + bigUrl + "' id='pic1'></div>");
        jq("body").append("<div id='pic'><img src='" + bigUrl + "' id='pic1'></div>");
        jq("img").mousemove(function(e) {
            var wH = document.documentElement.clientHeight
            var wW = document.documentElement.clientWidth
            var imgW = jq("#pic1").width()
            var imgH = jq("#pic1").height()
            var cssArr = {
                "top": "",
                "left": "",
                "bottom": "",
                "right": ""
            }

            if (e.clientX + imgW > wW) {
                if (wW - e.clientX < imgW) {
                    cssArr.left = (e.clientX - imgW - 10) + "px";;

                } else {
                    cssArr.right = 0;
                }

            } else {
                cssArr.left = (e.clientX + 10) + "px";
            }

            if (e.clientY + imgH > wH) {
                cssArr.bottom = 0;
            } else {
                cssArr.top = (e.clientY + 10) + "px";
            }
            console.log(jq("#pic1").height(), wH)
            console.log(cssArr)
            jq("#pic").css(cssArr).fadeIn("fast");
        });
    }, function() {
        jq("#pic").remove();
    });

})();