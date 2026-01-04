// ==UserScript==
// @name         Zero-pattern
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://deep.zerosic.com/ZeroHOF/index.php?char=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35350/Zero-pattern.user.js
// @updateURL https://update.greasyfork.org/scripts/35350/Zero-pattern.meta.js
// ==/UserScript==
var settings = {
    xPosition : 3,
    yPosition : 300,
    width : 75,
    height : 300
};
function $element(t,p,a,f){var e;if(!t){if(arguments.length>1){e=document.createTextNode(a);a=null;}else{return document.createDocumentFragment();}}else{e=document.createElement(t);}if(a!==null&&a!==undefined){switch(a.constructor){case Number:e.textContent=a;break;case String:e.textContent=a;break;case Array:var a1;a.forEach(function(a0){a1=a0.substr(1);switch(a0[0]){case "#":e.id=a1;break;case ".":e.className=a1;break;case "/":e.innerHTML=a1;break;case " ":e.textContent=a1;break;}});break;case Object:var ai,av,es,esi;for(ai in a){av=a[ai];if(av&&av.constructor===Object){if(ai in e){es=e[ai];}else{es=e[ai]={};}for(esi in av){es[esi]=av[esi];}}else{if(ai==="style"){e.style.cssText=av;}else if(ai in e){e[ai]=av;}else{e.setAttribute(ai,av);}}}break;}}if(f){if(f.constructor===Function){e.addEventListener("click",f,false);}else if(f.constructor===Object){var fi;for(fi in f){e.addEventListener(fi,f[fi],false);}}}if(p){var p0,p1;if(p.nodeType===1||p.nodeType===11){p0=p;p1=null;}else if(p.constructor===Array){p0=p[0];p1=p[1];if(!isNaN(p1)){p1=p0.childNodes[parseInt(p1,10)];}}p0.insertBefore(e,p1);}return e;}

var div = $element("div",document.body,{style:"position:fixed; top:"+settings.yPosition+"px; left:"+settings.xPosition+"px; box-sizing:border-box; width:"+settings.width+"px; height:"+settings.height+"px; font-size:10pt; color:#91A2BB; background-color:#10151B; line-height:1.6; padding-top:20px"});
$element("",div,"패턴슬롯");
$element("br",div);
span = $element("span",div,{title:"세이브",style:"font-size:12pt; cursor:pointer"},function(){save();});
span.textContent = "세이브";
$element("br",div);
span0 = $element("span",div,{title:"로드",style:"font-size:12pt; cursor:pointer"},function(){load();});
span0.textContent = "로드";
text0 = $element("textarea",div,{id:"ptext",style:"width:70px; height:200px;"});
//<input type="text" name="quantity0" maxlength="6" value="1" style="width:56px" class="text">
function save(){
    text0.value="";
    var lsearch = document.getElementsByName("judge0");
    var plist = lsearch[0].parentNode.parentNode.parentNode.childNodes;
    var pnum = (plist.length-1)/2;
    var data = new Array(pnum*3+1);
    data[0]=pnum;
    text0.value+=pnum;
    for(var i=0; i<pnum*3; i+=3){
        data[i+1]=document.getElementsByName("judge"+i/3)[0].value;
        data[i+2]=document.getElementsByName("quantity"+i/3)[0].value;
        data[i+3]=document.getElementsByName("skill"+i/3)[0].value;
        text0.value+=", "+data[i+1]+", "+data[i+2]+", "+data[i+3];
    }
    localStorage.setItem("data", JSON.stringify(data));
}
function load(){
    var lsearch = document.getElementsByName("judge0");
    var plist = lsearch[0].parentNode.parentNode.parentNode.childNodes;
    var pnum = (plist.length-1)/2;
    var data = new Array(pnum*3+1);
    data = text0.value.split(', ');
    if(data[0]>pnum){alert("현재패턴수 "+pnum+"은 저장된 패턴수 "+data[0]+"보다 적습니다!");}
    for(var i=0; i<data[0]*3; i+=3){
        document.getElementsByName("judge"+i/3)[0].value=data[i+1];
        document.getElementsByName("quantity"+i/3)[0].value=data[i+2];
        document.getElementsByName("skill"+i/3)[0].value=data[i+3];
    }
}
