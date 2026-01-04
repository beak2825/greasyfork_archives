// ==UserScript==
// @name           ST BOT v1
// @description    Bot Panel for gartic.io
// @version        1.1
// @author         STRAGON
// @license        MIT
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant           GM_openInTab
// @namespace https://greasyfork.org/users/1220697
// @downloadURL https://update.greasyfork.org/scripts/504115/ST%20BOT%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/504115/ST%20BOT%20v1.meta.js
// ==/UserScript==



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

    GM_onMessage("join", (room,nick,avatar,botnick,kickonjoin,_) => {
        fetch("https://"+window.location.href.split("/")[2]+"/server?check=1&v3=1&room="+room+"&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8#").then(x=>x.text()).then(x=>{
            let ws=new WebSocket("wss://"+window.location.href.split("/")[2]+"/__cpw.php?u="+btoa("wss://"+x.split("https://")[1].split(".")[0]+".gartic.io/socket.io/?c="+x.split("?c=")[1]+"&EIO=3&transport=websocket")+"&o=aHR0cHM6Ly9nYXJ0aWMuaW8=");
           ws.onopen=()=>{
                let inter=setInterval(()=>{
                GM_setValue("ready",rand())
                    if(tojoin==1){
                        tojoin=0
if (botnick === '0') {
     ws.send('42[3,{"v":20000,"nick":"' + rnext(nick) + '","avatar": 17 ,"platform":69 ,"sala":"' + room.substring(2) + '"}]')
} else if (botnick === '1') {
      ws.send('42[3,{"v":20000,"nick":"'+rnext(nick)+'","avatar":'+randomNumber+',"platform":69,"sala":"'+room.substring(2)+'"}]')
}
                        clearInterval(inter)
                    }
                },50)
                }
            ws.onclose=()=>{
                wss.length=0
                ws.close();
            }
            ws.onmessage=(msg)=>{

                if(msg.data.indexOf('42["23"')!=-1){
                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")
                    usersinroom.push(user)
                    if(kicknewstat){typeof(user.id)=="string"?ws.send('42[45,'+ws.id+',["'+user.id+'",true]]'):ws.send('42[45,'+ws.id+',['+user.id+',true]]');}
                }
                if(msg.data.indexOf('42["5"')!=-1){
                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                    ws.theme=objlist[4].tema
                    ws.room=objlist[4].codigo
                    ws.id=objlist[2]
                    objlist[5].forEach(item=>{usersinroom.push(item)})
                    let targetid=objlist[5][0].id
                    botID = objlist[2]
                    botlongID = objlist[1]
                    theme = objlist[4].tema
                    setTimeout(()=>{
                    f(".roomtheme").innerHTML= theme},10)
                    setTimeout(()=>{
                    GM_sendMessage("botsidvalue",botlongID,rand())},777)
                    setTimeout(()=>{
                    GM_sendMessage("updatelist",botID,rand())},777)

                    kickjoinstat?typeof(targetid)=="string"?ws.send('42[45,'+ws.id+',["'+targetid+'",true]]'):ws.send('42[45,'+ws.id+',['+targetid+',true]]'):0
                    ws.send('42[46,'+objlist[2]+']')



       GM_onMessage('answerinput', (atılacak, _) => {
       f('#answer').value= atılacak
    })

GM_onMessage("botsidvalue", (datachangex, _) => {

 botsidvalue.push(datachangex)
});
GM_onMessage("updatelist", (datachangex, _) => {
      GM_sendMessage("updatebotidlist",botsidvalue,rand())
});
GM_onMessage("updatebotidlist", (datachangex, _) => {

  if (!botsidvalue.includes(datachangex)) {
    addItem(botsidvalue,...datachangex);
  }
            botsidvalue = arrayFilter(botsidvalue);
});

    GM_addValueChangeListener("broadcast", function(I,C,E,b) {
   ws.send('42[11,'+objlist[2]+',"'+E.split("►")[0]+'"]')
   ws.send('42[13,'+objlist[2]+',"'+E.split("►")[0]+'"]')
});
    GM_addValueChangeListener("msg", function(I,C,E,b) {
   ws.send('42[11,'+objlist[2]+',"'+E.split("►")[0]+'"]')
})
    GM_addValueChangeListener("answer", function(I,C,E,b) {
   ws.send('42[13,'+objlist[2]+',"'+E.split("►")[0]+'"]')
})
    GM_addValueChangeListener("report", function(I,C,E,b) {
    ws.send('42[35,'+objlist[2]+']')
});
    GM_addValueChangeListener("jump", function(I,C,E,b) {
    ws.send('42[25,'+objlist[2]+']')
});
    GM_addValueChangeListener("acceptdraw1", function(I,C,E,b) {
    ws.send('42[34,'+objlist[2]+']')
});
    GM_addValueChangeListener("acceptdraw2", function(I,C,E,b) {
    ws.send('42[34,'+objlist[2]+',1]')
});

    GM_addValueChangeListener("tips", function(I,C,E,b) {
    ws.send('42[30,'+objlist[2]+',1]')
});

    GM_addValueChangeListener("exit", function(I,C,E,b) {
    ws.send('42[24,'+objlist[2]+']')
    wss.lenghth=0
    usersinroom.length=0
});

    GM_addValueChangeListener("kick", function(I,C,E,b) {
                              if(!botsidvalue.includes(E.split("..")[0])){
                ws.send('42[45,'+objlist[2]+',["'+E.split("..")[0]+'",true]]')}
                              })


                    JSON.stringify(wss).indexOf(objlist[2])==-1?wss.push({"ws":ws,"id":objlist[2],"lengthID":objlist[1]}):0
                    let interval=setInterval(()=>{
                        ws.readyState==1?ws.send('42[42,'+objlist[2]+']'):clearInterval(interval)
                        ws.readyState==1?ws.send('2'):clearInterval(interval)
                    },20000);
                }
                if(msg.data.indexOf('42["34"')!=-1){
                    let objlist=JSON.parse('["34"'+msg.data.split('42["34"')[1])
                    var cdd=objlist[1]

                GM_sendMessage('answerinput', cdd, rand());

                }

            }
        })
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
  localStorage.setItem("nick", "ST BOT");
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
    if(msg.data=="showavatarlist"){
        f("#STBOT1").style.display="none"
        f("#avatarlist").style.display="block"
    }
    if(msg.data=="hideavatarlist"){
        f("#STBOT1").style.display="block"
        f("#avatarlist").style.display="none"
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
            user.nick.split("‏").join("")!="STBOT"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.id+`','*')">`:0
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

    <div id="STBOT1" class="STBOT">
    <h2 style="color:white;margin-top: 10px;">ST BOT V1</h2>
    <input type="text" id="roomlink" placeholder="Room link" style="border-radius: 5px; border: 2px solid white; width: 75%; height: 30px;padding: 10px;background-color: #000000; color:white; margin-top: 10px;">
    <input type="submit" id="join" onclick="window.postMessage('join','*')" value="JOIN" style="border-radius: 5px; width: 20%; cursor: pointer; height: 30px;color: #ffffff;">
       <input type="text" id="botnick" oninput="window.postMessage('nick','*')" placeholder="Bot nick" value="`+localStorage.getItem("nick")+`" style="border-radius: 5px; width: 95%; height: 30px; margin-top: 5px; border: 2px solid white;padding: 10px;background-color: #000000; color:white;  margin-top: 10px;">
       <input type="submit" class="botnick0" onclick="window.postMessage('botnick0','*')" value="Normal Avatar"style="width: 47%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="botnick1" onclick="window.postMessage('botnick1','*')" value="Random Avatar"style="width: 47%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;"><br>
    <div class="broadcastbox">
    <input type="text" id="broadcast" placeholder="Broadcast" style="border-radius: 5px; width: 70%; height: 30px; border: 2px solid white;padding: 10px;background-color: #000000; color:white; ">
    <button class="broadcastbtn"  onclick="window.postMessage('broadcast','*')" value="Broadcast"style="border-radius: 5px;height: 30px;color: #ffffff;margin-top: 10px;margin-left: 4px;">Send
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <div class="msgbox"><input type="text" id="message" placeholder="Message" style="border-radius: 5px; border: 2px solid white; padding: 10px; background-color: #000000; color:white; "><button class="msgbtn" onclick="window.postMessage('chat','*')" value="Message" style="border-radius: 5px;height: 30px;color: #ffffff;margin-top: 10px;margin-left: 4px;">Send
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    <div class="answerbox"><input type="text" id="answer" placeholder="Answer" style="border-radius: 5px; width: 70%; height: 30px; border: 2px solid white; padding: 10px; background-color: #000000; color:white; "><button class="answerbtn" onclick="window.postMessage('answer','*')" value="Answer" style="border-radius: 5px;height: 30px;color: #ffffff;margin-top: 10px;margin-left: 4px;">Send
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
    
    <input type="submit" class="kickall" onclick="window.postMessage('kickall','*')" value="KICK ALL"style="width: 95%; border-radius: 5px;height: 30px;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="exit" onclick="window.postMessage('exit','*')" value="EXIT" style="border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="report" onclick="window.postMessage('report','*')" value="REPORT" style=" border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="jump" onclick="window.postMessage('jump','*')" value="JUMP" style="border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">
    <input type="submit" class="acceptdraw1" onclick="window.postMessage('acceptdraw1','*')" value="DRAW" style="border-radius: 5px;height: 30px;width: 47%;color: #ffffff;margin-top: 7px;">
    
<br>
    
    <h2 class="roomconsole"></h2><span><h2 class="roomtheme"></h2></span>
    </div>
    <div id="STBOT2" class="STBOT">
    <div class="broadcastbox"><input type="text" id="broadcastspam" placeholder="Broadcast (spam)"><button class="broadcastbtn" id="broadcaststart" onclick="window.postMessage('broadcastspamtoggle','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm-.534-12.998A1.2 1.2 0 0 0 9.6 9.6v4.8a1.2 1.2 0 0 0 1.866.998l3.6-2.4a1.2 1.2 0 0 0 0-1.996l-3.6-2.4Z" clip-rule="evenodd"></path></svg>
  </button>
  <button class="broadcastbtn" id="broadcaststop" onclick="window.postMessage('stopbroadcast','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path></svg>
  </button></div>
    <div class="msgbox"><input type="text" id="messagespam" placeholder="Message (spam)"><button class="msgbtn" id="msgstart" onclick="window.postMessage('chatspamtoggle','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm-.534-12.998A1.2 1.2 0 0 0 9.6 9.6v4.8a1.2 1.2 0 0 0 1.866.998l3.6-2.4a1.2 1.2 0 0 0 0-1.996l-3.6-2.4Z" clip-rule="evenodd"></path></svg>
  </button>
  <button class="msgbtn" id="msgstop" onclick="window.postMessage('stopmsg','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path></svg>
  </button></div>
    <div class="answerbox"><input type="text" id="answerspam" placeholder="Answer (spam)"><button class="answerbtn" id="answerstart" onclick="window.postMessage('answerspamtoggle','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm-.534-12.998A1.2 1.2 0 0 0 9.6 9.6v4.8a1.2 1.2 0 0 0 1.866.998l3.6-2.4a1.2 1.2 0 0 0 0-1.996l-3.6-2.4Z" clip-rule="evenodd"></path></svg>
  </button>
  <button class="answerbtn" id="answerstop" onclick="window.postMessage('stopanswer','*')">
  <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd"></path></svg>
  </button></div>
<h2 class="broadcastspamvalue" id="broadcastms"></h2>
<input class="broadcastspam" type="range" oninput="postMessage('broadcastspam')" min="1000" max="32000">
<h2 class="messagespamvalue" id="messagems"></h2>
<input class="messagespam" type="range" oninput="postMessage('messagespam')" min="1000" max="10000">
<h2 class="answerspamvalue" id="answerms"></h2>
<input class="answerspam" type="range" oninput="postMessage('answerspam')" min="1000" max="10000">
    </div>
    <div id="STBOT3" class="STBOT">
    <h2 class="customkick">Custom kick</h2>
    <div class="kicklistbox">
    <input type="text" id="kicklistinput" placeholder="Player name">
    <input type="submit" id="kicklistaddbtn" onclick="window.postMessage('customkickadd','*')" value="add">
</div>
    <input type="submit" id="kicklistremoveallbtn" onclick="window.postMessage('customkickremoveall','*')" value="remove all">
    </div>
    <div id="STBOT4" class="STBOT">
<div class="autoguessstyle">
    <h2 id="autoguesstext">Auto guess &nbsp;</h2>
    <input type="submit" id="autoguessenable" class="autoguess" onclick="window.postMessage('autoguessenable','*')" value="enable">
    <input type="submit" id="autoguessdisable" class="autoguess" onclick="window.postMessage('autoguessdisable','*')" value="disable"></div>
    `

    function setCSS(){
        var css = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        .userlist *{box-sizing:border-box;}


        .userlist {
            display:block;text-align:center;opacity:none;font-size:10pt;color:#ff0000;font-style:italic;
            position:fixed;left:50%;top:3px;padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;
        }

        .userlist input[type=text]{height:20px;border-radius:3px;font-size:9pt;background:brown;color:white;padding-left:3px;}
        .userlist input[type=submit]{height:25px;border-radius:3px;background:#ff0000;}
        .userlist input[type=checkbox]{margin-top:2px;}

        #background{
        z-index:99999;width:0px;height:0px;position:fixed;left:0px;top:0px;
        }
        .option *{box-sizing:border-box;}

        .option {

            display:block;text-align:center;opacity:none;font-size:10pt;color:#ff0000;
            position:fixed;left:28%;top:3px;padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;
        }

        .option input[type=submit],.STBOTbtn button{cursor:pointer;border:none;background:#ff0000;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .option input[type=checkbox]{margin-top:2px;}
        .option input[type=submit]:hover{background:#b70000;transition:0.2s;}

        .STBOT *{box-sizing:border-box;}
        
        #STBOT1 {

            overflow-x:hidden;width:100%;max-height:380px;overflow-y:hidden;
            display:block;text-align:center;opacity:none;font-size:10pt;color:#ff0000;
            position: fixed; left: -2%; top: 30%; transform: translateX(28%);padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;
            border:2px solid #ff0000;border-radius:15px;z-index:999999999;display:block;height:450px !important;width:240px !important;-index:999999999;display:block;height:450px !important;width:240px !important;
        }
        
        .STBOT input[type=submit],.STBOTbtn button{cursor:pointer;border:none;background:#ff0000;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .STBOT input[type=checkbox]{margin-top:2px;}
        .STBOT input[type=submit]:hover{background:#b70000;transition:0.2s;}
        .STBOT input[type=range]{accent-color:#ff0000;}
        .STBOT input[type=range]:focus::-webkit-slider-runnable-track { background: #3071A9; }


        #join{width:20%;}
        .roomlink{display:flex;align-items:center;justify-content:center;}
        .roomlink input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .roomlink input[type=submit],.broadcastbox button{cursor:pointer;border:none;background:#ff0000;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .roomlink button:hover{background:#b70000;transition:0.2s;}
        .botnick input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .broadcastbox{display:flex;align-items:center;justify-content:center;}
        .broadcastbox input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .broadcastbox input[type=submit],.broadcastbox button{cursor:pointer;border:none;background:#ff0000;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .broadcastbox button:hover{background:#b70000;transition:0.2s;}
        .msgbox{display:flex;align-items:center;justify-content:center;}
        .msgbox input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .msgbox input[type=submit],.msgbox button{cursor:pointer;border:none;background:#ff0000;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
        .msgbox button:hover{background:#b70000;transition:0.2s;}
        .answerbox{display:flex;align-items:center;justify-content:center;}
        .answerbox input[type=text]{margin-top:10px !important;width:75% !important;height:30px !important;}
        .answerbox input[type=submit],.answerbox button{cursor:pointer;border:none;background:#ff0000;color:#000000;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}
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

        .roomconsole{margin-top:3px; text-align:left; color:#ff0000; font-size:17px;}
        .roomtheme{margin-top:3px; text-align:left; color:#ff0000; font-size:17px;}


    `;
    
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

        if(f("#background")&&!f(".userlist")&&!f(".option")&&!f(".STBOT")){
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