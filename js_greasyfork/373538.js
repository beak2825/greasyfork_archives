// ==UserScript==
// @name         write Const IdCard
// @namespace    http://mytesttampermonkey.net/
// @version      0.35
// @description  self test code dont download
// @include      http*://service.cpic.com.cn/*
// @author       mmyy
// @require https://cdn.bootcss.com/underscore.js/1.9.0/underscore-min.js
// @require https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/373538/write%20Const%20IdCard.user.js
// @updateURL https://update.greasyfork.org/scripts/373538/write%20Const%20IdCard.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var localHref = window.location.href;
    console.log(localHref);
    var idCardLabel = $("#idNumber");
    idCardLabel.val("410411197708111515");
var ipt = $("<input type='button' class='btn_blue' style='background:#1d8027; margin-right:15px;' value='验证码'/>");
  $("#graphImg").wrap("<div id='myTest'></div>");
$(ipt).click(function(){
  //图片地址 
    convertImgToBase64(function(base64Img){
        var base64Str = base64Img.replace("data:image/png;base64,", "");

        console.log(base64Str);

 //获取到base64,请求百度
                    GM_xmlhttpRequest({
                        method: "POST",
                        headers: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        url: "https://aip.baidubce.com/rest/2.0/ocr/v1/webimage?access_token=24.7a221d339b45a505be241f4c2d36991e.2592000.1548579931.282335-11171025",
                        data: "image=" + encodeURIComponent(base64Str),
                        onload: function (response) {
                            console.log(response);
                            if (response) {
                                response = $.parseJSON(response.response);
                                if (response.words_result) {
                                    var strCode = response.words_result[0].words.replace(/[^a-zA-Z0-9]/ig, "").replace("0", "O").replace("了", "3").replace("]", "J").replace("工", "I");
                                    if (strCode.length != 4) {
                                        //可以调用精确型
                                        GM_xmlhttpRequest({
                                            method: "POST",
                                            headers: {
                                                "content-type": "application/x-www-form-urlencoded"
                                            },
                                            url: "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.7a221d339b45a505be241f4c2d36991e.2592000.1548579931.282335-11171025",
                                            data: "image=" + encodeURIComponent(base64Str),
                                            onload: function (response) {
                                                console.log(response);
                                                if (response) {
                                                    if (response.errorCode) {
                                                        $("#authCode").val(strCode);
                                                    } else {
                                                        response = $.parseJSON(response.response);
                                                        if (response.words_result) {
                                                            var strCode = response.words_result[0].words.replace(/[^a-zA-Z0-9]/ig, "").replace("0", "O").replace("了", "3").replace("]", "J").replace("工", "I");
                                                            $("#authCode").val(strCode);
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    else
                                        $("#authCode").val(strCode);
                                }
                            }
                        }
                    });
    });

});
    $("#epolicyDownloadBtn").before(ipt);
  
    function convertImgToBase64(callback, outputFormat){
        $("#graphImg").unwrap().wrap("<div id='myTest' style='height:40px;width:105px;'></div>");
        html2canvas($("#myTest") ).then(canvas => {
            document.body.appendChild(canvas)
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback.call(this, dataURL);
            canvas = null; 
        });
    }
})();