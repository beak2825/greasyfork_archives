// ==UserScript==
// @name         kingchoice horizontal animation
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @description  try to take over the world!
// @author       You
// @exclude     https://kingchoice.vn/
// @include      https://kingchoice.vn/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379381/kingchoice%20horizontal%20animation.user.js
// @updateURL https://update.greasyfork.org/scripts/379381/kingchoice%20horizontal%20animation.meta.js
// ==/UserScript==
//@include @match
document.cookie="PHPSESSID=;expires=Wed; 01 Jan 1970";

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.buttonKu {border: none;color: white;padding: 3px 21px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;width: 100px;}');
addGlobalStyle('.buttonKu2 {background-color: #0fbd7d;}');
addGlobalStyle('.buttonKu3 {background-color: #f53387;}');
addGlobalStyle('button[disabled] { background: #cccccc !important; }');
addGlobalStyle('.divbin {position: fixed;top: 0!important;width: 100%;z-index: 5000!important;margin-top: 0em;text-align: center;}');
addGlobalStyle('.content {margin-top: 7em;}');
addGlobalStyle('.vote-bor {height: 15em;}');
addGlobalStyle('.active2 {background-color: #fffaba !important;}');
addGlobalStyle('.divMenu {color:#ffffff;cursor: default;}');
addGlobalStyle('.m2 {color: #ffffff !important;cursor: pointer;}');
addGlobalStyle('.m2:hover {color: #f4b642 !important;cursor: pointer;}');
addGlobalStyle('.m2:active {color: #f4b642 !important;cursor: pointer;}');

$('#wrapper > div.content > div.chanel-top > div > div > div > div.vote > div.sosialshare').hide();
$('#wrapper > div.content > div.chanel-top > div > div > div > img').hide();
$('#chanel-slide').hide();
$('#wrapper > footer').hide();
//addGlobalStyle('.spinner1 {  box-sizing: border-box;  height: 60px;  width: 60px;  margin: 3px;  border: 0px solid #0fbd7d;  border-radius: 50%;  box-shadow: 0 -20px 0 24px #0fbd7d inset;  animation: rotate 1s infinite linear;}');
/*addGlobalStyle('.spinner1 {  background: #ffffff !important;box-sizing: border-box;  height: 30px;  width: 30px;  margin: 3px;  border: 0px solid #0fbd7d;  border-radius: 50%;  box-shadow: 0 -8px 0 10px #0fbd7d inset;  animation: rotate 1s infinite linear;}');
addGlobalStyle('.spinner2 {  background: #ffffff !important;box-sizing: border-box;  height: 30px;  width: 30px;  margin: 3px;  border: 0px solid #f53387;  border-radius: 50%;  box-shadow: 0 -8px 0 10px #f53387 inset;  animation: rotate 1s infinite linear;}');
addGlobalStyle('.spinner3 {  display: table; margin: 0 auto; background: #ffffff !important; box-sizing: border-box;  height: 30px;  width: 30px;  margin: 3px;  border: 0px solid #999999;  border-radius: 50%;  box-shadow: 0 -8px 0 10px #999999 inset;  }');
addGlobalStyle('@keyframes rotate {  0% {    transform: rotate(0deg);  }  100% {    transform: rotate(360deg);  }}');
*/
//addGlobalStyle('.spinner3 {width: 100%;  height: 20px;  border: 1px solid #2980b9;  border-radius: 3px;  background-image:     repeating-linear-gradient(      -45deg,      #2980b9,      #2980b9 11px,      #eee 10px,      #eee 20px /* determines size */    );  background-size: 28px 28px;  animation: move .5s linear infinite;}');
addGlobalStyle('.spinner1 {width: 100%;  height: 20px;  border: 1px solid #0fbd7d;  border-radius: 3px;  background-image:     repeating-linear-gradient(      -45deg,      #0fbd7d,      #0fbd7d 11px,      #eee 10px,      #eee 20px /* determines size */    );  background-size: 28px 28px;  animation: moveR .5s linear infinite;}');
addGlobalStyle('.spinner2 {width: 100%;  height: 20px;  border: 1px solid #f53387;  border-radius: 3px;  background-image:     repeating-linear-gradient(      -45deg,      #f53387,      #f53387 11px,      #eee 10px,      #eee 20px /* determines size */    );  background-size: 28px 28px;  animation: moveR .5s linear infinite;}');
addGlobalStyle('.spinner3 {width: 100%;  height: 20px;  border: 1px solid #999999;  border-radius: 3px;  background-image:     repeating-linear-gradient(      -45deg,      #999999,      #999999 11px,      #eee 10px,      #eee 20px /* determines size */    );  background-size: 28px 28px;  }');

addGlobalStyle('@keyframes moveR {  0% {    background-position: 0 0;  }  100% {    background-position: 28px 0;  }}');
addGlobalStyle('@keyframes moveL {  0% {    background-position: 0 0;  }  100% {    background-position: -28px 0;  }}');

var floatDiv1 = '<div class="divbin" id="dflot" style=background-color:#333333;><b><span id="vName" style=color:#fcd111;>&nbsp;</span><span id="vName2" style=color:#ffffff;>&nbsp;&nbsp;</span><span id="vName3" style=color:#ffffff;>&nbsp;</span></b><br><input type="number" id="vid" value="14779">';
floatDiv1 += '<button type="button" id="btnVote" class="buttonKu buttonKu2" onclick="cVote()" >VOTE +</button><input type="hidden" id="btnValue" value="1" />'
floatDiv1 += '<input type="number" id="vtime" value="25">';
floatDiv1 += '<button type="button" id="btnStatus" class="buttonKu buttonKu2" onclick="sStatus()" >START</button><input type="hidden" id="btnStaValue" value="1" />'
floatDiv1 += '<br><div id="menuKu" class="divMenu"><b><a class="m2" onclick=mLink("1")>Home</a> / <a class="m2" onclick=mLink(2)>Month</a> / <a class="m2" onclick=mLink(3)>Kpop</a> / <a class="m2" onclick=mLink(4)>Vpop</a> / <a class="m2" onclick=mLink(5)>Idol</a> / <a class="m2" onclick=mLink(6)>Music</a> / <a class="m2" onclick=mLink(7)>Movie</a> / <a class="m2" onclick=mLink(8)>Celeb</a> / <a class="m2" onclick=mLink(9)>Food</a> / <a class="m2" onclick=mLink(10)>Sport</a></b></div>';
floatDiv1 += '<div id="loadstatus" class="spinner3"></div><input type="hidden" id="vValue" value="1" />';

document.querySelector('#page-content-wrapper > header > div > div > div.hidden-sm.hidden-xs > div > div > div.col-md-12.menu-top > div > ul.col-md-10 > li:nth-child(1) > a')
document.querySelector('#page-content-wrapper > header > div > div > div.hidden-sm.hidden-xs > div > div > div.col-md-12.menu-top > div > ul.col-md-10 > li:nth-child(2) > a')
document.querySelector('#page-content-wrapper > header > div > div > div.hidden-sm.hidden-xs > div > div > div.col-md-12.menu-top > div > ul.col-md-10 > li:nth-child(3) > a')
document.querySelector('#page-content-wrapper > header > div > div > div.hidden-sm.hidden-xs > div > div > div.col-md-12.menu-top > div > ul.col-md-10 > li:nth-child(4) > a')

//$('#wrapper > div.content > div.chanel-top').append(floatDiv1);
$('#wrapper').append(floatDiv1);

function sFun1 () {
        myVar = setInterval(myTimer, document.getElementById("vtime").value);
        function myTimer() {
            vote(document.getElementById("vid").value,document.getElementById("btnValue").value);
            var xDif=document.querySelector('#pos_'+document.getElementById("vValue").value+' > div.des > div.des-top > ul > li.des-top-up > span').innerHTML-document.querySelector('#pos_'+document.getElementById("vValue").value+' > div.des > div.des-top > ul > li.des-top-down > span').innerHTML;
            if (xDif>=0) { document.querySelector('#pos_'+document.getElementById("vValue").value+' > div.des > div.des-bot').style.color = "#0fbd7d";}
            else { document.querySelector('#pos_'+document.getElementById("vValue").value+' > div.des > div.des-bot').style.color = "#f53387";}
            document.querySelector('#pos_'+document.getElementById("vValue").value+' > div.des > div.des-bot').innerHTML=xDif;
            for (var y=1;y<=lileg;y++){
                document.querySelector('#pos_'+y).className ="";
                if (y==document.getElementById("vValue").value) {  document.querySelector('#pos_'+y).className ="active2";}
            }
    }
}

function sFun2 () {
    clearInterval(myVar);
}

function copyVid (x,i) {
    document.getElementById("vid").value =x;
    document.getElementById("vName").innerHTML=document.querySelector('#pos_'+i+' > div.info > a >h3').innerHTML;
    document.getElementById("vName3").innerHTML=document.querySelector('#pos_'+i+' > div.info > span').innerHTML;
    document.getElementById("vValue").value=i;
}

function cVote () {
    if (document.getElementById("btnValue").value ==1) { document.getElementById("btnValue").value =2; document.getElementById("btnVote").innerHTML ="VOTE -"; document.getElementById("btnVote").className = "buttonKu buttonKu3"; if (document.getElementById("btnStaValue").value ==2) {document.getElementById("loadstatus").className = "spinner2";}  }
    else { document.getElementById("btnValue").value =1; document.getElementById("btnVote").innerHTML ="VOTE +"; document.getElementById("btnVote").className = "buttonKu buttonKu2"; if (document.getElementById("btnStaValue").value ==2) {document.getElementById("loadstatus").className = "spinner1";}  }
}

function sStatus () {
    if (document.getElementById("btnStaValue").value ==1) { document.getElementById("btnStaValue").value =2; document.getElementById("btnStatus").innerHTML ="STOP"; document.getElementById("btnStatus").className = "buttonKu buttonKu3"; sFun1 ();if (document.getElementById("btnValue").value ==1) {document.getElementById("loadstatus").className = "spinner1";} else {document.getElementById("loadstatus").className = "spinner2";} }
    else { document.getElementById("btnStaValue").value =1; document.getElementById("btnStatus").innerHTML ="START"; document.getElementById("btnStatus").className = "buttonKu buttonKu2"; sFun2 (); document.getElementById("loadstatus").className = "spinner3"; }
}

function mLink (x) {
    //alert(document.querySelector('#page-content-wrapper > header > div > div > div.hidden-sm.hidden-xs > div > div > div.col-md-12.menu-top > div > ul.col-md-10 > li:nth-child('+x+') > a').href);
    if (x<=7) { location.href = document.querySelector('#page-content-wrapper > header > div > div > div.hidden-sm.hidden-xs > div > div > div.col-md-12.menu-top > div > ul.col-md-10 > li:nth-child('+x+') > a').href;}
    else { location.href = document.querySelector('#page-content-wrapper > header > div > div > div.hidden-sm.hidden-xs > div > div > div.col-md-12.menu-top > div > ul.col-md-10 > li:nth-child(8) > div > ul > li:nth-child('+(x-7)+') > a').href;}
}

function clickAnchorTag(x) {
    var event = document.createEvent('MouseEvent');
    event = new CustomEvent('click');
    var a = document.querySelector('#pos_'+x);
    //alert(document.querySelector('#pos_'+x).innerHTML);
    a.dispatchEvent(event);
}

// Call main() in the page scope
var script1 = document.createElement("script");
script1.textContent = "var lileg =0;\nvar myVar;\nvar checkVote =1;\n"+sFun1.toString()+"\n"+sFun2.toString()+"\n"+copyVid.toString()+"\n"+cVote.toString()+"\n"+sStatus.toString()+"\n"+clickAnchorTag.toString()+"\n"+mLink.toString();
document.body.appendChild(script1);

//var lileg =0;
var lileg2 =document.querySelector('#wrapper > div.content > div:nth-child(2) > div > div.col-md-8.col-xs-12 > div > div > ul').childNodes.length;
for (var z = 0; z < lileg2; z++) {
	if (document.querySelector('#wrapper > div.content > div:nth-child(2) > div > div.col-md-8.col-xs-12 > div > div > ul').childNodes[z].nodeName == "LI") {
		lileg+=1;
	}
}
for(var i = 1;i <= lileg; i++)
{
    if (!(document.querySelector('#pos_'+i+' > div.info > a') === null)) {
        var str = document.querySelector('#pos_'+i+' > div.info > a').href;
        var n = str.lastIndexOf('=');
        var result = str.substring(n + 1,str.length);
        var cId = "<h3 style=color:#f53387;><button onclick=copyVid("+result+","+i+")> ID: "+result+"</button></h3>";
        //document.querySelector('#pos_'+i+' > div.avatar').onclick= function () { copyVid(result,i); };
        document.querySelector('#pos_'+i+' > div.avatar').setAttribute( "onClick", "copyVid("+result+","+i+");" );
        $('#pos_'+i+' > div.info').prepend(cId);
        //$('#pos_'+i+' > div.des > div.des-bot').hide();
        var xDif=document.querySelector('#pos_'+i+' > div.des > div.des-top > ul > li.des-top-up > span').innerHTML-document.querySelector('#pos_'+i+' > div.des > div.des-top > ul > li.des-top-down > span').innerHTML;
        if (xDif>=0) { document.querySelector('#pos_'+i+' > div.des > div.des-bot').style.color = "#0fbd7d";}
        else { document.querySelector('#pos_'+i+' > div.des > div.des-bot').style.color = "#f53387";}
        document.querySelector('#pos_'+i+' > div.des > div.des-bot').style.textAlign = "center";
        document.querySelector('#pos_'+i+' > div.des > div.des-bot').style.fontWeight = "bold";
        document.querySelector('#pos_'+i+' > div.des > div.des-bot').innerHTML=xDif;
        if (i==1){ copyVid(result,i); }
   }
}