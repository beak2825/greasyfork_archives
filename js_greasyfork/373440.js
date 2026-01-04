// ==UserScript==
// @name           Chaturbate Clean
// @description    removes all add's, sub-selector on the tab's, shows video if you have no access, full screen with chat
// @version        3.3
// @namespace      chaturbate_goes_ladroop
// @match          https://*.xvcams.com/*
// @exclude        https://blog.xvcams.com/*
// @exclude        https://secure.xvcams.com/*
// @exclude        https://*.xvcams.com/apps/*
// @exclude        https://*.xvcams.com/tipping/*
// @exclude        https://*.xvcams.com/embed/*
// @exclude        https://*.xvcams.com/accounts/welcome/*
// @noframes
// @grant          none
// @run-at         document-end
// @license	       MIT
// @copyright      2018, ladroop (https://sleazyfork.org/nl/users/7390-ladroop)
// @downloadURL https://update.greasyfork.org/scripts/373440/Chaturbate%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/373440/Chaturbate%20Clean.meta.js
// ==/UserScript==



(function() {
    'use strict';

//prevents the script from throwing errors to CB's own error logger and maybe some part of the script keeps working if they make changes again
window.onerror=function(){return true;};

// to skip agree screen
	createCookie("agreeterms","1",30);
// this cookie removes most add's
	if (!readCookie("noads")){createCookie("noads","1",30);window.location.reload(true);}
// initial player size
    if (!readCookie("player_width")){createCookie("player_width","640",1);}

// locations
var thumbpage=false;
var campage=false;
var theaterpage=false;
var banpage=false;
var broadcastpage=false;
var passwordpage=false;
var colpage=false;
var bio=false;
var bioarea="";//bio area
var varea="";// video area
var elem="";//full screen area
var HLS="";//hls video link
// used in multiple functions
var ad="";
var tags="";
var newelem="";
var n=0;
var i=0;
var p=0;
var br="";
var ofils="";
// for full screen
var isfullscreen=false;
var myfullscreen=false;
var orgplayerw=0;
var orgplayerh=0;
// for greasemonkey
var win = window.wrappedJSObject ? window.wrappedJSObject : window;
// used by drag slider window
var pos1=0, pos2=0, pos3=0, pos4=0, x=0, y=0;
// install theater mode script too
var thcleanurl="https://openuserjs.org/install/ladroop/cb_theatermode_clean.user.js";

// first check where we are and set some locations
// theaterpage , thumbnail page , online cam page (bio + cam), offline cam page or /p/ (only bio), you're banned page, broadcast page, my collection page, password page

    if (document.title == "Chaturbate Theater Mode"){
        theaterpage=true;
    }
    if (document.location.href.split("/")[3]=="b"){
        broadcastpage=true;
    }
    if (document.location.href.split("/")[3]=="roomlogin"){
        passwordpage=true;
    }
    if ((document.location.href.split("/")[3]=="photo_videos")||(document.location.href.split("/")[3]=="my_collection")){
        if (document.getElementById("player")){
            colpage=true;
        }
    }
    if ((document.getElementsByClassName('c-1 endless_page_template')[0])||(document.getElementsByClassName('tag_row')[0])||(document.getElementsByClassName('list followers')[0])){
        thumbpage=true;
    }
    if (document.getElementsByClassName('bio')[0]){
        bioarea=document.getElementsByClassName('bio')[0];
        bio=true;
    }
    if((document.getElementById("player"))&&(!colpage)){
        elem = document.getElementById("defchat").getElementsByClassName("section")[0];
        campage=true;
    }
    if (document.getElementsByClassName('block')[0]){
        if (!document.getElementsByClassName('block')[0].id){
            banpage=true;
        }
    }

// do things on selected pages
    if (theaterpage){
        update();
        return;
    }
    if (colpage){
        std();
        return;
    }
    removeadd();
    if (passwordpage){
        cleanbar();
        return;
    }
    if (thumbpage){
        subsel();
        return;
    }
    if (banpage){
        cleanbar();
        jpgplayer();
        return;
    }
    if (bio){
        cleanbar();
        cleanbutton();
        linkfix();
        imgfix();
        setTimeout(function(){info();}, 500);
    }
    if (broadcastpage){
        cleanbar();
        return;
    }
    if (campage){
        fullscreenbutton();
        getvid();
        getHls();
    }

// functions in random order

// wait till video is initialized and make video controls
    function getvid(){
        if(document.getElementById("xmovie")||document.getElementById("still_video_object_html5_api")){
            if (document.getElementById("xmovie")){
                varea=document.getElementById("xmovie");
            }else{
                varea=document.getElementById("still_video_object_html5_api");
            }
            controlsbutton();
        }else{
            n++;
            if (n==10){
                varea=document.getElementById("player");
                controlsbutton();
                return;
            }
            setTimeout(function(){getvid();}, 100);
        }
    }

// update if theatermode
    function update(){
        setTimeout(function(){
            if (!document.getElementById("update")){
                var newelem=document.createElement('div');
                newelem.style.position="absolute";
                newelem.style.top="10px";
                newelem.style.left="255px";
                newelem.style.fontSize="12px";
                newelem.style.color="#0b5d81";
                newelem.style.fontWeight="bold";
                newelem.id="update";
                newelem.innerHTML="<b>Please install the chaturbate theater mode script made by ladroop.<br> Click <a href='"+thcleanurl+"'> here </a> to install.</b>";
                document.getElementsByTagName("div")[0].appendChild(newelem);
            }
        }, 8000);
    }

//remove the add's
    function removeadd(){
        ad = document.getElementsByClassName('ad')[0];
        if (ad){
            ad.style.zIndex="9999";
            ad.style.position="absolute";
            ad.innerHTML='<strong>Chaturbate Clean V'+GM_info.script.version+' Made by Ladroop.</strong> <br>';
        }
        ad = document.getElementsByClassName('featured_blog_posts')[0];
        if (ad){
            ad.style.display="none";
        }
        ad = document.getElementsByClassName('featured_text')[0];
        if (ad){
            ad.style.display="none";
        }
    }

// save vid
    function std(){
		newelem=document.createElement('a');
		newelem.href=win.playerSettings.videoFile;
        newelem.target="_blank";
		newelem.innerHTML="Right click, save to disk.";
        newelem.style.backgroundColor="white";
        newelem.style.marginLeft="20px";
		document.getElementsByTagName("body")[0].appendChild(newelem);
    }

// get the HLS link
    function getHls(){
        tags=document.getElementsByTagName("script");
        for (n=1; n<tags.length; n++){
            if(!tags[n].src){
                if (tags[n].innerHTML.indexOf(".m3u8")!=-1){
                    HLS="https://"+tags[n].innerHTML.split("src='https://")[1].split(".m3u8")[0]+".m3u8";
                    break;
                }
            }
        }
    }

// options on menu bar on a cam page , only show link to main page, broadcast link in a new tab except on broadcast page and login, other links can still be found on the thumb pages
    function cleanbar(){
        tags=document.getElementById("nav").getElementsByTagName('li');
        for (n=1; n<tags.length; n++){
            if ((tags[n].getElementsByTagName("a")[0].href.split("/")[3]=="b")&&(document.location.href.split("/")[3]!="b")){
                tags[n].getElementsByTagName("a")[0].target="_blank";
            }else{
                if (tags[n].getElementsByTagName("a")[0].href.indexOf('/login') == -1){
                    tags[n].style.display="none";
                }
            }
            if (tags[n].getElementsByTagName("a")[0].href.split("/")[3]=='tags'){
                if (readCookie("selected")){
                    tags[n].style.display="block";
                    tags[n].getElementsByTagName("a")[0].href=readCookie("selected");
                    tags[n].getElementsByTagName("a")[0].innerHTML="BACK";
                }
            }
        }
    }

// make a subselector on a thumbpage
    function subsel(){
        createCookie("selected",document.location.href,1);
        if((document.location.href.indexOf("spy-on-cams")==-1)&&(document.location.href.indexOf("followed-cams")==-1)&&(document.location.href.indexOf("/tag")==-1)){
            newelem=document.createElement('li');
            var data='<form><select id="subsel" style="margin: 0px 0px 0px 0px; background: #DDE9F5; color:#5E81A4; border-radius: 4px 4px 0px 0px;padding: 3px 1px 4px 12px; font-weight: 400; font-size: 13px; font-family: \'UbuntuMedium\',Arial,Helvetica,sans-serif;" >'+
                '<option value="/XX-cams">ALL CAMS IN CATEGORY</option>'+
                '<option value="/exhibitionist-cams/XX">EXHIBITIONIST CAMS</option>'+
                '<option value="/hd-cams/XX">HD CAMS</option>'+
                '<option value="/new-cams/XX">NEW CAMS</option>'+
                '<option value="/teen-cams/XX">TEEN CAMS (18+)</option>'+
                '<option value="/18to21-cams/XX">18 TO 21 CAMS</option>'+
                '<option value="/21to35-cams/XX">21 TO 35 CAMS</option>'+
                '<option value="/30to50-cams/XX">30 TO 50 CAMS</option>'+
                '<option value="/mature-cams/XX">MATURE CAMS (50+)</option>'+
                '<option value="/north-american-cams/XX">NORTH AMERICAN CAMS</option>'+
                '<option value="/euro-russian-cams/XX">EURO RUSSIAN CAMS</option>'+
                '<option value="/south-american-cams/XX">SOUTH AMERICAN CAMS</option>'+
                '<option value="/asian-cams/XX">ASIAN CAMS</option>'+
                '<option value="/other-region-cams/XX">OTHER REGION CAMS</option>'+
                '<option value="/6-tokens-per-minute-private-cams/XX">6 TOKENS PER MINUTE</option>'+
                '<option value="/12-tokens-per-minute-private-cams/XX">12 TOKENS PER MINUTE</option>'+
                '<option value="/18-tokens-per-minute-private-cams/XX">18 TOKENS PER MINUTE</option>'+
                '<option value="/30-tokens-per-minute-private-cams/XX">30 TOKENS PER MINUTE</option>'+
                '<option value="/60-tokens-per-minute-private-cams/XX">60 TOKENS PER MINUTE</option>'+
                '<option value="/90-tokens-per-minute-private-cams/XX">90 TOKENS PER MINUTE</option>'+
                '</select></form>';
            var	uloc=document.location.href+"//";
            var loc=uloc.split("/");
            var	check=loc[3]+loc[4];
            var gen="";
            if(check.indexOf("male") != -1){gen="male";}
            if(check.indexOf("female") != -1){gen="female";}
            if(check.indexOf("couple") != -1){gen="couple";}
            if(check.indexOf("trans") != -1){gen="trans";}
            data=data.replace(/XX/gi,gen);
            if (gen === ""){data=data.replace("-cams","");}
            data=data.replace('<option value="/'+loc[3],'<option selected value="/'+loc[3]);
            newelem.innerHTML=data;
            document.getElementsByClassName('sub-nav')[0].appendChild(newelem);
            document.getElementById("subsel").addEventListener('change',subselected);
        }
    }

// go to the selected page
    function subselected(){
        document.location.href=document.getElementById("subsel").options[document.getElementById("subsel").selectedIndex].value;
    }

// jpg player for banned rooms and kill all timers
    function jpgplayer(){
        br=document.location.href.split("/")[3];
        if(br=="p"){
            br=document.location.href.split("/")[4];
        }
        newelem=document.createElement('div');
        newelem.setAttribute("style","clear:both;float:left;margin-left:10px;margin-top:10px;margin-bottom:10px;margin-right:200px;border-width:5px;border-style:double;resize:both;overflow:hidden;width: 640px; height: 480px;");
        newelem.innerHTML="<img id='vidimg' src='https://ssl-ccstatic.highwebmedia.com/images/cam_notice_background.jpg' height=100% width=100%></img>";
        newelem.id="vborder";
        document.getElementsByClassName('block')[0].appendChild(newelem);

        p=1;
        var cimg = new Image();

        cimg.onload = function(){
            document.getElementById("vborder").style.borderColor = "green";
            document.getElementById("vidimg").src=cimg.src;
            setTimeout(function(){ cimg.src = 'https://cbjpeg-serve.stream.highwebmedia.com/stream?room='+br+'&f='+ new Date().getTime();p=1;}, 100);
        };

        cimg.onerror = function(){
            document.getElementById("vborder").style.borderColor = "red";
            p++;
            if (p>60){p=60;}
            setTimeout(function(){ cimg.src = 'https://cbjpeg-serve.stream.highwebmedia.com/stream?room='+br+'&f='+ new Date().getTime();}, p*100);
        };

        cimg.src = 'https://cbjpeg-serve.stream.highwebmedia.com/stream?room='+br+'&'+ new Date().getTime();

        for (i = 1; i < 9999; i++){win.clearInterval(i);}
    }

// make a clean profile button and call cleaninit()
    function cleanbutton(){
        newelem = document.createElement('li');
        newelem.style.display="none";
        newelem.id="hclean";
        newelem.innerHTML="<div class='button_share'> <a href=# id='clean' >CLEAN PROFILE = OFF</a></div>";
        newelem.addEventListener('click',cleancookie);
        document.getElementsByClassName("socials")[0].appendChild(newelem);
        cleaninit();
    }

// make a full screen button,exit full screen button, fix html5 video area size bug, app area bug and set full screen handler
    function fullscreenbutton(){
        newelem = document.createElement('li');
        newelem.innerHTML="<div class='button_share'> <a href=#>FULL SCREEN WITH CHAT</a></div>";
        newelem.addEventListener('click',fullscreenapi);
        document.getElementsByClassName("socials")[0].appendChild(newelem);

        newelem = document.createElement('div');
        newelem.id="fsclose";
        newelem.className="button_share";
        newelem.innerHTML="<a href=#>EXIT FULL SCREEN</a>";
        newelem.style.position="absolute";
        newelem.style.borderRadius="4px";
        newelem.style.right="60px";
        newelem.style.marginTop="-40px";
        newelem.style.display="none";
        newelem.addEventListener("click",closeFullscreen);
        document.getElementsByClassName("video-box")[0].appendChild(newelem);

        if (document.getElementById("still_video_object_html5_api")){
            document.getElementById("player").style.height=parseInt(document.getElementById("player").style.height)-32+"px";
            sizeadj();
        }

        document.getElementsByClassName("tip_shell")[0].style.width="100%";

        document.addEventListener('webkitfullscreenchange', exitHandler, false);
        document.addEventListener('mozfullscreenchange', exitHandler, false);
        document.addEventListener('fullscreenchange', exitHandler, false);
    }

// make video controls, set filter
    function controlsbutton(){
        var butstyle="margin-right: 10px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 3px 10px 2px; float: right; border-radius: 4px; cursor: pointer; display: inline;";
        var slistyle="text-align: left; width: 310px;margin-right: 10px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 3px 10px 2px; float: right; border-radius: 4px; display: inline;";

        newelem = document.createElement('li');
        newelem.innerHTML="<div class='button_share'> <a href=#>VIDEO CONTROLS ON/OFF</a></div>";
        newelem.addEventListener('click',vcontrol);
        document.getElementsByClassName("socials")[0].appendChild(newelem);

        newelem=document.createElement('div');
        newelem.id="controls";
        newelem.style.display="none";
        newelem.style.position="absolute";
        newelem.style.backgroundColor="rgb(255, 255, 211)";
        newelem.style.border="2px solid rgb(244, 115, 33)";
        newelem.style.borderRadius="6px";
        newelem.style.width="350px";
        newelem.style.padding="12px";
        newelem.style.marginTop="50px";
        newelem.style.right="320px";
        newelem.style.zIndex="999";
        document.getElementsByClassName("socials")[0].appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="MIRROR VIDEO";
        newelem.addEventListener("click",mirror);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="INVERT VIDEO";
        newelem.addEventListener("click",invert);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="DRAG";
        newelem.style.cursor="move";
        newelem.addEventListener("mousedown",dragMouseDown);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="BRIGHTNESS : <input type='range' id='myRange' min=0 max=200 value=100 style='width: 200px;height: 13px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange").addEventListener("input",badjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="CONTRAST : <input type='range' id='myRange1' min=0 max=200 value=100 style='width: 200px;height: 13px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange1").addEventListener("input",cadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="SATURATION : <input type='range' id='myRange2' min=0 max=200 value=100 style='width: 200px;height: 13px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange2").addEventListener("input",sadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="HUE : <input type='range' id='myRange3' min=180 max=540 value=360 style='width: 200px;height: 13px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange3").addEventListener("input",hadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="HIDE CONTROL PANEL";
        newelem.addEventListener("click",vcontrol);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="RESET ALL";
        newelem.addEventListener("click",vreset);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('input');
        newelem.id="copytext";
        newelem.type="text";
        newelem.style.display="none";
        document.getElementsByClassName("socials")[0].appendChild(newelem);

        vreset();
    }

//set interesting defchat settings in profile
    function info(){
        if (win.defchat_settings.private_price !== "0"){
            wprof("Private:",win.defchat_settings.private_price+" Tk/min");
        }else{
            wprof("Private:","Disabled");
        }
        if (win.defchat_settings.private_price !== "0"){
            if (win.defchat_settings.spy_price !== "0"){
                wprof("Spy:",win.defchat_settings.spy_price+" Tk/min");
            }else{
                wprof("Spy:","Disabled");
            }
        }
        if (win.defchat_settings.group_price !== "0"){
            wprof("Group:",win.defchat_settings.group_price+" Tk/min");
        }else{
            wprof("Group:","Disabled");
        }
        if (!win.defchat_settings.allow_tipping){
            wprof("Status:","Exhibitionist");
        }
        if (!campage){
            wprof("Last room topic:",decodeURIComponent(win.defchat_settings.default_subject));
        }
    }

 //mark elements that can be hidden in the profile make clean button visible and call cleanup()
    function cleaninit(){
        var taglist=["a","p","i","strong","b","u","ul","ol","li","h1","h2","h3","img","font","br"];
        for (i=0; i<taglist.length; i++){
            tags = bioarea.getElementsByTagName(taglist[i]);
            for (n=0; n<tags.length; n++){
                if (tags[n].style.position){
                    if ((tags[n].style.position.indexOf("absolute")!=-1)||(tags[n].style.position.indexOf("fixed")!=-1)){
                        tags[n].setAttribute("name", "clean");
                        p++;
                    }
                }
            }
        }
        if (p!==0){
            document.getElementById("hclean").style.display="block";
            cleanup();
        }
    }

// swap profile cleanup cookie and call cleanup()
	function cleancookie(){
		if (readCookie("pclean")){
			eraseCookie("pclean");
		}else{
			createCookie("pclean",1,30);
        }
		cleanup();
	}

// hide or unhide marked elements in profile according to cookie
    function cleanup(){
        var claction=!readCookie("pclean");
        if (claction){
            document.getElementById("clean").innerHTML= "CLEAN PROFILE = ON&nbsp;";
        }else{
            document.getElementById("clean").innerHTML= "CLEAN PROFILE = OFF";
        }
        tags=document.getElementsByName("clean");
        for (i=0; i<tags.length; i++){
            if (claction){
				tags[i].style.display="none";
			}else{
				tags[i].style.display="block";
            }
        }
    }

// fix the redirection links in the profile
     function linkfix(){
         tags = bioarea.getElementsByTagName('a');
         for (i=0; i<tags.length; i++){
             if (tags[i].href.indexOf('?url=') != -1){
                  tags[i].href=decodeURIComponent(tags[i].href).split("?url=")[1];
             }
         }
     }

// hide the lock on paid profile pictures
     function imgfix(){
         tags = bioarea.getElementsByTagName('img');
         for (i=0; i<tags.length; i++){
             if (tags[i].src.indexOf('highwebmedia.com/images/locked_rectangle') != -1){
                  tags[i].style.display="none";
             }
         }
     }

// full screen open
	function fullscreenapi(){
        myfullscreen=true;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullscreen();
        }
	}

// full screen close
    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

//full screen enter/exit handler and prevent double full screen in html5
	function exitHandler(){
	    if (isfullscreen){ //exit
			isfullscreen=false;
            myfullscreen=false;
            document.getElementById("fsclose").style.display="none";
			document.getElementById("player").style.width=orgplayerw+"px";
			createCookie("player_width",orgplayerw,1);
            elem.style.width="";
            sizeadj();
            if (document.getElementsByClassName("vjs-fullscreen-control")[0]) {
              document.getElementsByClassName("vjs-fullscreen-control")[0].style.visibility="visible";
            }
		}
		else{ //enter
           if(!myfullscreen) {return;}
			isfullscreen=true;
            document.getElementById("fsclose").style.display="block";
			orgplayerw=parseInt(document.getElementById("player").style.width);
    		orgplayerh=parseInt(document.getElementById("player").style.height);
			var ratio=orgplayerw/orgplayerh;
 			var fsplheight=screen.height-92;
	  		if (document.getElementById("still_video_object_html5_api")){
				fsplheight=fsplheight-32;
			}
			var fsplwidth=Math.round(fsplheight*ratio);
			if (screen.width-fsplwidth < 275){
				fsplwidth=screen.width-275;
			}
			document.getElementById("player").style.width=fsplwidth+"px";
			createCookie("player_width",fsplwidth,1);
			elem.style.width="100%";
			sizeadj();
            if (document.getElementsByClassName("vjs-fullscreen-control")[0]) {
                document.getElementsByClassName("vjs-fullscreen-control")[0].style.visibility="hidden";
            }
		}
	}

//player resize
	function sizeadj() {
		win.resizable_player.update_sizes();
	}

// brightness adjust
	function badjust(){
		br=document.getElementById("myRange").value;
		ofils=varea.style.filter.split(" ");
		varea.style.filter="brightness("+br+"%) "+ofils[1]+" "+ofils[2]+" "+ofils[3]+" "+ofils[4];
	}

// contrast adjust
	function cadjust(){
		br=document.getElementById("myRange1").value;
		ofils=varea.style.filter.split(" ");
		varea.style.filter=ofils[0]+" contrast("+br+"%) "+ofils[2]+" "+ofils[3]+" "+ofils[4];
    }

// saturation adjust
	function sadjust(){
		br=document.getElementById("myRange2").value;
		ofils=varea.style.filter.split(" ");
		varea.style.filter=ofils[0]+" "+ofils[1]+" "+ofils[2]+" saturate("+br+"%) "+ofils[4];
	}

// hue adjust
	function hadjust(){
		br=document.getElementById("myRange3").value;
		if (br > 359){
            br=br-360;
        }
		ofils=varea.style.filter.split(" ");
		varea.style.filter=ofils[0]+" "+ofils[1]+" "+ofils[2]+" "+ofils[3]+" hue-rotate("+br+"deg)";
	}

// invert video
	function invert(){
		ofils=varea.style.filter.split(" ");
		br=" invert(100%) ";
		if (ofils[2]=="invert(100%)"){
            br=" invert(0%) ";
        }
        varea.style.filter=ofils[0]+" "+ofils[1]+br+ofils[3]+" "+ofils[4];
	}

// mirror video
	function mirror(){
		if (varea.style.transform=="none"){
			varea.style.transform="matrix(-1, 0, 0, 1, 0, 0)";
		}else{
			varea.style.transform="none";
		}
	}

// reset all video adjustments
	function vreset(){
  		varea.style.filter="brightness(100%) contrast(100%) invert(0%) saturate(100%) hue-rotate(0deg)";
		varea.style.transform="none";
        document.getElementById("myRange").value=100;
		document.getElementById("myRange1").value=100;
		document.getElementById("myRange2").value=100;
		document.getElementById("myRange3").value=360;
	}

// video controls on/off
    function vcontrol(){
        if (document.getElementById("controls").style.display=="block"){
            document.getElementById("controls").style.display="none";
        }else{
            document.getElementById("controls").style.display="block";
        }
        copyclipboard(HLS);
    }

// writes a line in the profile at the top
    function wprof (row1,row2){
        var pnod = document.getElementById('tabs_content_container');
        var rnod = pnod.getElementsByTagName('h1')[0];
        newelem = document.createElement('dl');
        newelem.style.margin=0;
        newelem.style.padding=0;
        newelem.innerHTML = "<dt>"+row1+"</dt><dd>"+row2+"</dd>";
        pnod.insertBefore(newelem, rnod.nextSibling);
    }

// pull and drag functions
// when clicked
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

// when moved while clicked- part of dragMouseDown()
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        x =parseInt(document.getElementById("controls").style.right);
        y =parseInt(document.getElementById("controls").style.marginTop);
        if ((pos3>=110)&&(pos3<=window.innerWidth-324)){
            document.getElementById("controls").style.right = (x + pos1) + "px";
        }
        if ((pos4>=20)&&(pos4<=window.innerHeight-20)){
            document.getElementById("controls").style.marginTop = (y - pos2) + "px";
        }
    }

// stop moving when mouse button is released- part of dragMouseDown()
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

// copy cdata to clipboard (only works after user interaction)
    function copyclipboard(cdata){
        document.getElementById("copytext").value=cdata;
        document.getElementById("copytext").style.display="block";
        document.getElementById("copytext").select();
        document.execCommand("copy");
        document.getElementById("copytext").style.display="none";
    }

// cookie functions
	function createCookie(name,value,days,domain){
        var expires="";
        if (domain){
            domain=";domain=."+domain;
        }else{
            domain = "";
        }
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/"+domain;
	}

	function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' '){
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0){
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
	}

	function eraseCookie(name,domain){
        createCookie(name,"",-1,domain);
	}

})();