// ==UserScript==
// @description de-sponsors 1
// @name        de-sponsors Click4Credits Automaizer
// @version     1.4
// @date        2012-10-20
// @author      mleha (mleha@xakep.ru)
// @include     http://*/login.php?page=klick4credits*
// @include     http://*/klick4creditsgoto.php?k4csid=*
// @include     http://*/login.php?page=klick4win*
// @include     http://*/surfbar_unten.php?surfsid=*
// @include     http://surfmore.eu/login.php?page=klick4win&navaction=banner
// @include     http://surfmore.eu/login.php?page=klick4win

// @namespace https://greasyfork.org/users/160340
// @downloadURL https://update.greasyfork.org/scripts/35538/de-sponsors%20Click4Credits%20Automaizer.user.js
// @updateURL https://update.greasyfork.org/scripts/35538/de-sponsors%20Click4Credits%20Automaizer.meta.js
// ==/UserScript==
//чтение писем спонсоров автоматически http://lks.narod.ru/wmmailsoft.html

//---можно редактировать
var maxMailsAtTime = 8;
var maxBannersAtTime = 15;
var firstMail = 3;
var firstBanner = 1;
var refreshMailPageAt=140;
var refreshBannerPageAt=120;
var firstTimeout = 7000;
//если нужно автоматическое обновление фрейма с баннером на странице серфинга
//то значение переменной autoRefresh должно быть true
//если обновление не нужно, то значение переменной autoRefresh должно быть false
var autoRefresh = false;

//--\можно редактировать

//Массив с параметрами расположения текста. Можно не добавлять запись для нового сайта, но тогда 
//текст с текстом появится в самом начале страницы
var containers={};
containers["www.proyos.de"]="getDivCont('DIV','cont',9)";
containers["surfmore.eu"]="getDivCont('TD','content',2)";
containers["neu-besucher.de"]="getDivCont('TD','content',2)";

//масив с временем паузы перед открытием баннеров
var timeStarts={};
timeStarts["surfmore.eu"]=10;
timeStarts["www.crunchingbaseteam.com"]=10;
timeStarts["www.proyos.de"]=50;

//Фразы которые содержатся в минус ссылках
var phrases = new Array();
phrases.push("Nicht Klicken");
phrases.push("Dont klick");
phrases.push("-10000");
phrases.push("Minus");

//--радактировать все что ниже без согласования с автором запрещено

Array.prototype.contains2 = function(obj) {
  var i = this.length;
  while (i--) {
    if (obj.indexOf(this[i])>0) {
      return true;
    }
  }
  return false;
}


var vartimer=0;
var BannerArr = new Array();
var seconds=0;
var closeA=0;
var closeAttached=0;
var SITE = getSite();
var time1=0;
var time2=0;

var link1=0;
var link2=0;
function getSite(){
	var rg = /(www.){0,1}[0-9A-z-]+\.[0-9A-z]+/;
	var loc = new String(window.location);
	return new String(loc.match(rg)[0]);
}

function getTimeStart(){
	if (timeStarts[SITE]!=undefined){
		return timeStarts[SITE];
	}else{
		return 10;
	}
}

function getContText(){
	if (containers[SITE]!=undefined){
		return containers[SITE];
	}else{
		return "getBox()";
	}
}
function tryGetLink(){
	var s = new String(window.location);
	
	if (s.indexOf(SITE+'/login.php?page=klick4credits&navaction=textlinks')>0) {
		var tx=getContText();
		var cont = eval(tx);
		var MyLinks="<div style=\"text-align:center\">";
		MyLinks += "Будут открыты ссылки, ничиная с " + firstBanner + ", Всего " + maxBannersAtTime + " ссылок <br>";
		MyLinks += "Открытие ссылок через: <div style=\"display:inline\" id=\"timestart2\">"+getTimeStart()+"</div><br>";
		MyLinks += "<div id=\"myTimer\">прошло секунд: 0</div>";
		MyLinks += "<input type=\"button\" onclick=\"javascript:location.reload(true)\" value=\"Обновить\"></div>";
		cont.innerHTML=MyLinks+cont.innerHTML;
		time2=getTimeStart();
		setTimeout(LinkStarter3,1000);
		setTimeout(incrementTimer3,100);
		return;
	}	
	
	
	if (s.indexOf(SITE+'/login.php?page=klick4credits')>0) {
		var tx=getContText();
		var cont = eval(tx);
		var MyLinks="<div style=\"text-align:center\">";
		MyLinks += "Будут открыты баннеры, ничиная с " + firstBanner + ", Всего " + maxBannersAtTime + " ссылок <br>";
		MyLinks += "Открытие баннеров через: <div style=\"display:inline\" id=\"timestart2\">"+getTimeStart()+"</div><br>";
		MyLinks += "<div id=\"myTimer\">прошло секунд: 0</div>";
		MyLinks += "<input type=\"button\" onclick=\"javascript:location.reload(true)\" value=\"Обновить\"></div>";
		cont.innerHTML=MyLinks+cont.innerHTML;
		time2=getTimeStart();
		setTimeout(LinkStarter2,1000);
		setTimeout(incrementTimer2,100);
		return;
	}
	
	if (s.indexOf(SITE+'/klick4creditsgoto.php?k4csid=')>0){
		if (document.body.innerHTML.length==0){
			closeWin();
			return;
		}

		if (document.body.innerHTML.indexOf('Credits gutgeschrieben')>0){
			closeWin();
		}else{
			seconds+=15;
			if (seconds>=150){
				closeWin();
				return;
			}
			setTimeout(tryGetLink,15000);
			return;
		}
	}
	if (s.indexOf(SITE+'/surfbar_unten.php?surfsid=')>0){
		setTimeout(opensurfbanner,100);
	}
}

function opensurfbanner(){
	var inText = new String(document.body.innerHTML);
	var regE = /<a href=\"klick4creditsgoto.php[^>]+><img[^>]+><\/a>/gi;
	find = regE.exec(inText);
	var sourceT = new String(find);
	if (sourceT != null){
		var rg =/src="[^"]+"/;
		var imgLink=new String(rg.exec(sourceT));
		var rg2 =/klick4credits[^"]+/;
		var banLink=replaceamp(new String(rg2.exec(sourceT)));
		var ind = imgLink.indexOf(SITE);
		if (ind==-1){
			if (imgLink.indexOf("http://")==-1){
				ind=0;
			}
		}
		if (ind > -1){
		}else{
			window.open("http://"+SITE+"/"+banLink,"_blank");
			if (autoRefresh) {
				setTimeout("location.reload()",2000);
			}
			return;
		}
	}
	//-------------start click text
	var regE2 = /<a href=\"klick4creditsgoto.php[^>]+>[^<]+<\/a>/gi;
	find = regE2.exec(inText);
	sourceT = new String(find);
	if (sourceT != null){
		rg =/klick4credits[^"]+/;
		banLink=replaceamp(new String(rg.exec(sourceT)));
		rg2 =/>[^<]+/;
		textLink=new String(rg2.exec(sourceT));
		ind = textLink.indexOf("Nicht Klicken");
		
		if (checkLink(textLink)){
			return;
		}
		
		if (ind > -1){
		}else{
			window.open("http://"+SITE+"/"+banLink,"_blank");
			if (autoRefresh) {
				setTimeout("location.reload()",2000);
			}
			return;
		}
	}
	
}

function checkLink(text){

  var i = phrases.length;
  while (i--) {
    if (text.indexOf(phrases[i])>0) {
      return true;
    }
  }
	return false;
}


function replaceamp(s){
	var tmp = s;
	while (tmp.indexOf("&amp;")>=0){
		tmp = tmp.replace("&amp;","&");
	}
	return tmp;
}

function closeWin(){
	window.close();
	parent.close();
}

function getBox(){
	return document.getElementsByTagName("body")[0];
}

function prepareBanners(){
	var inText = new String(document.body.innerHTML);
	var regE = /<a href=\"klick4creditsgoto.php[^>]+><img[^>]+><\/a>/gi;
	var n=1;
	while((find = regE.exec(inText)) != null) {
		BannerArr[n]=find;
		n+=1;
	}
	
	setTimeout(openLinks2,700);
}

function openLinks2(){
	var first=link2;
	var sourceT = new String(BannerArr[first]);
	if (first<BannerArr.length){
		var rg =/src="[^"]+"/;
		var imgLink=new String(sourceT.match(rg));
		var rg2 =/klick4credits[^"]+/;
		var banLink=replaceamp(new String(rg2.exec(sourceT)));
		var ind = imgLink.indexOf(SITE);
		if (ind==-1){
			if (imgLink.indexOf("http://")==-1){
				ind=0;
			}
		}
		if (ind > -1){
		}else{
			window.open("http://"+SITE+"/"+banLink,"_blank");
		}
		link2++;
		var mmax = ((maxBannersAtTime+firstBanner)>15?15:(maxBannersAtTime+firstBanner))-1;
		if (first<mmax){
				setTimeout(openLinks2,300);
		}
	}
}
function LinkStarter2(){
	var time=time2;
	if (time==0){
		link2=firstBanner;
		prepareBanners();
	}else{
		var nx=time-1;
		time2--;
		var divT=document.getElementById("timestart2");
		divT.innerHTML=nx;
		setTimeout(LinkStarter2,1000);
	}
}
function incrementTimer2(){
	vartimer+=1;
	var divT=document.getElementById("myTimer");
	divT.innerHTML="прошло секунд: " + vartimer + "; Обновление страницы через " + (refreshBannerPageAt-vartimer);
	if (vartimer==refreshBannerPageAt){
		location.reload(true);
	}
	setTimeout(incrementTimer2,1000);
}

function openLinks3(){
	var first=link2;
	var sourceT = new String(BannerArr[first]);
	if (first<BannerArr.length){
		var rg2 =/klick4credits[^"]+/;
		var banLink=replaceamp(new String(rg2.exec(sourceT)));
		var ind = -1;
		if (checkLink(sourceT)){
			ind=5;
		}
		if (ind > -1){
		}else{
			window.open("http://"+SITE+"/"+banLink,"_blank");
		}
		link2++;
		var mmax = ((maxBannersAtTime+firstBanner)>15?15:(maxBannersAtTime+firstBanner))-1;
		if (first<mmax){
				setTimeout(openLinks3,300);
		}
	}
}
function prepareLinks(){
	var inText = new String(document.body.innerHTML);
	var regE = /<a href=\"klick4creditsgoto.php[^>]+>[^>]+?<\/a>/gi;
	var n=1;
	while((find = regE.exec(inText)) != null) {
		BannerArr[n]=find;
		n+=1;
	}
	setTimeout(openLinks3,700);
}
function LinkStarter3(){
	var time=time2;
	if (time==0){
		link2=firstBanner;
		prepareLinks();
	}else{
		var nx=time-1;
		time2--;
		var divT=document.getElementById("timestart2");
		divT.innerHTML=nx;
		setTimeout(LinkStarter3,1000);
	}
}
function incrementTimer3(){
	vartimer+=1;
	var divT=document.getElementById("myTimer");
	divT.innerHTML="прошло секунд: " + vartimer + "; Обновление страницы через " + (refreshBannerPageAt-vartimer);
	if (vartimer==refreshBannerPageAt){
		location.reload(true);
	}
	setTimeout(incrementTimer3,1000);
}
function incrementTimer(){
	vartimer+=1;
	var divT=document.getElementById("myTimer");
	divT.innerHTML="прошло секунд: " + vartimer + "; Обновление страницы через " + (refreshMailPageAt-vartimer);
	if (vartimer==refreshMailPageAt){
		location.reload(true);
	}
	setTimeout(incrementTimer,1000);
}


function getDivCont(elname,clname,num){
	
	var links_element = document.getElementsByTagName(elname);
	var num2=1;
	
	var tx="";
		if (!links_element){return;}else{
			for(i=0;i<links_element.length;i++){
				var text_a = links_element[i].className;
				try{
					if(text_a.indexOf(clname) != -1){
						//num2+=1;
						if (num2==num){
							return links_element[i];
						}else{
							num2+=1;
						}
					}
				}catch(err){}
			}
		}
}

setTimeout(tryGetLink,firstTimeout);