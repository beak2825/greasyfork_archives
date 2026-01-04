// ==UserScript==
// @name         科泰显示全部车厢
// @namespace    http://corta.com/
// @version      1.21
// @description  因为科泰软件切换当前空调不太方便，使用该导航插件后可轻松选择车厢，创建日期2019.7.10
// @author       Corta
// @grant        none
// @include      *10.5.1.*
// @downloadURL https://update.greasyfork.org/scripts/387398/%E7%A7%91%E6%B3%B0%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E8%BD%A6%E5%8E%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/387398/%E7%A7%91%E6%B3%B0%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E8%BD%A6%E5%8E%A2.meta.js
// ==/UserScript==

(function() {
      'use strict';
    //创建选择列车提示
        var Textarea = document.createElement("p");
    Textarea.innerHTML= "在下列选择你需要的车厢:";
    //创建一个div
    var TrainBoxdiv = document.createElement("div");
    //为div创建属性class = "trainbox"
    var TrainBoxdivattr = document.createAttribute("class");
    TrainBoxdivattr.value = "trainbox";
    //把属性class = "trainbox"添加到div
    TrainBoxdiv.setAttributeNode(TrainBoxdivattr);
	//开始创建按钮，共6个
    for(var i=1;i<7;i++){

		//创建车厢号文字序列
		
        var trainnumber=["0","TC1","MP1","M1","M2","MP2","TC2"];


		//创建超链接序列
		var TrainLink = trainnumber[i] + "Link";
		window[TrainLink] = document.createElement("a");
		//给超链接添加class名
		var TrainLinkAttr = trainnumber[i] + "LinkAttr";
		window[TrainLinkAttr] = document.createAttribute("class");
		window[TrainLinkAttr].value = trainnumber[i] + "Link";
		window[TrainLink].setAttributeNode(window[TrainLinkAttr]);
		//给链接赋车厢号文字
		window[TrainLink].innerHTML=trainnumber[i];
		//给超链接赋目标连接
		var TrainLinkHerfArry = ["0","10.5.1.27","10.5.1.28","10.5.1.29","10.5.1.30","10.5.1.31","10.5.1.32"];
		var TrainLinkHrefID =trainnumber[i]+"TrainLinkHref";
		window[TrainLinkHrefID]=document.createAttribute("href");
		window[TrainLinkHrefID].value="http://"+TrainLinkHerfArry[i];
		window[TrainLink].setAttributeNode(window[TrainLinkHrefID]);
		//将超链接追加到div
        TrainBoxdiv.appendChild(window[TrainLink]);
		
        //给链接添加样式
        window[TrainLink].style.height = "40px";
        window[TrainLink].style.width = "70px";
		window[TrainLink].style.margin = "3px";
        window[TrainLink].style.cursor = "pointer";
		window[TrainLink].style.backgroundColor = "#83f0e0";
		window[TrainLink].style.lineHeight = "40px";
		window[TrainLink].style.display = "inline-block";
		window[TrainLink].style.boxShadow = "2px 2px 4px #61a2f5";
    }

    //为div添加样式
    var style = document.createAttribute("style");
    TrainBoxdiv.setAttributeNode(style);
    TrainBoxdiv.style.backgroundColor = "rgb(162, 76, 200)";
    TrainBoxdiv.style.borderWidth = "20px";
    TrainBoxdiv.style.borderColor = "#000";
    TrainBoxdiv.style.width = "456px";
    TrainBoxdiv.style.height = "60px";
     TrainBoxdiv.style.marginLeft = "30%";
    TrainBoxdiv.style.marginBottom = "1%";

    //给Textarea添加样式
    Textarea.style.marginLeft = "30%";
    Textarea.style.backgroundColor = "#f359ff";
    Textarea.style.width = "456px";
    Textarea.style.marginTop = "1%";
	
         //把div追加到body
    var first=document.body.firstChild;//得到页面的第一个元素
	
     document.body.insertBefore(Textarea,first);//在得到的第一个元素之前插入
     document.body.insertBefore(TrainBoxdiv,first);//在得到的第一个元素之前插入
})();