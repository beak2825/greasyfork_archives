// ==UserScript==
// @name         Better Alis [Havis Working]
// @description  Better alis extension working with Havis
// @namespace    http://tampermonkey.net/
// @version      9.9.2
// @author       Zimek
// @match        *://*.alis.io/*
// @icon         https://zimek-lmao.github.io/better-alis/resources/logo.png
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375674/Better%20Alis%20%5BHavis%20Working%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/375674/Better%20Alis%20%5BHavis%20Working%5D.meta.js
// ==/UserScript==

console.log("%cBetter Alis", "background: #222; color: #fff; padding-bottom: 20px;padding-top: 20px;padding-left: 60px;padding-right: 60px;font-size: 50px;border-radius: 100px;");
console.log("Better Alis [Havis Working] by Zimek");

//==//CSS Things//==//
$("#nick").css("border-radius", "15px");
$("#team_name").css("border-radius", "15px");
$("head").append('<style type="text/css"></style>');
$("#nick").addClass("inputzimek");
$("#team_name").addClass("inputzimek");
var newStyleElement = $("head").children(':last');
newStyleElement.html(".msg { color:#FFF; }");

$("div#ad_main").remove(); //Adblock
//==////==//


//==//chat features//==//
$("#input_box2").on("keyup", function() {
  var detected = $("#input_box2").val();
  for(var found in replacement){
    if(replacement.hasOwnProperty(found)){
      detected = detected.replace(found,replacement[found]);
    }
  }
  $(this).val(detected);
});


//More CSS stuff
$(`<script src="https://apis.google.com/js/platform.js"></script>
<style>
.openpanel:hover{background-color: #141414;border: 0px solid #161616;}
.openpanel{background-color: #212121;border: 0px solid #161616;}
.zimekremovebtn{background-color: #cc2222;border: 2px solid #ff3f3f;}
.zimekremovebtn:hover{background-color: #ff3f3f;border: 2px solid #ff3f3f;transition-duration: 0.17s;}
.overALL{background:#212121;border-radius:2px;display:none;height:555px;margin-left:15px;margin-right:-30px;padding:0;position:absolute;width:938px;z-index:300}
.mark{float: left;margin-top: 5px;padding-top: 10px;border-radius: 100px;border: 3px solid #ffa3e3;padding: 10px;font-family: 'Pattaya', sans-serif;color: #ffa3e3;font-size: 20px;}
.markbig{margin-left: 11%;width: 80%;text-align: center;margin-top: 40px;padding-top: 10px;border-radius: 100px;border: 3px solid #dbdbdb;padding: 10px;font-family: 'Pattaya', bold;color: #dbdbdb;font-size: 40px;}
.zimekclosebtn{float: left;height: 100%; width: 81px;background-color: #141414;border: 0px solid #161616;transition-duration: 0.2s;}
.zimekclosebtn:hover{float: left;height: 100%; width: 81px;background-color: #212121;border: 0px solid #161616;}
.zimekbtn:hover{background-color: #2d2d2d;border: 1px solid #afafaf;transition-duration: 0.17s;}
.zimekbtn{background-color: #161616;border: 0px solid #191919;}
.overLa{margin-top: 20%;background:#212121;border-radius:2px;display:none;height:300px;margin-left:30%;margin-right:-30px;padding:0;position:absolute;width:395px;z-index:1}
.sender{word-wrap: break-word;}
.inputzimek {border-bottom: 0px solid #d6d6d6;}

.zimekbtn2{background-color: #141414;border: 0px solid #161616;transition-duration: 0.2s;}
.zimekbtn2:hover{background-color: #212121;border: 0px solid #161616;}

#shadowbg{background-image: url("https://zimek-lmao.github.io/better-alis/resources/shadowbg.png");
  height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;}

#logomenu{background-image: url("https://zimek-lmao.github.io/better-alis/resources/menulogo.png");
  width: 340px;height: 170px;margin-top: 60px;transition-duration: 0.5s;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;}

#logomenu:hover{width: 390px;height: 195px;margin-top: 45px;}

.zimekcheckbox{margin-top: -1px;}
.zimekbox{width: 27px;height: 27px;margin-top: 3px;}
button{outline: none;}
#info{z-index:1;}
.zimeksettings{}
#emojipanel{filter: grayscale(80%);opacity: 0.5}
#emojipanel:hover{filter: none;opacity: 1;transition-duration: 0.17s;}

.rest:hover{border: 2px solid red;}


.zimekrestart{background-color: rgba(0,0,0,0.7);border-radius: 100px;padding: 5px;margin-top: -5px;margin-left: 3px;}
.zimekrestart:hover{border: 5px solid red;transition-duration: 0.2s;}
#zimekrestartwrite{display: none;}
.uk-card-title{transition-duration: 0.5s;}
</style>
<link href="https://fonts.googleapis.com/css?family=Pattaya" rel="stylesheet">
`).appendTo('head');

var replacement = {
    '/shrug': '¯\\_(ツ)_/¯',
    '/lenny': '( ͡° ͜ʖ ͡°)',
    '/dance': '~(˘▾˘~)',
    '/tableflip': '(╯°□°）╯︵ ┻━┻',
};
/*
    'A': 'А',
    'o': 'о',
    'O': 'О',
    'e': 'е',
    'E': 'Е',
    's': 'ѕ',
    'S': 'Ѕ',
    'p': 'р',
    'P': 'Р',
    'c': 'с',
    'C': 'С',
*/
//==////==//
$("h2#lb_title").addClass("betterlb");
$("#div_lb").addClass("betterlb1");
//==//HTML Things//==//

$(`
<div id="info" class="overALL" style="z-index: 600;">
<button class="zimekclosebtn" id="closeinfo"><img src="https://zimek-lmao.github.io/better-alis/resources/symbols/back.png" width="60%"></button>

<div style="padding: 20px;margin-top: 15px;height: 85%; width: 90%;margin-left: 81px;overflow-y: scroll;border-radius: 15px;"">

<div style="float: left;width: 49%;">

<h4>Emojis commands</h4>
<h5>/shrug<br>/lenny<br>/dance<br>/tableflip
</div>
<div style="float: right;width: 49%;"><h3>This version of better alis is working with Havis<h3><br><font size="5px"><b>
<a href="https://greasyfork.org/en/users/141745-zimek" target="_blank">Check my other Extensions!</b></a></font><br><br>
</div>
</div>
<div style="margin-left: 81px;">
<div style="max-height: 200px;">
<div style="margin-bottom: 30px;float: left;"><a href="https://discord.gg/GGWxv7x" target="_blank"><img src="https://zimek-lmao.github.io/better-alis/resources/infopanel/discord.png" width="200px" height="68"></a></div>
<div class="mark"><b>Better Alis by Zimek</b></div>
<div style="float: left;margin-top: 10px;margin-left: 10px;"><div class="g-ytsubscribe" data-channelid="UCzQLS2sTAPAYH7qyj0FXP3w" data-layout="full" data-theme="dark" data-count="hidden"></div></div></div>

</div>
</div>
`).insertAfter("#settingsoverlays");

$(`
<div style="float: right;padding: 5px;margin-right: 60px;margin-top: 345px;display: none;" id="restartbtnin"><button onclick="return respawn(),!1" id="respawn1" style="position:absolute;background-color: transparent;border: 0px solid transparent;"><div id="zimekrestartwrite" class="zimekrestartwrite" style="position:absolute;margin-top: 15px;margin-left: -60px;"><font color="red">RESTART</font></div><img class="zimekrestart zimekrestartimg" id="zimekrestartimg" src="https://zimek-lmao.github.io/better-alis/resources/restartbtn.png" width="50px" height="50px"></button>
`).insertAfter("#div_lb");

//style="border: 1px solid #000000;border-radius: 100px;"
//<img src="https://i.imgur.com/Ndk0nUp.png" style="margin-top: 2px;margin-right: 10px;position:absolute;opacity: 1;width: 25px;"> winter
$(`
<div id="hidepanelorsmth" class="overLa" style="display: block;transition-duration: 0.2s"><center><div id="logomenu" style=""></div></center></div>
`).insertBefore("#settingsoverlays");
//<button id="snowpanel" class="zimekbtn" style="width: 60px;height: 60px;position:absolute;margin-left: 35px;margin-top: 35px;"><img src="https://i.imgur.com/mk1kfwS.png" width="50px"></button>

$(`
<div id="BTAsettings" class="overLa" style="margin-bottom: 500px;height: 380px;margin-top: 0px;margin-left: 284px;width: 400px;z-index: 200;transition-duration: 0.2s">
<div style="height: 70px;width: 100%;">
<button id="hideall" class="zimekbtn2" style="width: 50%;height: 70px;"><img src="https://zimek-lmao.github.io/better-alis/resources/symbols/close.png" width="50px"></button>
<button id="infobtn" class="zimekbtn2" style="width: 50%;height: 70px;float:right;"><img src="https://zimek-lmao.github.io/better-alis/resources/symbols/info.png" width="50px"></button>
</div>
<div id="zimekmain" style="width: 79%;max-height: 60%;float: left;margin-top: 10px;padding: 15px;">
Better Alis 9.9.2 [Havis Working]
<div style="padding-bottom: 10px;"><input style="position: absolute;margin-left: 165px;border-radius: 3px;bottom: 213px;border: 2px solid #000000;padding: 0px;height: 30px;width: 100px;" id="hx-chnl" type="color" value="">
        <style> #hx-chnl2{width: 400px; height: 40px;border-radius: 5px;margin-left: -10px; padding: 10px;margin-top: 10px; font-size: 21px;border: 1px solid #000000;} #color{padding: 5px;}</style>
        <div id="color" style="height: 30px;width: 99%;"><input id="hx-chnl2" style="height: 35px;" class="uk-input" placeholder="BG Color" maxlength="30"></div></div>
<div style="margin-top: 10px;">
<label><input id="bigscore" class="uk-checkbox zimekbox zimekcheckbox" type="checkbox" style="margin-top: 3px;"> Big Score</label><br>
<label><input id="bgshadow" class="uk-checkbox zimekbox zimekcheckbox" type="checkbox" style="margin-top: 3px;"> Background shadow</label><br>
<label><input id="fbname" class="uk-checkbox zimekbox zimekcheckbox" type="checkbox" style="margin-top: 3px;"> Hide facebook name</label><br>
<label><input id="restartin" class="uk-checkbox zimekbox zimekcheckbox" type="checkbox" style="margin-top: 3px;"> Restart button in game</label><br>
<button id="snowpanel" class="zimekbtn" style="width: 100px;height: 100px;position:absolute;margin-left: 255px;margin-top: -110px;"><img src="https://zimek-lmao.github.io/better-alis/resources/snow/snow.png" width="80px"></button>
<!-- <div style="margin-top: 3px;"></div> -->
<div style="margin-top: 3px;">
</div>
</div>
</div><br>
</div>
`).insertBefore("#settingsoverlays");
$(`
<li id="havocservers">
        <a id="havocservers">
          <p style="width: 250px;">Havoc's server list</p>
          <img width="25px" src="https://zimek-lmao.github.io/better-alis/resources/havoclogo.png">
        </a>
      </li>
`).insertAfter("#yt");

$(`
<li id="timechange">
        <a id="timechange">
          <p style="width: 250px;">Color change time</p>
          <img width="25px" style="margin-left: 1px;" src="https://zimek-lmao.github.io/better-alis/resources/timer.png">
        </a>
      </li>
`).insertAfter("#openrankingli");

$(`
<div id="shadowbg" style="position:absolute;height: 100%;width: 100%;opacity: 1;display: none;">
</div>
`).insertBefore("#overlays");

/*
(function() {
    'use strict'; sweetAlert("Loading...");var waitForFb=setInterval(()=>{"number"==typeof userid?($("#swal2-title").text(`User ID detected ${userid}...`),clearInterval(waitForFb),checkColorChangeTime()):$("#swal2-title").text("Waiting for your Facebook account to load in...")},100),checkColorChangeTime=()=>{$.getJSON(`http://api.alis.io/api/users/${userid}/upgrades`,e=>{$("#swal2-title").text(`Retrieving data from ${userid}...`),$("#swal2-title").css("white-space","pre-line");var t=new Date(e.upgrades[0].updated_at).getTime();console.log(e.upgrades[0].updated_at);var a=setInterval(()=>{var e=t-(new Date).getTime()+6048e5,r=parseInt(e/864e5),l=parseInt(e%864e5/36e5),s=parseInt(e%36e5/6e4),i=parseInt(e%6e4/1e3);$("#swal2-title").text(`You can change your color in:\n${r}d ${l}h ${s}m ${i}s`),e<=0&&($("#swal2-title").text("You can change your color now."),clearInterval(a),$("#swal2-title").removeAttr("style")),$(".swal2-buttonswrapper").children(":first").click(()=>{clearInterval(a),$("#swal2-title").removeAttr("style")})},1e3)})};
})();
*/

//==////==//

//==//js//==//

 //tysm havoc for help with code <3 also to dont have problem with that i use some his codes :)

const checkedState = JSON.parse(localStorage.getItem("bigscore"));
const bigScore = document.getElementById("bigscore");
bigScore.checked = checkedState;
$("#div_score").css("font-size", `${checkedState  ? "23" : "15"}px`);
bigScore.onclick = function () {
   localStorage.setItem("bigscore", bigScore.checked);
    if (bigScore.checked) {
$("#div_score").css("font-size", "23px");
    } else {
$("#div_score").css("font-size", "15px");
}
};

const checkedStateFB = JSON.parse(localStorage.getItem("fbname"));
const FBname = document.getElementById("fbname");
FBname.checked = checkedStateFB;
$("h3.uk-card-title").css("filter", `blur(${checkedStateFB  ? "8" : "0"}px)`);
FBname.onclick = function () {
   localStorage.setItem("fbname", FBname.checked);
    if (FBname.checked) {
$("h3.uk-card-title").css("filter", "blur(8px)");
    } else {
$("h3.uk-card-title").css("filter", "blur(0px)");
}
};

const checkedStateRestart = JSON.parse(localStorage.getItem("restartin"));
const restartIN = document.getElementById("restartin");
restartIN.checked = checkedStateRestart;
$("#restartbtnin").css("display", `${checkedStateRestart  ? "block" : "none"}`);
restartIN.onclick = function () {
   localStorage.setItem("restartin", restartIN.checked);
    if (restartIN.checked) {
$("#restartbtnin").css("display", "block");
    } else {
$("#restartbtnin").css("display", "none");
}
};

//#lb_title{margin-right: 1px;margin-top: 3px;} .betterlb{text-align: center;margin-top: 10px;margin-right: 5px;}
// .betterlb{text-align: center;margin-top: 10px;margin-right: 5px;} #lb_title{font-size: 25px;} .betterlb1{border-radius: 0px 0px 0px 20px;margin-top: -3px;}

/*const checkedStateLB = JSON.parse(localStorage.getItem("betterlb"));
const betterLB = document.getElementById("betterlb");
betterLB.checked = checkedStateLB;
$("#lb_title").css("font-size", `${checkedStateLB  ? "25" : "20"}px`);
$("#lb_title").css("margin-right", `${checkedStateLB  ? "1" : "0"}px`);
$("#lb_title").css("margin-top", `${checkedStateLB  ? "3" : "5"}px`);
$("#lb_title").css("text-align", `${checkedStateLB  ? "center" : "left"}`);
$("#div_lb").css("border-radius", `0px 0px 0px ${checkedStateLB  ? "20" : "0"}px`);
betterLB.onclick = function () {
    localStorage.setItem("betterlb", betterLB.checked);
    if (betterLB.checked) {
        $("h2#lb_title").css("text-align", "center");
        $("#div_lb").css("border-radius", "0px 0px 0px 20px");
        $("h2#lb_title").css("font-size", "25px");
        $("h2#lb_title").css("margin-top", "3px");
        $("h2#lb_title").css("margin-right", "1px");
    } else {
        $("h2#lb_title").css("text-align", "left");
        $("#div_lb").css("border-radius", "0px 0px 0px 0px");
        $("h2#lb_title").css("font-size", "20px");;
        $("h2#lb_title").css("margin-right", "0px");
        $("h2#lb_title").css("margin-top", "5px");
}
};*/

const checkedStateShadow = JSON.parse(localStorage.getItem("bgshadow"));
const bgShadow = document.getElementById("bgshadow");
bgShadow.checked = checkedStateShadow;
$("#shadowbg").css("display", `${checkedStateShadow  ? "block" : "none"}`);
bgShadow.onclick = function () {
    localStorage.setItem("bgshadow", bgShadow.checked);
    if (bgShadow.checked) {
$("#shadowbg").show();
    } else {
$("#shadowbg").hide();
}
};


$(document).ready(function(){
    $("#infobtn").click(function(){
        $("div#info").show();
    });
    $(document).ready(function(){
    $("#timechange").click(function(){
'use strict'; sweetAlert("Loading...");var waitForFb=setInterval(()=>{"number"==typeof userid?($("#swal2-title").text(`User ID detected ${userid}...`),clearInterval(waitForFb),checkColorChangeTime()):$("#swal2-title").text("Waiting for your Facebook account to load in...")},100),checkColorChangeTime=()=>{$.getJSON(`http://api.alis.io/api/users/${userid}/upgrades`,e=>{$("#swal2-title").text(`Retrieving data from ${userid}...`),$("#swal2-title").css("white-space","pre-line");var t=new Date(e.upgrades[0].updated_at).getTime();console.log(e.upgrades[0].updated_at);var a=setInterval(()=>{var e=t-(new Date).getTime()+6048e5,r=parseInt(e/864e5),l=parseInt(e%864e5/36e5),s=parseInt(e%36e5/6e4),i=parseInt(e%6e4/1e3);$("#swal2-title").text(`You can change your color in:\n${r}d ${l}h ${s}m ${i}s`),e<=0&&($("#swal2-title").text("You can change your color now."),clearInterval(a),$("#swal2-title").removeAttr("style")),$(".swal2-buttonswrapper").children(":first").click(()=>{clearInterval(a),$("#swal2-title").removeAttr("style")})},1e3)})};
})();
    });
        $("#defaultscr").click(function(){
     $("#div_score").css("font-size", "17px");
        $("#defaultscr").hide();
        $("#bigscr").show();
    });
        $("#closeinfo").click(function(){
            $("div#info").hide();
    });
            $("button.uk-button.uk-button-default.btn-play.uk-button-large.uk-width-small").click(function(){
            $("#fps").css("margin-top", "35px");
    });
        $("#logomenu").click(function(){
            $("#hidepanelorsmth").hide();
            $("#BTAsettings").show();
    });
    $("#havocservers").click(function(){
$('#gamemodeinstancelist').remove();
$('.uk-tab').remove();
$('p.loading.saving').remove();
$('#serverlistc').remove();
$('li#havocservers').remove();
$('#havoc-servers').show();
    });
    $("#hideall").click(function(){
        $("#BTAsettings").hide();
        $("#hidepanelorsmth").show();
    });
    $("#emojistoggle").click(function(){
        $("div.unicodeEmojiContainer").toggle();
    });
});

$("input#max_draw_time").attr('max','650');
$("input#draw_delay1").attr('max','650');
$("input#opt_zoom_speed").attr('max','0.99');
$("input#max_draw_time").attr('min','0');
$("input#draw_delay1").attr('min','0');
$("input#opt_zoom_speed").attr('min','0.5');
$("input#skinurl").attr('maxlength','999999');
//==////==//


//==//Background color changer//==//
(function() {
    'use strict';

    var input = document.getElementById("hx-chnl");
    input.value = localStorage.getItem("cardcolorback") || "";

    var input2 = document.getElementById("hx-chnl2");
    input2.value = localStorage.getItem("cardcolorback2") || "";

    $("#hx-chnl, #hx-chnl2").on("input", function() {
        localStorage.setItem("cardcolorback", input.value);
        localStorage.setItem("cardcolorback2", input2.value);
    });

    $("#hx-chnl").on("input", function() {
        var regIs = $(this).val();
        $("html").css("background", regIs);
        $("#hx-chnl2").val(regIs);
    });
    $("#hx-chnl2").on("input", function() {
        var regI = $(this).val();
        $("html").css("background", regI);
        $("#hx-chnl").val(regI);
    });

    return $("#hx-chnl, #hx-chnl2").trigger("input");
})();
document.addEventListener('mouseup', mouseup);
//==////==//
//==//W fast macro//==//
setInterval(function(){
    $('img[src="/assets/img/adblocker.png"]').remove();
    $('#ad_bottom').remove();
    $('.content>.text-center>.tab-pane>div#ad_main').remove();
}, 500);

//macro W
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}
//==////==//

//==//Auto-respawn//==//  | Auto respawn made by Sev
document.addEventListener('mouseup', mouseup);

//create Auto Respawn Button | Auto respawn made by Sev
var BtnContainer = document.createElement("button");
BtnContainer.className = "uk-button uk-button-default";
BtnContainer.Id = "autorespawn";
document.getElementsByClassName('uk-card uk-card-body uk-card-default')[1].insertBefore(BtnContainer,document.getElementsByClassName("uk-button uk-button-default btn-play")[0]);
BtnContainer.innerHTML = '<h4>Auto-Respawn</h4>';
BtnContainer.title = "Auto-Respawn";

//create checkbox to save state during game
var ChkContainer = document.createElement("checkbox");
ChkContainer.className = "checkbox";
ChkContainer.checked = localStorage.getItem('ChkContainer.checked');

//styling
BtnContainer.style.marginLeft = "25px";
BtnContainer.style.marginTop = "245px";
BtnContainer.style.width = "300px";
BtnContainer.style.paddingTop = "9px";
BtnContainer.style.height = "50px";
if(ChkContainer.checked === "true"){
	BtnContainer.style.borderColor = "#1660a0";}
else {BtnContainer.style.borderColor = "#3c3c3c";}

//user button
mouseover = false;
BtnContainer.onmouseover = function(){
	mouseover = true;
};
BtnContainer.onmouseout = function(){
	mouseover = false;
};
function mouseup(event) {
	if (event.button === 0 && mouseover) {
		if(ChkContainer.checked === "true"){
			BtnContainer.style.borderColor = "#3c3c3c";
			ChkContainer.checked = "false";
			console.log("Auto-Respawn is not checked");
			localStorage.setItem('ChkContainer.checked', ChkContainer.checked);
		}
		else {
			BtnContainer.style.borderColor = "#1660a0";
			ChkContainer.checked = "true";
			console.log("Auto-Respawn is checked");
			localStorage.setItem('ChkContainer.checked', ChkContainer.checked);
		}
	}
}

//respawn function
window.setInterval(function() {
	if(ChkContainer.checked === "true"){
		if(isJoinedGame === false && currentIP !== "" && overlay === false)
			document.getElementsByClassName('uk-button uk-button-default btn-play uk-button-large uk-width-small')[0].click();

		if(document.getElementById('overlays').style.display === "none")
			overlay = false;
		else
			window.setTimeout(function() {
				overlay = true;
			}, 100);
	}
}, localStorage.getItem('interval'));
//==////==//
//==//Havoc's servers buttons//==//
const havocStyle = $(`
	<style>
		.havoc-region-btn {
			height: 55px;
			margin-top: 60px;
            border: 1px solid #303030;
		}
		.havoc-gm-btn {
			height: 55px;
			margin-top: 5px;
			background: 0 0;
			color: #fff;
			border: 1px solid #1660a0;
            font-size: 12px;
		}
		.havoc-gm-btn:hover {
border: 1px solid #42a7f4;}

.instant{border-color: #3d97ff;color: #89bfff;}
.instant:hover{border-color: #7ab7ff;color: #9ecaff;}

.crazy{border-color: #ff6b60;color: #ff9b93;}
.crazy:hover{border-color: #ff9991;color: #ffb8b2;}

.bots{border-color: #ffe366;color: #ffed99;}
.bots:hover{border-color: #ffeb8c;color: #fff1b2;}

.selffeed{border-color: #6bff68;color: #acffaa;}
.selffeed:hover{border-color: #98ff96;color: #c0ffbf;}
	</style>
`);
$('html > head').append(havocStyle);

unsafeWindow.iterateResponse = (obj, selectedRegion, gamemodes = []) => {
	Object.keys(obj).forEach(item => {
		const temp = gamemodes.concat(item);
		if (obj[item] && typeof obj[item] === 'object') {
			iterateResponse(obj[item], selectedRegion, temp);
			return;
		}
		$('#havoc-gamemodes').append(`<div id = "havoc-${selectedRegion}-${gamemodes[0].toLowerCase()}-${item}" class="uk-button havoc-gm-btn uk-button-large uk-width-small ${gamemodes[0]}" onclick="connector('ws:${obj[item].split(':')[1]}:${obj[item].slice(-4)}'); $('.uk-card > .uk-width-small').click();"> ${selectedRegion} ${gamemodes[0]} ${item} </div>`).fadeIn(600);
		$('#havoc-back-btn').fadeIn(600);
	});
};

unsafeWindow.regionClicked = (region) => {
	$('#havoc-servers-regions').hide();
	$.getJSON('http://alis.io/statsports.json', (d) => {
		iterateResponse(d[region.slice(6)], region.split(/[--]/)[1]);
	});
};

unsafeWindow.back = () => {
	$('#havoc-back-btn').fadeOut(100);
	$('#havoc-gamemodes').fadeOut(600);
	$('#havoc-servers-regions').show();
	$('#havoc-gamemodes').empty();
};

$('#gamemodelistcontent').append(`
<div id="havoc-servers"  style="display: none;">
    <div id="havoc-gamemodes" style="max-height: 380px; overflow-y: scroll; display: inline-block;">
    </div>
    <div id="havoc-servers-regions" style="">
        <div id="havoc-eu-server" class="uk-button uk-button-default havoc-region-btn uk-button-large uk-width-small" onclick ="regionClicked(this.id)">EU</div>
        <div id="havoc-na-server" class="uk-button uk-button-default havoc-region-btn uk-button-large uk-width-small" onclick ="regionClicked(this.id)">NA</div>
        <div id="havoc-as-server" class="uk-button uk-button-default havoc-region-btn uk-button-large uk-width-small" onclick ="regionClicked(this.id)">AS</div>
    </div>
</div>
`);

$('#gamemodelistcontent').append(`
<button id="havoc-back-btn" class="uk-button uk-button-default uk-button-small uk-grid-margin uk-first-column" onclick="back()" style="
    margin-top: 30px;
    margin-left: 18px;
    border: 1px solid #303030;
    display: none;
">← Back</button>
`);
//==////==//
window.setInterval(function () {
    if (window.webSocket !== undefined && webSocket.readyState === 0)
        setTimeout(spectate, 300);
}, 100);

/*body{user-select: text;}
.msg{user-select: text;}
.coloredname{user-select: text;}
#chatroom{z-index: 400;}*/


//WINTER!!!

$(`
<div id="bg" style="position:absolute;height: 100%;width: 100%;opacity: 0.9;">
</div>

<div id="bg2" style="position:absolute;height: 100%;width: 100%;opacity: 0.4;">
</div>

<div id="bg1" style="position:absolute;height: 100%;width: 100%;opacity: 0.6;">
</div>
`).insertBefore("#pp");

$(document).ready(function(){
    $("#snowpanel").click(function(){
$('#snowpanelbuild').show();
    });
});


$(document).ready(function(){
    $("#closesnowpanel").click(function(){
$('#snowpanelbuild').hide();
    });
});

$(`
<div id="snowpanelbuild" class="overLa" style="display: none;z-index: 999;box-shadow: 0 -5px 10px -5px black;">
<div style="padding: 20px;">
<label><input id="snowdisableground" class="uk-checkbox zimekbox zimekcheckbox" type="checkbox"> Disable snow on ground</label><br>
<label><input id="snowdisablefalling" class="uk-checkbox zimekbox zimekcheckbox" style="margin-top: 3px;" type="checkbox"> Disable falling snow</label><br>
<label><input id="snowdisableglow" class="uk-checkbox zimekbox zimekcheckbox" style="margin-top: 3px;" type="checkbox"> Disable glow effect for menu</label><br>
<!--<div style="padding: 15px;">
 <button id="disableallsnow" class="zimekbtn" style="width: 150px;height: 37px;"><font size="4px" color="#dbdbdb">Disable ALL</button><button id="enableallsnow" class="zimekbtn"style="margin-left: 5px;width: 150px;height: 37px;"><font size="4px" color="#dbdbdb">Enable ALL</button></font>
</div><br> -->
<div>
<button id="closesnowpanel" class="openpanel" style="width: 80px;height: 80px;margin-top: 60px;margin-left: 36%;"><img src="https://zimek-lmao.github.io/better-alis/resources/symbols/check.png" width="45px"></button>
</div>
</div>
</div>
`).insertBefore("#settingsoverlays");



/*$("div.uk-offcanvas-bar").addClass("zimeksnowglow");
$("#hotkeysoverlay").addClass("zimeksnowglow");
$("#rankingoverlays").addClass("zimeksnowglow");
$("#settingsoverlays").addClass("zimeksnowglow");
.zimeksnowglow{box-shadow: 0px 0px 7px white;} */

$(`<style>
.uk-card{box-shadow: 0px 0px 7px white;}

#bg{background-image: url("https://zimek-lmao.github.io/better-alis/resources/snow/rain.png");
  height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;}

#bg2{background-color: black;}

#bg1{background-image: url("https://zimek-lmao.github.io/better-alis/resources/snow/background.png");
  height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;}

#snowmenu{background-image: url("https://zimek-lmao.github.io/better-alis/resources/snow/x.png");
  height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;}
</style>`).appendTo('head');


const checkedSnowGround = JSON.parse(localStorage.getItem("snowdisableground"));
const snowGround = document.getElementById("snowdisableground");
snowGround.checked = checkedSnowGround;
$("#bg1").css("display", `${checkedSnowGround  ? "none" : "block"}`);
snowGround.onclick = function () {
   localStorage.setItem("snowdisableground", snowGround.checked);
    if (snowGround.checked) {
        $("#bg1").hide();
    } else {
        $("#bg1").show();
}
};

const checkedSnowFalling = JSON.parse(localStorage.getItem("snowdisablefalling"));
const snowFalling = document.getElementById("snowdisablefalling");
snowFalling.checked = checkedSnowFalling;
$("#bg").css("display", `${checkedSnowFalling  ? "none" : "block"}`);
snowFalling.onclick = function () {
   localStorage.setItem("snowdisablefalling", snowFalling.checked);
    if (snowFalling.checked) {
        $("#bg").hide();
    } else {
        $("#bg").show();
}
};

const checkedSnowGlow = JSON.parse(localStorage.getItem("snowdisableglow"));
const snowGlow = document.getElementById("snowdisableglow");
snowGlow.checked = checkedSnowGlow;
$("div.uk-card").css("box-shadow", `0px 0px ${checkedSnowGlow  ? "0" : "7"}px white`);
snowGlow.onclick = function () {
    localStorage.setItem("snowdisableglow", snowGlow.checked);
    if (snowGlow.checked) {
        $("div.uk-card").css("box-shadow", "0px 0px 0px white");
    } else {
        $("div.uk-card").css("box-shadow", "0px 0px 7px white");
}
};

////==////