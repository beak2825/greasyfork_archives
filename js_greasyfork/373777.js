// ==UserScript==
// @name         尚景400号码评分
// @namespace    caca
// @version      0.1
// @description  尚景400号码自动评分
// @author       caca
// @match        http://www.400cx.com/agent/userOccupy.do*
// @downloadURL https://update.greasyfork.org/scripts/373777/%E5%B0%9A%E6%99%AF400%E5%8F%B7%E7%A0%81%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/373777/%E5%B0%9A%E6%99%AF400%E5%8F%B7%E7%A0%81%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var goodsphone = new Array("8", "6");//+2分的号
    var highphone = new Array("9","5");//+1分的号
    var mediumphone = new Array("0", "1", "7","5");//+0分的号
    var lowphone = new Array( "2", "3");//-1分的号
    var poorphone = new Array("4");//-2分的号
    var _400 = /^400(\w{7})$/;//400验证规则
    var _GuH = /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/;//固话验证规则
    var _Phone = /^1[35789]\d{9}$/;//手机验证规则

    function prepare(str){

        str = str.replace(/-/g, '');//替换-为空
        if (_400.test(str) || _GuH.test(str) || _Phone.test(str)) {
            if (_400.test(str)) {//1.出现某个数字进行递加
                str = str.substr(4, str.length - 1);
            }
            else if (_GuH.test(str)) {
                if (str.length == 11) {
                    str = str.substr(3, str.length - 1);
                }
                else if (str.length == 12) {
                    str = str.substr(4, str.length - 1);
                }
            }
            else if (_Phone.test(str)) {

            }
        }
        return str;
    }

    function getScore(str)
    {

        var score=0;



        for (var i = 0; i < goodsphone.length; i++) {
            if(str.indexOf(goodsphone[i])>-1){
                score += 2*(10+i);
            }
            else if(str.indexOf(highphone[i])>-1){
                score+=1*(10+i);
            }
            else if(str.indexOf(lowphone[i])>-1){
                score-=1*(10+i);
            }
            else if(str.indexOf(poorphone[i])>-1){
                score-=2*(10+i);
            }
            else  if(str.indexOf(poorphone[i])>-1){
                score += 0;
            }
        }
        return Math.round(score/20);
    }
    //1.2返回重复出现次数及个数
    function getCount(arr) {
        var obj = {};
        var count=0;
        for (var i = 0 ; i < arr.length; i++) {
            if (obj[arr[i]])
                obj[arr[i]]++;
            else{
                obj[arr[i]] = 1;
                count++;
            }
        }


        return 6-count;
    }
    //$("#type").after("<input id=\"sf\" value=\"2\" placeholder=\"根据评分筛选\" />");


    $("div .liebiao1").attr("id","table");

    for(var i=0;i<10;i++){
        $("#table").after($("#table").clone().attr("id","table"+i));
    }


    //$("#table1").after();

    $("div .liebiao2").each(function(i){
        //alert(i);

        var phone=prepare( $(this).find("nobr").text().trim());
        var score = getScore(phone)+getCount(phone);

        //console.log($(this).find("nobr").text().trim() + " | " + score);

        $(this).find("nobr").text($(this).find("nobr").text().trim() + "  | ( " + getScore(phone) +" + "+getCount(phone)+" )");
        $(this).removeAttr("onmouseover").removeAttr("onmouseout");

        if(score >=10){
            $("#table").after($(this));
        }
        else if(score >0){
            $("#table"+score).after($(this));
        }
        else{
            //$("#table0").after($(this));
            $(this).remove();
        }
    });

})();