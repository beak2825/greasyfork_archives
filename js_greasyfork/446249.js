// ==UserScript==
// @name         万方提交脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        *://check.wf.pub/*
// @match        *://acc.wf.pub/*
// @match        *://wf.pub/apps
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446249/%E4%B8%87%E6%96%B9%E6%8F%90%E4%BA%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446249/%E4%B8%87%E6%96%B9%E6%8F%90%E4%BA%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {


var aurl = window.location.href;



if(aurl.substring(0,27) == "https://check.wf.pub/" || aurl.substring(0,27) == "https://check.wf.pub/papers"){
$('body').prepend('<input type="button" value="输入" id="yijianshuru" style="height: 200px;width: 100%;font-size: 100px;float: left;">');
// $('body').prepend('<input type="button" value="登录" id="button1" style="height: 200px;width: 50%;font-size: 100px;float: right;">');
//一键提交检测
$("#yijianshuru").on("click", function(){
    var neirong = prompt("请输入内容："); //输入格式：版本&&&作者&&&题目
    var banben = neirong.split('&&&')[0].substring(0,1);  //获取版本
    var zuozhe = neirong.split('&&&')[1];  //获取作者
    var timu = neirong.split('&&&')[2];  //获取题目
//   console.log('A')
    document.getElementById('title').value = timu; //输入题目
    document.getElementById('author').value = zuozhe;  //输入作者

    //选择文献类型
    if(banben == "T"){
        document.getElementById("paper_type").children[0].click();
    }
    if(banben == "D" || banben == "B"){
        document.getElementById("paper_type").children[1].click();
    }
    if(banben == "S"){
        document.getElementById("paper_type").children[2].click();
    }
    if(banben == "G"){
        document.getElementById("paper_type").children[3].click();
    }
    if(banben == "K"){
        document.getElementById("paper_type").children[4].click();
    }
    
    //下方为自动滑块配置代码
    setTimeout( function(){
    var neirong = Math.floor(Math.random() * (100 - 10 + 1)) + 10;    // 生成10-100随机数

    var slider    = document.getElementById('nc_1_n1z'),   // 获取滑块
        container = slider.parentNode;       //  获取滑块的父类
	console.log(slider);   // <span id="nc_1_n1z" class="nc_iconfont btn_slide"></span>
    var rect = slider.getBoundingClientRect(),    // 获取滑块的 x y with height 等，见上图
        x0          = rect.x || rect.left,
        y0          = rect.y || rect.top,
        w           = container.getBoundingClientRect().width + neirong,   //  获取滑动槽的长度
        x1          = x0 + w,
        y1          = y0 + neirong;
	console.log(rect)
    var mousedown = document.createEvent("MouseEvents");        // 创建鼠标MouseEvents事件
    mousedown.initMouseEvent("mousedown", true, true, window, 0,
        x0, y0, x0, y0, false, false, false, false, 0, null);    // 初始化鼠标位置
    slider.dispatchEvent(mousedown);

    var mousemove = document.createEvent("MouseEvents");
    mousemove.initMouseEvent("mousemove", true, true, window, 0,
        x1, y1, x1, y1, false, false, false, false, 0, null);
    slider.dispatchEvent(mousemove);     // 滑块执行移动
}, 1000 );
//上方为自动滑块配置代码



})

}//if结束





    // alert(shortName);
    if(aurl.substring(0,22) == "https://acc.wf.pub/pay"){
        var dianshu = document.querySelector("#personal > ul:nth-child(2) > li > div > span > span.recharge-money").innerText;
        var yu_e = document.querySelector("#personal > div.package-cate").innerText;
        if(yu_e.replace(/[^0-9]/ig, "") < dianshu){
            document.querySelector("#personal > div.package-cate > a").click();
            document.querySelector("body > popmask > popdialog > popbody > form > fieldset > ul > li:nth-child(6)").click();
            document.querySelector("#amount_integer").value = dianshu;
            document.querySelector("body > popmask > popdialog > popbody > form > fieldset > ul > li.rechange_li.float_left.active > input.rechange_input.input_amount").value = dianshu;
            document.querySelector("body > popmask > popdialog > popbody > form > footer > button:nth-child(1)").click();

        }
        if(yu_e.replace(/[^0-9]/ig, "") >= dianshu){
            document.querySelector("#personal > ul:nth-child(2) > li").click();


        }
         // alert(yu_e.replace(/[^0-9]/ig, ""));



    }

    if(aurl.substring(0,28) == "https://acc.wf.pub/wfcashier"){
        var biaoti = document.querySelector("body > wfcashier > div > div > div > p:nth-child(3)").innerText;
        if(biaoti == "购买方式：万方用户购点单"){
        document.querySelector("#pay_form > div > ul > li:nth-child(2)").click();
        document.querySelector("#btn-to-payment").click();
        }
        if(biaoti == "购买方式：万方检测单篇计费（个人）"){
        document.querySelector("#btn-to-payment").click();
        }


    }

    if(aurl.substring(0,28) == "https://excashier.alipay.com"){
        document.querySelector("#J_tip_pc > a").click();

    }



    if(aurl.substring(0,33) == "https://check.wf.pub/checkResults"){

        $('body').prepend('<input type="button" value="报告链接提取" id="baogaotiqu" style="height: 200px;width: 100%;font-size: 100px;float: left;">');
        $('body').prepend('<input type="text" value="" id="baogaourl" style="height: 0px;width: 100%;font-size: 100px;float: left; opacity: 0;" readonly="readonly">');
        $("#baogaotiqu").on("click", function(){
            var baogaolianjie = document.querySelector("body > wf-check > wf-check-body > wf-check-body-right > div.result-box > table > tbody > tr:nth-child(1) > td:nth-child(8) > a").href;

             document.querySelector("#baogaourl").value = baogaolianjie;
             document.getElementById("baogaourl").select(); // 选择对象
             document.execCommand("Copy"); // 执行浏览器复制命令

            alert(document.querySelector("body > wf-check > wf-check-body > wf-check-body-right > div.result-box > table > tbody > tr:nth-child(1) > td:nth-child(2)").innerText + "_____" + document.querySelector("body > wf-check > wf-check-body > wf-check-body-right > div.result-box > table > tbody > tr:nth-child(1) > td:nth-child(3)").innerText + "_____" + baogaolianjie);

        })

    }

    if(aurl.substring(0,28) == "https://wf.pub/apps"){
        window.location.href="https://check.wf.pub/";

    }




})();