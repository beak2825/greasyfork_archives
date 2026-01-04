// ==UserScript==
// @name        PlatinSport direct AceStream links
// @description Obtain direct, clickable AceStream links on PlatinSport, bypassing url shorteners.
// @namespace   StephenP
// @author   StephenP
// @grant     GM.registerMenuCommand
// @grant     GM.setValue
// @grant     GM.getValue
// @grant     GM.unsafeWindow
// @version     1.7.3
// @match https://www.platinsport.com/*
// @contributionURL https://nowpayments.io/donation/stephenpgreasyfork
// @license AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/449126/PlatinSport%20direct%20AceStream%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/449126/PlatinSport%20direct%20AceStream%20links.meta.js
// ==/UserScript==
getAdultContentVisible();
getRidOfBCVC();
customCSS();
var m3u8="#EXTM3U";
unsafeWindow.EnableRightClick=1;
function customCSS(){
  let s=document.createElement("STYLE");
  s.innerText="h5>a:link{ background-color: black;} .myDiv1>a{width: 100% !important; padding: 5px 0px 5px 0px !important;} .separator{height: 10px}";
  document.body.appendChild(s);
}
async function getAdultContentVisible(){
  var x=await GM.getValue("adultContentEnabled");
  if(x=="yes"){
    GM.registerMenuCommand("Hide the lists of adult contents on Platinsport", hideAdultContent, "H");
  }
  else{
    GM.registerMenuCommand("Show the lists of adult contents on Platinsport", showAdultContent, "S");
    removeAdultLinks();
  }
  createLinks();
  unsafeWindow.EnableRightClick=1;
  //absoluteMode();
  replaceSVSlinks();
}
function hideAdultContent(){
  GM.setValue("adultContentEnabled","no");
	location.reload();
}
function showAdultContent(){
  GM.setValue("adultContentEnabled","yes");
  location.reload();
}
function removeAdultLinks(){
  var b=document.querySelector("[href='https://www.platinsport.com/18-adult/']");
  if(b){
    b.parentNode.remove();
  }
}
function createLinks(){
  if(!document.location.href.includes("/link/")){
    var links=document.getElementsByTagName("A");
    var bcvclinks=0;
    for(let link of links){
      if(link.href.includes("bc.vc")){
        bcvclinks++;
        let pos=link.href.indexOf("https://www.p");
        link.href=link.href.slice(pos);
        try{
          link.href=link.href+"#"+encodeURI(link.parentNode.previousElementSibling.innerText);
        }
        catch(e){console.log(e)}
      }
    }
    if(bcvclinks==0){
      links=document.getElementsByClassName("entry")[0].getElementsByTagName("a");
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.platinsport.com/link/'+(links.length-1).toString()+'.php', true);
      try {
        xhr.send();
        xhr.onload = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              for(var i=1;i<=links.length;i++){
                if(i<10){
                  links[i-1].href="https://www.platinsport.com/link/0"+i+".php";
                }
                else{
                  links[i-1].href="https://www.platinsport.com/link/"+i+".php";
                }
              }
            } else {
              bewareTheShortener();
              console.log(xhr.status+xhr.statusText);
            }
          }
        };
        xhr.onerror = () => {
          bewareTheShortener();
          console.log(xhr.status+xhr.statusText);
        };
      } catch(err) {
        bewareTheShortener();
        console.log("Request failed");
      }
    }
  }
  else{
    if(document.getElementsByClassName("myDiv1")){
      try{
        let lns=document.getElementsByClassName("myDiv1")[0].childNodes;
        let skipone=0;
        for(let ln of lns){
          if(skipone==0){
            if((ln.nodeName==="#text")&&(ln.textContent.replaceAll("\n","").length>1)){
              let sep=document.createElement("div");
              sep.className="separator";
              ln.before(sep);
              skipone=1
            }
          }
          else{
            skipone=0;
            continue
          }
        }
        try{//make the m3u8 playlist
          let matchTitle;
          for(let ln of lns){
            if((ln.nodeName==="#text")&&(ln.textContent.replaceAll("\n","").length>1)){
              matchTitle=ln.textContent.replaceAll("\n","");
            }
            else if((ln.nodeName==="A")&&(ln.href.includes("acestream://"))){
              m3u8+="\n"+"#EXTINF:-1,"+matchTitle+" | "+ln.textContent+"\n"+ln.href;
            }
          }
          let myDiv2=document.getElementsByClassName("myDiv2")[0];
          let m3u8DownloadButton=myDiv2.cloneNode(false);
          m3u8DownloadButton.innerText="DOWNLOAD ALL THE LINKS AS A M3U8 PLAYLIST";
          m3u8DownloadButton.style.cursor="pointer";
          myDiv2.parentNode.insertBefore(m3u8DownloadButton,myDiv2);
          m3u8DownloadButton.addEventListener("click",downloadM3U8);

          GM.registerMenuCommand("Download as an M3U8 playlist", downloadM3U8, "D");
        }
        catch(e){console.log("Can't make the M3U8 playlist: "+e)}
      }
      catch(e){console.log(e)};
      //linksDiv.innerHTML=linksDiv.innerHTML.replaceAll(/<\/a>\n\n/g,"<\/a><br><div class=\"separator\"></div>");
      if(window.location.hash.length>0){
        try{ //should focus on the selected match
          let lines=document.getElementsByClassName("myDiv1")[0].childNodes
         for (let l of lines){
            if(l.textContent.toLowerCase().includes(decodeURI(window.location.hash.slice(1)).toLowerCase())){
              l.previousElementSibling.scrollIntoView(true);
              l.previousElementSibling.style.backgroundColor="#00FF00";
              l.previousElementSibling.style.height="20px";
            }
          }
        }
        catch(e){console.log(e)}
      }

    }
    var texts=document.getElementsByTagName("STRONG");
    var regexpLangs=/[\[]([A-Z]+)[\]]/g
    var regexpLinks=/acestream:\/\/[a-f0-9]{40}/g
    let directLinks=document.body.querySelectorAll("a[href^='acestream:']");
    let allLinks=document.body.querySelectorAll(".myDiv1>a");
    for(let l of allLinks){
      l.innerText=l.innerText.replace(regexpLangs,replacerLangs);
    }
    if(!directLinks){
      for(let t of texts){
        var link=null;
        t.innerHTML=t.innerHTML.replace(regexpLinks,replacerLinks);
        if(location.href.includes("/link")){
          t.innerHTML=t.innerHTML.replace(regexpLangs,replacerLangs);
        }
      }
    }
  }
}
function replacerLinks(match, offset, string) {
  return "<a style=\"color: yellow; line-height: normal\" href=\""+match+"\">"+match.replace("acestream://","")+"</a>";
}

function replacerLangs(match, p1, offset, string) {
  return getFlagEmoji(p1);
}
//Following function taken mostly from https://dev.to/jorik/country-code-to-flag-emoji-a21
function getFlagEmoji(countryCode) {
  if(countryCode==="UK"){
    countryCode="GB"
  }
  if(countryCode==="UKR"){
    countryCode="UA"
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
async function bewareTheShortener(){
  let lastDate = await GM.getValue("lastDate","01-01-1970");
  const date = new Date();
  let currentDate = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
  if(currentDate!=lastDate){
    if(confirm("PLATINSPORT DIRECT ACESTREAM LINKS SCRIPT:\n\nDirect AceStream links are not available today: if you click on the links, you will be redirected through a link shortener that MAY contain viruses. Please, be sure to have an ad blocker installed and reject any popup asking to accept notifications.\n\nClick OK to dismiss this note for today.\nClick Cancel to display this note again today.")==true){
      GM.setValue("lastDate",currentDate);
    }
  }
}
function absoluteMode() {//taken from https://greasyfork.org/it/scripts/23772-absolute-enable-right-click-copy/ (BSD Licence)
  [].forEach.call(
      ['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'],
      function(event) {
          document.addEventListener(event, function(e) { e.stopPropagation(); }, true);
      }
  );
}
function replaceSVSlinks(){
  let links=document.body.getElementsByTagName("A");
  for(let link of links){
    link.href=link.href.toLowerCase().replace(".svs/",".sx/");
  }
}
function getRidOfBCVC(){//1y without BCVC appearing out of nowhere when loading Platinsport
  let expire = new Date();
   expire.setTime(expire.getTime() + (365 *24 * 60 * 60 * 1000));
   try{
     document.cookie=document.cookie+"bcvc_finish=ok; expires="+expire+"; path=/";
   }
   catch(e){
     console.log(e);
   }
}
function downloadM3U8(){
  const encoder = new TextEncoder();
  const m3u8encoded = encoder.encode(m3u8);
  const file = new File([m3u8encoded], "Today's matches on Platinsport.m3u8");
  console.log(file);
  const fileUrl=URL.createObjectURL(file);
  window.open(fileUrl);
}