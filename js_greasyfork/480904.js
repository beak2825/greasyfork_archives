// ==UserScript==
// @name         RedBOT v4 - fixe fix edition
// @namespace    http://tampermonkey.net/
// @version      4.0.1
// @description  redbot v4 gartic.io hack script garticin fixine fix youtube: jokescript kanalından nasıl kullanılacağını öğren
// @author       YGN
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/480904/RedBOT%20v4%20-%20fixe%20fix%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/480904/RedBOT%20v4%20-%20fixe%20fix%20edition.meta.js
// ==/UserScript==

function f(ygn){return document.querySelector(ygn)}
function fa(ygn){return document.querySelectorAll(ygn)}
function rc(ygn){let e=f('input[name="chat"]');let lv=e.value;e.value="";let ev=new Event('input',{bubbles:true});ev.simulated=true;let t=e._valueTracker;if(t){t.setValue(lv);};e.dispatchEvent(ev);}
function rs(ygn){let e=f(".search input");let lv=e.value;e.value="";let ev=new Event('input',{bubbles:true});ev.simulated=true;let t=e._valueTracker;if(t){t.setValue(lv);};e.dispatchEvent(ev);}
function num(ygn){return Math.ceil(Math.random()*ygn+1)}
function removeOldItems(data){const now = Date.now();const newData = data.filter(item => (now - item.timestamp) <= (6 * 60 * 60 * 1000));return newData;}
function rnext(kelime) {const hd = kelime.split('');const hu = hd.length;const yh = [];for (let i = 0; i < hu; i++) {yh.push(hd[i]);if (i < hu - 1){const re = Math.floor(Math.random() * 3);const eh = '‏'.repeat(re);yh.push(eh);}}return yh.join('');}

let cmd="",wss=[],tojoin=0,usersinroom=[]

if(window.location.href.indexOf("aHR0cHM6Ly9nYXJ0aWMuaW8")!=-1){
    let room,kicknewstat=false,kickjoinstat=false,waitforkick=0

    document.body.innerHTML=`
        <h2 style="line-height:40px;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);">BU SEKME HAZIR. CROXYPROXY.COM ADRESİNDEN BAŞKA BOT SEKMESİ AÇABİLİR YA DA GARTİC.İO ADRESİNDEN BOT ATMAYA BAŞLAYABİLİRSİN.</h2>
    `
    GM_setValue("botekle",num(6000))

    GM_addValueChangeListener("resetcount", function(n,o,nv,r) {
        GM_setValue("botekle",num(6000))
    })
    setTimeout(()=>{waitforkick=0},1000)

    GM_addValueChangeListener("gir", function(n,o,nv,r) {
        room=nv.split(".")[0]
        fetch("https://"+window.location.href.split("/")[2]+"/server?check=1&v3=1&room="+room+"&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8#").then(x=>x.text()).then(x=>{
            let myws=new WebSocket("wss://"+window.location.href.split("/")[2]+"/__cpw.php?u="+btoa("wss://"+x.split("https://")[1].split(".")[0]+".gartic.io/socket.io/?c="+x.split("?c=")[1]+"&EIO=3&transport=websocket")+"&o=aHR0cHM6Ly9nYXJ0aWMuaW8=");
            myws.onopen=()=>{
                GM_setValue("ready",num(6000))
                let inter=setInterval(()=>{
                    if(tojoin==1){
                        tojoin=0
                        myws.send('42[3,{"v":20000,"nick":"'+rnext("REDbot")+'","avatar":1,"platform":0,"sala":"'+room.slice(-4)+'"}]')
                        clearInterval(inter)
                    }
                },50)
                }
            myws.onclose=()=>{
                wss.length=0
                myws.close();
            }
            myws.onmessage=(msg)=>{
                if(msg.data.indexOf('42["23"')!=-1){
                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")
                    usersinroom.push(user)
                    if(waitforkick==0&&user.nick.split("‏").join("")!="REDbot"&&kicknewstat){typeof(user.id)=="string"?myws.send('42[45,'+myws.id+',["'+user.id+'",true]]'):myws.send('42[45,'+myws.id+',['+user.id+',true]]');waitforkick=1}
                }
                if(msg.data.indexOf('42["5"')!=-1){
                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])
                    myws.id=objlist[2]
                    objlist[5].forEach(item=>{usersinroom.push(item)})
                    let targetid=objlist[5][0].id
                    kickjoinstat?typeof(targetid)=="string"?myws.send('42[45,'+myws.id+',["'+targetid+'",true]]'):myws.send('42[45,'+myws.id+',['+targetid+',true]]'):0
                    myws.send('42[46,'+objlist[2]+']')
                    JSON.stringify(wss).indexOf(objlist[2])==-1?wss.push({"ws":myws,"id":objlist[2],"lengthID":objlist[1]}):0
                    let interval=setInterval(()=>{
                        myws.readyState==1?myws.send('42[42,'+objlist[2]+']'):clearInterval(interval)
                        myws.readyState==1?myws.send('2'):clearInterval(interval)
                    },20000);
                    setTimeout(()=>{wss.forEach(item=>{item.ws.send('42[24,'+item.id+']');wss.length=0;usersinroom.length=0;GM_setValue("gir",room)})},100*1000)
                }
            }
        })
    });
    GM_addValueChangeListener("çık", function(n,o,nv,r) {
        wss.forEach(item=>{item.ws.send('42[24,'+item.id+']')})
        wss.length=0
        usersinroom.length=0
    });
    GM_addValueChangeListener("join", function(n,o,nv,r) {
        tojoin=1
    });//42[11,1700993873558,"sa"]
    GM_addValueChangeListener("msg", function(n,o,nv,r) {
        wss.forEach(item=>{item.ws.send('42[11,'+item.id+',"'+nv.split("►")[0]+'"]')})
    });
    GM_addValueChangeListener("kicknewset", function(n,o,nv,r) {
        kicknewstat=nv
    });
    GM_addValueChangeListener("kickjoinset", function(n,o,nv,r) {
        kickjoinstat=nv
    });
    GM_addValueChangeListener("rep", function(n,o,nv,r) {
        wss.forEach(item=>{item.ws.send('42[35,'+item.id+']')})
    });
    GM_addValueChangeListener("kickle", function(n,o,nv,r) {
        let username=nv.split("..")[0],userid
        usersinroom.forEach(x=>{
            if(x.nick==username){
                let userid=x.id
                wss.forEach(ws=>{
                    x.nick.split("‏").join("")!="REDbot"?typeof(userid)=="string"?ws.ws.send('42[45,'+ws.id+',["'+userid+'",true]]'):ws.ws.send('42[45,'+ws.id+',['+userid+',true]]'):0
                })
            }
        })

    });
    window.addEventListener("beforeunload",()=>{
        GM_setValue("botçıkar",window.location.href.split("/")[2]+"--"+num(3131))
    })
}

if(window.location.href.indexOf("gartic.io")!=-1){
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
            user.nick.split("‏").join("")!="REDbot"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.nick+`','*')">`:0
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
    <div class="rb4">
    <h3 style="color:tomato;">redbot v4 <span style="font-size:9pt;">(<span style="font-size:9pt;" class="taktifbot">0</span> bot)</span></h3>
    <input type="text" style="width:140px;" class="roomlink" placeholder="oda linki">
    <input type="submit" style="width:25px;" onclick="window.postMessage('gir','*')" value="gir">
    <input type="submit" style="width:25px;" onclick="window.postMessage('çık','*')" value="çık"><br>
    <input type="text" style="width:100px;" class="mesg" placeholder="chat mesaj">
    <input type="submit" style="width:45px;" onclick="window.postMessage('mess','*')" value="gönder">
    <input type="submit" style="width:45px;" onclick="window.postMessage('rep','*')" value="report"><br>
    <input type="checkbox" class="kickonjoin">&nbsp;&nbsp;&nbsp;girişte ilk sıradakini oyla<br>
    <input type="checkbox" class="kicknew">&nbsp;yeni giren oyuncuları oyla<hr>
    <div class="userkickmenu"></div>
    </div>
    `

    function setCSS(){
        var css = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        .rb4 *{box-sizing:border-box;}


        .rb4{
            display:block;text-align:center;opacity:0.9;font-size:10pt;color:tomato;font-style:italic;
            position:fixed;left:50%;top:3px;padding:5px 3px !important;margin:0px;background:#101112;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;
        }
        .rb4 input[type=text]{height:20px;border-radius:3px;font-size:9pt;background:brown;color:white;padding-left:3px;}
        .rb4 input[type=submit]{height:20px;border-radius:3px;background:tomato;}
        .rb4 input[type=checkbox]{margin-top:2px;}

        #background{
        z-index:999;width:0px;height:0px;position:fixed;left:0px;top:0px;
        }

    `;
        GM_addStyle(css);
        f(".kicknew").addEventListener("change",()=>{
            GM_setValue("kicknewset",f(".kicknew").checked)
        })
        f(".kickonjoin").addEventListener("change",()=>{
            GM_setValue("kickjoinset",f(".kickonjoin").checked)
        })
    }

    window.addEventListener("message",function(event){
        if(typeof(event.data)==="string"){
            if(event.data=="gir"){
                f(".roomlink").value==""?f(".roomlink").value=window.location.href:0
                botc=0;GM_setValue("resetcount",num(10000))
                readyc=0
                GM_setValue("gir",f(".roomlink").value.split("/")[3]+"."+num(5000)+"."+f(".kickonjoin").checked)
            }
            if(event.data.indexOf("kickuser.")!=-1){
                let username=event.data.split("kickuser.")[1]
                GM_setValue("kickle",username+".."+num(10000))
            }
            if(event.data=="çık"){
                GM_setValue("çık",num(5000))
                botc=0
                GM_setValue("resetcount",num(10000))
            }
            if(event.data=="rep"){
                GM_setValue("rep",num(5000))
            }
            if(event.data=="mess"){
                GM_setValue("msg",f(".mesg").value+"►"+num(5000))
                f(".mesg").value=""
            }
        }
    })

    localStorage.getItem("botc")?0:window.localStorage.setItem("botc",0)
    GM_setValue("resetcount",num(10000))
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
            if(f("input[name=chat]").value=="!gir"){
                botc=0;GM_setValue("resetcount",num(10000))
                rc()
                readyc=0
                GM_setValue("gir",window.location.href.split("/")[3]+"."+num(5000))
            }
            if(f("input[name=chat]").value=="!yenile"){
                GM_setValue("resetcount",num(10000))
                rc()
            }
            if(f("input[name=chat]").value=="!çık"){
                rc()
                GM_setValue("çık",window.location.href.split("/")[3]+"."+num(5000))
            }
            if(f("input[name=chat]").value=="!rep"){
                rc()
                GM_setValue("rep",window.location.href.split("/")[3]+"."+num(5000))
            }
            if(f(".contentPopup .nick")&&f(".ic-votekick")&&otoeven==0){
                otoeven=1//
                f(".close").addEventListener("click",()=>{otoeven=0})
                f(".ic-ignore").addEventListener("click",()=>{otoeven=0})
                f(".ic-votekick").addEventListener("click",()=>{
                    otoeven=0
                    GM_setValue("kickle",f(".contentPopup .nick").innerText+".."+num(10000))
                })
            }
        }
        f("input[name=chat]")?f("input[name=chat]").setAttribute("placeholder",+botc+" bot aktif"):0
        f(".taktifbot")?f(".taktifbot").innerText=botc:0

        if(f("#background")&&!f(".rb4")){
            f("#background").innerHTML+=html
            setCSS()
        }
    },100)
    GM_addValueChangeListener("botekle", function(n,o,nv,r) {
        botc++
        f(".taktifbot")?f(".taktifbot").innerText=botc:0
    })

    GM_addValueChangeListener("ready", function(n,o,nv,r) {
        readyc++
        readyc>=botc&&botc!=0?GM_setValue("join",num(1000)):0
    })

    GM_addValueChangeListener("botçıkar", function(n,o,nv,r) {
        //botc--
    })
}