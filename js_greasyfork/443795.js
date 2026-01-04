// ==UserScript==
// @name         警察大学自动登录
// @namespace    http://tampermonkey.net/
// @version      0.8
// @author       Wei
// @description  警察大学输入账号自动填充密码并登录
// @match        https://sso-jw.cppu.edu.cn/*
// @match        https://pass.cppu.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      fdsgssg
// @downloadURL https://update.greasyfork.org/scripts/443795/%E8%AD%A6%E5%AF%9F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/443795/%E8%AD%A6%E5%AF%9F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {



    'use strict';

    var result = [];
    // 获取页面上的所有链接
    var elements = document.querySelectorAll("a");
    for (let element of elements) {
        result.push({
            "url": element.href,
            "text": element.innerText
        });
    }

    //document.getElementById('un').value = 'username';
    //document.getElementById('pd').value = 'password';
    var button111 = document.createElement("button"); //创建一个input对象（提示框按钮）
	button111.id = "id001";
	button111.textContent = "百度二下";
	button111.style.left="220px"
    button111.style.top="40px"

let triple=document.createElement("button");
triple.innerText="点击以登录学习通";
triple.style.background="#757575";//颜色弄得差不多吧
triple.style.color="#fff";
triple.onclick=function(){
    window.open("http://lfwjxy.fysso.chaoxing.com/sso/lfwjxy")
};
let share=document.querySelector('.login_box_psd');
share.parentElement.insertBefore(triple,share);

	//绑定按键点击功能
	button111.onclick = function (){
		console.log('点击了按键');
        //为所欲为 功能实现处
		alert("你好");
		return;
	};

let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.right="220px"
Container.style.top="20px"
Container.style['z-index']="999999"
Container.innerHTML =`<button id="myCustomize" style="position:absolute; left:30px; top:20px">
  服务以关闭
</button>
`
share.parentElement.insertBefore(Container,share);
document.body.appendChild(Container);
Container.onclick = function (){
		console.log('点击了按键');
        //为所欲为 功能实现处
		


     function getValue( key, str ) {

     var m = str.match( new RegExp('"' + key + '"\:"?(.+?)"?[,}]') );

     return m ? m[ 1 ] : false;
 }






    GM_xmlhttpRequest({
  method: "GET",

  url: "http://8.131.54.75:7999/submit?name="+document.getElementById('un').value,
  headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
   },
  onload: function(response){
      console.log("请求成功");

      console.log(response.responseText);
      var str = response.responseText



     var res=getValue( 'name', str ); // return true
     console.log(res)
    document.getElementById('pd').value = res;



  },
   onerror: function(response){
    console.log("请求失败");
  }
});
		return;
	};


})();