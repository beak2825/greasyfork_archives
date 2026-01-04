// ==UserScript==
// @name         自动填充表单
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  适合后端需要填写表单测试的人员.
// @author       idcpj
// @require      https://cdn.jsdelivr.net/jquery/1.7.2/jquery.min.js
// @match        http://xyd.yongshangju.com/*
// @match        http://www.order.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39164/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A1%A8%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/39164/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A1%A8%E5%8D%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var site = window.location.href;  //获取当前页面
    var yongshangju = /xyd\.yongshangju\.com/i;
    var  order = /www\.order\.com/i;

    //http://xyd.yongshangju.com
    if(yongshangju.test(site)){
        var input = {
        account_name:'代xx1',
        account_mobile:'1375747xxxx', // 手机号
        id_number:'341221198xxxxxxxxx', //身份证
        card_number:'622848031812xxxxx', //银行卡
        loan_amount:100,
        loan_term:10,
        loan_date:'2017-10-22'
        //  select1:"选项1",   可能存在选择不到的问题，可以选择使用option的值来辅助

        };
        //select 的值
        var  select = {
            occupation:'JUNIOR',
        };

    }

    //http://www.order.com/*
    if(order.test(site)){
        var input = {
        account_name:'代xx2',
        account_mobile:'1375747xxxx', // 手机号
        id_number:'341221198xxxxxxxxx', //身份证
        card_number:'622848031812xxxxx', //银行卡
        loan_amount:100,
        loan_term:10,
        loan_date:'2017-10-22'

        };
    }





    function phone(){
        return '1572'+num(1000000,9999999);
    }

    function cardno(){
        return '622848'+num(1000000000000,9999999999999);
    }

    function idcard(){
        return '330682'+num(100000000000,999999999999);
    }

    function name(){
        return randomName();
    }

    function str(){
        return  randomWord(true,23,30);
    }


    // Your code here...
    $(document).ready(function() {
        $('body').prepend('<input type="button" value="button" id="button">');
        $("#button").on("click", function(){
            //对input进行操作
            Object.keys(input).forEach(function(key){
                $("input[name='"+key+"']").val(input[key]);
            });

            //对select进行操作
            Object.keys(select).forEach(function(key){
                $("select[name='"+key+"']").val(select[key]);
            });

        });
    });





    //生成从minNum到maxNum的随机数
    function num(minNum,maxNum){
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

    //输出随机字符  randomWord(true,30,40)  或  randomWord(false,30);
    function randomWord(randomFlag, min, max){
        var str = "",
            range = min,
            pos='',
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if(randomFlag){
            range = Math.round(Math.random() * (max-min)) + min;
        }
        for(var i=0; i<range; i++){
            pos = Math.round(Math.random() * (arr.length-1));
            str += arr[pos];
        }
        return str;
    }

    //姓名 ,randomName(3) 生成随机中文字符
    function randomName(min = 1){
        var str = "",
            range = min,
            pos='',
            arr =[ '戚淑慧', '余雅晗', '窦欣汝', '潘亦菲', '马涵越', '喻欣源', '孟登元', '鱼彰', '周瑞堂', '赵子璇', '柏忠林', '史佳琪', '席准', '方抑', '乌泔', '苗鲁', '孟候依', '吕东东','邹文杰', '卫昊轩',];

        for(var i=0; i<range; i++){
            pos = Math.round(Math.random() * (arr.length-1));
            str += arr[pos];
        }
        return str;
    }




})();