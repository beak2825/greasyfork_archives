// ==UserScript==
// @name            QQ群高级管理——筛选清理增强
// @author			极品小猫
// @version         0.8
// @description     QQ群高级管理，筛选工具增强工具，用于清理Q群成员
// @include			http://qun.qq.com/member.html*
// @icon			http://mail.qq.com/favicon.ico
// @run-at			document-idle
// @grant			none
// @grant			GM_addStyle
// @homepage		https://greasyfork.org/zh-CN/scripts/12063-qq%E7%BE%A4%E9%AB%98%E7%BA%A7%E7%AE%A1%E7%90%86-%E7%AD%9B%E9%80%89%E6%B8%85%E7%90%86%E5%A2%9E%E5%BC%BA
// @namespace		https://greasyfork.org/zh-CN/scripts/12063-qq%E7%BE%A4%E9%AB%98%E7%BA%A7%E7%AE%A1%E7%90%86-%E7%AD%9B%E9%80%89%E6%B8%85%E7%90%86%E5%A2%9E%E5%BC%BA
// @downloadURL https://update.greasyfork.org/scripts/12063/QQ%E7%BE%A4%E9%AB%98%E7%BA%A7%E7%AE%A1%E7%90%86%E2%80%94%E2%80%94%E7%AD%9B%E9%80%89%E6%B8%85%E7%90%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/12063/QQ%E7%BE%A4%E9%AB%98%E7%BA%A7%E7%AE%A1%E7%90%86%E2%80%94%E2%80%94%E7%AD%9B%E9%80%89%E6%B8%85%E7%90%86%E5%A2%9E%E5%BC%BA.meta.js
// // ==/UserScript==
// 
// 更新日志
// v0.0.8 【2016.05.18】
// 1、删除清除选项
// 2、调整删除成员时的UI位置
// 3、兼容新版QQ群高级管理页面
// 
// v0.0.7 【2015.10.15】
// 1、加入清理日志功能
// 2、加入筛选模式提示
// 3、部分UI调整
// 
// v0.0.6 【2015.09.21】
// 1、调整删除成员时的UI位置
// 2、在删除成员时，保存当前筛选的值
// 3、筛选条件修改，允许先筛选加入时间，后筛选最后发言时间
// 
// v0.0.5 【2015.09.17】
// 1、删除成员时，显示详细的成员名字及QQ号
// 2、增加【白名单】成员功能，白名单信息写入浏览器的 localStorage 中
// 
// v0.0.4 【2015.09.01】
// 1、优化加入日期筛选
// 
// v0.0.3 【2015.08.30】
// 1、增加条件筛选不可用提示
// 2、增加【加入天数】筛选
// 
// v0.0.2 【2015.08.27】
// 1、增加【最后发言日期】筛选
// 2、清理新人不清理当天加入的
 
var host=location.hostname;
var hash=location.hash;
var PreExcludeQQ='';//预设白名单QQ号，多个号码使用英文逗号分隔

//if(!localStorage['CleanLog']) localStorage['CleanLog']='"'+Dates()+'":[]]';
//if(!JSON.parse("{"+localStorage["CleanLog"]+"}")[Dates()]) localStorage['CleanLog']+=','+'"'+Dates()+'":[]';
if(!localStorage['CleanLog']) localStorage['CleanLog']='[{"date":"'+Dates()+'","list":[]}]';
var CleanLogData=eval(localStorage['CleanLog']);
if(CleanLogData[CleanLogData.length-1]['date']!==Dates()) CleanLogData.push({"date":Dates(),"list":[]}),localStorage['CleanLog']=JSON.stringify(CleanLogData);

GM_addStyle('\
.foot{top:-20px;position: relative;}');

document.head.innerHTML+="<style>\
.ui-dialog {width:780px!important;}\
.ui-dialog-cnt{margin:20px 40px!important;}\
/*表格宽度*/#DelQQList {border-collapse:collapse;width:650px;}\
#DelQQList tr:nth-child(1) td{background-color:#eef0f4;text-align:center;}\
#DelQQList td{border-bottom:dotted 2px;}\
/*Q名单元格*/#DelQQList tr:not(:nth-child(1)) td:last-child {padding:0 20px;}\
/*单元格列宽+分栏线*/#DelQQList td:not(:last-child) {width:100px;line-height:25px;border-right:solid 2px;text-align:center;}\
/*活跃度单元格列宽*/#DelQQList td:nth-child(3) {width:60px;}\
#CleanMode{color:red;}\
.newButton{color:#fff;border:0px;margin:5px 10px;font-size:18px;}\
</style>\
";
$('#groupMemberTit').style.height="auto";
$('#groupMemberTit').addEventListener('DOMSubtreeModified',function(){
	if($('#groupMemberTit').children.length>=3&&!$('#cleanMember')) {
		$('#groupMemberTit').innerHTML+='\
<button id="cleanMember" class="add-member" data-tag="addmember">清理死人</button>\
<button id="cleanLog" class="add-member">清理日志</button>\
<br>\
当前筛选模式：<span id="CleanMode"></span>\
<div style="padding: 5px 0;">\
最后发言日期筛选：<input id="endDate" placeholder="格式：2015/08/05">\
　活跃度筛选：<input id="degree" placeholder="数值" style="width:50px;">\
　加入天数死人筛选：<input id="joinDate" placeholder="数值" style="width:50px;" onkeyup="this.value=this.value.replace(/[^\\d]/g,\'\')">天前\
　<a href="'+hash+'" onclick="alert(this.title)" title="=====使用方法=====\r\n1、打开QQ群高级管理页面\r\n2、点击最后发言列标题，此时可进行【升序】（列标题下的第二个）或【降序】（列标题下的第一个）的排序\r\n3、点击清理死人按钮（系统限制只能20人）\r\n4、删除成员\r\n \r\n=====使用条件=====\r\n 1、最后发言筛选：【最后发言日期】与【活跃度】筛选同时使用\r\n 2、无任何筛选条件：清理活跃度：0，无发言时间，非今天加入的人（该条件限倒序时有效）\r\n 3、加入日期筛选：清理活跃度：0，无发言时间，指定天数前加入的人（该条件限倒序时有效）\r\n 4、加入日期+最后发言筛选：允许以上2种条件同时筛选">帮助</a>\
<br>\
白名单成员：<input id="excludeQQ" placeholder="白名单QQ号，多个使用英文逗号分隔" style="width:650px;" onkeyup="this.value=this.value.replace(\'，\',\',\').replace(/[^\\d,]/g,\'\')">\
	<button id="SaveExclude" class="add-member">保存白名单</button>\
</div>\
';
		$('#excludeQQ').value=!localStorage['excludeQQ']?PreExcludeQQ:localStorage['excludeQQ'];		//加载白名单信息
		if(!localStorage['ToDay']||localStorage['ToDay']!=ToDay().toDateString()) localStorage['ToDay']=ToDay().toDateString();
			$('#endDate').value=localStorage['endDate'];
			$('#degree').value=localStorage['degree'];
				
		var obj;
		$('#cleanMember').addEventListener('click',function(){
			var Count=0;
			
			if($('#joinDate').value!=='' && ($('#endDate').value!=='' || $('#degree').value!=='')){
				$('#CleanMode').textContent='【加入日期】+【最后发言日期】';
			} else if($('#endDate').value!=='' && $('#degree').value!=='') {
				$('#CleanMode').textContent='【最后发言日期】';
			} else if($('#endDate').value!=='' && $('#degree').value==='') {
				alert('【活跃值】未输入，无法使用清理功能');
				return false;
			} else if($('#endDate').value==='' && $('#degree').value!==''){
				alert('【最后发言日期】未输入，无法使用清理功能');
				return false;
			}
			
			$('#selectAll').click();$('#selectAll').click();

			for(i=0;Count<20&&i<$('.mb').length;i++){
              var obj=$('.mb')[i].children;
              var joinDate=obj[8].textContent;			//成员加入日期
              var Level=obj[9].textContent;				//成员等级积分
              var QQNumber=obj[5].textContent;			//QQ号
              var LastDate=obj[10].textContent;			//最后发言时间

				if($('#joinDate').value!==''&&(Dateif(ToDay())-Dateif(ToDay(joinDate)))>Number($('#joinDate').value)&&Level=='潜水(0)'&&/[^\/]*\-[^/]*/.test(LastDate)) {
					//加入日期筛选
					if(obj[0].children[0]&&checkExcludeQQ(QQNumber)) obj[0].children[0].checked=true;
					Count++;
				} else if(Date.parse($('#endDate').value)>=Date.parse(LastDate)&&
						  parseInt($('#degree').value)>Level.match(/\d+/)[0]){
					//使用活跃度或日期筛选
					if(obj[0].children[0]&&checkExcludeQQ(QQNumber)) obj[0].children[0].checked=true;
					Count++;
				} else if($('#endDate').value===''&&$('#joinDate').value===''&&!isToDay(joinDate)&&Level=='潜水(0)'&&/[^\/]*\-[^/]*/.test(LastDate)) {
					//选择条件：活跃度：0，无发言时间，非今天加入，未使用日期筛选
					if(obj[0].children[0]&&checkExcludeQQ(QQNumber)) obj[0].children[0].checked=true;
					Count++;
				}
			}

			
			$('.del-member')[0].disabled=false;
			$('.del-member')[0].className='del-member';
		});
		
		$('button[cmd="del"]')[0].addEventListener('click',function(){
			localStorage['joinDate']=$('#joinDate').value;
			localStorage['endDate']=$('#endDate').value;
			localStorage['degree']=$('#degree').value;
			
			var DelSelect=$('input[class="check-input"]:checked');
			var QQArr=[];
			for(i=0;i<DelSelect.length;i++){
				var QQNum=DelSelect[i].value;
				var QQName=$('#useIcon'+QQNum).nextElementSibling.textContent.replace(/(?:<br>|[\r\n\t])/gm,'');
				var LastDate=$('.mb'+QQNum)[0].children[10].textContent.replace(/[\r\n\t]/igm,'');
				var JoinDate=$('.mb'+QQNum)[0].children[8].textContent.replace(/[\r\n\t]/igm,'');
				var Activity=$('.mb'+QQNum)[0].children[9].textContent.match(/\d+/)[0];
					//QQArr.push(QQNum+" —— "+QQName+LastDate);
					QQArr.push({QQNum:QQNum,QQName:QQName,LastDate:LastDate,JoinDate:JoinDate,Activity:Activity});
			}
			setTimeout(function(){
				var td='';
				for(var i in QQArr){
					td+="<tr><td>"+QQArr[i].JoinDate+"</td><td>"+QQArr[i].LastDate+"</td><td>"+QQArr[i].Activity+"</td><td>"+QQArr[i].QQNum+"</td><td>"+QQArr[i].QQName+"</td></tr>";
				}
				var newMsg="确定将以下共 "+QQArr.length+" 位成员从本群中删除吗？<br><table id=\"DelQQList\"><tr><td>加入日期</td><td>最后发言</td><td>活跃度</td><td>QQ号</td><td>QQ名</td></tr>"+td+"</table>"
				//var newMsg="确定将<p>"+QQArr.join("<BR>").replace(/<br>/g,'')+"<p>共 "+QQArr.length+" 位成员从本群中删除吗？";
				
				$('.msg')[0].innerHTML=$('.msg')[0].innerHTML.replace(/^.*删除吗？\s*<br>/,newMsg);
				$('.ui-dialog')[0].style.top='5px';
				//$('.ui-dialog')[0].style.width='600px';
				$('.ui-dialog')[0].style.left=(document.body.clientWidth-$('.ui-dialog')[0].offsetWidth)/2+"px";
				
				$('.btn-submit')[0].addEventListener('click',function(){
					CleanLogData[CleanLogData.length-1].list=CleanLogData[CleanLogData.length-1].list.concat(QQArr);	//
					localStorage['CleanLog']=JSON.stringify(CleanLogData);
				});
			},100);
		});


		$(document).keydown(function(e){		//监听回车键操作，点击确定按钮
			console.log(e.keyCode);
			if(e.keyCode==13) $('.btn-submit').click();
		});
		
		$('#SaveExclude').addEventListener('click',function(){
			localStorage['excludeQQ']=$('#excludeQQ').value;
			alert('保存成功');
		});
		
		//清理日志部分
		$('#cleanLog').addEventListener('click',function(){
			if(!$('#CleanLogUI')||$('.ui-dialog')[0].className!=''){
				var a=document.createElement('div');
					a.id='CleanLogUI';
					a.className='ui-dialog on'
					a.style.cssText='height: auto; top: 40px; left: 308px;';
					a.innerHTML+='\
<div class="head"><h2>清理成员日志</h2><a class="icon-close" onclick="document.body.removeChild(this.parentNode.parentNode)"></a></div>\
<div class="body-content">\
<div class="ui-dialog-cnt">\
	<select id="selectCleanLog" style="font-size:22px;"><option value="选择日期" selected>选择日期</option></select>\
	<button id="DeleteLog" class="add-member newButton">清空所有记录</button>\
<div id="msg" style="overflow-y: auto;height:500px"></div>\
</div>\
</div>\
';
				document.body.appendChild(a);
			}
			for(var i in CleanLogData){
				$('#selectCleanLog').innerHTML+='<option value="'+CleanLogData[i].date+'">'+CleanLogData[i].date+'</option>';
			}
			$('#selectCleanLog').addEventListener('change',function(){
				var newMsg;
				console.log($('#selectCleanLog').selectedIndex);
				var QQArr=CleanLogData[($('#selectCleanLog').selectedIndex-1)].list;
				console.log(CleanLogData[($('#selectCleanLog').selectedIndex-1)].list)
				if(QQArr.length!==0) {
					for(i in QQArr){
						var td='';
						for(var i in QQArr){
							td+="<tr><td>"+QQArr[i].JoinDate+"</td><td>"+QQArr[i].LastDate+"</td><td>"+QQArr[i].Activity+"</td><td>"+QQArr[i].QQNum+"</td><td>"+QQArr[i].QQName+"</td></tr>";
						}
						newMsg="已删除 "+QQArr.length+" 位成员！<br><table id=\"DelQQList\" width=\"100%\"><tr><td>加入日期</td><td>最后发言</td><td>活跃度</td><td>QQ号</td><td>QQ名</td></tr>"+td+"</table>";
					}
				} else {
					newMsg='当天没有清理记录';
				}
				$('#msg').innerHTML=newMsg;
			});
			
			$('#DeleteLog').addEventListener('click',function(){
				if(confirm("确认要清空所有的【清理日志】吗？")) {
					localStorage['CleanLog']='[{"date":"'+Dates()+'","list":[]}]';
					CleanLogData=eval(localStorage['CleanLog']);
					$('#selectCleanLog').innerHTML='<option value="选择日期" selected>选择日期</option><option value="'+CleanLogData[0].date+'">'+CleanLogData[0].date+'</option>';
					$('#msg').innerHTML='';
				}
			})
		});
	}
});

function $(obj) {//ID, Class选择器
	var objF=obj.replace(/^[#\.]/,'');
	return (/^#/.test(obj)) ? document.getElementById(objF):(/^\./.test(obj)) ? document.getElementsByClassName(objF) : document.querySelectorAll(obj);
}
function isToDay(date){
	return new Date().toDateString() === new Date(date).toDateString();
}
function ToDay(date){
	date=date!==undefined?new Date(date):new Date();
	return new Date(date);
}
function addDay(i){
	var Dates=new Date();
	return new Date(Dates.setDate(Dates.getDate() + Number(i)));
}
function Dateif(date){
	return date.getTime()/(1000*60*60*24);
}
function Dates(date){
	date=date!==undefined?new Date(date):new Date();
	return date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate();
}
function checkExcludeQQ(QQ){
	var i;
		QQ=QQ.replace(/\s/g,'');
	var testQQ=new RegExp('[^\\d,]?'+QQ+'[^\\d,]?');
	console.log(testQQ,$('#excludeQQ').value);
	if(testQQ.test($('#excludeQQ').value)) return false;
		
		/*
	var excQQArr=$('#excludeQQ').value.split(',');
	for(i=0;i<excQQArr.length;i++){
		console.log(QQ,excQQArr[i]);
		if(QQ===excQQArr[i]) return false;
	}
	*/
	return true;
}