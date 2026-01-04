// ==UserScript==
// @name        pad.skyozora.com-Multiplay-Helper
// @name:zh-CN	智龙迷城战友系统及资讯网协力页面辅助器 
// @namespace   http://www.mapaler.com/
// @description show stamina and fast add stage
// @description:zh-CN 智龙迷城战友系统及资讯网，协力页面，显示体力，登陆页面可快速添加今日地图
// @include     http://pad.skyozora.com/multiplay/register/
// @include     http://pad.skyozora.com/multiplay/
// @resource    style     https://raw.githubusercontent.com/Mapaler/pad.skyozora.com-Multiplay-Helper/master/style.css?v6
// @version     1.2.25
// @copyright	2017+, Mapaler <mapaler@163.com>
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/33628/padskyozoracom-Multiplay-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/33628/padskyozoracom-Multiplay-Helper.meta.js
// ==/UserScript==


//仿GM_xmlhttpRequest函数v1.3
if (typeof(GM_xmlhttpRequest) == "undefined")
{
    var GM_xmlhttpRequest = function(GM_param) {

        var xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
        xhr.open(GM_param.method, GM_param.url, true);
        if (GM_param.responseType) xhr.responseType = GM_param.responseType;
        if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
        xhr.onreadystatechange = function() //设置回调函数
            {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200 && GM_param.onload)
                        GM_param.onload(xhr);
                    if (xhr.status !== 200 && GM_param.onerror)
                        GM_param.onerror(xhr);
                }
            }

        for (var header in GM_param.headers) {
            xhr.setRequestHeader(header, GM_param.headers[header]);
        }

        xhr.send(GM_param.data ? GM_param.data : null);
    }
}
//仿GM_getValue函数v1.0
if(typeof(GM_getValue) == "undefined")
{
	var GM_getValue = function(name, type){
		var value = localStorage.getItem(name);
		if (value == undefined) return value;
		if ((/^(?:true|false)$/i.test(value) && type == undefined) || type == "boolean")
		{
			if (/^true$/i.test(value))
				return true;
			else if (/^false$/i.test(value))
				return false;
			else
				return Boolean(value);
		}
		else if((/^\-?[\d\.]+$/i.test(value) && type == undefined) || type == "number")
			return Number(value);
		else
			return value;
	}
}
//仿GM_setValue函数v1.0
if(typeof(GM_setValue) == "undefined")
{
	var GM_setValue = function(name, value){
		localStorage.setItem(name, value);
	}
}
//仿GM_deleteValue函数v1.0
if(typeof(GM_deleteValue) == "undefined")
{
	var GM_deleteValue = function(name){
		localStorage.removeItem(name);
	}
}
//仿GM_listValues函数v1.0
if(typeof(GM_listValues) == "undefined")
{
	var GM_listValues = function(){
		var keys = [];
		for (var ki=0, kilen=localStorage.length; ki<kilen; ki++)
		{
			keys.push(localStorage.key(ki));
		}
		return keys;
	}
}
//创建带Label的Input类
var LabelInput = function(text, classname, name, type, value, title = "", beforeText = true) {
	var label = document.createElement("label");
	if (text != undefined) label.appendChild(document.createTextNode(text));
	label.className = classname;
	if (typeof(title) != "undefined")
		label.title = title;

	var ipt = document.createElement("input");
	ipt.name = name;
	ipt.id = ipt.name;
	ipt.type = type;
	ipt.value = value;

	label.input = ipt;
	if (beforeText)
		label.insertBefore(ipt, label.firstChild);
	else
		label.appendChild(ipt);
	return label;
};
function log(str) //在信息框显示内容的
{
	var infoBox = document.querySelector("#info-box");
	for (var ci = infoBox.childNodes.length-1;ci>=0;ci--) //清空主图列表
	{
		infoBox.childNodes[ci].remove();
	}
	infoBox.appendChild(document.createTextNode(str));
}
//得到标准时区的时间的函数
function getLocalTime(i)
{
	//参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
	if (typeof i !== 'number') return;
	var d = new Date();
	//得到1970年一月一日到现在的秒数
	var len = d.getTime();
	//本地时间与GMT时间的时间偏移差
	var offset = d.getTimezoneOffset() * 60000;
	//得到现在的格林尼治时间
	var utcTime = len + offset;
	return new Date(utcTime + 3600000 * i);
}

var config={
	version:1, //储存当前设置结构版本
	updateDate:0, //储存今日开放地图上次更新时间
	todayStage:[
		{name:"每日降临",detail:"每天都会更换一次的降临神，保持24小时。",stages:[]},
		{name:"紧急降临",detail:"每天分组出现的紧急本，每个组一小时。",stages:[]},
		{name:"耀日本",detail:"每周分星期几固定出现的本",stages:[]},
		{name:"活动本",detail:"各种活动的本",stages:[]}
	], //储存当前开放的地图
	starStage:[], //储存收藏的地图
	message:[],
};
var stageList=[]; //储存全部地图的数据
var mobile = false; //是否为手机版
var stageTestReg = "^/?s(?:tage)?/"; //用来测试href是不是地下城的

if(typeof(GM_getResourceText) != "undefined") //用了GM插件
{
	var styleDom = document.createElement("style");
	styleDom.type = "text/css";
	styleDom.appendChild(document.createTextNode(GM_getResourceText('style')));
	document.head.appendChild(styleDom);
}

if (GM_getValue("helper-config") == undefined && location.pathname == "/multiplay/register/")
{
	saveConfig();
	alert("💗欢迎使用！\n请先导入地下城列表数据\n然后检查今日开放地下城。");
	console.log("配置不存在，储存默认配置");
}else
{
	loadConfig(GM_getValue("helper-config"),GM_getValue("helper-stage-list"));
	//console.log("配置存在",config);

	var now = getLocalTime(9);var last = new Date(config.updateDate);
	if (now > last && now.getDate() != last.getDate())
	{
		console.log("今天的开放地图还没检查");
		if(location.pathname == "/multiplay/register/") alert("💗又是新的一天了！\n请检查今天开放的地下城。");
		config.todayStage.length = 0; //清空昨天的
	}else
	{
		console.log("已经是今天的开放地图");
	}
}
function loadConfig(configStr,stageListStr,reset = false)
{
	var bk = [true,true];
	var saConfig = JSON.parse(configStr);
	console.log("设置",saConfig)
	var saStageList = JSON.parse(stageListStr);
	console.log("地图数据",saStageList)

	if (saConfig != null && typeof(saConfig) == "object")
	{
		if (reset)
		{
			config = saConfig;
		}
		else
			config = Object.assign(config, saConfig);
	}	
	else
	{
		console.error("配置损坏，使用默认配置");
		bk[0] = false;
	}
	if (saStageList != null && typeof(saStageList) == "object")
		stageList = saStageList.concat();
	else
	{
		console.error("完整地下城数据丢失，使用空配置");
		bk[1] = false;
	}
	return bk;
}
function saveConfig(type)
{
	if (type == undefined) type = 255;
	if (1 == (type & 1))
	{
		var configStr = JSON.stringify(config);
		GM_setValue("helper-config", configStr);
	}
	if (2 == (type & 2))
	{
		var stageListStr = JSON.stringify(stageList);
		GM_setValue("helper-stage-list", stageListStr);
	}
}


if(location.pathname == "/multiplay/register/") //注册页面
{
	registerPage();
}else if(location.pathname == "/multiplay/") //列表页面
{
	multiplayPage();
}

function registerPage()
{
	var form = document.querySelector("#wrapper>table:nth-last-of-type(2) form"); //主要版面的表单
	if (form == undefined) //如果没找到，试试手机版
	{
		form = document.querySelector(".content>form");
		if (form!=undefined)
		{
			mobile = true;
		}else
		{
			alert("😰未找到协力登陆窗口");
		}
	}
	if (!mobile) form.querySelector("p:nth-last-of-type(1)").remove() //去除最后面那个无用的东西
	var box = document.createElement("div");form.parentElement.appendChild(box);
	box.id = box.className = "mlt-helper";


	function typeClick(){refreshStageList1(this.value)};

	var stgBox = document.createElement("div");box.appendChild(stgBox);
	stgBox.className = "main-stg-box";

	var stg1Box = document.createElement("div");stgBox.appendChild(stg1Box);
	stg1Box.className = "stg-box stg-box-1";
	var stg1Ul = document.createElement("ul");stg1Box.appendChild(stg1Ul);
	
	function refresTypeList()
	{
		for (var ci = stg1Ul.childNodes.length-1;ci>=0;ci--) //清空主图列表
		{
			stg1Ul.childNodes[ci].remove();
		}
		//添加每日类型
		config.todayStage.forEach(function(stgs,index){
			var stg1UlLi1 = document.createElement("li");stg1Ul.appendChild(stg1UlLi1);
			if (typeof(stgs) != "object") return;
			var stgType1 = new LabelInput(stgs.name, "stg-type","stg-type","radio",index,stgs.detail);
			//if (index == 0) stgType1.input.checked = true;
			stgType1.input.onclick = typeClick;
			stg1UlLi1.appendChild(stgType1);
		})

		//添加收藏类型
		var stg1UlLi2 = document.createElement("li");stg1Ul.appendChild(stg1UlLi2);
		var stgType2 = new LabelInput("我的收藏", "stg-type","stg-type","radio",100,"我收藏的地下城");
		stgType2.input.onclick = typeClick;
		stg1UlLi2.appendChild(stgType2);
	}


	var stg2Box = document.createElement("div");stgBox.appendChild(stg2Box);
	stg2Box.className = "stg-box stg-box-2";
	var stg2Ul = document.createElement("ul");stg2Box.appendChild(stg2Ul);

	//征求文本信息
	var req = form.querySelector("[name=req]");
	var msgBox = document.createElement("select");stgBox.appendChild(msgBox);
	msgBox.size = 5;
	msgBox.className = "stg-box msg-box";
	msgBox.onclick = function(){
		var msg = config.message[this.value];
		if (msg !== undefined)
			insertText(req,msg);
			//req.value += msg;
	}

	function refreshMessageList()
	{
		while(msgBox.options.length>0) //清空原来的短语列表
		{
			msgBox.remove(0);
		}
		config.message.forEach(function(item,index){
			var opt = new Option(item, index);
			msgBox.add(opt);
		})
	}
	function insertText(obj,str) {
		if (document.selection) {
			var sel = document.selection.createRange();
			sel.text = str;
		} else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
			var startPos = obj.selectionStart,
			endPos = obj.selectionEnd,
			cursorPos = startPos,
			tmpStr = obj.value;
			obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
			cursorPos += str.length;
			obj.selectionStart = obj.selectionEnd = cursorPos;
		} else {
			obj.value += str;
		}
	}

	var msgBoxCtl = document.createElement("div");stgBox.appendChild(msgBoxCtl);
	msgBoxCtl.className = "msg-box-control";
	var msgAdd = document.createElement("input");msgBoxCtl.appendChild(msgAdd);
	msgAdd.type = "button";
	msgAdd.id = msgAdd.className = "message-add";
	msgAdd.value = "+";
	msgAdd.onclick = function(){
		var str = prompt("请输入需要保存的短语");
		if (str == null) return;
		config.message.push(str);
		saveConfig(1);
		refreshMessageList();
	};
	var msgRmv = document.createElement("input");msgBoxCtl.appendChild(msgRmv);
	msgRmv.type = "button";
	msgRmv.id = msgRmv.className = "message-remove";
	msgRmv.value = "-";
	msgRmv.onclick = function(){
		config.message.splice(msgBox.selectedIndex,1);
		saveConfig(1);
		refreshMessageList();
	};

	//刷新地下城列表类型
	function refreshStageList1(type)
	{
		if (type == undefined)type = 0;
		for (var ci = stg2Ul.childNodes.length-1;ci>=0;ci--) //清空主图列表
		{
			stg2Ul.childNodes[ci].remove();
		}
		var stages; //需要处理的数组
		if (type == 100)
		{
			stages = config.starStage;
		}else if (type >=0 )
		{
			if (config.todayStage[type] == undefined) return;
			stages = config.todayStage[type].stages;
		}else
		{
			console.error("未知的地下城类型",type,stages);
			return;
		}

		if (typeof(stages) != "object") return;
		stages.forEach(function(stgName)
		{
			var _stgName = stgName;
			var li = document.createElement("li");stg2Ul.appendChild(li);
			var stgLbl = new LabelInput(null, "stg-list","stg-list","radio",_stgName,"地下城大关卡：" + _stgName);
			li.appendChild(stgLbl);
			stgLbl.input.onclick = refreshStageList2;

			var icon = document.createElement("div"); stgLbl.appendChild(icon);
			icon.className = "stage-icon";
			var thisStage = stageList.filter(function(stg){return stg.name == _stgName;})[0]
			if (thisStage) icon.style.backgroundImage = "url(" + thisStage.iconUrl + ")";
			
			var detail =  document.createElement("div"); stgLbl.appendChild(detail);
			detail.className = "stage-detail";
			detail.appendChild(document.createTextNode(_stgName));
			
		})
	}

	function refreshStageList2()
	{
		if (!this.checked) return; //如果并不是自身被选中，那么就没反应
		var _stgName = this.value;
		var thisStage = stageList.filter(function(stg){return stg.name == _stgName;})[0]
		if (thisStage == undefined)
		{
			alert("😱数据库里没有这个地下城");
			return;
		}

		stage0.selectedIndex = stage0.options.length - 1; //选中“上次登录的关卡”

		while(stage1.options.length>0) //清空原来的主地下城列表
		{
			stage1.remove(0);
		}
		while(stage2.options.length>0) //清空原来的子地下城列表
		{
			stage2.remove(0);
		}

		var opt = new Option(thisStage.name, thisStage.name);
		stage1.add(opt);
		stage1.selectedIndex = stage1.options.length - 1;

		thisStage.subStage.forEach(function(stg){
			var opt = new Option(stg.name, stg.name);
			stage2.add(opt);
		})
		stage2.selectedIndex = 0;
	}

	function addStarStage(name)
	{
		if (config.starStage.indexOf(name)<0)
		{
			if (!stageList.some(function(item){ //查找以前有没有这个地图
				return item.name == name;
			}))
				alert("😱数据库里没有这个地下城");
			else{
				config.starStage.push(name);
				saveConfig(1);
				stg1Ul.querySelector("input[value='100']").click(); //点击刷新
				//alert("💗“"+ name +"”收藏成功");
			}
		}else
		{
			alert("😅“"+ name +"”已经收藏过了");
		}
	}
	function removeStarStage(name)
	{
		if (name == undefined)
		{
			config.starStage.length = 0; //如果没有输入，直接清空
			saveConfig(1);
			stg1Ul.querySelector("input[value='100']").click(); //点击刷新
			//alert("收藏清空了");
			return;
		}
		var index = config.starStage.indexOf(name);
		if (index<0)
		{
			alert("😅你并没有收藏过“"+ name +"”");
		}else
		{
			config.starStage.splice(index,1)
			saveConfig(1);
			stg1Ul.querySelector("input[value='100']").click(); //点击刷新
			//alert("“"+ name +"”被删掉了");
		}
	}
	var btnBox1 = document.createElement("div");box.appendChild(btnBox1);
	var btnAddStg = document.createElement("input");btnBox1.appendChild(btnAddStg);
	btnAddStg.type = "button";
	btnAddStg.id = btnAddStg.className = "add-stage-string";
	btnAddStg.value = "直接输入名称添加收藏";
	btnAddStg.onclick = function(){
		addStarStage(prompt("请输入地下城名称"));
	};
	var btnRemoveStg = document.createElement("input");btnBox1.appendChild(btnRemoveStg);
	btnRemoveStg.type = "button";
	btnRemoveStg.id = btnRemoveStg.className = "remove-stage";
	btnRemoveStg.value = "删除选中地下城收藏";
	btnRemoveStg.onclick = function(){
		var radios = document.getElementsByName("stg-list");
		for (var ri=0;ri<radios.length;ri++)
		{
			if (radios[ri].checked)
			{
				removeStarStage(radios[ri].value);
			}
		}
	};
	var btnRemoveAllStg = document.createElement("input");btnBox1.appendChild(btnRemoveAllStg);
	btnRemoveAllStg.type = "button";
	btnRemoveAllStg.id = btnRemoveAllStg.className = "remove-stage";
	btnRemoveAllStg.value = "清空我的收藏";
	btnRemoveAllStg.onclick = function(){
		removeStarStage();
	};

	var btnBox2 = document.createElement("div");box.appendChild(btnBox2);
	var chkUpt = document.createElement("input");btnBox2.appendChild(chkUpt);
	chkUpt.type = "button";
	chkUpt.id = chkUpt.className = "checkUpdate";
	chkUpt.value = "检查今日开放地下城";
	chkUpt.onclick = function(){
		checkTodayUpdate(function(){
			refresTypeList();
			saveConfig(1);
			refreshStageList1(0);
		})
	}

	var chkStgLst = document.createElement("input");btnBox2.appendChild(chkStgLst);
	chkStgLst.type = "button";
	chkStgLst.id = chkUpt.className = "check-stage-list";
	chkStgLst.value = "获取完整地下城数据";
	chkStgLst.onclick = function(){
		checkAllStageList();
	}

	var ioCfg = document.createElement("input");btnBox2.appendChild(ioCfg);
	ioCfg.type = "button";
	ioCfg.id = chkUpt.className = "input-output-config";
	ioCfg.value = "导入/导出设置&地下城列表";
	ioCfg.onclick = function(){
		var dlg = ioConfigDialog();
		form.parentElement.appendChild(dlg);
		dlg.classList.remove("display-none");
		dlg.configText.value = JSON.stringify(config);
		dlg.stageListText.value = JSON.stringify(stageList);
	};

	//收藏按钮
	var stage0 = form.querySelector("[name=column1]");
	var stage1 = form.querySelector("#stage");
	var stage2 = form.querySelector("#stage2"); stage2.onchange = null;
	var starStg = document.createElement("input");form.insertBefore(starStg,stage2.nextSibling);
	starStg.type = "button";
	starStg.id = starStg.className = "star-stage";
	starStg.value = "⭐️";
	starStg.onclick = function(){
		addStarStage(stage1.value);
	};

	var infoBox = document.createElement("div");box.appendChild(infoBox);
	infoBox.id = infoBox.className = "info-box";
	refresTypeList();
	refreshStageList1(0); //先刷新地下城吧
	refreshMessageList(); //刷新文本列表
}
function checkTodayUpdate(callback)
{
	log("开始检查今日地下城");
	GM_xmlhttpRequest({
		method: "GET",
		url: "desktop/", //主页
		onload: dealMainPage,
		onerror: function(response) {
			log("获取主页地下城活动失败");
			console.error("获取主页地下城活动失败",response);
		}
	});

	function dealMainPage(response)
	{
		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		//紧急活动地下城表格
		var JinJiEvent = PageDOM.querySelector("#container>.item:nth-of-type(1)>table:nth-of-type(2)");
		//今天的降临
		if (JinJiEvent.rows[2] == undefined || JinJiEvent.rows[2].cells[1] == undefined) {alert("😅未发现今日数据，是不是主页格式有问题？"); return;}
		
		config.todayStage.length = 0; //先清空

		var JiangLin = JinJiEvent.rows[2].cells[1].getElementsByTagName("a");
		var stgs1 = {name:"每日降临",detail:"每天都会更换一次的降临神，保持24小时。",stages:[]};
		for (var ai=0;ai<JiangLin.length;ai++)
		{
			var link = JiangLin[ai];
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) && stgs1.stages.indexOf(link.title)<0)
			{
				stgs1.stages.push(link.title);
			}
		}
		config.todayStage.push(stgs1);
		//今天的紧急
		var stgs2 = {name:"紧急降临",detail:"每天分组出现的紧急本，每个组一小时。",stages:[]};
		for (var ri=1;ri<JinJiEvent.rows[2].cells[0].rowSpan;ri++)
		{
			var link = JinJiEvent.rows[2+ri].cells[0].querySelector("a");
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) && stgs2.stages.indexOf(link.title)<0)
			{
				stgs2.stages.push(link.title);
			}
		}
		config.todayStage.push(stgs2);
	
		//长期活动地下城表格
		//第一行周回本
		var ChangQiEvent = PageDOM.querySelector("#container>.item:nth-of-type(2)>table:nth-last-of-type(1)");
		var stgs3 = {name:"耀日本",detail:"每周分星期几固定出现的本",stages:[]};
		var imgsArr = [ChangQiEvent.rows[1].getElementsByTagName("img"),ChangQiEvent.rows[3].getElementsByTagName("img")];
		for (var iAi=0;iAi<imgsArr.length;iAi++)
		{
			var imgs = imgsArr[iAi];
			for (var ii=0;ii<imgs.length;ii++)
			{
				var link = imgs[ii].parentElement;
				if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) //是场景
					&& stgs3.stages.indexOf(link.title)<0
				)
				{
					stgs3.stages.push(link.title);
				}
			}
		}
		config.todayStage.push(stgs3);

		//后面的活动
		var stgs4 = {name:"长期活动",detail:"各种活动的本",stages:[]};
		for (var ri=4;ri<ChangQiEvent.rows.length;ri++)
		{
			var imgs = ChangQiEvent.rows[ri].getElementsByTagName("img");
			var typeStr = ""; //储存地下城类型说明
			var typeSpan = ChangQiEvent.rows[ri].cells[2].querySelector("span"); //获取文字型类别
			if (typeSpan != undefined)
			{
				typeStr = typeSpan.textContent;
			}
			var typeImg = ChangQiEvent.rows[ri].cells[2].querySelector("img"); //获取图片型类别
			if (typeImg != undefined)
			{
				typeStr = typeImg.alt;
			}
			var endTime = "";
			var endTimeTd = ChangQiEvent.rows[ri].cells[3]; //获取开始时间
			if (endTimeTd != undefined)
			{
				endTime = endTimeTd.childNodes[1].nodeValue;
			}
			for (var ii=0;ii<imgs.length;ii++)
			{
				var link = imgs[ii].parentElement;
				var href = link.getAttribute("href");
				if (new RegExp(stageTestReg,"igm").test(href) //是场景
					&& !/coin\.png/igm.test(imgs[ii].getAttribute("src")) //不是金币地下城
					&& !/後開始/igm.test(endTime) //不是还没有开始的
					&& !/一次通關限定/igm.test(typeStr) //不是一次通关限定
					&& !/排名地下城/igm.test(typeStr) //不是排名地下城
					&& !/每天一場/igm.test(typeStr) //不是每天一场限定
					&& !/單人限定/igm.test(typeStr) //不是单人限定
					&& stgs4.stages.indexOf(link.title)<0
				)
				{
					var realName = link.title.replace(/【.*】/igm,"");
					if (href.indexOf(link.title)>=0)
					{
						stgs4.stages.push(link.title);
					}else if (href.indexOf(realName)>=0)
					{
						stgs4.stages.push(realName);
					}else //那些活动title和场景stage名字不符
					{
						var realName = link.title.replace(/【.*】/igm,"");
						var subStageReg = "^/?s(?:tage)?/([^/]+)/[^/]+"; //用来测试href是不是有子地下城的
						if (new RegExp(subStageReg,"igm").test(href))
						{
							var stgV = new RegExp(subStageReg,"igm").exec(href);
							stgs4.stages.push(stgV[1]);
						}
					}
				}
			}
		}
		config.todayStage.push(stgs4);

		config.updateDate = getLocalTime(9).getTime();
		log("今日有" + config.todayStage.reduce(function(previous, current){return previous + current.stages.length},0) + "个地下城");
		//console.log("今日地下城获取完毕",config);
		callback();
	}
}
//关卡大家都有的部分，类
function minStage(name,iconUrl)
{
	this.name = name;
	this.iconUrl = iconUrl;
}
//单个难度地下城关卡，类
function Stage(name,iconUrl,stamina,battles)
{
	var obj = new minStage(name,iconUrl);
	obj.stamina = stamina; //体力
	obj.battles = battles; //层数
	return obj;
}
//多个难度的地下城关卡，类
function mainStage(name,iconUrl)
{
	var obj = new minStage(name,iconUrl);
	obj.name = name;
	obj.iconUrl = iconUrl;
	obj.subStage = [];
	obj.checkSubStage = function(callback)
	{
		GM_xmlhttpRequest({
			method: "GET",
			url: "stage/" + this.name,
			onload: function(response){ //获取成功
				var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
				var subStageList = PageDOM.querySelector("#wrapper>table:nth-last-of-type(2) ul"); //子关卡的列表ul
				if (subStageList == undefined) //如果没找到，试试手机版
				{
					subStageList = PageDOM.querySelector(".content>ul");
					if (subStageList!=undefined)
					{
						mobile = true;
					}else
					{
						alert("😰 " + name + " 页面未找到關卡資料");
					}
				}

				var subStage = subStageList.getElementsByTagName("li"); //所有的li

				obj.subStage.length = 0; //去掉所有的旧数据
				for (var si=0;si<subStage.length;si++)
				{
					var link = subStage[si].querySelector("div a"); //图标链接
					var iconUrl = link.querySelector("img").getAttribute("data-original");
					var detailTd = subStage[si].querySelector("div:nth-of-type(2)"); //介绍格
					if (detailTd == undefined)
					{ //目前不知道到底是谁错了
						console.error("没有介绍格",subStage[si]);
					}
					var name = detailTd.querySelector("a").textContent.replace(/\s*關卡資料.*$/igm,"");
					var stamina = 0;var battles = 0;
					for (var ci=0;ci<detailTd.childNodes.length;ci++)
					{
						var cld = detailTd.childNodes[ci];
						if (cld.nodeName == "SPAN" && /體力/igm.test(cld.previousSibling.nodeValue))
							var stamina = parseInt(cld.textContent);
						if (cld.nodeName == "SPAN" && /層數/igm.test(cld.previousSibling.nodeValue))
							var battles = parseInt(cld.textContent);
					}
					var stage = new Stage(name,iconUrl,stamina,battles);
					obj.subStage.push(stage);
				}
				callback();
			},
			onerror: function(response) {
				log("获取 " + obj.name + " 详情失败");
				console.error("获取 " + obj.name + " 详情失败",response);
			},
		});
	}
	return obj;
}
function checkAllStageList(resetAll = false)
{
	GM_xmlhttpRequest({
		method: "GET",
		url: "stage",
		onload: dealStageList,
		onerror: function(response) {
			log("获取全部地下城列表失败");
			console.error("获取全部地下城列表失败",response);
		},
	});

	function dealStageList(response)
	{
		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		if (resetAll) stageList.length = 0; //先清空
		//所有地下城表格
		var stageTd = PageDOM.querySelector("#wrapper>table:nth-last-of-type(2) td");
		if (stageTd == undefined) //如果没找到，试试手机版
		{
			stageTd = PageDOM.querySelector(".content");
			if (stageTd!=undefined)
			{
				mobile = true;
			}else
			{
				alert("😰未找到地下城列表");
			}
		}
		var stages = stageTd.getElementsByClassName("tooltip"); //获取所有的链接
		if(mobile)
		{
			stages = stageTd.getElementsByTagName("a"); //获取所有的链接
		}
		stages = Array.prototype.slice.call(stages); //将类数组转换为数组
		stages = stages.filter(function(item){ //清除没有图标的链接和不是地下城的链接
			return new RegExp(stageTestReg,"igm").test(item.getAttribute("href")) //是地下城链接
					&& item.querySelector("img") != undefined; //有图标
		})

		//检查是否已经存在，否则添加新的
		function checkExistAdd(newStage,resetAll = false)
		{
			var oldStage = stageList.filter(function(item){ //查找以前有没有这个地图
				return item.name == newStage.name;
			})[0];
			if (resetAll || oldStage == undefined)
			{ //没有就添加新的
				newStages.push(newStage);
			}else
			{ //有的话就什么也不改变
				//oldStage.name = newStage.name;
				//oldStage.iconUrl = newStage.iconUrl;
			}
		}

		var newStages = [];
		//所有地下城
		stages.forEach(function(item) {
			var img= item.querySelector("img");
			imgUrl = img.getAttribute("data-original");
			checkExistAdd(new mainStage(mobile?img.alt:item.title,imgUrl),resetAll);
		});
		//▼添加暂时没有的特殊图
		//checkExistAdd(new mainStage("闇の戦武龍","http://i1296.photobucket.com/albums/ag18/skyozora/pets_icon/3839_zpsinupxf0j.png"),resetAll);
		//▲添加暂时没有的特殊图

		//var stageArr = stageList.slice(398,400); //debug用
		getStageDetail(newStages,newStages.length,function(){
			stageList = stageList.concat(newStages);
			log("所有地下城获取完毕");
			//console.log("所有地下城获取完毕",config);
			saveConfig(2);
		});
	}
	function getStageDetail(stgArr,max,callback)
	{
		if (stgArr.length < 1)
		{
			callback();
			return;
		}
		var newStgArr = stgArr.concat();
		var thisStg = newStgArr.shift(); //删除新数组的第一个元素

		thisStg.checkSubStage(function(){
			log("已获取" + (max-newStgArr.length) + "/" + max);
			console.log("已获取" + (max-newStgArr.length) + "/" + max);
			getStageDetail(newStgArr,max,callback);
		});
	}
}

/*
 * 协力列表页面
 * 
 */
function multiplayPage()
{
	var table = document.querySelector("#wrapper>table:nth-last-of-type(2) table"); //协力请求表格
	if (table == undefined) //如果没找到，试试手机版
	{
		table = document.querySelector(".content>table");
		if (table!=undefined)
		{
			mobile = true;
		}else
		{
			alert("😰未找到协力列表");
		}
	}
	var cellMaxLength = 0;
	for (var ci=0;ci<table.rows[0].cells.length;ci++)
	{
		cellMaxLength += table.rows[0].cells[ci].colSpan; //计算宽度
	}
	for (var ri=table.rows.length-1;ri>0;ri--)
	{
		if (table.rows[ri].cells[0].colSpan >= cellMaxLength)
		{
			table.rows[ri].remove(); //去除广告
		}
	}
	if (!mobile) table.rows[0].cells[0].colSpan += 1; //标题添加一格合并
	for (var ri=(mobile?0:1);ri<table.rows.length;(mobile?ri+=nextRow+1:ri++))
	{
		var stageNameCell = table.rows[ri].cells[1]; //获取名字的格
		if (mobile)
		{
			var nextRow = table.rows[ri].cells[0].rowSpan++; //增加一跨行
			var newRow = table.insertRow(ri+nextRow);
			newRow.bgColor = table.rows[ri].bgColor;
			var newCell = newRow.insertCell(0); //添加新格
		}else
		{
			var newCell = table.rows[ri].insertCell(2); //添加新格
		}

		var link1 = stageNameCell.querySelector("a");
		var link2 = stageNameCell.querySelector("a:nth-of-type(2)");
		var stage1 = stageList.filter(function(item){
			return item.name == link1.textContent;
		})[0];
		if (stage1 == undefined) //如果发现没有数据的图，跳过
		{
			console.error("没有主关卡数据",link1.textContent)
			continue;
		}
		var stage2 = stage1.subStage.filter(function(item){
			return item.name == link2.textContent;
		})[0];
		if (stage2 == undefined) //如果发现没有数据的图，跳过
		{
			console.error("没有子关卡数据",link2.textContent)
			continue;
		}
		//newCell.appendChild(document.createTextNode(stage2.stamina + "体"));
		//newCell.appendChild(document.createElement("br"));
		newCell.appendChild(document.createTextNode("协力" + Math.round(stage2.stamina/2) + "体"));
		if (!mobile) newCell.appendChild(document.createElement("br")); else newCell.appendChild(document.createTextNode("，"));
		newCell.appendChild(document.createTextNode(stage2.battles + "层"));
	}
}


function ioConfigDialog()
{
	var box = document.querySelector("#io-config-dialog");
	if (box != undefined) return box;

	var box = document.createElement("div");
	box.id = box.className = "io-config-dialog";
	box.className = "display-none";

	var txtBox = document.createElement("div");box.appendChild(txtBox);
	txtBox.className = "text-box";
	var divConfig = document.createElement("div");txtBox.appendChild(divConfig);
	divConfig.className = "text-lbl-box";
	var lblConfig = document.createElement("label");divConfig.appendChild(lblConfig);
	lblConfig.appendChild(document.createTextNode("设置："));
	lblConfig.appendChild(document.createElement("br"));
	var txtConfig = document.createElement("textarea");lblConfig.appendChild(txtConfig);
	txtConfig.id = txtConfig.className = "text-config";
	txtConfig.value = "";
	box.configText = txtConfig;

	var divStageList = document.createElement("div");txtBox.appendChild(divStageList);
	divStageList.className = "text-lbl-box";
	var lblStageList = document.createElement("label");divStageList.appendChild(lblStageList);
	lblStageList.appendChild(document.createTextNode("地下城列表："));
	lblStageList.appendChild(document.createElement("br"));
	var txtStageList = document.createElement("textarea");lblStageList.appendChild(txtStageList);
	txtStageList.id = txtStageList.className = "text-stage-list";
	txtStageList.value = "";
	box.stageListText = txtStageList;

	var btnBox = document.createElement("div");box.appendChild(btnBox);
	btnBox.className = "botton-box";
	var btnIpt = document.createElement("input");btnBox.appendChild(btnIpt);
	btnIpt.type = "button";
	btnIpt.id = btnIpt.className = "input-config";
	btnIpt.value = "导入设置";
	btnIpt.onclick = function(){
		var bk = loadConfig(txtConfig.value,txtStageList.value,true);
		if (bk[0] && bk[1])
		{
			saveConfig();
			alert("😄导入成功");
		}else
		{
			if(!bk[0])alert("😰该设置信息格式不正确");
			if(!bk[1])alert("😰该地下城列表信息格式不正确");
		}
	}

	var btnCls = document.createElement("input");btnBox.appendChild(btnCls);
	btnCls.type = "button";
	btnCls.id = btnCls.className = "close-dialog";
	btnCls.value = "关闭";
	btnCls.onclick = function(){box.classList.add("display-none");}

	return box;
}