// ==UserScript==
// @name         Direct download from Google Play
// @name:it      Download diretto dal Google Play Store
// @namespace    StephenP
// @version      3.6.2
// @description  Adds APK-DL, APKPure, APKCombo, APKPremier, APKMirror and Evozi download buttons to Google Play Store when browsing apps.
// @description:it  Aggiunge i tasti di download di APK-DL, APKPure, APKCombo, APKPremier, APKMirror e Evozi al Google Play Store quando si naviga tra le applicazioni.
// @author       StephenP
// @icon      data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAM1BMVEV2ZXLgIkzxMUf6OkN9f5v7ZTAOpP8OxP4myPsU1LkU1P4k4oAr3vwk7H1U41v+ziz92jIMI6b6AAAAAXRSTlMAQObYZgAAAKtJREFUOMul0ssSgyAMQNGAtCgv/f+vLcVCSCLiTLPL3MPAAoAn4/0EbP6eWDsRaxEx3gG7xe+MAIo4ABPhiIjXoBeCOCEiB0IkDphI+3EwQETaM+iIYyL3AhpxVKT3OSgCEeaFACgowiyLBE241WgE7ZEBhdFaVwA9CNi1vgQB+wCE1kcg1A4DQO6n5uxKleMgO/x6nrKKDrXX/eINpstV9D+G9SLIruCP+QAbnhEp2bGFogAAAABJRU5ErkJggg==
// @match        https://play.google.com/*
// @match        http://play.google.com/*
// @match        http://apkfind.com/store/captcha?app=*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @connect      self
// @connect      apkpure.com
// @connect      apkfind.com
// @connect      apk-cloud.com
// @connect      winudf.com
// @connect      apkcombo.com
// @connect      down-apk.com
// @connect      play.googleapis.com
// @connect      gvt1.com
// @connect      apkpremier.com
// @connect      web-api.aptoide.com
// @connect      apk.support
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/33005/Direct%20download%20from%20Google%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/33005/Direct%20download%20from%20Google%20Play.meta.js
// ==/UserScript==
var ui;
var wlButton;
var pageURL;
var title;
var appCwiz;
var done=[0];
var useGS;
(async function(){
  useGS=await GM.getValue("useGS", false);
  starter();
})();
function starter() {
  if(document.location.href.includes("apkfind")===true){
    setInterval(unredirect,100);
  }
  else{
    try{
      'use strict';
      var site=window.location.href.toString();
      ui=checkUI();
      pageURL=location.href;
      if(ui>0){
      	title=document.getElementById("main-title").innerHTML;
        var buttonsStyle=document.createElement("style");
        var styleString;
        styleString=`.ddlButton: visited {
                          color: white;
                      }
                      .ddlButton: hover {
                          opacity: 0.8;
                      }
                      .ddlButton: active {
                          opacity: 0.6;
                      }
                      .ddlButton {
                          font-family: "Google Sans",Roboto,Arial,sans-serif;
                          font-size: 1rem;
                          font-weight: 500;
                          padding: 0 10px;
                          color: white;
                          position: relative;
                          z-index: 0;
                          width: 100px;
                          cursor: pointer;
                      }
                      .ddlButton>a {
                          color: white;
                      }
                      .dropdown {
                          background-color:  #fff;
                          width: min-content;
                          border-radius: 8px;
                          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.7);
                          padding: 8px;
                          z-index: 1000;
                      }
                      #buttonDropdown > .ddlButton:first-child{
                          border-radius: 8px 8px 0 0;
                      }
                      #buttonDropdown > .ddlButton:last-child{
                          border-radius: 0 0 8px 8px;
                      }`;
        buttonsStyle.textContent=styleString;
        document.body.appendChild(buttonsStyle);
      }
      if((pageURL.includes("details?id="))||(pageURL.includes("/store/search?q="))){
        addButtons();
      }
      setInterval(checkReload, 2000);
    }
    catch(err){
      console.log("main(): "+err);
    }
	}
}
function unredirect(){
    var tot=document.body.children.length-1;
    if(parseInt(document.body.children[tot].style.zIndex, 10)>2){
      if(document.body.children[tot].id==""){
        document.body.children[tot].style.zIndex="1";
        document.body.children[tot-1].style.zIndex="-1000";
      }
      else{
        document.body.children[tot].style.zIndex="-1000";
      }
    }
}
function waitForRemovingButtons(){
    //if(title!=document.getElementById("main-title").innerHTML){
  	if((pageURL!=location.href)||(isButtonVisible()===false)){
        title=document.getElementById("main-title").innerHTML;
        pageURL=location.href;
        wlButton=null;
        if((location.href.includes("details?id="))||(location.href.includes("/store/search?q="))){
            if((ui>0)&&(document.getElementsByClassName("ddlButton").length>0)){
              	try{
                	removePreviousCwiz();
                }
              	catch(err){
                  console.log(err+"; I was probably just trying to remove buttons that weren't there...");
                }
            }
            addButtons();
        }
    }
    else{
        setTimeout(waitForRemovingButtons, 1000);
    }
}
function checkReload(){
    if((pageURL!=location.href)||(isButtonVisible()===false)){
            waitForRemovingButtons();
    }
}
function isButtonVisible(){
  var allButtons=document.getElementsByClassName("ddlButton");
  //console.log("how many buttons: "+allButtons.length);
  if(allButtons.length>0){
    for(var i=0;i<allButtons.length;i++){
      if(allButtons[i].offsetParent!=null){
        //console.log(i+true);
        return true;
      }
    }
    //console.log(i+false);
    return false;
  }
  else{
    if(document.location.href.includes("play.google.com/store/apps/details")){
      console.log("apppage//"+false);
      return false;
    }
    //console.log("notapppage//"+false);
    return true;
  }
}
function addButtons(){
    var price=-1;
    var installButton=null;
    var instWishButtons=[];
    if(ui>0){
        installButton=get2022UIButtons();
        while(installButton.tagName!="C-WIZ"){
            installButton=installButton.parentNode;
        }
        try{
      		price=installButton.querySelector("meta[itemprop=price]").content;
          //alert("Price: "+price);
        }
      	catch(err){
          console.error("Price not found. Maybe the app is already installed or not officially available?");
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
  	else{//this is the part for when you land on a missing application.
      document.getElementById("search-section").lastChild.remove();
      let searchSection=document.getElementById("search-section");
      let x=document.createElement("SPAN");
      x.style="margin-top: 32px; float: left";
      x.textContent="or ";
      searchSection.appendChild(x);
      let y=document.createElement("SPAN");
      let z=document.createElement("A");
      z.style="background-color: #FF8B14; font-weight: bold; text-decoration: none; padding: 1em; margin: 17px; float: left; color: white; cursor: pointer;";
      z.textContent="Search on APKMirror";
      z.className="rounded";
      z.id="apkMirrorBtn";
      //z.href='https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s='+location.search.match(/id=(.*)/)[1].split("&", 1);
      let apkmirrorURL='https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s='+location.search.match(/id=(.*)/)[1].split("&", 1);
      z.addEventListener("click",function opn(){window.open(apkmirrorURL)});
      y.appendChild(z);
      searchSection.appendChild(y);
      let w=document.createElement("DIV");
      w.style="clear:both";
      searchSection.appendChild(w);
      GM.xmlHttpRequest({
        method: "GET",
        url: 'https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s='+location.search.match(/id=(.*)/)[1].split("&", 1),
        timeout: 5000,
        onload: function(response){
       		let parser = new DOMParser();
     			let doc = parser.parseFromString(response.responseText, "text/html");
          if(doc.getElementById("content").getElementsByClassName("appRow").length>0){
            z.textContent="Available on APKMirror";
          }
          else{
            let w=z.cloneNode(true);
            w.textContent="Not available on APKMirror";
            w.style.backgroundColor="#CCCCCC";
            w.style.cursor="not-allowed";
            z.parentNode.replaceChild(w, z);
          }
     		}
      });
      //rough addition to allow the delisted applications to be retirieved
      installButton=x;
      price=0;
    }
    if(price==0){
      var html;
      var buttonslist;
      var id;
      if(location.href.includes("details?id=")){
         id=location.search.match(/id=(.*)/)[1].split("&", 1);
      }
      else if(location.href.includes("/store/search?q=")){
				 let idAttr=installButton.querySelector("[data-item-id^=\"%.@.\"]").getAttribute("data-item-id");
         id=idAttr.match(/%\.@\.".+"/)[0].replace("%.@.\"","").replace("\"","");
      }
      var apkpureURL='https://d.apkpure.com/b/APK/'+id+'?version=latest';
      var evoziURL='https://apps.evozi.com/apk-downloader/?id='+id;
      var apkdlURL='http://apkfind.com/store/download?id='+id;
      var apkmirrorURL='https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s='+id;
      var apkleecherURL='https://apkleecher.com/download/dl.php?dl='+id;
      var apkcomboURL='https://apkcombo.com/genericApp/'+id+'/download/apk';
      var apkpremierURL='https://apkpremier.com/download/'+id.toString().replace(/[.]/g,"-");
      var aptoideURL="https://web-api.aptoide.com/search?query="+id;
      var apksupportURL="https://apk.support/download-app/"+id;
      wlButton = document.createDocumentFragment();
      var wishListButton;
      var cn="";
      var html;
      buttonslist = installButton.parentNode;
      cn="ddlButton";
      // ... (keep existing variable declarations and ID handling)

      let mainButton = document.createElement("button");
      mainButton.className = cn; // Keep the same class for styling
      mainButton.textContent = 'Download ▼'; // Add arrow to indicate dropdown
      mainButton.style.backgroundColor="#F55"
      mainButton.style.borderRadius="8px";

      let dropdown = document.createElement("div");
      dropdown.id = "buttonDropdown";
      dropdown.style.position = "absolute";
      dropdown.style.display = "none";
      dropdown.style.marginTop = "5px";
      dropdown.className = "dropdown"; // Add class for styling

      // Add all options to dropdown
      dropdown.appendChild(createOptionButton('APK-DL', apkdlURL, '#009688', id, true, false));
      dropdown.appendChild(createOptionButton('APKPure', apkpureURL, '#24cd77', id, true, false));
      dropdown.appendChild(createOptionButton('APKCombo', apkcomboURL, '#00875f', id, true, true));
      dropdown.appendChild(createOptionButton('APKPremier', apkpremierURL, '#3740ff', id, true, false));
      dropdown.appendChild(createOptionButton('Evozi', evoziURL, '#286090', id, false, false));
      dropdown.appendChild(createOptionButton('APKMirror', apkmirrorURL, '#FF8B14', id, false, false));
      dropdown.appendChild(createOptionButton('Aptoide', aptoideURL, '#fe6446', id, true, false));
      dropdown.appendChild(createOptionButton('APKSupport', apksupportURL, '#3740ff', id, true, true));

      // Add click event to main button to show/hide dropdown
      mainButton.onclick = function() {
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      };

      // Close dropdown when clicking outside
     document.body.addEventListener('click', function(event) {
          console.log(event.target.closest('#buttonDropdown'));
          if (!event.target.closest('#buttonDropdown') && event.target !== mainButton) {
              dropdown.style.display = 'none';
          }
      });

      // Append main button and dropdown to buttonslist
      buttonslist.appendChild(mainButton);
      buttonslist.appendChild(dropdown);

// ... (keep existing ddl function definition)

      //document.getElementById("useGoogleServers").checked=useGS;
      //document.getElementById("gsExpl").addEventListener("click",function(){alert("If you choose the option \"Use Google\'s servers when downloading from APKCombo\", packages are directly downloaded form Play Store servers, but file names are randomized. Otherwise files are downloaded from APKCombo\'s own servers, with correct names.")});
    }
}
function createOptionButton(text, url, color, id, canDDL, hasExternalOptions) {
    let button = document.createElement("button");
    button.className="ddlButton";
    button.style.backgroundColor=color;
    if((!canDDL)||(hasExternalOptions)){
      let btnContent=document.createElement("A");
      btnContent.href=url;
      btnContent.textContent=text;
      button.appendChild(btnContent);
    }
    else{
      let btnContent=document.createElement("SPAN");
      btnContent.textContent=text;
      button.appendChild(btnContent);
    }
    if(canDDL){
      button.onclick = function() {
          ddl(this, url, id);
          return false
      };
    }
   else{
     button.onclick = function() {
          window.open(url);
          return false
      };
   }
    return button;
}
function openLink(link){
  window.open(link.replace("http://","https://"),"_self");
}
function ddlFinalApk(link,ddlButton,i){
  if(link!=""){
     done[i]=0;
     GM.xmlHttpRequest({
        method: "GET",
        url: link,
        timeout: 5000,
        ontimeout: function(response) {
          if(done[i]==0){
            ddlButton.firstChild.textContent="Retry";
          }
          else{
            done[i]=0;
          }
        },
       onprogress: function(response){
         //console.log(response.finalUrl);
         if((response.finalUrl.includes("winudf.com"))||(response.finalUrl.includes("down-apk.com"))||(response.finalUrl.includes("/play-apps-download-default/"))){
           if(done[i]==0){
             console.log("downloading file n."+i);
             done[i]=1;
             if(link.includes("apkpure")){
               window.open(response.finalUrl,"_self");
               ddlButton.onclick=function(){openLink(response.finalUrl);};
               ddlButton.firstChild.textContent="Ready!";
             }
             else if(link.includes("apkpremier")){
               window.open(response.finalUrl,"_self");
               ddlButton.onclick=function(){openLink(response.finalUrl);};
               ddlButton.firstChild.textContent="Ready!";
             }
             else{
               window.open(response.finalUrl,i);
               ddlButton.firstChild.textContent="APKCombo";
             }
           }
         }
        },
       	onload: function(response){
       		if(done[i]==0){
            ddlButton.firstChild.textContent="Retry";
          }
          else{
            done[i]=0;
          }
     		},
      	onerror: function(){
           buttonError(ddlButton,"Offline!");
         }
      });
    return 0
   }
   else{
     buttonError(ddlButton,"Failed!");
     return -1
   }
}
function ddl(ddlButton,ddlURL,packageId){
    ddlButton.firstChild.textContent="Loading...";
  	if(ddlURL.includes("apkfind")){
      try {
        var apkDlRequest1=GM.xmlHttpRequest({
              method: "GET",
              url: ddlURL,
              onload: function(response) {
                console.log(response);
                  if(response.finalUrl.includes("/captcha?")){
                      ddlButton.addEventListener("click",function(){window.open(response.finalUrl)});
                      //ddlButton.setAttribute("href",response.finalUrl);
                      ddlButton.firstChild.textContent="CAPTCHA";
                      ddlButton.onclick=null;
                  }
                  else if(response.finalUrl.includes("app/removed")){
                      buttonError(ddlButton,"Removed!");
                  }
                  else{
                      try{
                        	let parser = new DOMParser();
													var linkIntermediary = parser.parseFromString(response.response, 'text/html');
                          var link="http:"+linkIntermediary.getElementsByClassName("mdl-button")[0].getAttribute("href");
                          ddlButton.firstChild.textContent="Ready!";
                          openLink(link);
                        	ddlButton.onclick=function(){openLink(link);};

                      }
                      catch(err){
                          buttonError(ddlButton,"Failed!");
                          console.log(err);
                      }
                  }
              },
          		onerror: function(){
                buttonError(ddlButton,"Offline!");
              }
        });
      }
      catch (err) {
        buttonError(ddlButton,"Failed!");
        console.log(err);
      }
    }
    else if(ddlURL.includes("apkpure")){
      if(ddlFinalApk(ddlURL,ddlButton,0)==-1){//if 0 is returned (request completed), the download has started and the following won't be run. Otherwise, the script will try the following method to extract the link.
        try{
            GM.xmlHttpRequest({
                method: "GET",
                url: ddlURL,
                onload: function(response) {
                  switch (response.status) {
                      case 410:
                          buttonError(ddlButton, "Removed!");
                          break;
                      case 404:
                          buttonError(ddlButton, "Not found!");
                          break;
                      default:
                        var apklink=response.responseText.substr(response.responseText.indexOf('https://download.apkpure.com/b/'),response.responseText.length-1);
                        apklink=apklink.substr(0,apklink.indexOf('"'));
                        console.log(ddlURL);
                        ddlButton.firstChild.textContent="Wait...";
                        //ddlButton.onclick=function(){GM.openInTab(apklink,"open_in_background");};
                        ddlFinalApk(apklink,ddlButton,0);
                  }
                },
                onerror: function(){
                  buttonError(ddlButton,"Offline!");
                }
            });
        }
        catch(err){
          buttonError(ddlButton,"Failed!");
          console.log(err);
        }
      }
    }
  	else if(ddlURL.includes("apkcombo")){
        try{
          var checkin;
          GM.xmlHttpRequest({
            method: "POST",
            url: "https://apkcombo.com/checkin",
            headers: {
              "Referer": ddlURL,
              "Origin": "https://apkcombo.com"
            },
            onload: function(response) {
              checkin=response.responseText;
              GM.xmlHttpRequest({
                  method: "GET",
                  url: ddlURL,
                  onload: function(response) {
                    switch (response.status) {
                        case 410:
                            buttonError(ddlButton, "Removed!");
                            break;
                        case 404:
                            buttonError(ddlButton, "Not found!");
                            break;
                        default:
                            try {
                                var i;
                                var parser = new DOMParser();
                                var resp = parser.parseFromString(response.responseText, 'text/html');
                                var combo = resp.getElementsByClassName("file-list")[0];
                                if (combo !== undefined){
                                    var combolinks = combo.getElementsByTagName("a");
                                    for (i = 0; i < combolinks.length; i++) {
                                      let fileLink=combolinks[i].getAttribute("href");
                                       if(fileLink.startsWith("/r2?u=")){
                                         try{
                                           window.open(decodeURIComponent(fileLink).split("?u=")[1]);
                                         }
                                         catch(e){
                                           console.log(e);
                                           buttonError(ddlButton, "Error!");
                                         }
                                       }
                                      else{
                                        window.open(fileLink+"&"+checkin);
                                      }
                                    }
                                    ddlButton.firstChild.textContent="APKCombo";
                                }
                                else{ //if loading the main download page results in an empty list of apks, tries to read the token to request directly the urls from apkcombo server
                                      var tokenStart=response.responseText.indexOf("/dl?token=")+4;
                                      var tokenEnd=response.responseText.indexOf("\"",tokenStart);
                                      var token = response.responseText.substring(tokenStart,tokenEnd);
                                      ddlURL=response.finalUrl;
                                      GM.xmlHttpRequest({
                                          method: "POST",
                                          url: ddlURL.replace("/download/apk", "/dl")+"?"+token,
                                          onload: function(response) {
                                              var parser2 = new DOMParser();
                                              var resp2 = parser2.parseFromString(response.responseText, 'text/html');
                                              combo = resp2.getElementsByClassName("file-list")[0];
                                              if (combo !== null) {
                                                  var combolinks = combo.getElementsByTagName("a");
                                                  for (i = 0; i < combolinks.length; i++) {
                                                      window.open(combolinks[i].getAttribute("href")+"&"+checkin);
                                                  }
                                                	ddlButton.firstChild.textContent="APKCombo";
                                              } else {
                                                  ddlButton.addEventListener("click",function(){window.open(ddlURL)});
                                                  //ddlButton.setAttribute("href", ddlURL);
                                                  ddlButton.firstChild.textContent = "New tab >";
                                                  ddlButton.onclick = null;
                                              }
                                          },
                                          onerror: function(response) {
                                              buttonError(ddlButton, "Error!");
                                          }
                                      });
                                  }
                            } catch (err) {
                                console.log(err);
                            }
                    }
                },
                  onerror: function(){
                    buttonError(ddlButton,"Offline!");
                  }
              });
            }
          });
        }
        catch(err){
          buttonError(ddlButton,"Failed!");
          console.log(err);
        }
    }
  	else if(ddlURL.includes("apkpremier")){
      try{
            GM.xmlHttpRequest({
                method: "POST",
                url: ddlURL,
              	data: "cmd=apk&gc=0",
              	//data: "pa=xapk&gid="+ddlURL.substr(32).replace(/[-]/g,"."),
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {

                  switch (response.status) {
                      case 410:
                          buttonError(ddlButton, "Removed!");
                          break;
                      case 404:
                          buttonError(ddlButton, "Not found!");
                          break;
                      default:
                      	let parser = new DOMParser();
                      	const respDom = parser.parseFromString(response.responseText, "text/html");
                       	let apkLinks=respDom.getElementsByClassName("bdlinks");
                        if(response.responseText=="error capchar"){
                          ddlButton.addEventListener("click",function(){window.open(ddlURL)});
                          ddlButton.firstChild.textContent="CAPTCHA";
                          ddlButton.onclick=null;
                        }
                        else{
                          if(apkLinks.length>0){
                            for(let apkLink of apkLinks){
                              window.open(apkLink.firstElementChild.getAttribute("href"),"_self");
                            }
                            ddlButton.firstChild.textContent="Ready!";
                          }
                          else{
                            ddlButton.firstChild.textContent="Failed!";
                          }
                        }
                  }
                },
                onerror: function(){
                  buttonError(ddlButton,"Offline!");
                }
            });
        }
        catch(err){
          buttonError(ddlButton,"Failed!");
          console.log(err);
        }
    }
    else if(ddlURL.includes("aptoide")){
        try{
              GM.xmlHttpRequest({
                  method: "GET",
                  url: ddlURL,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  onload: function(response) {

                    switch (response.status) {
                        case 410:
                            buttonError(ddlButton, "Removed!");
                            break;
                        case 404:
                            buttonError(ddlButton, "Not found!");
                            break;
                        default:
                          let searchResults=JSON.parse(response.responseXML);
                          if(searchResults.datalist.total>0){
                            let packageId=ddlURL.split("?query=")[1];
                            for(let app of searchResults.datalist.list){
                              if(app.package===packageId){
                                //should dowload splits and obb. I'm absolutely not sure wether this works properly or not once installed
                                if(app.aab){
                                  for(let split of app.aab.splits){
                                    window.open(split.path);
                                  }
                                }
                                if(app.obb){
                                  window.open(app.obb.main.path);
                                }
                                //
                                openLink(searchResults.datalist.list[0].file.path);

                                ddlButton.firstChild.textContent="Ready!";
                              }
                            }
                            if(ddlButton.firstChild.textContent!="Ready!"){
                              buttonError(ddlButton,"Not found!");
                            }

                          }
                          else{
                            ddlButton.firstChild.textContent="Failed!";
                          }
                    }
                  },
                  onerror: function(){
                    buttonError(ddlButton,"Offline!");
                  }
              });
          }
          catch(err){
            buttonError(ddlButton,"Failed!");
            console.log(err);
          }
      }
    else if(ddlURL.includes("apk.support")){
        try{
          GM.xmlHttpRequest({
            method: "POST",
            url: ddlURL,
            data: "cmd=csapk&pkg="+packageId+"&arch=default&tbi=default&device_id=&model=default&language=en&dpi=480&av=default",
            headers: {
              "Referer": ddlURL,
              "Origin": "https://apk.support",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
              if(response.responseXML){
                let links=response.responseXML.querySelectorAll("[href*='.androidcontents.com/']");
                if(links.length==0){
                  links=response.responseXML.querySelectorAll("[href*='.googleapis.com/download/']");
                }
                if(links.length>0){
                  ddlButton.firstChild.textContent="Ready!";
                  for(let l of links){
                    window.open(l);
                  }
                }
                else{
                  buttonError(ddlButton, "Not found!");
                }
              }
            },
            onerror: function(response) {
                buttonError(ddlButton, "Error!");
            }
          });
        }
        catch (err) {
            console.log(err);
        }
    }
}
function get2022UIButtons(){
  var matchingElements=[];
  matchingElements=document.querySelectorAll("[data-item-id^=\"%.@.\"]");
  if(matchingElements.length==0){
  	matchingElements=document.querySelectorAll("[data-p^=\"%.@.[\"]");
    for(let element of matchingElements){
      if((element.querySelector("[fill-rule=evenodd]"))&&(element.getAttribute("data-p").includes("\",7]]"))){//hard but hopefully durable way to find the wishlist button if install button is not on the page.
        return element;
      }
    }
  }
  console.log("Install buttons:");
  console.log(matchingElements);
  return matchingElements[0];
}
function checkUI(){
    //Different UIs:
    //0=Missing APK page
    //5=2022UI
    var check=0;
    try{
				if(document.getElementsByTagName("header").length>0){
          check=5;
        }
        else{
          check=0;
        }
    }
    catch(err){
        console.error('The user interface of Google Play Store was not recognized by "Direct Download from Google Play" script. This might result in unexpected behaviour of the page. Please report the error to the author on Greasyfork. Error: '+err);
    }
    console.log("PLAY STORE INTERFACE: "+check);
    return check;
}
function removePreviousCwiz(){
    appCwiz.parentNode.removeChild(appCwiz);
}
function buttonError(ddlButton,error){
  ddlButton.firstChild.textContent=error;
  ddlButton.style.backgroundColor="#CCCCCC";
  ddlButton.onclick=null;
}
async function setUseGS(check){
  useGS=check;
  GM.setValue("useGS", check);
}