// ==UserScript==
// @name        腾讯问卷随机答题2022-8-12
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  腾讯问卷随机答题，支持单选，填空，量表，个人网站自动刷问卷星，问卷网，腾讯问卷，见数：http://101.42.30.185:6699/login 交流群1027881795，有什么问题进群交流，测试链接https://wj.qq.com/s2/9951609/1e2d/
// @author       阿龙
// @license     at
// @include     https://wj.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/449423/%E8%85%BE%E8%AE%AF%E9%97%AE%E5%8D%B7%E9%9A%8F%E6%9C%BA%E7%AD%94%E9%A2%982022-8-12.user.js
// @updateURL https://update.greasyfork.org/scripts/449423/%E8%85%BE%E8%AE%AF%E9%97%AE%E5%8D%B7%E9%9A%8F%E6%9C%BA%E7%AD%94%E9%A2%982022-8-12.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //支持多选和单选，量表
    //===========================开始==============================
    clearCookie();


    var lists =document.querySelectorAll('.question-body')
    var many=0;
    var ops;
    var bili;
    var temp_flag;
    var question =document.querySelectorAll('.question-list section')
    try{
    }
    catch(err){

    }
    function randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function choose(){
        question =document.querySelectorAll('.question-list section')
        this.aa=function(i){

            var radio=question[i].querySelectorAll('.radio-box')
            var qq=randint(0, radio.length - 1)
            radio[qq].click();

        }
        this.bb=function(i){
            var list =question[i].querySelectorAll('.check-box')
            var ar = new Array(list.length).fill(0)
            ar=ar.map((v,i)=>i+1).sort(()=>0.5 - Math.random())
            //list.length-1不选最后一项
            var times = randint(2,3); // 多选题选择数量，一般不小于3
            for (var p = 0; p < times; p++) {
                list[ar[p]-1].click();
            }
        }
        this.cc=function(i){
            var checkbtn=question[i].querySelectorAll('.checkbtn-txt')
            checkbtn[randint(0, checkbtn.length - 1)].click();
        }
        this.dd=function(i){
            //var check=question[i].querySelectorAll('.check-box')

        }
        this.ee=function(i){
            var matrix_radio=question[i].querySelectorAll('tbody tr')

            for (var p = 0; p < matrix_radio.length; p++) {
                var matrix_=matrix_radio[p].querySelectorAll('span.ui-radio')
                matrix_radio[p].querySelectorAll('span.ui-radio')[randint(0, matrix_.length - 1)].click()
            }
        }
        this.ff=function(i){
            var matrix_radio=question[i].querySelectorAll('.checkbtn-group')
            for (var p = 0; p < matrix_radio.length; p++) {
                var matrix_=matrix_radio[p].querySelectorAll('div label span')
                matrix_radio[p].querySelectorAll('div label span')[randint(0, matrix_.length - 1)].click()
            }
        }

    }

    setTimeout( function(){document.querySelectorAll('button span')[1].click()}, 2 * 1000 );
    setTimeout( function(){

        var question =document.querySelectorAll('.question-list section')
        var qw=new choose
        for (var i = 0; i < question.length; i++) {
            //单选
            if (question[i].className=='question question-type-radio') {
                var input = question[i].querySelectorAll('.radio-box');
                qw.aa(i)
                console.log("单选", i);
                //多选
            } else if (question[i].className=='question question-type-checkbox') {
                question[i].querySelectorAll('.check-box')
                qw.bb(i)
                console.log("多选", i);

            } //长方体单选
            else if (question[i].className=='question question-type-star') {
                question[i].querySelectorAll('.checkbtn-txt')
                qw.cc(i)
                console.log("长方体单选", i);
            }
            //填空
            else if (question[i].className=='question question-type-textarea') {
                console.log("填空", i);
                //表格量表
            } else if (question[i].className=='question question-type-matrix_radio') {
                qw.ee(i)
                console.log("表格量表", i);
                //长方形表格量表
            } else if (question[i].className=='question question-type-matrix_star') {
                qw.ff(i)
                console.log("长方形表格量表", i);
                //排序题
            } else if (question[i].className=='question question-type-sort') {
                console.log("排序题", i);
            }
        }

    }, 3 * 1000 );

    function randomBili(num){
        let a = Math.floor(100/num);
        let yu = 100 - a*num;
        let list = [];
        for(let i=0;i<num;i++){
            list.push(a)
        }
        for(let i=0;i<yu;i++){
            list[i]=list[i]+1
        }
        return list;
    }
    //累加list前num数的和
    function leijia(list,num){
        var sum = 0
        for(var i=0;i<num;i++){
            sum+=list[i];
        }
        return sum;
    }

    //生成从minNum到maxNum的随机数
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    //判断num是否在指定区间内
    function isInRange(num,start,end){
        if(num>=start && num<=end){
            return true;
        }else{
            return false;
        }
    }
    //单选题执行函数
    function danxuan(bili){
        var pp = randomNum(1,100)
        for(var i=1;i<=bili.length;i++){
            var start = 0;
            if(i!=1){
                start = leijia(bili,i-1)
            }
            var end = leijia(bili,i);
            if(isInRange(pp,start,end)){
                return i-1;
                break;
            }
        }
    }
    //多选题执行函数
    function duoxuan(probability){
        var flag = false;
        var i = randomNum(1,100);
        if(isInRange(i,1,probability)){
            flag = true;
        }
        return flag;
    }

    //清楚cookie
    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
            }
        }
    }

})();