// ==UserScript==
// @name         YGN REDBOT V4.7
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  gartic io hack script
// @author       YGN
// @match        https://gartic.io/*
// @match        https://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @match        https://*/*?ko=s&__cpo=aHR0cHM6Ly9zdGFydC5kdWNrZHVja2dvLmNvbQ
// @match        https://www.croxyproxy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513343/YGN%20REDBOT%20V47.user.js
// @updateURL https://update.greasyfork.org/scripts/513343/YGN%20REDBOT%20V47.meta.js
// ==/UserScript==

console.log("ygn redbot v4.7 running.")

function bc(ygn,i){return i==undefined?document.getElementsByClassName(ygn):document.getElementsByClassName(ygn)[i]}
function bt(ygn,i){return i==undefined?document.getElementsByTagName(ygn):document.getElementsByTagName(ygn)[i]}
function bi(ygn){return document.getElementById(ygn)}
function setconf(key,val){let data=JSON.parse(localStorage.getItem("rbconf"));data[key]=val;localStorage.setItem("rbconf",JSON.stringify(data))}
function getconf(key){return JSON.parse(localStorage.getItem("rbconf"))[key]}
function rbcmd(obj){let data=obj;let allconf=JSON.parse(localStorage.getItem("rbconf"));data.randint=Math.random()*10000;let merged=Object.assign({},data,allconf);GM_setValue("rbcmd",JSON.stringify(merged))}

if(window.location.href.indexOf("ygnnext")>-1){sessionStorage.setItem("ygnnext",window.location.href.split("ygnnext=")[1]);document.getElementsByClassName('fa fa-arrow-right')[0].dispatchEvent(new MouseEvent("click",{bubbles:true,button:0}))}
if(window.location.href.indexOf("servers")!=-1){let inter=setInterval(function(){if(document.querySelector("input[name=proxyServerId]")){document.body.innerHTML+=`<form class="myform" method="POST" action="/requests?fso="><input type="hidden" name="url" value="https://gartic.io"><input type="hidden" name="proxyServerId" value="`+sessionStorage.getItem("ygnnext")+`"><input type="hidden" name="csrf" value="`+document.querySelector("input[name=csrf]").value+`"><input type="hidden" name="demo" value="0"><input type="hidden" name="frontOrigin" value="https://www.croxyproxy.com"></form>`;document.querySelector(".myform").submit();clearInterval(inter)}})}
if(window.location.href.indexOf("_cpo=aHR0cHM6Ly9zdGFydC5kdWNrZHVja2dvLmNvbQ")>-1){window.location.href="https://"+window.location.href.split("/")[2]+"/?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8"}
window.location.href.indexOf("51.")>-1?window.close():0

if(window.location.href.indexOf("gartic.io")>-1){ //main control
    let roomusers=[],reftime,refinter,refcc,prem=300
    const proxylist=[{"id":"43","ip":"108.181.21.229"},{"id":"44","ip":"108.181.33.135"},{"id":"45","ip":"108.181.33.117"},{"id":"46","ip":"108.181.33.119"},{"id":"47","ip":"108.181.34.57"},{"id":"48","ip":"108.181.34.71"},{"id":"49","ip":"108.181.30.85"},{"id":"50","ip":"108.181.34.149"},{"id":"51","ip":"108.181.32.49"},{"id":"52","ip":"108.181.32.73"},{"id":"53","ip":"108.181.32.55"},{"id":"54","ip":"108.181.32.61"},{"id":"56","ip":"108.181.32.59"},{"id":"63","ip":"108.181.43.67"},{"id":"64","ip":"108.181.34.45"},{"id":"68","ip":"108.181.24.243"},{"id":"69","ip":"108.181.34.177"},{"id":"92","ip":"108.181.34.157"},{"id":"144","ip":"195.3.223.166"},{"id":"145","ip":"195.3.223.164"},{"id":"146","ip":"146.19.24.89"},{"id":"149","ip":"195.3.222.15"},{"id":"150","ip":"185.16.39.161"},{"id":"154","ip":"95.214.53.145"},{"id":"157","ip":"95.214.53.152"},{"id":"161","ip":"108.181.8.179"},{"id":"162","ip":"108.181.9.39"},{"id":"163","ip":"108.181.11.39"},{"id":"164","ip":"108.181.6.89"},{"id":"172","ip":"208.87.240.203"},{"id":"173","ip":"208.87.240.219"},{"id":"174","ip":"208.87.240.251"},{"id":"176","ip":"208.87.241.149"},{"id":"177","ip":"108.181.4.237"},{"id":"175","ip":"108.181.4.237"},{"id":"178","ip":"208.87.241.209"},{"id":"179","ip":"108.181.4.241"},{"id":"181","ip":"208.87.240.35"},{"id":"182","ip":"108.181.5.29"},{"id":"180","ip":"208.87.242.233"},{"id":"183","ip":"208.87.242.233"},{"id":"184","ip":"208.87.240.67"},{"id":"185","ip":"95.214.53.48"},{"id":"186","ip":"195.3.222.40"},{"id":"187","ip":"185.225.191.49"},{"id":"189","ip":"185.225.191.57"},{"id":"198","ip":"108.181.11.173"},{"id":"199","ip":"108.181.11.193"},{"id":"200","ip":"108.181.11.137"},{"id":"201","ip":"108.181.11.171"},{"id":"202","ip":"108.181.11.175"},{"id":"203","ip":"185.16.39.144"},{"id":"204","ip":"185.16.39.213"},{"id":"205","ip":"178.211.139.238"},{"id":"216","ip":"185.246.84.18"},{"id":"219","ip":"185.246.84.66"}]
    localStorage.getItem("rbconf")==undefined?localStorage.setItem("rbconf",'{"server":"","cc":"","readybotsc":0,"rejoin":1,"syncjoin":1,"kickonjoin":0,"kickjoined":0,"joinmsg":"","proxyc":0,"activebotsc":0,"botname":"","roomlink":"","botavatar":0}'):0

    window.addEventListener("message",function(msg){
        msg.data[0]=="@"?rbcmd({"c":"skick","from":"main","id":msg.data.split("@")[1]}):0
    })

    function startrefinter(){
        refcc=0
        refinter=setInterval(function(){
            refcc++;
            refcc%10==0?rbcmd({"c":"chat","from":"main","chatdata":"redbot"+Math.ceil(Math.random()*10000)}):0
            bc("reftime",0).innerText=refcc+"/"+prem+" sec. then bots'll leave"
            if(refcc>(prem-1)){bc("leavebtnhtml",0).click();}
        },1000)
    }

    function sethtml(){
        let rbcontainer=`
    <div class="rbcontainer">
    redbot v4.7 <input class="resetbtnhtml" type="submit" value=" reset "><br>
    <span>active bots: <b class="activebotschtml">0</b>&nbsp;<input class="addbothtml" type="submit" value=" + "></span><br>
    <input class="preavatarbtnhtml" type="submit" value=" ◄ "> <img class="avatarimghtml" width="18" src="https://gartic.io/static/images/avatar/svg/0.svg"> <input class="nextavatarbtnhtml" type="submit" value=" ► "><br>
    <input class="roomlinkinphtml" type="text" placeholder="target room link"><br>
    <input class="botnameinphtml" type="text" placeholder="bot name"><br>
    <input class="joinmsginphtml" type="text" placeholder="join message"><br>
    <label><input class="syncjoinchckhtml" type="checkbox">sync join <span class="syncjoinviewhtml">(0/0)</span></label>&nbsp;<label><input class="rejoinchckhtml" type="checkbox">rejoin</label><br>
    <label><input class="kickonjoinchckhtml" type="checkbox">kick first player on join</label><br>
    <label><input class="kickjoinedchckhtml" type="checkbox">kick joined player</label><br>
    <input class="joinbtnhtml jl" type="submit" value=" join ">
    <input class="leavebtnhtml jl" type="submit" value=" leave "><br>
    <span class="reftime">0/`+prem+` sec. then bots'll leave</span><hr>
    <input class="chatmsginphtml roomcontrol" type="text" placeholder="chat"><input class="chatsendbtnhtml" type="submit" value=" send "><br>
    <input class="answermsginphtml roomcontrol" type="text" placeholder="answer"><input class="answersendbtnhtml" type="submit" value=" send "><br>
    <input class="reportbtnhtml" type="submit" value=" report draw "><br>
    <div class="skicks"></div>
    </div>
    <div class="showhide">←</div>
    `
        let style=`
            #background{z-index:999;width:0px;height:0px;position:fixed;left:0px;top:0px;}
            .showhide{z-index:999999999;display:block !important;position:fixed;left:195px;background:black;padding:5px;border-radius:5px;cursor:pointer;}
            .rbcontainer{border-radius:5px;padding:5px;text-align:center;font-family:cursive;background:black;z-index:9999999;display:block !important;position:fixed;left:0px;top:0px;}
            .rbcontainer *{text-align:center;font-size:11pt !important;box-sizing:border-box;border-radius:5px;}
            .rbcontainer input[type=text],.rbcontainer input[type=submit]{height:23px;}
            .roomcontrol{width:135px !important;}.reportbtnhtml{width:100%;}.jl{width:47%;}
            .skicks{display:flex;flex-wrap:wrap;max-width:188px;max-height:150px;overflow-y:auto;}
            .reftime{font-size:8pt !important;}.joincont{width:50%}
        `

        bi("background").innerHTML+=rbcontainer;GM_addStyle(style);setconf("readybotsc",0)

        bc("botnameinphtml",0).value=getconf("botname")
        bc("roomlinkinphtml",0).value=getconf("roomlink")
        bc("joinmsginphtml",0).value=getconf("joinmsg")
        bc("avatarimghtml",0).src="https://gartic.io/static/images/avatar/svg/"+getconf("botavatar")+".svg"
        bc("kickonjoinchckhtml",0).checked=getconf("kickonjoin")
        bc("kickjoinedchckhtml",0).checked=getconf("kickjoined")
        bc("syncjoinchckhtml",0).checked=getconf("syncjoin")
        bc("rejoinchckhtml",0).checked=getconf("rejoin")

        bc("addbothtml",0).addEventListener("click",function(){let url="https://www.croxyproxy.com/?ygnnext="+proxylist[getconf("proxyc")].id;window.open(url,"_blank");setconf("proxyc",getconf("proxyc")+1);getconf("proxyc")>55?setconf("proxyc",0):0;})
        bc("resetbtnhtml",0).addEventListener("click",function(){if(confirm("redbot 4.7 reset?")){rbcmd({"c":"reset","from":"main"});}else{alert("cancelled")}})
        bc("preavatarbtnhtml",0).addEventListener("click",function(){setconf("botavatar",getconf("botavatar")-1);getconf("botavatar")<0?setconf("botavatar",36):0;bc("avatarimghtml",0).src="https://gartic.io/static/images/avatar/svg/"+getconf("botavatar")+".svg";})
        bc("nextavatarbtnhtml",0).addEventListener("click",function(){setconf("botavatar",getconf("botavatar")+1);getconf("botavatar")>36?setconf("botavatar",0):0;bc("avatarimghtml",0).src="https://gartic.io/static/images/avatar/svg/"+getconf("botavatar")+".svg";})
        bc("roomlinkinphtml",0).addEventListener("input",function(){setconf("roomlink",bc("roomlinkinphtml",0).value)})
        bc("botnameinphtml",0).addEventListener("input",function(){setconf("botname",bc("botnameinphtml",0).value)})
        bc("joinmsginphtml",0).addEventListener("input",function(){setconf("joinmsg",bc("joinmsginphtml",0).value);})
        bc("kickonjoinchckhtml",0).addEventListener("change",function(){setconf("kickonjoin",+bc("kickonjoinchckhtml",0).checked);rbcmd({"c":"updateconf","from":"main"});})
        bc("kickjoinedchckhtml",0).addEventListener("change",function(){setconf("kickjoined",+bc("kickjoinedchckhtml",0).checked);rbcmd({"c":"updateconf","from":"main"});})
        bc("syncjoinchckhtml",0).addEventListener("change",function(){setconf("syncjoin",+bc("syncjoinchckhtml",0).checked);rbcmd({"c":"updateconf","from":"main"});})
        bc("rejoinchckhtml",0).addEventListener("change",function(){setconf("rejoin",+bc("rejoinchckhtml",0).checked);rbcmd({"c":"updateconf","from":"main"});})
        bc("chatsendbtnhtml",0).addEventListener("click",function(){rbcmd({"c":"chat","from":"main","chatdata":bc("chatmsginphtml",0).value});bc("chatmsginphtml",0).value=""})
        bc("answersendbtnhtml",0).addEventListener("click",function(){rbcmd({"c":"answer","from":"main","answerdata":bc("answermsginphtml",0).value});bc("answermsginphtml",0).value=""})
        bc("reportbtnhtml",0).addEventListener("click",function(){rbcmd({"c":"reportdraw","from":"main"})})
        bc("showhide",0).addEventListener("mousedown",function(){if(bc("showhide",0).innerText=="←"){bc("rbcontainer",0).style.left="-999px";bc("showhide",0).style.left="0px";bc("showhide",0).innerText="redbot v4.7 →"}})
        bc("showhide",0).addEventListener("mouseup",function(){if(bc("showhide",0).innerText=="redbot v4.7 →"){bc("rbcontainer",0).style.left="0px";bc("showhide",0).style.left="195px";bc("showhide",0).innerText="←"}})

        bc("joinbtnhtml",0).addEventListener("click",function(){
            if(bc("joinbtnhtml",0).value.indexOf("wait")==-1){
                startrefinter()
                if(bc("botnameinphtml",0).value.trim()==""||bc("roomlinkinphtml",0).value.trim()==""&&getconf("activebotsc")>0){alert("bot name, target room link and least 1 bot required")}else{
                    setconf("activebotsc",0)
                    bc("activebotschtml",0).innerText=0
                    rbcmd({"c":"ping","from":"main"})
                    setconf("readybotsc",0)
                    fetch("https://gartic.io/serverViewer?v3=1&room="+bc("roomlinkinphtml",0).value.split("/")[3]).then(x=>x.text()).then(x=>{
                        let sv=x.split("//")[1].split(".")[0]
                        rbcmd({"c":"preparetojoin","from":"main","serv":sv,"cc":x.split("c=")[1]})
                        let inter=setInterval(function(){
                            if(getconf("readybotsc")>(getconf("activebotsc")-1)){
                                clearInterval(inter)
                                rbcmd({"c":"join","from":"main"})
                                console.log("joinr")
                            }
                        },100);
                    })
                }
            }
        })

        bc("leavebtnhtml",0).addEventListener("click",function(){
            bc("joinbtnhtml",0).value=" wait 5s "
            setTimeout(function(){bc("joinbtnhtml",0).value=" join "},5000)
            clearInterval(refinter);bc("reftime",0).innerText="0/"+prem+" sec. then bots'll leave";roomusers.length=0;bc("skicks",0).innerHTML=``;setconf("readybotsc",0);rbcmd({"c":"leave","from":"main"});bc("syncjoinviewhtml",0).innerText="("+getconf("readybotsc")+"/"+getconf("activebotsc")+")"
        })
    }

    setInterval(function(){
        document.title="main"
        document.getElementById("popUp").style.display=="block"&&document.getElementsByClassName("icYes").length>-1?document.getElementsByClassName("btYellowBig ic-yes")[0].click():0;
        bi("background")&&bc("rbcontainer").length==0?sethtml():0
        getconf("syncjoin")?bc("syncjoinviewhtml",0).innerText="("+getconf("readybotsc")+"/"+getconf("activebotsc")+")":0;
        setconf("activebotsc",0)
        bc("activebotschtml",0).innerText=0
        rbcmd({"c":"ping","from":"main"})
        if(window.location.href=="https://gartic.io/rooms"){
            for(let x of bc("scrollElements",0).getElementsByTagName("a")){if(x.outerHTML.indexOf("roomwatch")==-1){
                x.innerHTML+=`<input class="roomwatch" type="submit" value=" watch " onclick="window.location.href='`+x.href+`/viewer'">`
            }}
        }
    },1000)

    function updateskickmenu(){
        bc("skicks",0).innerHTML=""
        roomusers.forEach(x=>{
            bc("skicks",0).innerHTML+=`<input type="submit" value=" `+x.nick+` " onclick="window.postMessage('@`+x.id+`')">`
        })
    }

    GM_addValueChangeListener("rbcmd",function(a,b,c,d){
        let data=JSON.parse(c)
        if(data.from=="bot"){
            //data.c!="ping"&&data.c!="pong"?console.log(data):0
            if(data.c=="pong"){
                setconf("activebotsc",getconf("activebotsc")+1)
                bc("activebotschtml",0).innerText=getconf("activebotsc")
            }
            if(data.c=="addbotid"){
                data.users.forEach(x=>{JSON.stringify(roomusers).indexOf(x.id)==-1?roomusers.push(x):0})
                updateskickmenu()
            }
            if(data.c=="adduser"){
                JSON.stringify(roomusers).indexOf(data.user.id)==-1?roomusers.push(data.user):0
                updateskickmenu()
            }
            if(data.c=="removeroomuser"){
                let user=data.tid
                for(let i=0;i<roomusers.length;i++){typeof(roomusers[i].id)==='undefined'?0:roomusers[i].id==user?roomusers.splice(i,1):0}
                updateskickmenu()
            }
            if(data.c=="ready"){setconf("readybotsc",getconf("readybotsc")+1);getconf("syncjoin")?bc("syncjoinviewhtml",0).innerText="("+getconf("readybotsc")+"/"+getconf("activebotsc")+")":0;}
        }
    })
}


if(window.location.href.indexOf("_cpo=aHR0cHM6Ly9nYXJ0aWMuaW8")>-1){ //bot control
    let ws,xdata,inter,join=0,inter2,botlist=[],oldepoch=Date.now(),inter4,nick="bot"+Math.ceil(Math.random()*10000)
    setInterval(function(){document.title="bot";/*document.body.innerHTML="redbot v4.7"*/},1000)
    function waitjoin(){
        inter2=setInterval(function(){
            if(join==1){
                clearInterval(inter2)
                ws.send('42[3,{"v":20000,"nick":"'+nick+'","avatar":'+xdata.botavatar+',"platform":0,"sala":"'+xdata.roomlink.split("/")[3].slice(2)+'"}]')
            }
        },10)
    }

    function joinprocess(){
        clearInterval(inter);clearInterval(inter2);clearInterval(inter4)
        fetch("https://"+location.href.split("/")[2]+"/server?check=1&v3=1&room="+xdata.roomlink+"&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8").then(x=>x.text()).then(x=>{
            let wsurl='wss://'+xdata.serv+'.gartic.io/socket.io/?c='+x.split("c=")[1]+'&EIO=3&transport=websocket'
            let wsn="wss://"+location.origin.split("/")[2]+"/__cpw.php?u="+btoa(wsurl)+"&o=aHR0cHM6Ly9nYXJ0aWMuaW8="
            nick=xdata.botname+Math.ceil(Math.random()*10000)
            ws = new WebSocket(wsn)
            ws.onclose=function(){clearInterval(inter);clearInterval(inter2);clearInterval(inter4)}
            ws.onmessage=function(msg){
                if(msg.data=="40"){xdata.syncjoin?waitjoin():ws.send('42[3,{"v":20000,"nick":"'+nick+'","avatar":'+xdata.botavatar+',"platform":0,"sala":"'+xdata.roomlink.split("/")[3].slice(2)+'"}]')}
                if(msg.data.indexOf("42")==0){
                    let obj=JSON.parse(msg.data.slice(2))
                    if(obj[0]=="5"){
                        ws.lid=obj[1]
                        ws.id=obj[2]
                        ws.roomcode=obj[3]
                        ws.users=obj[5]
                        ws.send('42[46,'+ws.id+']')
                        rbcmd({"c":"addbotid","from":"bot","botid":ws.lid,"users":ws.users})
                        rbcmd({"c":"addbotid","from":"main","botid":ws.lid})
                        inter=setInterval(function(){ws.send('42[42,'+ws.id+']');ws.send('2')},30000)
                        inter4=setInterval(function(){fetch("https://"+location.href.split("/")[2]+"/ping?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8");},10000)
                        xdata.joinmsg!=""?ws.send('42[11,'+ws.id+',"'+xdata.joinmsg+'"]'):0
                        if(xdata.kickonjoin){JSON.stringify(botlist).indexOf(ws.users[0].id)==-1?typeof(ws.users[0].id)=="string"?ws.send('42[45,'+ws.id+',["'+ws.users[0].id+'",true]]'):ws.send('42[45,'+ws.id+',['+ws.users[0].id+',true]]'):0}
                    }
                    if(obj[0]=="6"&&xdata.rejoin&&obj[1]!=null){ws=null;fetch("https://"+location.href.split("/")[2]+"/logout?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8").then(x=>{joinprocess()})}
                    if(obj[0]=="23"&&xdata.kickjoined){setTimeout(function(){if(obj[1].id!=ws.lid&&JSON.stringify(botlist).indexOf(obj[1].id)==-1&&Date.now()-oldepoch>1000){oldepoch=Date.now();typeof(obj[1].id)=="string"?ws.send('42[45,'+ws.id+',["'+obj[1].id+'",true]]'):ws.send('42[45,'+ws.id+',['+obj[1].id+',true]]')}},500)}
                    if(obj[0]=="24"){rbcmd({"c":"removeroomuser","tid":obj[1],"from":"bot"})}
                    if(obj[0]=="23"&&JSON.stringify(botlist).indexOf(obj[1].id)==-1){rbcmd({"c":"adduser","from":"bot","user":obj[1]});}
                }
            }
            ws.onopen=function(){rbcmd({"c":"ready","from":"bot"})}
        })
    }

    GM_addValueChangeListener("rbcmd",function(a,b,c,d){
        let data=JSON.parse(c)
        if(data.from=="main"){
            //data.c!="ping"&&data.c!="pong"?console.log(data):0
            if(data.c=="ping"){rbcmd({"c":"pong","from":"bot"});}
            if(data.c=="leave"){botlist.length=0;join=0;ws.send('42[24,'+ws.id+']');ws.close()}
            if(data.c=="addbotid"){JSON.stringify(botlist).indexOf(data.botid)==-1?botlist.push(data.botid):0;}
            if(data.c=="reset"){fetch("https://"+location.href.split("/")[2]+"/logout?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8").then(x=>{window.location.reload()});ws.send('42[24,'+ws.id+']');}
            if(data.c=="preparetojoin"){xdata=data;joinprocess()}
            if(data.c=="updateconf"){xdata=data;}
            if(data.c=="join"){join=1}
            if(data.c=="reportdraw"){ws.send('42[35,'+ws.id+']')}
            if(data.c=="skick"){data.id.length>20?ws.send('42[45,'+ws.id+',["'+data.id+'",true]]'):ws.send('42[45,'+ws.id+',['+data.id+',true]]')}
            if(data.c=="answer"){ws.send('42[13,'+ws.id+',"'+data.answerdata+'"]')}
            if(data.c=="chat"){ws.send('42[11,'+ws.id+',"'+data.chatdata+'"]')}
        }
    })
}

























