// ==UserScript==
// @name        Encounter+
// @namespace   Encounterplus
// @include     http://hentaiverse.org/*
// @include     http://e-hentai.org/
// @version     0.06
// @grant       GM_openInTab
// @grant       unsafeWindow
// @grant    	GM_getValue
// @grant    	GM_setValue
// @description 遭遇战用脚本
// @downloadURL https://update.greasyfork.org/scripts/15573/Encounter%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/15573/Encounter%2B.meta.js
// ==/UserScript==

var encontertime=1850		//遭遇战的时间间隔，默认30分50秒（30*60+50=1850）,你也可以设置更短一些
var findnothing=300			//未发现遭遇战的查询时间间隔，默认5分钟（60*5=300）
var time_zone=8				//本地时区，默认东8区,用于”新的一天“

//如果有任何问题，请去贴吧找一下有没有新版本，没有的话，再反馈，地址：http://tieba.baidu.com/f?ie=utf-8&kw=hv%E7%BD%91%E9%A1%B5%E6%B8%B8%E6%88%8F

var flagp=GM_getValue("enconter")
function quicklink(title,color,fontclolr,id){
    var mydiv = document.createElement("a");
    mydiv.innerHTML=title
    if(!color)color="black";
    if(!fontclolr)fontclolr="white";
    mydiv.setAttribute("id","enconterpan")
	//mydiv.href=GM_getValue("enconter")
	if(flagp==1||flagp==3){
		mydiv.onclick=function(){check()} 
	}
	else if(flagp==2){
		mydiv.onclick=function(){window.open("http://e-hentai.org/");} 
	}
	else{
		mydiv.onclick=function(){GM_setValue("enconter",1)} 
	}
	mydiv.style.cssText = "font-size:15px;color:"+fontclolr+" ; text-align:left;background:"+color+";position:absolute;left:5px;top:600px";
    document.body.appendChild(mydiv);
}

function check(){ 
	myDate = new Date();
	timenow=myDate.getHours()*3600+myDate.getMinutes()*60+myDate.getSeconds()
	GM_setValue("timecheck",timenow) 		//记录当前时间,该数据作为游戏中是否打开首页的判断
	if(time_zone*3600==timenow)document.location.href="http://e-hentai.org/" //简单暴力的“新的一天”
	flagp=GM_getValue("enconter")
    var timeleft=timeold-timenow
    if(timeleft<0)timeleft=0
    if(timeleft>encontertime+1)timeleft=0
    var min=Math.floor(timeleft/60)
    var sec=timeleft%60
	var color1="black"
	if(flagp==1){
		sec+="<br>无遭遇"
	}
	else if(flagp==2){
		sec+="<br>倒计时已到"
		document.location.href="http://e-hentai.org/"
		return
	}
	else if(flagp==3){
		sec+="<br>未找到遭遇"
	}
	else{
		sec+="<br>有遭遇"
		color1="red"
	}
	var pantext="遭遇："+min+":"+sec
	GM_setValue("pantextGM",pantext)
    if((temp=document.getElementById("enconterpan"))){
		temp.innerHTML=pantext
	}
	else quicklink(pantext,color1) 
    if(timeleft==0){
		GM_setValue("enconter",2)
		flagp=2
		GM_setValue("zaoyutime",timenow+30)
		document.location.href="http://e-hentai.org/"
		return
    }
	setTimeout(function(){check()},1000)
}


function pagecheak(){
	var myDate = new Date();
	var day=myDate.getDate()
	var pantext = GM_getValue("pantextGM")
	timenow=myDate.getHours()*3600+myDate.getMinutes()*60+myDate.getSeconds()
	etime=GM_getValue("timecheck") 					//读取首页的时间记录
	if(!etime){		//初始化
		flagp=2
		document.getElementById("enconterpan").innerHTML="未打开页面,点我打开"
		document.getElementById("enconterpan").onclick=function(){window.open("http://e-hentai.org/");} 
		return
	}
	etime=Math.abs(etime-timenow)
	//alert(etime+"??"+timenow)
	if(etime>10){	//与首页时差超过10s
		flagp=2
		document.getElementById("enconterpan").innerHTML="未打开页面,点我打开"
		document.getElementById("enconterpan").onclick=function(){window.open("http://e-hentai.org/");} 
		
		return
	}
	//正常情况
	
    if((temp=document.getElementById("enconterpan"))){
		encontermsg=GM_getValue("enconter")
		temp.innerHTML=pantext
		//alert(encontermsg)
		try{
		if(encontermsg.match(/battle/))temp.href=encontermsg
		if(document.getElementById("parent_Character")){
			temp.onclick=function(){
				GM_setValue("enconter",1);
				document.location.href=encontermsg
			} 
		}
		return
		}
		catch(e){}
		temp.onclick=function(){GM_setValue("enconter",1)} 
	}

	if(document.getElementById("parent_Character"))
		setTimeout(function(){pagecheak()},1000)
}


var myDate = new Date();
var day=myDate.getDate()
color1="black"
timenow=myDate.getHours()*3600+myDate.getMinutes()*60+myDate.getSeconds()
if(!(reflashT=GM_getValue("reflashtime")))GM_setValue("reflashtime",timenow)//初始化兼读值
quicklink("")
if(document.location.href.match(/hentai.org/)){		//在首页时的处理方法
	if(!(temp=document.getElementById("eventpane"))){	//没有找到event信息，通常来说不会出现这种问题，只有在自己主动打开页面时发生，所以改为间隔5分钟
		if(flagp==2){					//排除自己打开页面查看的可能性
		GM_setValue("reflashtime",timenow+findnothing) //延时5分钟
		timeold=timenow+findnothing
		GM_setValue("enconter",3)
		flagp=3
		check()
		}
		else{
			timeold=GM_getValue("reflashtime")
			check()
		}
	}
	else {												//找到event
		try{
		temp=temp.innerHTML.match(/window.open\(\'([^']+)/)
		temp=temp[1].replace(/amp;/g,"")
		}
		catch(e){										//新的一天
			temp=1
		}
		GM_setValue("reflashtime",timenow+encontertime)	//延时半个小时
		timeold=timenow+encontertime
		GM_setValue("enconter",temp)
		flagp=temp
		check()
	}
}
else if(document.location.href.match(/verse/)){		//在游戏中的处理方法
	pagecheak()
}
return

if(document.getElementById("parent_Character")||document.location.href.match(/hentai.org/)){
	setTimeout(function(){reflash()},1000)
}

