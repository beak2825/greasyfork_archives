// ==UserScript==
// @name         北京师范大学珠海分校·校园网 自动登录
// @namespace    undefined
// @version      5.6
// @description  自动登录【北京师范大学珠海分校·校园网】，即【宿舍有线局域网】、【BNUZ-Student无线局域网】、【BNUZ无线局域网】
// @author       Tosh
// @include      http://enet.10000.gd.cn:10001/zh/zh126/index.jsp?wlanacip=*&wlanuserip=*
// @include      http://enet.10000.gd.cn:10001/zh/zh126/index.jsp?wlanuserip=*&wlanacip=*
// @include      http://enet.10000.gd.cn:10001/zh/zh1215/index.jsp?wlanacip=*&wlanuserip=*
// @include      http://enet.10000.gd.cn:10001/zh/zh1215/index.jsp?wlanuserip=*&wlanacip=*
// @downloadURL https://update.greasyfork.org/scripts/23355/%E5%8C%97%E4%BA%AC%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%8F%A0%E6%B5%B7%E5%88%86%E6%A0%A1%C2%B7%E6%A0%A1%E5%9B%AD%E7%BD%91%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/23355/%E5%8C%97%E4%BA%AC%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%8F%A0%E6%B5%B7%E5%88%86%E6%A0%A1%C2%B7%E6%A0%A1%E5%9B%AD%E7%BD%91%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

var username = "这里填账号";
var password = "这里填密码";
var wlanuserip = getQueryString("wlanuserip");
var wlanacip = getQueryString("wlanacip");

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
}

// 以下验证码识别算法来自紫云飞 http://www.cnblogs.com/ziyunfei/archive/2012/10/05/2710349.html
function getRand() {
    var image = document.getElementById("random");
    var canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    var ctx = canvas.getContext("2d");
    var numbers = ["111000111100000001100111001001111100001111100001111100001111100001111100001111100001111100100111001100000001111000111111111111111111111000000000",
                   "111000111100000111100000111111100111111100111111100111111100111111100111111100111111100111111100111100000000100000000111111111111111111000000000",
                   "100000111000000011011111001111111001111111001111110011111100111111001111110011111100111111001111111000000001000000001111111111111111111000000000",
                   "100000111000000001011111001111111001111110011100000111100000011111110001111111001111111001011110001000000011100000111111111111111111111000000000",
                   "111110011111100011111100011111000011110010011110010011100110011100110011000000000000000000111110011111110011111110011111111111111111111000000000",
                   "000000001000000001001111111001111111001111111000001111000000011111110001111111001111111001011110001000000011100000111111111111111111111000000000",
                   "111000011110000001100111101100111111001111111001000011000000001000111000001111100001111100100111000100000001111000011111111111111111111000000000",
                   "100000000100000000111111100111111101111111001111110011111110111111100111111101111111001111111001111110011111110011111111111111111111111000000000",
                   "110000011100000001100111001100111001100011011110000011110000011100110001001111100001111100000111000100000001110000011111111111111111111000000000",
                   "110000111100000001000111001001111100001111100000111000100000000110000100111111100111111001101111001100000011110000111111111111111111111000000000"];
    var captcha = "";
    canvas.width = image.width;
    canvas.height = image.height;
    document.body.appendChild(canvas);
    ctx.drawImage(image, 0, 0);
    for (var i = 0; i < 4; i++) {
        var pixels = ctx.getImageData(13 * i + 7, 3, 9, 16).data;
        var ldString = "";
        for (var j = 0, length = pixels.length; j < length; j += 4) {
            ldString = ldString + ( + (pixels[j] * 0.3 + pixels[j + 1] * 0.59 + pixels[j + 2] * 0.11 >= 140));
        }
        var comms = numbers.map(function(value) {
            return ldString.split("").filter(function(v, index) {
                return value[index] === v;
            }).length;
        });
        captcha += comms.indexOf(Math.max.apply(null, comms));
    }
    return captcha;
}

if (username === "这里填账号" || password == "这里填密码") {
    alert("请去用户脚本管理器中，找到此脚本的第 13、14 行代码，添加自己的账号与密码");
} else {
    var url = window.location.href;
    if (url.indexOf("zh1215") >= 0) {
        var time = new Date().getTime();
        var body = document.getElementsByTagName("body")[0];
        var para = document.createElement("img");
        body.appendChild(para);
        para.style.display = 'none';
        para.src = "/common/image.jsp?time=" + time;
        para.id = 'random';
        if (BASE64 && BASE64.encoder) {
            password = BASE64.encoder(password);
        }
        para.onload = function(){
            $.ajax({
                type:"post",
                url:"http://enet.10000.gd.cn:10001/login.do",
                data: { eduuser: wlanuserip, edubas: wlanacip, patch: "zh/zh126", userName1: username, password1: password, rand: getRand() },
                success: function (data) {
                    if (data.indexOf("success") >= 0) {
                        $("#login").css('display','none');
                        $("#success").css('display','block');
                    } else {
                        document.getElementById("username").value = username;
                        document.getElementById("password").value = password;
                        alert("自动登录失败，请关闭脚本手动登录");
                    }
                }
            });
        };
    } else {
        document.getElementById("random").onload = function() {
            document.getElementById("userName1").value = username;
            document.getElementById("password1").value = password;
            document.getElementById("rand").value = getRand();
            submitlogin1();
        };
    }
}