// ==UserScript==
// @name         多账号一键登录，支持微信公众平台、QQ小程序平台
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  多账号一键快速登录，无需手动输入账号密码，解放您的双手和键盘！操作原理是先配置好账号密码列表，点击按钮程序智能自动登录。
// @author       linguifa
// @match        https://mp.weixin.qq.com/*
// @match        https://q.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386763/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95%EF%BC%8C%E6%94%AF%E6%8C%81%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E3%80%81QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/386763/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95%EF%BC%8C%E6%94%AF%E6%8C%81%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E3%80%81QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

/** 数据对象 *********************************************************************************************************************************************/
var datalist;//[ {id:"xxxxx", name:"xxxxx", pwd:"xxxx"} ];
var datakey;//不同平台的数据key

/** 工具方法 *********************************************************************************************************************************************/

function getElementsClass(classnames){
	var classobj= new Array();//定义数组
	var classint=0;//定义数组的下标
	var tags=document.getElementsByTagName("*");//获取HTML的所有标签
	for(var i in tags){//对标签进行遍历
		if(tags[i].nodeType==1){//判断节点类型
			if(tags[i].getAttribute("class") == classnames)//判断和需要CLASS名字相同的，并组成一个数组
			{
				classobj[classint]=tags[i];
				classint++;
			}
		}
	}
	return classobj;//返回组成的数组
}

function addGame() {
	//if (!cookie) cookie = document.cookie; //普通的保存
	//var selected = document.getElementById('multiaccSelect');
	//var defaultText = selected.value ? selected.value : document.title
	var value = prompt('请在输入框输入 游戏名称、登录账号（可以是邮箱/微信号/QQ号/原始ID）、密码三项内容，用逗号分隔', "游戏名称,账号,密码");
	if (!value) return; //空名字不保存

    let values = value.split(",");
    if (values.length != 3) return;
    datalist.push( {id:values[1], name:values[0], pwd:values[2] } );
	localStorage.setItem(datakey, JSON.stringify(datalist));

    switch(datakey){
        case "weixin_datalist": weixin_insertDiv(datalist);
            break;
        case "qq_datalist": qq_insertDiv(datalist);
            break;
    }
}

function deleteAllGame(){
    datalist = [];
    localStorage.setItem(datakey, "[]");

    switch(datakey){
        case "weixin_datalist": weixin_insertDiv(datalist);
            break;
        case "qq_datalist": qq_insertDiv(datalist);
            break;
    }
}

/** 微信平台 *********************************************************************************************************************************************/
//界面
function weixin_addStyle() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.textContent = '\
					.panelDiv{\
						position:relative;\
						height:400px;\
						width: 380px;\
						margin-top: -280px;\
						left: 100px;\
					}\
					#multiaccSelect{\
						width:120px;\
					}\
					.titleBtn{\
						width:40%;\
						color:#ff0000;\
						margin:5px;\
					}\
					.multiaccBtn{\
						margin:5px;\
					}'

	var head = document.head;
	head.appendChild(style);
}

function weixin_insertDiv(list) {
	var panelDiv = document["panelDiv"] || document.createElement('div');
    document["panelDiv"] = panelDiv;
	panelDiv.className = 'panelDiv';

    let str = '';//'<button type=button class=multiaccBtn>12312312</button> ';
    str += "<button type=button class=titleBtn onClick='addGame()'>增加游戏</button>";
    str += "<button type=button class=titleBtn onClick='deleteAllGame()'>清空游戏</button>" + "<br>";
    for(var i=0; i<list.length; i++){
        str += "<button type=button class=multiaccBtn onClick='weixin_autoLogin(\"" + list[i].id + "\",\"" +  list[i].pwd + "\")'>" + list[i].name + "</button>";
        //str += "<div class=multiaccBtn onClick='weixin_autoLogin(\"" + list[i].id + "\",\"" +  list[i].pwd + "\")'>" + list[i].name + "</div>";
    }
	panelDiv.innerHTML = str;

    var div = getElementsClass("banner")[0];
	div.appendChild(panelDiv);
	return div;
}

function weixin_init(){
    //隐藏首页的部分元素，留下空白 用于显示游戏名称
    var a = getElementsClass("banner");
    a[0].style["background"] = "#FFFFFF";
    delete a[0].style["background-image"];

    datakey = "weixin_datalist";
    datalist = JSON.parse(localStorage.getItem(datakey) || "[]")

    weixin_addStyle();
    weixin_insertDiv(datalist);
    window.weixin_autoLogin = weixin_autoLogin;
}

function weixin_autoLogin(id, pwd){
    var a = getElementsClass("weui-desktop-form__input");
    a[0].value = id || "";
    a[1].value = pwd || "";

    //this.$store.state.main
    a[0].dispatchEvent(new Event("input"))
    a[1].dispatchEvent(new Event("input"))

    setTimeout(function(){
        var a = getElementsClass("btn_login");
        a[0].dispatchEvent(new Event("click"))
    }, 50);
}

/** QQ平台 *********************************************************************************************************************************************/
//界面
function qq_addStyle() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.textContent = '\
					.panelDiv{\
						height:220px;\
						width: 380px;\
					}\
					#multiaccSelect{\
						width:120px;\
					}\
					.titleBtn{\
						width:40%;\
						color:#ff0000;\
						margin:5px;\
    					height: 24px;\
    					background: #ffffff;\
    					font-size: 14px;\
					}\
					.multiaccBtn{\
						margin:5px;\
    					height: 24px;\
    					width: 100%;\
    					color: #000000;\
    					background: #ffffff;\
    					font-size: 14px;\
					}'

	var head = document.head;
	head.appendChild(style);
}
function qq_insertDiv(list) {
	var panelDiv = document["panelDiv"] || document.createElement('div');
    document["panelDiv"] = panelDiv;
	panelDiv.className = 'panelDiv';

    let str = '';//'<button type=button class=multiaccBtn>12312312</button> ';
    str += "<button type=button class=titleBtn onClick='addGame()'>增加游戏</button>";
    str += "<button type=button class=titleBtn onClick='deleteAllGame()'>清空游戏</button>" + "<br>";
    for(var i=0; i<list.length; i++){
        str += "<button type=button class=multiaccBtn onClick='qq_autoLogin(\"" + list[i].id + "\",\"" +  list[i].pwd + "\")'>" + list[i].name + "</button>";
        //str += "<div class=multiaccBtn onClick='qq_autoLogin(\"" + list[i].id + "\",\"" +  list[i].pwd + "\")'>" + list[i].name + "</div>";
    }
	panelDiv.innerHTML = str;

    var div = getElementsClass("txt-wrap")[0];
	div.appendChild(panelDiv);
	return div;
}

function qq_init(){
    //隐藏首页的部分元素，留下空白 用于显示游戏名称
    var a = getElementsClass("txt-wrap__inner");
    a[0].parentNode.removeChild(a[0]);

    datakey = "qq_datalist";
    datalist = JSON.parse(localStorage.getItem(datakey) || "[]")

    qq_addStyle();
    qq_insertDiv(datalist);
    window.qq_autoLogin = qq_autoLogin;
}

function qq_autoLogin(id, pwd){
    var a = getElementsClass("login-wrap__input");
    a[0].value = id || "";
    a[1].value = pwd || "";

    //
    a[0].dispatchEvent(new Event("input"))
    a[1].dispatchEvent(new Event("input"))

    setTimeout(function(){
        var a = getElementsClass("login-wrap__button");
        a[0].dispatchEvent(new Event("click"))
    }, 50);
}

/***********************************************************************************************************************************************/

(function() {
    //'use strict';

    window.getElementsClass = getElementsClass; //方便调试
    window.addGame = addGame;
    window.deleteAllGame = deleteAllGame;

    var url = location.href;
    if(url.indexOf("mp.weixin.qq.com/") != -1){ //微信公众平台
        var a = getElementsClass("btn_login");
        if(!a || a.length == 0) return; //非登录页面，不执行下面逻辑

        weixin_init();
    }
    else if(url.indexOf("q.qq.com/") != -1){ //qq轻游戏

        qq_init();
    }

    //setTimeout(weixin_autoLogin, 500);

})();