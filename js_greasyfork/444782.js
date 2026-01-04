// ==UserScript==
// @name          sdjz.edu 新教务系统验证码识别
// @namespace     Coca
// @version       0.0.3
// @description  点击按钮一键识别填写验证码
// @author       mukes
// @include      *://xjwgl.sdjzu.edu.cn/jsxsd/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444782/sdjzedu%20%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/444782/sdjzedu%20%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==
// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */



(function() {

    'use strict';
    $(document).ready(function () {
        var url = 'https://q53w002884.xicp.fun/predict';
        $("body").append($('<canvas width="100" height="40" style="display: none;" id="captcha-canvas"></canvas>'));
        let img_elem = document.getElementById("SafeCodeImg");
        let canvas_elem = document.getElementById("captcha-canvas");

        canvas_elem.getContext("2d").drawImage(img_elem, 0, 0);
        let dataURL = canvas_elem.toDataURL("image/jpeg");
        console.log(dataURL);
        $.ajax({
            url: url,
            type: 'get',
            data: { "imgUrl": dataURL },
            dataType: 'json',
            success: function (res) {
                console.log(res.ans);
                document.getElementById("RANDOMCODE").value = res.ans;
            }
    });
    }());



})();