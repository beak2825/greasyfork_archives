// ==UserScript==
// @name         vclass register
// @icon        https://ae01.alicdn.com/kf/Hea204b09a9c648adb1960bcdfd163155L.jpg
// @namespace    https://www.luogu.com.cn/user/45415
// @version      1.66
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
// @downloadURL https://update.greasyfork.org/scripts/427338/vclass%20register.user.js
// @updateURL https://update.greasyfork.org/scripts/427338/vclass%20register.meta.js
// ==/UserScript==

'use strict';
var beat = "1.66"
var datas = "kevp-20210612";
var named = "vclass register"
function hasClass(element, cls) {
 return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
}
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//start
(function() {
    
    var to_html = document.getElementsByTagName("html");
    var scr = document.createElement("script");
    scr.type = "text/javascript";
    scr.text = "window.alert = function(str){   window.location.reload();   return ;  };";
    to_html[0].appendChild(scr);
    console.log("脚本: vclass register --- 开始执行 --- 发布者: kekjy --- 路途愉快！ Good luck!");
})();

var intro_rn,footer_rn,check_update = document.createElement("div");
check_update.id = "check_update";
let show_qd = document.createElement("div");

function make_cl(c,a) {
 var b = document.createEvent('HTMLEvents');
 var reject = document.getElementById(a).getBoundingClientRect();
      b.initEvent(c, false, true);
      b.pageX = b.clientX = b.screenX = (reject.left + reject.right) / 2;
      b.pageY = b.clientY = b.screenY = (reject.top + reject.bottom) / 2;
      console.log(b.pageX);
      console.log(b.pageY);
      return b;
}

window.onload = function()
{
   
    var to_ready = setInterval(function()
   {
      intro_rn = document.getElementsByClassName("c-intro");
      if (intro_rn[0])
      {
      intro_rn[0].appendChild(show_qd);
      intro_rn[0].appendChild(check_update);

      //button
      footer_rn = document.getElementsByClassName("c-footer")[0].getElementsByTagName("a");
      footer_rn[0].innerText = "- kekjy提供技术支持 -";
      footer_rn[0].href = "https://greasyfork.org/zh-CN/scripts/427338-vclass-register";
      clearInterval(to_ready);
      //pp[0].style.color = "#fff"
      }

      //I know
      /*var modal__close = document.getElementsByClassName("plv-ia-c-modal__close")[1];
      modal__close.id = "modal_close";
      modal__close.dispatchEvent(make_cl('click',modal__close));*/

    },50);
     //update
     var klabeat;



   sleep(1000).then(()=> {$("#check_update").load("https://greasyfork.org/zh-CN/scripts/427338-vclass-register dd.script-show-version");
   var ToFindNew = setInterval(function()
   {
       if (check_update.innerText)
       {
           check_update.innerHTML = "<span>\n\n" + "当前版本：" + beat + "　　　</span><a style= 'color: #263238;' target = _blank  href = https://greasyfork.org/zh-CN/scripts/427338-vclass-register>最新版本：" + check_update.innerText + "</a>";
           clearInterval(ToFindNew);
       }
   }, 50);});

};
var times = 0, alltime = GM_getValue(datas);
(function() {

    if (!alltime)
    {
        GM_setValue(datas, 0);
        alltime = 0;
    }
     show_qd.innerText = "\n\n" +  "已自动签到：" + times + "次\n" + "总计：" + alltime + "次" + "\n\n\n\n";
})();


var sign_in, button_fa,ok_tips, sign_me, delay_time;
//qiandao
(function(){
    var find_signed=setInterval(function() {
        button_fa = document.getElementsByClassName("plv-ia-c-sign__btn__wrap")[0];
        if (button_fa)
        {
            button_fa.id="sign_father";
            sign_in = button_fa.childNodes[0];
            sign_in.id = "sign_in";
            sign_me = document.getElementsByClassName("plv-ia-c-sign")[0];
            sign_me.id = "sign_me";
            ok_tips = sign_me.getElementsByClassName("plv-ia-c-submit-tips")[0];
            ok_tips.id = "ok_tips";
            clearInterval(find_signed);

        }
    }, 50);

})();

(function(){
    setInterval(function() {

                        if (sign_me.childNodes[0].style.display !== "none" && ok_tips.style.display === "none" && (!delay_time))
                        {
                            delay_time = 9;
                            sign_in.dispatchEvent(make_cl('mousedown',"sign_in"));
                            sign_in.dispatchEvent(make_cl('mouseup',"sign_in"));
                            sign_in.dispatchEvent(make_cl('click',"sign_in"));
                         //   sign_in.dispatchEvent(make_cl('click',"sign_in"));
                            times = times + 1 , alltime = alltime + 1;
                            GM_setValue(datas , alltime);
                            show_qd.innerText = "\n\n" +  "已自动签到：" + times + "次\n" + "总计：" + alltime + "次"+ "\n\n\n\n";

                        }
                        if (delay_time) --delay_time;
               }, 500);
})();





