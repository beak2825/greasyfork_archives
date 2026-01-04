// ==UserScript==
// @name         YGN GARTIC.IO SCRIPT 2022 EDITION + PANEL
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  YGN GARTIC.IO SCRIPT 2022 EDITION + BOT CONTROL PANEL
// @author       YGN
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489789/YGN%20GARTICIO%20SCRIPT%202022%20EDITION%20%2B%20PANEL.user.js
// @updateURL https://update.greasyfork.org/scripts/489789/YGN%20GARTICIO%20SCRIPT%202022%20EDITION%20%2B%20PANEL.meta.js
// ==/UserScript==
 
if(window.location.href.indexOf("gartic.io")!=-1||window.location.href.indexOf("_cp")!=-1){
    let url,loop,usertype="admin",lastGM,rand,admin="OYUNDAKİ ADIN",cmd,kbotready=0,t,c,ev,ev2,e,lv,res,i,panel //OYUNDAKİ ADIN YERİNE OYUNDAKİ ADINI YAZ
 
    function f(a){return document.querySelector(a)}
    function fa(a){return document.querySelectorAll(a)}
    function retry(type=""){url=window.location.href+type;f("#exit").click();loop=setInterval(()=>{if(document.querySelector("#nprogress")){clearInterval(loop);loop=setInterval(()=>{if(!document.querySelector("#nprogress")){clearInterval(loop);window.location.href=url}},1)}},1)}
    function resetchat(){setTimeout(()=>{if(f("#chat")){for(let i of fa(".scrollElements")[2].querySelectorAll("span")){i.innerText="YGN"}setTimeout(()=>{kbotready=1},300)}},300)}
    function w(x){e=document.querySelector('input[name="chat"]');lv=e.value;e.value=x;ev=new Event('input',{bubbles:true});ev.simulated=true;t=e._valueTracker;if(t){t.setValue(lv);}e.dispatchEvent(ev);}
    function en(x){res="";for(i in x){res+=String.fromCharCode(x[i].charCodeAt()+1)}return res}
    function de(x){res="";for(i in x){res+=String.fromCharCode(x[i].charCodeAt()-1)}return res}
 
    window.location.href.indexOf("?bot")!=-1?usertype="bot":0
    window.location.href.indexOf("_cp")!=-1?usertype="kicklibot":0
 
    localStorage.setItem("cmd","")
 
    panel=`
<div class="ygnpanel">
<h5 style="text-shadow:3px 3px black;padding-bottom:10px;">&nbsp;YGN</h5>
<div title="Refresh Room" onclick='javascript:window.onbeforeunload=null;window.location.href=window.location.href;'><svg class="ygnbtn" width="25" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 15c-.665 1.64-2.436 3.015-3.966 3.907A8.004 8.004 0 0 1 4.062 13"></path><path d="M20 20v-5h-5"></path><path d="M4 9c.664-1.642 2.436-3.017 3.965-3.91A8.001 8.001 0 0 1 19.938 11"></path><path d="M4 4v5h5"></path></svg></div>
<div title="+1 Normal Bot" onclick="javascript:e=document.createElement('iframe');e.setAttribute('class','cbots');e.setAttribute('src','`+localStorage.getItem("boturl")+`');e.setAttribute('width','0');e.setAttribute('height','0');e.setAttribute('border','0px');document.querySelector('.ygnpanelbots').appendChild(e)"><svg class="ygnbtn" width="25" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><path d="M8.5 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"></path><path d="M20 8v6"></path><path d="M23 11h-6"></path></svg></div>
<div title="-1 Normal Bot" onclick="javascript:document.querySelector('.cbots')?document.querySelector('.cbots').remove():0;"><svg class="ygnbtn" width="25" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><path d="M8.5 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"></path><path d="M23 11h-6"></path></svg></div>
<div title="Kill All Bots" onclick="javascript:document.querySelector('.ygnpanelbots').innerHTML=''"><svg class="ygnbtn" width="25" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><path d="M8.5 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"></path><path d="m18 8 5 5"></path><path d="m23 8-5 5"></path></svg></div>
<div title="Bot Command: Report" onclick="javascript:rand=Math.floor(Math.random()*10000+1);localStorage.setItem('cmd', 'r_'+rand);"><svg class="ygnbtn" width="25" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg></div>
<div title="Minimize" onclick="javascript:document.querySelectorAll('.ygnpanel')[2].style.display='none';document.querySelectorAll('.ygnpanel')[0].style.display='none';"><svg class="ygnbtn" width="25" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 17 7 7"></path><path d="M7 17V7h10"></path></svg></div>
<div class="ygnpanelbots"></div>
</div>
<div class="ygnpanel" style="z-index:5">
<div title="Maximize" onclick="javascript:document.querySelectorAll('.ygnpanel')[2].style.display='block';document.querySelectorAll('.ygnpanel')[0].style.display='block';"><svg class="ygnbtn" width="25" height="25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m7 7 10 10"></path><path d="M17 7v10H7"></path></svg></div>
</div>
`;
 
    GM_addStyle ( `
    .ygnpanel{color:white;font-family:;position:fixed;z-index:9999;left:0px;top:0px;background:#151D3B;padding:5px;border-radius:3px;font-family:arial;box-shadow:3px 3px black;display:block;}
    .ygnbtn{background:#A91079;padding:5px;cursor:pointer;border-radius:3px;box-shadow:3px 3px black;margin-top:5px;}
` );
 
    window.addEventListener("load",()=>{
        if(usertype=="admin"){
            setInterval(()=>{
                if(f(".ctt")&&!f(".ygnpanel")){
                    f(".bar").innerHTML+=panel;
                    f(".info").innerHTML+=panel;
                    $(".ygnpanel").draggable();
                    localStorage.setItem('oldr',window.location.href);
                }
            },500)
        }
    })
 
    window.addEventListener("keydown",(event)=>{
        if(window.event.keyCode==27){retry()}
        if(window.event.keyCode==192&&usertype=="admin"){rand=Math.floor(Math.random()*10000+1);localStorage.setItem("cmd", prompt()+"_"+rand)}
    })
 
    setInterval(()=>{
        if(usertype=="admin"&&f("#chat")&&f(".contentPopup")){
            f(".contentPopup.info")?f(".close").click():0;
            if(f(".contentPopup").querySelector(".avatar")&&f(".contentPopup").querySelector(".nick")){
                for(let i of f("#users").querySelectorAll(".user")){
                    if(i.querySelector(".nick").innerText==f(".contentPopup").querySelector(".nick").innerText){
                        w("k "+en(i.querySelector(".nick").innerText))
                    }
                }
            }
        }
        if(usertype=="kicklibot"&&f("#chat")&&kbotready==1){
            !f(".off")?f("#sounds").click():0;
            f("g")?f("g").remove():0;
            for(let i of f("#chat").querySelectorAll(".msg")){
                if(i.querySelector("strong").innerText==admin&&i.getAttribute("class").indexOf(" ")==-1){
                    cmd=i.querySelector("span").innerText
                    i.querySelector("span").innerText="YGN"
                    cmd=="r"?f(".denounce").click():0
                    cmd=="rr"?retry():0
                    if(cmd.split(" ")[0]=="k"){
                        for(let i of f("#users").querySelectorAll(".user")){
                            if(i.querySelector(".nick").innerText==de(cmd.split(" ")[1])){
                                i.click();
                                f(".btYellowBig.ic-votekick").click();
                            }
                        }
                    }
                }
            }
        }
        if(usertype=="bot"&&f("#chat")){
            !f(".off")?f("#sounds").click():0;
            f("g")?f("g").remove():0;
            if(lastGM!=localStorage.getItem("cmd")){
                lastGM=localStorage.getItem("cmd")
                lastGM.split("_")[0]=="r"?f(".denounce").click():0
                lastGM.split("_")[0]=="rr"?retry("?bot"):0
            }
        }
        if(document.querySelector(".btYellowBig.ic-yes")){
            if(usertype=="admin"){localStorage.setItem("boturl","https://garticbot.tr.gg/?botfromextension="+window.location.href)}
            document.querySelector(".btYellowBig.ic-yes").click()
            resetchat()
        }
        f(".btYellowBig.ic-playHome")&&f("#popUp").style.display=="none"&&f(".content.join")?f(".btYellowBig.ic-playHome").click():0
    },50)
}