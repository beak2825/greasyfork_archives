// ==UserScript==
// @name         湖科职教务评分助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  点击进入评分系统，默认为A，一秒评完。
// @author       biubiu
// @match        http://*/*
// @include      http://210.42.171.165/*
// @include      https://210.42.171.165/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418340/%E6%B9%96%E7%A7%91%E8%81%8C%E6%95%99%E5%8A%A1%E8%AF%84%E5%88%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418340/%E6%B9%96%E7%A7%91%E8%81%8C%E6%95%99%E5%8A%A1%E8%AF%84%E5%88%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//联系我 q 2970024051

var grade;//1为A ，2为B， 3为C ，4为随机 ABC
var isgra = 0;

function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg)){
    return unescape(arr[2]);
}else{
    return null;
}
}
var getcook = getCookie('key');
if(getcook == null || getcook.length == 0){
    grade = prompt("请输入评分\n 1 为 A ， 2为 B，3 为 C， 4 为 ABC 随机,输入其他默认为 1 （A）:\n如果要重新设置，请关闭窗口重试（或者清空 cookie  key的值）", "");
//    cou =document.getElementsByClassName("sub")[2].getElementsByTagName("li").length;
    if(grade == 1 || grade == 2 || grade == 3 || grade == 4 ){
        if(grade == 4){
            document.cookie = "key=random";
        }else{
            document.cookie = "key="+grade;
        }
    }else{
        grade = 1;
        document.cookie = "key=true";
    }
}else{
    if(getCookie("key") == "true") {
        grade =1;
    }else if(getCookie("key") == "random"){
        grade = 4;
    }else{
        grade = getCookie("key");
    }
}
(function() {

  var btn=document.createElement("BUTTON");
    btn.id="btn";
    document.body.appendChild(btn);
	btn.style.position="sticky";
    btn.style.height="50px";
	btn.style.width="100px";
	btn.style.zIndex="9999";
	btn.innerText="开始";
    document.getElementById("btn").onclick=function(){
		var tb = document.getElementById("DataGrid1");
		var rows = tb.rows;
            for(var i=1;i<rows.length;i++){
                var name = rows[i].querySelector("select").id;
                if(getCookie('key') == "random"){
                    grade = parseInt(Math.random()*(3-1+1)+1,10);
                    isgra = 1;
                }

                document.getElementById(name).options[grade].selected = true;
            }
		btn.innerText="评分结束";
	}
})();
