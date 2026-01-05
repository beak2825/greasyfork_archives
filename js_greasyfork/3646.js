// ==UserScript==
// @name          51NB Asst
// @description  51助手，黑名单，自动签到
// @namespace  by 51nb.com-FlyToSky
// @version        2.0.0
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @include      *forum.51nb.com/*
// @include      *.51nb.com/forum/*
// @downloadURL https://update.greasyfork.org/scripts/3646/51NB%20Asst.user.js
// @updateURL https://update.greasyfork.org/scripts/3646/51NB%20Asst.meta.js
// ==/UserScript==

var bid_Settings;
var bid_BlackLists;
var bid_blacklistStr;
var bid_signed;
var bid_formhash;
var bid_uid;
var bid_fid;
var bid_keywords;
var bid_Key_lastTid;
var bid_VIEWTHREAD = window.location.href.indexOf('/thread-') > -1 || window.location.href.indexOf('/viewthread.php') > - 1;
var bid_FORUMDISPLAY = window.location.href.indexOf('/forum-') > - 1 || window.location.href.indexOf('/forumdisplay.php') > - 1;
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue = function (key,def) {
		return localStorage.getItem(key) || def;
    }
    this.GM_setValue = function (key,value) {
        return localStorage.setItem(key, value);
    }
}

if (!this.GM_addStyle || (this.GM_addStyle.toString && this.GM_addStyle.toString().indexOf("not supported")>-1)){
	this.GM_addStyle = function(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
}

function bid_xpath(q) {
	return document.evaluate(q, document, null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

//读取设置
function bid_readConfig(){
	var s=GM_getValue('51Asst_Settings_' + bid_uid,'');
	if (s) {
		bid_Settings = JSON.parse(s);
		bid_signed = (bid_Settings.lastSignDate == (new Date()).toDateString()) ? true : false;
	} else {
		bid_Settings = new Object();
	}

	s=GM_getValue('51Asst_BlackLists_' + bid_uid,'');
	bid_blacklistStr = ',';
	if (s) {
		bid_BlackLists = JSON.parse(s);
		for (i=0;i<bid_BlackLists.blacklist.length;i++) {
			bid_blacklistStr += bid_BlackLists.blacklist[i].id + '=' + bid_BlackLists.blacklist[i].name + ',';
		}
	} else {
		bid_BlackLists= new Object();
		bid_BlackLists.blacklist = new Array();
	}

	s=GM_getValue('51Asst_keywords_' + bid_uid,'');
	if (s) {
		bid_keywords = JSON.parse(s);
	} else {
		bid_keywords = new Object();
		bid_keywords.key = new Array();
	}
}
	
function bid_AddBlockBtn(){		// 添加屏蔽按钮
	var s = bid_xpath('//div[@style="padding-top: 6px;"]');
	for (var i = 0; i < s.snapshotLength; ++i) {
		var t = s.snapshotItem(i);
		var a=document.createElement('a');
		a.innerHTML = '屏蔽';
		a.href = '###';
		a.addEventListener('click', bid_BlockUser,false);
		t.appendChild(a);
	}

			s = bid_xpath('//div[@class="maintable"]/form[@name="delpost"]/table[@class="t_rown"]/tbody/tr[1]/td[1]');
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				if( a != undefined){
					a.addEventListener('mouseenter', function(e){var p=bid_GetPos(e.target);var d=document.getElementById('_51nbbl_div');d.style.top=p.top+3;d.style.left=p.right-55;e.target.appendChild(d);d.style.display='';},false);
					a.addEventListener('mouseleave', function(e){document.getElementById('_51nbbl_div').style.display='none';},false);
					//a.addEventListener('mouseenter', function(){bid_div_block.style.top=this.getBoundingClientRect().top;bid_div_block.style.left=this.getBoundingClientRect().right-40;bid_div_block.style.display='';this.appendChild(bid_div_block);},false);
					//a.addEventListener('mouseenter', function(){var p=bid_GetPos(this);bid_div_block.style.top=p.top+3;bid_div_block.style.left=p.right-55;bid_div_block.style.display='';this.insertBefore(bid_div_block,this.firstChild);},false);
					//a.addEventListener('mouseleave', function(){bid_div_block.style.display='none';/**this.removeChild(bid_div_block);*/},false);
				}
			}
}

function bid_GetPos(obj) {
	var curleft=0;
	var curtop=0;
	var curwidth=0;
	var curheight=0;

	if (obj.offsetParent) { //返回父类元素，大多说offsetParent返回body
		curwidth = obj.offsetWidth;
		curheight = obj.offsetHeight;
		while (obj.offsetParent) {//遍历所有父类元素
			curleft += obj.offsetLeft;//当前元素的左边距
			curtop += obj.offsetTop;
			obj = obj.offsetParent;        
		}
	} else if (obj.x) {
		curleft += obj.x;
		curtop += obj.y;
	}
	return {left:curleft,top:curtop,right:curleft+curwidth,bottom:curtop+curheight};
}

function bid_BlockUser(e){      //点击屏蔽按钮
	var a = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('bold')[0].getElementsByTagName('a')[0];
	var nm= a.text.replace(/[\r\n]/g,'');
	var id= a.href.substring(a.href.indexOf('uid')+4,a.href.indexOf('.html'));
	bid_readConfig();					//先读取一下，解决多窗口情况下的同步问题
	if (bid_blacklistStr.indexOf(','+id+'=') < 0) {	//检查黑名单是否已存在
		bid_blacklistStr += id + '=' + nm;
		bid_addBidlist(id,nm);
		bid_SaveConfig(2)
	}
	bid_BlockList();
	bid_HideComments();
}

function bid_BlockUser1(e){      //点击屏蔽按钮
	var a = e.target.parentNode.parentNode.getElementsByClassName('bold')[0].getElementsByTagName('a')[0];
	var nm= a.text.replace(/[\r\n]/g,'');
	var id= a.href.substring(a.href.indexOf('uid')+4,a.href.indexOf('.html'));
	bid_readConfig();					//先读取一下，解决多窗口情况下的同步问题
	if (bid_blacklistStr.indexOf(','+id+'=') < 0) {	//检查黑名单是否已存在
		bid_blacklistStr += id + '=' + nm;
		bid_addBidlist(id,nm);
		bid_SaveConfig(2)
	}
	bid_BlockList();
	bid_HideComments();
}

function bid_HideComments() {
	switch (bid_fid) {
		case '88':
			if (!bid_Settings.blockForum88) return;
			break;
		case '41':
			if (!bid_Settings.blockForum41) return;
			break;
		default: if (!bid_Settings.blockForumother) return;
	}
	if(bid_VIEWTHREAD){   // 帖子
		if (bid_Settings.blockComment) {// 屏蔽点评内容
			var s = bid_xpath('//div[starts-with(@id,"comment_")]//a[@class="xi2 xw1"]');
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				var id = a.href.substring(a.href.indexOf('uid=')+4);
				if (bid_blacklistStr.indexOf(','+id+'=')>=0)
					a.parentNode.style.display = 'none';
			}
		}
	}
}

function bid_BlockList(){      // 屏蔽黑名单
	switch (bid_fid) {
		case '88':
			if (!bid_Settings.blockForum88) return;
			break;
		case '41':
			if (!bid_Settings.blockForum41) return;
			break;
		default:
			if (!bid_Settings.blockForumother) return;
	}
	var blocked=false;
	if(bid_VIEWTHREAD){   // 帖子
		if (bid_Settings.blockPost) {//屏蔽回复
			var s = bid_xpath('//div[@class="maintable"]/form[@name="delpost"]/table[@class="t_rown"]/tbody/tr[1]/td[1]/span/a[@href]');
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				if( a != undefined){
					var id= a.href.substring(a.href.indexOf('uid-')+4,a.href.indexOf('.html'));
					if (bid_blacklistStr.indexOf(','+id+'=')>=0) {
						a.parentNode.parentNode.parentNode.parentNode.style.display='none';
						blocked=true;
					}
				}
			}
		}
		if (bid_Settings.blockQuote) {// 屏蔽被引用内容
			var s = bid_xpath('//div[@class="msgbody"]/div[@class="msgborder"]/i');
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				var n = a.innerHTML;
				if (bid_blacklistStr.indexOf('='+n+',')>=0)
					a.parentNode.parentNode.style.display = 'none';
			}
		}
		if (blocked) {		//重新设置背景色
			var s = bid_xpath('//div[@class="maintable"]/form[@name="delpost"]/table[@class="t_rown"]/tbody/tr');
			var j=0;
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				if( a != undefined){
					if (a.parentNode.style.display != 'none') {
						a.className = (j % 2)==0?"altbg1":"altbg2";
						++j;
					}
				}
			}
			var s = bid_xpath('//div[@class="maintable"]/form[@name="delpost"]/table[@class="t_rown"]/tbody/tr/td/table[@class="t_msg"]/tbody/tr');
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				if( a != undefined){
					a.className=a.parentNode.parentNode.parentNode.parentNode.className;
				}
			}
		}
	} else if(bid_FORUMDISPLAY){ // 论坛列表
		if (bid_Settings.blockThread) {// 屏蔽主题帖
			var s = bid_xpath('//table[@class="t_rown"]/tbody/tr/td/a[starts-with(@href,"profile-uid")]');
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				if( a != undefined){
					var id= a.href.substring(a.href.indexOf('uid-')+4,a.href.indexOf('.html'));
					if (bid_blacklistStr.indexOf(','+id+'=')>=0) {
						a.parentNode.parentNode.style.display='none';
						blocked=true;
					}
				}
			}
		}
		if (blocked) {		//重新设置背景色
			var s = bid_xpath('//table[@class="t_rown"]/tbody/tr[@class="header"]/following-sibling::*');
			var j=0;
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				if( a != undefined){
					if (a.style.display != 'none') {
						if (a.className == 'category') {
							j=0;
						} else {
							a.bgColor = (j % 2)==0?"#E3E3E3":"#F7F7F7";
						}
						++j;
					}
				}
			}
			var s = bid_xpath('//table[@class="t_rown"]/tbody/tr[@class="header"]/following-sibling::*//td');
			for (i = 0; i < s.snapshotLength; ++i) {
				var a = s.snapshotItem(i);
				if( a != undefined){
					a.bgColor="";
				}
			}
		}
		// 隐藏最后回复位置的显示
		var s = bid_xpath('//td[@class="f_last"]/font/a[2]');
		for (i = 0; i < s.snapshotLength; ++i) {
			var a = s.snapshotItem(i);
			if(a != undefined) {
				var n = a.text.replace(/[\r\n]/g,'');
				if (bid_blacklistStr.indexOf(('='+n+','))>=0) a.innerHTML='anonymous';
			}
		}
	}
}

function bid_menu(m) {
	var cur_menu=document.getElementById(m).parentNode;
	for (i=0;i<cur_menu.parentNode.childNodes.length;i++) {
		if (cur_menu.parentNode.childNodes[i].className=="_c_menu")
			cur_menu.parentNode.childNodes[i].className="";
	}
	cur_menu.className="_c_menu";
	document.getElementById("_51nb_setting1").style.display="none";
	document.getElementById("_51nb_setting2").style.display="none";
	document.getElementById("_51nb_setting3").style.display="none";
	switch(m) {
		case "_bid_m1":
			document.getElementById("_51nb_setting1").style.display="";
			break;
		case "_bid_m2":
			document.getElementById("_51nb_setting2").style.display="";
			break;
		case "_bid_m3":
			document.getElementById("_51nb_setting3").style.display="";
			break;
	}
}

function bid_CreatConfigPanel(){	//创建设置面板
    GM_addStyle(
		'#_51nbccp_div {position: fixed;left:50%;bottom:50px;padding:0px 15px;margin-left:-115px; margin-top:-135px;align:center;width:220px;z-index:99;background:#d3d3d3;border:1px solid #b6b6b6;opacity:0.95;text-align:center;font-size:12px}'+
		'#_51nbccp_div table,#_51nbccp_div input,#_51nbccp_div select {font-size: 12px;}'+
		'#_51nbccp_div input {height: 18px;}'+
		'#_51nbccp_div input[type="text"] {height:17px;}'+
		'#_51nbccp_div input[type="checkbox"] {height:10px;}'+
		'#_51nbccp_div input[type="button"] {margin-top:2px;}'+
		'#_51nb_setting1,#_51nb_setting2,#_51nb_setting3 {padding:5px 0px;border-width: 1px 0px 0px;border-color:#a3a3a3;border-style:solid;height:180px;text-align:left}'+
		'#_bid_menu li {list-style: none outside none;display:inline;}'+
		'#_bid_menu li {background:#b3b3b3;margin-left: 2px;}'+
		'#_bid_menu li._c_menu a {border-color:#a3a3a3;background:#d3d3d3;font-weight:bold;}'+
		'#_bid_menu a {border-width: 1px 1px 0px;border-color:#a3a3a3;border-style:solid;padding:1px 8px;height:25px;line-height:24px;text-decoration:none;color:#000;background:#b3b3b3;outline:none}'+
		'#_51nbgdb_div {position: fixed;top:25;left:50%;margin-left:-75px; align:center;width:150px;padding: 7px;text-align:center;color:#fff;background:#66c;z-index:100;border-radius:5px;font-size:14px;box-shadow: 0px 0px 9px #999999;}'+
		'#_51nbsr_div {position: fixed;right:5px;bottom:5px;align:center;padding: 0px;z-index:98;background:#f7f7f7;border:1px solid #b6b6b6;opacity:0.90;text-align:left;}'+
		'#_51nbsr_div td{border-bottom:1px solid #c6c6c6;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;padding:2px 2px 2px 5px}'+
		'#_51nbbl_div {position:absolute;width:40px;padding:3px 5px;z-index:99;background:#d3d3d3;border:1px solid #b6b6b6;opacity:0.90;text-align:center;}'
	);
	if (bid_Settings.autoSign && (!bid_signed) && (bid_formhash)) {
		var bid_gdb = document.createElement("div");		//签到提示面板
		bid_gdb.id = '_51nbgdb_div';
		bid_gdb.style.display = "none";
		document.getElementsByTagName('body')[0].appendChild(bid_gdb);
	}

	var bid_sresult = document.createElement("div");		//关键字提示面板
	bid_sresult.id = '_51nbsr_div';
	bid_sresult.style.display = "none";
	document.getElementsByTagName('body')[0].appendChild(bid_sresult);
	
	var bid_div_block = document.createElement("div");		//屏蔽提示面板
	bid_div_block.id = '_51nbbl_div';
	bid_div_block.style.display = "none";
	var a=document.createElement("a");
	a.innerHTML='屏蔽';
	a.href='###';
	a.addEventListener('click', bid_BlockUser1,false);
	bid_div_block.appendChild(a);
	document.getElementsByTagName('body')[0].appendChild(bid_div_block);

    var bid_ccp = document.createElement("div");		//设置面板
    bid_ccp.id = "_51nbccp_div";
    bid_ccp.style.display = "none";
    bid_ccp.innerHTML = 
		'<div style="position:relative;margin:0px auto;width:90%;height:55px;padding:10px 0px 0px;"><font size=3>51助手<sub><font color=#e7e7e7>&nbsp;&nbsp;ver 2.0</font></sub></font>'+
		'<div id="_bid_menu" style="position:absolute;bottom:0px;padding:10px 0px 0px;height:20px"><ul>'+
		'<li class="_c_menu"><a id="_bid_m1" hidefocus="true" href="javascript:void(0)">黑名单</a></li>'+
		'<li><a id="_bid_m2" hidefocus="true" href="javascript:void(0)">关键字</a></li>'+
		'<li><a id="_bid_m3" hidefocus="true" href="javascript:void(0)">其它</a></li>'+
		'</ul></div></div>'+
		'<div id="_51nb_setting1">'+
		'<table id="_bid_cc1">'+
		'<tr><td>屏蔽版块：</td></tr>'+
		'<tr><td>'+
			'<input id="_bid_blockForum88" type="checkbox" />联谊区'+
			'<input id="_bid_blockForum41" type="checkbox" />交易区'+
			'<input id="_bid_blockForumother" type="checkbox" />其它版块'+
        '</td></tr>'+
		'<tr><td>屏蔽内容：</td></tr>'+
		'<tr><td>'+
			'<input id="_bid_blockThread" type="checkbox" />主题贴'+
			'<input id="_bid_blockPost" type="checkbox" />回复'+
			'<input id="_bid_blockQuote" type="checkbox" />被引用'+
			'<input id="_bid_blockComment" type="checkbox" />点评'+
        '</td></tr>'+
		'<tr><td>黑名单：</td></tr>'+
		'<tr><td>'+
			'<select size="4" id="_bid_blacklist" multiple style="width:155px">'+
			'</select>'+
			'<div style="float:right;padding-left:2px;">'+
				'<input type="button" id="_bid_del" value="移 除" onclick="javascript:void(0)"/>'+
			'</div>'+
		'</td></tr>'+
		'</table></div>'+
		'<div id="_51nb_setting2">'+
		'<table id="_bid_cc2">'+
		'<tr><td colspan="2">'+
			'<input id="_bid_enablekw" type="checkbox" />启用主题关键字提醒'+
		'</td></tr>'+
		'<tr><td>版块：</td>'+
		'<td>'+
			'<select id="_bid_forum_list" style="height:17px;width:100px;padding:0px 0px">'+
			'<option value="1">技术区</option>'+
			'<option value="2">智能手机</option>'+
			'<option value="41">交易区</option>'+
			'<option value="88">联谊区</option>'+
			'<option value="113">推荐区</option>'+
			'</select>'+
		'</td></tr>'+
		'<tr><td>关键字：</td>'+
		'<td>'+
			'<input type="text" id="_bid_key" value="" style="width:100px;background:#fff"/>'+
			'&nbsp;<input type="button" id="_bid_kw_add" value="添 加" onclick="javascript:void(0)"/>'+
		'</td></tr>'+
		'<tr><td></td><td>(多个关键字用"|"隔开)</td></tr>'+
		'<tr><td colspan="2">关键字列表：</td></tr>'+
		'<tr><td colspan="2">'+
			'<select size="4" id="_bid_keyslist" multiple style="width:155px"></select>'+
			'<div style="float:right;padding-left:2px">'+
				'<input type="button" id="_bid_kw_modi" value="编 辑" onclick="javascript:void(0)"/><br/>'+
				'<input type="button" id="_bid_kw_del" value="移 除" onclick="javascript:void(0)"/>'+
			'</div>'+
		'</td></tr>'+
		'</table></div>'+
		'<div id="_51nb_setting3">'+
		'<table id="_bid_cc3">'+
		'<tr><td>'+
			'<input id="_bid_autoSign" type="checkbox" />自动签到'+
		'</td></tr>'+
		'</table></div>'+
		'<div style="padding:0px 0px 15px;">'+
			'<input type="button" id="_bid_ok" value="确 定" onclick="javascript:void(0)"/>'+
			'&nbsp;&nbsp;&nbsp;'+
			'<input type="button" id="_bid_cancel" value="取 消" onclick="javascript:void(0)"/>'+
        '</div>'
		;
		
	document.getElementsByTagName('body')[0].appendChild(bid_ccp);
	document.getElementById('_51nb_setting2').style.display='none';
	document.getElementById('_51nb_setting3').style.display='none';
    document.getElementById('_bid_ok').addEventListener('click', function(){bid_SaveConfig(99);bid_SaveConfig(0);}, false);
    document.getElementById('_bid_cancel').addEventListener('click', function(){bid_SaveConfig(0);}, false);
    document.getElementById('_bid_del').addEventListener('click', function(){bid_delBidlist();}, false);
	document.getElementById('_bid_m1').addEventListener('click', function(){bid_menu(this.id);}, false);
	document.getElementById('_bid_m2').addEventListener('click', function(){bid_menu(this.id);}, false);
	document.getElementById('_bid_m3').addEventListener('click', function(){bid_menu(this.id);}, false);
	document.getElementById('_bid_kw_add').addEventListener('click', function(){bid_key_add();}, false);
    document.getElementById('_bid_kw_del').addEventListener('click', function(){bid_key_del();}, false);
    document.getElementById('_bid_kw_modi').addEventListener('click', function(){bid_key_modi();}, false);
	document.addEventListener('keydown', bid_keyHandle, false);
	bid_refreshCfgdiv();
}

function bid_key_add() {
	var key=document.getElementById("_bid_key");
	if (key.value) {
		var fl = document.getElementById("_bid_forum_list");
		var kl = document.getElementById("_bid_keyslist");
		for (i=0;i<kl.options.length;i++){
			if (kl[i].value==fl[fl.selectedIndex].value) {
				kl[i].text='['+fl[fl.selectedIndex].text+']'+key.value;
				return;
			}
		}
		var o = document.createElement('option');
		o.value = fl[fl.selectedIndex].value;
		o.text = '['+fl[fl.selectedIndex].text+']'+key.value;
		o.title=o.text;
		kl.options[kl.options.length] = o;
	}
}

function bid_key_modi() {
	var kl = document.getElementById("_bid_keyslist");
	if (kl.selectedIndex<0) return;
	var key=document.getElementById("_bid_key");
	var fl = document.getElementById("_bid_forum_list");
	for (i=0;i<fl.options.length;i++){
		if (fl[i].value==kl[kl.selectedIndex].value) {
			fl.selectedIndex=i;
			key.value=kl[kl.selectedIndex].text.substring(kl[kl.selectedIndex].text.indexOf(']')+1);
			break;
		}
	}
}

function bid_key_del() {
	var kl = document.getElementById("_bid_keyslist"); 
	for (i=0;i<kl.options.length;i++) {
		if (kl.options[i].selected) {
			kl.options.remove(i--);
		}
	}
}

function bid_SaveConfig(s) {		//保存
	if (s>0) {
		if (s==1 || s==99) {		//保存设置
			bid_Settings.blockThread = document.getElementById('_bid_blockThread').checked;
			bid_Settings.blockPost = document.getElementById('_bid_blockPost').checked;
			bid_Settings.blockQuote= document.getElementById('_bid_blockQuote').checked;
			bid_Settings.blockComment= document.getElementById('_bid_blockComment').checked;

			bid_Settings.blockForum88 = document.getElementById('_bid_blockForum88').checked;
			bid_Settings.blockForum41 = document.getElementById('_bid_blockForum41').checked;
			bid_Settings.blockForumother = document.getElementById('_bid_blockForumother').checked;

			bid_Settings.autoSign = document.getElementById('_bid_autoSign').checked;
			bid_Settings.enablekw = document.getElementById('_bid_enablekw').checked;
			
			GM_setValue('51Asst_Settings_' + bid_uid, JSON.stringify(bid_Settings));
		}
		
		if (s==2 || s==99) {		//保存黑名单
			bid_BlackLists.blacklist.length = 0;
			var bl = document.getElementById("_bid_blacklist"); 
			for ( i = 0; i<bl.options.length; i++) {
				bid_BlackLists.blacklist[i]=new Object();
				bid_BlackLists.blacklist[i].id=bl.options[i].value;
				bid_BlackLists.blacklist[i].name=bl.options[i].text;
			}
			GM_setValue('51Asst_BlackLists_' + bid_uid,JSON.stringify(bid_BlackLists));
		}
		
		if (s==3 || s==99) {		//保存关键字
			var bl = document.getElementById("_bid_keyslist"); 
			for (j=0;j<bid_keywords.key.length;j++) {
				var keyexist=false;
				for (i = 0; i<bl.options.length; i++) {
					if (bid_keywords.key[j].fid==bl.options[i].value) {
						keyexist=true;
						break;
					}
				}
				if (!keyexist) {
					bid_keywords.key.splice(j--,1);
				}
			}
			for (i = 0; i<bl.options.length; i++) {
				var keyexist=false;
				for (j=0;j<bid_keywords.key.length;j++) {
					if (bid_keywords.key[j].fid==bl.options[i].value) {
						bid_keywords.key[j].keyword=bl.options[i].text;
						keyexist=true;
						break;
					}
				}
				if (!keyexist) {
					bid_keywords.key[bid_keywords.key.length]=new Object();
					bid_keywords.key[bid_keywords.key.length-1].fid=parseInt(bl.options[i].value);
					bid_keywords.key[bid_keywords.key.length-1].keyword=bl.options[i].text;
					bid_keywords.key[bid_keywords.key.length-1].chktime=0;
					bid_keywords.key[bid_keywords.key.length-1].lastTid=0;
				}
			}
			GM_setValue('51Asst_keywords_' + bid_uid,JSON.stringify(bid_keywords));
		}
		
		if (s==1 || s==2) {
			bid_BlockList();
			bid_HideComments();
		}
	} else {
		document.getElementById('_51nbccp_div').style.display = (document.getElementById('_51nbccp_div').style.display == '')?'none':'';
		if (document.getElementById('_51nbccp_div').style.display == 'none') bid_refreshCfgdiv();		//刷新设置界面
	}
}

function bid_refreshCfgdiv() {		//刷新设置界面
	if (document.getElementById("_bid_blacklist").options.length != bid_BlackLists.blacklist.length) bid_addBidlist();

	document.getElementById('_bid_blockThread').checked = bid_Settings.blockThread;
	document.getElementById('_bid_blockPost').checked = bid_Settings.blockPost;
	document.getElementById('_bid_blockQuote').checked = bid_Settings.blockQuote;
	document.getElementById('_bid_blockComment').checked = bid_Settings.blockComment;
	document.getElementById('_bid_blockForum88').checked = bid_Settings.blockForum88;
	document.getElementById('_bid_blockForum41').checked = bid_Settings.blockForum41;
	document.getElementById('_bid_blockForumother').checked = bid_Settings.blockForumother;
	document.getElementById('_bid_enablekw').checked = bid_Settings.enablekw;
	if (bid_uid) {
		document.getElementById('_bid_autoSign').checked = bid_Settings.autoSign;
		document.getElementById('_bid_autoSign').disabled = false;
	} else {
		document.getElementById('_bid_autoSign').checked = false;
		document.getElementById('_bid_autoSign').disabled = true;
	}
	var kl = document.getElementById("_bid_keyslist");
	for (i=0;i<bid_keywords.key.length;i++) {
		var o=document.createElement('option');
		o.value=bid_keywords.key[i].fid;
		o.text=bid_keywords.key[i].keyword;
		o.title=o.text;
		kl.options[i]=o;
	}
}

function bid_addBidlist(id,nm) {		//刷新新黑名单列表
	var bl = document.getElementById("_bid_blacklist");
	if (id !=undefined) {		//id非空时增加一个名单
		var o = document.createElement('option');
		o.value = id;
		o.text = nm;
		bl.options[bl.options.length] = o;
	} else {		//id为空时刷新列表
		bl.options.length = 0;
		for ( i = 0; i<bid_BlackLists.blacklist.length; i++) {
			var o = document.createElement('option');
			o.value = bid_BlackLists.blacklist[i].id;
			o.text = bid_BlackLists.blacklist[i].name;
			bl.options[bl.options.length] = o;
		}
	}
}

function bid_delBidlist() {		//删除黑名单列表选中的名单
	var bl = document.getElementById("_bid_blacklist"); 
	for (i=0;i<bl.options.length;i++) {
		if (bl.options[i].selected) {
			bl.options.remove(i--);
		}
	}
}

function bid_keyHandle(e) {		//热键回调函数
	if (/^(?:input|textarea)$/i.test(e.target.localName)) return;
	var keycom = e.ctrlKey? '1':'0';
	keycom += (e.metaKey || e.altKey)? '1':'0';
	keycom += e.shiftKey? '1':'0';
	keycom += String.fromCharCode(e.which);
	if (keycom=='010N') {
		e.preventDefault();e.stopPropagation();bid_SaveConfig(0); 
	}
}

function bid_sign() {
	if (bid_Settings.autoSign && (!bid_signed) && (bid_formhash)) {
		var d = new Date();
		if ((d.getHours()*60 + d.getMinutes()) < 10) return;		//0点10分以后才开始签到
		var http = new XMLHttpRequest();
		var url = 'bank.php?action=getdailybonus';
		var data = 'formhash=' + bid_formhash + '&dailysubmit=yes';
		http.onreadystatechange=function() {
			if (http.readyState==4 && http.status==200) {		// 200 = http OK
				if (http.responseText.indexOf('report.php?action=listbonus') > -1) {		//签到成功
					bid_signed = true;
					bid_Settings.lastSignDate = d.toDateString();
					bid_SaveConfig(1);
					var reg=new RegExp(/^<br>.*\(<font color="red"><b>(\d+)<\/b><\/font>\)nb = .*/gm);
					if (reg.test(http.responseText)) {
						document.getElementById('_51nbgdb_div').innerHTML = '今日签到：+'+RegExp.$1+' NB';
						document.getElementById('_51nbgdb_div').style.display = '';
						setTimeout(function(){document.getElementById('_51nbgdb_div').style.display = 'none';}, 3000);
					}
				}
			}
		}
		http.open('POST', url, true);
		http.setRequestHeader("Referer","http://forum.51nb.com/bank.php?action=getdailybonus");
		http.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=gbk");
		http.overrideMimeType("text/html;charset=gbk");
		http.send(data);
	}
}

function bid_search(i,p) {
	if (i >= bid_keywords.key.length || !bid_Settings.enablekw) return;
	var gt=parseInt((new Date()).getTime()/1000);
	var dt=gt - bid_keywords.key[i].chktime;
	dt=dt>259200?259200:dt;		//只检测最近三天内的新主题
	if (dt > 30*60) {		//两次检测间隔30分钟
		dt += 60;
		var http = new XMLHttpRequest();
		var sresult=document.getElementById('_51nbsr_div');
		var html='';
		var url = 'forumdisplay.php?fid='+bid_keywords.key[i].fid+'&filter='+dt+'&orderby=dateline&page='+p;
		http.onreadystatechange=function() {
			if (http.readyState==4 && http.status==200) {		// 200 = http OK
				regstr='^<tr>.*<a class="p_pages">.*[\\d]+\\/([\\d]+).*';
				reg=RegExp(regstr,'mi');
				var MaxPage=reg.test(http.responseText)?parseInt(RegExp.$1):0;
				MaxPage=MaxPage>3?3:MaxPage;		//最大读取3页

				if (bid_keywords.key[i].fid==113)		//处理推荐区
					var regstr='<tr>.*noBg.*<a.*href="viewthread\\.php\\?tid=(\\d+)&.*">(.*(?:' + bid_keywords.key[i].keyword.substring(bid_keywords.key[i].keyword.indexOf(']')+1) + ').*?)<[\\s\\S]*?<span>发布者：\\s*(.*?)\\s*</span>';
				else
					var regstr='<a.*href="viewthread\\.php\\?tid=(\\d+)&.*">(.*(?:' + bid_keywords.key[i].keyword.substring(bid_keywords.key[i].keyword.indexOf(']')+1) + ').*?)</a>[\\s\\S]*?<a.*href="profile-uid-\\d+\\.html">\\s*(.*?)\\s*</a>';
				var reg=RegExp(regstr,'gi');
				if (p==1) bid_Key_lastTid=bid_keywords.key[i].lastTid;
				while ((reg.exec(http.responseText)) != null) {
					if (bid_Key_lastTid < parseInt(RegExp.$1)) {
						var author=RegExp.$3.indexOf('<')>=0?RegExp.$3.substring(RegExp.$3.indexOf('>')+1,RegExp.$3.lastIndexOf('<')):RegExp.$3;
						if  (bid_blacklistStr.indexOf('='+author+',')<0) {
							html += '<tr><td><a title="'+'【'+bid_keywords.key[i].keyword.substring(1,bid_keywords.key[i].keyword.indexOf(']'))+'】'+RegExp.$2+'【'+author+'】'+'" href="thread-' + RegExp.$1 + '-1-1.html" target="_blank">' + RegExp.$2 + '</a></td></tr>';
						}
						if (bid_keywords.key[i].lastTid < parseInt(RegExp.$1))
							bid_keywords.key[i].lastTid=parseInt(RegExp.$1);
					}
				}
				if (html) {
					if (sresult.innerHTML=='') {
						 sresult.innerHTML='<div style="padding:2px;;color:#fff;background:#6666cc;font-weight:bold;text-align:center">感兴趣主题'+
							'<a href="javascript:void(0)" id="_bid_close" style="float:right;color:#fff;font-weight:normal;font-size: 10px;">关闭</a></div>'+
							'<div style="height:94px;overflow-y:scroll">'+
							'<table cellspacing="0" style="width:200px;table-layout:fixed">'+html+'</table>'+
							'</div>';
					} else {
						sresult.innerHTML=sresult.innerHTML.substring(0,sresult.innerHTML.indexOf('</table>'))+html+'</table>'+
							'</div>';
					}
				}
				if (p<MaxPage) {
					setTimeout(function(){bid_search(i,++p);},0);
				} else {
					bid_keywords.key[i].chktime=gt;
					if (i==bid_keywords.key.length-1) {
						if (sresult.innerHTML!='') {
							document.getElementById('_bid_close').addEventListener('click', function(){document.getElementById('_51nbsr_div').style.display='none';}, false);
							sresult.style.display = '';
						}
						GM_setValue('51Asst_keywords_' + bid_uid,JSON.stringify(bid_keywords));
					}
					setTimeout(function(){bid_search(++i,1);},0);
				}
			}
		}
		http.open('GET', url, true);
		http.setRequestHeader("Referer","http://forum.51nb.com/index.php");
		http.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=gbk");
		http.overrideMimeType("text/html;charset=gbk");
		http.send(null);
	} else {
		setTimeout(function(){bid_search(++i,1);},0);
	}
}

function bid_getFormhash() {
	var s = bid_xpath('//a[starts-with(@href,"logging.php?action=logout")]');
	for (i = 0; i < s.snapshotLength; ++i) {
		var a = s.snapshotItem(i);
		if( a != undefined) {
			bid_formhash = a.href.substring(a.href.indexOf('formhash')+9, a.href.indexOf('formhash')+9+8);
		}
	}
	if (bid_formhash) {
		var s = bid_xpath('//div[@class="menu1"]/div[@class="maintable"]//span[@class="bold"]//a[starts-with(@href,"profile-uid-")]');
		for (i = 0; i < s.snapshotLength; ++i) {
			var a = s.snapshotItem(i);
			if( a != undefined) {
				bid_uid = a.href.substring(a.href.indexOf('uid')+4,a.href.indexOf('.html'));
			}
		}
	}
	if (!bid_uid) bid_uid = '';
	
	var s = bid_xpath('//div[@class="nav"]//a[2] | //div[@class="subtable nav"]//a[2]');
	for (i = 0; i < s.snapshotLength; ++i) {
		var a = s.snapshotItem(i);
		if( a != undefined) {
			bid_fid = a.href.substring(a.href.indexOf('forum-')+6,a.href.indexOf('-1.html'));
		}
	}
}

bid_getFormhash();
bid_readConfig();		//读取设置参数
bid_CreatConfigPanel();		//生成设置面板
if (bid_VIEWTHREAD) {
	bid_AddBlockBtn();
}
if(bid_FORUMDISPLAY || bid_VIEWTHREAD) {
	bid_BlockList();
	window.onload = setTimeout(function(){bid_HideComments();},500);
}
window.onload = setTimeout(function(){bid_sign();},500);
bid_search(0,1);
