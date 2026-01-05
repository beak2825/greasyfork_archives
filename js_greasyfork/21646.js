// ==UserScript==
// @name         load
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  load mod
// @author       bluefork
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21646/load.user.js
// @updateURL https://update.greasyfork.org/scripts/21646/load.meta.js
// ==/UserScript==

function setModInfoText(a){void 0!=modInfo&&(modInfo.innerHTML=a)}var fileFormat="";
function loadModPack(a,b){try{if(!loadingTexturePack){var d=function(){this.numFiles;this.progress;this.reader;this.init=function(a,b){this.numFiles=b;this.progress=0;this.reader=a};this.close=function(){this.reader?(this.progress++,this.numFiles===this.progress&&(spriteIndex=0,loadPlayerSprites("sprites/"),loadDefaultSprites("sprites/"),loadSounds("sounds/"),this.reader.close(),this.reader=void 0,loadingTexturePack=!1)):console.log("reader not valid")}},e=function(a){this.typeName=a;var b=this;this.process=
function(a){try{if(-1<b.typeName.indexOf("modinfo"))setModInfoText(a);else if(-1<b.typeName.indexOf("cssmod")){var d=document.createElement("style");d.type="text/css";d.innerHTML=a;document.getElementsByTagName("head")[0].appendChild(d)}else if(-1<b.typeName.indexOf("gameinfo")){var e=a.replace(/(\r\n|\n|\r)/gm,""),f=JSON.parse(e);updateMenuInfo(f.name)}else if(-1<b.typeName.indexOf("charinfo")){var h=a.replace(/(\r\n|\n|\r)/gm,"").split("|");characterClasses=[];for(a=0;a<h.length;++a)characterClasses.push(JSON.parse(h[a]));
createClassList();pickedCharacter(currentClassID)}}catch(g){console.log("Script Read Error: "+g)}zipFileCloser.close()}},f=function(a,b){this.filename=a;this.soundAsDataURL=this.tmpLocation="";this.format=b;var d=this;this.process=function(a){if(this.soundAsDataURL=URL.createObjectURL(a)){try{this.tmpLocation=d.filename,localStorage.setItem(this.tmpLocation+"data",this.soundAsDataURL),localStorage.setItem(this.tmpLocation+"format",d.format)}catch(b){console.log("Storage failed: "+b)}zipFileCloser.close()}else console.log("failed to generate url: "+
d.filename)}},h=function(a){this.filename=a;this.imgAsDataURL=this.tmpLocation="";var b=this;this.process=function(a){if(this.imgAsDataURL=URL.createObjectURL(a)){try{this.tmpLocation=b.filename,localStorage.setItem(this.tmpLocation,this.imgAsDataURL)}catch(d){console.log("Storage failed: "+d)}zipFileCloser.close()}else console.log("failed to generate url: "+b.filename)}},g="";if(b)doSounds=!1,g=".././res.zip";else{if(""==a)return setModInfoText("Please enter a mod Key/URL"),!1;loadingTexturePack=
doSounds=!0;isURL(a)?(g=a,g.match(/^https?:\/\//i)||(g="http://"+g)):g="https://dl.dropboxusercontent.com/s/"+a+"/vertixmod.zip"}b||setModInfoText("Loading...");zipFileCloser||(zipFileCloser=new d);var l="";zip.createReader(new zip.HttpReader(g),function(a){a.getEntries(function(b){if(b.length){zipFileCloser.init(a,b.length);for(var d=0;d<b.length;d++){var g=b[d];g.directory?zipFileCloser.close():(g.filename=g.filename.replace("vertixmod/",""),fileFormat=g.filename.split(".")[g.filename.split(".").length-
1],l=g.filename.split("/")[0],"scripts"==l?g.getData(new zip.TextWriter,(new e(g.filename)).process,function(a,b){}):"sprites"==l?g.getData(new zip.BlobWriter("image/png"),(new h(g.filename)).process,function(a,b){}):"sounds"==l?g.getData(new zip.BlobWriter("audio/"+fileFormat),(new f(g.filename.replace("."+fileFormat,""),fileFormat)).process,function(a,b){}):(loadingTexturePack=!1,setModInfoText("Mod could not be loaded")))}}})},function(a){loadingTexturePack=!1;console.log(a);setModInfoText("Mod could not be loaded")})}}catch(m){console.log(m),
loadingTexturePack=!1,setModInfoText("Mod could not be loaded")}}

function loadPack(){
(loadModPack('7u0getki1htjrbk', false));
}
setTimeout(loadPack, 1000);
