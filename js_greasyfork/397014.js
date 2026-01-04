// ==UserScript==
// @name         vclass自动签到
// @icon        https://ae01.alicdn.com/kf/Hea204b09a9c648adb1960bcdfd163155L.jpg
// @namespace    https://www.luogu.com.cn/user/45415
// @version      3.455
// @description  老师使用网络工具来攻破学生的暑假，学生必须作出回应。
// @author       kekjy
// @match        live.polyv.cn/watch/*
// @grant        kekjy
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/397014/vclass%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/397014/vclass%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
/*  更新日志
    1.163: 更新界面。
    1.172: 修改刷新频率
    1.184: 修复可能存在的bug
    1.213: 回调，修复没有签到的bug
    1.371: 修复若干bug
    2.010: 修改核心代码
    2.548: 修复更新后无法签到bug
    2.714: 添加渐变色
    2.814: 添加计数器
    2.825: 修复无法签到的bug
    3.015: 紧急回调核心代码
    3.115: 修复重复签到的bug
    3.121: 优化界面，正式结束
    3.225: 浏览器弹窗阻止我挂机，一气之下更新代码屏蔽弹窗。
    3.250: 增加总计
    3.330: 内测，修改签到机制
    3.390: 内测，改写部分代码，增加签到红色警告，增加标签栏闪烁，增加版本检测。
    3.450: 无法自动签到的bug已修复，微调一些数据
    3.455: 兼容性问题？？？
*/
'use strict';
var beat = "3.455"
var datas = "kevp-20200403";
var named = "vclass自动签到"
function hasClass(element, cls) {
 return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
}
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//start
(function() {
    console.log("脚本: vclass自动签到 --- 开始执行 --- 发布者: kekjy --- 路途愉快！ Good luck!");
    var pp = document.getElementsByTagName("html");
 //   pp[0].innerText =  pp[0].innerText;
//    var node = document.createElement("kekjy made-vclass help");
    var scr = document.createElement("script");
    scr.type = "text/javascript";
    scr.text = "window.alert = function(str){   window.location.reload();   return ;  }";
    pp[0].appendChild(scr);
//    node.id = "thank you!";
//    pp[0].appendChild(node);
})();

var ppd;
let talkqd = document.createElement("div");
ppd = $(".class-info-main")[0];
ppd.appendChild(talkqd);
var check_update_html = document.createElement("div");
ppd.appendChild(check_update_html);
check_update_html.id = "check_update_html";

//update
(function() {
    var klabeat;

   /* {
        var xmlhttp;
        var txt,x,xmlDoc;
        if (window.XMLHttpRequest)
        {
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp=new XMLHttpRequest();
        }
        else
        {
            // IE6, IE5 浏览器执行代码
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            console.log("0");
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                console.log("1");
                alert("ok");
                xmlDoc=xmlhttp.responseXML;
                txt="";
                x=xmlDoc.getElementsByTagName("dd")
                console.log("2");
                check_update_html.innerText = "\n\n\n" + "当前版本：" + beat + "　　　　最新版本：" ;
                for (var i = 0; i < x.length; ++i)
                {
                    if (x[i].className == "script-show-version")
                    {
                        console.log("3");
                        check_update_html.innerText = "\n\n\n" + "当前版本：" + beat + "　　　　最新版本：" + x[i].textContent;
                       // klabeat = ;
                    }
                }
            }

        }
        xmlhttp.open("GET","https://greasyfork.org/zh-CN/scripts/397014-vclass%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0",true);
        xmlhttp.send();
    }*/

   $("#check_update_html").load("https://greasyfork.org/zh-CN/scripts/397014-vclass%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0 dd.script-show-version")
   var ToFindNew = setInterval(function()
   {
       if (check_update_html.innerText)
       {
           check_update_html.innerHTML = "<span>\n\n" + "当前版本：" + beat + "　　　</span><a style= 'color: #263238;' target = _blank  href = https://greasyfork.org/zh-CN/scripts/397014-vclass%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0>最新版本：" + check_update_html.innerText + "</a>";
           clearInterval(ToFindNew);
       }
   }, 50);
})();


//qiandao
(function() {
//      document.getElementsByClassName("ppt-at-title")[0].textContent= document.getElementsByClassName("ppt-at-title")[0].textContent + "\n Power by kekjy"
    document.getElementById('chatText').placeholder= named + "  " + beat;


    var kfirst = 0;
    let kspan = document.createElement("span");
    var ped;



    var pp=document.getElementById("announcement").getElementsByTagName("p");
    var i;
    var times = 0, alltime = GM_getValue(datas);
    if (!alltime)
    {
        GM_setValue(datas, 0);
        alltime = 0;
    }

    //tong gao lan

    talkqd.innerText = "\n\n" +  "已自动签到：" + times + "次\n" + "总计：" + alltime + "次" + "\n\n\n\n";


    setInterval(function() {
/*                var arr = document.getElementsByClassName("container")[0].getElementsByTagName("div");
                for( i=0;i<arr.length;i++)
                    if (arr[i].className == "player-signed")
                    {  */
                        if (document.getElementsByClassName("player-signed")[0].style.display == "block")
                        {
                            /*document.getElementsByClassName("btn-signed")[0].id = "btnclick-kekjymade";
                            document.getElementById("btnclick-kekjymade").click();

                            /*if (!kfirst)
                            {
                                kfirst = 1;
                                ped.append(kspan);
                            }
                            kspan.click();*/

                            ped = $(".btn-signed").offset();
                            var fd = document.getElementsByClassName("btn-signed")[0];
                            fd.id = "SBVCLASS";
                            var GG = document.createEvent('HTMLEvents');
                            GG.initEvent('click', 1, 0);
                            GG.pageX = ped.left;
                            GG.pageY = ped.top;
                            GG.clientX = ped.left;
                            GG.clientY = ped.top;
                            document.getElementById("SBVCLASS").dispatchEvent(GG);

                            /*
                            let  ev = new Event("mouseenter");
                            ped.dispatchEvent(ev);

                           var Gd = document.getElementsByClassName("btn-signed");
                           for (var G = 0; G < Gd.length; ++G)
                           {
                               Gd[G].click();
                           }*/
                            times = times + 1 , alltime = alltime + 1;
                            GM_setValue(datas , alltime);
                            talkqd.innerText = "\n\n\n" +  "已自动签到：" + times + "次\n" + "总计：" + alltime + "次"+ "\n\n\n\n";
                        }
               }, 3124);
})();
/*(function() {
    var pp=document.getElementById("announcement").getElementsByTagName("p");
    pp[0].innerText = pp[0].innerText + "\n\n\n             "+ named + "  " + beat + "\n" + "       Power by kekjy";

})();*/


//bottom
(function() {
 // document.getElementById("chatText").value = "GG";
    var pp = document.getElementsByClassName("polyv-page-footer js-polyv-page-footer")[0].getElementsByTagName("a");
    pp[0].innerText = "- kekjy提供技术支持 -";
    pp[0].href = "https://greasyfork.org/zh-CN/scripts/397014-vclass%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0";
    pp[0].style.color = "#fff"
})();

//blackground
(function() {
//    document.getElementsByClassName("wrap ")[0].style.background = "#ffc5c5"
    var colors = new Array(
    [62, 35, 255], [60, 255, 60], [255, 35, 98], [45, 175, 230], [255, 0, 255], [255, 128, 0]);

var step = 0;
var colorIndices = [0, 1, 2, 3];
var ketitle = $("title")[0];
var lasttitle = ketitle.textContent;
var gradientSpeed = 0.002;
var sos = 0;
var p = 0;
function updateGradient() {

    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];

    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";
    if(document.getElementsByClassName("player-signed")[0]) {
    if (document.getElementsByClassName("player-signed")[0].style.display == "block")
    {
        ++sos;
        if (sos % 5 == 0) {p = !p;}
        document.getElementsByClassName("wrap ")[0].style.background = p ? "#f00" : "#f6f9fa";
        ketitle.textContent = p ? "！有新的签到！" : lasttitle
    }
    else {ketitle.textContent =  lasttitle; sos = 0; p = 1; document.getElementsByClassName("wrap ")[0].style.background = "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))";}
    }else
    {
        document.getElementsByClassName("wrap ")[0].style.background = "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))";
    }
 /*    document.getElementsByClassName("ppt-teacher")[0].style.background = "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))";
    document.getElementsByClassName("ppt-chat-list")[0].style.background = "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"; */
        //"rgb(" + r1 + ", " + g1 + ", " + b1 + ") none repeat scroll 0% 0%"
    step += gradientSpeed;
    if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;

    }
}

setInterval(updateGradient, 100);
})();
/*(function() {
setInterval(function() {
window.alert = function(str){
      return ;
  }
}, 0);
})();*/
/*(function() {
     setInterval(function() {
         if (!document.getElementById("paintbrush"))     window.location.reload();
         }, 60000);
})();*/

/*
(async function() {

  await sleep(3000);
  alert("OK");
})();*/
