// ==UserScript==
// @name         kingchoice horizontal
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match       https://kingchoice.vn/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379372/kingchoice%20horizontal.user.js
// @updateURL https://update.greasyfork.org/scripts/379372/kingchoice%20horizontal.meta.js
// ==/UserScript==

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
/*
<button type="button" id="btn1">Choice 1</button>
<button type="button" id="btn2">Choice 2</button>
<button type="button" id="btn3">Choice 3</button>
<input type="hidden" id="btnValue" value="" />
*/
var floatDiv1 = '<div class="divbin" id="dflot" style=background-color:#333333;><b><span id="vName" style=color:#fcd111;>&nbsp;</span><span id="vName2" style=color:#ffffff;>&nbsp;&nbsp;</span><span id="vName3" style=color:#ffffff;>&nbsp;</span></b><br><input type="number" id="vid" value="14779">';
//floatDiv1 += '<input type="radio" name="upvote" value="1" id="myRadio1" checked="checked"><b style=color:#0fbd7d;>Vote +</b><input type="radio" name="upvote" value="2" id="myRadio2"><b style=color:#f53387;> Vote - </b>';
floatDiv1 += '<button type="button" id="btnVote" class="buttonKu buttonKu2" onclick="cVote()" >VOTE +</button><input type="hidden" id="btnValue" value="1" />'
floatDiv1 += '<input type="number" id="vtime" value="25">';
floatDiv1 += '<button type="button" id="btnStatus" class="buttonKu buttonKu2" onclick="sStatus()" >START</button><input type="hidden" id="btnStaValue" value="1" />'
//floatDiv1 += '<button id="sFun1" class="buttonKu buttonKu2" type="button" onclick="sFun1()">start</button>';
//floatDiv1 += '<button id="sFun2" class="buttonKu buttonKu3" type="button" onclick="sFun2()" disabled="">stop</button><br>';
floatDiv1 += '<br><b><span id="lab1"><span style=color:#ffffff;>STATUS</span></span></b></div>';

//$('#wrapper > div.content > div.chanel-top').append(floatDiv1);
$('#wrapper').append(floatDiv1);

function sFun1 () {
    //if (checkVote ==1) {
    //    checkVote =2;
        //document.querySelector('#sFun1').disabled = true;
        //document.querySelector('#sFun2').disabled = false;
        myVar = setInterval(myTimer, document.getElementById("vtime").value);
        document.getElementById("lab1").style.color ="#0fbd7d";
        document.getElementById("lab1").innerHTML = " START";
        function myTimer() {
            //vote(14779,1)
            //vote(document.getElementById("vid").value,document.querySelector('input[name="upvote"]:checked').value);
            vote(document.getElementById("vid").value,document.getElementById("btnValue").value);
     //   }
    }
}

function sFun2 () {
    document.getElementById("lab1").style.color ="#f53387";
    document.getElementById("lab1").innerHTML = " STOP";
    clearInterval(myVar);
    //checkVote=1;
  	//document.querySelector('#sFun1').disabled = false;
    //document.querySelector('#sFun2').disabled = true;
}

function copyVid (x,i) {
    document.getElementById("vid").value =x;
    document.getElementById("vName").innerHTML=document.querySelector('#pos_'+i+' > div.info > a >h3').innerHTML;
    //document.getElementById("vName2").innerHTML=" - ";
    document.getElementById("vName3").innerHTML=document.querySelector('#pos_'+i+' > div.info > span').innerHTML;
}

function cVote () {
    if (document.getElementById("btnValue").value ==1) { document.getElementById("btnValue").value =2; document.getElementById("btnVote").innerHTML ="VOTE -"; document.getElementById("btnVote").className = "buttonKu buttonKu3";  }
    else { document.getElementById("btnValue").value =1; document.getElementById("btnVote").innerHTML ="VOTE +"; document.getElementById("btnVote").className = "buttonKu buttonKu2";  }
}

function sStatus () {
    if (document.getElementById("btnStaValue").value ==1) { document.getElementById("btnStaValue").value =2; document.getElementById("btnStatus").innerHTML ="STOP"; document.getElementById("btnStatus").className = "buttonKu buttonKu3"; sFun1 (); }
    else { document.getElementById("btnStaValue").value =1; document.getElementById("btnStatus").innerHTML ="START"; document.getElementById("btnStatus").className = "buttonKu buttonKu2"; sFun2 (); }
}


// Call main() in the page scope
var script1 = document.createElement("script");
script1.textContent = "var myVar;\nvar checkVote =1;\n"+sFun1.toString()+"\n"+sFun2.toString()+"\n"+copyVid.toString()+"\n"+cVote.toString()+"\n"+sStatus.toString();
document.body.appendChild(script1);

var lileg =document.querySelector('#wrapper > div.content > div:nth-child(2) > div > div.col-md-8.col-xs-12 > div > div > ul').getElementsByTagName("li").length;
for(var i = 1;i <= lileg; i++)
{
    if (!(document.querySelector('#pos_'+i+' > div.info > a') === null)) {
        var str = document.querySelector('#pos_'+i+' > div.info > a').href;
        var n = str.lastIndexOf('=');
        var result = str.substring(n + 1,str.length);
        var cId = "<h3 style=color:#f53387;><button onclick=copyVid("+result+","+i+")> ID: "+result+"</button></h3>";
        $('#pos_'+i+' > div.info').prepend(cId);
    }
}