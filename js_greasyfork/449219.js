// ==UserScript==
// @name         SHW YGN GARTIC.IO SCRIPT 2022 EDITION
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  SHW YGN GARTIC.IO SCRIPT 2022 EDITION -1.2
// @author       SHW YGN
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449219/SHW%20YGN%20GARTICIO%20SCRIPT%202022%20EDITION.user.js
// @updateURL https://update.greasyfork.org/scripts/449219/SHW%20YGN%20GARTICIO%20SCRIPT%202022%20EDITION.meta.js
// ==/UserScript==

if(window.location.href.indexOf("gartic.io")!=-1||window.location.href.indexOf("_cp")!=-1){
    let url,loop,usertype="admin",lastGM,rand,admin="OYUNDAKİ ADIN",cmd,kbotready=0,t,c,ev,ev2,e,lv,res,i //ADMİN KISMINI OYUNDAKİ ADIN YAP

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

    window.addEventListener("keydown",(event)=>{
        if(window.event.keyCode==27){retry()}
        if(window.event.keyCode==192&&usertype=="admin"){rand=Math.floor(Math.random()*10000+1);localStorage.setItem("cmd", prompt()+"_"+rand)}
    })

    setInterval(()=>{
        if(usertype=="admin"&&f("#chat")&&f(".contentPopup")){
            if(f(".contentPopup").querySelector(".avatar")&&f(".contentPopup").querySelector(".nick")){
                for(let i of f("#users").querySelectorAll(".user")){
                    if(i.querySelector(".nick").innerText==f(".contentPopup").querySelector(".nick").innerText){
                        w("  "+en(i.querySelector(".nick").innerText))
                    }
                }
            }
        }
        if(usertype=="kicklibot"&&f("#chat")&&kbotready==1){
            for(let i of f("#chat").querySelectorAll(".msg")){
                if(i.querySelector("strong").innerText==admin&&i.getAttribute("class").indexOf(" ")==-1){
                    cmd=i.querySelector("span").innerText
                    i.querySelector("span").innerText="YGN"
                    cmd=="r"?f(".denounce").click():0
                    cmd=="q"?retry():0
                    if(cmd.split(" ")[0]==" "){
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
            if(lastGM!=localStorage.getItem("cmd")){
                lastGM=localStorage.getItem("cmd")
                lastGM.split("_")[0]=="r"?f(".denounce").click():0
                lastGM.split("_")[0]=="q"?retry("?bot"):0
            }
        }
        if(document.querySelector(".btYellowBig.ic-yes")){
            document.querySelector(".btYellowBig.ic-yes").click()
            resetchat()
        }
        f(".btYellowBig.ic-playHome")&&f("#popUp").style.display=="none"&&f(".content.join")?f(".btYellowBig.ic-playHome").click():0
    },100)
}