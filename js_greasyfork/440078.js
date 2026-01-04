// ==UserScript==
// @name         自动健康打卡
// @namespace       http://tampermonkey.net/
// @version         3.0.1
// @description     基于原生js和简单jQuery的自动健康打卡，实现疫情防控下校园内的每日健康打卡上报
// @author          qiu121
// @match           https://sso.ncgxy.com:9089/login/reg?queryMap.reg_type=stu
// @icon            http://pic.616pic.com/ys_bnew_img/00/14/47/wI48iKKv7m.jpg
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
/* globals jQuery, $, waitForKeyElements */

// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440078/%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/440078/%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

//=================================================
////此处填写值为有效的用户身份证号
var id = "0000";
//=================================================

(function() {
    'use strict';
    //正则匹配有效身份证号(16位或18位)
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17})(\d|X|x)$/;
    //网页加载完毕执行以下操作
    if(!(pattern.test(id))){
        window.alert("\n请编辑脚本，指定你的有效身份信息！\n\n");
        return false;
    }

    //自动点击进入页面，中括号内可选参数为0和1
    //0表示进去“体温与行动轨迹报告”，1表示进入“返校登记”
    //修改参数进入页面，默认为0
    /*
           if(window.location.pathname === "/card_index.jsp"){
               var clickevt = document.createEvent("MouseEvents");
               clickevt.initEvent("click", true, true);
               document.getElementsByClassName("btn")[0].dispatchEvent(clickevt)
           }
        */
    //若身份证有效，执行登录操作
    //填入身份证号,待网页渲染完毕执行脚本，进入打卡界面
    $(function(){
        var btn=document.getElementById("phone");
        //btn.value=id;
        $("#phone").val(id);

        //提交登录
        $(".btn_submit").trigger('click');
        //var btn=document.querySelector('#btn_submit');
        //var login=document.getElementsByClassName("btn_submit");

        //检测是否已经完成打卡
        var title=document.getElementsByTagName('title');
        if(title[0].innerHTML=='南昌工学院人员电子通行卡'){
            window.alert('打卡已完成');
        }
        /*
        window.alert(title.length);
        for(var i=0;i<title.length;i++){
            if(title[i].innerHTML=='南昌工学院人员电子通行卡'){
                window.alert('打卡已完成');
                 break;
            }
        }
        */

        //==============================================================================================
        //所在地由定位获取，属性为只读，无法修改

        //健康状况
        var health=document.getElementById("RadioGroup1_0");
        $("#RadioGroup1_0").attr("checked",true);


        //是否隔离===================================================！！！！！！！！！
        //（否：2）（是：1）
        var separate=document.getElementsByName("vo.gl");
        //alert(separate.length)
        if(separate[0].value=="2"){
            separate[0].checked=true;
        }

        //近14天是否有中高风险地区旅居史
        var risk=document.getElementById("RadioGroup6_1");
        risk.checked=true;

        //是否已接种疫苗===============================================！！！！！！！！！！！
        // （是：1）（否：2）
        var vaccinate=document.getElementsByName("vo.jzym")
        for (var j = 0; j <vaccinate.length; j++) {
            if (vaccinate[j].value=="1") {
                var att_2=document.createAttribute("checked");
                att_2.value=true;
                vaccinate[j].setAttributeNode(att_2);               
                break;
            }
        }
        //疫苗详情
        var ymxq =document.getElementById("li_ymxq");
        //alert(ymxq.style);
        ymxq.style='display:list-item'//展开疫苗详情
        /*
            ymxq.style='display:none'
            初始界面，默认折叠
        */
        var ymxq_1=document.getElementById("ymxq");
        var ymxq_2=document.getElementsByTagName("option");
        //alert(ymxq_2.length);
        //alert(ymxq_2[13].innerHTML);
        //alert(ymxq_2[13].value);
        //ymxq_2[ymxq_2.length-1].selected=true;
        //ymxq_2[13].selected=true;
        for (var k = 0; k < ymxq_2.length; k++) {
            if (ymxq_2[k].innerHTML=="接种第三针") {
                ymxq_2[k].selected=true;
                break;
            }
        }

        //提交数据
        var time_1=setTimeout(function(){
            var submit=document.getElementById("my_btn");
            //$(".btn_submit t_btn").click();
            //$("#my_btn").trigger('click')

            //没有点击按钮，只是执行了按钮所绑定的事件
            submit.onclick();

            //刷新一次页面
            //location.reload();
        },1500);//延时1.5秒完成提交

    })
})();