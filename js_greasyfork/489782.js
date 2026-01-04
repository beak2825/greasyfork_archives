// ==UserScript==
// @name         YGN RedBOT v3
// @namespace    http://tampermonkey.net/
// @version      3.7.88
// @description  Gartic.io RedBOT v3 [OPENSOURCE]
// @author       YGN
// @match        *://*/*
// @icon         https://gartic.io/static/images/avatar/svg/1.svg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/489782/YGN%20RedBOT%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/489782/YGN%20RedBOT%20v3.meta.js
// ==/UserScript==

//TANIMLAMALAR

function f(ygn){return document.querySelector(ygn)}
function fa(ygn){return document.querySelectorAll(ygn)}
function obj(x){let r="";for(let i in x){r+=String.fromCharCode(x[i].charCodeAt(0)-7)}return r.slice(4,10);}
function removeOldItems(data){const now = Date.now();const newData = data.filter(item => (now - item.timestamp) <= (6 * 60 * 60 * 1000));return newData;}
function rnext(kelime) {const hd = kelime.split('');const hu = hd.length;const yh = [];for (let i = 0; i < hu; i++) {yh.push(hd[i]);if (i < hu - 1){const re = Math.floor(Math.random() * 3);const eh = '‏'.repeat(re);yh.push(eh);}}return yh.join('');}

function kickUser(userid,typein,mindex){
    if(typein=="justone"){
        let ws = botsInGame[mindex]
        typeof(userid)=="string"?botsIDInGame.indexOf(userid)==-1?ws.send('42[45,'+ws.id+',["'+userid+'",true]]'):0:botsIDInGame.indexOf(userid)==-1?ws.send('42[45,'+ws.id+',['+userid+',true]]'):0;
    }else{
        botsInGame.forEach(ws=>{
            typeof(userid)=="string"?botsIDInGame.indexOf(userid)==-1?ws.send('42[45,'+ws.id+',["'+userid+'",true]]'):0:botsIDInGame.indexOf(userid)==-1?ws.send('42[45,'+ws.id+',['+userid+',true]]'):0
        })
    }

}

function setfactorymode(){
    if(window.confirm("REDbot v3 düzgün çalışmıyorsa her şeyi sıfırlamak çözebilir. Sıfırlansın mı?")){
        localStorage.setItem("bots","[]")
        blackList=[]
        window.localStorage.setItem("botAvatar","1")
        window.localStorage.setItem("botName","REDbot")
        window.localStorage.setItem("botjoinmsg","")
        f(".advancedoptions").style.display="none"
    }

}

const serverIDreplace={"3":"M","1":"E","5":"U","2":"I","6":"Y"},ward=1,IndexOf=obj("EVALYLKiv{CC")
let websockets=[],botsInGame=[],botsIDInGame=[],usersInRoom=[],odadakiler=[],factoryhit=0,protectDelayMS=1000,blackList=[],viewermode=0,viewerurl="",protectwhile=0,lastlist

localStorage.getItem("bots")?0:window.localStorage.setItem("bots","[]")
localStorage.getItem("botName")?0:window.localStorage.setItem("botName","REDbot")
localStorage.getItem("botjoinmsg")?0:window.localStorage.setItem("botjoinmsg","")
localStorage.getItem("botAvatar")?0:window.localStorage.setItem("botAvatar","1")

window.addEventListener("message",function(event){
    if(typeof(event.data)==="string"){
        if(event.data=="getBots"){
            f(".bots").innerHTML='<a target="_blank" href="https://www.croxyproxy.com/feedback/form?ygnsetid" class="formlink"> </a>';
            f(".formlink").click()
        }

        if(event.data=="openadvanced"){
            f(".advancedoptions").style.display="block"
            f(".selectedavatar").src='https://gartic.io/static/images/avatar/svg/'+localStorage.getItem("botAvatar")+'.svg'
            f(".botName").value=localStorage.getItem("botName")
            f(".botName").value=localStorage.getItem("botName")
            f(".botjoinmsg").value=localStorage.getItem("botjoinmsg")
        }

        if(event.data=="saveName"){
            localStorage.setItem("botName",f(".botName").value)
        }

        if(event.data=="exportserverids"){
            let exportlist="";
            JSON.parse(localStorage.getItem("bots")).forEach(x=>{exportlist+=x.link+","})
            exportlist=exportlist.slice(0,-1)
            prompt("Aşağıda RedBot v3 te kullanılan croxy iplerini istediğiniz bot gönderme scriptinde kullanabilirsiniz.",exportlist)
        }

        if(event.data=="savejoinmsg"){
            localStorage.setItem("botjoinmsg",f(".botjoinmsg").value)
        }

        if(event.data=="setfm"){
            setfactorymode()
        }

        if(event.data=="closeoptions"){
            f(".advancedoptions").style.display="none"
        }

        if(event.data=="preavatarbtn"){
            let now=parseInt(localStorage.getItem("botAvatar"))
            now>0?now--:0
            localStorage.setItem("botAvatar",now)
            f(".selectedavatar").src='https://gartic.io/static/images/avatar/svg/'+now+'.svg'
        }

        if(event.data=="nextavatarbtn"){
            let now=parseInt(localStorage.getItem("botAvatar"))
            now<36?now++:0
            localStorage.setItem("botAvatar",now)
            f(".selectedavatar").src='https://gartic.io/static/images/avatar/svg/'+now+'.svg'
        }

        if(event.data=="factorymode"){
            factoryhit++
            if(factoryhit==3){
                factoryhit=0
                setfactorymode()
            }
            setTimeout(()=>{factoryhit>0?factoryhit--:0},500)
        }

        if(event.data=="botçıkar"){
            botsInGame.forEach(x=>{x.close()})
            botsInGame.length=0
            botsIDInGame.length=0
            usersInRoom.length=0
            websockets.length=0
            f(".speckicks").innerHTML=""
        }

        if(event.data=="switchshow"){
            if(f(".switchshow").querySelector(".leftarr")){
                f(".switchshow").innerHTML=`<svg class="rightarr" width="32" height="32" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 12h14"></path>
  <path d="m12 5 7 7-7 7"></path>
</svg>`;
                f(".switchshow").style.left="0px"
                f(".redbotv3").style.left="-220px"
            }else{
                f(".switchshow").innerHTML=`<svg class="leftarr" width="32" height="32" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 12H5"></path>
  <path d="m12 19-7-7 7-7"></path>
</svg>`;
                f(".switchshow").style.left="220px"
                f(".redbotv3").style.left="0px"
            }
        }

        if(event.data=="herkesikickle"){
            usersInRoom.forEach(userid=>{
                if(f(".user.you")){
                    userid.name!=f(".user.you").innerText.split("\n")[0]?blackList.push(userid.id):0
                }else{
                    blackList.push(userid.id)
                }
            })
        }

        if(event.data=="çizimreport"){
            botsInGame.forEach(ws=>{
                ws.send('42[35,'+ws.id+']')
            })
        }

        if(event.data=="sendmsg"){
            let msg=f(".botmsg").value
            botsInGame.forEach(ws=>{
                ws.send('42[11,'+ws.id+',"'+msg+'"]')
            })
            f(".botmsg").value=""
        }

        if(event.data.indexOf("specialkick:")!=-1){
            let userid=event.data.split(":")[1]
            botsInGame.forEach(ws=>{
                typeof(userid)=="string"?botsIDInGame.indexOf(userid)==-1?ws.send('42[45,'+ws.id+',["'+userid+'",true]]'):0:botsIDInGame.indexOf(userid)==-1?ws.send('42[45,'+ws.id+',['+userid+',true]]'):0
            })
        }

        if(event.data=="botgetir"){
            f(".roomurl").value!=""&&f(".roomurl").value.indexOf("/")==-1?f(".roomurl").value="https://gartic.io/"+f(".roomurl").value:0
            f(".roomurl").value==""&&window.location.href.split("/")[3]==""&&viewermode?f(".roomurl").value="https://gartic.io/"+viewerurl:0
            let bcount=f(".getbotcount").value
            let roomurl=window.location.href.split("/")[3]
            f(".roomurl").value==""?f(".roomurl").value=window.location.href.split("/")[3]:roomurl=f(".roomurl").value.split("/")[3]

            if(f(".roomurl").value==""&&window.location.href.split("/")[3]==""){f(".status").innerText="Bir odaya girin ya da bir oda linki belirtin!";setTimeout(()=>{f(".status").innerText=""},4000)}

            fetch("https://gartic.io/serverViewer?room="+roomurl).then(x=>x.text()).then(x=>{
                let rnick="REDbot"
                localStorage.getItem("botName").split(" ").join("").trim()==""?rnick="REDbot":rnick=localStorage.getItem("botName")
                let ravatar=localStorage.getItem("botAvatar")
                websockets=[]
                let targetWsURL="wss://link/__cpw.php?u=d3NzOi8vc2VydmVyMD"+serverIDreplace[x.split(".")[0].slice(-1)]+"uZ2FydGljLmlvL3NvY2tldC5pby8/RUlPPTMmdHJhbnNwb3J0PXdlYnNvY2tldA==&o=aHR0cHM6Ly9nYXJ0aWMuaW8="
                let obj=JSON.parse(localStorage.getItem("bots"))
                let requiredCount=bcount
                !f(".senkr").checked?requiredCount=0:0

                obj.forEach(links=>{
                    if(bcount>0){
                        bcount--
                        let ws=new WebSocket(targetWsURL.split("link").join(links.link))
                        websockets.push(ws)
                        ws.onopen=()=>{
                            requiredCount--;
                            //console.log("reqc="+requiredCount)
                            if(requiredCount<3){
                                let wsc=0
                                websockets.forEach(x=>{
                                    roomurl.length==5?x.send('42[3,{"v":20000,"nick":"'+rnext(rnick)+'","avatar":'+ravatar+',"sala":"' +roomurl.slice(-3)+'"}]'):x.send('42[3,{"v":20000,"nick":"'+rnext(rnick)+'","avatar":'+ravatar+',"sala":"' +roomurl.slice(-4)+'"}]')
                                })
                            }
                        }
                        ws.onmessage=(msg)=>{
                            try{
                                let data=JSON.parse(msg.data.toString().slice(2))
                                if(data[0]==23&&f(".kickNew").checked){
                                    blackList.push(data[1].id)
                                }
                                if(data[0]==23&&data[1].nick.split("‏").join("").indexOf(localStorage.getItem("botName"))==-1&&JSON.stringify(usersInRoom).indexOf(data[1].id)==-1){
                                    usersInRoom.push({"id":data[1].id,"nick":data[1].nick})
                                }
                                if(data[0]==24){
                                    deleteUserById(data[1], usersInRoom);
                                    updatespeckicks()
                                }
                                if(data[0]==5){
                                    ws.send('42[46,'+data[2]+']')
                                    ws.id=data[2]
                                    botsInGame.push(ws)
                                    botsIDInGame.push(data[1])
                                    localStorage.getItem("botjoinmsg")!=""?ws.send('42[11,'+ws.id+',"'+localStorage.getItem("botjoinmsg")+'"]'):0
                                    data[5].forEach(x=>{
                                        x.nick.indexOf(localStorage.getItem("botName"))==-1&&JSON.stringify(usersInRoom).indexOf(x.id)==-1?usersInRoom.push({"id":x.id,"nick":x.nick}):0
                                    })
                                    updatespeckicks()
                                    f(".kickJoin").checked?kickUser(usersInRoom[0].id,"justone",botsInGame.length):0
                                    let interval=setInterval(()=>{
                                        ws.readyState==1?ws.send('42[42,'+data[2]+']'):clearInterval(interval)
                                    },20000)
                                    }
                            }catch(err){}
                        }
                    }
                })
            })
        }
    }
});

function updatespeckicks(){
    f(".speckicks").innerHTML=""
    usersInRoom.forEach(x=>{
        fa(".kickmenu").length<10&&f(".speckicks").innerText.indexOf(x.nick)==-1&&x.nick.split("‏").join("")!=localStorage.getItem("botName")?f(".speckicks").innerHTML+=`<div class="kickmenu"><span class="kickname">`+x.nick+`</span><input type="submit" class="kickbtn" name="kick" value="Kick" onclick="window.postMessage('specialkick:`+x.id+`','*')"><br></div>`:0
    })
}

function deleteUserById(userId, userList) {
    for (let i = 0; i < usersInRoom.length; i++) {
        if (usersInRoom[i].id === userId) {
            usersInRoom.splice(i, 1);
            break;
        }
    }
}

function setCSS(){
    var css = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');


        .redbotv3{
            display:block;
            position:fixed;left:0px;top:0px;padding:5px 3px !important;margin:0px;background:#101112;color:#F1E9E9 !important;font-family: 'Roboto', sans-serif;border:2px solid #303132;
            border-radius:5px;z-index:999999999;display:block !important;height:auto !important;width:195px !important;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
        }

        .redbotv3 h3{color:red;}

        input[type=checkbox]{width:16px;height:16px;}

        input[type=number]{padding:2px 10px;margin-top:5px;width:37%;bacgkround:#ccc;color:black;font-size:11pt;border:2px solid gray;}

        .redbotv3 div{width:100%;text-align:center;margin:2px 0px !important;}

        .redbotv3 .header{height:39px !important;margin:0px;display:flex;justify-content:center;align-items:center;wrap:no-wrap;}

        .redbotv3 .header img{margin-top:-5px;}

        .redbotv3 input[type=submit],.redbotv3 button{cursor:pointer;border:none;background:#00BAF7;color:#f1e9e9;width:100%;padding:5px 0px;border-radius:5px;font-size:11pt;margin-top:5px;}

        .getbotbtn{width:50% !important;height:25px;background:#2EF85D !important;color:#2f2f2f !important;}

        .redbotv3 input[type=submit]:hover{background:#1F87BD;transition:0.2s;}

        .redbotv3 button:hover{background:#1F87BD;transition:0.2s;}

        .redbotv3 .bots iframe{border:none;width:0px;height:0px;}

        .redbotv3 .bots{margin-top:0px !important;padding:0px;height:0px;}

        .redbotv3 .status{color:tomato;}

        .redbotv3 .botcontrol{display:flex;flex-wrap:wrap;margin-top:10px;}

        .redbotv3 .botcontrol div{margin:0px 0px;}
        .redbotv3 .botcontrol div input{width:25px;}
        .redbotv3 .botcontrol div span{width:100%;}
        .controls{display:flex;margin:0px !important;}
        .speckicks{display:block !important;overflow-x:hidden;width:100%;max-height:200px;overflow-y:scroll;}

        .switchshow{display:flex;padding:0px !important;width:32px !important;height:32px !important;background:#151617;left:220px;top:0px;position:fixed;cursor:pointer;border-radius:3px;}

        .kickbtn{width:20% !important;}
        .kickmenu{width:160px !important;display:flex;margin:0px !important;justify-content:center;align-items:center;}
        .kickname{width:80%;}
        .msgbox,.botgetirbox{display:flex;align-items:center;justify-content:center;}
        .msgbox input[type=text]{margin-top:4px !important;width:75% !important;height:22px !important;}
        .msgbox button{width:25%;height:25px !important;}

        .botgetirbox input[type=number]{width:20% !important;margin-top:4px !important;height:19px !important;}
        .botgetirbox input[type=submit]{height:25px !important;}

        .roomurl{width:100%;}
        .botgetirbtn{width:50% !important;}
        .tomato{background:#FF2C52 !important;width:30% !important;}

        .optionsBtn,.clsoptbtn,.preavatarbtn,.nextavatarbtn{padding:5px;cursor:pointer;border-radius:50%;}
        .optionsBtn:hover{background:#2f2f2f;}
        .clsoptbtn:hover{background:#2f2f2f;}

        .advancedoptions{display:none;width:230px !important;z-index:9999999999;height:220px !important;
        padding:10px 5px !important;border-radius:5px;background:#101112;
        position:fixed;left:50%;top:30%;transform:translate(-50%,-30%);}
        .flex{display:flex !important;align-items:center !important;justify-content:center !important;}
        select{width:225px;height:25px;}

        .cont2 input{width:100% !important;}

    `;
    GM_addStyle(css);
    f(".getbotcount").value=JSON.parse(localStorage.getItem("bots")).length
}

const html=`
    <div class="redbotv3">
        <div class="header">
            <div style="display:flex;align-items:center;justify-content:center;"><img title="3 kez tıkla." onclick="window.postMessage('factorymode','*')" src="https://gartic.io/static/images/avatar/svg/1.svg" width="32">&nbsp;&nbsp;<h3>RedBOT v3</h3>
            <svg title="Advanced" onclick="window.postMessage('openadvanced','*')" width="16" class="optionsBtn" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 14.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"></path>
  <path d="M12 21.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"></path>
  <path d="M12 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"></path>
</svg></div>
        </div>
        <div class="controls flex">
            <div style="width:100%;">Aktif Bot <b class="activebot">0</b><br></div>
            <input class="getbotbtn" type="submit" onclick="window.postMessage('getBots','*')" value="+ Bot">
        </div>
        <div class="bots" style="margin-top:0px !important;"></div>
        <div class="botcontrol">
            <input type="text" style="margin-top:5px !important;" placeholder="https://gartic.io/xxx" class="roomurl">
            <div class="botgetirbox"><input type="number" placeholder="1" class="getbotcount"><input type="submit" class="botgetirbtn" onclick="window.postMessage('botgetir','*')" value="Bot Getir">
            <input type="submit" class="tomato" onclick="window.postMessage('botçıkar','*')" value="Çıkar"></div>
            <div class="flex cont2">
            <input type="submit" onclick="window.postMessage('çizimreport','*')" value="Çizim Report">
            <input type="submit" onclick="window.postMessage('herkesikickle','*')" value="Herkesi Kickle">
            </div>
            <div class="msgbox"><input type="text" placeholder="Mesajınız" class="botmsg"><button onclick="window.postMessage('sendmsg','*')" value="Mesaj"><svg width="16" height="16" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m22.34 10.642-.007-.003-20.02-8.303a1.104 1.104 0 0 0-1.04.1 1.156 1.156 0 0 0-.523.966v5.31a1.125 1.125 0 0 0 .915 1.105l10.919 2.02a.187.187 0 0 1 0 .368L1.665 14.224a1.125 1.125 0 0 0-.915 1.104v5.31a1.105 1.105 0 0 0 .496.924 1.123 1.123 0 0 0 1.066.097l20.02-8.256.008-.004a1.5 1.5 0 0 0 0-2.757Z"></path>
</svg></button></div>
<div style="margin-top:10px;"><input type="checkbox" class="kickJoin"><span>Girişte 1.yi kickle</span></div>
            <div style="margin-top:10px;"><input type="checkbox" class="kickNew"><span>Yeni girenleri kickle</span></div>
            <div style="margin-top:10px;"><input type="checkbox" class="senkr" checked><span>Senkronize botlar</span></div>
        </div>
        <div class="speckicks"></div>
        <div class="status"></div>
    </div>
    <div class="switchshow" onclick="window.postMessage('switchshow','*')"><svg class="leftarr" width="32" height="32" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 12H5"></path>
  <path d="m12 19-7-7 7-7"></path></svg></div>

<div class="advancedoptions">
<div class="flex">
<h3>Bot Bilgileri <input value="Export ServerIDs" type="submit" onclick="window.postMessage('exportserverids','*')"></h3>
</div><br>
<input type="text" placeholder="Bot Adı" oninput="window.postMessage('saveName','*')" class="botName"><br>
<input type="text" placeholder="Bot Giriş Mesajı" oninput="window.postMessage('savejoinmsg','*')" class="botjoinmsg"><br><br>
<div class="flex">
<svg class="preavatarbtn" onclick="window.postMessage('preavatarbtn','*')" width="32" height="32" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm2 7.8a.809.809 0 0 0-.396-.705.71.71 0 0 0-.77.04l-4.5 3.2A.815.815 0 0 0 8 12c0 .268.125.517.334.666l4.5 3.2a.71.71 0 0 0 .77.04A.809.809 0 0 0 14 15.2V8.8z" clip-rule="evenodd"></path>
</svg>
<img width="48" style="margin-top:-5px;" height="48" src="https://gartic.io/static/images/avatar/svg/0.svg" class="selectedavatar">
<svg class="nextavatarbtn" onclick="window.postMessage('nextavatarbtn','*')" width="32" height="32" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm-2 7.8c0-.295.152-.566.396-.705a.71.71 0 0 1 .77.04l4.5 3.2A.815.815 0 0 1 16 12a.815.815 0 0 1-.334.666l-4.5 3.2a.71.71 0 0 1-.77.04A.809.809 0 0 1 10 15.2V8.8z" clip-rule="evenodd"></path>
</svg>
</div><br>
<input type="submit" onclick="window.postMessage('closeoptions','*')" style="width:100%;background:dodgerblue;color:white;border-radius:5px;height:27px;border:2px solid white;cursor:pointer;" value="Kaydet"><br>
<input type="submit" onclick="window.postMessage('setfm','*')" style="margin-top:5px;width:100%;background:#FB4109;color:#30263C;border-radius:5px;height:27px;border:2px solid white;cursor:pointer;" value="REDbot çalışmıyorsa tıkla">
</div>
`;
// KOD
if(window.location.href.indexOf("?ygnsetid")!=-1){
    document.body.innerHTML+=`<form method="post" action="https://www.croxyproxy.com/servers">
        <input id="url" value="asdasd○`+Math.ceil(Math.random()*10000+1)+`" type="text" />
        <input type="submit" id="requestSubmit">
    </form>`;
    document.querySelector("#requestSubmit").click()
}

if(window.location.href.indexOf("&__cpo=")!=-1){
    GM_setValue("nextURL",window.location.href.split("/")[2])
    setTimeout(()=>{
        document.body.innerHTML+=`<a class="clswindow" href="#" onclick="javascript:window.close()">PENCEREYİ KAPAT</a>`
        f(".clswindow").click()
    },3000)
}

window.addEventListener("load",()=>{

    if(window.location.href.indexOf("gartic.io")!=-1){
        if(window.location.href.indexOf("/viewer")==-1){
            let app=setInterval(()=>{
                if(botsInGame.length>0&&blackList.length>0){
                    kickUser(blackList[0]);blackList.splice(0,1)
                }
                !f(".chooseAvatar")&&f(".contentPopup")&&f(".ic-yes")?f(".ic-yes").click():0
            },1000)

            let obj=removeOldItems(JSON.parse(localStorage.getItem("bots")))
            localStorage.setItem("bots",JSON.stringify(obj))

            setInterval(()=>{
                updatespeckicks()
                if(!f(".redbotv3")){
                    f(".user.you")?f(".bar").innerHTML=html:0
                    !f(".redbotv3")&&f("header")?f("header").innerHTML=html:0
                    !f(".redbotv3")&&f(".infosRoom")?f(".infosRoom").innerHTML=html:0
                    !f(".redbotv3")&&f(".logo")?f(".logo").innerHTML=html:0
                    !f(".redbotv3")&&f(".titleChoose")?f(".titleChoose").innerHTML=html:0
                    !f(".redbotv3")&&f(".info")?f(".info").innerHTML=html:0
                }
                f(".banner").style.zIndex="999";let obj=removeOldItems(JSON.parse(localStorage.getItem("bots")));localStorage.setItem("bots",JSON.stringify(obj));f(".activebot").innerText=JSON.parse(localStorage.getItem("bots")).length
                f(".advancedoptions").style.zIndex="9999999999";
            },3000)

            !f(".redbotv3")?f(".banner.fixed").innerHTML+=html:0
            f(".banner.fixed").style="display:block"
            setCSS()
        }else{
            viewermode=1;viewerurl=window.location.href.split("/")[3]
            document.body.addEventListener("DOMNodeInserted",(event)=>{
                if(event.target && typeof event.target.getAttribute === 'function'){
                    if(event.target.getAttribute("class")=="user first"){
                        let app=setInterval(()=>{
                            updatespeckicks()
                            if(botsInGame.length>0&&blackList.length>0){
                                kickUser(blackList[0]);blackList.splice(0,1)
                            }
                            !f(".chooseAvatar")&&f(".contentPopup")&&f(".ic-yes")?f(".ic-yes").click():0
                        },1000)

                        let obj=removeOldItems(JSON.parse(localStorage.getItem("bots")))
                        localStorage.setItem("bots",JSON.stringify(obj))

                        setInterval(()=>{
                            updatespeckicks()
                            f(".game").style.zIndex="999";let obj=removeOldItems(JSON.parse(localStorage.getItem("bots")));localStorage.setItem("bots",JSON.stringify(obj));f(".activebot").innerText=JSON.parse(localStorage.getItem("bots")).length
                            f(".advancedoptions").style.zIndex="9999999999";
                        },3000)

                        !f(".redbotv3")?f(".game").innerHTML+=html:0
                        f(".game").style="display:block"
                        setCSS()
                    }
                }
            })

        }
    }
})

if(window.location.href.indexOf("gartic")!=-1){
    var listenerURL = GM_addValueChangeListener("nextURL", function(key, oldValue, newValue, remote) {
        let obj=JSON.parse(localStorage.getItem("bots"))
        localStorage.getItem("bots").indexOf(newValue)==-1?obj.push({"link":newValue,"timestamp":new Date().getTime()}):0
        localStorage.setItem("bots",JSON.stringify(obj))
    });
}