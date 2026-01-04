// ==UserScript==
// @name         柳铁疫情填报敷衍助手
// @namespace    https://space.bilibili.com/57935837/dynamic
// @version      0.1
// @description  疫情填报敷衍助手
// @author       火山
// @match        *ncov.lztdzy.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411252/%E6%9F%B3%E9%93%81%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5%E6%95%B7%E8%A1%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/411252/%E6%9F%B3%E9%93%81%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5%E6%95%B7%E8%A1%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    const 设置 = {
        登录身份: 1,//1:学生；2:教师；3:校外人员；4:留学生
        学号:12345678912,//输入您的11位‘学号
        身份证:"******",//输入您的身份证号后6位，使用英文双引号！！
        姓名:"***",//输入您的姓名，使用英文双引号！！
        体温最小值:36.1,
        体温最大值:37.0,
    }

    if(window.location.pathname.length == 1){
        //登录
        document.getElementById("thesf").selectedIndex = 设置.登录身份;
        document.getElementById("thexh").value = 设置.学号;
        document.getElementById("thesfz").value = 设置.身份证;
        document.getElementById("thexm").value = 设置.姓名;
        document.getElementById("Button1").click();
    } else {
        //填报
        console.log(document.getElementById("thexm").value + "已登录");

        if(document.getElementById("thexm").value != 设置.姓名){
            var r = confirm("这不是 " + 设置.姓名 + " 的疫情填报，是否继续？");
            if (r == true) {
                report();
            }
        } else {
            report();
        }
    }

    function report() {
        if(document.getElementById("filldate").innerHTML == "已填报"){
            alert( document.getElementById("thexm").value+" , 今日您已填报! \n" + document.getElementById("thedate").value);
        }else{
            console.log("您未填报");
            document.getElementById("divxsrcfk_swtw").value= randomNum();
            document.getElementById("divxsrcfk_xwtw").value= randomNum();
            document.getElementById("btnsave").click();
        }
        alert(document.getElementById("thedate").value+"填报完成");
    }

    function randomNum() {
        let differ = 设置.体温最大值 - 设置.体温最小值
        let random = Math.random()
        return (设置.体温最小值 + differ * random).toFixed(1)
    }

})();

