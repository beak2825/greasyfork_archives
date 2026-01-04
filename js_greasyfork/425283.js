// ==UserScript==
// @name         形势与政策-GS 3.0
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  点击一键挂课，全部专题后台自动挂到80分钟后退出。也可自定义分钟数。
// @author       yu47
// @match        http://xsyzc.gzcc.cn/*
// @grant       none
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/425283/%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96-GS%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/425283/%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96-GS%2030.meta.js
// ==/UserScript==
var times = 81*60*1000
var count = 0;
var flagg = 1;
var close = 0;
var mycars = new Array();
(function () {
    'use strict';
    function x_y() {
        var x = Math.random() * 1000;
        var y = Math.random() * 1000;
        x = parseInt(x).toString();
        y = parseInt(y).toString();
        $("#xID").attr("value", x);
        $("#yID").attr("value", y);
        // console.log("X坐标：" + $("#xID").attr("value"));
        // console.log("Y坐标：" + $("#yID").attr("value"));
        if (count >= document.querySelector(".table").children[1].children.length) {
            alert("恭喜全部课程已刷成功！！！")
            return true;
        }
        setTimeout(() => {
            x_y()
        }, 5000)
    }

    function reload() {

        $('#win').window('close');
            close = 0;

        count += 1;
        //var flag = document.querySelectorAll(".nav-item .dropdown-menu li a")[count * 2]
        if (count >= document.querySelector(".table").children[1].children.length) {
            alert("恭喜全部课程已刷成功！！！")
            return true;
        }

        document.querySelectorAll(".nav-item .dropdown-menu li a")[count * 2].click();
            close = 1

        setTimeout(() => {
            reload();
        }, mycars[count]);
        // console.log('第' + (count / 2 + 1) + '完成！！！');

    }
    function stop() {
        $('#win').window('close');
        //document.querySelectorAll(".nav-item .dropdown-menu li a")[count * 2].click();
    }

    function start() {
        setTimeout(() => {
            x_y()
        }, 5000)
        count = 0;
        while( count < document.querySelector(".table").children[1].children.length ){
        mycars[count] = need_time(count)
            count += 1
        }
        count = 0;
        while( mycars[count] == 0 ){
            count += 1
        }
console.log(mycars);
console.log(count);
        document.querySelectorAll(".nav-item .dropdown-menu li a")[count * 2].click();


        //setTimeout(() => {
        //    stop();
        //}, 2000)
        // console.log('第' + (count / 2 + 1) + '完成！！！');


        setTimeout(() => {
            reload();
        }, mycars[count])
        // console.log('第' + (count / 2 + 1) + '完成！！！');


        setTimeout(() => {
            x_y()
        }, 5000)
    }
    function need_time(count) {
        if(document.querySelector(".table").children[1].children[count].children[1].textContent){
        var src = document.querySelector(".table").children[1].children[count].children[1].textContent;
        //  if (!src){
        //       return times
        //   }
        var bbb = /[0-9]+/g
        var ccc = src.match(bbb)
        var feng = ccc[0]
        var miao = ccc[1]
        var all = (parseInt(feng) * 60 + parseInt(miao)) * 1000;
        var need = times - all;
        console.log(feng + "        " + miao);
        console.log(all + "        " + need);
        console.log(times);
        flagg = 1;
        }
        else{
        need = times;
        }

        if (need < 0) {
            // console.log("error");
            flagg = 0;
            return 0;
        }
        return need
    }



    const info = $("        <div\n" +
                   "            class='alert alert-success'\n" +
                   "            style='\n" +
                   "               border-color: transparent transparent #cccccc;\n"+
                   "                height: 80px;\n" +
                   "                width: 250px;\n" +
                   "                border-radius: 19px;\n" +
                   "                position: absolute;\n" +
                   "                right: 550px;\n" +
                   "                top: 65px;\n" +
                   "                margin-bottom: 0;\n" +
                   "            '\n" +
                   "        >\n" +
                   "            <button type='button' class='close' data-dismiss='alert'>&times;</button>\n" +
                   "            <strong style='display: block; margin-bottom: 5px; text-align: center'>提示!</strong>\n" +
                   "            <div>因为服务器原因，页面显示的时间是错误的,不影响正常挂机。</div>\n" +
                   "            <div style='text-align: center'><button class='btn btn-info start'>一键挂课</button> <button class='btn btn-info start2'>自定义时间</button></div>\n" +
                   "        </div>")
    $("html").append(info)

    var access = document.querySelector(".page-title .icon-dashboard");
    if (access){
        var msg = "本插件所提供的信息，只供参考学习交流。特此申明！\n由此引起的一切后果均须自行承担责任，与插件无关。\n         请问是否继续~";
    }
    if (confirm(msg)==true){
    }else{
        alert("退出成功")
    }
    $(".start").click(() => {

        start();
    })
    $(".start2").click(() => {

        times=prompt("请输入所观看时间（单位：分钟）");
        console.log(times)
        if (times <= 0 && times == null){
            return alert("时间输入错误！！！");
        }
        else{
            times = times*60*1000 + 30000;
            start();}

    })

})();