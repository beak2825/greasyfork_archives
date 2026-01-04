// ==UserScript==
// @name			我想吃灌汤包
// @namespace		duxiu.ssno.search
// @version			1.0.4
// @include			*search*
// @include			*bookDetail.jsp?*
// @include			*advsearch*
// @include			*book.do?go=guide*
// @include			*book.do?go=showmorelib*
// @include			*searchEBook*
// @include			*www.duxiu.com*
// @include			*n/jpgfs/book/base*
// @include         *n/slib/book/slib*
// @description		直接显示唯一编码ss号，增加存货查询按钮，一键获取方便快捷。
// @copyright		maer
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/417188/%E6%88%91%E6%83%B3%E5%90%83%E7%81%8C%E6%B1%A4%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/417188/%E6%88%91%E6%83%B3%E5%90%83%E7%81%8C%E6%B1%A4%E5%8C%85.meta.js
// ==/UserScript==

//获取当前网页地址
var myurl = window.location.href;
//定义统一的样式
var mystyle = "font-family:Verdana;color:red;font-size:15px;font-weight:bold;";
	mystyle+="text-align:center;margin-top:5px;margin-bottom:5px;";

app = {
run: function(){
	//封面页展示图书显示ssid
	var isDuxiuIndex=myurl.indexOf("www.duxiu.com")!=-1;
	if(isDuxiuIndex)
	{
		var myul=document.querySelector("ul.zpicImg");
		var mybooks=myul.querySelectorAll("li");
		for(var i=0;i<mybooks.length;i++)
		{
			var myCov=mybooks[i].querySelector("img").src.toString();
			var ssid=GetSSID(myCov);
			var ssNode=CreateSSIDNode2(ssid,"myssid"+i);
			mybooks[i].appendChild(ssNode);
		}
	}

	//搜索页显示ssid
	var isSearch=myurl.indexOf("search?") != -1;
	var notBaoku=myurl.indexOf("book/search?")==-1;
	var notAdvsearch=myurl.indexOf("advsearch") == -1;
	if (isSearch&&notAdvsearch&&notBaoku) {
		var subdomain = document.getElementsByName("sp.subdomain")[0];
		//读秀和长春图书馆的情况
		//var isDuxiu=subdomain.value == "book.duxiu.com";
		//var isCcelib=subdomain.value == "book.ly.superlib.net";
        var isDuxiu=myurl.indexOf("book.duxiu.com/search?") != -1;
        var isCcelib=myurl.indexOf("book.ly.superlib.net/search?") != -1;
		if ( isDuxiu||isCcelib) {
			//获取书本列表节点
			var mybooks = document.getElementsByClassName("books");
			for (var i = 0; i < mybooks.length; i++) {
				//调整最小显示高度
				var listDL=mybooks[i].querySelector("dl");
				listDL.style.minHeight="210px";
				
				//获取ssid
				var ssid=GetSSIDDXID("ssid" + i,"dxid" + i);
				//创建插入节点
				var ssNode=CreateSSIDNode2(ssid,"myssid"+i);
				//插入节点
				var divImg=mybooks[i].querySelector(".divImg");

				//存货查询
				var infoAnchor=divImg.querySelector("a").href;
				var oldstr="bookDetail.jsp?dxNumber=";
				var newstr="book.do?go=showmorelib&type=1&dxid=";
				var scgAnchor="http://180.76.236.241:8089/sscx="+ssid;
				var csgbutton=document.createElement("a");
				csgbutton.href=scgAnchor;
				csgbutton.target="_blank";
				csgbutton.style="color:green;font-size:15px;font-weight:bold;text-decoration:none;";
				csgbutton.innerHTML="存货查询";
				var csgP=document.createElement("p");
				csgP.style="text-align:center;";
				csgP.appendChild(csgbutton);

				divImg.appendChild(ssNode);
				divImg.appendChild(csgP);
			};
		}
		//深圳文献港，全国图书馆联盟搜索页
		else {
			var mybooks = document.getElementsByClassName("book1");
			for (var i = 0; i < mybooks.length; i++) {
				//获取ssid
				var ssid=GetSSIDDXID("ssid" + i,"dxid" + i);
				//创建插入节点
				var ssNode=CreateSSIDNode2(ssid,"myssid"+i);

				//获取信息页地址
				var infoUrl=document.getElementById("url"+i).value;
				var dxid=getValueFromUrl2(infoUrl,"dxNumber");
				var dValue=getValueFromUrl2(infoUrl,"&d");
				var myhref="http://180.76.236.241:8089/sscx=";
				myhref+=ssid;
				
				var csgbutton=document.createElement("a");
				csgbutton.href=myhref;
				csgbutton.target="_blank";
				csgbutton.style="color:green;font-size:15px;font-weight:bold;text-decoration:none;";
				csgbutton.innerHTML="存货查询";
				var csgP=document.createElement("p");
				csgP.style="text-align:center;";
				csgP.appendChild(csgbutton);

				//插入节点
				var tdelems = mybooks[i].getElementsByTagName("td");
				for (var j = 0; j < tdelems.length; j++) {
					if (tdelems[j].id == "b_img") {
						var imgNode = tdelems[j];
						var insertPoint = imgNode.nextSibling;
						var myParentNode=insertPoint.parentNode;
						myParentNode.insertBefore(ssNode, insertPoint);
						myParentNode.insertBefore(csgP,insertPoint);
					}
				}
			}
		}
	}

	//信息页面显示ssid
	if (myurl.indexOf("bookDetail.jsp?") != -1) {
		//读秀信息页面
		if (myurl.indexOf("/views/specific/") == -1) {
			//获取ssid
			var bookphoto=document.getElementById("bookphoto");
			var imgsrc=bookphoto.querySelector("img").src;
			var ssid=GetSSID(imgsrc);
			//创建插入节点
			var ssNode=CreateSSIDNode(ssid);
			var grade1=document.getElementById("grade1");
			bookphoto.insertBefore(ssNode,grade1);
			
			//获取三个按钮的根节点，如果没有，则创建一个
			var bnt_content=document.querySelector(".bnt_content");
			if(bnt_content==null)
			{
				bnt_content=document.createElement("dd");
				bnt_content.className="bnt_content";
				var card_text=document.querySelector(".card_text");
				var card_dl=card_text.querySelector("dl");
				card_dl.appendChild(bnt_content);
			}
			var bnt_innerHtml=bnt_content.innerHTML;
			var d=getValueFromUrl("&d");
			var dxid=getValueFromUrl("dxNumber");
			/*有待解决d值的问题
			if(bnt_innerHtml.indexOf("图书馆文献传递")==-1)
			{
				var wxcd=document.createElement("a");
				wxcd.title="功能将您需要的全文发送到您的邮箱！";
				wxcd.className="bnt_book leftF";
				var wxcdUrl="javaScript:subtoRefer(true,'/gofirstdrs.jsp?dxNumber=";
				wxcdUrl+=dxid+"&d="+d+"')";
				wxcd.href=wxcdUrl;
				wxcd.innerHTML="图书馆文献传递";
				if(bnt_innerHtml.indexOf("部分阅读")==-1)
				{
					bnt_content.appendChild(wxcd);
				}
				else
				{
					bnt_content.insertBefore(wxcd,wxcd.firstElementChild);
				}
			}
			*/
			//部分阅读按钮
			if(bnt_innerHtml.indexOf("部分阅读")==-1)
			{
				var bfydurl="http://book.duxiu.com/readDetail.jsp?dxNumber=";
				bfydurl+=dxid;
				bfydurl+="&";
				bfydurl+="d="+d;

				var bfyd=document.createElement("a");
				bfyd.href=bfydurl;
				bfyd.className="bnt_book leftF";
				bfyd.innerHTML="部分阅读";
				bnt_content.appendChild(bfyd);
			}

			//显示查询藏馆按钮
			var csgbutton=document.createElement("a");
			var oldstr="bookDetail.jsp?dxNumber=";
			var newstr="book.do?go=showmorelib&type=1&dxid=";
			var newAnchor="http://180.76.236.241:8089/sscx="+ssid;
			csgbutton.href=newAnchor;
			csgbutton.className="bnt_book leftF";
			 csgbutton.style="color:red;font-size:15px;font-weight:bold;text-decoration:none;";
			csgbutton.innerHTML="存货查询";
			bnt_content.appendChild(csgbutton);
		}
		//深圳文献港,图书馆参考联盟图书信息页
		else {
			//获取ssid
			var tubookimg=document.querySelector(".tubookimg");
			var imgsrc=tubookimg.querySelector("img").src;
			var ssid=GetSSID(imgsrc);
			//创建插入节点
			var ssNode=CreateSSIDNode(ssid);
			tubookimg.appendChild(ssNode);

			//显示查询藏馆按钮
			var csgbutton=document.createElement("a");
			var dxid=getValueFromUrl("dxNumber");
			var dvalue=getValueFromUrl("&d");
			var myhref="http://180.76.236.241:8089/sscx=";
			myhref+=ssid;
			
			csgbutton.href=myhref;
			csgbutton.target="_blank";
			csgbutton.style="color:green;font-size:15px;font-weight:bold;text-decoration:none;";
			csgbutton.innerHTML="存货查询";
			var pTemp=document.createElement("p");
			pTemp.style="text-align:center;";
			pTemp.appendChild(csgbutton);
			tubookimg.appendChild(pTemp);
		}
	}

	//高级搜索页面显示ssid
	if (myurl.indexOf("advsearch") != -1) {
		//定义按钮
		var btnSSID = document.createElement("input");
		btnSSID.id = "btnshowSSID";
		btnSSID.class = "btnInput";
		btnSSID.type = "button";
		btnSSID.onclick = showAdvSS;
		btnSSID.value = "显示SS";
		btnSSID.style = "width:85px;height:27px;";

		//获取插入点，并插入
		var searchinfoDiv = document.getElementById("searchinfo");
		searchinfoDiv.appendChild(btnSSID);
	}
	
	//电子书导航页
	if(myurl.indexOf("book.do?go=guide")!=-1)
	{
		var ulLists=document.getElementsByTagName("ul");
		var ulBooks=null;
		for(var i=0;i<ulLists.length;i++)
		{
			if(ulLists[i].className=="clearfix")
			{
				ulBooks=ulLists[i];
			}
		}
		if(ulBooks!=null)
		{
			var bookLists=ulBooks.querySelectorAll("li");
			for(var j=0;j<bookLists.length;j++)
			{
				var ImgDiv=bookLists[j].getElementsByClassName("divImg");
				if(ImgDiv.length!=0)
				{
					var imgNode=ImgDiv[0];
					var covimgs=imgNode.getElementsByTagName("img");
					if(covimgs.length!=0)
					{
						var covimg=covimgs[0];
						var imghref=covimg.src;
						var ssid = GetSSID(imghref);
						var ssidNode=CreateSSIDNode(ssid);
						imgNode.appendChild(ssidNode);
					}
				}

			}
		}
	}

	//电子书检索页
	if(myurl.indexOf("searchEBook?")!=-1)
	{
		var mybooks=document.querySelector(".books");
		var myBookLists=mybooks.querySelectorAll("li");
		for(var i=0;i<myBookLists.length;i++)
		{
			//调整列表最小高度
			var listDL=myBookLists[i].querySelector("dl");
			listDL.style.minHeight="190px";

			//获取ssid
			var ssid=GetSSIDDXID("ssid" + i,"dxid_" + i);

			//创建插入节点
			var ssNode=CreateSSIDNode2(ssid,"myssid"+i);

			var divImg=myBookLists[i].querySelector(".divImg");
			divImg.appendChild(ssNode);
		}
	}
	//藏馆页面
	if(myurl.indexOf("book.do?go=showmorelib")!=-1)
	{
		//显示ssid部分
		var headDiv=document.querySelector(".header");
		var flDiv=headDiv.querySelector("img");
		var imgSrc=flDiv.src;
		var ssid=GetSSID(imgSrc);
		var ssidLi=document.createElement("li");
		ssidLi.style="color:red;font-weight:bold;";
		console.log(ssid);
		console.log(ssid.length);
		if(ssid.length==8)
		{
			ssidLi.innerHTML="【SS号】"+ssid;
		}
		else
		{
			ssidLi.innerHTML="【DX号】"+ssid;
		}
		var infoUL=headDiv.querySelector("ul");
		var insertPoint=infoUL.firstElementChild.nextElementSibling;
		infoUL.insertBefore(ssidLi,insertPoint);

		//统一按钮风格
		var btnStyle= "min-width:90px;height:28px;margin-left:10px;font-weight:bold;color:red;";
		//显示切换按钮
		var switchButton=document.createElement("input");
		switchButton.id = "switchSCG";
		switchButton.type = "button";
		switchButton.onclick = switchSCG;
		if(myurl.indexOf("&type=1")!=-1)
		{
			switchButton.value = "纸质藏馆";
		}
		else
		{
			switchButton.value = "存货查询";
		}
		switchButton.style = btnStyle;
		var tabDiv=document.querySelector(".tab");
		tabDiv.appendChild(switchButton);

		//返回按钮
		var returnButton=document.createElement("input");
		returnButton.id="returnBtn";
		returnButton.type="button";
		returnButton.style =btnStyle;
		returnButton.onclick=returnBookDetail;
		returnButton.value="返回BookDetail";
		tabDiv.appendChild(returnButton);

		//试读按钮
		var sd=document.createElement("input");
		sd.id="sd";
		sd.type="button";
		sd.style= btnStyle;
		sd.value="试读";
		sd.onclick=sdtz;
		tabDiv.appendChild(sd);
	}

	//包库搜索页面显示ssid
	if(myurl.indexOf("book/search")!=-1)
	{
		var ztbg=document.querySelector("div[class='ztbg']");
		var h2Status=ztbg.querySelector("h2[class='fl zli_t']");
		var insertPoint=h2Status.nextElementSibling;
		//定义按钮
		var btnSSID = document.createElement("input");
		btnSSID.id = "btnshowSSID";
		btnSSID.class = "btnInput";
		btnSSID.type = "button";
		btnSSID.onclick = GetBaoKuSSID;
		btnSSID.value = "显示SSID";
		btnSSID.style = "width:85px;height:30px;color:red;margin-left:15px;";
		ztbg.insertBefore(btnSSID,insertPoint);
	}

	//试读页显示封面、书名、版权、封底四个按钮
	if(myurl.indexOf("/n/jpgfs/book/base/")!=-1)
	{
		var jpath="";
		var mySource=document.querySelector("html").outerHTML;
		var istart=0;
		var iend=0;
		var myIndexStr1="jpgPath:\"";
		var myIndexStr2="\"";
		istart=mySource.indexOf(myIndexStr1);
		istart+=myIndexStr1.length;
		iend=mySource.indexOf(myIndexStr2,istart);
		jpath=mySource.substring(istart,iend);

		var baseUrl="http://img.duxiu.com";
		var myCovUrl=baseUrl+jpath+"cov001?zoom=2";
		var myBokUrl=baseUrl+jpath+"bok001?zoom=2";
		var myLegUrl=baseUrl+jpath+"leg001?zoom=2";
		var myBacUrl=baseUrl+jpath+"cov002?zoom=2";
		
		console.log("封面页："+myCovUrl);
		console.log("书名页："+myBokUrl);
		console.log("版权页："+myLegUrl);
		console.log("封底页："+myBacUrl);

		var t_content=document.querySelector("#t_content");
		t_content.style="width:815px;";
		var tc_right=document.querySelector("#tc_right");
		tc_right.style="width:240px;";
		var myul=tc_right.querySelector("ul");

		var cov001li=addALink(myCovUrl,"cov001","封面","cov001.pdg");
		cov001li.style.marginTop="7px";
		myul.appendChild(cov001li);

		var bok001li=addALink(myBokUrl,"bok001","书名","bok001.pdg");
		bok001li.style.marginTop="7px";
		myul.appendChild(bok001li);

		var leg001li=addALink(myLegUrl,"leg001","版权","leg001.pdg");
		leg001li.style.marginTop="7px";
		myul.appendChild(leg001li);

		var cov002li=addALink(myBacUrl,"cov002","封底","cov002.pdg");
		cov002li.style.marginTop="7px";
		myul.appendChild(cov002li);

		var oneKeyDown=document.createElement("li");
			oneKeyDown.style="margin-top: 7px;margin-left:6px;";
		var oneKeyDownlink=document.createElement("a");
			oneKeyDownlink.id="oneKeyDown";
			oneKeyDownlink.style="color: red;font-weight:bold;cursor: pointer;";
			oneKeyDownlink.innerHTML="一键下载";
			oneKeyDownlink.href="#";
			oneKeyDownlink.onclick=OneKeyDownAll;
		oneKeyDown.appendChild(oneKeyDownlink);
		myul.appendChild(oneKeyDown);
	}

	//包库在线阅读页显示封面、书名、版权、封底四个按钮
	if(myurl.indexOf("/n/slib/book/slib/")!=-1)
	{
		var jpath="";
		var mySource=document.querySelector("html").outerHTML;
		var istart=0;
		var iend=0;
		var myIndexStr1="jpgPath: \"";
		var myIndexStr2="\"";
		istart=mySource.indexOf(myIndexStr1);
		istart+=myIndexStr1.length;
		iend=mySource.indexOf(myIndexStr2,istart);
		jpath=mySource.substring(istart,iend);
		console.log(jpath);
		var baseUrl="http://img.sslibrary.com";
		var myCovUrl=baseUrl+jpath+"cov001?zoom=2";
		var myBokUrl=baseUrl+jpath+"bok001?zoom=2";
		var myLegUrl=baseUrl+jpath+"leg001?zoom=2";
		var myBacUrl=baseUrl+jpath+"cov002?zoom=2";
		
		console.log("封面页："+myCovUrl);
		console.log("书名页："+myBokUrl);
		console.log("版权页："+myLegUrl);
		console.log("封底页："+myBacUrl);

		var ToolsBar=document.querySelector(".ToolsBar");
		var myul=ToolsBar.querySelector("ul");
		myul.style.width="1366px";


		var cov001li=addALink(myCovUrl,"cov001","封面","cov001.pdg");
		myul.appendChild(cov001li);

		var bok001li=addALink(myBokUrl,"bok001","书名","bok001.pdg");
		myul.appendChild(bok001li);

		var leg001li=addALink(myLegUrl,"leg001","版权","leg001.pdg");
		myul.appendChild(leg001li);

		var cov002li=addALink(myBacUrl,"cov002","封底","cov002.pdg");
		myul.appendChild(cov002li);

		var oneKeyDown=document.createElement("li");
			oneKeyDown.style="margin-left:6px;";
		var oneKeyDownlink=document.createElement("a");
			oneKeyDownlink.id="oneKeyDown";
			oneKeyDownlink.style="color: red;font-weight:bold;cursor: pointer;";
			oneKeyDownlink.innerHTML="一键下载";
			oneKeyDownlink.href="#";
			oneKeyDownlink.onclick=OneKeyDownAll;
		oneKeyDown.appendChild(oneKeyDownlink);
		myul.appendChild(oneKeyDown);
	}
}};


function GetBaoKuSSID()
{
	var myssids=document.querySelectorAll("#myssid");
	if(myssids.length!=0)
	{
		return;
	}
	else
	{
		var mybooklist=document.querySelectorAll("ul[class='clearfix zli_item']");
		for(var i=0;i<mybooklist.length;i++)
		{
			var mybook=mybooklist[i].querySelector("li[class='fl zli_img']");
			var bookimg=mybook.querySelector("img");
			var myimgSrc=bookimg.src;
			console.log(myimgSrc);
			var myssid=GetSSID(myimgSrc);
			console.log(myssid);
			var ssidNode=CreateSSIDNode(myssid);
			mybook.appendChild(ssidNode);
		}
	}
}

function OneKeyDownAll()
{
	var mylinksId=new Array("cov001","bok001","leg001","cov002");
	for(var i=0;i<mylinksId.length;i++)
	{
		var mylink=document.getElementById(mylinksId[i]);
		mylink.click();
	}
}

function addALink(urlStr,myIdStr,innerHTMLStr,downloadName)
{
	var myli=document.createElement("li");
	myli.style="margin-left:6px;";
	var alink=document.createElement("a");
	alink.id=myIdStr;
	alink.innerHTML=innerHTMLStr;
	alink.href=urlStr;
	alink.style="color: green;font-weight:bold;cursor: pointer;";
	alink.download=downloadName;
	myli.appendChild(alink);
	return myli;
}

//切换藏书查询
function switchSCG()
{
	var newurl="";
	if(myurl.indexOf("&type=1")!=-1)
	{
		newurl=myurl.replace("&type=1","");
	}
	else
	{
		newurl=myurl+"&type=1";
	}
	window.location.href=newurl;
}


//跳转试读页
function sdtz()
{
	var d=getValueFromUrl("&d");
	var dxid=getValueFromUrl("&dxid");
	newurl="http://book.duxiu.com/readDetail.jsp?dxNumber=";
	newurl+=dxid;
	newurl+="&";
	newurl+="d="+d;
	window.open(newurl,"_blank");
}

//返回bookdetail
function returnBookDetail()
{
	var d=getValueFromUrl("&d");
	var dxid=getValueFromUrl("&dxid");
	newurl="http://book.duxiu.com/bookDetail.jsp?dxNumber=";
	newurl+=dxid;
	newurl+="&";
	newurl+="d="+d;
	window.location.href=newurl;
}
//从当前网址中提取某个字段，输入字段名称
function getValueFromUrl(myfield)
{
	var str=myfield+"=";
	if(myurl.indexOf(str)!=-1)
	{
		var reg =new RegExp(myfield+"\\=\\w+");
		
		var fieldStr = myurl.match(reg)[0];
		console.log(myfield.toString());
		var fieldValue = fieldStr.replace(myfield+"=", "");
		return fieldValue;
	}
}

//从当前网址中提取某个字段，输入字段名称
function getValueFromUrl2(URL,myfield)
{
	var str=myfield+"=";
	if(URL.indexOf(str)!=-1)
	{
		var reg =new RegExp(myfield+"\\=\\w+");
		
		var fieldStr = URL.match(reg)[0];
		var fieldValue = fieldStr.replace(myfield+"=", "");
		return fieldValue;
	}
}

//获取ssid或者dxid，当ssid不存在的时候，返回dxid
//输入ssid的元素id以及读秀dxid的元素id
function GetSSIDDXID(ssidNodeID,dxidNodeID)
{
	//获取ssid
	var ssid=GetSSIDByID(ssidNodeID,"value");

	//获取dxid
	var dxid=GetSSIDByID(dxidNodeID,"value");
	
	//如果ssid不存在，则用dxid替代
	if (ssid == "") {
		ssid = dxid;
	}
	return ssid;
}
//获取ssid，输入元素的id、属性名称（一般为value）
function GetSSIDByID(elementID,strAttribute)
{
	var ssidNode=document.getElementById(elementID);
	var ssid=ssidNode.getAttribute(strAttribute);
	return ssid;
}
//创建默认的ssid节点，节点id为myssid
function CreateSSIDNode(ssid)
{
	var myid='myssid';
	return CreateSSIDNode2(ssid,myid);
}
//创建ssid节点，输入ssid和节点id
function CreateSSIDNode2(ssid,strID)
{
	var ssNode = document.createElement("p");
	ssNode.id=strID;
	ssNode.style=mystyle;
	ssNode.innerHTML=ssid;
	return ssNode;
}

//高级搜索页面显示ssid
function showAdvSS() {
	//获取图书节点
	var mybooks = document.getElementsByClassName("books")[0];
	var booklists=mybooks.getElementsByTagName("li");
	for (var i = 0; i < booklists.length; i++) {
		//判断是否存在，如果存在，则跳过
		var myssid = document.getElementById("myssid" + i);
		if (myssid != null) {
			continue;
		}
		//获取ssid
		var ssid=GetSSIDDXID("ssid" + i,"dxid" + i);

		//创建插入节点
		var ssNode=CreateSSIDNode2(ssid,"myssid"+i);

		//修改dl最低高度
		var listDL=booklists[i].querySelector("dl");
		listDL.style.minHeight="210px";

		//插入数据
		var divImg=booklists[i].getElementsByClassName("divImg")[0];

		var infoAnchor=divImg.querySelector("a").href;
		var oldstr="bookDetail.jsp?dxNumber=";
		var newstr="book.do?go=showmorelib&type=1&dxid=";
		var scgAnchor="http://180.76.236.241:8089/sscx="+ssid;
		//存货查询
		var csgbutton=document.createElement("a");
		csgbutton.href=scgAnchor;
		csgbutton.target="_blank";
		csgbutton.style="color:green;font-size:15px;font-weight:bold;text-decoration:none;";
		csgbutton.innerHTML="存货查询";
		var csgP=document.createElement("p");
		csgP.style="text-align:center;";
		csgP.appendChild(csgbutton);

		divImg.appendChild(ssNode);
		divImg.appendChild(csgP);
	}
}

function GetSSID(strImgSrc) {
	var ssid = "";
    var iidStr=GetEncode(strImgSrc);
    var ssidStr = DeCode(iidStr);
    ssid = TrimString(ssidStr);
    return ssid;
}

function GetEncode(strImgSrc) {
    var reg = /iid\=\w+/;
    var iidStr = strImgSrc.match(reg)[0];
    iidStr = iidStr.replace("iid=", "");
    return iidStr;
}

function TrimString(inputStr) {
    var outPutStr = "";
    inputStr = inputStr.replace(/\//g, "");
    var reg = /\d{8,}/;
	outPutStr = inputStr.match(reg);
	outPutStr=outPutStr.toString();
    return outPutStr;
}

function DeCode(EnCodeStr) {
    var decodeStr = "";
    var baseNumStr = EnCodeStr.substring(EnCodeStr.length - 2);
    var baseNum = parseInt(baseNumStr, 16);
    var myCodeStr = EnCodeStr.substring(0, EnCodeStr.length - 16);
    for (var i = 0; i < myCodeStr.length; i = i + 2) {
        decodeStr += GetSubString(myCodeStr, baseNum, i);
    }
    return decodeStr;
}

function GetSubString(EnCodeStr, BaseNum, startIndex) {
    var s = "";
    s = EnCodeStr.substring(startIndex, startIndex + 2);
    //转换进制
    var i = parseInt(s, 16) - BaseNum;
    s = String.fromCharCode(i);
    return s;
}

try {
	app.run();
} catch (e) {
	console.log(e);
}