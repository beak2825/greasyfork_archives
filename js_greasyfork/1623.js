// ==UserScript==
// @name           Gaia Online Mule Tool V2
// @description    Easy way to switch/manage accounts on Gaia Online.
// @include        http://www.gaiaonline.com/*
// @include        https://www.gaiaonline.com/*
// @version        2.10.29
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @namespace      https://greasyfork.org/users/2178
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/1623/Gaia%20Online%20Mule%20Tool%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/1623/Gaia%20Online%20Mule%20Tool%20V2.meta.js
// ==/UserScript==
function log(m){
	return;// Place to / characters at the start of this line to enable logging
	console.log(m);
}
function getEle(tag,attr,val){
	return findEle('.//'+tag+'[@'+attr+'="'+val+'"]',9);
}
function findEle(target,i,doc=document){
	if(i==9)
		return doc.evaluate(target, doc, null, i, null).singleNodeValue;
	else
		return doc.evaluate(target, doc, null, i, null);
}
function getId(id){
	return document.getElementById(id);
}
function sendEvent(ele,e){
	ele.dispatchEvent(new Event(e));
}
function getURL(findMe,txt){
	if(!txt)
		txt=location.search;
	if(txt){
		txt=txt.slice(1);
		txt=txt.slice(txt.indexOf(findMe+'='));
		var l=txt.indexOf('&');
		if(l!=-1){
			return txt.slice(findMe.length+1,l);
		}
		else{
			return txt.slice(findMe.length+1);
		}
	}
	return null;
}
function chunkify(t){ /* This function from http://my.opera.com/GreyWyvern/blog/show.dml/1671288 */
	var tz = [], x = 0, y = -1, n = 0, i, j;
	while (i = (j = t.charAt(x++)).charCodeAt(0)) {
		var m = (i == 46 || (i >=48 && i <= 57));
		if (m !== n) {
			tz[++y] = "";
			n = m;
		}
		tz[y] += j;
	}
	return tz;
}
async function sortAlphaNumAsc(a, b){ /* This function from http://my.opera.com/GreyWyvern/blog/show.dml/1671288 */
	log('Sorting in Ascending order (A-Z)');
	var aa,bb;
	if(await GM.getValue('sortCase',false)){
		aa = chunkify(a);
		bb = chunkify(b);
	}
	else{
		aa = chunkify(a.toLowerCase());
		bb = chunkify(b.toLowerCase());
	}
	for (x = 0; aa[x] && bb[x]; x++) {
		if (aa[x] !== bb[x]) {
			var c = Number(aa[x]), d = Number(bb[x]);
			if (c == aa[x] && d == bb[x]) {
				return c - d;
			} else return (aa[x] > bb[x]) ? 1 : -1;
		}
	}
	return aa.length - bb.length;
}
async function sortAlphaNumDes(a, b){ /* This function from http://my.opera.com/GreyWyvern/blog/show.dml/1671288 */
	log('Sorting in Descending order (Z-A)');
	var aa,bb;
	if(await GM.getValue('sortCase',false)){
		aa = chunkify(a);
		bb = chunkify(b);
	}
	else{
		aa = chunkify(a.toLowerCase());
		bb = chunkify(b.toLowerCase());
	}
	for (x = 0; aa[x] && bb[x]; x++) {
		if (aa[x] !== bb[x]) {
			var c = Number(aa[x]), d = Number(bb[x]);
			if (c == aa[x] && d == bb[x]) {
				return d - c;
			} else return (aa[x] > bb[x]) ? -1 : 1;
		}
	}
	return bb.length - aa.length;
}
async function safeMode(){
	var TF=await GM.getValue('safeMode',false);
	if(confirm('If this setting is set to true it will log you in using your User Id instead of your username.\nThis is useful if Gaia is being stubborn with your User Name.\nCurrent setting is '+TF+'.\nChange it?')===true){
		GM.setValue('safeMode',!TF);
	}
	return;
}
async function sortConfig(){
	function disableItems(){
		var e=document.GM_sortForm;
		if(e.sort.checked===false){
			e.by_name[0].disabled="disabled";
			e.by_name[1].disabled="disabled";
			e.id_asc[0].disabled="disabled";
			e.id_asc[1].disabled="disabled";
			e.by_case.disabled="disabled";
			e.name_asc[0].disabled="disabled";
			e.name_asc[1].disabled="disabled";
		}
		else{
			e.by_name[0].removeAttribute("disabled");
			e.by_name[1].removeAttribute("disabled");
			if(e.by_name[0].checked===true){
				e.id_asc[0].removeAttribute("disabled");
				e.id_asc[1].removeAttribute("disabled");
				e.by_case.disabled="disabled";
				e.name_asc[0].disabled="disabled";
				e.name_asc[1].disabled="disabled";
			}
			else{
				e.id_asc[0].disabled="disabled";
				e.id_asc[1].disabled="disabled";
				e.by_case.removeAttribute("disabled");
				e.name_asc[0].removeAttribute("disabled");
				e.name_asc[1].removeAttribute("disabled");
			}
		}
	}
	var sort={
			"sort":await GM.getValue('sortEnable',true),
			"by_name":await GM.getValue('sortName',false),
			"by_asc":await GM.getValue('sortIdAsc',true),
			"by_case":await GM.getValue('sortCase',false),
			"name_asc":await GM.getValue('sortNameAsc',true)
		},
		div=document.createElement('div'),form=document.createElement('form'),i,arr;
	div.id='GM_popupDiv';
	div.innerHTML='<span onclick="this.parentNode.parentNode.removeChild(this.parentNode);" id="GM_tableClose" title="Close">X</span><div id="GM_div4form"></div>';
	form.name="GM_sortForm";
	form.setAttribute('onsubmit',"return false");
	form.action='#';
	form.innerHTML='<ul>\
						<li><input name="sort" type="checkbox"'+(sort["sort"]?' checked="checked"':'')+'/>Enable Sorting<sup>[1][2]</sup>\
							<ul>\
								<li><input name="by_name" type="radio"'+(sort["by_name"]?'':' checked="checked"')+'/>By account ID\
									<ul>\
										<li><input name="id_asc" type="radio"'+(sort["by_asc"]?' checked="checked"':'')+'/>Oldest to neweset</li>\
										<li><input name="id_asc" type="radio"'+(sort["by_asc"]?'':' checked="checked"')+'/>Newest to oldest</li>\
									</ul>\
								</li>\
								<li><input name="by_name" type="radio"'+(sort["by_name"]?' checked="checked"':'')+'/>By account name\
									<ul>\
										<li><input name="by_case" type="checkbox"'+(sort["by_case"]?' checked="checked"':'')+'/>Ignore Case<sup>[3]</sup></li>\
										<li><input name="name_asc" type="radio"'+(sort["name_asc"]?' checked="checked"':'')+'/>Ascending (0 to z)</li>\
										<li><input name="name_asc" type="radio"'+(sort["name_asc"]?'':' checked="checked"')+'/>Descending (z to 0)</li>\
									</ul>\
								</li>\
							</ul>\
						</li>\
					</ul>\
					<input value="Save" type="submit"><input name="close" value="Cancel" type="button"/><br/>\
					<small>1. Allows you to manually order the accounts from the account table in the desired order.<br/>\
					2. Sorting accounts deletes any custom order.<br/>\
					3. If checked A comes before a when Ascending, likewise z comes before Z when Descending.</small>';
	form.addEventListener('submit',async function(){
		GM.setValue('sortEnable',this.sort.checked);
		GM.setValue('sortName',this.by_name[1].checked);
		GM.setValue('sortIdAsc',this.id_asc[0].checked);
		GM.setValue('sortCase',this.by_case.checked);
		GM.setValue('sortNameAsc',this.name_asc[0].checked);
		if(this.sort.checked){
			var accounts=JSON.parse(await GM.getValue("accounts","{}"));
			await GM_updateIds(cId,accounts);
		}
		this.close.click();
	},false);
	form.close.addEventListener('click',function(){
		sendEvent(getId('GM_tableClose'),'click');
	},false);
	div.childNodes[1].appendChild(form);
	document.body.appendChild(div);
	form.style.marginTop=window.innerHeight/2-form.offsetHeight/2+'px';
	arr=Array(form.sort,form.by_name[0],form.by_name[1]);
	for(i in arr){
		arr[i].addEventListener('change',disableItems,false);
	}
	disableItems();
}	
async function insertUserInverface(cId){
	var accounts='',
		l=document.location.href;
	try{
		log('Reading account data');
		var ids=JSON.parse(await GM.getValue('accounts','{}'));
		for(var i in ids){
			if('+'+cId!=i){
				accounts+='<option class="GM_indent" value="'+parseInt(i)+'">'+ids[i]["name"]+'</option>';
			}
			else{
				accounts+='<option disabled="disabled" class="GM_indent">'+ids[i]["name"]+'</option>';
				try{
					getId('GM_message').setAttribute('name',ids[i]["name"]);
				}
				catch(e){}
			}
		}
		/*if(l.match('/marketplace/outfits')!=null){
			var pass=ids[cId]["pass"];
			if(pass.length>0){
				pass=pass.split(',')[1];
				if(pass.length>0){
					window.addEventListener("load",function(){
						var outFitMarket=getEle("div","class","yui3-widget-bd gmodal-body");
						if(outFitMarket){
							outFitMarket.addEventListener("DOMNodeInserted",function(){
								var blank=getId('ospassword');
								if(blank){
									if(blank.value==""){
										blank.focus();
										blank.value=pass;
										blank.addEventListener("keypress",function(event){
											if(event.which=13){
												this.blur();
												var btn=getEle("a","data-title","Buy It!");
												btn.click();
											}
										},false);
									}
								}
							},false);
						}
					},false);
				}
			}
		}
		else */if(l.match('/marketplace/')!=null||l.match('/gaia/bank.php')!=null||l.match('/giftgiving/')||l.match('/guilds-home/')){
			log('Found page that may have a password field');
			function passfill(l){
				try{
					var field=document.evaluate('.//input[@type="password"]',document,null,9,null).singleNodeValue;
					if(field.value.length==0)
						field.value=ids['+'+cId]['pass'];
					log('Password field found and auto filled');
				}
				catch(e){
					log('There is no pass field');
				}
				if(l.match('/marketplace/')!=null){
					setTimeout(function(){
						log('Checking for password filed');
						passfill(l);
					},1355);// probes page for pass field every 1.35 seconds
				}
			}
			passfill(l);
		}
	}
	catch(e){
		console.log('No accounts stored');
	}
	log('Making menu HTML');
	n=getId('gmSelectLogin').parentNode;
	n.innerHTML=(document.location.href.match('.com/profiles/')?'| ':'')+
		'<select class="'+cId+'" id="gmSelectLogin" onchange="this.blur();">'+
			'<option value="return">Change User...</option>'+
			'<option value="gmLogout">Logout</option>'+
			'<optgroup label="User Accounts">'+
				accounts+
			'</optgroup>'+
			'<optgroup label="Utilities">'+
				'<option class="GM_indent" value="dumpsterDive">Dumpster Dive</option>'+
				'<option class="GM_indent" value="getDaily">Get Daily Chances</option>'+
			/*	'<option class="GM_indent" value="theDailyDive">Both of the above</option>'+
		//	*/	'<option class="GM_indent" value="theDailyDive">The Daily Dive</option>'+
			'</optgroup>'+
			'<optgroup label="Edit Tool Data">'+
				'<option class="GM_indent" value="addAccount">Add/Update this account</option>'+
				'<option class="GM_indent" value="delAccount">Remove this account</option>'+
			'</optgroup>'+
			'<optgroup class="GM_indent" label="Advanced">'+
				'<option class="GM_indent" value="addAccountAdv">Add/Update account</option>'+
				'<option class="GM_indent" value="delAccountAdv">Remove account</option>'+
				'<option class="GM_indent" value="genTable">Display account table</option>'+
				'<option class="GM_indent" value="sortConf">Configure account sorting</option>'+
				'<option class="GM_indent" value="toggleSM">Toggle Safe Mode</option>'+
				'<option class="GM_indent" value="import">Import Accounts</option>'+
				'<option class="GM_indent" value="export">Export Accounts</option>'+
				'<option class="GM_indent" value="convert">Fix Accounts for v2.10.29+</option>'+
			'</optgroup>'+
		'</select>';
	var GM_sel=getId('gmSelectLogin');
	log('Menu added');
	GM_sel.addEventListener('change',async function(e){
		await GM_selectChange(GM_sel.value,cId,nonce);
	},false);
	log('Menu usuable');
	if(l.match('/profiles/')==null){
		log('This is a NOT profile page, this calls for a few tweaks');
		GM_sel.addEventListener('focus',function(){
			getId('user_dropdown_menu').style.display='block';
		},false);
		GM_sel.addEventListener('blur',function(){
			getId('user_dropdown_menu').removeAttribute('style');
		},false);
		getId('user_dropdown_arrow').appendChild(getId('user_dropdown_menu'));
		log('Tweaks applied');
	}
}
async function GM_updateIds(cId,accounts){
	var ids=[],sorted={},names=[];
	log('Prepping account data for save');
	if(await GM.getValue('sortEnable',true)===true){
		log('Sorting account data');
		if(await GM.getValue('sortName',false)===false){
			log('Sorting by id');
			for(var i in accounts){
				ids.push(parseInt(i));
			}
			if(await GM.getValue('sortIdAsc',true)){
				log('in Ascending order (1 - 9)');
				ids.sort(function(a,b){return a-b;});// This line contains code from from http://www.w3schools.com/jsref/jsref_sort.asp
			}
			else{
				log('in Descending order (9 - 1)');
				ids.sort(function(a,b){return b-a;});// This line contains code from from http://www.w3schools.com/jsref/jsref_sort.asp
			}
			for(var i=0;i<ids.length;i++){
				sorted['+'+ids[i]]=accounts['+'+ids[i]];
			}
		}
		else{
			log('Sorting by name');
			for(var i in accounts){
				names.push(accounts[i]['name']);
			}
			names.sort(await GM.getValue('sortNameAsc',true)?await sortAlphaNumAsc:await sortAlphaNumDes);
			while(names.length>0){
				for(var i in accounts){
					if(accounts[i]['name']==names[0]){
						sorted['+'+parseInt(i)]=accounts[i];
						names=names.splice(1,names.length);
						delete(accounts[i]);
					}
				}
			}
		}
	}
	else{
		log('Sorting is disabled');
		sorted=accounts;
	}
	GM.setValue('accounts',JSON.stringify(sorted));
	log('Account data saved\nUpdating current menu');
	getId('gmSelectLogin').selectedIndex=0;
	await insertUserInverface(cId);
}
async function GM_Login(id){
	id=parseInt(id);
	log('Attempt to login user '+id);
	var ele=getId('memberloginForm');
	if (ele){
		log('Found login form');
		ele.setAttribute('action','/auth/login/?username='+id);
		try{
			log('Reading account data');
			var accounts=JSON.parse(await GM.getValue('accounts','{}'));
		}
		catch(e){
			log('WTF: How did the account data get corrupt?');
			return alert("Abort:\nUnable to parse account data!?\nWhich makes no sense since you can not be here if it can not be parsed :?\n\t"+e);
		}
		var pass=getId('password');
		if(await GM.getValue('safeMode',false)===true){
			getId('username').value=id;
		}
		else{
			getId('username').value=accounts['+'+id]['name'];
		}
		if(accounts['+'+id]['pass']==''){
			var word=prompt('Password for '+accounts['+'+id]['name']+'.');
			if(typeof word=='object'){
				alert("Login aborted");
				return;
			}
			pass.value=word;
		}
		else{
			pass.value=accounts['+'+id]['pass'];
		}
		if(accounts['+'+id]['auto']===true){
			getId('autologin').checked=true;
		}
		log('Login Form filled out');
		if(self!=top){ // Ensure page is in an iframe/embed
			log('This page is in a sub page');
			ele.target="_parent";
			var loc=getURL('redirect');
			if(!loc){
				log('Using alt method of retuning to last page');
				loc=self.parent.location.href;// can cause false positive 'SecurityError: Permission denied to access property "document" on cross-origin object'
				if(loc.indexOf('#')!=-1){
					loc=loc.slice(0,loc.indexOf('#'));
				}
			}
			var redirect=document.getElementsByName('redirect');
			if(redirect.length>0){
				redirect[0].value=loc;
			}
			else{
				redirect=document.createElement('input');
				redirect.name='redirect';
				redirect.value=loc;
				redirect.type='hidden';
				ele.appendChild(redirect);
			}
			log('Login page auto completed');
			var captcha=getId('recaptcha_image');
			if(captcha){
				log('But wait there is more, enjoy your captcha');
				//getId('recaptcha_response_field').value=window.showModalDialog('data:text/html;base64,PGh0bWw+Cjxib2R5Pgo8c2NyaXB0Pgpkb2N1bWVudC53cml0ZSgiRGFtIENhcHRjaGE6PGJyLz4iK3dpbmRvdy5kaWFsb2dBcmd1bWVudHMpOwo8L3NjcmlwdD4KPGJyLz4KPGlucHV0IGlkPSJjYXB0Y2hhIiB0eXBlPSJ0ZXh0Ii8+CjxpbnB1dCB0eXBlPSJidXR0b24iIHZhbHVlPSJTdWJtaXQiIG9uY2xpY2s9IndpbmRvdy5yZXR1cm5WYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXB0Y2hhJykudmFsdWU7IHdpbmRvdy5jbG9zZSgpOyI+CjwvYm9keT4KPC9odG1sPg==',captcha.innerHTML,"dialogwidth: 350; dialogheight: 150; resizable: yes");
				findEle('//body/embed[starts-with(@src,"/auth/login/?username=")]',9,top.document).setAttribute(
					'style',
					'position:absolute;top:0;left:0;z-index:99999;width:100%;height:'+top.innerHeight+'px;border:none;'
				);
				return;
			}
			log('now clicking login button');
			getId('signInButton').click();
			setTimeout(function(){// Click it again cause gaia missed it the 1st time
				log('Looks like we were too fast and the button was not click ready, lets try again.');
				getId('signInButton').click();
			},5800);
			log('sending status update to ui');
			try{
				self.parent.document.getElementsByClassName('avatarName')[0].childNodes[0].textContent='Reloading page...';
			}
			catch(e){
				try{
					self.parent.document.getElementById('GM_message').textContent='Reloading page...';
				}
				catch(e){
					log('Unable to find message text in header...')
				}
			}
		}
	}
	else if(self!=top){
		log('No login form found, server must be lagging, reloading page...');
		document.location.reload();
	}
}
async function GM_selectChange(newId,oldId,nonce){
	log('Select menu change call received\n'+oldId+' -> '+newId+' via nonce '+nonce);
	if(newId=='return'){
		return;
	}
	else if(newId==oldId){
		alert('That account is currently logged in.');
		getId('gmSelectLogin').selectedIndex=0;
	}
	else if(newId=='gmLogout'){
		try{
			var nameSpace=document.getElementsByClassName('avatarName')[0].childNodes[0];
		}
		catch(e){
			var nameSpace=getId('GM_message');
			nameSpace.parentNode.className='on';
		}
		var newName=nameSpace.getAttribute('name');
		document.getElementsByClassName('avatarName')[0].className+=' logout';
		nameSpace.textContent='Logging '+newName+' out.';
		var timeout=setTimeout(function(){
			log('lets try plan b');
			nameSpace.textContent='Un-able to confirm logout of '+newName+'.';
			var gmSelectLogin=getId('gmSelectLogin');
			gmSelectLogin.disabled='disabled';
			gmSelectLogin.title='Refresh page to see if you are signed in.';
		},10000); // Wait 10 seconds
		log('Now logging out');
		GM.xmlHttpRequest({
			method: "GET",
			url: location.protocol+"//"+document.location.hostname+"/auth/logout/?user_id="+oldId+'&nonce='+nonce,
			onload: function(){
				clearTimeout(timeout);
				nameSpace.textContent=newName+' has been logged out.';
				var gmSelectLogin=getId('gmSelectLogin');
				gmSelectLogin.disabled='disabled';
				gmSelectLogin.title='Refresh page to login.';
			},
			onerror: function(){
				clearTimeout(errortimer);
				alert('[Loading error]\nUn-able to confirm logout');
			}
		});
	}
	else if(newId=='import'){
		var nAct=prompt('Insert new accounts\nExisting Accounts of the same user will be updated to match this import'),i;
		if(nAct){
			nAct=JSON.parse(nAct);
			var oAct=JSON.parse(await GM.getValue("accounts","{}"));
			for(i in nAct){
				oAct['+'+parseInt(i)]=nAct[i];
			}
			await GM_updateIds(cId,oAct);
		}
		alert("You may need to use the 'Fix Accounts' feature.");
	}
	else if(newId=='export'){
		/*GM.openInTab('data:text/html;charset=utf-8,'+encodeURIComponent('<html><head><title>Exported Accounts</title></head><body><h1>Exported Accounts</h1>'+
			'Copy/paste this into the importer:<br><textarea type="text" readonly="readonly" onclick="this.select()" style="width:100%;height:250px;">'+
			await GM.getValue("accounts","{}")+'</textarea></body></html>'),false);*/
		prompt('Please copy the data below',await GM.getValue("accounts","{}"));
	}
	else if(newId=='addAccount'){
		var accounts=JSON.parse(await GM.getValue("accounts","{}"));
		if(accounts['+'+oldId]){
			var userName=accounts['+'+oldId]["name"];
			var passWord=accounts['+'+oldId]["pass"];
			if(confirm('Continue with changeing "'+userName+'" login\'s data?')===false){
				getId('gmSelectLogin').selectedIndex=0;
				return;
			}
		}
		else{
			try{
				var userName=document.getElementsByClassName('avatarName')[0].childNodes[0].textContent;
			}
			catch(e){
				return alert('This feature does not work on profiles\nUse the Advanced option. The user id is '+oldId);
			}
			var passWord='';
			if(confirm('Continue with adding the account "'+userName+'"?')===false){
				getId('gmSelectLogin').selectedIndex=0;
				return;
			}
		}
		passWord=prompt('Please insert the password for this account.\nLeave Blank to ask for it every time.',passWord);
		if(passWord=='null'){
			if(confirm('If you clicked "Cancel" click "OK".')===true){
				passWord='';
			}
		}
		var autoLogin=confirm('Enable "Remember Me" for this account?');
		accounts['+'+oldId]={"name":userName,"pass":passWord,"auto":Boolean(autoLogin)};
		await GM_updateIds(oldId,accounts);
	}
	else if(newId=='delAccount'){
		var accounts=JSON.parse(await GM.getValue("accounts","{}"));
		if(accounts['+'+oldId]){
			if(confirm('Continue with removeing the account for '+accounts[oldId]["name"]+'?')===true){
				delete(accounts['+'+oldId]);
			}
		}
		else{
			alert("You can't remove an account that does not exist.");
			getId('gmSelectLogin').selectedIndex=0;
			return;
		}
		await GM_updateIds(oldId,accounts);
	}
	else if(newId=='addAccountAdv'){
		var accounts=JSON.parse(await GM.getValue("accounts","{}"));
		var userId=prompt('Please insert the user ID.\nThis is a number.');
		if(!userId||isNaN(userId)===true){
			getId('gmSelectLogin').selectedIndex=0;
			return;
		}
		var userName=prompt('Please insert the username.',accounts['+'+userId]?accounts['+'+userId]["name"]:'');
		if(accounts['+'+userId]){
			if(confirm('Account already exist.\nContinue with changeing the account?')===false){
				getId('gmSelectLogin').selectedIndex=0;
				return;
			}
		}
		else{
			if(confirm('Continue with adding the account "'+userName+'"?')===false){
				getId('gmSelectLogin').selectedIndex=0;
				return;
			}
		}
		var passWord=prompt('Please insert the password for this account.\nLeave blank to ask for it every time.',accounts['+'+userId]?accounts['+'+userId]["pass"]:'');
		if(passWord=='null'){
			if(confirm('If you clicked "Cancel" click "OK".')===true){
				passWord='';
			}
		}
		var autoLogin=confirm('Enable "Remember Me" for this account?');
		accounts['+'+userId]={"name":userName,"pass":passWord,"auto":Boolean(autoLogin)};
		await GM_updateIds(oldId,accounts);
	}
	else if(newId=='delAccountAdv'){
		var nID=prompt('Account ID\nThis is a number.');
		if(!nID||isNaN(nID===true)){
			getId('gmSelectLogin').selectedIndex=0;
			return;
		}
		var accounts=JSON.parse(await GM.getValue("accounts","{}"));
		if(accounts['+'+nID]){
			var accounts=JSON.parse(await GM.getValue("accounts","{}"));
			if(confirm('Continue with removeing the account '+accounts['+'+nID]["name"]+'?')===true){
				delete(accounts['+'+nID]);
			}
		}
		else{
			alert("You can't remove an account that does not exist.");
			getId('gmSelectLogin').selectedIndex=0;
			return;
		}
		await GM_updateIds(oldId,accounts);
	}
	else if(newId=='genTable'){
		var div=document.createElement('div'),
			vals=JSON.parse(await GM.getValue("accounts","{}")),
			th='',td='';
		if(await GM.getValue('sortEnable',true)===false){
			th='<td><h3>Move</h3></td>';
			td='<td>'+
				'<span onclick="var tr=this.parentNode.parentNode;tr.parentNode.insertBefore(tr,tr.parentNode.firstElementChild.nextElementSibling);">Way Up</span> | '+
				'<span onclick="var tr=this.parentNode.parentNode;if(tr.previousElementSibling.id)tr.parentNode.insertBefore(tr,tr.previousElementSibling);">Up</span> | '+
				'<span onclick="var tr=this.parentNode.parentNode;if(tr.nextElementSibling)tr.parentNode.insertBefore(tr,tr.nextElementSibling.nextElementSibling);">Down</span> | '+
				'<span onclick="var tr=this.parentNode.parentNode;tr.parentNode.appendChild(tr);">Way Down</span></td>';
		}
		var string='<span onclick="this.parentNode.parentNode.removeChild(this.parentNode);" id="GM_tableClose" title="Close">X</span><div id="GM_div4Table">'+
			'<table id="GM_accountTable" border="1"><tr style="text-align:center">'+
			'<td><h3>Delete</d3></td>'+
			'<td><h3>User Id</h3></td>'+
			'<td><h3>User Name</h3></td>'+
			'<td><h3><a title="Toggle Password Display" onclick="var x=document.getElementsByName(\'GM_passWord\');if(this.href.indexOf(\'#Show_Password\')>-1){for(var i=0;i<x.length;i++){x[i].type=\'text\';}this.href=this.href.replace(\'#Show_Password\',\'#Hide_Password\');}else{for(var i=0;i<x.length;i++){x[i].type=\'password\';}this.href=this.href.replace(\'#Hide_Password\',\'#Show_Password\');}return false;" href="#Show_Password">Password</a></h3></td>'+
			'<td><h3>Remember Me</h3></td>'+
			th+'</tr>';
		for(var i in vals){
			string+='<tr class="GM_account" id="'+parseInt(i)+'"><td style="text-align:center;"><input type="checkbox" onchange="this.parentNode.parentNode.className=this.checked?\'GM_account delete\':\'GM_account\'"/></td><td>'+parseInt(i)+'</td><td>'+vals[i]["name"]+'</td><td><input name="GM_passWord" readonly="readonly" type="password" value="'+vals[i]["pass"]+'"/></td><td>'+vals[i]["auto"]+'</td>'+td+'</tr>';
		}
		div.id='GM_popupDiv';
		div.innerHTML=string+'</table><p><input style="margin-left:8px;" type="button" value="Save" id="GM_save"/><input style="float:right;margin-right:8px;" type="button" value="Cancel" id="GM_cancel"/></p></div>';
		document.body.appendChild(div);
		getId('GM_save').addEventListener("click",async function(){
			var list=document.evaluate(".//table[@id='GM_accountTable']/tbody/tr[@class='GM_account']",document,null,6,null);
			var accounts=JSON.parse(await GM.getValue("accounts","{}")),ordered={},id;
			for(var i=0,stp=list.snapshotLength;i<stp;i++){
				id=list.snapshotItem(i).id;
				ordered['+'+id]=accounts['+'+id];
			}
			await GM_updateIds(oldId,ordered);
			sendEvent(getId('GM_tableClose'),'click');
		},false);
		getId('GM_cancel').addEventListener("click",function(){
			sendEvent(getId('GM_tableClose'),'click');
		},false);
		div=getId('GM_div4Table');
		div.setAttribute('style','width:'+(div.childNodes[0].offsetWidth+20)+'px;height:'+div.offsetHeight+'px;max-height:'+document.body.offsetHeight+'px;display:block;');// The base height is detectable when the display is inline-table but it will not center while it is a inline-table
	}
	else if(newId=='toggleSM'){
		await safeMode();
	}
	else if(newId=='sortConf'){
		await sortConfig();
	}
	else if(newId=='convert'){
		if(!confirm("This feature is meant to fix old account data from past versions\nThis will ask for a LOT of confirmations\nYOUR PASSWORDS CAN BE DISPLAYED ON SCREEN, WATCH YOUR BACK!!!\nPress OK to begin")){
			return;
		}
		log('Reading account data');
		try{
			var ids=JSON.parse(await GM.getValue('accounts','{}'));
		}
		catch(e){
			return alert('Error:\n\t'+e);
		}
		var updateLegacy={},id,user,pass;
		for(var i in ids){
			id=parseInt(i);
			updateLegacy['+'+id]=ids[i];// using +123456 makes it manually sortable
			if(ids[i].name==unescape(ids[i].name)){
				user=ids[i].name;
			}
			else{
				user=confirm("The Username for account #"+id+' is:\n   '+
					unescape(ids[i].name)+
					'\n Not:\n   '+ids[i].name);
				user=user?unescape(ids[i].name):ids[i].name;
			}
			updateLegacy['+'+id].name=user;
			if(ids[i].pass!='' && ids[i].pass!=unescape(ids[i].pass)){
				pass=confirm("The Password for "+user+' is:\n   '+
					unescape(ids[i].pass)+
					'\n Not:\n   '+ids[i].pass);
				updateLegacy['+'+id].pass=pass?unescape(ids[i].pass):ids[i].pass;
			}
			log('Account '+i+' is now +'+parseInt(i));
		}
		console.log(JSON.stringify(updateLegacy));
		log('Data converted');
		await GM_updateIds(oldId,updateLegacy);
	}
	else if(newId=='getDaily'){
		global.daily=Array();
		global.dailyId=[
			{"id":1,"name":"Home"},
			{"id":2,"name":"MyGaia"},
			{"id":3,"name":"Forums"},
			{"id":4,"name":"Games"},
			{"id":5,"name":"World"},
			{"id":8,"name":"Shops"},
			{"id":12,"name":"Mobile App"}, //returns HTML not XML
			{"id":1271,"name":"GoFusion"},
			{"id":1279,"name":"GCash"}
		];
		global.dailyTime=0;
		global.dailyDivider="\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n";
		global.dailyTimeout=setTimeout(function(){
			alert("Daily Chance Timeout:\nI never got a reply for one or more chances\n\n"+global.daily.join(global.dailyDivider)+global.dailyDivider.substr(0,global.dailyDivider.length-1));
		},12500);
		global.daily.push("\t\t\t\tDaily Chances");
		if(!global.dailyDive){
			global.dailyOpt=document.evaluate('.//select[@id="gmSelectLogin"]/optgroup[@label="Utilities"]/option[@value="getDaily"]',document,null,9,null).singleNodeValue;
			global.dailyOpt.disabled='disabled';
		}
		for(var i=0,max=global.dailyId.length;i<max;i++){
			(async function(i){
				GM.xmlHttpRequest({
					method: "GET",
					url: "http://www.gaiaonline.com/dailycandy/?mode=ajax&action=issue&list_id="+global.dailyId[i]["id"],
					onload: function(response){
						global.daily.push(readDailyData(response.responseText,i));
					},
					onerror: function(response){
						global.daily.push("Something when wrong getting data\nYou may or may have not got something\n"+(response.status!=200)?"I got a "+((response.status==Null)?"timeout":response.status)+" error":"Gaia said \""+response.responseText.slice(response.responseText.indexOf('<message>')+9,response.responseText.indexOf('</message>'))+"\" on "+global.dailyId[i]["name"]);
					}
				});
			})(i);
		}
		setTimeout(function(){
			dailyCandy();
		},2500);
	}
	else if(newId=='dumpsterDive'){
		global.diveTimeout=setTimeout("alert('Dumpster Dive Timeout:\\nNever got a reply from gaia.')",10000);
		if(!global.dailyDive){
			global.diveOpt=document.evaluate('.//select[@id="gmSelectLogin"]/optgroup[@label="Utilities"]/option[@value="dumpsterDive"]',document,null,9,null).singleNodeValue;
			global.diveOpt.disabled='disabled';
		}
		GM.xmlHttpRequest({
			method: "GET",
			url: "http://www.gaiaonline.com/dumpsterdive?mode=showConfirmed&time="+parseInt(new Date().getTime()/1000),
			onload: function(response){
				var trash=response.responseText;
				if(trash.slice(trash.indexOf('<div id="grant_granted">')+24,trash.indexOf('</div></div></div><form'))=="Pete looks a little crazy XD, maybe if you try later..."){
					clearTimeout(global.diveTimeout);
					var str="Pete looks a little crazy XD, maybe if you try later...";
					if(global.dailyDive)
						global.dailyDive=str;
					else{
						alert(str);
						global.diveOpt.removeAttribute("disabled");
					}
				}
				else{
					clearTimeout(global.diveTimeout);
					if(trash.indexOf('<title>DC Error | Gaia Online</title>')>-1){
						var N="DC Error";
						var M=trash.slice(trash.indexOf('<div id="errorMessage" class="errorMessage">')+44);
						M=M.replace(/[(\n\t\r]/g,'');
					}
					else{
						var N=trash.slice(trash.indexOf('<div id="grant_text1">')+22,trash.indexOf('</div><div id="grant_text2">'));
						var M=trash.slice(trash.indexOf('<div id="grant_text2">')+22);
					}
					M=M.slice(0,M.indexOf('</div>'));
					if(global.dailyDive)
						global.dailyDive="Dumpster:\n\t"+N+"\n\t"+M;
					else{
						alert(N+"\n"+M);
						global.diveOpt.removeAttribute("disabled");
					}
				}
			},
			onerror: function(response){
				clearTimeout(global.diveTimeout);
				var str="Something when wrong in the dumpster\nYou may or may have not got something\n"+(response.status!=200)?"I got a "+((response.status==Null)?"timeout":response.status)+" error":"I got something from gaia but idk what it is @.@";
				if(global.dailyDive)
					global.dailyDive=str;
				else{
					alert(str);
					global.diveOpt.removeAttribute("disabled");
				}
			}
		});
	}
	else if(newId=='theDailyDive'){ // Will need update if more utilities are added
		if(!document.evaluate('.//select[@id="gmSelectLogin"]/optgroup[@label="Utilities"]/option[disabled="disabled"]',document,null,9,null).singleNodeValue){
			global.utils=document.evaluate('.//select[@id="gmSelectLogin"]/optgroup[@label="Utilities"]',document,null,9,null).singleNodeValue;
			global.utils.disabled="disabled";
			global.dailyDive=true;
			await GM_selectChange('getDaily',oldId,nonce);
			await GM_selectChange('dumpsterDive',oldId,nonce);
		}
		else{
			alert('I think you are trying to make a error happen.\n'+
				'Too bad for you anticipated this one.\nmua ahahah\n\n'+
				'A daily or dive appears to be in progress running a second grab while one is in progress can screw things up.');
		}
	}
	else{
		log("Switching accounts");
		try{
			var nameSpace=document.getElementsByClassName('avatarName')[0].childNodes[0];
		}
		catch(e){
			var nameSpace=getId('GM_message');
			nameSpace.parentNode.className='on';
		}
		var newName=getId('gmSelectLogin');
		nameSpace.parentNode.className+=' logout';
		nameSpace.textContent='Logging '+nameSpace.getAttribute('name')+' out.';
		function addFrame(){
			log('Adding sub page from:\n'+document.location.href);
			var GM_ele=document.createElement("embed");
			GM_ele.setAttribute('style','width:0px;height:0px;border:none;');
			//GM_ele.src=location.protocol+"//"+document.domain+"/auth/login/?username="+newId;
			GM_ele.src="/auth/login/?username="+newId+'&redirect='+document.location.pathname+document.location.search;
			document.body.appendChild(GM_ele);
			log('Page added, a new instance of this script will handle the login process');
		}
		function sleep(ms){
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		timeout=false;
		(async function(){
			await sleep(10000);
			if(timeout)
				return;
			alert("I think you waited long enough...\nNow assuming you are logged out");
			addFrame();
		})(); // wait 10 seconds 
		log('Logging out');
		GM.xmlHttpRequest({
			method: "GET",
			url: location.protocol+"//"+document.location.hostname+"/auth/logout/?user_id="+oldId+'&nonce='+nonce,
			onload: async function(){
				log('Logged out');
				nameSpace.textContent='Logging '+newName.options[newName.selectedIndex].text+' in.';
				timeout=true;
				log('Wait 0.5 seconds');
				await sleep(500);
				log('Wait over');
				addFrame();
			},
			onerror: function(){
				alert('[Loading Error]\nUn-able to confirm logout');
			}
		});
		return;
	}
	getId('gmSelectLogin').selectedIndex=0;
	return;
}
function dailyCandy(){
	if(typeof global.dailyDive=='string'){
		global.daily.push(global.dailyDive);
		global.dailyDive=true;
	}
	if(global.daily.length==global.dailyId.length+(global.dailyDive?2:1)){
		clearTimeout(global.dailyTimeout);
		alert(global.daily.join(global.dailyDivider)+global.dailyDivider.substr(0,global.dailyDivider.length-1));
		var cart=getId("dailyReward");
		if(cart)
			cart.style.display='none';
		if(global.dailyDive){
			delete(global.dailyDive);
			global.utils.removeAttribute("disabled");
		}
		else
			global.dailyOpt.removeAttribute("disabled");
	}
	else{
		setTimeout(function(){
			dailyCandy();
		},2500);
	}
}
function readDailyData(str,l){
	l=global.dailyId[l]["name"];
	if(str.substr(0,6)=='<html>'){
		if(str.match('name="status" value="error"')){
			return l+" daily reward was already claimed for today.";
		}
		else{
			var p=str.slice(str.indexOf('name="name" value="')+19);
			p=p.substr(0,p.indexOf('" />'));
			if(str.match('name="message" value=""')){
				return l+":\n\t"+p;
			}
			else{
				l+=":\n\t"+p;
				p=str.slice(str.indexOf('name="message" value="')+22);
				p=p.substr(0,p.indexOf('" />'));
				return l+"\n\t"+m;
			}
		}
	}
	else{
		if(str.slice(str.indexOf('<message>')+9,str.indexOf('</message>'))=="The daily reward was already claimed for today."){
			return l+" daily reward was already claimed for today.";
		}
		else if(str.indexOf('<status>error</status>')>-1){
			var m=str.slice(str.indexOf('<message>')+9,str.indexOf('</message>'));
			return l+":\n\t"+m;
		}
		else{
			var n=str.slice(str.indexOf('<name>')+6,str.indexOf('</name>'));
			//var t=str.slice(str.indexOf('<tier>')+6,str.indexOf('</tier>'));
			var m=str.slice(str.indexOf('<tier_message>')+14,str.indexOf('</tier_message>'));
			//return n+" * "+t+"\n"+m;
			return l+":\n\t"+n+"\n\t"+m;
		}
	}
}
var n,cId,nonce,
	url=document.location.href,
	global={};
log('Gaia Online Mule Tool V2, running on '+url);
(async function(){
if(url.indexOf('gaiaonline.com/auth/login/?username=')!=-1){
	log('Found login page');
	await GM_Login(getURL('username'));
}
else{
	try{
		n=0;
		try{ // clean crap next to username
			var ele=document.getElementsByClassName('avatarName')[0];
			ele.removeChild(ele.childNodes[0]);
			ele=ele.childNodes[0];
			var name=ele.textContent;
			name=name.slice(0,name.length-1);
			ele.textContent=name;
			ele.setAttribute('name',name);
		}
		catch(e){
			var l=document.createElement('li');
			l.innerHTML='<span id="GM_message"></span>';
			var t=getId('header_right');
			t.insertBefore(l,t.childNodes[0]);
		}
		try{
			cId=findEle('.//a[@title="Logout from your Gaia account"]',9);
			cId.id="gmSelectLogin";
			cId=cId.href;
			cId=cId.substr(cId.indexOf('?'));
			nonce=getURL('nonce',cId);
			cId=getURL('user_id',cId);
		}
		catch(e){
			try{
				cId=document.getElementsByClassName('panel_mygaia_profile')[0].getElementsByTagName('a')[0].href;
				cId=cId.substr(cId.indexOf('?'));
				nonce=getURL('nonce',cId);
				cId=getURL('user_id',cId);
				if(isNaN(cId)){
					makeError();
				}
			}
			catch(e){
				try{
					cId=findEle('//ul[@id="header_right"]//a[contains(@href,"/auth/logout/")]',9);
					cId.id="gmSelectLogin";
					cId=cId.href;
					cId=cId.substr(cId.indexOf('?'));
					nonce=getURL('nonce',cId);
					cId=getURL('user_id',cId);
				}
				catch(e){
					cId=false;
					nonce=false;
				}
			}
		}
		log('Current User ID: '+cId);
		log('Current Nonce: '+nonce);
	}
	catch(e){ // not signed in or on game page
		log('No user data found');
		if(getId("memberloginForm")){
			log('Found a login form');
			var accounts='';
			try{
				log('Reading account data');
				var ids=JSON.parse(await GM.getValue("accounts","{}"));
				for (var i in ids){
					accounts+='<option value="'+parseInt(i)+'">'+ids[i]["name"]+'</option>';
				}
				log('Account list HTML generated');
			}
			catch(e){
				log('No stored account data');
			}
			if(accounts){
				log('Replacing username field with drop down menu');
				var usrN,
					usrR=getId('usernamerow'),
					original=usrR.innerHTML,
					usrP=getId('password'),
					usrA=getId('autologin');
				usrR.innerHTML='<select id="username" name="username"><option value="">Please select...</option>'+accounts+'<option value="other">Other</option></select>';
				log('Username field replaced');
				usrN=getId('username');
				usrN.addEventListener('change',function(e){
					log('Username selected');
					if(usrN.value=='other'){
						log('Removing drop down menu');
						usrR.innerHTML=original;
						usrP.value='';
						usrP.className="header-login-input-password header-login-input-password-default textbox";
						usrA.value=false;
					}
					else if(usrN.value!=''){
						log('Filling out form');
						var arr=ids['+'+usrN.value];
						usrP.value=arr["pass"];
						usrP.className="header-login-input-password textbox";
						usrA.checked=arr["auto"];
					}
					else{
						log('No account selected');
						usrP.value='';
						usrA.value=false;
						usrP.className="header-login-input-password header-login-input-password-default textbox";
					}
				},false);
				usrP.value='';
				log('Drop down menu is functional');
			}
		}
		else{
			log('This seems like a game page');
		}
	}
	if(cId){
		log('Generating Primary User Interface');
		await insertUserInverface(cId);// while to could make this faster and not use await here, it makes the logging message flow better
		var txt,p
		if(url.indexOf('login_success=')!=-1){
			txt="Welcome back"; // Placed before username if you just logged in
		}
		else{
			txt="Logged in as"; //Placed before username if did did not just login
		}
		try{
			p=findEle('.//div[@class="hud-stats hud hud-sprite"]',9).offsetWidth-175;
		}
		catch(e){
			p=0;
		}
	}
	log('Adding style sheet to page');
	var css=document.createElement('style');
	css.type="text/css";
	css.textContent="\n"+
		"#gmSelectLogin{\n"+
		"	font-size:7pt !important;\n"+
		"	padding:0px;\n"+
		"	height:17px;\n"+
		"	width:87px;\n"+
		"}\n"+
		"#gmSelectLogin .GM_indent{\n"+
		"	padding-left:16px;\n"+
		"	padding-right: 1px;\n"+
		"}\n"+
		"#GM_tableClose{\n"+
		"	width:30px;\n"+
		"	height:30px;\n"+
		"	padding-top: 2px;\n"+
		"	padding-bottom:2px;\n"+
		"	font-size:25px;\n"+
		"	border:1px solid black;\n"+
		"	font-family:courier,monospace;\n"+
		"	cursor:pointer;\n"+
		"	float:right;\n"+
		"	color:black;\n"+
		"	text-align:center;\n"+
		"	border-radius:10px;\n"+
		"	margin:5px 5px 0 0;\n"+
		"}\n"+
		"#GM_popupDiv{\n"+
		"	height:100%;\n"+
		"	width:100%;\n"+
		"	position:fixed;\n"+
		"	top:0;\n"+
		"	left:0;\n"+
		"	z-index:99998;\n"+
		"	background-color:#EDEDED;\n"+
		"	background-color:-moz-dialog;\n"+
		"}\n"+
		"#GM_div4Table{\n"+
		"	overflow: auto;\n"+
		"	margin:auto;\n"+
		"	position:absolute;\n"+
		"	top:0;\n"+
		"	left:0;\n"+
		"	right:0;\n"+
		"	bottom:0;\n"+
		"	display:inline-table;\n"+
		"}\n"+
		"#GM_accountTable{\n"+
		"	margin-left:auto;\n"+
		"	margin-right:auto;\n"+
		"	margin-bottom:2px;\n"+
		"}\n"+
		"#GM_div4Table #GM_accountTable input{\n"+
		"	border:none;\n"+
		"	background-color:inherit;\n"+
		"}\n"+
		"#GM_div4Table #GM_accountTable span{\n"+
		"	text-decoration:underline;\n"+
		"	cursor:pointer;\n"+
		"}\n"+
		"#gaia_header .header_content .userName li{\n"+
		"	max-width:none;\n"+
		"}\n"+
		"table#GM_accountTable{\n"+
		"	border-collapse:separate;\n"+
		"	border-spacing:2px;\n"+
		"}\n"+
		"#GM_accountTable h3{\n"+
		"	margin:0px;\n"+
		"}\n"+
		"#GM_accountTable th,#GM_accountTable td{\n"+
		"	border-width:1px;\n"+
		"	border-style:inset;\n"+
		"}\n"+
		"#GM_accountTable .GM_account:nth-child(2n){\n"+
		"	background-color:white;\n"+
		"}\n"+
		"#GM_accountTable .GM_account:nth-child(2n+1){\n"+
		"	background-color:lightgray;\n"+
		"}\n"+
		".avatarName:not(.logout):before{\n"+
		"	content: '"+txt+" ';\n"+//places text before username
		"}\n"+
		".avatarName:not(.logout) > span:after{\n"+
		"	content: '!';\n"+//places text after username
		"}\n"+
		".avatarName{\n"+
		"	margin-left:10px;\n"+
		"\n}"+
		"p > select#username{\n"+
		"	width:180px;\n"+
		"	background-image:none;\n"+
		"}\n"+
		"p.form-row-username > select#username{\n"+
		"	width:172px;\n"+
		"}\n"+
		".header_content > .userName .avatarName{\n"+
		"	min-width:"+p+"px;\n"+
		"}\n"+
		/*"#gaia_header #header_right li:nth-last-child(-n+1):before{\n"+
		"	content:'| ';\n"+
		"}\n"+*/
		"#gaia_header #header_right select:focus{\n"+
		"	margin-right:33px;\n"+
		"}\n"+
		"#gaia_header #header_right li.on:after{\n"+
		"	content:' |';\n"+
		"}\n"+
		"#gaia_header #header_right #GM_message{\n"+
		"	font-weight:bold;\n"+
		"	color:#CCCCCC;\n"+
		"}\n"+
		"#Message iframe, #Message embed{\n"+
		"	display:none;\n"+
		"}\n"+
		"#user_dropdown_arrow #user_dropdown_menu{\n"+
		"	display:none;\n"+
		"	border-radius:0 0 10px 10px;\n"+
		"	right:0;\n"+
		"	top:15px;\n"+
		"}\n"+
		"#user_account:hover #user_dropdown_menu{\n"+
		"	display:block;\n"+
		"}"+
		// Sort form
		"#GM_popupDiv #GM_div4form{"+
		"	width:460px;"+
		"	margin:auto;"+
		"}"+
		"#GM_popupDiv #GM_div4form ul,#GM_popupDiv #GM_div4form li{"+
		"	list-style:none;"+
		"}"+
		"#GM_popupDiv #GM_div4form form{"+
		"	margin-bottom:0;"+
		"}"+
		"#GM_popupDiv #GM_div4form form ul{"+
			"	padding-left:40px;"+
		"}"+
		"#GM_popupDiv #GM_div4form form > ul{"+
		"	margin:0;"+
		"	padding-left:0;"+
		"}"+
		"#GM_popupDiv #GM_div4form sup{"+
		"	line-height:1em;"+
		"}"+
		'#GM_popupDiv #GM_div4form input[type="button"]{'+
		"	float:right;"+
		"}"+
	"\n";
	findEle('//head',9).appendChild(css);
	log('Main page load process complete');
}
})();