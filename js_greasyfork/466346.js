// ==UserScript==
// @name         URP教务系统验证码自动填写
// @namespace    JerryWang
// @version      0.28
// @description  教务处验证码自动识别填写(理论支持所有新版URP教务系统)
// @author       JerryWang
// @author       SaoJiaFei
// @match        http://jwxs.hebut.edu.cn/login
// @match        http://zhjw.scu.edu.cn/login
// @match        http://jwxs.hhu.edu.cn/login
// @match        http://202.119.114.196/login
// @match        http://202.119.114.197/login
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466346/URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/466346/URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

let baseurl = "http://111.230.47.141:1145";

function predict(){
    var img = $("#captchaImg")[0];
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    var dataURL = canvas.toDataURL()
        .replace("data:image/png;base64,", "");
    $.ajax({
        url: baseurl + "/predictbase64",
        dataType: "JSON",
        type: "POST",
        contentType: "application/json",
        async:false,
        data: '"' + dataURL + '"',
        success: function (res) {
            console.log(res)
            $("#input_checkcode")[0].value = res
        }
    });
}

function reportError(){
    var img = $("#captchaImg")[0];
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    var dataURL = canvas.toDataURL()
        .replace("data:image/png;base64,", "");
    $.ajax({
        url: baseurl + "/reporterrorbase64",
        dataType: "JSON",
        type: "POST",
        contentType: "application/json",
        async:false,
        data: '"' + dataURL + '"'
    });
}

$("a").click(function(){
    setTimeout(predict, 200);
});
(function () {
    $("#formFooter")[0].innerHTML += "<br><span id=\"clicked\" style=\"color: #7b0003;\">如验证码识别错误 可点击图片重新识别</span>";
    $("#native > div").append(
        `<a id="reportErrorButton" href="javascript:void(0);" >识别错误</a>`);
    document.getElementById("reportErrorButton").onclick = reportError;

    setTimeout(predict, 200);
})();