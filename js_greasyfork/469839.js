// ==UserScript==
// @name         食品审批网站优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  食品审批优化!
// @author       You
// @match        http://172.20.234.90:8089/sdfda/jsp/dsp/sdyj/indexOfCity.jsp
// @icon         https://www.google.com/s2/favicons?domain=234.90
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469839/%E9%A3%9F%E5%93%81%E5%AE%A1%E6%89%B9%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469839/%E9%A3%9F%E5%93%81%E5%AE%A1%E6%89%B9%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    1、移除弹窗公告
    2、自动点开【业务办理】-【代办业务】，【业务查询】
    3、自动搜索待打证列表
    4、导出数据自动选择区划、当天时间   
    */
    $("#showMsgDiv")[0].remove();
    //console.log("移除弹窗公告~");
    //  window.onload = function(){

    removeAd();


    function removeAd(){

         if($("#1")[0] == undefined){
            setTimeout(function(){
                removeAd();
            },100);
        }else{
            $("#1")[0].onclick();

            openTag();

        }
    }
    function openTag(){
        //依次打开【业务查询】；【业务办理】-【代办业务】
        $('.l-tree-node-anchor')[1].click();
        $('.l-tree-node-anchor')[0].click();
        $('.l-tree-node-anchor')[1].click();
        find(0);
    }


    function find(){
        //自动搜索待打证列表

        if(window.frames["frame1"].contentDocument.getElementById("curActName") == undefined){
            setTimeout(function(){
                find();
            },100);
        }else{
            console.log(window.frames["frame1"].contentDocument.getElementById("curActName").value = "打证");
            window.frames["frame1"].contentDocument.getElementsByTagName("button")[0].click();
            console.log("搜索待打证列表~");

        }
    }
    //*******************导出数据自动选择区划、当天时间************************
    //增加导出按钮
    var setExport_a = document.createElement('a');
    setExport_a.id = "3";
    setExport_a.className = "titleWords";
    setExport_a.style = "cursor:pointer;";

    $("#menu")[0].appendChild(setExport_a);
    //console.log("导出按钮");
    var setExport_div = document.createElement('div');
    setExport_div.className = "titleBg";
    setExport_div.textContent = "导出";
    //setExport_div.style = "color: rgb(255, 255, 255)";
    $("#3")[0].appendChild(setExport_div);
    setExport_a.onclick = function(){
        getExport();

    }
    function getExport(){
        if($("#0")[0] == undefined){
            setTimeout(function(){
                getExport();
            },100);
        }else{
            $("#0")[0].onclick();

            $('.l-tree-node-anchor')[0].click();
            $('.l-tree-node-anchor')[2].click();
            setInArea();

        }
    }
    function setInArea(){

        if( window.frames["frame1"].contentDocument.getElementById("inArea") == null ){
            setTimeout(function(){
                setInArea();
            },300);
        }else{
            console.log(window.frames["frame1"].contentDocument.getElementById("inArea").value = "371312");
           // window.frames["frame1"].contentDocument.getElementsByTagName("button")[0].click();
            setTimeout(function(){
                window.frames["frame1"].contentDocument.getElementById("areaName").value = "河东区";
                window.frames["frame1"].contentDocument.getElementById("fzrq").value = new Date();
            },800);

           // console.log("设置区域~");
        }

    }

    //*******************************************




    //  }


})();