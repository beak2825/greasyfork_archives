// ==UserScript==
// @name           Chaturbate Clean
// @description    removes all add's, sub-selector on the tab's, shows video if you have no access, full screen with chat
// @version 1.6
// @namespace      chaturbate_goes_ladroop
// @include        https://chaturbate.com/*
// @include        https://*.chaturbate.com/*
// @grant          GM_xmlhttpRequest
// @grant          GM_info
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/17622/Chaturbate%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/17622/Chaturbate%20Clean.meta.js
// ==/UserScript==

function do_script() {

	if (window.top != window.self){return} // Don't run in iframes
 
	version = Number(GM_info.script.version);

// check for updates once per session 5 seconds after load
	if (!readCookie("updatecheck")){
		setTimeout(function(){update()}, 5000);	
	}

// use unused add space
	ad = document.getElementsByClassName('ad');
	verstr='<strong>Chaturbate Clean V'+version.toFixed(1)+' Made by Ladroop.</strong> <br>';
	if (ad[0]){ad[0].innerHTML=verstr}

// advert options on menu bars - only save "login", "main", "broadcast", "tags" and "my collection"
	bar=document.getElementById("nav");
	if (bar){
		barl=bar.getElementsByTagName('li');
		i=barl.length-1;
		while (i != -1){
			d=barl[i].innerHTML;
			if ((d.indexOf('/login') != -1)||(d.indexOf('href="/"') != -1)||(d.indexOf('href="/b/') != -1)||(d.indexOf('/my_') != -1)||(d.indexOf('/tags') != -1)){i--}
			else{barl[i].parentNode.removeChild(barl[i]);i--}
	}	}

// blog spam
	ad = document.getElementsByClassName('featured_blog_posts')[0];
	if (ad){ad.parentNode.removeChild(ad)}

// footer spam
	ad = document.getElementsByClassName('featured_text')[0];
	if (ad){ad.parentNode.removeChild(ad)}

// announcement banner (if present)
	ad = document.getElementsByClassName('top-section')[0];
	if (ad){
		ad = ad.getElementsByTagName('img')[0];
		if (ad){ad.parentNode.removeChild(ad)}
	}

// advanced search
	if((document.location.href.indexOf("spy-on-cams")==-1)&&(document.location.href.indexOf("followed-cams")==-1)&&(document.location.href.indexOf("/tag")==-1)){
	if (document.getElementsByClassName('c-1 endless_page_template')[0]){
		if (document.getElementsByClassName('sub-nav')[0]){
		newli=document.createElement('li');
		data='<form><select onchange=\'loc=document.location.href.split("/");pos=loc[0]+"/"+loc[1]+"/"+loc[2]+this.options[this.selectedIndex].value;document.location.href=pos;\' style="margin: 0px 0px 0px 0px; background: #DDE9F5; color:#5E81A4; border-radius: 4px 4px 0px 0px;padding: 3px 1px 4px 12px; font-weight: 400; font-size: 13px; font-family: \'UbuntuMedium\',Arial,Helvetica,sans-serif;" >'
		+'<option value="/XX-cams">ALL CAMS IN CATEGORY</option>'
		+'<option value="/exhibitionist-cams/XX">EXHIBITIONIST CAMS</option>'
		+'<option value="/hd-cams/XX">HD CAMS</option>'
		+'<option value="/teen-cams/XX">TEEN CAMS (18+)</option>'
		+'<option value="/18to21-cams/XX">18 TO 21 CAMS</option>'
		+'<option value="/21to35-cams/XX">21 TO 35 CAMS</option>'
		+'<option value="/30to50-cams/XX">30 TO 50 CAMS</option>'
		+'<option value="/mature-cams/XX">MATURE CAMS (50+)</option>'
		+'<option value="/north-american-cams/XX">NORTH AMERICAN CAMS</option>'
		+'<option value="/euro-russian-cams/XX">EURO RUSSIAN CAMS</option>'
		+'<option value="/south-american-cams/XX">SOUTH AMERICAN CAMS</option>'
		+'<option value="/philippines-cams/XX">PHILIPPINES CAMS</option>'
		+'<option value="/asian-cams/XX">ASIAN CAMS</option>'
		+'<option value="/other-region-cams/XX">OTHER REGION CAMS</option>'
		+'<option value="/6-tokens-per-minute-private-cams/XX">6 TOKENS PER MINUTE</option>'
		+'<option value="/12-tokens-per-minute-private-cams/XX">12 TOKENS PER MINUTE</option>'
		+'<option value="/18-tokens-per-minute-private-cams/XX">18 TOKENS PER MINUTE</option>'
		+'<option value="/30-tokens-per-minute-private-cams/XX">30 TOKENS PER MINUTE</option>'
		+'<option value="/60-tokens-per-minute-private-cams/XX">60 TOKENS PER MINUTE</option>'
		+'<option value="/90-tokens-per-minute-private-cams/XX">90 TOKENS PER MINUTE</option>'
		+'</select></form>';
		uloc=document.location.href+"//////";
		loc=uloc.split("/");
		check=loc[3]+loc[4];
		gen="";
		if(check.indexOf("male") != -1){gen="male"}
		if(check.indexOf("female") != -1){gen="female"}
		if(check.indexOf("couple") != -1){gen="couple"}
		if(check.indexOf("transsexual") != -1){gen="transsexual"}
		re=/XX/gi;
		data=data.replace(re,gen);
		if (gen === ""){data=data.replace("-cams","")}
		data=data.replace('<option value="/'+loc[3],'<option selected value="/'+loc[3]);
		newli.innerHTML=data;
		tabs=document.getElementsByClassName('sub-nav')[0].getElementsByTagName("li");
		if (loc[4]!==""){
			for (n=0; n<tabs.length-1; n++){
				tabs[n].className="";
				if (tabs[n].getElementsByTagName("a")[0].href.indexOf("/"+loc[4])!=-1){
					tabs[n].className="active";
				}
			}
		}
		document.getElementsByClassName('sub-nav')[0].appendChild(newli);
	}}}

// remove out of position images on profiles
	container = document.getElementById("tabs_content_container");
	if (container){
		bar=document.getElementById("nav");
		newli=document.createElement('li');
		newli.innerHTML='<a href=# id="clean"></a>';
		bar.appendChild(newli);
		document.getElementById("clean").addEventListener("click", cleancookie);
		cleanup();
	}	

// remove lock pictures from thumbs on profiles
	pictures = document.getElementsByClassName('preview');
	if (pictures){
		for (i=0; i<pictures.length; i++){
			if(pictures[i].getAttribute("alt") =="Locked"){
				pictures[i].parentNode.removeChild(pictures[i]);
	}	}	}

//fix external links redirection
	var link = document.getElementsByTagName('a');
	for (i=0; i<link.length; i++){
		if (link[i].href.indexOf('?url=') != -1){
			linkhref=unescape(link[i].href);
			newlinkhref=linkhref.substring(linkhref.indexOf("?url=")+5,linkhref.indexOf("&domain"));
			link[i].href=newlinkhref;
	}	}

//check if there is video and save player version and also save video server so we are sure we have a server that's not down 
	video=document.getElementById("xmovie");
	if (video){
		flashver=video.getAttribute("data");
		createCookie("cbver",flashver,1);
		parms=document.getElementsByName("FlashVars")[0];
		fvar=parms.getAttribute('value');
		fvars=fvar.split("&");
		for (i=0; i<fvars.length; i++){
			if (fvars[i].indexOf("address=")!=-1){
				server=fvars[i].split("=")[1];
				createCookie("cbserver",server,1);
		}	}
	
// if there is video make full screen with chat button
	var newli = document.createElement('li');
	newli.innerHTML="<div class='button_share'> <a href=#>FULL SCREEN WITH CHAT</a></div>";
	newli.addEventListener('click',function(){fullscreenapi();}, false);
	document.getElementsByClassName("socials")[0].appendChild(newli);

// fix app area bug
	apparea=document.getElementsByClassName("tip_shell")[0];
	apparea.style.width="100%";

// add full screen enter/exit handler
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);

// I can not use unsafeWindow in chrome so internal functions are called with an event on some passive element
	document.getElementById("roomtitle").setAttribute('onclick','resizable_player.update_sizes();');
	}

// wait one second and check if you have no access, if not create a new video box and kill all timers 
	setTimeout(function(){
	area = document.getElementsByClassName('block')[0];
	if (area){
		if (area.innerHTML.length < 700){
			splits = document.location.href.split("/");
			bname=splits[3];
			if (bname=="p"){bname=splits[4]}
				newdiv=document.createElement('div');
				newdiv.innerHTML="<br><br>"+videodata1+bname+videodata2;
				area.appendChild(newdiv);
				newscript=document.createElement('script');
				newscript.textContent="for (var i = 1; i < 99999; i++){window.clearInterval(i)}";
				document.getElementsByTagName('body')[0].appendChild(newscript);
		}	}
	}, 1000);
	
}//end main

// videobox data 
// use a saved server form a cookie or else use a random server
// random server should work but sometimes servers are down
	if (!readCookie("cbserver")){
		servers=new Array("","-a","-b");
		server = servers[Math.floor(Math.random()*3)];
		servnr=Math.floor(Math.random()*40)+12;
		cbserver="edge"+servnr+server+".stream.highwebmedia.com";
	}else{cbserver=readCookie("cbserver")}

//get saved player version or else use 2p647 (if they update the old version may stop working)
	if (readCookie("cbver")){
		cbver=readCookie("cbver");
	}else{cbver="/static/flash/CBV_2p647.swf"}

	videodata1='<div id="defchat"style="float:left;margin-left:10px;margin-top:10px;margin-bottom:10px;border-width:5px;border-style:double;resize:both;overflow:hidden;width: 498px; height: 426px; ">'
	+'<object id="xmovie" type="application/x-shockwave-flash" data="'
	+ cbver
	+'" style="visibility: visible;margin-top:0px;margin-bottom:0px;width:100%;height:95%">'
	+'<param name="allowScriptAccess" value="always">'
	+'<param name="allowFullScreen" value="true">'
	+'<param name="quality" value="high">'
	+'<param name="wmode" value="opaque">'
	+'<param name="id" value="movie">'
	+'<param name="FlashVars" value="pid=';
	videodata2='&address='
	+ cbserver
	+'&language=/xml/viewer.xml&mute=1&pr=login_required_true_if_loggedin&sa=0&uid=lickmysaltyballs&jg=$.mydefchatconn(\'join_group_show\')&jp=$.mydefchatconn(\'spy_on_private\')&js=registration_required()&elu=&dom=chaturbate.com&pw=pbkdf2_sha256%2415000%24GxciLen2qDN3%24tS7Ga0zEfVnIfJCQJGimmT5N/RtXtucUXoKQtUr/7Yg%3D&rp=0&tv=100&cv=100">'
	+'</object></div>';

// to remove or restore floating images on a profile according to cookie
	function cleanup(){
		var taglist=new Array("a","p","i","strong","b","u","ul","ol","li","h1","h2","h3","img","font","br");
		claction=readCookie("pclean");
		if (!claction){
			document.getElementById("clean").innerHTML= "CLEAN PROFILE = <font color=#00AA00>ON</font>";
		}else{
			document.getElementById("clean").innerHTML= "CLEAN PROFILE = <font color=#DC5500>OFF</font>";
		}
		for (n=0; n<taglist.length-1; n++){
			if (!claction){
				blockelm (taglist[n]);
			}else{
				unblockelm (taglist[n]);
	}	}	}

	function blockelm(tag){
		image = container.getElementsByTagName(tag);
		for (i=0; i<image.length; i++){
			if (image[i].style.position){
				if ((image[i].style.position.indexOf("absolute")!=-1)||(image[i].style.position.indexOf("fixed")!=-1)){
					image[i].setAttribute("ostyle", "1");
					image[i].style.display="none";
	}	}	}	}

	function unblockelm(tag){
		image = container.getElementsByTagName(tag);
		for (i=0; i<image.length; i++){
			if (image[i].style.position){
				if (image[i].getAttribute("ostyle")){
					image[i].style.display="block";
	}	}	}	}


// swap cleanup cookie and cleanup
	function cleancookie(){
		if (readCookie("pclean")){
			eraseCookie("pclean");
		}else{
			createCookie("pclean",1,30)}
		cleanup();
	}

// full screen function
	function fullscreenapi(){
		eraseCookie("isfullscreen"); // just in case
		elem = document.getElementById("defchat").getElementsByClassName("section")[0];
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	}

//full screen enter/exit handler
	function exitHandler(){ 
	    if (readCookie("isfullscreen")){ //exit
			eraseCookie("isfullscreen"); 
			document.getElementById("player").style.width=orgplayerw+"px";
            document.getElementById("player").style.height=orgplayerh+"px";
            elem.style.width="";
			createCookie("player_width",orgplayerw,1);
       		sizeadj();
		}
		else{ //enter
			createCookie("isfullscreen","1",1);
			orgplayerw=parseInt(document.getElementById("player").style.width);
    		orgplayerh=parseInt(document.getElementById("player").style.height);
 			fsplheight=screen.height-110;
			zoom=fsplheight/orgplayerh;
			document.getElementById("player").style.width=orgplayerw*zoom+"px";
            document.getElementById("player").style.height=fsplheight+"px";
            elem.style.width=screen.width+"px";
			sizeadj();
		}
	}

//auto clicker player resize
	function sizeadj() {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent("click", true, false);
		document.getElementById("roomtitle").dispatchEvent(evt);
	} 

// update function (if script is from an other place then sleazyfork and that place is down or not updated)
	function update(){
		createCookie("updatecheck","1",1);
		infolink= "https://greasyfork.org/scripts/6795-chaturbate-clean.json";
		GM_xmlhttpRequest({
			method: 'GET',
			url: infolink,
			onload: function(response) {
			data = response.responseText;
			nversion=Number(JSON.parse(data).version);
			if (nversion>version){
				upurl=JSON.parse(data).code_url;
				if (confirm("There is a new version of the chaturbate script available. Do you want to install it?")){
					window.open(unescape(upurl), '_top')}
				}
			}
		});
	}

// cookie functions
	function createCookie(name,value,days,domain){
	if (domain){
	var domain=";domain=."+domain;
	}else var domain = "";
	if (days) {
	var date = new Date();
	date.setTime(date.getTime()+(days*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
	}else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/"+domain;
	}

	function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
	var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
	}

	function eraseCookie(name,domain){
	createCookie(name,"",-1,domain);
	}

window.addEventListener("DOMContentLoaded", function() { do_script() }, false);

// to skip agree screen
	createCookie("agreeterms","1",30);
// this cookie removes most add's
	if (!readCookie("noads")){createCookie("noads","1",30);window.location.reload(true)}
// notice and rotating add
	createCookie("np3","0",1);
	createCookie("dsmn53","1",1);
	createCookie("dsmn54","1",1);
	createCookie("dsmn55","1",1);
	createCookie("dsmn56","1",1);

//.user.js

