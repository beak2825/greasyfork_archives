// ==UserScript==
// @name         drrrkari_timereport 
// @name:ja      時報(pot)クローム対応版
// @namespace    https://greasyfork.org/users/735907-cauliflower-carrot
// @version      5.8
// @description  Some additional functions for drrrkari.com
// @description:ja デュラチャ(仮) 時報　メッセージ発言
// @author       Kot
// @match        *://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/522278/drrrkari_timereport.user.js
// @updateURL https://update.greasyfork.org/scripts/522278/drrrkari_timereport.meta.js
// ==/UserScript==
// @require      https://github.com/kuroziten/dy/raw/main/YouTube%E3%81%A8%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%82%92iframe%E3%81%A7%E8%A6%8B%E3%82%8B%E3%82%84%E3%81%A4.js

var version='5.5'; // 最新バージョン
//デュラチャ(drrrkari.com)用の時報スクリプト
//ブラウザーのjavascriptコンソールにコピペして実行するだけで15分毎に時報が送られる

var interval=900; // 何秒毎に時報を送信するか
var preffix='';
var offset=9.0;
var suffix='';
//送信内容　「preffix　時報　suffix」

//ここから下は編集不要
var siteUrl='http://drrrkari.com';

// Send message
function sendmsg(msg){
  $.post(siteUrl+'/room/?ajax=1',Object.assign({ valid: 1 }, {message:msg}));
  var content = '<dl class="talk ' + $("#user_icon").text() + '" id="' + $("#user_id").text() + '">';
      content += '<dt>' + $("#user_name").text() + '</dt>';
      content += '<dd>';
      content += '<div class="bubble" style="margin: -16px 0px 0px;">';
      content += '<div style="position: relative; float: left; margin: 0px; top: 39px; left: -3px; width: 22px; height: 16px; background: #ffffff;) left -81px repeat-x transparent;">';
      content += '<div style="width: 100%; height: 100%; background: url(&quot;http://drrrkari.com/css/tail.png&quot;) left -17px no-repeat transparent;">';
      content +=  '</div>';
      content +=  '</div>';
      content += '<p class="body" style="margin: 0px 0px 0px 15px;">' + msg.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a href='/jump.php?url=$1' target='_blank'>$1</a>") + '</p>';
      content += '</div></dd></dl>';
  document.getElementById('talks').insertAdjacentHTML('afterbegin', content);
}

function sendPmsg(uid,msg){$.post('http://drrrkari.com/room/?ajax=1&id='+uid,Object.assign({ valid: 1 }, {message:msg}));}

var hn=document.getElementsByClassName("profname")[0].innerText;

// ----TIME_REPORT----
var timerep_on=false;
var weeks=["日","月","火","水","木","金","土"];
function theTime(offset){
  let d = new Date();
  let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  let nd = new Date(utc + (3600000*offset)).getTime();
  //return new Date(Math.round(nd/interval)*interval);
  return new Date(nd);
}
function sendTime(){
  let nd=theTime(offset);
  //let year = nd.getFullYear();
  let month = nd.getMonth() + 1;
  let day = nd.getDate();
  let hour = nd.getHours();
  let minute = nd.getMinutes();
  //let second = nd.getSeconds();
  let week=nd.getDay();
  sendmsg(preffix +" "+ (10 > month ? '0' + month : month) + '/' + (10 > day ? '0' + day : day) + '('+weeks[week]+') ' + (10 > hour ? '0' + 	hour : hour) + ':' + (10 > minute ? '0' + minute : minute) +" "+suffix);
}

var timebtn = document.createElement("BUTTON");

timebtn.addEventListener("click",function(){
  if(timebtn.innerHTML=="時報開始"){
    timerep_on=true;main();
    timebtn.innerHTML="時報停止";
    timebtn.style.backgroundColor="#99ff99";
  }
  else{
    timerep_on=false;
    timebtn.innerHTML="時報開始";
    timebtn.style.backgroundColor="#ff9999";
  }
});

timebtn.innerHTML = "時報開始";

document.getElementById('setting_pannel2').getElementsByTagName("p")[0].insertAdjacentHTML("beforeend","<br>drrrkari_timereport ver"+version+"<br>");

document.getElementById('setting_pannel2').getElementsByTagName("p")[0].appendChild(timebtn);


var timeSendBtn = document.createElement("BUTTON");
timeSendBtn.innerHTML = "時報送信";
timeSendBtn.style.backgroundColor="#bce2e8";
document.getElementsByClassName("userprof")[0].appendChild(timeSendBtn);
timeSendBtn.addEventListener("click",function(){
  sendTime();
});

const sleep=(delay)=>new Promise((resolve)=>setTimeout(resolve,delay));
interval=1000*interval;
const main= async()=>{
    while(timerep_on){
        await sleep(interval-(new Date().getTime())%interval);
        if(timerep_on){
          sendTime();        }
    }
}

timebtn.click();

// ----TEXT_TO_SPEECH----
var drrtalk=false;
var sound_dict={
  "girl":{
    "pitch":1, "rate":1
  },
  "moza":{
    "pitch":1, "rate":1
  },
  "tanaka":{
    "pitch":1, "rate":1
  },
  "kanra":{
    "pitch":1, "rate":1
  },
  "usa":{
    "pitch":1, "rate":1
  },
  "gg":{
    "pitch":1, "rate":1
  },
  "orange":{
    "pitch":1, "rate":1
  },
  "zaika":{
    "pitch":1, "rate":1
  },
  "setton":{
    "pitch":1, "rate":1
  },
  "zawa":{
    "pitch":1, "rate":1
  },
  "neko":{
    "pitch":1, "rate":1
  },
  "purple":{
    "pitch":1, "rate":1
  },
  "kai":{
    "pitch":1, "rate":1
  },
  "bakyura":{
    "pitch":1, "rate":1
  },
  "neko2":{
    "pitch":1, "rate":1
  },
  "numakuro":{
    "pitch":1, "rate":1
  },
  "bm":{
    "pitch":1, "rate":1
  },
  "bear":{
    "pitch":1, "rate":1
  },
  "rab":{
    "pitch":1, "rate":1
  },
  "nyan":{
    "pitch":1, "rate":1
  },
  "muff":{
    "pitch":1, "rate":1
  },
  "muff_nyan":{
    "pitch":1, "rate":1
  }
};

// 5秒後にボイスをオンにする
setTimeout(function() {
    drrtalk = true;
    document.getElementById('tts_onoff_btn').style.backgroundColor = 'green';
}, 5000);

// キーボードイベントのリスナーを追加
document.addEventListener('keydown', function(event) {
  if (event.key === 'F8') {
    drrtalk = true;
    document.getElementById('tts_onoff_btn').style.backgroundColor = 'green';
  } else if (event.key === 'F9') {
    drrtalk = false;
    document.getElementById('tts_onoff_btn').style.backgroundColor = 'red';
  }
});

function talk(incomingMsg){
  if(drrtalk==false)return;
  let icon_class=body.children[1].children[0].children[0].attributes['class'].value;
  if(incomingMsg.includes('/')||incomingMsg.includes('.com')||incomingMsg.includes('.jp')||incomingMsg.includes('部屋主')||incomingMsg.includes('老人')||incomingMsg.includes('退席中')||incomingMsg.includes('戻りました'))return;
  let speech = new SpeechSynthesisUtterance(incomingMsg/*.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "")*/);
  if(sound_dict.hasOwnProperty(icon_class.replace("talk ",""))){
    console.log(icon_class+" "+sound_dict[icon_class.replace("talk ","")]["pitch"]+" "+sound_dict[icon_class.replace("talk ","")]["rate"]);
    speech.pitch=sound_dict[icon_class.replace("talk ","")]["pitch"];
    speech.rate=sound_dict[icon_class.replace("talk ","")]["rate"];
  }
  speech.volume=document.getElementById('volume').value;
  speechSynthesis.speak(speech);
}

function pingResponse(incomingMsg,sender){
  if(incomingMsg=="ping @"+hn){
    if(sender!=undefined){
      sendPmsg(sender,"pong");
    }
    else{
      sendmsg("pong");
    }
  }
}
document.getElementsByClassName('logout')[0].insertAdjacentHTML('beforebegin','<li id="tts_onoff_btn" class="sound sound_on" style="background-color: red;">&nbsp;</li>');
document.getElementById('tts_onoff_btn').onclick=function(){
  drrtalk=(!drrtalk);
  if(drrtalk)document.getElementById('tts_onoff_btn').style.backgroundColor="green";
  else document.getElementById('tts_onoff_btn').style.backgroundColor="red";
}

document.getElementById('setting_pannel2').getElementsByTagName('p')[0].insertAdjacentHTML('beforeend','  音量: ');
document.getElementById('setting_pannel2').getElementsByTagName('p')[0].insertAdjacentHTML('beforeend',' <input type="range" min="0" max="1" value="1" step="0.01" id="volume" />');
document.getElementById('setting_pannel2').getElementsByTagName('p')[0].insertAdjacentHTML('beforeend','<br><br>');

// ----Interface customisaztion----
document.getElementsByName('logout')[0].style.backgroundColor='#ffaaaa';

// ----____----
const drrrkot_observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      if(body.children[1].children[0].children[0].attributes['id'].isChecked == true)return;
      body.children[1].children[0].children[0].attributes['id'].isChecked = true;
      var incomingMsg=body.children[1].children[0].firstChild.innerText.split('\n\n')[1];
      talk(incomingMsg);
      pingResponse(incomingMsg);
  });
});
const drrrkot_config = {childList:true,subtree:true};
drrrkot_observer.observe(document.body, drrrkot_config);
