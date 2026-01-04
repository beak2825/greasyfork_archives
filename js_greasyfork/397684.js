// ==UserScript==
// @name         CB Clean
// @namespace    milesrhoden
// @version      2.8
// @description  extension of ladroop's chaturbate-clean userscript
// @author       milesrhoden
// @noframes
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match          https://*.chaturbate.com/*
// @exclude        https://blog.chaturbate.com/*
// @exclude        https://secure.chaturbate.com/*
// @exclude        https://*.chaturbate.com/apps/*
// @exclude        https://*.chaturbate.com/tipping/*
// @exclude        https://*.chaturbate.com/embed/*
// @exclude        https://*.chaturbate.com/accounts/welcome/*
// @exclude        https://*.chaturbate.com/accounts/register/*
// @exclude        https://*.chaturbate.com/contest/*
// @grant          none
// @run-at         document-end
// @license	   MIT
// @downloadURL https://update.greasyfork.org/scripts/397684/CB%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/397684/CB%20Clean.meta.js
// ==/UserScript==


// Link to script on sleazyfork
// https://sleazyfork.org/en/scripts/397684-cb-clean

(function () {
  'use strict';

  const chaturbateClean = () => {
    //prevents the script from throwing errors to CB's own error logger and maybe some part of the script keeps working if they make changes again
    window.onerror=() => true;

    // // to skip agree screen
    // if (!readCookie("agreeterms")){createCookie("agreeterms","1",30);createCookie("noads","1",30);window.location.reload(true);}
    // // this cookie removes most add's
    // if (!readCookie("noads")){createCookie("noads","1",30);window.location.reload(true);}
    // // initial player size
    // if (!readCookie("player_width")){createCookie("player_width","640",1);}
    // thumbnails
    if (!readCookie("animation")){createCookie("animation","On",30);}

    // locations
    let thumbpage=false;
    let campage=false;
    let theaterpage=false;
    let banpage=false;
    let broadcastpage=false;
    let passwordpage=false;
    let colpage=false;
    let uploadspage=false;
    let bio=false;
    let followtab=false;
    let bioarea="";//bio area
    let varea="";// video area
    let elem="";//full screen area
    let HLS="";//hls video link
    // used in multiple functions
    let ad="";
    let tags="";
    let newelem="";
    let n=0;
    let i=0;
    let p=0;
    let br="";
    let ofils="";
    let fapbr="";
    let thisfap="";
    const cimg = new Image(); // for jpg players
    // for full screen
    let isfullscreen=false;
    let myfullscreen=false;
    let orgplayerw=0;
    let orgplayerh=0;
    // for greasemonkey
    const win = window.wrappedJSObject ? window.wrappedJSObject : window;
    // used by drag slider window
    let pos1=0, pos2=0, pos3=0, pos4=0, x=0, y=0;
    // install the theater mode script too and support me
    const thcleanurl="https://openuserjs.org/install/ladroop/cb_theatermode_clean.user.js";
    const affkey="?track=default&tour=4uT2&campaign=MojQn";
    const affid="MojQn";
    // for thumbnails
    const observer = new MutationObserver(thumbmove); // to be called if thumbpage is refreshed
    const observerConfig = {childList: true}; // changes if pages is refreshed
    let observenode="";// node to observe if page is refreshed
    // for pm
    const defaulttitle=document.title;
    const pmobserver = new MutationObserver(tabpm); // to be called if pm is recieved
    const pmobserverConfig = {childList: true}; // changes if pm
    let pmobservenode="";// node to observe if pm is recieved
    let tabblink=false;

    // first check where we are and set some locations
    // thumbnail page , online cam page (bio + cam), offline cam page or /p/ (only bio), you're banned page, broadcast page,
    // my save privates page, password page , uploads pop-up , followed tab if non of these assume it's theater mode

    if (document.location.href.split("/")[3]=="b"){
        broadcastpage=true;
    }
    if (document.location.href.split("/")[3]=="roomlogin"){
        passwordpage=true;
    }
    if (document.getElementById("followed_tab")){
        followtab=true;
    }
    if (document.location.href.split("/")[3]=="my_collection"){
        if (document.getElementsByTagName("video").length>0){
            colpage=true;
        }
    }
    if (document.location.href.split("/")[3]=="photo_videos"){
        uploadspage=true;
    }
    if (document.getElementsByClassName('c-1 endless_page_template').length > 0){
        thumbpage=true;
    }
    if (document.getElementsByClassName('bio').length>0){
        bioarea=document.getElementsByClassName('bio')[0];
        bio=true;
    }
    if((document.getElementById("player"))&&(!colpage)){
        elem = document.getElementById("defchat").getElementsByClassName("section")[0];
        campage=true;
    }
    if (document.getElementsByClassName('block').length>0){
        if (!document.getElementsByClassName('block')[0].id){
            banpage=true;
        }
    }
    if (!broadcastpage&&!passwordpage&&!colpage&&!thumbpage&&!bio&&!campage&&!banpage&&!uploadspage){
        theaterpage=true;
    }

    // do things on selected pages
    if (theaterpage){
        update();
        return
    }
    if (uploadspage){
        uploadclean();
        return
    }
    if (colpage){
        std();
        return
    }
    setinfo();
    if (followtab){
        makefollowmove();
    }
    if (passwordpage){
        cleanbar();
        return
    }
    if (thumbpage){
        subsel();
        makethumbmove();
        return
    }
    if (banpage){
        cleanbar();
        jpgplayer();
        return
    }
    if (bio){
        cleanbar();
        cleanbutton();
        linkfix();
        imgfix();
        setTimeout(() => {info();}, 500);
    }
    if (broadcastpage){
        cleanbar();
        return
    }
    if (campage){
        fullscreenbutton();
        pmlistner();
        getvid();
        getHls();
    }

    // functions in random order

    function pmlistner(){
      setTimeout(() => {
        pmobservenode=document.getElementsByClassName('pm_count')[0];
        pmobserver.observe(pmobservenode, pmobserverConfig);
      }, 2000);
    }

    //PM in tab
    function tabpm(){
      if ((tabblink==false)&&(document.visibilityState!="visible")){
        tabblink=true;
        tabblinker();
      }
    }

    function tabblinker(){
      if (document.title == "P.M."){
        document.title = "!!!!";
      } else {
        document.title = "P.M.";
      }
      if (document.visibilityState!="visible"){
        setTimeout(tabblinker,500);
      } else {
        document.title=defaulttitle;
        tabblink=false;
      }
    }

    //broadcaster uploads page
    function uploadclean(){
      document.addEventListener("click", uplink);
      uplink();
    }

    function uplink(){
      let linknode="";
      tags=document.getElementsByTagName("div");
      for (let n=0; n<tags.length; n++){
        if (tags[n].style.backgroundColor){
          tags[n].style.backgroundColor="rgba(0,0,0,0)";
        }
        if (tags[n].innerHTML.indexOf("Uploaded")!=-1){
          linknode=tags[n];
        }
      }
      if (document.getElementsByTagName("video")[0]){
        setTimeout(() => {
          if (document.getElementsByTagName("video")[0].src!==""){
            if (linknode.innerHTML.indexOf("Save to disk")==-1){
              linknode.innerHTML+=" - <a href='"+document.getElementsByTagName("video")[0].src+"' target=_blank>Save to disk</a>";
            }
          }
        }, 1000);
      }
    }


    // thumbnails on thumb page
    function makethumbmove(){
      observenode=document.getElementsByClassName('c-1 endless_page_template')[0];
      setTimeout(() => { // give it half a second
  // not logged in , always animate
        if (document.querySelectorAll(".creat").length>0){
          thumbmove();
        } else {
  // not supporter, remove disabled selector and make new
          if(document.getElementsByClassName('upgrade').length >0){
            const thselpar=document.getElementById("animate_thumbnails_form").parentNode;
            document.getElementById("animate_thumbnails_form").remove();
            const newform=document.createElement('form');
            const newlabel=document.createElement('label');
            const labeltext=document.createTextNode(" Userscript Animate Room Images");
            const newinput=document.createElement('input');
            newinput.type="checkbox";
            if (readCookie("animation")=="On"){
              newinput.checked=true;
              thumbmove();
            }
            newinput.id="id_animate_script";
            newlabel.appendChild(newinput);
            newlabel.appendChild(labeltext);
            newform.appendChild(newlabel);
            thselpar.appendChild(newform);
            document.getElementById("id_animate_script").addEventListener("click", setthumbmove);
          } else {
  // supporter, only blow up. moveimg() sees that you are supporter
            if (document.getElementById("id_animate_thumbnails").checked===true){
                thumbmove();
            }
          } // end else
        } // end else
      },500);
    }

    // select clicker
    function setthumbmove(){
      if (document.getElementById("id_animate_script").checked===true){
        createCookie("animation","On",1);
        observer.observe(observenode, observerConfig);
      } else {
        createCookie("animation","Off",1);
        observer.disconnect();
      }
    }

    function thumbmove(){
      cimg.removeEventListener("load",regetimg);
      observer.disconnect();
  //prepare the page for overflowing elements
      if (document.getElementsByClassName("paging").length>0){
        document.getElementsByClassName("paging")[0].style.clear="both";
      }
      document.getElementById("room_list").style.overflow="visible";
      tags=document.getElementsByClassName('content');
      for (let n=0; n<tags.length; n++){
        tags[n].style.overflow="visible";
      }
  //some not so good code on cb page
      document.getElementById("room_list").id="room_list_1";
      if (document.getElementById("room_list")){
        document.getElementById("room_list").style.overflow="visible";
      }
  //add the mouse events and page refresh observer
      tags=document.getElementsByClassName("png");
      for (let n=0; n<tags.length; n++){
        tags[n].addEventListener("mouseenter", moveimg);
        tags[n].parentNode.parentNode.addEventListener("mouseleave", moveimgstop);
      }
      setTimeout(() => { observer.observe(observenode, observerConfig);}, 2000);
    }

      // thumbnails from follow
    function makefollowmove(){
      document.getElementById("followed_tab").addEventListener("mouseup",followmove);
    }

    function followmove(){
      tags= document.getElementById("followed_tab").getElementsByTagName("img");
      for (let n=0; n<tags.length; n++){
        tags[n].addEventListener("mouseenter", moveimgfollow);
        tags[n].addEventListener("mouseleave", moveimgfollowstop);
      }
    }

    //get the name of thumb and set load event
    function moveimg(){ //comes from img
      thisfap=this;
      if (thisfap.parentNode.parentNode.style.zIndex=="20"){
        return
      }
      fapbr=thisfap.src.split("/")[4].split("?")[0];
      thisfap.parentNode.parentNode.style.zIndex="20";
      scaleup(thisfap.parentNode.parentNode,1);
      thisfap.parentNode.parentNode.style.borderColor = "red";

      // not supporter or not logged in stream images
      if((document.getElementsByClassName('upgrade').length>0)||(document.querySelectorAll(".creat").length>0)){
        cimg.addEventListener("load",regetimg);
        cimg.src = "https://cbjpeg.stream.highwebmedia.com/minifwap/"+fapbr+"?f="+ new Date().getTime();
      }
    }

    function scaleup(elm,scale){
      if (elm.style.zIndex=="0"){
        elm.style.transform="scale(1)";
        return
      }
      elm.style.transform="scale("+scale+")";
      scale=scale+0.05;
      if (scale<1.4){
        setTimeout(() => { scaleup(elm,scale);}, 25);
      }
    }

    function moveimgfollow(){
      fapbr=this.src.split("/")[4].split("?")[0];
      thisfap=this;
      cimg.addEventListener("load",regetimg);
      cimg.src = "https://cbjpeg.stream.highwebmedia.com/minifwap/"+fapbr+"?f="+ new Date().getTime();
    }

    function regetimg(){
      thisfap.src=cimg.src;
      setTimeout(() => { cimg.src = "https://cbjpeg.stream.highwebmedia.com/minifwap/"+fapbr+"?f="+ new Date().getTime();}, 50);//~6fps at 100ms load time
    }

    //stop refreshing the thumb
    function moveimgstop(){ // comes from holder
      this.style.transform="scale(1)";
      this.style.zIndex="0";
      this.style.borderColor="#acacac";
      cimg.removeEventListener("load",regetimg);
    }

    function moveimgfollowstop(){
      cimg.removeEventListener("load",regetimg);
    }


    // wait till video is initialized and make video controls
    function getvid(){
      if(document.getElementById("xmovie")||document.getElementById("still_video_object_html5_api")){
        if (document.getElementById("xmovie")){
          varea=document.getElementById("xmovie");
        } else {
          varea=document.getElementById("still_video_object_html5_api");
        }
        controlsbutton();
      } else {
        n++;
        if (n==10){
          varea=document.getElementById("player");
          controlsbutton();
          return
        }
        setTimeout(() => {getvid();}, 100);
      }
    }

    // update if theatermode
    function update(){
      setTimeout(() => {
        if(document.getElementsByClassName('bio-container').length > 0){
          if (!document.getElementById("update")){
            const newelem=document.createElement('div');
            newelem.style.position="absolute";
            newelem.style.top="10px";
            newelem.style.left="255px";
            newelem.style.fontSize="12px";
            newelem.style.color="#0b5d81";
            newelem.style.fontWeight="bold";
            newelem.id="update";
            newelem.innerHTML="<b>Please install the chaturbate theater mode script made by ladroop.<br> Click <a href='"+thcleanurl+"'><font color='red'> here </font></a> to install.</b>";
            document.getElementsByTagName("div")[0].appendChild(newelem);
            document.getElementsByClassName('ad')[0].className="noad";
          }
        }
      }, 3000);
    }

    //set info
    function setinfo(){
      ad = document.getElementsByClassName('ad')[0];
      if (ad){
        ad.style.zIndex="9999";
        ad.style.position="absolute";
        ad.innerHTML='<strong>Chaturbate Clean V'+GM_info.script.version+' Made by Ladroop.</strong> <br>';
      }
      support();
    }

    // support me
    function support(){
      if (document.location.search.indexOf(affid) != -1){
        document.location.href="/accounts/register/";
        return
      }
      setTimeout(() => {
        if (document.querySelectorAll(".creat").length>0){
          if(!readCookie("tnx")){
            document.querySelectorAll(".creat")[0].href="#";
            document.querySelectorAll(".creat")[0].addEventListener("click",support2);
            document.getElementsByClassName('ad')[0].innerHTML+="<strong>Please support this script. <a href=# id='support'><font color='red'>Click here to sign up for a new account.</font></a></strong>";
            document.getElementById("support").addEventListener("click",support2);
          }
        }
      }, 2000);
    }

    function support2(){
      const cookies=document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++){
        eraseCookie(cookies[i].split("=")[0],"");
      }
      createCookie("agreeterms","1",30);
      createCookie("tnx","1",3);
      document.location.href="https://chaturbate.com/in/"+affkey;
    }

    // save vid
    function std(){
      setTimeout(() => {
        newelem=document.createElement('a');
        newelem.href= document.getElementsByTagName("video")[0].src;
        newelem.target="_blank";
        newelem.innerHTML="Right click, save to disk.";
        newelem.style.backgroundColor="white";
        newelem.style.marginLeft="20px";
        document.getElementsByTagName("body")[0].appendChild(newelem);
      }, 5000);
    }

    // get the HLS link
    function getHls(){
      tags=document.getElementsByTagName("script");
      for (let n=1; n<tags.length; n++){
        if(!tags[n].src){
          if (tags[n].innerHTML.indexOf(".m3u8")!=-1){
            HLS="https://"+tags[n].innerHTML.split("src='https://")[1].split(".m3u8")[0]+".m3u8";
            break
          }
        }
      }
    }

    // options on menu bar on a cam page , only show link to main page, broadcast link in a new tab except on broadcast page and login, other links can still be found on the thumb pages
    function cleanbar(){
      tags=document.getElementById("nav").getElementsByTagName('li');
      for (let n=1; n<tags.length; n++){
        if ((tags[n].getElementsByTagName("a")[0].href.split("/")[3]=="b")&&(document.location.href.split("/")[3]!="b")){
          tags[n].getElementsByTagName("a")[0].target="_blank";
        } else {
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
      } // end for loop
    } // end cleanbar

    // make a subselector on a thumbpage
    function subsel(){
      createCookie("selected",document.location.href,1);
      if((document.location.href.indexOf("spy-on-cams")==-1)&&(document.location.href.indexOf("followed-cams")==-1)&&(document.location.href.indexOf("/tag")==-1)&&(document.location.href.indexOf("/current_app_use/")==-1)){
        newelem=document.createElement('li');
        newelem.setAttribute('class', 'gender-tab');
        newelem.setAttribute('style', 'display:inline-block;');
        let data='<form><select id="subsel" style="margin: 0px 0px 0px 0px; border-radius: 4px 4px 0px 0px;padding: 3px 1px 4px 12px; font-weight: 400; font-size: 13px; font-family: \'UbuntuMedium\',Arial,Helvetica,sans-serif;" >'+
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
        const uloc=document.location.href+"//";
        const loc=uloc.split("/");
        const check=loc[3]+loc[4];
        let gen="";
        if(check.indexOf("male") != -1){gen="male";}
        if(check.indexOf("female") != -1){gen="female";}
        if(check.indexOf("couple") != -1){gen="couple";}
        if(check.indexOf("trans") != -1){gen="trans";}
        data=data.replace(/XX/gi,gen);
        if (gen === ""){data=data.replace("-cams","");}
        data=data.replace('<option value="/'+loc[3],'<option selected value="/'+loc[3]);
        newelem.innerHTML=data;
        // https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
        const foltab=document.getElementById('followed_tab');
        foltab.style.position = 'relative';
        foltab.parentNode.insertBefore(newelem, foltab.nextSibling);
        // document.getElementsByClassName('sub-nav')[0].appendChild(newelem)
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
      document.title=br+"'s no access cam";
      newelem=document.createElement('div');
      newelem.setAttribute("style","clear:both;float:left;margin-left:10px;margin-top:10px;margin-bottom:10px;margin-right:200px;border-width:5px;border-style:double;resize:both;overflow:hidden;width: 640px; height: 480px;");
      newelem.innerHTML="<img id='vidimg' src='https://ssl-ccstatic.highwebmedia.com/images/cam_notice_background.jpg' height=100% width=100%></img>";
      document.getElementsByClassName('block')[0].appendChild(newelem);

      cimg.onload = () => {
        document.getElementById("vidimg").src=cimg.src;
        setTimeout(() => { cimg.src = 'https://cbjpeg.stream.highwebmedia.com/minifap/'+br+'.jpg?f='+ new Date().getTime();}, 150);
      };

      cimg.onerror = () => {
        setTimeout(() => { cimg.src = 'https://cbjpeg.stream.highwebmedia.com/minifap/'+br+'.jpg?f='+ new Date().getTime();}, 1000);
      };

      cimg.src = 'https://cbjpeg.stream.highwebmedia.com/minifap/'+br+'.jpg?f='+ new Date().getTime();

      for (let i = 1; i < 9999; i++){win.clearInterval(i);}
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

    // make a full screen button,exit full screen button, app area bug and set full screen handler
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

      document.getElementsByClassName("tip_shell")[0].style.width="100%";

      document.addEventListener('webkitfullscreenchange', exitHandler, false);
      document.addEventListener('mozfullscreenchange', exitHandler, false);
      document.addEventListener('fullscreenchange', exitHandler, false);
    }

      // make video controls, set filter
    function controlsbutton(){
      const butstyle="margin-right: 10px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 3px 10px 2px; float: right; border-radius: 4px; cursor: pointer; display: inline;";
      const slistyle="text-align: left; width: 310px;margin-right: 10px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 3px 10px 2px; float: right; border-radius: 4px; display: inline;";

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
    } // end controlsbutton

    //set interesting defchat settings in profile
    function info(){
      if (win.defchat_settings.private_price !== "0"){
        wprof("Private:",win.defchat_settings.private_price+" Tk/min");
      } else {
        wprof("Private:","Disabled");
      }
      if (win.defchat_settings.private_price !== "0"){
        if (win.defchat_settings.spy_price !== "0"){
          wprof("Spy:",win.defchat_settings.spy_price+" Tk/min");
        } else {
          wprof("Spy:","Disabled");
        }
      }
      if (win.defchat_settings.group_price !== "0"){
        wprof("Group:",win.defchat_settings.group_price+" Tk/min");
      } else {
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
      const taglist=["a","p","i","strong","b","u","ul","ol","li","h1","h2","h3","img","font","br"];
      for (let i=0; i<taglist.length; i++){
        tags = bioarea.getElementsByTagName(taglist[i]);
        for (let n=0; n<tags.length; n++){
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
      } else {
        createCookie("pclean",1,30);
      }
      cleanup();
    }

    // hide or unhide marked elements in profile according to cookie
    function cleanup(){
      const claction=!readCookie("pclean");
      if (claction){
        document.getElementById("clean").innerHTML= "CLEAN PROFILE = ON&nbsp;";
      } else {
        document.getElementById("clean").innerHTML= "CLEAN PROFILE = OFF";
      }
      tags=document.getElementsByName("clean");
      for (let i=0; i<tags.length; i++){
        if (claction){
          tags[i].style.display="none";
        } else {
          tags[i].style.display="block";
        }
      }
    }

    // fix the redirection links in the profile
    function linkfix(){
      tags = bioarea.getElementsByTagName('a');
      for (let i=0; i<tags.length; i++){
        if (tags[i].href.indexOf('?url=') != -1){
           tags[i].href=decodeURIComponent(tags[i].href).split("?url=")[1];
        }
        if (tags[i].href.indexOf('/in/') != -1){
          tags[i].href=tags[i].href.split('?')[0]+affkey;
        }
      }
    }

    // hide the lock on paid profile pictures
    function imgfix(){
      tags = bioarea.getElementsByTagName('img');
      for (let i=0; i<tags.length; i++){
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
            if (document.getElementsByClassName("vjs-fullscreen-control").length>0) {
              document.getElementsByClassName("vjs-fullscreen-control")[0].style.visibility="visible";
            }
      }
      else { //enter
        if(!myfullscreen) {return}
        isfullscreen=true;
        document.getElementById("fsclose").style.display="block";
        orgplayerw=parseInt(document.getElementById("player").style.width);
        orgplayerh=parseInt(document.getElementById("player").style.height);
        const ratio=orgplayerw/orgplayerh;
        let fsplheight=screen.height-92;
        if (document.getElementById("still_video_object_html5_api")){
          fsplheight=fsplheight-32;
        }
        let fsplwidth=Math.round(fsplheight*ratio);
        if (screen.width-fsplwidth < 275){
          fsplwidth=screen.width-275;
        }
        document.getElementById("player").style.width=fsplwidth+"px";
        createCookie("player_width",fsplwidth,1);
        elem.style.width="100%";
        sizeadj();
        if (document.getElementsByClassName("vjs-fullscreen-control").length>0) {
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
      } else {
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
        } else {
            document.getElementById("controls").style.display="block";
        }
        copyclipboard(HLS);
    }

    // writes a line in the profile at the top
    function wprof (row1,row2){
      const pnod = document.getElementById('tabs_content_container');
      const rnod = pnod.getElementsByTagName('h1')[0];
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
      let expires="";
      if (domain){
          domain=";domain=."+domain;
      } else {
          domain = "";
      }
      if (days) {
          const date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          expires = "; expires="+date.toGMTString();
      }
      document.cookie = name+"="+value+expires+"; path=/"+domain;
    }

    function readCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i=0;i < ca.length;i++) {
          let c = ca[i];
          while (c.charAt(0)==' '){
              c = c.substring(1,c.length);
          }
          if (c.indexOf(nameEQ) === 0){
              return c.substring(nameEQ.length,c.length)
          }
      }
      return null
    }

    function eraseCookie(name,domain){
      createCookie(name,"",-1,domain);
    }
  };

  const addCustomStyleTag = () => {
    const newStyle = document.createElement("style");
    newStyle.setAttribute('type', 'text/css');
    // classToColor background, color, padding, margin
    newStyle.innerHTML = `
    /* DO NOT EDIT BELOW THIS POINT */
    /* BEGIN CUSTOM CSS */
.section,
.footer-holder {
  background: #222;
}

.list li,
.list .title .age,
#header #user_information .userInfoDropdownBgColor,
.roomCard,
.camSubjectColor {
  background: #222;
  background-color: #222;
  color: #D4D4D4;
}

.roomCard .age {
  color: #D4D4D4;
}

body,
form th label,
.defaultColor,
.nav-bar,
.navigationAlt2BgColor,
#AppPanelTable,
#AppPanelTable .rowTwo,
.tabActiveBgColor,
.tabInactiveBgColor:hover,
#VideoPanel,
#SplitModeTipCallout,
#SplitModeTipCallout div.titleBar,
#roomTabs,
#TheaterModeRoomContents .styledDiv,
#header #user_information .user_information_header,
.top-section,
.defaultTooltipColor,
.tabBar .tooltip,
.ContestStats .statData {
  background: #333;
  background-color: #333;
  color: #D9D9D9;
}

.camAltTextColor {
  color: #D9D9D9;
}

#ChatTabContents,
#ChatTabContents .message-list,
#ChatTabContents .message-list .msg-text,
#ChatTabContainer,
form textarea,
#AppPanelTable .rowOne,
#AppPanelTable .rowThree,
#AppPanelTable .threeRows-11-21-31,
.followed-tab.active,
a.gender-tab.active,
#header #user_information .overflow,
#header #user_information .bottom,
#header #user_information a.tokencountlink {
  background: #666;
  background-color: #666;
  color: #EEE;
}

#header #user_information .userInfoDropdownHighlightColor:hover {
  background: #955c06;
  background-color: #955c06;
}

.logo-zone {
  color: #D4D4D4;
}

#roomTabs .label {
  color: #D4D4D4;
}
#roomTabs .contentText {
  color: #EEE;
}

.tabInactiveColor,
p a,
dd a,
.list .title a,
div.details a,
a.advanced_search_button,
#VideoPanel .reportAbuseLink,
.camSubjectTagColor,
.ContestStats .statText,
.ContestStats .otherRows,
.ContestStats .rowBorder,
.camHrefColor {
  color: #6ba0df;
}

#SplitModeTipCallout span.tokenBalance,
#AppPanelTable .threeRowsOfLabels {
  color: #3acc60;
}

#SplitModeTipCallout input.tipAmountInput {
  border: none;
  background: #333;
  color: #D9D9D9;
}

#VideoPanel .panelLink,
a.msg-link,
#TheaterModeRoomContents .link,
#TheaterModeRoomContents #video-mode,
#TheaterModeRoomContents #fvm-link,
#header #user_information a {
  color: #eb6b20;
}

.nav-bar {
  border-bottom: 3px solid #955c06;
}

.tabSectionBorder {
  border-bottom: 1px solid #955c06;
}

.sendTip .buttons {
  background-color: #dc6118;
}
.sendTip .buttons:hover {
  background-color: #955c06;
}

.resizeHandle {
  background: #333 url(../../tsdefaultassets/resize_arrows.gif?7aec7159f84f) no-repeat left center;
}

.BaseRoomContents,
.BaseRoomContents .topSectionWrapper,
.BaseTabsContainer .inputDiv,
.BaseTabsContainer div.inputDiv div.msg-input,
.BaseTabsContainer .inputDiv input.msg-input {
  background: #222;
  color: #EEE;
  border: 1px solid #333;
  border-radius: 3px;
}

.gender-tab a,
a.gender-tab,
div.gender-tab,
#main .top-section .sub-nav li a,
.gender-tab form select {
  color: #EEE;
  background: #333;
  border-color: #955c06;
}

.gender-tab a:hover,
a.gender-tab:hover,
.active .gender-tab a,
.gender-tab .active a,
.sub-nav li > a:hover,
.active .sub-nav li > a,
#main .top-section .sub-nav li.active a,
#main .top-section .sub-nav li a:hover {
  text-decoration: none;
  background: #666;
  color: #EEE;
  border-bottom: 1px solid #955c06;
  cursor: default;
}

@keyframes bubble-new {
  from {
    font-size: 100%;
  }
  to {
    font-size: 120%;
  }
}
.list .thumbnail_label_c_new {
  animation: 0.4s linear 1s infinite alternate bubble-new;
}

span div[ts=WF] img {
  display: none;
  visibility: hidden;
}

#followed_tab > a {
  opacity: 0.7;
}

.msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.broadcaster, .msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.mod, .msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.inFanclub, .msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.tippedTonsRecently, .msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.tippedALotRecently, .msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.tippedRecently, .msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.hasTokens, .msg-text[data-nick] > div.roomNotice > div > div.purecolor:first-child.defaultUser {
  background: #666;
  background-color: #666;
  margin-right: -5px;
  padding-left: 4px;
}

.broadcaster {
  color: #df681d;
}

.mod {
  color: #df3535;
}

.inFanclub {
  color: #3acc60;
}
.roomNotice .inFanclub {
  color: #3acc60;
}

.tippedTonsRecently {
  color: #380064;
}

.tippedALotRecently {
  color: #be6aff;
}

.tippedRecently {
  color: #009;
}

.hasTokens {
  color: #82daf8;
}

.defaultUser {
  color: #bbbbc4;
}

#VideoPanel > div:nth-of-type(4) div:not(.defaultColor),
#VideoPanel > div:nth-of-type(4) div {
  background: #222;
}
#VideoPanel > div:nth-of-type(4) div:not(.defaultColor) img,
#VideoPanel > div:nth-of-type(4) div img {
  opacity: 0.25;
}

a.userUpload > img:nth-of-type(2) {
  opacity: 0.15;
}

/* END CUSTOM CSS */
  `;
    document.head.appendChild(newStyle);
  };

  const mainBack = "black";
  const mainFront = "#DDD";
  const specialBack = "#888";
  const specialFront = "#000";

  const darkMaxBack    = "#222";
  const darkMaxFront   = "#D4D4D4";
  const darkMidBack    = "#333";
  const darkMidFront   = "#D9D9D9";
  const darkMinBack    = "#666";
  const darkMinFront   = "#EEE";
  const orangeBorder   = "#955c06";
  const orangeBrighter = "#dc6118";

  const tipBackgroundColor = "#d9d91e";

  const miscellaneousLooseEnds = () => {

    let userList = [];

      // Remove more SPAM
      const spamTargets
        = [ '.featured_blog_posts'  // blog spam
          , '.featured_text'        // footer spam
          ];

      spamTargets.forEach(e => {
        const ad = document.querySelector(e);
        if (ad) ad.parentNode.removeChild(ad);
      });

      // announcement banner (if present)
      let addd = document.querySelector('.top-section');
      if (addd){
        addd = addd.querySelector('img');
        if (addd) addd.parentNode.removeChild(addd);
      }


      // CamWhoresSearchButton
      const tabsContentContainer = document.querySelector('#tabs_content_container');
      if (tabsContentContainer) {
        const modelName = tabsContentContainer.getElementsByTagName('h1')[0].innerText.split('\'')[0];
        const camVideosSearchButton = document.createElement('li');
        camVideosSearchButton.innerHTML = `<a href=\"http://www.camvideos.tv/search/${modelName}/" target="_blank" style="background: #254814;">CV SEARCH</a>`;
        document.getElementsByClassName('sub-nav')[0].append(camVideosSearchButton);

        const camWhoresSearchButton = document.createElement('li');
        camWhoresSearchButton.innerHTML = `<a href=\"http://www.camwhores.tv/search/${modelName}/" target="_blank" style="background: #254814;">CW SEARCH</a>`;
        document.getElementsByClassName('sub-nav')[0].append(camWhoresSearchButton);

        const camWhoresHdSearchButton = document.createElement('li');
        camWhoresHdSearchButton.innerHTML = `<a href=\"http://www.camwhoreshd.com/search/${modelName}/" target="_blank" style="background: #254814;">CW-HD SEARCH</a>`;
        document.getElementsByClassName('sub-nav')[0].append(camWhoresHdSearchButton);
      }

    const navbar = document.getElementById('nav');// advert options on menu navbars only
    if (navbar) {                                // save"login", "main", "broadcast",
      const navbarList = navbar.getElementsByTagName('li');// "tags" and "my collection"
      const permittedNavbarItemStrings = [
        '/login',
        'href="/"',
        'href="/b/',
        '/my_',
        '/tags'
      ];
      for (let i = navbarList.length - 1; i >= 0; i--) {
        if (!permittedNavbarItemStrings.some(e=>                 // If the list item has NONE
          navbarList[i].innerHTML.includes(e)))           // of the permittedTabs
            navbarList[i].parentNode.removeChild(navbarList[i]); // then it is removed.
      }
    }

    function doMoreScript () {

    //move account info to middle top of page
        document.getElementById("user_information").style.float = "left";
    //hide male and trans cam buttons
        document.querySelector("a[href='/male-cams/']").parentNode.style.display = "none";
        document.querySelector("a[href='/trans-cams/']").parentNode.style.display = "none";

        // const followedModal = document.querySelector('.followedContainer')
        // if (followedModal) {
        //   /* making the text chat background black with white text:*/
        //   const followedModalTarget = document.querySelector('.followedContainer').parentNode;
        //   // configuration of the observer:
        //   const followedModalConfig = { childList: true, subtree: true, attributes: true }
        //   // pass in the target node, as well as the observer options
        //   followModalObserver.observe(followedModalTarget, followedModalConfig);
        // }


        // select the target node (new observer to hide male and trans cams from list)

        const mainList = document.querySelector('.list');
        if (mainList) {
            hideGenderClass("genderm");
            hideGenderClass("genders");

            if (window.location.href === "https://chaturbate.com/followed-cams/") {

                const followedArray = [];
                const followedElements = document.querySelectorAll(".room_list_room");
                if (followedElements) followedElements.forEach(el => followedArray.push(el.getElementsByTagName('a')[1].innerText));
                // const followedListItems
                //   = document.querySelectorAll(".room_list_room")


                // Put the object into storage
                localStorage.setItem('followedArray', JSON.stringify(followedArray));
            } else {
                hideFollowedModels();
            }

            /* making the text chat background black with white text:*/
            const mainListTarget = document.getElementsByClassName('list')[0].parentNode;
            // configuration of the observer:
            const mainListConfig = { childList: true, characterData: true, subtree: true };
            // pass in the target node, as well as the observer options
            mainListObserver.observe(mainListTarget, mainListConfig);
        }

        // const moreLikeThisList = document.querySelector('.more_like_this')
        // if (moreLikeThisList) {
        //   // hideGenderClass("genderm");
        //   // hideGenderClass("genders");
        //   console.log("more like this happenig")
        //   /* making the text chat background black with white text:*/
        //   const moreLikeThisListTarget = document.querySelector('.more_like_this')
        //   // configuration of the observer:
        //   const moreLikeThisListConfig = { childList: true, characterData: true, subtree: true }
        //   // pass in the target node, as well as the observer options
        //   moreLikeThisListObserver.observe(moreLikeThisListTarget, moreLikeThisListConfig);
        // }

        const bioContent = document.getElementById('tabs_content_container');
        if (bioContent){
          const specialNoticeDiv = `
        <div id="specialNoticeDiv">
          ...<br>
        </div>
        <div id="trickle_inputs">
          <div class="trickle_input_container">
            <label>Tip<br>Value</label>
            <input  id="trickle_value" type="text" value="1" />
          </div>
          <div class="trickle_input_container">
            <label>How Many<br>Times?</label>
            <input  id="trickle_iterations" type="text" value="60" />
          </div>
          <div class="trickle_input_container">
            <label>Seconds<br>Between?</label>
            <input  id="trickle_seconds" type="text" value="1" />
          </div>
        </div>
        <button id="trickle_button_tip">SEND TRICKLE TIPS</button>
        <button id="trickle_button_cancel" style="display:none;">TRICKLE STOP <span id="remainingTrickleCount"></span></button>
        <button id="hide_show_button_notice_div" >HIDE SAVED NOTICES</button>
        `;
          bioContent.innerHTML = specialNoticeDiv + bioContent.innerHTML;

          document.getElementById('trickle_button_tip').addEventListener('click',tokenTrickler);
          document.getElementById('trickle_button_cancel').addEventListener('click',stopTokenTrickler);
          document.getElementById('hide_show_button_notice_div').addEventListener('click',toggleSpecialNoticeDiv);
          document.addEventListener('beforeunload', stopTokenTrickler);
          bioContent.addEventListener("keydown", passFocusBetweenTrickleInputs);

          document.getElementById('trickle_value').addEventListener('focus',ev => ev.target.select());
          document.getElementById('trickle_iterations').addEventListener('focus',ev => ev.target.select());
          document.getElementById('trickle_seconds').addEventListener('focus',ev => ev.target.select());
        }

    } // end doMoreScript

    function toggleSpecialNoticeDiv() {
      const mainDiv = document.querySelector('#specialNoticeDiv');
      if (!mainDiv) return
      const hideButton = document.querySelector('#hide_show_button_notice_div');
      if (!hideButton) return

      const showDialogLabel = "SHOW SAVED NOTICES";
      const hideDialogLabel = "HIDE SAVED NOTICES";

      if (hideButton.innerText === showDialogLabel) {
        hideButton.innerText = hideDialogLabel;
        mainDiv.style = "";
      } else {
        hideButton.innerText = showDialogLabel;
        mainDiv.style = "display: none;";
      }
    }

    function reformatVideoPage() {
        /*position the chat box*/
        document.getElementsByClassName("chat-holder")[0].style.marginLeft = (parseFloat(document.getElementById("player").style.width) + 6) + "px";

        /* shrink the buttons on top of chat*/
        const tinyImg = document
          .getElementsByClassName("buttons")[0]
          .getElementsByTagName("img")[0];
        if (tinyImg) tinyImg.parentNode.removeChild(tinyImg);

        document.getElementsByClassName("nooverlay")[0].innerText = "CH";
        document.getElementsByClassName("nooverlay")[0].style.padding = "5px 0px 0px 0px";
        document.getElementsByClassName("nooverlay")[1].style.padding = "5px 0px 0px 0px";
        document.getElementsByClassName("nooverlay")[2].style.padding = "5px 3px 0px 3px";

        // click USERS tab to load user list, then click CHAT tab to return to normal
        document.getElementsByClassName("nooverlay")[1].click();
        document.getElementsByClassName("nooverlay")[0].click();


        document.getElementById("report_popup_link").style.display = "none";
        document.getElementsByClassName("title")[0].style.paddingTop = "7px";
        document.getElementsByClassName("title")[0].style.paddingBottom = 0;

        // These may be better suited to a change in css style at top of page

        document.getElementsByClassName('token_options')[0].style.width = "280px";

        // This script reformats the "tip_shell" portion under the video when tips make it go back to default settings
        // select the target node
        const tipShellTarget = document.getElementsByClassName('tip_shell')[0];
        // configuration of the observer:
        const tipShellConfig = {
          childList: true,
          characterData: true,
          subtree: true
        };
        // pass in the target node, as well as the observer options
        tipShellObserver.observe(tipShellTarget, tipShellConfig);

        // This script reformats the "chat-list" to match the height of the player (close enough, anyway)
        // select the target node
        const chatShellTarget = document.getElementsByClassName('chat-list')[0];
        // configuration of the observer:
        const chatShellConfig = { childList: true};
        // pass in the target node, as well as the observer options
        chatListObserver.observe(chatShellTarget, chatShellConfig);

        // This checks the anonymous user count
        // select the target node (USER count tab)
        const userCountTarget = document.getElementsByClassName('nooverlay')[1];
        // configuration of the observer:
        const userCountConfig = { childList: true,
          subtree: true,
          characterData: true,
          attributes: true };
        // pass in the target node, as well as the observer options
        userCountObserver.observe(userCountTarget, userCountConfig);

        // This script hides offline models in the "Contest Stats" tab
        // select the target node
        const contestTarget = document.getElementsByClassName('leaderboard')[0];
        // configuration of the observer:
        const contestConfig = {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true};
        // pass in the target node, as well as the observer options
        contestListObserver.observe(contestTarget, contestConfig);

        // if (!document.getElementById("still_video_object_html5_api")) {
        //   document.getElementsByClassName('video-box')[0].style.bottom = "-33px"
        //   document.getElementsByClassName('chat-holder')[0].style.bottom = "-32px"
        //   document.getElementsByClassName('tip_shell')[0].style.top = "-32px"
        // }

        // document.getElementsByClassName('tip_shell')[0].innerHTML += ""
    }

    // create an observer instance
    const tipShellObserver = new MutationObserver(function(mutations) {
        classTextOverOtherClassText('token_balance','light_blue');
        classTextOverOtherClassText('token_balance','dark_light_blue');
    });

    function classTextOverOtherClassText (oldClass, newClass) {
        if ((document.getElementsByClassName(newClass)[0]) && (document.getElementsByClassName(oldClass)[0].innerText !== document.getElementsByClassName(newClass)[0].innerText)) {
            document.getElementsByClassName(oldClass)[0].innerText = document.getElementsByClassName(newClass)[0].innerText;
        }
    }

    const userCountObserver = new MutationObserver(function(mutations) {
      $.ajax({
          url: $('#get_chat_user_list_form').attr('action'),
          data: $('#get_chat_user_list_form').serialize(),
          type: 'POST',
          success: function(data) {
              // data is a comma separated string of "username|tipstatus
              // l is dark purple, p is purple, tr is dark blue, t is light blue, g is grey
              const results = data.split(',');
              const newUserList = results.map(e=>e.substring(0,e.indexOf('|')));
              newUserList.splice(0,2);
              userList = userList.concat(newUserList.filter(e=>!userList.includes(e)));
              const anonUserCount = parseFloat(results[0]);
              const anonPercent = Math.round((anonUserCount * 100)/((results.length - 1) + (anonUserCount)));
              document.getElementsByClassName('nooverlay')[2].innerText = (anonPercent + "%");

              const tokenHolderCount = results.filter(e=>!e.includes("|g")).length - 2;
              const holderPercent = Math.round((tokenHolderCount * 100)/((results.length - 1) + (anonUserCount)));
              document.getElementsByClassName('nooverlay')[2].title =
                `${holderPercent}% of users have tokens (${tokenHolderCount})
              ${results.filter(e=>e.includes("|l")).length} dark purple users
              ${results.filter(e=>e.includes("|p")).length} light purple users
              ${results.filter(e=>e.includes("|tr")).length} dark blue users`;
          }
      });
    });

    const mainListObserver = new MutationObserver(function(mutations) {
      hideGenderClass("genderm");
      hideGenderClass("genders");
      if (window.location.href !== "https://chaturbate.com/followed-cams/") {
          hideFollowedModels();
      }
    });

    const moreLikeThisListObserver = new MutationObserver(function(mutations) {
      // hideGenderClass("genderm");
      // hideGenderClass("genders");
      hideMoreLikeThis();
      console.log("saw a mutation in more_like_this");

    });

    const followModalObserver = new MutationObserver(function(mutations) {
      Array.from(mutations).forEach(m => {
        if (!(m.attributeName === "style" || m.type === "childList")) {
        // if (m.target !== "img") {
          // console.log(m)
          return
        }
        document.querySelector('.followedContainer').style.background = mainBack;
        document.querySelectorAll('.followedContainer a').forEach(e => {
          if (e.style.backgroundColor === "rgb(249, 238, 208)") {
            e.style.color = mainBack;
          } else if (e.style.color !== "rgb(220, 85, 0)") {
            e.style.color = mainFront;
          }

          // background-color: rgb(240, 241, 241);
          const brightBackgroundColors = ["rgb(240, 241, 241)", "rgb(255, 255, 255)"];
          if (brightBackgroundColors.indexOf(e.style.backgroundColor) !== -1) {
            e.style.background = mainBack;
          }



        });
      }); // end forEach

    }); // end followModalObserver

    const contestListObserver = new MutationObserver(function(mutations) {
      hideContestEmpty();
    });

    function hideContestEmpty () {
      const classList = document.getElementsByClassName('points');
      for (let i = 0; i < classList.length; i++) {
        if (classList[i].innerText.charAt(29) == "0") {
            classList[i].parentNode.innerHTML = "OFFLINE - "+classList[i].parentNode.getElementsByTagName('a')[0].innerText;
        }
      }
    }

    function hideGenderClass (genderClass) {
      const classList = document.getElementsByClassName(genderClass);
      for (i = classList.length - 1; i >= 0 ; i--) {
        const removeMe = classList[i].parentNode.parentNode.parentNode;
        removeMe.parentNode.removeChild(removeMe);
        // i--
      }
    }

    function hideMoreLikeThis () {
      const moreLikeThisList = document.querySelector('.more_like_this');
      const okIcons = [ "iconFemale.png", "iconCouple.png" ];
      if (moreLikeThisList) {
        const camList = moreLikeThisList.querySelectorAll('div[ts="hh"]');
        if (camList) {
          camList.forEach(el => {
            let goodCam = false;
            if (okIcons.some(x => el.innerHTML.includes(x))) goodCam = true;
            el.querySelectorAll('*').forEach(ex => ex.removeAttriute('style'));
            if (!goodCam) el.parentNode.removeChild(el);
          }); // end for each
        } // end if camList
      } // end if moreLikeThisList
    } // end hideMoreLikeThis

    function hideFollowedModels () {
      let followedList = localStorage.getItem('followedArray');
      followedList = followedList ? JSON.parse(followedList) : [];

      const currentList = document.querySelectorAll('.room_list_room');

      if (!currentList) return

      currentList.forEach(currentListItem => {
        const currentName = currentListItem.getElementsByTagName('a')[1].innerText;
        // If the model is in your followed list, then hide her
        if (followedList.includes(currentName)) {
            currentListItem.style.display = 'none';
            console.log('Hidden model:', currentName);
        }
      });
    }

    var chatListObserver = new MutationObserver(function(mutations) {
      // setTimeout(() => {

        //add other classes to this list if you find more
        let x;
        let y;
        let oldInnerHTML;
        let newInnerHTML;

        //more chat clean-up
        const textList = document.querySelectorAll('.text');

        for (let i = 0; i < textList.length; i++) {
          const curElement = textList[i];
          curElement.setAttribute('class', 'Xtext');
          curElement.removeAttribute('style');
          if (curElement.getAttribute('id') === 'chat_input') continue

          if (/> tipped (\d+) token(s)?</i.test(curElement.innerHTML)) {
            curElement.innerHTML = curElement.innerHTML.replace(/tipped (\d+) token(s)?/i, "[$1 tk$2]");
            continue
          }

          oldInnerHTML = curElement.innerHTML;

          // remove emoticon username roles
          x = curElement.querySelector('.facebox_link');
          if (x) {
            // remove style attributes from these p tags
            y = curElement.querySelectorAll('p');
            y.forEach(el => el.removeAttribute('style'));
            const textString = curElement.innerText;
            if (textString.includes('::')) {
              x.parentNode.removeChild(x);
            }
          }

          const specialNoticeDiv = document.getElementById('specialNoticeDiv');
          function addToSpecialNoticeDiv (el) {
            if (specialNoticeDiv){
              if (!specialNoticeDiv.innerHTML.includes(el.innerHTML)) {
                if (userList.every(e=>!curElement.innerText.includes(e))
                    && !curElement.innerText.match(/\bleader ?(board)?\b/i)
                    && !curElement.innerText.match(/\*[ ]?\d\. /i)) {
                  specialNoticeDiv.innerHTML += el.innerHTML;
                }
              } else {
                el.parentNode.removeChild(el);
              }

              const tabsContentContainer = document.querySelector('#tabs_content_container');
              if (tabsContentContainer) {
                const newMinHeight = parseInt(specialNoticeDiv.getBoundingClientRect().height) + 100;
                if (tabsContentContainer.getBoundingClientRect().height < newMinHeight) {
                  tabsContentContainer.style.minHeight = newMinHeight + "px";
                }
              } // end if tabsContentContainer
            }
          }

          //change these repetitive messages
          if (/Lovense toy has connected/.test(oldInnerHTML))
            curElement.innerHTML = "*Lovense reconnected";
          if (/accidentally disconnected/.test(oldInnerHTML))
            curElement.innerHTML = "*Toy Disconnected! Tips going to queue...";
          if (/does not have a toy connected/.test(oldInnerHTML))
            curElement.innerHTML = "*No Toy Connected!!";
          if (/room subject changed to/.test(oldInnerHTML))
            curElement.innerHTML = "*";
          if (/Rules: No spamming/.test(oldInnerHTML))
            curElement.innerHTML = "*";
          if (/now reacting to/.test(oldInnerHTML)) {
              //shortens the "now reacting" messages
              curElement.innerHTML = "*R"+oldInnerHTML.substring(oldInnerHTML.indexOf("now reacting")+5);
              //". It will stop after"
              curElement.innerHTML = curElement.innerHTML.replace(". It will stop after"," for");
              curElement.innerHTML = curElement.innerHTML.replace(/( )?second(s)?/gi,"s");
              continue
          }
          if (oldInnerHTML.includes("----")) {
              //shortens announcements usually made through model's username rather than "Notice"
              curElement.innerHTML = curElement.innerHTML.replace(/--+/g, '');
              x = curElement.getElementsByClassName('username')[0];
              if (x) x.parentNode.removeChild(x);

              x = curElement.getElementsByClassName('facebox_link')[0];
              if (x) x.parentNode.removeChild(x);

              curElement.innerHTML = curElement.innerHTML.replace(/token/gi,"tk");
              curElement.innerHTML = curElement.innerHTML.replace(/( )?second(s)?/gi,"s");
              curElement.innerHTML = curElement.innerHTML.replace(/( )?minute/gi,'min');
              curElement.innerHTML = curElement.innerHTML.replace(/levels?( )?/gi,'');
              curElement.innerHTML = curElement.innerHTML.replace(/( )?vibration(s)?( )?/gi,'');
              curElement.innerHTML += '<br>';
              addToSpecialNoticeDiv(curElement);
              continue
          }

          //shortened "user silenced" notice
          //<p>User prendilo91 was silenced by teheta and his/her messages have been removed</p>
          if (/was silenced by/.test(oldInnerHTML)) {
              //shortens announcements usually made through model's username rather than "Notice"
              curElement.innerHTML = "~"+oldInnerHTML.substring(oldInnerHTML.indexOf("User")+5,oldInnerHTML.indexOf("and his/her")-2);
              curElement.innerHTML = curElement.innerHTML.replace("was silenced by","silenced by");
              continue
          }

          if (!curElement.innerText.match(/[A-Za-z0-9]/g)) { curElement.parentNode.removeChild(curElement); continue}

          //shorten/hide "Notices"
          if (/Notice:/i.test(oldInnerHTML)) {
              curElement.innerHTML = curElement.innerHTML.replace(/Notice:/g,"\*");
              curElement.innerHTML = curElement.innerHTML.replace(/( )?sec(ond)?(s)?\b/gi,"s");
              curElement.innerHTML = curElement.innerHTML.replace(/( )?minute/gi,'min');
              curElement.innerHTML = curElement.innerHTML.replace(/levels?( )?/gi,'');
              curElement.innerHTML = curElement.innerHTML.replace(/( )?vibration(s)?( )?/gi,'');
              curElement.innerHTML = curElement.innerHTML.replace(/Lovense Toy IS A INTERACTIVE VIBRATOR THAT RESPONDS TO YOUR TIPS.?/gi, "");

              // if the inner text has no regular letters, get rid of it
              if (!(/[A-Za-z0-9]/g.test(curElement.innerText))) { curElement.parentNode.removeChild(curElement); continue}

              // remove leaderboards
              y = curElement.getElementsByTagName('span');
              if (/leaderboard/i.test(curElement.innerText && y.length > 2)) {
                curElement.parentNode.removeChild(curElement); continue
              }

              // remove bright colors, add bold text
              y = curElement.getElementsByTagName('p')[0];
              if (y) {y.removeAttribute('style');y.style.fontWeight = '700';}

              // Format a standard tip menu
              const blockTipMenuMatch = curElement.innerText.match(/■/g);
              if (  curElement.innerHTML.match(/(?<=>| )([A-Za-z \d/()!♥:][A-Za-z \d/()!♥:><^\.]*?)(\(\d+\))/gi)
                ||  curElement.innerHTML.match(/\b\d+-\d+\b/gi)
                || /'s tip menu:?/i.test(curElement.innerHTML)
                || /tip menu:?/i.test(curElement.innerHTML)
                ||  blockTipMenuMatch) {

                  // "<div class="text"><p style="background: transparent; color: rgb(0, 0, 0); font-weight: bold; display: inline-block;"><span style="display: block;"><span class="emoticonImage">Notice: Tip Menu: hi(5) <span style="color: lightskyblue;">pixelglitter</span><span> ass tease(35) </span><span style="color: lightskyblue;">pixelglitter</span><span> tits out(55) </span><span style="color: lightskyblue;">pixelglitter</span><span>  youre hot(66) </span><span style="color: lightskyblue;">pixelglitter</span><span> pussy flash(100) </span></span></span></p></div>"

                  if (curElement.innerText.includes('tokens to group')) continue
                  curElement.innerHTML
                    = curElement.innerHTML.replace(/tip menu:/i, "");
                  // curElement.innerHTML
                  //   = curElement.innerHTML.replace(/\b(\d+s)\b/i, "$1<br>")
                  curElement.innerHTML
                    = curElement.innerHTML.replace(/⭐\d+ - Tip/gi, "<br>");


                  curElement.innerHTML
                    = curElement.innerHTML.replace(/(<span class="emoticonImage">)"?[A-Za-z \d/()'!♥😈💌🎱🖐😍💜💗🐱🎉🎱😈🖐🎁🎵👻💦💕🎲#:><^\*\.,;\+\-\/\$]*?"?(<span)/g, "$1$2");

                  if (blockTipMenuMatch) {
                    curElement.innerHTML = curElement.innerHTML.replace(/([ ]?■[ ]?)+/gi, '■');
                    // curElement.innerHTML = blockTipMenuMatch.length > 1
                    //   ? curElement.innerHTML.replace(/■/gi, '<br>')
                    //   : curElement.innerHTML.replace(/(■|\|)/gi, '')
                  }

                  const lightblueSpans = curElement.querySelectorAll('span[style="color: lightskyblue;"]');
                  // This line can remove tip menu items
                  if (lightblueSpans) lightblueSpans.forEach(el => el.parentNode.removeChild(el));

                  curElement.innerHTML
                    = curElement.innerHTML
                      .replace(/(?<=>| )([A-Za-z \d/()!♥:][A-Za-z \d/()'!♥😈💌🎱🖐😍💜💗🐱🎉🎱😈🖐🎁🎵👻💦💕🎲#:><^\*\.,;\+\-\/\$]*?)(\((\d+)\))\s*?[\|]?/gi
                              , "<span class=\"tip_list_item\"><span class=\"tip_list_number\">$3</span>: $1</span>"
                      );

                  // console.log("curElement", curElement.innerHTML)

                  curElement.innerHTML = curElement.innerHTML.replace(/>\*( |&nbsp;)*/g, '>');
                  curElement.innerHTML = curElement.innerHTML.replace(/>( |&nbsp;)*</g, '><');
                  curElement.innerHTML = curElement.innerHTML.replace(/ ?\| ?/g, '');

                  curElement.innerHTML = "<b><u style=\"display:block;\">Tip Menu</u></b>" + curElement.innerHTML;


                  addToSpecialNoticeDiv(curElement);

                  // Scroll to bottom of chat list after reformatting tip menus
                  document.querySelector('.chat-list').scrollTop
                    = document.querySelector('.chat-list').scrollHeight;

                  continue
              } // end if tipmenu

              //these phrases will make a notice be hidden
              const hideList
                = [ "thank you"
                  , "thanks"
                  , "welcome"
                  , "that vibrates"
                  , "your tips"
                  , "tokens to group"];
              const showList
                = [ "how start"
                  , "icket sold"];
              let hideMe;

              // determine if notice should be hidden
              hideMe = hideList.some(e=>curElement.innerText.toLowerCase().includes(e));
              if (hideMe) hideMe = !showList.some(e=>curElement.innerHTML.includes(e));

              if (hideMe  // hide the ones that are just an asterisk (with a space after)
                || !curElement.innerText.match(/[A-Za-z0-9]/g)) {
                  console.log(curElement.innerText);
                  // i--
                  curElement.parentNode.removeChild(curElement);
                  continue
              }

              x = curElement.getElementsByTagName('span')[0];
              if (x) {
                if (x.style.backgroundColor) {
                  x.style.backgroundColor = '#000';
                  x.style.color = mainFront;
                  addToSpecialNoticeDiv(curElement);
                }
              }
          }
        }
      // },50)
    });

    let loopingTipFunction;

    function tokenTrickler() {
      // button id: id_tip_message
      // tip amount id: id_tip_amount
      // class: "overlay_popup tip_popup"
      const tokencount = document.getElementsByClassName('tokencount')[0];
      const numAtStart = parseInt(tokencount.innerText);
      const minTokensLeftover = 25;
      if (numAtStart < minTokensLeftover){
        alert('you need more tokens');
        return
      }

      console.log('tokenTrickler happened');

      const trickleButton = document.getElementById('trickle_button_tip');
      const trickleCancel = document.getElementById('trickle_button_cancel');
      const tipPopup = document.getElementsByClassName("overlay_popup tip_popup")[0];
      const tipAmountDiv = document.getElementById('id_tip_amount');
      const openTipDialogButton = document.querySelector('.green_button_tip a.tip_button');
      const sendTipButton = document.getElementById('id_tip_message');
      const remainingTrickleCount = document.getElementById('remainingTrickleCount');

      const trickleValueInput       = document.getElementById('trickle_value');
      const trickleIterationsInput  = document.getElementById('trickle_iterations');
      const trickleIntervalInput    = document.getElementById('trickle_seconds');

      let trickleInterval = parseInt(trickleIntervalInput.value);
      if (trickleInterval < 1) trickleInterval = 1;

      let trickleValue = parseInt(trickleValueInput.value) || 1;
      if (trickleValue < 1) trickleValue = 1;

      let trickleCount = parseInt(trickleIterationsInput.value) || 4;
      if (trickleCount < 1) trickleCount = 1;
      if ((trickleCount * trickleValue) > (numAtStart - minTokensLeftover)) {
        alert('reducing number of tips due to low tokens');
        trickleCount = Math.floor((numAtStart - minTokensLeftover) / trickleValue);
      }
      if (trickleCount < 1) return


      const fetchURL = buildLoopingTipFetchURL();
      const fetchConfig = buildLoopingTipFetchConfig(trickleValue);

      trickleButton.style.display = 'none';
      trickleCancel.style.display = 'block';

      trickleValueInput.setAttribute('readonly','true');
      trickleIterationsInput.setAttribute('readonly','true');
      trickleIntervalInput.setAttribute('readonly','true');

      remainingTrickleCount.innerText = --trickleCount;
      console.log('tokenTrickler is beginning');
      fetch(fetchURL,fetchConfig);

      loopingTipFunction = setInterval(()=>{
        if (trickleCount-- > 0) {
          console.log('tokenTrickler is happening');
          fetch(fetchURL,fetchConfig);

          remainingTrickleCount.innerText = trickleCount;
        } else {
          stopTokenTrickler();
        }
      }, (960 * (trickleInterval || 1)));
    }

    function stopTokenTrickler () {
      clearInterval(loopingTipFunction);
      const trickleButton = document.getElementById('trickle_button_tip');
      const trickleCancel = document.getElementById('trickle_button_cancel');
      trickleButton.style.display = 'block';
      trickleCancel.style.display = 'none';

      const trickleValueInput       = document.getElementById('trickle_value');
      const trickleIterationsInput  = document.getElementById('trickle_iterations');
      const trickleIntervalInput    = document.getElementById('trickle_seconds');

      trickleValueInput.removeAttribute('readonly');
      trickleIterationsInput.removeAttribute('readonly');
      trickleIntervalInput.removeAttribute('readonly');

      trickleValueInput.value = 1;
      trickleIterationsInput.value = 60;
      trickleIntervalInput.value = 1;

      // const tipPopup = document.getElementsByClassName("overlay_popup tip_popup")[0]
      // tipPopup.style.opacity = '1'
    }

    function buildLoopingTipFetchURL() {
      const roomNameWithSlashesMatch = String(window.location).match(/\/\w+\//);
      if (!roomNameWithSlashesMatch) return
      return "https://chaturbate.com/tipping/send_tip" + roomNameWithSlashesMatch[0]
    }

    function buildLoopingTipFetchConfig(tipValue=1) {
      const result
        = {	"credentials":"include"
          ,	"headers":{	"accept":"application/json, text/javascript, */*; q=0.01"
                      , "accept-language":"en-US,en;q=0.9,la;q=0.8"
                      , "content-type":"application/x-www-form-urlencoded"
                      , "sec-fetch-mode":"cors"
                      , "sec-fetch-site":"same-origin"
                      // , "x-csrftoken":"f2NOCuXwmkF9DYRzo3PGtEeMlm5boxyG1IjBmKYhfqkknDfrSeec1CaYTdB8Vz4Y"
                      , "x-requested-with":"XMLHttpRequest"
                      }
          ,	"referrer":"https://chaturbate.com"
          , "referrerPolicy":"strict-origin-when-cross-origin"
          , "body": `tip_amount=${tipValue}&message=&tip_room_type=public&tip_v=0`
          , "method":"POST"
          , "mode":"cors"
        };
      const csrfmiddlewaretoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
      result.body = `csrfmiddlewaretoken=${csrfmiddlewaretoken}&${result.body}`;
      const csrftoken = $.cookie('csrftoken');
      result.headers['x-csrftoken'] = csrftoken;
      result.referrer = `${result.referrer}${window.location.pathname}`;
      if (!csrftoken || !csrfmiddlewaretoken) throw err
      return result
    }

    function passFocusBetweenTrickleInputs (ev) {
      // ev.preventDefault()

      if (ev.keyCode !== 13) return

      const trickleValueInput       = document.getElementById('trickle_value');
      const trickleIterationsInput  = document.getElementById('trickle_iterations');
      const trickleIntervalInput    = document.getElementById('trickle_seconds');
      const startTrickleButton      = document.getElementById('trickle_button_tip');

      if (!( trickleValueInput
          && trickleIterationsInput
          && trickleIntervalInput
          && startTrickleButton
      )) {
        return
      }

      if (document.activeElement === trickleValueInput) {
        trickleIterationsInput.focus();
      } else if (document.activeElement === trickleIterationsInput) {
        trickleIntervalInput.focus();
      } else if (document.activeElement === trickleIntervalInput) {
        startTrickleButton.focus();
        ev.preventDefault();
      }

    }

    doMoreScript();

    if (document.querySelector("#player")) {
      reformatVideoPage();
    }

  }; // end miscellaneousLooseEnds

  const plainTextStyle
    =  `background: ${darkMinBack};
      background-color: ${darkMinBack};
      color: ${darkMaxFront};
      `.replace(/\n\s+/g, " ").trim();

  const tipReceivedBlockStyle
    =  `display: flex;
      flex-direction: row-reverse;
      background: ${tipBackgroundColor};
      background-color: ${tipBackgroundColor};
      padding-right: 3px;
      `.replace(/\n\s+/g, " ").trim();
  const tipCountReceivedStyle
    =  `text-align:right;
      display: inline-block;
      width: 54px;
      padding-right: 2px;
      `.replace(/\n\s+/g, " ").trim();

  const tipPriceStyle
    =  `text-align:right;
      display: inline-block;
      width: 50px;
      padding-right: 4px;
      `.replace(/\n\s+/g, " ").trim();

  function createElementFromHTML (htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild
  }

  function deleteElement (el) {
    if (!el) return
    el.parentNode.removeChild(el);
  } // end of deleteElement

  function getBooleanFromLS (key) {
    const rawJSON = localStorage.getItem(key) || 'false';
    return JSON.parse(rawJSON)
  } // end of getBooleanFromLS

  function getArrayFromLS (key) {
    const rawJSON = localStorage.getItem(key) || '[]';
    return JSON.parse(rawJSON)
  } // end of getArrayFromLS

  function getObjectFromLS (key) {
    const rawJSON = localStorage.getItem(key) || '{}';
    return JSON.parse(rawJSON)
  } // end of getObjectFromLS

  function setItemInLS (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  } // end of setObjectInLS

  function elReplace (el, oldVal, newVal) {
    el.innerHTML = el.innerHTML.replace(oldVal, newVal);
  } // end of elReplace

  function scrollToBottom(el) {
    if (!el) return
    el.parentNode.scrollTop = el.scrollHeight;
  }

  function removeAllBackgroundColorsFromNodeList (elList) {
    elList.forEach(el => {
      el.style.background = "";
      el.style.backgroundColor = "";
      el.style.color = darkMaxFront;
    });
  }

  const mutationSelectors
    = {
    camTabListOnGallery: 'ul.sub-nav' // [ts="G"]'
    , camTabListOnVideo: '.genderTabs > div > div'
    // , camsList: '#room_list_1.list'
    , camsList: '.c-1.endless_page_template'
    , chatList: 'div #ChatTabContents .message-list'
    , pmChatList: 'div #ChatTabContents .message-list'
    , bioContent: '.BioContents' // > table'
    , bioContentAgain: '.BioContents' // > table'
    , similarCamsList: 'div#roomTabs > div.defaultColor'
    , roomSubject: `#VideoPanel > div.defaultColor`
    , goalTracker: '#VideoPanel > div[ts="ym"] span'
  };

  const tabSelectorsList
    = [{
      singlePost: 'li.gender-tab a[href="/male-cams/"]'
      , parentNodeCount: 1
    }
      , {
      singlePost: 'li.gender-tab a[href="/trans-cams/"]'
      , parentNodeCount: 1
    }
      , {
      singlePost: 'a.gender-tab[href="/male-cams/"]'
      , parentNodeCount: 0
    }
      , {
      singlePost: 'a.gender-tab[href="/trans-cams/"]'
      , parentNodeCount: 0
    }
    ];

  function standardNoticeReplacements (el, additionalStyles = "", noAsterisk = false) {
    el.setAttribute('style', plainTextStyle + additionalStyles);

    noAsterisk
      ? elReplace(el, /Notice: ?/gi, '')
      : elReplace(el, /Notice: ?/gi, '* ');
    elReplace(el, /Notice: ?/gi, '* ');
    elReplace(el, / *&nbsp; */g, '');
    elReplace(el, /(\d)? *\bsec(ond)?(s)?\b/gi, '$1s');
    elReplace(el, /(\d *)?\bminute/gi, '$1min');
    elReplace(el, /\blevels?( )?/gi, '');
    elReplace(el, /\bvibration(s)?( )?/gi, '');
    const singleTipMenuOptionRegex = /^\* +\((\d+)\) */;
    if (singleTipMenuOptionRegex.test(el.innerHTML)) {
      elReplace(el, /^(\*)? *\((\d+)\) */, `* <span style="${tipPriceStyle}">$1:</span>`);
      el.style.fontWeight = "bold";
    }
  } // end of standardNoticeReplacements

  function removeMaleAndTransTabs (tabListEl) {
    let targetEl;
    // Remove MEN and TRANS tabs
    tabSelectorsList.forEach(tab => {
      targetEl = tabListEl.querySelector(tab.singlePost);
      if (!targetEl) return
      for (let i = 0; i < tab.parentNodeCount; i++) targetEl = targetEl.parentNode;
      // console.log(`Removing tab: ${targetEl.innerText}`)
      // targetEl.setAttribute('hidden', 'true') // doesn't work
      targetEl.setAttribute('style', 'display:none;');
    }); // end foreach tab

  } // end function removeMaleAndTransTabs

  function hideModelPageAds (el) {
    const modelAdList = el.querySelectorAll('[rel="nofollow"][style]:not([style=""])');
    if (modelAdList.length === 0) {
      console.log("Found no model ads - skipping");
      return
    }
    console.log("Hiding Model ads");
    modelAdList.forEach(modelAd => {
      if (!modelAd) return
      const elPosition = modelAd.style.position;
      if (elPosition === 'absolute' || elPosition === 'fixed') {
        // modelAd.style.opacity = 0
        // modelAd.style.display = 'none'
        modelAd.style.visibility = 'hidden';
        // modelAd.setAttribute('hidden', 'true')
      }
    }); // end forEach modelAd
  } // end of hideModelPageAds

  function addSearchTabs (el) {
    const genderTabsContainer = document.querySelector('.genderTabs > div > div');
    if (!genderTabsContainer) {
      console.log("WELL SHIT NO TABS CONTAINER");
      return
    }
    // let modelName = document.title.split(' ')[2].trim()
    let modelName = document.title.split('\'')[0].trim();
    // setTimeout(() => {
    //   modelName = document.title.split(' ')[2].trim()
    // }, 400)
    const searchTabDetailsList
      = [{
        id: 'cam-whores-link'
        , label: 'CW'
        , title: `Search for "${modelName}" on camwhores.tv`
        , href: `https://www.camwhores.tv/search/${modelName}/`
      } // https://www.camwhores.tv/search/birdylovesit/
        // , { id: 'cam-vids-link'
        //   , label: 'CV SEARCH'
        //   , title: `Search for "${modelName}" on camvideos.tv`
        //   , href: `http://www.camvideos.tv/search/${modelName}/` } // http://www.camvideos.tv/search/birdylovesit/
        // , { id: 'cam-whores-hd-link'
        //   , label: 'CW-HD SEARCH'
        //   , title: `Search for "${modelName}" on cawwhoreshd.com`
        //   , href: `http://www.camwhoreshd.com/search/${modelName}/` } // https://www.camwhoreshd.com/search/birdylovesit/
        , {
        id: 'porn-bb-link'
        , label: 'PORN-BB'
        , title: `Search for "${modelName}" on pornbb.org`
        , href: `https://www.pornbb.org/newsearch.php?search_keywords=${modelName}`
      },
        , {
        id: 'live-cam-rips-link'
        , label: 'RIPS'
        , title: `Search for "${modelName}" on livecamrips.com`
        , href: ` https://www.livecamrips.com/search/${modelName}/1`// https://www.livecamrips.com/search/annie/1
      },
      {
        id: 'recurbate-link'
        , label: 'RCB'
        , title: `Search for "${modelName}" on camvideos.me`
        // , href: `https://recurbate.com/performer/${(modelName || '').toLowerCase()}` } // https://recurbate.com/performer/bitter_moon
        , href: `http://camvideos.me/search/${(modelName || '').toLowerCase()}` // http://camvideos.me/search/upstatebaddie
      }

      ]; // end searchTabDetailsList
    searchTabDetailsList.forEach(searchTabOptions => {
      createSearchTabElement(genderTabsContainer, searchTabOptions);
    });

  } // end of addSearchTabs

  function createSearchTabElement (el, options) {
    let newTabContainer = el.querySelector(`#custom-search-tabs-div`);
    if (!newTabContainer) {
      console.log("Creating a container for search tabs");
      newTabContainer = createElementFromHTML(`
      <div id="custom-search-tabs-div" style="display:flex;flex-direction:row;justify-content:flex-end;"></div>
    `);
      el.append(newTabContainer);
    } // end if

    let newTab = el.querySelector(`#custom-search-tabs-div #${options.id}`);
    if (!newTab) {

      console.log(`Creating a search tab for "${options.id}"`);
      newTab = createElementFromHTML(`
      <a class="gender-tab tabAnchor tabBorder tabInactiveColor tabInactiveBgColor"
        id="${options.id}"
        target="_blank"
        style="height: 100%; overflow: hidden; -webkit-tap-highlight-color: transparent; display: inline-block; float: none; box-sizing: border-box; padding: 5px 11px 4px; margin-right: 2px; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; border-style: solid; border-width: 1px; border-radius: 4px 4px 0px 0px; font-size: 13px; text-decoration: none; cursor: pointer; max-width: 176px; text-overflow: ellipsis; white-space: nowrap; text-size-adjust: none; width: auto;"
      >
        ${options.label}
      </a>
    `);
      newTabContainer.append(newTab);
    } // end if
    newTab.title = options.title;
    newTab.href = options.href;
  } // end function createSearchTabElement

  // style="height: 100%; overflow: hidden; -webkit-tap-highlight-color: transparent; display: inline-block; float: none; box-sizing: border-box; padding: 5px 11px 4px; margin-right: 2px; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; border-style: solid; border-width: 1px; border-radius: 4px 4px 0px 0px; font-size: 13px; text-decoration: none; cursor: pointer; max-width: 176px; text-overflow: ellipsis; white-space: nowrap; text-size-adjust: none; width: 149px;"


  const camsSelectors
    = {
    mainCam: {
      selector: '.room_list_room .details .title a'
      , hide: (el) => { el.setAttribute('style', 'display:none;'); }
      , getTarget: (el) => el.parentNode.parentNode.parentNode
      , parentNodeCount: 3
    }
    , similarCams: {
      selector: '.roomCard .cardTitle > a.camHrefColor'
      , hide: (el) => { el.setAttribute('style', 'display:none;'); }
      // , hide: (el) => { t.deleteElement(el) }
      , getTarget: (el) => el.parentNode.parentNode.parentNode
      , parentNodeCount: 3
    }
  };

  function processCamsList (camsListEl) {
    hideGenderClass(camsListEl, "genderm");
    hideGenderClass(camsListEl, "genders");

    console.log("Dealing with cams list");

    let followedArray = getArrayFromLS('followedModels')
      , con
      , modelNamesElementList;

    for (const key in camsSelectors) {
      con = camsSelectors[key];
      modelNamesElementList = camsListEl.querySelectorAll(con.selector);
      if (modelNamesElementList.length > 0) break
    } // end for loop
    if (modelNamesElementList.length === 0) {
      return
    }
    // document.querySelector(".room_list_room a:nth-of-type(2)").parentNode.parentNode.parentNode.parentNode

    if (window.location.href === "https://chaturbate.com/followed-cams/") {
      followedArray = [];
      modelNamesElementList.forEach(e => followedArray.push(e.innerText.trim()));
      setItemInLS('followedModels', followedArray);
      console.log("Updated List of Followed Models");
      console.log(JSON.stringify(followedArray, null, 2));
    } else {
      console.log("Hiding Followed Models...");
      // console.log(JSON.stringify(followedArray, null, 2))
      modelNamesElementList.forEach(el => {
        const modelName = el.innerText;
        const targetEl = con.getTarget(el);
        if (followedArray.indexOf(modelName) !== -1) {
          // console.log(`Hiding "${modelName}..."`)
          con.hide(targetEl);
        }
      }); // end forEach
    } // end else
  } // end function processCamsList

  function hideGenderClass (el, genderClass) {
    const classList = el.getElementsByClassName(genderClass);
    for (i = classList.length - 1; i >= 0; i--) {
      // console.log(`Hiding "${genderClass}" cam...`)
      deleteElement(classList[i].parentNode.parentNode.parentNode.parentNode);
    } // end for loop
  } // end function hideGenderClass

  const recordedNotices = [];

  const savedNotices = [];
  function saveToList (el) { savedNotices.push(el); }

  function isTipMenu (spanList) {
    const foundMatchingTipMenuRegex
      = (
          (/Tip Menu:/i.test(spanList[0].innerText.trim()))
          ||
          (/Tip Menu:?$/.test(spanList[0].innerText.trim()))
        );
    return foundMatchingTipMenuRegex
      ? { regex: "magic"}
      : undefined
  } // end of isTipMenu

  function processStandardTipMenu (spanList, options={}) {
    const parentSpanEl = spanList[0].parentNode;
    elReplace(spanList[0], /(Notice: *)?tip menu:? */i, '');
    if (spanList.length > 2) {
      spanList.forEach(spanEl => {
        console.log(spanEl.innerHTML);
        if (/^:[0-9a-z]+$/.test(spanEl.innerText)) {
          spanEl.innerHTML = ''; // "&nbsp;"
          return
        }
        standardNoticeReplacements(spanEl, "line-height: 1.4em;", true);
        const numList = spanEl.innerText.match(/\d+/g);
        if (!numList) {
          console.log("no num found");
          return
        }
        const price = numList[numList.length - 1];
        const regex = new RegExp(` *\\(?${price}\\)? *`, '');
        elReplace(spanEl, regex, '<br>');
        elReplace(spanEl, /^ +/, '');
        spanEl.innerHTML = `<span style="${tipPriceStyle}">${price}: </span>` + spanEl.innerHTML;
      }); // end forEach
    } // end if
    else {
      console.log(`spanList.length is "${spanList.length}"`);
      spanList.forEach((spanEl, index) => {
        // const spanEl = spanList[0]
        console.log(spanEl.innerHTML);
        standardNoticeReplacements(spanEl, "", true);
        const priceRegex = /\(\d+\)/g;
        const priceList = spanEl.innerText.match(priceRegex) || [];
        const optionList
          = spanEl.innerText
            .split(priceRegex)
            .map(e=>{
              return e.trim()
                .replace(/^[\|:♦♥] */, '') // remove preceding separator characters
                .replace(/ *[\|:♦♥]$/, '') // remove trailing separator characters // may be unnecessary
            });
        let res = '';
        optionList.forEach((option, index) => {
          if (priceList.length === 0) return
          if (!option) return
          const price
            = priceList[index]
              ? priceList[index].replace(/(\(|\))/g,'')
              : '';
          res += `<span style="${plainTextStyle + "line-height: 1.4em;"}">
            <span style="${tipPriceStyle}">${price}:</span> ${option}
          </span><br>`;
        }); // end forEach option
        if (res) spanEl.innerHTML = res;
        // t.elReplace(spanList[0]
        // , /(?<=>| )([A-Za-z \d/()!♥:][A-Za-z \d/()'!♥😈💌🎱🖐😍💜💗🐱🎉🎱😈🖐🎁🎵👻💦💕🎲#:><^\*\.,;\+\-\/\$]*?)(\((\d+)\))\s*?[\|]?/gi
        // , `<span style="${cs.plainTextStyle + "line-height: 1.4em;"}"><span style="${cs.tipPriceStyle}">$3</span>: $1</span>`
        // )
      }); // end forEach spanList
    } // end else
    parentSpanEl.prepend(createElementFromHTML(`<span style="${plainTextStyle}">* <u>Tip Menu:</u><br></span>`));
    scrollToBottom(document.querySelector(mutationSelectors.chatList));
  } // end function processStandardTipMenu

  const qpick
    = { chatMessage: 'div.msg-text:not(.processed)'
      , roomNotice: '.roomNotice'
      , broadcaster: '.broadcaster'
      , usernamePrefix: 'div.purecolor'
      , chatText: 'span.purecolor.msg-text > span'
      , chatTextContainer: 'div:first-child'
      };

  const disallowedNotices
    = [ /^Notice: *?(-|\*)*? *?$/
      , /^Notice: *?(-|\*|\+)*? *?$/
      , /IS A INTERACTIVE VIBRATOR THAT RESPONDS TO YOUR TIPS/
      , /MY LOVENSE LUSH VIBRATOR IS SET TO REACT TO YOUR TIPS/
      , /Give me pleasure with your tips/
      , /Thank you for tipping,/
      , /Device that vibrates longer on your Tips!/
      , /I love it, thank you!+$/
      , /is now following me.$/
      , /^Notice: *?Thank you,/
      , /Thank you!+$/
      ];

  const alwaysVisibleNotices
    = [ /ticket sold/i
      , /show (is )?start/i
      , /prize/i
      ];

  const unsavedNotices
    = [ ...alwaysVisibleNotices
      , /Leader ?Board/i
      , /\b\d\. +\w+ \(\d+ tokens?\)$/i
      , /the high tipper is/i
      , /the king tipper is/i
      ];

  function filterChat (el) {
    const msgList = el.querySelectorAll(qpick.chatMessage);
    msgList.forEach(curMsgEl => {
      curMsgEl.classList.add('processed');

      const rNoticeEl = curMsgEl.querySelector(qpick.roomNotice);
      if (rNoticeEl) {
        handleNoticeEl(rNoticeEl) && saveToList(rNoticeEl);
        if (!curMsgEl.innerText) deleteElement(curMsgEl);
        return
      } // end if rNoticeEl

      const chatTextElList = curMsgEl.querySelectorAll(qpick.chatText);
      chatTextElList.forEach(chatTextEl => {
        chatTextEl.setAttribute('style', plainTextStyle);
      });
      const chatTextContainer = curMsgEl.querySelectorAll(qpick.chatTextContainer);
      chatTextContainer.forEach(containerEl => {
        containerEl.style.background = darkMinBack;
        containerEl.style.backgroundColor = darkMinBack;
      });

      const rBroadcastEl = curMsgEl.querySelector(qpick.broadcaster);
      if (rBroadcastEl) {
        handleBroadcastEl(curMsgEl) && saveToList(curMsgEl);
        if (!curMsgEl.innerText) deleteElement(curMsgEl);
        return
      } // end if rBroadcastEl

    }); // end forEach curMsg
  } // end of filterChat


  function handleNoticeEl (el) {
    if (/tipped \d+ token/.test(el.innerText)) {
      el.querySelector('div:first-child').style = tipReceivedBlockStyle;
      const tipCountSpanEl = el.querySelector('div:first-child span span');
      tipCountSpanEl.innerHTML = tipCountSpanEl.innerHTML.replace(/tipped (\d+) token(s)?/gi, "$1 tk");
      tipCountSpanEl.style = tipCountReceivedStyle;
      return
    } // end if tip

    if (/room subject changed to/.test(el.innerText)) {
      deleteElement(el.parentNode); return;
      // recordedNotices.push(el.innerText)
      // el.querySelector('div:first-child').setAttribute('style', `color:${xcolor.darkMaxFront};`)
      // const roomSubjectEl = el.querySelector('div:first-child span')
      // roomSubjectEl.innerHTML = roomSubjectEl.innerHTML.replace(/room subject changed to/, 'Room Subject:')
      // return
    } // end room subject changed

    if (/has (left|joined) the room/.test(el.innerText)) {
      // t.deleteElement(el.parentNode)
      const exitNoticeSpanElList = el.querySelectorAll('div span[class] > span');
      exitNoticeSpanElList.forEach(exitNoticeSpanEl => {
        exitNoticeSpanEl.setAttribute('style', plainTextStyle);
      });
      return
    }

    if (recordedNotices.indexOf(el.innerText) === -1) {
      recordedNotices.push(el.innerText);
    } else {
      deleteElement(el.parentNode);
      return
    }
    el.style.background = "";
    el.style.backgroundColor = "";
    const noticeSpanElList = el.querySelectorAll('div:first-child span span');
    const confirmTipMenu = isTipMenu(noticeSpanElList);
    if (confirmTipMenu) {
      console.log("Found a tip menu!");
      processStandardTipMenu(noticeSpanElList, confirmTipMenu);
      return true
    }
    noticeSpanElList.forEach((noticeSpanEl, index, elementList) => {
      if (  disallowedNotices.some(reg => reg.test(noticeSpanEl.innerText))
         && !alwaysVisibleNotices.some(reg => reg.test(noticeSpanEl.innerText))  ) {
        deleteElement(noticeSpanEl);
        return
      }
      standardNoticeReplacements(noticeSpanEl, "padding-bottom: 1px;");
    });

    return !unsavedNotices.some(reg => reg.test(el.innerText))
  } // end of handleNoticeEl

  function handleBroadcastEl (el) {
    const done = (userEl) => {
      el.classList.add('x-from-broadcaster');
      deleteElement(userEl);
    };
    const uEl = el.querySelector(qpick.broadcaster);
    const chatTextElList = el.querySelectorAll(qpick.chatText);
    chatTextElList.forEach(chatTextEl => {

      if (/Lovense toy has connected/.test(chatTextEl.innerHTML)) {
        chatTextEl.innerHTML = "*Lovense reconnected"; done(uEl); return
      }
      if (/accidentally disconnected/.test(chatTextEl.innerHTML)) {
        chatTextEl.innerHTML = "*Toy Disconnected! Tips going to queue..."; done(uEl); return
      }
      if (/does not have a toy connected/.test(chatTextEl.innerHTML)) {
        chatTextEl.innerHTML = "*No Toy Connected!!"; done(uEl); return
      }
      if (/Rules: No spamming/.test(chatTextEl.innerHTML)) {
        chatTextEl.innerHTML = "*"; done(uEl); return
      }

      // ********My LOVENSE Lush is now reacting to username 's tip. It will stop after 1 secondss
      if (/now reacting to/.test(chatTextEl.innerHTML)) {
        //shortens the "now reacting" messages
        chatTextEl.innerHTML = "* R"+chatTextEl.innerHTML.substring(chatTextEl.innerHTML.indexOf("now reacting")+5);
        elReplace(chatTextEl, / ?'s tip. It will stop after/, "'s tip for");
        elReplace(chatTextEl, /( )?second(s)?/gi,     "s");
        done(uEl);
      } else if (chatTextEl.innerHTML.includes("----")) {
          //shortens announcements usually made through model's username rather than "Notice"
          chatTextEl.innerHTML = chatTextEl.innerHTML.replace(/--+/g, '');

          standardNoticeReplacements(chatTextEl);
          chatTextEl.innerHTML += '<br>';
          done(uEl);
          return unsavedNotices.every(reg => !reg.test(chatTextEl.innerHTML))
      }
    }); // end forEach

  } // end function handleBroadcastEl

  const activeIntervals = {};
  const intervalCounts = {};

  function startMOInterval (sectionName, callback, options={}) {
    activeIntervals[sectionName]
      = setInterval(() => {
          putObserverOnEl(sectionName, callback, options);
        }, 500);
  } // end startMOInterval

  function putObserverOnEl (key, callback, options) {
    intervalCounts[key] = intervalCounts[key] || 0;
    intervalCounts[key]++;
    if (intervalCounts[key] > 8) {
      console.log(`Did not find element for "${key}"`);
      clearInterval(activeIntervals[key]);
      activeIntervals[key] = undefined;
      return
    }
    const el  = document.querySelector(mutationSelectors[key]);
    if (!el) return
    callback(el);
    const elConfig = options.config || { childList: true };
    const elObserver = options.observer || new MutationObserver((mutations) => {
          if (options.msg) console.log(options.msg);
          callback(el);
        }); // end MutationObserver
    elObserver.observe(el, elConfig);
    console.log(`Successfully put observer on "${key}"`);
    clearInterval(activeIntervals[key]);
    activeIntervals[key] = undefined;
  } // end function putObserverOnEl

  function putMutationObserverOnCamsList () {
    startMOInterval("camsList"
      , processCamsList
      , { msg: "processing camsList..."
        , config: { childList: true
                  , subtree: true
                  }
        }
    ); // end startMOInterval
  } // end function putMutationObserverOnCamsList

  function putMutationObserverOnChatList () {
    startMOInterval("chatList", filterChat);
  } // end function putMutationObserverOnChatList

  function putMutationObserverOnPMChatList () {
    startMOInterval("pmChatList", filterChat);
  } // end function putMutationObserverOnChatList

  function putMutationObserverOnBioTab () {
    startMOInterval("bioContent", hideModelPageAds);
  } // end function putMutationObserverOnBioTab

  function putMutationObserverOnSearchTabs () {
    startMOInterval("bioContentAgain", addSearchTabs);
  } // end function putMutationObserverOnBioTab

  function putMutationObserverOnSimilarCamsList () {
    startMOInterval("similarCamsList"
    , processCamsList
    , { msg: "processing similarCamsList..."
      , config: { childList: true
                , subtree: true
                }
      }
    );
  } // end function putMutationObserverOnSimilarCamsList

  function putMutationObserverOnCamTabsGallery () {
    startMOInterval("camTabListOnGallery"
      , removeMaleAndTransTabs
      , { config: { childList: true
                  , subtree: true
                  }
        }
    ); // end startMOInterval
  } // end function putMutationObserverOnCamsList

  function putMutationObserverOnCamTabsVideo () {
    startMOInterval("camTabListOnVideo"
      , removeMaleAndTransTabs
      , { config: { childList: true
                  , subtree: true
                  }
        }
    ); // end startMOInterval
  } // end function putMutationObserverOnCamsList

  function putMutationObserverOnGoalTracker () {
    startMOInterval("goalTracker"
      , (el) => {
          removeAllBackgroundColorsFromNodeList(el.querySelectorAll('span, div'));
          // t.removeAllBackgroundColorsFromNodeList(el.querySelectorAll('span:not([class]) span'))
          // t.removeAllBackgroundColorsFromNodeList(el.querySelectorAll('div:not([class]) div'))
        }
      , { config: { childList: true
                  , subtree: true
                  }
        }
    ); // end startMOInterval
  } // end function putMutationObserverOnCamsList

  function startMutationObservers () {
    putMutationObserverOnCamsList();
    putMutationObserverOnChatList();
    // putMutationObserverOnPMChatList()
    putMutationObserverOnBioTab();
    putMutationObserverOnSearchTabs();
    putMutationObserverOnSimilarCamsList();
    putMutationObserverOnCamTabsGallery();
    putMutationObserverOnCamTabsVideo();
    putMutationObserverOnGoalTracker();
  } // end of startMutationObservers

  // import  * as s from "./support.js"

  function additionalChanges () {
    startMutationObservers();

    //  FOR VIDEO PAGE
    // observe/filter chat - maintenance ongoing
    // tip menu formatting
    //    - better id which elements are tip menus
    //      - list all tip menu formats and define unique procedures for each
    //    - configurable regex for finding prices
    // add title to tips with approx $$$ conversion
    // count percentage of anonymous users
    // tip trickler
    // toggle hiding ads?
    // Add search link to cw and camvids

    //  FOR GENERAL PURPOSE
    // embed config menu at top of page
    //    - hide/show adds
    //    - add/remove certain custom styles

  } // end function additionalChanges

  const unused = "//  @include      /^https?://(www)?\.?(members)?\.?hanime\.tv/videos/";

  const joinUrlRegex = new RegExp(`https?://(www\\.)?chaturbate\\.com/\\?join_overlay=1`);
  if (joinUrlRegex.test(window.location.href)) {
    // similar behavior as an HTTP redirect
    window.location.replace("https://chaturbate.com/followed-cams/");
  }

  const loginUrlRegex = new RegExp(`https?://(www\\.)?chaturbate\\.com/auth/login/$`);
  if (loginUrlRegex.test(window.location.href)) {
    // similar behavior as an HTTP redirect
    window.location.replace("https://chaturbate.com/auth/login/?next=/followed-cams/");
  }

  chaturbateClean();
  addCustomStyleTag();
  // miscellaneousLooseEnds()
  additionalChanges();

}());
