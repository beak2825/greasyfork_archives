// ==UserScript==
// @name        武汉理工大学教务管理网站页面计算某一学年的绩点。
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  武汉理工大学教务管理网站页面计算某一学年的绩点和计算所有必修和实践课绩点（方便推免计算）。
// @author       guo
// @include      http://202.114.50.130/Score/*
// @match        http://202.114.50.130/Score/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/410115/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%BD%91%E7%AB%99%E9%A1%B5%E9%9D%A2%E8%AE%A1%E7%AE%97%E6%9F%90%E4%B8%80%E5%AD%A6%E5%B9%B4%E7%9A%84%E7%BB%A9%E7%82%B9%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/410115/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%BD%91%E7%AB%99%E9%A1%B5%E9%9D%A2%E8%AE%A1%E7%AE%97%E6%9F%90%E4%B8%80%E5%AD%A6%E5%B9%B4%E7%9A%84%E7%BB%A9%E7%82%B9%E3%80%82.meta.js
// ==/UserScript==
var buttonTr=$('body');
$(buttonTr).append('<div id="gpa" ><input id="point" type="button" value="计算某学年绩点" onclick="whutgpa()" "/></div>');
$('#gpa').css({"position":"absolute","z-index": "999999"});
//css.textContent="#gpa{border-left-width: 2px ;margin-left: 700px;margin-top: 10px;position:absolute;z-index: 999999; background-color: #b5c1d0;color: #cd3a3a}";
$("#point").css({"border-left-width": "2px" ,"margin-left": "650px","margin-top": "40px","background-color": "#b5c1d0","color":" #cd3a3a"});


var gpadiv=$('div#gpa');
$(gpadiv).append('<input id="bixiupoint" type="button" value="必修绩点" onclick="whutbixiugpa()" "/>');

$("#bixiupoint").css({ "margin-left": "10px","background-color": "#b5c1d0","color":" #cd3a3a"});

unsafeWindow.whutgpa=function(){
    var id=$("#undefined");
    var tr=$(id).find("tr");
    var creditSum=0;//学分总和
    var pointMulCreditSum=0;//学分*绩点总和
    var allYear=prompt("请输入计算学年","");
    $(tr).each(
        function(key,param){
            var year=$(param).children('td').eq(0).find("div").html();
            
            //var reg = RegExp(//);
            if(year.indexOf(allYear)>=0){
            var credit= $(param).children('td').eq(5).find("div").html();//每门课的学分
            var point=$(param).children('td').eq(13).find("div").html();//每门课的绩点
            if(Number(point)!=0){
              creditSum+=Number(credit);
              pointMulCreditSum+=Number(credit)*Number(point);
            }

            }
        })
    if(allYear!=null){
        alert("总学分："+creditSum);
        alert("学分*绩点总和："+pointMulCreditSum);    
        var gpa=pointMulCreditSum/creditSum;
        alert("绩点："+gpa);

        var kexue=((gpa-1)*10+60)*0.7;
        alert("科学文化素质"+kexue);
    }
};


unsafeWindow.whutbixiugpa=function(){
    var id=$("#undefined");
    var tr=$(id).find("tr");
    var creditSum=0;//学分总和
    var pointMulCreditSum=0;//学分*绩点总和

    $(tr).each(
        function(key,param){
            var year=$(param).children('td').eq(4).find("div").html();

            //var reg = RegExp(//);
            if(year.indexOf("必修")>=0 ||year.indexOf("实践")>=0){
            var credit= $(param).children('td').eq(5).find("div").html();//每门课的学分
            var point=$(param).children('td').eq(13).find("div").html();//每门课的绩点
            if(Number(point)!=0){
              creditSum+=Number(credit);
              pointMulCreditSum+=Number(credit)*Number(point);
            }

            }
        })
        alert("总学分："+creditSum);
        alert("学分*绩点总和："+pointMulCreditSum);
        var gpa=pointMulCreditSum/creditSum;
        alert("绩点："+gpa);

    
};