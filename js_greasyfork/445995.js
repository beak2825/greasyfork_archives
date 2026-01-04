/*globals jQuery,$,waitForKeyElements*/
// ==UserScript==
// @name         cumtb教务系统
// @namespace    http://tampermonkey.net/
// @version      6.0.1
// @description  cumtb教务系统常用功能集合
// @author       Su.
// @match        https://*.cumtb.edu.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjMyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTctMTItMDFUMDk6MTI6MzI8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy4zPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo/5hY1AAAEZUlEQVRYCe1W3WscVRS/587Obm03H9WCFaUPbSxYpLSi6IMf9FWQYFJEqYoBUaw2LS1RiEmNYLMxVsVEUyu1FEulEG1obd9E8ME/QG2lfjyIfVGUtm6WNN2Pe/2dMzuzM+vNZvISX7zZmTlz7jm/3++ee+cQpf4f/3EFaKn8j75R7K5Zs19Zez63wn9l+uX870vFiMenEmCtpe2F2e6qEeKt1ipl8YdfUWsa2Xp/5+TINqrGgdPaLQUI8fhst6na10C4hYmxcv6xUX8qBZAfPK13zQx3fpWWOIxrKaBnrHjUGtsndDHyYPUNATxPjER6mii77/TQykvsSzOcAraPlc5arU7c1LHqs7+ulgaVsa9CiM/E8SqgQhEHsYLgN6c8OrAu3/H2ZD9djwIWMLTTr9U9IP308tXSSe8GNUXKu1dp+p7A4FRcBwnmaCUZdeBSqXi+d/Tvh534MadTAOHQ8YKwwB47py4oZdZnNrTdTZoKuGpSb2ZzqQl9VnUZq871FIpnegvz62OcCTMMTzgfe6v0pzFqTfygodgnvWz+RVW51lWtVI4Za+7gLZBdAIpUh5/RVogz0Kj1dezeuJfLF6b30rU4mbMCINPBoQKsgMpiHzfl0gXl1Uodt7bfhYCDpLSJwBAXVkQ2SvjrydbmSNlhWy5djOLrhlOA5nWAWTADJSIEOWtNVW841kfzM0OdA15GP4iJnxvcLFiYpSIMEGCwOEhQal0qARZLk2QWIRfnB7bnNSBODbZ/c8vNnVswM4EAHBwmCmKDZ0DMzkhII10sdwXQ3jglItd12xH90fM0d3r/6t1ae9uQ9ovkCK8gAIMFsYP55MZGNByQCLPCXU8MhaAsjBSrQIQCY2aw7Wsv175Ze/ogrlpAGjCLFDjEF0+C7RZAxMdApIelx+eHRqeVr71G92kCU7epMuIvIvVKVL1AQ3Nk9J6JrLiBpaIKicE4rcYT78w/Yn6bG0PaJi61a7WufLcA3oJYNK9GBh5e/BTCuWOifB/c46ZmHtCokPQGDo4WEBhyj3yCJjenAO2RjrX5RjQsNCiBefp9u9HUyqMg7GUHb5HirsBaY2xYi7yz23EGlVMAyCWec5oHkVm7473yoVqt8izmEvkJEZgUYQIgiiCAfpXX2C0BEPM7DyfPG2OPxOL+ZQYi0KKxbdJ6gvLMgn10TSb7bnOCW0A9tzk47Xsoglu10fbjVSo3fGQP/eHKdwrgPlAvmisnnU+rL/HB7juxZ8V3rRKcAlDABbegFRjP4fD8SOQNHO/PfLFYLM87ibB9b6ZJTsbQZbSP3V2bs3emJef8BU/7k5PlPhzjw/jM/CRR8g09ooK4qTbff/3QTrqSnF38bUEBnPrUROUhY+0pfFA3uqBQqTNaZwc+eYl+cs2n8bUUwADPfGhvr5bLZ9EbNoaAWPW3uPYe3+Uv+d/wECN8LiqAA1+YsquL1crnKPUmJAx19ftHR9CRQpBleT532Po7P7D5ZSFbTpJ/ADD+XJu5KreuAAAAAElFTkSuQmCC
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        unsafeWindow
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/445995/cumtb%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/445995/cumtb%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

/*对按钮内容进行自定义*/
let URLs=[],按钮内容=["我的课表","选课","考试信息","成绩信息","学生总结性评教","空闲教室查询"]//可自行调整，务必与教务系统中按钮下方的内容一样，注意格式(符号为英文格式)，中间用逗号隔开
/*自定义完毕*/
const URL对照={"空闲教室查询":"/room-free","学籍信息":'/student-info',"学生信息核对":'/std-info-check-apply',"学籍异动申请":'/std-alteration-apply',"转专业申请":'/change-major-apply',"我的培养方案":'/program',"培养方案完成情况":'/program-completion-preview',"选课":'/course-select',"我的课表":'/course-table',"体育保健课申请":'/course-select-apply',"免修申请":'/exempt-study-apply',"专业课组选择":'/std-professional-group',"学生学生专业课组变更申请":'/pro-group-change-apply',"缓考申请":'/exam-delay-apply',"考试信息":'/exam-arrange',"成绩信息":'/grade/sheet',"成绩复核申请":'/grade-review-apply',"补考成绩查询":'/make-up-grade/sheet',"学生可信学业证明申请":'/credible-school-report-apply',"创新学分":'/other-achievement-apply',"导师互选结果查询":'/select/std-tutor-select-result',"学生变更导师申请":'/change-tutor-apply',"学生总结性评教":'/evaluation/summative',"学生问卷调查":'/questionnaire',"毕业设计(论文)抽检结果查询":'/thesis-check',"毕业设计(论文)":'/thesis-flow',"课题申报":'/sie-project-apply/index',"学生选题":'/sie-project-member-apply',"我的项目":'/sie-project'}
let members = 按钮内容.length;for(let i=1;i<=members;i++){URLs[i]='https://jwxt.cumtb.edu.cn/student/for-std'+URL对照[按钮内容[i-1]]}
let identify=GM_getValue("身份");//入口、主页
let numb = GM_getValue("账号");//登陆
let mima = GM_getValue("密码");//登录
let 上次课程数 = GM_getValue("上次课程数")//成绩单
let 上次不及格 = GM_getValue("上次不及格")//成绩单
let setTime = GM_getValue("刷新时间")//成绩单
var 刷新;//成绩单
let last_page = GM_getValue("上次打开");//登录、主页

function 教务系统入口(){
	if(!identify){
		identify=prompt("首次登录需要输入身份。学生/教师/管理/外聘/家长？")
		if(identify!=null && identify!=""){GM_setValue("身份",identify)}
	}
	setTimeout(()=>{
		switch (identify){
			case "学生":document.querySelector("body > div.login-box > div > div.login-content > div:nth-child(1) > div.login-student-box > a").click();break;
			case "教师":document.querySelector("body > div.login-box > div > div.login-content > div:nth-child(1) > div.login-teacher-box > a").click();break;
			case "管理":document.querySelector("body > div.login-box > div > div.login-content > div:nth-child(2) > div.login-manager-box > a").click();break;
			case "外聘":case "家长":document.querySelector("body > div.login-box > div > div.login-content > div:nth-child(2) > div.login-parent-box > a");break;
		}
	},500)
	let table = document.createElement('div');
	table.style.cssText="width:100px;padding:20px;border:1px solid #ccc;border-radius:10px;position:fixed;top:10px;right:50px;background:rgba(255, 255, 255,0.5);display:flex;justify-content:center;align-items:center;flex-direction:column"
	let body = document.querySelector('body');
	body.appendChild(table);
	let btn1 = document.createElement('button');
	btn1.innerHTML="更改身份"
	btn1.style.cssText="height:30px;width:80px;border-color:#ffb6c1;border-radius:5px;position:fixed;cursor:pointer;background:white;color:red";
	table.appendChild(btn1);
	document.querySelector('button').onmouseover=function(){this.style.background ='lightpink';this.style.color='black'}
	document.querySelector('button').onmouseout =function(){this.style.background = 'white' ; this.style.color ='red'}
	btn1.addEventListener('click',更改身份)
}

function 登录(){
	//账号密码判断
	if(!numb){
		numb=prompt("首次登录需要输入账号")
		if(numb!=null && numb!=""){GM_setValue("账号",numb)}
	};
	if(!mima){
		mima=prompt("首次登录需要输入密码（仅存储在本地）")
		if(mima!=null && mima!=""){GM_setValue("密码",mima)}
	};
	//添加div
	let t = document.createElement('div');
	t.style.cssText="width:300px;padding:20px;border:1px solid #ccc;border-radius:10px;z-index:1001;position:fixed;top:43px;left:10px;background:rgba(255, 255, 255,0.5);display:block;justify-content:center;flex-direction:column";
	let cssText="height:30px;border-color:#ccc;border-radius:5px;margin:10px;cursor:pointer;background:lightgreen;"
	$("body").append(t)
	let btns= ['更改账号','查看密码','更改密码'];let amount = btns.length;
	for(let i=1;i<=amount;i++){
		let tnnd = ['button#'+btns[i-1]]
		$(`<button id = ${btns[i-1]} style=${cssText+"border-color:lightpink;width:80px;background:white;color:red"}>${btns[i-1]}</button>`).appendTo($(t)).on('click',eval(btns[i-1]))
		document.querySelector(tnnd).onmouseover=function(){this.style.background ='lightpink';this.style.color='black'}
		document.querySelector(tnnd).onmouseout =function(){this.style.background = 'white' ; this.style.color ='red'}
	}
	//登录1
	if(location.href.indexOf('login?service=')!=-1){//从教务系统入口点击进入的登录
		let intervala,ok
		intervala=setInterval(()=>{
			if(ok){
				clearInterval(intervala)
				var 用户名 = document.querySelector('[name="username"]')
				用户名.value = numb
				用户名.dispatchEvent(new Event('input'))
				var 密码 = document.querySelector('[type="password"]')
				密码.value = mima
				密码.dispatchEvent(new Event('input'))
				let 登录 = document.querySelector('button[type="submit"]')||document.querySelector('button#submitBtn')
				setTimeout(()=>{登录.click()},500)
			}
			if(document.querySelector('[name="username"]')&&document.querySelector('[type="password"]')&&document.querySelector('button[type="submit"]')||document.querySelector('button#submitBtn')){
				ok=true
			}
		},100)
	}
	//登录2
	if(location.href.indexOf('https://jwxt.cumtb.edu.cn/student/login?refer=https://jwxt.cumtb.edu.cn')!=-1){//长时间无操作会导致教务系统自动退出，在个别子页面内刷新页面之后需要点统一身份认证登录
		let 统一身份认证登录 =document.querySelector("body > div > div > div:nth-child(2) > div > div > div.form-group.text-center > a")
		setTimeout(()=>{
			统一身份认证登录.click()
		},500)
		let url=location.search;
		let tr = url.split('=')[1];
		GM_setValue("上次打开",tr)
	}
}

function 教务系统主页(){
	if(location.href=='https://jwxt.cumtb.edu.cn/student/home'||identify=="学生"){
		let t = document.createElement('div1');
		t.style.cssText="width:300px;padding:20px;border:1px solid #ccc;border-radius:10px;z-index:1001;position:fixed;background:rgba(255,255,255,0.5);display:block;justify-content:center;flex-direction:column";
		let cssText="height:30px;border-color:#ccc;border-radius:5px;margin:10px;cursor:pointer;background:lightgreen;"
		$("body").append(t);for(let i=1;i<=members;i++){
			$(`<button id ="btn${i}"style=${cssText+"border-color:lightgreen;background:white;color:green"}>${按钮内容[i-1]}</button>`).appendTo($(t)).on('click',跳转(i));
			document.querySelector('button#btn'+i).onmouseover=function(){this.style.background ='lightgreen';this.style.color='black'};
			document.querySelector('button#btn'+i).onmouseout =function(){this.style.background = 'white' ; this.style.color = 'green'};
		}
		$(`<hr></hr>`).appendTo($(t))
		let fixedbtn= ['更改身份','更改账号','查看密码','更改密码'];let amount = fixedbtn.length;
		for(let i=1;i<=amount;i++){
			let tnnd = ['button#'+fixedbtn[i-1]]
			$(`<button id = ${fixedbtn[i-1]} style=${cssText+"border-color:lightpink;width:80px;background:white;color:red"}>${fixedbtn[i-1]}</button>`).appendTo($(t)).on('click',eval(fixedbtn[i-1]))
			document.querySelector(tnnd).onmouseover=function(){this.style.background ='lightpink';this.style.color='black'}
			document.querySelector(tnnd).onmouseout =function(){this.style.background = 'white' ; this.style.color ='red'}
		}
		$(`<hr><h4><p>若想修改绿色按钮，请修改代码里的按钮内容</p><p><strong>修改按钮内容时不要改格式!!!</strong></p><p>红色为固定按钮不会改变</p>`).appendTo($(t))
		let to=GM_getValue("top1");
		let lef=GM_getValue("left1");
		if(!to){GM_setValue("top1",50);to=50}if(!lef){GM_setValue("left1",10);lef=10}
		t.style.top=to+"px";t.style.left=lef+"px";
		$("div1").mousemove(function(e){
			$("div1").unbind("mousedown");$("div1").css("cursor","default");var left=$("div1").offset().left;var top=$("div1").offset().top;
			if(e.pageX-left&&e.pageY-top){
				$("div1").css("cursor","move");
				$("div1").mousedown(function(e){
					var ismove=true;
					var x= e.pageX - $("div1").offset().left;
					var y = e.pageY - $("div1").offset().top;
					$(document).mousemove(function(e) {
						if(ismove) {
							$("div1").css({"left":e.pageX-x, "top":e.pageY-y-document.documentElement.scrollTop});
							GM_setValue("top1",e.pageY-y-document.documentElement.scrollTop);GM_setValue("left1",e.pageX-x)
						}
					}).mouseup(function(){
						ismove = false;
					});
				});
			}
		});
	}
	if(last_page=='https://jwxt.cumtb.edu.cn/student/home'){GM_deleteValue("上次打开")}
	else if(last_page){window.location.href=last_page;GM_deleteValue("上次打开")}
}

function 课程表(){
	//总周数
	let weeks=document.querySelector('div[class="selectize-dropdown-content"]>div:nth-last-child(1)').innerText,b = weeks.indexOf('周'),totalweek = weeks.substring(1,b)
	//起始日期
	let startDate =document.querySelector("#startDate").innerHTML
	var 起始日期 = new Date();起始日期.setFullYear(startDate.split('-')[0]);起始日期.setDate(startDate.split('-')[2]);起始日期.setMonth(startDate.split('-')[1]-1);
	//当前日期
	var 当前日期 = new Date()
	let nowyear = 当前日期.getFullYear(),nowmonth = 当前日期.getMonth()+1,nowday = 当前日期.getDate();if(nowmonth<10){nowmonth='0'+nowmonth};if(nowday<10){nowday='0'+nowday}
	//终止日期
	var 终止日期 = new Date(起始日期-0+totalweek*7*86400000)
	let endyear = 终止日期.getFullYear(),endmonth = 终止日期.getMonth()+1,endday = 终止日期.getDate();if(endmonth<10){endmonth='0'+endmonth};if(endday<10){endday='0'+endday}
	//宽度调整
	let width = document.querySelectorAll("body > div.container > div:nth-child(2) > div")
	width[0].style.width="15%";width[1].style.width="15%";width[2].style.width="33.6%";width[3].style.width="35%";
	//添加button、span
	$(`<button type="button" class="btn btn-primary week alWeek">全部周次</button>`).prependTo(document.querySelector("body > div.container > div:nth-child(2) > div.col.col-sm-5.week-div-opea")).on('click',function(){document.querySelector("body > div.container > div:nth-child(2) > div:nth-child(2) > div > div.selectize-dropdown.single.form-control.selectize > div > div:nth-child(1)").click()})
	$(`<span class="form-control-next">&nbsp终止日期 </span><span id="endDate">${endyear+'-'+endmonth+'-'+endday}</span>`).appendTo(document.querySelector("body > div.container > div:nth-child(2) > div:nth-child(4)"))
	$(`<span class="form-control-next">&nbsp今日 </span><span id="todayDate">${nowyear+'-'+nowmonth+'-'+nowday}</span>`).appendTo(document.querySelector("body > div.container > div:nth-child(2) > div:nth-child(4)"))
	//课表
	let a = setInterval(()=>{
		if(document.querySelector('div[class="time-table-title"]>div[class="layout-title"]')){
			clearInterval(a)
			//周次监听
			document.querySelector("#weeks").onchange=function(){
				let sa=setInterval(()=>{
					if(document.querySelector('div[class="time-table-title"]>div[class="layout-title"]')){
						clearInterval(sa)
						//表头替换
						let 星期几 = document.querySelectorAll('div[class="weekday-title"][style]')
						let 周次 = document.querySelector('div[class="selectize-input items has-options full has-items"]>div[class="item"]').innerText
						if(周次!=="全部周次"){
							let 过去了几周=周次.split("第")[1].split("周")[0];
							for(let i=0;i<星期几.length;i++){
								星期几[i].innerText = new Date(起始日期-0+((过去了几周-1)*7+i)*86400000).toLocaleDateString()
								//特例替换
								if(星期几[i].innerText==当前日期.toLocaleDateString()){星期几[i].innerText="今天"+当前日期.toLocaleDateString();星期几[i].style.background="";document.querySelectorAll('div[class="columns weekday"]')[i].querySelectorAll('div.card-view').forEach(i=>{i.style.background="pink"})}
								else if(星期几[i].innerText==new Date(当前日期-86400000).toLocaleDateString()){星期几[i].innerText="昨天"}
								else if(星期几[i].innerText==new Date(当前日期-0+86400000).toLocaleDateString()){星期几[i].innerText="明天"}
								else if(星期几[i].innerText==new Date(当前日期-0+2*86400000).toLocaleDateString()){星期几[i].innerText="后天"}
							}
						}
					}
				},10)
			}
		}
	},100)
	let c = setInterval(()=>{//本周课表
		if(document.querySelector('div[class="time-table-title"]>div[class="layout-title"]')){
			clearInterval(c)
			let 今天星期 = new Date().getDay()
			document.querySelector('.currWeek').click();
			//周末是否有课
			if(今天星期==0||今天星期==6){
				setTimeout(()=>{
					let zhoumo=document.querySelectorAll('div[class="columns weekday"]')
					if(zhoumo[5].getElementsByClassName("card-view common-card un-draggable").length||zhoumo[6].getElementsByClassName("card-view common-card un-draggable").length){}
					else document.querySelector("button.btn.btn-primary.week.nextWeek").click();
				},100)
			}
		}
	},100)
	}

function 评教() {
	let table = document.createElement('div');
	table.style.cssText="width:200px;padding:20px;border:1px solid #ccc;border-radius:10px;z-index:1001;position:fixed;top:43px;right:50px;background:#fff;display:block;justify-content:center;flex-direction:column";
	let body = document.querySelector('body');body.appendChild(table);
	let btn1 = document.createElement('button'),btn2 = document.createElement('button');
	btn1.innerHTML="好评";btn2.innerHTML="差评"
	btn1.style.cssText="height:30px;border-color:#ccc;border-radius:5px;position:inline;margin:10px;cursor:pointer;background:lightgreen;";
	btn2.style.cssText="height:30px;border-color:#ccc;border-radius:5px;position:inline;margin:10px;cursor:pointer;background:lightpink;";
	table.appendChild(btn1);table.appendChild(btn2);
	btn1.addEventListener('click',评教_1(1));btn2.addEventListener('click',评教_1(2))
}

function 成绩单(){
	document.querySelectorAll('div.table-wrapper>div>div').forEach(i=>{
		i.onclick=()=>{
			i.parentNode.querySelector('table').style.display = i.parentNode.querySelector('table').style.display=='none'?'':'none'
		}
	})
	let 本学期 = document.querySelector("body > div.container > div.table-wrapper > div:nth-child(1) > div > h3").innerText;
	let 各课程 = document.querySelector("body > div.container > div.table-wrapper > div:nth-child(1) > table")
	let 课程数 = $('body > div.container > div.table-wrapper > div:nth-child(1) > table > tbody > tr').length;
	let 及格数 = 0,未评教=0
	if ($('div').length){
		$('div.table-wrapper').each(function (index, element) {
			for(let i=1;i<=课程数;i++){
				let 成绩格 = "body > div.container > div.table-wrapper > div:nth-child(1) > table > tbody > tr:nth-child("+i+") > td:nth-child(4)"
				let 成绩 = document.querySelector(成绩格).innerText;
				if(成绩=="良好"||成绩=="合格"||成绩=="优秀"||成绩>=60||成绩=="中等")及格数++;
				else if(成绩=="请完成评教后查看")未评教++
			}
		});
	};
	if(上次不及格==null||上次不及格<(课程数-及格数-未评教)){GM_setValue("上次不及格",(课程数-及格数-未评教))}
	if(上次课程数==null||课程数<上次不及格){GM_setValue("上次课程数",课程数)}
	else if(上次课程数==课程数){}
	else if(课程数>上次课程数){
		let t="出成绩了！！！",p=null,q='新出了'+(课程数-上次课程数)+'门课的成绩，点击查看';
		if((课程数-及格数-未评教)>上次不及格){p = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAMAAAANf8AYAAAAqFBMVEUAAAD/YGD3VVH5VFD4VFD4U0/5VFH4VFD4VVD3VE/5VlD4U1D3VE/4VE/7VlL3U1D3VFH4VFD/gID/VVX3U1D3VFD3VFD4VFD3VFD3U0/////+7Oz4a2f3Z2P4eHX3WVX94+L3YV76mZf++vr+7e34cW74dnP3V1P8zcv93d36oqD939/+/f3+9/f4bGj7sK78xML6npz8vr37rKn3VFD6paP3ZmP3WFRHwQxvAAAAGXRSTlMACEJ/8/hVs2noU9qnzjvpYfkEHubGg/zFlZIbtgAAAYJJREFUeF6d1teSgzAMBVCbTmhLSZFTey/b9///bDMZYmIbJcT3/YyGkbBE1FDDDKPC6lpFFJoGJU9DHdeG+9iu85hlng9qfC/DSSuA+gQtRORtwNPO60icwKMksUreUnic9E0mHXiejlQFmkSoFKeNTBpXJE+gWZKcmzY0TY+3EpqnbG4WvGCC7Go8eCXedZJ9EQxX6zswHY1F49OLcUTyc2CTASezOVssReRcjCtWOTDG+jf0wS7ZiMYlhNqCWTF2RRVhW9HYlBggZD0pESdsB2IMYoKYQb9EN/L5LRmThICgL4RASCJAEEYgIgUgCCNQEAsQhBGwSBdqUn7L8QQ16Sp1eF94n9Q6BUJwVJAII0cMRSREyOepj6BQmYPZrS+8ub+SMeV5m85LUvXpXTKGPNcjTjjay3Mt/z/jRUkqdBaNq/6ny812V3V/+L4//6n/KfXhlfhU493Red803lGN91pnL2jsH409p7FPNfa2/n3Q/A7p5Rr3jvZdpX+/6dyJ/y1EyzXVRf1XAAAAAElFTkSuQmCC'}
		else {p = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAMAAAANf8AYAAAAtFBMVEUAAABA30A+wzQ+wzQ+wjQ/wzU/wjQ/wjU/wzU/wjQ/wzVA/0A/wjVExDw/wzVBwjg+wzVCxTY/wjU/wzZBxTQ/wjU+wzU/wjU+wjU+wjT///9Awjb+/v696rm86bhWyU5by1Ps+evo9+eL2oV51HKC13x61XPX8tWb35aq5KVpz2FFxDus5Ki66bdTyEri9eDC67/d9Nva89hYyVD3/Pb4/PeO24hu0Wb5/fmu5apu0WdMxkIehkT0AAAAGXRSTlMACH/55qf4zrPz6ATaHmE76UJpVVPGg/zFwrG5tQAAAWBJREFUeNqd1ueSgkAQRtEeMggryfCNqJtzzuH932tdi1pHYQbs8//WlFXS3dQkMsv1nXASOr5rZYI6iSLwoPKCwpwN8ghNUT4grTJGu7jUFMkIeqOEWgxTmKRDajiwYWYf0I4xuo13XkEfWy8NbfRhK78pSdFPmvw3I/Q1pVqJ/sr6DxOjv3iwbnLsI6cVEWEfkSCiAh1OL6+hKIgogNHsTsrqDBsBkfDMyUKuPGPDE5T1SOQFFBlZxmS+TqpzKCxyu1+pTqByyYfi5uppcd+RwCcHilsp5fHSnMChEIoHuYlm8/YEIU2geJR1ZEgw2X5neVRHhgQhOVAd1tGLPoFDPtqiV30Cn1y0RYYELlloROYEFmVoRsYEGQmvGb39Je9o54nW7+fjU1Zf0Ag03+ns+wc6BWceMOYOZ74x5ihjXnP2AmP/MPYcZ5/y9zb/Pui+Q6YJ495h31X8+41zJ/4Cq+rI0+SEAkcAAAAASUVORK5CYII='}
		GM_notification({
			title:q,
			text:t,
			image:p,
			timeout:10000,
			onclick:()=>{window.focus();GM_setValue("上次课程数",课程数);GM_setValue("上次不及格",(课程数-及格数-未评教))},
		})
	}
	let t = document.createElement('div1');
	t.style.cssText="width:251px;padding:20px;border:1px solid #ccc;border-radius:10px;z-index:1001;position:fixed;background:rgba(173,216,230,0.5);display:block;";
	let cssText="height:30px;border-color:#f2d6a5;border-radius:5px;margin:2.5px;cursor:pointer;background:#282828;color:#f2d6a5"
	$("body").append(t)
	let btns= ['设置刷新','显示间隔','停止刷新'];
	let amount = btns.length;
	for(let i=1;i<=amount;i++){
		let tnnd = ['button#'+btns[i-1]]
		$(`<button id = ${btns[i-1]} style=${cssText}>${btns[i-1]}</button>`).appendTo($(t)).on('click',eval(btns[i-1]))
		document.querySelector(tnnd).onmouseover=function(){this.style.background='#f2d6a5';this.style.color='#282828';this.style.borderColor='#282828'}
		document.querySelector(tnnd).onmouseout =function(){this.style.background='#282828';this.style.color='#f2d6a5';this.style.borderColor='#f2d6a5'}
	}
	if(!未评教)$(`<hr><h3><em><strong><p> 统计：${本学期}</strong></em></h3><dd><h4>&nbsp&nbsp课程数: ${课程数}门<dd>&nbsp&nbsp&nbsp&nbsp及格: ${及格数}门<dd>&nbsp&nbsp&nbsp&nbsp没过: ${课程数-及格数}门</dd></p>`).appendTo($(t))
	else $(`<hr><h3><em><strong><p> 统计：${本学期}</strong></em></h3><dd><h4>&nbsp&nbsp课程数: ${课程数}门<dd>&nbsp&nbsp&nbsp&nbsp及格: ${及格数}门<dd>&nbsp&nbsp&nbsp&nbsp没过: ${课程数-及格数-未评教}门<dd>&nbsp&nbsp&nbsp&nbsp未评教:${未评教}门</dd></p>`).appendTo($(t))
	if(setTime!=null&&setTime!=0){执行刷新()}
	let to=GM_getValue("top2");
	let lef=GM_getValue("left2");
	if(!to){GM_setValue("top2",43);to=43}
	if(!lef){GM_setValue("left2",14);lef=14}
	t.style.top=to+"px";t.style.left=lef+"px";
	$("div1").mousemove(function(e){
		$("div1").unbind("mousedown");$("div1").css("cursor","default");var left=$("div1").offset().left;var top=$("div1").offset().top;
		if(e.pageX-left&&e.pageY-top){
			$("div1").css("cursor","move");
			$("div1").mousedown(function(e){
				var ismove=true;
				var x = e.pageX - $("div1").offset().left;
				var y = e.pageY - $("div1").offset().top;
				$(document).mousemove(function(e) {
					if(ismove){
						$("div1").css({"left":e.pageX-x,"top":e.pageY-y-document.documentElement.scrollTop});
						GM_setValue("top2",e.pageY-y-document.documentElement.scrollTop);GM_setValue("left2",e.pageX-x)
					}
				}).mouseup(function(){
					ismove = false;
				});
			});
		}
	});
}

function 选课(){
	setTimeout(()=>{
		if(document.querySelector("body > div > div > div > span").innerText.indexOf("～ 当前还未开放选课 ～")!==-1){
			location.reload()
		}
	},2000)
}

function backtohomepage(){
	if(!document.querySelector('#backtohomepage')){
		let backtohomepage=document.createElement('button')
		backtohomepage.innerText='返回主页'
		backtohomepage.type="button"
		backtohomepage.className="btn btn-primary"
		backtohomepage.id='backtohomepage'
		document.querySelector("h2").appendChild(backtohomepage)
		backtohomepage.onclick=()=>{location.href='https://jwxt.cumtb.edu.cn/student/home'}
	}
}

function choose(){
	if(location.href == 'https://jwxt.cumtb.edu.cn/student/home')教务系统主页()
	if(location.href == 'https://jwxt.cumtb.edu.cn/'&&identify!="")教务系统入口()
	if(location.href == 'https://jwxt.cumtb.edu.cn/student/for-std/course-table'){课程表();backtohomepage()}
	if(location.href.indexOf('/evaluation-student-frontend/')!==-1)评教()
	if(location.href.indexOf('login?refer')!==-1&&numb!=""&&mima!="")登录()
	if(location.href.indexOf('login?service')!==-1)登录()
	if(location.href.indexOf('student/for-std/grade/sheet')!==-1){if($('div').length){let a = setInterval(()=>{成绩单();backtohomepage();setTimeout(()=>{clearInterval(a)},10);},800)}}
	if(location.href=="https://jwxt.cumtb.edu.cn/student/for-std/course-select/single-student/turns"){选课()}
}choose()

//主页
function 跳转(x){return()=>{执行(x)}}
function 执行(i){window.open(URLs[i])}

//入口、主页
function 更改身份(){
	identify=prompt("输入新身份,学生? 教师? 管理? 外聘? 家长?\n将决定之后登录自动点击的入口")
	if(identify!=null && identify!=""){GM_setValue("身份",identify)}
}

//登录、主页
function 更改账号(){
	numb=prompt("输入新账号\n将决定之后登录自动填写的账号")
	if(numb!=null && numb!=""){GM_setValue("账号",numb)}
}
function 查看密码(){
	alert("当前密码为:"+mima)
}
function 更改密码(){
	mima=prompt("输入新密码\n将决定之后登录自动填写的密码,不代表修改教务系统登陆密码")
	if(mima!=null && mima!=""){GM_setValue("密码",mima)}
}

//评教
function 评教_1(x){
	return ()=>{
		if(x==1){评教_2(x)}
		else {评教_2(x)}
	};
}
function 评教_2(x){
	setTimeout(()=>{
		$('tr.el-table__row').each(function (index, element) {
			const st1="不在开放时间"
			let a=('el-tag el-tag--info el-tag--small el-tag--light').ltrim
			if(a != st1){let b=document.querySelector('.el-tooltip.el-link.el-link--primary.is-underline').click()}
		})
	},2000)//两秒后点击进入评教页面
	setTimeout(()=>{
		if ($('.item')) {
			$('div.item').each(function (index, element) {
				let xuanxiang=$(element).find('.el-radio-group .el-radio__input .el-radio__original');
				let str,str1,t;
				if (x==1){str = 'A'; str1 = '是'; t='无' }
				else {str = 'D'; str1 = '否'; t='讲得太晦涩听不懂！！！'}
				xuanxiang.each(function (ind, ele) {
					let da = $(ele).attr('value');
					if(da == str||da==str1){
						$(ele).click();
						return false;
					}
				});
				var d=document.querySelector('textarea');d.focus();d.value=t;
				var ev1 = new Event('change');var ev2 = new Event('input');d.dispatchEvent(ev1);d.dispatchEvent(ev2);
			});
		};
	}, 4000);
	setTimeout(() => {
		let b=document.querySelector('button.el-button.el-button--primary.el-button--small');
		if(b){b.click()};
	}, 6000);
}
//成绩单
function 设置刷新(){
	setTime = prompt("输入刷新间隔: X(单位分钟，0为不刷新)\n如果刷新后有新成绩将会进行通知(需要在系统设置里允许浏览器通知)\n不要关闭页面! 关闭后无法刷新")
	if(setTime!=null && setTime!=""){GM_setValue("刷新时间",setTime);location.reload();}
	if(setTime==0){clearTimeout(刷新);}
}
function 执行刷新(){
	刷新 = setTimeout(()=>{
		location.reload();
	},setTime*60*1000);
}
function 显示间隔(){
	if(setTime==0||setTime==null){alert('不会进行刷新')}
	if(0 < setTime && setTime < 1){alert('刷新间隔为'+(setTime*60).toFixed()+'秒')}
	if(1 <=setTime && setTime < 60){alert('刷新间隔为'+(parseInt(setTime))+'分'+((setTime-parseInt(setTime))*60).toFixed()+'秒')}
	if(60<=setTime){alert('刷新间隔为'+Math.floor(setTime/60)+'小时'+ (Math.floor(setTime)-Math.floor(setTime/60)*60)+'分'+((setTime-Math.floor(setTime))*60).toFixed()+'秒')}
}
function 停止刷新(){clearTimeout(刷新);GM_setValue("刷新时间",0)}