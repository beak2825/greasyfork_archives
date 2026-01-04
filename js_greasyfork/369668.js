// ==UserScript==
// @name         松田教务系统评教自动填写
// @namespace   
// @version      0.1
// @description  评教的成绩不能重复，真鸡儿麻烦！
// @author       Finer04
// @match        *://jwxt.sontan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369668/%E6%9D%BE%E7%94%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/369668/%E6%9D%BE%E7%94%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==


var script = document.createElement('script');
script.src = "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);

function GetRandomArr(Min, Max) {

    var array = new Array();
    var cha=Max-Min;
    for (var i = 0; ; i++) {
        if (array.length < cha) {
            var randomNub = Min+(Math.floor(Math.random() * cha));
            if (-1 == $.inArray(randomNub, array)) {
                array.push(randomNub);
            }
        }else{
            break;
        }
    }
    return array;
}


var py = new Array(3)
py[0] = "老师是可以的"
py[1] = "还行吧"
py[2] = "上课讲的还挺认真的"

function autofill(){
    var array=GetRandomArr(60,100);
	var n= parseInt(Math.random()*(2 - 0 + 1)+ 0);
	//$("input[id^=DataGrid1]").val(n);
    $("input[id^=DataGrid1]").each( function(i){
            $(this).eq(0).val(array[i]);
        })
$('#txt_pjxx').val(py[n]);
}

$(function() {

		 $(".footbutton").append(' <button type="button" class="button" id="zido" >自动填写</button>');
    $( "#zido" ).click(function() {
        autofill();
});
	});
