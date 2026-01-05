// ==UserScript==
// @name         bs.to addseries
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://bs.to/serie/*
// @grant        none
// donationsURL paypal.me/JonathanHeindl :3
// @downloadURL https://update.greasyfork.org/scripts/25244/bsto%20addseries.user.js
// @updateURL https://update.greasyfork.org/scripts/25244/bsto%20addseries.meta.js
// ==/UserScript==

//differenciate handling for anime and other series (might need setup)can be adjusted for different criteria)
var animedifference=false;
if(!animedifference){
	window.setup=function(criteria="AnimeBorder"){
		var http = new XMLHttpRequest();
		http.open("GET", "https://bs.to/settings/series", true);
		http.setRequestHeader("Content-type", "text/html; charset=utf-8");
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				var list =http.responseText.split('<ul class="col" id="series-menu">')[1].split('</ul>')[0].split("\n");
				var AList=new Array(0);
				//prepares list to only be indices of the series
				for(var i=1;i<list.length-1;i++){
					console.log(list[i].split('data-id="')[1].split('">')[0]);
					try{
						AList.push(JSON.parse(list[i].split('data-id="')[1].split('">')[0]));
						//error if letter in string(border)
					}catch(e){
						AList.push(list[i].split('data-id="')[1].split('">')[0]);
					}
				}
				AList.push(criteria);
				XMHRequest(AList);
			}
		};
		http.send();
	};
}
(function addseries() {
	'use strict';
	var btn = document.createElement("li");
	var btnB = document.createElement("li");
	btn.style.color="#F8F8F8";
	btnB.style.color="#F8F8F8";
	btn.appendChild(document.createTextNode("Entfernen"));
	btnB.appendChild(document.createTextNode("AnimeAdd"));
	btnB.onclick= function(){
		check(btn,btnB,false,true);
	};
	//document.getElementsByTagName("nav")[0].children[0].insertBefore(btn,document.getElementsByTagName("nav")[0].children[0].children[2]);
	document.getElementsByTagName("nav")[0].children[0].append(btn);// bar at the top
	if(animedifference){
		document.getElementsByTagName("nav")[0].children[0].append(btnB);
	}
	//if andere serien list contains current url
	if(getIndex(document.getElementsByTagName("ul")[1].children,location.href,".firstChild.href")>-1){
		btn.onclick=function(){
			check(btn,btnB,true);
		};
		btnB.hidden=true;
	}else{
		btn.innerText="Bookmark";
		btn.onclick=function(){
			check(btn,btnB,false,false);
		};
	}
	setWidth(!btnB.hidden);
})();
function setWidth(isadded){
	var a=$("ul")[0].children;
	for(var e=2;e<a.length;e++){
		a[e].style.width=(isadded&&animedifference)?"93px":"111px";
		//"111px":"127px";
	}
}
function check(btn,btnB,isRemoving,toAnime){
	var http = new XMLHttpRequest();
	http.open("GET", "https://bs.to/settings/series", true);
	http.setRequestHeader("Content-type", "text/html; charset=utf-8");
	http.onreadystatechange = function() {
		if(http.readyState == 4 && http.status == 200) {
			var list =http.responseText.split('<ul class="col" id="series-menu">')[1].split('</ul>')[0].split("\n");
			var AList=new Array(0);
			//prepares list to only be indices of the series
			for(var i=1;i<list.length-1;i++){
				console.log(list[i].split('data-id="')[1].split('">')[0]);
				try{
					AList.push(JSON.parse(list[i].split('data-id="')[1].split('">')[0]));
					//error if letter in string(border)
				}catch(e){
					AList.push(list[i].split('data-id="')[1].split('">')[0]);
				}
			}
			changeList.call(this,btn,btnB,AList,isRemoving,toAnime);
		}
	};
	http.send();
}
function changeList(btn,btnB,ar,isRemoving,toAnime){
	btn.textContent=isRemoving?"Bookmark":"Entfernen";
	if(animedifference){
		btnB.hidden=!isRemoving;
		setWidth(isRemoving);
	}
	btn.onclick=function(){
		check(btn,btnB,!isRemoving,false);
	};
	var numberA =document.getElementById("sp_right").children[0].src.split('/');
	var b=parseInt(numberA[numberA.length-1].split('.')[0]);
	//check wether series is already in the list
	if((getIndex(ar,b,"",true)>-1)==isRemoving){
		if(!isRemoving){
			if(toAnime||!animedifference){
				ar.push(b);
			}else{
				ar=sc.A.iB(ar,b,"AnimeBorder");
			}
		}else{
			ar=removeArray(ar,b);
		}
	}
	//pushes list to the server
	XMHRequest(ar);
	//adds/removes series to/from the "andere serien"-list for this setting (not really necessary)"
	var list =document.getElementById("other-series-nav").children[1].children;
	if(isRemoving){
		list[getIndex(list,window.location.href,".firstChild.href")].remove();
	}else{
		var newButton =list[1].cloneNode(true);
		list[0].parentElement.insertBefore(newButton,list[0]);
		var url=location.href.split('/');
		newButton.firstChild.href=""+url[3]+"/"+url[4];
		newButton.firstChild.innerText=url[4].replace("-"," ");
	}
}
function XMHRequest(ar){
	var http = new XMLHttpRequest();
	var form ="series%5B%5D="+ar[0];
	for(var z=1;z<ar.length;z++){
		form+="&series%5B%5D="+ar[z];
	}
	http.open("POST","https://bs.to/ajax/edit-seriesnav.php", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send(form);
}
function getIndex(e,f,path="",equal=false){           // array e   element of e f ? returns Index
	for(var i=0;i<e.length;i++) {
		if(equal){
			if(f==eval("e[i]"+path)){             //index of to include series number (+/0 etc at the end)
				return i;
			}
		}else{
			if(f.toString().indexOf(eval("e[i]"+path))>-1){             //index of to include series number (+/0 etc at the end)
				return i;
			}
		}
	}
	return -1;
}
function removeArray(e,f){     //array e element of e  element f
	var g=new Array(e.length-1);
	var found=false;
	for(var i=0;i<e.length;i++){
		if(e[i]==f){
			found=true;
		}else{
			if(!found){
				g[i]=e[i];
			}
			else{
				g[i-1]=e[i];
			}
		}
	}
	return g;
}