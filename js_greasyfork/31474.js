// ==UserScript==
// @name         bs usertab
// @namespace    http://tampermonkey.net/
// @version      0.30004
// @description  script zum namenverfolständigen auf bs
// @author       You
// @match        https://bs.to/home
// @match        https://bs.to/
// ---@grant        none
// @grant        GM_addStyle
// donationsURL paypal.me/JonathanHeindl :3
// @downloadURL https://update.greasyfork.org/scripts/31474/bs%20usertab.user.js
// @updateURL https://update.greasyfork.org/scripts/31474/bs%20usertab.meta.js
// ==/UserScript==


//   format =["username1","username2",...];
var customuserarray=["hier deinen usernamen einfügen oder [] lassen"];


var username="";
var nameA=[];

var sB=$(sbMsg)[0];
try{
	username=document.getElementById("navigation").children[0].childNodes[1].innerText;
}catch(err){
}
if (!Array.prototype.remI) {
	var ars = ["Array", "HTMLCollection"];
	for (var i = 0; i < ars.length; i++) {
		Object.defineProperty(eval(ars[i]).prototype, "remI", {
			enumerable: false,
			value: function (index) {
				for (var i = 0; i < this.length; i++) {
					if (i > index) {
						this[i - 1] = this[i];
					}
				}
				this.length--;
			}
		});
		Object.defineProperty(eval(ars[i]).prototype, "f", {
			enumerable: false,
			value: function findArray(f, equal = false, path = "", first = true) {
				var index = -1;
				for (var i = 0; i < this.length; i++) {
					if (equal) {
						if (f === eval("this[i]" + path)) {
							index = i;
							if (first) {
								return index;
							}
						}
					} else {
						if (f.toString().indexOf(eval("this[i]" + path)) > -1) {
							index = i;
							if (first) {
								return index;
							}
						}
					}
				}
				return index;
			}
		});

	}
}
if (!Array.prototype.p) {
	var ars = ["Array", "HTMLCollection"];
	for (var i = 0; i < ars.length; i++) {
		Object.defineProperty(eval(ars[i]).prototype, "p", {
			enumerable: false,
			value:function p (str){
				if(this.f(str)===-1){
					return this.push(str);
				}
			}
		});
	}
}
(function() {
	'use strict';
	setTimeout(function(){
		function getpart(username) {
			var ch = n.charCodeAt(0);
			var big;
			if (ch > 96 && ch < 123) {
				big = 0;//small letter
			} else if (ch > 64 && ch < 91) {
				big = 1;//big letter;
			} else {
				big = 2;//rest
			}
			var str = n[0];
			n = username;
			var nameAS = [];
			for (var k = 1; k < n.length; k++) {
				var ch = n.charCodeAt(k);
				var big2;
				if (ch > 96 && ch < 123) {
					big2 = 0;//small letter
				} else if (ch > 64 && ch < 91) {
					big2 = 1;//big letter;
				} else {
					big2 = 2;//rest
				}
				if (big2 !== big) {
					nameAS.push(str);
					str = n[k];
					big = big2;
				} else {
					str += n[k];
				}
			}
			nameAS.p(str);
			return nameAS;
		}
		try{
			username=document.getElementById("navigation").children[0].childNodes[1].innerText;
			var n = username;
			debugger;
			nameA = [n];
			nameA.p(n.replace("5", "s").replace("4", "a").replace("1", "i").replace("3", "e").replace("0", "o"));
			nameA.p(n.toLowerCase().replace("y", "i"));
			/*nameA.push(n.toLowerCase().replace("y","i"));
                     nameA.push(n.toLowerCase().replace("y","i"));
                     nameA.push(n.toLowerCase().replace("y","i"));*/
			var nameAS = getpart(n);
			for (var m = 0; m < nameAS.length; m++) {
				var unam = "";
				for (var n2 = 0; n2 < nameAS.length; n2++) {
					if (m !== n2) {
						unam += nameAS[n2];
					}
				}
				if (unam !== "undefined" && unam !== "") {
					nameA.p(unam);
				}
				unam = nameAS[m];
				if (m < nameAS.length - 1) {
					unam += nameAS[m + 1];
					if (unam.length < 4 && m < nameAS.length - 2) {
						unam += nameAS[m + 2];
					}
					if (unam.length < 4 && m < nameAS.length - 3) {
						unam += nameAS[m + 3];
					}
					if (unam !== "undefined" && unam !== "") {
						nameA.p(unam);
					}
				}
			}
		}catch(err){
			debugger;
		}
		var par=sB.parentElement;
		sB=$(sbMsg)[0];
		sB.oninput=function(a,b,c){
			var usercontainer=$(sbUserCont)[0].children;
			var onlineNames=[];
			for(var i=par.children.length-1;i>-1;i--){
				if(par.children[i].localName==="li12"){
					par.children[i].remove();
				}
			}
			if(sB.value.length>2){
				for(var t=0;t<usercontainer.length;t++){
					var index=usercontainer[t].children[0].textContent.toLowerCase().replace("5", "s").replace("4", "a").replace("1", "i").replace("3", "e").replace("0", "o").indexOf(sB.value.split("@")[1].toLowerCase());
					if(sB.value.indexOf("@")>-1 &&( usercontainer[t].children[0].textContent.toLowerCase().indexOf(sB.value.split("@")[1].toLowerCase())===0||index===0)){
						onlineNames.push(usercontainer[t].children[0].textContent);
					}
				}
				var active=$(sbPosts)[0].children;
				for(var t=0;t<active.length;t+=2){
					if(onlineNames.f(active[t].children[0].textContent)>-1){
						onlineNames.remI(onlineNames.f(active[t].children[0].textContent,true));
						onlineNames.push(active[t].children[0].textContent);
					}else{
						var indx=active[t].children[0].textContent.toLowerCase().replace("5", "s").replace("4", "a").replace("1", "i").replace("3", "e").replace("0", "o").indexOf(sB.value.split("@")[1].toLowerCase());
						if(sB.value.indexOf("@")>-1 &&( active[t].children[0].textContent.toLowerCase().indexOf(sB.value.split("@")[1].toLowerCase())===0||indx===0)){
							onlineNames.push(active[t].children[0].textContent);
						}
					}

				}
				sB.onl=onlineNames;
				sB.index=0;
				if(onlineNames.length>0){
					var field=document.createElement("li12");
					field.style.width="200px";
					var height=onlineNames.length*20+20;
					var top=sB.offsetTop-(height)-5;
					field.style.position="absolute";
					field.style.top=top+"px";
					field.style.height=height+"px";
					field.style.left=sB.offsetLeft+"px";
					field.style.background="white";
					field.style.border="rgb(100, 160, 255) 1.5px solid";
					field.style.borderRadius= "4px";
					sB.fie=field;
					for(var j=0;j<onlineNames.length;j++){
						var username=document.createElement("el");
						username.innerText=onlineNames[j];
						username.style.position="absolute";
						username.style.top=j*20+8+"px";
						username.style.left=20+"px";
						username.style.width="160px";
						field.append(username);
					}
					par.append(field);
				}
			}
		};
		sB.onkeydown=function(a,b,c){
			if(a.keyCode===38||a.keyCode===40){
				if(sB.fie.children[sB.index]){
					sB.fie.children[sB.index].style.backgroundColor="white";
				}
				function index(plus){
					if(plus){
						sB.index++;
						if(sB.index>sB.onl.length-1){
							sB.index=0; 
						}
					}else{
						sB.index--;
						if(sB.index==-1){
							sB.index=sB.onl.length-1;
						}
					}
				}
				if(sB.index===undefined){
					sB.index=0;
				}
				if(a.keyCode===38){
					index(false);
				}else{
					index(true);
				}
				sB.fie.children[sB.index].style.backgroundColor="rgb(100, 160, 255)";
				sB.value=sB.value.replace(sB.value.split("@")[1].split(" ")[0],sB.onl[sB.index]+" ");
			}else if(a.keyCode===9){
				//tab
				if(sB.onl.length===1){
					if(sB.onl[0]){
						sB.value=sB.value.replace(sB.value.split("@")[1].split(" ")[0],sB.onl[0]+" ");
					}
				}else{
					if(sB.onl[sB.onl.length-1]){
						sB.value=sB.value.replace(sB.value.split("@")[1].split(" ")[0],sB.onl[sB.onl.length-1]+" ");
					}
				}
				for(var i=par.children.length-1;i>-1;i--){
					if(par.children[i].localName==="li12"){
						par.children[i].remove();
					}
				}
				setTimeout(function(sB){
					sB.focus();
					sB.selectionStart=sB.value.length;
					sB.selectionEnd=sB.value.length;
				},1,sB);
			}
			if(a.keyCode==13){
				return Shoutbox.checkEnter(a);
			}
		};
	},1000);

	$(sbPosts)[0].addEventListener("DOMNodeInserted",function(a,b){
		if(a.target.localName==="dd"){
			var onlineNames=[];
			var usercontainer=$(sbUserCont)[0].children;
			/*for(var t=0;t<usercontainer.length;t++){
				onlineNames.push(usercontainer[t].children[0].textContent);
			}*/
			var active=$(sbPosts)[0].children;
			for(var t=0;t<active.length;t+=2){
				if(onlineNames.f(active[t].children[0].textContent)>-1){
					onlineNames.remI(onlineNames.f(active[t].children[0].textContent,true));
					onlineNames.push(active[t].children[0].textContent);
				}else{
					onlineNames.push(active[t].children[0].textContent);
				}

			}
			var text=a.target.textContent;
			var splitt = text.split(/,| |\./);
			var found=false;
			for(var ind=0;ind<splitt.length;ind++){
				for(var m=0;m<nameA.length;m++){
					var indx=splitt[ind].indexOf(nameA[m]);
					if(indx>-1){
						found=true;
						a.target.innerHTML=text.replace(splitt[ind],"<mark>"+splitt[ind]+"</mark>");
						break;
					}
				}
			}
			if(!found){
				for(var i=0;i<customuserarray.length;i++){
					var name =customuserarray[i];
					if(text.indexOf("@"+name)>-1){
						a.target.innerHTML=text.replace(""+name,"<mark>"+""+name+"</mark>");//style="background-color: blue;"
					}else if(text.indexOf(name)>-1){
						a.target.innerHTML=text.replace(new RegExp(name,"g"),"<mark>"+name+"</mark>");
					}
				}
			}
		}
	});
	// Your code here...
})();