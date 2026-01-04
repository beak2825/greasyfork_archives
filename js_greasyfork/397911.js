// ==UserScript==
// @name         百度背景图不被卡片挡住！
// @namespace    1312141991@qq.com
// @version      0.4
// @description  百度，你挡住我看背景图了！
// @author       及小路
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397911/%E7%99%BE%E5%BA%A6%E8%83%8C%E6%99%AF%E5%9B%BE%E4%B8%8D%E8%A2%AB%E5%8D%A1%E7%89%87%E6%8C%A1%E4%BD%8F%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/397911/%E7%99%BE%E5%BA%A6%E8%83%8C%E6%99%AF%E5%9B%BE%E4%B8%8D%E8%A2%AB%E5%8D%A1%E7%89%87%E6%8C%A1%E4%BD%8F%EF%BC%81.meta.js
// ==/UserScript==

(function() {

    //底部栏位透明
    document.getElementById("bottom_layer").style.backgroundColor="#0000";

    //可调部位
    var opa = 4;//调整初始透明度，数值在0-10，数字越小透明度越高（0是全透明，10是不透明）

    var speed = 400;//调整渐变速度，数值建议在100-500，数字越小，渐变速度越快

    //先设置透明度
    document.getElementById("s_main").style.opacity=opa/10;
    var card_0 = document.getElementById('s_main');

    //鼠标移入动作
    card_0.onmouseenter=function(event){
        fadeIn("s_main",speed,opa);
    }

    //鼠标移出动作
    card_0.onmouseleave=function(event){
        fadeOut("s_main",speed,opa);
    }

})();

//渐变函数
function fadeIn(nam,speed,opa)
{
    speed/=10;
    var element=document.getElementById(nam);
    if(element.style.opacity !==1)
    {
        var num = opa;
        var st = setInterval(function()
                             {
            num++;
            element.style.opacity = num/10;
            if(num>=10){clearInterval(st);}
        },speed);
    }
}

function fadeOut(nam,speed,opa){
    speed/=10;
    var element=document.getElementById(nam);
    if(element.style.opacity !==opa/10){
        var num = 10;
        var st = setInterval(function(){
            num--;
            element.style.opacity = num / 10 ;
            if(num<=opa){clearInterval(st);}
        },speed);
    }
}