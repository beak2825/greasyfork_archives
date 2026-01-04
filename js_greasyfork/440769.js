// ==UserScript==
// @name        Kiwi Browser Custom New Tab Revised
// @namespace   Kiwi Browser Custom New Tab Revised
// @match       chrome-search://local-ntp/local-ntp.html
// @version     1
// @description Editable links to common websites
// @icon        https://play-lh.googleusercontent.com/IpPy16lik1fLrJs0fkaFuKrUm6Hw9Q3KDa2gLbewoze0Ko39gEIOyDECYOZBFJLHGeo=s180
// @downloadURL https://update.greasyfork.org/scripts/440769/Kiwi%20Browser%20Custom%20New%20Tab%20Revised.user.js
// @updateURL https://update.greasyfork.org/scripts/440769/Kiwi%20Browser%20Custom%20New%20Tab%20Revised.meta.js
// ==/UserScript==

//Storage
if(localStorage.getItem("ini")===null){localStorage.clear();
  localStorage.setItem("img","https://cdn.donmai.us/original/74/95/__junko_touhou_drawn_by_zephid__74952c72b9306e5617885e90237429e4.png?__cf_chl_jschl_tk__=4950a03edec9a2cc54085ca74212e682671dc0a1-1610878432-0-ASoqqyZHKRTwBxCocKd6OwYUWF30x6LSYyBQ2G39Nl125By5LoZBuvzpaFVdr398A3M_YZmJQXQ__XIHqEm-FMg3goWZsjIqtta-Ak4DnGgwmG4_VMKjKQPluPe03WqsGKTMzh0pktq7mdLhGad8ZaahKZyBV5pG7TFYFhQsgHjjOjPMhsgXZXE_NkiTh4iEMH2_YfNaiVWmFa761fFVooY_T4ovTbTE_6vuFLXvj_vBY6yw-bo6goEbGHKuwWaBUT4Pu3s8prV8PZd4mo7AT8USNAOcoRK96GPKOBTtRLfNQJTcUXwLbU_XPoubss2wn1wMFYvEhRA5aPXwtDsyFiVXace56NOmEikxT2XtXUEdP1moxxydB1r9qJPK_wnR96jFxrwKdOj8ZjMV58jJU5DRvkgwTFU6xTtwvaF_z7Oi");
  localStorage.setItem("l0","Email");
  localStorage.setItem("l00","Gmail");
  localStorage.setItem("l00l","www.google.com/gmail");
  localStorage.setItem("l01","Yahoo");
  localStorage.setItem("l01l","mail.yahoo.com");
  localStorage.setItem("l02","Proton");
  localStorage.setItem("l02l","protonmail.com");
  localStorage.setItem("r0","Coding");
  localStorage.setItem("r00","Github");
  localStorage.setItem("r00l","github.com");
  localStorage.setItem("r1","Social");
  localStorage.setItem("r10","Twitter");
  localStorage.setItem("r10l","twitter.com");
  localStorage.setItem("r11","Facebook");
  localStorage.setItem("r11l","facebook.com");
  localStorage.setItem("left",1);
  localStorage.setItem("right",2);
  localStorage.setItem("sectionl0",3);
  localStorage.setItem("sectionr0",1);
  localStorage.setItem("sectionr1",2);
  localStorage.setItem("ini",0);location.reload();}

//Style
document.head.innerHTML=
  "<style>"+
    "body{"+
      "background-color:#000000;"+
      "white-space:nowrap;}"+
    "a{"+
      "font:2em consolas;"+
      "color:white;"+
      "text-decoration:none;}"+
    "img{"+
      "z-index:-1;"+
      "position:absolute;"+
      "top:0;"+
      "left:0;"+
      "opacity:0.5;"+
      "width:393px;"+
      "height:693px;"+
      "object-fit:cover;}"+
    ".left{"+
      "float:left;"+
      "text-align:left;"+
      "padding-left:1%;"+
      "width:49%;}"+
    ".right{"+
      "float:right;"+
      "text-align:right;"+
      "padding-right:1%;"+
      "width:49%;}"+
    ".toggle{"+
      "position:absolute;"+
      "bottom:6px;"+
      "font-size:4em;"+
      "opacity:0%;"+
      "line-height:100%;}"+
    "input{"+
      "margin:0px;"+
      "padding:0px;"+
      "border:0px;"+
      "width:80%;"+
      "font:2em consolas;"+
      "color:white;"+
      "background-color:#000000;}"+
    ".srinput,.lrinput,.hrinput{"+
      "text-align:right;"+
      "float:right;}"+
  "</style>";
document.body.innerHTML=
  "<img src="+localStorage.getItem("img")+"/>"+
  "<div class='left'><div class='home'></div></div>"+
  "<div class='right'><div class='home'></div></div>"+
  "<a class='toggle' style='left:0px'>r</a>"+
  "<a class='toggle' style='right:0px'>0</a>"+
  "<a class='toggle' style='left:140px'>+</a><a class='toggle' style='left:60px'>-</a>"+
  "<a class='toggle' style='left:220px'>+</a><a class='toggle' style='left:300px'>-</a>";

switch(parseInt(localStorage.getItem("ini"))){
    
  case 0:

//Home
for(a=0;a<localStorage.getItem("left");a++){
  document.getElementsByClassName("home")[0].innerHTML+=
    "<a class='menu'>"+localStorage.getItem("l"+[a])+"<br><br></a>";}
for(a=0;a<localStorage.getItem("right");a++){
  document.getElementsByClassName("home")[1].innerHTML+=
    "<a class='menu'>"+localStorage.getItem("r"+[a])+"<br><br></a>";}

//Sections
for(a=0;a<localStorage.getItem("left");a++){
  document.getElementsByClassName("left")[0].innerHTML+=
    "<div class='section' style='display:none'><a>"+
    "<br>".repeat(a*2)+"</a><a class='back'>Back<br></a></div>";}
for(a=0;a<localStorage.getItem("right");a++){
  document.getElementsByClassName("right")[0].innerHTML+=
    "<div class='section' style='display:none'><a>"+
    "<br>".repeat(a*2)+"</a><a class='back'>Back<br></a></div>";}

//Links
for(a=0;a<document.getElementsByClassName("left")[0].getElementsByClassName("section").length;a++){
  for(b=0;b<localStorage.getItem("sectionl"+[a]);b++){
    document.getElementsByClassName("left")[0].getElementsByClassName("section")[a].innerHTML+=
      "<a href='"+localStorage.getItem("l"+[a]+[b]+"l")+"'>"+localStorage.getItem("l"+[a]+[b])+"<br></a>";}}
for(a=0;a<document.getElementsByClassName("right")[0].getElementsByClassName("section").length;a++){
  for(b=0;b<localStorage.getItem("sectionr"+[a]);b++){
    document.getElementsByClassName("right")[0].getElementsByClassName("section")[a].innerHTML+=
      "<a href='"+localStorage.getItem("r"+[a]+[b]+"l")+"'>"+localStorage.getItem("r"+[a]+[b])+"<br></a>";}}

for(var a=0;a<document.getElementsByClassName("menu").length;a++){
  document.getElementsByClassName("menu")[a].addEventListener("click",function(){
    document.getElementsByClassName("home")[0].style.display="none";
    document.getElementsByClassName("home")[1].style.display="none";},false);}
for(let a=0;a<document.getElementsByClassName("menu").length;a++){
  document.getElementsByClassName("menu")[a].addEventListener("click",function(){
    document.getElementsByClassName("section")[a].style.display="block";},false);}
for(var a=0;a<document.getElementsByClassName("back").length;a++){
  document.getElementsByClassName("back")[a].addEventListener("click",function(){
    document.getElementsByClassName("home")[0].style.display="block";
    document.getElementsByClassName("home")[1].style.display="block";
    for(var b=0;b<document.getElementsByClassName("section").length;b++){
      document.getElementsByClassName("section")[b].style.display="none";}},false);}
document.getElementsByClassName("toggle")[1].addEventListener("click",function(){
  localStorage.setItem("ini","1");location.reload()},false);
  
  break;
  case 1:

//Section Edit
for(a=0;a<localStorage.getItem("left");a++){document.getElementsByClassName("home")[0].innerHTML+="<div class='menu'>"+
  "<input type='text' class='slinput' value='"+localStorage.getItem("l"+[a])+
  "'><a class='lsection-change'>c</a></div><a class='lsection-expand' style='font-size:2em'>+</a>";}
for(a=0;a<localStorage.getItem("right");a++){document.getElementsByClassName("home")[1].innerHTML+="<div class='menu'>"+
  "<a class='rsection-change'>c</a><input type='text' class='srinput' value='"+
  localStorage.getItem("r"+[a])+"'></div><a class='rsection-expand' style='font-size:2em'>+</a>";}
for(let a=0;a<localStorage.getItem("left");a++){document.getElementsByClassName("lsection-change")[a].addEventListener("click",function(){
  localStorage.setItem("l"+[a],document.getElementsByClassName("slinput")[a].value)},false);}
for(let a=0;a<localStorage.getItem("right");a++){document.getElementsByClassName("rsection-change")[a].addEventListener("click",function(){
  localStorage.setItem("r"+[a],document.getElementsByClassName("srinput")[a].value)},false);}

//Left Section Addition
document.getElementsByClassName("toggle")[2].addEventListener("click",function(){
  localStorage.setItem("l"+localStorage.getItem("left"),"Section");
  localStorage.setItem("sectionl"+localStorage.getItem("left"),"1");
  localStorage.setItem("l"+localStorage.getItem("left")+parseInt(
    localStorage.getItem("sectionl"+localStorage.getItem("left"))-1),"Link");
  localStorage.setItem("l"+localStorage.getItem("left")+(parseInt(
    localStorage.getItem("sectionl"+localStorage.getItem("left"))-1)+"l"),"Https");
  localStorage.setItem("left",parseInt(localStorage.getItem("left"))+1);
  document.getElementsByClassName("toggle")[3].style.display="inline";
  if(localStorage.getItem("left")>8){document.getElementsByClassName("toggle")[2].
    style.display="none"};location.reload()},false);

//Left Section Subtraction
document.getElementsByClassName("toggle")[3].addEventListener("click",function(){
  for(a=0;a<localStorage.getItem("sectionl"+parseInt(localStorage.getItem("left")-1));a++){
    localStorage.removeItem("l"+parseInt(localStorage.getItem("left")-1)+[a]);
    localStorage.removeItem("l"+parseInt(localStorage.getItem("left")-1)+[a]+"l");}
  localStorage.removeItem("sectionl"+parseInt(localStorage.getItem("left")-1));
  localStorage.removeItem("l"+parseInt(localStorage.getItem("left")-1));
  localStorage.setItem("left",parseInt(localStorage.getItem("left"))-1);
  document.getElementsByClassName("toggle")[2].style.display="inline";
  if(localStorage.getItem("left")<1){document.getElementsByClassName("toggle")[3].
    style.display="none"};location.reload()},false);

//Right Section Addition
document.getElementsByClassName("toggle")[4].addEventListener("click",function(){
  localStorage.setItem("r"+localStorage.getItem("right"),"Section");
  localStorage.setItem("sectionr"+localStorage.getItem("right"),"1");
  localStorage.setItem("r"+localStorage.getItem("right")+parseInt(
    localStorage.getItem("sectionr"+localStorage.getItem("right"))-1),"Link");
  localStorage.setItem("r"+localStorage.getItem("right")+(parseInt(
    localStorage.getItem("sectionr"+localStorage.getItem("right"))-1)+"l"),"Https");
  localStorage.setItem("right",parseInt(localStorage.getItem("right"))+1);
  document.getElementsByClassName("toggle")[5].style.display="inline";
  if(localStorage.getItem("right")>8){document.getElementsByClassName("toggle")[4].
    style.display="none"};location.reload()},false);

//Right Section Subtraction
document.getElementsByClassName("toggle")[5].addEventListener("click",function(){
  for(a=0;a<localStorage.getItem("sectionr"+parseInt(localStorage.getItem("right")-1));a++){
    localStorage.removeItem("r"+parseInt(localStorage.getItem("right")-1)+[a]);
    localStorage.removeItem("r"+parseInt(localStorage.getItem("right")-1)+[a]+"l");}
  localStorage.removeItem("sectionr"+parseInt(localStorage.getItem("right")-1));
  localStorage.removeItem("r"+parseInt(localStorage.getItem("right")-1));
  localStorage.setItem("right",parseInt(localStorage.getItem("right"))-1);
  document.getElementsByClassName("toggle")[4].style.display="inline";
  if(localStorage.getItem("right")<1){document.getElementsByClassName("toggle")[5].
    style.display="none"};location.reload()},false);

if(localStorage.getItem("left")>8){document.getElementsByClassName("toggle")[2].style.display="none"};
if(localStorage.getItem("left")<1){document.getElementsByClassName("toggle")[3].style.display="none"};
if(localStorage.getItem("right")>8){document.getElementsByClassName("toggle")[4].style.display="none"};
if(localStorage.getItem("right")<1){document.getElementsByClassName("toggle")[5].style.display="none"};
for(a=0;a<6;a++){document.getElementsByClassName("toggle")[a].style.opacity="100%"};
document.getElementsByClassName("toggle")[1].addEventListener("click",function(){localStorage.setItem("ini","0");location.reload();},false);
document.getElementsByClassName("toggle")[0].addEventListener("click",function(){localStorage.clear();
  for(b=1;b<6;b++){document.getElementsByClassName("toggle")[b].style.display="none"}
  document.getElementsByClassName("left")[0].style.display="none";
  document.getElementsByClassName("right")[0].style.display="none";
  document.getElementsByClassName("toggle")[0].addEventListener("click",function(){location.reload();},false)},false);
for(let a=0;a<document.getElementsByClassName("lsection-expand").length;a++){
  document.getElementsByClassName("lsection-expand")[a].addEventListener("click",function(){
    localStorage.setItem("ini",2);localStorage.setItem("link",a);location.reload()},false)}
for(let a=0;a<document.getElementsByClassName("rsection-expand").length;a++){
  document.getElementsByClassName("rsection-expand")[a].addEventListener("click",function(){
    localStorage.setItem("ini",3);localStorage.setItem("link",a);location.reload()},false)}

  break;
  case 2:

//Link Edit
document.getElementsByClassName("left")[0].innerHTML+=
  "<div class='section'><a class='back'>Back<br></a></div>";
  for(a=0;a<localStorage.getItem("sectionl"+localStorage.getItem("link"));a++){document.getElementsByClassName("section")[0].innerHTML+=
    "<input class='llinput' type='text' value='"+localStorage.getItem("l"+localStorage.getItem("link")+[a])+"'><a class='link-change'>c<br></a>"+
    "<input class='hlinput' type='text' value='"+localStorage.getItem("l"+localStorage.getItem("link")+[a]+"l")+"'><a class='http-change'>c<br></a>";}

if(localStorage.getItem("sectionl"+localStorage.getItem("link"))>8){document.getElementsByClassName("toggle")[2].style.display="none"};
if(localStorage.getItem("sectionl"+localStorage.getItem("link"))<1){document.getElementsByClassName("toggle")[3].style.display="none"};
for(a=0;a<6;a++){document.getElementsByClassName("toggle")[a].style.opacity="100%"};
document.getElementsByClassName("toggle")[4].style.opacity="0%";document.getElementsByClassName("toggle")[5].style.opacity="0%";
document.getElementsByClassName("back")[0].addEventListener("click",function(){
  localStorage.setItem("ini","1");localStorage.removeItem("link");location.reload();},false);
document.getElementsByClassName("toggle")[1].addEventListener("click",function(){
  localStorage.setItem("ini","0");localStorage.removeItem("link");location.reload();},false);
document.getElementsByClassName("toggle")[0].addEventListener("click",function(){localStorage.clear();
  for(b=1;b<6;b++){document.getElementsByClassName("toggle")[b].style.display="none"}
  document.getElementsByClassName("left")[0].style.display="none";
  document.getElementsByClassName("right")[0].style.display="none";
  document.getElementsByClassName("toggle")[0].addEventListener("click",function(){location.reload();},false)},false);
for(let a=0;a<localStorage.getItem("sectionl"+localStorage.getItem("link"));a++){document.getElementsByClassName("link-change")[a].addEventListener("click",function(){
  localStorage.setItem("l"+localStorage.getItem("link")+[a],document.getElementsByClassName("llinput")[a].value)},false);}
for(let a=0;a<localStorage.getItem("sectionl"+localStorage.getItem("link"));a++){document.getElementsByClassName("http-change")[a].addEventListener("click",function(){
  localStorage.setItem("l"+localStorage.getItem("link")+[a]+"l",document.getElementsByClassName("hlinput")[a].value)},false);}

//Left Link Addition
document.getElementsByClassName("toggle")[2].addEventListener("click",function(){
  localStorage.setItem("l"+localStorage.getItem("link")+parseInt(
    localStorage.getItem("sectionl"+localStorage.getItem("link"))),"Link");
  localStorage.setItem("l"+localStorage.getItem("link")+(parseInt(
    localStorage.getItem("sectionl"+localStorage.getItem("link")))+"l"),"Https");
  localStorage.setItem("sectionl"+localStorage.getItem("link"),parseInt(localStorage.getItem("sectionl"+localStorage.getItem("link")))+1);
  document.getElementsByClassName("toggle")[3].style.display="inline";
  if(localStorage.getItem("sectionl"+localStorage.getItem("link"))>8){document.getElementsByClassName("toggle")[2].
    style.display="none"};location.reload()},false);

//Left Link Subtraction
document.getElementsByClassName("toggle")[3].addEventListener("click",function(){
  localStorage.removeItem("l"+localStorage.getItem("link")+parseInt(localStorage.getItem("sectionl"+localStorage.getItem("link"))-1));
  localStorage.removeItem("l"+localStorage.getItem("link")+parseInt(localStorage.getItem("sectionl"+localStorage.getItem("link"))-1)+"l");
  localStorage.setItem("sectionl"+localStorage.getItem("link"),parseInt(localStorage.getItem("sectionl"+localStorage.getItem("link")))-1);
  document.getElementsByClassName("toggle")[2].style.display="inline";
  if(localStorage.getItem("sectionl"+localStorage.getItem("link"))<1){document.getElementsByClassName("toggle")[3].
    style.display="none"};location.reload()},false);

  break;
  case 3:

//Link Edit
document.getElementsByClassName("right")[0].innerHTML+=
  "<div class='section'><a class='back'>Back</a></div>";
  for(a=0;a<localStorage.getItem("sectionr"+localStorage.getItem("link"));a++){document.getElementsByClassName("section")[0].innerHTML+=
    "<a class='link-change'><br>c</a><input class='lrinput' type='text' value='"+localStorage.getItem("r"+localStorage.getItem("link")+[a])+"'>"+
    "<a class='http-change'><br>c</a><input class='hrinput' type='text' value='"+localStorage.getItem("r"+localStorage.getItem("link")+[a]+"l")+"'>";}

for(a=0;a<6;a++){document.getElementsByClassName("toggle")[a].style.opacity="100%"};
document.getElementsByClassName("toggle")[2].style.opacity="0%";document.getElementsByClassName("toggle")[3].style.opacity="0%";
document.getElementsByClassName("back")[0].addEventListener("click",function(){
  localStorage.setItem("ini","1");localStorage.removeItem("link");location.reload();},false);
document.getElementsByClassName("toggle")[1].addEventListener("click",function(){
  localStorage.setItem("ini","0");localStorage.removeItem("link");location.reload();},false);
document.getElementsByClassName("toggle")[0].addEventListener("click",function(){localStorage.clear();
  for(b=1;b<6;b++){document.getElementsByClassName("toggle")[b].style.display="none"}
  document.getElementsByClassName("left")[0].style.display="none";
  document.getElementsByClassName("right")[0].style.display="none";
  document.getElementsByClassName("toggle")[0].addEventListener("click",function(){location.reload();},false)},false);
for(let a=0;a<localStorage.getItem("sectionr"+localStorage.getItem("link"));a++){document.getElementsByClassName("link-change")[a].addEventListener("click",function(){
  localStorage.setItem("r"+localStorage.getItem("link")+[a],document.getElementsByClassName("lrinput")[a].value)},false);}
for(let a=0;a<localStorage.getItem("sectionr"+localStorage.getItem("link"));a++){document.getElementsByClassName("http-change")[a].addEventListener("click",function(){
  localStorage.setItem("r"+localStorage.getItem("link")+[a]+"l",document.getElementsByClassName("hrinput")[a].value)},false);}

//Right Link Addition
document.getElementsByClassName("toggle")[4].addEventListener("click",function(){
  localStorage.setItem("r"+localStorage.getItem("link")+parseInt(
    localStorage.getItem("sectionr"+localStorage.getItem("link"))),"Link");
  localStorage.setItem("r"+localStorage.getItem("link")+(parseInt(
    localStorage.getItem("sectionr"+localStorage.getItem("link")))+"l"),"Https");
  localStorage.setItem("sectionr"+localStorage.getItem("link"),parseInt(localStorage.getItem("sectionr"+localStorage.getItem("link")))+1);
  document.getElementsByClassName("toggle")[5].style.display="inline";
  if(localStorage.getItem("sectionr"+localStorage.getItem("link"))>8){document.getElementsByClassName("toggle")[4].
    style.display="none"};location.reload()},false);

//Right Link Subtraction
document.getElementsByClassName("toggle")[5].addEventListener("click",function(){
  localStorage.removeItem("r"+localStorage.getItem("link")+parseInt(localStorage.getItem("sectionr"+localStorage.getItem("link"))-1));
  localStorage.removeItem("r"+localStorage.getItem("link")+parseInt(localStorage.getItem("sectionr"+localStorage.getItem("link"))-1)+"l");
  localStorage.setItem("sectionr"+localStorage.getItem("link"),parseInt(localStorage.getItem("sectionr"+localStorage.getItem("link")))-1);
  document.getElementsByClassName("toggle")[4].style.display="inline";
  if(localStorage.getItem("sectionr"+localStorage.getItem("link"))<1){document.getElementsByClassName("toggle")[5].
    style.display="none"};location.reload()},false);

  break;}