// ==UserScript==
// @name        Asagi's Black Soliloquy
// @namespace   Asagi's Black Soliloquy
// @match       https://desuarchive.org/*
// @match       https://archived.moe/*
// @version     2.4
// @description It all returns to nothing. It just keeps tumbling down, tumbling down, tumbling down.
// @icon        https://desuarchive.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/445874/Asagi%27s%20Black%20Soliloquy.user.js
// @updateURL https://update.greasyfork.org/scripts/445874/Asagi%27s%20Black%20Soliloquy.meta.js
// ==/UserScript==

//==Initialization==
if(document.querySelector(".post_title").innerHTML.length==0){
  tit=document.querySelector(".text")}else{tit=document.querySelector(".post_title")}
if(!window.location.href.indexOf("search")>-1){
  document.title=document.title.split(" ")[0]+" - "+tit.innerHTML.
    replace(/\<span class\=\"greentext\"\>|\<a .+?\<\/a\>/g,"").
    replace(/\<\/span\>|\<br\>|\<\/span\>\<br\>/g," ").replace(/\&gt\;/,">").substring(0,40)}
document.head.innerHTML+="<style>.spoiler{background:black!important}</style>"
bak=document.getElementsByClassName("backlink");gleb=["placeholder"];belg=0;
img="this.style.display=`none`;this.parentNode.querySelector(`.";suace="https://d"
exp="ost_image`).style.display=`inline`;";exz="inline";nxz="none";
document.querySelector(".letters").style.display="none"
document.querySelectorAll(".nav")[1].style.display="none"
document.querySelector(".dropdown-menu").style.top="141px"
document.querySelectorAll(".nav")[0].addEventListener("click",function(){
  document.querySelectorAll(".nav")[1].style.display="inline"})
document.querySelector(".navbar-search").addEventListener("click",function(){
  document.querySelector(".search_box").style.display="block"
  document.querySelector(".search_box").style.position="absolute"
  document.querySelector(".search_box").style.top=
    document.querySelector(".navbar-search").getBoundingClientRect().top+"px"
  document.querySelector("#search_form_comment").select()})
document.querySelector("article").addEventListener("click",function(){
  document.querySelector(".search_box").style.display="none"
  document.querySelectorAll(".nav")[1].style.display="none"})
//==/Initialization==

// ==Fuckin' Buttons 'n Shiet==
document.querySelector("#main").innerHTML+=
  "<a class='btnr fappe' style='position:sticky;bottom:0'>Fappe</a>"+
  "<a class='btnr nappe' style='position:sticky;bottom:0;display:none'>Fappe</a>"+
  "<a class='btnr expand' style='position:sticky;bottom:0'>Expand</a>"+
  "<a class='btnr nxpand' style='position:sticky;bottom:0;display:none'>Expand</a>"+
  "<a class='btnr top' style='position:sticky;bottom:0'>Top</a>"+
  "<a class='btnr bot' style='position:sticky;bottom:0'>Bot</a>"+
  "<a class='btnr exh' style='position:sticky;bottom:0'>Exh</a>"+
  "<a class='btnr coc' style='position:sticky;bottom:0'>Coc</a>"
document.querySelector(".fappe").addEventListener("click",function(){
  for(let a=document.querySelectorAll("article:not(.has_image)").length;a--;){
    document.querySelectorAll("article:not(.has_image)")[a].style.display="none"}
  this.style.display="none";document.querySelector(".nappe").style.display="inline"})
document.querySelector(".nappe").addEventListener("click",function(){
  for(let a=document.querySelectorAll("article:not(.has_image)").length;a--;){
    document.querySelectorAll("article:not(.has_image)")[a].style.display="block"}
  this.style.display="none";document.querySelector(".fappe").style.display="inline"})
document.querySelector(".expand").addEventListener("click",function(){
  exz="none";for(a=document.querySelectorAll(".post_image").length;a--;){
    document.querySelectorAll(".post_image")[a].style.display="none"}
  nxz="inline";for(a=document.querySelectorAll(".fost_image").length;a--;){
    document.querySelectorAll(".fost_image")[a].style.display="inline"}
  this.style.display="none";document.querySelector(".nxpand").style.display="inline"})
document.querySelector(".nxpand").addEventListener("click",function(){
  nxz="none";for(a=document.querySelectorAll(".fost_image").length;a--;){
    document.querySelectorAll(".fost_image")[a].style.display="none"}
  exz="inline";for(a=document.querySelectorAll(".post_image").length;a--;){
    document.querySelectorAll(".post_image")[a].style.display="inline"}
  this.style.display="none";document.querySelector(".expand").style.display="inline"})
document.querySelector(".top").addEventListener("click",function(){window.scrollTo(0,0)})
document.querySelector(".bot").addEventListener("click",function(){window.scrollTo(0,document.body.scrollHeight)})
document.addEventListener("mousedown",function(){document.querySelector(".exh").href=
  "https://exhentai.org/?f_search="+window.getSelection().toString()})
document.querySelector(".coc").addEventListener("click",function(){b=0
  for(a=document.querySelectorAll(".text").length-1;a--;){
    if(document.querySelectorAll(".text")[a].innerHTML.includes("the")){
      setTimeout(function(){window.scrollTo(0,document.querySelectorAll(".text")[b].offsetTop)},b*1000)}b++}})
//b=0;c=document.body.scrollHeightfor(a=0;a<c*1.2;a=a+800){setTimeout(function(){window.scrollTo(0,b);b=b+800},a/20)}
// ==/Fuckin' Buttons 'n Shiet==

//==Desuarchive==
if(window.location.href.indexOf("desu")>-1){
for(a=document.querySelectorAll(".post_ghost,.section_title,.thread_form_wrap,.footer_text").length;a--;){
  document.querySelectorAll(".post_ghost,.section_title,.thread_form_wrap,.footer_text")[a].style.display="none"}
document.querySelectorAll(".pull-right")[document.querySelectorAll(".pull-right").length-1].style.display="none"
if(window.location.href.indexOf("search")>-1){
highl=document.querySelector("#search_form_comment");light=document.querySelectorAll(".text")
for(a=light.length;a--;){for(b=highl.value.split(" ").length;b--;){
  for(c=light[a].innerHTML.split(new RegExp(highl.value.split(" ")[b],"i")).length-1;c--;){
    light[a].innerHTML=light[a].innerHTML.replace(new RegExp(highl.value.split(" ")[b],"i"),"<span class='hihg'>"+
    highl.value.split(" ")[b].substring(0,1)+"<span></span>"+highl.value.split(" ")[b].substring(1)+"</span>")}}}
document.head.innerHTML+="<style>.hihg{background:black;color:white;}</style>"}
//==/Desuarchive==

// ==EEEEEVERYTHING==
window.onload=function(){for(let a=document.querySelectorAll("article.post,article.post_is_op").length;a--;){new
  IntersectionObserver(function(entries, observer){entries.forEach(entry=>{if(entry.intersectionRatio>0){
    if(entry.target.classList.contains("post_is_op")&&window.location.href.indexOf("thread")>-1){
      entry.target.style.setProperty("margin", "0px", "important")
      entry.target.querySelector(".text").style.setProperty("padding", "5px 20px 5px 23px", "important")
      entry.target.querySelector("[title='Post Count / File Count / Posters']").innerHTML+=
        "<br>"+entry.target.querySelector(".post_title").outerHTML+
        "<br>"+entry.target.querySelector(".post_file").outerHTML
      entry.target.querySelector(".post_file").removeAttribute("style")
      entry.target.querySelector(".post_file").style.setProperty("font-size", "11px")
      entry.target.querySelectorAll(".post_title")[1].remove()
      entry.target.querySelector(".mobile_view").remove()
//Videos & Spoilers
      if(entry.target.querySelector("[download]").href.includes("webm")){
        fs="<video src='";fe=" controls loop></video>"}else{fs="<img src='";fe="/>"}
      entry.target.querySelector(".thread_image_box").innerHTML=
        entry.target.querySelector(".post_image").outerHTML+
        fs+entry.target.querySelector("[download]").href+
        "' class='fost_image' loading='lazy' width='360px'"+fe}else{
      if(entry.target.classList.contains("has_image")){
        if(entry.target.querySelector("[download]").href.includes("webm")){
          pos="<video src='";fos=" controls loop></video>"}else{pos="<img src='";fos="/>"}
//Post Layout
        entry.target.querySelector(".post_wrapper").innerHTML=
          entry.target.querySelector("header").outerHTML+
          entry.target.querySelector(".post_file").outerHTML+
          entry.target.querySelector(".thread_image_box").outerHTML+
          entry.target.querySelector(".text").outerHTML+
          entry.target.querySelector(".backlink_list").outerHTML
        entry.target.querySelector(".thread_image_box").innerHTML=
          entry.target.querySelector(".post_image").outerHTML+pos+
          entry.target.querySelector("[download]").href+
          "' class='fost_image' loading='lazy' width='360px'"+fos}else{
        entry.target.querySelector(".post_wrapper").innerHTML=
          entry.target.querySelector("header").outerHTML+
          entry.target.querySelector(".text").outerHTML+
          entry.target.querySelector(".backlink_list").outerHTML}
//Post Styling
      entry.target.querySelector(".post_wrapper").style.padding="0px 5px 0px 5px"
      entry.target.querySelector(".post_wrapper").style.setProperty("width", "97%", "important")
      entry.target.querySelector(".text").style.setProperty("padding", "10px 45px 10px 38px", "important")}
    if(entry.target.classList.contains("has_image")){
      entry.target.querySelector(".post_file_filename").href=
        entry.target.querySelector("[download]").href
      entry.target.querySelector(".post_file_filename").target="_blank"
      entry.target.querySelector(".thread_image_box").style.textAlign="left"
      entry.target.querySelector(".post_image").style.display=exz
      entry.target.querySelector(".fost_image").style.display=nxz
      entry.target.querySelector(".post_image").setAttribute("onclick",img+"f"+exp)
      entry.target.querySelector(".fost_image").setAttribute("onclick",img+"p"+exp+
        "this.parentNode.parentNode.parentNode.scrollIntoView()")
      if(!entry.target.querySelector("[download]").href.includes("webm")){
        entry.target.querySelector("[href*='saucenao']").href=
          entry.target.querySelector("[href*='saucenao']").href.split(suace)[0]+
          entry.target.querySelector("[download]").href}}
    entry.target.querySelector(".backlink_list").innerHTML=
      entry.target.querySelector(".backlink_list").innerHTML.replace("Quoted By:","")
    entry.target.querySelector("[title*='Link']").outerHTML="<span>"+
      entry.target.querySelector("[title*='Link']").innerHTML+"</span>"
    entry.target.querySelector("[title*='Reply']").outerHTML="<span>"+
      entry.target.querySelector("[title*='Reply']").innerHTML+"</span>"
    entry.target.querySelector(".dropdown").style.setProperty("display", "inline", "important")
    entry.target.querySelector(".dropdown").style.setProperty("float", "right", "important")
    entry.target.querySelector("[data-toggle]").style.setProperty("padding", "0px", "important")
    entry.target.querySelector("[data-toggle]").style.setProperty("margin", "0px", "important")
    entry.target.querySelector(".dropdown-menu").style.left="-141px"
//Backlinking
    setTimeout(function(){for(let a=bak.length;a--;){if(bak[a].href.split("/")[5]==
      window.location.href.split("/")[5]){bak[a].removeAttribute("href")}
      bak[a].addEventListener("click",function(){gleb[belg]=bak[a].parentNode.
        parentNode.parentNode.parentNode;belg+=1;if(belg==1){first=window.scrollY}
        document.getElementById(bak[a].innerHTML.substring(8,17)).
          querySelector(".post_author").style.color="#b5bd68"
        document.getElementById(bak[a].innerHTML.substring(8,17)).style.display="block"
        if(document.getElementById(bak[a].innerHTML.substring(8,17)).parentNode.contains(
          document.querySelector(".post_is_op"))){document.body.scrollIntoView()}else{
            document.getElementById(bak[a].innerHTML.substring(8,17)).
              querySelector(".post_wrapper").style.background="#1d1d21"
            document.getElementById(bak[a].innerHTML.substring(8,17)).scrollIntoView({block:"center"})}
        setTimeout(function(){document.getElementById(bak[a].innerHTML.substring(8,17)).
          querySelector(".post_data").addEventListener("click",function(){belg-=1;
            document.getElementById(bak[a].innerHTML.substring(8,17)).
              querySelector(".post_author").style.color="#eeeeee"
            document.getElementById(bak[a].innerHTML.substring(8,17)).
              querySelector(".post_wrapper").style.background="#282a2e"
            if(belg==0){window.scrollTo(0,first)}else{if(gleb[belg].contains(
              document.querySelector(".post_is_op"))){document.body.scrollIntoView()}else{
                gleb[belg].scrollIntoView({block:"center"})}}
            if(!document.getElementById(bak[a].innerHTML.substring(8,17)).classList.
               contains("has_image")&&getComputedStyle(document.querySelector(".fappe")).display=="none"){
                document.getElementById(bak[a].innerHTML.substring(8,17)).
                  style.display="none"}},{once:true})},100)})}},1)
    if(window.location.href.indexOf("search")>-1){
      entry.target.querySelector(".mobile_view").querySelector("a").href=
      entry.target.querySelector(".mobile_view").querySelector("a").href.split("#")[0]};observer.unobserve(entry.target)
    }})},{rootMargin:"1000px"}).observe(document.querySelectorAll("article.post,article.post_is_op")[a])}}}else{
//opimg="https://arch-img.b4k.co/v"+document.querySelector(".post_file_filename").href.split("full_image")[1].
//split(".")[0].slice(0,-3)+"."+document.querySelector('.post_file_filename').href.split(".")[3];
opimg="https://arch-img.b4k.co/v"+document.querySelector(".post_file_filename").href.split(/ct|ge|\./)[2].
slice(0,-3)+"."+document.querySelector('.post_file_filename').href.split(".")[2];
window.onload=function(){for(let a=document.querySelectorAll("article.post,article.post_is_op").length;a--;){
  new IntersectionObserver(function(entries, observer){entries.forEach(entry=>{if(entry.intersectionRatio>0){
    observer.unobserve(entry.target);if(entry.target.classList.contains("has_image")){
      file=entry.target.querySelector(".post_file_filename").href
      if(file.includes("webm")){fart="<video ";fend="' controls loop></video>"}else{fart="<img loading='lazy' ";fend="'>"}
        if(entry.target.querySelectorAll(".spoiler_box").length>0&&entry.target.classList.contains("post")){
          entry.target.querySelector(".thread_image_box").innerHTML=fart+"class='post_image' style='"+(
            parseInt(entry.target.querySelector(".post_file_metadata").innerHTML.split(/\ |x/)[2])>
            parseInt(entry.target.querySelector(".post_file_metadata").innerHTML.split(/\ |x/)[3])?"width":"height")+
            ":125px;display:"+exz+"' src='https://arch-img.b4k.co/v"+
        file.split(/ct|ge|\./)[2].slice(0,-3)+"."+file.split(".")[2]+fend}
      entry.target.querySelector(".thread_image_box").innerHTML=entry.target.querySelector(".post_image").outerHTML+
      fart+"class='fost_image' style='width:360px;display:"+nxz+"' src='data:image/png;base64,"+
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8"+
        "YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXYzh8+DAABJYCSsTDBsYAAAAASUVORK5CYII='"+fend
      entry.target.querySelector(".post_image").setAttribute("onclick",
        "this.style.display='none';this.parentNode.querySelector('.fost_image').style.display='inline';setTimeout("+
        "function(){document.querySelectorAll('article.post,article.post_is_op')["+a+
        "].querySelector('.fost_image').src='"+(!a?opimg:"https://arch-img.b4k.co/v"+
        file.split(/ct|ge|\./)[2].slice(0,-3)+"."+file.split(".")[2])+"'},"+a*10+")")
      entry.target.querySelector(".fost_image").setAttribute("onclick",
      "this.style.display='none';this.parentNode.querySelector('.post_image').style.display='inline'")}
    if(entry.target.classList.contains("post_is_op")&&window.location.href.indexOf("thread")>-1){
      entry.target.style.setProperty("margin", "0px", "important")
      entry.target.querySelector(".text").style.setProperty("padding", "5px 20px 5px 23px", "important")
      entry.target.querySelector(".mobile_view").remove()}else{
      if(entry.target.classList.contains("has_image")){
//Post Layout
        entry.target.querySelector(".post_wrapper").innerHTML=
          entry.target.querySelector("header").outerHTML+
          entry.target.querySelector(".post_file").outerHTML+
          entry.target.querySelector(".thread_image_box").outerHTML+
          entry.target.querySelector(".text").outerHTML+
          entry.target.querySelector(".backlink_list").outerHTML
        entry.target.querySelector(".post_file_filename").target="_blank"
        entry.target.querySelector(".thread_image_box").style.textAlign="left"}else{
        entry.target.querySelector(".post_wrapper").innerHTML=
          entry.target.querySelector("header").outerHTML+
          entry.target.querySelector(".text").outerHTML+
          entry.target.querySelector(".backlink_list").outerHTML}
//Post Styling
      entry.target.querySelector(".post_wrapper").style.padding="0px 5px 0px 5px"
      entry.target.querySelector(".post_wrapper").style.setProperty("width", "97%", "important")
      entry.target.querySelector(".text").style.setProperty("padding", "10px 45px 10px 38px", "important")}
    entry.target.querySelector(".backlink_list").innerHTML=
      entry.target.querySelector(".backlink_list").innerHTML.replace("Quoted By:","")
    entry.target.querySelector(".post_data>[data-function='highlight']").outerHTML="<span>"+
      entry.target.querySelector(".post_data>[data-function='highlight']").innerHTML+"</span>"
    entry.target.querySelector(".post_data>[data-function='quote']").outerHTML="<span>"+
      entry.target.querySelector(".post_data>[data-function='quote']").innerHTML+"</span>"
    entry.target.querySelector(".dropdown").style.setProperty("display", "inline", "important")
    entry.target.querySelector(".dropdown").style.setProperty("float", "right", "important")
    entry.target.querySelector("[data-toggle]").style.setProperty("padding", "0px", "important")
    entry.target.querySelector("[data-toggle]").style.setProperty("margin", "0px", "important")
    entry.target.querySelector(".dropdown-menu").style.left="-141px"
    entry.target.querySelector("[href*='sauce'").href="https://saucenao.com/search.php?url="+
      (!a?opimg:"https://arch-img.b4k.co/v"+file.split(/ct|ge|\./)[2].slice(0,-3)+"."+file.split(".")[2])
//Backlinking
    setTimeout(function(){for(let a=bak.length;a--;){if(bak[a].href.split("/")[5]==
      window.location.href.split("/")[5]){bak[a].removeAttribute("href")}
      bak[a].addEventListener("click",function(){gleb[belg]=bak[a].parentNode.
        parentNode.parentNode.parentNode;belg+=1;if(belg==1){first=window.scrollY}
        document.getElementById(bak[a].innerHTML.substring(8,17)).
          querySelector(".post_author").style.color="#b5bd68"
        document.getElementById(bak[a].innerHTML.substring(8,17)).style.display="block"
        if(document.getElementById(bak[a].innerHTML.substring(8,17)).parentNode.contains(
          document.querySelector(".post_is_op"))){document.body.scrollIntoView()}else{
            document.getElementById(bak[a].innerHTML.substring(8,17)).
              querySelector(".post_wrapper").style.background="#1d1d21"
            document.getElementById(bak[a].innerHTML.substring(8,17)).scrollIntoView({block:"center"})}
        setTimeout(function(){document.getElementById(bak[a].innerHTML.substring(8,17)).
          querySelector(".post_data").addEventListener("click",function(){belg-=1;
            document.getElementById(bak[a].innerHTML.substring(8,17)).
              querySelector(".post_author").style.color="#eeeeee"
            document.getElementById(bak[a].innerHTML.substring(8,17)).
              querySelector(".post_wrapper").style.background="#282a2e"
            if(belg==0){window.scrollTo(0,first)}else{if(gleb[belg].contains(
              document.querySelector(".post_is_op"))){document.body.scrollIntoView()}else{
                gleb[belg].scrollIntoView({block:"center"})}}
            if(!document.getElementById(bak[a].innerHTML.substring(8,17)).classList.
               contains("has_image")&&getComputedStyle(document.querySelector(".fappe")).display=="none"){
                document.getElementById(bak[a].innerHTML.substring(8,17)).
                  style.display="none"}},{once:true})},400)})}},400)
    if(window.location.href.indexOf("search")>-1){
      entry.target.querySelector(".mobile_view").querySelector("a").href=
      entry.target.querySelector(".mobile_view").querySelector("a").href.split("#")[0]}
    }})},{rootMargin:"1000px"}).observe(document.querySelectorAll("article.post,article.post_is_op")[a])}}}
// ==/EEEEEVERYTHING==