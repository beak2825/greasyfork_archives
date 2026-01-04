// ==UserScript==
// @name         Alternative download of Google Play
// @namespace    CHUN
// @version      2.2.8
// @description  Adds APKFollow, APKDot and APKForAndroid download buttons to Google Play when browsing apps. This script is based on StephenP's "Direct download from Google Play".
// @author       CHUN
// @match        https://play.google.com/*
// @match        http://play.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375657/Alternative%20download%20of%20Google%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/375657/Alternative%20download%20of%20Google%20Play.meta.js
// ==/UserScript==
var ui;
var wlButton;
var pageURL;
var title;
var appCwiz;
(function() {
  try{
        'use strict';
        var site=window.location.href.toString();
        ui=checkUI();
        pageURL=location.href;
        title=document.getElementById("main-title").innerHTML;
        if(ui>=3){
          var buttonsStyle=document.createElement("style");
          var styleString='.ddlButton:visited{color: white;} .ddlButton:hover{opacity: 0.8;} .ddlButton:active{opacity: 0.6;} .ddlButton{color: white; border-radius: 4px; border: 1px; font-size: 14px; height: 46px; padding: 9px 20px; font-weight: 500; font-family: "Roboto",sans-serif; position: relative; text-align: center; line-height: 46px;';
          if(ui==3){
            styleString+=' margin-right: 4px;}';
            buttonsStyle.innerHTML=styleString;
          }
          if(ui==4){
            styleString+=' margin-left: 4px;}';
            buttonsStyle.innerHTML=styleString;
          }
          document.body.appendChild(buttonsStyle);
        }
        if(pageURL.includes("details?id=")){
          addButtons();
        }
        setInterval(checkReload, 3000);
  }
  catch(err){
    console.log("main(): "+err);
  }
})();
function waitForRemovingButtons(){
    if(title!=document.getElementById("main-title").innerHTML){
        title=document.getElementById("main-title").innerHTML;
        pageURL=location.href;
        wlButton=null;
        if(location.href.includes("details?id=")){
            if(ui>=3){
                removePreviousCwiz();
            }
            addButtons();
        }
    }
    else{
        setTimeout(waitForRemovingButtons, 1000);
    }
}
function checkReload(){
    if(pageURL!=location.href){
            waitForRemovingButtons();
    }
}
function addButtons(){
    var price=-1;
    var installButton=null;
    var instWishButtons=[];
    if(ui<=2){
        installButton=document.getElementsByClassName("buy")[0];
      	try{
        	price=installButton.firstElementChild.firstElementChild.getElementsByTagName("META")[1].content;
          //alert("Price: "+price);
        }
        catch(err){
          console.error("Price not found. Maybe the app is already installed?");
          price=0;
        }
    }
    else{
        instWishButtons=getUglyUIButtons();
        if(ui==3){
        	installButton=instWishButtons[0];
        }
        else{
          installButton=instWishButtons[1];     //if the app is installed, the whishlist button is absent, so the install button is the first and only
          if(typeof installButton==='undefined'){
            installButton=instWishButtons[0];
          }
        }
        do{
            installButton=installButton.parentNode;
        }while(installButton.tagName!="C-WIZ");
        try{
      		price=installButton.firstElementChild.firstElementChild.getElementsByTagName("META")[1].content;
          //alert("Price: "+price);
        }
      	catch(err){
          console.error("Price not found. Maybe the app is already installed?");
          price=0;
        }
        //determina c-wiz dell'app per poterlo radere al suolo al cambio di pagina
        var currentNode;
        currentNode=installButton.parentNode;
        do{
            if(currentNode.tagName=="C-WIZ"){
                appCwiz=currentNode;
            }
            currentNode=currentNode.parentNode;
        }while(currentNode.tagName!="BODY");
    }
        if(price==0){
            var html;
            var buttonslist;
            var id=location.search.match(/id=(.*)/)[1].split("&", 1);
            var apkaURL='https://cn.apkhere.com/app/'+id;
            var apkbURL='https://apkdot.com/?s='+id;
            var apkcURL='https://apktada.com/app/'+id;
            
            var apkaName='APKHERE';
            var apkbName='APKDOT';
            var apkcName='APKTADA';
            
            //var apkfollowURL='https://www.apkfollow.com/search?q='+id;
            //var apk4andURL='http://apkforandroid.org/search.php?q='+id;
            
            //var apkpureURL='https://m.apkpure.com/genericApp/'+id+'/download';
            //var evoziURL='https://apps.evozi.com/apk-downloader/?id='+id;
            //var apkdlURL='http://apkfind.com/store/captcha?app='+id;
            //var apkmirrorURL='https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s='+id;
            //var apkleecherURL='https://apkleecher.com/download/dl.php?dl='+id;
            wlButton = document.createDocumentFragment();
            var wishListButton;
            if(ui<=2){
                wishListButton=document.getElementsByClassName("id-wishlist-display")[0];
            }
            else{
              if(typeof instWishButtons[1]!=='undefined'){
                wishListButton=instWishButtons[0];
                do{
                    wishListButton=wishListButton.parentNode;
                }while(wishListButton.tagName!="C-WIZ");
              }
            }
            if(ui==1){
                buttonslist = document.getElementsByClassName("details-actions")[0];
                html='<span id="apkpurebutton"><a href="'+apkpureURL+'" style="background-color: #24cd77" class="medium play-button download-apk-button apps ">APKPure</a></span><span><a href="'+evoziURL+'" style="background-color: #286090" class="medium play-button download-apk-button apps ">Evozi</a></span><span><a href="'+apkmirrorURL+'" style="background-color: #FF8B14" class="medium play-button download-apk-button apps ">APKMirror</a></span>';
            }
            else if(ui==2){
                buttonslist = document.getElementsByClassName("details-actions-right")[0];
                html='<span id="apkpurebutton"><a href="'+apkpureURL+'" style="background-color: #24cd77" class="large play-button download-apk-button apps ">APKPure</a></span><span><a href="'+evoziURL+'" style="background-color: #286090" class="large play-button download-apk-button apps ">Evozi</a></span><span><a href="'+apkmirrorURL+'" style="background-color: #FF8B14" class="large play-button download-apk-button apps ">APKMirror</a></span>';
            }
            else{
                buttonslist = installButton.parentNode;
                html='<span id="apkpurebutton"><a href="'+apkaURL+'" style="background-color: #24cd77" class="ddlButton">'+apkaName+'</a></span><span><a href="'+apkbURL+'" style="background-color: #286090" class="ddlButton">'+apkbName+'</a></span><span><a href="'+apkcURL+'" style="background-color: #FF8B14" class="ddlButton">'+apkcName+'</a></span>';
            }
            if(ui<=2){
              wlButton.appendChild(wishListButton);
            }
            else{
              if(typeof wishListButton!=='undefined'){
              	wlButton.appendChild(wishListButton.firstChild.firstChild);
              }
            }
            buttonslist.innerHTML=buttonslist.innerHTML+html;
            buttonslist.appendChild(wlButton);
            /*var ddlButton=document.getElementById("apkleecherbutton");
            ddlButton.onclick=function(){ddl(this,apkleecherURL);};*/
        }
}
/*
function ddl(ddlButton,ddlURL){
    ddlButton.firstChild.innerHTML="Loading...";
    try{
        document.body.removeChild(document.getElementById('ddlFrame'));
    }
    catch(err){
    }
    finally{
        var hiddenFrame=document.createElement("iframe");
        hiddenFrame.style.width="0";
        hiddenFrame.style.height="0";
        hiddenFrame.setAttribute('id', 'ddlFrame');
        hiddenFrame.setAttribute('src', ddlURL);
        hiddenFrame.setAttribute('frameborder', "0");
        document.body.appendChild(hiddenFrame);
    }
}*/
function getUglyUIButtons()
{
  var matchingElements=[];
  var allElements = document.getElementsByTagName('button');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute("data-item-id")!==null)
    {
      if (allElements[i].getAttribute("data-item-id").startsWith("%.@.")===true){
          matchingElements.push(allElements[i]);
      }
    }
  }
  //alert(matchingElements.length); shows how many buttons for installation and whishlist are in the page
  return matchingElements;
}
function checkUI(){
    //Different UIs:
    //1=Mobile HTML
    //2=Desktop HTML
    //3=Mobile UglyUI
    //4=Desktop UglyUI
    var check;
    try{
        if(document.getElementsByClassName("action-bar-menu-button").length>0){
            check=1;
        }
        else{
            if(document.getElementsByClassName("details-info").length>0){
                check=2;
            }
            else{
                check=4;
                var metaTags=document.head.getElementsByTagName("meta");
                for(var i=0;i<metaTags.length;i++){
                    if(metaTags[i].getAttribute("name")=="mobile-web-app-capable"){
                        check=3;
                    }
               }
            }
        }
    }
    catch(err){
        console.error('The user interface of Google Play Store was not recognized by "Direct Download from Google Play" script. This might result in unexpected behaviour of the page. Please report the error to the author on Greasyfork. Error: '+err);
    }
    return check;
}
function removePreviousCwiz(){
    appCwiz.parentNode.removeChild(appCwiz);
}