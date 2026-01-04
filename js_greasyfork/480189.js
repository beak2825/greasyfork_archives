// ==UserScript==
// @name         Moo Visuals
// @author       dahlia ingram
// @description  visuals for moomoo.io! move ment shade and more!
// @version      1
// @match        *://*.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480189/Moo%20Visuals.user.js
// @updateURL https://update.greasyfork.org/scripts/480189/Moo%20Visuals.meta.js
// ==/UserScript==
document.getElementById('promoImgHolder').innerHTML = `
<style>
p { font-size: 20px;}#noticationDisplay {
    vertical-align: top;
    position;
    right: 95%;
    top: 70%;
    text-align: right;
} #border { border-top: 5px solid; border-image: linear-gradient(to right,#00ff00,#ff4d4d,#c56cf0,#7f3fbf) 1 0 0 0;} .menuButton { background-color: #00ff00,#ff4d4d,#c56cf0,#c56cf0; transition: 0.5s; border-radius: 0px; } .menuButton:hover { background-color: #7f3fbf; transform: scale(1.11); box-shadow: 0 0 10px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.7); } .altServer { color: #00ff00,#ff4d4d,#c56cf0,#c56cf0; } .skinColorHolder { border-color: #00ff00,#ff4d4d,#c56cf0,#c56cf0; } .altServer:hover {color: #7f3fbf; } .menuText { background-color: rgba(63,69,77,255); color: #00ff00,#ff4d4d,#c56cf0,; } #youtuberOf {display: none; } #gameName {display: none;} .menuHeader { background-color: rgba(63,69,77,255); color: #00ff00,#ff4d4d,#c56cf0,#c56cf0; margin-top:0px; border-radius: 0px; box-shadow: 0px 0px #00ff00,#ff4d4d,#c56cf0; }.ytLink { display: none;}#smallLinks { display: none;}#linksContainer2 { background-color: rgba(63,69,77,255); border-top: 5px solid; border-image: linear-gradient(to right,#00ff00,#ff4d4d,#c56cf0,#7f3fbf) 1 1 0 0; height: 18px; top: 0%; color: #00ff00,#ff4d4d,#c56cf0,#c56cf0; transition: 0.3s;}#linksContainer2:hover { box-shadow: 0 0 10px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.7);}#top-wrap-right{ color: #00ff00,#ff4d4d,#c56cf0,#c56cf0;}.check-box {transform: scale(1.1);}.inParty {display: none;}input[type="checkbox"] { position: relative; appearance: none; width: 33px; height: 15.5px; background: #ccc; border-radius: 50px; box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); cursor: cell; top: 7.5px; transition: 0.4s;}input:checked[type="checkbox"] { background: #00ff00,#ff4d4d,#c56cf0;}input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); transform: scale(1.1); transition: 0.4s;}input:checked[type="checkbox"]::after { left: 50%;}#rightCardHolder { left: 0%; top: 0% height: 500px;}#ot-sdk-btn-floating{display: none;} .menuCard { background-color: rgba(63,69,77,255); border-top: 5px solid; border-image: linear-gradient(to right,#00ff00,#ff4d4d,#c56cf0,#000080) 1 0 0 0; color: #900ff00; margin-top:0px; border-radius: 0px; border-bottom: 0px solid red; transition: all 1s; transform: scale(1); box-shadow: 0px 0px #012e38; transform: translateX(0px); } .menuCard:hover { transform: scale(1.05); box-shadow: 0 0 10px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.7); } .menuCard.active { transform: translateX(0px); } #adCard { display: none; }

#promoImgHolder { overflow-y: scroll; -ms-overflow-style: none; scrollbar-width: none; height: 90px; max-height: 90px; }

#wideAdCard { overflow-y:scroll; -ms-overflow-style: none; max-width:728px; max-height:90px; display:inline-block; margin-top:10px; }

</style>
    </head>
    <div>
<i class="fa-solid fa-rectangle-list"style="font-size: 25px";></i><p>Update log:</p> <div style="font-size: 15px"> Special version:</div><div style="font-size:20px">
</div><br>

<div style="font-size: 15px"> Update:</div><div style="font-size: 19px"></div><br>
<div style="font-size: 15px"> ~ All updated in mod ~</div><div style="font-size: 15px"></div><br>
</div><br>


`
    document.getElementById("loadingText").innerHTML = "alpha";
    document.getElementById("storeHolder").style = "height: 500px; width: 435px;";
    document.getElementById('diedText').style = "text-shadow:#020102  2px 2px 40px;";
    document.getElementById('loadingText').style = "text-shadow: #ed153e 2px 2px 40px;";
    document.getElementById('enterGame').innerHTML = 'Enter alpha';
    document.getElementById('enterGame').style.color = 'text-shadow: black 1px 1px 40px;';
    document.getElementById('nameInput').placeholder =  "alpha best";
    document.getElementById('diedText').innerHTML = 'try again noob';
    document.getElementById("leaderboard").append ('RANK . alpha');
    document.querySelector("#gameName").innerHTML = "Project alpha";
    document.querySelector("#gameUI").style.background = "color(prophoto-rgb 3% 3% 3%);";
    document.querySelector("#gameUI").style.opacity = "100%";
    document.querySelector("#mainMenu").style.background = "color(prophoto-rgb 3% 3% 3%)";
    document.getElementById("mainMenu").style.backgroundImage ="url('https://preview.redd.it/84hv0wqe46p61.jpg?width=1080&crop=smart&auto=webp&s=84add9c5c7e66fa0dfbba49877345864a77dfa6a')";
    document.querySelector("#mainMenu").style.opacity = "100%";


var theStyleToUse = `
                .select {
                  transition: transform .7s;
                  background-color:  rgba(0,0,0,.3);
                  border-radius: 100px;
                  color: white;
                  border: 2px outset lightgray;
                  transition: transform .7s;
                }
                .select:hover {
                  background-color: linear-gradient(135deg, #25CCF7, #1B9CFC);
                  transition-duration: 1500ms;
                  transform: scale(1.05);
                  transition-timing-function: linear;
                  border: 2px inset lightgray;
                }
                .flashit{
                    -webkit-animation: flash ease-out 6s infinite;
                    -moz-animation: flash ease-out 6s infinite;
                    animation: flash ease-out 6s infinite;
                    animation-delay: 2s;
                    border: 2px outset lightgray;
                }
                @-webkit-keyframes flash {
                    0% { opacity: 1; }
                    2% { opacity: 0; }
                    3% { opacity: 0.6; }
                    4% { opacity: 0.2; }
                    6% { opacity: 0.9; }
                    100% { opacity: 1; }
                }
                @keyframes flash {
                    0% { opacity: 1; }
                    2% { opacity: 0; }
                    3% { opacity: 0.6; }
                    4% { opacity: 0.2; }
                    6% { opacity: .9; }
                    100% { opacity: 1; }
                }
                .input {
                  transition: transform .7s;
                  background-color: rgb(0,0,0,.3);
                  border-radius: 100px;
                  border: 2px outset lightgray;
                  color: white;
                }
                .input:hover {
                  transition: transform .7s;
                  transform: scale(1.05) rotate(-1deg);
                  border: 2px inset lightgray;
                }
                ::placeholder {
                  color: white;
                  border: 2px outset lightgray;
                }
                .indent {
                    margin-left: 30px;
                    border: 2px outset lightgray;
                }
                ::-webkit-scrollbar {
                  -webkit-appearance: none;
                   width: 10px;
                   border: 2px outset lightgray;
                }
                ::-webkit-scrollbar-thumb {
                  border-radius: 5px;
                  background-color: rgba(0,0,0,.5);
                  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
                  border: 2px inset lightgray;
                }
                .menuCard {
                  transition: transform .7s;
                  border: 2px outset lightgray;
                }
                .menuCard:hover {
                       transform: scale(1.05);
                       border: 2px inset lightgray;
                }
                div#enterGame.menuButton {
                  transition: transform .7s;
                  border: 2px inset lightgray;
                }
                div#enterGame.menuButton:hover {
                       transform: scale(1.05);
                       border: 2px outset lightgray;
                }
                #nameInput {
                  transition: transform .7s;
                  box-shadow: inset 0 0px 10px rgba(75, 75, 75,1.2);
                  border: 2px outset lightgray;
                }
                #nameInput:hover {
                       transform: scale(1.05);
                       box-shadow: outset 0 0px 10px rgba(209, 216, 224,1.2);
                       border: 2px inset lightgray;
                }
                #negr {
                       transition: transform .7s;
                       border: 2px inset lightgray;
                       box-shadow: 0px 0px 20px 10px #000000;
                }
                #negr:hover {
                       transform: scale(1.05);
                       border: 2px outset lightgray;
                       box-shadow: 0px 0px 20px 10px #000000;
                }
                #modMenus {
                   transition: transform .7s;
                   box-shadow: 0px 0px 20px 10px #000000;
                   border: 2px inset lightgray;
                }
                #modMenus:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                #leaderboard {
	               background-color: rgba(0, 0, 0, 0.5);
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                .leaderHolder:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                #allianceButton {
	background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   box-shadow: 0px 0px 5px 3px #000000;
                   border: 2px inset lightgray;
}

#storeButton {
	background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px inset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
}

#chatButton {
	background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
}
#allianceButton {
transition: transform .7s;
border: 2px inset lightgray;

}
#allianceButton:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                #storeButton:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                #chatButton:hover {
                   transform: scale(1.05);
                   border: 2px inset lightgray;
                }
                #storeHolder {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #storeHolder:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                .storeTab {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px inset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                .storeTab:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }

                #allianceHolder {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px inset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #allianceHolder:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                .allianceButtonM {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                .allianceButtonM:hover {
                   transform: scale(1.05);
                   border: 2px inset lightgray;
                }
                #allianceInput {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px inset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #allianceInput:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                #mapDisplay {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #mapDisplay:hover {
                   transform: scale(1.05);
                   border: 2px inset lightgray;
                }
                .actionBarItem {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px inset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                .actionBarItem:hover {
                   transform: scale(1.05);
                   border: 2px outset lightgray;
                }
                #scoreDisplay {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px inset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #scoreDisplay:hover {
transform: scale(1.05);
border: 2px outset lightgray;
                }
                #stoneDisplay {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #stoneDisplay:hover {
transform: scale(1.05);
border: 2px inset lightgray;
                }
                #woodDisplay {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #woodDisplay:hover {
transform: scale(1.05);
border: 2px inset lightgray;
                }
                #foodDisplay {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #foodDisplay:hover {
transform: scale(1.05);
border: 2px inset lightgray;
                }
                #ageBar {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #ageBar:hover {
transform: scale(1.05);
border: 2px outset lightgray;
                }
                #killCounter {
	               background-color: rgba(0, 0, 0, 0.5);
                   transition: transform .7s;
                   border: 2px outset lightgray;
                   box-shadow: 0px 0px 5px 3px #000000;
                }
                #killCounter:hover {
transform: scale(1.05);
border: 2px inset lightgray;
                }

                .switch {
                   transition: transform .7s;
                   background-color: rgb(0,0,0,.3);
                   border-radius: 100px;
                   border: 2px outset lightgray;
                   margin-right: 15px;
                   position: relative;
                   display: inline-block;
                   width: 30px;
                   height: 15px;
                }
                .switch:hover {
                   transform: scale(1.05);
                   border: 2px inset lightgray;
                }
                .switch input {
                   opacity: 0;
                   width: 0;
                   height: 0;
                }
                .slider {
                   position: absolute;
                   cursor: pointer;
                   top: 0;
                   left: 0;
                   right: 0;
                   bottom: 0;
                   border: 2px inset lightgray;
                   background-color: rgb(0,0,0,.3);
                   -webkit-transition: .4s;
                   transition: .4s;
                }
                .slider:before {
                   position: absolute;
                   content: "";
                   height: 15px;
                   width: 15px;
                   left: 0px;
                   bottom: 0.5px;
                   border: 2px outset lightgray;
                   background-color: white;
                   -webkit-transition: .4s;
                   transition: .4s;
                }
                input:checked + .slider {
                   background-color: #000000;
                }
                input:checked + .slider:before {
                   -webkit-transform: translateX(15px);
                   -ms-transform: translateX(15px);
                   transform: translateX(15px);
                }
                .slider.round {
                   border-radius: 34px;
                   border: 2px inset lightgray;
                }
                .slider.round:before {
                   border-radius: 50%;
                   border: 2px outset lightgray;
                }`;
                var styleItem = document.createElement("style");
                styleItem.type = "text/css";
                styleItem.appendChild(document.createTextNode(theStyleToUse));
                document.head.appendChild(styleItem);