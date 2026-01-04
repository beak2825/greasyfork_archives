// ==UserScript==
// @name           𝑺𝑷𝑰𝑫𝑬𝑹 𝑩𝑶𝑻 𝑽2
// @description   made by leader script, Falcon
// @version        2.0
// @author         𝐥𝐞𝐚𝐝𝐞𝐫 𝐬𝐜𝐫𝐢𝐩𝐭
// @license        L/F
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://i.ibb.co/2dWcrfd/image.pnga
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant          GM_openInTab
// @namespace     https://youtube.com/@leaderscript.?si=7l3lNKrsBB-gbM3i
// @downloadURL https://update.greasyfork.org/scripts/546210/%F0%9D%91%BA%F0%9D%91%B7%F0%9D%91%B0%F0%9D%91%AB%F0%9D%91%AC%F0%9D%91%B9%20%F0%9D%91%A9%F0%9D%91%B6%F0%9D%91%BB%20%F0%9D%91%BD2.user.js
// @updateURL https://update.greasyfork.org/scripts/546210/%F0%9D%91%BA%F0%9D%91%B7%F0%9D%91%B0%F0%9D%91%AB%F0%9D%91%AC%F0%9D%91%B9%20%F0%9D%91%A9%F0%9D%91%B6%F0%9D%91%BB%20%F0%9D%91%BD2.meta.js
// ==/UserScript==


(function() {
    'use strict';


    var image = document.createElement('img');
    image.src = 'https://i.ibb.co/WV1Ctxf/Sans-titre-1.jpg';


    image.style.position = 'absolute';
    image.style.top = '183px';
    image.style.left = '73px';
    image.style.height = '39px';
    image.style.zIndex = '9999';


    document.body.appendChild(image);
})();

(function() {
  'use strict';

  let executed = false;

  function injectMessage() {
    if (!executed) {
      const message = '<div class="msg system" style="background-color: white ;"><strong style="cursor: pointer; color:#0022b1;">Spider bot in action</strong></div>';
      const chatElement = document.querySelector("#chat > div > div > div.scrollElements");
      chatElement.insertAdjacentHTML('beforeend', message);
      executed = true;
    }
  }

  setInterval(injectMessage, 1000);

})();
(function() {
  'use strict';

  let executed = false;

  function injectMessage() {
    if (!executed) {
      const message = '<div class="msg system" style="background-color: white ;"><strong style="cursor: pointer; color:#0022b1;">Spider bot in action</strong></div>';
      const chatElement = document.querySelector("#chat > div > div > div.scrollElements");
      chatElement.insertAdjacentHTML('beforeend', message);
      executed = true;
    }
  }

  setInterval(injectMessage, 1000);

})();
(function() {
  'use strict';

  let executed = false;

  function injectMessage() {
    if (!executed) {
      const message = '<div class="msg system" style="background-color: white ;"><strong style="cursor: pointer; color:#0022b1;">Spider bot in action</strong></div>';
      const chatElement = document.querySelector("#chat > div > div > div.scrollElements");
      chatElement.insertAdjacentHTML('beforeend', message);
      executed = true;
    }
  }

  setInterval(injectMessage, 1000);

})();
(function() {
  'use strict';

  let executed = false;

  function injectMessage() {
    if (!executed) {
      const message = '<div class="msg system" style="background-color: white ;"><strong style="cursor: pointer; color:#0022b1;">Spider bot in action</strong></div>';
      const chatElement = document.querySelector("#chat > div > div > div.scrollElements");
      chatElement.insertAdjacentHTML('beforeend', message);
      executed = true;
    }
  }

  setInterval(injectMessage, 1000);

})();
(function() {
  'use strict';

  let executed = false;

  function injectMessage() {
    if (!executed) {
      const message = '<div class="msg system" style="background-color: white ;"><strong style="cursor: pointer; color:#0022b1;">Spider bot in action</strong></div>';
      const chatElement = document.querySelector("#chat > div > div > div.scrollElements");
      chatElement.insertAdjacentHTML('beforeend', message);
      executed = true;
    }
  }

  setInterval(injectMessage, 1000);

})();

var panel = document.createElement("div");
panel.style.position = "fixed";
panel.style.top = "20px";
panel.style.right = "px";
panel.style.width = "260px";
panel.style.height = "30px";
panel.style.backgroundColor = "#000";
panel.style.borderRadius = "1px";
panel.style.padding = "8px";
panel.style.zIndex = "1000";
panel.style.textAlign = "center";
panel.style.border = "2px solid red";

var linkInput = document.createElement("input");
linkInput.type = "text";
linkInput.placeholder = "Enter link ...";
linkInput.style.width = "70%";
linkInput.style.borderRadius = "5px";
panel.appendChild(linkInput);


var btn1 = document.createElement("button");
btn1.style.backgroundColor = "#1200ff";
btn1.style.color = "#fff";
btn1.style.border = "none";
btn1.style.padding = "7px 0px";
btn1.style.borderRadius = "5px";
btn1.style.cursor = "pointer";
btn1.textContent = "Viewer";
btn1.style.width = "25%";
btn1.style.marginLeft = "5px";


panel.appendChild(btn1);

btn1.addEventListener("click", function() {
var link = linkInput.value;
var newlink = link+"/viewer";
window.open(newlink, '_blank');
});


let html=`


`

document.body.appendChild(panel);

    let rand = x => Math.floor(Math.random() * 1000000),
    GM_onMessage = (label, cb) => GM_addValueChangeListener(label, (_, __, data) => cb(...data)),
    GM_sendMessage = (label, ...data) => GM_setValue(label, data);

    let randomNumber = Math.floor(Math.random() * 36) + 1;

GM_onMessage('answerinput', (atılacak, _) => {

                    document.querySelector('#answer').value= atılacak
    })
GM_onMessage('changedraw', (atılacak, _) => {

                    document.querySelector('#answer').value= atılacak
    })
function f(ygn){return document.querySelector(ygn)}
function fa(ygn){return document.querySelectorAll(ygn)}
function num(ICE){return Math.ceil(Math.random()*ICE+1)}
function rc(ygn){let e=f('input[name="chat"]');let lv=e.value;e.value="";let ev=new Event('input',{bubbles:true});ev.simulated=true;let t=e._valueTracker;if(t){t.setValue(lv);};e.dispatchEvent(ev);}
function rs(ygn){let e=f(".search input");let lv=e.value;e.value="";let ev=new Event('input',{bubbles:true});ev.simulated=true;let t=e._valueTracker;if(t){t.setValue(lv);};e.dispatchEvent(ev);}
function rnext(kelime) {
  const hd = kelime.split('');
  const hu = hd.length;
  const yh = [];
  const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063', '\u2064', '\u2066', '\u17b4', '\u17b5', '\u2068', '\u2069'];
  let charCount = 0;

  for (let i = 0; i < hu; i++) {
    yh.push(hd[i]);
    charCount++;

    if (charCount < 18 && i < hu - 1) {
      const invisibleChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
      yh.push(invisibleChar);
      charCount++;
    }

    if (charCount >= 18) {
      break;
    }
  }

  return yh.join('');
}
let cmd="",wss=[],tojoin=0,usersinroom=[],customkickitems=[],intervalbroadcast,intervalmsg,intervalanswer,botsidvalue=[],botID,botlongID,theme,avatar=localStorage.getItem("avatar"),botnick=localStorage.getItem("botnick"),nick=localStorage.getItem("nick")


    if(window.location.href.indexOf("aHR0cHM6Ly9nYXJ0aWMuaW8")!=-1){
    let room,kicknewstat=false,kickjoinstat=false,waitforkick=0

const addItem = (arr, ...arguments) => { for (let i = 0; i < arguments.length; i++) { arr[arr.length] = arguments[i]; } return arr; };

function arrayFilter(array) {
  return array.filter((value, index, arr) => arr.indexOf(value) === index);
}

    GM_setValue("botekle",rand())

    GM_addValueChangeListener("resetcount", function(I,C,E,b) {
        GM_setValue("botekle",rand())
    })
    setTimeout(()=>{waitforkick=0},1000)

GM_onMessage("join", (room, nick, avatar, botnick, kickonjoin, _) => {
    fetch("/logout").then(response => {
        console.log('Logout response:', response);
        return fetch("https://" + window.location.href.split("/")[2] + "/server?check=1&v3=1&room=" + room + "&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8#");
    }).then(response => response.text()).then(x => {
        console.log('Server response:', x);
        let ws = new WebSocket("wss://" + window.location.href.split("/")[2] + "/__cpw.php?u=" + btoa("wss://" + x.split("https://")[1].split(".")[0] + ".gartic.io/socket.io/?c=" + x.split("?c=")[1] + "&EIO=3&transport=websocket") + "&o=aHR0cHM6Ly9nYXJ0aWMuaW8=");
        ws.onopen = () => {
            let inter = setInterval(() => {
                GM_setValue("ready", rand());
                if (tojoin == 1) {
                    tojoin = 0;
                    fetch("https://spaces-typing-lesson-charges.trycloudflare.com/assign-token", {
                        method: "GET"
                    }).then(response => response.json()).then(data => {
                        const token = data.token;
                        const randomAvatar = Math.floor(Math.random() * 36) + 1;
                        const randomNickNumber = Math.floor(1000 + Math.random() * 9000);

                        if (botnick === '0') {
                            ws.send('42[3,{"v":20000,"token":"' + token + '","nick":"' + rnext(nick) + '","avatar":' + avatar + ',"platform":69,"sala":"' + room.substring(2) + '"}]');
                        } else if (botnick === '1') {
                            ws.send('42[3,{"v":20000,"token":"' + token + '","nick":"' + rnext(nick) + '","avatar":' + randomAvatar + ',"platform":69,"sala":"' + room.substring(2) + '"}]');
                        } else if (botnick === '2') {
                            ws.send('42[3,{"v":20000,"token":"' + token + '","nick":"' + nick + randomNickNumber + '","avatar":' + randomAvatar + ',"platform":69,"sala":"' + room.substring(2) + '"}]');
                        } else if (botnick === '3') {
                            ws.send('42[3,{"v":20000,"token":"' + token + '","nick":"' + nick + randomNickNumber + '","avatar":' + avatar + ',"platform":69,"sala":"' + room.substring(2) + '"}]');
                        }
                        clearInterval(inter);
                    });
                }
            }, 50);

            ws.onclose = () => {
                wss.length = 0;
                ws.close();
            };

            ws.onmessage = (msg) => {
                if (msg.data.indexOf('42["23"') != -1) {
                    let user = JSON.parse("{" + msg.data.split("{")[1].split("}")[0] + "}");
                    usersinroom.push(user);
                    if (kicknewstat) {
                        typeof(user.id) == "string" ? ws.send('42[45,' + ws.id + ',["' + user.id + '",true]]') : ws.send('42[45,' + ws.id + ',[' + user.id + ',true]]');
                    }
                }
                if (msg.data.indexOf('42["5"') != -1) {
                    let objlist = JSON.parse('["5"' + msg.data.split('42["5"')[1]);
                    ws.theme = objlist[4].tema;
                    ws.room = objlist[4].codigo;
                    ws.id = objlist[2];
                    objlist[5].forEach(item => { usersinroom.push(item); });
                    let targetid = objlist[5][0].id;
                    botID = objlist[2];
                    botlongID = objlist[1];
                    theme = objlist[4].tema;
                    setTimeout(() => {
                        f(".roomtheme").innerHTML = theme;
                    }, 10);
                    setTimeout(() => {
                        GM_sendMessage("botsidvalue", botlongID, rand());
                    }, 777);
                    setTimeout(() => {
                        GM_sendMessage("updatelist", botID, rand());
                    }, 777);

                    kickjoinstat ? typeof(targetid) == "string" ? ws.send('42[45,' + ws.id + ',["' + targetid + '",true]]') : ws.send('42[45,' + ws.id + ',[' + targetid + ',true]]') : 0;
                    ws.send('42[46,' + objlist[2] + ']');

                    GM_onMessage('answerinput', (atılacak, _) => {
                        f('#answer').value = atılacak;
                    });

                    GM_onMessage("botsidvalue", (datachangex, _) => {
                        botsidvalue.push(datachangex);
                    });

                    GM_onMessage("updatelist", (datachangex, _) => {
                        GM_sendMessage("updatebotidlist", botsidvalue, rand());
                    });

                    GM_onMessage("updatebotidlist", (datachangex, _) => {
                        if (!botsidvalue.includes(datachangex)) {
                            addItem(botsidvalue, ...datachangex);
                        }
                        botsidvalue = arrayFilter(botsidvalue);
                    });

                    GM_addValueChangeListener("broadcast", function(I, C, E, b) {
                        ws.send('42[11,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                        ws.send('42[13,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                    });

                    GM_addValueChangeListener("msg", function(I, C, E, b) {
                        ws.send('42[11,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                    });

                    GM_addValueChangeListener("answer", function(I, C, E, b) {
                        ws.send('42[13,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                    });

                    GM_addValueChangeListener("report", function(I, C, E, b) {
                        ws.send('42[35,' + objlist[2] + ']');
                    });

                    GM_addValueChangeListener("jump", function(I, C, E, b) {
                        ws.send('42[25,' + objlist[2] + ']');
                    });

                    GM_addValueChangeListener("acceptdraw1", function(I, C, E, b) {
                        ws.send('42[34,' + objlist[2] + ']');
                    });

                    GM_addValueChangeListener("acceptdraw2", function(I, C, E, b) {
                        ws.send('42[34,' + objlist[2] + ',1]');
                    });

                    GM_addValueChangeListener("tips", function(I, C, E, b) {
                        ws.send('42[30,' + objlist[2] + ',1]');
                    });

                    GM_addValueChangeListener("exit", function(I, C, E, b) {
                        ws.send('42[24,' + objlist[2] + ']');
                        wss.length = 0;
                        usersinroom.length = 0;
                    });

                    GM_addValueChangeListener("kick", function(I, C, E, b) {
                        if (!botsidvalue.includes(E.split("..")[0])) {
                            ws.send('42[45,' + objlist[2] + ',["' + E.split("..")[0] + '",true]]');
                        }
                    });

                    JSON.stringify(wss).indexOf(objlist[2]) == -1 ? wss.push({"ws": ws, "id": objlist[2], "lengthID": objlist[1]}) : 0;
                    let interval = setInterval(() => {
                        ws.readyState == 1 ? ws.send('42[42,' + objlist[2] + ']') : clearInterval(interval);
                        ws.readyState == 1 ? ws.send('2') : clearInterval(interval);
                    }, 20000);
                }
                if (msg.data.indexOf('42["34"') != -1) {
                    let objlist = JSON.parse('["34"' + msg.data.split('42["34"')[1]);
                    var cdd = objlist[1];
                    GM_sendMessage('answerinput', cdd, rand());
                }
            };
        };
    });
});



    GM_addValueChangeListener("join", function(I,C,E,b) {
        tojoin=1
    });
    GM_addValueChangeListener("kicknewset", function(I,C,E,b) {
        kicknewstat=E
    });
    GM_addValueChangeListener("kickjoinset", function(I,C,E,b) {
        kickjoinstat=E
    });



    window.addEventListener("beforeunload",()=>{
        GM_setValue("botçıkar",window.location.href.split("/")[2]+"--"+rand())
    })
}

    if(window.location.href.indexOf("gartic.io")!=-1){
const addItem = (arr, ...arguments) => { for (let i = 0; i < arguments.length; i++) { arr[arr.length] = arguments[i]; } return arr; };

function arrayFilter(array) {
  return array.filter((value, index, arr) => arr.indexOf(value) === index);
}
    let customkick = localStorage.getItem("customkick");
if (!customkick) {
  localStorage.setItem("customkick", "[]");
}

if (customkick) {
    let list=JSON.parse(localStorage.getItem("customkick"))

        list.forEach(user=>{
            setTimeout(()=>{
        f("#STBOT3").innerHTML+=`<h2 class="customkick" id="customkick.`+user.user+`">`+user.user+`</h2>
    <input type="submit" class="customkickremove" id="customkickuser.`+user.user+`" onclick="window.postMessage('customkickremove.`+user.user+`','*')" value="remove">`
        addItem(customkickitems, user.user)
            },3000)
        })
}
   let avataritem = localStorage.getItem("avatar");
if (!avataritem) {
  localStorage.setItem("avatar", "17");
}
     let botnickitem = localStorage.getItem("botnick");
if (!botnickitem) {
  localStorage.setItem("botnick", "0");
}
     let nickitem = localStorage.getItem("nick");
if (!nickitem) {
  localStorage.setItem("nick", "Spider bot");
}
if (avataritem) {
    setTimeout(()=>{
    f("#avatar").src = 'https://gartic.io/static/images/avatar/svg/' + localStorage.getItem("avatar") + '.svg';

    },100)
    }

window.addEventListener("message",(msg)=>{
     if(msg.data=="broadcastspam"){
        let broadcastspamMS=f(".broadcastspam").value
        f("#broadcastms").innerText='BROADCAST SPAM VALUE: ' + broadcastspamMS
        localStorage.setItem("broadcastspam",broadcastspamMS)
    }
    if(msg.data=="messagespam"){
        let messagespamMS=f(".messagespam").value
        f("#messagems").innerText='MESSAGE SPAM VALUE: ' + messagespamMS
        localStorage.setItem("messagespam",messagespamMS)
    }
    if(msg.data=="answerspam"){
        let answerspamMS=f(".answerspam").value
        f("#answerms").innerText='ANSWER SPAM VALUE: ' + answerspamMS
        localStorage.setItem("answerspam",answerspamMS)
    }
    if(msg.data=="nick"){
            localStorage.setItem("nick",f("#botnick").value)
    }
    if(msg.data=="botnick0"){
botnick=0
localStorage.setItem("botnick",0)
    }
    if(msg.data=="botnick1"){
botnick=1
localStorage.setItem("botnick",1)
    }
     if(msg.data=="botnick2"){
botnick=2
localStorage.setItem("botnick",2)
    }
    if(msg.data=="botnick3"){
botnick=3
localStorage.setItem("botnick",3)
    }
    if(msg.data=="showavatarlist"){
       // f("#Spider1").style.display="none"
        f("#avatarlist").style.display="block"
    }
    if(msg.data=="hideavatarlist"){
        f("#Spider1").style.display="block"
        f("#avatarlist").style.display="none"
    }
     if(msg.data=="avatar0"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/0.svg";
avatar=0
localStorage.setItem("avatar",0)
     }
     if(msg.data=="avatar1"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/1.svg";
avatar=1
localStorage.setItem("avatar",1)
     }
     if(msg.data=="avatar2"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/2.svg";
avatar=2
localStorage.setItem("avatar",2)
     }
     if(msg.data=="avatar3"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/3.svg";
avatar=3
localStorage.setItem("avatar",3)
     }
     if(msg.data=="avatar4"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/4.svg";
avatar=4
localStorage.setItem("avatar",4)
     }
     if(msg.data=="avatar5"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/5.svg";
avatar=5
localStorage.setItem("avatar",5)
     }
     if(msg.data=="avatar6"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/6.svg";
avatar=6
localStorage.setItem("avatar",6)
     }
     if(msg.data=="avatar7"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/7.svg";
avatar=7
localStorage.setItem("avatar",7)
     }
     if(msg.data=="avatar8"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/8.svg";
avatar=8
localStorage.setItem("avatar",8)
     }
     if(msg.data=="avatar9"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/9.svg";
avatar=9
localStorage.setItem("avatar",9)
     }
     if(msg.data=="avatar10"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/10.svg";
avatar=10
localStorage.setItem("avatar",10)
     }
     if(msg.data=="avatar11"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/11.svg";
avatar=11
localStorage.setItem("avatar",11)
     }
     if(msg.data=="avatar12"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/12.svg";
avatar=12
localStorage.setItem("avatar",12)
     }
     if(msg.data=="avatar13"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/13.svg";
avatar=13
localStorage.setItem("avatar",13)
     }
     if(msg.data=="avatar14"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/14.svg";
avatar=14
localStorage.setItem("avatar",14)
     }
     if(msg.data=="avatar15"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/15.svg";
avatar=15
localStorage.setItem("avatar",15)
     }
     if(msg.data=="avatar16"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/16.svg";
avatar=16
localStorage.setItem("avatar",16)
     }
     if(msg.data=="avatar17"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/17.svg";
avatar=17
localStorage.setItem("avatar",17)
     }
     if(msg.data=="avatar18"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/18.svg";
avatar=18
localStorage.setItem("avatar",18)
     }
     if(msg.data=="avatar19"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/19.svg";
avatar=19
localStorage.setItem("avatar",19)
     }
     if(msg.data=="avatar20"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/20.svg";
avatar=20
localStorage.setItem("avatar",20)
     }
     if(msg.data=="avatar21"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/21.svg";
avatar=21
localStorage.setItem("avatar",21)
     }
     if(msg.data=="avatar22"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/22.svg";
avatar=22
localStorage.setItem("avatar",22)
     }
     if(msg.data=="avatar23"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/23.svg";
avatar=23
localStorage.setItem("avatar",23)
     }
     if(msg.data=="avatar24"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/24.svg";
avatar=24
localStorage.setItem("avatar",24)
     }
     if(msg.data=="avatar25"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/25.svg";
avatar=25
localStorage.setItem("avatar",25)
     }
     if(msg.data=="avatar26"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/26.svg";
avatar=26
localStorage.setItem("avatar",26)
     }
     if(msg.data=="avatar27"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/27.svg";
avatar=27
localStorage.setItem("avatar",27)
     }
     if(msg.data=="avatar28"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/28.svg";
avatar=28
localStorage.setItem("avatar",28)
     }
     if(msg.data=="avatar29"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/29.svg";
avatar=29
localStorage.setItem("avatar",29)
     }
     if(msg.data=="avatar30"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/30.svg";
avatar=30
localStorage.setItem("avatar",30)
     }
     if(msg.data=="avatar31"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/31.svg";
avatar=31
localStorage.setItem("avatar",31)
     }
     if(msg.data=="avatar32"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/32.svg";
avatar=32
localStorage.setItem("avatar",32)
     }
     if(msg.data=="avatar33"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/33.svg";
avatar=33
localStorage.setItem("avatar",33)
     }
     if(msg.data=="avatar34"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/34.svg";
avatar=34
localStorage.setItem("avatar",34)
     }
     if(msg.data=="avatar35"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/35.svg";
avatar=35
localStorage.setItem("avatar",35)
     }
     if(msg.data=="avatar36"){
f("#avatar").src = "https://gartic.io/static/images/avatar/svg/36.svg";
avatar=36
localStorage.setItem("avatar",36)
     }
     if(msg.data=="avatarnull"){
f("#avatar").src = "https://garticphone.com/images/avatar/45.svg";
avatar=null
localStorage.setItem("avatar",null)
     }


        if(msg.data=="customkickadd"){
 const value = f("#kicklistinput").value;
var customkicklist = localStorage.getItem("customkick");
if (!customkicklist.includes(value) && !customkickitems.includes(value)) {
  customkickitems.push(value);
  let customkickitem = JSON.parse(localStorage.getItem("customkick"));
  if (customkickitem.findIndex(item => item.user === value) === -1) {
    customkickitem.push({ "user": value });
    localStorage.setItem("customkick", JSON.stringify(customkickitem));
    f("#STBOT3").innerHTML += `<h2 class="customkick" id="customkick.` + value + `">` + value + `</h2>
    <input type="submit" class="customkickremove" id="customkickuser.` + value + `" onclick="window.postMessage('customkickremove.` + value + `','*')" value="remove">`
  }
}
        }
            if(msg.data.indexOf("customkickremove.")!=-1){
 let usernick = event.data.split("customkickremove.")[1];
let storage = JSON.parse(localStorage.getItem("customkick"));

if (storage && Array.isArray(storage)) {
  for (let i = 0; i < storage.length; i++) {
    if (storage[i].user === usernick) {
      storage.splice(i, 1);
      break;
    }
  }

  localStorage.setItem("customkick", JSON.stringify(storage));
var value = usernick;
var index = customkickitems.indexOf(value);
if (index > -1) {
  customkickitems.splice(index, 1);
}
}
      let kickusertext= document.getElementById("customkick."+usernick)
      let kickuserremovebtn= document.getElementById("customkickuser."+usernick)
      kickusertext.remove()
      kickuserremovebtn.remove()

        }
        if(msg.data=="customkickremoveall"){
var elementsCustomKick = document.querySelectorAll('[id*="customkick."]');
var elementsCustomKickUser = document.querySelectorAll('[id*="customkickuser."]');
function deleteElement(element) {
  element.parentNode.removeChild(element);
}
elementsCustomKick.forEach(function(element) {

  deleteElement(element);
});
elementsCustomKickUser.forEach(function(element) {
  deleteElement(element);

})
      localStorage.setItem("customkick","[]")
      customkickitems=[]
        }
})
    let readyc=0,botc=0,otoeven=0,roomusers=[]

    let WebSocket=window.WebSocket
    window.ginterval=0
    window.selectlevel=-1
    let originalSend = WebSocket.prototype.send,setTrue=false;
    window.wsObj={}
    console.log("running")
    WebSocket.prototype.send=function(data){
        originalSend.apply(this, arguments)
        if(Object.keys(window.wsObj).length==0){window.wsObj=this;window.eventAdd()}
    };

    function updatespeckicks(){
        f(".userkickmenu").innerHTML=""
        roomusers.forEach(user=>{
            user.nick.split("‏").join("")!="Spider"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.id+`','*')">`:0
        })
    }

    window.eventAdd=()=>{
        if(!setTrue){
            setTrue=1
            window.wsObj.addEventListener("message",(msg)=>{

                if(msg.data.indexOf('42["5"')!=-1){
                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                    objlist[5].forEach(item=>{roomusers.push(item)})
                    updatespeckicks()
                }
                if(msg.data.indexOf('42["23"')!=-1){
                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")
                    roomusers.push(user)
                    updatespeckicks()
                }
                if(msg.data.indexOf('42["24"')!=-1){
                    let user=msg.data.split(",")[1].split('"')[1]
                    for(let i=0;i<roomusers.length;i++){
                        typeof(roomusers[i].id)==='undefined'?0:roomusers[i].id==user?roomusers.splice(i,1):0
                    }
                    updatespeckicks()
                }
            })
        }
    }



    let html=`
    <div class="userlist">
    <div class="userkickmenu"></div>
    <input type="submit" style="width:90px; background:red" onclick="window.postMessage('kickall','*')" value="KICK ALL">
        <input type="checkbox" class="kickonjoin">&nbsp;Kick on join<br>
        <input type="checkbox" class="kickallwhenjoin">&nbsp;Kick when join<hr>
    </div>

    </div>
    <div id="avatarlist" class="Spider">
    <input type="submit" class="hideavatarlist" onclick="window.postMessage('hideavatarlist','*')" value="CLOSE">
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/0.svg" class="selectedavatar" onclick="window.postMessage('avatar0','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/1.svg" class="selectedavatar" onclick="window.postMessage('avatar1','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/2.svg" class="selectedavatar" onclick="window.postMessage('avatar2','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/3.svg" class="selectedavatar" onclick="window.postMessage('avatar3','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/4.svg" class="selectedavatar" onclick="window.postMessage('avatar4','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/5.svg" class="selectedavatar" onclick="window.postMessage('avatar5','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/6.svg" class="selectedavatar" onclick="window.postMessage('avatar6','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/7.svg" class="selectedavatar" onclick="window.postMessage('avatar7','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/8.svg" class="selectedavatar" onclick="window.postMessage('avatar8','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/9.svg" class="selectedavatar" onclick="window.postMessage('avatar9','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/10.svg" class="selectedavatar" onclick="window.postMessage('avatar10','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/11.svg" class="selectedavatar" onclick="window.postMessage('avatar11','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/12.svg" class="selectedavatar" onclick="window.postMessage('avatar12','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/13.svg" class="selectedavatar" onclick="window.postMessage('avatar13','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/14.svg" class="selectedavatar" onclick="window.postMessage('avatar14','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/15.svg" class="selectedavatar" onclick="window.postMessage('avatar15','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/16.svg" class="selectedavatar" onclick="window.postMessage('avatar16','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/17.svg" class="selectedavatar" onclick="window.postMessage('avatar17','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/18.svg" class="selectedavatar" onclick="window.postMessage('avatar18','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/19.svg" class="selectedavatar" onclick="window.postMessage('avatar19','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/20.svg" class="selectedavatar" onclick="window.postMessage('avatar20','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/21.svg" class="selectedavatar" onclick="window.postMessage('avatar21','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/22.svg" class="selectedavatar" onclick="window.postMessage('avatar22','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/23.svg" class="selectedavatar" onclick="window.postMessage('avatar23','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/24.svg" class="selectedavatar" onclick="window.postMessage('avatar24','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/25.svg" class="selectedavatar" onclick="window.postMessage('avatar25','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/26.svg" class="selectedavatar" onclick="window.postMessage('avatar26','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/27.svg" class="selectedavatar" onclick="window.postMessage('avatar27','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/28.svg" class="selectedavatar" onclick="window.postMessage('avatar28','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/29.svg" class="selectedavatar" onclick="window.postMessage('avatar29','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/30.svg" class="selectedavatar" onclick="window.postMessage('avatar30','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/31.svg" class="selectedavatar" onclick="window.postMessage('avatar31','*')"></button></div>
<div class="avatarbtn"><button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/32.svg" class="selectedavatar" onclick="window.postMessage('avatar32','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/33.svg" class="selectedavatar" onclick="window.postMessage('avatar33','*')"></button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/34.svg" class="selectedavatar" onclick="window.postMessage('avatar34','*')"></button>
</div>
<div class="avatarbtn">
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/35.svg" class="selectedavatar" onclick="window.postMessage('avatar35','*')"></button>
<button>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://gartic.io/static/images/avatar/svg/36.svg" class="selectedavatar" onclick="window.postMessage('avatar36','*')"></button></div>
<br>
<button>
<img width="100" style="margin-top:-5px;" height="100" src="https://lh3.googleusercontent.com/a/ACg8ocJrEjl3DQSdQjh5mhz0Ql7hXpDCu2ObeTJvZw_ScOgMIsOZ0g=s300" class="selectedavatar" onclick="window.postMessage('avatarnull','*')"></button></div>
<br>
</div>
 <div id="Spider2" class="Spider2">
 <img width="100" style="margin-top:0px;" height="55" src="https://gartic.io/static/images/avatar/svg/`+localStorage.getItem("avatar")+`.svg" id="avatar" class="selectedavatar">
 </div>
<div id="Spider3" class="Spider3">

<input type="number" id="broadcastx" placeholder="Croxy Proxy" style="border-radius: 5px; width: 45%; height: 10px; border: 2px solid white;padding: 10px;background-color: #000000; color:white; ">
    <button class="broadcastbtnx"  onclick="openTabs()" value="Broadcast"style="border-radius: 5px;height: 33px;color: #ffffff;margin-top: 10px;margin-left: 4px;background-color: #1200ff;width: 30%;">OPEN
</button>
</div>
<div id="STBOT4" class="STBOT4">



</div>
    <div id="Spider1" class="Spider">
    <input type="text" id="roomlink" placeholder="Room link" style="border-radius: 5px; border: 2px solid white; width: 75%; height: 30px;padding: 10px;background-color: #000000; color:white; margin-top: 10px;">
    <input type="submit" id="join" style="background:#039d01;"   onclick="window.postMessage('join','*')" value="JOIN" style="border-radius: 5px; width: 20%; cursor: pointer; height: 30px;color: #ffffff;">
       <input type="text" id="botnick" oninput="window.postMessage('nick','*')" placeholder="Bot nick" value="`+localStorage.getItem("nick")+`" style="border-radius: 5px; width: 75%; height: 30px; margin-top: 5px; border: 2px solid white;padding: 10px;background-color: #000000; color:white;  margin-top: 10px;">
       <input type="submit" class="chooseavatar" onclick="window.postMessage('showavatarlist','*')" value="Avatar"style="width: 20%; border-radius: 5px;height: 30px;color: #ffffff;">
       <input type="submit" class="botnick0" onclick="window.postMessage('botnick0','*')" value="without/iftar"style="width: 47%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="botnick1"  onclick="window.postMessage('botnick1','*')" value="without"style="width: 47%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;"><br>
    <input type="submit" class="botnick2"   onclick="window.postMessage('botnick3','*')" value="numbers/iftar"style="width: 47%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;">
    <input type="submit"  class="botnick2" onclick="window.postMessage('botnick2','*')" value="numbers"style="width: 47%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;">


    <br>
    <div class="broadcastbox">
    <input type="text" id="broadcast" placeholder="Broadcast" style="border-radius: 5px; width: 70%; height: 30px; border: 2px solid white;padding: 10px;background-color: #000000; color:white; ">
    <button class="broadcastbtn" style="background:red;"    onclick="window.postMessage('broadcast','*')" value="Broadcast"style="border-radius: 5px;height: 30px;color: #ffffff;margin-top: 10px;margin-left: 4px;">Send
</button></div>
    <div class="msgbox"><input type="text" id="message" placeholder="Message" style="border-radius: 5px; border: 2px solid white; padding: 10px; background-color: #000000; color:white; "><button class="msgbtn" onclick="window.postMessage('chat','*')" value="Message" style="border-radius: 5px;height: 30px;color: #ffffff;margin-top: 10px;margin-left: 4px;">Send
</button></div>
    <div class="answerbox"><input type="text" id="answer" placeholder="Answer" style="border-radius: 5px; width: 70%; height: 30px; border: 2px solid white; padding: 10px; background-color: #000000; color:white; "><button class="answerbtn" style="background:red;"   onclick="window.postMessage('answer','*')" value="Answer" style="border-radius: 5px;height: 30px;color: #ffffff;margin-top: 10px;margin-left: 4px;">Send

</button></div>

    <input type="submit" class="kickall"  onclick="window.postMessage('kickall','*')" value="KICK ALL"style="width: 95%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="exit" style="background:red;"  onclick="window.postMessage('exit','*')" value="EXIT" style="border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="report" style="background:#1200ff;"  onclick="window.postMessage('report','*')" value="REPORT" style=" border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="jump" style="background:red;"  onclick="window.postMessage('jump','*')" value="JUMP" style="border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="acceptdraw1" style="background:#1200ff;"  onclick="window.postMessage('acceptdraw1','*')" value="DRAW" style="border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">

<br>

    </div>


    `

    function setCSS(){
        var css = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        .userlist *{box-sizing:border-box;}


        .userlist {
            display:block;text-align:center;opacity:none;font-size:10pt;color:#1200ff;font-style:italic;
            position:fixed;left:50%;top:3px;padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;
        }

        .userlist input[type=text]{height:20px;border-radius:3px;font-size:9pt;background:brown;color:white;padding-left:3px;}
        .userlist input[type=submit]{height:25px;border-radius:3px;background:#1200ff;}
        .userlist input[type=checkbox]{margin-top:2px;}

        #background{
        z-index:99999;width:0px;height:0px;position:fixed;left:0px;top:0px;
        }
        .option *{box-sizing:border-box;}

        .option {

            display:block;text-align:center;opacity:none;font-size:10pt;color:#1200ff;
            position:fixed;left:28%;top:3px;padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;
        }

        .option input[type=submit],.STBOTbtn button{cursor:pointer;border:none;background:#1200ff;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .option input[type=checkbox]{margin-top:2px;}
        .option input[type=submit]:hover{background:#1200ff;transition:0.2s;}

        .Spider *{box-sizing:border-box;}
        #avatarlist {

            overflow-x:hidden;width:100%;max-height:300px;overflow-y:scroll;
            display:none;text-align:center;opacity:none;font-size:10pt;color:#1200ff;
            position: fixed; left: 35.4%; top: 35%;padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;border:2px solid #1200ff;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:none;height:auto !important;width:400px !important;
        .avatarbtn{display:flex;align-items:center;justify-content:center;}
        .avatarbtn button,.avatarbtn button{cursor:pointer;border:none;background:#1200ff;color:#000000;padding:5px 0px;border-radius:50px;font-size:11pt;margin-top:5px;}
        .avatarbtn button:hover{background:#1200ff;transition:0.2s;}

        }


        #Spider1 {

            overflow-x:hidden;width:100%;max-height:420px;overflow-y:hidden;
            display:block;text-align:center;opacity:none;font-size:10pt;color:#1200ff;
            position: fixed; left: -0.3%; top: 28.5%; transform: translateX(28%);padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;
            border:2px solid #1200ff;border-radius:15px;z-index:999999999;display:block;height:450px !important;width:240px !important;-index:999999999;display:block;height:450px !important;width:240px !important;
        }

        .Spider input[type=submit],.STBOTbtn button{cursor:pointer;border:none;background:#1200ff;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .Spider input[type=checkbox]{margin-top:2px;}
        .Spider input[type=submit]:hover{background:#b70000;transition:0.2s;}
        .Spider input[type=range]{accent-color:#1200ff;}
        .Spider input[type=range]:focus::-webkit-slider-runnable-track { background: #3071A9; }

         #Spider2 {

            overflow-x:hidden;width:100%;max-height:100px;overflow-y:hidden;
            display:block;text-align:center;alignItems:center;opacity:none;font-size:10pt;color:#1200ff;
            position: fixed; left: -2.3%; top: 53%; transform: translateX(28%);padding:0x 0px !important;margin:0px;font-family: 'Roboto', sans-serif;
            z-index:999999999;display:block;height:450px !important;width:100px !important;-index:999999999;display:block;height:450px !important;width:100px !important;
        }
        #Spider3 {

            overflow-x:hidden;width:100%;max-height:57px;overflow-y:hidden;
            display:block;text-align:center;opacity:none;font-size:10pt;color:#1200ff;
            position: fixed; left: -0.3%; top: 46.3%; transform: translateX(28%);padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;
            border:2px solid #1200ff;border-radius:15px;z-index:999999999;display:block;height:450px !important;width:240px !important;-index:999999999;display:block;height:57px !important;width:240px !important;
        }
        #Spider4 {

            overflow-x:hidden;width:100%;max-height:57px;overflow-y:hidden;
            display:block;text-align:center;opacity:none;font-size:10pt;color:#1200ff;
            position: fixed; left: -0.3%; top: 46.3%; transform: translateX(28%);padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;
            border:2px solid #1200ff;border-radius:15px;z-index:999999999;display:block;height:450px !important;width:240px !important;-index:999999999;display:block;height:57px !important;width:240px !important;
        }



        #join{width:20%;}
        .roomlink{display:flex;align-items:center;justify-content:center;}
        .roomlink input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .roomlink input[type=submit],.broadcastbox button{cursor:pointer;border:none;background:#1200ff;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .roomlink button:hover{background:#b70000;transition:0.2s;}
        .botnick input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .broadcastbox{display:flex;align-items:center;justify-content:center;}
        .broadcastbox input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .broadcastbox input[type=submit],.broadcastbox button{cursor:pointer;border:none;background:#1200ff;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .broadcastbox button:hover{background:#b70000;transition:0.2s;}
        .msgbox{display:flex;align-items:center;justify-content:center;}
        .msgbox input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .msgbox input[type=submit],.msgbox button{cursor:pointer;border:none;background:#1200ff;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .msgbox button:hover{background:#b70000;transition:0.2s;}
        .answerbox{display:flex;align-items:center;justify-content:center;}
        .answerbox input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .answerbox input[type=submit],.answerbox button{cursor:pointer;border:none;background:#1200ff;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .answerbox button:hover{background:#b70000;transition:0.2s;}


        .botnick0{width:80%;}
        .botnick1{width:80%;}
        .chooseavatar{width:80%;}
        .broadcastbtn{width:20%;},.broadcastbtn input[type=submit]:hover{background:#b70000;transition:0.2s;}
        .msgbtn{width:20%;}
        .answerbtn{width:20%;}
        .report{width:40%;}
        .kickall{width:40%;}
        .jump{width:40%;}
        .exit{width:40%;}
        .acceptdraw1{width:40%;}
        .acceptdraw2{width:40%;}
        .tips{width:40%;}
        .autoreport input[type=checkbox]{margin-top:32px}
        .autoskip{margin-top:32px;}
        .antikick{margin-top:32px;}
        .antiafk{margin-top:32px;}

        .roomconsole{margin-top:3px; text-align:left; color:#1200ff; font-size:17px;}
        .roomtheme{margin-top:3px; text-align:left; color:#1200ff; font-size:17px;}Number Bot


    `;

 document.querySelector('.broadcastbtnx').addEventListener('click', function() {

    var numTabs = document.getElementById("broadcastx").value;

    var url = "https://www.croxyproxy.com/_tr/?successMessage=WW91ciBhZHZlcnRpc2VtZW50IHN1YnNjcmlwdGlvbiBzdWNjZXNzZnVsbHkgY2FuY2VsbGVk&__cpLangSet=1/#https://gartic.io/"; // replace with the desired URL

    for (var i = 0; i < numTabs; i++) {

      window.open(url, "_blank");

    }

  });
    // Create the button element
// Create the button element
var button = document.createElement("button");
button.style.position = "fixed";
button.style.left = "2px";
button.style.top = "3%";
button.style.transform = "translateY(-50%)";
button.style.background = "red";
button.style.color = "white";
button.style.border = "none";
button.style.padding = "10px 20px";
button.style.borderRadius = "10px";
button.style.cursor = "pointer";
button.style.zIndex = "99999";
button.style.borderRadius = "2px";
button.style.border = "3px solid black";

// Initialize the button's innerHTML with a left-facing arrow icon
button.innerHTML = "&#8594;";

// Add an event listener to the button
button.addEventListener("click", function() {
  var panel = document.getElementById("Spider1");
  var panelx = document.getElementById("panelx"); // assuming you've given the new panel an ID
  var panely = document.getElementById("Spider2");
  var panelz = document.getElementById("Spider3");
  var panels = document.getElementById("Spider4");

  if (panel.style.display === "none" && panelx.style.display === "none") {
    panel.style.display = "block";
    panelx.style.display = "block";
    panely.style.display = "block";
    panelz.style.display = "block";
    panels.style.display = "block";
    var svg = button3.querySelector('svg');
    var svgx = button2.querySelector('svg');

   svg.setAttribute('stroke', '#1200ff');
   svgx.setAttribute('stroke', '#ffffff');
    button.innerHTML = "&#8594;"; // Change the icon to a right-facing arrow
  } else {
    panel.style.display = "none";
    panelx.style.display = "none";
    panely.style.display = "none";
    panelz.style.display = "none";
    panels.style.display = "none";
    button.innerHTML = "&#8592;"; // Change the icon back to a left-facing arrow
  }
});

// Add the button to the body
document.body.appendChild(button);

        // Create the panel element
var panelx = document.createElement("div");
panelx.style.width = "45px";
panelx.style.height = "80px";
panelx.style.backgroundColor = "#000";
panelx.style.borderRadius = "50px";
panelx.style.border = "2px solid rgb(255 0 0)";
panelx.style.position = "fixed";
panelx.style.left = "7px";
panelx.style.top = "37.5%";
panelx.id = "panelx";
panelx.style.display = "flex";
panelx.style.flexDirection = "column";
panelx.style.justifyContent = "center";
panelx.style.alignItems = "center";
panelx.style.textAlign = "center";
panelx.style.zIndex = "99999";


// Create three buttons


var button2 = document.createElement("button");
button2.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 24 24' fill='none' stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9'/><path d='M9 22V12h6v10M2 10.6L12 2l10 8.6'/></svg>";
button2.style.marginBottom = "10px";
button2.style.marginTop = "7px";
button2.style.zIndex = "99999";
button2.addEventListener("click", function() {

    var svg = button3.querySelector('svg');
    var svgx = button2.querySelector('svg');


   svg.setAttribute('stroke', '#1200ff');
   svgx.setAttribute('stroke', '#ffffff');


  var panel = document.getElementById("Spider1");
  var panelx = document.getElementById("panelx"); // assuming you've given the new panel an ID
  var panely = document.getElementById("Spider2");
  var panelz = document.getElementById("Spider3");
  var panels = document.getElementById("Spider4");

    panelz.style.display = "none";
    panel.style.display = "block";
    panelx.style.display = "block";
    panely.style.display = "block";
    panels.style.display = "none";

});

var button3 = document.createElement("button");
button3.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 24 24' fill='none' stroke='#1200ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path><circle cx='12' cy='7' r='4'></circle></svg>";
button3.style.marginBottom = "7px";
button3.style.zIndex = "99999";

button3.addEventListener("click", function() {

    var svg = button3.querySelector('svg');
    var svgx = button2.querySelector('svg');

   svg.setAttribute('stroke', '#ffffff');
   svgx.setAttribute('stroke', '#1200ff');



  var panel = document.getElementById("Spider1");
  var panelx = document.getElementById("panelx"); // assuming you've given the new panel an ID
  var panely = document.getElementById("Spider2");
  var panelz = document.getElementById("Spider3");
  var panels = document.getElementById("Spider4");

    panel.style.display = "none";
    panelx.style.display = "block";
    panely.style.display = "none";
    panelz.style.display = "block";
    panels.style.display = "none";

});


// Add buttons to panel

panelx.appendChild(button2);
panelx.appendChild(button3);

// Add panel to body
document.body.appendChild(panelx);




        GM_addStyle(css);
        f(".kickallwhenjoin").addEventListener("change",()=>{
            GM_setValue("kicknewset",f(".kickallwhenjoin").checked)
        })
        f(".kickonjoin").addEventListener("change",()=>{
            GM_setValue("kickjoinset",f(".kickonjoin").checked)
        })
    }

    window.addEventListener("message",function(event){
        if(typeof(event.data)==="string"){
            if(event.data=="join"){
                f("#roomlink").value==""?f("#roomlink").value=window.location.href:0
                botc=0;GM_setValue("resetcount",rand())
                readyc=0
                GM_sendMessage("join",f("#roomlink").value.split("/")[3],f("#botnick").value,avatar,localStorage.getItem("botnick"),f(".kickonjoin").checked,rand())
            }
            if(event.data.indexOf("kickuser.")!=-1){
                let userid=event.data.split("kickuser.")[1]
                GM_setValue("kick",userid+".."+num(10000))
            }

        if(event.data=="broadcast"){
                GM_setValue("broadcast",f("#broadcast").value+"►"+num(5000))
        }
        if(event.data=="chat"){
                GM_setValue("msg",f("#message").value+"►"+num(5000))
        }
        if(event.data=="answer"){
                GM_setValue("answer",f("#answer").value+"►"+num(5000))
        }
        if(event.data=="report"){
            GM_setValue('report', num(5000));
        }
        if(event.data=="jump"){
            GM_setValue('jump', num(5000));
        }
        if(event.data=="acceptdraw1"){
            GM_setValue('acceptdraw1', num(5000));
        }
        if(event.data=="acceptdraw2"){
            GM_setValue('acceptdraw2', num(5000));
        }
         if(event.data=="tips"){
            GM_setValue('tips', num(5000));
         }
        if(event.data=="exit"){
            GM_setValue('exit', num(5000));
        }


                   if(event.data=="kickall"){
  var elements = document.getElementsByClassName("kickmenubtn");
var elementsvalue = [];

for (var i = 0; i < elements.length; i++) {
  elementsvalue.push(elements[i].getAttribute("onclick"));
}

elementsvalue.forEach(function(value, index) {
  setTimeout(function() {
    let userid = value.split("kickuser.")[1].split("','*")[0];

                    GM_setValue("kick",userid+".."+num(10000))
  }, 550 * index);
})}
            if(event.data=="broadcastspamtoggle"){
            let broadcastspamMS=parseInt(localStorage.getItem("broadcastspam"))
            var broadcastspam = f("#broadcastspam").value
            intervalbroadcast=setInterval(()=>{
                GM_setValue("broadcast",broadcastspam+"►"+num(5000))
            },broadcastspamMS)
        f("#broadcaststart").style.display="none"
        f("#broadcaststop").style.display="block"
        }
        if(event.data=="chatspamtoggle"){
            let messagespamMS=parseInt(localStorage.getItem("messagespam"))
            var messagespam = f("#messagespam").value
            intervalmsg=setInterval(()=>{
            var chatspam = f("#messagespam").value
                GM_setValue("msg",chatspam+"►"+num(5000))
            },messagespamMS)
        f("#msgstart").style.display="none"
        f("#msgstop").style.display="block"
        }
        if(event.data=="answerspamtoggle"){
            let answerspamMS=parseInt(localStorage.getItem("answerspam"))
            var answerspam = f("#answerspam").value
            intervalanswer=setInterval(()=>{
            var answerspam = f("#answerspam").value
                GM_setValue("answer",answerspam+"►"+num(5000))
            },answerspamMS)
        f("#answerstart").style.display="none"
        f("#answerstop").style.display="block"
        }
        if(event.data=="stopbroadcast"){
        clearInterval(intervalbroadcast)
        f("#broadcaststart").style.display="block"
        f("#broadcaststop").style.display="none"
        }
        if(event.data=="stopmsg"){
        clearInterval(intervalmsg)
        f("#msgstart").style.display="block"
        f("#msgstop").style.display="none"
        }
        if(event.data=="stopanswer"){
        clearInterval(intervalanswer)
        f("#answerstart").style.display="block"
        f("#answerstop").style.display="none"
        }

        }
    })

    localStorage.getItem("botc")?0:window.localStorage.setItem("botc",0)
    GM_setValue("resetcount",rand())
    //
    setInterval(()=>{
        if(f("#users")){
            fa(".kickmenubtn").forEach(ele=>{
                f(".scrollElements").innerText.indexOf(ele.value)==-1?ele.remove():0
            })
            f("g")?f("g").remove():0;
        }
        if(f("input[name=chat]")){
            f(".contentPopup")&&f(".btYellowBig.ic-yes")?f(".btYellowBig.ic-yes").click():0;

            if(f(".contentPopup .nick")&&f(".ic-votekick")&&otoeven==0){
                otoeven=1//
                f(".close").addEventListener("click",()=>{otoeven=0})
                f(".ic-ignore").addEventListener("click",()=>{otoeven=0})
                f(".ic-votekick").addEventListener("click",()=>{
                    otoeven=0
                    GM_setValue("kick",f(".contentPopup .nick").innerText+".."+num(10000))
                })
            }
        }
        f("input[name=chat]")?f("input[name=chat]").setAttribute("placeholder",+botc+" bot aktif"):0
        f(".taktifbot")?f(".taktifbot").innerText=botc:0

        if(f("#background")&&!f(".userlist")&&!f(".option")&&!f(".Spider")){
            f("#background").innerHTML+=html
            setCSS()
        }
    },100)
    GM_addValueChangeListener("botekle", function(I,C,E,b) {
        botc++
        f(".taktifbot")?f(".taktifbot").innerText=botc:0
    })

    GM_addValueChangeListener("ready", function(I,C,E,b) {
        readyc++
        readyc>=botc&&botc!=0?GM_setValue("join",rand()):0
    })

    GM_addValueChangeListener("botexit", function(I,C,E,b) {
        //botc--
    })
}