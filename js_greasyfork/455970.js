 // ==UserScript==
 // @name        testtest
 // @match       *://*.baidu.com/*
 // @license     Apache 2.0
 // @description testtest01
// @version 0.0.1.20221204051349
// @namespace https://greasyfork.org/users/702964
// @downloadURL https://update.greasyfork.org/scripts/455970/testtest.user.js
// @updateURL https://update.greasyfork.org/scripts/455970/testtest.meta.js
 // ==/UserScript==
 var a;
        // console.log(a);
        if(typeof a == "underfined"){
            console.log(a);

        }
        //您可以检查 constructor 属性以确定对象是否为日期（
        function isDate(myDate){
            return myDate.constructor.toString().indexof("Date")>-1


        }
        //您可以检查 constructor 属性以确定对象是否为日期（
        function changeP(){
            var p =document.getElementById("demo").innerHTML("hello world");
        }
        // 本例查找所有 <p> 元素
        function getAllP(){
            var Ps = document.getElementsByTagName("p")
        }
        // 本例查找 id="main" 的元素，然后查找 "main" 中所有 <p> 元素：
        function getPbymain(){
            var p = document.getElementBy("id");
            var y =x.getElementsByTagName('p')
        }
        function testForm(){
            var x = document.forms["frm1"];
            var text ="";
            var i;
        for(i=0;i<x.length;i++){
            text += x.elements[i].value+"<br>"
        }
        document.getElementById("demo").innerHTML = text;
        }
        function testPromot(){
            prompt("请输入一个数字");
        }
        