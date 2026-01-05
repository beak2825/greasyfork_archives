// ==UserScript==
// @name        Encounter+
// @namespace   Encounterplus
// @include     http://hentaiverse.org/*
// @include     http://e-hentai.org/
// @version     0.05
// @grant       GM_openInTab
// @grant       unsafeWindow
// @grant      	GM_getValue
// @grant     	GM_setValue
// @description 遭遇战用脚本
// @downloadURL https://update.greasyfork.org/scripts/15583/Encounter%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/15583/Encounter%2B.meta.js
// ==/UserScript==
/***********************************
var encontertime=1850		//遭遇战的时间间隔，默认30分50秒（30*60+50=1850）
var findnothing=300			//未发现遭遇战的查询时间间隔，默认5分钟（60*5=300）
var time_zone=8				//本地时区，默认东8区,用于”新的一天“

//如果有任何问题，请去贴吧找一下有没有新版本，没有的话，再反馈，地址：http://tieba.baidu.com/f?ie=utf-8&kw=hv%E7%BD%91%E9%A1%B5%E6%B8%B8%E6%88%8F


var flagp=GM_getValue("enconter")
function quicklink(title,color,fontclolr,id){
    var mydiv = document.createElement("a");
    mydiv.innerHTML=title
	
    if(!color)color="#EDEBDF";
    if(!fontclolr)fontclolr="#5C0D11";
    mydiv.setAttribute("id","enconterpan")
	if(flagp==1||flagp==3){
		mydiv.onclick=function(){check()} 
	}
	else if(flagp==2){
		mydiv.onclick=function(){GM_setValue("enconter",1)} 
		mydiv.href="http://e-hentai.org/"
	}
	else{
		mydiv.href=GM_getValue("enconter")
		mydiv.onclick=function(){GM_setValue("enconter",1)} 
	}
	mydiv.style.cssText = "font-size:15px;color:"+fontclolr+" ; text-align:left;background:"+color+";position:absolute;left:5px;top:600px";
    document.body.appendChild(mydiv);
}

function check(){ 
	myDate = new Date();
	timenow=myDate.getHours()*3600+myDate.getMinutes()*60+myDate.getSeconds()
	timeold=GM_getValue("zaoyutime")
	if(!timeold)timeold=timenow
    var timeleft=timeold-timenow
    if(timeleft<0)timeleft=0
    if(timeleft>encontertime+1)timeleft=0
    var min=Math.floor(timeleft/60)
    var sec=timeleft%60
	if(flagp==1){
		sec+="<br>无遭遇"
	}
	else if(flagp==2){
		sec+="<br>倒计时已到"
	}
	else if(flagp==3){
		sec+="<br>未找到遭遇"
	}
	else{
		sec+="<br>有遭遇"
		color1="red"
	}
	
  if((temp=document.getElementById("enconterpan"))){
		temp.innerHTML="遭遇："+min+":"+sec
	} else quicklink("遭遇："+min+":"+sec,"#EDEBDF",color1) 
    if(timeleft==0){
		GM_setValue("enconter",2)
		flagp=2
		GM_setValue("zaoyutime",timenow+30)
		window.open('http://e-hentai.org/', '', 'width=1,height=1');
    }
}
function reflash(){
	check()
	setTimeout(function(){reflash()},1000)
}
try{
	var myDate = new Date();
	var day=myDate.getDate()
	color1="#5C0D11"
	timenow=myDate.getHours()*3600+myDate.getMinutes()*60+myDate.getSeconds()
	
	//GM_setValue("zaoyutime",timenow+5)
	//alert(document.location.href.match(/hentai.org/)+GM_getValue("enconter"))
	if(document.location.href.match(/hentai.org/)&&(flagp==2)){
		if(timenow<time_zone*3600){//alert(time_zone*3600-timenow)
			if(time_zone*3600-timenow<1800){
				encontertime=time_zone*3600-timenow
				findnothing=encontertime
			}
		}
	if(!(temp=document.getElementById("eventpane"))){
		GM_setValue("zaoyutime",timenow+findnothing)
		GM_setValue("enconter",3)
		flagp=3
	}
	else {
		temp=temp.innerHTML.match(/window.open\(\'([^']+)/)
		temp=temp[1].replace(/amp;/g,"")
		GM_setValue("zaoyutime",timenow+encontertime)
		GM_setValue("enconter",temp)
		flagp=temp
	}
	window.close()
	return
}
check()
if(document.getElementById("parent_Character")){
	setTimeout(function(){reflash()},1000)
}
}
catch(e){}
*************************************/
var encontertime = 1850 //遭遇战的时间间隔，默认30分50秒（30*60+50=1850）
var findnothing = 300 //未发现遭遇战的查询时间间隔，默认5分钟（60*5=300）
var time_zone = 8 //本地时区，默认东8区,用于”新的一天“
//如果有任何问题，请去贴吧找一下有没有新版本，没有的话，再反馈，地址：http://tieba.baidu.com/f?ie=utf-8&kw=hv%E7%BD%91%E9%A1%B5%E6%B8%B8%E6%88%8F
var flagp = GM_getValue('enconter')
function quicklink(title, color, fontclolr, id) {
  var mydiv = document.createElement('a');
  mydiv.innerHTML = title
  // original color schemes are somehow distracting...
  if (!color) color = '#EDEBDF';
  if (!fontclolr) fontclolr = '#5C0D11';
  mydiv.setAttribute('id', 'enconterpan')
  if (flagp == 1 || flagp == 3) {
    mydiv.onclick = function () {
      check()
    }
  } 
  else if (flagp == 2) {
    mydiv.onclick = function () {
      GM_setValue('enconter', 1)
    }
    mydiv.href = 'http://e-hentai.org/'
  } 
  else {
    mydiv.href = GM_getValue('enconter')
    mydiv.onclick = function () {
      GM_setValue('enconter', 1)
    }
  }
  mydiv.style.cssText = 'font-size:15px;color:' + fontclolr + ' ; text-align:left;background:' + color + ';position:absolute;left:5px;top:600px';
  document.body.appendChild(mydiv);
}
function check() {
  myDate = new Date();
  // using time stamp
  timenow = Math.round(myDate.getTime() / 1000);
  timeold = GM_getValue('zaoyutime')
  if (!timeold) timeold = timenow
  var timeleft = timeold - timenow
  if (timeleft < 0) timeleft = 0
  if (timeleft > encontertime + 1) timeleft = 0
  var min = Math.floor(timeleft / 60)
  var sec = timeleft % 60
  if (flagp == 1) {
    sec += '<br>无遭遇'
  } 
  else if (flagp == 2) {
    sec += '<br>倒计时已到'
  } 
  else if (flagp == 3) {
    sec += '<br>未找到遭遇'
  } 
  else {
    sec += '<br>有遭遇'
    // modify color schemes
    color1 = 'red'
  }
  if ((temp = document.getElementById('enconterpan'))) {
    temp.innerHTML = '遭遇：' + min + ':' + sec
    // modify color schemes
  } else quicklink('遭遇：' + min + ':' + sec, '#EDEBDF', color1)
  if (timeleft == 0) {
    GM_setValue('enconter', 2)
    flagp = 2
    GM_setValue('zaoyutime', timenow + 30)
    window.open('http://e-hentai.org/', '', 'width=1,height=1');
  }
}
function reflash() {
  check()
  setTimeout(function () {
    reflash()
  }, 1000)
}
try {
  var myDate = new Date();
  var day = myDate.getDate()
  // modify color schemes
  color1 = '#5C0D11'
  // using time stamp
  timenow = Math.round(myDate.getTime() / 1000);
  // mod 86400 for dawn event
  timeToday = timenow % 86400
  //GM_setValue("zaoyutime",timenow+5)
  //alert(document.location.href.match(/hentai.org/)+GM_getValue("enconter"))
  // add searching for eventpane for manual triggering
  if(document.location.href.match(/hentai.org/)&&((flagp==2) || document.getElementById("eventpane"))){
    // compare time to dawn
    if (timeToday < 86400) { //alert(86400-timeToday)
      if (86400 - timeToday < 1800) {
        encontertime = 86400 - timeToday
        findnothing = encontertime
      }
    }
    if (!(temp = document.getElementById('eventpane'))) {
      GM_setValue('zaoyutime', timenow + findnothing)
      GM_setValue('enconter', 3)
      flagp = 3
    } 
    else {
      // add support for dawn event
      // if true then encounter
      if (temp = temp.innerHTML.match(/window.open\(\'([^']+)/)) {
        temp = temp[1].replace(/amp;/g, '')
        GM_setValue('enconter', temp)
        flagp = temp
        // else then dawn
      } else {
        flagp = 1;
        GM_setValue('enconter', 1);
      }
      GM_setValue('zaoyutime', timenow + encontertime)
    }
    window.close()
    return
  }
  check()
  if (document.getElementById('parent_Character')) {
    setTimeout(function () {
      reflash()
    }, 1000)
  }
} 
catch (e) {
}
