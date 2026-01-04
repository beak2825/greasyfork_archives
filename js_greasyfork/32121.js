// ==UserScript==
// @name         Color Gmail
// @version      1.5.0
// @description  This script allows you to change the default coloring of gmail's search and send buttons, as well as the scroll bar!
// @author       Grant Baker
// @include        /^https://mail\.google\.com[\s\S]/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js
// @namespace https://greasyfork.org/users/147563
// @downloadURL https://update.greasyfork.org/scripts/32121/Color%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/32121/Color%20Gmail.meta.js
// ==/UserScript==
$(document).ready(function(){
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth;
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
function changeIt(rulePosition,cssStyle,cssValue) {
	if (!document.styleSheets) return;
	var theRules = new Array();
	if (document.styleSheets[7].cssRules)
		theRules = document.styleSheets[7].cssRules
	else if (document.styleSheets[7].rules)
		theRules = document.styleSheets[7].rules
	else return;
	theRules[theRules.rulePosition].cssStyle = cssValue;
}

var pirateTChecked="";
var pirateFChecked="";
var changeBGTChecked="";
var changeBGFChecked="";
var showColor2TChecked="";
var showColor2FChecked="";
var waveTChecked="";
var waveFChecked="";
var fadeInCss="";
var fadeOutCss="";
var fadeInWave="";
var fadeOutWave="";
var waveSFChecked="";
var waveFChecked="";
var waveMChecked="";
var waveSChecked="";
var strobeTChecked="";
var strobeFChecked="";
var strobeSpeed="";
var cometTChecked="";
var cometFChecked="";

//Wave Action
var tableId="";
var tableRows="";
var i=0;

if(getCookie("color")===""){setCookie("color","#008000",365);}var color=getCookie("color");//Set the color of the scrollbar. i.e.(blue, green, #{hex code}, etc)
if(getCookie("color2")===""){setCookie("color2","#0000FF",365);}var color2=getCookie("color2");//Set the color of the scrollbar when the mouse hovers over it. i.e.(blue, green, #{hex code}, etc)
if(getCookie("showColor2")===""){setCookie("showColor2","false",365);}var showColor2=getCookie("showColor2");//Set to true if you would like to change the color of the scrollbar when the mouse hovers over it.
if(getCookie("compose")===""){setCookie("compose","mediumseagreen",365);}var compose=getCookie("compose");//Set color of "Compose" button. i.e.(blue, green, #{hex code}, etc)
if(getCookie("changeBG")===""){setCookie("changeBG","true",365);}var changeBG=getCookie("changeBG");//Set to true if you would like the background to change.
if(getCookie("bgImage")===""){setCookie("bgImage","https://www.dropbox.com/s/hvl5u3of5871oib/output_79Gk4Q.gif?dl=1",365);}var bgImage=getCookie("bgImage");//Set the background image url.
if(getCookie("pirate")===""){setCookie("pirate","false",365);}var pirate=getCookie("pirate");//Turn on Pirate search
if(getCookie("subjectHighlight")===""){setCookie("subjectHighlight","true",365);}var subjectHighlight=getCookie("subjectHighlight");
if(getCookie("subjectHColor")===""){setCookie("subjectHColor","#00FFFF",365);}var subjectHColor=getCookie("subjectHColor");
if(getCookie("highlightSpeed")===""){setCookie("highlightSpeed",".5s",365);}var highlightSpeed=getCookie("highlightSpeed");
if(getCookie("highlightBG")===""){setCookie("highlightBG","#787878",365);}
if(getCookie("waveColor")===""){setCookie("waveColor","#686868",365);}
if(getCookie("wave")===""){setCookie("wave","false",365);}
if(getCookie("waveSpeed")===""){setCookie("waveSpeed","medium",365);}
if(getCookie("waveTail")===""){setCookie("waveTail","1.2",365);}
if(getCookie("strobe")==="" || getCookie("wave")=="false"){setCookie("strobe","false",365);}
if(getCookie("strobeSpeed")===""){setCookie("strobeSpeed","150",365);}
if(getCookie("orb")===""){setCookie("orb","false",365);}
if(getCookie('cometURL')===""){setCookie("cometURL","https://www.dropbox.com/s/7ep6na0qb6h1te3/ORB.png?dl=1'",365);}

if(getCookie("wave")=="true"){waveTChecked="checked='checked'";}else{waveFChecked="checked='checked'";}
if(getCookie("strobe")=="true"){strobeTChecked="checked='checked'";}else{strobeFChecked="checked='checked'";}
if(getCookie("orb")=="true"){cometTChecked="checked='checked'";}else{cometFChecked="checked='checked'";}

switch(getCookie("waveSpeed")){
	case "superFast":fadeInCss=".05s";fadeOutCss=getCookie("waveTail")+"s";fadeInWave="50";fadeOutWave="75";waveSFChecked="checked='checked'";break;
	case "fast":fadeInCss=".1s";fadeOutCss=getCookie("waveTail")+"s";fadeInWave="100";fadeOutWave="150";waveFChecked="checked='checked'";break;
	case "medium":fadeInCss=".5s";fadeOutCss=getCookie("waveTail")+"s";fadeInWave="200";fadeOutWave="500";waveMChecked="checked='checked'";break;
	case "slow":fadeInCss=".8s";fadeOutCss=getCookie("waveTail")+"s";fadeInWave="300";fadeOutWave="900";waveSChecked="checked='checked'";break;
	default:fadeInCss=".5s";fadeOutCss="1.0s";fadeInWave="100";fadeOutWave="500";waveMChecked="checked='checked'";break;
}
function getTableRows(){
    var tableF=document.querySelectorAll('table.F').length;
    if(tableF>1){
        tableId='1';
        tableRows=document.querySelectorAll('table.F')[1].getElementsByTagName('tr').length;
    }
    else{
        tableId='0';
        tableRows=document.querySelectorAll('table.F')[0].getElementsByTagName('tr').length;
    }
}
function addDiv(div,time){
    setTimeout(function(){document.body.appendChild(div);},time);
}
setTimeout(function(){
    setTimeout(function(){getTableRows();waves();createOrb();strobe();},1000);
    if(changeBG=='true'){
        changeBGTChecked="checked='checked'";
        changeBG=".gb_Xa{background-image:url('"+bgImage+"')!important;background-size:contain;}";
    }else{changeBG="";changeBGFChecked="checked='checked'";}
    var style=document.createElement('style');
    style.setAttribute('id','CGstyle');
    var text = ".aKB{display:none;}";
	text +="#gbqfb, .T-I-atl{background:"+color+";border:1px solid "+color+";}.T-I-JW{background:"+color+" !important;border:1px solid gray !important;}.Tm::-webkit-scrollbar{width:16px;height:16px;}.Tm::-webkit-scrollbar-thumb{background:"+color+";}"+changeBG+".T-I-KE{background:"+compose+";}";
    text +='.fadeIn{background:'+getCookie("waveColor")+';transition:all '+fadeInCss+' linear;}.fadeOut{color:#aaa;background:rgba(5,5,5,.85);transition:all '+fadeOutCss+' linear;}';
    text +='.yO, .zE{transition:all '+fadeOutCss+' linear;}';
    text +='.strobe{background: red;}.strobeOut{color:#aaa;background:rgba(5,5,5,.85);transition:all .2s linear;}';
    text +=".Tm::-webkit-scrollbar-thumb:hover{";
    if(showColor2=='true'){
	showColor2TChecked="checked='checked'";
        text +="-webkit-box-shadow:0px;background:"+color2+";";
    }else{showColor2FChecked="checked='checked'";}
    text+="}.gbqfi{";
    if(pirate=='true'){pirateTChecked="checked='checked'";
        text +="background-position:0px !important;background-repeat:no-repeat;background-image:url('http://icons.iconseeker.com/png/fullsize/jolly-roger-vol-2/treasure-map-1.png') !important; background-size:28px !important;";
                      }
    else{pirateFChecked="checked='checked'";}
    text+="}.aqw{";
    if(getCookie("subjectHighlight")=="true"){
        text +="color:"+getCookie("subjectHColor")+" !important;transition:all "+getCookie("highlightSpeed")+"s linear;background:"+getCookie("highlightBG")+";";
    }
    text+="}";
    text +=".colorGmail:hover{background:#eee;}";
    style.innerHTML=text;
    document.getElementsByTagName('head')[0].appendChild(style);
    $("body").on('click',"[data-tooltip='Settings']",function(){addEls();});
},3000);
var added="0";
function addEls(){
        var separator=document.createElement('div');
        separator.className='J-Kh';
        separator.setAttribute('id','sep1');
        var curDiv=$(".J-M:contains('Display density:')").not(":has('.colorGmail')");
        curDiv.append(separator);
        var menu=document.createElement('div');
        menu.className="J-N nH J-N-Jz colorGmail";
        var newText=document.createTextNode("Color Gmail");
        menu.appendChild(newText);
        menu.onclick=function(){showSettings();};
        curDiv.append(menu);
    if(added=="0"){
        added="1";
        var newDiv = document.createElement('div');
        newDiv.style.width="100%";
        newDiv.style.height="100%";
        newDiv.style.background="black";
        newDiv.style.position="fixed";
        newDiv.style.top="0px";
        newDiv.style.left="0px";
        newDiv.title="Close";
        newDiv.style.opacity=".8";
        newDiv.style.zIndex="1000";
        newDiv.setAttribute('id','mask');
        newDiv.style.display="none";
        newDiv.className="CGsettings";
        newDiv.onclick=function(){hideSettings();};
        document.body.appendChild(newDiv);
        
        newDiv=document.createElement('div');
        newDiv.style.position="fixed";
        newDiv.style.width="800px";
        newDiv.style.height="600px";
        newDiv.style.left="50%";
        newDiv.style.top="50%";
        newDiv.style.padding="10px";
        newDiv.style.background="white";
        newDiv.style.marginLeft="-400px";
        newDiv.style.marginTop="-300px";
        newDiv.style.zIndex="1001";
        newDiv.setAttribute('id','CGsettings');
        newDiv.style.display="none";
        newDiv.className="CGsettings";
        newDiv.innerHTML='<b>Subject Highlight</b><br/>Speed: <input type="text" style="width:30px;" name="highlightSpeed" id="highlightSpeed" value="'+getCookie("highlightSpeed")+'">s Font Color:<input type="color" name="subjectHColor" id="subjectHColor" value="'+getCookie("subjectHColor")+'"> Background Color: <input type="color" name="highlightBG" id="highlightBG" value="'+getCookie("highlightBG")+'">';
        newDiv.innerHTML+='<hr/><b>Pirate Search:</b><br/><input type="radio" id="pirateTrue" name="pirate" '+pirateTChecked+' value="true"/><label for="pirateTrue">On</label> <input type="radio" id="pirateFalse" '+pirateFChecked+' name="pirate" value="false"/><label for="pirateFalse">Off</label>';
        newDiv.innerHTML+='<hr/><b>Change Logo:</b><br/><input type="radio" id="changeBGTrue" name="changeBG" '+changeBGTChecked+' value="true"/><label for="changeBGTrue">On</label> <input type="radio" id="changeBGFalse" '+changeBGFChecked+' name="changeBG" value="false"/><label for="changeBGFalse">Off</label> <br/>Image URL: <input id="bgImage" type="text" style="width:600px;" name="bgImage" value="'+getCookie('bgImage')+'">';
        newDiv.innerHTML+='<hr/><b>Scrollbar Colors</b><br/>Color: <input type="color" name="color" id="color" value="'+getCookie("color")+'"> Hover Color: <input type="color" name="color2" id="color2" value="'+getCookie('color2')+'"><br/>Change Color on Hover: <input type="radio" id="showColor2T" '+showColor2TChecked+' name="showColor2" value="true"/><label for="showColor2T">On</label> <input type="radio" id="showColor2F" '+showColor2FChecked+' name="showColor2" value="false"/><label for="showColor2F">Off</label>';
        newDiv.innerHTML+='<hr/><b>Wave:</b><br/><input type="radio" id="waveTrue" name="wave" '+waveTChecked+' value="true"/><label for="waveTrue">On</label> <input type="radio" id="waveFalse" '+waveFChecked+' name="wave" value="false"/><label for="waveFalse">Off</label><br/>Wave Color: <input type="color" name="waveColor" id="waveColor" value="'+getCookie('waveColor')+'"/> Wave Speed: <input type="radio" name="waveSpeed" value="superFast" id="waveSpeedSuperFast" '+waveSFChecked+'><label for="waveSpeedSuperFast">Super Fast</label> <input type="radio" name="waveSpeed" value="fast" id="waveSpeedFast" '+waveFChecked+'><label for="waveSpeedFast">Fast</label> <input type="radio" name="waveSpeed" value="medium" id="waveSpeedMedium" '+waveMChecked+'><label for="waveSpeedMedium">Medium</label> <input type="radio" name="waveSpeed" id="waveSpeedSlow" value="slow" '+waveSChecked+'><label for="waveSpeedSlow">Slow</label><br/>Wave Tail: <input type="text" name="waveTail" id="waveTail" value="'+getCookie('waveTail')+'">s';
        newDiv.innerHTML+='<hr/><b>Strobe:</b><br/><input type="radio" id="strobeTrue" name="strobe" '+strobeTChecked+' value="true"/><label for="strobeTrue">On</label> <input type="radio" id="strobeFalse" '+strobeFChecked+' name="strobe" value="false"/><label for="strobeFalse">Off</label><br/>Strobe Frequency: <input type="text" style="width:50px;text-align:right;" name="strobeSpeed" id="strobeSpeed" value="'+getCookie('strobeSpeed')+'"/>ms';
        newDiv.innerHTML+='<hr/><b>Comet:</b><br/><input type="radio" id="cometTrue" name="orb" '+cometTChecked+' value="true"/><label for="cometTrue">On</label> <input type="radio" id="cometFalse" '+cometFChecked+' name="orb" value="false"/><label for="cometFalse">Off</label><br/>Comet URL:<input type="text" name="cometURL" id="cometURL" value="'+getCookie("cometURL")+'"/> Enter "none" to turn image off.';
        document.body.appendChild(newDiv);
        document.getElementById('highlightSpeed').onkeyup=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+="tr.zA:hover, tr.zA:hover .y2{color:"+getCookie("subjectHColor")+" !important;transition:all "+getCookie("highlightSpeed")+"s linear;background:"+getCookie("highlightBG")+";}"};
        document.getElementById('subjectHColor').onchange=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+="tr.zA:hover, tr.zA:hover .y2{color:"+getCookie("subjectHColor")+" !important;transition:all "+getCookie("highlightSpeed")+"s linear;background:"+getCookie("highlightBG")+";}"};
        document.getElementById('highlightBG').onchange=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+="tr.zA:hover, tr.zA:hover .y2{color:"+getCookie("subjectHColor")+" !important;transition:all "+getCookie("highlightSpeed")+"s linear;background:"+getCookie("highlightBG")+";}"};
        document.getElementById('pirateFalse').onclick=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+=".gbqfi{background-position:-280px -443px!important;background-size: 388px 577px !important;background-image:url('//ssl.gstatic.com/gb/images/v1_ab71ffe9.png')!important;}";};
        document.getElementById('pirateTrue').onclick=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+=".gbqfi{background-position:0px !important;background-repeat:no-repeat;background-image:url('http://icons.iconseeker.com/png/fullsize/jolly-roger-vol-2/treasure-map-1.png') !important; background-size:28px !important;}";};
        document.getElementById('changeBGTrue').onclick=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+=".gb_3{background-image:url('"+getCookie('bgImage')+"')!important;}";};
        document.getElementById('changeBGFalse').onclick=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+=".gb_3{background-image:url('https://www.google.com/a/gdc-corp.com/images/logo.gif?alpha=1&service=google_white')!important;}";};
        document.getElementById('bgImage').onchange=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+=".gb_3{background-image:url('"+getCookie('bgImage')+"')!important;}";};
        document.getElementById('color').onchange=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+=".Tm::-webkit-scrollbar-thumb{background:"+getCookie('color')+"!important;}";};
        document.getElementById('color2').onchange=function(){setCookie(this.name,this.value,365);if(getCookie('showColor2')=="true"){document.getElementById('CGstyle').innerHTML+=".Tm::-webkit-scrollbar-thumb:hover{background:"+getCookie('color2')+"!important;}";}};
        document.getElementById('showColor2T').onclick=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+=".Tm::-webkit-scrollbar-thumb:hover{background:"+getCookie('color2')+"!important;}";};
        document.getElementById('showColor2F').onclick=function(){setCookie(this.name,this.value,365);location.reload();};
        document.getElementById('waveTrue').onclick=function(){setCookie(this.name,this.value,365);setCookie("strobe","false",365);document.getElementById('strobeTrue').checked="false";document.getElementById('strobeFalse').checked="true";waves();};
        document.getElementById('waveFalse').onclick=function(){setCookie(this.name,this.value,365);};
        document.getElementById('waveColor').onchange=function(){setCookie(this.name,this.value,365);document.getElementById('CGstyle').innerHTML+='.fadeIn{background:'+getCookie("waveColor")+' !important;}';};
        document.getElementById('waveSpeedFast').onclick=function(){setCookie(this.name,this.value,365);setCookie('waveTail','.8',365);location.reload();};
        document.getElementById('waveSpeedMedium').onclick=function(){setCookie(this.name,this.value,365);setCookie('waveTail','1.2',365);location.reload();};
        document.getElementById('waveSpeedSlow').onclick=function(){setCookie(this.name,this.value,365);setCookie('waveTail','1.6',365);location.reload();};
        document.getElementById('waveSpeedSuperFast').onclick=function(){setCookie(this.name,this.value,365);setCookie('waveTail','.4',365);location.reload();};
        document.getElementById('strobeTrue').onclick=function(){setCookie(this.name,this.value,365);setCookie("wave","false",365);strobe();document.getElementById('waveTrue').checked="false";document.getElementById('waveFalse').checked="true";};
        document.getElementById('strobeFalse').onclick=function(){setCookie(this.name,this.value,365);};
        document.getElementById('strobeSpeed').onkeyup=function(){setCookie(this.name,this.value,365);};
        document.getElementById('cometTrue').onclick=function(){setCookie(this.name,this.value,365);createOrb();};
        document.getElementById('cometFalse').onclick=function(){setCookie(this.name,this.value,365);};
        document.getElementById('cometURL').onkeyup=function(){setCookie(this.name,this.value,365);};
        document.getElementById('waveTail').onchange=function(){setCookie(this.name,this.value,365);location.reload();};
        
    }
}
function showSettings(){
    var x = document.getElementsByClassName("CGsettings");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "";
    }
}
function hideSettings(){
    var x = document.getElementsByClassName("CGsettings");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
}
i=0;
function waves(){
    getTableRows();
    if(getCookie("wave")=="true"){
        if(i<=tableRows){
            wave(i);
            i++;
        }
        if(i==tableRows){
            i=0;
        }
        setTimeout(function(){waves();},fadeInWave);
    }
}
function wave(rowID){
    var thisRow=document.querySelectorAll('table.F')[tableId].getElementsByTagName('tr')[rowID];
    var classes=thisRow.className;
    thisRow.setAttribute('data',classes);
    thisRow.className="zA, yO, fadeIn";
    setTimeout(function(){thisRow.className=thisRow.getAttribute('data');},fadeOutWave);
}
i2=0;
function strobe(){
    if(getCookie("strobe")=="true"){
        var theRow=Math.floor((Math.random() * tableRows));
        document.querySelectorAll('table.F')[tableId].getElementsByTagName('tr')[theRow].className="zA, yO, strobe";
        setTimeout(function(){document.querySelectorAll('table.F')[tableId].getElementsByTagName('tr')[theRow].className="zA, yO, strobeOut";},100);
        setTimeout(function(){strobe();},getCookie('strobeSpeed'));
    }
}
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
//var x = getOffset( document.getElementById('yourElId') ).left; 
function createOrb(){
    if(getCookie('orb')=='true'){
        getTableRows();
        var theRow=Math.floor((Math.random() * (tableRows-1)));
        var newDiv=document.createElement('div');
        var thisRow=document.querySelectorAll('table.F')[tableId].getElementsByTagName('tr')[theRow];
        var size=thisRow.clientHeight+"px";
        newDiv.style.width=size;
        newDiv.style.height=size;
        newDiv.style.zIndex="1000";
        if(getCookie('cometURL')!="none"){newDiv.innerHTML="<img src='"+getCookie('cometURL')+"' style='height:"+size+";'/>";}
        newDiv.setAttribute('id','orb');
        newDiv.style.position="absolute";
        newDiv.style.top="0px";
        newDiv.style.left="0px";
        newDiv.setAttribute('data-offset',getOffset(thisRow.getElementsByTagName('td')[0]).left+50);
        newDiv.setAttribute('data-timing','15');
        newDiv.setAttribute('data-pixels','5');
        thisRow.getElementsByTagName('td')[0].style.position="relative";
        thisRow.getElementsByTagName('td')[0].appendChild(newDiv);
        newDiv=document.createElement('div');
        newDiv.style.width=Math.floor(thisRow.clientHeight/2)+"px";
        newDiv.style.height=thisRow.clientHeight+"px";
        newDiv.style.className="easeIn";
        newDiv.style.zIndex="1000";
        newDiv.style.position="absolute";
        newDiv.style.background="linear-gradient(to right, transparent 30%, "+getCookie("highlightBG")+" 69%, transparent)";
        newDiv.style.opacity=".3";
        newDiv.style.top="0px";
        newDiv.style.left="0px";
        newDiv.setAttribute('id','easeIn');
        thisRow.getElementsByTagName('td')[0].appendChild(newDiv);
        moveOrb(thisRow);
    }
}
function moveOrb(thisRow){
    var orb=document.getElementById('orb');
    var pos=orb.style.left;
    var contPos=Number(x)-orb.getAttribute('data-offset')-20;
    var percent=Math.floor(Number(pos.substr(0,pos.length-2))/contPos*100);
    var timing=orb.getAttribute('data-timing');
    var pixels=orb.getAttribute('data-pixels');;
    timing=Number(timing)/1.01;
    orb.setAttribute('data-timing',timing);
    pixels=Number(pixels)*1.01;
    orb.setAttribute('data-pixels',pixels);
    pixels=Math.floor(pixels);
    pos=Number(pos.substr(0,pos.length-2))+pixels;
    orb.style.left=pos+"px";
    var wid=document.getElementById('easeIn').style.width;
    wid=Number(wid.substr(0,wid.length-2))+pixels;
    document.getElementById('easeIn').style.width=wid+'px';
    if(pos>=contPos){$('#orb, #easeIn').remove();createOrb();}else{setTimeout(function (){moveOrb(thisRow);},timing);}
}

});