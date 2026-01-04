// ==UserScript==
// @name         Script PÚBLICO 𝔻𝔸ℝ𝕂👑𝕎𝕆𝕃𝔽
// @namespace    http://tampermonkey.net/
// @version        4.0
// @description   MELHOR SCRIPT DE TODOS. -Z-BASE   -X-DEFESA   -P- GENS  -.-UPAR MICROS  -7-UPAR BARRACAS /HOTBAR EM CIMA/   
// @author       𝔻𝔸ℝ𝕂👑𝕎𝕆𝕃𝔽
// @author       𝔻𝔸ℝ𝕂👑𝕎𝕆𝕃𝔽
// @match        http://bloble.io/*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/465455/Script%20P%C3%9ABLICO%20%F0%9D%94%BB%F0%9D%94%B8%E2%84%9D%F0%9D%95%82%F0%9F%91%91%F0%9D%95%8E%F0%9D%95%86%F0%9D%95%83%F0%9D%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/465455/Script%20P%C3%9ABLICO%20%F0%9D%94%BB%F0%9D%94%B8%E2%84%9D%F0%9D%95%82%F0%9F%91%91%F0%9D%95%8E%F0%9D%95%86%F0%9D%95%83%F0%9D%94%BD.meta.js
// ==/UserScript==

//ANTIKICK//
function antikick() {setInterval(function(){if(window.socket){window.socket.emit("2",window.camX,window.camY)}},20000)}antikick();
//FIM//

//SKINS//
enterGame = function() {
socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]),
hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value),
mainCanvas.focus(),
grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
setTimeout(function() {frase();}, 1000);
socket.emit("spawn", {
name: 'DRK'+userNameInput.value,
skin: 26
}, a)}))}
function frase(){
socket.emit("ch", "SCRIPT BASE PUBLICA DE DARK WOLF")}
//SKINS//

/*HOTBAR*/

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoos = false;
window.auto3 = false;
window.auto4 = false;
window.auto5 = false;
window.auto6 = false;
window.traço2 = true;
window.auto7 = false;
window.auto8 = false;
window.auto9 = false;
window.auto11 = false;
window.themeSelect = 0;
window.useTheme = false;
window.skins1 = true;
window.material = false;
window.teste = true;
window.build = false;
window.bt = false;
var theme = 2
window.UIList.push({
  level:0,x:5,html:'<div id=autodef1 onclick=autodefa1()>Auto GENS: <span><span class="botao"> Off</span></div>'},{
    level:0,x:6,html:'<div id=autodef2 onclick=autodefa2()>Auto BASE: <span><span class="botao"> Off</span></div>'},{
    level:0,x:1,html:'<div id=autodef3 onclick=autodefa3()>Auto DEF: <span><span class="botao"> Off</span></div>'},{
});
window.autodefa1 = function () {
   var abcp = document.getElementById('autodef1');
   if (autodef1) {
   autodef1 = false;
   abcp.innerHTML = 'Auto GENS: <span class="botao">Off</span>';
   clearInterval(teste2);
   } else {
   autodef1 = true;
   abcp.innerHTML = 'Auto GENS: <span class="botao">On</span>';
   window.teste2 = setInterval(autodefac1, (150));

        function autodefac1() {

            socket.emit("1",-1.56, 212.03, 3);
 socket.emit("1",-1.31, 243.85, 3);
 socket.emit("1",-1.81, 243.85, 3);
 socket.emit("1",-2.08, 243.85, 3);
 socket.emit("1",-2.35, 243.85, 3);
 socket.emit("1",-1.04, 243.85, 3);
 socket.emit("1",-0.77, 243.85, 3);
 socket.emit("1",-0.5, 243.85, 3);
 socket.emit("1",-2.62, 243.85, 3);
 socket.emit("1",-0.23, 243.85, 3);
 socket.emit("1",-2.9, 243.85, 3);
 socket.emit("1",3.11, 243.85, 3);
 socket.emit("1",0.04, 243.85, 3);
 socket.emit("1",2.84, 243.85, 3);
 socket.emit("1",0.31, 243.85, 3);
 socket.emit("1",2.57, 243.85, 3);
 socket.emit("1",0.58, 243.85, 3);
 socket.emit("1",2.29, 243.85, 3);
 socket.emit("1",0.85, 243.85, 3);
 socket.emit("1",2.01, 243.85, 3);
 socket.emit("1",1.12, 243.85, 3);
 socket.emit("1",1.72, 243.85, 3);
 socket.emit("1",1.41, 243.85, 3);
 socket.emit("1",1.33, 132, 3);
 socket.emit("1",1.84, 132, 3);
 socket.emit("1",1.58, 184.45, 3);
 socket.emit("1",1.05, 180.54, 3);
 socket.emit("1",2.11, 182.1, 3);
 socket.emit("1",2.38, 132, 3);
 socket.emit("1",0.77, 132, 3);
 socket.emit("1",2.66, 180.12, 3);
 socket.emit("1",0.49, 180.12, 3);
 socket.emit("1",2.94, 132, 3);
 socket.emit("1",0.2, 132, 3);
 socket.emit("1",-3.06, 181.63, 3);
 socket.emit("1",-0.06, 183.39, 3);
 socket.emit("1",-0.32, 132, 3);
 socket.emit("1",-2.79, 132, 3);
 socket.emit("1",-2.5, 183.06, 3);
 socket.emit("1",-2.24, 132, 3);
 socket.emit("1",-1.95, 183.47, 3);
 socket.emit("1",-0.59, 181.67, 3);
 socket.emit("1",-0.86, 132, 3);
 socket.emit("1",-1.15, 183.46, 3);
 socket.emit("1",-1.57, 140, 7);
        }
    };
    window.statusBar();
};

window.autodefa2 = function () {
   var abcp = document.getElementById('autodef2');
   if (autodef2) {
   autodef2 = false;
   abcp.innerHTML = 'Auto BASE: <span class="botao">Off</span>';
   clearInterval(teste3);
   } else {
   autodef2 = true;
   abcp.innerHTML = 'Auto BASE: <span class="botao">On</span>';
   window.teste3 = setInterval(autodefac2, (150));

        function autodefac2() {
          socket.emit("1",-1.57, 140, 7);

 socket.emit("1",2.69, 245.85, 4);
 socket.emit("1",2.29, 130, 4);
 socket.emit("1",1.82, 130, 4);

 socket.emit("1",2.26, 190.45, 4);
 socket.emit("1",1.94, 187.25, 4);

 socket.emit("1",0.85, 130, 4);

 socket.emit("1",0.87, 190.65, 4);

 socket.emit("1",1.34, 130, 4);
 socket.emit("1",1.19, 185.44, 4);

socket.emit("1",0.45, 245.85, 4);
 socket.emit("1",-2.57, 245.85, 4);
 socket.emit("1",-0.57, 245.85, 4);
 socket.emit("1",-2.32, 245.85, 4);
 socket.emit("1",-0.82, 245.85, 4);
 socket.emit("1",-0.16, 190.13, 4);
 socket.emit("1",0.38, 130, 4);
 socket.emit("1",2.94, 245.85, 4);
 socket.emit("1",0.2, 245.85, 4);
 socket.emit("1",-1.04, 130, 4);

 socket.emit("1",-0.57, 130, 4);
 socket.emit("1",-0.1, 130, 4);
 socket.emit("1",-1.07, 245.85, 4);
 socket.emit("1",-0.48, 188.68, 4);
 socket.emit("1",-2.66, 188.74, 4);

 socket.emit("1",-2.98, 189.63, 4);
 socket.emit("1",-2.11, 130, 4);
 socket.emit("1",-2.58, 130, 4);
 socket.emit("1",-3.05, 130, 4);
 socket.emit("1",2.76, 130, 4);

 socket.emit("1",-2.07, 245.85, 4);
          socket.emit("1",1.82, 243.85, 3);
  socket.emit("1",0.54, 186.91, 3); socket.emit("1",2.11, 243.85, 3);
 socket.emit("1",0.71, 243.85, 3);
 socket.emit("1",1.02, 243.85, 3);socket.emit("1",1.3, 243.85, 3);
 socket.emit("1",2.43, 243.85, 3);
 socket.emit("1",2.59, 186.73, 3);
 socket.emit("1",-1.18, 188.19, 3);
 socket.emit("1",-2.83, 243.85, 3);
 socket.emit("1",-1.81, 243.85, 3);
 socket.emit("1",-1.96, 187.71, 3);
 socket.emit("1",-1.33, 243.85, 3);
 socket.emit("1",-0.31, 243.85, 3);
            socket.emit("1",1.57, 310, 8);
 socket.emit("1",-3.09, 310, 8);
 socket.emit("1",-0.05, 310, 8);
 socket.emit("1",-2.08, 306, 1);
 socket.emit("1",-1.88, 306, 1);
 socket.emit("1",0.96, 306, 1);
 socket.emit("1",1.36, 306, 1);
 socket.emit("1",0.56, 306, 1);
 socket.emit("1",-1.46, 306, 1);
 socket.emit("1",0.76, 306, 1);
 socket.emit("1",-1.06, 306, 1);
 socket.emit("1",2.18, 306, 1);
 socket.emit("1",2.38, 306, 1);
 socket.emit("1",-1.26, 306, 1);
 socket.emit("1",0.36, 306, 1);
 socket.emit("1",2.58, 306, 1);
 socket.emit("1",-2.48, 306, 1);
 socket.emit("1",-2.68, 306, 1);
 socket.emit("1",0.16, 306, 1);
 socket.emit("1",-2.28, 306, 1);
 socket.emit("1",2.78, 306, 1);
 socket.emit("1",1.98, 306, 1);
 socket.emit("1",-2.88, 306, 1);
 socket.emit("1",1.78, 306, 1);
 socket.emit("1",2.98, 306, 1);
 socket.emit("1",-1.68, 306, 1);
 socket.emit("1",1.16, 306, 1);
 socket.emit("1",-0.46, 306, 1);
 socket.emit("1",-0.66, 306, 1);
 socket.emit("1",-0.86, 306, 1);
 socket.emit("1",-0.26, 306, 1);

 socket.emit("1",-2.32, 183.84, 5);

 socket.emit("1",2.97, 183.32, 5);

 socket.emit("1",-0.82, 182.85, 5);

 socket.emit("1",0.18, 183.81, 5);

 socket.emit("1",-1.57, 210.59, 1);
 socket.emit("1",-3.09, 245.32, 1);
 socket.emit("1",-0.05, 245.65, 1);

 socket.emit("1",1.58, 180.56, 5);


 socket.emit("1",1.56, 244.77, 1);
        }
    };
    window.statusBar();
};

window.autodefa3 = function () {
   var abcp = document.getElementById('autodef3');
   if (autodef3) {
   autodef3 = false;
   abcp.innerHTML = 'Auto DEF: <span class="botao">Off</span>';
   clearInterval(teste3);
   } else {
   autodef3 = true;
   abcp.innerHTML = 'Auto DEF: <span class="botao">On</span>';
   window.teste3 = setInterval(autodefac3, (150));

        function autodefac3() {
          

  window.socket.emit("1",-1.5707963267948966,306,1); window.socket.emit("1",-1.3713050057644116,305.99871650057617,1); window.socket.emit("1",-1.7702876478253817,305.99871650057617,1); window.socket.emit("1",-1.1717919748458334,305.99656207219067,1); window.socket.emit("1",-1.96980067874396,305.99656207219067,1); window.socket.emit("1",-0.9722976573764609,305.9978040770881,1); window.socket.emit("1",-2.169294996213332,305.9978040770881,1); window.socket.emit("1",-0.7728037887806719,305.99644327998317,1); window.socket.emit("1",-2.3687888648091215,305.9964432799833,1); window.socket.emit("1",-0.34879892414432107,305.995884449448,1); window.socket.emit("1",-2.792793729445472,305.9958844494481,1); window.socket.emit("1",-0.1493100776311865,306.0046248016522,1); window.socket.emit("1",-2.992282575958607,306.0046248016523,1); window.socket.emit("1",0.05021787909939028,305.99575438231153,1); window.socket.emit("1",3.091374774490403,305.9957543823117,1); window.socket.emit("1",0.24971048900981396,306.0009223842307,1); window.socket.emit("1",2.8918821645799793,306.0009223842307,1); window.socket.emit("1",0.6737150869381474,305.99765963157313,1); window.socket.emit("1",2.4678775666516457,305.997659631573,1); window.socket.emit("1",0.8732044660392401,306.0055478255255,1); window.socket.emit("1",2.2683881875505536,306.0055478255255,1); window.socket.emit("1",1.0727093327852517,305.9995236924397,1); window.socket.emit("1",2.0688833208045416,305.9995236924397,1); window.socket.emit("1",1.2721964836412307,306.00073856120025,1); window.socket.emit("1",1.8693961699485626,306.00073856120025,1); window.socket.emit("1",1.4717129886970868,306.00085441057183,1); window.socket.emit("1",1.6698796648927066,306.00085441057183,1); window.socket.emit("1",-2.5807913011565895,310.00349159324,1); window.socket.emit("1",-0.5608013524332036,310.00349159324,1); window.socket.emit("1",0.46171449158421607,310.00009935482274,1); window.socket.emit("1",2.6798781620055774,310.00009935482274,1); window.socket.emit("1",-1.5581532402252236,140.0011892806627,1);window.socket.emit("1",-1.0381869001827218,129.99646225955527,1);window.socket.emit("1",-0.5606051834948368,129.99840152863405,1);window.socket.emit("1",-0.09483137554302741,130.00412493455744,1);window.socket.emit("1",0.378263747992487,130.0000623076774,1);window.socket.emit("1",0.846792300154674,129.99901615012323,1);window.socket.emit("1",1.3168436891180217,129.9994788451091,1);window.socket.emit("1",-2.077595975812251,130.00079076682556,1);window.socket.emit("1",-2.548235091841052,130.00140191551802,1);window.socket.emit("1",-3.018201325640385,129.99838498996846,1);window.socket.emit("1",2.7900154561271933,130.00213613629603,1);window.socket.emit("1",2.320015867387845,130.00179883370848,1);window.socket.emit("1",1.8500152100114906,130.0049606745833,1);window.socket.emit("1",-1.2399988326006715,188.0556991957437,1);window.socket.emit("1",-0.9100203508652073,187.10191687954435,1);window.socket.emit("1",-0.5899971268752553,190.50661432086815,1);window.socket.emit("1",-0.2600083386025599,185.42245009706897,1);window.socket.emit("1",0.08992703992265579,182.83879894595668,1);window.socket.emit("1",0.42000721200077995,189.64259674450764,1);window.socket.emit("1",0.7400227835782681,187.68962038429285,1);window.socket.emit("1",1.0800082958012374,181.27770960600768,1);window.socket.emit("1",1.4199736166367345,188.55046274141029,1);window.socket.emit("1",-1.8800127653569898,188.7205812835473,1);window.socket.emit("1",-2.200018923992461,187.98116208811996,1);window.socket.emit("1",-2.5199990495474376,190.26965706596516,1);window.socket.emit("1",-2.850027033342413,184.8307815273205,1);window.socket.emit("1",3.079988969979608,182.8969384653556,1);window.socket.emit("1",2.7500100227749664,190.1209785899494,1);window.socket.emit("1",2.4299916609946726,187.78125838325835,1);window.socket.emit("1",2.0800085392656555,181.0500317591798,1);window.socket.emit("1",1.7400240117034789,188.218678403606,1);window.socket.emit("1",-1.320016909908535,245.85037258462708,1);window.socket.emit("1",-1.0500004819372957,245.8545433788037,1);window.socket.emit("1",-0.48216670551159396,245.8486371733634,1);window.socket.emit("1",-0.23719506853057412,245.85368372265629,1);window.socket.emit("1",0.2799087759535484,245.84825563749706,1);window.socket.emit("1",0.5399032956761737,245.8501145006853,1);window.socket.emit("1",0.8100206101845792,245.8506965619584,1);window.socket.emit("1",1.33000046011322,245.85323772527406,1);window.socket.emit("1",-1.7899946882768454,245.8527455612402,1);window.socket.emit("1",-2.06000474006974,245.84653953228656,1);window.socket.emit("1",-2.629994213153245,245.84756761050124,1);window.socket.emit("1",-2.8800103503481607,245.85344516601734,1);window.socket.emit("1",2.8800103503481607,245.85344516601734,1);window.socket.emit("1",2.619994624090542,245.85246714238997,1);window.socket.emit("1",2.3499819608229444,245.8516300535754,1);window.socket.emit("1",1.8299026079767855,245.84651655046878,1);window.socket.emit("1",1.5799890388779119,245.85038783780692,1);window.socket.emit("1",-1.5600004612898983,212.12236138606428,1);window.socket.emit("1",-0.7599931761263433,243.84667846825377,1);window.socket.emit("1",0.02001373429853195,243.84883514177403,1);window.socket.emit("1",1.070003029633606,243.8549046051769,1);window.socket.emit("1",-3.1399933110945164,243.85031187185297,1);window.socket.emit("1",-2.3599932250008857,243.84753289709528,1);window.socket.emit("1",2.0900238258029606,243.84856796790916,1);

        }
    };
    window.statusBar();
};

//fim//


// Hotbar2 //
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.UIList.push({



})


window.makeUI = function () {
if (window.hasMadeUI) return;
window.hasMadeUI = true;
window.statusItems.sort(function (a, b) {return a.order - b.order;})
var levels = [];
window.UIList.forEach((item) => {
if (!levels[item.level]) levels[item.level] = [];
levels[item.level].push(item)})
levels = levels.filter((a) => {if (a) {a.sort(function (a, b) {return a.x - b.x;})
return true;} else {return false;}})
var headAppend = document.getElementsByTagName("head")[0],style = document.createElement("div");
var toast = document.createElement('div');toast.id = "snackbar";
var css = document.createElement('div');
var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 23;
style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
background-color: rgba(10,10,10, 1.2);\n\
margin-left: 1px;\n\
border-radius:100px;\n\
pointer-events:all\n\
}\n\
#noobscriptUI {\n\
top: -" + (height) + "px;\n\
transition: 1s;\n\
margin-left:10px;\n\
position:absolute;\n\
padding-left:25px;\n\
margin-top:9px;\n\
padding-top:15px;\n\
width:500px;\n\
height: " + height + "px;\n\
font-family:arial;\n\
left:5%\n\
}\n\
#noobscriptUI:hover{\n\
top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
color:white;\n\
padding:7px;\n\
height:19px;\n\
display:inline-block;\n\
background-color: black\n\
cursor:pointer;\n\
font-size:20px\n\
}\n\
</style>"
headAppend.appendChild(style);headAppend.appendChild(css);
var contAppend = document.getElementById("gameUiContainer"),menuA = document.createElement("div");
var code = ['<div id="noobscriptUI">\n'];
levels.forEach((items, i) => {
code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
items.forEach((el) => {
code.push('        ' + el.html + '\n');})
code.push('    </div>\n');})
code.push('    <div id="confinfo" style="margin-top:10px; color: black; text-align: center; font-size: 10px; white-space:pre"></div>')
code.push('</div>');
menuA.innerHTML = code.join("");
contAppend.insertBefore(menuA, contAppend.firstChild)
contAppend.appendChild(toast)}
setTimeout(() => {window.makeUI();}, 1000);
 //FIM HOTBAR//


//CS da Pagina Inicial//
instructionsIndex = 0;
instructionsSpeed = 0;
insturctionsCountdown = 0;
instructionsList = "INSTRUÇÕES: -Z-BASE/-X-DEFESA".split(";");
instructionsIndex = UTILS.randInt(0, instructionsList.length - 1);
document.getElementById("gameTitle").innerHTML = "DARK Script 2023";
document.getElementById("lobbyKey").innerHTML = " ";
document.getElementById("youtubeContainer").innerHTML = '';
document.getElementById("youtuberOf").innerHTML = '';
document.getElementById("smallAdContainer").innerHTML = '';
document.getElementById("infoLinks").innerHTML = '';
document.getElementById("creatorLink").innerHTML = '';
document.getElementById("adContainer").innerHTML = '';
var randomLoadingTexts = ["Loading ..."]
var css = document.createElement("style")
document.getElementById("darkener").innerHTML += `<img id=""><style>
img#foto {

    overflow: hidden;
    margin-left: 0px;
     width: 100%; /* com isso imagem ocupará toda a largura da tela. Se colocarmos height: 100% também, a imagem irá distorcer */
    position: absolute;
}
</style>
`
css.innerText = `
html, body {
	width: 100%; height: 100%; cursor: Crosshair; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }

body {
	background-color: #ffffff; margin: 0; overflow: hidden; cursor: Crosshair; }

canvas {
    image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor; }

.grecaptcha-badge {
    visibility: hidden !important;
}

.material-icons {

}

a:link {
	color: #009bff;text-decoration: none;
}

a:visited {
	color: #009bff;
}

a:hover {
	color: #010b1a;
}

.spanLink {
	cursor: pointer;color: #041d91;
}

.allert {
color: #850000;
}

.botao {
color: #58f761;
}

.spanLink:hover {
	color: #010b1a;
}

.deadLink {
	cursor: auto;
	color: #ffffff;
}

.deadLink:hover {
	color: #ffffff;
}

.horizontalCWrapper {
	width: 100%;text-align: center;
}

.centerContent {
	text-align: center;width: 100%;
}

#twitterFollBt {
	z-index: 200;
}

#shareContainer {
	padding: 5px; width: 100%; position: absolute; top: 10px; left: 10px; position: absolute; z-index: 200; }

#darkener {
	display: block; position: absolute; width: 100%; height: 100%; background-color: #000000;
}

#menuContainer {
	width: 100%; height: 100%; display: flex; position: absolute; top: 10px; z-index: 100; align-items: center; text-align: center;
}
#optionsContainer {
    padding: 10px; position: absolute; right: 1200px; top: 0px; font-family: 'regularF'; text-align: right; color: #009bff; z-index: 100; font-size: 20px; }
#lobbyKey {
	font-size: 20px;

}

#smallAdContainer {
	position: absolute; right: 14px; bottom: 44px; z-index: 100; border: dashed 6px rgba(35, 35, 35, 0.0); }

#twitterFollBt {
	position: absolute;left: 15px;bottom: 40px;
}

#followText {
	position: absolute; left: 15px; bottom: 75px; color: #fff; font-size: 28px; font-family: 'regularF'; }

#youtuberOf {
	z-index: 100; position: absolute; top: 10px; left: 10px; color: #fff; font-size: 20px; font-family: 'regularF'; }

#youtubeContainer {
	margin-top: 5px;
}

#mainCanvas {
	position: absolute;width: 100%;height: 100%;
}

#gameUiContainer {
	position: absolute; width: 100%; height: 100%; display: none; pointer-events: none; }

#adContainer {
	width: 100%; text-align: center; margin-top: 20px; display: inline-block; }

#adHolder {
	display: inline-block;border: dashed 6px rgba(35, 35, 35, 0.0);
}

#leaderboardContainer {
	position: absolute; top: 10px; right: 10px; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 30px; border-radius: 4px; color: #fff;border: 1px solid #041d91; }

.leaderboardItem {
	margin-top: 2px; color: rgba(255, 255, 255); font-family: 'regularF'; font-size: 17px; }

.leaderYou {
	color: #009basdf; display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }

.leader {
	color: rgba(255, 255, 255); display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }

.scoreText {
	color: #c9c9c9; text-align: left; float: right; margin-left: 10px; display: inline-block; }

#statContainer {
	position: absolute;bottom: 10px;left: 10px;
}

#scoreContainer {
	display: inline-block; padding: 10px; background-color: #009000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;}

#unitList {
	text-align: center; width: 100%; position: absolute; bottom: 6px; }

.unitItem {
	pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }

.unitItemA {
	pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }

.unitItem:hover {
	background-color: #00000060;
}

#unitInfoContainer {
	padding: 10px;display: none;
}

.upgradeInfo {
	margin-top: 5px; padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto; cursor: pointer; pointer-events: all;border: 0.5px solid #041d91; }

.upgradeInfo:hover {
	background-color: #000000;
}

.unitInfo {
	padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto;border: 0.5px solid #041d91; }

.unitInfoName {
	font-size: 22px;color: #fff;
}

.unitInfoCost {
	font-size: 16px;color: #fff;
}

.unitInfoDesc {
	font-size: 16px;color: #d1d1d1;
}

.unitInfoType {
	padding-top: 5px; font-size: 16px; color: #b2b2b2; float: left; }

.unitInfoLimit {
	display: inline-block; float: right; text-align: right; padding-top: 5px; font-size: 16px; color: #b2b2b2; }

#chatBox {
    position: absolute; bottom: 10px; right: 10px; width: 250px; overflow: hidden; }


.chatText {
	color: rgba(255, 255, 255);
}

#chatList {
	width: 100%; font-family: 'regularF'; padding: 8px; margin: 0; list-style: none; box-sizing: border-box; color: #fff; overflow: hidden; word-wrap: break-word; position: absolute; bottom: 30px; font-size: 16px; line-height: 23px;
}

#chatInput {
	background-color: #000000; font-family: 'regularF'; font-size: 16px; padding: 5px; color: #fff; width: 100%; pointer-events: all; outline: none; border: 0; box-sizing: border-box; border-radius: 0px 0px 4px 4px;border: 1px solid #041d91; }

#sellButton {
	display: none; position: absolute; bottom: 65px; left: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; font-size: 20px; color: #fff; cursor: pointer; padding: 2px; pointer-events: all;border: 0.5px solid #041d91; }

#sellButton:hover {
	background-color: #000000;

}

.greyMenuText {
color:#010409
}

.whiteText {
	color: #fff;
}

#userNameInput {
	font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 12px; border: none; border-radius: 4px; margin-left: 10px; background-color: #010409; color: #f9f9f9; border: 2px solid #041d91; border-radius: 10px;
}

#enterGameButton {
	font-family: 'regularF'; font-size: 26px; padding: 5px; color: #ffffff; background-color: #010409; border: none; cursor: pointer; margin-left: 10px; border-radius: 4px; border: 2px solid #041d91; border-radius: 10px; }

#enterGameButton:hover {
	background-color: #010b1a;
}

#loadingContainer {
	display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; color: #FFFFFF; }

#gameTitle {
	color: #b1b1b1; font-size: 100px; width: 100%; text-align: center; font-family: 'regularF';text-shadow: 1px 0px 0px #041d91, -1px 0px 0px #041d91, 0px 1px 0px #041d91, 0px -1px 0px #041d91; }

#instructionsText {
	font-size: 30px; width: 400px; text-align: center; font-family: 'regularF'; margin-top: 20px; display: inline-block;text-shadow: 1px 0px 0px #041d91, -1px 0px 0px #041d91, 0px 1px 0px #041d91, 0px -1px 0px #041d91; }

#creatorLink {
	z-index: 1000; position: absolute; bottom: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-left: 10px; margin-bottom: 5px; padding: 5px; }

#infoLinks {
	z-index: 1000; position: absolute; bottom: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-right: 10px; margin-bottom: 5px; }

#infoLinks2 {
	z-index: 1000; position: absolute; top: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #007as34; padding: 5px; margin-right: 10px; margin-bottom: 5px; }


#joinTroopContainer {
    display: inline-block; padding: 10px; background-color:#000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;}

#skinSelector {
	display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 10px; padding-right: 10px; border: none; border-radius: 4px; background-color: #010409; color: #ffffff; cursor: pointer; border: 2px solid #041d91; border-radius: 30px; }

#skinSelector:hover {
    background-color: #808080;color: #ffffff;
}

    #menuContainer {
	background: url("https://i.imgyukle.com/2020/02/20/nswLqh.gif") no-repeat center;
    top: 0px;
}
`
document.head.appendChild(css)
var loadedBase = null;
var defendInterval = null;
var joinEnabled = true
var joinTroopsDiv = document.createElement("div")
joinTroopsDiv.id = "joinTroopContainer"
document.getElementById("statContainer").appendChild(joinTroopsDiv)
joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")

//FIM DO CS//

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 88) {//DEF
window.socket.emit("1",-1.5707963267948966,306,1); window.socket.emit("1",-1.3713050057644116,305.99871650057617,1); window.socket.emit("1",-1.7702876478253817,305.99871650057617,1); window.socket.emit("1",-1.1717919748458334,305.99656207219067,1); window.socket.emit("1",-1.96980067874396,305.99656207219067,1); window.socket.emit("1",-0.9722976573764609,305.9978040770881,1); window.socket.emit("1",-2.169294996213332,305.9978040770881,1); window.socket.emit("1",-0.7728037887806719,305.99644327998317,1); window.socket.emit("1",-2.3687888648091215,305.9964432799833,1); window.socket.emit("1",-0.34879892414432107,305.995884449448,1); window.socket.emit("1",-2.792793729445472,305.9958844494481,1); window.socket.emit("1",-0.1493100776311865,306.0046248016522,1); window.socket.emit("1",-2.992282575958607,306.0046248016523,1); window.socket.emit("1",0.05021787909939028,305.99575438231153,1); window.socket.emit("1",3.091374774490403,305.9957543823117,1); window.socket.emit("1",0.24971048900981396,306.0009223842307,1); window.socket.emit("1",2.8918821645799793,306.0009223842307,1); window.socket.emit("1",0.6737150869381474,305.99765963157313,1); window.socket.emit("1",2.4678775666516457,305.997659631573,1); window.socket.emit("1",0.8732044660392401,306.0055478255255,1); window.socket.emit("1",2.2683881875505536,306.0055478255255,1); window.socket.emit("1",1.0727093327852517,305.9995236924397,1); window.socket.emit("1",2.0688833208045416,305.9995236924397,1); window.socket.emit("1",1.2721964836412307,306.00073856120025,1); window.socket.emit("1",1.8693961699485626,306.00073856120025,1); window.socket.emit("1",1.4717129886970868,306.00085441057183,1); window.socket.emit("1",1.6698796648927066,306.00085441057183,1); window.socket.emit("1",-2.5807913011565895,310.00349159324,1); window.socket.emit("1",-0.5608013524332036,310.00349159324,1); window.socket.emit("1",0.46171449158421607,310.00009935482274,1); window.socket.emit("1",2.6798781620055774,310.00009935482274,1); window.socket.emit("1",-1.5581532402252236,140.0011892806627,1);window.socket.emit("1",-1.0381869001827218,129.99646225955527,1);window.socket.emit("1",-0.5606051834948368,129.99840152863405,1);window.socket.emit("1",-0.09483137554302741,130.00412493455744,1);window.socket.emit("1",0.378263747992487,130.0000623076774,1);window.socket.emit("1",0.846792300154674,129.99901615012323,1);window.socket.emit("1",1.3168436891180217,129.9994788451091,1);window.socket.emit("1",-2.077595975812251,130.00079076682556,1);window.socket.emit("1",-2.548235091841052,130.00140191551802,1);window.socket.emit("1",-3.018201325640385,129.99838498996846,1);window.socket.emit("1",2.7900154561271933,130.00213613629603,1);window.socket.emit("1",2.320015867387845,130.00179883370848,1);window.socket.emit("1",1.8500152100114906,130.0049606745833,1);window.socket.emit("1",-1.2399988326006715,188.0556991957437,1);window.socket.emit("1",-0.9100203508652073,187.10191687954435,1);window.socket.emit("1",-0.5899971268752553,190.50661432086815,1);window.socket.emit("1",-0.2600083386025599,185.42245009706897,1);window.socket.emit("1",0.08992703992265579,182.83879894595668,1);window.socket.emit("1",0.42000721200077995,189.64259674450764,1);window.socket.emit("1",0.7400227835782681,187.68962038429285,1);window.socket.emit("1",1.0800082958012374,181.27770960600768,1);window.socket.emit("1",1.4199736166367345,188.55046274141029,1);window.socket.emit("1",-1.8800127653569898,188.7205812835473,1);window.socket.emit("1",-2.200018923992461,187.98116208811996,1);window.socket.emit("1",-2.5199990495474376,190.26965706596516,1);window.socket.emit("1",-2.850027033342413,184.8307815273205,1);window.socket.emit("1",3.079988969979608,182.8969384653556,1);window.socket.emit("1",2.7500100227749664,190.1209785899494,1);window.socket.emit("1",2.4299916609946726,187.78125838325835,1);window.socket.emit("1",2.0800085392656555,181.0500317591798,1);window.socket.emit("1",1.7400240117034789,188.218678403606,1);window.socket.emit("1",-1.320016909908535,245.85037258462708,1);window.socket.emit("1",-1.0500004819372957,245.8545433788037,1);window.socket.emit("1",-0.48216670551159396,245.8486371733634,1);window.socket.emit("1",-0.23719506853057412,245.85368372265629,1);window.socket.emit("1",0.2799087759535484,245.84825563749706,1);window.socket.emit("1",0.5399032956761737,245.8501145006853,1);window.socket.emit("1",0.8100206101845792,245.8506965619584,1);window.socket.emit("1",1.33000046011322,245.85323772527406,1);window.socket.emit("1",-1.7899946882768454,245.8527455612402,1);window.socket.emit("1",-2.06000474006974,245.84653953228656,1);window.socket.emit("1",-2.629994213153245,245.84756761050124,1);window.socket.emit("1",-2.8800103503481607,245.85344516601734,1);window.socket.emit("1",2.8800103503481607,245.85344516601734,1);window.socket.emit("1",2.619994624090542,245.85246714238997,1);window.socket.emit("1",2.3499819608229444,245.8516300535754,1);window.socket.emit("1",1.8299026079767855,245.84651655046878,1);window.socket.emit("1",1.5799890388779119,245.85038783780692,1);window.socket.emit("1",-1.5600004612898983,212.12236138606428,1);window.socket.emit("1",-0.7599931761263433,243.84667846825377,1);window.socket.emit("1",0.02001373429853195,243.84883514177403,1);window.socket.emit("1",1.070003029633606,243.8549046051769,1);window.socket.emit("1",-3.1399933110945164,243.85031187185297,1);window.socket.emit("1",-2.3599932250008857,243.84753289709528,1);window.socket.emit("1",2.0900238258029606,243.84856796790916,1);

 }
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 90) {//BASE
 socket.emit("1",-1.57, 140, 7);

 socket.emit("1",2.69, 245.85, 4);
 socket.emit("1",2.29, 130, 4);
 socket.emit("1",1.82, 130, 4);

 socket.emit("1",2.26, 190.45, 4);
 socket.emit("1",1.94, 187.25, 4);

 socket.emit("1",0.85, 130, 4);

 socket.emit("1",0.87, 190.65, 4);

 socket.emit("1",1.34, 130, 4);
 socket.emit("1",1.19, 185.44, 4);

socket.emit("1",0.45, 245.85, 4);
 socket.emit("1",-2.57, 245.85, 4);
 socket.emit("1",-0.57, 245.85, 4);
 socket.emit("1",-2.32, 245.85, 4);
 socket.emit("1",-0.82, 245.85, 4);
 socket.emit("1",-0.16, 190.13, 4);
 socket.emit("1",0.38, 130, 4);
 socket.emit("1",2.94, 245.85, 4);
 socket.emit("1",0.2, 245.85, 4);
 socket.emit("1",-1.04, 130, 4);

 socket.emit("1",-0.57, 130, 4);
 socket.emit("1",-0.1, 130, 4);
 socket.emit("1",-1.07, 245.85, 4);
 socket.emit("1",-0.48, 188.68, 4);
 socket.emit("1",-2.66, 188.74, 4);

 socket.emit("1",-2.98, 189.63, 4);
 socket.emit("1",-2.11, 130, 4);
 socket.emit("1",-2.58, 130, 4);
 socket.emit("1",-3.05, 130, 4);
 socket.emit("1",2.76, 130, 4);

 socket.emit("1",-2.07, 245.85, 4);
          socket.emit("1",1.82, 243.85, 3);
  socket.emit("1",0.54, 186.91, 3); socket.emit("1",2.11, 243.85, 3);
 socket.emit("1",0.71, 243.85, 3);
 socket.emit("1",1.02, 243.85, 3);socket.emit("1",1.3, 243.85, 3);
 socket.emit("1",2.43, 243.85, 3);
 socket.emit("1",2.59, 186.73, 3);
 socket.emit("1",-1.18, 188.19, 3);
 socket.emit("1",-2.83, 243.85, 3);
 socket.emit("1",-1.81, 243.85, 3);
 socket.emit("1",-1.96, 187.71, 3);
 socket.emit("1",-1.33, 243.85, 3);
 socket.emit("1",-0.31, 243.85, 3);
            socket.emit("1",1.57, 310, 8);
 socket.emit("1",-3.09, 310, 8);
 socket.emit("1",-0.05, 310, 8);
 socket.emit("1",-2.08, 306, 1);
 socket.emit("1",-1.88, 306, 1);
 socket.emit("1",0.96, 306, 1);
 socket.emit("1",1.36, 306, 1);
 socket.emit("1",0.56, 306, 1);
 socket.emit("1",-1.46, 306, 1);
 socket.emit("1",0.76, 306, 1);
 socket.emit("1",-1.06, 306, 1);
 socket.emit("1",2.18, 306, 1);
 socket.emit("1",2.38, 306, 1);
 socket.emit("1",-1.26, 306, 1);
 socket.emit("1",0.36, 306, 1);
 socket.emit("1",2.58, 306, 1);
 socket.emit("1",-2.48, 306, 1);
 socket.emit("1",-2.68, 306, 1);
 socket.emit("1",0.16, 306, 1);
 socket.emit("1",-2.28, 306, 1);
 socket.emit("1",2.78, 306, 1);
 socket.emit("1",1.98, 306, 1);
 socket.emit("1",-2.88, 306, 1);
 socket.emit("1",1.78, 306, 1);
 socket.emit("1",2.98, 306, 1);
 socket.emit("1",-1.68, 306, 1);
 socket.emit("1",1.16, 306, 1);
 socket.emit("1",-0.46, 306, 1);
 socket.emit("1",-0.66, 306, 1);
 socket.emit("1",-0.86, 306, 1);
 socket.emit("1",-0.26, 306, 1);

 socket.emit("1",-2.32, 183.84, 5);

 socket.emit("1",2.97, 183.32, 5);

 socket.emit("1",-0.82, 182.85, 5);

 socket.emit("1",0.18, 183.81, 5);

 socket.emit("1",-1.57, 210.59, 1);
 socket.emit("1",-3.09, 245.32, 1);
 socket.emit("1",-0.05, 245.65, 1);

 socket.emit("1",1.58, 180.56, 5);


 socket.emit("1",1.56, 244.77, 1);
 }
})


//lag//
function LAG(){
lag()
lag2()
}
function lag(){var a = player.x + targetDst * MathCOS(targetDir) + camX,d = player.y + targetDst * MathSIN(targetDir) + camY;for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), e, 0, -1)}
function lag2(){var a = player.x + targetDst * MathCOS(targetDir) + camX,d = player.y + targetDst * MathSIN(targetDir) + camY;for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -1)}
//Teclas//
addEventListener("keydown", function(a){
a = a.keyCode ? a.keyCode : a.which;
if(a == 16){LAG();}})


addEventListener('keydown', a => {
a = a.keyCode;
if (a == 55) {//Up Barrack
const my = {};
my.UPbarracks = window.units.filter(unit => unit.owner == window.player.sid && unit.type == 2 && unit.uPath == 8)
my.UPbarracks.forEach(barracksID => {window.socket.emit("4",barracksID.id,0)})
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 190){
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
})

addEventListener('keydown', a => {
a = a.keyCode;
   if (a === 69) {/*Commander e soldiers*/
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); unit.info.name !== 'Siege Ram' && selUnits.push(unit)  } });  selUnitType = "Unit";
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 67) {//Commander
window.socket.emit("4",0,0,1)
window.selUnits = [];
window.units.every((unit) => {
if (unit.owner === window.player.sid && unit.type === 1) {
if (!unit.info) unit.info = window.getUnitFromPath(unit.uPath);
if (unit.info.name === 'Commander') {
window.selUnits.push(unit);
return false;
}}
return true;
});
window.selUnitType = "Unit";
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 81) {//Soldiers
window.selUnits = [];
window.units.forEach((unit) => {
if (unit.owner === window.player.sid && unit.type === 1) {
if (!unit.info) unit.info = window.getUnitFromPath(unit.uPath);
if (unit.info.name === 'Soldier') {
window.selUnits.push(unit);
return false;
}}
return true;
});
window.selUnitType = "Unit";
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 80) {//gens

            socket.emit("1",-1.56, 212.03, 3);
 socket.emit("1",-1.31, 243.85, 3);
 socket.emit("1",-1.81, 243.85, 3);
 socket.emit("1",-2.08, 243.85, 3);
 socket.emit("1",-2.35, 243.85, 3);
 socket.emit("1",-1.04, 243.85, 3);
 socket.emit("1",-0.77, 243.85, 3);
 socket.emit("1",-0.5, 243.85, 3);
 socket.emit("1",-2.62, 243.85, 3);
 socket.emit("1",-0.23, 243.85, 3);
 socket.emit("1",-2.9, 243.85, 3);
 socket.emit("1",3.11, 243.85, 3);
 socket.emit("1",0.04, 243.85, 3);
 socket.emit("1",2.84, 243.85, 3);
 socket.emit("1",0.31, 243.85, 3);
 socket.emit("1",2.57, 243.85, 3);
 socket.emit("1",0.58, 243.85, 3);
 socket.emit("1",2.29, 243.85, 3);
 socket.emit("1",0.85, 243.85, 3);
 socket.emit("1",2.01, 243.85, 3);
 socket.emit("1",1.12, 243.85, 3);
 socket.emit("1",1.72, 243.85, 3);
 socket.emit("1",1.41, 243.85, 3);
 socket.emit("1",1.33, 132, 3);
 socket.emit("1",1.84, 132, 3);
 socket.emit("1",1.58, 184.45, 3);
 socket.emit("1",1.05, 180.54, 3);
 socket.emit("1",2.11, 182.1, 3);
 socket.emit("1",2.38, 132, 3);
 socket.emit("1",0.77, 132, 3);
 socket.emit("1",2.66, 180.12, 3);
 socket.emit("1",0.49, 180.12, 3);
 socket.emit("1",2.94, 132, 3);
 socket.emit("1",0.2, 132, 3);
 socket.emit("1",-3.06, 181.63, 3);
 socket.emit("1",-0.06, 183.39, 3);
 socket.emit("1",-0.32, 132, 3);
 socket.emit("1",-2.79, 132, 3);
 socket.emit("1",-2.5, 183.06, 3);
 socket.emit("1",-2.24, 132, 3);
 socket.emit("1",-1.95, 183.47, 3);
 socket.emit("1",-0.59, 181.67, 3);
 socket.emit("1",-0.86, 132, 3);
 socket.emit("1",-1.15, 183.46, 3);
 socket.emit("1",-1.57, 140, 7);
    }})
//xray
renderPlayer = function(a,d,c,b,g) {
{
b.save();
if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
var e = new Image;
e.onload = function() {
this.readyToDraw = !0;
this.onload = null;
g == currentSkin && changeSkin(0)
};
e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
skinSprites[a.skin] = e
}
a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(0, 0, 0, 0.1)", renderCircle(d,
c, a.size, b));
b.restore()
}
}



//SUS//
playerSkins = 0;cid = UTILS.getUniqueID();localStorage.setItem("cid",cid);upgrInputsToInde
//SUS//


