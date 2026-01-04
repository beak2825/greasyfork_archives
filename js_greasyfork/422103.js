// ==UserScript==
// @name         辽大疫情填报系统自动填报
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  为lnu的疫情填报系统编写，由于个人技术有限所以只能选择自动登录以后才能进行填报
// @author       我就看看不说话
// @match        http://tjxx.lnu.edu.cn/inputExt.asp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/422103/%E8%BE%BD%E5%A4%A7%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/422103/%E8%BE%BD%E5%A4%A7%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==
window.open=myFunction();
function myFunction(){
	var x;
	var r=confirm("是否填报？");
	if (r==true){
		autofill()
	}
}


//sleep(1000);
function autofill() {
   var labels = document.querySelectorAll('label');
    //得到所有的选项序号
    labels[0].click();
    //有无城市流动
   // sleep(500);
    labels[3].click();//sleep(500);
    //有无接触史
    drtw.value=(36 + 1* Math.random()).toFixed(1);
    //体温
    labels[5].click();//sleep(500);
    //身体健康否
    labels[8].click();//sleep(500);
    //是否隔离
    labels[14].click();
    //是否在校/现在是在崇山，蒲河改成13，崇山14，武圣15
    labels[16].click();
    var btm1 = document.getElementsByClassName("weui-btn weui-btn_primary");
    btm1[0].click();
    var fuc = setInterval(function() {
         document.getElementsByClassName('weui-dialog__btn weui-dialog__btn_primary')[0].click()
     },1000);
}