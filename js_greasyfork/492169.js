// ==UserScript==
// @name         Youtube Video Actions
// @namespace    violentmonkey.net
// @version      1.2
// @author       Alexito
// @match        https://www.youtube.com/*
// @include        https://www.google.com/*
// @include        *://invidious.instances*
// @include        https://yewtu.be/*
// @include        https://invidious.flokinet.to/*
// @include        https://invidious.privacyredirect.com/*
// @include        https://invidious.privacydev.net/*
// @include        https://inv.nadeko.net/*
// @grant         GM_addStyle
// @icon          https://www.youtube.com/s/desktop/4e7ec2e0/img/favicon.ico
// @description  multiple actions for YouTube videos, such as downloading, opening in an external player, opening subtitles in another tab, opening in alternative pages, viewing the enlarged thumbnail and a few more things
// @description:es múltiples acciones para videos de YouTube, como descargar, abrir en un reproductor externo, abrir subtítulos en otra pestaña, abrir en páginas alternativas, ver la miniatura ampliada y algunas cosas más
// @license        MIT    feel free to modify improve and share
// @downloadURL https://update.greasyfork.org/scripts/492169/Youtube%20Video%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/492169/Youtube%20Video%20Actions.meta.js
// ==/UserScript==

//     let style = document.createElement('style');
//     style.type = 'text/css';
//     style.innerHTML = "::placeholder {color:white;}input#nociv{position:fixed;color: white;padding: 0;text-align: center;width: 70px;height: 15px;z-index:9999;}";
// document.body.appendChild(style);
GM_addStyle(`::placeholder {color:white;}input#nociv{position:fixed;color: white;padding: 0;text-align: center;width: 70px;height: 15px;z-index:9999;}`);
var links;
let x, y;
var origurl;
var winmini;
function actiona(){
window.addEventListener("mousedown", actionb, false);
};

function actionb(){
    links = document.querySelector("a:hover");
    var recta = links.parentNode.getBoundingClientRect();
      x = recta.left;
      y = recta.top;
    links.addEventListener("drag",function(){
var putbuttons = document.querySelector("body > #nociv");
    if(links && !putbuttons){
// GM_addStyle(`ytd-moving-thumbnail-renderer { display: none; }`);
origurl = document.location.href;
        var Button1 = document.createElement("input");
          Button1.type = "text";
    Button1.value = "";
    Button1.placeholder = "Embed";
    Button1.style.top = y-0+"px";
    Button1.style.left = x-73+"px";
    Button1.addEventListener("input",function(){
    if(Button1.value.indexOf("watch?v=") > 1){

var link = Button1.value.replace(/.+\/shorts\//, '').replace(/.+v=/, '').slice(0, 11);
// window.history.pushState(null, "", "https://www.youtube.com/watch?v="+link);
    if (winmini) {
winmini.location.href = "https://www.youtube.com/embed/"+link;
    } else {
var winmini = window.open( "https://www.youtube.com/embed/"+link,'wind1', "location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=318,left=390,top=800,modal=yes,dependent=yes");
    };
// window.history.pushState(null, "", origlink);
actionrem();
actionwatched(link);
 };
});
        var Button2 = document.createElement("input");
          Button2.type = "text";
    Button2.value = "";
    Button2.placeholder = "Invidious";
    Button2.style.top = y+18+"px";
    Button2.style.left = x-73+"px";
    Button2.addEventListener("input",function(){
    if(Button2.value.indexOf("watch?v=") > 1){
     const link = Button2.value.replace("www.youtube.com", "inv.nadeko.net");  //"inv.tux.pizza""invidious.materialio.us"" "invidious.flokinet.to""invidious.privacyredirect.com"
    window.open("" + link, "_blank");
  };
});
        var Button3 = document.createElement("input");
          Button3.type = "text";
    Button3.value = "";
    Button3.placeholder = "Smplayer";
    Button3.style.top = y+36+"px";
    Button3.style.left = x-73+"px";
    Button3.addEventListener("input",function(){
    if(Button3.value.indexOf("watch?v=") > 1){
     const link = Button3.value.replace("https://", "");
    window.open("smplayer://" + link, "_self");
    };
});
        var Button4 = document.createElement("input");
          Button4.type = "text";
    Button4.value = "";
    Button4.placeholder = "360p";
    Button4.style.top = y+54+"px";
    Button4.style.left = x-73+"px";
    Button4.addEventListener("input",function(){
    if(Button4.value.indexOf("watch?v=") > 1){
     const link = Button4.value.replace(/.+\/shorts\//, '').replace(/.+v=/, '').slice(0, 11);
winmini = window.open( "https://inv.nadeko.net/latest_version?id="+link+"&itag=18",'wind1', "location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=318,left=390,top=800,modal=yes,dependent=yes");
actionwatched(link);
// setTimeout(() => {actionwatched(link)}, 1000);

    };
});

        var Button5 = document.createElement("input");
          Button5.type = "text";
    Button5.value = "";
    Button5.placeholder = "720p";
    Button5.style.top = y+72+"px";
    Button5.style.left = x-73+"px";
    Button5.addEventListener("input",function(){
    if(Button5.value.indexOf("watch?v=") > 1){
     const link = Button5.value.replace(/.+\/shorts\//, '').replace(/.+v=/, '').slice(0, 11);
var winmini = window.open( "https://invidious.perennialte.ch/latest_version?id="+link+"&itag=22",'wind1', "location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=318,left=390,top=800,modal=yes,dependent=yes");
actionwatched(link);
    };
});
        var Button6 = document.createElement("input");
          Button6.type = "text";
    Button6.value = "";
    Button6.placeholder = "Convert";
    Button6.style.top = y+126+"px";
    Button6.style.left = x-73+"px";
    Button6.addEventListener("input",function(){
    if(Button6.value.indexOf("watch?v=") > 1){
     const link = Button6.value.replace(/.+\/shorts\//, '').replace(/.+v=/, '').slice(0, 11);
    var winconvert = window.open( "https://tomp3.cc/youtube-downloader/" + link,'winconvert', "location=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,dependent=yes");
 };
});
        var Button9 = document.createElement("input");
          Button9.type = "text";
    Button9.value = "";
    Button9.placeholder = "Subtitles";
    Button9.style.top = y+108+"px";
    Button9.style.left = x-73+"px";
    Button9.addEventListener("input",function(){
    if(Button9.value.indexOf("watch?v=") > 1){
     const link = Button9.value.replace(/.+\/shorts\//, '').replace(/.+v=/, '').slice(0, 11);
    var winsub = window.open( "https://invidious.fdn.fr/api/v1/captions/" + link + "?label=Spanish%20(auto-generated)",'wins1', "location=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,dependent=yes");
    };
});
        var Button7 = document.createElement("input");
          Button7.type = "text";
    Button7.value = "";
    Button7.placeholder = "Deturl";
    Button7.style.top = y+162+"px";
    Button7.style.left = x-73+"px";
    Button7.addEventListener("input",function(){
    if(Button7.value.indexOf("watch?v=") > 1){
     const link = Button7.value.replace("", "");
    window.open("http://deturl.com/?url=" + link, "_blank");
    };
});
        var Button8 = document.createElement("input");
          Button8.type = "text";
    Button8.value = "";
    Button8.placeholder = "Tubo";
    Button8.style.top = y+144+"px";
    Button8.style.left = x-73+"px";
    Button8.addEventListener("input",function(){
    if(Button8.value.indexOf("watch?v=") > 1){
     const link = Button8.value.replace("", "");
    window.open("https://tubo.migalmoreno.com/stream?url=" + link, "_blank");
    };
});
        var Button10 = document.createElement("input");
          Button10.type = "text";
    Button10.value = "";
    Button10.placeholder = "Thumbnail";
    Button10.style.top = y+90+"px";
    Button10.style.left = x-73+"px";
    Button10.addEventListener("input",function(){
    if(Button10.value.indexOf("watch?v=") > 1){
     const link = Button10.value.replace(/.+\/shorts\//, '').replace(/.+v=/, '').slice(0, 11);
    // window.open("https://i.ytimg.com/vi/" + link + "/maxresdefault.jpg", "_blank");       //1280x720
    // window.open("https://i.ytimg.com/DtM_sw5nBfA/" + link + "/maxresdefault.webp", "_blank");         //1920x1080
   // window.open("https://inv.tux.pizza/vi/" + link +" /maxres.jpg";
    // var winthumb = window.open( "https://i.ytimg.com/vi/" + link + "/maxresdefault.jpg",'wint1', "location=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,dependent=yes");
      var img = document.createElement("img");
   img.id = "imaginate";
   img.setAttribute("style", "position:fixed; top:0px; left:0px; overflow: hidden; z-index:9999;");
   img.src = "https://i.ytimg.com/vi/" + link + "/maxresdefault.jpg";
   // img.src = "https://inv.tux.pizza/vi/" + link +"/maxres.jpg";
  document.body.appendChild(img);
    };
});

        Button1.id = "nociv";
        Button2.id = "nociv";
        Button3.id = "nociv";
        Button4.id = "nociv";
        Button5.id = "nociv";
        Button6.id = "nociv";
        Button7.id = "nociv";
        Button8.id = "nociv";
        Button9.id = "nociv";
        Button10.id = "nociv";
        Button1.style.backgroundColor = "#1d6d1d";
        Button2.style.backgroundColor = "#135282";
        Button3.style.backgroundColor = "#8a4c0c";
        Button4.style.backgroundColor = "#067fa7";
        Button5.style.backgroundColor = "#5f335f";
        Button6.style.backgroundColor = "#9a0808";
        Button7.style.backgroundColor = "#126b6b";
        Button8.style.backgroundColor = "#8e617c";
        Button9.style.backgroundColor = "#1f409d";
        Button10.style.backgroundColor = "#197af3";

        document.body.appendChild(Button1);
        document.body.appendChild(Button2);
        document.body.appendChild(Button3);
        document.body.appendChild(Button4);
        document.body.appendChild(Button5);
        document.body.appendChild(Button6);
        document.body.appendChild(Button7);
        document.body.appendChild(Button8);
        document.body.appendChild(Button9);
        document.body.appendChild(Button10);
    }
  });
};

function actionrem(){
document.querySelectorAll("[id='nociv']").forEach(function(a){a.remove()})
// GM_addStyle(`ytd-moving-thumbnail-renderer { display: block; }`);
};
function actionremb(){
document.querySelector("#imaginate").remove();
};
function actionwatched(link){
if(location.href.indexOf("youtube.com") > 1){
  window.history.pushState(null, "", "https://www.youtube.com/watch?v="+link);
setTimeout(() => {window.history.pushState(null, "", origurl)}, 100);
 };
};
window.addEventListener("dragend", actionrem, false);
window.addEventListener("click", actionremb, false);
actiona();

function funsionp(){
if (window.location.href.indexOf("/embed/") > 1) {
   var vid = document.querySelector('video');
  if(vid){
    // if(!vid.src){
  document.querySelector("#movie_player > div.ytp-cued-thumbnail-overlay > button").click();
    } else {
 setTimeout(funsionp, 3000);
   };
  // };
 };
};
funsionp();


////////////////////////////////////////////////////// instances////////////////////////////////////////

// https://iv.ggtyler.dev/
// https://invidious.perennialte.ch/
// invidious.reallyaweso.me
// https://invidious.jing.rocks/
// https://invidious.nerdvpn.de/
// https://inv.nadeko.net/
// https://iv.nboeck.de/
// https://vid.puffyan.us/
// https://invidious.fdn.fr/
// https://invidious.nerdvpn.de/
// https://yt.artemislena.eu/
// https://inv.us.projectsegfau.lt/
// https://invidious.drgns.space/
// https://invidious.einfachzocken.eu/
// https://inv.n8pjl.ca/
// https://vid.priv.au/
// https://iv.melmac.space/
// https://invidious.slipfox.xyz/
// https://invidious.lunar.icu/
// https://inv.in.projectsegfau.lt/
// https://inv.tux.pizza/
// https://inv.zzls.xyz/
// https://iv.datura.network/
// https://yt.drgnz.club/
// https://invidious.protokolla.fi/
// https://invidious.privacydev.net/
// https://invidious.12a.app/
// https://anontube.lvkaszus.pl/
// https://invidious.privacyredirect.com/
// https://yt.cdaut.de/
// https://vid.lilay.dev/
// https://invidious.private.coffee/
// https://invidious.jing.rocks/
// https://inv.oikei.net/
// https://yt.artemislena.eu/
// https://inv.nadeko.net/
// https://invidious.projectsegfau.lt/
// https://invidious.flokinet.to/




