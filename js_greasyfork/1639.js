// ==UserScript==
// @name           GaiaOnline: Mail Checker
// @namespace      http://userscripts.org/users/62850
// @description    Checks inboxes for mail (Tools->Greasemonkey->User Script Commands)
// @include        *
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @version 0.0.1.20150301153417
// @downloadURL https://update.greasyfork.org/scripts/1639/GaiaOnline%3A%20Mail%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/1639/GaiaOnline%3A%20Mail%20Checker.meta.js
// ==/UserScript==
function getMail(userN,mode){
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://www.gaiaonline.com/chat/gsi/index.php?v=json&m=[[102%2C['+userN+']]]&X='+(new Date().getTime().toString().substring(0, 10)),
		onload: function(r){
			if(typeof JSON != 'undefined'){
				var json=JSON.parse(r.responseText);
			}
			else{
				var json=eval(r.responseText);
			}
			var pms=json[0][2]['user_pms'];
			if(mode=='add'){
				try{
					alert(json[0][2]['username']+' ('+userN+') has been added there are '+pms+' unread PM(s).');
					save(userN,pms);
				}
				catch(e){
					alert('Check the user id\nError code:\n'+e);
				}
			}
			else if(mode=='del'){
				try{
					var userName=json[0][2]['username'];
					if(confirm('Click OK to remove '+userName+' ('+userN+')')===true){
						alert(userName+' ('+userN+') has been removed.');
						delete arr[userN];
						GM_setValue('id',JSON.stringify(arr));
					}
				}
				catch(e){
					alert('Check the user id ('+userN+')\nError code:\n'+e);
				}
			}
			else if(mode=='all'){
				alert(json[0][2]['username']+' ('+userN+') has '+pms+' unread PM(s).');
			}
			else{
				if(pms>0){
					if(GM_getValue(userN)!=pms){
						alert(json[0][2]['username']+' ('+userN+') has '+pms+' unread PM(s).');
						save(userN,pms);
					}
				}
				else if(GM_getValue(userN)!=pms){
					save(userN,pms);
				}
			}
		}
	});
}
function getIdList(){
	var i,str='';
	for(i in arr)
		str+='\n'+i
	alert('User Ids:'+str);
}
function addUser(){
	var id=prompt('What is the user ID?');
	if(id){
		if(Number(id)==id){
			getMail(id,'add');
		}
		else{
			alert('User IDs are numbers\n'+id+'is not a number');
		}
	}
}
function delUser(){
	var id=prompt('What is the user ID?');
	if(id){
		if(Number(id)==id){
			getMail(id,'del');
		}
		else{
			alert('User IDs are numbers\n'+id+'is not a number');
		}
	}
}
function save(id,mail){
	arr[id]=mail;
	GM_setValue('id',JSON.stringify(arr));
}
function getAllMail(){
	for(var i in arr){
		getMail(i,'all');
	}
}
var isInIFrame,arr;
try{
	isInIFrame=window.location!=top.location;
}
catch(e){
	isInIFrame=true;
}
if(isInIFrame===false){
	arr=GM_getValue('id');
	if(document.domain!='www.gaiaonline.com'&&arr){
		arr=arr?JSON.parse(arr):{};
		for(var i=0;i<arr.length;i++){
			getMail(arr[i],'get');
		}
	}
	else if(arr){
		arr=arr?JSON.parse(arr):{};
		try{
			f();
			var id=document.getElementsByClassName('panel_mygaia_profile')[0].getElementsByTagName('a')[0].href.split('/');
			id=id[id.length-2];
			if(isNaN(id)){
				makeError();
			}
		}
		catch(e){
			try{
				var id=document.evaluate('.//a[@title="Logout from your Gaia account"]',document,null,9,null).singleNodeValue.href;
				id=id.substr(id.indexOf('userid=')+7);
				if(id.indexOf('&')!=-1){
					id=id.substr(0,id.indexOf('&'));
				}
			}
			catch(e){
				try{
					var id=document.getElementById('gmSelectLogin').className;
					if(id!=Number(id)){
						id='';
					}
				}
				catch(e){}
			}
		}
		if(id){
			while(id!=Number(id)){
				id=id.substr(-1);
			}
		}
		for(var i in arr){
			if(id){
				if(i!=id){
					getMail(i,'get');
				}
				else if(!arr[id]){
					save(id,0);
				}
			}
			else{
				getMail(i,'get');
			}
		}
	}
	else
		arr={};
	GM_registerMenuCommand("Gaia Mail Checker: List all user ids", getIdList);
	GM_registerMenuCommand("Gaia Mail Checker: Add user", addUser);
	GM_registerMenuCommand("Gaia Mail Checker: Remove user", delUser);
	GM_registerMenuCommand("Gaia Mail Checker: Get all mail", getAllMail);
}