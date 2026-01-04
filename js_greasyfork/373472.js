// ==UserScript==
// @name         Pixelcanvas Captcha Solving
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Captcha Token Test
// @author       Some Anon
// @match        https://pixelcanvas.io/*
// @match        http://pixelcanvas.io/*
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/373472/Pixelcanvas%20Captcha%20Solving.user.js
// @updateURL https://update.greasyfork.org/scripts/373472/Pixelcanvas%20Captcha%20Solving.meta.js
// ==/UserScript==
htmlFragmentStart = `
<div id="overlay">
<div class="outer">
<div class="middle">
<div class="inner" id="inner">
<button id="solveca">Solve Captchas for Botnet</button><button id="playca">Play Pixelcanvas</button>
</div>
</div>
</div>
</div>
`;

htmlFragmentSolve = `
<div>
<div id="caerror"></div>
<button id="launchca">Solve Captcha</button>
<div id="catext">Solved Captchas: <span id="cntsolved">0</span><br>
Captcha-Server: <input type="text" id="captchasrv" value=""><button id="updcaptchasrv">OK</button><br>
Server-Key: <input type="text" id="apikey" value=""><button id="updkey">OK</button><br>
Discord-ID (optional): <input type="text" id="discordid" value=""><button id="updiscordid">OK</button><br>
Needed Captchas (updates every 9s): <span id="cntserver">0</span>
<br>-------------------------------------------------------------<br>
or let Hohols solve captchas for you:<br>
Key: <input type="text" id="hoholkey" value=""><button id="hoholkeyok">OK</button><br>
Amount of hohols that should work for you: <input type="number" id="hoholnumber" value="5"><button id="hoholnumberok">OK</button><br>
<button id="starthohols">Start Hohols</button>
Captchas solved by hohols: <span id="cnthohol">0</span>
</div>
</div>
`;

cssStyle = `
#overlay{
    opacity:1;
    background-color:#ccc;
    position:fixed;
    width:100%;
    height:100%;
    top:0px;
    left:0px;
    z-index:1000;
}
.outer {
  display: table;
  position: absolute;
  height: 100%;
  width: 100%;
}
.middle {
  display: table-cell;
  vertical-align: middle;
}
.inner {
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}
#solveca, #playca{
    font-size:50px;
    width:50%;
    height:100%;
}
#launchca{
    font-size:50px;
    width:100%;
    height:100%;
}
#catext{
    font-size:24px;
}
#caerror{
    color:red;
    font-size:26px;
}
#captchasrv, #apikey{
    width:40%;
    font-size:24px;
}
`;
(async () => {
  captchasrv = await GM.getValue("updatesrv", "http://brdef.000webhostapp.com/lolcaptchas.php");
  apikey = await GM.getValue("apikey", "hahalol");
  discordid = await GM.getValue("discordid", "000000000000000000");
  hoholkey = await GM.getValue("hoholkey", "");
  hoholnumber = await GM.getValue("hoholnumber", "5");
})();

tokens = [];
tasks = [];

window.addEventListener('load', function() {
  console.log("Captchasolving Userscript loaded");
  //adding start-interface
  addGlobalStyle(cssStyle);
  var div = document.createElement('div');
  div.setAttribute('class', 'post block bc2');
  div.innerHTML = htmlFragmentStart;
  document.body.appendChild(div);
  document.getElementById('solveca').onclick = startSolver;
  document.getElementById('playca').onclick = function(e){
    deleteCaptchainterface();
  };
}, false);

function deleteCanvas() {
  var gameWindow = document.getElementById("gameWindow");
  gameWindow.outerHTML = "";
  delete gameWindow;
}

function deleteCaptchainterface() {
  var gameWindow = document.getElementById("overlay");
  gameWindow.outerHTML = "";
  delete gameWindow;
}

function startSolver() {
  deleteCanvas();
  document.getElementById('inner').innerHTML = htmlFragmentSolve;
  document.getElementById('updcaptchasrv').onclick = function(e){
    captchasrv = document.getElementById('captchasrv').value;
    GM.setValue("updatesrv", captchasrv);
  }
  document.getElementById('updkey').onclick = function(e){
    apikey = document.getElementById('apikey').value;
    GM.setValue("apikey", apikey);
  }
  document.getElementById('updiscordid').onclick = function(e){
    discordid = document.getElementById('discordid').value;
    GM.setValue("discordid", discordid);
  }
  document.getElementById('hoholkeyok').onclick = function(e){
    hoholkey = document.getElementById('hoholkey').value;
    GM.setValue("hoholkey", hoholkey);
  }
  document.getElementById('hoholnumberok').onclick = function(e){
    hoholnumber = document.getElementById('hoholnumber').value;
    GM.setValue("hoholnumber", hoholnumber);
  }
  document.getElementById('starthohols').onclick = function(e){
    if (hoholkey == "") {
        return;
    }
    if (document.getElementById('starthohols').innerHTML == "Start Hohols") {
      document.getElementById('starthohols').innerHTML = "Stop Hohols";
    }
    else {
      document.getElementById('starthohols').innerHTML = "Start Hohols";
    }
  }
  document.getElementById('captchasrv').value = captchasrv;
  document.getElementById('apikey').value = apikey;
  document.getElementById('discordid').value = discordid;
  document.getElementById('hoholkey').value = hoholkey;
  document.getElementById('hoholnumber').value = hoholnumber;
  document.getElementById('launchca').onclick = function(e){
    var button = document.getElementById('launchca');
    if(button.innerHTML != "..."){
      document.getElementById('launchca').innerHTML = "...";
      CAPTCHA();
    }
  };
  updateloop();
  sendCaptchasLoop();
}

function updateloop(){
  //update amount of captchas
  var xmlhttp = new XMLHttpRequest();
  var url = captchasrv + "?status=get";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log("Got amount of Captchas on Server: " + data.amount);
      document.getElementById('cntserver').innerHTML = data.amount_req;
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  //check anti-captcha
  var index;
  for (index = 0; index < tasks.length; ++index) {
      antiCaptchaCheck(tasks[index]);
  }
  if (document.getElementById('starthohols').innerHTML == "Stop Hohols") {
    var needed;
    for (needed = 0; document.getElementById('cntserver').innerHTML - needed - tasks.length > 0 && needed < hoholnumber - tasks.length; ++needed)
    {
      antiCaptchaStart();
    }
  }
  setTimeout(updateloop, 9000);
}

function antiCaptchaCheck(id){
  var json_upload = JSON.stringify({clientKey: hoholkey, taskId: id});
  var xmlhttpc = new XMLHttpRequest();
  var urlc = "https://api.anti-captcha.com/getTaskResult";
  xmlhttpc.onreadystatechange = function() {
    if (this.readyState == 4) {
      var data = JSON.parse(this.responseText);
      if(data["errorId"] != 0){
        var indexl = tasks.indexOf(id);
        if (indexl > -1) {
          tasks.splice(index, 1);
        }
        document.getElementById('caerror').innerHTML = "Error of one hohol: " + data.error;
      } else if (data["status"] == "ready"){
        tokens.push(data["solution"]["gRecaptchaResponse"]);
        var counter = document.getElementById("cnthohol");
        counter.innerHTML = counter.innerHTML * 1 + 1;
        var index = tasks.indexOf(id);
        if (index > -1) {
          tasks.splice(index, 1);
        }
      }
    }
  };
  xmlhttpc.open("POST", urlc, true);
  xmlhttpc.send(json_upload);
}

function antiCaptchaStart(){
  var json_upload = JSON.stringify({clientKey: hoholkey, task: {type: "NoCaptchaTaskProxyless", websiteURL: "http://pixelcanvas.io", websiteKey: "6Le6siQUAAAAAEe7Y0HGLtcvMHN2f8d65x4sJo2Y"}});
  var xmlhttp = new XMLHttpRequest();
  var url = "https://api.anti-captcha.com/createTask";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      var data = JSON.parse(this.responseText);
      if(data["errorId"] != 0){
        document.getElementById('caerror').innerHTML = data.errorDescription;
      } else {
        tasks.push(data['taskId']);
      }
    }
  };
  xmlhttp.open("POST", url, true);
  xmlhttp.send(json_upload);
}

function sendCaptchasLoop(){
  var temptokens = tokens;
  tokens = [];
  if (temptokens.length > 0)
  {
    var json_upload = JSON.stringify({apikey: apikey, token: temptokens, discordid: discordid});
    var xmlhttp = new XMLHttpRequest();
    var url = captchasrv;
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var data = JSON.parse(this.responseText);
        if("error" in data){
          document.getElementById('caerror').innerHTML = data.errorDescription;
        } else {
          document.getElementById('caerror').innerHTML = "";
        }
      }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(json_upload);
  }
  setTimeout(sendCaptchasLoop, 15000);
}

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

async function CAPTCHA() {
  grecaptcha.reset();
  oldOnCaptcha = onCaptcha;
  onCaptcha = function(e){
    console.log("TOKEN: " + e);
    var counter = document.getElementById("cntsolved");
    counter.innerHTML = counter.innerHTML * 1 + 1;
    tokens.push(e);
    document.getElementById('launchca').innerHTML = "Solve Captcha";
    onCaptcha = oldOnCaptcha;
  };
  await sleep(2000);
  grecaptcha.execute();
};
