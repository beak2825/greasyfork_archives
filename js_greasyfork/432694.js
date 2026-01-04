// ==UserScript==
// @name MooMoo.io 💀D34TH💀 GrImReApEr 💀KILL3R💀I F34R ThE Mo_D
// @version      3.1
// @description  💀D34TH💀 _F34R_  MOD OP!
// @author       Xx_Fading_Xx
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @namespace https://greasyfork.org/de/users/740795-big-king
// @downloadURL https://update.greasyfork.org/scripts/432694/MooMooio%20%F0%9F%92%80D34TH%F0%9F%92%80%20GrImReApEr%20%F0%9F%92%80KILL3R%F0%9F%92%80I%20F34R%20ThE%20Mo_D.user.js
// @updateURL https://update.greasyfork.org/scripts/432694/MooMooio%20%F0%9F%92%80D34TH%F0%9F%92%80%20GrImReApEr%20%F0%9F%92%80KILL3R%F0%9F%92%80I%20F34R%20ThE%20Mo_D.meta.js
// ==/UserScript==

setInterval(() => window.follmoo && follmoo(), 10);
window.location.native_resolution = true;
var autoreloadloop;
var autoreloadenough = 0;

autoreloadloop = setInterval(function () {
    if (autoreloadenough < 200) {
        if (document.getElementById("loadingText").innerHTML == `disconnected<a href="javascript:window.location.href=window.location.href" class="ytLink">reload</a>`) {
            document.title = "Disconnected? NP";
            clearInterval(autoreloadloop);
            setTimeout(function () {document.title = "Moo Moo";}, 1000)
            location.reload();
        }
        autoreloadenough++;
    }
    else if (autoreloadenough >= 300) {
        clearInterval(autoreloadloop);
        document.title = "there you are";
        setTimeout(function () {document.title = "Moo Moo";}, 1000)
    }
}, 50);

document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
document.querySelector("#pre-content-container").remove(); //Anti-AD
document.getElementById('promoImgHolder').remove();
document.title = ' MooMoo Modification by BiG_KinG';
document.getElementById('loadingText').innerHTML = ' Your Game is loading... ';
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById("adCard").style.display = "none";
$("#adCard").parent().css({display: "none"});
document.querySelector("#leaderboard").appendChild(
    (function() {
        let text = "Ping: ";
        let text2 = " ms";
        let oldPing = 0;
        const pingSpan = document.createElement("span");
        pingSpan.id = "pingTime";
        pingSpan.textContent = text;
        pingSpan.style.display = "inline-block";
        setInterval(function() {
            typeof pingTime !== "undefined" &&
                oldPing !== pingTime &&
                ((oldPing = pingTime),
                 (pingSpan.textContent = text + oldPing + text2),
                 (function() {
                if (oldPing <= 100) {
                    pingSpan.style.color = "green";
                }
                if (oldPing >= 101 && oldPing <= 250) {
                    pingSpan.style.color = "Orange";
                }
                if (oldPing >= 251) {
                    pingSpan.style.color = "red";
                }
            })());
        });
        return pingSpan;
    })()
);

setInterval(() => {
    setTimeout(() => {
        document.getElementById('chatBox').placeholder = "writing";
        setTimeout(() => {
            document.getElementById('chatBox').placeholder = "writing.";
            setTimeout(() => {
                document.getElementById('chatBox').placeholder = "writing..";
                setTimeout(() => {
                    document.getElementById('chatBox').placeholder = "writing...";
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}, 500)
$('#itemInfoHolder').css({'top':'72px',
                          'left':'15px'
                         });
$( "#errorNotification" ).after( '<div id="moddedMenu"><div class="titleMM">MENU</div><div class="one"><label class="switch"></span></label><div class="two"><div class="text"><b>____made by BiG_KinG____ <label class="container">Music<input type="checkbox" id="Music"><span class="checkmark"></label><label class="container"></b><hr></span></label><label>BIOM MAP<input type="checkbox" id="MaP"><span class="checkmark"></label><label class="container"></b><hr></span></label><label><label class="container">Bread Cat Map<input type="checkbox" id="bread_cat"><span class="checkmark"></label><label class="container"></b><hr></span></label><label><label class="container">Another Stupid Cat Gif map?<input type="checkbox" id="Stupid_cat_gif"><span class="checkmark"></label><label class="container"></b><hr></span></label><label><label class="container">Dark Mod?<input type="checkbox" id="dark_mod"><span class="checkmark"></label><label lass="container"></b><hr></span>Middle Big Store?</label><label><input type="checkbox" id="Middle_big_store"><span class="checkmark"></label><label lass="container"></b><hr></span>Big Store?</label><label><input type="checkbox" id="Big_store"><span class="checkmark"><div></div>');

(function() {var css = [
	"  #moddedMenu {",
	"    position: absolute;",
	"    top: 10.0%;",
	"    left: 0px;",
	"    width: 3%;",
	"    height: 50.5%;",
	"    background: rgba(0,0,0,0.6);",
	"    border: 3px solid rgba(0,0,0,0.9);",
	"    border-top-right-radius: 30px;",
	"    border-bottom-right-radius: 30px;",
	"    transition: 1s;",
	"    z-index: 999;",
	"  }",
	"",
	"  #moddedMenu:hover {",
	"    width: 20%;",
	"  }",
	"",
	"  .titleMM {",
	"    color: red;",
	"    border-bottom: 3px solid red;",
	"    font-size: 32px;",
	"    transform: rotate(90deg);",
	"    white-space: nowrap;",
	"    margin-top: 250%;",
	"    transition: 1s;",
	"  }",
	"",
	"  #moddedMenu:hover > .titleMM {",
	"    transform: rotate(180deg) translate(0,-1580%)",
	"  }",
	"",
	"  .switch {",
	"    margin-top: 5px;",
	"    margin-left: 10px;",
	"    position: absolute;",
	"    width: 60px;",
	"    height: 34px;",
	"    transition: opacity 1s;",
	"    opacity: 0;",
	"  }",
	"",
	"  .text {",
	"    bottom: 76%;",
	"    position: absolute;",
	"    color: red;",
	"    font-size: 20px;",
	"    left: 0%;",
	"    display: none;",
	"    transition: 1s;",
	"  }",
	"",
	"  .text > b { ",
	"    font-size: 20px;",
	"    color: red;",
	"  }",
	"",
	"  b:hover { ",
	"    color: red;",
	"  }",
	"",
	"  .one > .text {",
	"    top: 5.5%;",
	"  }",
	"",
	"  .two > .text {",
	"    top: 10.7%;",
	"  }",
	"",
	"  .three > .text {",
	"    top: 37.5%;",
	"  }",
	"",
	"  .four > .text {",
	"    top: 47.5%;",
	"  }",
	"",
	"  .five > .text {",
	"    top: 57.5%;",
	"  }",
	"",
	"  .six > .text {",
	"    top: 67.5%;",
	"  }",
	"",
	"  .seven > .text {",
	"    top: 77.5%;",
	"  }",
	"",
	"  .eight > .text {",
	"    top: 87.5%;",
	"  }",
	"",
	"  #moddedMenu:hover .switch {",
	"    opacity: 1;",
	"  }",
	"",
	"  #moddedMenu:hover .text {",
	"    display: block;",
	"  }",
	"",
	"  .one > .switch {",
	"    top: 15%;",
	"  }",
	"",
	"  .two > .switch {",
	"    top: 25%;",
	"  }",
	"",
	"  .three > .switch {",
	"    top: 35%;",
	"  }",
	"",
	"  .four > .switch {",
	"    top: 45%;",
	"  }",
	"",
	"  .five > .switch {",
	"    top: 55%;",
	"  }",
	"",
	"  .six > .switch {",
	"    top: 65%;",
	"  }",
	"",
	"  .seven > .switch {",
	"    top: 75%;",
	"  }",
	"",
	"  .eight > .switch {",
	"    top: 85%;",
	"  }",
	"",
	"  .switch input {",
	"    display:none;",
	"  }",
	"",
	"  .slider {",
	"    position: absolute;",
	"    cursor: pointer;",
	"    top: 0;",
	"    left: 0;",
	"    right: 0;",
	"    bottom: 0;",
	"    background-color: red;",
	"    -webkit-transition: .4s;",
	"    transition: .4s;",
	"  }",
	"",
	"  .slider:before {",
	"    position: absolute;",
	"    content: \"\";",
	"    height: 26px;",
	"    width: 26px;",
	"    left: 4px;",
	"    bottom: 4px;",
	"    background-color: white;",
	"    -webkit-transition: .4s;",
	"    transition: .4s;",
	"  }",
	"",
	"  input:checked + .slider {",
	"    background-color: red;",
	"  }",
	"  ",
	"  input:focus + .slider {",
	"    box-shadow: 0 0 1px red;",
	"  }",
	"",
	"  input:checked + .slider:before {",
	"    -webkit-transform: translateX(26px);",
	"    -ms-transform: translateX(26px);",
	"    transform: translateX(26px);",
	"  }",
	"",
	"  .slider.round {",
	"    border-radius: 34px;",
	"  }",
	"",
	"  .slider.round:before {",
	"    border-radius: 50%;",
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}
}
})();
var music1link = "https://cdn.discordapp.com/attachments/728226830414381056/731040059054096404/Astronomia_Remix_By_Jiaye_Trending_TikTok_EDM_Full_Version.mp3"
var music1 = new Audio(music1link);

var Music = document.querySelector("#Music")

Music.addEventListener('change', function() {
    if (this.checked) {
        music1.play();
    } else {
        music1.pause();
    }
})

var checkbox = document.querySelector("#MaP")

checkbox.addEventListener('change', function() {
    if (this.checked) {
        $("#mapDisplay").css({background: `url('http://i.imgur.com/Qllo1mA.png')`});
    } else {
        $("#mapDisplay").css({background: `rgba(0, 0, 0, 0.25)`})
    }
})

var checkbox2 = document.querySelector("#bread_cat")

checkbox2.addEventListener('change', function() {
    if (this.checked) {
        $("#mapDisplay").css({background: `url('https://lh3.googleusercontent.com/5RZMHxal_5gtIhvx_ct9h8EI_YMtYgOK94snff4lzVVPq2IMcRuzaIo4bt3-1BZWCMmI=s130')`});
    } else {
        $("#mapDisplay").css({background: `rgba(0, 0, 0, 0.25)`})
    }
})

var checkbox3 = document.querySelector("#Stupid_cat_gif")

checkbox3.addEventListener('change', function() {
    if (this.checked) {
        $("#mapDisplay").css({background: `url('https://media0.giphy.com/media/GaqnjVbSLs2uA/giphy.gif?cid=ecf05e47ea99c7380f6deb1064d8804c8eaeec5c01af4d9d&rid=giphy.gif')`});
    } else {
        $("#mapDisplay").css({background: `rgba(0, 0, 0, 0.25)`})
    }
})

var checkbox4 = document.querySelector("#dark_mod")

checkbox4.addEventListener('change', function() {
    if (this.checked) {
        $('.menuCard').css({'color':'#808080'});
        $('.menuCard').css({'white-space': 'normal',
                            'text-align': 'left',
                            'background-color': 'rgba(0, 0, 0, 0.74)',
                            '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                            '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                            'box-shadow': '0px 0px rgba(255, 255, 255, 0)'});
        $("#ageBarBody").css({'background-color':'black'});
        $('.menuButton').css({'background-color':'#000000'});
        $('#linksContainer2').css({'background-color':'#000000'});
        $('#ot-sdk-btn-floating .ot-floating-button__front').css({'background-color':'#000000'});
        document.getElementById('leaderboard').style.color = "#000000";
        document.getElementById('gameName').style.color = "#000000";
        document.getElementById('loadingText').style.color = "#000000";
        document.getElementById("allianceButton").style.color = "black";
        document.getElementById("chatButton").style.color = "black";
        document.getElementById("ageText").style.color = "black";
        document.getElementById("scoreDisplay").style.color = "#000000";
        document.getElementById("woodDisplay").style.color = "#000000";
        document.getElementById("stoneDisplay").style.color = "#000000";
        document.getElementById("killCounter").style.color = "#000000";
        document.getElementById("foodDisplay").style.color = "#000000";
        document.getElementById("storeButton").style.color = "black";
        document.getElementById('diedText').style.color = "#000000";
        document.getElementById('partyButton').style.color = "#000000";
    } else {
        $('.menuCard').css({'color':'#ffffff'});
        $('.menuCard').css({'white-space': 'normal',
                            'text-align': 'left',
                            'background-color': 'rgba(255, 255, 255)',
                            '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                            '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                            'box-shadow': '0px 0px rgba(255, 255, 255, 0)'});
        $("#ageBarBody").css({'background-color':'white'});
        $('.menuButton').css({'background-color':'#7ee559'});
        $('#linksContainer2').css({'background-color':'#ffffff'});
        $('#ot-sdk-btn-floating .ot-floating-button__front').css({'background-color':'#6aaae4'});
        document.getElementById('leaderboard').style.color = "#ffffff";
        document.getElementById('gameName').style.color = "#ffffff";
        document.getElementById('loadingText').style.color = "#ffffff";
        document.getElementById("allianceButton").style.color = "white";
        document.getElementById("chatButton").style.color = "white";
        document.getElementById("ageText").style.color = "white";
        document.getElementById("scoreDisplay").style.color = "#ffffff";
        document.getElementById("woodDisplay").style.color = "#ffffff";
        document.getElementById("stoneDisplay").style.color = "#ffffff";
        document.getElementById("killCounter").style.color = "#ffffff";
        document.getElementById("foodDisplay").style.color = "#ffffff";
        document.getElementById("storeButton").style.color = "white";
        document.getElementById('diedText').style.color = "#ffffff";
        document.getElementById('partyButton').style.color = "#ffffff";
    }
})

var checkbox5 = document.querySelector("#Big_store")

checkbox5.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("storeHolder").style = "height: 1000px; width: 480px;";
    } else {
        document.getElementById("storeHolder").style = "height: 200px; width: 400px;";
    }
})

var checkbox6 = document.querySelector("#Middle_big_store")

checkbox6.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("storeHolder").style = "height: 300px; width: 435px;";
    } else {
        document.getElementById("storeHolder").style = "height: 200px; width: 400px;";
    }
})

let newImg = document.createElement("img");
newImg.src = "data:image/png;base64,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";
newImg.style = `position: absolute; top: 10px; left: 12px; z-index: 100000; width: 50px; height: 50px; cursor: pointer;`;
document.body.prepend(newImg);

newImg.addEventListener("click", () => {
    let w = window.open("https://discord.gg/4skVv2dZZs", null, `height=650, width=1199, status=yes, toolbar=no, menubar=no, location=no`);
});

let youtube = document.createElement("img");
youtube.src = "data:image/png;base64,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";
youtube.style = `position: absolute; top: 10px; left: 71px; z-index: 100000; width: 160px; height: 50px; cursor: pointer;`;
document.body.prepend(youtube);

youtube.addEventListener("click", () => {
    let w = window.open("https://www.youtube.com/channel/UChRjYjjDQn1HpCzZuGXnjww", null, `height=650, width=1199, status=yes, toolbar=no, menubar=no, location=no`);
});