// ==UserScript==
// @name         获取图书基本信息
// @namespace    https://greasyfork.org/zh-CN/users/301997-qiu6406
// @version      0.1.5
// @description  获取当当、京东、豆瓣图书基本信息，自动复制图书书名、作者、出版社、价格等基本信息到剪贴板;默认页面打开1.5秒后显示“书目信息按钮”
// @author       404566950@qq.com
// @match        http://*.dangdang.com/*
// @match        https://*.dangdang.com/*
// @match        https://*.jd.com/*
// @match        https://book.douban.com/*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/383163/%E8%8E%B7%E5%8F%96%E5%9B%BE%E4%B9%A6%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/383163/%E8%8E%B7%E5%8F%96%E5%9B%BE%E4%B9%A6%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// Your code here...
	function copyBookInfo(content,message){
		var aux = document.createElement("input");
		aux.setAttribute("value", content);
		document.body.appendChild(aux);
		aux.select();
		document.execCommand("copy");
		document.body.removeChild(aux);
        document.getElementById("b-copy").style.backgroundColor = "green";
        document.getElementById("b-copy").value = "复制成功";
		//alert("书目信息已复制到剪贴板，直接粘贴即可");
	}
	function insertButton(T,content){
		var o=document.createElement("input");
         o.id = "b-copy";
		 o.type = "button";
		 o.value = "复制书目信息";
         o.style = "color: #fff; background-color: #5bc0de;border-color: #46b8da;  display: inline-block;margin-bottom: 0;font-weight: @btn-font-weight;text-align: center;vertical-align: middle;touch-action: manipulation;cursor: pointer;background-image: none; border: 1px solid transparent;white-space: nowrap;";
         o.addEventListener("click",copyBookInfo.bind(this,content));
         T.appendChild(o);
		 //o = null;
	}
	function getBookInfo(){
		var tempStr,title,author,pub,isbn,price,format,wrap;
		var url = location.href;
		if(url.indexOf("dangdang.com")>0){
			//当当网
			title = document.getElementsByTagName("h1")[0].innerText;
			author = document.getElementById("author").innerText.substring(3);
			pub = document.getElementsByClassName("t1")[1].innerText.substring(4);
			tempStr = document.getElementsByClassName("key clearfix").item(0).innerHTML;
			isbn = tempStr.substring(tempStr.indexOf("国际标准书号ISBN：")+11,tempStr.indexOf("国际标准书号ISBN：")+24);
			price = document.getElementById("original-price").innerText;
            format = tempStr.substring(25,28);
            wrap = tempStr.substring(57,59);
            Str = title+","+author+","+pub+","+isbn+","+price+","+format+","+wrap;
			insertButton(document.getElementsByClassName("name_info")[0],Str);
			//提示框样式1,如需使用注释样式2
			//prompt("基本信息",title+","+author+","+pub+","+isbn+","+price);
			//提示框样式2，如需使用注释样式1
			//alert(title+","+author+","+pub+","+isbn+","+price);
		};

		if(url.indexOf("jd.com")>0){
			//京东
			title = document.getElementsByClassName("sku-name")[0].innerText;
			author = document.getElementById("p-author").innerText;
			if(document.getElementById("page_origin_price")==null) {price = document.getElementById("page_hx_price").innerText;}
            else {price = document.getElementById("page_origin_price").innerText;}
			pub = document.getElementsByClassName("parameter2")[0].childNodes[1].title;
			isbn = document.getElementsByClassName("parameter2")[0].childNodes[3].title;
            format = document.getElementsByClassName("parameter2")[0].childNodes[11].title;
            wrap = document.getElementsByClassName("parameter2")[0].childNodes[13].title;
			Str = title+","+author+","+pub+","+isbn+","+price+","+format+","+wrap;
			insertButton(document.getElementsByClassName("sku-name")[0],Str);
			//提示框样式1,如需使用注释样式2
			//prompt("基本信息",title+","+author+","+pub+","+isbn+","+price);
			//提示框样式2，如需使用注释样式1
			//alert(title+","+author+","+pub+","+isbn+","+price);
		};

		if(url.indexOf("douban.com")>0){
			//豆瓣
			var info,infoObj,filter,Str;
			//filter = new RegExp('[\[\]\|\`\(\)]','g');
			info = '{'+document.getElementById("info").innerText.replace(new RegExp('\n','gm'),',').replace(new RegExp(',','g'),'","').replace(new RegExp(':','g'),'":"').replace(new RegExp('^'),'"').replace(new RegExp(',"$'),'')+'}';
			infoObj = eval("("+info+")");
			infoObj.title = document.getElementsByTagName("H1")[0].innerText;
			Str = infoObj.title+","+infoObj.作者+","+infoObj.出版社+","+infoObj.ISBN+","+infoObj.定价+","+infoObj.装帧;
			insertButton(document.getElementById("info"),Str);
			//提示框样式1,如需使用注释样式2
			//prompt("基本信息",infoObj.title+","+infoObj.作者+","+infoObj.出版社+","+infoObj.ISBN+","+"￥"+infoObj.定价);
			//提示框样式2，如需使用注释样式1
			//alert(infoObj.title+","+infoObj.作者+","+infoObj.出版社+","+infoObj.ISBN+","+infoObj.定价);
		};
	}
	/*页面完全加载完成后，弹出提示框，T设置为1；页面加载即执行T设置为0。建议在当当网站设置为0，京东设置为1
	var T=1;
	if(T==1)window.onload = (event) => {getBookInfo();}
	else getBookInfo();*/
    //网页打开后1.5秒执行，可根据实际网速情况调整
    setTimeout(getBookInfo,1500);
})();