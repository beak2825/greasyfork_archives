// ==UserScript==
// @name         拼多多客服自动回复
// @namespace    https://greasyfork.org/zh-CN
// @version      0.4
// @description  拼多多客服自动回复!
// @author       初级程序员
// @match        https://mms.pinduoduo.com/chat-merchant/index.html*
// @match        https://mms.pinduoduo.com/login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377604/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%AE%A2%E6%9C%8D%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/377604/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%AE%A2%E6%9C%8D%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
	'use strict';
	function funDownload(content, filename) {
		var eleLink = document.createElement('a');
		eleLink.download = filename;
		eleLink.style.display = 'none';
		var blob = new Blob([content]);
		eleLink.href = URL.createObjectURL(blob);
		document.body.appendChild(eleLink);
		eleLink.click();
		document.body.removeChild(eleLink);
	}
	var changeData = window.changeData = function(){
		var newReg;
		data.Reg.length = 0;
		data.keywordNum = 0;
		window.saveData = window.saveData || JSON.parse(cache.get('saveData'));
		if(saveData){
			for(var k in saveData){
				data[k] = saveData[k];
			}
		}
		data.RegKeywords.forEach(function(item,index){
			newReg = new RegExp('('+ item[0] +')','m');
			data.Reg.push(newReg);
			data.keywordNum++;
		});
		setBtn.className = data.onoff;
	};
	window.callback = function(data){
		window.code = data;
	};
	function jsonp(callbackName,link) {
		window.code = null;
		var js = document.createElement('script');
		document.head.appendChild(js);
		js.parentNode.removeChild(js);
	}
	function events(key,json){
		var event = new UIEvent(key,{
			bubbles: true,
			cancelable: true,
			view: window,
			ctrlKey : false,
			altKey : false,
			shiftKey : false,
			metaKey : false,
		});
		if(typeof(json) === 'object'){
			for(var k in json){
				event[k] = json[k];
			}
		}else{
			event.keyCode = json || 0; 
		}
		return event;
	}
	function match(content){
		var text;
		data.Reg.forEach(function(item,index){
			if(data.Reg[index].test(content)){
				text = data.RegKeywords[index][1];
				return true;
			}
		});
		return text || data.defaultReply.replyValue;
	}
	function tipBox(content){
		var wrapper = document.createElement('div');
		wrapper.style = 'background-color:rgba(0,0,0,0.1); position:absolute; left:0; top:0; z-index:99999999; width:100%; height:100%;';
		var html = '';
		html += '<div style="width:300px; margin-top:-75px; margin-left:-150px; background-color:rgba(0,0,0,0.3); position:absolute; left:50%; top:50%;">';
		html += '   <div style="margin:15px; border:1px solid #333;">';
		html += '       <div style="height:30px; line-height:30px; color:#fff; text-align:center; background-color:#000;">提示</div>';
		html += '       <div style="background-color:#fff; color:#000; overflow:hidden;">';
		html += '            <div id="tipText" style="padding:15px; line-height:1.3em;">'+ content +'</div>';
		html += '            <div id="tipBtn" style="background-color:#000; color:#fff; height:30px; width:60px; line-height:30px; text-align:center; margin:30px auto 15px; cursor:pointer;" onclick=this.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode.parentNode)>关闭</div>';
		html += '       </div>';
		html += '   </div>';
		html += '</div>';
		wrapper.innerHTML = html;
		document.body.appendChild(wrapper);
	}
	var data = window.data = {
		onoff : 'off',
		timer : {
		},
		time : {
			autoReply : 3,
			autoRefresh : 15
		},
		event : {
			click : events('click'),
			mousedown : events('mousedown'),
			mouseup : events('mouseup'),
			input : events('input'),
			change : events('change'),
			enterdown : events('keydown',13),
			enterup : events('keyup',13)
		},
		obj : {
		},
		Reg : [],
		RegKeywords : [['','']],
		defaultReply : {
			defaultValue : '休息时间, 8点上班后回复您',
			RegValue : '你好, 同时咨询的客户较多,请您说一下需要咨询什么问题, 稍后回复您',
			hours : 8,
			minutes : 0,
			hours2 : 23,
			minutes2 : 0,
			timeStamp : timeStamp(8,0),
			timeStamp2: timeStamp(23,0)
		}
	};
	function timeStamp(h,m,s){
		var h2,m2,s2;
		h2 = (h || 0)*60*60;
		m2 = (m || 0)*60;
		s2 = s*1 || 0;
		return h2+m2+s2;
	}
	setInterval(function(){
		var time = new Date();
		var h = time.getHours();
		var m = time.getMinutes();
		var s = time.getSeconds();
		var now = timeStamp(h,m,s);
		if(data.defaultReply.timeStamp >= data.defaultReply.timeStamp2){
			if(now > data.defaultReply.timeStamp2 && now < data.defaultReply.timeStamp){
				data.defaultReply.replyValue = data.defaultReply.defaultValue;
			}else{
				data.defaultReply.replyValue = data.defaultReply.RegValue;
			}
		}else{
			if(now > data.defaultReply.timeStamp && now < data.defaultReply.timeStamp2){
				data.defaultReply.replyValue = data.defaultReply.RegValue;
			}else{
				data.defaultReply.replyValue = data.defaultReply.defaultValue;
			}
		}
	},1000);
	if(window.location.pathname.indexOf('login') > -1){
		//autoLogin();
	}else{
		var observer = new MutationObserver(autoReply);
		var options ={
			childList : true,
			subtree :true,
			attributes : true
		};
		observer.observe(document.body, options);
	}
	function refresh(){
		var btn = document.querySelectorAll('.el-button--small');
		var refreshBtn = btn[0];
		var loginBtn = btn[1];
		//聊天页 https://mms.pinduoduo.com/chat-merchant/index.html
		window.open('https://mms.pinduoduo.com','pinduoduo');
		setInterval(function(){
			refreshBtn.dispatchEvent(data.event.click);
		},data.time.autoRefresh * 1000);
	}
	function autoLogin(){
		var qrcode = document.querySelector('.tab-item');//登录后台页面的二维码和登录框选项卡
		if(qrcode){
			var openBtn = qrcode.nextElementSibling; //登录后台登录选项卡按钮
			openBtn.dispatchEvent(data.event.click);
			clearTimeout(data.timer.login);
			data.timer.login = setTimeout(function(){
				var name = document.getElementById('usernameId');
				var password = document.getElementById('passwordId');
				var codeInput = document.querySelector('.info-content-verti-code input');
				var loginBtn = document.querySelector('.info-content-verti-code').nextElementSibling;
				name.setAttribute('value','');
				name.dispatchEvent(data.event.change);
				password.setAttribute('value', '');
				password.dispatchEvent(data.event.change);
				function getma64(){
					var ma64 = document.querySelector('.vertify-code');
					if(ma64){
						ma64 = ma64.src;
						jsonp('callback',ma64);
						data.timer.insertCodeAndLogin = setInterval(function(){
							if(window.code){
								clearInterval(data.timer.insertCodeAndLogin);
								codeInput.setAttribute('value',window.code);
								codeInput.dispatchEvent(data.event.change);
								loginBtn.dispatchEvent(data.event.click);
								setTimeout(function(){
									getma64();
								});
							}
						},500);
					}else{
						getma64();
					}
				}
			},1000);
		}else{
			autoLogin();
		}
	}
	function autoReply(){
		clearTimeout(data.timer.autoReply);
		data.timer.autoReply = setTimeout(function(){
			var chatList = document.querySelector('.chat-list');
			if(!chatList){
				//refresh();
			}else{
				if(data.onoff === 'off'){
					return false;
				}
				var today = document.querySelector('.conv-recent');
				if(today.className === 'conv-recent sel'){
					today.previousElementSibling.dispatchEvent(data.event.click);
					tipBox('如果需要查看所有会话, 请先关闭自动回复功能');
				}else{
					data.obj.replyTextarea = data.obj.replyTextarea || document.querySelector('#replyTextarea');
					data.obj.sendBtn = data.obj.sendBtn || document.querySelector('.send-btn');
					data.obj.five = document.querySelector('.five-minute');
					if(data.obj.five){
						var target = data.obj.chatItemBox = data.obj.five.querySelectorAll('.chat-item-box');
						target[target.length - 1].dispatchEvent(data.event.mousedown);
						target[target.length - 1].dispatchEvent(data.event.mouseup);
						var msgList = document.querySelectorAll('.msg-list .buyer-item');
						var message = msgList[msgList.length-1].querySelector('.msg-content').textContent;
						data.obj.replyTextarea.value = match(message);
						data.obj.replyTextarea.dispatchEvent(data.event.input);
						data.obj.replyTextarea.dispatchEvent(data.event.enterdown);
						data.obj.replyTextarea.dispatchEvent(data.event.enterup);
					}
				}
			}
		},(data.time.autoReply) * 1000);
	}
	var cache = {
		set : function(k,v){
			return localStorage.setItem(k,v);
		},
		get : function(k){
			return localStorage.getItem(k);
		}
	};
	//////////////////////////////////////////////////////////
	var setHours = [];
	for(let i = 0; i < 24; i++){
		setHours.push({
			name : i + '点',
			value : i
		});
	}
	var setMinutes = [];
	for(let i = 0; i < 60; i++){
		setMinutes.push({
			name : i + '分',
			value : i
		});
	}
	function Model(name,data){
		return this[name](data);
	}
	Model.prototype.onoff = function(data){
		return {
			childs : [
				{
					type : 'label',
					value : '自动回复'
				},{
					type : 'select',
					option : [
						{
							name : '开启',
							value : 'on'
						},{
							name : '关闭',
							value : 'off'
						}
					],
					selected : data.onoff,
					title : '开启或关闭自动回复'
				},{
					type : 'input',
					placeholder : '30',
					value : data.time.autoReply
				},{
					type : 'textNode',
					value : '秒后回复,建议设置成30'
				}
			]
		};
	};
	Model.prototype.loginIn = function(data){
		return {
			childs : [
				{
					type : 'label',
					value : '自动登录'
				},{
					type : 'select',
					option : [
						{
							name : '开启',
							value : 'on'
						},{
							name : '关闭',
							value : 'off'
						}
					],
					selected : data.onoff,
					title : '开启或关闭自动回复'
				},{
					type : 'textNode',
					value : '拼多多帐号'
				},{
					type : 'input',
					value : data.time.autoReply
				},{
					type : 'textNode',
					value : '密码'
				},{
					type : 'input',
					value : data.time.autoReply
				}
			]
		};
	};
	Model.prototype.defaultReply = function(data){
		return {
			childs : [
				{
					type : 'label',
					value : '默认回复'
				},{
					type : 'textarea',
					placeholder : '请填写要回复的内容(time out)',
					value : data.defaultReply.defaultValue
				}
			],
			breakLine :	{
				childs : [
					{
						type : 'select',
						option : setHours,
						selected : Number(data.defaultReply.hours)
					},{
						type : 'select',
						option : setMinutes,
						selected : Number(data.defaultReply.minutes)
					},{
						type : 'textNode',
						value : '至',
					},{
						type : 'select',
						option : setHours,
						selected : Number(data.defaultReply.hours2)
					},{
						type : 'select',
						option : setMinutes,
						selected : Number(data.defaultReply.minutes2)
					},{
						type : 'textNode',
						value : '使用下面输入框中的内容'
					}
				],
				breakLine : {
					childs : [
						{
							type : 'textarea',
							placeholder : '请填写要回复的内容(time out)',
							value : data.defaultReply.RegValue
						}
					]
				}
			}
		};
	};
	Model.prototype.setKeyword = function(data){
		return {
			childs : [
				{
					type : 'label',
					value : '关键词'
				},{
					type : 'input',
					placeholder : '请填写关键词',
					value : data.value
				},{
					type : 'button',
					value : '↑',
					class : 'up',
					title : '上移'
				},{
					type : 'button',
					value : '↓',
					class : 'down',
					title : '下移'
				},{
					type : 'button',
					value : '+',
					class : 'add',
					title : '增加'
				},
				{
					type : 'button',
					value : '×',
					class : 'del',
					title : '删除'
				}
			],
			breakLine : {
				childs :[
					{
						type : 'label',
						value : '回复内容'
					},{
						type : 'textarea',
						placeholder : '请填写要回复的内容',
						value : data.value2
					}
				]
			}
		};
	};
	Model.prototype.saveBtn = function(){
		return {
			childs : [
				{
					type : 'button',
					value : '导出数据',
					title : '导出的是上次保存后的数据'
				},
				{
					type : 'button',
					value : '导入数据',
					title : '导入后将覆盖以前的数据'
				},
				{
					type : 'button',
					value : '保存数据',
					title : '保存此次编辑的数据'
				}
			]
		};
	};
	var indexJson = [
		{
			"moduleID" : "onoff"
		},{
			"moduleID" : "defaultReply"
		},{
			"moduleID" : "setKeyword",
		},{
			"moduleID" : "saveBtn"
		}
	];
	function json2create(item){
		item.data = item.data || {};
		var oLi = document.createElement('li');
		oLi.className = item.moduleID;
		var json = new Model(item.moduleID,item.data);
		var ele = createElements(json);
		oLi.appendChild(ele);
		return oLi;
	}
	function outputElement(json){
		var frag = document.createDocumentFragment();
		var arr2json;
		json.forEach(function(item){
			switch(item.moduleID){
				case 'setKeyword':
					data.RegKeywords.forEach(function(v){
						arr2json = {
							'moduleID' : item.moduleID,
							'data' : {
								'value' : v[0],
								'value2' : v[1],
							}
						};
						frag.appendChild(json2create(arr2json));
					});
					break;
				default:
					arr2json = {
						'moduleID' : item.moduleID,
						'data' : data
					};
					frag.appendChild(json2create(arr2json));
			}
		});
		return frag;
	}
	function createElements(json){
		var frag = document.createDocumentFragment();
		var obj = document.createElement('div');
		obj.className = 'childs';
		json.childs.forEach(function(item,index){
			obj.appendChild(createElement(item));
		});
		frag.appendChild(obj);
		if(json.breakLine){
			frag.appendChild(createElements(json.breakLine));
		}
		return frag;
	}
	function createElement(json){
		var oDiv = document.createElement('div');
		oDiv.setAttribute('class',json.type);
		if(json.title){
			oDiv.setAttribute('title',json.title);
		}
		var obj,TextNode,Option;
		if(json.type === 'textNode'){
			obj = document.createTextNode(json.value);
		}else{
			obj = document.createElement(json.type);
			switch(json.type){
				case 'select':
					json.option.forEach(function(item){
						Option = document.createElement('option');
						Option.setAttribute('value',item.value);
						if(item.value === json.selected){
							Option.selected = json.selected;
						}
						TextNode = document.createTextNode(item.name);
						Option.appendChild(TextNode);
						obj.appendChild(Option);
					});
					break;
				case 'input':
				case 'textarea':
					obj.placeholder = json.placeholder;
					obj.value = json.value || '';
					break;
				case 'button':
				case 'label':
					TextNode = document.createTextNode(json.value);
					obj.appendChild(TextNode);
					break;
			}
		}
		oDiv.appendChild(obj);
		return oDiv;
	};
	////////////////////////////////////////////////
	(function(){
		var style = document.createElement('style');
		var html = '#setBtn{ z-index: 9999999; position:absolute; right:30px; bottom:30px; background-color: red; color: #ffffff; height:60px; width:60px; padding:10px; line-height:16px; text-align:center; border-radius:50%; cursor: pointer; border:3px solid #ffffff; box-shadow:0px 0px 5px #aaa;}';
		html += '#setBtn.on{ background-color:green;}';
		html += '#setBox{ position:fixed; width:100%; height:100%;  left:0; top:0; z-index:999; background-color:rgba(0,0,0,0.2)}';
		html += '#setInner{position:absolute; left:50%; top:50%; width:800px; height:530px; margin-top:-265px; margin-left:-415px; background-color:rgba(0,0,0,0.3);}';
		html += '#setClose{ display:block; width:30px; height:30px; font-size:16px; font-family:\'微软雅黑\'; font-style:normal; line-height:30px; text-align:center; color:#fff; cursor:pointer; position:absolute; right:20px; top:15px;}';
		html += '#setHd{ height:30px; line-height:30px; background-color:#333; color:#fff; font-weight:bold; text-align:center; margin:15px 15px 0;}';
		html += '#setUl{ height:470px; background-color:#fff; margin:0 15px 15px; padding:15px; overflow:auto;}';
		html += '#setUl li{ line-height:20px; margin-bottom:10px; margin-left:100px;}';
		html += '#setUl li:after{ display:block; content:\'\'; height:0; width:0; overflow:hidden; clear:both;}';
		html += '#setUl li div{ float:left; margin-left:-1px; line-height:25px;}';
		html += '#setUl li input{ vertical-align: text-bottom; height:25px; width:474px;}';
		html += '#setUl li textarea{ width:570px; height:80px; resize:none; vertical-align:top; overflow:auto;}';
		html += '#setUl li select{ height:25px;}';
		html += '#setUl li label{ float:right;}';
		html += '#setUl li button{ background-color:#fff; height:25px; width:25px; cursor:pointer;}';
		html += '#setUl li button:hover{ background-color:#999; color:#fff; border-color:#999;}';
		html += '#setUl select,#setUl input,#setUl button,#setUl textarea{ border:1px solid #ddd; outline:none; font-size:14px;}';
		html += '#setUl li .textNode{ margin:0 10px}';
		html += '#setUl li .label{ float:left; margin-left:-100px; text-align:right; width:90px; height:25px; line-height:25px;}';
		html += '#setUl li .childs{ margin-bottom:10px;}';
		html += '#setUl li.onoff input{ width: 40px; margin-left:10px; text-align:center;}';
		html += '#setUl li.saveBtn button{ width: auto; padding: 0 10px;}';
		html += '#setUl li.saveBtn .childs{ padding-left:150px;}';
		html += '#setUl li.saveBtn .button:last-child button{ background-color:#000; color:#fff; border-color:#000;}';
		style.innerHTML = html;
		document.head.appendChild(style);
	})();
	(function(){
		var setBtn = document.createElement('div');
		setBtn.id = 'setBtn';
		setBtn.innerHTML = '自动回复';
		document.body.appendChild(setBtn);
		//设置编辑框, 点击oBtn弹出一个编辑框
		var setBox = document.createElement('div');
		setBox.id = 'setBox';
		var setInner = document.createElement('div');
		setInner.id = 'setInner';
		setBox.appendChild(setInner);
		var setClose = document.createElement('i');
		setClose.id = 'setClose';
		setClose.textContent = 'X';
		setInner.appendChild(setClose);
		setClose.setAttribute('title','关闭');
		var setHd = document.createElement('div');
		setHd.id = 'setHd';
		setHd.textContent = '自动回复设置';
		setInner.appendChild(setHd);
		var setBd = document.createElement('div');
		setBd.id = 'setBd';
		setInner.appendChild(setBd);
		var setUl = document.createElement('ul');
		setUl.id = 'setUl';
		setBd.appendChild(setUl);
		var onoff = false;
		document.addEventListener('click',function(ev){
			var oLi,prev,next,oList,saveData;
			function getObj(target){
				oLi = target.parentNode.parentNode.parentNode;
				prev = oLi.previousElementSibling;
				next = oLi.nextElementSibling;
				oList = oLi.parentNode;
			}
			var target = ev.target;
			switch(target.id){
				case 'setClose':
					setBox.parentNode.removeChild(setBox);
					onoff = !onoff;
					break;
				case 'setBtn':
					if(!onoff){
						var html = outputElement(indexJson);
						setUl.innerHTML = '';
						setUl.appendChild(html);
						document.body.appendChild(setBox);
					}else{
						setBox.parentNode.removeChild(setBox);
					}
					onoff = !onoff;
					break;
			}
			switch(target.textContent){
				case '↑':
					getObj(target);
					if(prev.className === 'setKeyword'){
						oList.insertBefore(oLi,prev);
					}
					break;
				case '↓':
					getObj(target);
					if(next.className === 'setKeyword'){
						oList.insertBefore(next,oLi);
					}
					break;
				case '+':
					getObj(target);
					data.keywordNum++;
					var obj = json2create({
						moduleID : 'setKeyword'
					});
					oList.insertBefore(obj,oList.lastElementChild);
					obj.scrollIntoView(true);
					break;
				case '×':
					getObj(target);
					if(data.keywordNum > 1){
						data.keywordNum--;
						oList.removeChild(oLi);
					}
					break;
				case '保存数据':
					var aInput,aTextarea,aSelect;
					window.saveData = window.saveData || {
						RegKeywords : [],
						defaultReply : {},
						time : {
							refresh : data.time.autoRefresh
						}
					};
					var saveData = window.saveData;
					window.saveData.RegKeywords.length = 0;
					var timeOff = true;
					[].slice.call(setUl.children).forEach(function(item){
						aInput = item.getElementsByTagName('input');
						aTextarea = item.getElementsByTagName('textarea');
						aSelect = item.getElementsByTagName('select');
						switch(item.className){
							case 'setKeyword':
								if(aInput[0].value || aTextarea[0].value){
									saveData.RegKeywords.push([aInput[0].value,aTextarea[0].value]);
								}
								break;
							case 'onoff':
								setBtn.className = saveData.onoff = aSelect[0].value;
								saveData.time.autoReply = Number(aInput[0].value) || aInput[0].placeholder;
								break;
							case 'defaultReply':
								saveData.defaultReply.hours = aSelect[0].value;
								saveData.defaultReply.minutes = aSelect[1].value;
								saveData.defaultReply.hours2 = aSelect[2].value;
								saveData.defaultReply.minutes2 = aSelect[3].value;
								saveData.defaultReply.defaultValue = aTextarea[0].value;
								saveData.defaultReply.RegValue = aTextarea[1].value;
								saveData.defaultReply.timeStamp = timeStamp(Number(aSelect[0].value),Number(aSelect[1].value));
								saveData.defaultReply.timeStamp2 = timeStamp(Number(aSelect[2].value),Number(aSelect[3].value));
								break;
						}
					});
					cache.set('saveData',JSON.stringify(saveData));
					changeData();
					setBox.parentNode.removeChild(setBox);
					onoff = !onoff;
					break;
				case '导出数据':
					if(window.saveData){
						funDownload(JSON.stringify(window.saveData),'拼多多自动回复数据备份.txt');
					}else{
						tipBox('配置数据为原始数据,无需导出');
					}
					break;
				case '导入数据':
					try{
						var code = prompt('导入备份的数据');
						var json = JSON.parse(code);
						if(json.RegKeywords || json.onoff || json.defaultReply){
							for(var k in json){
								window.saveData[k] = json[k];
							}
							changeData();
							setBox.parentNode.removeChild(setBox);
							onoff = !onoff;
						}else{
							tipBox('数据为空或格式错误!');
						}
					}catch(e){
						console.log(e);
						tipBox('数据为空或格式错误!');
					}
			}
		});
		changeData();
	})();
})();