// ==UserScript==
// @name        Fast-Codeforces
// @namespace   xcxcli
// @version     0.3.5.4
// @match       *://codeforces.com/*
// @match       *://codeforces.ml/*
// @description Make Codeforces convenient
// @author      xcxcli
// @downloadURL https://update.greasyfork.org/scripts/393752/Fast-Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/393752/Fast-Codeforces.meta.js
// ==/UserScript==
unsafeWindow.onload=function(){
let $=unsafeWindow.jQuery,math=unsafeWindow.MathJax.Hub,Codeforces=unsafeWindow.Codeforces;
$.default=function(obj,val){
	for(let i in obj)if(!(i in val))delete obj[i];
	for(let i in val)if(!(i in obj))obj[i]=val[i];
	return obj;
};
String.prototype.frl=function(c){
	if(this.indexOf(c)===-1)return this;
	return this.slice(0,this.indexOf(c));
};
String.prototype.frr=function(c){
	if(this.indexOf(c)===-1)return this;
	return this.slice(this.indexOf(c)+c.length);
};
String.prototype.last=function(){return this[this.length-1];}
String.prototype.replaceAll=function(s1,s2){return this.split(s1).join(s2);};
let gets=function(dir,val){
	if(("fc-"+dir)in localStorage===false||localStorage["fc-"+dir]==="undefined")return val;
	return JSON.parse(localStorage["fc-"+dir]);
},puts=function(dir,val){
	if(val!==void 0)localStorage["fc-"+dir]=JSON.stringify(val);
	else localStorage["fc-"+dir]="undefined";
},noop=function(){},Alert=Codeforces.alert,version="v0.3.5.4",
Confirm=function(str,fy,fn=noop,y="确定",n="取消"){Codeforces.confirm(str,fy,fn,y,n);$("#fc-input").focus();},
URLmatch=function(url){
	if(!url)url=location.href;
	if(url[0]==="/")url=location.origin+url;
	if(url[0]===".")url=location.href+url;
	url=new URL(url);
	if(url.pathname.slice(-1)==='/')url.pathname=url.pathname.slice(0,-1);
	return{host:url.origin,path:url.pathname,parr:url.pathname.split('/').slice(1)};
},
GetTitle=function(val){return val.slice(0,val.indexOf("</title>")).slice(val.indexOf("<title>")+7);},
fc=$.default(gets("fc",{}),{version:version,ele:[],using:false,mode:[]}),
user=$(".lang-chooser>div:eq(1)>a:eq(0)").html(),user_csrf=$("[name=X-Csrf-Token]").attr("content"),
show_pre=function(){$("#pageContent,#pre-bar").show();},hide_pre=function(){$("#pageContent,#pre-bar").hide();},
menu,fc_need=["fc","pro-user","sub-user","sta-user"],Clear=function(){
	for(let i in localStorage){
		if(i.slice(0,3)!=="fc-")continue;
		let j=i.slice(3);
		if(fc_need.indexOf(j)<0)delete localStorage[i];
	}
},default_set=function(){for(let i in localStorage)if(i.slice(0,3)==="fc-"&&i!=="fc-fc")delete localStorage[i];},
add_menu=function(id){
	$("#fc-setting-menu-add").append(`<li><a id="fc-setting-menu-`+id+`">`+eles[id].name+`</a></li>`);
	$("#fc-setting-menu-"+id).click(function(){$(this).parent().remove(),menu.splice(menu.indexOf(id),1),sub_menu(id);});
},
sub_menu=function(id){
	$("#fc-setting-menu-sub").append(`<li><a id="fc-setting-menu-`+id+`">`+eles[id].name+`</a></li>`);
	$("#fc-setting-menu-"+id).click(function(){$(this).parent().remove(),menu.push(id),add_menu(id);});
},
sta_default={auto_open:true,interval:5000},sta_user,sta_t=0,sta_cnt=0,
get_sta=function(user,cnt,page=1,show=true){
	let tmp={csrf_token:user_csrf,action:"toggleShowUnofficial"},load=$("#fc-status-load"),loadstr="",t=sta_t;
	if(show)tmp.showUnofficial="on";
	clearInterval(sta_t),load.html("");
	if(cnt!==sta_cnt)return;
	sta_t=setInterval(function(){loadstr=loadstr.length===2?"":loadstr+".",$("#fc-status-load").html("Loading"+loadstr);},500);
	$.ajax({url:"/submissions/"+user+"/page/"+page,type:"POST",data:tmp,error:function(e){Alert("出错了");return;},
	success:function(e){
		clearInterval(sta_t),load.html("");
		if(cnt!==sta_cnt)return;
		let val=$(e),tpage=val.find(".active").attr("pageindex");
		try{if(val.find(".second-level-menu-list a:eq(0)").html().toLowerCase()!==user.toLowerCase()){Alert("该用户不存在");return;}}
		catch(e){Alert("该用户不存在");return;}
		if(tpage!=page&&(tpage!==void 0||page!=1)){Alert("该记录不存在");return;}
		val=val.find("#pageContent"),val.children(":eq(0)").remove(),val.children(":eq(0)").remove(),val.find(".pagination").remove(),$("#fc-status-main").html(val.html());
		if(sta_user.interval>=0)setTimeout(function(){get_sta(user,cnt,page,show);},sta_user.interval);
	}});
},
sub_default={auto_open:true},sub_user,
getsub=function(func){
	let sub=gets("sub");
	if(sub!==void 0){$("#fc-submit-form").html(sub),func();return;}
	$.ajax({type:"GET",data:{},url:"/problemset/submit",error:function(e){Alert("获取提交界面失败");},
	success:function(e){
		sub=$(e).find(".submit-form"),sub.find("tr:nth-child(5)").remove(),sub.find(".submit").attr("id","fc-submit-button");
		sub.find(".aceEditorTd").html(`<textarea style="width:600px;height:300px;resize:none" name="source"></textarea><br/>`);
		sub.find("[name=submittedProblemCode]").attr("name","submittedProblemIndex"),sub=sub.html(),puts("sub",sub),$("#fc-submit-form").html(sub),func();
	}});
},
pro_default={mem:0,auto_open:false},pro_user,prepro,prolist,focpro,promap={},
showpro=function(id){$("#fc-problem-menu-"+id).addClass("focpro"),$("#fc-problem-"+id+",#fc-bar-problem-"+id).show();},
hidepro=function(id){$("#fc-problem-menu-"+id).removeClass("focpro"),$("#fc-problem-"+id+",#fc-bar-problem-"+id).hide();},
add_pro=function(pro,x,y){
	pro.find(".sample-test .title").each(function(){//Changed Form Codeforces
		let preId=("id"+Math.random()).replaceAll(".","0"),cpyId=("id"+Math.random()).replaceAll(".", "0");
		let $copy=$(`<div title="Copy" data-clipboard-target="#`+preId+`" id="`+cpyId+`" class="input-output-copier">Copy</div>`);
		$(this).parent().find("pre").attr("id", preId),$(this).append($copy);
		let clipboard=new unsafeWindow.Clipboard('#'+cpyId,{
			text:function(trigger){return Codeforces.filterClipboardText(document.querySelector('#'+preId).innerText);}
		}),isInput=$(this).parent().hasClass("input");
		clipboard.on('success',function(e){Alert("The example "+(isInput?"input":"output")+" has been copied into the clipboard");e.clearSelection();});
	});
	x+=y,pro=[pro.find(`.problem-statement`),pro.find(`#sidebar`)],promap[x]=0;
	$("#fc-problem-menu-add").before(`<li id="fc-problem-menu-`+x+`"><a>`+x+`</a><a>X</a></li>`);
	$("#fc-problem-menu-"+x+">a:eq(0)").click(function(){if(focpro!==void 0)hidepro(focpro),showpro(focpro=this.innerHTML);});
	$("#fc-problem-menu-"+x+">a:eq(1)").click(function(){
		let fa=$(this).parent(),id=fa.children()[0].innerHTML,pos=prolist.indexOf(id);delete promap[prolist[pos]],prolist.splice(pos,1);
		if(focpro===id){
			if(pos===prolist.length)--pos;
			if(pos!==-1)focpro=prolist[pos],showpro(focpro);
			else focpro=void 0;
		}
		fa.remove(),$("#fc-problem-"+id).remove(),$("#fc-bar-problem-"+id).remove(),puts("pro-list",prolist);
	});
	$("#fc-problem-contain").append(pro[0].attr("id","fc-problem-"+x));$("#fc-bar-problem").append(pro[1].attr("id","fc-bar-problem-"+x));
	if(focpro!==void 0)hidepro(focpro);
	showpro(x),prolist.push(focpro=x),math.Queue(["Typeset",math,"fc-problem-"+x]),puts("pro-list",prolist);
},
addpro=function(x,y){
	let load=$(`<li id="fc-problem-memu-add-`+x+y+`"><a></a></li>`),loadstr="";promap[x+y]=1,$("#fc-problem-menu").append(load);
	let t=setInterval(function(){loadstr=loadstr.length===2?"":loadstr+".",load.find("a").html("Loading "+x+y+loadstr);},400);
	$.ajax({type:"GET",data:{},url:"/contest/"+x+"/problem/"+y,error:function(e){clearInterval(t),load.remove(),Alert("出错了！");},
	success:function(e){
		clearInterval(t),load.remove();let pro=$(e),title=GetTitle(e);
		if((title!=="Problem - "+y+" - Codeforces (Unofficial mirror site by GGAutomaton, accelerated for Chinese users)"&&title!=="Problem - "+y+
			" - Codeforces")||!pro.find(`#sidebar a[href="/contest/`+x+`"]`).length){delete promap[x+y],Alert("题目"+x+y+"不存在");return;}
		add_pro(pro,x,y);
	}});
},
newpro=function(Id){
	if(Id===""||Id===null)return;
	if(typeof Id!=="string"){Alert("请输入正确的题号");return;}
	if(promap[Id]===0){Alert("该题目已在序列中");return;}
	if(promap[Id]===1){Alert("该题目已在加载中");return;}
	if(!/^[0-9]+[A-Za-z][1|2]?$/.test(Id)){Alert("请输入正确的题号");return;}
	let id=Id.last(),cid;
	if(parseInt(id)>0)id=Id.slice(-2),cid=parseInt(Id.slice(0,Id.length-2));
	else cid=parseInt(Id.slice(0,Id.length-1));
	addpro(cid,id);
},
pre_pro=function(){for(let i=0;i<prepro.length;++i)newpro(prepro[i]);},
modes={"contest":{name:"比赛",js:[],css:[]}},
eles={"problem":{name:"查看题目",js:[],css:["sidebar-menu","status"],
init:function(){
	pro_user=$.default(gets("pro-user",{}),pro_default),prolist=[],promap={},puts("pro-user",pro_user),prepro=gets("pro-list");
	$("#pageContent").after($(`<div id="fc-problem" class="fc-main" style="display:none"><div class="second-level-menu">
<ul class="second-level-menu-list" id="fc-problem-menu">
	<li id="fc-problem-menu-add"><a>+add problem</a></li><li id="fc-problem-menu-close"><a>-hide window</a></li>
</ul></div><div class="problemindexholder">
<a href="javascript:;" id="fc-problem-submit" style="float:right">提交</a><div class="ttypography" id="fc-problem-contain"></div></div></div>`));
	$("#fc-problem-submit").click(function(){
		if(ele.indexOf("submit")<0){Alert("请先在设置中打开“快速提交”功能");return;}
		Change("submit"),$("#fc-submit .ace_text-input").focus();
		if(focpro!==void 0)$("#fc-submit [name=submittedProblemIndex]").val(focpro);
	});
	$("#fc-problem-menu-close").click(function(){Change("problem");});$("#fc-bar-menu").after(`<div id="fc-bar-problem" style="display:none"></div>`);
	$("#fc-problem-menu-add").click(function(){Confirm(`请输入题目编号:<input id="fc-input"/>`,function(){newpro($("#fc-input").val());});});
	$("#fc-problem-menu-add").hover(function(){let x=$("#fc-problem-menu>.backLava");if(x.length>0)x.remove();});
	var url=URLmatch();
	if(/https+:\/\/codeforces\.[com|ml]/.test(url.host)&&(/^\/problemset\/problem\/[1-9][0-9]*\/[A-Z]$/.test(url.path)||/^\/contest\/[1-9][0-9]*\/problem\/[A-Z]$/.test(url.path)))
	$(`<a href="javascript:;" style="position:absolute;right:0;top:0">添加到题目</a>`).prependTo($('#pageContent .problemindexholder')).click(function(){
		Change("problem");var x=url.path.match(/[1-9][0-9]*/)[0],y=url.path.match(/[A-Z]/)[0];
		if(prolist.indexOf(x+y)>=0){$('#fc-problem-menu-'+x+y).click(),Alert("该题目已在序列中");return;}
		add_pro($('#pageContent .problemindexholder').clone(),x,y);
	});
	if(pro_user.mem==2)pre_pro();
	else if(pro_user.mem==1&&prepro.length>0)Confirm("您上次浏览的题目未关闭，要重新加载吗?",function(){Change("problem"),pre_pro();},function(){puts("pro-list",[]);});
	else puts("pro-list",[]);
	if(pro_user.auto_open)$(document).click(function(e){
		let url=$(e.toElement).attr("href");if(url==null)return true;url=URLmatch(url);
		if(!/https+:\/\/codeforces\.[com|ml]/.test(url.host))return true;
		if(!/^\/problemset\/problem\/[1-9][0-9]*\/[A-Z]$/.test(url.path)&&!/^\/contest\/[1-9][0-9]*\/problem\/[A-Z]$/.test(url.path))return true;
		Change("problem"),newpro(url.path.match(/[1-9][0-9]*/)[0]+"/"+url.path.match(/[A-Z]/)[0]);return false;
	});
},remove:function(){$("#fc-problem").remove(),$("#fc-bar-problem").remove();},
hide:function(){$("#fc-problem,#fc-bar-problem").hide(),$("#fc-menu-problem").css("background-color","white");},
show:function(){$("#fc-problem,#fc-bar-problem").show(),$("#fc-menu-problem").css("background-color","#AAAAAA");},
set:function(){
	$("#fc-setting-clear").before($(`<div><div class="section-title">题目设置</div><br/>
<p><span>上一次未关闭的题目是否打开：</span><select id="fc-setting-problem-memory">
	<option value="0">否</option><option value="1">我自己决定是否打开</option><option value="2">自动打开</option>
</select></p><input type="checkbox" id="fc-setting-problem-auto_open"/>
<label for="fc-setting-problem-auto_open">点击题目链接时在"查看题目"中将其打开<span class="fc-care">*</span></label>
<br/><br/><button type="button" id="fc-setting-problem-end">保存</button><hr/></div>`));
	if(pro_user.auto_open)$("#fc-setting-problem-auto_open").attr("checked","checked");
	$("#fc-setting-problem-end").click(function(){
		pro_user={mem:$("#fc-setting-problem-memory>option:selected").val(),auto_open:$("#fc-setting-problem-auto_open:checked").length===1};
		puts("pro-user",pro_user),Alert("修改成功");
	});
	$("#fc-setting-problem-memory>option:eq("+pro_user.mem+")").attr("selected","selected");
}},"submit":{name:"提交代码",js:[],css:[],
init:function(){
	sub_user=$.default(gets("sub-user",{}),sub_default),puts("sub-user",sub_user);
	$("#pageContent").after($(`<div id="fc-submit" class="fc-main" style="display:none">
<form id="fc-submit-form" method="post" enctype="multipart/form-data" target="_blank"></form></div>`));
	getsub(function(){$("#fc-submit-button").click(function(){
		$("#fc-submit .fc-care").remove();let val=$("#fc-submit [name=submittedProblemIndex]").val();
		if(val===""){$("#fc-submit .error__submittedProblemIndex").html(`<span class="fc-care">Choose the problem</span>`);return false;}
		if(!/^[0-9]+[A-Za-z][1|2]?$/.test(val)){$("#fc-submit .error__submittedProblemIndex").html(`<span class="fc-care">Input a legal problem</span>`);return false;}
		let id=val.last(),cid;
		if(parseInt(id)>0)id=val.slice(-2),cid=parseInt(val.slice(0,val.length-2));
		else cid=parseInt(val.slice(0,val.length-1));
		if($("#fc-submit [name=source]").val()===""){$("#fc-submit .aceEditorTd").append(`<span class="fc-care">Put you source into the textarea</span>`);return false;}
		$("#fc-submit [name=submittedProblemIndex]").val(id);
		if(!sub_user.auto_open||ele.indexOf("status")<0){$("#fc-submit-form").attr("action",`/contest/`+cid+`/submit?csrf_token=`+user_csrf);return true;}
		$.ajax({type:"POST",url:`/contest/`+cid+`/submit?csrf_token=`+user_csrf,error:function(e){Alert("提交失败");return;},data:{
			csrf_token:user_csrf,action:"submitSolutionFormSubmitted",submittedProblemIndex:$("#fc-submit [name=submittedProblemIndex]").val(),
			programTypeId:$("#fc-submit [name=programTypeId]>option:selected").val(),source:$("#fc-submit [name=source]").val()},
			success:function(e){
				let sub=$(e);
				if(!sub.find(`#sidebar a[href="/contest/`+cid+`"]`).length){Alert("该题目不存在!");return;}
				if(sub.find(".error.for__source").length){Alert("您已经提交过相同的代码!");return;}
				if(GetTitle(e).substr(0,6)!=="Status"){Alert("该题目不存在!");return;}
			}
		});
		Change("status"),$("#fc-status-user").val(user),$("#fc-status-page").val(1),$("#fc-status-show").attr("checked","checked");
		$("#fc-status-see").click(),document.documentElement.scrollTop=0;return false;
	});});
},set:function(){
	$("#fc-setting-clear").before(`<div><div class="section-title">提交设置</div><br/>
<span>点击提交时：</span><select name="auto_open" id="fc-setting-submit-auto_open">
<option value="true">若开启了“查看状态”，则进行跳转</option><option value="false">打开“status”页面</option>
</select><span class="fc-care">*</span><br/><br/><button type="button" id="fc-setting-submit-end">保存</button><hr/></div>`);
	$("#fc-setting-submit-auto_open>option:eq("+(sub_user.auto_open===true?0:1)+")").attr("selected","selected");
	$("#fc-setting-submit-end").click(function(){sub_user={auto_open:$("#fc-setting-submit-auto_open>option:selected").val()==="true"},puts("sub-user",sub_user);});
}},"status":{name:"查看状态",js:["facebox"],css:["status","facebox"],
init:function(){
	sta_user=$.default(gets("sta-user",{}),sta_default),puts("sta-user",sta_user);
	$("#pageContent").after($(`<div id="fc-status" class="fc-main" style="display:none"><div id="fc-status-head">
用户：<input type="text" id="fc-status-user" value="`+user+`"/>&nbsp;&nbsp;&nbsp;页码：<input type="text" id="fc-status-page" value="1"/>&nbsp;&nbsp;&nbsp;
<input type="checkbox" id="fc-status-show"/ checked>show unofficial&nbsp;&nbsp;&nbsp;<button type="button" id="fc-status-see">查看</button>
&nbsp;&nbsp;&nbsp;<button type="button" id="fc-status-stop">停止本次自动刷新</button>
<a id="fc-status-load"></a></div><div id="fc-status-main"></div></div>`));
	$("#fc-status-stop").click(function(){++sta_cnt,clearInterval(sta_t),$("#fc-status-load").html("");});
	$("#fc-status-see").click(function(){get_sta($("#fc-status-user").val(),++sta_cnt,$("#fc-status-page").val(),$("#fc-status-show:checked").length===1);});
	if(sta_user.auto_open)get_sta(user,0);
},set:function(){
	$("#fc-setting-clear").before(`<div><div class="section-title">提交记录设置</div><br/>
<input type="checkbox" id="fc-setting-status-auto_open"><label for="fc-setting-status-auto_open">是否自动打开自己的提交记录</label><br/><br/>
自动刷新间隔（不刷新为-1）：<input type="number" min="-1" value="`+sta_user.interval+`" id="fc-setting-status-interval"/>毫秒<br/><br/>
<button type="button" id="fc-setting-status-end">保存</button><hr/></div>`);
	if(sta_user.auto_open)$("#fc-setting-status-auto_open").attr("checked","checked");
	$("#fc-setting-status-end").click(function(){
		let interval=parseInt($("#fc-setting-status-interval").val());
		if(typeof interval!=="number"||interval!==interval){Alert("自动刷新间隔应为大于等于-1的整数");return;}
		if(interval<0)interval=1;$("#fc-setting-status-interval").val(interval);
		sta_user={auto_open:$("#fc-setting-status-auto_open:checked").length===1,interval:interval},puts("sta-user",sta_user),Alert("修改成功");
	});
}},"setting":{name:"设置",js:[],css:[],
init:function(){
	$("#pageContent").after($(`<div id="fc-setting" class="fc-main problem-statement" style="display:none">
<div class="header"><div class="title">设置</div><div>带有<span class="fc-care">*</span>的选项在修改后，需要重新加载才能生效。</div></div>
<div><div class="section-title">Fast Codeforces版本:`+version+`</div></div><hr/>
<button type="button" class="fc-care" id="fc-setting-clear">清理缓存</button><br/><br/>
<button type="button" class="fc-care" id="fc-setting-default">恢复默认设置</button></div>`));
	for(let i=0;i<len;++i)eles[ele[i]].set();
	$("#fc-setting-clear").click(function(){Confirm("您确定要清除缓存?",function(){Clear(),Alert("清除缓存成功");});});
	$("#fc-setting-default").click(function(){Confirm("您确定要恢复默认设置?请先保存好您的文件",function(){Reload(),default_set(),showMain(),Alert("恢复默认设置成功");});});
},set:function(){
	menu=ele.slice();
	$("#fc-setting-clear").before($(`<div><div class="section-title">目录设置<span class="fc-care">*</span></div><br/><h6>当前目录</h6>
<ul id="fc-setting-menu-add"></ul><h6>剩余目录</h6><ul id="fc-setting-menu-sub"></ul><button id="fc-setting-menu-end" class="fc-care">保存</button><hr/></div>`));
	for(let i=0;i<len;++i)add_menu(ele[i]);
	for(let i in eles)if(ele.indexOf(i)===-1)sub_menu(i);
	$("#fc-setting-menu-end").click(function(){
		Confirm("您确定要修改目录吗?",function(){Reload(),fc.ele=menu,puts("fc",fc),showMain(),Alert("修改成功");});
	});
}}},ele,len,nele="pre",css_ready=[],js_ready=[],
Change=function(id){
	if(nele===id)eles[id].hide(),show_pre(),nele="pre";
	else if(nele==="pre")hide_pre(),eles[id].show(),nele=id;
	else eles[nele].hide(),eles[id].show(),nele=id;
},
CreateEle=function(id){
	let obj=eles[id],js=obj.js,css=obj.css;
	for(let i=0;i<js.length;++i)if(js_ready.indexOf(js[i])==-1)$("head").append($(`<script src="//sta.codeforces.com/s/0/js/`+js[i]+`.js"></script>`)),js_ready.push(js[i]);
	for(let i=0;i<css.length;++i)if(css_ready.indexOf(css[i])==-1)$("head").append($(`<link rel="stylesheet" href="//sta.codeforces.com/s/0/css/`+css[i]+`.css"/>`)),css_ready.push(css[i]);
	$("#fc-stop").before($(`<a>&nbsp;&nbsp;<span id="fc-menu-`+id+`" style="border-radius:3px">`+obj.name+`</span>
<span style="float:right">&#8635;</span></a><br/>`)),obj.init();
	if(!("show" in eles[id]))eles[id].show=function(){$("#fc-"+id).show(),$("#fc-menu-"+id).css("background-color","#AAAAAA");};
	if(!("hide" in eles[id]))eles[id].hide=function(){$("#fc-"+id).hide(),$("#fc-menu-"+id).css("background-color","white");};
	if(!("remove" in eles[id]))eles[id].remove=function(){$("#fc-"+id).remove();};
	if(!("set" in eles[id]))eles[id].set=function(){};
	$("#fc-menu-"+id).click(function(){Change(id);});
	$("#fc-menu-"+id).siblings().click(function(){
		if(nele===id)Change(id);
		obj.remove(),obj.init(),Alert("加载成功！");
	});
},
Reload=function(){
	if(nele!=="pre")Change(nele);
	for(let i=0;i<len;++i)eles[ele[i]].remove();
},
showLogin=function(){
	Reload(),$("#fc-menu").html(`<a href="javascript:;" id="fc-start">开始使用Fast Codeforces</a>`);
	$("#fc-start").click(function(){Confirm("Fast Codeforces需要使用您的CSRF-token，您确定要授权吗?",function(){fc.using=true,puts("fc",fc),Alert("授权成功"),showMain();});});
},
showMain=function(){
	ele=fc.ele;
	if(ele.length===0)ele=["problem","submit","status","setting"];
	if(ele.indexOf("setting")===-1)ele.push("setting");
	fc.ele=ele,puts("fc",fc),len=ele.length,nele="pre",$("#fc-menu").html(`<a href="javascript:;" id="fc-stop">停止使用Fast Codeforces</a>`);
	$("#fc-stop").click(function(){Confirm("您确认要停止使用Fast Codeforces?",function(){fc.using=false,puts("fc",fc),Alert("Fast Codeforces已停止"),showLogin();});});
	for(let i=0;i<len;++i)if(ele[i]!=="setting")CreateEle(ele[i]);
	if(ele.indexOf("setting")>=0)CreateEle("setting");
};puts("fc",fc);
$(function(){
	if($("#sidebar").length===0)return;
	let sidebar=$("#sidebar").html();
	$("#sidebar").html(`<div id="fc-bar">
<style>
	.input-output-copier{font-size:1.2rem;float:right;color:#888 !important;cursor:pointer;border:1px solid rgb(185, 185, 185);padding:3px;margin:1px;line-height:1.1rem;text-transform:none;}
	.input-output-copier:hover{background-color:#def;}
	.fc-main{margin-right:22em !important;margin:1em;padding-top:1em;min-height:20em;}[type=button],[type=submit],#fc-menu>a>span{cursor:pointer}
	.focpro{background-color:grey;}#fc-problem-menu>li{border-radius:12px;cursor:pointer}.fc-care{color:red}
</style>
<div class="roundbox sidebox" id="fc-bar-menu"><div class="roundbox-lt">&nbsp;</div><div class="roundbox-rt">&nbsp;</div>
<div class="caption titled">&rarr; Fast Codeforces<div class="top-links"><a id="fc-menu-turn">-</a>
<a href="https://github.com/xcx-xcx/fast-codeforces">帮助&文档</a></div></div>
<div style="padding:0.5em">
	<div id="fc-menu" style="text-align:center;border-bottom:1px solid rgb(185,185,185);margin:0 -0.5em 0.5em -0.5em;padding:0 1em 0.5em 1em"></div>
</div></div></div><div id="pre-bar">`+sidebar+`</div>`);
	$("#fc-menu-turn").click(function(){
		let x=$("#fc-menu-turn");
		if(x.html()==="-")x.html("+"),$("#fc-menu").hide();
		else x.html("-"),$("#fc-menu").show();
	});
	Codeforces.countdown();
	if($(".header-bell").length===0)$("#fc-menu").html(`<span>请登录后再使用！</span>`);
	else if(fc.using)showMain();
	else showLogin();
	if(version!==fc.version)fc.version=version,puts("fc",fc),setTimeout(function(){Alert("Fast Codeforces的版本已经更新了，赶快去设置看看呗");},500);
});};
