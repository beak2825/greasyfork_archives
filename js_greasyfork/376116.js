// ==UserScript==
// @name         Alis Winter Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Winter mode in alis.io
// @author       Zimek
// @icon         https://betteralis.github.io/better-alis/resources/snow/snow.png
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376116/Alis%20Winter%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/376116/Alis%20Winter%20Theme.meta.js
// ==/UserScript==

console.log("%cAlis Winter Theme by Zimek", "background: #222; color: #93ffff; padding: 5px;font-size: 15px;");

//<button id="snowpanel" class="zimekbtn" style="width: 60px;height: 60px;position:absolute;margin-left: 35px;margin-top: 35px;"><img src="https://i.imgur.com/mk1kfwS.png" width="50px"></button>
$("div#ad_main").remove();
$(`
<li id="snowpanel">
        <a id="snowpanel">
          <p style="width: 250px;margin-left: 1px;">Snow panel</p>
          <img width="25px" src="https://zimek-lmao.github.io/better-alis/resources/snow/snow.png">
        </a>
      </li>
`).insertAfter("#openrankingli");

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
<div id="snowpanelbuild" class="overLa" style="display: none;z-index: 9999999;box-shadow: 0 -5px 10px -5px black;">
<div style="padding: 20px;">
<label><input id="snowdisableground" class="uk-checkbox zimekbox" type="checkbox"> Disable snow on ground</label><br>
<label><input id="snowdisablefalling" class="uk-checkbox zimekbox" type="checkbox"> Disable falling snow</label><br>
<label><input id="snowdisableglow" class="uk-checkbox zimekbox" type="checkbox"> Disable glow effect for menu</label><br>
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

.zimekbox{margin-top: 5px}
.zimekbox{width: 27px;height: 27px;margin-top: 3px;}

.overLa{margin-top: 20%;background:#212121;border-radius:2px;display:none;height:300px;margin-left:30%;margin-right:-30px;padding:0;position:absolute;width:395px;z-index:300}
.zimekbtn:hover{background-color: #2d2d2d;border: 1px solid #afafaf;transition-duration: 0.17s;}
.zimekbtn{background-color: #161616;border: 0px solid #191919;}
.openpanel:hover{background-color: #141414;border: 0px solid #161616;}
.openpanel{background-color: #212121;border: 0px solid #161616;}
</style>`).appendTo('head');


const checkedSnowGround = JSON.parse(localStorage.getItem("snowdisableground")); //thanks havoc for help with code!
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