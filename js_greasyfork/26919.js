// ==UserScript==
// @name         百度找片
// @namespace    https://greasyfork.org/zh-CN/scripts/26919
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @contributionURL https://sinacloud.net/backrunner/img/alipay.jpg
// @version      2.0.1
// @description  【让百度搜索聚合找片功能】，从此找片更为方便！
// @author       BackRunner
// @include      *://www.baidu.com*
// @exclude      *://www.baidu.com/link?url*
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/26919/%E7%99%BE%E5%BA%A6%E6%89%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/26919/%E7%99%BE%E5%BA%A6%E6%89%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
	//变量定义
	var isOpen = true;

	var content = '';
	var judge = false;
	var engineIndex = 0;	

	var engineList = new Array();
	var divList = new Array();
	var hrList = new Array();
	var inputList = new Array();

	var ctrlContainer;
	var cPanel;
	//数组Remove
	Array.prototype.remove=function(dx) 
	{ 
		if(isNaN(dx)||dx>this.length){return false;} 
		for(var i=0,n=0;i<this.length;i++) 
		{ 
			if(this[i]!=this[dx]) 
			{ 
				this[n++]=this[i];
			} 
		} 
		this.length-=1;
	} ;

	var Engine = {
		new:function(){
			var a = {};
			a.name = "";
			a.link = "";
			return a;
		}
	};
	//主执行区
	initialize();
	if (isOpen){
		process_direct();		
		bindEvent();
		addCSS();
		addSetting();
	}
	//初始化
	function initialize(){
		engineList = initialize_var("engineList",new Array());
		isOpen = initialize_var("isOpen",true);
		engineIndex = initialize_var("lastIndex",0);
	}
	function initialize_var(name,defaultSet){
		var obj = GM_getValue(name,defaultSet);
		if (obj === undefined){
			obj = defaultSet;
		}
		return obj;
	}

	//跳转处理
	function process_direct(){
		var search = window.location.search;
		var part = search.split('&');
		for (var i=0;i<part.length;i++){
			if (part[i].indexOf("wd=")!==-1){
				content = part[i].replace('wd=','');
			}
		}
		part = content.split('%20');
		if (part[part.length - 1]==="%E6%89%BE%E7%89%87"){
			content = content.replace('%20%E6%89%BE%E7%89%87','');
			if (content !== (encodeURIComponent(GM_getValue("lastContent")))){
				//跳转
				//window.location.href = "http://www.zmz2017.com/search/index?keyword="+content;
				redirect(content);
			}
			GM_deleteValue("lastContent");
		}
	}
	//判断并截取搜索内容
	function process_event(){
		content = $('#kw').val();
		var part = content.split(' ');
		if (part[part.length-1] === '找片'){
			judge = true;			
			content = content.replace(' 找片','');
			GM_setValue('lastContent',content);
			//跳转
			//window.location.href = "http://www.zmz2017.com/search/index?keyword="+content;
			redirect(content);
			//reset
			judge=false;
		}
	}
	//跳转
	function redirect(content){
		if (engineList[engineIndex] !== undefined){
			var engineLink = engineList[engineIndex].link;
			engineLink = engineLink.replace("%content%",content);
			window.location.href = engineLink;
		}
	}
	//绑定百度一下按钮和回车
	function bindEvent(){
		try{
			var btn = document.getElementById('su');
			btn.addEventListener('click',process_event);
		}catch(e){
			console.error(e);
		}
	}
	function addSetting(){
		var ctrlDiv = document.createElement('div');	
		ctrlDiv.setAttribute('class','br-setting');
		//矩形
		var a = document.createElement('a');
		a.setAttribute('class','icon-setting');
		a.setAttribute('id','br-setting-icon');
		ctrlDiv.appendChild(a);
		//层
		var ctrl = document.createElement('div');
		cPanel = ctrl;
		ctrl.setAttribute('class','br-ctrl');
		//容器背景
		var box = document.createElement('a');
		box.setAttribute('class','br-ctrl-bg');
		//容器
		var container = document.createElement('div');
		ctrlContainer = container;
		container.setAttribute('class','br-ctrl-container');
		box.appendChild(container);

		//内容
		addTitleToSetting(container,"百度找片 (2.0.1) | 设置");
		addCheckBoxToSetting(container,"总开关","main");
		addSubTitleToSetting(container,"引擎选择","engine");
		addButtonToSetting(container,"添加引擎","添加","addEngine");
		//引擎列表初始化
		for (var i=0;i<engineList.length;i++){
			addEngineToSetting(container,engineList[i],false);
		}
		//单选初始化
		if (inputList[engineIndex] !== undefined){
			inputList[engineIndex].checked = true;
		}
		//内容
		addSubTitleToSetting(container,"操作","operation");
		addButtonToSetting(container,"前往 GreasyFork 检查更新","检查","update");
		addButtonToSetting(container,"获取推荐引擎列表","获取","getlist");
		addButtonToSetting(container,"捐赠以感谢作者","捐赠","donate");		

		ctrl.appendChild(box);

		document.body.appendChild(ctrlDiv);
		document.body.appendChild(ctrl);

		//添加引擎事件绑定
		try{
			var btn_addEngine = document.getElementById("br-ctrl-addEngine");
			btn_addEngine.addEventListener('click',addEngine);
		} catch(e){
			console.error(e);
		}
		//绑定控制面板鼠标事件
		ctrlDiv.addEventListener('mouseenter',ctrlMouseEnter);
		ctrlDiv.addEventListener('mouseenter',ctrlMouseEnter);
		ctrl.addEventListener('mouseleave',ctrlMouseLeave);
		ctrl.addEventListener('mouseleave',ctrlMouseLeave);
		//总开关事件绑定
		try{
			var cb = document.getElementById('br-ctrl-main');
			cb.addEventListener('click',targetMain);
			//总开关初始化
			cb.checked = isOpen;
		} catch (e) {
			console.error(e);
		}
		//操作按钮事件绑定
		try{
			var btn_update = document.getElementById('br-ctrl-update');
			var btn_getlist = document.getElementById('br-ctrl-getlist');
			var btn_donate = document.getElementById('br-ctrl-donate');
			btn_update.addEventListener('click',updateEvent);
			btn_getlist.addEventListener('click',getlistEvent);
			btn_donate.addEventListener('click',donateEvent);
		} catch (e){
			console.error(e);
		}
	}

	function addEngine(){
		if (engineList.length === 0){
			engineIndex=-1;
		}
		var e = Engine.new();
		e.name = prompt("请输入 引擎名称");
		if (e.name !== null && e.name !== ""){
			e.link = prompt("请输入 引擎调用链接，搜索内容用关键字 %content% 代替");
			if (e.link !== null && e.link !== ""){
				if (e.link.indexOf("%content%") !== -1){
					engineList.push(e);
					addEngineToSetting(ctrlContainer,e,true);
					saveSetting();
				} else {
					if (confirm("您输入的调用链接中不含 %content% ，是否重新创建？")){
						addEngine();
					}
				}
			}
		}
	}
	//总开关事件
	function targetMain(){
		isOpen = event.target.checked;
		saveSetting();
	}

	//控制面板鼠标事件
	function ctrlMouseEnter(){
		cPanel.setAttribute('style','display:block !important;');
	}
	function ctrlMouseLeave(){
		cPanel.setAttribute('style','display:none;');
	}

	//操作按钮事件
	function updateEvent(){
		window.open('https://greasyfork.org/zh-CN/scripts/26919');
	}
	function getlistEvent(){
		window.open('http://blog.backrunner.top/p/120');
	}
	function donateEvent(){
		window.open('https://backrunner.top/img/alipay.jpg');
	}

	function deleteEngine(){
		if (confirm("是否删除该引擎？")){
			var button = event.target;
			var div = button.parentNode;
			var index = divList.indexOf(div);
			if (index !== -1){	
				div.parentNode.removeChild(hrList[index]);
				div.parentNode.removeChild(div);
				engineList.remove(index);
				inputList.remove(index);
				hrList.remove(index);
				divList.remove(index);
			}	
			saveSetting();
		}
	}

	function saveSetting(){
		GM_setValue("isOpen",isOpen);
		GM_setValue("engineList",engineList);
		GM_setValue("lastIndex",engineIndex);
	}

	function addTitleToSetting(container,content){
		var div = document.createElement('div');
		div.setAttribute('class','br-ctrl-main');
		var h2 = document.createElement('h2');
		var hr = document.createElement('hr');

		h2.innerHTML = content;

		div.appendChild(h2);

		container.appendChild(div);
		container.appendChild(hr);
	}

	function addSubTitleToSetting(container,content,id){
		var div = document.createElement('div');
		div.setAttribute('class','br-ctrl-main');
		div.setAttribute('id','br-ctrl-sub-'+id);
		var h3 = document.createElement('h3');
		var hr = document.createElement('hr');

		h3.innerHTML = content;

		div.appendChild(h3);

		container.appendChild(div);
		container.appendChild(hr);
	}

	function addCheckBoxToSetting(container,content,id){
		var div = document.createElement('div');
		div.setAttribute('class','br-ctrl-main');
		var span = document.createElement('span');
		var input = document.createElement('input');
		var hr = document.createElement('hr');

		input.setAttribute('id',"br-ctrl-" + id);
		input.setAttribute('type','checkbox');

		span.innerHTML = content;

		div.appendChild(span);
		div.appendChild(input);

		container.appendChild(div);
		container.appendChild(hr);
	}

	function addEngineToSetting(container,engine,toLast){
		var div = document.createElement('div');
		var o_div = document.getElementById('br-ctrl-sub-operation');
		div.setAttribute('class','br-ctrl-main');
		var span = document.createElement('span');
		var input = document.createElement('input');
		var button = document.createElement('button');
		var hr = document.createElement('hr');		

		input.setAttribute('type','radio');
		input.setAttribute('name','br-engine');
		//如果为第一个引擎则执行
		if (engineIndex === -1){
			engineIndex = 0;
			input.checked = true;
		}
		button.innerHTML = "删除";
		//为删除按钮绑定事件
		try{
			button.addEventListener('click',deleteEngine);
		} catch(e){
			console.error(e);
		}
		//为单选绑定事件
		try{
			input.addEventListener('click',radioSelected);
		} catch (e){
			console.error(e);
		}

		span.innerHTML = engine.name;

		div.appendChild(span);
		div.appendChild(button);
		div.appendChild(input);

		if (!toLast){
			container.appendChild(div);
			container.appendChild(hr);
		}else{
			container.insertBefore(div,o_div);
			container.insertBefore(hr,o_div);
		}
		//加入列表
		divList.push(div);
		hrList.push(hr);
		inputList.push(input);
	}
	//单选事件
	function radioSelected(){
		engineIndex = inputList.indexOf(event.target);
		saveSetting();
	}

	function addButtonToSetting(container,content,btnContent,id){
		var div = document.createElement('div');
		div.setAttribute('class','br-ctrl-main');
		var span = document.createElement('span');
		var button = document.createElement('button');
		var hr = document.createElement('hr');

		button.setAttribute('id',"br-ctrl-" + id);

		span.innerHTML = content;
		button.innerHTML = btnContent;

		div.appendChild(span);
		div.appendChild(button);

		container.appendChild(div);
		container.appendChild(hr);
	}

	//CSS添加
	function addCSS(){
		var cssText = "";

		cssText += ".br-setting {width: 22px;position: fixed;bottom: 20px;right: 25px;font-size: 0;line-height: 0;z-index: 100;}";
		cssText += ".br-setting a {width:22px;height:22px;display: inline-block;background-image:url(https://sinacloud.net/backrunner/icons/zhaopian_icon.png);background-repeat:norepeat;background-position:center;background-color: #ddd;margin-bottom: 2px;border-radius:4px 4px 4px 4px;opacity:0.4;} .br-setting a:hover {background-color: #669fdd;}";
		cssText += ".br-ctrl {display:none !important;width:300px;position:fixed;bottom:16px;right:50px;display:block;}";
		cssText += ".br-ctrl-bg {width:300px;height:480px;display: inline-block;background-color: #ddd;margin-bottom: 2px;border-radius:4px 4px 4px 4px;opacity:0.65;}";
		cssText += ".br-ctrl-container {width:300px;height:480px;position:fixed;overflow-x:hidden;} .br-ctrl-container ::-webkit-scrollbar-button{display:none;}";
		cssText += ".icon-setting {background-position: 0 -266px;}";
		cssText += ".br-ctrl-main {text-align:left !important;display: block;margin-top:10px;margin-left:20px;margin-bottom:10px;line-height:18px} .br-ctrl-main h2{display:inline-block;font-size:20px;-webkit-margin-before: 0.83em;-webkit-margin-after: 0.83em;-webkit-margin-start: 0px;-webkit-margin-end: 0px;} .br-ctrl-main h3{display:inline-block;font-size:16px;-webkit-margin-before:initial !important;-webkit-margin-after:initial !important;-webkit-margin-before: 0px;-webkit-margin-after: 0px;-webkit-margin-start: 0px;-webkit-margin-end: 0px;} .br-ctrl-main span {display;inline-block;font-size:14px;} .br-ctrl-main input,button {display;inline-block;float:right;margin-right:12px !important;margin-bottom:10px !important;}.br-ctrl-container hr{width:280px;}";
		cssText += '.br-ctrl-main input[type="radio" i] {margin: 3px 3px 0px 5px;} .br-ctrl-main input[type="checkbox" i] {margin: 3px 3px 3px 4px;}';
		cssText += '.br-ctrl-main button{margin: 0em 0em 0em 0em;padding: 1px 6px;}';
		cssText += '.br-ctrl-container hr{margin:auto !important;}';

		var modStyle = document.querySelector('#modCSS');
		if (modStyle === null)
		{
			modStyle = document.createElement('style');
			modStyle.id = 'modCSS';
			document.body.appendChild(modStyle);
		}   
		modStyle.innerHTML = cssText;
	}
})();