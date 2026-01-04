// ==UserScript==
// @name         群众文化云后台优化by开州区文化馆
// @namespace    http://tampermonkey.net/
// @version      23.5.30
// @description  创图群众文化云后台优化by开州区文化馆
// @author       Dannial_Lu
// @match      http://chongqingstore.ctwenhuayun.cn/*
// @match      http://chongqingct.ctwenhuayun.cn/*
// @match      http://cqchinact.ctwenhuayun.cn/*
// @match      http://chongqingyd.ctwenhuayun.cn/*
// @match      http://www.cqqyg.cn/*
// @match      https://www.cqqyg.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447247/%E7%BE%A4%E4%BC%97%E6%96%87%E5%8C%96%E4%BA%91%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96by%E5%BC%80%E5%B7%9E%E5%8C%BA%E6%96%87%E5%8C%96%E9%A6%86.user.js
// @updateURL https://update.greasyfork.org/scripts/447247/%E7%BE%A4%E4%BC%97%E6%96%87%E5%8C%96%E4%BA%91%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96by%E5%BC%80%E5%B7%9E%E5%8C%BA%E6%96%87%E5%8C%96%E9%A6%86.meta.js
// ==/UserScript==

(function() {

	var i,j,reg,pList;//常用参数
	var aa,t1;//创建元素用的临时a和text
	var now;
	var win1,win2;
	var inte1,inte2,inte3;

	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
	//addGlobalStyle("#layui-layer-content iframe {height:800px;}");


	function id(x) {
		if (typeof x == "string") return document.getElementById(x);
		return x;
	}
	function classes(x) {
		if (typeof x == "string") return document.getElementsByClassName(x);
		return x;
	}
	function tags(x) {
		if (typeof x == "string") return document.getElementsByTagName(x);
		return x;
	}
	function trim(str) { //删除左右两端的空格
		return str.replace(/(^\s*)|(\s*$)/g, ""); //把空格替换为空
	}
	//获取网页参数
	function getParam(paramName){
		var paramValue = "";
		var isFound = false;
		if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=")>1){
			var arrSource = unescape(this.location.search).substring(1,this.location.search.length).split("&");
			var i = 0;
			while (i < arrSource.length && !isFound){
				if (arrSource[i].indexOf("=") > 0){
					if (arrSource[i].split("=")[0].toLowerCase()==paramName.toLowerCase()){
						paramValue = arrSource[i].split("=")[1];
						isFound = true;
					}
				}
				i++;
			}
		}
		return paramValue;
	}
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]);
		return null;
	}
	const formatTime = (format = "", num = new Date().getTime()) => {
		format = format || "YYYY-mm-dd HH:MM:SS";//第一个参数不填时，使用默认格式
		let ret, date, renum;
		// 处理时间戳，js一般获取的时间戳是13位，PHP一般是10位,根据实际情况做判断处理
		if (num.toString().length == 10) {
			date = new Date(parseInt(num) * 1000);
		} else {
			date = new Date(parseInt(num));
		}
		const opt = {
			"Y": date.getFullYear().toString(), // 年
			"m": (date.getMonth() + 1).toString(), // 月
			"d": date.getDate().toString(), // 日
			"H": date.getHours().toString(), // 时
			"M": date.getMinutes().toString(), // 分
			"S": date.getSeconds().toString() // 秒
			// 目前用的是这六种符号,有其他格式化字符需求可以继续添加，值必须转化成字符串
		};
		for (var k in opt) {
			ret = new RegExp("(" + k + "+)").exec(format);
			if (ret) {
				renum = (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")) //根据复数前面是否补零,如“mm”补零，单“m”前面不补零
				format = format.replace(ret[1], renum)//替换
			};
		};
		return format;
	};

/////////////富文本格式化///////////////
	function formatText(iframe){
		var editorParagraph=iframe.body.getElementsByTagName("p");
		reg=new RegExp("/\S*/");
		for (var ePN=0;ePN<editorParagraph.length;ePN++){
			editorParagraph[ePN].innerHTML=editorParagraph[ePN].innerHTML.replace(/&nbsp;/ig,'');

			//editorParagraph[ePN].innerHTML=editorParagraph[ePN].innerHTML.replace("/(</{0,1}section.*>)/g","");
			if(editorParagraph[ePN].getElementsByTagName("img").length>0 && editorParagraph[ePN].innerText.length>0){
				console.log("图文分段");
				editorParagraph[ePN].innerHTML=editorParagraph[ePN].innerHTML.replace(/(<img.*>)/g,"$1</p><p>");
			}
			if((editorParagraph[ePN].innerHTML.indexOf("<br>")==0)&&(reg.test(editorParagraph[ePN].innerText))){
				editorParagraph[ePN].innerHTML=editorParagraph[ePN].innerHTML.substr(4);
			}
			console.log("去空格");
			if((editorParagraph[ePN].innerHTML.indexOf("<img ")<0)&&(editorParagraph[ePN].outerHTML.indexOf("align")<0)&&(editorParagraph[ePN].innerText.indexOf("　　")!=0)&&(editorParagraph[ePN].innerText.lastIndexOf(":")!=editorParagraph[ePN].innerText.length-1)&&(editorParagraph[ePN].innerText.lastIndexOf("：")!=editorParagraph[ePN].innerText.length-1)&&(editorParagraph[ePN].innerText.trim().length>0)){
				editorParagraph[ePN].innerHTML="　　"+editorParagraph[ePN].innerHTML;
				console.log("加全角空格");
			}
		}

		var editorPics=iframe.body.getElementsByTagName("img");
		for (ePN=0;ePN<editorPics.length;ePN++){
			editorPics[ePN].style.height="auto";
			/*//已在前台调为750px
			if(editorPics[ePN].style.width=="750px"){
				editorPics[ePN].style.width="818px";
			}*/
			editorPics[ePN].style.display="block";
			console.log("改图大小");
		}
	}

	function setIframeHeight(iframe) {
		if (iframe) {
			var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
			if (iframeWin.document.body) {
				iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
			}
		}
	};

//后台左边菜单高度
	addGlobalStyle(".tree li a {padding:1px 0 1px 30px;line-height:17px;height:17px}");
	addGlobalStyle(".logoNei {padding:0px;}");
	//addGlobalStyle(".logoNei .logo {height:60px!important;}");
	addGlobalStyle("div.inline-div{height:35px!important;line-height:40px!important}");
	addGlobalStyle(".logoNei + .left-tree {height:max-content!important;}");
	addGlobalStyle(".logoNei > .logo + .logoName {height:20px;line-height:20px;}");
	//addGlobalStyle(".logoNei > .logo .logoName a {color: #ff8f27!important;}");


	if (window.location.href.indexOf("left.do")>0){
		document.querySelector(".logoNei").innerHTML+="<div class='logoName'>[<a style='color: #ff8f27!important;' href=\"javascript:parent.location.href='/user/kzqwhg/sysUserLoginOut.do'\">退出</a>]</div>"
	}

//裁切照片限定比例
	if(window.location.href.indexOf("/aliOss/cutImg.do")>0){
		var cutImgScript = document.body.getElementsByTagName("script")[0];
		var ResizeScript = cutImgScript.innerText;
		document.body.removeChild(cutImgScript);
		if(window.parent.location.href.indexOf("preAddActivity.do")>0 || window.parent.location.href.indexOf("preEditActivity.do")>0){
			ResizeScript = ResizeScript.replace(".Jcrop({\n",".Jcrop({\n                setSelect: [0,0,800,500],\n                aspectRatio: 160/100,\n");
		}
		//数字展厅上传资源图片横竖铺满
		if((window.parent.location.href.indexOf("preAddInformationDetail.do")>0)||(window.parent.location.href.indexOf("preEditInformationDetail.do")>0)){
			ResizeScript = ResizeScript.replace(".Jcrop({\n",".Jcrop({\n                setSelect: [0,0,4000,4000],\n");
		}
		if((window.parent.location.href.indexOf("ccpInformation/preAddInformation.do")>0)||(window.parent.location.href.indexOf("ccpInformation/preEditInformation.do")>0)){
			if((window.parent.location.href.indexOf("informationModuleId=983ec61f0472404d98116f58992694e4")>0)||
			(window.parent.location.href.indexOf("informationModuleId=983ec61f0472404d98116f58992694e4")>0)||
			(window.parent.location.href.indexOf("informationModuleId=d6c777ad1f624323a7f365f2e308d834")>0)){
				ResizeScript = ResizeScript.replace(".Jcrop({\n",".Jcrop({\n                setSelect: [0,0,750,500],\n                aspectRatio: 150/100,\n");
			}else if((window.parent.location.href.indexOf("informationModuleId=d9c3c3d653444dd281b38eb2b4536b70")>0)||(window.parent.location.href.indexOf("informationModuleId=d9c3c3d653444dd281b38eb2b4536b70")>0)){
				ResizeScript = ResizeScript.replace(".Jcrop({\n",".Jcrop({\n                setSelect: [0,0,800,450],\n                aspectRatio: 16/9,\n");
			}

		}

		if((window.parent.location.href.indexOf("live/addLive.do")>0)||(window.parent.location.href.indexOf("live/editLive.do")>0)){
			ResizeScript = ResizeScript.replace(".Jcrop({\n",".Jcrop({\n                setSelect: [0,0,800,450],\n                aspectRatio: 16/9,\n");
		}

		cutImgScript = document.createElement("script");
		cutImgScript.type = 'text/javascript';
		cutImgScript.text = ResizeScript;
		document.body.appendChild(cutImgScript);
	}

//shua准备
	if(window.location.href.indexOf("chongqingyd.ctwenhuayun.cn/kzqwhg/web")>0){
		var shuadiv=document.createElement("div");
		shuadiv.id="shuadiv";
		shuadiv.style.lineHeight="32px";
		shuadiv.style.paddingLeft="20px";
		var shuaa=document.createElement("span");
		shuaa.style.width="50px";
		shuaa.style.textAlign="center";
		shuaa.addEventListener("click",function(){
			if(window.location.href.indexOf("&shua=yes")>0){
				window.location.href=window.location.href.replace("&shua=yes","");
			}else if(window.location.href.indexOf("?shua=yes")>0){
				window.location.href=window.location.href.replace("?shua=yes","");
			}else if(window.location.href.indexOf("?")>0){
					window.location.href=window.location.href+"&shua=yes";
			}else{
					window.location.href=window.location.href+"?shua=yes";
			}
		});
		shuaa.id="shuaa";
		shuaa.appendChild(document.createTextNode("shua"));
		shuadiv.appendChild(shuaa);
		classes("cityChange")[0].appendChild(shuadiv);
		//id("shuaa").href=window.location.href+"&shua=yes";
	}

//shua开刷
	if(window.location.href.indexOf("shua=yes")>0){
		if(window.location.href.indexOf("web/news/detail.html")>0){
			shuaa=5+Math.floor(Math.random() * 40);
			if(Math.random()>0.5){
				aa=true;
			}else{
				aa=false;
			}
			setTimeout(function(){
				//检测是否存在右边相关推荐
				if(classes("acTuiUlList")[0].getElementsByTagName("a")[0]){
					var timerForShua=setInterval(function(){
						now=new Date().getHours();
						if(now>=7&&now<=21){
							if(aa==true){
								setTimeout(function(){
									i=document.querySelectorAll(".newsRecommend .acTuiUlList a")[2].href.indexOf("?id=");
									j=document.querySelectorAll(".newsRecommend .acTuiUlList a")[2].href.indexOf("&cid=");
									win1=window.open("http://chongqingyd.ctwenhuayun.cn/kzqwhg/infolist/detail.html?id="+document.querySelectorAll(".newsRecommend .acTuiUlList a")[2].href.substring(i+4,j),"cqqygNew1");
								},234);
								setTimeout(function(){win1.close()},1234);
								setTimeout(function(){
									i=document.querySelectorAll(".newsRecommend .acTuiUlList a")[3].href.indexOf("?id=");
									j=document.querySelectorAll(".newsRecommend .acTuiUlList a")[3].href.indexOf("&cid=");
									win2=window.open("http://chongqingyd.ctwenhuayun.cn/kzqwhg/infolist/detail.html?id="+document.querySelectorAll(".newsRecommend .acTuiUlList a")[3].href.substring(i+4,j),"cqqygNew2");
								},345);
								setTimeout(function(){win2.close()},1234);
								aa=false;
							}
							id("shuaa").innerText="sh"+shuaa;
							shuaa-=1;
							//倒数为0，跳转
							if(shuaa==0){
								if(document.querySelectorAll(".newsRecommend .acTuiUlList a")[0].href.indexOf("detail.html")>=0){
									window.location.href=document.querySelectorAll(".newsRecommend .acTuiUlList a")[0].href+"&shua=yes";
								}else{
									//window.location.reload();
								}
							}
						}
					},1000);
				}else{
					setTimeout(function(){
						window.location.reload();
					},5000);

				}
			},2000);

		}else if(window.location.href.indexOf("kzqwhg/web/index.html")>0){
			setTimeout(function(){
				//document.querySelectorAll(".feiBoxUl li")[Math.ceil(Math.random()*3)].click();
			},2048);

		}
	}
//你点我送列表高度
	if(window.location.href.indexOf("outsideOrderList.do")>0){
		addGlobalStyle(".main-content table td{height:45px;}");
	}

//后台搜索直接回车

	var searchBoxs=["organName",//你点我送
							"deptName",//你点我送
							"productName",//你点我送
							"informationTitle",//新闻资讯、数字剧院
							"createUserName",//新闻资讯、数字剧院
							"activityName",//享活动
							"venueName",//享活动
							"searchKey",//订场馆、活动室管理
							"liveActivityName",//看直播
							"name",//非遗
							"spuNumber",//赶大集
							"spuName",//赶大集
							"collectWorksName",//艺创空间
							"drawLotsActivityName",//活动抽签
							"hallName",//数字展厅
							"trainTitle"//培训报名
							];
	for(i=0;i<searchBoxs.length;i++){
		if(document.querySelector(".search > .search-box > #"+searchBoxs[i])){
			document.querySelector(".search > .search-box > #"+searchBoxs[i]).addEventListener("keydown",function (e) {
				// 回车提交表单
				// 兼容FF和IE和Opera
				var theEvent = window.event || e;
				var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
				if (code == 13) {
					document.querySelector(".search > .select-btn > input").click();
				}
			});
		}
	}





//自动选开州区，没用

	if(id("provinceDiv")&&id("cityDiv")&&id("areaDiv")){
		document.querySelector("#cityDiv > #cityId").value="500100000000";
		document.querySelector("#cityDiv > #city").value="市辖区县";
		document.querySelector("#cityDiv > .select2-container > .select2-choice > .select2-chosen").innerText="市辖区县";
		document.querySelector("#areaDiv > #areaId").value="500234000000";
		document.querySelector("#areaDiv > #area").value="开县";
		document.querySelector("#areaDiv > .select2-container > .select2-choice > .select2-chosen").innerText="开县";


	}



//数字展厅上传资源列表限高

	if(window.location.href.indexOf("ccpInformationDetail/ccpInformationDetailIndex.do")>0){
		addGlobalStyle(".main-content tbody tr td img{height:150px;width:auto;}");
	}
//数字展厅上传资源图片横竖铺满

	if((window.location.href.indexOf("ccpInformationDetail/preAddInformationDetail.do")>0)||(window.location.href.indexOf("ccpInformationDetail/preEditInformationDetail.do")>0)){
		setInterval(function(){
			if(document.querySelectorAll("#gao +a +a.easyui-linkbutton").length>0){
				for(i=0;i<document.querySelectorAll("#gao +a +a.easyui-linkbutton").length;i++){
					document.querySelectorAll("#gao +a +a.easyui-linkbutton")[i].click();
					document.querySelectorAll("#gao +a +a.easyui-linkbutton")[i].className=document.querySelectorAll("#gao +a +a.easyui-linkbutton")[i].className.replace("easyui-linkbutton","");
				}
			}

		},1000);

	}


//客流统计默认当前区县//父页面获取      站在客流统计选择报表类型页面的角度
	if(window.location.href.indexOf("/flowRateMenu.do")>0){
		//var selRegion = .contentWindow.document;
		//var region = window.parent.leftFrame.document.getElementsByClassName("logoName")[0].innerText;
		//classes("rightIframe")[0].src
		var flowrateInt=setInterval(function(){
			if(document.getElementsByTagName("iframe")[0].contentWindow.document.querySelectorAll(".selectBoxs .museunChoose #museum li").length>0){
				clearInterval(flowrateInt);
				if(window.parent.leftFrame){
					document.getElementsByTagName("iframe")[0].src+="&region="+escape(window.parent.leftFrame.document.getElementsByClassName("logoName")[0].innerText);
					var flowrateA=classes("leftMenu")[0].getElementsByTagName("a");
					for(i=0;i<flowrateA.length;i++){
						if(flowrateA[i].getAttribute("href").indexOf("flowrate")>0){
							flowrateA[i].addEventListener("click",function(){
									setTimeout(function(){
										document.getElementsByTagName("iframe")[0].src+="&region="+escape(window.parent.leftFrame.document.getElementsByClassName("logoName")[0].innerText);
									},200);
								}
							);
						}
					}
				}
			}
		},2000);
	}

//学才艺列表增加链接
	if(window.location.href.indexOf("mooc/course/myCourseIndex.do")>0){
		for(i=0;i<document.querySelectorAll(".main-content tbody tr").length;i++){
			document.querySelectorAll(".main-content tbody tr")[i].querySelectorAll("td")[1].innerHTML="<a href='http://chongqingyd.ctwenhuayun.cn/kzqwhg/web/szmk/detail.html?id="+document.querySelectorAll(".main-content tbody tr")[i].querySelectorAll("td")[8].querySelectorAll("a")[0].href.substr(17,48)+"'>"+document.querySelectorAll(".main-content tbody tr")[i].querySelectorAll("td")[1].innerText+"</a>";
		}





	}




//客流统计默认当前区县//子页面处理
	if(window.location.href.indexOf("flowrate/")>0){
		if(GetQueryString("region")!=null){
			var regionsLi = document.getElementById("museum").getElementsByTagName("li");
			var regionsLocalLi,regionsElseLi;
			for (i=0;i<regionsLi.length;i++){
				if (regionsLi[i].innerHTML.indexOf(unescape(GetQueryString("region")))>=0){
					regionsLocalLi = regionsLi[i].outerHTML;
					regionsLi[i].parentNode.removeChild(regionsLi[i]);
					regionsElseLi = document.getElementById("museum").innerHTML;
				}
			}
			document.getElementById("museum").innerHTML=regionsLocalLi;
			document.getElementById("museum").getElementsByTagName("li")[0].getElementsByTagName("a")[0].click();
			document.getElementById("museum").innerHTML+=regionsElseLi;
		}
	}


//日期选框可写
	if(tags("input").length>0){
		for(i=0;i<tags("input").length;i++){
			if(tags("input")[i].getAttribute("id")!=null){
				if(tags("input")[i].getAttribute("id").toLowerCase().indexOf("time")>=0){
					tags("input")[i].removeAttribute("readonly");
				}
			}
		}
	}
	if(classes("start-btn2").length>0){
		for(i=0;i<classes("start-btn2").length;i++){
			classes("start-btn2")[i].enable="false";
			classes("start-btn2")[i].addEventListener("mouseover",function () {
				WdatePicker({
					el: 'informationCreateTimeHidden',
					dateFmt: 'yyyy-MM-dd HH:mm:ss',
					position: {left: -160, top: 8},
					isShowClear: true,
					isShowOK: true,
					onpicked: pickedStartFunc1,
					oncleared: clearStartTimeFunc1,
					startDate: document.getElementById("informationCreateTime").value
				})
			})

		}
	}



/*//编辑页面添加审核通过按钮
	if(window.location.href.indexOf("preEditInformation.do")>0){
		var btnsave=document.createElement("button");
		btnsave.setAttribute("style","background-color: #5E75F1;width: 100px;display: inline-block;height:40px;line-height:40px;overflow:hidden;text-align:center;color:#FFFFFF;font-size:14px;font-weight:bold;margin-right:20px;border:none;-webkit-border-radius:4px;cursor:pointer;font-family:'黑体';outline:none;margin-left:60px;");
		btnsave.setAttribute("onclick","shopSwitchAuditFlowPushForward('"+getParam("informationId")+"')");
		var t1=document.createTextNode("审核通过");
		btnsave.appendChild(t1);
		classes("room-order-info")[0].appendChild(btnsave);


	}*/


//文章列表立审按钮
	if(window.location.href.indexOf("ccpInformation/checkInformationIndex.do")>0){

		if (classes("information-check")!=null){
			var checkBtnList=classes("information-check");
			for (i=0;i<checkBtnList.length;i++){
				checkBtnList[i].parentNode.setAttribute("style","width:60px;");
				document.querySelectorAll(".main-content table tr")[i+1].querySelector(".title").innerHTML="<a href='http://chongqingyd.ctwenhuayun.cn/kzqwhg/web/news/detail.html?id="+document.querySelectorAll(".information-check")[i].getAttribute("informationid")+"&cid=d6c777ad1f624323a7f365f2e308d834'>"+document.querySelectorAll(".main-content table tr")[i+1].querySelector(".title").innerText+"</a>";
				classes("information-view")[i].style.display="none";

				classes("information-edit")[i].innerText="编";
				classes("information-check")[i].innerText="审";
				t1=document.createTextNode(" | ");
				checkBtnList[i].parentNode.appendChild(t1);
				aa=document.createElement("a");
				aa.setAttribute("onclick","shopSwitchAuditFlowPushForward('"+checkBtnList[i].getAttribute("informationid")+"')");
				t1=document.createTextNode("核");
				aa.appendChild(t1);
				checkBtnList[i].parentNode.appendChild(aa);
			}
		}
	}

//学才艺课程列表立审按钮
	if(window.location.href.indexOf("course/checkCourseIndex.do")>0){


			var oCBtnList=classes("main-content")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
			for (i=0;i<oCBtnList.length;i++){

				t1=document.createTextNode(" | ");
				oCBtnList[i].getElementsByTagName("td")[9].appendChild(t1);
				aa=document.createElement("a");
				aa.setAttribute("onclick","shopSwitchAuditFlowPushForward('"+oCBtnList[i].getElementsByTagName("td")[9].getElementsByTagName("a")[0].href.substring(17,49)+"')");
				t1=document.createTextNode("核");
				aa.appendChild(t1);
				oCBtnList[i].lastChild.appendChild(aa);
			}

	}

//后台新闻列表页面微调，加文章链接
	if(window.location.href.indexOf("ccpInformation/informationIndex.do")>0){
		addGlobalStyle(".listLineHeightDecrease th {line-height:20px!important; padding-top:10px!important;padding-bottom:10px!important;}");
		//新闻资讯及党群建设
		if((window.location.href.indexOf("d6c777ad1f624323a7f365f2e308d834")>0)||(window.location.href.indexOf("983ec61f0472404d98116f58992694e4")>0)){
			classes("main-content")[0].getElementsByTagName("tr")[0].className="listLineHeightDecrease";
			classes("main-content")[0].getElementsByTagName("th")[3].width=75;
			classes("main-content")[0].getElementsByTagName("th")[4].width=50;
			classes("main-content")[0].getElementsByTagName("th")[5].width=50;
			classes("main-content")[0].getElementsByTagName("th")[6].width=60;
			classes("main-content")[0].getElementsByTagName("th")[7].width=60;
			classes("main-content")[0].getElementsByTagName("th")[12].width=60;
			//classes("main-content")[0].getElementsByTagName("th")[14].width=250;
			//classes("main-content")[0].getElementsByTagName("th")[12].setAttribute("style","line-height:20px");
			//classes("main-content")[0].getElementsByTagName("tbody")[1].getElementsByTagName("tr")[1].style.display="none";
			pList=classes("main-content")[0].getElementsByTagName("tbody")[1].getElementsByTagName("tr");
			for (i=0;i<pList.length;i++){
				pList[i].getElementsByTagName("td")[1].innerHTML="<a href='http://chongqingyd.ctwenhuayun.cn/kzqwhg/web/news/detail.html?id="+pList[i].getElementsByClassName("showUl")[0].getAttribute("informationid")+"&cid=d6c777ad1f624323a7f365f2e308d834'>"+pList[i].getElementsByTagName("td")[1].innerText+"</a>";
				j = document.createElement('a');
				j.href = "/ccpInformation/preEditInformation.do?informationId="+pList[i].getElementsByClassName("showUl")[0].getAttribute("informationid");
				j.appendChild(document.createTextNode('重编'));
				pList[i].getElementsByTagName("td")[14].getElementsByTagName("div")[0].appendChild(j);
			}
		 //数字剧院
		}else if(window.location.href.indexOf("d9c3c3d653444dd281b38eb2b4536b70")>0){
			classes("main-content")[0].getElementsByTagName("tr")[0].className="listLineHeightDecrease";
			classes("main-content")[0].getElementsByTagName("th")[1].width="30%";
			classes("main-content")[0].getElementsByTagName("th")[3].width=80;
			classes("main-content")[0].getElementsByTagName("th")[4].width=60;
			classes("main-content")[0].getElementsByTagName("th")[5].width=60;
			classes("main-content")[0].getElementsByTagName("th")[6].width=60;
			classes("main-content")[0].getElementsByTagName("th")[7].width=60;
			pList=classes("main-content")[0].getElementsByTagName("tbody")[1].getElementsByTagName("tr");
			for (i=0;i<pList.length;i++){
				j = document.createElement('a');
				j.href = "/ccpInformation/preEditInformation.do?informationId="+pList[i].getElementsByTagName("img")[0].getAttribute("id").substr(18);
				j.appendChild(document.createTextNode('重编'));
				pList[i].getElementsByTagName("td")[11].getElementsByTagName("div")[0].appendChild(j);
			}
		}
	}
	//享活动
	if(window.location.href.indexOf("live/liveActivityListIndex.do")>0){
		//classes("main-content")[0].getElementsByTagName("th")[3].width=80;
		//classes("main-content")[0].getElementsByTagName("th")[4].width=60;
		///classes("main-content")[0].getElementsByTagName("th")[5].width=60;
		//classes("main-content")[0].getElementsByTagName("th")[6].width=60;
		//classes("main-content")[0].getElementsByTagName("th")[7].width=60;
		//classes("main-content")[0].getElementsByTagName("th")[12].width=60;
		//classes("main-content")[0].getElementsByTagName("th")[14].width=250;
		//classes("main-content")[0].getElementsByTagName("th")[12].setAttribute("style","line-height:20px");
		//classes("main-content")[0].getElementsByTagName("tbody")[1].getElementsByTagName("tr")[1].style.display="none";
		pList=classes("main-content")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
		for (i=0;i<pList.length;i++){
			//pList[i].getElementsByTagName("td")[1].innerHTML="<a href='http://chongqingyd.ctwenhuayun.cn/kzqwhg/web/news/detail.html?id="+pList[i].getElementsByClassName("showUl")[0].getAttribute("informationid")+"&cid=d6c777ad1f624323a7f365f2e308d834'>"+pList[i].getElementsByTagName("td")[1].innerText+"</a>";
			j = document.createElement('a');
			j.href = "/live/editLive.do?liveActivityId="+pList[i].getElementsByClassName("showUl")[0].getAttribute("liveactivityid");
			j.appendChild(document.createTextNode('重编'));
			pList[i].getElementsByTagName("td")[17].getElementsByTagName("div")[0].appendChild(j);
		}
	}

//新增文章、编辑文章编辑器高度增高、文章编辑器图片大小缩进处理

	if(window.location.href.indexOf("preAddInformation.do")>0 || window.location.href.indexOf("preEditInformation.do")>0){
		var InfoEditInt=setInterval(function(){
			if(id("cke_1_contents")){
				clearInterval(InfoEditInt);
				//////////////////////工具栏跟随滚动/////////////////////////////
				window.addEventListener('scroll', function () {
					const getOffset = (element, horizontal = false) => {
						if (!element) return 0;
						return getOffset(element.offsetParent, horizontal) + (horizontal ? element.offsetLeft : element.offsetTop);
					}
					var toolbar = document.getElementsByClassName('cke_top').item(0);
					var editor = document.getElementsByClassName('cke').item(0);
					var inner = document.getElementsByClassName('cke_inner').item(0);
					var scrollvalue = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
					toolbar.style.width = editor.clientWidth + "px";
					toolbar.style.boxSizing = "border-box";
					if (getOffset(editor) <= scrollvalue) {
						toolbar.style.position = "fixed";
						toolbar.style.top = "0px";
						inner.style.paddingTop = toolbar.offsetHeight + "px";
					}
					if (getOffset(editor) > scrollvalue && (getOffset(editor) + editor.offsetHeight) >= (scrollvalue + toolbar.offsetHeight)) {
						toolbar.style.position = "relative";
						toolbar.style.top = "auto";
						inner.style.paddingTop = "0px";
					}
					const minContentHeight = toolbar.offsetHeight * 2;
					if ((getOffset(editor) + editor.offsetHeight) < (scrollvalue + minContentHeight)) {
						toolbar.style.position = "absolute";
						toolbar.style.top = "calc(100% - " + minContentHeight + "px)";
						inner.style.position = "relative";
					}
				}, false);

				////////修改发布时间
				var scriptNode=document.createElement("tr");
				scriptNode.id="timeShifter";
				classes("main-publish")[0].getElementsByTagName("tbody")[2].insertBefore(scriptNode,id("attachmentWebuploadTr"));
				id("timeShifter").outerHTML="<tr><td width=\"100\" id=\"timeShifterTitle\" class=\"td-title\">发布时间</td><td id=\"timeShifterTD\"></td></tr>";
				var scriptCheckBox=document.createElement("input");
				scriptCheckBox.type="checkbox";
				scriptCheckBox.checked=false;
				scriptCheckBox.addEventListener("click",function(){
					if(scriptCheckBox.checked){
						document.getElementById('timeShifterTD').innerHTML="<div class='form-table' style='float: left;'><div class='td-time' style='margin-top: 0px;'><div class='start w240' style='margin-left: 8px;'><span class='text'></span><input type='hidden' id='informationCreateTimeHidden'><input style='width: 120px;' type='text' id='informationCreateTime' name='informationCreateTimebak' value='"+formatTime("",now)+"'><i class='data-btn start-btn2'></i></div></div></div>";
					}else{
						document.getElementById('timeShifterTD').innerHTML="";
					}
				});
				id("timeShifterTitle").appendChild(scriptCheckBox);
				/*
				id("timeShifter").outerHTML="<tr><td width='100' class='td-title'>发布时间：</td><td><div class='form-table' style='float: left;'><div class='td-time' style='margin-top: 0px;'><div class='start w240' style='margin-left: 8px;'><span class='text'></span><input type='hidden' id='informationCreateTimeHidden'><input style='width: 120px;' type='text' id='informationCreateTime' name='informationCreateTimebak' value='"+formatTime("",now)+"'><i class='data-btn start-btn2'></i></div></div></div></td></tr>";
				*/

///////////////设置富文本框宽度，自动设置高度////////////////////

				var editorFrame=id("cke_1_contents").getElementsByTagName("iframe")[0].contentWindow.document;
				//setIframeHeight(id("cke_1_contents").getElementsByTagName("iframe")[0]);
				//classes("cke_contents")[0].style.height="600px";
				id("cke_informationContent").style.width="790px";
				classes("cke_contents")[0].style.width="790px";
				classes("cke_contents")[0].style.height=Math.max(300,editorFrame.body.scrollHeight+50)+"px";
				/*editorFrame.body.addEventListener("change",function(){
					classes("cke_contents")[0].style.height=Math.max(300,editorFrame.body.scrollHeight+50)+"px";
				});*/
				editorFrame.body.onkeydown=function(){
					classes("cke_contents")[0].style.height=Math.max(300,editorFrame.body.scrollHeight+50)+"px";
				}
				//classes("cke_contents")[0].style.height="760px";
				//var style = document.createElement("style");
				//style.type = "text/css";
				//style.innerHTML=".cke_editable{margin:auto}";

				//editorFrame.head.appendChild(style);
				var btnop=classes("btn-save")[0].onclick;
				classes("btn-save")[0].onclick=function(){return false};
				classes("btn-save")[0].addEventListener("click",function(){
					formatText(editorFrame);
					setTimeout(btnop(),1000);//调用原网页方法
				});
			}
		},1000);

		///////////////////文章图片快速上传/////////////////////
		//点上传tab，打开文件对话框
		var picUploadState=0;
		inte1=setInterval(function(){
			if(document.querySelector("a[title=上传]")){
				clearInterval(inte1);
				document.querySelector("a[title=上传]").addEventListener("click",function(){
					document.querySelector("iframe[title=上传到服务器]").contentWindow.document.querySelector("input[name=upload]").click();
					picUploadState=1;
				});
			}
		},1000);
		//选取图像自动上传
		inte2=setInterval(function(){
			if(picUploadState==1){
				document.querySelector("iframe[title=上传到服务器]").contentWindow.document.querySelector("input[name=upload]").addEventListener("change",function(){
					if(document.querySelector("iframe[title=上传到服务器]").contentWindow.document.querySelector("input[name=upload]").value.length>0){
						//clearInterval(inte2);
						document.querySelector("div[name=Upload] a").click();
						picUploadState=2;
					}
				});
			}
		},1000);
		//图像属性自动点确定
		inte3=setInterval(function(){
			if(picUploadState==2){
				if(document.querySelector(".ImagePreviewBox img").getAttribute("src")){
					//clearInterval(inte3);
					document.querySelector(".ImagePreviewBox").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("a[title=确定]").click();
					classes("cke_contents")[0].style.height=parseInt(classes("cke_contents")[0].style.height.substr(0,classes("cke_contents")[0].style.height.length-2))+500+"px";
					picUploadState=0;
				}
			}
		},1000);
	}

//////////////////直播编辑器定位、高度增高

	if((window.location.href.indexOf("live/editLive.do")>0)||(window.location.href.indexOf("live/addLive.do")>0)){
		setTimeout(function(){
			//////////////////////工具栏跟随滚动/////////////////////////////

			window.addEventListener('scroll', function () {
				const getOffset = (element, horizontal = false) => {
					if (!element) return 0;
					return getOffset(element.offsetParent, horizontal) + (horizontal ? element.offsetLeft : element.offsetTop);
				}
				var toolbar = document.getElementsByClassName('cke_top').item(0);
				var editor = document.getElementsByClassName('cke').item(0);
				var inner = document.getElementsByClassName('cke_inner').item(0);
				var scrollvalue = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
				toolbar.style.width = editor.clientWidth + "px";
				toolbar.style.boxSizing = "border-box";
				if (getOffset(editor) <= scrollvalue) {
					toolbar.style.position = "fixed";
					toolbar.style.top = "0px";
					inner.style.paddingTop = toolbar.offsetHeight + "px";
				}
				if (getOffset(editor) > scrollvalue && (getOffset(editor) + editor.offsetHeight) >= (scrollvalue + toolbar.offsetHeight)) {
					toolbar.style.position = "relative";
					toolbar.style.top = "auto";
					inner.style.paddingTop = "0px";
				}
				const minContentHeight = toolbar.offsetHeight * 2;
				if ((getOffset(editor) + editor.offsetHeight) < (scrollvalue + minContentHeight)) {
					toolbar.style.position = "absolute";
					toolbar.style.top = "calc(100% - " + minContentHeight + "px)";
					inner.style.position = "relative";
				}
			}, false);

			///////////////////////////////////

			var editorFrame=id("cke_1_contents").getElementsByTagName("iframe")[0].contentWindow.document;
			//setIframeHeight(id("cke_1_contents").getElementsByTagName("iframe")[0]);
			//classes("cke_contents")[0].style.height="600px";
			classes("cke_contents")[0].style.height=Math.max(150,editorFrame.body.scrollHeight+50)+"px";
			editorFrame.body.onkeydown=function(){
				classes("cke_contents")[0].style.height=Math.max(150,editorFrame.body.scrollHeight+50)+"px";
			}
		},1000);
	}










	if(classes("laydate-month-list")){


	}

	if (window.location.href.indexOf("infoList.do?module=YSSX")>0){


	}

	//培训报名管理列表优化
	if (window.location.href.indexOf("train/allTrainOrderList.do")>0){


	}

	//顶端添加“我的待办”按钮
	/*if (id("left-tree")){


		var daibanbtnframe=document.createElement("li");
		var daibanbtn=document.createElement("a");
		daibanbtn.setAttribute("href","/backLog/allBackLogList.do");
		daibanbtn.setAttribute("target","main");
		daibanbtn.setAttribute("style","font-size:20px;color:white;text-height:20px;height:40px;padding:20px");
		var daibanbtntext=document.createTextNode("我的待办");
		daibanbtnframe.appendChild(daibanbtn);
		daibanbtn.appendChild(daibanbtntext);
		//classes("tree")[0].appendChild(daibanbtnframe);
		classes("tree")[0].insertBefore(daibanbtnframe,tags("li")[0]);
		//alert("a");
		//tags("li")[0].style.display="none";//隐藏旧的代办按钮
		var daibanoriginalnode=classes("tree-node");
		for (var i=0;i<daibanoriginalnode.length;i++){
			if (daibanoriginalnode[i].getElementsByClassName("tree-title")[0].innerText=="我的待办"){
				daibanoriginalnode[i].parentNode.style.display="none";//隐藏旧的代办按钮
				break;
			}

		}
    }*/

	//文章编辑器高度增高、文章编辑器图片大小及缩进处理
	//if ((window.location.href.indexOf("addPage.do")>0)|(window.location.href.indexOf("preEditInfo.do")>0)|((window.location.href.indexOf("/backLog/allBackLogList.do")>0)&(tags("div")[1].innerText=="资讯详情"))){
	/*if ((window.location.href.indexOf("addPage.do")>0)|(window.location.href.indexOf("preEditInformation.do")>0)){
		//id("cke_1_contents").style.height="600px";
		//setTimeout(console.log(tags("iframe")[0].innerHTML),5000);
		var timerForEditor=setInterval(function(){
			if(id("cke_1_contents")){
				clearInterval(timerForEditor);
				//文章编辑器高度增高
				id("cke_1_contents").style.height="600px";
				//取消编辑器样式整体缩进
				var style = document.createElement("style");
				style.type = "text/css";
				style.innerHTML=".cke_editable{margin:auto}";
				var editorFrame=id("cke_1_contents").getElementsByTagName("iframe")[0].contentWindow.document;
				editorFrame.head.appendChild(style);
				//tags("iframe")[0].contentWindow.document.getElementsByClassName("cke_editable")[0].style.margin="auto";
				//文章编辑器图片大小及缩进处理

				id("btnPublish").onclick=function(){return false};

				id("btnPublish").addEventListener("click",function(){
					var editorPics=editorFrame.body.getElementsByTagName("img");
					for (var ePN=0;ePN<editorPics.length;ePN++){
						console.log("OK");
						editorPics[ePN].style.height="auto";
						editorPics[ePN].style.width="723px";
						editorPics[ePN].style.display="block";
						console.log("PicFixed");
					}
					addInfo();//调用原网页方法
				});
			}
		},100);
	}*/




	//培训班列表直接导出报名人员信息excel
	if (window.location.href.indexOf("train/trainList.do")>0){
		var traintr = classes("main-content")[0].getElementsByTagName("tr");
		var trainexportbtn;
		var traintd;
		var trainidstr;
		var trainid;
		for(var traini=2;traini<traintr.length+1;traini++){
			traintd=traintr[traini-1].getElementsByTagName("td")[traintr[traini-1].getElementsByTagName("td").length-1];
			//alert(traintd.innerHTML.substring(0,traintd.innerHTML.length-2));
			//traintd.innerHTML=traintd.innerHTML.substring(0,traintd.innerHTML.length-2)+" |";
			trainidstr=traintd.getElementsByTagName("a")[traintd.getElementsByTagName("a").length-1].getAttribute("href");
			trainid=trainidstr.substring(trainidstr.indexOf("trainId=")+8);
			trainexportbtn=document.createElement("a");
			trainexportbtn.appendChild(document.createTextNode("导出Excel"));
			trainexportbtn.setAttribute("href","/train/exportTrainOrderExcel.do?trainId="+trainid);
			traintd.appendChild(trainexportbtn);
		}
	}



	//批量审核
	//if(window.location.href.indexOf("szzt/zuopinlist.do")>0){}






	////////////////////////////////////////大家软件老版本代码纪念///////////////////////////////////////////////
	/*
    if(window.location.href.indexOf("culturePush/productList.do">0)){
		var main1 = document.getElementsByClassName("main-content");
		var th1 = main1.getElementsByTagName("th")[0];




		var btn1=document.createElement("a");
		var t1=document.createTextNode("全选");
		btn1.appendChild(t1);
		btn1.addEventListener("click", function(){
			var totalpage=document.getElementsByClassName("totalPageNum")[0].innerText;
			var curpage=1;
			var inputs = document.getElementsByTagName("input");//获取所有的input标签对象
			for(var i=0;i<inputs.length;i++){
  				var obj = inputs[i];
 				if(obj.type=='checkbox'){

				}
			}


			var pagination=document.getElementsByClassName("pagination");
			var pagecount=pagination[0].getElementsByTagName("span")[7].innerText;
			var links=pagination[0].getElementsByTagName("a");
			links[1].click();
			var bigtable=document.getElementsByClassName("table_t");
			var tbody=bigtable[0].getElementsByTagName("tbody");
			var int=setInterval(function(){
				if(tempcontent!=tbody[0].innerText){
					tempcontent=tbody[0].innerText;
					content+=tempcontent;
					links[10].click();
					curpage+=1;
				}
				if(curpage>pagecount){
					clearInterval(int);
					content=content.replace(/查看\n/g,"查看");
					content=content.replace(/\	查看/g,"\	查看\r\n");
					var blob = new Blob([content], {type: 'text/txt,charset=UTF-8'});
					openDownloadDialog(blob, '注册用户导出.txt');
				}
			},100);





		});
		th1.appendChild(btn1);


    }


		function openDownloadDialog(url, saveName)
	{
		if(typeof url == 'object' && url instanceof Blob)
		{
			url = URL.createObjectURL(url); // 创建blob地址
		}
		var aLink = document.createElement('a');
		aLink.href = url;
		aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
		var event;
		if(window.MouseEvent) event = new MouseEvent('click');
		else
		{
			event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		}
		aLink.dispatchEvent(event);
	}
	addGlobalStyle('a.ng-scope{width:100px;}');

	////////////////////////////////////////////注册用户页面////////////////////////////////////////////////////////////

	if(window.location.href=="https://www.cqqyg.cn/culture/user_toVIPPage"){
		var btnframe=document.getElementsByClassName("search-button");
		var btn=document.createElement("a");
		btn.setAttribute("class","button white small");
		btn.setAttribute("style","marginleft:50px;width:150px;padding:2px 2px 2px 2px;");
		var t=document.createTextNode("导出所有记录");
		btn.appendChild(t);
		btn.addEventListener("click", function(){
			var content="";
			var tempcontent="";
			var curpage=1;
			var pagination=document.getElementsByClassName("pagination");
			var pagecount=pagination[0].getElementsByTagName("span")[7].innerText;
			var links=pagination[0].getElementsByTagName("a");
			links[1].click();
			var bigtable=document.getElementsByClassName("table_t");
			var tbody=bigtable[0].getElementsByTagName("tbody");
			var int=setInterval(function(){
				if(tempcontent!=tbody[0].innerText){
					tempcontent=tbody[0].innerText;
					content+=tempcontent;
					links[10].click();
					curpage+=1;
				}
				if(curpage>pagecount){
					clearInterval(int);
					content=content.replace(/查看\n/g,"查看");
					content=content.replace(/\	查看/g,"\	查看\r\n");
					var blob = new Blob([content], {type: 'text/txt,charset=UTF-8'});
					openDownloadDialog(blob, '注册用户导出.txt');
				}
			},100);




			//
		});
		btnframe[0].appendChild(btn);
	}

	/////////////////////////////////新闻编辑器优化//////////////////////////////////////

	function menuFixed(id){
		var obj = document.getElementById(id);
		var _getHeight = obj.offsetParent.offsetTop;
		//var _getHeight = obj.offsetTop;
		window.onscroll = function(){
			changePos(id,_getHeight);
		};
	}
	function changePos(id,height){
		var obj = document.getElementById(id);
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		//scrollTop-=86;
		if(scrollTop < height){
			obj.style.position = 'static';
		}else{
			obj.style.position = 'absolute';
			//obj.style.top = scrollTop + 'px';
			obj.style.top = scrollTop - height + 'px';
		}
	}
	if(window.location.href.indexOf("dnews_dnewlistedit")>0){

		addGlobalStyle("#edui1_toolbarbox{position:relative;top:0; z-index:999;}");
		//addGlobalStyle("#edui1_iframeholder{margin-top:50px;}");
		var int=setInterval(function(){
			if (document.getElementById("edui1_toolbarbox")){
				menuFixed("edui1_toolbarbox");

				document.getElementById("ueditor_textarea_content").style.display="block";
				document.getElementById("ueditor_textarea_content").style.width="100%";
				document.getElementById("ueditor_textarea_content").style.resize="vertical";
				document.getElementById("ueditor_textarea_content").style.height="400px";
				document.getElementById("edui1").style.width="100%";
				document.getElementById("edui1_iframeholder").style.width="100%";

				clearInterval(int);
			}
		},1000);
	}

	//////////////////////////////添加文章高级编辑模式按钮/////////////////////////

	if((window.location.href=="https://www.cqqyg.cn/culture/dnews_toPage")|(window.location.href=="https://www.cqqyg.cn/mc/culture-center-app/dynamic-manage/news")) {
		var composeBtn=document.createElement("a");
		composeBtn.setAttribute("class","button white small");
		composeBtn.setAttribute("style","width:50px;padding:2px 2px 2px 2px;");
		composeBtn.setAttribute("href","https://www.cqqyg.cn/culture/dnews_dnewlistedit?oper=add");
		composeBtn.setAttribute("target","_blank");
		var t1=document.createTextNode("高级模式");
		composeBtn.appendChild(t1);
		var obj;
		var int3=setInterval(function(){

			if(window.location.href=="https://www.cqqyg.cn/culture/dnews_toPage"){
				if(document.getElementsByClassName("search_div")[0].getElementsByClassName("search-area")[5]){
					obj=document.getElementsByClassName("search_div")[0].getElementsByClassName("search-area")[5];

					obj.setAttribute("style","width:300px");
					obj.appendChild(composeBtn);
					clearInterval(int3);
				}
			}else{
				if(document.getElementById("center_right_content_iframe")){
					if(document.getElementById("center_right_content_iframe").contentWindow.document.getElementsByClassName("search_div")[0].getElementsByClassName("search-area").length<5){
						obj=document.getElementById("center_right_content_iframe").contentWindow.document.getElementsByClassName("search_div")[0].getElementsByClassName("search-area")[5];
						obj.setAttribute("style","width:300px");
						obj.appendChild(composeBtn);
						clearInterval(int3);
					}

				}
			}
		},200);
	}


功能空间档期
	var schNeedCopy;
	var schNB;
	var schTemp;
	var sch=setInterval(function(){
		if(window.location.href=="https://www.cqqyg.cn/mc/culture-center-app/schedule/add"){
			schNB = document.getElementsByClassName("buttons")[0].getElementsByTagName("button")[1];//Schedule New Button
			schNB.addEventListener("click", function(){
				schNeedCopy=true;
				schTemp=document.getElementsByClassName("time-select-warpper")[0].innerHTML;
			});
			if(schNeedCopy){
				if(document.getElementsByClassName("time-select-warpper")[0].innerHTML!=schTemp){
					document.getElementsByClassName("time-select-warpper")[0].innerHTML=schTemp;
					schNeedCopy=false;
				}
			}
		}
	},500);
*/

})();