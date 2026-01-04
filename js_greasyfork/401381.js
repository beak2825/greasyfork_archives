// ==UserScript==
// @name         ECNU数据库自动登录
// @namespace    1060532234@qq.com
// @version      0.1
// @description  支持ECNU数据库网站的自动打码登录，只会将验证码上传到服务器，脚本输入的验证码和页面中验证码不一致是正常现象，开放自定义参数
// @author       CiaranZhou
// @match        https://portal1.ecnu.edu.cn/cas/login?service=*.jsp
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/401381/ECNU%E6%95%B0%E6%8D%AE%E5%BA%93%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/401381/ECNU%E6%95%B0%E6%8D%AE%E5%BA%93%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

var setting = {
	// 5E2 == 500，科学记数法，表示毫秒数
    time: 5E2 // 默认响应速度为0.5秒，根据自己的网络状况调整
    ,captcha_url: 'https://ciaran.top/captcha/' // 验证码识别接口
}

var img_url = document.images.codeImage.src;
var r = new XMLHttpRequest();
r.open("GET", img_url);
r.responseType = "blob";
r.onload = function(e){
    var data = new FormData();
    data.append('img', this.response);
    $.ajax({
        url: setting.captcha_url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        error: function (error) {
            console.log(error);
        },
        success: function(result){
            console.log(result);
            if (result.error_num) {
            	alert(result.msg);
            } else {
            	$('#code').val(result.msg);
	            setTimeout(function(){
	                $("input.login_box_landing_btn").click();
	            },setting.time);
            }
        }
    });
};
r.send();