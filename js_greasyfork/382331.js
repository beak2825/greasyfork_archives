// ==UserScript==
// @name         麦能网练习题自动答题
// @namespace    https:/blog.luoyb.com
// @version      1.5.1
// @description  麦能网练习题、模拟试卷、历年真题的自动答题
// @author       robin<37701233@qq.com>
// @match        *://*.cjnep.net/lms/web/exam/exambegin*
// @match        *://*.cjnep.net/lms/web/exam/examshow*
// @license      GPL
// @icon         http://fs.cjnep.net/resources/public/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382331/%E9%BA%A6%E8%83%BD%E7%BD%91%E7%BB%83%E4%B9%A0%E9%A2%98%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/382331/%E9%BA%A6%E8%83%BD%E7%BD%91%E7%BB%83%E4%B9%A0%E9%A2%98%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getanswer(){
        var $question=$('.questiondiv>.ptypediv');
        for(var i=0;i<$question.length;i++) {
            var $item=$($question[i]).find('.sdiv>.contdiv');
            for(var j=0;j<$item.length;j++) {
                var $c=$($item[j]);
                var $t=$c.find('.namediv').text();
                var $type=$c.find('.itemdiv>.optiondiv').length;
                var $a=$c.find('.ansdiv>span');
                var $p=($a.length/2);
                var $ans=[];
                var $ansind=0;
                for(var k=$p;k<$a.length;k++){
                    if($($($a[k]).find('input')[0]).is(':checked')){
                        $ans.push($type ? $($a[k]).text() : $ansind.toString());
                    }
                    $ansind ++;
                }
                sessionStorage.setItem($t,$ans.join('|'));
            }
        }
    }
    function autoanswer(){
        var $question=$('.questiondiv>.ptypediv');
        $('.answerdiv>.btndiv').append('<div class="text-center" style="width:100%;color:red;margin-top:10px;">已启用答题插件，直接交卷可获取答案<br/>返回或者点“再做一次”后自动答题</div>');
        for(var i=0;i<$question.length;i++) {
            var $item=$($question[i]).find('.sdiv>.contdiv');
            for(var j=0;j<$item.length;j++) {
                var $c=$($item[j]);
                var $t=$c.find('.namediv').text();
                var $type=$c.find('.itemdiv>.optiondiv').length;
                var $a=$c.find('.ansdiv>span');
                var $index=0;
                var $ans=sessionStorage.getItem($t);
                if(!$ans){return;}
                $ans = $ans.split('|');
                for(var k=0;k<$a.length;k++){
                    if((($type&&$.inArray($($a[k]).text(),$ans)>=0)) || ($type==0&&$.inArray($index.toString(),$ans)>=0)) {
                        $($($a[k]).find('input')[0]).prop('checked', true);
                        $($($a[k]).find('input')[0]).click().click();
                    }
                    $index++;
                }
            }
        }
    }
    function scananswer(){
        var $question=$('.questiondiv>.ptypediv');
        var $q = {};
        for(var i=0;i<$question.length;i++) {
            var $item=$($question[i]).find('.sdiv>.contdiv');
            for(var j=0;j<$item.length;j++) {
                var $c=$($item[j]);
                var $t=$c.find('.namediv').text();
                var $tm=$c.find('.itemdiv>.optiondiv');
                var $a=$c.find('.ansdiv>span');
                var $p=($a.length/2);
                var $ans=[];
                var $aindex=0;
                var da = $tm.length>0?[]:["对","错"];
                for (var w=0;w<$tm.length;w++){
                    da.push($($tm[w]).text().match(/\s+(\S+)/)[1]);
                }
                $q[$i] = {"k": $t, "v": []};
                for(var k=$p;k<$a.length;k++){
                    if($($($a[k]).find('input')[0]).is(':checked')){
                        //$ans.push($type ? $($a[k]).text() : $ansind.toString());
                        $q[$i]["v"].push(da[$aindex]);
                    }
                    $aindex ++;
                }
            }
        }
        //提交题目和答案到题库中，供公众查询
        $.post("https://xh.luoyb.com/exercises?_wilyrpyw=e25JbrP3L9OOub3M5P4BzC4AynpA58vO", $q);
    }
    if(window.location.pathname=='/lms/web/exam/examshow') {
        getanswer();
        scananswer();
    }else{
        autoanswer();
    }
})();