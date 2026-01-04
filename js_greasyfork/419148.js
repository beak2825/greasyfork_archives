// ==UserScript==
// @name         合工大（宣）unipus视听说
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动显示答案，并自动填空选择
// @author       FZxiao
// @match        http://10.111.100.201/book/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/419148/%E5%90%88%E5%B7%A5%E5%A4%A7%EF%BC%88%E5%AE%A3%EF%BC%89unipus%E8%A7%86%E5%90%AC%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/419148/%E5%90%88%E5%B7%A5%E5%A4%A7%EF%BC%88%E5%AE%A3%EF%BC%89unipus%E8%A7%86%E5%90%AC%E8%AF%B4.meta.js
// ==/UserScript==

var scriptt =String($("html").html());
var str = "^"
var str2= "'"
var num1 = scriptt.lastIndexOf("judge");
var num5 = scriptt.indexOf(str,num1);
var num2 = scriptt.lastIndexOf(str2,num5);
var num3 = scriptt.indexOf(';',num5);
var num4 = scriptt.lastIndexOf(str,num3);
num4 = num4 + 2;
var script2 = scriptt.slice(num2,num4);
console.log( num1,num2,num3,num4 ); // output alert(1);
if(scriptt.indexOf("judgeCompletion") !== -1) {
    var judgeRe = /judgeCompletion\(([^\n]+?)\)/;
    var ans = scriptt.match(judgeRe)[0];
    ans = ans.replaceAll("'", "")
    ans = ans.split(",")[2];
    console.log(ans);
    var ansList = ans.split("#^");
    script2 = ans;
    $(".content-div input[name^=Item_]").each((i, e) => {$(e).val(ansList[i])})
} else {
    var inputList = $(".question input");
    var inputResultList = [];
    for(let i = 0; i<=inputList.length-3; i += 4) {
        inputResultList.push(inputList.slice(i, i+4));
    }
    var ansList = script2.replaceAll("'", "").split("^");
    var options = {
        "A": 0,
        "B": 1,
        "C": 2,
        "D": 3
    }
    for(let i=0; i<ansList.length; i++) {
        let option = options[ansList[i]];
        console.log(option);
        $(inputResultList[i][option]).attr("checked",true);
    }
}
var dialogHtml = '<div id="hint-dialog" style="margin:0px auto;opacity:0.8;padding:5px 10px;position:fixed;z-index: 10001;display: block;bottom:30px;left:55%;color:#fff;background-color:#CE480F;font-size:13px;border-radius:3px;">'+script2+'</div>';
$('#hint-dialog').remove();
$('body').append(dialogHtml);