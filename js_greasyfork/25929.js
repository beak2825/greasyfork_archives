// ==UserScript==
// @name         koplak robot klik & RainAlert
// @namespace    https://www.999dice.com/
// @version      0.4a
// @description  Tools: Autoclicker, markets exchange infos, command, rain alert and option in account tab for 999dice chatroom
// @author       NaughtySanta mod by MoeMoney
// @match        https://www.999dice.com/
// @include      https://www.999dice.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25929/koplak%20robot%20klik%20%20RainAlert.user.js
// @updateURL https://update.greasyfork.org/scripts/25929/koplak%20robot%20klik%20%20RainAlert.meta.js
// ==/UserScript==
var rainalert = {};
var repeat = 1;
var d;
var Player;
rainalert = new Audio();
rainalert.src = 'http://www.buddhanet.net/filelib/audio/tinsha.wav';
rainalert.volume = 0.3;
var t;
var result;
var Search;
var el1 = document.getElementById('ChatTab');
var el2 = document.getElementById('ChatTabOtherRooms');
function soundz() {
    rainalert.play();
}
function testSound() {
    rainalert.volume = Number(((document.getElementById('SoundVolume').value) / 100).toFixed(2));
    soundz();
}
function ActiveChat() {
    ClickId('MinBetButton');
    document.getElementById('AutoBetSizeInput').value = "0.00000001";
    var evt = window.document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    if (document.getElementsByClassName("BetsTable")[0].children[1].innerHTML.length > 5000) {
        document.getElementById("ContentTabsContainer").children[2].dispatchEvent(evt);
        clearInterval(ChatVar);
    }
}
function ChronoTimer() {
    var t = new Date();
    var chrono = t - d;
    chrono = Math.floor(chrono / 1000);
    var second = chrono % 60;
    chrono = Math.floor((chrono - second) / 60);
    var minute = chrono % 60;
    chrono = Math.floor((chrono - minute) / 60);
    var hour = chrono % 24;
    if (!d) {
        document.getElementById("RainTimer").innerText = "No Data Yet!";
    } else {
        document.getElementById("RainTimer").innerText = "Last Rain : " + hour + " hours " + minute + " minutes " + second + " seconds";
    }
}
function ClickSend() {
    var evt = window.document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.getElementById("ChatTabSendButton").dispatchEvent(evt);
}
function ClickId(id) {
    var evt = window.document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.getElementById(id).dispatchEvent(evt);
}
function RainWarning() {
    if (NotifEnable === true) {
        document.getElementById("ChatTabText").value = NotifMessage;
        ClickSend();
    }
}
function ShowBalance() {
    document.getElementById("ChatTabText").value = "/balance";
    ClickSend();
}
function ShowAddy() {
    document.getElementById("ChatTabText").value = "/deposit";
    ClickSend();
}
function ShowClear() {
    document.getElementById("ChatTabText").value = "/clear";
    ClickSend();
}
function ShowHelp() {
    document.getElementById("ChatTabText").value = "/help";
    ClickSend();
}
function ShowRules() {
    document.getElementById("ChatTabText").value = "===>Sabar Ya Bro<===";
    ClickSend();
}
function ShowRainTimer() {
    document.getElementById("ChatTabText").value = document.getElementById("RainTimer").innerText;
    ClickSend();
}
function ShowStats() {
    var crypto;
    if (document.getElementById("DisplayCurrencies").children[0].classList.length == 1) {
        crypto = "Btc";
    } else if (document.getElementById("DisplayCurrencies").children[1].classList.length == 1) {
        crypto = "Doge";
    } else {
        crypto = "Ltc";
    }
    document.getElementById("ChatTabText").value = crypto + " Stats: Bets " + document.getElementById("StatsUserBetCount").innerHTML + " | Wagered " + document.getElementById("StatsUserBetPayIn").innerHTML + " | Profit " + document.getElementById("StatsUserBetProfit").innerHTML;
    ClickSend();
}
function SendCommand(type) {
    if (type === 'Clear') {
        ShowClear();
    }
    if (type === 'Help') {
        ShowHelp();
    }
    if (type === 'Rules') {
        ShowRules();
    }
    if (type === 'Stats') {
        ShowStats();
    }
}
function SaveData() {
    var params = d;
    localStorage.setItem("DataDice", params);
}
function LoadData() {
    var dataDice = localStorage.getItem("DataDice");
    d = new Date(dataDice);
}
function setOption() {
    rainalert.src = elO1.value;
    rainalert.volume = Number(elO2.value) / 100;
    NotifEnable = elO3.checked;
    NotifMessage = elO4.value;
}
function SaveO() {
    localStorage.setItem('SoundU', elO1.value);
    localStorage.setItem('SoundV', elO2.value);
    localStorage.setItem('NotifR', elO3.checked);
    localStorage.setItem('NotifM', elO4.value);
    loadO();
}
function loadO() {
    elO1.value = localStorage.getItem('SoundU');
    elO2.value = localStorage.getItem('SoundV');
    if (localStorage.getItem('NotifR') === "true") {
        elO3.checked = true;
    } else {
        elO3.checked = false;
    }
    elO4.value = localStorage.getItem('NotifM');
    setOption();
}
function onLoad() {
    if (!!localStorage.SoundV) {
        loadO();
    } else {
        SaveO();
    }
}
function clickMe() {
    var type = document.getElementById('AutoHighLow').value;
    var test = !!(document.getElementById('AutoBetsActionBoxSet').style.display === "block");
    if (!!type.match(/low/i)) {
        if (test === false) {
            ClickId('BetLowButton');
        } else {
            ClickId('AutoBetLowButton');
        }
    }
    if (!!type.match(/high/i)) {
        if (test === false) {
            ClickId('BetHighButton');
        } else {
            ClickId('AutoBetHighButton');
        }
    }
    if (!!type.match(/rswap/i)) {
        var rnd = Math.random();
        if (rnd < 0.5) {
            if (test === false) {
                ClickId('BetLowButton');
            } else {
                ClickId('AutoBetLowButton');
            }
        } else {
            if (test === false) {
                ClickId('BetHighButton');
            } else {
                ClickId('AutoBetHighButton');
            }
        }
    }
    //if (!!type.match(/swapme/i)) {}
    //<option value="SwapMe">Swap</option>
}
function autoClicker() {
    var temp = document.getElementById('ClickDelay');
    click = window.setInterval(clickMe, temp * 1000);
}
function autoClickStop() {
    clearInterval(click);
}
function cryptoRequest(type) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://www.cryptonator.com/api/full/" + type, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var temp = JSON.parse(xmlhttp.responseText);
            var el = document.getElementById('CryptoMarket')
            el.innerHTML = '<span style="color: green; margin-left: 2px;">Average: ' + temp.ticker.price + '</span><br>';
            for (i = 0; i < temp.ticker.markets.length; i++) {
                el.innerHTML += (i + 1) + '|' + temp.ticker.markets[i].market + ' | ' + temp.ticker.markets[i].price + '<br>';
            }
        }
    }
}
function stopRequest() {
    clearInterval(priceUp);
}
function startRequest(type) {
    if (!type.match(/empty/i)) {
        stopRequest();
        priceUp = window.setInterval(function () {
            cryptoRequest(type);
        }, 30000);
        cryptoRequest(type);
    } else {
        stopRequest();
    }
}
function CreateChatButton(type, id, classe, value, context) {
    var button = document.createElement("input");
    button.type = type;
    button.id = id;
    button.className = classe;
    button.value = value;
    context.appendChild(button);
}
function CreateNewInput(id, value, context) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.maxlength = "20";
    input.className = "StandardTextBox";
    input.value = value;
    context.appendChild(input);
}
function CreateObject(type, id, value, context) {
    var div = document.createElement(type);
    div.id = id;
    div.innerText = value;
    context.appendChild(div);
}
function CreateObject2(type, id, value, context, child) {
    var div = document.createElement(type);
    div.id = id;
    div.innerText = value;
    context.insertBefore(div, child);
}
function setB() {
    var ObjectInChat = CreateObject('div', 'DivInChat', '', el1.children[0]);
    var ObjectR = CreateObject('span', "RainTimer", "No Rain Data!", document.getElementById("DivInChat"));
    var ObjectSelect = CreateObject('select', 'ActionSelect', '', el1.children[1]);
    var ButtonC = CreateChatButton("button", "BalanceButton", "TextButton", "Balance", el2);
    var ButtonA = CreateChatButton("button", "AddyButton", "TextButton", "Addy", el2);
    document.getElementById("DivInChat").setAttribute("style", "position: absolute; right: 30px; top: 1px; background-color: rgba(255,255,255,0.6); border-style: solid; border-width: 1px; display: block;");
    document.getElementById("RainTimer").setAttribute("style", "float: right; margin-right: 0px; text-align: center; font-size: 120%; color: black;");
    document.getElementById("RainTimer").setAttribute("onclick", "ShowRainTimer();");
    document.getElementById("ActionSelect").innerHTML = '<option value="Empty">-=||O_O||=-</option><option value="Clear">/clear</option><option value="Help">/help</option><option value="Rules">/rules</option><option value="Stats">Show Stats</option>';
    document.getElementById("ActionSelect").setAttribute("onchange", "SendCommand(this.value)");
    document.getElementById("ActionSelect").setAttribute("style", "margin-left: 5px; color: white; background-color: black;");
    document.getElementById("BalanceButton").setAttribute("onclick", "ShowBalance();");
    document.getElementById("BalanceButton").setAttribute("style", "float: right; margin-right: 5px;");
    document.getElementById("AddyButton").setAttribute("onclick", "ShowAddy()");
    document.getElementById("AddyButton").setAttribute("style", "float: right; margin-right: 10px;");
}
function setO() {
    var oPanel = CreateObject('div', 'oPanel', '', document.getElementById('AccountTab'));
    document.getElementById('ChatTabChatContainer').setAttribute("style", "display: inline-block");
    document.getElementById("oPanel").setAttribute("style", "position: relative; width: 400px; height: 330px; top: -1140px; right: -487px; background-color: rgba(0,0,0,0.1); border-style: solid; border-width: 1px; display: inline-block;");
    var temp = '<p style="width: 97.7%; top: -20px; text-align: center; font-size: 150%; margin: 5px; color: black; background-color: rgb(255,255,255); border-bottom-style: solid; display: block;">Script Settings</p><p style="width: 96%; margin-top: 2%; margin-left: 2%; text-align: center; font-size: 120%; color: black; background-color: rgba(255,255,255,.3); border-bottom-style: solid; display: block;">Sound Settings</p><p style="width: 60px; left: 5px; margin-top: 10px; color: white; text-align: right; display: inline-block;">url:</p><input id="SoundUrl" type="url" value="http://www.buddhanet.net/filelib/audio/tinsha.wav" style="width: 310px; margin-left: 10px; display: inline-block;"><br><p style="width: 60px; left: 5px; margin-top: 10px; color: white; text-align: right; display: inline-block;">Volume: </p><input id="SoundVolume" type="number" value="30" min="0" max="100" step="5" style="width: 50px; margin-left: 10px; display: inline-block;"><button type="TextButton" onclick="testSound()" style="margin-left: 170px;">Sound Test</button><br><p style="width: 96%; margin-top: 2%; margin-left: 2%; text-align: center; font-size: 120%; color: black; background-color: rgba(255,255,255,.3); border-bottom-style: solid; display: block;">Rain Notification</p><p style="width: 60px; left: 5px; margin-top: 10px; color: white; text-align: right; display: inline-block;">Enable:</p><input id="RainNotif" type="checkbox" style="margin-left: 10px; display: inline-block;"><input id="NotifVal" type="text" value="====> Thanks for the Rain, Jake <====" style="width: 285px; margin-left: 10px; display: inline-block;"><br>';
    var el = document.getElementById("oPanel");
    el.innerHTML = temp;
    CreateChatButton("button", "SaveSet", "TextButton", "SaveSet", el);
    el = document.getElementById('SaveSet');
    el.setAttribute("onclick", "SaveO();");
    el.setAttribute("style", "position: absolute; right: 20px; bottom: 20px;");
}
function setL() {
    var LeftPanel = CreateObject('div', 'LeftPanel', '', el1.children[0]);
    document.getElementById("LeftPanel").setAttribute("style", "position: absolute; width: 17.5vw; height: 500px; top: -100px; left: -18vw; background-color: rgba(0,0,0,0.2); border-style: solid; border-width: 1px; display: inline-block; overflow: hidden;");
    var temp = '<p style="width: 96%; margin-top: 2%; margin-left: 2%; text-align: center; font-size: 120%; color: black; background-color: rgba(255,255,255,.3); border-bottom-style: solid; display: block;">Auto Clicker V1</p><select id="AutoHighLow" style="margin-left: 2vw; color: white; background-color: black;"><option value="Empty">Choose</option><option value="Low">Low</option><option value="High">High</option><option value="RSwap">Random</option></select><input id="ClickDelay" type="text" value="2.5" style="width: 60px; margin-left: 2vw"><span style="margin-left: 2px;">second(s)</span><br><br><button class="TextButton" onclick="autoClickStop()" style="margin-left: 2vw">Stop Me</button><button class="TextButton" onclick="autoClicker()" style="margin-left: 2vw">Start Me</button><br><br><p style="width: 96%; margin-top: 2%; margin-left: 2%; margin-bottom: 0px; text-align: center; font-size: 120%; color: black; background-color: rgba(255,255,255,.3); border-bottom-style: solid; display: block;">Exchange Infos V0</p><select id="MarketPrice" onchange="startRequest(this.value)" style="margin-bottom: 5px; width: 40%; margin-left: 30%; color: white; background-color: black;"><option value="Empty">-|0_O|-</option><option value="ltc-btc">LTC/BTC</option><option value="doge-btc">DOGE/BTC</option><option value="doge-ltc">DOGE/LTC</option><option value="btc-usd">BTC/USD</option><option value="btc-eur">BTC/EURO</option><option value="ltc-usd">LTC/USD</option><option value="ltc-eur">LTC/EURO</option><option value="doge-usd">DOGE/USD</option><option value="doge-eur">DOGE/EURO</option></select><br><div id="CryptoMarket" style="max-height: 270px; top: 5px; width: 96%; margin-left: 2%; font-size: 110%; border-style: solid; border-width: 1px; overflow: auto;"></div>';
    var el = document.getElementById("LeftPanel");
    el.innerHTML = temp;
}
setB();
setO();
setL();
var ChatVar = window.setInterval(ActiveChat, 1000);
var script = document.createElement('script');
script.type = "text/javascript";
script.appendChild(document.createTextNode('var rainalert = {};\nvar count = 0;\nvar repeat = 1;\nvar d;\nvar Player;\nvar rainalert = new Audio();\nrainalert.src = "http://www.buddhanet.net/filelib/audio/tinsha.wav";\nrainalert.volume = 0.3;\nvar t;\nvar result;\nvar Search;\nvar speech = new Audio();\nvar NotifMessage;\nvar elO1 = document.getElementById("SoundUrl");\nvar elO2 = document.getElementById("SoundVolume");\nvar elO3 = document.getElementById("RainNotif");\nvar elO4 = document.getElementById("NotifVal");\nvar click = "";\nvar priceUp;\n\n' + soundz + '\n' + testSound + '\n' + ActiveChat + '\n' + ChronoTimer + '\n' + ClickSend + '\n' + ClickId + '\n' + RainWarning + '\n' + ShowClear + '\n' + ShowAddy + '\n' + ShowBalance + '\n' + ShowHelp + '\n' + ShowRules + '\n' + ShowRainTimer + '\n' + ShowStats + '\n' + SendCommand + '\n' + clickMe + '\n' + autoClicker + '\n' + autoClickStop + '\n' + cryptoRequest + '\n' + stopRequest + '\n' + startRequest + '\n' + SaveO + '\n' + loadO + '\n' + setOption + '\n' + setL + '\n' + onLoad + '\n' + SaveData + '\n' + LoadData + '\nLoadData();\nwindow.setTimeout(onLoad, 5000);\nwindow.setInterval(function(){\nChronoTimer();\nif (document.getElementsByClassName("Rain").length !== 0 ) {\nif (count === 0 ){\nd = new Date();\nSaveData();\nRainWarning();\n}\nif (count < repeat){\nsoundz();\ncount++;\n}\n}else{\ncount = 0;\n}\n}, 1000);'));
(document.body || document.head || document.documentElement).appendChild(script);