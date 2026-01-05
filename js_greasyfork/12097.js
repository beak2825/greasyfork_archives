// ==UserScript==
// @name        Aptoide Downloader by Cristian Rivas
// @namespace   Cristian Rivas
// @author      Cristian Rivas
// @description Download Button by Cristian Rivas
// @icon        http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/48/Aptoide-icon.png
// @include     http://*.store.aptoide.com/app/market/*
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12097/Aptoide%20Downloader%20by%20Cristian%20Rivas.user.js
// @updateURL https://update.greasyfork.org/scripts/12097/Aptoide%20Downloader%20by%20Cristian%20Rivas.meta.js
// ==/UserScript==

//----------------Alert for hostname and pathname------------------------------------------------------------------
//alert(window.location.hostname); // m.milaupv.store.aptoide.com
//alert(window.location.pathname); // /app/market/com.rovio.baba/2010014/10508914/Angry+Birds+2
//------------------Vars getting the data---------------------------------------------------------------------------
var pstore = window.location.hostname.search(".store.aptoide.com");        //Position
var storename = window.location.hostname.substring(2, pstore);             //Get the store starting from postion 2 (m.) until the position defined from pstore (.store.aptoide.com)
//alert(storename);                                                        //Alert showing the Store    //milaupv
//var endname= window.location.pathname.search(/([0-9]|[A-Z])(?=[A-z])/);  //Get the position from the name of te app on the url (Number o Letter)
//var endname= window.location.pathname.search(/[A-Z]/);                   //Get the position (Letter)
//var appinfo = window.location.pathname.substring(12, endname);           //Get the App Data on the url
//    appinfo = appinfo.replace(/\W/g, "-");                               //Replace the Non-word characters like "." or "/" with "-"
//alert(appinfo);                                                          //Alert Showing the app data //com.rovio.baba/2010014/10508914/
var idapps = document.body.innerHTML.search(/appid=/i);                    //Get the position of appid= on the html
var idappe = document.body.innerHTML.search(/repo=/i);                     //Get the position of repo= on the html
var idapp = document.body.innerHTML.substring(idapps+6, idappe-5);         //Get the id app from "appid=" until "repo="
var idappl = idapp.length;                                                 //Get the length of the appid
var endnameb = window.location.pathname.lastIndexOf(idapp);                //Search for the appid on the url getting the last one
var appinfob= window.location.pathname.substring(12, endnameb+idappl+1);   //Get the appinfo from the url start on 12 position until "endnameb position" plus "idapp length" plus "1" 
    appinfob = appinfob.replace(/\W/g, "-");                               //Replace the / and . for -
    appinfob = appinfob.toLowerCase();                                     //appinfo all to LowerCase 
//alert(appinfob);                                                         //Alert Showing the appinfo
var md5p = document.body.innerHTML.search(/md5:/i);                        //Get the position of "MD5:" on the HTML
var md5value = document.body.innerHTML.substring(md5p+14, md5p+46);        //Get the MD5 value starting from de position of md5p
//alert(md5value);                                                         //Shows the MD5 value      //3eea83ec8cc03d8338f7df295f1ee797
var apklink = ("http://pool.apk.aptoide.com/"+storename+"/"+appinfob+md5value+".apk"); //Create the link using the variables plus the rest of the link
//alert(apklink);                                                          //Alert Showing the Link Created 
//document.getElementById("app_install_btn").outerHTML='<a class="btn app_install trusted" href="' + apklink + '" target="_self" id="app_install_btn"><div></div>DOWNLOAD</a>'; //Replace the link href with the link created and the content of DIV with "DOWNLOAD"
document.getElementById("app_install_btn").href=apklink;                             //Set or Replace de href value with the apklink
document.getElementById("app_install_btn").setAttribute("target", "_self");          //Create an attribute and set the value
document.getElementById("app_install_btn").removeAttribute("onclick");               //Remove an attribute
document.getElementById("app_install_btn").innerHTML="<div></div>DOWNLOAD";          //Replace the html code of the div with DOWNLOAD
//alert(document.getElementById("app_install_btn").innerHTML);                       //Alert the innerHTML of the element
//document.getElementById("app_install_btn").innerHTML="DOWNLOAD";                   //Replace INSTALL with DOWNLOAD inner content of DIV
//document.querySelector(".app_malware").outerHTML='<a class="btn app_install trusted" href="' + apklink + '" target="_self" id="app_install_btn"><div></div>DOWNLOAD</a>'; //Replace the html code for that element
var jsonlink = ("https://www.aptoide.com/webservices/getApkInfo/id:"+idapp+"/json"); //create the json link with the idapp
//alert(jsonlink);                                                                   //Show the json link created
document.querySelector(".app_malware").href=jsonlink;                                //Set or Replace de href value with the jsonlink
document.querySelector(".app_malware").setAttribute("target", "_blank");             //Create an attribute and set the value
document.querySelector(".app_malware").removeAttribute("data-window-call-id");       //Remove an attribute
document.querySelector(".app_malware").innerHTML="<div></div><div>JSON</div>";       //Replace the html code of the div with JSON
//alert(document.querySelector(".app_malware").outerHTML);                           //Show the html code of the element
//alert(document.querySelector(".app_malware").innerHTML);                           //Show the html code of the DIV
var epkg = window.location.pathname.search("/(?=[0-9])");                            //Get the location of the first "/" followed by any number on the url
//alert(epkg);                                                                       //Alert the position obtained
//alert(window.location.pathname);                                                   //Alert the URL (PATH)
var pkg = window.location.pathname.substring(12, epkg);                              //Get the appinfo from the url start on 12 position until "epkg"
//document.querySelector(".install_area").outerHTML+='<div style="float:right;margin:20px -142px" class="goole_play" id="googleplay"> <a href="https://play.google.com/store/apps/details?id=' + pkg + '" target="_blank"> <img alt="Get it on Google Play" src="https://developer.android.com/images/brand/en_generic_rgb_wo_45.png"> </a> </div>';
                                                                                     //Search for the element by the selector and then write html code after to create the button
var gplink = document.createElement("a");                                            //A variable that create an (a link) element
    gplink.href= "https://play.google.com/store/apps/details?id="+pkg;               //Set the attribute href and the value to the (a) element
    gplink.setAttribute("target", "_blank");                                         //Set the attribute target and the value to the (a) element
var gptext = document.createTextNode("PLAY STORE WEB");                             //A variable that create a text node 
    gplink.appendChild(gptext);                                                      //Set the text node to the variable gplink (a) element
    document.querySelector("header.store_header.appview > div:nth-of-type(2)").appendChild(gplink); //Search for the element by the selector css and set the child (a) to the end

var gplinka = document.createElement("a");                                           //A variable that create an (a link) element
    gplinka.href= "market://details?id="+pkg;                                        //Set the attribute href and the value to the (a) element
//  gplinka.setAttribute("target", "_blank");                                        //Set the attribute target and the value to the (a) element
var gptexta = document.createTextNode("PLAY STORE APP");                             //A variable that create a text node 
    gplinka.appendChild(gptexta);                                                    //Set the text node to the variable gplink (a) element
    document.querySelector("header.store_header.appview > div:nth-of-type(2)").appendChild(gplinka); //Search for the element by the selector css and set the child (a) to the end

//  var gplinkm = document.createElement("a");                                       //A variable that create an (a link) element
//  gplinkm.href= "https://market.android.com/details?id="+pkg;                      //Set the attribute href and the value to the (a) element
//  gplinkm.setAttribute("target", "_blank");                                        //Set the attribute target and the value to the (a) element
//  var gptextm = document.createTextNode("PLAY STORE MARKET");                      //A variable that create a text node 
//  gplinkm.appendChild(gptextm);                                                    //Set the text node to the variable gplink (a) element
//  document.querySelector("header.store_header.appview > div:nth-of-type(2)").appendChild(gplinkm); //Search for the element by the selector css and set the child (a) to the end
//document.getElementById("google_play_btn").outerHTML='<div style="margin:-1px -1px" class="goole_play"> <a href="https://play.google.com/store/apps/details?id=com.pushbullet.android"> <img alt="Get it on Google Play" src="https://developer.android.com/images/brand/en_generic_rgb_wo_45.png"> </a> </div>' //Create the botton on a div but was better the outerhtml + :)
//alert(document.querySelector("header.store_header.appview > div:nth-of-type(2)").innerHTML); //Alert the innerthtml of that element using the css selector
//alert("Everything Works!!! ? ツ");                                                   //Alert TEST MESSAGE
