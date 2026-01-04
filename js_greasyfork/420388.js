// ==UserScript==
// @name        Kiwi Browser Custom New Tab
// @namespace   Kiwi Browser Custom New Tab
// @match       chrome-search://local-ntp/local-ntp.html
// @version     5
// @description Ye ye, ye
// @icon        https://play-lh.googleusercontent.com/IpPy16lik1fLrJs0fkaFuKrUm6Hw9Q3KDa2gLbewoze0Ko39gEIOyDECYOZBFJLHGeo=s180
// @downloadURL https://update.greasyfork.org/scripts/420388/Kiwi%20Browser%20Custom%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/420388/Kiwi%20Browser%20Custom%20New%20Tab.meta.js
// ==/UserScript==
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
    ".section{"+
      "display:none;}"+
    "video{"+
      "position:absolute;"+
      "top:0px;"+
      "left:0px;"+
      "display:none;}"+
    "input{"+
      "opacity:0;"+
      "position:absolute;"+
      "right:0px;"+
      "bottom:0px;"+
      "font-size:1.4276em;"+
      "line-height:324%;}"+
    ".portrait{"+
      "width:100%;}"+
    ".landscape{"+
      "height:100%;}"+
  "</style>";
document.body.innerHTML=
  "<img src='https://cdn.donmai.us/original/74/95/__junko_touhou_drawn_by_zephid__74952c72b9306e5617885e90237429e4.png?__cf_chl_jschl_tk__=4950a03edec9a2cc54085ca74212e682671dc0a1-1610878432-0-ASoqqyZHKRTwBxCocKd6OwYUWF30x6LSYyBQ2G39Nl125By5LoZBuvzpaFVdr398A3M_YZmJQXQ__XIHqEm-FMg3goWZsjIqtta-Ak4DnGgwmG4_VMKjKQPluPe03WqsGKTMzh0pktq7mdLhGad8ZaahKZyBV5pG7TFYFhQsgHjjOjPMhsgXZXE_NkiTh4iEMH2_YfNaiVWmFa761fFVooY_T4ovTbTE_6vuFLXvj_vBY6yw-bo6goEbGHKuwWaBUT4Pu3s8prV8PZd4mo7AT8USNAOcoRK96GPKOBTtRLfNQJTcUXwLbU_XPoubss2wn1wMFYvEhRA5aPXwtDsyFiVXace56NOmEikxT2XtXUEdP1moxxydB1r9qJPK_wnR96jFxrwKdOj8ZjMV58jJU5DRvkgwTFU6xTtwvaF_z7Oi'/>"+
  "<div class='left'>"+
    "<div class='home'>"+
      "<a class='menu'>4channel<br><br></a>"+
      "<a class='menu'>Boorus<br><br></a>"+
      "<a class='menu'>Porn<br><br></a>"+
    "</div>"+
    "<div class='section'>"+
      "<a class='back'>Back<br></a>"+
      "<a href='https://boards.4channel.org/a/catalog'>Anime & Manga<br></a>"+
      "<a href='https://boards.4channel.org/v/catalog'>Video Games<br></a>"+
      "<a href='https://boards.4channel.org/g/catalog'>Technology<br></a>"+
      "<a href='https://boards.4channel.org/m/catalog'>Mecha<br></a>"+
      "<a href='https://boards.4channel.org/ck/catalog'>Food & Cooking<br></a>"+
      "<a href='https://boards.4channel.org/wsg/catalog'>Worksafe GIF<br></a>"+
      "<a href='https://archived.moe/v/'>Archived Moe<br></a>"+
    "</div>"+
    "<div class='section'>"+
      "<a><br><br></a>"+
      "<a class='back'>Back<br></a>"+
      "<a href='https://chan.sankakucomplex.com/'>Sankaku<br></a>"+
      "<a href='https://gelbooru.com/index.php?page=post&s=list&tags=all'>Gelbooru<br></a>"+
      "<a href='https://rule34.xxx/index.php?page=post&s=list'>Rule 34<br></a>"+
    "</div>"+
    "<div class='section'>"+
      "<a><br><br><br><br></a>"+
      "<a class='back'>Back<br></a>"+
      "<a href='https://www.pornhub.com/'>Pornhub<br></a>"+
      "<a href='https://www.xvideos.com/'>Xvideos<br></a>"+
    "</div>"+
  "</div>"+
  "<div class='right'>"+
    "<div class='home'>"+
      "<a class='menu'>4chan<br><br></a>"+
      "<a class='menu'>Hentai<br><br></a>"+
      "<a class='menu'>Search<br><br></a>"+
    "</div>"+
    "<div class='section'>"+
      "<a class='back'>Back<br></a>"+
      "<a href='https://boards.4channel.org/b/catalog'>Random<br></a>"+
      "<a href='https://boards.4channel.org/r9k/catalog'>ROBOT9001<br></a>"+
      "<a href='https://boards.4channel.org/trash/catalog'>Trash<br></a>"+
      "<a href='https://boards.4channel.org/h/catalog'>Hentai<br></a>"+
      "<a href='https://boards.4channel.org/e/catalog'>Ecchi<br></a>"+
      "<a href='https://boards.4channel.org/gif/catalog'>Adult GIF<br></a>"+
      "<a href='https://desuarchive.org/trash/'>Desu Archive<br></a>"+
    "</div>"+
    "<div class='section'>"+
      "<a><br><br></a>"+
      "<a class='back'>Back<br></a>"+
      "<a href='https://exhentai.org/'>ExHentai<br></a>"+
      "<a href='https://nhentai.net/'>NHentai<br></a>"+
      "<a href='https://hentai.cafe/'>Hentai Cafe<br></a>"+
    "</div>"+
    "<div class='section'>"+
      "<a><br><br><br><br></a>"+
      "<a class='back'>Back<br></a>"+
      "<a href='https://yandex.com/images/'>Yandex<br></a>"+
      "<a href='https://www.iqdb.org/'>Iqdb<br></a>"+
    "</div>"+
  "</div>"+
  "<input type='file' accept='video/*' id='input-tag'/>"+
  "<video controls loop id='video-tag' class='portrait landscape'>"+
    "<source id='video-source' src='splashVideo'>"+
  "</video>";
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
document.querySelector("#input-tag").addEventListener("change",readVideo);
function readVideo(event){console.log(event.target.files);
  if(event.target.files && event.target.files[0]){
    document.getElementsByClassName("left")[0].style.display="none";
    document.getElementsByClassName("right")[0].style.display="none";
    document.getElementsByTagName("video")[0].style.display="inline";
    var reader = new FileReader();
    reader.onload = function(e){
      console.log("loaded");
      document.querySelector("#video-source").src = e.target.result;
      document.querySelector("#video-tag").load();}.bind(this);
    setTimeout(function(){
      if(document.getElementsByTagName("video")[0].videoWidth*693
        >document.getElementsByTagName("video")[0].videoHeight*393){
        document.getElementsByTagName("video")[0].classList.remove("portrait");}else{
        document.getElementsByTagName("video")[0].classList.remove("landscape");}}, 250);
    reader.readAsDataURL(event.target.files[0]);}}